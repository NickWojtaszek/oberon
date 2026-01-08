import { AlertTriangle, Lock, FileText } from 'lucide-react';

interface VersionConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  protocolNumber: string;
  currentVersion: string;
  dataRecordCount: number;
  onCreateNewVersion: () => void;
  onDiscardChanges: () => void;
}

export function VersionConflictModal({
  isOpen,
  onClose,
  protocolNumber,
  currentVersion,
  dataRecordCount,
  onCreateNewVersion,
  onDiscardChanges,
}: VersionConflictModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900 mb-1">
                  Schema Locked for Data Protection
                </h2>
                <p className="text-sm text-slate-600">
                  This protocol version has collected clinical data and cannot be modified
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Current State */}
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Protocol</span>
                <span className="text-sm font-medium text-slate-900">
                  {protocolNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Current Version</span>
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-sm font-medium text-slate-900">
                    {currentVersion}
                  </span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                    Locked
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Clinical Data Records</span>
                <span className="text-sm font-semibold text-slate-900">
                  {dataRecordCount} {dataRecordCount === 1 ? 'record' : 'records'}
                </span>
              </div>
            </div>

            {/* Warning Message */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <p className="font-medium mb-1">Why is this locked?</p>
                <p className="text-amber-800">
                  Once clinical data is collected using a specific schema version, that
                  version must remain unchanged to maintain data integrity and regulatory
                  compliance. Any structural changes require a new version.
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Choose an option:</p>

              {/* Option 1: Create New Version */}
              <button
                onClick={() => {
                  onCreateNewVersion();
                  onClose();
                }}
                className="w-full flex items-start gap-4 p-4 border-2 border-blue-200 bg-blue-50 rounded-lg hover:border-blue-300 hover:bg-blue-100 transition-all text-left group"
              >
                <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-blue-900 mb-1">
                    Create New Version (Recommended)
                  </div>
                  <div className="text-sm text-blue-800">
                    Create a new draft version with your changes. Existing data remains
                    linked to {currentVersion}. You can migrate data later if needed.
                  </div>
                </div>
              </button>

              {/* Option 2: Discard Changes */}
              <button
                onClick={() => {
                  onDiscardChanges();
                  onClose();
                }}
                className="w-full flex items-start gap-4 p-4 border-2 border-slate-200 bg-white rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-all text-left group"
              >
                <div className="w-10 h-10 bg-slate-100 group-hover:bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900 mb-1">
                    Keep Current Version
                  </div>
                  <div className="text-sm text-slate-600">
                    Discard your pending changes and continue using the locked version
                    {currentVersion}. No new version will be created.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
