/**
 * useGovernance Hook
 * Unified hook for accessing governance state and permissions
 * 
 * Purpose: Single source of truth for role-based access in components
 * Strategy: Integrates Auth context with Project context
 */

import { useAuth } from '../contexts/AuthContext';
import { useProject } from '../contexts/ProjectContext';
import { 
  getUserRole, 
  getUserPermissions, 
  canAccessTab,
  canPerformAction,
  getMaxAIAutonomy,
  getAvailableAIModes,
  getRoleDisplayName,
  getRoleDescription,
  isPI,
  isInstitutionalAdmin,
  getGovernanceMode,
  getTabAccessLevel
} from '../utils/governanceHelper';
import { mapAuthRoleToGovernance, getUnifiedRole } from '../utils/roleMapping';
import type { UserRole, AIAutonomyLevel, TabAccessLevel } from '../types/governance';

/**
 * Governance Hook
 * Returns unified governance state and permission checkers
 */
export function useGovernance() {
  const auth = useAuth();
  const { currentProject } = useProject();
  
  // Get role from multiple sources (priority: project governance > auth role)
  const projectRole = currentProject?.governance?.ownerRole;
  const authRole = auth.user?.role;
  const role: UserRole = getUnifiedRole(authRole, projectRole);
  
  // Get permissions for this role
  const permissions = getUserPermissions(role);
  
  // Get institutional policy if exists
  const institutionalPolicy = currentProject?.governance?.institutionalPolicy;
  
  // Get governance mode
  const governanceMode = getGovernanceMode(currentProject);
  
  return {
    // Current role and mode
    role,
    roleName: getRoleDisplayName(role),
    roleDescription: getRoleDescription(role),
    governanceMode,
    
    // Permissions object
    permissions,
    
    // Quick role checks
    isPI: isPI(role),
    isJunior: role === 'junior',
    isStatistician: role === 'statistician',
    isDataEntry: role === 'data_entry',
    isInstitutionalAdmin: isInstitutionalAdmin(role),
    
    // Tab access
    canAccessTab: (tabName: string, accessLevel?: TabAccessLevel) => 
      canAccessTab(tabName, role, accessLevel),
    getTabAccessLevel: (tabName: string) => 
      getTabAccessLevel(tabName, role),
    
    // Action permissions
    canPerformAction: (action: string) => 
      canPerformAction(action, role),
    
    // AI permissions
    maxAIAutonomy: getMaxAIAutonomy(role, institutionalPolicy),
    availableAIModes: getAvailableAIModes(role, institutionalPolicy),
    canUseAudit: true, // All roles can use audit
    canUseCoPilot: getMaxAIAutonomy(role, institutionalPolicy) !== 'audit',
    canUsePilot: getMaxAIAutonomy(role, institutionalPolicy) === 'pilot',
    
    // Institutional policy
    institutionalPolicy,
    hasInstitutionalPolicy: !!institutionalPolicy,
    
    // Team info
    teamMembers: currentProject?.governance?.teamMembers || [],
    isTeamMode: governanceMode === 'team',
    isInstitutionalMode: governanceMode === 'institutional',
    
    // Specific permission flags (for convenience)
    canCreateProject: permissions.canCreateProject,
    canEditProtocol: permissions.canEditProtocol,
    canEnterData: permissions.canEnterData,
    canRunAnalytics: permissions.canRunAnalytics,
    canDraftManuscript: permissions.canDraftManuscript,
    canLockManifest: permissions.canLockManifest,
    canExportFinal: permissions.canExportFinal,
  };
}

/**
 * Hook for quick permission checks
 * Useful for conditional rendering
 */
export function usePermission(permission: string): boolean {
  const { canPerformAction } = useGovernance();
  return canPerformAction(permission);
}

/**
 * Hook for tab access checks
 */
export function useTabAccess(tabName: string): {
  canAccess: boolean;
  accessLevel: TabAccessLevel;
  isReadOnly: boolean;
  isHidden: boolean;
} {
  const { canAccessTab, getTabAccessLevel } = useGovernance();
  const accessLevel = getTabAccessLevel(tabName);
  
  return {
    canAccess: canAccessTab(tabName),
    accessLevel,
    isReadOnly: accessLevel === 'read',
    isHidden: accessLevel === 'hidden',
  };
}

/**
 * Hook for AI autonomy checks
 */
export function useAIAutonomy(): {
  maxLevel: AIAutonomyLevel;
  availableModes: AIAutonomyLevel[];
  canUseAudit: boolean;
  canUseCoPilot: boolean;
  canUsePilot: boolean;
  isRestricted: boolean;
} {
  const { maxAIAutonomy, availableAIModes } = useGovernance();
  
  return {
    maxLevel: maxAIAutonomy,
    availableModes: availableAIModes,
    canUseAudit: availableAIModes.includes('audit'),
    canUseCoPilot: availableAIModes.includes('co-pilot'),
    canUsePilot: availableAIModes.includes('pilot'),
    isRestricted: maxAIAutonomy !== 'pilot',
  };
}
