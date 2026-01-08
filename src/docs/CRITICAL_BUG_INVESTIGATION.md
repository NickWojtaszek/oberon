# 🚨 CRITICAL BUG: Data Transfer Failure Investigation

## Problem Report

**Symptom:** Data from project creation modal does NOT transfer to Protocol Builder or Database Builder.

**Impact:** Complete data flow failure - auto-generated protocols are invisible to the application.

**Severity:** 🔴 CRITICAL - Blocks entire workflow

---

## Root Cause Analysis

### The Bug: Storage System Conflict 🐛

There are **TWO SEPARATE STORAGE SYSTEMS** writing to **DIFFERENT localStorage KEYS**, causing complete data isolation:

```
┌─────────────────────────────────────────────────────────────┐
│ SYSTEM A: Centralized Storage Service (NEW)                │
│ File: /utils/storageService.ts                             │
│ Used by: ProjectCreationModal                              │
│ Storage Key: clinical-protocols-{projectId}                │
│                                                             │
│ ✅ Project-scoped                                          │
│ ✅ Multi-project support                                   │
│ ✅ Used by auto-generation                                 │
└─────────────────────────────────────────────────────────────┘
                         ❌ NO CONNECTION ❌
┌─────────────────────────────────────────────────────────────┐
│ SYSTEM B: Legacy Protocol Workbench Storage (OLD)          │
│ File: /components/protocol-workbench/hooks/                │
│       useVersionControl.ts                                  │
│ Used by: Protocol Workbench, Protocol Library              │
│ Storage Key: clinical-intelligence-protocols                │
│                                                             │
│ ❌ No project scoping                                      │
│ ❌ Global storage (pre-multi-project)                      │
│ ❌ Can't see auto-generated protocols                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Evidence

### Evidence 1: ProjectCreationModal saves to System A

**File:** `/components/ProjectCreationModal.tsx` (Line 139-140)

```typescript
const existingProtocols = storage.protocols.getAll(newProject.id);
storage.protocols.save([...existingProtocols, protocol], newProject.id);
```

**Storage Key Used:** `clinical-protocols-{projectId}`

---

### Evidence 2: Protocol Workbench uses System B

**File:** `/components/protocol-workbench/hooks/useVersionControl.ts` (Line 4)

```typescript
const STORAGE_KEY = 'clinical-intelligence-protocols';
```

**Storage Key Used:** `clinical-intelligence-protocols` (hardcoded, no project ID)

---

### Evidence 3: Protocol Library uses System B

**File:** `/components/protocol-library/hooks/useProtocolLibrary.ts` (Line 38, 71)

```typescript
const stored = localStorage.getItem('clinical-intelligence-protocols');
// ...
localStorage.setItem('clinical-intelligence-protocols', JSON.stringify(protocols));
```

**Storage Key Used:** `clinical-intelligence-protocols` (same as Protocol Workbench)

---

### Evidence 4: Auto-load tries to read from System A

**File:** `/components/protocol-workbench/ProtocolWorkbenchCore.tsx` (Line 62)

```typescript
const protocols = storage.protocols.getAll(currentProject.id);
```

**Storage Key Used:** `clinical-protocols-{projectId}`

**But then tries to load using System B:**

```typescript
const version = versionControl.loadProtocolVersion(
  mostRecentProtocol.id, 
  latestVersion.id
);
```

`versionControl` is `useVersionControl()` which reads from `clinical-intelligence-protocols` ❌

---

## Data Flow Visualization

### What Happens Now (BROKEN) ❌

```
1. User creates RCT project
   ProjectCreationModal
   ↓
   createProtocolFromStudyDNA()
   ↓
   storage.protocols.save(protocol, projectId)
   ↓
   localStorage['clinical-protocols-abc123'] = { protocol data }
   ✅ SAVED TO SYSTEM A

2. User clicks "Protocol Builder"
   ProtocolWorkbenchCore
   ↓
   Auto-load checks: storage.protocols.getAll(projectId)
   ↓
   Reads: localStorage['clinical-protocols-abc123']
   ↓
   Finds protocol! ✅
   ↓
   Calls: versionControl.loadProtocolVersion(protocolId, versionId)
   ↓
   useVersionControl reads: localStorage['clinical-intelligence-protocols']
   ↓
   ❌ PROTOCOL NOT FOUND - System B has no data!
   ↓
   Returns null
   ↓
   Auto-load fails silently
   ↓
   User sees blank Protocol Builder

