// StatisticianPromptEngine
// Builds domain-specific prompts for Gemini and parses responses
// Enhanced with study-type-specific guidance and multi-domain interpretation

import type {
  StatisticalAnalysisContext,
  AnalysisSuggestion,
  SchemaBlockSummary,
  ProposedAnalysis,
  SuggestionType,
  AnalysisType,
  StatisticalMethod,
  AnalysisParameters,
  SuggestionGrounding,
  FeasibilityResult,
  StudyType,
} from './types';

// =============================================================================
// DOMAIN-SPECIFIC KNOWLEDGE BASE
// =============================================================================

/**
 * Study design templates with recommended analyses
 */
const STUDY_DESIGN_TEMPLATES: Record<string, {
  primaryAnalyses: string[];
  secondaryAnalyses: string[];
  safetyAnalyses: string[];
  requiredDescriptives: string[];
  benchmarks?: Record<string, { low: number; high: number; unit: string }>;
  regulatoryGuidance: string[];
}> = {
  'rct': {
    primaryAnalyses: [
      'Intention-to-treat analysis comparing primary endpoint between treatment arms',
      'Per-protocol analysis as sensitivity check',
      'Kaplan-Meier survival curves if time-to-event',
    ],
    secondaryAnalyses: [
      'Subgroup analyses by pre-specified covariates',
      'Multiplicity-adjusted secondary endpoint tests',
      'Responder analysis using clinically meaningful thresholds',
    ],
    safetyAnalyses: [
      'Adverse event frequency and severity comparison',
      'Time-to-discontinuation analysis',
      'Serious adverse event incidence with Wilson CI',
    ],
    requiredDescriptives: [
      'Baseline characteristics by treatment arm (Table 1)',
      'Disposition flow diagram (CONSORT)',
      'Protocol deviations summary',
    ],
    benchmarks: {
      'dropout_rate': { low: 0, high: 20, unit: '%' },
      'protocol_deviation': { low: 0, high: 10, unit: '%' },
    },
    regulatoryGuidance: [
      'ICH E9: Statistical Principles for Clinical Trials',
      'ICH E9(R1): Estimands and Sensitivity Analysis',
      'CONSORT 2010 Statement',
    ],
  },
  'cohort': {
    primaryAnalyses: [
      'Cox proportional hazards for time-to-event outcomes',
      'Kaplan-Meier curves stratified by exposure',
      'Log-rank test for survival comparison',
    ],
    secondaryAnalyses: [
      'Propensity score matching/weighting for confounding',
      'Incidence rate ratios with 95% CI',
      'Dose-response analysis if applicable',
    ],
    safetyAnalyses: [
      'Incidence of complications with Wilson score CI',
      'Time-to-complication analysis',
      'Risk factor identification via univariate regression',
    ],
    requiredDescriptives: [
      'Baseline cohort characteristics',
      'Follow-up duration summary (median, IQR)',
      'Loss to follow-up analysis',
    ],
    benchmarks: {
      'loss_to_followup': { low: 0, high: 15, unit: '%' },
    },
    regulatoryGuidance: [
      'STROBE Statement for cohort studies',
      'ICH E9: Observational study considerations',
    ],
  },
  'case-control': {
    primaryAnalyses: [
      'Odds ratios with 95% CI for primary exposure',
      'Multivariable logistic regression adjusting for confounders',
      'Conditional logistic regression if matched',
    ],
    secondaryAnalyses: [
      'Stratified analyses by key covariates',
      'Interaction analysis for effect modification',
      'Population attributable fraction',
    ],
    safetyAnalyses: [],
    requiredDescriptives: [
      'Case and control characteristics comparison',
      'Exposure prevalence in each group',
      'Matching variable distribution',
    ],
    regulatoryGuidance: [
      'STROBE Statement for case-control studies',
    ],
  },
  'cross-sectional': {
    primaryAnalyses: [
      'Prevalence estimation with Wilson CI',
      'Chi-square or Fisher exact for associations',
      'Logistic regression for multivariable analysis',
    ],
    secondaryAnalyses: [
      'Stratified prevalence by subgroups',
      'Correlation analysis for continuous variables',
    ],
    safetyAnalyses: [],
    requiredDescriptives: [
      'Participant demographics',
      'Prevalence of key conditions',
      'Missing data assessment',
    ],
    regulatoryGuidance: [
      'STROBE Statement for cross-sectional studies',
    ],
  },
  'diagnostic': {
    primaryAnalyses: [
      'Sensitivity and specificity with 95% CI',
      'Positive and negative predictive values',
      'ROC curve analysis with AUC',
      'Likelihood ratios (positive and negative)',
    ],
    secondaryAnalyses: [
      'Subgroup diagnostic accuracy',
      'Comparison with reference standard',
      'Inter-rater reliability (if applicable)',
    ],
    safetyAnalyses: [],
    requiredDescriptives: [
      '2x2 contingency table',
      'Disease prevalence in study population',
      'Inconclusive/indeterminate test results',
    ],
    regulatoryGuidance: [
      'STARD 2015 Statement for diagnostic accuracy studies',
    ],
  },
  'single-arm': {
    primaryAnalyses: [
      'Response rate with exact binomial CI',
      'Time-to-response analysis (Kaplan-Meier)',
      'Duration of response',
    ],
    secondaryAnalyses: [
      'Subgroup response rates',
      'Landmark analyses at pre-specified timepoints',
    ],
    safetyAnalyses: [
      'Adverse event profile',
      'Dose modifications and discontinuations',
    ],
    requiredDescriptives: [
      'Baseline characteristics',
      'Treatment exposure summary',
      'Best response distribution',
    ],
    regulatoryGuidance: [
      'ICH E9: Single-arm trial considerations',
      'Simon two-stage design if applicable',
    ],
  },
};

