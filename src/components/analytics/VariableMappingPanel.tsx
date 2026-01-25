/**
 * VariableMappingPanel - AI-assisted statistical variable mapping
 *
 * Mode B (Retrospective): After schema is built, AI analyzes PICO + available
 * variables and suggests statistical role mappings. Users confirm with checkboxes.
 *
 * This closes the loop between data collection and analysis by having the same
 * AI system suggest mappings that it will later use for analysis.
 */

import { useState, useMemo } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Target,
  Shield,
  Users,
  Clock,
  BarChart3,
  Layers,
  XCircle,
  RefreshCw,
  Check,
  Info,
} from 'lucide-react';
import type { SchemaBlock, StatisticalMapping, AIStatisticalPlan, StatisticalRole } from '../protocol-workbench/types';
import { getAllBlocks } from '../protocol-workbench/utils';
import {
  getStatisticalRoleLabel,
  getStatisticalRoleColor,
  groupMappingsByRole,
  parseStatisticalPlanResponse,
  type PICOContext,
  type SchemaBlockInput,
} from '../ai-personas/statistician/StatisticalPlanningAgent';
import { generateStatisticalPlan } from '../../services/geminiService';

interface VariableMappingPanelProps {
  protocolId: string;
  pico: PICOContext;
  schemaBlocks: SchemaBlock[];
  onConfirm: (plan: AIStatisticalPlan) => void;
  onCancel?: () => void;
  existingPlan?: AIStatisticalPlan | null;
}

// Icons for each statistical role
const roleIcons: Record<StatisticalRole, React.ComponentType<{ className?: string }>> = {
  primary_endpoint: Target,
  secondary_endpoint: BarChart3,
  safety_endpoint: Shield,
  baseline_covariate: Users,
  confounder: AlertCircle,
  subgroup_variable: Layers,
  treatment_indicator: CheckCircle2,
  time_variable: Clock,
  excluded: XCircle,
};

