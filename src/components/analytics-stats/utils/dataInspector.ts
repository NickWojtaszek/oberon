// Data Inspector Utility
// Debug tool to inspect stored clinical data and identify structure issues

import type { ClinicalDataRecord } from '../../../utils/dataStorage';
import { getAllRecords } from '../../../utils/dataStorage';

/**
 * Inspect all stored records and generate comprehensive report
 */
export function inspectStoredData(): {
  totalRecords: number;
  allTableIds: string[];
  allFieldIds: string[];
  fieldIdsByTable: Record<string, string[]>;
  sampleValues: Record<string, any[]>;
  recordCompleteness: Array<{
    recordId: string;
    subjectId: string;
    totalFields: number;
    populatedFields: number;
    populationRate: number;
  }>;
} {
  console.group('🔬 DATA INSPECTOR - Analyzing stored records');

  const records = getAllRecords();
  console.log(`Total records in storage: ${records.length}`);

  if (records.length === 0) {
    console.warn('⚠️ No records found in storage!');
    console.groupEnd();
    return {
      totalRecords: 0,
      allTableIds: [],
      allFieldIds: [],
      fieldIdsByTable: {},
      sampleValues: {},
      recordCompleteness: [],
    };
  }

  // Collect all unique table and field IDs
  const allTableIds = new Set<string>();
  const allFieldIds = new Set<string>();
  const fieldIdsByTable: Record<string, Set<string>> = {};
  const sampleValues: Record<string, any[]> = {};

  // Analyze each record
  const recordCompleteness: Array<{
    recordId: string;
    subjectId: string;
    totalFields: number;
    populatedFields: number;
    populationRate: number;
  }> = [];

  for (const record of records) {
    let totalFields = 0;
    let populatedFields = 0;

    for (const [tableId, tableData] of Object.entries(record.data)) {
      allTableIds.add(tableId);

      if (!fieldIdsByTable[tableId]) {
        fieldIdsByTable[tableId] = new Set();
      }

      if (tableData) {
        for (const [fieldId, value] of Object.entries(tableData)) {
          totalFields++;
          allFieldIds.add(fieldId);
          fieldIdsByTable[tableId].add(fieldId);

          // Track populated fields
          if (value !== null && value !== undefined && value !== '') {
            populatedFields++;

            // Collect sample values (first 3 per field)
            if (!sampleValues[fieldId]) {
              sampleValues[fieldId] = [];
            }
            if (sampleValues[fieldId].length < 3) {
              sampleValues[fieldId].push(value);
            }
          }
        }
      }
    }

    recordCompleteness.push({
      recordId: record.recordId,
      subjectId: record.subjectId,
      totalFields,
      populatedFields,
      populationRate: totalFields > 0 ? (populatedFields / totalFields) * 100 : 0,
    });
  }

  // Convert Sets to sorted arrays
  const allTableIdsArray = Array.from(allTableIds).sort();
  const allFieldIdsArray = Array.from(allFieldIds).sort();
  const fieldIdsByTableObj: Record<string, string[]> = {};
  for (const [tableId, fieldIds] of Object.entries(fieldIdsByTable)) {
    fieldIdsByTableObj[tableId] = Array.from(fieldIds).sort();
  }

  // Print summary report
  console.log('\n📊 SUMMARY REPORT:');
  console.log(`Total records: ${records.length}`);
  console.log(`Total unique tables: ${allTableIdsArray.length}`);
  console.log(`Total unique fields: ${allFieldIdsArray.length}`);

  console.log('\n📁 Tables found:');
  for (const tableId of allTableIdsArray) {
    const fieldCount = fieldIdsByTableObj[tableId]?.length || 0;
    console.log(`  - ${tableId} (${fieldCount} fields)`);
  }

  console.log('\n🏷️ All field IDs across all tables:');
  for (const fieldId of allFieldIdsArray) {
    const samples = sampleValues[fieldId] || [];
    console.log(`  - ${fieldId}: [${samples.join(', ')}]`);
  }

  console.log('\n📋 Fields by table:');
  for (const [tableId, fieldIds] of Object.entries(fieldIdsByTableObj)) {
    console.log(`\n  Table: ${tableId}`);
    for (const fieldId of fieldIds) {
      const samples = sampleValues[fieldId] || [];
      console.log(`    - ${fieldId}: [${samples.slice(0, 2).join(', ')}${samples.length > 2 ? ', ...' : ''}]`);
    }
  }

  console.log('\n📈 Record Completeness:');
  const avgCompleteness =
    recordCompleteness.reduce((sum, r) => sum + r.populationRate, 0) / recordCompleteness.length;
  console.log(`  Average completeness: ${avgCompleteness.toFixed(1)}%`);
  console.log(`  Records by completeness:`);
  for (const rec of recordCompleteness) {
    const status = rec.populationRate >= 80 ? '✅' : rec.populationRate >= 50 ? '⚠️' : '❌';
    console.log(
      `    ${status} ${rec.subjectId}: ${rec.populatedFields}/${rec.totalFields} (${rec.populationRate.toFixed(1)}%)`
    );
  }

  console.groupEnd();

  return {
    totalRecords: records.length,
    allTableIds: allTableIdsArray,
    allFieldIds: allFieldIdsArray,
    fieldIdsByTable: fieldIdsByTableObj,
    sampleValues,
    recordCompleteness,
  };
}

