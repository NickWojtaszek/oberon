# Testing Quick Start Guide 🧪

## 5-Minute Test Plan

Quick tests to verify both fixes work correctly.

---

## Test 1: New RCT Project (2 minutes)

### Steps
1. **Open app** in browser
2. **Click** "Create Project" button on dashboard
3. **Fill in:**
   - Project Name: "Test RCT Study"
   - Study Number: "TEST-001"
   - Select: **Randomized Controlled Trial (RCT)**
4. **Click** "Create Project"
5. **Wait** for project creation modal to close

### Expected Console Output
```
🔄 Converting simplified schema blocks to full format...
🔍 Before Conversion Format Check
  Total blocks: 15
  Has simplified: true
  Has full: false
✅ Converted 15 simplified blocks → 15 full blocks
```

6. **Click** "Protocol Builder" in sidebar

### Expected Console Output
```
🔄 Auto-load check for project: Test RCT Study
✅ Auto-loading protocol: {
  protocolNumber: 'PROTO-RCT-001',
  versionNumber: 'v1.0',
  studyType: 'rct'
}
✅ Auto-load complete
```

### Expected UI
- ✅ Protocol Builder opens (not blank!)
- ✅ Blue banner at top: "Auto-loaded protocol PROTO-RCT-001 (RCT)"
- ✅ Schema shows RCT endpoints in left panel
- ✅ Schema Editor (center) shows endpoint blocks

7. **Click** "Database" in sidebar
8. **Select** the protocol from dropdown
9. **Click** "Data Entry" tab

### Expected UI
- ✅ Form fields are visible
- ✅ Fields include:
  - Primary Endpoint Change
  - Response Rate
  - Time to Event
  - Other RCT-specific fields

### ✅ SUCCESS CRITERIA
- [x] Console shows conversion logs
- [x] Console shows auto-load logs
- [x] Protocol Builder loads with schema
- [x] Auto-load banner appears
- [x] Data Entry forms show fields

---

## Test 2: Case Series Project (1 minute)

### Steps
1. **Dashboard** → Create Project
2. **Select:** Case Series
3. **Fill:** Name = "Test Case Series", Number = "TEST-002"
4. **Create**
5. **Navigate** to Protocol Builder

### Expected
- ✅ Auto-loads Case Series protocol
- ✅ Banner shows study type: "CASE-SERIES"
- ✅ Schema shows case-specific variables

6. **Navigate** to Database → Data Entry

### Expected
- ✅ Form shows case series fields
- ✅ Fields match protocol schema

---

## Test 3: Protocol Library (1 minute)

### Steps
1. **Click** "Protocol Library" in sidebar
2. **Find** the RCT protocol card
3. **Click** "Open in Builder"

### Expected
- ✅ Opens Protocol Builder with that protocol
- ✅ NO auto-load banner (explicit selection)
- ✅ Console shows: "Loading protocol: [id]"

---

## Test 4: Project Switch (1 minute)

