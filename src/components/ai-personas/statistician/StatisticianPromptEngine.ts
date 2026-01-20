// StatisticianPromptEngine
// Builds domain-specific prompts for Gemini and parses responses
// Enhanced with study-type-specific guidance and multi-domain interpretation
// Now integrated with Clinical Benchmark Library for domain-specific expertise

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

// Import Clinical Benchmark Library
import {
  CLINICAL_BENCHMARK_LIBRARY,
  detectClinicalDomain,
  detectSubspecialty,
  matchVariableToEndpoint,
  matchVariableToRiskFactor,
  getFormattedBenchmarksForPrompt,
  getAllDomainEndpoints,
  getAllDomainRiskFactors,
  type ClinicalDomain,
  type DomainSubspecialty,
  type EndpointBenchmark,
  type RiskFactor,
} from './clinicalBenchmarkLibrary';

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

// Note: Clinical domain benchmarks are now sourced from clinicalBenchmarkLibrary.ts
// This provides comprehensive, extensible domain-specific knowledge

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

    // Use Clinical Benchmark Library for domain detection
    const detectedDomain = detectClinicalDomain(
      context.protocol.pico,
      context.schema.blocks.map(b => ({ name: b.name, label: b.label })),
      context.protocol.primaryObjective
    );
    const detectedSubspecialty = detectedDomain
      ? detectSubspecialty(detectedDomain, context.protocol.pico, context.schema.blocks.map(b => ({ name: b.name, label: b.label })))
      : null;

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

${detectedDomain ? this.formatDomainBenchmarksFromLibrary(detectedDomain, detectedSubspecialty, context) : ''}

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

**IMPORTANT**: Respond with valid, complete JSON only. Limit to 8-12 key suggestions maximum.

{
  "suggestions": [
    {
      "suggestionType": "descriptive|normality-check|primary-analysis|secondary-analysis|exploratory-analysis|sensitivity-analysis",
      "priority": "critical|recommended|optional",
      "title": "Short title",
      "description": "Brief description",
      "rationale": "Why this test is appropriate",
      "autoExecute": true,
      "grounding": {"protocolReference": "PICO link", "regulatoryReference": "ICH E9/CONSORT"},
      "proposedAnalysis": {
        "analysisType": "descriptive|t-test|chi-square|anova|mann-whitney|pearson-correlation|logistic-regression|cox-regression|kaplan-meier",
        "predictorId": "variable_id or null",
        "outcomeId": "variable_id",
        "method": {"name": "Method name", "category": "parametric|non-parametric|survival", "assumptions": ["key assumptions"]},
        "parameters": {"alpha": 0.05, "tails": "two", "confidenceLevel": 0.95}
      },
      "expectedOutputs": {"primaryStatistic": "e.g. Mean difference", "pValue": true, "visualization": "boxplot"},
      "confidence": 85
    }
  ],
  "globalRecommendations": {
    "multiplicityAdjustment": "Method recommendation",
    "missingDataStrategy": "Strategy recommendation"
  }
}

## CRITICAL REQUIREMENTS

