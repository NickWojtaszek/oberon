# 🌍 Translation Audit & Implementation Roadmap

## Executive Summary

**Current State:**
- ✅ i18n infrastructure: Fully configured (react-i18next)
- ✅ Translation files: 16 files (en, pl, es, zh) × 4 namespaces
- ✅ Language switcher: Working (GlobalHeader + PersonaManager)
- ❌ Component integration: **0% translated** (all hardcoded English)

**Goal:** Translate entire Clinical Intelligence Engine to 4 languages without corrupting the codebase.

**Strategy:** Incremental, module-by-module approach with testing checkpoints.

---

## 📊 Scope Analysis

### Translation Statistics (Estimated)

| Module | Files | Strings | Complexity | Risk |
|--------|-------|---------|------------|------|
| GlobalHeader & Navigation | 3 | ~40 | LOW | 🟢 LOW |
| AI Persona System | 15 | ~200 | MEDIUM | 🟡 MEDIUM |
| Protocol Workbench | 20 | ~300 | HIGH | 🟠 HIGH |
| Academic Writing | 18 | ~250 | HIGH | 🟠 HIGH |
| Database Module | 10 | ~150 | MEDIUM | 🟡 MEDIUM |
| Analytics/Stats | 8 | ~100 | LOW | 🟢 LOW |
| Ethics/IRB | 5 | ~80 | LOW | 🟢 LOW |
| Dashboard/Wizards | 8 | ~120 | MEDIUM | 🟡 MEDIUM |
| **TOTAL** | **~87** | **~1,240** | - | - |

---

## 🗺️ Translation Key Structure

### Namespace Organization

```typescript
// 1. common.ts - Shared across all modules
{
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "export": "Export",
    "import": "Import",
    "close": "Close",
    "back": "Back",
    "next": "Next",
    "finish": "Finish",
    "apply": "Apply",
    "confirm": "Confirm",
    "loading": "Loading..."
  },
  "status": {
    "active": "Active",
    "inactive": "Inactive",
    "draft": "Draft",
    "published": "Published",
    "locked": "Locked",
    "unlocked": "Unlocked"
  },
  "time": {
    "today": "Today",
    "yesterday": "Yesterday",
    "lastWeek": "Last week",
    "lastMonth": "Last month"
  }
}

// 2. ui.ts - UI components (EXISTING - expand)
{
  "navigation": {
    "dashboard": "Dashboard",
    "projectLibrary": "Project Library",
    "protocolLibrary": "Protocol Library",
    "aiPersonas": "AI Personas",
    "protocolWorkbench": "Protocol Workbench",
    "database": "Database",
    "analytics": "Analytics",
    "academicWriting": "Academic Writing",
    "governance": "Governance",
    "ethics": "Ethics & IRB"
  },
  "globalHeader": {
    "targetJournal": "Target Journal",
    "selectJournal": "Select journal...",
    "createCustomJournal": "Create Custom Journal",
    "editGenericJournal": "Edit Generic Journal Defaults",
    "autonomy": {
      "audit": "Audit",
      "coPilot": "Co-Pilot",
      "pilot": "Pilot"
    },
    "exportPackage": "Export Package",
    "runLogicCheck": "Run Logic Check",
    "processing": "Processing...",
    "studyTypes": {
      "UNBLINDED": "UNBLINDED",
      "SINGLE_BLIND": "SINGLE BLIND",
      "DOUBLE_BLIND": "DOUBLE BLIND"
    }
  }
}

// 3. personas.ts - AI Persona names (EXISTING - complete)
// Already has 7 personas translated

// 4. validation.ts - Validation rules (EXISTING - 56 rules)
// Already translated

// 5. protocol.ts - NEW namespace for Protocol Workbench
{
  "tabs": {
    "schema": "Schema Builder",
    "dependencies": "Dependencies",
    "document": "Protocol Document",
    "audit": "Logic Audit",
    "settings": "Settings"
  },
  "schema": {
    "addBlock": "Add Schema Block",
    "editBlock": "Edit Block",
    "deleteBlock": "Delete Block",
    "blockTypes": {
      "text": "Text Field",
      "number": "Number",
      "date": "Date",
      "select": "Select/Dropdown",
      "multiselect": "Multi-Select",
      "checkbox": "Checkbox"
    }
  }
}

// 6. academic.ts - NEW namespace for Academic Writing
{
  "manuscript": {
    "title": "Manuscript Title",
    "abstract": "Abstract",
    "introduction": "Introduction",
    "methods": "Methods",
    "results": "Results",
    "discussion": "Discussion",
    "conclusions": "Conclusions",
    "references": "References"
  },
  "actions": {
    "addSection": "Add Section",
    "deleteSection": "Delete Section",
    "addCitation": "Add Citation",
    "exportPDF": "Export PDF",
    "exportWord": "Export Word"
  }
}

// 7. database.ts - NEW namespace for Database
{
  "tabs": {
    "schema": "Schema",
    "dataEntry": "Data Entry",
    "browser": "Data Browser",
    "query": "Query Builder"
  }
}
```

