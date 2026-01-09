import { useState, useEffect } from 'react';
import { 
  Shield, 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  Scale, 
  AlertTriangle, 
  Target, 
  FileEdit,
  PenTool,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Zap,
  BookOpen,
  BookCheck,
  BarChart3,
  Users,
  UserCheck,
  Bot,
  EyeOff,
  Award,
  Settings2,
  Lock,
  Sun,
  Snowflake,
} from 'lucide-react';
import { usePersonas } from '../core/personaContext';
import { getAllPersonas } from '../core/personaRegistry';
import type { PersonaId, PersonaConfig } from '../core/personaTypes';
import { useProject } from '../../../contexts/ProjectContext';
import { PermissionBadge, AIAutonomyBadge } from '../../ui/StatusBadge';
import { PersonaConfigurationPanel } from './PersonaConfigurationPanel';
import type { PersonaCustomization } from '../../../types/aiGovernance';

const PERSONA_ICONS: Record<PersonaId, any> = {
  'protocol-auditor': Shield,
  'schema-architect': Building2,
  'statistical-advisor': TrendingUp,
  'data-quality-sentinel': ShieldCheck,
  'ethics-compliance': Scale,
  'safety-vigilance': AlertTriangle,
  'endpoint-validator': Target,
  'manuscript-reviewer': BookCheck,
  'amendment-advisor': FileEdit,
  'academic-writing-coach': PenTool,
};

interface ModulePersonaPanelProps {
  module: string;
  className?: string;
  // Optional props for Data Quality tab
  dataRecords?: any[];
  schemaBlocks?: any[];
  studyType?: string;
  onNavigateToIssue?: (issue: any) => void;
  // Optional callback for Safety Vigilance
  onNavigateToRecord?: (recordId: string) => void;
}

