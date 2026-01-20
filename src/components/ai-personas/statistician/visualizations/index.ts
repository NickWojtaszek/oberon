// Vascular Surgery Statistical Visualization Library
// Export all chart components and utilities

export {
  MortalityRateChart,
  KaplanMeierChart,
  ContinuousOutcomeBoxplot,
  ForestPlot,
  GroupedComparisonChart,
} from './VascularSurgeryCharts';

export type {
  EndpointBenchmarkZones,
  RateOutcomeData,
  SurvivalCurveData,
  ContinuousOutcomeData,
  RiskFactorForestData,
  GroupedComparisonData,
  MortalityRateChartProps,
  KaplanMeierChartProps,
  ContinuousOutcomeBoxplotProps,
  ForestPlotProps,
  GroupedComparisonChartProps,
} from './VascularSurgeryCharts';

export {
  ANALYSIS_TO_CHART_MAP,
  CARDIOVASCULAR_ENDPOINT_CHARTS,
  convertBenchmarkToChartZones,
  generateMockRateData,
  generateMockSurvivalData,
  generateMockContinuousData,
  convertRegressionToForestData,
  convertSurvivalToKMData,
  recommendChart,
  getChartOptionsForAnalysis,
  hasEndpointChartConfig,
  getEndpointChartConfig,
} from './chartConfigurationLibrary';

export type {
  EndpointChartConfig,
  ChartRecommendation,
} from './chartConfigurationLibrary';

export {
  AnalysisVisualization,
  VascularSurgeryChartShowcase,
} from './AnalysisVisualizationDemo';

export type {
  AnalysisVisualizationProps,
} from './AnalysisVisualizationDemo';
