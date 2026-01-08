# Generic Journal Editor - User Guide

**Status:** ✅ Fully Implemented  
**Date:** 2026-01-04

---

## 🎯 Problem Solved

**Your Question:** *"I should have the ability to self-define the generic journal limits, shouldn't I?"*

**Answer:** **Absolutely YES!** ✅

The "Generic Academic Journal" is now **fully customizable** by the user. You can:
- Edit all word limits
- Change reference/figure/table counts
- Select citation style
- Toggle structured abstracts
- Save to localStorage (persists across sessions)
- Reset to factory defaults anytime

---

## 🚀 How To Use

### Option 1: Add Settings Icon to Journal Selector

```tsx
// In GlobalHeader or ResearchFactoryApp
import { GenericJournalEditor, getGenericJournal, updateGenericJournal } from '...';

const [genericEditorOpen, setGenericEditorOpen] = useState(false);
const [genericJournal, setGenericJournal] = useState(getGenericJournal());

// When user clicks settings icon next to "Generic" journal
<button onClick={() => setGenericEditorOpen(true)}>
  <Settings className="w-4 h-4" />
</button>

<GenericJournalEditor
  isOpen={genericEditorOpen}
  onClose={() => setGenericEditorOpen(false)}
  currentConstraints={genericJournal.constraints}
  onSave={(constraints) => {
    const updated = updateGenericJournal(constraints);
    setGenericJournal(updated);
    setSelectedJournal(updated); // Update active journal
  }}
/>
```

### Option 2: Add to Navigation Panel Settings

```tsx
// In NavigationPanel, add a settings option
<button 
  onClick={() => setGenericEditorOpen(true)}
  className="flex items-center gap-2 px-3 py-2"
>
  <Settings className="w-4 h-4" />
  Edit Generic Journal Defaults
</button>
```

### Option 3: Show When Generic is Selected

```tsx
// In GlobalHeader, show edit button when Generic is active
{selectedJournal.id === 'generic' && (
  <button 
    onClick={() => setGenericEditorOpen(true)}
    className="ml-2 text-purple-600 hover:text-purple-700"
  >
    <Settings className="w-4 h-4" />
  </button>
)}
```

---

## 📋 Features

### 1. **Full Customization**

All fields are editable:
- Abstract word limit
- Introduction word limit
- Methods word limit
- Results word limit
- Discussion word limit
- Overall word limit
- Reference count max
- Figure count max
- Table count max
- Citation style (Vancouver/APA/Chicago)
- Structured abstract toggle

### 2. **Quick Presets**

Three one-click presets:
- **🔒 Conservative:** Strict limits (Abstract: 250, Overall: 4000)
- **⚖️ Moderate:** Balanced limits (Abstract: 300, Overall: 6000) - **Default**
- **🌐 Lenient:** Generous limits (Abstract: 400, Overall: 10000)

### 3. **Factory Reset**

Reset button restores original defaults:
```
Abstract: 300 words
Introduction: 1000 words
Methods: 2000 words
Results: 2000 words
Discussion: 1500 words
Overall: 6000 words
References: 50
Figures: 8
Tables: 8
Citation: Vancouver
Structured: No
```

### 4. **Persistent Storage**

All changes saved to localStorage:
- Key: `research_factory_generic_constraints`
- Auto-loads on app start
- Survives page refresh
- Browser-specific

---

## 💡 Use Cases

### Use Case 1: Regional Journal

**Scenario:** Publishing in a small regional journal with strict limits.

**Action:**
1. Select "Generic Academic Journal"
2. Click settings icon
3. Click "Conservative" preset
4. Adjust specific limits if needed
5. Save

**Result:** Generic now enforces stricter limits (4000 words overall).

### Use Case 2: Open-Access Journal

**Scenario:** Submitting to open-access journal with generous limits.

**Action:**
1. Select "Generic Academic Journal"
2. Click settings icon
3. Click "Lenient" preset
4. Save

**Result:** Generic now allows up to 10000 words overall.

### Use Case 3: Custom Citation Style

**Scenario:** Journal requires APA citations instead of Vancouver.

**Action:**
1. Select "Generic Academic Journal"
2. Click settings icon
3. Change "Citation Style" to "APA"
4. Save

**Result:** Generic now expects APA citations.

### Use Case 4: Structured Abstract Required

**Scenario:** Journal requires structured abstract (Background/Methods/Results/Conclusion).

**Action:**
1. Select "Generic Academic Journal"
2. Click settings icon
3. Check "Structured Abstract"
4. Save

**Result:** Generic now enforces structured abstract format.

---

## 🔄 Integration with Existing System

### Step 1: Load Generic with Custom Constraints

```tsx
// In ResearchFactoryApp or wherever journals are loaded
import { getGenericJournal } from '../data/journalLibrary';

// Load generic with custom constraints (if any)
const genericJournal = getGenericJournal();

// Use in journal list
const journalOptions = [
  ...JOURNAL_LIBRARY.filter(j => j.id !== 'generic'),
  genericJournal, // Custom generic instead of static
];
```

### Step 2: Add Editor Dialog

