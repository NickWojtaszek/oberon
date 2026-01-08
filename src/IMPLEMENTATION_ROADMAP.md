# Research Factory Implementation Roadmap

**Status:** Phase 1 Complete ✅ | Ready for Phase 2 Integration  
**Date:** 2026-01-04

---

## 🎯 Overview

This roadmap guides the step-by-step transformation of the Clinical Intelligence Engine into the Research Factory - a high-integrity academic publishing system.

**Foundation built:** All core components, types, and utilities created.  
**Next step:** Integrate new UI with existing application using feature flags.

---

## ✅ Phase 1: Foundation (COMPLETE)

### Components Created

```
✅ /components/unified-workspace/
   ✅ WorkspaceShell.tsx          (3-pane layout)
   ✅ GlobalHeader.tsx            (action consolidation)
   ✅ NavigationPanel.tsx         (Pane A menu)
   ✅ LiveBudgetTracker.tsx       (word count bar)
   ✅ LogicAuditSidebar.tsx       (Pane C audit)
   ✅ index.ts                    (exports)
```

### Types Created

```
✅ /types/accountability.ts
   ✅ AutonomyMode
   ✅ JournalProfile
   ✅ VerifiedResult
   ✅ MismatchCard
   ✅ AuditSnapshot
   ✅ TracedSource
   ✅ DataLineageEntry
   ✅ ScientificReceipt
   ✅ ManuscriptWithAccountability
   ✅ ManuscriptBudget & BudgetStatus
```

### Data & Utilities

```
✅ /data/journalLibrary.ts
   ✅ 10 journal profiles (Lancet, NEJM, JAMA, JVS, etc.)
   ✅ Helper functions (getJournalById, searchJournals, etc.)

✅ /utils/budgetCalculator.ts
   ✅ countWords()
   ✅ extractSections()
   ✅ calculateBudgetStatus()
   ✅ countReferences()
   ✅ countFigures()
   ✅ countTables()
   ✅ calculateManuscriptBudget()
```

### Documentation

```
✅ RESEARCH_FACTORY_ARCHITECTURE.md  (Complete specification)
✅ IMPLEMENTATION_ROADMAP.md         (This file)
```

---

## 🚧 Phase 2: Integration (IN PROGRESS)

**Goal:** Integrate new UI into App.tsx with feature flag, preserving all existing functionality.

### Step 2.1: Add Feature Flag

**File:** `/App.tsx`

```typescript
// Add at top of App component
const [useResearchFactoryUI, setUseResearchFactoryUI] = useState(false);

// Optional: Add toggle in UI for testing
{process.env.NODE_ENV === 'development' && (
  <button 
    onClick={() => setUseResearchFactoryUI(!useResearchFactoryUI)}
    className="fixed bottom-4 right-4 px-4 py-2 bg-purple-600 text-white rounded-lg z-50"
  >
    {useResearchFactoryUI ? 'Old UI' : 'New UI'}
  </button>
)}
```

### Step 2.2: Create Conditional Rendering

**File:** `/App.tsx`

```typescript
return (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProjectProvider>
        {useResearchFactoryUI ? (
          // NEW: Research Factory UI
          <ResearchFactoryApp 
            activeScreen={activeScreen}
            onScreenChange={setActiveScreen}
          />
        ) : (
          // EXISTING: Current UI (preserved)
          <>
            <TopBar />
            {renderActiveScreen()}
            <ToastContainer />
          </>
        )}
      </ProjectProvider>
    </AuthProvider>
  </QueryClientProvider>
);
```

### Step 2.3: Create ResearchFactoryApp Component

**File:** `/components/ResearchFactoryApp.tsx` (NEW)

