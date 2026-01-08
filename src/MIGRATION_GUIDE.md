# 🔄 Migration Guide: Adopting Protected Architecture

## Overview
This guide explains how to gradually migrate existing code to use the new protected architecture without breaking anything.

---

## ⚠️ Important: Non-Breaking Changes

**The new architecture is ADDITIVE, not breaking:**
- Existing code continues to work
- Migration can happen gradually
- No need to update everything at once
- Each component can be migrated independently

---

## Migration Priority (Recommended Order)

### Phase 1: High-Risk Areas ✅ COMPLETED
These areas are most likely to cause issues:

- [x] **Database hooks** - Fixed localStorage key mismatch
  - `/components/database/hooks/useDatabase.ts`
  - Now uses `STORAGE_KEYS.PROTOCOLS`

### Phase 2: Storage Operations (Optional, When Time Permits)
Migrate direct localStorage calls to use storageService:

#### Files to Consider:
1. `/components/protocol-workbench/hooks/useVersionControl.ts`
   - Currently uses: Direct localStorage with STORAGE_KEY constant
   - Could migrate to: `storage.protocols.*` methods
   - Priority: Medium (working correctly, but could be more consistent)

2. `/components/protocol-library/hooks/useProtocolLibrary.ts`
   - Currently uses: Direct localStorage access
   - Could migrate to: `storage.protocols.getAll()`
   - Priority: Medium

3. `/utils/dataStorage.ts`
   - Currently uses: Direct localStorage with STORAGE_KEY constant
   - Could migrate to: `storage.clinicalData.*` methods
   - Priority: Low (isolated utility, working correctly)

4. `/components/protocol-workbench/components/SchemaTemplateLibrary.tsx`
   - Currently uses: Direct localStorage with STORAGE_KEY constant
   - Could migrate to: `storage.templates.*` methods
   - Priority: Low

### Phase 3: Type Definitions (Optional)
Consolidate duplicate type definitions:

- Some components define their own types
- Could import from `/types/shared.ts` instead
- Priority: Very Low (TypeScript ensures compatibility)

---

## Migration Examples

### Example 1: Migrating useVersionControl.ts

**Current Code:**
```typescript
// /components/protocol-workbench/hooks/useVersionControl.ts
const STORAGE_KEY = 'clinical-intelligence-protocols';

const [savedProtocols, setSavedProtocols] = useState<SavedProtocol[]>(() => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse saved protocols:', e);
      }
    }
  }
  return [];
});

useEffect(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProtocols));
  }
}, [savedProtocols]);
```

**Migrated Code:**
```typescript
// /components/protocol-workbench/hooks/useVersionControl.ts
import { storage } from '@/utils/storageService';
import { STORAGE_KEYS } from '@/utils/storageKeys';

const [savedProtocols, setSavedProtocols] = useState<SavedProtocol[]>(() => {
  return storage.protocols.getAll();
});

useEffect(() => {
  storage.protocols.save(savedProtocols);
}, [savedProtocols]);
```

**Benefits:**
- ✅ Cleaner code
- ✅ Consistent error handling
- ✅ Easier to test
- ✅ Type-safe

---

### Example 2: Migrating Direct localStorage Access

**Current Code:**
```typescript
const stored = localStorage.getItem('clinical-intelligence-protocols');
const protocols = stored ? JSON.parse(stored) : [];
```

**Migrated Code:**
```typescript
import { storage } from '@/utils/storageService';

const protocols = storage.protocols.getAll();
```

---

### Example 3: Using Centralized Types

**Current Code:**
```typescript
// In component file
interface ProtocolVersion {
  id: string;
  versionNumber: string;
  status: 'draft' | 'published' | 'archived';
  // ... more fields
}
```

**Migrated Code:**
```typescript
import type { ProtocolVersion } from '@/types/shared';
// That's it! No need to define the interface
```

---

## When to Migrate

### Migrate Now If:
- ✅ Adding new feature that uses localStorage
- ✅ Fixing a bug in storage-related code
- ✅ Refactoring an existing module
- ✅ You have extra time and want to improve code quality

### Can Wait If:
- ⏸️ Code is working correctly and not being touched
- ⏸️ Under time pressure for feature delivery
- ⏸️ Component is scheduled for major refactor anyway

---

## Migration Checklist

When migrating a file:

- [ ] Import `STORAGE_KEYS` from `/utils/storageKeys`
- [ ] Replace string literals with `STORAGE_KEYS.*`
- [ ] Import `storage` from `/utils/storageService`
- [ ] Replace direct localStorage calls with storage service
- [ ] Import types from `/types/shared.ts`
- [ ] Remove duplicate type definitions
- [ ] Test that functionality still works
- [ ] Update any related tests

---

## Testing After Migration

### 1. Functional Testing
- [ ] Feature works as before
- [ ] Data persists correctly
- [ ] No console errors
- [ ] Page reloads preserve state

### 2. Edge Cases
- [ ] Corrupted localStorage data
- [ ] Missing data
- [ ] Very large datasets
- [ ] Rapid saves/loads

### 3. Cross-Module Testing
- [ ] Protocol Builder → Database sync
- [ ] Protocol Library displays correct data
- [ ] Analytics uses correct data source

---

## Rollback Plan

If migration causes issues:

1. **Revert the file** to previous version
2. **Keep using direct localStorage** - it's not wrong, just less consistent
3. **Report the issue** for investigation
4. **Try again later** when you have more time to debug

---

## Common Pitfalls

### ❌ Pitfall 1: Mixing Old and New
```typescript
// DON'T mix direct localStorage with storage service in same file
const protocols = localStorage.getItem(STORAGE_KEYS.PROTOCOLS); // old way
storage.protocols.save(newProtocols); // new way
```

**Solution:** Fully migrate the file or don't migrate at all

### ❌ Pitfall 2: Wrong Import Paths
```typescript
// WRONG
import { STORAGE_KEYS } from './utils/storageKeys';

// CORRECT
import { STORAGE_KEYS } from '@/utils/storageKeys';
// or
import { STORAGE_KEYS } from '../../../utils/storageKeys';
```

### ❌ Pitfall 3: Forgetting Error Handling
```typescript
// Storage service already includes error handling
// But you should still check for empty results
const protocols = storage.protocols.getAll();
if (protocols.length === 0) {
  // Handle empty state
}
```

---

## Questions?

1. **Q: Do I have to migrate everything now?**
   - A: No! Existing code works fine. Migrate when convenient.

2. **Q: What if I'm not sure how to migrate something?**
   - A: Leave it as-is. The new system doesn't break old code.

3. **Q: Can I mix old and new patterns?**
   - A: Try to be consistent within a single file, but it's okay to have different patterns in different files during transition.

4. **Q: Will this improve performance?**
   - A: Minimal impact on performance. Main benefit is code quality and consistency.

5. **Q: What if I find a bug in the storage service?**
   - A: Report it! The service can be fixed in one place, benefiting all users.

---

## Summary

- ✅ **Migration is optional** - existing code continues to work
- ✅ **Migrate gradually** - no need to rush
- ✅ **Focus on new code** - use protected architecture for new features
- ✅ **Migrate when convenient** - during bug fixes or refactors
- ✅ **Test thoroughly** - ensure functionality is preserved
- ✅ **Ask if unsure** - better to wait than break something

---

**Last Updated:** January 2026  
**Status:** Phase 1 Complete (Database module)
