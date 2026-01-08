/**
 * Type-safe storage hooks for React components
 * Use these instead of direct localStorage access
 * 
 * IMPORTANT: All methods now support optional projectId parameter.
 * When used with useProject() hook, pass currentProject.id to scope data.
 */

import { STORAGE_KEYS } from './storageKeys';
import type { 
  Project, 
  SavedProtocol, 
  UserPersona,
  SchemaTemplate 
} from '../types/shared';
import type { ClinicalDataRecord } from './dataStorage';
import type { StatisticalManifest } from '../components/analytics-stats/types';
import type { ManuscriptManifest } from '../types/manuscript';

/**
 * Core storage service implementation
 */
class StorageService {
  /**
   * Projects
   */
  getProjects(): Project[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load projects:', error);
      return [];
    }
  }

  saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (error) {
      console.error('Failed to save projects:', error);
    }
  }

  getProjectById(id: string): Project | null {
    const projects = this.getProjects();
    return projects.find(p => p.id === id) || null;
  }

  getCurrentProjectId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT);
  }

  setCurrentProjectId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, id);
  }

  /**
   * Protocols
   */
  getProtocols(projectId?: string): SavedProtocol[] {
    try {
      const key = projectId 
        ? STORAGE_KEYS.getProjectKey(projectId, 'protocols')
        : STORAGE_KEYS.PROTOCOLS;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load protocols:', error);
      return [];
    }
  }

  saveProtocols(protocols: SavedProtocol[], projectId?: string): void {
    try {
      const key = projectId 
        ? STORAGE_KEYS.getProjectKey(projectId, 'protocols')
        : STORAGE_KEYS.PROTOCOLS;
      localStorage.setItem(key, JSON.stringify(protocols));
    } catch (error) {
      console.error('Failed to save protocols:', error);
    }
  }

  getProtocolById(id: string, projectId?: string): SavedProtocol | null {
    const protocols = this.getProtocols(projectId);
    return protocols.find(p => p.id === id) || null;
  }

  /**
   * Clinical Data
   */
  getClinicalData(projectId?: string): ClinicalDataRecord[] {
    try {
      const key = projectId 
        ? STORAGE_KEYS.getProjectKey(projectId, 'clinical_data')
        : STORAGE_KEYS.CLINICAL_DATA;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load clinical data:', error);
      return [];
    }
  }

  saveClinicalData(records: ClinicalDataRecord[], projectId?: string): void {
    try {
      const key = projectId 
        ? STORAGE_KEYS.getProjectKey(projectId, 'clinical_data')
        : STORAGE_KEYS.CLINICAL_DATA;
      localStorage.setItem(key, JSON.stringify(records));
    } catch (error) {
      console.error('Failed to save clinical data:', error);
    }
  }

  getClinicalDataByProtocol(
    protocolNumber: string, 
    version?: string, 
    projectId?: string
  ): ClinicalDataRecord[] {
    const allRecords = this.getClinicalData(projectId);
    return allRecords.filter(record => {
      if (record.protocolNumber !== protocolNumber) return false;
      if (version && record.protocolVersion !== version) return false;
      return true;
    });
  }

  /**
   * Schema Templates
   */
  getSchemaTemplates(projectId?: string): SchemaTemplate[] {
    try {
      const key = projectId 
        ? STORAGE_KEYS.getProjectKey(projectId, 'schema_templates')
        : STORAGE_KEYS.SCHEMA_TEMPLATES;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load schema templates:', error);
      return [];
    }
  }

  saveSchemaTemplates(templates: SchemaTemplate[], projectId?: string): void {
    try {
      const key = projectId 
        ? STORAGE_KEYS.getProjectKey(projectId, 'schema_templates')
        : STORAGE_KEYS.SCHEMA_TEMPLATES;
      localStorage.setItem(key, JSON.stringify(templates));
    } catch (error) {
      console.error('Failed to save schema templates:', error);
    }
  }

  /**
   * Personas
   */
  getPersonas(projectId?: string): UserPersona[] {
    try {
      const key = projectId 
        ? STORAGE_KEYS.getProjectKey(projectId, 'personas')
        : STORAGE_KEYS.PERSONAS;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load personas:', error);
      return [];
    }
  }

  savePersonas(personas: UserPersona[], projectId?: string): void {
    try {
      const key = projectId 
        ? STORAGE_KEYS.getProjectKey(projectId, 'personas')
        : STORAGE_KEYS.PERSONAS;
      localStorage.setItem(key, JSON.stringify(personas));
    } catch (error) {
      console.error('Failed to save personas:', error);
    }
  }

  /**
   * Manuscripts (for Academic Writing module)
   */
  getManuscripts(projectId: string): ManuscriptManifest[] {
    try {
      const key = `manuscripts-${projectId}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load manuscripts:', error);
      return [];
    }
  }

  getManuscript(manuscriptId: string, projectId: string): ManuscriptManifest | null {
    try {
      const manuscripts = this.getManuscripts(projectId);
      return manuscripts.find(m => m.id === manuscriptId) || null;
    } catch (error) {
      console.error('Failed to load manuscript:', error);
      return null;
    }
  }

  saveManuscript(manuscript: ManuscriptManifest, projectId: string): void {
    try {
      const manuscripts = this.getManuscripts(projectId);
      const existingIndex = manuscripts.findIndex(m => m.id === manuscript.id);
      
      if (existingIndex >= 0) {
        manuscripts[existingIndex] = manuscript;
      } else {
        manuscripts.push(manuscript);
      }
      
      const key = `manuscripts-${projectId}`;
      localStorage.setItem(key, JSON.stringify(manuscripts));
      console.log('💾 Manuscript saved for project:', projectId);
    } catch (error) {
      console.warn('⚠️ Failed to save manuscript (handled):', projectId);
    }
  }

  deleteManuscript(manuscriptId: string, projectId: string): void {
    try {
      const manuscripts = this.getManuscripts(projectId);
      const filtered = manuscripts.filter(m => m.id !== manuscriptId);
      const key = `manuscripts-${projectId}`;
      localStorage.setItem(key, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete manuscript:', error);
    }
  }

  /**
   * Statistical Manifests (for Analytics & Statistics module)
   */
  getAllStatisticalManifests(projectId: string): StatisticalManifest[] {
    try {
      const key = `statistical-manifests-${projectId}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load statistical manifests:', error);
      return [];
    }
  }

  saveStatisticalManifest(manifest: StatisticalManifest, projectId: string): void {
    try {
      // ✅ DEFENSIVE: Validate manifest structure
      if (!manifest || !manifest.manifestMetadata) {
        console.warn('⚠️ Invalid statistical manifest structure, skipping save:', manifest);
        return;
      }

      const manifests = this.getAllStatisticalManifests(projectId);
      const existingIndex = manifests.findIndex(
        m => m.manifestMetadata?.protocolId === manifest.manifestMetadata.protocolId &&
             m.manifestMetadata?.protocolVersion === manifest.manifestMetadata.protocolVersion
      );
      
      if (existingIndex >= 0) {
        manifests[existingIndex] = manifest;
      } else {
        manifests.push(manifest);
      }
      
      const key = `statistical-manifests-${projectId}`;
      localStorage.setItem(key, JSON.stringify(manifests));
      console.log('💾 Statistical manifest saved for project:', projectId);
    } catch (error) {
      console.error('Failed to save statistical manifest:', error);
    }
  }

  getStatisticalManifest(projectId: string): StatisticalManifest | null {
    // Get the most recent manifest
    const manifests = this.getAllStatisticalManifests(projectId);
    if (manifests.length === 0) return null;
    return manifests.sort((a, b) => 
      (b.manifestMetadata?.generatedAt || 0) - (a.manifestMetadata?.generatedAt || 0)
    )[0];
  }

  /**
   * Manuscript Manifests (for Manuscript module)
   */
  getManuscriptManifest(projectId: string): ManuscriptManifest | null {
    try {
      const key = `manuscript-manifest-${projectId}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load manuscript manifest:', error);
      return null;
    }
  }

  saveManuscriptManifest(manifest: ManuscriptManifest, projectId: string): void {
    try {
      const key = `manuscript-manifest-${projectId}`;
      localStorage.setItem(key, JSON.stringify(manifest));
      console.log('💾 Manuscript manifest saved for project:', projectId);
    } catch (error) {
      console.error('Failed to save manuscript manifest:', error);
    }
  }

  /**
   * Utility methods
   */
  clearAll(): void {
    localStorage.clear();
  }

  getStorageInfo(): {
    totalSize: number;
    itemCount: number;
    items: Array<{ key: string; size: number }>;
  } {
    const items: Array<{ key: string; size: number }> = [];
    let totalSize = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        const size = new Blob([value]).size;
        items.push({ key, size });
        totalSize += size;
      }
    }

    return {
      totalSize,
      itemCount: items.length,
      items: items.sort((a, b) => b.size - a.size),
    };
  }

  exportAllData(): string {
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key);
      }
    }
    return JSON.stringify(data, null, 2);
  }

  importAllData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'string') {
          localStorage.setItem(key, value);
        }
      });
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }
}

// Create singleton instance
const storageService = new StorageService();

/**
 * Public storage API
 */
export const storage = {
  projects: {
    getAll: () => storageService.getProjects(),
    save: (projects: Project[]) => storageService.saveProjects(projects),
    getById: (id: string) => storageService.getProjectById(id),
    getCurrentId: () => storageService.getCurrentProjectId(),
    setCurrentId: (id: string) => storageService.setCurrentProjectId(id),
  },
  protocols: {
    getAll: (projectId?: string) => storageService.getProtocols(projectId),
    save: (protocols: SavedProtocol[], projectId?: string) => storageService.saveProtocols(protocols, projectId),
    getById: (id: string, projectId?: string) => storageService.getProtocolById(id, projectId),
  },
  clinicalData: {
    getAll: (projectId?: string) => storageService.getClinicalData(projectId),
    save: (records: ClinicalDataRecord[], projectId?: string) => storageService.saveClinicalData(records, projectId),
    getByProtocol: (protocolNumber: string, version?: string, projectId?: string) => 
      storageService.getClinicalDataByProtocol(protocolNumber, version, projectId),
  },
  templates: {
    getAll: (projectId?: string) => storageService.getSchemaTemplates(projectId),
    save: (templates: SchemaTemplate[], projectId?: string) => storageService.saveSchemaTemplates(templates, projectId),
  },
  personas: {
    getAll: (projectId?: string) => storageService.getPersonas(projectId),
    save: (personas: UserPersona[], projectId?: string) => storageService.savePersonas(personas, projectId),
  },
  statisticalManifests: {
    get: (projectId: string) => storageService.getStatisticalManifest(projectId),
    getAll: (projectId: string) => storageService.getAllStatisticalManifests(projectId),
    save: (manifest: StatisticalManifest, projectId: string) => storageService.saveStatisticalManifest(manifest, projectId),
  },
  manuscripts: {
    getAll: (projectId: string) => storageService.getManuscripts(projectId),
    get: (manuscriptId: string, projectId: string) => storageService.getManuscript(manuscriptId, projectId),
    save: (manuscript: ManuscriptManifest, projectId: string) => storageService.saveManuscript(manuscript, projectId),
    delete: (manuscriptId: string, projectId: string) => storageService.deleteManuscript(manuscriptId, projectId),
  },
  utils: {
    clearAll: () => storageService.clearAll(),
    getInfo: () => storageService.getStorageInfo(),
    export: () => storageService.exportAllData(),
    import: (data: string) => storageService.importAllData(data),
  }
};