/**
 * IMPORT VALIDATION LAYER
 * 
 * Validates all imported data before it enters the system.
 * This is the PRIMARY DEFENSE against data corruption.
 * 
 * Philosophy:
 * 1. Validate FIRST, import SECOND
 * 2. Provide clear, actionable error messages
 * 3. Never silently convert invalid data
 * 4. Allow users to fix and retry
 */

import {
  FullExportSchema,
  ProjectExportSchema,
  ManuscriptManifestSchema,
  StatisticalManifestSchema,
  ProtocolSchema,
  ClinicalDataRecordSchema,
} from './schemas';
import type { ValidationError, ValidationReport } from './validators';
import { createValidationReport, validateBatch } from './validators';

/**
 * Import validation result
 */
export interface ImportValidationResult {
  isValid: boolean;
  canProceed: boolean;
  summary: string;
  reports: {
    global?: ValidationReport;
    projects: Array<{
      projectId: string;
      projectName: string;
      report: ValidationReport;
      subReports: {
        protocols?: ValidationReport;
        manuscripts?: ValidationReport;
        statisticalManifests?: ValidationReport;
        clinicalData?: ValidationReport;
      };
    }>;
  };
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validate full export file before import
 */
export function validateImportFile(jsonData: string): ImportValidationResult {
  const result: ImportValidationResult = {
    isValid: true,
    canProceed: false,
    summary: '',
    reports: {
      projects: [],
    },
    errors: [],
    warnings: [],
  };

  try {
    // Step 1: Parse JSON
    let parsedData: unknown;
    try {
      parsedData = JSON.parse(jsonData);
    } catch (error) {
      result.isValid = false;
      result.summary = 'Invalid JSON format';
      result.errors.push({
        field: 'file',
        message: 'File contains invalid JSON syntax',
        code: 'INVALID_JSON',
      });
      return result;
    }

    console.log('🔍 Step 1: JSON parsed successfully');

    // Step 2: Validate against FullExport schema
    console.log('🔍 Step 2: Validating against FullExport schema...');
    const fullExportValidation = FullExportSchema.safeParse(parsedData);
    
    if (!fullExportValidation.success) {
      console.log('❌ Schema validation failed:', fullExportValidation.error.errors);
      result.isValid = false;
      const zodErrors = fullExportValidation.error.errors.map(err => ({
        field: err.path.join('.') || 'root',
        message: err.message,
        code: String(err.code),
      }));
      result.errors.push(...zodErrors);
      result.reports.global = createValidationReport(zodErrors, 'Import file structure');
      result.summary = `File structure validation failed with ${zodErrors.length} error(s)`;
      return result;
    }

    const data = fullExportValidation.data;

    // Step 3: Validate each project
    if (!data.projects || !Array.isArray(data.projects)) {
      result.isValid = false;
      result.summary = 'No projects array found in export data';
      result.errors.push({
        field: 'projects',
        message: 'Export data must contain a "projects" array',
        code: 'MISSING_PROJECTS',
      });
      return result;
    }

    data.projects.forEach((projectExport, index) => {
      const projectErrors: ValidationError[] = [];
      const projectReport = {
        projectId: projectExport.project.id,
        projectName: projectExport.project.name,
        report: { isValid: true, summary: '', details: [] } as ValidationReport,
        subReports: {} as any,
      };

      // Validate project metadata
      const projectValidation = ProjectExportSchema.safeParse(projectExport);
      if (!projectValidation.success) {
        const errors = projectValidation.error.errors.map(err => ({
          field: `projects[${index}].${err.path.join('.')}`,
          message: err.message,
          code: err.code,
        }));
        projectErrors.push(...errors);
        result.errors.push(...errors);
      }

      // Validate manuscripts
      if (projectExport.manuscripts && projectExport.manuscripts.length > 0) {
        const manuscriptsBatch = validateBatch(ManuscriptManifestSchema, projectExport.manuscripts);
        if (!manuscriptsBatch.success) {
          manuscriptsBatch.invalidItems.forEach(invalid => {
            const errors = invalid.errors.map(err => ({
              field: `projects[${index}].manuscripts[${invalid.index}].${err.field}`,
              message: err.message,
              code: err.code,
            }));
            projectErrors.push(...errors);
          });
          projectReport.subReports.manuscripts = createValidationReport(
            manuscriptsBatch.invalidItems.flatMap(i => i.errors),
            `Manuscripts in ${projectExport.project.name}`
          );
        }
      }

      // Validate statistical manifests
      if (projectExport.statisticalManifests && projectExport.statisticalManifests.length > 0) {
        const manifestsBatch = validateBatch(StatisticalManifestSchema, projectExport.statisticalManifests);
        if (!manifestsBatch.success) {
          manifestsBatch.invalidItems.forEach(invalid => {
            const errors = invalid.errors.map(err => ({
              field: `projects[${index}].statisticalManifests[${invalid.index}].${err.field}`,
              message: err.message,
              code: err.code,
            }));
            
            // Statistical manifests are WARNING-level, not errors
            result.warnings.push(...errors);
            
            projectReport.subReports.statisticalManifests = createValidationReport(
              manifestsBatch.invalidItems.flatMap(i => i.errors),
              `Statistical Manifests in ${projectExport.project.name}`
            );
          });
        }
      }

      // Validate protocols
      if (projectExport.protocols && projectExport.protocols.length > 0) {
        const protocolsBatch = validateBatch(ProtocolSchema, projectExport.protocols);
        if (!protocolsBatch.success) {
          protocolsBatch.invalidItems.forEach(invalid => {
            const errors = invalid.errors.map(err => ({
              field: `projects[${index}].protocols[${invalid.index}].${err.field}`,
              message: err.message,
              code: err.code,
            }));
            projectErrors.push(...errors);
          });
          projectReport.subReports.protocols = createValidationReport(
            protocolsBatch.invalidItems.flatMap(i => i.errors),
            `Protocols in ${projectExport.project.name}`
          );
        }
      }

      // Validate clinical data
      if (projectExport.clinicalData && projectExport.clinicalData.length > 0) {
        const clinicalDataBatch = validateBatch(ClinicalDataRecordSchema, projectExport.clinicalData);
        if (!clinicalDataBatch.success) {
          clinicalDataBatch.invalidItems.forEach(invalid => {
            const errors = invalid.errors.map(err => ({
              field: `projects[${index}].clinicalData[${invalid.index}].${err.field}`,
              message: err.message,
              code: err.code,
            }));
            projectErrors.push(...errors);
          });
          projectReport.subReports.clinicalData = createValidationReport(
            clinicalDataBatch.invalidItems.flatMap(i => i.errors),
            `Clinical Data in ${projectExport.project.name}`
          );
        }
      }

      // Create project report
      if (projectErrors.length > 0) {
        result.isValid = false;
        result.errors.push(...projectErrors);
        projectReport.report = createValidationReport(
          projectErrors,
          `Project: ${projectExport.project.name}`
        );
      } else {
        projectReport.report = {
          isValid: true,
          summary: `Project "${projectExport.project.name}" is valid`,
          details: [],
        };
      }

      result.reports.projects.push(projectReport);
    });

    // Step 4: Generate summary
    if (result.errors.length === 0) {
      result.isValid = true;
      result.canProceed = true;
      result.summary = `✓ Validation successful: ${data.projects.length} project(s) ready to import`;
      
      if (result.warnings.length > 0) {
        result.summary += ` (${result.warnings.length} warning(s))`;
      }
    } else {
      result.isValid = false;
      result.canProceed = false;
      result.summary = `✗ Validation failed: ${result.errors.length} error(s) found`;
      
      if (result.warnings.length > 0) {
        result.summary += `, ${result.warnings.length} warning(s)`;
      }
    }

    return result;

  } catch (error) {
    result.isValid = false;
    result.canProceed = false;
    result.summary = 'Unexpected validation error';
    result.errors.push({
      field: 'unknown',
      message: error instanceof Error ? error.message : 'Unknown error during validation',
      code: 'UNEXPECTED_ERROR',
    });
    return result;
  }
}

/**
 * Generate user-friendly error message for display
 */
export function formatValidationErrors(result: ImportValidationResult): string {
  if (result.isValid) {
    return result.summary;
  }

  let message = `${result.summary}\n\n`;

  if (result.reports.global) {
    message += `📋 File Structure Issues:\n`;
    result.reports.global.details.forEach(detail => {
      message += `  • ${detail.field}: ${detail.message}\n`;
    });
    message += '\n';
  }

  result.reports.projects.forEach(projectReport => {
    if (!projectReport.report.isValid) {
      message += `📁 Project: ${projectReport.projectName}\n`;
      projectReport.report.details.forEach(detail => {
        message += `  • ${detail.field}: ${detail.message}\n`;
      });
      message += '\n';
    }
  });

  if (result.warnings.length > 0) {
    message += `⚠️ Warnings:\n`;
    result.warnings.forEach(warning => {
      message += `  • ${warning.field}: ${warning.message}\n`;
    });
  }

  return message;
}