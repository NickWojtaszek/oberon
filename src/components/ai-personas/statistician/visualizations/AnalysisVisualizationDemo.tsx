// Analysis Visualization Demo
// Example integration showing how Dr. Saga results render as charts

import React from 'react';
import {
  MortalityRateChart,
  KaplanMeierChart,
  ContinuousOutcomeBoxplot,
  ForestPlot,
  GroupedComparisonChart,
} from './VascularSurgeryCharts';
import {
  CARDIOVASCULAR_ENDPOINT_CHARTS,
  generateMockRateData,
  generateMockSurvivalData,
  generateMockContinuousData,
  recommendChart,
} from './chartConfigurationLibrary';
import type { AnalysisSuggestion, AnalysisExecutionResult } from '../types';

// =============================================================================
// VISUALIZATION RENDERER - Converts analysis results to charts
// =============================================================================

export interface AnalysisVisualizationProps {
  suggestion: AnalysisSuggestion;
  executionResult?: AnalysisExecutionResult;
}

/**
 * Main component that renders appropriate visualization based on analysis type
 */
export const AnalysisVisualization: React.FC<AnalysisVisualizationProps> = ({
  suggestion,
  executionResult,
}) => {
  const { proposedAnalysis } = suggestion;
  const outcomeVariable = proposedAnalysis.outcome;

  // Get chart recommendation
  const recommendation = recommendChart(
    proposedAnalysis.analysisType,
    outcomeVariable.name,
    outcomeVariable.dataType === 'Numeric' ? 'continuous' : 'rate'
  );

  // If no execution result yet, show placeholder
  if (!executionResult || !executionResult.success) {
    return (
      <div className="w-full p-8 bg-gray-50 border rounded">
        <p className="text-gray-600 text-center">
          {executionResult?.error
            ? `Analysis failed: ${executionResult.error}`
            : 'Run analysis to see visualization'}
        </p>
        <p className="text-sm text-gray-500 text-center mt-2">
          Expected chart: {recommendation.chartType}
        </p>
      </div>
    );
  }

  // Render based on result type
  const { results } = executionResult;

  switch (results.type) {
    case 'kaplan-meier':
    case 'log-rank':
    case 'cox':
      return <SurvivalVisualization suggestion={suggestion} results={results} />;

    case 'linear':
    case 'logistic':
      return <RegressionVisualization suggestion={suggestion} results={results} />;

    case 't-test':
    case 'chi-square':
    case 'fisher-exact':
      return <ComparisonVisualization suggestion={suggestion} results={results} />;

    case 'descriptive':
      return <DescriptiveVisualization suggestion={suggestion} results={results} />;

    default:
      return (
        <div className="w-full p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm">Visualization not yet implemented for {results.type}</p>
        </div>
      );
  }
};

// =============================================================================
// SPECIALIZED VISUALIZATION COMPONENTS
// =============================================================================

/**
 * Survival analysis visualization (Kaplan-Meier curves)
 */
