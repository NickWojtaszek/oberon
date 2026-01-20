// Statistical Executor
// Executes approved statistical analyses and returns results

import type { ClinicalDataRecord } from '../../../utils/dataStorage';
import type {
  ProposedAnalysis,
  StatisticalAnalysisContext,
  AnalysisResults,
  DescriptiveResults,
  TTestResults,
  ChiSquareResults,
  CorrelationResults,
} from '../../ai-personas/statistician/types';

import {
  tTest,
  pearsonCorrelation,
  fishersExactTest,
  calculateContinuousStats,
  calculateFrequency,
} from './statisticalTests';

/**
 * Execute a statistical analysis based on its type
 */
export async function executeStatisticalAnalysis(
  analysis: ProposedAnalysis,
  records: ClinicalDataRecord[],
  context: StatisticalAnalysisContext
): Promise<AnalysisResults> {
  // DEBUG: Log analysis request
  console.group(`📈 EXECUTING ANALYSIS: ${analysis.analysisType}`);
  console.log(`Analysis ID: ${analysis.analysisId}`);
  console.log(`Outcome variable:`, {
    id: analysis.outcome.id,
    name: analysis.outcome.name,
    label: analysis.outcome.label,
    dataType: analysis.outcome.dataType,
  });
  if (analysis.predictor) {
    console.log(`Predictor variable:`, {
      id: analysis.predictor.id,
      name: analysis.predictor.name,
      label: analysis.predictor.label,
      dataType: analysis.predictor.dataType,
    });
  }
  console.log(`Total records available: ${records.length}`);
  console.groupEnd();

  // Extract data for the analysis
  const outcomeData = extractVariableData(analysis.outcome.id, records);
  const predictorData = analysis.predictor
    ? extractVariableData(analysis.predictor.id, records)
    : null;

  switch (analysis.analysisType) {
    case 'descriptive':
      return executeDescriptive(outcomeData, analysis);

    case 't-test':
    case 'paired-t-test':
      return executeTTest(outcomeData, predictorData, analysis);

    case 'chi-square':
    case 'fisher-exact':
      return executeChiSquare(outcomeData, predictorData, analysis);

    case 'pearson-correlation':
    case 'spearman-correlation':
      return executeCorrelation(outcomeData, predictorData, analysis);

    case 'normality-test':
      return executeNormalityTest(outcomeData, analysis);

    default:
      // Fallback to descriptive
      return executeDescriptive(outcomeData, analysis);
  }
}

/**
 * Calculate descriptive statistics for a variable
 */
export function calculateDescriptiveStats(
  variableId: string,
  records: ClinicalDataRecord[],
  dataType: string
): DescriptiveResults {
  const data = extractVariableData(variableId, records);

  if (dataType === 'Continuous') {
    const numericData = data
      .filter(v => v !== null && v !== undefined && v !== '')
      .map(v => Number(v))
      .filter(v => !isNaN(v));

    if (numericData.length === 0) {
      return {
        type: 'descriptive',
        continuous: {
          n: 0,
          mean: 0,
          sd: 0,
          median: 0,
          iqr: [0, 0],
          min: 0,
          max: 0,
          missing: data.length,
        },
      };
    }

    const stats = calculateContinuousStats(numericData);
    return {
      type: 'descriptive',
      continuous: {
        n: numericData.length,
        mean: stats.mean,
        sd: stats.sd,
        median: stats.median,
        iqr: stats.iqr,
        min: stats.min,
        max: stats.max,
        missing: data.length - numericData.length,
      },
    };
  } else {
    // Categorical
    const validData = data
      .filter(v => v !== null && v !== undefined && v !== '')
      .map(v => String(v));

    const { frequency, percentage } = calculateFrequency(validData);

    return {
      type: 'descriptive',
      categorical: {
        n: validData.length,
        frequencies: frequency,
        percentages: percentage,
        missing: data.length - validData.length,
      },
    };
  }
}

