/**
 * Comprehensive Data Export/Import System
 * 
 * This utility provides a complete snapshot of the Clinical Intelligence Engine state,
 * including all projects, protocols, manuscripts, clinical data, and configurations.
 * 
 * Use this to:
 * 1. Export current state to JSON
 * 2. Generate mock data templates for AI filling
 * 3. Import pre-filled mock data for testing
 * 4. Backup/restore entire application state
 */

import { storage } from './storageService';
import type { Project, SavedProtocol, UserPersona, SchemaTemplate } from '../types/shared';
import type { ClinicalDataRecord } from './dataStorage';
import type { StatisticalManifest } from '../components/analytics-stats/types';
import type { ManuscriptManifest } from '../types/manuscript';

/**
 * Complete system state snapshot
 */
export interface ComprehensiveDataExport {
  exportMetadata: ExportMetadata;
  projects: ProjectExport[];
  globalTemplates: SchemaTemplate[];
  globalPersonas: UserPersona[];
}

export interface ExportMetadata {
  version: string;
  exportedAt: number;
  exportedBy: string;
  applicationVersion: string;
  description?: string;
  totalProjects: number;
  totalProtocols: number;
  totalManuscripts: number;
  totalClinicalRecords: number;
}

export interface ProjectExport {
  project: Project;
  protocols: SavedProtocol[];
  clinicalData: ClinicalDataRecord[];
  manuscripts: ManuscriptManifest[];
  statisticalManifests: StatisticalManifest[];
  personas: UserPersona[];
  templates: SchemaTemplate[];
}

/**
 * Mock data template with field documentation
 */
export interface MockDataTemplate {
  templateMetadata: {
    purpose: string;
    instructions: string;
    version: string;
  };
  projectTemplate: {
    // Project Configuration
    name: string; // e.g., "Phase III Cardiology Study"
    description: string; // Brief study description
    studyDesign: 'RCT' | 'cohort' | 'case-series' | 'laboratory' | 'technical-note';
    primaryInvestigator: string; // e.g., "Dr. Jane Smith"
    institution: string;
    phase: string; // e.g., "Phase III"
    therapeuticArea: string; // e.g., "Cardiology"
    
    // Study Settings
    settings: {
      patientCount: number;
      enrollmentStart: string; // ISO date
      enrollmentEnd: string; // ISO date
      followUpDuration: string; // e.g., "12 months"
      primaryEndpoint: string;
      secondaryEndpoints: string[];
      inclusionCriteria: string[];
      exclusionCriteria: string[];
      statisticalPower: number; // 0.8 for 80%
      alphaLevel: number; // 0.05 for 5%
      randomizationRatio: string; // e.g., "1:1"
      blindingStrategy: 'open-label' | 'single-blind' | 'double-blind' | 'triple-blind';
      interventions: {
        name: string;
        type: 'drug' | 'device' | 'procedure' | 'behavioral';
        dosage?: string;
        frequency?: string;
        duration?: string;
      }[];
    };
  };
  
