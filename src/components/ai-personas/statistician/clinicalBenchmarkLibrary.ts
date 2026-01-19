// Clinical Benchmark Library
// Domain-specific statistical endpoints, benchmarks, and analysis guidance
// Enables Dr. Saga to provide domain-expert level recommendations

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface EndpointBenchmark {
  name: string;
  alternateNames?: string[];  // For auto-detection from schema
  type: 'rate' | 'continuous' | 'time-to-event' | 'ordinal' | 'composite';
  unit?: string;
  acceptable: { low: number; high: number };
  concerning: number;
  excellent?: number;  // For metrics where lower is better
  direction: 'lower-better' | 'higher-better';
  source: string;
  analysisMethod: string;
  clinicalSignificance?: string;
}

export interface RiskFactor {
  name: string;
  alternateNames?: string[];
  expectedOR?: number;
  expectedHR?: number;
  ciLower?: number;
  ciUpper?: number;
  direction: 'harmful' | 'protective';
  source: string;
  strength: 'strong' | 'moderate' | 'weak';
  modifiable: boolean;
}

export interface DomainSubspecialty {
  name: string;
  description: string;
  keywords: string[];  // For auto-detection from PICO
  endpoints: EndpointBenchmark[];
  riskFactors: RiskFactor[];
  requiredAnalyses: string[];
  recommendedAnalyses: string[];
  regulatoryGuidance: string[];
  keyReferences: string[];
}

export interface ClinicalDomain {
  domain: string;
  description: string;
  keywords: string[];  // For auto-detection
  subspecialties: DomainSubspecialty[];
  commonEndpoints: EndpointBenchmark[];  // Shared across subspecialties
  commonRiskFactors: RiskFactor[];
  standardAnalyses: string[];
  regulatoryBodies: string[];
}

// =============================================================================
// CARDIOVASCULAR DOMAIN
// Based on SAFE Arch comprehensive analytics
// =============================================================================

