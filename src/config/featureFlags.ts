/**
 * Feature Flags System
 * Clinical Intelligence Engine - Governance Architecture
 * 
 * Purpose: Safe, progressive rollout of governance features
 * Strategy: All flags OFF by default. Zero impact on existing functionality.
 * 
 * Rollback: Set any flag to `false` to instantly disable feature
 */

export const FEATURE_FLAGS = {
  /**
   * RBAC: Role-Based Access Control
   * Enables: User roles (PI, Junior, Statistician)
   * Impact: Tab visibility, action restrictions
   */
  ENABLE_RBAC: true,  // ← ENABLED for testing

  /**
   * Solo Mode: Single-user optimization
   * Enables: Auto-approval of PI gates, simplified workflow
   * Impact: Skips PI approval steps, streamlined dashboard
   * Recommended for: Academic researchers working alone
   */
  ENABLE_SOLO_MODE: true,  // ← ENABLED by default for solo academic users

  /**
   * Team Mode: Multi-user collaboration
   * Enables: Team member invites, delegation
   * Impact: Team roster UI, shared projects
   */
  ENABLE_TEAM_MODE: false,
  
  /**
   * Institutional: Enterprise features
   * Enables: Admin panel, global policies
   * Impact: Institutional dashboard, multi-lab view
   */
  ENABLE_INSTITUTIONAL: false,
  
  /**
   * AI Policy: Global AI governance
   * Enables: Institutional AI restrictions
   * Impact: Autonomy slider filtering per role/policy
   */
  ENABLE_AI_POLICY: true,  // ← ENABLED for testing
  
  /**
   * Manifest Locking: PI-only final lock
   * Enables: Lock manifest button, lock status
   * Impact: Prevents edits after PI locks manifest
   */
  ENABLE_MANIFEST_LOCKING: false,
  
  /**
   * Audit Disclosure: Governance transparency
   * Enables: Policy disclosure in exports
   * Impact: Adds governance info to Verification Appendix
   */
  ENABLE_AUDIT_DISCLOSURE: false,
} as const;

/**
 * Feature flag type for type-safe access
 */
export type FeatureFlag = keyof typeof FEATURE_FLAGS;

/**
 * Check if a feature is enabled
 * 
 * @param flag - The feature flag to check
 * @returns boolean indicating if feature is enabled
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FEATURE_FLAGS[flag];
}

/**
 * Get all enabled features
 * 
 * @returns Array of enabled feature names
 */
export function getEnabledFeatures(): FeatureFlag[] {
  return Object.entries(FEATURE_FLAGS)
    .filter(([_, enabled]) => enabled)
    .map(([flag, _]) => flag as FeatureFlag);
}

/**
 * Development-only: Enable all features
 * WARNING: Only use for testing/development
 */
export function enableAllFeatures(): void {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('enableAllFeatures() should only be used in development');
    return;
  }
  
  Object.keys(FEATURE_FLAGS).forEach(key => {
    (FEATURE_FLAGS as any)[key] = true;
  });
}

/**
 * Development-only: Disable all features (rollback)
 */
export function disableAllFeatures(): void {
  Object.keys(FEATURE_FLAGS).forEach(key => {
    (FEATURE_FLAGS as any)[key] = false;
  });
}