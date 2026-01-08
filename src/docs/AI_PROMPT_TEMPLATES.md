# AI Prompt Template for Mock Data Generation

## Quick Copy-Paste Prompts

### Prompt 1: Cardiovascular RCT (Comprehensive)

```
I need you to fill this Clinical Intelligence Engine template with realistic clinical trial data.

STUDY TYPE: Phase III Randomized Controlled Trial
THERAPEUTIC AREA: Cardiology - Hypertension

STUDY PARAMETERS:
- Protocol Number: PROTO-2024-CARDIO-001
- Study Title: "Efficacy and Safety of Novel ACE Inhibitor ACE-X versus Placebo in Essential Hypertension: A Multicenter RCT"
- Sample Size: 300 patients (1:1 randomization)
  - Treatment arm (ACE-X 10mg daily): 150 patients
  - Placebo arm: 150 patients
- Duration: 12 months
- Visit Schedule: Baseline, Month 3, 6, 9, 12
- Sites: 15 centers across US

PRIMARY ENDPOINT:
- Mean change in sitting systolic blood pressure from baseline to 12 months

SECONDARY ENDPOINTS:
- Mean change in diastolic blood pressure
- Proportion achieving BP control (<140/90 mmHg)
- Major adverse cardiovascular events (MACE)
- All-cause mortality
- Quality of life (SF-36 score)

PATIENT DEMOGRAPHICS (Generate 300 unique patients):
- Age: 45-75 years (mean ~60, SD 8)
- Gender: 55% male, 45% female
- Race/Ethnicity:
  * 60% White
  * 20% Black/African American
  * 15% Hispanic/Latino
  * 5% Asian
- BMI: 25-35 kg/m² (overweight to obese range)
- Baseline SBP: 145-175 mmHg (Stage 1-2 hypertension)
- Baseline DBP: 85-105 mmHg

INCLUSION CRITERIA:
1. Age 45-75 years
2. Essential hypertension (SBP 140-180 mmHg)
3. No BP medications for ≥4 weeks
4. eGFR >60 mL/min/1.73m²
5. Willing to provide informed consent

EXCLUSION CRITERIA:
1. Secondary hypertension
2. Recent cardiovascular event (<6 months)
3. NYHA Class III-IV heart failure
4. Severe renal impairment (eGFR <45)
5. Known ACE inhibitor allergy
6. Pregnancy or lactation

CLINICAL MEASUREMENTS PER VISIT:
1. Vital Signs:
   - Blood pressure (sitting, 3 measurements averaged)
   - Heart rate
   - Weight
   - Height (baseline only)

2. Laboratory Tests:
   - Complete blood count (CBC)
   - Comprehensive metabolic panel (CMP)
   - Lipid panel (total cholesterol, LDL, HDL, triglycerides)
   - Renal function (creatinine, eGFR, BUN)
   - Electrolytes (sodium, potassium, chloride)
   - Glucose and HbA1c
   - Liver function tests (ALT, AST, bilirubin)

3. Other Assessments:
   - 12-lead ECG
   - Adverse event monitoring
   - Concomitant medication review
   - Protocol compliance
   - Quality of life questionnaire (SF-36)

EXPECTED TREATMENT EFFECTS:
Treatment Arm (ACE-X):
- Mean SBP reduction: -12 mmHg (SD 8) at 12 months
- Mean DBP reduction: -7 mmHg (SD 6) at 12 months
- BP control rate: 68%
- MACE events: 3 patients (2%)
- Mortality: 1 patient (0.7%)

Placebo Arm:
- Mean SBP reduction: -3 mmHg (SD 7) at 12 months
- Mean DBP reduction: -2 mmHg (SD 5) at 12 months
- BP control rate: 28%
- MACE events: 8 patients (5.3%)
- Mortality: 3 patients (2%)

Statistical Significance:
- Primary endpoint p-value: <0.001
- Effect size (Cohen's d): 1.2
- 95% CI for SBP difference: [-11.2, -6.8] mmHg

ADVERSE EVENTS (Treatment arm rates):
Common (>5%):
- Dry cough: 15%
- Dizziness: 12%
- Headache: 8%
- Fatigue: 7%

Uncommon (1-5%):
- Hypotension: 4%
- Hyperkalemia: 3%
- Angioedema: 2%
- Rash: 2%

DROPOUT ANALYSIS:
- Total dropout: 36 patients (12%)
- Reasons:
  * Adverse events: 15 patients
  * Lost to follow-up: 12 patients
  * Withdrawal of consent: 6 patients
  * Protocol violations: 3 patients
- Dropout distribution similar between arms

MANUSCRIPT COMPONENTS:

Introduction (800 words):
- Burden of hypertension globally
- Current treatment landscape
- Limitations of existing ACE inhibitors
- Rationale for ACE-X development
- Study objectives and hypotheses

Methods (1200 words):
- Study design and oversight
- Patient population and randomization
- Treatment protocols
- Outcome measures
- Statistical analysis plan
- Sample size calculation and power

Results (1500 words):
- Patient disposition (CONSORT diagram)
- Baseline characteristics table
- Primary endpoint results
- Secondary endpoint results
- Subgroup analyses
- Safety results
- Adverse event table

Discussion (1200 words):
- Summary of key findings
- Comparison with previous ACE inhibitor trials
- Clinical significance of BP reduction
- Safety profile discussion
- Study limitations
- Clinical implications
- Future research directions

REFERENCES (15 key papers):
Include these landmark hypertension trials:
1. SPRINT Trial (2015)
2. ALLHAT Trial (2002)
3. HOPE Trial (2000)
4. ACCOMPLISH Trial (2008)
5. European Society of Hypertension Guidelines (2023)
6. JNC 8 Guidelines
7. [Add 9 more relevant ACE inhibitor or hypertension trials]

STATISTICAL MANIFEST:
Generate complete descriptive statistics for:
- All demographic variables
- All vital signs at each timepoint
- All laboratory values at each timepoint
- Comparative analyses (treatment vs placebo) for all endpoints
- Regression models for:
  * Predictors of BP response
  * Time-to-event analysis for MACE
  * Adjusted analyses for baseline covariates

DATA QUALITY:
- Include realistic variability
- Add missing data (5-8% for labs, 2-3% for vital signs)
- Include protocol deviations (8% of visits)
- Add data queries (10% of records)
- Include outliers (2-3%)

Please generate complete, medically accurate data for all 300 patients across all visits. Ensure internal consistency (e.g., BMI calculated from height/weight, eGFR consistent with age/sex/creatinine). Include realistic temporal trends in the data.

[PASTE TEMPLATE JSON BELOW]
```

