# Project Setup - Status & Integration Analysis

## ✅ Current Status: ACTIVE & FULLY CONNECTED

The Project Setup module is **fully active, functional, and now properly connected** to Project Creation data.

## 🔧 RECENT FIX (Jan 7, 2026)

**Issue Resolved:** Project Setup now correctly initializes from Project Creation data.

**Problem:** When users created a project with a specific study design (e.g., "Technical Note"), opening Project Setup defaulted to RCT instead of preserving the selected design.

**Root Cause:** 
- Two disconnected data structures: `project.studyDesign` (Project Creation) vs `project.studyMethodology` (Project Setup)
- Mismatched enum values between the two systems

**Solution Implemented:**
1. ✅ Created `/utils/studyTypeMapping.ts` - Bidirectional mapping utility
2. ✅ Created `/components/project/StudyMethodologySelector.tsx` - Dedicated selector for Project Setup
3. ✅ Updated `ProjectSetup.tsx` to use `getInitialStudyType()` helper
4. ✅ Fixed methodology generation to use correct enum values

**Mapping:**
- `'case-series'` → `'retrospective-case-series'`
- `'cohort'` → `'prospective-cohort'`
- `'laboratory'` → `'laboratory-investigation'`
- `'technical-note'` → `'technical-note'` (unchanged)
- `'rct'` → `'rct'` (unchanged)

## Access Points

### 1. **Navigation Panel**
- **Path:** Unified Workspace → Navigation Panel → "Project Setup" tab
- **Icon:** Users icon
- **Description:** "Team & methodology"
- **Location:** `/components/unified-workspace/NavigationPanel.tsx` (lines 107-111)

### 2. **Main Router**
- **Component:** `ResearchFactoryApp.tsx` (lines 550-563)
- **Route:** `case 'project-setup'`
- **Renders:** `<ProjectSetup />` component
- **Callbacks:**
  - `onComplete()` → Navigates to Protocol Workbench
  - `onCancel()` → Returns to Dashboard

## Core Components

### Primary Component: `/components/ProjectSetup.tsx`
**Purpose:** Professional dual-panel workspace for configuring study design, team, blinding, and methodology

**Features:**
- 4-step wizard: `design → team → blinding → review`
- Live methodology generation
- Study type selection (RCT, cohort, case series, lab, technical note)
- Team configuration
- Blinding protocol setup
- Right sidebar with preview/methodology/guide views
- Auto-generated methodology text based on configuration

### Supporting Component: `/components/ProjectCreationModal.tsx`
**Purpose:** Quick project creation with Study DNA configuration

**Features:**
- Modal-based project creation
- Study design type selection (5 types)
- Automatic persona creation based on Study DNA
- Automatic protocol template generation
- Configuration wizards per study type:
  - RCT: arms, randomization, blinding
  - Case Series: sample size, follow-up
  - Cohort: exposure, outcome
  - Laboratory: specimens, assays
  - Technical Note: methodology type

**Used In:**
- `TopBar.tsx` - Global header
- `ProjectLibraryScreen.tsx` - Project library

## Data Structure Integration

### Project Type Definition (`/types/shared.ts`)
Projects store configuration in two parallel structures:

#### 1. **studyDesign** (Study DNA - Phase 1)
```typescript
studyDesign?: {
  type: 'rct' | 'case-series' | 'cohort' | 'laboratory' | 'technical-note',
  rct?: RCTConfiguration,
  caseSeries?: CaseSeriesConfiguration,
  // ... specific configs
}
```

#### 2. **studyMethodology** (Methodology Engine - Phase 3)
```typescript
studyMethodology?: {
  studyType: 'rct' | 'prospective-cohort' | 'retrospective-case-series' | 'laboratory-investigation' | 'technical-note',
  configuredAt: string,
  configuredBy: string,
  
  teamConfiguration?: {
    assignedPersonas: Array<{ role, permissions, blinded, aiAutonomyCap }>,
    locked: boolean,
    piSignature?: string
  },
  
  blindingState?: {
    protocol: 'none' | 'single-blind' | 'double-blind' | 'triple-blind',
    isUnblinded: boolean,
    unblindedAt?: string,
    auditTrail: Array<{ timestamp, action, performedBy, details }>
  },
  
  hypothesis?: {
    picoFramework: { population, intervention, comparison, outcome },
    researchQuestion: string,
    variables: Array<{ name, type, grounded, boundTo }>
  }
}
```

## Context Integration

### ProjectContext (`/contexts/ProjectContext.tsx`)
**Methods:**
- `createProject()` - Creates new project with study design
- `updateProject()` - Updates project properties
- `configureStudyMethodology()` - Sets methodology configuration
- `updateBlindingState()` - Updates blinding settings
- `performUnblinding()` - Executes unblinding with audit trail

**Storage:**
- Uses `STORAGE_KEYS.PROJECTS` in localStorage
- Automatic persistence on all updates
- Maintains audit trails for critical actions

## Auto-Generation Features

### 1. **Persona Auto-Creation** (Phase 3)
When a project is created, the system automatically:
- Generates a statistician persona based on Study DNA
- Configures persona with study-specific analysis capabilities
- Stores in project-scoped persona storage

**Implementation:** `createPersonaFromStudyDNA()` in `/utils/studyDNAAutoGeneration.ts`

