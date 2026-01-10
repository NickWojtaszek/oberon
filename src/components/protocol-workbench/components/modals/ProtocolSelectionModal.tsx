/**
 * Protocol Selection Modal
 * Shows when entering Protocol Workbench to choose between creating new or loading existing protocol
 */

import { useState } from 'react';
import { X, Plus, FolderOpen } from 'lucide-react';
import type { SavedProtocol } from '../../types';

interface ProtocolSelectionModalProps {
  isOpen: boolean;
  availableProtocols: SavedProtocol[];
  onCreateNew: () => void;
  onLoadExisting: (protocolId: string, versionId: string) => void;
  onCancel: () => void;
}

export function ProtocolSelectionModal({
  isOpen,
  availableProtocols,
  onCreateNew,
  onLoadExisting,
  onCancel
}: ProtocolSelectionModalProps) {
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>('');

  if (!isOpen) return null;

  const handleContinue = () => {
    if (mode === 'new') {
      onCreateNew();
    } else if (selectedProtocolId) {
      const protocol = availableProtocols.find(p => p.id === selectedProtocolId);
      if (protocol) {
        // Find latest draft, or fallback to latest version
        const latestDraft = protocol.versions.find(v => v.status === 'draft');
        const latestVersion = latestDraft || protocol.versions[protocol.versions.length - 1];

        if (latestVersion) {
          onLoadExisting(protocol.id, latestVersion.id);
        }
      }
    }
  };

  const canContinue = mode === 'new' || (mode === 'existing' && selectedProtocolId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Choose a Protocol</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Create New Option */}
          <button
            onClick={() => setMode('new')}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              mode === 'new'
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                mode === 'new'
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-slate-300'
              }`}>
                {mode === 'new' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-slate-900">Create New Protocol</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-2 ml-8">
              Start building a new protocol from scratch
            </p>
          </button>

          {/* Load Existing Option */}
          <button
            onClick={() => setMode('existing')}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              mode === 'existing'
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
            disabled={availableProtocols.length === 0}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                mode === 'existing'
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-slate-300'
              }`}>
                {mode === 'existing' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-slate-900">Load Existing Draft</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-2 ml-8">
              {availableProtocols.length > 0
                ? 'Continue working on a saved protocol'
                : 'No protocols available to load'}
            </p>
          </button>

          {/* Protocol Dropdown (shown when "Load Existing" is selected) */}
          {mode === 'existing' && availableProtocols.length > 0 && (
            <div className="ml-8 pt-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Protocol
              </label>
              <select
                value={selectedProtocolId}
                onChange={(e) => setSelectedProtocolId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a protocol...</option>
                {availableProtocols.map((protocol) => {
                  const draftCount = protocol.versions.filter(v => v.status === 'draft').length;
                  const publishedCount = protocol.versions.filter(v => v.status === 'published').length;

                  return (
                    <option key={protocol.id} value={protocol.id}>
                      {protocol.protocolTitle || protocol.protocolNumber || 'Untitled'}
                      {' '}({draftCount} draft{draftCount !== 1 ? 's' : ''}, {publishedCount} published)
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
