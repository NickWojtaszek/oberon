import { FileText, Image, BookOpen } from 'lucide-react';
import type { TechnicalNoteConfiguration } from '../../../types/studyDesigns';

interface TechnicalNoteConfigurationProps {
  config: TechnicalNoteConfiguration;
  onChange: (config: TechnicalNoteConfiguration) => void;
}

export function TechnicalNoteConfiguration({
  config,
  onChange,
}: TechnicalNoteConfigurationProps) {
  const handleCaseCountChange = (caseCount: number) => {
    onChange({ ...config, caseCount });
  };

  const handleImagingToggle = () => {
    onChange({ ...config, includeImaging: !config.includeImaging });
  };

  const handleLiteratureToggle = () => {
    onChange({
      ...config,
      includeLiteratureReview: !config.includeLiteratureReview,
    });
  };

  const handleNarrativeFocusChange = (
    narrativeFocus: TechnicalNoteConfiguration['narrativeFocus']
  ) => {
    onChange({ ...config, narrativeFocus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">
            Technical Note / Case Report Configuration
          </h3>
          <p className="text-sm text-slate-600">
            Configure case reporting and narrative structure
          </p>
        </div>
      </div>

      {/* Number of Cases */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <FileText className="w-4 h-4" />
          Number of Cases
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => handleCaseCountChange(num)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                config.caseCount === num
                  ? 'border-slate-500 bg-slate-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="font-semibold text-slate-900">
                {num} Case{num > 1 ? 's' : ''}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                {num === 1
                  ? 'Single case'
                  : num === 2
                  ? 'Comparison'
                  : 'Series'}
              </div>
            </button>
          ))}
        </div>

        {/* Custom Case Count */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Or specify:</span>
          <input
            type="number"
            min={1}
            max={10}
            value={config.caseCount}
            onChange={(e) => handleCaseCountChange(parseInt(e.target.value) || 1)}
            className="w-20 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
          />
          <span className="text-sm text-slate-600">cases (max 10)</span>
        </div>

        <p className="text-xs text-slate-600">
          Technical notes typically report 1-5 cases with detailed narrative
        </p>
      </div>

      {/* Narrative Focus */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <FileText className="w-4 h-4" />
          Narrative Focus
        </label>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => handleNarrativeFocusChange('diagnostic')}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              config.narrativeFocus === 'diagnostic'
                ? 'border-slate-500 bg-slate-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="font-medium text-sm text-slate-900 mb-1">
              Diagnostic Focus
            </div>
            <div className="text-xs text-slate-600">
              Emphasize unusual presentation, differential diagnosis, diagnostic
              workup
            </div>
          </button>

          <button
            onClick={() => handleNarrativeFocusChange('therapeutic')}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              config.narrativeFocus === 'therapeutic'
                ? 'border-slate-500 bg-slate-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="font-medium text-sm text-slate-900 mb-1">
              Therapeutic Focus
            </div>
            <div className="text-xs text-slate-600">
              Emphasize novel treatment approach, response to therapy, outcome
            </div>
          </button>

          <button
            onClick={() => handleNarrativeFocusChange('methodological')}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              config.narrativeFocus === 'methodological'
                ? 'border-slate-500 bg-slate-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="font-medium text-sm text-slate-900 mb-1">
              Methodological Focus
            </div>
            <div className="text-xs text-slate-600">
              Emphasize novel technique, procedural innovation, technical details
            </div>
          </button>
        </div>
      </div>

      {/* Additional Components */}
      <div className="space-y-4">
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.includeImaging}
              onChange={handleImagingToggle}
              className="w-4 h-4 text-slate-600 rounded border-slate-300 focus:ring-2 focus:ring-slate-500"
            />
            <span className="text-sm font-medium text-slate-700">
              Include Imaging Studies
            </span>
          </label>
          <p className="text-xs text-slate-600 ml-6">
            CT, MRI, X-ray, ultrasound, or other diagnostic images
          </p>
        </div>

        {config.includeImaging && (
          <div className="ml-6 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Image className="w-4 h-4 text-slate-700 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900">
                  Imaging Documentation
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Include: modality, findings, key measurements, annotations.
                  Ensure proper de-identification.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.includeLiteratureReview}
              onChange={handleLiteratureToggle}
              className="w-4 h-4 text-slate-600 rounded border-slate-300 focus:ring-2 focus:ring-slate-500"
            />
            <span className="text-sm font-medium text-slate-700">
              Include Literature Review & Comparison
            </span>
          </label>
          <p className="text-xs text-slate-600 ml-6">
            Compare your case with previously reported cases
          </p>
        </div>

        {config.includeLiteratureReview && (
          <div className="ml-6 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-slate-700 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900">
                  Literature Synthesis
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Include: PubMed search strategy, comparison table, what makes
                  your case unique
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Educational Value */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          Educational Value
        </h4>
        <ul className="space-y-1.5 text-sm text-blue-900">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
            What can clinicians learn from this case?
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
            What diagnostic pitfalls should be avoided?
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
            What is the key take-home message?
          </li>
        </ul>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <p className="text-sm text-slate-700">
          <strong>Case Report Best Practices:</strong> Focus on novelty,
          educational value, and clear narrative. Obtain patient consent,
          de-identify images, and provide literature context.
        </p>
      </div>
    </div>
  );
}
