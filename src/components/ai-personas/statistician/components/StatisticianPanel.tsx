// StatisticianPanel
// Main UI panel for the AI-powered Statistician

import React, { useState } from 'react';
import {
  Brain,
  Play,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
} from 'lucide-react';
import type { SchemaBlock, ProtocolVersion } from '../../../protocol-workbench/types';
import type { ClinicalDataRecord } from '../../../../utils/dataStorage';
import type { FoundationalPaperExtraction } from '../../../../services/geminiService';
import { useStatistician } from '../hooks/useStatistician';
import { SuggestionCard } from './SuggestionCard';
import { ExecutionResultCard } from './ExecutionResultCard';
import { ContextSummaryCard } from './ContextSummaryCard';

interface StatisticianPanelProps {
  protocol: ProtocolVersion | null;
  schemaBlocks: SchemaBlock[];
  records: ClinicalDataRecord[];
  foundationalPapers?: FoundationalPaperExtraction[];
}

export function StatisticianPanel({
  protocol,
  schemaBlocks,
  records,
  foundationalPapers,
}: StatisticianPanelProps) {
  const {
    context,
    queue,
    isLoading,
    isGenerating,
    isExecuting,
    error,
    generateSuggestions,
    reviewSuggestion,
    executeAccepted,
    pendingCount,
    acceptedCount,
    executedCount,
    hasAutoExecuted,
  } = useStatistician({
    protocol,
    schemaBlocks,
    records,
    foundationalPapers,
    autoGenerate: true,
  });

  const [showAutoExecuted, setShowAutoExecuted] = useState(true);
  const [showExecuted, setShowExecuted] = useState(true);
  const [showRejected, setShowRejected] = useState(false);

  if (!protocol) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <FileText className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg">No protocol selected</p>
        <p className="text-sm mt-2">Select a protocol to generate analysis suggestions</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-purple-900">Dr. Saga</h2>
              <p className="text-sm text-purple-700">Statistical Analysis Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => generateSuggestions(true)}
              disabled={isGenerating || isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Plan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-slate-600">Pending:</span>
            <span className="font-medium text-amber-700">{pendingCount}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-slate-600">Accepted:</span>
            <span className="font-medium text-green-700">{acceptedCount}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Play className="w-4 h-4 text-blue-600" />
            <span className="text-slate-600">Executed:</span>
            <span className="font-medium text-blue-700">{executedCount}</span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex-shrink-0 bg-red-50 border-b border-red-200 p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Context Summary */}
        {context && <ContextSummaryCard context={context} />}

        {/* Auto-Executed Results (Descriptive Stats) */}
        {hasAutoExecuted && (
          <section>
            <button
              onClick={() => setShowAutoExecuted(!showAutoExecuted)}
              className="flex items-center gap-2 w-full text-left mb-3"
            >
              {showAutoExecuted ? (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              )}
              <h3 className="text-sm font-semibold text-slate-700">
                Descriptive Statistics ({queue.autoExecuted.length})
              </h3>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">
                Auto-executed
              </span>
            </button>

            {showAutoExecuted && (
              <div className="space-y-3">
                {queue.autoExecuted.map(suggestion => (
                  <ExecutionResultCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    compact
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Pending Suggestions */}
        {pendingCount > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              Pending Review ({pendingCount})
            </h3>

            {/* Critical */}
            {queue.pending.filter(s => s.priority === 'critical').length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-medium text-red-700 mb-2 flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  CRITICAL
                </div>
                <div className="space-y-3">
                  {queue.pending
                    .filter(s => s.priority === 'critical')
                    .map(suggestion => (
                      <SuggestionCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        onAccept={() =>
                          reviewSuggestion(suggestion.id, {
                            decision: 'accept',
                            reviewedBy: 'Current User',
                            reviewedAt: new Date().toISOString(),
                          })
                        }
                        onReject={reason =>
                          reviewSuggestion(suggestion.id, {
                            decision: 'reject',
                            reason,
                            reviewedBy: 'Current User',
                            reviewedAt: new Date().toISOString(),
                          })
                        }
                        onModify={modifications =>
                          reviewSuggestion(suggestion.id, {
                            decision: 'accept-modified',
                            modifications,
                            reviewedBy: 'Current User',
                            reviewedAt: new Date().toISOString(),
                          })
                        }
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Recommended */}
            {queue.pending.filter(s => s.priority === 'recommended').length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-medium text-blue-700 mb-2 flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  RECOMMENDED
                </div>
                <div className="space-y-3">
                  {queue.pending
                    .filter(s => s.priority === 'recommended')
                    .map(suggestion => (
                      <SuggestionCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        onAccept={() =>
                          reviewSuggestion(suggestion.id, {
                            decision: 'accept',
                            reviewedBy: 'Current User',
                            reviewedAt: new Date().toISOString(),
                          })
                        }
                        onReject={reason =>
                          reviewSuggestion(suggestion.id, {
                            decision: 'reject',
                            reason,
                            reviewedBy: 'Current User',
                            reviewedAt: new Date().toISOString(),
                          })
                        }
                        onModify={modifications =>
                          reviewSuggestion(suggestion.id, {
                            decision: 'accept-modified',
                            modifications,
                            reviewedBy: 'Current User',
                            reviewedAt: new Date().toISOString(),
                          })
                        }
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Optional */}
            {queue.pending.filter(s => s.priority === 'optional').length > 0 && (
              <div>
                <div className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full" />
                  OPTIONAL
                </div>
                <div className="space-y-3">
                  {queue.pending
                    .filter(s => s.priority === 'optional')
                    .map(suggestion => (
                      <SuggestionCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        onAccept={() =>
                          reviewSuggestion(suggestion.id, {
                            decision: 'accept',
                            reviewedBy: 'Current User',
                            reviewedAt: new Date().toISOString(),
                          })
                        }
                        onReject={reason =>
                          reviewSuggestion(suggestion.id, {
                            decision: 'reject',
                            reason,
                            reviewedBy: 'Current User',
                            reviewedAt: new Date().toISOString(),
                          })
                        }
                        onModify={modifications =>
                          reviewSuggestion(suggestion.id, {
                            decision: 'accept-modified',
                            modifications,
                            reviewedBy: 'Current User',
                            reviewedAt: new Date().toISOString(),
                          })
                        }
                      />
                    ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Accepted - Ready to Execute */}
        {acceptedCount > 0 && (
          <section className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-green-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Ready to Execute ({acceptedCount})
              </h3>
              <button
                onClick={executeAccepted}
                disabled={isExecuting}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Execute All
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2">
              {queue.accepted.map(suggestion => (
                <div
                  key={suggestion.id}
                  className="bg-white rounded-lg p-3 border border-green-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-slate-800">
                        {suggestion.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {suggestion.proposedAnalysis.method.name}
                      </p>
                    </div>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">
                      {suggestion.status === 'modified' ? 'Modified' : 'Accepted'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Executed Results */}
        {queue.executed.length > 0 && (
          <section>
            <button
              onClick={() => setShowExecuted(!showExecuted)}
              className="flex items-center gap-2 w-full text-left mb-3"
            >
              {showExecuted ? (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              )}
              <h3 className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                <Play className="w-4 h-4" />
                Executed Analyses ({queue.executed.length})
              </h3>
            </button>

            {showExecuted && (
              <div className="space-y-3">
                {queue.executed.map(suggestion => (
                  <ExecutionResultCard key={suggestion.id} suggestion={suggestion} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Rejected */}
        {queue.rejected.length > 0 && (
          <section>
            <button
              onClick={() => setShowRejected(!showRejected)}
              className="flex items-center gap-2 w-full text-left mb-3"
            >
              {showRejected ? (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              )}
              <h3 className="text-sm font-semibold text-slate-500">
                Rejected ({queue.rejected.length})
              </h3>
            </button>

            {showRejected && (
              <div className="space-y-2">
                {queue.rejected.map(suggestion => (
                  <div
                    key={suggestion.id}
                    className="bg-slate-50 rounded-lg p-3 border border-slate-200 opacity-60"
                  >
                    <p className="font-medium text-sm text-slate-600 line-through">
                      {suggestion.title}
                    </p>
                    {suggestion.modificationNotes && (
                      <p className="text-xs text-slate-500 mt-1">
                        Reason: {suggestion.modificationNotes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Empty State */}
        {!isGenerating &&
          pendingCount === 0 &&
          acceptedCount === 0 &&
          executedCount === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Brain className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">No analysis suggestions yet</p>
              <p className="text-sm mt-2">Click &quot;Generate Plan&quot; to get started</p>
            </div>
          )}
      </div>
    </div>
  );
}
