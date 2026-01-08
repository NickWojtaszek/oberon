# UI Change Quick Reference Card
**Checkpoint:** PRE-UI-REFACTOR-2026-01-04  
**Print this and keep it handy while making changes!**

---

## ⚡ The 3 Golden Rules

### 1. ✅ SAFE: Change how it LOOKS
```tsx
// ✅ Colors, spacing, layout
className="bg-blue-600 p-4 rounded-lg shadow-md"

// ✅ Icons
<Search className="w-5 h-5" />  →  <Filter className="w-5 h-5" />

// ✅ Layout structure
<div className="flex"> → <div className="grid grid-cols-2">
```

### 2. ⚠️ CAUTION: Check all references before changing
```tsx
// ⚠️ Props (update all parent components)
interface Props { name: string } → { title: string }

// ⚠️ Event handlers (update all onClick references)
const handleClick = () => {} → const handleSubmit = () => {}
```

### 3. ❌ NEVER: Touch the data layer
```tsx
// ❌ NEVER change these
storage.protocols.save(...)
const { currentProject } = useProject()
if (!isOpen) return null;
```

---

## 🎨 Safe UI Patterns

### Colors (Change freely)
```tsx
bg-blue-600    → bg-purple-600
text-slate-700 → text-slate-900
border-slate-200 → border-gray-200
```

### Spacing (Change freely)
```tsx
gap-4 → gap-6
p-4 → p-6
mt-2 → mt-4
```

### Layout (Change freely)
```tsx
flex → grid
flex-col → flex-row
justify-between → justify-center
```

### Typography (⚠️ Use sparingly - prefer defaults)
```tsx
// Only add if explicitly needed
text-sm, font-medium, leading-tight
```

---

## 🚨 Critical Patterns - DO NOT BREAK

### Pattern 1: Modal Visibility
```tsx
// MUST HAVE THIS LINE
if (!isOpen) return null;
```

### Pattern 2: Project Context
```tsx
// MUST USE EXACTLY THIS
const { currentProject } = useProject();
```

### Pattern 3: Project-Scoped Storage
```tsx
// MUST INCLUDE projectId
storage.protocols.save(protocols, currentProject.id);
storage.protocols.getAll(currentProject.id);
```

### Pattern 4: Form Submit (New!)
```tsx
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
  if (isSubmitting) return;  // ← MUST HAVE
  try {
    setIsSubmitting(true);
    // ... your logic
  } finally {
    setIsSubmitting(false);  // ← MUST HAVE
  }
};
```

---

## 🧪 Test After Every Change

### Quick Smoke Test (2 minutes)
```
1. Refresh page → No console errors? ✅
2. Click "Create Project" → Modal opens? ✅
3. Fill form + submit → Project created? ✅
4. Switch projects → Different data? ✅
5. Check localStorage → Data saved? ✅
```

---

## 🔍 Common Mistakes & Fixes

### Mistake 1: Button doesn't work
```tsx
// ❌ BAD - Handler doesn't exist
<button onClick={handleClick}>

// ✅ FIX - Define the handler
const handleClick = () => { ... };
<button onClick={handleClick}>
```

### Mistake 2: Modal always visible
```tsx
// ❌ BAD - No visibility check
export function Modal({ isOpen }) {
  return <div>...</div>
}

// ✅ FIX - Add guard
export function Modal({ isOpen }) {
  if (!isOpen) return null;
  return <div>...</div>
}
```

### Mistake 3: Data doesn't save
```tsx
// ❌ BAD - Missing projectId
storage.protocols.save(protocols);

// ✅ FIX - Include projectId
storage.protocols.save(protocols, currentProject.id);
```

### Mistake 4: Props don't match
```tsx
// ❌ BAD - Parent passes different prop
<Child userName="John" />
// But Child expects:
function Child({ name }: { name: string })

// ✅ FIX - Match the interfaces
<Child name="John" />
function Child({ name }: { name: string })
```

---

## 📋 Pre-Commit Checklist

