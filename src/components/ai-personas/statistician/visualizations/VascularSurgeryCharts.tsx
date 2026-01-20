// Vascular Surgery Statistical Visualizations
// Chart library for SAFE Arch cardiovascular endpoints
// Built on Recharts for clinical research data

import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  ReferenceArea,
  ErrorBar,
} from 'recharts';

// =============================================================================
// TYPES
// =============================================================================

export interface EndpointBenchmarkZones {
  excellent?: number;
  acceptable: { low: number; high: number };
  concerning: number;
  direction: 'lower-better' | 'higher-better';
}

export interface RateOutcomeData {
  category: string;
  rate: number; // Percentage
  n: number; // Sample size
  ci95Lower?: number;
  ci95Upper?: number;
  benchmark?: EndpointBenchmarkZones;
}

export interface SurvivalCurveData {
  time: number; // months or days
  survival: number; // proportion 0-1
  atRisk: number;
  events?: number;
  group?: string;
  ci95Lower?: number;
  ci95Upper?: number;
}

export interface ContinuousOutcomeData {
  group: string;
  mean?: number;
  median?: number;
  sd?: number;
  iqr?: [number, number];
  n: number;
  min?: number;
  max?: number;
  benchmark?: EndpointBenchmarkZones;
}

export interface RiskFactorForestData {
  variable: string;
  or?: number;
  hr?: number;
  ci95Lower: number;
  ci95Upper: number;
  pValue: number;
  n: number;
}

// =============================================================================
// MORTALITY/MORBIDITY RATE CHART WITH BENCHMARKS
// =============================================================================

export interface MortalityRateChartProps {
  data: RateOutcomeData[];
  title?: string;
  endpoint: 'mortality_30day' | 'stroke_rate' | 'sci_rate' | 'renal_failure' | 'reintervention';
  benchmarks: EndpointBenchmarkZones;
  height?: number;
}

export const MortalityRateChart: React.FC<MortalityRateChartProps> = ({
  data,
  title = 'Complication Rate',
  endpoint,
  benchmarks,
  height = 400,
}) => {
  // Color coding based on benchmark zones
  const getBarColor = (rate: number): string => {
    if (benchmarks.direction === 'lower-better') {
      if (benchmarks.excellent !== undefined && rate <= benchmarks.excellent) return '#10b981'; // Green - excellent
      if (rate <= benchmarks.acceptable.high) return '#3b82f6'; // Blue - acceptable
      if (rate <= benchmarks.concerning) return '#f59e0b'; // Orange - warning
      return '#ef4444'; // Red - concerning
    } else {
      if (rate >= benchmarks.acceptable.low) return '#10b981';
      if (rate >= benchmarks.concerning) return '#f59e0b';
      return '#ef4444';
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="category"
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis
            label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }}
            domain={[0, 'auto']}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const dataPoint = payload[0].payload as RateOutcomeData;
                return (
                  <div className="bg-white p-3 border rounded shadow-lg">
                    <p className="font-semibold">{dataPoint.category}</p>
                    <p className="text-sm">
                      Rate: {dataPoint.rate.toFixed(1)}%
                      {dataPoint.ci95Lower !== undefined && dataPoint.ci95Upper !== undefined && (
                        <span className="text-gray-600 ml-1">
                          (95% CI: {dataPoint.ci95Lower.toFixed(1)}-{dataPoint.ci95Upper.toFixed(1)}%)
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">n = {dataPoint.n}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />

          {/* Benchmark reference lines */}
          {benchmarks.excellent !== undefined && (
            <ReferenceLine
              y={benchmarks.excellent}
              stroke="#10b981"
              strokeDasharray="3 3"
              label={{ value: 'Excellent', position: 'right', fill: '#10b981' }}
            />
          )}
          <ReferenceLine
            y={benchmarks.acceptable.high}
            stroke="#3b82f6"
            strokeDasharray="3 3"
            label={{ value: 'Acceptable', position: 'right', fill: '#3b82f6' }}
          />
          <ReferenceLine
            y={benchmarks.concerning}
            stroke="#ef4444"
            strokeDasharray="3 3"
            label={{ value: 'Concerning', position: 'right', fill: '#ef4444' }}
          />

          <Bar dataKey="rate" name={title}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.rate)} />
            ))}
            <ErrorBar dataKey="ci95Lower" width={4} strokeWidth={2} />
            <ErrorBar dataKey="ci95Upper" width={4} strokeWidth={2} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-2 text-xs text-gray-600">
        <p>
          Benchmark: Acceptable {benchmarks.acceptable.low}-{benchmarks.acceptable.high}%,
          Concerning ≥{benchmarks.concerning}%
          {benchmarks.excellent !== undefined && `, Excellent ≤${benchmarks.excellent}%`}
        </p>
      </div>
    </div>
  );
};