---

## 🔍 File-by-File Audit

### Phase 1: GlobalHeader & Navigation (START HERE)

#### `/components/unified-workspace/GlobalHeader.tsx`
**Hardcoded Strings to Translate:**
- Line 182: `"Target Journal:"`
- Line 191: `"Select journal..."`
- Line 208: `"Create Custom Journal"` (title attr)
- Line 218: `"Edit Generic Journal Defaults"` (title attr)
- Line 256: `"Audit"`
- Line 272: `"Co-Pilot"`
- Line 292: `"Pilot"`
- Line 270: `"Not available for your role"` (title attr)
- Line 168: `"UNBLINDED"`
- Line 170: Dynamic blinding protocol text

**Translation Keys:**
```typescript
// Add to ui.ts
t('ui:globalHeader.targetJournal')
t('ui:globalHeader.selectJournal')
t('ui:globalHeader.createCustomJournal')
t('ui:globalHeader.autonomy.audit')
t('ui:globalHeader.autonomy.coPilot')
t('ui:globalHeader.autonomy.pilot')
```

**Risk Level:** 🟢 **LOW** - Simple text replacement, no complex logic

---

#### `/components/unified-workspace/NavigationPanel.tsx`
**Hardcoded Strings to Translate:**
- Lines 65-152: NAV_ITEMS array (15 items × 2 strings each = 30 strings)
  - `label`: "Dashboard", "Project Library", etc.
  - `description`: "Progress overview", "Browse projects", etc.
- Line 238: `"Research Factory"`
- Line 251: `"Current Project:"`
- Line 262: Dynamic role name display

**Translation Keys:**
```typescript
// Add to ui.ts
t('ui:navigation.dashboard')
t('ui:navigation.projectLibrary')
t('ui:navigation.protocolLibrary')
// ... etc for all 15 items

t('ui:navigation.descriptions.dashboard')
t('ui:navigation.descriptions.projectLibrary')
// ... etc
```

**Risk Level:** 🟢 **LOW** - Static array, safe to modify

---

#### `/components/unified-workspace/LanguageToggle.tsx`
**Hardcoded Strings:**
- Line 59: `"Change interface language"` (title)
- Line 76: `"Interface Language"` (modal header)
- Line 123: `"Language preference is saved automatically"`

**Translation Keys:**
```typescript
t('ui:language.changeLanguage')
t('ui:language.title')
t('ui:language.autoSave')
```

**Risk Level:** 🟢 **LOW** - Already has i18n, just add translations

---

### Phase 2: AI Persona Manager

#### `/components/ai-personas/ui/PersonaManager.tsx`
**Status:** Partially translated
**Remaining Strings:** ~30
- Button labels
- Section headers
- Export dialog text

**Risk Level:** 🟡 **MEDIUM** - Some i18n already present

---

### Phase 3: Protocol Workbench

#### Files to Audit:
- `ProtocolWorkbenchCore.tsx`
- `SchemaEditor.tsx`
- `DependencyGraph.tsx`
- `ProtocolDocument.tsx`
- All modals (5 files)
- All block components (3 files)

**Estimated Strings:** ~300
**Risk Level:** 🟠 **HIGH** - Complex state management, many nested components

---

### Phase 4: Academic Writing Module

#### Files to Audit:
- `AcademicWritingEnhanced.tsx`
- `ManuscriptEditor.tsx`
- All sidebar components (13 files)

**Estimated Strings:** ~250
**Risk Level:** 🟠 **HIGH** - Rich text editor, complex workflows

---

### Phase 5: Database Module

#### Files to Audit:
- `Database.tsx`
- `components/database/*` (7 files)

**Estimated Strings:** ~150
**Risk Level:** 🟡 **MEDIUM** - Mostly labels and form fields

---

## 🚀 Implementation Plan

### Step-by-Step Process (Per Module)

