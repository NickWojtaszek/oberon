// Statistical Advisor - Analysis Plan Validation

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
    personaId: 'statistical-advisor',
    severity,
    category: 'statistical-analysis',
    title,
    description,
    recommendation,
    location: {
      module: 'analytics',
      tab: 'analysis-plan',
      field
    },
    citation,
    autoFixAvailable: false,
    studyTypeSpecific: false
  };
}

// ============================================================================
// SAMPLE SIZE AND POWER ANALYSIS
// ============================================================================

export const SAMPLE_SIZE_JUSTIFICATION: ValidationRule = {
  id: 'sample-size-justification',
  name: 'Sample Size Justification',
  personaId: 'statistical-advisor',
  category: 'statistical-analysis',
  severity: 'critical',
  description: 'Statistical justification for sample size required per ICH E9',
  check: (context: ValidationContext): ValidationIssue[] => {
    const manifest = context.statisticalManifest;
    const issues: ValidationIssue[] = [];

    if (!manifest) return issues;

    // Check if sample size is defined
    if (!manifest.targetSampleSize || manifest.targetSampleSize <= 0) {
      issues.push(createIssue(
        'sample-size-undefined',
        'critical',
        'Sample Size Not Defined',
        'Target sample size must be specified in the statistical analysis plan',
        'Define the target sample size based on power analysis. Consider effect size, statistical power (typically 80-90%), and significance level (typically 0.05).',
        'ICH E9, Section 3.5',
        'targetSampleSize'
      ));
    }

    // Check for power analysis
    if (!manifest.powerAnalysis) {
      issues.push(createIssue(
        'power-analysis-missing',
        'critical',
        'Power Analysis Not Documented',
        'Statistical power calculation is required to justify sample size',
        'Conduct and document power analysis including: 1) Expected effect size, 2) Statistical power (β), 3) Significance level (α), 4) Attrition rate assumptions.',
        'ICH E9, Section 3.5',
        'powerAnalysis'
      ));
    } else {
      // Check power analysis components
      if (!manifest.powerAnalysis.expectedEffectSize) {
        issues.push(createIssue(
          'effect-size-missing',
          'warning',
          'Expected Effect Size Not Specified',
          'Power analysis should include expected effect size',
          'Specify the minimum clinically important difference (MCID) or expected effect size based on literature or pilot data.',
          'ICH E9, Section 3.5'
        ));
      }

      if (!manifest.powerAnalysis.statisticalPower || manifest.powerAnalysis.statisticalPower < 0.8) {
        issues.push(createIssue(
          'power-low',
          'warning',
          'Statistical Power Below Standard',
          'Statistical power is below 80%, which is the conventional threshold',
          'Consider increasing sample size to achieve 80-90% power, or provide justification for lower power if appropriate.',
          'ICH E9, Section 3.5'
        ));
      }
    }

    // Check for attrition assumptions
    if (!manifest.attritionRate) {
      issues.push(createIssue(
        'attrition-not-specified',
        'warning',
        'Attrition Rate Not Specified',
        'Sample size calculation should account for expected dropout',
        'Estimate expected attrition rate based on literature or prior studies. Adjust target sample size accordingly (e.g., inflate by 15-20%).',
        'ICH E9, Section 3.5'
      ));
    }

    return issues;
  }
};

// ============================================================================
// PRIMARY ENDPOINT ANALYSIS
// ============================================================================

