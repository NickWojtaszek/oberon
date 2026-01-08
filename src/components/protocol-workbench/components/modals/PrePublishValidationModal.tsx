import { Shield, XCircle, AlertTriangle, CheckCircle2, X, ExternalLink, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ProtocolAuditResult } from '../../auditTypes';

interface PrePublishValidationModalProps {
  auditResult: ProtocolAuditResult;
  onClose: () => void;
  onConfirm: () => void;
  onViewAuditDetails: () => void;
}

export function PrePublishValidationModal({
  auditResult,
  onClose,
  onConfirm,
  onViewAuditDetails
}: PrePublishValidationModalProps) {
  const { t } = useTranslation('ui');
  const hasBlockingIssues = !auditResult.canPublish;
  const hasWarnings = auditResult.warningCount > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          hasBlockingIssues 
            ? 'bg-red-50 border-red-200' 
            : hasWarnings 
              ? 'bg-amber-50 border-amber-200' 
              : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center gap-3">
            {hasBlockingIssues ? (
              <XCircle className="w-6 h-6 text-red-600" />
            ) : hasWarnings ? (
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            )}
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {hasBlockingIssues 
                  ? t('protocolWorkbench.prePublishModal.cannotPublish')
                  : hasWarnings 
                    ? t('protocolWorkbench.prePublishModal.reviewRequired')
                    : t('protocolWorkbench.prePublishModal.readyToPublish')
                }
              </h2>
              <p className="text-sm text-slate-600">{t('protocolWorkbench.prePublishModal.validationComplete')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Compliance Score */}
          <div className={`mb-6 p-6 rounded-xl border-2 ${
            auditResult.canPublish 
              ? 'bg-green-50 border-green-300' 
              : 'bg-red-50 border-red-300'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-slate-600 mb-1">{t('protocolWorkbench.prePublishModal.complianceScore')}</div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-bold ${
                    auditResult.complianceScore >= 90 ? 'text-green-600' :
                    auditResult.complianceScore >= 70 ? 'text-blue-600' :
                    auditResult.complianceScore >= 50 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {auditResult.complianceScore}
                  </span>
                  <span className="text-lg text-slate-600">/ 100</span>
                </div>
              </div>
              <div className="text-right">
                {auditResult.canPublish ? (
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">{t('protocolWorkbench.prePublishModal.validationPassed')}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-700">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">{t('protocolWorkbench.prePublishModal.validationFailed')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Issue Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-3 border border-red-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-red-900 font-medium">{t('protocolWorkbench.prePublishModal.critical')}</span>
                  <span className="text-2xl font-bold text-red-600">{auditResult.criticalCount}</span>
                </div>
                <div className="text-xs text-red-700">{t('protocolWorkbench.prePublishModal.mustResolve')}</div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-amber-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-amber-900 font-medium">{t('protocolWorkbench.prePublishModal.warnings')}</span>
                  <span className="text-2xl font-bold text-amber-600">{auditResult.warningCount}</span>
                </div>
                <div className="text-xs text-amber-700">{t('protocolWorkbench.prePublishModal.reviewNeeded')}</div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-blue-900 font-medium">{t('protocolWorkbench.prePublishModal.info')}</span>
                  <span className="text-2xl font-bold text-blue-600">{auditResult.infoCount}</span>
                </div>
                <div className="text-xs text-blue-700">{t('protocolWorkbench.prePublishModal.suggestions')}</div>
              </div>
            </div>
          </div>

          {/* Blocking Issues */}
          {hasBlockingIssues && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Cannot Proceed with Publication</h3>
                  <p className="text-sm text-red-800">
                    The following critical issues must be resolved before publishing:
                  </p>
                </div>
              </div>
              <ul className="space-y-2 ml-8">
                {auditResult.blockedReasons.map((reason, idx) => (
                  <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Critical Issues Preview */}
          {auditResult.criticalCount > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Critical Issues:</h3>
              <div className="space-y-2">
                {[
                  ...auditResult.protocolTextIssues,
                  ...auditResult.schemaIssues,
                  ...auditResult.dependencyIssues,
                  ...auditResult.crossValidationIssues,
                  ...auditResult.regulatoryIssues
                ]
                  .filter(i => i.severity === 'critical')
                  .slice(0, 5)
                  .map(issue => (
                    <div key={issue.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-red-900 text-sm">{issue.title}</div>
                          <div className="text-xs text-red-700 mt-1">{issue.description}</div>
                          <div className="text-xs text-red-600 mt-1">
                            Location: <strong>{issue.location.tab}</strong>
                            {issue.location.sectionName && ` → ${issue.location.sectionName}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {auditResult.criticalCount > 5 && (
                  <div className="text-sm text-slate-600 text-center">
                    ... and {auditResult.criticalCount - 5} more critical issues
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Warning Issues Preview */}
          {hasWarnings && !hasBlockingIssues && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Warnings to Review:</h3>
              <div className="space-y-2">
                {[
                  ...auditResult.protocolTextIssues,
                  ...auditResult.schemaIssues,
                  ...auditResult.dependencyIssues,
                  ...auditResult.crossValidationIssues,
                  ...auditResult.regulatoryIssues
                ]
                  .filter(i => i.severity === 'warning')
                  .slice(0, 3)
                  .map(issue => (
                    <div key={issue.id} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-amber-900 text-sm">{issue.title}</div>
                          <div className="text-xs text-amber-700 mt-1">{issue.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                {auditResult.warningCount > 3 && (
                  <div className="text-sm text-slate-600 text-center">
                    ... and {auditResult.warningCount - 3} more warnings
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PI Approval Note */}
          {!hasBlockingIssues && hasWarnings && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">PI Approval Required</h4>
                  <p className="text-sm text-blue-800">
                    While these warnings don't block publication, Principal Investigator approval is
                    recommended before proceeding. All warnings will be documented in the audit trail.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {!hasBlockingIssues && !hasWarnings && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">All Validations Passed</h4>
                  <p className="text-sm text-green-800">
                    Your protocol has passed all AI governance checks and is ready for publication.
                    The audit report will be saved with the protocol version.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onViewAuditDetails}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            {t('protocolWorkbench.prePublishModal.viewAuditReport')}
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              {t('protocolWorkbench.settingsModal.cancel')}
            </button>
            {hasBlockingIssues ? (
              <button
                disabled
                className="px-6 py-2 bg-slate-400 text-white rounded-lg cursor-not-allowed font-medium"
              >
                {t('protocolWorkbench.prePublishModal.cannotPublish')}
              </button>
            ) : hasWarnings ? (
              <button
                onClick={onConfirm}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                {t('protocolWorkbench.prePublishModal.acknowledgePublish')}
              </button>
            ) : (
              <button
                onClick={onConfirm}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                {t('protocolWorkbench.prePublishModal.publishProtocol')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}