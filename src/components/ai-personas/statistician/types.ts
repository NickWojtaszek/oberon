// AI-Powered Statistician Types
// Dr. Saga - Statistical Analysis Assistant

import type { SchemaBlock, DataType } from '../../protocol-workbench/types';
import type { StudyDesignType } from '../../../types/studyDesigns';

// Re-export as StudyType for convenience
export type StudyType = StudyDesignType;

// =============================================================================
// CONTEXT TYPES - What the AI reads to make suggestions
// =============================================================================

/**
 * Complete analysis context gathered from the system
 */
export interface StatisticalAnalysisContext {
  protocol: ProtocolContext;
  schema: SchemaContext;
  data: DataContext;
  foundationalPapers?: FoundationalPapersContext;

  // Detected clinical domain from benchmark library
  detectedDomain?: {
    domain: string;
    subspecialty?: string;
    confidence: number;
    matchedEndpoints: Array<{
      variableId: string;
      variableLabel: string;
      endpointName: string;
      benchmarks: {
        acceptable: { low: number; high: number };
        concerning: number;
      };
      recommendedAnalysis: string;
    }>;
    matchedRiskFactors: Array<{
      variableId: string;
      variableLabel: string;
      riskFactorName: string;
      expectedEffect?: number;
      direction: 'harmful' | 'protective';
    }>;
  };
}

export interface ProtocolContext {
  pico: {
    population: string;
    intervention: string;
    comparison: string;
    outcome: string;
    timeframe?: string;
    confidence?: number;
  };
  studyDesign: StudyType;
  studyPhase?: string;
  primaryObjective?: string;
  secondaryObjectives?: string[];
  statisticalPlan?: string;
}

export interface SchemaContext {
  blocks: SchemaBlockSummary[];
  predictors: SchemaBlockSummary[];
  outcomes: SchemaBlockSummary[];
  primaryEndpoints: SchemaBlockSummary[];
  secondaryEndpoints: SchemaBlockSummary[];
  exploratoryEndpoints: SchemaBlockSummary[];
}

export interface DataContext {
  totalRecords: number;
  completedRecords: number;
  variableDistributions: Record<string, DataDistributionSummary>;
  missingDataSummary: MissingDataSummary;
  sampleSizeByGroup?: Record<string, number>;
}

export interface FoundationalPapersContext {
  papers: FoundationalPaperSummary[];
  synthesizedMethods?: string;
  commonStatisticalApproaches?: string[];
  suggestedEffectSizes?: Record<string, number>;
}

// =============================================================================
// SCHEMA BLOCK SUMMARY - Simplified view for AI consumption
// =============================================================================

export interface SchemaBlockSummary {
  id: string;
  name: string;
  label: string;
  dataType: DataType;
  role: 'Predictor' | 'Outcome' | 'Structure' | 'All';
  endpointTier: 'primary' | 'secondary' | 'exploratory' | null;
  analysisMethod: string | null;
  unit?: string;
  options?: string[]; // For categorical variables
  hasData: boolean;
  completeness: number; // 0-1
  distribution?: DataDistributionSummary;
  // AI Statistical Planning fields (from confirmed AIStatisticalPlan)
  statisticalRole?: import('../../protocol-workbench/types').StatisticalRole;
  statisticalRoleConfirmed?: boolean;
}

export interface DataDistributionSummary {
  type: 'continuous' | 'categorical' | 'binary' | 'time-to-event';
  n: number;
  missing: number;
  // For continuous
  mean?: number;
  sd?: number;
  median?: number;
  iqr?: [number, number];
  min?: number;
  max?: number;
  isNormal?: boolean;
  skewness?: number;
  // For categorical/binary
  frequencies?: Record<string, number>;
  proportions?: Record<string, number>;
  categories?: string[];
}

export interface MissingDataSummary {
  overallMissingRate: number;
  byVariable: Record<string, { count: number; percentage: number }>;
  pattern: 'MCAR' | 'MAR' | 'MNAR' | 'unknown';
  patternConfidence: number;
}

export interface FoundationalPaperSummary {
  title: string;
  authors: string;
  year: string;
  statisticalMethods: string[];
  sampleSize?: number;
  effectSize?: number;
  effectSizeType?: string;
  primaryEndpoint?: string;
}

// =============================================================================
// SUGGESTION TYPES - What the AI generates
// =============================================================================

