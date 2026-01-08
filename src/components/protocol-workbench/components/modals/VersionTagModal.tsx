import { X, Tag } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SchemaBlock } from '../../types';

interface VersionTagModalProps {
  block: SchemaBlock;
  onClose: () => void;
  onSave: (blockId: string, versionTag: string | undefined, versionColor: 'blue' | 'green' | 'purple' | 'amber' | undefined) => void;
}

export function VersionTagModal({ block, onClose, onSave }: VersionTagModalProps) {
  const { t } = useTranslation('ui');
  const [versionTag, setVersionTag] = useState(block.versionTag || '');
  const [versionColor, setVersionColor] = useState<'blue' | 'green' | 'purple' | 'amber'>(
    block.versionColor || 'blue'
  );

  const colors: Array<{ value: 'blue' | 'green' | 'purple' | 'amber'; label: string; class: string }> = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'amber', label: 'Amber', class: 'bg-amber-500' },
  ];

  const presetTags = ['v1.0', 'v1.1', 'v2.0', 'Baseline', 'Amendment 1', 'Amendment 2', 'Final'];

  const handleSave = () => {
    if (versionTag.trim()) {
      onSave(block.id, versionTag.trim(), versionColor);
    } else {
      onSave(block.id, undefined, undefined);
    }
    onClose();
  };

  const handleRemoveTag = () => {
    onSave(block.id, undefined, undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-slate-600" />
            <div>
              <h2 className="font-semibold text-slate-900">{t('protocolWorkbench.versionTagModal.title')}</h2>
              <p className="text-sm text-slate-600 mt-0.5">{block.variable.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Tag Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {t('protocolWorkbench.versionTagModal.versionTag')}
            </label>
            <input
              type="text"
              value={versionTag}
              onChange={(e) => setVersionTag(e.target.value)}
              placeholder={t('protocolWorkbench.versionTagModal.versionPlaceholder')}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Preset Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {t('protocolWorkbench.versionTagModal.quickSelect')}
            </label>
            <div className="flex flex-wrap gap-2">
              {presetTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setVersionTag(tag)}
                  className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {t('protocolWorkbench.versionTagModal.tagColor')}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setVersionColor(color.value)}
                  className={`flex flex-col items-center gap-2 p-3 border-2 rounded-lg transition-all ${
                    versionColor === color.value
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${color.class}`} />
                  <span className="text-xs font-medium text-slate-700">{color.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {versionTag && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t('protocolWorkbench.versionTagModal.preview')}
              </label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-sm text-slate-600">Tag will appear as:</span>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium bg-${versionColor}-100 text-${versionColor}-700 border border-${versionColor}-300`}
                >
                  {versionTag}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleRemoveTag}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            {t('protocolWorkbench.versionTagModal.clearTag')}
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {t('protocolWorkbench.settingsModal.cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={!versionTag.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('protocolWorkbench.versionTagModal.saveTag')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}