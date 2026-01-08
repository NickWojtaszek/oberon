import { useState } from 'react';
import { 
  Shield, Building2, TrendingUp, ShieldCheck, Scale, 
  AlertTriangle, Target, FileEdit, Settings, X, Sparkles,
  Check, ChevronDown, Download, BarChart3, PenTool
} from 'lucide-react';
import { usePersonas } from '../core/personaContext';
import type { PersonaId, StudyType, RegulatoryFramework } from '../core/personaTypes';
import { PersonaStatusBadge } from './PersonaStatusBadge';
import { LanguageSelector } from './LanguageSelector';
import { reportExporter } from '../export/reportExporter';
import { globalTrendTracker } from '../analytics/trendTracker';

const PERSONA_ICONS: Record<PersonaId, any> = {
  'protocol-auditor': Shield,
  'schema-architect': Building2,
  'statistical-advisor': TrendingUp,
  'data-quality-sentinel': ShieldCheck,
  'ethics-compliance': Scale,
  'safety-vigilance': AlertTriangle,
  'endpoint-validator': Target,
  'amendment-advisor': FileEdit,
  'academic-writing-coach': PenTool
};

const STUDY_TYPES: { value: StudyType; label: string }[] = [
  { value: 'rct', label: 'Randomized Controlled Trial (RCT)' },
  { value: 'observational', label: 'Observational Study' },
  { value: 'single-arm', label: 'Single-Arm Study' },
  { value: 'diagnostic', label: 'Diagnostic Study' },
  { value: 'registry', label: 'Registry / Real-World Data' },
  { value: 'phase-1', label: 'Phase I Dose-Finding' },
  { value: 'phase-2', label: 'Phase II Efficacy' },
  { value: 'phase-3', label: 'Phase III Confirmatory' },
  { value: 'phase-4', label: 'Phase IV Post-Marketing' },
  { value: 'medical-device', label: 'Medical Device Study' }
];

const REGULATORY_FRAMEWORKS: { value: RegulatoryFramework; label: string }[] = [
  { value: 'FDA', label: 'FDA (United States)' },
  { value: 'EMA', label: 'EMA (European Union)' },
  { value: 'PMDA', label: 'PMDA (Japan)' },
  { value: 'ICH-GCP', label: 'ICH-GCP (International)' },
  { value: 'HIPAA', label: 'HIPAA (Data Privacy)' }
];

interface PersonaManagerProps {
  open: boolean;
  onClose: () => void;
}

export function PersonaManager({ open, onClose }: PersonaManagerProps) {
  const { state, dispatch, getActivePersonas } = usePersonas();
  const [showStudyTypeDropdown, setShowStudyTypeDropdown] = useState(false);

  if (!open) return null;

  const handleTogglePersona = (personaId: PersonaId) => {
    const persona = state.personas[personaId];
    
    // Check if required
    if (
      state.studyType &&
      persona.config.requiredForStudyTypes?.includes(state.studyType)
    ) {
      alert(`${persona.config.name} is required for ${state.studyType} studies and cannot be disabled.`);
      return;
    }

    if (persona.active) {
      dispatch({ type: 'DEACTIVATE_PERSONA', personaId });
    } else {
      dispatch({ type: 'ACTIVATE_PERSONA', personaId });
    }
  };

  const handleToggleRegulatory = (framework: RegulatoryFramework) => {
    if (state.regulatoryFrameworks.includes(framework)) {
      dispatch({ type: 'REMOVE_REGULATORY_FRAMEWORK', framework });
    } else {
      dispatch({ type: 'ADD_REGULATORY_FRAMEWORK', framework });
    }
  };

  const activeCount = getActivePersonas().length;
  const totalCount = Object.keys(state.personas).length;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">AI Persona Manager</h2>
                <p className="text-sm text-slate-600">
                  {activeCount} of {totalCount} personas active
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Study Type Selection */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Study Configuration
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-blue-900 mb-1.5">
                  Study Type
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowStudyTypeDropdown(!showStudyTypeDropdown)}
                    className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-left flex items-center justify-between hover:bg-blue-50 transition-colors"
                  >
                    <span className="text-sm text-slate-900">
                      {state.studyType 
                        ? STUDY_TYPES.find(t => t.value === state.studyType)?.label 
                        : 'Select study type...'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  </button>

                  {showStudyTypeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {STUDY_TYPES.map(type => (
                        <button
                          key={type.value}
                          onClick={() => {
                            dispatch({ type: 'SET_STUDY_TYPE', studyType: type.value });
                            setShowStudyTypeDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center justify-between"
                        >
                          <span>{type.label}</span>
                          {state.studyType === type.value && (
                            <Check className="w-4 h-4 text-green-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-blue-900 mb-1.5">
                  Regulatory Frameworks
                </label>
                <div className="space-y-2">
                  {REGULATORY_FRAMEWORKS.map(framework => (
                    <label
                      key={framework.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={state.regulatoryFrameworks.includes(framework.value)}
                        onChange={() => handleToggleRegulatory(framework.value)}
                        className="rounded"
                      />
                      <span className="text-sm text-blue-900">{framework.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <LanguageSelector variant="full" />

          {/* Persona List */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Active Personas</h3>
            <div className="space-y-3">
              {Object.values(state.personas)
                .sort((a, b) => a.config.priority - b.config.priority)
                .map(persona => {
                  const Icon = PERSONA_ICONS[persona.personaId];
                  const isRequired = state.studyType && 
                    persona.config.requiredForStudyTypes?.includes(state.studyType);

                  return (
                    <div
                      key={persona.personaId}
                      className={`border rounded-lg p-4 transition-all ${
                        persona.active
                          ? `${persona.config.color.bg} ${persona.config.color.border}`
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Toggle Switch */}
                        <div className="flex items-center">
                          <button
                            onClick={() => handleTogglePersona(persona.personaId)}
                            disabled={isRequired}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              persona.active
                                ? 'bg-green-500'
                                : 'bg-slate-300'
                            } ${isRequired ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <div
                              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                persona.active ? 'translate-x-7' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Icon */}
                        <div className={`w-10 h-10 ${persona.config.color.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${persona.config.color.icon}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-slate-900">
                              {persona.config.name}
                            </h4>
                            {isRequired && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed mb-2">
                            {persona.config.description}
                          </p>

                          {/* Status */}
                          {persona.active && (
                            <div className="flex items-center gap-2">
                              <PersonaStatusBadge persona={persona} style="score" size="sm" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => dispatch({ type: 'ENABLE_ALL_PERSONAS' })}
              className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium text-sm"
            >
              Enable All
            </button>
            <button
              onClick={() => dispatch({ type: 'DISABLE_ALL_PERSONAS' })}
              className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
            >
              Disable Non-Required
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}