# Protocol Builder - Complete Rebuild Plan

## 🎯 **GOAL: Restore ALL Original Functionality**

Rebuild the Protocol Workbench with comprehensive features using modular architecture (max 250 lines per file).

---

## 📋 **ORIGINAL FEATURES TO RESTORE**

### ✅ **Already Working (Phase 1 - COMPLETE)**
- [x] Variable Library with categories and search
- [x] Basic schema editor with drag-drop
- [x] Protocol document editor
- [x] Simple schema blocks
- [x] Tab switching
- [x] Save/load system

### 🔨 **TO REBUILD (Phases 2-7)**

#### **Phase 2: Enhanced Schema Blocks**
- [ ] Hover-activated Configuration HUD
- [ ] Role tags (Predictor/Outcome/Structure) with visual indicators
- [ ] Endpoint tier selection (Primary/Secondary/Exploratory)
- [ ] Analysis method selection
- [ ] Version tags with colors
- [ ] Mapping confidence indicators
- [ ] Primary endpoint markers
- [ ] CSV column mapping display

#### **Phase 3: Modal System**
- [ ] Settings Modal - Advanced configuration for each block
  - Data type settings
  - Units and ranges
  - Options for categorical
  - Clinical ranges
  - Custom configurations
- [ ] Dependency Modal - Logic Links system
  - Visual dependency graph
  - Conditional logic builder
  - Dependency warnings
- [ ] Schema Generator Modal - AI-powered schema creation
  - Template selection
  - Auto-populate from description
  - Therapeutic area presets
- [ ] Version Tag Modal - Tag management
  - Create/edit version tags
  - Color coding
  - Bulk tagging

#### **Phase 4: Validation & AI**
- [ ] Validation Sidebar
  - Real-time validation warnings
  - Semantic mismatch detection
  - Missing required fields
  - Circular dependency detection
  - Data type conflicts
- [ ] AI Suggestions Sidebar
  - Endpoint tier suggestions
  - Analysis method recommendations
  - Schema completion suggestions
  - Version tag suggestions
  - Accept/dismiss controls
- [ ] Audit Log Sidebar
  - Immutable change history
  - Locked knowledge sources
  - Compliance tracking
  - Export audit trail

#### **Phase 5: Advanced Data Types**
- [ ] Ranked Matrix Editor
  - Row/column configuration
  - Ranking constraints
  - Preview grid
- [ ] Categorical Grid Editor
  - Multi-category grids
  - Item configuration
  - Grid preview
- [ ] Conditional Logic Editor
  - Conditional variable setup
  - Parent-child relationships
  - Show/hide logic

#### **Phase 6: Enhanced State Management**
- [ ] useValidation hook - Validation logic
- [ ] useAISuggestions hook - AI suggestion management
- [ ] useAuditLog hook - Audit trail tracking
- [ ] useDependencies hook - Dependency graph
- [ ] useCSVMapping hook - CSV column mapping

#### **Phase 7: Integration & Polish**
- [ ] Toolbar with actions (Undo/Redo, Export, Import)
- [ ] Keyboard shortcuts
- [ ] Bulk operations
- [ ] Export to multiple formats (JSON, CSV, PDF)
- [ ] Import from templates
- [ ] Protocol comparison view
- [ ] Print-friendly view
- [ ] Collaboration indicators

---

## 🗂️ **FILE STRUCTURE (Target)**

