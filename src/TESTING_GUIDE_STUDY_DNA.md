# 🧪 STUDY DNA SELECTOR - TESTING GUIDE

## 🎯 Quick Test Steps

### **Test 1: Access the Modal**
1. Look at top-left corner of screen
2. Click the project dropdown (📁 icon)
3. Click **"➕ Create New Project"** at bottom
4. ✅ Study DNA modal should open

---

### **Test 2: RCT Configuration**
```
1. Enter basic info:
   - Name: "ASPIRE Trial"
   - Study Number: "ASPIRE-2026-001"
   
2. Select Study Design: "🎲 Randomized Controlled Trial (RCT)"

3. You should see:
   LEFT PANEL:
   ┌─ Randomization Setup ──────────────────┐
   │ Blinding Strategy:                      │
   │ [Open Label] [Single] [Double] [Triple] │
   │                                         │
   │ Allocation Ratio:                       │
   │ [1:1] [2:1] [1:2] [Custom]             │
   │                                         │
   │ ☐ Use Block Randomization              │
   └─────────────────────────────────────────┘
   
   RIGHT PANEL:
   ┌─ Statistician Persona ─────────────────┐
   │ Dr. Emma Chen, PhD                      │
   │ Biostatistician                         │
   │                                         │
   │ 🎯 Locked Focus: Bias Reduction        │
   │                                         │
   │ ⚡ Key Responsibilities:                │
   │  ✓ Randomization sequence               │
   │  ✓ Sample size calculation              │
   │  ✓ Interim analysis planning            │
   └─────────────────────────────────────────┘

4. Try interactions:
   ✅ Click "Double Blind" - should highlight in blue
   ✅ Click "2:1" ratio - should highlight in blue
   ✅ Toggle "Block Randomization" - block size dropdown appears
   ✅ Info box at bottom should mention bias reduction

5. Right panel should show:
   ✅ Dr. Emma Chen, PhD
   ✅ Focus: Bias Reduction
   ✅ Sample Size: 50-500 participants
   ✅ Duration: 6 months - 3 years
```

**Expected Result:** RCT configuration fully interactive, statistician preview shows bias reduction focus

---

### **Test 3: Case Series Configuration**
```
1. Change Study Design to: "📋 Retrospective Case Series"

2. You should see:
   LEFT PANEL:
   ┌─ Case Series Configuration ────────────┐
   │ ☑ Enable Deep Phenotyping               │
   │   [Large checkbox with description]     │
   │                                         │
   │ Temporal Granularity:                   │
   │ [Daily] [Weekly] [Monthly] [Event]      │
   │                                         │
   │ ☐ Include Longitudinal Tracking         │
   │ ☐ Enable Multiple Timepoint Data Entry │
   └─────────────────────────────────────────┘
   
   RIGHT PANEL (updates immediately):
   ┌─ Statistician Persona ─────────────────┐
   │ Dr. Sophia Nakamura, MD, MPH            │
   │ Data Scientist                          │
   │                                         │
   │ 🎯 Locked Focus: Descriptive Depth     │
   └─────────────────────────────────────────┘

3. Try interactions:
   ✅ Toggle "Deep Phenotyping" ON
   ✅ Preview box should appear showing auto-generated sections
   ✅ Click "Event-Based" temporal granularity - highlights purple
   ✅ Toggle "Longitudinal Tracking" - checkbox works

4. With Deep Phenotyping ON, should see:
   ┌─ Auto-Generated Schema Sections ───────┐
   │ • Demographics & Baseline               │
   │ • Clinical Presentation (Symptom Grid)  │
   │ • Laboratory Values                     │
   │ • Imaging Findings                      │
   │ • Treatment Details & Timeline          │
   │ • Outcomes & Follow-Up                  │
   └─────────────────────────────────────────┘
```

**Expected Result:** Case series shows purple theme, deep phenotyping preview appears, persona changes to Sophia Nakamura

---

### **Test 4: Cohort Study Configuration**
```
1. Change Study Design to: "📊 Prospective Cohort Study"

2. You should see:
   LEFT PANEL:
   ┌─ Cohort Study Configuration ───────────┐
   │ Follow-Up Duration:                     │
   │ [1 Year] [3 Years] [5 Years] [10 Years] │
   │ Or specify custom: [________]           │
   │                                         │
   │ Follow-Up Visit Interval:               │
   │ [3 Months] [6 Months] [12 Months]       │
   │                                         │
   │ Exposure Assessment Strategy:           │
   │ ○ Baseline Only                         │
   │ ○ Time-Varying                          │
   └─────────────────────────────────────────┘
   
   RIGHT PANEL:
   ┌─ Statistician Persona ─────────────────┐
   │ Dr. Marcus Rodriguez, DrPH              │
   │ Epidemiologist                          │
   │                                         │
   │ 🎯 Locked Focus: Temporal Analysis     │
   └─────────────────────────────────────────┘

3. Try interactions:
   ✅ Click "5 Years" - highlights in green
   ✅ Type in custom duration: "7 years"
   ✅ Click "6 Months" interval - highlights green
   ✅ Select "Time-Varying" exposure - radio button works
   ✅ Toggle "Track Loss to Follow-Up" checkbox
```

