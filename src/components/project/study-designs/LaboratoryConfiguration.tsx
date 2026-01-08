import { Beaker, Target, CheckCircle2 } from 'lucide-react';
import type { LaboratoryConfiguration } from '../../../types/studyDesigns';

interface LaboratoryConfigurationProps {
  config: LaboratoryConfiguration;
  onChange: (config: LaboratoryConfiguration) => void;
}

export function LaboratoryConfiguration({
  config,
  onChange,
}: LaboratoryConfigurationProps) {
  const handleReplicatesChange = (replicates: number) => {
    onChange({ ...config, replicates });
  };

  const handlePrecisionChange = (
    measurementPrecision: LaboratoryConfiguration['measurementPrecision']
  ) => {
    onChange({ ...config, measurementPrecision });
  };

  const handleQCToggle = () => {
    onChange({
      ...config,
      qualityControlSamples: !config.qualityControlSamples,
    });
  };

  const handleValidationToggle = () => {
    onChange({
      ...config,
      instrumentValidation: !config.instrumentValidation,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
          <Beaker className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">
            Laboratory Investigation Configuration
          </h3>
          <p className="text-sm text-slate-600">
            Configure measurement precision and quality control
          </p>
        </div>
      </div>

      {/* Number of Replicates */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Target className="w-4 h-4" />
          Number of Technical Replicates
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[2, 3, 4, 6].map((num) => (
            <button
              key={num}
              onClick={() => handleReplicatesChange(num)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                config.replicates === num
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="font-semibold text-slate-900">{num}×</div>
              <div className="text-xs text-slate-600 mt-0.5">
                {num === 3 ? 'Standard' : num === 6 ? 'High' : ''}
              </div>
            </button>
          ))}
        </div>

        {/* Custom Replicates */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Custom number:</span>
          <input
            type="number"
            min={1}
            max={20}
            value={config.replicates}
            onChange={(e) => handleReplicatesChange(parseInt(e.target.value) || 3)}
            className="w-20 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
          <span className="text-sm text-slate-600">replicates per condition</span>
        </div>

        <p className="text-xs text-slate-600">
          More replicates improve precision but increase time and cost
        </p>
      </div>

      {/* Measurement Precision */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Target className="w-4 h-4" />
          Measurement Precision Level
        </label>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => handlePrecisionChange('standard')}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              config.measurementPrecision === 'standard'
                ? 'border-amber-500 bg-amber-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="font-medium text-sm text-slate-900 mb-1">
              Standard Precision
            </div>
            <div className="text-xs text-slate-600">
              CV ≤ 10%, suitable for most assays, routine measurements
            </div>
          </button>

          <button
            onClick={() => handlePrecisionChange('high')}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              config.measurementPrecision === 'high'
                ? 'border-amber-500 bg-amber-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="font-medium text-sm text-slate-900 mb-1">
              High Precision
            </div>
            <div className="text-xs text-slate-600">
              CV ≤ 5%, required for quantitative assays, critical measurements
            </div>
          </button>

          <button
            onClick={() => handlePrecisionChange('ultra-high')}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              config.measurementPrecision === 'ultra-high'
                ? 'border-amber-500 bg-amber-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="font-medium text-sm text-slate-900 mb-1">
              Ultra-High Precision
            </div>
            <div className="text-xs text-slate-600">
              CV ≤ 2%, for regulatory submissions, method validation
            </div>
          </button>
        </div>
      </div>

      {/* Quality Control */}
      <div className="space-y-4">
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.qualityControlSamples}
              onChange={handleQCToggle}
              className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-2 focus:ring-amber-500"
            />
            <span className="text-sm font-medium text-slate-700">
              Include Quality Control Samples
            </span>
          </label>
          <p className="text-xs text-slate-600 ml-6">
            Run positive/negative controls and reference standards with each
            batch
          </p>
        </div>

        {config.qualityControlSamples && (
          <div className="ml-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-amber-700 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-amber-900">
                  QC Samples Included
                </div>
                <div className="text-xs text-amber-700 mt-1">
                  System will track QC pass/fail rates and generate control
                  charts
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.instrumentValidation}
              onChange={handleValidationToggle}
              className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-2 focus:ring-amber-500"
            />
            <span className="text-sm font-medium text-slate-700">
              Instrument Calibration & Validation
            </span>
          </label>
          <p className="text-xs text-slate-600 ml-6">
            Document calibration curves, linearity, accuracy, and precision
          </p>
        </div>

        {config.instrumentValidation && (
          <div className="ml-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-amber-700 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-amber-900">
                  Validation Protocol Active
                </div>
                <div className="text-xs text-amber-700 mt-1">
                  System will generate validation reports: linearity (R² ≥ 0.99),
                  accuracy (95-105%), precision (CV)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-900">
          <strong>Laboratory Excellence:</strong> Reproducible results require
          adequate replication, appropriate precision targets, and robust QC.
          Document everything for regulatory compliance.
        </p>
      </div>
    </div>
  );
}
