# Architecture Snapshot - Pre-UI Changes
**Date:** 2026-01-04  
**Checkpoint:** PRE-UI-REFACTOR-2026-01-04

---

## 🏗️ System Architecture

### Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  (React Components - Safe to modify visual styling)         │
├─────────────────────────────────────────────────────────────┤
│                     BUSINESS LOGIC LAYER                     │
│  (Hooks, Utils, Services - Modify with caution)             │
├─────────────────────────────────────────────────────────────┤
│                        DATA LAYER                            │
│  (Storage Service, Contexts - DO NOT MODIFY)                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Module Structure

### Core Modules

```
Clinical Intelligence Engine
│
├── 🔐 Authentication Module
│   ├── AuthContext (RBAC enforcement)
│   ├── Role definitions (CONTRIBUTOR, LEAD_SCIENTIST, ADMIN)
│   └── Permission checks
│
├── 📁 Project Management Module
│   ├── ProjectContext (Multi-project state)
│   ├── ProjectSelector (UI)
│   ├── ProjectCreationModal (UI + Logic) ⚠️ RECENTLY FIXED
│   ├── Study DNA System
│   │   ├── StudyDesignSelector
│   │   ├── 5x Configuration Components
│   │   ├── StatisticianPreview
│   │   └── Auto-generation utilities
│   └── Storage isolation (project-scoped keys)
│
├── 📋 Protocol Workbench Module
│   ├── ProtocolWorkbenchCore (Main orchestrator)
│   ├── Recursive Schema Engine
│   │   ├── SchemaBlock (recursive component)
│   │   ├── Block types (text, number, enum, calculation)
│   │   └── Dependency graph
│   ├── Version Control System
│   │   ├── Schema freeze/lock
│   │   ├── Conflict detection
│   │   ├── Version tagging
│   │   └── Edit prevention
│   ├── Modals (4x: Settings, Dependency, Version, Generator)
│   └── Database Auto-generation
│
├── 📚 Protocol Library Module
│   ├── ProtocolLibrary (Browser/viewer)
│   ├── Publishing workflow
│   ├── Version management
│   └── Protocol templates
│
├── ✍️ Academic Writing Module
│   ├── AcademicWriting (Main container)
│   ├── Dual-Pane Editor
│   │   ├── ManuscriptEditor (Rich text)
│   │   └── Live preview
│   ├── NotebookLM-style Source Library
│   │   ├── Source management
│   │   ├── Citation system
│   │   └── Context integration
│   ├── Statistical Manifest Panel
│   │   ├── Protocol data integration
│   │   ├── Variable references
│   │   └── Data binding
│   ├── Supervisor Mode
│   │   ├── Logic audit
│   │   ├── Compliance checking
│   │   └── Review workflow
│   └── 4x Integrations (all complete)
│
├── 👤 Persona & Governance Module
│   ├── PersonaEditor (6 tabs)
│   │   ├── Identity
│   │   ├── Interpretation
│   │   ├── Language
│   │   ├── Outcome
│   │   ├── Citation
│   │   └── Validation
│   ├── LivePreviewPanel
│   └── Persona templates
│
├── 📊 Analytics Module
│   ├── AnalyticsStats (Main dashboard)
│   ├── SchemaExplorer
│   ├── Data collection stats
│   └── Database visualization
│
├── 📈 Dashboard Module
│   ├── DashboardV2 (Progress cards)
│   ├── Workflow progress calculation
│   └── Quick actions
│
└── 💾 Data Management Module
    ├── Import/Export system
    ├── Validation layer (Zod)
    ├── Migration system
    └── Backup/restore
```

---

## 🔄 Data Flow Patterns

### Pattern 1: Create Project
```
User clicks "Create Project"
    ↓
ProjectCreationModal opens (isOpen = true)
    ↓
User fills form + selects Study Design
    ↓
handleSubmit validates input
    ↓
createProject() called (ProjectContext)
    ↓
Project saved to storage.projects
    ↓
Auto-generate Persona (studyDNAAutoGeneration)
    ↓
Save to storage.personas (project-scoped)
    ↓
Auto-generate Protocol (studyDNAAutoGeneration)
    ↓
Save to storage.protocols (project-scoped)
    ↓
Modal closes, new project becomes active
```

