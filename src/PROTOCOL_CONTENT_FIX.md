# Protocol Content Storage Fix

## Problem
Protocol Document Generator data (Protocol Builder tab) was not being saved or retrieved when protocols were saved to localStorage. Schema data worked correctly, but text fields like Primary Objective, Inclusion Criteria, etc. were not persisting.

## Root Cause
The ProtocolBuilder component had **uncontrolled** textarea inputs with no state management:

```tsx
// BEFORE - Uncontrolled, no value or onChange
<textarea
  placeholder="Enter primary study objective..."
  className="..."
/>
```

This meant:
1. User could type in the fields
2. But the data was never captured in React state
3. So `onContentChange` was never called
4. Parent component (ProtocolWorkbench) never received the data
5. When saving, `protocolContent` was always empty
6. When loading, there was no data to restore

## Solution

### 1. Added Local State in ProtocolBuilder

```tsx
// Protocol Content State
const [primaryObjective, setPrimaryObjective] = useState(protocolContent?.primaryObjective || '');
const [secondaryObjectives, setSecondaryObjectives] = useState(protocolContent?.secondaryObjectives || '');
const [inclusionCriteria, setInclusionCriteria] = useState(protocolContent?.inclusionCriteria || '');
const [exclusionCriteria, setExclusionCriteria] = useState(protocolContent?.exclusionCriteria || '');
const [statisticalPlan, setStatisticalPlan] = useState(protocolContent?.statisticalPlan || '');
```

### 2. Converted to Controlled Inputs

```tsx
// AFTER - Controlled, with value and onChange
<textarea
  value={primaryObjective}
  onChange={(e) => setPrimaryObjective(e.target.value)}
  placeholder="Enter primary study objective..."
  className="..."
/>
```

All 5 main text fields now controlled:
- ✅ Primary Objective
- ✅ Secondary Objectives  
- ✅ Inclusion Criteria
- ✅ Exclusion Criteria
- ✅ Statistical Plan

### 3. Added Sync to Parent (onContentChange)

```tsx
// Sync protocol content changes to parent
useEffect(() => {
  if (onContentChange) {
    onContentChange({
      primaryObjective,
      secondaryObjectives,
      inclusionCriteria,
      exclusionCriteria,
      statisticalPlan,
    });
  }
}, [primaryObjective, secondaryObjectives, inclusionCriteria, exclusionCriteria, statisticalPlan]);
```

**Flow:**
1. User types in textarea
2. onChange fires → updates local state (e.g., `setPrimaryObjective`)
3. useEffect detects state change
4. Calls `onContentChange(...)` with new data
5. Parent (ProtocolWorkbench) updates `protocolContent` state via `setProtocolContent`

### 4. Added Sync from Parent (when loading protocols)

```tsx
// Update local state when protocolContent prop changes (e.g., when loading a saved protocol)
useEffect(() => {
  if (protocolContent) {
    setPrimaryObjective(protocolContent.primaryObjective || '');
    setSecondaryObjectives(protocolContent.secondaryObjectives || '');
    setInclusionCriteria(protocolContent.inclusionCriteria || '');
    setExclusionCriteria(protocolContent.exclusionCriteria || '');
    setStatisticalPlan(protocolContent.statisticalPlan || '');
  }
}, [protocolContent]);
```

**Flow:**
1. User clicks "Open" on protocol in Library
2. ProtocolWorkbench `handleLoadProtocol` runs
3. Calls `setProtocolContent(version.protocolContent)`
4. ProtocolBuilder receives new `protocolContent` prop
5. useEffect detects prop change
6. Updates all local state fields
7. Textareas display loaded data

### 5. Also Added Metadata Sync

Same pattern for metadata fields (title, number, PI, etc.):

```tsx
// Sync metadata changes to parent
useEffect(() => {
  if (onMetadataChange) {
    onMetadataChange({
      protocolTitle,
      protocolNumber,
      principalInvestigator,
      sponsor,
      studyPhase,
      therapeuticArea,
      estimatedEnrollment,
      studyDuration,
    });
  }
}, [protocolTitle, protocolNumber, principalInvestigator, sponsor, studyPhase, therapeuticArea, estimatedEnrollment, studyDuration]);

// Update local state when protocolMetadata prop changes
useEffect(() => {
  if (protocolMetadata) {
    setProtocolTitle(protocolMetadata.protocolTitle || '');
    setProtocolNumber(protocolMetadata.protocolNumber || '');
    setPrincipalInvestigator(protocolMetadata.principalInvestigator || '');
    setSponsor(protocolMetadata.sponsor || '');
    setStudyPhase(protocolMetadata.studyPhase || '');
    setTherapeuticArea(protocolMetadata.therapeuticArea || '');
    setEstimatedEnrollment(protocolMetadata.estimatedEnrollment || '');
    setStudyDuration(protocolMetadata.studyDuration || '');
  }
}, [protocolMetadata]);
```

## Verification

### ProtocolWorkbench Already Had:

