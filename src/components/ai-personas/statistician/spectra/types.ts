/**
 * SPECTRA Framework Types
 * Study Protocol Elements for Clinical Trial Research Analytics
 *
 * An expanded PICO framework designed to provide comprehensive context
 * for AI-powered statistical analysis (Dr. Saga)
 *
 * SPECTRA Components:
 * - S: Study design (methodology, phase, blinding, randomization)
 * - P: Population (demographics, eligibility criteria, stratification)
 * - E: Endpoints (primary, secondary, exploratory with tiers and methods)
 * - C: Comparator (control groups, treatment arms, allocation)
 * - T: Treatment (interventions, dosing, duration, adherence)
 * - R: Risk factors (known confounders, effect modifiers, safety signals)
 * - A: Analysis parameters (alpha, power, effect size, multiplicity)
 */

import type { StudyDesignType } from '../../../../types/studyDesigns';
import type { SchemaBlock } from '../../../protocol-workbench/types';

// =============================================================================
// CORE SPECTRA INTERFACE
// =============================================================================

/**
 * Complete SPECTRA context for statistical analysis
 */
export interface SPECTRAContext {
  // Metadata
  extractedAt: string;
  extractedFrom: 'protocol' | 'pico' | 'schema' | 'manual';
  confidence: number; // 0-1, overall extraction confidence
  version: string; // SPECTRA schema version

  // SPECTRA Components
  study: StudyDesignContext;
  population: PopulationContext;
  endpoints: EndpointsContext;
  comparator: ComparatorContext;
  treatment: TreatmentContext;
  riskFactors: RiskFactorsContext;
  analysisParameters: AnalysisParametersContext;

  // Cross-cutting concerns
  regulatoryContext?: RegulatoryContext;
  literatureContext?: LiteratureContext;
}

// =============================================================================
// S - STUDY DESIGN CONTEXT
// =============================================================================

export interface StudyDesignContext {
  // Core design
  designType: StudyDesignType;
  designSubtype?: string; // e.g., "parallel", "crossover", "factorial"
  phase?: 'I' | 'II' | 'IIa' | 'IIb' | 'III' | 'IV' | 'NA';

  // Methodological features
  randomization?: {
    method: 'simple' | 'block' | 'stratified' | 'adaptive' | 'none';
    blockSize?: number;
    stratificationFactors?: string[];
    allocationRatio?: string; // e.g., "1:1", "2:1"
  };

  blinding?: {
    level: 'open-label' | 'single-blind' | 'double-blind' | 'triple-blind';
    whoBlinded?: ('participant' | 'investigator' | 'assessor' | 'analyst')[];
    unblindingCriteria?: string[];
  };

  // Timing
  duration?: {
    treatmentPeriod?: string;
    followUpPeriod?: string;
    totalDuration?: string;
  };

  // Multi-site considerations
  multiCenter?: boolean;
  siteCount?: number;
  regions?: string[];

  // Extraction metadata
  confidence: number;
  sources: string[]; // Where this was extracted from
}

// =============================================================================
// P - POPULATION CONTEXT
// =============================================================================

export interface PopulationContext {
  // Demographics
  targetPopulation: string; // Free text description
  ageRange?: {
    min?: number;
    max?: number;
    unit: 'years' | 'months' | 'days';
  };
  sexDistribution?: 'all' | 'male-only' | 'female-only' | 'other';

  // Clinical characteristics
  diseaseCondition?: string;
  diseaseStage?: string;
  comorbidities?: string[];

  // Eligibility
  keyInclusionCriteria?: string[];
  keyExclusionCriteria?: string[];

  // Stratification
  stratificationFactors?: Array<{
    name: string;
    categories: string[];
    rationale?: string;
  }>;

  // Sample size
  targetEnrollment?: number;
  minimumEnrollment?: number;
  enrollmentByGroup?: Record<string, number>;

  // Extraction metadata
  confidence: number;
  sources: string[];
}

// =============================================================================
// E - ENDPOINTS CONTEXT
// =============================================================================

export interface EndpointsContext {
  primary: EndpointDefinition[];
  secondary: EndpointDefinition[];
  exploratory: EndpointDefinition[];
  safety: EndpointDefinition[];

