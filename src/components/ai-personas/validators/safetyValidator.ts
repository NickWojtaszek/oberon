// Safety Vigilance Monitor - Adverse Event and SAE Monitoring

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
    personaId: 'safety-vigilance',
    severity,
    category: 'safety-monitoring',
    title,
    description,
    recommendation,
    location: {
      module: 'database',
      tab: 'safety',
      field
    },
    citation,
    autoFixAvailable: false,
    studyTypeSpecific: false
  };
}

// ============================================================================
// ADVERSE EVENT DOCUMENTATION
// ============================================================================

export const AE_REQUIRED_FIELDS: ValidationRule = {
  id: 'ae-required-fields',
  name: 'Adverse Event Required Fields',
  personaId: 'safety-vigilance',
  category: 'safety-monitoring',
  severity: 'critical',
  description: 'All adverse events must have complete documentation',
  check: (context: ValidationContext): ValidationIssue[] => {
    const records = context.dataRecords || [];
    const issues: ValidationIssue[] = [];

    // Filter for AE/SAE records
    const aeRecords = records.filter(r => 
      r.table === 'adverse_events' || 
      r.table === 'serious_adverse_events' ||
      Object.keys(r.data).some(k => k.toLowerCase().includes('adverse'))
    );

    if (aeRecords.length === 0) return issues;

    const requiredFields = [
      { field: 'event_term', name: 'Event Term/Description' },
      { field: 'onset_date', name: 'Onset Date' },
      { field: 'severity', name: 'Severity Grade' },
      { field: 'relationship', name: 'Relationship to Study Intervention' },
      { field: 'outcome', name: 'Outcome' }
    ];

    aeRecords.forEach((record, idx) => {
      requiredFields.forEach(({ field, name }) => {
        const value = record.data[field];
        if (!value || value === '' || (typeof value === 'string' && value.trim() === '')) {
          issues.push(createIssue(
            `ae-missing-${field}-${idx}`,
            'critical',
            `AE Record ${idx + 1}: Missing ${name}`,
            `Adverse event record is incomplete. All AEs must document: ${name}`,
            `Complete the ${name} field for this adverse event. This is required for regulatory compliance and safety monitoring.`,
            'ICH E2A: Clinical Safety Data Management',
            field
          ));
        }
      });
    });

    return issues;
  }
};

// ============================================================================
// SERIOUS ADVERSE EVENT (SAE) IDENTIFICATION
// ============================================================================

export const SAE_CRITERIA_CHECK: ValidationRule = {
  id: 'sae-criteria-check',
  name: 'Serious Adverse Event Criteria',
  personaId: 'safety-vigilance',
  category: 'safety-monitoring',
  severity: 'critical',
  description: 'Events meeting SAE criteria must be flagged as serious',
  check: (context: ValidationContext): ValidationIssue[] => {
    const records = context.dataRecords || [];
    const issues: ValidationIssue[] = [];

    const aeRecords = records.filter(r => 
      r.table === 'adverse_events' || 
      Object.keys(r.data).some(k => k.toLowerCase().includes('adverse'))
    );

    aeRecords.forEach((record, idx) => {
      const outcome = String(record.data.outcome || '').toLowerCase();
      const severity = String(record.data.severity || '').toLowerCase();
      const isSerious = record.data.is_serious || record.data.serious;

      // SAE criteria (ICH E2A):
      // 1. Death
      // 2. Life-threatening
      // 3. Hospitalization (initial or prolonged)
      // 4. Disability/Incapacity
      // 5. Congenital anomaly
      // 6. Medically important event

      const saeCriteriaMet = 
        outcome.includes('death') ||
        outcome.includes('fatal') ||
        severity.includes('life-threatening') ||
        severity.includes('grade 5') ||
        outcome.includes('hospitalization') ||
        outcome.includes('hospitalized') ||
        outcome.includes('disability') ||
        outcome.includes('congenital');

      if (saeCriteriaMet && !isSerious) {
        issues.push(createIssue(
          `sae-not-flagged-${idx}`,
          'critical',
          `Potential SAE Not Flagged: Record ${idx + 1}`,
          `Event meets SAE criteria but is not flagged as serious`,
          `Review this event and flag as SAE if it meets any criteria: 1) Death, 2) Life-threatening, 3) Hospitalization, 4) Disability, 5) Congenital anomaly, 6) Medically important. SAEs require expedited reporting to IRB and sponsor.`,
          'ICH E2A: Clinical Safety Data Management, Section 3',
          'is_serious'
        ));
      }
    });

    return issues;
  }
};

