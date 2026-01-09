import { useState } from 'react';
import { Scan, Blocks, Sigma, Radar, Scale, ShieldAlert, Target, FileDiff, Feather, SearchX, CheckCircle2, XCircle, Info, ChevronRight, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePersonas } from './ai-personas/core/personaContext';
import { getAllPersonas } from './ai-personas/core/personaRegistry';
import { ContentContainer } from './ui/ContentContainer';
import type { PersonaId } from './ai-personas/core/personaTypes';

const PERSONA_ICONS: Record<PersonaId, any> = {
  'protocol-auditor': Scan,
  'schema-architect': Blocks,
  'statistical-advisor': Sigma,
  'data-quality-sentinel': Radar,
  'ethics-compliance': Scale,
  'safety-vigilance': ShieldAlert,
  'endpoint-validator': Target,
  'amendment-advisor': FileDiff,
  'academic-writing-coach': Feather,
  'manuscript-reviewer': SearchX,
};

export function PersonaDashboard() {
  const { t } = useTranslation('personas');
  const { state, activatePersona, deactivatePersona } = usePersonas();
  const [selectedPersona, setSelectedPersona] = useState<PersonaId | null>(null);
  
  const allPersonas = getAllPersonas();
  const activePersonas = allPersonas.filter(p => state.personas[p.id]?.active);
  const inactivePersonas = allPersonas.filter(p => !state.personas[p.id]?.active);
  
  // Get REAL validation scores from persona state
  const getValidationScore = (personaId: PersonaId) => {
    const personaState = state.personas[personaId];
    if (!personaState?.lastValidation) {
      return 0; // No validation run yet
    }
    return personaState.lastValidation.complianceScore;
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-amber-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };
  
  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-50 border-green-300';
    if (score >= 75) return 'bg-amber-50 border-amber-300';
    if (score >= 50) return 'bg-orange-50 border-orange-300';
    return 'bg-red-50 border-red-300';
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <ContentContainer className="p-8 space-y-6">
          {/* Study Type Info */}
          {state.studyType && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-900 mb-1">
                    {t('dashboard.currentStudyType')} <span className="font-bold uppercase">{state.studyType}</span>
                  </h3>
                  <p className="text-sm text-blue-700">
                    {t('dashboard.personasConfiguredMessage')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Active Personas */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {t('dashboard.activePersonasCount', { count: activePersonas.length })}
              </h2>
              <div className="text-sm text-slate-600">
                {t('dashboard.realTimeValidationEnabled')}
              </div>
            </div>

            <div className="grid gap-4">
              {activePersonas.map((persona) => {
                const Icon = PERSONA_ICONS[persona.id];
                const score = getValidationScore(persona.id);
                const isRequired = state.studyType && persona.requiredForStudyTypes?.includes(state.studyType);
                const personaState = state.personas[persona.id];
                
                return (
                  <div
                    key={persona.id}
                    className={`bg-white border-2 rounded-xl p-4 transition-all ${
                      selectedPersona === persona.id 
                        ? `${persona.color.border} shadow-lg` 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${persona.color.bg}`}>
                        {Icon && <Icon className={`w-6 h-6 ${persona.color.icon}`} />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold text-slate-900">
                              {persona.name}
                            </h3>
                            {isRequired && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                                REQUIRED
                              </span>
                            )}
                            {persona.realTimeValidation && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700">
                                REAL-TIME
                              </span>
                            )}
                          </div>

                          {/* Compliance Score */}
                          {score > 0 && (
                            <div className={`px-3 py-1 rounded-lg border-2 ${getScoreBg(score)}`}>
                              <div className={`text-sm font-bold ${getScoreColor(score)}`}>
                                {score}%
                              </div>
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-slate-600 mb-2">
                          {persona.description}
                        </p>

                        {persona.studyTypeDescription && (
                          <p className="text-xs text-slate-500 italic mb-3">
                            {persona.studyTypeDescription}
                          </p>
                        )}

                        {/* Modules */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {persona.modules.map((module) => (
                            <span
                              key={module}
                              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600"
                            >
                              {module.replace('-', ' ')}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedPersona(selectedPersona === persona.id ? null : persona.id)}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <ChevronRight className={`w-3 h-3 transition-transform ${selectedPersona === persona.id ? 'rotate-90' : ''}`} />
                            View Details
                          </button>

                          {!isRequired && (
                            <button
                              onClick={() => deactivatePersona(persona.id)}
                              className="ml-auto text-xs font-medium text-red-600 hover:text-red-700 px-3 py-1 border border-red-200 rounded hover:bg-red-50"
                            >
                              Deactivate
                            </button>
                          )}

                          {isRequired && (
                            <div className="ml-auto text-xs text-slate-500 px-3 py-1 bg-slate-100 rounded cursor-not-allowed">
                              Cannot Deactivate
                            </div>
                          )}
                        </div>

                        {/* Expanded Details */}
                        {selectedPersona === persona.id && (
                          <div className="mt-4 pt-4 border-t border-slate-200">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-xs font-medium text-slate-600 mb-1">Validation Rules</div>
                                <div className="text-slate-900">{persona.validationRules.length} active</div>
                              </div>
                              <div>
                                <div className="text-xs font-medium text-slate-600 mb-1">Validation Mode</div>
                                <div className="text-slate-900">
                                  {persona.realTimeValidation ? 'Real-time + Batch' : 'Batch Only'}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs font-medium text-slate-600 mb-1">Priority Level</div>
                                <div className="text-slate-900">Priority {persona.priority}</div>
                              </div>
                              <div>
                                <div className="text-xs font-medium text-slate-600 mb-1">Sidebar</div>
                                <div className="text-slate-900">
                                  {persona.sidebar?.enabled ? 'Enabled' : 'Disabled'}
                                </div>
                              </div>
                            </div>

                            {/* Regulatory Frameworks */}
                            {state.regulatoryFrameworks.length > 0 && (
                              <div className="mt-3">
                                <div className="text-xs font-medium text-slate-600 mb-2">Regulatory Frameworks</div>
                                <div className="flex flex-wrap gap-1">
                                  {state.regulatoryFrameworks.map(framework => (
                                    <span
                                      key={framework}
                                      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-100 text-indigo-700"
                                    >
                                      {framework}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {activePersonas.length === 0 && (
                <div className="text-center py-12 bg-white border-2 border-dashed border-slate-300 rounded-xl">
                  <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No Active Personas</h3>
                  <p className="text-sm text-slate-600">
                    Activate personas from the Available Personas section below
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Available (Inactive) Personas */}
          {inactivePersonas.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Available Personas ({inactivePersonas.length})
                </h2>
                <div className="text-sm text-slate-600">
                  Activate for additional validation
                </div>
              </div>

              <div className="grid gap-3">
                {inactivePersonas.map((persona) => {
                  const Icon = PERSONA_ICONS[persona.id];
                  
                  return (
                    <div
                      key={persona.id}
                      className="bg-white border border-slate-200 rounded-lg p-3 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${persona.color.bg}`}>
                          {Icon && <Icon className={`w-5 h-5 ${persona.color.icon}`} />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 mb-1">
                            {persona.name}
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-1">
                            {persona.description}
                          </p>
                        </div>

                        <button
                          onClick={() => activatePersona(persona.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Activate
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Overall Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white border-2 border-slate-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {activePersonas.length}/{allPersonas.length}
              </div>
              <div className="text-xs text-slate-600">Active Personas</div>
            </div>

            <div className="bg-white border-2 border-slate-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {activePersonas.filter(p => getValidationScore(p.id) >= 90).length}
              </div>
              <div className="text-xs text-slate-600">Excellent Compliance</div>
            </div>

            <div className="bg-white border-2 border-slate-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {state.regulatoryFrameworks.length}
              </div>
              <div className="text-xs text-slate-600">Regulatory Frameworks</div>
            </div>
          </div>
        </ContentContainer>
      </div>
    </div>
  );
}