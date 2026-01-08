/**
 * EmptyState Component
 * Unified component for displaying empty/no-data states across the Clinical Intelligence Engine
 * Now with preset support and i18n integration
 */

import { LucideIcon, ArrowRight, FolderOpen, FileText, Database, FileEdit, BarChart3, Shield, Users, Bot, Search, AlertCircle, Wifi, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Preset type definitions
export type EmptyStatePreset = 
  | 'noProjectSelected'
  | 'noProtocols'
  | 'noProjects'
  | 'noData'
  | 'noManuscripts'
  | 'noAnalytics'
  | 'noIRBSubmissions'
  | 'noTeamMembers'
  | 'noPersonas'
  | 'noSearchResults'
  | 'noFilterResults'
  | 'loading'
  | 'error'
  | 'offline'
  | 'noPermission'
  | 'readOnlyMode'
  | 'allComplete'
  | 'emptyInbox'
  | 'protocolWorkbench'
  | 'academicWriting'
  | 'ethicsBoard'
  | 'database'
  | 'analytics';

// Icon mapping for presets
const PRESET_ICONS: Record<EmptyStatePreset, LucideIcon> = {
  noProjectSelected: FolderOpen,
  noProtocols: FileText,
  noProjects: FolderOpen,
  noData: Database,
  noManuscripts: FileEdit,
  noAnalytics: BarChart3,
  noIRBSubmissions: Shield,
  noTeamMembers: Users,
  noPersonas: Bot,
  noSearchResults: Search,
  noFilterResults: Search,
  loading: Database,
  error: AlertCircle,
  offline: Wifi,
  noPermission: Lock,
  readOnlyMode: Lock,
  allComplete: Database,
  emptyInbox: Database,
  protocolWorkbench: FileText,
  academicWriting: FileEdit,
  ethicsBoard: Shield,
  database: Database,
  analytics: BarChart3
};

export interface EmptyStateProps {
  /** Preset configuration key (uses i18n automatically) */
  preset?: EmptyStatePreset;
  
  /** Icon to display (from lucide-react) */
  icon?: LucideIcon;
  
  /** Main title/heading */
  title?: string;
  
  /** Description or subtitle text */
  description?: string;
  
  /** Optional action button */
  action?: {
    label?: string;
    onClick: () => void;
    icon?: LucideIcon;
  } | null;
  
  /** For preset mode: just provide onClick, label comes from i18n */
  onAction?: () => void;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Additional className for container */
  className?: string;
}

export function EmptyState({
  preset,
  icon: customIcon,
  title: customTitle,
  description: customDescription,
  action: customAction,
  onAction,
  size = 'md',
  className = ''
}: EmptyStateProps) {
  const { t } = useTranslation('emptyStates');
  
  // Determine values based on preset or custom props
  let Icon: LucideIcon;
  let title: string;
  let description: string;
  let action: { label: string; onClick: () => void; icon?: LucideIcon } | null | undefined;
  
  if (preset) {
    // Use preset configuration with i18n
    Icon = customIcon || PRESET_ICONS[preset];
    title = customTitle || t(`${preset}.title`);
    description = customDescription || t(`${preset}.description`);
    
    const actionLabel = t(`${preset}.action`);
    
    // Handle action based on what's provided
    if (customAction !== undefined) {
      // Explicit custom action provided (could be null to disable)
      action = customAction;
    } else if (onAction) {
      // onAction provided - use preset label with custom onClick
      if (actionLabel && actionLabel !== 'null' && actionLabel !== '') {
        action = {
          label: actionLabel,
          onClick: onAction,
          icon: customAction?.icon
        };
      } else {
        action = null;
      }
    } else if (actionLabel && actionLabel !== 'null' && actionLabel !== '') {
      // Preset has action but no onClick provided
      action = undefined;
    } else {
      // No action for this preset
      action = null;
    }
  } else {
    // Fully custom mode (backward compatible)
    Icon = customIcon || FolderOpen;
    title = customTitle || 'No data';
    description = customDescription || 'No description provided';
    action = customAction;
  }
  
  // Size mappings for consistent scaling
  const sizeConfig = {
    sm: {
      container: 'py-8',
      iconBox: 'w-12 h-12',
      icon: 'w-6 h-6',
      title: 'text-base',
      description: 'text-sm',
      button: 'px-4 py-2 text-sm'
    },
    md: {
      container: 'py-12',
      iconBox: 'w-14 h-14',
      icon: 'w-7 h-7',
      title: 'text-lg',
      description: 'text-sm',
      button: 'px-5 py-2.5 text-sm'
    },
    lg: {
      container: 'py-16',
      iconBox: 'w-16 h-16',
      icon: 'w-8 h-8',
      title: 'text-xl',
      description: 'text-base',
      button: 'px-6 py-3 text-base'
    }
  };

  const sizing = sizeConfig[size];
  const ActionIcon = action?.icon || ArrowRight;

  return (
    <div className={`flex flex-col items-center justify-center text-center ${sizing.container} ${className}`}>
      {/* Icon with subtle grid background */}
      <div className={`${sizing.iconBox} mb-4 flex items-center justify-center`}>
        <Icon className={`${sizing.icon} text-slate-400`} strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className={`font-medium ${sizing.title} text-slate-900 mb-2`}>
        {title}
      </h3>

      {/* Description */}
      <p className={`${sizing.description} text-slate-600 max-w-sm mx-auto mb-6 leading-relaxed`}>
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className={`inline-flex items-center gap-2 ${sizing.button} bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors`}
        >
          <ActionIcon className="w-4 h-4" />
          {action.label}
        </button>
      )}
    </div>
  );
}