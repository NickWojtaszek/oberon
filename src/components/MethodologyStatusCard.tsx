/**
 * Methodology Status Card
 * Shows current study configuration on the dashboard
 */

import { FlaskConical, Users, EyeOff, Eye, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { useProject } from '../contexts/ProtocolContext';
import { STUDY_METHODOLOGIES } from '../config/studyMethodology';
import { StatusBadge, RigorBadge } from './ui/StatusBadge';
import { useTranslation } from 'react-i18next';

interface MethodologyStatusCardProps {
  onConfigure?: () => void;
}

export function MethodologyStatusCard({ onConfigure }: MethodologyStatusCardProps) {
  const { currentProject } = useProject();
  const methodology = currentProject?.studyMethodology;
  const { t } = useTranslation('dashboard');

  // Not configured yet
  if (!methodology) {
    return (
      <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FlaskConical className="w-6 h-6 text-slate-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-slate-900 mb-1">
              {t('methodologyStatus.notConfigured')}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {t('methodologyStatus.notConfiguredDescription')}
            </p>
            <button
              onClick={onConfigure}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              {t('methodologyStatus.configureButton')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const studyConfig = STUDY_METHODOLOGIES[methodology.studyType];
  const blindingState = methodology.blindingState;
  const teamConfig = methodology.teamConfiguration;

  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FlaskConical className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-slate-900 mb-1">
              {t('methodologyStatus.title')}
            </h3>
            <p className="text-sm text-slate-600">
              {t('methodologyStatus.configuredAt', { 
                date: new Date(methodology.configuredAt).toLocaleDateString() 
              })}
            </p>
          </div>
        </div>
        <button
          onClick={onConfigure}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title={t('methodologyStatus.reconfigure')}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Study Type */}
      <div className="mb-6">
        <h4 className="text-xs font-medium text-slate-700 mb-3 uppercase tracking-wider">
          {t('methodologyStatus.studyDesign')}
        </h4>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium text-blue-900">
              {studyConfig.name}
            </div>
            <RigorBadge level={studyConfig.rigorLevel} size="xs" />
          </div>
          <p className="text-sm text-blue-800">
            {studyConfig.description}
          </p>
        </div>
      </div>

      {/* Team Configuration */}
      {teamConfig && (
        <div className="mb-6">
          <h4 className="text-xs font-medium text-slate-700 mb-3 uppercase tracking-wider">
            {t('methodologyStatus.teamConfiguration')}
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t('methodologyStatus.assignedPersonas')}
              </span>
              <span className="font-medium text-slate-900">
                {t('methodologyStatus.rolesCount', { count: teamConfig.assignedPersonas.length })}
              </span>
            </div>
            {teamConfig.locked && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                <CheckCircle className="w-4 h-4" />
                <span>{t('methodologyStatus.teamConfigLocked')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Blinding Status */}
      {blindingState && blindingState.protocol !== 'none' && (
        <div>
          <h4 className="text-xs font-medium text-slate-700 mb-3 uppercase tracking-wider">
            {t('methodologyStatus.blindingProtocol')}
          </h4>
          <div className={`
            rounded-lg p-4 border
            ${blindingState.isUnblinded 
              ? 'bg-amber-50 border-amber-200' 
              : 'bg-indigo-50 border-indigo-200'
            }
          `}>
            <div className="flex items-center gap-3 mb-2">
              {blindingState.isUnblinded ? (
                <Eye className="w-5 h-5 text-amber-600" />
              ) : (
                <EyeOff className="w-5 h-5 text-indigo-600" />
              )}
              <div className="flex-1">
                <div className={`font-medium ${
                  blindingState.isUnblinded ? 'text-amber-900' : 'text-indigo-900'
                }`}>
                  {blindingState.isUnblinded ? t('methodologyStatus.studyUnblinded') : blindingState.protocol}
                </div>
                {blindingState.isUnblinded && blindingState.unblindedAt && (
                  <div className="text-xs text-amber-700 mt-1">
                    {t('methodologyStatus.unblindedAt', { 
                      date: new Date(blindingState.unblindedAt).toLocaleString() 
                    })}
                  </div>
                )}
              </div>
              <StatusBadge 
                variant={blindingState.isUnblinded ? 'warning' : 'indigo'} 
                size="xs"
              >
                {blindingState.isUnblinded ? t('methodologyStatus.unblinded') : t('methodologyStatus.active')}
              </StatusBadge>
            </div>
            
            {blindingState.isUnblinded && blindingState.unblindingReason && (
              <div className="text-sm text-amber-800 mt-3 pt-3 border-t border-amber-200">
                <div className="font-medium mb-1">{t('methodologyStatus.unblindingReason')}</div>
                <div>{blindingState.unblindingReason}</div>
              </div>
            )}
            
            {!blindingState.isUnblinded && (
              <div className="text-xs text-indigo-700 mt-2">
                {t('methodologyStatus.personasBlinded', { 
                  count: teamConfig?.assignedPersonas.filter(p => p.blinded).length || 0 
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hypothesis (if available) */}
      {methodology.hypothesis && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h4 className="text-xs font-medium text-slate-700 mb-2 uppercase tracking-wider">
            {t('methodologyStatus.researchQuestion')}
          </h4>
          <p className="text-sm text-slate-800 italic">
            "{methodology.hypothesis.researchQuestion}"
          </p>
        </div>
      )}
    </div>
  );
}