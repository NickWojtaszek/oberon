# Universal Protocol Architect - Implementation Roadmap

## Current State Analysis
✅ Basic Schema Generator modal with data types  
✅ Version tagging system  
✅ Dependency modal (Logic Link)  
✅ Primary outcome star (single)  
✅ Basic categorical grid system  
⚠️ **Missing**: Full enumeration editor  
⚠️ **Missing**: Unit mapping UI  
⚠️ **Missing**: Primary vs Secondary endpoint hierarchy  
⚠️ **Missing**: Statistical analysis intent  
⚠️ **Missing**: Branching logic visual interface  

---

## 🎯 Implementation Phases

### **PHASE 1: Enhanced Enumeration & Unit Mapping** (EASY WINS)
**Status**: 🔵 Ready to implement  
**Time**: 15 minutes  
**Impact**: HIGH - Makes categorical and continuous types fully functional  

#### 1A. Enumeration Editor for Categorical Types
- [x] Already partially exists in Settings modal
- [ ] Add reordering capability (drag handles)
- [ ] Add "Add from template" (BEVAR, TEVAR, EVAR, IBD4)
- [ ] Visual preview of dropdown

**UI Location**: Schema Generator modal → Options section

#### 1B. Unit Mapping for Continuous Types
- [x] Unit field exists in state
- [ ] Add common unit templates dropdown
- [ ] Add custom unit input
- [ ] Visual indicator showing unit in block display

**UI Location**: Schema Generator modal → Unit section (appears when Continuous selected)

---

### **PHASE 2: Primary vs Secondary Endpoints** (CRITICAL)
**Status**: 🟡 In progress  
**Time**: 20 minutes  
**Impact**: CRITICAL - Core statistical hierarchy  

#### 2A. Endpoint Hierarchy System
Current: Single "Primary" star ⭐  
New: Three-tier system

```
Primary Endpoint   → Gold Star ⭐ (max 1 per protocol)
Secondary Endpoint → Silver Star ⭐ (multiple allowed)
Exploratory        → Purple Badge 🔬 (hypothesis-generating)
```

**Implementation:**
- [ ] Change `isPrimary: boolean` to `endpointTier: 'primary' | 'secondary' | 'exploratory' | null`
- [ ] Add endpoint selector dropdown in HUD
- [ ] Visual badges on blocks
- [ ] Validation: Only 1 primary allowed

#### 2B. Visual Indicators
```
┌─────────────────────────────────────────┐
│ 🎯 Zgon w ciągu 30 dni                  │
│ Boolean • ⭐ PRIMARY ENDPOINT            │  ← Gold badge
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🎯 Sukces techniczny                    │
│ Boolean • ⭐ SECONDARY                   │  ← Silver badge
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🎯 Kolejność rewaskularyzacji           │
│ Ranked-Matrix • 🔬 EXPLORATORY [v1.3]   │  ← Purple badge
└─────────────────────────────────────────┘
```

---

### **PHASE 3: Statistical Analysis Intent** (ADVANCED)
**Status**: 🟡 Planning  
**Time**: 25 minutes  
**Impact**: HIGH - AI Persona focus & regulatory alignment  

#### 3A. Analysis Method Mapping
Each endpoint type → recommended statistical test

| Data Type | Endpoint Example | Default Analysis |
|-----------|------------------|------------------|
| **Continuous** | rSO2 decrease | t-test / ANOVA |
| **Boolean** | Type I Endoleak | Fisher's Exact / OR |
| **Time-to-Event** | Days to death | Kaplan-Meier |
| **Ordinal** | mRS score | Wilcoxon / Mann-Whitney |
| **Categorical** | Complication grade | Chi-square |

**Implementation:**
- [ ] Add `analysisMethod` field to SchemaBlock
- [ ] Add dropdown in Schema Generator modal (only for Outcome role)
- [ ] Auto-suggest based on data type
- [ ] Display in validation sidebar