/**
 * Variable type to analysis mapping
 */
const VARIABLE_ANALYSIS_MATRIX: Record<string, Record<string, {
  primary: AnalysisType;
  alternative: AnalysisType;
  assumption: string;
}>> = {
  'categorical': {
    'categorical': {
      primary: 'chi-square',
      alternative: 'fisher-exact',
      assumption: 'Expected cell count ≥5 for chi-square; use Fisher if any cell <5',
    },
    'continuous': {
      primary: 't-test',
      alternative: 'mann-whitney',
      assumption: 'Normal distribution and equal variances for t-test; Mann-Whitney if violated',
    },
    'binary': {
      primary: 'chi-square',
      alternative: 'fisher-exact',
      assumption: 'Expected cell count ≥5; use Fisher for small samples',
    },
    'time-to-event': {
      primary: 'log-rank',
      alternative: 'cox-regression',
      assumption: 'Proportional hazards assumption for Cox regression',
    },
  },
  'continuous': {
    'categorical': {
      primary: 'logistic-regression',
      alternative: 'logistic-regression',
      assumption: 'Linearity in log-odds',
    },
    'continuous': {
      primary: 'pearson-correlation',
      alternative: 'spearman-correlation',
      assumption: 'Bivariate normality for Pearson; Spearman for non-normal or ordinal',
    },
    'binary': {
      primary: 'logistic-regression',
      alternative: 'logistic-regression',
      assumption: 'Linearity in log-odds; check for outliers',
    },
    'time-to-event': {
      primary: 'cox-regression',
      alternative: 'cox-regression',
      assumption: 'Proportional hazards; consider time-varying if violated',
    },
  },
};

/**
 * Clinical domain benchmarks
 */
const CLINICAL_BENCHMARKS: Record<string, Record<string, {
  acceptable: [number, number];
  concerning: number;
  source: string;
}>> = {
  'cardiovascular': {
    '30-day_mortality': { acceptable: [0, 5], concerning: 10, source: 'ACC/AHA Guidelines' },
    'stroke_rate': { acceptable: [0, 7], concerning: 13, source: 'EVAR/TEVAR literature' },
    'major_bleeding': { acceptable: [0, 8], concerning: 15, source: 'BARC criteria' },
    'aki_rate': { acceptable: [0, 10], concerning: 20, source: 'AKIN criteria' },
  },
  'oncology': {
    'overall_response': { acceptable: [20, 100], concerning: 10, source: 'RECIST 1.1' },
    'complete_response': { acceptable: [5, 100], concerning: 2, source: 'RECIST 1.1' },
    'progression_free_survival_6mo': { acceptable: [40, 100], concerning: 20, source: 'Disease-specific' },
  },
  'diabetes': {
    'hba1c_reduction': { acceptable: [0.5, 3], concerning: 0.3, source: 'ADA Guidelines' },
    'hypoglycemia_rate': { acceptable: [0, 5], concerning: 10, source: 'ADA Guidelines' },
  },
};

// =============================================================================
// PROMPT ENGINE CLASS
// =============================================================================

/**
 * Builds prompts for the Statistician AI and parses LLM responses
 */