Before committing UI changes:
- [ ] No new console errors
- [ ] Create project works
- [ ] Switch projects works
- [ ] All modals open/close
- [ ] Forms submit correctly
- [ ] Data persists after reload

---

## 🆘 Emergency Contacts

### If you break something:

1. **Check console first** - Error message = clue
2. **Read CRITICAL_FILES_BACKUP_REFERENCE.md** - Find rollback priority
3. **Restore critical files** - Start with storageService.ts
4. **Review STATE_CHECKPOINT_PRE_UI_CHANGES.md** - See what was working
5. **Check ARCHITECTURE_SNAPSHOT.md** - Understand data flow

---

## 💡 Pro Tips

### Tip 1: Change incrementally
Make one component look good, test, commit. Repeat.

### Tip 2: Don't mass-replace
Changing `onClick` everywhere? Do it file-by-file and test each time.

### Tip 3: Keep data layer pristine
If unsure whether to change something, don't. Ask first.

### Tip 4: Comment out, don't delete
```tsx
// const oldHandler = () => { ... };  // ← Keep for reference
const newHandler = () => { ... };
```

### Tip 5: Use browser DevTools
React DevTools → Check props flowing correctly

---

## 🎯 Safe Enhancement Examples

### Example 1: Better Button
```tsx
// Before
<button onClick={handleSubmit}>Submit</button>

// After (SAFE)
<button 
  onClick={handleSubmit}
  disabled={isSubmitting}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg 
             hover:bg-blue-700 transition-colors
             disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</button>
```

### Example 2: Better Card
```tsx
// Before
<div className="bg-white p-4">
  <h3>{title}</h3>
  {children}
</div>

// After (SAFE)
<div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200
                hover:shadow-xl transition-shadow">
  <h3 className="mb-4">{title}</h3>
  {children}
</div>
```

### Example 3: Better Modal
```tsx
// Before
if (!isOpen) return null;
return <div className="modal">{children}</div>;

// After (SAFE)
if (!isOpen) return null;
return (
  <>
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full
                      transform transition-all">
        {children}
      </div>
    </div>
  </>
);
```

---

## ⚠️ Files You'll Probably Modify

### High Probability (Visual changes)
```
/components/TopBar.tsx
/components/ProjectSelector.tsx  
/components/DashboardV2.tsx
/components/StatusBadge.tsx
/components/academic-writing/ManuscriptEditor.tsx
/components/protocol-workbench/components/SchemaBlock.tsx
```

### Medium Probability (Layout changes)
```
/App.tsx (layout structure)
/components/protocol-workbench/ProtocolWorkbenchCore.tsx
/components/AcademicWriting.tsx
```

### Low Probability (Don't touch unless necessary)
```
/contexts/ProjectContext.tsx
/utils/storageService.ts
/utils/schemaLocking.ts
```

---

## 🎨 Design System Quick Ref

### Colors
```
Primary:   bg-blue-600, text-blue-600, border-blue-600
Success:   bg-green-600, text-green-600
Warning:   bg-amber-600, text-amber-600
Danger:    bg-red-600, text-red-600
Text:      text-slate-900 (primary), text-slate-600 (secondary)
Border:    border-slate-200
BG:        bg-slate-50 (subtle), bg-white (cards)
```

### Spacing
```
Tight:     gap-2 (8px)
Normal:    gap-4 (16px)
Loose:     gap-6 (24px)
Padding:   p-4 (cards), p-6 (modals), p-8 (page)
```

### Borders
```
Subtle:    border border-slate-200
Strong:    border-2 border-slate-300
Rounded:   rounded-lg (cards), rounded-xl (modals)
```

### Shadows
```
Subtle:    shadow-sm
Normal:    shadow-md
Strong:    shadow-lg
Modal:     shadow-2xl
```

---

**Status:** READY FOR UI CHANGES ✅  
**Last Updated:** 2026-01-04  
**Emergency Rollback:** See STATE_CHECKPOINT_PRE_UI_CHANGES.md

🎨 **Go make it beautiful - but keep it functional!**
