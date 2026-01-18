// Utility functions for Protocol Workbench

import type { SchemaBlock } from './types';

/**
 * Generate a unique ID for blocks (replaces uuid in regenerateBlockIds)
 */
const generateUniqueId = (): string => {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Export schema blocks to downloadable JSON with full metadata
 */
export const exportSchemaJSON = (blocks: SchemaBlock[], protocolName: string = 'protocol'): string => {
  const exportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    protocolName,
    schemaBlocks: blocks,
    metadata: {
      blockCount: blocks.length,
      totalFields: getAllBlocks(blocks).length,
    }
  };
  return JSON.stringify(exportData, null, 2);
};

/**
 * Validate imported schema JSON and reconstruct blocks
 */
export const validateAndImportSchema = (jsonData: any): { valid: boolean; blocks?: SchemaBlock[]; errors: string[] } => {
  const errors: string[] = [];

  // Basic structure validation
  if (!jsonData || typeof jsonData !== 'object') {
    errors.push('Invalid JSON: Expected an object');
    return { valid: false, errors };
  }

  // Check for schema blocks
  if (!jsonData.schemaBlocks && !Array.isArray(jsonData)) {
    errors.push('Invalid format: Missing schemaBlocks array or direct block array');
    return { valid: false, errors };
  }

  const blocks = jsonData.schemaBlocks || jsonData;

  if (!Array.isArray(blocks)) {
    errors.push('schemaBlocks must be an array');
    return { valid: false, errors };
  }

  if (blocks.length === 0) {
    errors.push('Schema contains no blocks');
    return { valid: false, errors };
  }

  // Validate each block structure
  const validatedBlocks: SchemaBlock[] = [];
  blocks.forEach((block, index) => {
    try {
      if (!block.id || !block.variable || !block.dataType || !block.role) {
        errors.push(`Block ${index}: Missing required fields (id, variable, dataType, or role)`);
        return;
      }

      if (typeof block.variable !== 'object' || !block.variable.id || !block.variable.name) {
        errors.push(`Block ${index}: Invalid variable structure`);
        return;
      }

      // Regenerate IDs to avoid conflicts
      const regeneratedBlock = regenerateBlockIds(block);
      validatedBlocks.push(regeneratedBlock);
    } catch (e) {
      errors.push(`Block ${index}: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  });

  if (errors.length > 0 && validatedBlocks.length === 0) {
    return { valid: false, errors };
  }

  return { 
    valid: validatedBlocks.length > 0, 
    blocks: validatedBlocks, 
    errors: errors.filter(e => !e.includes('Missing required fields')) // Reduce noise if we got some valid blocks
  };
};

/**
 * Infer appropriate category from field name, dataType, and role
 * This ensures imported schemas get proper categories for database table generation
 */
const inferCategoryFromBlock = (block: SchemaBlock): SchemaBlock['variable']['category'] => {
  const name = (block.customName || block.variable.name).toLowerCase();
  const dataType = block.dataType;
  const role = block.role;
  const existingCategory = block.variable.category;

  // If it's a Section, keep it as Structural
  if (dataType === 'Section') {
    return 'Structural';
  }

  // If the existing category is valid and not 'Structural' or 'Other', keep it
  const validCategories = ['Demographics', 'Treatments', 'Endpoints', 'Clinical', 'Laboratory', 'Vitals', 'Safety', 'Quality of Life', 'Medical History', 'Biomarkers', 'Imaging', 'Medications', 'Adverse Events', 'Procedures', 'Questionnaires'];
  if (validCategories.includes(existingCategory)) {
    return existingCategory;
  }

  // Infer from role
  if (role === 'Outcome' || block.endpointTier) {
    return 'Endpoints';
  }

  // Infer from field name patterns
  if (name.includes('age') || name.includes('sex') || name.includes('gender') || name.includes('race') || name.includes('ethnicity') || name.includes('birth') || name.includes('demographic')) {
    return 'Demographics';
  }
  if (name.includes('treatment') || name.includes('intervention') || name.includes('therapy') || name.includes('drug') || name.includes('dose') || name.includes('medication')) {
    return 'Treatments';
  }
  if (name.includes('lab') || name.includes('blood') || name.includes('serum') || name.includes('urine') || name.includes('hemoglobin') || name.includes('creatinine') || name.includes('glucose')) {
    return 'Laboratory';
  }
  if (name.includes('vital') || name.includes('pressure') || name.includes('heart_rate') || name.includes('pulse') || name.includes('temperature') || name.includes('weight') || name.includes('height') || name.includes('bmi')) {
    return 'Vitals';
  }
  if (name.includes('adverse') || name.includes('safety') || name.includes('toxicity') || name.includes('side_effect')) {
    return 'Safety';
  }
  if (name.includes('outcome') || name.includes('endpoint') || name.includes('efficacy') || name.includes('response') || name.includes('survival') || name.includes('mortality')) {
    return 'Endpoints';
  }
  if (name.includes('score') || name.includes('scale') || name.includes('questionnaire') || name.includes('survey') || name.includes('assessment')) {
    return 'Clinical';
  }
  if (name.includes('diagnosis') || name.includes('disease') || name.includes('condition') || name.includes('symptom') || name.includes('clinical')) {
    return 'Clinical';
  }
  if (name.includes('history') || name.includes('medical_history') || name.includes('past')) {
    return 'Medical History';
  }
  if (name.includes('imaging') || name.includes('scan') || name.includes('mri') || name.includes('ct') || name.includes('xray') || name.includes('ultrasound')) {
    return 'Imaging';
  }
  if (name.includes('procedure') || name.includes('surgery') || name.includes('operation')) {
    return 'Procedures';
  }
  if (name.includes('quality') || name.includes('qol') || name.includes('life')) {
    return 'Quality of Life';
  }

  // Default: use Clinical for data fields (not Structural)
  return 'Clinical';
};

/**
 * Recursively regenerate all IDs and normalize categories to prevent conflicts on import
 */
export const regenerateBlockIds = (block: SchemaBlock): SchemaBlock => {
  // Infer proper category for this block
  const inferredCategory = inferCategoryFromBlock(block);

  const regenerated: SchemaBlock = {
    ...block,
    id: generateUniqueId(),
    variable: {
      ...block.variable,
      category: inferredCategory,
    },
  };

  if (block.children) {
    regenerated.children = block.children.map(child => regenerateBlockIds(child));
  }
  if (block.conditionalDependencies) {
    regenerated.conditionalDependencies = block.conditionalDependencies.map(dep => ({
      ...dep,
      id: generateUniqueId()
    }));
  }
  return regenerated;
};

/**
 * Generate nested JSON structure from schema blocks (for data entry templates)
 */
export const generateNestedJSON = (blocks: SchemaBlock[], level = 0): any => {
  const result: any = {};
  
  blocks.forEach(block => {
    const fieldId = block.isCustom && block.customName ? block.customName.toLowerCase().replace(/\s+/g, '_') : block.variable.id;
    
    if (block.dataType === 'Section' && block.children) {
      result[fieldId] = generateNestedJSON(block.children, level + 1);
    } else {
      if (block.dataType === 'Boolean') result[fieldId] = true;
      else if (block.dataType === 'Continuous') result[fieldId] = 42;
      else if (block.dataType === 'Multi-Select') result[fieldId] = ['option1', 'option2'];
      else if (block.dataType === 'Grid') result[fieldId] = { row1: 1, row2: 2 };
      else if (block.dataType === 'Ranked-Matrix') result[fieldId] = { item1: 1, item2: 2, item3: 3 };
      else if (block.dataType === 'Categorical-Grid' && block.gridItems && block.gridCategories) {
        const gridData: any = {};
        block.gridItems.forEach((item, idx) => {
          gridData[item] = block.gridCategories![idx % block.gridCategories!.length];
        });
        result[fieldId] = gridData;
      }
      else result[fieldId] = 'value';
    }
  });
  
  return result;
};

/**
 * AI-powered semantic mismatch detection for drag-and-drop validation
 */
export const detectSemanticMismatches = (blocks: SchemaBlock[]): {blockId: string; reason: string}[] => {
  const mismatches: {blockId: string; reason: string}[] = [];
  
  const checkBlock = (block: SchemaBlock, parentBlock?: SchemaBlock) => {
    if (!parentBlock || parentBlock.dataType !== 'Section') return;
    
    const parentName = (parentBlock.customName || parentBlock.variable.name).toLowerCase();
    const childName = (block.customName || block.variable.name).toLowerCase();
    const childCategory = block.variable.category.toLowerCase();
    
    // Define semantic mismatch patterns
    const mismatchPatterns = [
      // Outcome variables in demographic sections
      {
        condition: (block.role === 'Outcome' || block.endpointTier) && 
                   (parentName.includes('demographic') || parentName.includes('baseline')),
        reason: `Outcome endpoint "${block.customName || block.variable.name}" should not be nested under demographic/baseline section`
      },
      // Demographic variables in outcome sections
      {
        condition: childCategory === 'demographics' && 
                   (parentName.includes('outcome') || parentName.includes('endpoint') || parentName.includes('efficacy')),
        reason: `Demographic variable "${block.customName || block.variable.name}" should not be in outcome/endpoint section`
      },
      // Treatment variables in demographic sections
      {
        condition: childCategory === 'treatments' && 
                   (parentName.includes('demographic') || parentName.includes('baseline characteristics')),
        reason: `Treatment variable "${block.customName || block.variable.name}" should not be in demographics section`
      },
      // Laboratory in treatment sections
      {
        condition: childCategory === 'laboratory' && 
                   (parentName.includes('treatment') || parentName.includes('intervention')),
        reason: `Laboratory test "${block.customName || block.variable.name}" should not be nested under treatment section`
      },
      // Survival/mortality in wrong sections
      {
        condition: (childName.includes('survival') || childName.includes('mortality') || childName.includes('death')) && 
                   (parentName.includes('demographic') || parentName.includes('baseline') || parentName.includes('procedure')),
        reason: `Survival/mortality outcome "${block.customName || block.variable.name}" is semantically misplaced in this section`
      },
      // Clinical assessments in demographic sections
      {
        condition: (childName.includes('nihss') || childName.includes('rankin') || childName.includes('mrs') || 
                   childName.includes('score') || childName.includes('scale')) && 
                   (parentName.includes('demographic') || parentName.includes('identification')),
        reason: `Clinical assessment "${block.customName || block.variable.name}" should be in assessments section, not demographics`
      },
      // Procedure types in outcome sections
      {
        condition: (childName.includes('procedure') || childName.includes('surgery') || childName.includes('operation')) && 
                   (parentName.includes('outcome') || parentName.includes('endpoint')),
        reason: `Procedure variable "${block.customName || block.variable.name}" should be in treatments/procedures section, not outcomes`
      },
    ];
    
    // Check each pattern
    for (const pattern of mismatchPatterns) {
      if (pattern.condition) {
        mismatches.push({
          blockId: block.id,
          reason: pattern.reason
        });
        break; // Only report first mismatch per block
      }
    }
    
    // Recursively check children
    if (block.children) {
      block.children.forEach(child => checkBlock(child, block));
    }
  };
  
  // Check all top-level blocks
  blocks.forEach(block => {
    if (block.children) {
      block.children.forEach(child => checkBlock(child, block));
    }
  });
  
  return mismatches;
};

/**
 * Get all blocks recursively including nested children
 */
export const getAllBlocks = (blocks: SchemaBlock[]): SchemaBlock[] => {
  return blocks.reduce((acc, block) => {
    acc.push(block);
    if (block.children) {
      acc.push(...getAllBlocks(block.children));
    }
    return acc;
  }, [] as SchemaBlock[]);
};

/**
 * Add child to a specific parent block recursively
 */
export const addChildToBlock = (blocks: SchemaBlock[], parentId: string, child: SchemaBlock): SchemaBlock[] => {
  return blocks.map(block => {
    if (block.id === parentId && block.children) {
      return { ...block, children: [...block.children, child] };
    }
    if (block.children) {
      return { ...block, children: addChildToBlock(block.children, parentId, child) };
    }
    return block;
  });
};

/**
 * Remove a block by ID recursively
 */
export const removeBlockById = (blocks: SchemaBlock[], blockId: string): SchemaBlock[] => {
  return blocks.filter(b => b.id !== blockId).map(b => ({
    ...b,
    children: b.children ? removeBlockById(b.children, blockId) : undefined,
  }));
};

/**
 * Update a block by ID recursively
 */
export const updateBlockById = (blocks: SchemaBlock[], blockId: string, updates: Partial<SchemaBlock>): SchemaBlock[] => {
  return blocks.map(b => {
    if (b.id === blockId) {
      return { ...b, ...updates };
    }
    if (b.children) {
      return { ...b, children: updateBlockById(b.children, blockId, updates) };
    }
    return b;
  });
};

/**
 * Toggle expand state of a block by ID
 */
export const toggleExpandById = (blocks: SchemaBlock[], blockId: string): SchemaBlock[] => {
  return blocks.map(b => {
    if (b.id === blockId) {
      return { ...b, isExpanded: !b.isExpanded };
    }
    if (b.children) {
      return { ...b, children: toggleExpandById(b.children, blockId) };
    }
    return b;
  });
};

/**
 * Update parentId recursively when moving a block
 * The block itself gets the new parentId, children keep pointing to their direct parent
 */
export const updateParentIdRecursively = (
  block: SchemaBlock,
  newParentId: string | undefined
): SchemaBlock => {
  return {
    ...block,
    parentId: newParentId,
    // Children keep their parentId as the block's id (unchanged relationship)
    children: block.children?.map(child => ({
      ...child,
      parentId: block.id
    }))
  };
};

/**
 * Insert a block at a specific position (before/after) relative to a target block
 * Uses immutable operations (no splice mutations)
 */
export const insertBlockAtPosition = (
  blocks: SchemaBlock[],
  targetId: string,
  blockToInsert: SchemaBlock,
  position: 'before' | 'after'
): SchemaBlock[] => {
  // First check if target is at root level
  const rootIndex = blocks.findIndex(b => b.id === targetId);
  if (rootIndex !== -1) {
    const insertIndex = position === 'before' ? rootIndex : rootIndex + 1;
    return [
      ...blocks.slice(0, insertIndex),
      blockToInsert,
      ...blocks.slice(insertIndex)
    ];
  }

  // Target is nested - find parent and insert there
  return blocks.map(block => {
    if (block.children) {
      const childIndex = block.children.findIndex(c => c.id === targetId);
      if (childIndex !== -1) {
        const insertIndex = position === 'before' ? childIndex : childIndex + 1;
        return {
          ...block,
          children: [
            ...block.children.slice(0, insertIndex),
            { ...blockToInsert, parentId: block.id },
            ...block.children.slice(insertIndex)
          ]
        };
      }
      // Recursively search in children
      return { ...block, children: insertBlockAtPosition(block.children, targetId, blockToInsert, position) };
    }
    return block;
  });
};

/**
 * Get all section blocks (blocks with dataType === 'Section')
 * Useful for parent dropdown in ordering controls
 */
export const getAllSections = (blocks: SchemaBlock[]): SchemaBlock[] => {
  return getAllBlocks(blocks).filter(b => b.dataType === 'Section');
};

/**
 * Get position info for a block (index within siblings, total siblings count)
 * Returns null if block not found
 */
export const getBlockPosition = (
  blocks: SchemaBlock[],
  blockId: string
): { index: number; total: number; parentId?: string } | null => {
  // Check root level
  const rootIndex = blocks.findIndex(b => b.id === blockId);
  if (rootIndex !== -1) {
    return { index: rootIndex, total: blocks.length, parentId: undefined };
  }

  // Search in children recursively
  for (const block of blocks) {
    if (block.children) {
      const childIndex = block.children.findIndex(c => c.id === blockId);
      if (childIndex !== -1) {
        return { index: childIndex, total: block.children.length, parentId: block.id };
      }
      const nestedResult = getBlockPosition(block.children, blockId);
      if (nestedResult) return nestedResult;
    }
  }

  return null;
};