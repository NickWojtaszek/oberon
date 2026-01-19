import { useState, useCallback } from 'react';
import type { SchemaBlock, Variable } from '../types';
import { addChildToBlock, removeBlockById, updateBlockById, toggleExpandById, getAllBlocks, insertBlockAtPosition, updateParentIdRecursively, getAllSections, getBlockPosition } from '../utils';
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

      // Prevent dropping a section into itself or its descendants
      if (position === 'inside') {
        const targetAndDescendants = getAllBlocks([draggedBlock]);
        if (targetAndDescendants.some(b => b.id === targetId)) {
          return prev; // Cannot drop into self or descendant
        }
      }

      // Remove from original position
      let newBlocks = removeBlockById(prev, draggedId);

      // Prepare the block with updated parentId
      const preparedBlock = position === 'inside'
        ? updateParentIdRecursively(draggedBlock, targetId)
        : (() => {
            const targetBlock = getAllBlocks(newBlocks).find(b => b.id === targetId);
            return updateParentIdRecursively(draggedBlock, targetBlock?.parentId);
          })();

      // Add to new position using immutable insertion
      if (position === 'inside') {
        newBlocks = addChildToBlock(newBlocks, targetId, preparedBlock);
      } else {
        newBlocks = insertBlockAtPosition(newBlocks, targetId, preparedBlock, position);
      }

      return newBlocks;
    });
  }, []);

  // Move block up within its sibling array
  const moveBlockUp = useCallback((blockId: string) => {
    setSchemaBlocks(prev => {
      const block = getAllBlocks(prev).find(b => b.id === blockId);
      if (!block) return prev;

      if (block.parentId) {
        // Block is inside a section - find parent and swap with previous sibling
        const parent = getAllBlocks(prev).find(b => b.id === block.parentId);
        if (!parent?.children) return prev;

        const index = parent.children.findIndex(c => c.id === blockId);
        if (index <= 0) return prev; // Already first

        const newChildren = [...parent.children];
        [newChildren[index - 1], newChildren[index]] = [newChildren[index], newChildren[index - 1]];
        return updateBlockById(prev, parent.id, { children: newChildren });
      } else {
        // Block is at root level
        const index = prev.findIndex(b => b.id === blockId);
        if (index <= 0) return prev; // Already first

        const newBlocks = [...prev];
        [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
        return newBlocks;
      }
    });
  }, []);

  // Move block down within its sibling array
  const moveBlockDown = useCallback((blockId: string) => {
    setSchemaBlocks(prev => {
      const block = getAllBlocks(prev).find(b => b.id === blockId);
      if (!block) return prev;

      if (block.parentId) {
        // Block is inside a section
        const parent = getAllBlocks(prev).find(b => b.id === block.parentId);
        if (!parent?.children) return prev;

        const index = parent.children.findIndex(c => c.id === blockId);
        if (index >= parent.children.length - 1) return prev; // Already last

        const newChildren = [...parent.children];
        [newChildren[index], newChildren[index + 1]] = [newChildren[index + 1], newChildren[index]];
        return updateBlockById(prev, parent.id, { children: newChildren });
      } else {
        // Block is at root level
        const index = prev.findIndex(b => b.id === blockId);
        if (index >= prev.length - 1) return prev; // Already last

        const newBlocks = [...prev];
        [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
        return newBlocks;
      }
    });
  }, []);

  // Change block's parent (move to different section or root)
  const changeBlockParent = useCallback((blockId: string, newParentId: string | undefined) => {
    setSchemaBlocks(prev => {
      const block = getAllBlocks(prev).find(b => b.id === blockId);
      if (!block) return prev;

      // Don't move if already at the same parent
      if (block.parentId === newParentId) return prev;

      // Prevent moving a section into itself or its descendants
      if (newParentId) {
        const blockAndDescendants = getAllBlocks([block]);
        if (blockAndDescendants.some(b => b.id === newParentId)) {
          return prev; // Cannot move into self or descendant
        }
      }

      // Remove from current location
      let newBlocks = removeBlockById(prev, blockId);

      // Prepare block with new parentId
      const preparedBlock = updateParentIdRecursively(block, newParentId);

      // Add to new parent or root
      if (newParentId) {
        newBlocks = addChildToBlock(newBlocks, newParentId, preparedBlock);
      } else {
        // Add to root (at the end)
        newBlocks = [...newBlocks, preparedBlock];
      }

      return newBlocks;
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

  // Apply bulk updates to multiple blocks at once (used by Dr. Puck bulk analysis)
  const applyBulkUpdates = useCallback((updates: Map<string, Partial<SchemaBlock>>) => {
    setSchemaBlocks(prev => {
      // Recursively apply updates to blocks
      const applyUpdates = (blocks: SchemaBlock[]): SchemaBlock[] => {
        return blocks.map(block => {
          const update = updates.get(block.id);
          const updatedBlock = update ? { ...block, ...update } : block;

          // Recursively update children
          if (updatedBlock.children) {
            updatedBlock.children = applyUpdates(updatedBlock.children);
          }

          return updatedBlock;
        });
      };

      return applyUpdates(prev);
    });
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
    moveBlockUp,
    moveBlockDown,
    changeBlockParent,
    clearSchema,
    loadSchema,
    applyBulkUpdates
  };
}