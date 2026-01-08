# Endpoint Hierarchy & Statistical Analysis System

## 🎯 Overview
The Protocol Workbench now supports a **three-tier endpoint system** that differentiates between primary, secondary, and exploratory endpoints - critical for clinical trial design and regulatory compliance.

---

## ✅ Feature 1: Endpoint Tier System

### Three-Tier Hierarchy

#### **1. Primary Endpoint** ⭐ (Gold Star)
- **Definition**: The main outcome variable that "powers" the study
- **Purpose**: Sample size calculations, regulatory approval decisions
- **Constraint**: **ONLY ONE per protocol**
- **Visual**: Gold/amber badge with filled star
- **Example**: "Zgon w ciągu 30 dni" (30-day mortality)

```
┌─────────────────────────────────────────┐
│ 🎯 Zgon w ciągu 30 dni                  │
│ Boolean • ⭐ PRIMARY ENDPOINT            │  ← Gold badge
└─────────────────────────────────────────┘
```

#### **2. Secondary Endpoint** ⭐ (Silver Star)
- **Definition**: Additional outcomes that support the study's story
- **Purpose**: Provide broader clinical context, explore mechanisms
- **Constraint**: Multiple allowed
- **Visual**: Silver/slate badge with star
- **Examples**: 
  - "Sukces techniczny" (Technical success)
  - "Udar" (Stroke)
  - "Re-interwencja" (Re-intervention)

```
┌─────────────────────────────────────────┐
│ 🎯 Sukces techniczny                    │
│ Boolean • ⭐ SECONDARY                   │  ← Silver badge
└─────────────────────────────────────────┘
```

#### **3. Exploratory Endpoint** 🔬 (Purple Badge)
- **Definition**: New/experimental measures for hypothesis generation
- **Purpose**: Future research directions, pilot data
- **Constraint**: Multiple allowed
- **Visual**: Purple badge with sparkles icon
- **Example**: "Kolejność rewaskularyzacji [v1.3]" (Revascularization order - new field)

```
┌─────────────────────────────────────────┐
│ 🎯 Kolejność rewaskularyzacji           │
│ Ranked-Matrix • 🔬 EXPLORATORY [v1.3]   │  ← Purple badge
└─────────────────────────────────────────┘
```

---

## 🚀 How to Use

### Setting an Endpoint Tier

#### **Method 1: Star Dropdown (Quick)**
1. Add an Outcome variable to your schema
2. Click the **gold star icon** next to the field
3. Select from dropdown:
   - ⭐ **Primary** (gold)
   - ⭐ **Secondary** (silver)
   - 🔬 **Exploratory** (purple)

#### **Method 2: Schema Generator Modal (Detailed)**
1. Add a variable (any type)
2. Click **Settings** (⚙️) icon to open Schema Generator
3. Set **Variable Role** = "Outcome"
4. Select **Endpoint Tier**:
   - Primary / Secondary / Exploratory
5. Optionally set **Statistical Analysis Method**
6. Save

### Removing an Endpoint Tier
Click the **minus icon** (−) that appears next to assigned endpoints.

---

## 📊 Feature 2: Statistical Analysis Intent

### Why It Matters
Different endpoint types require different statistical tests. The AI Persona uses this to:
- **Focus citations** on appropriate methodology
- **Validate** power calculations
- **Generate** regulatory-compliant reports

### Analysis Method Mapping

