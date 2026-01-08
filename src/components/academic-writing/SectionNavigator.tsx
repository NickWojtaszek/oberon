/**
 * Section Navigator
 * Left sidebar for navigating manuscript sections
 * Replaces horizontal tabs with collapsible sidebar pattern from Analytics
 */

import { Search, ChevronRight, ChevronDown, BookOpen, FlaskConical, FileText, MessageSquare, Lightbulb, AlertCircle, CheckCircle, FileEdit, Users } from 'lucide-react';
import { useState } from 'react';

export type SectionKey = 'introduction' | 'methods' | 'results' | 'discussion' | 'conclusion' | 'authors';

interface SectionInfo {
  key: SectionKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  isSpecial?: boolean; // For non-manuscript sections like authors
}

interface SectionNavigatorProps {
  activeSection: SectionKey;
  onSectionChange: (section: SectionKey) => void;
  sectionStats: Record<SectionKey, {
    wordCount: number;
    errorCount: number;
    conflictCount: number;
    hasContent: boolean;
  }>;
  manuscriptContent: Record<SectionKey, string>;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  // Manuscript management props
  manuscripts?: Array<{
    id: string;
    title: string;
    lastModified: number;
  }>;
  activeManuscriptId?: string;
  onManuscriptSelect?: (manuscriptId: string) => void;
}

const SECTIONS: SectionInfo[] = [
  { 
    key: 'introduction', 
    label: 'Introduction', 
    icon: BookOpen,
    description: 'Background and research context'
  },
  { 
    key: 'methods', 
    label: 'Methods', 
    icon: FlaskConical,
    description: 'Study design and procedures'
  },
  { 
    key: 'results', 
    label: 'Results', 
    icon: FileText,
    description: 'Key findings and data'
  },
  { 
    key: 'discussion', 
    label: 'Discussion', 
    icon: MessageSquare,
    description: 'Interpretation and implications'
  },
  { 
    key: 'conclusion', 
    label: 'Conclusion', 
    icon: Lightbulb,
    description: 'Summary and future directions'
  },
  { 
    key: 'authors', 
    label: 'Authors', 
    icon: Users,
    description: 'List of authors and their contributions',
    isSpecial: true
  }
];

