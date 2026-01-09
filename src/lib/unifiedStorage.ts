/**
 * Unified Storage Service
 *
 * This module provides a unified API for data storage that:
 * 1. Uses Supabase when configured and user is authenticated
 * 2. Falls back to localStorage for offline/unauthenticated use
 *
 * This allows gradual migration from localStorage to Supabase
 * while maintaining backward compatibility.
 */

import { isSupabaseReady, getSupabaseIfConfigured } from './supabase';
import {
  projectsService,
  protocolsService,
  protocolVersionsService,
  clinicalDataService,
  schemaTemplatesService,
  personasService,
  statisticalManifestsService,
  manuscriptsService,
  picoFrameworksService,
  picoVariablesService,
  auditLogsService,
} from './supabaseService';
import { storage as localStorageService } from '../utils/storageService';
import type { Project } from '../types/shared';
import type { SavedProtocol, SchemaTemplate } from '../components/protocol-workbench/types';
import type { UserPersona } from '../utils/validation/schemas';
import type { ClinicalDataRecord } from '../utils/dataStorage';
import type { StatisticalManifest } from '../components/analytics-stats/types';
import type { ManuscriptManifest } from '../types/manuscript';

// ============================================
// STORAGE MODE DETECTION
// ============================================

type StorageMode = 'supabase' | 'localStorage';

async function getStorageMode(): Promise<StorageMode> {
  if (!isSupabaseReady()) {
    return 'localStorage';
  }

  const supabase = getSupabaseIfConfigured();
  if (!supabase) {
    return 'localStorage';
  }

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return 'localStorage';
  }

  return 'supabase';
}

// ============================================
// TYPE CONVERTERS (Supabase <-> App types)
// ============================================

function supabaseProjectToApp(dbProject: any): Project {
  return {
    id: dbProject.id,
    name: dbProject.name,
    studyNumber: dbProject.study_number,
    description: dbProject.description || '',
    phase: dbProject.phase,
    status: dbProject.status,
    createdAt: dbProject.created_at,
    modifiedAt: dbProject.modified_at,
    studyDesign: dbProject.study_design,
    studyMethodology: dbProject.study_methodology,
    governance: dbProject.governance,
    owner: dbProject.owner_id,
    settings: dbProject.settings,
  };
}

function appProjectToSupabase(project: Project, ownerId: string): any {
  return {
    id: project.id,
    name: project.name,
    study_number: project.studyNumber,
    description: project.description,
    phase: project.phase,
    status: project.status,
    owner_id: ownerId,
    study_design: project.studyDesign,
    study_methodology: project.studyMethodology,
    governance: project.governance,
    settings: project.settings,
  };
}

// ============================================
// UNIFIED STORAGE API
// ============================================

