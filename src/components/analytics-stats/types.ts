// Statistical Analysis Type Definitions

export interface AnalysisVariable {
  id: string;
  name: string;
  label: string;
  dataType: 'Numeric' | 'Text' | 'Date' | 'Boolean' | 'Section';
  role: 'Predictor' | 'Outcome' | 'Covariate' | 'Structure';
  unit?: string;
  section: string;
}

export interface DescriptiveStatResult {
  variableId: string;
  label: string;
  type: 'Continuous' | 'Categorical' | 'Boolean';
  results: {
    // For continuous
    mean?: number;
    sd?: number;
    median?: number;
    iqr?: [number, number];
    min?: number;
    max?: number;
    outlierCount?: number;
    // For categorical/boolean
    frequency?: { [key: string]: number };
    percentage?: { [key: string]: number };
    // Common
    totalN: number;
    missingN: number;
    missingPercentage: number;
  };
}

export interface ComparativeAnalysisResult {
  analysisId: string;
  title: string;
  testUsed: string;
  predictor: string;
  predictorLabel: string;
  outcome: string;
  outcomeLabel: string;
  results: {
    pValue: number;
    significance: 'Significant' | 'Not Significant';
    testStatistic?: number;
    degreesOfFreedom?: number;
    oddsRatio?: number;
    hazardRatio?: number;
    confidenceInterval?: [number, number];
    effectSize?: number;
  };
  aiRationale: string;
  chartData?: any[];
}

export interface CorrelationResult {
  variable1: string;
  variable2: string;
  coefficient: number;
  pValue: number;
  method: 'Pearson' | 'Spearman';
  significance: boolean;
}

export interface RegressionResult {
  modelId: string;
  dependentVariable: string;
  covariates: string[];
  modelType: 'Linear' | 'Logistic' | 'Cox Proportional Hazards';
  results: {
    coefficients: { [variable: string]: number };
    standardErrors: { [variable: string]: number };
    pValues: { [variable: string]: number };
    confidenceIntervals: { [variable: string]: [number, number] };
    rSquared?: number;
    adjustedRSquared?: number;
    aic?: number;
    bic?: number;
  };
}

export interface StatisticalManifest {
  manifestMetadata: {
    projectId: string;
    protocolId: string;
    protocolVersion: string;
    generatedAt: number;
    generatedBy: string;
    totalRecordsAnalyzed: number;
    personaValidation: string;
    
    // NEW: Locking system for PI approval (Phase 4)
    locked?: boolean;              // Whether manifest is locked
    lockedAt?: string;             // ISO timestamp when locked
    lockedBy?: string;             // User ID/name who locked it
    lockReason?: string;           // Optional reason for locking
  };
  descriptiveStats: DescriptiveStatResult[];
  comparativeAnalyses: ComparativeAnalysisResult[];
  correlations?: CorrelationResult[];
  regressions?: RegressionResult[];
  manuscriptSnippets: {
    methods: string;
    results: string;
    tables: string[];
    figures: string[];
  };
}
