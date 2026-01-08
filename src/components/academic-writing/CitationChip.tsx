// Citation Chip - Clickable inline citation with verification status

import { CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import type { VerificationPacket } from '../../types/evidenceVerification';

interface CitationChipProps {
  citationKey: string;
  verification?: VerificationPacket;
  onClick: () => void;
  isInline?: boolean;
}

export function CitationChip({ citationKey, verification, onClick, isInline = true }: CitationChipProps) {
  const getStatusColor = () => {
    if (!verification) return 'bg-slate-100 text-slate-700 border-slate-300';
    
    switch (verification.overallStatus) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200';
      case 'conflict':
        return 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200';
      case 'partial':
        return 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200';
    }
  };

  const getStatusIcon = () => {
    if (!verification) return <HelpCircle className="w-3 h-3" />;
    
    switch (verification.overallStatus) {
      case 'verified':
        return <CheckCircle className="w-3 h-3" />;
      case 'conflict':
        return <AlertTriangle className="w-3 h-3" />;
      case 'partial':
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <HelpCircle className="w-3 h-3" />;
    }
  };

  const getTooltipText = () => {
    if (!verification) return 'Click to verify citation';
    
    switch (verification.overallStatus) {
      case 'verified':
        return 'Citation verified - click for evidence';
      case 'conflict':
        return 'Citation has conflicts - click to review';
      case 'partial':
        return 'Citation partially verified - click for details';
      default:
        return 'Click for citation details';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-mono transition-all ${getStatusColor()} ${
        isInline ? 'mx-0.5' : ''
      }`}
      title={getTooltipText()}
    >
      {getStatusIcon()}
      <span>@{citationKey}</span>
    </button>
  );
}

interface CitationChipGroupProps {
  citations: Array<{ key: string; verification?: VerificationPacket }>;
  onClickCitation: (key: string) => void;
}

export function CitationChipGroup({ citations, onClickCitation }: CitationChipGroupProps) {
  if (citations.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {citations.map((citation, idx) => (
        <CitationChip
          key={idx}
          citationKey={citation.key}
          verification={citation.verification}
          onClick={() => onClickCitation(citation.key)}
          isInline={false}
        />
      ))}
    </div>
  );
}
