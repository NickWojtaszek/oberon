/**
 * Unified Project Setup Wizard
 * Combines Study Type Selection → Team Configuration → Hypothesis Formation
 */

import { useState } from 'react';
import { WizardShell, WizardStep } from './WizardShell';
import { StudyTypeSelector } from './steps/StudyTypeSelector';
import { TeamConfiguration as TeamConfigStep } from './steps/TeamConfiguration';
import { HypothesisFormation } from './steps/HypothesisFormation';
import { StudyType } from '../../config/studyMethodology';
import { TeamConfiguration } from '../methodology/TeamDNAConfigurator';
import { useProject } from '../../contexts/ProtocolContext';

interface ProjectSetupWizardProps {
  onComplete?: (project: CompleteProjectSetup) => void;
  onCancel?: () => void;
}

export interface CompleteProjectSetup {
  studyType: StudyType;
  teamConfiguration: TeamConfiguration;
  hypothesis: {
    picoFramework: {
      population: string;
      intervention: string;
      comparison: string;
      outcome: string;
    };
    researchQuestion: string;
    variables: Array<{
      name: string;
      type: string;
      grounded: boolean;
      boundTo?: string;
    }>;
  };
  timestamp: string;
}

export function ProjectSetupWizard({ onComplete, onCancel }: ProjectSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState<string>('study-type');
  
  // Project state
  const [selectedStudyType, setSelectedStudyType] = useState<StudyType | null>(null);
  const [teamConfig, setTeamConfig] = useState<TeamConfiguration | null>(null);
  const [hypothesis, setHypothesis] = useState<any>(null);

  const steps: WizardStep[] = [
    {
      id: 'study-type',
      label: 'Study Design',
      description: 'Select methodology',
      completed: !!selectedStudyType,
      required: true,
    },
    {
      id: 'team-config',
      label: 'Team Configuration',
      description: 'Define roles & blinding',
      completed: !!teamConfig,
      required: true,
    },
    {
      id: 'hypothesis',
      label: 'Research Hypothesis',
      description: 'PICO framework',
      completed: !!hypothesis,
      required: true,
    },
  ];

  const handleStudyTypeComplete = (studyType: StudyType) => {
    setSelectedStudyType(studyType);
    setCurrentStep('team-config');
  };

  const handleTeamConfigComplete = (config: TeamConfiguration) => {
    setTeamConfig(config);
    setCurrentStep('hypothesis');
  };

  const handleHypothesisComplete = (hyp: any) => {
    setHypothesis(hyp);
    
    // Complete the wizard
    if (selectedStudyType && teamConfig) {
      const completeProject: CompleteProjectSetup = {
        studyType: selectedStudyType,
        teamConfiguration: teamConfig,
        hypothesis: hyp,
        timestamp: new Date().toISOString(),
      };
      onComplete?.(completeProject);
    }
  };

  const handleStepClick = (stepId: string) => {
    // Allow navigation to previous steps
    const targetIndex = steps.findIndex(s => s.id === stepId);
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    
    if (targetIndex < currentIndex) {
      setCurrentStep(stepId);
    }
  };

  return (
    <WizardShell
      steps={steps}
      currentStepId={currentStep}
      onStepClick={handleStepClick}
      allowStepNavigation={true}
    >
      {currentStep === 'study-type' && (
        <StudyTypeSelector
          onComplete={handleStudyTypeComplete}
          onCancel={onCancel}
          selectedType={selectedStudyType}
        />
      )}

      {currentStep === 'team-config' && selectedStudyType && (
        <TeamConfigStep
          studyType={selectedStudyType}
          onComplete={handleTeamConfigComplete}
          onBack={() => setCurrentStep('study-type')}
          existingConfig={teamConfig}
        />
      )}

      {currentStep === 'hypothesis' && selectedStudyType && teamConfig && (
        <HypothesisFormation
          studyType={selectedStudyType}
          teamConfiguration={teamConfig}
          onComplete={handleHypothesisComplete}
          onBack={() => setCurrentStep('team-config')}
          existingHypothesis={hypothesis}
        />
      )}
    </WizardShell>
  );
}