// Demo Data for Academic Writing - Pre-populated Sources and Manuscript

import type { SourceDocument, ManuscriptManifest } from '../types/manuscript';

/**
 * Demo source documents (simulating uploaded PDFs)
 */
export const demoSources: SourceDocument[] = [
  {
    id: 'source_svs_2024',
    fileName: 'SVS_Guidelines_2024.pdf',
    citationKey: 'SVS_Guidelines_2024',
    uploadedAt: Date.now() - 86400000 * 7, // 7 days ago
    fileSize: 2457600,
    isGrounded: true,
    metadata: {
      title: 'Society for Vascular Surgery Guidelines for Aortic Arch Repair',
      authors: ['Johnson, M.D.', 'Smith, P.H.', 'Williams, K.R.'],
      year: 2024,
      doi: '10.1016/j.jvs.2024.001',
      publicationType: 'Clinical Guidelines'
    }
  },
  {
    id: 'source_vestal_2023',
    fileName: 'VESTAL_Trial_2023.pdf',
    citationKey: 'VESTAL_Trial_2023',
    uploadedAt: Date.now() - 86400000 * 14, // 14 days ago
    fileSize: 3145728,
    isGrounded: true,
    metadata: {
      title: 'VESTAL Trial: Age and Outcomes in Aortic Arch Repair',
      authors: ['Anderson, J.K.', 'Thompson, R.L.', 'Davis, M.N.'],
      year: 2023,
      doi: '10.1016/j.jvs.2023.089',
      publicationType: 'Randomized Controlled Trial'
    }
  },
  {
    id: 'source_acc_risk',
    fileName: 'ACC_Risk_Calculator_2024.pdf',
    citationKey: 'ACC_Risk_Calculator',
    uploadedAt: Date.now() - 86400000 * 3, // 3 days ago
    fileSize: 1048576,
    isGrounded: true,
    metadata: {
      title: 'ACC/AHA Perioperative Risk Assessment Guidelines',
      authors: ['Martinez, C.D.', 'Lee, S.H.'],
      year: 2024,
      doi: '10.1016/j.acc.2024.012',
      publicationType: 'Clinical Tool'
    }
  }
];

/**
 * Demo manuscript with pre-written content containing citations
 */
export function createDemoManuscript(projectId: string): ManuscriptManifest {
  return {
    id: `manuscript-demo-${Date.now()}`,
    projectMeta: {
      projectId,
      studyTitle: 'Age-Based Outcomes in Elective Aortic Arch Repair: A Retrospective Analysis',
      primaryInvestigator: 'Dr. Sarah Chen',
      protocolRef: 'v1.0',
      createdAt: Date.now() - 86400000 * 5, // 5 days ago
      modifiedAt: Date.now()
    },
    manuscriptStructure: {
      methods: {
        statisticalPlan: {
          software: 'Clinical Intelligence Engine v1.0',
          primaryTest: 'Fisher\'s Exact Test for categorical outcomes',
          rationale: 'Selected due to small cell counts in age-stratified analysis'
        },
        populationSummary: 'Consecutive patients undergoing elective aortic arch repair between 2020-2023'
      },
      results: {
        primaryFindings: [
          {
            outcomeVariable: 'mortality_30d',
            statisticalTest: 'Fisher\'s Exact Test',
            pValue: 0.089,
            effectSize: 0.09,
            interpretation: 'No significant difference in 30-day mortality between age groups'
          }
        ],
        secondaryFindings: []
      },
      discussionAnchors: {
        internalConflicts: 'Age threshold recommendations vs. observed outcomes',
        lateralOpportunities: []
      }
    },
    notebookContext: {
      linkedSources: demoSources,
      citationMap: {}
    },
    manuscriptContent: {
      introduction: `The optimal age threshold for elective aortic arch repair remains controversial. Current guidelines recommend an upper age threshold of 80 years for elective aortic arch repair [@SVS_Guidelines_2024], though recent evidence suggests this cutoff may be overly conservative.

The VESTAL trial demonstrated that age alone should not be a contraindication for arch repair, with patients aged 75-85 showing comparable outcomes to younger cohorts when properly selected [@VESTAL_Trial_2023]. However, these findings have not been validated in broader clinical practice.

This retrospective analysis examines age-stratified outcomes in our institutional cohort to inform patient selection and shared decision-making.`,

      methods: `Statistical analysis was performed using the Clinical Intelligence Engine (v1.0). Perioperative risk was estimated using the ACC/AHA risk calculator [@ACC_Risk_Calculator]. Continuous variables were analyzed using appropriate parametric or non-parametric tests based on distribution assessment. Categorical outcomes were compared using Fisher's Exact Test for small cell counts. A p-value < 0.05 was considered statistically significant.`,

      results: `A total of 112 patients underwent elective aortic arch repair during the study period. The 30-day mortality rate in our cohort was 9% (10/112), which aligns with the benchmark range of 8.8-10.2% reported in large-scale multicenter trials [@SVS_Guidelines_2024]. 

Age-stratified analysis revealed no significant difference in 30-day mortality between patients <75 years (8.2%) and ≥75 years (10.5%), p=0.089. Postoperative stroke occurred in 4.5% of cases overall, consistent with published rates of 3-5% despite modern neuroprotection strategies [@SVS_Guidelines_2024].`,

      discussion: `Our findings support the VESTAL trial's conclusion that age alone should not preclude surgical candidacy [@VESTAL_Trial_2023]. The 30-day mortality rate of 9% in our cohort falls within the acceptable range for specialized centers, and the lack of significant age-related differences (p=0.089) suggests that careful patient selection may mitigate age-based risk.

However, this non-significant trend (p=0.089) toward higher mortality in older patients warrants cautious interpretation. While our data approach the significance threshold, we cannot definitively claim age equivalence. Future prospective studies with larger sample sizes are needed to confirm these preliminary findings.`,

      conclusion: `In carefully selected patients, elective aortic arch repair can be performed with acceptable mortality rates across age groups. Age-based exclusion criteria should be reconsidered in favor of individualized risk assessment using validated tools [@ACC_Risk_Calculator].`
    },
    reviewComments: []
  };
}

/**
 * Load demo data into the Academic Writing module
 */
export function shouldLoadDemoData(projectId: string): boolean {
  // Check if this is the first time loading the module for this project
  const hasSeenDemo = localStorage.getItem(`academic_writing_demo_loaded_${projectId}`);
  return !hasSeenDemo;
}

export function markDemoAsLoaded(projectId: string): void {
  localStorage.setItem(`academic_writing_demo_loaded_${projectId}`, 'true');
}

/**
 * Reset demo data
 */
export function resetDemoData(projectId: string): void {
  localStorage.removeItem(`academic_writing_demo_loaded_${projectId}`);
}