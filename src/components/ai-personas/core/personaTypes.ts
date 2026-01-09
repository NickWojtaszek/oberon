// Unified AI Persona Framework - Core Type Definitions

export type PersonaId = 
  | 'protocol-auditor'
  | 'schema-architect' 
  | 'statistical-advisor'
  | 'data-quality-sentinel'
  | 'ethics-compliance'
  | 'safety-vigilance'
  | 'endpoint-validator'
  | 'amendment-advisor'
  | 'academic-writing-coach'
  | 'manuscript-reviewer'
  | 'hypothesis-architect';

/**
 * The Oberon System's Fairy Court classification
 * - Seelie: Co-pilots that help build and guide (growth, creativity, support)
 * - Unseelie: Auditors that validate and constrain (truth, limits, enforcement)
 */
export type FairyCourt = 'seelie' | 'unseelie';

export type StudyType = 
  | 'rct'
  | 'observational'
  | 'single-arm'
  | 'diagnostic'
  | 'registry'
  | 'phase-1'
  | 'phase-2'
  | 'phase-3'
  | 'phase-4'
  | 'medical-device';

export type RegulatoryFramework = 'FDA' | 'EMA' | 'PMDA' | 'ICH-GCP' | 'HIPAA';

export type ValidationSeverity = 'critical' | 'warning' | 'info' | 'success';

export type ValidationCategory = 
  | 'protocol-text'
  | 'schema'
  | 'dependency'
  | 'cross-validation'
  | 'regulatory'
  | 'statistical'
  | 'data-quality'
  | 'ethics'
  | 'safety';

export interface ValidationIssue {
  id: string;
  personaId: PersonaId;
  severity: ValidationSeverity;
  category: ValidationCategory;
  title: string;
  description: string;
  recommendation: string;
  location: {
    module: string; // 'protocol', 'schema', 'database', 'ethics', etc.
    tab?: string;
    fieldId?: string;
    blockId?: string;
    sectionName?: string;
  };
  regulatoryReference?: string;
  autoFixAvailable?: boolean;
  studyTypeSpecific?: boolean;
}

export interface ValidationRule {
  id: string;
  name: string;
  personaId: PersonaId;
  category: ValidationCategory;
  severity: ValidationSeverity;
  description: string;
  applicableStudyTypes?: StudyType[]; // If undefined, applies to all
  applicablePhases?: string[]; // 'Phase I', 'Phase II', etc.
  regulatoryFrameworks?: RegulatoryFramework[];
  check: (context: ValidationContext) => ValidationIssue[];
}

export interface ValidationContext {
  // Protocol data
  protocolMetadata?: any;
  protocolContent?: any;
  studyDesign?: {
    type: StudyType;
    phase?: string;
    isBlinded?: boolean;
    isRandomized?: boolean;
  };
  
  // Schema data
  schemaBlocks?: any[];
  dependencies?: any[];
  
  // Database data
  records?: any[];
  dataCollectionStats?: any;
  
  // Ethics data
  irbStatus?: any;
  consentForms?: any[];
  
  // Statistical data
  statisticalPlan?: any;
  analysisDatasets?: any[];
  
  // Safety data
  adverseEvents?: any[];
  seriousAdverseEvents?: any[];
  
  // Regulatory context
  regulatoryFrameworks?: RegulatoryFramework[];
  
  // User context
  userRole?: string;
  currentProject?: any;
}

export interface ValidationResult {
  personaId: PersonaId;
  timestamp: string;
  issues: ValidationIssue[];
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  successCount: number;
  totalIssues: number;
  complianceScore: number; // 0-100
  canProceed: boolean;
  blockedReasons: string[];
  executionTime: number; // milliseconds
}

export interface PersonaConfig {
  id: PersonaId;
  name: string;
  fairyName: string; // e.g., "Dr. Mab" - the folklore-inspired display name
  court: FairyCourt; // 'seelie' (co-pilot) or 'unseelie' (auditor)
  description: string;
  studyTypeDescription?: string; // Explains which study types this persona serves
  folkloreOrigin?: string; // Brief explanation of the name's folklore origin
  icon: string; // Lucide icon name
  color: PersonaColor;
  defaultActive: boolean;
  priority: number; // Lower = higher priority
  
  // Study type applicability
  applicableStudyTypes?: StudyType[];
  requiredForStudyTypes?: StudyType[]; // Cannot be disabled for these
  
  // Module integration
  modules: PersonaModule[];
  
  // Validation configuration
  validationRules: string[]; // Rule IDs from registry
  realTimeValidation: boolean;
  batchValidation: boolean;
  
  // UI configuration
  sidebar?: PersonaSidebarConfig;
  modal?: PersonaModalConfig;
  statusIndicator?: PersonaStatusConfig;
}

export interface PersonaColor {
  primary: string; // e.g., 'purple'
  bg: string; // e.g., 'bg-purple-50'
  border: string; // e.g., 'border-purple-200'
  text: string; // e.g., 'text-purple-900'
  icon: string; // e.g., 'text-purple-600'
}

export type PersonaModule = 
  | 'protocol-workbench'
  | 'schema-builder'
  | 'database'
  | 'analytics'
  | 'academic-writing'
  | 'ethics-board'
  | 'safety-monitoring';

export interface PersonaSidebarConfig {
  enabled: boolean;
  title: string;
  showValidationStatus: boolean;
  showRecommendations: boolean;
  showRegulatoryReferences: boolean;
  sections: PersonaSidebarSection[];
}

export interface PersonaSidebarSection {
  id: string;
  title: string;
  type: 'guidance' | 'examples' | 'best-practices' | 'warnings' | 'checklist';
  content: string[] | ((context: ValidationContext) => string[]);
  icon?: string; // Lucide icon name
}

export interface PersonaModalConfig {
  enabled: boolean;
  title: string;
  showComplianceScore: boolean;
  showIssueBreakdown: boolean;
  allowProceedWithWarnings: boolean;
  requireAcknowledgment: boolean;
}

export interface PersonaStatusConfig {
  enabled: boolean;
  showInGlobalHeader: boolean;
  showInModuleHeader: boolean;
  showInline: boolean;
  badgeStyle: 'icon' | 'text' | 'score' | 'progress';
}

export interface PersonaState {
  personaId: PersonaId;
  active: boolean;
  lastValidation?: ValidationResult;
  isValidating: boolean;
  autoValidateEnabled: boolean;
  config: PersonaConfig;
}

export interface PersonaManagerState {
  personas: Record<PersonaId, PersonaState>;
  studyType?: StudyType;
  regulatoryFrameworks: RegulatoryFramework[];
  globalValidationEnabled: boolean;
}

// Helper type for persona actions
export type PersonaAction = 
  | { type: 'ACTIVATE_PERSONA'; personaId: PersonaId }
  | { type: 'DEACTIVATE_PERSONA'; personaId: PersonaId }
  | { type: 'SET_STUDY_TYPE'; studyType: StudyType }
  | { type: 'ADD_REGULATORY_FRAMEWORK'; framework: RegulatoryFramework }
  | { type: 'REMOVE_REGULATORY_FRAMEWORK'; framework: RegulatoryFramework }
  | { type: 'UPDATE_VALIDATION_RESULT'; personaId: PersonaId; result: ValidationResult }
  | { type: 'START_VALIDATION'; personaId: PersonaId }
  | { type: 'TOGGLE_AUTO_VALIDATE'; personaId: PersonaId }
  | { type: 'ENABLE_ALL_PERSONAS' }
  | { type: 'DISABLE_ALL_PERSONAS' }
  | { type: 'RESET_PERSONAS' };