# Refactoring Phase 3: Consolidate Project Context ✅ COMPLETE

## Objective
Extend ProjectContext to store and manage study methodology configuration, team DNA, blinding state, and research hypothesis across the entire application.

## Changes Made

### 1. **Extended Project Type** (`/types/shared.ts`)
Added comprehensive `studyMethodology` field to the Project interface.

**New Fields:**
```typescript
studyMethodology?: {
  studyType: 'rct' | 'prospective-cohort' | 'retrospective-case-series' | ...;
  configuredAt: string;
  configuredBy: string;
  
  // Team DNA Configuration
  teamConfiguration?: {
    assignedPersonas: Array<{
      role: string;
      permissionLevel: 'read' | 'write' | 'admin';
      blinded: boolean;
      aiAutonomyCap: 'audit-only' | 'suggest' | 'co-pilot' | 'supervisor';
      certified: boolean;
      restrictedVariables?: string[];
    }>;
    locked: boolean;
    lockedAt?: string;
    piSignature?: string;
  };
  
  // Blinding State
  blindingState?: {
    protocol: 'none' | 'single-blind' | 'double-blind' | 'triple-blind';
    isUnblinded: boolean;
    unblindedAt?: string;
    unblindedBy?: string;
    unblindingReason?: string;
    preUnblindingChecklistCompleted: boolean;
    digitalSignature?: string;
    auditTrail: Array<{
      timestamp: string;
      action: 'configured' | 'locked' | 'unblinded' | 'modified';
      performedBy: string;
      details: string;
    }>;
  };
  
  // Research Hypothesis (PICO Framework)
  hypothesis?: {
    picoFramework: {
      population: string;
      intervention: string;
      comparison: string;
      outcome: string;
    };
    researchQuestion: string;
    variables: Array<{
      name: string;
      type: string;
      grounded: boolean;
      boundTo?: string;
    }>;
    validatedAt?: string;
  };
};
```

---

### 2. **Extended ProjectContext** (`/contexts/ProjectContext.tsx`)
Added new methods for managing methodology configuration.

**New Methods:**

#### `configureMethodology(projectId, config)`
Saves the complete Project Setup Wizard output to a project.

```typescript
configureMethodology(currentProject.id, {
  studyType: 'rct',
  teamConfiguration: { ... },
  hypothesis: { ... },
  configuredBy: 'Demo User'
});
```

#### `updateBlindingState(projectId, blindingUpdate)`
Updates blinding state (for unblinding operations).

```typescript
updateBlindingState(currentProject.id, {
  isUnblinded: true,
  unblindedAt: new Date().toISOString(),
  unblindedBy: 'PI',
  unblindingReason: 'Primary endpoint reached'
});
```

#### `performUnblinding(projectId, params)`
Dedicated method for "Break Glass" unblinding with full audit trail.

```typescript
performUnblinding(currentProject.id, {
  performedBy: 'Principal Investigator',
  reason: 'Data Safety Monitoring Board recommendation',
  digitalSignature: 'PI-SIGNATURE-2026-01-05'
});
```

#### `getBlindingStatus()`
Returns current blinding status for the active project.

```typescript
const { isBlinded, isUnblinded, protocol, canUnblind } = getBlindingStatus();
```

---

### 3. **ProjectSetupWizardContainer** (`/components/unified-wizard/ProjectSetupWizardContainer.tsx`)
New wrapper component that integrates the wizard with ProjectContext.

**Features:**
- Uses `useProject()` hook properly
- Saves configuration on wizard completion
- Triggers parent navigation handler
- Clean separation of concerns

**Integration:**
```typescript
<ProjectSetupWizardContainer
  onComplete={() => setActiveTab('protocol-workbench')}
  onCancel={() => setActiveTab('dashboard')}
/>
```

---

### 4. **Restored Research Wizard** (`/components/unified-workspace/NavigationPanel.tsx`)
Fixed navigation regression from Phase 2.

**Changes:**
- Added back `research-wizard` to NavigationTab type
- Added back `methodology-engine` to NavigationTab type  
- All three tabs now available:
  - **Research Wizard** (original PICO flow)
  - **Project Setup** (unified wizard)
  - **Methodology Engine** (demo/standalone)

---

## Data Flow Diagram

