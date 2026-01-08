# Categorical Grid - Complete Guide

## Overview
The **Categorical Grid** data type is designed for clinical scenarios where multiple items (vessels, organs, sites, time points) need to be assessed with the same categorical options. This is perfect for bulk analysis and aggregate queries.

---

## What Is a Categorical Grid?

### Structure:
- **Rows** = Items (vessels, organs, lymph nodes, time points, anatomical sites, etc.)
- **Columns** = Category options (statuses, grades, findings, responses, etc.)
- **Values** = Each item gets ONE category selected

### Example Use Cases:

#### 1. Vascular Assessment
```
Items:      RCCA, LCCA, LSA, BCT
Categories: Normal, Stenosis <50%, Stenosis >50%, Occluded
```

#### 2. Multi-Organ Toxicity
```
Items:      Liver, Kidney, Lung, Heart, Bone Marrow
Categories: Grade 0, Grade 1, Grade 2, Grade 3, Grade 4
```

#### 3. Lymph Node Involvement
```
Items:      Cervical, Axillary, Mediastinal, Abdominal, Inguinal
Categories: Normal, Enlarged, Suspicious, Biopsy-proven malignant
```

#### 4. Temporal Assessments
```
Items:      Baseline, Week 4, Week 8, Week 12, End of Study
Categories: Complete Response, Partial Response, Stable, Progressive
```

---

## Real Example: Aortic Dissection Protocol

### Polish Clinical Form:
```
Wtorne wrota rozwarstwienia w tt. doglowowych

RCCA:  [ ] Ucisniety k. prawdziwy   [ ] Stent w trakcie   [ ] Bez stentu   [ ] Brak zajecia
LCCA:  [ ] Ucisniety k. prawdziwy   [ ] Stent w trakcie   [ ] Bez stentu   [ ] Brak zajecia
LSA:   [ ] Ucisniety k. prawdziwy   [ ] Stent w trakcie   [ ] Bez stentu   [ ] Brak zajecia
BCT:   [ ] Ucisniety k. prawdziwy   [ ] Stent w trakcie   [ ] Bez stentu   [ ] Brak zajecia
```

### How to Create in Protocol Workbench:

**Step 1: Add Custom Field**
- Click **"Custom Field"** in the Structural category

**Step 2: Configure Basic Details**
- **Field Name**: `Wtorne wrota rozwarstwienia w tt. doglowowych`
  - (Or English: `Secondary Entry Tears Assessment`)
- **Data Type**: Select **"Categorical Grid"**

**Step 3: Define Items (Rows)**
```
RCCA
LCCA
LSA
BCT
```

**Step 4: Define Categories (Columns)**
```
Ucisniety k. prawdziwy
Stent w trakcie
Bez stentu
Brak zajecia
```

**Step 5: Version & Save**
- Set version: `v1.3` or `MG` (Green)
- Click "Save Configuration"

---

## How It Appears in the Schema

### Visual Block Display:
```
┌─────────────────────────────────────────────────────┐
│ 📝 Wtorne wrota rozwarstwienia...     [Custom] [v1.3]│
│                                                       │
│ Type: Categorical-Grid    Role: Predictor            │
│                                                       │
│ ╔═══════════════════════════════════════════════╗   │
│ ║ 📊 4 items × 4 categories                     ║   │
│ ║                                                ║   │
│ ║ Items: RCCA, LCCA, LSA +1 more                ║   │
│ ║ Categories: Ucisniety k. prawdziwy, +3 more   ║   │
│ ╚═══════════════════════════════════════════════╝   │
└─────────────────────────────────────────────────────┘
```

- **Purple info box** with Table icon
- Shows item count × category count
- Truncates long lists with "+N more"

---

## JSON DNA Output

When you click "View JSON DNA":

```json
{
  "wtorne_wrota_rozwarstwienia_w_tt_doglowowych": {
    "RCCA": "Ucisniety k. prawdziwy",
    "LCCA": "Bez stentu",
    "LSA": "Brak zajecia",
    "BCT": "Stent w trakcie"
  }
}
```