export class StatisticianPromptEngine {
  /**
   * Build comprehensive prompt for generating a complete analysis plan
   */
  buildAnalysisPlanPrompt(context: StatisticalAnalysisContext): string {
    const studyDesign = this.normalizeStudyDesign(context.protocol.studyDesign);
    const template = STUDY_DESIGN_TEMPLATES[studyDesign] || STUDY_DESIGN_TEMPLATES['cohort'];
    const clinicalDomain = this.detectClinicalDomain(context);

    return `You are Dr. Saga, an expert clinical biostatistician with deep knowledge of regulatory requirements, clinical trial methodology, and domain-specific analysis standards. You provide rigorous, publication-ready statistical guidance.

## STUDY CONTEXT

### Study Design: ${studyDesign.toUpperCase()}
${context.protocol.studyPhase ? `Phase: ${context.protocol.studyPhase}` : ''}

### PICO Framework
- **Population**: ${context.protocol.pico.population || 'Not specified'}
- **Intervention**: ${context.protocol.pico.intervention || 'Not specified'}
- **Comparison**: ${context.protocol.pico.comparison || 'Not specified'}
- **Outcome**: ${context.protocol.pico.outcome || 'Not specified'}
${context.protocol.pico.timeframe ? `- **Timeframe**: ${context.protocol.pico.timeframe}` : ''}

### Study Objectives
- **Primary**: ${context.protocol.primaryObjective || 'Not specified'}
${context.protocol.secondaryObjectives?.length ? `- **Secondary**: ${context.protocol.secondaryObjectives.join('; ')}` : ''}

${context.protocol.statisticalPlan ? `### Pre-specified Statistical Plan\n${context.protocol.statisticalPlan}` : ''}

## REGULATORY FRAMEWORK FOR ${studyDesign.toUpperCase()} STUDIES

${template.regulatoryGuidance.map(g => `- ${g}`).join('\n')}

### Required Analyses per Guidelines:
**Primary**: ${template.primaryAnalyses.slice(0, 2).join('; ')}
**Safety**: ${template.safetyAnalyses.slice(0, 2).join('; ')}
**Descriptives**: ${template.requiredDescriptives.join('; ')}

## SCHEMA VARIABLES (${context.schema.blocks.length} total)

### Primary Endpoints (${context.schema.primaryEndpoints.length})
${this.formatVariablesDetailed(context.schema.primaryEndpoints)}

### Secondary Endpoints (${context.schema.secondaryEndpoints.length})
${this.formatVariablesDetailed(context.schema.secondaryEndpoints)}

### Predictor Variables (${context.schema.predictors.length})
${this.formatVariablesDetailed(context.schema.predictors)}

### Outcome Variables
${this.formatVariablesDetailed(context.schema.outcomes.slice(0, 10))}

### Covariates/Confounders (for adjustment)
${this.formatVariablesDetailed(context.schema.blocks.filter(b =>
  !b.endpointTier && b.role !== 'Predictor' && b.dataType !== 'Section'
).slice(0, 8))}

## DATA CHARACTERISTICS

- **Total Records**: ${context.data.totalRecords}
- **Completed Records**: ${context.data.completedRecords}
- **Overall Missing Rate**: ${context.data.missingDataSummary.overallMissingRate.toFixed(1)}%
- **Missing Data Pattern**: ${context.data.missingDataSummary.pattern} (confidence: ${(context.data.missingDataSummary.patternConfidence * 100).toFixed(0)}%)

${context.data.sampleSizeByGroup ? `### Sample Sizes by Group
${Object.entries(context.data.sampleSizeByGroup).map(([g, n]) => `- ${g}: n=${n}`).join('\n')}` : ''}

### Key Variable Distributions
${this.formatKeyDistributions(context)}

${context.foundationalPapers ? this.formatFoundationalPapersEnhanced(context.foundationalPapers) : ''}

${clinicalDomain ? this.formatDomainBenchmarks(clinicalDomain) : ''}

## STATISTICAL ANALYSIS REQUIREMENTS

Generate a comprehensive analysis plan following this structure:

### 1. DESCRIPTIVE ANALYSES (Auto-Execute)
- Baseline characteristics table (Table 1)
- Distribution assessments for continuous variables (normality, outliers)
- Frequency tables for categorical variables

### 2. PRIMARY ANALYSIS (Requires Approval)
- Match the primary endpoint to the appropriate test
- Include effect size estimation with confidence intervals
- Specify the primary statistical model

### 3. SECONDARY ANALYSES (Requires Approval)
- Secondary endpoint analyses
- Subgroup analyses (if pre-specified)
- Sensitivity analyses

### 4. SAFETY ANALYSIS (Requires Approval)
- Adverse event tabulation
- Complication rates with Wilson score 95% CI
- Time-to-event for safety outcomes

### 5. MULTIPLICITY ADJUSTMENT
- Specify method for multiple testing correction (Bonferroni, Holm, FDR)

### TEST SELECTION GUIDANCE

${this.generateTestSelectionGuidance(context)}

## RESPONSE FORMAT

Respond with valid JSON only. Include the following for EACH analysis suggestion:

{
  "suggestions": [
    {
      "suggestionType": "descriptive" | "normality-check" | "primary-analysis" | "secondary-analysis" | "exploratory-analysis" | "assumption-check" | "sensitivity-analysis" | "sample-size-review" | "missing-data-strategy" | "multiplicity-adjustment" | "subgroup-analysis" | "effect-size-estimation",
      "priority": "critical" | "recommended" | "optional",
      "title": "Clear, specific title",
      "description": "What this analysis accomplishes and why it matters",
      "rationale": "Detailed justification including: (1) why this test, (2) assumptions checked, (3) regulatory alignment",
      "autoExecute": true | false,
      "grounding": {
        "protocolReference": "Specific link to PICO or objective",
        "regulatoryReference": "ICH E9 Section X, CONSORT item Y, STROBE item Z",
        "literatureReference": "Reference to foundational paper method if applicable"
      },
      "proposedAnalysis": {
        "analysisType": "descriptive" | "normality-test" | "t-test" | "paired-t-test" | "anova" | "repeated-anova" | "chi-square" | "fisher-exact" | "mcnemar" | "pearson-correlation" | "spearman-correlation" | "mann-whitney" | "wilcoxon" | "kruskal-wallis" | "linear-regression" | "logistic-regression" | "cox-regression" | "kaplan-meier" | "log-rank" | "diagnostic-accuracy",
        "predictorId": "variable ID or null for single-variable analyses",
        "outcomeId": "variable ID - REQUIRED",
        "covariateIds": ["array of covariate IDs for adjustment"],
        "stratificationFactorIds": ["array of stratification variable IDs"],
        "method": {
          "name": "Full statistical method name",
          "category": "descriptive" | "parametric" | "non-parametric" | "regression" | "survival" | "diagnostic",
          "assumptions": ["List ALL assumptions that must be met"],
          "references": ["Relevant methodology references"]
        },
        "parameters": {
          "alpha": 0.05,
          "tails": "two" | "one",
          "confidenceLevel": 0.95,
          "pairedData": false,
          "equalVariances": null,
          "continuityCorrection": true,
          "multiplicityMethod": "none" | "bonferroni" | "holm" | "hochberg" | "fdr"
        }
      },
      "expectedOutputs": {
        "primaryStatistic": "e.g., Mean difference, Odds ratio, Hazard ratio",
        "effectSizeType": "Cohen's d | Odds ratio | Hazard ratio | Correlation coefficient",
        "confidenceInterval": true,
        "pValue": true,
        "visualization": "bar" | "histogram" | "boxplot" | "scatter" | "line" | "kaplan-meier" | "forest-plot"
      },
      "feasibilityNotes": "Any concerns about sample size, data quality, or assumption violations",
      "confidence": 85
    }
  ],
  "globalRecommendations": {
    "multiplicityAdjustment": "Recommendation with rationale",
    "missingDataStrategy": "Recommendation based on missing pattern",
    "sensitivityAnalyses": ["List of recommended sensitivity analyses"],
    "powerConsiderations": "Assessment of statistical power given sample size"
  },
  "analysisFlowSummary": "Brief narrative of the analysis strategy from descriptives through primary to sensitivity"
}

## CRITICAL REQUIREMENTS

1. **Use actual variable IDs** from the schema (not made-up names)
2. **Match test to data type**: Verify predictor/outcome types before recommending tests
3. **Check sample size adequacy**: Flag if N < 30 for parametric tests
4. **Include effect sizes**: Every comparison must have an effect size measure
5. **Reference regulations**: Cite specific ICH E9 sections or CONSORT/STROBE items
6. **Wilson CI for proportions**: Always use Wilson score interval for rates/proportions
7. **Address multiplicity**: If >1 hypothesis test, specify correction method`;
  }

  /**
   * Build prompt for generating domain-specific interpretation
   */
  buildInterpretationPrompt(
    context: StatisticalAnalysisContext,
    results: Record<string, any>,
    domain: 'demographics' | 'safety' | 'efficacy' | 'survival' | 'subgroups'
  ): string {
    const prompts: Record<string, string> = {
      'demographics': `Interpret the baseline demographic characteristics:
- Age distribution (mean, range, any outliers)
- Sex distribution and any imbalances
- Key comorbidity prevalence
- Baseline risk factor distribution
Comment on generalizability and any notable imbalances requiring adjustment.`,

      'safety': `Interpret the safety analysis results:
- Overall adverse event profile
- Serious adverse event incidence with 95% CI
- Compare to expected rates from literature
- Identify any safety signals requiring attention
- Comment on the risk-benefit profile`,

      'efficacy': `Interpret the efficacy analysis results:
- Primary endpoint achievement with effect size
- Clinical significance vs statistical significance
- Comparison to historical controls or benchmarks
- Response rate interpretation if applicable
- Implications for clinical practice`,

      'survival': `Interpret the survival analysis results:
- Kaplan-Meier curve interpretation
- Median survival times by group
- Hazard ratio interpretation with 95% CI
- Log-rank test significance
- Clinical implications of survival differences`,

      'subgroups': `Interpret the subgroup analysis results:
- Identify subgroups with differential response
- Assess consistency of treatment effect
- Flag any interaction effects
- Discuss clinical relevance of findings
- Caution against over-interpretation of exploratory subgroups`,
    };

    return `You are Dr. Saga providing clinical interpretation of statistical results.

## CONTEXT
Study Design: ${context.protocol.studyDesign}
Population: ${context.protocol.pico.population}
N = ${context.data.completedRecords}

## RESULTS TO INTERPRET
${JSON.stringify(results, null, 2)}

## INTERPRETATION TASK
${prompts[domain]}

Provide a 2-3 paragraph clinical interpretation suitable for a results section, including:
1. Key findings with specific numbers
2. Clinical significance assessment
3. Limitations and caveats
4. Comparison to existing literature (if foundational papers available)`;
  }

  /**
   * Build prompt for recommending a test for specific variables
   */
  buildTestRecommendationPrompt(
    predictor: SchemaBlockSummary | null,
    outcome: SchemaBlockSummary,
    context: StatisticalAnalysisContext
  ): string {
    // Get recommended test from matrix
    const predType = predictor ? this.classifyVariableType(predictor) : 'none';
    const outcType = this.classifyVariableType(outcome);
    const recommendation = VARIABLE_ANALYSIS_MATRIX[predType]?.[outcType];

    return `You are Dr. Saga, a clinical biostatistician. Recommend the most appropriate statistical test for this variable pair.

## VARIABLE PAIR

### Outcome Variable
- Name: ${outcome.label}
- ID: ${outcome.id}
- Type: ${outcome.dataType} → classified as: ${outcType}
- Role: ${outcome.endpointTier || 'Not classified'} endpoint
${outcome.distribution ? this.formatDistribution(outcome.distribution) : '- No distribution data available'}

${predictor ? `### Predictor Variable
- Name: ${predictor.label}
- ID: ${predictor.id}
- Type: ${predictor.dataType} → classified as: ${predType}
${predictor.distribution ? this.formatDistribution(predictor.distribution) : '- No distribution data available'}
${predictor.options ? `- Categories: ${predictor.options.join(', ')}` : ''}` : '### No Predictor (Descriptive Analysis)'}

## CONTEXT
- Study Design: ${context.protocol.studyDesign}
- Total N: ${context.data.completedRecords}
${context.data.sampleSizeByGroup ? `- Group Sizes: ${Object.entries(context.data.sampleSizeByGroup).map(([g, n]) => `${g}=${n}`).join(', ')}` : ''}

## GUIDANCE FROM ANALYSIS MATRIX
${recommendation ? `
- Recommended Primary Test: ${recommendation.primary}
- Alternative if assumptions violated: ${recommendation.alternative}
- Key Assumption: ${recommendation.assumption}
` : '- No standard recommendation available; use clinical judgment'}

## TASK

Confirm or modify the recommended test. Consider:
1. Variable data types and distributions
2. Sample size adequacy (N < 30 suggests non-parametric)
3. Distribution characteristics (normality, outliers)
4. Study design implications

Respond with valid JSON only:
{
  "recommendation": {
    "analysisType": "${recommendation?.primary || 'descriptive'}",
    "method": {
      "name": "Full method name",
      "category": "parametric" | "non-parametric" | "survival" | "diagnostic",
      "assumptions": ["List key assumptions"]
    },
    "rationale": "Explanation of why this test is appropriate given the data",
    "alternativeTest": "Name of alternative if assumptions are violated",
    "alternativeRationale": "When to use the alternative",
    "sampleSizeAdequate": true | false,
    "assumptionsConcerns": ["Any specific concerns about assumptions"]
  },
  "confidence": 90
}`;
  }

  /**
   * Parse LLM response into structured suggestions
   */
  parseAnalysisPlanResponse(response: string): AnalysisSuggestion[] {
    try {
      const parsed = this.extractJSON(response);

      if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
        console.error('Invalid response structure: missing suggestions array');
        return [];
      }

      return parsed.suggestions.map((s: any, index: number) =>
        this.validateAndTransformSuggestion(s, index)
      );
    } catch (error) {
      console.error('Failed to parse analysis plan response:', error);
      return [];
    }
  }

  /**
   * Parse test recommendation response
   */
  parseTestRecommendationResponse(response: string): {
    analysisType: AnalysisType;
    method: StatisticalMethod;
    rationale: string;
    confidence: number;
    alternative?: { type: AnalysisType; rationale: string };
  } | null {
    try {
      const parsed = this.extractJSON(response);

      if (!parsed.recommendation) {
        return null;
      }

      const rec = parsed.recommendation;
      return {
        analysisType: rec.analysisType,
        method: {
          name: rec.method?.name || rec.analysisType,
          category: rec.method?.category || 'parametric',
          assumptions: rec.method?.assumptions || [],
          references: [],
        },
        rationale: rec.rationale || '',
        confidence: parsed.confidence || 80,
        alternative: rec.alternativeTest
          ? {
              type: rec.alternativeTest as AnalysisType,
              rationale: rec.alternativeRationale || '',
            }
          : undefined,
      };
    } catch (error) {
      console.error('Failed to parse test recommendation:', error);
      return null;
    }
  }

  // ==========================================================================
  // PRIVATE HELPERS
  // ==========================================================================

  /**
   * Normalize study design to match template keys
   */
  private normalizeStudyDesign(design: StudyType | string): string {
    const mapping: Record<string, string> = {
      'rct': 'rct',
      'randomized-controlled-trial': 'rct',
      'randomized': 'rct',
      'cohort': 'cohort',
      'prospective-cohort': 'cohort',
      'retrospective-cohort': 'cohort',
      'case-control': 'case-control',
      'cross-sectional': 'cross-sectional',
      'diagnostic': 'diagnostic',
      'diagnostic-accuracy': 'diagnostic',
      'single-arm': 'single-arm',
      'observational': 'cohort',
    };
    return mapping[design?.toLowerCase()] || 'cohort';
  }

  /**
   * Detect clinical domain from PICO and variables
   */
  private detectClinicalDomain(context: StatisticalAnalysisContext): string | null {
    const text = [
      context.protocol.pico.population,
      context.protocol.pico.intervention,
      context.protocol.pico.outcome,
      context.protocol.primaryObjective,
    ].join(' ').toLowerCase();

    if (text.includes('cardio') || text.includes('heart') || text.includes('aortic') ||
        text.includes('stroke') || text.includes('vascular') || text.includes('endovascular')) {
      return 'cardiovascular';
    }
    if (text.includes('cancer') || text.includes('tumor') || text.includes('oncolog') ||
        text.includes('chemotherapy') || text.includes('response rate')) {
      return 'oncology';
    }
    if (text.includes('diabet') || text.includes('hba1c') || text.includes('glucose') ||
        text.includes('insulin')) {
      return 'diabetes';
    }
    return null;
  }

  /**
   * Format domain-specific benchmarks
   */
  private formatDomainBenchmarks(domain: string): string {
    const benchmarks = CLINICAL_BENCHMARKS[domain];
    if (!benchmarks) return '';

    let section = `## DOMAIN-SPECIFIC BENCHMARKS (${domain.toUpperCase()})\n\n`;
    section += 'Use these benchmarks to contextualize results:\n\n';

    for (const [metric, data] of Object.entries(benchmarks)) {
      section += `- **${metric.replace(/_/g, ' ')}**: Acceptable range ${data.acceptable[0]}-${data.acceptable[1]}%, concerning if >${data.concerning}% (Source: ${data.source})\n`;
    }

    return section;
  }

