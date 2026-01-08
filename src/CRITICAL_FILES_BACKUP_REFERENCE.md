# Critical Files Backup Reference
**Checkpoint:** PRE-UI-REFACTOR-2026-01-04  
**Purpose:** Quick reference for critical file paths and their current working state

---

## 🔴 DO NOT MODIFY (Core Data Layer)

### Storage & State Management
```
/utils/storageService.ts              - Core localStorage wrapper
/utils/storageKeys.ts                 - Project-scoped key generation
/contexts/ProjectContext.tsx          - Multi-project state
/contexts/AuthContext.tsx             - Authentication state
```

### Type Definitions
```
/types/shared.ts                      - Core types (Project, Protocol, Persona, etc.)
/types/studyDesigns.ts                - Study DNA types
/types/manuscript.ts                  - Academic writing types
```

### Validation Layer
```
/utils/validation/importValidator.ts  - Zod validation for imports
/components/ValidationErrorDisplay.tsx - Error display component
```

---

## 🟡 MODIFY WITH EXTREME CAUTION

### Core Business Logic
```
/utils/schemaLocking.ts               - Version freeze logic
/utils/protocolMigration.ts           - Data migration system
/utils/studyDNAAutoGeneration.ts      - Auto-generation logic
/utils/studyDesignDefaults.ts         - Study DNA configurations
/utils/workflowProgress.ts            - Dashboard calculations
```

### Main Feature Components (Logic)
```
/components/protocol-workbench/ProtocolWorkbenchCore.tsx
/components/protocol-workbench/hooks/useVersionControl.ts
/components/protocol-workbench/hooks/useBlockManagement.ts
/components/protocol-library/hooks/useProtocolLibrary.ts
/components/AcademicWriting.tsx
/hooks/useManuscriptState.refactored.ts
```

### Recently Fixed Critical Component
```
/components/ProjectCreationModal.tsx  - JUST FIXED - has complete handleSubmit
```

---

## 🟢 SAFE TO MODIFY (UI/Presentation)

### Layout Components (Visual changes safe)
```
/components/TopBar.tsx                - Header styling
/components/ProjectSelector.tsx       - Dropdown styling
/components/DashboardV2.tsx           - Card layouts
/components/StatusBadge.tsx           - Badge styling
```

### Modal Styling (Keep logic intact)
```
/components/protocol-workbench/components/modals/SettingsModal.tsx
/components/protocol-workbench/components/modals/DependencyModal.tsx
/components/protocol-workbench/components/modals/VersionTagModal.tsx
/components/protocol-library/components/PublishModal.tsx
/components/VersionConflictModal.tsx
```

### Study Design UI Components
```
/components/project/StudyDesignSelector.tsx
/components/project/study-designs/RCTConfiguration.tsx
/components/project/study-designs/CaseSeriesConfiguration.tsx
/components/project/study-designs/CohortConfiguration.tsx
/components/project/study-designs/LaboratoryConfiguration.tsx
/components/project/study-designs/TechnicalNoteConfiguration.tsx
/components/project/study-designs/StatisticianPreview.tsx
```

### Academic Writing UI
```
/components/academic-writing/ManuscriptEditor.tsx
/components/academic-writing/SourceLibrary.tsx
/components/academic-writing/LogicAuditSidebar.tsx
/components/academic-writing/StatisticalManifestPanel.tsx
```

---

## 🎨 UI Modification Guidelines

### Safe Changes
✅ Tailwind classes (colors, spacing, borders, shadows)  
✅ Layout structure (flex, grid, positioning)  
✅ Typography (as long as no text-* or font-* classes added)  
✅ Icons (swap lucide-react icons)  
✅ Animations and transitions  
✅ Hover/focus states  
✅ Border radius and visual styling  

### Unsafe Changes
❌ Props interface changes (breaks parent/child)  
❌ State variable names (breaks dependencies)  
❌ Event handler signatures  
❌ Hook return values  
❌ Context provider structure  
❌ Storage service method calls  
❌ Type definitions  

---

## 🔍 Key Integration Points to Preserve

### 1. Project Context Hook
```typescript
// Used in 17+ components - DO NOT CHANGE
const { currentProject, createProject, switchProject } = useProject();
```

### 2. Storage Service Calls
```typescript
// Used throughout app - DO NOT CHANGE
storage.protocols.save(protocols, projectId);
storage.protocols.getAll(projectId);
storage.personas.save(personas, projectId);
storage.clinicalData.save(data, projectId);
```

### 3. Modal Visibility Pattern
```typescript
// ALL modals must have this - DO NOT REMOVE
if (!isOpen) return null;
```

