import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, ChevronDown, ChevronRight, X, Settings, GitBranch, Edit3 } from 'lucide-react';
import type { SchemaBlock } from '../types';

interface SchemaBlockItemProps {
  block: SchemaBlock;
  depth: number;
  isHovered: boolean;
  onHover: (blockId: string | null) => void;
  onUpdate: (blockId: string, updates: Partial<SchemaBlock>) => void;
  onRemove: (blockId: string) => void;
  onToggleExpanded: (blockId: string) => void;
  onReorder: (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
  onShowSettings: (block: SchemaBlock) => void;
  onShowDependencies: (block: SchemaBlock) => void;
}

const ITEM_TYPE = 'schema-block';

export function SchemaBlockItemSimple({
  block,
  depth,
  isHovered,
  onHover,
  onUpdate,
  onRemove,
  onToggleExpanded,
  onReorder,
  onShowSettings,
  onShowDependencies,
}: SchemaBlockItemProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(block.variable.name);

  const isSection = block.dataType === 'Section';
  const Icon = block.variable.icon;
  const isValidIcon = typeof Icon === 'function';

  // Drag and drop
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id: block.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, dropPosition }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { id: string }, monitor) => {
      if (item.id === block.id) return;

      const hoverBoundingRect = monitor.getClientOffset();
      if (!hoverBoundingRect) return;

      // Determine drop position based on cursor position
      // For now, simplified - just drop inside sections or after non-sections
    },
    drop: (item: { id: string }, monitor) => {
      if (item.id === block.id) return;
      
      // Simple logic: if it's a section, drop inside, otherwise drop after
      const position = isSection ? 'inside' : 'after';
      onReorder(item.id, block.id, position);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      dropPosition: 'after' as const,
    }),
  });

  const handleNameSave = () => {
    if (editedName.trim()) {
      onUpdate(block.id, { variable: { ...block.variable, name: editedName.trim() } });
    }
    setIsEditingName(false);
  };

  const roleColors: Record<string, string> = {
    Predictor: 'blue',
    Outcome: 'purple',
    Structure: 'slate',
    All: 'slate',
  };

  const roleColor = roleColors[block.role] || 'slate';

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`group relative ${isDragging ? 'opacity-50' : ''}`}
      style={{ marginLeft: `${depth * 24}px` }}
    >
      <div
        className={`bg-white border rounded-lg p-3 transition-all ${
          isHovered
            ? 'border-blue-500 shadow-md'
            : isOver
            ? 'border-blue-300 bg-blue-50'
            : 'border-slate-200 hover:border-slate-300'
        }`}
        onMouseEnter={() => onHover(block.id)}
        onMouseLeave={() => onHover(null)}
      >
        <div className="flex items-center gap-2">
          {/* Drag Handle */}
          <div className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-slate-400" />
          </div>

          {/* Expand/Collapse for Sections */}
          {isSection && block.children && block.children.length > 0 && (
            <button
              onClick={() => onToggleExpanded(block.id)}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
            >
              {block.isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-600" />
              )}
            </button>
          )}

          {/* Icon */}
          {isValidIcon && (
            <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 bg-${roleColor}-100`}>
              <Icon className={`w-4 h-4 text-${roleColor}-600`} />
            </div>
          )}

          {/* Name */}
          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSave();
                  if (e.key === 'Escape') {
                    setEditedName(block.variable.name);
                    setIsEditingName(false);
                  }
                }}
                autoFocus
                className="w-full px-2 py-1 border border-blue-500 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900 truncate">{block.variable.name}</span>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded transition-opacity"
                >
                  <Edit3 className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-500">{block.dataType}</span>
              {block.unit && (
                <>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs text-slate-500">{block.unit}</span>
                </>
              )}
            </div>
          </div>

          {/* Role Tag */}
          <div className={`px-2 py-1 rounded text-xs font-medium bg-${roleColor}-100 text-${roleColor}-700`}>
            {block.role}
          </div>

          {/* Version Tag */}
          {block.versionTag && (
            <div className={`px-2 py-1 rounded text-xs font-medium bg-${block.versionColor || 'blue'}-100 text-${block.versionColor || 'blue'}-700`}>
              {block.versionTag}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onShowDependencies(block)}
              className="p-1.5 hover:bg-slate-100 rounded transition-colors"
              title="Dependencies"
            >
              <GitBranch className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={() => onShowSettings(block)}
              className="p-1.5 hover:bg-slate-100 rounded transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={() => onRemove(block.id)}
              className="p-1.5 hover:bg-red-100 rounded transition-colors"
              title="Remove"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Children (Recursive) */}
      {isSection && block.isExpanded && block.children && block.children.length > 0 && (
        <div className="mt-2 space-y-2">
          {block.children.map((child) => (
            <SchemaBlockItemSimple
              key={child.id}
              block={child}
              depth={depth + 1}
              isHovered={isHovered}
              onHover={onHover}
              onUpdate={onUpdate}
              onRemove={onRemove}
              onToggleExpanded={onToggleExpanded}
              onReorder={onReorder}
              onShowSettings={onShowSettings}
              onShowDependencies={onShowDependencies}
            />
          ))}
        </div>
      )}
    </div>
  );
}