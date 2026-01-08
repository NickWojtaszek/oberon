# AI-Powered Universal Schema Engine - Implementation Plan

## 🎯 Vision
Transform the Protocol Workbench into an **intelligence-led** system where a "Senior Statistician" AI Persona actively guides schema construction using locked reference knowledge (SAFE-ARCH v1.3, SVS/STS Guidelines, CDISC standards).

---

## 📋 Implementation Phases

### **PHASE 1: AI Statistician Sidebar** (20 min)
**Status**: 🔵 Ready to implement  
**Impact**: HIGH - Core AI guidance feature

#### Components:
1. **Right-side sliding panel** (280px width)
2. **"Statistician's Workbench"** header
3. **Suggestion cards** with:
   - Icon (lightbulb/book)
   - Suggestion text
   - Reference source
   - [Apply Suggestion] button

#### Example Suggestions:
```
┌─────────────────────────────────────────┐
│ 💡 AI Suggestion                        │
├─────────────────────────────────────────┤
│ I see you added "NIHSS" [v1.3].        │
│                                         │
│ Based on clinical standards, this      │
│ should be an Ordinal type with values  │
│ 0-42.                                   │
│                                         │
│ 📚 Source: NIH Stroke Scale Standards  │
│                                         │
│ [Apply Suggestion] [Dismiss]           │
└─────────────────────────────────────────┘
```

---

### **PHASE 2: Locked Source Indicators** (10 min)
**Status**: 🔵 Ready to implement  
**Impact**: MEDIUM - Builds trust in AI suggestions

#### Components:
1. **Book icon** (📚) next to AI-suggested fields
2. **Hover tooltip** showing:
   - Reference document
   - Section/page
   - Confidence level

#### Visual:
```
┌─────────────────────────────────────────┐
│ 🎯 NIHSS Score 📚                       │  ← Book icon
│ Ordinal (0-42) • [S] SECONDARY          │
└─────────────────────────────────────────┘

Hover tooltip:
┌─────────────────────────────────────────┐
│ 📚 Locked Reference                     │
│ Source: NIH Stroke Scale (2023)        │
│ Applied from: SAFE-ARCH v1.3, Sec. E   │
│ Confidence: 98%                         │
└─────────────────────────────────────────┘
```

---

### **PHASE 3: Enhanced Role Badges** (15 min)
**Status**: 🔵 Ready to implement  
**Impact**: HIGH - Instant visual hierarchy

#### Badge System:
```
[P] = Primary Endpoint (Gold: bg-amber-100)
[S] = Secondary Endpoint (Silver: bg-slate-200)
[C] = Covariate/Predictor (Blue: bg-blue-100)
[X] = Exploratory (Purple: bg-purple-100)
```

#### Visual in Tree:
```
Demographics
  ├─ Age [C]                              ← Blue badge
  ├─ Sex [C]                              ← Blue badge
  └─ Comorbidities [C]                    ← Blue badge

Endpoints
  ├─ 30-day Mortality [P]                 ← Gold badge
  ├─ Technical Success [S]                ← Silver badge
  ├─ Stroke [S]                           ← Silver badge
  └─ New Biomarker [X]                    ← Purple badge
```

---

### **PHASE 4: Logic Branch Visual Connectors** (25 min)
**Status**: 🟡 Advanced  
**Impact**: HIGH - Shows conditional relationships

#### Components:
1. **Connecting lines** between parent/child fields
2. **Condition labels** on lines
3. **Collapse/expand** for complex trees

#### Visual:
```
┌─────────────────────────────────────────┐
│ ☑️ Wykonano angio-TK głowy [C]          │
└─────────────────────────────────────────┘
        │ 
        │ IF = "Tak" 🔗
        ↓
┌─────────────────────────────────────────┐
│ 📁 SEKCJA E: Krążenie przednie          │
│    (Conditional Section)                │
│    ├─ RCCA Status [C]                   │
│    ├─ LCCA Status [C]                   │
│    └─ Vertebral Artery [C]              │
└─────────────────────────────────────────┘
```

---

### **PHASE 5: Analysis Intent in Metadata Modal** (15 min)
**Status**: 🔵 Ready to implement  
**Impact**: HIGH - Prepares for Statistics tab

