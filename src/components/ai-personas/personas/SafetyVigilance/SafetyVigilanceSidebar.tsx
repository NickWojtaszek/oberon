import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Activity, Shield } from 'lucide-react';
import { PersonaSidebar } from '../../ui/PersonaSidebar';
import { Persona } from '../../core/personaTypes';
import { useTranslation } from 'react-i18next';
import { SIDEBAR_WIDTH } from '../../../../lib/uiConstants';
import { usePersona } from '../../core/personaContext';
import type { ValidationContext, ValidationIssue } from '../../../protocol-workbench/types';

interface SafetyVigilanceSidebarProps {
  dataRecords: any[];
  studyType?: string;
  onNavigateToRecord?: (recordId: string) => void;
}

export function SafetyVigilanceSidebar({
  dataRecords,
  studyType,
  onNavigateToRecord
}: SafetyVigilanceSidebarProps) {
  const { persona, validate, isActive } = usePersona('safety-vigilance');
  const [validating, setValidating] = useState(false);
  const [safetyScore, setSafetyScore] = useState<number | null>(null);
  const [safetyMetrics, setSafetyMetrics] = useState<{
    totalAEs: number;
    totalSAEs: number;
    overdueReports: number;
    unresolvedAEs: number;
  } | null>(null);

  // Run validation when data changes
  useEffect(() => {
    if (!isActive || !persona) return;

    const runValidation = async () => {
      setValidating(true);

      const context: ValidationContext = {
        dataRecords,
        studyDesign: {
          type: studyType as any || 'rct',
          isBlinded: false,
          isRandomized: studyType === 'rct'
        }
      };

      const result = await validate(context);
      
      // Calculate safety monitoring score
      if (result) {
        const totalChecks = 30; // Approximate total safety checks
        const criticalCount = result.issues.filter(i => i.severity === 'critical').length;
        const warningCount = result.issues.filter(i => i.severity === 'warning').length;
        
        // Safety score: 100 - (critical * 10) - (warning * 3)
        const score = Math.max(0, 100 - (criticalCount * 10) - (warningCount * 3));
        setSafetyScore(score);

        // Calculate safety metrics
        const aeRecords = dataRecords.filter(r => 
          r.table === 'adverse_events' || 
          r.table === 'serious_adverse_events' ||
          Object.keys(r.data || {}).some(k => k.toLowerCase().includes('adverse'))
        );

        const saeRecords = aeRecords.filter(r => 
          r.data?.is_serious || r.data?.serious || r.table === 'serious_adverse_events'
        );

        const overdueReports = result.issues.filter(i => 
          i.id.includes('overdue') || i.id.includes('expedited')
        ).length;

        const unresolvedAEs = aeRecords.filter(r => {
          const outcome = String(r.data?.outcome || '').toLowerCase();
          return outcome.includes('ongoing') || outcome.includes('not resolved');
        }).length;

        setSafetyMetrics({
          totalAEs: aeRecords.length,
          totalSAEs: saeRecords.length,
          overdueReports,
          unresolvedAEs
        });
      } else {
        setSafetyScore(null);
        setSafetyMetrics(null);
      }

      setValidating(false);
    };

    // Debounce validation
    const timeoutId = setTimeout(runValidation, 300);

    return () => clearTimeout(timeoutId);
  }, [dataRecords, studyType, isActive, persona, validate]);

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

  const getSafetyLevel = (score: number): { text: string; color: string; bg: string; icon: any } => {
    if (score >= 90) {
      return {
        text: 'Excellent Safety Monitoring',
        color: 'text-green-700',
        bg: 'bg-green-50 border-green-200',
        icon: CheckCircle2
      };
    }
    if (score >= 75) {
      return {
        text: 'Good Monitoring',
        color: 'text-blue-700',
        bg: 'bg-blue-50 border-blue-200',
        icon: Activity
      };
    }
    if (score >= 60) {
      return {
        text: 'Needs Attention',
        color: 'text-amber-700',
        bg: 'bg-amber-50 border-amber-200',
        icon: AlertTriangle
      };
    }
    return {
        text: 'Critical Issues',
        color: 'text-red-700',
        bg: 'bg-red-50 border-red-200',
        icon: AlertCircle
      };
  };

  const criticalIssues = getCriticalIssues();
  const warningIssues = getWarningIssues();
  const infoIssues = getInfoIssues();

  const safetyLevel = safetyScore !== null ? getSafetyLevel(safetyScore) : null;
  const SafetyIcon = safetyLevel?.icon;

  // Filter critical issues by type
  const overdueIssues = criticalIssues.filter(i => i.id.includes('overdue'));
  const saeIssues = criticalIssues.filter(i => i.id.includes('sae') || i.id.includes('serious'));
  const missingFieldsIssues = criticalIssues.filter(i => i.id.includes('missing'));

  return (
    <div className={`${SIDEBAR_WIDTH} border-l border-slate-200 bg-white overflow-y-auto flex-shrink-0`}>
      <div className="p-4">
        <PersonaSidebar
          persona={persona}
          validationResult={persona.lastValidation}
          onViewFullReport={() => {
            // Could open full safety report modal
          }}
        >
          {/* Safety Monitoring Score */}
          {safetyScore !== null && safetyLevel && SafetyIcon && (
            <div className={`rounded-lg p-4 mb-4 border ${safetyLevel.bg}`}>
              <div className="flex items-center gap-2 mb-3">
                <SafetyIcon className={`w-5 h-5 ${safetyLevel.color}`} />
                <div className="text-xs font-medium opacity-80">
                  Safety Monitoring Score
                </div>
              </div>
              <div className={`text-3xl font-bold ${safetyLevel.color}`}>
                {safetyScore}
                <span className="text-lg">/100</span>
              </div>
              <div className="mt-2 text-xs opacity-75 font-medium">
                {safetyLevel.text}
              </div>
            </div>
          )}

          {/* Safety Metrics Dashboard */}
          {safetyMetrics && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-700">{safetyMetrics.totalAEs}</div>
                <div className="text-xs text-blue-600 mt-1">Total AEs</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-700">{safetyMetrics.totalSAEs}</div>
                <div className="text-xs text-purple-600 mt-1">SAEs</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-2xl font-bold text-red-700">{safetyMetrics.overdueReports}</div>
                <div className="text-xs text-red-600 mt-1">Overdue Reports</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="text-2xl font-bold text-amber-700">{safetyMetrics.unresolvedAEs}</div>
                <div className="text-xs text-amber-600 mt-1">Unresolved</div>
              </div>
            </div>
          )}

          {/* Overdue SAE Reports */}
          {overdueIssues.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-1.5">
                🚨 Overdue Reports ({overdueIssues.length})
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {overdueIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="bg-white bg-opacity-60 rounded p-2.5 border border-red-300 cursor-pointer hover:bg-opacity-100 transition-all"
                    onClick={() => issue.location?.field && onNavigateToRecord?.(issue.location.field)}
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

          {/* SAE Issues */}
          {saeIssues.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-1.5">
                ⚠️ SAE Issues ({saeIssues.length})
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {saeIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="bg-white bg-opacity-60 rounded p-2.5 border border-red-300 cursor-pointer hover:bg-opacity-100 transition-all"
                    onClick={() => issue.location?.field && onNavigateToRecord?.(issue.location.field)}
                  >
                    <div className="text-xs font-semibold text-red-900 mb-1">
                      {issue.title}
                    </div>
                    {issue.citation && (
                      <div className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded font-mono mb-1.5">
                        📖 {issue.citation}
                      </div>
                    )}
                    <div className="text-xs text-red-800 leading-relaxed">
                      {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Required Fields */}
          {missingFieldsIssues.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-1.5">
                📋 Incomplete AE Records ({missingFieldsIssues.length})
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {missingFieldsIssues.slice(0, 5).map((issue, idx) => (
                  <div
                    key={idx}
                    className="bg-white bg-opacity-60 rounded p-2.5 border border-amber-300 cursor-pointer hover:bg-opacity-100 transition-all"
                    onClick={() => issue.location?.field && onNavigateToRecord?.(issue.location.field)}
                  >
                    <div className="text-xs font-semibold text-amber-900 mb-1">
                      {issue.title}
                    </div>
                    <div className="text-xs text-amber-800 leading-relaxed">
                      {issue.recommendation}
                    </div>
                  </div>
                ))}
                {missingFieldsIssues.length > 5 && (
                  <div className="text-xs text-amber-700 text-center py-1">
                    +{missingFieldsIssues.length - 5} more incomplete records
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Safety Signals */}
          {warningIssues.filter(i => i.id.includes('signal')).length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-orange-900 mb-2 flex items-center gap-1.5">
                🔔 Safety Signals ({warningIssues.filter(i => i.id.includes('signal')).length})
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {warningIssues.filter(i => i.id.includes('signal')).map((issue, idx) => (
                  <div
                    key={idx}
                    className="bg-white bg-opacity-60 rounded p-2.5 border border-orange-300"
                  >
                    <div className="text-xs font-semibold text-orange-900 mb-1">
                      {issue.title}
                    </div>
                    <div className="text-xs text-orange-800 leading-relaxed">
                      {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety Monitoring Checklist */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
            <div className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Safety Monitoring Checklist
            </div>
            <div className="space-y-2">
              <ChecklistItem
                label="AE Required Fields"
                issues={criticalIssues.filter(i => i.id.includes('ae-missing'))}
              />
              <ChecklistItem
                label="SAE Identification"
                issues={criticalIssues.filter(i => i.id.includes('sae-not-flagged'))}
              />
              <ChecklistItem
                label="Expedited Reporting"
                issues={criticalIssues.filter(i => i.id.includes('overdue'))}
              />
              <ChecklistItem
                label="CTCAE Grading"
                issues={warningIssues.filter(i => i.id.includes('ctcae') || i.id.includes('grade'))}
              />
              <ChecklistItem
                label="Causality Assessment"
                issues={warningIssues.filter(i => i.id.includes('causality'))}
              />
              <ChecklistItem
                label="Outcome Documentation"
                issues={warningIssues.filter(i => i.id.includes('outcome'))}
              />
            </div>
          </div>

          {/* Regulatory References */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="text-xs font-medium text-red-900 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Safety Reporting Regulations
            </div>
            <div className="space-y-1.5">
              <div className="text-xs text-red-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-red-600 mt-0.5">•</span>
                <span>ICH E2A: Clinical Safety Data Management</span>
              </div>
              <div className="text-xs text-red-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-red-600 mt-0.5">•</span>
                <span>FDA 21 CFR 312.32: IND Safety Reports</span>
              </div>
              <div className="text-xs text-red-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-red-600 mt-0.5">•</span>
                <span>CTCAE v5.0: Severity Grading</span>
              </div>
              <div className="text-xs text-red-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-red-600 mt-0.5">•</span>
                <span>ICH E2F: Development Safety Update</span>
              </div>
            </div>
          </div>

          {/* Validation Status */}
          {validating && (
            <div className="mt-4 text-xs text-red-600 text-center">
              Validating safety data...
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