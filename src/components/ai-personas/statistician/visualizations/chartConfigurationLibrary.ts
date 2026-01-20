// Chart Configuration Library
// Maps statistical analyses to appropriate visualizations for vascular surgery

import type { AnalysisType, ChartType, SurvivalResults, RegressionResults } from '../types';
import type { EndpointBenchmark } from '../clinicalBenchmarkLibrary';
import type {
  EndpointBenchmarkZones,
  RateOutcomeData,
  SurvivalCurveData,
  ContinuousOutcomeData,
  RiskFactorForestData,
  GroupedComparisonData,
} from './VascularSurgeryCharts';

// =============================================================================
// ANALYSIS TYPE TO CHART TYPE MAPPING
// =============================================================================

/**
 * Maps analysis types to their recommended visualization
 */
export const ANALYSIS_TO_CHART_MAP: Record<AnalysisType, ChartType[]> = {
  'descriptive': ['histogram', 'boxplot', 'bar'],
  'normality-test': ['histogram'],
  't-test': ['boxplot', 'bar'],
  'paired-t-test': ['line', 'bar'],
  'anova': ['boxplot', 'bar'],
  'repeated-anova': ['line'],
  'chi-square': ['bar'],
  'fisher-exact': ['bar'],
  'mcnemar': ['bar'],
  'pearson-correlation': ['scatter'],
  'spearman-correlation': ['scatter'],
  'mann-whitney': ['boxplot'],
  'wilcoxon': ['boxplot', 'line'],
  'kruskal-wallis': ['boxplot'],
  'linear-regression': ['scatter', 'line'],
  'logistic-regression': ['forest-plot', 'bar'],
  'cox-regression': ['forest-plot', 'kaplan-meier'],
  'kaplan-meier': ['kaplan-meier'],
  'log-rank': ['kaplan-meier'],
  'diagnostic-accuracy': ['scatter', 'bar'],
};

// =============================================================================
// CARDIOVASCULAR ENDPOINT TO CHART CONFIG
// =============================================================================

export interface EndpointChartConfig {
  endpointName: string;
  primaryChartType: ChartType;
  secondaryChartType?: ChartType;
  benchmarkZones: EndpointBenchmarkZones;
  yAxisLabel: string;
  yAxisUnit: string;
  colorScheme: 'rate' | 'survival' | 'continuous' | 'forest';
  showConfidenceIntervals: boolean;
  showBenchmarkLines: boolean;
}

/**
 * Chart configurations for cardiovascular endpoints from SAFE Arch
 */
