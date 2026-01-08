/**
 * EmptyState Component with Preset Support
 * Enhanced version with built-in i18n and preset configurations
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

export interface EmptyStateWithPresetsProps {
  /** Preset configuration key (uses i18n automatically) */
  preset?: EmptyStatePreset;
  
  /** Custom icon (overrides preset icon) */
  icon?: LucideIcon;
  
  /** Custom title (overrides preset title) */
  title?: string;
  
  /** Custom description (overrides preset description) */
  description?: string;
  
  /** Custom action (overrides preset action) */
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  } | null;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Additional className for container */
  className?: string;
}

export function EmptyStateWithPresets({
  preset,
  icon: customIcon,
  title: customTitle,
  description: customDescription,
  action: customAction,
  size = 'md',
  className = ''
}: EmptyStateWithPresetsProps) {
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
    if (customAction !== undefined) {
      action = customAction;
    } else if (actionLabel && actionLabel !== 'null' && actionLabel !== '') {
      // Preset has an action but no onClick provided - action will be undefined
      action = undefined;
    } else {
      action = null;
    }
  } else {
    // Fully custom mode - require all props
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
      {/* Icon */}
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
