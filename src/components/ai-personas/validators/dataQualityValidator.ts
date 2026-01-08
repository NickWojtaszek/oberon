// Data Quality Sentinel - Real-time Data Validation Rules

import type { ValidationRule, ValidationIssue, ValidationContext } from '../core/personaTypes';

// Helper function to create issues
function createIssue(
  id: string,
  severity: 'critical' | 'warning' | 'info',
  title: string,
  description: string,
  recommendation: string,
  field?: string,
  recordId?: string
): ValidationIssue {
  return {
    id,
    personaId: 'data-quality-sentinel',
    severity,
    category: 'data-quality',
    title,
    description,
    recommendation,
    location: {
      module: 'database',
      tab: 'data-entry',
      field,
      recordId
    },
    autoFixAvailable: false,
    studyTypeSpecific: false
  };
}

// ============================================================================
// RANGE VALIDATION RULES
// ============================================================================

export const AGE_RANGE_VALIDATION: ValidationRule = {
  id: 'age-range-validation',
  name: 'Age Range Validation',
  personaId: 'data-quality-sentinel',
  category: 'data-quality',
  severity: 'warning',
  description: 'Age values should be within realistic human ranges (0-120 years)',
  check: (context: ValidationContext): ValidationIssue[] => {
    const records = context.dataRecords || [];
    const issues: ValidationIssue[] = [];

    records.forEach(record => {
      Object.entries(record).forEach(([fieldName, value]) => {
        // Check if field is age-related
        const isAgeField = fieldName.toLowerCase().includes('age');
        
        if (isAgeField && typeof value === 'number') {
          if (value < 0) {
            issues.push(createIssue(
              `age-negative-${record.id}-${fieldName}`,
              'critical',
              'Negative Age Value',
              `Field "${fieldName}" has a negative value: ${value}`,
              'Age cannot be negative. Check for data entry error or use null for missing values.',
              fieldName,
              record.id
            ));
          } else if (value > 120) {
            issues.push(createIssue(
              `age-high-${record.id}-${fieldName}`,
              'warning',
              'Unusually High Age',
              `Field "${fieldName}" has value ${value}, which exceeds typical human lifespan`,
              'Verify this age is correct. Typical range: 0-120 years.',
              fieldName,
              record.id
            ));
          }
        }
      });
    });

    return issues;
  }
};

export const DATE_LOGICAL_ORDER: ValidationRule = {
  id: 'date-logical-order',
  name: 'Date Logical Order Validation',
  personaId: 'data-quality-sentinel',
  category: 'data-quality',
  severity: 'critical',
  description: 'End dates must occur after start dates',
  check: (context: ValidationContext): ValidationIssue[] => {
    const records = context.dataRecords || [];
    const issues: ValidationIssue[] = [];

    records.forEach(record => {
      const dateFields = Object.entries(record)
        .filter(([key]) => 
          key.toLowerCase().includes('date') || 
          key.toLowerCase().includes('_dt') ||
          key.toLowerCase().includes('time')
        )
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, any>);

      // Look for start/end date pairs
      Object.keys(dateFields).forEach(startKey => {
        if (startKey.toLowerCase().includes('start') || 
            startKey.toLowerCase().includes('begin') ||
            startKey.toLowerCase().includes('enrollment')) {
          
          // Find corresponding end date
          const endKeys = Object.keys(dateFields).filter(k => 
            (k.toLowerCase().includes('end') || 
             k.toLowerCase().includes('complete') ||
             k.toLowerCase().includes('discharge')) &&
            k !== startKey
          );

          endKeys.forEach(endKey => {
            const startDate = new Date(dateFields[startKey]);
            const endDate = new Date(dateFields[endKey]);

            if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
              if (endDate < startDate) {
                issues.push(createIssue(
                  `date-order-${record.id}-${startKey}-${endKey}`,
                  'critical',
                  'Invalid Date Order',
                  `"${endKey}" (${endDate.toLocaleDateString()}) occurs before "${startKey}" (${startDate.toLocaleDateString()})`,
                  `End date must be after start date. Check for data entry error or swapped values.`,
                  endKey,
                  record.id
                ));
              }
            }
          });
        }
      });
    });

    return issues;
  }
};

// ============================================================================
// MISSING DATA VALIDATION
// ============================================================================

