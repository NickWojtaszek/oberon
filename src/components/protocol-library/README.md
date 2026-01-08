# Protocol Library - Modular Architecture

This directory contains the refactored Protocol Library system with clean separation of concerns.

## 📁 Directory Structure

```
protocol-library/
├── hooks/
│   └── useProtocolLibrary.ts          # State management & business logic
├── components/
│   ├── ProtocolCard.tsx               # Individual protocol card UI
│   └── PublishModal.tsx               # Publish version modal UI
└── index.ts                           # Clean exports
```

## 🎯 Component Responsibilities

### `useProtocolLibrary.ts` Hook (~250 lines)
**Purpose:** Centralized state management and business logic

**Responsibilities:**
- Load/save protocols from localStorage
- Filter and sort protocols
- Handle publish version workflow
- Handle edit published version workflow
- Handle archive protocol
- Handle delete protocol
- Manage modal state (publish modal)

**Returns:**
- All state variables (searchQuery, statusFilter, sortBy, etc.)
- Filtered and sorted protocols
- All action handlers

### `ProtocolCard.tsx` Component (~260 lines)
**Purpose:** Render individual protocol card with all versions

**Responsibilities:**
- Display protocol header (title, number, metadata)
- Display latest draft version (if exists)
- Display current published version (if exists)
- Display older versions (collapsible)
- Handle card-level actions (archive, delete)
- Handle version-level actions (edit, publish, view)

**Props:**
- `protocol` - Protocol data
- `onNavigateToBuilder` - Navigate to builder callback
- `onPublishVersion` - Publish version callback
- `onEditPublishedVersion` - Create new version callback
- `onArchiveProtocol` - Archive protocol callback
- `onDeleteProtocol` - Delete protocol callback

### `PublishModal.tsx` Component (~75 lines)
**Purpose:** Modal for publishing a draft version

**Responsibilities:**
- Display changelog input field
- Display publish warning/info
- Handle confirm/cancel actions

**Props:**
- `isOpen` - Modal visibility state
- `changeLog` - Changelog text
- `onChangeLogUpdate` - Update changelog callback
- `onConfirm` - Confirm publish callback
- `onCancel` - Cancel publish callback

### `ProtocolLibraryScreen.tsx` Main Component (~145 lines)
**Purpose:** Orchestrate the library screen layout and user interactions

**Responsibilities:**
- Render page header with title and "Create" button
- Render search and filter controls
- Render empty state or protocol list
- Map protocols to ProtocolCard components
- Show/hide PublishModal

**Key Benefit:** Clean, readable, focused on layout and user flow

## 🔄 Data Flow

```
User Action
    ↓
ProtocolLibraryScreen (orchestrator)
    ↓
useProtocolLibrary hook (business logic)
    ↓
localStorage (persistence)
    ↓
State update
    ↓
ProtocolCard / PublishModal (UI update)
```

## ✅ Benefits of This Architecture

1. **Single Responsibility** - Each file has one clear purpose
2. **Maintainability** - Easier to find and fix bugs
3. **Testability** - Each piece can be tested independently
4. **Reusability** - Components can be used in other contexts
5. **Reduced Corruption Risk** - Smaller files = safer edits
6. **Scalability** - Easy to add new features without bloating files
7. **Code Quality** - Follows React and enterprise best practices

## 🔧 Usage Example

```tsx
import { ProtocolLibraryScreen } from './components/ProtocolLibraryScreen';

function App() {
  const handleNavigateToBuilder = (protocolId?: string, versionId?: string) => {
    // Navigate to builder...
  };

  return <ProtocolLibraryScreen onNavigateToBuilder={handleNavigateToBuilder} />;
}
```

## 📊 Size Comparison

**Before Refactoring:**
- ProtocolLibraryScreen.tsx: ~590 lines (monolithic)

**After Refactoring:**
- useProtocolLibrary.ts: ~250 lines
- ProtocolCard.tsx: ~260 lines  
- PublishModal.tsx: ~75 lines
- ProtocolLibraryScreen.tsx: ~145 lines
- index.ts: 3 lines

**Total:** Same functionality, now modular!

## 🚀 Future Enhancements

This architecture makes it easy to add:
- Protocol duplication feature (add to useProtocolLibrary hook)
- Export/import protocols (add to useProtocolLibrary hook)
- Protocol templates (add new component)
- Advanced filtering (extend useProtocolLibrary hook)
- Bulk operations (extend useProtocolLibrary hook)
