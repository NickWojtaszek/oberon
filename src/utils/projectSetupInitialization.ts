/**
 * Project Setup Initialization Utilities
 * Initializes ProjectSetup fields from both studyDesign (Project Creation) and studyMethodology (Project Setup)
 */

import type { Project } from '../types/shared';
import type { StudyDesignConfiguration } from '../types/studyDesigns';
import type { BlindingLevel, StudyType } from '../config/studyMethodology';
import { getInitialStudyType } from './studyTypeMapping';

export interface ProjectSetupFormData {
  // Core study configuration
  studyType: StudyType;
  studyPhase: string;
  
  // Team configuration
  teamSize: number;
  
  // Blinding configuration
  blindingProtocol: BlindingLevel;
  
  // Hypothesis
  hypothesis: string;
  
  // Case Series specific fields
  deepPhenotyping: boolean;
  temporalGranularity: 'daily' | 'weekly' | 'monthly' | 'event-based';
  includeLongitudinalTracking: boolean;
  multipleTimepoints: boolean;
  
  // Cohort specific fields
  followUpDuration: string;
  followUpInterval: string;
  exposureAssessment: 'baseline-only' | 'time-varying';
  lossToFollowUpTracking: boolean;
  
  // Laboratory specific fields
  replicates: number;
  measurementPrecision: 'standard' | 'high' | 'ultra-high';
  qualityControlSamples: boolean;
  instrumentValidation: boolean;
  
  // Technical Note specific fields
  caseCount: number;
  includeImaging: boolean;
  includeLiteratureReview: boolean;
  narrativeFocus: 'diagnostic' | 'therapeutic' | 'methodological';
  
  // RCT specific fields (from studyDesign)
  blindingType: 'open-label' | 'single-blind' | 'double-blind' | 'triple-blind';
  allocationRatio: '1:1' | '2:1' | '3:1' | '1:2' | 'custom';
  blockRandomization: boolean;
  minimization: boolean;
}

/**
 * Initialize all ProjectSetup form fields from current project
 * Prioritizes studyMethodology, falls back to studyDesign
 */
export function initializeProjectSetupForm(project: Project | null): ProjectSetupFormData {
  if (!project) {
    return getDefaultFormData();
  }

  const studyType = getInitialStudyType(project);
  
  return {
    // Core configuration
    studyType,
    studyPhase: project.phase || '',
    
    // Team configuration
    teamSize: project.studyMethodology?.teamConfiguration?.assignedPersonas?.length || 3,
    
    // Blinding configuration
    blindingProtocol: project.studyMethodology?.blindingState?.protocol || getDefaultBlindingForType(studyType),
    
    // Hypothesis
    hypothesis: project.studyMethodology?.hypothesis?.researchQuestion || '',
    
    // Case Series fields
    deepPhenotyping: getDeepPhenotyping(project),
    temporalGranularity: getTemporalGranularity(project),
    includeLongitudinalTracking: getIncludeLongitudinalTracking(project),
    multipleTimepoints: getMultipleTimepoints(project),
    
    // Cohort fields
    followUpDuration: getFollowUpDuration(project),
    followUpInterval: getFollowUpInterval(project),
    exposureAssessment: getExposureAssessment(project),
    lossToFollowUpTracking: getLossToFollowUpTracking(project),
    
    // Laboratory fields
    replicates: getReplicates(project),
    measurementPrecision: getMeasurementPrecision(project),
    qualityControlSamples: getQualityControlSamples(project),
    instrumentValidation: getInstrumentValidation(project),
    
    // Technical Note fields
    caseCount: getCaseCount(project),
    includeImaging: getIncludeImaging(project),
    includeLiteratureReview: getIncludeLiteratureReview(project),
    narrativeFocus: getNarrativeFocus(project),
    
    // RCT fields
    blindingType: getBlindingType(project),
    allocationRatio: getAllocationRatio(project),
    blockRandomization: getBlockRandomization(project),
    minimization: getMinimization(project),
  };
}

function getDefaultFormData(): ProjectSetupFormData {
  return {
    studyType: 'rct',
    studyPhase: '',
    teamSize: 3,
    blindingProtocol: 'double-blind',
    hypothesis: '',
    deepPhenotyping: false,
    temporalGranularity: 'daily',
    includeLongitudinalTracking: false,
    multipleTimepoints: false,
    followUpDuration: '',
    followUpInterval: '',
    exposureAssessment: 'baseline-only',
    lossToFollowUpTracking: false,
    replicates: 3,
    measurementPrecision: 'standard',
    qualityControlSamples: false,
    instrumentValidation: false,
    caseCount: 1,
    includeImaging: false,
    includeLiteratureReview: false,
    narrativeFocus: 'diagnostic',
    blindingType: 'double-blind',
    allocationRatio: '1:1',
    blockRandomization: false,
    minimization: false,
  };
}

