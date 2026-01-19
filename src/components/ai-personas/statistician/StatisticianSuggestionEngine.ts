// StatisticianSuggestionEngine
// Combines rule-based logic with AI suggestions for statistical test selection

import type {
  StatisticalAnalysisContext,
  AnalysisSuggestion,
  SchemaBlockSummary,
  ProposedAnalysis,
  SuggestionType,
  AnalysisType,
  StatisticalMethod,
  FeasibilityResult,
  FeasibilityIssue,
  AnalysisParameters,
} from './types';

/**
 * Engine for generating and prioritizing statistical analysis suggestions
 */
export class StatisticianSuggestionEngine {
  /**
   * Generate rule-based suggestions without AI
   * Used as fallback or for immediate suggestions
   */
  generateRuleBasedSuggestions(context: StatisticalAnalysisContext): AnalysisSuggestion[] {
    const suggestions: AnalysisSuggestion[] = [];

    // 1. Descriptive statistics for all endpoints (auto-execute)
    suggestions.push(...this.generateDescriptiveSuggestions(context));

    // 2. Primary endpoint analyses (critical)
    suggestions.push(...this.generatePrimaryEndpointAnalyses(context));

    // 3. Secondary endpoint analyses (recommended)
    suggestions.push(...this.generateSecondaryEndpointAnalyses(context));

    // 4. Assumption checks (recommended, auto-execute)
    suggestions.push(...this.generateAssumptionChecks(context));

    return this.prioritizeSuggestions(suggestions, context);
  }

