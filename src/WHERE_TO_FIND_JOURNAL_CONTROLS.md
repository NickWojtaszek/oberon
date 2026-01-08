# ✅ NOW LIVE: Edit Generic & Create Custom Journals

**Status:** Fully Integrated & Visible in UI  
**Location:** Academic Writing Screen → Global Header

---

## 🎯 Where To Find The Controls

### **Academic Writing Screen**

Go to: **Navigation Panel → Academic Writing**

You'll see the **Global Header** at the top with:

```
┌────────────────────────────────────────────────────────────────┐
│  Academic Writing > Lancet                                     │
│                                                                │
│  Target Journal: [Lancet ▼] [+] [⚙️]   [Audit|Co-Pilot|Pilot] │
│                                                                │
│                     [Run Logic Check] [Export Package]         │
└────────────────────────────────────────────────────────────────┘
```

**Two NEW buttons next to the journal dropdown:**

1. **[+]** Button (Plus icon)
   - **Opens:** Custom Journal Dialog
   - **Purpose:** Create a new custom journal for lesser-known publications
   
2. **[⚙️]** Button (Settings icon)
   - **Opens:** Generic Journal Editor
   - **Purpose:** Edit the default "Generic Academic Journal" constraints

---

## 🎨 Button Appearance

### Plus Button [+]
- **Color:** Blue
- **Size:** Small icon (4x4)
- **Hover:** Darker blue
- **Position:** Immediately right of journal dropdown

### Settings Button [⚙️]
- **Color:** Blue
- **Size:** Small icon (4x4)
- **Hover:** Darker blue
- **Position:** Right of plus button

---

## 📋 How To Use

### 🔧 Edit Generic Journal (Settings Button)

**Step 1:** Click the **[⚙️]** button in the header

**Step 2:** The "Edit Generic Journal Defaults" dialog opens:

```
┌─────────────────────────────────────────────┐
│  ⚙️  Edit Generic Journal Defaults     ✕   │
├─────────────────────────────────────────────┤
│  Word Limits                                │
│  Abstract: [300]  Introduction: [1000]      │
│  Methods:  [2000] Results:      [2000]      │
│  Discussion: [1500] Overall:    [6000]      │
│                                             │
│  Other Limits                               │
│  References: [50]  Figures: [8]  Tables: [8]│
│                                             │
│  Quick Presets                              │
│  [🔒 Conservative] [⚖️ Moderate] [🌐 Lenient]│
│                                             │
│  [🔄 Reset to Defaults]    [Cancel] [💾 Save]│
└─────────────────────────────────────────────┘
```

**Step 3:** Edit any limits or click a preset

**Step 4:** Click **[💾 Save]**

**Result:** Changes saved to localStorage and immediately active!

---

### ➕ Create Custom Journal (Plus Button)

**Step 1:** Click the **[+]** button in the header

**Step 2:** The "Create Custom Journal" dialog opens:

```
┌─────────────────────────────────────────────┐
│  +  Create Custom Journal              ✕   │
├─────────────────────────────────────────────┤
│  Journal Information                        │
│  Full Name: [Journal of Clinical Research]  │
│  Short Name: [JCR]                          │
│  Impact Factor: [3.5] (optional)            │
│                                             │
│  Word Limits                                │
│  Abstract: [300]  Introduction: [1000]      │
│  Methods:  [2000] Results:      [2000]      │
│  ...                                        │
│                                             │
│  Formatting                                 │
│  Citation Style: [Vancouver ▼]              │
│  ☐ Structured Abstract                      │
│                                             │
│             [Cancel]           [💾 Save]     │
└─────────────────────────────────────────────┘
```

**Step 3:** Fill in journal details

**Step 4:** Click **[💾 Save]**

**Result:** New journal added to dropdown AND automatically selected!

---

## 🧪 Quick Test

### Test 1: Edit Generic

1. Go to **Academic Writing** screen
2. Select **"Generic Academic Journal"** from dropdown
3. Click **[⚙️]** button
4. Click **"Conservative"** preset
5. Click **"Save Defaults"**
6. ✅ Generic now has strict limits (4,000 words)

### Test 2: Create Custom

1. Go to **Academic Writing** screen
2. Click **[+]** button
3. Enter:
   - Name: "My Regional Journal"
   - Short: "MRJ"
   - Impact: 2.5
4. Click **"Save"**
5. ✅ "MRJ" appears in dropdown and is selected

### Test 3: Verify Persistence

1. Edit Generic constraints
2. Refresh page (F5)
3. Go to Academic Writing
4. Select Generic from dropdown
5. Click [⚙️] to view settings
6. ✅ Your changes are still there!

---

## 🎯 What Works Now

✅ **Plus button visible** in Global Header  
✅ **Settings button visible** in Global Header  
✅ **CustomJournalDialog opens** when clicking [+]  
✅ **GenericJournalEditor opens** when clicking [⚙️]  
✅ **Custom journals added to dropdown** after creation  
✅ **Generic edits saved to localStorage** automatically  
✅ **Generic edits loaded on app start** automatically  
✅ **All dialogs fully functional** with validation

---

## 📸 Visual Location

```
Navigation Panel              Global Header
┌──────────────┐   ┌─────────────────────────────────────────┐
│ Dashboard    │   │ Academic Writing > Lancet               │
│ Protocol     │   │                                         │
│ > Academic   │ ← │ Target: [Lancet▼] [+][⚙️] [Autonomy]  │
│   Writing    │   │                                         │
│ Persona      │   │         [Actions...] [Export Package]   │
│ Analytics    │   └─────────────────────────────────────────┘
│              │
└──────────────┘   Main Content Area
                   ┌─────────────────────────────────────────┐
                   │                                         │
                   │  Academic Writing Editor                │
                   │                                         │
                   │  (Your content here)                    │
                   │                                         │
                   └─────────────────────────────────────────┘

                   Dialogs (when opened)
                   ┌────────────────────┐
                   │ Custom Journal     │ ← Opens from [+]
                   │ Dialog             │
                   └────────────────────┘

                   ┌────────────────────┐
                   │ Generic Editor     │ ← Opens from [⚙️]
                   │ Dialog             │
                   └────────────────────┘
```

---

## 💡 Pro Tips

### Tip 1: Quick Access
Both buttons are always visible when you're on the Academic Writing screen, regardless of which journal is selected.

### Tip 2: Presets for Speed
In Generic Journal Editor, use the three presets instead of manually entering all values:
- **Conservative:** For strict high-impact journals
- **Moderate:** Balanced (default)
- **Lenient:** For open-access journals

### Tip 3: Custom Journals Persist
Custom journals are stored in component state. To persist across sessions, add localStorage save/load (future enhancement).

### Tip 4: Generic Always Available
The Generic journal editor saves to localStorage automatically, so your preferences persist forever!

---

## ✅ Summary

**Question:** *"Where can I edit this? I don't see any fields which would be editable"*

**Answer:** 

Go to **Academic Writing** screen. Look for these two buttons in the header next to the journal dropdown:

1. **[+]** = Create Custom Journal
2. **[⚙️]** = Edit Generic Defaults

Both are **blue icons** to the right of the journal selector dropdown.

**They're live and working right now!** 🎉

---

**Files Integrated:**
- `/components/ResearchFactoryApp.tsx` - Added state + dialogs
- `/components/unified-workspace/GlobalHeader.tsx` - Added buttons
- `/components/unified-workspace/CustomJournalDialog.tsx` - Dialog component
- `/components/unified-workspace/GenericJournalEditor.tsx` - Editor component

**Status:** ✅ Fully integrated and visible in UI!