export const CARDIOVASCULAR_ENDPOINT_CHARTS: Record<string, EndpointChartConfig> = {
  // Mortality and morbidity rates
  stroke_rate: {
    endpointName: 'Stroke Rate',
    primaryChartType: 'bar',
    secondaryChartType: 'forest-plot',
    benchmarkZones: {
      excellent: 3,
      acceptable: { low: 0, high: 7 },
      concerning: 13,
      direction: 'lower-better',
    },
    yAxisLabel: 'Stroke Rate',
    yAxisUnit: '%',
    colorScheme: 'rate',
    showConfidenceIntervals: true,
    showBenchmarkLines: true,
  },

  mortality_30day: {
    endpointName: '30-Day Mortality',
    primaryChartType: 'bar',
    secondaryChartType: 'forest-plot',
    benchmarkZones: {
      excellent: 4,
      acceptable: { low: 0, high: 8 },
      concerning: 15,
      direction: 'lower-better',
    },
    yAxisLabel: '30-Day Mortality',
    yAxisUnit: '%',
    colorScheme: 'rate',
    showConfidenceIntervals: true,
    showBenchmarkLines: true,
  },

  spinal_cord_injury: {
    endpointName: 'Spinal Cord Injury',
    primaryChartType: 'bar',
    secondaryChartType: 'forest-plot',
    benchmarkZones: {
      excellent: 2,
      acceptable: { low: 0, high: 5 },
      concerning: 10,
      direction: 'lower-better',
    },
    yAxisLabel: 'SCI Rate',
    yAxisUnit: '%',
    colorScheme: 'rate',
    showConfidenceIntervals: true,
    showBenchmarkLines: true,
  },

  renal_failure: {
    endpointName: 'Acute Kidney Injury',
    primaryChartType: 'bar',
    secondaryChartType: 'forest-plot',
    benchmarkZones: {
      excellent: 5,
      acceptable: { low: 0, high: 10 },
      concerning: 20,
      direction: 'lower-better',
    },
    yAxisLabel: 'AKI Rate',
    yAxisUnit: '%',
    colorScheme: 'rate',
    showConfidenceIntervals: true,
    showBenchmarkLines: true,
  },

  // Survival endpoints
  survival_1year: {
    endpointName: '1-Year Survival',
    primaryChartType: 'kaplan-meier',
    secondaryChartType: 'bar',
    benchmarkZones: {
      acceptable: { low: 80, high: 100 },
      concerning: 70,
      direction: 'higher-better',
    },
    yAxisLabel: 'Survival Probability',
    yAxisUnit: '%',
    colorScheme: 'survival',
    showConfidenceIntervals: true,
    showBenchmarkLines: true,
  },

  survival_5year: {
    endpointName: '5-Year Survival',
    primaryChartType: 'kaplan-meier',
    secondaryChartType: 'bar',
    benchmarkZones: {
      acceptable: { low: 60, high: 100 },
      concerning: 50,
      direction: 'higher-better',
    },
    yAxisLabel: 'Survival Probability',
    yAxisUnit: '%',
    colorScheme: 'survival',
    showConfidenceIntervals: true,
    showBenchmarkLines: true,
  },

  reintervention_rate: {
    endpointName: 'Freedom from Reintervention',
    primaryChartType: 'kaplan-meier',
    secondaryChartType: 'bar',
    benchmarkZones: {
      acceptable: { low: 0, high: 15 },
      concerning: 25,
      direction: 'lower-better',
    },
    yAxisLabel: 'Freedom from Reintervention',
    yAxisUnit: '%',
    colorScheme: 'survival',
    showConfidenceIntervals: true,
    showBenchmarkLines: true,
  },

  // Continuous outcomes
  icu_length_of_stay: {
    endpointName: 'ICU Length of Stay',
    primaryChartType: 'boxplot',
    secondaryChartType: 'histogram',
    benchmarkZones: {
      acceptable: { low: 0, high: 5 },
      concerning: 10,
      direction: 'lower-better',
    },
    yAxisLabel: 'ICU LOS',
    yAxisUnit: 'days',
    colorScheme: 'continuous',
    showConfidenceIntervals: false,
    showBenchmarkLines: true,
  },

  hospital_length_of_stay: {
    endpointName: 'Hospital Length of Stay',
    primaryChartType: 'boxplot',
    secondaryChartType: 'histogram',
    benchmarkZones: {
      acceptable: { low: 0, high: 14 },
      concerning: 21,
      direction: 'lower-better',
    },
    yAxisLabel: 'Hospital LOS',
    yAxisUnit: 'days',
    colorScheme: 'continuous',
    showConfidenceIntervals: false,
    showBenchmarkLines: true,
  },

  circulatory_arrest_time: {
    endpointName: 'Circulatory Arrest Time',
    primaryChartType: 'boxplot',
    secondaryChartType: 'scatter',
    benchmarkZones: {
      acceptable: { low: 0, high: 40 },
      concerning: 60,
      direction: 'lower-better',
    },
    yAxisLabel: 'Arrest Time',
    yAxisUnit: 'minutes',
    colorScheme: 'continuous',
    showConfidenceIntervals: false,
    showBenchmarkLines: true,
  },
};

// =============================================================================
// DATA TRANSFORMATION HELPERS
// =============================================================================

/**
 * Convert endpoint benchmark to chart-compatible format
 */
export function convertBenchmarkToChartZones(
  benchmark: EndpointBenchmark
): EndpointBenchmarkZones {
  return {
    excellent: benchmark.excellent,
    acceptable: benchmark.acceptable,
    concerning: benchmark.concerning,
    direction: benchmark.direction,
  };
}

/**
 * Generate mock rate outcome data for testing/demo
 */
