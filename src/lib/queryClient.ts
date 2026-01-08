// React Query Configuration - Centralized data fetching setup

import { QueryClient } from '@tanstack/react-query';
import { config } from '../config/environment';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh (5 minutes)
      staleTime: 5 * 60 * 1000,
      
      // Cache time: how long unused data stays in cache (10 minutes)
      gcTime: 10 * 60 * 1000,
      
      // Retry failed requests
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 2 times for 5xx errors
        return failureCount < 2;
      },
      
      // Refetch on window focus in production only
      refetchOnWindowFocus: config.dev.isProduction,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
    },
    
    mutations: {
      // Retry failed mutations once
      retry: 1,
      
      // Don't retry on network error in offline mode
      onError: (error: any) => {
        if (config.dev.enableDebugLogs) {
          console.error('Mutation error:', error);
        }
      },
    },
  },
});

// Query keys factory for consistent cache key management
export const queryKeys = {
  // Projects
  projects: {
    all: ['projects'] as const,
    detail: (projectId: string) => ['projects', projectId] as const,
    settings: (projectId: string) => ['projects', projectId, 'settings'] as const,
  },
  
  // Manuscripts
  manuscripts: {
    all: (projectId: string) => ['manuscripts', { projectId }] as const,
    detail: (manuscriptId: string) => ['manuscripts', manuscriptId] as const,
    content: (manuscriptId: string, section: string) => 
      ['manuscripts', manuscriptId, 'content', section] as const,
  },
  
  // Verifications
  verifications: {
    all: (manuscriptId: string) => ['verifications', { manuscriptId }] as const,
    detail: (verificationId: string) => ['verifications', verificationId] as const,
    byManuscript: (manuscriptId: string) => ['verifications', 'manuscript', manuscriptId] as const,
  },
  
  // Statistical Manifests
  statisticalManifests: {
    all: (projectId: string) => ['statistical-manifests', { projectId }] as const,
    latest: (projectId: string) => ['statistical-manifests', projectId, 'latest'] as const,
    detail: (manifestId: string) => ['statistical-manifests', manifestId] as const,
  },
  
  // Sources
  sources: {
    all: (manuscriptId: string) => ['sources', { manuscriptId }] as const,
    detail: (sourceId: string) => ['sources', sourceId] as const,
  },
  
  // Analytics
  analytics: {
    dashboard: ['analytics', 'dashboard'] as const,
    manuscriptMetrics: (manuscriptId: string) => 
      ['analytics', 'manuscript', manuscriptId] as const,
    allManuscriptMetrics: ['analytics', 'all-manuscripts'] as const,
  },
  
  // Auth
  auth: {
    currentUser: ['auth', 'current-user'] as const,
    permissions: ['auth', 'permissions'] as const,
  },
  
  // Journals
  journals: {
    all: ['journals'] as const,
    detail: (journalId: string) => ['journals', journalId] as const,
  },
};

// Helper to invalidate all manuscript-related queries
export const invalidateManuscriptQueries = (manuscriptId: string) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.manuscripts.detail(manuscriptId) });
  queryClient.invalidateQueries({ queryKey: queryKeys.verifications.byManuscript(manuscriptId) });
  queryClient.invalidateQueries({ queryKey: queryKeys.sources.all(manuscriptId) });
};

// Helper to invalidate all project-related queries
export const invalidateProjectQueries = (projectId: string) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
  queryClient.invalidateQueries({ queryKey: queryKeys.manuscripts.all(projectId) });
  queryClient.invalidateQueries({ queryKey: queryKeys.statisticalManifests.all(projectId) });
};

// Prefetch helper for optimistic loading
export const prefetchManuscript = async (manuscriptId: string, fetchFn: () => Promise<any>) => {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.manuscripts.detail(manuscriptId),
    queryFn: fetchFn,
  });
};
