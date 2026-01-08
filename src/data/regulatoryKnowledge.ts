// Regulatory Knowledge Base - Pre-indexed Q&A with Citations

import type { RegulatoryQuestion } from '../types/ethics';

export const REGULATORY_KNOWLEDGE_BASE: RegulatoryQuestion[] = [
  {
    id: 'q_poland_initial_docs',
    question: 'What documents are required for initial IRB submission in Poland?',
    answer: 'For an initial Bioethics Committee submission in Poland, you must provide:\n\n1. Research Protocol (with clear methodology, endpoints, and statistical plan)\n2. Informed Consent Form (ICF) in Polish\n3. Principal Investigator CV and medical license\n4. Sponsor agreement (if applicable)\n5. Insurance documentation for participant harm coverage\n6. GDPR compliance statement\n7. Declaration of Conflicts of Interest\n\nAll documents must be submitted in Polish unless the committee grants an exception.',
    citations: [
      'Polish Pharmaceutical Law, Art. 37a (2001, amended 2020)',
      'Bioethics Committee Regulation, Ministry of Health (2018)'
    ],
    jurisdiction: ['Poland', 'EU'],
    tags: ['initial-submission', 'required-documents', 'poland']
  },
  {
    id: 'q_poland_review_timeline',
    question: 'How long does IRB review take in Poland?',
    answer: 'Standard review timelines in Poland:\n\n• Initial Review: Maximum 60 days from complete submission\n• Expedited Review: 30 days for minimal risk studies\n• Amendments: 30 days for substantial amendments, 7 days for administrative changes\n• Continuing Review: 45 days before approval expiration\n\nThe clock stops if the committee requests additional information. You typically have 30 days to respond.',
    citations: [
      'EU Clinical Trials Regulation 536/2014, Art. 8',
      'Polish Ministry of Health Directive 2019/KB'
    ],
    jurisdiction: ['Poland', 'EU'],
    tags: ['timelines', 'review-process', 'poland']
  },
  {
    id: 'q_substantial_amendment',
    question: 'What changes require a substantial amendment?',
    answer: 'A Substantial Amendment is required for changes that could:\n\n• Affect participant safety or rights\n• Change primary or secondary endpoints\n• Modify inclusion/exclusion criteria\n• Alter study population size significantly (>20%)\n• Change intervention protocol or dosage\n• Add new study sites\n• Modify data collection procedures affecting participant burden\n\nAdministrative changes (contact info, clerical corrections) do NOT require substantial amendments.',
    citations: [
      'EU CTR 536/2014, Art. 16',
      'ICH-GCP E6(R2), Section 4.5'
    ],
    jurisdiction: ['EU', 'Poland', 'US', 'UK'],
    tags: ['amendments', 'protocol-changes', 'compliance']
  },
  {
    id: 'q_gdpr_clinical',
    question: 'How does GDPR apply to clinical research data?',
    answer: 'Under GDPR, clinical research data is classified as "Special Category Data" (Article 9).\n\nKey requirements:\n\n• Legal basis: Explicit consent OR scientific research exemption\n• Data Minimization: Collect only what is necessary\n• Pseudonymization required for analysis datasets\n• Participant right to withdraw consent\n• Data Protection Impact Assessment (DPIA) mandatory\n• Cross-border transfers require Standard Contractual Clauses\n\nNote: Full anonymization exempts data from GDPR, but re-identification risk must be negligible.',
    citations: [
      'GDPR Regulation (EU) 2016/679, Art. 9',
      'GDPR Art. 89 - Scientific Research Exemptions',
      'European Data Protection Board Guidelines 3/2019'
    ],
    jurisdiction: ['EU', 'Poland', 'UK'],
    tags: ['gdpr', 'data-protection', 'privacy']
  },
  {
    id: 'q_safety_reporting',
    question: 'What are the safety reporting requirements for adverse events?',
    answer: 'Adverse Event (AE) reporting timelines:\n\n**Serious Adverse Events (SAEs):**\n• Fatal or life-threatening: 7 calendar days (initial report)\n• Other serious events: 15 calendar days\n• Follow-up reports: Within 8 additional days\n\n**Suspected Unexpected Serious Adverse Reactions (SUSARs):**\n• Report to IRB, sponsor, and regulatory authority simultaneously\n• Database: EudraVigilance for EU studies\n\n**Non-serious AEs:**\n• Documented in source records\n• Summarized in annual safety reports',
    citations: [
      'EU CTR 536/2014, Art. 41-43',
      'ICH-GCP E6(R2), Section 4.11',
      'Polish URPL Safety Reporting Guidelines 2021'
    ],
    jurisdiction: ['EU', 'Poland'],
    tags: ['safety', 'adverse-events', 'reporting']
  },
  {
    id: 'q_continuing_review',
    question: 'When is continuing review required?',
    answer: 'Continuing Review (Annual Review) is required:\n\n• At least annually for ongoing studies\n• More frequently for high-risk studies (every 6 months)\n• Before IRB approval expiration date\n• After enrollment of significant milestones (e.g., 50%, 100% of target)\n\nYou must submit:\n1. Updated progress report\n2. Current enrollment numbers\n3. Summary of adverse events\n4. Protocol deviations log\n5. Any new safety information\n\nFailure to submit before expiration requires stopping all research activities.',
    citations: [
      'EU CTR 536/2014, Art. 44',
      'FDA 21 CFR 56.109(f)',
      'ICH-GCP E6(R2), Section 3.3'
    ],
    jurisdiction: ['EU', 'Poland', 'US'],
    tags: ['continuing-review', 'annual-report', 'compliance']
  },
  {
    id: 'q_informed_consent',
    question: 'What must be included in an informed consent form?',
    answer: 'An ICF must contain (at minimum):\n\n**Essential Elements:**\n1. Study purpose and procedures\n2. Foreseeable risks and discomforts\n3. Expected benefits (to participant or society)\n4. Alternative treatments available\n5. Confidentiality protections\n6. Compensation and injury coverage\n7. Voluntary participation statement\n8. Right to withdraw without penalty\n9. Contact information for questions\n\n**EU/Poland Specific:**\n• GDPR data processing notice\n• Secondary use of data (if applicable)\n• Biobanking consent (if samples stored)\n• Language must be at 8th-grade reading level',
    citations: [
      'EU CTR 536/2014, Art. 29',
      'Declaration of Helsinki (2013), Para. 26',
      'ICH-GCP E6(R2), Section 4.8',
      'GDPR Art. 13 - Information to Data Subjects'
    ],
    jurisdiction: ['EU', 'Poland', 'US', 'UK'],
    tags: ['informed-consent', 'icf', 'participant-rights']
  },
  {
    id: 'q_medical_device_rules',
    question: 'What are the regulatory requirements for medical device studies?',
    answer: 'Medical Device Clinical Investigations in EU:\n\n**Classification determines pathway:**\n• Class I: Often exempt from IRB if CE-marked\n• Class IIa/IIb: IRB approval + Notified Body review\n• Class III: Full clinical investigation + competent authority approval\n\n**Key Requirements:**\n• Clinical Investigation Plan (CIP) replacing traditional protocol\n• Medical Device Regulation (MDR) 2017/745 compliance\n• EUDAMED registration for all investigations\n• Serious Adverse Device Effects (SADE) reporting: 7 days\n\nPoland: Submit to URPL (Office for Registration of Medicinal Products) if invasive device.',
    citations: [
      'EU MDR 2017/745, Chapter VI',
      'ISO 14155:2020 - Clinical Investigation of Medical Devices',
      'Polish Medical Device Act (2010, amended 2021)'
    ],
    jurisdiction: ['EU', 'Poland'],
    tags: ['medical-device', 'mdr', 'device-studies']
  },
  {
    id: 'q_multi_center_submission',
    question: 'How does multi-center study approval work in the EU?',
    answer: 'Under EU CTR 536/2014, a Single Assessment applies:\n\n**Part I Assessment (Scientific):**\n• Submitted to one Member State (Reporting Member State)\n• Coordinated review by all involved Member States\n• Single decision on protocol, risk-benefit\n\n**Part II Assessment (Local/Ethics):**\n• Each Member State evaluates local context\n• Informed consent, recruitment, local ethics compliance\n\n**Timeline:**\n• Part I: 45-60 days\n• Part II: Concurrent with Part I\n• If approved in one EU country, other countries must accept Part I findings\n\nPoland acts as coordinating state for Polish-led multi-national trials.',
    citations: [
      'EU CTR 536/2014, Art. 5-9',
      'EMA Multi-Center Guidance 2019'
    ],
    jurisdiction: ['EU', 'Poland'],
    tags: ['multi-center', 'eu-ctr', 'international']
  },
  {
    id: 'q_protocol_deviation',
    question: 'How should I handle protocol deviations?',
    answer: 'Protocol deviations must be categorized and documented:\n\n**Major Deviations (report to IRB within 5 days):**\n• Affect participant safety\n• Affect data integrity\n• Violate informed consent\n• Repeat minor deviations showing systemic issues\n\n**Minor Deviations (log and report at continuing review):**\n• Administrative errors\n• One-time scheduling issues\n• Non-critical documentation gaps\n\n**Documentation Required:**\n1. Description of deviation\n2. Impact assessment\n3. Corrective action taken\n4. Preventive measures implemented\n\nFrequent deviations may trigger IRB audit or suspension.',
    citations: [
      'ICH-GCP E6(R2), Section 5.20',
      'FDA Information Sheet: Protocol Deviations',
      'EMA GCP Inspection Guidance'
    ],
    jurisdiction: ['EU', 'Poland', 'US', 'UK'],
    tags: ['protocol-deviations', 'compliance', 'quality']
  }
];

