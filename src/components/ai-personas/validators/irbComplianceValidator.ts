// IRB Compliance Tracker - Regulatory Submission Validation

import type { ValidationRule, ValidationIssue, ValidationContext } from '../core/personaTypes';

// Helper function to create issues
function createIssue(
  id: string,
  severity: 'critical' | 'warning' | 'info',
  title: string,
  description: string,
  recommendation: string,
  citation?: string,
  field?: string
): ValidationIssue {
  return {
    id,
    personaId: 'irb-compliance-tracker',
    severity,
    category: 'regulatory-compliance',
    title,
    description,
    recommendation,
    location: {
      module: 'ethics-board',
      tab: 'irb-submission',
      field
    },
    citation,
    autoFixAvailable: false,
    studyTypeSpecific: false
  };
}

// ============================================================================
// INFORMED CONSENT ELEMENT VALIDATION (21 CFR 50.25)
// ============================================================================

export const INFORMED_CONSENT_BASIC_ELEMENTS: ValidationRule = {
  id: 'informed-consent-basic-elements',
  name: 'Informed Consent Basic Elements (21 CFR 50.25)',
  personaId: 'irb-compliance-tracker',
  category: 'regulatory-compliance',
  severity: 'critical',
  description: 'Required basic elements of informed consent per FDA regulations',
  check: (context: ValidationContext): ValidationIssue[] => {
    const protocol = context.protocolMetadata;
    const issues: ValidationIssue[] = [];

    if (!protocol) return issues;

    // 21 CFR 50.25(a) - Basic elements
    const requiredElements = [
      {
        key: 'studyPurpose',
        name: 'Statement that study involves research',
        citation: '21 CFR 50.25(a)(1)'
      },
      {
        key: 'studyDuration',
        name: 'Expected duration of participation',
        citation: '21 CFR 50.25(a)(2)'
      },
      {
        key: 'studyProcedures',
        name: 'Description of procedures',
        citation: '21 CFR 50.25(a)(3)'
      },
      {
        key: 'experimentalProcedures',
        name: 'Identification of experimental procedures',
        citation: '21 CFR 50.25(a)(4)'
      },
      {
        key: 'foreseableRisks',
        name: 'Foreseeable risks or discomforts',
        citation: '21 CFR 50.25(a)(5)'
      },
      {
        key: 'expectedBenefits',
        name: 'Expected benefits',
        citation: '21 CFR 50.25(a)(6)'
      },
      {
        key: 'alternativeProcedures',
        name: 'Disclosure of alternative procedures',
        citation: '21 CFR 50.25(a)(7)'
      },
      {
        key: 'confidentialityStatement',
        name: 'Statement on confidentiality',
        citation: '21 CFR 50.25(a)(8)'
      }
    ];

    requiredElements.forEach(element => {
      const value = protocol[element.key];
      
      if (!value || value === '' || (typeof value === 'string' && value.trim() === '')) {
        issues.push(createIssue(
          `consent-missing-${element.key}`,
          'critical',
          `Missing: ${element.name}`,
          `Informed consent document must include: ${element.name}`,
          `Add this required element to your informed consent document. This is mandated by FDA regulations for IRB submission.`,
          element.citation,
          element.key
        ));
      }
    });

    return issues;
  }
};

export const INFORMED_CONSENT_ADDITIONAL_ELEMENTS: ValidationRule = {
  id: 'informed-consent-additional-elements',
  name: 'Informed Consent Additional Elements (21 CFR 50.25(b))',
  personaId: 'irb-compliance-tracker',
  category: 'regulatory-compliance',
  severity: 'warning',
  description: 'Additional elements that may be required based on study design',
  check: (context: ValidationContext): ValidationIssue[] => {
    const protocol = context.protocolMetadata;
    const issues: ValidationIssue[] = [];

    if (!protocol) return issues;

    const studyDesign = context.studyDesign;

    // Check for compensation statement (if applicable)
    if (!protocol.compensationStatement) {
      issues.push(createIssue(
        'consent-missing-compensation',
        'warning',
        'Consider Adding: Compensation Statement',
        'Statement regarding compensation for participation or injury',
        'If participants will be compensated or if compensation is available for injury, this must be disclosed.',
        '21 CFR 50.25(b)(1)'
      ));
    }

    // Check for contact information
    if (!protocol.investigatorContact) {
      issues.push(createIssue(
        'consent-missing-contact',
        'warning',
        'Missing: Investigator Contact Information',
        'Contact information for questions about research rights',
        'Provide contact information for: 1) Principal Investigator, 2) IRB contact for research rights questions',
        '21 CFR 50.25(b)(2)'
      ));
    }

    // Check for voluntary participation statement
    if (!protocol.voluntaryParticipation) {
      issues.push(createIssue(
        'consent-missing-voluntary',
        'critical',
        'Missing: Voluntary Participation Statement',
        'Statement that participation is voluntary and refusal has no penalty',
        'Must explicitly state that participation is voluntary and that refusal to participate or withdrawal will not result in penalty or loss of benefits.',
        '21 CFR 50.25(b)(3)'
      ));
    }

    return issues;
  }
};

