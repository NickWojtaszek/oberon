/**
 * Clinical Capture Wizard
 * Unified workflow: PICO → Validation → Study Design → Schema → Deploy
 *
 * Single source of truth: All data stored in Protocol.studyMethodology
 * Sequential flow with validation at each step
 */

import { useState, useEffect, useRef } from 'react';
import { useProtocol } from '../../contexts/ProtocolContext';
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  FileText,
  Users,
  FlaskConical,
  Table,
  Database,
  Shield,
  Loader2
} from 'lucide-react';
import { PICOCaptureStep } from './steps/PICOCaptureStep';
import { PICOValidationStep } from './steps/PICOValidationStep';
import { StudyDesignStep } from './steps/StudyDesignStep';
import { SchemaBuilderStep } from './steps/SchemaBuilderStep';
import { DeployStep } from './steps/DeployStep';
import type { FoundationalPaperExtraction } from '../../services/geminiService';
import type { SchemaBlock } from '../protocol-workbench/types';

// Workflow steps
type WizardStep =
  | 'pico-capture'
  | 'pico-validation'
  | 'study-design'
  | 'schema-builder'
  | 'dependencies'
  | 'audit'
  | 'final-validation'
  | 'deploy';

interface WizardState {
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  protocolId: string | null;
}

const WIZARD_STEPS: Array<{
  id: WizardStep;
  label: string;
  icon: any;
  required: boolean;
}> = [
  { id: 'pico-capture', label: 'PICO Framework', icon: FileText, required: true },
  { id: 'pico-validation', label: 'PI Approval', icon: Shield, required: true },
  { id: 'study-design', label: 'Study Design', icon: FlaskConical, required: true },
  { id: 'schema-builder', label: 'Schema Builder', icon: Table, required: true },
  { id: 'dependencies', label: 'Dependencies', icon: Users, required: false },
  { id: 'audit', label: 'Audit', icon: CheckCircle2, required: true },
  { id: 'final-validation', label: 'Final Approval', icon: Shield, required: true },
  { id: 'deploy', label: 'Deploy', icon: Database, required: true },
];

