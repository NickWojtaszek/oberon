/**
 * Step 1: Study Type Selection
 * Defines the "Study DNA" that drives all subsequent configuration
 */

import { FlaskConical, ArrowRight, Info } from 'lucide-react';
import { StudyType, STUDY_METHODOLOGIES } from '../../../config/studyMethodology';
import { WizardStepContent } from '../WizardShell';
import { RigorBadge, StatusBadge } from '../../ui/StatusBadge';
import { InfoBox } from '../../ui/AlertCard';

interface StudyTypeSelectorProps {
  onComplete: (studyType: StudyType) => void;
  onCancel?: () => void;
  selectedType?: StudyType | null;
}

const STUDY_OPTIONS: Array<{
  id: StudyType;
  icon: string;
  color: string;
}> = [
  { id: 'rct', icon: '🔬', color: 'border-red-200 hover:border-red-500' },
  { id: 'prospective-cohort', icon: '📊', color: 'border-blue-200 hover:border-blue-500' },
  { id: 'retrospective-case-series', icon: '📁', color: 'border-slate-200 hover:border-slate-500' },
  { id: 'laboratory-investigation', icon: '🧪', color: 'border-purple-200 hover:border-purple-500' },
  { id: 'technical-note', icon: '📝', color: 'border-emerald-200 hover:border-emerald-500' },
];

export function StudyTypeSelector({ onComplete, onCancel, selectedType }: StudyTypeSelectorProps) {
  return (
    <WizardStepContent
      title="Define Study Design"
      description="Your selection determines required personas, blinding protocols, and AI autonomy levels"
      icon={FlaskConical}
      sidebar={
        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-medium text-slate-900 mb-2">
              Why This Matters
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              The study methodology you select becomes the "genetic blueprint" for your entire project.
              It automatically configures:
            </p>
          </div>
          <div className="space-y-2 text-sm text-slate-700">
            <div className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Required scientific roles and personas</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Blinding protocols and data masking</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Permission levels and access control</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>AI autonomy caps per role</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Governance templates and rigor standards</span>
            </div>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          {selectedType && (
            <button
              onClick={() => onComplete(selectedType)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              Continue to Team Configuration
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        <InfoBox icon={Info} title="Study-to-Persona Mapping">
          Each study type has pre-configured mandatory roles that enforce clinical rigor.
          The system knows the scientific rules better than manual configuration.
        </InfoBox>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STUDY_OPTIONS.map((option) => {
            const config = STUDY_METHODOLOGIES[option.id];
            const isSelected = selectedType === option.id;

            return (
              <button
                key={option.id}
                onClick={() => onComplete(option.id)}
                className={`bg-white border-2 rounded-xl p-6 text-left transition-all group relative ${
                  isSelected
                    ? 'border-blue-500 ring-4 ring-blue-100'
                    : option.color
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">{option.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {config.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {config.description}
                    </p>

                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <RigorBadge level={config.rigorLevel} size="xs" />
                      {config.blindingProtocol !== 'none' && (
                        <StatusBadge variant="indigo" size="xs">
                          {config.blindingProtocol} Blinding
                        </StatusBadge>
                      )}
                      <StatusBadge variant="slate" size="xs">
                        {config.requiredPersonas.length} Roles
                      </StatusBadge>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </WizardStepContent>
  );
}
