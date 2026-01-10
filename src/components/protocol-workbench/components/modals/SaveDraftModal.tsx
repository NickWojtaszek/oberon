import { Save, CheckCircle2, Circle, FileText, Blocks, GitBranch, FileCheck, AlertCircle } from 'lucide-react';
import type { ProtocolMetadata } from '../../types';

interface SaveDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  protocolMetadata: ProtocolMetadata;
  schemaBlocksCount: number;
  dependenciesCount: number;
}

export function SaveDraftModal({
  isOpen,
  onClose,
  onConfirm,
  protocolMetadata,
  schemaBlocksCount,
  dependenciesCount
}: SaveDraftModalProps) {
  if (!isOpen) return null;

  // Calculate document completeness
  const requiredFields = [
    { key: 'protocolTitle', label: 'Protocol Title', value: protocolMetadata.protocolTitle },
    { key: 'protocolNumber', label: 'Protocol Number', value: protocolMetadata.protocolNumber },
    { key: 'principalInvestigator', label: 'Principal Investigator', value: protocolMetadata.principalInvestigator },
    { key: 'sponsor', label: 'Sponsor', value: protocolMetadata.sponsor },
  ];

  const protocolContentFields = [
    { key: 'primaryObjectives', label: 'Primary Objectives', value: protocolMetadata.objectives?.primary },
    { key: 'inclusionCriteria', label: 'Inclusion Criteria', value: protocolMetadata.inclusionCriteria },
    { key: 'exclusionCriteria', label: 'Exclusion Criteria', value: protocolMetadata.exclusionCriteria },
    { key: 'statisticalPlan', label: 'Statistical Plan', value: protocolMetadata.statisticalPlan },
  ];

  const completedRequiredFields = requiredFields.filter(f => f.value && f.value.trim().length > 0).length;
  const documentPercentage = Math.round((completedRequiredFields / requiredFields.length) * 100);

  const completedContentFields = protocolContentFields.filter(f => f.value && f.value.trim().length > 0).length;
  const contentPercentage = Math.round((completedContentFields / protocolContentFields.length) * 100);

  const hasMinimumSchema = schemaBlocksCount >= 1;
  const hasDependencies = dependenciesCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Save className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Save Draft</h2>
              <p className="text-sm text-slate-600">Save your protocol changes to local storage</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Section 1: Document (Protocol Metadata) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-700" />
                <h3 className="text-sm font-semibold text-slate-900">Document (Protocol Metadata)</h3>
              </div>
              <span className="text-sm font-semibold text-blue-600">{documentPercentage}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  documentPercentage === 100 ? 'bg-green-600' : 'bg-blue-600'
                }`}
                style={{ width: `${documentPercentage}%` }}
              />
            </div>

            <div className="space-y-2">
              {requiredFields.map(field => (
                <div key={field.key} className="flex items-center gap-2 text-sm">
                  {field.value && field.value.trim().length > 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  )}
                  <span className="text-slate-700">{field.label}</span>
                  {field.value && field.value.trim().length > 0 && (
                    <span className="text-xs text-slate-500 truncate max-w-[200px]">({field.value})</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Schema (Schema Blocks) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Blocks className="w-5 h-5 text-slate-700" />
                <h3 className="text-sm font-semibold text-slate-900">Schema (Data Collection Form)</h3>
              </div>
              {hasMinimumSchema ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500" />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {hasMinimumSchema ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                )}
                <span className="text-slate-700">
                  {schemaBlocksCount} schema block{schemaBlocksCount !== 1 ? 's' : ''} defined
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Dependencies (Conditional Logic) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-slate-700" />
                <h3 className="text-sm font-semibold text-slate-900">Dependencies (Conditional Logic)</h3>
              </div>
              <span className="text-xs text-slate-500">Optional</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {hasDependencies ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                )}
                <span className="text-slate-700">
                  {dependenciesCount} conditional {dependenciesCount !== 1 ? 'dependencies' : 'dependency'} configured
                </span>
              </div>
              {!hasDependencies && (
                <p className="text-xs text-slate-500 ml-6">You can add conditional logic later</p>
              )}
            </div>
          </div>

          {/* Section 4: Protocol Content */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-slate-700" />
                <h3 className="text-sm font-semibold text-slate-900">Protocol Content</h3>
              </div>
              <span className="text-sm font-semibold text-blue-600">{contentPercentage}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  contentPercentage === 100 ? 'bg-green-600' : 'bg-blue-600'
                }`}
                style={{ width: `${contentPercentage}%` }}
              />
            </div>

            <div className="space-y-2">
              {protocolContentFields.map(field => (
                <div key={field.key} className="flex items-center gap-2 text-sm">
                  {field.value && field.value.trim().length > 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  )}
                  <span className="text-slate-700">{field.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Draft will be saved.</strong> You can publish when ready and all required fields are complete.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
}
