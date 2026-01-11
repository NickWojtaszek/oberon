/**
 * Migration Utility: Project-scoped data to Global Protocol-scoped data
 *
 * This utility migrates data from the old Project → Protocol hierarchy
 * to the new simplified Protocol-only hierarchy.
 *
 * Run this once on app startup to migrate existing data.
 */

import { STORAGE_KEYS } from './storageKeys';

interface MigrationResult {
  success: boolean;
  migratedProtocols: number;
  migratedRecords: number;
  migratedPersonas: number;
  migratedTemplates: number;
  errors: string[];
}

/**
 * Check if migration is needed
 */
export function isMigrationNeeded(): boolean {
  const migrationFlag = localStorage.getItem('clinical_migration_project_to_protocol_v1');
  if (migrationFlag === 'complete') {
    return false;
  }

  // Check if there's any project-scoped data
  const projectsJson = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  if (!projectsJson) {
    return false;
  }

  try {
    const projects = JSON.parse(projectsJson);
    return Array.isArray(projects) && projects.length > 0;
  } catch {
    return false;
  }
}

/**
 * Migrate all project-scoped data to global storage
 */
export function migrateProjectDataToGlobal(): MigrationResult {
  const result: MigrationResult = {
    success: false,
    migratedProtocols: 0,
    migratedRecords: 0,
    migratedPersonas: 0,
    migratedTemplates: 0,
    errors: [],
  };

  try {
    console.log('[Migration] Starting project → protocol migration...');

    // Get all projects
    const projectsJson = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!projectsJson) {
      console.log('[Migration] No projects found, skipping migration');
      result.success = true;
      localStorage.setItem('clinical_migration_project_to_protocol_v1', 'complete');
      return result;
    }

    const projects = JSON.parse(projectsJson);
    if (!Array.isArray(projects) || projects.length === 0) {
      console.log('[Migration] No projects to migrate');
      result.success = true;
      localStorage.setItem('clinical_migration_project_to_protocol_v1', 'complete');
      return result;
    }

    // Collect all data from all projects
    const allProtocols: any[] = [];
    const allClinicalData: any[] = [];
    const allPersonas: any[] = [];
    const allTemplates: any[] = [];

    for (const project of projects) {
      if (!project || !project.id) continue;

      const projectId = project.id;
      console.log(`[Migration] Processing project: ${project.name || projectId}`);

      // Migrate protocols
      const protocolsKey = STORAGE_KEYS.getProjectKey(projectId, 'protocols');
      const protocolsJson = localStorage.getItem(protocolsKey);
      if (protocolsJson) {
        try {
          const protocols = JSON.parse(protocolsJson);
          if (Array.isArray(protocols)) {
            // Add study methodology from project to each protocol
            const enrichedProtocols = protocols.map((p: any) => ({
              ...p,
              studyMethodology: project.studyMethodology,
              governance: project.governance,
              description: project.description,
            }));
            allProtocols.push(...enrichedProtocols);
            result.migratedProtocols += protocols.length;
            console.log(`  - Migrated ${protocols.length} protocols`);
          }
        } catch (e) {
          result.errors.push(`Failed to parse protocols for project ${projectId}`);
        }
      }

      // Migrate clinical data
      const dataKey = STORAGE_KEYS.getProjectKey(projectId, 'clinical_data');
      const dataJson = localStorage.getItem(dataKey);
      if (dataJson) {
        try {
          const records = JSON.parse(dataJson);
          if (Array.isArray(records)) {
            allClinicalData.push(...records);
            result.migratedRecords += records.length;
            console.log(`  - Migrated ${records.length} clinical data records`);
          }
        } catch (e) {
          result.errors.push(`Failed to parse clinical data for project ${projectId}`);
        }
      }

      // Migrate personas
      const personasKey = STORAGE_KEYS.getProjectKey(projectId, 'personas');
      const personasJson = localStorage.getItem(personasKey);
      if (personasJson) {
        try {
          const personas = JSON.parse(personasJson);
          if (Array.isArray(personas)) {
            // Dedupe personas by id
            for (const persona of personas) {
              if (!allPersonas.find((p: any) => p.id === persona.id)) {
                allPersonas.push(persona);
                result.migratedPersonas++;
              }
            }
            console.log(`  - Migrated ${personas.length} personas`);
          }
        } catch (e) {
          result.errors.push(`Failed to parse personas for project ${projectId}`);
        }
      }

      // Migrate schema templates
      const templatesKey = STORAGE_KEYS.getProjectKey(projectId, 'schema_templates');
      const templatesJson = localStorage.getItem(templatesKey);
      if (templatesJson) {
        try {
          const templates = JSON.parse(templatesJson);
          if (Array.isArray(templates)) {
            // Dedupe templates by id
            for (const template of templates) {
              if (!allTemplates.find((t: any) => t.id === template.id)) {
                allTemplates.push(template);
                result.migratedTemplates++;
              }
            }
            console.log(`  - Migrated ${templates.length} schema templates`);
          }
        } catch (e) {
          result.errors.push(`Failed to parse templates for project ${projectId}`);
        }
      }
    }

    // Save merged data to global storage
    if (allProtocols.length > 0) {
      // Merge with any existing global protocols
      const existingProtocolsJson = localStorage.getItem(STORAGE_KEYS.PROTOCOLS);
      const existingProtocols = existingProtocolsJson ? JSON.parse(existingProtocolsJson) : [];
      const mergedProtocols = [...existingProtocols];

      for (const protocol of allProtocols) {
        if (!mergedProtocols.find((p: any) => p.id === protocol.id)) {
          mergedProtocols.push(protocol);
        }
      }

      localStorage.setItem(STORAGE_KEYS.PROTOCOLS, JSON.stringify(mergedProtocols));
      console.log(`[Migration] Saved ${mergedProtocols.length} protocols to global storage`);
    }

    if (allClinicalData.length > 0) {
      const existingDataJson = localStorage.getItem(STORAGE_KEYS.CLINICAL_DATA);
      const existingData = existingDataJson ? JSON.parse(existingDataJson) : [];
      const mergedData = [...existingData, ...allClinicalData];
      localStorage.setItem(STORAGE_KEYS.CLINICAL_DATA, JSON.stringify(mergedData));
      console.log(`[Migration] Saved ${mergedData.length} clinical data records to global storage`);
    }

    if (allPersonas.length > 0) {
      const existingPersonasJson = localStorage.getItem(STORAGE_KEYS.PERSONAS);
      const existingPersonas = existingPersonasJson ? JSON.parse(existingPersonasJson) : [];
      const mergedPersonas = [...existingPersonas];

      for (const persona of allPersonas) {
        if (!mergedPersonas.find((p: any) => p.id === persona.id)) {
          mergedPersonas.push(persona);
        }
      }

      localStorage.setItem(STORAGE_KEYS.PERSONAS, JSON.stringify(mergedPersonas));
      console.log(`[Migration] Saved ${mergedPersonas.length} personas to global storage`);
    }

    if (allTemplates.length > 0) {
      const existingTemplatesJson = localStorage.getItem(STORAGE_KEYS.SCHEMA_TEMPLATES);
      const existingTemplates = existingTemplatesJson ? JSON.parse(existingTemplatesJson) : [];
      const mergedTemplates = [...existingTemplates];

      for (const template of allTemplates) {
        if (!mergedTemplates.find((t: any) => t.id === template.id)) {
          mergedTemplates.push(template);
        }
      }

      localStorage.setItem(STORAGE_KEYS.SCHEMA_TEMPLATES, JSON.stringify(mergedTemplates));
      console.log(`[Migration] Saved ${mergedTemplates.length} schema templates to global storage`);
    }

    // Mark migration as complete
    localStorage.setItem('clinical_migration_project_to_protocol_v1', 'complete');
    result.success = true;

    console.log('[Migration] Migration completed successfully!');
    console.log(`  - Protocols: ${result.migratedProtocols}`);
    console.log(`  - Clinical records: ${result.migratedRecords}`);
    console.log(`  - Personas: ${result.migratedPersonas}`);
    console.log(`  - Templates: ${result.migratedTemplates}`);

    if (result.errors.length > 0) {
      console.warn('[Migration] Errors encountered:', result.errors);
    }

    return result;
  } catch (error) {
    console.error('[Migration] Migration failed:', error);
    result.errors.push(String(error));
    return result;
  }
}

/**
 * Run migration if needed (call this on app startup)
 */
export function runMigrationIfNeeded(): MigrationResult | null {
  if (isMigrationNeeded()) {
    console.log('[Migration] Migration needed, running...');
    return migrateProjectDataToGlobal();
  }
  console.log('[Migration] No migration needed');
  return null;
}
