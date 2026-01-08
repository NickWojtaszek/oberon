// Endpoint Validator - Clinical Endpoint Definition and Measurement Validation

import type { ValidationRule, ValidationIssue, ValidationContext } from '../core/personaTypes';

// Helper function to create issues
function createIssue(
  id: string,
  severity: 'critical' | 'warning' | 'info',
  title: string,
  description: string,
  recommendation: string,
  citation?: string,
  field?: string
): ValidationIssue {
  return {
    id,
    personaId: 'endpoint-validator',
    severity,
    category: 'endpoint-definition',
    title,
    description,
    recommendation,
    location: {
      module: 'protocol-workbench',
      tab: 'endpoints',
      field
    },
    citation,
    autoFixAvailable: false,
    studyTypeSpecific: false
  };
}

// ============================================================================
// PRIMARY ENDPOINT DEFINITION
// ============================================================================

export const PRIMARY_ENDPOINT_DEFINITION: ValidationRule = {
  id: 'primary-endpoint-definition',
  name: 'Primary Endpoint Definition Quality',
  personaId: 'endpoint-validator',
  category: 'endpoint-definition',
  severity: 'critical',
  description: 'Primary endpoint must be clearly defined, measurable, and clinically relevant',
  check: (context: ValidationContext): ValidationIssue[] => {
    const protocol = context.protocolDocument;
    const issues: ValidationIssue[] = [];

    if (!protocol) return issues;

    const primaryEndpoint = protocol.primaryEndpoint;

    // Check if primary endpoint exists
    if (!primaryEndpoint || !primaryEndpoint.name) {
      issues.push(createIssue(
        'primary-endpoint-missing',
        'critical',
        'Primary Endpoint Not Defined',
        'Every clinical trial must specify exactly one primary endpoint',
        'Define a single primary endpoint that directly addresses the study objective. The primary endpoint should be the most important outcome measure that will determine the success or failure of the intervention.',
        'ICH E9, Section 2.2.2',
        'primaryEndpoint.name'
      ));
      return issues;
    }

    // Check for clear definition
    if (!primaryEndpoint.definition || primaryEndpoint.definition.length < 20) {
      issues.push(createIssue(
        'primary-endpoint-unclear',
        'critical',
        'Primary Endpoint Lacks Clear Definition',
        `"${primaryEndpoint.name}" needs a detailed definition explaining what is being measured and how`,
        'Provide a complete definition including: 1) What is being measured, 2) How it will be measured (instrument/scale), 3) When it will be assessed, 4) How change will be calculated (e.g., change from baseline, absolute value).',
        'FDA Guidance: Clinical Trial Endpoints',
        'primaryEndpoint.definition'
      ));
    }

    // Check for measurement method
    if (!primaryEndpoint.measurementMethod) {
      issues.push(createIssue(
        'primary-endpoint-no-method',
        'critical',
        'Primary Endpoint Measurement Method Not Specified',
        'How the primary endpoint will be measured must be explicitly stated',
        'Specify the measurement instrument, scale, or laboratory test. Examples: "Beck Depression Inventory II (BDI-II)", "Forced Expiratory Volume in 1 second (FEV1)", "Overall Survival (OS) from randomization to death".',
        'ICH E9, Section 2.2.2',
        'primaryEndpoint.measurementMethod'
      ));
    }

    // Check for timing
    if (!primaryEndpoint.timepoint && !primaryEndpoint.assessmentSchedule) {
      issues.push(createIssue(
        'primary-endpoint-no-timing',
        'critical',
        'Primary Endpoint Assessment Timing Not Specified',
        'When the primary endpoint will be assessed must be defined',
        'Specify the time point(s) for primary endpoint assessment. Examples: "at Week 12", "at end of treatment", "time to event (ongoing surveillance)". This drives statistical analysis and sample size calculations.',
        'ICH E9, Section 2.2.2',
        'primaryEndpoint.timepoint'
      ));
    }

    // Check for clinical relevance documentation
    if (!primaryEndpoint.clinicalRelevance && !primaryEndpoint.mcid) {
      issues.push(createIssue(
        'primary-endpoint-no-mcid',
        'warning',
        'Minimum Clinically Important Difference (MCID) Not Specified',
        'Clinical significance threshold for primary endpoint is not documented',
        'Define the MCID: the smallest change in the endpoint that patients or clinicians would consider meaningful. This informs sample size calculations and interpretation of results.',
        'FDA Guidance: Patient-Reported Outcome Measures',
        'primaryEndpoint.mcid'
      ));
    }

    // Check endpoint type
    const endpointType = primaryEndpoint.type?.toLowerCase() || '';
    const validTypes = ['continuous', 'binary', 'categorical', 'time-to-event', 'count', 'ordinal'];
    
    if (!endpointType || !validTypes.includes(endpointType)) {
      issues.push(createIssue(
        'primary-endpoint-no-type',
        'warning',
        'Primary Endpoint Data Type Not Specified',
        'Statistical analysis depends on the type of endpoint',
        'Classify the endpoint as: Continuous (e.g., blood pressure), Binary (yes/no), Categorical (multiple groups), Time-to-Event (survival), Count (number of events), or Ordinal (ordered categories).',
        'ICH E9, Section 5.1',
        'primaryEndpoint.type'
      ));
    }

    return issues;
  }
};

