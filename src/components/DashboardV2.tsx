import { CheckCircle2, Circle, Lock, ArrowRight, TrendingUp, LayoutDashboard } from 'lucide-react';
import { calculateWorkflowProgress } from '../utils/workflowProgress';
import { useProject } from '../contexts/ProtocolContext';
import type { WorkflowStepDetails } from '../utils/workflowProgress';
import { MethodologyStatusCard } from './MethodologyStatusCard';
import { ContentContainer } from './ui/ContentContainer';
import { EmptyState } from './ui/EmptyState';
import { useTranslation } from 'react-i18next';

interface DashboardV2Props {
  onNavigate: (tab: string) => void;
}

export function DashboardV2({ onNavigate }: DashboardV2Props) {
  const { currentProject } = useProject();
  const workflow = calculateWorkflowProgress(onNavigate, currentProject?.id);
  const { t } = useTranslation('dashboard');

  return (
    <div className="flex flex-col h-full">
      {/* Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <ContentContainer className="space-y-6">
          {currentProject ? (
            <>
              {/* Overall Progress */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                      <h2 className="text-xl text-slate-900">{t('studyProgress.title')}</h2>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      {t('studyProgress.stepsCompleted', { 
                        completed: workflow.completedSteps, 
                        total: workflow.steps.length 
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-semibold text-blue-600">
                      {Math.round(workflow.overallProgress)}%
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{t('studyProgress.percentComplete')}</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-blue-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${workflow.overallProgress}%` }}
                  />
                </div>
              </div>

              {/* Phase 4: Methodology Status Card */}
              <MethodologyStatusCard
                onConfigure={() => onNavigate('project-setup')}
              />

              {/* Workflow Steps */}
              <div className="space-y-4">
                {workflow.steps.map((step, index) => (
                  <WorkflowStepCard
                    key={step.id}
                    step={step}
                    stepNumber={index + 1}
                    isCurrentStep={step.id === workflow.currentStep}
                  />
                ))}
              </div>

              {/* Help Section */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-sm font-medium text-slate-900 mb-3">{t('quickAccess.title')}</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <button
                    onClick={() => onNavigate('ethics')}
                    className="text-left p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="text-slate-900 mb-1 font-medium">🛡️ {t('quickAccess.ethicsIRB.title')}</div>
                    <div className="text-xs text-slate-500">
                      {t('quickAccess.ethicsIRB.description')}
                    </div>
                  </button>
                  <button
                    onClick={() => onNavigate('governance')}
                    className="text-left p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="text-slate-900 mb-1 font-medium">🔒 {t('quickAccess.governance.title')}</div>
                    <div className="text-xs text-slate-500">
                      {t('quickAccess.governance.description')}
                    </div>
                  </button>
                  <button
                    onClick={() => onNavigate('methodology')}
                    className="text-left p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="text-slate-900 mb-1 font-medium">📖 {t('quickAccess.methodology.title')}</div>
                    <div className="text-xs text-slate-500">
                      {t('quickAccess.methodology.description')}
                    </div>
                  </button>
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-sm font-medium text-slate-900 mb-3">{t('needHelp.title')}</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-slate-600 mb-1">📖 {t('needHelp.documentation.title')}</div>
                    <div className="text-xs text-slate-500">
                      {t('needHelp.documentation.description')}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-1">💡 {t('needHelp.quickStart.title')}</div>
                    <div className="text-xs text-slate-500">
                      {t('needHelp.quickStart.description')}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-1">🆘 {t('needHelp.support.title')}</div>
                    <div className="text-xs text-slate-500">
                      {t('needHelp.support.description')}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center min-h-[calc(100vh-250px)]">
              <EmptyState
                preset="noProjectSelected"
                onAction={() => onNavigate('protocol-library')}
                size="md"
              />
            </div>
          )}
        </ContentContainer>
      </div>
    </div>
  );
}

interface WorkflowStepCardProps {
  step: WorkflowStepDetails;
  stepNumber: number;
  isCurrentStep: boolean;
}

function WorkflowStepCard({ step, stepNumber, isCurrentStep }: WorkflowStepCardProps) {
  const { t } = useTranslation('dashboard');
  
  // Determine card styling based on status
  const getStatusConfig = () => {
    switch (step.status) {
      case 'complete':
        return {
          borderColor: 'border-green-200',
          bgColor: 'bg-white',
          iconBgColor: 'bg-green-50',
          iconColor: 'text-green-600',
          statusBadge: (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t('workflowSteps.complete')}
            </div>
          ),
          icon: <CheckCircle2 className="w-6 h-6" />,
        };
      case 'in-progress':
        return {
          borderColor: isCurrentStep ? 'border-blue-300 ring-2 ring-blue-100' : 'border-blue-200',
          bgColor: isCurrentStep ? 'bg-blue-50/30' : 'bg-white',
          iconBgColor: 'bg-blue-50',
          iconColor: 'text-blue-600',
          statusBadge: (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
              <Circle className="w-3.5 h-3.5 fill-blue-600" />
              {t('workflowSteps.inProgress')}
            </div>
          ),
          icon: <Circle className="w-6 h-6 fill-current" />,
        };
      case 'not-started':
        return {
          borderColor: 'border-slate-200',
          bgColor: 'bg-white',
          iconBgColor: 'bg-slate-50',
          iconColor: 'text-slate-400',
          statusBadge: (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-medium">
              <Circle className="w-3.5 h-3.5" />
              {t('workflowSteps.notStarted')}
            </div>
          ),
          icon: <Circle className="w-6 h-6" />,
        };
      case 'locked':
      default:
        return {
          borderColor: 'border-slate-200',
          bgColor: 'bg-slate-50',
          iconBgColor: 'bg-slate-100',
          iconColor: 'text-slate-400',
          statusBadge: (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-medium">
              <Lock className="w-3.5 h-3.5" />
              {t('workflowSteps.locked')}
            </div>
          ),
          icon: <Lock className="w-6 h-6" />,
        };
    }
  };

  const config = getStatusConfig();
  const isLocked = step.status === 'locked' || !step.unlocked;

  return (
    <div
      className={`border ${config.borderColor} ${config.bgColor} rounded-xl p-6 transition-all ${
        isCurrentStep ? 'shadow-md' : 'hover:shadow-sm'
      } ${isLocked ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-6">
        {/* Step Number & Icon */}
        <div className="flex-shrink-0">
          <div className={`w-14 h-14 rounded-xl ${config.iconBgColor} ${config.iconColor} flex items-center justify-center`}>
            {config.icon}
          </div>
          <div className="text-center mt-2">
            <div className="text-xs font-medium text-slate-500">{t('workflowSteps.stepLabel', { number: stepNumber })}</div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-medium text-slate-900">{step.title}</h3>
                {isCurrentStep && (
                  <div className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded">
                    {t('workflowSteps.currentStep')}
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-600">{step.description}</p>
            </div>
            {config.statusBadge}
          </div>

          {/* Progress Bar for In Progress items */}
          {step.status === 'in-progress' && step.progress > 0 && step.progress < 100 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-xs text-slate-600">{t('workflowSteps.progress')}</div>
                <div className="text-xs font-medium text-slate-700">{step.progress}%</div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${step.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Details */}
          <div className="flex flex-wrap gap-3 mb-4">
            {step.details.map((detail, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg"
              >
                <div className="w-1 h-1 bg-slate-400 rounded-full" />
                {detail}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {step.actions.map((action, idx) => {
              const isPrimary = action.variant === 'primary';
              return (
                <button
                  key={idx}
                  onClick={action.onClick}
                  disabled={isLocked && isPrimary}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      isPrimary
                        ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 disabled:cursor-not-allowed'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                    }
                  `}
                >
                  {action.label}
                  {isPrimary && !isLocked && <ArrowRight className="w-4 h-4" />}
                </button>
              );
            })}
          </div>

          {/* Locked Message */}
          {isLocked && step.status === 'not-started' && (
            <div className="mt-3 text-xs text-slate-500 italic">
              Complete previous steps to unlock this section
            </div>
          )}
        </div>
      </div>
    </div>
  );
}