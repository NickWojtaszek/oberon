# Clinical Intelligence Engine - Complete Technical Specification

**Version:** 2.0  
**Last Updated:** January 4, 2026  
**Target Audience:** Claude Code (AI Development Assistant)  
**Purpose:** Complete system documentation for seamless development continuation

**Recent Updates:**
- ✅ PersonaEditor now has full localStorage persistence
- ✅ Phase 4: Manifest Locking complete (PI-only controls)
- ✅ Research Factory default UI fully deployed
- ✅ Governance RBAC system active (Phases 0-4 complete)

---

## Table of Contents

1. [Application Overview](#1-application-overview)
2. [Architecture & Technology Stack](#2-architecture--technology-stack)
3. [Data Models & Relationships](#3-data-models--relationships)
4. [Storage Architecture](#4-storage-architecture)
5. [Core Modules](#5-core-modules)
6. [User Workflows](#6-user-workflows)
7. [Component Hierarchy](#7-component-hierarchy)
8. [Implementation Status](#8-implementation-status)
9. [Development Guidelines](#9-development-guidelines)
10. [Known Issues & Future Work](#10-known-issues--future-work)

---

## 1. Application Overview

### 1.1 Purpose

The **Clinical Intelligence Engine** is a professional web application for clinical trial teams to:

- Design and manage clinical trial protocols using recursive schema structures
- Generate database tables automatically from protocol schemas
- Collect and analyze clinical trial data with regulatory compliance
- Manage multiple projects with version control and audit trails
- Support multi-user collaboration with role-based permissions

### 1.2 Target Users

1. **Clinical Investigators** - Design protocols, review data
2. **Biostatisticians** - Analyze data, create queries
3. **Regulatory Reviewers** - Audit changes, verify compliance
4. **Data Managers** - Enter and manage clinical data

### 1.3 Design Philosophy

- **Clinical-grade UI**: Professional, clean, enterprise-style (no gamification)
- **Regulatory compliance**: GCP, 21 CFR Part 11 compliant audit trails
- **Desktop-first**: Min 1280px width, 8px spacing system
- **Color scheme**: White surfaces, light gray backgrounds, blue primary (#2563EB)
- **Data integrity**: Version locking, schema freezing, comprehensive logging

---

## 2. Architecture & Technology Stack

### 2.1 Technology Stack

```
Frontend:
  - React 18+ (TypeScript)
  - Tailwind CSS v4.0 (no config file, CSS-based)
  - Lucide React (icons)
  - Recharts (data visualization)
  - Motion/React (animations, formerly Framer Motion)

Storage:
  - localStorage (multi-project scoped)
  - No backend/database (pure frontend application)

Build:
  - Vite/Webpack (Figma Make environment)
  - TypeScript strict mode
```

### 2.2 File Structure

```
/
├── App.tsx                          # Main application entry point
├── styles/
│   └── globals.css                  # Tailwind config + typography tokens
├── components/
│   ├── Dashboard.tsx                # Progress Card Dashboard (5-step workflow)
│   ├── PersonaEditor.tsx            # User profile & role management
│   ├── ProjectCreationModal.tsx     # Multi-project creation
│   ├── protocol-workbench/          # Protocol Builder module
│   │   ├── ProtocolWorkbenchCore.tsx
│   │   ├── hooks/
│   │   │   └── useVersionControl.ts # Protocol CRUD operations
│   │   ├── components/              # Schema editor UI components
│   │   └── types.ts                 # Protocol/version type definitions
│   ├── protocol-library/            # Protocol Library module
│   │   ├── ProtocolLibrary.tsx
│   │   └── hooks/
│   │       └── useProtocolLibrary.ts
│   ├── database/                    # Database module
│   │   ├── components/
│   │   │   ├── SchemaView.tsx       # Auto-generated tables view
│   │   │   ├── DataEntryView.tsx    # Form-based data entry
│   │   │   ├── DataBrowserView.tsx  # Table-based data browser
│   │   │   └── QueryView.tsx        # Query builder
│   │   ├── hooks/
│   │   │   └── useDatabase.ts       # Database operations
│   │   └── utils/
│   │       └── schemaGenerator.ts   # Schema → Database table converter
│   ├── Database.tsx                 # Database module wrapper
│   └── Analytics.tsx                # Analytics & visualizations
├── contexts/
│   ├── ProjectContext.tsx           # Multi-project state management
│   └── PersonaContext.tsx           # User role & permissions
├── utils/
│   ├── storageService.ts            # Centralized storage operations
│   ├── storageKeys.ts               # Storage key constants
│   ├── schemaBlockAdapter.ts        # Schema format conversion
│   ├── protocolStorageMigration.ts  # Legacy data migration
│   └── studyDNA.ts                  # Protocol template generator
└── docs/                            # Implementation documentation
    ├── STORAGE_ARCHITECTURE.md
    ├── SCHEMA_FREEZE_SYSTEM.md
    ├── STORAGE_FIX_IMPLEMENTATION_COMPLETE.md
    └── [other technical docs]
```

---

## 3. Data Models & Relationships

### 3.1 Core Data Entities

```typescript
// PROJECT
interface Project {
  id: string;                    // "project-{timestamp}-{random}"
  name: string;                  // "Phase III RCT Study"
  studyNumber: string;           // "RCT-2024-001"
  studyType: 'rct' | 'observational' | 'registry';
  createdAt: number;             // Unix timestamp
  lastModifiedAt: number;
}

// PROTOCOL (contains versions)
interface SavedProtocol {
  id: string;                    // "protocol-{timestamp}-{random}"
  studyNumber: string;           // From project
  name: string;                  // Protocol title
  studyType: string;
  createdAt: number;
  lastModified: number;
  versions: ProtocolVersion[];   // Array of versions (v1.0, v2.0, etc.)
}

// PROTOCOL VERSION (schema + metadata)
interface ProtocolVersion {
  id: string;                    // "version-{timestamp}-{random}"
  versionNumber: string;         // "1.0", "2.0", "2.1"
  status: 'draft' | 'published' | 'archived';
  createdAt: number;
  publishedAt?: number;
  
  // Metadata (protocol header info)
  metadata: {
    protocolNumber: string;      // "RCT-2024-001"
    protocolTitle: string;       // "Efficacy Study of Drug X"
    sponsor: string;
    principalInvestigator: string;
    phase: string;               // "Phase III"
    indication: string;
    objectives: string;
    // ... other protocol fields
  };
  
  // Schema (recursive structure of data fields)
  schemaBlocks: SchemaBlock[];   // The protocol's data structure
  
  // Version control
  baseVersionId?: string;        // Parent version (for amendments)
  changeLog?: string;            // What changed in this version
}

// SCHEMA BLOCK (recursive data field definition)
interface SchemaBlock {
  // Identity
  id: string;                    // "section-{timestamp}-{index}"
  
  // Full format (required for database generation)
  variable: {
    name: string;                // "primary_endpoint_change"
    label: string;               // "Primary Endpoint Change (%)"
    derivation?: string;         // Formula/calculation
  };
  dataType: string;              // "Numeric", "Text", "Date", "Section"
  role: string;                  // "Endpoint", "Demographic", "Structure"
  unit?: string;                 // "mg/dL", "years", "%"
  validationRules?: {
    min?: number;
    max?: number;
    required?: boolean;
    pattern?: string;
  };
  
  // Hierarchy
  level: number;                 // 0 = root, 1 = section, 2 = subsection, etc.
  parentId?: string;             // Parent block ID
  children?: SchemaBlock[];      // Nested child blocks
  
  // Metadata
  metadata: {
    description?: string;        // Field description
    clinicalContext?: string;    // Why this field matters
    regulatoryNote?: string;     // Regulatory requirements
  };
  
  // Version tracking (for schema freeze system)
  changeType?: 'normal' | 'modified' | 'new' | 'deprecated';
  baseVersionValue?: any;        // Original value (for tracking changes)
}

// CLINICAL DATA RECORD (collected data)
interface ClinicalDataRecord {
  id: string;                    // "record-{timestamp}-{random}"
  protocolNumber: string;        // Links to protocol
  protocolVersion: string;       // Links to specific version
  tableName: string;             // Which database table
  
  data: {
    [fieldName: string]: any;    // Field values
  };
  
  // Audit trail
  enteredBy: string;             // User who entered data
  enteredAt: number;             // When entered
  modifiedBy?: string;
  modifiedAt?: number;
  verifiedBy?: string;           // For data verification workflow
  verifiedAt?: number;
}

// USER PERSONA
interface Persona {
  name: string;
  role: 'Clinical Investigator' | 'Biostatistician' | 'Regulatory Reviewer';
  initials: string;
  email: string;
  institution: string;
  permissions: {
    canEditProtocols: boolean;
    canPublishProtocols: boolean;
    canViewData: boolean;
    canEditData: boolean;
    canExportData: boolean;
    canManageUsers: boolean;
  };
}
```

### 3.2 Data Relationships

```
PROJECT (1) ──────── (*) PROTOCOL
                          │
                          │ contains
                          ↓
                     (*) PROTOCOL VERSION
                          │
                          │ defines schema
                          ↓
                     (*) SCHEMA BLOCK (recursive)
                          │
                          │ generates
                          ↓
                     (*) DATABASE TABLE
                          │
                          │ stores
                          ↓
                     (*) CLINICAL DATA RECORD


PERSONA (1) ──────── (*) AUDIT LOG ENTRY
```

**Key Relationships:**

1. **Project → Protocol (1:N)**: One project can have multiple protocols
2. **Protocol → Version (1:N)**: One protocol has multiple versions over time
3. **Version → SchemaBlocks (1:N)**: One version defines many data fields
4. **SchemaBlock → Children (1:N)**: Recursive hierarchy (sections → subsections → fields)
5. **Version → DatabaseTables (1:N)**: Schema generates multiple tables
6. **DatabaseTable → DataRecords (1:N)**: Tables store many data records

---

## 4. Storage Architecture

### 4.1 localStorage Keys Structure

```typescript
// Multi-project system
'clinical-projects'                  → Project[]

// Project-scoped data (each project has isolated storage)
'clinical-protocols-{projectId}'     → SavedProtocol[]
'clinical-data-{projectId}'          → ClinicalDataRecord[]
'clinical-audit-{projectId}'         → AuditLogEntry[]

// Global user data
'clinical-user-persona'              → Persona
'clinical-current-project-id'        → string

// Legacy keys (deprecated, migrated automatically)
'clinical-protocols'                 → (old global storage)
```

### 4.2 Storage Service Architecture

**Centralized Storage Service** (`/utils/storageService.ts`):

```typescript
export const storage = {
  // Project operations
  projects: {
    getAll(): Project[]
    create(project: Project): void
    update(projectId: string, updates: Partial<Project>): void
    delete(projectId: string): void
  },
  
  // Protocol operations (project-scoped)
  protocols: {
    getAll(projectId: string): SavedProtocol[]
    save(protocol: SavedProtocol, projectId: string): void
    update(protocolId: string, projectId: string, updates: any): void
    delete(protocolId: string, projectId: string): void
  },
  
  // Clinical data operations (project-scoped)
  clinicalData: {
    getAll(projectId: string): ClinicalDataRecord[]
    save(record: ClinicalDataRecord, projectId: string): void
    getByProtocol(protocolNumber: string, version: string, projectId: string): ClinicalDataRecord[]
    update(recordId: string, projectId: string, updates: any): void
    delete(recordId: string, projectId: string): void
  },
  
  // User persona (global)
  persona: {
    get(): Persona | null
    save(persona: Persona): void
    clear(): void
  }
};
```

**Key Design Principles:**

1. **Project Isolation**: Each project's data is stored separately
2. **Single Source of Truth**: All components use `storageService.ts`
3. **Type Safety**: TypeScript interfaces for all data structures
4. **Automatic Migration**: Legacy data automatically converted to new format
5. **Defensive Programming**: All operations handle missing data gracefully

### 4.3 Data Flow Example

```
User creates project "My RCT Study"
  ↓
ProjectCreationModal.tsx
  ↓
storage.projects.create(project)
  ↓
localStorage['clinical-projects'] = [project]
  ↓
Auto-generate protocol from study DNA
  ↓
storage.protocols.save(protocol, projectId)
  ↓
localStorage['clinical-protocols-abc123'] = [protocol]
  ↓
useVersionControl.ts loads protocols
  ↓
storage.protocols.getAll(projectId)
  ↓
Protocol Builder displays schema
  ↓
User publishes protocol
  ↓
Version status: 'draft' → 'published'
  ↓
Database tab loads published version
  ↓
useDatabase.ts filters for status === 'published'
  ↓
generateDatabaseTables(schemaBlocks)
  ↓
Data Entry forms rendered
  ↓
User enters clinical data
  ↓
storage.clinicalData.save(record, projectId)
  ↓
localStorage['clinical-data-abc123'] = [record]
  ↓
Data Browser displays records
```

---

## 5. Core Modules

### 5.1 Dashboard Module

**File:** `/components/Dashboard.tsx`

**Purpose:** Progress Card Dashboard - Guided 5-step workflow for new users

**Features:**
- 5 progress cards representing the main workflow
- Visual status indicators (Not Started, In Progress, Complete)
- Direct navigation to each module
- Contextual help text

**Workflow Steps:**
1. **Set Your Profile** → PersonaEditor
2. **Create Protocol** → Protocol Builder
3. **Review Library** → Protocol Library
4. **Build Database** → Database (Schema View)
5. **Analyze Results** → Analytics

**State Management:**
```typescript
// Progress calculated from:
- Persona exists? → Step 1 complete
- Protocols exist? → Step 2 complete
- Database tables generated? → Step 4 complete
- Clinical data collected? → Step 5 complete
```

---

### 5.2 Persona Editor Module

**File:** `/components/PersonaEditor.tsx`

**Purpose:** User profile and role-based permission management

**Features:**
- User profile creation (name, role, email, institution)
- Role selection with 3 tiers:
  - **Clinical Investigator**: Full protocol editing + data entry
  - **Biostatistician**: Data analysis + export (read-only protocols)
  - **Regulatory Reviewer**: View-only access + audit logs
- Permission matrix visualization
- Avatar with initials

**Data Model:**
```typescript
interface Persona {
  name: string;
  role: 'Clinical Investigator' | 'Biostatistician' | 'Regulatory Reviewer';
  initials: string;
  email: string;
  institution: string;
  permissions: {
    canEditProtocols: boolean;
    canPublishProtocols: boolean;
    canViewData: boolean;
    canEditData: boolean;
    canExportData: boolean;
    canManageUsers: boolean;
  };
}
```

**Storage:** `localStorage['clinical-user-persona']`

---

### 5.3 Multi-Project System

**File:** `/components/ProjectCreationModal.tsx`, `/contexts/ProjectContext.tsx`

**Purpose:** Manage multiple clinical trial projects with data isolation

**Features:**
- Create new projects with Study DNA template selection
- Project switcher dropdown in header
- Auto-generate initial protocol when creating project
- Project-scoped data storage (protocols, clinical data separate per project)

**Study DNA Templates:**
```typescript
const studyDNATemplates = {
  rct: {
    name: "Randomized Controlled Trial (RCT)",
    sections: [
      "Study Design & Randomization",
      "Participant Demographics",
      "Efficacy Endpoints",
      "Safety & Adverse Events",
      // ... auto-generates 18 schema blocks
    ]
  },
  observational: {
    name: "Observational Study",
    sections: [
      "Cohort Definition",
      "Exposure Variables",
      "Outcome Measures",
      // ...
    ]
  },
  registry: {
    name: "Patient Registry",
    sections: [
      "Registry Enrollment",
      "Baseline Characteristics",
      "Longitudinal Follow-up",
      // ...
    ]
  }
};
```

**Project Creation Flow:**
```
User clicks "New Project"
  ↓
Modal opens with form:
  - Project Name
  - Study Number
  - Study Type (RCT, Observational, Registry)
  ↓
User clicks "Create Project"
  ↓
1. Create Project object
2. Save to storage.projects.create()
3. Auto-generate protocol from Study DNA template
4. Save protocol to storage.protocols.save(protocol, projectId)
5. Set as current project
6. Navigate to Protocol Builder
  ↓
Protocol Builder auto-loads generated protocol
```

---

### 5.4 Protocol Builder Module (Recursive Schema Engine)

**Files:** `/components/protocol-workbench/*`

**Purpose:** Design and edit clinical trial protocols with recursive schema structure

**Key Components:**

#### 5.4.1 ProtocolWorkbenchCore.tsx
- Main protocol editing interface
- Schema block tree view with recursive rendering
- Add/edit/delete schema blocks
- Version control UI (save, publish, create new version)

#### 5.4.2 useVersionControl.ts
- Protocol CRUD operations
- Version management (draft → published → archived)
- Auto-load most recent protocol on navigation
- Schema freeze detection (track changes between versions)

#### 5.4.3 Schema Block Management

**Schema Block Types:**
- **Section**: Container for grouping fields (level 1, 2, 3...)
- **Data Field**: Actual data collection point (Numeric, Text, Date, Boolean)
- **Calculated Field**: Derived from other fields (formulas)

**Recursive Structure:**
```typescript
Section: "Efficacy Endpoints" (level 1)
  ├─ Section: "Primary Endpoints" (level 2)
  │   ├─ Field: "Primary Endpoint Change (%)" (Numeric)
  │   ├─ Field: "Response Rate (%)" (Numeric)
  │   └─ Field: "Statistical Significance (p-value)" (Numeric)
  ├─ Section: "Secondary Endpoints" (level 2)
  │   ├─ Field: "Time to Event (days)" (Numeric)
  │   └─ Field: "Quality of Life Score" (Numeric)
  └─ Section: "Exploratory Endpoints" (level 2)
      └─ Field: "Biomarker Level (ng/mL)" (Numeric)
```

**Schema Block Full Format:**
```typescript
{
  id: "field-123",
  variable: {
    name: "primary_endpoint_change",
    label: "Primary Endpoint Change (%)",
    derivation: null
  },
  dataType: "Numeric",
  role: "Endpoint",
  unit: "%",
  validationRules: {
    min: -100,
    max: 100,
    required: true
  },
  level: 2,
  parentId: "section-456",
  metadata: {
    description: "Percent change from baseline in primary efficacy measure",
    clinicalContext: "Primary efficacy outcome for regulatory approval",
    regulatoryNote: "FDA requires ITT analysis"
  }
}
```

#### 5.4.4 Version Control Features

**Draft Mode:**
- Edit schema freely
- Changes not visible to data collection
- Save incremental changes

**Publish to Production:**
- Locks schema (status: 'published')
- Creates audit trail entry
- Triggers database table generation
- Becomes available for data collection

**Create New Version:**
- Duplicates current version
- Increments version number (1.0 → 1.1 or 2.0)
- New version starts as draft
- Tracks changes from base version (changeType: 'modified', 'new', 'deprecated')

**Version Lifecycle:**
```
v1.0 Draft → Publish → v1.0 Published (locked)
                            ↓
                       Create New Version
                            ↓
                       v1.1 Draft → Publish → v1.1 Published
```

---

### 5.5 Protocol Library Module

**File:** `/components/protocol-library/*`

**Purpose:** View all protocols across all projects, search, filter, compare versions

**Features:**
- Master list of all protocols (across all projects)
- Version comparison view
- Status filtering (draft, published, archived)
- Search by protocol number or title
- Quick navigation to Protocol Builder for editing

**Data Loading:**
```typescript
// Load protocols from ALL projects
const allProtocols = projects.flatMap(project => 
  storage.protocols.getAll(project.id)
);
```

---

### 5.6 Database Module

**Files:** `/components/Database.tsx`, `/components/database/*`

**Purpose:** Auto-generate database tables from protocol schemas, collect clinical data

**Key Components:**

#### 5.6.1 Schema View
- Displays auto-generated database tables
- Shows table structure: field names, data types, validation rules
- Field status indicators (normal, modified, new, deprecated)

#### 5.6.2 Data Entry View
- Form-based data entry
- Auto-generated forms from schema blocks
- Field validation (min/max, required, data type)
- Save clinical data records

#### 5.6.3 Data Browser View
- Table-based view of collected data
- Filter by protocol/version
- Edit/delete records
- Export to CSV

#### 5.6.4 Query View
- Query builder interface
- Filter data by field values
- Export filtered results

#### 5.6.5 Analytics Tab
- Summary statistics
- Data visualizations (charts, graphs)
- Protocol compliance metrics

**Database Generation Process:**

```typescript
// Input: Schema blocks from published protocol version
const schemaBlocks: SchemaBlock[] = [...];

// Process: generateDatabaseTables()
function generateDatabaseTables(blocks: SchemaBlock[]): DatabaseTable[] {
  // 1. Flatten recursive structure
  const flatBlocks = flattenBlocks(blocks);
  
  // 2. Group by table (sections become tables)
  const tables = groupBlocksBySection(flatBlocks);
  
  // 3. Convert schema blocks to database fields
  return tables.map(table => ({
    name: table.section.variable.name,
    label: table.section.variable.label,
    fields: table.blocks.map(block => ({
      name: block.variable.name,
      label: block.variable.label,
      dataType: mapDataType(block.dataType),
      required: block.validationRules?.required || false,
      validation: block.validationRules
    }))
  }));
}

// Output: Database tables ready for data entry
const tables: DatabaseTable[] = [
  {
    name: "efficacy_endpoints",
    label: "Efficacy Endpoints",
    fields: [
      { name: "primary_endpoint_change", dataType: "number", ... },
      { name: "response_rate", dataType: "number", ... }
    ]
  },
  {
    name: "safety_adverse_events",
    label: "Safety & Adverse Events",
    fields: [
      { name: "adverse_event_type", dataType: "text", ... },
      { name: "severity_grade", dataType: "number", ... }
    ]
  }
];
```

**Data Entry Flow:**
```
User clicks "Data Entry" tab
  ↓
useDatabase.ts loads published protocol version
  ↓
generateDatabaseTables(schemaBlocks)
  ↓
DataEntryView renders forms for each table
  ↓
User fills out form fields
  ↓
User clicks "Save Record"
  ↓
Validate all fields
  ↓
Create ClinicalDataRecord object
  ↓
storage.clinicalData.save(record, projectId)
  ↓
localStorage['clinical-data-{projectId}'] updated
  ↓
Navigate to Data Browser
  ↓
Table displays new record
```

**Published Version Priority:**
```typescript
// Database ALWAYS defaults to most recent PUBLISHED version
const activeVersions = protocol.versions.filter(v => v.status !== 'archived');
const publishedVersions = activeVersions.filter(v => v.status === 'published');

let selectedVersion;
if (publishedVersions.length > 0) {
  // Use most recent published (last in array)
  selectedVersion = publishedVersions[publishedVersions.length - 1];
} else {
  // Fallback to most recent draft (only if no published exists)
  selectedVersion = activeVersions[activeVersions.length - 1];
}
```

---

### 5.7 Analytics Module

**File:** `/components/Analytics.tsx`

**Purpose:** Visualize and analyze collected clinical data

**Features:**
- Summary statistics dashboard
- Data visualizations (bar charts, line graphs, scatter plots)
- Enrollment tracking
- Protocol compliance metrics
- Adverse event monitoring

**Chart Library:** Recharts

**Example Visualizations:**
- Enrollment over time (line chart)
- Adverse events by type (bar chart)
- Primary endpoint distribution (histogram)
- Response rates by treatment arm (pie chart)

---

## 6. User Workflows

### 6.1 Complete User Journey (New User)

```
STEP 1: Initial Setup
  ↓
User opens application
  ↓
Dashboard shows 5 progress cards (all "Not Started")
  ↓
User clicks "Set Your Profile"
  ↓
PersonaEditor opens
  ↓
User fills out profile:
  - Name: "Dr. Jane Smith"
  - Role: "Clinical Investigator"
  - Email: "jane.smith@hospital.edu"
  - Institution: "Memorial Hospital"
  ↓
User clicks "Save Profile"
  ↓
Dashboard Step 1: "Complete" ✅


STEP 2: Create Project
  ↓
User clicks "New Project" in header
  ↓
ProjectCreationModal opens
  ↓
User fills out form:
  - Project Name: "Phase III Drug X Trial"
  - Study Number: "DRG-X-2024-001"
  - Study Type: "Randomized Controlled Trial (RCT)"
  ↓
User clicks "Create Project"
  ↓
System auto-generates protocol with 18 schema blocks from RCT template
  ↓
User redirected to Protocol Builder
  ↓
Protocol auto-loads with pre-populated schema
  ↓
Dashboard Step 2: "In Progress" 🔵


STEP 3: Customize Protocol
  ↓
Protocol Builder shows schema tree:
  - Study Design & Randomization
  - Participant Demographics
  - Efficacy Endpoints (Primary, Secondary, Exploratory)
  - Safety & Adverse Events
  - Laboratory Tests
  - Protocol Deviations
  ↓
User clicks "Add Field" under "Primary Endpoints"
  ↓
Field editor opens
  ↓
User configures field:
  - Variable Name: "hba1c_change"
  - Label: "HbA1c Change from Baseline (%)"
  - Data Type: "Numeric"
  - Role: "Endpoint"
  - Unit: "%"
  - Validation: Min -5, Max 5, Required
  ↓
User clicks "Save Field"
  ↓
Field appears in schema tree
  ↓
User repeats for all needed fields
  ↓
User clicks "Save Draft"
  ↓
Version saved (status: 'draft')
  ↓
User clicks "Publish to Production"
  ↓
Confirmation modal: "This will lock the schema. Continue?"
  ↓
User confirms
  ↓
Version status: 'draft' → 'published'
  ↓
Audit trail entry created
  ↓
Dashboard Step 2: "Complete" ✅


STEP 4: Database Setup
  ↓
User clicks "Database" in sidebar
  ↓
useDatabase.ts auto-loads published protocol version
  ↓
generateDatabaseTables() creates tables from schema
  ↓
Database shows protocol selector:
  - Protocol: "DRG-X-2024-001 - Phase III Drug X Trial"
  - Version: "v1.0 - published"
  ↓
User clicks "Schema View" tab
  ↓
Tables displayed:
  - study_design_randomization (5 fields)
  - participant_demographics (8 fields)
  - efficacy_primary_endpoints (6 fields)
  - efficacy_secondary_endpoints (4 fields)
  - safety_adverse_events (7 fields)
  - laboratory_tests (12 fields)
  ↓
Dashboard Step 4: "Complete" ✅


STEP 5: Data Collection
  ↓
User clicks "Data Entry" tab
  ↓
DataEntryView renders forms for all tables
  ↓
User selects table: "participant_demographics"
  ↓
Form appears with fields:
  - Patient ID
  - Age (years)
  - Gender
  - Race
  - Ethnicity
  - Weight (kg)
  - Height (cm)
  - BMI (calculated)
  ↓
User fills out form
  ↓
User clicks "Save Record"
  ↓
Validation runs (check required fields, min/max)
  ↓
Record saved to localStorage
  ↓
Success message: "Record saved successfully"
  ↓
User clicks "Data Browser" tab
  ↓
Table shows newly entered record
  ↓
User clicks "Add Record" button (header)
  ↓
Returns to Data Entry form
  ↓
User enters more records...
  ↓
Dashboard Step 5: "In Progress" 🔵


STEP 6: Data Analysis
  ↓
User clicks "Analytics" tab
  ↓
Dashboard shows:
  - Total participants: 15
  - Enrollment trend (line chart)
  - Demographics distribution (pie charts)
  - Adverse events by severity (bar chart)
  - Primary endpoint summary statistics
  ↓
User clicks "Export Data"
  ↓
CSV file downloads with all collected data
  ↓
Dashboard Step 5: "Complete" ✅
  ↓
ALL STEPS COMPLETE! 🎉
```

---

### 6.2 Protocol Amendment Workflow

```
Scenario: Need to add new safety field after trial has started

Current State:
  - Protocol v1.0 (published, locked)
  - 50 patient records collected against v1.0
  - Need to add "Cardiac Event Monitoring" field

Workflow:
  ↓
User opens Protocol Builder
  ↓
Current version: v1.0 (published) is displayed
  ↓
User clicks "Create New Version"
  ↓
Modal: "Create amendment to protocol v1.0?"
  ↓
User enters:
  - New Version Number: "1.1"
  - Change Description: "Added cardiac event monitoring per DSMB recommendation"
  ↓
User clicks "Create"
  ↓
System creates v1.1 (draft) as copy of v1.0
  ↓
Version dropdown now shows: "v1.1 (draft)" [selected]
  ↓
User expands "Safety & Adverse Events" section
  ↓
User clicks "Add Field"
  ↓
User configures:
  - Variable Name: "cardiac_event_detected"
  - Label: "Cardiac Event Detected"
  - Data Type: "Boolean (Yes/No)"
  - Role: "Safety"
  - Validation: Required
  ↓
Field marked as changeType: 'new' (visual indicator: green badge)
  ↓
User clicks "Save Draft"
  ↓
User clicks "Publish to Production"
  ↓
Confirmation: "This will create v1.1 (published). Old data remains linked to v1.0."
  ↓
User confirms
  ↓
v1.1 status: 'draft' → 'published'
  ↓
Audit trail: "Version 1.1 published by Dr. Jane Smith on 2024-01-03"
  ↓
User navigates to Database tab
  ↓
Database auto-selects v1.1 (published) [most recent published version]
  ↓
Schema View shows "Cardiac Event Detected" field with "New" badge
  ↓
Data Entry now includes new field
  ↓
Data Browser shows:
  - Old records (v1.0): No cardiac event field
  - New records (v1.1): Has cardiac event field
  ↓
Both version's data preserved and queryable ✅
```

---

### 6.3 Multi-Project Workflow

```
Scenario: User manages 3 clinical trials simultaneously

Setup:
  - Project A: "Drug X Phase III" (RCT, 100 participants)
  - Project B: "Vaccine Y Phase II" (RCT, 50 participants)
  - Project C: "Device Z Registry" (Registry, 500 participants)

Workflow:
  ↓
User opens application
  ↓
Header shows: Project dropdown with "Drug X Phase III" [selected]
  ↓
Dashboard shows progress for Project A
  ↓
Protocol Builder shows protocols for Project A
  ↓
Database shows data for Project A only
  ↓
User clicks project dropdown
  ↓
Dropdown shows:
  - Drug X Phase III ✓ [currently selected]
  - Vaccine Y Phase II
  - Device Z Registry
  - + New Project
  ↓
User selects "Vaccine Y Phase II"
  ↓
System loads Project B data:
  - protocols from 'clinical-protocols-projectB-id'
  - clinical data from 'clinical-data-projectB-id'
  ↓
Dashboard updates to show Project B progress
  ↓
Protocol Builder now shows protocols for Project B
  ↓
Database shows data for Project B only
  ↓
Complete data isolation between projects ✅
  ↓
User can switch between projects without data mixing
```

---

## 7. Component Hierarchy

### 7.1 Application Structure

```
<App>
  ├─ <ProjectContext.Provider>
  │   └─ <PersonaContext.Provider>
  │       ├─ [Header]
  │       │   ├─ Logo
  │       │   ├─ Project Switcher Dropdown
  │       │   ├─ New Project Button
  │       │   └─ User Avatar
  │       │
  │       ├─ [Sidebar Navigation]
  │       │   ├─ Dashboard
  │       │   ├─ Persona Editor
  │       │   ├─ Protocol Builder
  │       │   ├─ Protocol Library
  │       │   ├─ Database
  │       │   └─ Analytics
  │       │
  │       └─ [Main Content Area]
  │           └─ {currentView === 'dashboard' && <Dashboard />}
  │           └─ {currentView === 'persona' && <PersonaEditor />}
  │           └─ {currentView === 'protocol-builder' && <ProtocolWorkbenchCore />}
  │           └─ {currentView === 'protocol-library' && <ProtocolLibrary />}
  │           └─ {currentView === 'database' && <Database />}
  │           └─ {currentView === 'analytics' && <Analytics />}
  └─ <ProjectCreationModal isOpen={...} />
```

### 7.2 Protocol Builder Component Tree

```
<ProtocolWorkbenchCore>
  ├─ useVersionControl() [hook]
  │   ├─ Load protocols from storage.protocols.getAll(projectId)
  │   ├─ Auto-load most recent protocol
  │   └─ Version CRUD operations
  │
  ├─ [Header]
  │   ├─ Protocol Title Input
  │   ├─ Version Dropdown
  │   ├─ Status Badge (Draft/Published)
  │   └─ Actions (Save, Publish, New Version)
  │
  ├─ [Schema Editor]
  │   ├─ <SchemaBlockTree blocks={schemaBlocks}>
  │   │   └─ <SchemaBlockItem> [recursive]
  │   │       ├─ Section Display
  │   │       ├─ Field Display
  │   │       ├─ Add Child Button
  │   │       ├─ Edit Button
  │   │       └─ Delete Button
  │   │
  │   └─ <SchemaBlockEditor
  │        block={selectedBlock}
  │        onSave={updateBlock}
  │      >
  │       ├─ Variable Configuration
  │       ├─ Data Type Selector
  │       ├─ Validation Rules
  │       └─ Metadata Fields
  │
  └─ [Version Control Panel]
      ├─ Version History List
      ├─ Change Log Display
      └─ Publish Confirmation Modal
```

### 7.3 Database Component Tree

```
<Database>
  ├─ useDatabase() [hook]
  │   ├─ Load protocols from storage.protocols.getAll(projectId)
  │   ├─ Filter for published versions
  │   └─ Generate database tables from schema
  │
  ├─ [Header]
  │   ├─ Protocol Selector
  │   ├─ Version Selector (defaults to published)
  │   ├─ Status Badge
  │   └─ Add Record Button
  │
  ├─ [Tabs]
  │   ├─ Data Browser
  │   ├─ Data Entry
  │   ├─ Query & Export
  │   ├─ Schema View
  │   └─ Analytics
  │
  └─ [Tab Content]
      ├─ {tab === 'browser' && <DataBrowserView />}
      │   ├─ Table Selector
      │   ├─ Data Table Display
      │   ├─ Pagination
      │   └─ Edit/Delete Actions
      │
      ├─ {tab === 'data-entry' && <DataEntryView />}
      │   ├─ Table Selector
      │   ├─ <FormRenderer fields={tableFields}>
      │   │   ├─ Text Input
      │   │   ├─ Number Input
      │   │   ├─ Date Picker
      │   │   ├─ Boolean Checkbox
      │   │   └─ Validation Messages
      │   └─ Save Button
      │
      ├─ {tab === 'query' && <QueryView />}
      │   ├─ Query Builder Interface
      │   ├─ Filter Configuration
      │   └─ Export Button
      │
      ├─ {tab === 'schema' && <SchemaView />}
      │   ├─ Table List
      │   └─ Field List per Table
      │
      └─ {tab === 'analytics' && <Analytics />}
          ├─ Summary Stats Cards
          └─ Charts (Recharts)
```

---

## 8. Implementation Status

### 8.1 Completed Features ✅

**Core Infrastructure:**
- [x] React + TypeScript application setup
- [x] Tailwind CSS v4.0 styling system
- [x] localStorage-based storage architecture
- [x] Centralized storage service (`storageService.ts`)
- [x] Multi-project support with data isolation
- [x] Project creation and switching
- [x] Legacy data migration system

**Research Factory (Phases 0-5 Complete):**
- [x] Unified Workspace Shell (Golden Grid layout)
- [x] Global Header with action consolidation
- [x] Navigation Panel (8 tabs)
- [x] Live Budget Tracker (word counting)
- [x] Logic Audit Sidebar (mismatch detection)
- [x] Journal Constraints (10 journal profiles)
- [x] Data Lineage Tracer
- [x] Export Package Generator (4 files: manuscript, verification appendix, CSV, JSON)
- [x] Scientific Receipt with PI certification
- [x] Research Factory now default UI

**Governance System (Phases 0-4 Complete):**
- [x] Feature flag system
- [x] Role-based access control (RBAC)
- [x] Permission matrix (PI, Junior, Statistician, Data Entry, Institutional Admin)
- [x] Role badge in Global Header
- [x] Governance Dashboard
- [x] Tab visibility based on permissions
- [x] Action permission checks
- [x] AI policy enforcement
- [x] Autonomy slider filtering by role
- [x] **NEW: Statistical Manifest Locking (PI-only)**

**User Management:**
- [x] **NEW: PersonaEditor with full localStorage persistence**
- [x] **NEW: Persona selector UI with load/save**
- [x] **NEW: Unique persona name validation**
- [x] **NEW: AI-powered name suggestions**
- [x] Persona Editor with role-based permissions
- [x] 3-tier permission system (Investigator, Statistician, Reviewer)
- [x] User avatar with initials
- [x] Permission matrix visualization

**Statistical Manifests (NEW - Phase 4):**
- [x] Locking system for PI approval
- [x] Lock/unlock UI with confirmation
- [x] Lock status banner and badge
- [x] Lock reason capture (optional)
- [x] Lock timestamp and author tracking
- [x] Permission-based visibility (PI-only controls)
- [x] Backward compatible with existing manifests
- [x] Integrated with useGovernance hook

**Protocol Builder:**
- [x] Recursive schema editor
- [x] Add/edit/delete schema blocks
- [x] Nested hierarchy support (sections → fields)
- [x] Version control (draft/published/archived)
- [x] Publish to production workflow
- [x] Create new version (amendments)
- [x] Schema freeze system with change tracking
- [x] Auto-load most recent protocol on navigation
- [x] Study DNA template system (RCT, Observational, Registry)
- [x] Full schema block format with metadata

**Protocol Library:**
- [x] Master list of all protocols
- [x] Version comparison
- [x] Status filtering
- [x] Search functionality

**Database:**
- [x] Auto-generate database tables from schema
- [x] Schema View (table structure display)
- [x] Data Entry (form-based data collection)
- [x] Data Browser (table-based data display)
- [x] Query View (query builder)
- [x] Analytics tab integration
- [x] Published version priority (defaults to published)
- [x] Real-time protocol updates (2-second polling)

**Analytics:**
- [x] Summary statistics dashboard
- [x] Recharts integration
- [x] Basic visualizations

**Dashboard:**
- [x] Progress Card Dashboard (5-step workflow)
- [x] Visual progress indicators
- [x] Contextual help text
- [x] Direct navigation to modules

**Critical Bug Fixes:**
- [x] Storage unification (eliminated dual storage system)
- [x] Schema block type adapter (simplified → full format)
- [x] Protocol Builder auto-load on navigation
- [x] Database integration with project-scoped storage
- [x] Published version priority in Database selector

### 8.2 Known Issues & Limitations ⚠️

**Storage:**
- localStorage size limit (~5-10MB per domain)
- No backend database (data not synced across devices)
- ~~No real-time collaboration (single-user system)~~ **NOTE:** Governance system ready for Team Mode (Phase 5)

**Data Validation:**
- Basic validation (required, min/max, data type)
- No complex cross-field validation
- No referential integrity between tables

**Export:**
- ✅ **FIXED:** Full export system with 4-file packages (Scientific Receipt, Verification Appendix, CSV, JSON)
- ~~CSV export functionality partially implemented~~
- No PDF report generation (manual copy-paste to Word/Google Docs)

**Analytics:**
- Basic charts only
- No advanced statistical analysis
- No machine learning features

**User Management:**
- ✅ **FIXED:** PersonaEditor now has full persistence
- ~~Single user system~~ **NOTE:** RBAC ready, Team Mode available in Phase 5
- No authentication/authorization (mock roles only)
- Audit trail for governance actions only (not all user actions)

### 8.3 Not Yet Implemented 🚧

**High Priority:**
- [ ] Audit trail for ALL user actions (currently partial)
- [ ] Data verification workflow (entered → verified → locked)
- [ ] Advanced query builder with complex filters
- [ ] Comprehensive data export (PDF reports, SAS datasets)
- [ ] Data import from CSV/Excel
- [ ] Protocol comparison tool (diff view)

**Medium Priority:**
- [ ] Advanced analytics (statistical tests, survival curves)
- [ ] Custom calculated fields in database
- [ ] Data quality checks and validation rules library
- [ ] Protocol templates library (beyond 3 Study DNAs)
- [ ] Field-level comments and notes
- [ ] Version rollback functionality

**Low Priority:**
- [ ] Backend API integration (Supabase, Firebase)
- [ ] Multi-user collaboration
- [ ] Real-time updates
- [ ] E-signature for protocol approval
- [ ] Integration with EDC systems
- [ ] Mobile responsive design

---

## 9. Development Guidelines

### 9.1 Code Style & Conventions

**TypeScript:**
```typescript
// ✅ DO: Use explicit types
interface Protocol {
  id: string;
  name: string;
  versions: ProtocolVersion[];
}

// ❌ DON'T: Use 'any' type
const protocol: any = {...};

// ✅ DO: Use type guards
function isPublished(version: ProtocolVersion): boolean {
  return version.status === 'published';
}

// ❌ DON'T: Use implicit any
function isPublished(version) {
  return version.status === 'published';
}
```

**React:**
```typescript
// ✅ DO: Use functional components with hooks
export function MyComponent() {
  const [state, setState] = useState<string>('');
  
  useEffect(() => {
    // ...
  }, [dependencies]);
  
  return <div>{state}</div>;
}

// ❌ DON'T: Use class components
class MyComponent extends React.Component {
  // ...
}
```

**Naming Conventions:**
```typescript
// Files: PascalCase for components, camelCase for utils
// ✅ DO:
/components/ProtocolWorkbenchCore.tsx
/utils/storageService.ts
/hooks/useVersionControl.ts

// Variables: camelCase
const protocolNumber = "RCT-001";
const schemaBlocks = [...];

// Constants: SCREAMING_SNAKE_CASE
const STORAGE_KEYS = {
  PROTOCOLS: 'clinical-protocols',
  CLINICAL_DATA: 'clinical-data'
};

// Types/Interfaces: PascalCase
interface SavedProtocol { ... }
type TabType = 'schema' | 'data-entry';
```

**Tailwind CSS:**
```tsx
// ✅ DO: Use Tailwind utility classes
<div className="px-8 py-6 bg-white border border-slate-200 rounded-lg">

// ❌ DON'T: Override typography unless explicitly requested
// DO NOT USE: text-2xl, font-bold, leading-tight
// These are pre-configured in /styles/globals.css

// ✅ DO: Use 8px spacing system
// gap-1 = 4px, gap-2 = 8px, gap-3 = 12px, gap-4 = 16px
<div className="gap-2 p-4">
```

### 9.2 Storage Guidelines

```typescript
// ✅ DO: Always use centralized storage service
import { storage } from '../utils/storageService';

const protocols = storage.protocols.getAll(projectId);
storage.protocols.save(protocol, projectId);

// ❌ DON'T: Use localStorage directly
const protocols = JSON.parse(localStorage.getItem('clinical-protocols'));

// ✅ DO: Handle missing data gracefully
const protocols = storage.protocols.getAll(projectId);
if (protocols.length === 0) {
  // Show empty state UI
  return <EmptyState />;
}

// ❌ DON'T: Assume data always exists
const protocol = protocols[0]; // Could be undefined!
const firstVersion = protocol.versions[0]; // Could crash!
```

### 9.3 Component Guidelines

```typescript
// ✅ DO: Use clear prop types
interface MyComponentProps {
  protocols: SavedProtocol[];
  onProtocolSelect: (id: string) => void;
  isLoading?: boolean;
}

export function MyComponent({ 
  protocols, 
  onProtocolSelect, 
  isLoading = false 
}: MyComponentProps) {
  // ...
}

// ✅ DO: Add logging for debugging
console.log('📂 [MyComponent] Loading protocols...');
console.log('✅ [MyComponent] Loaded', protocols.length, 'protocols');
console.log('❌ [MyComponent] Error:', error);

// Use consistent emoji prefixes:
// 📂 = Loading/reading
// 💾 = Saving/writing
// 🔄 = Processing/converting
// ✅ = Success
// ❌ = Error
// ⚠️  = Warning
// 🎯 = Important decision point
// 🛡️ = Validation/protection
```

### 9.4 Testing Approach

**Manual Testing Checklist:**

```
□ Create new project
□ Auto-generated protocol appears in Protocol Builder
□ Edit protocol schema (add/edit/delete fields)
□ Save draft version
□ Publish to production
□ Switch to Database tab
□ Verify protocol auto-selected (published version)
□ Check database tables generated correctly
□ Enter data in Data Entry form
□ Validate required fields
□ Save data record
□ Switch to Data Browser
□ Verify record appears in table
□ Edit record
□ Delete record
□ Switch projects
□ Verify data isolation (project A data not visible in project B)
□ Create new protocol version (amendment)
□ Verify old data still linked to old version
□ Verify new data uses new version
```

**Console Log Verification:**

```
Expected log sequence for successful workflow:

1. Project creation:
   🔄 Converting simplified schema blocks...
   ✅ Converted 18 simplified blocks → 18 full blocks

2. Protocol Builder load:
   📂 [useVersionControl] Loading protocols...
   ✅ Auto-loading protocol: {...}

3. Database load:
   📂 [useDatabase] Loading protocols for project: ...
   ✅ [useDatabase] Loaded 1 protocols
   ✅ Auto-selected PUBLISHED version: ...

4. Data save:
   💾 Saving clinical data record...
   ✅ Record saved successfully
```

---

## 10. Known Issues & Future Work

### 10.1 Current Bugs 🐛

**None currently identified** (as of Jan 3, 2026)

All critical data flow issues have been resolved:
- ✅ Storage unification complete
- ✅ Protocol Builder auto-load working
- ✅ Database integration working
- ✅ Published version priority implemented

### 10.2 Technical Debt 🏗️

1. **localStorage Size Limits**
   - **Issue:** localStorage ~5-10MB limit may be exceeded with large datasets
   - **Impact:** Medium - affects users with many protocols or large data collections
   - **Solution:** Implement backend database (Supabase, Firebase)

2. **No Real-Time Collaboration**
   - **Issue:** Single-user system, no multi-user editing
   - **Impact:** Low - current use case is single investigator
   - **Solution:** Add WebSocket-based real-time updates

3. **Limited Export Formats**
   - **Issue:** Only CSV export implemented
   - **Impact:** Medium - regulatory submissions require SAS datasets, PDFs
   - **Solution:** Add export library for multiple formats

4. **No Data Import**
   - **Issue:** Can't import existing data from other systems
   - **Impact:** Low - current focus is new data collection
   - **Solution:** Add CSV/Excel import with field mapping

5. **Basic Validation Only**
   - **Issue:** No complex cross-field validation
   - **Impact:** Low - most validation is field-level
   - **Solution:** Add validation rules engine

### 10.3 Future Features 🚀

**Phase 2: Enhanced Data Management**
- [ ] Advanced query builder with SQL-like interface
- [ ] Data verification workflow (entered → verified → locked)
- [ ] Comprehensive audit trail for all actions
- [ ] Field-level comments and annotations
- [ ] Data quality metrics dashboard

**Phase 3: Advanced Analytics**
- [ ] Statistical analysis tools (t-tests, ANOVA, regression)
- [ ] Survival analysis (Kaplan-Meier curves)
- [ ] Subgroup analysis tools
- [ ] Custom calculated fields
- [ ] Predictive modeling

**Phase 4: Regulatory Compliance**
- [ ] Electronic signatures (21 CFR Part 11)
- [ ] Automated data quality checks
- [ ] Protocol deviation tracking
- [ ] Regulatory submission packages (eCTD)
- [ ] CDISC SDTM/ADaM export

**Phase 5: Collaboration**
- [ ] Multi-user support
- [ ] Role-based access control (RBAC)
- [ ] Real-time collaborative editing
- [ ] Comment threads on protocols
- [ ] Approval workflows

**Phase 6: Integration**
- [ ] EDC system integration (Medidata, Oracle)
- [ ] CTMS integration
- [ ] EHR integration (HL7 FHIR)
- [ ] Laboratory data import
- [ ] Imaging data integration

---

## 11. Quick Reference

### 11.1 Key Files to Know

```
# Main entry point
/App.tsx

# Storage (ALWAYS use this, never localStorage directly)
/utils/storageService.ts

# Protocol operations
/components/protocol-workbench/hooks/useVersionControl.ts

# Database operations
/components/database/hooks/useDatabase.ts

# Schema generation
/components/database/utils/schemaGenerator.ts

# Type definitions
/components/protocol-workbench/types.ts

# Project context
/contexts/ProjectContext.tsx

# Study DNA templates
/utils/studyDNA.ts
```

### 11.2 Common Tasks

**Add a new field to protocol:**
```typescript
// 1. User clicks "Add Field" button in Protocol Builder
// 2. SchemaBlockEditor modal opens
// 3. User configures field
// 4. On save, creates SchemaBlock object:

const newBlock: SchemaBlock = {
  id: `field-${Date.now()}-${Math.random()}`,
  variable: {
    name: fieldName,
    label: fieldLabel,
    derivation: null
  },
  dataType: selectedDataType,
  role: selectedRole,
  unit: unit,
  validationRules: {
    min: minValue,
    max: maxValue,
    required: isRequired
  },
  level: parentBlock.level + 1,
  parentId: parentBlock.id,
  metadata: {
    description: description,
    clinicalContext: context
  }
};

// 5. Add to parent's children array
// 6. Save protocol version
```

**Query clinical data:**
```typescript
// Load all data for a protocol
const allData = storage.clinicalData.getAll(projectId);

// Filter by protocol and version
const protocolData = storage.clinicalData.getByProtocol(
  'RCT-001', 
  '1.0', 
  projectId
);

// Filter by table
const efficacyData = protocolData.filter(
  record => record.tableName === 'efficacy_endpoints'
);

// Extract specific fields
const primaryEndpoints = efficacyData.map(
  record => record.data.primary_endpoint_change
);
```

**Switch projects:**
```typescript
// From ProjectContext
const { currentProject, setCurrentProject, projects } = useProject();

// User selects different project
setCurrentProject(newProject);

// This triggers:
// 1. All components re-render with new projectId
// 2. useVersionControl reloads protocols for new project
// 3. useDatabase reloads data for new project
// 4. Complete data isolation maintained
```

### 11.3 Debugging Tips

**Check console logs:**
```bash
# Look for these patterns in browser console:

# Good (working):
✅ [useDatabase] Loaded 1 protocols
✅ Auto-selected PUBLISHED version: ...
✅ Schema blocks are already in full format

# Bad (issues):
❌ [useDatabase] Error loading protocols: ...
⚠️  [useDatabase] No protocols found
🚧 Schema blocks need conversion
```

**Inspect localStorage:**
```javascript
// Open browser DevTools > Application > Local Storage

// Check project list
localStorage.getItem('clinical-projects')

// Check protocols for specific project
localStorage.getItem('clinical-protocols-{projectId}')

// Check clinical data
localStorage.getItem('clinical-data-{projectId}')

// Check current project
localStorage.getItem('clinical-current-project-id')
```

**Common issues:**

1. **"No Protocols Found" in Database**
   - Check: Is protocol published? (status === 'published')
   - Check: Is correct project selected?
   - Check: Console logs show protocol loaded?

2. **Empty Data Entry forms**
   - Check: Is published version selected?
   - Check: Schema blocks in full format? (console logs)
   - Check: Database tables generated? (Schema View tab)

3. **Data not saving**
   - Check: All required fields filled?
   - Check: Validation rules passed?
   - Check: Console shows "Record saved successfully"?

---

## 12. Glossary

**Clinical Terms:**
- **GCP**: Good Clinical Practice - International quality standard for clinical trials
- **IRB**: Institutional Review Board - Ethics committee that approves research
- **ICH**: International Council for Harmonisation - Develops global standards
- **21 CFR Part 11**: FDA regulation for electronic records and signatures
- **CDISC**: Clinical Data Interchange Standards Consortium
- **SDTM**: Study Data Tabulation Model (CDISC standard)
- **ADaM**: Analysis Data Model (CDISC standard)
- **eCTD**: Electronic Common Technical Document (regulatory submission format)
- **ITT**: Intention-to-Treat analysis
- **DSMB**: Data Safety Monitoring Board

**Application Terms:**
- **Schema Block**: A single field or section in a protocol schema
- **Protocol Version**: A specific snapshot of a protocol at a point in time
- **Study DNA**: Template of schema blocks for a specific study type
- **Schema Freeze**: Locking a protocol version to prevent changes
- **Database Table**: Auto-generated data structure from schema blocks
- **Clinical Data Record**: A single saved data entry
- **Audit Trail**: Log of all changes to protocols and data
- **Project**: Container for protocols and data for a single clinical trial

---

## 13. Contact & Support

**For development questions:**
- Review `/docs/` folder for detailed implementation docs
- Check console logs for debugging information
- Inspect localStorage for data verification

**Architecture decisions:**
- Storage: Project-scoped localStorage (no backend)
- Version control: Built-in (no Git integration)
- Multi-user: Not supported (single user only)
- Data persistence: localStorage only (no cloud sync)

---

## 14. Version History

**v1.0** (January 3, 2026) - Complete data flow implementation
- ✅ Storage unification complete
- ✅ Protocol Builder auto-load
- ✅ Database integration with published version priority
- ✅ Multi-project support with data isolation
- ✅ Schema freeze system
- ✅ Progress Card Dashboard
- ✅ All critical bugs resolved

**Previous milestones:**
- Multi-project support (Phase 1)
- Schema freeze and version locking
- Database auto-generation (Phases 3-4)
- Code corruption prevention architecture
- Progress Card Dashboard
- PersonaEditor with role-based permissions
- Recursive Schema Engine (Protocol Builder)

---

## 15. Final Notes for Claude Code

**What's Working:**
- ✅ Complete end-to-end data flow (project → protocol → database → data collection)
- ✅ Multi-project support with full data isolation
- ✅ Version control with draft/published/archived states
- ✅ Auto-generation of database tables from schemas
- ✅ Data entry, browsing, and basic analytics
- ✅ Published version priority for data collection

**What to Focus On:**
1. **Storage**: Always use `storageService.ts`, never localStorage directly
2. **Project Context**: All data operations must include `projectId`
3. **Type Safety**: Use TypeScript interfaces, avoid `any` type
4. **Logging**: Add console logs with emoji prefixes for debugging
5. **Defensive Programming**: Always check for null/undefined data

**Architecture Principles:**
1. **Single Source of Truth**: `storageService.ts` for all data operations
2. **Project Isolation**: Each project's data stored separately
3. **Immutable Published Versions**: Once published, schemas are locked
4. **Type Conversion**: Schema blocks must be in full format for database generation
5. **Automatic Selection**: Always default to most recent published version

**Testing Strategy:**
- Test complete user journey (project creation → data collection)
- Verify console logs match expected patterns
- Check localStorage directly to verify data structure
- Test project switching and data isolation
- Verify version control (draft → published → amendment)

**Key Success Metrics:**
- No console errors
- All workflows complete without manual intervention
- Data persists across page refreshes
- Project switching works without data mixing
- Published versions automatically selected in Database

---

**END OF SPECIFICATION**

This document should provide complete context for seamless development. Reference specific sections as needed, and cross-reference with `/docs/` folder for implementation details.

Last updated: January 3, 2026
Status: Production-ready
Version: 1.0