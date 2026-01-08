# Database Module - Modular Architecture

This directory contains the refactored Clinical Database system with clean separation of concerns.

## 📁 Directory Structure

```
database/
├── hooks/
│   └── useDatabase.ts              # State management & protocol loading
├── components/
│   ├── SchemaView.tsx              # Schema view tab with field filtering
│   ├── DataEntryView.tsx           # Data entry wrapper
│   ├── DataBrowserView.tsx         # Data browser wrapper
│   └── QueryView.tsx               # SQL query interface
├── utils/
│   └── schemaGenerator.ts          # Database table generation logic
└── index.ts                        # Clean exports
```

## 🎯 Component Responsibilities

### `useDatabase.ts` Hook (~120 lines)
**Purpose:** Centralized state management for the database module

**Responsibilities:**
- Load protocols from localStorage
- Auto-refresh protocol data every 2 seconds
- Manage protocol/version selection
- Auto-generate database tables from schema blocks
- Manage active tab state
- Manage field filter state

**Returns:**
- `savedProtocols` - All loaded protocols
- `selectedProtocolId` / `setSelectedProtocolId` - Current protocol
- `selectedVersionId` / `setSelectedVersionId` - Current version
- `selectedProtocol` / `selectedVersion` - Computed values
- `databaseTables` - Auto-generated tables
- `activeTab` / `setActiveTab` - Tab navigation
- `showFieldFilter` / `setShowFieldFilter` - Field status filters
- `loadProtocols` - Manual refresh function

### `schemaGenerator.ts` Utility (~400 lines)
**Purpose:** Generate database tables from Protocol Builder schema blocks

**Key Functions:**
- `generateDatabaseFields()` - Convert SchemaBlocks to DatabaseFields
- `findDeprecatedFields()` - Identify removed fields from previous versions
- `generateDatabaseTables()` - Create complete table structures

**Features:**
- Automatic SQL type mapping
- Version comparison (NEW/MODIFIED/DEPRECATED field status)
- Hierarchical field processing (handles nested blocks)
- Category-based table organization
- Base fields injection (subject_id, enrollment_date, visit_number)

### `SchemaView.tsx` Component (~280 lines)
**Purpose:** Display auto-generated database schema with version tracking

**Responsibilities:**
- Render all database tables
- Show field-level change indicators (NEW, MODIFIED, DEPRECATED)
- Field filtering by status
- Display SQL types and constraints
- Visual differentiation for field status

**Props:**
- `tables` - Database tables to display
- `showFieldFilter` - Filter state object
- `onFilterChange` - Filter update callback

### `DataEntryView.tsx` Component (~30 lines)
**Purpose:** Wrapper for data entry functionality

**Responsibilities:**
- Check if protocol is selected
- Render empty state or DataEntryForm
- Pass through protocol context

### `DataBrowserView.tsx` Component (~20 lines)
**Purpose:** Wrapper for data browser functionality

**Responsibilities:**
- Render DataBrowser component
- Pass through protocol context
- Handle record editing navigation

### `QueryView.tsx` Component (~50 lines)
**Purpose:** SQL query builder interface

**Responsibilities:**
- Table selection dropdown
- SQL query textarea
- Execute button (placeholder)
- Results display (placeholder)

### `Database.tsx` Main Component (~240 lines)
**Purpose:** Orchestrate the entire database module

**Responsibilities:**
- Render header with title and actions
- Protocol/version selection dropdowns
- Tab navigation bar
- Route to appropriate view component based on active tab
- Manage overall layout

## 🔄 Data Flow

```
User selects protocol/version
    ↓
useDatabase hook
    ↓
schemaGenerator.generateDatabaseTables()
    ↓
Auto-generated DatabaseTable[]
    ↓
SchemaView / DataEntryView / DataBrowserView
```

## 🔧 Schema Generation Process

