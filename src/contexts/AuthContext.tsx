// Auth Context - Global authentication state

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../lib/auth';
import type { User } from '../types/api/user.api';
import * as rbac from '../lib/rbac';

interface AuthContextValue {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Auth actions
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  updateUser: (user: User) => void;

  // Permission helpers
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;

  // Role checks
  isPI: boolean;
  isBiostatistician: boolean;
  isReviewer: boolean;
  isAdmin: boolean;

  // Feature permissions
  canViewPIDashboard: boolean;
  canApproveVerifications: boolean;
  canEditManuscripts: boolean;
  canDeleteManuscripts: boolean;
  canPublishProtocols: boolean;
  canManageTeam: boolean;
  canExportAnalytics: boolean;
  canCreateManifest: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  // Listen for logout events
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const loggedInUser = await authService.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    authService.updateCurrentUser(updatedUser);
    setUser(updatedUser);
  };

  // Permission helpers
  const hasPermission = (permission: string) => rbac.hasPermission(user, permission);
  const hasAnyPermission = (permissions: string[]) => rbac.hasAnyPermission(user, permissions);
  const hasAllPermissions = (permissions: string[]) => rbac.hasAllPermissions(user, permissions);

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
    updateUser,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isPI: rbac.isPI(user),
    isBiostatistician: rbac.isBiostatistician(user),
    isReviewer: rbac.isReviewer(user),
    isAdmin: rbac.isAdmin(user),
    canViewPIDashboard: rbac.canViewPIDashboard(user),
    canApproveVerifications: rbac.canApproveVerifications(user),
    canEditManuscripts: rbac.canEditManuscripts(user),
    canDeleteManuscripts: rbac.canDeleteManuscripts(user),
    canPublishProtocols: rbac.canPublishProtocols(user),
    canManageTeam: rbac.canManageTeam(user),
    canExportAnalytics: rbac.canExportAnalytics(user),
    canCreateManifest: rbac.canCreateManifest(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for permission-based rendering
export function usePermission(permission: string) {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}

// Hook for role-based rendering
export function useRole() {
  const { user, isPI, isBiostatistician, isReviewer, isAdmin } = useAuth();
  return {
    role: user?.role,
    isPI,
    isBiostatistician,
    isReviewer,
    isAdmin,
  };
}