### 4. Form Submit Pattern (ProjectCreationModal)
```typescript
// RECENTLY ADDED - DO NOT REMOVE
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
  if (isSubmitting) return;
  try {
    setIsSubmitting(true);
    // validation
    // creation
  } catch (error) {
    // error handling
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## 📊 Component Dependency Map

### High-Level Hierarchy
```
App.tsx
├── TopBar
│   ├── ProjectSelector
│   └── ProjectCreationModal ⚠️ RECENTLY FIXED
├── DashboardV2
├── PersonaEditor
├── ProtocolWorkbenchCore
│   └── SchemaBlock (recursive)
├── ProtocolLibrary
└── AcademicWriting
    ├── ManuscriptEditor
    ├── SourceLibrary
    └── LogicAuditSidebar
```

### Critical Shared Components
```
ValidationErrorDisplay    ← Used by import/export
StatusBadge              ← Used by multiple features
Toast/ToastContainer     ← Used globally for notifications
```

---

## 🧪 Quick Smoke Tests

### After any UI change, run these:

1. **Project Creation Flow**
   ```
   Click "Create Project" → Fill form → Select study design → Submit
   Expected: Project created, modal closes, new project active
   ```

2. **Project Switching**
   ```
   Click project selector → Choose different project
   Expected: Context switches, data isolated
   ```

3. **Protocol Workbench**
   ```
   Navigate to workbench → Add block → Configure → Save
   Expected: Block appears, data persists
   ```

4. **Schema Freeze**
   ```
   Open protocol → Click lock → Confirm
   Expected: Version locked, edits prevented
   ```

5. **Academic Writing**
   ```
   Navigate to writing → Type in editor → Add source
   Expected: Content saves, source appears
   ```

---

## 🚨 Red Flags During UI Changes

### Watch for these error patterns:

#### Console Errors
```javascript
// BAD - Indicates broken integration
"Cannot read property 'id' of undefined"
"X is not a function"
"Failed to save to storage"
```

#### Visual Bugs
- Modal doesn't open/close
- Button click has no effect
- Form doesn't submit
- Data doesn't persist after reload
- Wrong project data showing

#### Runtime Errors
- White screen (critical crash)
- Infinite re-render loop
- Memory leak warnings
- LocalStorage quota exceeded

---

## 📋 Pre-Commit Checklist

Before committing UI changes:

- [ ] No new console errors
- [ ] Can create project successfully
- [ ] Can switch projects
- [ ] All modals open/close properly
- [ ] Forms validate and submit
- [ ] Data persists after reload
- [ ] No TypeScript errors
- [ ] No broken imports
- [ ] All buttons have hover states
- [ ] Loading states work correctly

---

## 🔧 Emergency Rollback Commands

### If something breaks, restore critical files:

```bash
# Core data layer (HIGHEST PRIORITY)
Restore: /utils/storageService.ts
Restore: /contexts/ProjectContext.tsx

# Recently fixed (HIGH PRIORITY)
Restore: /components/ProjectCreationModal.tsx

# Feature modules (MEDIUM PRIORITY)
Restore: /components/protocol-workbench/ProtocolWorkbenchCore.tsx
Restore: /components/AcademicWriting.tsx

# Utilities (MEDIUM PRIORITY)
Restore: /utils/schemaLocking.ts
Restore: /utils/studyDNAAutoGeneration.ts
```

---

## ✅ Safe UI Enhancement Ideas

### Low-Risk Improvements
1. Add subtle shadows to cards
2. Improve button hover animations
3. Add loading spinners
4. Enhance modal transitions
5. Improve color contrast
6. Add success/error toasts
7. Improve form field styling
8. Add icon variations
9. Enhance badge designs
10. Improve spacing consistency

### Medium-Risk Improvements
1. Restructure dashboard layout
2. Redesign navigation tabs
3. Create new modal designs
4. Enhance table layouts
5. Improve responsive breakpoints

---

## 📞 Quick Recovery Reference

### File is broken after UI change?

1. **Check git diff** - See what changed
2. **Review this document** - Find the file's risk level
3. **Check integration points** - Verify props/hooks unchanged
4. **Look for console errors** - Identify the exact error
5. **Restore from checkpoint** - Use STATE_CHECKPOINT document
6. **Test again** - Run smoke tests

### Common UI Change Mistakes

❌ Changed prop name → Parent component breaks  
**Fix:** Restore original prop name, update parent instead

❌ Removed state variable → Hook breaks  
**Fix:** Restore state variable, find alternative approach

❌ Modified event handler → Button stops working  
**Fix:** Restore handler, modify only styling

❌ Changed storage call → Data doesn't save  
**Fix:** Restore storage service call exactly

---

**Status:** CHECKPOINT SAVED ✅  
**Restore Point:** PRE-UI-REFACTOR-2026-01-04  
**Ready for UI Changes:** YES ✅
