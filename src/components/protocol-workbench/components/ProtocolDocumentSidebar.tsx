import { 
  BookOpen, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Lightbulb,
} from 'lucide-react';

type FieldHelpContent = {
  title: string;
  icon: typeof BookOpen;
  sections: {
    title: string;
    type: 'guidance' | 'examples' | 'best-practices' | 'warnings';
    content: string[];
  }[];
};

const FIELD_HELP: Record<string, FieldHelpContent> = {
  protocolTitle: {
    title: 'Protocol Title',
    icon: FileText,
    sections: [
      {
        title: 'Best Practices',
        type: 'best-practices',
        content: [
          'Include therapeutic area and intervention',
          'Specify study population',
          'Mention study phase if applicable',
          'Keep concise (under 200 characters)',
          'Use active voice and clear language'
        ]
      },
      {
        title: 'ICH-GCP Guidelines',
        type: 'guidance',
        content: [
          'Title should clearly convey the study purpose',
          'Must be consistent across all regulatory documents',
          'Avoid promotional or misleading language'
        ]
      },
      {
        title: 'Examples',
        type: 'examples',
        content: [
          '"A Phase III, Randomized, Double-Blind Study of Drug X vs. Placebo in Patients with Advanced Non-Small Cell Lung Cancer"',
          '"Multicenter Study to Evaluate the Safety and Efficacy of Intervention Y in Pediatric Diabetes"'
        ]
      }
    ]
  },
  
  protocolNumber: {
    title: 'Protocol Number',
    icon: FileText,
    sections: [
      {
        title: 'Naming Convention',
        type: 'best-practices',
        content: [
          'Use institutional or sponsor standard format',
          'Include year for temporal tracking',
          'Add sequential numbering',
          'Maintain consistent format across versions'
        ]
      },
      {
        title: 'Examples',
        type: 'examples',
        content: [
          'PROTO-2024-001',
          'IRB-2024-ONCO-015',
          'INST-ABC-2024-123',
          'SPON-DRUG-2024-P3-01'
        ]
      },
      {
        title: 'Common Mistakes',
        type: 'warnings',
        content: [
          'Avoid using special characters that may cause database issues',
          'Do not reuse protocol numbers from archived studies',
          'Ensure number is unique within institution'
        ]
      }
    ]
  },
  
  principalInvestigator: {
    title: 'Principal Investigator',
    icon: FileText,
    sections: [
      {
        title: 'Regulatory Requirements',
        type: 'guidance',
        content: [
          'Must have appropriate qualifications per 21 CFR 312.53',
          'Should have adequate time to conduct study',
          'Must have access to adequate facilities',
          'Should have experience with study population'
        ]
      },
      {
        title: 'Format',
        type: 'best-practices',
        content: [
          'Include full name and credentials (MD, PhD)',
          'Add institutional affiliation if multi-site',
          'Example: "Dr. Jane Smith, MD, PhD"'
        ]
      }
    ]
  },
  
  sponsor: {
    title: 'Sponsor',
    icon: FileText,
    sections: [
      {
        title: 'ICH-GCP Definition',
        type: 'guidance',
        content: [
          'Entity responsible for initiation, management, and financing',
          'Takes responsibility for study conduct per ICH-GCP 1.53',
          'May be pharmaceutical company, academic institution, or government agency'
        ]
      },
      {
        title: 'Examples',
        type: 'examples',
        content: [
          'Industry: "PharmaCorp International"',
          'Academic: "Johns Hopkins University"',
          'Government: "National Cancer Institute (NCI)"',
          'Investigator-Initiated: "Dr. Smith (Self-Sponsored)"'
        ]
      }
    ]
  },
  
  studyPhase: {
    title: 'Study Phase',
    icon: FileText,
    sections: [
      {
        title: 'FDA Phase Definitions',
        type: 'guidance',
        content: [
          'Phase I: First-in-human, safety, dosing (20-80 subjects)',
          'Phase II: Efficacy signal, dose-ranging (100-300 subjects)',
          'Phase III: Confirmatory efficacy, safety (300-3000+ subjects)',
          'Phase IV: Post-marketing surveillance'
        ]
      },
      {
        title: 'EMA Considerations',
        type: 'guidance',
        content: [
          'EMA uses similar phase definitions per Directive 2001/20/EC',
          'Phase IIa: Proof of concept',
          'Phase IIb: Dose-finding',
          'Adaptive designs may span multiple phases'
        ]
      }
    ]
  },
  
  therapeuticArea: {
    title: 'Therapeutic Area',
    icon: FileText,
    sections: [
      {
        title: 'Standard Therapeutic Areas',
        type: 'examples',
        content: [
          'Oncology, Cardiology, Neurology',
          'Infectious Diseases, Immunology',
          'Endocrinology, Metabolic Disorders',
          'Psychiatry, Rare Diseases',
          'Use MedDRA terminology when possible'
        ]
      },
      {
        title: 'Best Practices',
        type: 'best-practices',
        content: [
          'Be specific (e.g., "Non-Small Cell Lung Cancer" vs. "Cancer")',
          'Align with regulatory therapeutic area classifications',
          'Consider using ICD-10 or MedDRA codes for precision'
        ]
      }
    ]
  },
  
  estimatedEnrollment: {
    title: 'Estimated Enrollment',
    icon: FileText,
    sections: [
      {
        title: 'Statistical Considerations',
        type: 'guidance',
        content: [
          'Based on power analysis for primary endpoint',
          'Account for dropout rate (typically 10-20%)',
          'Consider screening failure rate',
          'Must justify sample size in statistical plan'
        ]
      },
      {
        title: 'Format',
        type: 'best-practices',
        content: [
          'Specify total number (e.g., "240 subjects")',
          'For multi-arm: "80 per arm (240 total)"',
          'For multi-site: "240 total across 15 sites"'
        ]
      },
      {
        title: 'Regulatory Notes',
        type: 'warnings',
        content: [
          'Substantial changes may require protocol amendment',
          'IRBs typically allow ±10% without amendment',
          'Document rationale in statistical section'
        ]
      }
    ]
  },
  
  studyDuration: {
    title: 'Study Duration',
    icon: FileText,
    sections: [
      {
        title: 'Components to Include',
        type: 'best-practices',
        content: [
          'Enrollment period',
          'Treatment duration per subject',
          'Follow-up period',
          'Total study duration from first patient in to last patient out (FPI-LPO)'
        ]
      },
      {
        title: 'Examples',
        type: 'examples',
        content: [
          '"24 months: 12-month enrollment + 6-month treatment + 6-month follow-up"',
          '"18 months total (enrollment concurrent with treatment)"',
          '"36 months: 24-month enrollment, 12-month per-patient duration"'
        ]
      }
    ]
  },
  
  primaryObjective: {
    title: 'Primary Objective',
    icon: BookOpen,
    sections: [
      {
        title: 'ICH-GCP Standards',
        type: 'guidance',
        content: [
          'Single, clearly stated objective',
          'Must align with primary endpoint',
          'Should be measurable and hypothesis-driven',
          'Forms basis for sample size calculation'
        ]
      },
      {
        title: 'Structure',
        type: 'best-practices',
        content: [
          'Start with "To evaluate..." or "To determine..."',
          'Specify intervention and comparison',
          'Define population',
          'State measurable outcome',
          'Avoid compound objectives'
        ]
      },
      {
        title: 'Examples',
        type: 'examples',
        content: [
          '"To evaluate the efficacy of Drug X compared to placebo in reducing tumor size in patients with advanced melanoma, as measured by RECIST 1.1 criteria"',
          '"To determine the safety and tolerability of escalating doses of Therapy Y in treatment-naïve patients with Type 2 Diabetes"'
        ]
      },
      {
        title: 'Common Errors',
        type: 'warnings',
        content: [
          'Avoid multiple objectives in primary (use secondary instead)',
          'Don\'t use vague terms like "assess" without specificity',
          'Ensure objective matches primary endpoint exactly'
        ]
      }
    ]
  },
  
  secondaryObjectives: {
    title: 'Secondary Objectives',
    icon: BookOpen,
    sections: [
      {
        title: 'Purpose',
        type: 'guidance',
        content: [
          'Support primary objective with additional evidence',
          'Evaluate safety, tolerability, PK/PD',
          'Assess quality of life and patient-reported outcomes',
          'Explore secondary efficacy endpoints'
        ]
      },
      {
        title: 'Format',
        type: 'best-practices',
        content: [
          'List as numbered or bulleted items',
          'Each should map to a secondary endpoint',
          'Prioritize in order of importance',
          'Typically 3-7 secondary objectives'
        ]
      },
      {
        title: 'Examples',
        type: 'examples',
        content: [
          '1. To evaluate overall survival at 12 months',
          '2. To assess safety profile via adverse event monitoring',
          '3. To characterize pharmacokinetic parameters',
          '4. To measure patient quality of life using EORTC QLQ-C30'
        ]
      }
    ]
  },
  
  inclusionCriteria: {
    title: 'Inclusion Criteria',
    icon: CheckCircle,
    sections: [
      {
        title: 'ICH-GCP Principles',
        type: 'guidance',
        content: [
          'Define target population precisely',
          'Ensure criteria are ethical and scientifically justified',
          'Balance scientific rigor with generalizability',
          'Must be objectively measurable'
        ]
      },
      {
        title: 'Essential Elements',
        type: 'best-practices',
        content: [
          'Age range (e.g., "18-75 years")',
          'Diagnosis criteria with specific coding (ICD-10)',
          'Disease severity or staging requirements',
          'Adequate organ function (lab values)',
          'Performance status (ECOG, Karnofsky)',
          'Informed consent capability',
          'Contraception requirements (if applicable)'
        ]
      },
      {
        title: 'Format Example',
        type: 'examples',
        content: [
          '1. Age ≥18 and ≤75 years at screening',
          '2. Histologically confirmed Stage IV melanoma per AJCC 8th edition',
          '3. ECOG performance status 0-1',
          '4. Adequate bone marrow: ANC ≥1500/μL, Platelets ≥100,000/μL',
          '5. Adequate hepatic function: AST/ALT ≤2.5x ULN',
          '6. Signed informed consent'
        ]
      },
      {
        title: 'Regulatory Warnings',
        type: 'warnings',
        content: [
          'Avoid overly restrictive criteria that limit generalizability',
          'Ensure criteria don\'t create disparities (FDA Diversity Action Plans)',
          'All lab values must have specific thresholds',
          'Consider pregnancy testing requirements for WOCBP'
        ]
      }
    ]
  },
  
  exclusionCriteria: {
    title: 'Exclusion Criteria',
    icon: AlertCircle,
    sections: [
      {
        title: 'Purpose',
        type: 'guidance',
        content: [
          'Protect subject safety',
          'Minimize confounding factors',
          'Ensure data quality and interpretability',
          'Comply with regulatory requirements'
        ]
      },
      {
        title: 'Essential Categories',
        type: 'best-practices',
        content: [
          'Safety exclusions (contraindications)',
          'Prior/concurrent therapies',
          'Comorbidities that interfere with endpoints',
          'Pregnancy/lactation status',
          'Substance abuse or psychiatric conditions affecting consent',
          'Lab abnormalities indicating safety risk',
          'Known hypersensitivity to study drug'
        ]
      },
      {
        title: 'Format Example',
        type: 'examples',
        content: [
          '1. Pregnant or breastfeeding women',
          '2. Active CNS metastases (treated and stable >3 months allowed)',
          '3. Prior therapy with immune checkpoint inhibitors',
          '4. Active autoimmune disease requiring systemic treatment',
          '5. QTc >470 msec on screening ECG',
          '6. HIV, Hepatitis B/C infection',
          '7. Major surgery within 4 weeks of treatment'
        ]
      },
      {
        title: 'Common Mistakes',
        type: 'warnings',
        content: [
          'Don\'t duplicate inclusion criteria in reverse',
          'Avoid vague terms like "serious medical condition"',
          'Specify washout periods for prior therapies',
          'Ensure exclusions are scientifically/ethically justified'
        ]
      }
    ]
  },
  
  statisticalPlan: {
    title: 'Statistical Analysis Plan',
    icon: BookOpen,
    sections: [
      {
        title: 'ICH E9 Requirements',
        type: 'guidance',
        content: [
          'Define all estimands clearly',
          'Specify primary and secondary endpoints',
          'Detail sample size calculation with assumptions',
          'Define analysis populations (ITT, PP, Safety)',
          'Specify statistical tests and significance level',
          'Address multiplicity adjustments',
          'Define interim analysis plan (if applicable)'
        ]
      },
      {
        title: 'Essential Components',
        type: 'best-practices',
        content: [
          'Hypothesis (H0 and Ha)',
          'Primary endpoint analysis method',
          'Sample size justification with power calculation',
          'Handling of missing data',
          'Subgroup analyses (pre-specified)',
          'Sensitivity analyses',
          'Safety analysis approach'
        ]
      },
      {
        title: 'Example Structure',
        type: 'examples',
        content: [
          'Primary Analysis: "Tumor response rate will be compared using Fisher\'s exact test. H0: RR_drug = RR_placebo. With 120 subjects per arm, 80% power to detect 15% difference (α=0.05)."',
          'Missing Data: "Multiple imputation using chained equations for missing efficacy data."',
          'Multiplicity: "Hochberg procedure for family-wise error rate control across secondary endpoints."'
        ]
      },
      {
        title: 'Regulatory Warnings',
        type: 'warnings',
        content: [
          'Must be finalized before database lock',
          'Changes after unblinding are highly scrutinized',
          'FDA expects estimands framework (ICH E9(R1))',
          'Document all deviations from planned analyses',
          'Consider DMC charter for safety monitoring'
        ]
      }
    ]
  }
};

