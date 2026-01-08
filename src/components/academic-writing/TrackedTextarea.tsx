// Textarea with tracked changes visualization

import { useRef, useEffect, useState } from 'react';
import type { TrackedChange, ViewMode } from '../../types/trackedChanges';
import { ROLE_COLORS } from '../../types/trackedChanges';

interface TrackedTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  viewMode: ViewMode;
  showChanges: boolean;
  changes: TrackedChange[];
  onTrackChange: (startPos: number, endPos: number, originalText: string, newText: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function TrackedTextarea({
  value,
  onChange,
  placeholder,
  viewMode,
  showChanges,
  changes,
  onTrackChange,
  className = '',
  style = {}
}: TrackedTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [previousValue, setPreviousValue] = useState(value);
  const cursorPositionRef = useRef<number | null>(null);

  // Restore cursor position after render
  useEffect(() => {
    if (cursorPositionRef.current !== null && textareaRef.current) {
      textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
      cursorPositionRef.current = null;
    }
  }, [value]);

  // Handle text changes and track them
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;

    // Store cursor position for restoration
    cursorPositionRef.current = cursorPos;

    // Detect change type
    if (newValue.length > previousValue.length) {
      // Insertion
      const insertedText = newValue.substring(cursorPos - (newValue.length - previousValue.length), cursorPos);
      onTrackChange(cursorPos - insertedText.length, cursorPos, '', insertedText);
    } else if (newValue.length < previousValue.length) {
      // Deletion
      const deletedText = previousValue.substring(cursorPos, cursorPos + (previousValue.length - newValue.length));
      onTrackChange(cursorPos, cursorPos + deletedText.length, deletedText, '');
    }

    setPreviousValue(newValue);
    onChange(newValue);
  };

  // Sync textarea scroll with overlay
  const handleScroll = () => {
    if (textareaRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Render text with tracked changes markup
  const renderMarkup = () => {
    if (viewMode === 'clean' || !showChanges) {
      return <div className="whitespace-pre-wrap break-words" style={style}>{value}</div>;
    }

    if (viewMode === 'original') {
      // Show original text without any changes
      let originalText = value;
      const sortedChanges = [...changes].sort((a, b) => b.startPos - a.startPos);

      for (const change of sortedChanges) {
        if (change.status === 'pending' || change.status === 'accepted') {
          if (change.type === 'insertion' && change.newText) {
            // Remove insertions
            const before = originalText.substring(0, change.startPos);
            const after = originalText.substring(change.startPos + change.newText.length);
            originalText = before + after;
          } else if (change.type === 'deletion' && change.originalText) {
            // Restore deletions
            const before = originalText.substring(0, change.startPos);
            const after = originalText.substring(change.startPos);
            originalText = before + change.originalText + after;
          } else if (change.type === 'replacement' && change.originalText && change.newText) {
            // Restore original in replacements
            const before = originalText.substring(0, change.startPos);
            const after = originalText.substring(change.startPos + change.newText.length);
            originalText = before + change.originalText + after;
          }
        }
      }

      return <div className="whitespace-pre-wrap break-words" style={style}>{originalText}</div>;
    }

    // Markup mode: show all changes with visual indicators
    const sortedChanges = [...changes]
      .filter(c => c.status === 'pending')
      .sort((a, b) => a.startPos - b.startPos);

    if (sortedChanges.length === 0) {
      return <div className="whitespace-pre-wrap break-words" style={style}>{value}</div>;
    }

    const segments: JSX.Element[] = [];
    let lastPos = 0;

    sortedChanges.forEach((change, idx) => {
      // Add text before this change
      if (change.startPos > lastPos) {
        segments.push(
          <span key={`text-${idx}`}>
            {value.substring(lastPos, change.startPos)}
          </span>
        );
      }

      // Add the change markup
      const roleColor = ROLE_COLORS[change.role];
      
      if (change.type === 'insertion' && change.newText) {
        segments.push(
          <span
            key={`change-${change.id}`}
            className="relative"
            style={{
              backgroundColor: `${roleColor}15`,
              borderBottom: `2px solid ${roleColor}`,
              color: roleColor
            }}
            title={`Added by ${change.author} (${change.role})`}
          >
            {change.newText}
          </span>
        );
        lastPos = change.startPos;
      } else if (change.type === 'deletion' && change.originalText) {
        segments.push(
          <span
            key={`change-${change.id}`}
            className="relative"
            style={{
              backgroundColor: `${roleColor}15`,
              textDecoration: 'line-through',
              color: roleColor
            }}
            title={`Deleted by ${change.author} (${change.role})`}
          >
            {change.originalText}
          </span>
        );
        lastPos = change.endPos;
      } else if (change.type === 'replacement' && change.originalText && change.newText) {
        segments.push(
          <span key={`change-${change.id}`}>
            <span
              className="relative"
              style={{
                backgroundColor: `${roleColor}15`,
                textDecoration: 'line-through',
                color: roleColor
              }}
              title={`Original text by ${change.author} (${change.role})`}
            >
              {change.originalText}
            </span>
            <span
              className="relative ml-1"
              style={{
                backgroundColor: `${roleColor}15`,
                borderBottom: `2px solid ${roleColor}`,
                color: roleColor
              }}
              title={`Replacement by ${change.author} (${change.role})`}
            >
              {change.newText}
            </span>
          </span>
        );
        lastPos = change.endPos;
      }
    });

    // Add remaining text
    if (lastPos < value.length) {
      segments.push(
        <span key="text-end">
          {value.substring(lastPos)}
        </span>
      );
    }

    return (
      <div className="whitespace-pre-wrap break-words" style={style}>
        {segments}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Overlay for markup visualization */}
      {viewMode !== 'clean' && showChanges && (
        <div
          ref={overlayRef}
          className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
          style={{
            ...style,
            background: 'transparent',
            zIndex: 1
          }}
        >
          {renderMarkup()}
        </div>
      )}

      {/* Actual textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onScroll={handleScroll}
        placeholder={placeholder}
        className={`${className} ${viewMode !== 'clean' && showChanges ? 'text-transparent caret-black' : ''}`}
        style={{
          ...style,
          position: 'relative',
          zIndex: 2,
          background: viewMode !== 'clean' && showChanges ? 'transparent' : 'white'
        }}
      />
    </div>
  );
}