// ============================================================================
// ICH-GCP COMPLIANCE VALIDATION (ICH E6)
// ============================================================================

export const ICH_GCP_PROTOCOL_REQUIREMENTS: ValidationRule = {
  id: 'ich-gcp-protocol-requirements',
  name: 'ICH-GCP Protocol Requirements (ICH E6, Section 6)',
  personaId: 'irb-compliance-tracker',
  category: 'regulatory-compliance',
  severity: 'critical',
  description: 'Essential protocol elements per ICH-GCP guidelines',
  check: (context: ValidationContext): ValidationIssue[] => {
    const protocol = context.protocolMetadata;
    const issues: ValidationIssue[] = [];

    if (!protocol) return issues;

    const requiredElements = [
      {
        key: 'protocolTitle',
        name: 'Protocol Title',
        citation: 'ICH E6, 6.1'
      },
      {
        key: 'protocolNumber',
        name: 'Protocol Identification Number',
        citation: 'ICH E6, 6.2'
      },
      {
        key: 'principalInvestigator',
        name: 'Principal Investigator Name',
        citation: 'ICH E6, 6.3'
      },
      {
        key: 'studyObjectives',
        name: 'Objectives and Purpose',
        citation: 'ICH E6, 6.4'
      },
      {
        key: 'studyDesignType',
        name: 'Study Design',
        citation: 'ICH E6, 6.5'
      },
      {
        key: 'selectionCriteria',
        name: 'Selection and Withdrawal Criteria',
        citation: 'ICH E6, 6.6'
      },
      {
        key: 'treatmentPlan',
        name: 'Treatment of Subjects',
        citation: 'ICH E6, 6.7'
      },
      {
        key: 'efficacyAssessment',
        name: 'Assessment of Efficacy',
        citation: 'ICH E6, 6.8'
      },
      {
        key: 'safetyAssessment',
        name: 'Assessment of Safety',
        citation: 'ICH E6, 6.9'
      },
      {
        key: 'statisticsSection',
        name: 'Statistics Section',
        citation: 'ICH E6, 6.10'
      }
    ];

    requiredElements.forEach(element => {
      const value = protocol[element.key];
      
      if (!value || value === '' || (typeof value === 'string' && value.trim() === '')) {
        issues.push(createIssue(
          `ich-gcp-missing-${element.key}`,
          'critical',
          `ICH-GCP: Missing ${element.name}`,
          `Protocol must include: ${element.name}`,
          `This is a required element for ICH-GCP compliance. Add this section to your protocol document.`,
          element.citation,
          element.key
        ));
      }
    });

    return issues;
  }
};

// ============================================================================
// IRB SUBMISSION READINESS CHECKS
// ============================================================================

