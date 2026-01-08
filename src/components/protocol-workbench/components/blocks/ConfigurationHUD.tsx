import { Target, Activity, Tag as TagIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { SchemaBlock, RoleTag } from '../../types';

interface ConfigurationHUDProps {
  block: SchemaBlock;
  onUpdate: (blockId: string, updates: Partial<SchemaBlock>) => void;
}

export function ConfigurationHUD({ block, onUpdate }: ConfigurationHUDProps) {
  const { t } = useTranslation(['protocol', 'common']);
  const roles: RoleTag[] = ['Predictor', 'Outcome', 'Structure', 'All'];
  const endpointTiers = [
    { value: null, label: t('common:dataTypes.none') },
    { value: 'primary', label: t('common:dataTypes.primary') },
    { value: 'secondary', label: t('common:dataTypes.secondary') },
    { value: 'exploratory', label: t('common:dataTypes.exploratory') },
  ];
  
  const analysisMethods = [
    { value: null, label: t('common:dataTypes.none') },
    { value: 'survival', label: t('protocol:configHUD.kaplanMeier') },
    { value: 'frequency', label: t('protocol:configHUD.frequency') },
    { value: 'mean-comparison', label: t('protocol:configHUD.tTest') },
    { value: 'non-parametric', label: t('protocol:configHUD.nonParametric') },
    { value: 'chi-square', label: t('protocol:configHUD.chiSquare') },
  ];

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg p-3 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="grid grid-cols-3 gap-3">
        {/* Role Selection */}
        <div>
          <label className="flex items-center gap-1 text-xs font-medium text-slate-700 mb-1.5">
            <TagIcon className="w-3 h-3" />
            {t('protocol:configHUD.role')}
          </label>
          <select
            value={block.role}
            onChange={(e) => onUpdate(block.id, { role: e.target.value as RoleTag })}
            className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Endpoint Tier */}
        <div>
          <label className="flex items-center gap-1 text-xs font-medium text-slate-700 mb-1.5">
            <Target className="w-3 h-3" />
            {t('protocol:configHUD.endpointTier')}
          </label>
          <select
            value={block.endpointTier || ''}
            onChange={(e) =>
              onUpdate(block.id, {
                endpointTier: e.target.value ? (e.target.value as 'primary' | 'secondary' | 'exploratory') : null,
              })
            }
            className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {endpointTiers.map((tier) => (
              <option key={tier.label} value={tier.value || ''}>
                {tier.label}
              </option>
            ))}
          </select>
        </div>

        {/* Analysis Method */}
        <div>
          <label className="flex items-center gap-1 text-xs font-medium text-slate-700 mb-1.5">
            <Activity className="w-3 h-3" />
            {t('protocol:configHUD.analysisMethod')}
          </label>
          <select
            value={block.analysisMethod || ''}
            onChange={(e) =>
              onUpdate(block.id, {
                analysisMethod: e.target.value
                  ? (e.target.value as 'survival' | 'frequency' | 'mean-comparison' | 'non-parametric' | 'chi-square')
                  : null,
              })
            }
            className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {analysisMethods.map((method) => (
              <option key={method.label} value={method.value || ''}>
                {method.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Unit Input (for continuous data) */}
      {block.dataType === 'Continuous' && (
        <div className="mt-3">
          <label className="text-xs font-medium text-slate-700 mb-1.5 block">Unit</label>
          <input
            type="text"
            value={block.unit || ''}
            onChange={(e) => onUpdate(block.id, { unit: e.target.value })}
            placeholder="e.g., mg, years, mmHg"
            className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Range Inputs (for continuous data) */}
      {block.dataType === 'Continuous' && (
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="text-xs font-medium text-slate-700 mb-1.5 block">Min Value</label>
            <input
              type="number"
              value={block.minValue || ''}
              onChange={(e) => onUpdate(block.id, { minValue: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="Min"
              className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 mb-1.5 block">Max Value</label>
            <input
              type="number"
              value={block.maxValue || ''}
              onChange={(e) => onUpdate(block.id, { maxValue: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="Max"
              className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}