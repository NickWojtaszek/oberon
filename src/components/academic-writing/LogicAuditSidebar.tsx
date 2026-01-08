// Logic Audit Sidebar - Deep Verification Panel (Phase 5)

import { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, FileText, ArrowRight, X, Calendar } from 'lucide-react';
import type { VerificationPacket } from '../../types/evidenceVerification';
import type { EthicsCompliance } from '../../types/ethics';

interface LogicAuditSidebarProps {
  verifications: VerificationPacket[];
  isOpen: boolean;
  onClose: () => void;
  onAutoSync: (verification: VerificationPacket) => void;
  onApprove: (verificationId: string) => void;
  ethicsCompliance?: EthicsCompliance | null;
}

type AuditFilter = 'all' | 'verified' | 'warning' | 'mismatch';

export function LogicAuditSidebar({ 
  verifications, 
  isOpen, 
  onClose,
  onAutoSync,
  onApprove,
  ethicsCompliance
}: LogicAuditSidebarProps) {
  const [filter, setFilter] = useState<AuditFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Check for IRB expiration
  const isExpired = ethicsCompliance?.expirationDate && 
    new Date(ethicsCompliance.expirationDate).getTime() < Date.now();

  const isRenewalDueSoon = ethicsCompliance?.renewalDueDate && 
    new Date(ethicsCompliance.renewalDueDate).getTime() - Date.now() < (30 * 24 * 60 * 60 * 1000) &&
    !isExpired;

  // Categorize verifications
  const verified = verifications.filter(v => 
    v.internalCheck?.status === 'verified' && v.externalCheck.similarityScore >= 0.85
  );
  const warnings = verifications.filter(v => 
    v.internalCheck?.status === 'verified' && 
    v.externalCheck.similarityScore >= 0.60 && 
    v.externalCheck.similarityScore < 0.85
  );
  const mismatches = verifications.filter(v => 
    v.internalCheck?.status === 'conflict' || v.externalCheck.similarityScore < 0.60
  );

  const filteredVerifications = 
    filter === 'verified' ? verified :
    filter === 'warning' ? warnings :
    filter === 'mismatch' ? mismatches :
    verifications;

  return (
    <div className="fixed top-0 right-0 h-full w-[480px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Logic Audit</h2>
            <p className="text-xs text-slate-600 mt-1">Manuscript claim verification</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({verifications.length})
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              filter === 'verified'
                ? 'bg-green-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Verified ({verified.length})
          </button>
          <button
            onClick={() => setFilter('warning')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              filter === 'warning'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Warning ({warnings.length})
          </button>
          <button
            onClick={() => setFilter('mismatch')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              filter === 'mismatch'
                ? 'bg-red-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Mismatch ({mismatches.length})
          </button>
        </div>
      </div>

      {/* IRB Approval Status Alerts */}
      {isExpired && (
        <div className="bg-red-600 px-4 py-3 border-b border-red-700">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-200 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-white">IRB Approval Expired</div>
              <div className="text-xs text-red-100 mt-1">
                Ethics approval expired on {ethicsCompliance?.expirationDate && new Date(ethicsCompliance.expirationDate).toLocaleDateString()}. 
                Manuscript publication requires active IRB approval.
              </div>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: { tab: 'ethics' } }));
                }}
                className="mt-2 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-medium transition-colors"
              >
                Go to Ethics Tab
              </button>
            </div>
          </div>
        </div>
      )}

      {isRenewalDueSoon && (
        <div className="bg-amber-600 px-4 py-3 border-b border-amber-700">
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-amber-200 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Continuing Review Due Soon</div>
              <div className="text-xs text-amber-100 mt-1">
                Annual review due by {ethicsCompliance?.renewalDueDate && new Date(ethicsCompliance.renewalDueDate).toLocaleDateString()}
              </div>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: { tab: 'ethics' } }));
                }}
                className="mt-2 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-medium transition-colors"
              >
                Prepare Renewal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification List */}
      <div className="flex-1 overflow-y-auto">
        {filteredVerifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <FileText className="w-16 h-16 mb-4 text-slate-300" />
            <p className="text-sm">No {filter !== 'all' ? filter : ''} verifications</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredVerifications.map((verification) => {
              const verificationId = `${verification.citationKey}-${verification.manuscriptClaim}`;
              const isExpanded = expandedId === verificationId;
              const isVerified = verification.internalCheck?.status === 'verified' && 
                               verification.externalCheck.similarityScore >= 0.85;
              const isWarning = verification.internalCheck?.status === 'verified' && 
                              verification.externalCheck.similarityScore >= 0.60 && 
                              verification.externalCheck.similarityScore < 0.85;
              const isMismatch = verification.internalCheck?.status === 'conflict' || 
                                verification.externalCheck.similarityScore < 0.60;

              return (
                <div
                  key={verificationId}
                  className={`border rounded-lg overflow-hidden ${
                    isVerified ? 'border-green-200 bg-green-50' :
                    isWarning ? 'border-amber-200 bg-amber-50' :
                    'border-red-200 bg-red-50'
                  }`}
                >
                  {/* Verification Header */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : verificationId)}
                    className="w-full px-4 py-3 text-left hover:bg-white/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {isVerified ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : isWarning ? (
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-mono text-slate-600 mb-1">
                          [@{verification.citationKey}]
                        </div>
                        <div className="text-sm text-slate-900 line-clamp-2">
                          {verification.manuscriptClaim}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            isVerified ? 'bg-green-600 text-white' :
                            isWarning ? 'bg-amber-600 text-white' :
                            'bg-red-600 text-white'
                          }`}>
                            {verification.externalCheck.similarityScore >= 0.85 ? 'Verified' :
                             verification.externalCheck.similarityScore >= 0.60 ? 'Warning' :
                             'Mismatch'}
                          </span>
                          <span className="text-xs text-slate-600">
                            {Math.round(verification.externalCheck.similarityScore * 100)}% match
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-slate-200 bg-white">
                      {/* Manuscript Claim vs Ground Truth */}
                      <div className="p-4 space-y-4">
                        <div>
                          <div className="text-xs font-medium text-slate-700 mb-2">Manuscript Claim</div>
                          <div className="p-3 bg-slate-50 rounded border border-slate-200 text-sm text-slate-900">
                            {verification.manuscriptClaim}
                          </div>
                        </div>

                        <div className="flex items-center justify-center">
                          <ArrowRight className="w-5 h-5 text-slate-400" />
                        </div>

                        <div>
                          <div className="text-xs font-medium text-slate-700 mb-2">Source Evidence</div>
                          <div className="p-3 bg-blue-50 rounded border border-blue-200 text-sm text-slate-900">
                            {verification.externalCheck.sourceSnippet}
                          </div>
                        </div>

                        {/* Internal Check (if available) */}
                        {verification.internalCheck && (
                          <div>
                            <div className="text-xs font-medium text-slate-700 mb-2">Statistical Validation</div>
                            <div className={`p-3 rounded border text-sm ${
                              verification.internalCheck.status === 'verified'
                                ? 'bg-green-50 border-green-200 text-green-900'
                                : 'bg-red-50 border-red-200 text-red-900'
                            }`}>
                              {verification.internalCheck.status === 'verified' ? (
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Matches statistical manifest: {verification.internalCheck.dataValue}</span>
                                </div>
                              ) : (
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <XCircle className="w-4 h-4" />
                                    <span className="font-medium">Conflict detected</span>
                                  </div>
                                  <div className="text-xs">
                                    Expected: {verification.internalCheck.expectedValue}<br />
                                    Found in manifest: {verification.internalCheck.dataValue}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        {isMismatch && (
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => onAutoSync(verification)}
                              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              Auto-Sync to Source
                            </button>
                            <button
                              onClick={() => onApprove(verificationId)}
                              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                            >
                              PI Approve
                            </button>
                          </div>
                        )}
                        {isWarning && (
                          <button
                            onClick={() => onApprove(verificationId)}
                            className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                          >
                            PI Approve Claim
                          </button>
                        )}
                        {isVerified && (
                          <div className="flex items-center gap-2 p-2 bg-green-100 rounded text-green-900 text-xs">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>This claim has been verified and approved</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Summary */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
        <div className="grid grid-cols-3 gap-4 text-center text-xs">
          <div>
            <div className="font-semibold text-lg text-green-600">{verified.length}</div>
            <div className="text-slate-600">Verified</div>
          </div>
          <div>
            <div className="font-semibold text-lg text-amber-600">{warnings.length}</div>
            <div className="text-slate-600">Warnings</div>
          </div>
          <div>
            <div className="font-semibold text-lg text-red-600">{mismatches.length}</div>
            <div className="text-slate-600">Mismatches</div>
          </div>
        </div>
      </div>
    </div>
  );
}