| Data Type | Default Analysis | Use Case |
|-----------|------------------|----------|
| **Boolean** | Frequency Test (Fisher's Exact) | Presence/absence (e.g., Type I endoleak) |
| **Continuous** | Mean Comparison (t-test) | Numeric changes (e.g., rSO2 decrease) |
| **Date** | Survival Analysis (Kaplan-Meier) | Time-to-event (e.g., days to death) |
| **Categorical** | Chi-square | Group comparisons (e.g., complication grades) |
| **Ranked-Matrix** | Non-parametric (Wilcoxon) | Ordinal data (e.g., mRS score 0–6) |

### Example: Primary Endpoint Configuration

```
Field Name: Zgon w ciągu 30 dni
Data Type:  Boolean
Role:       Outcome
Endpoint:   ⭐ PRIMARY

📈 Statistical Analysis Method:
   → Survival Analysis (Kaplan-Meier)
   
Result: AI Persona will prioritize:
- Survival curve citations
- Hazard ratio calculations
- Power analysis for binary time-to-event data
```

---

## 🎨 Visual Design System

### Badge Colors

```css
/* Primary Endpoint */
bg-amber-100 
text-amber-700 
border-amber-300
fill-amber-600  ← Star filled with gold

/* Secondary Endpoint */
bg-slate-200 
text-slate-700 
border-slate-400
fill-slate-500  ← Star filled with silver

/* Exploratory */
bg-purple-100 
text-purple-700 
border-purple-300
(uses Sparkles icon, not Star)
```

### Icons
- **Primary/Secondary**: `<Star>` (filled)
- **Exploratory**: `<Sparkles>`
- **Remove Tier**: `<Minus>`

---

## 🧪 Testing Scenarios

### Scenario 1: SAFE-ARCH Primary Endpoint
1. Add "Zgon w ciągu 30 dni" (Boolean)
2. Click gold star → Select "Primary"
3. Verify: Gold badge appears, validation passes
4. Try to add second primary → Should clear first primary automatically

### Scenario 2: Multiple Secondary Endpoints
1. Add "Sukces techniczny" → Set Secondary
2. Add "Udar" → Set Secondary
3. Add "Typ I endoleak" → Set Secondary
4. Verify: All show silver stars, no conflicts

### Scenario 3: Exploratory with Version Tag
1. Add "Kolejność rewaskularyzacji" (Ranked Matrix)
2. Set version: v1.3 (purple)
3. Set tier: Exploratory
4. Verify: Both purple badge and purple version tag appear

### Scenario 4: Statistical Analysis Auto-Suggestion
1. Add "rSO2 decrease" (Continuous)
2. Set Role = Outcome, Tier = Secondary
3. Open Settings → Analysis Method
4. Verify: Shows "Mean Comparison (t-test)", "ANOVA", "Linear Regression"

---

## 🔄 Validation Rules

### Rule 1: One Primary Maximum
- **Constraint**: Only one field can be Primary at a time
- **Behavior**: Setting a new Primary automatically clears the previous one
- **Error State**: N/A (enforced programmatically)

### Rule 2: Status Message Updates
```
Before Primary:  "Status: Awaiting Primary Outcome Selection"
After Primary:   "Status: Schema Ready for Data Ingestion"
```

### Rule 3: Endpoint Badge Display Priority
If both `isPrimary` (legacy) and `endpointTier` exist:
1. Show `endpointTier` badge (new system)
2. Fallback to `isPrimary` only if `endpointTier` is null

---

## 📋 Schema Block Interface Updates

### New Fields

```typescript
interface SchemaBlock {
  // ... existing fields
  
  // NEW: Endpoint tier system
  isPrimary?: boolean;  // DEPRECATED - use endpointTier
  endpointTier?: 'primary' | 'secondary' | 'exploratory' | null;
  
  // NEW: Statistical analysis intent
  analysisMethod?: 'survival' | 'frequency' | 'mean-comparison' | 'non-parametric' | 'chi-square' | null;
}
```

### Enumeration Templates

```typescript
const enumerationTemplates = {
  vascularDevices: ['BEVAR', 'TEVAR', 'EVAR', 'IBD4', 'Open Repair'],
  toxicityGrades: ['Grade 0', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
  yesNoUnknown: ['Yes', 'No', 'Unknown'],
  anatomicalZones: ['Zone 0', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4'],
  vessels: ['BCT', 'LCCA', 'LSA', 'RCCA', 'RSCA'],
};
```

### Analysis Methods by Data Type

```typescript
const analysisMethodsByType: Record<DataType, string[]> = {
  'Continuous': ['Mean Comparison (t-test)', 'ANOVA', 'Linear Regression'],
  'Boolean': ['Frequency Test (Fisher)', 'Odds Ratio', 'Chi-square'],
  'Categorical': ['Chi-square', 'Frequency Distribution'],
  'Date': ['Survival Analysis (Kaplan-Meier)', 'Time-to-Event'],
  'Ranked-Matrix': ['Non-parametric (Wilcoxon)', 'Mann-Whitney U'],
  // ...
};
```

---

## 🎓 Clinical Use Cases

### Use Case 1: Vascular Surgery Trial (SAFE-ARCH)
```
Primary:      30-day mortality (Boolean → Survival Analysis)
Secondary 1:  Technical success (Boolean → Frequency Test)
Secondary 2:  Stroke (Boolean → Odds Ratio)
Secondary 3:  New neurological deficit (Boolean → Fisher's Exact)
Exploratory:  Revascularization order (Ranked-Matrix → Wilcoxon)
```

### Use Case 2: Oncology Trial
```
Primary:      Overall Survival in months (Continuous → Kaplan-Meier)
Secondary 1:  Progression-Free Survival (Continuous → Survival Analysis)
Secondary 2:  Tumor Response Grade (Categorical → Chi-square)
Exploratory:  Biomarker expression levels (Continuous → Linear Regression)
```

### Use Case 3: Device Safety Study
```
Primary:      Any Major Adverse Event (Boolean → Frequency Test)
Secondary 1:  Device migration >5mm (Continuous → t-test)
Secondary 2:  Endoleak classification (Categorical → Chi-square)
Secondary 3:  Quality of Life score (Ordinal → Non-parametric)
Exploratory:  Novel imaging marker (Continuous → ANOVA)
```

---

## 🧬 AI Persona Integration

### How the Persona Uses This Data

#### 1. **Primary Endpoint Focus**
When a field is marked **Primary**, the AI Persona:
- Prioritizes literature on that specific outcome
- Validates sample size calculations
- Checks regulatory precedents (FDA, EMA guidelines)
- Focuses safety review on primary-related adverse events

#### 2. **Secondary Endpoint Context**
- Provides supporting evidence
- Explores correlations with predictors
- Suggests composite endpoints

#### 3. **Exploratory Signals**
- Flags as "hypothesis-generating"
- Suggests future trial designs
- Notes limitations (underpowered for definitive conclusions)

### Example Persona Output

```
┌────────────────────────────────────────────────────┐
│ 🤖 Clinical Safety Reviewer Persona                │
├────────────────────────────────────────────────────┤
│ PRIMARY FOCUS: 30-day mortality (Survival Analysis)│
│                                                    │
│ Relevant Citations:                                │
│ • Kaplan-Meier methods (Kaplan & Meier, 1958)     │
│ • Log-rank test for survival (Mantel, 1966)       │
│ • Power: N=250 for HR=0.70 at α=0.05             │
│                                                    │
│ SECONDARY ENDPOINTS:                               │
│ • Technical success correlates with mortality     │
│   (r=-0.42, p<0.001)                              │
│ • Stroke incidence: 3.2% (Fisher's p=0.048)       │
│                                                    │
│ EXPLORATORY:                                       │
│ • Revascularization order shows trend (p=0.08)    │
│   → Recommend powered follow-up study             │
└────────────────────────────────────────────────────┘
```

---

## 🚦 Summary Checklist

### Implemented Features
- [x] Three-tier endpoint system (Primary/Secondary/Exploratory)
- [x] Gold/Silver/Purple visual badges
- [x] Star dropdown menu for quick tier selection
- [x] Settings modal with full role/tier/analysis configuration
- [x] Validation: Only 1 primary endpoint allowed
- [x] Statistical analysis method auto-suggestions
- [x] Enumeration templates (Vascular, Toxicity, Yes/No/Unknown)
- [x] Analysis methods mapped to data types
- [x] Remove endpoint tier functionality
- [x] Legacy `isPrimary` support for backwards compatibility

### Next Steps (Future)
- [ ] Composite endpoints (combine multiple outcomes)
- [ ] Power calculation integration
- [ ] Sample size recommendations based on endpoint type
- [ ] Export statistical analysis plan (SAP) document
- [ ] Endpoint grouping for regulatory reports

---

## 📚 Regulatory Alignment

### FDA/EMA Guidelines
- **Primary Endpoint**: Must be pre-specified, clinically meaningful, adequately powered
- **Secondary Endpoints**: Can be exploratory but should be clearly differentiated
- **Multiplicity**: Consider alpha adjustment for multiple comparisons

### ICH E9 (Statistical Principles)
> "The primary variable should be the variable capable of providing the most clinically relevant and convincing evidence directly related to the primary objective of the trial."

This system ensures compliance by:
1. **Forcing** explicit primary endpoint declaration
2. **Documenting** hierarchy before data collection
3. **Linking** endpoints to appropriate statistical methods
4. **Flagging** exploratory analyses to avoid Type I error inflation

---

## 🎉 Result

The Protocol Workbench is now a **truly universal protocol architect** that can handle any clinical trial design - from simple safety studies to complex multi-arm efficacy trials - with full regulatory compliance and statistical rigor! 🚀