interface ProtocolDocumentSidebarProps {
  open: boolean;
  onClose: () => void;
  activeField?: string;
  metadata: any;
  content: any;
  onUpdateMetadata: (field: string, value: string) => void;
  onUpdateContent: (field: string, value: string) => void;
}

export function ProtocolDocumentSidebar({
  open,
  onClose,
  activeField = 'primaryObjective',
}: ProtocolDocumentSidebarProps) {
  const helpContent = FIELD_HELP[activeField];

  if (!open || !helpContent) return null;

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'guidance': return BookOpen;
      case 'examples': return Lightbulb;
      case 'best-practices': return CheckCircle;
      case 'warnings': return AlertCircle;
      default: return BookOpen;
    }
  };

  const getSectionColor = (type: string) => {
    switch (type) {
      case 'guidance': return 'indigo';
      case 'examples': return 'purple';
      case 'best-practices': return 'emerald';
      case 'warnings': return 'amber';
      default: return 'slate';
    }
  };

  const Icon = helpContent.icon;

  return (
    <div className="space-y-6">
      {/* Current Field Header */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">{helpContent.title}</h3>
        </div>
      </div>

      {/* Help Sections */}
      <div className="space-y-4">
        {helpContent.sections.map((section, idx) => {
          const SectionIcon = getSectionIcon(section.type);
          const color = getSectionColor(section.type);
          
          // Define color classes explicitly for Tailwind
          const bgClass = color === 'indigo' ? 'bg-indigo-50' :
                        color === 'purple' ? 'bg-purple-50' :
                        color === 'emerald' ? 'bg-emerald-50' :
                        color === 'amber' ? 'bg-amber-50' : 'bg-slate-50';
          
          const borderClass = color === 'indigo' ? 'border-indigo-200' :
                            color === 'purple' ? 'border-purple-200' :
                            color === 'emerald' ? 'border-emerald-200' :
                            color === 'amber' ? 'border-amber-200' : 'border-slate-200';
          
          const iconClass = color === 'indigo' ? 'text-indigo-600' :
                          color === 'purple' ? 'text-purple-600' :
                          color === 'emerald' ? 'text-emerald-600' :
                          color === 'amber' ? 'text-amber-600' : 'text-slate-600';
          
          const titleClass = color === 'indigo' ? 'text-indigo-900' :
                           color === 'purple' ? 'text-purple-900' :
                           color === 'emerald' ? 'text-emerald-900' :
                           color === 'amber' ? 'text-amber-900' : 'text-slate-900';
          
          const textClass = color === 'indigo' ? 'text-indigo-700' :
                          color === 'purple' ? 'text-purple-700' :
                          color === 'emerald' ? 'text-emerald-700' :
                          color === 'amber' ? 'text-amber-700' : 'text-slate-700';
          
          return (
            <div key={idx} className={`${bgClass} rounded-lg p-4 border ${borderClass}`}>
              <div className="flex items-center gap-2 mb-3">
                <SectionIcon className={`w-4 h-4 ${iconClass}`} />
                <h4 className={`text-sm font-medium ${titleClass}`}>{section.title}</h4>
              </div>
              <div className="space-y-2">
                {section.content.map((item, itemIdx) => (
                  <p key={itemIdx} className={`text-xs ${textClass} leading-relaxed`}>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}