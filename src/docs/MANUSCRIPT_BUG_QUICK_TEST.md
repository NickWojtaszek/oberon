# Manuscript Creation Bug - Quick Test Guide

## 🎯 Critical Path Test (2 minutes)

### Test 1: Create New Manuscript
1. Navigate to Academic Writing module
2. Click "New Manuscript" button (top right, purple)
3. Enter title: `Test Manuscript ${Date.now()}`
4. Press Enter or click OK
5. **✅ Expected:** Manuscript appears in dropdown selector
6. **✅ Expected:** Manuscript is auto-selected
7. **❌ Bug:** Modal closes but nothing happens

### Test 2: Verify Persistence
1. With manuscript selected, type something in "Introduction" section
2. Refresh the page (F5)
3. Navigate back to Academic Writing
4. **✅ Expected:** Manuscript still appears in dropdown
5. **✅ Expected:** Content is preserved

### Test 3: Multiple Manuscripts
1. Click "New Manuscript" again
2. Create 2-3 more manuscripts
3. Switch between them using dropdown
4. **✅ Expected:** All manuscripts visible
5. **✅ Expected:** Content switches correctly

## 🔧 What Was Fixed

### Root Cause
```typescript
// BEFORE (Broken):
storage.manuscripts.save(manuscript);  // ❌ Missing projectId parameter

// AFTER (Fixed):
storage.manuscripts.save(manuscript, manuscript.projectMeta.projectId);  // ✅ Correct
```

### Files Modified
- `/utils/storageService.ts` - Added `get()` method to manuscripts API
- `/services/manuscriptService.ts` - Fixed 20+ storage API calls

### Technical Details
- Missing `get(manuscriptId, projectId)` method in storage API
- All `save()` and `delete()` calls missing required `projectId` parameter
- Silent failures - no error messages in console
- Data was never persisted to localStorage

## 🚨 Known Issues to Watch

### If Still Broken
1. **Check browser console** for TypeScript errors
2. **Clear localStorage:** `localStorage.clear()` in DevTools console
3. **Hard refresh:** Ctrl+Shift+R or Cmd+Shift+R
4. **Check project is selected:** Top bar should show current project

### Symptoms of Other Issues
- "Cannot read property 'projectId' of undefined" → Project not loaded
- "Manuscript XYZ not found" → Storage key mismatch
- Blank dropdown after creating → React Query cache issue

## 📋 Success Checklist

After testing, verify:
- [ ] No console errors when creating manuscript
- [ ] Manuscript appears in dropdown immediately
- [ ] Dropdown shows manuscript title (not "undefined")
- [ ] Can type content in all IMRaD sections
- [ ] Content persists after refresh
- [ ] Can create multiple manuscripts
- [ ] Can switch between manuscripts
- [ ] Console shows: `💾 Manuscript saved for project: [projectId]`

## 🐛 If Bug Persists

### Debug Steps
1. Open DevTools Console
2. Run: `localStorage.getItem('manuscripts-' + localStorage.getItem('currentProjectId'))`
3. Should see JSON array of manuscripts
4. If null/undefined → Bug still exists
5. If shows data → React Query cache issue

### Emergency Rollback
If this fix breaks something:
1. Revert `/services/manuscriptService.ts` changes
2. Revert `/utils/storageService.ts` changes
3. Report which test case failed

## 📊 Test Results Template

```
Date: _______________
Tester: _______________

Test 1 (Create): ☐ Pass  ☐ Fail  ☐ N/A
Test 2 (Persist): ☐ Pass  ☐ Fail  ☐ N/A
Test 3 (Multiple): ☐ Pass  ☐ Fail  ☐ N/A

Notes:
_________________________________
_________________________________
_________________________________

Console Errors:
_________________________________
_________________________________
_________________________________
```

---

**Expected Test Time:** 3-5 minutes  
**Critical:** This blocks Academic Writing module completely