export const PRIMARY_ENDPOINT_SPECIFICATION: ValidationRule = {
  id: 'primary-endpoint-specification',
  name: 'Primary Endpoint Analysis Specification',
  personaId: 'statistical-advisor',
  category: 'statistical-analysis',
  severity: 'critical',
  description: 'Primary endpoint and analysis method must be clearly defined',
  check: (context: ValidationContext): ValidationIssue[] => {
    const manifest = context.statisticalManifest;
    const issues: ValidationIssue[] = [];

    if (!manifest) return issues;

    // Check for primary endpoint definition
    if (!manifest.primaryEndpoint) {
      issues.push(createIssue(
        'primary-endpoint-missing',
        'critical',
        'Primary Endpoint Not Defined',
        'Statistical analysis plan must specify the primary endpoint',
        'Define a single primary endpoint that directly addresses the study objective. Multiple primary endpoints require multiplicity adjustments.',
        'ICH E9, Section 4.1',
        'primaryEndpoint'
      ));
    } else {
      // Check if endpoint is measurable
      if (!manifest.primaryEndpoint.measurementMethod) {
        issues.push(createIssue(
          'primary-endpoint-measurement',
          'warning',
          'Endpoint Measurement Method Not Specified',
          'Primary endpoint should have a clearly defined measurement method',
          'Specify how the primary endpoint will be measured, including instruments, scales, or laboratory methods.',
          'ICH E9, Section 4.1'
        ));
      }

      // Check if endpoint has timing
      if (!manifest.primaryEndpoint.timePoint) {
        issues.push(createIssue(
          'primary-endpoint-timing',
          'warning',
          'Primary Endpoint Time Point Not Specified',
          'Time point for primary endpoint assessment should be defined',
          'Specify when the primary endpoint will be assessed (e.g., "at 12 weeks", "at end of treatment").',
          'ICH E9, Section 4.1'
        ));
      }
    }

    // Check for statistical test specification
    if (!manifest.primaryAnalysisMethod) {
      issues.push(createIssue(
        'primary-analysis-method-missing',
        'critical',
        'Primary Analysis Method Not Specified',
        'Statistical test for primary endpoint must be pre-specified',
        'Specify the statistical test (e.g., t-test, ANOVA, logistic regression, Cox regression) and justify choice based on endpoint type and study design.',
        'ICH E9, Section 5.1',
        'primaryAnalysisMethod'
      ));
    }

    return issues;
  }
};

// ============================================================================
// MULTIPLICITY ADJUSTMENTS
// ============================================================================

export const MULTIPLICITY_CONTROL: ValidationRule = {
  id: 'multiplicity-control',
  name: 'Multiplicity Adjustment Strategy',
  personaId: 'statistical-advisor',
  category: 'statistical-analysis',
  severity: 'warning',
  description: 'Multiple testing requires Type I error control',
  check: (context: ValidationContext): ValidationIssue[] => {
    const manifest = context.statisticalManifest;
    const issues: ValidationIssue[] = [];

    if (!manifest) return issues;

    const secondaryEndpointsCount = manifest.secondaryEndpoints?.length || 0;
    const subgroupsCount = manifest.subgroupAnalyses?.length || 0;
    const interimAnalysesCount = manifest.interimAnalyses?.length || 0;

    // Check for multiple secondary endpoints
    if (secondaryEndpointsCount >= 3 && !manifest.multiplicityAdjustment) {
      issues.push(createIssue(
        'multiplicity-secondary',
        'warning',
        'Multiple Secondary Endpoints Without Adjustment',
        `${secondaryEndpointsCount} secondary endpoints without multiplicity correction may inflate Type I error`,
        'Consider multiplicity adjustment methods: Bonferroni correction, Holm procedure, Hochberg procedure, or use hierarchical testing strategy.',
        'ICH E9, Section 5.2.3'
      ));
    }

    // Check for subgroup analyses
    if (subgroupsCount >= 5 && !manifest.subgroupMultiplicityControl) {
      issues.push(createIssue(
        'multiplicity-subgroups',
        'warning',
        'Multiple Subgroup Analyses Risk Spurious Findings',
        `${subgroupsCount} subgroup analyses planned without multiplicity control`,
        'Subgroup analyses are exploratory and prone to false positives. Pre-specify a limited number of hypothesis-driven subgroups and consider interaction tests.',
        'ICH E9, Section 5.7'
      ));
    }

    // Check for interim analyses
    if (interimAnalysesCount > 0 && !manifest.alphaSpendingFunction) {
      issues.push(createIssue(
        'multiplicity-interim',
        'critical',
        'Interim Analyses Without Alpha Spending Function',
        `${interimAnalysesCount} interim analysis planned without Type I error control`,
        'Interim analyses require alpha spending functions (e.g., O\'Brien-Fleming, Pocock, Lan-DeMets) to preserve overall Type I error rate.',
        'ICH E9, Section 4.4.3',
        'alphaSpendingFunction'
      ));
    }

    return issues;
  }
};

// ============================================================================
// MISSING DATA HANDLING
// ============================================================================