const CARDIOVASCULAR_DOMAIN: ClinicalDomain = {
  domain: 'cardiovascular',
  description: 'Cardiovascular surgery and interventions including aortic, coronary, and peripheral vascular procedures',
  keywords: ['heart', 'cardiac', 'aortic', 'vascular', 'coronary', 'artery', 'aneurysm', 'dissection', 'bypass', 'CABG', 'stent', 'valve'],
  subspecialties: [
    {
      name: 'aortic_surgery',
      description: 'Open and endovascular aortic repair procedures',
      keywords: ['aortic arch', 'TEVAR', 'EVAR', 'ascending aorta', 'descending aorta', 'thoracoabdominal', 'dissection', 'aneurysm', 'elephant trunk', 'frozen elephant trunk'],
      endpoints: [
        {
          name: 'stroke_rate',
          alternateNames: ['stroke', 'cva', 'cerebrovascular_accident', 'neurological_event'],
          type: 'rate',
          unit: '%',
          acceptable: { low: 0, high: 7 },
          concerning: 13,
          excellent: 3,
          direction: 'lower-better',
          source: 'Contemporary aortic arch repair literature (Preventza, Coselli)',
          analysisMethod: 'Wilson score CI for rate, logistic regression for risk factors',
          clinicalSignificance: 'Major morbidity affecting quality of life and independence'
        },
        {
          name: 'mortality_30day',
          alternateNames: ['operative_mortality', 'death_30d', 'early_mortality', 'in_hospital_mortality'],
          type: 'rate',
          unit: '%',
          acceptable: { low: 0, high: 8 },
          concerning: 15,
          excellent: 4,
          direction: 'lower-better',
          source: 'STS Database, EACTS guidelines',
          analysisMethod: 'Kaplan-Meier, Wilson CI',
          clinicalSignificance: 'Primary safety endpoint'
        },
        {
          name: 'spinal_cord_injury',
          alternateNames: ['paraplegia', 'paraparesis', 'sci', 'spinal_cord_ischemia'],
          type: 'rate',
          unit: '%',
          acceptable: { low: 0, high: 5 },
          concerning: 10,
          excellent: 2,
          direction: 'lower-better',
          source: 'TEVAR literature, spinal cord protection protocols',
          analysisMethod: 'Wilson score CI, logistic regression',
          clinicalSignificance: 'Devastating complication, major quality of life impact'
        },
        {
          name: 'renal_failure',
          alternateNames: ['aki', 'acute_kidney_injury', 'dialysis', 'crrt', 'renal_replacement'],
          type: 'rate',
          unit: '%',
          acceptable: { low: 0, high: 10 },
          concerning: 20,
          excellent: 5,
          direction: 'lower-better',
          source: 'KDIGO criteria, cardiac surgery literature',
          analysisMethod: 'Wilson score CI, multivariable analysis',
          clinicalSignificance: 'Associated with prolonged ICU stay and mortality'
        },
        {
          name: 'survival_1year',
          alternateNames: ['one_year_survival', '1y_survival', '12_month_survival'],
          type: 'time-to-event',
          unit: '%',
          acceptable: { low: 80, high: 100 },
          concerning: 70,
          direction: 'higher-better',
          source: 'Contemporary aortic surgery series',
          analysisMethod: 'Kaplan-Meier with 95% CI, log-rank for group comparison',
          clinicalSignificance: 'Standard efficacy endpoint'
        },
        {
          name: 'survival_5year',
          alternateNames: ['five_year_survival', '5y_survival', 'long_term_survival'],
          type: 'time-to-event',
          unit: '%',
          acceptable: { low: 60, high: 100 },
          concerning: 50,
          direction: 'higher-better',
          source: 'Long-term aortic surgery outcomes',
          analysisMethod: 'Kaplan-Meier with 95% CI',
          clinicalSignificance: 'Long-term efficacy benchmark'
        },
        {
          name: 'reintervention_rate',
          alternateNames: ['reoperation', 'secondary_intervention', 'reop'],
          type: 'time-to-event',
          unit: '%',
          acceptable: { low: 0, high: 15 },
          concerning: 25,
          direction: 'lower-better',
          source: 'EVAR/TEVAR durability studies',
          analysisMethod: 'Kaplan-Meier freedom from reintervention',
          clinicalSignificance: 'Reflects durability of repair'
        },
        {
          name: 'icu_length_of_stay',
          alternateNames: ['icu_los', 'icu_days', 'intensive_care_duration'],
          type: 'continuous',
          unit: 'days',
          acceptable: { low: 0, high: 5 },
          concerning: 10,
          direction: 'lower-better',
          source: 'Cardiac surgery benchmarks',
          analysisMethod: 'Median with IQR (non-normal distribution), Mann-Whitney U',
          clinicalSignificance: 'Resource utilization, recovery indicator'
        },
        {
          name: 'hospital_length_of_stay',
          alternateNames: ['hospital_los', 'los', 'length_of_stay'],
          type: 'continuous',
          unit: 'days',
          acceptable: { low: 0, high: 14 },
          concerning: 21,
          direction: 'lower-better',
          source: 'NSQIP, STS Database',
          analysisMethod: 'Median with IQR, negative binomial regression',
          clinicalSignificance: 'Resource utilization, overall recovery'
        }
      ],
      riskFactors: [
        { name: 'age', alternateNames: ['patient_age', 'age_years'], expectedOR: 1.03, direction: 'harmful', source: 'Multiple series', strength: 'moderate', modifiable: false },
        { name: 'chronic_kidney_disease', alternateNames: ['ckd', 'renal_insufficiency', 'egfr'], expectedOR: 2.1, direction: 'harmful', source: 'Aortic surgery literature', strength: 'strong', modifiable: false },
        { name: 'copd', alternateNames: ['chronic_obstructive_pulmonary_disease', 'emphysema', 'lung_disease'], expectedOR: 1.8, direction: 'harmful', source: 'STS risk models', strength: 'moderate', modifiable: false },
        { name: 'diabetes', alternateNames: ['dm', 'diabetes_mellitus', 'diabetic'], expectedOR: 1.5, direction: 'harmful', source: 'Cardiac surgery literature', strength: 'moderate', modifiable: true },
        { name: 'previous_cardiac_surgery', alternateNames: ['redo', 'prior_sternotomy', 'previous_surgery'], expectedOR: 1.9, direction: 'harmful', source: 'Aortic redo series', strength: 'strong', modifiable: false },
        { name: 'emergency_surgery', alternateNames: ['emergent', 'urgent', 'acute'], expectedOR: 3.5, direction: 'harmful', source: 'Emergency aortic surgery outcomes', strength: 'strong', modifiable: false },
        { name: 'female_sex', alternateNames: ['sex_female', 'gender_female', 'woman'], expectedOR: 1.4, direction: 'harmful', source: 'Gender differences in aortic surgery', strength: 'moderate', modifiable: false },
        { name: 'peripheral_vascular_disease', alternateNames: ['pvd', 'pad', 'claudication'], expectedOR: 1.7, direction: 'harmful', source: 'Vascular comorbidity studies', strength: 'moderate', modifiable: false },
        { name: 'hypertension', alternateNames: ['htn', 'high_blood_pressure'], expectedOR: 1.3, direction: 'harmful', source: 'Risk factor analysis', strength: 'weak', modifiable: true },
        { name: 'smoking', alternateNames: ['tobacco', 'smoker', 'cigarette'], expectedOR: 1.4, direction: 'harmful', source: 'Cardiovascular risk literature', strength: 'moderate', modifiable: true },
        { name: 'connective_tissue_disorder', alternateNames: ['marfan', 'loeys_dietz', 'ehlers_danlos', 'ctd'], expectedOR: 0.7, direction: 'protective', source: 'Younger patients, planned surgery', strength: 'moderate', modifiable: false },
        { name: 'extent_of_repair', alternateNames: ['hemiarch', 'total_arch', 'zone'], expectedOR: 1.8, direction: 'harmful', source: 'Surgical complexity studies', strength: 'strong', modifiable: false },
        { name: 'circulatory_arrest_time', alternateNames: ['hca_time', 'arrest_time', 'dhca'], expectedOR: 1.02, direction: 'harmful', source: 'Neuroprotection studies', strength: 'moderate', modifiable: true }
      ],
      requiredAnalyses: [
        'Descriptive statistics for all baseline characteristics',
        'Wilson score CI for primary outcome rates',
        'Kaplan-Meier survival analysis with 95% CI',
        'Log-rank test for group comparisons (if applicable)',
        'Univariate logistic regression for mortality/morbidity predictors',
        'Multivariable logistic regression for independent predictors'
      ],
      recommendedAnalyses: [
        'Propensity score matching (if comparing groups)',
        'Cox proportional hazards for time-to-event outcomes',
        'Competing risks analysis (death vs. reintervention)',
        'Subgroup analysis by surgical era',
        'Learning curve analysis (CUSUM)'
      ],
      regulatoryGuidance: ['STS Database definitions', 'EACTS guidelines', 'SVS reporting standards'],
      keyReferences: ['Preventza O, et al. JTCVS', 'Coselli JS, et al. Ann Thorac Surg', 'Ouzounian M, et al. Circulation']
    },
    {
      name: 'coronary_surgery',
      description: 'Coronary artery bypass grafting and related procedures',
      keywords: ['cabg', 'coronary bypass', 'lima', 'grafting', 'coronary artery disease', 'cad'],
      endpoints: [
        {
          name: 'mortality_30day',
          alternateNames: ['operative_mortality', 'death'],
          type: 'rate',
          unit: '%',
          acceptable: { low: 0, high: 3 },
          concerning: 5,
          excellent: 1,
          direction: 'lower-better',
          source: 'STS CABG Database',
          analysisMethod: 'Wilson score CI, STS risk-adjusted mortality',
          clinicalSignificance: 'Primary safety endpoint'
        },
        {
          name: 'stroke_rate',
          alternateNames: ['stroke', 'cva'],
          type: 'rate',
          unit: '%',
          acceptable: { low: 0, high: 2 },
          concerning: 4,
          excellent: 0.5,
          direction: 'lower-better',
          source: 'STS Database',
          analysisMethod: 'Wilson score CI',
          clinicalSignificance: 'Major morbidity'
        },
        {
          name: 'graft_patency_1year',
          alternateNames: ['patency', 'graft_failure'],
          type: 'rate',
          unit: '%',
          acceptable: { low: 90, high: 100 },
          concerning: 85,
          direction: 'higher-better',
          source: 'CABG angiographic studies',
          analysisMethod: 'Kaplan-Meier freedom from graft failure',
          clinicalSignificance: 'Technical success and durability'
        }
      ],
      riskFactors: [
        { name: 'age', expectedOR: 1.04, direction: 'harmful', source: 'STS risk model', strength: 'moderate', modifiable: false },
        { name: 'lvef', alternateNames: ['ejection_fraction', 'ef'], expectedOR: 0.97, direction: 'protective', source: 'STS risk model', strength: 'strong', modifiable: false },
        { name: 'diabetes', expectedOR: 1.3, direction: 'harmful', source: 'STS risk model', strength: 'moderate', modifiable: true }
      ],
      requiredAnalyses: [
        'STS risk-adjusted outcomes',
        'Wilson score CI for complication rates',
        'Kaplan-Meier for graft patency'
      ],
      recommendedAnalyses: [
        'O-E ratio analysis',
        'CUSUM for quality monitoring'
      ],
      regulatoryGuidance: ['STS Database definitions', 'ACC/AHA CABG guidelines'],
      keyReferences: ['STS CABG Composite Score', 'FREEDOM trial']
    }
  ],
  commonEndpoints: [],
  commonRiskFactors: [],
  standardAnalyses: [
    'Wilson score confidence intervals for proportions',
    'Kaplan-Meier survival analysis',
    'Log-rank test for survival comparison',
    'Logistic regression for binary outcomes',
    'Cox proportional hazards for time-to-event'
  ],
  regulatoryBodies: ['STS', 'EACTS', 'SVS', 'ACC', 'AHA']
};

