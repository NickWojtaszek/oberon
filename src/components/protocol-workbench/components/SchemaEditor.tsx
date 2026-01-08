import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FileJson } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { SchemaBlock } from '../types';
import { SchemaBlockAdvanced } from './blocks/SchemaBlockAdvanced';
import { generateNestedJSON } from '../utils';
import { ContentContainer } from '../../ui/ContentContainer';

interface SchemaEditorProps {
  schemaBlocks: SchemaBlock[];
  hoveredBlockId: string | null;
  onHoverBlock: (blockId: string | null) => void;
  onUpdateBlock: (blockId: string, updates: Partial<SchemaBlock>) => void;
  onRemoveBlock: (blockId: string) => void;
  onToggleExpanded: (blockId: string) => void;
  onReorderBlocks: (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
  onShowSettings: (block: SchemaBlock) => void;
  onShowDependencies: (block: SchemaBlock) => void;
  onShowVersionTag: (block: SchemaBlock) => void;
  onDuplicate?: (block: SchemaBlock) => void;
  onShowSchemaGenerator?: () => void;
  onShowTemplateLibrary?: () => void;
  onSaveDraft?: () => void;
}

export function SchemaEditor({
  schemaBlocks,
  hoveredBlockId,
  onHoverBlock,
  onUpdateBlock,
  onRemoveBlock,
  onToggleExpanded,
  onReorderBlocks,
  onShowSettings,
  onShowDependencies,
  onShowVersionTag,
  onDuplicate,
  onShowSchemaGenerator,
  onShowTemplateLibrary,
  onSaveDraft,
}: SchemaEditorProps) {
  const { t } = useTranslation('ui');
  
  const handleExportJSON = () => {
    const json = generateNestedJSON(schemaBlocks);
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

  // Listen for events from Global Header
  useEffect(() => {
    const handleSaveDraft = () => {
      if (onSaveDraft) onSaveDraft();
    };
    
    const handleShowTemplates = () => {
      if (onShowTemplateLibrary) onShowTemplateLibrary();
    };
    
    const handleShowGenerator = () => {
      if (onShowSchemaGenerator) onShowSchemaGenerator();
    };
    
    const handleExport = () => {
      handleExportJSON();
    };

    window.addEventListener('protocol-save-draft', handleSaveDraft);
    window.addEventListener('protocol-show-templates', handleShowTemplates);
    window.addEventListener('protocol-show-ai-generator', handleShowGenerator);
    window.addEventListener('protocol-export-schema', handleExport);

    return () => {
      window.removeEventListener('protocol-save-draft', handleSaveDraft);
      window.removeEventListener('protocol-show-templates', handleShowTemplates);
      window.removeEventListener('protocol-show-ai-generator', handleShowGenerator);
      window.removeEventListener('protocol-export-schema', handleExport);
    };
  }, [onSaveDraft, onShowTemplateLibrary, onShowSchemaGenerator]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex-1 bg-white flex flex-col h-full">
        {/* Schema Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {schemaBlocks.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileJson className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{t('protocolWorkbench.schemaEditor.emptyState.title')}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t('protocolWorkbench.schemaEditor.emptyState.description')}
                </p>
              </div>
            </div>
          ) : (
            <ContentContainer className="space-y-4">
              {schemaBlocks.map((block) => (
                <SchemaBlockAdvanced
                  key={block.id}
                  block={block}
                  depth={0}
                  isHovered={hoveredBlockId === block.id}
                  onHover={onHoverBlock}
                  onUpdate={onUpdateBlock}
                  onRemove={onRemoveBlock}
                  onToggleExpanded={onToggleExpanded}
                  onReorder={onReorderBlocks}
                  onShowSettings={onShowSettings}
                  onShowDependencies={onShowDependencies}
                  onShowVersionTag={onShowVersionTag}
                  onDuplicate={onDuplicate}
                />
              ))}
            </ContentContainer>
          )}
        </div>
      </div>
    </DndProvider>
  );
}