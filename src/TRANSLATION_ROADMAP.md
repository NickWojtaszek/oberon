# Clinical Intelligence Engine - Translation Roadmap

## Overview
This document maps all components requiring translation for the multi-language Clinical Intelligence Engine.

---

## ✅ COMPLETED PHASES

### Phase 1: UI Shell & Navigation (✅ Complete - 55 strings)
- [x] GlobalHeader.tsx - Autonomy slider, journal selector, export
- [x] NavigationPanel.tsx - All navigation items and descriptions
- [x] LanguageSwitcher.tsx - Language options

### Phase 2: Protocol Workbench Core (✅ Complete - 15 strings)
- [x] ProtocolWorkbenchCore.tsx - Toolbar buttons
- [x] VariableLibrary.tsx - Search and titles
- [x] SchemaEditor.tsx - Empty states

### Phase 2 Extended A: Settings Modal (✅ Complete - 28 strings)
- [x] SettingsModal.tsx - Full modal with all fields

### Phase 2 Extended B: Generator & Version Modals (✅ Complete - 13 strings)
- [x] VersionTagModal.tsx - Version tagging UI
- [x] SchemaGeneratorModal.tsx - AI schema generation

### Phase 3: Dependency & Validation Modals (✅ Complete - 22 strings)
- [x] DependencyModal.tsx - Dependency management UI (9 strings)
- [x] PrePublishValidationModal.tsx - Pre-publish validation (13 strings)

**Total Completed: 133 strings × 4 languages = 532 translations**

---

## 🔄 IN PROGRESS / PRIORITY QUEUE

### Phase 4: Protocol Workbench - Block Components (Priority: HIGH)
**Location:** `/components/protocol-workbench/components/blocks/`
- [ ] BlockToolbar.tsx (~12 strings)
  - Edit, duplicate, delete actions
  - Move up/down buttons
  - Version tag actions
- [ ] ConfigurationHUD.tsx (~8 strings)
  - Quick configuration panel
  - Data type indicators
- [ ] BlockBadges.tsx (~6 strings)
  - Status badges (primary, mapped, custom)
- [ ] SchemaBlockAdvanced.tsx (~15 strings)
  - Advanced block configuration

**Estimated: 41 strings × 4 languages = 164 translations**

---

### Phase 5: Protocol Library (Priority: HIGH)
**Location:** `/components/protocol-library/`
- [ ] ProtocolLibraryScreen.tsx (~30 strings)
  - Protocol grid/list views
  - Search and filters
  - Create new protocol
  - Sort options
- [ ] ProtocolCard.tsx (estimate ~15 strings)
  - Protocol metadata display
  - Status indicators
  - Actions menu

**Estimated: 45 strings × 4 languages = 180 translations**

---

### Phase 6: Project Library & Creation (Priority: HIGH)
**Location:** `/components/`
- [ ] ProjectLibraryScreen.tsx (~25 strings)
  - Project listing
  - Filters and search
  - Create project button
- [ ] ProjectCreationModal.tsx (~40 strings)
  - Project setup wizard
  - Study type selection
  - Team configuration
  - Methodology settings

**Estimated: 65 strings × 4 languages = 260 translations**

---

### Phase 7: AI Personas System (Priority: MEDIUM)
**Location:** `/components/ai-personas/`

#### 7A: Core UI
- [ ] PersonaLibrary.tsx (~20 strings)
  - Persona grid display
  - Filter by study type
  - Active/inactive states
- [ ] PersonaEditor.tsx (~35 strings)
  - Persona creation/editing form
  - Validation rules editor
  - Citation requirements

