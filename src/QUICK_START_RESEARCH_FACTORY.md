# Quick Start: Research Factory Integration

**Goal:** Get the new Research Factory UI running alongside the existing UI in 30 minutes.

---

## 🚀 30-Minute Quick Start

### Step 1: Verify Foundation (2 minutes)

Check that all new files exist:

```bash
# Components
ls components/unified-workspace/

# Should see:
# - WorkspaceShell.tsx
# - GlobalHeader.tsx
# - NavigationPanel.tsx
# - LiveBudgetTracker.tsx
# - LogicAuditSidebar.tsx
# - index.ts

# Types
ls types/accountability.ts

# Data
ls data/journalLibrary.ts

# Utils
ls utils/budgetCalculator.ts
```

✅ All files present? Continue to Step 2.

---

### Step 2: Create Feature Flag (5 minutes)

**File:** `/App.tsx`

**Add this at the top of the `AppContent` component:**

```typescript
function AppContent() {
  // ... existing state

  // 🆕 ADD THIS
  const [useResearchFactoryUI, setUseResearchFactoryUI] = useState(false);

  // 🆕 ADD TOGGLE BUTTON (only in development)
  const FeatureFlagToggle = () => {
    if (process.env.NODE_ENV !== 'development') return null;
    
    return (
      <button
        onClick={() => setUseResearchFactoryUI(!useResearchFactoryUI)}
        className="fixed bottom-4 right-4 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg z-50 text-sm font-medium hover:bg-purple-700 transition-colors"
      >
        UI: {useResearchFactoryUI ? 'Research Factory' : 'Classic'}
      </button>
    );
  };

  return (
    <>
      {/* Existing render logic here */}
      <FeatureFlagToggle />
    </>
  );
}
```

**Save and refresh.** You should see a purple button in bottom-right corner.

---

### Step 3: Create Minimal ResearchFactoryApp (10 minutes)

**File:** `/components/ResearchFactoryApp.tsx` (NEW FILE)

```typescript
import { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';
import {
  WorkspaceShell,
  NavigationPanel,
  type NavigationTab,
} from './unified-workspace';

// Import existing screens
import { DashboardV2 } from './DashboardV2';
import { ProtocolWorkbenchCore } from './protocol-workbench/ProtocolWorkbenchCore';
import { ProtocolLibrary } from './protocol-library/ProtocolLibrary';
import { AcademicWriting } from './AcademicWriting';
import { PersonaEditor } from './PersonaEditor';
import { AnalyticsStats } from './AnalyticsStats';
import { DataImportExport } from './DataImportExport';

export function ResearchFactoryApp() {
  const { currentProject } = useProject();
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // Dashboard uses full-width mode
  const isFullWidth = activeTab === 'dashboard';

  return (
    <WorkspaceShell
      navigation={
        <NavigationPanel
          activeTab={activeTab}
          onTabChange={setActiveTab}
          projectName={currentProject?.name}
        />
      }
      fullWidth={isFullWidth}
    >
      {renderScreen(activeTab)}
    </WorkspaceShell>
  );
}

function renderScreen(screen: NavigationTab) {
  switch (screen) {
    case 'dashboard':
      return <DashboardV2 onNavigate={(s) => console.log('Navigate to:', s)} />;

    case 'protocol-workbench':
      return <ProtocolWorkbenchCore />;

    case 'protocol-library':
      return <ProtocolLibrary />;

    case 'academic-writing':
      return <AcademicWriting />;

    case 'persona-editor':
      return <PersonaEditor />;

    case 'analytics':
      return <AnalyticsStats />;

    case 'data-management':
      return <DataImportExport />;

    default:
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-500">Screen not implemented: {screen}</p>
        </div>
      );
  }
}
```

**Save the file.**

---

### Step 4: Integrate into App.tsx (5 minutes)

**File:** `/App.tsx`

**Find the return statement in `AppContent` and wrap it:**