// ============================================================================
// SECONDARY ENDPOINTS
// ============================================================================

export const SECONDARY_ENDPOINTS_SPECIFICATION: ValidationRule = {
  id: 'secondary-endpoints-specification',
  name: 'Secondary Endpoints Specification',
  personaId: 'endpoint-validator',
  category: 'endpoint-definition',
  severity: 'warning',
  description: 'Secondary endpoints should be well-defined and limited in number',
  check: (context: ValidationContext): ValidationIssue[] => {
    const protocol = context.protocolDocument;
    const issues: ValidationIssue[] = [];

    if (!protocol) return issues;

    const secondaryEndpoints = protocol.secondaryEndpoints || [];

    // Warn if no secondary endpoints
    if (secondaryEndpoints.length === 0) {
      issues.push(createIssue(
        'no-secondary-endpoints',
        'info',
        'No Secondary Endpoints Defined',
        'Most trials benefit from secondary endpoints to provide additional evidence',
        'Consider adding secondary endpoints that support or extend the primary endpoint findings. Examples: safety outcomes, quality of life, mechanistic endpoints, or alternative time points.',
        'ICH E9, Section 2.2.2'
      ));
      return issues;
    }

    // Warn if too many secondary endpoints (>6)
    if (secondaryEndpoints.length > 6) {
      issues.push(createIssue(
        'too-many-secondary-endpoints',
        'warning',
        `High Number of Secondary Endpoints (${secondaryEndpoints.length})`,
        'Large numbers of secondary endpoints increase multiplicity burden and dilute focus',
        `Consider: 1) Prioritizing the most important secondary endpoints (limit to 5-6), 2) Classifying less critical outcomes as exploratory, 3) Implementing hierarchical testing strategy with alpha control.`,
        'ICH E9, Section 5.2'
      ));
    }

    // Check each secondary endpoint for completeness
    secondaryEndpoints.forEach((endpoint: any, idx: number) => {
      if (!endpoint.name) {
        issues.push(createIssue(
          `secondary-endpoint-${idx}-no-name`,
          'warning',
          `Secondary Endpoint ${idx + 1} Missing Name`,
          'Each secondary endpoint must have a clear name',
          'Provide a descriptive name for this secondary endpoint.',
          'ICH E9',
          `secondaryEndpoints[${idx}].name`
        ));
      }

      if (!endpoint.definition || endpoint.definition.length < 15) {
        issues.push(createIssue(
          `secondary-endpoint-${idx}-no-definition`,
          'warning',
          `Secondary Endpoint ${idx + 1}: "${endpoint.name}" Lacks Definition`,
          'Secondary endpoints need clear definitions just like the primary endpoint',
          'Define how this endpoint will be measured, when it will be assessed, and how it relates to the study objectives.',
          'ICH E9',
          `secondaryEndpoints[${idx}].definition`
        ));
      }
    });

    return issues;
  }
};

// ============================================================================
// COMPOSITE ENDPOINTS
// ============================================================================

