// StatisticianService
// Core orchestrator for the AI-powered Statistician

import type { SchemaBlock, ProtocolVersion } from '../../protocol-workbench/types';
import type { ClinicalDataRecord } from '../../../utils/dataStorage';
import type { FoundationalPaperExtraction } from '../../../services/geminiService';
import type {
  StatisticalAnalysisContext,
  AnalysisSuggestion,
  AnalysisQueue,
  SuggestionReview,
  SchemaBlockSummary,
  StatisticianConfig,
  DEFAULT_STATISTICIAN_CONFIG,
  AnalysisExecutionResult,
} from './types';

import { StatisticianContextBuilder } from './StatisticianContextBuilder';
import { StatisticianPromptEngine } from './StatisticianPromptEngine';
import { StatisticianSuggestionEngine } from './StatisticianSuggestionEngine';

// Import from geminiService - we'll add the function there
import { callGeminiForStatisticalAnalysis } from '../../../services/geminiService';

// Import execution functions - we'll add these to statisticalTests.ts
import {
  executeStatisticalAnalysis,
  calculateDescriptiveStats,
} from '../../analytics-stats/utils/statisticalExecutor';

/**
 * Main service orchestrating the Statistician AI functionality
 */
export class StatisticianService {
  private contextBuilder: StatisticianContextBuilder;
  private promptEngine: StatisticianPromptEngine;
  private suggestionEngine: StatisticianSuggestionEngine;
  private config: StatisticianConfig;

  constructor(config?: Partial<StatisticianConfig>) {
    this.contextBuilder = new StatisticianContextBuilder();
    this.promptEngine = new StatisticianPromptEngine();
    this.suggestionEngine = new StatisticianSuggestionEngine();
    this.config = {
      autoGenerateThreshold: 5,
      autoExecuteDescriptive: true,
      autoExecuteNormality: true,
      defaultAlpha: 0.05,
      defaultConfidenceLevel: 0.95,
      enableLiteratureGrounding: true,
      ...config,
    };
  }

  /**
   * Build analysis context from all available sources
   */
  buildContext(
    protocol: ProtocolVersion,
    schemaBlocks: SchemaBlock[],
    records: ClinicalDataRecord[],
    foundationalPapers?: FoundationalPaperExtraction[],
    picoData?: { population?: string; intervention?: string; comparison?: string; outcome?: string; timeframe?: string } | null
  ): StatisticalAnalysisContext {
    return this.contextBuilder.buildContext(
      protocol,
      schemaBlocks,
      records,
      this.config.enableLiteratureGrounding ? foundationalPapers : undefined,
      picoData
    );
  }

  /**
   * Check if auto-generation should trigger
   */
  shouldAutoGenerate(context: StatisticalAnalysisContext): boolean {
    const variableCount = context.schema.blocks.length;
    return variableCount <= this.config.autoGenerateThreshold;
  }

  /**
   * Generate analysis plan - main entry point
   * Combines rule-based and AI suggestions
   */
  async generateAnalysisPlan(
    context: StatisticalAnalysisContext,
    useAI: boolean = true
  ): Promise<AnalysisSuggestion[]> {
    // 1. Generate rule-based suggestions (fast, always available)
    const ruleBased = this.suggestionEngine.generateRuleBasedSuggestions(context);

    // 2. If AI enabled, enhance with Gemini suggestions
    let aiSuggestions: AnalysisSuggestion[] = [];
    if (useAI) {
      try {
        const prompt = this.promptEngine.buildAnalysisPlanPrompt(context);
        const response = await callGeminiForStatisticalAnalysis(prompt);
        aiSuggestions = this.promptEngine.parseAnalysisPlanResponse(response);

        // Enrich AI suggestions with actual schema data
        aiSuggestions = this.enrichSuggestionsWithSchemaData(aiSuggestions, context);
      } catch (error) {
        console.error('AI suggestion generation failed, using rule-based only:', error);
      }
    }

    // 3. Merge and deduplicate
    let merged = this.suggestionEngine.mergeSuggestions(ruleBased, aiSuggestions);

    // 4. Check feasibility for all suggestions
    merged = merged.map(suggestion => ({
      ...suggestion,
      feasibilityCheck: this.suggestionEngine.checkFeasibility(
        suggestion.proposedAnalysis,
        context
      ),
    }));

    // 5. Prioritize
    merged = this.suggestionEngine.prioritizeSuggestions(merged, context);

    return merged;
  }

  /**
   * Process suggestions into initial queue state
   * Auto-executes safe analyses if configured
   */
  async initializeQueue(
    suggestions: AnalysisSuggestion[],
    context: StatisticalAnalysisContext,
    records: ClinicalDataRecord[]
  ): Promise<AnalysisQueue> {
    const queue: AnalysisQueue = {
      autoExecuted: [],
      pending: [],
      accepted: [],
      executed: [],
      rejected: [],
    };

    for (const suggestion of suggestions) {
      if (suggestion.autoExecute && suggestion.feasibilityCheck.feasible) {
        // Auto-execute descriptive and normality checks
        if (
          (suggestion.suggestionType === 'descriptive' && this.config.autoExecuteDescriptive) ||
          (suggestion.suggestionType === 'normality-check' && this.config.autoExecuteNormality)
        ) {
          try {
            const result = await this.executeAnalysis(suggestion, records, context);
            queue.autoExecuted.push({
              ...suggestion,
              status: 'executed',
              executedAt: result.executedAt,
              executionResult: result,
            });
          } catch (error) {
            console.error('Auto-execution failed:', error);
            queue.pending.push(suggestion);
          }
        } else {
          queue.pending.push(suggestion);
        }
      } else {
        queue.pending.push(suggestion);
      }
    }

    return queue;
  }

