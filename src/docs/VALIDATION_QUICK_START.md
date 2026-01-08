# 🚀 Validation Quick Start Guide

## 30-Second Summary

**What:** Replace defensive programming with validation-first architecture  
**Why:** Prevent data corruption instead of handling it everywhere  
**How:** Validate at boundaries (imports, saves), trust data everywhere else  
**Status:** Foundation complete, ready to integrate  

---

## 5-Minute Integration

### Step 1: Install Zod
```bash
npm install zod@^3.22.4
```

### Step 2: Update Import Handler
File: `/components/DataImportExport.tsx`

```typescript
// Add import
import { validateImportFile } from '../utils/validation/importValidator';

// In handleImport function, add validation BEFORE import:
const result = validateImportFile(jsonText);

if (!result.canProceed) {
  alert(result.summary + '\n\nSee console for details');
  console.error('Validation errors:', result.errors);
  return; // Don't import
}

// Continue with import only if valid
dataExporter.importFromJSON(jsonText);
```

### Step 3: Test
1. Try importing invalid JSON → See error
2. Try importing valid export → Works as before

---

## What You Get

### Before
```
Import → ❓ Maybe works → ❓ Data maybe valid → ❓ Might crash later
```

### After
```
Import → ✅ Validation → Valid data OR Clear error message
```

---

## Example Error Messages

### Invalid JSON
```
❌ Validation failed: 1 error(s) found
• file: File contains invalid JSON syntax
```

### Missing Required Field
```
❌ Validation failed: 2 error(s) found
• projects[0].project.name: Required
• projects[0].project.primaryInvestigator: Required
```

### Invalid Statistical Manifest
```
⚠️ Warning: Statistical manifest validation failed
• manifestMetadata: Required
Note: Import will proceed, but manifest will be skipped
```

---

## Files You Created

```
/utils/validation/
  ├── schemas.ts              # Zod schemas for all types
  ├── validators.ts           # Validation utilities
  └── importValidator.ts      # Import validation logic

/components/
  └── ValidationErrorDisplay.tsx  # Error display UI

/docs/
  ├── VALIDATION_ARCHITECTURE_PLAN.md
  ├── ANTI_CORRUPTION_IMPLEMENTATION_PLAN.md
  └── VALIDATION_QUICK_START.md (this file)
```

---

## Testing Checklist

- [ ] Install Zod package
- [ ] Import invalid JSON file → See clear error
- [ ] Import file with missing fields → See which fields are missing
- [ ] Import valid export → Works perfectly
- [ ] Check console logs → Helpful diagnostic info

---

## Common Issues & Solutions

### Issue: "Module not found: zod"
**Solution:** Run `npm install zod@^3.22.4`

### Issue: TypeScript errors in validation files
**Solution:** Make sure Zod is installed. Types come from the package.

### Issue: Validation passes but import fails
**Solution:** Validation only checks structure. Import errors are separate.

### Issue: Want to skip validation for testing
**Solution:** 
```typescript
const SKIP_VALIDATION = true; // Temporary flag
if (!SKIP_VALIDATION) {
  const result = validateImportFile(text);
  // ...
}
```

---

## Architecture at a Glance

```typescript
// ❌ OLD: Defensive everywhere
function save(data: any) {
  try {
    const normalized = normalizeData(data);
    storage.save(normalized);
  } catch {
    console.warn('Failed');
  }
}

// ✅ NEW: Validate once
function save(data: unknown) {
  const result = validate(data);
  if (!result.success) {
    throw new ValidationError(result.errors);
  }
  storage.save(result.data); // Type-safe!
}
```

---

## Benefits You'll See Immediately

1. **Clear Errors** - No more "something went wrong"
2. **Faster Debugging** - Errors caught at boundaries
3. **Type Safety** - TypeScript knows validated data is correct
4. **Less Code** - Remove defensive programming
5. **Better UX** - Users see what's wrong and can fix it

---

## Next Steps

### Immediate (Today)
1. Read this guide ✅
2. Install Zod
3. Test with invalid import
4. See validation errors

### This Week
1. Integrate validation into import flow
2. Test with real data
3. Deploy to test environment

### This Month
1. Add validation to save operations (optional)
2. Scan existing data for issues
3. Remove defensive code gradually

---

## Need Help?

### Full Documentation
- `/docs/VALIDATION_ARCHITECTURE_PLAN.md` - Complete philosophy
- `/docs/ANTI_CORRUPTION_IMPLEMENTATION_PLAN.md` - Detailed guide

### Key Concepts
- **Guardrails > Band-Aids** - Prevent problems, don't catch them everywhere
- **Fail Fast** - Show errors immediately, not later
- **Single Source of Truth** - One schema, many uses

### Schema Location
All validation schemas are in `/utils/validation/schemas.ts`

To add validation elsewhere:
```typescript
import { ManuscriptManifestSchema } from '@/utils/validation/schemas';

const result = ManuscriptManifestSchema.safeParse(data);
if (result.success) {
  // Use result.data - it's typed!
} else {
  // Show result.error
}
```

---

## Remember

> "Make invalid states unrepresentable, not handleable"

Instead of handling invalid data everywhere, make it impossible for invalid data to enter the system.

**This is the guardrails approach you asked for!** 🛡️
