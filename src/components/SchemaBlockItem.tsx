import React, { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, ChevronDown, ChevronRight, AlertOctagon, Brain, Settings, X, Edit3, GitBranch } from 'lucide-react';

type DataType = 'Continuous' | 'Categorical' | 'Boolean' | 'Date' | 'Text' | 'Multi-Select' | 'Conditional' | 'Grid' | 'Section' | 'Ranked-Matrix' | 'Categorical-Grid';
type RoleTag = 'Predictor' | 'Outcome' | 'Structure';
type WorkbenchState = 'blueprint' | 'review-mapping' | 'production' | 'archived';
type VariableCategory = 'Demographics' | 'Treatments' | 'Endpoints' | 'Clinical' | 'Laboratory' | 'Structural';

interface Variable {
  id: string;
  name: string;
  category: VariableCategory;
  icon: any;
  defaultType: DataType;
  defaultUnit?: string;
  isPII?: boolean;
  isCustom?: boolean;
  customScope?: 'user' | 'institution';
  customConfig?: {
    options?: string[];
    gridItems?: string[];
    gridCategories?: string[];
    matrixRows?: string[];
    clinicalRange?: { min: number; max: number; unit: string };
  };
}

interface SchemaBlock {
  id: string;
  variable: Variable;
  dataType: DataType;
  role: RoleTag;
  isPrimary?: boolean;
  endpointTier?: 'primary' | 'secondary' | 'exploratory' | null;
  analysisMethod?: 'survival' | 'frequency' | 'mean-comparison' | 'non-parametric' | 'chi-square' | null;
  isMapped?: boolean;
  mappingConfidence?: number;
  csvColumn?: string;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  children?: SchemaBlock[];
  isExpanded?: boolean;
  parentId?: string;
  conditionalOn?: string;
  conditionalValue?: string;
  options?: string[];
  clinicalRange?: { min: number; max: number; unit: string };
  versionTag?: string;
  versionColor?: 'blue' | 'green' | 'purple' | 'amber';
  dependencies?: string[];
  gridItems?: string[];
  gridCategories?: string[];
  matrixRows?: string[];
  isCustom?: boolean;
  customName?: string;
}

interface SchemaBlockItemProps {
  block: SchemaBlock;
  level?: number;
  hoveredBlockId: string | null;
  setHoveredBlockId: (id: string | null) => void;
  semanticMismatches: { blockId: string; reason: string }[];
  workbenchState: WorkbenchState;
  versionColors: Record<string, string>;
  handleMoveBlock: (draggedBlockId: string, targetBlockId: string, position: 'before' | 'after' | 'inside') => void;
  handleToggleExpand: (blockId: string) => void;
  handleUpdateSectionName: (blockId: string, newName: string) => void;
  handleOpenSettings: (block: SchemaBlock) => void;
  handleOpenDependency: (block: SchemaBlock) => void;
  handleRemoveBlock: (blockId: string) => void;
  handleAddVariable: (variable: Variable, role?: RoleTag, parentId?: string) => void;
  variableLibrary: Variable[];
}

