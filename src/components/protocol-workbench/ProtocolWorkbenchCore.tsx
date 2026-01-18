import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, FileJson, FileText, Sparkles, GitBranch, Library, Download, Shield, Target, Database } from 'lucide-react';
import { Switch } from '../ui/switch';
import { VariableLibrary, SchemaEditor, ProtocolDocument, DependencyGraph, ProtocolAudit, SettingsModal, DependencyModalAdvanced, VersionTagModal, SchemaGeneratorModal, SchemaTemplateLibrary, PrePublishValidationModal } from './components';
import { ProtocolSelectionModal } from './components/modals/ProtocolSelectionModal';
import { SaveDraftModal } from './components/modals/SaveDraftModal';
import { DeployToDatabaseModal } from './components/modals/DeployToDatabaseModal';
import { PostPublishModal } from './components/modals/PostPublishModal';
import { ProtocolUnifiedSidebar } from './components/ProtocolUnifiedSidebar';
import { PICOHistoryTab } from './components/PICOHistoryTab';
import { useSchemaState, useProtocolState, useVersionControl } from './hooks';
import type { SchemaBlock, ConditionalDependency, SchemaTemplate } from './types';
import type { ProtocolAuditResult, AuditIssue } from './auditTypes';
import { getAllBlocks, validateAndImportSchema, getAllSections, getBlockPosition } from './utils';
import { PublishProtocolButton } from '../PublishProtocolButton';
import { VersionConflictModal } from '../VersionConflictModal';
import { canEditProtocolVersion, updateDataCollectionStats } from '../../utils/schemaLocking';
import { storage } from '../../utils/storageService';
import { migrateProjectProtocols } from '../../utils/protocolMigration';
import { runProtocolAudit } from './auditEngine';

interface ProtocolWorkbenchProps {
  initialProtocolId?: string;
  initialVersionId?: string;
  onNavigateToLibrary?: () => void;
  onNavigateToDatabase?: (protocolId: string, versionId: string) => void;
}