### Field Definition (in Schema Generator):
```json
{
  "name": "Wtorne wrota rozwarstwienia w tt. doglowowych",
  "type": "Categorical-Grid",
  "items": ["RCCA", "LCCA", "LSA"],
  "categories": ["Ucisniety k. prawdziwy", "Stent w trakcie"],
  "version": "v1.3",
  "custom": true
}
```

---

## Bulk Analysis Examples

### Query 1: How many items had a specific category?
```sql
-- Count items by category across all patients
SELECT 
  item_name,
  category,
  COUNT(*) as count
FROM categorical_grid_data
WHERE category = 'Stent w trakcie'
GROUP BY item_name, category;
```

**Result:**
```
RCCA: 23 patients
LCCA: 18 patients
LSA: 31 patients
BCT: 12 patients
```

### Query 2: Patients with specific finding in ANY item
```sql
SELECT patient_id
FROM categorical_grid_data
WHERE category = 'Ucisniety k. prawdziwy'
GROUP BY patient_id
HAVING COUNT(*) > 0;
```

### Query 3: Distribution of involvement
```sql
SELECT 
  patient_id,
  SUM(CASE WHEN category != 'Brak zajecia' THEN 1 ELSE 0 END) as affected_count
FROM categorical_grid_data
GROUP BY patient_id;
```

**Result:**
```
Patient 001: 3 affected items
Patient 002: 1 affected item
Patient 003: 4 affected items (all)
```

---

## More Use Cases

### 1. Coronary Artery Stenosis
- **Items**: LAD, LCx, RCA, OM1, OM2, D1
- **Categories**: <25%, 25-50%, 50-70%, 70-90%, >90%, Occluded

### 2. Spinal Level Assessment
- **Items**: C1-C2, C3-C4, C5-C6, C7-T1, T1-T2, T2-T3...
- **Categories**: Normal, Disc herniation, Stenosis, Spondylolisthesis, Fracture

### 3. Dermatome Sensory Exam
- **Items**: C5, C6, C7, C8, T1, L2, L3, L4, L5, S1
- **Categories**: Normal, Hyperesthesia, Hypoesthesia, Anesthesia

### 4. Joint Examination
- **Items**: Shoulder, Elbow, Wrist, Hip, Knee, Ankle
- **Categories**: Normal ROM, Limited ROM, Painful, Swollen, Warm

### 5. Cardiac Wall Motion
- **Items**: Anterior, Septal, Inferior, Lateral, Apical
- **Categories**: Normal, Hypokinetic, Akinetic, Dyskinetic

### 6. Treatment Sites (Radiation)
- **Items**: Primary tumor, Regional nodes, Distant mets site 1, Distant mets site 2
- **Categories**: Not treated, Planned, In progress, Completed

### 7. Lab Panel (Multi-Site Testing)
- **Items**: Sample A (Pre-treatment), Sample B (Mid-treatment), Sample C (Post-treatment)
- **Categories**: Negative, Equivocal, Positive, Not collected

---

## Dynamic Validation

The system automatically checks:

✅ **Categorical Grids Configured (1/1)**
- Each categorical grid needs item names and category options defined
- Counter shows configured vs. total
- Red/amber until complete
- Green when all grids fully configured

---

## Benefits for AI Analysis

### 1. Structured Data
Instead of free text, you get:
```json
{
  "RCCA": "Stent w trakcie",
  "LSA": "Ucisniety k. prawdziwy"
}
```

### 2. Bulk Queries
AI Persona can ask:
- "Show me all patients where ANY item has Category X"
- "Calculate percentage of Item A involvement across the cohort"
- "Compare category distribution between Item A and Item B"

### 3. Pattern Recognition
AI can identify:
- Common co-occurrence patterns
- Item-specific outcomes
- Treatment response by anatomical location or time point

---

## Advanced Features