function getDefaultBlindingForType(studyType: StudyType): BlindingLevel {
  switch (studyType) {
    case 'rct':
      return 'double-blind';
    case 'prospective-cohort':
    case 'retrospective-case-series':
      return 'none';
    case 'laboratory-investigation':
      return 'single-blind';
    case 'technical-note':
      return 'none';
    default:
      return 'none';
  }
}

// Case Series field extractors
function getDeepPhenotyping(project: Project): boolean {
  return (project.studyDesign as StudyDesignConfiguration)?.caseSeries?.deepPhenotyping ?? false;
}

function getTemporalGranularity(project: Project): 'daily' | 'weekly' | 'monthly' | 'event-based' {
  return (project.studyDesign as StudyDesignConfiguration)?.caseSeries?.temporalGranularity ?? 'daily';
}

function getIncludeLongitudinalTracking(project: Project): boolean {
  return (project.studyDesign as StudyDesignConfiguration)?.caseSeries?.includeLongitudinalTracking ?? false;
}

function getMultipleTimepoints(project: Project): boolean {
  return (project.studyDesign as StudyDesignConfiguration)?.caseSeries?.multipleTimepoints ?? false;
}

// Cohort field extractors
function getFollowUpDuration(project: Project): string {
  return (project.studyDesign as StudyDesignConfiguration)?.cohort?.followUpDuration ?? '';
}

function getFollowUpInterval(project: Project): string {
  return (project.studyDesign as StudyDesignConfiguration)?.cohort?.followUpInterval ?? '';
}

function getExposureAssessment(project: Project): 'baseline-only' | 'time-varying' {
  return (project.studyDesign as StudyDesignConfiguration)?.cohort?.exposureAssessment ?? 'baseline-only';
}

function getLossToFollowUpTracking(project: Project): boolean {
  return (project.studyDesign as StudyDesignConfiguration)?.cohort?.lossToFollowUpTracking ?? false;
}

// Laboratory field extractors
function getReplicates(project: Project): number {
  return (project.studyDesign as StudyDesignConfiguration)?.laboratory?.replicates ?? 3;
}

function getMeasurementPrecision(project: Project): 'standard' | 'high' | 'ultra-high' {
  return (project.studyDesign as StudyDesignConfiguration)?.laboratory?.measurementPrecision ?? 'standard';
}

function getQualityControlSamples(project: Project): boolean {
  return (project.studyDesign as StudyDesignConfiguration)?.laboratory?.qualityControlSamples ?? false;
}

function getInstrumentValidation(project: Project): boolean {
  return (project.studyDesign as StudyDesignConfiguration)?.laboratory?.instrumentValidation ?? false;
}

// Technical Note field extractors
function getCaseCount(project: Project): number {
  return (project.studyDesign as StudyDesignConfiguration)?.technicalNote?.caseCount ?? 1;
}

function getIncludeImaging(project: Project): boolean {
  return (project.studyDesign as StudyDesignConfiguration)?.technicalNote?.includeImaging ?? false;
}

function getIncludeLiteratureReview(project: Project): boolean {
  return (project.studyDesign as StudyDesignConfiguration)?.technicalNote?.includeLiteratureReview ?? false;
}

function getNarrativeFocus(project: Project): 'diagnostic' | 'therapeutic' | 'methodological' {
  return (project.studyDesign as StudyDesignConfiguration)?.technicalNote?.narrativeFocus ?? 'diagnostic';
}

// RCT field extractors
function getBlindingType(project: Project): 'open-label' | 'single-blind' | 'double-blind' | 'triple-blind' {
  return (project.studyDesign as StudyDesignConfiguration)?.rct?.blindingType ?? 'double-blind';
}

function getAllocationRatio(project: Project): '1:1' | '2:1' | '3:1' | '1:2' | 'custom' {
  return (project.studyDesign as StudyDesignConfiguration)?.rct?.allocationRatio ?? '1:1';
}

function getBlockRandomization(project: Project): boolean {
  return (project.studyDesign as StudyDesignConfiguration)?.rct?.blockRandomization ?? false;
}

function getMinimization(project: Project): boolean {
  return (project.studyDesign as StudyDesignConfiguration)?.rct?.minimization ?? false;
}