export function SectionNavigator({
  activeSection,
  onSectionChange,
  sectionStats,
  manuscriptContent,
  searchQuery = '',
  onSearchChange,
  // Manuscript management props
  manuscripts,
  activeManuscriptId,
  onManuscriptSelect
}: SectionNavigatorProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['manuscript']));
  const [localSearch, setLocalSearch] = useState('');

  const toggleGroup = (group: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(group)) {
      newExpanded.delete(group);
    } else {
      newExpanded.add(group);
    }
    setExpandedGroups(newExpanded);
  };

  // Count matches in section content
  const countMatches = (text: string, query: string): number => {
    if (!query || !text) return 0;
    const regex = new RegExp(query, 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  };

  // Get sections with match counts
  const sectionsWithMatches = SECTIONS.map(section => {
    const matchCount = countMatches(manuscriptContent[section.key], localSearch);
    return { ...section, matchCount };
  });

  // Filter sections by search query - show sections with content matches
  const filteredSections = sectionsWithMatches.filter(section => {
    if (!localSearch) return true;
    
    // Match in section name or description
    const nameMatch = section.label.toLowerCase().includes(localSearch.toLowerCase()) ||
                      section.description.toLowerCase().includes(localSearch.toLowerCase());
    
    // Match in section content
    const contentMatch = section.matchCount > 0;
    
    return nameMatch || contentMatch;
  });

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const getStatusIcon = (section: SectionKey) => {
    const stats = sectionStats[section];
    if (stats.errorCount > 0 || stats.conflictCount > 0) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    if (stats.hasContent && stats.wordCount > 0) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <FileEdit className="w-4 h-4 text-slate-300" />;
  };

  return (
    <div className="w-[400px] bg-slate-50 border-r border-slate-200 flex flex-col h-full">
      {/* Project Manuscripts Section */}
      {manuscripts && manuscripts.length > 0 && (
        <div className="p-4 border-b border-slate-200 bg-white">
          <h3 className="text-slate-900 mb-3 text-sm font-semibold">Project Manuscripts</h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {manuscripts
              .sort((a, b) => b.lastModified - a.lastModified)
              .map(manuscript => {
                const isActive = manuscript.id === activeManuscriptId;
                const isLastWorked = manuscript.id === manuscripts.reduce((latest, m) => 
                  m.lastModified > latest.lastModified ? m : latest
                ).id;
                
                return (
                  <button
                    key={manuscript.id}
                    onClick={() => onManuscriptSelect?.(manuscript.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all border ${
                      isActive
                        ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium truncate mb-1 ${
                          isActive ? 'text-indigo-900' : 'text-slate-900'
                        }`}>
                          {manuscript.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(manuscript.lastModified).toLocaleDateString()} {new Date(manuscript.lastModified).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {isLastWorked && !isActive && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded flex-shrink-0">
                          Last worked
                        </span>
                      )}
                      {isActive && (
                        <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-slate-900 mb-3">Manuscript Sections</h3>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search manuscript content..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Progress indicator or search results */}
        <div className="mt-3 text-xs text-slate-600">
          {localSearch ? (
            <>
              {filteredSections.reduce((sum, s) => sum + s.matchCount, 0)} match{filteredSections.reduce((sum, s) => sum + s.matchCount, 0) !== 1 ? 'es' : ''} found
            </>
          ) : (
            <>
              {Object.values(sectionStats).filter(s => s.hasContent).length} of {SECTIONS.length} sections drafted
            </>
          )}
        </div>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {/* Manuscript Group */}
          <div className="mb-2">
            <button
              onClick={() => toggleGroup('manuscript')}
              className="w-full flex items-center gap-2 px-2 py-2 hover:bg-slate-100 rounded transition-colors text-left"
            >
              {expandedGroups.has('manuscript') ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
              <span className="text-sm font-medium text-slate-700">Manuscript</span>
              <span className="text-xs text-slate-500">({filteredSections.length})</span>
            </button>

            {expandedGroups.has('manuscript') && (
              <div className="mt-1 space-y-1">
                {filteredSections.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-sm">
                    No sections match "{localSearch}"
                  </div>
                ) : (
                  filteredSections.map(section => {
                    const stats = sectionStats[section.key];
                    const isActive = activeSection === section.key;
                    const hasIssues = stats.errorCount > 0 || stats.conflictCount > 0;
                    
                    return (
                      <button
                        key={section.key}
                        onClick={() => onSectionChange(section.key)}
                        className={`w-full p-3 flex items-start gap-3 transition-all group border rounded-lg ${
                          isActive
                            ? 'bg-white border-blue-300 shadow-sm'
                            : 'bg-white border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm'
                        }`}
                      >
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          isActive
                            ? 'bg-blue-100 border border-blue-200'
                            : 'bg-slate-50 border border-slate-200 group-hover:bg-blue-100 group-hover:border-blue-200'
                        }`}>
                          <section.icon className={`w-5 h-5 ${
                            isActive ? 'text-blue-600' : 'text-slate-600 group-hover:text-blue-600'
                          }`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`text-sm font-medium truncate ${
                              isActive ? 'text-blue-900' : 'text-slate-900 group-hover:text-blue-900'
                            }`}>
                              {section.label}
                            </div>
                            {getStatusIcon(section.key)}
                          </div>
                          <div className="text-xs text-slate-500 truncate mb-2">
                            {section.description}
                          </div>
                          
                          {/* Stats Row */}
                          <div className="flex items-center gap-3 text-xs">
                            <span className={`${
                              stats.wordCount > 0 ? 'text-slate-700' : 'text-slate-400'
                            }`}>
                              {stats.wordCount} words
                            </span>
                            
                            {/* Show match count when searching */}
                            {localSearch && section.matchCount > 0 && (
                              <span className="flex items-center gap-1 text-blue-600 font-medium">
                                <Search className="w-3 h-3" />
                                {section.matchCount}
                              </span>
                            )}
                            
                            {hasIssues && (
                              <span className="flex items-center gap-1 text-red-600">
                                <AlertCircle className="w-3 h-3" />
                                {stats.errorCount + stats.conflictCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="text-xs text-slate-600 space-y-1">
          <div className="flex items-center justify-between">
            <span>Total Words:</span>
            <span className="font-medium text-slate-900">
              {Object.values(sectionStats).reduce((sum, s) => sum + s.wordCount, 0)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Issues:</span>
            <span className={`font-medium ${
              Object.values(sectionStats).some(s => s.errorCount > 0 || s.conflictCount > 0)
                ? 'text-red-600'
                : 'text-green-600'
            }`}>
              {Object.values(sectionStats).reduce((sum, s) => sum + s.errorCount + s.conflictCount, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}