import { useState, useCallback } from 'react';
import type { SchemaBlock, Variable } from '../types';
import { addChildToBlock, removeBlockById, updateBlockById, toggleExpandById, getAllBlocks } from '../utils';
import { variableLibrary } from '../constants';

export function useSchemaState() {
  const [schemaBlocks, setSchemaBlocks] = useState<SchemaBlock[]>([]);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);

  const addBlock = useCallback((variable: Variable, parentId?: string) => {
    const newBlock: SchemaBlock = {
      id: `block-${Date.now()}-${Math.random()}`,
      variable: {
        ...variable,
        // Ensure icon is preserved from variable library
        icon: variable.icon
      },
      dataType: variable.defaultType as any,
      role: 'Structure',
      isPrimary: false,
      isMapped: false,
      unit: variable.defaultUnit,
      children: variable.defaultType === 'Section' ? [] : undefined,
      isExpanded: true,
      parentId,
      versionTag: 'v1.0',
      versionColor: 'blue',
      dependencies: [],
      isCustom: false
    };

    if (parentId) {
      setSchemaBlocks(prev => addChildToBlock(prev, parentId, newBlock));
    } else {
      setSchemaBlocks(prev => [...prev, newBlock]);
    }

    return newBlock.id;
  }, []);

  const removeBlock = useCallback((blockId: string) => {
    setSchemaBlocks(prev => removeBlockById(prev, blockId));
  }, []);

  const updateBlock = useCallback((blockId: string, updates: Partial<SchemaBlock>) => {
    setSchemaBlocks(prev => updateBlockById(prev, blockId, updates));
  }, []);

  const toggleExpanded = useCallback((blockId: string) => {
    setSchemaBlocks(prev => toggleExpandById(prev, blockId));
  }, []);

  const reorderBlocks = useCallback((draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => {
    setSchemaBlocks(prev => {
      // Find dragged block
      const allBlocks = getAllBlocks(prev);
      const draggedBlock = allBlocks.find(b => b.id === draggedId);
      if (!draggedBlock) return prev;

      // Remove from original position
      let newBlocks = removeBlockById(prev, draggedId);

      // Add to new position
      if (position === 'inside') {
        newBlocks = addChildToBlock(newBlocks, targetId, draggedBlock);
      } else {
        // Find target and add before/after
        const targetBlock = getAllBlocks(newBlocks).find(b => b.id === targetId);
        if (!targetBlock) return prev;

        if (targetBlock.parentId) {
          // Target has parent, add as sibling
          const parent = getAllBlocks(newBlocks).find(b => b.id === targetBlock.parentId);
          if (parent?.children) {
            const targetIndex = parent.children.findIndex(c => c.id === targetId);
            const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
            parent.children.splice(insertIndex, 0, { ...draggedBlock, parentId: targetBlock.parentId });
          }
        } else {
          // Target is root level
          const targetIndex = newBlocks.findIndex(b => b.id === targetId);
          const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
          newBlocks.splice(insertIndex, 0, { ...draggedBlock, parentId: undefined });
        }
      }

      return [...newBlocks];
    });
  }, []);

  const clearSchema = useCallback(() => {
    setSchemaBlocks([]);
  }, []);

  const loadSchema = useCallback((blocks: SchemaBlock[]) => {
    // Rehydrate icons from variable library
    const rehydrateIcons = (blocks: SchemaBlock[]): SchemaBlock[] => {
      return blocks.map(block => {
        const libraryVariable = variableLibrary.find(v => v.id === block.variable.id);
        return {
          ...block,
          variable: {
            ...block.variable,
            icon: libraryVariable?.icon || block.variable.icon
          },
          children: block.children ? rehydrateIcons(block.children) : undefined
        };
      });
    };

    setSchemaBlocks(rehydrateIcons(blocks));
  }, []);

  const addBlockDirectly = useCallback((block: SchemaBlock) => {
    setSchemaBlocks(prev => [...prev, block]);
  }, []);

  return {
    schemaBlocks,
    setSchemaBlocks,
    hoveredBlockId,
    setHoveredBlockId,
    addBlock,
    addBlockDirectly,
    removeBlock,
    updateBlock,
    toggleExpanded,
    reorderBlocks,
    clearSchema,
    loadSchema
  };
}