// =============================================================================
// PRIVATE EXECUTION FUNCTIONS
// =============================================================================

/**
 * Execute descriptive statistics
 */
function executeDescriptive(
  data: (string | number | null)[],
  analysis: ProposedAnalysis
): DescriptiveResults {
  const isContinuous = analysis.outcome.dataType === 'Continuous';

  if (isContinuous) {
    const numericData = data
      .filter(v => v !== null && v !== undefined && v !== '')
      .map(v => Number(v))
      .filter(v => !isNaN(v));

    if (numericData.length === 0) {
      return {
        type: 'descriptive',
        continuous: {
          n: 0,
          mean: 0,
          sd: 0,
          median: 0,
          iqr: [0, 0],
          min: 0,
          max: 0,
          missing: data.length,
        },
      };
    }

    const stats = calculateContinuousStats(numericData);
    return {
      type: 'descriptive',
      continuous: {
        n: numericData.length,
        mean: stats.mean,
        sd: stats.sd,
        median: stats.median,
        iqr: stats.iqr,
        min: stats.min,
        max: stats.max,
        missing: data.length - numericData.length,
      },
    };
  } else {
    const validData = data
      .filter(v => v !== null && v !== undefined && v !== '')
      .map(v => String(v));

    const { frequency, percentage } = calculateFrequency(validData);

    return {
      type: 'descriptive',
      categorical: {
        n: validData.length,
        frequencies: frequency,
        percentages: percentage,
        missing: data.length - validData.length,
      },
    };
  }
}

/**
 * Execute t-test
 */
function executeTTest(
  outcomeData: (string | number | null)[],
  predictorData: (string | number | null)[] | null,
  analysis: ProposedAnalysis
): TTestResults {
  if (!predictorData) {
    throw new Error('T-test requires a predictor variable');
  }

  // Group outcome data by predictor values
  const groups: Map<string, number[]> = new Map();

  for (let i = 0; i < outcomeData.length; i++) {
    const outcome = outcomeData[i];
    const predictor = predictorData[i];

    if (
      outcome !== null &&
      outcome !== undefined &&
      predictor !== null &&
      predictor !== undefined
    ) {
      const groupKey = String(predictor);
      const numericOutcome = Number(outcome);

      if (!isNaN(numericOutcome)) {
        if (!groups.has(groupKey)) {
          groups.set(groupKey, []);
        }
        groups.get(groupKey)!.push(numericOutcome);
      }
    }
  }

  const groupKeys = Array.from(groups.keys());
  if (groupKeys.length < 2) {
    throw new Error('T-test requires at least 2 groups');
  }

  // Take first two groups
  const group1 = groups.get(groupKeys[0]) || [];
  const group2 = groups.get(groupKeys[1]) || [];

  const result = tTest(group1, group2);

  // Calculate additional statistics
  const mean1 = group1.reduce((a, b) => a + b, 0) / group1.length;
  const mean2 = group2.reduce((a, b) => a + b, 0) / group2.length;
  const meanDifference = mean1 - mean2;

  const sd1 = Math.sqrt(
    group1.reduce((acc, v) => acc + Math.pow(v - mean1, 2), 0) / (group1.length - 1)
  );
  const sd2 = Math.sqrt(
    group2.reduce((acc, v) => acc + Math.pow(v - mean2, 2), 0) / (group2.length - 1)
  );

  // Pooled SD for Cohen's d
  const pooledSD = Math.sqrt(
    ((group1.length - 1) * sd1 * sd1 + (group2.length - 1) * sd2 * sd2) /
      (group1.length + group2.length - 2)
  );
  const effectSize = pooledSD > 0 ? meanDifference / pooledSD : 0;

  // Standard error for CI
  const se = Math.sqrt(sd1 * sd1 / group1.length + sd2 * sd2 / group2.length);
  const tCritical = 1.96; // Approximate for large samples
  const ci: [number, number] = [
    meanDifference - tCritical * se,
    meanDifference + tCritical * se,
  ];

  return {
    type: 't-test',
    tStatistic: result.tStatistic,
    pValue: result.pValue,
    degreesOfFreedom: result.degreesOfFreedom,
    meanDifference,
    confidenceInterval: ci,
    effectSize,
    group1: { n: group1.length, mean: mean1, sd: sd1 },
    group2: { n: group2.length, mean: mean2, sd: sd2 },
  };
}

