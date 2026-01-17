/**
 * Schema Builder Step
 * Integrated protocol schema design within wizard workflow
 * Wraps the sophisticated SchemaEditor from Protocol Workbench
 */

import { useState } from 'react';
import {
  Table,
  Plus,
  FileJson,
  AlertCircle,
  CheckCircle,
  Info,
} from 'lucide-react';
import type { SchemaBlock } from '../../protocol-workbench/types';
import { SchemaEditor } from '../../protocol-workbench/components/SchemaEditor';

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
  };
}

export function SchemaBuilderStep({ onComplete, initialData, picoContext }: SchemaBuilderStepProps) {
  const [schemaBlocks, setSchemaBlocks] = useState<SchemaBlock[]>(initialData?.schemaBlocks || []);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);

  // Quick start templates based on PICO
  const handleQuickStart = () => {
    if (!picoContext) return;

    const quickStartBlocks: SchemaBlock[] = [
      {
        id: `demo-section-${Date.now()}`,
        variable: { name: 'Demographics', type: 'section', description: 'Patient demographic data' },
        dataType: 'Section',
        role: 'Demographic',
        endpointTier: null,
        required: true,
        repeatable: false,
        isExpanded: true,
        children: [
          {
            id: `subject-id-${Date.now()}`,
            variable: { name: 'subject_id', type: 'text', description: 'Unique subject identifier' },
            dataType: 'Text',
            role: 'Identifier',
            endpointTier: null,
            required: true,
            repeatable: false,
            children: [],
          },
          {
            id: `age-${Date.now()}`,
            variable: { name: 'age', type: 'numeric', description: 'Patient age in years' },
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
        id: `baseline-section-${Date.now()}`,
        variable: { name: 'Baseline', type: 'section', description: 'Baseline measurements' },
        dataType: 'Section',
        role: 'Baseline',
        endpointTier: null,
        required: true,
        repeatable: false,
        isExpanded: true,
        children: [],
      },
      {
        id: `outcome-section-${Date.now()}`,
        variable: { name: 'Outcomes', type: 'section', description: picoContext.outcome },
        dataType: 'Section',
        role: 'Outcome',
        endpointTier: 'Primary',
        required: true,
        repeatable: false,
        isExpanded: true,
        children: [],
      },
    ];

    setSchemaBlocks(quickStartBlocks);
  };

  const handleUpdateBlock = (blockId: string, updates: Partial<SchemaBlock>) => {
    const updateBlockRecursive = (blocks: SchemaBlock[]): SchemaBlock[] => {
      return blocks.map(block => {
        if (block.id === blockId) {
          return { ...block, ...updates };
        }
        if (block.children) {
          return { ...block, children: updateBlockRecursive(block.children) };
        }
        return block;
      });
    };
    setSchemaBlocks(updateBlockRecursive(schemaBlocks));
  };

  const handleRemoveBlock = (blockId: string) => {
    const removeBlockRecursive = (blocks: SchemaBlock[]): SchemaBlock[] => {
      return blocks
        .filter(block => block.id !== blockId)
        .map(block => ({
          ...block,
          children: block.children ? removeBlockRecursive(block.children) : [],
        }));
    };
    setSchemaBlocks(removeBlockRecursive(schemaBlocks));
  };

  const handleToggleExpanded = (blockId: string) => {
    const toggleRecursive = (blocks: SchemaBlock[]): SchemaBlock[] => {
      return blocks.map(block => {
        if (block.id === blockId) {
          return { ...block, isExpanded: !block.isExpanded };
        }
        if (block.children) {
          return { ...block, children: toggleRecursive(block.children) };
        }
        return block;
      });
    };
    setSchemaBlocks(toggleRecursive(schemaBlocks));
  };

  const handleReorderBlocks = (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => {
    // Simplified reorder implementation for wizard
    // Full implementation available in Protocol Workbench
    console.log('Reorder:', { draggedId, targetId, position });
  };

  const handleComplete = () => {
    onComplete({ schemaBlocks });
  };

  const hasMinimumSchema = schemaBlocks.length >= 1;
  const hasOutcomeField = schemaBlocks.some(block =>
    block.role === 'Outcome' ||
    block.endpointTier === 'Primary' ||
    block.children?.some(child => child.role === 'Outcome' || child.endpointTier === 'Primary')
  );

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center gap-4 mb-2">
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
              {schemaBlocks.length} field{schemaBlocks.length !== 1 ? 's' : ''} defined
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

      {/* Quick Start */}
      {schemaBlocks.length === 0 && picoContext && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-2">Quick Start Available</h3>
              <p className="text-sm text-slate-600 mb-4">
                Generate a starter schema based on your PICO framework to save time.
              </p>
              <button
                onClick={handleQuickStart}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Generate PICO-Based Schema
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schema Editor */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
        <SchemaEditor
          schemaBlocks={schemaBlocks}
          hoveredBlockId={hoveredBlockId}
          onHoverBlock={setHoveredBlockId}
          onUpdateBlock={handleUpdateBlock}
          onRemoveBlock={handleRemoveBlock}
          onToggleExpanded={handleToggleExpanded}
          onReorderBlocks={handleReorderBlocks}
          onShowSettings={() => {}}
          onShowDependencies={() => {}}
          onShowVersionTag={() => {}}
          aiSuggestionsEnabled={false}
        />
      </div>

      {/* Validation Warning */}
      {!hasOutcomeField && schemaBlocks.length > 0 && (
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
              ? `${schemaBlocks.length} field${schemaBlocks.length !== 1 ? 's' : ''} configured`
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
    </div>
  );
}