  /**
   * Select appropriate test using rule-based logic
   */
  selectTestByRules(
    predictor: SchemaBlockSummary | null,
    outcome: SchemaBlockSummary
  ): { analysisType: AnalysisType; method: StatisticalMethod; rationale: string } {
    // No predictor → Descriptive statistics
    if (!predictor) {
      return {
        analysisType: 'descriptive',
        method: {
          name: 'Descriptive Statistics',
          category: 'descriptive',
          assumptions: [],
          references: ['ICH E9 Section 5.1'],
        },
        rationale: 'No predictor specified; calculating summary statistics for the outcome.',
      };
    }

    const outcomeType = this.classifyVariableType(outcome);
    const predictorType = this.classifyVariableType(predictor);

    // Time-to-event outcome
    if (outcomeType === 'time-to-event') {
      if (predictorType === 'categorical') {
        return {
          analysisType: 'log-rank',
          method: {
            name: 'Log-Rank Test',
            category: 'survival',
            assumptions: ['Independent censoring', 'Non-informative censoring'],
            references: ['ICH E9 Section 5.4', 'CONSORT survival extension'],
          },
          rationale: 'Time-to-event outcome with categorical predictor; log-rank test compares survival curves between groups.',
        };
      }
      return {
        analysisType: 'cox-regression',
        method: {
          name: 'Cox Proportional Hazards Regression',
          category: 'survival',
          assumptions: ['Proportional hazards', 'Independent censoring'],
          references: ['ICH E9 Section 5.4'],
        },
        rationale: 'Time-to-event outcome with continuous predictor; Cox regression estimates hazard ratios.',
      };
    }

    // Continuous outcome
    if (outcomeType === 'continuous') {
      if (predictorType === 'binary') {
        const isNormal = outcome.distribution?.isNormal !== false;
        return isNormal
          ? {
              analysisType: 't-test',
              method: {
                name: 'Independent Samples T-Test',
                category: 'parametric',
                assumptions: ['Normality', 'Equal variances', 'Independence'],
                references: ['ICH E9 Section 5.2.3'],
              },
              rationale: 'Continuous outcome with binary predictor and approximately normal distribution; t-test compares means between two groups.',
            }
          : {
              analysisType: 'mann-whitney',
              method: {
                name: 'Mann-Whitney U Test',
                category: 'non-parametric',
                assumptions: ['Independence', 'Similar distribution shapes'],
                references: ['ICH E9 Section 5.2.3'],
              },
              rationale: 'Continuous outcome with binary predictor but non-normal distribution; Mann-Whitney U is a non-parametric alternative.',
            };
      }

      if (predictorType === 'categorical') {
        const isNormal = outcome.distribution?.isNormal !== false;
        return isNormal
          ? {
              analysisType: 'anova',
              method: {
                name: 'One-Way ANOVA',
                category: 'parametric',
                assumptions: ['Normality', 'Homogeneity of variances', 'Independence'],
                references: ['ICH E9 Section 5.2.3'],
              },
              rationale: 'Continuous outcome with multi-level categorical predictor; ANOVA compares means across groups.',
            }
          : {
              analysisType: 'kruskal-wallis',
              method: {
                name: 'Kruskal-Wallis Test',
                category: 'non-parametric',
                assumptions: ['Independence', 'Similar distribution shapes'],
                references: [],
              },
              rationale: 'Continuous outcome with categorical predictor but non-normal distribution; Kruskal-Wallis is a non-parametric alternative to ANOVA.',
            };
      }

      if (predictorType === 'continuous') {
        const isNormal = outcome.distribution?.isNormal !== false;
        return isNormal
          ? {
              analysisType: 'pearson-correlation',
              method: {
                name: 'Pearson Correlation',
                category: 'parametric',
                assumptions: ['Linearity', 'Bivariate normality', 'No outliers'],
                references: [],
              },
              rationale: 'Both variables continuous with approximately normal distributions; Pearson r measures linear relationship.',
            }
          : {
              analysisType: 'spearman-correlation',
              method: {
                name: 'Spearman Rank Correlation',
                category: 'non-parametric',
                assumptions: ['Monotonic relationship'],
                references: [],
              },
              rationale: 'Continuous variables but non-normal distribution; Spearman rho is robust to non-normality.',
            };
      }
    }

    // Categorical/Binary outcome
    if (outcomeType === 'categorical' || outcomeType === 'binary') {
      if (predictorType === 'categorical' || predictorType === 'binary') {
        // Check expected cell counts for Fisher's exact vs Chi-square
        const expectedSmall = this.hasSmallExpectedCounts(predictor, outcome);
        return expectedSmall
          ? {
              analysisType: 'fisher-exact',
              method: {
                name: "Fisher's Exact Test",
                category: 'non-parametric',
                assumptions: ['Independence', 'Fixed marginals'],
                references: ['ICH E9 Section 5.2.3'],
              },
              rationale: 'Categorical outcome with categorical predictor and small expected cell counts; Fisher\'s exact test is appropriate for small samples.',
            }
          : {
              analysisType: 'chi-square',
              method: {
                name: 'Chi-Square Test of Independence',
                category: 'non-parametric',
                assumptions: ['Independence', 'Expected counts >= 5'],
                references: ['ICH E9 Section 5.2.3'],
              },
              rationale: 'Categorical outcome with categorical predictor; Chi-square test assesses association.',
            };
      }

      if (predictorType === 'continuous') {
        return {
          analysisType: 'logistic-regression',
          method: {
            name: 'Logistic Regression',
            category: 'regression',
            assumptions: ['Independence', 'No multicollinearity', 'Linearity of logit'],
            references: ['ICH E9 Section 5.2.3'],
          },
          rationale: 'Binary/categorical outcome with continuous predictor; logistic regression estimates odds ratios.',
        };
      }
    }

    // Default fallback
    return {
      analysisType: 'descriptive',
      method: {
        name: 'Descriptive Statistics',
        category: 'descriptive',
        assumptions: [],
        references: [],
      },
      rationale: 'Unable to determine specific test; defaulting to descriptive statistics.',
    };
  }

  /**
   * Merge rule-based and AI suggestions, removing duplicates
   */
  mergeSuggestions(
    ruleBased: AnalysisSuggestion[],
    aiGenerated: AnalysisSuggestion[]
  ): AnalysisSuggestion[] {
    const merged: AnalysisSuggestion[] = [...ruleBased];
    const existingKeys = new Set(
      ruleBased.map(s => `${s.proposedAnalysis.analysisType}-${s.proposedAnalysis.outcome.id}-${s.proposedAnalysis.predictor?.id || 'none'}`)
    );

    for (const aiSuggestion of aiGenerated) {
      const key = `${aiSuggestion.proposedAnalysis.analysisType}-${aiSuggestion.proposedAnalysis.outcome.id}-${aiSuggestion.proposedAnalysis.predictor?.id || 'none'}`;

      if (!existingKeys.has(key)) {
        merged.push(aiSuggestion);
        existingKeys.add(key);
      } else {
        // AI suggestion exists but rule-based already has it
        // Prefer AI's rationale and grounding if richer
        const existingIdx = merged.findIndex(
          s => `${s.proposedAnalysis.analysisType}-${s.proposedAnalysis.outcome.id}-${s.proposedAnalysis.predictor?.id || 'none'}` === key
        );
        if (existingIdx >= 0 && aiSuggestion.grounding.literatureReference) {
          merged[existingIdx].grounding.literatureReference = aiSuggestion.grounding.literatureReference;
        }
      }
    }

    return merged;
  }

