// Amendment Advisor - Protocol Change Impact Analysis and Amendment Classification

import type { ValidationRule, ValidationIssue, ValidationContext } from '../core/personaTypes';

// Helper function to create issues
function createIssue(
  id: string,
  severity: 'critical' | 'warning' | 'info',
  title: string,
  description: string,
  recommendation: string,
  citation?: string,
  field?: string,
  autoFixAvailable: boolean = false
): ValidationIssue {
  return {
    id,
    personaId: 'amendment-advisor',
    severity,
    category: 'amendment-impact',
    title,
    description,
    recommendation,
    location: {
      module: 'protocol-workbench',
      tab: 'protocol',
      field
    },
    citation,
    autoFixAvailable,
    studyTypeSpecific: false
  };
}

// ============================================================================
// AMENDMENT CLASSIFICATION
// ============================================================================

export const AMENDMENT_CLASSIFICATION: ValidationRule = {
  id: 'amendment-classification',
  name: 'Amendment Classification (Substantial vs Non-Substantial)',
  personaId: 'amendment-advisor',
  category: 'amendment-impact',
  severity: 'critical',
  description: 'Classify protocol changes to determine IRB review requirements',
  check: (context: ValidationContext): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    
    // Check if amendment metadata exists
    if (!context.amendment) {
      return issues; // No amendment in progress
    }

    const amendment = context.amendment;
    const changes = amendment.changes || [];

    // Substantial change indicators
    const substantialChangeTypes = [
      'primary-endpoint',
      'sample-size-increase',
      'eligibility-criteria',
      'safety-monitoring',
      'study-duration',
      'intervention-dose',
      'new-safety-concern'
    ];

    const hasSubstantialChanges = changes.some((change: any) =>
      substantialChangeTypes.includes(change.type)
    );

    // Check if classification is missing
    if (!amendment.classification) {
      issues.push(createIssue(
        'amendment-classification-missing',
        'critical',
        'Amendment Classification Required',
        'Every protocol amendment must be classified as Substantial or Non-Substantial',
        'Classify this amendment: 1) Substantial amendments affect participant safety, rights, or data reliability (requires full IRB review), 2) Non-substantial amendments are administrative/minor (may qualify for expedited review). Document rationale.',
        'ICH E6(R2) Section 4.5.2, 21 CFR 312.30',
        'amendment.classification'
      ));
    } else if (hasSubstantialChanges && amendment.classification === 'non-substantial') {
      // Potential misclassification
      const substantialChangesList = changes
        .filter((c: any) => substantialChangeTypes.includes(c.type))
        .map((c: any) => c.description || c.type)
        .join(', ');

      issues.push(createIssue(
        'amendment-misclassification-risk',
        'critical',
        'Potential Amendment Misclassification',
        `Amendment classified as "Non-Substantial" but includes changes that typically require full IRB review: ${substantialChangesList}`,
        'Review classification. Changes to endpoints, eligibility, safety monitoring, or intervention typically constitute Substantial amendments requiring full IRB review. If uncertain, classify as Substantial (safer regulatory path).',
        'ICH E6(R2) Section 4.5.2',
        'amendment.classification'
      ));
    }

    return issues;
  }
};

// ============================================================================
// PRIMARY ENDPOINT CHANGES
// ============================================================================