export const COMPOSITE_ENDPOINT_VALIDATION: ValidationRule = {
  id: 'composite-endpoint-validation',
  name: 'Composite Endpoint Justification',
  personaId: 'endpoint-validator',
  category: 'endpoint-definition',
  severity: 'warning',
  description: 'Composite endpoints require careful justification',
  check: (context: ValidationContext): ValidationIssue[] => {
    const protocol = context.protocolDocument;
    const issues: ValidationIssue[] = [];

    if (!protocol) return issues;

    const primaryEndpoint = protocol.primaryEndpoint;
    const allEndpoints = [primaryEndpoint, ...(protocol.secondaryEndpoints || [])].filter(Boolean);

    allEndpoints.forEach((endpoint: any, idx: number) => {
      const isComposite = endpoint.isComposite || 
                         endpoint.name?.toLowerCase().includes('composite') ||
                         endpoint.definition?.toLowerCase().includes('composite') ||
                         (endpoint.components && endpoint.components.length > 1);

      if (!isComposite) return;

      const isPrimary = idx === 0;
      const label = isPrimary ? 'Primary' : `Secondary ${idx}`;

      // Check for component specification
      if (!endpoint.components || endpoint.components.length < 2) {
        issues.push(createIssue(
          `composite-${idx}-no-components`,
          'warning',
          `${label} Composite Endpoint: Components Not Specified`,
          'Composite endpoints must explicitly list all component outcomes',
          'List each component of the composite endpoint (e.g., "Composite of: 1) All-cause mortality, 2) Non-fatal MI, 3) Non-fatal stroke"). Each component should be clinically relevant.',
          'FDA Guidance: Multiple Endpoints',
          `${isPrimary ? 'primaryEndpoint' : `secondaryEndpoints[${idx-1}]`}.components`
        ));
      } else {
        // Check clinical importance of components
        if (endpoint.components.length > 5) {
          issues.push(createIssue(
            `composite-${idx}-too-many-components`,
            'warning',
            `${label} Composite: Too Many Components (${endpoint.components.length})`,
            'Composite endpoints with many components are difficult to interpret',
            'Composite endpoints work best with 2-4 clinically similar components of similar severity. Consider: 1) Reducing to most important components, 2) Using separate endpoints instead of composite.',
            'FDA Guidance: Multiple Endpoints'
          ));
        }

        // Check for justification
        if (!endpoint.compositeJustification) {
          issues.push(createIssue(
            `composite-${idx}-no-justification`,
            isPrimary ? 'warning' : 'info',
            `${label} Composite Endpoint: Justification Not Provided`,
            'Composite endpoints require justification for combining outcomes',
            'Justify the composite: 1) Why are these outcomes combined?, 2) Are components of similar clinical importance?, 3) Are expected event rates similar?, 4) Will individual components be analyzed separately?',
            'FDA Guidance: Multiple Endpoints',
            `${isPrimary ? 'primaryEndpoint' : `secondaryEndpoints[${idx-1}]`}.compositeJustification`
          ));
        }
      }
    });

    return issues;
  }
};

// ============================================================================
// SURROGATE VS CLINICAL ENDPOINTS
// ============================================================================

export const SURROGATE_ENDPOINT_VALIDATION: ValidationRule = {
  id: 'surrogate-endpoint-validation',
  name: 'Surrogate Endpoint Validation',
  personaId: 'endpoint-validator',
  category: 'endpoint-definition',
  severity: 'warning',
  description: 'Surrogate endpoints require validation evidence',
  check: (context: ValidationContext): ValidationIssue[] => {
    const protocol = context.protocolDocument;
    const issues: ValidationIssue[] = [];

    if (!protocol || !protocol.primaryEndpoint) return issues;

    const primaryEndpoint = protocol.primaryEndpoint;

    // Surrogate endpoint indicators
    const surrogateKeywords = [
      'biomarker', 'lab value', 'laboratory', 'cd4', 'viral load', 'tumor size',
      'progression-free', 'pfs', 'tumor response', 'pathologic complete response',
      'blood pressure', 'cholesterol', 'ldl', 'hdl', 'glycemic', 'hba1c', 'glucose'
    ];

    const isSurrogate = primaryEndpoint.isSurrogate ||
                       surrogateKeywords.some(kw => 
                         primaryEndpoint.name?.toLowerCase().includes(kw) ||
                         primaryEndpoint.definition?.toLowerCase().includes(kw)
                       );

    if (!isSurrogate) return issues;

    // Surrogate endpoints should have validation evidence
    if (!primaryEndpoint.surrogateValidation) {
      issues.push(createIssue(
        'surrogate-no-validation',
        'warning',
        'Surrogate Endpoint: Validation Evidence Not Documented',
        'Surrogate endpoints (biomarkers, lab values) require evidence linking them to clinical outcomes',
        'Document validation evidence: 1) Published studies showing association with clinical outcome, 2) Biological plausibility, 3) Effect consistency across studies. Regulatory agencies prefer validated surrogate endpoints.',
        'FDA Guidance: Surrogate Endpoint Development',
        'primaryEndpoint.surrogateValidation'
      ));
    }

    // Check if clinical outcome is also measured
    const hasClinicialOutcome = (protocol.secondaryEndpoints || []).some((se: any) => {
      const clinicalKeywords = ['survival', 'mortality', 'death', 'clinical', 'symptom', 'function'];
      return clinicalKeywords.some(kw => 
        se.name?.toLowerCase().includes(kw) ||
        se.definition?.toLowerCase().includes(kw)
      );
    });

    if (!hasClinicialOutcome) {
      issues.push(createIssue(
        'surrogate-no-clinical-outcome',
        'info',
        'Consider Including Clinical Outcome as Secondary Endpoint',
        'Trials with surrogate primary endpoints benefit from measuring actual clinical outcomes',
        'Consider adding a clinical outcome as secondary endpoint (e.g., survival, disease progression, quality of life). This strengthens regulatory submission and clinical interpretation.',
        'FDA Guidance: Surrogate Endpoint Development'
      ));
    }

    return issues;
  }
};

