# Data Entry System - Quick Start Guide

## 🎯 What Was Fixed

### Problem
❌ Users couldn't save partial data → Got blocked by validation errors

### Solution
✅ **Two save modes:**
1. **Save Draft** - Saves incomplete data (only needs Subject ID + Date)
2. **Submit Complete** - Full validation (needs all required fields)

---

## 🚀 How to Use

### **1. Access Data Entry**
```
Database Tab → Select Protocol → Select Version → Click "Data Entry" tab
```

### **2. Fill Required Base Fields**
- Subject ID (required) ⭐
- Visit Number (optional)
- Enrollment Date (required) ⭐

### **3. Navigate Between Sections**
**Option A:** Click section tabs at top
**Option B:** Use Previous/Next buttons in section header

### **4. Fill Fields**
- Fill as many or as few as needed
- Required fields marked with red asterisk (*)
- Progress bar shows completion percentage

### **5. Save Your Work**

#### **Save Draft (Partial Data)**
```
✅ Click "Save Draft" button
✅ Only needs: Subject ID + Enrollment Date
✅ Can save with incomplete required fields
✅ Data persists to localStorage
✅ Can return later to continue
```

#### **Submit Complete (Full Data)**
```
✅ Click "Submit Complete" button
✅ Requires: ALL required fields filled
✅ Will show errors if fields missing
✅ Marks record as complete
✅ Form clears after success
```

---

## 🔍 Visual Indicators

### **Progress Bar**
```
Form Completion: 12 / 45 fields (27%)
[████░░░░░░░░░░░░░░]
```

### **Section Tabs**
```
[Subject Demographics ✓]  [Study Endpoints]  [Laboratory]  [Clinical Data]
         12/12                  0/15              0/10           0/8
```

### **Navigation**
```
Study Endpoints                    Section 2 of 4
[← Previous]  [Next →]
```

---

## 🎨 Status Colors

| Color | Meaning | Action |
|-------|---------|--------|
| 🔴 Red Error Banner | Critical errors | Must fix before Submit Complete |
| 🟡 Amber Warning | Recommended fields missing | Can ignore for drafts |
| 🟢 Green Success | Save successful | Data persisted |
| 🔵 Blue Progress | Completion status | Visual feedback |

---

## 📊 Console Debug Output

Open browser console (F12) to see:

```javascript
✅ Field changed: { tableId: 'subjects_proto_001', fieldId: 'age', value: '45' }
💾 Attempting to save draft...
✅ Draft saved successfully: TEST-001_1_1704412800000
```

---

## 💾 Check Saved Data

### **Browser Console:**
```javascript
// View all saved records
JSON.parse(localStorage.getItem('clinical-intelligence-data'))

// Quick stats
JSON.parse(localStorage.getItem('clinical-intelligence-data')).length
```

### **Expected Structure:**
```json
{
  "recordId": "SUB-001_1_1704412800000",
  "protocolNumber": "PROTO-001",
  "protocolVersion": "1.0",
  "subjectId": "SUB-001",
  "visitNumber": "1",
  "enrollmentDate": "2026-01-03",
  "status": "draft",
  "data": {
    "subjects_proto_001": {
      "age": "45",
      "gender": "Female"
    },
    "endpoints_proto_001": {
      "overall_survival": "24.5"
    }
  },
  "collectedAt": "2026-01-03T10:30:00.000Z",
  "lastModified": "2026-01-03T10:30:00.000Z",
  "collectedBy": "Current User"
}
```

---

## 🐛 Troubleshooting

### "Previous/Next buttons not visible"
✅ **Normal if only 1 section** - Buttons only show when `tables.length > 1`
✅ Check console for: `📊 Tables loaded: X`

### "Data not saving"
1. ✅ Check Subject ID is filled
2. ✅ Check Enrollment Date is filled
3. ✅ Open console, look for errors
4. ✅ Check localStorage is enabled

### "Submit Complete shows errors"
✅ **This is correct** - Complete requires ALL required fields
✅ Use "Save Draft" instead for partial data
✅ Check red error banner for missing fields

### "Fields not updating"
✅ Check console for `✅ Field changed:` logs
✅ If missing, report as bug with screenshot

---

## 📱 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Tab | Navigate between fields |
| Shift+Tab | Navigate backwards |
| Enter | Submit (when in text field) |
| Escape | Clear focus |

---

## ✨ Pro Tips

1. **Save early, save often** - Use "Save Draft" while filling long forms
2. **Watch the progress bar** - Know how much is left
3. **Use section tabs** - Jump directly to incomplete sections
4. **Check console** - Debug issues with F12
5. **Review warnings** - Yellow warnings won't block saves

---

## 📞 Need Help?

1. Check browser console (F12) for error messages
2. Verify data in localStorage (see above)
3. Check `/IMPLEMENTATION_TEST.md` for detailed test steps
4. Check `/FIX_SUMMARY.md` for architecture details

---

## 🎉 Success Checklist

- [ ] Can navigate to Data Entry tab
- [ ] Can see section tabs (if multiple sections)
- [ ] Can see Previous/Next buttons
- [ ] Can fill fields and see them update
- [ ] Can save draft with partial data ⭐
- [ ] Can see progress bar update
- [ ] Can view saved data in localStorage
- [ ] Can submit complete with all fields filled

**If all checked → System working correctly! 🚀**
