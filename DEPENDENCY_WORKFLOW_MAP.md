# Dependency & Workflow Map — Clinical Intelligence Engine UI

This document maps dependencies, runtime workflows, external services, and identified breaking points with mitigation suggestions.

## Summary
- Stack: React + Vite front-end (TypeScript). Build: `vite build` → static `build/` directory. Deployed as static site (served by `serve` or Nixpacks/Railway). Node engine >= 18 for build.
- Key external services: Supabase (optional DB/auth), Google Gemini (client-side AI calls), optional Auth0, Sentry, Mixpanel, backend API (configurable).

## Dependency Inventory (from `package.json`)
- UI libs: `react`, `react-dom`, `@radix-ui/*`, `lucide-react`, `cmdk`, `embla-carousel-react`, `recharts`, `sonner`, `clsx`, `zod`, `uuid`, `class-variance-authority`.
- Data & state: `@tanstack/react-query`, `react-hook-form`, `react-dnd`, `react-resizable-panels`.
- Platform & build: `vite`, `@vitejs/plugin-react-swc`, `typescript`.
- Supabase SDK: `@supabase/supabase-js` (core runtime integration).
- Note: Several dependencies use wildcard `*` (e.g., `@tanstack/react-query`, `clsx`, `i18next`), which increases upgrade/breakage risk.

## Manifest & Build/Deploy Configs
- `vite.config.ts`: aliases many packages and sets `outDir: 'build'`, `target: 'esnext'`.
- `tsconfig.json` / `tsconfig.node.json`: standard TS settings; includes `vite.config.ts`.
- `nixpacks.toml`: builds with Node 20 via `npm ci --include=dev` then `npm run build`; `start` uses `npx serve build -s -l $PORT`.
- `railway.json`: uses NIXPACKS builder, `npm run build`, `npx serve ...` as start.

## Runtime Environment & Feature Flags
- `.env.example` lists VITE variables the app expects (client-side):
  - `VITE_API_URL`, `VITE_USE_BACKEND`, `VITE_GEMINI_API_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_AUTH0_*`, `VITE_ENABLE_*` flags, `VITE_SENTRY_DSN`, `VITE_MIXPANEL_TOKEN`, etc.
- The app uses `import.meta.env` to read these values via `src/config/environment.ts`.

