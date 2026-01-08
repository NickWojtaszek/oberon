/**
 * Unified Workspace Shell - The Golden Grid
 * Research Factory - Fixed 3-Pane Layout
 * 
 * Pane A: Navigation (240px fixed)
 * Pane B: Main Stage (1200px max, centered, 40px padding)
 * Pane C: Utility Sidebar (360px fixed, slides from right)
 */

import { ReactNode } from 'react';

interface WorkspaceShellProps {
  // Navigation pane (left)
  navigation: ReactNode;
  
  // Main content (center)
  children: ReactNode;
  
  // Utility sidebar (right, optional)
  utilitySidebar?: ReactNode;
  utilitySidebarOpen?: boolean;
  
  // Full-width mode (Dashboard uses this)
  fullWidth?: boolean;
}

export function WorkspaceShell({
  navigation,
  children,
  utilitySidebar,
  utilitySidebarOpen = false,
  fullWidth = false,
}: WorkspaceShellProps) {
  if (fullWidth) {
    // Dashboard mode - no fixed panes
    return (
      <div className="flex h-screen bg-slate-50">
        {/* Pane A: Navigation */}
        <aside className="w-60 bg-white border-r border-slate-200 flex-shrink-0">
          {navigation}
        </aside>
        
        {/* Full-width content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Pane A: Navigation (240px fixed) */}
      <aside className="w-60 bg-white border-r border-slate-200 flex-shrink-0 overflow-y-auto">
        {navigation}
      </aside>

      {/* Pane B: Main Stage (1200px max, centered) */}
      <main className="flex-1 flex justify-center overflow-hidden">
        <div 
          className="w-full h-full transition-all duration-300"
          style={{
            maxWidth: utilitySidebarOpen ? 'calc(100% - 360px)' : '1200px',
          }}
        >
          <div className="h-full">
            {children}
          </div>
        </div>
      </main>

      {/* Pane C: Utility Sidebar (360px fixed, slides from right) */}
      <aside
        className={`
          fixed right-0 top-0 h-screen w-90 bg-white border-l border-slate-200
          transform transition-transform duration-300 ease-in-out z-30
          ${utilitySidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          shadow-xl
        `}
      >
        {utilitySidebar}
      </aside>

      {/* Backdrop when sidebar is open */}
      {utilitySidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/10 z-20 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}
    </div>
  );
}