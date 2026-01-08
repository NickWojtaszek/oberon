/**
 * VALIDATION SCHEMAS - Single Source of Truth
 * 
 * This module defines strict runtime validation schemas using Zod.
 * ALL data entering the system MUST pass through these validators.
 * 
 * Philosophy:
 * - Fail fast with clear error messages
 * - No silent data conversion or normalization
 * - Make invalid states unrepresentable
 * - Validate at system boundaries (import, user input, API responses)
 */

import { z } from 'zod';

/**
 * ===================
 * CORE DOMAIN SCHEMAS
 * ===================
 */

// Project Schema
export const ProjectSchema = z.object({
  id: z.string().min(1, 'Project ID is required'),
  name: z.string().min(1, 'Project name is required'),
  description: z.string(),
  studyDesign: z.enum(['RCT', 'Observational', 'Case-Control', 'Cohort', 'Cross-Sectional', 'Meta-Analysis']),
  primaryInvestigator: z.string().min(1, 'Primary investigator is required'),
  institution: z.string(),
  phase: z.string(),
  therapeuticArea: z.string(),
  createdAt: z.string().datetime(),
  modifiedAt: z.string().datetime(),
});

// Protocol Schema
export const ProtocolSchema = z.object({
  id: z.string().min(1),
  protocolNumber: z.string().min(1, 'Protocol number is required'),
  version: z.string().min(1, 'Version is required'),
  title: z.string().min(1, 'Title is required'),
  sponsor: z.string(),
  phase: z.string(),
  indication: z.string(),
  objective: z.string(),
  designType: z.string(),
  populationSize: z.number().int().positive('Population size must be positive'),
  endpoints: z.object({
    primary: z.array(z.string()),
    secondary: z.array(z.string()),
  }),
  inclusionCriteria: z.array(z.string()),
  exclusionCriteria: z.array(z.string()),
  statisticalConsiderations: z.string(),
  createdAt: z.number().int().positive(),
  modifiedAt: z.number().int().positive(),
  frozenAt: z.number().int().positive().optional(),
  isFrozen: z.boolean(),
});

/**
 * ===================
 * MANUSCRIPT SCHEMAS
 * ===================
 */

export const SourceExcerptSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  page: z.number().int().positive(),
  section: z.string(),
  citationAnchor: z.string(),
});

export const SourceDocumentSchema = z.object({
  id: z.string().min(1),
  fileName: z.string().min(1),
  fileType: z.enum(['pdf', 'guideline', 'reference']),
  uploadedAt: z.number().int().positive(),
  citationKey: z.string().min(1),
  isGrounded: z.boolean(),
  excerpts: z.array(SourceExcerptSchema).optional(),
});

export const ReviewCommentSchema = z.object({
  id: z.string().min(1),
  timestamp: z.number().int().positive(),
  author: z.string().min(1),
  role: z.enum(['PI', 'Professor', 'Reviewer', 'Statistician']),
  section: z.enum(['introduction', 'methods', 'results', 'discussion', 'conclusion']),
  comment: z.string().min(1),
  severity: z.enum(['info', 'warning', 'critical']),
  resolved: z.boolean(),
});

export const FindingSchema = z.object({
  variable: z.string().min(1),
  fact: z.string().min(1),
  p_value: z.number().optional(),
  significance: z.boolean().optional(),
  comparison: z.string().optional(),
  narrativeTemplate: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  testUsed: z.string().optional(),
});

export const ManuscriptManifestSchema = z.object({
  id: z.string().min(1),
  projectMeta: z.object({
    projectId: z.string().min(1),
    studyTitle: z.string().min(1),
    primaryInvestigator: z.string().min(1),
    protocolRef: z.string(),
    createdAt: z.number().int().positive(),
    modifiedAt: z.number().int().positive(),
  }),
  manuscriptStructure: z.object({
    methods: z.object({
      statisticalPlan: z.object({
        software: z.string(),
        primaryTest: z.string(),
        rationale: z.string(),
      }),
      populationSummary: z.string(),
    }),
    results: z.object({
      primaryFindings: z.array(FindingSchema),
      secondaryFindings: z.array(FindingSchema),
    }),
    discussionAnchors: z.object({
      internalConflicts: z.string(),
      lateralOpportunities: z.array(z.string()),
    }),
  }),
  notebookContext: z.object({
    linkedSources: z.array(SourceDocumentSchema),
    citationMap: z.record(z.string()),
  }),
  manuscriptContent: z.object({
    introduction: z.string(),
    methods: z.string(),
    results: z.string(),
    discussion: z.string(),
    conclusion: z.string(),
  }),
  reviewComments: z.array(ReviewCommentSchema),
});

/**
 * ===================
 * STATISTICAL MANIFEST SCHEMA
 * ===================
 */

export const DescriptiveStatSchema = z.object({
  variable: z.string().min(1),
  n: z.number().int().nonnegative(),
  mean: z.number().optional(),
  median: z.number().optional(),
  sd: z.number().nonnegative().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  q1: z.number().optional(),
  q3: z.number().optional(),
  count: z.number().int().nonnegative().optional(),
  percentage: z.number().min(0).max(100).optional(),
  categories: z.record(z.number()).optional(),
});