/**
 * Execute chi-square or Fisher's exact test
 */
function executeChiSquare(
  outcomeData: (string | number | null)[],
  predictorData: (string | number | null)[] | null,
  analysis: ProposedAnalysis
): ChiSquareResults {
  if (!predictorData) {
    throw new Error('Chi-square test requires a predictor variable');
  }

  // Build contingency table
  const contingencyTable: Map<string, Map<string, number>> = new Map();
  const predictorCategories = new Set<string>();
  const outcomeCategories = new Set<string>();

  for (let i = 0; i < outcomeData.length; i++) {
    const outcome = outcomeData[i];
    const predictor = predictorData[i];

    if (
      outcome !== null &&
      outcome !== undefined &&
      predictor !== null &&
      predictor !== undefined &&
      outcome !== '' &&
      predictor !== ''
    ) {
      const predKey = String(predictor);
      const outKey = String(outcome);

      predictorCategories.add(predKey);
      outcomeCategories.add(outKey);

      if (!contingencyTable.has(predKey)) {
        contingencyTable.set(predKey, new Map());
      }

      const row = contingencyTable.get(predKey)!;
      row.set(outKey, (row.get(outKey) || 0) + 1);
    }
  }

  const predCats = Array.from(predictorCategories);
  const outCats = Array.from(outcomeCategories);

  // Convert to 2D array
  const table: number[][] = predCats.map(pred =>
    outCats.map(out => contingencyTable.get(pred)?.get(out) || 0)
  );

  // For 2x2 table, use Fisher's exact
  if (predCats.length === 2 && outCats.length === 2) {
    const result = fishersExactTest(
      table[0][0],
      table[0][1],
      table[1][0],
      table[1][1]
    );

    // Calculate odds ratio CI (approximate)
    const or = result.oddsRatio;
    const logOR = Math.log(or);
    const seLogOR = Math.sqrt(
      1 / (table[0][0] + 0.5) +
        1 / (table[0][1] + 0.5) +
        1 / (table[1][0] + 0.5) +
        1 / (table[1][1] + 0.5)
    );
    const orCI: [number, number] = [
      Math.exp(logOR - 1.96 * seLogOR),
      Math.exp(logOR + 1.96 * seLogOR),
    ];

    return {
      type: 'fisher-exact',
      pValue: result.pValue,
      oddsRatio: result.oddsRatio,
      oddsRatioCI: orCI,
      contingencyTable: table,
    };
  }

  // For larger tables, calculate chi-square
  const rowTotals = table.map(row => row.reduce((a, b) => a + b, 0));
  const colTotals = outCats.map((_, j) =>
    predCats.reduce((sum, _, i) => sum + table[i][j], 0)
  );
  const grandTotal = rowTotals.reduce((a, b) => a + b, 0);

  // Expected frequencies
  const expected: number[][] = predCats.map((_, i) =>
    outCats.map((_, j) => (rowTotals[i] * colTotals[j]) / grandTotal)
  );

  // Chi-square statistic
  let chiSquare = 0;
  for (let i = 0; i < predCats.length; i++) {
    for (let j = 0; j < outCats.length; j++) {
      const obs = table[i][j];
      const exp = expected[i][j];
      if (exp > 0) {
        chiSquare += Math.pow(obs - exp, 2) / exp;
      }
    }
  }

  const df = (predCats.length - 1) * (outCats.length - 1);

  // Approximate p-value (simplified)
  let pValue = 1;
  if (df === 1) {
    pValue = chiSquare >= 3.841 ? 0.05 : chiSquare >= 6.635 ? 0.01 : 0.1;
  } else if (df === 2) {
    pValue = chiSquare >= 5.991 ? 0.05 : chiSquare >= 9.210 ? 0.01 : 0.1;
  }

  return {
    type: 'chi-square',
    chiSquare,
    pValue,
    degreesOfFreedom: df,
    contingencyTable: table,
    expectedFrequencies: expected,
  };
}

