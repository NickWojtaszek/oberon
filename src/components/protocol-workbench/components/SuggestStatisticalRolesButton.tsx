/**
 * SuggestStatisticalRolesButton - Trigger AI statistical role suggestions
 *
 * Mode A (Semi-automated): Button in Schema Builder that triggers AI analysis
 * of schema blocks and suggests statistical roles based on PICO framework.
 */

import { useState } from 'react';
import { Sparkles, RefreshCw, CheckCircle2, AlertCircle, X } from 'lucide-react';
import type { SchemaBlock, StatisticalRole, AIStatisticalPlan } from '../types';
import { generateStatisticalPlan } from '../../../services/geminiService';
import {
  parseStatisticalPlanResponse,
  groupMappingsByRole,
  getStatisticalRoleLabel,
  type PICOContext,
  type SchemaBlockInput,
} from '../../ai-personas/statistician/StatisticalPlanningAgent';

interface SuggestStatisticalRolesButtonProps {
  pico: PICOContext;
  schemaBlocks: SchemaBlock[];
  protocolId: string;
  onSuggestionsGenerated: (plan: AIStatisticalPlan) => void;
  disabled?: boolean;
}

export function SuggestStatisticalRolesButton({
  pico,
  schemaBlocks,
  protocolId,
  onSuggestionsGenerated,
  disabled = false,
}: SuggestStatisticalRolesButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [plan, setPlan] = useState<AIStatisticalPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Convert SchemaBlock to SchemaBlockInput
  const schemaBlockInputs: SchemaBlockInput[] = schemaBlocks
    .filter(block => block.dataType !== 'Section')
    .map(block => ({
      id: block.id,
      label: block.variable?.name || block.customName || 'Unnamed',
      dataType: block.dataType,
      role: block.role,
      endpointTier: block.endpointTier,
      description: block.variable?.name,
      category: block.variable?.category,
    }));

  const handleGenerate = async () => {
    if (schemaBlockInputs.length === 0) {
      setError('No schema blocks to analyze. Add variables to your schema first.');
      return;
    }

    if (!pico.population && !pico.intervention && !pico.outcome) {
      setError('PICO framework is empty. Define your research question first.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const responseText = await generateStatisticalPlan(pico, schemaBlockInputs);
      const newPlan = parseStatisticalPlanResponse(responseText, protocolId, pico, schemaBlockInputs);

      // Auto-confirm high-confidence mappings
      newPlan.mappings = newPlan.mappings.map(m => ({
        ...m,
        confirmed: m.confidence >= 0.85 && m.suggestedRole !== 'excluded',
      }));

      setPlan(newPlan);
      setShowResults(true);
      onSuggestionsGenerated(newPlan);
    } catch (err) {
      console.error('Failed to generate statistical plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate suggestions');
    } finally {
      setIsGenerating(false);
    }
  };

  // Summary stats for results
  const summaryStats = plan ? {
    total: plan.mappings.length,
    excluded: plan.mappings.filter(m => m.suggestedRole === 'excluded').length,
    primaryEndpoints: plan.mappings.filter(m => m.suggestedRole === 'primary_endpoint').length,
    secondaryEndpoints: plan.mappings.filter(m => m.suggestedRole === 'secondary_endpoint').length,
    safetyEndpoints: plan.mappings.filter(m => m.suggestedRole === 'safety_endpoint').length,
    treatmentIndicators: plan.mappings.filter(m => m.suggestedRole === 'treatment_indicator').length,
    covariates: plan.mappings.filter(m => m.suggestedRole === 'baseline_covariate').length,
  } : null;

  return (
    <div className="relative">
      {/* Main Button */}
      <button
        onClick={handleGenerate}
        disabled={disabled || isGenerating || schemaBlockInputs.length === 0}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          isGenerating
            ? 'bg-purple-100 text-purple-700 cursor-wait'
            : disabled || schemaBlockInputs.length === 0
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow'
        }`}
        title={
          schemaBlockInputs.length === 0
            ? 'Add schema blocks first'
            : 'Generate AI statistical role suggestions based on PICO'
        }
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Suggest Statistical Roles</span>
          </>
        )}
      </button>

      {/* Error Toast */}
      {error && (
        <div className="absolute top-full left-0 mt-2 z-50 w-72 p-3 bg-red-50 border border-red-200 rounded-lg shadow-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Results Summary Toast */}
      {showResults && plan && summaryStats && (
        <div className="absolute top-full left-0 mt-2 z-50 w-80 p-4 bg-white border border-slate-200 rounded-lg shadow-lg">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-medium text-slate-900">Suggestions Generated</span>
            </div>
            <button
              onClick={() => setShowResults(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Variables analyzed:</span>
              <span className="font-medium text-slate-900">{summaryStats.total}</span>
            </div>
            {summaryStats.primaryEndpoints > 0 && (
              <div className="flex justify-between">
                <span className="text-purple-600">Primary Endpoints:</span>
                <span className="font-medium text-purple-700">{summaryStats.primaryEndpoints}</span>
              </div>
            )}
            {summaryStats.secondaryEndpoints > 0 && (
              <div className="flex justify-between">
                <span className="text-blue-600">Secondary Endpoints:</span>
                <span className="font-medium text-blue-700">{summaryStats.secondaryEndpoints}</span>
              </div>
            )}
            {summaryStats.safetyEndpoints > 0 && (
              <div className="flex justify-between">
                <span className="text-red-600">Safety Endpoints:</span>
                <span className="font-medium text-red-700">{summaryStats.safetyEndpoints}</span>
              </div>
            )}
            {summaryStats.treatmentIndicators > 0 && (
              <div className="flex justify-between">
                <span className="text-green-600">Treatment Indicators:</span>
                <span className="font-medium text-green-700">{summaryStats.treatmentIndicators}</span>
              </div>
            )}
            {summaryStats.covariates > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">Baseline Covariates:</span>
                <span className="font-medium text-slate-700">{summaryStats.covariates}</span>
              </div>
            )}
            {summaryStats.excluded > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Excluded:</span>
                <span className="font-medium text-gray-600">{summaryStats.excluded}</span>
              </div>
            )}
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Check the Variable Mapping panel in Analytics to review and confirm suggestions.
          </p>
        </div>
      )}
    </div>
  );
}

export default SuggestStatisticalRolesButton;
