/**
 * Layout Header Component
 * Reusable header for enterprise applications
 * 
 * Features:
 * - Breadcrumb navigation
 * - Project/context badges
 * - Action buttons (primary + secondary)
 * - User menu and settings
 */

import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

export interface Breadcrumb {
  label: string;
  onClick?: () => void;
}

export interface Badge {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info';
  onClick?: () => void;
}

export interface HeaderAction {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

interface LayoutHeaderProps {
  // Left section
  breadcrumbs?: Breadcrumb[];
  badges?: Badge[];
  
  // Center section (optional custom content)
  centerContent?: ReactNode;
  
  // Right section
  primaryAction?: HeaderAction;
  secondaryActions?: HeaderAction[];
  rightContent?: ReactNode;
  
  // Styling
  className?: string;
}

export function LayoutHeader({
  breadcrumbs = [],
  badges = [],
  centerContent,
  primaryAction,
  secondaryActions = [],
  rightContent,
  className = '',
}: LayoutHeaderProps) {
  
  const getBadgeVariantClasses = (variant: Badge['variant'] = 'default') => {
    switch (variant) {
      case 'primary':
        return 'border-blue-400 bg-blue-600 text-white';
      case 'success':
        return 'border-emerald-400 bg-emerald-600 text-white';
      case 'warning':
        return 'border-amber-400 bg-amber-600 text-white';
      case 'info':
        return 'border-indigo-400 bg-indigo-600 text-white';
      default:
        return 'border-slate-600 bg-slate-800 text-slate-200';
    }
  };

  return (
    <header className={`h-16 bg-slate-900 border-b border-slate-700 flex items-center px-8 gap-4 ${className}`}>
      {/* Left Section: Breadcrumbs & Badges */}
      <div className="flex items-center gap-4">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
                {crumb.onClick ? (
                  <button
                    onClick={crumb.onClick}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-sm text-white font-medium">
                    {crumb.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Badges */}
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          const badgeContent = (
            <>
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span className="text-xs font-medium">{badge.label}</span>
            </>
          );
          
          const badgeClasses = `flex items-center gap-2 px-3 py-1 rounded-full border ${getBadgeVariantClasses(badge.variant)}`;
          
          return badge.onClick ? (
            <button
              key={index}
              onClick={badge.onClick}
              className={`${badgeClasses} hover:opacity-80 transition-opacity`}
            >
              {badgeContent}
            </button>
          ) : (
            <div key={index} className={badgeClasses}>
              {badgeContent}
            </div>
          );
        })}
      </div>

      {/* Center Section (optional) */}
      {centerContent && (
        <div className="flex items-center gap-2">
          {centerContent}
        </div>
      )}

      {/* Right Section: Actions */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Secondary Actions */}
        {secondaryActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              className="
                px-4 py-2 text-sm font-medium text-slate-300
                border border-slate-600 rounded-lg 
                hover:bg-slate-800 hover:text-white transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2
              "
            >
              {Icon && <Icon className="w-4 h-4" />}
              {action.label}
            </button>
          );
        })}

        {/* Primary Action */}
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled || primaryAction.loading}
            className="
              px-6 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg 
              hover:bg-blue-700 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2
            "
          >
            {primaryAction.loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Loading...
              </>
            ) : (
              <>
                {primaryAction.icon && <primaryAction.icon className="w-4 h-4" />}
                {primaryAction.label}
              </>
            )}
          </button>
        )}
        
        {/* Custom Right Content */}
        {rightContent}
      </div>
    </header>
  );
}