```
/components/protocol-workbench/
├── ProtocolWorkbenchCore.tsx              (Main container - 200 lines)
├── index.tsx
│
├── components/
│   ├── index.ts
│   ├── VariableLibrary.tsx                ✅ (150 lines)
│   ├── SchemaEditor.tsx                   ✅ (110 lines)
│   ├── ProtocolDocument.tsx               ✅ (220 lines)
│   │
│   ├── blocks/
│   │   ├── SchemaBlockAdvanced.tsx        🔨 (200 lines)
│   │   ├── ConfigurationHUD.tsx           🔨 (150 lines)
│   │   ├── BlockToolbar.tsx               🔨 (80 lines)
│   │   └── BlockBadges.tsx                🔨 (100 lines)
│   │
│   ├── modals/
│   │   ├── SettingsModal.tsx              🔨 (200 lines)
│   │   ├── DependencyModal.tsx            🔨 (180 lines)
│   │   ├── SchemaGeneratorModal.tsx       🔨 (200 lines)
│   │   └── VersionTagModal.tsx            🔨 (100 lines)
│   │
│   ├── sidebars/
│   │   ├── ValidationSidebar.tsx          🔨 (200 lines)
│   │   ├── AISuggestionsSidebar.tsx       🔨 (200 lines)
│   │   └── AuditLogSidebar.tsx            🔨 (150 lines)
│   │
│   └── editors/
│       ├── RankedMatrixEditor.tsx         🔨 (150 lines)
│       ├── CategoricalGridEditor.tsx      🔨 (150 lines)
│       └── ConditionalLogicEditor.tsx     🔨 (150 lines)
│
├── hooks/
│   ├── index.ts
│   ├── useSchemaState.ts                  ✅ (130 lines)
│   ├── useProtocolState.ts                ✅ (80 lines)
│   ├── useVersionControl.ts               ✅ (100 lines)
│   ├── useValidation.ts                   🔨 (100 lines)
│   ├── useAISuggestions.ts                🔨 (100 lines)
│   ├── useAuditLog.ts                     🔨 (80 lines)
│   ├── useDependencies.ts                 🔨 (100 lines)
│   └── useCSVMapping.ts                   🔨 (80 lines)
│
├── types.ts                               ✅ (Updated)
├── constants.ts                           ✅ (Existing)
└── utils.ts                               ✅ (Existing)
```

**Total Files: ~35**  
**Average Size: ~150 lines**  
**Total Lines: ~5,000** (vs original 3,000+ in one file)

---

## 🔄 **IMPLEMENTATION PHASES**

### **Phase 2: Enhanced Schema Blocks** (4 files, ~530 lines)
1. SchemaBlockAdvanced.tsx - Full-featured block component
2. ConfigurationHUD.tsx - Hover-activated settings panel
3. BlockToolbar.tsx - Action buttons for blocks
4. BlockBadges.tsx - Visual indicators (version, role, etc.)

### **Phase 3: Modal System** (4 files, ~680 lines)
1. SettingsModal.tsx - Complete block configuration
2. DependencyModal.tsx - Logic links and dependencies
3. SchemaGeneratorModal.tsx - AI schema generation
4. VersionTagModal.tsx - Version management

### **Phase 4: Validation & AI** (3 files, ~550 lines)
1. ValidationSidebar.tsx - Real-time validation
2. AISuggestionsSidebar.tsx - AI recommendations
3. AuditLogSidebar.tsx - Compliance tracking

### **Phase 5: Advanced Data Types** (3 files, ~450 lines)
1. RankedMatrixEditor.tsx - Matrix configuration
2. CategoricalGridEditor.tsx - Grid setup
3. ConditionalLogicEditor.tsx - Conditional variables

### **Phase 6: Enhanced State** (5 files, ~460 lines)
1. useValidation.ts - Validation engine
2. useAISuggestions.ts - Suggestion management
3. useAuditLog.ts - Audit tracking
4. useDependencies.ts - Dependency graph
5. useCSVMapping.ts - CSV integration

### **Phase 7: Integration** (Updates to existing files)
1. Update ProtocolWorkbenchCore.tsx
2. Add toolbar components
3. Wire all hooks and components
4. Add keyboard shortcuts

---

## 🎯 **SUCCESS CRITERIA**

- ✅ No file exceeds 250 lines
- ✅ All original features restored
- ✅ Type-safe TypeScript throughout
- ✅ Full drag-and-drop support
- ✅ Real-time validation
- ✅ AI suggestions working
- ✅ Audit trail complete
- ✅ Export/import functionality
- ✅ No crashes or errors
- ✅ Professional UI matching design system

---

## ⏱️ **ESTIMATED TIMELINE**

- Phase 2: ~15 minutes
- Phase 3: ~20 minutes
- Phase 4: ~15 minutes
- Phase 5: ~10 minutes
- Phase 6: ~10 minutes
- Phase 7: ~10 minutes

**Total: ~80 minutes of implementation**

---

## 🚀 **READY TO BEGIN**

Awaiting approval to start Phase 2...
