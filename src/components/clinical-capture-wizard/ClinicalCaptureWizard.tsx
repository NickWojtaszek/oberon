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
  Loader2,
  ClipboardList,
  Send
} from 'lucide-react';
import { PICOCaptureStep } from './steps/PICOCaptureStep';
import { PICOValidationStep } from './steps/PICOValidationStep';
import { StudyDesignStep } from './steps/StudyDesignStep';
import { SchemaBuilderStep } from './steps/SchemaBuilderStep';
import { ProtocolDetailsStep, type ProtocolDetailsData } from './steps/ProtocolDetailsStep';
import { ReviewPublishStep } from './steps/ReviewPublishStep';
import { DeployStep } from './steps/DeployStep';
import type { FoundationalPaperExtraction } from '../../services/geminiService';
import type { SchemaBlock } from '../protocol-workbench/types';

interface ClinicalCaptureWizardProps {
  onNavigateToDatabase?: (protocolId?: string, versionId?: string) => void;
}

// Workflow steps
type WizardStep =
  | 'pico-capture'
  | 'pico-validation'
  | 'study-design'
  | 'schema-builder'
  | 'dependencies'
  | 'protocol-details'
  | 'review-publish'
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
  { id: 'protocol-details', label: 'Protocol Details', icon: ClipboardList, required: true },
  { id: 'review-publish', label: 'Review & Publish', icon: Send, required: true },
  { id: 'deploy', label: 'Deploy', icon: Database, required: true },
];

