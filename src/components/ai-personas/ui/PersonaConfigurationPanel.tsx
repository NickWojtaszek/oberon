/**
 * Persona Configuration Panel
 * 
 * Unified modal for viewing and customizing AI persona settings.
 * 
 * Architecture:
 * - Tab 1: Guardrails (READ-ONLY) - Shows locked validation rules, regulatory frameworks, inference boundaries
 * - Tab 2: Communication (EDITABLE) - Language controls, citation policy from PersonaEditor
 * - Tab 3: Audit Log - Per-persona activity history with export
 * 
 * Reuses UI patterns from PersonaEditor.tsx for consistency.
 */

import { useState, useEffect } from 'react';
import { 
  Lock, 
  Shield, 
  MessageSquare, 
  FileText, 
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  Download,
  Clock,
  Brain,
  BookOpen,
  Target,
  MessageCircleQuestion,
  Command,
  Plus,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import type { PersonaConfig, PersonaId } from '../core/personaTypes';
import type { 
  PersonaCustomization, 
  CommunicationSettings, 
  LanguageControls,
  CitationPolicy,
  InferenceBoundaries,
  AIAuditLogEntry,
  PersonaAuditStats,
  InferenceType,
} from '../../../types/aiGovernance';
import { 
  DEFAULT_COMMUNICATION_SETTINGS, 
  DEFAULT_INFERENCE_BOUNDARIES,
  SYSTEM_LOCKED_DISALLOWED_INFERENCES,
  OPTIONAL_INFERENCE_TYPES,
} from '../../../types/aiGovernance';
import { aiAuditLogger } from '../../../services/aiAuditLogger';
import { useProject } from '../../../contexts/ProjectContext';

interface PersonaConfigurationPanelProps {
  persona: PersonaConfig;
  customization: PersonaCustomization | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveCustomization: (customization: PersonaCustomization) => void;
}

type TabType = 'guardrails' | 'communication' | 'audit';

export function PersonaConfigurationPanel({
  persona,
  customization,
  isOpen,
  onClose,
  onSaveCustomization,
}: PersonaConfigurationPanelProps) {
  const { currentProject } = useProject();
  const [activeTab, setActiveTab] = useState<TabType>('guardrails');
  const [hasChanges, setHasChanges] = useState(false);
  
  // Communication settings state (editable)
  const [communicationSettings, setCommunicationSettings] = useState<CommunicationSettings>(
    customization?.communicationSettings || DEFAULT_COMMUNICATION_SETTINGS
  );
  
  // Inference boundaries state
  const [inferenceBoundaries, setInferenceBoundaries] = useState<InferenceBoundaries>(
    customization?.inferenceBoundaries || DEFAULT_INFERENCE_BOUNDARIES
  );
  
  // Audit data
  const [auditEntries, setAuditEntries] = useState<AIAuditLogEntry[]>([]);
  const [personaStats, setPersonaStats] = useState<PersonaAuditStats | null>(null);
  
  // Load audit data
  useEffect(() => {
    if (currentProject?.id && isOpen) {
      const entries = aiAuditLogger.getEntriesByPersona(currentProject.id, persona.id);
      setAuditEntries(entries.slice(-50).reverse());
      const stats = aiAuditLogger.getPersonaStats(currentProject.id, persona.id);
      setPersonaStats(stats);
    }
  }, [currentProject?.id, persona.id, isOpen]);
  
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCommunicationSettings(customization?.communicationSettings || DEFAULT_COMMUNICATION_SETTINGS);
      setInferenceBoundaries(customization?.inferenceBoundaries || DEFAULT_INFERENCE_BOUNDARIES);
      setHasChanges(false);
    }
  }, [isOpen, customization]);
  
  if (!isOpen) return null;
  
  const handleSave = () => {
    const newCustomization: PersonaCustomization = {
      id: customization?.id || `cust-${persona.id}-${Date.now()}`,
      personaId: persona.id,
      projectId: currentProject?.id || '',
      communicationSettings,
      inferenceBoundaries,
      additionalRestrictions: customization?.additionalRestrictions || [],
      createdAt: customization?.createdAt || new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      modifiedBy: 'current-user', // TODO: Real user ID
      modifiedByName: 'Current User', // TODO: Real user name
    };
    
    // Log the change
    if (currentProject?.id) {
      aiAuditLogger.logCommunicationSettingsChanged(
        currentProject.id,
        persona.id,
        persona.name,
        customization?.communicationSettings,
        communicationSettings,
        'current-user',
        'Current User'
      );
    }
    
    onSaveCustomization(newCustomization);
    setHasChanges(false);
    onClose();
  };
  
  const handleReset = () => {
    setCommunicationSettings(DEFAULT_COMMUNICATION_SETTINGS);
    setInferenceBoundaries(DEFAULT_INFERENCE_BOUNDARIES);
    setHasChanges(true);
  };
  
  const updateLanguageControls = (updates: Partial<LanguageControls>) => {
    setCommunicationSettings((prev: CommunicationSettings) => ({
      ...prev,
      languageControls: { ...prev.languageControls, ...updates },
    }));
    setHasChanges(true);
  };
  
  const updateCitationPolicy = (updates: Partial<CitationPolicy>) => {
    setCommunicationSettings((prev: CommunicationSettings) => ({
      ...prev,
      citationPolicy: { ...prev.citationPolicy, ...updates },
    }));
    setHasChanges(true);
  };

  const getConfidenceLevelLabel = (level: number) => {
    const labels = ['Highly Conservative', 'Conservative', 'Moderate', 'Exploratory', 'Highly Exploratory'];
    return labels[level - 1] || 'Moderate';
  };

  const tabs = [
    { id: 'guardrails' as TabType, label: 'Guardrails', icon: Lock, locked: true },
    { id: 'communication' as TabType, label: 'Communication', icon: MessageSquare, locked: false },
    { id: 'audit' as TabType, label: 'Audit Log', icon: FileText, locked: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[700px] max-h-[85vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`p-6 ${persona.color.bg} border-b ${persona.color.border}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl ${persona.color.bg} border-2 ${persona.color.border} flex items-center justify-center`}>
                <Shield className={`w-7 h-7 ${persona.color.icon}`} />
              </div>
              <div>
                <h2 className={`text-lg font-semibold ${persona.color.text}`}>
                  {persona.name}
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">{persona.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-white/60 text-xs font-medium rounded">
                    {persona.validationRules.length} Rules
                  </span>
                  <span className="px-2 py-0.5 bg-white/60 text-xs font-medium rounded">
                    {persona.modules.length} Module{persona.modules.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-700 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.locked && <Lock className="w-3 h-3 text-slate-400" />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'guardrails' && (
            <GuardrailsTab persona={persona} />
          )}
          
          {activeTab === 'communication' && (
            <CommunicationTab 
              settings={communicationSettings}
              onUpdateLanguage={updateLanguageControls}
              onUpdateCitation={updateCitationPolicy}
              getConfidenceLevelLabel={getConfidenceLevelLabel}
            />
          )}
          
          {activeTab === 'audit' && (
            <AuditTab 
              entries={auditEntries}
              stats={personaStats}
              personaId={persona.id}
              projectId={currentProject?.id || ''}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex justify-between bg-slate-50">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Reset to Defaults
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                hasChanges
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// GUARDRAILS TAB (READ-ONLY)
// ==========================================

function GuardrailsTab({ persona }: { persona: PersonaConfig }) {
  const [expandedSection, setExpandedSection] = useState<string | null>('rules');
  
  return (
    <div className="space-y-6">
      {/* Locked Notice */}
      <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-lg border border-slate-200">
        <Lock className="w-5 h-5 text-slate-500" />
        <div>
          <div className="text-sm font-medium text-slate-700">Governance Layer - Read Only</div>
          <div className="text-xs text-slate-500 mt-0.5">
            These settings are locked for regulatory compliance and cannot be modified.
          </div>
        </div>
      </div>

      {/* Validation Rules */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedSection(expandedSection === 'rules' ? null : 'rules')}
          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-slate-900">
              Validation Rules ({persona.validationRules.length})
            </span>
          </div>
          {expandedSection === 'rules' ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>
        
        {expandedSection === 'rules' && (
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="space-y-2 opacity-60">
              {persona.validationRules.map((rule: string) => (
                <div 
                  key={rule}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span className="text-sm text-slate-700">
                      {formatRuleName(rule)}
                    </span>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inference Boundaries */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedSection(expandedSection === 'inferences' ? null : 'inferences')}
          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-slate-900">
              Inference Boundaries
            </span>
          </div>
          {expandedSection === 'inferences' ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>
        
        {expandedSection === 'inferences' && (
          <div className="p-4 border-t border-slate-200 bg-white space-y-4">
            {/* System Locked Disallowed */}
            <div>
              <div className="text-xs font-medium text-red-700 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                Never Allowed (System Locked)
              </div>
              <div className="space-y-2 opacity-60">
                {SYSTEM_LOCKED_DISALLOWED_INFERENCES.map((inf: InferenceType) => (
                  <div 
                    key={inf.id}
                    className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <X className="w-4 h-4 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-red-900">{inf.title}</div>
                      <div className="text-xs text-red-700 mt-0.5">{inf.description}</div>
                      {inf.regulatoryBasis && (
                        <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {inf.regulatoryBasis}
                        </div>
                      )}
                    </div>
                    <Lock className="w-3.5 h-3.5 text-red-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modules */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedSection(expandedSection === 'modules' ? null : 'modules')}
          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-900">
              Active Modules ({persona.modules.length})
            </span>
          </div>
          {expandedSection === 'modules' ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>
        
        {expandedSection === 'modules' && (
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex flex-wrap gap-2 opacity-60">
              {persona.modules.map((module: string) => (
                <span 
                  key={module}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200"
                >
                  {formatModuleName(module)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Educational Callout */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-purple-900">
          <div className="font-medium mb-1">Why are these settings locked?</div>
          <div className="text-purple-800 text-xs leading-relaxed">
            These governance rules ensure regulatory compliance and prevent the AI from making 
            unauthorized claims. The locked settings create an auditable, immutable foundation 
            that protects both researchers and patients.
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMMUNICATION TAB (EDITABLE)
// ==========================================

interface CommunicationTabProps {
  settings: CommunicationSettings;
  onUpdateLanguage: (updates: Partial<LanguageControls>) => void;
  onUpdateCitation: (updates: Partial<CitationPolicy>) => void;
  getConfidenceLevelLabel: (level: number) => string;
}

function CommunicationTab({ 
  settings, 
  onUpdateLanguage,
  onUpdateCitation,
  getConfidenceLevelLabel,
}: CommunicationTabProps) {
  const [newPhrase, setNewPhrase] = useState('');
  
  const addForbiddenPhrase = () => {
    if (newPhrase.trim() && !settings.languageControls.forbiddenPhrases.includes(newPhrase.trim())) {
      onUpdateLanguage({ 
        forbiddenPhrases: [...settings.languageControls.forbiddenPhrases, newPhrase.trim()] 
      });
      setNewPhrase('');
    }
  };
  
  const removeForbiddenPhrase = (phrase: string) => {
    onUpdateLanguage({ 
      forbiddenPhrases: settings.languageControls.forbiddenPhrases.filter((p: string) => p !== phrase) 
    });
  };

  return (
    <div className="space-y-6">
      {/* Editable Notice */}
      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
        <CheckCircle2 className="w-5 h-5 text-green-600" />
        <div>
          <div className="text-sm font-medium text-green-800">Communication Settings - Editable</div>
          <div className="text-xs text-green-600 mt-0.5">
            Customize how this persona communicates. Changes don't affect validation logic.
          </div>
        </div>
      </div>

      {/* Coaching Tone Selection - Reused from PersonaEditor */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Coaching Tone
        </label>
        <p className="text-xs text-slate-600 mb-3">
          Select how the AI communicates feedback
        </p>
        <div className="grid grid-cols-3 gap-3">
          {/* Socratic */}
          <button
            onClick={() => onUpdateLanguage({ tone: 'socratic' })}
            className={`text-left p-4 rounded-lg border-2 transition-all ${
              settings.languageControls.tone === 'socratic'
                ? 'border-purple-600 bg-purple-50'
                : 'border-slate-200 bg-white hover:border-purple-300'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <MessageCircleQuestion className={`w-6 h-6 mb-2 ${
                settings.languageControls.tone === 'socratic' ? 'text-purple-600' : 'text-slate-400'
              }`} />
              <div className="text-sm font-medium text-slate-900">Socratic</div>
              <div className="text-xs text-slate-500 mt-1">Guiding questions</div>
            </div>
          </button>

          {/* Educational */}
          <button
            onClick={() => onUpdateLanguage({ tone: 'educational' })}
            className={`text-left p-4 rounded-lg border-2 transition-all ${
              settings.languageControls.tone === 'educational'
                ? 'border-purple-600 bg-purple-50'
                : 'border-slate-200 bg-white hover:border-purple-300'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <BookOpen className={`w-6 h-6 mb-2 ${
                settings.languageControls.tone === 'educational' ? 'text-purple-600' : 'text-slate-400'
              }`} />
              <div className="text-sm font-medium text-slate-900">Educational</div>
              <div className="text-xs text-slate-500 mt-1">Explains reasoning</div>
            </div>
          </button>

          {/* Directive */}
          <button
            onClick={() => onUpdateLanguage({ tone: 'directive' })}
            className={`text-left p-4 rounded-lg border-2 transition-all ${
              settings.languageControls.tone === 'directive'
                ? 'border-purple-600 bg-purple-50'
                : 'border-slate-200 bg-white hover:border-purple-300'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <Command className={`w-6 h-6 mb-2 ${
                settings.languageControls.tone === 'directive' ? 'text-purple-600' : 'text-slate-400'
              }`} />
              <div className="text-sm font-medium text-slate-900">Directive</div>
              <div className="text-xs text-slate-500 mt-1">Direct feedback</div>
            </div>
          </button>
        </div>
      </div>

      {/* Linguistic Confidence Slider - Reused from PersonaEditor */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Linguistic Confidence
        </label>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Conservative</span>
            <span className="font-medium text-purple-600">
              {getConfidenceLevelLabel(settings.languageControls.confidenceLevel)}
            </span>
            <span className="text-slate-500">Exploratory</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={settings.languageControls.confidenceLevel}
            onChange={(e) => onUpdateLanguage({ confidenceLevel: parseInt(e.target.value) as 1|2|3|4|5 })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
          </div>
        </div>
      </div>

      {/* Output Constraints - Reused from PersonaEditor */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-3">
          Output Constraints
        </label>
        <div className="space-y-3">
          {/* Never Write Full Sections */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex-1 pr-4">
              <div className="text-sm font-medium text-slate-900">Strict Evidence Only</div>
              <div className="text-xs text-slate-500 mt-0.5">
                AI is a coach, not a ghostwriter
              </div>
            </div>
            <ToggleSwitch 
              checked={settings.languageControls.neverWriteFullSections}
              onChange={(v) => onUpdateLanguage({ neverWriteFullSections: v })}
            />
          </div>

          {/* Forbidden Anthropomorphism */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex-1 pr-4">
              <div className="text-sm font-medium text-slate-900">Avoid First-Person</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Block "I think" - use "The data indicates"
              </div>
            </div>
            <ToggleSwitch 
              checked={settings.languageControls.forbiddenAnthropomorphism}
              onChange={(v) => onUpdateLanguage({ forbiddenAnthropomorphism: v })}
            />
          </div>

          {/* Jargon Level */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex-1 pr-4">
              <div className="text-sm font-medium text-slate-900">Technical Language</div>
              <div className="text-xs text-slate-500 mt-0.5">
                {settings.languageControls.jargonLevel === 'peer-review' ? 'Peer-Review Ready' : 
                 settings.languageControls.jargonLevel === 'technical' ? 'Standard Clinical' : 'Simplified'}
              </div>
            </div>
            <select
              value={settings.languageControls.jargonLevel}
              onChange={(e) => onUpdateLanguage({ jargonLevel: e.target.value as any })}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="layperson">Simplified</option>
              <option value="technical">Technical</option>
              <option value="peer-review">Peer-Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Forbidden Phrases - Reused from PersonaEditor */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Forbidden Phrases
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {settings.languageControls.forbiddenPhrases.map((phrase: string, index: number) => (
            <div
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm"
            >
              <span>{phrase}</span>
              <button
                onClick={() => removeForbiddenPhrase(phrase)}
                className="hover:bg-red-100 rounded p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newPhrase}
            onChange={(e) => setNewPhrase(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addForbiddenPhrase()}
            placeholder="Add forbidden phrase..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
          <button
            onClick={addForbiddenPhrase}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Citation Format */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Citation Format
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['vancouver', 'apa', 'harvard'] as const).map(format => (
            <button
              key={format}
              onClick={() => onUpdateCitation({ ...settings.citationPolicy })}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                settings.citationDisplay.format === format
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-slate-200 hover:border-purple-300'
              }`}
            >
              <div className="text-sm font-medium text-slate-900 capitalize">{format}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// AUDIT TAB
// ==========================================

interface AuditTabProps {
  entries: AIAuditLogEntry[];
  stats: PersonaAuditStats | null;
  personaId: PersonaId;
  projectId: string;
}

function AuditTab({ entries, stats, personaId, projectId }: AuditTabProps) {
  const handleExport = () => {
    const json = aiAuditLogger.exportPersonaLog(projectId, personaId);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${personaId}-audit-log-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-4 gap-3">
          <div className="p-4 bg-slate-50 rounded-lg text-center border border-slate-200">
            <div className="text-2xl font-semibold text-slate-700">{stats.suggestionsGenerated}</div>
            <div className="text-xs text-slate-500 mt-1">Generated</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center border border-green-200">
            <div className="text-2xl font-semibold text-green-700">{stats.suggestionsAccepted}</div>
            <div className="text-xs text-green-600 mt-1">Accepted</div>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg text-center border border-amber-200">
            <div className="text-2xl font-semibold text-amber-700">{stats.suggestionsDismissed}</div>
            <div className="text-xs text-amber-600 mt-1">Dismissed</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center border border-purple-200">
            <div className="text-2xl font-semibold text-purple-700">{stats.acceptanceRate}%</div>
            <div className="text-xs text-purple-600 mt-1">Acceptance</div>
          </div>
        </div>
      )}

      {/* Export Button */}
      <button 
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg border border-purple-200 transition-colors"
      >
        <Download className="w-4 h-4" />
        Export Audit Log
      </button>

      {/* Recent Entries */}
      <div>
        <h4 className="text-sm font-medium text-slate-900 mb-3">Recent Activity</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {entries.map(entry => (
            <div key={entry.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`text-lg ${entry.actor === 'System AI' ? '' : ''}`}>
                    {entry.actor === 'System AI' ? '🤖' : '👤'}
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    {formatActionName(entry.action)}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
              {entry.details.message && (
                <div className="text-xs text-slate-600 ml-7 truncate">
                  {entry.details.message}
                </div>
              )}
              {entry.details.severity && (
                <div className="ml-7 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    entry.details.severity === 'critical' ? 'bg-red-100 text-red-700' :
                    entry.details.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {entry.details.severity}
                  </span>
                </div>
              )}
            </div>
          ))}
          {entries.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">No activity recorded yet</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// HELPER COMPONENTS
// ==========================================

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-purple-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function formatRuleName(rule: string): string {
  return rule
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

function formatModuleName(module: string): string {
  return module
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

function formatActionName(action: string): string {
  return action
    .replace('AI_', '')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
}