export const PRIMARY_ENDPOINT_CHANGE_IMPACT: ValidationRule = {
  id: 'primary-endpoint-change-impact',
  name: 'Primary Endpoint Change Impact',
  personaId: 'amendment-advisor',
  category: 'amendment-impact',
  severity: 'critical',
  description: 'Primary endpoint changes have major regulatory and statistical implications',
  check: (context: ValidationContext): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    
    if (!context.amendment || !context.amendment.changes) {
      return issues;
    }

    const endpointChanges = context.amendment.changes.filter((c: any) =>
      c.type === 'primary-endpoint' || 
      c.field?.includes('primaryEndpoint')
    );

    if (endpointChanges.length === 0) {
      return issues;
    }

    endpointChanges.forEach((change: any) => {
      // Critical regulatory impact
      issues.push(createIssue(
        'primary-endpoint-change-regulatory',
        'critical',
        'Primary Endpoint Change: Full IRB Review Required',
        'Changing the primary endpoint is a Substantial amendment requiring full IRB approval',
        'Submit to IRB as Substantial Amendment. Include: 1) Rationale for change, 2) Impact on study validity, 3) Effect on enrolled participants, 4) Updated statistical analysis plan, 5) Updated informed consent (if participants affected).',
        'ICH E6(R2) Section 4.5.2, 21 CFR 312.30',
        'primaryEndpoint'
      ));

      // Statistical impact
      issues.push(createIssue(
        'primary-endpoint-change-statistical',
        'warning',
        'Primary Endpoint Change: Statistical Analysis Plan Update Required',
        'Primary endpoint changes invalidate existing sample size calculations and analysis plan',
        'Update Statistical Analysis Plan: 1) Recalculate sample size for new endpoint, 2) Define new analysis methods, 3) Address how change affects already-enrolled participants, 4) Consider pre-specifying as protocol violation or updating analysis population.',
        'ICH E9 Section 5.7',
        'statisticalPlan'
      ));

      // Data integrity impact
      if (context.dataCollection?.enrolledParticipants > 0) {
        issues.push(createIssue(
          'primary-endpoint-change-data-integrity',
          'critical',
          'Primary Endpoint Change: Risk to Data Integrity',
          `${context.dataCollection.enrolledParticipants} participants already enrolled. Endpoint change affects data interpretation`,
          'Address data integrity: 1) Was new endpoint collected for already-enrolled participants?, 2) Will analysis include only post-amendment participants?, 3) Conduct sensitivity analysis with old vs new endpoint?, 4) Consider stratifying analysis by pre/post-amendment enrollment.',
          'ICH E9 Section 5.7'
        ));
      }
    });

    return issues;
  }
};

// ============================================================================
// ELIGIBILITY CRITERIA CHANGES
// ============================================================================

export const ELIGIBILITY_CRITERIA_CHANGE_IMPACT: ValidationRule = {
  id: 'eligibility-criteria-change-impact',
  name: 'Eligibility Criteria Change Impact',
  personaId: 'amendment-advisor',
  category: 'amendment-impact',
  severity: 'warning',
  description: 'Eligibility changes affect study population and generalizability',
  check: (context: ValidationContext): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    
    if (!context.amendment || !context.amendment.changes) {
      return issues;
    }

    const eligibilityChanges = context.amendment.changes.filter((c: any) =>
      c.type === 'eligibility-criteria' ||
      c.field?.includes('inclusion') ||
      c.field?.includes('exclusion')
    );

    if (eligibilityChanges.length === 0) {
      return issues;
    }

    eligibilityChanges.forEach((change: any) => {
      const isExpanding = change.description?.toLowerCase().includes('expand') ||
                         change.description?.toLowerCase().includes('broaden') ||
                         change.description?.toLowerCase().includes('relax');

      const isRestricting = change.description?.toLowerCase().includes('restrict') ||
                           change.description?.toLowerCase().includes('narrow') ||
                           change.description?.toLowerCase().includes('tighten');

      if (isExpanding) {
        issues.push(createIssue(
          'eligibility-expansion',
          'warning',
          'Eligibility Expansion: Population Heterogeneity Risk',
          'Expanding eligibility criteria increases population heterogeneity and may dilute treatment effect',
          'Address in amendment: 1) Justify scientific rationale for expansion, 2) Consider stratifying analysis by pre/post-amendment enrollment, 3) Update sample size if statistical power affected, 4) Document in limitations section of final report.',
          'ICH E9 Section 2.2.1'
        ));

        // Check if enrollment is struggling
        if (context.dataCollection?.enrollmentRate === 'below-target') {
          issues.push(createIssue(
            'eligibility-expansion-enrollment-driven',
            'info',
            'Eligibility Expansion Appears Enrollment-Driven',
            'Expanding eligibility when enrollment is below target may indicate recruitment challenges',
            'Be transparent in reporting: 1) Clearly state eligibility was expanded due to recruitment challenges, 2) Conduct subgroup analysis of original vs expanded population, 3) Discuss potential selection bias in final report.',
            'ICH E9 Section 2.2.1'
          ));
        }
      }

      if (isRestricting) {
        issues.push(createIssue(
          'eligibility-restriction',
          'warning',
          'Eligibility Restriction: Generalizability Impact',
          'Restricting eligibility criteria reduces study generalizability',
          'Address in amendment: 1) Justify restriction (e.g., safety concern, new scientific data), 2) Document how restriction affects study objectives, 3) Update recruitment plan and sample size if needed, 4) Consider impact on diversity and inclusion.',
          'ICH E9 Section 2.2.1'
        ));

        // If safety-driven
        if (change.description?.toLowerCase().includes('safety')) {
          issues.push(createIssue(
            'eligibility-restriction-safety',
            'critical',
            'Safety-Driven Eligibility Restriction: Expedited Reporting Required',
            'If eligibility restriction is due to safety concern, expedited IRB notification may be required',
            'Notify IRB immediately if restriction is due to: 1) Unanticipated safety issue, 2) New literature/data showing risk, 3) Adverse events in similar trials. Submit as Substantial Amendment with safety justification.',
            '21 CFR 312.32(c)(1)(i)',
            'safetyPlan'
          ));
        }
      }
    });

    return issues;
  }
};