#### 7B: Analytics & Export
- [ ] analytics/* (~30 strings)
  - Validation results display
  - Score calculations
  - Trend analysis
- [ ] export/* (~15 strings)
  - Export options
  - Format selection
  - Group by options

**Estimated: 100 strings × 4 languages = 400 translations**

---

### Phase 8: Academic Writing Module (Priority: MEDIUM)
**Location:** `/components/academic-writing/`

#### 8A: Core Editor
- [ ] ManuscriptEditor.tsx (~40 strings)
  - Section management
  - Editor toolbar
  - Save/auto-save states
- [ ] ManuscriptTitle.tsx (~8 strings)
  - Title editing
  - Metadata fields
- [ ] SectionNavigator.tsx (~12 strings)
  - Section tree navigation
  - Add/remove sections

#### 8B: Citations & Sources
- [ ] BibliographyTab.tsx (~20 strings)
  - Citation list
  - Add/edit/delete citations
  - Citation styles
- [ ] SourceLibrary.tsx (~15 strings)
  - Source management
  - Import sources
- [ ] CitationChip.tsx + CitationChipInput.tsx (~10 strings)
  - Citation insertion UI

#### 8C: Journal & Export
- [ ] JournalProfileSelector.tsx (~15 strings)
  - Journal selection
  - Custom journal creation
  - Profile management
- [ ] ExportDialog.tsx (~20 strings)
  - Export format options
  - Include/exclude sections
  - Download options
- [ ] WordBudgetPanel.tsx (~10 strings)
  - Word count tracking
  - Section limits
  - Budget warnings

#### 8D: Advanced Features
- [ ] AuthorsSection.tsx (~15 strings)
  - Author management
  - Affiliations
  - Contributions
- [ ] StatisticalManifestViewer.tsx (~12 strings)
  - Statistical results display
- [ ] ResearchMultiplier.tsx (~8 strings)
  - AI multiplier controls
- [ ] SourceChat.tsx (~10 strings)
  - AI chat interface
- [ ] EvidenceCard.tsx (~8 strings)
  - Evidence display
- [ ] ReviewLayer.tsx (~10 strings)
  - Review comments UI

**Estimated: 213 strings × 4 languages = 852 translations**

---

### Phase 9: Database Module (Priority: MEDIUM)
**Location:** `/components/database/` & root components

#### 9A: Schema Management
- [ ] DatabaseSchemaGenerator.tsx (~25 strings)
  - Schema builder UI
  - Table/column creation
  - Data type selection
- [ ] DatabaseSchemaIndicator.tsx (~8 strings)
  - Schema status display

#### 9B: Data Management
- [ ] DataBrowser.tsx (~20 strings)
  - Record browsing
  - Filters and search
  - Pagination
- [ ] DataEntryForm.tsx (~15 strings)
  - Form fields
  - Validation messages
  - Save/cancel actions
- [ ] DataEntryField.tsx (~10 strings)
  - Field types
  - Help text
- [ ] DataImportExport.tsx (~25 strings)
  - Import wizard
  - Export options
  - Format selection
  - Validation results

**Estimated: 103 strings × 4 languages = 412 translations**

---

### Phase 10: Analytics Module (Priority: MEDIUM)
**Location:** `/components/` analytics files

- [ ] Analytics.tsx / AnalyticsApp.tsx (~35 strings)
  - Analytics dashboard
  - Chart types
  - Filter options
- [ ] AnalyticsStats.tsx (~15 strings)
  - Statistical summaries
  - Metric cards
- [ ] AnalysisPlanGenerator.tsx (~20 strings)
  - Analysis plan creation
  - Statistical method selection
- [ ] AnalysisPlanView.tsx (~15 strings)
  - Plan display
  - Edit/export options

**Estimated: 85 strings × 4 languages = 340 translations**

---

### Phase 11: Ethics & IRB Module (Priority: MEDIUM)
**Location:** `/components/ethics/` & `/components/ethics-board/`

- [ ] EthicsBoard.tsx (~30 strings)
  - IRB submission tracker
  - Approval workflow
  - Document management
- [ ] IRBSubmissionCard.tsx (~15 strings)
  - Submission details
  - Status badges
  - Actions menu
- [ ] DocumentUploadPanel.tsx (~12 strings)
  - File upload UI
  - Document types
  - Version management
- [ ] RegulatoryAssistant.tsx (~25 strings)
  - AI regulatory guidance
  - Citation display
  - Compliance checks
- [ ] AuditLogViewer.tsx (~15 strings)
  - Activity log display
  - Filter options
  - Export audit trail

**Estimated: 97 strings × 4 languages = 388 translations**

---

### Phase 12: Research Wizard & Methodology (Priority: LOW)
**Location:** `/components/unified-wizard/` & `/components/methodology/`

- [ ] ResearchWizard.tsx (~40 strings)
  - Step-by-step wizard
  - Navigation buttons
  - Progress indicators
- [ ] ProjectSetup.tsx (~35 strings)
  - Project configuration
  - Team setup
  - Settings
- [ ] Methodology components (~30 strings)
  - Methodology generation
  - Templates
  - Customization

**Estimated: 105 strings × 4 languages = 420 translations**

---

### Phase 13: Dashboard & Monitoring (Priority: LOW)
**Location:** `/components/` dashboard files

- [ ] Dashboard.tsx / DashboardV2.tsx (~40 strings)
  - Project overview
  - Recent activity
  - Quick actions
- [ ] PIDashboard.tsx (~20 strings)
  - PI-specific dashboard
  - Approval queue
- [ ] MethodologyStatusCard.tsx (~10 strings)
  - Status display
  - Progress indicators

**Estimated: 70 strings × 4 languages = 280 translations**

---

### Phase 14: Utility Components (Priority: LOW)
**Location:** `/components/` various utility files

- [ ] Toast.tsx (~10 strings)
  - Success/error messages
  - Action toasts
- [ ] ValidationErrorDisplay.tsx (~12 strings)
  - Error formatting
  - Validation feedback
- [ ] VersionConflictModal.tsx (~15 strings)
  - Conflict resolution UI
  - Merge options
- [ ] FieldChangeIndicator.tsx (~5 strings)
  - Change indicators
- [ ] StatusBadge.tsx (~8 strings)
  - Status labels
- [ ] ConfidenceBadge.tsx (~6 strings)
  - Confidence indicators

**Estimated: 56 strings × 4 languages = 224 translations**

---

## 📊 GRAND TOTAL ESTIMATE

| Phase | Status | Strings | Translations (×4 langs) |
|-------|--------|---------|------------------------|
| **Phases 1-2 (Complete)** | ✅ | 111 | 444 |
| **Phase 3** (Dependencies) | ✅ | 22 | 88 |
| **Phase 4** (Block Components) | 🔄 | 41 | 164 |
| **Phase 5** (Protocol Library) | 📋 | 45 | 180 |
| **Phase 6** (Project Library) | 📋 | 65 | 260 |
| **Phase 7** (AI Personas) | 📋 | 100 | 400 |
| **Phase 8** (Academic Writing) | 📋 | 213 | 852 |
| **Phase 9** (Database) | 📋 | 103 | 412 |
| **Phase 10** (Analytics) | 📋 | 85 | 340 |
| **Phase 11** (Ethics & IRB) | 📋 | 97 | 388 |
| **Phase 12** (Research Wizard) | 📋 | 105 | 420 |
| **Phase 13** (Dashboards) | 📋 | 70 | 280 |
| **Phase 14** (Utilities) | 📋 | 56 | 224 |
| **TOTAL** | — | **1,151** | **4,604** |

---

## 🎯 RECOMMENDED PRIORITY ORDER

### Immediate (Essential User Workflows)
1. **Phase 4** - Block Components (essential for schema building)
2. **Phase 5** - Protocol Library (protocol discovery and creation)
3. **Phase 6** - Project Library (project management)

### High Priority (Core Features)
4. **Phase 7** - AI Personas (validation and personas)
5. **Phase 8** - Academic Writing (manuscript authoring)

### Medium Priority (Advanced Features)
6. **Phase 9** - Database (data management)
7. **Phase 10** - Analytics (statistical analysis)
8. **Phase 11** - Ethics & IRB (regulatory compliance)

### Lower Priority (Supporting Features)
9. **Phase 12** - Research Wizard (guided setup)
10. **Phase 13** - Dashboards (overview screens)
11. **Phase 14** - Utilities (helper components)

---

## 📝 NOTES

- All estimates are conservative and may increase as we discover nested strings
- Some components may share translation keys (reduces total)
- Error messages and validation text add significant volume
- Some modules have sub-components not yet fully mapped
- Priority can be adjusted based on user feedback and usage patterns

**Last Updated:** Phase 3 Complete (133/1,151 strings = 11.5% complete)