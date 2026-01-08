# Protocol Workbench - Quick Reference Guide

## Import Cheat Sheet

### Importing the Component
```typescript
import { ProtocolWorkbench } from './components/protocol-workbench';
```

### Importing Types
```typescript
// Import individual types
import type { SchemaBlock, Variable, AISuggestion, AuditLogEntry } from './components/protocol-workbench';

// Import multiple types
import type {
  DataType,
  RoleTag,
  VariableCategory,
  WorkbenchState,
  SchemaBlock,
  Variable
} from './components/protocol-workbench';
```

### Importing Constants
```typescript
// Import specific constants
import { variableLibrary, versionColors } from './components/protocol-workbench';

// Import with alias
import { variableLibrary as clinicalVars } from './components/protocol-workbench';
```

### Importing Utilities
```typescript
// Import specific functions
import { generateNestedJSON, detectSemanticMismatches } from './components/protocol-workbench';

// Import all utilities
import * as ProtocolUtils from './components/protocol-workbench';
// Usage: ProtocolUtils.generateNestedJSON(blocks)
```

## Common Use Cases

### 1. Validating Schema Blocks
```typescript
import { detectSemanticMismatches } from './components/protocol-workbench';
import type { SchemaBlock } from './components/protocol-workbench';

function validateProtocolSchema(blocks: SchemaBlock[]) {
  const mismatches = detectSemanticMismatches(blocks);
  
  if (mismatches.length > 0) {
    console.warn('Semantic issues detected:', mismatches);
    return false;
  }
  
  return true;
}
```

### 2. Generating Export Data
```typescript
import { generateNestedJSON } from './components/protocol-workbench';
import type { SchemaBlock } from './components/protocol-workbench';

function exportProtocolJSON(blocks: SchemaBlock[]) {
  const jsonData = generateNestedJSON(blocks);
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  return URL.createObjectURL(blob);
}
```

### 3. Working with Variable Library
```typescript
import { variableLibrary } from './components/protocol-workbench';
import type { Variable, VariableCategory } from './components/protocol-workbench';

function getVariablesByCategory(category: VariableCategory): Variable[] {
  return variableLibrary.filter(v => v.category === category);
}

function findVariableById(id: string): Variable | undefined {
  return variableLibrary.find(v => v.id === id);
}
```

### 4. Manipulating Schema Blocks
```typescript
import {
  addChildToBlock,
  removeBlockById,
  updateBlockById,
  getAllBlocks
} from './components/protocol-workbench';
import type { SchemaBlock } from './components/protocol-workbench';

// Add a child block
const updatedBlocks = addChildToBlock(blocks, parentId, newBlock);

// Remove a block
const withoutBlock = removeBlockById(blocks, blockIdToRemove);

// Update a block
const modifiedBlocks = updateBlockById(blocks, blockId, updatedBlock);

// Flatten hierarchy
const allBlocks = getAllBlocks(blocks);
```

### 5. Type-Safe Analysis Method Selection
```typescript
import { analysisMethodsByType } from './components/protocol-workbench';
import type { DataType } from './components/protocol-workbench';

function getRecommendedAnalysis(dataType: DataType): string[] {
  return analysisMethodsByType[dataType] || [];
}

// Example
const continuousMethods = getRecommendedAnalysis('Continuous');
// Returns: ['Mean Comparison (t-test)', 'ANOVA', 'Linear Regression']
```

### 6. Working with Clinical Templates
```typescript
import { enumerationTemplates } from './components/protocol-workbench';

function getVascularDeviceOptions() {
  return enumerationTemplates.vascularDevices;
  // Returns: ['BEVAR', 'TEVAR', 'EVAR', 'IBD4', 'Open Repair']
}

function getToxicityGrades() {
  return enumerationTemplates.toxicityGrades;
  // Returns: ['Grade 0', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5']
}
```

### 7. Version Tag Styling
```typescript
import { versionColors } from './components/protocol-workbench';
import type { SchemaBlock } from './components/protocol-workbench';

function getVersionStyle(block: SchemaBlock): string {
  const color = block.versionColor || 'blue';
  return versionColors[color];
}

// Usage in className
<span className={`px-2 py-1 rounded ${getVersionStyle(block)}`}>
  {block.versionTag}
</span>
```

## Type Guards