**Expected Result:** Cohort shows green theme, custom inputs work, persona is Marcus Rodriguez (epidemiologist)

---

### **Test 5: Laboratory Investigation Configuration**
```
1. Change Study Design to: "🔬 Laboratory Investigation"

2. You should see:
   LEFT PANEL:
   ┌─ Laboratory Investigation Config ──────┐
   │ Number of Technical Replicates:         │
   │ [2×] [3×] [4×] [6×]                     │
   │ Custom number: [3] replicates           │
   │                                         │
   │ Measurement Precision Level:            │
   │ ○ Standard Precision (CV ≤ 10%)        │
   │ ○ High Precision (CV ≤ 5%)             │
   │ ○ Ultra-High Precision (CV ≤ 2%)       │
   │                                         │
   │ ☐ Include Quality Control Samples       │
   │ ☐ Instrument Calibration & Validation  │
   └─────────────────────────────────────────┘
   
   RIGHT PANEL:
   ┌─ Statistician Persona ─────────────────┐
   │ Dr. James Park, PhD                     │
   │ Data Scientist                          │
   │                                         │
   │ 🎯 Locked Focus: Measurement Precision │
   └─────────────────────────────────────────┘

3. Try interactions:
   ✅ Click "3×" replicates - highlights amber
   ✅ Change custom number to 5
   ✅ Select "High Precision" - radio button shows CV ≤ 5%
   ✅ Toggle "QC Samples" ON - preview box appears
   ✅ Toggle "Instrument Validation" ON - validation report preview appears
```

**Expected Result:** Laboratory shows amber theme, precision levels show CV targets, QC toggles show preview boxes

---

### **Test 6: Technical Note Configuration**
```
1. Change Study Design to: "📝 Technical Note / Case Report"

2. You should see:
   LEFT PANEL:
   ┌─ Technical Note Configuration ─────────┐
   │ Number of Cases:                        │
   │ [1 Case] [2 Cases] [3 Cases]            │
   │ Or specify: [1] cases (max 10)          │
   │                                         │
   │ Narrative Focus:                        │
   │ ○ Diagnostic Focus                      │
   │ ○ Therapeutic Focus                     │
   │ ○ Methodological Focus                  │
   │                                         │
   │ ☐ Include Imaging Studies               │
   │ ☐ Include Literature Review             │
   │                                         │
   │ Educational Value:                      │
   │ • What can clinicians learn?            │
   │ • What pitfalls to avoid?               │
   │ • Key take-home message?                │
   └─────────────────────────────────────────┘
   
   RIGHT PANEL:
   ┌─ Statistician Persona ─────────────────┐
   │ Dr. Aisha Patel, MD                     │
   │ Biostatistician                         │
   │                                         │
   │ 🎯 Locked Focus: Narrative Synthesis   │
   └─────────────────────────────────────────┘

3. Try interactions:
   ✅ Click "1 Case" - highlights slate
   ✅ Type custom case count: 5
   ✅ Select "Diagnostic Focus" - shows description
   ✅ Toggle "Imaging" ON - imaging guidance box appears
   ✅ Toggle "Literature Review" ON - literature synthesis box appears
```

**Expected Result:** Technical note shows slate theme, narrative focus options clear, educational checklist visible

---

### **Test 7: Study Design Switching**
```
1. Select RCT
2. Configure: Double Blind, 2:1 ratio
3. Switch to Cohort
4. Configure: 5 years, 6 months interval
5. Switch back to RCT

✅ RCT should be RESET to defaults (not saved config)
✅ Each study type starts fresh
✅ Statistician preview updates immediately
✅ Protocol template sections update
```

**Expected Result:** Switching study types resets configuration to defaults

---

### **Test 8: Create Project**
```
1. Fill in all required fields:
   - Name: "Test Study"
   - Study Number: "TEST-001"
   - Study Design: Any type
   
2. Click "Create Project" button

✅ Modal closes
✅ Project appears in project list
✅ Project selector shows new project name
✅ Study DNA is saved (check browser console/localStorage)
```

