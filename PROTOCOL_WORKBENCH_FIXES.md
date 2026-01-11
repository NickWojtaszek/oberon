# Protocol Workbench Critical Fixes

## Issues Identified

### 1. ❌ Gemini API 400 Error (CRITICAL - Blocks AI Features)
**Error**: `generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=... 400`

**Root Cause**: Model name `gemini-2.0-flash` may not exist or is incorrect
- Gemini 2.0 Flash is experimental and might require different model ID
- Should use stable model like `gemini-1.5-flash` or `gemini-1.5-pro`

**Fix**:
- Change model from `gemini-2.0-flash` to `gemini-1.5-flash` (stable, fast, free tier)
- File: `src/services/geminiService.ts:11`

---

### 2. ❌ Schema Blocks Not Saving After "Save Draft"
**Symptoms**: Save Draft modal appears but schema blocks disappear after save

**Root Cause Analysis Needed**:
1. Check if `schemaBlocks` are included in `saveProtocol()` call
2. Verify `useSchemaState` hook persistence
3. Check if auto-save is overriding manual save

**Investigation Steps**:
- Check `useVersionControl.ts` - `saveProtocol()` function
- Verify `schemaBlocks` are being passed correctly
- Check localStorage persistence

---

### 3. ❌ Protocol Fields Reset on Tab Navigation
**Symptoms**: All protocol metadata/content fields become blank when switching tabs

**Root Cause**: Likely state management issue
- Protocol state not persisting between tab switches
- Possible re-initialization of `useProtocolState` hook

**Fix Strategy**:
- Check if `protocolState` is being reset on tab change
- Verify `useProtocolState` hook doesn't re-initialize
- Ensure state persistence in `ProtocolWorkbenchCore`

---

### 4. ⚠️  DOCX Upload Failing (Lower Priority)
**Symptoms**: PDF uploads work, DOCX fails

**Root Cause**: `extractFromPDF` function may not handle DOCX properly
- Function name suggests PDF-only
- Need to check DOCX MIME type handling
- Gemini API might need different handling for DOCX

**Deferred**: Fix later as noted by user

---

### 5. ❌ AI Toggle Not Visible
**Symptoms**: No AI toggle or recommendations in schema tab

**Root Cause**: Toggle IS implemented but:
- Hidden due to Gemini API 400 errors preventing rendering
- OR toggle is only showing when `activeTab === 'schema'`

**Fix**: Resolve Gemini API error first, then verify toggle visibility

---

## Fix Implementation Order

### Priority 1: Fix Gemini API (Unblocks AI Features)
**Time**: 5 minutes
**Impact**: HIGH - Enables all AI features

```typescript
// src/services/geminiService.ts
// CHANGE LINE 11:
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
```

### Priority 2: Fix Schema Blocks Not Saving
**Time**: 30 minutes
**Impact**: HIGH - Critical data loss issue

Steps:
1. Read `useVersionControl.ts` - check `saveProtocol()` function
2. Verify `schemaBlocks` parameter is being saved
3. Check if blocks are being loaded correctly
4. Test save/load cycle

### Priority 3: Fix Protocol Fields Resetting
**Time**: 20 minutes
**Impact**: HIGH - User experience issue

Steps:
1. Check `useProtocolState` hook initialization
2. Verify state doesn't reset on tab change
3. Add state persistence debugging
4. Test tab navigation

### Priority 4: Verify AI Toggle Visibility
**Time**: 10 minutes
**Impact**: MEDIUM - After API fix, should work

Steps:
1. After fixing Gemini API, check if toggle appears
2. Verify toggle is in correct location (Schema tab)
3. Test enable/disable functionality

---

## Testing Checklist

After fixes:
- [ ] AI suggestions appear when configuring fields
- [ ] Schema blocks persist after "Save Draft"
- [ ] Protocol fields remain filled when switching tabs
- [ ] AI toggle is visible in Schema tab
- [ ] Toggle enables/disables AI suggestions
- [ ] PDF upload works
- [ ] No 400 errors in console

---

## Code Locations

**Files to Modify**:
1. `src/services/geminiService.ts:11` - Fix API URL
2. `src/components/protocol-workbench/hooks/useVersionControl.ts` - Check save logic
3. `src/components/protocol-workbench/hooks/useProtocolState.ts` - Check state persistence
4. `src/components/protocol-workbench/ProtocolWorkbenchCore.tsx` - Tab navigation logic