export function generateMockRateData(
  endpoint: EndpointChartConfig,
  groups: string[],
  baseRate: number
): RateOutcomeData[] {
  return groups.map((group, idx) => {
    const rate = baseRate + (Math.random() - 0.5) * 5;
    const n = 100 + Math.floor(Math.random() * 100);
    const se = Math.sqrt((rate * (100 - rate)) / n);
    return {
      category: group,
      rate,
      n,
      ci95Lower: Math.max(0, rate - 1.96 * se),
      ci95Upper: Math.min(100, rate + 1.96 * se),
      benchmark: endpoint.benchmarkZones,
    };
  });
}

/**
 * Generate mock Kaplan-Meier data for testing/demo
 */
export function generateMockSurvivalData(
  endpoint: EndpointChartConfig,
  groups: string[],
  maxTime: number,
  timeUnit: 'days' | 'months' | 'years' = 'months'
): SurvivalCurveData[] {
  const data: SurvivalCurveData[] = [];
  const timePoints = Array.from({ length: 20 }, (_, i) => (i * maxTime) / 19);

  groups.forEach(group => {
    let atRisk = 100;
    let events = 0;

    timePoints.forEach(time => {
      const hazard = 0.01 + Math.random() * 0.02;
      const survival = Math.exp(-hazard * time);
      const newEvents = Math.floor((1 - survival) * 100) - events;
      events += newEvents;
      atRisk = 100 - events;

      const se = survival * Math.sqrt((1 - survival) / atRisk);

      data.push({
        time,
        survival,
        atRisk: Math.max(0, atRisk),
        events: newEvents,
        group,
        ci95Lower: Math.max(0, survival - 1.96 * se),
        ci95Upper: Math.min(1, survival + 1.96 * se),
      });
    });
  });

  return data;
}

/**
 * Generate mock continuous outcome data for testing/demo
 */
export function generateMockContinuousData(
  endpoint: EndpointChartConfig,
  groups: string[]
): ContinuousOutcomeData[] {
  return groups.map(group => {
    const median = endpoint.benchmarkZones.acceptable.low +
      Math.random() * (endpoint.benchmarkZones.acceptable.high - endpoint.benchmarkZones.acceptable.low);
    const iqr: [number, number] = [median * 0.7, median * 1.3];
    const mean = median * (1 + (Math.random() - 0.5) * 0.2);
    const sd = (iqr[1] - iqr[0]) / 1.35; // Approximate SD from IQR

    return {
      group,
      mean,
      median,
      sd,
      iqr,
      n: 100 + Math.floor(Math.random() * 100),
      min: median * 0.3,
      max: median * 2,
      benchmark: endpoint.benchmarkZones,
    };
  });
}

/**
 * Convert regression results to forest plot data
 */
export function convertRegressionToForestData(
  regressionResults: RegressionResults,
  effectType: 'OR' | 'HR'
): RiskFactorForestData[] {
  return regressionResults.coefficients
    .filter(coef => coef.variable !== '(Intercept)')
    .map(coef => {
      // Convert log(OR) or log(HR) to OR/HR
      const effect = Math.exp(coef.estimate);
      const ciLower = Math.exp(coef.confidenceInterval[0]);
      const ciUpper = Math.exp(coef.confidenceInterval[1]);

      return {
        variable: coef.variable,
        ...(effectType === 'OR' ? { or: effect } : { hr: effect }),
        ci95Lower: ciLower,
        ci95Upper: ciUpper,
        pValue: coef.pValue,
        n: 0, // Would need to extract from model if available
      };
    });
}

/**
 * Convert survival results to Kaplan-Meier chart data
 */
export function convertSurvivalToKMData(
  survivalResults: SurvivalResults
): SurvivalCurveData[] {
  if (!survivalResults.survivalCurves) return [];

  const data: SurvivalCurveData[] = [];

  survivalResults.survivalCurves.forEach(curve => {
    curve.times.forEach((time, idx) => {
      data.push({
        time,
        survival: curve.survival[idx],
        atRisk: 0, // Would need to calculate from censoring info
        group: curve.group,
      });
    });
  });

  return data;
}

// =============================================================================
// CHART RECOMMENDATION ENGINE
// =============================================================================