```typescript
import { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';
import {
  WorkspaceShell,
  GlobalHeader,
  NavigationPanel,
  type NavigationTab,
} from './unified-workspace';

export function ResearchFactoryApp() {
  const { currentProject } = useProject();
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [utilitySidebarOpen, setUtilitySidebarOpen] = useState(false);

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
      utilitySidebar={
        // Utility sidebar content (Logic Audit, etc.)
        null // Start with null, add later
      }
      utilitySidebarOpen={utilitySidebarOpen}
      fullWidth={isFullWidth}
    >
      {renderScreen(activeTab, setUtilitySidebarOpen)}
    </WorkspaceShell>
  );
}

function renderScreen(
  screen: NavigationTab,
  setUtilitySidebarOpen: (open: boolean) => void
) {
  // Map navigation tabs to existing screens
  switch (screen) {
    case 'dashboard':
      return <DashboardV2 onNavigate={(s) => console.log(s)} />;
    
    case 'protocol-workbench':
      return (
        <>
          <GlobalHeader
            breadcrumbs={[
              { label: 'Protocol Workbench' }
            ]}
            autonomyMode="audit"
            onAutonomyChange={() => {}}
          />
          <ProtocolWorkbenchCore />
        </>
      );
    
    case 'academic-writing':
      return <AcademicWritingWithResearchFactory 
        onOpenLogicAudit={() => setUtilitySidebarOpen(true)}
      />;
    
    // ... other screens
    
    default:
      return <div>Screen not implemented</div>;
  }
}
```

### Step 2.4: Test Feature Flag Toggle

**Checklist:**
- [ ] Toggle feature flag on
- [ ] Verify NavigationPanel appears (Pane A)
- [ ] Verify Main Stage is centered at 1200px (Pane B)
- [ ] Click each navigation item
- [ ] Verify screens render correctly
- [ ] Toggle feature flag off
- [ ] Verify old UI still works perfectly

---

## 🔜 Phase 3: Academic Writing Enhancement

**Goal:** Add Research Factory features to Academic Writing module.

### Step 3.1: Enhance Manuscript State

**File:** `/types/manuscript.ts`

```typescript
// Add new fields to existing ManuscriptManifest
export interface ManuscriptManifest {
  // ... existing fields
  
  // NEW: Accountability fields
  targetJournal?: string;
  autonomyMode?: AutonomyMode;
  currentAudit?: AuditSnapshot;
  auditHistory?: AuditSnapshot[];
  wordCounts?: {
    abstract: number;
    introduction: number;
    methods: number;
    results: number;
    discussion: number;
    overall: number;
  };
}
```

### Step 3.2: Create Enhanced Academic Writing Component

**File:** `/components/AcademicWritingEnhanced.tsx` (NEW)

```typescript
import { useState, useEffect } from 'react';
import { GlobalHeader } from './unified-workspace';
import { LiveBudgetTracker } from './unified-workspace';
import { ManuscriptEditor } from './academic-writing/ManuscriptEditor';
import { JOURNAL_LIBRARY } from '../data/journalLibrary';
import { calculateManuscriptBudget } from '../utils/budgetCalculator';

export function AcademicWritingEnhanced({ onOpenLogicAudit }: Props) {
  const [selectedJournal, setSelectedJournal] = useState(JOURNAL_LIBRARY[0]);
  const [autonomyMode, setAutonomyMode] = useState<AutonomyMode>('audit');
  const [manuscriptContent, setManuscriptContent] = useState('');
  
  // Calculate budget in real-time
  const budget = calculateManuscriptBudget(manuscriptContent, selectedJournal);
  
  return (
    <div className="relative">
      {/* Global Header */}
      <GlobalHeader
        breadcrumbs={[
          { label: 'Academic Writing' },
          { label: 'Draft Manuscript' }
        ]}
        selectedJournal={selectedJournal}
        onJournalChange={setSelectedJournal}
        journalOptions={JOURNAL_LIBRARY}
        autonomyMode={autonomyMode}
        onAutonomyChange={setAutonomyMode}
        primaryAction={{
          label: 'Export Package',
          onClick: handleExport,
        }}
        secondaryActions={[
          {
            label: 'Run Logic Check',
            onClick: onOpenLogicAudit,
          },
          {
            label: 'Save Draft',
            onClick: handleSave,
          }
        ]}
      />
      
      {/* Manuscript Editor */}
      <ManuscriptEditor
        content={manuscriptContent}
        onChange={setManuscriptContent}
      />
      
      {/* Live Budget Tracker */}
      <LiveBudgetTracker 
        budget={budget}
        currentSection="introduction"
      />
    </div>
  );
}
```

