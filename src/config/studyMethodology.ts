/**
 * Study Methodology Configuration
 * Defines the "Study DNA" - mapping study types to required personas,
 * blinding protocols, and permission schemas
 */

export type StudyType = 
  | 'rct'
  | 'prospective-cohort'
  | 'retrospective-case-series'
  | 'laboratory-investigation'
  | 'technical-note';

export type BlindingLevel = 'none' | 'single' | 'double' | 'triple';

export interface PersonaRequirement {
  role: string;
  mandatory: boolean;
  permissionLevel: 'read' | 'write' | 'admin';
  blinded?: boolean;
  restrictedVariables?: string[];
  exclusiveAccess?: string[];
  aiAutonomyCap?: 'audit-only' | 'suggest' | 'co-pilot' | 'supervisor';
  certificationRequired?: boolean;
}

export interface StudyMethodologyConfig {
  id: StudyType;
  name: string;
  description: string;
  rigorLevel: 'streamlined' | 'standard' | 'strict' | 'regulatory';
  blindingProtocol: BlindingLevel;
  requiredPersonas: PersonaRequirement[];
  restrictedFields?: string[];
  allowsProspectiveData: boolean;
  requiresDataSafetyMonitoring: boolean;
  governanceTemplate: string;
}

/**
 * Study-to-Persona Mapping Logic
 * This is the "Genetic Blueprint" for the platform
 */
export const STUDY_METHODOLOGIES: Record<StudyType, StudyMethodologyConfig> = {
  'rct': {
    id: 'rct',
    name: 'Randomized Controlled Trial',
    description: 'Prospective, randomized study with blinding protocols',
    rigorLevel: 'regulatory',
    blindingProtocol: 'double',
    requiredPersonas: [
      {
        role: 'Principal Investigator',
        mandatory: true,
        permissionLevel: 'admin',
        aiAutonomyCap: 'supervisor',
        certificationRequired: true,
      },
      {
        role: 'Randomization Officer',
        mandatory: true,
        permissionLevel: 'write',
        aiAutonomyCap: 'audit-only',
        exclusiveAccess: ['randomization_sequence', 'treatment_assignment'],
        certificationRequired: true,
      },
      {
        role: 'Blinded Outcome Evaluator',
        mandatory: true,
        permissionLevel: 'write',
        blinded: true,
        restrictedVariables: [
          'var_group_id',
          'treatment_assignment',
          'treatment_details',
          'drug_name',
          'intervention_type'
        ],
        aiAutonomyCap: 'suggest',
        certificationRequired: true,
      },
      {
        role: 'Clinical Statistician',
        mandatory: true,
        permissionLevel: 'write',
        blinded: true,
        restrictedVariables: ['treatment_assignment'],
        aiAutonomyCap: 'co-pilot',
        certificationRequired: true,
      },
      {
        role: 'DSMB Auditor',
        mandatory: false,
        permissionLevel: 'read',
        aiAutonomyCap: 'audit-only',
        certificationRequired: true,
      },
    ],
    allowsProspectiveData: true,
    requiresDataSafetyMonitoring: true,
    governanceTemplate: 'RCT-Rigor-v1',
  },

  'prospective-cohort': {
    id: 'prospective-cohort',
    name: 'Prospective Cohort Study',
    description: 'Longitudinal observational study with safety monitoring',
    rigorLevel: 'strict',
    blindingProtocol: 'none',
    requiredPersonas: [
      {
        role: 'Principal Investigator',
        mandatory: true,
        permissionLevel: 'admin',
        aiAutonomyCap: 'supervisor',
        certificationRequired: true,
      },
      {
        role: 'Lead Researcher',
        mandatory: true,
        permissionLevel: 'write',
        aiAutonomyCap: 'co-pilot',
        certificationRequired: false,
      },
      {
        role: 'Clinical Safety Reviewer',
        mandatory: true,
        permissionLevel: 'write',
        exclusiveAccess: ['adverse_events', 'clinical_presentation', 'safety_signals'],
        aiAutonomyCap: 'suggest',
        certificationRequired: true,
      },
      {
        role: 'Data Coordinator',
        mandatory: true,
        permissionLevel: 'write',
        aiAutonomyCap: 'suggest',
        certificationRequired: false,
      },
    ],
    allowsProspectiveData: true,
    requiresDataSafetyMonitoring: true,
    governanceTemplate: 'Cohort-Standard-v1',
  },

  'retrospective-case-series': {
    id: 'retrospective-case-series',
    name: 'Retrospective Case Series',
    description: 'Historical data analysis with restricted data entry',
    rigorLevel: 'standard',
    blindingProtocol: 'none',
    requiredPersonas: [
      {
        role: 'Principal Investigator',
        mandatory: true,
        permissionLevel: 'admin',
        aiAutonomyCap: 'supervisor',
        certificationRequired: true,
      },
      {
        role: 'Lead Scientist',
        mandatory: true,
        permissionLevel: 'write',
        aiAutonomyCap: 'co-pilot',
        certificationRequired: false,
      },
      {
        role: 'Data Entry Student',
        mandatory: false,
        permissionLevel: 'write',
        aiAutonomyCap: 'audit-only',
        restrictedVariables: ['primary_endpoint', 'statistical_analysis'],
        certificationRequired: false,
      },
      {
        role: 'Academic Writing Assistant',
        mandatory: false,
        permissionLevel: 'read',
        aiAutonomyCap: 'co-pilot',
        certificationRequired: false,
      },
    ],
    restrictedFields: ['enrollment_date'], // Must be historical
    allowsProspectiveData: false,
    requiresDataSafetyMonitoring: false,
    governanceTemplate: 'Retrospective-Standard-v1',
  },

  'laboratory-investigation': {
    id: 'laboratory-investigation',
    name: 'Laboratory Investigation',
    description: 'Bench science with focus on precision and p-value verification',
    rigorLevel: 'strict',
    blindingProtocol: 'single',
    requiredPersonas: [
      {
        role: 'Principal Investigator',
        mandatory: true,
        permissionLevel: 'admin',
        aiAutonomyCap: 'supervisor',
        certificationRequired: true,
      },
      {
        role: 'Lab Technician',
        mandatory: true,
        permissionLevel: 'write',
        aiAutonomyCap: 'suggest',
        certificationRequired: false,
      },
      {
        role: 'Statistical Methodology Expert',
        mandatory: true,
        permissionLevel: 'write',
        aiAutonomyCap: 'co-pilot',
        certificationRequired: true,
      },
    ],
    allowsProspectiveData: true,
    requiresDataSafetyMonitoring: false,
    governanceTemplate: 'Laboratory-Precision-v1',
  },

  'technical-note': {
    id: 'technical-note',
    name: 'Technical Note / Case Report',
    description: 'Single-subject narrative with streamlined workflow',
    rigorLevel: 'streamlined',
    blindingProtocol: 'none',
    requiredPersonas: [
      {
        role: 'Principal Investigator',
        mandatory: true,
        permissionLevel: 'admin',
        aiAutonomyCap: 'supervisor',
        certificationRequired: false,
      },
      {
        role: 'Academic Writing Assistant',
        mandatory: false,
        permissionLevel: 'write',
        aiAutonomyCap: 'co-pilot',
        certificationRequired: false,
      },
    ],
    allowsProspectiveData: true,
    requiresDataSafetyMonitoring: false,
    governanceTemplate: 'Case-Report-Streamlined-v1',
  },
};

