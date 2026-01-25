// Type definitions for Protocol Workbench

export type DataType = 'Continuous' | 'Categorical' | 'Boolean' | 'Date' | 'Text' | 'Multi-Select' | 'Conditional' | 'Grid' | 'Section' | 'Ranked-Matrix' | 'Categorical-Grid';
export type RoleTag = 'Predictor' | 'Outcome' | 'Structure' | 'All';
export type VariableCategory = 'Demographics' | 'Treatments' | 'Endpoints' | 'Clinical' | 'Laboratory' | 'Structural' | 'Vitals' | 'Labs' | 'Safety' | 'Efficacy' | 'Quality of Life' | 'Medical History' | 'Biomarkers' | 'Imaging' | 'Medications' | 'Adverse Events' | 'Procedures' | 'Questionnaires' | 'Other';
export type WorkbenchState = 'blueprint' | 'mapping' | 'review-mapping' | 'production';

// Statistical role types for AI-assisted variable mapping
export type StatisticalRole =
  | 'primary_endpoint'
  | 'secondary_endpoint'
  | 'safety_endpoint'
  | 'baseline_covariate'
  | 'confounder'
  | 'subgroup_variable'
  | 'treatment_indicator'
  | 'time_variable'
  | 'excluded';

export interface Variable {
  id: string;
  name: string;
  category: VariableCategory;
  icon: any;
  defaultType: DataType;
  defaultUnit?: string;
  isPII?: boolean;
  isCustom?: boolean;
  customScope?: 'user' | 'institution';
  customConfig?: {
    options?: string[];
    gridItems?: string[];
    gridCategories?: string[];
    matrixRows?: string[];
    clinicalRange?: { min: number; max: number; unit: string };
  };
}

export interface SchemaBlock {
  id: string;
  variable: Variable;
  dataType: DataType;
  role: RoleTag;
  isPrimary?: boolean; // Deprecated - use endpointTier instead
  endpointTier?: 'primary' | 'secondary' | 'exploratory' | null;
  analysisMethod?: 'survival' | 'frequency' | 'mean-comparison' | 'non-parametric' | 'chi-square' | null;
  isMapped?: boolean;
  mappingConfidence?: number;
  csvColumn?: string;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  children?: SchemaBlock[];
  isExpanded?: boolean;
  parentId?: string;
  conditionalOn?: string;
  conditionalValue?: string;
  options?: string[];
  clinicalRange?: { min: number; max: number; unit: string };
  versionTag?: string;
  versionColor?: 'blue' | 'green' | 'purple' | 'amber';
  dependencies?: string[]; // Deprecated - use conditionalDependencies instead
  conditionalDependencies?: ConditionalDependency[];
  matrixRows?: string[];
  gridItems?: string[];
  gridCategories?: string[];
  customName?: string;
  isCustom?: boolean;
  lockedSource?: string; // Reference to locked knowledge source
  // AI statistical mapping fields
  statisticalRole?: StatisticalRole;
  aiSuggestedRole?: StatisticalRole;
  roleConfirmed?: boolean;
}

export interface ConditionalDependency {
  id: string;
  targetBlockId: string; // The block that will be shown/hidden
  condition: {
    operator: 'equals' | 'not-equals' | 'greater-than' | 'less-than' | 'contains' | 'exists';
    value?: string | number;
  };
  action: 'show' | 'hide' | 'require' | 'disable';
}

export interface CSVHeader {
  detected: string;
  suggested: string;
  confidence: number;
  isPII?: boolean;
}

export interface DataDistribution {
  type: 'continuous' | 'categorical';
  values: number[];
  labels?: string[];
  mean?: number;
  median?: number;
  min?: number;
  max?: number;
}

export interface AISuggestion {
  id: string;
  type: 'data-type' | 'endpoint-tier' | 'analysis-warning' | 'schema-completion' | 'version-tag';
  triggerBlockId?: string;
  variableName: string;
  message: string;
  rationale: string; // Statistical/clinical justification
  action: Partial<SchemaBlock> | { addFields?: string[] };
  source: string;
  confidence: number;
  icon: any;
  suggestedTest?: string; // Recommended statistical test
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  type: 'suggestion-generated' | 'suggestion-accepted' | 'suggestion-dismissed' | 'field-added' | 'field-modified' | 'schema-locked';
  actor: 'System AI' | 'User';
  variableName?: string;
  action: string;
  rationale?: string;
  source?: string;
}

export interface ProtocolVersion {
  id: string;
  versionNumber: string; // e.g., "1.0", "1.1", "2.0"
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  modifiedAt: Date;
  createdBy: string;
  modifiedBy: string;
  metadata: {
    protocolTitle: string;
    protocolNumber: string;
    principalInvestigator: string;
    sponsor: string;
    studyPhase: string;
    therapeuticArea: string;
    estimatedEnrollment: string;
    studyDuration: string;
  };
  schemaBlocks: SchemaBlock[];
  protocolContent: {
    primaryObjective?: string;
    secondaryObjectives?: string;
    inclusionCriteria?: string;
    exclusionCriteria?: string;
    statisticalPlan?: string;
  };
  changeLog?: string; // Description of changes in this version
}

export interface SavedProtocol {
  id: string;
  protocolNumber: string;
  protocolTitle: string;
  currentVersion: string;
  latestDraftVersion?: string;
  versions: ProtocolVersion[];
  createdAt: Date;
  modifiedAt: Date;
}

export interface SchemaTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Phase I' | 'Phase II' | 'Phase III' | 'Phase IV' | 'Observational' | 'Registry' | 'Custom';
  therapeuticArea?: string;
  schemaBlocks: SchemaBlock[];
  isSystem: boolean; // true for pre-built, false for user-created
  createdBy: string;
  createdAt: Date;
  modifiedAt: Date;
  usageCount?: number;
  tags?: string[];
}

// AI Statistical Planning types
export interface StatisticalMapping {
  blockId: string;
  blockLabel: string;
  suggestedRole: StatisticalRole;
  confidence: number; // 0-1, AI confidence in suggestion
  reasoning: string; // Why AI suggested this role
  confirmed: boolean; // User checkbox state
}

export interface AIStatisticalPlan {
  id: string;
  protocolId: string;
  createdAt: string;
  picoContext: {
    population: string;
    intervention: string;
    comparison: string;
    outcome: string;
  };
  mappings: StatisticalMapping[];
  status: 'draft' | 'confirmed';
}