  protocolTemplate: {
    protocolNumber: string; // e.g., "PROTO-2024-001"
    protocolTitle: string;
    version: string; // e.g., "1.0.0"
    status: 'draft' | 'in-review' | 'published' | 'archived';
    
    // Full protocol metadata (matches ProtocolMetadata from types/shared.ts)
    metadata: {
      protocolTitle: string;
      protocolNumber: string;
      principalInvestigator: string; // e.g., "Dr. Jane Smith, MD"
      sponsor: string; // e.g., "ACME Pharmaceuticals"
      studyPhase: string; // e.g., "Phase III"
      therapeuticArea: string; // e.g., "Cardiology - Hypertension"
      estimatedEnrollment: string; // e.g., "300 patients"
      studyDuration: string; // e.g., "12 months enrollment + 12 months follow-up"
    };
    
    // Protocol content (matches ProtocolContent from types/shared.ts)
    protocolContent: {
      primaryObjective: string; // e.g., "Evaluate efficacy of ACE-X on BP reduction"
      secondaryObjectives: string; // e.g., "Assess safety, CV outcomes, QoL"
      inclusionCriteria: string; // Full text of inclusion criteria
      exclusionCriteria: string; // Full text of exclusion criteria
      statisticalPlan: string; // Detailed statistical analysis plan
    };
    
    // Schema blocks (hierarchical structure matching SchemaBlock from types/shared.ts)
    schemaBlocks: {
      id: string; // Unique identifier
      type: 'section' | 'endpoint' | 'variable' | 'text' | 'matrix' | 'categorical';
      title: string; // e.g., "Baseline Demographics"
      description?: string;
      content?: string;
      level?: number; // Nesting level (0 = top level)
      
      // Hierarchical structure
      children?: any[]; // Nested schema blocks (recursive structure)
      
      // Categorical/Matrix specific fields
      categories?: string[]; // For categorical type: ["Male", "Female", "Other"]
      rows?: string[]; // For matrix type: row labels
      columns?: string[]; // For matrix type: column labels
      
      // Logic Link system (dependencies between variables)
      dependencies?: string[]; // IDs of blocks this depends on
      conditions?: any[]; // Conditional logic rules
      
      // Rich metadata
      metadata?: {
        dataType?: string; // 'text' | 'number' | 'date' | 'boolean' | 'select'
        required?: boolean; // Is this field mandatory?
        validation?: any; // Validation rules (min/max, regex, etc.)
        aiGenerated?: boolean; // Was this auto-generated?
        confidence?: number; // AI confidence score (0-1)
        lastModified?: string; // ISO date
        modifiedBy?: string; // User who last modified
        tags?: string[]; // Categorization tags
        notes?: string; // Clinical notes/comments
      };
    }[];
    
    // Version control fields
    locked?: boolean; // Is schema locked for data collection?
    lockedAt?: string; // ISO date when locked
    lockedBy?: string; // User who locked it
    hasCollectedData?: boolean; // Are there data records using this version?
    dataRecordCount?: number; // Number of records using this schema
    changeLog?: string; // Version change description
    tags?: string[]; // Protocol-level tags
  };
  
  clinicalDataTemplate: {
    records: {
      recordId: string; // Auto-generated: "{subjectId}_{visitNumber}_{timestamp}"
      subjectId: string; // e.g., "SUBJ-001"
      visitNumber: string | null; // e.g., "1", "2", "baseline", null for unscheduled
      enrollmentDate: string; // ISO date when patient enrolled
      collectedAt: string; // ISO date when data was collected
      collectedBy: string; // Username or ID of data entry person
      protocolNumber: string; // Links to protocol
      protocolVersion: string; // Links to specific protocol version
      lastModified: string; // ISO date of last modification
      
      // Status tracking
      status: 'draft' | 'complete'; // Data collection status
      
      // Nested data structure matching Database schema
      // Top level: tableId (corresponds to schemaBlock sections)
      // Second level: fieldId (corresponds to individual variables)
      data: {
        [tableId: string]: { // e.g., "demographics", "vital-signs-visit-1"
          [fieldId: string]: any; // e.g., "age": 65, "sex": "Male"
        };
      };
      
      // Data queries/clarifications
      queries?: {
        tableId: string; // Which table/section
        fieldId: string; // Which specific field
        query: string; // Query text: "Please clarify if this is pre or post dose"
        raisedBy: string; // Who raised the query
        raisedAt: number; // Timestamp
        response?: string; // Response to query
        respondedBy?: string; // Who responded
        respondedAt?: number; // Response timestamp
        resolved: boolean; // Is query resolved?
      }[];
    }[];
  };
  
  manuscriptTemplate: {
    projectId: string;
    studyTitle: string;
    primaryInvestigator: string;
    
    // IMRaD Content
    manuscriptContent: {
      introduction: string; // Background, rationale, objectives
      methods: string; // Study design, population, procedures, statistics
      results: string; // Primary findings, secondary findings, tables/figures
      discussion: string; // Interpretation, limitations, clinical implications
      conclusion: string; // Summary of key findings
    };
    
    // Source documents for citations
    linkedSources: {
      id: string;
      title: string;
      authors: string[];
      year: number;
      journal: string;
      doi?: string;
      pmid?: string;
      abstract: string;
      keyFindings: string[];
      citationKey: string; // e.g., "Smith_2023"
    }[];
    
    // Review comments
    reviewComments: {
      id: string;
      section: 'introduction' | 'methods' | 'results' | 'discussion' | 'conclusion';
      lineNumber?: number;
      comment: string;
      severity: 'info' | 'suggestion' | 'required' | 'critical';
      author: string;
      timestamp: number;
      resolved: boolean;
    }[];
  };
  
