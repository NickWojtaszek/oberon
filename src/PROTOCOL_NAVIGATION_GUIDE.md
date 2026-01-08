# Protocol Navigation & Workflow Guide

## Navigation Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        SIDEBAR                               │
├─────────────────────────────────────────────────────────────┤
│  Dashboard                                                   │
│  Governance (Personas)                                       │
│  AI Personas (Library)                                       │
│  📄 Protocol Builder          ← NEW: Direct workspace access│
│  📁 Protocol Library          ← NEW: Management interface   │
│  Academic Writing                                            │
└─────────────────────────────────────────────────────────────┘
```

## Two-Screen Architecture

### 🏗️ Protocol Builder (Workspace)
**Purpose:** Active editing environment for a single protocol

**Access:**
- Sidebar: "Protocol Builder"
- From Library: "Continue Editing" / "Create New Version" / "Create New Protocol"

**Features:**
- Schema Builder tab (drag-drop variable library)
- Protocol Builder tab (metadata, objectives, endpoints)
- Import/Export Schema (JSON)
- Real-time AI validation
- Configuration HUDs
- Audit trail

**Header Shows:**
```
Protocol Builder
{ProtocolNumber} - v{Version} (status)

[Return to Library] [Import Schema] [Export Schema]
```

---

### 📚 Protocol Library (Management)
**Purpose:** Overview and version control for all protocols

**Access:**
- Sidebar: "Protocol Library"
- From Builder: "Return to Library" button

**Features:**
- Search protocols by title/number
- Filter: All / Draft / Published / Archived
- Sort: Modified / Created / Name
- View all protocol versions
- Publish drafts
- Create new versions
- Archive/Delete protocols

**Header Shows:**
```
Protocol Library
Manage protocol versions, publish iterations, and track changes

[Create New Protocol]
```

---

## Version States & Visual Design

### 🟡 Draft (Amber)
```
┌─────────────────────────────────────────────┐
│ 📝  v1.1                     [Draft]        │
│     Modified 2026-01-03 by Current User     │
│                                              │
│     [Continue Editing]  [Publish]          │
└─────────────────────────────────────────────┘
```
- **Editable:** Yes, unlimited changes
- **Actions:** Continue Editing, Publish
- **Background:** Amber (amber-50)
- **Border:** Amber (amber-200)

### 🟢 Published (Green)
```
┌─────────────────────────────────────────────┐
│ ✓  v1.0                  [Published]        │
│    Published 2026-01-02                     │
│                                              │
│    [View]  [Create New Version]            │
└─────────────────────────────────────────────┘
```
- **Editable:** No (immutable)
- **Actions:** View (read-only), Create New Version
- **Background:** Green (green-50)
- **Border:** Green (green-200)

### ⚪ Archived (Gray)
```
┌─────────────────────────────────────────────┐
│ 📦  v0.9                   [Archived]       │
│     Modified 2025-12-15                     │
│                                              │
│     [View]                                  │
└─────────────────────────────────────────────┘
```
- **Editable:** No
- **Actions:** View only
- **Background:** Gray (slate-50)
- **Border:** Gray (slate-200)

---

## Common Workflows

### 1️⃣ Create New Protocol from Scratch
```
Protocol Library
    ↓ Click "Create New Protocol"
Protocol Builder (empty state)
    ↓ Build schema + metadata
    ↓ Save Draft
Protocol Builder (draft loaded)
    ↓ Click "Return to Library"
Protocol Library (shows new draft)
```

### 2️⃣ Edit Existing Draft
```
Protocol Library
    ↓ Find protocol with draft (amber)
    ↓ Click "Continue Editing"
Protocol Builder (draft loaded)
    ↓ Make changes
    ↓ Auto-save / Manual save
    ↓ Click "Return to Library"
Protocol Library (updated draft shown)
```

### 3️⃣ Publish a Draft Version
```
Protocol Library
    ↓ Find protocol with draft (amber)
    ↓ Click "Publish" button
Publish Modal
    ↓ Enter changelog (optional)
    ↓ Click "Publish Version"
Protocol Library
    ↓ Draft becomes Published (green)
    ↓ latestDraftVersion = null
    ↓ currentVersion = "1.0"