// =============================================================================
// ONCOLOGY DOMAIN
// =============================================================================

const ONCOLOGY_DOMAIN: ClinicalDomain = {
  domain: 'oncology',
  description: 'Cancer treatment trials and outcomes research',
  keywords: ['cancer', 'tumor', 'oncology', 'chemotherapy', 'immunotherapy', 'radiation', 'malignancy', 'carcinoma', 'lymphoma', 'leukemia', 'melanoma', 'sarcoma'],
  subspecialties: [
    {
      name: 'solid_tumors',
      description: 'Solid tumor treatment trials',
      keywords: ['lung cancer', 'breast cancer', 'colorectal', 'pancreatic', 'prostate', 'ovarian', 'gastric', 'hepatocellular', 'renal cell', 'nsclc', 'sclc'],
      endpoints: [
        {
          name: 'overall_survival',
          alternateNames: ['os', 'survival', 'death', 'mortality'],
          type: 'time-to-event',
          unit: 'months',
          acceptable: { low: 12, high: 100 },  // Varies greatly by cancer type
          concerning: 6,
          direction: 'higher-better',
          source: 'FDA guidance, ASCO guidelines',
          analysisMethod: 'Kaplan-Meier with 95% CI, log-rank test, Cox regression',
          clinicalSignificance: 'Gold standard efficacy endpoint'
        },
        {
          name: 'progression_free_survival',
          alternateNames: ['pfs', 'time_to_progression', 'ttp'],
          type: 'time-to-event',
          unit: 'months',
          acceptable: { low: 6, high: 100 },
          concerning: 3,
          direction: 'higher-better',
          source: 'FDA surrogate endpoint guidance',
          analysisMethod: 'Kaplan-Meier, Cox regression, landmark analysis',
          clinicalSignificance: 'Primary endpoint in many trials, FDA-accepted surrogate'
        },
        {
          name: 'objective_response_rate',
          alternateNames: ['orr', 'response_rate', 'tumor_response', 'recist_response'],
          type: 'rate',
          unit: '%',
          acceptable: { low: 30, high: 100 },
          concerning: 15,
          direction: 'higher-better',
          source: 'RECIST 1.1 criteria',
          analysisMethod: 'Wilson score CI, exact binomial CI',
          clinicalSignificance: 'Early efficacy signal, accelerated approval endpoint'
        },
        {
          name: 'complete_response_rate',
          alternateNames: ['cr', 'complete_response', 'cr_rate'],
          type: 'rate',
          unit: '%',
          acceptable: { low: 10, high: 100 },
          concerning: 5,
          direction: 'higher-better',
          source: 'RECIST 1.1 criteria',
          analysisMethod: 'Wilson score CI',
          clinicalSignificance: 'Best tumor response'
        },
        {
          name: 'disease_control_rate',
          alternateNames: ['dcr', 'clinical_benefit_rate', 'cbr'],
          type: 'rate',
          unit: '%',
          acceptable: { low: 50, high: 100 },
          concerning: 30,
          direction: 'higher-better',
          source: 'RECIST 1.1 (CR + PR + SD)',
          analysisMethod: 'Wilson score CI',
          clinicalSignificance: 'Proportion with any disease control'
        },
        {
          name: 'duration_of_response',
          alternateNames: ['dor', 'response_duration'],
          type: 'time-to-event',
          unit: 'months',
          acceptable: { low: 6, high: 100 },
          concerning: 3,
          direction: 'higher-better',
          source: 'FDA guidance',
          analysisMethod: 'Kaplan-Meier among responders',
          clinicalSignificance: 'Durability of response'
        },
        {
          name: 'time_to_response',
          alternateNames: ['ttr'],
          type: 'continuous',
          unit: 'weeks',
          acceptable: { low: 0, high: 12 },
          concerning: 16,
          direction: 'lower-better',
          source: 'Clinical trials',
          analysisMethod: 'Median with range',
          clinicalSignificance: 'Speed of response'
        }
      ],
      riskFactors: [
        { name: 'ecog_performance_status', alternateNames: ['ecog', 'ps', 'performance_status', 'karnofsky'], expectedHR: 1.5, direction: 'harmful', source: 'Meta-analyses', strength: 'strong', modifiable: false },
        { name: 'tumor_stage', alternateNames: ['stage', 'tnm', 'ajcc_stage'], expectedHR: 1.8, direction: 'harmful', source: 'AJCC staging', strength: 'strong', modifiable: false },
        { name: 'age', expectedHR: 1.02, direction: 'harmful', source: 'Oncology literature', strength: 'moderate', modifiable: false },
        { name: 'prior_lines_of_therapy', alternateNames: ['prior_therapy', 'treatment_line', 'line_of_therapy'], expectedHR: 1.3, direction: 'harmful', source: 'Clinical trials', strength: 'moderate', modifiable: false },
        { name: 'tumor_burden', alternateNames: ['disease_burden', 'metastatic_sites'], expectedHR: 1.4, direction: 'harmful', source: 'Clinical trials', strength: 'moderate', modifiable: false },
        { name: 'biomarker_positive', alternateNames: ['pdl1', 'her2', 'egfr', 'alk', 'braf', 'kras', 'msi'], expectedHR: 0.6, direction: 'protective', source: 'Biomarker-selected trials', strength: 'strong', modifiable: false },
        { name: 'liver_metastases', alternateNames: ['hepatic_mets', 'liver_mets'], expectedHR: 1.5, direction: 'harmful', source: 'Clinical trials', strength: 'moderate', modifiable: false },
        { name: 'brain_metastases', alternateNames: ['cns_mets', 'brain_mets'], expectedHR: 1.8, direction: 'harmful', source: 'Clinical trials', strength: 'strong', modifiable: false }
      ],
      requiredAnalyses: [
        'Kaplan-Meier curves for OS and PFS with 95% CI',
        'Log-rank test for treatment comparison',
        'Hazard ratio with 95% CI (Cox regression)',
        'ORR with exact 95% CI',
        'Waterfall plot for best tumor response',
        'Spider plot for individual patient responses',
        'Subgroup analysis (forest plot)'
      ],
      recommendedAnalyses: [
        'Landmark analysis at 6, 12, 24 months',
        'Restricted mean survival time (RMST)',
        'Propensity score methods for non-randomized comparisons',
        'Biomarker subgroup analyses',
        'Time-varying hazard analysis (if PH assumption violated)',
        'Quality of life analysis (PROs)'
      ],
      regulatoryGuidance: ['FDA Guidance on Clinical Trial Endpoints', 'EMA Guidelines', 'RECIST 1.1', 'iRECIST for immunotherapy'],
      keyReferences: ['Eisenhauer EA, et al. Eur J Cancer (RECIST 1.1)', 'FDA Clinical Trial Endpoints Guidance']
    },
    {
      name: 'hematologic_malignancies',
      description: 'Blood cancers and bone marrow disorders',
      keywords: ['leukemia', 'lymphoma', 'myeloma', 'aml', 'all', 'cll', 'hodgkin', 'non-hodgkin', 'multiple myeloma', 'mds'],
      endpoints: [
        {
          name: 'overall_survival',
          alternateNames: ['os'],
          type: 'time-to-event',
          unit: 'months',
          acceptable: { low: 24, high: 100 },
          concerning: 12,
          direction: 'higher-better',
          source: 'Hematology guidelines',
          analysisMethod: 'Kaplan-Meier, Cox regression',
          clinicalSignificance: 'Primary efficacy endpoint'
        },
        {
          name: 'complete_remission',
          alternateNames: ['cr', 'complete_response', 'remission'],
          type: 'rate',
          unit: '%',
          acceptable: { low: 40, high: 100 },
          concerning: 20,
          direction: 'higher-better',
          source: 'IWG response criteria, Lugano criteria',
          analysisMethod: 'Wilson score CI',
          clinicalSignificance: 'Depth of response'
        },
        {
          name: 'minimal_residual_disease',
          alternateNames: ['mrd', 'mrd_negative', 'mrd_negativity'],
          type: 'rate',
          unit: '%',
          acceptable: { low: 30, high: 100 },
          concerning: 15,
          direction: 'higher-better',
          source: 'FDA guidance on MRD',
          analysisMethod: 'Wilson score CI',
          clinicalSignificance: 'Emerging surrogate endpoint'
        },
        {
          name: 'event_free_survival',
          alternateNames: ['efs', 'relapse_free_survival', 'rfs'],
          type: 'time-to-event',
          unit: 'months',
          acceptable: { low: 12, high: 100 },
          concerning: 6,
          direction: 'higher-better',
          source: 'IWG criteria',
          analysisMethod: 'Kaplan-Meier',
          clinicalSignificance: 'Time without disease-related events'
        }
      ],
      riskFactors: [
        { name: 'cytogenetics', alternateNames: ['karyotype', 'risk_group', 'cytogenetic_risk'], expectedHR: 2.5, direction: 'harmful', source: 'ELN classification', strength: 'strong', modifiable: false },
        { name: 'age', expectedHR: 1.03, direction: 'harmful', source: 'Leukemia literature', strength: 'moderate', modifiable: false },
        { name: 'wbc_count', alternateNames: ['white_blood_cell', 'leukocyte_count'], expectedHR: 1.5, direction: 'harmful', source: 'Prognostic models', strength: 'moderate', modifiable: false }
      ],
      requiredAnalyses: [
        'Response rates with 95% CI per disease-specific criteria',
        'Kaplan-Meier for EFS and OS',
        'MRD analysis if applicable',
        'Subgroup by cytogenetic risk'
      ],
      recommendedAnalyses: [
        'Competing risks analysis (relapse vs. death)',
        'Landmark analysis for post-CR outcomes'
      ],
      regulatoryGuidance: ['IWG AML criteria', 'Lugano criteria', 'IMWG myeloma criteria'],
      keyReferences: ['Döhner H, et al. Blood (ELN AML)', 'Cheson BD, et al. JCO (Lugano)']
    }
  ],
  commonEndpoints: [
    {
      name: 'treatment_related_adverse_events',
      alternateNames: ['trae', 'adverse_events', 'toxicity', 'side_effects'],
      type: 'rate',
      unit: '%',
      acceptable: { low: 0, high: 70 },  // Any grade
      concerning: 85,
      direction: 'lower-better',
      source: 'CTCAE v5.0',
      analysisMethod: 'Frequency tables, Wilson CI',
      clinicalSignificance: 'Safety profile'
    },
    {
      name: 'grade_3_plus_adverse_events',
      alternateNames: ['grade3_ae', 'severe_ae', 'serious_adverse_events'],
      type: 'rate',
      unit: '%',
      acceptable: { low: 0, high: 30 },
      concerning: 50,
      direction: 'lower-better',
      source: 'CTCAE v5.0',
      analysisMethod: 'Wilson CI',
      clinicalSignificance: 'Severe toxicity'
    },
    {
      name: 'treatment_discontinuation',
      alternateNames: ['discontinuation', 'withdrawal', 'stopped_treatment'],
      type: 'rate',
      unit: '%',
      acceptable: { low: 0, high: 15 },
      concerning: 25,
      direction: 'lower-better',
      source: 'Clinical trial standards',
      analysisMethod: 'Wilson CI, time-to-discontinuation',
      clinicalSignificance: 'Tolerability'
    }
  ],
  commonRiskFactors: [],
  standardAnalyses: [
    'Kaplan-Meier survival curves with 95% CI',
    'Log-rank test for treatment comparison',
    'Cox proportional hazards regression',
    'Hazard ratio with 95% CI',
    'Response rates with exact binomial CI',
    'RECIST response assessment',
    'Waterfall plots for tumor burden change',
    'Swimmer plots for response duration',
    'Forest plots for subgroup analyses'
  ],
  regulatoryBodies: ['FDA', 'EMA', 'PMDA', 'ASCO', 'ESMO']
};