  statisticalManifestTemplate: {
    protocolId: string;
    protocolVersion: string;
    analysisDate: string; // ISO date
    statistician: string;
    
    descriptiveStats: {
      variableId: string;
      label: string;
      n: number;
      mean?: number;
      median?: number;
      stdDev?: number;
      min?: number;
      max?: number;
      q1?: number;
      q3?: number;
      frequencies?: { [key: string]: number };
      missing: number;
      outliers?: number[];
    }[];
    
    comparativeAnalyses: {
      id: string;
      testType: 'ttest' | 'chi-square' | 'fisher' | 'mann-whitney' | 'anova' | 'kruskal-wallis';
      variable1: string;
      variable2?: string;
      groups: string[];
      testStatistic: number;
      degreesOfFreedom?: number;
      pValue: number;
      confidenceInterval?: { lower: number; upper: number };
      effectSize?: number;
      interpretation: string;
      clinicalSignificance?: string;
    }[];
    
    advancedModeling: {
      modelId: string;
      modelType: 'linear-regression' | 'logistic-regression' | 'cox-regression' | 'survival' | 'mixed-effects';
      outcome: string;
      predictors: string[];
      coefficients: {
        variable: string;
        beta: number;
        standardError: number;
        zValue: number;
        pValue: number;
        oddsRatio?: number;
        hazardRatio?: number;
      }[];
      goodnessOfFit: {
        rSquared?: number;
        adjustedRSquared?: number;
        aic?: number;
        bic?: number;
        logLikelihood?: number;
      };
    }[];
  };
  
  personaTemplate: {
    id: string;
    name: string; // e.g., "Senior Biostatistician"
    role: 'PI' | 'statistician' | 'clinician' | 'coordinator' | 'regulator' | 'data-manager';
    description: string;
    
    permissions: {
      canEditProtocol: boolean;
      canPublishProtocol: boolean;
      canEnterData: boolean;
      canVerifyData: boolean;
      canLockData: boolean;
      canAnalyzeData: boolean;
      canExportData: boolean;
      canManageUsers: boolean;
    };
    
    preferences: {
      defaultView: string;
      notificationSettings: {
        email: boolean;
        inApp: boolean;
      };
      analysisDefaults: {
        confidenceLevel: number;
        significanceLevel: number;
        preferredTests: string[];
      };
    };
    
    createdAt: number;
    lockedAt?: number;
    lockedBy?: string;
    lockReason?: string;
  };
  
  schemaTemplateTemplate: {
    id: string;
    name: string; // e.g., "FDA Cardiology Endpoints"
    category: string;
    description: string;
    
    blocks: {
      id: string;
      label: string;
      dataType: string;
      category: string;
      required: boolean;
      options?: string[];
      unit?: string;
      validationRules?: any;
    }[];
    
    metadata: {
      source: string; // e.g., "FDA Guidance Document"
      version: string;
      lastUpdated: number;
      regulatoryFramework?: string;
      applicableTo: string[]; // Therapeutic areas
    };
  };
}

/**
 * Main export class
 */
export class ComprehensiveDataExporter {
  /**
   * Export complete system state
   */
  exportAll(description?: string): ComprehensiveDataExport {
    const allProjects = storage.projects.getAll();
    const globalTemplates = storage.templates.getAll();
    const globalPersonas = storage.personas.getAll();
    
    let totalProtocols = 0;
    let totalManuscripts = 0;
    let totalClinicalRecords = 0;
    
    const projectExports: ProjectExport[] = allProjects.map(project => {
      const protocols = storage.protocols.getAll(project.id);
      const clinicalData = storage.clinicalData.getAll(project.id);
      const manuscripts = storage.manuscripts.getAll(project.id);
      const statisticalManifests = storage.statisticalManifests.getAll(project.id);
      const personas = storage.personas.getAll(project.id);
      const templates = storage.templates.getAll(project.id);
      
      totalProtocols += protocols.length;
      totalManuscripts += manuscripts.length;
      totalClinicalRecords += clinicalData.length;
      
      return {
        project,
        protocols,
        clinicalData,
        manuscripts,
        statisticalManifests,
        personas,
        templates,
      };
    });
    
    return {
      exportMetadata: {
        version: '1.0.0',
        exportedAt: Date.now(),
        exportedBy: 'System Export',
        applicationVersion: '1.0.0',
        description,
        totalProjects: allProjects.length,
        totalProtocols,
        totalManuscripts,
        totalClinicalRecords,
      },
      projects: projectExports,
      globalTemplates,
      globalPersonas,
    };
  }
  