// ============================================================================
// PATIENT-REPORTED OUTCOMES (PROs)
// ============================================================================

export const PRO_ENDPOINT_VALIDATION: ValidationRule = {
  id: 'pro-endpoint-validation',
  name: 'Patient-Reported Outcome Validation',
  personaId: 'endpoint-validator',
  category: 'endpoint-definition',
  severity: 'warning',
  description: 'PRO instruments must be validated and appropriate',
  check: (context: ValidationContext): ValidationIssue[] => {
    const protocol = context.protocolDocument;
    const issues: ValidationIssue[] = [];

    if (!protocol) return issues;

    const allEndpoints = [
      protocol.primaryEndpoint,
      ...(protocol.secondaryEndpoints || [])
    ].filter(Boolean);

    // PRO keywords
    const proKeywords = [
      'patient-reported', 'pro ', 'quality of life', 'qol', 'questionnaire',
      'survey', 'self-reported', 'diary', 'symptom', 'pain scale',
      'eq-5d', 'sf-36', 'promis', 'fact', 'eortc'
    ];

    allEndpoints.forEach((endpoint: any, idx: number) => {
      const isPRO = endpoint.isPRO ||
                   proKeywords.some(kw => 
                     endpoint.name?.toLowerCase().includes(kw) ||
                     endpoint.definition?.toLowerCase().includes(kw) ||
                     endpoint.measurementMethod?.toLowerCase().includes(kw)
                   );

      if (!isPRO) return;

      const isPrimary = idx === 0;
      const label = isPrimary ? 'Primary' : `Secondary ${idx}`;

      // Check for validated instrument
      if (!endpoint.validatedInstrument) {
        issues.push(createIssue(
          `pro-${idx}-not-validated`,
          isPrimary ? 'warning' : 'info',
          `${label} PRO Endpoint: Instrument Validation Not Documented`,
          'Patient-reported outcomes should use validated instruments',
          'Use a validated PRO instrument (e.g., EQ-5D for QoL, VAS for pain, disease-specific scales). Document: 1) Instrument name and version, 2) Validation evidence, 3) Psychometric properties (reliability, validity), 4) Meaningful change threshold.',
          'FDA Guidance: Patient-Reported Outcome Measures',
          `${isPrimary ? 'primaryEndpoint' : `secondaryEndpoints[${idx-1}]`}.validatedInstrument`
        ));
      }

      // Check for MCID
      if (!endpoint.mcid && !endpoint.minimumChange) {
        issues.push(createIssue(
          `pro-${idx}-no-mcid`,
          'warning',
          `${label} PRO: MCID Not Specified`,
          'PROs should define the minimum clinically important difference',
          'Specify the MCID: the smallest change in the PRO score that patients consider beneficial. This is critical for interpreting clinical significance of statistically significant results.',
          'FDA Guidance: Patient-Reported Outcome Measures',
          `${isPrimary ? 'primaryEndpoint' : `secondaryEndpoints[${idx-1}]`}.mcid`
        ));
      }

      // Check for recall period
      if (!endpoint.recallPeriod) {
        issues.push(createIssue(
          `pro-${idx}-no-recall`,
          'info',
          `${label} PRO: Recall Period Not Specified`,
          'PRO instruments should specify the recall period',
          'Document the recall period (e.g., "past 7 days", "past 24 hours", "right now"). This affects reliability and interpretation.',
          'FDA Guidance: Patient-Reported Outcome Measures'
        ));
      }
    });

    return issues;
  }
};

