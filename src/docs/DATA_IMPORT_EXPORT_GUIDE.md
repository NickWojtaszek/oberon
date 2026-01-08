# Data Import/Export System - Complete Guide

## Overview

The Data Import/Export system provides comprehensive testing utilities for the Clinical Intelligence Engine. It allows you to:

1. **Export** complete system state to JSON
2. **Generate** mock data templates with full field documentation
3. **Import** AI-filled mock data for rapid testing
4. **Test** all workflows without manual data entry

---

## Quick Start

### 1. Access the Tool

Navigate to: **Data Import/Export** in the left sidebar (bottom of navigation)

### 2. Generate Mock Data Template

1. Click "Mock Data Template" tab
2. Click "Generate Template" button
3. Copy the generated JSON template
4. Use with AI (Claude, Gemini, GPT-4) to fill with realistic data
5. Import the filled data back into the system

---

## Features

### Export Complete System State

**What it exports:**
- All projects and settings
- Protocol schemas and versions
- Clinical data records
- Manuscripts and references
- Statistical manifests
- Personas and permissions
- Schema templates
- Metadata and timestamps

**Use cases:**
- System backups
- Data migration
- Testing environment setup
- Sharing test datasets

### Import Data

**Import modes:**
- **Update Existing:** Merge imported data with existing (recommended)
- **Skip Existing:** Only add new items, keep existing unchanged
- **Replace All:** ⚠️ Replace everything (irreversible - use with caution)

**Validation:**
- Automatic structure validation
- Error reporting with detailed messages
- Success metrics (projects, protocols, manuscripts, records imported)

### Mock Data Template Generation

**Included templates:**
- Project configuration
- Protocol schemas
- Clinical data records
- Manuscripts (IMRaD structure)
- Statistical manifests
- Personas and permissions
- Schema templates

---

## AI-Assisted Mock Data Generation

### Step-by-Step Process

1. **Generate Template**
   ```
   Navigate to "Mock Data Template" tab
   Click "Generate Template"
   Copy the JSON output
   ```

2. **Prepare AI Prompt**
   ```
   Use the provided template or create custom prompt
   See "AI Prompt Examples" below
   ```

3. **Fill Template with AI**
   ```
   Paste template into Claude/Gemini/GPT-4
   Add your specific requirements
   AI will generate realistic clinical data
   ```

4. **Import Generated Data**
   ```
   Save AI response as .json file
   Navigate to "Import Data" tab
   Select file and import mode
   Click "Import Data"
   ```

---

## AI Prompt Examples

### Example 1: Cardiovascular RCT

```
Using this Clinical Intelligence Engine template, generate a complete Phase III 
cardiovascular randomized controlled trial:

STUDY PARAMETERS:
- Protocol: PROTO-2024-CARDIO-001
- Title: "Efficacy and Safety of Novel ACE Inhibitor ACE-X vs Placebo in Hypertension"
- Sample size: 300 patients (150 treatment, 150 placebo)
- Duration: 12 months with visits at baseline, 3, 6, 9, and 12 months
- Primary endpoint: Change in systolic blood pressure from baseline to 12 months
- Secondary endpoints: Diastolic BP, cardiovascular events, mortality, quality of life

PATIENT DEMOGRAPHICS:
- Age range: 45-75 years (mean ~60)
- Gender: 55% male, 45% female
- Ethnicity: Diverse (60% White, 20% Black, 15% Hispanic, 5% Asian)
- BMI: 25-35 kg/m² (overweight to obese)
- Baseline systolic BP: 145-175 mmHg

CLINICAL MEASUREMENTS:
- Vital signs: BP, HR, weight, height
- Laboratory: Lipid panel, renal function (creatinine, eGFR), glucose, HbA1c, electrolytes
- ECG findings
- Quality of life scores (SF-36)

OUTCOMES:
- Treatment group: Mean SBP reduction of 12 mmHg (SD 8), p < 0.001
- Placebo group: Mean SBP reduction of 3 mmHg (SD 7)
- Adverse events: 15% dizziness, 10% dry cough, 5% hypotension in treatment group
- Dropout rate: 12% (reasons: adverse events, lost to follow-up, protocol violations)
- Cardiovascular events: 2% treatment vs 5% placebo (p = 0.08)

MANUSCRIPT:
- Include complete IMRaD structure
- 15 relevant references (key hypertension trials: SPRINT, ALLHAT, HOPE)
- Discussion of clinical significance
- Limitations and future directions

Please fill all fields with realistic, medically accurate data.
```

### Example 2: Oncology Cohort Study

