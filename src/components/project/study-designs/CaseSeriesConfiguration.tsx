import { Grid3x3, Clock, TrendingUp } from 'lucide-react';
import type { CaseSeriesConfiguration } from '../../../types/studyDesigns';

interface CaseSeriesConfigurationProps {
  config: CaseSeriesConfiguration;
  onChange: (config: CaseSeriesConfiguration) => void;
}

export function CaseSeriesConfiguration({
  config,
  onChange,
}: CaseSeriesConfigurationProps) {
  const handleDeepPhenotypingToggle = () => {
    onChange({ ...config, deepPhenotyping: !config.deepPhenotyping });
  };

  const handleTemporalGranularityChange = (
    temporalGranularity: CaseSeriesConfiguration['temporalGranularity']
  ) => {
    onChange({ ...config, temporalGranularity });
  };

  const handleLongitudinalToggle = () => {
    onChange({
      ...config,
      includeLongitudinalTracking: !config.includeLongitudinalTracking,
    });
  };

  const handleMultipleTimepointsToggle = () => {
    onChange({ ...config, multipleTimepoints: !config.multipleTimepoints });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Grid3x3 className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">
            Case Series Configuration
          </h3>
          <p className="text-sm text-slate-600">
            Configure data granularity and temporal tracking
          </p>
        </div>
      </div>

      {/* Deep Phenotyping Toggle */}
      <div className="p-4 border-2 border-purple-200 bg-purple-50 rounded-lg">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.deepPhenotyping}
            onChange={handleDeepPhenotypingToggle}
            className="mt-1 w-5 h-5 text-purple-600 rounded border-slate-300 focus:ring-2 focus:ring-purple-500"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-slate-900">
                Enable Deep Phenotyping
              </span>
              <span className="px-2 py-0.5 bg-purple-200 text-purple-800 text-xs font-medium rounded">
                Recommended
              </span>
            </div>
            <p className="text-sm text-slate-700">
              Prioritizes high-granularity categorical grids for detailed case
              characterization. Automatically generates comprehensive variable
              collections for symptoms, diagnostics, and outcomes.
            </p>
          </div>
        </label>
      </div>

      {/* Temporal Granularity */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Clock className="w-4 h-4" />
          Temporal Granularity
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              value: 'daily',
              label: 'Daily',
              description: 'Day-by-day tracking',
            },
            {
              value: 'weekly',
              label: 'Weekly',
              description: 'Week-by-week tracking',
            },
            {
              value: 'monthly',
              label: 'Monthly',
              description: 'Month-by-month tracking',
            },
            {
              value: 'event-based',
              label: 'Event-Based',
              description: 'Track key events',
            },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() =>
                handleTemporalGranularityChange(
                  option.value as CaseSeriesConfiguration['temporalGranularity']
                )
              }
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                config.temporalGranularity === option.value
                  ? 'border-purple-500 bg-purple-50'
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

      {/* Longitudinal Tracking */}
      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={config.includeLongitudinalTracking}
            onChange={handleLongitudinalToggle}
            className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-2 focus:ring-purple-500"
          />
          <span className="text-sm font-medium text-slate-700">
            Include Longitudinal Tracking
          </span>
        </label>
        <p className="text-xs text-slate-600 ml-6">
          Track changes over time for each case (symptoms, labs, imaging)
        </p>
      </div>

      {/* Multiple Timepoints */}
      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={config.multipleTimepoints}
            onChange={handleMultipleTimepointsToggle}
            className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-2 focus:ring-purple-500"
          />
          <span className="text-sm font-medium text-slate-700">
            Enable Multiple Timepoint Data Entry
          </span>
        </label>
        <p className="text-xs text-slate-600 ml-6">
          Allow repeated measurements at different visits (e.g., Baseline, Week 4,
          Week 12)
        </p>
      </div>

      {/* Preview: What Gets Generated */}
      {config.deepPhenotyping && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-slate-600" />
            <h4 className="text-sm font-semibold text-slate-900">
              Auto-Generated Schema Sections
            </h4>
          </div>
          <ul className="space-y-1.5 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              Demographics & Baseline Characteristics
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              Clinical Presentation (Symptom Grid)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              Laboratory Values (Comprehensive Panel)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              Imaging Findings (Categorical Grid)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              Treatment Details & Timeline
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              Outcomes & Follow-Up
            </li>
          </ul>
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-sm text-purple-900">
          <strong>Deep Phenotyping Benefits:</strong> Case series shine when you
          capture rich, detailed data. This configuration prioritizes comprehensive
          variable collections to identify patterns and generate hypotheses for
          future studies.
        </p>
      </div>
    </div>
  );
}