// ============================================================================
// ENDPOINT ALIGNMENT WITH OBJECTIVES
// ============================================================================

export const ENDPOINT_OBJECTIVE_ALIGNMENT: ValidationRule = {
  id: 'endpoint-objective-alignment',
  name: 'Endpoint-Objective Alignment',
  personaId: 'endpoint-validator',
  category: 'endpoint-definition',
  severity: 'warning',
  description: 'Primary endpoint must align with study objectives',
  check: (context: ValidationContext): ValidationIssue[] => {
    const protocol = context.protocolDocument;
    const issues: ValidationIssue[] = [];

    if (!protocol || !protocol.primaryEndpoint) return issues;

    // Check if objectives are defined
    if (!protocol.objectives || (!protocol.objectives.primary && !protocol.studyObjective)) {
      issues.push(createIssue(
        'no-objectives-defined',
        'warning',
        'Study Objectives Not Clearly Defined',
        'Primary endpoint should directly address the study objective',
        'Clearly state the primary objective in the protocol. The primary endpoint should be designed to answer this objective. Example: Objective: "To evaluate efficacy..." → Endpoint: "Change in [outcome] at [time]".',
        'ICH E8: General Considerations for Clinical Studies',
        'objectives.primary'
      ));
    }

    // Check for consistency between objective and endpoint
    // This is a simplified check - in reality would need NLP
    const objective = (protocol.objectives?.primary || protocol.studyObjective || '').toLowerCase();
    const endpointName = (protocol.primaryEndpoint.name || '').toLowerCase();
    const endpointDef = (protocol.primaryEndpoint.definition || '').toLowerCase();

    // Extract key concepts from objective
    const objectiveWords = objective.split(/\s+/).filter(w => w.length > 4);
    const hasOverlap = objectiveWords.some(word => 
      endpointName.includes(word) || endpointDef.includes(word)
    );

    if (objective && !hasOverlap && objective.length > 20) {
      issues.push(createIssue(
        'endpoint-objective-mismatch',
        'info',
        'Verify Endpoint-Objective Alignment',
        'Ensure the primary endpoint directly measures what the objective states',
        'Review: Does the primary endpoint directly answer the primary objective? The endpoint should operationalize the objective into a measurable outcome.',
        'ICH E8: General Considerations'
      ));
    }

    return issues;
  }
};

// ============================================================================
// STUDY-TYPE-SPECIFIC ENDPOINT VALIDATION
// ============================================================================

export const RCT_ENDPOINT_REQUIREMENTS: ValidationRule = {
  id: 'rct-endpoint-requirements',
  name: 'RCT: Efficacy Endpoint Requirements',
  personaId: 'endpoint-validator',
  category: 'endpoint-definition',
  severity: 'warning',
  description: 'RCTs should have well-defined efficacy endpoints',
  studyTypes: ['rct'],
  check: (context: ValidationContext): ValidationIssue[] => {
    const protocol = context.protocolDocument;
    const issues: ValidationIssue[] = [];

    if (!protocol || !protocol.primaryEndpoint) return issues;

    // Check for blinded endpoint assessment when possible
    const endpointName = protocol.primaryEndpoint.name?.toLowerCase() || '';
    const isSubjective = ['pain', 'quality', 'symptom', 'function', 'rating', 'score']
      .some(term => endpointName.includes(term));

    if (isSubjective && !protocol.primaryEndpoint.blindedAssessment) {
      issues.push(createIssue(
        'rct-subjective-not-blinded',
        'warning',
        'Subjective Endpoint Without Blinding Documentation',
        'Subjective endpoints in RCTs are susceptible to bias',
        'Document whether endpoint assessment is blinded. For subjective endpoints (pain, QoL, symptoms), blinded assessment is critical to minimize bias. If open-label, justify and consider objective secondary endpoints.',
        'ICH E9, Section 2.2.3',
        'primaryEndpoint.blindedAssessment'
      ));
    }

    return issues;
  }
};

