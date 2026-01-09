/**
 * Fairy Court Personas - The Oberon System AI Faculty
 * 
 * A redesigned AI Personas page with Seelie (Co-Pilots) and Unseelie (Auditors)
 * court classification. Each persona displays as "Dr. [Folklore Name]" with
 * their role, guardrails, and configurable settings.
 */

import { useState } from 'react';
import { 
  Shield, 
  Sparkles,
  Lock,
  Settings2,
  ChevronDown,
  ChevronUp,
  Sun,
  Snowflake,
  Building2,
  TrendingUp,
  ShieldCheck,
  Scale,
  AlertTriangle,
  Target,
  FileEdit,
  PenTool,
  Scissors,
  Info,
  CheckCircle2,
  Users,
  BookOpen,
} from 'lucide-react';
import { ContentContainer } from './ui/ContentContainer';
import { 
  getAllPersonas, 
  getSeeliePersonas, 
  getUnseeliePersonas 
} from './ai-personas/core/personaRegistry';
import type { PersonaConfig, FairyCourt } from './ai-personas/core/personaTypes';
import { PersonaConfigurationPanel } from './ai-personas/ui/PersonaConfigurationPanel';
import type { PersonaCustomization } from '../types/aiGovernance';
import { useTranslation } from 'react-i18next';

// Icon mapping
const PERSONA_ICONS: Record<string, any> = {
  'Shield': Shield,
  'Building2': Building2,
  'TrendingUp': TrendingUp,
  'ShieldCheck': ShieldCheck,
  'Scale': Scale,
  'AlertTriangle': AlertTriangle,
  'Target': Target,
  'FileEdit': FileEdit,
  'PenTool': PenTool,
  'Scissors': Scissors,
};

