import { Database, CheckCircle2, AlertTriangle, ArrowRight, Blocks, FileText, Shield } from 'lucide-react';
import type { ProtocolMetadata, SchemaBlock } from '../../types';

interface DeployToDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  protocolMetadata: ProtocolMetadata;
  schemaBlocksCount: number;
  hasPublishedVersion: boolean;
  validationErrors: string[];
}

export function DeployToDatabaseModal({
  isOpen,
  onClose,
  onConfirm,
  protocolMetadata,
  schemaBlocksCount,
  hasPublishedVersion,
  validationErrors
}: DeployToDatabaseModalProps) {
  if (!isOpen) return null;

  const hasTitle = protocolMetadata.protocolTitle && protocolMetadata.protocolTitle.trim().length > 0;
  const hasNumber = protocolMetadata.protocolNumber && protocolMetadata.protocolNumber.trim().length > 0;
  const hasSchema = schemaBlocksCount > 0;

  const canDeploy = hasTitle && hasNumber && hasSchema && validationErrors.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Deploy to Database</h2>
              <p className="text-sm text-slate-600">Build data collection forms from your schema</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Protocol Info */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Protocol</span>
            </div>
            <div className="text-base font-semibold text-slate-900">
              {protocolMetadata.protocolTitle || 'Untitled Protocol'}
            </div>
            <div className="text-sm text-slate-600">
              {protocolMetadata.protocolNumber || 'No protocol number'}
            </div>
          </div>

          {/* Readiness Checklist */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-700 mb-2">Deployment Readiness</div>

            <div className={`flex items-center gap-2 p-2 rounded-lg ${hasTitle ? 'bg-green-50' : 'bg-red-50'}`}>
              {hasTitle ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm ${hasTitle ? 'text-green-700' : 'text-red-700'}`}>
                Protocol title {hasTitle ? 'defined' : 'required'}
              </span>
            </div>

            <div className={`flex items-center gap-2 p-2 rounded-lg ${hasNumber ? 'bg-green-50' : 'bg-red-50'}`}>
              {hasNumber ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm ${hasNumber ? 'text-green-700' : 'text-red-700'}`}>
                Protocol number {hasNumber ? 'defined' : 'required'}
              </span>
            </div>

            <div className={`flex items-center gap-2 p-2 rounded-lg ${hasSchema ? 'bg-green-50' : 'bg-red-50'}`}>
              {hasSchema ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm ${hasSchema ? 'text-green-700' : 'text-red-700'}`}>
                {hasSchema ? `${schemaBlocksCount} schema fields defined` : 'At least 1 schema field required'}
              </span>
            </div>

            {!hasPublishedVersion && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-amber-700">
                  Draft version - will save before deploying
                </span>
              </div>
            )}
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">Validation Issues</span>
              </div>
              <ul className="text-sm text-red-600 space-y-1 ml-6 list-disc">
                {validationErrors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>What happens next:</strong> Your protocol schema will be used to generate
              data entry forms in the Database module. You can then collect patient data
              according to your defined variables.
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
            disabled={!canDeploy}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Database className="w-4 h-4" />
            Deploy & Open Database
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