  /**
   * Generate test selection guidance based on variable types
   */
  private generateTestSelectionGuidance(context: StatisticalAnalysisContext): string {
    const primaryEndpoint = context.schema.primaryEndpoints[0];
    const predictors = context.schema.predictors;

    if (!primaryEndpoint) {
      return 'No primary endpoint defined - recommend defining before analysis.';
    }

    const outcomeType = this.classifyVariableType(primaryEndpoint);
    let guidance = `### Primary Endpoint: ${primaryEndpoint.label} (${outcomeType})\n\n`;

    if (predictors.length > 0) {
      const predictor = predictors[0];
      const predType = this.classifyVariableType(predictor);
      const rec = VARIABLE_ANALYSIS_MATRIX[predType]?.[outcomeType];

      if (rec) {
        guidance += `**Predictor**: ${predictor.label} (${predType})\n`;
        guidance += `**Recommended Test**: ${rec.primary}\n`;
        guidance += `**Alternative**: ${rec.alternative} (if ${rec.assumption})\n`;
      }
    }

    // Add sample size guidance
    const n = context.data.completedRecords;
    if (n < 30) {
      guidance += `\n⚠️ **Sample Size Warning**: N=${n} is small. Consider:\n`;
      guidance += `- Non-parametric alternatives (Mann-Whitney, Wilcoxon)\n`;
      guidance += `- Exact tests (Fisher's exact instead of chi-square)\n`;
      guidance += `- Effect size confidence intervals will be wide\n`;
    }

    return guidance;
  }