#### Components:
1. **Statistical Test dropdown** (pre-filled by AI)
2. **Sample size hint**
3. **Power calculation preview**

#### UI in Schema Generator Modal:
```
┌─────────────────────────────────────────┐
│ 📊 Statistical Analysis Intent          │
├─────────────────────────────────────────┤
│ Endpoint Tier: [⭐ Primary]             │
│                                         │
│ Statistical Test:                       │
│ [Kaplan-Meier Survival Analysis ▼]     │
│                                         │
│ 💡 AI Recommendation:                   │
│ Based on "Date" data type and primary  │
│ endpoint status, Kaplan-Meier is the   │
│ gold standard for time-to-event        │
│ analysis.                               │
│                                         │
│ Sample Size Estimate:                   │
│ • N = 250 for HR=0.70, α=0.05, β=0.20  │
│ • Events needed: ~85                    │
│                                         │
│ 📚 Reference: Schoenfeld (1983)         │
└─────────────────────────────────────────┘
```

---

## 🚀 Implementation Priority

### **Sprint 1: Core AI Guidance** (TODAY)
1. ✅ AI Statistician Sidebar (right panel)
2. ✅ Suggestion cards with apply/dismiss
3. ✅ Enhanced role badges [P] [S] [C] [X]

### **Sprint 2: Visual Intelligence** (NEXT)
1. ✅ Locked source indicators (book icon)
2. ✅ Reference tooltips
3. ✅ Analysis intent section in modal

### **Sprint 3: Advanced Logic** (FUTURE)
1. Visual branch connectors
2. Dependency tree visualization
3. Circular dependency detection

---

## 📊 AI Suggestion Engine Logic

### **Trigger Events**
The AI Statistician sidebar updates when:
1. User adds a new field
2. User changes data type
3. User sets role/endpoint tier
4. User imports CSV with new columns
5. User creates conditional field

### **Suggestion Types**

#### **Type 1: Data Type Correction**
```typescript
{
  trigger: "User creates field named 'NIHSS'",
  suggestion: {
    type: "data-type",
    message: "NIHSS is a standard stroke scale (0-42). Recommend Ordinal type.",
    action: { dataType: "Ranked-Matrix", options: Array(43).fill(0).map((_, i) => i.toString()) },
    source: "NIH Stroke Scale Standards",
    confidence: 0.98
  }
}
```

#### **Type 2: Endpoint Classification**
```typescript
{
  trigger: "User creates Boolean field named '30-day mortality'",
  suggestion: {
    type: "endpoint-tier",
    message: "Mortality is typically a Primary Endpoint. Set as Primary with Survival Analysis?",
    action: { endpointTier: "primary", analysisMethod: "survival" },
    source: "FDA Guidance for Cardiovascular Trials",
    confidence: 0.95
  }
}
```

#### **Type 3: Statistical Test Mismatch**
```typescript
{
  trigger: "User sets Categorical field as outcome with t-test",
  suggestion: {
    type: "analysis-warning",
    message: "⚠️ T-test invalid for categorical data. Use Chi-square instead.",
    action: { analysisMethod: "chi-square" },
    source: "Statistical Methods in Medical Research",
    confidence: 1.0
  }
}
```

#### **Type 4: Missing Standards Field**
```typescript
{
  trigger: "User creates Section 'Vascular Anatomy' but missing standard vessels",
  suggestion: {
    type: "schema-completion",
    message: "SAFE-ARCH v1.3 includes standard vessel fields (RCCA, LCCA, LSA, BCT). Add these?",
    action: { addFields: ["RCCA Status", "LCCA Status", "LSA Status", "BCT Status"] },
    source: "SAFE-ARCH CRF v1.3, Section C",
    confidence: 0.92
  }
}
```

#### **Type 5: Version Tagging**
```typescript
{
  trigger: "User creates field matching v1.3 new field",
  suggestion: {
    type: "version-tag",
    message: "'Kolejność rewaskularyzacji' is new in v1.3. Tag with purple [v1.3]?",
    action: { versionTag: "v1.3", versionColor: "purple" },
    source: "SAFE-ARCH CRF Changelog",
    confidence: 0.99
  }
}
```

---

## 🎨 Visual Design Specifications

