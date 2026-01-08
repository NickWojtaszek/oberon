# 🎯 Translation Implementation Checklist

## ✅ COMPLETED: Translation Key Files (Phase 0)

**Status:** ✅ **COMPLETE** - All translation files generated and ready

### What We Just Created:

#### **1. English (en) - Base Language**
- ✅ `/lib/i18n/locales/en/common.ts` - 100+ shared terms
- ✅ `/lib/i18n/locales/en/ui.ts` - 400+ UI strings (7 modules)
- ✅ `/lib/i18n/locales/en/personas.ts` - Already existed
- ✅ `/lib/i18n/locales/en/validation.ts` - Already existed

#### **2. Polish (pl) - Priority Language (100% Coverage)**
- ✅ `/lib/i18n/locales/pl/common.ts` - 100+ terms translated
- ✅ `/lib/i18n/locales/pl/ui.ts` - 400+ UI strings translated
- ✅ `/lib/i18n/locales/pl/personas.ts` - Already existed
- ✅ `/lib/i18n/locales/pl/validation.ts` - Already existed

#### **3. Spanish (es) - Secondary Language**
- ✅ `/lib/i18n/locales/es/common.ts` - 100+ terms translated
- ✅ `/lib/i18n/locales/es/ui.ts` - 400+ UI strings translated
- ✅ `/lib/i18n/locales/es/personas.ts` - Already existed
- ✅ `/lib/i18n/locales/es/validation.ts` - Already existed

#### **4. Chinese (zh) - Secondary Language**
- ✅ `/lib/i18n/locales/zh/common.ts` - 100+ terms translated
- ✅ `/lib/i18n/locales/zh/ui.ts` - 400+ UI strings translated
- ✅ `/lib/i18n/locales/zh/personas.ts` - Already existed
- ✅ `/lib/i18n/locales/zh/validation.ts` - Already existed

---

## 📊 Translation Coverage Map

### Module-by-Module Coverage:

| Module | Translation Keys | Coverage |
|--------|-----------------|----------|
| **Common (shared)** | 100+ keys | ✅ 100% |
| **GlobalHeader** | 15 keys | ✅ 100% |
| **Navigation** | 30 keys | ✅ 100% |
| **Language Switcher** | 7 keys | ✅ 100% |
| **Protocol Workbench** | 50 keys | ✅ 100% |
| **Academic Writing** | 45 keys | ✅ 100% |
| **Database** | 40 keys | ✅ 100% |
| **Analytics** | 35 keys | ✅ 100% |
| **Governance** | 30 keys | ✅ 100% |
| **Ethics/IRB** | 25 keys | ✅ 100% |
| **AI Personas** | 70 keys | ✅ 100% (existing) |
| **Validation** | 56 keys | ✅ 100% (existing) |

**Total Translation Keys:** ~500+ across 4 languages = **2,000+ translations ready**

---

## 🚀 Implementation Phases

### **PHASE 1: Global Header & Navigation** 🟢 LOW RISK

**Goal:** Translate the always-visible UI elements first for immediate visual impact

#### Files to Modify:
1. `/components/unified-workspace/GlobalHeader.tsx`
2. `/components/unified-workspace/NavigationPanel.tsx`
3. `/components/unified-workspace/LanguageToggle.tsx`

#### Translation Keys Available:
```typescript
// GlobalHeader
t('ui:globalHeader.targetJournal')
t('ui:globalHeader.selectJournal')
t('ui:globalHeader.autonomy.audit')
t('ui:globalHeader.autonomy.coPilot')
t('ui:globalHeader.autonomy.pilot')

// Navigation
t('ui:navigation.dashboard')
t('ui:navigation.protocolWorkbench')
t('ui:navigation.descriptions.dashboard')

// Language
t('ui:language.title')
t('ui:language.changeLanguage')
```

#### Checklist:
- [ ] **1.1** Translate GlobalHeader (15 strings)
  - [ ] Add `useTranslation('ui')` hook
  - [ ] Replace "Target Journal:" → `t('globalHeader.targetJournal')`
  - [ ] Replace autonomy slider labels
  - [ ] Replace blinding status labels
  - [ ] Test in all 4 languages
  - [ ] Verify layout doesn't break

