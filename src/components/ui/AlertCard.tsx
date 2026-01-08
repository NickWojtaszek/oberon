/**
 * Reusable Alert Card Component
 * Used for info boxes, warnings, errors, and success messages
 */

import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertCardProps {
  variant?: AlertVariant;
  icon?: LucideIcon;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

const variantStyles: Record<AlertVariant, {
  container: string;
  icon: string;
  title: string;
  text: string;
}> = {
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-900',
    text: 'text-blue-800',
  },
  success: {
    container: 'bg-emerald-50 border-emerald-200',
    icon: 'text-emerald-600',
    title: 'text-emerald-900',
    text: 'text-emerald-800',
  },
  warning: {
    container: 'bg-amber-50 border-amber-200',
    icon: 'text-amber-600',
    title: 'text-amber-900',
    text: 'text-amber-800',
  },
  error: {
    container: 'bg-red-50 border-red-200',
    icon: 'text-red-600',
    title: 'text-red-900',
    text: 'text-red-800',
  },
};

export function AlertCard({
  variant = 'info',
  icon: Icon,
  title,
  children,
  actions,
  className = '',
}: AlertCardProps) {
  const styles = variantStyles[variant];
  
  return (
    <div className={`border-2 rounded-xl p-6 ${styles.container} ${className}`}>
      <div className="flex items-start gap-3">
        {Icon && (
          <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${styles.icon}`} />
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`font-medium mb-2 ${styles.title}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${styles.text}`}>
            {children}
          </div>
          {actions && (
            <div className="mt-4">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Specialized alert variants
 */

interface InfoBoxProps {
  title?: string;
  children: ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export function InfoBox({ title, children, icon, className }: InfoBoxProps) {
  return (
    <AlertCard variant="info" title={title} icon={icon} className={className}>
      {children}
    </AlertCard>
  );
}

export function SuccessBox({ title, children, icon, className }: InfoBoxProps) {
  return (
    <AlertCard variant="success" title={title} icon={icon} className={className}>
      {children}
    </AlertCard>
  );
}

export function WarningBox({ title, children, icon, className }: InfoBoxProps) {
  return (
    <AlertCard variant="warning" title={title} icon={icon} className={className}>
      {children}
    </AlertCard>
  );
}

export function ErrorBox({ title, children, icon, className }: InfoBoxProps) {
  return (
    <AlertCard variant="error" title={title} icon={icon} className={className}>
      {children}
    </AlertCard>
  );
}
