# Data Entry System - Implementation Test Plan

## ✅ Fixes Implemented

### 1. **Modular Architecture**
- ✅ `/utils/formValidation.ts` - Separate validation logic with draft/complete modes
- ✅ `/utils/dataStorage.ts` - localStorage operations with error handling
- ✅ Refactored `DataEntryForm.tsx` to use utilities

### 2. **Dual Save Modes**
- ✅ **Save Draft**: Only requires Subject ID + Enrollment Date
- ✅ **Submit Complete**: Validates all required fields
- ✅ Partial data saves are now possible

### 3. **Navigation Improvements**
- ✅ Previous/Next buttons always visible when `tables.length > 1`
- ✅ Section tabs with completion indicators
- ✅ Progress bar showing overall completion percentage

### 4. **Enhanced UX**
- ✅ Real-time field change logging (`console.log`)
- ✅ Form completion percentage tracker
- ✅ Per-section completion status with checkmarks
- ✅ Warning vs Error distinction
- ✅ Non-blocking warnings for incomplete fields

---

## 🧪 Test Procedure

### **Step 1: Navigate to Database**
1. Open the application
2. Click on "Database" in main navigation
3. Verify protocol selector shows saved protocols

### **Step 2: Select Protocol**
1. Choose a protocol from dropdown
2. Choose a version from version dropdown
3. Verify database tables are generated
4. Click "Data Entry" tab

### **Step 3: Test Base Fields**
1. Enter Subject ID: `TEST-001`
2. Enter Visit Number: `1` (optional)
3. Enter Enrollment Date: Select today's date
4. Verify no errors appear

### **Step 4: Test Navigation**
**Expected:** If multiple tables exist (Demographics, Endpoints, Lab, Clinical):
- ✅ Section tabs appear at top with completion status
- ✅ Previous/Next buttons visible in section header
- ✅ Progress bar shows 0%

**Actions:**
1. Click through section tabs
2. Click "Next" button to move forward
3. Click "Previous" button to move backward
4. Verify buttons disable at first/last section

### **Step 5: Fill Some Fields (Not All)**
1. Go to Demographics section
2. Fill in 2-3 fields (not all required ones)
3. **Open browser console** (F12)
4. Verify you see: `✅ Field changed: { tableId, fieldId, value }`

### **Step 6: Test Draft Save**
1. Click "Save Draft" button
2. **Expected:** Form saves successfully even with incomplete data
3. Check console for: `💾 Attempting to save draft...` → `✅ Draft saved successfully`
4. Verify green success message appears
5. Open Application → Local Storage → `clinical-intelligence-data`
6. Verify record exists with `status: "draft"`

### **Step 7: Test Complete Submit (Should Fail)**
1. With partial data filled, click "Submit Complete"
2. **Expected:** Red error banner appears listing missing required fields
3. Example: "Overall Survival (OS) is required"
4. **This is correct behavior** - complete submit requires all fields

### **Step 8: Test Complete Submit (Should Succeed)**
1. Fill in ALL required fields (marked with red asterisk)
2. Click "Submit Complete"
3. **Expected:** Form submits and clears
4. Verify success message
5. Check localStorage - record has `status: "complete"`

### **Step 9: Verify Data Persistence**
```javascript
// In browser console:
JSON.parse(localStorage.getItem('clinical-intelligence-data'))
```
**Expected output:**
```json
[
  {
    "recordId": "TEST-001_1_1704412800000",
    "protocolNumber": "PROTO-001",
    "protocolVersion": "1.0",
    "subjectId": "TEST-001",
    "visitNumber": "1",
    "enrollmentDate": "2026-01-03",
    "status": "draft",
    "data": {
      "subjects_proto_001": {
        "field_123": "value",
        ...
      }
    },
    "collectedAt": "2026-01-03T...",
    "lastModified": "2026-01-03T..."
  }
]
```

---

## 🐛 Debug Checklist

### If Navigation Buttons Don't Appear:
1. Check browser console for: `📊 Tables loaded: X`
2. Verify X > 1 (multiple tables required)
3. Check if `tables.length > 1` condition in line 342 of DataEntryForm.tsx
4. Verify selectedTableData is not null

### If Data Doesn't Save:
1. Check console for validation errors
2. Verify Subject ID and Enrollment Date are filled
3. Check for: `💾 Attempting to save draft...`
4. If you see `❌ Draft validation failed:` - check error details
5. Verify localStorage is enabled in browser

### If Fields Don't Update:
1. Check console for: `✅ Field changed:`
2. If missing, check DataEntryField onChange prop
3. Verify handleFieldChange is called
4. Check React DevTools for formData state

---

## 🎯 Success Criteria

- ✅ Previous/Next buttons visible when multiple sections exist
- ✅ Can save partial data using "Save Draft"
- ✅ Draft saves only require Subject ID + Enrollment Date
- ✅ "Submit Complete" validates all required fields
- ✅ Field changes log to console
- ✅ Data persists to localStorage
- ✅ Progress bar updates as fields are filled
- ✅ Section tabs show completion checkmarks
- ✅ Form state maintained when navigating between sections

---

## 📊 Expected Console Output

```
📊 Tables loaded: 4 ['subjects_proto_001', 'endpoints_proto_001', 'laboratory_proto_001', 'clinical_data_proto_001']
✅ Field changed: { tableId: 'subjects_proto_001', fieldId: 'age', value: '45' }
✅ Field changed: { tableId: 'subjects_proto_001', fieldId: 'gender', value: 'Female' }
💾 Attempting to save draft... { subjectId: 'TEST-001', enrollmentDate: '2026-01-03', formData: {...} }
✅ Draft saved successfully: TEST-001_1_1704412800000
```

---

## 🔧 Architecture Benefits

### Before (Monolithic):
```
DataEntryForm.tsx (433 lines)
├── Validation logic mixed with UI
├── Storage logic embedded in component
└── Hard to test, easy to break
```

### After (Modular):
```
/utils/formValidation.ts (267 lines)
├── Pure functions, easily testable
├── Two validation modes
└── Reusable across components

/utils/dataStorage.ts (147 lines)
├── Centralized storage operations
├── Error handling built-in
└── Export/import capabilities

DataEntryForm.tsx (415 lines)
├── Clean UI component
├── Uses utility functions
└── Maintainable & extensible
```

---

## ✨ New Features

1. **Progress Tracking**: Visual progress bar + percentage
2. **Section Tabs**: Quick navigation with completion indicators
3. **Dual Save**: Draft (partial) vs Complete (full validation)
4. **Smart Warnings**: Non-blocking recommendations vs blocking errors
5. **Auto-dedupe**: Prevents duplicate subject/visit records
6. **Debug Mode**: Console logging for troubleshooting
