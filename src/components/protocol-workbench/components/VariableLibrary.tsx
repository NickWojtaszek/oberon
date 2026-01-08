import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { variableLibrary } from '../constants';
import type { Variable } from '../types';

interface VariableLibraryProps {
  onAddVariable: (variable: Variable, parentId?: string) => void;
  selectedParentId?: string | null;
}

export function VariableLibrary({ onAddVariable, selectedParentId }: VariableLibraryProps) {
  const { t } = useTranslation('ui');
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set(Object.keys(variableLibrary.reduce((acc, variable) => {
      acc[variable.category] = true;
      return acc;
    }, {} as Record<string, boolean>)) as string[])
  );

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const filteredBySearch = searchQuery.trim()
    ? variableLibrary.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : variableLibrary;

  const categorizedVariables = filteredBySearch.reduce((acc, variable) => {
    if (!acc[variable.category]) {
      acc[variable.category] = [];
    }
    acc[variable.category].push(variable);
    return acc;
  }, {} as Record<string, Variable[]>);

  const categories = Object.keys(categorizedVariables) as string[];

  const categoryColors: Record<string, string> = {
    Demographics: 'blue',
    Vitals: 'green',
    Labs: 'purple',
    Safety: 'red',
    Efficacy: 'indigo',
    'Quality of Life': 'pink',
    'Medical History': 'amber',
    Biomarkers: 'cyan',
    Imaging: 'teal',
    Medications: 'orange',
    'Adverse Events': 'rose',
    Procedures: 'violet',
    Questionnaires: 'lime',
    Other: 'slate',
  };

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">{t('protocolWorkbench.variableLibrary.title')}</h3>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('protocolWorkbench.variableLibrary.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Variable List */}
      <div className="flex-1 overflow-y-auto scrollbar-light">
        {categories.map(category => {
          const variables = categorizedVariables[category];
          const isCollapsed = collapsedCategories.has(category);
          const color = categoryColors[category] || 'slate';

          return (
            <div key={category} className="border-b border-slate-100">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-5 py-3 flex items-center gap-2 hover:bg-slate-50 transition-colors group"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                )}
                <span className="text-sm font-semibold text-slate-700">{category}</span>
                <span className="ml-auto text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {variables.length}
                </span>
              </button>

              {/* Variables - Tile Grid */}
              {!isCollapsed && (
                <div className="px-3 pb-3 space-y-2">
                  {variables.map(variable => {
                    const Icon = variable.icon;
                    const isValidIcon = typeof Icon === 'function';

                    return (
                      <button
                        key={variable.id}
                        onClick={() => onAddVariable(variable, selectedParentId || undefined)}
                        className="w-full p-3 flex items-center gap-3 bg-white hover:bg-blue-50 transition-all group border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm"
                      >
                        {isValidIcon && (
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-${color}-50 border border-${color}-200 group-hover:bg-${color}-100 transition-colors`}>
                            <Icon className={`w-5 h-5 text-${color}-600`} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-900">
                            {variable.name}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{variable.defaultType}</div>
                        </div>
                        <Plus className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}