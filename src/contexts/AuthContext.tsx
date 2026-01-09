// Auth Context - Global authentication state
// Supports both Supabase auth (when configured) and legacy localStorage auth

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { authService } from '../lib/auth';
import { supabaseAuthService } from '../lib/supabaseAuth';
import { isSupabaseReady } from '../lib/supabase';
import type { User } from '../types/api/user.api';
import * as rbac from '../lib/rbac';

// Auth mode: 'supabase' when Supabase is configured, 'legacy' otherwise
type AuthMode = 'supabase' | 'legacy';

interface AuthContextValue {
  // User state
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authMode: AuthMode;

  // Auth actions
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  updateUser: (user: User) => void;

  // Supabase-specific actions (only available when authMode === 'supabase')
  signInWithMagicLink?: (email: string) => Promise<{ error: Error | null }>;
  signInWithOAuth?: (provider: 'google' | 'github' | 'azure') => Promise<{ error: Error | null }>;
  resetPassword?: (email: string) => Promise<{ error: Error | null }>;

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

// Convert Supabase user to app User type
function supabaseUserToAppUser(supabaseUser: any): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
    role: (supabaseUser.user_metadata?.role as User['role']) || 'PI',
    institution: supabaseUser.user_metadata?.institution,
    createdAt: new Date(supabaseUser.created_at).getTime(),
    lastLoginAt: Date.now(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>('legacy');

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      if (isSupabaseReady()) {
        // Use Supabase auth
        setAuthMode('supabase');

        try {
          const currentSession = await supabaseAuthService.getSession();
          if (currentSession) {
            setSession(currentSession);
            setUser(supabaseUserToAppUser(currentSession.user));
          }
        } catch (error) {
          console.error('Supabase auth init failed:', error);
        }

        // Subscribe to auth state changes
        const { unsubscribe } = supabaseAuthService.onAuthStateChange((event, newSession) => {
          setSession(newSession);
          setUser(newSession?.user ? supabaseUserToAppUser(newSession.user) : null);
        });

        setIsLoading(false);
        return () => unsubscribe();
      } else {
        // Use legacy auth
        setAuthMode('legacy');
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Listen for logout events (legacy)
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setSession(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    setIsLoading(true);

    try {
      if (authMode === 'supabase') {
        const result = await supabaseAuthService.signIn({ email, password });
        if (result.error) {
          setIsLoading(false);
          throw result.error;
        }
        if (result.user) {
          const appUser = supabaseUserToAppUser(result.user);
          setUser(appUser);
          setIsLoading(false);
          return appUser;
        }
        throw new Error('Login failed');
      } else {
        const loggedInUser = await authService.login(email, password);
        setUser(loggedInUser);
        setIsLoading(false);
        return loggedInUser;
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, [authMode]);

  const logout = useCallback(async () => {
    if (authMode === 'supabase') {
      await supabaseAuthService.signOut();
    } else {
      authService.logout();
    }
    setUser(null);
    setSession(null);
  }, [authMode]);

  const updateUser = useCallback((updatedUser: User) => {
    if (authMode === 'legacy') {
      authService.updateCurrentUser(updatedUser);
    }
    setUser(updatedUser);
  }, [authMode]);

  // Supabase-specific methods
  const signInWithMagicLink = useCallback(async (email: string) => {
    if (authMode !== 'supabase') {
      return { error: new Error('Magic link only available with Supabase') };
    }
    return supabaseAuthService.signInWithMagicLink(email);
  }, [authMode]);

  const signInWithOAuth = useCallback(async (provider: 'google' | 'github' | 'azure') => {
    if (authMode !== 'supabase') {
      return { error: new Error('OAuth only available with Supabase') };
    }
    return supabaseAuthService.signInWithOAuth(provider);
  }, [authMode]);

  const resetPassword = useCallback(async (email: string) => {
    if (authMode !== 'supabase') {
      return { error: new Error('Password reset only available with Supabase') };
    }
    return supabaseAuthService.resetPassword(email);
  }, [authMode]);

  // Permission helpers
  const hasPermission = (permission: string) => rbac.hasPermission(user, permission);
  const hasAnyPermission = (permissions: string[]) => rbac.hasAnyPermission(user, permissions);
  const hasAllPermissions = (permissions: string[]) => rbac.hasAllPermissions(user, permissions);

  const value: AuthContextValue = {
    user,
    session,
    isAuthenticated: user !== null,
    isLoading,
    authMode,
    login,
    logout,
    updateUser,
    // Only include Supabase methods when in Supabase mode
    ...(authMode === 'supabase' && {
      signInWithMagicLink,
      signInWithOAuth,
      resetPassword,
    }),
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