### Step 3.3: Test Journal Constraints

**Checklist:**
- [ ] Select "Lancet" from journal dropdown
- [ ] Type in editor, watch word count update
- [ ] Hit 90% of Introduction limit
- [ ] Verify status bar turns AMBER (warning)
- [ ] Exceed 100% of limit
- [ ] Verify status bar turns RED (exceeded)
- [ ] Switch to "PLOS ONE" (higher limit)
- [ ] Verify status bar turns GREEN

---

## 🔜 Phase 4: Logic Audit System

**Goal:** Build mismatch detection and auto-sync functionality.

### Step 4.1: Create Mismatch Detection Engine

**File:** `/utils/logicAuditEngine.ts` (NEW)

```typescript
import type { MismatchCard, VerifiedResult } from '../types/accountability';

export function detectMismatches(
  manuscriptContent: string,
  statisticalManifest: StatisticalManifest
): MismatchCard[] {
  const mismatches: MismatchCard[] = [];
  
  // Extract statistical claims from text
  const claims = extractStatisticalClaims(manuscriptContent);
  
  // Compare against manifest
  claims.forEach(claim => {
    const manifestValue = findManifestValue(claim, statisticalManifest);
    
    if (manifestValue && !valuesMatch(claim.value, manifestValue)) {
      mismatches.push({
        id: generateId(),
        severity: determineSeverity(claim, manifestValue),
        section: claim.section,
        lineNumber: claim.lineNumber,
        textClaim: claim.text,
        manifestValue: manifestValue,
        status: 'unresolved',
        sourceVariableId: manifestValue.var,
        protocolId: statisticalManifest.protocolId,
      });
    }
  });
  
  return mismatches;
}

function extractStatisticalClaims(text: string): Claim[] {
  // Regex patterns for percentages, p-values, N counts, etc.
  const patterns = [
    /(\d+\.?\d*)\s*%/g,           // Percentages
    /p\s*[=<>]\s*0\.\d+/gi,       // P-values
    /N\s*=\s*\d+/gi,              // Sample sizes
    /\d+\/\d+\s*\(\d+\.?\d*%\)/g, // Fractions with percentages
  ];
  
  // ... implementation
}
```

### Step 4.2: Add Auto-Sync Logic

**File:** `/utils/logicAuditEngine.ts`

```typescript
export function autoSyncMismatch(
  manuscriptContent: string,
  mismatch: MismatchCard
): string {
  // Find the incorrect value in text
  const incorrectValue = mismatch.textClaim;
  const correctValue = formatVerifiedResult(mismatch.manifestValue);
  
  // Replace with correct value
  const updatedContent = manuscriptContent.replace(
    incorrectValue,
    correctValue
  );
  
  return updatedContent;
}
```

### Step 4.3: Connect to UI

**File:** `/components/AcademicWritingEnhanced.tsx`

```typescript
const [mismatches, setMismatches] = useState<MismatchCard[]>([]);

const handleRunLogicCheck = () => {
  const detected = detectMismatches(manuscriptContent, statisticalManifest);
  setMismatches(detected);
  onOpenLogicAudit(true);
};

const handleAutoFix = (mismatchId: string) => {
  const mismatch = mismatches.find(m => m.id === mismatchId);
  if (!mismatch) return;
  
  const updatedContent = autoSyncMismatch(manuscriptContent, mismatch);
  setManuscriptContent(updatedContent);
  
  // Mark as resolved
  setMismatches(prev => prev.map(m =>
    m.id === mismatchId
      ? { ...m, status: 'auto-fixed', resolvedAt: new Date().toISOString() }
      : m
  ));
};
```

### Step 4.4: Test Logic Audit

**Checklist:**
- [ ] Write "Mortality was 9.7%" in manuscript
- [ ] Set Statistical Manifest to have mortality=6.7%
- [ ] Click "Run Logic Check"
- [ ] Verify LogicAuditSidebar slides in (Pane C)
- [ ] Verify mismatch card shows:
  - Your text: "9.7%"
  - Ground truth: "6.7%"
