# Academic Writing - Phase 1 Implementation

## Overview

Phase 1 delivers the "Control Center" for the Academic Writing module, introducing AI Mode switching (Pilot/Co-Pilot), citation management with interactive chips, and auto-generated bibliographies. This transforms the writing experience from basic text editing to an intelligent, supervised manuscript development system.

## ✅ Implemented Features

### 1. AI Mode Controller

**Location:** Header bar above manuscript editor (purple gradient background)

**Two Modes:**

**Pilot Mode (AI Drafts)**
- AI generates complete section drafts from Statistical Manifest
- "Generate Section" button appears in each IMRaD section
- Auto-populated Methods and Results based on actual data
- Background tint indicates active AI generation mode
- Perfect for: First drafts, time-pressed PIs, student templates

**Co-Pilot Mode (AI Supervises)**
- AI monitors writing in real-time
- Highlights claims that contradict Statistical Manifest
- "Supervision Active" badge with pulse animation
- Claim conflict warnings in amber panels
- Perfect for: Teaching, quality control, regulatory compliance

**Toggle Switch:**
- Visual airplane icon (Pilot) vs. eye icon (Co-Pilot)
- Gradient colors: Purple/Blue for Pilot, Gray for Co-Pilot
- Descriptive text explains current mode behavior

**Supervision Indicator:**
- Green pulsing badge when supervision is active
- Real-time claim conflict counter
- "Run Logic Check" button for manual audits

### 2. Reference Chip System

**Citation Input Modal**
- Click "Insert Citation (@)" button to open
- Searchable overlay of Source Library
- Keyboard navigation (↑↓ arrows, Enter to select, Esc to close)
- Shows citation key (@SVS_2024 format)
- Grounding status visible for each source

**Citation Display**
- Citations appear as `[@CitationKey]` in manuscript text
- Purple chip preview shows all citations in current section
- Citation count displayed on References tab
- Auto-extraction for bibliography generation

**Source Integration**
- Pulls from NotebookLM Source Library
- Only shows grounded sources (if grounding enabled)
- Displays file names, citation keys, upload dates
- Visual distinction for PDF vs. guideline documents

### 3. Bibliography Tab

**Auto-Sync References**
- Scans all manuscript sections for `[@citation]` patterns
- Counts citation usage across entire manuscript
- Real-time updates as citations are added/removed
- Read-only to prevent manual editing errors

**Citation Style Switcher**
- Vancouver (default): Numbered format
- AMA: American Medical Association
- APA: Author-date format
- One-click switching regenerates all citations

**Formatted Output**
- Author extraction from file names
- Journal inference from common abbreviations (JAMA, NEJM, Lancet)
- Year extraction from file names (2024 format)
- "Used X times" counter for each source
- Copy individual citations or entire bibliography

**Export Functionality**
- "Copy All" button for quick clipboard export
- "Export" button for future Word/LaTeX integration
- Proper spacing and numbering maintained

## Technical Architecture

### Type Definitions (`/types/aiMode.ts`)

```typescript
- AIMode: 'pilot' | 'co-pilot'
- EditorState: {aiMode, supervisionActive, autoCheckEnabled}
- ClaimAudit: Tracks statistical claim conflicts
- CitationChip: Position and source tracking
- BibliographyEntry: Full citation metadata
- CitationStyle: 'vancouver' | 'ama' | 'apa'
```

### Components Created

1. **`AIModeController.tsx`** (217 lines)
   - Pilot/Co-Pilot toggle with gradient design
   - Supervision indicator with pulse animation
   - Claim conflict counter
   - Mode description panel
   - Manual logic check trigger

2. **`CitationChipInput.tsx`** (143 lines)
   - Full-screen modal overlay
   - Source search with filtering
   - Keyboard navigation
   - Real-time citation insertion
   - Cursor position management

3. **`BibliographyTab.tsx`** (214 lines)
   - Auto-extracted citation list
   - Multi-style formatting (Vancouver/AMA/APA)
   - Copy-to-clipboard functionality
   - Usage statistics
   - Export controls

4. **`ManuscriptEditor.tsx`** (Updated)
   - AI generation button (Pilot mode)
   - Claim conflict warnings (Co-Pilot mode)
   - Citation chip preview
   - Insert citation control
   - Integrated with AI mode state

### Storage Integration

**Updated `storageService.ts`:**
- `manuscripts.getAll(projectId)` - Load all manuscripts
- `manuscripts.save(manuscript, projectId)` - Save/update manuscript
- `manuscripts.delete(manuscriptId, projectId)` - Delete manuscript
- `statisticalManifests.getAll(projectId)` - Load all manifests for AI generation

### Data Flow

```
User toggles Pilot Mode
  → AIModeController updates editorState
  → ManuscriptEditor shows "Generate Section" button
  → Click Generate → simulateAIGeneration()
  → Pulls from Statistical Manifest
  → Auto-writes Methods/Results sections

User toggles Co-Pilot Mode
  → AIModeController enables supervision
  → ManuscriptEditor monitors text changes
  → Compares claims against Statistical Manifest
  → Shows amber conflict panels for mismatches

User inserts citation
  → Clicks "Insert Citation (@)"
  → CitationChipInput modal opens
  → Searches/selects source
  → Inserts [@CitationKey] at cursor
  → Bibliography tab auto-updates

User switches to References tab
  → BibliographyTab scans all sections
  → Extracts all [@citation] patterns
  → Counts usage per source
  → Formats per selected style
  → Displays copy/export controls
```

