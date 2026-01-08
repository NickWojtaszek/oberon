import { Settings, GitBranch, Tag, X, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { SchemaBlock } from '../../types';

interface BlockToolbarProps {
  block: SchemaBlock;
  onShowSettings: (block: SchemaBlock) => void;
  onShowDependencies: (block: SchemaBlock) => void;
  onShowVersionTag: (block: SchemaBlock) => void;
  onDuplicate?: (block: SchemaBlock) => void;
  onRemove: (blockId: string) => void;
}

export function BlockToolbar({
  block,
  onShowSettings,
  onShowDependencies,
  onShowVersionTag,
  onDuplicate,
  onRemove,
}: BlockToolbarProps) {
  const { t } = useTranslation('protocol');
  
  return (
    <div className="flex items-center gap-1">
      {/* Duplicate */}
      {onDuplicate && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(block);
          }}
          className="p-1.5 hover:bg-slate-100 rounded transition-colors"
          title={t('blockToolbar.duplicate')}
        >
          <Copy className="w-4 h-4 text-slate-600" />
        </button>
      )}

      {/* Version Tag */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onShowVersionTag(block);
        }}
        className="p-1.5 hover:bg-slate-100 rounded transition-colors"
        title={t('blockToolbar.versionTag')}
      >
        <Tag className="w-4 h-4 text-slate-600" />
      </button>

      {/* Dependencies */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onShowDependencies(block);
        }}
        className="p-1.5 hover:bg-slate-100 rounded transition-colors"
        title={t('blockToolbar.dependencies')}
      >
        <GitBranch className="w-4 h-4 text-slate-600" />
      </button>

      {/* Settings */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onShowSettings(block);
        }}
        className="p-1.5 hover:bg-slate-100 rounded transition-colors"
        title={t('blockToolbar.settings')}
      >
        <Settings className="w-4 h-4 text-slate-600" />
      </button>

      {/* Remove */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(block.id);
        }}
        className="p-1.5 hover:bg-red-100 rounded transition-colors"
        title={t('blockToolbar.remove')}
      >
        <X className="w-4 h-4 text-red-600" />
      </button>
    </div>
  );
}