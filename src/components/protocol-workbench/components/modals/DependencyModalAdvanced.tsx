import { X, Plus, Trash2, AlertCircle, GitBranch } from 'lucide-react';
import { useState } from 'react';
import type { SchemaBlock, ConditionalDependency } from '../../types';

interface DependencyModalAdvancedProps {
  block: SchemaBlock;
  allBlocks: SchemaBlock[];
  onClose: () => void;
  onSave: (blockId: string, conditionalDependencies: ConditionalDependency[]) => void;
}

export function DependencyModalAdvanced({ block, allBlocks, onClose, onSave }: DependencyModalAdvancedProps) {
  const [conditionalDependencies, setConditionalDependencies] = useState<ConditionalDependency[]>(
    block.conditionalDependencies || []
  );

  // Get flat list of all blocks (excluding current block)
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

  const addConditionalDependency = () => {
    const newDep: ConditionalDependency = {
      id: `dep-${Date.now()}`,
      targetBlockId: '',
      condition: {
        operator: 'equals',
        value: '',
      },
      action: 'show',
    };
    setConditionalDependencies([...conditionalDependencies, newDep]);
  };

  const updateDependency = (id: string, updates: Partial<ConditionalDependency>) => {
    setConditionalDependencies(
      conditionalDependencies.map((dep) =>
        dep.id === id ? { ...dep, ...updates } : dep
      )
    );
  };

  const removeDependency = (id: string) => {
    setConditionalDependencies(conditionalDependencies.filter((dep) => dep.id !== id));
  };

  const handleSave = () => {
    // Filter out incomplete dependencies
    const validDeps = conditionalDependencies.filter(
      (dep) => dep.targetBlockId && (dep.condition.operator === 'exists' || dep.condition.value)
    );
    onSave(block.id, validDeps);
    onClose();
  };

  const getBlockById = (id: string) => {
    return availableBlocks.find((b) => b.id === id);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Conditional Dependencies</h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Define when <span className="font-medium text-slate-900">{block.variable.name}</span> triggers other variables
            </p>
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
                <p className="font-medium">Conditional Logic</p>
                <p className="mt-1 text-blue-700">
                  Example: "When <strong>Dissection Type</strong> equals <strong>Type B</strong>, then <strong>show</strong> the <strong>SVS Classification</strong> field"
                </p>
              </div>
            </div>
          </div>

          {/* Current Dependencies */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-slate-700">
                Conditional Rules ({conditionalDependencies.length})
              </label>
              <button
                onClick={addConditionalDependency}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Rule
              </button>
            </div>

            {conditionalDependencies.length === 0 ? (
              <div className="text-sm text-slate-500 italic p-6 border border-dashed border-slate-300 rounded-lg text-center">
                <GitBranch className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p>No conditional rules yet.</p>
                <p className="mt-1">Click "Add Rule" to create conditional dependencies.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {conditionalDependencies.map((dep) => {
                  const targetBlock = getBlockById(dep.targetBlockId);

                  return (
                    <div
                      key={dep.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Conditional Rule
                        </div>
                        <button
                          onClick={() => removeDependency(dep.id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {/* When [this variable] */}
                        <div className="text-sm">
                          <span className="text-slate-600">When </span>
                          <span className="font-semibold text-slate-900">{block.variable.name}</span>
                        </div>

                        {/* Operator & Value */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Condition
                            </label>
                            <select
                              value={dep.condition.operator}
                              onChange={(e) =>
                                updateDependency(dep.id, {
                                  condition: {
                                    ...dep.condition,
                                    operator: e.target.value as ConditionalDependency['condition']['operator'],
                                  },
                                })
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="equals">Equals</option>
                              <option value="not-equals">Not Equals</option>
                              <option value="greater-than">Greater Than</option>
                              <option value="less-than">Less Than</option>
                              <option value="contains">Contains</option>
                              <option value="exists">Has Any Value</option>
                            </select>
                          </div>

                          {dep.condition.operator !== 'exists' && (
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Value
                              </label>
                              {block.options && block.options.length > 0 ? (
                                <select
                                  value={dep.condition.value || ''}
                                  onChange={(e) =>
                                    updateDependency(dep.id, {
                                      condition: { ...dep.condition, value: e.target.value },
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select value...</option>
                                  {block.options.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  value={dep.condition.value || ''}
                                  onChange={(e) =>
                                    updateDependency(dep.id, {
                                      condition: { ...dep.condition, value: e.target.value },
                                    })
                                  }
                                  placeholder="Enter value..."
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Then [action] */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Then
                            </label>
                            <select
                              value={dep.action}
                              onChange={(e) =>
                                updateDependency(dep.id, {
                                  action: e.target.value as ConditionalDependency['action'],
                                })
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="show">Show</option>
                              <option value="hide">Hide</option>
                              <option value="require">Require</option>
                              <option value="disable">Disable</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Target Variable
                            </label>
                            <select
                              value={dep.targetBlockId}
                              onChange={(e) =>
                                updateDependency(dep.id, { targetBlockId: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select variable...</option>
                              {availableBlocks.map((b) => (
                                <option key={b.id} value={b.id}>
                                  {b.variable.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Preview */}
                        {dep.targetBlockId && (
                          <div className="mt-3 p-3 bg-white border border-slate-200 rounded text-sm">
                            <div className="font-medium text-slate-700 mb-1">Rule Preview:</div>
                            <div className="text-slate-900">
                              When <span className="font-semibold text-blue-600">{block.variable.name}</span>{' '}
                              <span className="text-slate-600">{dep.condition.operator.replace('-', ' ')}</span>{' '}
                              {dep.condition.operator !== 'exists' && (
                                <span className="font-semibold text-purple-600">"{dep.condition.value}"</span>
                              )}
                              , then <span className="text-slate-600">{dep.action}</span>{' '}
                              <span className="font-semibold text-green-600">{targetBlock?.variable.name}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Rules
          </button>
        </div>
      </div>
    </div>
  );
}
