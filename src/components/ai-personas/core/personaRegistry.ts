// Unified AI Persona Registry - Central Configuration

import type { PersonaConfig, PersonaId } from './personaTypes';

export const PERSONA_REGISTRY: Record<PersonaId, PersonaConfig> = {
  'protocol-auditor': {
    id: 'protocol-auditor',
    name: 'Protocol Auditor',
    fairyName: 'Dr. Mab',
    court: 'unseelie',
    folkloreOrigin: 'Queen Mab, fairy queen of dreams who sees through illusions to truth',
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
    fairyName: 'Dr. Mokosh',
    court: 'seelie',
    folkloreOrigin: 'Slavic goddess of weaving, fate, and women\'s work - she weaves the schema structure',
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
    fairyName: 'Dr. Saga',
    court: 'seelie',
    folkloreOrigin: 'Norse goddess of history and storytelling - she tracks the provenance of every statistical claim',
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
    fairyName: 'Dr. Grim',
    court: 'unseelie',
    folkloreOrigin: 'Church Grim, English guardian spirit that protects sacred spaces - guards data integrity',
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
    fairyName: 'Dr. Themis',
    court: 'seelie',
    folkloreOrigin: 'Greek titaness of law and divine order - holds the knowledge of regulatory frameworks',
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
    fairyName: 'Dr. König',
    court: 'unseelie',
    folkloreOrigin: 'German for King (Erlkönig) - the enforcer of safety protocols and authority limits',
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
    fairyName: 'Dr. Goodfellow',
    court: 'unseelie',
    folkloreOrigin: 'Robin Goodfellow (Puck) - mischievous tester who exposes flaws in endpoint logic',
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
    fairyName: 'Dr. Brigid',
    court: 'seelie',
    folkloreOrigin: 'Celtic goddess of poetry, fire, and smithcraft - forges and refines protocol changes',
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
    fairyName: 'Dr. Niamh',
    court: 'seelie',
    folkloreOrigin: 'Irish name meaning brightness or radiance - guides the writing with light and clarity',
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
  },

  'manuscript-reviewer': {
    id: 'manuscript-reviewer',
    name: 'Manuscript Reviewer',
    fairyName: 'Dr. Morana',
    court: 'unseelie',
    folkloreOrigin: 'Slavic goddess of winter and death (Marzanna) - cuts excess words and kills weak arguments',
    description: 'Critical manuscript review, word budget enforcement, claim validation, and academic rigor checking',
    studyTypeDescription: 'Active for ALL study types - critically reviews manuscripts for word limits, unsupported claims, statistical accuracy, and journal compliance violations',
    icon: 'Scissors',
    color: {
      primary: 'slate',
      bg: 'bg-slate-100',
      border: 'border-slate-300',
      text: 'text-slate-900',
      icon: 'text-slate-700'
    },
    defaultActive: true,
    priority: 10,
    applicableStudyTypes: ['rct', 'observational', 'single-arm', 'diagnostic', 'registry', 'phase-1', 'phase-2', 'phase-3', 'phase-4', 'medical-device'],
    modules: ['academic-writing'],
    validationRules: [
      'manuscript-word-budget-exceeded',
      'manuscript-unsupported-claims',
      'manuscript-statistical-mismatch',
      'manuscript-citation-missing',
      'manuscript-figure-table-excess',
      'manuscript-abstract-word-limit',
      'manuscript-reference-count-exceeded'
    ],
    realTimeValidation: true,
    batchValidation: true,
    sidebar: {
      enabled: true,
      title: 'Critical Review',
      showValidationStatus: true,
      showRecommendations: true,
      showRegulatoryReferences: false,
      sections: [
        {
          id: 'budget-enforcement',
          title: 'Budget Enforcement',
          type: 'warnings',
          content: [
            'Word count vs. journal limit',
            'Abstract word limit',
            'Figure and table count limits',
            'Reference count limits'
          ]
        },
        {
          id: 'claim-validation',
          title: 'Claim Validation',
          type: 'warnings',
          content: [
            'Statistical claims match data',
            'All claims have supporting citations',
            'No overclaiming of results',
            'Conclusions align with evidence'
          ]
        }
      ]
    },
    modal: {
      enabled: true,
      title: 'Manuscript Critical Review',
      showComplianceScore: true,
      showIssueBreakdown: true,
      allowProceedWithWarnings: false,
      requireAcknowledgment: true
    },
    statusIndicator: {
      enabled: true,
      showInGlobalHeader: false,
      showInModuleHeader: true,
      showInline: true,
      badgeStyle: 'icon'
    }
  },

  'hypothesis-architect': {
    id: 'hypothesis-architect',
    name: 'Hypothesis Architect',
    fairyName: 'Dr. Ariadne',
    court: 'seelie',
    folkloreOrigin: 'Greek mythology - Ariadne gave Theseus the thread to navigate the labyrinth; she guides researchers through complex hypothesis formation',
    description: 'AI-powered PICO framework extraction and hypothesis grounding. Guides researchers from clinical observations to structured, validated research questions with full traceability to protocol schema.',
    studyTypeDescription: 'Active for ALL study types - ensures research hypotheses are properly structured (Population, Intervention, Comparison, Outcome) and grounded in actual protocol variables',
    icon: 'Compass',
    color: {
      primary: 'indigo',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-900',
      icon: 'text-indigo-600'
    },
    defaultActive: true,
    priority: 11,
    applicableStudyTypes: ['rct', 'observational', 'single-arm', 'diagnostic', 'registry', 'phase-1', 'phase-2', 'phase-3', 'phase-4', 'medical-device'],
    modules: ['research-wizard'],
    validationRules: [
      'pico-population-defined',
      'pico-intervention-specified',
      'pico-comparison-identified',
      'pico-outcome-measurable',
      'hypothesis-variables-grounded',
      'hypothesis-schema-alignment',
      'hypothesis-statistical-feasibility'
    ],
    realTimeValidation: true,
    batchValidation: true,
    sidebar: {
      enabled: true,
      title: 'Hypothesis Formation Guide',
      showValidationStatus: true,
      showRecommendations: true,
      showRegulatoryReferences: false,
      sections: [
        {
          id: 'pico-framework',
          title: 'PICO Framework',
          type: 'checklist',
          content: [
            'Population clearly defined',
            'Intervention/Exposure specified',
            'Comparison group identified',
            'Outcome is measurable'
          ]
        },
        {
          id: 'grounding-validation',
          title: 'Variable Grounding',
          type: 'warnings',
          content: [
            'All variables mapped to schema',
            'No orphaned hypothesis terms',
            'Statistical feasibility confirmed'
          ]
        },
        {
          id: 'anti-hallucination',
          title: 'Anti-Hallucination Layer',
          type: 'best-practices',
          content: [
            'Claims must be testable',
            'Variables must exist in database',
            'Statistical power must be achievable',
            'Endpoints must be defined in protocol'
          ]
        }
      ]
    },
    modal: {
      enabled: true,
      title: 'Hypothesis Validation',
      showComplianceScore: true,
      showIssueBreakdown: true,
      allowProceedWithWarnings: false,
      requireAcknowledgment: true
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

// Helper function to get Seelie court personas (Co-Pilots)
export function getSeeliePersonas(): PersonaConfig[] {
  return getAllPersonas().filter(persona => persona.court === 'seelie');
}

// Helper function to get Unseelie court personas (Auditors)
export function getUnseeliePersonas(): PersonaConfig[] {
  return getAllPersonas().filter(persona => persona.court === 'unseelie');
}

// Helper function to get personas by court for a specific module
export function getPersonasForModuleByCourt(module: string): { seelie: PersonaConfig[]; unseelie: PersonaConfig[] } {
  const modulePersonas = getPersonasForModule(module);
  return {
    seelie: modulePersonas.filter(p => p.court === 'seelie'),
    unseelie: modulePersonas.filter(p => p.court === 'unseelie'),
  };
}