```typescript
import { ResearchFactoryApp } from './components/ResearchFactoryApp'; // 🆕 ADD IMPORT

function AppContent() {
  // ... existing state
  const [useResearchFactoryUI, setUseResearchFactoryUI] = useState(false);

  return (
    <>
      {useResearchFactoryUI ? (
        // 🆕 NEW UI
        <ResearchFactoryApp />
      ) : (
        // ✅ EXISTING UI (preserved)
        <>
          <TopBar activePersona={activePersona} />
          {/* ... existing screens ... */}
          <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </>
      )}

      {/* Feature flag toggle */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={() => setUseResearchFactoryUI(!useResearchFactoryUI)}
          className="fixed bottom-4 right-4 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg z-50 text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          UI: {useResearchFactoryUI ? 'Research Factory' : 'Classic'}
        </button>
      )}
    </>
  );
}
```

**Save and refresh.**

---

### Step 5: Test the New UI (8 minutes)

1. **Click the purple toggle button**
   - Should say "UI: Research Factory"

2. **Verify the layout appears:**
   - ✅ Left sidebar (240px) with navigation
   - ✅ Main content area (centered)
   - ✅ Current project name in sidebar header

3. **Test navigation:**
   - Click "Dashboard" → Should show DashboardV2
   - Click "Protocol Workbench" → Should show workbench
   - Click "Academic Writing" → Should show editor
   - Click "Analytics" → Should show analytics

4. **Test focal point consistency:**
   - Switch between tabs
   - Main content should stay centered
   - No "jumping" or layout shifts

5. **Toggle back to old UI:**
   - Click purple button again
   - Should show original TopBar layout
   - Verify everything still works

---

## ✅ Success Criteria

After 30 minutes, you should have:

- ✅ Purple toggle button visible
- ✅ Can switch between UIs
- ✅ New UI shows navigation panel
- ✅ All tabs render correctly
- ✅ Old UI still works perfectly
- ✅ No console errors

---

## 🎯 What You Just Built

You now have:

1. **The Golden Grid Layout**
   - Pane A: Navigation (240px)
   - Pane B: Main content (1200px max, centered)
   - Pane C: Utility sidebar (not yet used)

2. **Feature Flag System**
   - Safe toggling between UIs
   - No risk to existing functionality
   - Easy rollback if needed

3. **Foundation for Enhancement**
   - Ready to add GlobalHeader
   - Ready to add LiveBudgetTracker
   - Ready to add LogicAuditSidebar

---

## 🚀 Next Steps (After Quick Start)

### Phase 2.1: Add GlobalHeader to Academic Writing

**File:** `/components/ResearchFactoryApp.tsx`

**Modify the Academic Writing case:**

```typescript
case 'academic-writing':
  return (
    <>
      <GlobalHeader
        breadcrumbs={[
          { label: 'Academic Writing' }
        ]}
        autonomyMode="audit"
        onAutonomyChange={(mode) => console.log('Autonomy:', mode)}
        primaryAction={{
          label: 'Export Package',
          onClick: () => console.log('Export!'),
        }}
        secondaryActions={[
          {
            label: 'Run Logic Check',
            onClick: () => console.log('Logic check!'),
          }
        ]}
      />
      <AcademicWriting />
    </>
  );
```

**Import GlobalHeader:**

```typescript
import {
  WorkspaceShell,
  NavigationPanel,
  GlobalHeader, // 🆕 ADD THIS
  type NavigationTab,
} from './unified-workspace';
```

**Save, refresh, navigate to Academic Writing.**

You should now see the GlobalHeader with:
- Breadcrumbs on left
- Autonomy slider in center
- "Export Package" button on right

---

### Phase 2.2: Add LiveBudgetTracker

**File:** `/components/AcademicWriting.tsx`

**At the bottom of the render:**