export const IRB_SUBMISSION_DOCUMENTATION: ValidationRule = {
  id: 'irb-submission-documentation',
  name: 'IRB Submission Documentation Checklist',
  personaId: 'irb-compliance-tracker',
  category: 'regulatory-compliance',
  severity: 'critical',
  description: 'Required documents for IRB submission package',
  check: (context: ValidationContext): ValidationIssue[] => {
    const protocol = context.protocolMetadata;
    const issues: ValidationIssue[] = [];

    if (!protocol) return issues;

    const requiredDocuments = [
      {
        key: 'irbApplication',
        name: 'IRB Application Form'
      },
      {
        key: 'protocolDocument',
        name: 'Full Protocol Document'
      },
      {
        key: 'informedConsentForm',
        name: 'Informed Consent Form(s)'
      },
      {
        key: 'investigatorBrochure',
        name: 'Investigator\'s Brochure (if applicable)'
      },
      {
        key: 'recruitmentMaterials',
        name: 'Recruitment Materials'
      },
      {
        key: 'cv1572',
        name: 'FDA Form 1572 (for IND studies)'
      },
      {
        key: 'budgetInformation',
        name: 'Budget and Funding Information'
      },
      {
        key: 'conflictOfInterest',
        name: 'Conflict of Interest Disclosure'
      }
    ];

    requiredDocuments.forEach(doc => {
      const submitted = protocol[`${doc.key}Submitted`];
      
      if (!submitted) {
        issues.push(createIssue(
          `irb-doc-missing-${doc.key}`,
          'critical',
          `Missing Document: ${doc.name}`,
          `IRB submission package must include: ${doc.name}`,
          `Upload this required document before submitting to IRB. Contact your IRB coordinator if you have questions about format.`
        ));
      }
    });

    return issues;
  }
};

export const VULNERABLE_POPULATION_PROTECTIONS: ValidationRule = {
  id: 'vulnerable-population-protections',
  name: 'Vulnerable Population Additional Protections',
  personaId: 'irb-compliance-tracker',
  category: 'regulatory-compliance',
  severity: 'critical',
  description: 'Additional safeguards for vulnerable populations',
  check: (context: ValidationContext): ValidationIssue[] => {
    const protocol = context.protocolMetadata;
    const issues: ValidationIssue[] = [];

    if (!protocol) return issues;

    const vulnerablePopulations = protocol.vulnerablePopulations || [];

    if (vulnerablePopulations.length === 0) return issues;

    // Check for pregnant women (Subpart B)
    if (vulnerablePopulations.includes('pregnant_women')) {
      if (!protocol.pregnantWomenJustification) {
        issues.push(createIssue(
          'vulnerable-pregnant-justification',
          'critical',
          'Pregnant Women: Missing Justification',
          'Study includes pregnant women but lacks required justification',
          'Per 45 CFR 46 Subpart B, provide: 1) Scientific justification for including pregnant women, 2) Risk assessment, 3) Statement of potential benefit',
          '45 CFR 46 Subpart B'
        ));
      }
    }

    // Check for children (Subpart D)
    if (vulnerablePopulations.includes('children')) {
      if (!protocol.parentalPermission) {
        issues.push(createIssue(
          'vulnerable-children-permission',
          'critical',
          'Children: Missing Parental Permission Process',
          'Study includes children but lacks parental permission documentation',
          'Per 45 CFR 46 Subpart D, document: 1) Parental permission process, 2) Child assent process (if appropriate), 3) Risk category determination',
          '45 CFR 46 Subpart D'
        ));
      }

      if (!protocol.childAssentProcess) {
        issues.push(createIssue(
          'vulnerable-children-assent',
          'warning',
          'Children: Consider Child Assent Process',
          'Child assent should be obtained when appropriate',
          'If children are capable of providing assent (typically age 7+), document the assent process.',
          '45 CFR 46.408'
        ));
      }
    }

    // Check for prisoners (Subpart C)
    if (vulnerablePopulations.includes('prisoners')) {
      if (!protocol.prisonerProtections) {
        issues.push(createIssue(
          'vulnerable-prisoners-protections',
          'critical',
          'Prisoners: Missing Additional Protections',
          'Study includes prisoners but lacks required protections',
          'Per 45 CFR 46 Subpart C, address: 1) IRB must have prisoner representative, 2) Risks must be commensurate with non-prisoner population, 3) Selection must be fair',
          '45 CFR 46 Subpart C'
        ));
      }
    }

    return issues;
  }
};

// ============================================================================
// RISK ASSESSMENT VALIDATION
// ============================================================================

