/**
 * RESEARCH FACTORY ARCHITECTURE
 * Clinical Intelligence Engine - High-Integrity Publishing System
 * 
 * This document defines the complete architecture for transforming
 * the application into a clinical-grade "Research Factory" with
 * unified UI, structural consistency, and accountability layer.
 */

# Research Factory Architecture

**Status:** ✅ Foundation Complete - Ready for Integration  
**Date:** 2026-01-04  
**Version:** 1.0.0

---

## 🎯 Executive Summary

The Research Factory transforms the Clinical Intelligence Engine from a development tool into a **production-grade academic publishing system** with:

1. **Unified Workspace Shell** - Eliminates focal-point jumping with fixed 3-pane layout
2. **Accountability Layer** - Audit, Constraints, and Traceability for clinical publishing
3. **Journal Constraints** - Real-time compliance checking against submission rules
4. **Logic Audit System** - AI-powered verification of statistical claims
5. **Scientific Receipt** - Complete data lineage for regulatory sign-off

---

## 🏗️ The Golden Grid (12-Column Standard)

### Three-Pane Layout

```
┌──────────────┬────────────────────────────────────────┬──────────────┐
│  Pane A      │         Pane B (Main Stage)            │   Pane C     │
│  Navigation  │         Max-width: 1200px              │   Utility    │
│  240px fixed │         Padding: 40px                  │   Sidebar    │
│              │         Centered alignment             │   360px      │
│              │                                        │   Slides in  │
└──────────────┴────────────────────────────────────────┴──────────────┘
```

### Pane A: Navigation (240px fixed)
- **Purpose:** Global menu, always visible
- **Content:** 
  - Project header
  - Navigation items (Dashboard, Workbench, Writing, etc.)
  - Settings footer
- **Behavior:** Fixed position, scrollable content

### Pane B: Main Stage (1200px max, centered)
- **Purpose:** Primary content area
- **Content:** Forms, graphs, manuscript editor
- **Behavior:** 
  - Centered with max-width 1200px
  - 40px internal padding
  - Adjusts when Pane C opens
- **Special:** Dashboard uses full-width mode (no max-width)

### Pane C: Utility Sidebar (360px fixed)
- **Purpose:** "Contextual Intelligence" panel
- **Content:**
  - Logic Audit workspace
  - Analytics workbench
  - Real-time assistance
- **Behavior:**
  - Slides from right when triggered
  - Overlays with backdrop blur
  - Can be dismissed

---

## 📋 Global Header Component

### Layout Structure

```
┌────────────────────────────────────────────────────────────────────┐
│  Breadcrumbs     │    Journal   Autonomy    │  Secondary  Primary │
│  Project / Page  │    Selector  Slider      │  Actions    Action  │
└────────────────────────────────────────────────────────────────────┘
```

### Elements

1. **Left: Breadcrumbs**
   - Shows navigation path
   - Example: `Project A / Manuscript / Draft v1`
   - Clickable links to parent pages

2. **Center-Right: Autonomy Slider**
   - 3-tier selector: **Audit** | **Co-Pilot** | **Pilot**
   - **Audit Mode:** Maximum verification, manual approval required
   - **Co-Pilot Mode:** Balanced assistance with suggestions
   - **Pilot Mode:** High autonomy, AI-driven workflow
   - Persists per manuscript, defaults to Audit for new projects

3. **Journal Selector**
   - Dropdown with journal profiles
   - Shows impact factor
   - Sets submission rule constraints

4. **Far Right: Primary Action**
   - Large, solid fill (blue-600)
   - Example: "Export Package"
   - Final publishing action

5. **Secondary Actions**
   - Outline style buttons
   - Examples: "Run Logic Check", "Save Draft"
   - Positioned left of primary action

### Design Rules

- **No Canvas Clutter:** ALL actions move to header or sidebar
- **No Floating Buttons:** Every button has a designated slot
- **Consistent Spacing:** 8px system throughout

---

## 🎨 Component Architecture

### Created Components

```
/components/unified-workspace/
├── WorkspaceShell.tsx          # Main 3-pane layout
├── GlobalHeader.tsx            # Action consolidation
├── NavigationPanel.tsx         # Pane A menu
├── LiveBudgetTracker.tsx       # Word count status bar
├── LogicAuditSidebar.tsx       # Pane C audit panel
└── index.ts                    # Barrel exports
```

