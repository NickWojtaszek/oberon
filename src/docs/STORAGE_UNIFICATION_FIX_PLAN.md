# Storage Unification Fix Plan

## Executive Summary

**Objective:** Unify dual storage systems into single centralized storage service

**Problem:** Protocol Workbench uses legacy storage (`clinical-intelligence-protocols`) while project creation uses new storage (`clinical-protocols-{projectId}`)

**Solution:** Migrate Protocol Workbench and Protocol Library to use centralized `storageService.ts`

**Timeline:** 3 hours implementation + testing

---

## Implementation Phases

### ✅ Phase 1: Create Data Migration Utility (30 min)

**File:** `/utils/protocolStorageMigration.ts` (NEW)

**Purpose:** Safely migrate protocols from legacy → project-scoped storage

**Key Features:**
- Detect and read legacy storage
- Merge with existing project-scoped data
- Handle ID conflicts
- Archive legacy data (don't delete)
- Comprehensive logging

---

### ✅ Phase 2: Update useVersionControl Hook (45 min)

**File:** `/components/protocol-workbench/hooks/useVersionControl.ts`

**Changes:**
1. Import storageService and useProject
2. Replace hardcoded STORAGE_KEY with project-scoped calls
3. Update all localStorage reads/writes
4. Pass projectId through all operations

**Key Points:**
- Must maintain backward compatibility during transition
- Add defensive checks for missing project context
- Clear console logging for debugging

---

### ✅ Phase 3: Update useProtocolLibrary Hook (30 min)

**File:** `/components/protocol-library/hooks/useProtocolLibrary.ts`

**Changes:**
1. Import storageService and useProject
2. Replace direct localStorage with storage.protocols methods
3. Update loadProtocols() to use project context
4. Update saveProtocols() to scope by project

---

### ✅ Phase 4: Update ProtocolLibraryScreen (15 min)

**File:** `/components/ProtocolLibraryScreen.tsx`

**Changes:**
- Verify useProject context is available
- Ensure proper project context passed to hooks
- Add project switching listener

---

### ✅ Phase 5: Integration Testing (30 min)

**Tests:**
- Create new project → verify protocol generation
- Open Protocol Builder → verify auto-load
- Open Protocol Library → verify listing
- Create manual protocol → verify save
- Switch projects → verify isolation

---

## Detailed Implementation

### File 1: Migration Utility

```typescript
// /utils/protocolStorageMigration.ts

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
```

---

### File 2: Updated useVersionControl

```typescript
// /components/protocol-workbench/hooks/useVersionControl.ts

import { useState, useCallback, useEffect } from 'react';
import { useProject } from '../../../contexts/ProjectContext';
import { storage } from '../../../utils/storageService';
import type { SavedProtocol, ProtocolVersion, SchemaBlock } from '../types';

// REMOVED: const STORAGE_KEY = 'clinical-intelligence-protocols';

export function useVersionControl() {
  const { currentProject } = useProject();

  const [savedProtocols, setSavedProtocols] = useState<SavedProtocol[]>(() => {
    // 🔄 NEW: Load from project-scoped storage
    if (currentProject) {
      console.log('📂 Loading protocols for project:', currentProject.name);
      return storage.protocols.getAll(currentProject.id);
    }
    return [];
  });

  const [currentProtocolId, setCurrentProtocolId] = useState<string | null>(null);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // 🔄 NEW: Persist to project-scoped storage whenever savedProtocols changes
  useEffect(() => {
    if (currentProject && savedProtocols.length >= 0) {
      console.log('💾 Saving protocols to project storage:', currentProject.id);
      storage.protocols.save(savedProtocols, currentProject.id);
    }
  }, [savedProtocols, currentProject]);

  // 🔄 NEW: Reload protocols when project changes
  useEffect(() => {
    if (currentProject) {
      console.log('🔄 Project changed, reloading protocols:', currentProject.name);
      const protocols = storage.protocols.getAll(currentProject.id);
      setSavedProtocols(protocols);
    } else {
      console.log('ℹ️ No current project, clearing protocols');
      setSavedProtocols([]);
    }
  }, [currentProject?.id]); // Only depend on ID to avoid infinite loops

  const saveProtocol = useCallback((
    protocolTitle: string,
    protocolNumber: string,
    schemaBlocks: SchemaBlock[],
    protocolMetadata: any,
    protocolContent: any,
    status: 'draft' | 'published' = 'draft',
    existingProtocolId?: string
  ) => {
    // 🛡️ Guard: Require project context
    if (!currentProject) {
      console.error('❌ Cannot save protocol: No current project');
      setSaveStatus('error');
      return;
    }

    setIsSaving(true);
    setSaveStatus('saving');

    // Simulate save delay
    setTimeout(() => {
      const protocolId = existingProtocolId || currentProtocolId || `PROTO-${Date.now()}`;
      const versionId = `v${Date.now()}`;
      
      const newVersion: ProtocolVersion = {
        id: versionId,
        versionNumber: status === 'draft' ? `Draft ${new Date().toLocaleDateString()}` : `v1.${savedProtocols.length}`,
        status,
        createdAt: new Date(),
        modifiedAt: new Date(),
        createdBy: 'Current User',
        modifiedBy: 'Current User',
        metadata: protocolMetadata,
        schemaBlocks,
        protocolContent,
        changeLog: status === 'draft' ? 'Draft version' : 'Initial version',
        locked: false,
        hasCollectedData: false,
        dataRecordCount: 0,
      };

      setSavedProtocols(prev => {
        const existingIndex = prev.findIndex(p => p.id === protocolId);
        
        if (existingIndex >= 0) {
          // Update existing protocol
          const updated = [...prev];
          const existingProtocol = updated[existingIndex];
          
          updated[existingIndex] = {
            ...existingProtocol,
            name: protocolTitle, // Fixed: was protocolTitle (wrong key)
            studyNumber: protocolNumber, // Fixed: was protocolNumber (wrong key)
            modifiedAt: new Date(),
            versions: [...existingProtocol.versions, newVersion],
            currentVersion: newVersion, // Update currentVersion reference
          };
          return updated;
        } else {
          // Create new protocol
          const newProtocol: SavedProtocol = {
            id: protocolId,
            name: protocolTitle,
            studyNumber: protocolNumber,
            description: '',
            currentVersion: newVersion,
            versions: [newVersion],
            createdAt: new Date(),
            modifiedAt: new Date(),
            tags: [],
          };
          return [...prev, newProtocol];
        }
      });

      setCurrentProtocolId(protocolId);
      setCurrentVersionId(versionId);
      setIsSaving(false);
      setSaveStatus('saved');
      
      console.log('✅ Protocol saved:', { protocolId, versionId, project: currentProject.name });

      // Clear success message after delay
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }, 1000);
  }, [currentProtocolId, savedProtocols, currentProject]);

  const loadProtocolVersion = useCallback((protocolId: string, versionId: string) => {
    console.log('📖 Loading protocol version:', { protocolId, versionId });
    
    const protocol = savedProtocols.find(p => p.id === protocolId);
    if (!protocol) {
      console.error('❌ Protocol not found:', protocolId);
      return null;
    }

    const version = protocol.versions.find(v => v.id === versionId);
    if (!version) {
      console.error('❌ Version not found:', versionId);
      return null;
    }

    setCurrentProtocolId(protocolId);
    setCurrentVersionId(versionId);
    console.log('✅ Protocol version loaded successfully');
    
    return version;
  }, [savedProtocols]);

  return {
    savedProtocols,
    currentProtocolId,
    currentVersionId,
    isSaving,
    saveStatus,
    saveProtocol,
    loadProtocolVersion,
    setCurrentProtocolId,
    setCurrentVersionId,
  };
}
```

---

### File 3: Updated useProtocolLibrary

```typescript
// /components/protocol-library/hooks/useProtocolLibrary.ts

import { useState, useEffect, useCallback } from 'react';
import { useProject } from '../../../contexts/ProjectContext';
import { storage } from '../../../utils/storageService';
import type { SavedProtocol, ProtocolVersion } from '../../../types/shared';

// REMOVED: Direct localStorage access

export function useProtocolLibrary() {
  const { currentProject } = useProject();
  const [savedProtocols, setSavedProtocols] = useState<SavedProtocol[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published'>('all');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 NEW: Load protocols from project-scoped storage
  const loadProtocols = useCallback(() => {
    if (!currentProject) {
      console.log('ℹ️ No current project, clearing protocols');
      setSavedProtocols([]);
      setIsLoading(false);
      return;
    }

    console.log('📂 Loading protocols for project:', currentProject.name);
    setIsLoading(true);
    
    try {
      const protocols = storage.protocols.getAll(currentProject.id);
      setSavedProtocols(protocols);
      console.log(`✅ Loaded ${protocols.length} protocols`);
    } catch (error) {
      console.error('❌ Failed to load protocols:', error);
      setSavedProtocols([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentProject]);

  // Load protocols when component mounts or project changes
  useEffect(() => {
    loadProtocols();
  }, [loadProtocols]);

  // 🔄 NEW: Save protocols to project-scoped storage
  const saveProtocols = useCallback((protocols: SavedProtocol[]) => {
    if (!currentProject) {
      console.error('❌ Cannot save protocols: No current project');
      return;
    }

    console.log('💾 Saving protocols to project storage:', currentProject.id);
    storage.protocols.save(protocols, currentProject.id);
    setSavedProtocols(protocols);
  }, [currentProject]);

  // ... rest of the hook implementation remains the same

  return {
    savedProtocols,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterTags,
    setFilterTags,
    loadProtocols,
    saveProtocols,
    // ... other returns
  };
}
```

---

## Testing Strategy

### Pre-Implementation Checklist

- [ ] Backup entire localStorage
  ```javascript
  // In browser console
  const backup = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    backup[key] = localStorage.getItem(key);
  }
  console.log('Backup:', JSON.stringify(backup));
  // Copy and save externally
  ```

- [ ] Document current state
  - Count protocols in legacy storage
  - Count protocols in project storage
  - List all localStorage keys

---

### Implementation Testing

#### Test 1: Migration Utility
```typescript
// In browser console after implementing migration
import { migrateProtocolStorage, hasLegacyProtocols, getLegacyProtocolCount } from './utils/protocolStorageMigration';

console.log('Has legacy?', hasLegacyProtocols());
console.log('Legacy count:', getLegacyProtocolCount());

const result = migrateProtocolStorage('current-project-id');
console.log('Migration result:', result);
```

Expected:
- ✅ Legacy protocols moved to project storage
- ✅ Archive created
- ✅ Legacy key removed
- ✅ Console logs show migration details

---

#### Test 2: Protocol Creation Flow
```
1. Create new RCT project
2. Check console for:
   - "🔄 Converting simplified schema blocks to full format..."
   - "✅ Converted X simplified blocks → X full blocks"
3. Open Protocol Builder
4. Check console for:
   - "🔄 Auto-load check for project: [name]"
   - "✅ Auto-loading protocol: { ... }"
   - "✅ Auto-load complete"
5. Verify UI shows protocol
6. Verify auto-load banner appears
```

---

#### Test 3: Protocol Library
```
1. Navigate to Protocol Library
2. Check console for:
   - "📂 Loading protocols for project: [name]"
   - "✅ Loaded X protocols"
3. Verify auto-generated protocol appears in list
4. Click "Open in Builder"
5. Verify protocol loads correctly
```

---

#### Test 4: Manual Protocol Creation
```
1. Open Protocol Builder
2. Create new protocol manually
3. Fill in metadata
4. Save as draft
5. Check console for:
   - "💾 Saving protocols to project storage: [id]"
   - "✅ Protocol saved: { ... }"
6. Navigate to Protocol Library
7. Verify protocol appears
```

---

#### Test 5: Project Switching
```
1. Create Project A (RCT)
2. Create Project B (Case Series)
3. Switch to Project A
4. Check console: "🔄 Project changed, reloading protocols: Project A"
5. Open Protocol Builder
6. Verify RCT protocol loads
7. Switch to Project B
8. Check console: "🔄 Project changed, reloading protocols: Project B"
9. Open Protocol Builder
10. Verify Case Series protocol loads
```

---

#### Test 6: Data Integrity
```javascript
// In browser console
const projectId = 'your-project-id';
const protocols = JSON.parse(
  localStorage.getItem(`clinical-protocols-${projectId}`)
);

console.log('Protocol count:', protocols.length);
console.log('First protocol:', protocols[0]);
console.log('Schema blocks:', protocols[0].versions[0].schemaBlocks.length);

// Verify structure
protocols.forEach(p => {
  console.assert(p.id, 'Has ID');
  console.assert(p.versions.length > 0, 'Has versions');
  console.assert(p.versions[0].schemaBlocks, 'Has schema blocks');
});
```

---

## Rollback Plan

### If Migration Fails

**Step 1: Restore Legacy Storage**
```javascript
// In browser console
const archived = localStorage.getItem('clinical-intelligence-protocols-ARCHIVED');
if (archived) {
  localStorage.setItem('clinical-intelligence-protocols', archived);
  console.log('✅ Restored legacy storage');
}
```

**Step 2: Revert Code Changes**
- Restore useVersionControl.ts from backup
- Restore useProtocolLibrary.ts from backup
- Remove migration utility

**Step 3: Clear Project Storage** (if corrupted)
```javascript
// Only if necessary
const projectId = 'project-id';
localStorage.removeItem(`clinical-protocols-${projectId}`);
```

---

## Success Metrics

### Definition of Done

- [ ] Migration utility created and tested
- [ ] useVersionControl uses storageService
- [ ] useProtocolLibrary uses storageService
- [ ] Auto-load works for auto-generated protocols
- [ ] Protocol Library shows all protocols
- [ ] Manual protocol creation works
- [ ] Project switching works
- [ ] Data integrity verified
- [ ] No console errors
- [ ] All tests pass

### Performance Targets

- Protocol load time: < 100ms
- Migration time: < 1 second
- No localStorage quota issues
- No memory leaks

---

## Implementation Order

1. ✅ Create migration utility (`/utils/protocolStorageMigration.ts`)
2. ✅ Update useVersionControl hook
3. ✅ Update useProtocolLibrary hook
4. ✅ Test migration
5. ✅ Test auto-load
6. ✅ Test protocol library
7. ✅ Test project switching
8. ✅ Final integration tests

**Estimated Time:** 3 hours  
**Priority:** CRITICAL  
**Ready to implement:** YES