export function FairyCourtPersonas() {
  const { t } = useTranslation('personas');
  const [expandedPersona, setExpandedPersona] = useState<string | null>(null);
  const [configPersona, setConfigPersona] = useState<PersonaConfig | null>(null);
  const [personaCustomizations, setPersonaCustomizations] = useState<Record<string, PersonaCustomization>>({});
  const [activeTab, setActiveTab] = useState<'all' | 'seelie' | 'unseelie'>('all');
  
  const seeliePersonas = getSeeliePersonas();
  const unseeliePersonas = getUnseeliePersonas();
  const allPersonas = getAllPersonas();
  
  const displayedPersonas = activeTab === 'seelie' 
    ? seeliePersonas 
    : activeTab === 'unseelie' 
      ? unseeliePersonas 
      : allPersonas;
  
  const handleSaveCustomization = (customization: PersonaCustomization) => {
    setPersonaCustomizations(prev => ({
      ...prev,
      [customization.personaId]: customization
    }));
  };
  
  const toggleExpand = (personaId: string) => {
    setExpandedPersona(expandedPersona === personaId ? null : personaId);
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <ContentContainer className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <Sparkles className="w-7 h-7 text-purple-600" />
                The Oberon Faculty
              </h1>
              <p className="text-slate-600 mt-1">
                AI personas that guide, validate, and audit your research
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full font-medium flex items-center gap-1.5">
                <Sun className="w-4 h-4" />
                {seeliePersonas.length} Co-Pilots
              </span>
              <span className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-full font-medium flex items-center gap-1.5">
                <Snowflake className="w-4 h-4" />
                {unseeliePersonas.length} Auditors
              </span>
            </div>
          </div>

          {/* Court Explanation */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Sun className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900">The Seelie Court</h3>
                  <p className="text-sm text-amber-700">Co-Pilots & Builders</p>
                </div>
              </div>
              <p className="text-sm text-amber-800 leading-relaxed">
                These personas help you build, guide your writing, and provide constructive recommendations. 
                They are your creative partners in research design.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-100 to-blue-50 border-2 border-slate-300 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                  <Snowflake className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">The Unseelie Court</h3>
                  <p className="text-sm text-slate-600">Auditors & Enforcers</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                These personas audit your work, enforce constraints, and point out issues. 
                They ensure regulatory compliance and data integrity.
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-slate-200 pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'bg-purple-50 text-purple-700 border-purple-600'
                  : 'text-slate-600 border-transparent hover:bg-slate-100'
              }`}
            >
              All Faculty ({allPersonas.length})
            </button>
            <button
              onClick={() => setActiveTab('seelie')}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'seelie'
                  ? 'bg-amber-50 text-amber-700 border-amber-600'
                  : 'text-slate-600 border-transparent hover:bg-slate-100'
              }`}
            >
              <Sun className="w-4 h-4" />
              Seelie ({seeliePersonas.length})
            </button>
            <button
              onClick={() => setActiveTab('unseelie')}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'unseelie'
                  ? 'bg-slate-200 text-slate-800 border-slate-600'
                  : 'text-slate-600 border-transparent hover:bg-slate-100'
              }`}
            >
              <Snowflake className="w-4 h-4" />
              Unseelie ({unseeliePersonas.length})
            </button>
          </div>

          {/* Personas Grid */}
          <div className="space-y-4">
            {displayedPersonas.map((persona) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                isExpanded={expandedPersona === persona.id}
                onToggle={() => toggleExpand(persona.id)}
                onConfigure={() => setConfigPersona(persona)}
                customization={personaCustomizations[persona.id]}
              />
            ))}
          </div>

          {/* Info Footer */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-600 mt-0.5" />
            <div className="text-sm text-purple-900">
              <div className="font-medium mb-1">About Persona Names</div>
              <p className="text-purple-800">
                Each AI persona is named after a figure from European folklore. The names reflect their function:
                builders and guides from the Seelie (light) court, auditors and enforcers from the Unseelie (winter) court.
                Click "Meet the Faculty" on our website to learn the stories behind each name.
              </p>
            </div>
          </div>
        </ContentContainer>
      </div>

      {/* Configuration Modal */}
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

// ==========================================
// PERSONA CARD COMPONENT
// ==========================================

interface PersonaCardProps {
  persona: PersonaConfig;
  isExpanded: boolean;
  onToggle: () => void;
  onConfigure: () => void;
  customization?: PersonaCustomization;
}

function PersonaCard({ persona, isExpanded, onToggle, onConfigure, customization }: PersonaCardProps) {
  const Icon = PERSONA_ICONS[persona.icon] || Shield;
  const isSeelie = persona.court === 'seelie';
  
  const courtStyles = isSeelie
    ? {
        cardBorder: 'border-amber-200 hover:border-amber-300',
        cardBg: isExpanded ? 'bg-gradient-to-br from-amber-50 to-orange-50' : 'bg-white hover:bg-amber-50/30',
        headerBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        badge: 'bg-amber-100 text-amber-700',
        courtIcon: Sun,
        courtLabel: 'Seelie',
      }
    : {
        cardBorder: 'border-slate-300 hover:border-slate-400',
        cardBg: isExpanded ? 'bg-gradient-to-br from-slate-100 to-blue-50' : 'bg-white hover:bg-slate-50',
        headerBg: 'bg-slate-200',
        iconColor: 'text-slate-600',
        badge: 'bg-slate-200 text-slate-700',
        courtIcon: Snowflake,
        courtLabel: 'Unseelie',
      };
  
  const CourtIcon = courtStyles.courtIcon;

  return (
    <div className={`rounded-xl border-2 transition-all ${courtStyles.cardBorder} ${courtStyles.cardBg}`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-5 text-left"
      >
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className={`w-14 h-14 rounded-xl ${courtStyles.headerBg} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-7 h-7 ${courtStyles.iconColor}`} />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-semibold text-slate-900">
                {persona.fairyName}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${courtStyles.badge}`}>
                <CourtIcon className="w-3 h-3" />
                {courtStyles.courtLabel}
              </span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" />
                {persona.validationRules.length} rules
              </span>
            </div>
            
            <p className="text-sm font-medium text-slate-700 mb-1">
              {persona.name}
            </p>
            
            <p className="text-sm text-slate-600 line-clamp-2">
              {persona.description}
            </p>
            
            {/* Modules */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {persona.modules.map((module) => (
                <span
                  key={module}
                  className="px-2 py-0.5 bg-white/70 border border-slate-200 text-xs text-slate-600 rounded"
                >
                  {formatModuleName(module)}
                </span>
              ))}
            </div>
          </div>
          
          {/* Expand Icon */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onConfigure();
              }}
              className="px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200 flex items-center gap-1.5"
            >
              <Settings2 className="w-3.5 h-3.5" />
              Configure
            </button>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </div>
        </div>
      </button>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-slate-200 pt-4 space-y-4">
          {/* Folklore Origin */}
          {persona.folkloreOrigin && (
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-slate-200">
              <BookOpen className="w-4 h-4 text-purple-600 mt-0.5" />
              <div>
                <div className="text-xs font-medium text-slate-700 mb-0.5">Folklore Origin</div>
                <p className="text-sm text-slate-600">{persona.folkloreOrigin}</p>
              </div>
            </div>
          )}
          
          {/* Study Type Description */}
          {persona.studyTypeDescription && (
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-slate-200">
              <Target className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <div className="text-xs font-medium text-slate-700 mb-0.5">Applicability</div>
                <p className="text-sm text-slate-600">{persona.studyTypeDescription}</p>
              </div>
            </div>
          )}
          
          {/* Validation Rules Preview */}
          <div>
            <div className="text-xs font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              Locked Validation Rules ({persona.validationRules.length})
            </div>
            <div className="flex flex-wrap gap-2 opacity-70">
              {persona.validationRules.slice(0, 5).map((rule) => (
                <span 
                  key={rule}
                  className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded border border-slate-200"
                >
                  {formatRuleName(rule)}
                </span>
              ))}
              {persona.validationRules.length > 5 && (
                <span className="px-2 py-1 bg-slate-50 text-slate-500 text-xs rounded border border-slate-200">
                  +{persona.validationRules.length - 5} more
                </span>
              )}
            </div>
          </div>
          
          {/* Real-time indicator */}
          <div className="flex items-center gap-4 pt-2">
            {persona.realTimeValidation && (
              <span className="flex items-center gap-1.5 text-xs text-green-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Real-time validation
              </span>
            )}
            {persona.batchValidation && (
              <span className="flex items-center gap-1.5 text-xs text-blue-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Batch validation
              </span>
            )}
            {customization && (
              <span className="flex items-center gap-1.5 text-xs text-purple-700">
                <Settings2 className="w-3.5 h-3.5" />
                Custom settings applied
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function formatModuleName(module: string): string {
  return module
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatRuleName(rule: string): string {
  return rule
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
