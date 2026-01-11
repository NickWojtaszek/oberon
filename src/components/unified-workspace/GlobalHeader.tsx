/**
 * Global Header Component
 * Research Factory - Action Consolidation
 * 
 * Layout:
 * - Left: Breadcrumbs
 * - Center-Right: Autonomy Slider
 * - Far Right: Primary Action (Export Package)
 * - Immediate Left of Primary: Secondary Actions (Run Logic Check)
 */

import { ChevronRight, Download, Shield, Users, Zap, Plus, Settings, Crown, GraduationCap, BarChart3, Database, Building, Lock, Eye, EyeOff, FlaskConical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AutonomyMode, JournalProfile } from '../../types/accountability';
import { FEATURE_FLAGS } from '../../config/featureFlags';
import { useGovernance } from '../../hooks/useGovernance';
import { useProtocol } from '../../contexts/ProtocolContext';
import { STUDY_METHODOLOGIES } from '../../config/studyMethodology';
import { StatusBadge } from '../ui/StatusBadge';
import { LanguageToggle } from './LanguageToggle';

interface GlobalHeaderProps {
  // Breadcrumbs
  breadcrumbs: Array<{
    label: string;
    onClick?: () => void;
  }>;
  
  // Journal selector
  selectedJournal?: JournalProfile;
  onJournalChange?: (journal: JournalProfile) => void;
  journalOptions?: JournalProfile[];
  onCreateCustomJournal?: () => void;
  onEditGenericJournal?: () => void;
  
  // Autonomy slider
  autonomyMode: AutonomyMode;
  onAutonomyChange: (mode: AutonomyMode) => void;
  
  // Actions
  primaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
  
  secondaryActions?: Array<{
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    disabled?: boolean;
  }>;
}