- [ ] Click "Auto-Sync"
- [ ] Verify manuscript updates to "6.7%"
- [ ] Verify card turns GREEN

---

## 🔜 Phase 5: Scientific Receipt Export

**Goal:** Generate complete verification package for PI sign-off.

### Step 5.1: Build Data Lineage Tracer

**File:** `/utils/dataLineageTracer.ts` (NEW)

```typescript
export function traceDataLineage(
  manuscript: ManuscriptManifest,
  protocol: SavedProtocol
): DataLineageEntry[] {
  const lineage: DataLineageEntry[] = [];
  
  // Extract all statistical claims
  const claims = extractStatisticalClaims(manuscript.content);
  
  // Trace each claim back to protocol variable
  claims.forEach(claim => {
    const sourceVariable = findProtocolVariable(claim, protocol);
    
    if (sourceVariable) {
      lineage.push({
        manuscriptClaim: claim.text,
        sectionLocation: claim.section,
        sourceVariable: {
          id: sourceVariable.id,
          label: sourceVariable.label,
          type: sourceVariable.type,
          protocolSection: sourceVariable.parentSection,
        },
        rawValue: sourceVariable.value,
        verified: true,
        verifiedAt: new Date().toISOString(),
      });
    }
  });
  
  return lineage;
}
```

### Step 5.2: Create Export Package Generator

**File:** `/utils/exportPackageGenerator.ts` (NEW)

```typescript
import JSZip from 'jszip';
import { Document, Packer, Paragraph } from 'docx';

export async function generateExportPackage(
  manuscript: ManuscriptManifest,
  protocol: SavedProtocol,
  auditSnapshot: AuditSnapshot
): Promise<Blob> {
  const zip = new JSZip();
  
  // 1. Generate .docx manuscript
  const docxBlob = await generateManuscriptDocx(manuscript);
  zip.file('manuscript.docx', docxBlob);
  
  // 2. Generate verification appendix PDF
  const appendixBlob = await generateVerificationAppendix(
    manuscript,
    protocol,
    auditSnapshot
  );
  zip.file('verification_appendix.pdf', appendixBlob);
  
  // 3. Add metadata JSON
  const metadata = {
    manuscriptId: manuscript.id,
    projectId: manuscript.projectId,
    exportedAt: new Date().toISOString(),
    auditSnapshot,
  };
  zip.file('metadata.json', JSON.stringify(metadata, null, 2));
  
  // Generate zip
  return await zip.generateAsync({ type: 'blob' });
}
```

### Step 5.3: Create Verification Appendix Template

**File:** `/utils/verificationAppendixGenerator.ts` (NEW)

```typescript
export async function generateVerificationAppendix(
  manuscript: ManuscriptManifest,
  protocol: SavedProtocol,
  auditSnapshot: AuditSnapshot
): Promise<Blob> {
  // Generate PDF with:
  // - Cover page with title
  // - Audit summary (verification rate, conflicts)
  // - Data lineage table
  // - PI sign-off block
  
  const dataLineage = traceDataLineage(manuscript, protocol);
  
  const doc = new Document({
    sections: [{
      children: [
        // Cover page
        new Paragraph({
          text: 'Scientific Verification Appendix',
          heading: 'Heading1',
        }),
        
        // Audit summary
        new Paragraph({
          text: `Verification Rate: ${auditSnapshot.verificationRate * 100}%`,
        }),
        
        // Data lineage table
        // ... table generation
        
        // PI sign-off
        new Paragraph({
          text: 'Principal Investigator Certification',
          heading: 'Heading2',
        }),
        new Paragraph({
          text: 'I certify that all statistical claims in this manuscript have been verified against the locked protocol version.',
        }),
        new Paragraph({
          text: 'Signature: ___________________________',
        }),
        new Paragraph({
          text: 'Date: ___________________________',
        }),
      ],
    }],
  });
  
  return await Packer.toBlob(doc);
}
```

### Step 5.4: Test Export Package