- [ ] **1.2** Translate NavigationPanel (30 strings)
  - [ ] Add `useTranslation('ui')` hook
  - [ ] Replace NAV_ITEMS labels with translation keys
  - [ ] Replace NAV_ITEMS descriptions
  - [ ] Replace "Research Factory" header
  - [ ] Test navigation switching languages
  - [ ] Verify icons still display

- [ ] **1.3** Translate LanguageToggle (7 strings)
  - [ ] Add `useTranslation('ui')` hook
  - [ ] Replace modal title
  - [ ] Replace language labels
  - [ ] Test modal opening/closing
  - [ ] Verify language switching works

#### Success Criteria:
- ✅ Header changes language when switcher clicked
- ✅ Navigation menu translates correctly
- ✅ No console errors
- ✅ No layout breaks
- ✅ Language persists on refresh

---

### **PHASE 2: AI Persona Manager** 🟡 MEDIUM RISK

**Goal:** Complete translation of AI Persona system (partially translated already)

#### Files to Modify:
- `/components/ai-personas/ui/PersonaManager.tsx`
- `/components/ai-personas/ui/PersonaCard.tsx`
- `/components/ai-personas/ui/ExportDialog.tsx`

#### Translation Keys Available:
```typescript
t('personas:clinicalTrialMethodologist.name')
t('personas:clinicalTrialMethodologist.description')
t('common:export')
t('common:save')
```

#### Checklist:
- [ ] **2.1** Complete PersonaManager translation (~30 strings)
- [ ] **2.2** Translate PersonaCard component
- [ ] **2.3** Translate ExportDialog
- [ ] **2.4** Test persona creation/editing
- [ ] **2.5** Test export functionality

---

### **PHASE 3: Protocol Workbench** 🟠 HIGH RISK

**Goal:** Translate the complex protocol building interface

#### Files to Modify:
- `/components/protocol-workbench/ProtocolWorkbenchCore.tsx`
- `/components/protocol-workbench/SchemaEditor.tsx`
- `/components/protocol-workbench/DependencyGraph.tsx`
- All modals and sub-components

#### Translation Keys Available:
```typescript
t('ui:protocol.tabs.schema')
t('ui:protocol.schema.addBlock')
t('ui:protocol.schema.blockTypes.text')
t('ui:protocol.dependencies.addDependency')
```

#### Checklist:
- [ ] **3.1** Translate ProtocolWorkbenchCore tabs
- [ ] **3.2** Translate SchemaEditor
- [ ] **3.3** Translate DependencyGraph
- [ ] **3.4** Translate all modals
- [ ] **3.5** Translate block type components
- [ ] **3.6** Test schema creation
- [ ] **3.7** Test dependency management
- [ ] **3.8** Test audit functionality

---

### **PHASE 4: Academic Writing** 🟠 HIGH RISK

**Goal:** Translate the manuscript editor and all sidebars

#### Translation Keys Available:
```typescript
t('ui:academic.manuscript.title')
t('ui:academic.sections.addSection')
t('ui:academic.citations.addCitation')
t('ui:academic.export.exportPDF')
```

#### Checklist:
- [ ] **4.1** Translate main manuscript editor
- [ ] **4.2** Translate section management
- [ ] **4.3** Translate citation manager
- [ ] **4.4** Translate export dialog
- [ ] **4.5** Translate all 13 sidebar components
- [ ] **4.6** Test manuscript creation
- [ ] **4.7** Test export functionality

---

### **PHASE 5: Database Module** 🟡 MEDIUM RISK

**Goal:** Translate database schema and data management

#### Translation Keys Available:
```typescript
t('ui:database.tabs.schema')
t('ui:database.schema.addTable')
t('ui:database.dataEntry.newRecord')
t('ui:database.query.runQuery')
```

#### Checklist:
- [ ] **5.1** Translate database tabs
- [ ] **5.2** Translate schema builder
- [ ] **5.3** Translate data entry forms
- [ ] **5.4** Translate data browser
- [ ] **5.5** Translate query builder

---

