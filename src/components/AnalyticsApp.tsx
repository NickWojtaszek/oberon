/**
 * Analytics App - Wrapper Component
 * Provides proper integration between Database schema and Analytics visualizations
 */

import { useState, useEffect } from 'react';
import { BarChart3, AlertCircle } from 'lucide-react';
import { Analytics } from './Analytics';
import { EmptyState } from './ui/EmptyState';
import { useDatabase } from './database/index';
import { ModulePersonaPanel } from './ai-personas/ui/ModulePersonaPanel';

interface AnalyticsAppProps {
  onNavigate?: (tab: string) => void;
}

export function AnalyticsApp({ onNavigate }: AnalyticsAppProps = {}) {
  const {
    savedProtocols,
    selectedProtocolId,
    setSelectedProtocolId,
    selectedVersionId,
    setSelectedVersionId,
    selectedProtocol,
    selectedVersion,
    databaseTables,
    loadProtocols
  } = useDatabase();

  // Load protocols on mount - useDatabase will handle auto-selection
  useEffect(() => {
    loadProtocols();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // No protocols available
  if (!savedProtocols || savedProtocols.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-250px)]">
        <EmptyState
          preset="noProtocols"
          onAction={onNavigate ? () => onNavigate('clinical-capture') : undefined}
          size="md"
        />
      </div>
    );
  }

  // No schema blocks - check selectedVersion (not selectedProtocol) since schemaBlocks are on versions
  if (!selectedVersion || !selectedVersion.schemaBlocks || selectedVersion.schemaBlocks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-250px)] bg-slate-50">
        <EmptyState
          preset="database"
          title="No Database Schema"
          description="The selected protocol version doesn't have any schema blocks defined. Add schema blocks in the Protocol Workbench to generate database tables."
          action={null}
          size="md"
        />
      </div>
    );
  }

  // Protocol Selector
  const getStatusBadge = (status: 'published' | 'draft' | 'archived') => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">Published</span>;
      case 'draft':
        return <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">Draft</span>;
      case 'archived':
        return <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">Archived</span>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Protocol Version Selector */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-end gap-4 flex-1">
            {/* Protocol Selector */}
            <div className="flex-1 max-w-md">
              <label className="block text-xs font-medium text-slate-600 mb-2">Protocol</label>
              <select
                value={selectedProtocolId || ''}
                onChange={(e) => {
                  setSelectedProtocolId(e.target.value);
                  const protocol = savedProtocols.find(p => p.id === e.target.value);
                  if (protocol && protocol.versions.length > 0) {
                    const activeVersions = protocol.versions.filter(v => v.status !== 'archived');
                    const publishedVersions = activeVersions.filter(v => v.status === 'published');
                    
                    if (publishedVersions.length > 0) {
                      setSelectedVersionId(publishedVersions[publishedVersions.length - 1].id);
                    } else if (activeVersions.length > 0) {
                      setSelectedVersionId(activeVersions[activeVersions.length - 1].id);
                    }
                  }
                }}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {savedProtocols.map(protocol => {
                  const number = (protocol as any).protocolNumber || protocol.studyNumber || 'N/A';
                  const title = (protocol as any).protocolTitle || protocol.name || 'Untitled';
                  return (
                    <option key={protocol.id} value={protocol.id}>
                      {number} - {title}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Version Selector */}
            {selectedProtocol && selectedProtocol.versions.length > 0 && (
              <div className="flex-1 max-w-md">
                <label className="block text-xs font-medium text-slate-600 mb-2">Version</label>
                <div className="flex gap-2">
                  <select
                    value={selectedVersionId || ''}
                    onChange={(e) => setSelectedVersionId(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {selectedProtocol.versions
                      .filter(v => v.status !== 'archived')
                      .map(version => (
                        <option key={version.id} value={version.id}>
                          Version {version.versionNumber} - {version.label || 'Draft'}
                        </option>
                      ))}
                  </select>
                  {selectedVersion && getStatusBadge(selectedVersion.status)}
                </div>
              </div>
            )}
          </div>

          {/* Stats Display */}
          {selectedVersion && (
            <div className="flex items-center gap-6 text-sm">
              <div>
                <div className="text-xs text-slate-500">Schema Blocks</div>
                <div className="font-medium text-slate-900">{selectedVersion.schemaBlocks.length}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Database Tables</div>
                <div className="font-medium text-slate-900">{databaseTables.length}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Content with Persona Panel */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Analytics
            tables={databaseTables}
            protocolNumber={(selectedProtocol as any)?.protocolNumber || selectedProtocol?.studyNumber}
            protocolVersion={selectedVersion?.versionNumber}
          />
        </div>
        
        {/* AI Personas Panel */}
        <ModulePersonaPanel module="analytics" />
      </div>
    </div>
  );
}