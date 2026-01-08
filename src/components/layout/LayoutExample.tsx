/**
 * Layout Example Component
 * Demonstrates how to use the reusable layout system
 * 
 * This is a complete working example showing:
 * - Header with breadcrumbs, badges, and actions
 * - Left sidebar with navigation items
 * - Main content area
 * - Right collapsible panel
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
import { 
  Home, 
  Settings, 
  Users, 
  FileText, 
  BarChart3, 
  Download,
  Save,
  Building,
  Sparkles,
} from 'lucide-react';

export function LayoutExample() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Header configuration
  const breadcrumbs: Breadcrumb[] = [
    { label: 'Home', onClick: () => console.log('Navigate to home') },
    { label: 'Projects', onClick: () => console.log('Navigate to projects') },
    { label: 'Current Project' },
  ];

  const badges: Badge[] = [
    { 
      icon: Building, 
      label: 'STUDY-2024-001',
      variant: 'default',
    },
    { 
      icon: Sparkles, 
      label: 'RCT Study',
      variant: 'primary',
    },
  ];

  const primaryAction: HeaderAction = {
    label: 'Export Package',
    icon: Download,
    onClick: () => alert('Export clicked!'),
    loading: false,
  };

  const secondaryActions: HeaderAction[] = [
    {
      label: 'Save Draft',
      icon: Save,
      onClick: () => alert('Save clicked!'),
    },
  ];

  // Sidebar configuration
  const sidebarSections: SidebarSection[] = [
    {
      title: 'Main',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: Home,
          onClick: () => setActiveTab('dashboard'),
        },
        {
          id: 'projects',
          label: 'Projects',
          icon: FileText,
          onClick: () => setActiveTab('projects'),
          badge: 12,
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: BarChart3,
          onClick: () => setActiveTab('analytics'),
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          id: 'team',
          label: 'Team',
          icon: Users,
          onClick: () => setActiveTab('team'),
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: Settings,
          onClick: () => setActiveTab('settings'),
        },
      ],
    },
  ];

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
          onItemClick={setActiveTab}
          header={
            <div className="p-4">
              <h1 className="text-xl font-bold text-slate-900">App Name</h1>
              <p className="text-sm text-slate-500">Clinical Research Platform</p>
            </div>
          }
          footer={
            <div className="p-4">
              <p className="text-xs text-slate-400">Version 2.0.1</p>
            </div>
          }
        />
      }
      panel={
        <LayoutPanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          title="AI Assistant"
        >
          <div className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">AI Recommendations</h3>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  Consider adding more descriptive statistics to your analysis.
                </p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-900">
                  Your sample size calculation looks good for 80% power.
                </p>
              </div>
            </div>
          </div>
        </LayoutPanel>
      }
    >
      {/* Main Content */}
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-slate-600 mt-1">
              Welcome to your clinical research workspace
            </p>
          </div>
          
          <PanelToggle
            isOpen={isPanelOpen}
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            label="Toggle AI Assistant"
          />
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-slate-900 mb-2">
                Card Title {i}
              </h3>
              <p className="text-sm text-slate-600">
                This is a sample content card showing how the layout system works.
                The content area is scrollable and responsive.
              </p>
              <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                Learn more →
              </button>
            </div>
          ))}
        </div>

        {/* Sample Content */}
        <div className="bg-white border border-slate-200 rounded-lg p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Main Content Area
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            This is the main content area where your application content goes.
            It's centered with a maximum width for optimal readability and scrolls
            independently from the header and sidebar.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The layout is fully responsive and adapts to different screen sizes.
            On mobile devices, the sidebar can collapse and the panel slides in
            from the right with a backdrop overlay.
          </p>
        </div>
      </div>
    </LayoutShell>
  );
}