const SurvivalVisualization: React.FC<{
  suggestion: AnalysisSuggestion;
  results: any;
}> = ({ suggestion, results }) => {
  const endpointName = suggestion.proposedAnalysis.outcome.name;
  const config = CARDIOVASCULAR_ENDPOINT_CHARTS[endpointName];

  // Extract survival curves from results
  const survivalData = results.survivalCurves || [];
  const groups = [...new Set(survivalData.map((d: any) => d.group))];

  // For demo, generate mock data if no real data
  const mockData = survivalData.length > 0
    ? survivalData
    : generateMockSurvivalData(
        config || CARDIOVASCULAR_ENDPOINT_CHARTS.survival_1year,
        ['Overall'],
        60,
        'months'
      );

  return (
    <div className="space-y-4">
      <KaplanMeierChart
        data={mockData}
        title={suggestion.title}
        endpoint={endpointName as any}
        benchmarks={config?.benchmarkZones}
        groups={groups.length > 0 ? groups : ['Overall']}
        timeUnit="months"
      />

      {/* Statistics summary */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded">
        <div>
          <p className="text-sm text-gray-600">Median Survival</p>
          {Object.entries(results.medianSurvival || {}).map(([group, value]) => (
            <p key={group} className="font-semibold">
              {group}: {value ? `${value} months` : 'Not reached'}
            </p>
          ))}
        </div>
        {results.hazardRatio && (
          <div>
            <p className="text-sm text-gray-600">Hazard Ratio</p>
            <p className="font-semibold">
              {results.hazardRatio.toFixed(2)}
              {results.hazardRatioCI && (
                <span className="text-sm text-gray-600 ml-1">
                  (95% CI: {results.hazardRatioCI[0].toFixed(2)}-{results.hazardRatioCI[1].toFixed(2)})
                </span>
              )}
            </p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-600">P-value</p>
          <p className="font-semibold">
            {results.pValue < 0.001 ? '<0.001' : results.pValue.toFixed(3)}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Regression results visualization (forest plot)
 */
const RegressionVisualization: React.FC<{
  suggestion: AnalysisSuggestion;
  results: any;
}> = ({ suggestion, results }) => {
  const effectType = results.type === 'logistic' ? 'OR' : 'HR';

  const forestData = results.coefficients
    .filter((c: any) => c.variable !== '(Intercept)')
    .map((coef: any) => {
      const effect = Math.exp(coef.estimate);
      return {
        variable: coef.variable,
        or: effectType === 'OR' ? effect : undefined,
        hr: effectType === 'HR' ? effect : undefined,
        ci95Lower: Math.exp(coef.confidenceInterval[0]),
        ci95Upper: Math.exp(coef.confidenceInterval[1]),
        pValue: coef.pValue,
        n: 0,
      };
    });

  return (
    <div className="space-y-4">
      <ForestPlot
        data={forestData}
        title={suggestion.title}
        effectType={effectType}
      />

      {/* Model fit statistics */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded">
        {results.modelFit.r2 !== undefined && (
          <div>
            <p className="text-sm text-gray-600">R²</p>
            <p className="font-semibold">{results.modelFit.r2.toFixed(3)}</p>
          </div>
        )}
        {results.modelFit.aic !== undefined && (
          <div>
            <p className="text-sm text-gray-600">AIC</p>
            <p className="font-semibold">{results.modelFit.aic.toFixed(1)}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-600">Overall p-value</p>
          <p className="font-semibold">
            {results.overall.pValue < 0.001 ? '<0.001' : results.overall.pValue.toFixed(3)}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Group comparison visualization (t-test, chi-square)
 */
const ComparisonVisualization: React.FC<{
  suggestion: AnalysisSuggestion;
  results: any;
}> = ({ suggestion, results }) => {
  const endpointName = suggestion.proposedAnalysis.outcome.name;
  const config = CARDIOVASCULAR_ENDPOINT_CHARTS[endpointName];

  if (results.type === 't-test') {
    // Continuous outcome comparison
    const data = [
      {
        group: 'Group 1',
        mean: results.group1.mean,
        sd: results.group1.sd,
        n: results.group1.n,
        median: results.group1.mean, // Approximation
        iqr: [results.group1.mean - results.group1.sd, results.group1.mean + results.group1.sd] as [number, number],
        benchmark: config?.benchmarkZones,
      },
      {
        group: 'Group 2',
        mean: results.group2.mean,
        sd: results.group2.sd,
        n: results.group2.n,
        median: results.group2.mean,
        iqr: [results.group2.mean - results.group2.sd, results.group2.mean + results.group2.sd] as [number, number],
        benchmark: config?.benchmarkZones,
      },
    ];

    return (
      <div className="space-y-4">
        <ContinuousOutcomeBoxplot
          data={data}
          title={suggestion.title}
          endpoint={endpointName as any}
          benchmarks={config?.benchmarkZones}
          yAxisLabel={config?.yAxisLabel || 'Value'}
        />

        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded">
          <div>
            <p className="text-sm text-gray-600">Mean Difference</p>
            <p className="font-semibold">
              {results.meanDifference.toFixed(2)}
              {results.confidenceInterval && (
                <span className="text-sm text-gray-600 ml-1">
                  (95% CI: {results.confidenceInterval[0].toFixed(2)}-{results.confidenceInterval[1].toFixed(2)})
                </span>
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Effect Size (Cohen&apos;s d)</p>
            <p className="font-semibold">{results.effectSize?.toFixed(2) || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">P-value</p>
            <p className="font-semibold">
              {results.pValue < 0.001 ? '<0.001' : results.pValue.toFixed(3)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (results.type === 'chi-square' || results.type === 'fisher-exact') {
    // Categorical outcome comparison - create grouped bar chart
    const data = [
      {
        outcome: endpointName,
        group1Value: (results.contingencyTable[0][0] / (results.contingencyTable[0][0] + results.contingencyTable[0][1])) * 100,
        group2Value: (results.contingencyTable[1][0] / (results.contingencyTable[1][0] + results.contingencyTable[1][1])) * 100,
        pValue: results.pValue,
      },
    ];

    return (
      <div className="space-y-4">
        <GroupedComparisonChart
          data={data}
          title={suggestion.title}
          group1Name="Group 1"
          group2Name="Group 2"
        />

        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded">
          {results.oddsRatio && (
            <div>
              <p className="text-sm text-gray-600">Odds Ratio</p>
              <p className="font-semibold">
                {results.oddsRatio.toFixed(2)}
                {results.oddsRatioCI && (
                  <span className="text-sm text-gray-600 ml-1">
                    (95% CI: {results.oddsRatioCI[0].toFixed(2)}-{results.oddsRatioCI[1].toFixed(2)})
                  </span>
                )}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">Test Statistic</p>
            <p className="font-semibold">
              χ² = {results.chiSquare?.toFixed(2) || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">P-value</p>
            <p className="font-semibold">
              {results.pValue < 0.001 ? '<0.001' : results.pValue.toFixed(3)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

/**
 * Descriptive statistics visualization
 */
const DescriptiveVisualization: React.FC<{
  suggestion: AnalysisSuggestion;
  results: any;
}> = ({ suggestion, results }) => {
  const endpointName = suggestion.proposedAnalysis.outcome.name;
  const config = CARDIOVASCULAR_ENDPOINT_CHARTS[endpointName];

  if (results.continuous) {
    const data = [
      {
        group: 'Overall',
        mean: results.continuous.mean,
        median: results.continuous.median,
        sd: results.continuous.sd,
        iqr: results.continuous.iqr,
        n: results.continuous.n,
        min: results.continuous.min,
        max: results.continuous.max,
        benchmark: config?.benchmarkZones,
      },
    ];

    return (
      <ContinuousOutcomeBoxplot
        data={data}
        title={suggestion.title}
        endpoint={endpointName as any}
        benchmarks={config?.benchmarkZones}
        yAxisLabel={config?.yAxisLabel || 'Value'}
      />
    );
  }

  if (results.categorical) {
    const rateData = Object.entries(results.categorical.percentages).map(([category, percentage]) => ({
      category,
      rate: percentage as number,
      n: results.categorical.frequencies[category],
      benchmark: config?.benchmarkZones,
    }));

    return (
      <MortalityRateChart
        data={rateData}
        title={suggestion.title}
        endpoint={endpointName as any}
        benchmarks={config?.benchmarkZones || {
          acceptable: { low: 0, high: 100 },
          concerning: 100,
          direction: 'lower-better',
        }}
      />
    );
  }

  return null;
};

// =============================================================================
// DEMO SHOWCASE COMPONENT
// =============================================================================

/**
 * Demo component showing all chart types with SAFE Arch data
 */
export const VascularSurgeryChartShowcase: React.FC = () => {
  const strokeConfig = CARDIOVASCULAR_ENDPOINT_CHARTS.stroke_rate;
  const survivalConfig = CARDIOVASCULAR_ENDPOINT_CHARTS.survival_1year;
  const icuConfig = CARDIOVASCULAR_ENDPOINT_CHARTS.icu_length_of_stay;

  return (
    <div className="w-full space-y-8 p-6">
      <h1 className="text-2xl font-bold">Vascular Surgery Analysis Visualizations</h1>
      <p className="text-gray-600">
        Chart library for SAFE Arch cardiovascular endpoints with clinical benchmarks
      </p>

      {/* Stroke Rate Example */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Mortality/Morbidity Rates</h2>
        <MortalityRateChart
          data={generateMockRateData(strokeConfig, ['2019', '2020', '2021', '2022', '2023'], 5)}
          title="Stroke Rate by Year"
          endpoint="stroke_rate"
          benchmarks={strokeConfig.benchmarkZones}
        />
      </section>

      {/* Survival Analysis Example */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Survival Analysis</h2>
        <KaplanMeierChart
          data={generateMockSurvivalData(survivalConfig, ['Open Repair', 'Endovascular'], 60, 'months')}
          title="1-Year Survival by Technique"
          endpoint="survival_1year"
          benchmarks={survivalConfig.benchmarkZones}
          groups={['Open Repair', 'Endovascular']}
          timeUnit="months"
        />
      </section>

      {/* Continuous Outcome Example */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Continuous Outcomes</h2>
        <ContinuousOutcomeBoxplot
          data={generateMockContinuousData(icuConfig, ['Open', 'Endo', 'Hybrid'])}
          title="ICU Length of Stay by Approach"
          endpoint="icu_los"
          benchmarks={icuConfig.benchmarkZones}
          yAxisLabel="ICU LOS (days)"
        />
      </section>

      {/* Forest Plot Example */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Risk Factor Analysis</h2>
        <ForestPlot
          data={[
            { variable: 'Age (per year)', or: 1.03, ci95Lower: 1.01, ci95Upper: 1.05, pValue: 0.002, n: 500 },
            { variable: 'CKD', or: 2.1, ci95Lower: 1.5, ci95Upper: 2.9, pValue: 0.001, n: 500 },
            { variable: 'COPD', or: 1.8, ci95Lower: 1.3, ci95Upper: 2.4, pValue: 0.003, n: 500 },
            { variable: 'Emergency', or: 3.5, ci95Lower: 2.5, ci95Upper: 4.8, pValue: 0.0001, n: 500 },
            { variable: 'Female sex', or: 1.4, ci95Lower: 1.0, ci95Upper: 1.9, pValue: 0.045, n: 500 },
          ]}
          title="Predictors of 30-Day Mortality"
          effectType="OR"
        />
      </section>
    </div>
  );
};