export const REQUIRED_FIELD_VALIDATION: ValidationRule = {
  id: 'required-field-validation',
  name: 'Required Field Validation',
  personaId: 'data-quality-sentinel',
  category: 'data-quality',
  severity: 'critical',
  description: 'Critical fields must not be empty',
  check: (context: ValidationContext): ValidationIssue[] => {
    const records = context.dataRecords || [];
    const schema = context.schemaBlocks || [];
    const issues: ValidationIssue[] = [];

    // Get required fields from schema
    const requiredFields = schema
      .filter(block => block.required === true)
      .map(block => block.name);

    if (requiredFields.length === 0) return issues;

    records.forEach(record => {
      requiredFields.forEach(fieldName => {
        const value = record[fieldName];
        
        if (value === null || value === undefined || value === '') {
          issues.push(createIssue(
            `required-missing-${record.id}-${fieldName}`,
            'critical',
            'Missing Required Field',
            `Required field "${fieldName}" is empty in record ${record.id}`,
            `This field is marked as required in the protocol schema. Enter a valid value or mark as "Not Applicable" if appropriate.`,
            fieldName,
            record.id
          ));
        }
      });
    });

    return issues;
  }
};

export const EXCESSIVE_MISSING_DATA: ValidationRule = {
  id: 'excessive-missing-data',
  name: 'Excessive Missing Data Detection',
  personaId: 'data-quality-sentinel',
  category: 'data-quality',
  severity: 'warning',
  description: 'Flag records with high percentage of missing data',
  check: (context: ValidationContext): ValidationIssue[] => {
    const records = context.dataRecords || [];
    const issues: ValidationIssue[] = [];
    const MISSING_THRESHOLD = 0.5; // 50% or more missing

    records.forEach(record => {
      const totalFields = Object.keys(record).length;
      if (totalFields === 0) return;

      const missingFields = Object.values(record).filter(
        v => v === null || v === undefined || v === ''
      ).length;

      const missingPercentage = missingFields / totalFields;

      if (missingPercentage >= MISSING_THRESHOLD) {
        issues.push(createIssue(
          `excessive-missing-${record.id}`,
          'warning',
          'High Missing Data Rate',
          `Record ${record.id} has ${Math.round(missingPercentage * 100)}% missing data (${missingFields}/${totalFields} fields)`,
          `Review this record for completeness. High missing data can impact analysis validity. Consider marking as "Incomplete" if data collection is ongoing.`,
          undefined,
          record.id
        ));
      }
    });

    return issues;
  }
};

// ============================================================================
// CATEGORICAL VALUE VALIDATION
// ============================================================================

export const CATEGORICAL_VALUE_VALIDATION: ValidationRule = {
  id: 'categorical-value-validation',
  name: 'Categorical Value Validation',
  personaId: 'data-quality-sentinel',
  category: 'data-quality',
  severity: 'critical',
  description: 'Categorical fields must match predefined options',
  check: (context: ValidationContext): ValidationIssue[] => {
    const records = context.dataRecords || [];
    const schema = context.schemaBlocks || [];
    const issues: ValidationIssue[] = [];

    // Get categorical fields with their allowed values
    const categoricalFields = schema
      .filter(block => block.dataType === 'Categorical' && block.options)
      .map(block => ({
        name: block.name,
        options: block.options || []
      }));

    if (categoricalFields.length === 0) return issues;

    records.forEach(record => {
      categoricalFields.forEach(field => {
        const value = record[field.name];
        
        if (value && !field.options.includes(value)) {
          issues.push(createIssue(
            `categorical-invalid-${record.id}-${field.name}`,
            'critical',
            'Invalid Categorical Value',
            `Field "${field.name}" has value "${value}" which is not in allowed options: [${field.options.join(', ')}]`,
            `Select one of the predefined options. If this value should be allowed, update the schema to include it.`,
            field.name,
            record.id
          ));
        }
      });
    });

    return issues;
  }
};

// ============================================================================
// STUDY-TYPE-SPECIFIC VALIDATION
// ============================================================================