**Checklist:**
- [ ] Write complete manuscript with statistics
- [ ] Run logic check, resolve all conflicts
- [ ] Click "Export Package"
- [ ] Verify .zip downloads
- [ ] Extract zip, verify contains:
  - manuscript.docx
  - verification_appendix.pdf
  - metadata.json
- [ ] Open verification appendix
- [ ] Verify data lineage table is complete
- [ ] Verify PI sign-off block present

---

## 📊 Progress Tracking

### Component Completion

```
✅ WorkspaceShell          100%
✅ GlobalHeader            100%
✅ NavigationPanel         100%
✅ LiveBudgetTracker       100%
✅ LogicAuditSidebar       100%
⬜ ResearchFactoryApp        0%
⬜ AcademicWritingEnhanced   0%
⬜ Logic Audit Engine        0%
⬜ Export Package Generator  0%
```

### Feature Completion

```
✅ Phase 1: Foundation                    100%
⬜ Phase 2: Integration                     0%
⬜ Phase 3: Academic Writing Enhancement    0%
⬜ Phase 4: Logic Audit System              0%
⬜ Phase 5: Scientific Receipt Export       0%
```

### Overall Progress: 20%

---

## 🎯 Next Immediate Actions

### Developer Tasks (Priority Order)

1. **Add Feature Flag to App.tsx**
   - File: `/App.tsx`
   - Task: Add `useResearchFactoryUI` state
   - Time: 15 minutes

2. **Create ResearchFactoryApp Component**
   - File: `/components/ResearchFactoryApp.tsx`
   - Task: Basic shell with NavigationPanel
   - Time: 1 hour

3. **Test Feature Flag Toggle**
   - Task: Toggle between old/new UI
   - Verify no breaking changes
   - Time: 30 minutes

4. **Integrate Academic Writing**
   - File: `/components/AcademicWritingEnhanced.tsx`
   - Task: Add GlobalHeader + LiveBudgetTracker
   - Time: 2 hours

5. **Test Journal Constraints**
   - Task: Select different journals
   - Verify word count tracking
   - Time: 1 hour

**Total Time Estimate for Phase 2:** 5-6 hours

---

## 🚨 Risk Mitigation

### Risk 1: Breaking Existing Functionality

**Mitigation:**
- Feature flag allows instant rollback
- Old UI remains completely untouched
- All tests must pass with flag OFF before merging

### Risk 2: Performance Impact

**Mitigation:**
- Word count calculation debounced (500ms)
- Budget calculation only runs on content change
- Sidebar lazy-loaded, not rendered until opened

### Risk 3: Data Migration Issues

**Mitigation:**
- All new fields are optional
- Default values provided for missing fields
- Migration script validates before writing

---

## ✅ Definition of Done

### Phase 2 Complete When:

- [ ] Feature flag implemented in App.tsx
- [ ] ResearchFactoryApp component created
- [ ] All navigation tabs render correctly
- [ ] Focal point stays consistent (1200px centered)
- [ ] No console errors
- [ ] Old UI still works perfectly
- [ ] Academic Writing has GlobalHeader
- [ ] LiveBudgetTracker appears and updates
- [ ] Can toggle between old/new UI without data loss

### Phase 3 Complete When:

- [ ] Journal selector functional
- [ ] Word count updates in real-time
- [ ] Status bar color changes (green/amber/red)
- [ ] Autonomy slider functional
- [ ] Settings persist per manuscript

### Phase 4 Complete When:

- [ ] Logic check detects mismatches
- [ ] LogicAuditSidebar displays cards correctly
- [ ] Auto-sync replaces incorrect values
- [ ] Verification status tracked

### Phase 5 Complete When:

- [ ] Export generates .zip package
- [ ] Manuscript.docx properly formatted
- [ ] Verification appendix includes data lineage
- [ ] PI sign-off block present
- [ ] All files included in package

---

**Current Status:** ✅ Phase 1 Complete  
**Next Milestone:** Phase 2 Integration (ETA: 1 day)  
**Final Delivery:** All 5 Phases (ETA: 1-2 weeks)
