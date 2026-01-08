# Database Implementation Plan

## Overview
Restructure the Database tab to generate database tables/fields from Protocol Builder schema and track field changes across protocol versions.

## Current Protocol Structure Understanding

### SchemaBlock Structure (from types.ts)
- Each `SchemaBlock` contains:
  - `id`, `variable` (name, category), `dataType`, `role`
  - `endpointTier` (primary/secondary/exploratory)
  - `children[]` (nested hierarchy)
  - `unit`, `minValue`, `maxValue`, `options[]`
  - `versionTag`, `versionColor` (for version tracking)
  - Clinical metadata (ranges, dependencies, etc.)

### ProtocolVersion Structure
- Contains complete protocol snapshot:
  - `schemaBlocks[]` - the variable structure
  - `metadata` - protocol header info
  - `protocolContent` - objectives, criteria, statistical plan
  - `status` - draft/published/archived
  - `changeLog` - version changes description

## Implementation Strategy

### 1. Database Tab Restructure

**Current Tabs:**
- Tables & Views
- Query Builder
- Data Import
- Audit Trail

**New Nested Structure:**

```
Database Tab
├── Schema View (NEW - shows protocol-generated structure)
│   ├── Table Generator (from protocol schema)
│   ├── Field Mapping (schema blocks → database fields)
│   └── Version Comparison (show field changes)
├── Data Entry (NEW - forms based on schema)
│   ├── Subject enrollment forms
│   ├── Visit data capture
│   └── Validation rules from protocol
├── Data Browser (renamed from "Tables & Views")
│   ├── Browse entered data
│   ├── Filter by version/subject/visit
│   └── Field change indicators
└── Query & Export
    ├── Query Builder (kept)
    ├── Data Export (enhanced)
    └── Audit Trail (kept)
```

### 2. Field Change Annotation System

**Visual Indicators for Protocol Version Changes:**

#### Color Coding Scheme:

**Modified Fields (changed between versions):**
- **Color:** Amber/Yellow left border (4px solid)
- **Background:** Very light amber (`bg-amber-50`)
- **Badge:** "MODIFIED" in amber (`bg-amber-100 text-amber-700`)
- **Tooltip:** Show what changed (e.g., "Data type changed from Text → Categorical")

**Removed/Deprecated Fields:**
- **Color:** Red strikethrough text
- **Background:** Light gray (`bg-slate-100`)
- **Opacity:** 60% (`opacity-60`)
- **Badge:** "DEPRECATED" in red (`bg-red-100 text-red-700`)
- **Lock Icon:** Show that data is retained but field is inactive
- **Tooltip:** "Removed in v2.0 - Historical data preserved"

**New Fields (added in current version):**
- **Color:** Green/Blue left border (4px solid `border-l-green-500`)
- **Background:** Very light green (`bg-green-50`)
- **Badge:** "NEW" in green (`bg-green-100 text-green-700`)
- **Icon:** Sparkles icon to indicate freshness
- **Tooltip:** "Added in v2.0"

**Unchanged Fields:**
- **Color:** Normal white background
- **Border:** Standard slate border
- **No badge** - clean appearance

#### Version Comparison View:
```
Protocol v1.0 → v2.0

Field Name              | Status      | v1.0 Type    | v2.0 Type    | Data Action
------------------------|-------------|--------------|--------------|-------------
patient_age             | Unchanged   | Continuous   | Continuous   | -
treatment_arm           | Modified    | Text         | Categorical  | Migrate
adverse_event_severity  | New         | -            | Categorical  | Collect
legacy_biomarker_x      | Deprecated  | Continuous   | -            | Archive
```

### 3. Data Persistence Rules

**When Protocol Version Changes:**

1. **Modified Fields:**
   - Keep existing data
   - Show migration warning if data type changed
   - Require validation/transformation if incompatible
   - Tag all affected records with `field_modified_at_version`

2. **Removed Fields:**
   - **NEVER delete data** (regulatory requirement)
   - Set field status to "deprecated"
   - Hide from active forms but show in "All Fields" view
   - Keep in database with `deprecated_version` tag
   - Show in grey/strikethrough in data browser
   - Include in exports with deprecation flag

3. **New Fields:**
   - Add to schema immediately
   - Mark as "new" for current version
   - Allow NULL for historical records (collected before field existed)
   - Show indicator that old records don't have this data

### 4. Database Schema Generation Logic

**From Protocol SchemaBlocks → Database Tables:**