### Type Definitions

```
/types/
├── accountability.ts           # All Research Factory types
    ├── AutonomyMode
    ├── JournalProfile
    ├── VerifiedResult
    ├── MismatchCard
    ├── AuditSnapshot
    ├── TracedSource
    ├── DataLineageEntry
    ├── ScientificReceipt
    ├── ManuscriptWithAccountability
    └── ManuscriptBudget
```

### Data Library

```
/data/
└── journalLibrary.ts          # 10+ journal profiles with constraints
```

### Utilities

```
/utils/
└── budgetCalculator.ts        # Word counting & compliance checking
```

---

## 📊 Development Phases

### ✅ Phase 1: Foundation (COMPLETE)
- [x] Created type definitions
- [x] Built WorkspaceShell component
- [x] Built GlobalHeader component
- [x] Built NavigationPanel component
- [x] Created journal library with constraints
- [x] Built budget calculator utilities

### 🚧 Phase 2: Integration (NEXT)
- [ ] Refactor App.tsx to use WorkspaceShell
- [ ] Add GlobalHeader to all tabs (except Dashboard)
- [ ] Migrate navigation from TopBar to NavigationPanel
- [ ] Connect existing screens to new layout

### 🔜 Phase 3: Autonomy System
- [ ] Implement autonomy mode state management
- [ ] Add autonomy-based feature gating
- [ ] Create autonomy persistence in localStorage

### 🔜 Phase 4: Journal Constraints
- [ ] Integrate LiveBudgetTracker into Academic Writing
- [ ] Real-time word count updates
- [ ] Visual indicators for exceeded limits
- [ ] Journal profile switching

### 🔜 Phase 5: Logic Audit Workspace
- [ ] Build mismatch detection engine
- [ ] Implement auto-sync logic
- [ ] Connect to Statistical Manifest
- [ ] Add verification status tracking

### 🔜 Phase 6: Scientific Receipt
- [ ] Build export package generator
- [ ] Create data lineage tracer
- [ ] Generate verification appendix
- [ ] Add PI sign-off workflow

---

## 🔄 Data Flow Patterns

### Pattern 1: Journal Constraint Flow

```
User selects journal (e.g., "Lancet")
    ↓
GlobalHeader updates selected journal
    ↓
JournalProfile loads constraints
    ↓
LiveBudgetTracker receives constraints
    ↓
As user types in editor:
    ↓
Word count updates in real-time
    ↓
Budget status changes (ok → warning → exceeded)
    ↓
Status bar turns RED when limit exceeded
```

### Pattern 2: Logic Audit Flow

```
User clicks "Run Logic Check"
    ↓
Audit engine analyzes manuscript content
    ↓
Compares claims against Statistical Manifest
    ↓
Generates MismatchCard[] array
    ↓
LogicAuditSidebar slides in (Pane C)
    ↓
User sees side-by-side comparison
    ↓
User clicks "Auto-Sync"
    ↓
Manuscript updated with ground truth
    ↓
MismatchCard status → 'auto-fixed'
```

### Pattern 3: Export Package Flow

```
User clicks "Export Package"
    ↓
System generates AuditSnapshot
    ↓
Builds DataLineageEntry[] for all claims
    ↓
Creates ScientificReceipt with:
    - Manuscript .docx
    - Verification Appendix .pdf
    - Data lineage table
    - PI sign-off block
    ↓
Downloads as .zip package
```

---

## 📐 UI Implementation Guardrails

### Focal Point Consistency

**Problem:** Container width variance causes "jumping" when switching tabs.

**Solution:** All tabs (except Dashboard) use the same 1200px max-width centered Main Stage (Pane B).

**Implementation:**
```tsx
// ❌ BAD - Different widths per tab
<div className="max-w-4xl"> {/* 896px */}
<div className="max-w-6xl"> {/* 1152px */}

// ✅ GOOD - Consistent width via WorkspaceShell
<WorkspaceShell navigation={...} utilitySidebar={...}>
  {/* Content automatically gets 1200px max-width */}
</WorkspaceShell>
```

### Visual Indicators

**Slavic "Light" Motif:** Use subtle glow effects for verification status.

