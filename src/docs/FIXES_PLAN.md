# 🔧 Fixes Plan - Code Corruption Prevention & Feature Integration

## **Investigation Summary**

### **Issue 1: Protocol Library Not Loading Back to Builder** 🔴 CRITICAL
**Root Cause:** 
- ProtocolManager passes `initialProtocolId` and `initialVersionId` props
- ProtocolWorkbench receives them but auto-load logic has race condition
- The `hasAttemptedAutoLoad` flag prevents re-loading when switching between library and builder
- When user clicks "Edit" in library, the key prop changes but state doesn't reset properly

**Impact:** Users can't edit existing protocols from library

---

### **Issue 2: Autonomy Slider Not in Main Header** 🟡 UX
**Root Cause:**
- Autonomy Slider is in right sidebar (Intelligence panel)
- Should be in main header for global visibility

**Impact:** Users have to scroll to find autonomy controls

---

### **Issue 3: Budget Tracker Not Connected to Generate Buttons** 🟡 UX
**Root Cause:**
- Word budget calculations exist in `useJournalConstraints`
- Generate buttons don't check limits before generating
- No word count tracking during generation

**Impact:** AI can exceed journal word limits

---

### **Issue 4: Logic Audit Sidebar Not Linked to Run Logic Check** 🟡 UX
**Root Cause:**
- Logic Check button triggers verification
- Sidebar opens separately
- Not auto-opening after logic check completes

**Impact:** Users have to manually open sidebar after running check

---

### **Issue 5: Export Package Doesn't Default to Verification Appendix** 🟡 UX
**Root Cause:**
- ExportDialog has `includeAppendix: true` but the field name doesn't match service layer
- Service uses `includeVerificationAppendix` and `includeSourceLibrary`
- Type mismatch between UI and service

**Impact:** Confusing export options

---

## **Fix Strategy - Modular & Safe**

### **Phase 1: Protocol Loading Fix** ⏱️ 30 min
1. Fix ProtocolWorkbench auto-load race condition
2. Add proper state reset on navigation
3. Add loading indicators
4. Test library → builder → library flow

### **Phase 2: Autonomy Slider Integration** ⏱️ 15 min
1. Move AutonomySlider to AcademicWriting header
2. Keep it visible at all times
3. Remove from sidebar
4. Test mode switching

### **Phase 3: Budget Tracker + Generate Buttons** ⏱️ 30 min
1. Add word counting to ManuscriptEditor
2. Pass constraints to generate functions
3. Add limit checks before generation
4. Show warning when limit would be exceeded
5. Test generation stop at limit

### **Phase 4: Logic Audit Auto-Open** ⏱️ 10 min
1. Auto-open sidebar after logic check completes
2. Scroll to first conflict
3. Add notification badge
4. Test flow

### **Phase 5: Export Package Standardization** ⏱️ 20 min
1. Update ExportOptions type to match service
2. Set `includeVerificationAppendix: true` by default
3. Update ExportDialog UI
4. Remove confusing toggles
5. Test export flow

---

## **Implementation Order**

1. ✅ Protocol Loading (Critical bug)
2. ✅ Export Package (Type safety)
3. ✅ Autonomy Slider (Simple move)
4. ✅ Logic Audit Auto-Open (Simple state change)
5. ✅ Budget Tracker (Complex integration)

---

## **Testing Checklist**

### Protocol Loading
- [ ] Library → Click Edit → Loads in builder
- [ ] Make changes → Save → Return to library
- [ ] Library shows updated protocol
- [ ] Click Edit again → Loads with changes

### Autonomy Slider
- [ ] Visible in header at all times
- [ ] Changes AI behavior immediately
- [ ] Position persists across tabs

### Budget Tracker
- [ ] Word count updates as user types
- [ ] Generate button disabled if over limit
- [ ] Warning shows before generation
- [ ] Generation stops at limit

### Logic Audit
- [ ] Run Logic Check → Sidebar opens
- [ ] Shows conflicts
- [ ] Can resolve conflicts
- [ ] Sidebar closes properly

### Export Package
- [ ] Verification Appendix included by default
- [ ] Options are clear
- [ ] Export completes successfully
- [ ] Downloaded files are correct

---

## **Code Corruption Prevention**

### Strategy:
1. **Small, focused changes** - One file at a time
2. **Test build after each fix** - Catch errors immediately
3. **Use fast_apply_tool** - Minimal diffs
4. **Keep backups** - Save working state
5. **Modular approach** - Independent fixes

### Risk Mitigation:
- ✅ Each fix is independent
- ✅ No cascading changes
- ✅ Test between phases
- ✅ Roll back if needed

---

## **Files to Modify**

### Phase 1 (Protocol Loading):
- `/components/protocol-workbench/ProtocolWorkbenchCore.tsx` (Fix auto-load logic)

### Phase 2 (Autonomy Slider):
- `/components/AcademicWriting.tsx` (Move slider to header)

### Phase 3 (Budget Tracker):
- `/components/academic-writing/ManuscriptEditor.tsx` (Add word counting)
- `/components/AcademicWriting.tsx` (Pass constraints)

### Phase 4 (Logic Audit):
- `/components/AcademicWriting.tsx` (Auto-open sidebar)

### Phase 5 (Export Package):
- `/types/verificationAppendix.ts` (Update ExportOptions)
- `/components/academic-writing/ExportDialog.tsx` (Update defaults)
- `/services/exportService.ts` (Ensure compatibility)

---

**Ready to implement? Each phase is independent and can be tested separately.**