export const ComparativeAnalysisSchema = z.object({
  analysisId: z.string().min(1),
  variable: z.string().min(1),
  groupA: z.string().min(1),
  groupB: z.string().min(1),
  testType: z.string(),
  statistic: z.number(),
  pValue: z.number().min(0).max(1),
  confidenceInterval: z.tuple([z.number(), z.number()]).optional(),
  effectSize: z.number().optional(),
  significance: z.boolean(),
});

export const CorrelationResultSchema = z.object({
  variableX: z.string().min(1),
  variableY: z.string().min(1),
  correlationType: z.enum(['Pearson', 'Spearman', 'Kendall']),
  coefficient: z.number().min(-1).max(1),
  pValue: z.number().min(0).max(1),
  significance: z.boolean(),
});

export const RegressionResultSchema = z.object({
  modelId: z.string().min(1),
  dependentVariable: z.string().min(1),
  covariates: z.array(z.string().min(1)),
  modelType: z.enum(['Linear', 'Logistic', 'Cox Proportional Hazards']),
  results: z.object({
    coefficients: z.record(z.number()),
    standardErrors: z.record(z.number()),
    pValues: z.record(z.number()),
    confidenceIntervals: z.record(z.tuple([z.number(), z.number()])),
    rSquared: z.number().min(0).max(1).optional(),
    adjustedRSquared: z.number().min(0).max(1).optional(),
    aic: z.number().optional(),
    bic: z.number().optional(),
  }),
});

export const StatisticalManifestSchema = z.object({
  manifestMetadata: z.object({
    projectId: z.string().min(1),
    protocolId: z.string().min(1),
    protocolVersion: z.string().min(1),
    generatedAt: z.number().int().positive(),
    generatedBy: z.string().min(1),
    totalRecordsAnalyzed: z.number().int().nonnegative(),
    personaValidation: z.string(),
  }),
  descriptiveStats: z.array(DescriptiveStatSchema),
  comparativeAnalyses: z.array(ComparativeAnalysisSchema),
  correlations: z.array(CorrelationResultSchema).optional(),
  regressions: z.array(RegressionResultSchema).optional(),
  manuscriptSnippets: z.object({
    methods: z.string(),
    results: z.string(),
    tables: z.array(z.string()),
    figures: z.array(z.string()),
  }),
});

/**
 * ===================
 * CLINICAL DATA SCHEMA
 * ===================
 */

export const ClinicalDataRecordSchema = z.object({
  id: z.string().min(1),
  protocolNumber: z.string().min(1),
  protocolVersion: z.string().min(1),
  recordedAt: z.number().int().positive(),
  recordedBy: z.string().min(1),
  data: z.record(z.unknown()), // Flexible data structure
  auditTrail: z.array(z.object({
    timestamp: z.number().int().positive(),
    user: z.string(),
    action: z.string(),
    changes: z.record(z.unknown()),
  })).optional(),
});

/**
 * ===================
 * PERSONA & TEMPLATE SCHEMAS
 * ===================
 */

export const UserPersonaSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.enum(['PI', 'Biostatistician', 'ClinicalResearcher', 'RegulatoryAffairs', 'DataManager', 'Custom']),
  permissions: z.object({
    canEditProtocols: z.boolean(),
    canFreezeSchemas: z.boolean(),
    canDeleteData: z.boolean(),
    canExportData: z.boolean(),
    canManagePersonas: z.boolean(),
  }),
  customSettings: z.record(z.unknown()).optional(),
});

export const SchemaTemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string(),
  description: z.string(),
  fields: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    type: z.enum(['text', 'number', 'date', 'select', 'boolean', 'textarea']),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
    validation: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional(),
    }).optional(),
  })),
  createdAt: z.number().int().positive(),
  modifiedAt: z.number().int().positive(),
});

/**
 * ===================
 * IMPORT/EXPORT SCHEMAS
 * ===================
 */

export const ProjectExportSchema = z.object({
  project: ProjectSchema,
  protocols: z.array(ProtocolSchema),
  clinicalData: z.array(ClinicalDataRecordSchema),
  manuscripts: z.array(ManuscriptManifestSchema),
  statisticalManifests: z.array(StatisticalManifestSchema),
  personas: z.array(UserPersonaSchema),
  templates: z.array(SchemaTemplateSchema),
});

export const FullExportSchema = z.object({
  exportMetadata: z.object({
    version: z.string().min(1),
    exportedAt: z.string().datetime(),
    exportedBy: z.string(),
    description: z.string().optional(),
    schemaVersion: z.string().min(1),
  }),
  projects: z.array(ProjectExportSchema),
  globalPersonas: z.array(UserPersonaSchema),
  globalTemplates: z.array(SchemaTemplateSchema),
});

/**
 * ===================
 * TYPE EXPORTS (Inferred from Zod)
 * ===================
 */

export type Project = z.infer<typeof ProjectSchema>;
export type Protocol = z.infer<typeof ProtocolSchema>;
export type ManuscriptManifest = z.infer<typeof ManuscriptManifestSchema>;
export type StatisticalManifest = z.infer<typeof StatisticalManifestSchema>;
export type ClinicalDataRecord = z.infer<typeof ClinicalDataRecordSchema>;
export type UserPersona = z.infer<typeof UserPersonaSchema>;
export type SchemaTemplate = z.infer<typeof SchemaTemplateSchema>;
export type ProjectExport = z.infer<typeof ProjectExportSchema>;
export type FullExport = z.infer<typeof FullExportSchema>;