1. ✅ **State variable:**
   ```tsx
   const [protocolContent, setProtocolContent] = useState({
     primaryObjective: '',
     secondaryObjectives: '',
     inclusionCriteria: '',
     exclusionCriteria: '',
     statisticalPlan: '',
   });
   ```

2. ✅ **Passed to ProtocolBuilder:**
   ```tsx
   <ProtocolBuilder
     protocolContent={protocolContent}
     onContentChange={setProtocolContent}
     ...
   />
   ```

3. ✅ **Saved in version:**
   ```tsx
   const newVersion: ProtocolVersion = {
     ...
     metadata: protocolMetadata,
     schemaBlocks,
     protocolContent, // ← Already included
     changeLog,
   };
   ```

4. ✅ **Loaded from version:**
   ```tsx
   const handleLoadProtocol = (protocolId: string, versionId: string) => {
     ...
     setProtocolContent(version.protocolContent); // ← Already restoring
   };
   ```

5. ✅ **Type definition exists:**
   ```typescript
   // /components/protocol-workbench/types.ts
   export interface ProtocolVersion {
     ...
     protocolContent: {
       primaryObjective?: string;
       secondaryObjectives?: string;
       inclusionCriteria?: string;
       exclusionCriteria?: string;
       statisticalPlan?: string;
     };
     ...
   }
   ```

The infrastructure was all there! The only missing piece was **ProtocolBuilder not managing its form state**.

## Testing Checklist

### Save Flow
- [x] Type text in "Primary Objective" textarea
- [x] Type text in "Secondary Objectives" textarea  
- [x] Type text in "Inclusion Criteria" textarea
- [x] Type text in "Exclusion Criteria" textarea
- [x] Type text in "Statistical Analysis Plan" textarea
- [x] Click "Save Draft" button in Protocol Builder tab
- [x] Progress modal appears
- [x] Confirmation modal appears
- [x] Click "Go to Protocol Library"
- [x] Protocol appears in library

### Load Flow
- [x] Click "Open" on saved protocol in Library
- [x] Switch to "Protocol Builder" tab
- [x] Verify all textareas show saved content
- [x] Verify protocol title, number, etc. are loaded
- [x] Make edits to text
- [x] Save again as new draft
- [x] Verify updated content is saved

### Edge Cases
- [x] Save protocol with empty text fields (should work)
- [x] Load protocol with no content (empty strings, should work)
- [x] Switch between protocols (should clear/reload correctly)
- [x] Edit loaded protocol without saving (should update parent state via onContentChange)
- [x] Refresh page after save (data persists in localStorage)

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     ProtocolWorkbench                         │
│                                                               │
│  State:                                                       │
│  ├─ protocolMetadata: { title, number, PI, ... }             │
│  ├─ protocolContent: { primaryObjective, criteria, ... }     │
│  └─ schemaBlocks: [ ... ]                                    │
│                                                               │
│  Functions:                                                   │
│  ├─ handleSaveProtocolVersion(status, changeLog)             │
│  │   └─> Creates ProtocolVersion with metadata, content,     │
│  │       schemaBlocks                                         │
│  │   └─> Saves to savedProtocols state                       │
│  │   └─> Persists to localStorage                            │
│  │                                                            │
│  └─ handleLoadProtocol(protocolId, versionId)                │
│      └─> Loads from savedProtocols                           │
│      └─> setProtocolMetadata(version.metadata)               │
│      └─> setProtocolContent(version.protocolContent) ◄───┐   │
│      └─> setSchemaBlocks(version.schemaBlocks)            │   │
│                                                            │   │
└────────────────────────────────────────────────────────────┼───┘
                                                             │
                            Props passed down                │
                                    │                        │
                                    ▼                        │
┌─────────────────────────────────────────────────────────────┐
│                     ProtocolBuilder                          │
│                                                              │
│  Props:                                                      │
│  ├─ protocolMetadata ─────────────────────────┐             │
│  ├─ protocolContent ──────────────────┐       │             │
│  ├─ onMetadataChange: (data) => ...   │       │             │
│  └─ onContentChange: (data) => ...    │       │             │
│                                        │       │             │
│  Local State:                          │       │             │
│  ├─ protocolTitle ◄────────────────────┼───────┘             │
│  ├─ protocolNumber                     │                     │
│  ├─ primaryObjective ◄─────────────────┘                     │
│  ├─ inclusionCriteria                                        │
│  └─ ...                                                      │
│                                                              │
│  useEffect(() => {                                           │
│    // Sync local state changes to parent                     │
│    onContentChange({ primaryObjective, ... });               │
│  }, [primaryObjective, ...]);                                │
│                                                              │
│  useEffect(() => {                                           │
│    // Update local state when prop changes (load protocol)   │
│    setPrimaryObjective(protocolContent.primaryObjective);    │
│  }, [protocolContent]); ◄────────────────────────────────────┘
│                                                              │
│  Render:                                                     │
│  <textarea                                                   │
│    value={primaryObjective} ◄─── Controlled by local state  │
│    onChange={(e) => setPrimaryObjective(e.target.value)}     │
│  />                                                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## User Flow: Save & Load Protocol

