// StatisticianPromptEngine
// Builds prompts for Gemini and parses responses

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
} from './types';

/**
 * Builds prompts for the Statistician AI and parses LLM responses
 */
export class StatisticianPromptEngine {
  /**
   * Build prompt for generating a complete analysis plan
   */
  buildAnalysisPlanPrompt(context: StatisticalAnalysisContext): string {
    return `You are Dr. Saga, a clinical biostatistician AI assistant. Analyze this research protocol and recommend appropriate statistical analyses.

## PROTOCOL CONTEXT

### Study Design
Type: ${context.protocol.studyDesign}
${context.protocol.studyPhase ? `Phase: ${context.protocol.studyPhase}` : ''}

### PICO Framework
- **Population**: ${context.protocol.pico.population || 'Not specified'}
- **Intervention**: ${context.protocol.pico.intervention || 'Not specified'}
- **Comparison**: ${context.protocol.pico.comparison || 'Not specified'}
- **Outcome**: ${context.protocol.pico.outcome || 'Not specified'}

### Objectives
- **Primary**: ${context.protocol.primaryObjective || 'Not specified'}
${context.protocol.secondaryObjectives?.length ? `- **Secondary**: ${context.protocol.secondaryObjectives.join('; ')}` : ''}

${context.protocol.statisticalPlan ? `### Existing Statistical Plan\n${context.protocol.statisticalPlan}` : ''}

## SCHEMA VARIABLES

### Primary Endpoints (${context.schema.primaryEndpoints.length})
${this.formatVariables(context.schema.primaryEndpoints)}

### Secondary Endpoints (${context.schema.secondaryEndpoints.length})
${this.formatVariables(context.schema.secondaryEndpoints)}

### Predictor Variables (${context.schema.predictors.length})
${this.formatVariables(context.schema.predictors)}

### Other Variables (${context.schema.blocks.filter(b => !b.endpointTier && b.role !== 'Predictor').length})
${this.formatVariables(context.schema.blocks.filter(b => !b.endpointTier && b.role !== 'Predictor').slice(0, 10))}

## DATA CHARACTERISTICS
- Total Records: ${context.data.totalRecords}
- Completed Records: ${context.data.completedRecords}
- Overall Missing Rate: ${context.data.missingDataSummary.overallMissingRate.toFixed(1)}%
- Missing Data Pattern: ${context.data.missingDataSummary.pattern}

${context.data.sampleSizeByGroup ? `### Sample Sizes by Group\n${Object.entries(context.data.sampleSizeByGroup).map(([g, n]) => `- ${g}: n=${n}`).join('\n')}` : ''}

${context.foundationalPapers ? this.formatFoundationalPapers(context.foundationalPapers) : ''}

## YOUR TASK

Generate a statistical analysis plan with prioritized suggestions. For each analysis:

1. **Identify the appropriate statistical test** based on variable types and study design
2. **Specify predictor and outcome variables** by their IDs
3. **Justify the choice** referencing:
   - Data types (continuous, categorical, time-to-event)
   - Study design (${context.protocol.studyDesign})
   - Sample size adequacy
   - Protocol objectives
4. **Note any assumptions** that should be checked
5. **Reference guidelines** (ICH E9, CONSORT, STROBE, etc.) where applicable

### Priority Classification:
- **critical**: Primary endpoint analysis - must be done
- **recommended**: Secondary endpoints and assumption checks
- **optional**: Exploratory and sensitivity analyses

### Auto-Execute Rules:
- Descriptive statistics → autoExecute: true
- Normality checks → autoExecute: true
- All inferential tests → autoExecute: false (require approval)

Respond with valid JSON only:
{
  "suggestions": [
    {
      "suggestionType": "descriptive" | "normality-check" | "primary-analysis" | "secondary-analysis" | "exploratory-analysis" | "assumption-check" | "sensitivity-analysis",
      "priority": "critical" | "recommended" | "optional",
      "title": "Human-readable title",
      "description": "What this analysis accomplishes",
      "rationale": "Why this test is appropriate for these data",
      "autoExecute": true | false,
      "grounding": {
        "protocolReference": "Links to protocol objective or PICO",
        "regulatoryReference": "ICH E9 Section X, CONSORT item Y, etc.",
        "literatureReference": "If relevant to foundational papers"
      },
      "proposedAnalysis": {
        "analysisType": "descriptive" | "t-test" | "chi-square" | "pearson-correlation" | "kaplan-meier" | "log-rank" | "cox-regression" | etc.,
        "predictorId": "variable ID or null",
        "outcomeId": "variable ID",
        "covariateIds": [],
        "method": {
          "name": "Full method name",
          "category": "descriptive" | "parametric" | "non-parametric" | "regression" | "survival",
          "assumptions": ["Assumption 1", "Assumption 2"]
        },
        "parameters": {
          "alpha": 0.05,
          "tails": "two"
        }
      },
      "confidence": 85
    }
  ],
  "globalRecommendations": {
    "multiplicityAdjustment": "Recommendation for multiple testing correction if applicable",
    "missingDataStrategy": "Recommendation for handling missing data",
    "sensitivityAnalyses": ["List of recommended sensitivity analyses"]
  }
}`;
  }

  /**
   * Build prompt for recommending a test for specific variables
   */
  buildTestRecommendationPrompt(
    predictor: SchemaBlockSummary | null,
    outcome: SchemaBlockSummary,
    context: StatisticalAnalysisContext
  ): string {
    return `You are Dr. Saga, a clinical biostatistician. Recommend the most appropriate statistical test for this variable pair.

## VARIABLE PAIR

### Outcome Variable
- Name: ${outcome.label}
- Type: ${outcome.dataType}
- Role: ${outcome.endpointTier || 'Not classified'} endpoint
${outcome.distribution ? this.formatDistribution(outcome.distribution) : ''}

${predictor ? `### Predictor Variable
- Name: ${predictor.label}
- Type: ${predictor.dataType}
${predictor.distribution ? this.formatDistribution(predictor.distribution) : ''}
${predictor.options ? `- Categories: ${predictor.options.join(', ')}` : ''}` : '### No Predictor (Descriptive Analysis)'}

## CONTEXT
- Study Design: ${context.protocol.studyDesign}
- Total N: ${context.data.completedRecords}
${context.data.sampleSizeByGroup ? `- Group Sizes: ${Object.entries(context.data.sampleSizeByGroup).map(([g, n]) => `${g}=${n}`).join(', ')}` : ''}

## TASK

Recommend the single most appropriate statistical test. Consider:
1. Variable data types
2. Sample size adequacy
3. Distribution characteristics
4. Study design

Respond with valid JSON only:
{
  "recommendation": {
    "analysisType": "t-test" | "paired-t-test" | "anova" | "chi-square" | "fisher-exact" | "pearson-correlation" | "spearman-correlation" | "mann-whitney" | "wilcoxon" | "kaplan-meier" | "log-rank",
    "method": {
      "name": "Full method name",
      "category": "parametric" | "non-parametric" | "survival",
      "assumptions": ["List key assumptions"]
    },
    "rationale": "Brief explanation of why this test is appropriate",
    "alternativeTest": "Name of alternative if assumptions are violated",
    "alternativeRationale": "When to use the alternative"
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
   * Format variables for prompt
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
   * Format foundational papers section
   */
  private formatFoundationalPapers(papers: any): string {
    if (!papers.papers || papers.papers.length === 0) {
      return '';
    }

    let section = `## FOUNDATIONAL LITERATURE\n\n`;

    for (const paper of papers.papers.slice(0, 3)) {
      section += `### ${paper.title} (${paper.year})\n`;
      section += `Authors: ${paper.authors}\n`;
      if (paper.statisticalMethods.length > 0) {
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
      method: {
        name: raw.proposedAnalysis?.method?.name || raw.proposedAnalysis?.analysisType || 'Unknown',
        category: raw.proposedAnalysis?.method?.category || 'parametric',
        assumptions: raw.proposedAnalysis?.method?.assumptions || [],
        references: [],
      },
      parameters: {
        alpha: raw.proposedAnalysis?.parameters?.alpha || 0.05,
        tails: raw.proposedAnalysis?.parameters?.tails || 'two',
        confidenceLevel: 0.95,
      },
      expectedOutputs: {
        primaryStatistic: this.getExpectedStatistic(raw.proposedAnalysis?.analysisType),
        confidenceInterval: true,
        pValue: raw.proposedAnalysis?.analysisType !== 'descriptive',
      },
      executionReady: true,
    };

    // Build grounding
    const grounding: SuggestionGrounding = {
      protocolReference: raw.grounding?.protocolReference,
      regulatoryReference: raw.grounding?.regulatoryReference,
      literatureReference: raw.grounding?.literatureReference,
      schemaReference: [
        raw.proposedAnalysis?.outcomeId,
        raw.proposedAnalysis?.predictorId,
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
      descriptive: 'Summary statistics',
      't-test': 'Mean difference',
      'paired-t-test': 'Mean difference',
      anova: 'F-statistic',
      'chi-square': 'Chi-square statistic',
      'fisher-exact': 'Odds ratio',
      'pearson-correlation': 'Correlation coefficient (r)',
      'spearman-correlation': 'Correlation coefficient (rho)',
      'mann-whitney': 'U statistic',
      wilcoxon: 'W statistic',
      'linear-regression': 'Beta coefficients',
      'logistic-regression': 'Odds ratios',
      'cox-regression': 'Hazard ratios',
      'kaplan-meier': 'Survival curves',
      'log-rank': 'Chi-square statistic',
    };

    return statisticMap[analysisType || ''] || 'Test statistic';
  }
}

// Export singleton
export const statisticianPromptEngine = new StatisticianPromptEngine();