**Expected Result:** Project created successfully with Study DNA embedded

---

### **Test 9: Validation**
```
1. Open modal
2. Leave Name empty
3. Leave Study Number empty
4. Don't select Study Design
5. Click "Create Project"

✅ Should see red error messages:
   - "Project name is required"
   - "Study number is required"
   - "Study design is required"
   
✅ Modal should NOT close
✅ Errors should appear under each field
```

**Expected Result:** Validation prevents submission without required fields

---

### **Test 10: Cancel and Reset**
```
1. Open modal
2. Fill in all fields
3. Select RCT, configure settings
4. Click "Cancel"

✅ Modal closes
✅ Open modal again
✅ All fields should be BLANK/DEFAULT
✅ No previous configuration saved
```

**Expected Result:** Cancel resets all state

---

## 🎨 **Visual Checklist**

### **Color Themes Work**
- [ ] RCT: Blue highlights (#2563EB)
- [ ] Case Series: Purple highlights
- [ ] Cohort: Green highlights
- [ ] Laboratory: Amber highlights
- [ ] Technical Note: Slate highlights

### **Right Panel Updates**
- [ ] Persona name changes per study type
- [ ] Focus area updates correctly
- [ ] Sample size shows
- [ ] Duration shows
- [ ] Protocol sections update (first 5 + count)

### **Interactive Elements**
- [ ] All buttons have hover states
- [ ] Selected buttons show clear highlight
- [ ] Checkboxes toggle properly
- [ ] Radio buttons work
- [ ] Custom inputs accept text/numbers
- [ ] Dropdowns work for block size

### **Info Boxes**
- [ ] RCT: Mentions bias reduction
- [ ] Case Series: Mentions deep phenotyping benefits
- [ ] Cohort: Mentions consistent follow-up importance
- [ ] Laboratory: Mentions reproducibility
- [ ] Technical Note: Mentions best practices

---

## 🐛 **Common Issues to Check**

### **Issue 1: Modal Doesn't Open**
**Check:**
- Is TopBar rendering?
- Is ProjectSelector visible in top-left?
- Does dropdown open when clicked?
- Is "+ Create Project" button visible?

### **Issue 2: Configuration Panel Doesn't Show**
**Check:**
- Did you select a study design?
- Is the study design dropdown working?
- Check browser console for errors

### **Issue 3: Right Panel is Empty**
**Check:**
- Must select a study design first
- Placeholder should show before selection

### **Issue 4: Statistician Preview Not Updating**
**Check:**
- generateStudyDNA() is being called
- studyDesignType is not null
- Check browser console for errors

### **Issue 5: Colors Not Showing**
**Check:**
- CSS classes are correct
- Tailwind is processing the colors
- Border/background classes are applied

---

## ✅ **Success Criteria**

### **Phase 2 is complete when:**
- [x] All 5 study types have configuration panels
- [x] Each panel has 4+ interactive elements
- [x] Color coding works for each type
- [x] Statistician preview updates per type
- [x] Protocol template preview updates
- [x] Study characteristics update
- [x] Configuration saved to project.studyDesign
- [x] Modal can be opened, configured, and closed
- [x] Validation prevents invalid submissions
- [x] Cancel resets all state

---

## 🎯 **Quick Verification**

**Run this checklist in 5 minutes:**

1. ✅ Open modal
2. ✅ See all 5 study types in dropdown
3. ✅ Select RCT → See blue configuration
4. ✅ Select Case Series → See purple configuration
5. ✅ Select Cohort → See green configuration
6. ✅ Select Laboratory → See amber configuration
7. ✅ Select Technical Note → See slate configuration
8. ✅ Right panel shows different persona for each type
9. ✅ Click "Create Project" with valid data → Project created
10. ✅ Click "Cancel" → Modal closes

**If all 10 ✅ pass → Phase 2 is working!** 🎉

---

## 📸 **Screenshots to Take**

For documentation:
1. Modal closed - Project selector dropdown
2. Modal open - Empty state (no study design selected)
3. RCT configuration - Full panel
4. Case Series configuration - Deep phenotyping ON
5. Cohort configuration - Custom duration entered
6. Laboratory configuration - QC toggles ON
7. Technical Note configuration - All options visible
8. Statistician preview - For each study type (5 screenshots)
9. Validation errors - All fields empty
10. Success state - Project created

---

**Total Testing Time: ~10 minutes for comprehensive test, ~5 minutes for quick verification** ⏱️