export interface ChartRecommendation {
  chartType: ChartType;
  componentName: 'MortalityRateChart' | 'KaplanMeierChart' | 'ContinuousOutcomeBoxplot' | 'ForestPlot' | 'GroupedComparisonChart';
  rationale: string;
  dataRequirements: string[];
  config?: Partial<EndpointChartConfig>;
}

/**
 * Recommend appropriate chart based on analysis type and endpoint
 */
export function recommendChart(
  analysisType: AnalysisType,
  endpointName?: string,
  outcomeDataType?: 'rate' | 'continuous' | 'time-to-event'
): ChartRecommendation {
  // Check if we have a specific config for this endpoint
  if (endpointName && CARDIOVASCULAR_ENDPOINT_CHARTS[endpointName]) {
    const config = CARDIOVASCULAR_ENDPOINT_CHARTS[endpointName];
    let componentName: ChartRecommendation['componentName'];

    switch (config.primaryChartType) {
      case 'kaplan-meier':
        componentName = 'KaplanMeierChart';
        break;
      case 'boxplot':
        componentName = 'ContinuousOutcomeBoxplot';
        break;
      case 'forest-plot':
        componentName = 'ForestPlot';
        break;
      default:
        componentName = 'MortalityRateChart';
    }

    return {
      chartType: config.primaryChartType,
      componentName,
      rationale: `Standard visualization for ${config.endpointName} in cardiovascular surgery`,
      dataRequirements: config.showConfidenceIntervals
        ? ['point estimate', '95% confidence intervals', 'sample size']
        : ['point estimate', 'sample size'],
      config,
    };
  }

  // Fall back to analysis-type based recommendation
  const chartTypes = ANALYSIS_TO_CHART_MAP[analysisType];
  const primaryChart = chartTypes[0];

  let componentName: ChartRecommendation['componentName'];
  let rationale: string;
  let dataRequirements: string[];

  switch (primaryChart) {
    case 'kaplan-meier':
      componentName = 'KaplanMeierChart';
      rationale = 'Survival analysis requires Kaplan-Meier curves with at-risk tables';
      dataRequirements = ['time points', 'survival probabilities', 'at-risk counts', 'censoring indicators'];
      break;

    case 'boxplot':
      componentName = 'ContinuousOutcomeBoxplot';
      rationale = 'Continuous outcomes best visualized with boxplots showing median, IQR, and outliers';
      dataRequirements = ['median', 'IQR', 'min/max', 'sample size'];
      break;

    case 'forest-plot':
      componentName = 'ForestPlot';
      rationale = 'Regression results displayed as forest plot with effect sizes and confidence intervals';
      dataRequirements = ['effect estimates (OR/HR)', '95% CI', 'p-values', 'sample sizes'];
      break;

    case 'bar':
      if (outcomeDataType === 'rate') {
        componentName = 'MortalityRateChart';
        rationale = 'Rate outcomes shown as bar chart with benchmark comparison';
        dataRequirements = ['rates', '95% CI', 'sample sizes', 'benchmark values'];
      } else {
        componentName = 'GroupedComparisonChart';
        rationale = 'Categorical comparisons shown as grouped bar chart';
        dataRequirements = ['group values', '95% CI', 'p-values'];
      }
      break;

    default:
      componentName = 'MortalityRateChart';
      rationale = 'Default visualization for outcome data';
      dataRequirements = ['outcome values', 'sample sizes'];
  }

  return {
    chartType: primaryChart,
    componentName,
    rationale,
    dataRequirements,
  };
}

/**
 * Get all available chart types for a given analysis
 */
export function getChartOptionsForAnalysis(analysisType: AnalysisType): ChartType[] {
  return ANALYSIS_TO_CHART_MAP[analysisType] || ['bar'];
}

/**
 * Check if chart configuration exists for an endpoint
 */
export function hasEndpointChartConfig(endpointName: string): boolean {
  return endpointName in CARDIOVASCULAR_ENDPOINT_CHARTS;
}

/**
 * Get chart configuration for an endpoint
 */
export function getEndpointChartConfig(endpointName: string): EndpointChartConfig | null {
  return CARDIOVASCULAR_ENDPOINT_CHARTS[endpointName] || null;
}
