import { Calendar, Users, TrendingUp } from 'lucide-react';
import type { CohortConfiguration } from '../../../types/studyDesigns';

interface CohortConfigurationProps {
  config: CohortConfiguration;
  onChange: (config: CohortConfiguration) => void;
}

export function CohortConfiguration({
  config,
  onChange,
}: CohortConfigurationProps) {
  const handleFollowUpDurationChange = (followUpDuration: string) => {
    onChange({ ...config, followUpDuration });
  };

  const handleFollowUpIntervalChange = (followUpInterval: string) => {
    onChange({ ...config, followUpInterval });
  };

  const handleExposureAssessmentChange = (
    exposureAssessment: CohortConfiguration['exposureAssessment']
  ) => {
    onChange({ ...config, exposureAssessment });
  };

  const handleLossToFollowUpToggle = () => {
    onChange({
      ...config,
      lossToFollowUpTracking: !config.lossToFollowUpTracking,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">
            Cohort Study Configuration
          </h3>
          <p className="text-sm text-slate-600">
            Configure follow-up schedule and exposure assessment
          </p>
        </div>
      </div>

      {/* Follow-Up Duration */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Calendar className="w-4 h-4" />
          Follow-Up Duration
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: '1 year', label: '1 Year', description: 'Short-term' },
            { value: '3 years', label: '3 Years', description: 'Medium-term' },
            { value: '5 years', label: '5 Years', description: 'Long-term' },
            { value: '10 years', label: '10 Years', description: 'Extended' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleFollowUpDurationChange(option.value)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                config.followUpDuration === option.value
                  ? 'border-green-500 bg-green-50'
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

        {/* Custom Duration */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Or specify custom:</span>
          <input
            type="text"
            value={
              !['1 year', '3 years', '5 years', '10 years'].includes(
                config.followUpDuration
              )
                ? config.followUpDuration
                : ''
            }
            onChange={(e) => handleFollowUpDurationChange(e.target.value)}
            placeholder="e.g., 7 years"
            className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Follow-Up Interval */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Calendar className="w-4 h-4" />
          Follow-Up Visit Interval
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: '3 months', label: '3 Months' },
            { value: '6 months', label: '6 Months' },
            { value: '12 months', label: '12 Months' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleFollowUpIntervalChange(option.value)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                config.followUpInterval === option.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="font-medium text-sm text-slate-900">
                {option.label}
              </div>
            </button>
          ))}
        </div>

        {/* Custom Interval */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Or specify custom:</span>
          <input
            type="text"
            value={
              !['3 months', '6 months', '12 months'].includes(
                config.followUpInterval
              )
                ? config.followUpInterval
                : ''
            }
            onChange={(e) => handleFollowUpIntervalChange(e.target.value)}
            placeholder="e.g., 4 months"
            className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Exposure Assessment */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Users className="w-4 h-4" />
          Exposure Assessment Strategy
        </label>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => handleExposureAssessmentChange('baseline-only')}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              config.exposureAssessment === 'baseline-only'
                ? 'border-green-500 bg-green-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="font-medium text-sm text-slate-900 mb-1">
              Baseline Only
            </div>
            <div className="text-xs text-slate-600">
              Exposure measured once at enrollment (e.g., genetic factors,
              historical data)
            </div>
          </button>

          <button
            onClick={() => handleExposureAssessmentChange('time-varying')}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              config.exposureAssessment === 'time-varying'
                ? 'border-green-500 bg-green-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="font-medium text-sm text-slate-900 mb-1">
              Time-Varying
            </div>
            <div className="text-xs text-slate-600">
              Exposure measured repeatedly over time (e.g., medication
              adherence, lifestyle factors)
            </div>
          </button>
        </div>
      </div>

      {/* Loss to Follow-Up Tracking */}
      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={config.lossToFollowUpTracking}
            onChange={handleLossToFollowUpToggle}
            className="w-4 h-4 text-green-600 rounded border-slate-300 focus:ring-2 focus:ring-green-500"
          />
          <span className="text-sm font-medium text-slate-700">
            Track Loss to Follow-Up
          </span>
        </label>
        <p className="text-xs text-slate-600 ml-6">
          Document reasons for missed visits and withdrawal to assess potential
          bias
        </p>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-900">
          <strong>Cohort Study Essentials:</strong> Prospective cohorts excel at
          identifying risk factors and estimating incidence rates. Consistent
          follow-up and exposure tracking are critical for valid causal
          inference.
        </p>
      </div>
    </div>
  );
}
