/**
 * Role Mapping Utility
 * Maps between existing Auth roles and new Governance roles
 * 
 * Purpose: Bridge existing RBAC system with new governance architecture
 */

import type { UserRole as AuthUserRole } from '../types/api/user.api';
import type { UserRole as GovernanceUserRole } from '../types/governance';

/**
 * Map Auth role to Governance role
 */
export function mapAuthRoleToGovernance(authRole: AuthUserRole): GovernanceUserRole {
  const mapping: Record<AuthUserRole, GovernanceUserRole> = {
    'PI': 'pi',
    'Researcher': 'junior', // Map researcher to junior for now
    'Biostatistician': 'statistician',
    'Reviewer': 'junior', // Reviewer maps to junior (read-only in many areas)
    'Admin': 'institutional_admin',
  };
  
  return mapping[authRole];
}

/**
 * Map Governance role to Auth role
 */
export function mapGovernanceRoleToAuth(govRole: GovernanceUserRole): AuthUserRole {
  const mapping: Record<GovernanceUserRole, AuthUserRole> = {
    'pi': 'PI',
    'junior': 'Researcher',
    'statistician': 'Biostatistician',
    'data_entry': 'Researcher', // Data entry maps to Researcher
    'institutional_admin': 'Admin',
  };
  
  return mapping[govRole];
}

/**
 * Get unified role from either system
 * Returns governance role format (lowercase)
 */
export function getUnifiedRole(
  authRole?: AuthUserRole,
  govRole?: GovernanceUserRole
): GovernanceUserRole {
  // Prefer governance role if provided
  if (govRole) {
    return govRole;
  }
  
  // Fall back to auth role
  if (authRole) {
    return mapAuthRoleToGovernance(authRole);
  }
  
  // Default to PI (full access) if nothing provided
  return 'pi';
}
