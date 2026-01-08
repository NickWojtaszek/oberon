/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_USE_BACKEND: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_AUTH0_DOMAIN: string
  readonly VITE_AUTH0_CLIENT_ID: string
  readonly VITE_ENABLE_PI_DASHBOARD: string
  readonly VITE_ENABLE_REALTIME: string
  readonly VITE_ENABLE_OFFLINE: string
  readonly VITE_ENABLE_CLOUD_EXPORT: string
  readonly VITE_ENABLE_COLLABORATION: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_ENABLE_SENTRY: string
  readonly VITE_MIXPANEL_TOKEN: string
  readonly VITE_ENABLE_MIXPANEL: string
  readonly VITE_ENABLE_ANIMATIONS: string
  readonly VITE_DEBUG_LOGS: string
  readonly VITE_MOCK_BACKEND: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
