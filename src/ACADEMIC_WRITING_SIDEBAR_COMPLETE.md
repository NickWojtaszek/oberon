# Academic Writing: Section Navigator Sidebar ✅

## Overview
Replaced horizontal section tabs with a vertical sidebar navigator, replicating the design pattern from the Analytics Schema Explorer.

## Changes Made

### 1. **New Component: SectionNavigator** (`/components/academic-writing/SectionNavigator.tsx`)

**Design Features:**
- **Header with Search** - Find sections quickly
- **Collapsible Groups** - Manuscript sections organized under expandable "Manuscript" group
- **Section Cards** - Each section displays:
  - Icon (BookOpen, FlaskConical, FileText, MessageSquare, Lightbulb)
  - Section name and description
  - Word count
  - Status indicator (checkmark/alert/empty)
  - Error/conflict count (if issues exist)
- **Footer Stats** - Total word count and issue count

**Visual States:**
- **Active Section** - Blue background, blue border, shadow
- **Hover State** - Blue tint, elevated appearance
- **Has Content** - Green checkmark icon
- **Has Issues** - Red alert icon with issue count
- **Empty** - Gray file-edit icon

---

### 2. **Updated ManuscriptEditor** (`/components/academic-writing/ManuscriptEditor.tsx`)

**Layout Changes:**
```
BEFORE: Horizontal tabs at top
┌────────────────────────────────────────┐
│ [Intro] [Methods] [Results] [etc.]    │
├────────────────────────────────────────┤
│                                        │
│         Editor Content                 │
│                                        │
└────────────────────────────────────────┘

AFTER: Vertical sidebar layout
┌──────────┬─────────────────────────────┐
│          │                             │
│ Section  │      Editor Content         │
│ Nav      │                             │
│ Sidebar  │                             │
│          │                             │
└──────────┴─────────────────────────────┘
```

**Integration:**
- Removed horizontal tab strip
- Added flex layout with sidebar (320px width)
- Sidebar communicates section stats:
  - Word counts calculated from content
  - Error counts from logic errors
  - Conflict counts from claims audit
  - Content presence detection

---

## Visual Design

### **Section Card States**

#### Active Section (Introduction)
```
┌────────────────────────────────────┐
│ 📖  Introduction              ✓    │
│     Background and research...     │
│     245 words                      │
└────────────────────────────────────┘
```

#### Section with Issues (Results)
```
┌────────────────────────────────────┐
│ 📄  Results                   ⚠️ 2 │
│     Key findings and data          │
│     189 words                      │
└────────────────────────────────────┘
```

#### Empty Section (Discussion)
```
┌────────────────────────────────────┐
│ 💬  Discussion                ✏️   │
│     Interpretation and impl...     │
│     0 words                        │
└────────────────────────────────────┘
```

### **Sidebar Footer**
```
┌────────────────────────────────────┐
│ Total Words:                   892 │
│ Issues:                          2 │
└────────────────────────────────────┘
```

---

## User Experience Improvements

### **1. Better Spatial Awareness**
- ✅ All sections visible at once (no need to scan horizontal tabs)
- ✅ Section status immediately apparent
- ✅ Progress tracking at a glance

### **2. More Information Density**
- ✅ Section descriptions help writers understand purpose
- ✅ Word counts per section (not just total)
- ✅ Issue indicators with counts
- ✅ Visual status icons

### **3. Reduced Cognitive Load**
- ✅ Icons provide visual anchors for each section
- ✅ Color-coded states (blue=active, green=complete, red=issues)
- ✅ Progress indicators (X of 5 sections drafted)

### **4. Consistent with App Design**
- ✅ Matches Analytics Schema Explorer pattern
- ✅ Consistent with Protocol Workbench variable library
- ✅ Fits Research Factory's information architecture

---

## Technical Implementation

### **Section Stats Calculation**
```typescript
const sectionStats: Record<SectionKey, {
  wordCount: number;
  errorCount: number;
  conflictCount: number;
  hasContent: boolean;
}> = {
  introduction: {
    wordCount: wordCount(manifest.manuscriptContent.introduction),
    errorCount: getSectionErrors('introduction').length,
    conflictCount: getSectionConflicts('introduction').length,
    hasContent: !!manifest.manuscriptContent.introduction
  },
  // ... other sections
};
```

### **Status Icon Logic**
```typescript
const getStatusIcon = (section: SectionKey) => {
  const stats = sectionStats[section];
  if (stats.errorCount > 0 || stats.conflictCount > 0) {
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  }
  if (stats.hasContent && stats.wordCount > 0) {
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  }
  return <FileEdit className="w-4 h-4 text-slate-300" />;
};
```

---

## Responsive Behavior

- **Sidebar Width:** Fixed at 320px
- **Collapsible Groups:** "Manuscript" group can be collapsed to save space
- **Search:** Optional search filter (currently no search handler)
- **Scrollable:** Section list scrolls independently from editor

---

## Future Enhancements

### **Phase 2 Features:**
- [ ] Drag-and-drop section reordering
- [ ] Section templates (auto-populate with guidance)
- [ ] Section completion percentage
- [ ] Estimated reading time per section
- [ ] Section-level version history

### **Advanced Features:**
- [ ] Multi-level grouping (e.g., "Front Matter", "Body", "Back Matter")
- [ ] Custom sections (beyond IMRaD structure)
- [ ] Section dependencies (e.g., "Complete Methods before Results")
- [ ] AI-suggested section order based on journal requirements

---

## Status
✅ **Complete** - Section Navigator sidebar successfully replaces horizontal tabs in Academic Writing module.

**Benefits Achieved:**
- Improved navigation and spatial awareness
- Better progress tracking
- More information at a glance
- Consistent with app-wide design patterns
- Enhanced visual feedback for section status