```tsx
import { GenericJournalEditor } from '../components/unified-workspace';

const [genericEditorOpen, setGenericEditorOpen] = useState(false);
const [genericJournal, setGenericJournal] = useState(getGenericJournal());

<GenericJournalEditor
  isOpen={genericEditorOpen}
  onClose={() => setGenericEditorOpen(false)}
  currentConstraints={genericJournal.constraints}
  onSave={(constraints) => {
    const updated = updateGenericJournal(constraints);
    setGenericJournal(updated);
    
    // If generic is currently selected, update it
    if (selectedJournal.id === 'generic') {
      setSelectedJournal(updated);
    }
  }}
/>
```

### Step 3: Add UI Trigger

**Option A: Settings icon next to Generic in dropdown**

```tsx
<select value={selectedJournal.id} onChange={...}>
  <option value="lancet">Lancet</option>
  <option value="nejm">NEJM</option>
  <option value="generic">
    Generic ⚙️ {/* Or show icon separately */}
  </option>
</select>

{/* If Generic is selected, show edit button */}
{selectedJournal.id === 'generic' && (
  <button onClick={() => setGenericEditorOpen(true)}>
    <Settings className="w-4 h-4" />
    Edit Defaults
  </button>
)}
```

**Option B: Context menu on right-click**

```tsx
<option 
  value="generic" 
  onContextMenu={(e) => {
    e.preventDefault();
    setGenericEditorOpen(true);
  }}
>
  Generic Academic Journal
</option>
```

**Option C: Dedicated settings screen**

Add to NavigationPanel:
```tsx
<button onClick={() => setGenericEditorOpen(true)}>
  <Settings />
  Journal Settings
</button>
```

---

## 🎨 UI Preview

### Dialog Appearance

```
┌─────────────────────────────────────────────────────┐
│  ⚙️  Edit Generic Journal Defaults          ✕      │
│     Customize baseline constraints                  │
├─────────────────────────────────────────────────────┤
│  ℹ️  These settings will be used as defaults when   │
│     "Generic Academic Journal" is selected.         │
│                                                      │
│  Word Limits                                        │
│  ┌─────────┐ ┌──────────────┐ ┌──────────┐        │
│  │Abstract │ │ Introduction │ │ Methods  │        │
│  │  300    │ │    1000      │ │  2000    │        │
│  └─────────┘ └──────────────┘ └──────────┘        │
│                                                      │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐            │
│  │Results  │ │Discussion│ │ Overall  │            │
│  │  2000   │ │   1500   │ │  6000    │            │
│  └─────────┘ └──────────┘ └──────────┘            │
│                                                      │
│  Other Limits                                       │
│  ┌───────────┐ ┌─────────┐ ┌────────┐             │
│  │References │ │ Figures │ │ Tables │             │
│  │    50     │ │    8    │ │   8    │             │
│  └───────────┘ └─────────┘ └────────┘             │
│                                                      │
│  Formatting                                         │
│  Citation Style: [Vancouver ▼]                     │
│  ☐ Structured Abstract                             │
│                                                      │
│  Quick Presets                                      │
│  [🔒 Conservative] [⚖️ Moderate] [🌐 Lenient]     │
│                                                      │
├─────────────────────────────────────────────────────┤
│  [🔄 Reset to Defaults]          [Cancel] [💾 Save]│
└─────────────────────────────────────────────────────┘
```

---

## 🧪 Testing

### Test 1: Edit and Save

```bash
1. Open app
2. Select "Generic Academic Journal"
3. Click settings icon (opens GenericJournalEditor)
4. Change Abstract limit to 400
5. Click "Save Defaults"
6. Close dialog
7. Verify LiveBudgetTracker shows 400-word limit for abstract
```

### Test 2: Preset Application

```bash
1. Open GenericJournalEditor
2. Click "Conservative" preset
3. Verify all limits update to conservative values
4. Click "Save Defaults"
5. Verify changes persist after page refresh
```

### Test 3: Factory Reset

```bash
1. Open GenericJournalEditor
2. Make random changes to limits
3. Click "Reset to Defaults"
4. Confirm dialog
5. Verify all limits reset to 300/1000/2000/2000/1500/6000
6. Click "Save Defaults"
```

### Test 4: Persistence

```bash
1. Edit Generic limits
2. Save
3. Refresh page (F5)
4. Select Generic journal
5. Verify custom limits are still active
6. Check localStorage in DevTools:
   Key: research_factory_generic_constraints
   Value: {abstract: {wordLimit: 400, ...}, ...}
```

---

## ✅ Summary

**What You Asked For:** *"I should have the ability to self-define the generic journal limits"*

**What You Got:** ✅

1. ✅ **Full editing capability** for all Generic journal constraints
2. ✅ **Three quick presets** (Conservative/Moderate/Lenient)
3. ✅ **Factory reset** to restore defaults
4. ✅ **Persistent storage** via localStorage
5. ✅ **Auto-load** on app start
6. ✅ **Clean UI** with purple theme to match Research Factory
7. ✅ **Type-safe** with full TypeScript coverage

**Files Created:**
- `/components/unified-workspace/GenericJournalEditor.tsx` (350+ lines)

**Files Modified:**
- `/data/journalLibrary.ts` - Added 5 helper functions
- `/components/unified-workspace/index.ts` - Exported new component

**Next Step:**
Add a settings button in your UI to open the GenericJournalEditor dialog!

---

**Status:** ✅ Generic Journal is now fully customizable by the user!
