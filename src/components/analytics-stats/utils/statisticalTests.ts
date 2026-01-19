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

// =============================================================================
// ADVANCED STATISTICAL METHODS (Added for Dr. Saga enhancement)
// =============================================================================

/**
 * Wilson Score Confidence Interval
 * Superior to normal approximation for proportions, especially for small samples
 * and proportions near 0% or 100%
 */
export function wilsonScoreCI(
  successes: number,
  total: number,
  confidenceLevel: number = 0.95
): { proportion: number; lower: number; upper: number; method: string } {
  if (total === 0) {
    return { proportion: 0, lower: 0, upper: 0, method: 'Wilson Score' };
  }

  const p = successes / total;
  const z = getZScore(confidenceLevel);
  const z2 = z * z;
  const n = total;

  // Wilson score formula
  const denominator = 1 + z2 / n;
  const center = p + z2 / (2 * n);
  const margin = z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n);

  const lower = Math.max(0, (center - margin) / denominator);
  const upper = Math.min(1, (center + margin) / denominator);

  return {
    proportion: p,
    lower,
    upper,
    method: 'Wilson Score'
  };
}

/**
 * Get Z-score for given confidence level
 */
function getZScore(confidenceLevel: number): number {
  const zScores: Record<number, number> = {
    0.90: 1.645,
    0.95: 1.96,
    0.99: 2.576,
  };
  return zScores[confidenceLevel] || 1.96;
}

/**
 * Kaplan-Meier Survival Analysis
 * Product-limit estimator for time-to-event data
 */
export function kaplanMeier(
  events: Array<{ time: number; event: boolean; group?: string }>,
  maxTime?: number
): {
  overall: Array<{ time: number; survival: number; atRisk: number; events: number }>;
  byGroup?: Record<string, Array<{ time: number; survival: number; atRisk: number; events: number }>>;
  medianSurvival: number | null;
  medianSurvivalByGroup?: Record<string, number | null>;
} {
  if (events.length === 0) {
    return { overall: [], medianSurvival: null };
  }

  const censorTime = maxTime || Math.max(...events.map(e => e.time));

  // Calculate overall survival curve
  const overallCurve = calculateKMCurve(events, censorTime);
  const medianSurvival = findMedianSurvival(overallCurve);

  // Calculate by group if groups exist
  const groups = [...new Set(events.filter(e => e.group).map(e => e.group!))];
  let byGroup: Record<string, Array<{ time: number; survival: number; atRisk: number; events: number }>> | undefined;
  let medianSurvivalByGroup: Record<string, number | null> | undefined;

  if (groups.length > 1) {
    byGroup = {};
    medianSurvivalByGroup = {};
    for (const group of groups) {
      const groupEvents = events.filter(e => e.group === group);
      byGroup[group] = calculateKMCurve(groupEvents, censorTime);
      medianSurvivalByGroup[group] = findMedianSurvival(byGroup[group]);
    }
  }

  return {
    overall: overallCurve,
    byGroup,
    medianSurvival,
    medianSurvivalByGroup,
  };
}

/**
 * Calculate KM survival curve for a set of events
 */
function calculateKMCurve(
  events: Array<{ time: number; event: boolean }>,
  maxTime: number
): Array<{ time: number; survival: number; atRisk: number; events: number }> {
  // Sort by time
  const sorted = [...events].sort((a, b) => a.time - b.time);

  const curve: Array<{ time: number; survival: number; atRisk: number; events: number }> = [];
  let survival = 1.0;
  let atRisk = sorted.length;

  // Start at time 0
  curve.push({ time: 0, survival: 1.0, atRisk, events: 0 });

  // Group events by time
  const timePoints = [...new Set(sorted.map(e => e.time))].sort((a, b) => a - b);

  for (const t of timePoints) {
    if (t > maxTime) break;

    const eventsAtT = sorted.filter(e => e.time === t && e.event).length;
    const censoredAtT = sorted.filter(e => e.time === t && !e.event).length;

    if (eventsAtT > 0 && atRisk > 0) {
      survival = survival * (1 - eventsAtT / atRisk);
      curve.push({ time: t, survival, atRisk, events: eventsAtT });
    }

    atRisk -= (eventsAtT + censoredAtT);
  }

  // Extend to maxTime if needed
  if (curve[curve.length - 1].time < maxTime) {
    curve.push({ ...curve[curve.length - 1], time: maxTime });
  }

  return curve;
}

