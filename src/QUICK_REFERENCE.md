# 🚀 Quick Reference: Using the Protected Architecture

## For New Features

### 1. Need to store data?
```typescript
// ✅ Correct way
import { storage } from '@/utils/storageService';

// Get data
const protocols = storage.protocols.getAll();
const clinicalData = storage.clinicalData.getAll();

// Save data
storage.protocols.save(updatedProtocols);
storage.clinicalData.save(updatedRecords);
```

### 2. Need to define types?
```typescript
// ✅ Correct way - Use existing types
import type { SavedProtocol, ProtocolVersion, ClinicalDataRecord } from '@/types/shared';

// ❌ Wrong way - Don't duplicate
interface SavedProtocol { ... } // NO!
```

### 3. Need a storage key?
```typescript
// ✅ Correct way
import { STORAGE_KEYS } from '@/utils/storageKeys';
localStorage.getItem(STORAGE_KEYS.PROTOCOLS);

// ❌ Wrong way
localStorage.getItem('protocols'); // NO!
```

---

## Common Tasks

### Loading Protocols
```typescript
import { storage } from '@/utils/storageService';

const protocols = storage.protocols.getAll();
const myProtocol = storage.protocols.getById('PROTO-123');
```

### Loading Clinical Data
```typescript
import { storage } from '@/utils/storageService';

const allData = storage.clinicalData.getAll();
const protocolData = storage.clinicalData.getByProtocol('PROTO-001', 'v1.0');
```

### Saving Data
```typescript
import { storage } from '@/utils/storageService';
import type { SavedProtocol } from '@/types/shared';

const protocols: SavedProtocol[] = [...];
const success = storage.protocols.save(protocols);

if (!success) {
  console.error('Failed to save protocols');
}
```

### Export/Import All Data
```typescript
import { storage } from '@/utils/storageService';

// Export
const jsonData = storage.utils.export();
// Save to file or send to user

// Import
const success = storage.utils.import(jsonData);
```

### Check Storage Usage
```typescript
import { storage } from '@/utils/storageService';

const info = storage.utils.getInfo();
console.log('Storage usage:', info);
// {
//   PROTOCOLS: { size: 12345, count: 5 },
//   CLINICAL_DATA: { size: 67890, count: 150 }
// }
```

---

## Creating a New Hook

```typescript
import { useState, useEffect } from 'react';
import { storage } from '@/utils/storageService';
import type { SavedProtocol } from '@/types/shared';

export function useProtocols() {
  const [protocols, setProtocols] = useState<SavedProtocol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedProtocols = storage.protocols.getAll();
    setProtocols(loadedProtocols);
    setLoading(false);
  }, []);

  const saveProtocol = (protocol: SavedProtocol) => {
    const updated = [...protocols, protocol];
    storage.protocols.save(updated);
    setProtocols(updated);
  };

  return {
    protocols,
    loading,
    saveProtocol
  };
}
```

---

## Module Structure Template

When creating a new module:

```
/components/my-module/
├── index.ts              # Public exports
├── README.md             # Module documentation
├── hooks/
│   └── useMyModule.ts    # State management
├── components/
│   ├── MyView.tsx        # UI components
│   └── MyForm.tsx
└── utils/
    └── myUtils.ts        # Business logic
```

**index.ts:**
```typescript
export { useMyModule } from './hooks/useMyModule';
export { MyView } from './components/MyView';
export * from './types'; // if module has local types
```

**Usage:**
```typescript
import { useMyModule, MyView } from '@/components/my-module';
```

---

## Checklist Before Commit

- [ ] No `localStorage.getItem('string-literal')`
- [ ] All types imported from `/types/shared.ts`
- [ ] Storage accessed through `storageService`
- [ ] Error handling around storage operations
- [ ] No duplicate type definitions
- [ ] Module exports through index.ts
- [ ] README updated if adding new module

---

## Emergency: Clear All Data

```typescript
import { storage } from '@/utils/storageService';

// ⚠️ WARNING: This deletes everything!
storage.utils.clearAll();
```

---

## Need Help?

1. Check `/ARCHITECTURE_PROTECTION.md` for detailed guide
2. Look at existing modules for patterns:
   - `/components/database/` - Clean modular example
   - `/components/protocol-workbench/` - Complex module example
3. Check type definitions in `/types/shared.ts`
4. Check storage keys in `/utils/storageKeys.ts`