### Pattern 2: Edit Protocol
```
User navigates to Protocol Workbench
    ↓
ProtocolWorkbenchCore loads
    ↓
useVersionControl hook fetches protocols (project-scoped)
    ↓
User adds/edits schema block
    ↓
useBlockManagement updates state
    ↓
useEffect triggers save
    ↓
storage.protocols.save(protocols, projectId)
    ↓
localStorage updated with project-scoped key
```

### Pattern 3: Lock Protocol Version
```
User clicks "Publish" or "Lock"
    ↓
lockProtocolVersion() called
    ↓
Check canEditProtocolVersion()
    ↓
Create new version with locked status
    ↓
Update protocol in storage
    ↓
Future edits check version lock
    ↓
If locked, show VersionConflictModal
```

### Pattern 4: Switch Projects
```
User selects different project
    ↓
switchProject(projectId) called
    ↓
localStorage.setItem('currentProjectId', projectId)
    ↓
ProjectContext updates currentProject state
    ↓
All components re-render with new context
    ↓
All data calls now use new projectId
    ↓
Data isolation maintained
```

### Pattern 5: Academic Writing with Sources
```
User types in ManuscriptEditor
    ↓
Content auto-saves to localStorage
    ↓
User adds source in SourceLibrary
    ↓
Source saved to manuscript.sources array
    ↓
User integrates Statistical Manifest
    ↓
Protocol variables linked to manuscript
    ↓
Supervisor Mode audits logic
    ↓
Compliance checks run
    ↓
Warnings displayed if needed
```

---

## 🗄️ Storage Schema

### localStorage Keys Structure
```javascript
{
  // Global
  "projects": [Project, Project, ...],
  "currentProjectId": "uuid",
  
  // Project-scoped (generated via STORAGE_KEYS.getProjectKey)
  "project_{id}_protocols": [SavedProtocol, ...],
  "project_{id}_clinicalData": [ClinicalDataRecord, ...],
  "project_{id}_personas": [UserPersona, ...],
  "project_{id}_manuscripts": [ManuscriptManifest, ...],
  "project_{id}_templates": [SchemaTemplate, ...],
  "project_{id}_statisticalManifests": [StatisticalManifest, ...],
  
  // Academic Writing (per-manuscript)
  "manuscript_{manuscriptId}": {
    content: string,
    sources: Source[],
    metadata: {...},
    supervisorNotes: {...}
  },
  
  // Demo data flags
  "demo_academic_loaded_{projectId}": "true"
}
```

### Type Definitions Hierarchy
```typescript
// Core Types (shared.ts)
Project
  ├── id: string
  ├── name: string
  ├── studyNumber: string
  ├── studyDesign?: StudyDesignConfiguration
  └── metadata: {...}

SavedProtocol
  ├── id: string
  ├── projectId: string
  ├── name: string
  ├── blocks: SchemaBlock[]
  └── versions: ProtocolVersion[]

SchemaBlock (Recursive)
  ├── id: string
  ├── type: 'section' | 'variable' | 'calculation'
  ├── children?: SchemaBlock[]  // Recursion!
  └── settings: {...}

UserPersona
  ├── id: string
  ├── projectId?: string
  ├── template: PersonaTemplate
  └── configurations: {...}

// Study DNA Types (studyDesigns.ts)
StudyDesignConfiguration
  ├── type: StudyDesignType
  └── [type-specific config]

StudyDNA
  ├── metadata: {...}
  ├── statisticianTemplate: PersonaTemplate
  └── protocolTemplate: ProtocolTemplate

// Academic Writing Types (manuscript.ts)
ManuscriptManifest
  ├── id: string
  ├── projectId: string
  ├── title: string
  ├── sources: Source[]
  └── supervisorMode: {...}
```

---

## 🎯 Key Design Patterns

### 1. Project Scoping Pattern
```typescript
// ❌ OLD WAY (Global storage)
const protocols = storage.protocols.getAll();

// ✅ NEW WAY (Project-scoped)
const { currentProject } = useProject();
const protocols = storage.protocols.getAll(currentProject.id);
```

### 2. Modal Visibility Pattern
```typescript
// ALL modals must follow this pattern
export function SomeModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;  // ← REQUIRED!
  
  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="modal">...</div>
    </>
  );
}
```