/**
 * Find median survival time from KM curve
 */
function findMedianSurvival(
  curve: Array<{ time: number; survival: number }>
): number | null {
  for (let i = 0; i < curve.length; i++) {
    if (curve[i].survival <= 0.5) {
      return curve[i].time;
    }
  }
  return null; // Median not reached
}

/**
 * Log-Rank Test for comparing survival curves
 */
export function logRankTest(
  group1: Array<{ time: number; event: boolean }>,
  group2: Array<{ time: number; event: boolean }>
): { chiSquare: number; pValue: number; degreesOfFreedom: number } {
  // Combine and sort all events
  const all = [
    ...group1.map(e => ({ ...e, group: 1 })),
    ...group2.map(e => ({ ...e, group: 2 })),
  ].sort((a, b) => a.time - b.time);

  const timePoints = [...new Set(all.map(e => e.time))];

  let O1 = 0; // Observed events in group 1
  let E1 = 0; // Expected events in group 1
  let V = 0;  // Variance

  let n1 = group1.length;
  let n2 = group2.length;

  for (const t of timePoints) {
    const d1 = all.filter(e => e.time === t && e.group === 1 && e.event).length;
    const d2 = all.filter(e => e.time === t && e.group === 2 && e.event).length;
    const d = d1 + d2;
    const n = n1 + n2;

    if (n > 0 && d > 0) {
      O1 += d1;
      E1 += (n1 * d) / n;

      if (n > 1) {
        V += (n1 * n2 * d * (n - d)) / (n * n * (n - 1));
      }
    }

    // Update at-risk counts
    const c1 = all.filter(e => e.time === t && e.group === 1).length;
    const c2 = all.filter(e => e.time === t && e.group === 2).length;
    n1 -= c1;
    n2 -= c2;
  }

  const chiSquare = V > 0 ? Math.pow(O1 - E1, 2) / V : 0;
  const pValue = 1 - chiSquareCDF(chiSquare, 1);

  return { chiSquare, pValue, degreesOfFreedom: 1 };
}

/**
 * Calculate Cohen's d effect size
 */
