/**
 * Workflow Progress Tracking
 * 
 * Calculates completion status for the clinical trial workflow with expanded features:
 * Core Workflow:
 * 1. Define Study Personas & Setup Project
 * 2. Configure Methodology & Ethics
 * 3. Develop Protocol
 * 4. Establish Database
 * 5. Choose Statistics
 * 6. Build Research Paper
 */

import { storage } from './storageService';
import type { SavedProtocol, ClinicalDataRecord } from '../types/shared';
import i18n from '../lib/i18n/config';

export type WorkflowStep =
  | 'personas'
  | 'clinical-capture'
  | 'methodology'
  | 'ethics'
  | 'protocol'
  | 'database'
  | 'statistics'
  | 'paper';

export type WorkflowStepStatus = 'complete' | 'in-progress' | 'not-started' | 'locked';

export interface WorkflowStepDetails {
  id: WorkflowStep;
  title: string;
  description: string;
  status: WorkflowStepStatus;
  progress: number; // 0-100
  details: string[];
  actions: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }[];
  unlocked: boolean;
}

export interface WorkflowProgress {
  overallProgress: number; // 0-100
  completedSteps: number; // 0-5
  currentStep: WorkflowStep | null;
  steps: WorkflowStepDetails[];
}

/**
 * Check if personas are configured
 */
function checkPersonasComplete(projectId?: string): { complete: boolean; count: number; details: string[] } {
  try {
    const personas = storage.personas.getAll(projectId);
    const count = personas.length;
    const complete = count >= 1;
    
    const details: string[] = [];
    if (count === 0) {
      details.push(i18n.t('dashboard:workflowDetails.noPersonasConfigured'));
    } else {
      details.push(i18n.t('dashboard:workflowDetails.personasConfigured', { count }));
    }
    
    return { complete, count, details };
  } catch {
    return { complete: false, count: 0, details: [i18n.t('dashboard:workflowDetails.noPersonasConfigured')] };
  }
}

/**
 * Check if project setup is complete (team, blinding, etc.)
 */
function checkProjectSetupComplete(projectId?: string): { complete: boolean; details: string[] } {
  try {
    // Check if methodology config exists
    const methodologyConfig = localStorage.getItem(`methodology_config_${projectId}`);
    const hasConfig = !!methodologyConfig;
    
    const details: string[] = [];
    if (!hasConfig) {
      details.push(i18n.t('dashboard:workflowDetails.configureTeamBlinding'));
    } else {
      const config = JSON.parse(methodologyConfig);
      if (config.teamSize) details.push(i18n.t('dashboard:workflowDetails.teamSize', { size: config.teamSize }));
      if (config.blindingType) details.push(i18n.t('dashboard:workflowDetails.blinding', { type: config.blindingType }));
    }
    
    return { complete: hasConfig, details };
  } catch {
    return { complete: false, details: [i18n.t('dashboard:workflowDetails.configureTeamBlinding')] };
  }
}

/**
 * Check if methodology is configured
 */
function checkMethodologyComplete(projectId?: string): { complete: boolean; details: string[] } {
  try {
    const methodologyConfig = localStorage.getItem(`methodology_config_${projectId}`);
    const hasMethodology = !!methodologyConfig;
    
    const details: string[] = [];
    if (!hasMethodology) {
      details.push(i18n.t('dashboard:workflowDetails.setupMethodologyEngine'));
    } else {
      details.push(i18n.t('dashboard:workflowDetails.methodologyConfigured'));
    }
    
    return { complete: hasMethodology, details };
  } catch {
    return { complete: false, details: [i18n.t('dashboard:workflowDetails.configureMethodology')] };
  }
}

/**
 * Check if ethics/IRB submission is complete
 */
