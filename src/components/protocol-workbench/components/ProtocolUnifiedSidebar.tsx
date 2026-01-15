/**
 * Unified Sidebar for Protocol Workbench
 * 
 * Clean design: Shows personas stacked, no tabs, no boilerplate
 * - Schema tab: Dr. Mokosh (Schema Architect)
 * - Protocol tab: Dr. Themis (Ethics) + Dr. Goodfellow (Endpoint) stacked
 * - Dependencies/Audit tabs: Hidden (full width content)
 */

import { useState } from 'react';
import {
  Sparkles, Sun, Snowflake, Scale, Blocks, Target, Users, Syringe, GitCompare,
  Lock, Clock, CheckCircle2, AlertCircle, XCircle, ChevronDown, ChevronUp, Settings2, Zap, Lightbulb, ArrowRight
} from 'lucide-react';
import { SchemaArchitectSidebar } from '../../ai-personas/personas/SchemaArchitect/SchemaArchitectSidebar';
import { getPersona } from '../../ai-personas/core/personaRegistry';
import { usePersonas } from '../../ai-personas/core/personaContext';
import { useProject } from '../../../contexts/ProtocolContext';
import { PersonaConfigurationPanel } from '../../ai-personas/ui/PersonaConfigurationPanel';
import { ProtocolUploadWidget } from './ProtocolUploadWidget';
import type { PersonaCustomization } from '../../../types/aiGovernance';
import type { PersonaConfig } from '../../ai-personas/core/personaTypes';
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
  onProtocolExtracted?: (extractedText: string, fileName: string) => void;
  onClearProtocol?: () => void;
  protocolFileName?: string;
}

