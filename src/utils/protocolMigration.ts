/**
 * 🔧 Protocol Storage Migration Utility
 * 
 * Fixes legacy protocols that may have:
 * 1. Wrong field names (name/studyNumber instead of protocolTitle/protocolNumber)
 * 2. currentVersion as object instead of string
 * 3. latestDraftVersion as object instead of string
 */

import type { SavedProtocol } from '../types/shared';

export interface MigrationResult {
  success: boolean;
  migrated: number;
  errors: string[];
  protocols: SavedProtocol[];
}

/**
 * Migrate protocols to correct format
 */
export function migrateProtocols(protocols: any[]): MigrationResult {
  const errors: string[] = [];
  let migrated = 0;

  console.log('🔧 Starting protocol migration...');
  console.log(`   Found ${protocols.length} protocol(s) to check`);

  const migratedProtocols = protocols.map((protocol, index) => {
    try {
      let needsMigration = false;

      // Fix 1: Field names (name → protocolTitle, studyNumber → protocolNumber)
      const protocolTitle = protocol.protocolTitle || protocol.name || '';
      const protocolNumber = protocol.protocolNumber || protocol.studyNumber || '';

      if (protocol.name || protocol.studyNumber) {
        console.log(`   ⚠️  Protocol #${index + 1}: Found legacy field names`);
        needsMigration = true;
      }

      // Fix 2: currentVersion should be string, not object
      let currentVersion = protocol.currentVersion;
      if (typeof currentVersion === 'object' && currentVersion !== null) {
        console.log(`   ⚠️  Protocol #${index + 1}: currentVersion is object, converting to string`);
        currentVersion = currentVersion.versionNumber || '';
        needsMigration = true;
      }

      // Fix 3: latestDraftVersion should be string, not object
      let latestDraftVersion = protocol.latestDraftVersion;
      if (typeof latestDraftVersion === 'object' && latestDraftVersion !== null) {
        console.log(`   ⚠️  Protocol #${index + 1}: latestDraftVersion is object, converting to string`);
        latestDraftVersion = latestDraftVersion.versionNumber || undefined;
        needsMigration = true;
      }

      // Fix 4: Ensure versions array exists
      const versions = protocol.versions || [];

      if (needsMigration) {
        migrated++;
        console.log(`   ✅ Migrated protocol #${index + 1}: "${protocolTitle}"`);
      }

      // Return clean protocol object
      return {
        id: protocol.id,
        protocolTitle,
        protocolNumber,
        currentVersion,
        latestDraftVersion,
        createdAt: protocol.createdAt,
        modifiedAt: protocol.modifiedAt,
        versions
      } as SavedProtocol;

    } catch (error) {
      const errorMsg = `Failed to migrate protocol #${index + 1}: ${error}`;
      console.error(`   ❌ ${errorMsg}`);
      errors.push(errorMsg);
      return protocol; // Return original if migration fails
    }
  });

  console.log(`🎉 Migration complete: ${migrated} protocol(s) migrated`);
  if (errors.length > 0) {
    console.error(`⚠️  ${errors.length} error(s) occurred during migration`);
  }

  return {
    success: errors.length === 0,
    migrated,
    errors,
    protocols: migratedProtocols
  };
}

/**
 * Migrate protocols for a specific project
 */
export function migrateProjectProtocols(projectId: string): MigrationResult {
  console.log('🔧 Migrating protocols for project:', projectId);

  const key = `protocols-${projectId}`;
  const stored = localStorage.getItem(key);

  if (!stored) {
    console.log('   ℹ️  No protocols found for this project');
    return {
      success: true,
      migrated: 0,
      errors: [],
      protocols: []
    };
  }

  try {
    const protocols = JSON.parse(stored);
    const result = migrateProtocols(protocols);

    // Save migrated protocols back to localStorage
    if (result.migrated > 0) {
      localStorage.setItem(key, JSON.stringify(result.protocols));
      console.log('💾 Saved migrated protocols to localStorage');
    }

    return result;
  } catch (error) {
    const errorMsg = `Failed to parse/migrate protocols: ${error}`;
    console.error(`❌ ${errorMsg}`);
    return {
      success: false,
      migrated: 0,
      errors: [errorMsg],
      protocols: []
    };
  }
}

/**
 * Validate protocol structure
 */
export function validateProtocol(protocol: any): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check required fields
  if (!protocol.id) issues.push('Missing id');
  if (!protocol.protocolTitle && !protocol.name) issues.push('Missing protocolTitle/name');
  if (!protocol.protocolNumber && !protocol.studyNumber) issues.push('Missing protocolNumber/studyNumber');
  if (!protocol.versions || !Array.isArray(protocol.versions)) issues.push('Missing or invalid versions array');

  // Check currentVersion type
  if (protocol.currentVersion) {
    if (typeof protocol.currentVersion === 'object') {
      issues.push('currentVersion should be string, not object');
    }
  }

  // Check latestDraftVersion type
  if (protocol.latestDraftVersion) {
    if (typeof protocol.latestDraftVersion === 'object') {
      issues.push('latestDraftVersion should be string, not object');
    }
  }

  // Check versions
  if (protocol.versions && protocol.versions.length > 0) {
    protocol.versions.forEach((v: any, i: number) => {
      if (!v.id) issues.push(`Version ${i} missing id`);
      if (!v.versionNumber) issues.push(`Version ${i} missing versionNumber`);
      if (!v.status) issues.push(`Version ${i} missing status`);
    });
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Debug protocol storage
 */
export function debugProtocolStorage(projectId: string): void {
  console.log('🔍 DEBUG: Protocol Storage Analysis');
  console.log('   Project ID:', projectId);

  const key = `protocols-${projectId}`;
  const stored = localStorage.getItem(key);

  if (!stored) {
    console.log('   ❌ No protocols found');
    return;
  }

  try {
    const protocols = JSON.parse(stored);
    console.log(`   ✅ Found ${protocols.length} protocol(s)\n`);

    protocols.forEach((protocol: any, index: number) => {
      console.log(`📋 Protocol #${index + 1}:`);
      console.log('   ID:', protocol.id);
      console.log('   protocolTitle:', protocol.protocolTitle);
      console.log('   protocolNumber:', protocol.protocolNumber);
      console.log('   currentVersion:', protocol.currentVersion, '(type:', typeof protocol.currentVersion + ')');
      console.log('   latestDraftVersion:', protocol.latestDraftVersion, '(type:', typeof protocol.latestDraftVersion + ')');
      console.log('   versions.length:', protocol.versions?.length || 0);

      // Check for legacy fields
      if (protocol.name || protocol.studyNumber) {
        console.log('   ⚠️  LEGACY FIELDS FOUND:');
        console.log('      name:', protocol.name);
        console.log('      studyNumber:', protocol.studyNumber);
      }

      // Validate
      const validation = validateProtocol(protocol);
      if (!validation.valid) {
        console.log('   ⚠️  VALIDATION ISSUES:');
        validation.issues.forEach(issue => console.log('      •', issue));
      }

      console.log('');
    });

    console.log('📊 Raw Data:');
    console.log(JSON.stringify(protocols, null, 2));

  } catch (error) {
    console.error('   ❌ Failed to parse protocols:', error);
  }
}

// Expose utilities to window for console access
if (typeof window !== 'undefined') {
  (window as any).migrateProtocols = migrateProjectProtocols;
  (window as any).debugProtocols = debugProtocolStorage;
  (window as any).validateProtocol = validateProtocol;
}