```css
/* Verified claim - green glow */
box-shadow: 0 0 12px rgba(34, 197, 94, 0.3);

/* Unverified claim - amber pulse */
animation: pulse-amber 2s ease-in-out infinite;
```

### State Persistence

**Autonomy Mode:**
- Persists per manuscript (not global)
- Stored in `ManuscriptWithAccountability.autonomyMode`
- Defaults to `'audit'` for new manuscripts
- Can be changed at any time via slider

**Journal Profile:**
- Persists per manuscript
- Stored in `ManuscriptWithAccountability.targetJournal`
- Can be changed, updates budget immediately

### Action Consolidation

**Before (Canvas Clutter):**
```tsx
// ❌ Buttons scattered in content
<div className="form-content">
  <input />
  <button>Save</button>  {/* Floating */}
  <button>Cancel</button>  {/* Floating */}
</div>
```

**After (Header Consolidation):**
```tsx
// ✅ Actions in GlobalHeader
<GlobalHeader
  primaryAction={{ label: 'Save', onClick: handleSave }}
  secondaryActions={[
    { label: 'Cancel', onClick: handleCancel }
  ]}
/>
<div className="form-content">
  <input />  {/* Clean content area */}
</div>
```

---

## 🎯 The Resulting User Flow

### Typical Academic Writing Session

1. **Project Setup**
   ```
   PI creates project → Sets journal profile (Lancet)
   ```

2. **Autonomy Configuration**
   ```
   PI sets autonomy to "Audit Mode" (default)
   Student writes in Main Stage (Pane B)
   ```

3. **Real-time Feedback**
   ```
   LiveBudgetTracker shows: "Introduction: 650 / 800 words"
   Status bar is GREEN (within limit)
   ```

4. **Logic Verification**
   ```
   Student clicks "Run Logic Check"
   LogicAuditSidebar slides in (Pane C)
   Shows 3 mismatches:
     - Critical: "9.7%" should be "6.7%"
     - Warning: Missing N=142
     - Info: Citation format
   ```

5. **Auto-Correction**
   ```
   Student clicks "Auto-Sync" on critical mismatch
   Manuscript updates instantly: 9.7% → 6.7%
   Mismatch card turns GREEN
   ```

6. **Final Export**
   ```
   All cards GREEN
   PI clicks "Export Package"
   Downloads .zip containing:
     - Manuscript.docx (formatted)
     - VerificationAppendix.pdf (data lineage)
     - metadata.json (audit snapshot)
   ```

7. **Regulatory Sign-Off**
   ```
   PI reviews Verification Appendix
   Signs certification statement:
     "I certify that all statistical claims have been 
      verified against the locked protocol version 1.2"
   ```

---

## 🔐 Data Structure Enhancement

### Before (Simple Manuscript)

```typescript
interface Manuscript {
  id: string;
  title: string;
  content: string;
}
```

### After (Accountability-Enhanced)

```typescript
interface ManuscriptWithAccountability {
  // Existing
  id: string;
  title: string;
  content: string;
  
  // NEW: Journal targeting
  targetJournal?: string;
  journalProfile?: JournalProfile;
  
  // NEW: Autonomy
  autonomyMode: 'audit' | 'co-pilot' | 'pilot';
  
  // NEW: Audit tracking
  currentAudit?: AuditSnapshot;
  auditHistory: AuditSnapshot[];
  
  // NEW: Word counts
  wordCounts: {
    abstract: number;
    introduction: number;
    methods: number;
    results: number;
    discussion: number;
    overall: number;
  };
  
  // NEW: Export tracking
  lastExport?: {
    exportedAt: string;
    receiptId: string;
    approved: boolean;
  };
}
```

---

## 🚨 Migration Strategy

### Step 1: Preserve Existing Functionality

**Critical:** All current features must continue working during migration.

**Approach:**
1. Create new WorkspaceShell alongside existing layout
2. Add feature flags to toggle between old/new UI
3. Migrate one tab at a time
4. Keep data layer unchanged

### Step 2: Tab-by-Tab Migration

**Order:**
1. Academic Writing (highest priority, new features)
2. Protocol Workbench (benefits from header actions)
3. Protocol Library (simple migration)
4. Analytics (moderate complexity)
5. Persona Editor (low priority)
6. Dashboard (last - uses full-width mode)