### Nested in Sections
```
📁 SEKCJA E: VASCULAR ASSESSMENT
  ├─ 📝 Supra-aortic vessels (Categorical-Grid)
  │   └─ 4 items × 4 categories
  └─ 📝 Aortic Arch Zones (Categorical-Grid)
      └─ 4 items × 3 categories
```

### Conditional Visibility
Link categorical grid to parent field:
- **Parent**: "CT Angiography Performed" (Boolean)
- **Condition**: Show grid only if "Yes"

### Version Tracking
- Mark as `[v1.1]` when you add new items
- Mark as `[MG]` (green) for validated clinical definitions
- Track changes across protocol versions

---

## Complete Workflow Example

**Scenario**: Multi-Organ Toxicity Assessment Protocol

1. **Create Section**:
   - Name: "Toxicity Assessment"

2. **Add Categorical Grid**:
   - Field: "Organ-Specific Toxicity (CTCAE v5.0)"
   - Items: Liver, Kidney, Lung, Heart, Bone Marrow, GI
   - Categories: Grade 0, Grade 1, Grade 2, Grade 3, Grade 4, Grade 5
   - Version: MG (Green - CTCAE validated)

3. **Add Another Grid**:
   - Field: "Temporal Response Assessment"
   - Items: Baseline, Week 4, Week 8, Week 12, End of Study
   - Categories: Complete Response, Partial Response, Stable Disease, Progressive Disease
   - Version: v2.0 (Blue)

4. **Set Dependencies**:
   - Toxicity grid only visible if "Treatment Started" = Yes

5. **Upload CSV**:
   - System maps: `liver_grade`, `kidney_grade`, `lung_grade`...
   - Auto-aggregates into grid structure

6. **Bulk Analysis**:
   - AI Persona queries: "Show toxicity distribution by organ"
   - Results: Bar chart with 6 organs × 6 grades (36 combinations)

---

## Technical Notes

### Data Storage Format
```json
{
  "item_name": "category_option"
}
```

### CSV Import
System expects either:

**Option A**: Separate columns per item
```csv
rcca_status, lcca_status, lsa_status, bct_status
"Stent w trakcie", "Brak zajecia", "Ucisniety...", "Bez stentu"
```

**Option B**: Long format
```csv
item, category
"RCCA", "Stent w trakcie"
"LCCA", "Brak zajecia"
```

### Validation
- Minimum 1 item required
- Minimum 2 category options required
- All items must have consistent category options
- No duplicate item names

---

## Configuration Tips

### Generic vs. Specific Names

✅ **Good - Generic:**
- Items: Site 1, Site 2, Site 3
- Items: Organ A, Organ B, Organ C
- Items: Time 1, Time 2, Time 3

✅ **Good - Specific:**
- Items: RCCA, LCCA, LSA (vessels)
- Items: Liver, Kidney, Lung (organs)
- Items: Baseline, Month 6, Month 12 (time)

❌ **Avoid - Mixed Types:**
- Don't mix organs and time points in same grid
- Don't mix anatomical locations with treatment types

### Category Options

✅ **Good - Mutually Exclusive:**
- Normal, Abnormal, Not assessed
- Present, Absent, Unknown
- Grade 0, Grade 1, Grade 2, Grade 3

❌ **Avoid - Overlapping:**
- Normal, Mild, Moderate, Severe, Abnormal (redundant)
- Yes, No, Maybe, Unknown, Not sure (overlapping)

---

## Summary

✅ **Categorical Grid** = Universal pattern for multi-item assessments  
✅ **Flexible** = Works for vessels, organs, sites, time points, zones, etc.  
✅ **Bulk analysis ready** for AI Persona queries  
✅ **Nested in sections** for hierarchical CRF structure  
✅ **Version tracked** with regulatory provenance  
✅ **Dynamic validation** ensures complete configuration  
✅ **Custom field** = Create unlimited grids  

**Next Step**: Navigate to Protocols → Click "Custom Field" → Select "Categorical Grid" → Configure your items and categories! 🚀