### 3. Form Submit Pattern
```typescript
// ✅ ROBUST PATTERN (as of 2026-01-04)
const [isSubmitting, setIsSubmitting] = useState(false);
const [errors, setErrors] = useState<Record<string, string>>({});

const handleSubmit = async () => {
  if (isSubmitting) return;  // Prevent double-submit
  
  try {
    setIsSubmitting(true);
    
    // Validation
    const errors = validate(formData);
    if (errors) {
      setErrors(errors);
      return;
    }
    
    // Submit
    await submitData();
    
    // Success
    onClose();
  } catch (error) {
    setErrors({ submit: 'Failed to submit' });
  } finally {
    setIsSubmitting(false);
  }
};
```

### 4. Storage Service Pattern
```typescript
// Centralized, type-safe storage
class StorageService {
  protocols = {
    getAll: (projectId?: string) => SavedProtocol[],
    save: (protocols: SavedProtocol[], projectId?: string) => void,
    getById: (id: string, projectId?: string) => SavedProtocol | null,
  };
  
  // Same pattern for personas, clinicalData, manuscripts, etc.
}

// Single export
export const storage = new StorageService();
```

### 5. Version Control Pattern
```typescript
interface ProtocolVersion {
  versionNumber: number;
  status: 'draft' | 'locked' | 'published';
  lockedAt?: string;
  lockedBy?: string;
}

// Check before allowing edits
if (!canEditProtocolVersion(protocol, currentVersion)) {
  showVersionConflictModal();
  return;
}
```

---

## 🔐 Authentication & Authorization

### RBAC Structure
```typescript
type UserRole = 'CONTRIBUTOR' | 'LEAD_SCIENTIST' | 'ADMIN';

// Permission matrix
const permissions = {
  CONTRIBUTOR: {
    canViewProtocols: true,
    canEditProtocols: false,
    canPublishProtocols: false,
    canManageProjects: false,
  },
  LEAD_SCIENTIST: {
    canViewProtocols: true,
    canEditProtocols: true,
    canPublishProtocols: true,
    canManageProjects: false,
  },
  ADMIN: {
    canViewProtocols: true,
    canEditProtocols: true,
    canPublishProtocols: true,
    canManageProjects: true,
  },
};
```

### Auth Flow (Mock - No Backend)
```
App loads
    ↓
AuthProvider initializes
    ↓
Mock user loaded (LEAD_SCIENTIST)
    ↓
Components check permissions via useAuth()
    ↓
UI elements conditionally rendered
    ↓
Actions blocked based on role
```

---

## 🎨 Design System

### Color Palette
```css
/* Primary */
--blue-600: #2563EB;     /* Primary actions */
--blue-50: #EFF6FF;      /* Subtle backgrounds */

/* Success */
--green-600: #16A34A;    /* Success states */
--green-50: #F0FDF4;     /* Success backgrounds */

/* Warning */
--amber-600: #D97706;    /* Warnings */
--amber-50: #FFFBEB;     /* Warning backgrounds */

/* Danger */
--red-600: #DC2626;      /* Errors */
--red-50: #FEF2F2;       /* Error backgrounds */

/* Neutral */
--slate-900: #0F172A;    /* Primary text */
--slate-600: #475569;    /* Secondary text */
--slate-200: #E2E8F0;    /* Borders */
--slate-50: #F8FAFC;     /* Backgrounds */
```

### Spacing System (8px base)
```css
gap-1    /* 4px  - 0.5 × base */
gap-2    /* 8px  - 1 × base */
gap-3    /* 12px - 1.5 × base */
gap-4    /* 16px - 2 × base */
gap-6    /* 24px - 3 × base */
gap-8    /* 32px - 4 × base */
```

### Typography Rules
```css
/* ⚠️ DO NOT USE these Tailwind classes unless explicitly requested */
text-xs, text-sm, text-base, text-lg, text-xl  /* Font sizes */
font-normal, font-medium, font-semibold         /* Font weights */
leading-none, leading-tight, leading-normal     /* Line heights */

/* ✅ Instead, use semantic HTML elements with default styling from globals.css */
```

---

## 🧩 Component Composition