### 2. **Protocol Auto-Generation** (Phase 3)
Automatically creates:
- Protocol template with study-specific sections
- Pre-filled metadata (study number, title, phase)
- Study design-appropriate schema blocks
- Stores in project-scoped protocol storage

**Implementation:** `createProtocolFromStudyDNA()` in `/utils/studyDNAAutoGeneration.ts`

### 3. **Methodology Text Generation**
Live generation of methodology sections:
- Study Design description
- Blinding protocol details
- Team configuration narrative
- Sample size justification
- Analysis plan outline

**Implementation:** `generateMethodology()` in ProjectSetup.tsx (lines 74-117)

## Linked Settings & Dependencies

### 1. **Study Methodologies Config**
**File:** `/config/studyMethodology.ts`
**Defines:**
- Study types (RCT, Cohort, Case Series, Lab, Technical Note)
- Rigor levels (High, Medium, Low)
- Required sections per study type
- ICH-GCP compliance requirements
- Regulatory pathways

### 2. **Study Design Defaults**
**File:** `/utils/studyDesignDefaults.ts`
**Provides:**
- Default configurations per study type
- Study DNA generation logic
- Field mappings and presets

### 3. **Protocol Workbench Integration**
**Dependency Chain:**
```
Project Creation → Study DNA → Protocol Auto-Gen → Protocol Workbench
```
- Auto-generated protocols appear in Protocol Workbench
- Schema blocks pre-configured based on study type
- Metadata pre-filled from project setup

### 4. **Database Module Integration**
**Links:**
- Study design determines database schema structure
- Variable types aligned with study endpoints
- Data collection forms generated from study DNA

### 5. **Analytics Integration**
**Links:**
- Study type determines available statistical tests
- Analysis plans pre-configured based on design
- Statistician persona capabilities aligned with design

### 6. **Ethics/IRB Integration**
**Links:**
- Blinding state tracked and auditable
- Unblinding requires digital signature
- Audit trail maintained for regulatory compliance
- Study design influences IRB submission requirements

### 7. **Governance Integration**
**Links:**
- Team configuration maps to RBAC roles
- Blinding state affects data access permissions
- PI signature required for team lock
- Institutional policies can override defaults

## Configuration Flow

### Typical User Journey:
1. **Create Project** (ProjectCreationModal)
   - Enter basic info (name, number, description)
   - Select study design type
   - Configure design-specific parameters
   - → Auto-generates persona + protocol

2. **Configure Methodology** (ProjectSetup)
   - Define research hypothesis
   - Configure team roles and permissions
   - Set blinding protocol
   - Review generated methodology
   - → Updates project.studyMethodology

3. **Build Protocol** (Protocol Workbench)
   - Use auto-generated protocol template
   - Customize schema blocks
   - Define dependencies
   - → Linked to study design

4. **Collect Data** (Database Module)
   - Schema aligned with protocol
   - Forms follow study design
   - Blinding enforced if configured

5. **Analyze Results** (Analytics)
   - Tests aligned with study type
   - Analysis plan follows design
   - Statistician persona guides workflow

## Current State Assessment

### ✅ Fully Implemented:
- [x] Project creation with study design
- [x] Study DNA configuration
- [x] Auto-persona generation
- [x] Auto-protocol generation
- [x] Methodology text generation
- [x] Team configuration
- [x] Blinding protocol setup
- [x] Audit trail tracking
- [x] Integration with Protocol Workbench
- [x] Integration with Database module
- [x] Integration with Analytics
- [x] Multi-language support (i18n keys ready)

### ⚠️ Areas for Enhancement:
- [ ] Team member invitation workflow (solo mode only currently)
- [ ] Institutional policy enforcement (structure exists, UI pending)
- [ ] Advanced blinding scenarios (e.g., partial unblinding)
- [ ] Methodology export to Word/PDF
- [ ] Version control for study design changes

### 🔗 Active Integrations:
- **ProjectContext** - Full CRUD + methodology updates
- **Protocol Workbench** - Auto-loads project protocols
- **Database Module** - Schema generation from study DNA
- **Analytics** - Statistical tests aligned with design
- **Ethics/IRB** - Blinding audit trail
- **AI Personas** - Study-specific persona generation
- **i18n System** - Multi-language support ready

## Usage Example

```typescript
// User clicks "Project Setup" in navigation
setActiveTab('project-setup');

// ProjectSetup renders with current project context
<ProjectSetup
  onComplete={() => setActiveTab('protocol-workbench')}
  onCancel={() => setActiveTab('dashboard')}
/>

// On completion, project.studyMethodology is updated:
updateProject(currentProject.id, {
  studyMethodology: {
    studyType: 'rct',
    teamConfiguration: { ... },
    blindingState: { ... },
    hypothesis: { ... },
    configuredAt: '2026-01-07T...',
    configuredBy: 'PI Name'
  }
});

// Automatically navigates to Protocol Workbench
// where auto-generated protocol is ready to customize
```

## Summary

**Status:** ✅ **FULLY ACTIVE & INTEGRATED**

The Project Setup module is a core, fully-functional component that:
1. Configures study methodology and design
2. Auto-generates personas and protocols
3. Integrates with all major modules
4. Maintains audit trails for compliance
5. Supports team configuration and blinding
6. Provides live methodology text generation

All settings are persisted via ProjectContext and linked throughout the application architecture.