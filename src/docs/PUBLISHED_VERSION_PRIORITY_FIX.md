# Published Version Priority Fix ✅

## Summary

Fixed Database component to **always default to most recent published protocol version** instead of first version in array.

**Rationale:** Published protocols are locked, validated, and production-ready. They should be the default for clinical data collection, not drafts.

---

## What Was Fixed

### The Problem
```
Database version selector:
  ❌ Default: protocol.versions[0] (first in array = often draft)
  ✅ Should be: Most recent PUBLISHED version
```

### Why This Matters
- **Published** = Locked, validated, production-ready, regulatory-compliant
- **Draft** = Work in progress, subject to change, not for data collection
- **Data integrity** = Collected data must be linked to stable protocol versions

---

## Files Changed (2 files)

### 1. `/components/database/hooks/useDatabase.ts`

**Change 1: Initial Protocol Load**
```typescript
// BEFORE
const activeVersions = firstProtocol.versions.filter(v => v.status !== 'archived');
if (activeVersions.length > 0) {
  setSelectedVersionId(activeVersions[0].id); // ❌ First = often draft
}

// AFTER
const activeVersions = firstProtocol.versions.filter(v => v.status !== 'archived');
const publishedVersions = activeVersions.filter(v => v.status === 'published');

let selectedVersion = null;
if (publishedVersions.length > 0) {
  // ✅ Use most recent published version (last in array)
  selectedVersion = publishedVersions[publishedVersions.length - 1];
  console.log('  ✅ Auto-selected PUBLISHED version:', selectedVersion.id);
} else if (activeVersions.length > 0) {
  // Fallback to most recent draft
  selectedVersion = activeVersions[activeVersions.length - 1];
  console.log('  ⚠️  Auto-selected DRAFT version:', selectedVersion.id, '(no published versions available)');
}

if (selectedVersion) {
  setSelectedVersionId(selectedVersion.id);
}
```

**Change 2: Protocol Switching**
```typescript
// BEFORE
if (activeVersions.length > 0) {
  setSelectedVersionId(activeVersions[0].id); // ❌ First = often draft
}

// AFTER
const publishedVersions = activeVersions.filter(v => v.status === 'published');

let newVersion = null;
if (publishedVersions.length > 0) {
  // ✅ Most recent published
  newVersion = publishedVersions[publishedVersions.length - 1];
  console.log('  ✅ Switched to PUBLISHED version:', newVersion.id);
} else if (activeVersions.length > 0) {
  // Fallback to draft
  newVersion = activeVersions[activeVersions.length - 1];
  console.log('  ⚠️  Switched to DRAFT version:', newVersion.id);
}

if (newVersion) {
  setSelectedVersionId(newVersion.id);
}
```

---

### 2. `/components/Database.tsx`

**Change: Manual Protocol Selection**
```typescript
// BEFORE
onChange={(e) => {
  setSelectedProtocolId(e.target.value);
  const protocol = savedProtocols.find(p => p.id === e.target.value);
  if (protocol && protocol.versions.length > 0) {
    setSelectedVersionId(protocol.versions[0].id); // ❌ First version
  }
}}

// AFTER
onChange={(e) => {
  setSelectedProtocolId(e.target.value);
  const protocol = savedProtocols.find(p => p.id === e.target.value);
  if (protocol && protocol.versions.length > 0) {
    // 🎯 Prioritize published versions
    const activeVersions = protocol.versions.filter(v => v.status !== 'archived');
    const publishedVersions = activeVersions.filter(v => v.status === 'published');
    
    if (publishedVersions.length > 0) {
      // ✅ Use most recent published version
      setSelectedVersionId(publishedVersions[publishedVersions.length - 1].id);
    } else if (activeVersions.length > 0) {
      // Fallback to most recent draft
      setSelectedVersionId(activeVersions[activeVersions.length - 1].id);
    }
  }
}}
```

---

## Selection Priority (Decision Tree)

```
User opens Database tab
  ↓
Is there a PUBLISHED version?
  ├─ YES → ✅ Select most recent published
  └─ NO  → ⚠️  Select most recent draft (with warning log)
```

**Rationale:**
1. **Published first** = Regulatory compliance
2. **Most recent** = Latest approved protocol
3. **Draft fallback** = Development mode (logged as warning)

---

## Expected Console Output

### Scenario 1: Published Version Available ✅
```
📂 [useDatabase] Loading protocols for project: Test RCT
✅ [useDatabase] Loaded 1 protocols
  📌 Auto-selected protocol: protocol-1234567890
  ✅ Auto-selected PUBLISHED version: version-9876543210 (v2.0)
```

### Scenario 2: Only Draft Available ⚠️
```
📂 [useDatabase] Loading protocols for project: New Study
✅ [useDatabase] Loaded 1 protocols
  📌 Auto-selected protocol: protocol-5555555555
  ⚠️  Auto-selected DRAFT version: version-1111111111 (no published versions available)
```

### Scenario 3: Protocol Switching ✅
```
User changes protocol dropdown
  ✅ Switched to PUBLISHED version: version-7777777777
```

