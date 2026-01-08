// Environment Configuration - Centralized config management
// Uses Vite's import.meta.env for environment variables

// Safe environment variable access for Vite
const getEnv = (key: string, defaultValue: string = ''): string => {
  // Vite exposes env vars on import.meta.env
  const value = (import.meta.env as Record<string, string | undefined>)[key];
  return value ?? defaultValue;
};

export const config = {
  // API Configuration
  api: {
    baseUrl: getEnv('VITE_API_URL', 'http://localhost:3001/api'),
    timeout: parseInt(getEnv('VITE_API_TIMEOUT', '30000'), 10),
    useBackend: getEnv('VITE_USE_BACKEND') === 'true',
  },

  // Supabase Configuration
  supabase: {
    url: getEnv('VITE_SUPABASE_URL', ''),
    anonKey: getEnv('VITE_SUPABASE_ANON_KEY', ''),
    isConfigured: !!getEnv('VITE_SUPABASE_URL') && !!getEnv('VITE_SUPABASE_ANON_KEY'),
  },

  // Authentication Configuration
  auth: {
    auth0Domain: getEnv('VITE_AUTH0_DOMAIN', ''),
    auth0ClientId: getEnv('VITE_AUTH0_CLIENT_ID', ''),
    tokenKey: 'auth_token',
    userKey: 'current_user',
  },

  // Feature Flags
  features: {
    enablePIDashboard: getEnv('VITE_ENABLE_PI_DASHBOARD') !== 'false', // default true
    enableRealTimeVerification: getEnv('VITE_ENABLE_REALTIME') === 'true',
    enableOfflineMode: getEnv('VITE_ENABLE_OFFLINE') !== 'false', // default true
    enableExportToCloud: getEnv('VITE_ENABLE_CLOUD_EXPORT') === 'true',
    enableCollaboration: getEnv('VITE_ENABLE_COLLABORATION') === 'true',
  },

  // Storage Configuration
  storage: {
    prefix: 'clinical_intelligence_',
    version: '1.0',
    maxManuscriptsPerProject: 50,
    maxSourcesPerManuscript: 100,
  },

  // Analytics & Monitoring
  analytics: {
    sentryDsn: getEnv('VITE_SENTRY_DSN', ''),
    enableSentry: getEnv('VITE_ENABLE_SENTRY') === 'true',
    mixpanelToken: getEnv('VITE_MIXPANEL_TOKEN', ''),
    enableMixpanel: getEnv('VITE_ENABLE_MIXPANEL') === 'true',
  },

  // UI Configuration
  ui: {
    defaultTheme: 'light' as 'light' | 'dark',
    enableAnimations: getEnv('VITE_ENABLE_ANIMATIONS') !== 'false',
    defaultWordCountTarget: 3500,
    autosaveInterval: 5000, // ms
  },

  // Development
  dev: {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    enableDebugLogs: getEnv('VITE_DEBUG_LOGS') === 'true',
    mockBackend: getEnv('VITE_MOCK_BACKEND') === 'true',
  },
};

// Helper to check if running in production
export const isProduction = () => config.dev.isProduction;

// Helper to check if backend is enabled
export const isBackendEnabled = () => config.api.useBackend;

// Helper to check if offline mode is available
export const isOfflineModeEnabled = () => config.features.enableOfflineMode;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => config.supabase.isConfigured;

// Helper to get full API URL
export const getApiUrl = (endpoint: string) => {
  return `${config.api.baseUrl}${endpoint}`;
};

// Export for easy access
export default config;
