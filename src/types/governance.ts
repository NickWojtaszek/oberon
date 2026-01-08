/**
 * Governance & Institutional Architecture Types
 * Clinical Intelligence Engine - RBAC System
 */

/**
 * User Role Hierarchy
 */
export type UserRole = 'pi' | 'junior' | 'statistician' | 'data_entry' | 'institutional_admin';

/**
 * Governance Mode
 */
export type GovernanceMode = 'solo' | 'team' | 'institutional';

/**
 * License Tier
 */
export type LicenseTier = 'solo' | 'lab' | 'institutional';

/**
 * AI Autonomy Level
 */
export type AIAutonomyLevel = 'audit' | 'co-pilot' | 'pilot';

/**
 * Tab Access Level
 */
export type TabAccessLevel = 'full' | 'read' | 'comment' | 'hidden';

/**
 * Team Member
 */
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: UserPermissions;
  invitedAt: string;
  acceptedAt?: string;
  lastActiveAt?: string;
}

/**
 * User Permissions (Visibility Matrix)
 */
export interface UserPermissions {
  // Tab Access
  canAccessProtocol: TabAccessLevel;
  canAccessDatabase: TabAccessLevel;
  canAccessAnalytics: TabAccessLevel;
  canAccessWriting: TabAccessLevel;
  canAccessLabManagement: TabAccessLevel;
  
  // Action Permissions
  canCreateProject: boolean;
  canEditProtocol: boolean;
  canEnterData: boolean;
  canRunAnalytics: boolean;
  canDraftManuscript: boolean;
  canLockManifest: boolean;
  canExportFinal: boolean;
  
  // AI Permissions
  maxAIAutonomy: AIAutonomyLevel;
  canOverrideAIPolicy: boolean;
}

/**
 * Institutional Policy
 */
export interface InstitutionalPolicy {
  institutionId: string;
  institutionName: string;
  
  // AI Governance
  maxAutonomy: AIAutonomyLevel;
  enforceAuditDisclosure: boolean;
  
  // Manifest Controls
  requireManifestLock: boolean;
  requirePISignature: boolean;
  
  // Feature Controls
  allowCustomJournals: boolean;
  allowTeamCollaboration: boolean;
  
  // Compliance
  adminContact: string;
  policyVersion: string;
  effectiveDate: string;
  auditLogRetention: number; // days
}

/**
 * Manifest Lock Status
 */
export interface ManifestLockStatus {
  isLocked: boolean;
  lockedBy: string;        // User ID
  lockedByName: string;    // Display name
  lockedByRole: UserRole;
  lockedAt: string;        // ISO timestamp
  digitalSignature?: string;
  lockReason?: string;
  canUnlock: boolean;      // Only PI can unlock
}

/**
 * License Information
 */
export interface LicenseInfo {
  tier: LicenseTier;
  issuedTo: string;        // Organization or individual
  expiresAt: string;       // ISO timestamp
  seatCount: number;
  seatsUsed: number;
  features: string[];      // Enabled feature list
}

/**
 * Project Governance Metadata
 */
export interface ProjectGovernance {
  mode: GovernanceMode;
  ownerRole: UserRole;
  ownerId: string;
  ownerName: string;
  
  // Team (if team/institutional mode)
  teamMembers?: TeamMember[];
  
  // Policy (if institutional mode)
  institutionalPolicy?: InstitutionalPolicy;
  
  // License
  licenseInfo?: LicenseInfo;
  
  // Audit Trail
  createdAt: string;
  createdBy: string;
  lastModifiedAt: string;
  lastModifiedBy: string;
}

/**
 * Permission Matrix - Default permissions by role
 */
export const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  pi: {
    // Full access to all tabs
    canAccessProtocol: 'full',
    canAccessDatabase: 'full',
    canAccessAnalytics: 'full',
    canAccessWriting: 'full',
    canAccessLabManagement: 'full',
    
    // All actions permitted
    canCreateProject: true,
    canEditProtocol: true,
    canEnterData: true,
    canRunAnalytics: true,
    canDraftManuscript: true,
    canLockManifest: true,
    canExportFinal: true,
    
    // Full AI access
    maxAIAutonomy: 'pilot',
    canOverrideAIPolicy: true,
  },
  
  junior: {
    // Limited tab access
    canAccessProtocol: 'read',
    canAccessDatabase: 'full',
    canAccessAnalytics: 'read',
    canAccessWriting: 'full',
    canAccessLabManagement: 'hidden',
    
    // Limited actions
    canCreateProject: false,
    canEditProtocol: false,
    canEnterData: true,
    canRunAnalytics: false,
    canDraftManuscript: true,
    canLockManifest: false,
    canExportFinal: false,
    
    // AI hard-locked to audit
    maxAIAutonomy: 'audit',
    canOverrideAIPolicy: false,
  },
  
  statistician: {
    // Analytics-focused access
    canAccessProtocol: 'read',
    canAccessDatabase: 'read',
    canAccessAnalytics: 'full',
    canAccessWriting: 'comment',
    canAccessLabManagement: 'hidden',
    
    // Analytics-specific actions
    canCreateProject: false,
    canEditProtocol: false,
    canEnterData: false,
    canRunAnalytics: true,
    canDraftManuscript: false,
    canLockManifest: false,
    canExportFinal: false,
    
    // AI access for analytics
    maxAIAutonomy: 'co-pilot',
    canOverrideAIPolicy: false,
  },
  
  data_entry: {
    // Data entry only
    canAccessProtocol: 'hidden',
    canAccessDatabase: 'full',
    canAccessAnalytics: 'hidden',
    canAccessWriting: 'hidden',
    canAccessLabManagement: 'hidden',
    
    // Data entry only
    canCreateProject: false,
    canEditProtocol: false,
    canEnterData: true,
    canRunAnalytics: false,
    canDraftManuscript: false,
    canLockManifest: false,
    canExportFinal: false,
    
    // No AI access
    maxAIAutonomy: 'audit',
    canOverrideAIPolicy: false,
  },
  
  institutional_admin: {
    // Admin has read access to everything
    canAccessProtocol: 'read',
    canAccessDatabase: 'read',
    canAccessAnalytics: 'read',
    canAccessWriting: 'read',
    canAccessLabManagement: 'full',
    
    // Admin actions
    canCreateProject: true,
    canEditProtocol: false,
    canEnterData: false,
    canRunAnalytics: false,
    canDraftManuscript: false,
    canLockManifest: false,
    canExportFinal: false,
    
    // No AI for admin
    maxAIAutonomy: 'audit',
    canOverrideAIPolicy: true,
  },
};

/**
 * Role Display Names
 */
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  pi: 'Principal Investigator',
  junior: 'Junior Researcher',
  statistician: 'Statistician',
  data_entry: 'Data Entry Clerk',
  institutional_admin: 'Institutional Admin',
};

/**
 * Role Descriptions
 */
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  pi: 'Ultimate authority. Full access to all features. Can lock manifests and export final manuscripts.',
  junior: 'Primary manuscript builder. Limited to data entry and writing. AI locked to Audit mode.',
  statistician: 'Data analysis specialist. Full analytics access. Can comment on manuscripts.',
  data_entry: 'Database specialist. Limited to data entry tasks only.',
  institutional_admin: 'Organizational oversight. Manages policies and team rosters across labs.',
};
