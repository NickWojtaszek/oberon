import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, FileText, Shield } from 'lucide-react';
import { PersonaSidebar } from '../../ui/PersonaSidebar';
import { Persona } from '../../core/personaTypes';
import { useTranslation } from 'react-i18next';
import { SIDEBAR_WIDTH } from '../../../../lib/uiConstants';
import { usePersona } from '../../core/personaContext';
import type { ValidationContext, ValidationIssue } from '../../../protocol-workbench/types';

interface IRBComplianceTrackerSidebarProps {
  protocolMetadata: any;
  studyType?: string;
  onNavigateToSection?: (section: string) => void;
}

export function IRBComplianceTrackerSidebar({
  protocolMetadata,
  studyType,
  onNavigateToSection
}: IRBComplianceTrackerSidebarProps) {
  const { persona, validate, isActive } = usePersona('irb-compliance-tracker');
  const [validating, setValidating] = useState(false);
  const [complianceScore, setComplianceScore] = useState<number | null>(null);

  // Run validation when protocol metadata changes
  useEffect(() => {
    if (!isActive || !persona) return;

    const runValidation = async () => {
      setValidating(true);

      const context: ValidationContext = {
        protocolMetadata,
        studyDesign: {
          type: studyType as any || 'rct',
          isBlinded: false,
          isRandomized: studyType === 'rct'
        }
      };

      const result = await validate(context);
      
      // Calculate compliance score
      if (result) {
        const totalChecks = 30; // Approximate total compliance checks
        const criticalCount = result.issues.filter(i => i.severity === 'critical').length;
        const warningCount = result.issues.filter(i => i.severity === 'warning').length;
        
        // Compliance score: 100 - (critical * 5) - (warning * 2)
        const score = Math.max(0, 100 - (criticalCount * 5) - (warningCount * 2));
        setComplianceScore(score);
      } else {
        setComplianceScore(null);
      }

      setValidating(false);
    };

    // Debounce validation
    const timeoutId = setTimeout(runValidation, 300);

    return () => clearTimeout(timeoutId);
  }, [protocolMetadata, studyType, isActive, persona, validate]);

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

  const getComplianceLevel = (score: number): { text: string; color: string; bg: string; icon: any } => {
    if (score >= 95) {
      return {
        text: 'IRB Ready',
        color: 'text-green-700',
        bg: 'bg-green-50 border-green-200',
        icon: CheckCircle2
      };
    }
    if (score >= 80) {
      return {
        text: 'Minor Issues',
        color: 'text-amber-700',
        bg: 'bg-amber-50 border-amber-200',
        icon: AlertTriangle
      };
    }
    return {
      text: 'Needs Work',
      color: 'text-red-700',
      bg: 'bg-red-50 border-red-200',
      icon: AlertCircle
    };
  };

  const criticalIssues = getCriticalIssues();
  const warningIssues = getWarningIssues();
  const infoIssues = getInfoIssues();

  const complianceLevel = complianceScore !== null ? getComplianceLevel(complianceScore) : null;
  const ComplianceIcon = complianceLevel?.icon;

  return (
    <div className={`${SIDEBAR_WIDTH} border-l border-slate-200 bg-white overflow-y-auto flex-shrink-0`}>
      <div className="p-4">
        <PersonaSidebar
          persona={persona}
          validationResult={persona.lastValidation}
          onViewFullReport={() => {
            // Could open full compliance report modal
          }}
        >
          {/* IRB Compliance Score */}
          {complianceScore !== null && complianceLevel && ComplianceIcon && (
            <div className={`rounded-lg p-4 mb-4 border ${complianceLevel.bg}`}>
              <div className="flex items-center gap-2 mb-3">
                <ComplianceIcon className={`w-5 h-5 ${complianceLevel.color}`} />
                <div className="text-xs font-medium opacity-80">
                  IRB Compliance Score
                </div>
              </div>
              <div className={`text-3xl font-bold ${complianceLevel.color}`}>
                {complianceScore}
                <span className="text-lg">/100</span>
              </div>
              <div className="mt-2 text-xs opacity-75 font-medium">
                {complianceLevel.text}
              </div>
            </div>
          )}

          {/* Critical Compliance Issues */}
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

          {/* Compliance Checklist Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Compliance Checklist
            </div>
            <div className="space-y-2">
              <ChecklistItem
                label="Informed Consent (21 CFR 50.25)"
                issues={criticalIssues.filter(i => i.id.includes('consent'))}
              />
              <ChecklistItem
                label="ICH-GCP Protocol Elements"
                issues={criticalIssues.filter(i => i.id.includes('ich-gcp'))}
              />
              <ChecklistItem
                label="IRB Submission Documents"
                issues={criticalIssues.filter(i => i.id.includes('irb-doc'))}
              />
              <ChecklistItem
                label="Vulnerable Population Protections"
                issues={criticalIssues.filter(i => i.id.includes('vulnerable'))}
              />
              <ChecklistItem
                label="Risk-Benefit Assessment"
                issues={warningIssues.filter(i => i.id.includes('risk'))}
              />
              <ChecklistItem
                label="Data Safety Monitoring"
                issues={warningIssues.filter(i => i.id.includes('dsmp') || i.id.includes('stopping'))}
              />
            </div>
          </div>

          {/* Regulatory Citations */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs font-medium text-slate-900 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Regulatory Framework
            </div>
            <div className="space-y-1.5">
              <div className="text-xs text-slate-700 leading-relaxed flex items-start gap-1.5">
                <span className="text-slate-500 mt-0.5">•</span>
                <span>21 CFR 50: Informed Consent</span>
              </div>
              <div className="text-xs text-slate-700 leading-relaxed flex items-start gap-1.5">
                <span className="text-slate-500 mt-0.5">•</span>
                <span>45 CFR 46: Human Subjects Protection</span>
              </div>
              <div className="text-xs text-slate-700 leading-relaxed flex items-start gap-1.5">
                <span className="text-slate-500 mt-0.5">•</span>
                <span>ICH E6 (R2): GCP Guidelines</span>
              </div>
              <div className="text-xs text-slate-700 leading-relaxed flex items-start gap-1.5">
                <span className="text-slate-500 mt-0.5">•</span>
                <span>NIH: Data Safety Monitoring Policy</span>
              </div>
            </div>
          </div>

          {/* Validation Status */}
          {validating && (
            <div className="mt-4 text-xs text-blue-600 text-center">
              Validating compliance...
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
      <span className="text-blue-800">{label}</span>
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