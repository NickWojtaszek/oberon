/**
 * Wizard Shell Component
 * Reusable multi-step wizard framework
 */

import { ReactNode } from 'react';
import { CheckCircle, Circle } from 'lucide-react';

export interface WizardStep {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  completed?: boolean;
}

interface WizardShellProps {
  steps: WizardStep[];
  currentStepId: string;
  onStepClick?: (stepId: string) => void;
  children: ReactNode;
  allowStepNavigation?: boolean;
}

export function WizardShell({
  steps,
  currentStepId,
  onStepClick,
  children,
  allowStepNavigation = false,
}: WizardShellProps) {
  const currentStepIndex = steps.findIndex(s => s.id === currentStepId);

  const isStepAccessible = (stepIndex: number) => {
    if (!allowStepNavigation) return false;
    // Can only navigate to completed steps or the current step
    return stepIndex <= currentStepIndex || steps[stepIndex - 1]?.completed;
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Progress Steps */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center">
            {steps.map((step, index) => {
              const isCurrent = step.id === currentStepId;
              const isPast = index < currentStepIndex;
              const isAccessible = isStepAccessible(index);
              const isCompleted = step.completed || isPast;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  {/* Step */}
                  <button
                    onClick={() => isAccessible && onStepClick?.(step.id)}
                    disabled={!isAccessible}
                    className={`flex items-center gap-3 transition-all ${
                      isAccessible ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    {/* Circle */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isCurrent
                          ? 'bg-blue-600 ring-4 ring-blue-100'
                          : isCompleted
                          ? 'bg-emerald-600'
                          : 'bg-slate-200'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <span
                          className={`text-sm font-medium ${
                            isCurrent ? 'text-white' : 'text-slate-500'
                          }`}
                        >
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* Label */}
                    <div className="text-left">
                      <div
                        className={`text-sm font-medium transition-colors ${
                          isCurrent
                            ? 'text-blue-600'
                            : isCompleted
                            ? 'text-emerald-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {step.label}
                      </div>
                      {step.description && (
                        <div className="text-xs text-slate-500">
                          {step.description}
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 transition-colors ${
                        isCompleted ? 'bg-emerald-600' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/**
 * Wizard Step Wrapper
 * Provides consistent padding and layout for wizard steps
 */

interface WizardStepContentProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
}

export function WizardStepContent({
  title,
  description,
  icon: Icon,
  children,
  sidebar,
  footer,
}: WizardStepContentProps) {
  return (
    <div className="h-full flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex items-start gap-4">
              {Icon && (
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-7 h-7 text-blue-600" />
                </div>
              )}
              <div>
                <h2 className="text-2xl text-slate-900 mb-2">{title}</h2>
                {description && (
                  <p className="text-slate-600">{description}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1600px] mx-auto">{children}</div>
        </div>

        {/* Footer */}
        {footer && (
          <div className="bg-white border-t border-slate-200 px-8 py-4">
            <div className="max-w-[1600px] mx-auto">{footer}</div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      {sidebar && (
        <div className="w-96 bg-white border-l border-slate-200 flex flex-col overflow-y-auto">
          {sidebar}
        </div>
      )}
    </div>
  );
}
