// Schema Architect AI - Validation Rules

import type { ValidationRule, ValidationIssue, ValidationContext } from '../core/personaTypes';

// Helper function to create issues
function createIssue(
  id: string,
  severity: 'critical' | 'warning' | 'info',
  title: string,
  description: string,
  recommendation: string,
  reference?: string
): ValidationIssue {
  return {
    id,
    personaId: 'schema-architect',
    severity,
    category: 'schema',
    title,
    description,
    recommendation,
    location: {
      module: 'schema-builder',
      tab: 'schema'
    },
    regulatoryReference: reference,
    autoFixAvailable: false,
    studyTypeSpecific: true
  };
}

// ============================================================================
// RCT-SPECIFIC RULES
// ============================================================================

export const RCT_RANDOMIZATION_VARIABLE: ValidationRule = {
  id: 'rct-randomization-variable',
  name: 'RCT: Randomization Variable Required',
  personaId: 'schema-architect',
  category: 'schema',
  severity: 'warning',
  description: 'RCTs should include a randomization variable to track treatment assignment',
  applicableStudyTypes: ['rct'],
  check: (context: ValidationContext): ValidationIssue[] => {
    const blocks = context.schemaBlocks || [];
    
    // Look for randomization-related variables
    const hasRandomization = blocks.some(block => 
      block.name?.toLowerCase().includes('random') ||
      block.name?.toLowerCase().includes('treatment') ||
      block.name?.toLowerCase().includes('arm') ||
      block.name?.toLowerCase().includes('allocation')
    );

    if (!hasRandomization) {
      return [createIssue(
        'missing-randomization',
        'warning',
        'Missing Randomization Variable',
        'Randomized controlled trials require a variable to track which treatment arm each participant was assigned to.',
        'Add a categorical variable named "Randomization_Arm" or "Treatment_Assignment" with options for each treatment group (e.g., "Control", "Intervention", "Placebo")',
        'ICH E9: Statistical Principles for Clinical Trials, Section 5.3'
      )];
    }

    return [];
  }
};

export const RCT_TREATMENT_ARM_VARIABLE: ValidationRule = {
  id: 'rct-treatment-arm-variable',
  name: 'RCT: Treatment Arm Variable',
  personaId: 'schema-architect',
  category: 'schema',
  severity: 'info',
  description: 'Suggest explicit treatment arm tracking for RCTs',
  applicableStudyTypes: ['rct'],
  check: (context: ValidationContext): ValidationIssue[] => {
    const blocks = context.schemaBlocks || [];
    
    const hasTreatmentArm = blocks.some(block =>
      block.name?.toLowerCase().includes('treatment') &&
      (block.name?.toLowerCase().includes('arm') || block.name?.toLowerCase().includes('group'))
    );

    if (!hasTreatmentArm) {
      return [createIssue(
        'suggested-treatment-arm',
        'info',
        'Consider Adding Treatment Arm Variable',
        'Explicitly tracking treatment arms helps with stratified analysis and CONSORT reporting.',
        'Add a variable like "Treatment_Arm" (categorical) with values: "Arm A: [Drug Name]", "Arm B: Placebo", etc.',
        'CONSORT 2010 Statement, Item 6a'
      )];
    }

    return [];
  }
};

export const RCT_BLINDING_STATUS: ValidationRule = {
  id: 'rct-blinding-status',
  name: 'RCT: Blinding Status Variable',
  personaId: 'schema-architect',
  category: 'schema',
  severity: 'info',
  description: 'Blinded RCTs should track blinding integrity',
  applicableStudyTypes: ['rct'],
  check: (context: ValidationContext): ValidationIssue[] => {
    const isBlinded = context.studyDesign?.isBlinded;
    
    if (!isBlinded) return []; // Skip if not a blinded study

    const blocks = context.schemaBlocks || [];
    
    const hasBlindingVariable = blocks.some(block =>
      block.name?.toLowerCase().includes('blind') ||
      block.name?.toLowerCase().includes('unblind') ||
      block.name?.toLowerCase().includes('masking')
    );

    if (!hasBlindingVariable) {
      return [createIssue(
        'suggested-blinding-tracking',
        'info',
        'Consider Tracking Blinding Integrity',
        'For blinded studies, tracking any unblinding events is important for protocol deviations.',
        'Add variables: "Blinding_Broken" (Yes/No), "Blinding_Broken_Date", "Reason_for_Unblinding"',
        'ICH E9, Section 5.1.2'
      )];
    }

    return [];
  }
};

