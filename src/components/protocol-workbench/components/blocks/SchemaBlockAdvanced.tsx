import { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, ChevronDown, ChevronRight, Edit3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BlockBadges } from './BlockBadges';
import { BlockToolbar } from './BlockToolbar';
import { ConfigurationHUD } from './ConfigurationHUD';
import type { SchemaBlock } from '../../types';

type DropPosition = 'before' | 'after' | 'inside' | null;

interface SchemaBlockAdvancedProps {
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
  onShowVersionTag: (block: SchemaBlock) => void;
  onDuplicate?: (block: SchemaBlock) => void;
}

const ITEM_TYPE = 'schema-block';

export function SchemaBlockAdvanced({
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
  onShowVersionTag,
  onDuplicate,
}: SchemaBlockAdvancedProps) {
  const { t } = useTranslation('protocol');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(block.variable.name);
  const [showConfigHUD, setShowConfigHUD] = useState(false);
  const [dropPosition, setDropPosition] = useState<DropPosition>(null);
  const blockRef = useRef<HTMLDivElement>(null);

  const isSection = block.dataType === 'Section';
  const Icon = block.variable.icon;
  const isValidIcon = typeof Icon === 'function';

  // Role color mapping for icon background
  const roleColorMap: Record<string, string> = {
    Predictor: 'blue',
    Outcome: 'purple',
    Structure: 'slate',
    All: 'slate',
  };
  const roleColor = roleColorMap[block.role] || 'slate';

  // Drag and drop with enhanced position detection
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id: block.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      setDropPosition(null);
    },
  });

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { id: string }, monitor) => {
      if (item.id === block.id) {
        setDropPosition(null);
        return;
      }

      const hoverBoundingRect = blockRef.current?.getBoundingClientRect();
      if (!hoverBoundingRect) return;

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      const blockHeight = hoverBoundingRect.bottom - hoverBoundingRect.top;

      if (isSection) {
        // For sections: top 20% = before, middle 60% = inside, bottom 20% = after
        const topZone = blockHeight * 0.2;
        const bottomZone = blockHeight * 0.8;

        if (hoverClientY < topZone) {
          setDropPosition('before');
        } else if (hoverClientY > bottomZone) {
          setDropPosition('after');
        } else {
          setDropPosition('inside');
        }
      } else {
        // For fields: top 50% = before, bottom 50% = after
        const midPoint = blockHeight / 2;
        setDropPosition(hoverClientY < midPoint ? 'before' : 'after');
      }
    },
    drop: (item: { id: string }, monitor) => {
      if (item.id === block.id || !dropPosition) return;

      // Only handle drop if this is the actual drop target (not a parent)
      if (monitor.didDrop()) return;

      onReorder(item.id, block.id, dropPosition);
      setDropPosition(null);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  // Clear drop position when not hovering
  const handleDragLeave = () => {
    setDropPosition(null);
  };

  const handleNameSave = () => {
    if (editedName.trim()) {
      onUpdate(block.id, { variable: { ...block.variable, name: editedName.trim() } });
    }
    setIsEditingName(false);
  };

  // Combine refs for drag, drop, and position tracking
  const combinedRef = (node: HTMLDivElement | null) => {
    drag(drop(node));
    (blockRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
  };

  return (
    <div
      ref={combinedRef}
      className={`group relative ${isDragging ? 'opacity-50' : ''}`}
      style={{ marginLeft: `${depth * 32}px` }}
      onMouseEnter={() => {
        onHover(block.id);
        setShowConfigHUD(true);
      }}
      onMouseLeave={() => {
        onHover(null);
        setShowConfigHUD(false);
        handleDragLeave();
      }}
    >
      {/* Drop zone indicator - BEFORE */}
      {isOver && dropPosition === 'before' && (
        <div className="absolute -top-1 left-0 right-0 h-1 bg-blue-500 rounded-full z-20 shadow-lg shadow-blue-500/50" />
      )}

      {/* Connecting line for nested items */}
      {depth > 0 && (
        <>
          <div
            className="absolute w-px bg-slate-200"
            style={{ left: '-16px', top: 0, bottom: 0 }}
          />
          <div
            className="absolute h-px bg-slate-200"
            style={{ left: '-16px', top: '20px', width: '16px' }}
          />
        </>
      )}

      <div
        className={`relative bg-white rounded-lg transition-all duration-150 ${
          isSection ? 'border border-slate-200' : 'border border-slate-200'
        } ${
          isHovered
            ? 'shadow-md border-blue-300 bg-blue-50/30'
            : isOver && dropPosition === 'inside'
            ? 'border-2 border-dashed border-blue-400 bg-blue-50/30'
            : isOver
            ? 'border-blue-200 bg-blue-50/20'
            : 'hover:border-slate-300 hover:shadow-sm'
        }`}
      >
        {/* Drop zone indicator - INSIDE (for sections) */}
        {isOver && dropPosition === 'inside' && isSection && (
          <div className="absolute inset-0 bg-blue-100/40 rounded-lg pointer-events-none z-10 flex items-center justify-center">
            <span className="text-xs font-medium text-blue-600 bg-white px-2 py-1 rounded shadow">
              Drop inside section
            </span>
          </div>
        )}
        {/* Section Header Style */}
        {isSection ? (
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Drag Handle */}
              <div className="cursor-grab active:cursor-grabbing opacity-100 transition-opacity">
                <GripVertical className="w-4 h-4 text-slate-400" />
              </div>

              {/* Expand/Collapse */}
              {block.children && block.children.length > 0 && (
                <button
                  onClick={() => onToggleExpanded(block.id)}
                  className="p-0.5 hover:bg-slate-100 rounded transition-colors flex-shrink-0"
                >
                  {block.isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  )}
                </button>
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
                    className="w-full px-2 py-1 border-2 border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{block.variable.name}</span>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="opacity-100 p-0.5 hover:bg-slate-100 rounded transition-opacity"
                    >
                      <Edit3 className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-slate-500">{t('schemaBlock.section')}</span>
                  {block.children && (
                    <>
                      <span className="text-xs text-slate-300">•</span>
                      <span className="text-xs text-slate-400">
                        {block.children.length} {t('schemaBlock.items')}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Badges */}
              <BlockBadges block={block} />

              {/* Toolbar */}
              <div className="opacity-100 transition-opacity">
                <BlockToolbar
                  block={block}
                  onShowSettings={onShowSettings}
                  onShowDependencies={onShowDependencies}
                  onShowVersionTag={onShowVersionTag}
                  onDuplicate={onDuplicate}
                  onRemove={onRemove}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Regular Field Style - Clean Card Design */
          <div className="px-4 py-3 bg-gradient-to-r from-blue-50/40 to-purple-50/40">
            <div className="flex items-center gap-3">
              {/* Drag Handle */}
              <div className="cursor-grab active:cursor-grabbing opacity-100 transition-opacity">
                <GripVertical className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Icon */}
              {isValidIcon && (
                <div className="flex-shrink-0">
                  <Icon className="w-4 h-4 text-slate-600" />
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
                    className="w-full px-2 py-1 border-2 border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">{block.variable.name}</span>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="opacity-100 p-0.5 hover:bg-white/50 rounded transition-opacity"
                    >
                      <Edit3 className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                )}
                {(block.unit || block.minValue !== undefined) && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {block.dataType && <span className="text-xs text-slate-500">{block.dataType}</span>}
                    {block.unit && (
                      <>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-xs text-slate-500">{block.unit}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Data Type Badge - Blue Pill Style */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {block.dataType}
                </span>
              </div>

              {/* Badges */}
              <BlockBadges block={block} />

              {/* Toolbar */}
              <div className="opacity-100 transition-opacity">
                <BlockToolbar
                  block={block}
                  onShowSettings={onShowSettings}
                  onShowDependencies={onShowDependencies}
                  onShowVersionTag={onShowVersionTag}
                  onDuplicate={onDuplicate}
                  onRemove={onRemove}
                />
              </div>
            </div>
          </div>
        )}

        {/* Configuration HUD (appears on hover) */}
        {showConfigHUD && isHovered && !isEditingName && !isSection && (
          <ConfigurationHUD block={block} onUpdate={onUpdate} />
        )}
      </div>

      {/* Drop zone indicator - AFTER */}
      {isOver && dropPosition === 'after' && (
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-blue-500 rounded-full z-20 shadow-lg shadow-blue-500/50" />
      )}

      {/* Children (Recursive) */}
      {isSection && block.isExpanded && block.children && block.children.length > 0 && (
        <div className="mt-2 space-y-2 pl-8">
          {block.children.map((child) => (
            <SchemaBlockAdvanced
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
              onShowVersionTag={onShowVersionTag}
              onDuplicate={onDuplicate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