---

### Prompt 2: Oncology Trial (Simplified)

```
Generate Phase II oncology trial data:

STUDY: "Biomarker-Selected Immunotherapy in Metastatic Melanoma"
PROTOCOL: PROTO-2024-ONCO-002
N = 80 patients
Duration: 24 months follow-up

TREATMENT: Anti-PD-1 immunotherapy every 3 weeks

ENDPOINTS:
Primary: Objective response rate (ORR)
Secondary: Progression-free survival, overall survival, toxicity

PATIENT CHARACTERISTICS:
- Age: 40-80 years
- Metastatic melanoma (Stage IV)
- ECOG 0-1
- PD-L1 positive (>50%)
- No prior immunotherapy

ASSESSMENTS:
- Tumor measurements (RECIST 1.1) every 9 weeks
- Biomarkers: PD-L1, tumor mutational burden, circulating tumor DNA
- Toxicity per CTCAE v5.0
- Survival follow-up

EXPECTED RESULTS:
- ORR: 45%
- Median PFS: 8 months
- Median OS: 18 months
- Grade 3-4 toxicity: 25%

Generate realistic patient records, imaging assessments, biomarker data, toxicity profiles, and survival data.

[PASTE TEMPLATE JSON BELOW]
```

---

### Prompt 3: Real-World Evidence Study

```
Generate real-world evidence study from electronic health records:

STUDY: "Comparative Effectiveness of Diabetes Medications in Community Practice"
PROTOCOL: PROTO-2024-RWE-004
DATA SOURCE: 5 integrated healthcare systems
N = 5,000 patients with Type 2 diabetes
PERIOD: 2020-2023

EXPOSURE GROUPS:
- Metformin + GLP-1 agonist (n=2000)
- Metformin + SGLT2 inhibitor (n=1500)
- Metformin + DPP-4 inhibitor (n=1000)
- Metformin + Insulin (n=500)

BASELINE CHARACTERISTICS:
- Age: 45-75 years
- Diabetes duration: 5-15 years
- Baseline HbA1c: 7.5-10%
- BMI: 28-38 kg/m²
- Comorbidities: Hypertension (70%), dyslipidemia (60%), CKD (20%)

DATA POINTS:
- HbA1c every 3 months
- Weight every 3 months
- BP at each visit
- LDL cholesterol annually
- Medication adherence (PDC)
- Healthcare utilization
- Cardiovascular events
- Hypoglycemia events
- Treatment persistence

OUTCOMES:
- Primary: Mean HbA1c change at 12 months
- Secondary: Weight change, BP control, CV events, treatment persistence

STATISTICAL APPROACHES:
- Propensity score matching
- Inverse probability weighting
- Adjusted regression models
- Time-to-event analyses

Include realistic EHR patterns: missing data, irregular follow-up, treatment switching, variable adherence.

[PASTE TEMPLATE JSON BELOW]
```

