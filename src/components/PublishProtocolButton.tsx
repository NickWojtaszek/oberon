import { useState } from 'react';
import { Lock, CheckCircle2, AlertTriangle, Shield } from 'lucide-react';
import type { ProtocolVersion, SavedProtocol } from '../types/shared';
import type { ProtocolAuditResult } from './protocol-workbench/auditTypes';
import { lockProtocolVersion, canEditProtocolVersion } from '../utils/schemaLocking';
import { useProject } from '../contexts/ProtocolContext';
import { runProtocolAudit } from './protocol-workbench/auditEngine';
import { PrePublishValidationModal } from './protocol-workbench/components/modals/PrePublishValidationModal';

interface PublishProtocolButtonProps {
  protocol: SavedProtocol;
  version: ProtocolVersion;
  onPublished: (updatedProtocol: SavedProtocol) => void;
}

export function PublishProtocolButton({
  protocol,
  version,
  onPublished,
}: PublishProtocolButtonProps) {
  const { currentProject } = useProject();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [auditResult, setAuditResult] = useState<ProtocolAuditResult | null>(null);
  const [isRunningAudit, setIsRunningAudit] = useState(false);

  // Check if already locked
  if (version.locked) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
        <Lock className="w-4 h-4 text-green-600" />
        <div>
          <div className="text-sm font-semibold text-green-900">
            Published & Locked
          </div>
          <div className="text-xs text-green-700">
            {version.lockedAt
              ? `Locked on ${new Date(version.lockedAt).toLocaleDateString()}`
              : 'Schema locked for data collection'}
          </div>
        </div>
      </div>
    );
  }

  // Check if can be locked
  const { canEdit, reason, recordCount } = canEditProtocolVersion(
    version,
    protocol.protocolNumber,
    currentProject?.id
  );

  const handlePublish = () => {
    setIsPublishing(true);

    try {
      // Lock the protocol version
      const updatedProtocol = lockProtocolVersion(
        protocol,
        version.id,
        'Current User', // TODO: Replace with actual user from auth
        currentProject?.id
      );

      // Callback with updated protocol
      onPublished(updatedProtocol);

      // Close all modals
      setShowConfirmation(false);
      setAuditResult(null);
    } catch (error) {
      console.error('Error publishing protocol:', error);
      alert('Failed to publish protocol. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleInitiatePublish = () => {
    setIsRunningAudit(true);
    
    // Run AI audit validation
    setTimeout(() => {
      const result = runProtocolAudit({
        protocolMetadata: version.metadata || {},
        protocolContent: version.protocolContent || {},
        schemaBlocks: version.schemaBlocks || [],
        dependencies: []
      });
      
      setAuditResult(result);
      setIsRunningAudit(false);
    }, 800);
  };

  const handleProceedAfterValidation = () => {
    // Close validation modal and show final confirmation
    setAuditResult(null);
    setShowConfirmation(true);
  };

  const handleViewAuditDetails = () => {
    // TODO: Navigate to audit tab
    alert('Navigation to Audit tab would happen here');
  };

  return (
    <>
      {/* Publish Button */}
      <button
        onClick={handleInitiatePublish}
        disabled={isRunningAudit}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50"
      >
        {isRunningAudit ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Running AI Audit...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Publish to Production
          </>
        )}
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowConfirmation(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">
                      Publish to Production?
                    </h2>
                    <p className="text-sm text-slate-600">
                      Lock this schema version for clinical data collection
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Protocol Info */}
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Protocol</span>
                    <span className="font-medium text-slate-900">
                      {protocol.protocolNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Version</span>
                    <span className="font-medium text-slate-900">
                      {version.versionNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Schema Blocks</span>
                    <span className="font-medium text-slate-900">
                      {version.schemaBlocks.length}
                    </span>
                  </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-900 mb-1">
                      This action will lock the schema
                    </p>
                    <p className="text-amber-800">
                      Once published, this schema version becomes immutable to protect
                      data integrity. Any future changes will require creating a new
                      version.
                    </p>
                  </div>
                </div>

                {/* What happens */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">What happens:</p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Schema becomes read-only (locked)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Database can collect patient data safely</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Timestamp and user recorded in audit log</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Data records linked to this exact version</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
                <button
                  onClick={() => setShowConfirmation(false)}
                  disabled={isPublishing}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isPublishing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Publish & Lock
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Pre-Publish Validation Modal */}
      {auditResult && (
        <PrePublishValidationModal
          auditResult={auditResult}
          onClose={() => setAuditResult(null)}
          onConfirm={handleProceedAfterValidation}
          onViewAuditDetails={handleViewAuditDetails}
        />
      )}
    </>
  );
}