  /**
   * Export specific project
   */
  exportProject(projectId: string): ProjectExport | null {
    const project = storage.projects.getById(projectId);
    if (!project) return null;
    
    return {
      project,
      protocols: storage.protocols.getAll(projectId),
      clinicalData: storage.clinicalData.getAll(projectId),
      manuscripts: storage.manuscripts.getAll(projectId),
      statisticalManifests: storage.statisticalManifests.getAll(projectId),
      personas: storage.personas.getAll(projectId),
      templates: storage.templates.getAll(projectId),
    };
  }
  
  /**
   * Generate empty mock data template with documentation
   */
  generateMockDataTemplate(): MockDataTemplate {
    return {
      templateMetadata: {
        purpose: 'Mock data template for AI-assisted data generation',
        instructions: `
          Fill in this template with realistic clinical trial data.
          
          Guidelines:
          1. Use medically accurate terminology
          2. Ensure data consistency across related fields
          3. Follow realistic ranges for clinical measurements
          4. Include variety in patient demographics and outcomes
          5. Add realistic adverse events and clinical observations
          
          Example use case:
          "Generate a Phase III cardiovascular study with 300 patients testing a novel 
          ACE inhibitor vs placebo, measuring blood pressure, cardiac events, and 
          quality of life over 12 months."
        `,
        version: '1.0.0',
      },
      projectTemplate: {
        name: '',
        description: '',
        studyDesign: 'RCT',
        primaryInvestigator: '',
        institution: '',
        phase: '',
        therapeuticArea: '',
        settings: {
          patientCount: 0,
          enrollmentStart: '',
          enrollmentEnd: '',
          followUpDuration: '',
          primaryEndpoint: '',
          secondaryEndpoints: [],
          inclusionCriteria: [],
          exclusionCriteria: [],
          statisticalPower: 0.8,
          alphaLevel: 0.05,
          randomizationRatio: '1:1',
          blindingStrategy: 'double-blind',
          interventions: [],
        },
      },
      protocolTemplate: {
        protocolNumber: '',
        protocolTitle: '',
        version: '1.0.0',
        status: 'draft',
        metadata: {
          protocolTitle: '',
          protocolNumber: '',
          principalInvestigator: '',
          sponsor: '',
          studyPhase: '',
          therapeuticArea: '',
          estimatedEnrollment: '',
          studyDuration: '',
        },
        protocolContent: {
          primaryObjective: '',
          secondaryObjectives: '',
          inclusionCriteria: '',
          exclusionCriteria: '',
          statisticalPlan: '',
        },
        schemaBlocks: [],
        locked: false,
        lockedAt: '',
        lockedBy: '',
        hasCollectedData: false,
        dataRecordCount: 0,
        changeLog: '',
        tags: [],
      },
      clinicalDataTemplate: {
        records: [],
      },
      manuscriptTemplate: {
        projectId: '',
        studyTitle: '',
        primaryInvestigator: '',
        manuscriptContent: {
          introduction: '',
          methods: '',
          results: '',
          discussion: '',
          conclusion: '',
        },
        linkedSources: [],
        reviewComments: [],
      },
      statisticalManifestTemplate: {
        protocolId: '',
        protocolVersion: '',
        analysisDate: '',
        statistician: '',
        descriptiveStats: [],
        comparativeAnalyses: [],
        advancedModeling: [],
      },
      personaTemplate: {
        id: '',
        name: '',
        role: 'PI',
        description: '',
        permissions: {
          canEditProtocol: true,
          canPublishProtocol: true,
          canEnterData: true,
          canVerifyData: true,
          canLockData: true,
          canAnalyzeData: true,
          canExportData: true,
          canManageUsers: true,
        },
        preferences: {
          defaultView: 'dashboard',
          notificationSettings: {
            email: true,
            inApp: true,
          },
          analysisDefaults: {
            confidenceLevel: 0.95,
            significanceLevel: 0.05,
            preferredTests: [],
          },
        },
        createdAt: Date.now(),
      },
      schemaTemplateTemplate: {
        id: '',
        name: '',
        category: '',
        description: '',
        blocks: [],
        metadata: {
          source: '',
          version: '1.0.0',
          lastUpdated: Date.now(),
          applicableTo: [],
        },
      },
    };
  }
  
