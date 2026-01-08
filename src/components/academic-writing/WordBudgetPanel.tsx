// Word Budget Panel - Live Progress Tracking (Phase 4)

import { TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { JournalConstraintStatus } from '../../types/journalProfile';

interface WordBudgetPanelProps {
  sections: Array<{
    section: string;
    status: JournalConstraintStatus | null;
  }>;
  citationStatus: {
    currentCount: number;
    limit: number;
    percentage: number;
    status: 'ok' | 'warning' | 'error';
  } | null;
}

export function WordBudgetPanel({ sections, citationStatus }: WordBudgetPanelProps) {
  const getProgressColor = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
    }
  };

  const getProgressBgColor = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok': return 'bg-green-100';
      case 'warning': return 'bg-amber-100';
      case 'error': return 'bg-red-100';
    }
  };

  const getStatusIcon = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok': return <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />;
      case 'warning': return <AlertCircle className="w-3.5 h-3.5 text-amber-600" />;
      case 'error': return <AlertCircle className="w-3.5 h-3.5 text-red-600" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg">
      <div className="px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-medium text-slate-900">Word Budget Tracker</h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Section Word Counts */}
        {sections.map(({ section, status }) => {
          if (!status) return null;

          return (
            <div key={section}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.status)}
                  <span className="text-xs font-medium text-slate-700 capitalize">
                    {section}
                  </span>
                </div>
                <div className="text-xs font-medium">
                  <span className={
                    status.status === 'error' ? 'text-red-600' : 
                    status.status === 'warning' ? 'text-amber-600' : 
                    'text-slate-700'
                  }>
                    {status.currentWords}
                  </span>
                  <span className="text-slate-500"> / {status.limit}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full transition-all duration-300 ${getProgressColor(status.status)}`}
                  style={{ width: `${Math.min(status.percentage, 100)}%` }}
                />
                {status.percentage > 100 && (
                  <div
                    className="absolute top-0 h-full bg-red-600 opacity-50 animate-pulse"
                    style={{ 
                      left: '100%',
                      width: `${Math.min(status.percentage - 100, 50)}%` 
                    }}
                  />
                )}
              </div>

              {/* Status Message */}
              {status.status !== 'ok' && (
                <div className={`mt-1 text-xs ${
                  status.status === 'error' ? 'text-red-600' : 'text-amber-600'
                }`}>
                  {status.status === 'error' 
                    ? `Exceeds limit by ${status.currentWords - status.limit} words`
                    : `${Math.round(status.percentage)}% of limit used`
                  }
                </div>
              )}
            </div>
          );
        })}

        {/* Citation Count */}
        {citationStatus && (
          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                {getStatusIcon(citationStatus.status)}
                <span className="text-xs font-medium text-slate-700">
                  Citations
                </span>
              </div>
              <div className="text-xs font-medium">
                <span className={
                  citationStatus.status === 'error' ? 'text-red-600' : 
                  citationStatus.status === 'warning' ? 'text-amber-600' : 
                  'text-slate-700'
                }>
                  {citationStatus.currentCount}
                </span>
                <span className="text-slate-500"> / {citationStatus.limit}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full transition-all duration-300 ${getProgressColor(citationStatus.status)}`}
                style={{ width: `${Math.min(citationStatus.percentage, 100)}%` }}
              />
            </div>

            {citationStatus.status !== 'ok' && (
              <div className={`mt-1 text-xs ${
                citationStatus.status === 'error' ? 'text-red-600' : 'text-amber-600'
              }`}>
                {citationStatus.status === 'error' 
                  ? `Exceeds limit by ${citationStatus.currentCount - citationStatus.limit} citations`
                  : `${Math.round(citationStatus.percentage)}% of limit used`
                }
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Overall Status</span>
            {sections.some(s => s.status?.status === 'error') || citationStatus?.status === 'error' ? (
              <span className="text-red-600 font-medium">Action Required</span>
            ) : sections.some(s => s.status?.status === 'warning') || citationStatus?.status === 'warning' ? (
              <span className="text-amber-600 font-medium">Near Limits</span>
            ) : (
              <span className="text-green-600 font-medium">Within Limits</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
