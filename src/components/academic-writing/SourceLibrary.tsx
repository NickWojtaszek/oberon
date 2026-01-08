// NotebookLM-Style Source Library with Grounding Toggle and Intelligence Chat

import { useState } from 'react';
import { Upload, FileText, File, Check, X, Link2, Lock, Unlock, MessageSquare } from 'lucide-react';
import { SourceChat } from './SourceChat';
import type { SourceDocument } from '../../types/manuscript';
import type { StatisticalManifest } from '../analytics-stats/types';

interface SourceLibraryProps {
  sources: SourceDocument[];
  onSourceAdd: (source: SourceDocument) => void;
  onSourceToggle: (sourceId: string) => void;
  onSourceRemove: (sourceId: string) => void;
  groundingEnabled: boolean;
  onGroundingToggle: () => void;
  manifest?: StatisticalManifest;
  onInsertToDraft?: (text: string, section?: string) => void;
}

export function SourceLibrary({ 
  sources, 
  onSourceAdd, 
  onSourceToggle, 
  onSourceRemove,
  groundingEnabled,
  onGroundingToggle,
  manifest,
  onInsertToDraft
}: SourceLibraryProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    // Simulate file upload
    const fileName = 'Uploaded_Document.pdf';
    const newSource: SourceDocument = {
      id: `source-${Date.now()}`,
      fileName,
      fileType: 'pdf',
      uploadedAt: Date.now(),
      citationKey: fileName.replace(/[^a-zA-Z0-9]/g, '_'),
      isGrounded: true,
      excerpts: []
    };

    onSourceAdd(newSource);
  };

  const handleFileSelect = () => {
    // Simulate file selection
    const fileName = prompt('Enter file name (e.g., SVS_Guidelines_2024.pdf):');
    if (!fileName) return;

    const newSource: SourceDocument = {
      id: `source-${Date.now()}`,
      fileName,
      fileType: fileName.endsWith('.pdf') ? 'pdf' : 'reference',
      uploadedAt: Date.now(),
      citationKey: fileName.replace(/[^a-zA-Z0-9]/g, '_'),
      isGrounded: true,
      excerpts: []
    };

    onSourceAdd(newSource);
  };

  const handleSourceToggle = (sourceId: string) => {
    onSourceToggle(sourceId);
    if (selectedSourceIds.includes(sourceId)) {
      setSelectedSourceIds(selectedSourceIds.filter(id => id !== sourceId));
    }
  };

  const handleSourceRemove = (sourceId: string) => {
    onSourceRemove(sourceId);
    setSelectedSourceIds(selectedSourceIds.filter(id => id !== sourceId));
  };

  const handleChatToggle = (sourceId: string) => {
    if (selectedSourceIds.includes(sourceId)) {
      setSelectedSourceIds(selectedSourceIds.filter(id => id !== sourceId));
    } else {
      setSelectedSourceIds([...selectedSourceIds, sourceId]);
    }
    setShowChat(!showChat);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {!showChat ? (
        <>
          {/* Header */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-900">Source Library</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowChat(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                >
                  <MessageSquare className="w-3 h-3" />
                  Chat
                </button>
                <button
                  onClick={onGroundingToggle}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    groundingEnabled
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {groundingEnabled ? (
                    <>
                      <Lock className="w-3 h-3" />
                      Grounded
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3 h-3" />
                      Ungrounded
                    </>
                  )}
                </button>
              </div>
            </div>

            {groundingEnabled && (
              <div className="px-3 py-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                AI citations locked to uploaded sources only
              </div>
            )}
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`m-4 p-8 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
              isDragging
                ? 'border-blue-400 bg-blue-50'
                : 'border-slate-300 bg-slate-50 hover:border-slate-400'
            }`}
            onClick={handleFileSelect}
          >
            <div className="text-center">
              <Upload className="w-8 h-8 mx-auto mb-3 text-slate-400" />
              <div className="text-sm text-slate-600 mb-1">
                Drop PDFs or Guidelines here
              </div>
              <div className="text-xs text-slate-500">
                or click to browse
              </div>
            </div>
          </div>

          {/* Source List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {sources.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No sources added yet
              </div>
            ) : (
              <div className="space-y-2">
                {sources.map(source => (
                  <div
                    key={source.id}
                    className={`p-3 border rounded-lg transition-colors ${
                      source.isGrounded
                        ? 'border-green-200 bg-green-50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {source.fileType === 'pdf' ? (
                          <FileText className="w-4 h-4 text-red-600" />
                        ) : (
                          <File className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {source.fileName}
                        </div>
                        {source.metadata && (
                          <div className="text-xs text-slate-600 mt-1">
                            {source.metadata.authors?.slice(0, 2).join(', ')} ({source.metadata.year})
                          </div>
                        )}
                        <div className="text-xs text-slate-500 mt-1">
                          @{source.citationKey}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSourceToggle(source.id)}
                          className={`p-1 rounded transition-colors ${
                            source.isGrounded
                              ? 'text-green-600 hover:bg-green-100'
                              : 'text-slate-400 hover:bg-slate-100'
                          }`}
                          title={source.isGrounded ? 'Grounded (AI can cite)' : 'Not grounded'}
                        >
                          {source.isGrounded ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleSourceRemove(source.id)}
                          className="p-1 rounded text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Remove source"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="text-xs text-slate-600">
              {sources.filter(s => s.isGrounded).length} / {sources.length} sources grounded
            </div>
          </div>
        </>
      ) : (
        <div className="h-full flex flex-col">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <h3 className="text-sm font-medium text-slate-900">Intelligence Chat</h3>
            <button
              onClick={() => setShowChat(false)}
              className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded transition-colors"
            >
              Back to Sources
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <SourceChat
              sources={sources}
              selectedSourceIds={selectedSourceIds}
              manifest={manifest}
              onInsertToDraft={onInsertToDraft || (() => {})}
            />
          </div>
        </div>
      )}
    </div>
  );
}