  /**
   * Import complete system state
   */
  importAll(data: ComprehensiveDataExport, options: ImportOptions = {}): ImportResult {
    const result: ImportResult = {
      success: true,
      projectsImported: 0,
      protocolsImported: 0,
      manuscriptsImported: 0,
      clinicalRecordsImported: 0,
      errors: [],
      warnings: [],
    };
    
    try {
      // Validate data structure
      if (!this.validateExportStructure(data)) {
        result.success = false;
        result.errors.push('Invalid data structure');
        return result;
      }
      
      // Import global templates
      if (data.globalTemplates && data.globalTemplates.length > 0) {
        if (options.mergeMode === 'replace') {
          storage.templates.save(data.globalTemplates);
        } else {
          const existing = storage.templates.getAll();
          const merged = this.mergeArrays(existing, data.globalTemplates, 'id');
          storage.templates.save(merged);
        }
      }
      
      // Import global personas
      if (data.globalPersonas && data.globalPersonas.length > 0) {
        if (options.mergeMode === 'replace') {
          storage.personas.save(data.globalPersonas);
        } else {
          const existing = storage.personas.getAll();
          const merged = this.mergeArrays(existing, data.globalPersonas, 'id');
          storage.personas.save(merged);
        }
      }
      
      // Import projects
      for (const projectExport of data.projects) {
        try {
          this.importProject(projectExport, options);
          result.projectsImported++;
          
          // ✅ FIX: Safely get project name from either structure
          const projectName = ('project' in projectExport && projectExport.project) 
            ? projectExport.project.name 
            : ((projectExport as any).projectName || (projectExport as any).name || 'Unknown');
          
          result.protocolsImported += (projectExport.protocols?.length || 0);
          result.manuscriptsImported += (projectExport.manuscripts?.length || 0);
          result.clinicalRecordsImported += (projectExport.clinicalData?.length || 0);
        } catch (error) {
          const projectName = ('project' in projectExport && projectExport.project) 
            ? projectExport.project.name 
            : ((projectExport as any).projectName || (projectExport as any).name || 'Unknown');
          result.errors.push(`Failed to import project ${projectName}: ${error}`);
        }
      }
      
      if (result.errors.length > 0) {
        result.success = false;
      }
      
    } catch (error) {
      result.success = false;
      result.errors.push(`Import failed: ${error}`);
    }
    
    return result;
  }
  