export const OBSERVATIONAL_ENDPOINT_REQUIREMENTS: ValidationRule = {
  id: 'observational-endpoint-requirements',
  name: 'Observational: Objective Endpoint Preference',
  personaId: 'endpoint-validator',
  category: 'endpoint-definition',
  severity: 'info',
  description: 'Observational studies benefit from objective endpoints',
  studyTypes: ['observational', 'cohort', 'case-control'],
  check: (context: ValidationContext): ValidationIssue[] => {
    const protocol = context.protocolDocument;
    const issues: ValidationIssue[] = [];

    if (!protocol || !protocol.primaryEndpoint) return issues;

    // Encourage objective endpoints in observational studies
    const endpointName = protocol.primaryEndpoint.name?.toLowerCase() || '';
    const isObjective = ['death', 'mortality', 'hospitalization', 'diagnosis', 'laboratory']
      .some(term => endpointName.includes(term));

    if (!isObjective) {
      issues.push(createIssue(
        'obs-subjective-endpoint',
        'info',
        'Consider Objective Endpoints for Observational Studies',
        'Observational studies are prone to confounding and bias',
        'Objective endpoints (mortality, hospitalization, lab results, administrative data) are less susceptible to measurement bias and confounding in observational studies. If using subjective endpoints, carefully address potential bias sources.',
        'STROBE Guidelines'
      ));
    }

    return issues;
  }
};

export const DIAGNOSTIC_ENDPOINT_REQUIREMENTS: ValidationRule = {
  id: 'diagnostic-endpoint-requirements',
  name: 'Diagnostic Study: Accuracy Endpoint Requirements',
  personaId: 'endpoint-validator',
  category: 'endpoint-definition',
  severity: 'critical',
  description: 'Diagnostic studies must define accuracy metrics as endpoints',
  studyTypes: ['diagnostic'],
  check: (context: ValidationContext): ValidationIssue[] => {
    const protocol = context.protocolDocument;
    const issues: ValidationIssue[] = [];

    if (!protocol || !protocol.primaryEndpoint) return issues;

    // Check for diagnostic accuracy metrics
    const accuracyKeywords = ['sensitivity', 'specificity', 'accuracy', 'auc', 'roc', 'predictive value'];
    const hasAccuracyMetric = accuracyKeywords.some(kw => 
      protocol.primaryEndpoint.name?.toLowerCase().includes(kw) ||
      protocol.primaryEndpoint.definition?.toLowerCase().includes(kw)
    );

    if (!hasAccuracyMetric) {
      issues.push(createIssue(
        'diagnostic-no-accuracy-endpoint',
        'critical',
        'Diagnostic Study Missing Accuracy Endpoint',
        'Diagnostic studies must define diagnostic accuracy as the primary endpoint',
        'Define primary endpoint as diagnostic accuracy metrics: Sensitivity and Specificity, or Positive/Negative Predictive Values, or AUC/ROC. Specify the reference standard (gold standard) against which the index test is compared.',
        'STARD Guidelines',
        'primaryEndpoint.name'
      ));
    }

    // Check for reference standard definition
    if (!protocol.referenceStandard) {
      issues.push(createIssue(
        'diagnostic-no-reference-standard',
        'critical',
        'Reference Standard Not Defined',
        'Diagnostic studies require a reference standard (gold standard)',
        'Define the reference standard: the best available method for establishing true disease status. Address: 1) What is the reference standard?, 2) Who performs it?, 3) Are assessors blinded to index test?, 4) Timing between tests.',
        'STARD Guidelines',
        'referenceStandard'
      ));
    }

    return issues;
  }
};

// ============================================================================
// EXPORT ALL RULES
// ============================================================================

export const ENDPOINT_VALIDATION_RULES: ValidationRule[] = [
  PRIMARY_ENDPOINT_DEFINITION,
  SECONDARY_ENDPOINTS_SPECIFICATION,
  COMPOSITE_ENDPOINT_VALIDATION,
  SURROGATE_ENDPOINT_VALIDATION,
  PRO_ENDPOINT_VALIDATION,
  ENDPOINT_OBJECTIVE_ALIGNMENT,
  RCT_ENDPOINT_REQUIREMENTS,
  OBSERVATIONAL_ENDPOINT_REQUIREMENTS,
  DIAGNOSTIC_ENDPOINT_REQUIREMENTS
];
