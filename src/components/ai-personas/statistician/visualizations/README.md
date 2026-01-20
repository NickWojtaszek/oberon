# Vascular Surgery Statistical Visualization Library

A domain-specific chart library for cardiovascular and vascular surgery outcomes research, built for the SAFE Arch protocol and integrated with Dr. Saga AI Statistician.

## Overview

This library provides **pre-configured, publication-ready visualizations** for common cardiovascular endpoints with:
- Clinical benchmarks from literature (STS, EACTS, SVS)
- Confidence intervals and statistical annotations
- Color-coded performance zones (excellent, acceptable, concerning)
- Responsive Recharts components

## Quick Start

```tsx
import {
  MortalityRateChart,
  KaplanMeierChart,
  CARDIOVASCULAR_ENDPOINT_CHARTS
} from './visualizations';

// Stroke rate with benchmarks
<MortalityRateChart
  data={strokeData}
  endpoint="stroke_rate"
  benchmarks={CARDIOVASCULAR_ENDPOINT_CHARTS.stroke_rate.benchmarkZones}
/>

// 1-year survival
<KaplanMeierChart
  data={survivalData}
  endpoint="survival_1year"
  groups={['Open', 'Endovascular']}
  timeUnit="months"
/>
```

## Chart Components

### 1. MortalityRateChart
Bar chart for complication rates with benchmark zones.

**Use for:**
- 30-day mortality
- Stroke rate
- Spinal cord injury
- Renal failure
- Any binary complication rate

**Features:**
- Color-coded bars (green=excellent, blue=acceptable, orange=warning, red=concerning)
- Wilson score confidence intervals
- Reference lines for benchmark thresholds
- Automatic n display

**Example:**
```tsx
<MortalityRateChart
  data={[
    {
      category: '2023',
      rate: 5.2,
      n: 145,
      ci95Lower: 2.8,
      ci95Upper: 9.1
    }
  ]}
  endpoint="stroke_rate"
  benchmarks={{
    excellent: 3,
    acceptable: { low: 0, high: 7 },
    concerning: 13,
    direction: 'lower-better'
  }}
/>
```

### 2. KaplanMeierChart
Step-function survival curves with at-risk tables.

**Use for:**
- 1-year survival
- 5-year survival
- Freedom from reintervention
- Time-to-event analyses

**Features:**
- Multiple groups with color coding
- Confidence interval shading
- At-risk table below chart
- Benchmark reference lines

**Example:**
```tsx
<KaplanMeierChart
  data={kmData}
  endpoint="survival_1year"
  groups={['Open Repair', 'Endovascular']}
  benchmarks={{
    acceptable: { low: 80, high: 100 },
    concerning: 70,
    direction: 'higher-better'
  }}
  timeUnit="months"
/>
```

### 3. ContinuousOutcomeBoxplot
Boxplots for continuous outcomes (mean/median, IQR, SD).

**Use for:**
- ICU length of stay
- Hospital length of stay
- Circulatory arrest time
- Operative time
- Blood loss

**Features:**
- Median + IQR or mean + SD
- Benchmark zones as reference areas
- Error bars for variability
- Min/max whiskers

**Example:**
```tsx
<ContinuousOutcomeBoxplot
  data={[
    {
      group: 'Open',
      median: 3.5,
      iqr: [2, 5],
      n: 120
    }
  ]}
  endpoint="icu_los"
  benchmarks={{
    acceptable: { low: 0, high: 5 },
    concerning: 10,
    direction: 'lower-better'
  }}
  yAxisLabel="ICU LOS (days)"
/>
```

### 4. ForestPlot
Forest plot for multivariable regression results.

**Use for:**
- Logistic regression (OR)
- Cox regression (HR)
- Risk factor identification
- Adjusted analyses

**Features:**
- Diamond markers for effect sizes
- Horizontal error bars for 95% CI
- Line of no effect (OR/HR = 1)
- Color coding by statistical significance
- P-values in tooltips