export const unifiedStorage = {
  // ----------------------------------------
  // PROJECTS
  // ----------------------------------------
  projects: {
    async getAll(): Promise<Project[]> {
      const mode = await getStorageMode();

      if (mode === 'supabase') {
        const { data, error } = await projectsService.getAll();
        if (error || !data) {
          console.warn('Supabase projects fetch failed, falling back to localStorage:', error);
          return localStorageService.projects.getAll();
        }
        return data.map(supabaseProjectToApp);
      }

      return localStorageService.projects.getAll();
    },

    async getById(id: string): Promise<Project | null> {
      const mode = await getStorageMode();

      if (mode === 'supabase') {
        const { data, error } = await projectsService.getById(id);
        if (error || !data) {
          // Try localStorage fallback
          return localStorageService.projects.getById(id);
        }
        return supabaseProjectToApp(data);
      }

      return localStorageService.projects.getById(id);
    },

    async save(projects: Project[]): Promise<void> {
      const mode = await getStorageMode();

      if (mode === 'supabase') {
        const supabase = getSupabaseIfConfigured();
        if (!supabase) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Sync each project to Supabase
        for (const project of projects) {
          const existing = await projectsService.getById(project.id);
          if (existing.data) {
            await projectsService.update(project.id, {
              name: project.name,
              study_number: project.studyNumber,
              description: project.description,
              phase: project.phase,
              status: project.status,
              study_design: project.studyDesign as any,
              study_methodology: project.studyMethodology as any,
              governance: project.governance as any,
              settings: project.settings as any,
            });
          } else {
            await projectsService.create(appProjectToSupabase(project, user.id));
          }
        }
      }

      // Always save to localStorage as backup/offline cache
      localStorageService.projects.save(projects);
    },

    async create(project: Project): Promise<Project> {
      const mode = await getStorageMode();

      if (mode === 'supabase') {
        const supabase = getSupabaseIfConfigured();
        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data, error } = await projectsService.create(
              appProjectToSupabase(project, user.id)
            );
            if (!error && data) {
              // Also save to localStorage for offline access
              const projects = localStorageService.projects.getAll();
              projects.push(project);
              localStorageService.projects.save(projects);
              return supabaseProjectToApp(data);
            }
          }
        }
      }

      // Fallback to localStorage
      const projects = localStorageService.projects.getAll();
      projects.push(project);
      localStorageService.projects.save(projects);
      return project;
    },

    async update(id: string, updates: Partial<Project>): Promise<Project | null> {
      const mode = await getStorageMode();

      if (mode === 'supabase') {
        const { data, error } = await projectsService.update(id, {
          name: updates.name,
          study_number: updates.studyNumber,
          description: updates.description,
          phase: updates.phase,
          status: updates.status,
          study_design: updates.studyDesign as any,
          study_methodology: updates.studyMethodology as any,
          governance: updates.governance as any,
          settings: updates.settings as any,
        });

        if (!error && data) {
          // Update localStorage cache
          const projects = localStorageService.projects.getAll();
          const index = projects.findIndex(p => p.id === id);
          if (index >= 0) {
            projects[index] = { ...projects[index], ...updates };
            localStorageService.projects.save(projects);
          }
          return supabaseProjectToApp(data);
        }
      }

      // Fallback to localStorage
      const projects = localStorageService.projects.getAll();
      const index = projects.findIndex(p => p.id === id);
      if (index >= 0) {
        projects[index] = { ...projects[index], ...updates };
        localStorageService.projects.save(projects);
        return projects[index];
      }
      return null;
    },

    async delete(id: string): Promise<void> {
      const mode = await getStorageMode();

      if (mode === 'supabase') {
        await projectsService.delete(id);
      }

      // Always remove from localStorage
      const projects = localStorageService.projects.getAll();
      localStorageService.projects.save(projects.filter(p => p.id !== id));
    },

    getCurrentId(): string | null {
      return localStorageService.projects.getCurrentId();
    },

    setCurrentId(id: string): void {
      localStorageService.projects.setCurrentId(id);
    },
  },

  // ----------------------------------------
  // PROTOCOLS
  // ----------------------------------------
  protocols: {
    async getAll(projectId?: string): Promise<SavedProtocol[]> {
      const mode = await getStorageMode();

      if (mode === 'supabase' && projectId) {
        const { data, error } = await protocolsService.getByProject(projectId);
        if (error || !data) {
          return localStorageService.protocols.getAll(projectId);
        }

        // Fetch versions for each protocol
        const protocols: SavedProtocol[] = [];
        for (const protocol of data) {
          const { data: versions } = await protocolVersionsService.getByProtocol(protocol.id);
          protocols.push({
            id: protocol.id,
            studyNumber: protocol.study_number,
            name: protocol.name,
            description: protocol.description || '',
            createdAt: protocol.created_at,
            modifiedAt: protocol.modified_at,
            versions: versions?.map(v => ({
              versionNumber: v.version_number,
              status: v.status as any,
              schemaBlocks: (v.schema_blocks as any) || [],
              createdAt: v.created_at,
              changelog: v.changelog || '',
            })) || [],
            currentVersion: versions?.[0]?.version_number || '1.0',
            metadata: protocol.metadata as any,
          });
        }
        return protocols;
      }

      return localStorageService.protocols.getAll(projectId);
    },

    async save(protocols: SavedProtocol[], projectId?: string): Promise<void> {
      // Always save to localStorage
      localStorageService.protocols.save(protocols, projectId);

      // TODO: Implement full Supabase sync for protocols
      // This requires handling the protocols + protocol_versions relationship
    },

    async getById(id: string, projectId?: string): Promise<SavedProtocol | null> {
      return localStorageService.protocols.getById(id, projectId);
    },
  },

  // ----------------------------------------
  // CLINICAL DATA
  // ----------------------------------------
  clinicalData: {
    async getAll(projectId?: string): Promise<ClinicalDataRecord[]> {
      const mode = await getStorageMode();

      if (mode === 'supabase' && projectId) {
        const { data, error } = await clinicalDataService.getByProject(projectId);
        if (error || !data) {
          return localStorageService.clinicalData.getAll(projectId);
        }
        return data.map(record => ({
          id: record.id,
          protocolNumber: record.protocol_id,
          protocolVersion: record.protocol_version,
          tableName: record.table_name,
          recordId: record.record_id,
          data: record.data as any,
          submittedAt: record.created_at,
          submittedBy: record.created_by,
          modifiedAt: record.modified_at,
          modifiedBy: record.modified_by || undefined,
        }));
      }

      return localStorageService.clinicalData.getAll(projectId);
    },

    async save(records: ClinicalDataRecord[], projectId?: string): Promise<void> {
      // Always save to localStorage
      localStorageService.clinicalData.save(records, projectId);
    },

    async getByProtocol(
      protocolNumber: string,
      version?: string,
      projectId?: string
    ): Promise<ClinicalDataRecord[]> {
      return localStorageService.clinicalData.getByProtocol(protocolNumber, version, projectId);
    },
  },

  // ----------------------------------------
  // SCHEMA TEMPLATES
  // ----------------------------------------
  templates: {
    async getAll(projectId?: string): Promise<SchemaTemplate[]> {
      return localStorageService.templates.getAll(projectId);
    },

    async save(templates: SchemaTemplate[], projectId?: string): Promise<void> {
      localStorageService.templates.save(templates, projectId);
    },
  },

  // ----------------------------------------
  // PERSONAS
  // ----------------------------------------
  personas: {
    async getAll(projectId?: string): Promise<UserPersona[]> {
      return localStorageService.personas.getAll(projectId);
    },

    async save(personas: UserPersona[], projectId?: string): Promise<void> {
      localStorageService.personas.save(personas, projectId);
    },
  },

  // ----------------------------------------
  // STATISTICAL MANIFESTS
  // ----------------------------------------
  statisticalManifests: {
    async get(projectId: string): Promise<StatisticalManifest | null> {
      const mode = await getStorageMode();

      if (mode === 'supabase') {
        const { data, error } = await statisticalManifestsService.getLatest(projectId);
        if (!error && data) {
          return data.manifest_data as unknown as StatisticalManifest;
        }
      }

      return localStorageService.statisticalManifests.get(projectId);
    },

    async getAll(projectId: string): Promise<StatisticalManifest[]> {
      return localStorageService.statisticalManifests.getAll(projectId);
    },

    async save(manifest: StatisticalManifest, projectId: string): Promise<void> {
      localStorageService.statisticalManifests.save(manifest, projectId);
    },
  },

  // ----------------------------------------
  // MANUSCRIPTS
  // ----------------------------------------
  manuscripts: {
    async getAll(projectId: string): Promise<ManuscriptManifest[]> {
      return localStorageService.manuscripts.getAll(projectId);
    },

    async get(manuscriptId: string, projectId: string): Promise<ManuscriptManifest | null> {
      return localStorageService.manuscripts.get(manuscriptId, projectId);
    },

    async save(manuscript: ManuscriptManifest, projectId: string): Promise<void> {
      localStorageService.manuscripts.save(manuscript, projectId);
    },

    async delete(manuscriptId: string, projectId: string): Promise<void> {
      localStorageService.manuscripts.delete(manuscriptId, projectId);
    },
  },

  // ----------------------------------------
  // UTILITIES
  // ----------------------------------------
  utils: {
    async getStorageMode(): Promise<StorageMode> {
      return getStorageMode();
    },

    clearAll(): void {
      localStorageService.utils.clearAll();
    },

    getInfo() {
      return localStorageService.utils.getInfo();
    },

    export(): string {
      return localStorageService.utils.export();
    },

    import(data: string): void {
      localStorageService.utils.import(data);
    },

    async syncToSupabase(): Promise<{ success: boolean; error?: string }> {
      const mode = await getStorageMode();
      if (mode !== 'supabase') {
        return { success: false, error: 'Supabase not available or user not authenticated' };
      }

      try {
        // Sync projects from localStorage to Supabase
        const localProjects = localStorageService.projects.getAll();
        for (const project of localProjects) {
          await unifiedStorage.projects.create(project);
        }
        return { success: true };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    },
  },
};

export default unifiedStorage;
