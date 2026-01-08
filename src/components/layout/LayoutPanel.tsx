/**
 * Layout Panel Component
 * Reusable right sidebar/panel for assistants, utilities, and secondary content
 * 
 * Features:
 * - Slide in/out animation
 * - Backdrop overlay
 * - Collapsible with toggle
 * - Custom width
 * - Header with title and close button
 */

import { ReactNode } from 'react';
import { X, ChevronRight } from 'lucide-react';

interface LayoutPanelProps {
  // Visibility
  isOpen: boolean;
  onClose?: () => void;
  
  // Content
  title?: string;
  children: ReactNode;
  header?: ReactNode; // Custom header (overrides title)
  footer?: ReactNode;
  
  // Styling
  width?: string; // e.g., 'w-96', 'w-[400px]'
  position?: 'left' | 'right';
  showBackdrop?: boolean;
  className?: string;
}

export function LayoutPanel({
  isOpen,
  onClose,
  title,
  children,
  header,
  footer,
  width = 'w-96',
  position = 'right',
  showBackdrop = true,
  className = '',
}: LayoutPanelProps) {
  
  const positionClasses = position === 'right' 
    ? 'right-0 border-l' 
    : 'left-0 border-r';
    
  const transformClasses = position === 'right'
    ? isOpen ? 'translate-x-0' : 'translate-x-full'
    : isOpen ? 'translate-x-0' : '-translate-x-full';

  return (
    <>
      {/* Panel */}
      <aside
        className={`
          fixed ${positionClasses} top-0 h-screen ${width}
          bg-white border-slate-200
          transform transition-transform duration-300 ease-in-out z-30
          ${transformClasses}
          shadow-xl flex flex-col
          ${className}
        `}
      >
        {/* Header */}
        {(header || title || onClose) && (
          <div className="flex-shrink-0 border-b border-slate-200">
            {header || (
              <div className="flex items-center justify-between px-6 py-4">
                {title && (
                  <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                )}
                {onClose && (
                  <button
                    onClick={onClose}
                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
                    aria-label="Close panel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="flex-shrink-0 border-t border-slate-200">
            {footer}
          </div>
        )}
      </aside>

      {/* Backdrop */}
      {showBackdrop && isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/10 z-20 backdrop-blur-sm cursor-pointer"
          aria-hidden="true"
        />
      )}
    </>
  );
}

/**
 * Collapsible Panel Toggle Button
 * Use this to toggle the panel from within your main content
 */
interface PanelToggleProps {
  isOpen: boolean;
  onClick: () => void;
  position?: 'left' | 'right';
  label?: string;
  className?: string;
}

export function PanelToggle({
  isOpen,
  onClick,
  position = 'right',
  label = 'Toggle Panel',
  className = '',
}: PanelToggleProps) {
  return (
    <button
      onClick={onClick}
      className={`
        p-2 text-slate-600 hover:text-slate-900 transition-colors
        hover:bg-slate-100 rounded-lg
        ${className}
      `}
      aria-label={label}
      title={label}
    >
      <ChevronRight 
        className={`
          w-5 h-5 transition-transform duration-200
          ${isOpen 
            ? position === 'right' ? 'rotate-0' : 'rotate-180'
            : position === 'right' ? 'rotate-180' : 'rotate-0'
          }
        `}
      />
    </button>
  );
}