```typescript
import { LiveBudgetTracker } from './unified-workspace';
import { JOURNAL_LIBRARY } from '../data/journalLibrary';
import { calculateManuscriptBudget } from '../utils/budgetCalculator';

export function AcademicWriting() {
  // ... existing code

  // 🆕 Calculate budget
  const budget = calculateManuscriptBudget(
    currentManuscript?.content || '',
    JOURNAL_LIBRARY[0] // Default to first journal (Lancet)
  );

  return (
    <>
      {/* ... existing editor ... */}
      
      {/* 🆕 Add budget tracker */}
      <LiveBudgetTracker 
        budget={budget}
        currentSection="introduction"
      />
    </>
  );
}
```

**Save, refresh, navigate to Academic Writing.**

You should now see a status bar at the bottom showing word counts!

---

### Phase 2.3: Add LogicAuditSidebar

**File:** `/components/ResearchFactoryApp.tsx`

**Add state for sidebar:**

```typescript
export function ResearchFactoryApp() {
  const { currentProject } = useProject();
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [logicAuditOpen, setLogicAuditOpen] = useState(false); // 🆕 ADD THIS

  return (
    <WorkspaceShell
      navigation={...}
      utilitySidebar={
        <LogicAuditSidebar
          isOpen={logicAuditOpen}
          onClose={() => setLogicAuditOpen(false)}
          mismatches={[]} // Empty for now
          onAutoFix={() => {}}
          onManualApprove={() => {}}
          onDismiss={() => {}}
          onViewInManuscript={() => {}}
        />
      }
      utilitySidebarOpen={logicAuditOpen}
      fullWidth={activeTab === 'dashboard'}
    >
      {renderScreen(activeTab, setLogicAuditOpen)} {/* Pass setter */}
    </WorkspaceShell>
  );
}

// Update Academic Writing case to open sidebar
case 'academic-writing':
  return (
    <>
      <GlobalHeader
        {...}
        secondaryActions={[
          {
            label: 'Run Logic Check',
            onClick: () => setLogicAuditOpen(true), // 🆕 OPEN SIDEBAR
          }
        ]}
      />
      <AcademicWriting />
    </>
  );
```

**Import LogicAuditSidebar:**

```typescript
import {
  WorkspaceShell,
  NavigationPanel,
  GlobalHeader,
  LogicAuditSidebar, // 🆕 ADD THIS
  type NavigationTab,
} from './unified-workspace';
```

**Save, refresh, click "Run Logic Check".**

The sidebar should slide in from the right!

---

## 🎉 Congratulations!

You've successfully integrated the Research Factory UI!

**What's working:**
- ✅ 3-pane layout (Golden Grid)
- ✅ Navigation panel
- ✅ GlobalHeader with actions
- ✅ LiveBudgetTracker with word counts
- ✅ LogicAuditSidebar (slides in)
- ✅ Feature flag for safe testing

**Next phases:**
- Build mismatch detection engine
- Add journal selector functionality
- Implement auto-sync logic
- Create export package generator

---

## 🚨 Troubleshooting

### Issue: Purple button doesn't appear

**Solution:**
- Check `process.env.NODE_ENV` is 'development'
- Make sure you saved App.tsx
- Hard refresh browser (Cmd+Shift+R)

### Issue: Navigation panel is blank

**Solution:**
- Verify `currentProject` exists (create a project first)
- Check console for errors
- Verify imports are correct

### Issue: Old UI breaks when toggling

**Solution:**
- Feature flag should completely isolate UIs
- Check that you wrapped ENTIRE existing UI in the `else` block
- Verify no shared state between UIs

### Issue: Screens don't render in new UI

**Solution:**
- Check import paths in ResearchFactoryApp.tsx
- Verify component names match exactly
- Check console for import errors

---

## 📞 Need Help?

Reference these files:
- `RESEARCH_FACTORY_ARCHITECTURE.md` - Complete specification
- `IMPLEMENTATION_ROADMAP.md` - Full phase breakdown
- `STATE_CHECKPOINT_PRE_UI_CHANGES.md` - Rollback instructions

**If stuck, toggle feature flag OFF and use old UI while debugging!**
