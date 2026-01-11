import { Download, Plus, GitBranch, AlertTriangle, Table2, Edit, Search, Layers, BarChart3, Database as DatabaseIcon } from 'lucide-react';
import { SchemaView, DataEntryView, DataBrowserView, QueryView, useDatabase } from './database/index';
import { Analytics } from './Analytics';
import { ContentContainer } from './ui/ContentContainer';
import { ModulePersonaPanel } from './ai-personas/ui/ModulePersonaPanel';
import { useProject } from '../contexts/ProtocolContext';
import { getRecordsByProtocol } from '../utils/dataStorage';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function Database() {
  const { t } = useTranslation('common');

  const {
    savedProtocols,
    selectedProtocolId,
    setSelectedProtocolId,
    selectedVersionId,
    setSelectedVersionId,
    selectedProtocol,
    selectedVersion,
    databaseTables,
    activeTab,
    setActiveTab,
    showFieldFilter,
    setShowFieldFilter,
    loadProtocols
  } = useDatabase();

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

  const project = useProject();
  
  // Get all data records for validation
  const dataRecords = useMemo(() => {
    if (!selectedVersion?.metadata.protocolNumber) return [];
    return getRecordsByProtocol(selectedVersion.metadata.protocolNumber, selectedVersion.versionNumber);
  }, [selectedVersion]);
  
  // Get schema blocks for validation
  const schemaBlocks = useMemo(() => {
    return selectedVersion?.schemaBlocks || [];
  }, [selectedVersion]);

  return (
    <div className="flex flex-col h-full">
      {/* Protocol Version Selector & Actions Bar */}
      <div className="bg-white border-b border-slate-200">
        {/* Removed toolbar - protocol/version selection now handled in GlobalHeader */}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-3">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('browser')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'browser'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Table2 className="w-4 h-4" />
              Data Browser
            </button>
            <button
              onClick={() => setActiveTab('data-entry')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'data-entry'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Edit className="w-4 h-4" />
              Data Entry
            </button>
            <button
              onClick={() => setActiveTab('query')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'query'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Search className="w-4 h-4" />
              Query & Export
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'schema'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Layers className="w-4 h-4" />
              Schema View
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area + Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <ContentContainer className="p-6">
            {activeTab === 'schema' && (
              <SchemaView 
                tables={databaseTables} 
                showFieldFilter={showFieldFilter}
                onFilterChange={setShowFieldFilter}
              />
            )}

            {activeTab === 'data-entry' && (
              <DataEntryView
                tables={databaseTables}
                protocolNumber={selectedVersion?.metadata.protocolNumber}
                protocolVersion={selectedVersion?.versionNumber}
                onSave={loadProtocols}
              />
            )}

            {activeTab === 'browser' && (
              <DataBrowserView
                protocolNumber={selectedVersion?.metadata.protocolNumber}
                protocolVersion={selectedVersion?.versionNumber}
                onEditRecord={() => setActiveTab('data-entry')}
              />
            )}

            {activeTab === 'query' && (
              <QueryView tables={databaseTables} />
            )}

            {activeTab === 'analytics' && (
              <Analytics 
                tables={databaseTables}
                protocolNumber={selectedVersion?.metadata.protocolNumber}
                protocolVersion={selectedVersion?.versionNumber}
              />
            )}
          </ContentContainer>
        </div>

        {/* AI Personas Panel with Data Quality - Always visible */}
        <ModulePersonaPanel 
          module="database"
          dataRecords={dataRecords}
          schemaBlocks={schemaBlocks}
          studyType={project.currentProject?.studyDesign?.type}
          onNavigateToIssue={(issue) => {
            console.log('Navigate to issue:', issue);
            setActiveTab('data-entry'); // Navigate to data entry for editing
          }}
          onNavigateToRecord={(recordId) => {
            console.log('Navigate to record:', recordId);
            setActiveTab('data-entry'); // Navigate to data entry for editing
          }}
        />
      </div>
    </div>
  );
}