export function ModulePersonaPanel({ 
  module, 
  className = '',
  dataRecords = [],
  schemaBlocks = [],
  studyType,
  onNavigateToIssue,
  onNavigateToRecord
}: ModulePersonaPanelProps) {
  const { state } = usePersonas();
  const { currentProject } = useProject();
  const [expandedPersona, setExpandedPersona] = useState<PersonaId | null>(null);
  const [activeTab, setActiveTab] = useState<'personas' | 'team' | 'quality'>('personas');
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [validating, setValidating] = useState(false);
  
  // Configuration modal state
  const [configPersona, setConfigPersona] = useState<PersonaConfig | null>(null);
  const [personaCustomizations, setPersonaCustomizations] = useState<Record<PersonaId, PersonaCustomization>>({});
  
  // Handle saving customization
  const handleSaveCustomization = (customization: PersonaCustomization) => {
    setPersonaCustomizations(prev => ({
      ...prev,
      [customization.personaId]: customization
    }));
    // TODO: Persist to storage/backend
  };

  // Get all personas
  const allPersonas = getAllPersonas();
  
  // Filter personas relevant to this module
  const relevantPersonas = allPersonas.filter(persona => {
    const isActive = state.personas[persona.id]?.active;
    const isRelevantToModule = persona.modules.includes(module);
    return isActive && isRelevantToModule;
  });

  // Get team configuration from current project
  const teamPersonas = currentProject?.studyMethodology?.teamConfiguration?.assignedPersonas || [];
  
  // Get ALL active AI personas (not just module-specific) for Team tab
  const allActivePersonas = allPersonas.filter(persona => state.personas[persona.id]?.active);
  
  // Get Data Quality Sentinel persona for quality tab
  const dataQualityPersona = state.personas['data-quality-sentinel'];
  
  // Calculate quality score and issues
  useEffect(() => {
    if (activeTab === 'quality' && dataRecords.length > 0 && dataQualityPersona?.lastValidation) {
      const validation = dataQualityPersona.lastValidation;
      const criticalCount = validation.issues?.filter((i: any) => i.severity === 'critical').length || 0;
      const warningCount = validation.issues?.filter((i: any) => i.severity === 'warning').length || 0;
      
      // Quality score: 100 - (critical * 10) - (warning * 5)
      const score = Math.max(0, 100 - (criticalCount * 10) - (warningCount * 5));
      setQualityScore(score);
    } else {
      setQualityScore(null);
    }
  }, [activeTab, dataRecords, dataQualityPersona]);

  const getCriticalIssues = () => {
    if (!dataQualityPersona?.lastValidation) return [];
    return dataQualityPersona.lastValidation.issues?.filter((i: any) => i.severity === 'critical') || [];
  };

  const getWarningIssues = () => {
    if (!dataQualityPersona?.lastValidation) return [];
    return dataQualityPersona.lastValidation.issues?.filter((i: any) => i.severity === 'warning') || [];
  };

  const getQualityScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-700';
    if (score >= 70) return 'text-amber-700';
    return 'text-red-700';
  };

  const getQualityScoreBg = (score: number): string => {
    if (score >= 90) return 'bg-green-50 border-green-200';
    if (score >= 70) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  const criticalIssues = getCriticalIssues();
  const warningIssues = getWarningIssues();

  // Don't show panel if no relevant personas and no data quality info
  const showQualityTab = module === 'database' && dataRecords.length > 0;
  const showTabs = relevantPersonas.length > 0 || showQualityTab;
  
  // Count Seelie and Unseelie personas for this module
  const seelieCount = relevantPersonas.filter(p => p.court === 'seelie').length;
  const unseelieCount = relevantPersonas.filter(p => p.court === 'unseelie').length;
  
  if (relevantPersonas.length === 0 && !showQualityTab) {
    return null;
  }

  return (
    <div className={`w-[400px] border-l border-slate-200 bg-white overflow-y-auto flex-shrink-0 ${className}`}>
      <div className="p-6 space-y-6">
        {/* Header with Tabs */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-medium text-slate-900">The Oberon Faculty</h3>
          </div>
          {/* Court Summary */}
          <div className="flex items-center gap-3 mb-4 text-xs">
            {seelieCount > 0 && (
              <div className="flex items-center gap-1 text-amber-700">
                <Sun className="w-3.5 h-3.5" />
                <span>{seelieCount} Seelie</span>
              </div>
            )}
            {unseelieCount > 0 && (
              <div className="flex items-center gap-1 text-slate-600">
                <Snowflake className="w-3.5 h-3.5" />
                <span>{unseelieCount} Unseelie</span>
              </div>
            )}
          </div>

          {/* Tabs - Show when we have personas or quality data */}
          {showTabs && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('personas')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'personas'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Personas</span>
                  <span className="ml-1 px-1.5 py-0.5 bg-purple-200 text-purple-900 rounded text-xs">
                    {relevantPersonas.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'team'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Team</span>
                </div>
              </button>
              {showQualityTab && (
                <button
                  onClick={() => setActiveTab('quality')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'quality'
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Quality</span>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tab Content */}
        {/* Personas Tab */}
        {activeTab === 'personas' && (
          <div className="space-y-3">
            {relevantPersonas.map((persona) => {
              const Icon = PERSONA_ICONS[persona.id];
              const personaState = state.personas[persona.id];
              const validation = personaState?.lastValidation;
              const isExpanded = expandedPersona === persona.id;

              // Get validation status
              const getValidationStatus = () => {
                if (!validation) {
                  return { icon: Clock, color: 'slate', label: 'Not validated', score: null };
                }
                const score = validation.complianceScore;
                if (score >= 90) {
                  return { icon: CheckCircle2, color: 'green', label: 'Excellent', score };
                }
                if (score >= 75) {
                  return { icon: CheckCircle2, color: 'amber', label: 'Good', score };
                }
                if (score >= 50) {
                  return { icon: AlertCircle, color: 'orange', label: 'Needs work', score };
                }
                return { icon: XCircle, color: 'red', label: 'Critical', score };
              };

              const status = getValidationStatus();
              const StatusIcon = status.icon;
              const CourtIcon = persona.court === 'seelie' ? Sun : Snowflake;

              return (
                <div
                  key={persona.id}
                  className={`rounded-lg border-2 transition-all ${
                    isExpanded 
                      ? persona.court === 'seelie'
                        ? 'border-amber-300 bg-amber-50'
                        : 'border-slate-400 bg-slate-100'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Persona Header */}
                  <button
                    onClick={() => setExpandedPersona(isExpanded ? null : persona.id)}
                    className="w-full p-3 text-left"
                  >
                    <div className="flex items-start gap-2">
                      {/* Icon with Court indicator */}
                      <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isExpanded ? 'bg-white/50' : persona.color.bg
                      }`}>
                        {Icon && <Icon className={`w-4 h-4 ${persona.color.icon}`} />}
                        {/* Court badge */}
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                          persona.court === 'seelie' ? 'bg-amber-100' : 'bg-slate-200'
                        }`}>
                          <CourtIcon className={`w-2.5 h-2.5 ${
                            persona.court === 'seelie' ? 'text-amber-600' : 'text-slate-600'
                          }`} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">
                            {persona.fairyName || persona.name}
                          </h4>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          )}
                        </div>
                        {/* Role subtitle */}
                        <p className="text-[10px] text-slate-500 mb-1">{persona.name}</p>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-${status.color}-100 text-${status.color}-700`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.score !== null ? `${status.score}%` : status.label}
                          </div>
                          {/* Governance Badge */}
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                            <Lock className="w-3 h-3" />
                            {persona.validationRules.length} rules
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-3 border-t border-slate-200">
                      {/* Court & Folklore Info */}
                      <div className={`pt-3 p-2 rounded-lg ${
                        persona.court === 'seelie' ? 'bg-amber-50' : 'bg-slate-50'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <CourtIcon className={`w-4 h-4 ${
                            persona.court === 'seelie' ? 'text-amber-600' : 'text-slate-600'
                          }`} />
                          <span className={`text-xs font-medium ${
                            persona.court === 'seelie' ? 'text-amber-800' : 'text-slate-700'
                          }`}>
                            {persona.court === 'seelie' ? 'Seelie Court • Co-Pilot' : 'Unseelie Court • Auditor'}
                          </span>
                        </div>
                        {persona.folkloreOrigin && (
                          <p className="text-[10px] text-slate-500 italic ml-6">
                            {persona.folkloreOrigin}
                          </p>
                        )}
                      </div>
                      
                      {/* Configure Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfigPersona(persona);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
                        >
                          <Settings2 className="w-3.5 h-3.5" />
                          Configure
                        </button>
                      </div>
                      
                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {persona.description}
                      </p>

                      {/* Validation Details */}
                      {validation && (
                        <div className="bg-white/50 rounded-lg p-2 space-y-1">
                          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                            Validation Status
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <div className="text-[10px] text-slate-500">Critical</div>
                              <div className="font-semibold text-red-600">{validation.criticalCount}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-500">Warnings</div>
                              <div className="font-semibold text-amber-600">{validation.warningCount}</div>
                            </div>
                          </div>
                          <div className="pt-1 border-t border-slate-200">
                            <div className="text-[10px] text-slate-500">Last validated</div>
                            <div className="text-xs text-slate-700">
                              {new Date(validation.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Competencies */}
                      {persona.sidebar?.sections && persona.sidebar.sections.length > 0 && (
                        <div>
                          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                            Competencies
                          </div>
                          <div className="space-y-2">
                            {persona.sidebar.sections.map((section, idx) => {
                              // Get content (handle both static and dynamic)
                              const content = typeof section.content === 'function' 
                                ? section.content({}) 
                                : section.content;

                              if (!content || content.length === 0) return null;

                              return (
                                <div key={idx} className="bg-white/50 rounded p-2">
                                  <div className="flex items-center gap-1 mb-1">
                                    {section.type === 'guidance' && <Shield className="w-3 h-3 text-indigo-600" />}
                                    {section.type === 'best-practices' && <CheckCircle2 className="w-3 h-3 text-green-600" />}
                                    {section.type === 'warnings' && <AlertCircle className="w-3 h-3 text-amber-600" />}
                                    {section.type === 'examples' && <BookOpen className="w-3 h-3 text-purple-600" />}
                                    <div className="text-[10px] font-semibold text-slate-700">
                                      {section.title}
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    {content.slice(0, 2).map((item: any, itemIdx: number) => (
                                      <div key={itemIdx} className="text-[10px] text-slate-600 leading-relaxed">
                                        • {typeof item === 'string' ? item : String(item)}
                                      </div>
                                    ))}
                                    {content.length > 2 && (
                                      <div className="text-[10px] text-slate-400 italic">
                                        +{content.length - 2} more...
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Suggested Actions */}
                      <div>
                        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                          Suggested Actions
                        </div>
                        <div className="space-y-1">
                          {persona.realTimeValidation && (
                            <div className="flex items-start gap-2 text-xs text-slate-700 bg-white/50 rounded p-2">
                              <Zap className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                              <span className="text-[10px]">Real-time validation is active</span>
                            </div>
                          )}
                          {validation && validation.criticalCount > 0 && (
                            <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 rounded p-2">
                              <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                              <span className="text-[10px]">Review critical issues immediately</span>
                            </div>
                          )}
                          {validation && validation.warningCount > 0 && (
                            <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded p-2">
                              <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                              <span className="text-[10px]">Address warnings before submission</span>
                            </div>
                          )}
                          {(!validation || (validation.criticalCount === 0 && validation.warningCount === 0)) && (
                            <div className="flex items-start gap-2 text-xs text-green-700 bg-green-50 rounded p-2">
                              <CheckCircle2 className="w-3 h-3 flex-shrink-0 mt-0.5" />
                              <span className="text-[10px]">All checks passed - ready to proceed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Footer Hint */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 mt-4">
              <p className="text-[10px] text-slate-500 text-center">
                Click personas to view competencies and actions
              </p>
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            {/* Study Roles Section */}
            {teamPersonas.length > 0 && (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-blue-600" />
                    <div className="text-sm font-semibold text-slate-900">
                      Study Roles ({teamPersonas.length})
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 mb-3">
                    {teamPersonas.filter((p: any) => (p as any).userId).length} human •{' '}
                    {teamPersonas.filter((p: any) => !(p as any).userId).length} AI co-pilot
                  </div>

                  {/* Team Members */}
                  <div className="space-y-2">
                    {teamPersonas.map((persona: any, idx: number) => (
                      <div
                        key={idx}
                        className={`bg-slate-50 border-2 rounded-lg p-3 ${
                          persona.blinded ? 'border-indigo-200' : 'border-slate-200'
                        }`}
                      >
                        {/* Role Header */}
                        <div className="flex items-start gap-3 mb-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            persona.blinded ? 'bg-indigo-100' : 'bg-slate-200'
                          }`}>
                            <Shield className={`w-4 h-4 ${
                              persona.blinded ? 'text-indigo-600' : 'text-slate-600'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-900 mb-1">
                              {persona.role}
                            </div>
                            {persona.blinded && (
                              <div className="flex items-center gap-1 mb-1">
                                <EyeOff className="w-3 h-3 text-indigo-600" />
                                <span className="text-xs text-indigo-700">Blinded Role</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Assignee */}
                        <div className="flex items-center gap-2 mb-2 pl-11">
                          {(persona as any).userId ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-700">
                                  {((persona as any).userName || 'U').charAt(0)}
                                </span>
                              </div>
                              <span className="text-xs text-slate-700">
                                {(persona as any).userName || 'Unknown User'}
                              </span>
                              <span className="text-xs text-slate-500">(Human)</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                <Bot className="w-3 h-3 text-purple-600" />
                              </div>
                              <span className="text-xs text-slate-700">AI Co-Pilot</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200" />
              </>
            )}

            {/* Active Oberon Faculty Section */}
            {allActivePersonas.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <div className="text-sm font-semibold text-slate-900">
                    The Oberon Faculty ({allActivePersonas.length})
                  </div>
                </div>
                <div className="text-xs text-slate-600 mb-3">
                  Specialized AI personas providing guidance across modules
                </div>

                {/* AI Personas */}
                <div className="space-y-2">
                  {allActivePersonas.map((persona) => {
                    const Icon = PERSONA_ICONS[persona.id];
                    const CourtIcon = persona.court === 'seelie' ? Sun : Snowflake;
                    return (
                      <div
                        key={persona.id}
                        className={`rounded-lg border-2 p-3 ${
                          persona.court === 'seelie' 
                            ? 'border-amber-200 bg-amber-50' 
                            : 'border-slate-300 bg-slate-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center flex-shrink-0">
                            {Icon && <Icon className={`w-4 h-4 ${persona.color.icon}`} />}
                            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                              persona.court === 'seelie' ? 'bg-amber-100' : 'bg-slate-200'
                            }`}>
                              <CourtIcon className={`w-2.5 h-2.5 ${
                                persona.court === 'seelie' ? 'text-amber-600' : 'text-slate-600'
                              }`} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-900 mb-0.5">
                              {persona.fairyName || persona.name}
                            </div>
                            <div className="text-[10px] text-slate-500 mb-1">
                              {persona.name} • {persona.court === 'seelie' ? 'Co-Pilot' : 'Auditor'}
                            </div>
                            <div className="text-xs text-slate-600 leading-relaxed">
                              {persona.description}
                            </div>
                            {/* Modules Badge */}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {persona.modules.map((mod) => (
                                <span
                                  key={mod}
                                  className="px-2 py-0.5 bg-white/50 text-[10px] font-medium text-slate-700 rounded"
                                >
                                  {mod}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {teamPersonas.length === 0 && allActivePersonas.length === 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <div className="text-sm font-medium text-slate-700 mb-1">
                  No Team Configuration
                </div>
                <div className="text-xs text-slate-500">
                  Configure your research team in Project Setup and activate AI personas to build your working team.
                </div>
              </div>
            )}

            {/* Info Box */}
            {(teamPersonas.length > 0 || allActivePersonas.length > 0) && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3">
                <div className="text-xs text-slate-700 leading-relaxed">
                  <div className="font-semibold mb-1">Your Complete Team:</div>
                  <div>
                    • <strong>Study Roles:</strong> Project-specific roles configured in Project Setup with human/AI assignments
                  </div>
                  <div>
                    • <strong>Oberon Faculty:</strong> Seelie co-pilots and Unseelie auditors providing cross-module guidance
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Data Quality Tab */}
        {activeTab === 'quality' && (
          <div className="space-y-4">
            {/* Data Quality Score */}
            {qualityScore !== null && (
              <div className={`rounded-lg p-4 border ${getQualityScoreBg(qualityScore)}`}>
                <div className="text-xs font-medium mb-2 opacity-80">
                  Data Quality Score
                </div>
                <div className={`text-3xl font-bold ${getQualityScoreColor(qualityScore)}`}>
                  {qualityScore}
                  <span className="text-lg">/100</span>
                </div>
                <div className="mt-2 text-xs opacity-75">
                  {qualityScore >= 90 && '✅ Excellent quality'}
                  {qualityScore >= 70 && qualityScore < 90 && '⚠️ Good with minor issues'}
                  {qualityScore < 70 && '❌ Needs attention'}
                </div>
              </div>
            )}

            {/* Critical Issues */}
            {criticalIssues.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-1.5">
                  🚨 Critical Issues ({criticalIssues.length})
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {criticalIssues.slice(0, 5).map((issue: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-white bg-opacity-60 rounded p-2 border border-red-300 cursor-pointer hover:bg-opacity-100 transition-all"
                      onClick={() => onNavigateToIssue?.(issue)}
                    >
                      <div className="text-xs font-semibold text-red-900 mb-1">
                        {issue.title}
                      </div>
                      {issue.location?.field && (
                        <div className="text-xs text-red-700 mb-1">
                          Field: <span className="font-mono bg-red-100 px-1 rounded">
                            {issue.location.field}
                          </span>
                        </div>
                      )}
                      {issue.location?.recordId && (
                        <div className="text-xs text-red-700 mb-1">
                          Record: <span className="font-mono bg-red-100 px-1 rounded">
                            {issue.location.recordId}
                          </span>
                        </div>
                      )}
                      <div className="text-xs text-red-800 leading-relaxed">
                        {issue.description}
                      </div>
                    </div>
                  ))}
                  {criticalIssues.length > 5 && (
                    <div className="text-xs text-red-700 text-center py-1">
                      +{criticalIssues.length - 5} more critical issues
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Warnings */}
            {warningIssues.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-1.5">
                  ⚠️ Warnings ({warningIssues.length})
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {warningIssues.slice(0, 3).map((issue: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-white bg-opacity-60 rounded p-2 border border-amber-300 cursor-pointer hover:bg-opacity-100 transition-all"
                      onClick={() => onNavigateToIssue?.(issue)}
                    >
                      <div className="text-xs font-semibold text-amber-900 mb-1">
                        {issue.title}
                      </div>
                      {issue.location?.field && (
                        <div className="text-xs text-amber-700">
                          Field: <span className="font-mono bg-amber-100 px-1 rounded">
                            {issue.location.field}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  {warningIssues.length > 3 && (
                    <div className="text-xs text-amber-700 text-center py-1">
                      +{warningIssues.length - 3} more warnings
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Validation Guidelines */}
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
              <div className="text-sm font-semibold text-teal-900 mb-2">
                📋 Active Validations
              </div>
              <div className="space-y-1.5">
                <div className="text-xs text-teal-800 leading-relaxed flex items-start gap-1.5">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>Age range: 0-120 years</span>
                </div>
                <div className="text-xs text-teal-800 leading-relaxed flex items-start gap-1.5">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>Date logic: End after start</span>
                </div>
                <div className="text-xs text-teal-800 leading-relaxed flex items-start gap-1.5">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>Required fields completeness</span>
                </div>
                <div className="text-xs text-teal-800 leading-relaxed flex items-start gap-1.5">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>Categorical value constraints</span>
                </div>
                <div className="text-xs text-teal-800 leading-relaxed flex items-start gap-1.5">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>Duplicate detection</span>
                </div>
                {studyType === 'rct' && (
                  <div className="text-xs text-teal-800 leading-relaxed flex items-start gap-1.5">
                    <span className="text-teal-600 mt-0.5">•</span>
                    <span>RCT: Randomization completeness</span>
                  </div>
                )}
                {studyType === 'observational' && (
                  <div className="text-xs text-teal-800 leading-relaxed flex items-start gap-1.5">
                    <span className="text-teal-600 mt-0.5">•</span>
                    <span>Observational: Exposure documentation</span>
                  </div>
                )}
              </div>
            </div>

            {/* Data Statistics */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="text-xs font-medium text-slate-900 mb-2">
                📊 Data Statistics
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Total Records:</span>
                  <span className="font-semibold text-slate-900">
                    {dataRecords.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Validation Status:</span>
                  <span className={`font-semibold ${
                    validating ? 'text-blue-600' :
                    criticalIssues.length > 0 ? 'text-red-600' :
                    warningIssues.length > 0 ? 'text-amber-600' :
                    'text-green-600'
                  }`}>
                    {validating ? 'Validating...' :
                     criticalIssues.length > 0 ? 'Critical Issues' :
                     warningIssues.length > 0 ? 'Warnings' :
                     'Clean'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Fields Defined:</span>
                  <span className="font-semibold text-slate-900">
                    {schemaBlocks.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Persona Configuration Modal */}
      {configPersona && (
        <PersonaConfigurationPanel
          persona={configPersona}
          customization={personaCustomizations[configPersona.id] || null}
          isOpen={!!configPersona}
          onClose={() => setConfigPersona(null)}
          onSaveCustomization={handleSaveCustomization}
        />
      )}
    </div>
  );
}