---

### Prompt 4: Safety Database

```
Generate comprehensive safety database for drug approval submission:

PROGRAM: "ACE-X Clinical Development Program"
POOL: Integrated safety analysis of all Phase II-III trials
TOTAL EXPOSURE: 1,247 patients
COMPARATOR: Placebo (n=623) or Active control (n=624)

TRIALS INCLUDED:
1. PROTO-2024-CARDIO-001 (Phase III, hypertension, n=300)
2. PROTO-2023-CARDIO-005 (Phase III, heart failure, n=500)
3. PROTO-2023-CARDIO-008 (Phase IIb, hypertension, n=247)
4. PROTO-2022-CARDIO-012 (Phase II, dose-ranging, n=200)

ADVERSE EVENT CATEGORIES:
- Cardiovascular
- Respiratory
- Gastrointestinal
- Renal/Urinary
- Nervous system
- Skin/Hypersensitivity
- Metabolic/Laboratory
- Infections

SPECIAL SAFETY TOPICS:
- Hepatotoxicity monitoring
- Angioedema (ACE inhibitor class effect)
- Hyperkalemia
- Hypotension
- Renal function changes
- Pregnancy exposures
- Elderly subgroup

Generate:
- Individual patient adverse event listings
- Summary tables by system organ class
- Serious adverse events (detailed narratives)
- Deaths and other significant events
- Laboratory shift tables
- Subgroup analyses
- Time-to-onset analyses

Format according to ICH E3 guidance for regulatory submission.

[PASTE TEMPLATE JSON BELOW]
```

---

### Prompt 5: Pediatric Study

```
Generate pediatric clinical trial data:

STUDY: "Pharmacokinetics and Safety of Antibiotic-Z in Pediatric Pneumonia"
PROTOCOL: PROTO-2024-PED-003
PHASE: Phase II
N = 60 children

AGE COHORTS:
- Cohort 1: Ages 2-5 years (n=20)
- Cohort 2: Ages 6-8 years (n=20)  
- Cohort 3: Ages 9-12 years (n=20)

DESIGN:
- Open-label, single-arm
- Weight-based dosing
- 10 days of treatment
- PK sampling on Day 1 and Day 5

ASSESSMENTS:
- Vital signs (age-appropriate normal ranges)
- Growth parameters (weight, height, BMI percentile)
- Physical examination
- Clinical pneumonia score
- Chest X-ray
- Laboratory safety tests
- Pharmacokinetic blood sampling
- Adverse events

PK PARAMETERS:
- Cmax, Tmax, AUC, half-life, clearance, volume of distribution
- Stratified by age cohort
- Dose proportionality assessment

EFFICACY:
- Clinical cure rate: 85%
- Radiological improvement: 75%
- Time to fever resolution: 48 hours (median)

SAFETY:
- Treatment-emergent AEs (mostly mild GI symptoms)
- No serious AEs
- All lab values within age-appropriate ranges
- No drug discontinuations

Include pediatric-specific considerations: age-appropriate normal ranges, growth charts, developmental assessments, parent/guardian consent documentation.

[PASTE TEMPLATE JSON BELOW]
```

---

## Instructions for AI

When filling the template:

1. **Maintain Medical Accuracy**: Use realistic clinical values within normal/expected ranges
2. **Ensure Consistency**: 
   - BMI = weight(kg) / height(m)²
   - eGFR calculations match age/sex/creatinine
   - Disease progression follows expected patterns
3. **Include Variability**: Real data has scatter, not perfect linear relationships
4. **Add Realistic Imperfections**:
   - Missing data points (5-10%)
   - Protocol deviations (~5%)
   - Lost to follow-up (~10%)
   - Measurement errors
5. **Generate Unique IDs**: Patient IDs, record IDs should all be unique
6. **Use Proper Timestamps**: ISO 8601 format for dates, Unix timestamps for times
7. **Follow Statistical Principles**: 
   - Sample sizes match power calculations
   - P-values reflect actual difference magnitude
   - Confidence intervals are mathematically correct
8. **Clinical Plausibility**: Events should follow expected rates from literature

## Output Format

Return the completed JSON in this exact structure:
```json
{
  "exportMetadata": { ... },
  "projects": [ ... ],
  "globalTemplates": [ ... ],
  "globalPersonas": [ ... ]
}
```

Ensure all fields from the template are filled, no placeholders like "TBD" or "..." remain.
