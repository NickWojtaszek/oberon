/**
 * Schema Builder Step
 * Full-featured protocol schema design within wizard workflow
 * Includes: Variable Library, Import/Export, Templates, AI Generation
 */

import { useState, useRef, useEffect } from 'react';
import {
  Table,
  Plus,
  AlertCircle,
  CheckCircle,
  Info,
  Upload,
  Download,
  Sparkles,
  BookTemplate,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import type { SchemaBlock, Variable } from '../../protocol-workbench/types';
import { SchemaEditor } from '../../protocol-workbench/components/SchemaEditor';
import { VariableLibrary } from '../../protocol-workbench/components/VariableLibrary';
import { SchemaTemplateLibrary } from '../../protocol-workbench/components/SchemaTemplateLibrary';
import { SchemaGeneratorModal } from '../../protocol-workbench/components/modals/SchemaGeneratorModal';
import { SettingsModal } from '../../protocol-workbench/components/modals/SettingsModal';
import { DependencyModal } from '../../protocol-workbench/components/modals/DependencyModal';
import { useSchemaState } from '../../protocol-workbench/hooks/useSchemaState';
import { validateAndImportSchema, getAllSections, getBlockPosition } from '../../protocol-workbench/utils';
import type { SchemaTemplate } from '../../protocol-workbench/components/SchemaTemplateLibrary';

interface SchemaBuilderStepProps {
  onComplete: (data: { schemaBlocks: SchemaBlock[] }) => void;
  initialData?: {
    schemaBlocks?: SchemaBlock[];
  };
  picoContext?: {
    population: string;
    intervention: string;
    comparison: string;
    outcome: string;
    studyPhase?: string;
  };
}

export function SchemaBuilderStep({ onComplete, initialData, picoContext }: SchemaBuilderStepProps) {
  // Use the full schema state hook from Protocol Workbench
  const schemaState = useSchemaState();

  // Initialize with initial data if provided (only once)
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current && initialData?.schemaBlocks && initialData.schemaBlocks.length > 0) {
      schemaState.loadSchema(initialData.schemaBlocks);
      initializedRef.current = true;
    }
  }, [initialData?.schemaBlocks, schemaState]);

  // UI state
  const [showVariableLibrary, setShowVariableLibrary] = useState(true);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  // Modal state for settings and dependencies
  const [selectedBlockForSettings, setSelectedBlockForSettings] = useState<SchemaBlock | null>(null);
  const [selectedBlockForDependency, setSelectedBlockForDependency] = useState<SchemaBlock | null>(null);

  // File input ref for import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick start templates based on PICO
  const handleQuickStart = () => {
    if (!picoContext) return;

    const quickStartBlocks: SchemaBlock[] = [
      {
        id: `demo-section-${Date.now()}`,
        variable: { id: 'section', name: 'Demographics', category: 'Structural', defaultType: 'Section' },
        dataType: 'Section',
        role: 'Demographic',
        endpointTier: null,
        required: true,
        repeatable: false,
        isExpanded: true,
        children: [
          {
            id: `subject-id-${Date.now()}-1`,
            variable: { id: 'custom', name: 'subject_id', category: 'Structural', defaultType: 'Text' },
            dataType: 'Text',
            role: 'Identifier',
            endpointTier: null,
            required: true,
            repeatable: false,
            children: [],
          },
          {
            id: `age-${Date.now()}-2`,
            variable: { id: 'custom', name: 'age', category: 'Demographics', defaultType: 'Numeric' },
            dataType: 'Numeric',
            role: 'Covariate',
            endpointTier: null,
            required: true,
            repeatable: false,
            unit: 'years',
            children: [],
          },
        ],
      },
      {
        id: `baseline-section-${Date.now()}-3`,
        variable: { id: 'section', name: 'Baseline', category: 'Structural', defaultType: 'Section' },
        dataType: 'Section',
        role: 'Baseline',
        endpointTier: null,
        required: true,
        repeatable: false,
        isExpanded: true,
        children: [],
      },
      {
        id: `outcome-section-${Date.now()}-4`,
        variable: { id: 'section', name: 'Outcomes', category: 'Structural', defaultType: 'Section' },
        dataType: 'Section',
        role: 'Outcome',
        endpointTier: 'Primary',
        required: true,
        repeatable: false,
        isExpanded: true,
        children: [],
      },
    ];

    schemaState.setSchemaBlocks(quickStartBlocks);
  };

  // Import JSON schema
  const handleImportJSON = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);

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

      schemaState.setSchemaBlocks(result.blocks);
      alert(`Successfully imported ${result.blocks.length} schema blocks!`);
    } catch (error) {
      alert(`Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Export JSON schema
  const handleExportJSON = () => {
    if (schemaState.schemaBlocks.length === 0) {
      alert('No schema blocks to export');
      return;
    }

    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      protocolTitle: 'Clinical Capture Schema',
      schemaBlocks: schemaState.schemaBlocks,
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

  // Handle template loading
  const handleTemplateLoaded = (template: SchemaTemplate) => {
    const regenerateIds = (block: SchemaBlock): SchemaBlock => ({
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      children: block.children?.map(regenerateIds),
    });

    template.blocks.forEach(block => {
      const newBlock = regenerateIds(block);
      schemaState.addBlockDirectly(newBlock);
    });

    setShowTemplateLibrary(false);
  };

  // Handle AI-generated schema
  const handleSchemaGenerated = (blocks: SchemaBlock[]) => {
    blocks.forEach(block => schemaState.addBlockDirectly(block));
    setShowAIGenerator(false);
  };

  // Handle adding variable from library
  const handleAddVariable = (variable: Variable, parentId?: string) => {
    schemaState.addBlock(variable, parentId);
  };

  const handleComplete = () => {
    onComplete({ schemaBlocks: schemaState.schemaBlocks });
  };

  const hasMinimumSchema = schemaState.schemaBlocks.length >= 1;
  const hasOutcomeField = schemaState.schemaBlocks.some(block =>
    block.role === 'Outcome' ||
    block.endpointTier === 'Primary' ||
    block.children?.some(child => child.role === 'Outcome' || child.endpointTier === 'Primary')
  );

  // Count total fields including nested
  const countAllFields = (blocks: SchemaBlock[]): number => {
    return blocks.reduce((count, block) => {
      return count + 1 + (block.children ? countAllFields(block.children) : 0);
    }, 0);
  };
  const totalFields = countAllFields(schemaState.schemaBlocks);

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* Header with Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Table className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-blue-900">Protocol Schema Builder</h2>
            <p className="text-sm text-blue-700 mt-1">
              Define the data structure for your clinical protocol
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowVariableLibrary(!showVariableLibrary)}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
              showVariableLibrary
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-700 border border-blue-300 hover:bg-blue-50'
            }`}
          >
            {showVariableLibrary ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            Variable Library
          </button>

          <button
            onClick={handleImportJSON}
            className="px-3 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-medium flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import JSON
          </button>

          <button
            onClick={handleExportJSON}
            disabled={schemaState.schemaBlocks.length === 0}
            className="px-3 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>

          <button
            onClick={() => setShowTemplateLibrary(true)}
            className="px-3 py-2 bg-white text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50 text-sm font-medium flex items-center gap-2"
          >
            <BookTemplate className="w-4 h-4" />
            Templates
          </button>

          <button
            onClick={() => setShowAIGenerator(true)}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI Generate
          </button>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-4 mt-4">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            hasMinimumSchema ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
          }`}>
            {hasMinimumSchema ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {totalFields} field{totalFields !== 1 ? 's' : ''} defined
            </span>
          </div>

          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            hasOutcomeField ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
          }`}>
            {hasOutcomeField ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {hasOutcomeField ? 'Primary outcome defined' : 'No primary outcome'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Start - only show when empty */}
      {schemaState.schemaBlocks.length === 0 && picoContext && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-2">Quick Start Available</h3>
              <p className="text-sm text-slate-600 mb-4">
                Generate a starter schema based on your PICO framework, or import an existing schema from a JSON file.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleQuickStart}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Generate PICO-Based Schema
                </button>
                <button
                  onClick={handleImportJSON}
                  className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Import Existing Schema
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Variable Library Sidebar */}
        {showVariableLibrary && (
          <div className="flex-shrink-0 bg-white rounded-xl border border-slate-200 overflow-hidden">
            <VariableLibrary
              onAddVariable={handleAddVariable}
              selectedParentId={selectedParentId}
            />
          </div>
        )}

        {/* Schema Editor */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col min-w-0">
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
            onShowVersionTag={() => {}}
            onShowSchemaGenerator={() => setShowAIGenerator(true)}
            onShowTemplateLibrary={() => setShowTemplateLibrary(true)}
          />
        </div>
      </div>

      {/* Validation Warning */}
      {!hasOutcomeField && schemaState.schemaBlocks.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <div className="font-semibold text-amber-900">Primary Outcome Required</div>
            <div className="text-sm text-amber-700 mt-1">
              Your protocol schema should include at least one field marked as a Primary outcome endpoint.
            </div>
          </div>
        </div>
      )}

      {/* Complete Button */}
      <div className="flex items-center justify-between p-6 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <div className="font-medium text-slate-900">Protocol schema {hasMinimumSchema ? 'defined' : 'empty'}</div>
          <div className="text-sm text-slate-600">
            {hasMinimumSchema
              ? `${totalFields} field${totalFields !== 1 ? 's' : ''} configured`
              : 'Add at least one schema field to continue'}
          </div>
        </div>
        <button
          onClick={handleComplete}
          disabled={!hasMinimumSchema}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          Complete & Continue
        </button>
      </div>

      {/* Template Library Modal */}
      {showTemplateLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <SchemaTemplateLibrary
              onSelectTemplate={handleTemplateLoaded}
              onClose={() => setShowTemplateLibrary(false)}
            />
          </div>
        </div>
      )}

      {/* AI Generator Modal */}
      {showAIGenerator && (
        <SchemaGeneratorModal
          isOpen={showAIGenerator}
          onClose={() => setShowAIGenerator(false)}
          onGenerate={handleSchemaGenerated}
          protocolContext={{
            primaryObjective: picoContext?.outcome || '',
            studyPhase: picoContext?.studyPhase || 'Not specified',
            therapeuticArea: picoContext?.intervention || '',
          }}
        />
      )}

      {/* Settings Modal */}
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
            aiSuggestionsEnabled={true}
            protocolContext={{
              primaryObjective: picoContext?.outcome || '',
              studyPhase: picoContext?.studyPhase || 'Not specified',
              therapeuticArea: picoContext?.intervention || '',
              existingFields: schemaState.schemaBlocks.flatMap(block => {
                const fields: Array<{ name: string; role: string; endpointTier: string | null }> = [];
                const collectFields = (b: typeof block) => {
                  if (b.dataType !== 'Section') {
                    fields.push({
                      name: b.variable.name,
                      role: b.role,
                      endpointTier: b.endpointTier || null,
                    });
                  }
                  b.children?.forEach(collectFields);
                };
                collectFields(block);
                return fields;
              }),
            }}
          />
        );
      })()}

      {/* Dependency Modal */}
      {selectedBlockForDependency && (
        <DependencyModal
          block={selectedBlockForDependency}
          allBlocks={schemaState.schemaBlocks}
          onClose={() => setSelectedBlockForDependency(null)}
          onSave={schemaState.updateBlock}
        />
      )}
    </div>
  );
}
