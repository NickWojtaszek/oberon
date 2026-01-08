import { X, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { SchemaBlock, DataType } from '../../types';
import { commonUnits, enumerationTemplates } from '../../constants';

interface SettingsModalProps {
  block: SchemaBlock;
  onClose: () => void;
  onSave: (blockId: string, updates: Partial<SchemaBlock>) => void;
}

export function SettingsModal({ block, onClose, onSave }: SettingsModalProps) {
  const { t } = useTranslation('ui');
  const [localBlock, setLocalBlock] = useState<SchemaBlock>(block);

  useEffect(() => {
    setLocalBlock(block);
  }, [block]);

  const handleSave = () => {
    onSave(block.id, localBlock);
    onClose();
  };

  const updateField = <K extends keyof SchemaBlock>(key: K, value: SchemaBlock[K]) => {
    setLocalBlock(prev => ({ ...prev, [key]: value }));
  };

  const dataTypes: DataType[] = [
    'Continuous',
    'Categorical',
    'Boolean',
    'Date',
    'Text',
    'Multi-Select',
    'Conditional',
    'Grid',
    'Section',
    'Ranked-Matrix',
    'Categorical-Grid',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">{t('protocolWorkbench.settingsModal.title')}</h2>
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
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Data Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {t('protocolWorkbench.settingsModal.dataType')}
            </label>
            <select
              value={localBlock.dataType}
              onChange={(e) => updateField('dataType', e.target.value as DataType)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {dataTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Unit (for Continuous) */}
          {localBlock.dataType === 'Continuous' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t('protocolWorkbench.settingsModal.unit')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={localBlock.unit || ''}
                  onChange={(e) => updateField('unit', e.target.value)}
                  placeholder={t('protocolWorkbench.settingsModal.unitPlaceholder')}
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  onChange={(e) => updateField('unit', e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('protocolWorkbench.settingsModal.quickSelect')}</option>
                  {commonUnits.Continuous.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Range (for Continuous) */}
          {localBlock.dataType === 'Continuous' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t('protocolWorkbench.settingsModal.minValue')}
                </label>
                <input
                  type="number"
                  value={localBlock.minValue ?? ''}
                  onChange={(e) =>
                    updateField('minValue', e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder={t('protocolWorkbench.settingsModal.minPlaceholder')}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t('protocolWorkbench.settingsModal.maxValue')}
                </label>
                <input
                  type="number"
                  value={localBlock.maxValue ?? ''}
                  onChange={(e) =>
                    updateField('maxValue', e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder={t('protocolWorkbench.settingsModal.maxPlaceholder')}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Clinical Range (for Continuous) */}
          {localBlock.dataType === 'Continuous' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t('protocolWorkbench.settingsModal.clinicalRange')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={localBlock.clinicalRange?.min ?? ''}
                  onChange={(e) =>
                    updateField('clinicalRange', {
                      ...localBlock.clinicalRange,
                      min: Number(e.target.value),
                      max: localBlock.clinicalRange?.max || 0,
                      unit: localBlock.clinicalRange?.unit || localBlock.unit || '',
                    })
                  }
                  placeholder="Clinical Min"
                  className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={localBlock.clinicalRange?.max ?? ''}
                  onChange={(e) =>
                    updateField('clinicalRange', {
                      ...localBlock.clinicalRange,
                      min: localBlock.clinicalRange?.min || 0,
                      max: Number(e.target.value),
                      unit: localBlock.clinicalRange?.unit || localBlock.unit || '',
                    })
                  }
                  placeholder="Clinical Max"
                  className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={localBlock.clinicalRange?.unit ?? localBlock.unit ?? ''}
                  onChange={(e) =>
                    updateField('clinicalRange', {
                      ...localBlock.clinicalRange,
                      min: localBlock.clinicalRange?.min || 0,
                      max: localBlock.clinicalRange?.max || 0,
                      unit: e.target.value,
                    })
                  }
                  placeholder="Unit"
                  className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Options (for Categorical/Multi-Select) */}
          {(localBlock.dataType === 'Categorical' || localBlock.dataType === 'Multi-Select') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t('protocolWorkbench.settingsModal.options')}
              </label>
              <textarea
                value={(localBlock.options || []).join('\n')}
                onChange={(e) =>
                  updateField(
                    'options',
                    e.target.value.split('\n').filter((opt) => opt.trim())
                  )
                }
                placeholder="Enter one option per line"
                rows={4}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              <div className="mt-2">
                <label className="text-xs text-slate-600 mb-1 block">Quick templates:</label>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(enumerationTemplates).map(([key, values]) => (
                    <button
                      key={key}
                      onClick={() => updateField('options', values)}
                      className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Matrix Rows (for Ranked-Matrix) */}
          {localBlock.dataType === 'Ranked-Matrix' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t('protocolWorkbench.settingsModal.matrixRows')}
              </label>
              <textarea
                value={(localBlock.matrixRows || []).join('\n')}
                onChange={(e) =>
                  updateField(
                    'matrixRows',
                    e.target.value.split('\n').filter((row) => row.trim())
                  )
                }
                placeholder="Enter one row per line"
                rows={4}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>
          )}

          {/* Grid Configuration (for Categorical-Grid) */}
          {localBlock.dataType === 'Categorical-Grid' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t('protocolWorkbench.settingsModal.gridItems')}
                </label>
                <textarea
                  value={(localBlock.gridItems || []).join('\n')}
                  onChange={(e) =>
                    updateField(
                      'gridItems',
                      e.target.value.split('\n').filter((item) => item.trim())
                    )
                  }
                  placeholder="Enter one item per line"
                  rows={3}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t('protocolWorkbench.settingsModal.gridCategories')}
                </label>
                <textarea
                  value={(localBlock.gridCategories || []).join('\n')}
                  onChange={(e) =>
                    updateField(
                      'gridCategories',
                      e.target.value.split('\n').filter((cat) => cat.trim())
                    )
                  }
                  placeholder="Enter one category per line"
                  rows={3}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
            </>
          )}
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
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            {t('protocolWorkbench.settingsModal.saveChanges')}
          </button>
        </div>
      </div>
    </div>
  );
}