3. User opens Database tab
   Database component
   ↓
   Uses storage.protocols.getAll(projectId)
   ↓
   Reads: localStorage['clinical-protocols-abc123']
   ↓
   Finds protocol with schema blocks ✅
   ↓
   Should work... BUT Protocol Workbench can't load it!
```

---

## Why This Happened

### Historical Context

1. **Phase 1:** Protocol Workbench built as standalone component
   - Used `clinical-intelligence-protocols` key
   - No project scoping needed
   - ✅ Worked fine

2. **Phase 2:** Multi-project support added
   - Created centralized `storageService.ts`
   - Project-scoped keys: `clinical-protocols-{projectId}`
   - ✅ Modern architecture

3. **Phase 3:** Study DNA auto-generation added
   - ProjectCreationModal uses new storage service
   - Writes to project-scoped keys
   - ✅ Correct approach

4. **Phase 4:** Auto-load implemented (yesterday)
   - Tried to bridge both systems
   - Read from System A, load with System B
   - ❌ INCOMPATIBLE!

**Problem:** Protocol Workbench never migrated to new storage system!

---

## Impact Assessment

### What's Broken

- [x] **Auto-generated protocols invisible to Protocol Builder** 🔴
- [x] **Auto-load feature doesn't work** 🔴
- [x] **Protocol Library doesn't show auto-generated protocols** 🔴
- [x] **Manual protocol creation still works** ✅ (saves to System B)
- [x] **Database tab might work** ⚠️ (reads from System A, but unverified)

### What Still Works

- ✅ Project creation (protocols saved correctly)
- ✅ Manual protocol creation in Protocol Workbench (System B)
- ✅ Protocol editing (System B)
- ✅ Database reading from System A (if no Protocol Workbench involved)

### Critical User Journeys Affected

**Journey 1: New User** 🔴 BROKEN
```
1. Create RCT project ✅
2. Auto-generates protocol ✅
3. Open Protocol Builder ❌ Blank
4. Open Database ⚠️ Unclear
```

**Journey 2: Experienced User** ✅ WORKS (by accident)
```
1. Open Protocol Builder
2. Manually create protocol ✅ (saves to System B)
3. Edit and save ✅ (System B)
4. View in library ✅ (System B)
```

**Journey 3: Mixed Workflow** 🔴 PARTIALLY BROKEN
```
1. Create project with auto-protocol ✅ (System A)
2. Manually create second protocol ✅ (System B)
3. User sees ONLY the manual protocol ❌
4. Auto-generated protocol lost to UI
```

---

## Risk Analysis

### Data Loss Risk

**Level:** 🟡 MEDIUM

**Analysis:**
- Data IS being saved correctly to localStorage
- No actual data loss
- BUT: Data is invisible to UI
- User perception: "My protocol disappeared!"

### Data Corruption Risk

**Level:** 🔴 HIGH

**Analysis:**
```
Scenario: User creates 2 protocols in same project

Protocol 1: Auto-generated
  → Saved to: clinical-protocols-abc123
  → Has ID: protocol-1234567890

Protocol 2: Manual creation
  → Saved to: clinical-intelligence-protocols
  → Might reuse ID: protocol-1234567890