```typescript
// Pseudo-code for schema generation
function generateDatabaseSchema(protocolVersion: ProtocolVersion) {
  const tables = [];
  
  // Main subjects table
  tables.push({
    name: `subjects_${protocolVersion.metadata.protocolNumber}`,
    fields: extractDemographicFields(protocolVersion.schemaBlocks)
  });
  
  // Visit/time-based tables (for repeated measures)
  tables.push({
    name: `visits_${protocolVersion.metadata.protocolNumber}`,
    fields: extractTimeVaryingFields(protocolVersion.schemaBlocks)
  });
  
  // Endpoint tables (primary/secondary/exploratory)
  const endpointFields = extractEndpointFields(protocolVersion.schemaBlocks);
  tables.push({
    name: `endpoints_${protocolVersion.metadata.protocolNumber}`,
    fields: endpointFields
  });
  
  return tables;
}

function compareVersionSchemas(v1: ProtocolVersion, v2: ProtocolVersion) {
  const changes = [];
  
  // Find modified fields
  // Find removed fields
  // Find new fields
  
  return {
    modified: [...],
    removed: [...],
    added: [...]
  };
}
```

### 5. UI Components Needed

**New Components:**
1. `DatabaseSchemaView.tsx` - Shows protocol-generated database structure
2. `DataEntryForm.tsx` - Dynamic form builder from SchemaBlocks
3. `FieldChangeIndicator.tsx` - Visual badges/borders for field status
4. `VersionComparison.tsx` - Side-by-side version diff view
5. `DeprecatedFieldsPanel.tsx` - Archive view of removed fields

**Enhanced Components:**
1. Extend `Database.tsx` with new tab structure
2. Add version selector to database views
3. Add field filtering (show/hide deprecated, new, modified)

### 6. Implementation Phases

**Phase 1: Schema Generation (Foundation)**
- Read SchemaBlocks from active protocol
- Generate database table structure
- Map data types (Continuous → FLOAT, Categorical → ENUM, etc.)
- Display in "Schema View" tab

**Phase 2: Version Comparison**
- Implement schema diff algorithm
- Show field change indicators
- Add version selector dropdown
- Implement color-coded field status

**Phase 3: Data Entry Forms**
- Build dynamic forms from SchemaBlocks
- Include validation from protocol (min/max, options)
- Handle nested/hierarchical fields
- Save to localStorage with version tags

**Phase 4: Data Browser Enhancement**
- Show entered data with version awareness
- Filter by field status (active/deprecated/new)
- Display field change tooltips
- Export with metadata

## Visual Design Mockup

### Field Status Legend (shown in UI):
```
┌─────────────────────────────────────────┐
│ Field Status Legend                      │
├─────────────────────────────────────────┤
│ ║ Normal Field        (white bg)         │
│ ║ Modified Field      (amber border)     │
│ ║ New Field          (green border)      │
│ ║ Deprecated Field   (grey bg, strike)   │
└─────────────────────────────────────────┘
```

### Example Field Rendering:
```
┌──────────────────────────────────────────────────────┐
│ patient_age                                   NORMAL │
│ Type: Continuous | Range: 18-85 | Unit: years       │
└──────────────────────────────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ (amber border)
┃ treatment_arm                              MODIFIED ┃
┃ Type: Categorical ← Changed from Text               ┃
┃ Options: [Arm A, Arm B, Placebo]                    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ (green border)
┃ biomarker_xyz                                   NEW ✨┃
┃ Type: Continuous | Unit: ng/mL                      ┃
┃ Added in v2.0                                        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌──────────────────────────────────────────────────────┐ (grey bg)
│ legacy_marker        🔒                  DEPRECATED │ (strikethrough)
│ Type: Continuous                                     │
│ Removed in v2.0 - Data archived                      │
└──────────────────────────────────────────────────────┘
```

## Questions for User Confirmation:

1. **Color scheme agreement?**
   - Amber for modified ✓
   - Red/grey for deprecated ✓
   - Green for new ✓

2. **Data handling for removed fields:**
   - Never delete, always archive? ✓ (regulatory requirement)
   - Show in separate "Archived Fields" view?

3. **Migration warnings:**
   - Should we block protocol version acceptance if field type changes are incompatible with existing data?
   - Or allow with warning + manual migration step?

4. **Nested structure preference:**
   - Should Database be a separate top-level tab (current)?
   - Or nested within Protocol Builder as "Data Collection" tab?

## Next Steps:
1. Get user approval on plan
2. Implement Phase 1 (Schema Generation)
3. Add version comparison logic
4. Build color-coded field indicators
5. Test with protocol version workflow
