/**
 * Unified Sidebar for Protocol Workbench
 * Shows different AI Persona content based on the active tab
 * - Schema tab: Schema Architect
 * - Protocol tab: IRB Compliance Tracker + Endpoint Validator + Field Guidance (tabbed)
 * - Dependencies tab: Hidden (dependency graph takes full width)
 * - Audit tab: Hidden (audit takes full width)
 */

import { useState } from 'react';
import { Sparkles, Shield, Target, BookOpen } from 'lucide-react';
import { SchemaArchitectSidebar } from '../../ai-personas/personas/SchemaArchitect/SchemaArchitectSidebar';
import { IRBComplianceTrackerSidebar } from '../../ai-personas/personas/IRBComplianceTracker/IRBComplianceTrackerSidebar';
import { EndpointValidatorSidebar } from '../../ai-personas/personas/EndpointValidator/EndpointValidatorSidebar';
import { ProtocolDocumentSidebar } from './ProtocolDocumentSidebar';
import type { SchemaBlock } from '../types';
import type { ProtocolMetadata, ProtocolContent } from '../types';

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

  // Don't show sidebar for dependencies and audit tabs (they need full width)
  if (activeTab === 'dependencies' || activeTab === 'audit') {
    return null;
  }

  return (
    <div className="w-[400px] border-l border-slate-200 bg-white overflow-y-auto flex-shrink-0">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-medium text-slate-900">AI Assistant</h3>
          </div>

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