// ============================================================================
// EXPEDITED REPORTING REQUIREMENTS
// ============================================================================

export const SAE_EXPEDITED_REPORTING: ValidationRule = {
  id: 'sae-expedited-reporting',
  name: 'SAE Expedited Reporting Timeline',
  personaId: 'safety-vigilance',
  category: 'safety-monitoring',
  severity: 'critical',
  description: 'SAEs must be reported within regulatory timelines',
  check: (context: ValidationContext): ValidationIssue[] => {
    const records = context.dataRecords || [];
    const issues: ValidationIssue[] = [];

    const saeRecords = records.filter(r => 
      r.data.is_serious || 
      r.data.serious || 
      r.table === 'serious_adverse_events'
    );

    const currentDate = Date.now();

    saeRecords.forEach((record, idx) => {
      const onsetDate = record.data.onset_date;
      const reportedDate = record.data.reported_date || record.data.report_date;
      const isFatal = String(record.data.outcome || '').toLowerCase().includes('death');
      const isUnexpected = record.data.unexpected || record.data.is_unexpected;
      const isRelated = String(record.data.relationship || '').toLowerCase().includes('related');

      // Calculate days since onset
      let daysSinceOnset = null;
      if (onsetDate) {
        const onset = new Date(onsetDate).getTime();
        daysSinceOnset = Math.floor((currentDate - onset) / (1000 * 60 * 60 * 24));
      }

      // FDA/ICH reporting timelines:
      // - Fatal/life-threatening + unexpected + related: 7 calendar days (initial)
      // - Other SAEs: 15 calendar days
      const reportingDeadline = (isFatal && isUnexpected && isRelated) ? 7 : 15;

      if (!reportedDate && daysSinceOnset !== null && daysSinceOnset > reportingDeadline) {
        issues.push(createIssue(
          `sae-overdue-${idx}`,
          'critical',
          `SAE Reporting Overdue: ${daysSinceOnset} Days Since Onset`,
          `This SAE has not been reported within the required ${reportingDeadline}-day timeline`,
          `${isFatal && isUnexpected && isRelated 
            ? 'Fatal/unexpected/related SAEs require initial reporting to FDA within 7 calendar days.' 
            : 'SAEs must be reported to IRB and sponsor within 15 calendar days.'
          } Complete the SAE report immediately and document the reporting date.`,
          'FDA 21 CFR 312.32, ICH E2A',
          'reported_date'
        ));
      }

      // Check for follow-up if outcome is not resolved
      if (reportedDate && !String(record.data.outcome || '').toLowerCase().includes('resolved')) {
        const reported = new Date(reportedDate).getTime();
        const daysSinceReport = Math.floor((currentDate - reported) / (1000 * 60 * 60 * 24));
        
        if (daysSinceReport > 30) {
          issues.push(createIssue(
            `sae-followup-needed-${idx}`,
            'warning',
            `SAE Follow-Up Needed: ${daysSinceReport} Days Since Report`,
            `Ongoing SAE without recent follow-up documentation`,
            'Unresolved SAEs should have follow-up documentation at least every 30 days until resolution. Update the outcome and status.',
            'ICH E2A',
            'outcome'
          ));
        }
      }
    });

    return issues;
  }
};

// ============================================================================
// SEVERITY GRADING (CTCAE)
// ============================================================================