export type SuggestionType =
  | 'descriptive'          // Summary statistics (auto-execute)
  | 'normality-check'      // Distribution checks (auto-execute)
  | 'primary-analysis'     // Main analysis for primary endpoint
  | 'secondary-analysis'   // Analysis for secondary endpoints
  | 'exploratory-analysis' // Data-driven exploration
  | 'assumption-check'     // Test assumptions
  | 'sample-size-review'   // Power/sample adequacy
  | 'missing-data-strategy'// Imputation or exclusion
  | 'multiplicity-adjustment' // Multiple testing correction
  | 'sensitivity-analysis' // Robustness checks
  | 'subgroup-analysis'    // Stratified analyses
  | 'effect-size-estimation'; // Magnitude of effect

export type AnalysisType =
  | 'descriptive'
  | 'normality-test'
  | 't-test'
  | 'paired-t-test'
  | 'anova'
  | 'repeated-anova'
  | 'chi-square'
  | 'fisher-exact'
  | 'mcnemar'
  | 'pearson-correlation'
  | 'spearman-correlation'
  | 'mann-whitney'
  | 'wilcoxon'
  | 'kruskal-wallis'
  | 'linear-regression'
  | 'logistic-regression'
  | 'cox-regression'
  | 'kaplan-meier'
  | 'log-rank'
  | 'diagnostic-accuracy';

/**
 * A complete analysis suggestion from the AI
 */
export interface AnalysisSuggestion {
  id: string;
  suggestionType: SuggestionType;
  priority: 'critical' | 'recommended' | 'optional';

  // What the AI is suggesting
  title: string;
  description: string;
  rationale: string;

  // Grounding: Where this comes from
  grounding: SuggestionGrounding;

  // The actual proposed analysis
  proposedAnalysis: ProposedAnalysis;

  // Alternatives if user doesn't accept primary
  alternatives?: ProposedAnalysis[];

  // Confidence and validation
  confidence: number; // 0-100
  feasibilityCheck: FeasibilityResult;

  // Auto-execution flag
  autoExecute: boolean; // True for descriptive stats, normality checks

  // Tracking
  status: SuggestionStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  modificationNotes?: string;
  executedAt?: string;
  executionResult?: AnalysisExecutionResult;
}

export type SuggestionStatus =
  | 'pending'
  | 'accepted'
  | 'modified'
  | 'rejected'
  | 'executing'
  | 'executed'
  | 'failed';

export interface SuggestionGrounding {
  protocolReference?: string;   // "Matches primary objective..."
  schemaReference?: string[];   // Variable IDs used
  literatureReference?: string; // "Based on Smith et al. 2023..."
  regulatoryReference?: string; // "Per ICH E9 Section 5.1..."
}

// =============================================================================
// PROPOSED ANALYSIS - The actual test configuration
// =============================================================================

export interface ProposedAnalysis {
  analysisId: string;
  analysisType: AnalysisType;

  // Variables involved
  predictor?: SchemaBlockSummary;
  outcome: SchemaBlockSummary;
  covariates?: SchemaBlockSummary[];
  stratificationFactors?: SchemaBlockSummary[];

  // Statistical method details
  method: StatisticalMethod;
  parameters: AnalysisParameters;

  // Expected outputs
  expectedOutputs: ExpectedOutputs;

  // Execution readiness
  executionReady: boolean;
  blockers?: string[];
}

export interface StatisticalMethod {
  name: string;
  category: 'descriptive' | 'parametric' | 'non-parametric' | 'regression' | 'survival' | 'diagnostic';
  assumptions: string[];
  references: string[]; // ICH E9, CONSORT, etc.
}

export interface AnalysisParameters {
  // Common parameters
  alpha?: number; // Default 0.05
  tails?: 'one' | 'two';
  confidenceLevel?: number; // Default 0.95

  // Test-specific parameters
  pairedData?: boolean;
  equalVariances?: boolean;
  continuityCorrection?: boolean;

  // Multiplicity adjustment
  multiplicityMethod?: 'bonferroni' | 'holm' | 'hochberg' | 'fdr' | 'none';

  // Regression parameters
  modelType?: 'linear' | 'logistic' | 'cox' | 'poisson';
  interactionTerms?: string[][];

  // Custom overrides
  customParameters?: Record<string, unknown>;
}

export interface ExpectedOutputs {
  primaryStatistic: string; // e.g., "Mean difference", "Odds ratio", "Hazard ratio"
  confidenceInterval: boolean;
  pValue: boolean;
  effectSize?: string; // e.g., "Cohen's d", "Odds ratio"
  visualization?: ChartType;
}

export type ChartType =
  | 'bar'
  | 'histogram'
  | 'boxplot'
  | 'scatter'
  | 'line'
  | 'kaplan-meier'
  | 'forest-plot'
  | 'heatmap';

// =============================================================================
// FEASIBILITY - Can this analysis actually run?
// =============================================================================

