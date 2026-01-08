import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SchemaBlock } from '../../types';

interface DependencyModalProps {
  block: SchemaBlock;
  allBlocks: SchemaBlock[];
  onClose: () => void;
  onSave: (blockId: string, dependencies: string[]) => void;
}

export function DependencyModal({ block, allBlocks, onClose, onSave }: DependencyModalProps) {
  const { t } = useTranslation('ui');
  const [dependencies, setDependencies] = useState<string[]>(block.dependencies || []);

  // Get flat list of all blocks (excluding current block and its children)
  const flattenBlocks = (blocks: SchemaBlock[], exclude: string): SchemaBlock[] => {
    const result: SchemaBlock[] = [];
    for (const b of blocks) {
      if (b.id !== exclude) {
        result.push(b);
        if (b.children) {
          result.push(...flattenBlocks(b.children, exclude));
        }
      }
    }
    return result;
  };

  const availableBlocks = flattenBlocks(allBlocks, block.id);

  const addDependency = (blockId: string) => {
    if (!dependencies.includes(blockId)) {
      setDependencies([...dependencies, blockId]);
    }
  };

  const removeDependency = (blockId: string) => {
    setDependencies(dependencies.filter((id) => id !== blockId));
  };

  const handleSave = () => {
    onSave(block.id, dependencies);
    onClose();
  };

  const getDependentBlock = (id: string) => {
    return availableBlocks.find((b) => b.id === id);
  };

  // Check for circular dependencies
  const wouldCreateCircular = (targetId: string): boolean => {
    const targetBlock = availableBlocks.find((b) => b.id === targetId);
    if (!targetBlock || !targetBlock.dependencies) return false;
    
    // Simple check: if target depends on current block, it would be circular
    return targetBlock.dependencies.includes(block.id);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">{t('protocolWorkbench.dependencyModal.title')}</h2>
            <p className="text-sm text-slate-600 mt-0.5">{block.variable.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium">{t('protocolWorkbench.dependencyModal.infoTitle')}</p>
                <p className="mt-1 text-blue-700">
                  {t('protocolWorkbench.dependencyModal.infoDescription')}
                </p>
              </div>
            </div>
          </div>

          {/* Current Dependencies */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('protocolWorkbench.dependencyModal.currentDependencies')} ({dependencies.length})
            </label>
            {dependencies.length === 0 ? (
              <div className="text-sm text-slate-500 italic p-4 border border-dashed border-slate-300 rounded-lg text-center">
                {t('protocolWorkbench.dependencyModal.noDependencies')}
              </div>
            ) : (
              <div className="space-y-2">
                {dependencies.map((depId) => {
                  const depBlock = getDependentBlock(depId);
                  return (
                    <div
                      key={depId}
                      className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">
                          {depBlock?.variable.name || t('protocolWorkbench.dependencyModal.unknownVariable')}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {depBlock?.dataType} • {depBlock?.role}
                        </p>
                      </div>
                      <button
                        onClick={() => removeDependency(depId)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add Dependency */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('protocolWorkbench.dependencyModal.addDependency')}
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableBlocks.length === 0 ? (
                <div className="text-sm text-slate-500 italic p-4 border border-dashed border-slate-300 rounded-lg text-center">
                  {t('protocolWorkbench.dependencyModal.noAvailableVariables')}
                </div>
              ) : (
                availableBlocks
                  .filter((b) => !dependencies.includes(b.id))
                  .map((b) => {
                    const circular = wouldCreateCircular(b.id);
                    return (
                      <button
                        key={b.id}
                        onClick={() => !circular && addDependency(b.id)}
                        disabled={circular}
                        className={`w-full flex items-center justify-between p-3 border rounded-lg text-left transition-colors ${
                          circular
                            ? 'bg-red-50 border-red-200 opacity-50 cursor-not-allowed'
                            : 'bg-white border-slate-200 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{b.variable.name}</p>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {b.dataType} • {b.role}
                          </p>
                          {circular && (
                            <p className="text-xs text-red-600 mt-1">
                              ⚠️ {t('protocolWorkbench.dependencyModal.circularWarning')}
                            </p>
                          )}
                        </div>
                        {!circular && <Plus className="w-5 h-5 text-blue-600" />}
                      </button>
                    );
                  })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {t('protocolWorkbench.settingsModal.cancel')}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('protocolWorkbench.dependencyModal.saveDependencies')}
          </button>
        </div>
      </div>
    </div>
  );
}