// =============================================================================
// KAPLAN-MEIER SURVIVAL CURVE
// =============================================================================

export interface KaplanMeierChartProps {
  data: SurvivalCurveData[];
  title?: string;
  endpoint: 'survival_1year' | 'survival_5year' | 'freedom_from_reintervention';
  benchmarks?: EndpointBenchmarkZones;
  groups?: string[];
  height?: number;
  timeUnit?: 'days' | 'months' | 'years';
}

export const KaplanMeierChart: React.FC<KaplanMeierChartProps> = ({
  data,
  title = 'Survival Analysis',
  benchmarks,
  groups = ['Overall'],
  height = 500,
  timeUnit = 'months',
}) => {
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{ value: `Time (${timeUnit})`, position: 'insideBottom', offset: -10 }}
          />
          <YAxis
            label={{ value: 'Survival Probability', angle: -90, position: 'insideLeft' }}
            domain={[0, 1]}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const dataPoint = payload[0].payload as SurvivalCurveData;
                return (
                  <div className="bg-white p-3 border rounded shadow-lg">
                    <p className="font-semibold">
                      {dataPoint.group || 'Overall'}
                    </p>
                    <p className="text-sm">Time: {dataPoint.time} {timeUnit}</p>
                    <p className="text-sm">
                      Survival: {(dataPoint.survival * 100).toFixed(1)}%
                      {dataPoint.ci95Lower !== undefined && dataPoint.ci95Upper !== undefined && (
                        <span className="text-gray-600 ml-1">
                          ({(dataPoint.ci95Lower * 100).toFixed(1)}-{(dataPoint.ci95Upper * 100).toFixed(1)}%)
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">At risk: {dataPoint.atRisk}</p>
                    {dataPoint.events !== undefined && (
                      <p className="text-sm text-gray-600">Events: {dataPoint.events}</p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />

          {/* Benchmark reference line (e.g., 80% 1-year survival) */}
          {benchmarks && (
            <ReferenceLine
              y={benchmarks.acceptable.low / 100}
              stroke="#10b981"
              strokeDasharray="3 3"
              label={{ value: `Acceptable: ${benchmarks.acceptable.low}%`, position: 'right' }}
            />
          )}

          {groups.map((group, idx) => (
            <Line
              key={group}
              type="stepAfter"
              dataKey="survival"
              data={data.filter(d => d.group === group || groups.length === 1)}
              stroke={colors[idx % colors.length]}
              strokeWidth={2}
              name={group}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4">
        <table className="w-full text-xs border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Time</th>
              {groups.map(g => (
                <th key={g} className="p-2 text-center">{g} (at risk)</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...new Set(data.map(d => d.time))].slice(0, 6).map(time => (
              <tr key={time} className="border-t">
                <td className="p-2">{time} {timeUnit}</td>
                {groups.map(g => {
                  const point = data.find(d => d.time === time && (d.group === g || groups.length === 1));
                  return (
                    <td key={g} className="p-2 text-center">
                      {point ? point.atRisk : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// =============================================================================
// CONTINUOUS OUTCOME BOXPLOT (e.g., ICU LOS, Hospital LOS)
// =============================================================================

export interface ContinuousOutcomeBoxplotProps {
  data: ContinuousOutcomeData[];
  title?: string;
  endpoint: 'icu_los' | 'hospital_los' | 'arrest_time';
  benchmarks?: EndpointBenchmarkZones;
  height?: number;
  yAxisLabel?: string;
}

export const ContinuousOutcomeBoxplot: React.FC<ContinuousOutcomeBoxplotProps> = ({
  data,
  title = 'Continuous Outcome',
  benchmarks,
  height = 400,
  yAxisLabel = 'Value',
}) => {
  // For boxplot, we'll use scatter with error bars to approximate
  const chartData = data.map(d => ({
    ...d,
    value: d.median || d.mean || 0,
    error: d.iqr ? [(d.iqr[1] - d.iqr[0]) / 2, (d.iqr[1] - d.iqr[0]) / 2] : [d.sd || 0, d.sd || 0],
  }));

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="group"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload as ContinuousOutcomeData;
                return (
                  <div className="bg-white p-3 border rounded shadow-lg">
                    <p className="font-semibold">{d.group}</p>
                    {d.median !== undefined && (
                      <p className="text-sm">Median: {d.median.toFixed(1)}</p>
                    )}
                    {d.mean !== undefined && (
                      <p className="text-sm">Mean: {d.mean.toFixed(1)} ± {d.sd?.toFixed(1)}</p>
                    )}
                    {d.iqr && (
                      <p className="text-sm text-gray-600">
                        IQR: {d.iqr[0].toFixed(1)} - {d.iqr[1].toFixed(1)}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">n = {d.n}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />

          {/* Benchmark zones */}
          {benchmarks && (
            <>
              <ReferenceArea
                y1={benchmarks.acceptable.low}
                y2={benchmarks.acceptable.high}
                fill="#3b82f6"
                fillOpacity={0.1}
                label={{ value: 'Acceptable range', position: 'top' }}
              />
              <ReferenceLine
                y={benchmarks.concerning}
                stroke="#ef4444"
                strokeDasharray="3 3"
                label={{ value: 'Concerning', position: 'right', fill: '#ef4444' }}
              />
            </>
          )}

          <Bar dataKey="value" fill="#3b82f6" name={title}>
            <ErrorBar dataKey="error" width={4} strokeWidth={2} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// =============================================================================
// FOREST PLOT FOR RISK FACTORS (OR/HR with CI)
// =============================================================================

export interface ForestPlotProps {
  data: RiskFactorForestData[];
  title?: string;
  effectType: 'OR' | 'HR';
  height?: number;
}

export const ForestPlot: React.FC<ForestPlotProps> = ({
  data,
  title = 'Risk Factor Analysis',
  effectType = 'OR',
  height = 400,
}) => {
  const chartData = data.map(d => ({
    ...d,
    effect: effectType === 'OR' ? d.or : d.hr,
    errorLower: (effectType === 'OR' ? d.or : d.hr)! - d.ci95Lower,
    errorUpper: d.ci95Upper - (effectType === 'OR' ? d.or : d.hr)!,
  }));

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{ top: 20, right: 30, left: 150, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="effect"
            domain={[0, 'auto']}
            label={{ value: effectType, position: 'insideBottom', offset: -10 }}
          />
          <YAxis
            type="category"
            dataKey="variable"
            width={140}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload as typeof chartData[0];
                return (
                  <div className="bg-white p-3 border rounded shadow-lg">
                    <p className="font-semibold">{d.variable}</p>
                    <p className="text-sm">
                      {effectType}: {d.effect?.toFixed(2)} (95% CI: {d.ci95Lower.toFixed(2)}-{d.ci95Upper.toFixed(2)})
                    </p>
                    <p className="text-sm">p = {d.pValue < 0.001 ? '<0.001' : d.pValue.toFixed(3)}</p>
                    <p className="text-sm text-gray-600">n = {d.n}</p>
                  </div>
                );
              }
              return null;
            }}
          />

          {/* Line of no effect */}
          <ReferenceLine x={1} stroke="#000" strokeWidth={2} />

          <Scatter
            data={chartData}
            fill="#3b82f6"
            shape="diamond"
          >
            <ErrorBar
              dataKey="errorLower"
              width={0}
              strokeWidth={2}
              direction="x"
            />
            <ErrorBar
              dataKey="errorUpper"
              width={0}
              strokeWidth={2}
              direction="x"
            />
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.pValue < 0.05 ? '#3b82f6' : '#94a3b8'}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      <div className="mt-2 text-xs text-gray-600">
        <p>Blue = statistically significant (p &lt; 0.05), Gray = non-significant</p>
        <p>Diamond crosses 1.0 = not significant</p>
      </div>
    </div>
  );
};

// =============================================================================
// GROUPED COMPARISON (e.g., comparing open vs endovascular outcomes)
// =============================================================================

export interface GroupedComparisonData {
  outcome: string;
  group1Value: number;
  group2Value: number;
  group1CI?: [number, number];
  group2CI?: [number, number];
  pValue?: number;
}

export interface GroupedComparisonChartProps {
  data: GroupedComparisonData[];
  title?: string;
  group1Name: string;
  group2Name: string;
  height?: number;
  yAxisLabel?: string;
}

export const GroupedComparisonChart: React.FC<GroupedComparisonChartProps> = ({
  data,
  title = 'Outcome Comparison',
  group1Name,
  group2Name,
  height = 400,
  yAxisLabel = 'Rate (%)',
}) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="outcome"
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
          />
          <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload as GroupedComparisonData;
                return (
                  <div className="bg-white p-3 border rounded shadow-lg">
                    <p className="font-semibold">{d.outcome}</p>
                    <p className="text-sm text-blue-600">
                      {group1Name}: {d.group1Value.toFixed(1)}%
                      {d.group1CI && ` (${d.group1CI[0].toFixed(1)}-${d.group1CI[1].toFixed(1)}%)`}
                    </p>
                    <p className="text-sm text-red-600">
                      {group2Name}: {d.group2Value.toFixed(1)}%
                      {d.group2CI && ` (${d.group2CI[0].toFixed(1)}-${d.group2CI[1].toFixed(1)}%)`}
                    </p>
                    {d.pValue !== undefined && (
                      <p className="text-sm font-semibold mt-1">
                        p = {d.pValue < 0.001 ? '<0.001' : d.pValue.toFixed(3)}
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar dataKey="group1Value" fill="#3b82f6" name={group1Name} />
          <Bar dataKey="group2Value" fill="#ef4444" name={group2Name} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
