/**
 * Study Design Defaults & Templates
 * 
 * Provides default configurations, statistician personas, and protocol templates
 * for each study design type.
 */

import type {
  StudyDesignType,
  StudyDesignMetadata,
  StatisticianPersonaTemplate,
  ProtocolTemplateSuggestion,
  StudyDNA,
  RCTConfiguration,
  CaseSeriesConfiguration,
  CohortConfiguration,
  LaboratoryConfiguration,
  TechnicalNoteConfiguration,
} from '../types/studyDesigns';

/**
 * Study Design Metadata Catalog
 */
export const STUDY_DESIGN_METADATA: Record<StudyDesignType, StudyDesignMetadata> = {
  rct: {
    type: 'rct',
    label: 'Randomized Controlled Trial (RCT)',
    description: 'Gold standard for causal inference with random allocation to interventions',
    statisticianFocus: 'bias-reduction',
    icon: '🎲',
    typicalSampleSize: '50-500 participants',
    typicalDuration: '6 months - 3 years',
    keyEndpoints: ['Primary efficacy', 'Safety endpoints', 'Quality of life'],
    regulatoryConsiderations: [
      'FDA/EMA approval requirements',
      'GCP compliance mandatory',
      'Protocol amendments require approval',
      'SAE reporting within 24 hours',
    ],
  },
  
  cohort: {
    type: 'cohort',
    label: 'Prospective Cohort Study',
    description: 'Follow participants over time to observe outcomes and associations',
    statisticianFocus: 'temporal-analysis',
    icon: '📊',
    typicalSampleSize: '100-10,000+ participants',
    typicalDuration: '1-10+ years',
    keyEndpoints: ['Incidence rates', 'Risk factors', 'Time-to-event'],
    regulatoryConsiderations: [
      'IRB approval required',
      'Informed consent essential',
      'Loss-to-follow-up mitigation',
    ],
  },
  
  'case-series': {
    type: 'case-series',
    label: 'Retrospective Case Series',
    description: 'Detailed analysis of a series of cases with similar characteristics',
    statisticianFocus: 'descriptive-depth',
    icon: '📋',
    typicalSampleSize: '5-100 cases',
    typicalDuration: '1-6 months',
    keyEndpoints: ['Descriptive statistics', 'Pattern identification', 'Hypothesis generation'],
    regulatoryConsiderations: [
      'IRB exemption possible',
      'HIPAA compliance for retrospective data',
      'Data anonymization required',
    ],
  },
  
  laboratory: {
    type: 'laboratory',
    label: 'Laboratory Investigation',
    description: 'Controlled experiments focusing on biological, chemical, or physical measurements',
    statisticianFocus: 'measurement-precision',
    icon: '🔬',
    typicalSampleSize: '3-30 replicates per condition',
    typicalDuration: '1 week - 6 months',
    keyEndpoints: ['Measurement accuracy', 'Reproducibility', 'Dose-response'],
    regulatoryConsiderations: [
      'IACUC approval if animal studies',
      'Laboratory certification (CLIA)',
      'Quality control protocols',
    ],
  },
  
  'technical-note': {
    type: 'technical-note',
    label: 'Technical Note / Case Report',
    description: 'Novel technique, rare presentation, or educational case report',
    statisticianFocus: 'narrative-synthesis',
    icon: '📝',
    typicalSampleSize: '1-5 cases',
    typicalDuration: '1-3 months',
    keyEndpoints: ['Narrative outcomes', 'Imaging findings', 'Literature comparison'],
    regulatoryConsiderations: [
      'Patient consent for publication',
      'IRB exemption common',
      'Image de-identification',
    ],
  },
};

/**
 * Default RCT Configuration
 */
export const DEFAULT_RCT_CONFIG: RCTConfiguration = {
  blindingType: 'double-blind',
  allocationRatio: '1:1',
  stratificationFactors: [],
  blockRandomization: true,
  blockSize: 4,
  minimization: false,
};