1. **LIMIT TO 8-12 SUGGESTIONS** - Focus on the most important analyses
2. **Use actual variable IDs** from the schema provided above
3. **Keep JSON compact** - Short descriptions, no redundant fields
4. **Match test to data type** - Verify predictor/outcome types
5. **Ensure complete JSON** - No truncation, close all brackets`;
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
   * Includes robust error handling for malformed LLM responses
   */
  parseAnalysisPlanResponse(response: string): AnalysisSuggestion[] {
    try {
      const parsed = this.extractJSON(response);

      if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
        console.error('Invalid response structure: missing suggestions array');
        // Try to create a basic suggestion from any available data
        if (parsed.title || parsed.analysisType) {
          console.log('Attempting to wrap single suggestion object');
          return [this.validateAndTransformSuggestion(parsed, 0)];
        }
        return [];
      }

      const suggestions = parsed.suggestions
        .map((s: any, index: number) => {
          try {
            return this.validateAndTransformSuggestion(s, index);
          } catch (err) {
            console.warn(`Failed to transform suggestion ${index}:`, err);
            return null;
          }
        })
        .filter((s: AnalysisSuggestion | null): s is AnalysisSuggestion => s !== null);

      console.log(`Successfully parsed ${suggestions.length} analysis suggestions`);
      return suggestions;
    } catch (error) {
      console.error('Failed to parse analysis plan response:', error);

      // Return a helpful error suggestion so the user knows what happened
      return [{
        id: `error-${Date.now()}`,
        suggestionType: 'descriptive',
        priority: 'recommended',
        title: 'Analysis Plan Generation Issue',
        description: 'The AI response could not be fully parsed. Please try regenerating the analysis plan.',
        rationale: `Technical details: ${error instanceof Error ? error.message : 'Unknown parsing error'}. This can happen when the AI generates an incomplete or malformed response.`,
        grounding: {},
        proposedAnalysis: {
          analysisId: `analysis-error-${Date.now()}`,
          analysisType: 'descriptive',
          outcome: {
            id: 'unknown',
            name: 'unknown',
            label: 'Unable to parse',
            dataType: 'Continuous',
            role: 'Outcome',
            endpointTier: null,
            analysisMethod: null,
            hasData: false,
            completeness: 0,
          },
          method: {
            name: 'Error Recovery',
            category: 'descriptive',
            assumptions: [],
            references: [],
          },
          parameters: {
            alpha: 0.05,
            tails: 'two',
            confidenceLevel: 0.95,
          },
          expectedOutputs: {
            primaryStatistic: 'N/A',
            confidenceInterval: false,
            pValue: false,
          },
          executionReady: false,
          blockers: ['Response parsing failed - please regenerate'],
        },
        confidence: 0,
        feasibilityCheck: {
          feasible: false,
          sampleSizeAdequate: false,
          assumptionsMet: false,
          dataComplete: false,
          issues: ['Failed to parse AI response'],
        },
        autoExecute: false,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }];
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
   * Format domain-specific benchmarks from the Clinical Benchmark Library
   * This provides comprehensive, publication-ready benchmarks and guidance
   */
  private formatDomainBenchmarksFromLibrary(
    domain: ClinicalDomain,
    subspecialty: DomainSubspecialty | null,
    context: StatisticalAnalysisContext
  ): string {
    const sections: string[] = [];

    sections.push(`## CLINICAL DOMAIN EXPERTISE: ${domain.domain.toUpperCase()}`);
    sections.push(`Description: ${domain.description}`);
    sections.push(`Regulatory Bodies: ${domain.regulatoryBodies.join(', ')}`);
    sections.push('');

    if (subspecialty) {
      sections.push(`### Subspecialty: ${subspecialty.name.replace(/_/g, ' ').toUpperCase()}`);
      sections.push(`${subspecialty.description}`);
      sections.push('');

      // Endpoint benchmarks with clinical significance
      sections.push('### ENDPOINT BENCHMARKS (use these to contextualize your results)');
      for (const ep of subspecialty.endpoints) {
        const direction = ep.direction === 'lower-better' ? '↓ lower is better' : '↑ higher is better';
        sections.push(`**${ep.name.replace(/_/g, ' ')}** (${ep.type})`);
        sections.push(`  - Acceptable: ${ep.acceptable.low}-${ep.acceptable.high}${ep.unit || ''}`);
        sections.push(`  - Concerning: ${ep.direction === 'lower-better' ? '>' : '<'}${ep.concerning}${ep.unit || ''}`);
        if (ep.excellent !== undefined) {
          sections.push(`  - Excellent: ${ep.direction === 'lower-better' ? '<' : '>'}${ep.excellent}${ep.unit || ''}`);
        }
        sections.push(`  - Recommended Analysis: ${ep.analysisMethod}`);
        sections.push(`  - Source: ${ep.source}`);
        if (ep.clinicalSignificance) {
          sections.push(`  - Clinical Significance: ${ep.clinicalSignificance}`);
        }
        sections.push('');
      }

      // Known risk factors with expected effect sizes
      sections.push('### KNOWN RISK FACTORS (from literature - use for validation)');
      for (const rf of subspecialty.riskFactors) {
        const effect = rf.expectedOR
          ? `Expected OR: ${rf.expectedOR}`
          : rf.expectedHR
            ? `Expected HR: ${rf.expectedHR}`
            : '';
        sections.push(`**${rf.name.replace(/_/g, ' ')}**: ${rf.direction} factor (${rf.strength} evidence)`);
        if (effect) sections.push(`  - ${effect}`);
        sections.push(`  - Source: ${rf.source}`);
        sections.push(`  - Modifiable: ${rf.modifiable ? 'Yes' : 'No'}`);
      }
      sections.push('');

      // Required analyses per domain standards
      sections.push('### DOMAIN-REQUIRED ANALYSES');
      subspecialty.requiredAnalyses.forEach(a => sections.push(`- ${a}`));
      sections.push('');

      sections.push('### RECOMMENDED ADDITIONAL ANALYSES');
      subspecialty.recommendedAnalyses.forEach(a => sections.push(`- ${a}`));
      sections.push('');

      // Regulatory guidance
      sections.push('### REGULATORY GUIDANCE');
      subspecialty.regulatoryGuidance.forEach(g => sections.push(`- ${g}`));
      sections.push('');

      // Key references
      if (subspecialty.keyReferences.length > 0) {
        sections.push('### KEY LITERATURE REFERENCES');
        subspecialty.keyReferences.forEach(r => sections.push(`- ${r}`));
        sections.push('');
      }
    }

    // Match schema variables to known endpoints/risk factors
    const matchedEndpoints = this.matchSchemaToLibrary(context, domain, subspecialty);
    if (matchedEndpoints.length > 0) {
      sections.push('### VARIABLE-ENDPOINT MATCHING (auto-detected from schema)');
      for (const match of matchedEndpoints) {
        sections.push(`- Schema variable "${match.variable}" → Known endpoint "${match.endpoint.name}"`);
        sections.push(`  Recommended analysis: ${match.endpoint.analysisMethod}`);
        sections.push(`  Benchmark: ${match.endpoint.acceptable.low}-${match.endpoint.acceptable.high}${match.endpoint.unit || ''}`);
      }
      sections.push('');
    }

    return sections.join('\n');
  }

  /**
   * Match schema variables to known clinical endpoints/risk factors
   */
  private matchSchemaToLibrary(
    context: StatisticalAnalysisContext,
    domain: ClinicalDomain,
    subspecialty: DomainSubspecialty | null
  ): Array<{ variable: string; endpoint: EndpointBenchmark }> {
    const matches: Array<{ variable: string; endpoint: EndpointBenchmark }> = [];

    for (const block of context.schema.blocks) {
      const endpoint = matchVariableToEndpoint(block.name, block.label, domain, subspecialty ?? undefined);
      if (endpoint) {
        matches.push({ variable: block.label, endpoint });
      }
    }

    return matches;
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
   * Handles common LLM JSON malformations
   */
  private extractJSON(text: string): any {
    // Try to find JSON in markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    let jsonText = jsonMatch ? jsonMatch[1] : null;

    // If no code block, try to find raw JSON object
    if (!jsonText) {
      const objectMatch = text.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        jsonText = objectMatch[0];
      }
    }

    if (!jsonText) {
      throw new Error('No valid JSON found in response');
    }

    // Try parsing as-is first
    try {
      return JSON.parse(jsonText);
    } catch (e) {
      // JSON is malformed, attempt repairs
      console.warn('Initial JSON parse failed, attempting repair:', e);
    }

    // Attempt common repairs
    let repairedJson = jsonText;

    // 1. Remove trailing commas before ] or }
    repairedJson = repairedJson.replace(/,(\s*[}\]])/g, '$1');

    // 2. Fix unescaped quotes in strings (common LLM issue)
    // This is tricky - we need to be careful not to break valid JSON
    // Look for patterns like ": "some text "inner" more text"
    repairedJson = repairedJson.replace(
      /:\s*"([^"]*?)(?<!\\)"([^",}\]]*?)"/g,
      (match, before, after) => {
        // If there's text after the middle quote, escape it
        if (after && after.trim()) {
          return `: "${before}\\"${after}"`;
        }
        return match;
      }
    );

    // 3. Fix missing commas between array elements or object properties
    // Pattern: }" or ]" or number" or true/false/null followed by " or { or [
    repairedJson = repairedJson.replace(/([}\]"\d]|true|false|null)(\s*)(["{\[])/g, (match, before, space, after) => {
      // Check if there's already a comma or colon
      if (space.includes(',') || space.includes(':')) {
        return match;
      }
      return `${before},${space}${after}`;
    });

    // 4. Try to fix truncated JSON by closing open brackets/braces
    const openBraces = (repairedJson.match(/\{/g) || []).length;
    const closeBraces = (repairedJson.match(/\}/g) || []).length;
    const openBrackets = (repairedJson.match(/\[/g) || []).length;
    const closeBrackets = (repairedJson.match(/\]/g) || []).length;

    // Remove any trailing incomplete elements (strings, commas, etc.)
    repairedJson = repairedJson.replace(/,\s*$/, '');
    repairedJson = repairedJson.replace(/:\s*$/, ': null');
    repairedJson = repairedJson.replace(/"[^"]*$/, '""');

    // Add missing closing brackets/braces
    for (let i = 0; i < openBrackets - closeBrackets; i++) {
      repairedJson += ']';
    }
    for (let i = 0; i < openBraces - closeBraces; i++) {
      repairedJson += '}';
    }

    try {
      return JSON.parse(repairedJson);
    } catch (e2) {
      console.warn('JSON repair attempt 1 failed, trying aggressive repair');
    }

    // 5. More aggressive repair: try to extract just the suggestions array
    try {
      const suggestionsMatch = repairedJson.match(/"suggestions"\s*:\s*\[([\s\S]*?)\](?=\s*[,}]|\s*$)/);
      if (suggestionsMatch) {
        let suggestionsContent = suggestionsMatch[1];
        // Try to find complete suggestion objects
        const suggestionObjects: any[] = [];
        let depth = 0;
        let currentObj = '';
        let inString = false;
        let escape = false;

        for (const char of suggestionsContent) {
          if (escape) {
            currentObj += char;
            escape = false;
            continue;
          }
          if (char === '\\') {
            escape = true;
            currentObj += char;
            continue;
          }
          if (char === '"' && !escape) {
            inString = !inString;
          }
          if (!inString) {
            if (char === '{') depth++;
            if (char === '}') depth--;
          }
          currentObj += char;

          if (depth === 0 && currentObj.trim().startsWith('{')) {
            try {
              const obj = JSON.parse(currentObj.trim());
              suggestionObjects.push(obj);
              currentObj = '';
            } catch {
              // Keep accumulating
            }
          }
        }

        if (suggestionObjects.length > 0) {
          console.log(`Recovered ${suggestionObjects.length} suggestions from malformed JSON`);
          return { suggestions: suggestionObjects };
        }
      }
    } catch (e3) {
      console.warn('Suggestions extraction failed:', e3);
    }

    // 6. Last resort: try to parse each suggestion individually
    try {
      const individualSuggestions: any[] = [];
      // Match individual suggestion objects
      const suggestionRegex = /\{[^{}]*"suggestionType"[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g;
      let match;
      while ((match = suggestionRegex.exec(jsonText)) !== null) {
        try {
          const suggestion = JSON.parse(match[0]);
          individualSuggestions.push(suggestion);
        } catch {
          // Skip malformed individual suggestions
        }
      }
      if (individualSuggestions.length > 0) {
        console.log(`Last-resort recovery: found ${individualSuggestions.length} suggestions`);
        return { suggestions: individualSuggestions };
      }
    } catch (e4) {
      console.warn('Individual suggestion extraction failed:', e4);
    }

    throw new Error(`Failed to parse JSON after repair attempts. Original error at position indicated truncation or malformation.`);
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
