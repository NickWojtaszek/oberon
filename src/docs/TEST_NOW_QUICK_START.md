# TEST NOW - Quick Start Guide 🧪

## 1-Minute Smoke Test

The fastest way to verify the fix is working.

---

## Test: Create Project → See Protocol

### Steps (60 seconds)

1. **Open your browser** to the app

2. **Open Developer Console** (F12 or Cmd+Option+I)

3. **Click "Create Project"**

4. **Fill in:**
   - Name: "Test RCT"
   - Study Number: "TEST-001"
   - Select: **Randomized Controlled Trial (RCT)**

5. **Click "Create Project"**

6. **Watch Console** - Should see:
   ```
   🔄 Converting simplified schema blocks to full format...
   ✅ Converted 15 simplified blocks → 15 full blocks
   ```

7. **Click "Protocol Builder"** in sidebar

8. **Watch Console** - Should see:
   ```
   📂 [useVersionControl] Loading protocols for project: Test RCT
   🔄 Auto-load check for project: Test RCT
   ✅ Auto-loading protocol: { protocolNumber: 'TEST-001', ... }
   📖 [useVersionControl] Loading protocol version: { ... }
   ✅ Auto-load complete
   ```

9. **Check UI:**
   - ✅ Blue banner: "Auto-loaded protocol TEST-001 (RCT)"
   - ✅ Left panel: Shows RCT endpoints
   - ✅ Center panel: Schema editor with blocks

---

## ✅ SUCCESS = All 3 Things Visible

1. ✅ **Console logs** match above
2. ✅ **Auto-load banner** appears
3. ✅ **Schema blocks** visible in editor

---

## ❌ FAILURE Signs

### If Protocol Builder is Blank:
```
Check console for:
- Missing: "✅ Auto-loading protocol..."
- Shows: "ℹ️ No protocols found for project"
```

**→ The fix didn't work** - Report to developer

### If Console Shows Errors:
```
❌ Cannot save protocol: No current project
❌ Protocol not found: ...
❌ Failed to load protocols: ...
```

**→ Integration issue** - Report to developer

---

## 2-Minute Full Test

If smoke test passes, verify Database integration:

### Steps

1. **After step 9 above**, click "Database" in sidebar

2. **Select** "TEST-001" from protocol dropdown

3. **Click** "Data Entry" tab

4. **Check:**
   - ✅ Form fields are visible
   - ✅ Fields include: Primary Endpoint Change, Response Rate, etc.
   - ✅ Can click into fields

---

## Quick Checks (Browser Console)

### Check 1: Legacy Storage Removed
```javascript
localStorage.getItem('clinical-intelligence-protocols')
// Should be: null
```

### Check 2: Project Storage Exists
```javascript
const projectId = localStorage.getItem('clinical-current-project');
const key = `clinical-protocols-${projectId}`;
localStorage.getItem(key) !== null
// Should be: true
```

### Check 3: Protocol Count
```javascript
const projectId = localStorage.getItem('clinical-current-project');
const protocols = JSON.parse(localStorage.getItem(`clinical-protocols-${projectId}`));
protocols.length
// Should be: 1 (or more)
```

### Check 4: Schema Blocks Present
```javascript
const projectId = localStorage.getItem('clinical-current-project');
const protocols = JSON.parse(localStorage.getItem(`clinical-protocols-${projectId}`));
protocols[0].versions[0].schemaBlocks.length
// Should be: > 0 (e.g., 15 for RCT)
```

---

## Screenshot Checklist

Take screenshots of:

1. ✅ Console showing conversion logs
2. ✅ Console showing auto-load logs
3. ✅ Protocol Builder with auto-load banner
4. ✅ Schema blocks in editor
5. ✅ Database Data Entry with fields

---

## Report Results

### If SUCCESS ✅
```
TEST PASSED ✅

1. Created RCT project
2. Protocol auto-generated
3. Protocol Builder auto-loaded
4. Schema blocks visible
5. Database forms work

Console logs: [Paste key logs]
Screenshots: [Attach]
```

### If FAILURE ❌
```
TEST FAILED ❌

Step that failed: [Which step?]
Console output: [Paste full console]
What you saw: [Describe]
What you expected: [Describe]
Screenshots: [Attach]
```

---

## Emergency Rollback

If app is completely broken:

```javascript
// In browser console
localStorage.clear();
location.reload();
// This resets everything - you'll lose data!
```

---

## Test Duration

- **Smoke test:** 60 seconds
- **Full test:** 2 minutes
- **Console checks:** 30 seconds
- **Screenshots:** 1 minute

**Total:** ~4 minutes for complete verification

---

## Ready?

Open your browser console and start with Step 1! 🚀