export function ProtocolUnifiedSidebar({
  activeTab,
  schemaBlocks,
  studyType,
  onProtocolExtracted,
  onClearProtocol,
  protocolFileName,
}: ProtocolUnifiedSidebarProps) {
  const [expandedPersona, setExpandedPersona] = useState<string | null>(null);
  const [configPersona, setConfigPersona] = useState<PersonaConfig | null>(null);
  const [personaCustomizations, setPersonaCustomizations] = useState<Record<string, PersonaCustomization>>({});
  
  const { state } = usePersonas();

  // Access project context via useProject hook
  const { currentProject } = useProject();
  
  // Get PICO data from project if available
  const picoData = currentProject?.studyMethodology?.hypothesis?.picoFramework;

  // Get personas for protocol tab
  const ethicsPersona = getPersona('ethics-compliance');    // Dr. Themis
  const endpointPersona = getPersona('endpoint-validator'); // Dr. Goodfellow
  const schemaPersona = getPersona('schema-architect');     // Dr. Mokosh

  const handleSaveCustomization = (customization: PersonaCustomization) => {
    setPersonaCustomizations(prev => ({
      ...prev,
      [customization.personaId]: customization
    }));
    setConfigPersona(null);
  };

  // Don't show sidebar for dependencies and audit tabs
  if (activeTab === 'dependencies' || activeTab === 'audit') {
    return null;
  }

  // Get personas to display based on tab
  const getPersonasForTab = (): PersonaConfig[] => {
    if (activeTab === 'schema') {
      return schemaPersona ? [schemaPersona] : [];
    }
    if (activeTab === 'protocol') {
      const personas: PersonaConfig[] = [];
      if (ethicsPersona) personas.push(ethicsPersona);
      if (endpointPersona) personas.push(endpointPersona);
      return personas;
    }
    return [];
  };

  const personas = getPersonasForTab();
  const seelieCount = personas.filter(p => p.court === 'seelie').length;
  const unseelieCount = personas.filter(p => p.court === 'unseelie').length;

  // Render a single persona card
  const renderPersonaCard = (persona: PersonaConfig) => {
    const personaState = state.personas[persona.id];
    const validation = personaState?.lastValidation;
    const isExpanded = expandedPersona === persona.id;
    const Icon = PERSONA_ICONS[persona.id];
    const CourtIcon = persona.court === 'seelie' ? Sun : Snowflake;

    // Get validation status
    const getValidationStatus = () => {
      if (!validation) {
        return { icon: Clock, color: 'slate', label: 'Not validated', score: null };
      }
      const score = validation.complianceScore;
      if (score >= 90) return { icon: CheckCircle2, color: 'green', label: 'Excellent', score };
      if (score >= 75) return { icon: CheckCircle2, color: 'amber', label: 'Good', score };
      if (score >= 50) return { icon: AlertCircle, color: 'orange', label: 'Needs work', score };
      return { icon: XCircle, color: 'red', label: 'Critical', score };
    };

    const status = getValidationStatus();
    const StatusIcon = status.icon;

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
        {/* Persona Header - Clickable */}
        <button
          onClick={() => setExpandedPersona(isExpanded ? null : persona.id)}
          className="w-full p-3 text-left"
        >
          <div className="flex items-start gap-3">
            {/* Icon with Court badge */}
            <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isExpanded ? 'bg-white/50' : persona.color.bg
            }`}>
              {Icon && <Icon className={`w-5 h-5 ${persona.color.icon}`} />}
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
                <h4 className="text-sm font-semibold text-slate-900">
                  {persona.fairyName}
                </h4>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-slate-500 mb-1.5">{persona.name}</p>

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
                  {persona.validationRules?.length || 0} rules
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
                    <span className="text-[10px]">Review {validation.criticalCount} critical issue{validation.criticalCount > 1 ? 's' : ''}</span>
                  </div>
                )}
                {validation && validation.warningCount > 0 && (
                  <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded p-2">
                    <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    <span className="text-[10px]">Address {validation.warningCount} warning{validation.warningCount > 1 ? 's' : ''}</span>
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
  };

  return (
    <div className="w-[400px] border-l border-slate-200 bg-white overflow-y-auto flex-shrink-0">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-medium text-slate-900">The Oberon Faculty</h3>
          </div>
          <div className="flex items-center gap-1">
            {seelieCount > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                <Sun className="w-3 h-3" />
                {seelieCount}
              </div>
            )}
            {unseelieCount > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-600">
                <Snowflake className="w-3 h-3" />
                {unseelieCount}
              </div>
            )}
          </div>
        </div>

        {/* Schema tab: Use existing SchemaArchitectSidebar */}
        {activeTab === 'schema' && (
          <div className="-mx-6 -mb-6">
            <SchemaArchitectSidebar
              schemaBlocks={schemaBlocks}
              studyType={studyType}
            />
          </div>
        )}

        {/* Protocol tab: Stack both personas */}
        {activeTab === 'protocol' && (
          <div className="space-y-3">
            {/* PICO Panel - Shows data from Research Wizard */}
            {picoData && (picoData.population || picoData.intervention || picoData.comparison || picoData.outcome) ? (
              <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-medium text-indigo-900">PICO from Research Wizard</h4>
                </div>
                <p className="text-[10px] text-indigo-700 mb-3">
                  Your hypothesis informs this protocol. Use these as guides for schema design.
                </p>
                <div className="space-y-2">
                  {picoData.population && (
                    <div className="flex items-start gap-2 p-2 bg-white rounded border border-indigo-100">
                      <Users className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-medium text-slate-700">Population</div>
                        <div className="text-[10px] text-slate-600 truncate" title={picoData.population}>{picoData.population}</div>
                        <div className="text-[10px] text-indigo-500 mt-0.5 flex items-center gap-1">
                          <ArrowRight className="w-2.5 h-2.5" />
                          Inclusion/exclusion criteria
                        </div>
                      </div>
                    </div>
                  )}
                  {picoData.intervention && (
                    <div className="flex items-start gap-2 p-2 bg-white rounded border border-indigo-100">
                      <Syringe className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-medium text-slate-700">Intervention</div>
                        <div className="text-[10px] text-slate-600 truncate" title={picoData.intervention}>{picoData.intervention}</div>
                        <div className="text-[10px] text-indigo-500 mt-0.5 flex items-center gap-1">
                          <ArrowRight className="w-2.5 h-2.5" />
                          Treatment arm variables
                        </div>
                      </div>
                    </div>
                  )}
                  {picoData.comparison && (
                    <div className="flex items-start gap-2 p-2 bg-white rounded border border-indigo-100">
                      <GitCompare className="w-3 h-3 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-medium text-slate-700">Comparison</div>
                        <div className="text-[10px] text-slate-600 truncate" title={picoData.comparison}>{picoData.comparison}</div>
                        <div className="text-[10px] text-indigo-500 mt-0.5 flex items-center gap-1">
                          <ArrowRight className="w-2.5 h-2.5" />
                          Control group definition
                        </div>
                      </div>
                    </div>
                  )}
                  {picoData.outcome && (
                    <div className="flex items-start gap-2 p-2 bg-white rounded border border-indigo-100">
                      <Target className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-medium text-slate-700">Outcome</div>
                        <div className="text-[10px] text-slate-600 truncate" title={picoData.outcome}>{picoData.outcome}</div>
                        <div className="text-[10px] text-indigo-500 mt-0.5 flex items-center gap-1">
                          <ArrowRight className="w-2.5 h-2.5" />
                          Primary endpoint variables
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-slate-400" />
                  <h4 className="text-sm font-medium text-slate-600">No PICO Defined</h4>
                </div>
                <p className="text-[10px] text-slate-500">
                  Complete the Research Wizard to define your PICO hypothesis. It will appear here to guide your protocol design.
                </p>
              </div>
            )}

            {/* Protocol Upload Widget */}
            {onProtocolExtracted && (
              <ProtocolUploadWidget
                onProtocolExtracted={onProtocolExtracted}
                onClear={onClearProtocol}
                currentFileName={protocolFileName}
              />
            )}

            {personas.map(persona => renderPersonaCard(persona))}
            
            {/* Footer hint */}
            <p className="text-[10px] text-slate-400 text-center pt-2">
              Click personas to view details and configure
            </p>
          </div>
        )}
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
