# Schema Block Type Unification Fix

## Problem Statement

**Issue:** Data Entry forms in the Database tab were not displaying fields from auto-generated protocols, despite the Data Browser showing table structures correctly.

**Root Cause:** Dual SchemaBlock type definitions causing a type mismatch between auto-generation and database generation systems.

---

## Architecture Analysis

### Two Conflicting Type Definitions

#### 1. Simplified SchemaBlock (`/types/shared.ts`)
Used by: Study DNA auto-generation system

```typescript
interface SchemaBlock {
  id: string;
  type: 'section' | 'endpoint' | 'variable' | 'text' | 'matrix' | 'categorical';
  title: string;
  description?: string;
  children?: SchemaBlock[];
  metadata?: {
    dataType?: string;
    required?: boolean;
    tags?: string[];
  };
}
```

#### 2. Full SchemaBlock (`/components/protocol-workbench/types.ts`)
Used by: Protocol Workbench, Database Generator

```typescript
interface SchemaBlock {
  id: string;
  variable: Variable;  // ❌ Missing in simplified
  dataType: DataType;  // ❌ Missing in simplified
  role: RoleTag;       // ❌ Missing in simplified
  unit?: string;
  options?: string[];
  endpointTier?: 'primary' | 'secondary' | 'exploratory' | null;
  // ... many more fields
}
```

### Data Flow Breakdown

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Project Creation                                         │
│    User creates project → Auto-generates protocol          │
│    Uses: Simplified SchemaBlock format                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Protocol Storage                                         │
│    Protocol saved to localStorage                           │
│    Contains: Simplified SchemaBlocks                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Database Tab Opened                                      │
│    Database Generator reads protocol                        │
│    Expects: Full SchemaBlock format                         │
│    Receives: Simplified SchemaBlock format                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. TYPE MISMATCH ERROR                                      │
│    generateDatabaseFields() tries to access:                │
│    - block.variable.name     → undefined                    │
│    - block.variable.category → undefined                    │
│    - block.dataType          → undefined                    │
│    - block.role              → undefined                    │
│                                                             │
│    Result: No fields generated → Empty forms               │
└─────────────────────────────────────────────────────────────┘
```

---

## Solution Architecture

### Three-Layer Fix Strategy

#### Phase 1: Type Adapter (Non-Breaking)
**File:** `/utils/schemaBlockAdapter.ts`

**Purpose:** Bridge between simplified and full formats without breaking existing code.

**Key Functions:**
- `isSimplifiedSchemaBlock()` - Type guard to detect format
- `isFullSchemaBlock()` - Type guard to detect format
- `convertSimplifiedToFullSchemaBlock()` - Core conversion logic
- `convertSchemaBlocks()` - Batch converter
- `debugSchemaBlockFormat()` - Debugging utility

**Conversion Logic:**
```typescript
Simplified Block                    Full Block
─────────────────                   ──────────
type: 'endpoint'          →         role: 'Outcome'
                                    endpointTier: 'primary'

title: 'Blood Pressure'   →         variable: {
                                      name: 'Blood Pressure',
                                      category: 'Vitals' (inferred),
                                      icon: Heart (mapped)
                                    }

metadata.dataType: 'numeric' →      dataType: 'Continuous'

metadata.tags: ['primary']   →      endpointTier: 'primary'
                                    isPrimary: true
```

#### Phase 2: Update Auto-Generation
**File:** `/utils/studyDNAAutoGeneration.ts`

**Changes:**
1. Import adapter functions
2. Convert blocks immediately after generation
3. Store converted blocks in protocol version
4. Add debug logging

```typescript
// Before
schemaBlocks: createSchemaBlocksFromTemplate(template, metadata)

