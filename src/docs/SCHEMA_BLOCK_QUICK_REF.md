# Schema Block Type System - Quick Reference

## Which Type Should I Use?

### ✅ Use Full SchemaBlock (from `/components/protocol-workbench/types.ts`)

**When:**
- Building UI components that display schema data
- Implementing database generation logic
- Working with the Protocol Workbench
- Processing data entry forms
- Creating new features that work with protocols

**Import:**
```typescript
import type { SchemaBlock } from '@/components/protocol-workbench/types';
```

**Properties:**
```typescript
{
  id: string;
  variable: Variable;
  dataType: DataType;
  role: RoleTag;
  unit?: string;
  options?: string[];
  endpointTier?: 'primary' | 'secondary' | 'exploratory' | null;
  // ... full set of properties
}
```

---

### ⚠️ Use Simplified SchemaBlock (from `/types/shared.ts`)

**When:**
- Only when auto-generating protocols (internal use only)
- Immediately convert to Full format after creation

**Import:**
```typescript
import type { SchemaBlock } from '@/types/shared';
```

**⚠️ Warning:** This format is being phased out. Always convert to Full format before saving.

---

## Common Patterns

### Pattern 1: Check and Convert
```typescript
import { isSimplifiedSchemaBlock, convertSchemaBlocks } from '@/utils/schemaBlockAdapter';

function processProtocol(protocol: ProtocolVersion) {
  let blocks = protocol.schemaBlocks;
  
  // Always check format at system boundaries
  if (blocks.length > 0 && isSimplifiedSchemaBlock(blocks[0])) {
    console.warn('Converting simplified blocks');
    blocks = convertSchemaBlocks(blocks);
  }
  
  // Now safe to use as full blocks
  return generateDatabaseFields(blocks);
}
```

### Pattern 2: Type-Safe Access
```typescript
import type { SchemaBlock } from '@/components/protocol-workbench/types';

function displayFieldName(block: SchemaBlock): string {
  // Always safe - TypeScript enforces structure
  return block.variable.name;
}
```

### Pattern 3: Creating New Blocks
```typescript
import type { SchemaBlock, Variable } from '@/components/protocol-workbench/types';
import { Users } from 'lucide-react';

// Always create full blocks
const newBlock: SchemaBlock = {
  id: `block-${Date.now()}`,
  variable: {
    id: `var-${Date.now()}`,
    name: 'Age',
    category: 'Demographics',
    icon: Users,
    defaultType: 'Continuous',
  },
  dataType: 'Continuous',
  role: 'Predictor',
  unit: 'years',
  minValue: 0,
  maxValue: 120,
};
```

---

## Debugging

### Console Logging

The adapter provides debug utilities:

```typescript
import { debugSchemaBlockFormat } from '@/utils/schemaBlockAdapter';

// Check format of any block array
debugSchemaBlockFormat(blocks, 'My Protocol Blocks');

// Output:
// 🔍 My Protocol Blocks Format Check
// Total blocks: 15
// Has simplified: false
// Has full: true
// Has mixed: false
// Invalid blocks: 0
// Is valid: true
```

### Look for These Log Messages

**✅ Success:**
```
✅ Schema blocks are already in full format
✅ Converted 15 simplified blocks → 15 full blocks
```

**⚠️ Warning (auto-fixed):**
```
⚠️ WARNING: Simplified schema blocks detected in protocol version!
⚠️ Auto-converting to full format for database compatibility...
```

**❌ Error (needs investigation):**
```
❌ Unknown schema block format, skipping: [block details]
```

---

## Migration Checklist

If you're updating code that uses SchemaBlocks:

- [ ] Import from `/components/protocol-workbench/types.ts` (not `/types/shared.ts`)
- [ ] Add defensive checks if loading from external source
- [ ] Use `isSimplifiedSchemaBlock()` to detect format
- [ ] Call `convertSchemaBlocks()` if simplified blocks found
- [ ] Add debug logging for troubleshooting
- [ ] Test with auto-generated protocols
- [ ] Test with manually created protocols

---

## Common Errors

### Error: "Cannot read property 'name' of undefined"
**Cause:** Trying to access `block.variable.name` on simplified block

**Fix:**
```typescript
// Before (breaks with simplified blocks)
const name = block.variable.name;

// After (handles both formats)
if (isSimplifiedSchemaBlock(block)) {
  const fullBlock = convertSimplifiedToFullSchemaBlock(block);
  const name = fullBlock.variable.name;
} else {
  const name = block.variable.name;
}
```

### Error: "Cannot read property 'category' of undefined"
**Cause:** Same issue - simplified block doesn't have `variable` property

**Fix:** Use the adapter pattern shown above

### Warning: "Simplified blocks detected"
**This is OK!** The system auto-converts them. But you should investigate why they weren't converted earlier.

---

## Best Practices

### ✅ DO

1. **Always use Full SchemaBlock type in new code**
2. **Add type guards at system boundaries** (loading from localStorage, API, etc.)
3. **Use the adapter functions** - don't write your own conversion
4. **Add debug logging** when working with blocks
5. **Test with auto-generated protocols** to catch format issues

### ❌ DON'T

1. **Don't create Simplified SchemaBlocks** (unless auto-generation, and convert immediately)
2. **Don't assume block format** - always check
3. **Don't write inline conversions** - use the adapter
4. **Don't skip type guards** when loading external data
5. **Don't ignore console warnings** - they indicate data flow issues

---

## Quick Reference Card

```typescript
// Import the adapter
import { 
  isSimplifiedSchemaBlock, 
  convertSchemaBlocks,
  debugSchemaBlockFormat 
} from '@/utils/schemaBlockAdapter';

// Import the correct type
import type { SchemaBlock } from '@/components/protocol-workbench/types';

// Check format
if (isSimplifiedSchemaBlock(block)) {
  // Convert
  const fullBlocks = convertSchemaBlocks([block]);
}

// Debug
debugSchemaBlockFormat(blocks, 'My Component');

// Safe access (TypeScript enforces)
const name = block.variable.name;
const category = block.variable.category;
const dataType = block.dataType;
```

---

## Questions?

See `/docs/SCHEMA_BLOCK_FIX.md` for complete technical documentation.