  /**
   * Classify variable type for analysis matrix lookup
   */
  private classifyVariableType(variable: SchemaBlockSummary): string {
    const dataType = variable.dataType?.toLowerCase();
    const dist = variable.distribution;

    if (dataType === 'boolean' || dist?.type === 'binary') {
      return 'binary';
    }
    if (dataType === 'numeric' || dataType === 'continuous' || dist?.type === 'continuous') {
      return 'continuous';
    }
    if (dist?.type === 'time-to-event' ||
        variable.label?.toLowerCase().includes('survival') ||
        variable.label?.toLowerCase().includes('time to')) {
      return 'time-to-event';
    }
    return 'categorical';
  }

  /**
   * Format variables with detailed distribution info
   */
  private formatVariablesDetailed(variables: SchemaBlockSummary[]): string {
    if (variables.length === 0) return 'None defined';

    return variables
      .map(v => {
        const parts = [
          `- **${v.label}** (ID: \`${v.id}\`)`,
          `  Type: ${v.dataType}`,
        ];

        if (v.distribution) {
          if (v.distribution.type === 'continuous') {
            parts.push(`  📊 Mean=${v.distribution.mean?.toFixed(2) ?? 'N/A'}, SD=${v.distribution.sd?.toFixed(2) ?? 'N/A'}, Median=${v.distribution.median?.toFixed(2) ?? 'N/A'}`);
            parts.push(`  N=${v.distribution.n}, Missing=${v.distribution.missing}`);
            if (v.distribution.isNormal !== undefined) {
              parts.push(`  Normality: ${v.distribution.isNormal ? '✅ Approximately normal' : '⚠️ Non-normal (skew=' + (v.distribution.skewness?.toFixed(2) ?? 'N/A') + ')'}`);
            }
          } else if (v.distribution.type === 'categorical' || v.distribution.type === 'binary') {
            const cats = v.distribution.categories?.slice(0, 5).join(', ') || 'N/A';
            parts.push(`  Categories: ${cats}${(v.distribution.categories?.length || 0) > 5 ? '...' : ''}`);
            parts.push(`  N=${v.distribution.n}, Missing=${v.distribution.missing}`);
            if (v.distribution.frequencies) {
              const freqStr = Object.entries(v.distribution.frequencies)
                .slice(0, 4)
                .map(([k, n]) => `${k}:${n}`)
                .join(', ');
              parts.push(`  Distribution: ${freqStr}`);
            }
          }
        }

        if (!v.hasData) {
          parts.push(`  ⚠️ No data available for analysis`);
        }

        return parts.join('\n');
      })
      .join('\n\n');
  }

