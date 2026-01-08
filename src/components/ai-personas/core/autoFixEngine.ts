// Auto-Fix Engine - Automatically fix common validation issues

import type { ValidationIssue } from './personaTypes';

export interface AutoFixResult {
  success: boolean;
  message: string;
  appliedFixes: string[];
  errors: string[];
}

export type AutoFixFunction = (issue: ValidationIssue, context: any) => AutoFixResult;

// Registry of auto-fix functions
const autoFixRegistry = new Map<string, AutoFixFunction>();

/**
 * Register an auto-fix function for a specific issue ID
 */
export function registerAutoFix(issueId: string, fixFunction: AutoFixFunction) {
  autoFixRegistry.set(issueId, fixFunction);
}

/**
 * Check if an issue has an auto-fix available
 */
export function hasAutoFix(issueId: string): boolean {
  return autoFixRegistry.has(issueId);
}

/**
 * Apply auto-fix for a specific issue
 */
export function applyAutoFix(issue: ValidationIssue, context: any): AutoFixResult {
  const fixFunction = autoFixRegistry.get(issue.id);
  
  if (!fixFunction) {
    return {
      success: false,
      message: `No auto-fix available for issue: ${issue.id}`,
      appliedFixes: [],
      errors: [`No auto-fix registered for ${issue.id}`]
    };
  }

  try {
    return fixFunction(issue, context);
  } catch (error) {
    return {
      success: false,
      message: `Auto-fix failed: ${error}`,
      appliedFixes: [],
      errors: [String(error)]
    };
  }
}

/**
 * Apply auto-fixes for multiple issues
 */
export function applyAutoFixes(issues: ValidationIssue[], context: any): AutoFixResult {
  const results: AutoFixResult[] = [];
  const allAppliedFixes: string[] = [];
  const allErrors: string[] = [];

  for (const issue of issues) {
    if (issue.autoFixAvailable && hasAutoFix(issue.id)) {
      const result = applyAutoFix(issue, context);
      results.push(result);
      
      if (result.success) {
        allAppliedFixes.push(...result.appliedFixes);
      } else {
        allErrors.push(...result.errors);
      }
    }
  }

  const successCount = results.filter(r => r.success).length;
  const totalAttempted = results.length;

  return {
    success: successCount === totalAttempted && totalAttempted > 0,
    message: `Applied ${successCount} of ${totalAttempted} auto-fixes`,
    appliedFixes: allAppliedFixes,
    errors: allErrors
  };
}

// ============================================================================
// COMMON AUTO-FIX FUNCTIONS
// ============================================================================

/**
 * Auto-fix: Standardize date format to ISO 8601
 */
export function autoFixDateFormat(issue: ValidationIssue, context: any): AutoFixResult {
  const { field, value } = context;
  
  try {
    // Try to parse the date
    const date = new Date(value);
    
    if (isNaN(date.getTime())) {
      return {
        success: false,
        message: 'Cannot parse date',
        appliedFixes: [],
        errors: ['Invalid date format']
      };
    }

    // Convert to ISO 8601 format (YYYY-MM-DD)
    const isoDate = date.toISOString().split('T')[0];
    
    // Update the field
    if (context.updateField) {
      context.updateField(field, isoDate);
    }

    return {
      success: true,
      message: `Converted ${value} to ${isoDate}`,
      appliedFixes: [`Standardized date format for ${field}`],
      errors: []
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to convert date',
      appliedFixes: [],
      errors: [String(error)]
    };
  }
}

/**
 * Auto-fix: Trim whitespace from text fields
 */
export function autoFixTrimWhitespace(issue: ValidationIssue, context: any): AutoFixResult {
  const { field, value } = context;
  
  if (typeof value !== 'string') {
    return {
      success: false,
      message: 'Value is not a string',
      appliedFixes: [],
      errors: ['Cannot trim non-string value']
    };
  }

  const trimmedValue = value.trim();
  
  if (trimmedValue === value) {
    return {
      success: true,
      message: 'No whitespace to trim',
      appliedFixes: [],
      errors: []
    };
  }

  // Update the field
  if (context.updateField) {
    context.updateField(field, trimmedValue);
  }

  return {
    success: true,
    message: `Trimmed whitespace from ${field}`,
    appliedFixes: [`Removed leading/trailing whitespace from ${field}`],
    errors: []
  };
}

/**
 * Auto-fix: Capitalize first letter of text
 */
export function autoFixCapitalize(issue: ValidationIssue, context: any): AutoFixResult {
  const { field, value } = context;
  
  if (typeof value !== 'string' || !value) {
    return {
      success: false,
      message: 'Value is not a valid string',
      appliedFixes: [],
      errors: ['Cannot capitalize non-string value']
    };
  }

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
  
  if (capitalizedValue === value) {
    return {
      success: true,
      message: 'Already capitalized',
      appliedFixes: [],
      errors: []
    };
  }

  // Update the field
  if (context.updateField) {
    context.updateField(field, capitalizedValue);
  }

  return {
    success: true,
    message: `Capitalized ${field}`,
    appliedFixes: [`Capitalized first letter of ${field}`],
    errors: []
  };
}

/**
 * Auto-fix: Convert to uppercase
 */
export function autoFixUpperCase(issue: ValidationIssue, context: any): AutoFixResult {
  const { field, value } = context;
  
  if (typeof value !== 'string') {
    return {
      success: false,
      message: 'Value is not a string',
      appliedFixes: [],
      errors: ['Cannot convert non-string to uppercase']
    };
  }

  const upperValue = value.toUpperCase();
  
  if (upperValue === value) {
    return {
      success: true,
      message: 'Already uppercase',
      appliedFixes: [],
      errors: []
    };
  }

  // Update the field
  if (context.updateField) {
    context.updateField(field, upperValue);
  }

  return {
    success: true,
    message: `Converted ${field} to uppercase`,
    appliedFixes: [`Converted ${field} to uppercase`],
    errors: []
  };
}