  /**
   * Import single project
   */
  importProject(projectExport: ProjectExport, options: ImportOptions = {}): void {
    // ✅ FIX: Handle both nested and flat project structures
    let project: Project;
    let protocols: SavedProtocol[];
    let clinicalData: ClinicalDataRecord[];
    let manuscripts: ManuscriptManifest[];
    let statisticalManifests: StatisticalManifest[];
    let personas: UserPersona[];
    let templates: SchemaTemplate[];
    
    // Check if this is the expected nested structure
    if ('project' in projectExport && projectExport.project) {
      // Standard format: { project: {...}, protocols: [...], ... }
      ({ project, protocols, clinicalData, manuscripts, statisticalManifests, personas, templates } = projectExport);
    } else {
      // Alternative flat format: { id, projectName, ... }
      const flatData = projectExport as any;
      
      // Convert flat structure to Project
      project = {
        id: flatData.id || `project-${Date.now()}`,
        name: flatData.projectName || flatData.name || 'Imported Project',
        description: flatData.description || '',
        studyDesign: flatData.studyDesign || 'RCT',
        primaryInvestigator: flatData.primaryInvestigator || 'Unknown',
        institution: flatData.institution || '',
        phase: flatData.phase || '',
        therapeuticArea: flatData.therapeuticArea || '',
        createdAt: flatData.createdAt || new Date().toISOString(),
        modifiedAt: flatData.modifiedAt || new Date().toISOString(),
      };
      
      protocols = flatData.protocols || [];
      clinicalData = flatData.clinicalData || [];
      manuscripts = flatData.manuscripts || [];
      statisticalManifests = flatData.statisticalManifest ? [flatData.statisticalManifest] : (flatData.statisticalManifests || []);
      personas = flatData.personas || [];
      templates = flatData.templates || [];
    }
    
    // Import project
    const existingProjects = storage.projects.getAll();
    const projectExists = existingProjects.some(p => p && p.id === project.id);
    
    if (projectExists && options.mergeMode === 'skip') {
      console.log(`Skipping existing project: ${project.name}`);
      return;
    }
    
    if (projectExists && options.mergeMode === 'update') {
      const updated = existingProjects.map(p => p && p.id === project.id ? project : p);
      storage.projects.save(updated);
    } else {
      existingProjects.push(project);
      storage.projects.save(existingProjects);
    }
    
    // Import project-specific data
    storage.protocols.save(protocols, project.id);
    storage.clinicalData.save(clinicalData, project.id);
    
    // ✅ FIX: Convert and import manuscripts with proper structure
    manuscripts.forEach(manuscript => {
      // Check if manuscript needs conversion to proper ManuscriptManifest structure
      const properManuscript = this.normalizeManuscript(manuscript, project);
      storage.manuscripts.save(properManuscript, project.id);
    });
    
    // Import statistical manifests
    statisticalManifests.forEach(manifest => {
      // ✅ DEFENSIVE: Only import if manifest has valid structure
      if (manifest && manifest.manifestMetadata) {
        storage.statisticalManifests.save(manifest, project.id);
      } else {
        console.warn('⚠️ Skipping invalid statistical manifest during import:', manifest);
      }
    });
    
    // Import project personas
    if (personas && personas.length > 0) {
      storage.personas.save(personas, project.id);
    }
    
    // Import project templates
    if (templates && templates.length > 0) {
      storage.templates.save(templates, project.id);
    }
  }
  
