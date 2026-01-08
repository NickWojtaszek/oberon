/**
 * VALIDATION UTILITIES
 * 
 * Provides helper functions for validating data at system boundaries.
 * Uses Zod schemas for runtime type checking.
 */

import { z, ZodError } from 'zod';
import type { 
  ProjectSchema,
  ProtocolSchema,
  ManuscriptManifestSchema,
  StatisticalManifestSchema,
  ClinicalDataRecordSchema,
  UserPersonaSchema,
  SchemaTemplateSchema,
  ProjectExportSchema,
  FullExportSchema,
} from './schemas';

/**
 * Validation result type
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Convert Zod errors to user-friendly validation errors
 */
function formatZodErrors(error: ZodError): ValidationError[] {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code,
  }));
}

/**
 * Generic validator factory
 */
function createValidator<T extends z.ZodType>(schema: T) {
  return (data: unknown): ValidationResult<z.infer<T>> => {
    try {
      const validated = schema.parse(data);
      return {
        success: true,
        data: validated,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          success: false,
          errors: formatZodErrors(error),
        };
      }
      return {
        success: false,
        errors: [{
          field: 'unknown',
          message: error instanceof Error ? error.message : 'Unknown validation error',
          code: 'UNKNOWN_ERROR',
        }],
      };
    }
  };
}

/**
 * Safe parse that returns partial data on failure (for gradual migration)
 * WARNING: Use sparingly! Prefer strict validation with createValidator
 */
function createSafeValidator<T extends z.ZodType>(schema: T) {
  return (data: unknown): ValidationResult<Partial<z.infer<T>>> => {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    }
    
    // Return partial data with errors
    return {
      success: false,
      data: data as Partial<z.infer<T>>,
      errors: formatZodErrors(result.error),
    };
  };
}

/**
 * ===================
 * EXPORTED VALIDATORS
 * ===================
 */

// Import these validators in your code
export const validators = {
  // Strict validators (recommended)
  strict: {
    project: createValidator,
    protocol: createValidator,
    manuscript: createValidator,
    statisticalManifest: createValidator,
    clinicalData: createValidator,
    persona: createValidator,
    template: createValidator,
    projectExport: createValidator,
    fullExport: createValidator,
  },
  
  // Safe validators (for migration only)
  safe: {
    project: createSafeValidator,
    protocol: createSafeValidator,
    manuscript: createSafeValidator,
    statisticalManifest: createSafeValidator,
    clinicalData: createSafeValidator,
    persona: createSafeValidator,
    template: createSafeValidator,
  },
};

/**
 * Validate array of items
 */
export function validateArray<T extends z.ZodType>(
  schema: T,
  items: unknown[]
): ValidationResult<z.infer<T>[]> {
  const errors: ValidationError[] = [];
  const validatedItems: z.infer<T>[] = [];
  
  items.forEach((item, index) => {
    const validator = createValidator(schema);
    const result = validator(item);
    
    if (result.success && result.data) {
      validatedItems.push(result.data);
    } else if (result.errors) {
      errors.push(...result.errors.map(err => ({
        ...err,
        field: `[${index}].${err.field}`,
      })));
    }
  });
  
  if (errors.length > 0) {
    return {
      success: false,
      errors,
    };
  }
  
  return {
    success: true,
    data: validatedItems,
  };
}

/**
 * Batch validation with detailed reporting
 */
export interface BatchValidationResult<T> {
  totalItems: number;
  validItems: T[];
  invalidItems: Array<{ index: number; item: unknown; errors: ValidationError[] }>;
  success: boolean;
}

export function validateBatch<T extends z.ZodType>(
  schema: T,
  items: unknown[]
): BatchValidationResult<z.infer<T>> {
  const validItems: z.infer<T>[] = [];
  const invalidItems: Array<{ index: number; item: unknown; errors: ValidationError[] }> = [];
  
  items.forEach((item, index) => {
    const validator = createValidator(schema);
    const result = validator(item);
    
    if (result.success && result.data) {
      validItems.push(result.data);
    } else if (result.errors) {
      invalidItems.push({
        index,
        item,
        errors: result.errors,
      });
    }
  });
  
  return {
    totalItems: items.length,
    validItems,
    invalidItems,
    success: invalidItems.length === 0,
  };
}

/**
 * Create a validation report for display in UI
 */
export interface ValidationReport {
  isValid: boolean;
  summary: string;
  details: Array<{
    severity: 'error' | 'warning';
    field: string;
    message: string;
  }>;
}

export function createValidationReport(
  errors: ValidationError[],
  context: string = 'data'
): ValidationReport {
  if (errors.length === 0) {
    return {
      isValid: true,
      summary: `${context} is valid`,
      details: [],
    };
  }
  
  return {
    isValid: false,
    summary: `${context} validation failed with ${errors.length} error(s)`,
    details: errors.map(err => ({
      severity: 'error' as const,
      field: err.field,
      message: err.message,
    })),
  };
}

/**
 * Type guard helpers
 */
export function isValidProject(data: unknown): data is z.infer<typeof ProjectSchema> {
  const validator = createValidator(ProjectSchema as any);
  return validator(data).success;
}

export function isValidManuscript(data: unknown): data is z.infer<typeof ManuscriptManifestSchema> {
  const validator = createValidator(ManuscriptManifestSchema as any);
  return validator(data).success;
}

export function isValidStatisticalManifest(data: unknown): data is z.infer<typeof StatisticalManifestSchema> {
  const validator = createValidator(StatisticalManifestSchema as any);
  return validator(data).success;
}
