// Protected Route - Role-based access control for routes/components

import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requirePermission?: string;
  requireAnyPermission?: string[];
  requireAllPermissions?: string[];
  requireRole?: 'PI' | 'Researcher' | 'Biostatistician' | 'Reviewer' | 'Admin';
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireRole,
  fallback,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  // Not authenticated
  if (!isAuthenticated) {
    return fallback || <AccessDenied reason="You must be logged in to access this feature." />;
  }

  // Check single permission
  if (requirePermission && !hasPermission(requirePermission)) {
    return (
      fallback || (
        <AccessDenied
          reason={`You don't have permission to access this feature.`}
          requiredPermission={requirePermission}
        />
      )
    );
  }

  // Check any of multiple permissions
  if (requireAnyPermission && !hasAnyPermission(requireAnyPermission)) {
    return (
      fallback || (
        <AccessDenied
          reason={`You don't have the required permissions to access this feature.`}
          requiredPermission={requireAnyPermission.join(' OR ')}
        />
      )
    );
  }

  // Check all permissions
  if (requireAllPermissions && !hasAllPermissions(requireAllPermissions)) {
    return (
      fallback || (
        <AccessDenied
          reason={`You don't have all required permissions to access this feature.`}
          requiredPermission={requireAllPermissions.join(' AND ')}
        />
      )
    );
  }

  // Check specific role
  if (requireRole && user?.role !== requireRole) {
    return (
      fallback || (
        <AccessDenied
          reason={`This feature is only available to ${requireRole} users.`}
          requiredPermission={`Role: ${requireRole}`}
        />
      )
    );
  }

  // All checks passed
  return <>{children}</>;
}

// Access denied component
function AccessDenied({
  reason,
  requiredPermission,
}: {
  reason: string;
  requiredPermission?: string;
}) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="max-w-md w-full bg-white border border-red-200 rounded-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Denied</h2>

        <p className="text-sm text-slate-600 mb-4">{reason}</p>

        {requiredPermission && (
          <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-4">
            <div className="text-xs font-medium text-slate-700 mb-1">Required Permission:</div>
            <div className="text-xs font-mono text-slate-900">{requiredPermission}</div>
          </div>
        )}

        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded text-left">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800">
            Please contact your Principal Investigator or system administrator if you believe you
            should have access to this feature.
          </p>
        </div>
      </div>
    </div>
  );
}

// Inline permission wrapper component
interface PermissionGuardProps {
  permission: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGuard({ permission, fallback, children }: PermissionGuardProps) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}

// Role-based wrapper component
interface RoleGuardProps {
  role: 'PI' | 'Researcher' | 'Biostatistician' | 'Reviewer' | 'Admin';
  fallback?: ReactNode;
  children: ReactNode;
}

export function RoleGuard({ role, fallback, children }: RoleGuardProps) {
  const { user } = useAuth();

  if (user?.role !== role) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
