/**
 * Governance Dashboard - Professional Dual-Panel Workspace
 * Phase 1: Silent Role System
 * 
 * Purpose: Visual display of current role and permissions
 * Usage: Development/admin tool to see permission matrix
 */

import { useState } from 'react';
import { 
  Check, 
  X, 
  Eye, 
  Lock, 
  Crown, 
  Shield, 
  AlertCircle,
  Settings,
  Users,
  Zap,
  Activity,
  Info,
  BarChart3
} from 'lucide-react';
import { FEATURE_FLAGS } from '../../config/featureFlags';
import { useGovernance } from '../../hooks/useGovernance';
import { RoleSwitcher } from './RoleSwitcher';

type MainView = 'roles' | 'permissions' | 'ai-policy' | 'audit';
type SidebarView = 'current-role' | 'policy-info' | 'activity' | 'guide';

export function GovernanceDashboard() {
  const {
    role,
    roleName,
    roleDescription,
    permissions,
    governanceMode,
    maxAIAutonomy,
    availableAIModes,
    institutionalPolicy,
    hasInstitutionalPolicy,
  } = useGovernance();
  
  const [currentView, setCurrentView] = useState<MainView>('roles');
  const [activeSidebarView, setActiveSidebarView] = useState<SidebarView>('current-role');
  
  // Don't render if RBAC disabled
  if (!FEATURE_FLAGS.ENABLE_RBAC) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="max-w-[1600px] mx-auto p-8">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-slate-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-slate-900">Governance System Disabled</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Enable <code className="px-1.5 py-0.5 bg-slate-200 rounded text-xs">ENABLE_RBAC</code> in 
                  <code className="px-1.5 py-0.5 bg-slate-200 rounded text-xs ml-1">/config/featureFlags.ts</code> to activate the governance system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const getAccessIcon = (level: string) => {
    switch (level) {
      case 'full': return <Check className="w-4 h-4 text-emerald-600" />;
      case 'read': return <Eye className="w-4 h-4 text-blue-600" />;
      case 'comment': return <Eye className="w-4 h-4 text-purple-600" />;
      case 'hidden': return <X className="w-4 h-4 text-slate-400" />;
      default: return <Shield className="w-4 h-4 text-slate-400" />;
    }
  };
  
  const getAccessLabel = (level: string) => {
    switch (level) {
      case 'full': return 'Full Access';
      case 'read': return 'Read Only';
      case 'comment': return 'Comment Only';
      case 'hidden': return 'No Access';
      default: return level;
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Navigation Tabs - Professional Layout */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-3">
          <div className="flex gap-1">
            {/* Main Panel Tabs */}
            <button
              onClick={() => setCurrentView('roles')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'roles'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Users className="w-4 h-4" />
              Roles
            </button>
            <button
              onClick={() => setCurrentView('permissions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'permissions'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Shield className="w-4 h-4" />
              Permissions
            </button>
            <button
              onClick={() => setCurrentView('ai-policy')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'ai-policy'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Zap className="w-4 h-4" />
              AI Policy
            </button>
            <button
              onClick={() => setCurrentView('audit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'audit'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Activity className="w-4 h-4" />
              Audit
            </button>

            {/* Divider */}
            <div className="w-px bg-slate-200 mx-2"></div>

            {/* Sidebar View Tabs */}
            <button
              onClick={() => setActiveSidebarView('current-role')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSidebarView === 'current-role'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Crown className="w-4 h-4" />
              Current Role
            </button>
            <button
              onClick={() => setActiveSidebarView('policy-info')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSidebarView === 'policy-info'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Lock className="w-4 h-4" />
              Policy
            </button>
            <button
              onClick={() => setActiveSidebarView('activity')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSidebarView === 'activity'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Activity
            </button>
            <button
              onClick={() => setActiveSidebarView('guide')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSidebarView === 'guide'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Info className="w-4 h-4" />
              Guide
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Two-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Panel */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1600px] mx-auto">
            {currentView === 'roles' && (
              <div className="space-y-6">
                {/* Role Switcher */}
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <h3 className="font-medium text-slate-900 mb-4">Switch Role</h3>
                  <RoleSwitcher />
                </div>

                {/* Role Information */}
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Crown className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-slate-900 mb-2">{roleName}</h2>
                      <p className="text-sm text-slate-600 mb-4">{roleDescription}</p>
                      
                      <div className="flex items-center gap-4 text-xs">
                        <div>
                          <span className="text-slate-500">Mode:</span>
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium capitalize">
                            {governanceMode}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">Max AI Autonomy:</span>
                          <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium capitalize">
                            {maxAIAutonomy}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'permissions' && (
              <div className="space-y-6">
                {/* Tab Access Permissions */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <h3 className="font-medium text-slate-900">Tab Access Permissions</h3>
                    <p className="text-sm text-slate-600 mt-0.5">What this role can access in each workspace tab</p>
                  </div>
                  
                  <div className="divide-y divide-slate-100">
                    {[
                      { key: 'canAccessProtocol', label: 'Protocol Design', description: 'Study protocol and endpoints' },
                      { key: 'canAccessDatabase', label: 'Database', description: 'Clinical data entry and management' },
                      { key: 'canAccessAnalytics', label: 'Analytics', description: 'Statistical analysis and reports' },
                      { key: 'canAccessWriting', label: 'Academic Writing', description: 'Manuscript drafting and editing' },
                      { key: 'canAccessLabManagement', label: 'Lab Management', description: 'Team and project administration' },
                    ].map((tab) => {
                      const accessLevel = permissions[tab.key as keyof typeof permissions] as string;
                      return (
                        <div key={tab.key} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">{tab.label}</div>
                            <div className="text-sm text-slate-600">{tab.description}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getAccessIcon(accessLevel)}
                            <span className="text-sm font-medium text-slate-700 min-w-[100px]">
                              {getAccessLabel(accessLevel)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Action Permissions */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <h3 className="font-medium text-slate-900">Action Permissions</h3>
                    <p className="text-sm text-slate-600 mt-0.5">Specific actions this role can perform</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-px bg-slate-100">
                    {[
                      { key: 'canCreateProject', label: 'Create New Project' },
                      { key: 'canEditProtocol', label: 'Edit Protocol' },
                      { key: 'canEnterData', label: 'Enter Clinical Data' },
                      { key: 'canRunAnalytics', label: 'Run Statistical Analysis' },
                      { key: 'canDraftManuscript', label: 'Draft Manuscript' },
                      { key: 'canLockManifest', label: 'Lock Statistical Manifest' },
                      { key: 'canExportFinal', label: 'Export Final Package' },
                      { key: 'canOverrideAIPolicy', label: 'Override AI Policy' },
                    ].map((action) => {
                      const allowed = permissions[action.key as keyof typeof permissions] as boolean;
                      return (
                        <div key={action.key} className="bg-white px-6 py-4 flex items-center justify-between">
                          <span className="text-sm text-slate-700">{action.label}</span>
                          {allowed ? (
                            <Check className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <X className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {currentView === 'ai-policy' && (
              <div className="space-y-6">
                {/* AI Autonomy Permissions */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <h3 className="font-medium text-slate-900">AI Autonomy Permissions</h3>
                    <p className="text-sm text-slate-600 mt-0.5">Available AI modes for this role</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      {['audit', 'co-pilot', 'pilot'].map((mode) => {
                        const isAvailable = availableAIModes.includes(mode as any);
                        return (
                          <div
                            key={mode}
                            className={`
                              flex-1 px-4 py-3 rounded-lg border-2 text-center
                              ${isAvailable 
                                ? 'border-emerald-200 bg-emerald-50' 
                                : 'border-slate-200 bg-slate-50 opacity-50'
                              }
                            `}
                          >
                            <div className="flex items-center justify-center gap-2">
                              {isAvailable ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Lock className="w-4 h-4 text-slate-400" />
                              )}
                              <span className={`text-sm font-medium capitalize ${isAvailable ? 'text-emerald-900' : 'text-slate-500'}`}>
                                {mode}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <p className="text-xs text-indigo-900">
                        <strong>Maximum Level:</strong> {maxAIAutonomy}
                        {hasInstitutionalPolicy && (
                          <span className="ml-2 text-indigo-700">
                            (Restricted by institutional policy)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Mode Details */}
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <h3 className="font-medium text-slate-900 mb-4">AI Mode Details</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-slate-600" />
                        <span className="text-sm font-medium text-slate-900">Audit Mode</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        AI suggests but cannot execute. All actions require human approval.
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Co-Pilot Mode</span>
                      </div>
                      <p className="text-xs text-blue-700">
                        AI can execute approved actions with human oversight and review.
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">Pilot Mode</span>
                      </div>
                      <p className="text-xs text-purple-700">
                        AI operates with maximum autonomy within defined parameters.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'audit' && (
              <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
                <Activity className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <h3 className="text-slate-900 mb-2">Governance Audit Log</h3>
                <p className="text-sm text-slate-600">
                  Track permission changes, role switches, and policy updates
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Info Panel */}
        <div className="w-[400px] border-l border-slate-200 bg-white overflow-y-auto">
          <div className="p-6 space-y-6">
            {activeSidebarView === 'current-role' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-slate-900">Active Role</h3>
                </div>
                
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 mb-4">
                  <div className="text-lg font-medium text-indigo-900 mb-1">{roleName}</div>
                  <div className="text-xs text-indigo-700">{roleDescription}</div>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="text-xs text-slate-600 mb-1">Governance Mode</div>
                    <div className="text-sm font-medium text-slate-900 capitalize">{governanceMode}</div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="text-xs text-slate-600 mb-1">Max AI Autonomy</div>
                    <div className="text-sm font-medium text-slate-900 capitalize">{maxAIAutonomy}</div>
                  </div>
                </div>

                {hasInstitutionalPolicy && (
                  <div className="mt-4 bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-900">Institutional Policy</span>
                    </div>
                    <p className="text-xs text-amber-700">
                      {institutionalPolicy?.institutionName}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeSidebarView === 'policy-info' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-slate-900">Policy Information</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                    <h4 className="text-sm font-medium text-indigo-900 mb-2">RBAC System</h4>
                    <p className="text-xs text-indigo-700">
                      Role-Based Access Control ensures appropriate permissions based on user responsibilities.
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="text-sm font-medium text-purple-900 mb-2">AI Governance</h4>
                    <p className="text-xs text-purple-700">
                      AI autonomy levels are restricted based on role to ensure safe and responsible AI usage.
                    </p>
                  </div>

                  {hasInstitutionalPolicy && (
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                      <h4 className="text-sm font-medium text-amber-900 mb-2">Institutional Restrictions</h4>
                      <p className="text-xs text-amber-700">
                        Additional policies enforced by {institutionalPolicy?.institutionName}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSidebarView === 'activity' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-slate-900">Recent Activity</h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="text-xs text-slate-600 mb-1">Permission Checks</div>
                    <div className="text-lg font-medium text-slate-900">247</div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="text-xs text-slate-600 mb-1">Role Switches</div>
                    <div className="text-lg font-medium text-slate-900">3</div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="text-xs text-slate-600 mb-1">Policy Enforcements</div>
                    <div className="text-lg font-medium text-slate-900">12</div>
                  </div>
                </div>
              </div>
            )}

            {activeSidebarView === 'guide' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-slate-900">Governance Guide</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                    <h4 className="text-sm font-medium text-indigo-900 mb-2">Understanding Roles</h4>
                    <p className="text-xs text-indigo-700">
                      Each role has specific permissions tailored to job responsibilities. PI has full access, while students have restricted permissions requiring supervisor approval.
                    </p>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <h4 className="text-sm font-medium text-emerald-900 mb-2">Permission Levels</h4>
                    <ul className="text-xs text-emerald-700 space-y-1">
                      <li>• Full Access - Complete control</li>
                      <li>• Read Only - View but not modify</li>
                      <li>• Comment - Read and comment</li>
                      <li>• No Access - Hidden</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="text-sm font-medium text-purple-900 mb-2">AI Modes</h4>
                    <p className="text-xs text-purple-700">
                      AI autonomy is restricted by role. Junior researchers are limited to Audit mode for safety.
                    </p>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <h4 className="text-sm font-medium text-amber-900 mb-2">Feature Flags</h4>
                    <p className="text-xs text-amber-700">
                      Feature flags control which governance features are active. Check the Audit tab for current configuration.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}