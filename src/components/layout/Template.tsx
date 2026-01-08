/**
 * Layout Template - Quick Start
 * Copy this file and customize for your application
 * 
 * Replace all "YOUR_" placeholders with your actual content
 */

import { useState } from 'react';
import { 
  LayoutShell, 
  LayoutHeader, 
  LayoutSidebar, 
  LayoutPanel,
  PanelToggle,
  type Breadcrumb,
  type Badge,
  type HeaderAction,
  type SidebarSection,
} from './index';

// Import your icons from lucide-react
import { 
  Home,
  FileText,
  Settings,
  // Add more icons as needed
} from 'lucide-react';

// Define your tab/page types
type TabType = 'home' | 'projects' | 'settings'; // Add your tabs here

export function YourAppName() {
  // State management
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // ============================================
  // HEADER CONFIGURATION
  // ============================================
  
  const breadcrumbs: Breadcrumb[] = [
    { 
      label: 'YOUR_APP_NAME', 
      onClick: () => setActiveTab('home') 
    },
    { 
      label: getPageTitle(activeTab) // Current page
    },
  ];

  const badges: Badge[] = [
    { 
      label: 'YOUR_PROJECT_NAME',
      variant: 'default',
    },
    // Add more badges as needed
  ];

  const primaryAction: HeaderAction = {
    label: 'Export',
    onClick: handleExport,
    loading: isExporting,
  };

  const secondaryActions: HeaderAction[] = [
    {
      label: 'Save',
      onClick: handleSave,
    },
  ];

  // ============================================
  // SIDEBAR CONFIGURATION
  // ============================================
  
  const sidebarSections: SidebarSection[] = [
    {
      title: 'Main', // Section header (optional)
      items: [
        {
          id: 'home',
          label: 'Home',
          icon: Home,
          onClick: () => setActiveTab('home'),
        },
        {
          id: 'projects',
          label: 'Projects',
          icon: FileText,
          onClick: () => setActiveTab('projects'),
          badge: 5, // Optional notification badge
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          id: 'settings',
          label: 'Settings',
          icon: Settings,
          onClick: () => setActiveTab('settings'),
        },
      ],
    },
  ];

  // ============================================
  // HANDLERS
  // ============================================
  
  function handleExport() {
    setIsExporting(true);
    // Your export logic here
    setTimeout(() => setIsExporting(false), 2000);
  }

  function handleSave() {
    // Your save logic here
    console.log('Saving...');
  }

  function getPageTitle(tab: TabType): string {
    const titles: Record<TabType, string> = {
      home: 'Home',
      projects: 'Projects',
      settings: 'Settings',
    };
    return titles[tab] || 'Page';
  }

  // ============================================
  // RENDER CONTENT BY TAB
  // ============================================
  
  function renderContent() {
    switch (activeTab) {
      case 'home':
        return <YourHomePage />;
      case 'projects':
        return <YourProjectsPage />;
      case 'settings':
        return <YourSettingsPage />;
      default:
        return <div>Page not found</div>;
    }
  }

  // ============================================
  // MAIN RENDER
  // ============================================
  
  return (
    <LayoutShell
      header={
        <LayoutHeader
          breadcrumbs={breadcrumbs}
          badges={badges}
          primaryAction={primaryAction}
          secondaryActions={secondaryActions}
        />
      }
      sidebar={
        <LayoutSidebar
          sections={sidebarSections}
          activeItemId={activeTab}
          onItemClick={(id) => setActiveTab(id as TabType)}
          header={
            <div className="p-4 border-b border-slate-200">
              <h1 className="text-xl font-bold text-slate-900">
                YOUR_APP_NAME
              </h1>
              <p className="text-sm text-slate-500">
                YOUR_TAGLINE
              </p>
            </div>
          }
          footer={
            <div className="p-4 border-t border-slate-200">
              <p className="text-xs text-slate-400">
                Version 1.0.0
              </p>
            </div>
          }
        />
      }
      panel={
        <LayoutPanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          title="YOUR_PANEL_TITLE"
        >
          <div className="p-6">
            {/* Your panel content here */}
            <p className="text-slate-600">
              Panel content goes here
            </p>
          </div>
        </LayoutPanel>
      }
    >
      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {getPageTitle(activeTab)}
            </h1>
            <p className="text-slate-600 mt-1">
              YOUR_PAGE_DESCRIPTION
            </p>
          </div>
          
          {/* Panel Toggle Button */}
          <PanelToggle
            isOpen={isPanelOpen}
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            label="Toggle panel"
          />
        </div>

        {/* Dynamic Content Based on Active Tab */}
        {renderContent()}
      </div>
    </LayoutShell>
  );
}

// ============================================
// PLACEHOLDER COMPONENTS
// Replace these with your actual components
// ============================================

function YourHomePage() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-8">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">
        Welcome to Your App
      </h2>
      <p className="text-slate-600">
        Replace this with your home page content.
      </p>
    </div>
  );
}

function YourProjectsPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-8">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">
        Your Projects
      </h2>
      <p className="text-slate-600">
        Replace this with your projects content.
      </p>
    </div>
  );
}

function YourSettingsPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-8">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">
        Settings
      </h2>
      <p className="text-slate-600">
        Replace this with your settings content.
      </p>
    </div>
  );
}
