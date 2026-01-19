// useStatistician Hook
// React hook for managing Statistician AI state

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { SchemaBlock, ProtocolVersion } from '../../../protocol-workbench/types';
import type { ClinicalDataRecord } from '../../../../utils/dataStorage';
import type { FoundationalPaperExtraction } from '../../../../services/geminiService';
import type {
  StatisticalAnalysisContext,
  AnalysisSuggestion,
  AnalysisQueue,
  SuggestionReview,
  StatisticianConfig,
} from '../types';
import { StatisticianService } from '../StatisticianService';

interface UseStatisticianOptions {
  protocol: ProtocolVersion | null;
  schemaBlocks: SchemaBlock[];
  records: ClinicalDataRecord[];
  foundationalPapers?: FoundationalPaperExtraction[];
  config?: Partial<StatisticianConfig>;
  autoGenerate?: boolean;
}

interface UseStatisticianReturn {
  // State
  context: StatisticalAnalysisContext | null;
  queue: AnalysisQueue;
  isLoading: boolean;
  isGenerating: boolean;
  isExecuting: boolean;
  error: string | null;

  // Actions
  generateSuggestions: (useAI?: boolean) => Promise<void>;
  reviewSuggestion: (suggestionId: string, review: Omit<SuggestionReview, 'suggestionId'>) => void;
  executeAccepted: () => Promise<void>;
  executeSingle: (suggestionId: string) => Promise<void>;
  clearQueue: () => void;
  refreshContext: () => void;

  // Computed
  pendingCount: number;
  acceptedCount: number;
  executedCount: number;
  hasAutoExecuted: boolean;
}

export function useStatistician({
  protocol,
  schemaBlocks,
  records,
  foundationalPapers,
  config,
  autoGenerate = true,
}: UseStatisticianOptions): UseStatisticianReturn {
  // Initialize service
  const service = useMemo(() => new StatisticianService(config), [config]);

  // State
  const [context, setContext] = useState<StatisticalAnalysisContext | null>(null);
  const [queue, setQueue] = useState<AnalysisQueue>({
    autoExecuted: [],
    pending: [],
    accepted: [],
    executed: [],
    rejected: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Build context when inputs change
  useEffect(() => {
    if (protocol && schemaBlocks.length > 0) {
      setIsLoading(true);
      try {
        const newContext = service.buildContext(
          protocol,
          schemaBlocks,
          records,
          foundationalPapers
        );
        setContext(newContext);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to build context');
      } finally {
        setIsLoading(false);
      }
    }
  }, [protocol, schemaBlocks, records, foundationalPapers, service]);

  // Auto-generate if enabled and conditions are met
  useEffect(() => {
    if (
      autoGenerate &&
      context &&
      !hasGenerated &&
      !isGenerating &&
      service.shouldAutoGenerate(context)
    ) {
      generateSuggestions(true);
    }
  }, [context, autoGenerate, hasGenerated, isGenerating]);

  // Generate suggestions
  const generateSuggestions = useCallback(
    async (useAI: boolean = true) => {
      if (!context) {
        setError('No context available');
        return;
      }

      setIsGenerating(true);
      setError(null);

      try {
        const suggestions = await service.generateAnalysisPlan(context, useAI);
        const initialQueue = await service.initializeQueue(suggestions, context, records);
        setQueue(initialQueue);
        setHasGenerated(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate suggestions');
      } finally {
        setIsGenerating(false);
      }
    },
    [context, records, service]
  );

  // Review a suggestion
  const reviewSuggestion = useCallback(
    (suggestionId: string, review: Omit<SuggestionReview, 'suggestionId'>) => {
      setQueue(prevQueue => {
        const pendingIndex = prevQueue.pending.findIndex(s => s.id === suggestionId);
        if (pendingIndex === -1) return prevQueue;

        const suggestion = prevQueue.pending[pendingIndex];
        const fullReview: SuggestionReview = {
          ...review,
          suggestionId,
        };

        const updatedSuggestion = service.processSuggestionReview(suggestion, fullReview);

        const newPending = [...prevQueue.pending];
        newPending.splice(pendingIndex, 1);

        const newQueue = { ...prevQueue, pending: newPending };

        switch (updatedSuggestion.status) {
          case 'accepted':
          case 'modified':
            newQueue.accepted = [...prevQueue.accepted, updatedSuggestion];
            break;
          case 'rejected':
            newQueue.rejected = [...prevQueue.rejected, updatedSuggestion];
            break;
        }

        return newQueue;
      });
    },
    [service]
  );

  // Execute all accepted analyses
  const executeAccepted = useCallback(async () => {
    if (!context || queue.accepted.length === 0) return;

    setIsExecuting(true);
    setError(null);

    try {
      const updatedQueue = await service.executeAcceptedAnalyses(queue, records, context);
      setQueue(updatedQueue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Execution failed');
    } finally {
      setIsExecuting(false);
    }
  }, [context, queue, records, service]);

  // Execute a single suggestion
  const executeSingle = useCallback(
    async (suggestionId: string) => {
      if (!context) return;

      const suggestion =
        queue.accepted.find(s => s.id === suggestionId) ||
        queue.pending.find(s => s.id === suggestionId);

      if (!suggestion) return;

      setIsExecuting(true);
      setError(null);

      try {
        const result = await service.executeAnalysis(suggestion, records, context);

        setQueue(prevQueue => {
          const newQueue = { ...prevQueue };

          // Remove from pending or accepted
          newQueue.pending = prevQueue.pending.filter(s => s.id !== suggestionId);
          newQueue.accepted = prevQueue.accepted.filter(s => s.id !== suggestionId);

          // Add to executed
          newQueue.executed = [
            ...prevQueue.executed,
            {
              ...suggestion,
              status: 'executed',
              executedAt: result.executedAt,
              executionResult: result,
            },
          ];

          return newQueue;
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Execution failed');
      } finally {
        setIsExecuting(false);
      }
    },
    [context, queue, records, service]
  );

  // Clear queue and reset
  const clearQueue = useCallback(() => {
    setQueue({
      autoExecuted: [],
      pending: [],
      accepted: [],
      executed: [],
      rejected: [],
    });
    setHasGenerated(false);
    setError(null);
  }, []);

  // Refresh context
  const refreshContext = useCallback(() => {
    if (protocol && schemaBlocks.length > 0) {
      const newContext = service.buildContext(
        protocol,
        schemaBlocks,
        records,
        foundationalPapers
      );
      setContext(newContext);
    }
  }, [protocol, schemaBlocks, records, foundationalPapers, service]);

  // Computed values
  const pendingCount = queue.pending.length;
  const acceptedCount = queue.accepted.length;
  const executedCount = queue.executed.length + queue.autoExecuted.length;
  const hasAutoExecuted = queue.autoExecuted.length > 0;

  return {
    context,
    queue,
    isLoading,
    isGenerating,
    isExecuting,
    error,
    generateSuggestions,
    reviewSuggestion,
    executeAccepted,
    executeSingle,
    clearQueue,
    refreshContext,
    pendingCount,
    acceptedCount,
    executedCount,
    hasAutoExecuted,
  };
}