export const MISSING_DATA_STRATEGY: ValidationRule = {
  id: 'missing-data-strategy',
  name: 'Missing Data Handling Strategy',
  personaId: 'statistical-advisor',
  category: 'statistical-analysis',
  severity: 'warning',
  description: 'Pre-specify approach for handling missing data',
  check: (context: ValidationContext): ValidationIssue[] => {
    const manifest = context.statisticalManifest;
    const issues: ValidationIssue[] = [];

    if (!manifest) return issues;

    // Check for missing data plan
    if (!manifest.missingDataStrategy) {
      issues.push(createIssue(
        'missing-data-plan',
        'warning',
        'Missing Data Handling Not Specified',
        'Statistical analysis plan should address approach for missing data',
        'Pre-specify missing data handling: 1) Assumptions (MCAR, MAR, MNAR), 2) Method (complete case, LOCF, multiple imputation, mixed models), 3) Sensitivity analyses.',
        'ICH E9, Section 5.3',
        'missingDataStrategy'
      ));
    } else {
      // Check for sensitivity analyses
      if (!manifest.missingDataSensitivity) {
        issues.push(createIssue(
          'missing-data-sensitivity',
          'info',
          'Consider Missing Data Sensitivity Analysis',
          'Sensitivity analyses strengthen conclusions when missing data is present',
          'Plan sensitivity analyses to assess robustness under different missing data assumptions (e.g., tipping point analysis, pattern-mixture models).',
          'ICH E9, Section 5.3'
        ));
      }
    }

    return issues;
  }
};

// ============================================================================
// STUDY-TYPE-SPECIFIC VALIDATIONS
// ============================================================================

export const RCT_RANDOMIZATION_ANALYSIS: ValidationRule = {
  id: 'rct-randomization-analysis',
  name: 'RCT: Intention-to-Treat Analysis',
  personaId: 'statistical-advisor',
  category: 'statistical-analysis',
  severity: 'critical',
  description: 'RCTs should pre-specify ITT as primary analysis',
  studyTypes: ['rct'],
  check: (context: ValidationContext): ValidationIssue[] => {
    const manifest = context.statisticalManifest;
    const issues: ValidationIssue[] = [];

    if (!manifest) return issues;

    // Check for ITT specification
    if (!manifest.analysisSets || !manifest.analysisSets.includes('ITT')) {
      issues.push(createIssue(
        'rct-itt-missing',
        'critical',
        'Intention-to-Treat Analysis Not Specified',
        'RCTs should analyze all randomized participants in their assigned groups',
        'Specify ITT as the primary analysis population. This preserves randomization and minimizes bias. Also define per-protocol and safety populations.',
        'ICH E9, Section 5.2.1',
        'analysisSets'
      ));
    }

    // Check for randomization stratification variables
    if (manifest.stratificationVariables && manifest.stratificationVariables.length > 0) {
      if (!manifest.adjustForStratification) {
        issues.push(createIssue(
          'rct-stratification-adjustment',
          'warning',
          'Stratified Randomization Without Adjustment',
          'Analysis should account for stratification factors used in randomization',
          'Include stratification variables as covariates in the primary analysis model to improve precision and preserve Type I error.',
          'ICH E9, Section 5.6'
        ));
      }
    }

    return issues;
  }
};

export const OBSERVATIONAL_CONFOUNDING_CONTROL: ValidationRule = {
  id: 'observational-confounding-control',
  name: 'Observational: Confounding Control Strategy',
  personaId: 'statistical-advisor',
  category: 'statistical-analysis',
  severity: 'critical',
  description: 'Observational studies must address confounding',
  studyTypes: ['observational', 'cohort', 'case-control'],
  check: (context: ValidationContext): ValidationIssue[] => {
    const manifest = context.statisticalManifest;
    const issues: ValidationIssue[] = [];

    if (!manifest) return issues;

    // Check for confounding control method
    if (!manifest.confoundingControlMethod) {
      issues.push(createIssue(
        'obs-confounding-missing',
        'critical',
        'Confounding Control Method Not Specified',
        'Observational studies require explicit strategy to address confounding',
        'Specify confounding control method: 1) Multivariable regression, 2) Propensity score matching/weighting, 3) Instrumental variables, 4) Difference-in-differences.',
        'ICH E9 Addendum on Estimands',
        'confoundingControlMethod'
      ));
    }

    // Check for covariate selection
    if (!manifest.covariates || manifest.covariates.length === 0) {
      issues.push(createIssue(
        'obs-covariates-missing',
        'warning',
        'Confounding Variables Not Listed',
        'Pre-specify covariates to be adjusted for in multivariable models',
        'Identify potential confounders based on: 1) Directed acyclic graphs (DAGs), 2) Literature review, 3) Clinical expertise. Avoid model over-fitting.',
        'ICH E9 Addendum on Estimands'
      ));
    }

    // Check for propensity score methods
    if (manifest.confoundingControlMethod?.includes('propensity')) {
      if (!manifest.propensityScoreSpec) {
        issues.push(createIssue(
          'obs-propensity-spec',
          'warning',
          'Propensity Score Specification Incomplete',
          'Propensity score methods require detailed specification',
          'Document: 1) Variables in PS model, 2) PS method (matching, weighting, stratification), 3) Balance assessment approach, 4) Overlap/common support handling.',
          'STROBE Guidelines'
        ));
      }
    }

    return issues;
  }
};