#### 3B. UI in Schema Generator Modal
```
┌─────────────────────────────────────────┐
│ ⚙️ Schema Generator                     │
├─────────────────────────────────────────┤
│ Field Name: [Zgon w ciągu 30 dni]      │
│ Data Type:  [Boolean ▼]                │
│ Role:       [Outcome ▼]                │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📊 Statistical Analysis Intent      │ │  ← NEW SECTION
│ │                                     │ │
│ │ Endpoint Tier: [⭐ Primary ▼]       │ │
│ │ Analysis Type: [Survival Analysis▼] │ │
│ │                                     │ │
│ │ Suggested: Kaplan-Meier curves     │ │
│ │ Power calculation: 0.80 at α=0.05  │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

### **PHASE 4: Visual Branching Logic** (ADVANCED)
**Status**: 🔴 Future  
**Time**: 30 minutes  
**Impact**: MEDIUM - Better conditional field management  

#### 4A. Enhanced Dependency Modal
Current: Simple parent field selection  
New: Visual "IF-THEN" builder

```
┌─────────────────────────────────────────┐
│ 🔗 Logic Link: Conditional Display      │
├─────────────────────────────────────────┤
│ IF   [Wykonano angio-TK głowy ▼]        │
│ IS   [Tak ▼]                            │
│ THEN SHOW [SEKCJA E: Krążenie przednie]│
│                                         │
│ Add additional condition [+]            │
│                                         │
│ Logic: [ALL conditions must match ▼]   │
│        • ALL (AND logic)                │
│        • ANY (OR logic)                 │
└─────────────────────────────────────────┘
```

**Implementation:**
- [ ] Replace simple parent selection with condition builder
- [ ] Add multi-condition support (AND/OR)
- [ ] Visual tree view showing dependency chains
- [ ] Circular dependency detection

#### 4B. Visual Tree Indicators
```
┌─────────────────────────────────────────┐
│ ☑️ Wykonano angio-TK głowy              │
│ Boolean                                 │
└─────────────────────────────────────────┘
        │ IF = Tak
        ↓ [🔗]
┌─────────────────────────────────────────┐
│ 📁 SEKCJA E: Krążenie przednie          │  ← Conditional
│ Section • 4 fields • 🔗 CONDITIONAL     │
└─────────────────────────────────────────┘
```

---

### **PHASE 5: Composite Endpoints** (FUTURE)
**Status**: 🔴 Future  
**Time**: 30 minutes  
**Impact**: MEDIUM - Advanced regulatory reporting  

#### 5A. Endpoint Grouping
Allow combining multiple endpoints into composites:

```
Composite: "Major Adverse Events (MAE)"
  ├─ Zgon w ciągu 30 dni
  ├─ Udar
  ├─ Zawał serca
  └─ Re-interwencja