export function cohensD(group1: number[], group2: number[]): {
  d: number;
  interpretation: 'negligible' | 'small' | 'medium' | 'large' | 'very large';
} {
  const n1 = group1.length;
  const n2 = group2.length;

  if (n1 === 0 || n2 === 0) {
    return { d: 0, interpretation: 'negligible' };
  }

  const mean1 = group1.reduce((s, v) => s + v, 0) / n1;
  const mean2 = group2.reduce((s, v) => s + v, 0) / n2;

  const var1 = group1.reduce((s, v) => s + Math.pow(v - mean1, 2), 0) / (n1 - 1);
  const var2 = group2.reduce((s, v) => s + Math.pow(v - mean2, 2), 0) / (n2 - 1);

  // Pooled standard deviation
  const pooledSD = Math.sqrt(((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2));
  const d = pooledSD > 0 ? (mean1 - mean2) / pooledSD : 0;

  // Interpret effect size (Cohen's conventions)
  let interpretation: 'negligible' | 'small' | 'medium' | 'large' | 'very large';
  const absD = Math.abs(d);
  if (absD < 0.2) interpretation = 'negligible';
  else if (absD < 0.5) interpretation = 'small';
  else if (absD < 0.8) interpretation = 'medium';
  else if (absD < 1.2) interpretation = 'large';
  else interpretation = 'very large';

  return { d, interpretation };
}

/**
 * Calculate Odds Ratio with confidence interval
 */
export function oddsRatioWithCI(
  exposedCases: number,
  exposedControls: number,
  unexposedCases: number,
  unexposedControls: number,
  confidenceLevel: number = 0.95
): {
  oddsRatio: number;
  lower: number;
  upper: number;
  pValue: number;
  significant: boolean;
} {
  // Add 0.5 continuity correction if any cell is 0
  const a = exposedCases || 0.5;
  const b = exposedControls || 0.5;
  const c = unexposedCases || 0.5;
  const d = unexposedControls || 0.5;

  const oddsRatio = (a * d) / (b * c);
  const logOR = Math.log(oddsRatio);

  // Standard error of log(OR)
  const se = Math.sqrt(1/a + 1/b + 1/c + 1/d);

  const z = getZScore(confidenceLevel);
  const lower = Math.exp(logOR - z * se);
  const upper = Math.exp(logOR + z * se);

  // Chi-square test for p-value
  const n = a + b + c + d;
  const expected = [(a+b)*(a+c)/n, (a+b)*(b+d)/n, (c+d)*(a+c)/n, (c+d)*(b+d)/n];
  const observed = [a, b, c, d];
  let chiSq = 0;
  for (let i = 0; i < 4; i++) {
    chiSq += Math.pow(observed[i] - expected[i], 2) / expected[i];
  }
  const pValue = 1 - chiSquareCDF(chiSq, 1);

  return {
    oddsRatio,
    lower,
    upper,
    pValue,
    significant: pValue < (1 - confidenceLevel),
  };
}

/**
 * Calculate Number Needed to Treat/Harm
 */
export function calculateNNT(
  rateExposed: number,
  rateUnexposed: number
): { nnt: number | null; type: 'NNT' | 'NNH'; interpretation: string } {
  const ard = rateExposed - rateUnexposed; // Absolute Risk Difference

  if (Math.abs(ard) < 0.0001) {
    return { nnt: null, type: 'NNT', interpretation: 'No difference between groups' };
  }

  const nnt = Math.abs(1 / ard);
  const type = ard > 0 ? 'NNH' : 'NNT'; // Harmful vs Beneficial

  let interpretation: string;
  if (type === 'NNH') {
    interpretation = `${Math.round(nnt)} patients need to be exposed for 1 additional adverse event`;
  } else {
    interpretation = `${Math.round(nnt)} patients need to be treated to prevent 1 adverse event`;
  }

  return { nnt, type, interpretation };
}

/**
 * Shapiro-Wilk Normality Test (simplified approximation)
 */
export function normalityTest(values: number[]): {
  isNormal: boolean;
  statistic: number;
  pValue: number;
  skewness: number;
  kurtosis: number;
  method: string;
} {
  const n = values.length;
  if (n < 3) {
    return { isNormal: true, statistic: 1, pValue: 1, skewness: 0, kurtosis: 0, method: 'Insufficient data' };
  }

  const mean = values.reduce((s, v) => s + v, 0) / n;
  const sd = Math.sqrt(values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1));

  // Calculate skewness
  const m3 = values.reduce((s, v) => s + Math.pow(v - mean, 3), 0) / n;
  const skewness = m3 / Math.pow(sd, 3);

  // Calculate kurtosis (excess)
  const m4 = values.reduce((s, v) => s + Math.pow(v - mean, 4), 0) / n;
  const kurtosis = m4 / Math.pow(sd, 4) - 3;

  // Simplified normality test using skewness and kurtosis
  // Normal distribution: skewness ≈ 0, kurtosis ≈ 0
  const skewZ = Math.abs(skewness) / Math.sqrt(6 / n);
  const kurtZ = Math.abs(kurtosis) / Math.sqrt(24 / n);

  // Combined test statistic (approximation)
  const statistic = Math.sqrt(skewZ * skewZ + kurtZ * kurtZ);
  const pValue = 2 * (1 - normalCDF(statistic));

  return {
    isNormal: pValue > 0.05,
    statistic,
    pValue,
    skewness,
    kurtosis,
    method: 'D\'Agostino-Pearson (approximation)'
  };
}

/**
 * Mann-Whitney U Test (non-parametric alternative to t-test)
 */
