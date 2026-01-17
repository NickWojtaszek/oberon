/**
 * Study Design Configuration Step
 * Configure study methodology, randomization, and blinding
 * Migrated from ProjectSetup with full RCT configuration support
 */

import { useState, useEffect } from 'react';
import {
  FlaskConical,
  Shuffle,
  Eye,
  Users,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';

// Study methodology types
type StudyType =
  | 'rct'
  | 'prospective-cohort'
  | 'retrospective-case-series'
  | 'laboratory-investigation'
  | 'technical-note';

type BlindingType =
  | 'open-label'
  | 'single-blind'
  | 'double-blind'
  | 'triple-blind';

type AllocationRatio = '1:1' | '2:1' | '1:2' | 'custom';

interface RCTConfiguration {
  blindingType: BlindingType;
  allocationRatio: AllocationRatio;
  customRatio?: string;
  blockRandomization: boolean;
  blockSize?: number;
}

interface StudyDesignStepProps {
  onComplete: (data: {
    studyType: StudyType;
    rctConfig?: RCTConfiguration;
  }) => void;
  initialData?: {
    studyType?: StudyType;
    rctConfig?: RCTConfiguration;
  };
}

const METHODOLOGY_OPTIONS = [
  {
    value: 'rct' as const,
    icon: '🔬',
    label: 'Randomized Controlled Trial',
    description: 'Gold standard interventional study with random allocation and blinding'
  },
  {
    value: 'prospective-cohort' as const,
    icon: '📊',
    label: 'Prospective Cohort Study',
    description: 'Longitudinal observational study following participants forward in time'
  },
  {
    value: 'retrospective-case-series' as const,
    icon: '📋',
    label: 'Retrospective Case Series',
    description: 'Descriptive study analyzing historical patient records or cases'
  },
  {
    value: 'laboratory-investigation' as const,
    icon: '⚗️',
    label: 'Laboratory Investigation',
    description: 'Experimental study with controlled laboratory conditions and assays'
  },
  {
    value: 'technical-note' as const,
    icon: '📝',
    label: 'Technical Note',
    description: 'Novel methodology, technique, or procedural innovation report'
  }
];

export function StudyDesignStep({ onComplete, initialData }: StudyDesignStepProps) {
  const [studyType, setStudyType] = useState<StudyType>(initialData?.studyType || 'rct');
  const [rctConfig, setRctConfig] = useState<RCTConfiguration>(
    initialData?.rctConfig || {
      blindingType: 'double-blind',
      allocationRatio: '1:1',
      blockRandomization: true,
      blockSize: 4,
    }
  );

  const handleStudyTypeChange = (type: StudyType) => {
    setStudyType(type);
  };

  const handleBlindingChange = (blindingType: BlindingType) => {
    setRctConfig(prev => ({ ...prev, blindingType }));
  };

  const handleAllocationChange = (allocationRatio: AllocationRatio) => {
    setRctConfig(prev => ({ ...prev, allocationRatio }));
  };

  const handleCustomRatioChange = (customRatio: string) => {
    setRctConfig(prev => ({ ...prev, customRatio }));
  };

  const handleBlockRandomizationToggle = () => {
    setRctConfig(prev => ({ ...prev, blockRandomization: !prev.blockRandomization }));
  };

  const handleBlockSizeChange = (blockSize: number) => {
    setRctConfig(prev => ({ ...prev, blockSize }));
  };

  const handleComplete = () => {
    onComplete({
      studyType,
      rctConfig: studyType === 'rct' ? rctConfig : undefined,
    });
  };

  const isComplete = studyType !== undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <FlaskConical className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-900">Study Design Configuration</h2>
            <p className="text-sm text-blue-700 mt-1">
              Select your study methodology and configure randomization parameters
            </p>
          </div>
        </div>
      </div>

      {/* Study Methodology Selection */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">Study Methodology</h3>
          <span className="text-red-500">*</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {METHODOLOGY_OPTIONS.map((option) => {
            const isSelected = studyType === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleStudyTypeChange(option.value)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all hover:border-blue-400 hover:shadow-sm ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 shadow-sm'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl flex-shrink-0">{option.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-base font-semibold mb-1 ${
                      isSelected ? 'text-blue-900' : 'text-slate-900'
                    }`}>
                      {option.label}
                    </div>
                    <div className={`text-sm leading-snug ${
                      isSelected ? 'text-blue-700' : 'text-slate-600'
                    }`}>
                      {option.description}
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            Your study methodology determines the protocol structure, statistical approach, and rigor level
          </p>
        </div>
      </div>

      {/* RCT Configuration (Only shown for RCT) */}
      {studyType === 'rct' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
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
          <div className="space-y-3 mb-6">
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
                    rctConfig.blindingType === option.value
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
          <div className="space-y-3 mb-6">
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
                    rctConfig.allocationRatio === option.value
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
                rctConfig.allocationRatio === 'custom'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="font-medium text-sm text-slate-900 mb-2">
                Custom Ratio
              </div>
              {rctConfig.allocationRatio === 'custom' && (
                <input
                  type="text"
                  value={rctConfig.customRatio || ''}
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
                checked={rctConfig.blockRandomization}
                onChange={handleBlockRandomizationToggle}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">
                Use Block Randomization
              </span>
            </label>

            {rctConfig.blockRandomization && (
              <div className="ml-6 space-y-2">
                <label className="text-sm text-slate-600">Block Size</label>
                <select
                  value={rctConfig.blockSize || 4}
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
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Why Randomization Matters:</strong> Proper randomization minimizes
              selection bias and ensures groups are comparable at baseline.
              {rctConfig.blindingType === 'double-blind' && ' Double-blinding additionally reduces performance and detection bias.'}
            </p>
          </div>
        </div>
      )}

      {/* Complete Button */}
      <div className="flex items-center justify-between p-6 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <div className="font-medium text-slate-900">Study design configured</div>
          <div className="text-sm text-slate-600">
            {isComplete
              ? `${METHODOLOGY_OPTIONS.find(o => o.value === studyType)?.label} selected`
              : 'Select a study methodology to continue'}
          </div>
        </div>
        <button
          onClick={handleComplete}
          disabled={!isComplete}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          Complete & Continue
        </button>
      </div>
    </div>
  );
}
