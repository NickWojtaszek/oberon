/**
 * Governance Helper Functions
 * Clinical Intelligence Engine - RBAC System
 * 
 * Purpose: Backward-compatible helpers for role-based access control
 * Strategy: If governance features disabled OR missing data, default to full access (PI mode)
 */

import { FEATURE_FLAGS } from '../config/featureFlags';
import { DEFAULT_PERMISSIONS, ROLE_DISPLAY_NAMES, ROLE_DESCRIPTIONS } from '../types/governance';
import type { 
  UserRole, 
  UserPermissions, 
  TabAccessLevel, 
  AIAutonomyLevel,
  ProjectGovernance 
} from '../types/governance';
import type { Project } from '../types/shared';

/**
 * Get user role from project
 * Backward-compatible: Returns 'pi' if governance disabled or missing
 */
export function getUserRole(project: Project | null): UserRole {
  // If RBAC disabled, everyone is PI (full access)
  if (!FEATURE_FLAGS.ENABLE_RBAC) {
    return 'pi';
  }
  
  // If no project, default to PI
  if (!project) {
    return 'pi';
  }
  
  // If project has no governance metadata, default to PI (solo mode)
  if (!project.governance) {
    return 'pi';
  }
  
  return project.governance.ownerRole;
}

/**
 * Get user permissions based on role
 * Returns full permissions if RBAC disabled
 */
export function getUserPermissions(role: UserRole): UserPermissions {
  // If RBAC disabled, return PI permissions (full access)
  if (!FEATURE_FLAGS.ENABLE_RBAC) {
    return DEFAULT_PERMISSIONS.pi;
  }
  
  return DEFAULT_PERMISSIONS[role];
}

/**
 * Check if user can access a specific tab
 * Backward-compatible: Returns true if RBAC disabled
 */
export function canAccessTab(
  tabName: string, 
  role: UserRole,
  accessLevel: TabAccessLevel = 'full'
): boolean {
  // If RBAC disabled, all tabs accessible
  if (!FEATURE_FLAGS.ENABLE_RBAC) {
    return true;
  }
  
  const permissions = getUserPermissions(role);
  
  // Map tab names to permission fields
  const tabPermissionMap: Record<string, keyof UserPermissions> = {
    'protocol': 'canAccessProtocol',
    'database': 'canAccessDatabase',
    'analytics': 'canAccessAnalytics',
    'writing': 'canAccessWriting',
    'lab-management': 'canAccessLabManagement',
  };
  
  const permissionKey = tabPermissionMap[tabName.toLowerCase()];
  if (!permissionKey) {
    return true; // Unknown tab, allow access
  }
  
  const userAccess = permissions[permissionKey] as TabAccessLevel;
  
  // Check if user's access level meets required level
  if (userAccess === 'hidden') return false;
  if (accessLevel === 'full' && userAccess !== 'full') return false;
  
  return true;
}

/**
 * Get tab access level for user
 */
export function getTabAccessLevel(tabName: string, role: UserRole): TabAccessLevel {
  if (!FEATURE_FLAGS.ENABLE_RBAC) {
    return 'full';
  }
  
  const permissions = getUserPermissions(role);
  
  const tabPermissionMap: Record<string, keyof UserPermissions> = {
    'protocol': 'canAccessProtocol',
    'database': 'canAccessDatabase',
    'analytics': 'canAccessAnalytics',
    'writing': 'canAccessWriting',
    'lab-management': 'canAccessLabManagement',
  };
  
  const permissionKey = tabPermissionMap[tabName.toLowerCase()];
  if (!permissionKey) {
    return 'full';
  }
  
  return permissions[permissionKey] as TabAccessLevel;
}

/**
 * Check if user can perform a specific action
 * Backward-compatible: Returns true if RBAC disabled
 */
export function canPerformAction(action: string, role: UserRole): boolean {
  // If RBAC disabled, all actions permitted
  if (!FEATURE_FLAGS.ENABLE_RBAC) {
    return true;
  }
  
  const permissions = getUserPermissions(role);
  
  // Map actions to permission fields
  const actionPermissionMap: Record<string, keyof UserPermissions> = {
    'create-project': 'canCreateProject',
    'edit-protocol': 'canEditProtocol',
    'enter-data': 'canEnterData',
    'run-analytics': 'canRunAnalytics',
    'draft-manuscript': 'canDraftManuscript',
    'lock-manifest': 'canLockManifest',
    'export': 'canExportFinal',
    'export-final': 'canExportFinal',
  };
  
  const permissionKey = actionPermissionMap[action.toLowerCase()];
  if (!permissionKey) {
    return true; // Unknown action, allow
  }
  
  return permissions[permissionKey] as boolean;
}