```
Generate a prospective oncology cohort study:

STUDY PARAMETERS:
- Protocol: PROTO-2024-ONCO-002
- Title: "Biomarker Analysis in Stage III Colorectal Cancer: A Prospective Cohort"
- Sample size: 150 patients
- Duration: 36 months follow-up
- Primary endpoint: Disease-free survival
- Secondary endpoints: Overall survival, treatment response, biomarker correlations

PATIENT CHARACTERISTICS:
- Age: 50-80 years
- Stage III colorectal cancer (all received standard chemotherapy)
- ECOG performance status: 0-2
- Tumor locations: Colon (70%), Rectum (30%)

BIOMARKERS:
- Tumor markers: CEA, CA 19-9
- Genomic: KRAS, BRAF, MSI status
- Expression: PD-L1, MMR proteins

CLINICAL DATA:
- Baseline characteristics
- Treatment received (FOLFOX, CAPOX, etc.)
- Toxicity grades (CTCAE v5.0)
- Imaging responses (RECIST 1.1)
- Survival outcomes

Include realistic survival curves, hazard ratios, and statistical analysis.
```

### Example 3: Pediatric Safety Study

```
Generate a Phase II pediatric safety and pharmacokinetics study:

STUDY PARAMETERS:
- Protocol: PROTO-2024-PED-003
- Title: "Safety and PK of Antibiotic-Z in Pediatric Patients with Pneumonia"
- Sample size: 60 children (ages 2-12 years)
- Age cohorts: 2-5 years (n=20), 6-8 years (n=20), 9-12 years (n=20)
- Duration: 10 days treatment + 30 days follow-up

ASSESSMENTS:
- Vital signs (age-appropriate ranges)
- Growth parameters (weight, height, BMI percentiles)
- Laboratory safety monitoring
- Pharmacokinetic sampling
- Adverse event monitoring
- Clinical response to treatment

OUTCOMES:
- Safety profile (expected pediatric adverse events)
- PK parameters by age group
- Clinical cure rate: 85%
- Dose-response relationships

Include pediatric-specific normal ranges and considerations.
```

### Example 4: Multi-Site Real-World Evidence

```
Generate a multi-center real-world evidence study from electronic health records:

STUDY PARAMETERS:
- Protocol: PROTO-2024-RWE-004
- Title: "Real-World Effectiveness of Diabetes Medications in Community Practice"
- Data source: 5 healthcare systems
- Sample size: 5,000 patients with Type 2 diabetes
- Study period: 2020-2023
- Design: Retrospective cohort

COHORTS:
- Metformin monotherapy (n=2000)
- GLP-1 agonists (n=1500)
- SGLT2 inhibitors (n=1000)
- DPP-4 inhibitors (n=500)

DATA ELEMENTS:
- Demographics and comorbidities
- HbA1c trajectories over time
- Weight changes
- Cardiovascular events
- Healthcare utilization
- Medication adherence
- Costs

OUTCOMES:
- Primary: Mean HbA1c reduction
- Secondary: Weight loss, CV events, treatment persistence
- Include propensity score matching
- Subgroup analyses by age, baseline HbA1c, comorbidities

Add realistic EHR data patterns (missing data, variable follow-up, etc.)
```

---

## Field Documentation

### Project Template Fields

```typescript
{
  name: string;                    // Study name (e.g., "ACME Cardiovascular Trial")
  description: string;             // Brief study overview
  studyDesign: string;             // RCT, cohort, case-series, laboratory, technical-note
  primaryInvestigator: string;     // PI name
  institution: string;             // Conducting institution
  phase: string;                   // Phase I/II/III/IV
  therapeuticArea: string;         // Cardiology, Oncology, Neurology, etc.
  
  settings: {
    patientCount: number;          // Total enrollment target
    enrollmentStart: string;       // ISO date: "2024-01-15"
    enrollmentEnd: string;         // ISO date: "2025-01-15"
    followUpDuration: string;      // "12 months", "5 years"
    primaryEndpoint: string;       // Primary outcome measure
    secondaryEndpoints: string[];  // Array of secondary outcomes
    inclusionCriteria: string[];   // Eligibility criteria
    exclusionCriteria: string[];   // Exclusion criteria
    statisticalPower: number;      // 0.8 = 80% power
    alphaLevel: number;            // 0.05 = 5% significance
    randomizationRatio: string;    // "1:1", "2:1"
    blindingStrategy: string;      // open-label, single-blind, double-blind, triple-blind
    interventions: [{
      name: string;
      type: string;                // drug, device, procedure, behavioral
      dosage: string;              // "10mg daily"
      frequency: string;           // "Once daily", "BID"
      duration: string;            // "12 weeks"
    }]
  }
}
```

### Protocol Schema Block Fields