/**
 * Check if a specific variable ID exists in stored data
 */
export function checkVariableExists(variableId: string): {
  exists: boolean;
  exactMatch: boolean;
  foundInTables: string[];
  fuzzyMatches: string[];
  suggestion: string | null;
} {
  console.group(`🔎 Checking variable: ${variableId}`);

  const records = getAllRecords();
  const foundInTables: string[] = [];
  const allFieldIds = new Set<string>();

  // Check for exact matches
  for (const record of records) {
    for (const [tableId, tableData] of Object.entries(record.data)) {
      if (tableData) {
        for (const fieldId of Object.keys(tableData)) {
          allFieldIds.add(fieldId);
          if (fieldId === variableId) {
            foundInTables.push(tableId);
          }
        }
      }
    }
  }

  const exactMatch = foundInTables.length > 0;

  // If no exact match, look for fuzzy matches
  const fuzzyMatches: string[] = [];
  if (!exactMatch) {
    const variableIdLower = variableId.toLowerCase();
    const variableIdNormalized = variableId.replace(/[_-]/g, '');

    for (const fieldId of allFieldIds) {
      const fieldIdLower = fieldId.toLowerCase();
      const fieldIdNormalized = fieldId.replace(/[_-]/g, '');

      if (
        fieldIdLower.includes(variableIdLower) ||
        variableIdLower.includes(fieldIdLower) ||
        fieldIdNormalized.includes(variableIdNormalized.toLowerCase()) ||
        variableIdNormalized.toLowerCase().includes(fieldIdNormalized)
      ) {
        fuzzyMatches.push(fieldId);
      }
    }
  }

  const suggestion = exactMatch
    ? null
    : fuzzyMatches.length > 0
    ? fuzzyMatches[0]
    : null;

  console.log(`Exact match: ${exactMatch ? '✅' : '❌'}`);
  if (exactMatch) {
    console.log(`Found in tables: [${foundInTables.join(', ')}]`);
  } else {
    console.log(`Fuzzy matches: [${fuzzyMatches.join(', ')}]`);
    if (suggestion) {
      console.log(`💡 Suggested mapping: "${variableId}" → "${suggestion}"`);
    }
  }

  console.groupEnd();

  return {
    exists: exactMatch,
    exactMatch,
    foundInTables: [...new Set(foundInTables)],
    fuzzyMatches,
    suggestion,
  };
}

/**
 * Generate a variable ID mapping report
 */
export function generateVariableIdMappingReport(requestedVariableIds: string[]): {
  exactMatches: string[];
  missingWithSuggestions: Array<{ requested: string; suggested: string }>;
  missingNoSuggestions: string[];
} {
  console.group('🗺️ VARIABLE ID MAPPING REPORT');
  console.log(`Checking ${requestedVariableIds.length} variable IDs...`);

  const exactMatches: string[] = [];
  const missingWithSuggestions: Array<{ requested: string; suggested: string }> = [];
  const missingNoSuggestions: string[] = [];

  for (const varId of requestedVariableIds) {
    const check = checkVariableExists(varId);
    if (check.exactMatch) {
      exactMatches.push(varId);
    } else if (check.suggestion) {
      missingWithSuggestions.push({ requested: varId, suggested: check.suggestion });
    } else {
      missingNoSuggestions.push(varId);
    }
  }

  console.log('\n✅ Exact matches:', exactMatches.length);
  console.log('🔧 Missing with suggestions:', missingWithSuggestions.length);
  console.log('❌ Missing with no suggestions:', missingNoSuggestions.length);

  if (missingWithSuggestions.length > 0) {
    console.log('\n💡 Suggested mappings:');
    for (const { requested, suggested } of missingWithSuggestions) {
      console.log(`  "${requested}" → "${suggested}"`);
    }
  }

  if (missingNoSuggestions.length > 0) {
    console.log('\n❌ Variables not found in data:');
    for (const varId of missingNoSuggestions) {
      console.log(`  - ${varId}`);
    }
  }

  console.groupEnd();

  return {
    exactMatches,
    missingWithSuggestions,
    missingNoSuggestions,
  };
}

// Export to window for easy console access
if (typeof window !== 'undefined') {
  (window as any).inspectStoredData = inspectStoredData;
  (window as any).checkVariableExists = checkVariableExists;
  (window as any).generateVariableIdMappingReport = generateVariableIdMappingReport;
  console.log('💡 Data inspector available in console:');
  console.log('  - window.inspectStoredData()');
  console.log('  - window.checkVariableExists("variable_id")');
  console.log('  - window.generateVariableIdMappingReport(["id1", "id2"])');
}