export const SURVIVAL_ANALYSIS_SPECIFICATION: ValidationRule = {
  id: 'survival-analysis-specification',
  name: 'Survival Analysis: Censoring and Assumptions',
  personaId: 'statistical-advisor',
  category: 'statistical-analysis',
  severity: 'warning',
  description: 'Time-to-event analyses require censoring plan',
  check: (context: ValidationContext): ValidationIssue[] => {
    const manifest = context.statisticalManifest;
    const issues: ValidationIssue[] = [];

    if (!manifest) return issues;

    const isSurvivalStudy = manifest.primaryEndpoint?.type === 'time-to-event' ||
                             manifest.primaryAnalysisMethod?.includes('Cox') ||
                             manifest.primaryAnalysisMethod?.includes('Kaplan');

    if (!isSurvivalStudy) return issues;

    // Check for censoring definition
    if (!manifest.censoringDefinition) {
      issues.push(createIssue(
        'survival-censoring-missing',
        'warning',
        'Censoring Rules Not Defined',
        'Survival analysis requires clear definition of censoring events',
        'Define censoring rules: 1) Administrative censoring (end of study), 2) Loss to follow-up, 3) Competing risks handling, 4) Informative vs non-informative censoring.',
        'ICH E9, Section 5.4'
      ));
    }

    // Check for proportional hazards assumption
    if (manifest.primaryAnalysisMethod?.includes('Cox')) {
      if (!manifest.proportionalHazardsCheck) {
        issues.push(createIssue(
          'survival-ph-assumption',
          'info',
          'Proportional Hazards Assumption Check Recommended',
          'Cox models assume proportional hazards over time',
          'Plan to assess proportional hazards assumption using: 1) Schoenfeld residuals, 2) Log-log plots, 3) Time-dependent covariates. Pre-specify alternative if violated.',
          'ICH E9, Section 5.4'
        ));
      }
    }

    return issues;
  }
};

export const DIAGNOSTIC_ACCURACY_METRICS: ValidationRule = {
  id: 'diagnostic-accuracy-metrics',
  name: 'Diagnostic Study: Accuracy Metrics Specification',
  personaId: 'statistical-advisor',
  category: 'statistical-analysis',
  severity: 'critical',
  description: 'Diagnostic studies must pre-specify accuracy metrics',
  studyTypes: ['diagnostic'],
  check: (context: ValidationContext): ValidationIssue[] => {
    const manifest = context.statisticalManifest;
    const issues: ValidationIssue[] = [];

    if (!manifest) return issues;

    // Check for sensitivity/specificity
    if (!manifest.diagnosticMetrics || 
        (!manifest.diagnosticMetrics.includes('sensitivity') && 
         !manifest.diagnosticMetrics.includes('specificity'))) {
      issues.push(createIssue(
        'diagnostic-metrics-missing',
        'critical',
        'Diagnostic Accuracy Metrics Not Specified',
        'Diagnostic studies must pre-specify primary accuracy metrics',
        'Define primary metrics: 1) Sensitivity and Specificity, 2) Positive/Negative Predictive Values, 3) Likelihood ratios, 4) AUC/ROC curve. Specify confidence interval method.',
        'STARD Guidelines',
        'diagnosticMetrics'
      ));
    }

    // Check for reference standard
    if (!manifest.referenceStandard) {
      issues.push(createIssue(
        'diagnostic-reference-missing',
        'critical',
        'Reference Standard Not Defined',
        'Diagnostic accuracy requires a reference standard (gold standard)',
        'Define the reference standard against which the index test will be compared. Address: 1) Blinding between tests, 2) Timing between tests, 3) Indeterminate results handling.',
        'STARD Guidelines'
      ));
    }

    return issues;
  }
};

// ============================================================================
// EXPORT ALL RULES
// ============================================================================

export const STATISTICAL_VALIDATION_RULES: ValidationRule[] = [
  SAMPLE_SIZE_JUSTIFICATION,
  PRIMARY_ENDPOINT_SPECIFICATION,
  MULTIPLICITY_CONTROL,
  MISSING_DATA_STRATEGY,
  RCT_RANDOMIZATION_ANALYSIS,
  OBSERVATIONAL_CONFOUNDING_CONTROL,
  SURVIVAL_ANALYSIS_SPECIFICATION,
  DIAGNOSTIC_ACCURACY_METRICS
];