export const CTCAE_SEVERITY_GRADING: ValidationRule = {
  id: 'ctcae-severity-grading',
  name: 'CTCAE Severity Grading',
  personaId: 'safety-vigilance',
  category: 'safety-monitoring',
  severity: 'warning',
  description: 'Adverse events should use standardized CTCAE grading',
  check: (context: ValidationContext): ValidationIssue[] => {
    const records = context.dataRecords || [];
    const issues: ValidationIssue[] = [];

    const aeRecords = records.filter(r => 
      r.table === 'adverse_events' || 
      Object.keys(r.data).some(k => k.toLowerCase().includes('adverse'))
    );

    const validGrades = ['1', '2', '3', '4', '5', 'grade 1', 'grade 2', 'grade 3', 'grade 4', 'grade 5', 
                         'mild', 'moderate', 'severe', 'life-threatening', 'death'];

    aeRecords.forEach((record, idx) => {
      const severity = String(record.data.severity || record.data.grade || '').toLowerCase();

      if (!severity) return; // Already caught by required fields check

      const hasValidGrade = validGrades.some(grade => severity.includes(grade));

      if (!hasValidGrade) {
        issues.push(createIssue(
          `ctcae-invalid-grade-${idx}`,
          'warning',
          `Non-Standard Severity Grade: "${record.data.severity}"`,
          `Severity should follow CTCAE v5.0 grading: Grade 1 (Mild), 2 (Moderate), 3 (Severe), 4 (Life-threatening), 5 (Death)`,
          'Use standardized CTCAE grades for consistency and regulatory compliance. Grade 1: Mild, Grade 2: Moderate, Grade 3: Severe/hospitalization, Grade 4: Life-threatening, Grade 5: Death.',
          'CTCAE v5.0',
          'severity'
        ));
      }

      // Check for Grade 3+ without SAE flag
      const isGrade3Plus = severity.includes('grade 3') || severity.includes('grade 4') || 
                           severity.includes('grade 5') || severity.includes('severe') || 
                           severity.includes('life-threatening');
      const isSerious = record.data.is_serious || record.data.serious;

      if (isGrade3Plus && !isSerious) {
        issues.push(createIssue(
          `grade3-not-sae-${idx}`,
          'warning',
          `Grade 3+ Event Not Flagged as SAE`,
          `Severe/life-threatening events (Grade 3+) typically meet SAE criteria`,
          'Review whether this Grade 3+ event meets SAE criteria (hospitalization, disability, or medically important). Most Grade 3+ events are SAEs.',
          'CTCAE v5.0, ICH E2A',
          'is_serious'
        ));
      }
    });

    return issues;
  }
};

// ============================================================================
// CAUSALITY ASSESSMENT
// ============================================================================

export const CAUSALITY_ASSESSMENT: ValidationRule = {
  id: 'causality-assessment',
  name: 'Causality Assessment Completeness',
  personaId: 'safety-vigilance',
  category: 'safety-monitoring',
  severity: 'warning',
  description: 'All AEs should have causality assessment documented',
  check: (context: ValidationContext): ValidationIssue[] => {
    const records = context.dataRecords || [];
    const issues: ValidationIssue[] = [];

    const aeRecords = records.filter(r => 
      r.table === 'adverse_events' || 
      r.table === 'serious_adverse_events' ||
      Object.keys(r.data).some(k => k.toLowerCase().includes('adverse'))
    );

    const validRelationships = [
      'not related', 'unlikely', 'possible', 'probable', 'definite',
      'unrelated', 'possibly related', 'probably related', 'definitely related'
    ];

    aeRecords.forEach((record, idx) => {
      const relationship = String(record.data.relationship || '').toLowerCase();

      if (!relationship) return; // Caught by required fields check

      const hasValidAssessment = validRelationships.some(rel => relationship.includes(rel));

      if (!hasValidAssessment) {
        issues.push(createIssue(
          `causality-non-standard-${idx}`,
          'warning',
          `Non-Standard Causality Assessment: "${record.data.relationship}"`,
          `Causality should follow standardized categories`,
          'Use standardized causality categories: Not Related, Unlikely, Possible, Probable, or Definite. Consider temporal relationship, biological plausibility, and response to dechallenge/rechallenge.',
          'WHO-UMC Causality Categories',
          'relationship'
        ));
      }

      // Warn if SAE is "possibly related" or stronger
      const isSerious = record.data.is_serious || record.data.serious;
      const isRelated = relationship.includes('possible') || 
                        relationship.includes('probable') || 
                        relationship.includes('definite');

      if (isSerious && isRelated) {
        issues.push(createIssue(
          `sae-related-alert-${idx}`,
          'info',
          `Related SAE Detected`,
          `This SAE is assessed as possibly/probably/definitely related to study intervention`,
          'Related SAEs require heightened monitoring and may trigger additional safety reviews. Ensure timely reporting to sponsor, IRB, and regulatory authorities.',
          'ICH E2A',
          'relationship'
        ));
      }
    });

    return issues;
  }
};