#### **1. PRE-IMPLEMENTATION**
- [ ] Create backup of current files
- [ ] Create new translation keys in all 4 language files
- [ ] Review Polish translations (priority language)
- [ ] Document current behavior (screenshots/tests)

#### **2. IMPLEMENTATION**
- [ ] Add `useTranslation` hook to component
- [ ] Replace hardcoded strings with `t('key')` calls
- [ ] Handle dynamic strings with interpolation
- [ ] Handle pluralization where needed

#### **3. TESTING**
- [ ] Test in English (default)
- [ ] Test in Polish (priority)
- [ ] Test in Spanish
- [ ] Test in Chinese
- [ ] Verify existing functionality unchanged
- [ ] Check for layout issues (long translations)

#### **4. VALIDATION**
- [ ] No console errors
- [ ] Language switcher changes text
- [ ] Fallback to English works
- [ ] localStorage persistence works

#### **5. ROLLBACK PLAN**
- Keep original file as `.BACKUP`
- If issues detected → restore immediately
- Document what went wrong

---

## 📝 Example: GlobalHeader Translation

### Before (Hardcoded):
```typescript
<label className="text-xs text-slate-400">Target Journal:</label>
<option value="">Select journal...</option>
```

### After (Translated):
```typescript
import { useTranslation } from 'react-i18next';

function GlobalHeader() {
  const { t } = useTranslation('ui');
  
  return (
    <>
      <label className="text-xs text-slate-400">
        {t('globalHeader.targetJournal')}
      </label>
      <option value="">
        {t('globalHeader.selectJournal')}
      </option>
    </>
  );
}
```

### Translation Files:
```typescript
// en/ui.ts
export default {
  globalHeader: {
    targetJournal: "Target Journal:",
    selectJournal: "Select journal..."
  }
}

// pl/ui.ts
export default {
  globalHeader: {
    targetJournal: "Czasopismo docelowe:",
    selectJournal: "Wybierz czasopismo..."
  }
}
```

---

## ⚠️ Risk Mitigation Strategies

### **High-Risk Areas**
1. **Dynamic content** (user-generated, API responses)
   - Solution: Only translate UI labels, not data
   
2. **Complex state dependencies**
   - Solution: Test thoroughly, use safe fallbacks
   
3. **Layout breaking with long translations**
   - Solution: CSS adjustments, truncation where needed

4. **RegEx/validation dependent on English**
   - Solution: Keep validation language-agnostic

### **Corruption Prevention**
1. ✅ **One file at a time** - Never batch edit
2. ✅ **Test immediately** - After each file change
3. ✅ **Git-style backups** - Keep `.BACKUP` files
4. ✅ **Rollback ready** - Can restore in 30 seconds
5. ✅ **No auto-find-replace** - Manual, careful edits

---

## 🎯 Recommended Starting Point

### **Phase 1A: GlobalHeader ONLY** (Safest)

**Files to modify:** 1 file
**Strings to translate:** ~15 strings
**Time estimate:** 15-20 minutes
**Success criteria:**
- ✅ Language switcher changes header text
- ✅ Autonomy slider labels change
- ✅ No layout breaks
- ✅ No console errors

**If successful** → Proceed to NavigationPanel
**If issues** → Stop, debug, fix

---

## 📋 Translation File Templates

I can generate complete translation files for all 4 languages with:
- All identified strings
- Proper key structure
- Polish priority (verified native translations)
- Placeholder text for untranslated items

---

## 🤔 Decision Points

### Option A: **Full Automation** (Risky)
- I generate all translation keys
- I modify all components at once
- Faster but higher corruption risk

### Option B: **Incremental with Checkpoints** (Recommended)
- Start with GlobalHeader
- Test thoroughly
- Move to next module only if successful
- Slower but much safer

### Option C: **Translation Files First** (Safest)
- Create ALL translation keys first (no component changes)
- Review and verify translations
- Then implement component-by-component
- Maximum safety, longest timeline

---

## 📊 Next Steps - Your Choice

**What would you like me to do?**

1. ✅ **Create all translation keys** (4 languages × 7 namespaces)
   - No code changes yet
   - Review translations before implementing
   - Safe, reversible

2. 🎯 **Start Phase 1A** (GlobalHeader translation only)
   - Implement + test immediately
   - See live results
   - Prove the concept works

3. 📖 **Deeper audit** (scan more files, count exact strings)
   - More detailed analysis
   - Precise scope estimate

Which approach feels right to you?