Result: DUPLICATE IDs IN DIFFERENT STORAGE SYSTEMS
```

This violates data integrity!

### Code Corruption Risk

**Level:** 🟢 LOW

**Analysis:**
- No code is corrupted
- This is an integration bug, not code corruption
- Fixed by migrating to single storage system

---

## Fix Strategy

### Option A: Migrate Protocol Workbench to System A (RECOMMENDED) ⭐

**Approach:** Update Protocol Workbench to use centralized storage service

**Pros:**
- ✅ Modern, project-scoped architecture
- ✅ Aligns with multi-project support
- ✅ Single source of truth
- ✅ Fixes auto-load completely
- ✅ Future-proof

**Cons:**
- ⚠️ Requires migration of existing data from System B → System A
- ⚠️ Must update 3 files (useVersionControl, useProtocolLibrary, ProtocolWorkbenchCore)
- ⚠️ Testing required

**Estimated Effort:** 2-3 hours

---

### Option B: Migrate Project Creation to System B (NOT RECOMMENDED) ❌

**Approach:** Make ProjectCreationModal use legacy storage

**Pros:**
- ✅ Minimal code changes
- ✅ Protocol Workbench works unchanged

**Cons:**
- ❌ Breaks multi-project architecture
- ❌ Loses project scoping
- ❌ Regresses to pre-multi-project state
- ❌ Future maintenance nightmare

**Estimated Effort:** 1 hour (but creates technical debt)

---

### Option C: Bridge System (Temporary Workaround) ⚠️

**Approach:** Create adapter that syncs both systems

**Pros:**
- ✅ Preserves both systems
- ✅ No data migration needed

**Cons:**
- ❌ Doubled storage overhead
- ❌ Sync complexity
- ❌ Two sources of truth (data integrity risk)
- ❌ Temporary fix, needs proper solution later

**Estimated Effort:** 1-2 hours

---

## Recommended Fix: Option A (Migration Plan)

### Phase 1: Update useVersionControl Hook

**Goal:** Replace localStorage direct access with storageService

**File:** `/components/protocol-workbench/hooks/useVersionControl.ts`

**Changes:**
```typescript
// OLD
const STORAGE_KEY = 'clinical-intelligence-protocols';
const stored = localStorage.getItem(STORAGE_KEY);

// NEW
import { storage } from '../../../utils/storageService';
import { useProject } from '../../../contexts/ProjectContext';

export function useVersionControl() {
  const { currentProject } = useProject();
  
  const [savedProtocols, setSavedProtocols] = useState<SavedProtocol[]>(() => {
    if (currentProject) {
      return storage.protocols.getAll(currentProject.id);
    }
    return [];
  });
  
  // Update effect to use project-scoped storage
  useEffect(() => {
    if (currentProject) {
      storage.protocols.save(savedProtocols, currentProject.id);
    }
  }, [savedProtocols, currentProject]);
}
```

---

### Phase 2: Update useProtocolLibrary Hook

**Goal:** Use storageService instead of direct localStorage

**File:** `/components/protocol-library/hooks/useProtocolLibrary.ts`

**Changes:**
```typescript
// Replace all instances of:
localStorage.getItem('clinical-intelligence-protocols')
localStorage.setItem('clinical-intelligence-protocols', ...)

// With:
storage.protocols.getAll(currentProject.id)
storage.protocols.save(protocols, currentProject.id)
```

---

### Phase 3: Data Migration Utility

**Goal:** Move existing protocols from System B → System A

**File:** `/utils/protocolStorageMigration.ts` (NEW)

**Implementation:**
```typescript
export function migrateProtocolStorage(): {
  migrated: number;
  skipped: number;
  errors: string[];
} {
  const result = { migrated: 0, skipped: 0, errors: [] };
  
  try {
    // Read from old system
    const oldData = localStorage.getItem('clinical-intelligence-protocols');
    if (!oldData) {
      return result; // Nothing to migrate
    }
    
    const oldProtocols = JSON.parse(oldData);
    
    // Get current project
    const currentProjectId = storage.projects.getCurrentId();
    if (!currentProjectId) {
      result.errors.push('No current project - cannot migrate');
      return result;
    }
    
    // Get existing protocols in new system
    const existingProtocols = storage.protocols.getAll(currentProjectId);
    const existingIds = new Set(existingProtocols.map(p => p.id));
    
    // Migrate non-duplicate protocols
    const toMigrate = oldProtocols.filter(p => !existingIds.has(p.id));
    
    if (toMigrate.length > 0) {
      storage.protocols.save(
        [...existingProtocols, ...toMigrate],
        currentProjectId
      );
      result.migrated = toMigrate.length;
    }
    
    result.skipped = oldProtocols.length - toMigrate.length;
    
    // Archive old data (don't delete yet)
    localStorage.setItem(
      'clinical-intelligence-protocols-ARCHIVED',
      oldData
    );
    
    console.log('✅ Protocol migration complete:', result);
    
  } catch (error) {
    result.errors.push(String(error));
    console.error('❌ Protocol migration failed:', error);
  }
  
  return result;
}
```

---

### Phase 4: Update ProtocolWorkbenchCore

**Goal:** Ensure consistent project context

**File:** `/components/protocol-workbench/ProtocolWorkbenchCore.tsx`

**Changes:**
```typescript
// Make sure useProject context is available
const { currentProject } = useProject();