function checkEthicsComplete(projectId?: string): { complete: boolean; details: string[] } {
  try {
    const irbData = localStorage.getItem(`irb_data_${projectId}`);
    const hasIRB = !!irbData;
    
    const details: string[] = [];
    if (!hasIRB) {
      details.push(i18n.t('dashboard:workflowDetails.submitIRBApplication'));
    } else {
      const irb = JSON.parse(irbData);
      if (irb.status === 'APPROVED') {
        details.push(i18n.t('dashboard:workflowDetails.irbApproved'));
        details.push(i18n.t('dashboard:workflowDetails.protocolNumber', { number: irb.protocolNumber || 'N/A' }));
      } else {
        details.push(i18n.t('dashboard:workflowDetails.statusLabel', { status: irb.status || 'Pending' }));
      }
    }
    
    return { complete: hasIRB, details };
  } catch {
    return { complete: false, details: [i18n.t('dashboard:workflowDetails.submitIRBApplication')] };
  }
}

/**
 * Check if protocol is developed
 */
function checkProtocolComplete(projectId?: string): { 
  complete: boolean; 
  protocol: SavedProtocol | null; 
  details: string[] 
} {
  try {
    const protocols = storage.protocols.getAll(projectId);
    
    if (protocols.length === 0) {
      return { 
        complete: false, 
        protocol: null, 
        details: [i18n.t('dashboard:workflowDetails.noProtocolCreated')] 
      };
    }
    
    // Get the most recently modified protocol
    const protocol = protocols.sort((a, b) => 
      new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime()
    )[0];
    
    const currentVersion = protocol.versions.find(v => v.id === protocol.currentVersion);
    const hasSchemaBlocks = currentVersion && currentVersion.schemaBlocks.length > 0;
    
    const details: string[] = [];
    details.push(i18n.t('dashboard:workflowDetails.protocolLabel', { number: protocol.protocolNumber }));
    
    if (currentVersion) {
      details.push(i18n.t('dashboard:workflowDetails.versionStatus', { 
        version: currentVersion.versionNumber, 
        status: currentVersion.status 
      }));
      details.push(i18n.t('dashboard:workflowDetails.schemaBlocks', { count: currentVersion.schemaBlocks.length }));
    }
    
    return { 
      complete: hasSchemaBlocks, 
      protocol,
      details 
    };
  } catch {
    return { 
      complete: false, 
      protocol: null, 
      details: [i18n.t('dashboard:workflowDetails.noProtocolCreated')] 
    };
  }
}

/**
 * Check if database is established
 */
function checkDatabaseComplete(projectId?: string): { complete: boolean; recordCount: number; details: string[] } {
  try {
    const records = storage.clinicalData.getAll(projectId);
    const recordCount = records.length;
    const complete = recordCount > 0;
    
    const details: string[] = [];
    if (recordCount === 0) {
      details.push(i18n.t('dashboard:workflowDetails.noDataCollected'));
    } else {
      details.push(i18n.t('dashboard:workflowDetails.recordsCollected', { count: recordCount }));
      
      // Count subjects
      const uniqueSubjects = new Set(records.map(r => r.subjectId)).size;
      details.push(i18n.t('dashboard:workflowDetails.subjects', { count: uniqueSubjects }));
    }
    
    return { complete, recordCount, details };
  } catch {
    return { complete: false, recordCount: 0, details: [i18n.t('dashboard:workflowDetails.noDataCollected')] };
  }
}

/**
 * Check if statistics/analytics are configured
 * Note: This is a placeholder until analytics configuration is implemented
 */
function checkStatisticsComplete(projectId?: string): { complete: boolean; details: string[] } {
  try {
    // For now, check if there's data to analyze
    const records = storage.clinicalData.getAll(projectId);
    const hasData = records.length > 0;
    
    const details: string[] = [];
    if (!hasData) {
      details.push(i18n.t('dashboard:workflowDetails.collectDataFirst'));
    } else {
      details.push(i18n.t('dashboard:workflowDetails.readyToConfigureAnalytics'));
      details.push(i18n.t('dashboard:workflowDetails.recordsAvailable', { count: records.length }));
    }
    
    // TODO: Add actual analytics configuration check when implemented
    return { 
      complete: false, // Always in progress for now
      details 
    };
  } catch {
    return { complete: false, details: [i18n.t('dashboard:workflowDetails.configureAnalytics')] };
  }
}

/**
 * Check if research paper is ready
 * Note: This feature is not yet implemented
 */
