/**
 * Supabase Authentication Hook
 *
 * React hook for managing Supabase authentication state.
 * Provides user, session, and authentication methods.
 */

import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabaseAuthService } from '../lib/supabaseAuth';
import { isSupabaseReady } from '../lib/supabase';

export interface UseSupabaseAuthReturn {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSupabaseConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  signInWithMagicLink: (email: string) => Promise<{ error: Error | null }>;
  signInWithOAuth: (provider: 'google' | 'github' | 'azure') => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

export function useSupabaseAuth(): UseSupabaseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isSupabaseConfigured = isSupabaseReady();

  // Initialize auth state
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // Get initial session
    const initAuth = async () => {
      try {
        const currentSession = await supabaseAuthService.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Subscribe to auth changes
    const { unsubscribe } = supabaseAuthService.onAuthStateChange(
      (event: AuthChangeEvent, newSession: Session | null) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [isSupabaseConfigured]);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    const result = await supabaseAuthService.signIn({ email, password });
    setIsLoading(false);
    return { error: result.error };
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    setIsLoading(true);
    const result = await supabaseAuthService.signUp({ email, password, fullName });
    setIsLoading(false);
    return { error: result.error };
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    const result = await supabaseAuthService.signOut();
    setIsLoading(false);
    return result;
  }, []);

  const signInWithMagicLink = useCallback(async (email: string) => {
    return supabaseAuthService.signInWithMagicLink(email);
  }, []);

  const signInWithOAuth = useCallback(async (provider: 'google' | 'github' | 'azure') => {
    return supabaseAuthService.signInWithOAuth(provider);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    return supabaseAuthService.resetPassword(email);
  }, []);

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    isSupabaseConfigured,
    signIn,
    signUp,
    signOut,
    signInWithMagicLink,
    signInWithOAuth,
    resetPassword,
  };
}

export default useSupabaseAuth;