// ============================================================================
// OBSERVATIONAL STUDY RULES
// ============================================================================

export const OBSERVATIONAL_EXPOSURE_VARIABLE: ValidationRule = {
  id: 'observational-exposure-variable',
  name: 'Observational: Exposure Variable Required',
  personaId: 'schema-architect',
  category: 'schema',
  severity: 'warning',
  description: 'Observational studies must clearly define the exposure of interest',
  applicableStudyTypes: ['observational'],
  check: (context: ValidationContext): ValidationIssue[] => {
    const blocks = context.schemaBlocks || [];
    
    const hasExposure = blocks.some(block =>
      block.name?.toLowerCase().includes('exposure') ||
      block.name?.toLowerCase().includes('predictor') ||
      block.description?.toLowerCase().includes('exposure')
    );

    if (!hasExposure) {
      return [createIssue(
        'missing-exposure',
        'warning',
        'Missing Primary Exposure Variable',
        'Observational studies require clear definition of the primary exposure/predictor variable.',
        'Add a variable clearly labeled as "Primary_Exposure" or name it after the specific exposure (e.g., "Smoking_Status", "Drug_Use")',
        'STROBE Statement, Item 7'
      )];
    }

    return [];
  }
};

export const OBSERVATIONAL_CONFOUNDERS: ValidationRule = {
  id: 'observational-confounders',
  name: 'Observational: Confounder Variables',
  personaId: 'schema-architect',
  category: 'schema',
  severity: 'info',
  description: 'Observational studies should include common confounders',
  applicableStudyTypes: ['observational'],
  check: (context: ValidationContext): ValidationIssue[] => {
    const blocks = context.schemaBlocks || [];
    
    // Check for common confounders
    const hasAge = blocks.some(b => b.name?.toLowerCase().includes('age'));
    const hasSex = blocks.some(b => 
      b.name?.toLowerCase().includes('sex') || 
      b.name?.toLowerCase().includes('gender')
    );
    const hasRace = blocks.some(b => 
      b.name?.toLowerCase().includes('race') || 
      b.name?.toLowerCase().includes('ethnicity')
    );

    const missing: string[] = [];
    if (!hasAge) missing.push('Age');
    if (!hasSex) missing.push('Sex/Gender');
    if (!hasRace) missing.push('Race/Ethnicity');

    if (missing.length > 0) {
      return [createIssue(
        'missing-confounders',
        'info',
        'Consider Adding Common Confounders',
        `Missing demographic confounders: ${missing.join(', ')}. These are typically important for adjustment in observational studies.`,
        'Add demographic variables (Age, Sex, Race/Ethnicity) to enable covariate adjustment and reduce confounding bias',
        'STROBE Statement, Item 12a'
      )];
    }

    return [];
  }
};

// ============================================================================
// DIAGNOSTIC STUDY RULES
// ============================================================================

export const DIAGNOSTIC_INDEX_TEST: ValidationRule = {
  id: 'diagnostic-index-test',
  name: 'Diagnostic: Index Test Variable',
  personaId: 'schema-architect',
  category: 'schema',
  severity: 'warning',
  description: 'Diagnostic accuracy studies require index test results',
  applicableStudyTypes: ['diagnostic'],
  check: (context: ValidationContext): ValidationIssue[] => {
    const blocks = context.schemaBlocks || [];
    
    const hasIndexTest = blocks.some(block =>
      block.name?.toLowerCase().includes('index') ||
      block.name?.toLowerCase().includes('test_result') ||
      block.description?.toLowerCase().includes('index test')
    );

    if (!hasIndexTest) {
      return [createIssue(
        'missing-index-test',
        'warning',
        'Missing Index Test Variable',
        'Diagnostic studies must capture the results of the test being evaluated (index test).',
        'Add a variable for "Index_Test_Result" - this is the new test you are validating',
        'STARD 2015, Item 6'
      )];
    }

    return [];
  }
};