  /**
   * Format key distributions summary
   */
  private formatKeyDistributions(context: StatisticalAnalysisContext): string {
    const distributions = Object.entries(context.data.variableDistributions);
    if (distributions.length === 0) return 'No distribution data available';

    const continuousVars = distributions.filter(([, d]) => d.type === 'continuous').slice(0, 5);
    const categoricalVars = distributions.filter(([, d]) => d.type === 'categorical' || d.type === 'binary').slice(0, 5);

    let summary = '';

    if (continuousVars.length > 0) {
      summary += '**Continuous Variables:**\n';
      for (const [name, dist] of continuousVars) {
        summary += `- ${name}: Mean=${dist.mean?.toFixed(2)}, SD=${dist.sd?.toFixed(2)}, N=${dist.n}\n`;
      }
    }

    if (categoricalVars.length > 0) {
      summary += '\n**Categorical Variables:**\n';
      for (const [name, dist] of categoricalVars) {
        const cats = dist.categories?.slice(0, 3).join(', ') || 'N/A';
        summary += `- ${name}: ${cats}, N=${dist.n}\n`;
      }
    }

    return summary;
  }

  /**
   * Format variables for prompt (legacy - simpler version)
   */
  private formatVariables(variables: SchemaBlockSummary[]): string {
    if (variables.length === 0) return 'None defined';

    return variables
      .map(v => {
        const parts = [
          `- **${v.label}** (ID: ${v.id})`,
          `  Type: ${v.dataType}`,
        ];

        if (v.distribution) {
          if (v.distribution.type === 'continuous') {
            parts.push(`  Distribution: Mean=${v.distribution.mean?.toFixed(2)}, SD=${v.distribution.sd?.toFixed(2)}, N=${v.distribution.n}`);
            if (v.distribution.isNormal !== undefined) {
              parts.push(`  Normality: ${v.distribution.isNormal ? 'Approximately normal' : 'Non-normal (skewness=' + v.distribution.skewness?.toFixed(2) + ')'}`);
            }
          } else if (v.distribution.type === 'categorical' || v.distribution.type === 'binary') {
            const cats = v.distribution.categories?.slice(0, 5).join(', ') || 'N/A';
            parts.push(`  Categories: ${cats}${(v.distribution.categories?.length || 0) > 5 ? '...' : ''}`);
            parts.push(`  N=${v.distribution.n}`);
          }
        }

        if (v.hasData === false) {
          parts.push(`  ⚠️ No data available`);
        }

        return parts.join('\n');
      })
      .join('\n\n');
  }

