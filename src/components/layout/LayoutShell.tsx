/**
 * Layout Shell Component
 * Enterprise-grade layout structure combining all layout components
 * 
 * The Golden Grid Layout:
 * - Top: Global Header (fixed, 64px)
 * - Left: Navigation Sidebar (fixed width, scrollable)
 * - Center: Main Content Area (flexible, scrollable)
 * - Right: Utility Panel (fixed width, collapsible)
 */

import { ReactNode } from 'react';

interface LayoutShellProps {
  // Header (top, fixed)
  header?: ReactNode;
  
  // Sidebar (left, fixed width)
  sidebar?: ReactNode;
  sidebarWidth?: string;
  
  // Main content (center, flexible)
  children: ReactNode;
  contentMaxWidth?: string; // e.g., 'max-w-7xl', '1200px'
  contentPadding?: string;
  
  // Right panel (optional, collapsible)
  panel?: ReactNode;
  
  // Layout options
  fullWidth?: boolean; // Disable max-width constraint on content
  className?: string;
}

export function LayoutShell({
  header,
  sidebar,
  sidebarWidth = 'w-60',
  children,
  contentMaxWidth = 'max-w-7xl',
  contentPadding = 'p-8',
  panel,
  fullWidth = false,
  className = '',
}: LayoutShellProps) {
  return (
    <div className={`flex flex-col h-screen bg-slate-50 ${className}`}>
      {/* Header (optional) */}
      {header && (
        <div className="flex-shrink-0">
          {header}
        </div>
      )}
      
      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar (optional) */}
        {sidebar && (
          <div className={`${sidebarWidth} flex-shrink-0`}>
            {sidebar}
          </div>
        )}
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {fullWidth ? (
            <div className={contentPadding}>
              {children}
            </div>
          ) : (
            <div className="flex justify-center">
              <div className={`w-full ${contentMaxWidth} ${contentPadding}`}>
                {children}
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Right Panel (optional, rendered separately for overlay behavior) */}
      {panel}
    </div>
  );
}
