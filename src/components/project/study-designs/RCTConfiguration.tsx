import { useState } from 'react';
import { Shuffle, Eye, Users } from 'lucide-react';
import type { RCTConfiguration, BlindingType, AllocationRatio } from '../../../types/studyDesigns';

interface RCTConfigurationProps {
  config: RCTConfiguration;
  onChange: (config: RCTConfiguration) => void;
}

export function RCTConfiguration({ config, onChange }: RCTConfigurationProps) {
  const handleBlindingChange = (blindingType: BlindingType) => {
    onChange({ ...config, blindingType });
  };

  const handleAllocationChange = (allocationRatio: AllocationRatio) => {
    onChange({ ...config, allocationRatio });
  };

  const handleCustomRatioChange = (customRatio: string) => {
    onChange({ ...config, customRatio });
  };

  const handleBlockRandomizationToggle = () => {
    onChange({ ...config, blockRandomization: !config.blockRandomization });
  };

  const handleBlockSizeChange = (blockSize: number) => {
    onChange({ ...config, blockSize });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Shuffle className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Randomization Setup</h3>
          <p className="text-sm text-slate-600">
            Configure allocation and blinding for your RCT
          </p>
        </div>
      </div>

      {/* Blinding Strategy */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Eye className="w-4 h-4" />
          Blinding Strategy
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'open-label', label: 'Open Label', description: 'No blinding' },
            { value: 'single-blind', label: 'Single Blind', description: 'Participant only' },
            { value: 'double-blind', label: 'Double Blind', description: 'Participant + Investigator' },
            { value: 'triple-blind', label: 'Triple Blind', description: 'Participant + Investigator + Analyst' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleBlindingChange(option.value as BlindingType)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                config.blindingType === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="font-medium text-sm text-slate-900">
                {option.label}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                {option.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Allocation Ratio */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Users className="w-4 h-4" />
          Allocation Ratio (Treatment : Control)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: '1:1', label: '1:1', description: 'Equal allocation' },
            { value: '2:1', label: '2:1', description: 'Favor treatment' },
            { value: '1:2', label: '1:2', description: 'Favor control' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleAllocationChange(option.value as AllocationRatio)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                config.allocationRatio === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="font-semibold text-slate-900">{option.label}</div>
              <div className="text-xs text-slate-600 mt-0.5">
                {option.description}
              </div>
            </button>
          ))}
        </div>

        {/* Custom Ratio Option */}
        <button
          onClick={() => handleAllocationChange('custom')}
          className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
            config.allocationRatio === 'custom'
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="font-medium text-sm text-slate-900 mb-2">
            Custom Ratio
          </div>
          {config.allocationRatio === 'custom' && (
            <input
              type="text"
              value={config.customRatio || ''}
              onChange={(e) => handleCustomRatioChange(e.target.value)}
              placeholder="e.g., 3:2 or 4:1"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </button>
      </div>

      {/* Block Randomization */}
      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={config.blockRandomization}
            onChange={handleBlockRandomizationToggle}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-slate-700">
            Use Block Randomization
          </span>
        </label>

        {config.blockRandomization && (
          <div className="ml-6 space-y-2">
            <label className="text-sm text-slate-600">Block Size</label>
            <select
              value={config.blockSize || 4}
              onChange={(e) => handleBlockSizeChange(parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={2}>2</option>
              <option value={4}>4 (Recommended)</option>
              <option value={6}>6</option>
              <option value={8}>8</option>
            </select>
            <p className="text-xs text-slate-500">
              Block size ensures balanced allocation over time
            </p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Why Randomization Matters:</strong> Proper randomization minimizes
          selection bias and ensures groups are comparable at baseline. {config.blindingType === 'double-blind' && 'Double-blinding additionally reduces performance and detection bias.'}
        </p>
      </div>
    </div>
  );
}
