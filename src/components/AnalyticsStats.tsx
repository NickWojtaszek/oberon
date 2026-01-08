// Analytics & Statistics Module
// Three-column layout: Schema Explorer | Analysis Workspace | Statistician's Workbench

import { useState, useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProject } from '../contexts/ProjectContext';
import { storage } from '../utils/storageService';
import { SchemaExplorer } from './analytics-stats/SchemaExplorer';
import { StatisticianWorkbench } from './analytics-stats/StatisticianWorkbench';
import { StatisticalAdvisorSidebar } from './ai-personas/personas/StatisticalAdvisor/StatisticalAdvisorSidebar';
import { DescriptiveStatsTab } from './analytics-stats/tabs/DescriptiveStatsTab';
import { ComparativeAnalysisTab } from './analytics-stats/tabs/ComparativeAnalysisTab';
import { AdvancedModelingTab } from './analytics-stats/tabs/AdvancedModelingTab';
import type { SavedProtocol, ProtocolVersion } from './protocol-workbench/types';
import type { AnalysisVariable, StatisticalManifest } from './analytics-stats/types';

type AnalysisTab = 'descriptive' | 'comparative' | 'advanced';

export function AnalyticsStats() {
  const { currentProject } = useProject();
  const { t } = useTranslation('common');

  // Protocol selection
  const [protocols, setProtocols] = useState<SavedProtocol[]>([]);
  const [selectedProtocolId, setSelectedProtocolId] = useState<string | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

  // Analysis state
  const [activeTab, setActiveTab] = useState<AnalysisTab>('descriptive');
  const [selectedVariableIds, setSelectedVariableIds] = useState<string[]>([]);
  const [predictor, setPredictor] = useState<AnalysisVariable | null>(null);
  const [outcome, setOutcome] = useState<AnalysisVariable | null>(null);

  // Load protocols
  useEffect(() => {
    if (!currentProject) {
      setProtocols([]);
      return;
    }

    const loadedProtocols = storage.protocols.getAll(currentProject.id);
    setProtocols(loadedProtocols);

    // Auto-select first published protocol
    if (loadedProtocols.length > 0 && !selectedProtocolId) {
      const firstProtocol = loadedProtocols[0];
      setSelectedProtocolId(firstProtocol.id);

      // Auto-select most recent published version
      const publishedVersions = firstProtocol.versions.filter(v => v.status === 'published');
      if (publishedVersions.length > 0) {
        setSelectedVersionId(publishedVersions[publishedVersions.length - 1].id);
      } else if (firstProtocol.versions.length > 0) {
        setSelectedVersionId(firstProtocol.versions[0].id);
      }
    }
  }, [currentProject]);

  // Get selected protocol and version
  const selectedProtocol = protocols.find(p => p.id === selectedProtocolId) || null;
  const selectedVersion = selectedProtocol?.versions.find(v => v.id === selectedVersionId);

  // Get selected variables as AnalysisVariable objects
  const selectedVariables = useMemo(() => {
    if (!selectedVersion) return [];
    
    const allBlocks = flattenBlocks(selectedVersion.schemaBlocks);
    return allBlocks
      .filter(block => selectedVariableIds.includes(block.id) && block.dataType !== 'Section')
      .map(block => ({
        id: block.id,
        name: block.variable.name,
        label: block.customName || block.variable.name || 'Unnamed Variable',
        dataType: block.dataType as any,
        role: determineRole(block),
        unit: block.unit,
        section: findSectionName(block.id, selectedVersion.schemaBlocks)
      }));
  }, [selectedVersion, selectedVariableIds]);

  const handleVariableToggle = (variableId: string) => {
    setSelectedVariableIds(prev => 
      prev.includes(variableId)
        ? prev.filter(id => id !== variableId)
        : [...prev, variableId]
    );
  };

  const handleExportToManuscript = () => {
    if (!selectedVersion || !currentProject) return;

    // Generate statistical manifest
    const manifest: StatisticalManifest = {
      manifestMetadata: {
        projectId: currentProject.id,
        protocolId: selectedProtocol?.id || '',
        protocolVersion: selectedVersion.versionNumber,
        generatedAt: Date.now(),
        generatedBy: 'Unknown User',
        totalRecordsAnalyzed: 0, // Will be calculated
        personaValidation: 'System-Built Statistician v1.0',
        // NEW: Initialize as unlocked
        locked: false,
      },
      descriptiveStats: [],
      comparativeAnalyses: [],
      correlations: [],
      regressions: [],
      manuscriptSnippets: {
        methods: generateMethodsSnippet(selectedVariables),
        results: 'Results pending calculation.',
        tables: [],
        figures: []
      }
    };

    // Save manifest
    storage.statisticalManifests.save(manifest, currentProject.id);

    alert('Statistical analysis exported to manuscript! Navigate to Academic Writing tab to view.');
  };

  const getStatusBadge = (status: 'published' | 'draft' | 'archived') => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">Published</span>;
      case 'draft':
        return <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">Draft</span>;
      case 'archived':
        return <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">Archived</span>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Protocol/Version Selector Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-end gap-4 flex-1">
            {protocols.length > 0 ? (
              <>
                {/* Protocol Selector */}
                <div className="flex-1 max-w-md">
                  <label className="block text-xs font-medium text-slate-600 mb-2">{t('labels.protocol')}</label>
                  <select
                    value={selectedProtocolId || ''}
                    onChange={(e) => {
                      setSelectedProtocolId(e.target.value);
                      const protocol = protocols.find(p => p.id === e.target.value);
                      if (protocol && protocol.versions.length > 0) {
                        const published = protocol.versions.filter(v => v.status === 'published');
                        if (published.length > 0) {
                          setSelectedVersionId(published[published.length - 1].id);
                        } else {
                          setSelectedVersionId(protocol.versions[0].id);
                        }
                      }
                    }}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {protocols.map(protocol => {
                      const number = protocol.protocolNumber || protocol.studyNumber || 'N/A';
                      const title = protocol.name || 'Untitled';
                      return (
                        <option key={protocol.id} value={protocol.id}>
                          {number} - {title}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Version Selector */}
                {selectedProtocol && selectedProtocol.versions.length > 0 && (
                  <div className="flex-1 max-w-md">
                    <label className="block text-xs font-medium text-slate-600 mb-2">Version</label>
                    <select
                      value={selectedVersionId || ''}
                      onChange={(e) => setSelectedVersionId(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {selectedProtocol.versions
                        .filter(v => v.status !== 'archived')
                        .map(version => (
                          <option key={version.id} value={version.id}>
                            v{version.versionNumber} - {version.status} - {version.metadata.protocolTitle}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* Version Badge */}
                {selectedVersion && (
                  <div className="flex items-center gap-2 pb-1">
                    <GitBranch className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">v{selectedVersion.versionNumber}</span>
                    {getStatusBadge(selectedVersion.status)}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-auto">
                  <button 
                    className="px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700"
                    onClick={() => {
                      console.log('Export data');
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Export Data
                  </button>
                </div>
              </>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-amber-900">No Protocols Found</div>
                    <div className="text-sm text-amber-700 mt-1">
                      Create a protocol in the Protocol Workbench to analyze data.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      {selectedVersion && (
        <div className="bg-white border-b border-slate-200">
          <div className="px-8 py-3">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('descriptive')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'descriptive'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Descriptive Stats
              </button>
              <button
                onClick={() => setActiveTab('comparative')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'comparative'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <GitBranch className="w-4 h-4" />
                Comparative Analysis
              </button>
              <button
                onClick={() => setActiveTab('advanced')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'advanced'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <FileText className="w-4 h-4" />
                Advanced Modeling
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Three-column layout */}
      {selectedVersion ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Left Column: Schema Explorer */}
          <div className="w-80 flex-shrink-0">
            <SchemaExplorer
              schemaBlocks={selectedVersion.schemaBlocks}
              selectedVariables={selectedVariableIds}
              onVariableToggle={handleVariableToggle}
            />
          </div>

          {/* Center Column: Analysis Workspace */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'descriptive' && (
              <DescriptiveStatsTab
                selectedVariables={selectedVariables}
                protocolVersion={selectedVersion}
                projectId={currentProject?.id || ''}
              />
            )}
            {activeTab === 'comparative' && (
              <ComparativeAnalysisTab
                selectedVariables={selectedVariables}
                protocolVersion={selectedVersion}
                projectId={currentProject?.id || ''}
                predictor={predictor}
                outcome={outcome}
                onPredictorChange={setPredictor}
                onOutcomeChange={setOutcome}
              />
            )}
            {activeTab === 'advanced' && (
              <AdvancedModelingTab
                selectedVariables={selectedVariables}
                protocolVersion={selectedVersion}
                projectId={currentProject?.id || ''}
              />
            )}
          </div>

          {/* Right Column: Statistician's Workbench */}
          <StatisticalAdvisorSidebar
            statisticalManifest={{
              // Pass minimal manifest for now - will be enhanced with actual analysis plan
              targetSampleSize: 0,
              primaryEndpoint: selectedVariables.find(v => v.role === 'Outcome') ? {
                name: selectedVariables.find(v => v.role === 'Outcome')?.name,
                type: 'continuous',
                measurementMethod: undefined,
                timePoint: undefined
              } : undefined,
              secondaryEndpoints: [],
              primaryAnalysisMethod: undefined,
              analysisSets: [],
              // Metadata from selected protocol
              protocolNumber: selectedVersion.metadata.protocolNumber,
              protocolTitle: selectedVersion.metadata.protocolTitle,
            }}
            studyType={currentProject?.studyDesign?.type}
            onNavigateToSection={(section) => {
              console.log('Navigate to section:', section);
            }}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-96">
          <div className="text-center text-slate-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>Select a protocol to begin statistical analysis</p>
          </div>
        </div>
      )}

      {/* Audit Log Footer */}
      {selectedVersion && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-slate-300 px-8 py-2 text-xs border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              Last Calculation: {new Date().toLocaleDateString()} | User: Unknown | Persona: System-Validated
            </div>
            <div>
              Protocol: {selectedVersion.metadata.protocolNumber} v{selectedVersion.versionNumber}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions (same as SchemaExplorer)
function flattenBlocks(blocks: any[]): any[] {
  const result: any[] = [];
  function traverse(block: any) {
    result.push(block);
    if (block.children) block.children.forEach(traverse);
  }
  blocks.forEach(traverse);
  return result;
}

function determineRole(block: any): string {
  const role = block.role?.toLowerCase() || '';
  const name = block.variable.name.toLowerCase();
  if (role.includes('endpoint') || role.includes('outcome')) return 'Outcome';
  if (role.includes('predictor') || role.includes('exposure')) return 'Predictor';
  return 'Covariate';
}

function findSectionName(blockId: string, blocks: any[]): string {
  function find(blocks: any[], targetId: string, currentSection: string = 'Uncategorized'): string {
    for (const block of blocks) {
      if (block.id === targetId) return currentSection;
      if (block.children) {
        const sectionName = block.dataType === 'Section' ? (block.customName || block.variable.name || 'Unnamed Section') : currentSection;
        const found = find(block.children, targetId, sectionName);
        if (found !== 'Uncategorized') return found;
      }
    }
    return currentSection;
  }
  return find(blocks, blockId);
}

function generateMethodsSnippet(variables: AnalysisVariable[]): string {
  const continuous = variables.filter(v => v.dataType === 'Numeric').length;
  const categorical = variables.filter(v => v.dataType === 'Text' || v.dataType === 'Boolean').length;
  
  return `Data analysis was performed using the Clinical Intelligence Engine v1.0. ${
    continuous > 0 ? `Continuous variables (n=${continuous}) were expressed as mean ± SD and median (IQR). ` : ''
  }${
    categorical > 0 ? `Categorical variables (n=${categorical}) were compared using Fisher's exact test or chi-square test as appropriate. ` : ''
  }Statistical significance was defined as p < 0.05.`;
}