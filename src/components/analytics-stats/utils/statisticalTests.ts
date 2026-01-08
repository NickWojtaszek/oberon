// Statistical Test Engine
// Performs actual statistical calculations and test selection

import type { AnalysisVariable, ComparativeAnalysisResult } from '../types';

/**
 * Recommends appropriate statistical test based on variable types
 */
export function recommendTest(
  predictor: AnalysisVariable,
  outcome: AnalysisVariable
): { test: string; rationale: string } {
  // Categorical Predictor × Categorical Outcome
  if (
    (predictor.dataType === 'Text' || predictor.dataType === 'Boolean') &&
    (outcome.dataType === 'Text' || outcome.dataType === 'Boolean')
  ) {
    return {
      test: "Fisher's Exact Test",
      rationale: 'Categorical predictor and categorical outcome. Fisher\'s Exact Test is appropriate for contingency table analysis.'
    };
  }

  // Categorical Predictor × Continuous Outcome
  if (
    (predictor.dataType === 'Text' || predictor.dataType === 'Boolean') &&
    outcome.dataType === 'Numeric'
  ) {
    return {
      test: 'Independent Samples T-Test',
      rationale: 'Categorical predictor (2 groups) and continuous outcome. T-test compares means between groups.'
    };
  }

  // Continuous Predictor × Continuous Outcome
  if (predictor.dataType === 'Numeric' && outcome.dataType === 'Numeric') {
    return {
      test: 'Pearson Correlation',
      rationale: 'Both variables are continuous. Pearson correlation measures linear relationship strength.'
    };
  }

  // Time-to-Event Analysis
  if (outcome.name.toLowerCase().includes('time') || outcome.name.toLowerCase().includes('survival')) {
    return {
      test: 'Log-Rank Test / Kaplan-Meier',
      rationale: 'Outcome appears to be time-to-event data. Log-rank test compares survival curves between groups.'
    };
  }

  // Default
  return {
    test: 'Chi-Square Test',
    rationale: 'Default categorical analysis. Chi-square test for independence.'
  };
}

/**
 * Calculate descriptive statistics for continuous data
 */
export function calculateContinuousStats(values: number[]): {
  mean: number;
  sd: number;
  median: number;
  iqr: [number, number];
  min: number;
  max: number;
  outlierCount: number;
} {
  const n = values.length;
  if (n === 0) {
    return { mean: 0, sd: 0, median: 0, iqr: [0, 0], min: 0, max: 0, outlierCount: 0 };
  }

  // Mean
  const mean = values.reduce((sum, v) => sum + v, 0) / n;

  // Standard Deviation
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (n - 1);
  const sd = Math.sqrt(variance);

  // Median and IQR
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(n / 2)];
  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const iqr: [number, number] = [q1, q3];

  // Min/Max
  const min = sorted[0];
  const max = sorted[n - 1];

  // Outliers (using IQR method)
  const iqrRange = q3 - q1;
  const lowerBound = q1 - 1.5 * iqrRange;
  const upperBound = q3 + 1.5 * iqrRange;
  const outlierCount = values.filter(v => v < lowerBound || v > upperBound).length;

  return { mean, sd, median, iqr, min, max, outlierCount };
}

/**
 * Calculate frequency distribution for categorical data
 */
export function calculateFrequency(values: string[]): {
  frequency: { [key: string]: number };
  percentage: { [key: string]: number };
} {
  const n = values.length;
  const frequency: { [key: string]: number } = {};

  values.forEach(value => {
    frequency[value] = (frequency[value] || 0) + 1;
  });

  const percentage: { [key: string]: number } = {};
  Object.keys(frequency).forEach(key => {
    percentage[key] = (frequency[key] / n) * 100;
  });

  return { frequency, percentage };
}

/**
 * Perform Fisher's Exact Test (simplified 2x2 table)
 */