**Example:**
```tsx
<ForestPlot
  data={[
    {
      variable: 'Age (per year)',
      or: 1.03,
      ci95Lower: 1.01,
      ci95Upper: 1.05,
      pValue: 0.002,
      n: 500
    }
  ]}
  effectType="OR"
  title="Predictors of 30-Day Mortality"
/>
```

### 5. GroupedComparisonChart
Side-by-side bar charts for group comparisons.

**Use for:**
- Open vs endovascular outcomes
- Before/after comparisons
- Treatment arm differences

**Example:**
```tsx
<GroupedComparisonChart
  data={[
    {
      outcome: 'Stroke',
      group1Value: 5.2,
      group2Value: 7.8,
      pValue: 0.23
    }
  ]}
  group1Name="Open Repair"
  group2Name="Endovascular"
/>
```

## Pre-Configured Endpoints

The library includes benchmark data for 9 cardiovascular endpoints:

| Endpoint | Chart Type | Benchmark Source | Key Values |
|----------|-----------|------------------|------------|
| `stroke_rate` | Bar | Preventza, Coselli | Acceptable: 0-7%, Concerning: >13% |
| `mortality_30day` | Bar | STS Database | Acceptable: 0-8%, Concerning: >15% |
| `spinal_cord_injury` | Bar | TEVAR literature | Acceptable: 0-5%, Concerning: >10% |
| `renal_failure` | Bar | KDIGO criteria | Acceptable: 0-10%, Concerning: >20% |
| `survival_1year` | Kaplan-Meier | Contemporary series | Acceptable: 80-100%, Concerning: <70% |
| `survival_5year` | Kaplan-Meier | Long-term outcomes | Acceptable: 60-100%, Concerning: <50% |
| `reintervention_rate` | Kaplan-Meier | EVAR/TEVAR durability | Acceptable: 0-15%, Concerning: >25% |
| `icu_length_of_stay` | Boxplot | Cardiac surgery | Acceptable: 0-5 days, Concerning: >10 days |
| `hospital_length_of_stay` | Boxplot | NSQIP, STS | Acceptable: 0-14 days, Concerning: >21 days |

## Chart Recommendation Engine

Automatically select the right chart:

```tsx
import { recommendChart } from './visualizations';

const recommendation = recommendChart(
  'kaplan-meier',        // analysisType
  'survival_1year',      // endpointName (optional)
  'time-to-event'        // outcomeDataType (optional)
);

// Returns:
// {
//   chartType: 'kaplan-meier',
//   componentName: 'KaplanMeierChart',
//   rationale: 'Survival analysis requires Kaplan-Meier curves...',
//   dataRequirements: ['time points', 'survival probabilities', ...]
// }
```

## Integration with Dr. Saga

The `AnalysisVisualization` component automatically renders the appropriate chart based on analysis results:

```tsx
import { AnalysisVisualization } from './visualizations';

<AnalysisVisualization
  suggestion={drSagaSuggestion}
  executionResult={analysisResult}
/>
```

Supports:
- Kaplan-Meier survival analyses
- Logistic/Cox regression (forest plots)
- T-tests and group comparisons
- Descriptive statistics
- Chi-square/Fisher exact tests

## Adding New Endpoints

1. **Add benchmark data to `chartConfigurationLibrary.ts`:**

```typescript
export const CARDIOVASCULAR_ENDPOINT_CHARTS = {
  // ... existing endpoints
  myocardial_infarction: {
    endpointName: 'Myocardial Infarction',
    primaryChartType: 'bar',
    benchmarkZones: {
      acceptable: { low: 0, high: 5 },
      concerning: 10,
      direction: 'lower-better'
    },
    yAxisLabel: 'MI Rate',
    yAxisUnit: '%',
    colorScheme: 'rate',
    showConfidenceIntervals: true,
    showBenchmarkLines: true
  }
};
```

2. **Add to clinical benchmark library** (`clinicalBenchmarkLibrary.ts`) for AI detection:

```typescript
{
  name: 'myocardial_infarction',
  alternateNames: ['mi', 'heart_attack', 'ami'],
  type: 'rate',
  unit: '%',
  acceptable: { low: 0, high: 5 },
  concerning: 10,
  direction: 'lower-better',
  source: 'ACC/AHA Guidelines',
  analysisMethod: 'Wilson score CI'
}
```

3. **Use in charts:**

```tsx
<MortalityRateChart
  data={miData}
  endpoint="myocardial_infarction"
  benchmarks={CARDIOVASCULAR_ENDPOINT_CHARTS.myocardial_infarction.benchmarkZones}
/>
```

## Extending to Other Domains

The pattern can be replicated for other specialties:

### Oncology Example:
```typescript
export const ONCOLOGY_ENDPOINT_CHARTS = {
  overall_survival: {
    primaryChartType: 'kaplan-meier',
    benchmarkZones: {
      acceptable: { low: 12, high: 100 }, // months
      concerning: 6,
      direction: 'higher-better'
    },
    // ... config
  },
  objective_response_rate: {
    primaryChartType: 'bar',
    benchmarkZones: {
      acceptable: { low: 30, high: 100 }, // %
      concerning: 15,
      direction: 'higher-better'
    },
    // ... config
  }
};
```

### Diabetes Example:
```typescript
export const DIABETES_ENDPOINT_CHARTS = {
  hba1c_change: {
    primaryChartType: 'boxplot',
    benchmarkZones: {
      acceptable: { low: -2.0, high: -0.5 }, // % change
      concerning: -0.3,
      direction: 'lower-better'
    },
    // ... config
  }
};
```

## Mock Data Generators

For testing and demos:

```tsx
import {
  generateMockRateData,
  generateMockSurvivalData,
  generateMockContinuousData
} from './visualizations';

// Rate data (e.g., complications by year)
const rateData = generateMockRateData(
  CARDIOVASCULAR_ENDPOINT_CHARTS.stroke_rate,
  ['2020', '2021', '2022'],
  5  // base rate %
);

// Survival data (e.g., by technique)
const survivalData = generateMockSurvivalData(
  CARDIOVASCULAR_ENDPOINT_CHARTS.survival_1year,
  ['Open', 'Endovascular'],
  60,  // max time in months
  'months'
);

// Continuous data (e.g., LOS by approach)
const continuousData = generateMockContinuousData(
  CARDIOVASCULAR_ENDPOINT_CHARTS.icu_los,
  ['Open', 'Endo', 'Hybrid']
);
```

## Demo/Showcase

View all chart types in action:

```tsx
import { VascularSurgeryChartShowcase } from './visualizations';

<VascularSurgeryChartShowcase />
```

Shows:
- Mortality/morbidity rate charts
- Kaplan-Meier survival curves
- Continuous outcome boxplots
- Forest plots for risk factors

## Dependencies

- **recharts** (^2.15.2): Base charting library
- **React** (^18.3.1)
- **TypeScript** (^5.3.0)

All dependencies already installed in the project.

## File Structure

```
visualizations/
├── VascularSurgeryCharts.tsx          # Core chart components
├── chartConfigurationLibrary.ts        # Endpoint configs + utilities
├── AnalysisVisualizationDemo.tsx      # Integration examples
├── index.ts                            # Exports
└── README.md                           # This file
```

## Next Steps

1. **Add more domains**: Oncology, diabetes, neurology charts
2. **Interactive features**: Click to drill down, export to PNG/SVG
3. **Publication export**: Generate high-res figures for manuscripts
4. **Comparative overlays**: Multiple cohorts on same chart
5. **Statistical annotations**: Automatic p-value stars, effect size labels

## References

- **STS Database**: Society of Thoracic Surgeons outcomes data
- **EACTS Guidelines**: European Association for Cardio-Thoracic Surgery
- **SVS Reporting Standards**: Society for Vascular Surgery
- **Preventza O, et al.**: Contemporary aortic arch repair outcomes (JTCVS)
- **Coselli JS, et al.**: Aortic surgery benchmarks (Ann Thorac Surg)