### Check if Block is Section
```typescript
import type { SchemaBlock } from './components/protocol-workbench';

function isSection(block: SchemaBlock): boolean {
  return block.dataType === 'Section' && !!block.children;
}
```

### Check if Variable is PII
```typescript
import type { Variable } from './components/protocol-workbench';

function isPII(variable: Variable): boolean {
  return variable.isPII === true;
}
```

### Check if Block is Endpoint
```typescript
import type { SchemaBlock } from './components/protocol-workbench';

function isEndpoint(block: SchemaBlock): boolean {
  return block.role === 'Outcome' || !!block.endpointTier;
}
```

## Common Patterns

### Pattern 1: Filter PII Variables
```typescript
import { variableLibrary } from './components/protocol-workbench';

const piiVariables = variableLibrary.filter(v => v.isPII);
const nonPiiVariables = variableLibrary.filter(v => !v.isPII);
```

### Pattern 2: Find Primary Endpoint
```typescript
import { getAllBlocks } from './components/protocol-workbench';
import type { SchemaBlock } from './components/protocol-workbench';

function findPrimaryEndpoint(blocks: SchemaBlock[]): SchemaBlock | undefined {
  return getAllBlocks(blocks).find(b => b.endpointTier === 'primary');
}
```

### Pattern 3: Count Blocks by Type
```typescript
import { getAllBlocks } from './components/protocol-workbench';
import type { SchemaBlock, DataType } from './components/protocol-workbench';

function countBlocksByType(blocks: SchemaBlock[]): Record<DataType, number> {
  const allBlocks = getAllBlocks(blocks);
  const counts: Partial<Record<DataType, number>> = {};
  
  allBlocks.forEach(block => {
    counts[block.dataType] = (counts[block.dataType] || 0) + 1;
  });
  
  return counts as Record<DataType, number>;
}
```

### Pattern 4: Validate Block Dependencies
```typescript
import { getAllBlocks } from './components/protocol-workbench';
import type { SchemaBlock } from './components/protocol-workbench';

function validateDependencies(blocks: SchemaBlock[]): boolean {
  const allBlocks = getAllBlocks(blocks);
  const blockIds = new Set(allBlocks.map(b => b.id));
  
  for (const block of allBlocks) {
    if (block.dependencies) {
      for (const depId of block.dependencies) {
        if (!blockIds.has(depId)) {
          console.error(`Invalid dependency: ${depId} not found`);
          return false;
        }
      }
    }
  }
  
  return true;
}
```

## Debugging Tips

### 1. Inspect Block Structure
```typescript
import { getAllBlocks } from './components/protocol-workbench';

console.table(getAllBlocks(schemaBlocks).map(b => ({
  id: b.id,
  name: b.customName || b.variable.name,
  type: b.dataType,
  role: b.role,
  hasChildren: !!b.children?.length
})));
```

### 2. Validate JSON Output
```typescript
import { generateNestedJSON } from './components/protocol-workbench';

const json = generateNestedJSON(blocks);
console.log('Schema JSON:', JSON.stringify(json, null, 2));
```

### 3. Check Semantic Issues
```typescript
import { detectSemanticMismatches } from './components/protocol-workbench';

const issues = detectSemanticMismatches(blocks);
if (issues.length > 0) {
  console.group('Semantic Validation Issues');
  issues.forEach(issue => {
    console.warn(`Block ${issue.blockId}: ${issue.reason}`);
  });
  console.groupEnd();
}
```

## Performance Tips

### Tip 1: Memoize Expensive Calculations
```typescript
import { useMemo } from 'react';
import { getAllBlocks, detectSemanticMismatches } from './components/protocol-workbench';

const allBlocks = useMemo(() => getAllBlocks(schemaBlocks), [schemaBlocks]);
const mismatches = useMemo(() => detectSemanticMismatches(schemaBlocks), [schemaBlocks]);
```

### Tip 2: Batch Updates
```typescript
import { updateBlockById } from './components/protocol-workbench';

// Instead of multiple setState calls
const finalBlocks = updates.reduce((blocks, update) => {
  return updateBlockById(blocks, update.id, update.block);
}, initialBlocks);

setSchemaBlocks(finalBlocks);
```

## Need Help?

- 📖 See `/components/protocol-workbench/README.md` for architecture details
- ✅ See `/components/protocol-workbench/VERIFICATION.md` for testing info
- 📝 See `/REFACTORING_SUMMARY.md` for complete changelog