// =============================================================================
// DIABETES/ENDOCRINOLOGY DOMAIN
// =============================================================================

const DIABETES_DOMAIN: ClinicalDomain = {
  domain: 'diabetes_endocrinology',
  description: 'Diabetes mellitus and metabolic disorders',
  keywords: ['diabetes', 'glucose', 'insulin', 'hba1c', 'glycemic', 'metabolic', 'obesity', 'weight', 'endocrine'],
  subspecialties: [
    {
      name: 'type2_diabetes',
      description: 'Type 2 diabetes mellitus treatment trials',
      keywords: ['t2dm', 'type 2', 'oral antidiabetic', 'glp1', 'sglt2', 'metformin', 'sulfonylurea'],
      endpoints: [
        {
          name: 'hba1c_change',
          alternateNames: ['hba1c', 'glycated_hemoglobin', 'a1c', 'hemoglobin_a1c'],
          type: 'continuous',
          unit: '%',
          acceptable: { low: -2.0, high: -0.5 },  // Change from baseline
          concerning: -0.3,
          direction: 'lower-better',  // More negative change = better
          source: 'ADA Standards of Care',
          analysisMethod: 'ANCOVA with baseline as covariate, mixed model repeated measures (MMRM)',
          clinicalSignificance: 'Surrogate endpoint for glycemic control'
        },
        {
          name: 'hba1c_target_achievement',
          alternateNames: ['hba1c_less_than_7', 'glycemic_target'],
          type: 'rate',
          unit: '%',
          acceptable: { low: 40, high: 100 },
          concerning: 25,
          direction: 'higher-better',
          source: 'ADA Guidelines',
          analysisMethod: 'Logistic regression, Wilson CI',
          clinicalSignificance: 'Proportion achieving glycemic goal'
        },
        {
          name: 'fasting_plasma_glucose',
          alternateNames: ['fpg', 'fasting_glucose'],
          type: 'continuous',
          unit: 'mg/dL',
          acceptable: { low: -40, high: -15 },  // Change
          concerning: -10,
          direction: 'lower-better',
          source: 'ADA Standards',
          analysisMethod: 'ANCOVA, MMRM',
          clinicalSignificance: 'Short-term glycemic control'
        },
        {
          name: 'hypoglycemia_rate',
          alternateNames: ['hypoglycemia', 'low_blood_sugar', 'hypo_events'],
          type: 'rate',
          unit: 'events/patient-year',
          acceptable: { low: 0, high: 2 },
          concerning: 5,
          direction: 'lower-better',
          source: 'ADA hypoglycemia classification',
          analysisMethod: 'Poisson or negative binomial regression',
          clinicalSignificance: 'Safety endpoint, treatment burden'
        },
        {
          name: 'weight_change',
          alternateNames: ['body_weight', 'weight_loss', 'weight_gain'],
          type: 'continuous',
          unit: 'kg',
          acceptable: { low: -5, high: 1 },
          concerning: 3,
          direction: 'lower-better',
          source: 'Obesity guidelines',
          analysisMethod: 'ANCOVA, MMRM',
          clinicalSignificance: 'Metabolic benefit or concern'
        },
        {
          name: 'mace',
          alternateNames: ['major_adverse_cardiovascular_events', 'cardiovascular_outcome'],
          type: 'time-to-event',
          unit: 'HR',
          acceptable: { low: 0, high: 1.0 },
          concerning: 1.3,
          direction: 'lower-better',
          source: 'FDA CV outcomes guidance',
          analysisMethod: 'Kaplan-Meier, Cox regression, non-inferiority testing',
          clinicalSignificance: 'Required for CV safety'
        }
      ],
      riskFactors: [
        { name: 'baseline_hba1c', expectedOR: 1.2, direction: 'harmful', source: 'Diabetes trials', strength: 'moderate', modifiable: false },
        { name: 'diabetes_duration', alternateNames: ['years_since_diagnosis'], expectedOR: 1.05, direction: 'harmful', source: 'UKPDS', strength: 'moderate', modifiable: false },
        { name: 'bmi', alternateNames: ['body_mass_index', 'obesity'], expectedOR: 1.1, direction: 'harmful', source: 'Obesity literature', strength: 'moderate', modifiable: true }
      ],
      requiredAnalyses: [
        'MMRM for HbA1c change from baseline',
        'ANCOVA at primary endpoint',
        'Responder analysis (proportion achieving <7%)',
        'Hypoglycemia event rates',
        'Safety summary tables (adverse events by SOC)'
      ],
      recommendedAnalyses: [
        'Time to glycemic target',
        'Durability analysis',
        'Subgroup analyses (baseline HbA1c, renal function)',
        'Exposure-response analysis'
      ],
      regulatoryGuidance: ['FDA Diabetes guidance', 'EMA diabetes guidance', 'ADA Standards of Care'],
      keyReferences: ['FDA Guidance for Diabetes Drug Development', 'ADA/EASD Consensus']
    }
  ],
  commonEndpoints: [],
  commonRiskFactors: [],
  standardAnalyses: [
    'Mixed model repeated measures (MMRM)',
    'ANCOVA with baseline covariate',
    'Responder analysis with logistic regression',
    'Event rate analysis (Poisson/negative binomial)',
    'Time-to-event for MACE outcomes'
  ],
  regulatoryBodies: ['FDA', 'EMA', 'ADA', 'EASD']
};

