/**
 * Protocol Storage Migration Utility
 * 
 * Migrates protocols from legacy global storage to project-scoped storage.
 * Legacy key: 'clinical-intelligence-protocols'
 * New key: 'clinical-protocols-{projectId}'
 */

import { storage } from './storageService';
import type { SavedProtocol } from '../types/shared';

const LEGACY_KEY = 'clinical-intelligence-protocols';
const ARCHIVE_KEY = 'clinical-intelligence-protocols-ARCHIVED';

export interface MigrationResult {
  success: boolean;
  migrated: number;
  skipped: number;
  errors: string[];
  message: string;
}

/**
 * Migrate protocols from legacy global storage to project-scoped storage
 */
export function migrateProtocolStorage(
  targetProjectId: string
): MigrationResult {
  const result: MigrationResult = {
    success: false,
    migrated: 0,
    skipped: 0,
    errors: [],
    message: '',
  };

  console.log('🔄 Starting protocol storage migration...');
  console.log('   Legacy key:', LEGACY_KEY);
  console.log('   Target project:', targetProjectId);

  try {
    // Check if legacy data exists
    const legacyData = localStorage.getItem(LEGACY_KEY);
    if (!legacyData) {
      result.success = true;
      result.message = 'No legacy protocols found - nothing to migrate';
      console.log('ℹ️', result.message);
      return result;
    }

    // Parse legacy protocols
    let legacyProtocols: SavedProtocol[];
    try {
      legacyProtocols = JSON.parse(legacyData);
      console.log(`📦 Found ${legacyProtocols.length} legacy protocols`);
    } catch (parseError) {
      result.errors.push('Failed to parse legacy protocols: ' + parseError);
      result.message = 'Migration failed - corrupt legacy data';
      console.error('❌', result.message, parseError);
      return result;
    }

    // Get existing protocols in target project
    const existingProtocols = storage.protocols.getAll(targetProjectId);
    const existingIds = new Set(existingProtocols.map(p => p.id));
    
    console.log(`📋 Target project has ${existingProtocols.length} existing protocols`);

    // Filter protocols to migrate (avoid duplicates)
    const protocolsToMigrate = legacyProtocols.filter(p => {
      if (existingIds.has(p.id)) {
        result.skipped++;
        console.log(`  ⏭️ Skipping ${p.id} (already exists)`);
        return false;
      }
      return true;
    });

    // Migrate protocols
    if (protocolsToMigrate.length > 0) {
      const updatedProtocols = [...existingProtocols, ...protocolsToMigrate];
      storage.protocols.save(updatedProtocols, targetProjectId);
      result.migrated = protocolsToMigrate.length;
      console.log(`✅ Migrated ${result.migrated} protocols to project storage`);
    } else {
      console.log('ℹ️ No new protocols to migrate');
    }

    // Archive legacy data (preserve for safety)
    localStorage.setItem(ARCHIVE_KEY, legacyData);
    console.log('📦 Legacy data archived to:', ARCHIVE_KEY);

    // Remove legacy key (migration complete)
    localStorage.removeItem(LEGACY_KEY);
    console.log('🗑️ Removed legacy storage key');

    result.success = true;
    result.message = `Successfully migrated ${result.migrated} protocols (${result.skipped} skipped)`;
    console.log('✅', result.message);

  } catch (error) {
    result.errors.push(String(error));
    result.message = 'Migration failed with unexpected error';
    console.error('❌ Protocol migration error:', error);
  }

  return result;
}

/**
 * Check if legacy protocols exist
 */
export function hasLegacyProtocols(): boolean {
  const legacyData = localStorage.getItem(LEGACY_KEY);
  return legacyData !== null && legacyData.length > 0;
}

/**
 * Get count of legacy protocols without migrating
 */
export function getLegacyProtocolCount(): number {
  try {
    const legacyData = localStorage.getItem(LEGACY_KEY);
    if (!legacyData) return 0;
    const protocols = JSON.parse(legacyData);
    return Array.isArray(protocols) ? protocols.length : 0;
  } catch {
    return 0;
  }
}

/**
 * Restore from archive (emergency rollback)
 */
export function restoreLegacyProtocols(): boolean {
  try {
    const archived = localStorage.getItem(ARCHIVE_KEY);
    if (archived) {
      localStorage.setItem(LEGACY_KEY, archived);
      console.log('✅ Restored legacy protocols from archive');
      return true;
    }
    console.log('ℹ️ No archived protocols found');
    return false;
  } catch (error) {
    console.error('❌ Failed to restore legacy protocols:', error);
    return false;
  }
}
