import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, FileJson, FileText, Sparkles, GitBranch, Library, Download, Shield } from 'lucide-react';
import { VariableLibrary, SchemaEditor, ProtocolDocument, DependencyGraph, ProtocolAudit, SettingsModal, DependencyModalAdvanced, VersionTagModal, SchemaGeneratorModal, SchemaTemplateLibrary, PrePublishValidationModal } from './components';
import { ProtocolUnifiedSidebar } from './components/ProtocolUnifiedSidebar';
import { useSchemaState, useProtocolState, useVersionControl } from './hooks';
import type { SchemaBlock, ConditionalDependency, SchemaTemplate } from './types';
import type { ProtocolAuditResult, AuditIssue } from './auditTypes';
import { getAllBlocks } from './utils';
import { PublishProtocolButton } from '../PublishProtocolButton';
import { VersionConflictModal } from '../VersionConflictModal';
import { canEditProtocolVersion, updateDataCollectionStats } from '../../utils/schemaLocking';
import { useProject } from '../../contexts/ProjectContext';
import { storage } from '../../utils/storageService';
import { migrateProjectProtocols } from '../../utils/protocolMigration';
import { runProtocolAudit } from './auditEngine';

interface ProtocolWorkbenchProps {
  initialProtocolId?: string;
  initialVersionId?: string;
  onNavigateToLibrary?: () => void;
}

