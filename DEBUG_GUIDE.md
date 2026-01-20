# Debug Logging Guide

## What Was Added

Comprehensive debug logging to diagnose two critical issues:
1. **Missing data: 56.7%** - Why is most data showing as missing?
2. **All analysis results are 0.00** - Why are analyses returning zeros?

## How to Use

### Step 1: Open the Analytics Page

Navigate to your protocol's analytics/statistics page where Dr. Saga runs.

### Step 2: Open Browser Console

- Chrome/Edge: F12 or Ctrl+Shift+J
- Firefox: F12 or Ctrl+Shift+K
- Safari: Cmd+Option+C

### Step 3: Look for Debug Output

You should see the following logs automatically:

#### A. Data Inspection (runs on page load)

```
🚀 STATISTICIAN PANEL LOADED - Running data inspection...

🔬 DATA INSPECTOR - Analyzing stored records
Total records in storage: 17

📊 SUMMARY REPORT:
Total records: 17
Total unique tables: 3
Total unique fields: 489

📁 Tables found:
  - demographics (45 fields)
  - outcomes (144 fields)
  - admin_data (300 fields)

🏷️ All field IDs across all tables:
  - age: [45, 52, 38]
  - mortality_30day: [1, 0, 1]
  - stroke_rate: [0, 1, 0]
  ...

📋 Fields by table:
  Table: outcomes
    - mortality_30day: [1, 0]
    - stroke_rate: [0, 1]
    - sci_rate: [0, 0]
    ...

📈 Record Completeness:
  Average completeness: 43.3%
  ✅ SUBJ001: 250/489 (51.1%)
  ⚠️ SUBJ002: 145/489 (29.7%)
  ❌ SUBJ003: 89/489 (18.2%)
```

**What to look for:**
- Are records actually stored? (Total records > 0)
- What table names exist? (Should match your schema sections)
- What field IDs are present? (Do they match variable names in your schema?)

#### B. Analysis Execution Logs (when Dr. Saga runs analyses)

```
📈 EXECUTING ANALYSIS: fisher-exact
Analysis ID: analysis_abc123
Outcome variable: {
  id: "composite_cerebrovascular_event_rate",
  name: "composite_cerebrovascular_event_rate",
  label: "Composite Cerebrovascular Event Rate",
  dataType: "Binary"
}
Predictor variable: {
  id: "treatment_arm",
  name: "treatment_arm",
  label: "Treatment Arm",
  dataType: "Categorical"
}
Total records available: 17
```

**What to look for:**
- What variable IDs is Dr. Saga requesting?
- Do these IDs match the field IDs shown in the data inspection?

#### C. Data Extraction Logs (for each variable)

```
🔍 DATA EXTRACTION DEBUG: composite_cerebrovascular_event_rate
Searching for variable ID: "composite_cerebrovascular_event_rate"
Total records to search: 17

Sample record structure: {
  recordId: "rec_001",
  subjectId: "SUBJ001",
  tables: ["demographics", "outcomes", "admin_data"]
}

Available tables: ["demographics", "outcomes", "admin_data"]
All available field IDs across all tables: [
  "age", "mortality_30day", "stroke_rate", ...
]

Table "demographics": [age, sex, bmi, ...]
Table "outcomes": [mortality_30day, stroke_rate, sci_rate, ...]
Table "admin_data": [...]

✓ Found in record SUBJ001, table "outcomes": 1
✓ Found in record SUBJ002, table "outcomes": 0
✓ Found in record SUBJ003, table "outcomes": 1

📊 EXTRACTION SUMMARY:
  Total extractions: 17
  Found matches: 17 (100.0%)
  Null/missing: 0 (0.0%)
  Valid non-empty: 17 (100.0%)
```

**OR if there's a mismatch:**

```
🔍 DATA EXTRACTION DEBUG: cerebrovascular_event_rate
Searching for variable ID: "cerebrovascular_event_rate"
...

📊 EXTRACTION SUMMARY:
  Total extractions: 17
  Found matches: 0 (0.0%)
  Null/missing: 17 (100.0%)
  Valid non-empty: 0 (0.0%)

⚠️ NO EXACT MATCHES FOUND!
Looking for fuzzy matches for "cerebrovascular_event_rate"...

🔎 Potential fuzzy matches found: [
  "composite_cerebrovascular_event_rate",
  "cerebrovascular_events",
  "cvr_rate"
]

💡 SUGGESTION: Variable ID might need remapping from
   "cerebrovascular_event_rate"
   → "composite_cerebrovascular_event_rate"
```

**What to look for:**
- Match percentage (should be close to 100% for valid variables)
- Fuzzy match suggestions (shows correct field ID if mismatch)
- Which field IDs exist vs. which are being requested

## Common Issues & Solutions

### Issue: "0 records in storage"
**Problem:** No data has been entered or data isn't being saved properly.
**Solution:** Check data entry workflow, verify localStorage permissions.

### Issue: "NO EXACT MATCHES FOUND" with fuzzy suggestions
**Problem:** Variable ID in schema doesn't match field ID in stored data.
**Example:**
- Schema variable ID: `"30_day_mortality"`
- Stored field ID: `"mortality_30day"`
**Solution:** Need to add ID mapping/normalization layer.

### Issue: "NO EXACT MATCHES FOUND" with no fuzzy suggestions
**Problem:** Variable doesn't exist in stored data at all.
**Possible causes:**
- Variable is in schema but not in data entry form
- Data entry form field has different ID
- Variable is in a table that's not being searched
**Solution:** Check that all schema variables have corresponding data entry fields.

### Issue: "Average completeness: 10-30%"
**Problem:** Most fields are empty in stored records.
**Possible causes:**
- Demo/test data with few fields filled
- Data import issue
- Fields exist in schema but not data entry forms
**Solution:** Verify data entry completeness or use test data with more fields populated.

### Issue: High completeness but analyses still return 0.00
**Problem:** Data types might be mismatched or values are invalid.
**Check:** Look at sample values in extraction logs - are they the expected format?

## Manual Console Inspection

You can also manually inspect data from the browser console:

```javascript
// View all stored data structure
window.inspectStoredData()

// Check if specific variable exists
window.checkVariableExists("mortality_30day")

// Check multiple variables at once
window.generateVariableIdMappingReport([
  "mortality_30day",
  "stroke_rate",
  "sci_rate"
])
```

## What to Share for Help

If you need assistance, share:
1. The "SUMMARY REPORT" section (total records, tables, field count)
2. The "All field IDs across all tables" list
3. Any "NO EXACT MATCHES FOUND" warnings with suggestions
4. The "Record Completeness" summary

This shows what data exists vs. what Dr. Saga is looking for.

## Next Steps After Diagnosis

Once we identify the issue from logs:

### If ID mismatch:
- Create variable ID mapping/normalization utility
- Map schema IDs to stored field IDs automatically

### If data structure issue:
- Adjust data storage format
- Update extraction logic to handle nested structures

### If missing data:
- Verify data entry workflow
- Check which fields are required vs. optional
- Populate test data for analysis

### If Dr. Saga requesting wrong variables:
- Check how schema is being passed to AI
- Verify SPECTRA extraction is using correct field IDs
- Adjust prompt to use stored field IDs instead of schema names
