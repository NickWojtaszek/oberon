/**
 * Unified Sidebar for Protocol Workbench
 * Shows different AI Persona content based on the active tab
 * - Schema tab: Dr. Mokosh (Schema Architect) - Seelie
 * - Protocol tab: Dr. Themis (Ethics) + Dr. Goodfellow (Endpoint) + Field Guidance (tabbed)
 * - Dependencies tab: Hidden (dependency graph takes full width)
 * - Audit tab: Hidden (audit takes full width)
 */

import { useState } from 'react';
import { 
  Sparkles, BookOpen, Sun, Snowflake, Scale, Blocks, Target, Shield, 
  Lock, Clock, CheckCircle2, AlertCircle, XCircle, ChevronDown, ChevronUp, Settings2, Zap
} from 'lucide-react';
import { SchemaArchitectSidebar } from '../../ai-personas/personas/SchemaArchitect/SchemaArchitectSidebar';
import { IRBComplianceTrackerSidebar } from '../../ai-personas/personas/IRBComplianceTracker/IRBComplianceTrackerSidebar';
import { EndpointValidatorSidebar } from '../../ai-personas/personas/EndpointValidator/EndpointValidatorSidebar';
import { ProtocolDocumentSidebar } from './ProtocolDocumentSidebar';
import { getPersona } from '../../ai-personas/core/personaRegistry';
import { usePersonas } from '../../ai-personas/core/personaContext';
import { PersonaConfigurationPanel } from '../../ai-personas/ui/PersonaConfigurationPanel';
import type { PersonaCustomization } from '../../../types/aiGovernance';
import type { SchemaBlock } from '../types';
import type { ProtocolMetadata, ProtocolContent } from '../types';

// Persona icon mapping
const PERSONA_ICONS: Record<string, any> = {
  'schema-architect': Blocks,
  'ethics-compliance': Scale,
  'endpoint-validator': Target,
};

interface ProtocolUnifiedSidebarProps {
  activeTab: 'schema' | 'dependencies' | 'protocol' | 'audit';
  schemaBlocks: SchemaBlock[];
  protocolMetadata: ProtocolMetadata;
  protocolContent: ProtocolContent;
  studyType?: string;
  onNavigateToSection?: (section: string) => void;
  activeField?: string;
  onUpdateMetadata?: (field: string, value: string) => void;
  onUpdateContent?: (field: string, value: string) => void;
}