### Example: Protocol Workbench
```
ProtocolWorkbenchCore
├── Header
│   ├── Title
│   ├── Version selector
│   └── PublishProtocolButton
├── Toolbar
│   ├── Add block buttons
│   ├── Import/Export
│   └── Settings
├── Schema Canvas (recursive rendering)
│   └── SchemaBlock
│       ├── Block header
│       ├── Block content
│       └── Children (SchemaBlock[]) ← Recursion
├── Modals
│   ├── SettingsModal
│   ├── DependencyModal
│   ├── VersionTagModal
│   └── SchemaGeneratorModal
└── VersionConflictModal (conditional)
```

### Example: Academic Writing
```
AcademicWriting
├── Toolbar
│   ├── File actions
│   ├── Mode selector (Write/Review)
│   └── Export options
├── Main Editor (dual-pane)
│   ├── ManuscriptEditor (left)
│   │   ├── Rich text editor
│   │   └── Formatting toolbar
│   └── Live Preview (right)
│       └── Rendered markdown
├── Sidebars
│   ├── SourceLibrary (left)
│   │   ├── Source list
│   │   ├── Add source form
│   │   └── Citation insertion
│   ├── StatisticalManifestPanel (right)
│   │   ├── Protocol selector
│   │   ├── Variable browser
│   │   └── Insert references
│   └── LogicAuditSidebar (conditional)
│       ├── Supervisor notes
│       ├── Compliance checks
│       └── Review workflow
└── Status Bar
    ├── Word count
    ├── Save status
    └── Last edited
```

---

## 📝 State Management Strategy

### Local State (useState)
```typescript
// Used for: UI-only state, form inputs, temporary flags
const [isOpen, setIsOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
```

### Context State (React Context)
```typescript
// Used for: Shared state across components
// ProjectContext: currentProject, allProjects, switchProject, createProject
// AuthContext: currentUser, role, login, logout
```

### Persistent State (localStorage)
```typescript
// Used for: Data that must survive refresh
// All protocols, projects, manuscripts, personas
// Accessed via storage service
```

### Server State (React Query) - Prepared but not used yet
```typescript
// Ready for: Supabase integration
// Query client configured in /lib/queryClient.ts
// Hooks prepared in /hooks/*.refactored.ts
```

---

## 🚀 Performance Optimizations

### Current Optimizations
1. **Lazy rendering** - Modals only render when open
2. **Memoization** - useMemo for computed values (studyDNA, workflow progress)
3. **Debounced autosave** - Manuscript editor saves after delay
4. **Project-scoped storage** - Only load data for active project
5. **Conditional sub-component rendering** - Only show configuration when design selected

### Future Optimizations (Not Yet Implemented)
- [ ] Virtual scrolling for large lists
- [ ] Code splitting by route
- [ ] Image lazy loading
- [ ] Service worker for offline mode
- [ ] IndexedDB for large datasets

---

## 🔄 Migration & Backwards Compatibility

### Migration System
```typescript
// Location: /utils/protocolMigration.ts
// Automatically runs on app mount in App.tsx

const runMigrations = () => {
  // Migrate legacy global data to project-scoped
  migrateToProjectStorage();
  
  // Update data structures
  migrateProtocolVersions();
  
  // Clean up old keys
  cleanupLegacyStorage();
};
```

### Version Compatibility
- All data includes version markers
- Storage keys include format version
- Graceful degradation for old data
- Migration logs to console for debugging

---

## ✅ Health Indicators

### System is Healthy When:
- ✅ No console errors on load
- ✅ Projects list populates
- ✅ Can create new project
- ✅ Can switch between projects
- ✅ Protocol data saves and persists
- ✅ Modals open and close cleanly
- ✅ Forms submit successfully
- ✅ Validation catches errors
- ✅ Data isolation works (switching projects shows different data)
- ✅ Version locking prevents edits

### System is Broken When:
- ❌ White screen on load
- ❌ Console errors about undefined properties
- ❌ "Cannot read property 'id' of undefined"
- ❌ Data from different projects mixing
- ❌ Forms submit but nothing happens
- ❌ Modals don't open
- ❌ localStorage exceeds quota
- ❌ Infinite re-render loops

---

**Architecture Status:** STABLE ✅  
**Last Verified:** 2026-01-04  
**Ready for UI Changes:** YES ✅

This architecture is production-ready and can handle UI modifications without breaking core functionality, as long as the data layer and business logic remain intact.