export function fishersExactTest(
  group1Success: number,
  group1Fail: number,
  group2Success: number,
  group2Fail: number
): { pValue: number; oddsRatio: number } {
  // Simplified calculation (exact test requires complex combinatorics)
  // This is an approximation for demonstration
  
  const n1 = group1Success + group1Fail;
  const n2 = group2Success + group2Fail;
  const k1 = group1Success + group2Success;
  const k2 = group1Fail + group2Fail;
  const n = n1 + n2;

  // Odds ratio
  const oddsRatio = (group1Success * group2Fail) / (group1Fail * group2Success + 0.0001);

  // Chi-square approximation for p-value
  const expected11 = (n1 * k1) / n;
  const expected12 = (n1 * k2) / n;
  const expected21 = (n2 * k1) / n;
  const expected22 = (n2 * k2) / n;

  const chiSquare =
    Math.pow(group1Success - expected11, 2) / expected11 +
    Math.pow(group1Fail - expected12, 2) / expected12 +
    Math.pow(group2Success - expected21, 2) / expected21 +
    Math.pow(group2Fail - expected22, 2) / expected22;

  // Approximate p-value (chi-square distribution with df=1)
  const pValue = 1 - chiSquareCDF(chiSquare, 1);

  return { pValue, oddsRatio };
}

/**
 * Perform Independent Samples T-Test
 */
export function tTest(group1: number[], group2: number[]): {
  tStatistic: number;
  pValue: number;
  degreesOfFreedom: number;
} {
  const n1 = group1.length;
  const n2 = group2.length;

  if (n1 === 0 || n2 === 0) {
    return { tStatistic: 0, pValue: 1, degreesOfFreedom: 0 };
  }

  const mean1 = group1.reduce((sum, v) => sum + v, 0) / n1;
  const mean2 = group2.reduce((sum, v) => sum + v, 0) / n2;

  const var1 = group1.reduce((sum, v) => sum + Math.pow(v - mean1, 2), 0) / (n1 - 1);
  const var2 = group2.reduce((sum, v) => sum + Math.pow(v - mean2, 2), 0) / (n2 - 1);

  // Pooled standard error
  const se = Math.sqrt(var1 / n1 + var2 / n2);

  const tStatistic = (mean1 - mean2) / se;
  const degreesOfFreedom = n1 + n2 - 2;

  // Approximate p-value (two-tailed)
  const pValue = 2 * (1 - tDistributionCDF(Math.abs(tStatistic), degreesOfFreedom));

  return { tStatistic, pValue, degreesOfFreedom };
}

/**
 * Calculate Pearson correlation coefficient
 */
export function pearsonCorrelation(x: number[], y: number[]): {
  coefficient: number;
  pValue: number;
} {
  const n = Math.min(x.length, y.length);
  if (n === 0) {
    return { coefficient: 0, pValue: 1 };
  }

  const meanX = x.reduce((sum, v) => sum + v, 0) / n;
  const meanY = y.reduce((sum, v) => sum + v, 0) / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }

  const coefficient = numerator / Math.sqrt(denomX * denomY);

  // Approximate p-value using t-distribution
  const t = coefficient * Math.sqrt((n - 2) / (1 - coefficient * coefficient));
  const pValue = 2 * (1 - tDistributionCDF(Math.abs(t), n - 2));

  return { coefficient, pValue };
}

/**
 * Chi-square CDF approximation
 */
function chiSquareCDF(x: number, df: number): number {
  // Simplified approximation
  if (x <= 0) return 0;
  if (x > 20) return 1;
  
  // Use normal approximation for df > 30
  if (df > 30) {
    const z = (Math.sqrt(2 * x) - Math.sqrt(2 * df - 1));
    return normalCDF(z);
  }
  
  // Lookup table approximation for common values
  if (df === 1) {
    if (x >= 3.841) return 0.95;
    if (x >= 2.706) return 0.90;
    return 0.5;
  }
  
  return 0.5; // Default
}

/**
 * T-distribution CDF approximation
 */
function tDistributionCDF(t: number, df: number): number {
  // For large df, use normal approximation
  if (df > 30) {
    return normalCDF(t);
  }
  
  // Simplified approximation
  const x = df / (df + t * t);
  return 0.5 + 0.5 * Math.sign(t) * (1 - Math.pow(x, df / 2));
}

/**
 * Normal CDF approximation
 */
function normalCDF(z: number): number {
  // Approximation using error function
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  
  return z > 0 ? 1 - p : p;
}

/**
 * Format p-value for display
 */
export function formatPValue(p: number): string {
  if (p < 0.001) return 'p < 0.001';
  if (p < 0.01) return `p = ${p.toFixed(3)}`;
  return `p = ${p.toFixed(2)}`;
}

/**
 * Determine significance
 */
export function isSignificant(p: number, alpha: number = 0.05): boolean {
  return p < alpha;
}
