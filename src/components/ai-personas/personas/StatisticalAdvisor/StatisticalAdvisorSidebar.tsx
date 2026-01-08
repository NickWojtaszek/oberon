import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, TrendingUp, Calculator } from 'lucide-react';
import { PersonaSidebar } from '../../ui/PersonaSidebar';
import { Persona } from '../../core/personaTypes';
import { useTranslation } from 'react-i18next';
import { SIDEBAR_WIDTH } from '../../../../lib/uiConstants';
import { usePersona } from '../../core/personaContext';
import type { SchemaBlock, ValidationContext, ValidationIssue } from '../../../protocol-workbench/types';

interface StatisticalAdvisorSidebarProps {
  statisticalManifest: any;
  studyType?: string;
  onNavigateToSection?: (section: string) => void;
}

export function StatisticalAdvisorSidebar({
  statisticalManifest,
  studyType,
  onNavigateToSection
}: StatisticalAdvisorSidebarProps) {
  const { persona, validate, isActive } = usePersona('statistical-advisor');
  const [validating, setValidating] = useState(false);
  const [statisticalRigor, setStatisticalRigor] = useState<number | null>(null);

  // Run validation when manifest changes
  useEffect(() => {
    if (!isActive || !persona) return;

    const runValidation = async () => {
      setValidating(true);

      const context: ValidationContext = {
        statisticalManifest,
        studyDesign: {
          type: studyType as any || 'rct',
          isBlinded: false,
          isRandomized: studyType === 'rct'
        }
      };

      const result = await validate(context);
      
      // Calculate statistical rigor score
      if (result) {
        const totalChecks = 20; // Approximate total statistical checks
        const criticalCount = result.issues.filter(i => i.severity === 'critical').length;
        const warningCount = result.issues.filter(i => i.severity === 'warning').length;
        
        // Rigor score: 100 - (critical * 8) - (warning * 3)
        const score = Math.max(0, 100 - (criticalCount * 8) - (warningCount * 3));
        setStatisticalRigor(score);
      } else {
        setStatisticalRigor(null);
      }

      setValidating(false);
    };

    // Debounce validation
    const timeoutId = setTimeout(runValidation, 500);

    return () => clearTimeout(timeoutId);
  }, [statisticalManifest, studyType, isActive, persona, validate]);

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

  const getRigorLevel = (score: number): { text: string; color: string; bg: string; icon: any } => {
    if (score >= 90) {
      return {
        text: 'Publication Ready',
        color: 'text-green-700',
        bg: 'bg-green-50 border-green-200',
        icon: CheckCircle2
      };
    }
    if (score >= 75) {
      return {
        text: 'Good Foundation',
        color: 'text-blue-700',
        bg: 'bg-blue-50 border-blue-200',
        icon: TrendingUp
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
        text: 'Major Gaps',
        color: 'text-red-700',
        bg: 'bg-red-50 border-red-200',
        icon: AlertCircle
      };
  };

  const criticalIssues = getCriticalIssues();
  const warningIssues = getWarningIssues();
  const infoIssues = getInfoIssues();

  const rigorLevel = statisticalRigor !== null ? getRigorLevel(statisticalRigor) : null;
  const RigorIcon = rigorLevel?.icon;

  return (
    <div className={`${SIDEBAR_WIDTH} border-l border-slate-200 bg-white overflow-y-auto flex-shrink-0`}>
      <div className="p-4">
        <PersonaSidebar
          persona={persona}
          validationResult={persona.lastValidation}
          onViewFullReport={() => {
            // Could open full statistical report modal
          }}
        >
          {/* Statistical Rigor Score */}
          {statisticalRigor !== null && rigorLevel && RigorIcon && (
            <div className={`rounded-lg p-4 mb-4 border ${rigorLevel.bg}`}>
              <div className="flex items-center gap-2 mb-3">
                <RigorIcon className={`w-5 h-5 ${rigorLevel.color}`} />
                <div className="text-xs font-medium opacity-80">
                  Statistical Rigor Score
                </div>
              </div>
              <div className={`text-3xl font-bold ${rigorLevel.color}`}>
                {statisticalRigor}
                <span className="text-lg">/100</span>
              </div>
              <div className="mt-2 text-xs opacity-75 font-medium">
                {rigorLevel.text}
              </div>
            </div>
          )}

          {/* Critical Statistical Issues */}
          {criticalIssues.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-1.5">
                🚨 Critical Issues ({criticalIssues.length})
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {criticalIssues.map((issue, idx) => (
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

          {/* Warnings */}
          {warningIssues.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-1.5">
                ⚠️ Recommendations ({warningIssues.length})
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {warningIssues.slice(0, 5).map((issue, idx) => (
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
                {warningIssues.length > 5 && (
                  <div className="text-xs text-amber-700 text-center py-1">
                    +{warningIssues.length - 5} more recommendations
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Best Practices */}
          {infoIssues.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-1.5">
                💡 Best Practices ({infoIssues.length})
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {infoIssues.slice(0, 3).map((issue, idx) => (
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

          {/* Statistical Checklist */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
            <div className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Analysis Plan Checklist
            </div>
            <div className="space-y-2">
              <ChecklistItem
                label="Sample Size & Power"
                issues={criticalIssues.filter(i => i.id.includes('sample-size') || i.id.includes('power'))}
              />
              <ChecklistItem
                label="Primary Endpoint"
                issues={criticalIssues.filter(i => i.id.includes('primary-endpoint'))}
              />
              <ChecklistItem
                label="Statistical Method"
                issues={criticalIssues.filter(i => i.id.includes('analysis-method'))}
              />
              <ChecklistItem
                label="Multiplicity Control"
                issues={warningIssues.filter(i => i.id.includes('multiplicity'))}
              />
              <ChecklistItem
                label="Missing Data Strategy"
                issues={warningIssues.filter(i => i.id.includes('missing-data'))}
              />
              <ChecklistItem
                label="Study-Type Specific"
                issues={[...criticalIssues, ...warningIssues].filter(i => 
                  i.id.includes('rct-') || i.id.includes('obs-') || i.id.includes('diagnostic-') || i.id.includes('survival-')
                )}
              />
            </div>
          </div>

          {/* Statistical Standards Reference */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-xs font-medium text-green-900 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Statistical Guidelines
            </div>
            <div className="space-y-1.5">
              <div className="text-xs text-green-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-green-600 mt-0.5">•</span>
                <span>ICH E9: Statistical Principles for Clinical Trials</span>
              </div>
              <div className="text-xs text-green-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-green-600 mt-0.5">•</span>
                <span>ICH E9 (R1) Addendum: Estimands</span>
              </div>
              <div className="text-xs text-green-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-green-600 mt-0.5">•</span>
                <span>CONSORT: RCT Reporting Standards</span>
              </div>
              <div className="text-xs text-green-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-green-600 mt-0.5">•</span>
                <span>STROBE: Observational Study Reporting</span>
              </div>
              <div className="text-xs text-green-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-green-600 mt-0.5">•</span>
                <span>STARD: Diagnostic Accuracy Reporting</span>
              </div>
            </div>
          </div>

          {/* Validation Status */}
          {validating && (
            <div className="mt-4 text-xs text-green-600 text-center">
              Validating analysis plan...
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