// =============================================================================
// NEUROLOGY DOMAIN
// =============================================================================

const NEUROLOGY_DOMAIN: ClinicalDomain = {
  domain: 'neurology',
  description: 'Neurological disorders and treatments',
  keywords: ['brain', 'neurology', 'cognitive', 'alzheimer', 'parkinson', 'stroke', 'epilepsy', 'multiple sclerosis', 'ms', 'dementia', 'neuropathy'],
  subspecialties: [
    {
      name: 'alzheimers_dementia',
      description: 'Alzheimer\'s disease and dementia trials',
      keywords: ['alzheimer', 'dementia', 'cognitive decline', 'memory', 'amyloid', 'tau'],
      endpoints: [
        {
          name: 'adas_cog_change',
          alternateNames: ['adas_cog', 'adas', 'cognitive_score'],
          type: 'continuous',
          unit: 'points',
          acceptable: { low: -4, high: 0 },  // Change, negative = improvement
          concerning: 2,
          direction: 'lower-better',
          source: 'FDA dementia guidance',
          analysisMethod: 'MMRM, ANCOVA',
          clinicalSignificance: 'Cognitive function primary endpoint'
        },
        {
          name: 'cdr_sb_change',
          alternateNames: ['cdr_sb', 'clinical_dementia_rating', 'cdr'],
          type: 'continuous',
          unit: 'points',
          acceptable: { low: -1, high: 0.5 },
          concerning: 1.5,
          direction: 'lower-better',
          source: 'FDA guidance',
          analysisMethod: 'MMRM, ordinal regression',
          clinicalSignificance: 'Functional/global co-primary endpoint'
        },
        {
          name: 'amyloid_reduction',
          alternateNames: ['amyloid_pet', 'amyloid_change'],
          type: 'continuous',
          unit: 'centiloids',
          acceptable: { low: -80, high: -20 },
          concerning: -10,
          direction: 'lower-better',
          source: 'Amyloid imaging trials',
          analysisMethod: 'ANCOVA',
          clinicalSignificance: 'Biomarker endpoint for accelerated approval'
        }
      ],
      riskFactors: [
        { name: 'apoe4_carrier', alternateNames: ['apoe4', 'apoe_genotype'], expectedHR: 1.5, direction: 'harmful', source: 'Genetic studies', strength: 'strong', modifiable: false },
        { name: 'baseline_mmse', alternateNames: ['mmse', 'mini_mental'], expectedHR: 0.95, direction: 'protective', source: 'Clinical trials', strength: 'moderate', modifiable: false },
        { name: 'age', expectedHR: 1.02, direction: 'harmful', source: 'Dementia epidemiology', strength: 'moderate', modifiable: false }
      ],
      requiredAnalyses: [
        'MMRM for cognitive outcomes',
        'ANCOVA at primary timepoint',
        'Responder analysis',
        'ARIA monitoring (MRI safety)'
      ],
      recommendedAnalyses: [
        'Biomarker subgroup analysis (amyloid PET)',
        'APOE4 carrier subgroup analysis',
        'Time to clinical milestone'
      ],
      regulatoryGuidance: ['FDA Early Alzheimer\'s Disease guidance', 'Accelerated approval pathway'],
      keyReferences: ['FDA Guidance on Early AD', 'Aducanumab approval documents']
    }
  ],
  commonEndpoints: [],
  commonRiskFactors: [],
  standardAnalyses: [
    'Mixed model repeated measures (MMRM)',
    'Responder analysis',
    'Time-to-event for disease milestones',
    'Biomarker analysis'
  ],
  regulatoryBodies: ['FDA', 'EMA', 'AAN']
};