// ============================================================================
// SAMPLE SIZE CHANGES
// ============================================================================

export const SAMPLE_SIZE_CHANGE_IMPACT: ValidationRule = {
  id: 'sample-size-change-impact',
  name: 'Sample Size Change Impact',
  personaId: 'amendment-advisor',
  category: 'amendment-impact',
  severity: 'warning',
  description: 'Sample size changes require justification and regulatory notification',
  check: (context: ValidationContext): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    
    if (!context.amendment || !context.amendment.changes) {
      return issues;
    }

    const sampleSizeChanges = context.amendment.changes.filter((c: any) =>
      c.type === 'sample-size-increase' ||
      c.type === 'sample-size-decrease' ||
      c.field?.includes('sampleSize') ||
      c.field?.includes('targetEnrollment')
    );

    if (sampleSizeChanges.length === 0) {
      return issues;
    }

    sampleSizeChanges.forEach((change: any) => {
      const isIncrease = change.type === 'sample-size-increase' ||
                        change.description?.toLowerCase().includes('increase');

      const isDecrease = change.type === 'sample-size-decrease' ||
                        change.description?.toLowerCase().includes('decrease');

      if (isIncrease) {
        issues.push(createIssue(
          'sample-size-increase',
          'warning',
          'Sample Size Increase: Justify and Update Power Analysis',
          'Increasing sample size requires statistical justification',
          'Provide in amendment: 1) Reason for increase (e.g., lower-than-expected effect size, higher variance, interim analysis), 2) Updated power calculation, 3) Impact on study timeline and budget, 4) Updated recruitment plan.',
          'ICH E9 Section 3.5'
        ));

        // Check if based on unblinded data
        if (context.studyDesign?.isBlinded) {
          issues.push(createIssue(
            'sample-size-increase-blinding-risk',
            'critical',
            'Sample Size Increase in Blinded Study: DMC Review Required',
            'Sample size increases in blinded studies risk compromising blinding if based on unblinded data',
            'Ensure: 1) Sample size re-estimation was based on BLINDED data (e.g., pooled variance, not treatment effect), 2) DMC reviewed and approved change, 3) Study statistician remains blinded, 4) Document in amendment that investigators remain blinded.',
            'ICH E9 Section 5.7'
          ));
        }
      }

      if (isDecrease) {
        issues.push(createIssue(
          'sample-size-decrease',
          'warning',
          'Sample Size Decrease: Statistical Power Impact',
          'Decreasing sample size reduces statistical power',
          'Justify in amendment: 1) Reason for decrease (e.g., higher-than-expected effect size, futility, enrollment challenges), 2) Recalculate power with new sample size, 3) If power <80%, consider stopping study or revising objectives to exploratory, 4) Document limitations in final report.',
          'ICH E9 Section 3.5'
        ));

        // If enrollment-driven
        if (context.dataCollection?.enrollmentRate === 'below-target') {
          issues.push(createIssue(
            'sample-size-decrease-enrollment-driven',
            'critical',
            'Sample Size Decrease Due to Enrollment: Risk to Validity',
            'Reducing sample size because enrollment is difficult threatens study validity',
            'Consider alternatives: 1) Extend enrollment period, 2) Add recruitment sites, 3) Revise eligibility criteria, 4) If must reduce, consider changing primary objective to exploratory/hypothesis-generating and plan larger confirmatory trial.',
            'ICH E9 Section 3.5'
          ));
        }
      }
    });

    return issues;
  }
};

// ============================================================================
// INFORMED CONSENT UPDATES
// ============================================================================

