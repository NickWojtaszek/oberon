/**
 * Permission Guard Component
 * Phase 2: Conditional UI Rendering
 * 
 * Purpose: Wrapper component for permission-based rendering
 * Usage: Wrap any component that needs permission checks
 */

import { ReactNode } from 'react';
import { Lock, AlertCircle } from 'lucide-react';
import { FEATURE_FLAGS } from '../../config/featureFlags';
import { useGovernance } from '../../hooks/useGovernance';
import type { TabAccessLevel } from '../../types/governance';

interface PermissionGuardProps {
  children: ReactNode;
  
  // Permission check
  permission?: string;           // Action permission (e.g., 'export-final')
  tab?: string;                   // Tab permission (e.g., 'analytics')
  requireLevel?: TabAccessLevel;  // Required access level (default: 'full')
  
  // Behavior
  fallback?: ReactNode;           // Custom fallback content
  showMessage?: boolean;          // Show permission denied message (default: true)
  hideIfDenied?: boolean;         // Hide instead of showing message (default: false)
  
  // Read-only mode
  readOnly?: boolean;             // Force read-only mode
}

export function PermissionGuard({
  children,
  permission,
  tab,
  requireLevel = 'full',
  fallback,
  showMessage = true,
  hideIfDenied = false,
  readOnly = false,
}: PermissionGuardProps) {
  const governance = FEATURE_FLAGS.ENABLE_RBAC ? useGovernance() : null;
  
  // If RBAC disabled, always allow
  if (!FEATURE_FLAGS.ENABLE_RBAC || !governance) {
    return <>{children}</>;
  }
  
  // Check permissions
  let hasPermission = true;
  let accessLevel: TabAccessLevel = 'full';
  let denialReason = '';
  
  if (permission) {
    hasPermission = governance.canPerformAction(permission);
    if (!hasPermission) {
      denialReason = `You don't have permission to ${permission.replace('-', ' ')}`;
    }
  }
  
  if (tab) {
    const tabAccess = governance.getTabAccessLevel(tab);
    accessLevel = tabAccess;
    
    // Check if access level meets requirement
    if (requireLevel === 'full' && tabAccess !== 'full') {
      hasPermission = false;
      denialReason = tabAccess === 'read' 
        ? 'This section is read-only for your role'
        : tabAccess === 'comment'
        ? 'You can only comment on this section'
        : 'You don\'t have access to this section';
    }
  }
  
  // If permission granted, render children
  if (hasPermission && !readOnly) {
    return <>{children}</>;
  }
  
  // If read-only mode or limited access
  if (hasPermission && (readOnly || (accessLevel === 'read' || accessLevel === 'comment'))) {
    return (
      <div className="relative">
        {/* Read-only overlay indicator */}
        <div className="absolute top-0 right-0 z-10 px-3 py-1 bg-amber-100 border border-amber-200 rounded-bl-lg rounded-tr-lg">
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3 text-amber-700" />
            <span className="text-xs font-medium text-amber-700">
              {accessLevel === 'read' ? 'Read-Only' : 'Comment-Only'}
            </span>
          </div>
        </div>
        
        {/* Content with pointer-events disabled */}
        <div className="pointer-events-none opacity-90">
          {children}
        </div>
      </div>
    );
  }
  
  // Permission denied
  
  // If hideIfDenied, return null
  if (hideIfDenied) {
    return null;
  }
  
  // If custom fallback provided
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // Default: Show permission denied message
  if (showMessage) {
    return (
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Lock className="w-5 h-5 text-amber-700" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-slate-900">Access Restricted</h3>
            <p className="text-sm text-slate-600 mt-1">
              {denialReason || 'You don\'t have permission to access this feature.'}
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Current role: <span className="font-medium">{governance.roleName}</span>
            </p>
            {governance.isPI === false && (
              <p className="text-xs text-slate-500 mt-2">
                Contact your Principal Investigator to request access.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Hide completely
  return null;
}

/**
 * Inline Permission Check Component
 * For simple yes/no rendering
 */
interface IfPermissionProps {
  children: ReactNode;
  permission?: string;
  tab?: string;
  requireLevel?: TabAccessLevel;
  fallback?: ReactNode;
}

export function IfPermission({
  children,
  permission,
  tab,
  requireLevel = 'full',
  fallback = null,
}: IfPermissionProps) {
  const governance = FEATURE_FLAGS.ENABLE_RBAC ? useGovernance() : null;
  
  // If RBAC disabled, always show
  if (!FEATURE_FLAGS.ENABLE_RBAC || !governance) {
    return <>{children}</>;
  }
  
  // Check permission
  let hasPermission = true;
  
  if (permission) {
    hasPermission = governance.canPerformAction(permission);
  }
  
  if (tab) {
    const tabAccess = governance.getTabAccessLevel(tab);
    if (requireLevel === 'full' && tabAccess !== 'full') {
      hasPermission = false;
    }
  }
  
  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

/**
 * Permission-based Button Component
 */
interface PermissionButtonProps {
  children: ReactNode;
  permission?: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function PermissionButton({
  children,
  permission,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
}: PermissionButtonProps) {
  const governance = FEATURE_FLAGS.ENABLE_RBAC ? useGovernance() : null;
  
  // Check permission
  const hasPermission = !permission || !governance || governance.canPerformAction(permission);
  
  const isDisabled = disabled || loading || !hasPermission;
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-slate-600 text-white hover:bg-slate-700',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
  };
  
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        px-4 py-2 rounded-lg font-medium text-sm
        transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center gap-2
        ${variantStyles[variant]}
        ${className}
      `}
      title={!hasPermission ? `Permission required: ${permission}` : undefined}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {!hasPermission && !loading && (
        <Lock className="w-4 h-4" />
      )}
      {children}
    </button>
  );
}