// =============================================================================
// LIBRARY AGGREGATION & ACCESS
// =============================================================================

export const CLINICAL_BENCHMARK_LIBRARY: ClinicalDomain[] = [
  CARDIOVASCULAR_DOMAIN,
  ONCOLOGY_DOMAIN,
  DIABETES_DOMAIN,
  NEUROLOGY_DOMAIN
];

/**
 * Find matching domain based on keywords in PICO or schema
 */
export function detectClinicalDomain(
  pico?: { population?: string; intervention?: string; comparison?: string; outcome?: string } | null,
  schemaVariables?: Array<{ name: string; label: string }>,
  studyTitle?: string
): ClinicalDomain | null {
  const searchText = [
    pico?.population,
    pico?.intervention,
    pico?.outcome,
    studyTitle,
    ...(schemaVariables?.map(v => v.name) || []),
    ...(schemaVariables?.map(v => v.label) || [])
  ].filter(Boolean).join(' ').toLowerCase();

  // Score each domain
  let bestMatch: { domain: ClinicalDomain; score: number } | null = null;

  for (const domain of CLINICAL_BENCHMARK_LIBRARY) {
    let score = 0;

    // Check domain keywords
    for (const keyword of domain.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        score += 2;
      }
    }

    // Check subspecialty keywords (higher weight)
    for (const sub of domain.subspecialties) {
      for (const keyword of sub.keywords) {
        if (searchText.includes(keyword.toLowerCase())) {
          score += 3;
        }
      }
    }

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { domain, score };
    }
  }

  return bestMatch?.domain || null;
}