function checkPaperComplete(): { complete: boolean; details: string[] } {
  // This will be implemented when the paper generation feature is added
  return { 
    complete: false, 
    details: [i18n.t('dashboard:workflowDetails.featureComingSoon')] 
  };
}

/**
 * Calculate overall workflow progress
 * @param onNavigate - Navigation callback function
 * @param projectId - Optional project ID for project-specific progress
 */
export function calculateWorkflowProgress(
  onNavigate: (tab: string) => void,
  projectId?: string
): WorkflowProgress {
  // Check each step
  const personasCheck = checkPersonasComplete(projectId);
  const projectSetupCheck = checkProjectSetupComplete(projectId);
  const methodologyCheck = checkMethodologyComplete(projectId);
  const ethicsCheck = checkEthicsComplete(projectId);
  const protocolCheck = checkProtocolComplete(projectId);
  const databaseCheck = checkDatabaseComplete(projectId);
  const statisticsCheck = checkStatisticsComplete(projectId);
  const paperCheck = checkPaperComplete();
  
  // Determine current step (first incomplete step)
  let currentStep: WorkflowStep | null = null;
  if (!personasCheck.complete) {
    currentStep = 'personas';
  } else if (!projectSetupCheck.complete) {
    currentStep = 'clinical-capture';
  } else if (!methodologyCheck.complete) {
    currentStep = 'methodology';
  } else if (!ethicsCheck.complete) {
    currentStep = 'ethics';
  } else if (!protocolCheck.complete) {
    currentStep = 'protocol';
  } else if (!databaseCheck.complete) {
    currentStep = 'database';
  } else if (!statisticsCheck.complete) {
    currentStep = 'statistics';
  } else if (!paperCheck.complete) {
    currentStep = 'paper';
  }
  
  // Build step details
  const steps: WorkflowStepDetails[] = [
    {
      id: 'personas',
      title: i18n.t('dashboard:steps.definePersonas.title'),
      description: i18n.t('dashboard:steps.definePersonas.description'),
      status: personasCheck.complete ? 'complete' : 'in-progress',
      progress: personasCheck.complete ? 100 : (personasCheck.count > 0 ? 50 : 0),
      details: personasCheck.details,
      actions: [
        {
          label: personasCheck.complete 
            ? i18n.t('dashboard:workflowDetails.viewPersonas') 
            : i18n.t('dashboard:workflowDetails.createPersonas'),
          onClick: () => onNavigate('personas'),
          variant: 'primary'
        }
      ],
      unlocked: true
    },
    {
      id: 'clinical-capture',
      title: i18n.t('dashboard:steps.setupProject.title'),
      description: i18n.t('dashboard:steps.setupProject.description'),
      status: projectSetupCheck.complete ? 'complete' : 'in-progress',
      progress: projectSetupCheck.complete ? 100 : (projectSetupCheck.details.length > 0 ? 50 : 0),
      details: projectSetupCheck.details,
      actions: [
        {
          label: projectSetupCheck.complete 
            ? i18n.t('dashboard:workflowDetails.viewSettings') 
            : i18n.t('dashboard:workflowDetails.configureSettings'),
          onClick: () => onNavigate('project-settings'),
          variant: 'primary'
        }
      ],
      unlocked: personasCheck.complete
    },
    {
      id: 'methodology',
      title: i18n.t('dashboard:steps.configureMethodology.title'),
      description: i18n.t('dashboard:steps.configureMethodology.description'),
      status: methodologyCheck.complete ? 'complete' : 'in-progress',
      progress: methodologyCheck.complete ? 100 : (methodologyCheck.details.length > 0 ? 50 : 0),
      details: methodologyCheck.details,
      actions: [
        {
          label: methodologyCheck.complete 
            ? i18n.t('dashboard:workflowDetails.viewMethodology') 
            : i18n.t('dashboard:workflowDetails.configureMethodology'),
          onClick: () => onNavigate('methodology'),
          variant: 'primary'
        }
      ],
      unlocked: projectSetupCheck.complete
    },
    {
      id: 'ethics',
      title: i18n.t('dashboard:steps.submitIRB.title'),
      description: i18n.t('dashboard:steps.submitIRB.description'),
      status: ethicsCheck.complete ? 'complete' : 'in-progress',
      progress: ethicsCheck.complete ? 100 : (ethicsCheck.details.length > 0 ? 50 : 0),
      details: ethicsCheck.details,
      actions: [
        {
          label: ethicsCheck.complete 
            ? i18n.t('dashboard:workflowDetails.viewIRBStatus') 
            : i18n.t('dashboard:workflowDetails.submitIRB'),
          onClick: () => onNavigate('irb'),
          variant: 'primary'
        }
      ],
      unlocked: methodologyCheck.complete
    },
    {
      id: 'protocol',
      title: i18n.t('dashboard:steps.developProtocol.title'),
      description: i18n.t('dashboard:steps.developProtocol.description'),
      status: protocolCheck.complete ? 'complete' : 
              (protocolCheck.protocol ? 'in-progress' : 'not-started'),
      progress: protocolCheck.complete ? 100 : (protocolCheck.protocol ? 50 : 0),
      details: protocolCheck.details,
      actions: [
        {
          label: protocolCheck.protocol 
            ? i18n.t('dashboard:workflowDetails.openProtocolBuilder') 
            : i18n.t('dashboard:workflowDetails.createProtocol'),
          onClick: () => onNavigate('protocol-builder'),
          variant: 'primary'
        },
        ...(protocolCheck.protocol ? [{
          label: i18n.t('dashboard:workflowDetails.viewLibrary'),
          onClick: () => onNavigate('protocol-library'),
          variant: 'secondary' as const
        }] : [])
      ],
      unlocked: ethicsCheck.complete
    },
    {
      id: 'database',
      title: i18n.t('dashboard:steps.establishDatabase.title'),
      description: i18n.t('dashboard:steps.establishDatabase.description'),
      status: databaseCheck.complete ? 'complete' : 
              (protocolCheck.complete ? 'in-progress' : 'not-started'),
      progress: databaseCheck.complete ? 100 : (databaseCheck.recordCount > 0 ? 50 : 0),
      details: databaseCheck.details,
      actions: [
        {
          label: databaseCheck.recordCount > 0 
            ? i18n.t('dashboard:workflowDetails.enterMoreData') 
            : i18n.t('dashboard:workflowDetails.enterData'),
          onClick: () => onNavigate('database'),
          variant: 'primary'
        },
        ...(databaseCheck.recordCount > 0 ? [{
          label: i18n.t('dashboard:workflowDetails.browseRecords'),
          onClick: () => onNavigate('database'),
          variant: 'secondary' as const
        }] : [])
      ],
      unlocked: protocolCheck.complete
    },
    {
      id: 'statistics',
      title: i18n.t('dashboard:steps.configureAnalytics.title'),
      description: i18n.t('dashboard:steps.configureAnalytics.description'),
      status: statisticsCheck.complete ? 'complete' : 
              (databaseCheck.complete ? 'in-progress' : 'not-started'),
      progress: statisticsCheck.complete ? 100 : (databaseCheck.complete ? 25 : 0),
      details: statisticsCheck.details,
      actions: [
        {
          label: i18n.t('dashboard:workflowDetails.configureAnalytics'),
          onClick: () => onNavigate('analytics'),
          variant: 'primary'
        }
      ],
      unlocked: databaseCheck.complete
    },
    {
      id: 'paper',
      title: i18n.t('dashboard:steps.buildPaper.title'),
      description: i18n.t('dashboard:steps.buildPaper.description'),
      status: 'locked',
      progress: 0,
      details: paperCheck.details,
      actions: [
        {
          label: i18n.t('dashboard:workflowDetails.viewRequirements'),
          onClick: () => {}, // No-op for now
          variant: 'secondary'
        }
      ],
      unlocked: false // Feature not yet implemented
    }
  ];
  
  // Calculate overall progress
  const completedSteps = steps.filter(s => s.status === 'complete').length;
  const overallProgress = (completedSteps / steps.length) * 100;
  
  return {
    overallProgress,
    completedSteps,
    currentStep,
    steps
  };
}