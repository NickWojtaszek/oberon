/**
 * Reusable Status Badge Component
 * Consolidates badge patterns used across the app
 */

import { LucideIcon } from 'lucide-react';

export type BadgeVariant = 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'purple'
  | 'indigo'
  | 'slate'
  | 'emerald'
  | 'amber'
  | 'red'
  | 'blue';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

interface StatusBadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  warning: 'bg-amber-100 text-amber-800 border-amber-300',
  error: 'bg-red-100 text-red-800 border-red-300',
  info: 'bg-blue-100 text-blue-800 border-blue-300',
  purple: 'bg-purple-100 text-purple-800 border-purple-300',
  indigo: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  slate: 'bg-slate-100 text-slate-700 border-slate-300',
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  amber: 'bg-amber-100 text-amber-800 border-amber-300',
  red: 'bg-red-100 text-red-800 border-red-300',
  blue: 'bg-blue-100 text-blue-800 border-blue-300',
};

const sizeStyles: Record<BadgeSize, { container: string; icon: string }> = {
  xs: { container: 'px-2 py-0.5 text-xs', icon: 'w-3 h-3' },
  sm: { container: 'px-2 py-1 text-xs', icon: 'w-3 h-3' },
  md: { container: 'px-3 py-1 text-sm', icon: 'w-4 h-4' },
  lg: { container: 'px-4 py-1.5 text-sm', icon: 'w-4 h-4' },
};

export function StatusBadge({ 
  variant = 'info', 
  size = 'sm',
  icon: Icon, 
  children,
  className = ''
}: StatusBadgeProps) {
  const styles = sizeStyles[size];
  
  return (
    <span className={`
      inline-flex items-center gap-1 border rounded-lg font-medium
      ${variantStyles[variant]}
      ${styles.container}
      ${className}
    `}>
      {Icon && <Icon className={styles.icon} />}
      {children}
    </span>
  );
}

/**
 * Specialized badge variants
 */

interface RigorBadgeProps {
  level: 'regulatory' | 'strict' | 'standard' | 'streamlined';
  size?: BadgeSize;
}

export function RigorBadge({ level, size = 'sm' }: RigorBadgeProps) {
  const variantMap = {
    regulatory: 'red' as BadgeVariant,
    strict: 'amber' as BadgeVariant,
    standard: 'blue' as BadgeVariant,
    streamlined: 'emerald' as BadgeVariant,
  };
  
  return (
    <StatusBadge variant={variantMap[level]} size={size}>
      {level.toUpperCase()} Rigor
    </StatusBadge>
  );
}

interface PermissionBadgeProps {
  level: 'read' | 'write' | 'admin';
  size?: BadgeSize;
}

export function PermissionBadge({ level, size = 'sm' }: PermissionBadgeProps) {
  const variantMap = {
    admin: 'purple' as BadgeVariant,
    write: 'blue' as BadgeVariant,
    read: 'slate' as BadgeVariant,
  };
  
  return (
    <StatusBadge variant={variantMap[level]} size={size}>
      {level.toUpperCase()}
    </StatusBadge>
  );
}

interface AIAutonomyBadgeProps {
  level: 'audit-only' | 'suggest' | 'co-pilot' | 'supervisor';
  size?: BadgeSize;
}

export function AIAutonomyBadge({ level, size = 'sm' }: AIAutonomyBadgeProps) {
  // Safety check for undefined level
  if (!level) {
    return (
      <StatusBadge variant="slate" size={size}>
        AI: UNKNOWN
      </StatusBadge>
    );
  }
  
  const variantMap = {
    supervisor: 'emerald' as BadgeVariant,
    'co-pilot': 'blue' as BadgeVariant,
    suggest: 'amber' as BadgeVariant,
    'audit-only': 'slate' as BadgeVariant,
  };
  
  return (
    <StatusBadge variant={variantMap[level]} size={size}>
      AI: {level.replace('-', ' ').toUpperCase()}
    </StatusBadge>
  );
}