```
┌─────────────────────────────┐
│  Project Setup Wizard       │
│  (3-step flow)              │
└──────────────┬──────────────┘
               │
               │ onComplete()
               ▼
┌─────────────────────────────┐
│ ProjectSetupWizardContainer │
│ - Uses useProject()         │
│ - Saves to ProjectContext   │
└──────────────┬──────────────┘
               │
               │ configureMethodology()
               ▼
┌─────────────────────────────┐
│   ProjectContext            │
│   - Updates allProjects[]   │
│   - Saves to localStorage   │
│   - Triggers re-render      │
└──────────────┬──────────────┘
               │
               │ currentProject updated
               ▼
┌─────────────────────────────┐
│  All Components             │
│  - Database (apply blinding)│
│  - Analytics (enforce perms)│
│  - Writing (check autonomy) │
└─────────────────────────────┘
```

---

## Usage Examples

### **1. Configure Methodology (After Wizard Completion)**
```typescript
const { configureMethodology } = useProject();

configureMethodology(currentProject.id, {
  studyType: 'rct',
  teamConfiguration: {
    assignedPersonas: [
      { role: 'Principal Investigator', permissionLevel: 'admin', blinded: false, ... },
      { role: 'Blinded Outcome Evaluator', permissionLevel: 'write', blinded: true, ... }
    ],
    locked: true,
    piSignature: 'PI-20260105'
  },
  hypothesis: {
    picoFramework: { population: '...', intervention: '...', ... },
    researchQuestion: '...',
    variables: [ ... ]
  },
  configuredBy: 'Dr. Smith'
});
```

### **2. Check Blinding Status**
```typescript
const { getBlindingStatus } = useProject();
const { isBlinded, protocol, canUnblind } = getBlindingStatus();

if (isBlinded && userRole === 'Blinded Analyst') {
  // Apply data masking
  maskTreatmentAssignments(data);
}
```

### **3. Perform Unblinding**
```typescript
const { performUnblinding } = useProject();

performUnblinding(currentProject.id, {
  performedBy: 'Dr. Principal Investigator',
  reason: 'All primary endpoints collected, DSMB approval received',
  digitalSignature: 'PI-DIGITAL-SIG-20260105-1430'
});

// All blinded analysts immediately see treatment assignments
```

### **4. Access Study Configuration**
```typescript
const { currentProject } = useProject();

if (currentProject?.studyMethodology) {
  const { studyType, teamConfiguration, hypothesis } = currentProject.studyMethodology;
  
  // Apply study-specific logic
  if (studyType === 'rct') {
    enforceRandomization();
  }
  
  // Check persona permissions
  const piPersona = teamConfiguration.assignedPersonas.find(p => p.role === 'Principal Investigator');
  console.log('PI AI Autonomy:', piPersona.aiAutonomyCap);
}
```

---

## Benefits Achieved

### **Centralized Configuration**
✅ Single source of truth for study methodology  
✅ No props drilling across components  
✅ Automatic persistence to localStorage  
✅ Immediate propagation to all consumers

### **Type Safety**
✅ Full TypeScript coverage  
✅ Intellisense for all methodology fields  
✅ Compile-time validation

### **Audit Trail**
✅ All configuration changes timestamped  
✅ Unblinding events permanently logged  
✅ Complete traceability for regulatory compliance

### **Permission Enforcement**
✅ Role-based access ready to implement  
✅ Blinding masks ready to apply  
✅ AI autonomy caps ready to enforce

---

## Next Phase Integration Points

### **Phase 4: Apply Configuration Across App**
Now that configuration is centralized, we can:

1. **Database Component**
   - Apply blinding masks based on `blindingState`
   - Show/hide treatment assignment columns
   - Enforce restricted variables

2. **Analytics Component**
   - Block efficacy analyses until unblinded
   - Show placeholder labels ("Group 1", "Group 2")
   - Enable full analysis post-unblinding

3. **Academic Writing Module**
   - Restrict AI Writing Assistant based on `aiAutonomyCap`
   - Block efficacy claims if still blinded
   - Auto-populate methodology section from `studyMethodology`

4. **Global Header**
   - Display current study type badge
   - Show blinding status indicator
   - Quick access to team configuration

---

## Migration Notes

### **Backward Compatibility**
✅ `studyMethodology` is **optional** on Project type  
✅ Existing projects without configuration still work  
✅ No breaking changes to existing code

### **Default Values**
- Projects without methodology default to "unblinded" mode
- All personas get full permissions by default
- AI autonomy defaults to 'audit-only' for safety

---

## Status
✅ **Phase 3 Complete** - Zero breaking changes, full backward compatibility.

**Achieved:**
- Extended Project type with methodology configuration
- Added 4 new ProjectContext methods
- Created ProjectSetupWizardContainer for integration
- Restored Research Wizard navigation
- Full type safety maintained
- Data persists across app reloads

**Ready for:**
- Phase 4: Apply configuration across Database, Analytics, and Writing modules
- Blinding mask implementation
- Permission enforcement
- AI autonomy cap implementation