```

**Implementation:**
- [ ] Add "Composite" data type
- [ ] Multi-select children from existing outcomes
- [ ] Display as hierarchical group
- [ ] Auto-calculate combined event rates

---

## 🚀 Implementation Priority

### **Sprint 1: Quick Wins** (Today)
1. ✅ Enhanced unit selector for Continuous types
2. ✅ Improved enumeration editor with templates
3. ✅ Reordering capability for options

### **Sprint 2: Critical Hierarchy** (Today)
1. ✅ Primary vs Secondary vs Exploratory endpoints
2. ✅ Visual badge system
3. ✅ Validation: max 1 primary

### **Sprint 3: Statistical Intent** (Next)
1. Analysis method selector
2. Auto-suggestions based on data type
3. Display in validation sidebar

### **Sprint 4: Advanced Logic** (Future)
1. Visual IF-THEN builder
2. Multi-condition support
3. Dependency tree view

### **Sprint 5: Composites** (Future)
1. Composite endpoint grouping
2. Hierarchical display

---

## 📋 Detailed Implementation Plan

### **STEP 1: Enhanced Unit Selector** (5 min)
**File**: `/components/ProtocolWorkbench.tsx`
**Changes**:
- Add unit template dropdown (common units)
- Position in Settings modal for Continuous types
- Visual unit display in block cards

### **STEP 2: Enumeration Templates** (5 min)
**File**: `/components/ProtocolWorkbench.tsx`
**Changes**:
- Add template dropdown for common enumerations
- Templates: Treatment types, Response grades, Anatomical zones
- Quick-add buttons

### **STEP 3: Endpoint Hierarchy** (10 min)
**File**: `/components/ProtocolWorkbench.tsx`
**Changes**:
- Update SchemaBlock interface: `endpointTier` field
- Change star button to dropdown menu
- Add visual badges (gold/silver/purple)
- Validation rule: max 1 primary

### **STEP 4: Analysis Intent** (15 min)
**File**: `/components/ProtocolWorkbench.tsx`
**Changes**:
- Add `analysisMethod` to SchemaBlock
- Add dropdown in Settings modal
- Auto-suggest based on data type
- Display in validation sidebar

### **STEP 5: Enhanced Branching** (20 min)
**File**: `/components/ProtocolWorkbench.tsx`
**Changes**:
- Rebuild Dependency modal as IF-THEN builder
- Add condition value selector
- Multi-condition support
- Visual indicators in tree

---

## 🎨 Visual Design System

### Endpoint Badges
```css
Primary:     bg-amber-100 text-amber-700 border-amber-300 (Gold)
Secondary:   bg-slate-200 text-slate-700 border-slate-400 (Silver)
Exploratory: bg-purple-100 text-purple-700 border-purple-300 (Purple)
```

### Analysis Method Icons
```
Survival Analysis:  ⏱️
Frequency Test:     📊
Mean Comparison:    📈
Non-parametric:     📉
Chi-square:         🔢
```

### Conditional Indicators
```
Conditional Field:  🔗 badge + dotted border
Parent Field:       🔗 icon in HUD
Dependency Chain:   Visual connecting lines
```

---

## 🧪 Testing Scenarios

### Scenario 1: SAFE-ARCH Primary Endpoint
1. Add "Zgon w ciągu 30 dni" (Boolean)
2. Set Role = Outcome
3. Set Tier = Primary (⭐ gold)
4. Set Analysis = Survival (Kaplan-Meier)
5. Verify: Gold star badge, validation passes

### Scenario 2: Secondary Endpoint Chain
1. Add "Sukces techniczny" (Boolean)
2. Set Tier = Secondary
3. Add "Udar" (Boolean)
4. Set Tier = Secondary
5. Verify: Both show silver stars, no conflict

### Scenario 3: Conditional Section
1. Add "Wykonano angio-TK" (Boolean)
2. Add "SEKCJA E" (Section)
3. Open Logic Link on SEKCJA E
4. Set: IF [Wykonano angio-TK] IS [Tak]
5. Verify: 🔗 badge appears, dependency tracked

### Scenario 4: Enumeration Templates
1. Add "Typ stentgraftu" (Categorical)
2. Click "Use Template" → Vascular devices
3. Auto-populate: BEVAR, TEVAR, EVAR, IBD4
4. Reorder by dragging
5. Save and verify dropdown preview

---

## 📊 Success Metrics

| Feature | Status | Impact Score |
|---------|--------|--------------|
| Unit selector | 🟢 DONE | 8/10 |
| Enumeration templates | 🟡 IN PROGRESS | 9/10 |
| Endpoint hierarchy | 🟡 IN PROGRESS | 10/10 |
| Analysis intent | 🔴 TODO | 9/10 |
| Visual branching | 🔴 TODO | 7/10 |
| Composite endpoints | 🔴 FUTURE | 6/10 |

---

## 🚦 Starting Point: PHASE 1 & 2

Let's implement the quick wins and critical hierarchy first:
1. Enhanced unit selector with templates
2. Improved enumeration editor
3. Primary vs Secondary endpoint system
4. Visual badge system

Ready to proceed? 🚀
