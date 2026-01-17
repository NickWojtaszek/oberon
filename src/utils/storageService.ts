/**
 * Clinical Intelligence Engine - Storage Service
 *
 * ARCHITECTURE: Protocol-Centric Storage
 * - Protocols are the top-level entity (no Project wrapper)
 * - Global protocol storage: clinical_protocols
 * - Protocol-scoped data: manuscripts, manifests
 * - Current protocol: clinical_current_project (legacy key name)
 *
 * Use these type-safe hooks instead of direct localStorage access.
 */

import { STORAGE_KEYS } from './storageKeys';
import type {
  SavedProtocol,
  UserPersona,
  SchemaTemplate
} from '../types/shared';
import type { ClinicalDataRecord } from './dataStorage';
import type { StatisticalManifest } from '../components/analytics-stats/types';
import type { ManuscriptManifest } from '../types/manuscript';

/**
 * Core storage service implementation
 * All data is now globally scoped (no project isolation)
 */
class StorageService {
  /**
   * Protocols - Now the top-level entity
   */
  getProtocols(): SavedProtocol[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROTOCOLS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load protocols:', error);
      return [];
    }
  }

  saveProtocols(protocols: SavedProtocol[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROTOCOLS, JSON.stringify(protocols));
    } catch (error) {
      console.error('Failed to save protocols:', error);
    }
  }

  getProtocolById(id: string): SavedProtocol | null {
    const protocols = this.getProtocols();
    return protocols.find(p => p.id === id) || null;
  }

  getCurrentProtocolId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT); // Reusing key for current protocol
  }

  setCurrentProtocolId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, id);
  }

  /**
   * Clinical Data - Now globally scoped, filtered by protocol
   */
  getClinicalData(): ClinicalDataRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CLINICAL_DATA);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load clinical data:', error);
      return [];
    }
  }

  saveClinicalData(records: ClinicalDataRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CLINICAL_DATA, JSON.stringify(records));
    } catch (error) {
      console.error('Failed to save clinical data:', error);
    }
  }

  getClinicalDataByProtocol(
    protocolNumber: string,
    version?: string
  ): ClinicalDataRecord[] {
    const allRecords = this.getClinicalData();
    return allRecords.filter(record => {
      if (record.protocolNumber !== protocolNumber) return false;
      if (version && record.protocolVersion !== version) return false;
      return true;
    });
  }

  /**
   * Schema Templates - Globally scoped
   */
  getSchemaTemplates(): SchemaTemplate[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SCHEMA_TEMPLATES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load schema templates:', error);
      return [];
    }
  }

  saveSchemaTemplates(templates: SchemaTemplate[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEMA_TEMPLATES, JSON.stringify(templates));
    } catch (error) {
      console.error('Failed to save schema templates:', error);
    }
  }

  /**
   * Personas - Globally scoped
   */
  getPersonas(): UserPersona[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PERSONAS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load personas:', error);
      return [];
    }
  }

  savePersonas(personas: UserPersona[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PERSONAS, JSON.stringify(personas));
    } catch (error) {
      console.error('Failed to save personas:', error);
    }
  }

  /**
   * Manuscripts - Scoped by protocol ID (not project)
   */
  getManuscripts(protocolId?: string): ManuscriptManifest[] {
    try {
      const key = protocolId ? `manuscripts-${protocolId}` : 'manuscripts-global';
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load manuscripts:', error);
      return [];
    }
  }

  getManuscript(manuscriptId: string, protocolId?: string): ManuscriptManifest | null {
    try {
      const manuscripts = this.getManuscripts(protocolId);
      return manuscripts.find(m => m.id === manuscriptId) || null;
    } catch (error) {
      console.error('Failed to load manuscript:', error);
      return null;
    }
  }

  saveManuscript(manuscript: ManuscriptManifest, protocolId?: string): void {
    try {
      const manuscripts = this.getManuscripts(protocolId);
      const existingIndex = manuscripts.findIndex(m => m.id === manuscript.id);

      if (existingIndex >= 0) {
        manuscripts[existingIndex] = manuscript;
      } else {
        manuscripts.push(manuscript);
      }

      const key = protocolId ? `manuscripts-${protocolId}` : 'manuscripts-global';
      localStorage.setItem(key, JSON.stringify(manuscripts));
      console.log('💾 Manuscript saved:', protocolId || 'global');
    } catch (error) {
      console.warn('⚠️ Failed to save manuscript (handled):', protocolId);
    }
  }

  deleteManuscript(manuscriptId: string, protocolId?: string): void {
    try {
      const manuscripts = this.getManuscripts(protocolId);
      const filtered = manuscripts.filter(m => m.id !== manuscriptId);
      const key = protocolId ? `manuscripts-${protocolId}` : 'manuscripts-global';
      localStorage.setItem(key, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete manuscript:', error);
    }
  }

  /**
   * Statistical Manifests - Scoped by protocol ID (not project)
   */
  getAllStatisticalManifests(protocolId?: string): StatisticalManifest[] {
    try {
      const key = protocolId ? `statistical-manifests-${protocolId}` : 'statistical-manifests-global';
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load statistical manifests:', error);
      return [];
    }
  }

  saveStatisticalManifest(manifest: StatisticalManifest, protocolId?: string): void {
    try {
      // Validate manifest structure
      if (!manifest || !manifest.manifestMetadata) {
        console.warn('⚠️ Invalid statistical manifest structure, skipping save:', manifest);
        return;
      }

      const manifests = this.getAllStatisticalManifests(protocolId);
      const existingIndex = manifests.findIndex(
        m => m.manifestMetadata?.protocolId === manifest.manifestMetadata.protocolId &&
             m.manifestMetadata?.protocolVersion === manifest.manifestMetadata.protocolVersion
      );

      if (existingIndex >= 0) {
        manifests[existingIndex] = manifest;
      } else {
        manifests.push(manifest);
      }

      const key = protocolId ? `statistical-manifests-${protocolId}` : 'statistical-manifests-global';
      localStorage.setItem(key, JSON.stringify(manifests));
      console.log('💾 Statistical manifest saved:', protocolId || 'global');
    } catch (error) {
      console.error('Failed to save statistical manifest:', error);
    }
  }

  getStatisticalManifest(protocolId?: string): StatisticalManifest | null {
    const manifests = this.getAllStatisticalManifests(protocolId);
    if (manifests.length === 0) return null;
    return manifests.sort((a, b) =>
      (b.manifestMetadata?.generatedAt || 0) - (a.manifestMetadata?.generatedAt || 0)
    )[0];
  }

  /**
   * Manuscript Manifests - Scoped by protocol ID
   */
  getManuscriptManifest(protocolId?: string): ManuscriptManifest | null {
    try {
      const key = protocolId ? `manuscript-manifest-${protocolId}` : 'manuscript-manifest-global';
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load manuscript manifest:', error);
      return null;
    }
  }

  saveManuscriptManifest(manifest: ManuscriptManifest, protocolId?: string): void {
    try {
      const key = protocolId ? `manuscript-manifest-${protocolId}` : 'manuscript-manifest-global';
      localStorage.setItem(key, JSON.stringify(manifest));
      console.log('💾 Manuscript manifest saved:', protocolId || 'global');
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
 * SIMPLIFIED: Project layer removed. Most methods no longer require projectId.
 * Methods that previously took projectId now take optional protocolId for scoping.
 */
export const storage = {
  // REMOVED: projects namespace - Protocol is now the top-level entity

  protocols: {
    getAll: () => storageService.getProtocols(),
    save: (protocols: SavedProtocol[]) => storageService.saveProtocols(protocols),
    getById: (id: string) => storageService.getProtocolById(id),
    getCurrentId: () => storageService.getCurrentProtocolId(),
    setCurrentId: (id: string) => storageService.setCurrentProtocolId(id),
  },
  clinicalData: {
    getAll: () => storageService.getClinicalData(),
    save: (records: ClinicalDataRecord[]) => storageService.saveClinicalData(records),
    getByProtocol: (protocolNumber: string, version?: string) =>
      storageService.getClinicalDataByProtocol(protocolNumber, version),
  },
  templates: {
    getAll: () => storageService.getSchemaTemplates(),
    save: (templates: SchemaTemplate[]) => storageService.saveSchemaTemplates(templates),
  },
  personas: {
    getAll: () => storageService.getPersonas(),
    save: (personas: UserPersona[]) => storageService.savePersonas(personas),
  },
  statisticalManifests: {
    get: (protocolId?: string) => storageService.getStatisticalManifest(protocolId),
    getAll: (protocolId?: string) => storageService.getAllStatisticalManifests(protocolId),
    save: (manifest: StatisticalManifest, protocolId?: string) => storageService.saveStatisticalManifest(manifest, protocolId),
  },
  manuscripts: {
    getAll: (protocolId?: string) => storageService.getManuscripts(protocolId),
    get: (manuscriptId: string, protocolId?: string) => storageService.getManuscript(manuscriptId, protocolId),
    save: (manuscript: ManuscriptManifest, protocolId?: string) => storageService.saveManuscript(manuscript, protocolId),
    delete: (manuscriptId: string, protocolId?: string) => storageService.deleteManuscript(manuscriptId, protocolId),
  },
  utils: {
    clearAll: () => storageService.clearAll(),
    getInfo: () => storageService.getStorageInfo(),
    export: () => storageService.exportAllData(),
    import: (data: string) => storageService.importAllData(data),
  }
};