/**
 * Project Migration Utility
 * 
 * Migrates existing single-project data to multi-project architecture.
 * This runs once automatically when the app detects old data structure.
 */

import { STORAGE_KEYS } from './storageKeys';
import type { Project } from '../types/shared';

/**
 * Check if migration has already been performed
 */
export function isMigrationComplete(): boolean {
  return localStorage.getItem(STORAGE_KEYS.MIGRATION_PROJECTS_V1) === 'true';
}

/**
 * Migrate existing data to project-based architecture
 * 
 * Strategy:
 * 1. Check if migration needed
 * 2. Create default project
 * 3. Move existing data under default project
 * 4. Mark migration complete
 */
export function migrateToProjectArchitecture(): void {
  // Skip if already migrated
  if (isMigrationComplete()) {
    return;
  }

  console.log('[Migration] Starting multi-project migration...');

  try {
    // Check if there's any existing data to migrate
    const hasExistingData = 
      localStorage.getItem(STORAGE_KEYS.PROTOCOLS) ||
      localStorage.getItem(STORAGE_KEYS.PERSONAS) ||
      localStorage.getItem(STORAGE_KEYS.CLINICAL_DATA);

    if (hasExistingData) {
      // Create default project
      const defaultProject: Project = {
        id: 'default-project',
        name: 'My Clinical Study',
        studyNumber: 'STUDY-001',
        description: 'Initial study migrated from previous version',
        phase: undefined,
        status: 'active',
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      };

      // Save default project
      const projects: Project[] = [defaultProject];
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, defaultProject.id);

      console.log('[Migration] Created default project:', defaultProject.name);

      // Migrate data for each resource type
      const resources = [
        { old: STORAGE_KEYS.PROTOCOLS, new: 'protocols' },
        { old: STORAGE_KEYS.PERSONAS, new: 'personas' },
        { old: STORAGE_KEYS.CLINICAL_DATA, new: 'clinicalData' },
        { old: STORAGE_KEYS.SCHEMA_TEMPLATES, new: 'templates' },
      ];

      resources.forEach(({ old, new: newKey }) => {
        const existingData = localStorage.getItem(old);
        if (existingData) {
          const projectKey = STORAGE_KEYS.getProjectKey(defaultProject.id, newKey);
          localStorage.setItem(projectKey, existingData);
          console.log(`[Migration] Migrated ${old} -> ${projectKey}`);
          
          // Remove old key (keep data safe by only removing after successful copy)
          // We'll keep it for now as backup
          // localStorage.removeItem(old);
        }
      });

      console.log('[Migration] Data migration complete');
    } else {
      // No existing data, just initialize empty projects list
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify([]));
      console.log('[Migration] No existing data, initialized empty projects');
    }

    // Mark migration as complete
    localStorage.setItem(STORAGE_KEYS.MIGRATION_PROJECTS_V1, 'true');
    console.log('[Migration] Multi-project migration completed successfully');

  } catch (error) {
    console.error('[Migration] Error during migration:', error);
    // Don't mark as complete if migration failed
    throw error;
  }
}

/**
 * Rollback migration (for testing/debugging only)
 * WARNING: This will restore old data structure
 */
export function rollbackMigration(): void {
  console.warn('[Migration] Rolling back migration...');
  
  // This is dangerous - only for development/testing
  localStorage.removeItem(STORAGE_KEYS.MIGRATION_PROJECTS_V1);
  localStorage.removeItem(STORAGE_KEYS.PROJECTS);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_PROJECT);
  
  // Note: Project-specific data remains, old keys remain
  // Manual cleanup may be needed
  
  console.warn('[Migration] Rollback complete. Reload app to re-run migration.');
}