export const RCT_RANDOMIZATION_COMPLETENESS: ValidationRule = {
  id: 'rct-randomization-completeness',
  name: 'RCT: Randomization Completeness',
  personaId: 'data-quality-sentinel',
  category: 'data-quality',
  severity: 'warning',
  description: 'All RCT participants should have randomization assignment recorded',
  applicableStudyTypes: ['rct'],
  check: (context: ValidationContext): ValidationIssue[] => {
    const records = context.dataRecords || [];
    const issues: ValidationIssue[] = [];

    records.forEach(record => {
      // Look for randomization/treatment arm fields
      const randomizationFields = Object.keys(record).filter(key =>
        key.toLowerCase().includes('random') ||
        key.toLowerCase().includes('treatment') ||
        key.toLowerCase().includes('arm')
      );

      if (randomizationFields.length === 0) return;

      randomizationFields.forEach(field => {
        const value = record[field];
        
        if (!value || value === '') {
          issues.push(createIssue(
            `randomization-missing-${record.id}-${field}`,
            'warning',
            'Missing Randomization Assignment',
            `Randomization field "${field}" is empty for participant ${record.id}`,
            `In RCTs, all enrolled participants should have a randomization assignment. If randomization has not occurred, mark as "Pending" or "Not Yet Randomized".`,
            field,
            record.id
          ));
        }
      });
    });

    return issues;
  }
};

export const OBSERVATIONAL_EXPOSURE_DOCUMENTATION: ValidationRule = {
  id: 'observational-exposure-documentation',
  name: 'Observational: Exposure Documentation',
  personaId: 'data-quality-sentinel',
  category: 'data-quality',
  severity: 'warning',
  description: 'Primary exposure must be documented for all observational study participants',
  applicableStudyTypes: ['observational'],
  check: (context: ValidationContext): ValidationIssue[] => {
    const records = context.dataRecords || [];
    const issues: ValidationIssue[] = [];

    records.forEach(record => {
      // Look for exposure fields
      const exposureFields = Object.keys(record).filter(key =>
        key.toLowerCase().includes('exposure') ||
        key.toLowerCase().includes('predictor')
      );

      if (exposureFields.length === 0) return;

      exposureFields.forEach(field => {
        const value = record[field];
        
        if (value === null || value === undefined || value === '') {
          issues.push(createIssue(
            `exposure-missing-${record.id}-${field}`,
            'warning',
            'Missing Exposure Data',
            `Primary exposure field "${field}" is empty for participant ${record.id}`,
            `Exposure status is critical for observational studies. Ensure exposure is documented before analysis. If unknown, mark as "Unknown" rather than leaving blank.`,
            field,
            record.id
          ));
        }
      });
    });

    return issues;
  }
};

// ============================================================================
// DATA CONSISTENCY RULES
// ============================================================================

export const DUPLICATE_RECORD_DETECTION: ValidationRule = {
  id: 'duplicate-record-detection',
  name: 'Duplicate Record Detection',
  personaId: 'data-quality-sentinel',
  category: 'data-quality',
  severity: 'critical',
  description: 'Detect potential duplicate participant records',
  check: (context: ValidationContext): ValidationIssue[] => {
    const records = context.dataRecords || [];
    const issues: ValidationIssue[] = [];

    // Group by Subject ID or similar identifier
    const idFields = ['subject_id', 'participant_id', 'patient_id', 'subjectid', 'id'];
    
    const recordsBySubject = new Map<string, any[]>();

    records.forEach(record => {
      // Find the ID field
      const idField = idFields.find(f => record[f]);
      if (!idField) return;

      const subjectId = record[idField];
      if (!recordsBySubject.has(subjectId)) {
        recordsBySubject.set(subjectId, []);
      }
      recordsBySubject.get(subjectId)!.push(record);
    });

    // Check for duplicates
    recordsBySubject.forEach((records, subjectId) => {
      if (records.length > 1) {
        issues.push(createIssue(
          `duplicate-${subjectId}`,
          'critical',
          'Potential Duplicate Records',
          `Subject ID "${subjectId}" appears in ${records.length} records`,
          `Review these records to determine if they are true duplicates or represent different visits/timepoints. If duplicates, merge or delete as appropriate.`
        ));
      }
    });

    return issues;
  }
};

// ============================================================================
// EXPORT ALL RULES
// ============================================================================

export const DATA_QUALITY_VALIDATION_RULES: ValidationRule[] = [
  AGE_RANGE_VALIDATION,
  DATE_LOGICAL_ORDER,
  REQUIRED_FIELD_VALIDATION,
  EXCESSIVE_MISSING_DATA,
  CATEGORICAL_VALUE_VALIDATION,
  RCT_RANDOMIZATION_COMPLETENESS,
  OBSERVATIONAL_EXPOSURE_DOCUMENTATION,
  DUPLICATE_RECORD_DETECTION
];