export function ProtocolUnifiedSidebar({
  activeTab,
  schemaBlocks,
  protocolMetadata,
  protocolContent,
  studyType,
  onNavigateToSection,
  activeField = 'protocolTitle',
  onUpdateMetadata = () => {},
  onUpdateContent = () => {}
}: ProtocolUnifiedSidebarProps) {
  const [protocolSubTab, setProtocolSubTab] = useState<'irb' | 'endpoint' | 'guidance'>('guidance');
  const [isPersonaExpanded, setIsPersonaExpanded] = useState(false);
  const [configPersona, setConfigPersona] = useState<any>(null);
  const [personaCustomizations, setPersonaCustomizations] = useState<Record<string, PersonaCustomization>>({});
  
  const { state } = usePersonas();

  // Get active persona based on current tab/subtab
  const getActivePersona = () => {
    if (activeTab === 'schema') {
      return getPersona('schema-architect'); // Dr. Mokosh
    }
    if (activeTab === 'protocol') {
      if (protocolSubTab === 'irb') {
        return getPersona('ethics-compliance'); // Dr. Themis
      }
      if (protocolSubTab === 'endpoint') {
        return getPersona('endpoint-validator'); // Dr. Goodfellow
      }
      // Guidance tab - use Dr. Themis for governance
      return getPersona('ethics-compliance');
    }
    return null;
  };

  const activePersona = getActivePersona();
  const personaState = activePersona ? state.personas[activePersona.id] : null;
  const validation = personaState?.lastValidation;

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

  const handleSaveCustomization = (customization: PersonaCustomization) => {
    setPersonaCustomizations(prev => ({
      ...prev,
      [customization.personaId]: customization
    }));
    setConfigPersona(null);
  };

  // Don't show sidebar for dependencies and audit tabs (they need full width)
  if (activeTab === 'dependencies' || activeTab === 'audit') {
    return null;
  }

  const status = getValidationStatus();
  const StatusIcon = status.icon;
  const Icon = activePersona ? PERSONA_ICONS[activePersona.id] : null;
  const CourtIcon = activePersona?.court === 'seelie' ? Sun : Snowflake;

  return (
    <div className="w-[400px] border-l border-slate-200 bg-white overflow-y-auto flex-shrink-0">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="font-medium text-slate-900">The Oberon Faculty</h3>
            </div>
            {activePersona && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                activePersona.court === 'seelie' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'
              }`}>
                <CourtIcon className="w-3 h-3" />
                1 {activePersona.court === 'seelie' ? 'Seelie' : 'Unseelie'}
              </div>
            )}
          </div>
          
          {/* Rich Persona Card - Like Dr. Grim */}
          {activePersona && (
            <div className={`rounded-lg border-2 transition-all ${
              isPersonaExpanded 
                ? activePersona.court === 'seelie'
                  ? 'border-amber-300 bg-amber-50'
                  : 'border-slate-400 bg-slate-100'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}>
              {/* Persona Header - Clickable */}
              <button
                onClick={() => setIsPersonaExpanded(!isPersonaExpanded)}
                className="w-full p-3 text-left"
              >
                <div className="flex items-start gap-2">
                  {/* Icon with Court badge */}
                  <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isPersonaExpanded ? 'bg-white/50' : activePersona.color.bg
                  }`}>
                    {Icon && <Icon className={`w-4 h-4 ${activePersona.color.icon}`} />}
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                      activePersona.court === 'seelie' ? 'bg-amber-100' : 'bg-slate-200'
                    }`}>
                      <CourtIcon className={`w-2.5 h-2.5 ${
                        activePersona.court === 'seelie' ? 'text-amber-600' : 'text-slate-600'
                      }`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <h4 className="text-sm font-semibold text-slate-900">
                        {activePersona.fairyName}
                      </h4>
                      {isPersonaExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-1.5">{activePersona.name}</p>

                    {/* Status Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                        status.color === 'green' ? 'bg-green-100 text-green-700' :
                        status.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                        status.color === 'red' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.score !== null ? `${status.score}%` : status.label}
                      </div>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                        <Lock className="w-3 h-3" />
                        {activePersona.validationRules?.length || 0} rules
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              {isPersonaExpanded && (
                <div className="px-3 pb-3 space-y-3 border-t border-slate-200">
                  {/* Court & Folklore Info */}
                  <div className={`pt-3 p-2 rounded-lg ${
                    activePersona.court === 'seelie' ? 'bg-amber-50' : 'bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <CourtIcon className={`w-4 h-4 ${
                        activePersona.court === 'seelie' ? 'text-amber-600' : 'text-slate-600'
                      }`} />
                      <span className={`text-xs font-medium ${
                        activePersona.court === 'seelie' ? 'text-amber-800' : 'text-slate-700'
                      }`}>
                        {activePersona.court === 'seelie' ? 'Seelie Court • Co-Pilot' : 'Unseelie Court • Auditor'}
                      </span>
                    </div>
                    {activePersona.folkloreOrigin && (
                      <p className="text-[10px] text-slate-500 italic ml-6">
                        {activePersona.folkloreOrigin}
                      </p>
                    )}
                  </div>
                  
                  {/* Configure Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfigPersona(activePersona);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                      Configure
                    </button>
                  </div>
                  
                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activePersona.description}
                  </p>

                  {/* Suggested Actions */}
                  <div>
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Suggested Actions
                    </div>
                    <div className="space-y-1">
                      {activePersona.realTimeValidation && (
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
          )}

          {/* Sub-tabs for Protocol tab */}
          {activeTab === 'protocol' && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setProtocolSubTab('guidance')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  protocolSubTab === 'guidance'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Guidance</span>
                </div>
              </button>
              <button
                onClick={() => setProtocolSubTab('irb')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  protocolSubTab === 'irb'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>IRB</span>
                </div>
              </button>
              <button
                onClick={() => setProtocolSubTab('endpoint')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  protocolSubTab === 'endpoint'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>Endpoints</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Content based on active tab */}
        <div className="-m-6">
          {activeTab === 'schema' && (
            <SchemaArchitectSidebar
              schemaBlocks={schemaBlocks}
              studyType={studyType}
            />
          )}

          {activeTab === 'protocol' && protocolSubTab === 'guidance' && (
            <div className="p-6">
              <ProtocolDocumentSidebar
                open={true}
                onClose={() => {}}
                activeField={activeField}
                metadata={protocolMetadata}
                content={protocolContent}
                onUpdateMetadata={onUpdateMetadata}
                onUpdateContent={onUpdateContent}
              />
            </div>
          )}

          {activeTab === 'protocol' && protocolSubTab === 'irb' && (
            <IRBComplianceTrackerSidebar
              protocolMetadata={protocolMetadata}
              studyType={studyType}
              onNavigateToSection={onNavigateToSection}
            />
          )}

          {activeTab === 'protocol' && protocolSubTab === 'endpoint' && (
            <EndpointValidatorSidebar
              protocolDocument={{
                ...protocolMetadata,
                ...protocolContent
              }}
              studyType={studyType}
              onNavigateToSection={onNavigateToSection}
            />
          )}
        </div>
      </div>
      
      {/* Persona Configuration Modal */}
      {configPersona && (
        <PersonaConfigurationPanel
          persona={configPersona}
          customization={personaCustomizations[configPersona.id] || null}
          isOpen={true}
          onClose={() => setConfigPersona(null)}
          onSaveCustomization={handleSaveCustomization}
        />
      )}
    </div>
  );
}