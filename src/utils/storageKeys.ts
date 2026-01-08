/**
 * SINGLE SOURCE OF TRUTH: localStorage Keys
 * 
 * CRITICAL: All localStorage keys MUST be defined here.
 * DO NOT create localStorage keys anywhere else in the application.
 * 
 * Usage:
 * import { STORAGE_KEYS } from '@/utils/storageKeys';
 * localStorage.getItem(STORAGE_KEYS.PROTOCOLS);
 */

export const STORAGE_KEYS = {
  // Core data storage
  PROTOCOLS: 'clinical_protocols',
  PERSONAS: 'clinical_personas',
  CLINICAL_DATA: 'clinical_data',
  SCHEMA_TEMPLATES: 'clinical_schema_templates',
  
  // Project management (NEW - Phase 1)
  PROJECTS: 'clinical_projects',              // List of all projects
  CURRENT_PROJECT: 'clinical_current_project', // Active project ID
  
  // Helper function to get project-specific storage keys
  // Example: getProjectKey('proj-123', 'protocols') -> 'clinical_project_proj-123_protocols'
  getProjectKey: (projectId: string, resource: string): string => {
    return `clinical_project_${projectId}_${resource}`;
  },
  
  // Migration tracking
  MIGRATION_PROJECTS_V1: 'clinical_migration_projects_v1',
} as const;

/**
 * Type-safe storage key type
 */
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

/**
 * Validate that a storage key is defined
 */
export function isValidStorageKey(key: string): key is StorageKey {
  return Object.values(STORAGE_KEYS).includes(key as StorageKey);
}

/**
 * Get a human-readable description of what a storage key contains
 */
export function getStorageKeyDescription(key: StorageKey): string {
  switch (key) {
    case STORAGE_KEYS.PROTOCOLS:
      return 'Protocol definitions and versions';
    case STORAGE_KEYS.CLINICAL_DATA:
      return 'Patient clinical data records';
    case STORAGE_KEYS.SCHEMA_TEMPLATES:
      return 'User-created schema templates';
    case STORAGE_KEYS.PERSONAS:
      return 'User persona configurations';
    default:
      return 'Unknown storage key';
  }
}