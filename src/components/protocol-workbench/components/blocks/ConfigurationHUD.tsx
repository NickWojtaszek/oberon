import { Target, Activity, Tag as TagIcon, Sparkles, CheckCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import type { SchemaBlock, RoleTag } from '../../types';
import { suggestFieldConfiguration, type SchemaFieldSuggestion } from '../../../../services/geminiService';

interface ConfigurationHUDProps {
  block: SchemaBlock;
  onUpdate: (blockId: string, updates: Partial<SchemaBlock>) => void;
  aiSuggestionsEnabled?: boolean;
  protocolContext?: {
    primaryObjective?: string;
    secondaryObjectives?: string;
    statisticalPlan?: string;
    studyPhase?: string;
    therapeuticArea?: string;
    fullProtocolText?: string;
    existingFields?: Array<{
      name: string;
      role: string;
      endpointTier: string | null;
    }>;
  };
}

export function ConfigurationHUD({ block, onUpdate, aiSuggestionsEnabled = true, protocolContext }: ConfigurationHUDProps) {
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

  const [aiSuggestion, setAiSuggestion] = useState<SchemaFieldSuggestion | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(true);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  // Load AI suggestions when component mounts (if enabled)
  useEffect(() => {
    if (aiSuggestionsEnabled && protocolContext && showAISuggestions) {
      loadAISuggestions();
    }
  }, [block.variable.name, aiSuggestionsEnabled]);

  const loadAISuggestions = async () => {
    setLoadingSuggestion(true);
    setSuggestionError(null);

    try {
      const suggestion = await suggestFieldConfiguration(
        block.variable.name,
        protocolContext || {}
      );
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error('AI suggestion failed:', error);
      setSuggestionError('AI suggestions temporarily unavailable');
    } finally {
      setLoadingSuggestion(false);
    }
  };

  const applyAISuggestion = () => {
    if (!aiSuggestion) return;

    onUpdate(block.id, {
      role: aiSuggestion.role as RoleTag,
      endpointTier: aiSuggestion.endpointTier,
      analysisMethod: aiSuggestion.analysisMethod,
    });

    setShowAISuggestions(false);
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg p-3 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* AI Suggestion Banner */}
      {aiSuggestionsEnabled && !suggestionError && aiSuggestion && showAISuggestions && (
        <div className="mb-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-purple-900 mb-1.5">
                Dr. Puck's Suggestions
              </div>
              <div className="text-xs text-purple-800 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Role:</span>
                  <span className="font-semibold">{aiSuggestion.role}</span>
                  <span className="text-purple-600">({aiSuggestion.roleConfidence}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Endpoint:</span>
                  <span className="font-semibold">{aiSuggestion.endpointTier || 'None'}</span>
                  <span className="text-purple-600">({aiSuggestion.endpointConfidence}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Analysis:</span>
                  <span className="font-semibold">{aiSuggestion.analysisMethod || 'None'}</span>
                  <span className="text-purple-600">({aiSuggestion.analysisConfidence}%)</span>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={applyAISuggestion}
                  className="text-xs px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3" />
                  Apply All
                </button>
                <button
                  onClick={() => setShowAISuggestions(false)}
                  className="text-xs px-3 py-1.5 border border-purple-300 text-purple-700 rounded hover:bg-purple-50 transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {aiSuggestionsEnabled && loadingSuggestion && (
        <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
          <span className="text-xs text-blue-900">Dr. Puck is analyzing protocol context...</span>
        </div>
      )}

      {/* Error State */}
      {aiSuggestionsEnabled && suggestionError && (
        <div className="mb-3 bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-center gap-2">
          <span className="text-xs text-amber-800">{suggestionError}</span>
        </div>
      )}

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