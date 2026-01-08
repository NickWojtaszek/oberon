// Evidence Card - Citation Verification Overlay

import { useState } from 'react';
import { Check, X, AlertTriangle, Copy, ExternalLink, CheckCircle2, Database, FileText, Sparkles } from 'lucide-react';
import type { VerificationPacket } from '../../types/evidenceVerification';
import { copyToClipboard } from '../../utils/clipboard';

// Extended verification type that includes the fields used by this component
interface EvidenceVerification extends VerificationPacket {
  referenceSource: {
    title: string;
    doi?: string;
    exactSnippet: string;
    pageNumber?: number;
    similarityScore: number;
    sourceId: string;
    citationKey: string;
  };
  manifestCheck: {
    variable: string;
    valueInDb: number | string;
    consistencyStatus: 'matches' | 'conflict' | 'not_applicable';
    expectedValue?: number | string;
    deviation?: number;
  };
}

interface EvidenceCardProps {
  verification: EvidenceVerification;
  onClose: () => void;
  onFix?: (citationId: string) => void;
  position?: { x: number; y: number };
}

export function EvidenceCard({ verification, onClose, onFix, position }: EvidenceCardProps) {
  const [copied, setCopied] = useState(false);
  
  const isConflict = verification.overallStatus === 'conflict';
  const isVerified = verification.overallStatus === 'verified';
  const isPartial = verification.overallStatus === 'partial';

  const handleCopySnippet = async () => {
    const success = await copyToClipboard(verification.referenceSource.exactSnippet);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert('Failed to copy snippet. Please copy manually.');
    }
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-300';
      case 'conflict': return 'bg-red-100 text-red-800 border-red-300';
      case 'partial': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const cardStyle = position 
    ? { position: 'fixed' as const, top: position.y, left: position.x, maxWidth: '600px' }
    : {};

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Evidence Card */}
      <div 
        className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col ${
          isConflict ? 'border-l-4 border-red-500' : 
          isVerified ? 'border-l-4 border-green-500' : 
          'border-l-4 border-amber-500'
        }`}
        style={position ? cardStyle : undefined}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          isConflict ? 'bg-red-50 border-red-200' : 
          isVerified ? 'bg-green-50 border-green-200' : 
          'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-slate-900 mb-1">Evidence Verification</h3>
              <div className="text-sm text-slate-600">
                Citation: <span className="font-mono text-purple-600">@{verification.referenceSource.citationKey}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Status Badges */}
          <div className="flex gap-2">
            {/* Source Verification Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${
              verification.referenceSource.similarityScore >= 0.8 
                ? 'bg-blue-100 text-blue-800 border-blue-300'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}>
              {verification.referenceSource.similarityScore >= 0.8 ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5" />
              )}
              <span>
                {verification.referenceSource.similarityScore >= 0.8 
                  ? 'Verified by NotebookLM' 
                  : 'Partial Match'}
              </span>
              <span className="ml-1 opacity-75">
                {(verification.referenceSource.similarityScore * 100).toFixed(0)}%
              </span>
            </div>

            {/* Manifest Alignment Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${
              verification.manifestCheck.consistencyStatus === 'matches'
                ? 'bg-green-100 text-green-800 border-green-300'
                : verification.manifestCheck.consistencyStatus === 'conflict'
                ? 'bg-red-100 text-red-800 border-red-300'
                : 'bg-slate-100 text-slate-600 border-slate-300'
            }`}>
              {verification.manifestCheck.consistencyStatus === 'matches' ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : verification.manifestCheck.consistencyStatus === 'conflict' ? (
                <AlertTriangle className="w-3.5 h-3.5" />
              ) : (
                <Database className="w-3.5 h-3.5" />
              )}
              <span>
                {verification.manifestCheck.consistencyStatus === 'matches'
                  ? 'Aligned with Manifest'
                  : verification.manifestCheck.consistencyStatus === 'conflict'
                  ? 'Conflicts with Data'
                  : 'Not Checked'}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Manuscript Claim */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-purple-600" />
              <h4 className="text-sm font-medium text-slate-900">Your Manuscript Claim</h4>
              <span className="text-xs text-slate-500">({verification.section})</span>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-slate-900 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                "{verification.manuscriptText}"
              </p>
            </div>
          </div>

          {/* Source Evidence */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-medium text-slate-900">Grounded Snippet from Source</h4>
              </div>
              <button
                onClick={handleCopySnippet}
                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-xs text-blue-800 font-medium mb-2">
                {verification.referenceSource.title}
                {verification.referenceSource.pageNumber && (
                  <span className="ml-2">(Page {verification.referenceSource.pageNumber})</span>
                )}
              </div>
              <p className="text-sm text-slate-900 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                "{verification.referenceSource.exactSnippet}"
              </p>
              {verification.referenceSource.doi && (
                <div className="mt-3 flex items-center gap-2 text-xs text-blue-700">
                  <ExternalLink className="w-3 h-3" />
                  <a href={`https://doi.org/${verification.referenceSource.doi}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {verification.referenceSource.doi}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Statistical Manifest Check */}
          {verification.manifestCheck.consistencyStatus !== 'not_applicable' && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-4 h-4 text-green-600" />
                <h4 className="text-sm font-medium text-slate-900">Statistical Manifest Cross-Check</h4>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                verification.manifestCheck.consistencyStatus === 'matches'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-slate-600 mb-1">Variable</div>
                    <div className="text-sm text-slate-900 font-mono">
                      {verification.manifestCheck.variable}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-600 mb-1">Value in Database</div>
                    <div className={`text-sm font-mono ${
                      verification.manifestCheck.consistencyStatus === 'matches'
                        ? 'text-green-700'
                        : 'text-red-700'
                    }`}>
                      {typeof verification.manifestCheck.valueInDb === 'number'
                        ? verification.manifestCheck.valueInDb.toFixed(3)
                        : verification.manifestCheck.valueInDb}
                    </div>
                  </div>
                </div>

                {verification.manifestCheck.consistencyStatus === 'conflict' && verification.manifestCheck.expectedValue && (
                  <div className="mt-4 p-3 bg-white rounded border border-red-300">
                    <div className="text-xs font-medium text-red-900 mb-2">
                      ⚠️ Mismatch Detected
                    </div>
                    <div className="text-sm text-red-800">
                      Your text suggests: <strong>{verification.manifestCheck.expectedValue}</strong>
                      <br />
                      Actual value: <strong>{verification.manifestCheck.valueInDb}</strong>
                      {verification.manifestCheck.deviation && (
                        <span className="block mt-1">
                          Deviation: {verification.manifestCheck.deviation.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Verification Metadata */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-slate-600 mb-1">Verified At</div>
                <div className="text-slate-900">
                  {new Date(verification.verifiedAt).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-slate-600 mb-1">Verified By</div>
                <div className="text-slate-900 capitalize">
                  {verification.verifiedBy === 'ai' ? (
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI NotebookLM
                    </span>
                  ) : (
                    'Human Reviewer'
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          {isConflict && onFix ? (
            <div className="flex items-center justify-between">
              <div className="text-sm text-red-800">
                This citation has conflicts that need to be resolved
              </div>
              <button
                onClick={() => onFix(verification.citationId)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Suggest Fix
              </button>
            </div>
          ) : isVerified ? (
            <div className="flex items-center gap-2 text-sm text-green-800">
              <CheckCircle2 className="w-4 h-4" />
              This citation is fully verified and grounded
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-amber-800">
              <AlertTriangle className="w-4 h-4" />
              This citation has partial verification - review recommended
            </div>
          )}
        </div>
      </div>
    </>
  );
}