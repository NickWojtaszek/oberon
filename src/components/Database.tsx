import { Download, Plus, GitBranch, AlertTriangle, Table2, Edit, Search, Layers, BarChart3, Database as DatabaseIcon, X } from 'lucide-react';
import { SchemaView, DataEntryView, DataBrowserView, QueryView, useDatabase } from './database/index';
import { Analytics } from './Analytics';
import { ContentContainer } from './ui/ContentContainer';
import { ModulePersonaPanel } from './ai-personas/ui/ModulePersonaPanel';
import { useProject } from '../contexts/ProtocolContext';
import { getRecordsByProtocol, ClinicalDataRecord } from '../utils/dataStorage';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// Load Patient Confirmation Modal
interface LoadPatientConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSaveFirst?: () => void;
  patientId: string;
}

function LoadPatientConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  onSaveFirst,
  patientId
}: LoadPatientConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Load Different Patient?</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-slate-700 mb-2">
                You have unsaved changes in the current form.
              </p>
              <p className="text-slate-600 text-sm">
                Loading patient <span className="font-medium">{patientId}</span> will discard any unsaved data.
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Discard & Load
          </button>
        </div>
      </div>
    </div>
  );
}

interface DatabaseProps {
  initialProtocolId?: string;
  initialVersionId?: string;
}

export function Database({ initialProtocolId, initialVersionId }: DatabaseProps = {}) {
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
    loadProtocols,
    refreshProtocols
  } = useDatabase({ initialProtocolId, initialVersionId });

  // State for editing existing records from Data Browser
  const [selectedRecord, setSelectedRecord] = useState<ClinicalDataRecord | null>(null);

  // State to track if data entry form has unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // State for load patient confirmation
  const [showLoadConfirm, setShowLoadConfirm] = useState(false);
  const [pendingRecord, setPendingRecord] = useState<ClinicalDataRecord | null>(null);

  // Refresh protocols when component mounts (in case we just came from wizard)
  useEffect(() => {
    console.log('🗄️ [Database] Component mounted, refreshing protocols...');
    refreshProtocols();
  }, [refreshProtocols]);

  // Clear selected record when switching away from data-entry tab
  useEffect(() => {
    if (activeTab !== 'data-entry') {
      setSelectedRecord(null);
      setHasUnsavedChanges(false);
    }
  }, [activeTab]);

  // Handler for editing a record from the Data Browser
  const handleEditRecord = useCallback((record: ClinicalDataRecord) => {
    console.log('📝 [Database] Edit record requested:', record.recordId, 'hasUnsavedChanges:', hasUnsavedChanges);

    // If we're in data-entry and have unsaved changes, show confirmation
    if (activeTab === 'data-entry' && hasUnsavedChanges && selectedRecord?.recordId !== record.recordId) {
      setPendingRecord(record);
      setShowLoadConfirm(true);
      return;
    }

    // Otherwise, load the record directly
    setSelectedRecord(record);
    setActiveTab('data-entry');
    setHasUnsavedChanges(false);
  }, [activeTab, hasUnsavedChanges, selectedRecord?.recordId]);

  // Confirm loading the new patient (discard unsaved changes)
  const confirmLoadRecord = useCallback(() => {
    if (pendingRecord) {
      setSelectedRecord(pendingRecord);
      setActiveTab('data-entry');
      setHasUnsavedChanges(false);
    }
    setShowLoadConfirm(false);
    setPendingRecord(null);
  }, [pendingRecord]);

  // Handler for going back to browser from data entry
  const handleBackToBrowser = useCallback(() => {
    setSelectedRecord(null);
    setActiveTab('browser');
    setHasUnsavedChanges(false);
  }, []);

  // Callback for DataEntryForm to report unsaved changes
  const handleUnsavedChanges = useCallback((hasChanges: boolean) => {
    setHasUnsavedChanges(hasChanges);
  }, []);

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

  // Debug: Log database state for troubleshooting
  useEffect(() => {
    console.log('🗄️ [Database] State update:', {
      protocolId: selectedProtocolId,
      versionId: selectedVersionId,
      hasProtocol: !!selectedProtocol,
      hasVersion: !!selectedVersion,
      tablesCount: databaseTables.length,
      schemaBlocksCount: schemaBlocks.length,
      activeTab
    });
  }, [selectedProtocolId, selectedVersionId, selectedProtocol, selectedVersion, databaseTables.length, schemaBlocks.length, activeTab]);

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
                protocolStatus={selectedVersion?.status}
                onSave={loadProtocols}
                initialRecord={selectedRecord}
                onBackToBrowser={handleBackToBrowser}
                onUnsavedChanges={handleUnsavedChanges}
              />
            )}

            {activeTab === 'browser' && (
              <DataBrowserView
                protocolNumber={selectedVersion?.metadata.protocolNumber}
                protocolVersion={selectedVersion?.versionNumber}
                onEditRecord={handleEditRecord}
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

      {/* Load Patient Confirmation Modal */}
      <LoadPatientConfirmModal
        isOpen={showLoadConfirm}
        onClose={() => {
          setShowLoadConfirm(false);
          setPendingRecord(null);
        }}
        onConfirm={confirmLoadRecord}
        patientId={pendingRecord?.subjectId || ''}
      />
    </div>
  );
}