/**
 * Default Case Series Configuration
 */
export const DEFAULT_CASE_SERIES_CONFIG: CaseSeriesConfiguration = {
  deepPhenotyping: true,
  temporalGranularity: 'event-based',
  includeLongitudinalTracking: true,
  multipleTimepoints: true,
};

/**
 * Default Cohort Configuration
 */
export const DEFAULT_COHORT_CONFIG: CohortConfiguration = {
  followUpDuration: '5 years',
  followUpInterval: '6 months',
  exposureAssessment: 'baseline-only',
  lossToFollowUpTracking: true,
};

/**
 * Default Laboratory Configuration
 */
export const DEFAULT_LABORATORY_CONFIG: LaboratoryConfiguration = {
  replicates: 3,
  measurementPrecision: 'high',
  qualityControlSamples: true,
  instrumentValidation: true,
};

/**
 * Default Technical Note Configuration
 */
export const DEFAULT_TECHNICAL_NOTE_CONFIG: TechnicalNoteConfiguration = {
  caseCount: 1,
  includeImaging: true,
  includeLiteratureReview: true,
  narrativeFocus: 'diagnostic',
};

/**
 * Statistician Persona Templates
 */
export const STATISTICIAN_TEMPLATES: Record<StudyDesignType, StatisticianPersonaTemplate> = {
  rct: {
    name: 'Dr. Emma Chen, PhD',
    role: 'Biostatistician',
    focus: 'bias-reduction',
    description: 'Specialist in randomized trial design with expertise in minimizing bias, ensuring balanced allocation, and conducting intent-to-treat analyses.',
    keyResponsibilities: [
      'Randomization sequence generation',
      'Sample size calculation with power analysis',
      'Interim analysis planning',
      'Handling missing data (LOCF, MI)',
      'Subgroup analysis pre-specification',
    ],
    recommendedAnalyses: [
      'Intention-to-treat (ITT) analysis',
      'Per-protocol analysis',
      'Survival analysis (Kaplan-Meier)',
      'Cox proportional hazards',
      'Superiority/non-inferiority testing',
    ],
    permissions: ['view', 'analyze', 'export'],
  },
  
  cohort: {
    name: 'Dr. Marcus Rodriguez, DrPH',
    role: 'Epidemiologist',
    focus: 'temporal-analysis',
    description: 'Epidemiologist specialized in longitudinal studies, time-to-event analysis, and identifying risk factors through prospective observation.',
    keyResponsibilities: [
      'Cohort enrollment stratification',
      'Follow-up protocol design',
      'Exposure assessment validation',
      'Competing risks handling',
      'Survival curve comparison',
    ],
    recommendedAnalyses: [
      'Incidence rate calculation',
      'Hazard ratio estimation',
      'Time-varying covariates',
      'Propensity score matching',
      'Survival curve comparisons',
    ],
    permissions: ['view', 'analyze', 'export'],
  },
  
  'case-series': {
    name: 'Dr. Sophia Nakamura, MD, MPH',
    role: 'Data Scientist',
    focus: 'descriptive-depth',
    description: 'Clinical researcher focused on deep phenotyping, pattern recognition, and generating hypotheses from detailed case characterization.',
    keyResponsibilities: [
      'Case selection criteria definition',
      'Comprehensive variable cataloging',
      'Outlier and subgroup identification',
      'Temporal pattern recognition',
      'Hypothesis generation for future studies',
    ],
    recommendedAnalyses: [
      'Descriptive statistics (median, IQR)',
      'Frequency distributions',
      'Cluster analysis',
      'Timeline visualization',
      'Correlation matrices',
    ],
    permissions: ['view', 'analyze', 'export'],
  },
  
  laboratory: {
    name: 'Dr. James Park, PhD',
    role: 'Data Scientist',
    focus: 'measurement-precision',
    description: 'Laboratory scientist specializing in experimental design, measurement validation, and ensuring reproducibility of technical measurements.',
    keyResponsibilities: [
      'Quality control sample planning',
      'Instrument calibration protocols',
      'Replicate number determination',
      'Measurement error assessment',
      'Assay validation',
    ],
    recommendedAnalyses: [
      'ANOVA (one-way, two-way)',
      'Intraclass correlation (ICC)',
      'Bland-Altman plots',
      'Standard curves / dose-response',
      'Coefficient of variation (CV)',
    ],
    permissions: ['view', 'analyze', 'export'],
  },
  
  'technical-note': {
    name: 'Dr. Aisha Patel, MD',
    role: 'Biostatistician',
    focus: 'narrative-synthesis',
    description: 'Clinical researcher skilled in case report synthesis, comparative analysis with literature, and narrative presentation of unique findings.',
    keyResponsibilities: [
      'Case data extraction',
      'Literature comparison',
      'Imaging annotation',
      'Outcome timeline creation',
      'Educational synthesis',
    ],
    recommendedAnalyses: [
      'Descriptive case summary',
      'Comparative table vs. literature',
      'Timeline visualization',
      'Image quantification',
      'Narrative synthesis',
    ],
    permissions: ['view', 'analyze', 'export'],
  },
};