export const INFORMED_CONSENT_UPDATE_REQUIREMENT: ValidationRule = {
  id: 'informed-consent-update-requirement',
  name: 'Informed Consent Update Requirement',
  personaId: 'amendment-advisor',
  category: 'amendment-impact',
  severity: 'critical',
  description: 'Determine if enrolled participants need to be re-consented',
  check: (context: ValidationContext): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    
    if (!context.amendment || !context.amendment.changes) {
      return issues;
    }

    // Changes that typically require re-consent
    const reConsentTriggers = [
      'primary-endpoint',
      'eligibility-criteria',
      'intervention-dose',
      'new-safety-concern',
      'study-duration',
      'new-procedure',
      'safety-monitoring'
    ];

    const triggeredChanges = context.amendment.changes.filter((c: any) =>
      reConsentTriggers.includes(c.type)
    );

    if (triggeredChanges.length === 0) {
      return issues;
    }

    // Check if re-consent plan exists
    if (!context.amendment.reConsentPlan) {
      issues.push(createIssue(
        'reconsent-plan-missing',
        'critical',
        'Re-Consent Plan Required for Enrolled Participants',
        `${triggeredChanges.length} protocol changes may require re-consenting already-enrolled participants`,
        'Develop re-consent plan: 1) Identify which changes require re-consent (any affecting risks, benefits, or procedures), 2) Update informed consent document, 3) Create process to re-consent enrolled participants, 4) Track re-consent status, 5) Define what happens if participant refuses re-consent.',
        'ICH E6(R2) Section 4.8.9, 21 CFR 50.25',
        'amendment.reConsentPlan'
      ));
    }

    // Check for new safety information
    const safetyChanges = context.amendment.changes.filter((c: any) =>
      c.type === 'new-safety-concern' ||
      c.description?.toLowerCase().includes('safety') ||
      c.description?.toLowerCase().includes('adverse')
    );

    if (safetyChanges.length > 0) {
      issues.push(createIssue(
        'reconsent-new-safety-info',
        'critical',
        'New Safety Information: Immediate Re-Consent Required',
        'New safety information must be communicated to enrolled participants promptly',
        'Immediate action required: 1) Notify IRB within 5 days, 2) Update informed consent document immediately, 3) Re-consent all enrolled participants ASAP, 4) Document who was re-consented and when, 5) Consider if study should be paused pending re-consent.',
        '21 CFR 312.32(c)(1)(i), ICH E6(R2) 4.8.9',
        'informedConsent'
      ));
    }

    return issues;
  }
};

// ============================================================================
// AMENDMENT SUBMISSION TIMELINE
// ============================================================================

export const AMENDMENT_SUBMISSION_TIMELINE: ValidationRule = {
  id: 'amendment-submission-timeline',
  name: 'Amendment Submission Timeline',
  personaId: 'amendment-advisor',
  category: 'amendment-impact',
  severity: 'warning',
  description: 'Track amendment submission and approval timeline',
  check: (context: ValidationContext): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    
    if (!context.amendment) {
      return issues;
    }

    const amendment = context.amendment;

    // Check if submission date is set
    if (!amendment.submissionDate && amendment.status !== 'draft') {
      issues.push(createIssue(
        'amendment-submission-date-missing',
        'warning',
        'Amendment Submission Date Not Documented',
        'Track when amendment was submitted to IRB for audit trail',
        'Document submission date for regulatory records. This establishes the timeline for IRB review and implementation.',
        'ICH E6(R2) Section 8',
        'amendment.submissionDate'
      ));
    }

    // Check for approval status
    if (amendment.status === 'pending-approval') {
      const submissionDate = amendment.submissionDate ? new Date(amendment.submissionDate) : null;
      const today = new Date();
      const daysPending = submissionDate 
        ? Math.floor((today.getTime() - submissionDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      if (daysPending > 30) {
        issues.push(createIssue(
          'amendment-approval-delayed',
          'info',
          `Amendment Pending IRB Approval for ${daysPending} Days`,
          'Consider following up with IRB if approval is delayed beyond 30 days',
          'Action: 1) Contact IRB to inquire about review status, 2) Check if IRB requested additional information, 3) Document any delays for audit trail, 4) Consider if study activities should continue pending approval (consult IRB).',
          'ICH E6(R2) Section 3.3.1'
        ));
      }
    }

    // Check if implementation plan exists for approved amendments
    if (amendment.status === 'approved' && !amendment.implementationPlan) {
      issues.push(createIssue(
        'amendment-implementation-plan-missing',
        'warning',
        'Amendment Approved: Implementation Plan Required',
        'Approved amendments need documented implementation plan',
        'Create implementation plan: 1) Set implementation date, 2) Train study staff on changes, 3) Update study documents (manuals, worksheets), 4) Update electronic systems (EDC, randomization), 5) Communicate to all sites (multi-site studies), 6) Track implementation completion.',
        'ICH E6(R2) Section 5.2.2',
        'amendment.implementationPlan'
      ));
    }

    return issues;
  }
};

// ============================================================================
// DATA MANAGEMENT SYSTEM UPDATES
// ============================================================================

export const DMS_UPDATE_REQUIREMENT: ValidationRule = {
  id: 'dms-update-requirement',
  name: 'Data Management System Update',
  personaId: 'amendment-advisor',
  category: 'amendment-impact',
  severity: 'warning',
  description: 'Protocol changes often require EDC/database updates',
  check: (context: ValidationContext): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    
    if (!context.amendment || !context.amendment.changes) {
      return issues;
    }

    // Changes that affect database
    const databaseImpactChanges = context.amendment.changes.filter((c: any) =>
      ['primary-endpoint', 'new-assessment', 'new-procedure', 'visit-schedule'].includes(c.type)
    );

    if (databaseImpactChanges.length === 0) {
      return issues;
    }

    if (!context.amendment.dmsUpdatePlan) {
      issues.push(createIssue(
        'dms-update-plan-missing',
        'warning',
        'Protocol Changes Require Database Updates',
        `${databaseImpactChanges.length} changes will require updates to data collection systems`,
        'Plan database updates: 1) Identify required EDC/CRF changes, 2) Determine if new variables/forms needed, 3) Plan implementation timing (must match protocol implementation), 4) Test changes in UAT environment, 5) Train site staff on new data collection, 6) Update data validation rules.',
        'ICH E6(R2) Section 5.5.3',
        'amendment.dmsUpdatePlan'
      ));
    }

    // Check if historical data needs handling
    if (context.dataCollection?.enrolledParticipants > 0) {
      issues.push(createIssue(
        'dms-historical-data-handling',
        'info',
        'Define How to Handle Historical Data',
        'Database changes affect data already collected from enrolled participants',
        'Address historical data: 1) Will old data be migrated to new structure?, 2) Create version variables to track pre/post-amendment data, 3) Document data dictionary changes, 4) Plan how to analyze mixed pre/post-amendment data, 5) Ensure audit trail captures database version.',
        'ICH E6(R2) Section 5.5.3'
      ));
    }

    return issues;
  }
};