```typescript
{
  id: string;                      // Unique identifier: "demo_age"
  label: string;                   // Display name: "Age"
  category: string;                // demographics, vital-signs, laboratory, etc.
  dataType: string;                // categorical, continuous, text, date, time, boolean
  required: boolean;               // Is field mandatory?
  
  // For categorical variables
  options: string[];               // ["Male", "Female", "Other"]
  
  // For continuous variables
  unit: string;                    // "years", "mg/dL", "mmHg"
  minValue: number;                // Minimum allowed value
  maxValue: number;                // Maximum allowed value
  
  // Validation
  validationRules: {
    pattern: string;               // Regex pattern
    customRule: string;            // Custom validation logic
  };
  
  // Clinical context
  clinicalSignificance: string;    // Why this variable matters
  regulatoryRequirement: boolean;  // FDA/EMA required?
  collectionTimepoint: string;     // baseline, weekly, monthly, etc.
  visitNumber: number;             // Associated visit
}
```

### Clinical Data Record Fields

```typescript
{
  recordId: string;                // Unique record ID
  subjectId: string;               // Patient ID: "SUBJ-001"
  visitDate: string;               // ISO date: "2024-03-15"
  visitNumber: number;             // Visit sequence: 1, 2, 3...
  protocolNumber: string;          // Associated protocol
  protocolVersion: string;         // Protocol version: "1.0.0"
  
  data: {
    [blockId]: value;              // Dynamic fields based on schema
                                   // Example: { "demo_age": 65, "demo_sex": "Male" }
  };
  
  enteredBy: string;               // Data entry person
  enteredAt: number;               // Timestamp
  lastModifiedBy: string;          // Last editor
  lastModifiedAt: number;          // Last edit timestamp
  
  status: string;                  // draft, submitted, verified, locked, query
  queries: [{                      // Data queries
    field: string;
    query: string;
    raisedBy: string;
    raisedAt: number;
    resolved: boolean;
  }]
}
```

### Manuscript Template Fields

```typescript
{
  projectId: string;
  studyTitle: string;
  primaryInvestigator: string;
  
  manuscriptContent: {
    introduction: string;          // Background, rationale, objectives (500-1000 words)
    methods: string;               // Study design, population, procedures, statistics (1000-1500 words)
    results: string;               // Primary findings, secondary findings, tables/figures (1000-1500 words)
    discussion: string;            // Interpretation, limitations, clinical implications (1000-1500 words)
    conclusion: string;            // Summary of key findings (200-300 words)
  };
  
  linkedSources: [{                // Referenced literature
    id: string;
    title: string;
    authors: string[];             // ["Smith J", "Jones K"]
    year: number;                  // 2023
    journal: string;               // "New England Journal of Medicine"
    doi: string;                   // "10.1056/NEJMoa..."
    pmid: string;                  // PubMed ID
    abstract: string;
    keyFindings: string[];
    citationKey: string;           // "Smith_2023"
  }];
  
  reviewComments: [{               // Reviewer feedback
    id: string;
    section: string;               // introduction, methods, results, discussion, conclusion
    lineNumber: number;
    comment: string;
    severity: string;              // info, suggestion, required, critical
    author: string;
    timestamp: number;
    resolved: boolean;
  }]
}
```

### Statistical Manifest Fields

```typescript
{
  protocolId: string;
  protocolVersion: string;
  analysisDate: string;            // ISO date
  statistician: string;
  
  descriptiveStats: [{             // Summary statistics
    variableId: string;
    label: string;
    n: number;                     // Sample size
    mean: number;
    median: number;
    stdDev: number;
    min: number;
    max: number;
    q1: number;                    // 25th percentile
    q3: number;                    // 75th percentile
    frequencies: {};               // For categorical: { "Male": 150, "Female": 145 }
    missing: number;               // Count of missing values
    outliers: number[];            // Array of outlier values
  }];
  
  comparativeAnalyses: [{          // Hypothesis testing
    id: string;
    testType: string;              // ttest, chi-square, fisher, mann-whitney, anova
    variable1: string;
    variable2: string;
    groups: string[];              // ["Treatment", "Placebo"]
    testStatistic: number;
    degreesOfFreedom: number;
    pValue: number;                // 0.001 = p < 0.001
    confidenceInterval: {
      lower: number;
      upper: number;
    };
    effectSize: number;            // Cohen's d, odds ratio, etc.
    interpretation: string;
    clinicalSignificance: string;
  }];
  
  advancedModeling: [{             // Regression models
    modelId: string;
    modelType: string;             // linear-regression, logistic-regression, cox-regression
    outcome: string;
    predictors: string[];
    coefficients: [{
      variable: string;
      beta: number;
      standardError: number;
      zValue: number;
      pValue: number;
      oddsRatio: number;           // For logistic regression
      hazardRatio: number;         // For Cox regression
    }];
    goodnessOfFit: {
      rSquared: number;
      adjustedRSquared: number;
      aic: number;                 // Akaike Information Criterion
      bic: number;                 // Bayesian Information Criterion
      logLikelihood: number;
    };
  }]
}
```