export const SchemaBlockItem: React.FC<SchemaBlockItemProps> = ({
  block,
  level = 0,
  hoveredBlockId,
  setHoveredBlockId,
  semanticMismatches,
  workbenchState,
  versionColors,
  handleMoveBlock,
  handleToggleExpand,
  handleUpdateSectionName,
  handleOpenSettings,
  handleOpenDependency,
  handleRemoveBlock,
  handleAddVariable,
  variableLibrary,
}) => {
  const IconComponent = block.variable?.icon;
  const isValidIcon = typeof IconComponent === 'function';
  const isSection = block.dataType === 'Section';
  const isHovered = hoveredBlockId === block.id;
  const roleColor = block.role === 'Outcome' ? 'purple' : block.role === 'Structure' ? 'slate' : 'blue';
  const hasMismatch = semanticMismatches.some(m => m.blockId === block.id);
  const mismatchReason = semanticMismatches.find(m => m.blockId === block.id)?.reason;

  // Section name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(block.customName || 'Untitled Section');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync editedName when block.customName changes externally
  useEffect(() => {
    if (!isEditingName) {
      setEditedName(block.customName || 'Untitled Section');
    }
  }, [block.customName, isEditingName]);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const handleSaveName = () => {
    if (editedName.trim()) {
      handleUpdateSectionName(block.id, editedName.trim());
    }
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setEditedName(block.customName || 'Untitled Section');
      setIsEditingName(false);
    }
  };

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'SCHEMA_BLOCK',
    item: { id: block.id, type: 'SCHEMA_BLOCK' },
    canDrag: workbenchState !== 'production' && workbenchState !== 'review-mapping',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOverTop }, dropTop] = useDrop({
    accept: 'SCHEMA_BLOCK',
    drop: (item: { id: string }) => {
      if (item.id !== block.id) {
        handleMoveBlock(item.id, block.id, 'before');
      }
    },
    collect: (monitor) => ({
      isOverTop: monitor.isOver() && monitor.getItem()?.id !== block.id,
    }),
  });

  const [{ isOverBottom }, dropBottom] = useDrop({
    accept: 'SCHEMA_BLOCK',
    drop: (item: { id: string }) => {
      if (item.id !== block.id) {
        handleMoveBlock(item.id, block.id, 'after');
      }
    },
    collect: (monitor) => ({
      isOverBottom: monitor.isOver() && monitor.getItem()?.id !== block.id,
    }),
  });

  const [{ isOverInside }, dropInside] = useDrop({
    accept: 'SCHEMA_BLOCK',
    drop: (item: { id: string }) => {
      if (item.id !== block.id && isSection) {
        handleMoveBlock(item.id, block.id, 'inside');
      }
    },
    canDrop: () => isSection,
    collect: (monitor) => ({
      isOverInside: monitor.isOver() && monitor.canDrop() && monitor.getItem()?.id !== block.id,
    }),
  });

  const borderClass = block.isPrimary
    ? 'border-indigo-500 ring-4 ring-indigo-200 shadow-lg'
    : isSection
    ? 'border-slate-300 bg-slate-100'
    : block.role === 'Outcome'
    ? 'border-purple-300'
    : 'border-blue-300';

  return (
    <div className={`${level > 0 ? 'ml-6' : ''}`} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {/* Drop Zone - Top */}
      <div
        ref={dropTop}
        className={`h-2 transition-all ${isOverTop ? 'bg-indigo-400 rounded mb-1' : ''}`}
      />

      <div 
        ref={isSection ? (node) => { preview(node); dropInside(node); } : preview}
        className={`group bg-white border-2 rounded-lg p-4 shadow-sm transition-all relative ${borderClass} ${level > 0 ? 'border-l-4' : ''} ${
          isHovered && !isSection ? 'ring-2 ring-indigo-300' : ''
        } ${hasMismatch ? 'ring-2 ring-red-500' : ''} ${isOverInside ? 'ring-4 ring-indigo-300 bg-indigo-50' : ''}`}
        onMouseEnter={() => setHoveredBlockId(block.id)}
        onMouseLeave={() => setHoveredBlockId(null)}
      >
        {/* Drop Inside Section Indicator */}
        {isOverInside && isSection && (
          <div className="absolute inset-0 pointer-events-none rounded-lg border-4 border-indigo-500 bg-indigo-100/20 flex items-center justify-center z-20">
            <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
              Drop to add inside section
            </div>
          </div>
        )}
        
        {/* Semantic Mismatch Warning */}
        {hasMismatch && (
          <div className="absolute top-2 left-2 z-10">
            <div className="flex items-center gap-2 px-2 py-1 bg-red-50 border-2 border-red-500 rounded-lg text-xs">
              <AlertOctagon className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span className="text-red-900 font-medium">AI: Semantic Mismatch</span>
            </div>
          </div>
        )}
        
        {/* Version Tag Badge */}
        {block.versionTag && !isSection && (
          <div className={`absolute top-2 right-2 px-2 py-0.5 border rounded text-xs font-mono font-medium ${
            versionColors[block.versionColor || 'blue']
          }`}>
            {block.versionTag}
          </div>
        )}

        <div className="flex items-start gap-3">
          {workbenchState !== 'production' && !isSection && (
            <div ref={drag} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
            </div>
          )}
          
          {isSection && (
            <button
              onClick={() => handleToggleExpand(block.id)}
              className="p-0.5 hover:bg-slate-200 rounded transition-colors"
            >
              {block.isExpanded ? (
                <ChevronDown className="w-5 h-5 text-slate-700" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-700" />
              )}
            </button>
          )}
          
          {isValidIcon && IconComponent && (
            <IconComponent className={`w-5 h-5 text-${roleColor}-600 flex-shrink-0 mt-0.5`} />
          )}
          
          <div className="flex-1 min-w-0">
            {isSection ? (
              <div className="flex items-center gap-2 group/name">
                {isEditingName ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onBlur={handleSaveName}
                    onKeyDown={handleKeyDown}
                    className="text-sm font-medium text-slate-900 bg-white border-2 border-indigo-400 rounded px-2 py-1 flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    disabled={workbenchState === 'production'}
                  />
                ) : (
                  <>
                    <h3 className="text-sm font-medium text-slate-900">
                      {block.customName || 'Untitled Section'}
                    </h3>
                    {workbenchState !== 'production' && (
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="opacity-0 group-hover/name:opacity-100 p-1 hover:bg-slate-200 rounded transition-all"
                        title="Edit section name"
                      >
                        <Edit3 className="w-3 h-3 text-slate-500" />
                      </button>
                    )}
                  </>
                )}
              </div>
            ) : (
              <h3 className="text-sm font-medium text-slate-900">
                {block.isCustom && block.customName ? block.customName : block.variable.name}
              </h3>
            )}
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <div className="text-xs text-slate-600">
                {block.dataType}{block.unit && ` • ${block.unit}`}
              </div>
              
              {/* Endpoint Tier Badges */}
              {block.endpointTier && (
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                  block.endpointTier === 'primary' 
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                    : block.endpointTier === 'secondary'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}>
                  {block.endpointTier === 'primary' && '★'}
                  {block.endpointTier === 'secondary' && '●'}
                  {block.endpointTier === 'exploratory' && '○'}
                  <span className="uppercase tracking-wide">{block.endpointTier}</span>
                </div>
              )}
            </div>
          </div>

          {/* Configuration HUD - appears on hover */}
          <div className={`flex items-center gap-1 transition-opacity ${
            isHovered && workbenchState !== 'production' ? 'opacity-100' : 'opacity-0'
          }`}>
            {/* Logic Link - only for non-sections */}
            {!isSection && (
              <button
                onClick={() => handleOpenDependency(block)}
                className={`p-1.5 rounded transition-colors ${
                  block.conditionalOn 
                    ? 'bg-purple-50 hover:bg-purple-100' 
                    : 'hover:bg-slate-50'
                }`}
                title="Logic Link (Conditional Visibility)"
              >
                <GitBranch className={`w-4 h-4 ${
                  block.conditionalOn ? 'text-purple-600' : 'text-slate-600'
                }`} />
              </button>
            )}
            
            {/* Settings - only for non-sections */}
            {!isSection && (
              <button
                onClick={() => handleOpenSettings(block)}
                className="p-1.5 hover:bg-slate-50 rounded transition-colors"
                title="Schema Generator"
              >
                <Settings className="w-4 h-4 text-slate-600" />
              </button>
            )}

            {/* Remove Button */}
            {workbenchState !== 'production' && workbenchState !== 'review-mapping' && (
              <button
                onClick={() => handleRemoveBlock(block.id)}
                className="p-1.5 hover:bg-red-50 rounded transition-colors"
                title="Remove"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-red-600" />
              </button>
            )}
          </div>
        </div>

        {/* Mismatch Explanation */}
        {hasMismatch && mismatchReason && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Brain className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-medium text-red-900 mb-1">AI Analysis</div>
                <div className="text-xs text-red-700">{mismatchReason}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drop Zone - Bottom */}
      <div
        ref={dropBottom}
        className={`h-2 transition-all ${isOverBottom ? 'bg-indigo-400 rounded mt-1' : ''}`}
      />

      {/* Render Children */}
      {isSection && block.isExpanded && block.children && block.children.length > 0 && (
        <div className="mt-2 space-y-2">
          {block.children.map(child => (
            <SchemaBlockItem
              key={child.id}
              block={child}
              level={level + 1}
              hoveredBlockId={hoveredBlockId}
              setHoveredBlockId={setHoveredBlockId}
              semanticMismatches={semanticMismatches}
              workbenchState={workbenchState}
              versionColors={versionColors}
              handleMoveBlock={handleMoveBlock}
              handleToggleExpand={handleToggleExpand}
              handleUpdateSectionName={handleUpdateSectionName}
              handleOpenSettings={handleOpenSettings}
              handleOpenDependency={handleOpenDependency}
              handleRemoveBlock={handleRemoveBlock}
              handleAddVariable={handleAddVariable}
              variableLibrary={variableLibrary}
            />
          ))}
        </div>
      )}

      {/* Add Child Button for Sections */}
      {isSection && block.isExpanded && workbenchState !== 'production' && workbenchState !== 'review-mapping' && (
        <div className="mt-2 ml-6">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-3 text-center bg-white">
            <p className="text-xs text-slate-600 mb-2">Add field to this section</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {variableLibrary
                .filter(v => 
                  v.name === 'Co-existing Diseases' || 
                  v.name === 'Hypertension' || 
                  v.name === 'Coronary Artery Disease'
                )
                .map(variable => (
                  <button
                    key={variable.id}
                    onClick={() => handleAddVariable(variable, 'Predictor', block.id)}
                    className="text-xs px-2 py-1 bg-white border border-slate-200 rounded hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    + {variable.name}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};