export function ClinicalCaptureWizard({ onNavigateToDatabase }: ClinicalCaptureWizardProps = {}) {
  const { currentProtocol, currentVersion, updateProtocol, createProtocol, saveSchemaBlocks, updateVersionStatus } = useProtocol();

  // ============================================
  // STATE MANAGEMENT - Separated by concern
  // ============================================

  // 1. Navigation state - changes when user navigates
  const [currentStep, setCurrentStep] = useState<WizardStep>('pico-capture');
  const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([]);

  // 2. Initialization tracking - stable after first load
  const [isInitializing, setIsInitializing] = useState(true);
  const hasInitializedRef = useRef(false);
  const initializedForProtocolRef = useRef<string | null>(null);

  // Legacy wizardState for compatibility (will be removed)
  const wizardState: WizardState = {
    currentStep,
    completedSteps,
    protocolId: currentProtocol?.id || null,
  };

  // ============================================
  // INITIALIZATION - Runs ONCE per protocol
  // ============================================
  useEffect(() => {
    // Already initialized for this exact protocol - do nothing
    if (currentProtocol && initializedForProtocolRef.current === currentProtocol.id) {
      if (isInitializing) setIsInitializing(false);
      return;
    }

    // Currently creating a protocol - wait
    if (hasInitializedRef.current && !currentProtocol) {
      return;
    }

    const initialize = async () => {
      if (currentProtocol) {
        // Protocol exists - load its state ONCE
        console.log('[ClinicalCaptureWizard] Initializing for protocol:', currentProtocol.id);
        initializedForProtocolRef.current = currentProtocol.id;
        hasInitializedRef.current = true;

        // Load completed steps from protocol (but NOT currentStep - that's local)
        const savedSteps = currentProtocol.studyMethodology?.workflowState?.completedSteps || [];
        setCompletedSteps(savedSteps);

        setIsInitializing(false);
      } else if (!hasInitializedRef.current) {
        // No protocol and haven't tried creating one yet
        console.log('[ClinicalCaptureWizard] Creating draft protocol...');
        hasInitializedRef.current = true;

        try {
          await createProtocol({
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
          // useEffect will run again when currentProtocol updates
        } catch (error) {
          console.error('[ClinicalCaptureWizard] Failed to create protocol:', error);
          setIsInitializing(false);
        }
      }
    };

    initialize();
  }, [currentProtocol?.id, createProtocol]);

  // ============================================
  // NAVIGATION HELPERS
  // ============================================
  const goToStep = (step: WizardStep) => {
    console.log('[ClinicalCaptureWizard] goToStep:', step);
    setCurrentStep(step);
  };

  const completeStep = (step: WizardStep) => {
    console.log('[ClinicalCaptureWizard] completeStep:', step);
    setCompletedSteps(prev => {
      if (prev.includes(step)) return prev;
      const newSteps = [...prev, step];

      // Persist to protocol
      if (currentProtocol) {
        updateProtocol(currentProtocol.id, {
          studyMethodology: {
            ...currentProtocol.studyMethodology,
            workflowState: {
              ...currentProtocol.studyMethodology?.workflowState,
              completedSteps: newSteps,
            },
          },
        });
      }

      return newSteps;
    });
  };

  // Legacy setWizardState for compatibility
  const setWizardState = (updater: (prev: WizardState) => WizardState) => {
    const newState = updater(wizardState);
    if (newState.currentStep !== currentStep) {
      setCurrentStep(newState.currentStep);
    }
    if (JSON.stringify(newState.completedSteps) !== JSON.stringify(completedSteps)) {
      setCompletedSteps(newState.completedSteps);
    }
  };

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
      console.error('[ClinicalCaptureWizard] No protocol available');
      return;
    }

    console.log('[ClinicalCaptureWizard] handlePICOComplete - saving PICO data');

    // Save PICO data to protocol (without workflowState - completeStep handles that)
    updateProtocol(currentProtocol.id, {
      studyMethodology: {
        ...currentProtocol.studyMethodology,
        hypothesis: data.rawObservation,
        picoFields: data.picoFields,
        foundationalPapers: data.foundationalPapers,
      },
    });

    // Mark step complete and navigate
    completeStep('pico-capture');
    goToStep('pico-validation');
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
      // Save schema blocks to the CURRENT VERSION (not protocol level!)
      // This is required for Database module to generate tables correctly
      saveSchemaBlocks(currentProtocol.id, data.schemaBlocks);

      // Update workflow state separately
      updateProtocol(currentProtocol.id, {
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

  // Handle protocol details completion
  const handleProtocolDetailsComplete = (data: ProtocolDetailsData) => {
    if (currentProtocol) {
      // Save protocol details
      updateProtocol(currentProtocol.id, {
        protocolTitle: data.protocolTitle,
        protocolNumber: data.protocolNumber,
        principalInvestigator: data.principalInvestigator,
        studyMethodology: {
          ...currentProtocol.studyMethodology,
          institution: data.institution,
          sponsor: data.sponsor,
          irbNumber: data.irbNumber,
          irbApprovalDate: data.irbApprovalDate,
          studyStartDate: data.studyStartDate,
          estimatedEndDate: data.estimatedEndDate,
          versionNotes: data.versionNotes,
          workflowState: {
            ...currentProtocol.studyMethodology?.workflowState,
            completedSteps: [
              ...(currentProtocol.studyMethodology?.workflowState?.completedSteps || []),
              'protocol-details',
            ],
          },
        },
      });

      // Mark step complete and advance
      completeStep('protocol-details');
      goToStep('review-publish');
    }
  };

  // Handle protocol publish
  const handlePublish = () => {
    if (currentProtocol && currentVersion) {
      // Update protocol status to published
      updateProtocol(currentProtocol.id, {
        status: 'published' as const,
        studyMethodology: {
          ...currentProtocol.studyMethodology,
          publishedAt: new Date().toISOString(),
          publishedBy: 'current-user',
          workflowState: {
            ...currentProtocol.studyMethodology?.workflowState,
            completedSteps: [
              ...(currentProtocol.studyMethodology?.workflowState?.completedSteps || []),
              'review-publish',
            ],
          },
        },
      });

      // CRITICAL: Also update the VERSION status to published
      // This is what DataEntryView checks to allow data entry
      updateVersionStatus(currentProtocol.id, currentVersion.id, 'published');

      // Mark step complete and advance to deploy
      completeStep('review-publish');
      goToStep('deploy');
    }
  };

  // Handle back navigation from review step
  const handleBackFromReview = (targetStep: string) => {
    goToStep(targetStep as WizardStep);
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
                schemaBlocks: currentVersion?.schemaBlocks,
              }}
              picoContext={currentProtocol?.studyMethodology?.picoFields}
            />
          )}

          {wizardState.currentStep === 'protocol-details' && currentProtocol && (
            <ProtocolDetailsStep
              onComplete={handleProtocolDetailsComplete}
              initialData={{
                protocolTitle: currentProtocol.protocolTitle,
                protocolNumber: currentProtocol.protocolNumber,
                principalInvestigator: currentProtocol.principalInvestigator,
                institution: currentProtocol.studyMethodology?.institution,
                sponsor: currentProtocol.studyMethodology?.sponsor,
                irbNumber: currentProtocol.studyMethodology?.irbNumber,
                irbApprovalDate: currentProtocol.studyMethodology?.irbApprovalDate,
                studyStartDate: currentProtocol.studyMethodology?.studyStartDate,
                estimatedEndDate: currentProtocol.studyMethodology?.estimatedEndDate,
                versionNotes: currentProtocol.studyMethodology?.versionNotes,
              }}
              picoSummary={{
                population: currentProtocol.studyMethodology?.picoFields?.population || '',
                intervention: currentProtocol.studyMethodology?.picoFields?.intervention || '',
                outcome: currentProtocol.studyMethodology?.picoFields?.outcome || '',
              }}
            />
          )}

          {wizardState.currentStep === 'review-publish' && currentProtocol && (
            <ReviewPublishStep
              onPublish={handlePublish}
              onBack={handleBackFromReview}
              protocolDetails={{
                protocolTitle: currentProtocol.protocolTitle || '',
                protocolNumber: currentProtocol.protocolNumber || '',
                principalInvestigator: currentProtocol.principalInvestigator || '',
                institution: currentProtocol.studyMethodology?.institution || '',
                sponsor: currentProtocol.studyMethodology?.sponsor,
                irbNumber: currentProtocol.studyMethodology?.irbNumber,
                irbApprovalDate: currentProtocol.studyMethodology?.irbApprovalDate,
                studyStartDate: currentProtocol.studyMethodology?.studyStartDate,
                estimatedEndDate: currentProtocol.studyMethodology?.estimatedEndDate,
                versionNotes: currentProtocol.studyMethodology?.versionNotes,
              }}
              summary={{
                picoComplete: !!currentProtocol.studyMethodology?.picoFields?.population,
                picoApproved: currentProtocol.studyMethodology?.piApprovalStatus === 'approved',
                studyDesignComplete: !!currentProtocol.studyMethodology?.studyType,
                schemaComplete: (currentVersion?.schemaBlocks?.length || 0) > 0,
                fieldCount: currentVersion?.schemaBlocks?.length || 0,
                studyType: currentProtocol.studyMethodology?.studyType || 'Not specified',
                population: currentProtocol.studyMethodology?.picoFields?.population,
                intervention: currentProtocol.studyMethodology?.picoFields?.intervention,
                outcome: currentProtocol.studyMethodology?.picoFields?.outcome,
              }}
            />
          )}

          {wizardState.currentStep === 'deploy' && currentProtocol && (
            <DeployStep
              onComplete={handleDeployComplete}
              onNavigateToDatabase={() => {
                if (onNavigateToDatabase) {
                  // Pass protocol and version IDs so Database can auto-select them
                  onNavigateToDatabase(currentProtocol?.id, currentVersion?.id);
                }
              }}
              protocolSummary={{
                protocolTitle: currentProtocol.protocolTitle || 'Untitled Protocol',
                protocolNumber: currentProtocol.protocolNumber || 'N/A',
                studyType: currentProtocol.studyMethodology?.studyType || 'Not specified',
                fieldCount: currentVersion?.schemaBlocks?.length || 0,
                picoComplete: !!currentProtocol.studyMethodology?.picoFields?.population,
                schemaComplete: (currentVersion?.schemaBlocks?.length || 0) > 0,
              }}
            />
          )}

          {/* Fallback for steps without dedicated components (e.g., dependencies) */}
          {wizardState.currentStep !== 'pico-capture' &&
           wizardState.currentStep !== 'pico-validation' &&
           wizardState.currentStep !== 'study-design' &&
           wizardState.currentStep !== 'schema-builder' &&
           wizardState.currentStep !== 'protocol-details' &&
           wizardState.currentStep !== 'review-publish' &&
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