  /**
   * Prioritize suggestions based on protocol alignment and importance
   */
  prioritizeSuggestions(
    suggestions: AnalysisSuggestion[],
    context: StatisticalAnalysisContext
  ): AnalysisSuggestion[] {
    // Sort by priority tier, then by confidence
    const priorityOrder = { critical: 0, recommended: 1, optional: 2 };

    return suggestions.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Within same priority, prefer higher confidence
      return b.confidence - a.confidence;
    });
  }

  /**
   * Check feasibility of a proposed analysis
   */
  checkFeasibility(
    analysis: ProposedAnalysis,
    context: StatisticalAnalysisContext
  ): FeasibilityResult {
    const issues: FeasibilityIssue[] = [];
    let feasible = true;

    // 1. Check sample size
    const n = context.data.completedRecords;
    const minN = this.getMinimumSampleSize(analysis.analysisType);

    if (n < minN) {
      issues.push({
        type: 'sample-size',
        severity: n < minN / 2 ? 'blocking' : 'warning',
        message: `Sample size (n=${n}) may be insufficient for ${analysis.method.name}. Recommended minimum: ${minN}.`,
        resolution: 'Consider collecting more data or using a non-parametric alternative.',
      });
      if (n < minN / 2) feasible = false;
    }

    // 2. Check for missing data
    const outcomeDistribution = context.data.variableDistributions[analysis.outcome.id];
    if (outcomeDistribution && outcomeDistribution.missing > 0) {
      const missingPct = (outcomeDistribution.missing / outcomeDistribution.n) * 100;
      if (missingPct > 20) {
        issues.push({
          type: 'missing-data',
          severity: missingPct > 40 ? 'blocking' : 'warning',
          message: `${missingPct.toFixed(1)}% of outcome data is missing.`,
          resolution: 'Consider multiple imputation or sensitivity analysis.',
        });
        if (missingPct > 40) feasible = false;
      }
    }

    // 3. Check assumptions for parametric tests
    if (analysis.method.category === 'parametric') {
      const isNormal = outcomeDistribution?.isNormal;
      if (isNormal === false) {
        issues.push({
          type: 'assumption-violation',
          severity: 'warning',
          message: 'Outcome distribution may not be normal.',
          resolution: 'Consider non-parametric alternative or check with formal normality test.',
        });
      }
    }

    // 4. Check group sizes for comparative tests
    if (analysis.predictor && context.data.sampleSizeByGroup) {
      const groupSizes = Object.values(context.data.sampleSizeByGroup);
      const minGroupSize = Math.min(...groupSizes);
      const maxGroupSize = Math.max(...groupSizes);

      if (minGroupSize < 5) {
        issues.push({
          type: 'insufficient-groups',
          severity: 'blocking',
          message: `Smallest group has only ${minGroupSize} observations.`,
          resolution: 'Consider pooling groups or collecting more data.',
        });
        feasible = false;
      }

      if (maxGroupSize / minGroupSize > 4) {
        issues.push({
          type: 'assumption-violation',
          severity: 'warning',
          message: 'Highly unbalanced group sizes may affect test validity.',
          resolution: 'Consider Welch\'s t-test or non-parametric alternatives.',
        });
      }
    }

    return {
      feasible,
      sampleSizeAdequate: !issues.some(i => i.type === 'sample-size' && i.severity === 'blocking'),
      assumptionsMet: !issues.some(i => i.type === 'assumption-violation' && i.severity === 'blocking'),
      dataComplete: !issues.some(i => i.type === 'missing-data' && i.severity === 'blocking'),
      issues,
      minimumSampleSize: minN,
    };
  }

  // ==========================================================================
  // PRIVATE HELPERS
  // ==========================================================================

  /**
   * Generate descriptive statistics suggestions
   */
  private generateDescriptiveSuggestions(context: StatisticalAnalysisContext): AnalysisSuggestion[] {
    const suggestions: AnalysisSuggestion[] = [];

    // Descriptive stats for primary endpoints
    for (const endpoint of context.schema.primaryEndpoints) {
      suggestions.push(this.createDescriptiveSuggestion(endpoint, 'critical'));
    }

    // Descriptive stats for secondary endpoints
    for (const endpoint of context.schema.secondaryEndpoints) {
      suggestions.push(this.createDescriptiveSuggestion(endpoint, 'recommended'));
    }

    return suggestions;
  }

  /**
   * Generate primary endpoint analysis suggestions
   */
  private generatePrimaryEndpointAnalyses(context: StatisticalAnalysisContext): AnalysisSuggestion[] {
    const suggestions: AnalysisSuggestion[] = [];
    const mainPredictor = context.schema.predictors[0]; // Usually treatment group

    for (const endpoint of context.schema.primaryEndpoints) {
      if (mainPredictor) {
        const { analysisType, method, rationale } = this.selectTestByRules(mainPredictor, endpoint);
        suggestions.push(
          this.createInferentialSuggestion(
            mainPredictor,
            endpoint,
            analysisType,
            method,
            rationale,
            'critical',
            'primary-analysis'
          )
        );
      }
    }

    return suggestions;
  }

  /**
   * Generate secondary endpoint analysis suggestions
   */
  private generateSecondaryEndpointAnalyses(context: StatisticalAnalysisContext): AnalysisSuggestion[] {
    const suggestions: AnalysisSuggestion[] = [];
    const mainPredictor = context.schema.predictors[0];

    for (const endpoint of context.schema.secondaryEndpoints) {
      if (mainPredictor) {
        const { analysisType, method, rationale } = this.selectTestByRules(mainPredictor, endpoint);
        suggestions.push(
          this.createInferentialSuggestion(
            mainPredictor,
            endpoint,
            analysisType,
            method,
            rationale,
            'recommended',
            'secondary-analysis'
          )
        );
      }
    }

    return suggestions;
  }

  /**
   * Generate assumption check suggestions
   */
  private generateAssumptionChecks(context: StatisticalAnalysisContext): AnalysisSuggestion[] {
    const suggestions: AnalysisSuggestion[] = [];

    // Normality checks for continuous endpoints
    const continuousEndpoints = [
      ...context.schema.primaryEndpoints,
      ...context.schema.secondaryEndpoints,
    ].filter(e => e.dataType === 'Continuous');

    for (const endpoint of continuousEndpoints.slice(0, 3)) {
      suggestions.push({
        id: `normality-check-${endpoint.id}-${Date.now()}`,
        suggestionType: 'normality-check',
        priority: 'recommended',
        title: `Normality Check: ${endpoint.label}`,
        description: `Assess normality of ${endpoint.label} distribution using Shapiro-Wilk test and visual inspection.`,
        rationale: 'Parametric tests assume normality; checking this assumption informs test selection.',
        grounding: {
          protocolReference: 'Statistical assumptions verification',
          regulatoryReference: 'ICH E9 Section 5.2',
          schemaReference: [endpoint.id],
        },
        proposedAnalysis: {
          analysisId: `analysis-normality-${endpoint.id}`,
          analysisType: 'normality-test',
          outcome: endpoint,
          method: {
            name: 'Shapiro-Wilk Normality Test',
            category: 'descriptive',
            assumptions: [],
            references: [],
          },
          parameters: { alpha: 0.05 },
          expectedOutputs: {
            primaryStatistic: 'W statistic',
            confidenceInterval: false,
            pValue: true,
            visualization: 'histogram',
          },
          executionReady: true,
        },
        confidence: 95,
        feasibilityCheck: { feasible: true, sampleSizeAdequate: true, assumptionsMet: true, dataComplete: true, issues: [] },
        autoExecute: true,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    }

    return suggestions;
  }

  /**
   * Create a descriptive statistics suggestion
   */
  private createDescriptiveSuggestion(
    variable: SchemaBlockSummary,
    priority: 'critical' | 'recommended' | 'optional'
  ): AnalysisSuggestion {
    return {
      id: `descriptive-${variable.id}-${Date.now()}`,
      suggestionType: 'descriptive',
      priority,
      title: `Descriptive Statistics: ${variable.label}`,
      description: `Calculate summary statistics for ${variable.label} (${variable.dataType}).`,
      rationale: 'Descriptive statistics provide an overview of the data distribution and are essential for understanding the study population.',
      grounding: {
        protocolReference: variable.endpointTier === 'primary' ? 'Primary endpoint characterization' : 'Endpoint characterization',
        regulatoryReference: 'ICH E9 Section 5.1',
        schemaReference: [variable.id],
      },
      proposedAnalysis: {
        analysisId: `analysis-desc-${variable.id}`,
        analysisType: 'descriptive',
        outcome: variable,
        method: {
          name: 'Descriptive Statistics',
          category: 'descriptive',
          assumptions: [],
          references: ['ICH E9 Section 5.1'],
        },
        parameters: {},
        expectedOutputs: {
          primaryStatistic: 'Summary statistics',
          confidenceInterval: false,
          pValue: false,
          visualization: variable.dataType === 'Continuous' ? 'histogram' : 'bar',
        },
        executionReady: true,
      },
      confidence: 100,
      feasibilityCheck: { feasible: true, sampleSizeAdequate: true, assumptionsMet: true, dataComplete: true, issues: [] },
      autoExecute: true,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Create an inferential test suggestion
   */
  private createInferentialSuggestion(
    predictor: SchemaBlockSummary,
    outcome: SchemaBlockSummary,
    analysisType: AnalysisType,
    method: StatisticalMethod,
    rationale: string,
    priority: 'critical' | 'recommended' | 'optional',
    suggestionType: SuggestionType
  ): AnalysisSuggestion {
    return {
      id: `${suggestionType}-${outcome.id}-${Date.now()}`,
      suggestionType,
      priority,
      title: `${method.name}: ${outcome.label}`,
      description: `Compare ${outcome.label} across ${predictor.label} groups using ${method.name}.`,
      rationale,
      grounding: {
        protocolReference: outcome.endpointTier === 'primary'
          ? 'Primary endpoint analysis'
          : 'Secondary endpoint analysis',
        regulatoryReference: method.references[0] || 'ICH E9',
        schemaReference: [outcome.id, predictor.id],
      },
      proposedAnalysis: {
        analysisId: `analysis-${analysisType}-${outcome.id}`,
        analysisType,
        predictor,
        outcome,
        method,
        parameters: { alpha: 0.05, tails: 'two', confidenceLevel: 0.95 },
        expectedOutputs: {
          primaryStatistic: this.getExpectedStatistic(analysisType),
          confidenceInterval: true,
          pValue: true,
          effectSize: this.getEffectSizeType(analysisType),
          visualization: this.getVisualizationType(analysisType),
        },
        executionReady: true,
      },
      confidence: 85,
      feasibilityCheck: { feasible: true, sampleSizeAdequate: true, assumptionsMet: true, dataComplete: true, issues: [] },
      autoExecute: false, // Inferential tests require approval
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Classify variable type for test selection
   */
  private classifyVariableType(variable: SchemaBlockSummary): 'continuous' | 'categorical' | 'binary' | 'time-to-event' {
    if (variable.analysisMethod === 'survival') return 'time-to-event';
    if (variable.dataType === 'Boolean') return 'binary';
    if (variable.dataType === 'Continuous') return 'continuous';
    if (variable.dataType === 'Categorical' || variable.dataType === 'Text' || variable.dataType === 'Multi-Select') {
      // Check if binary (2 categories)
      if (variable.options && variable.options.length === 2) return 'binary';
      if (variable.distribution?.categories && variable.distribution.categories.length === 2) return 'binary';
      return 'categorical';
    }
    return 'continuous'; // Default
  }

  /**
   * Check if expected cell counts would be small (for Fisher's vs Chi-square)
   */
  private hasSmallExpectedCounts(predictor: SchemaBlockSummary, outcome: SchemaBlockSummary): boolean {
    const predictorN = predictor.distribution?.n || 0;
    const predictorCategories = predictor.distribution?.categories?.length || predictor.options?.length || 2;
    const outcomeCategories = outcome.distribution?.categories?.length || outcome.options?.length || 2;

    // Rough heuristic: if total N < 5 * (rows * cols), might have small expected counts
    const cells = predictorCategories * outcomeCategories;
    return predictorN < cells * 5;
  }

  /**
   * Get minimum sample size for analysis type
   */
  private getMinimumSampleSize(analysisType: AnalysisType): number {
    const minSizes: Record<AnalysisType, number> = {
      descriptive: 1,
      'normality-test': 3,
      't-test': 20,
      'paired-t-test': 15,
      anova: 30,
      'repeated-anova': 20,
      'chi-square': 20,
      'fisher-exact': 10,
      mcnemar: 20,
      'pearson-correlation': 20,
      'spearman-correlation': 15,
      'mann-whitney': 15,
      wilcoxon: 15,
      'kruskal-wallis': 20,
      'linear-regression': 30,
      'logistic-regression': 50,
      'cox-regression': 50,
      'kaplan-meier': 20,
      'log-rank': 20,
      'diagnostic-accuracy': 50,
    };
    return minSizes[analysisType] || 20;
  }

  /**
   * Get expected statistic name for analysis type
   */
  private getExpectedStatistic(analysisType: AnalysisType): string {
    const stats: Record<AnalysisType, string> = {
      descriptive: 'Summary statistics',
      'normality-test': 'W statistic',
      't-test': 'Mean difference',
      'paired-t-test': 'Mean difference',
      anova: 'F-statistic',
      'repeated-anova': 'F-statistic',
      'chi-square': 'Chi-square',
      'fisher-exact': 'Odds ratio',
      mcnemar: 'Chi-square',
      'pearson-correlation': 'r',
      'spearman-correlation': 'rho',
      'mann-whitney': 'U statistic',
      wilcoxon: 'W statistic',
      'kruskal-wallis': 'H statistic',
      'linear-regression': 'Beta coefficients',
      'logistic-regression': 'Odds ratios',
      'cox-regression': 'Hazard ratios',
      'kaplan-meier': 'Median survival',
      'log-rank': 'Chi-square',
      'diagnostic-accuracy': 'Sensitivity/Specificity',
    };
    return stats[analysisType] || 'Test statistic';
  }

  /**
   * Get effect size type for analysis type
   */
  private getEffectSizeType(analysisType: AnalysisType): string | undefined {
    const effects: Partial<Record<AnalysisType, string>> = {
      't-test': "Cohen's d",
      'paired-t-test': "Cohen's d",
      anova: 'Eta-squared',
      'chi-square': 'Cramér\'s V',
      'fisher-exact': 'Odds ratio',
      'pearson-correlation': 'r²',
      'spearman-correlation': 'r²',
      'logistic-regression': 'Odds ratio',
      'cox-regression': 'Hazard ratio',
    };
    return effects[analysisType];
  }

  /**
   * Get visualization type for analysis type
   */
  private getVisualizationType(analysisType: AnalysisType): 'bar' | 'boxplot' | 'scatter' | 'kaplan-meier' | 'forest-plot' | 'heatmap' {
    const viz: Partial<Record<AnalysisType, 'bar' | 'boxplot' | 'scatter' | 'kaplan-meier' | 'forest-plot' | 'heatmap'>> = {
      't-test': 'boxplot',
      'paired-t-test': 'boxplot',
      anova: 'boxplot',
      'chi-square': 'bar',
      'fisher-exact': 'bar',
      'pearson-correlation': 'scatter',
      'spearman-correlation': 'scatter',
      'mann-whitney': 'boxplot',
      'kaplan-meier': 'kaplan-meier',
      'log-rank': 'kaplan-meier',
      'cox-regression': 'forest-plot',
      'logistic-regression': 'forest-plot',
    };
    return viz[analysisType] || 'bar';
  }
}

// Export singleton
export const statisticianSuggestionEngine = new StatisticianSuggestionEngine();
