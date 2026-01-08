import { useState, forwardRef, useImperativeHandle } from 'react';
import { Lock, ChevronDown, ChevronRight, FileText, Shield, MessageSquare, Target, Link2, CheckCircle2, X, AlertTriangle, History, Copy, Check, User, CheckCircle, Brain, BarChart3, Filter, Plus } from 'lucide-react';
import { ContentContainer } from './ui/ContentContainer';
import { getAllPersonas } from './ai-personas/core/personaRegistry';
import type { PersonaConfig } from './ai-personas/core/personaTypes';
import { useTranslation } from 'react-i18next';

interface AuditLogEntry {
  timestamp: string;
  action: string;
  user: string;
}

interface LockedPersona {
  id: string;
  name: string;
  version: string;
  lockedAt: string;
  createdAt: string;
  validatedAt: string;
  createdBy: string;
  configHash: string;
  therapeuticArea: string;
  studyPhase: string;
  personaType: string;
  isSystemBuilt?: boolean; // NEW: System-built personas cannot be edited or deleted
  
  // Interpretation Rules
  disallowedInferences: string[];
  
  // Language Controls
  tone: string;
  confidenceLevel: number;
  neverWriteFullSections: boolean;
  forbiddenAnthropomorphism: boolean;
  jargonLevel: string;
  forbiddenPhrases: string[];
  
  // Outcome Focus
  primaryEndpoint: string;
  
  // Citation Policy
  requireSourceForClaim: boolean;
  citationStrength: number;
  knowledgeBaseScope: string;
}

interface PersonaLibraryProps {
  onCreatePersona?: () => void;
}

export interface PersonaLibraryRef {
  createPersona: () => void;
}

