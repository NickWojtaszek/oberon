# 🛡️ CODE CORRUPTION PREVENTION ARCHITECTURE

## Overview
This document describes the defensive architecture implemented to prevent code corruption, maintain consistency, and ensure data integrity across the Clinical Intelligence Engine.

---

## 🎯 Single Sources of Truth

### 1. Storage Keys (`/utils/storageKeys.ts`)
**Purpose:** Centralized definition of all localStorage keys

✅ **DO:**
```typescript
import { STORAGE_KEYS } from '@/utils/storageKeys';
const data = localStorage.getItem(STORAGE_KEYS.PROTOCOLS);
```

❌ **DON'T:**
```typescript
// NEVER use string literals directly
const data = localStorage.getItem('protocols');
```

**Benefits:**
- Prevents typos and key mismatches
- Type-safe key access
- Easy refactoring (change in one place)
- Auto-complete in IDE

---

### 2. Shared Types (`/types/shared.ts`)
**Purpose:** Centralized type definitions for all shared data structures

✅ **DO:**
```typescript
import type { SavedProtocol, ProtocolVersion } from '@/types/shared';
```

❌ **DON'T:**
```typescript
// NEVER duplicate type definitions
interface SavedProtocol { ... } // in component file
```

**Benefits:**
- Ensures type consistency across modules
- Prevents drift between components
- Single place to update types
- Better TypeScript inference

---

### 3. Storage Service (`/utils/storageService.ts`)
**Purpose:** Centralized storage operations with error handling

✅ **DO:**
```typescript
import { storage } from '@/utils/storageService';
const protocols = storage.protocols.getAll();
```

❌ **DON'T:**
```typescript
// NEVER access localStorage directly in components
const protocols = JSON.parse(localStorage.getItem('protocols'));
```

**Benefits:**
- Consistent error handling
- Type safety
- Easy to add logging/monitoring
- Easier to mock for testing
- Can swap storage backend (IndexedDB, API, etc.)

---

## 🏗️ Module Architecture

### Modular Structure Benefits
1. **Isolation:** Changes in one module don't affect others
2. **Testability:** Each module can be tested independently
3. **Reusability:** Modules can be reused across features
4. **Maintainability:** Easier to locate and fix issues

### Current Modular Components

#### Database Module (`/components/database/`)
```
database/
├── index.ts                 # Public API
├── hooks/
│   └── useDatabase.ts       # State management
├── components/
│   ├── SchemaView.tsx       # View components
│   ├── DataEntryView.tsx
│   ├── DataBrowserView.tsx
│   └── QueryView.tsx
└── utils/
    └── schemaGenerator.ts   # Business logic
```

#### Protocol Workbench (`/components/protocol-workbench/`)
```
protocol-workbench/
├── index.tsx                # Public API
├── hooks/                   # State management
├── components/              # UI components
├── utils.ts                 # Utilities
├── types.ts                 # Local types
└── constants.ts             # Local constants
```

---

## 🔒 Protection Mechanisms

### 1. TypeScript Strict Mode
All modules use strict TypeScript to catch errors at compile time.

### 2. Immutable Patterns
```typescript
// Good: Immutable update
setSavedProtocols(prev => [...prev, newProtocol]);

// Bad: Mutation
savedProtocols.push(newProtocol);
```

### 3. Validation Guards
```typescript
// Always validate data from localStorage
const protocols = storage.protocols.getAll();
if (!Array.isArray(protocols)) {
  console.error('Invalid protocols data');
  return [];
}
```

### 4. Error Boundaries
All storage operations include try-catch blocks with proper error logging.

---

## 📋 Developer Guidelines

### When Adding New Features

1. **Use existing storage keys** from `storageKeys.ts`
2. **Use existing types** from `types/shared.ts`
3. **Use storage service** from `storageService.ts`
4. **Follow modular structure** with hooks/components/utils
5. **Add to existing modules** rather than creating new files when possible

### Migration Path for Existing Code

When refactoring existing code to use the new architecture:

1. **Phase 1:** Import shared types
   ```typescript
   import type { SavedProtocol } from '@/types/shared';
   ```

2. **Phase 2:** Use storage keys
   ```typescript
   import { STORAGE_KEYS } from '@/utils/storageKeys';
   ```

3. **Phase 3:** Migrate to storage service
   ```typescript
   import { storage } from '@/utils/storageService';
   ```

**Note:** Existing code continues to work during migration. This is additive, not breaking.

---

## 🧪 Testing Checklist

Before committing changes:

- [ ] No direct localStorage.getItem/setItem calls in components
- [ ] No duplicate type definitions
- [ ] No hardcoded storage key strings
- [ ] Proper error handling around storage operations
- [ ] Types imported from `/types/shared.ts`
- [ ] Storage accessed through `storageService`

---

## 🚨 Red Flags

Watch out for these anti-patterns:

❌ String literal storage keys
❌ Duplicate type definitions
❌ Direct localStorage access in components
❌ Missing error handling
❌ Mutations of state objects
❌ Circular dependencies between modules

---

## 🔄 Future Improvements

### Potential Enhancements
1. **Runtime validation** using Zod or Yup schemas
2. **Storage versioning** and migration system
3. **Automatic backups** before writes
4. **Storage quota monitoring**
5. **Compression** for large datasets
6. **Encryption** for sensitive data

### Migration to Backend
When ready to add a backend, the storage service pattern makes it easy:

```typescript
// Current: localStorage
const protocols = storage.protocols.getAll();

// Future: API
const protocols = await api.protocols.getAll();
```

Only need to change the implementation, not the API!

---

## 📊 Storage Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  (Components, Hooks, UI)                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Storage Service Layer                      │
│  (/utils/storageService.ts)                                 │
│  - Type-safe operations                                      │
│  - Error handling                                            │
│  - Validation                                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Storage Keys Layer                         │
│  (/utils/storageKeys.ts)                                    │
│  - Single source of truth for keys                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      Browser localStorage                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎓 Key Takeaways

1. **Never use string literals** for storage keys
2. **Never duplicate types** - import from `/types/shared.ts`
3. **Always use storage service** for data access
4. **Keep modules isolated** and focused
5. **Follow the established patterns** in existing code
6. **When in doubt, check this document**

---

**Last Updated:** January 2026  
**Version:** 1.0.0  
**Maintained by:** Clinical Intelligence Engine Team
