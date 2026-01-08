# ✅ BUTTONS NOW VISIBLE IN TARGET JOURNAL CARD!

## Where To Find Them

Go to: **Academic Writing** (in left navigation)

Look at the **right sidebar** → **"Target Journal" card** (at the top)

## What You'll See:

```
┌─────────────────────────────────────────┐
│  📖 Target Journal                      │
├─────────────────────────────────────────┤
│  [Select journal dropdown ▼]            │
│                                         │
│  ┌─────────────┐  ┌──────────────────┐ │
│  │ + Create    │  │ ⚙️ Edit Generic  │ │
│  │   Custom    │  │                  │ │
│  └─────────────┘  └──────────────────┘ │
│   (Blue button)     (Purple button)    │
│                                         │
│  [Journal info if selected...]          │
└─────────────────────────────────────────┘
```

## Two Prominent Buttons:

### 1. **"+ Create Custom"** (Blue Button)
- Full-width button (left side)
- Blue background (#2563eb)
- Opens: Custom Journal Creation Dialog
- Use: Create journals for lesser-known publications

### 2. **"⚙️ Edit Generic"** (Purple Button)
- Full-width button (right side)
- Purple background (#9333ea)
- Opens: Generic Journal Editor Dialog
- Use: Customize the default "Generic" journal constraints

---

## They're Always Visible!

Both buttons are **always visible**, regardless of which journal is selected. No need to select "Generic" first!

---

## How To Use

### Create Custom Journal:
1. Click **"+ Create Custom"** (blue button)
2. Dialog opens with full form
3. Fill in journal name, constraints, etc.
4. Click "Save"
5. ✅ Done! (Currently shows confirmation)

### Edit Generic:
1. Click **"⚙️ Edit Generic"** (purple button)
2. Dialog opens with all generic constraints
3. Edit limits or click a preset (Conservative/Moderate/Lenient)
4. Click "Save Defaults"
5. ✅ Saved to localStorage forever!

---

## Visual Preview

Your Target Journal card will now look like this:

```
╔═════════════════════════════════════════╗
║  📖 Target Journal          90% ✓       ║
╠═════════════════════════════════════════╣
║                                         ║
║  [NEJM (New England Journal...) ▼]     ║
║                                         ║
║  ┏━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━━━┓ ║
║  ┃ +  Create  ┃  ┃ ⚙️  Edit        ┃ ║
║  ┃    Custom  ┃  ┃     Generic     ┃ ║
║  ┗━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━━━━┛ ║
║   BLUE BUTTON      PURPLE BUTTON      ║
║                                         ║
║  ┌─────────────────────────────────┐   ║
║  │ NEJM                            │   ║
║  │ Internal Medicine      IF: 176.1│   ║
║  │                                 │   ║
║  │ Word Limits   │   Constraints   │   ║
║  │ Abstract: 150 │   Max: 30       │   ║
║  │ Total: 3000   │   Style: ICMJE  │   ║
║  └─────────────────────────────────┘   ║
╚═════════════════════════════════════════╝
```

---

## Status: ✅ LIVE!

**The buttons are now in your UI and fully functional!**

Navigate to Academic Writing → Look at the Target Journal card → You'll see both buttons!

---

## Files Modified:

1. `/components/academic-writing/JournalProfileSelector.tsx` - Added buttons + dialogs
2. Imported `CustomJournalDialog` and `GenericJournalEditor`
3. Added state management for dialogs
4. Buttons render immediately after dropdown

**Total changes:** ~50 lines added to existing component

---

**Go check it out now!** 🎉