export function ProtocolWorkbench({
  initialProtocolId,
  initialVersionId,
  onNavigateToLibrary,
}: ProtocolWorkbenchProps = {}) {
  const { t } = useTranslation('ui');
  const { currentProject } = useProject();
  
  // State management hooks
  const schemaState = useSchemaState();
  const protocolState = useProtocolState();
  const versionControl = useVersionControl();

  // Local UI state
  const [activeTab, setActiveTab] = useState<'schema' | 'dependencies' | 'protocol' | 'audit'>('protocol');
  const [selectedBlockForSettings, setSelectedBlockForSettings] = useState<SchemaBlock | null>(null);
  const [selectedBlockForDependency, setSelectedBlockForDependency] = useState<SchemaBlock | null>(null);
  const [selectedBlockForVersionTag, setSelectedBlockForVersionTag] = useState<SchemaBlock | null>(null);
  const [showSchemaGenerator, setShowSchemaGenerator] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [isLoadingProtocol, setIsLoadingProtocol] = useState(false);
  const [activeField, setActiveField] = useState<string>('protocolTitle');
  
  // NEW: Schema locking state
  const [showVersionConflict, setShowVersionConflict] = useState(false);
  const [currentProtocol, setCurrentProtocol] = useState<any>(null);
  const [currentVersion, setCurrentVersion] = useState<any>(null);
  const [isSchemaLocked, setIsSchemaLocked] = useState(false);
  
  // 🔄 AUTO-LOAD: Track if we've attempted auto-load
  const [hasAttemptedAutoLoad, setHasAttemptedAutoLoad] = useState(false);
  const [autoLoadedProtocol, setAutoLoadedProtocol] = useState<{
    protocolNumber: string;
    studyType: string;
  } | null>(null);

  // 🔄 Derive current protocol and version from versionControl state
  useEffect(() => {
    if (versionControl.currentProtocolId) {
      const protocol = versionControl.savedProtocols.find(p => p.id === versionControl.currentProtocolId);
      setCurrentProtocol(protocol || null);
      
      if (protocol && versionControl.currentVersionId) {
        const version = protocol.versions.find(v => v.id === versionControl.currentVersionId);
        setCurrentVersion(version || null);
      } else {
        setCurrentVersion(null);
      }
    } else {
      setCurrentProtocol(null);
      setCurrentVersion(null);
    }
  }, [versionControl.currentProtocolId, versionControl.currentVersionId, versionControl.savedProtocols]);

  // 🔄 AUTO-LOAD: Load project's protocol automatically if no initial IDs provided
  useEffect(() => {
    if (!initialProtocolId && !initialVersionId && currentProject && !hasAttemptedAutoLoad) {
      console.log('🔄 Auto-load check for project:', currentProject.name);
      setHasAttemptedAutoLoad(true);
      
      try {
        const protocols = storage.protocols.getAll(currentProject.id);
        
        if (protocols.length > 0) {
          // Get the most recently modified protocol
          const sortedProtocols = [...protocols].sort((a, b) => 
            new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime()
          );
          
          const mostRecentProtocol = sortedProtocols[0];
          
          // Get the latest non-archived version
          const activeVersions = mostRecentProtocol.versions.filter(v => 
            v.status !== 'archived'
          );
          
          if (activeVersions.length > 0) {
            const latestVersion = activeVersions[0]; // Already sorted by date
            
            console.log('✅ Auto-loading protocol:', {
              protocolNumber: mostRecentProtocol.protocolNumber,
              versionNumber: latestVersion.versionNumber,
              studyType: currentProject.studyDesign?.type
            });
            
            // Load the protocol
            setIsLoadingProtocol(true);
            const version = versionControl.loadProtocolVersion(
              mostRecentProtocol.id, 
              latestVersion.id
            );
            
            if (version) {
              // Load schema blocks
              schemaState.setSchemaBlocks(version.schemaBlocks || []);
              
              // Load protocol metadata and content
              protocolState.loadProtocol(
                version.metadata,
                version.protocolContent || {
                  primaryObjective: '',
                  secondaryObjectives: '',
                  inclusionCriteria: '',
                  exclusionCriteria: '',
                  statisticalPlan: '',
                }
              );
              
              // Check schema locking
              setCurrentProtocol(mostRecentProtocol);
              setCurrentVersion(version);
              setIsSchemaLocked(!canEditProtocolVersion(mostRecentProtocol, version));
              
              // Set auto-load info for UI banner
              setAutoLoadedProtocol({
                protocolNumber: mostRecentProtocol.protocolNumber,
                studyType: currentProject.studyDesign?.type || 'Unknown'
              });
              
              console.log('✅ Auto-load complete');
            }
            
            setIsLoadingProtocol(false);
          } else {
            console.log('ℹ️ No active versions found for protocol');
          }
        } else {
          console.log('ℹ️ No protocols found for project - showing blank state');
        }
      } catch (error) {
        console.error('❌ Auto-load failed:', error);
        setIsLoadingProtocol(false);
      }
    }
  }, [initialProtocolId, initialVersionId, currentProject, hasAttemptedAutoLoad]);

  // Load initial protocol if IDs are provided (existing logic)
  useEffect(() => {
    if (initialProtocolId && initialVersionId) {
      console.log('🔍 Loading specific protocol from library:', initialProtocolId, initialVersionId);
      setIsLoadingProtocol(true);
      
      // Clear any auto-loaded protocol state
      setAutoLoadedProtocol(null);
      
      const version = versionControl.loadProtocolVersion(initialProtocolId, initialVersionId);
      
      if (version) {
        console.log('✅ Loaded version data:', {
          protocolId: initialProtocolId,
          versionId: initialVersionId,
          hasSchemaBlocks: !!version.schemaBlocks,
          blockCount: version.schemaBlocks?.length || 0
        });
        
        // Load schema blocks
        schemaState.setSchemaBlocks(version.schemaBlocks || []);
        
        // Load protocol metadata and content
        protocolState.loadProtocol(
          version.metadata,
          version.protocolContent || {
            primaryObjective: '',
            secondaryObjectives: '',
            inclusionCriteria: '',
            exclusionCriteria: '',
            statisticalPlan: '',
          }
        );
        
        // Check schema locking
        const protocol = storage.protocols.getById(initialProtocolId, currentProject?.id);
        if (protocol) {
          setCurrentProtocol(protocol);
          setCurrentVersion(version);
          setIsSchemaLocked(!canEditProtocolVersion(protocol, version));
        }
        
        console.log('✅ Protocol loaded successfully from library');
      } else {
        console.error('❌ No version found for:', initialProtocolId, initialVersionId);
        alert('Failed to load protocol. It may have been deleted.');
      }
      
      setIsLoadingProtocol(false);
    }
  }, [initialProtocolId, initialVersionId]);

  // Handle duplicate block
  const handleDuplicateBlock = (block: SchemaBlock) => {
    const newBlock = {
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      variable: { ...block.variable, name: `${block.variable.name} (Copy)` },
      children: undefined, // Don't duplicate children for now
    };
    schemaState.addBlockDirectly(newBlock);
  };

  // Handle generated schema
  const handleSchemaGenerated = (blocks: SchemaBlock[]) => {
    blocks.forEach(block => schemaState.addBlockDirectly(block));
  };

  // Handle template loading
  const handleTemplateLoaded = (template: SchemaTemplate) => {
    // Recursively regenerate IDs for all blocks and their children
    const regenerateIds = (block: SchemaBlock): SchemaBlock => {
      const newBlock = {
        ...block,
        id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        children: block.children?.map(child => regenerateIds(child))
      };
      return newBlock;
    };

    // Load all template blocks with new IDs
    template.schemaBlocks.forEach(block => {
      const newBlock = regenerateIds(block);
      schemaState.addBlockDirectly(newBlock);
    });
  };

  // Handle dependency save
  const handleDependencySave = (blockId: string, conditionalDependencies: ConditionalDependency[]) => {
    schemaState.updateBlock(blockId, { conditionalDependencies });
  };

  // Handle version tag save
  const handleVersionTagSave = (blockId: string, versionTag: string | undefined, versionColor: 'blue' | 'green' | 'purple' | 'amber' | undefined) => {
    schemaState.updateBlock(blockId, { versionTag, versionColor });
  };

  // Handle save
  const handleSave = (status: 'draft' | 'published' = 'draft') => {
    const { protocolTitle, protocolNumber } = protocolState.protocolMetadata;

    if (!protocolTitle || !protocolNumber) {
      alert('Please enter Protocol Title and Protocol Number before saving');
      return;
    }

    // If we're editing an existing protocol, pass the protocol ID to maintain the same protocol
    versionControl.saveProtocol(
      protocolTitle,
      protocolNumber,
      schemaState.schemaBlocks,
      protocolState.protocolMetadata,
      protocolState.protocolContent,
      status,
      initialProtocolId // Pass the protocol ID if we're editing
    );
  };

  // Export JSON helper function
  const handleExportJSON = () => {
    const { generateNestedJSON } = require('./utils');
    const json = generateNestedJSON(schemaState.schemaBlocks);
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `protocol-schema-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import JSON helper function with data overwrite protection
  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const jsonData = JSON.parse(text);
        
        // Validate and import
        const { validateAndImportSchema, regenerateBlockIds } = require('./utils');
        const result = validateAndImportSchema(jsonData);
        
        if (!result.valid || !result.blocks) {
          alert(`Failed to import schema:\n${result.errors.join('\n')}`);
          return;
        }

        // If we have existing blocks, ask for confirmation
        if (schemaState.schemaBlocks.length > 0) {
          const overwrite = confirm(
            `You already have ${schemaState.schemaBlocks.length} schema blocks. ` +
            `Do you want to replace them with ${result.blocks.length} blocks from the imported file?\n\n` +
            `Click OK to overwrite or Cancel to keep current blocks.`
          );
          
          if (!overwrite) return;
        }

        // Replace schema blocks
        schemaState.setSchemaBlocks(result.blocks);
        alert(`Successfully imported ${result.blocks.length} schema blocks!`);
      } catch (error) {
        alert(`Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    input.click();
  };

  // Listen for events from Global Header - MOVED TO TOP LEVEL SO IT WORKS ON ALL TABS
  useEffect(() => {
    const handleSaveDraftEvent = () => {
      handleSave('draft');
    };

    const handleShowTemplates = () => {
      setShowTemplateLibrary(true);
    };

    const handleShowGenerator = () => {
      setShowSchemaGenerator(true);
    };

    const handleExport = () => {
      handleExportJSON();
    };

    const handleImport = () => {
      handleImportJSON();
    };

    window.addEventListener('protocol-save-draft', handleSaveDraftEvent);
    window.addEventListener('protocol-show-templates', handleShowTemplates);
    window.addEventListener('protocol-show-ai-generator', handleShowGenerator);
    window.addEventListener('protocol-export-schema', handleExport);
    window.addEventListener('protocol-import-schema', handleImport);

    return () => {
      window.removeEventListener('protocol-save-draft', handleSaveDraftEvent);
      window.removeEventListener('protocol-show-templates', handleShowTemplates);
      window.removeEventListener('protocol-show-ai-generator', handleShowGenerator);
      window.removeEventListener('protocol-export-schema', handleExport);
      window.removeEventListener('protocol-import-schema', handleImport);
    };
  }, [schemaState.schemaBlocks, protocolState.protocolMetadata, protocolState.protocolContent, initialProtocolId]);

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Protocol Version Selector & Actions Bar */}
      {versionControl.savedProtocols.length > 0 && (
        <div className="bg-white border-b border-slate-200">
          {/* Removed toolbar - protocol/version selection now handled in GlobalHeader */}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 px-6 py-3 bg-white border-b border-slate-200">
        <button
          onClick={() => setActiveTab('protocol')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'protocol'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-slate-600 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <FileText className="w-4 h-4" />
          {t('protocolWorkbench.tabs.protocolDocument')}
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'schema'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-slate-600 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <Library className="w-4 h-4" />
          {t('protocolWorkbench.tabs.schemaBuilder')}
        </button>
        <button
          onClick={() => setActiveTab('dependencies')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'dependencies'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-slate-600 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          {t('protocolWorkbench.tabs.dependencies')}
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'audit'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-slate-600 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <Shield className="w-4 h-4" />
          {t('protocolWorkbench.tabs.audit')}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'schema' ? (
          <>
            <VariableLibrary
              onAddVariable={schemaState.addBlock}
              selectedParentId={null}
            />
            <SchemaEditor
              schemaBlocks={schemaState.schemaBlocks}
              hoveredBlockId={schemaState.hoveredBlockId}
              onHoverBlock={schemaState.setHoveredBlockId}
              onUpdateBlock={schemaState.updateBlock}
              onRemoveBlock={schemaState.removeBlock}
              onToggleExpanded={schemaState.toggleExpanded}
              onReorderBlocks={schemaState.reorderBlocks}
              onShowSettings={setSelectedBlockForSettings}
              onShowDependencies={setSelectedBlockForDependency}
              onShowVersionTag={setSelectedBlockForVersionTag}
              onDuplicate={handleDuplicateBlock}
              onShowSchemaGenerator={() => setShowSchemaGenerator(true)}
              onShowTemplateLibrary={() => setShowTemplateLibrary(true)}
              onSaveDraft={() => handleSave('draft')}
            />
            <ProtocolUnifiedSidebar
              activeTab={activeTab}
              schemaBlocks={schemaState.schemaBlocks}
              protocolMetadata={protocolState.protocolMetadata}
              protocolContent={protocolState.protocolContent}
              studyType={currentProject?.studyDesign?.type}
            />
          </>
        ) : activeTab === 'dependencies' ? (
          <DependencyGraph
            schemaBlocks={schemaState.schemaBlocks}
          />
        ) : activeTab === 'audit' ? (
          <ProtocolAudit
            protocolMetadata={protocolState.protocolMetadata}
            protocolContent={protocolState.protocolContent}
            schemaBlocks={schemaState.schemaBlocks}
            onNavigateToIssue={(issue: AuditIssue) => {
              // Navigate to the appropriate tab based on issue location
              setActiveTab(issue.location.tab as any);
              // Could add logic here to scroll to/highlight the specific field
            }}
          />
        ) : (
          <>
            <ProtocolDocument
              metadata={protocolState.protocolMetadata}
              content={protocolState.protocolContent}
              onUpdateMetadata={protocolState.updateMetadata}
              onUpdateContent={protocolState.updateContent}
              activeField={activeField}
              onActiveFieldChange={setActiveField}
            />
            <ProtocolUnifiedSidebar
              activeTab={activeTab}
              schemaBlocks={schemaState.schemaBlocks}
              protocolMetadata={protocolState.protocolMetadata}
              protocolContent={protocolState.protocolContent}
              studyType={currentProject?.studyDesign?.type}
              activeField={activeField}
              onUpdateMetadata={protocolState.updateMetadata}
              onUpdateContent={protocolState.updateContent}
              onNavigateToSection={(section) => {
                // Could add logic to scroll to specific section in ProtocolDocument
                console.log('Navigate to section:', section);
              }}
            />
          </>
        )}
      </div>

      {/* Modals */}
      {selectedBlockForSettings && (
        <SettingsModal
          block={selectedBlockForSettings}
          onClose={() => setSelectedBlockForSettings(null)}
          onSave={schemaState.updateBlock}
        />
      )}

      {selectedBlockForDependency && (
        <DependencyModalAdvanced
          block={selectedBlockForDependency}
          allBlocks={schemaState.schemaBlocks}
          onClose={() => setSelectedBlockForDependency(null)}
          onSave={handleDependencySave}
        />
      )}

      {selectedBlockForVersionTag && (
        <VersionTagModal
          block={selectedBlockForVersionTag}
          onClose={() => setSelectedBlockForVersionTag(null)}
          onSave={handleVersionTagSave}
        />
      )}

      {showSchemaGenerator && (
        <SchemaGeneratorModal
          onClose={() => setShowSchemaGenerator(false)}
          onGenerate={handleSchemaGenerated}
        />
      )}

      {showTemplateLibrary && (
        <SchemaTemplateLibrary
          currentSchemaBlocks={schemaState.schemaBlocks}
          onClose={() => setShowTemplateLibrary(false)}
          onLoadTemplate={handleTemplateLoaded}
        />
      )}
      
      {/* NEW: Version Conflict Modal */}
      {showVersionConflict && (
        <VersionConflictModal
          protocol={currentProtocol}
          version={currentVersion}
          onClose={() => setShowVersionConflict(false)}
        />
      )}
    </div>
  );
}