  // Overall endpoint strategy
  compositeEndpoints?: CompositeEndpointDefinition[];
  hierarchicalTesting?: {
    enabled: boolean;
    order: string[]; // Endpoint IDs in testing order
    method?: 'fixed-sequence' | 'fallback' | 'graphical';
  };

  confidence: number;
  sources: string[];
}

export interface EndpointDefinition {
  id: string;
  name: string;
  label?: string;
  description?: string;

  // Type and measurement
  type: 'continuous' | 'binary' | 'categorical' | 'time-to-event' | 'count' | 'ordinal';
  unit?: string;
  measurementSchedule?: string[]; // e.g., ["baseline", "week 4", "week 12"]

  // Clinical context
  direction: 'higher-better' | 'lower-better' | 'neutral';
  clinicallyMeaningfulDifference?: number;
  minimallyImportantDifference?: number;

  // Statistical pre-specification
  recommendedAnalysis?: string;
  assumptions?: string[];

  // Link to schema
  schemaBlockId?: string;

  confidence: number;
}

export interface CompositeEndpointDefinition {
  id: string;
  name: string;
  components: string[]; // Endpoint IDs
  combinationMethod: 'any' | 'all' | 'weighted' | 'hierarchical';
  weights?: Record<string, number>;
}

// =============================================================================
// C - COMPARATOR CONTEXT
// =============================================================================

export interface ComparatorContext {
  // Treatment arms
  arms: TreatmentArm[];

  // Comparison structure
  primaryComparison?: {
    activeArm: string;
    controlArm: string;
    comparisonType: 'superiority' | 'non-inferiority' | 'equivalence';
    margin?: number;
    marginJustification?: string;
  };

  // Allocation
  allocationRatio?: string;
  allocationMethod?: string;

  confidence: number;
  sources: string[];
}

export interface TreatmentArm {
  id: string;
  name: string;
  type: 'active' | 'placebo' | 'standard-of-care' | 'no-treatment' | 'active-comparator';
  description?: string;
  targetN?: number;
}

// =============================================================================
// T - TREATMENT CONTEXT
// =============================================================================

export interface TreatmentContext {
  // Intervention details
  interventions: InterventionDefinition[];

  // Administration
  routeOfAdministration?: string;
  dosingSchedule?: string;
  treatmentDuration?: string;

  // Compliance
  adherenceMonitoring?: string;
  minimumExposure?: string;

  // Concomitant treatments
  allowedConcomitant?: string[];
  prohibitedConcomitant?: string[];
  rescueMedication?: string;

  confidence: number;
  sources: string[];
}

export interface InterventionDefinition {
  id: string;
  name: string;
  type: 'drug' | 'device' | 'procedure' | 'behavioral' | 'diagnostic' | 'other';
  description?: string;

  // Dosing (for drugs)
  dose?: string;
  frequency?: string;
  duration?: string;

  // Mechanism
  mechanismOfAction?: string;
  expectedEffect?: string;
}

// =============================================================================
// R - RISK FACTORS CONTEXT
// =============================================================================

export interface RiskFactorsContext {
  // Known confounders
  confounders: ConfounderDefinition[];

  // Effect modifiers
  effectModifiers: EffectModifierDefinition[];

  // Safety considerations
  safetySignals: SafetySignalDefinition[];

  // Missing data expectations
  anticipatedDropout?: {
    rate: number;
    reasons?: string[];
    expectedPattern?: 'MCAR' | 'MAR' | 'MNAR';
  };

  confidence: number;
  sources: string[];
}

export interface ConfounderDefinition {
  id: string;
  name: string;
  type: 'demographic' | 'clinical' | 'behavioral' | 'socioeconomic' | 'other';
  expectedImpact: 'strong' | 'moderate' | 'weak';
  adjustmentMethod?: 'stratification' | 'regression' | 'matching' | 'weighting';
  schemaBlockId?: string;
}

export interface EffectModifierDefinition {
  id: string;
  name: string;
  hypothesis: string; // Expected modification effect
  subgroupAnalysisPlanned: boolean;
  schemaBlockId?: string;
}

