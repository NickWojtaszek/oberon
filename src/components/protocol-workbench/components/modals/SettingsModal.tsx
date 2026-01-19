import { X, Save, ChevronUp, ChevronDown, FolderTree, Target, Activity, Tag as TagIcon, Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { SchemaBlock, DataType, RoleTag } from '../../types';
import { commonUnits, enumerationTemplates } from '../../constants';
import { suggestFieldConfiguration, isGeminiConfigured, type SchemaFieldSuggestion } from '../../../../services/geminiService';

interface SettingsModalProps {
  block: SchemaBlock;
  onClose: () => void;
  onSave: (blockId: string, updates: Partial<SchemaBlock>) => void;
  // Ordering controls (optional for backward compatibility)
  availableSections?: SchemaBlock[];
  onMoveUp?: (blockId: string) => void;
  onMoveDown?: (blockId: string) => void;
  onChangeParent?: (blockId: string, newParentId: string | undefined) => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  // AI suggestions context (optional)
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

export function SettingsModal({
  block,
  onClose,
  onSave,
  availableSections = [],
  onMoveUp,
  onMoveDown,
  onChangeParent,
  canMoveUp = false,
  canMoveDown = false,
  aiSuggestionsEnabled = true,
  protocolContext,
}: SettingsModalProps) {
  const { t } = useTranslation(['ui', 'protocol', 'common']);
  const [localBlock, setLocalBlock] = useState<SchemaBlock>(block);

  // AI suggestion state
  const [aiSuggestion, setAiSuggestion] = useState<SchemaFieldSuggestion | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  // Filter out self and descendants from available sections (prevent circular nesting)
  // Get all descendant IDs of the current block
  const getDescendantIds = (b: SchemaBlock): string[] => {
    const ids = [b.id];
    if (b.children) {
      b.children.forEach(child => ids.push(...getDescendantIds(child)));
    }
    return ids;
  };
  const excludedIds = new Set(getDescendantIds(block));
  const validSections = availableSections.filter(section => !excludedIds.has(section.id));

  // Classification options
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

  useEffect(() => {
    setLocalBlock(block);
  }, [block]);

  // Load AI suggestions when modal opens (if enabled and not a Section)
  useEffect(() => {
    if (aiSuggestionsEnabled && protocolContext && block.dataType !== 'Section') {
      loadAISuggestions();
    }
  }, [block.variable.name, aiSuggestionsEnabled, protocolContext, block.dataType]);

  const loadAISuggestions = async () => {
    // Early exit if Gemini not configured
    if (!isGeminiConfigured()) {
      console.log('[SettingsModal] Gemini API not configured - skipping AI suggestions');
      setSuggestionError('AI suggestions require Gemini API configuration in Settings');
      return;
    }

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

    setLocalBlock(prev => ({
      ...prev,
      role: aiSuggestion.role as RoleTag,
      endpointTier: aiSuggestion.endpointTier,
      analysisMethod: aiSuggestion.analysisMethod,
      dataType: aiSuggestion.dataType as DataType,
      // Apply dependencies if suggested
      conditionalDependencies: aiSuggestion.suggestedDependencies?.map(dep => ({
        id: `dep-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        targetFieldName: dep.targetFieldName,
        conditionType: dep.conditionType,
        conditionOperator: dep.conditionOperator,
        conditionValue: dep.conditionValue,
      })) || prev.conditionalDependencies,
    }));
  };

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
            <h2 className="font-semibold text-slate-900">{t('ui:protocolWorkbench.settingsModal.title')}</h2>
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
          {/* Classification Section - Only for non-Section blocks */}
          {block.dataType !== 'Section' && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <TagIcon className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-semibold text-purple-900">Classification</h3>
                {loadingSuggestion && (
                  <div className="flex items-center gap-1.5 ml-auto">
                    <Loader2 className="w-3.5 h-3.5 text-purple-600 animate-spin" />
                    <span className="text-xs text-purple-600">Dr. Puck analyzing...</span>
                  </div>
                )}
              </div>

              {/* Classification Fields - MOVED ABOVE AI suggestions to prevent UI jumping */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {/* Role */}
                <div>
                  <label className="flex items-center gap-1 text-xs font-medium text-slate-700 mb-1.5">
                    <TagIcon className="w-3 h-3" />
                    {t('protocol:configHUD.role')}
                  </label>
                  <select
                    value={localBlock.role}
                    onChange={(e) => updateField('role', e.target.value as RoleTag)}
                    className="w-full text-sm border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    value={localBlock.endpointTier || ''}
                    onChange={(e) =>
                      updateField('endpointTier', e.target.value ? (e.target.value as 'primary' | 'secondary' | 'exploratory') : null)
                    }
                    className="w-full text-sm border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    value={localBlock.analysisMethod || ''}
                    onChange={(e) =>
                      updateField('analysisMethod', e.target.value ? (e.target.value as 'survival' | 'frequency' | 'mean-comparison' | 'non-parametric' | 'chi-square') : null)
                    }
                    className="w-full text-sm border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {analysisMethods.map((method) => (
                      <option key={method.label} value={method.value || ''}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* AI Suggestion Banner - NOW BELOW the form fields so loading doesn't cause jumps */}
              {aiSuggestionsEnabled && (
                <div className="border-t border-purple-200 pt-3">
                  {/* Loading State */}
                  {loadingSuggestion && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                      <span className="text-xs text-purple-700">Dr. Puck is analyzing this field...</span>
                    </div>
                  )}

                  {/* Suggestion Ready */}
                  {!loadingSuggestion && !suggestionError && aiSuggestion && (
                    <div className="bg-white/70 border border-purple-300 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-purple-900 mb-2">
                            Dr. Puck's Suggestions
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            <div>
                              <span className="text-purple-700">Role:</span>{' '}
                              <span className="font-semibold text-purple-900">{aiSuggestion.role}</span>
                              <span className="text-purple-500 ml-1">({aiSuggestion.roleConfidence}%)</span>
                            </div>
                            <div>
                              <span className="text-purple-700">Endpoint:</span>{' '}
                              <span className="font-semibold text-purple-900">{aiSuggestion.endpointTier || 'None'}</span>
                              <span className="text-purple-500 ml-1">({aiSuggestion.endpointConfidence}%)</span>
                            </div>
                            <div>
                              <span className="text-purple-700">Analysis:</span>{' '}
                              <span className="font-semibold text-purple-900">{aiSuggestion.analysisMethod || 'None'}</span>
                              <span className="text-purple-500 ml-1">({aiSuggestion.analysisConfidence}%)</span>
                            </div>
                            <div>
                              <span className="text-purple-700">Data Type:</span>{' '}
                              <span className="font-semibold text-purple-900">{aiSuggestion.dataType}</span>
                              <span className="text-purple-500 ml-1">({aiSuggestion.dataTypeConfidence}%)</span>
                            </div>
                          </div>
                          {/* Dependencies suggestion */}
                          {aiSuggestion.suggestedDependencies && aiSuggestion.suggestedDependencies.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-purple-200">
                              <div className="text-xs text-purple-700 mb-1">Suggested Dependencies:</div>
                              {aiSuggestion.suggestedDependencies.map((dep, idx) => (
                                <div key={idx} className="text-xs bg-purple-50 rounded px-2 py-1 mb-1">
                                  <span className="font-medium text-purple-900">
                                    {dep.conditionType} when "{dep.targetFieldName}" {dep.conditionOperator} {dep.conditionValue || 'any value'}
                                  </span>
                                  <span className="text-purple-500 ml-1">({dep.confidence}%)</span>
                                  <div className="text-purple-600 text-[10px] mt-0.5">{dep.reasoning}</div>
                                </div>
                              ))}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              applyAISuggestion();
                            }}
                            className="mt-2 text-xs px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Apply All Suggestions
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error State */}
                  {!loadingSuggestion && suggestionError && (
                    <div className="bg-amber-50 border border-amber-200 rounded p-2 flex items-center justify-between">
                      <span className="text-xs text-amber-800">{suggestionError}</span>
                      <button
                        onClick={loadAISuggestions}
                        disabled={loadingSuggestion}
                        className="text-xs px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {/* No Protocol Context Info */}
                  {!loadingSuggestion && !protocolContext && !suggestionError && !aiSuggestion && (
                    <div className="bg-slate-50 border border-slate-200 rounded p-2">
                      <span className="text-xs text-slate-600">
                        💡 Dr. Puck suggestions available when protocol context is provided (PICO objectives, study phase, etc.)
                      </span>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* Data Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {t('ui:protocolWorkbench.settingsModal.dataType')}
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
                {t('ui:protocolWorkbench.settingsModal.unit')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={localBlock.unit || ''}
                  onChange={(e) => updateField('unit', e.target.value)}
                  placeholder={t('ui:protocolWorkbench.settingsModal.unitPlaceholder')}
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  onChange={(e) => updateField('unit', e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('ui:protocolWorkbench.settingsModal.quickSelect')}</option>
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
                  {t('ui:protocolWorkbench.settingsModal.minValue')}
                </label>
                <input
                  type="number"
                  value={localBlock.minValue ?? ''}
                  onChange={(e) =>
                    updateField('minValue', e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder={t('ui:protocolWorkbench.settingsModal.minPlaceholder')}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t('ui:protocolWorkbench.settingsModal.maxValue')}
                </label>
                <input
                  type="number"
                  value={localBlock.maxValue ?? ''}
                  onChange={(e) =>
                    updateField('maxValue', e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder={t('ui:protocolWorkbench.settingsModal.maxPlaceholder')}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Clinical Range (for Continuous) */}
          {localBlock.dataType === 'Continuous' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t('ui:protocolWorkbench.settingsModal.clinicalRange')}
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
                {t('ui:protocolWorkbench.settingsModal.options')}
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
                {t('ui:protocolWorkbench.settingsModal.matrixRows')}
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
                  {t('ui:protocolWorkbench.settingsModal.gridItems')}
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
                  {t('ui:protocolWorkbench.settingsModal.gridCategories')}
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

          {/* Position & Nesting Section */}
          {(onMoveUp || onMoveDown || onChangeParent) && (
            <div className="border-t border-slate-200 pt-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <FolderTree className="w-4 h-4 text-slate-600" />
                <label className="text-sm font-medium text-slate-700">
                  Position & Nesting
                </label>
              </div>

              {/* Parent Section Selector */}
              {onChangeParent && (
                <div className="mb-4">
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    Parent Section
                  </label>
                  <select
                    value={localBlock.parentId || 'root'}
                    onChange={(e) => {
                      const newParentId = e.target.value === 'root' ? undefined : e.target.value;
                      // Update local state first for immediate UI feedback
                      setLocalBlock(prev => ({ ...prev, parentId: newParentId }));
                      // Then update the actual schema
                      onChangeParent(block.id, newParentId);
                    }}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="root">Root Level (No Parent)</option>
                    {validSections.map(section => (
                      <option key={section.id} value={section.id}>
                        {section.customName || section.variable.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Move this block into a different section
                  </p>
                </div>
              )}

              {/* Move Up/Down Buttons */}
              {(onMoveUp || onMoveDown) && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    Position Within Current Container
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onMoveUp?.(block.id)}
                      disabled={!canMoveUp}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <ChevronUp className="w-4 h-4" />
                      Move Up
                    </button>
                    <button
                      onClick={() => onMoveDown?.(block.id)}
                      disabled={!canMoveDown}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <ChevronDown className="w-4 h-4" />
                      Move Down
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {t('ui:protocolWorkbench.settingsModal.cancel')}
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            {t('ui:protocolWorkbench.settingsModal.saveChanges')}
          </button>
        </div>
      </div>
    </div>
  );
}