  /**
   * Format distribution for prompt
   */
  private formatDistribution(dist: any): string {
    const lines = [`- Distribution Type: ${dist.type}`, `- N: ${dist.n}, Missing: ${dist.missing}`];

    if (dist.type === 'continuous') {
      lines.push(`- Mean: ${dist.mean?.toFixed(2)}, SD: ${dist.sd?.toFixed(2)}`);
      lines.push(`- Median: ${dist.median?.toFixed(2)}, IQR: [${dist.iqr?.[0]?.toFixed(2)}, ${dist.iqr?.[1]?.toFixed(2)}]`);
      if (dist.isNormal !== undefined) {
        lines.push(`- Normal: ${dist.isNormal ? 'Yes' : 'No'}`);
      }
    } else if (dist.categories) {
      lines.push(`- Categories: ${dist.categories.slice(0, 5).join(', ')}`);
    }

    return lines.join('\n');
  }

  /**
   * Format foundational papers section (legacy)
   */
  private formatFoundationalPapers(papers: any): string {
    if (!papers.papers || papers.papers.length === 0) {
      return '';
    }

    let section = `## FOUNDATIONAL LITERATURE\n\n`;

    for (const paper of papers.papers.slice(0, 3)) {
      section += `### ${paper.title} (${paper.year})\n`;
      section += `Authors: ${paper.authors}\n`;
      if (paper.statisticalMethods?.length > 0) {
        section += `Methods: ${paper.statisticalMethods.join(', ')}\n`;
      }
      if (paper.sampleSize) {
        section += `Sample Size: N=${paper.sampleSize}\n`;
      }
      section += '\n';
    }

    if (papers.commonStatisticalApproaches?.length) {
      section += `### Common Approaches in Literature\n`;
      section += papers.commonStatisticalApproaches.join(', ') + '\n';
    }

    return section;
  }

  /**
   * Format foundational papers with enhanced detail
   */
  private formatFoundationalPapersEnhanced(papers: any): string {
    if (!papers.papers || papers.papers.length === 0) {
      return '';
    }

    let section = `## FOUNDATIONAL LITERATURE (for method grounding)\n\n`;

    for (const paper of papers.papers.slice(0, 3)) {
      section += `### ${paper.title} (${paper.year})\n`;
      section += `Authors: ${paper.authors}\n`;
      if (paper.statisticalMethods?.length > 0) {
        section += `**Statistical Methods Used**: ${paper.statisticalMethods.join(', ')}\n`;
      }
      if (paper.sampleSize) {
        section += `Sample Size: N=${paper.sampleSize}\n`;
      }
      if (paper.effectSize && paper.effectSizeType) {
        section += `**Reported Effect**: ${paper.effectSizeType} = ${paper.effectSize}\n`;
      }
      section += '\n';
    }

    if (papers.commonStatisticalApproaches?.length) {
      section += `### Methods Commonly Used in Similar Studies\n`;
      section += papers.commonStatisticalApproaches.join(', ') + '\n\n';
    }

    if (papers.suggestedEffectSizes) {
      section += `### Expected Effect Sizes (for power consideration)\n`;
      for (const [outcome, size] of Object.entries(papers.suggestedEffectSizes)) {
        section += `- ${outcome}: ${size}\n`;
      }
    }

    return section;
  }

