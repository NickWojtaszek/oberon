// useStatistician Hook
// React hook for managing Statistician AI state

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { SchemaBlock, ProtocolVersion, AIStatisticalPlan } from '../../../protocol-workbench/types';
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

interface PicoData {
  population?: string;
  intervention?: string;
  comparison?: string;
  outcome?: string;
  timeframe?: string;
}

interface UseStatisticianOptions {
  protocol: ProtocolVersion | null;
  schemaBlocks: SchemaBlock[];
  records: ClinicalDataRecord[];
  foundationalPapers?: FoundationalPaperExtraction[];
  picoData?: PicoData | null;
  config?: Partial<StatisticianConfig>;
  autoGenerate?: boolean;
  statisticalPlan?: AIStatisticalPlan | null; // Confirmed variable mappings from AI
}

interface GenerationProgress {
  completed: number;
  total: number;
  currentDomain: string;
  domainResults: Record<string, { count: number; success: boolean }>;
}

interface UseStatisticianReturn {
  // State
  context: StatisticalAnalysisContext | null;
  queue: AnalysisQueue;
  isLoading: boolean;
  isGenerating: boolean;
  isExecuting: boolean;
  error: string | null;
  generationProgress: GenerationProgress | null;

  // Actions
  generateSuggestions: (useAI?: boolean) => Promise<void>;
  generateSuggestionsBatched: () => Promise<void>;
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
  picoData,
  config,
  autoGenerate = true,
  statisticalPlan,
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
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null);

  // Apply confirmed statistical mappings to schema blocks
  const enrichedSchemaBlocks = useMemo(() => {
    if (!statisticalPlan || statisticalPlan.status !== 'confirmed') {
      return schemaBlocks;
    }

    // Apply confirmed mappings to blocks
    return schemaBlocks.map(block => {
      const mapping = statisticalPlan.mappings.find(m => m.blockId === block.id && m.confirmed);
      if (mapping) {
        return {
          ...block,
          statisticalRole: mapping.suggestedRole,
          roleConfirmed: true,
        };
      }
      return block;
    });
  }, [schemaBlocks, statisticalPlan]);

  // Build context when inputs change
  useEffect(() => {
    if (protocol && enrichedSchemaBlocks.length > 0) {
      setIsLoading(true);
      try {
        const newContext = service.buildContext(
          protocol,
          enrichedSchemaBlocks,
          records,
          foundationalPapers,
          picoData
        );
        setContext(newContext);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to build context');
      } finally {
        setIsLoading(false);
      }
    }
  }, [protocol, enrichedSchemaBlocks, records, foundationalPapers, picoData, service]);

  // Auto-generate if enabled and conditions are met
  // Uses batched generation for larger schemas to avoid truncation
  useEffect(() => {
    if (
      autoGenerate &&
      context &&
      !hasGenerated &&
      !isGenerating
    ) {
      // Use batched approach for larger schemas (more than 50 variables)
      // as it's more reliable and won't truncate
      if (context.schema.blocks.length > 50) {
        generateSuggestionsBatched();
      } else if (service.shouldAutoGenerate(context)) {
        generateSuggestions(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, autoGenerate, hasGenerated, isGenerating, service]);

  // Generate suggestions (single call - may truncate for large schemas)
  const generateSuggestions = useCallback(
    async (useAI: boolean = true) => {
      if (!context) {
        setError('No context available');
        return;
      }

      setIsGenerating(true);
      setError(null);
      setGenerationProgress(null);

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

  // Generate suggestions in batches by domain (more reliable for large schemas)
  const generateSuggestionsBatched = useCallback(
    async () => {
      if (!context) {
        setError('No context available');
        return;
      }

      setIsGenerating(true);
      setError(null);
      setGenerationProgress({
        completed: 0,
        total: 5,
        currentDomain: 'Starting...',
        domainResults: {},
      });

      try {
        const suggestions = await service.generateAnalysisPlanBatched(
          context,
          // On domain complete callback
          (domain, domainSuggestions) => {
            setGenerationProgress(prev => prev ? {
              ...prev,
              domainResults: {
                ...prev.domainResults,
                [domain]: { count: domainSuggestions.length, success: true },
              },
            } : null);
          },
          // On progress callback
          (completed, total, currentDomain) => {
            setGenerationProgress(prev => prev ? {
              ...prev,
              completed,
              total,
              currentDomain,
            } : null);
          }
        );

        const initialQueue = await service.initializeQueue(suggestions, context, records);
        setQueue(initialQueue);
        setHasGenerated(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate suggestions');
      } finally {
        setIsGenerating(false);
        setGenerationProgress(null);
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
    if (protocol && enrichedSchemaBlocks.length > 0) {
      const newContext = service.buildContext(
        protocol,
        enrichedSchemaBlocks,
        records,
        foundationalPapers,
        picoData
      );
      setContext(newContext);
    }
  }, [protocol, enrichedSchemaBlocks, records, foundationalPapers, picoData, service]);

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
    generationProgress,
    generateSuggestions,
    generateSuggestionsBatched,
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