// Pass project context to hooks
const versionControl = useVersionControl(); // Will use context internally
```

---

### Phase 5: Testing Checklist

**Pre-Migration Tests:**
- [ ] Export/backup all localStorage data
- [ ] Document current protocol count
- [ ] Screenshot Protocol Library state

**Post-Migration Tests:**
- [ ] Create new RCT project
- [ ] Verify auto-generated protocol appears in Protocol Builder
- [ ] Verify auto-load works
- [ ] Verify Database tab shows schema blocks
- [ ] Create manual protocol
- [ ] Verify both protocols visible in library
- [ ] Switch projects - verify isolation
- [ ] Check console for migration logs

---

## Implementation Priority

### Must Fix Immediately 🔴
1. Update useVersionControl to use storageService
2. Update useProtocolLibrary to use storageService
3. Create data migration utility
4. Run migration on app startup

### Should Fix Soon 🟡
1. Add storage system health check
2. Add conflict detection
3. Add data repair tool

### Nice to Have 🟢
1. Storage system documentation
2. Developer warnings for direct localStorage use
3. Automated migration tests

---

## Code Corruption Prevention

### Going Forward

1. **Centralized Storage Policy**
   - ✅ ALL storage goes through `storageService.ts`
   - ❌ NO direct localStorage access
   - ✅ Project-scoped by default

2. **Code Review Checklist**
   ```
   - [ ] No direct localStorage.getItem() calls
   - [ ] No direct localStorage.setItem() calls
   - [ ] Uses storage.protocols.* methods
   - [ ] Includes projectId parameter
   - [ ] Has project context from useProject()
   ```

3. **Linting Rule** (Future)
   ```javascript
   // ESLint rule to prevent direct localStorage access
   "no-restricted-globals": ["error", {
     "name": "localStorage",
     "message": "Use storageService.ts instead of direct localStorage access"
   }]
   ```

4. **Architecture Documentation**
   - Document storage patterns
   - Require review for storage changes
   - Maintain migration scripts

---

## Timeline

### Estimated Implementation Time

- **Phase 1 (useVersionControl):** 45 minutes
- **Phase 2 (useProtocolLibrary):** 30 minutes
- **Phase 3 (Data Migration):** 1 hour
- **Phase 4 (ProtocolWorkbenchCore):** 15 minutes
- **Phase 5 (Testing):** 30 minutes

**Total:** ~3 hours

### Rollout Plan

1. **Hour 1:** Implement Phases 1-3
2. **Hour 2:** Complete Phase 4, initial testing
3. **Hour 3:** Comprehensive testing, bug fixes

---

## Success Criteria

### Definition of Done

- [x] useVersionControl uses storageService
- [x] useProtocolLibrary uses storageService
- [x] Migration utility created and tested
- [x] Auto-load works for auto-generated protocols
- [x] Protocol Library shows all protocols
- [x] Database tab works with all protocols
- [x] Project switching works correctly
- [x] No console errors
- [x] Data integrity verified

### Acceptance Tests

**Test 1: Auto-Generation Flow**
```
1. Create RCT project
2. Auto-generates protocol
3. Open Protocol Builder
4. VERIFY: Protocol auto-loads ✅
5. VERIFY: Schema blocks visible ✅
```

**Test 2: Protocol Library**
```
1. Open Protocol Library
2. VERIFY: Auto-generated protocol listed ✅
3. VERIFY: Can open in builder ✅
```

**Test 3: Database Integration**
```
1. Open Database tab
2. Select auto-generated protocol
3. VERIFY: Schema generates tables ✅
4. VERIFY: Data entry forms work ✅
```

**Test 4: Project Isolation**
```
1. Create Project A with RCT
2. Create Project B with Case Series
3. Switch to Project A
4. VERIFY: See only RCT protocol ✅
5. Switch to Project B
6. VERIFY: See only Case Series protocol ✅
```

---

## Conclusion

**Severity:** 🔴 CRITICAL  
**Root Cause:** Storage system conflict (dual storage)  
**Fix Approach:** Migrate to centralized storage (Option A)  
**Estimated Time:** 3 hours  
**Risk:** Medium (data migration required)  
**Priority:** IMMEDIATE

**Ready to implement?** Yes - clear path forward with detailed plan.