/**
 * Blinding State Management
 */
export interface BlindingState {
  isBlinded: boolean;
  blindedPersonas: string[];
  unblindingEvent?: {
    timestamp: string;
    performedBy: string;
    userId: string;
    conditionsMet: boolean;
    manifestHash: string;
  };
  placeholderMapping?: Record<string, string>; // e.g., "Group A" -> "Treatment"
}

/**
 * Unblinding Checklist Requirements
 */
export interface UnblindingChecklist {
  protocolPublished: boolean;
  allRecordsComplete: boolean;
  statisticalPlanFrozen: boolean;
  manifestLocked: boolean;
  piSignatureRequired: boolean;
}

/**
 * Helper: Check if study requires blinding
 */
export function requiresBlinding(studyType: StudyType): boolean {
  const config = STUDY_METHODOLOGIES[studyType];
  return config.blindingProtocol !== 'none';
}

/**
 * Helper: Get blinded personas for a study type
 */
export function getBlindedPersonas(studyType: StudyType): string[] {
  const config = STUDY_METHODOLOGIES[studyType];
  return config.requiredPersonas
    .filter(p => p.blinded)
    .map(p => p.role);
}

/**
 * Helper: Get restricted variables for a persona
 */
export function getRestrictedVariables(
  studyType: StudyType, 
  personaRole: string
): string[] {
  const config = STUDY_METHODOLOGIES[studyType];
  const persona = config.requiredPersonas.find(p => p.role === personaRole);
  return persona?.restrictedVariables || [];
}

/**
 * Helper: Validate team configuration
 */
export function validateTeamConfiguration(
  studyType: StudyType,
  assignedPersonas: string[]
): { valid: boolean; missing: string[]; warnings: string[] } {
  const config = STUDY_METHODOLOGIES[studyType];
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check mandatory personas
  config.requiredPersonas
    .filter(p => p.mandatory)
    .forEach(p => {
      if (!assignedPersonas.includes(p.role)) {
        missing.push(p.role);
      }
    });

  // Check for single-author RCT
  if (studyType === 'rct' && assignedPersonas.length === 1) {
    warnings.push(
      'Single-author RCT detected. This may affect Verification Appendix integrity score.'
    );
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}
