# Infinite Loop Fix - React useEffect Maximum Update Depth Exceeded

## Error Summary

```
Warning: Maximum update depth exceeded. This can happen when a component 
calls setState inside useEffect, but useEffect either doesn't have a 
dependency array, or one of the dependencies changes on every render.
    at AnalyticsApp (components/AnalyticsApp.tsx:13:29)
```

## Root Causes

### 1. **Unstable Function Reference in useEffect Dependencies**

**Location**: `/components/database/hooks/useDatabase.ts`

**Problem**:
```typescript
// ❌ BEFORE: Function recreated on every render
const loadProtocols = () => {
  // ... setState calls ...
};

useEffect(() => {
  loadProtocols();
  const interval = setInterval(loadProtocols, 2000);
  return () => clearInterval(interval);
}, [currentProject]); // Missing loadProtocols in deps causes lint errors
```

The `loadProtocols` function was:
- Created on every render (new reference each time)
- If added to dependencies → infinite loop
- If omitted from dependencies → stale closure issues

**Solution**:
```typescript
// ✅ AFTER: Memoized with useCallback
const loadProtocols = useCallback(() => {
  if (!currentProject) {
    setSavedProtocols([]);
    setHasAutoSelected(false);
    return;
  }

  try {
    const protocols = storage.protocols.getAll(currentProject.id);
    setSavedProtocols(protocols);
  } catch (error) {
    console.error('Error loading protocols:', error);
    setSavedProtocols([]);
  }
}, [currentProject]);

useEffect(() => {
  loadProtocols();
  const interval = setInterval(loadProtocols, 2000);
  return () => clearInterval(interval);
}, [loadProtocols]); // ✅ Now safe to include
```

---

### 2. **Auto-Selection Logic Triggering setState in Loop**

**Location**: `/components/database/hooks/useDatabase.ts`

**Problem**:
```typescript
// ❌ BEFORE: Runs on every protocol load
const loadProtocols = () => {
  // ... load protocols ...
  
  // Auto-select protocol (runs EVERY 2 seconds!)
  if (!selectedProtocolId && protocols.length > 0) {
    setSelectedProtocolId(protocols[0].id);
    setSelectedVersionId(protocols[0].versions[0].id);
  }
};
```

This caused:
1. `loadProtocols()` called every 2 seconds
2. If protocols exist → set state
3. State change → re-render
4. Re-render → new `loadProtocols` reference (if not memoized)
5. Infinite loop!

**Solution**:
```typescript
// ✅ AFTER: Separate auto-selection logic with guard flag
const [hasAutoSelected, setHasAutoSelected] = useState(false);

// Load protocols (just data fetching)
const loadProtocols = useCallback(() => {
  if (!currentProject) {
    setSavedProtocols([]);
    setHasAutoSelected(false); // Reset flag on project change
    return;
  }

  try {
    const protocols = storage.protocols.getAll(currentProject.id);
    setSavedProtocols(protocols); // ONLY set protocols
  } catch (error) {
    console.error('Error loading protocols:', error);
    setSavedProtocols([]);
  }
}, [currentProject]);

// Auto-select (runs once, guarded by hasAutoSelected flag)
useEffect(() => {
  if (!hasAutoSelected && savedProtocols.length > 0 && !selectedProtocolId) {
    const firstProtocol = savedProtocols[0];
    setSelectedProtocolId(firstProtocol.id);
    
    // Select best version...
    const activeVersions = firstProtocol.versions.filter(v => v.status !== 'archived');
    const publishedVersions = activeVersions.filter(v => v.status === 'published');
    
    if (publishedVersions.length > 0) {
      setSelectedVersionId(publishedVersions[publishedVersions.length - 1].id);
    }
    
    setHasAutoSelected(true); // ✅ Prevent re-running
  }
}, [savedProtocols.length, selectedProtocolId, hasAutoSelected]);
```

---

### 3. **Duplicate Auto-Selection in AnalyticsApp**

**Location**: `/components/AnalyticsApp.tsx`

**Problem**:
```typescript
// ❌ BEFORE: Duplicate auto-selection logic
useEffect(() => {
  loadProtocols();
}, [loadProtocols]); // Unstable reference

useEffect(() => {
  if (savedProtocols.length > 0 && !selectedProtocolId) {
    setSelectedProtocolId(savedProtocols[0].id);
    setSelectedVersionId(/* ... */);
  }
}, [savedProtocols, selectedProtocolId, setSelectedProtocolId, setSelectedVersionId]);
// ❌ Including setter functions in deps is unnecessary and can cause issues
```

**Solution**:
```typescript
// ✅ AFTER: Let useDatabase handle auto-selection
useEffect(() => {
  loadProtocols();
}, []); // eslint-disable-line react-hooks/exhaustive-deps
// Load once on mount, useDatabase handles the rest
```

---

## Key Principles for Preventing Infinite Loops

