import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Target, Award } from 'lucide-react';
import { PersonaSidebar } from '../../ui/PersonaSidebar';
import { Persona } from '../../core/personaTypes';
import { useTranslation } from 'react-i18next';
import { SIDEBAR_WIDTH } from '../../../../lib/uiConstants';
import { usePersona } from '../../core/personaContext';
import type { SchemaBlock, ValidationContext, ValidationIssue } from '../../../protocol-workbench/types';

interface EndpointValidatorSidebarProps {
  protocolDocument: any;
  studyType?: string;
  onNavigateToSection?: (section: string) => void;
}

export function EndpointValidatorSidebar({
  protocolDocument,
  studyType,
  onNavigateToSection
}: EndpointValidatorSidebarProps) {
  const { persona, validate, isActive } = usePersona('endpoint-validator');
  const [validating, setValidating] = useState(false);
  const [endpointQuality, setEndpointQuality] = useState<number | null>(null);

  // Run validation when protocol document changes
  useEffect(() => {
    if (!isActive || !persona) return;

    const runValidation = async () => {
      setValidating(true);

      const context: ValidationContext = {
        protocolDocument,
        studyDesign: {
          type: studyType as any || 'rct',
          isBlinded: false,
          isRandomized: studyType === 'rct'
        }
      };

      const result = await validate(context);
      
      // Calculate endpoint quality score
      if (result) {
        const totalChecks = 15; // Approximate total endpoint checks
        const criticalCount = result.issues.filter(i => i.severity === 'critical').length;
        const warningCount = result.issues.filter(i => i.severity === 'warning').length;
        
        // Quality score: 100 - (critical * 12) - (warning * 4)
        const score = Math.max(0, 100 - (criticalCount * 12) - (warningCount * 4));
        setEndpointQuality(score);
      } else {
        setEndpointQuality(null);
      }

      setValidating(false);
    };

    // Debounce validation
    const timeoutId = setTimeout(runValidation, 500);

    return () => clearTimeout(timeoutId);
  }, [protocolDocument, studyType, isActive, persona, validate]);

  if (!isActive || !persona) {
    return null;
  }

  const getCriticalIssues = (): ValidationIssue[] => {
    if (!persona.lastValidation) return [];
    return persona.lastValidation.issues.filter(i => i.severity === 'critical');
  };

  const getWarningIssues = (): ValidationIssue[] => {
    if (!persona.lastValidation) return [];
    return persona.lastValidation.issues.filter(i => i.severity === 'warning');
  };

  const getInfoIssues = (): ValidationIssue[] => {
    if (!persona.lastValidation) return [];
    return persona.lastValidation.issues.filter(i => i.severity === 'info');
  };

  const getQualityLevel = (score: number): { text: string; color: string; bg: string; icon: any } => {
    if (score >= 90) {
      return {
        text: 'Regulatory Grade',
        color: 'text-green-700',
        bg: 'bg-green-50 border-green-200',
        icon: Award
      };
    }
    if (score >= 75) {
      return {
        text: 'Well-Defined',
        color: 'text-blue-700',
        bg: 'bg-blue-50 border-blue-200',
        icon: Target
      };
    }
    if (score >= 60) {
      return {
        text: 'Needs Refinement',
        color: 'text-amber-700',
        bg: 'bg-amber-50 border-amber-200',
        icon: AlertTriangle
      };
    }
    return {
        text: 'Incomplete Definition',
        color: 'text-red-700',
        bg: 'bg-red-50 border-red-200',
        icon: AlertCircle
      };
  };

  const criticalIssues = getCriticalIssues();
  const warningIssues = getWarningIssues();
  const infoIssues = getInfoIssues();

  const qualityLevel = endpointQuality !== null ? getQualityLevel(endpointQuality) : null;
  const QualityIcon = qualityLevel?.icon;

  // Categorize issues
  const primaryEndpointIssues = criticalIssues.filter(i => i.id.includes('primary'));
  const secondaryEndpointIssues = [...criticalIssues, ...warningIssues].filter(i => i.id.includes('secondary'));
  const compositeIssues = warningIssues.filter(i => i.id.includes('composite'));
  const surrogateIssues = warningIssues.filter(i => i.id.includes('surrogate'));
  const proIssues = warningIssues.filter(i => i.id.includes('pro'));

  return (
    <div className={`${SIDEBAR_WIDTH} border-l border-slate-200 bg-white overflow-y-auto flex-shrink-0`}>
      <div className="p-4">
        <PersonaSidebar
          persona={persona}
          validationResult={persona.lastValidation}
          onViewFullReport={() => {
            // Could open full endpoint validation report modal
          }}
        >
          {/* Endpoint Quality Score */}
          {endpointQuality !== null && qualityLevel && QualityIcon && (
            <div className={`rounded-lg p-4 mb-4 border ${qualityLevel.bg}`}>
              <div className="flex items-center gap-2 mb-3">
                <QualityIcon className={`w-5 h-5 ${qualityLevel.color}`} />
                <div className="text-xs font-medium opacity-80">
                  Endpoint Quality Score
                </div>
              </div>
              <div className={`text-3xl font-bold ${qualityLevel.color}`}>
                {endpointQuality}
                <span className="text-lg">/100</span>
              </div>
              <div className="mt-2 text-xs opacity-75 font-medium">
                {qualityLevel.text}
              </div>
            </div>
          )}

          {/* Primary Endpoint Issues */}
          {primaryEndpointIssues.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-1.5">
                🎯 Primary Endpoint ({primaryEndpointIssues.length} issues)
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {primaryEndpointIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="bg-white bg-opacity-60 rounded p-2.5 border border-red-300 cursor-pointer hover:bg-opacity-100 transition-all"
                    onClick={() => issue.location?.field && onNavigateToSection?.(issue.location.field)}
                  >
                    <div className="text-xs font-semibold text-red-900 mb-1.5">
                      {issue.title}
                    </div>
                    <div className="text-xs text-red-800 leading-relaxed mb-2">
                      {issue.description}
                    </div>
                    {issue.citation && (
                      <div className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded font-mono mb-2">
                        📖 {issue.citation}
                      </div>
                    )}
                    <div className="text-xs text-red-700 leading-relaxed italic">
                      ✓ {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Secondary Endpoints */}
          {secondaryEndpointIssues.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-1.5">
                📊 Secondary Endpoints ({secondaryEndpointIssues.length})
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {secondaryEndpointIssues.slice(0, 5).map((issue, idx) => (
                  <div
                    key={idx}
                    className="bg-white bg-opacity-60 rounded p-2.5 border border-amber-300 cursor-pointer hover:bg-opacity-100 transition-all"
                    onClick={() => issue.location?.field && onNavigateToSection?.(issue.location.field)}
                  >
                    <div className="text-xs font-semibold text-amber-900 mb-1">
                      {issue.title}
                    </div>
                    {issue.citation && (
                      <div className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded font-mono mb-1.5">
                        📖 {issue.citation}
                      </div>
                    )}
                    <div className="text-xs text-amber-800 leading-relaxed">
                      {issue.recommendation}
                    </div>
                  </div>
                ))}
                {secondaryEndpointIssues.length > 5 && (
                  <div className="text-xs text-amber-700 text-center py-1">
                    +{secondaryEndpointIssues.length - 5} more issues
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Composite Endpoints */}
          {compositeIssues.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-1.5">
                🔗 Composite Endpoints ({compositeIssues.length})
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {compositeIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="bg-white bg-opacity-60 rounded p-2.5 border border-purple-300"
                  >
                    <div className="text-xs font-semibold text-purple-900 mb-1">
                      {issue.title}
                    </div>
                    <div className="text-xs text-purple-800 leading-relaxed">
                      {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Surrogate Endpoints */}
          {surrogateIssues.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-1.5">
                🧬 Surrogate Endpoints ({surrogateIssues.length})
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {surrogateIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="bg-white bg-opacity-60 rounded p-2.5 border border-blue-300"
                  >
                    <div className="text-xs font-semibold text-blue-900 mb-1">
                      {issue.title}
                    </div>
                    <div className="text-xs text-blue-800 leading-relaxed">
                      {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Patient-Reported Outcomes */}
          {proIssues.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-indigo-900 mb-2 flex items-center gap-1.5">
                👤 Patient-Reported Outcomes ({proIssues.length})
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {proIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="bg-white bg-opacity-60 rounded p-2.5 border border-indigo-300"
                  >
                    <div className="text-xs font-semibold text-indigo-900 mb-1">
                      {issue.title}
                    </div>
                    <div className="text-xs text-indigo-800 leading-relaxed">
                      {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Best Practices */}
          {infoIssues.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                💡 Best Practices ({infoIssues.length})
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {infoIssues.slice(0, 3).map((issue, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded p-2.5 border border-slate-300"
                  >
                    <div className="text-xs font-semibold text-slate-900 mb-1">
                      {issue.title}
                    </div>
                    <div className="text-xs text-slate-800 leading-relaxed">
                      {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Endpoint Validation Checklist */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Endpoint Validation Checklist
            </div>
            <div className="space-y-2">
              <ChecklistItem
                label="Primary Endpoint"
                issues={primaryEndpointIssues}
              />
              <ChecklistItem
                label="Secondary Endpoints"
                issues={secondaryEndpointIssues}
              />
              <ChecklistItem
                label="Composite Endpoints"
                issues={compositeIssues}
              />
              <ChecklistItem
                label="Surrogate Validation"
                issues={surrogateIssues}
              />
              <ChecklistItem
                label="PRO Instruments"
                issues={proIssues}
              />
              <ChecklistItem
                label="Objective Alignment"
                issues={[...criticalIssues, ...warningIssues].filter(i => 
                  i.id.includes('objective') || i.id.includes('alignment')
                )}
              />
            </div>
          </div>

          {/* Regulatory References */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-xs font-medium text-blue-900 mb-2 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Endpoint Guidelines
            </div>
            <div className="space-y-1.5">
              <div className="text-xs text-blue-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>ICH E9: Endpoint Definition & Selection</span>
              </div>
              <div className="text-xs text-blue-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>FDA: Clinical Trial Endpoints Guidance</span>
              </div>
              <div className="text-xs text-blue-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>FDA: Patient-Reported Outcomes (PRO)</span>
              </div>
              <div className="text-xs text-blue-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>FDA: Surrogate Endpoint Development</span>
              </div>
              <div className="text-xs text-blue-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>STARD: Diagnostic Study Endpoints</span>
              </div>
            </div>
          </div>

          {/* Validation Status */}
          {validating && (
            <div className="mt-4 text-xs text-blue-600 text-center">
              Validating endpoints...
            </div>
          )}
        </PersonaSidebar>
      </div>
    </div>
  );
}

// Helper component for checklist items
function ChecklistItem({ label, issues }: { label: string; issues: ValidationIssue[] }) {
  const hasIssues = issues.length > 0;
  
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-800">{label}</span>
      {hasIssues ? (
        <div className="flex items-center gap-1 text-red-600">
          <AlertCircle className="w-3 h-3" />
          <span className="font-semibold">{issues.length}</span>
        </div>
      ) : (
        <CheckCircle2 className="w-4 h-4 text-green-600" />
      )}
    </div>
  );
}