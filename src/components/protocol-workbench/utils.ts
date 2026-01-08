// Utility functions for Protocol Workbench

import type { SchemaBlock } from './types';

/**
 * Generate nested JSON structure from schema blocks
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