export const DIAGNOSTIC_REFERENCE_STANDARD: ValidationRule = {
  id: 'diagnostic-reference-standard',
  name: 'Diagnostic: Reference Standard Variable',
  personaId: 'schema-architect',
  category: 'schema',
  severity: 'critical',
  description: 'Diagnostic studies require a reference standard (gold standard) for comparison',
  applicableStudyTypes: ['diagnostic'],
  check: (context: ValidationContext): ValidationIssue[] => {
    const blocks = context.schemaBlocks || [];
    
    const hasReferenceStandard = blocks.some(block =>
      block.name?.toLowerCase().includes('reference') ||
      block.name?.toLowerCase().includes('gold_standard') ||
      block.name?.toLowerCase().includes('true_diagnosis')
    );

    if (!hasReferenceStandard) {
      return [createIssue(
        'missing-reference-standard',
        'critical',
        'Missing Reference Standard Variable',
        'All diagnostic accuracy studies require a reference standard (gold standard) to compare the index test against.',
        'Add a variable for "Reference_Standard_Result" or "Gold_Standard_Diagnosis" - this is the established best method for determining the true diagnosis',
        'STARD 2015, Item 8'
      )];
    }

    return [];
  }
};

// ============================================================================
// REGISTRY / LONGITUDINAL STUDY RULES
// ============================================================================

export const REGISTRY_FOLLOW_UP_VARIABLES: ValidationRule = {
  id: 'registry-follow-up-variables',
  name: 'Registry: Follow-up Tracking Variables',
  personaId: 'schema-architect',
  category: 'schema',
  severity: 'info',
  description: 'Registries should include long-term follow-up variables',
  applicableStudyTypes: ['registry'],
  check: (context: ValidationContext): ValidationIssue[] => {
    const blocks = context.schemaBlocks || [];
    
    const hasFollowUp = blocks.some(block =>
      block.name?.toLowerCase().includes('follow') ||
      block.name?.toLowerCase().includes('visit') ||
      block.name?.toLowerCase().includes('timepoint')
    );

    const hasVitalStatus = blocks.some(block =>
      block.name?.toLowerCase().includes('vital') ||
      block.name?.toLowerCase().includes('alive') ||
      block.name?.toLowerCase().includes('deceased')
    );

    const issues: ValidationIssue[] = [];

    if (!hasFollowUp) {
      issues.push(createIssue(
        'suggested-follow-up',
        'info',
        'Consider Adding Follow-up Visit Variables',
        'Registries typically track participants over multiple time points.',
        'Add variables for: "Visit_Number", "Visit_Date", "Days_Since_Enrollment"'
      ));
    }

    if (!hasVitalStatus) {
      issues.push(createIssue(
        'suggested-vital-status',
        'info',
        'Consider Adding Vital Status Tracking',
        'Long-term registries should track vital status (alive/deceased) for survival analysis.',
        'Add variables: "Vital_Status" (Alive/Deceased/Unknown), "Date_of_Death", "Cause_of_Death"'
      ));
    }

    return issues;
  }
};

// ============================================================================
// EXPORT ALL RULES
// ============================================================================

export const SCHEMA_VALIDATION_RULES: ValidationRule[] = [
  RCT_RANDOMIZATION_VARIABLE,
  RCT_TREATMENT_ARM_VARIABLE,
  RCT_BLINDING_STATUS,
  OBSERVATIONAL_EXPOSURE_VARIABLE,
  OBSERVATIONAL_CONFOUNDERS,
  DIAGNOSTIC_INDEX_TEST,
  DIAGNOSTIC_REFERENCE_STANDARD,
  REGISTRY_FOLLOW_UP_VARIABLES
];
