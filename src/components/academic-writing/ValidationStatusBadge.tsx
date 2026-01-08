// Validation Status Badge Component
// Shows real-time mechanical validation status (runs in all AI modes)

import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import type { ValidationResult } from '../../services/manuscriptValidationService';

interface ValidationStatusBadgeProps {
  result: ValidationResult;
  aiMode: 'manual' | 'co-pilot' | 'autopilot';
  compact?: boolean;
}

export function ValidationStatusBadge({ result, aiMode, compact = false }: ValidationStatusBadgeProps) {
  const errorCount = result.mechanicalIssues.filter(i => i.severity === 'error').length;
  const warningCount = result.mechanicalIssues.filter(i => i.severity === 'warning').length;
  const totalIssues = result.totalIssues;

  // Determine badge color based on issues
  const getBadgeStyle = () => {
    if (errorCount > 0) {
      return {
        bg: 'bg-red-100',
        border: 'border-red-300',
        text: 'text-red-700',
        icon: 'text-red-600',
        Icon: AlertCircle,
      };
    }
    if (warningCount > 0) {
      return {
        bg: 'bg-amber-100',
        border: 'border-amber-300',
        text: 'text-amber-700',
        icon: 'text-amber-600',
        Icon: AlertTriangle,
      };
    }
    return {
      bg: 'bg-green-100',
      border: 'border-green-300',
      text: 'text-green-700',
      icon: 'text-green-600',
      Icon: CheckCircle2,
    };
  };

  const style = getBadgeStyle();
  const Icon = style.Icon;

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${style.bg} ${style.border}`}>
        <Icon className={`w-3.5 h-3.5 ${style.icon}`} />
        <span className={`text-xs font-medium ${style.text}`}>
          {totalIssues === 0 ? 'Valid' : `${totalIssues}`}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 p-3 rounded-lg border ${style.bg} ${style.border}`}>
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${style.icon}`} />
        <span className={`text-sm font-medium ${style.text}`}>
          {totalIssues === 0 ? 'All Checks Passed' : `${totalIssues} Issue${totalIssues !== 1 ? 's' : ''} Found`}
        </span>
      </div>

      {totalIssues > 0 && (
        <div className="text-xs space-y-1">
          {errorCount > 0 && (
            <div className={`flex items-center gap-1.5 ${style.text}`}>
              <AlertCircle className="w-3 h-3" />
              <span>{errorCount} Error{errorCount !== 1 ? 's' : ''}</span>
            </div>
          )}
          {warningCount > 0 && (
            <div className={`flex items-center gap-1.5 ${style.text}`}>
              <AlertTriangle className="w-3 h-3" />
              <span>{warningCount} Warning{warningCount !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      )}

      {aiMode === 'manual' && (
        <div className="flex items-center gap-1.5 mt-1 pt-2 border-t border-slate-200">
          <Info className="w-3 h-3 text-slate-500" />
          <span className="text-xs text-slate-600">
            Mechanical checks only
          </span>
        </div>
      )}
    </div>
  );
}

interface ValidationIssueListProps {
  result: ValidationResult;
  aiMode: 'manual' | 'co-pilot' | 'autopilot';
}

export function ValidationIssueList({ result, aiMode }: ValidationIssueListProps) {
  const allIssues = [...result.mechanicalIssues, ...result.aiSupervisionIssues];

  if (allIssues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
        <p className="text-sm font-medium text-slate-700">All validations passed!</p>
        <p className="text-xs text-slate-500 mt-1">
          Your manuscript meets all format requirements
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Mechanical Issues (always shown) */}
      {result.mechanicalIssues.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Format & Structure Checks
            <span className="text-slate-500 font-normal">(all modes)</span>
          </h4>
          <div className="space-y-2">
            {result.mechanicalIssues.map((issue, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border ${
                  issue.severity === 'error'
                    ? 'bg-red-50 border-red-200'
                    : issue.severity === 'warning'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  {issue.severity === 'error' && <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />}
                  {issue.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />}
                  {issue.severity === 'info' && <Info className="w-4 h-4 text-blue-600 mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{issue.message}</p>
                    {issue.suggestion && (
                      <p className="text-xs text-slate-600 mt-1">💡 {issue.suggestion}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      Section: {issue.section} • Type: {issue.type}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Supervision Issues (only in co-pilot/autopilot) */}
      {aiMode !== 'manual' && result.aiSupervisionIssues.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            AI Supervision Checks
            <span className="text-slate-500 font-normal">(co-pilot/autopilot only)</span>
          </h4>
          <div className="space-y-2">
            {result.aiSupervisionIssues.map((issue, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border bg-purple-50 border-purple-200"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{issue.message}</p>
                    {issue.suggestion && (
                      <p className="text-xs text-slate-600 mt-1">💡 {issue.suggestion}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      Section: {issue.section} • Type: {issue.type}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
