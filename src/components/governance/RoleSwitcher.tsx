/**
 * Role Switcher Component
 * Phase 1: Silent Role System
 * 
 * Purpose: Demo/testing component to switch between roles
 * Usage: Only visible when ENABLE_RBAC flag is ON
 */

import { useState } from 'react';
import { Crown, GraduationCap, BarChart3, Database, Building, ChevronDown, Info } from 'lucide-react';
import { FEATURE_FLAGS } from '../../config/featureFlags';
import { useGovernance } from '../../hooks/useGovernance';
import { useProject } from '../../contexts/ProjectContext';
import type { UserRole } from '../../types/governance';
import { ROLE_DISPLAY_NAMES, ROLE_DESCRIPTIONS } from '../../types/governance';

export function RoleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { role, roleName, roleDescription } = useGovernance();
  const { currentProject, updateProject } = useProject();
  
  // Don't render if RBAC disabled
  if (!FEATURE_FLAGS.ENABLE_RBAC) {
    return null;
  }
  
  const roles: UserRole[] = ['pi', 'junior', 'statistician', 'data_entry', 'institutional_admin'];
  
  const getRoleIcon = (roleType: UserRole) => {
    switch (roleType) {
      case 'pi': return Crown;
      case 'junior': return GraduationCap;
      case 'statistician': return BarChart3;
      case 'data_entry': return Database;
      case 'institutional_admin': return Building;
    }
  };
  
  const getRoleColor = (roleType: UserRole) => {
    switch (roleType) {
      case 'pi': return 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200';
      case 'junior': return 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200';
      case 'statistician': return 'text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200';
      case 'data_entry': return 'text-slate-600 bg-slate-50 hover:bg-slate-100 border-slate-200';
      case 'institutional_admin': return 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200';
    }
  };
  
  const handleRoleChange = (newRole: UserRole) => {
    if (!currentProject) return;
    
    // Update project governance using the correct updateProject signature
    updateProject(currentProject.id, {
      governance: {
        mode: 'solo' as const,
        ownerRole: newRole,
        ownerId: 'demo-user',
        ownerName: 'Demo User',
      },
    });
    
    setIsOpen(false);
  };
  
  const CurrentRoleIcon = getRoleIcon(role);
  
  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg border
          transition-all
          ${getRoleColor(role)}
        `}
      >
        <CurrentRoleIcon className="w-5 h-5" />
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium">{roleName}</span>
          <span className="text-xs opacity-70">Click to switch role</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full mt-2 left-0 w-96 bg-white rounded-lg shadow-xl border border-slate-200 z-20">
            <div className="p-3 border-b border-slate-200 bg-slate-50">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-900">
                    Role Switcher (Development Only)
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Switch roles to test permission-based UI. This updates the current project's governance metadata.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              {roles.map((roleType) => {
                const RoleIcon = getRoleIcon(roleType);
                const isActive = role === roleType;
                
                return (
                  <button
                    key={roleType}
                    onClick={() => handleRoleChange(roleType)}
                    className={`
                      w-full flex items-start gap-3 px-3 py-2.5 rounded-md
                      transition-colors text-left
                      ${isActive 
                        ? getRoleColor(roleType) + ' border'
                        : 'hover:bg-slate-50'
                      }
                    `}
                  >
                    <RoleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900">
                          {ROLE_DISPLAY_NAMES[roleType]}
                        </span>
                        {isActive && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {ROLE_DESCRIPTIONS[roleType]}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="p-3 border-t border-slate-200 bg-slate-50">
              <p className="text-xs text-slate-600">
                <strong>Current Role:</strong> {roleName}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {roleDescription}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}