  /**
   * Process user review decision on a suggestion
   */
  processSuggestionReview(
    suggestion: AnalysisSuggestion,
    review: SuggestionReview
  ): AnalysisSuggestion {
    const updated: AnalysisSuggestion = {
      ...suggestion,
      reviewedAt: review.reviewedAt,
      reviewedBy: review.reviewedBy,
    };

    switch (review.decision) {
      case 'accept':
        updated.status = 'accepted';
        break;

      case 'accept-modified':
        updated.status = 'modified';
        updated.modificationNotes = review.reason;
        if (review.modifications) {
          updated.proposedAnalysis = {
            ...updated.proposedAnalysis,
            ...review.modifications,
          };
        }
        break;

      case 'reject':
        updated.status = 'rejected';
        updated.modificationNotes = review.reason;
        break;

      case 'defer':
        // Keep as pending
        break;
    }

    return updated;
  }

  /**
   * Execute an approved analysis
   */
  async executeAnalysis(
    suggestion: AnalysisSuggestion,
    records: ClinicalDataRecord[],
    context: StatisticalAnalysisContext
  ): Promise<AnalysisExecutionResult> {
    const startTime = Date.now();

    try {
      const results = await executeStatisticalAnalysis(
        suggestion.proposedAnalysis,
        records,
        context
      );

      return {
        success: true,
        executedAt: new Date().toISOString(),
        executionTimeMs: Date.now() - startTime,
        results,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Execution failed',
        executedAt: new Date().toISOString(),
        executionTimeMs: Date.now() - startTime,
        results: { type: 'descriptive' } as any,
      };
    }
  }

  /**
   * Execute all accepted suggestions in the queue
   */
  async executeAcceptedAnalyses(
    queue: AnalysisQueue,
    records: ClinicalDataRecord[],
    context: StatisticalAnalysisContext
  ): Promise<AnalysisQueue> {
    const updatedQueue = { ...queue };
    const toExecute = [...queue.accepted];
    updatedQueue.accepted = [];

    for (const suggestion of toExecute) {
      try {
        const result = await this.executeAnalysis(suggestion, records, context);
        updatedQueue.executed.push({
          ...suggestion,
          status: 'executed',
          executedAt: result.executedAt,
          executionResult: result,
        });
      } catch (error) {
        console.error('Execution failed for:', suggestion.id, error);
        updatedQueue.accepted.push({
          ...suggestion,
          status: 'failed',
        });
      }
    }

    return updatedQueue;
  }

  /**
   * Get real-time test recommendation for variable selection
   */
  async getTestRecommendation(
    predictor: SchemaBlockSummary | null,
    outcome: SchemaBlockSummary,
    context: StatisticalAnalysisContext,
    useAI: boolean = false
  ): Promise<{
    analysisType: string;
    method: { name: string; assumptions: string[] };
    rationale: string;
    confidence: number;
  }> {
    // Rule-based recommendation (fast)
    const ruleBased = this.suggestionEngine.selectTestByRules(predictor, outcome);

    if (!useAI) {
      return {
        analysisType: ruleBased.analysisType,
        method: ruleBased.method,
        rationale: ruleBased.rationale,
        confidence: 85,
      };
    }

    // AI-enhanced recommendation
    try {
      const prompt = this.promptEngine.buildTestRecommendationPrompt(predictor, outcome, context);
      const response = await callGeminiForStatisticalAnalysis(prompt);
      const aiRec = this.promptEngine.parseTestRecommendationResponse(response);

      if (aiRec) {
        return {
          analysisType: aiRec.analysisType,
          method: aiRec.method,
          rationale: aiRec.rationale,
          confidence: aiRec.confidence,
        };
      }
    } catch (error) {
      console.error('AI recommendation failed, using rule-based:', error);
    }

    return {
      analysisType: ruleBased.analysisType,
      method: ruleBased.method,
      rationale: ruleBased.rationale,
      confidence: 85,
    };
  }

  // ==========================================================================
  // PRIVATE HELPERS
  // ==========================================================================

  /**
   * Enrich AI suggestions with actual schema block data
   */
  private enrichSuggestionsWithSchemaData(
    suggestions: AnalysisSuggestion[],
    context: StatisticalAnalysisContext
  ): AnalysisSuggestion[] {
    const blockMap = new Map<string, SchemaBlockSummary>();
    for (const block of context.schema.blocks) {
      blockMap.set(block.id, block);
      blockMap.set(block.name, block);
      blockMap.set(block.label, block);
    }

    return suggestions.map(suggestion => {
      const analysis = suggestion.proposedAnalysis;

      // Try to find actual schema blocks for the variable IDs
      const outcomeId = analysis.outcome.id;
      const actualOutcome = blockMap.get(outcomeId);
      if (actualOutcome) {
        analysis.outcome = actualOutcome;
      }

      if (analysis.predictor) {
        const predictorId = analysis.predictor.id;
        const actualPredictor = blockMap.get(predictorId);
        if (actualPredictor) {
          analysis.predictor = actualPredictor;
        }
      }

      return {
        ...suggestion,
        proposedAnalysis: analysis,
      };
    });
  }
}

// Export singleton with default config
export const statisticianService = new StatisticianService();
