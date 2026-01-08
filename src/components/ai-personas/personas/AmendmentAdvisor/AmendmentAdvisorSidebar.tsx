import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, FileEdit, Clock, FileText } from 'lucide-react';
import { PersonaSidebar } from '../../ui/PersonaSidebar';
import { Persona } from '../../core/personaTypes';
import { useTranslation } from 'react-i18next';
import { SIDEBAR_WIDTH } from '../../../../lib/uiConstants';
import { usePersona } from '../../core/personaContext';
import type { ValidationContext, ValidationIssue } from '../../../protocol-workbench/types';

interface AmendmentAdvisorSidebarProps {
  amendment?: any; // Amendment metadata
  protocolDocument?: any;
  studyType?: string;
  dataCollection?: any;
  onNavigateToSection?: (section: string) => void;
}

export function AmendmentAdvisorSidebar({
  amendment,
  protocolDocument,
  studyType,
  dataCollection,
  onNavigateToSection
}: AmendmentAdvisorSidebarProps) {
  const { persona, validate, isActive } = usePersona('amendment-advisor');
  const [validating, setValidating] = useState(false);
  const [amendmentRiskLevel, setAmendmentRiskLevel] = useState<string | null>(null);

  // Run validation when amendment data changes
  useEffect(() => {
    if (!isActive || !persona || !amendment) return;

    const runValidation = async () => {
      setValidating(true);

      const context: ValidationContext = {
        amendment,
        protocolDocument,
        dataCollection,
        studyDesign: {
          type: studyType as any || 'rct',
          isBlinded: false,
          isRandomized: studyType === 'rct'
        }
      };

      const result = await validate(context);
      
      // Determine amendment risk level
      if (result) {
        const criticalCount = result.issues.filter(i => i.severity === 'critical').length;
        
        if (criticalCount >= 3) {
          setAmendmentRiskLevel('High Risk - Substantial Amendment');
        } else if (criticalCount > 0) {
          setAmendmentRiskLevel('Moderate Risk - Full IRB Review');
        } else {
          setAmendmentRiskLevel('Low Risk - Expedited Review Possible');
        }
      } else {
        setAmendmentRiskLevel(null);
      }

      setValidating(false);
    };

    const timeoutId = setTimeout(runValidation, 500);
    return () => clearTimeout(timeoutId);
  }, [amendment, protocolDocument, dataCollection, studyType, isActive, persona, validate]);

  if (!isActive || !persona) {
    return null;
  }

  // If no amendment in progress, show informational state
  if (!amendment) {
    return (
      <div className={`${SIDEBAR_WIDTH} border-l border-slate-200 bg-white overflow-y-auto flex-shrink-0`}>
        <div className="p-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileEdit className="w-5 h-5 text-blue-600" />
              <div className="font-semibold text-blue-900">Amendment Advisor</div>
            </div>
            <div className="text-sm text-blue-800 leading-relaxed">
              No protocol amendment in progress. This persona will activate when you:
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Create a new protocol amendment</li>
                <li>Modify protocol elements</li>
                <li>Update study parameters</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
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

  const criticalIssues = getCriticalIssues();
  const warningIssues = getWarningIssues();
  const infoIssues = getInfoIssues();

  // Categorize issues
  const classificationIssues = [...criticalIssues, ...warningIssues].filter(i => 
    i.id.includes('classification')
  );
  const endpointIssues = [...criticalIssues, ...warningIssues].filter(i => 
    i.id.includes('endpoint')
  );
  const eligibilityIssues = [...criticalIssues, ...warningIssues].filter(i => 
    i.id.includes('eligibility')
  );
  const sampleSizeIssues = [...criticalIssues, ...warningIssues].filter(i => 
    i.id.includes('sample-size')
  );
  const consentIssues = criticalIssues.filter(i => 
    i.id.includes('consent')
  );
  const timelineIssues = warningIssues.filter(i => 
    i.id.includes('timeline') || i.id.includes('submission')
  );
  const dmsIssues = warningIssues.filter(i => 
    i.id.includes('dms')
  );

  return (
    <div className={`${SIDEBAR_WIDTH} border-l border-slate-200 bg-white overflow-y-auto flex-shrink-0`}>
      <div className="p-4">
        <PersonaSidebar
          persona={persona}
          validationResult={persona.lastValidation}
          onViewFullReport={() => {
            // Could open full amendment impact report
          }}
        >
          {/* Amendment Risk Level */}
          {amendmentRiskLevel && (
            <div className={`rounded-lg p-4 mb-4 border ${
              amendmentRiskLevel.includes('High') 
                ? 'bg-red-50 border-red-200'
                : amendmentRiskLevel.includes('Moderate')
                ? 'bg-amber-50 border-amber-200'
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={`w-5 h-5 ${
                  amendmentRiskLevel.includes('High') 
                    ? 'text-red-600'
                    : amendmentRiskLevel.includes('Moderate')
                    ? 'text-amber-600'
                    : 'text-green-600'
                }`} />
                <div className="text-xs font-medium opacity-80">
                  Amendment Risk Assessment
                </div>
              </div>
              <div className={`text-lg font-bold ${
                amendmentRiskLevel.includes('High') 
                  ? 'text-red-700'
                  : amendmentRiskLevel.includes('Moderate')
                  ? 'text-amber-700'
                  : 'text-green-700'
              }`}>
                {amendmentRiskLevel}
              </div>
            </div>
          )}

          {/* Amendment Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <FileEdit className="w-4 h-4" />
              Amendment Status
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-800">Classification:</span>
                <span className={`px-2 py-1 rounded font-semibold ${
                  amendment.classification === 'substantial'
                    ? 'bg-red-100 text-red-700'
                    : amendment.classification === 'non-substantial'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {amendment.classification || 'Not Set'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-800">Changes:</span>
                <span className="font-semibold text-blue-900">
                  {amendment.changes?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-800">Status:</span>
                <span className={`px-2 py-1 rounded font-semibold ${
                  amendment.status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : amendment.status === 'pending-approval'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {amendment.status || 'Draft'}
                </span>
              </div>
            </div>
          </div>

          {/* Classification Issues */}
          {classificationIssues.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-1.5">
                ⚠️ Classification Issues ({classificationIssues.length})
              </div>
              <div className="space-y-2">
                {classificationIssues.map((issue, idx) => (
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

          {/* Re-Consent Requirements */}
          {consentIssues.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-1.5">
                📝 Re-Consent Required ({consentIssues.length})
              </div>
              <div className="space-y-2">
                {consentIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="bg-white bg-opacity-60 rounded p-2.5 border border-purple-300"
                  >
                    <div className="text-xs font-semibold text-purple-900 mb-1">
                      {issue.title}
                    </div>
                    {issue.citation && (
                      <div className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded font-mono mb-1.5">
                        📖 {issue.citation}
                      </div>
                    )}
                    <div className="text-xs text-purple-800 leading-relaxed">
                      {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Endpoint Changes */}
          {endpointIssues.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-1.5">
                🎯 Endpoint Changes ({endpointIssues.length})
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {endpointIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="bg-white bg-opacity-60 rounded p-2.5 border border-amber-300"
                  >
                    <div className="text-xs font-semibold text-amber-900 mb-1">
                      {issue.title}
                    </div>
                    <div className="text-xs text-amber-800 leading-relaxed">
                      {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eligibility & Sample Size Changes */}
          {(eligibilityIssues.length > 0 || sampleSizeIssues.length > 0) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-1.5">
                📊 Population Changes ({eligibilityIssues.length + sampleSizeIssues.length})
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {[...eligibilityIssues, ...sampleSizeIssues].map((issue, idx) => (
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

          {/* Timeline & Submission */}
          {timelineIssues.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-indigo-900 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Timeline & Submission ({timelineIssues.length})
              </div>
              <div className="space-y-2">
                {timelineIssues.map((issue, idx) => (
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

          {/* Data Management Impact */}
          {dmsIssues.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-green-900 mb-2 flex items-center gap-1.5">
                💾 Database Updates ({dmsIssues.length})
              </div>
              <div className="space-y-2">
                {dmsIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="bg-white bg-opacity-60 rounded p-2.5 border border-green-300"
                  >
                    <div className="text-xs font-semibold text-green-900 mb-1">
                      {issue.title}
                    </div>
                    <div className="text-xs text-green-800 leading-relaxed">
                      {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Publication Transparency */}
          {infoIssues.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                📢 Publication & Transparency ({infoIssues.length})
              </div>
              <div className="space-y-2">
                {infoIssues.map((issue, idx) => (
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

          {/* Amendment Checklist */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Amendment Checklist
            </div>
            <div className="space-y-2">
              <ChecklistItem
                label="Classification Determined"
                issues={classificationIssues}
              />
              <ChecklistItem
                label="Re-Consent Plan"
                issues={consentIssues}
              />
              <ChecklistItem
                label="Endpoint Changes Addressed"
                issues={endpointIssues}
              />
              <ChecklistItem
                label="Population Changes Justified"
                issues={[...eligibilityIssues, ...sampleSizeIssues]}
              />
              <ChecklistItem
                label="Timeline Documented"
                issues={timelineIssues}
              />
              <ChecklistItem
                label="Database Updates Planned"
                issues={dmsIssues}
              />
            </div>
          </div>

          {/* Regulatory References */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-xs font-medium text-blue-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Amendment Guidelines
            </div>
            <div className="space-y-1.5">
              <div className="text-xs text-blue-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>ICH E6(R2): Protocol Amendments</span>
              </div>
              <div className="text-xs text-blue-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>21 CFR 312.30: IND Amendments</span>
              </div>
              <div className="text-xs text-blue-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>ICMJE: Publication Transparency</span>
              </div>
              <div className="text-xs text-blue-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>FDAAA 801: Registry Updates</span>
              </div>
            </div>
          </div>

          {/* Validation Status */}
          {validating && (
            <div className="mt-4 text-xs text-blue-600 text-center">
              Analyzing amendment impact...
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
          <AlertTriangle className="w-3 h-3" />
          <span className="font-semibold">{issues.length}</span>
        </div>
      ) : (
        <CheckCircle2 className="w-4 h-4 text-green-600" />
      )}
    </div>
  );
}