/**
 * Protocol Template Suggestions
 */
export const PROTOCOL_TEMPLATES: Record<StudyDesignType, ProtocolTemplateSuggestion> = {
  rct: {
    suggestedSections: [
      'Study Design & Randomization',
      'Inclusion/Exclusion Criteria',
      'Intervention Details',
      'Blinding Procedures',
      'Primary Endpoint',
      'Secondary Endpoints',
      'Safety Assessments',
      'Sample Size Justification',
      'Statistical Analysis Plan',
      'Data Safety Monitoring',
    ],
    requiredEndpoints: [
      {
        type: 'primary',
        name: 'Primary Efficacy Endpoint',
        description: 'Main outcome measure for treatment effect',
      },
      {
        type: 'secondary',
        name: 'Safety Endpoint',
        description: 'Adverse events and serious adverse events',
      },
      {
        type: 'secondary',
        name: 'Quality of Life',
        description: 'Patient-reported outcomes',
      },
    ],
    recommendedVariables: [
      { name: 'Treatment Arm', type: 'categorical', category: 'Randomization' },
      { name: 'Randomization Date', type: 'date', category: 'Randomization' },
      { name: 'Blinding Status', type: 'categorical', category: 'Randomization' },
      { name: 'Primary Outcome', type: 'numeric', category: 'Efficacy' },
      { name: 'Adverse Events', type: 'categorical-grid', category: 'Safety' },
    ],
  },
  
  cohort: {
    suggestedSections: [
      'Study Population',
      'Baseline Exposure Assessment',
      'Follow-Up Schedule',
      'Outcome Definitions',
      'Data Collection Methods',
      'Loss to Follow-Up Protocol',
      'Statistical Analysis Plan',
    ],
    requiredEndpoints: [
      {
        type: 'primary',
        name: 'Primary Outcome (Time-to-Event)',
        description: 'Main outcome of interest with time component',
      },
      {
        type: 'secondary',
        name: 'Secondary Outcomes',
        description: 'Additional outcomes tracked over time',
      },
    ],
    recommendedVariables: [
      { name: 'Enrollment Date', type: 'date', category: 'Timeline' },
      { name: 'Baseline Exposure', type: 'categorical', category: 'Exposure' },
      { name: 'Follow-Up Visit Number', type: 'numeric', category: 'Timeline' },
      { name: 'Outcome Occurred', type: 'boolean', category: 'Outcome' },
      { name: 'Date of Outcome', type: 'date', category: 'Outcome' },
    ],
  },
  
  'case-series': {
    suggestedSections: [
      'Case Selection Criteria',
      'Demographics',
      'Clinical Presentation',
      'Diagnostic Workup',
      'Treatment Details',
      'Outcomes & Follow-Up',
      'Discussion',
    ],
    requiredEndpoints: [
      {
        type: 'primary',
        name: 'Clinical Characteristics',
        description: 'Detailed phenotypic description',
      },
      {
        type: 'secondary',
        name: 'Treatment Response',
        description: 'Outcome after intervention',
      },
    ],
    recommendedVariables: [
      { name: 'Patient Demographics', type: 'categorical-grid', category: 'Baseline' },
      { name: 'Presentation Timeline', type: 'date', category: 'Clinical' },
      { name: 'Symptom Checklist', type: 'categorical-grid', category: 'Clinical' },
      { name: 'Laboratory Values', type: 'numeric-grid', category: 'Diagnostics' },
      { name: 'Imaging Findings', type: 'categorical-grid', category: 'Diagnostics' },
    ],
  },
  
  laboratory: {
    suggestedSections: [
      'Experimental Design',
      'Materials & Methods',
      'Sample Preparation',
      'Measurement Protocol',
      'Quality Control',
      'Statistical Methods',
    ],
    requiredEndpoints: [
      {
        type: 'primary',
        name: 'Primary Measurement',
        description: 'Main experimental readout',
      },
      {
        type: 'secondary',
        name: 'Quality Control Metrics',
        description: 'Assay validation parameters',
      },
    ],
    recommendedVariables: [
      { name: 'Sample ID', type: 'text', category: 'Sample' },
      { name: 'Replicate Number', type: 'numeric', category: 'Sample' },
      { name: 'Measurement Value', type: 'numeric', category: 'Measurement' },
      { name: 'QC Pass/Fail', type: 'boolean', category: 'QC' },
      { name: 'Instrument Calibration', type: 'numeric', category: 'QC' },
    ],
  },
  
  'technical-note': {
    suggestedSections: [
      'Case Presentation',
      'Clinical History',
      'Diagnostic Findings',
      'Management',
      'Outcome',
      'Discussion & Literature Review',
    ],
    requiredEndpoints: [
      {
        type: 'primary',
        name: 'Case Outcome',
        description: 'Final clinical outcome',
      },
    ],
    recommendedVariables: [
      { name: 'Patient Age', type: 'numeric', category: 'Demographics' },
      { name: 'Chief Complaint', type: 'text', category: 'Presentation' },
      { name: 'Imaging Studies', type: 'categorical', category: 'Diagnostics' },
      { name: 'Treatment Details', type: 'text', category: 'Management' },
      { name: 'Follow-Up Duration', type: 'numeric', category: 'Outcome' },
    ],
  },
};

/**
 * Generate complete Study DNA for a given design type
 */
export function generateStudyDNA(type: StudyDesignType): StudyDNA {
  return {
    design: {
      type,
      rct: type === 'rct' ? DEFAULT_RCT_CONFIG : undefined,
      caseSeries: type === 'case-series' ? DEFAULT_CASE_SERIES_CONFIG : undefined,
      cohort: type === 'cohort' ? DEFAULT_COHORT_CONFIG : undefined,
      laboratory: type === 'laboratory' ? DEFAULT_LABORATORY_CONFIG : undefined,
      technicalNote: type === 'technical-note' ? DEFAULT_TECHNICAL_NOTE_CONFIG : undefined,
    },
    metadata: STUDY_DESIGN_METADATA[type],
    statisticianTemplate: STATISTICIAN_TEMPLATES[type],
    protocolTemplate: PROTOCOL_TEMPLATES[type],
  };
}

/**
 * Get study design options for dropdown
 */
export function getStudyDesignOptions() {
  return Object.values(STUDY_DESIGN_METADATA).map(metadata => ({
    value: metadata.type,
    label: metadata.label,
    icon: metadata.icon,
    description: metadata.description,
  }));
}