```

### 4️⃣ Create New Version from Published Protocol
```
Protocol Library
    ↓ Find published protocol (no draft)
    ↓ Click "Create New Version"
Protocol Builder
    ↓ New draft v1.1 created (copied from v1.0)
    ↓ Make amendments
    ↓ Save changes
    ↓ Click "Return to Library"
Protocol Library
    ↓ Shows v1.1 draft (amber) + v1.0 published (green)
    ↓ Can publish v1.1 when ready
```

### 5️⃣ View Historical Versions
```
Protocol Library
    ↓ Find protocol card
    ↓ See latest draft (if exists)
    ↓ See current published version
    ↓ Expand "View 3 older version(s)"
Version List
    ↓ Click "View" on any version
Protocol Builder (read-only if published/archived)
```

---

## Version Numbering Logic

### Semantic Versioning
```
v{Major}.{Minor}

Examples:
  v1.0  → Initial published version
  v1.1  → Minor amendment (edit published)
  v1.2  → Another minor change
  v2.0  → Major revision (manual bump)
```

### Auto-Increment Rules
```
Published v1.0
    ↓ Click "Create New Version"
    ↓ Automatically becomes v1.1 draft

Published v1.1
    ↓ Click "Create New Version"
    ↓ Automatically becomes v1.2 draft
```

### Draft → Published Transition
```
Draft v1.1
    ↓ Click "Publish"
    ↓ Status: draft → published
    ↓ ModifiedAt: updated to now
    ↓ ChangeLog: recorded
    ↓ Protocol.currentVersion = "1.1"
    ↓ Protocol.latestDraftVersion = null
```

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│                     localStorage                          │
│   Key: 'clinical-intelligence-protocols'                 │
│                                                            │
│   SavedProtocol[] {                                       │
│     id, protocolNumber, protocolTitle,                   │
│     currentVersion: "1.0",                                │
│     latestDraftVersion: "1.1" | null,                    │
│     versions: [                                           │
│       { id, versionNumber: "1.0", status: "published" }, │
│       { id, versionNumber: "1.1", status: "draft" }      │
│     ]                                                     │
│   }                                                       │
└──────────────────────────────────────────────────────────┘
         ↑                                  ↑
         │ Load on mount                   │ Save on change
         │                                  │
┌────────┴────────┐              ┌─────────┴────────┐
│ Protocol Library │◄────────────►│ Protocol Builder │
│  (Management)    │  Navigation  │   (Workspace)    │
└──────────────────┘              └──────────────────┘
```

---

## UI Component Hierarchy

```
App.tsx
 └─ ProtocolManager
     ├─ ProtocolLibraryScreen (when view = 'library')
     │   ├─ Search/Filter/Sort bar
     │   ├─ Protocol cards (loop)
     │   │   ├─ Protocol header (title, number, dates)
     │   │   ├─ Latest draft version (if exists)
     │   │   ├─ Current published version (if exists)
     │   │   └─ Older versions (collapsible)
     │   └─ Publish Modal (when publishing)
     │
     └─ ProtocolWorkbench (when view = 'builder')
         ├─ Header (with "Return to Library")
         ├─ Tab Switcher (Schema / Protocol)
         ├─ Schema Builder (drag-drop, HUDs, AI)
         ├─ Protocol Builder (metadata, objectives)
         └─ Audit Trail Footer
```

---

## Permission & Role Considerations

### Future Enhancement: Role-Based Actions

**Principal Investigator (PI)**
- ✅ Create protocols
- ✅ Edit drafts
- ✅ Publish versions
- ✅ Archive protocols

**Statistician**
- ✅ View all protocols
- ✅ Edit drafts (with PI approval)
- ⚠️ Cannot publish without review
- ❌ Cannot delete protocols

**Regulatory Reviewer**
- ✅ View all protocols (read-only)
- ✅ Export for compliance
- ❌ Cannot edit or publish

**Clinical Monitor**
- ✅ View published protocols only
- ⚠️ Cannot see drafts
- ❌ Cannot modify

---

## Integration Points

### Existing Systems
1. **Persona System** → `modifiedBy` field uses active persona
2. **Audit Trail** → Version transitions logged
3. **Schema Engine** → All blocks preserved in versions
4. **AI Validation** → Suggestions retained in version snapshots

