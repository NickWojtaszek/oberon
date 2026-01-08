// API Types for User and Authentication endpoints

// User entity
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  institution?: string;
  department?: string;
  credentials?: string; // e.g., "MD, PhD"
  createdAt: number;
  lastLoginAt: number;
  profilePictureUrl?: string;
}

export type UserRole = 
  | 'PI' // Principal Investigator (full access)
  | 'Researcher' // Research team member (can edit manuscripts)
  | 'Biostatistician' // Can access analytics, generate manifests
  | 'Reviewer' // Read-only access, can leave comments
  | 'Admin'; // System administrator

// Authentication
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  institution: string;
  role: UserRole;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

// User profile
export interface UpdateProfileRequest {
  name?: string;
  institution?: string;
  department?: string;
  credentials?: string;
  profilePictureUrl?: string;
}

export interface UpdateProfileResponse {
  user: User;
  message: string;
}

// Password management
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// Permissions
export interface Permission {
  resource: string; // e.g., 'manuscripts', 'verifications', 'analytics'
  action: 'read' | 'write' | 'delete' | 'approve';
}

export interface UserPermissionsResponse {
  permissions: Permission[];
  role: UserRole;
}

// Team management (for PI Dashboard)
export interface TeamMember {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  addedAt: number;
  lastActive: number;
}

export interface InviteTeamMemberRequest {
  email: string;
  role: UserRole;
  projectId?: string; // Optional: invite to specific project
}

export interface InviteTeamMemberResponse {
  invitation: {
    id: string;
    email: string;
    role: UserRole;
    expiresAt: number;
  };
  message: string;
}

export interface TeamMembersResponse {
  members: TeamMember[];
  total: number;
}

export interface RemoveTeamMemberRequest {
  userId: string;
}

export interface RemoveTeamMemberResponse {
  message: string;
}

// Activity log
export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface UserActivityResponse {
  activities: UserActivity[];
  total: number;
}