export const RISK_BENEFIT_ASSESSMENT: ValidationRule = {
  id: 'risk-benefit-assessment',
  name: 'Risk-Benefit Assessment',
  personaId: 'irb-compliance-tracker',
  category: 'regulatory-compliance',
  severity: 'warning',
  description: 'Comprehensive risk-benefit analysis required for IRB review',
  check: (context: ValidationContext): ValidationIssue[] => {
    const protocol = context.protocolMetadata;
    const issues: ValidationIssue[] = [];

    if (!protocol) return issues;

    // Check if risk level is documented
    if (!protocol.riskLevel) {
      issues.push(createIssue(
        'risk-level-undefined',
        'warning',
        'Risk Level Not Specified',
        'Overall risk level should be documented for IRB review',
        'Specify whether study is: Minimal Risk, Greater than Minimal Risk, or Significant Risk. This helps IRB determine review level.',
        '45 CFR 46.111'
      ));
    }

    // Check if risks are minimized
    if (!protocol.riskMinimizationStrategy) {
      issues.push(createIssue(
        'risk-minimization-missing',
        'warning',
        'Risk Minimization Strategy Not Documented',
        'IRB must assess whether risks are minimized',
        'Document specific steps taken to minimize risks to participants. This is a key IRB consideration.',
        '45 CFR 46.111(a)(1)'
      ));
    }

    // Check if risks are reasonable relative to benefits
    if (!protocol.riskBenefitRationale) {
      issues.push(createIssue(
        'risk-benefit-rationale',
        'warning',
        'Risk-Benefit Rationale Not Documented',
        'IRB must determine that risks are reasonable in relation to anticipated benefits',
        'Provide explicit rationale for why study risks are justified by potential benefits to participants and/or society.',
        '45 CFR 46.111(a)(2)'
      ));
    }

    return issues;
  }
};

// ============================================================================
// DATA SAFETY MONITORING PLAN
// ============================================================================

export const DATA_SAFETY_MONITORING_PLAN: ValidationRule = {
  id: 'data-safety-monitoring-plan',
  name: 'Data Safety Monitoring Plan',
  personaId: 'irb-compliance-tracker',
  category: 'regulatory-compliance',
  severity: 'warning',
  description: 'Data and safety monitoring appropriate to risk level',
  check: (context: ValidationContext): ValidationIssue[] => {
    const protocol = context.protocolMetadata;
    const issues: ValidationIssue[] = [];

    if (!protocol) return issues;

    const riskLevel = protocol.riskLevel;
    const hasDSMB = protocol.hasDSMB;
    const hasDSMP = protocol.hasDSMP;

    // Greater than minimal risk studies should have monitoring plan
    if (riskLevel === 'greater_than_minimal' || riskLevel === 'significant') {
      if (!hasDSMP && !hasDSMB) {
        issues.push(createIssue(
          'dsmp-missing',
          'warning',
          'Data Safety Monitoring Plan Required',
          'Higher risk studies require a data and safety monitoring plan',
          'For studies with greater than minimal risk, establish either: 1) Data Safety Monitoring Board (DSMB) for multi-site trials, or 2) Data Safety Monitoring Plan (DSMP) for single-site studies.',
          'NIH Policy on Data and Safety Monitoring'
        ));
      }
    }

    // Check for stopping rules
    if ((riskLevel === 'greater_than_minimal' || riskLevel === 'significant') && !protocol.stoppingRules) {
      issues.push(createIssue(
        'stopping-rules-missing',
        'warning',
        'Stopping Rules Not Defined',
        'Studies with significant risk should define stopping rules',
        'Define criteria for early termination due to: 1) Safety concerns, 2) Futility, 3) Overwhelming efficacy. Include who makes this decision.',
        'ICH E6, Section 5.5.2'
      ));
    }

    return issues;
  }
};

// ============================================================================
// EXPORT ALL RULES
// ============================================================================

export const IRB_COMPLIANCE_VALIDATION_RULES: ValidationRule[] = [
  INFORMED_CONSENT_BASIC_ELEMENTS,
  INFORMED_CONSENT_ADDITIONAL_ELEMENTS,
  ICH_GCP_PROTOCOL_REQUIREMENTS,
  IRB_SUBMISSION_DOCUMENTATION,
  VULNERABLE_POPULATION_PROTECTIONS,
  RISK_BENEFIT_ASSESSMENT,
  DATA_SAFETY_MONITORING_PLAN
];