// Helper function to convert kebab-case ID to camelCase for translation keys
const toCamelCase = (str: string): string => {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const PersonaLibrary = forwardRef<PersonaLibraryRef, PersonaLibraryProps>(
  ({ onCreatePersona }, ref) => {
  const [expandedPersona, setExpandedPersona] = useState<string | null>(null);
  const [showAuditLog, setShowAuditLog] = useState<string | null>(null);
  const [cloningPersona, setCloningPersona] = useState<string | null>(null);
  
  const { t } = useTranslation('personas');
  
  // Expose method to parent via ref
  useImperativeHandle(ref, () => ({
    createPersona: () => {
      if (onCreatePersona) {
        onCreatePersona();
      }
    }
  }));
  
  // 🔥 DYNAMICALLY LOAD FROM PERSONA REGISTRY
  const allPersonasFromRegistry = getAllPersonas();
  
  // Transform PersonaConfig to LockedPersona format for UI display
  const lockedPersonas: LockedPersona[] = allPersonasFromRegistry.map(persona => ({
    id: persona.id,
    name: persona.name,
    version: '1.0', // In real app, this would come from database
    createdAt: '2025-01-01T00:00:00Z',
    validatedAt: '2025-01-01T00:00:00Z',
    lockedAt: '2025-01-01T00:00:00Z',
    createdBy: 'Platform System',
    configHash: `HASH-${persona.id.substring(0, 8)}`,
    therapeuticArea: persona.applicableStudyTypes?.[0] || 'Universal',
    studyPhase: 'All Phases',
    personaType: persona.id.includes('statistical') ? 'statistical' : 
                 persona.id.includes('safety') || persona.id.includes('compliance') ? 'safety' : 
                 persona.id.includes('endpoint') || persona.id.includes('schema') ? 'validation' :
                 'analysis',
    isSystemBuilt: true, // All personas from registry are system-built
    disallowedInferences: [],
    tone: 'neutral',
    confidenceLevel: 4,
    neverWriteFullSections: true,
    forbiddenAnthropomorphism: true,
    jargonLevel: 'peer-review',
    forbiddenPhrases: [],
    primaryEndpoint: persona.description,
    requireSourceForClaim: true,
    citationStrength: 4,
    knowledgeBaseScope: 'all-projects',
  }));

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  // Helper to get translated persona name
  const getPersonaName = (personaId: string) => {
    const camelKey = toCamelCase(personaId);
    return t(`${camelKey}.name`, personaId);
  };

  // Helper to get translated persona description
  const getPersonaDescription = (personaId: string) => {
    const camelKey = toCamelCase(personaId);
    return t(`${camelKey}.description`, '');
  };

  const getPersonaTypeLabel = (type: string) => {
    return t(`types.${type}`, type);
  };

  const getToneLabel = (tone: string) => {
    return t(`tones.${tone}`, tone);
  };

  const getConfidenceLevelLabel = (level: number) => {
    return t(`confidenceLevels.${level}`, `Level ${level}`);
  };

  const getCitationStrengthLabel = (level: number) => {
    return t(`citationStrengths.${level}`, `Level ${level}`);
  };

  const toggleExpand = (personaId: string) => {
    setExpandedPersona(expandedPersona === personaId ? null : personaId);
  };

  const handleClone = (persona: LockedPersona) => {
    setCloningPersona(persona.id);
    // Simulate API call
    setTimeout(() => {
      setCloningPersona(null);
      // In real app, navigate to personas tab with new draft
      alert(`Cloning "${persona.name}" to v${parseFloat(persona.version) + 1}.0 Draft...`);
    }, 1500);
  };

  const getAuditLog = (persona: LockedPersona): AuditLogEntry[] => {
    return [
      {
        timestamp: persona.createdAt,
        action: 'Created',
        user: persona.createdBy,
      },
      {
        timestamp: persona.validatedAt,
        action: 'Validated',
        user: persona.createdBy,
      },
      {
        timestamp: persona.lockedAt,
        action: 'Locked for Production',
        user: persona.createdBy,
      },
    ];
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      {/* Personas List - Certificate Style - with scrolling */}
      <div className="flex-1 overflow-y-auto">
        <ContentContainer className="p-8 space-y-4">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-900 mb-1">
                  {t('library.title')}
                </h3>
                <p className="text-sm text-blue-700">
                  {t('library.subtitle', { count: lockedPersonas.length })}
                </p>
              </div>
            </div>
          </div>

          {lockedPersonas.map((persona) => {
            const isExpanded = expandedPersona === persona.id;
            const isShowingAudit = showAuditLog === persona.id;
            const isCloning = cloningPersona === persona.id;
            
            return (
              <div
                key={persona.id}
                className="bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    {/* Left: Icon and Content */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                          <Shield className="w-6 h-6 text-slate-500" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-medium text-slate-900">{getPersonaName(persona.id)}</h3>
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-2">
                              {persona.isSystemBuilt 
                                ? getPersonaDescription(persona.id)
                                : `${persona.primaryEndpoint} • ${getToneLabel(persona.tone)} • Citation strength: ${getCitationStrengthLabel(persona.citationStrength)}`
                              }
                            </p>
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {persona.isSystemBuilt ? (
                            <>
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-lg">
                                <Lock className="w-3 h-3" />
                                SYSTEM-BUILT
                              </span>
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-white text-xs font-medium rounded-lg">
                                NON-EDITABLE
                              </span>
                            </>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-300">
                              <CheckCircle className="w-3 h-3" />
                              LOCKED
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
                            {getPersonaTypeLabel(persona.personaType)}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
                            {persona.therapeuticArea}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                            {persona.studyPhase}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs">
                            v{persona.version}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs">
                            Locked {formatDate(persona.lockedAt)}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-mono">
                            {persona.configHash.substring(0, 8)}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          {persona.isSystemBuilt ? (
                            <div className="px-4 py-2 bg-slate-100 text-slate-500 rounded-lg text-sm font-medium inline-flex items-center gap-2 border border-slate-300">
                              <Lock className="w-4 h-4" />
                              System personas cannot be cloned
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClone(persona);
                              }}
                              disabled={isCloning}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors text-sm font-medium inline-flex items-center gap-2"
                            >
                              {isCloning ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Cloning...
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  Clone to Draft
                                </>
                              )}
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(persona.id);
                            }}
                            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg transition-colors text-sm font-medium inline-flex items-center gap-2"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronDown className="w-4 h-4" />
                                Hide Details
                              </>
                            ) : (
                              <>
                                <ChevronRight className="w-4 h-4" />
                                View Details
                              </>
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAuditLog(isShowingAudit ? null : persona.id);
                            }}
                            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg transition-colors text-sm inline-flex items-center gap-2"
                          >
                            <History className="w-4 h-4" />
                            Audit Log
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Download logic
                            }}
                            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg transition-colors text-sm inline-flex items-center gap-2"
                          >
                            <FileText className="w-4 h-4" />
                            Export PDF
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right: Status Badge */}
                    <div className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                      persona.isSystemBuilt 
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {persona.isSystemBuilt ? 'Platform Core' : 'Validated'}
                    </div>
                  </div>
                </div>

                {/* Audit Log Timeline */}
                {isShowingAudit && (
                  <div className="border-t border-slate-200 bg-slate-50 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <History className="w-5 h-5 text-slate-700" />
                      <h4 className="text-sm font-medium text-slate-900">Audit Timeline</h4>
                    </div>
                    <div className="space-y-4">
                      {getAuditLog(persona).map((entry, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              idx === getAuditLog(persona).length - 1
                                ? 'bg-emerald-600'
                                : 'bg-slate-400'
                            }`}>
                              {idx === getAuditLog(persona).length - 1 ? (
                                <Lock className="w-4 h-4 text-white" />
                              ) : idx === getAuditLog(persona).length - 2 ? (
                                <CheckCircle className="w-4 h-4 text-white" />
                              ) : (
                                <User className="w-4 h-4 text-white" />
                              )}
                            </div>
                            {idx < getAuditLog(persona).length - 1 && (
                              <div className="w-0.5 h-8 bg-slate-300" />
                            )}
                          </div>
                          <div className="flex-1 pb-2">
                            <div className="text-sm font-medium text-slate-900">{entry.action}</div>
                            <div className="text-xs text-slate-600 mt-0.5">
                              {formatDate(entry.timestamp)} at {formatTime(entry.timestamp)}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">by {entry.user}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expanded Configuration Details */}
                {isExpanded && (
                  <div className="border-t-2 border-slate-300 bg-slate-50 p-6">
                    {persona.isSystemBuilt && (
                      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 border-2 border-indigo-700 rounded-lg p-6 mb-6 text-white shadow-xl">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Brain className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Lock className="w-4 h-4" />
                              <h4 className="text-sm font-bold">SYSTEM-LEVEL GUARDRAIL</h4>
                            </div>
                            <p className="text-sm text-indigo-100 leading-relaxed mb-3">
                              This persona is built into the platform and powers the <strong>Statistical Logic Layer</strong> in the Protocol Workbench. 
                              It automatically validates schema designs, enforces clinical standards (NIHSS, mRS, mortality endpoints), 
                              blocks invalid statistical tests, and generates an immutable audit trail for regulatory compliance.
                            </p>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div className="bg-white/10 rounded p-2 border border-white/20">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <BarChart3 className="w-3 h-3" />
                                  <span className="font-medium">Auto-Detection</span>
                                </div>
                                <div className="text-indigo-200">NIHSS, mRS, mortality endpoints, binary outcomes</div>
                              </div>
                              <div className="bg-white/10 rounded p-2 border border-white/20">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <Shield className="w-3 h-3" />
                                  <span className="font-medium">Validation</span>
                                </div>
                                <div className="text-indigo-200">Statistical test compatibility, data type enforcement</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-900">Configuration Snapshot</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Immutable record of all governance rules and policies
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        {/* Interpretation Rules */}
                        <div className="bg-white border-2 border-slate-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-4 h-4 text-slate-700" />
                            <h5 className="text-xs font-medium text-slate-900">Interpretation Rules</h5>
                          </div>
                          <div className="text-xs text-slate-600 mb-2">Disallowed Inferences</div>
                          <div className="flex flex-wrap gap-2">
                            {persona.disallowedInferences.map((inference) => (
                              <span
                                key={inference}
                                className="px-2 py-1 bg-red-50 text-red-800 border border-red-300 rounded text-xs flex items-center gap-1 font-medium"
                              >
                                <X className="w-3 h-3" />
                                {inference.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Language Controls */}
                        <div className="bg-white border-2 border-slate-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <MessageSquare className="w-4 h-4 text-slate-700" />
                            <h5 className="text-xs font-medium text-slate-900">Language Controls</h5>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                            <div>
                              <div className="text-slate-600 mb-1">Tone</div>
                              <div className="text-slate-900 font-medium">{getToneLabel(persona.tone)}</div>
                            </div>
                            <div>
                              <div className="text-slate-600 mb-1">Confidence</div>
                              <div className="text-slate-900 font-medium">{getConfidenceLevelLabel(persona.confidenceLevel)}</div>
                            </div>
                          </div>
                          
                          <div className="pt-3 border-t border-slate-200 space-y-2">
                            <div className="flex items-center gap-2">
                              {persona.neverWriteFullSections ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <X className="w-3.5 h-3.5 text-slate-400" />
                              )}
                              <span className="text-xs text-slate-700">Never write full sections</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {persona.forbiddenAnthropomorphism ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <X className="w-3.5 h-3.5 text-slate-400" />
                              )}
                              <span className="text-xs text-slate-700">No anthropomorphism</span>
                            </div>
                          </div>

                          {persona.forbiddenPhrases.length > 0 && (
                            <div className="pt-3 border-t border-slate-200 mt-3">
                              <div className="text-xs text-slate-600 mb-2">Forbidden Phrases</div>
                              <div className="flex flex-wrap gap-1">
                                {persona.forbiddenPhrases.map((phrase, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-red-50 text-red-800 border border-red-200 rounded text-xs"
                                  >
                                    {phrase}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        {/* Outcome Focus */}
                        <div className="bg-white border-2 border-slate-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Target className="w-4 h-4 text-slate-700" />
                            <h5 className="text-xs font-medium text-slate-900">Outcome Focus</h5>
                          </div>
                          <div className="text-xs text-slate-600 mb-1">Primary Endpoint</div>
                          <div className="text-sm text-slate-900 font-medium">{persona.primaryEndpoint}</div>
                        </div>

                        {/* Citation Policy */}
                        <div className="bg-white border-2 border-slate-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Link2 className="w-4 h-4 text-slate-700" />
                            <h5 className="text-xs font-medium text-slate-900">Citation Policy</h5>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              {persona.requireSourceForClaim ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <X className="w-3.5 h-3.5 text-slate-400" />
                              )}
                              <span className="text-xs text-slate-700">Mandatory evidence</span>
                            </div>

                            <div className="pt-3 border-t border-slate-200">
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                  <div className="text-slate-600 mb-1">Strength</div>
                                  <div className="text-slate-900 font-medium">{getCitationStrengthLabel(persona.citationStrength)}</div>
                                </div>
                                <div>
                                  <div className="text-slate-600 mb-1">Scope</div>
                                  <div className="text-slate-900 font-medium capitalize">{persona.knowledgeBaseScope.replace('-', ' ')}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Immutability Warning */}
                        <div className="bg-slate-100 border-2 border-slate-300 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-slate-700">
                              <div className="font-medium mb-1">Immutable Record</div>
                              <div className="text-slate-600">
                                Configuration locked by database RLS policy. Clone to create a new draft version.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </ContentContainer>

        {/* Empty State */}
        {lockedPersonas.length === 0 && (
          <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
            <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg text-slate-900 mb-2">No Certified Personas</h3>
            <p className="text-slate-600 text-sm">
              Lock and validate personas in the Governance section to certify them for production use.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});