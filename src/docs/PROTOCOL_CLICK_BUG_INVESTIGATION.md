# 🔍 Investigation: Protocol Without Name & Click Not Working

## **Observed Symptoms**

From the screenshot:
1. ✅ Protocol card appears in library
2. ❌ Protocol has NO title displayed (blank space where title should be)
3. ❌ Protocol has NO number displayed (blank space where number should be)
4. ✅ "Click to open" text is visible
5. ✅ Created date: 1/4/2026
6. ✅ Modified date: 1/4/2026
7. ✅ Shows "1 version"
8. ❌ Clicking the card does NOT open the protocol in builder

---

## **Root Cause Analysis**

### **Theory 1: Protocol Saved with Empty Fields** ❌

**Evidence Against:**
```typescript
// In ProtocolWorkbenchCore.tsx line 233-239
const handleSave = (status: 'draft' | 'published' = 'draft') => {
  const { protocolTitle, protocolNumber } = protocolState.protocolMetadata;
  
  if (!protocolTitle || !protocolNumber) {
    alert('Please enter Protocol Title and Protocol Number before saving');
    return;
  }
  // ... save logic
}
```

**Validation exists** - this should prevent empty titles from being saved.

**BUT:** User might have bypassed this somehow OR there's a bug in validation.

---

### **Theory 2: Field Name Mismatch (From Previous Bug)** ⚠️

**Evidence:**
We just fixed a bug where protocols were saved with `name` and `studyNumber` instead of `protocolTitle` and `protocolNumber`.

**Possible Scenario:**
1. User created protocol BEFORE our fix
2. Protocol saved with old field names
3. After fix, code looks for `protocolTitle`/`protocolNumber` 
4. Fields don't exist → displays as empty

**Check in ProtocolCard.tsx line 71-74:**
```typescript
<h3 className=\"text-xl text-slate-900 font-medium\">
  {protocol.protocolTitle}  // ← Will be undefined if saved with 'name'
</h3>
<span className=\"text-sm text-slate-600 px-3 py-1 bg-white border border-slate-300 rounded\">
  {protocol.protocolNumber}  // ← Will be undefined if saved with 'studyNumber'
</span>
```

---

### **Theory 3: currentVersion Field Mismatch** ✅ MOST LIKELY

**Critical Discovery:**

In **ProtocolCard.tsx line 22-27:**
```typescript
const currentVersionData = protocol.currentVersion
  ? protocol.versions.find(v => v.versionNumber === protocol.currentVersion)
  : null;
const latestDraftData = protocol.latestDraftVersion 
  ? protocol.versions.find(v => v.versionNumber === protocol.latestDraftVersion)
  : null;
```

This code expects `protocol.currentVersion` to be a **version NUMBER string** (e.g., "1.0", "Draft 1/4/2026").

**Click Handler (line 60-64):**
```typescript
onClick={() => {
  const versionToOpen = latestDraftData || currentVersionData;
  if (versionToOpen) {
    onNavigateToBuilder(protocol.id, versionToOpen.id);
  }
}}
```

**IF** `currentVersionData` is `null` (not found) **AND** `latestDraftData` is `null`, then `versionToOpen` will be `undefined`, and the `if` block won't execute → **CLICK DOES NOTHING!**

**Why would this happen?**

In our recent fix to `useVersionControl.ts`, we changed:
```typescript
// BEFORE (WRONG):
currentVersion: newVersion,  // Object reference

// AFTER (FIXED):
currentVersion: newVersion.versionNumber,  // String
```

**BUT** - if a protocol was saved BEFORE this fix, it would have:
```typescript
{
  currentVersion: { id: "v123", versionNumber: "1.0", ... },  // Object, not string!
  versions: [...]
}
```

Then when ProtocolCard tries:
```typescript
protocol.versions.find(v => v.versionNumber === protocol.currentVersion)
```

It's comparing:
```typescript
v.versionNumber === { id: "v123", versionNumber: "1.0", ... }
```

This will **NEVER match** because it's comparing a string to an object!

---

## **Diagnostic Steps**

### **Step 1: Inspect localStorage**

Open browser console and run:
```javascript
const projectId = localStorage.getItem('clinical-intelligence-current-project');
const key = `protocols-${projectId}`;
const stored = localStorage.getItem(key);
console.log(JSON.parse(stored));
```

**Look for:**
1. Does protocol have `protocolTitle` and `protocolNumber` fields?
2. Or does it have `name` and `studyNumber` fields?
3. What is the type of `currentVersion`?
   - String (correct): `"currentVersion": "1.0"`
   - Object (wrong): `"currentVersion": { "id": "v123", ... }`

### **Step 2: Check Protocol Structure**

If you find a protocol, check:
```javascript
const protocols = JSON.parse(localStorage.getItem('protocols-' + projectId));
const problem = protocols[0];

console.log('Protocol Title:', problem.protocolTitle);  // Should be string
console.log('Protocol Number:', problem.protocolNumber);  // Should be string
console.log('Current Version:', problem.currentVersion);  // Should be string
console.log('Current Version Type:', typeof problem.currentVersion);  // Should be "string"
console.log('Versions:', problem.versions);
```

---

## **Proposed Fixes**

### **Fix 1: Migration Function (Immediate)**

Add a migration utility to fix malformed protocols in localStorage:

```typescript
export function migrateProtocolStorage(projectId: string) {
  const key = `protocols-${projectId}`;
  const stored = localStorage.getItem(key);
  if (!stored) return;
  
  const protocols = JSON.parse(stored);
  const migrated = protocols.map((p: any) => {
    // Fix 1: Field names
    const protocolTitle = p.protocolTitle || p.name || '';
    const protocolNumber = p.protocolNumber || p.studyNumber || '';
    
    // Fix 2: currentVersion should be string
    let currentVersion = p.currentVersion;
    if (typeof currentVersion === 'object' && currentVersion !== null) {
      currentVersion = currentVersion.versionNumber || '';
    }
    
    // Fix 3: latestDraftVersion should be string
    let latestDraftVersion = p.latestDraftVersion;
    if (typeof latestDraftVersion === 'object' && latestDraftVersion !== null) {
      latestDraftVersion = latestDraftVersion.versionNumber || undefined;
    }
    
    return {
      id: p.id,
      protocolTitle,
      protocolNumber,
      currentVersion,
      latestDraftVersion,
      createdAt: p.createdAt,
      modifiedAt: p.modifiedAt,
      versions: p.versions || []
    };
  });
  
  localStorage.setItem(key, JSON.stringify(migrated));
  console.log('✅ Migrated', migrated.length, 'protocols');
}
```

### **Fix 2: Defensive Loading in ProtocolCard (Robust)**

Make ProtocolCard more defensive about finding versions:

```typescript
// In ProtocolCard.tsx
const currentVersionData = useMemo(() => {
  if (!protocol.currentVersion) return null;
  
  // Handle both string and object formats
  const versionToFind = typeof protocol.currentVersion === 'string'
    ? protocol.currentVersion
    : protocol.currentVersion?.versionNumber;
  
  return protocol.versions.find(v => v.versionNumber === versionToFind) || null;
}, [protocol]);

const latestDraftData = useMemo(() => {
  if (!protocol.latestDraftVersion) {
    // Fallback: find any draft version
    return protocol.versions.find(v => v.status === 'draft') || null;
  }
  
  const versionToFind = typeof protocol.latestDraftVersion === 'string'
    ? protocol.latestDraftVersion
    : protocol.latestDraftVersion?.versionNumber;
  
  return protocol.versions.find(v => v.versionNumber === versionToFind) || null;
}, [protocol]);
```

### **Fix 3: Fallback to First Version**

If no version is found via `currentVersion`, just use the first available version:

```typescript
onClick={() => {
  const versionToOpen = latestDraftData || currentVersionData || protocol.versions[0];
  
  if (versionToOpen) {
    onNavigateToBuilder(protocol.id, versionToOpen.id);
  } else {
    console.error('No version found for protocol:', protocol.id);
    alert('Error: Protocol has no valid versions');
  }
}}
```

### **Fix 4: Display Fallback for Empty Titles**

```typescript
<h3 className=\"text-xl text-slate-900 font-medium\">
  {protocol.protocolTitle || protocol.name || '[Untitled Protocol]'}
</h3>
<span className=\"text-sm text-slate-600 px-3 py-1 bg-white border border-slate-300 rounded\">
  {protocol.protocolNumber || protocol.studyNumber || '[No Number]'}
</span>
```

---

## **Implementation Plan**

### **Phase 1: Diagnostic (Low Risk)**
1. ✅ Add debug utility to inspect storage
2. ✅ Document findings
3. ✅ Identify exact issue

### **Phase 2: Quick Fix (Low Risk)**
1. ✅ Add fallback display for empty titles
2. ✅ Add fallback to first version if currentVersion not found
3. ✅ Add error handling in click handler

### **Phase 3: Migration (Medium Risk)**
1. ✅ Add migration function
2. ✅ Test migration on sample data
3. ✅ Document migration process

### **Phase 4: Defensive Code (Low Risk)**
1. ✅ Make ProtocolCard handle both string and object currentVersion
2. ✅ Add type guards for version matching
3. ✅ Add comprehensive logging

---

## **Testing Checklist**

After implementing fixes:

- [ ] Protocol with empty title shows "[Untitled Protocol]"
- [ ] Protocol with empty number shows "[No Number]"
- [ ] Clicking protocol opens in builder
- [ ] Protocol metadata loads correctly
- [ ] Schema blocks load correctly
- [ ] Save functionality still works
- [ ] New protocols save correctly
- [ ] Migration fixes old protocols
- [ ] No console errors

---

## **Recommended Action**

**Immediate:**
1. Implement Fix 3 (Fallback to first version)
2. Implement Fix 4 (Display fallback for titles)
3. Add error logging

**Short-term:**
1. Create migration utility
2. Test with user's existing data
3. Document migration steps

**Long-term:**
1. Add TypeScript strict mode
2. Add runtime validation
3. Add unit tests for protocol storage

---

## **Files to Modify**

| File | Changes | Risk |
|------|---------|------|
| `/components/protocol-library/components/ProtocolCard.tsx` | Add defensive version loading, fallback displays | Low |
| `/utils/protocolMigration.ts` | NEW: Migration utility | Low |
| `/components/protocol-library/hooks/useProtocolLibrary.ts` | Add migration call on load | Low |

**Total Risk:** Low ✅  
**Total Lines Changed:** ~50  
**Breaking Changes:** None  
**Backward Compatible:** Yes