/**
 * Find matching subspecialty within a domain
 */
export function detectSubspecialty(
  domain: ClinicalDomain,
  pico?: { population?: string; intervention?: string; comparison?: string; outcome?: string } | null,
  schemaVariables?: Array<{ name: string; label: string }>
): DomainSubspecialty | null {
  const searchText = [
    pico?.population,
    pico?.intervention,
    pico?.outcome,
    ...(schemaVariables?.map(v => v.name) || []),
    ...(schemaVariables?.map(v => v.label) || [])
  ].filter(Boolean).join(' ').toLowerCase();

  let bestMatch: { sub: DomainSubspecialty; score: number } | null = null;

  for (const sub of domain.subspecialties) {
    let score = 0;
    for (const keyword of sub.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { sub, score };
    }
  }

  return bestMatch?.sub || domain.subspecialties[0] || null;
}

/**
 * Match schema variables to known endpoints
 */
export function matchVariableToEndpoint(
  variableName: string,
  variableLabel: string,
  domain: ClinicalDomain,
  subspecialty?: DomainSubspecialty
): EndpointBenchmark | null {
  const searchTerms = [variableName, variableLabel].map(s => s.toLowerCase());

  // Search subspecialty endpoints first
  if (subspecialty) {
    for (const endpoint of subspecialty.endpoints) {
      const endpointNames = [endpoint.name, ...(endpoint.alternateNames || [])].map(s => s.toLowerCase());
      for (const term of searchTerms) {
        if (endpointNames.some(en => term.includes(en) || en.includes(term))) {
          return endpoint;
        }
      }
    }
  }

  // Then check common domain endpoints
  for (const endpoint of domain.commonEndpoints) {
    const endpointNames = [endpoint.name, ...(endpoint.alternateNames || [])].map(s => s.toLowerCase());
    for (const term of searchTerms) {
      if (endpointNames.some(en => term.includes(en) || en.includes(term))) {
        return endpoint;
      }
    }
  }

  return null;
}