/**
 * Get maximum AI autonomy level for user
 * Considers both role permissions and institutional policy
 */
export function getMaxAIAutonomy(
  role: UserRole, 
  institutionalPolicy?: { maxAutonomy: AIAutonomyLevel }
): AIAutonomyLevel {
  // If AI policy disabled, return full autonomy
  if (!FEATURE_FLAGS.ENABLE_AI_POLICY) {
    return 'pilot';
  }
  
  const permissions = getUserPermissions(role);
  const roleMaxAutonomy = permissions.maxAIAutonomy;
  
  // If no institutional policy, use role default
  if (!institutionalPolicy) {
    return roleMaxAutonomy;
  }
  
  // Return the more restrictive of role and policy
  const autonomyLevels: AIAutonomyLevel[] = ['audit', 'co-pilot', 'pilot'];
  const roleIndex = autonomyLevels.indexOf(roleMaxAutonomy);
  const policyIndex = autonomyLevels.indexOf(institutionalPolicy.maxAutonomy);
  
  return autonomyLevels[Math.min(roleIndex, policyIndex)];
}

/**
 * Get available AI modes for user
 * Returns array of modes user can access
 */
export function getAvailableAIModes(
  role: UserRole,
  institutionalPolicy?: { maxAutonomy: AIAutonomyLevel }
): AIAutonomyLevel[] {
  const maxAutonomy = getMaxAIAutonomy(role, institutionalPolicy);
  
  const allModes: AIAutonomyLevel[] = ['audit', 'co-pilot', 'pilot'];
  const maxIndex = allModes.indexOf(maxAutonomy);
  
  return allModes.slice(0, maxIndex + 1);
}

/**
 * Check if manifest is locked
 */
export function isManifestLocked(manifest: any): boolean {
  if (!FEATURE_FLAGS.ENABLE_MANIFEST_LOCKING) {
    return false;
  }
  
  return manifest?.lockStatus?.isLocked === true;
}

/**
 * Check if user can unlock manifest
 */
export function canUnlockManifest(role: UserRole, manifest: any, userId: string): boolean {
  if (!FEATURE_FLAGS.ENABLE_MANIFEST_LOCKING) {
    return true;
  }
  
  if (!isManifestLocked(manifest)) {
    return true; // Not locked, no need to unlock
  }
  
  // Only PI can unlock
  if (role !== 'pi') {
    return false;
  }
  
  // PI can only unlock if they locked it
  return manifest.lockStatus.lockedBy === userId;
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  return ROLE_DISPLAY_NAMES[role] || role;
}

/**
 * Get role description
 */
export function getRoleDescription(role: UserRole): string {
  return ROLE_DESCRIPTIONS[role] || '';
}

/**
 * Check if user is PI
 */
export function isPI(role: UserRole): boolean {
  return role === 'pi';
}

/**
 * Check if user is institutional admin
 */
export function isInstitutionalAdmin(role: UserRole): boolean {
  return role === 'institutional_admin';
}

/**
 * Get governance mode from project
 */
export function getGovernanceMode(project: Project | null): 'solo' | 'team' | 'institutional' {
  if (!FEATURE_FLAGS.ENABLE_RBAC || !project?.governance) {
    return 'solo';
  }
  
  return project.governance.mode;
}

/**
 * Create default governance metadata for new project
 */
export function createDefaultGovernance(
  ownerName: string,
  ownerId: string = 'default-user'
): ProjectGovernance {
  return {
    mode: 'solo',
    ownerRole: 'pi',
    ownerId,
    ownerName,
    createdAt: new Date().toISOString(),
    createdBy: ownerId,
    lastModifiedAt: new Date().toISOString(),
    lastModifiedBy: ownerId,
  };
}

/**
 * Check if feature flag is enabled
 * Convenience wrapper
 */
export function isGovernanceEnabled(): boolean {
  return FEATURE_FLAGS.ENABLE_RBAC;
}

export function isTeamModeEnabled(): boolean {
  return FEATURE_FLAGS.ENABLE_TEAM_MODE;
}

export function isInstitutionalModeEnabled(): boolean {
  return FEATURE_FLAGS.ENABLE_INSTITUTIONAL;
}

export function isAIPolicyEnabled(): boolean {
  return FEATURE_FLAGS.ENABLE_AI_POLICY;
}

export function isManifestLockingEnabled(): boolean {
  return FEATURE_FLAGS.ENABLE_MANIFEST_LOCKING;
}
