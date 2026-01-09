/**
 * Unified Sidebar for Protocol Workbench
 * Shows different AI Persona content based on the active tab
 * - Schema tab: Dr. Mokosh (Schema Architect) - Seelie
 * - Protocol tab: Dr. Themis (Ethics) + Dr. Goodfellow (Endpoint) + Field Guidance (tabbed)
 * - Dependencies tab: Hidden (dependency graph takes full width)
 * - Audit tab: Hidden (audit takes full width)
 */

import { useState } from 'react';
import { Sparkles, BookOpen, Sun, Snowflake, Scale, Blocks, Target, Shield } from 'lucide-react';
import { SchemaArchitectSidebar } from '../../ai-personas/personas/SchemaArchitect/SchemaArchitectSidebar';
import { IRBComplianceTrackerSidebar } from '../../ai-personas/personas/IRBComplianceTracker/IRBComplianceTrackerSidebar';
import { EndpointValidatorSidebar } from '../../ai-personas/personas/EndpointValidator/EndpointValidatorSidebar';
import { ProtocolDocumentSidebar } from './ProtocolDocumentSidebar';
import { getPersona } from '../../ai-personas/core/personaRegistry';
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
    }
    return null;
  };

  const activePersona = getActivePersona();

  // Don't show sidebar for dependencies and audit tabs (they need full width)
  if (activeTab === 'dependencies' || activeTab === 'audit') {
    return null;
  }

  return (
    <div className="w-[400px] border-l border-slate-200 bg-white overflow-y-auto flex-shrink-0">
      <div className="p-6 space-y-6">
        {/* Header with Active Persona */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-medium text-slate-900">The Oberon Faculty</h3>
          </div>
          
          {/* Active Persona Display */}
          {activePersona && (
            <div className={`p-2 rounded-lg mb-4 ${
              activePersona.court === 'seelie' ? 'bg-amber-50 border border-amber-200' : 'bg-slate-100 border border-slate-300'
            }`}>
              <div className="flex items-center gap-2">
                {activePersona.court === 'seelie' ? (
                  <Sun className="w-4 h-4 text-amber-600" />
                ) : (
                  <Snowflake className="w-4 h-4 text-slate-600" />
                )}
                <span className={`text-sm font-medium ${
                  activePersona.court === 'seelie' ? 'text-amber-900' : 'text-slate-800'
                }`}>
                  {activePersona.fairyName}
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  activePersona.court === 'seelie' ? 'bg-amber-200 text-amber-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {activePersona.court === 'seelie' ? 'Co-Pilot' : 'Auditor'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 ml-6">{activePersona.name}</p>
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
    </div>
  );
}