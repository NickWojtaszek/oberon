/**
 * Supabase Authentication Service
 *
 * This module provides authentication functionality using Supabase Auth.
 * Supports email/password, magic link, and OAuth providers.
 *
 * This is separate from the existing auth.ts to allow gradual migration.
 * When Supabase is configured, this service will be used; otherwise falls back to mock.
 */

import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { getSupabase, isSupabaseReady } from './supabase';

export interface SupabaseAuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

// ============================================
// SUPABASE AUTH SERVICE
// ============================================
export const supabaseAuthService = {
  /**
   * Check if Supabase Auth is available
   */
  isAvailable(): boolean {
    return isSupabaseReady();
  },

  /**
   * Get the current session
   */
  async getSession(): Promise<Session | null> {
    if (!isSupabaseReady()) return null;
    const { data: { session } } = await getSupabase().auth.getSession();
    return session;
  },

  /**
   * Get the current user
   */
  async getUser(): Promise<User | null> {
    if (!isSupabaseReady()) return null;
    const { data: { user } } = await getSupabase().auth.getUser();
    return user;
  },

  /**
   * Sign up with email and password
   */
  async signUp(credentials: SignUpCredentials): Promise<{ user: User | null; error: Error | null }> {
    if (!isSupabaseReady()) {
      return { user: null, error: new Error('Supabase not configured') };
    }

    const { data, error } = await getSupabase().auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.fullName || credentials.email,
        },
      },
    });

    return { user: data.user, error };
  },

  /**
   * Sign in with email and password
   */
  async signIn(credentials: SignInCredentials): Promise<{ user: User | null; error: Error | null }> {
    if (!isSupabaseReady()) {
      return { user: null, error: new Error('Supabase not configured') };
    }

    const { data, error } = await getSupabase().auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    return { user: data.user, error };
  },

  /**
   * Sign in with magic link (passwordless)
   */
  async signInWithMagicLink(email: string): Promise<{ error: Error | null }> {
    if (!isSupabaseReady()) {
      return { error: new Error('Supabase not configured') };
    }

    const { error } = await getSupabase().auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    return { error };
  },

  /**
   * Sign in with OAuth provider
   */
  async signInWithOAuth(provider: 'google' | 'github' | 'azure'): Promise<{ error: Error | null }> {
    if (!isSupabaseReady()) {
      return { error: new Error('Supabase not configured') };
    }

    const { error } = await getSupabase().auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });

    return { error };
  },

  /**
   * Sign out
   */
  async signOut(): Promise<{ error: Error | null }> {
    if (!isSupabaseReady()) {
      return { error: new Error('Supabase not configured') };
    }

    const { error } = await getSupabase().auth.signOut();
    return { error };
  },

  /**
   * Reset password (sends email)
   */
  async resetPassword(email: string): Promise<{ error: Error | null }> {
    if (!isSupabaseReady()) {
      return { error: new Error('Supabase not configured') };
    }

    const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    return { error };
  },

  /**
   * Update password (after reset)
   */
  async updatePassword(newPassword: string): Promise<{ error: Error | null }> {
    if (!isSupabaseReady()) {
      return { error: new Error('Supabase not configured') };
    }

    const { error } = await getSupabase().auth.updateUser({
      password: newPassword,
    });

    return { error };
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ): { unsubscribe: () => void } {
    if (!isSupabaseReady()) {
      return { unsubscribe: () => {} };
    }

    const { data: { subscription } } = getSupabase().auth.onAuthStateChange(callback);
    return { unsubscribe: () => subscription.unsubscribe() };
  },

  /**
   * Refresh the session
   */
  async refreshSession(): Promise<{ session: Session | null; error: Error | null }> {
    if (!isSupabaseReady()) {
      return { session: null, error: new Error('Supabase not configured') };
    }

    const { data: { session }, error } = await getSupabase().auth.refreshSession();
    return { session, error };
  },
};

export default supabaseAuthService;