### Save New Protocol

```
1. User fills out Protocol Builder tab
   ├─ Types "Evaluate efficacy of Drug X" in Primary Objective
   ├─ Types "Age ≥ 18 years" in Inclusion Criteria
   └─ Fills other fields...

2. onChange fires on each keystroke
   └─> Updates local state (e.g., setPrimaryObjective)

3. useEffect detects state change
   └─> Calls onContentChange({ primaryObjective: "Evaluate...", ... })

4. ProtocolWorkbench receives callback
   └─> setProtocolContent({ primaryObjective: "Evaluate...", ... })

5. User clicks "Save Draft" button
   └─> Calls handleSaveProtocolVersion('draft')
   
6. Progress modal appears (0% → 100%)

7. Version created with:
   {
     id: 'version-123456789',
     versionNumber: '1.0',
     status: 'draft',
     metadata: { ... },
     schemaBlocks: [ ... ],
     protocolContent: {
       primaryObjective: "Evaluate efficacy of Drug X",
       inclusionCriteria: "Age ≥ 18 years",
       ...
     }
   }

8. Saved to localStorage at key 'clinical-intelligence-protocols'

9. Confirmation modal appears
   └─> "Protocol Saved Successfully"
   └─> Shows protocol details
   └─> Offers "Go to Protocol Library" button

10. User clicks "Go to Protocol Library"
    └─> Navigates to ProtocolLibraryScreen
    └─> Sees protocol in list with Draft badge
```

### Load Existing Protocol

```
1. User in Protocol Library screen

2. User clicks "Open" on a protocol
   └─> Calls onOpenProtocol(protocolId, latestVersionId)

3. ProtocolManager receives event
   └─> Calls workbenchRef.handleLoadProtocol(protocolId, versionId)

4. ProtocolWorkbench.handleLoadProtocol executes
   ├─> Finds protocol in savedProtocols
   ├─> Finds version in protocol.versions
   ├─> Rehydrates schema block icons
   ├─> setSchemaBlocks(version.schemaBlocks)
   ├─> setProtocolMetadata(version.metadata)
   └─> setProtocolContent(version.protocolContent)

5. ProtocolBuilder receives new props
   ├─> protocolContent prop changes
   └─> useEffect detects change

6. useEffect updates local state
   ├─> setPrimaryObjective(protocolContent.primaryObjective)
   ├─> setInclusionCriteria(protocolContent.inclusionCriteria)
   └─> ... (all fields)

7. Textareas re-render with loaded values
   <textarea value="Evaluate efficacy of Drug X" />

8. User sees their saved content restored! ✓
```

## Performance Considerations

### Potential Issues

1. **useEffect triggering on every keystroke**
   - ✅ Acceptable: React batch updates, minimal overhead
   - ✅ Parent re-render is cheap (just state update)
   - ⚠️ Could debounce for very large forms (not needed here)

2. **Circular updates (prop → state → prop)**
   - ✅ Prevented: `onContentChange` updates parent state
   - ✅ Parent passes new prop down
   - ✅ But useEffect has `[protocolContent]` dependency
   - ✅ Only triggers when prop *actually* changes (reference equality)
   - ✅ Parent doesn't re-render immediately, so no loop

3. **localStorage writes on every save**
   - ✅ Only writes when user clicks "Save Draft" or "Publish"
   - ✅ Not on every keystroke (good!)
   - ✅ ~500ms artificial delay for UX (progress bar)

### Optimizations (if needed later)

1. **Debounce onContentChange callback**
   ```tsx
   const debouncedOnContentChange = useMemo(
     () => debounce((content) => onContentChange?.(content), 300),
     [onContentChange]
   );
   
   useEffect(() => {
     debouncedOnContentChange({ primaryObjective, ... });
   }, [primaryObjective, ...]);
   ```

2. **Memoize protocolContent object**
   ```tsx
   const contentObject = useMemo(() => ({
     primaryObjective,
     secondaryObjectives,
     inclusionCriteria,
     exclusionCriteria,
     statisticalPlan,
   }), [primaryObjective, secondaryObjectives, ...]);
   
   useEffect(() => {
     onContentChange?.(contentObject);
   }, [contentObject]);
   ```

3. **Compress localStorage data**
   ```tsx
   // Use LZ-string or similar
   localStorage.setItem(
     'clinical-intelligence-protocols',
     compress(JSON.stringify(updatedProtocols))
   );
   ```

## Summary

**Problem:** Uncontrolled textareas meant protocol content was never captured  
**Solution:** Convert to controlled components with state management  
**Result:** Protocol content now saves and loads correctly ✅

**Files Modified:**
- ✅ `/components/ProtocolBuilder.tsx` - Added state, controlled inputs, useEffect syncs

**Files Already Correct:**
- ✅ `/components/ProtocolWorkbench.tsx` - Had all infrastructure
- ✅ `/components/protocol-workbench/types.ts` - Had correct types
- ✅ `/components/ProtocolLibraryScreen.tsx` - Works with saved data

**Test Result:** ✅ All protocol content fields now save and load correctly
