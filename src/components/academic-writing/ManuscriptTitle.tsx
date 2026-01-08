/**
 * Manuscript Title Editor
 * Prominent title display with inline editing capability
 */

import { useState, useRef, useEffect } from 'react';
import { Edit2, Check, X } from 'lucide-react';

interface ManuscriptTitleProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
}

export function ManuscriptTitle({ title, onTitleChange }: ManuscriptTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title || '');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditedTitle(title || '');
  }, [title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Select all text
      inputRef.current.setSelectionRange(0, inputRef.current.value.length);
      
      // Auto-resize textarea
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editedTitle.trim()) {
      onTitleChange(editedTitle.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(title || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      // Cmd+Enter or Ctrl+Enter to save
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedTitle(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  return (
    <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-[1600px] mx-auto">
        {isEditing ? (
          <div className="space-y-3">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={editedTitle}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 text-2xl font-semibold text-slate-900 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
                style={{
                  minHeight: '48px',
                  lineHeight: '1.4'
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Check className="w-4 h-4" />
                Save Title
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <span className="text-xs text-slate-500 ml-2">
                Press ⌘+Enter to save, Esc to cancel
              </span>
            </div>
          </div>
        ) : (
          <div className="group relative">
            <h1 className="text-2xl font-semibold text-slate-900 leading-snug pr-12">
              {title || 'Untitled Manuscript'}
            </h1>
            
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-0 right-0 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              title="Edit title"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
        )}

        {!isEditing && !title && (
          <p className="text-sm text-slate-500 mt-2">
            Click the edit icon to add a manuscript title
          </p>
        )}
      </div>
    </div>
  );
}