1. **Input:** ProtocolVersion with SchemaBlocks
2. **Field Generation:**
   - Traverse all SchemaBlocks (including nested children)
   - Convert each block to DatabaseField
   - Map data types to SQL types
   - Determine field status (NEW/MODIFIED/DEPRECATED)
3. **Table Organization:**
   - Group fields by category (Demographics, Clinical, Laboratory, etc.)
   - Inject base fields (subject_id, enrollment_date)
   - Create tables in schema order
4. **Output:** DatabaseTable[] ready for UI rendering

## ✅ Benefits of This Architecture

1. **Single Source of Truth** - Protocol Builder schema drives database structure
2. **Version Tracking** - Automatic change detection between versions
3. **Modular Design** - Easy to maintain and extend
4. **Type Safety** - Full TypeScript support
5. **Reusability** - Components can be used independently
6. **Clear Separation** - Business logic (hook) vs. presentation (components)

## 📊 Size Comparison

**Before Refactoring:**
- Database.tsx: ~600+ lines (monolithic with mixed concerns)

**After Refactoring:**
- useDatabase.ts: ~120 lines (state management)
- schemaGenerator.ts: ~400 lines (business logic)
- SchemaView.tsx: ~280 lines (schema display)
- DataEntryView.tsx: ~30 lines (wrapper)
- DataBrowserView.tsx: ~20 lines (wrapper)
- QueryView.tsx: ~50 lines (query UI)
- Database.tsx: ~240 lines (orchestrator)
- index.ts: 6 lines (exports)

**Total:** Same functionality, now modular and maintainable!

## 🚀 Key Features

### Auto-Generated Database Tables
- **Source:** Protocol Builder SchemaBlocks
- **Tables Created:**
  - Subject Demographics (Demographics category)
  - Study Endpoints (Primary/Secondary/Exploratory endpoints)
  - Clinical Data (Clinical observations, treatments, AEs)
  - Laboratory Results (Lab tests, biomarkers)

### Field Status Tracking
- **NORMAL** - Unchanged from previous version
- **NEW** - Added in current version (shows version number)
- **MODIFIED** - Changed data type/unit/config (shows change description)
- **DEPRECATED** - Removed in current version (still shown for audit trail)

### Version Comparison
- Automatically compares current version with previous version
- Highlights all changes at field level
- Maintains immutable audit trail
- Shows exact version where changes occurred

### Dynamic Form Generation
- Data entry forms auto-generated from schema
- Field validation based on constraints
- Support for all data types (Continuous, Categorical, Date, etc.)
- Special handling for complex types (Ranked Matrix, Multi-Select)

## 🔐 Compliance & Audit Trail

- **Immutable Version History** - All schema changes tracked
- **Field-Level Audit** - Know exactly when each field was added/modified/deprecated
- **Read-Only Mode** - Query interface prevents unauthorized changes
- **Change Documentation** - Automatic generation of change descriptions

## 🎨 Visual Indicators

- **Green Border + BG** - New fields
- **Amber Border + BG** - Modified fields
- **Gray BG + Strikethrough** - Deprecated fields
- **Blue Badges** - Required fields
- **Purple/Blue Badges** - Endpoint tiers

## 📝 Usage Example

```tsx
import { Database } from './components/Database';

function App() {
  return <Database />;
}
```

The Database component is fully self-contained and will:
1. Auto-load protocols from localStorage
2. Auto-select first protocol and latest version
3. Auto-generate database tables
4. Auto-refresh every 2 seconds
5. Handle all tab navigation internally

## 🔮 Future Enhancements

This architecture makes it easy to add:
- **Export to SQL** - Generate actual CREATE TABLE statements
- **Data Import** - Bulk import from CSV/Excel
- **Advanced Queries** - Visual query builder
- **Real-Time Sync** - Replace localStorage with Supabase
- **Data Validation Rules** - Complex cross-field validations
- **Audit Log Viewer** - See all data changes over time