  /**
   * Normalize manuscript to proper ManuscriptManifest structure
   */
  private normalizeManuscript(manuscript: any, project: Project): ManuscriptManifest {
    try {
      // Check if manuscript is already in proper structure (has projectMeta)
      if ('projectMeta' in manuscript && manuscript.projectMeta && manuscript.notebookContext && manuscript.manuscriptContent && manuscript.reviewComments !== undefined) {
        // Already in proper format, but ensure all required fields exist
        return {
          ...manuscript,
          projectMeta: manuscript.projectMeta || {},
          notebookContext: manuscript.notebookContext || { linkedSources: [], citationMap: {} },
          manuscriptContent: manuscript.manuscriptContent || {},
          reviewComments: manuscript.reviewComments || [],
          manuscriptStructure: manuscript.manuscriptStructure || {
            methods: {
              statisticalPlan: { software: 'R / SPSS', primaryTest: 't-test', rationale: 'Standard parametric analysis' },
              populationSummary: '',
            },
            results: { primaryFindings: [], secondaryFindings: [] },
            discussionAnchors: { internalConflicts: '', lateralOpportunities: [] },
          },
        } as ManuscriptManifest;
      }
      
      // Convert alternative structure to ManuscriptManifest
      const content = manuscript.content || manuscript.manuscriptContent || {};
      const now = Date.now();
      
      return {
        id: manuscript.id || `manuscript-${now}`,
        projectMeta: {
          projectId: project.id,
          studyTitle: manuscript.title || project.name || 'Imported Manuscript',
          primaryInvestigator: project.primaryInvestigator || 'Unknown',
          protocolRef: manuscript.protocolRef || '',
          createdAt: manuscript.createdAt || now,
          modifiedAt: manuscript.modifiedAt || manuscript.auditHistory?.lastCheck || now,
        },
        manuscriptStructure: {
          methods: {
            statisticalPlan: {
              software: 'R / SPSS',
              primaryTest: 't-test',
              rationale: 'Standard parametric analysis',
            },
            populationSummary: content.methods || '',
          },
          results: {
            primaryFindings: [],
            secondaryFindings: [],
          },
          discussionAnchors: {
            internalConflicts: '',
            lateralOpportunities: [],
          },
        },
        notebookContext: {
          linkedSources: manuscript.sourceLibrary?.map((source: any) => ({
            id: source.sourceId || source.id,
            fileName: source.title || 'Unknown Source',
            fileType: 'reference' as const,
            uploadedAt: now,
            citationKey: source.sourceId || source.id,
            isGrounded: true,
            excerpts: source.snippets?.map((snippet: any) => ({
              id: snippet.id,
              text: snippet.text,
              page: 1,
              section: 'body',
              citationAnchor: source.sourceId || source.id,
            })) || [],
          })) || [],
          citationMap: {},
        },
        manuscriptContent: {
          introduction: content.introduction || '',
          methods: content.methods || '',
          results: content.results || '',
          discussion: content.discussion || '',
          conclusion: content.conclusion || '',
        },
        reviewComments: manuscript.reviewComments || [],
      };
    } catch (error) {
      console.warn('⚠️ Error normalizing manuscript (handled gracefully):', manuscript);
      // Return a minimal valid manuscript structure on error
      const now = Date.now();
      return {
        id: `manuscript-${now}`,
        projectMeta: {
          projectId: project.id,
          studyTitle: 'Import Error - Invalid Data',
          primaryInvestigator: project.primaryInvestigator || 'Unknown',
          protocolRef: '',
          createdAt: now,
          modifiedAt: now,
        },
        manuscriptStructure: {
          methods: {
            statisticalPlan: { software: 'R / SPSS', primaryTest: 't-test', rationale: 'Standard parametric analysis' },
            populationSummary: '',
          },
          results: { primaryFindings: [], secondaryFindings: [] },
          discussionAnchors: { internalConflicts: '', lateralOpportunities: [] },
        },
        notebookContext: {
          linkedSources: [],
          citationMap: {},
        },
        manuscriptContent: {
          introduction: '',
          methods: '',
          results: '',
          discussion: '',
          conclusion: '',
        },
        reviewComments: [],
      };
    }
  }
  
  /**
   * Export to JSON file
   */
  exportToJSON(data: ComprehensiveDataExport): string {
    return JSON.stringify(data, null, 2);
  }
  
  /**
   * Import from JSON string
   */
  importFromJSON(jsonString: string, options: ImportOptions = {}): ImportResult {
    try {
      const data: ComprehensiveDataExport = JSON.parse(jsonString);
      return this.importAll(data, options);
    } catch (error) {
      return {
        success: false,
        projectsImported: 0,
        protocolsImported: 0,
        manuscriptsImported: 0,
        clinicalRecordsImported: 0,
        errors: [`Failed to parse JSON: ${error}`],
        warnings: [],
      };
    }
  }
  
  /**
   * Validate export structure
   */
  private validateExportStructure(data: any): boolean {
    if (!data.exportMetadata) return false;
    if (!data.projects || !Array.isArray(data.projects)) return false;
    return true;
  }
  
  /**
   * Merge arrays by unique key
   */
  private mergeArrays<T extends Record<string, any>>(
    existing: T[],
    incoming: T[],
    keyField: keyof T
  ): T[] {
    const merged = [...existing];
    
    for (const item of incoming) {
      const existingIndex = merged.findIndex(m => m[keyField] === item[keyField]);
      if (existingIndex >= 0) {
        merged[existingIndex] = item; // Replace
      } else {
        merged.push(item); // Add new
      }
    }
    
    return merged;
  }
}

export interface ImportOptions {
  mergeMode?: 'replace' | 'update' | 'skip'; // How to handle existing data
  validateData?: boolean; // Run validation before import
  backupFirst?: boolean; // Create backup before import
}

export interface ImportResult {
  success: boolean;
  projectsImported: number;
  protocolsImported: number;
  manuscriptsImported: number;
  clinicalRecordsImported: number;
  errors: string[];
  warnings: string[];
}

// Export singleton instance
export const dataExporter = new ComprehensiveDataExporter();