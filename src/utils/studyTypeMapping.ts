/**
 * Study Type Mapping Utilities
 * Maps between studyDesign.type (Project Creation) and studyMethodology.studyType (Project Setup)
 */

import type { StudyDesignType } from '../types/studyDesigns';
import type { StudyType } from '../config/studyMethodology';

/**
 * Maps from Project Creation study design type to Project Setup study methodology type
 */
export function mapStudyDesignToMethodology(
  designType: StudyDesignType
): StudyType {
  const mapping: Record<StudyDesignType, StudyType> = {
    'rct': 'rct',
    'case-series': 'retrospective-case-series',
    'cohort': 'prospective-cohort',
    'laboratory': 'laboratory-investigation',
    'technical-note': 'technical-note',
  };

  return mapping[designType];
}

/**
 * Maps from Project Setup study methodology type back to Project Creation study design type
 */
export function mapMethodologyToStudyDesign(
  methodologyType: StudyType
): StudyDesignType {
  const mapping: Record<StudyType, StudyDesignType> = {
    'rct': 'rct',
    'retrospective-case-series': 'case-series',
    'prospective-cohort': 'cohort',
    'laboratory-investigation': 'laboratory',
    'technical-note': 'technical-note',
  };

  return mapping[methodologyType];
}

/**
 * Gets the initial study type for Project Setup from current project
 * Prioritizes studyMethodology if configured, falls back to studyDesign
 */
export function getInitialStudyType(
  project: any
): StudyType {
  // First check if methodology is already configured
  if (project?.studyMethodology?.studyType) {
    return project.studyMethodology.studyType;
  }

  // Fall back to study design from project creation
  if (project?.studyDesign?.type) {
    return mapStudyDesignToMethodology(project.studyDesign.type);
  }

  // Ultimate fallback
  return 'rct';
}