export function mannWhitneyU(group1: number[], group2: number[]): {
  uStatistic: number;
  pValue: number;
  effectSize: number;
} {
  const n1 = group1.length;
  const n2 = group2.length;

  if (n1 === 0 || n2 === 0) {
    return { uStatistic: 0, pValue: 1, effectSize: 0 };
  }

  // Calculate U statistic
  let u1 = 0;
  for (const x of group1) {
    for (const y of group2) {
      if (x > y) u1 += 1;
      else if (x === y) u1 += 0.5;
    }
  }

  const u2 = n1 * n2 - u1;
  const uStatistic = Math.min(u1, u2);

  // Normal approximation for p-value (for n > 20)
  const meanU = (n1 * n2) / 2;
  const sdU = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12);
  const z = (uStatistic - meanU) / sdU;
  const pValue = 2 * normalCDF(z);

  // Effect size (rank-biserial correlation)
  const effectSize = 1 - (2 * uStatistic) / (n1 * n2);

  return { uStatistic, pValue, effectSize };
}

/**
 * ANOVA (Analysis of Variance) for multiple groups
 */
export function oneWayAnova(groups: number[][]): {
  fStatistic: number;
  pValue: number;
  degreesOfFreedom: [number, number];
  etaSquared: number;
} {
  const k = groups.length; // Number of groups
  const n = groups.reduce((sum, g) => sum + g.length, 0); // Total sample size

  if (k < 2 || n === 0) {
    return { fStatistic: 0, pValue: 1, degreesOfFreedom: [0, 0], etaSquared: 0 };
  }

  // Grand mean
  const grandMean = groups.flat().reduce((s, v) => s + v, 0) / n;

  // Sum of squares between groups (SSB)
  let ssb = 0;
  for (const group of groups) {
    const groupMean = group.reduce((s, v) => s + v, 0) / group.length;
    ssb += group.length * Math.pow(groupMean - grandMean, 2);
  }

  // Sum of squares within groups (SSW)
  let ssw = 0;
  for (const group of groups) {
    const groupMean = group.reduce((s, v) => s + v, 0) / group.length;
    ssw += group.reduce((s, v) => s + Math.pow(v - groupMean, 2), 0);
  }

  const dfb = k - 1;
  const dfw = n - k;

  const msb = ssb / dfb;
  const msw = ssw / dfw;

  const fStatistic = msw > 0 ? msb / msw : 0;

  // Approximate p-value using F-distribution
  const pValue = 1 - fDistributionCDF(fStatistic, dfb, dfw);

  // Effect size (eta-squared)
  const sst = ssb + ssw;
  const etaSquared = sst > 0 ? ssb / sst : 0;

  return {
    fStatistic,
    pValue,
    degreesOfFreedom: [dfb, dfw],
    etaSquared,
  };
}

/**
 * F-distribution CDF approximation
 */
function fDistributionCDF(f: number, df1: number, df2: number): number {
  if (f <= 0) return 0;

  // Use normal approximation for large df
  if (df1 > 30 && df2 > 30) {
    const z = Math.sqrt(2 * f) - Math.sqrt(2 * df1 - 1);
    return normalCDF(z);
  }

  // Simplified approximation
  const x = df2 / (df2 + df1 * f);
  return 1 - Math.pow(x, df2 / 2);
}

/**
 * Calculate sample size requirements for t-test
 */
export function sampleSizeForTTest(
  effectSize: number,
  alpha: number = 0.05,
  power: number = 0.80,
  tails: 'one' | 'two' = 'two'
): { perGroup: number; total: number; assumptions: string } {
  const zAlpha = tails === 'two' ? getZScore(1 - alpha/2) : getZScore(1 - alpha);
  const zBeta = getZScore(power);

  // Sample size formula for two independent groups
  const n = Math.ceil(2 * Math.pow((zAlpha + zBeta) / effectSize, 2));

  return {
    perGroup: n,
    total: n * 2,
    assumptions: `Effect size (Cohen's d) = ${effectSize}, α = ${alpha}, power = ${power * 100}%`
  };
}

/**
 * Classify effect size for odds ratio
 */
export function classifyOddsRatioEffect(or: number): 'none' | 'small' | 'moderate' | 'large' | 'very large' {
  const absLogOR = Math.abs(Math.log(or));
  if (absLogOR < 0.1) return 'none';
  if (absLogOR < 0.4) return 'small';
  if (absLogOR < 0.9) return 'moderate';
  if (absLogOR < 1.4) return 'large';
  return 'very large';
}