// ============================================================================
// AMENDMENT IMPACT ON PUBLISHED RESULTS
// ============================================================================

export const PUBLICATION_TRANSPARENCY_REQUIREMENT: ValidationRule = {
  id: 'publication-transparency-requirement',
  name: 'Publication Transparency for Amendments',
  personaId: 'amendment-advisor',
  category: 'amendment-impact',
  severity: 'info',
  description: 'Major amendments must be disclosed in publications',
  check: (context: ValidationContext): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    
    if (!context.amendment || !context.amendment.changes) {
      return issues;
    }

    // Major changes that must be disclosed
    const majorChanges = context.amendment.changes.filter((c: any) =>
      ['primary-endpoint', 'sample-size-increase', 'sample-size-decrease', 
       'eligibility-criteria', 'analysis-plan'].includes(c.type)
    );

    if (majorChanges.length === 0) {
      return issues;
    }

    issues.push(createIssue(
      'amendment-publication-disclosure',
      'info',
      'Major Protocol Changes Must Be Disclosed in Publications',
      `${majorChanges.length} major changes should be transparently reported in study publications`,
      'Publication transparency: 1) Describe changes in Methods section, 2) State rationale for changes, 3) Indicate timing relative to enrollment (before/during), 4) If endpoint changed, report results for both old and new endpoints if possible, 5) Discuss potential impact on study interpretation in Discussion/Limitations.',
      'ICMJE Recommendations, CONSORT Extension',
      'publicationPlan'
    ));

    // ClinicalTrials.gov update
    if (context.studyDesign?.isRegistered) {
      issues.push(createIssue(
        'amendment-registry-update',
        'info',
        'Update ClinicalTrials.gov with Protocol Changes',
        'Major protocol amendments should be updated in trial registry within 30 days',
        'Update trial registry: 1) Log into ClinicalTrials.gov, 2) Update relevant fields (endpoints, sample size, eligibility), 3) Add comment explaining changes, 4) Submit update (must be within 30 days of IRB approval for major changes).',
        'FDAAA 801, ICMJE'
      ));
    }

    return issues;
  }
};

// ============================================================================
// EXPORT ALL RULES
// ============================================================================

export const AMENDMENT_VALIDATION_RULES: ValidationRule[] = [
  AMENDMENT_CLASSIFICATION,
  PRIMARY_ENDPOINT_CHANGE_IMPACT,
  ELIGIBILITY_CRITERIA_CHANGE_IMPACT,
  SAMPLE_SIZE_CHANGE_IMPACT,
  INFORMED_CONSENT_UPDATE_REQUIREMENT,
  AMENDMENT_SUBMISSION_TIMELINE,
  DMS_UPDATE_REQUIREMENT,
  PUBLICATION_TRANSPARENCY_REQUIREMENT
];
