// SuggestionCard
// Displays a single analysis suggestion with accept/modify/reject actions

import React, { useState } from 'react';
import {
  Check,
  X,
  Edit2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  BookOpen,
  Target,
} from 'lucide-react';
import type { AnalysisSuggestion, ProposedAnalysis } from '../types';

interface SuggestionCardProps {
  suggestion: AnalysisSuggestion;
  onAccept: () => void;
  onReject: (reason: string) => void;
  onModify: (modifications: Partial<ProposedAnalysis>) => void;
}

export function SuggestionCard({
  suggestion,
  onAccept,
  onReject,
  onModify,
}: SuggestionCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const priorityStyles = {
    critical: {
      border: 'border-red-200',
      bg: 'bg-red-50',
      badge: 'bg-red-100 text-red-700',
    },
    recommended: {
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      badge: 'bg-blue-100 text-blue-700',
    },
    optional: {
      border: 'border-slate-200',
      bg: 'bg-slate-50',
      badge: 'bg-slate-100 text-slate-700',
    },
  };

  const styles = priorityStyles[suggestion.priority];

  const handleReject = () => {
    onReject(rejectReason);
    setShowRejectDialog(false);
    setRejectReason('');
  };

  return (
    <div className={`rounded-lg border ${styles.border} ${styles.bg} overflow-hidden`}>
      {/* Main Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-slate-900">{suggestion.title}</h4>
              <span className={`text-xs px-2 py-0.5 rounded ${styles.badge}`}>
                {suggestion.priority}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                {suggestion.confidence}% confidence
              </span>
            </div>

            <p className="text-sm text-slate-600 mb-2">{suggestion.description}</p>

            {/* Variables */}
            <div className="flex flex-wrap gap-2 text-xs">
              {suggestion.proposedAnalysis.predictor && (
                <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200">
                  <Target className="w-3 h-3 text-orange-500" />
                  {suggestion.proposedAnalysis.predictor.label}
                </span>
              )}
              <span className="text-slate-400">→</span>
              <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200">
                <Target className="w-3 h-3 text-blue-500" />
                {suggestion.proposedAnalysis.outcome.label}
              </span>
            </div>
          </div>

          {/* Confidence Circle */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
            <span className="text-sm font-bold text-slate-700">
              {suggestion.confidence}
            </span>
          </div>
        </div>

        {/* Feasibility Warnings */}
        {suggestion.feasibilityCheck.issues.length > 0 && (
          <div className="mt-3 space-y-1">
            {suggestion.feasibilityCheck.issues.slice(0, 2).map((issue, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 text-xs p-2 rounded ${
                  issue.severity === 'blocking'
                    ? 'bg-red-100 text-red-800'
                    : issue.severity === 'warning'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {issue.severity === 'blocking' ? (
                  <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                )}
                <span>{issue.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={onAccept}
            disabled={!suggestion.feasibilityCheck.feasible}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Check className="w-4 h-4" />
            Accept
          </button>

          <button
            onClick={() => setShowRejectDialog(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
            Reject
          </button>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 px-3 py-1.5 text-slate-600 text-sm hover:bg-white rounded-lg transition-colors ml-auto"
          >
            {showDetails ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Details
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="border-t border-slate-200 bg-white p-4 space-y-4">
          {/* Rationale */}
          <div>
            <h5 className="text-xs font-semibold text-slate-500 uppercase mb-1">
              Rationale
            </h5>
            <p className="text-sm text-slate-700">{suggestion.rationale}</p>
          </div>

          {/* Method Details */}
          <div>
            <h5 className="text-xs font-semibold text-slate-500 uppercase mb-1">
              Statistical Method
            </h5>
            <p className="text-sm font-medium text-slate-800">
              {suggestion.proposedAnalysis.method.name}
            </p>
            {suggestion.proposedAnalysis.method.assumptions.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-slate-500 mb-1">Assumptions:</p>
                <ul className="text-xs text-slate-600 list-disc list-inside">
                  {suggestion.proposedAnalysis.method.assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Parameters */}
          <div>
            <h5 className="text-xs font-semibold text-slate-500 uppercase mb-1">
              Parameters
            </h5>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-slate-100 px-2 py-1 rounded">
                α = {suggestion.proposedAnalysis.parameters.alpha || 0.05}
              </span>
              <span className="bg-slate-100 px-2 py-1 rounded">
                {suggestion.proposedAnalysis.parameters.tails || 'two'}-tailed
              </span>
              <span className="bg-slate-100 px-2 py-1 rounded">
                CI = {(suggestion.proposedAnalysis.parameters.confidenceLevel || 0.95) * 100}%
              </span>
            </div>
          </div>

          {/* Grounding */}
          <div>
            <h5 className="text-xs font-semibold text-slate-500 uppercase mb-1">
              References
            </h5>
            <div className="space-y-1">
              {suggestion.grounding.protocolReference && (
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <Target className="w-3 h-3 flex-shrink-0 mt-0.5 text-blue-500" />
                  <span>{suggestion.grounding.protocolReference}</span>
                </div>
              )}
              {suggestion.grounding.regulatoryReference && (
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <BookOpen className="w-3 h-3 flex-shrink-0 mt-0.5 text-green-500" />
                  <span>{suggestion.grounding.regulatoryReference}</span>
                </div>
              )}
              {suggestion.grounding.literatureReference && (
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <BookOpen className="w-3 h-3 flex-shrink-0 mt-0.5 text-purple-500" />
                  <span>{suggestion.grounding.literatureReference}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="border-t border-slate-200 bg-white p-4">
          <h5 className="text-sm font-medium text-slate-800 mb-2">
            Reason for rejection (optional)
          </h5>
          <textarea
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            placeholder="Enter reason..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={2}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setShowRejectDialog(false)}
              className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Confirm Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