export function ClinicalCaptureWizard() {
  const { currentProtocol, updateProtocol, createProtocol } = useProtocol();

  // Wizard workflow state
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 'pico-capture',
    completedSteps: [],
    protocolId: null,
  });

  // Loading state for protocol initialization
  const [isInitializing, setIsInitializing] = useState(true);

  // Track if we've initialized for this protocol to prevent re-initialization
  const initializedProtocolIdRef = useRef<string | null>(null);
  // Track if we're currently creating a protocol to prevent double-creation
  const isCreatingProtocolRef = useRef(false);

  // Initialize wizard with existing protocol or create new - ONLY ONCE
  useEffect(() => {
    // Skip if we've already initialized for this protocol
    if (currentProtocol && initializedProtocolIdRef.current === currentProtocol.id) {
      console.log('[ClinicalCaptureWizard] Already initialized for protocol:', currentProtocol.id, '- skipping');
      setIsInitializing(false);
      return;
    }

    // Skip if we're currently creating a protocol
    if (isCreatingProtocolRef.current) {
      console.log('[ClinicalCaptureWizard] Protocol creation in progress - skipping');
      return;
    }

    const initializeWizard = async () => {
      setIsInitializing(true);

      if (currentProtocol) {
        // Load existing protocol state - only on FIRST load for this protocol
        console.log('[ClinicalCaptureWizard] First load for protocol:', currentProtocol.id);
        initializedProtocolIdRef.current = currentProtocol.id;

        // Only set completedSteps from protocol, don't override currentStep
        // This allows local navigation to work without being reset
        setWizardState(prev => ({
          ...prev,
          protocolId: currentProtocol.id,
          completedSteps: currentProtocol.studyMethodology?.workflowState?.completedSteps || [],
        }));
        setIsInitializing(false);
      } else {
        // No protocol exists - create draft protocol for wizard
        console.log('[ClinicalCaptureWizard] No protocol found, creating draft...');
        isCreatingProtocolRef.current = true;

        try {
          const newProtocol = await createProtocol({
            protocolTitle: 'Draft Protocol',
            protocolNumber: `DRAFT-${Date.now()}`,
            principalInvestigator: 'Unknown',
            status: 'draft' as const,
            studyMethodology: {
              studyType: 'rct',
              configuredAt: new Date().toISOString(),
              configuredBy: 'current-user',
              workflowState: {
                currentStep: 'pico-capture',
                completedSteps: [],
              },
            },
          });

          console.log('[ClinicalCaptureWizard] Draft protocol created:', newProtocol.id);
          initializedProtocolIdRef.current = newProtocol.id;
        } finally {
          isCreatingProtocolRef.current = false;
          setIsInitializing(false);
        }
      }
    };

    initializeWizard();
  }, [currentProtocol?.id, createProtocol]);

  // Handle PICO capture completion
  const handlePICOComplete = (data: {
    rawObservation: string;
    picoFields: {
      population: string;
      intervention: string;
      comparison: string;
      outcome: string;
      timeframe?: string;
    };
    foundationalPapers: FoundationalPaperExtraction[];
  }) => {
    if (!currentProtocol) {
      console.error('[ClinicalCaptureWizard] No protocol available - this should not happen');
      return;
    }

    if (currentProtocol) {
      // Save PICO data to protocol
      updateProtocol(currentProtocol.id, {
        studyMethodology: {
          ...currentProtocol.studyMethodology,
          hypothesis: data.rawObservation,
          picoFields: data.picoFields,
          foundationalPapers: data.foundationalPapers,
          workflowState: {
            currentStep: 'pico-capture',
            completedSteps: [...(currentProtocol.studyMethodology?.workflowState?.completedSteps || []), 'pico-capture'],
          },
        },
      });

      // Advance to next step
      completeStep('pico-capture');
      const currentIndex = WIZARD_STEPS.findIndex(s => s.id === 'pico-capture');
      if (currentIndex < WIZARD_STEPS.length - 1) {
        goToStep(WIZARD_STEPS[currentIndex + 1].id);
      }
    }
  };

  // Handle PICO validation approval
  const handlePICOApproval = () => {
    if (currentProtocol) {
      // Mark validation step as complete
      completeStep('pico-validation');

      // Save approval status to protocol
      updateProtocol(currentProtocol.id, {
        studyMethodology: {
          ...currentProtocol.studyMethodology,
          piApprovalStatus: 'approved',
          piApprovalDate: new Date().toISOString(),
          workflowState: {
            ...currentProtocol.studyMethodology?.workflowState,
            completedSteps: [
              ...(currentProtocol.studyMethodology?.workflowState?.completedSteps || []),
              'pico-validation',
            ],
          },
        },
      });

      // Advance to study design
      const currentIndex = WIZARD_STEPS.findIndex(s => s.id === 'pico-validation');
      if (currentIndex < WIZARD_STEPS.length - 1) {
        goToStep(WIZARD_STEPS[currentIndex + 1].id);
      }
    }
  };

  // Handle PICO validation rejection
  const handlePICORejection = (reason: string) => {
    if (currentProtocol) {
      // Save rejection status
      updateProtocol(currentProtocol.id, {
        studyMethodology: {
          ...currentProtocol.studyMethodology,
          piApprovalStatus: 'rejected',
          piRejectionReason: reason,
          piRejectionDate: new Date().toISOString(),
        },
      });

      // Go back to PICO capture for editing
      goToStep('pico-capture');
    }
  };

  // Handle back to PICO edit
  const handleBackToPICOEdit = () => {
    goToStep('pico-capture');
  };

  // Handle study design completion
  const handleStudyDesignComplete = (data: {
    studyType: string;
    rctConfig?: any;
  }) => {
    if (currentProtocol) {
      // Save study design to protocol
      updateProtocol(currentProtocol.id, {
        studyMethodology: {
          ...currentProtocol.studyMethodology,
          studyType: data.studyType as any,
          rctConfig: data.rctConfig,
          workflowState: {
            ...currentProtocol.studyMethodology?.workflowState,
            completedSteps: [
              ...(currentProtocol.studyMethodology?.workflowState?.completedSteps || []),
              'study-design',
            ],
          },
        },
      });

      // Mark step complete and advance
      completeStep('study-design');
      const currentIndex = WIZARD_STEPS.findIndex(s => s.id === 'study-design');
      if (currentIndex < WIZARD_STEPS.length - 1) {
        goToStep(WIZARD_STEPS[currentIndex + 1].id);
      }
    }
  };

  // Handle schema builder completion
  const handleSchemaBuilderComplete = (data: { schemaBlocks: SchemaBlock[] }) => {
    if (currentProtocol) {
      // Save schema to protocol (will create first version if needed)
      updateProtocol(currentProtocol.id, {
        schemaBlocks: data.schemaBlocks,
        studyMethodology: {
          ...currentProtocol.studyMethodology,
          workflowState: {
            ...currentProtocol.studyMethodology?.workflowState,
            completedSteps: [
              ...(currentProtocol.studyMethodology?.workflowState?.completedSteps || []),
              'schema-builder',
            ],
          },
        },
      });

      // Mark step complete and advance
      completeStep('schema-builder');
      const currentIndex = WIZARD_STEPS.findIndex(s => s.id === 'schema-builder');
      if (currentIndex < WIZARD_STEPS.length - 1) {
        goToStep(WIZARD_STEPS[currentIndex + 1].id);
      }
    }
  };

  // Handle deploy completion
  const handleDeployComplete = () => {
    if (currentProtocol) {
      // Mark protocol as deployed
      updateProtocol(currentProtocol.id, {
        studyMethodology: {
          ...currentProtocol.studyMethodology,
          deploymentStatus: 'deployed',
          deploymentDate: new Date().toISOString(),
          workflowState: {
            ...currentProtocol.studyMethodology?.workflowState,
            completedSteps: [
              ...(currentProtocol.studyMethodology?.workflowState?.completedSteps || []),
              'deploy',
            ],
          },
        },
      });

      // Mark as complete
      completeStep('deploy');
    }
  };

  // Mark step as completed
  const completeStep = (step: WizardStep) => {
    setWizardState(prev => {
      const newCompletedSteps = [...prev.completedSteps];
      if (!newCompletedSteps.includes(step)) {
        newCompletedSteps.push(step);
      }

      // Save to protocol
      if (currentProtocol) {
        updateProtocol(currentProtocol.id, {
          studyMethodology: {
            ...currentProtocol.studyMethodology,
            workflowState: {
              currentStep: step,
              completedSteps: newCompletedSteps,
            },
          },
        });
      }

      return {
        ...prev,
        completedSteps: newCompletedSteps,
      };
    });
  };

  // Navigate to step
  const goToStep = (step: WizardStep) => {
    setWizardState(prev => ({ ...prev, currentStep: step }));
  };

  // Get step status
  const getStepStatus = (step: WizardStep): 'completed' | 'current' | 'upcoming' => {
    if (wizardState.completedSteps.includes(step)) return 'completed';
    if (wizardState.currentStep === step) return 'current';
    return 'upcoming';
  };

  // Calculate progress percentage
  const progressPercentage = Math.round(
    (wizardState.completedSteps.length / WIZARD_STEPS.filter(s => s.required).length) * 100
  );

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header with progress */}
      <div className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Clinical Capture Wizard</h1>
            <p className="text-sm text-slate-600 mt-1">
              {currentProtocol?.protocolTitle || 'New Protocol'} • {currentProtocol?.protocolNumber || 'Draft'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{progressPercentage}%</div>
            <div className="text-xs text-slate-600">Complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step navigation */}
      <div className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {WIZARD_STEPS.map((step, index) => {
            const status = getStepStatus(step.id);
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => goToStep(step.id)}
                  disabled={status === 'upcoming'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    status === 'completed'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : status === 'current'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 ring-2 ring-blue-300 ring-offset-2'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  }`}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                  <Icon className="w-4 h-4" />
                  <span>{step.label}</span>
                  {!step.required && (
                    <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Optional</span>
                  )}
                </button>
                {index < WIZARD_STEPS.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-slate-300 mx-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          {isInitializing ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-slate-600">Initializing wizard...</p>
              </div>
            </div>
          ) : (
            <>
              {wizardState.currentStep === 'pico-capture' && currentProtocol && (
                <PICOCaptureStep
              key={currentProtocol.id}
              onComplete={handlePICOComplete}
              initialData={{
                rawObservation: currentProtocol?.studyMethodology?.hypothesis || '',
                picoFields: currentProtocol?.studyMethodology?.picoFields,
                foundationalPapers: currentProtocol?.studyMethodology?.foundationalPapers,
              }}
            />
          )}

          {wizardState.currentStep === 'pico-validation' && currentProtocol?.studyMethodology && (
            <PICOValidationStep
              picoData={{
                rawObservation: currentProtocol.studyMethodology.hypothesis || '',
                picoFields: currentProtocol.studyMethodology.picoFields || {
                  population: '',
                  intervention: '',
                  comparison: '',
                  outcome: '',
                },
                foundationalPapers: currentProtocol.studyMethodology.foundationalPapers || [],
              }}
              onApprove={handlePICOApproval}
              onReject={handlePICORejection}
              onBackToEdit={handleBackToPICOEdit}
              userRole="pi"
            />
          )}

          {wizardState.currentStep === 'study-design' && (
            <StudyDesignStep
              onComplete={handleStudyDesignComplete}
              initialData={{
                studyType: currentProtocol?.studyMethodology?.studyType as any,
                rctConfig: currentProtocol?.studyMethodology?.rctConfig,
              }}
            />
          )}

          {wizardState.currentStep === 'schema-builder' && (
            <SchemaBuilderStep
              onComplete={handleSchemaBuilderComplete}
              initialData={{
                schemaBlocks: currentProtocol?.schemaBlocks,
              }}
              picoContext={currentProtocol?.studyMethodology?.picoFields}
            />
          )}

          {wizardState.currentStep === 'deploy' && currentProtocol && (
            <DeployStep
              onComplete={handleDeployComplete}
              protocolSummary={{
                protocolTitle: currentProtocol.protocolTitle || 'Untitled Protocol',
                protocolNumber: currentProtocol.protocolNumber || 'N/A',
                studyType: currentProtocol.studyMethodology?.studyType || 'Not specified',
                fieldCount: currentProtocol.schemaBlocks?.length || 0,
                picoComplete: !!currentProtocol.studyMethodology?.picoFields?.population,
                schemaComplete: (currentProtocol.schemaBlocks?.length || 0) > 0,
              }}
            />
          )}

          {wizardState.currentStep !== 'pico-capture' &&
           wizardState.currentStep !== 'pico-validation' &&
           wizardState.currentStep !== 'study-design' &&
           wizardState.currentStep !== 'schema-builder' &&
           wizardState.currentStep !== 'deploy' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {WIZARD_STEPS.find(s => s.id === wizardState.currentStep)?.label}
              </h2>
              <p className="text-slate-600">
                Step content will be rendered here based on current step: <strong>{wizardState.currentStep}</strong>
              </p>

              {/* Demo: Complete step button */}
              <div className="mt-8 flex items-center gap-4">
                <button
                  onClick={() => {
                    completeStep(wizardState.currentStep);
                    // Auto-advance to next step
                    const currentIndex = WIZARD_STEPS.findIndex(s => s.id === wizardState.currentStep);
                    if (currentIndex < WIZARD_STEPS.length - 1) {
                      goToStep(WIZARD_STEPS[currentIndex + 1].id);
                    }
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Complete & Continue
                </button>
                <span className="text-sm text-slate-600">
                  {wizardState.completedSteps.length} of {WIZARD_STEPS.filter(s => s.required).length} required steps completed
                </span>
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