export interface FeasibilityResult {
  feasible: boolean;
  sampleSizeAdequate: boolean;
  assumptionsMet: boolean;
  dataComplete: boolean;
  issues: FeasibilityIssue[];
  powerEstimate?: number;
  minimumSampleSize?: number;
}

export interface FeasibilityIssue {
  type: 'sample-size' | 'missing-data' | 'assumption-violation' | 'data-type-mismatch' | 'insufficient-groups';
  severity: 'blocking' | 'warning' | 'info';
  message: string;
  resolution?: string;
}

// =============================================================================
// EXECUTION RESULTS
// =============================================================================

export interface AnalysisExecutionResult {
  success: boolean;
  error?: string;
  executedAt: string;
  executionTimeMs: number;

  // Results vary by analysis type
  results: AnalysisResults;
}

export type AnalysisResults =
  | DescriptiveResults
  | TTestResults
  | ChiSquareResults
  | CorrelationResults
  | RegressionResults
  | SurvivalResults;

export interface DescriptiveResults {
  type: 'descriptive';
  continuous?: {
    n: number;
    mean: number;
    sd: number;
    median: number;
    iqr: [number, number];
    min: number;
    max: number;
    missing: number;
  };
  categorical?: {
    n: number;
    frequencies: Record<string, number>;
    percentages: Record<string, number>;
    missing: number;
  };
}

export interface TTestResults {
  type: 't-test';
  tStatistic: number;
  pValue: number;
  degreesOfFreedom: number;
  meanDifference: number;
  confidenceInterval: [number, number];
  effectSize: number; // Cohen's d
  group1: { n: number; mean: number; sd: number };
  group2: { n: number; mean: number; sd: number };
}

export interface ChiSquareResults {
  type: 'chi-square' | 'fisher-exact';
  chiSquare?: number;
  pValue: number;
  degreesOfFreedom?: number;
  oddsRatio?: number;
  oddsRatioCI?: [number, number];
  contingencyTable: number[][];
  expectedFrequencies?: number[][];
}

export interface CorrelationResults {
  type: 'pearson' | 'spearman';
  coefficient: number;
  pValue: number;
  confidenceInterval: [number, number];
  n: number;
  r2?: number;
}

export interface RegressionResults {
  type: 'linear' | 'logistic' | 'cox';
  coefficients: Array<{
    variable: string;
    estimate: number;
    standardError: number;
    statistic: number;
    pValue: number;
    confidenceInterval: [number, number];
  }>;
  modelFit: {
    r2?: number;
    adjustedR2?: number;
    aic?: number;
    bic?: number;
    logLikelihood?: number;
  };
  overall: {
    fStatistic?: number;
    chiSquare?: number;
    pValue: number;
  };
}

export interface SurvivalResults {
  type: 'kaplan-meier' | 'log-rank' | 'cox';
  logRankChiSquare?: number;
  pValue: number;
  hazardRatio?: number;
  hazardRatioCI?: [number, number];
  medianSurvival: Record<string, number | null>;
  survivalCurves?: Array<{
    group: string;
    times: number[];
    survival: number[];
    censored: boolean[];
  }>;
}

// =============================================================================
// USER WORKFLOW TYPES
// =============================================================================

export interface SuggestionReview {
  suggestionId: string;
  decision: 'accept' | 'accept-modified' | 'reject' | 'defer';
  modifications?: Partial<ProposedAnalysis>;
  reason?: string;
  reviewedBy: string;
  reviewedAt: string;
}

export interface AnalysisQueue {
  autoExecuted: AnalysisSuggestion[];  // Descriptive stats that ran automatically
  pending: AnalysisSuggestion[];       // Awaiting user review
  accepted: AnalysisSuggestion[];      // Approved, ready to execute
  executed: AnalysisSuggestion[];      // Completed with results
  rejected: AnalysisSuggestion[];      // User declined
}

// =============================================================================
// SERVICE CONFIGURATION
// =============================================================================

export interface StatisticianConfig {
  autoGenerateThreshold: number;  // Max variables for auto-generation (default: 5)
  autoExecuteDescriptive: boolean;
  autoExecuteNormality: boolean;
  defaultAlpha: number;
  defaultConfidenceLevel: number;
  enableLiteratureGrounding: boolean;
}

export const DEFAULT_STATISTICIAN_CONFIG: StatisticianConfig = {
  autoGenerateThreshold: 5,
  autoExecuteDescriptive: true,
  autoExecuteNormality: true,
  defaultAlpha: 0.05,
  defaultConfidenceLevel: 0.95,
  enableLiteratureGrounding: true,
};