## External Services & How They're Used
- Supabase
  - SDK: `@supabase/supabase-js` (initialized in `src/lib/supabase.ts`).
  - Used for auth (`src/lib/supabaseAuth.ts`) and optional storage/DB operations.
  - Initialization throws if `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are missing; code paths generally check `isSupabaseReady()` before use.

- Gemini (Google Generative Language API)
  - Client-side calls in `src/services/geminiService.ts` using `VITE_GEMINI_API_KEY` and direct `fetch` to the Google endpoint.
  - The code warns that client-side usage exposes the API key and recommends moving to backend proxy.

- Backend API
  - Centralized `ApiClient` (`src/lib/apiClient.ts`) uses `VITE_API_URL` and `VITE_USE_BACKEND` to decide whether to call backend endpoints or use local fallback.

- Observability & Auth
  - Optional Sentry/Mixpanel controlled by `VITE_ENABLE_SENTRY` / `VITE_ENABLE_MIXPANEL`.
  - Optional Auth0 variables present but unused when Supabase is configured.

## Workflow Map (high level)
- Local dev: `npm run dev` → Vite dev server (hot reload). Env via `.env` or `import.meta.env`.
- Build: `npm run build` → Vite produces `build/` directory.
- Preview/Serve: `npm run preview` or `npx serve build -s -l $PORT` (used by start script, Nixpacks, Railway).
- Auth flow: `AuthProvider` chooses `supabase` mode when `isSupabaseReady()` true, otherwise falls back to legacy localStorage auth.
- AI flow: client code calls Gemini directly if `VITE_GEMINI_API_KEY` set; extraction/synthesis flows parse responses and may be long-running.

## Identified Breaking Points & Risk Areas
1. Exposed AI API Key (High risk)
   - `VITE_GEMINI_API_KEY` is used client-side in `geminiService.ts`. In production this leaks the key. Mitigation: move Gemini calls to a backend proxy or serverless function and keep key server-side.

2. Supabase initialization throws on missing env (Medium risk)
   - `getSupabase()` throws when required env vars are absent. Most code checks `isSupabaseReady()` first, but lazy access could still trigger an exception. Mitigation: make `getSupabase()` safe-return (null) and centralize guards.

3. Wildcard dependency versions (`*`) and unpinned transitive upgrades (Medium→High risk)
   - Several deps use `*` or loose semver; CI/build may pull incompatible versions. Mitigation: pin versions, add Dependabot or similar, run periodic integration tests.

4. Nonstandard/unstable React version or mismatched peer deps (Medium risk)
   - `react` and `react-dom` pinned to `^18.3.1` (verify compatibility). Mitigation: ensure peer dependencies of major libraries (Radix, lucide, etc.) match React version; run smoke tests.

5. Build-time assumptions and Node engine (Low→Medium risk)
   - `nixpacks.toml` uses `nodejs_20`; `package.json` requires Node >= 18. Ensure CI and deployment use compatible Node. Mitigation: pin Node version in CI and deployment builders.

6. Feature flag/environment mismatch (Low→Medium risk)
   - Defaults in `.env.example` can enable/disable features (e.g., `VITE_MOCK_BACKEND=true`). Misconfiguration can cause missing backend behavior. Mitigation: document required envs and add runtime health checks.

7. Client-only heavy workloads & rate limits (Medium risk)
   - Client makes direct Gemini and other heavy API calls; could hit rate limits or CORS. Mitigation: move heavy calls to server, add retry/backoff and rate-limiting, add user-facing error messages.

8. Vite aliasing and package alias patterns (Low risk)
   - `vite.config.ts` contains aliases like `'vaul@1.1.2': 'vaul'`. Ensure this aliasing matches import paths in codebase; alias mismatches can cause runtime module resolution issues. Mitigation: remove or simplify aliases, prefer consistent imports.

9. Unchecked JSON parsing of model outputs (Low→Medium risk)
   - `geminiService.extractJSONFromResponse` tries robust parsing but malformed model outputs may still cause runtime errors. Mitigation: strengthen validation and add fallbacks.

## Recommendations (next actions)
1. Move all sensitive API keys (Gemini, any server keys) to a backend service. Create a minimal serverless proxy for Gemini calls.
2. Pin dependency versions currently `*` to concrete versions and add Dependabot/renovate policy.
3. Add runtime healthchecks for required envs (fail fast with clear messages during startup) and show a clear admin UI when essential services are unconfigured.
4. Make `getSupabase()` resilient (return null) and centralize handling of optional DB features to reduce throw surfaces.
5. Add CI step to run `npm ci` and `npm run build` with Node 20 (or pinned) and run a basic smoke test against built site.
6. Audit Vite aliases and remove any that map names with versions; prefer consistent import paths.
7. Document required envs in README and ensure `.env.example` remains up-to-date.

## Files and Code Locations (quick links)
- `package.json` — dependency list and scripts
- `vite.config.ts` — build config and aliases
- `nixpacks.toml`, `railway.json` — deployment builders and commands
- `src/config/environment.ts` — env handling
- `src/lib/supabase.ts`, `src/lib/supabaseAuth.ts` — Supabase integration
- `src/services/geminiService.ts` — client Gemini usage (high risk)
- `src/lib/apiClient.ts` — backend API client
- `src/contexts/AuthContext.tsx` — auth mode switching

---
Report generated programmatically. If you'd like, I can:
- Create a small serverless proxy for Gemini and update calls to use it.
- Pin dependencies and open a PR with `package.json` updates and tests.
- Run a deeper grep to list every `import.meta.env` usage and produce a checklist of required envs.