---

## Testing Workflows

### Test 1: Complete RCT Workflow

1. Generate cardiovascular RCT mock data (Example 1 above)
2. Import data
3. Navigate through:
   - Dashboard → Verify project appears
   - Protocol Library → Verify protocol created
   - Database → Verify 300 patient records
   - Analytics & Statistics → Run descriptive stats
   - Academic Writing → Verify manuscript content

### Test 2: Multi-Project Scenario

1. Generate 3 different studies (Cardio, Onco, Diabetes)
2. Import all three
3. Test project switching
4. Verify data isolation
5. Test cross-project analytics

### Test 3: Data Entry Workflow

1. Import base protocol structure only
2. Manually add 5-10 patient records
3. Export entire system
4. Compare with original template

### Test 4: Manuscript Development

1. Import clinical data + statistical manifest
2. Generate manuscript using AI in Academic Writing module
3. Add citations from Sources Library
4. Run Logic Check
5. Export manuscript package

---

## Troubleshooting

### Import Fails

**Symptom:** Error during import  
**Solutions:**
- Check JSON syntax (use JSON validator)
- Verify all required fields present
- Check data types match expectations
- Review error messages for specific field issues

### Missing Data After Import

**Symptom:** Data imported but not visible  
**Solutions:**
- Refresh page (F5)
- Check correct project selected
- Verify import result showed success
- Check browser console for errors

### Template Generation Issues

**Symptom:** Generated template missing fields  
**Solutions:**
- Clear browser cache
- Check browser console
- Try regenerating template
- Report issue with browser/version info

---

## Best Practices

### For Testing

1. **Start Simple:** Begin with small datasets (10-20 records)
2. **Incremental Complexity:** Add more variables and patients gradually
3. **Validate First:** Check small import before large dataset
4. **Use Realistic Data:** Maintain clinical accuracy for meaningful tests
5. **Test Edge Cases:** Include missing data, outliers, dropouts

### For AI Generation

1. **Be Specific:** Provide detailed requirements in prompt
2. **Include Context:** Specify therapeutic area, population, endpoints
3. **Request Validation:** Ask AI to verify medical accuracy
4. **Iterate:** Start with basic template, add complexity
5. **Review Carefully:** Check generated data for inconsistencies

### For Production Use

1. **Backup First:** Always export before major imports
2. **Test Environment:** Use separate test project first
3. **Verify Integrity:** Check data after import
4. **Document Changes:** Keep log of imports/exports
5. **Version Control:** Save export files with dates/versions

---

## Advanced Usage

### Custom Template Modification

You can modify the generated template to add custom fields:

```json
{
  "customFields": {
    "institutionalReviewBoard": {
      "irbNumber": "IRB-2024-001",
      "approvalDate": "2024-01-15",
      "expirationDate": "2025-01-15"
    },
    "dataMonitoring": {
      "dmbcMembers": ["Dr. Smith", "Dr. Jones"],
      "meetingSchedule": "Quarterly"
    }
  }
}
```

### Batch Import Multiple Studies

1. Generate separate files for each study
2. Manually merge JSON arrays in export structure
3. Import combined file
4. All studies loaded simultaneously

### Selective Export

To export only specific projects, modify the export code to filter:

```typescript
const specificProject = dataExporter.exportProject('project-id-here');
const jsonString = dataExporter.exportToJSON({
  exportMetadata: { /* ... */ },
  projects: [specificProject],
  globalTemplates: [],
  globalPersonas: []
});
```

---

## API Reference

### Main Functions

```typescript
// Export all system data
const exportData = dataExporter.exportAll(description?: string)

// Export specific project
const projectData = dataExporter.exportProject(projectId: string)

// Generate mock template
const template = dataExporter.generateMockDataTemplate()

// Import data
const result = dataExporter.importAll(data, options)

// Import from JSON string
const result = dataExporter.importFromJSON(jsonString, options)
```

### Import Options

```typescript
interface ImportOptions {
  mergeMode?: 'replace' | 'update' | 'skip';
  validateData?: boolean;
  backupFirst?: boolean;
}
```

### Import Result

```typescript
interface ImportResult {
  success: boolean;
  projectsImported: number;
  protocolsImported: number;
  manuscriptsImported: number;
  clinicalRecordsImported: number;
  errors: string[];
  warnings: string[];
}
```

---

## Support & Feedback

For issues or feature requests:
1. Check browser console for errors
2. Review this documentation
3. Test with minimal dataset first
4. Document steps to reproduce issue
5. Report with system info (browser, OS, data size)

---

**Version:** 1.0.0  
**Last Updated:** 2026-01-04  
**Status:** Production Ready