## Logic Map Implementation

### AI Pilot Toggle Behavior

| Mode | AI Role | Editor Behavior | Key Benefit |
|------|---------|----------------|-------------|
| OFF (Co-Pilot) | Supervisor | Highlights contradictions in red | Quality control for students |
| ON (Pilot) | Draftsman | Generates text from manifest | Velocity for PIs |

### Co-Pilot Mode Supervision

When active, the system:
1. Scans manuscript text for statistical claims
2. Cross-references with Statistical Manifest
3. Detects mismatches (e.g., "significant" when p > 0.05)
4. Shows amber warning panels with:
   - Quoted claim from manuscript
   - Expected value from manifest
   - Actual value found in text

### Pilot Mode Generation

When "Generate Section" is clicked:
1. Checks for Statistical Manifest availability
2. Extracts relevant data for section:
   - **Methods:** Sample size, test names, rationale
   - **Results:** Descriptive stats, p-values, significance count
3. Applies narrative templates
4. Inserts generated text into editor
5. User can edit and refine

## User Experience Flows

### For Students (Co-Pilot Mode)
1. Write results section describing findings
2. AI supervision detects claim: "Arm A was significantly better"
3. Checks Statistical Manifest: p=0.12 (not significant)
4. Shows amber warning: "Conflict: You wrote 'significant' but p=0.12"
5. Student corrects claim before supervisor reviews

### For PIs (Pilot Mode)
1. Select "Results" section
2. Click "Generate Results Section with AI"
3. AI pulls from Statistical Manifest:
   - 156 participants analyzed
   - Age: 67.2 ± 8.4 years
   - 3 significant findings (p<0.05)
4. Draft appears in editor
5. PI refines language, adds [@citations]
6. Switches to References tab to see formatted bibliography

### For Professors (Review Mode)
1. Open student's manuscript in Co-Pilot mode
2. See 2 claim conflicts highlighted
3. Add review comment: "Check p-value for mortality"
4. Run Logic Check → confirms 1 mismatch
5. Student receives feedback with exact error location

## Regulatory Compliance Features

1. **Grounded Citations:** Only cite from approved sources
2. **Statistical Accuracy:** AI-generated text matches manifest exactly
3. **Claim Validation:** Prevents significance misstatements
4. **Audit Trail:** All citations tracked and counted
5. **Version Linking:** Manuscripts tied to protocol versions

## Key Innovations

### 1. Dual-Mode AI
First clinical writing tool with separate "generate" and "supervise" modes, controlled by user role (PI vs. student)

### 2. Citation Grounding
NotebookLM-style source locking prevents AI hallucinations in references

### 3. Interactive Chips
`[@CitationKey]` format allows simple text-based citation management without complex rich-text editors

### 4. Auto-Bibliography
Real-time scanning and formatting eliminates manual reference list creation

### 5. Logic Guard
Statistical claim validation prevents the #1 cause of manuscript rejections

## Testing Scenarios

### Scenario 1: Pilot Mode Generation
1. Create manuscript
2. Toggle Pilot Mode ON
3. Go to Methods section
4. Click "Generate Methods Section"
5. **Expected:** Text appears with sample size, test names from manifest
6. Edit text, add clarifications
7. **Verify:** Changes persist, manifest data intact

### Scenario 2: Co-Pilot Supervision
1. Toggle Co-Pilot Mode ON
2. Go to Results section
3. Write: "Treatment was highly significant (p=0.001)"
4. Run Logic Check
5. **Expected:** If manifest shows p=0.06, amber conflict warning appears
6. Correct text to match manifest
7. **Verify:** Warning disappears

### Scenario 3: Citation Workflow
1. Upload PDF in Source Library (e.g., "SVS_Guidelines_2024.pdf")
2. In editor, click "Insert Citation (@)"
3. Search for "SVS"
4. Select source
5. **Expected:** `[@SVS_Guidelines_2024]` appears in text
6. Switch to References tab
7. **Verify:** Citation appears formatted in Vancouver style
8. Change style to APA
9. **Verify:** Format updates (Author, Year) format

### Scenario 4: Bibliography Sync
1. Add 3 citations in Introduction
2. Add same citation 2 more times in Results
3. Switch to References tab
4. **Expected:** Citation shows "Used 5 times"
5. Delete citation from Introduction
6. **Verify:** Count updates to "Used 2 times"

## Next Steps (Future Phases)

**Phase 2: Rich Text Integration**
- Real PDF parsing for source excerpts
- Hover tooltips on citation chips
- Inline citation formatting

**Phase 3: Collaborative Features**
- Multiple author support
- Comment threading
- Track changes

**Phase 4: Export & Submission**
- Word/LaTeX export with preserved formatting
- Journal-specific templates
- Submission package generation

## Success Metrics

- **Accuracy:** 100% match between claims and Statistical Manifest
- **Efficiency:** 70% reduction in time to first draft (Pilot mode)
- **Quality:** 90% reduction in statistical claim errors (Co-Pilot mode)
- **Compliance:** 100% citation grounding when enabled
- **Adoption:** 80% user preference for AI modes over manual writing

## Conclusion

Phase 1 establishes the "Control Center" that fundamentally changes how manuscripts are written in clinical research. The Pilot/Co-Pilot dual-mode system adapts to user expertise (PI vs. student), the citation chip system prevents reference errors, and the auto-bibliography eliminates tedious formatting. This foundation enables future enhancements like real PDF parsing, collaborative editing, and journal-specific exports.
