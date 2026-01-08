import { DatabaseTable, DatabaseField } from '../components/database/utils/schemaGenerator';

export interface ValidationError {
  tableId: string;
  fieldId: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

interface FormData {
  [tableId: string]: {
    [fieldId: string]: any;
  };
}

/**
 * Validate base fields only (minimal validation for draft saves)
 */
export function validateBaseFields(
  subjectId: string,
  enrollmentDate: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!subjectId.trim()) {
    errors.push({
      tableId: 'base',
      fieldId: 'subject_id',
      message: 'Subject ID is required',
      severity: 'error',
    });
  }

  if (!enrollmentDate) {
    errors.push({
      tableId: 'base',
      fieldId: 'enrollment_date',
      message: 'Enrollment date is required',
      severity: 'error',
    });
  }

  return errors;
}

/**
 * Validate a single field value
 */
export function validateField(
  field: DatabaseField,
  value: any
): ValidationError | null {
  // Skip deprecated and structural fields
  if (field.status === 'deprecated' || field.category === 'Structural') {
    return null;
  }

  // Check required fields
  if (field.isRequired && (value === undefined || value === null || value === '')) {
    return {
      tableId: '', // Will be set by caller
      fieldId: field.id,
      message: `${field.displayName} is required`,
      severity: 'error',
    };
  }

  // Validate continuous fields
  if (field.dataType === 'Continuous' && value !== undefined && value !== '') {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return {
        tableId: '',
        fieldId: field.id,
        message: `${field.displayName} must be a number`,
        severity: 'error',
      };
    }

    if (field.minValue !== undefined && numValue < field.minValue) {
      return {
        tableId: '',
        fieldId: field.id,
        message: `${field.displayName} must be at least ${field.minValue}`,
        severity: 'error',
      };
    }

    if (field.maxValue !== undefined && numValue > field.maxValue) {
      return {
        tableId: '',
        fieldId: field.id,
        message: `${field.displayName} must be at most ${field.maxValue}`,
        severity: 'error',
      };
    }
  }

  // Validate categorical fields
  if (field.dataType === 'Categorical' && value && field.options) {
    if (!field.options.includes(value)) {
      return {
        tableId: '',
        fieldId: field.id,
        message: `Invalid option selected for ${field.displayName}`,
        severity: 'error',
      };
    }
  }

  return null;
}

/**
 * Validate form in DRAFT mode - only base fields required
 */
export function validateDraft(
  subjectId: string,
  enrollmentDate: string,
  formData: FormData,
  tables: DatabaseTable[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Validate base fields (required for draft)
  errors.push(...validateBaseFields(subjectId, enrollmentDate));

  // Check filled fields for data type errors only
  tables.forEach((table) => {
    const tableData = formData[table.tableName] || {};

    table.fields.forEach((field) => {
      const value = tableData[field.id];
      
      // Only validate if value is provided
      if (value !== undefined && value !== null && value !== '') {
        const error = validateField(field, value);
        if (error) {
          error.tableId = table.tableName;
          errors.push(error);
        }
      }

      // Add warnings for missing required fields (not blocking)
      if (field.isRequired && (value === undefined || value === null || value === '')) {
        if (field.status !== 'deprecated' && field.category !== 'Structural') {
          warnings.push({
            tableId: table.tableName,
            fieldId: field.id,
            message: `${field.displayName} is recommended`,
            severity: 'warning',
          });
        }
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate form in COMPLETE mode - all required fields must be filled
 */
export function validateComplete(
  subjectId: string,
  enrollmentDate: string,
  formData: FormData,
  tables: DatabaseTable[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Validate base fields
  errors.push(...validateBaseFields(subjectId, enrollmentDate));

  // Validate all fields
  tables.forEach((table) => {
    const tableData = formData[table.tableName] || {};

    table.fields.forEach((field) => {
      const value = tableData[field.id];
      const error = validateField(field, value);
      
      if (error) {
        error.tableId = table.tableName;
        errors.push(error);
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get completion percentage for progress tracking
 */
export function getFormCompletion(
  formData: FormData,
  tables: DatabaseTable[]
): { total: number; filled: number; percentage: number } {
  let total = 0;
  let filled = 0;

  tables.forEach((table) => {
    const tableData = formData[table.tableName] || {};
    
    table.fields.forEach((field) => {
      if (field.status !== 'deprecated' && field.category !== 'Structural') {
        total++;
        const value = tableData[field.id];
        if (value !== undefined && value !== null && value !== '') {
          filled++;
        }
      }
    });
  });

  return {
    total,
    filled,
    percentage: total > 0 ? Math.round((filled / total) * 100) : 0,
  };
}

/**
 * Get completion status for each table
 */
export function getTableCompletionStatus(
  formData: FormData,
  tables: DatabaseTable[]
): Map<string, { filled: number; total: number; isComplete: boolean }> {
  const status = new Map();

  tables.forEach((table) => {
    const tableData = formData[table.tableName] || {};
    let filled = 0;
    let total = 0;
    let requiredFilled = 0;
    let requiredTotal = 0;

    table.fields.forEach((field) => {
      if (field.status !== 'deprecated' && field.category !== 'Structural') {
        total++;
        const value = tableData[field.id];
        const isFilled = value !== undefined && value !== null && value !== '';
        
        if (isFilled) {
          filled++;
        }

        if (field.isRequired) {
          requiredTotal++;
          if (isFilled) {
            requiredFilled++;
          }
        }
      }
    });

    status.set(table.tableName, {
      filled,
      total,
      isComplete: requiredTotal > 0 ? requiredFilled === requiredTotal : filled === total,
    });
  });

  return status;
}