export interface SafetySignalDefinition {
  id: string;
  name: string;
  type: 'adverse-event' | 'lab-abnormality' | 'vital-sign' | 'symptom' | 'other';
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  expectedIncidence?: number;
  monitoringFrequency?: string;
  stoppingRule?: string;
}

// =============================================================================
// A - ANALYSIS PARAMETERS CONTEXT
// =============================================================================

export interface AnalysisParametersContext {
  // Type I error control
  alpha: number;
  alphaAllocation?: Record<string, number>; // By endpoint or comparison
  multiplicityAdjustment?: {
    method: 'bonferroni' | 'holm' | 'hochberg' | 'hommel' | 'fdr' | 'graphical' | 'none';
    familywise: boolean;
    details?: string;
  };

  // Power and sample size
  power: number;
  effectSize?: {
    type: 'cohens-d' | 'odds-ratio' | 'hazard-ratio' | 'risk-difference' | 'mean-difference' | 'other';
    value: number;
    source: 'literature' | 'pilot' | 'clinical-judgment' | 'regulatory';
  };

  // Analysis populations
  populations: AnalysisPopulation[];

  // Interim analyses
  interimAnalyses?: {
    planned: boolean;
    count?: number;
    timing?: string[];
    stoppingBoundaries?: {
      efficacy?: string;
      futility?: string;
      method?: 'obrien-fleming' | 'pocock' | 'lan-demets' | 'other';
    };
  };

  // Sensitivity analyses
  sensitivityAnalyses?: string[];

  // Missing data handling
  missingDataStrategy?: {
    primary: 'complete-case' | 'locf' | 'mice' | 'mixed-model' | 'pattern-mixture' | 'other';
    sensitivity?: string[];
  };

  confidence: number;
  sources: string[];
}

export interface AnalysisPopulation {
  id: string;
  name: string;
  type: 'ITT' | 'mITT' | 'PP' | 'safety' | 'PK' | 'PD' | 'custom';
  definition: string;
  isPrimary: boolean;
}

// =============================================================================
// CROSS-CUTTING CONTEXTS
// =============================================================================

export interface RegulatoryContext {
  targetAgencies?: ('FDA' | 'EMA' | 'PMDA' | 'NMPA' | 'other')[];
  guidanceDocuments?: string[]; // e.g., "ICH E9", "ICH E9(R1)"
  specialDesignations?: ('breakthrough' | 'fast-track' | 'orphan' | 'accelerated')[];
  priorSubmissions?: string[];
}

export interface LiteratureContext {
  foundationalStudies?: Array<{
    citation: string;
    relevance: string;
    effectSizeReported?: number;
    sampleSize?: number;
    methodsUsed?: string[];
  }>;
  metaAnalyses?: Array<{
    citation: string;
    pooledEffectSize?: number;
    heterogeneity?: string;
  }>;
  systematicReviews?: string[];
}

// =============================================================================
// EXTRACTION RESULT
// =============================================================================

export interface SPECTRAExtractionResult {
  success: boolean;
  context: SPECTRAContext | null;
  errors: string[];
  warnings: string[];
  suggestions: Array<{
    field: string;
    message: string;
    source?: string;
  }>;
}

// =============================================================================
// VALIDATION TYPES
// =============================================================================

export interface SPECTRAValidationResult {
  isValid: boolean;
  completeness: {
    overall: number; // 0-100
    byComponent: {
      study: number;
      population: number;
      endpoints: number;
      comparator: number;
      treatment: number;
      riskFactors: number;
      analysisParameters: number;
    };
  };
  issues: SPECTRAValidationIssue[];
}

export interface SPECTRAValidationIssue {
  component: keyof SPECTRAContext;
  field: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion?: string;
}

// =============================================================================
// DEFAULTS
// =============================================================================

export const DEFAULT_SPECTRA_CONTEXT: Partial<SPECTRAContext> = {
  version: '1.0',
  analysisParameters: {
    alpha: 0.05,
    power: 0.80,
    populations: [
      {
        id: 'itt',
        name: 'Intent-to-Treat',
        type: 'ITT',
        definition: 'All randomized participants analyzed according to assigned treatment',
        isPrimary: true,
      },
    ],
    confidence: 0.5,
    sources: ['default'],
  },
};
