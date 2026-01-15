/**
 * Project Setup Wizard Container
 * Handles integration with ProjectContext
 */

import { ProjectSetupWizard, CompleteProjectSetup } from './ProjectSetupWizard';
import { useProject } from '../../contexts/ProtocolContext';

interface ProjectSetupWizardContainerProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function ProjectSetupWizardContainer({ 
  onComplete, 
  onCancel 
}: ProjectSetupWizardContainerProps) {
  const { currentProject, updateProject } = useProject();

  const handleComplete = (projectSetup: CompleteProjectSetup) => {
    console.log('Project setup completed:', projectSetup);
    
    // Save methodology configuration to current project
    if (currentProject) {
      updateProject(currentProject.id, {
        studyMethodology: {
          studyType: projectSetup.studyType,
          configuredAt: new Date().toISOString(),
          configuredBy: 'Demo User', // TODO: Get from auth context
          teamConfiguration: {
            assignedPersonas: projectSetup.teamConfiguration.assignedPersonas,
            locked: projectSetup.teamConfiguration.locked,
            lockedAt: projectSetup.teamConfiguration.timestamp,
            piSignature: projectSetup.teamConfiguration.piSignature,
          },
          hypothesis: projectSetup.hypothesis,
        },
      });
    }
    
    // Call parent completion handler
    onComplete?.();
  };

  return (
    <ProjectSetupWizard
      onComplete={handleComplete}
      onCancel={onCancel}
    />
  );
}
