// Role-Based Access Control (RBAC) - Permission utilities

import type { User, UserRole, Permission } from '../types/api/user.api';

// Define permissions for each role
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  PI: [
    // Full access
    'manuscripts:read',
    'manuscripts:write',
    'manuscripts:delete',
    'manuscripts:approve',
    'verifications:read',
    'verifications:write',
    'verifications:approve',
    'analytics:read',
    'analytics:export',
    'team:manage',
    'dashboard:view-pi',
    'protocols:read',
    'protocols:write',
    'protocols:publish',
  ],
  Researcher: [
    // Can edit manuscripts and view analytics
    'manuscripts:read',
    'manuscripts:write',
    'verifications:read',
    'verifications:write',
    'analytics:read',
    'protocols:read',
    'protocols:write',
  ],
  Biostatistician: [
    // Can create manifests and view analytics
    'manuscripts:read',
    'verifications:read',
    'analytics:read',
    'analytics:export',
    'analytics:create-manifest',
    'protocols:read',
  ],
  Reviewer: [
    // Read-only access with commenting
    'manuscripts:read',
    'manuscripts:comment',
    'verifications:read',
    'analytics:read',
    'protocols:read',
  ],
  Admin: [
    // System administration
    'manuscripts:read',
    'manuscripts:write',
    'manuscripts:delete',
    'verifications:read',
    'analytics:read',
    'analytics:export',
    'team:manage',
    'system:admin',
    'protocols:read',
    'protocols:write',
    'protocols:delete',
  ],
};

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false;

  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  return rolePermissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(user: User | null, permissions: string[]): boolean {
  if (!user) return false;

  return permissions.some(permission => hasPermission(user, permission));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(user: User | null, permissions: string[]): boolean {
  if (!user) return false;

  return permissions.every(permission => hasPermission(user, permission));
}

/**
 * Get all permissions for a user's role
 */
export function getUserPermissions(user: User | null): string[] {
  if (!user) return [];
  return ROLE_PERMISSIONS[user.role] || [];
}

/**
 * Check if user can view PI Dashboard
 */
export function canViewPIDashboard(user: User | null): boolean {
  return hasPermission(user, 'dashboard:view-pi');
}

/**
 * Check if user can approve verifications
 */
export function canApproveVerifications(user: User | null): boolean {
  return hasPermission(user, 'verifications:approve');
}

/**
 * Check if user can edit manuscripts
 */
export function canEditManuscripts(user: User | null): boolean {
  return hasPermission(user, 'manuscripts:write');
}

/**
 * Check if user can delete manuscripts
 */
export function canDeleteManuscripts(user: User | null): boolean {
  return hasPermission(user, 'manuscripts:delete');
}

/**
 * Check if user can publish protocols
 */
export function canPublishProtocols(user: User | null): boolean {
  return hasPermission(user, 'protocols:publish');
}

/**
 * Check if user can manage team members
 */
export function canManageTeam(user: User | null): boolean {
  return hasPermission(user, 'team:manage');
}

/**
 * Check if user can export analytics
 */
export function canExportAnalytics(user: User | null): boolean {
  return hasPermission(user, 'analytics:export');
}

/**
 * Check if user can create statistical manifests
 */
export function canCreateManifest(user: User | null): boolean {
  return hasPermission(user, 'analytics:create-manifest');
}

/**
 * Check if user is PI
 */
export function isPI(user: User | null): boolean {
  return user?.role === 'PI';
}

/**
 * Check if user is Biostatistician
 */
export function isBiostatistician(user: User | null): boolean {
  return user?.role === 'Biostatistician';
}

/**
 * Check if user is Reviewer (read-only)
 */
export function isReviewer(user: User | null): boolean {
  return user?.role === 'Reviewer';
}

/**
 * Check if user is Admin
 */
export function isAdmin(user: User | null): boolean {
  return user?.role === 'Admin';
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    PI: 'Principal Investigator',
    Researcher: 'Research Team Member',
    Biostatistician: 'Biostatistician',
    Reviewer: 'Reviewer',
    Admin: 'Administrator',
  };

  return displayNames[role] || role;
}

/**
 * Get role description
 */
export function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    PI: 'Full access to all features including approvals and team management',
    Researcher: 'Can create and edit manuscripts, view analytics',
    Biostatistician: 'Can create statistical manifests and export data',
    Reviewer: 'Read-only access with commenting capabilities',
    Admin: 'System administration and user management',
  };

  return descriptions[role] || '';
}

/**
 * Get available roles for user assignment
 */
export function getAvailableRoles(): UserRole[] {
  return ['PI', 'Researcher', 'Biostatistician', 'Reviewer', 'Admin'];
}

/**
 * Validate role assignment (PI can assign all roles except Admin)
 */
export function canAssignRole(currentUser: User | null, targetRole: UserRole): boolean {
  if (!currentUser) return false;

  if (isAdmin(currentUser)) {
    return true; // Admin can assign any role
  }

  if (isPI(currentUser)) {
    return targetRole !== 'Admin'; // PI can assign all except Admin
  }

  return false; // Others cannot assign roles
}
