// Unified AI Persona Registry - Central Configuration

import type { PersonaConfig, PersonaId } from './personaTypes';

export const PERSONA_REGISTRY: Record<PersonaId, PersonaConfig> = {
  'protocol-auditor': {
    id: 'protocol-auditor',
    name: 'Protocol Auditor',
    description: 'AI-powered validation of protocol documents, schema structure, and cross-validation for regulatory compliance',
    studyTypeDescription: 'Active for ALL study types - ensures ICH-GCP compliance and regulatory readiness across RCT, observational, device, and registry studies',
    icon: 'Shield',
    color: {
      primary: 'purple',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-900',
      icon: 'text-purple-600'
    },
    defaultActive: true,
    priority: 1,
    applicableStudyTypes: ['rct', 'observational', 'single-arm', 'diagnostic', 'registry', 'phase-1', 'phase-2', 'phase-3', 'phase-4', 'medical-device'],
    modules: ['protocol-workbench'],
    validationRules: [
      'protocol-title-required',
      'protocol-objectives-required',
      'protocol-endpoints-required',
      'schema-empty-check',
      'schema-required-fields',
      'dependency-circular-check',
      'dependency-safety-hidden',
      'cross-validation-endpoints',
      'regulatory-informed-consent'
    ],
    realTimeValidation: true,
    batchValidation: true,
    sidebar: {
      enabled: true,
      title: 'AI Protocol Validation',
      showValidationStatus: true,
      showRecommendations: true,
      showRegulatoryReferences: true,
      sections: [
        {
          id: 'real-time-checks',
          title: 'Real-time Checks',
          type: 'checklist',
          content: [
            'Required sections completed',
            'ICH-GCP regulatory compliance',
            'Protocol ↔ Schema alignment',
            'Cross-field consistency'
          ]
        }
      ]
    },
    modal: {
      enabled: true,
      title: 'Pre-Publish Validation',
      showComplianceScore: true,
      showIssueBreakdown: true,
      allowProceedWithWarnings: true,
      requireAcknowledgment: true
    },
    statusIndicator: {
      enabled: true,
      showInGlobalHeader: false,
      showInModuleHeader: true,
      showInline: true,
      badgeStyle: 'score'
    }
  },

  'schema-architect': {
    id: 'schema-architect',
    name: 'Schema Architect',
    description: 'Study-type-specific variable recommendations and schema structure validation',
    studyTypeDescription: 'Active for RCT, observational, single-arm, diagnostic, and registry studies - recommends study-specific variables (randomization, exposure tracking, diagnostic tests, follow-up)',
    icon: 'Building2',
    color: {
      primary: 'blue',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      icon: 'text-blue-600'
    },
    defaultActive: true,
    priority: 2,
    applicableStudyTypes: ['rct', 'observational', 'single-arm', 'diagnostic', 'registry'],
    modules: ['protocol-workbench', 'schema-builder'],
    validationRules: [
      'rct-randomization-variable',
      'rct-treatment-arm-variable',
      'rct-blinding-status',
      'observational-exposure-variable',
      'observational-confounders',
      'diagnostic-index-test',
      'diagnostic-reference-standard',
      'registry-follow-up-variables'
    ],
    realTimeValidation: true,
    batchValidation: true,
    sidebar: {
      enabled: true,
      title: 'AI Schema Recommendations',
      showValidationStatus: true,
      showRecommendations: true,
      showRegulatoryReferences: false,
      sections: [
        {
          id: 'study-type-variables',
          title: 'Recommended Variables',
          type: 'best-practices',
          content: [] // Dynamic based on study type
        },
        {
          id: 'missing-critical',
          title: 'Missing Critical Variables',
          type: 'warnings',
          content: [] // Dynamic based on validation
        }
      ]
    },
    modal: {
      enabled: false,
      title: '',
      showComplianceScore: false,
      showIssueBreakdown: false,
      allowProceedWithWarnings: false,
      requireAcknowledgment: false
    },
    statusIndicator: {
      enabled: true,
      showInGlobalHeader: false,
      showInModuleHeader: true,
      showInline: true,
      badgeStyle: 'icon'
    }
  },

  'statistical-advisor': {
    id: 'statistical-advisor',
    name: 'Statistical Methods Advisor',
    description: 'Study-type-appropriate statistical methods and analysis plan validation',
    studyTypeDescription: 'Active for ALL study types - recommends appropriate methods (ITT/PP for RCT, propensity scores for observational, sample size justification, missing data strategies)',
    icon: 'TrendingUp',
    color: {
      primary: 'emerald',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
      icon: 'text-emerald-600'
    },
    defaultActive: true,
    priority: 3,
    applicableStudyTypes: ['rct', 'observational', 'single-arm', 'diagnostic', 'registry', 'phase-1', 'phase-2', 'phase-3', 'phase-4', 'medical-device'],
    modules: ['protocol-workbench', 'analytics'],
    validationRules: [
      'rct-itt-pp-analysis',
      'rct-consort-flow',
      'observational-propensity-score',
      'observational-strobe-checklist',
      'sample-size-justification',
      'missing-data-handling',
      'multiplicity-adjustment'
    ],
    realTimeValidation: false,
    batchValidation: true,
    sidebar: {
      enabled: true,
      title: 'Statistical Guidance',
      showValidationStatus: true,
      showRecommendations: true,
      showRegulatoryReferences: true,
      sections: [
        {
          id: 'recommended-methods',
          title: 'Recommended Methods',
          type: 'best-practices',
          content: [] // Dynamic based on study type
        },
        {
          id: 'regulatory-standards',
          title: 'ICH E9 Standards',
          type: 'guidance',
          content: [
            'Define estimands clearly (ICH E9(R1))',
            'Specify analysis populations (ITT, PP, Safety)',
            'Document missing data strategy',
            'Address multiplicity if multiple endpoints'
          ]
        }
      ]
    },
    modal: {
      enabled: false,
      title: '',
      showComplianceScore: false,
      showIssueBreakdown: false,
      allowProceedWithWarnings: false,
      requireAcknowledgment: false
    },
    statusIndicator: {
      enabled: true,
      showInGlobalHeader: false,
      showInModuleHeader: true,
      showInline: false,
      badgeStyle: 'text'
    }
  },

  'data-quality-sentinel': {
    id: 'data-quality-sentinel',
    name: 'Data Quality Sentinel',
    description: 'Real-time data validation, range checks, and logical consistency enforcement',
    studyTypeDescription: 'Active for ALL study types - validates data quality, range checks, temporal logic, and study-specific checks (randomization balance for RCT, AE grading for interventional)',
    icon: 'ShieldCheck',
    color: {
      primary: 'teal',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-900',
      icon: 'text-teal-600'
    },
    defaultActive: true,
    priority: 4,
    modules: ['database'],
    validationRules: [
      'data-range-validation',
      'data-logical-consistency',
      'data-required-fields',
      'data-temporal-logic',
      'rct-randomization-balance',
      'safety-ae-grading'
    ],
    realTimeValidation: true,
    batchValidation: true,
    sidebar: {
      enabled: false,
      title: '',
      showValidationStatus: false,
      showRecommendations: false,
      showRegulatoryReferences: false,
      sections: []
    },
    modal: {
      enabled: false,
      title: '',
      showComplianceScore: false,
      showIssueBreakdown: false,
      allowProceedWithWarnings: false,
      requireAcknowledgment: false
    },
    statusIndicator: {
      enabled: true,
      showInGlobalHeader: true,
      showInModuleHeader: true,
      showInline: true,
      badgeStyle: 'icon'
    }
  },

  'ethics-compliance': {
    id: 'ethics-compliance',
    name: 'Ethics & IRB Compliance AI',
    description: 'IRB submission readiness, informed consent validation, and regulatory compliance checking',
    studyTypeDescription: 'Active for ALL study types - validates informed consent, risk/benefit assessment, vulnerable populations, HIPAA compliance, and data safety monitoring plans',
    icon: 'Scale',
    color: {
      primary: 'indigo',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-900',
      icon: 'text-indigo-600'
    },
    defaultActive: true,
    priority: 5,
    modules: ['protocol-workbench', 'ethics-board'],
    validationRules: [
      'ethics-informed-consent-elements',
      'ethics-risk-benefit-assessment',
      'ethics-vulnerable-populations',
      'ethics-hipaa-compliance',
      'ethics-data-safety-monitoring'
    ],
    realTimeValidation: false,
    batchValidation: true,
    sidebar: {
      enabled: true,
      title: 'Ethics Compliance',
      showValidationStatus: true,
      showRecommendations: true,
      showRegulatoryReferences: true,
      sections: [
        {
          id: 'consent-elements',
          title: 'Informed Consent (21 CFR 50.25)',
          type: 'checklist',
          content: [
            'Research purpose statement',
            'Foreseeable risks/discomforts',
            'Expected benefits',
            'Alternative procedures',
            'Confidentiality statement',
            'Compensation for injury',
            'Contact information',
            'Voluntary participation statement'
          ]
        },
        {
          id: 'irb-requirements',
          title: 'IRB Submission Requirements',
          type: 'guidance',
          content: [
            'Complete protocol with all required sections',
            'Informed consent form(s)',
            'Investigator brochure or package insert',
            'Recruitment materials',
            'Data safety monitoring plan'
          ]
        }
      ]
    },
    modal: {
      enabled: true,
      title: 'IRB Submission Readiness',
      showComplianceScore: true,
      showIssueBreakdown: true,
      allowProceedWithWarnings: false,
      requireAcknowledgment: false
    },
    statusIndicator: {
      enabled: true,
      showInGlobalHeader: false,
      showInModuleHeader: true,
      showInline: false,
      badgeStyle: 'progress'
    }
  },

  'safety-vigilance': {
    id: 'safety-vigilance',
    name: 'Safety Vigilance AI',
    description: 'Adverse event monitoring, SAE reporting compliance, and safety signal detection',
    studyTypeDescription: 'REQUIRED for RCT, Phase I-III, and single-arm studies - monitors adverse events, SAE reporting timelines, causality assessment, DLT tracking per regulatory requirements',
    icon: 'AlertTriangle',
    color: {
      primary: 'red',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-900',
      icon: 'text-red-600'
    },
    defaultActive: false, // Only for interventional studies
    priority: 6,
    requiredForStudyTypes: ['rct', 'phase-1', 'phase-2', 'phase-3', 'single-arm'],
    modules: ['database', 'safety-monitoring'],
    validationRules: [
      'safety-ae-ctcae-grading',
      'safety-sae-reporting-timeline',
      'safety-causality-assessment',
      'safety-dlt-tracking',
      'safety-device-mdr-reporting'
    ],
    realTimeValidation: true,
    batchValidation: true,
    sidebar: {
      enabled: false,
      title: '',
      showValidationStatus: false,
      showRecommendations: false,
      showRegulatoryReferences: false,
      sections: []
    },
    modal: {
      enabled: true,
      title: 'Safety Event Validation',
      showComplianceScore: false,
      showIssueBreakdown: true,
      allowProceedWithWarnings: false,
      requireAcknowledgment: true
    },
    statusIndicator: {
      enabled: true,
      showInGlobalHeader: true,
      showInModuleHeader: true,
      showInline: true,
      badgeStyle: 'icon'
    }
  },

  'endpoint-validator': {
    id: 'endpoint-validator',
    name: 'Clinical Endpoint Validator',
    description: 'Endpoint adjudication support and clinical event validation',
    studyTypeDescription: 'Optional for clinical trials with complex endpoints - validates RECIST criteria (oncology), MACE adjudication (cardiology), PFS/ORR calculations per protocol definitions',
    icon: 'Target',
    color: {
      primary: 'amber',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-900',
      icon: 'text-amber-600'
    },
    defaultActive: false,
    priority: 7,
    modules: ['database'],
    validationRules: [
      'endpoint-recist-validation',
      'endpoint-mace-adjudication',
      'endpoint-pfs-calculation',
      'endpoint-ors-calculation'
    ],
    realTimeValidation: false,
    batchValidation: true,
    sidebar: {
      enabled: false,
      title: '',
      showValidationStatus: false,
      showRecommendations: false,
      showRegulatoryReferences: false,
      sections: []
    },
    modal: {
      enabled: false,
      title: '',
      showComplianceScore: false,
      showIssueBreakdown: false,
      allowProceedWithWarnings: false,
      requireAcknowledgment: false
    },
    statusIndicator: {
      enabled: false,
      showInGlobalHeader: false,
      showInModuleHeader: false,
      showInline: false,
      badgeStyle: 'icon'
    }
  },

  'amendment-advisor': {
    id: 'amendment-advisor',
    name: 'Protocol Amendment Advisor',
    description: 'Amendment impact analysis and regulatory classification guidance',
    studyTypeDescription: 'Optional for ongoing studies requiring protocol modifications - classifies amendment severity, determines if re-consent needed, guides IRB submission type (substantial vs non-substantial)',
    icon: 'FileEdit',
    color: {
      primary: 'slate',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-900',
      icon: 'text-slate-600'
    },
    defaultActive: false,
    priority: 8,
    modules: ['protocol-workbench'],
    validationRules: [
      'amendment-substantial-change',
      'amendment-reconsent-needed',
      'amendment-irb-type'
    ],
    realTimeValidation: false,
    batchValidation: false,
    sidebar: {
      enabled: false,
      title: '',
      showValidationStatus: false,
      showRecommendations: false,
      showRegulatoryReferences: false,
      sections: []
    },
    modal: {
      enabled: true,
      title: 'Amendment Impact Analysis',
      showComplianceScore: false,
      showIssueBreakdown: true,
      allowProceedWithWarnings: true,
      requireAcknowledgment: true
    },
    statusIndicator: {
      enabled: false,
      showInGlobalHeader: false,
      showInModuleHeader: false,
      showInline: false,
      badgeStyle: 'text'
    }
  },

  'academic-writing-coach': {
    id: 'academic-writing-coach',
    name: 'Academic Writing Coach',
    description: 'AI-powered manuscript assistance with citation validation, journal compliance, and writing quality checks',
    studyTypeDescription: 'Active for ALL study types - assists with manuscript drafting, citation formatting, word budget management, journal-specific requirements, and plagiarism prevention',
    icon: 'PenTool',
    color: {
      primary: 'rose',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-900',
      icon: 'text-rose-600'
    },
    defaultActive: true,
    priority: 9,
    applicableStudyTypes: ['rct', 'observational', 'single-arm', 'diagnostic', 'registry', 'phase-1', 'phase-2', 'phase-3', 'phase-4', 'medical-device'],
    modules: ['academic-writing'],
    validationRules: [
      'manuscript-citation-format',
      'manuscript-word-budget',
      'manuscript-journal-compliance',
      'manuscript-statistical-accuracy',
      'manuscript-ethics-disclosure',
      'manuscript-table-figure-limits',
      'manuscript-reference-limits'
    ],
    realTimeValidation: true,
    batchValidation: true,
    sidebar: {
      enabled: true,
      title: 'AI Writing Assistance',
      showValidationStatus: true,
      showRecommendations: true,
      showRegulatoryReferences: false,
      sections: [
        {
          id: 'writing-checks',
          title: 'Real-time Writing Checks',
          type: 'checklist',
          content: [
            'Citation format compliance (all modes)',
            'Word budget adherence (all modes)',
            'Journal-specific requirements (all modes)',
            'Statistical claim verification (co-pilot/autopilot only)',
            'Ethics disclosure completeness (all modes)',
            'Reference count limits (all modes)'
          ]
        },
        {
          id: 'journal-requirements',
          title: 'Journal Requirements',
          type: 'guidance',
          content: [
            'Check word limits for abstract and main text',
            'Verify table and figure count restrictions',
            'Ensure reference count within limits',
            'Validate required manuscript sections',
            'Confirm citation style compliance'
          ]
        },
        {
          id: 'best-practices',
          title: 'Academic Writing Best Practices',
          type: 'best-practices',
          content: [
            'Use active voice for clarity',
            'Ground all claims in data or citations',
            'Follow CONSORT/STROBE reporting guidelines',
            'Avoid plagiarism and self-plagiarism',
            'Maintain consistent terminology'
          ]
        }
      ]
    },
    modal: {
      enabled: true,
      title: 'Manuscript Quality Check',
      showComplianceScore: true,
      showIssueBreakdown: true,
      allowProceedWithWarnings: true,
      requireAcknowledgment: false
    },
    statusIndicator: {
      enabled: true,
      showInGlobalHeader: false,
      showInModuleHeader: true,
      showInline: true,
      badgeStyle: 'score'
    }
  }
};

// Helper function to get persona by ID
export function getPersona(personaId: PersonaId): PersonaConfig {
  return PERSONA_REGISTRY[personaId];
}

// Helper function to get all personas
export function getAllPersonas(): PersonaConfig[] {
  return Object.values(PERSONA_REGISTRY);
}

// Helper function to get personas for a specific study type
export function getPersonasForStudyType(studyType: string): PersonaConfig[] {
  return getAllPersonas().filter(persona => {
    // If no study types specified, applies to all
    if (!persona.applicableStudyTypes) return true;
    
    // Check if study type matches
    return persona.applicableStudyTypes.includes(studyType as any);
  });
}

// Helper function to get required personas for a study type
export function getRequiredPersonasForStudyType(studyType: string): PersonaConfig[] {
  return getAllPersonas().filter(persona => {
    return persona.requiredForStudyTypes?.includes(studyType as any);
  });
}

// Helper function to get personas for a specific module
export function getPersonasForModule(module: string): PersonaConfig[] {
  return getAllPersonas().filter(persona => {
    return persona.modules.includes(module as any);
  });
}