export function GlobalHeader({
  breadcrumbs,
  selectedJournal,
  onJournalChange,
  journalOptions = [],
  onCreateCustomJournal,
  onEditGenericJournal,
  autonomyMode,
  onAutonomyChange,
  primaryAction,
  secondaryActions = [],
}: GlobalHeaderProps) {
  // Translation hooks
  const { t } = useTranslation('navigation');
  const { t: tCommon } = useTranslation('common');

  // Get governance state
  const governance = FEATURE_FLAGS.ENABLE_RBAC ? useGovernance() : null;

  // Get protocol context (replaces project)
  const { currentProtocol } = useProtocol();
  const methodology = currentProtocol?.studyMethodology;
  
  // Helper function to get blinding status translation key
  const getBlindingStatusText = (blindingState: any) => {
    if (blindingState.isUnblinded) {
      return t('globalHeader.studyTypes.unblinded');
    }
    
    // Map protocol values to translation keys
    switch (blindingState.protocol) {
      case 'single-blind':
        return t('globalHeader.studyTypes.singleBlind');
      case 'double-blind':
        return t('globalHeader.studyTypes.doubleBlind');
      case 'triple-blind':
        return t('globalHeader.studyTypes.tripleBlind');
      default:
        return blindingState.protocol.toUpperCase().replace('-', ' ');
    }
  };
  
  // Check if primary action is allowed (Phase 2: Permission enforcement)
  const isPrimaryActionAllowed = () => {
    if (!FEATURE_FLAGS.ENABLE_RBAC || !governance) {
      return true; // No restrictions if RBAC disabled
    }
    
    // Map common action labels to permissions
    if (primaryAction?.label.toLowerCase().includes('export')) {
      return governance.canExportFinal;
    }
    
    // Default: allow
    return true;
  };
  
  const primaryActionAllowed = isPrimaryActionAllowed();
  
  // Role icon mapping
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'pi': return Crown;
      case 'junior': return GraduationCap;
      case 'statistician': return BarChart3;
      case 'data_entry': return Database;
      case 'institutional_admin': return Building;
      default: return Shield;
    }
  };
  
  // Role color mapping
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'pi': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'junior': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'statistician': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'data_entry': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'institutional_admin': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-700 flex items-center px-8 gap-4">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-4">
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
        
        {/* Protocol Identifier - Show when protocol is selected */}
        {currentProtocol && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-slate-600 bg-slate-800 text-slate-200">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium">
              {currentProtocol.protocolNumber}
            </span>
            {currentProtocol.protocolTitle && (
              <>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs" title={currentProtocol.protocolTitle}>
                  {currentProtocol.protocolTitle.length > 20
                    ? `${currentProtocol.protocolTitle.slice(0, 20)}...`
                    : currentProtocol.protocolTitle}
                </span>
              </>
            )}
          </div>
        )}
        
        {/* Phase 4: Methodology Status Badges */}
        {methodology && (
          <>
            {/* Study Type Badge */}
            {methodology.studyType && STUDY_METHODOLOGIES[methodology.studyType] && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-blue-400 bg-blue-600 text-white">
                <FlaskConical className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">
                  {STUDY_METHODOLOGIES[methodology.studyType].name}
                </span>
              </div>
            )}
            
            {/* Blinding Status Badge */}
            {methodology.blindingState && methodology.blindingState.protocol !== 'none' && (
              <div className={`
                flex items-center gap-2 px-3 py-1 rounded-full border
                ${methodology.blindingState.isUnblinded 
                  ? 'border-amber-400 bg-amber-600 text-white' 
                  : 'border-indigo-400 bg-indigo-600 text-white'
                }
              `}>
                {methodology.blindingState.isUnblinded ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
                <span className="text-xs font-medium">
                  {getBlindingStatusText(methodology.blindingState)}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Journal Selector (when present) */}
      {onJournalChange && (
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">{t('globalHeader.targetJournal')}</label>
          <select
            value={selectedJournal?.id || ''}
            onChange={(e) => {
              const journal = journalOptions.find(j => j.id === e.target.value);
              if (journal) onJournalChange(journal);
            }}
            className="px-3 py-1.5 text-sm border border-slate-600 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('globalHeader.selectJournal')}</option>
            {journalOptions.map(journal => (
              <option key={journal.id} value={journal.id}>
                {journal.shortName}
                {journal.impactFactor && ` (IF: ${journal.impactFactor})`}
              </option>
            ))}
          </select>
          
          {/* Journal Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Create Custom Journal Button */}
            {onCreateCustomJournal && (
              <button
                onClick={onCreateCustomJournal}
                className="p-2 text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                title={t('globalHeader.createCustomJournal')}
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
            
            {/* Edit Generic Journal Button (only show when Generic is selected) */}
            {onEditGenericJournal && selectedJournal?.id === 'generic' && (
              <button
                onClick={onEditGenericJournal}
                className="p-2 text-purple-400 hover:bg-slate-800 rounded-lg transition-colors"
                title={t('globalHeader.editGenericJournal')}
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Right: Actions (pushed to the right) */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Autonomy Slider - The 3-Tier Selector */}
        <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
          {/* Phase 3: Filter AI modes based on role permissions */}
          {(() => {
            const availableModes = FEATURE_FLAGS.ENABLE_AI_POLICY && governance
              ? governance.availableAIModes
              : ['audit', 'co-pilot', 'pilot'];
            
            const canUseAudit = availableModes.includes('audit');
            const canUseCoPilot = availableModes.includes('co-pilot');
            const canUsePilot = availableModes.includes('pilot');
            
            return (
              <>
                <button
                  onClick={() => canUseAudit && onAutonomyChange('audit')}
                  disabled={!canUseAudit}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                    ${autonomyMode === 'audit' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : canUseAudit
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-600 cursor-not-allowed opacity-50'}
                  `}
                >
                  <Shield className="w-4 h-4" />
                  {t('globalHeader.autonomy.audit')}
                </button>
                
                <button
                  onClick={() => canUseCoPilot && onAutonomyChange('co-pilot')}
                  disabled={!canUseCoPilot}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                    ${autonomyMode === 'co-pilot' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : canUseCoPilot
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-600 cursor-not-allowed opacity-50'}
                  `}
                  title={!canUseCoPilot ? t('globalHeader.autonomy.notAvailableForRole') : undefined}
                >
                  <Users className="w-4 h-4" />
                  {t('globalHeader.autonomy.coPilot')}
                  {!canUseCoPilot && FEATURE_FLAGS.ENABLE_AI_POLICY && (
                    <Lock className="w-3 h-3" />
                  )}
                </button>
                
                <button
                  onClick={() => canUsePilot && onAutonomyChange('pilot')}
                  disabled={!canUsePilot}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                    ${autonomyMode === 'pilot' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : canUsePilot
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-600 cursor-not-allowed opacity-50'}
                  `}
                  title={!canUsePilot ? t('globalHeader.autonomy.notAvailableForRole') : undefined}
                >
                  <Zap className="w-4 h-4" />
                  {t('globalHeader.autonomy.pilot')}
                  {!canUsePilot && FEATURE_FLAGS.ENABLE_AI_POLICY && (
                    <Lock className="w-3 h-3" />
                  )}
                </button>
              </>
            );
          })()}
        </div>
        
        {/* Secondary Actions (Outline style) */}
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

        {/* Primary Action (Solid fill, large) */}
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled || primaryAction.loading || !primaryActionAllowed}
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
                {tCommon('loading')}
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                {primaryAction.label}
              </>
            )}
          </button>
        )}
        
        {/* Language Toggle */}
        <LanguageToggle />
      </div>
    </header>
  );
}