// Quick Action Templates
export const QUICK_ACTIONS = [
  {
    id: 'action_poland_timeline',
    label: 'Check Poland Review Timelines',
    questionId: 'q_poland_review_timeline'
  },
  {
    id: 'action_poland_docs',
    label: 'List Mandatory Polish Documents',
    questionId: 'q_poland_initial_docs'
  },
  {
    id: 'action_safety_reporting',
    label: 'Safety Reporting Rules',
    questionId: 'q_safety_reporting'
  },
  {
    id: 'action_amendments',
    label: 'When is Amendment Required?',
    questionId: 'q_substantial_amendment'
  },
  {
    id: 'action_gdpr',
    label: 'GDPR & Clinical Data',
    questionId: 'q_gdpr_clinical'
  }
];

// Helper function to search knowledge base
export function searchRegulatoryKnowledge(query: string, jurisdiction?: string): RegulatoryQuestion[] {
  const lowerQuery = query.toLowerCase();
  
  return REGULATORY_KNOWLEDGE_BASE.filter(q => {
    const matchesQuery = 
      q.question.toLowerCase().includes(lowerQuery) ||
      q.answer.toLowerCase().includes(lowerQuery) ||
      q.tags.some(tag => tag.includes(lowerQuery));
    
    const matchesJurisdiction = !jurisdiction || q.jurisdiction.includes(jurisdiction);
    
    return matchesQuery && matchesJurisdiction;
  });
}

// Get question by ID
export function getQuestionById(id: string): RegulatoryQuestion | undefined {
  return REGULATORY_KNOWLEDGE_BASE.find(q => q.id === id);
}
