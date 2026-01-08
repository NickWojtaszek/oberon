# How to Nest Blocks in Section Containers

## Quick Start Guide

### ✅ Method 1: Drag and Drop (Recommended)

**Step 1: Create a Section Container**
1. Open the **Variable Library** (left sidebar)
2. Find **"Section Container"** under the **Structural** category
3. Drag it to your schema

**Step 2: Nest a Block Inside**
1. **Grab** any existing block by its grip handle (⋮⋮ icon)
2. **Drag** it over the Section Container
3. Watch for the visual indicators:
   - 🔵 **Blue line above** → Drop here to place BEFORE section
   - 🟦 **Entire section highlights blue + "Drop to add inside section" message** → Drop here to add INSIDE
   - 🔵 **Blue line below** → Drop here to place AFTER section
4. **Release** to drop

**Visual Feedback:**
```
┌─────────────────────────────────────────┐
│ 📦 Section Container                    │ ← Blue line appears here (BEFORE)
├─────────────────────────────────────────┤
│ ╔═══════════════════════════════════╗  │
│ ║ DROP TO ADD INSIDE SECTION  ║  │ ← Big blue overlay (INSIDE)
│ ╚═══════════════════════════════════╝  │
└─────────────────────────────────────────┘
                                           ← Blue line appears here (AFTER)
```

---

### ✅ Method 2: Quick Add Buttons

**For empty or expanded sections:**
1. **Expand** the Section Container (click the chevron >)
2. Look for the **dashed box** at the bottom
3. Click any **"+ Variable Name"** button to add that field directly as a child

Example:
```
📦 Section Container (expanded)
├── Age (already nested)
├── Sex (already nested)
└── ┌──────────────────────────────┐
    │ Add field to this section    │
    │  [+ Hypertension] [+ eGFR]  │
    └──────────────────────────────┘
```

---

## Visual Hierarchy

Once nested, blocks show their hierarchy with:
- **Left border** on nested items
- **Indentation** (6px per level)
- **Parent/child relationship** clearly visible

Example Schema:
```
📦 Baseline Demographics (Section)
  ├── 📅 Age (nested inside)
  ├── 👥 Sex (nested inside)
  └── 📦 Medical History (nested section)
      ├── ❤️ Hypertension (nested 2 levels deep)
      └── 🫀 Coronary Artery Disease (nested 2 levels deep)

📊 Primary Outcomes (Section)
  ├── 🎯 Overall Survival
  └── 🎯 30-Day Mortality
```

---

## Data Structure

When you nest blocks, the JSON export reflects the hierarchy:

```json
{
  "baseline_demographics": {
    "age": 62,
    "sex": "M",
    "medical_history": {
      "hypertension": true,
      "coronary_artery_disease": false
    }
  },
  "primary_outcomes": {
    "overall_survival": 24,
    "mortality_30d": false
  }
}
```

---

## AI Semantic Validation

The system automatically detects logical mismatches:

### ❌ **Bad Nesting (AI will warn you):**
```
📦 Baseline Demographics (Section)
  └── 🎯 Overall Survival ← ⚠️ AI Warning!
      "Outcome endpoint should not be in demographic section"
```

### ✅ **Good Nesting:**
```
📦 Baseline Demographics (Section)
  ├── 📅 Age
  ├── 👥 Sex
  └── ❤️ Hypertension

📦 Primary Outcomes (Section)
  └── 🎯 Overall Survival
```

---

## Tips & Tricks

### 💡 Tip 1: Rename Sections
- Click on a Section Container
- Double-click the name to edit
- Give it a meaningful name like "Baseline Characteristics" or "Safety Outcomes"

### 💡 Tip 2: Collapse Sections
- Click the chevron (>) to collapse/expand
- Keeps your schema organized when working with many fields

### 💡 Tip 3: Multi-Level Nesting
- Sections can contain other sections
- Create hierarchies like: Study → Arm → Visit → Measurement

### 💡 Tip 4: Reorder Anytime
- Drag blocks out of sections to un-nest them
- Drag between sections to reorganize
- The system prevents invalid operations (can't drop a section into itself)

---

## Common Workflows

### Workflow 1: Building a Clinical Trial Schema

```
1. Create "Demographics" section
   └── Add: Age, Sex, Race, Weight

2. Create "Baseline Labs" section
   └── Add: Hemoglobin, Creatinine, eGFR

3. Create "Treatment" section
   └── Add: Treatment Arm, Dose, Start Date

4. Create "Outcomes" section
   └── Add: Overall Survival, Progression-Free Survival
```

### Workflow 2: Organizing by Visit

```
1. Create "Screening Visit" section
   └── Create "Vital Signs" subsection
       └── Add: Blood Pressure, Heart Rate, Temperature
   └── Create "Laboratory" subsection
       └── Add: CBC, Chemistry Panel

2. Create "Week 4 Visit" section
   └── (same structure)
```

### Workflow 3: CRF Page Structure

```
1. Create "Page 1: Patient Information" section
2. Create "Page 2: Medical History" section
3. Create "Page 3: Physical Examination" section
```

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Start dragging | Click and hold grip handle |
| Cancel drag | Press ESC |
| Delete block | Hover + Click X |
| Settings | Hover + Click ⚙️ |

---

## Troubleshooting

### Problem: Can't drop inside section
**Solution:** Make sure:
- The section is expanded (click chevron)
- You're dragging a regular block (not another section)
- You see the blue "Drop to add inside section" overlay

### Problem: Block goes to wrong place
**Solution:** 
- Look for the blue indicators (line = before/after, overlay = inside)
- Drop slowly and watch where the highlight appears
- You can always drag it again to fix

### Problem: AI warning appears
**Solution:**
- Read the warning message (it explains the issue)
- Drag the block to a more appropriate section
- Warnings are suggestions - you can ignore if you have a good reason

---

## Advanced: Programmatic Access

If you need to access the nested structure in code:

```typescript
import { getAllBlocks } from './components/protocol-workbench';

// Get all blocks including nested ones
const allBlocks = getAllBlocks(schemaBlocks);

// Find a block's children
const section = blocks.find(b => b.dataType === 'Section');
const children = section?.children || [];

// Check nesting level
function getLevel(blockId: string, blocks: SchemaBlock[], level = 0): number {
  for (const block of blocks) {
    if (block.id === blockId) return level;
    if (block.children) {
      const found = getLevel(blockId, block.children, level + 1);
      if (found > 0) return found;
    }
  }
  return 0;
}
```

---

## Need Help?

- See the AI Suggestions sidebar for real-time recommendations
- Check the Semantic Validation warnings for logical issues
- Use the JSON Preview to verify your structure
- Check the Audit Log to see what changes were made

**Remember:** The system is designed to guide you toward valid clinical trial structures. Trust the AI warnings, but you always have final control!
