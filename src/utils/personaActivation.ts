/**
 * Persona Activation Utilities
 * 
 * Auto-activates personas based on study type when projects are created
 */

import type { StudyType } from '../components/ai-personas/core/personaTypes';
import type { StudyDesignType } from '../types/studyDesigns';

/**
 * Maps Study Design Types to Persona System Study Types
 */
export function mapStudyDesignToStudyType(designType: StudyDesignType): StudyType | null {
  const mapping: Record<string, StudyType> = {
    'rct': 'rct',
    'cohort': 'observational',
    'case-series': 'registry',
    'case-control': 'observational',
    'cross-sectional': 'observational',
    'diagnostic-accuracy': 'diagnostic',
    'laboratory': 'registry', // Lab studies treated as registry type
    'technical-note': 'registry', // Technical notes treated as registry type
    'systematic-review': 'registry', // Reviews don't need clinical data validation
  };

  return mapping[designType] || null;
}

/**
 * Get recommended personas for a study design
 */
export function getRecommendedPersonasForStudyDesign(designType: StudyDesignType) {
  const studyType = mapStudyDesignToStudyType(designType);
  
  if (!studyType) {
    // Default set for unknown study types
    return {
      required: ['protocol-auditor', 'statistical-advisor', 'ethics-compliance'],
      optional: ['data-quality-sentinel']
    };
  }

  // Study-type-specific recommendations
  const recommendations: Record<StudyType, { required: string[]; optional: string[] }> = {
    'rct': {
      required: ['protocol-auditor', 'schema-architect', 'statistical-advisor', 'ethics-compliance', 'safety-vigilance'],
      optional: ['data-quality-sentinel', 'endpoint-validator']
    },
    'observational': {
      required: ['protocol-auditor', 'schema-architect', 'statistical-advisor', 'ethics-compliance'],
      optional: ['data-quality-sentinel']
    },
    'single-arm': {
      required: ['protocol-auditor', 'schema-architect', 'statistical-advisor', 'ethics-compliance', 'safety-vigilance'],
      optional: ['data-quality-sentinel', 'endpoint-validator']
    },
    'diagnostic': {
      required: ['protocol-auditor', 'schema-architect', 'statistical-advisor', 'ethics-compliance'],
      optional: ['data-quality-sentinel']
    },
    'registry': {
      required: ['protocol-auditor', 'schema-architect', 'statistical-advisor', 'data-quality-sentinel'],
      optional: ['ethics-compliance']
    },
    'phase-1': {
      required: ['protocol-auditor', 'statistical-advisor', 'ethics-compliance', 'safety-vigilance'],
      optional: ['schema-architect', 'data-quality-sentinel']
    },
    'phase-2': {
      required: ['protocol-auditor', 'schema-architect', 'statistical-advisor', 'ethics-compliance', 'safety-vigilance'],
      optional: ['data-quality-sentinel', 'endpoint-validator']
    },
    'phase-3': {
      required: ['protocol-auditor', 'schema-architect', 'statistical-advisor', 'ethics-compliance', 'safety-vigilance'],
      optional: ['data-quality-sentinel', 'endpoint-validator']
    },
    'phase-4': {
      required: ['protocol-auditor', 'schema-architect', 'statistical-advisor', 'ethics-compliance'],
      optional: ['data-quality-sentinel', 'safety-vigilance']
    },
    'medical-device': {
      required: ['protocol-auditor', 'statistical-advisor', 'ethics-compliance', 'safety-vigilance'],
      optional: ['schema-architect', 'data-quality-sentinel']
    }
  };

  return recommendations[studyType];
}