export function ProtocolWorkbench({
  initialProtocolId,
  initialVersionId,
  onNavigateToLibrary,
  onNavigateToDatabase,
}: ProtocolWorkbenchProps = {}) {
  const { t } = useTranslation('ui');

  // State management hooks
  const schemaState = useSchemaState();
  const protocolState = useProtocolState();
  const versionControl = useVersionControl();

  // Local UI state
  const [activeTab, setActiveTab] = useState<'schema' | 'dependencies' | 'protocol' | 'audit' | 'pico'>('protocol');
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

  // 🆕 Protocol Selection Modal
  const [showProtocolSelector, setShowProtocolSelector] = useState(false);

  // 🆕 Save Draft Modal
  const [showSaveDraftModal, setShowSaveDraftModal] = useState(false);

  // 🆕 Deploy to Database Modal
  const [showDeployModal, setShowDeployModal] = useState(false);

  // 🆕 Post-Publish Modal
  const [showPostPublishModal, setShowPostPublishModal] = useState(false);

  // ✨ AI Suggestions State
  const [aiSuggestionsEnabled, setAiSuggestionsEnabled] = useState(true);
  const [protocolDocumentText, setProtocolDocumentText] = useState<string | undefined>(undefined);
  const [protocolFileName, setProtocolFileName] = useState<string | undefined>(undefined);

  // Prepare protocol context for AI suggestions
  const protocolContext = useMemo(() => {
    return {
      primaryObjective: protocolState.protocolContent.primaryObjective,
      secondaryObjectives: protocolState.protocolContent.secondaryObjectives,
      statisticalPlan: protocolState.protocolContent.statisticalPlan,
      studyPhase: protocolState.protocolMetadata.studyPhase,
      therapeuticArea: protocolState.protocolMetadata.therapeuticArea,
      fullProtocolText: protocolDocumentText,
      existingFields: schemaState.schemaBlocks.map(block => ({
        name: block.variable.name,
        role: block.role as string,
        endpointTier: block.endpointTier || null
      }))
    };
  }, [
    protocolState.protocolContent,
    protocolState.protocolMetadata,
    protocolDocumentText,
    schemaState.schemaBlocks
  ]);

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

  // 🔄 PROTOCOL SELECTOR: Show modal if no initial IDs provided and protocols exist
  useEffect(() => {
    if (!initialProtocolId && !initialVersionId && !hasAttemptedAutoLoad) {
      console.log('🔄 Protocol selector check');
      setHasAttemptedAutoLoad(true);

      try {
        const protocols = storage.protocols.getAll();

        if (protocols.length > 0) {
          // Show protocol selection modal
          console.log('📋 Showing protocol selection modal (', protocols.length, 'protocols available)');
          setShowProtocolSelector(true);
        } else {
          console.log('ℹ️ No protocols found - showing blank state');
        }
      } catch (error) {
        console.error('❌ Error checking protocols:', error);
      }
    }
  }, [initialProtocolId, initialVersionId, hasAttemptedAutoLoad]);

  // 🔄 PROTOCOL LOAD FUNCTION (used by modal and initial ID loading)
  const loadProtocol = (protocolId: string, versionId: string) => {
    console.log('📂 Loading protocol:', { protocolId, versionId });
    setIsLoadingProtocol(true);

    try {
      const version = versionControl.loadProtocolVersion(protocolId, versionId);

      if (version) {
        const protocol = versionControl.savedProtocols.find(p => p.id === protocolId);

        console.log('📦 [loadProtocol] Version and Protocol data:', {
          versionId: version.id,
          hasMetadata: !!version.metadata,
          metadataTitle: version.metadata?.protocolTitle,
          protocolTitle: protocol?.protocolTitle,
          protocolNumber: protocol?.protocolNumber
        });

        // Load schema blocks
        schemaState.setSchemaBlocks(version.schemaBlocks || []);

        // Build metadata - prefer version.metadata, but fallback to protocol-level fields
        const metadata = {
          protocolTitle: version.metadata?.protocolTitle || protocol?.protocolTitle || '',
          protocolNumber: version.metadata?.protocolNumber || protocol?.protocolNumber || '',
          principalInvestigator: version.metadata?.principalInvestigator || '',
          sponsor: version.metadata?.sponsor || '',
          studyPhase: version.metadata?.studyPhase || '',
          therapeuticArea: version.metadata?.therapeuticArea || '',
          estimatedEnrollment: version.metadata?.estimatedEnrollment || '',
          studyDuration: version.metadata?.studyDuration || '',
        };

        // Load protocol content
        protocolState.loadProtocol(
          metadata,
          {
            primaryObjective: typeof version.protocolContent?.primaryObjective === 'string' ? version.protocolContent.primaryObjective : '',
            secondaryObjectives: typeof version.protocolContent?.secondaryObjectives === 'string' ? version.protocolContent.secondaryObjectives : '',
            inclusionCriteria: typeof version.protocolContent?.inclusionCriteria === 'string' ? version.protocolContent.inclusionCriteria : '',
            exclusionCriteria: typeof version.protocolContent?.exclusionCriteria === 'string' ? version.protocolContent.exclusionCriteria : '',
            statisticalPlan: typeof version.protocolContent?.statisticalPlan === 'string' ? version.protocolContent.statisticalPlan : '',
          }
        );

        // Check schema locking
        if (protocol) {
          setCurrentProtocol(protocol);
          setCurrentVersion(version);
          setIsSchemaLocked(!canEditProtocolVersion(version, protocol.protocolNumber, protocol.id).canEdit);

          // Set auto-load info for UI banner
          setAutoLoadedProtocol({
            protocolNumber: protocol.protocolNumber,
            studyType: protocol.studyMethodology?.studyType || 'Unknown'
          });
        }

        console.log('✅ Protocol loaded successfully');
      }
    } catch (error) {
      console.error('❌ Error loading protocol:', error);
    } finally {
      setIsLoadingProtocol(false);
    }
  };

  // Load protocol when initial IDs are provided
  useEffect(() => {
    if (initialProtocolId && initialVersionId && currentProject && !hasAttemptedAutoLoad) {
      console.log('🔄 Loading protocol from initial IDs');
      setHasAttemptedAutoLoad(true);
      loadProtocol(initialProtocolId, initialVersionId);
    }
  }, [initialProtocolId, initialVersionId, hasAttemptedAutoLoad]);

  // Handle protocol selection modal actions
  const handleCreateNew = () => {
    console.log('➕ Creating new protocol');
    setShowProtocolSelector(false);
    // Clear any existing protocol
    schemaState.clearSchema();
    protocolState.resetProtocol();
    versionControl.setCurrentProtocolId(null);
    versionControl.setCurrentVersionId(null);
    setAutoLoadedProtocol(null);
  };

  const handleLoadExisting = (protocolId: string, versionId: string) => {
    console.log('📂 Loading existing protocol from modal');
    setShowProtocolSelector(false);
    loadProtocol(protocolId, versionId);
  };

  // REMOVED: Duplicate useEffect that was causing race conditions
  // Protocol loading is now handled ONLY by the loadProtocol() function
  // which is called from the useEffect above (lines 185-191)

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

    // For draft saves, show modal with details
    if (status === 'draft') {
      setShowSaveDraftModal(true);
      return;
    }

    // For published saves, proceed directly (handled by PublishProtocolButton)
    performSave(status);
  };

  // Actual save logic (separated for reuse)
  const performSave = (status: 'draft' | 'published' = 'draft') => {
    const { protocolTitle, protocolNumber } = protocolState.protocolMetadata;

    // Use currentProtocolId from versionControl state (updates after saves) OR initialProtocolId from props
    const protocolIdToUse = versionControl.currentProtocolId || initialProtocolId;

    console.log('💾 [Manual Save] Saving protocol:', {
      protocolTitle,
      protocolNumber,
      status,
      protocolIdToUse,
      willUpdateExisting: !!protocolIdToUse
    });

    // If we're editing an existing protocol, pass the protocol ID to maintain the same protocol
    versionControl.saveProtocol(
      protocolTitle,
      protocolNumber,
      schemaState.schemaBlocks,
      protocolState.protocolMetadata,
      protocolState.protocolContent,
      status,
      protocolIdToUse // Pass the protocol ID if we're editing
    );

    // Show post-publish modal after successful publish
    if (status === 'published') {
      setTimeout(() => setShowPostPublishModal(true), 500);
    }
  };

  const handleConfirmSaveDraft = () => {
    performSave('draft');
    setShowSaveDraftModal(false);
  };

  // Handle Deploy to Database
  const handleDeployToDatabase = () => {
    // Save first if needed
    const { protocolTitle, protocolNumber } = protocolState.protocolMetadata;
    const protocolIdToUse = versionControl.currentProtocolId || initialProtocolId;

    if (protocolTitle && protocolNumber) {
      // Save as draft before deploying
      versionControl.saveProtocol(
        protocolTitle,
        protocolNumber,
        schemaState.schemaBlocks,
        protocolState.protocolMetadata,
        protocolState.protocolContent,
        'draft',
        protocolIdToUse
      );
    }

    setShowDeployModal(false);

    // Navigate to Database module with protocol pre-selected
    if (onNavigateToDatabase && protocolIdToUse && versionControl.currentVersionId) {
      onNavigateToDatabase(protocolIdToUse, versionControl.currentVersionId);
    }
  };

  // Validation errors for deployment
  const getDeployValidationErrors = (): string[] => {
    const errors: string[] = [];
    const allBlocks = getAllBlocks(schemaState.schemaBlocks);

    // Check for duplicate variable names
    const variableNames = allBlocks.map(b => b.variable.name.toLowerCase());
    const duplicates = variableNames.filter((name, index) => variableNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate variable names: ${[...new Set(duplicates)].join(', ')}`);
    }

    // Check for empty variable names
    const emptyNames = allBlocks.filter(b => !b.variable.name.trim());
    if (emptyNames.length > 0) {
      errors.push(`${emptyNames.length} field(s) have empty names`);
    }

    return errors;
  };

  // === AUTO-SAVE: Save draft on metadata/content change (debounced) ===
  useEffect(() => {
    // 🛡️ GUARD: Skip auto-save while loading a protocol (prevents race condition)
    if (isLoadingProtocol) {
      console.log('⏸️  [Auto-save] Skipped - loading in progress');
      return;
    }

    const { protocolTitle, protocolNumber } = protocolState.protocolMetadata;

    // Use currentProtocolId from versionControl state (updates after saves) OR initialProtocolId from props
    const protocolIdToUse = versionControl.currentProtocolId || initialProtocolId;

    console.log('⏱️  [Auto-save] Effect triggered', {
      hasTitle: !!protocolTitle,
      hasNumber: !!protocolNumber,
      protocolId: protocolIdToUse,
      source: versionControl.currentProtocolId ? 'versionControl.currentProtocolId' : 'initialProtocolId'
    });

    // Only auto-save if title and number are present
    if (!protocolTitle || !protocolNumber) {
      console.warn('⚠️  [Auto-save] Skipped - missing title or number');
      return;
    }

    // Debounce the save
    const timeoutId = setTimeout(() => {
      console.log('💾 [Auto-save] Saving draft:', {
        protocolTitle,
        protocolNumber,
        protocolIdToUse,
        willUpdateExisting: !!protocolIdToUse
      });
      versionControl.saveProtocol(
        protocolTitle,
        protocolNumber,
        schemaState.schemaBlocks,
        protocolState.protocolMetadata,
        protocolState.protocolContent,
        'draft',
        protocolIdToUse
      );
    }, 1200);

    return () => clearTimeout(timeoutId);
  }, [
    isLoadingProtocol,
    protocolState.protocolMetadata,
    protocolState.protocolContent,
    schemaState.schemaBlocks,
    initialProtocolId,
    versionControl.currentProtocolId,
  ]);

  // Export JSON helper function
  const handleExportJSON = () => {
    // Export the actual schema blocks, not the nested data template
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      protocolTitle: protocolState.protocolMetadata.protocolTitle || 'Untitled Protocol',
      schemaBlocks: schemaState.schemaBlocks,
      metadata: {
        blockCount: schemaState.schemaBlocks.length,
        totalFields: getAllBlocks(schemaState.schemaBlocks).length,
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
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

        // Validate and import using imported function
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
        <button
          onClick={() => setActiveTab('pico')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'pico'
              ? 'bg-purple-50 text-purple-700 border border-purple-200'
              : 'text-slate-600 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <Target className="w-4 h-4" />
          PICO
        </button>

        {/* Spacer to push Deploy button to the right */}
        <div className="flex-1" />

        {/* Deploy to Database Button */}
        <button
          onClick={() => setShowDeployModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          <Database className="w-4 h-4" />
          Deploy to Database
        </button>
      </div>

      {/* AI Assistant Toggle (only shown on schema tab) */}
      {activeTab === 'schema' && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  AI Configuration Assistant
                </div>
                <div className="text-xs text-slate-600">
                  Dr. Puck analyzes your protocol to suggest optimal field settings
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-700">
                {aiSuggestionsEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <Switch
                checked={aiSuggestionsEnabled}
                onCheckedChange={setAiSuggestionsEnabled}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
          </div>
        </div>
      )}

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
              aiSuggestionsEnabled={aiSuggestionsEnabled}
              protocolContext={protocolContext}
            />
            <ProtocolUnifiedSidebar
              activeTab={activeTab}
              schemaBlocks={schemaState.schemaBlocks}
              protocolMetadata={protocolState.protocolMetadata}
              protocolContent={protocolState.protocolContent}
              studyType={currentProtocol?.studyMethodology?.studyType}
              onProtocolExtracted={(extractedText, fileName) => {
                setProtocolDocumentText(extractedText);
                setProtocolFileName(fileName);
              }}
              onClearProtocol={() => {
                setProtocolDocumentText(undefined);
                setProtocolFileName(undefined);
              }}
              protocolFileName={protocolFileName}
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
        ) : activeTab === 'pico' ? (
          <PICOHistoryTab />
        ) : (
          <>
            <ProtocolDocument
              metadata={protocolState.protocolMetadata}
              content={protocolState.protocolContent}
              onUpdateMetadata={(field, value) => protocolState.updateMetadata(field as keyof typeof protocolState.protocolMetadata, value)}
              onUpdateContent={(field, value) => protocolState.updateContent(field as keyof typeof protocolState.protocolContent, value)}
              activeField={activeField}
              onActiveFieldChange={setActiveField}
              pico={currentProtocol?.studyMethodology?.hypothesis?.picoFramework ? {
                population: currentProtocol.studyMethodology.hypothesis.picoFramework.population || '',
                intervention: currentProtocol.studyMethodology.hypothesis.picoFramework.intervention || '',
                comparison: currentProtocol.studyMethodology.hypothesis.picoFramework.comparison || '',
                outcome: currentProtocol.studyMethodology.hypothesis.picoFramework.outcome || '',
              } : undefined}
              foundationalPapers={Array.isArray(currentProtocol?.studyMethodology?.foundationalPapers)
                ? currentProtocol.studyMethodology.foundationalPapers
                    .filter((p: any) => p && typeof p.title === 'string' && typeof p.authors === 'string' && typeof p.year === 'string' && typeof p.journal === 'string' && typeof p.pico === 'object' && typeof p.protocolElements === 'object')
                    .map((p: any) => ({
                        ...p,
                        studyDesign: typeof p.studyDesign === 'string' ? p.studyDesign : '',
                        keyFindings: typeof p.keyFindings === 'string' ? p.keyFindings : '',
                        limitations: typeof p.limitations === 'string' ? p.limitations : '',
                    }))
                : []}
            />
            <ProtocolUnifiedSidebar
              activeTab={activeTab}
              schemaBlocks={schemaState.schemaBlocks}
              protocolMetadata={protocolState.protocolMetadata}
              protocolContent={protocolState.protocolContent}
              studyType={currentProtocol?.studyMethodology?.studyType}
              activeField={activeField}
              onUpdateMetadata={(field, value) => protocolState.updateMetadata(field as keyof typeof protocolState.protocolMetadata, value)}
              onUpdateContent={(field, value) => protocolState.updateContent(field as keyof typeof protocolState.protocolContent, value)}
              onNavigateToSection={(section) => {
                // Could add logic to scroll to specific section in ProtocolDocument
                console.log('Navigate to section:', section);
              }}
              onProtocolExtracted={(extractedText, fileName) => {
                setProtocolDocumentText(extractedText);
                setProtocolFileName(fileName);
              }}
              onClearProtocol={() => {
                setProtocolDocumentText(undefined);
                setProtocolFileName(undefined);
              }}
              protocolFileName={protocolFileName}
            />
          </>
        )}
      </div>

      {/* Modals */}
      {selectedBlockForSettings && (() => {
        const position = getBlockPosition(schemaState.schemaBlocks, selectedBlockForSettings.id);
        const canMoveUp = position ? position.index > 0 : false;
        const canMoveDown = position ? position.index < position.total - 1 : false;

        return (
          <SettingsModal
            block={selectedBlockForSettings}
            onClose={() => setSelectedBlockForSettings(null)}
            onSave={schemaState.updateBlock}
            availableSections={getAllSections(schemaState.schemaBlocks)}
            onMoveUp={schemaState.moveBlockUp}
            onMoveDown={schemaState.moveBlockDown}
            onChangeParent={schemaState.changeBlockParent}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            aiSuggestionsEnabled={aiSuggestionsEnabled}
            protocolContext={protocolContext}
          />
        );
      })()}

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
          onClose={() => setShowVersionConflict(false)}
        />
      )}

      {/* Protocol Selection Modal */}
      <ProtocolSelectionModal
        isOpen={showProtocolSelector}
        availableProtocols={versionControl.savedProtocols}
        onCreateNew={handleCreateNew}
        onLoadExisting={handleLoadExisting}
        onCancel={() => setShowProtocolSelector(false)}
      />

      {/* Save Draft Modal */}
      <SaveDraftModal
        isOpen={showSaveDraftModal}
        onClose={() => setShowSaveDraftModal(false)}
        onConfirm={handleConfirmSaveDraft}
        protocolMetadata={protocolState.protocolMetadata}
        protocolContent={protocolState.protocolContent}
        schemaBlocksCount={schemaState.schemaBlocks.length}
        dependenciesCount={schemaState.schemaBlocks.filter(b => b.conditionalDependencies && b.conditionalDependencies.length > 0).length}
      />

      {/* Deploy to Database Modal */}
      <DeployToDatabaseModal
        isOpen={showDeployModal}
        onClose={() => setShowDeployModal(false)}
        onConfirm={handleDeployToDatabase}
        protocolMetadata={protocolState.protocolMetadata}
        schemaBlocksCount={getAllBlocks(schemaState.schemaBlocks).length}
        hasPublishedVersion={currentVersion?.status === 'published'}
        validationErrors={getDeployValidationErrors()}
      />

      {/* Post-Publish Modal */}
      <PostPublishModal
        isOpen={showPostPublishModal}
        onClose={() => setShowPostPublishModal(false)}
        onDeployToDatabase={() => setShowDeployModal(true)}
        protocolTitle={protocolState.protocolMetadata.protocolTitle || 'Untitled Protocol'}
      />
    </div>
  );
}