/**
 * Auto-fix: Round numeric values to specified decimal places
 */
export function autoFixRoundNumber(issue: ValidationIssue, context: any): AutoFixResult {
  const { field, value, decimals = 2 } = context;
  
  if (typeof value !== 'number') {
    return {
      success: false,
      message: 'Value is not a number',
      appliedFixes: [],
      errors: ['Cannot round non-numeric value']
    };
  }

  const roundedValue = Number(value.toFixed(decimals));
  
  if (roundedValue === value) {
    return {
      success: true,
      message: 'Already rounded',
      appliedFixes: [],
      errors: []
    };
  }

  // Update the field
  if (context.updateField) {
    context.updateField(field, roundedValue);
  }

  return {
    success: true,
    message: `Rounded ${field} to ${decimals} decimals`,
    appliedFixes: [`Rounded ${field} to ${decimals} decimal places`],
    errors: []
  };
}

/**
 * Auto-fix: Set default value for missing required field
 */
export function autoFixSetDefault(issue: ValidationIssue, context: any): AutoFixResult {
  const { field, defaultValue } = context;
  
  if (defaultValue === undefined) {
    return {
      success: false,
      message: 'No default value specified',
      appliedFixes: [],
      errors: ['Cannot set default - no default value provided']
    };
  }

  // Update the field
  if (context.updateField) {
    context.updateField(field, defaultValue);
  }

  return {
    success: true,
    message: `Set ${field} to default value: ${defaultValue}`,
    appliedFixes: [`Set ${field} to default value`],
    errors: []
  };
}

/**
 * Auto-fix: Remove invalid characters from text
 */
export function autoFixRemoveInvalidChars(issue: ValidationIssue, context: any): AutoFixResult {
  const { field, value, validPattern = /[^a-zA-Z0-9\s\-_]/g } = context;
  
  if (typeof value !== 'string') {
    return {
      success: false,
      message: 'Value is not a string',
      appliedFixes: [],
      errors: ['Cannot remove characters from non-string value']
    };
  }

  const cleanedValue = value.replace(validPattern, '');
  
  if (cleanedValue === value) {
    return {
      success: true,
      message: 'No invalid characters found',
      appliedFixes: [],
      errors: []
    };
  }

  // Update the field
  if (context.updateField) {
    context.updateField(field, cleanedValue);
  }

  return {
    success: true,
    message: `Removed invalid characters from ${field}`,
    appliedFixes: [`Removed invalid characters from ${field}`],
    errors: []
  };
}

// ============================================================================
// STUDY-SPECIFIC AUTO-FIX FUNCTIONS
// ============================================================================

/**
 * Auto-fix: Standardize CTCAE grade format (1-5)
 */
export function autoFixCTCAEGrade(issue: ValidationIssue, context: any): AutoFixResult {
  const { field, value } = context;
  
  // Try to extract numeric grade
  const gradeMatch = String(value).match(/(\d)/);
  
  if (!gradeMatch) {
    return {
      success: false,
      message: 'Cannot extract CTCAE grade',
      appliedFixes: [],
      errors: ['No numeric grade found in value']
    };
  }

  const grade = parseInt(gradeMatch[1]);
  
  if (grade < 1 || grade > 5) {
    return {
      success: false,
      message: 'Invalid CTCAE grade (must be 1-5)',
      appliedFixes: [],
      errors: ['CTCAE grade must be between 1 and 5']
    };
  }

  // Update the field
  if (context.updateField) {
    context.updateField(field, grade);
  }

  return {
    success: true,
    message: `Standardized CTCAE grade to: ${grade}`,
    appliedFixes: [`Standardized CTCAE grade for ${field}`],
    errors: []
  };
}

/**
 * Auto-fix: Standardize yes/no responses
 */
export function autoFixYesNo(issue: ValidationIssue, context: any): AutoFixResult {
  const { field, value } = context;
  
  const valueStr = String(value).toLowerCase().trim();
  
  let standardizedValue: string;
  
  if (['yes', 'y', 'true', '1', 'si', 'oui'].includes(valueStr)) {
    standardizedValue = 'Yes';
  } else if (['no', 'n', 'false', '0', 'non'].includes(valueStr)) {
    standardizedValue = 'No';
  } else {
    return {
      success: false,
      message: 'Cannot interpret as Yes/No',
      appliedFixes: [],
      errors: ['Value cannot be standardized to Yes/No']
    };
  }

  // Update the field
  if (context.updateField) {
    context.updateField(field, standardizedValue);
  }

  return {
    success: true,
    message: `Standardized ${field} to: ${standardizedValue}`,
    appliedFixes: [`Standardized ${field} to Yes/No format`],
    errors: []
  };
}

// ============================================================================
// EXPORT AUTO-FIX ENGINE
// ============================================================================

export const autoFixEngine = {
  registerAutoFix,
  hasAutoFix,
  applyAutoFix,
  applyAutoFixes,
  
  // Common fixes
  autoFixDateFormat,
  autoFixTrimWhitespace,
  autoFixCapitalize,
  autoFixUpperCase,
  autoFixRoundNumber,
  autoFixSetDefault,
  autoFixRemoveInvalidChars,
  
  // Study-specific fixes
  autoFixCTCAEGrade,
  autoFixYesNo
};
