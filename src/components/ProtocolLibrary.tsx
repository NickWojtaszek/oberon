import { FileText, Calendar, User, CheckCircle2, Edit3, Eye, Archive, GitBranch, Clock, AlertCircle, Plus } from 'lucide-react';
import type { SavedProtocol, ProtocolVersion } from './protocol-workbench/types';

interface ProtocolLibraryProps {
  savedProtocols: SavedProtocol[];
  onLoadProtocol: (protocolId: string, versionId: string) => void;
  onClose: () => void;
  onCreateNew: () => void;
}

export function ProtocolLibrary({ savedProtocols, onLoadProtocol, onClose, onCreateNew }: ProtocolLibraryProps) {
  const getStatusBadge = (status: 'draft' | 'published' | 'archived') => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">
            <Edit3 className="w-3 h-3" />
            Draft
          </span>
        );
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
            <CheckCircle2 className="w-3 h-3" />
            Published
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
            <Archive className="w-3 h-3" />
            Archived
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl text-slate-900">Protocol Library</h2>
              <p className="text-sm text-slate-600 mt-1">
                Load existing protocols or create a new one
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onCreateNew}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New Protocol
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Protocol List */}
        <div className="flex-1 overflow-y-auto p-6">
          {savedProtocols.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg text-slate-900 mb-2">No Saved Protocols</h3>
              <p className="text-slate-600 mb-6">
                Create your first protocol to get started
              </p>
              <button
                onClick={onCreateNew}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create New Protocol
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedProtocols.map((protocol) => {
                const currentVersionData = protocol.versions.find(v => v.versionNumber === protocol.currentVersion);
                const latestDraftData = protocol.latestDraftVersion 
                  ? protocol.versions.find(v => v.versionNumber === protocol.latestDraftVersion)
                  : null;

                return (
                  <div
                    key={protocol.id}
                    className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:border-indigo-300 transition-colors"
                  >
                    {/* Protocol Header */}
                    <div className="p-5 bg-slate-50 border-b border-slate-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg text-slate-900 font-medium">
                              {protocol.protocolTitle}
                            </h3>
                            <span className="text-sm text-slate-600 px-2 py-1 bg-white border border-slate-300 rounded">
                              {protocol.protocolNumber}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Created {new Date(protocol.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Modified {new Date(protocol.modifiedAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <GitBranch className="w-3 h-3" />
                              {protocol.versions.length} version{protocol.versions.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Current Version Info */}
                      {currentVersionData && (
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-slate-700">
                            Current: <strong>v{currentVersionData.versionNumber}</strong>
                          </span>
                          {getStatusBadge(currentVersionData.status)}
                          <span className="text-slate-600">
                            Modified by {currentVersionData.modifiedBy}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Versions */}
                    <div className="p-5">
                      <div className="space-y-2">
                        {/* Latest Draft (if exists) */}
                        {latestDraftData && (
                          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                  <Edit3 className="w-5 h-5 text-amber-700" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-slate-900">
                                      v{latestDraftData.versionNumber}
                                    </span>
                                    {getStatusBadge(latestDraftData.status)}
                                    {latestDraftData.changeLog && (
                                      <span className="text-xs text-slate-600">• {latestDraftData.changeLog}</span>
                                    )}
                                  </div>
                                  <div className="text-xs text-slate-600">
                                    Modified {new Date(latestDraftData.modifiedAt).toLocaleString()} by {latestDraftData.modifiedBy}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => onLoadProtocol(protocol.id, latestDraftData.id)}
                                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
                              >
                                Continue Editing
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Published Version */}
                        {currentVersionData && currentVersionData.status === 'published' && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                  <CheckCircle2 className="w-5 h-5 text-green-700" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-slate-900">
                                      v{currentVersionData.versionNumber}
                                    </span>
                                    {getStatusBadge(currentVersionData.status)}
                                  </div>
                                  <div className="text-xs text-slate-600">
                                    Published {new Date(currentVersionData.modifiedAt).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => onLoadProtocol(protocol.id, currentVersionData.id)}
                                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Show other versions if there are more than 2 */}
                        {protocol.versions.length > 2 && (
                          <details className="text-sm">
                            <summary className="cursor-pointer text-slate-600 hover:text-slate-900 py-2 px-3 rounded hover:bg-slate-50">
                              View {protocol.versions.length - (latestDraftData ? 1 : 0) - (currentVersionData ? 1 : 0)} older version(s)
                            </summary>
                            <div className="mt-2 space-y-2 pl-3">
                              {protocol.versions
                                .filter(v => 
                                  v.id !== latestDraftData?.id && 
                                  v.id !== currentVersionData?.id
                                )
                                .sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime())
                                .map((version) => (
                                  <div
                                    key={version.id}
                                    className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-slate-900">v{version.versionNumber}</span>
                                      {getStatusBadge(version.status)}
                                      <span className="text-xs text-slate-600">
                                        {new Date(version.modifiedAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => onLoadProtocol(protocol.id, version.id)}
                                      className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-medium transition-colors"
                                    >
                                      View
                                    </button>
                                  </div>
                                ))}
                            </div>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