---

## Testing Instructions

### Test 1: Fresh Project with Draft Only
```
1. Create new RCT project
2. Open Database tab
3. Check console:
   ⚠️  "Auto-selected DRAFT version: ... (no published versions available)"
4. Check UI:
   - Version dropdown shows draft
   - Badge shows "Draft"
```

### Test 2: After Publishing Protocol
```
1. Go to Protocol Builder
2. Click "Publish to Production"
3. Return to Database tab
4. Check console:
   ✅ "Auto-selected PUBLISHED version: ... (v1.0)"
5. Check UI:
   - Version dropdown shows v1.0
   - Badge shows "Published"
```

### Test 3: Multiple Published Versions
```
Given: Protocol has v1.0 (published), v2.0 (published), v2.1 (draft)

1. Open Database tab
2. Check console:
   ✅ "Auto-selected PUBLISHED version: ... (v2.0)"
3. Should select v2.0 (most recent published)
4. Should NOT select v2.1 (draft)
```

### Test 4: Manual Protocol Switch
```
1. Database tab open
2. Change protocol dropdown
3. Check console:
   ✅ "Switched to PUBLISHED version: ..."
4. Should auto-select published version of new protocol
```

---

## Clinical Rationale

### Why Published > Draft for Data Collection

**Regulatory Perspective:**
- ✅ Published protocols are **locked** (GCP compliance)
- ✅ Published protocols are **validated** (IRB approved)
- ✅ Published protocols have **audit trails** (21 CFR Part 11)
- ❌ Draft protocols are **mutable** (data integrity risk)

**Workflow Perspective:**
1. Protocol development → **Draft mode**
2. IRB approval → **Publish to production**
3. Data collection begins → **Use published version**
4. Protocol amendment → **New draft created**
5. Amendment approved → **New published version**
6. Data collection continues → **Still use published version**

**Data Integrity:**
```
✅ CORRECT:
  Collected Data Record
  ├─ Protocol: RCT-001
  ├─ Version: v2.0 (PUBLISHED, LOCKED)
  └─ Safe: Version won't change

❌ INCORRECT:
  Collected Data Record
  ├─ Protocol: RCT-001
  ├─ Version: v2.1 (DRAFT, MUTABLE)
  └─ Risk: Version might change, data becomes orphaned
```

---

## Edge Cases Handled

### Case 1: No Published Versions Yet
```
Behavior: Falls back to most recent draft
Log: ⚠️  "Auto-selected DRAFT version (no published versions available)"
```

### Case 2: All Versions Archived
```
Behavior: No version selected
UI: Shows "No active versions available"
```

### Case 3: User Manually Selects Draft
```
Behavior: Allowed (user override)
Log: (no automatic switch)
UI: Badge shows "Draft" as warning
```

### Case 4: Published Then Archived
```
Behavior: Falls back to next published, or draft if none
Log: ✅ or ⚠️  based on availability
```

---

## Future Enhancements

### Possible Additions

1. **Version Warning Banner**
   ```tsx
   {selectedVersion?.status === 'draft' && (
     <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
       ⚠️  Warning: Collecting data against DRAFT protocol
       <button>Switch to Published Version</button>
     </div>
   )}
   ```

2. **Lock Draft Data Collection**
   ```typescript
   if (selectedVersion?.status === 'draft') {
     return (
       <div className="text-center py-8">
         <Lock className="w-12 h-12 mx-auto text-amber-500" />
         <p>Data collection requires published protocol</p>
       </div>
     );
   }
   ```

3. **Auto-Upgrade Data Records**
   ```typescript
   // When protocol v2.0 published, offer to upgrade records
   upgradeClinicalDataRecords('RCT-001', 'v1.0' → 'v2.0');
   ```

---

## Success Criteria

### Must Pass ✅
- [ ] Database defaults to published version when available
- [ ] Database falls back to draft when no published exists
- [ ] Console logs indicate published vs draft selection
- [ ] Protocol switching maintains published priority
- [ ] User can still manually select draft if needed

### Performance ✅
- [ ] Version filtering < 10ms
- [ ] No performance degradation
- [ ] No extra re-renders

### UX ✅
- [ ] Clear visual indication (Published badge)
- [ ] Console logs help debugging
- [ ] Fallback behavior is logical

---

## Related Documentation

- `/docs/SCHEMA_FREEZE_SYSTEM.md` - Version locking system
- `/docs/STORAGE_FIX_IMPLEMENTATION_COMPLETE.md` - Storage unification
- `/docs/DATABASE_FIX_COMPLETE.md` - Database integration

---

## Status

✅ **IMPLEMENTATION COMPLETE**

**Changes:** 2 files  
**Lines Modified:** ~40  
**Testing:** Ready for verification  
**Risk:** Low (preserves manual selection)  

**Next:** Test with real workflow (draft → publish → collect data)

---

*Implementation completed: January 3, 2026*
*Rationale: Clinical data integrity and regulatory compliance*