### Steps
1. **Have** 2 projects created (RCT + Case Series)
2. **Open** Protocol Builder (should show current project's protocol)
3. **Click** project switcher in top-left
4. **Switch** to other project
5. **Navigate** to Protocol Builder again

### Expected
- ✅ Auto-loads the switched project's protocol
- ✅ Banner shows correct protocol number
- ✅ Schema matches study type

---

## Console Log Cheat Sheet

### ✅ Good Logs (Success)

```
// Auto-generation conversion
🔄 Converting simplified schema blocks to full format...
✅ Converted 15 simplified blocks → 15 full blocks

// Auto-load
🔄 Auto-load check for project: [name]
✅ Auto-loading protocol: { ... }
✅ Auto-load complete

// Database generation
🛡️ Database Generator - Checking schema block format...
✅ Schema blocks are already in full format
```

### ⚠️ Warning Logs (Auto-Fixed)

```
// If simplified blocks reach database
⚠️ WARNING: Simplified schema blocks detected in protocol version!
⚠️ Auto-converting to full format for database compatibility...
✅ Converted 15 blocks to full format

// This means auto-generation conversion didn't work
// But defensive checks caught it
```

### ❌ Error Logs (Problems)

```
// Type errors
❌ Cannot read property 'name' of undefined
❌ block.variable is undefined

// Auto-load failed
❌ Auto-load failed: [error details]

// No conversion happening
❌ Unknown schema block format, skipping: [block]
```

---

## Quick Verification Checklist

Copy this and check off as you test:

### New Project Flow
- [ ] Created RCT project
- [ ] Console shows conversion logs
- [ ] Protocol Builder auto-loads
- [ ] Auto-load banner appears
- [ ] Database forms show fields

### Study Type Coverage
- [ ] RCT works
- [ ] Case Series works
- [ ] Cohort Study works
- [ ] Laboratory Study works
- [ ] Technical Note works

### Edge Cases
- [ ] Protocol Library direct open (no auto-load banner)
- [ ] Project switch updates protocol
- [ ] No protocols shows blank state
- [ ] Multiple protocols loads most recent

### Console Logs
- [ ] Conversion logs appear on project creation
- [ ] Auto-load logs appear on Protocol Builder open
- [ ] No error messages in console
- [ ] No warnings (unless expected auto-fix)

---

## If Something Fails

### Data Entry Forms Empty
**Check:**
1. Console for conversion logs
2. Console for type errors
3. Open DevTools → Application → Local Storage
4. Find protocol → Check schemaBlocks format

**Debug:**
```javascript
// In console
const protocols = JSON.parse(localStorage.getItem('clinical-protocols-[project-id]'));
console.log('First block:', protocols[0].versions[0].schemaBlocks[0]);

// Should have:
// - variable: { name: "...", category: "..." }
// - dataType: "Continuous" (or other)
// - role: "Outcome" (or other)
```

### Protocol Builder Blank
**Check:**
1. Console for auto-load attempt
2. Console for errors
3. Project has protocols

**Debug:**
```javascript
// In console
const currentProject = JSON.parse(localStorage.getItem('clinical-current-project'));
const protocols = JSON.parse(localStorage.getItem('clinical-protocols-' + currentProject.id));
console.log('Project protocols:', protocols.length);
```

### No Auto-Load Banner
**Check:**
1. Are you opening from Protocol Library? (no banner expected)
2. Console for auto-load logs
3. Banner might have been dismissed

**Not a problem if:**
- Opening specific protocol from library
- Banner was manually dismissed

---

## Expected Test Duration

- **Test 1 (Full RCT):** 2 minutes
- **Test 2 (Case Series):** 1 minute
- **Test 3 (Library):** 1 minute
- **Test 4 (Switch):** 1 minute

**Total:** ~5 minutes for complete verification

---

## Success Screenshot Checklist

Take screenshots of:
1. ✅ Console showing conversion logs
2. ✅ Console showing auto-load logs
3. ✅ Protocol Builder with auto-load banner
4. ✅ Data Entry form with fields visible
5. ✅ Multiple study types working

---

## Reporting Results

### Format
```
Test: [Test Name]
Status: ✅ Pass / ❌ Fail / ⚠️ Partial
Details: [What worked / What didn't]
Console: [Key log messages]
Screenshots: [Attached / None]
```

### Example Pass
```
Test: New RCT Project
Status: ✅ Pass
Details: All steps completed successfully. Auto-load worked perfectly.
Console:
  ✅ Converted 15 simplified blocks → 15 full blocks
  ✅ Auto-load complete
Screenshots: Attached
```

### Example Fail
```
Test: Data Entry Forms
Status: ❌ Fail
Details: Forms are empty, no fields showing
Console:
  ❌ Cannot read property 'name' of undefined
  ⚠️ No conversion logs found
Screenshots: Attached
```

---

## Ready to Test!

Open your browser console, follow Test 1, and report results! 🚀
