/**
 * Navigation Panel (Pane A)
 * Research Factory - Global Menu (240px fixed)
 */

import { 
  LayoutDashboard, 
  FlaskConical, 
  FolderOpen,
  Folder,
  FileText, 
  User, 
  BarChart3, 
  Database, 
  Upload,
  Shield,
  Settings,
  Lock,
  Users,
  Brain,
  BookOpen,
  Lightbulb,
  Crown,
  GraduationCap,
  Building,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FEATURE_FLAGS } from '../../config/featureFlags';
import { useGovernance } from '../../hooks/useGovernance';

export type NavigationTab = 
  | 'dashboard'
  | 'project-library'
  | 'protocol-library'
  | 'ai-personas'
  | 'persona-editor'
  | 'protocol-workbench'
  | 'research-wizard'
  | 'project-setup'
  | 'methodology-engine'
  | 'database'
  | 'analytics'
  | 'data-management'
  | 'data-import-export' // Add this for consistency with ResearchFactoryApp
  | 'governance'
  | 'ethics'
  | 'academic-writing'; // Keep for backwards compatibility

interface NavigationPanelProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  projectName?: string;
}

const NAV_ITEMS: Array<{
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Progress overview',
  },
  {
    id: 'project-library',
    label: 'Project Library',
    icon: Folder,
    description: 'Browse projects',
  },
  {
    id: 'research-wizard',
    label: 'Research Wizard',
    icon: Lightbulb,
    description: 'Guided research setup',
  },
  {
    id: 'protocol-workbench',
    label: 'Protocol Workbench',
    icon: FlaskConical,
    description: 'Build schemas',
  },
  {
    id: 'protocol-library',
    label: 'Protocol Library',
    icon: FolderOpen,
    description: 'Browse protocols',
  },
  {
    id: 'ai-personas',
    label: 'AI Personas',
    icon: Brain,
    description: 'The Oberon Faculty',
  },
  // Persona Editor hidden - functionality merged into AI Personas (FairyCourtPersonas)
  // {
  //   id: 'persona-editor',
  //   label: 'Persona Editor',
  //   icon: User,
  //   description: 'Create & edit personas',
  // },
  {
    id: 'project-setup',
    label: 'Project Setup',
    icon: Users,
    description: 'Team & methodology',
  },
  {
    id: 'methodology-engine',
    label: 'Methodology Engine',
    icon: BookOpen,
    description: 'Automated methodology generation',
  },
  {
    id: 'database',
    label: 'Database',
    icon: Database,
    description: 'Schema & records',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    description: 'Statistical analysis',
  },
  {
    id: 'academic-writing',
    label: 'Academic Writing',
    icon: BookOpen,
    description: 'Manuscript editor',
  },
  {
    id: 'data-import-export',
    label: 'Data Management',
    icon: Upload,
    description: 'Import/Export',
  },
  {
    id: 'governance',
    label: 'Governance',
    icon: Lock,
    description: 'Access control',
  },
  {
    id: 'ethics',
    label: 'Ethics & IRB',
    icon: Shield,
    description: 'IRB & Compliance',
  },
];