/**
 * Match schema variables to known risk factors
 */
export function matchVariableToRiskFactor(
  variableName: string,
  variableLabel: string,
  domain: ClinicalDomain,
  subspecialty?: DomainSubspecialty
): RiskFactor | null {
  const searchTerms = [variableName, variableLabel].map(s => s.toLowerCase());

  // Search subspecialty risk factors first
  if (subspecialty) {
    for (const rf of subspecialty.riskFactors) {
      const rfNames = [rf.name, ...(rf.alternateNames || [])].map(s => s.toLowerCase());
      for (const term of searchTerms) {
        if (rfNames.some(rn => term.includes(rn) || rn.includes(term))) {
          return rf;
        }
      }
    }
  }

  // Then check common domain risk factors
  for (const rf of domain.commonRiskFactors) {
    const rfNames = [rf.name, ...(rf.alternateNames || [])].map(s => s.toLowerCase());
    for (const term of searchTerms) {
      if (rfNames.some(rn => term.includes(rn) || rn.includes(term))) {
        return rf;
      }
    }
  }

  return null;
}

/**
 * Get formatted benchmarks for prompt engineering
 */
export function getFormattedBenchmarksForPrompt(
  domain: ClinicalDomain,
  subspecialty?: DomainSubspecialty
): string {
  const lines: string[] = [];

  lines.push(`## Clinical Domain: ${domain.domain.toUpperCase()}`);
  lines.push(`Regulatory bodies: ${domain.regulatoryBodies.join(', ')}`);
  lines.push('');

  if (subspecialty) {
    lines.push(`### Subspecialty: ${subspecialty.name}`);
    lines.push(`Description: ${subspecialty.description}`);
    lines.push('');

    lines.push('#### Endpoint Benchmarks:');
    for (const ep of subspecialty.endpoints) {
      const dir = ep.direction === 'lower-better' ? '↓ lower is better' : '↑ higher is better';
      lines.push(`- **${ep.name}**: Acceptable ${ep.acceptable.low}-${ep.acceptable.high}${ep.unit || ''}, Concerning: ${ep.concerning}${ep.unit || ''} (${dir})`);
      lines.push(`  Analysis: ${ep.analysisMethod}`);
      lines.push(`  Source: ${ep.source}`);
    }
    lines.push('');

    lines.push('#### Known Risk Factors:');
    for (const rf of subspecialty.riskFactors) {
      const effect = rf.expectedOR ? `OR=${rf.expectedOR}` : rf.expectedHR ? `HR=${rf.expectedHR}` : '';
      lines.push(`- **${rf.name}**: ${rf.direction} ${effect} (${rf.strength} evidence, Source: ${rf.source})`);
    }
    lines.push('');

    lines.push('#### Required Analyses:');
    subspecialty.requiredAnalyses.forEach(a => lines.push(`- ${a}`));
    lines.push('');

    lines.push('#### Recommended Analyses:');
    subspecialty.recommendedAnalyses.forEach(a => lines.push(`- ${a}`));
    lines.push('');

    lines.push('#### Regulatory Guidance:');
    subspecialty.regulatoryGuidance.forEach(g => lines.push(`- ${g}`));
  }

  return lines.join('\n');
}

/**
 * Get all endpoints from a domain (common + all subspecialties)
 */
export function getAllDomainEndpoints(domain: ClinicalDomain): EndpointBenchmark[] {
  const endpoints: EndpointBenchmark[] = [...domain.commonEndpoints];
  for (const sub of domain.subspecialties) {
    endpoints.push(...sub.endpoints);
  }
  return endpoints;
}

/**
 * Get all risk factors from a domain (common + all subspecialties)
 */
export function getAllDomainRiskFactors(domain: ClinicalDomain): RiskFactor[] {
  const riskFactors: RiskFactor[] = [...domain.commonRiskFactors];
  for (const sub of domain.subspecialties) {
    riskFactors.push(...sub.riskFactors);
  }
  return riskFactors;
}