export function VariableMappingPanel({
  protocolId,
  pico,
  schemaBlocks,
  onConfirm,
  onCancel,
  existingPlan,
}: VariableMappingPanelProps) {
  const [plan, setPlan] = useState<AIStatisticalPlan | null>(existingPlan || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<StatisticalRole>>(
    new Set(['primary_endpoint', 'secondary_endpoint', 'treatment_indicator', 'baseline_covariate'])
  );

  // Convert SchemaBlock to SchemaBlockInput - flatten nested blocks first
  const schemaBlockInputs: SchemaBlockInput[] = useMemo(() => {
    // DEBUG: Log incoming schemaBlocks
    console.log('📊 [VariableMappingPanel] Incoming schemaBlocks:', schemaBlocks.length);
    console.log('📊 [VariableMappingPanel] First block sample:', schemaBlocks[0]);
    console.log('📊 [VariableMappingPanel] Has children?', schemaBlocks.map(b => ({ id: b.id, childCount: b.children?.length || 0 })));

    // Use getAllBlocks to flatten the tree structure (includes nested children)
    const allBlocks = getAllBlocks(schemaBlocks);
    console.log('📊 [VariableMappingPanel] After getAllBlocks:', allBlocks.length);

    const filtered = allBlocks.filter(block => block.dataType !== 'Section');
    console.log('📊 [VariableMappingPanel] After Section filter:', filtered.length);

    const result = filtered.map(block => ({
        id: block.id,
        label: block.variable?.name || block.customName || 'Unnamed',
        dataType: block.dataType,
        role: block.role,
        endpointTier: block.endpointTier,
        description: block.variable?.name,
        category: block.variable?.category,
      }));

    console.log('📊 [VariableMappingPanel] Final schemaBlockInputs:', result.length);
    console.log('📊 [VariableMappingPanel] Sample inputs:', result.slice(0, 5));

    return result;
  }, [schemaBlocks]);

  // Group mappings by role for display
  const groupedMappings = useMemo(() => {
    if (!plan) return null;
    return groupMappingsByRole(plan.mappings);
  }, [plan]);

  // Count confirmed mappings
  const confirmedCount = useMemo(() => {
    if (!plan) return 0;
    return plan.mappings.filter(m => m.confirmed && m.suggestedRole !== 'excluded').length;
  }, [plan]);

  const totalNonExcluded = useMemo(() => {
    if (!plan) return 0;
    return plan.mappings.filter(m => m.suggestedRole !== 'excluded').length;
  }, [plan]);

  // Generate statistical plan
  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const responseText = await generateStatisticalPlan(pico, schemaBlockInputs);
      const newPlan = parseStatisticalPlanResponse(responseText, protocolId, pico, schemaBlockInputs);

      // Auto-confirm high-confidence mappings (>= 0.85)
      newPlan.mappings = newPlan.mappings.map(m => ({
        ...m,
        confirmed: m.confidence >= 0.85 && m.suggestedRole !== 'excluded',
      }));

      setPlan(newPlan);
    } catch (err) {
      console.error('Failed to generate statistical plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate statistical plan');
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle mapping confirmation
  const toggleMapping = (blockId: string) => {
    if (!plan) return;

    setPlan({
      ...plan,
      mappings: plan.mappings.map(m =>
        m.blockId === blockId ? { ...m, confirmed: !m.confirmed } : m
      ),
    });
  };

  // Toggle group expansion
  const toggleGroup = (role: StatisticalRole) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(role)) {
      newExpanded.delete(role);
    } else {
      newExpanded.add(role);
    }
    setExpandedGroups(newExpanded);
  };

  // Handle confirm
  const handleConfirm = () => {
    if (!plan) return;
    onConfirm({
      ...plan,
      status: 'confirmed',
    });
  };

  // Render confidence badge
  const renderConfidenceBadge = (confidence: number) => {
    const percent = Math.round(confidence * 100);
    let colorClass = 'bg-gray-100 text-gray-600';
    if (percent >= 90) colorClass = 'bg-green-100 text-green-700';
    else if (percent >= 75) colorClass = 'bg-blue-100 text-blue-700';
    else if (percent >= 60) colorClass = 'bg-amber-100 text-amber-700';
    else colorClass = 'bg-red-100 text-red-700';

    return (
      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${colorClass}`}>
        {percent}%
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Statistical Plan</h2>
            <p className="text-sm text-purple-100">
              Map your variables to statistical roles for analysis
            </p>
          </div>
        </div>
      </div>

      {/* PICO Context */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Based on your PICO framework</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-slate-500">Population:</span>{' '}
            <span className="text-slate-700">{pico.population || 'Not specified'}</span>
          </div>
          <div>
            <span className="text-slate-500">Intervention:</span>{' '}
            <span className="text-slate-700">{pico.intervention || 'Not specified'}</span>
          </div>
          <div>
            <span className="text-slate-500">Comparison:</span>{' '}
            <span className="text-slate-700">{pico.comparison || 'Not specified'}</span>
          </div>
          <div>
            <span className="text-slate-500">Outcome:</span>{' '}
            <span className="text-slate-700">{pico.outcome || 'Not specified'}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {!plan ? (
          /* Initial State - Generate Button */
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Generate Statistical Plan
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              AI will analyze your {schemaBlockInputs.length} schema variables and suggest
              statistical roles based on your PICO framework.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Analyzing {schemaBlockInputs.length} variables...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate AI Suggestions
                </>
              )}
            </button>
          </div>
        ) : (
          /* Mappings Display */
          <div className="space-y-4">
            {/* Progress indicator */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-slate-700">
                  {confirmedCount} of {totalNonExcluded} variables confirmed
                </span>
              </div>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </button>
            </div>

            {/* Grouped mappings */}
            {groupedMappings &&
              Array.from(groupedMappings.entries()).map(([role, mappings]) => {
                if (mappings.length === 0 && role === 'excluded') return null;

                const Icon = roleIcons[role];
                const isExpanded = expandedGroups.has(role);
                const confirmedInGroup = mappings.filter(m => m.confirmed).length;

                return (
                  <div
                    key={role}
                    className={`border rounded-lg overflow-hidden ${
                      role === 'excluded' ? 'border-gray-200' : 'border-slate-200'
                    }`}
                  >
                    {/* Group Header */}
                    <button
                      onClick={() => toggleGroup(role)}
                      className={`flex items-center justify-between w-full p-3 text-left transition-colors ${
                        role === 'excluded'
                          ? 'bg-gray-50 hover:bg-gray-100'
                          : role === 'primary_endpoint'
                          ? 'bg-purple-50 hover:bg-purple-100'
                          : role === 'safety_endpoint'
                          ? 'bg-red-50 hover:bg-red-100'
                          : role === 'treatment_indicator'
                          ? 'bg-green-50 hover:bg-green-100'
                          : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        )}
                        <Icon
                          className={`w-4 h-4 ${
                            role === 'excluded'
                              ? 'text-gray-500'
                              : role === 'primary_endpoint'
                              ? 'text-purple-600'
                              : role === 'safety_endpoint'
                              ? 'text-red-600'
                              : role === 'treatment_indicator'
                              ? 'text-green-600'
                              : 'text-slate-600'
                          }`}
                        />
                        <span className="font-medium text-slate-900">
                          {getStatisticalRoleLabel(role)}
                        </span>
                        <span className="text-sm text-slate-500">({mappings.length})</span>
                      </div>
                      {role !== 'excluded' && (
                        <span className="text-xs text-slate-500">
                          {confirmedInGroup}/{mappings.length} confirmed
                        </span>
                      )}
                    </button>

                    {/* Group Items */}
                    {isExpanded && mappings.length > 0 && (
                      <div className="divide-y divide-slate-100">
                        {mappings.map(mapping => (
                          <div
                            key={mapping.blockId}
                            className={`p-3 flex items-start gap-3 ${
                              mapping.confirmed ? 'bg-white' : 'bg-slate-50'
                            }`}
                          >
                            {/* Checkbox */}
                            <button
                              onClick={() => toggleMapping(mapping.blockId)}
                              className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                mapping.confirmed
                                  ? 'bg-purple-600 border-purple-600 text-white'
                                  : 'border-slate-300 hover:border-purple-400'
                              }`}
                            >
                              {mapping.confirmed && <Check className="w-3 h-3" />}
                            </button>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-medium ${
                                    mapping.confirmed ? 'text-slate-900' : 'text-slate-600'
                                  }`}
                                >
                                  {mapping.blockLabel}
                                </span>
                                {renderConfidenceBadge(mapping.confidence)}
                              </div>
                              <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">
                                {mapping.reasoning}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Empty state for group */}
                    {isExpanded && mappings.length === 0 && (
                      <div className="p-4 text-center text-sm text-slate-500">
                        No variables assigned to this role
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Footer */}
      {plan && (
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Confirm your variable mappings to proceed with analysis
          </p>
          <div className="flex items-center gap-3">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleConfirm}
              disabled={confirmedCount === 0}
              className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Mappings ({confirmedCount})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VariableMappingPanel;