### 1. **Memoize Functions Used in useEffect**
```typescript
// ❌ BAD
const myFunction = () => { /* ... */ };

useEffect(() => {
  myFunction();
}, [myFunction]); // Infinite loop!

// ✅ GOOD
const myFunction = useCallback(() => {
  /* ... */
}, [dependencies]);

useEffect(() => {
  myFunction();
}, [myFunction]); // Safe!
```

### 2. **Never Include Setter Functions in Dependencies**
```typescript
// ❌ BAD
useEffect(() => {
  if (condition) {
    setSomeState(value);
  }
}, [condition, setSomeState]); // setSomeState is stable, don't include it

// ✅ GOOD
useEffect(() => {
  if (condition) {
    setSomeState(value);
  }
}, [condition]); // Only include condition
```

### 3. **Use Guard Flags for One-Time Auto-Actions**
```typescript
// ❌ BAD: Runs every time protocols.length changes
useEffect(() => {
  if (protocols.length > 0) {
    selectFirst();
  }
}, [protocols.length]);

// ✅ GOOD: Runs once with guard flag
const [hasSelected, setHasSelected] = useState(false);

useEffect(() => {
  if (!hasSelected && protocols.length > 0) {
    selectFirst();
    setHasSelected(true);
  }
}, [protocols.length, hasSelected]);
```

### 4. **Separate Data Loading from Auto-Selection**
```typescript
// ❌ BAD: Auto-select inside load function
const loadData = () => {
  const data = fetchData();
  setData(data);
  
  // Auto-select (runs every time!)
  if (data.length > 0) {
    setSelected(data[0].id);
  }
};

// ✅ GOOD: Separate concerns
const loadData = useCallback(() => {
  const data = fetchData();
  setData(data); // Only set data
}, []);

useEffect(() => {
  if (!hasSelected && data.length > 0) {
    setSelected(data[0].id);
    setHasSelected(true);
  }
}, [data.length, hasSelected]);
```

### 5. **Avoid Cascading State Updates**
```typescript
// ❌ BAD: Cascading updates
useEffect(() => {
  setStateA(valueA);
}, [valueA]);

useEffect(() => {
  setStateB(stateA); // Triggers when stateA changes
}, [stateA]);

useEffect(() => {
  setStateC(stateB); // Triggers when stateB changes
}, [stateB]);
// This creates a cascade!

// ✅ GOOD: Batch or derive
useEffect(() => {
  setStateA(valueA);
  setStateB(deriveB(valueA));
  setStateC(deriveC(valueA));
}, [valueA]);

// Or use derived state (no useEffect needed)
const stateB = useMemo(() => deriveB(stateA), [stateA]);
const stateC = useMemo(() => deriveC(stateB), [stateB]);
```

---

## Changes Made

### File: `/components/database/hooks/useDatabase.ts`

**Changes**:
1. ✅ Added `useCallback` import
2. ✅ Memoized `loadProtocols` with `useCallback`
3. ✅ Separated auto-selection logic into separate `useEffect`
4. ✅ Added `hasAutoSelected` guard flag
5. ✅ Removed state updates from `loadProtocols` function
6. ✅ Fixed dependency arrays

### File: `/components/AnalyticsApp.tsx`

**Changes**:
1. ✅ Removed duplicate auto-selection logic
2. ✅ Simplified `useEffect` to only call `loadProtocols()` once
3. ✅ Rely on `useDatabase` hook for auto-selection

---

## Testing Checklist

After applying these fixes, verify:

- [ ] ✅ No "Maximum update depth exceeded" errors in console
- [ ] ✅ Analytics screen loads without crashing
- [ ] ✅ Database screen loads without crashing
- [ ] ✅ Protocol selection works in both screens
- [ ] ✅ Version selection works correctly
- [ ] ✅ Auto-selection happens once on mount
- [ ] ✅ No infinite re-renders (check React DevTools)
- [ ] ✅ Polling every 2 seconds works without errors

---

## Prevention Checklist for Future Development

Before adding `useEffect`:
- [ ] Are all functions in dependencies memoized with `useCallback`?
- [ ] Are setter functions excluded from dependencies?
- [ ] Is this a one-time action? Add a guard flag.
- [ ] Does this cause cascading updates? Consider batching.
- [ ] Can this be derived state instead? Use `useMemo`.
- [ ] Test in React Strict Mode (double-invokes effects)

---

## Additional Resources

- [React Docs: useEffect](https://react.dev/reference/react/useEffect)
- [React Docs: useCallback](https://react.dev/reference/react/useCallback)
- [Common useEffect Pitfalls](https://react.dev/learn/synchronizing-with-effects#you-might-not-need-an-effect)
- [Exhaustive Dependencies Rule](https://react.dev/reference/rules/react-hooks#exhaustive-deps)

---

## Summary

**Problem**: Infinite loop caused by unstable function references and duplicate auto-selection logic.

**Solution**: 
1. Memoized functions with `useCallback`
2. Separated data loading from auto-selection
3. Added guard flags for one-time actions
4. Removed duplicate logic

**Result**: Clean, stable component lifecycle with no infinite loops.