### **AI Sidebar Styling**
```css
/* Container */
width: 280px
bg-gradient-to-b from-indigo-50 to-white
border-l: 2px solid slate-200
shadow-lg

/* Suggestion Card */
bg-white
border: 1px solid indigo-200
rounded-lg
p-4
shadow-sm
hover:shadow-md transition

/* Apply Button */
bg-indigo-600
text-white
px-4 py-2
rounded-md
hover:bg-indigo-700
```

### **Role Badge Styling**
```css
[P] Primary:     bg-amber-100 text-amber-800 border-amber-400
[S] Secondary:   bg-slate-200 text-slate-800 border-slate-400
[C] Covariate:   bg-blue-100 text-blue-800 border-blue-400
[X] Exploratory: bg-purple-100 text-purple-800 border-purple-400
```

### **Book Icon (Locked Source)**
```css
Icon: BookMarked (lucide-react)
Color: text-indigo-600
Size: w-4 h-4
Position: Absolute right corner of block card
```

---

## 🧪 Testing Scenarios

### **Scenario 1: AI Detects Standard Scale**
1. User creates custom field: "mRS Score"
2. AI suggests: "Modified Rankin Scale (0-6). Set as Ordinal?"
3. User clicks [Apply]
4. **Verify**: Field becomes Ordinal with options 0-6, tagged with book icon

### **Scenario 2: AI Prevents Statistical Error**
1. User creates Categorical field: "Complication Grade"
2. User sets Analysis Method: "t-test"
3. AI shows warning: "⚠️ Invalid test. Use Chi-square."
4. User clicks [Apply]
5. **Verify**: Method changes to Chi-square

### **Scenario 3: AI Suggests Missing Fields**
1. User creates Section: "Cerebrovascular Anatomy"
2. AI suggests: "Add RCCA, LCCA, LSA, BCT per SAFE-ARCH v1.3?"
3. User clicks [Apply]
4. **Verify**: 4 new fields added with correct types

### **Scenario 4: Version Auto-Tagging**
1. User creates field: "Kolejność rewaskularyzacji"
2. AI suggests: "This is v1.3 field. Tag with purple?"
3. User clicks [Apply]
4. **Verify**: Field shows [v1.3] purple badge + book icon

---

## 📚 Locked Knowledge Library Structure

### **Knowledge Base Schema**
```typescript
interface LockedKnowledge {
  id: string;
  source: string; // "SAFE-ARCH v1.3", "SVS/STS Guidelines", "CDISC"
  section?: string;
  fieldDefinitions: {
    name: string;
    aliases: string[]; // ["NIHSS", "NIH Stroke Scale"]
    dataType: DataType;
    options?: string[];
    unit?: string;
    role?: RoleTag;
    endpointTier?: 'primary' | 'secondary' | 'exploratory';
    analysisMethod?: string;
    reference: string;
  }[];
}
```

### **Example Entry: NIHSS**
```typescript
{
  id: "nihss-stroke-scale",
  source: "NIH Stroke Scale (2023)",
  section: "Neurological Assessment",
  fieldDefinitions: [{
    name: "NIHSS Score",
    aliases: ["NIHSS", "NIH Stroke Scale", "Stroke Severity"],
    dataType: "Ranked-Matrix",
    options: Array(43).fill(0).map((_, i) => i.toString()),
    unit: "points",
    role: "Outcome",
    endpointTier: "secondary",
    analysisMethod: "non-parametric",
    reference: "National Institute of Health. NIH Stroke Scale. 2023."
  }]
}
```

---

## 🎯 Success Metrics

| Feature | Status | Impact Score |
|---------|--------|--------------|
| AI Sidebar | 🟢 READY | 10/10 |
| Role badges [P][S][C] | 🟢 READY | 9/10 |
| Locked source icons | 🟢 READY | 8/10 |
| Analysis intent modal | 🟢 READY | 9/10 |
| Logic branch connectors | 🟡 ADVANCED | 7/10 |

---

## 🚦 Starting Implementation

**Phase 1**: AI Sidebar + Role Badges + Locked Sources  
**Phase 2**: Analysis Intent in Modal  
**Phase 3**: Visual Logic Connectors  

Ready to code! 🚀