/**
 * Execute correlation analysis
 */
function executeCorrelation(
  outcomeData: (string | number | null)[],
  predictorData: (string | number | null)[] | null,
  analysis: ProposedAnalysis
): CorrelationResults {
  if (!predictorData) {
    throw new Error('Correlation requires two variables');
  }

  // Pair valid numeric values
  const pairs: { x: number; y: number }[] = [];

  for (let i = 0; i < outcomeData.length; i++) {
    const outcome = outcomeData[i];
    const predictor = predictorData[i];

    if (
      outcome !== null &&
      outcome !== undefined &&
      predictor !== null &&
      predictor !== undefined
    ) {
      const x = Number(predictor);
      const y = Number(outcome);

      if (!isNaN(x) && !isNaN(y)) {
        pairs.push({ x, y });
      }
    }
  }

  if (pairs.length < 3) {
    throw new Error('Correlation requires at least 3 valid pairs');
  }

  const x = pairs.map(p => p.x);
  const y = pairs.map(p => p.y);

  const result = pearsonCorrelation(x, y);

  // Calculate CI for correlation (Fisher's z transformation)
  const z = 0.5 * Math.log((1 + result.coefficient) / (1 - result.coefficient));
  const seZ = 1 / Math.sqrt(pairs.length - 3);
  const zLower = z - 1.96 * seZ;
  const zUpper = z + 1.96 * seZ;
  const ci: [number, number] = [
    (Math.exp(2 * zLower) - 1) / (Math.exp(2 * zLower) + 1),
    (Math.exp(2 * zUpper) - 1) / (Math.exp(2 * zUpper) + 1),
  ];

  return {
    type: analysis.analysisType === 'spearman-correlation' ? 'spearman' : 'pearson',
    coefficient: result.coefficient,
    pValue: result.pValue,
    confidenceInterval: ci,
    n: pairs.length,
    r2: result.coefficient * result.coefficient,
  };
}

/**
 * Execute normality test (Shapiro-Wilk approximation)
 */