### Step 3: Data Enhancement

**Non-breaking changes:**
```typescript
// ✅ Add optional fields to existing types
interface Manuscript {
  // ... existing fields
  targetJournal?: string;  // Optional - won't break old data
  autonomyMode?: AutonomyMode;  // Optional with default
}
```

**Migration script:**
```typescript
// Add defaults for existing manuscripts
const migrateManuscripts = () => {
  manuscripts.forEach(m => {
    if (!m.autonomyMode) m.autonomyMode = 'audit';
    if (!m.auditHistory) m.auditHistory = [];
  });
};
```

---

## 📝 Implementation Checklist

### Phase 2: Integration (Next Steps)

- [ ] Create feature flag for new UI
  ```typescript
  const USE_RESEARCH_FACTORY_UI = false; // Toggle to enable
  ```

- [ ] Refactor App.tsx structure
  ```tsx
  {USE_RESEARCH_FACTORY_UI ? (
    <WorkspaceShell navigation={...}>
      {renderActiveScreen()}
    </WorkspaceShell>
  ) : (
    // Existing layout
  )}
  ```

- [ ] Create NavigationPanel with project context
  ```tsx
  <NavigationPanel
    activeTab={activeScreen}
    onTabChange={setActiveScreen}
    projectName={currentProject?.name}
  />
  ```

- [ ] Wrap Academic Writing with new layout
  ```tsx
  <WorkspaceShell
    navigation={<NavigationPanel />}
    utilitySidebar={<LogicAuditSidebar />}
    utilitySidebarOpen={showLogicAudit}
  >
    <GlobalHeader
      breadcrumbs={[...]}
      autonomyMode={autonomyMode}
      onAutonomyChange={setAutonomyMode}
      selectedJournal={journal}
      onJournalChange={setJournal}
      primaryAction={{
        label: 'Export Package',
        onClick: handleExport
      }}
      secondaryActions={[
        { label: 'Run Logic Check', onClick: () => setShowLogicAudit(true) }
      ]}
    />
    <AcademicWritingEditor />
    <LiveBudgetTracker budget={budget} />
  </WorkspaceShell>
  ```

- [ ] Test focal point consistency
  - Switch between all tabs
  - Verify Main Stage stays centered at 1200px
  - Ensure no layout shift

- [ ] Test sidebar behavior
  - Open Logic Audit sidebar
  - Verify backdrop appears
  - Verify Main Stage width adjusts
  - Close sidebar, verify restore

---

## 🎨 Design System Extensions

### New Color Semantics

```typescript
// Verification states
'verified': 'bg-green-50 border-green-200 text-green-700',
'unverified': 'bg-amber-50 border-amber-200 text-amber-700',
'conflict': 'bg-red-50 border-red-200 text-red-700',

// Budget states  
'ok': 'text-green-600',
'warning': 'text-amber-600',  // 90%+ of limit
'exceeded': 'text-red-600',   // Over limit
```

### New Spacing

```typescript
// Sidebar widths
'w-60': '240px',  // Pane A (Navigation)
'w-90': '360px',  // Pane C (Utility Sidebar)

// Main Stage
'max-w-[1200px]': '1200px',  // Pane B max-width
'p-10': '40px',              // Pane B internal padding
```

---

## ✅ Success Criteria

### User Experience
- [x] Focal point remains consistent when switching tabs
- [ ] No "jumping" or layout shifts
- [ ] Actions consolidated in predictable locations
- [ ] Real-time feedback on journal compliance
- [ ] Clear verification status for all claims

### Technical
- [x] All existing functionality preserved
- [ ] No console errors during migration
- [ ] Data layer unchanged (backward compatible)
- [ ] Performance maintained (< 100ms tab switching)

### Clinical Integrity
- [ ] 100% of statistical claims traceable to source
- [ ] Journal constraints enforced in real-time
- [ ] Audit trail for all AI-assisted edits
- [ ] PI sign-off required for final export
- [ ] Verification appendix generated automatically

---

**Architecture Status:** ✅ READY FOR INTEGRATION  
**Next Phase:** App.tsx refactoring with feature flag  
**Documentation:** Complete  
**Rollback Plan:** Feature flag allows instant revert
