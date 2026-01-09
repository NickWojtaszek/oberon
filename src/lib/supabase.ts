/**
 * Supabase Client Configuration
 *
 * This module initializes the Supabase client for database operations and authentication.
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/environment';
import type { Database } from './database.types';

// Create Supabase client instance
let supabaseInstance: SupabaseClient<Database> | null = null;

/**
 * Get the Supabase client instance
 * Lazy initialization to ensure environment variables are loaded
 */
export function getSupabase(): SupabaseClient<Database> {
  if (!supabaseInstance) {
    if (!config.supabase.url || !config.supabase.anonKey) {
      throw new Error(
        'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
      );
    }

    supabaseInstance = createClient<Database>(
      config.supabase.url,
      config.supabase.anonKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
        db: {
          schema: 'public',
        },
        global: {
          headers: {
            'x-application-name': 'clinical-intelligence-engine',
          },
        },
      }
    );
  }

  return supabaseInstance;
}

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseReady(): boolean {
  return config.supabase.isConfigured;
}

/**
 * Get Supabase client only if configured (returns null otherwise)
 * Useful for optional Supabase usage with localStorage fallback
 */
export function getSupabaseIfConfigured(): SupabaseClient<Database> | null {
  if (!isSupabaseReady()) {
    return null;
  }
  return getSupabase();
}

/**
 * Get untyped Supabase client for write operations
 * This bypasses strict type checking for insert/update operations
 */
export function getSupabaseUntyped(): SupabaseClient | null {
  if (!isSupabaseReady()) {
    return null;
  }
  return getSupabase() as SupabaseClient;
}

// Export singleton for convenience (initialized on first access)
export const supabase = {
  get client() {
    return getSupabase();
  },
  get isReady() {
    return isSupabaseReady();
  },
};

export default supabase;