export function NavigationPanel({ 
  activeTab, 
  onTabChange,
  projectName 
}: NavigationPanelProps) {
  const { t } = useTranslation('navigation');
  const { t: tGovernance } = useTranslation('governance');
  
  // Get governance state (Phase 2: Permission enforcement)
  const governance = FEATURE_FLAGS.ENABLE_RBAC ? useGovernance() : null;
  
  // Helper function to get translated label for navigation item
  const getNavLabel = (id: NavigationTab): string => {
    const labelMap: Record<NavigationTab, string> = {
      'dashboard': t('navigation.dashboard'),
      'project-library': t('navigation.projectLibrary'),
      'protocol-library': t('navigation.protocolLibrary'),
      'ai-personas': t('navigation.aiPersonas'),
      'persona-editor': t('navigation.personaEditor'),
      'protocol-workbench': t('navigation.protocolWorkbench'),
      'research-wizard': t('navigation.researchWizard'),
      'project-setup': t('navigation.projectSetup'),
      'methodology-engine': t('navigation.methodologyEngine'),
      'database': t('navigation.database'),
      'analytics': t('navigation.analytics'),
      'academic-writing': t('navigation.academicWriting'),
      'data-management': t('navigation.dataManagement'),
      'data-import-export': t('navigation.dataManagement'),
      'governance': t('navigation.governance'),
      'ethics': t('navigation.ethics'),
    };
    return labelMap[id] || id;
  };
  
  // Helper function to get translated description for navigation item
  const getNavDescription = (id: NavigationTab): string => {
    const descMap: Record<NavigationTab, string> = {
      'dashboard': t('navigation.descriptions.dashboard'),
      'project-library': t('navigation.descriptions.projectLibrary'),
      'protocol-library': t('navigation.descriptions.protocolLibrary'),
      'ai-personas': t('navigation.descriptions.aiPersonas'),
      'persona-editor': t('navigation.descriptions.personaEditor'),
      'protocol-workbench': t('navigation.descriptions.protocolWorkbench'),
      'research-wizard': t('navigation.descriptions.researchWizard'),
      'project-setup': t('navigation.descriptions.projectSetup'),
      'methodology-engine': t('navigation.descriptions.methodologyEngine'),
      'database': t('navigation.descriptions.database'),
      'analytics': t('navigation.descriptions.analytics'),
      'academic-writing': t('navigation.descriptions.academicWriting'),
      'data-management': t('navigation.descriptions.dataManagement'),
      'data-import-export': t('navigation.descriptions.dataManagement'),
      'governance': t('navigation.descriptions.governance'),
      'ethics': t('navigation.descriptions.ethics'),
    };
    return descMap[id] || '';
  };
  
  // Map navigation tabs to permission keys
  const getTabPermissionKey = (tabId: NavigationTab): string | null => {
    switch (tabId) {
      case 'protocol-workbench':
      case 'protocol-library':
        return 'protocol';
      case 'database':
      case 'data-management':
      case 'data-import-export':
        return 'database';
      case 'analytics':
        return 'analytics';
      case 'academic-writing':
        return 'writing';
      case 'persona-editor':
      case 'ai-personas':
        return 'lab-management';
      case 'research-wizard':
      case 'dashboard':
      case 'project-library':
      case 'governance':
        return null; // Always accessible
      default:
        return null;
    }
  };
  
  // Filter navigation items based on feature flags and permissions
  const visibleNavItems = NAV_ITEMS.filter(item => {
    // Hide methodology-engine (consolidated into project-setup)
    if (item.id === 'methodology-engine') {
      return false;
    }
    
    // Hide governance tab if RBAC is disabled
    if (item.id === 'governance' && !FEATURE_FLAGS.ENABLE_RBAC) {
      return false;
    }
    
    // If RBAC enabled, check permissions (Phase 2)
    if (FEATURE_FLAGS.ENABLE_RBAC && governance) {
      const permissionKey = getTabPermissionKey(item.id);
      if (permissionKey) {
        const canAccess = governance.canAccessTab(permissionKey);
        return canAccess; // Hide if no access
      }
    }
    
    return true;
  });
  
  // Check if tab is read-only
  const getTabAccessInfo = (tabId: NavigationTab) => {
    if (!FEATURE_FLAGS.ENABLE_RBAC || !governance) {
      return { isReadOnly: false, accessLevel: 'full' };
    }
    
    const permissionKey = getTabPermissionKey(tabId);
    if (!permissionKey) {
      return { isReadOnly: false, accessLevel: 'full' };
    }
    
    const accessLevel = governance.getTabAccessLevel(permissionKey);
    return {
      isReadOnly: accessLevel === 'read' || accessLevel === 'comment',
      accessLevel,
    };
  };
  
  return (
    <nav className="h-full flex flex-col">
      {/* Project Header */}
      <div className="h-16 px-6 border-b border-slate-700 flex items-center bg-slate-900">
        <div className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-slate-400">{t('navigation.currentProject')}</div>
            <div className="font-medium text-white truncate">
              {projectName || t('navigation.noProject')}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto p-3 bg-slate-900">
        <div className="space-y-1">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const { isReadOnly, accessLevel } = getTabAccessInfo(item.id);
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`
                  w-full flex items-start gap-3 p-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-200 hover:bg-slate-800'}
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <div className="text-left min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white'}`}>
                      {getNavLabel(item.id)}
                    </div>
                    {isReadOnly && (
                      <Lock className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {isReadOnly && accessLevel === 'read' ? tGovernance('accessLevels.readOnly') : 
                     isReadOnly && accessLevel === 'comment' ? tGovernance('accessLevels.commentOnly') :
                     getNavDescription(item.id)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer - Settings */}
      <div className="p-3 border-t border-slate-700 bg-slate-900 space-y-2">
        {/* Role Badge */}
        {FEATURE_FLAGS.ENABLE_RBAC && governance && (
          <div className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-700">
            {(() => {
              const getRoleIcon = (role: string) => {
                switch (role) {
                  case 'pi': return Crown;
                  case 'junior': return GraduationCap;
                  case 'statistician': return BarChart3;
                  case 'data_entry': return Database;
                  case 'institutional_admin': return Building;
                  default: return Shield;
                }
              };
              
              const RoleIcon = getRoleIcon(governance.role);
              return <RoleIcon className="w-5 h-5 text-slate-300" />;
            })()}
            <span className="text-sm font-medium text-white">
              {governance.roleName}
            </span>
          </div>
        )}
        
        {/* 🤖 AI Persona Quick Access Button - Navigates to AI Personas page */}
        <button
          onClick={() => onTabChange('ai-personas')}
          className="w-full flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all text-white"
        >
          <Sparkles className="w-5 h-5" />
          <div className="text-left flex-1">
            <div className="text-sm font-medium">The Oberon Faculty</div>
            <div className="text-xs opacity-90">AI Personas</div>
          </div>
          <Settings className="w-4 h-4 opacity-70" />
        </button>
      </div>
    </nav>
  );
}