// After
const simplifiedBlocks = createSchemaBlocksFromTemplate(template, metadata);
const fullSchemaBlocks = convertSchemaBlocks(simplifiedBlocks);
schemaBlocks: fullSchemaBlocks
```

#### Phase 3: Defensive Database Generator
**File:** `/components/database/utils/schemaGenerator.ts`

**Changes:**
1. Add type checking at entry point
2. Auto-convert if simplified blocks detected
3. Log warnings for debugging
4. Failsafe conversion layer

```typescript
export function generateDatabaseTables(protocolVersion: ProtocolVersion) {
  let schemaBlocks = protocolVersion.schemaBlocks;
  
  // Defensive check
  if (schemaBlocks.length > 0 && isSimplifiedSchemaBlock(schemaBlocks[0])) {
    console.warn('⚠️ Simplified blocks detected - auto-converting');
    schemaBlocks = convertSchemaBlocks(schemaBlocks);
  }
  
  // Continue with full blocks
  const fields = generateDatabaseFields(schemaBlocks, ...);
}
```

---

## Type Mapping Reference

### Data Type Conversion

| Simplified Type          | Full DataType       | SQL Type    |
|-------------------------|---------------------|-------------|
| `numeric`               | `Continuous`        | `FLOAT`     |
| `categorical`           | `Categorical`       | `VARCHAR`   |
| `boolean`, `yes/no`     | `Boolean`           | `BOOLEAN`   |
| `date`, `time`          | `Date`              | `DATE`      |
| `text`, `string`        | `Text`              | `TEXT`      |
| `multi`                 | `Multi-Select`      | `JSON`      |
| `matrix`                | `Ranked-Matrix`     | `JSON`      |
| `grid`                  | `Categorical-Grid`  | `JSON`      |

### Role Tag Inference

| Block Type   | Tags Present      | Inferred Role  |
|-------------|-------------------|----------------|
| `endpoint`  | `['primary']`     | `Outcome`      |
| `endpoint`  | `['secondary']`   | `Outcome`      |
| `variable`  | `['treatment']`   | `Predictor`    |
| `section`   | any               | `Structure`    |
| `variable`  | none              | `Predictor`    |

### Category Inference

Keywords in title/description → Category mapping:

- `age`, `sex`, `gender`, `demographic` → `Demographics`
- `blood pressure`, `heart rate`, `vital` → `Vitals`
- `laboratory`, `lab`, `blood`, `serum` → `Laboratory`
- `treatment`, `intervention`, `therapy` → `Treatments`
- `endpoint`, `outcome`, `efficacy` → `Endpoints`
- `adverse`, `safety`, `toxicity` → `Safety`
- `clinical`, `diagnosis`, `disease` → `Clinical`

---

## Testing Strategy

### Test Cases

#### 1. New Project Creation
```
✅ Create RCT project
✅ Auto-generate protocol
✅ Open Database tab
✅ Verify tables generated
✅ Verify Data Entry form shows fields
✅ Check console for conversion logs
```

#### 2. All Study Types
```
✅ Test RCT
✅ Test Case Series
✅ Test Cohort Study
✅ Test Laboratory Study
✅ Test Technical Note
```

#### 3. Existing Protocols
```
✅ Load protocol created before fix
✅ Verify backward compatibility
✅ Check defensive conversion triggers
```

#### 4. Data Entry Flow
```
✅ Navigate to Data Entry tab
✅ Select protocol
✅ Verify form fields render
✅ Fill out form
✅ Save draft
✅ Submit complete record
✅ View in Data Browser
```

---

## Code Corruption Prevention

### 1. Centralized Type Definitions
- All SchemaBlock types should eventually live in `/types/shared.ts`
- Import from single source across the application

### 2. Type Guards
```typescript
if (isSimplifiedSchemaBlock(block)) {
  // Handle simplified format
}
if (isFullSchemaBlock(block)) {
  // Handle full format
}
```

### 3. Adapter Pattern
- Never directly convert between types inline
- Always use the centralized adapter functions
- Add logging for debugging

### 4. Defensive Programming
```typescript
// Always check format at system boundaries
if (needsConversion) {
  data = convertSchemaBlocks(data);
}
```

### 5. Documentation
- JSDoc on all type definitions
- Clear comments on which format to use when
- Examples in documentation

---

## Future Work (Phase 4)

### Type Unification Goals

1. **Merge Type Definitions**
   - Move full SchemaBlock to `/types/shared.ts`
   - Delete duplicate from Protocol Workbench
   - Update all imports

2. **Deprecate Simplified Format**
   - Mark simplified format as deprecated
   - Update auto-generation to create full blocks directly
   - Remove adapter after migration period

3. **Schema Versioning**
   - Add schema version field to protocols
   - Support multiple schema versions
   - Automatic migration on load

4. **Type Safety**
   - Add runtime validation with Zod/Yup
   - Validate on save/load
   - Clear error messages

---

## Impact Analysis

### Before Fix
- ❌ Auto-generated protocols: No data entry forms
- ❌ Empty field lists in database
- ❌ Silent failures (no error messages)
- ❌ Type mismatch corruption risk

### After Fix
- ✅ Auto-generated protocols: Full data entry support
- ✅ All fields render correctly
- ✅ Defensive conversion prevents errors
- ✅ Clear debug logging
- ✅ Backward compatible

---

## Related Files

### Core Implementation
- `/utils/schemaBlockAdapter.ts` - Type adapter
- `/utils/studyDNAAutoGeneration.ts` - Auto-generation with conversion
- `/components/database/utils/schemaGenerator.ts` - Defensive database generator

### Type Definitions
- `/types/shared.ts` - Simplified SchemaBlock
- `/components/protocol-workbench/types.ts` - Full SchemaBlock

### Components
- `/components/Database.tsx` - Main database UI
- `/components/DataEntryForm.tsx` - Data entry forms
- `/components/database/components/DataEntryView.tsx` - Data entry view

---

## Summary

This fix establishes a robust type conversion system that:

1. ✅ **Solves the immediate problem** - Data entry forms now work
2. ✅ **Prevents future corruption** - Defensive checks at system boundaries
3. ✅ **Maintains backward compatibility** - Existing protocols still work
4. ✅ **Provides clear debugging** - Console logging for troubleshooting
5. ✅ **Sets up long-term solution** - Path to type unification

The modular implementation allows for safe testing and validation at each phase without breaking existing functionality.