// ============================================================================
// SAFETY SIGNAL DETECTION
// ============================================================================

export const SAFETY_SIGNAL_DETECTION: ValidationRule = {
  id: 'safety-signal-detection',
  name: 'Safety Signal Detection',
  personaId: 'safety-vigilance',
  category: 'safety-monitoring',
  severity: 'warning',
  description: 'Monitor for unexpected patterns or clusters of AEs',
  check: (context: ValidationContext): ValidationIssue[] => {
    const records = context.dataRecords || [];
    const issues: ValidationIssue[] = [];

    const aeRecords = records.filter(r => 
      r.table === 'adverse_events' || 
      Object.keys(r.data).some(k => k.toLowerCase().includes('adverse'))
    );

    if (aeRecords.length === 0) return issues;

    // Group AEs by term
    const aeByTerm: Record<string, number> = {};
    aeRecords.forEach(record => {
      const term = String(record.data.event_term || record.data.ae_term || '').toLowerCase();
      if (term) {
        aeByTerm[term] = (aeByTerm[term] || 0) + 1;
      }
    });

    // Detect clusters (>3 occurrences of same AE)
    Object.entries(aeByTerm).forEach(([term, count]) => {
      if (count >= 3) {
        issues.push(createIssue(
          `safety-signal-${term.replace(/\s+/g, '-')}`,
          'warning',
          `Potential Safety Signal: ${count} Cases of "${term}"`,
          `Multiple occurrences of the same adverse event detected`,
          `This AE has occurred ${count} times. Review for potential safety signal. Consider: 1) Is this expected based on mechanism of action?, 2) Is the frequency higher than anticipated?, 3) Does this warrant DSMB notification?`,
          'ICH E2F: Development Safety Update Report',
          'event_term'
        ));
      }
    });

    // Count SAEs
    const saeCount = aeRecords.filter(r => r.data.is_serious || r.data.serious).length;
    const totalAEs = aeRecords.length;
    const saeRate = totalAEs > 0 ? (saeCount / totalAEs) * 100 : 0;

    // Alert if SAE rate is high (>20%)
    if (saeRate > 20 && totalAEs >= 10) {
      issues.push(createIssue(
        'high-sae-rate',
        'warning',
        `High SAE Rate: ${saeRate.toFixed(1)}% (${saeCount}/${totalAEs})`,
        `Serious adverse event rate exceeds 20%`,
        `The current SAE rate (${saeRate.toFixed(1)}%) is elevated. Review overall safety profile and consider: 1) DSMB notification, 2) Protocol amendments for safety monitoring, 3) Risk-benefit re-assessment.`,
        'ICH E2F: DSUR'
      ));
    }

    return issues;
  }
};

// ============================================================================
// MISSING OUTCOME DOCUMENTATION
// ============================================================================