### Future Integrations
1. **Backend API** → Sync protocols to cloud database
2. **Regulatory Export** → FDA/EMA submission packages
3. **Collaboration** → Multi-user editing with conflict resolution
4. **Approval Workflows** → Multi-signature review process

---

## Keyboard Shortcuts (Future)

```
In Protocol Library:
  Ctrl+N    Create new protocol
  Ctrl+F    Focus search
  Esc       Clear search/filters

In Protocol Builder:
  Ctrl+S    Save draft
  Ctrl+E    Export schema
  Ctrl+L    Return to library
  Ctrl+P    Publish (if draft)
```

---

## Mobile/Tablet Considerations

**Current:** Desktop-first (min 1280px)

**Future Responsive Design:**
- Library: Card-based scrolling list
- Builder: Tabbed navigation for variable library
- Touch-optimized drag-and-drop
- Swipe gestures for version history

---

## Performance Optimization

### Current
- ✅ localStorage for persistence
- ✅ Icon rehydration on load
- ✅ Lazy loading of version details

### Future
- [ ] Virtualized protocol list (100+ protocols)
- [ ] Debounced search/filter
- [ ] Web Worker for JSON schema generation
- [ ] IndexedDB for large protocols
- [ ] Background sync to server

---

## Error Handling

### Protocol Load Failures
```typescript
try {
  const protocol = JSON.parse(localStorage.getItem(...));
} catch (error) {
  console.error('Failed to load protocols:', error);
  // Fall back to empty array
  setSavedProtocols([]);
}
```

### Missing Version
```typescript
const version = protocol.versions.find(v => v.id === versionId);
if (!version) {
  // Show error toast
  // Redirect to library
  return;
}
```

### Icon Rehydration Failure
```typescript
const libraryVariable = variableLibrary.find(v => v.id === block.variable.id);
// Fallback to existing icon if library missing
icon: libraryVariable?.icon || block.variable.icon
```

---

## Testing Scenarios

### Happy Path
1. ✅ Create protocol → Save draft → Publish
2. ✅ Load draft → Edit → Save → Return to library
3. ✅ Publish draft → Create new version → Edit → Save

### Edge Cases
1. ✅ Empty library state
2. ✅ Protocol with no versions (corrupted data)
3. ✅ Missing currentVersion reference
4. ✅ Duplicate version numbers
5. ✅ Search with no results
6. ✅ Delete last protocol

### Stress Tests
1. ⚠️ 100+ protocols in library
2. ⚠️ Protocol with 500+ schema blocks
3. ⚠️ 50+ versions of single protocol
4. ⚠️ Rapid create/delete cycles
5. ⚠️ localStorage quota exceeded

---

## Compliance & Audit Requirements

### FDA 21 CFR Part 11
- ✅ Immutable published versions
- ✅ Audit trail of changes
- ✅ Version numbering
- ✅ User attribution (via persona)
- ⚠️ Electronic signatures (future)
- ⚠️ Secure timestamps (future)

### Good Clinical Practice (GCP)
- ✅ Protocol amendments tracked
- ✅ Version history preserved
- ✅ Investigator identification
- ⚠️ IRB approval workflow (future)

---

## Accessibility (WCAG 2.1)

**Current:**
- ✅ Semantic HTML structure
- ✅ Color contrast ratios (WCAG AA)
- ✅ Focus indicators on buttons

**Future:**
- [ ] Keyboard navigation for protocol cards
- [ ] Screen reader announcements for status changes
- [ ] ARIA labels for action buttons
- [ ] High contrast mode support

---

## Summary

The new two-screen architecture provides:

✅ **Clear Separation** - Building vs Managing  
✅ **Enterprise Versioning** - Draft/Published workflow  
✅ **Immutability** - Published versions locked  
✅ **Traceability** - Full version history  
✅ **Usability** - Search, filter, sort capabilities  
✅ **Scalability** - Ready for hundreds of protocols  
✅ **Compliance** - Regulatory-ready architecture  

**Next Steps:**
1. User testing with clinical teams
2. Backend API integration
3. Multi-user collaboration
4. Advanced search/filtering
5. Protocol templates library
