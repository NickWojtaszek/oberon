/**
 * Study Design Types & Configurations
 * 
 * Defines the "Study DNA" - the fundamental research methodology that influences
 * protocol structure, statistical approach, and data collection strategy.
 */

/**
 * Core study design types
 */
export type StudyDesignType =
  | 'rct'                    // Randomized Controlled Trial
  | 'cohort'                 // Prospective Cohort
  | 'case-series'            // Retrospective Case Series
  | 'laboratory'             // Laboratory Investigation
  | 'technical-note';        // Technical Note / Case Report

/**
 * Blinding strategies for RCTs
 */
export type BlindingType =
  | 'open-label'             // No blinding
  | 'single-blind'           // Participant blinded
  | 'double-blind'           // Participant + investigator blinded
  | 'triple-blind';          // Participant + investigator + analyst blinded

/**
 * Allocation strategies for RCTs
 */
export type AllocationRatio = '1:1' | '2:1' | '3:1' | '1:2' | 'custom';

/**
 * Statistician focus areas based on study design
 */
export type StatisticianFocus =
  | 'bias-reduction'         // RCT focus
  | 'descriptive-depth'      // Case series focus
  | 'temporal-analysis'      // Cohort focus
  | 'measurement-precision'  // Laboratory focus
  | 'narrative-synthesis';   // Technical note focus

/**
 * RCT-specific configuration
 */
export interface RCTConfiguration {
  blindingType: BlindingType;
  allocationRatio: AllocationRatio;
  customRatio?: string;
  stratificationFactors?: string[];
  blockRandomization: boolean;
  blockSize?: number;
  minimization: boolean;
}

/**
 * Case Series-specific configuration
 */
export interface CaseSeriesConfiguration {
  deepPhenotyping: boolean;            // High-granularity categorical grids
  temporalGranularity: 'daily' | 'weekly' | 'monthly' | 'event-based';
  includeLongitudinalTracking: boolean;
  multipleTimepoints: boolean;
}

/**
 * Cohort Study-specific configuration
 */
export interface CohortConfiguration {
  followUpDuration: string;            // e.g., "5 years"
  followUpInterval: string;            // e.g., "6 months"
  exposureAssessment: 'baseline-only' | 'time-varying';
  lossToFollowUpTracking: boolean;
}

/**
 * Laboratory Investigation-specific configuration
 */
export interface LaboratoryConfiguration {
  replicates: number;
  measurementPrecision: 'standard' | 'high' | 'ultra-high';
  qualityControlSamples: boolean;
  instrumentValidation: boolean;
}

/**
 * Technical Note-specific configuration
 */
export interface TechnicalNoteConfiguration {
  caseCount: number;
  includeImaging: boolean;
  includeLiteratureReview: boolean;
  narrativeFocus: 'diagnostic' | 'therapeutic' | 'methodological';
}

/**
 * Combined study design configuration
 */
export interface StudyDesignConfiguration {
  type: StudyDesignType;
  
  // Type-specific configurations (only one will be populated)
  rct?: RCTConfiguration;
  caseSeries?: CaseSeriesConfiguration;
  cohort?: CohortConfiguration;
  laboratory?: LaboratoryConfiguration;
  technicalNote?: TechnicalNoteConfiguration;
}

/**
 * Study design metadata
 */
export interface StudyDesignMetadata {
  type: StudyDesignType;
  label: string;
  description: string;
  statisticianFocus: StatisticianFocus;
  icon: string;                        // Emoji or icon identifier
  
  // Guidance
  typicalSampleSize: string;
  typicalDuration: string;
  keyEndpoints: string[];
  regulatoryConsiderations?: string[];
}

/**
 * Statistician persona template based on study design
 */
export interface StatisticianPersonaTemplate {
  name: string;
  role: 'Biostatistician' | 'Epidemiologist' | 'Data Scientist';
  focus: StatisticianFocus;
  description: string;
  keyResponsibilities: string[];
  recommendedAnalyses: string[];
  permissions: string[];
}

/**
 * Protocol template suggestion based on study design
 */
export interface ProtocolTemplateSuggestion {
  suggestedSections: string[];
  requiredEndpoints: Array<{
    type: 'primary' | 'secondary' | 'exploratory';
    name: string;
    description: string;
  }>;
  recommendedVariables: Array<{
    name: string;
    type: string;
    category: string;
  }>;
}

/**
 * Complete study DNA configuration
 */
export interface StudyDNA {
  design: StudyDesignConfiguration;
  metadata: StudyDesignMetadata;
  statisticianTemplate: StatisticianPersonaTemplate;
  protocolTemplate: ProtocolTemplateSuggestion;
}