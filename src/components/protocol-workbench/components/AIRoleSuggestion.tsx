/**
 * AIRoleSuggestion - Inline AI suggestion badge for schema blocks
 *
 * Mode A (Semi-automated): Shows AI-suggested statistical role as a small
 * badge on schema blocks. Users can accept or dismiss suggestions inline.
 */

import { useState } from 'react';
import { Sparkles, Check, X, ChevronDown } from 'lucide-react';
import type { StatisticalRole } from '../types';
import { getStatisticalRoleLabel, getStatisticalRoleColor } from '../../ai-personas/statistician/StatisticalPlanningAgent';

interface AIRoleSuggestionProps {
  blockId: string;
  suggestedRole: StatisticalRole;
  confidence: number;
  reasoning?: string;
  onAccept: (blockId: string, role: StatisticalRole) => void;
  onDismiss: (blockId: string) => void;
  compact?: boolean;
}

export function AIRoleSuggestion({
  blockId,
  suggestedRole,
  confidence,
  reasoning,
  onAccept,
  onDismiss,
  compact = true,
}: AIRoleSuggestionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const confidencePercent = Math.round(confidence * 100);
  const roleLabel = getStatisticalRoleLabel(suggestedRole);
  const roleColorClass = getStatisticalRoleColor(suggestedRole);

  // Compact view - just shows the suggestion badge
  if (compact) {
    return (
      <div className="inline-flex items-center gap-1 group">
        {/* Suggestion Badge */}
        <div
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border cursor-pointer transition-all ${roleColorClass} hover:shadow-sm`}
          onClick={() => setIsExpanded(!isExpanded)}
          title={reasoning || `AI suggests: ${roleLabel}`}
        >
          <Sparkles className="w-3 h-3" />
          <span>{roleLabel}</span>
          <span className="opacity-75">{confidencePercent}%</span>
          {reasoning && <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />}
        </div>

        {/* Quick Actions */}
        <div className="hidden group-hover:flex items-center gap-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAccept(blockId, suggestedRole);
            }}
            className="p-1 rounded-full bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
            title="Accept suggestion"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
              onDismiss(blockId);
            }}
            className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
            title="Dismiss suggestion"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Expanded reasoning popover */}
        {isExpanded && reasoning && (
          <div className="absolute z-10 mt-1 top-full left-0 w-64 p-3 bg-white rounded-lg shadow-lg border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-sm text-slate-900">AI Suggestion</span>
            </div>
            <p className="text-xs text-slate-600 mb-3">{reasoning}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onAccept(blockId, suggestedRole);
                  setIsExpanded(false);
                }}
                className="flex-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => {
                  setIsDismissed(true);
                  onDismiss(blockId);
                }}
                className="flex-1 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded hover:bg-slate-200 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full view - card style
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-2">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-purple-900">
              AI suggests: {roleLabel}
            </span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${
                confidencePercent >= 85
                  ? 'bg-green-100 text-green-700'
                  : confidencePercent >= 70
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {confidencePercent}% confidence
            </span>
          </div>
          {reasoning && (
            <p className="text-xs text-purple-700 mb-2">{reasoning}</p>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAccept(blockId, suggestedRole)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 transition-colors"
            >
              <Check className="w-3 h-3" />
              Accept
            </button>
            <button
              onClick={() => {
                setIsDismissed(true);
                onDismiss(blockId);
              }}
              className="inline-flex items-center gap-1 px-3 py-1 bg-white text-purple-700 text-xs font-medium rounded border border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <X className="w-3 h-3" />
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * AIRoleSuggestionBadge - Minimal badge showing statistical role with AI indicator
 */
export function AIRoleSuggestionBadge({
  role,
  isAISuggested = false,
  isConfirmed = false,
}: {
  role: StatisticalRole;
  isAISuggested?: boolean;
  isConfirmed?: boolean;
}) {
  const roleLabel = getStatisticalRoleLabel(role);
  const roleColorClass = getStatisticalRoleColor(role);

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${roleColorClass}`}
    >
      {isAISuggested && !isConfirmed && (
        <Sparkles className="w-3 h-3 opacity-75" />
      )}
      {isConfirmed && (
        <Check className="w-3 h-3 text-green-600" />
      )}
      <span>{roleLabel}</span>
    </div>
  );
}

export default AIRoleSuggestion;
