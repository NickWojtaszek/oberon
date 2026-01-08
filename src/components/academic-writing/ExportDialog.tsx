// Export & Verification Dialog - Final Manuscript Package

import { useState } from 'react';
import { X, Download, FileText, File, Database, CheckCircle, AlertTriangle, XCircle, Edit3 } from 'lucide-react';
import type { VerificationAppendix, ExportOptions, DigitalSignOff } from '../../types/verificationAppendix';
import type { CitationStyle } from '../../types/aiMode';

interface ExportDialogProps {
  appendix: VerificationAppendix;
  onClose: () => void;
  onExport: (options: ExportOptions, signOff?: DigitalSignOff) => void;
}

export function ExportDialog({ appendix, onClose, onExport }: ExportDialogProps) {
  const [options, setOptions] = useState<ExportOptions>({
    includeManuscript: true,
    includeAppendix: true, // Legacy field
    includeVerificationAppendix: true, // ✅ NEW: Default to TRUE
    includeSourceLibrary: false,
    includeRawData: false,
    citationFormat: 'vancouver',
    appendixFormat: 'detailed',
    format: 'docx'
  });
  
  const [showSignOff, setShowSignOff] = useState(false);
  const [signOff, setSignOff] = useState<DigitalSignOff>({
    piName: '',
    piEmail: '',
    attestation: 'I, the Principal Investigator, certify that I have reviewed this Verification Appendix and confirm that all statistical claims, citations, and data presented in the manuscript are accurate and grounded in the source documents and Statistical Manifest referenced herein.',
    notes: ''
  });

  const handleExport = () => {
    if (showSignOff && !signOff.piName) {
      alert('Please enter PI name for digital sign-off');
      return;
    }
    
    const finalSignOff = showSignOff ? {
      ...signOff,
      reviewedAt: Date.now(),
      signature: `${signOff.piName} [Digital Signature]`
    } : undefined;
    
    onExport(options, finalSignOff);
  };

  const getStatusIcon = (value: boolean) => {
    if (value) return <CheckCircle className="w-4 h-4 text-green-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getVerificationColor = (rate: number) => {
    if (rate >= 95) return 'text-green-700 bg-green-100 border-green-300';
    if (rate >= 80) return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    return 'text-red-700 bg-red-100 border-red-300';
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-8">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-slate-900">Export Manuscript Package</h2>
            <p className="text-sm text-slate-600 mt-1">Download verified manuscript with Scientific Receipt</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Audit Summary */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
              <h3 className="text-sm font-medium text-slate-900">Audit Summary</h3>
            </div>
            <div className="p-4 space-y-4">
              {/* Verification Rate */}
              <div className={`p-4 border rounded-lg ${getVerificationColor(appendix.auditSummary.verificationRate)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Overall Verification Rate</span>
                  <span className="text-2xl font-bold">{appendix.auditSummary.verificationRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-current transition-all"
                    style={{ width: `${appendix.auditSummary.verificationRate}%` }}
                  />
                </div>
                <div className="mt-2 text-sm">
                  {appendix.auditSummary.verifiedClaims} of {appendix.auditSummary.totalClaims} claims verified
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-xs text-blue-700 mb-1">Statistical Claims</div>
                  <div className="text-lg font-medium text-blue-900">{appendix.auditSummary.statisticalClaims.total}</div>
                  <div className="text-xs text-blue-600 mt-1">
                    {appendix.auditSummary.statisticalClaims.manifestMatched} matched
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="text-xs text-purple-700 mb-1">Citation Claims</div>
                  <div className="text-lg font-medium text-purple-900">{appendix.auditSummary.citationClaims.total}</div>
                  <div className="text-xs text-purple-600 mt-1">
                    {appendix.auditSummary.citationClaims.grounded} grounded
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-xs text-green-700 mb-1">Logic Checks</div>
                  <div className="text-lg font-medium text-green-900">{appendix.auditSummary.logicChecks.passed}</div>
                  <div className="text-xs text-green-600 mt-1">
                    {appendix.auditSummary.logicChecks.errors} errors
                  </div>
                </div>
              </div>

              {/* Manual Approvals & Conflicts */}
              {(appendix.auditSummary.manualApprovals > 0 || appendix.auditSummary.conflictResolutions > 0) && (
                <div className="flex items-center gap-4 text-sm">
                  {appendix.auditSummary.manualApprovals > 0 && (
                    <div className="flex items-center gap-2 text-amber-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{appendix.auditSummary.manualApprovals} manual PI approvals</span>
                    </div>
                  )}
                  {appendix.auditSummary.conflictResolutions > 0 && (
                    <div className="flex items-center gap-2 text-red-700">
                      <XCircle className="w-4 h-4" />
                      <span>{appendix.auditSummary.conflictResolutions} conflict resolutions</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Data Lineage Preview */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-900">Data Lineage</h3>
              <span className="text-xs text-slate-600">{appendix.dataLineage.length} entries</span>
            </div>
            <div className="p-4">
              {appendix.dataLineage.length === 0 ? (
                <div className="text-sm text-slate-500 text-center py-4">
                  No statistical claims detected
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {appendix.dataLineage.slice(0, 5).map((entry, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      {entry.verified ? (
                        <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-slate-900">{entry.claimInText}</div>
                        <div className="text-slate-600">
                          → {entry.manifestVariable} = {typeof entry.manifestValue === 'number' ? entry.manifestValue.toFixed(4) : entry.manifestValue}
                        </div>
                      </div>
                    </div>
                  ))}
                  {appendix.dataLineage.length > 5 && (
                    <div className="text-xs text-slate-500 text-center pt-2">
                      +{appendix.dataLineage.length - 5} more entries in full appendix
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Source Validation Preview */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-900">Source Validation</h3>
              <span className="text-xs text-slate-600">{appendix.sourceValidation.length} sources</span>
            </div>
            <div className="p-4">
              {appendix.sourceValidation.length === 0 ? (
                <div className="text-sm text-slate-500 text-center py-4">
                  No citations found
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {appendix.sourceValidation.slice(0, 3).map((entry, idx) => (
                    <div key={idx} className="border border-slate-200 rounded p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-slate-900">@{entry.citationKey}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          entry.overallGrounding === 'verified' ? 'bg-green-100 text-green-800' :
                          entry.overallGrounding === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {entry.overallGrounding}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">
                        {entry.citationCount} citations, {entry.groundedSnippets.length} verified snippets
                      </div>
                    </div>
                  ))}
                  {appendix.sourceValidation.length > 3 && (
                    <div className="text-xs text-slate-500 text-center pt-2">
                      +{appendix.sourceValidation.length - 3} more sources in full appendix
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Compliance Flags */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
              <h3 className="text-sm font-medium text-slate-900">Compliance Flags</h3>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700">All Claims Verified</span>
                {getStatusIcon(appendix.complianceFlags.allClaimsVerified)}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700">No Fabricated Citations</span>
                {getStatusIcon(appendix.complianceFlags.noFabricatedCitations)}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700">Data Matches Manifest</span>
                {getStatusIcon(appendix.complianceFlags.dataMatchesManifest)}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700">Ready for Submission</span>
                {getStatusIcon(appendix.complianceFlags.readyForSubmission)}
              </div>
              {appendix.complianceFlags.piReviewRequired && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">PI Review Required</span>
                  </div>
                  <div className="mt-1 text-xs">
                    Verification rate below 95% or logic errors detected. PI sign-off recommended.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Export Options */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
              <h3 className="text-sm font-medium text-slate-900">Export Options</h3>
            </div>
            <div className="p-4 space-y-4">
              {/* File Selection */}
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.includeManuscript}
                    onChange={(e) => setOptions({ ...options, includeManuscript: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-900">Manuscript (.docx)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.includeAppendix}
                    onChange={(e) => setOptions({ ...options, includeAppendix: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <File className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-900">Verification Appendix (.pdf)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.includeRawData}
                    onChange={(e) => setOptions({ ...options, includeRawData: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <Database className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-900">Raw Data (.csv)</span>
                </label>
              </div>

              {/* Citation Format */}
              <div>
                <label className="block text-xs text-slate-600 mb-2">Citation Format</label>
                <select
                  value={options.citationFormat}
                  onChange={(e) => setOptions({ ...options, citationFormat: e.target.value as CitationStyle })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="vancouver">Vancouver</option>
                  <option value="ama">AMA</option>
                  <option value="apa">APA 7th</option>
                  <option value="nature">Nature</option>
                </select>
              </div>

              {/* Appendix Detail Level */}
              <div>
                <label className="block text-xs text-slate-600 mb-2">Appendix Detail Level</label>
                <select
                  value={options.appendixFormat}
                  onChange={(e) => setOptions({ ...options, appendixFormat: e.target.value as 'detailed' | 'summary' })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="detailed">Detailed (includes all snippets and lineage)</option>
                  <option value="summary">Summary (audit overview only)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Digital Sign-Off */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-900">Digital Sign-Off</h3>
              <button
                onClick={() => setShowSignOff(!showSignOff)}
                className="flex items-center gap-1.5 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50 rounded transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                {showSignOff ? 'Hide' : 'Add Sign-Off'}
              </button>
            </div>
            {showSignOff && (
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">PI Name *</label>
                  <input
                    type="text"
                    value={signOff.piName}
                    onChange={(e) => setSignOff({ ...signOff, piName: e.target.value })}
                    placeholder="Dr. Jane Smith"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Email (optional)</label>
                  <input
                    type="email"
                    value={signOff.piEmail}
                    onChange={(e) => setSignOff({ ...signOff, piEmail: e.target.value })}
                    placeholder="jane.smith@university.edu"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Attestation</label>
                  <textarea
                    value={signOff.attestation}
                    onChange={(e) => setSignOff({ ...signOff, attestation: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Additional Notes (optional)</label>
                  <textarea
                    value={signOff.notes}
                    onChange={(e) => setSignOff({ ...signOff, notes: e.target.value })}
                    rows={2}
                    placeholder="Any additional comments or clarifications..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            {!appendix.complianceFlags.readyForSubmission && (
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="w-4 h-4" />
                <span>Review recommended before submission</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}