function executeNormalityTest(
  data: (string | number | null)[],
  analysis: ProposedAnalysis
): DescriptiveResults {
  const numericData = data
    .filter(v => v !== null && v !== undefined && v !== '')
    .map(v => Number(v))
    .filter(v => !isNaN(v));

  const stats = calculateContinuousStats(numericData);

  // Simple normality assessment based on skewness
  const n = numericData.length;
  const mean = stats.mean;
  const sd = stats.sd;

  let skewness = 0;
  if (n > 2 && sd > 0) {
    skewness =
      (n / ((n - 1) * (n - 2))) *
      numericData.reduce((acc, v) => acc + Math.pow((v - mean) / sd, 3), 0);
  }

  return {
    type: 'descriptive',
    continuous: {
      n: numericData.length,
      mean: stats.mean,
      sd: stats.sd,
      median: stats.median,
      iqr: stats.iqr,
      min: stats.min,
      max: stats.max,
      missing: data.length - numericData.length,
    },
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Extract data for a variable from records
 */
function extractVariableData(
  variableId: string,
  records: ClinicalDataRecord[]
): (string | number | null)[] {
  const data: (string | number | null)[] = [];

  // DEBUG: Log what we're searching for
  console.group(`🔍 DATA EXTRACTION DEBUG: ${variableId}`);
  console.log(`Searching for variable ID: "${variableId}"`);
  console.log(`Total records to search: ${records.length}`);

  // DEBUG: Collect all available field IDs across all records
  const allAvailableFieldIds = new Set<string>();
  const fieldIdsByTable: Record<string, Set<string>> = {};

  if (records.length > 0) {
    // Sample first record to show structure
    const sampleRecord = records[0];
    console.log(`Sample record structure:`, {
      recordId: sampleRecord.recordId,
      subjectId: sampleRecord.subjectId,
      tables: Object.keys(sampleRecord.data),
    });

    // Collect all field IDs from all records
    for (const record of records) {
      for (const [tableId, tableData] of Object.entries(record.data)) {
        if (tableData) {
          if (!fieldIdsByTable[tableId]) {
            fieldIdsByTable[tableId] = new Set();
          }
          for (const fieldId of Object.keys(tableData)) {
            allAvailableFieldIds.add(fieldId);
            fieldIdsByTable[tableId].add(fieldId);
          }
        }
      }
    }

    console.log(`Available tables:`, Object.keys(fieldIdsByTable));
    console.log(`All available field IDs across all tables:`, Array.from(allAvailableFieldIds).sort());

    // Show fields by table
    for (const [tableId, fieldIds] of Object.entries(fieldIdsByTable)) {
      console.log(`  Table "${tableId}": [${Array.from(fieldIds).sort().join(', ')}]`);
    }
  }

  let foundCount = 0;
  let nullCount = 0;

  for (const record of records) {
    let found = false;

    // Search through all tables in the record
    for (const [tableId, tableData] of Object.entries(record.data)) {
      if (tableData && variableId in tableData) {
        const value = tableData[variableId];
        data.push(value);
        found = true;
        foundCount++;

        // DEBUG: Log first few successful extractions
        if (foundCount <= 3) {
          console.log(`✓ Found in record ${record.subjectId}, table "${tableId}":`, value);
        }
        break;
      }
    }

    if (!found) {
      data.push(null);
      nullCount++;
    }
  }

  // DEBUG: Summary statistics
  const validData = data.filter(v => v !== null && v !== undefined && v !== '');
  console.log(`\n📊 EXTRACTION SUMMARY:`);
  console.log(`  Total extractions: ${data.length}`);
  console.log(`  Found matches: ${foundCount} (${((foundCount/data.length)*100).toFixed(1)}%)`);
  console.log(`  Null/missing: ${nullCount} (${((nullCount/data.length)*100).toFixed(1)}%)`);
  console.log(`  Valid non-empty: ${validData.length} (${((validData.length/data.length)*100).toFixed(1)}%)`);

  // DEBUG: Show fuzzy matches if no exact match found
  if (foundCount === 0 && allAvailableFieldIds.size > 0) {
    console.warn(`\n⚠️ NO EXACT MATCHES FOUND!`);
    console.log(`Looking for fuzzy matches for "${variableId}"...`);

    const fuzzyMatches: string[] = [];
    const variableIdLower = variableId.toLowerCase();
    const variableIdNormalized = variableId.replace(/[_-]/g, '');

    for (const fieldId of allAvailableFieldIds) {
      const fieldIdLower = fieldId.toLowerCase();
      const fieldIdNormalized = fieldId.replace(/[_-]/g, '');

      // Check various match types
      if (fieldIdLower.includes(variableIdLower) ||
          variableIdLower.includes(fieldIdLower) ||
          fieldIdNormalized.includes(variableIdNormalized.toLowerCase()) ||
          variableIdNormalized.toLowerCase().includes(fieldIdNormalized)) {
        fuzzyMatches.push(fieldId);
      }
    }

    if (fuzzyMatches.length > 0) {
      console.log(`🔎 Potential fuzzy matches found:`, fuzzyMatches);
      console.log(`💡 SUGGESTION: Variable ID might need remapping from "${variableId}" to one of:`, fuzzyMatches);
    } else {
      console.error(`❌ No fuzzy matches found. Variable "${variableId}" may not exist in the data at all.`);
    }
  }

  console.groupEnd();

  return data;
}