export const AE_OUTCOME_TRACKING: ValidationRule = {
  id: 'ae-outcome-tracking',
  name: 'Adverse Event Outcome Tracking',
  personaId: 'safety-vigilance',
  category: 'safety-monitoring',
  severity: 'warning',
  description: 'All AEs should have documented outcomes',
  check: (context: ValidationContext): ValidationIssue[] => {
    const records = context.dataRecords || [];
    const issues: ValidationIssue[] = [];

    const aeRecords = records.filter(r => 
      r.table === 'adverse_events' || 
      Object.keys(r.data).some(k => k.toLowerCase().includes('adverse'))
    );

    const validOutcomes = [
      'resolved', 'resolved with sequelae', 'resolving', 'not resolved', 
      'fatal', 'death', 'ongoing', 'recovered', 'recovering', 'unknown'
    ];

    aeRecords.forEach((record, idx) => {
      const outcome = String(record.data.outcome || '').toLowerCase();
      const onsetDate = record.data.onset_date;

      if (!outcome) return; // Caught by required fields

      const hasValidOutcome = validOutcomes.some(o => outcome.includes(o));

      if (!hasValidOutcome) {
        issues.push(createIssue(
          `outcome-non-standard-${idx}`,
          'warning',
          `Non-Standard Outcome: "${record.data.outcome}"`,
          `AE outcome should use standardized terminology`,
          'Use standardized outcomes: Resolved, Resolved with Sequelae, Resolving, Not Resolved, Fatal, or Unknown.',
          'ICH E2B (R3): Data Elements for AE Reporting',
          'outcome'
        ));
      }

      // Check for stale "ongoing" events
      if (outcome.includes('ongoing') || outcome.includes('not resolved')) {
        if (onsetDate) {
          const onset = new Date(onsetDate).getTime();
          const daysSinceOnset = Math.floor((Date.now() - onset) / (1000 * 60 * 60 * 24));
          
          if (daysSinceOnset > 60) {
            issues.push(createIssue(
              `outcome-stale-${idx}`,
              'info',
              `Long-Standing Ongoing AE: ${daysSinceOnset} Days`,
              `This AE has been ongoing for over 60 days without resolution`,
              'Review ongoing AEs periodically. Update the outcome status or provide follow-up documentation. Consider if this represents a chronic condition vs acute AE.',
              'Good Clinical Practice',
              'outcome'
            ));
          }
        }
      }
    });

    return issues;
  }
};

// ============================================================================
// CONCOMITANT MEDICATION DOCUMENTATION
// ============================================================================

export const CONCOMITANT_MEDICATION_CHECK: ValidationRule = {
  id: 'concomitant-medication-check',
  name: 'Concomitant Medication for AE Treatment',
  personaId: 'safety-vigilance',
  category: 'safety-monitoring',
  severity: 'info',
  description: 'Severe AEs should document concomitant medications used for treatment',
  check: (context: ValidationContext): ValidationIssue[] => {
    const records = context.dataRecords || [];
    const issues: ValidationIssue[] = [];

    const aeRecords = records.filter(r => 
      r.table === 'adverse_events' || 
      Object.keys(r.data).some(k => k.toLowerCase().includes('adverse'))
    );

    aeRecords.forEach((record, idx) => {
      const severity = String(record.data.severity || '').toLowerCase();
      const action = record.data.action_taken || record.data.treatment;
      const isGrade2Plus = severity.includes('grade 2') || severity.includes('grade 3') || 
                           severity.includes('grade 4') || severity.includes('moderate') || 
                           severity.includes('severe');

      if (isGrade2Plus && !action) {
        issues.push(createIssue(
          `conmed-missing-${idx}`,
          'info',
          `Grade 2+ AE Without Treatment Documentation`,
          `Moderate/severe AEs should document treatment or interventions`,
          'Document any medications or interventions used to treat this AE. This information is important for safety monitoring and understanding AE management.',
          'ICH E2B (R3): Concomitant Medications',
          'action_taken'
        ));
      }
    });

    return issues;
  }
};

// ============================================================================
// EXPORT ALL RULES
// ============================================================================

export const SAFETY_VALIDATION_RULES: ValidationRule[] = [
  AE_REQUIRED_FIELDS,
  SAE_CRITERIA_CHECK,
  SAE_EXPEDITED_REPORTING,
  CTCAE_SEVERITY_GRADING,
  CAUSALITY_ASSESSMENT,
  SAFETY_SIGNAL_DETECTION,
  AE_OUTCOME_TRACKING,
  CONCOMITANT_MEDICATION_CHECK
];