  /**
   * Extract JSON from potentially markdown-wrapped response
   */
  private extractJSON(text: string): any {
    // Try to find JSON in markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }

    // Try to find raw JSON object
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]);
    }

    throw new Error('No valid JSON found in response');
  }

  /**
   * Validate and transform a raw suggestion into typed AnalysisSuggestion
   */
  private validateAndTransformSuggestion(raw: any, index: number): AnalysisSuggestion {
    const id = `suggestion-${Date.now()}-${index}`;

    // Build the proposed analysis
    const proposedAnalysis: ProposedAnalysis = {
      analysisId: `analysis-${id}`,
      analysisType: raw.proposedAnalysis?.analysisType || 'descriptive',
      outcome: {
        id: raw.proposedAnalysis?.outcomeId || '',
        name: raw.proposedAnalysis?.outcomeId || '',
        label: raw.proposedAnalysis?.outcomeId || '',
        dataType: 'Continuous',
        role: 'Outcome',
        endpointTier: null,
        analysisMethod: null,
        hasData: true,
        completeness: 1,
      },
      predictor: raw.proposedAnalysis?.predictorId
        ? {
            id: raw.proposedAnalysis.predictorId,
            name: raw.proposedAnalysis.predictorId,
            label: raw.proposedAnalysis.predictorId,
            dataType: 'Categorical',
            role: 'Predictor',
            endpointTier: null,
            analysisMethod: null,
            hasData: true,
            completeness: 1,
          }
        : undefined,
      covariates: raw.proposedAnalysis?.covariateIds?.map((cid: string) => ({
        id: cid,
        name: cid,
        label: cid,
        dataType: 'Continuous',
        role: 'All' as const,
        endpointTier: null,
        analysisMethod: null,
        hasData: true,
        completeness: 1,
      })),
      stratificationFactors: raw.proposedAnalysis?.stratificationFactorIds?.map((sid: string) => ({
        id: sid,
        name: sid,
        label: sid,
        dataType: 'Categorical',
        role: 'All' as const,
        endpointTier: null,
        analysisMethod: null,
        hasData: true,
        completeness: 1,
      })),
      method: {
        name: raw.proposedAnalysis?.method?.name || raw.proposedAnalysis?.analysisType || 'Unknown',
        category: raw.proposedAnalysis?.method?.category || 'parametric',
        assumptions: raw.proposedAnalysis?.method?.assumptions || [],
        references: raw.proposedAnalysis?.method?.references || [],
      },
      parameters: {
        alpha: raw.proposedAnalysis?.parameters?.alpha || 0.05,
        tails: raw.proposedAnalysis?.parameters?.tails || 'two',
        confidenceLevel: raw.proposedAnalysis?.parameters?.confidenceLevel || 0.95,
        pairedData: raw.proposedAnalysis?.parameters?.pairedData,
        equalVariances: raw.proposedAnalysis?.parameters?.equalVariances,
        continuityCorrection: raw.proposedAnalysis?.parameters?.continuityCorrection,
        multiplicityMethod: raw.proposedAnalysis?.parameters?.multiplicityMethod,
      },
      expectedOutputs: {
        primaryStatistic: raw.expectedOutputs?.primaryStatistic || this.getExpectedStatistic(raw.proposedAnalysis?.analysisType),
        confidenceInterval: raw.expectedOutputs?.confidenceInterval ?? true,
        pValue: raw.expectedOutputs?.pValue ?? (raw.proposedAnalysis?.analysisType !== 'descriptive'),
        effectSize: raw.expectedOutputs?.effectSizeType,
        visualization: raw.expectedOutputs?.visualization,
      },
      executionReady: true,
      blockers: raw.feasibilityNotes ? [raw.feasibilityNotes] : undefined,
    };

    // Build grounding
    const grounding: SuggestionGrounding = {
      protocolReference: raw.grounding?.protocolReference,
      regulatoryReference: raw.grounding?.regulatoryReference,
      literatureReference: raw.grounding?.literatureReference,
      schemaReference: [
        raw.proposedAnalysis?.outcomeId,
        raw.proposedAnalysis?.predictorId,
        ...(raw.proposedAnalysis?.covariateIds || []),
      ].filter(Boolean),
    };

    // Default feasibility (will be checked later)
    const feasibilityCheck: FeasibilityResult = {
      feasible: true,
      sampleSizeAdequate: true,
      assumptionsMet: true,
      dataComplete: true,
      issues: [],
    };

    return {
      id,
      suggestionType: raw.suggestionType || 'exploratory-analysis',
      priority: raw.priority || 'optional',
      title: raw.title || 'Unnamed Analysis',
      description: raw.description || '',
      rationale: raw.rationale || '',
      grounding,
      proposedAnalysis,
      confidence: raw.confidence || 70,
      feasibilityCheck,
      autoExecute: raw.autoExecute || false,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Get expected primary statistic for analysis type
   */
  private getExpectedStatistic(analysisType?: string): string {
    const statisticMap: Record<string, string> = {
      descriptive: 'Summary statistics (mean, SD, median, IQR)',
      'normality-test': 'Shapiro-Wilk W statistic',
      't-test': 'Mean difference with 95% CI',
      'paired-t-test': 'Mean difference with 95% CI',
      anova: 'F-statistic with eta-squared',
      'repeated-anova': 'F-statistic with partial eta-squared',
      'chi-square': 'Chi-square statistic with Cramér\'s V',
      'fisher-exact': 'Odds ratio with 95% CI',
      mcnemar: 'McNemar chi-square',
      'pearson-correlation': 'Correlation coefficient (r) with 95% CI',
      'spearman-correlation': 'Correlation coefficient (rho) with 95% CI',
      'mann-whitney': 'U statistic with rank-biserial correlation',
      wilcoxon: 'W statistic with effect size',
      'kruskal-wallis': 'H statistic with epsilon-squared',
      'linear-regression': 'Beta coefficients with 95% CI, R-squared',
      'logistic-regression': 'Odds ratios with 95% CI',
      'cox-regression': 'Hazard ratios with 95% CI',
      'kaplan-meier': 'Survival curves with median survival',
      'log-rank': 'Log-rank chi-square',
      'diagnostic-accuracy': 'Sensitivity, specificity, PPV, NPV, AUC',
    };

    return statisticMap[analysisType || ''] || 'Test statistic';
  }
}

// Export singleton
export const statisticianPromptEngine = new StatisticianPromptEngine();
