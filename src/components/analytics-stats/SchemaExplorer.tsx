// Left Column: Schema Explorer with variable selection

import { useState } from 'react';
import { Search, ChevronDown, ChevronRight, FlaskConical, Target, CheckSquare, Square } from 'lucide-react';
import type { SchemaBlock } from '../protocol-workbench/types';
import type { AnalysisVariable } from './types';

interface SchemaExplorerProps {
  schemaBlocks: SchemaBlock[];
  selectedVariables: string[];
  onVariableToggle: (variableId: string) => void;
}

export function SchemaExplorer({ schemaBlocks, selectedVariables, onVariableToggle }: SchemaExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Convert schema blocks to analysis variables
  const variables: AnalysisVariable[] = flattenBlocks(schemaBlocks)
    .filter(block => block.dataType !== 'Section' && block.variable)
    .map(block => ({
      id: block.id,
      name: block.variable.name || '',
      label: block.customName || block.variable.name || 'Unnamed Variable',
      dataType: block.dataType as any,
      role: determineRole(block),
      unit: block.unit,
      section: findSectionName(block.id, schemaBlocks)
    }));

  // Filter variables by search query
  const filteredVariables = variables.filter(v =>
    (v.label && v.label.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (v.name && v.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group by section
  const variablesBySection = filteredVariables.reduce((acc, v) => {
    if (!acc[v.section]) acc[v.section] = [];
    acc[v.section].push(v);
    return acc;
  }, {} as { [section: string]: AnalysisVariable[] });

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getRoleIcon = (role: string) => {
    if (role === 'Predictor' || role === 'Covariate') {
      return <FlaskConical className="w-4 h-4 text-blue-600" />;
    }
    if (role === 'Outcome' || role === 'Endpoint') {
      return <Target className="w-4 h-4 text-amber-600" />;
    }
    return <FlaskConical className="w-4 h-4 text-slate-400" />;
  };

  const getRoleBadge = (role: string) => {
    if (role === 'Predictor' || role === 'Covariate') {
      return <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">Predictor</span>;
    }
    if (role === 'Outcome' || role === 'Endpoint') {
      return <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs">Outcome</span>;
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-slate-900 mb-3">Schema Explorer</h3>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search variables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Selection counter */}
        <div className="mt-3 text-xs text-slate-600">
          {selectedVariables.length} variable{selectedVariables.length !== 1 ? 's' : ''} selected
        </div>
      </div>

      {/* Variable tree */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(variablesBySection).length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No variables found
          </div>
        ) : (
          <div className="p-2">
            {Object.entries(variablesBySection).map(([section, vars]) => (
              <div key={section} className="mb-2">
                {/* Section header */}
                <button
                  onClick={() => toggleSection(section)}
                  className="w-full flex items-center gap-2 px-2 py-2 hover:bg-slate-50 rounded transition-colors text-left"
                >
                  {expandedSections.has(section) ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                  <span className="text-sm font-medium text-slate-700">{section}</span>
                  <span className="text-xs text-slate-500">({vars.length})</span>
                </button>

                {/* Variables */}
                {expandedSections.has(section) && (
                  <div className="px-3 pb-3 space-y-2">
                    {vars.map(variable => {
                      const isSelected = selectedVariables.includes(variable.id);
                      return (
                        <button
                          key={variable.id}
                          onClick={() => onVariableToggle(variable.id)}
                          className={`w-full p-3 flex items-center gap-3 bg-white transition-all group border rounded-lg hover:shadow-sm ${
                            isSelected
                              ? 'border-blue-300 bg-blue-50'
                              : 'border-slate-200 hover:bg-blue-50 hover:border-blue-300'
                          }`}
                        >
                          {/* Role icon */}
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                            variable.role === 'Predictor' || variable.role === 'Covariate'
                              ? 'bg-blue-50 border border-blue-200 group-hover:bg-blue-100'
                              : variable.role === 'Outcome' || variable.role === 'Endpoint'
                              ? 'bg-amber-50 border border-amber-200 group-hover:bg-amber-100'
                              : 'bg-slate-50 border border-slate-200 group-hover:bg-slate-100'
                          }`}>
                            {getRoleIcon(variable.role)}
                          </div>

                          {/* Label */}
                          <div className="flex-1 min-w-0 text-left">
                            <div className={`text-sm font-medium truncate ${
                              isSelected ? 'text-blue-900' : 'text-slate-900 group-hover:text-blue-900'
                            }`}>
                              {variable.label}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 truncate">
                              {variable.dataType}
                              {variable.unit && ` • ${variable.unit}`}
                            </div>
                          </div>

                          {/* Checkbox */}
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="flex items-center gap-1 text-blue-600 mb-1">
              <FlaskConical className="w-3 h-3" />
              <span className="font-medium">Predictors</span>
            </div>
            <div className="text-slate-600">
              {variables.filter(v => v.role === 'Predictor' || v.role === 'Covariate').length} variables
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-amber-600 mb-1">
              <Target className="w-3 h-3" />
              <span className="font-medium">Outcomes</span>
            </div>
            <div className="text-slate-600">
              {variables.filter(v => v.role === 'Outcome' || v.role === 'Endpoint').length} variables
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function flattenBlocks(blocks: SchemaBlock[]): SchemaBlock[] {
  const result: SchemaBlock[] = [];
  
  function traverse(block: SchemaBlock) {
    result.push(block);
    if (block.children) {
      block.children.forEach(traverse);
    }
  }
  
  blocks.forEach(traverse);
  return result;
}

function determineRole(block: SchemaBlock): 'Predictor' | 'Outcome' | 'Covariate' | 'Structure' {
  const role = block.role?.toLowerCase() || '';
  const name = block.variable?.name?.toLowerCase() || '';
  
  if (role.includes('endpoint') || role.includes('outcome') || name.includes('outcome')) {
    return 'Outcome';
  }
  if (role.includes('predictor') || role.includes('exposure') || role.includes('treatment')) {
    return 'Predictor';
  }
  if (role.includes('covariate') || role.includes('demographic') || role.includes('baseline')) {
    return 'Covariate';
  }
  return 'Predictor'; // Default
}

function findSectionName(blockId: string, blocks: SchemaBlock[]): string {
  // Find the parent section for this block
  function findParentSection(blocks: SchemaBlock[], targetId: string, currentSection: string = 'Uncategorized'): string {
    for (const block of blocks) {
      if (block.id === targetId) {
        return currentSection;
      }
      if (block.children) {
        const sectionName = block.dataType === 'Section' ? (block.customName || block.variable?.name || 'Unnamed Section') : currentSection;
        const found = findParentSection(block.children, targetId, sectionName);
        if (found !== 'Uncategorized') return found;
      }
    }
    return currentSection;
  }
  
  return findParentSection(blocks, blockId);
}