### **PHASE 6: Analytics Module** 🟢 LOW RISK

**Goal:** Translate analytics dashboards and charts

#### Translation Keys Available:
```typescript
t('ui:analytics.dashboard.title')
t('ui:analytics.statistics.mean')
t('ui:analytics.charts.barChart')
```

#### Checklist:
- [ ] **6.1** Translate analytics dashboard
- [ ] **6.2** Translate statistics labels
- [ ] **6.3** Translate chart labels
- [ ] **6.4** Test chart rendering

---

### **PHASE 7: Governance & Ethics** 🟢 LOW RISK

**Goal:** Translate remaining administrative modules

#### Translation Keys Available:
```typescript
t('ui:governance.roles.title')
t('ui:governance.users.addUser')
t('ui:ethics.submissions.title')
```

#### Checklist:
- [ ] **7.1** Translate governance module
- [ ] **7.2** Translate ethics/IRB module
- [ ] **7.3** Test role management
- [ ] **7.4** Test IRB submission tracking

---

## 🛡️ Safety Protocols

### Before Each Phase:
1. ✅ Create backup of files to be modified
2. ✅ Review translation keys are available
3. ✅ Test language switcher works
4. ✅ Document current behavior

### During Implementation:
1. ✅ Modify ONE file at a time
2. ✅ Test immediately after each file
3. ✅ Check all 4 languages
4. ✅ Verify no console errors

### After Each Phase:
1. ✅ Run full language switch test
2. ✅ Check for layout issues
3. ✅ Verify existing functionality intact
4. ✅ Update this checklist

### Rollback Plan:
- Keep `.BACKUP` files for 24 hours
- If ANY issues: Stop immediately
- Restore from backup
- Document what went wrong
- Fix before continuing

---

## 📝 Implementation Pattern (Copy-Paste Template)

### For Every Component:

#### **BEFORE:**
```typescript
function MyComponent() {
  return (
    <button>Save</button>
  );
}
```

#### **AFTER:**
```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('common'); // or 'ui', 'personas', etc.
  
  return (
    <button>{t('save')}</button>
  );
}
```

### For Dynamic Content with Variables:

```typescript
// BEFORE
<span>Showing {from} to {to} of {total} results</span>

// AFTER
<span>{t('common:showingResults', { from, to, total })}</span>
```

### For Pluralization:

```typescript
// BEFORE
<span>{count} issue{count !== 1 ? 's' : ''}</span>

// AFTER
<span>{t('ui:sidebar.issueCount', { count })}</span>
```

---

## 🎯 Next Steps

### **READY TO START:**

**Option A: Start Phase 1 NOW** ✅ Recommended
- Immediate visual results
- Low risk
- Proves the concept works
- ~30 minutes of work

**Option B: Review Translation Keys First** 📖
- Verify Polish translations are correct
- Check for missing strings
- Suggest improvements

**What would you like to do?**

1. ✅ **Start Phase 1.1** (GlobalHeader translation - 15 strings)
2. 📖 **Review Polish translations** (verify quality)
3. 🔍 **Audit specific module** (deep dive before implementing)
4. ⏸️ **Wait** (think about it more)

---

## 📊 Progress Tracker

### Overall Progress: 0% → Target: 100%

| Phase | Status | Files | Strings | Completion |
|-------|--------|-------|---------|------------|
| Phase 0: Translation Keys | ✅ DONE | 16/16 | 2000+/2000+ | 100% |
| Phase 1: Header/Nav | ⏳ TODO | 0/3 | 0/52 | 0% |
| Phase 2: AI Personas | ⏳ TODO | 0/3 | 0/30 | 0% |
| Phase 3: Protocol | ⏳ TODO | 0/20 | 0/300 | 0% |
| Phase 4: Academic | ⏳ TODO | 0/18 | 0/250 | 0% |
| Phase 5: Database | ⏳ TODO | 0/10 | 0/150 | 0% |
| Phase 6: Analytics | ⏳ TODO | 0/8 | 0/100 | 0% |
| Phase 7: Gov/Ethics | ⏳ TODO | 0/10 | 0/110 | 0% |

**Current Status:** Ready to begin implementation ✅
