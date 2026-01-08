/**
 * Logic Audit Sidebar (Pane C)
 * Research Factory - Phase 5: Logic Audit Workspace
 * 
 * Triggered by "Run Logic Check" button
 * Displays mismatch cards with auto-sync capability
 */

import { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Zap, 
  ExternalLink,
  Eye,
  Sparkles
} from 'lucide-react';
import type { MismatchCard, VerifiedResult } from '../../types/accountability';

interface LogicAuditSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mismatches: MismatchCard[];
  onAutoFix: (mismatchId: string) => void;
  onManualApprove: (mismatchId: string) => void;
  onDismiss: (mismatchId: string) => void;
  onViewInManuscript: (mismatchId: string) => void;
}

export function LogicAuditSidebar({
  isOpen,
  onClose,
  mismatches,
  onAutoFix,
  onManualApprove,
  onDismiss,
  onViewInManuscript,
}: LogicAuditSidebarProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCard = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  // Stats
  const critical = mismatches.filter(m => m.severity === 'critical').length;
  const warnings = mismatches.filter(m => m.severity === 'warning').length;
  const resolved = mismatches.filter(m => m.status !== 'unresolved').length;

  if (!isOpen) return null;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Logic Audit</h2>
              <p className="text-xs text-slate-600">
                Contextual Intelligence Panel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="text-lg font-semibold text-red-600">{critical}</div>
            <div className="text-xs text-red-700">Critical</div>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg">
            <div className="text-lg font-semibold text-amber-600">{warnings}</div>
            <div className="text-xs text-amber-700">Warnings</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-semibold text-green-600">{resolved}</div>
            <div className="text-xs text-green-700">Resolved</div>
          </div>
        </div>
      </div>

      {/* Mismatch Cards */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {mismatches.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="font-medium text-slate-900">All Clear!</p>
            <p className="text-sm text-slate-600 mt-1">
              No logic mismatches detected
            </p>
          </div>
        ) : (
          mismatches.map((mismatch) => (
            <MismatchCardComponent
              key={mismatch.id}
              mismatch={mismatch}
              isExpanded={expandedCards.has(mismatch.id)}
              onToggle={() => toggleCard(mismatch.id)}
              onAutoFix={() => onAutoFix(mismatch.id)}
              onManualApprove={() => onManualApprove(mismatch.id)}
              onDismiss={() => onDismiss(mismatch.id)}
              onViewInManuscript={() => onViewInManuscript(mismatch.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Mismatch Card Component
// ============================================================================

interface MismatchCardComponentProps {
  mismatch: MismatchCard;
  isExpanded: boolean;
  onToggle: () => void;
  onAutoFix: () => void;
  onManualApprove: () => void;
  onDismiss: () => void;
  onViewInManuscript: () => void;
}

function MismatchCardComponent({
  mismatch,
  isExpanded,
  onToggle,
  onAutoFix,
  onManualApprove,
  onDismiss,
  onViewInManuscript,
}: MismatchCardComponentProps) {
  const severityConfig = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: AlertTriangle,
      iconColor: 'text-red-600',
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: Info,
      iconColor: 'text-blue-600',
    },
  };

  const config = severityConfig[mismatch.severity];
  const Icon = config.icon;
  const isResolved = mismatch.status !== 'unresolved';

  return (
    <div 
      className={`
        border ${config.border} ${isResolved ? 'bg-slate-50' : config.bg} 
        rounded-lg overflow-hidden transition-all
      `}
    >
      {/* Card Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start gap-3 text-left hover:bg-white/50 transition-colors"
      >
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-medium ${config.text}`}>
              {mismatch.section}
              {mismatch.lineNumber && ` (Line ${mismatch.lineNumber})`}
            </span>
            {isResolved && (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            )}
          </div>
          <p className="text-sm text-slate-700 line-clamp-2">
            {mismatch.textClaim}
          </p>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-200">
          {/* Side-by-side comparison */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            {/* Student's text */}
            <div className="p-3 bg-white rounded border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Your text:</div>
              <div className="text-sm text-slate-900">
                {mismatch.textClaim}
              </div>
            </div>

            {/* Ground truth */}
            <div className="p-3 bg-green-50 rounded border border-green-200">
              <div className="text-xs text-green-700 mb-1">Ground truth:</div>
              <div className="text-sm font-medium text-green-900">
                {formatVerifiedResult(mismatch.manifestValue)}
              </div>
            </div>
          </div>

          {/* Traceability */}
          <div className="p-3 bg-slate-50 rounded text-xs">
            <div className="text-slate-600 mb-1">Source:</div>
            <div className="text-slate-900 font-mono">
              {mismatch.sourceVariableId}
            </div>
          </div>

          {/* Actions */}
          {!isResolved && (
            <div className="flex items-center gap-2">
              <button
                onClick={onAutoFix}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Auto-Sync
              </button>
              <button
                onClick={onViewInManuscript}
                className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={onDismiss}
                className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm"
              >
                Dismiss
              </button>
            </div>
          )}

          {isResolved && (
            <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Resolved via {mismatch.status}
              {mismatch.resolvedAt && ` on ${new Date(mismatch.resolvedAt).toLocaleDateString()}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatVerifiedResult(result: VerifiedResult): string {
  let output = String(result.val);
  
  if (result.p !== undefined) {
    output += ` (p=${result.p})`;
  }
  
  if (result.ci) {
    output += ` ${result.ci}`;
  }
  
  if (result.n !== undefined) {
    output += ` [n=${result.n}]`;
  }
  
  if (result.unit) {
    output += ` ${result.unit}`;
  }
  
  return output;
}
