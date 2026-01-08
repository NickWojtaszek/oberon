// Citation Chip Input - @ Trigger for References

import { useState, useEffect, useRef } from 'react';
import { Search, FileText, Link2 } from 'lucide-react';
import type { SourceDocument } from '../../types/manuscript';
import type { CitationChip } from '../../types/aiMode';

interface CitationChipInputProps {
  sources: SourceDocument[];
  onInsertCitation: (citationKey: string, sourceId: string) => void;
}

export function CitationChipInput({ sources, onInsertCitation }: CitationChipInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSources = sources.filter(source => 
    source.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    source.citationKey.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (source: SourceDocument) => {
    onInsertCitation(source.citationKey, source.id);
    setIsOpen(false);
    setSearchQuery('');
    setSelectedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredSources.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredSources[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredSources[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-purple-600 hover:bg-purple-50 rounded transition-colors"
      >
        <Link2 className="w-3 h-3" />
        Insert Citation (@)
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search sources to cite..."
              className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400"
            />
            <button
              onClick={() => {
                setIsOpen(false);
                setSearchQuery('');
              }}
              className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded transition-colors"
            >
              ESC
            </button>
          </div>
        </div>

        {/* Source List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredSources.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <div className="text-sm">No sources found</div>
              <div className="text-xs mt-1">Upload sources in the Source Library first</div>
            </div>
          ) : (
            <div className="p-2">
              {filteredSources.map((source, index) => (
                <button
                  key={source.id}
                  onClick={() => handleSelect(source)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    index === selectedIndex
                      ? 'bg-purple-50 border border-purple-200'
                      : 'border border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 mb-1">
                        {source.fileName}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="px-2 py-0.5 bg-slate-100 rounded font-mono">
                          @{source.citationKey}
                        </span>
                        {source.isGrounded && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                            Grounded
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-600">
            Use ↑↓ to navigate, Enter to select, Esc to close
          </div>
        </div>
      </div>
    </div>
  );
}
