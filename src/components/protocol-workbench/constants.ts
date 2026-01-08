// Constants and static data for Protocol Workbench

import { Folder, Edit3, Calendar, Users, Hash, FileText, CheckSquare, Activity, GitBranch, Grid3x3, Pill, Droplet, ToggleLeft, Target } from 'lucide-react';
import type { Variable, CSVHeader, DataDistribution, DataType } from './types';

export const variableLibrary: Variable[] = [
  // Structural
  { id: 'section', name: 'Section Container', category: 'Structural', icon: Folder, defaultType: 'Section' },
  { id: 'custom', name: 'Custom Field', category: 'Structural', icon: Edit3, defaultType: 'Text' },
  
  // Demographics
  { id: 'age', name: 'Age', category: 'Demographics', icon: Calendar, defaultType: 'Continuous', defaultUnit: 'years' },
  { id: 'sex', name: 'Sex', category: 'Demographics', icon: Users, defaultType: 'Categorical' },
  { id: 'patient_id', name: 'Patient ID', category: 'Demographics', icon: Hash, defaultType: 'Text', isPII: true },
  { id: 'dob', name: 'Date of Birth', category: 'Demographics', icon: Calendar, defaultType: 'Date', isPII: true },
  { id: 'initials', name: 'Patient Initials', category: 'Demographics', icon: FileText, defaultType: 'Text', isPII: true },
  
  // Clinical
  { id: 'comorbidities', name: 'Co-existing Diseases', category: 'Clinical', icon: CheckSquare, defaultType: 'Multi-Select' },
  { id: 'hypertension', name: 'Hypertension', category: 'Clinical', icon: Activity, defaultType: 'Boolean' },
  { id: 'cad', name: 'Coronary Artery Disease', category: 'Clinical', icon: Activity, defaultType: 'Boolean' },
  { id: 'dissection_type', name: 'Dissection Type', category: 'Clinical', icon: GitBranch, defaultType: 'Conditional' },
  { id: 'svs_classification', name: 'SVS/STS Classification', category: 'Clinical', icon: Grid3x3, defaultType: 'Grid' },
  { id: 'stentgraft_type', name: 'Typ stentgraftu', category: 'Clinical', icon: Pill, defaultType: 'Categorical' },
  
  // Laboratory
  { id: 'hemoglobin', name: 'Hemoglobin', category: 'Laboratory', icon: Droplet, defaultType: 'Continuous', defaultUnit: 'g/dL' },
  { id: 'egfr', name: 'eGFR', category: 'Laboratory', icon: Activity, defaultType: 'Continuous', defaultUnit: 'mL/min/1.73m²' },
  { id: 'creatinine', name: 'Creatinine', category: 'Laboratory', icon: Droplet, defaultType: 'Continuous', defaultUnit: 'mg/dL' },
  
  // Treatments
  { id: 'dose', name: 'Dose', category: 'Treatments', icon: Pill, defaultType: 'Continuous', defaultUnit: 'mg' },
  { id: 'treatment_arm', name: 'Treatment Arm', category: 'Treatments', icon: ToggleLeft, defaultType: 'Categorical' },
  { id: 'revascularization', name: 'Revascularization Order', category: 'Treatments', icon: Grid3x3, defaultType: 'Ranked-Matrix' },
  
  // Endpoints
  { id: 'os', name: 'Overall Survival (OS)', category: 'Endpoints', icon: Target, defaultType: 'Continuous', defaultUnit: 'months' },
  { id: 'pfs', name: 'Progression-Free Survival (PFS)', category: 'Endpoints', icon: Target, defaultType: 'Continuous', defaultUnit: 'months' },
  { id: 'mortality_30d', name: '30-Day Mortality', category: 'Endpoints', icon: Target, defaultType: 'Boolean' },
];

export const mockCSVHeaders: CSVHeader[] = [
  { detected: 'pt_id_01', suggested: 'Patient ID', confidence: 95, isPII: true },
  { detected: 'age_years', suggested: 'Age', confidence: 98 },
  { detected: 'sex_mf', suggested: 'Sex', confidence: 92 },
  { detected: 'patient_initials', suggested: 'Patient Initials', confidence: 90, isPII: true },
  { detected: 'treatment_grp', suggested: 'Treatment Arm', confidence: 88 },
  { detected: 'survival_days', suggested: 'Overall Survival (OS)', confidence: 85 },
  { detected: 'hgb_value', suggested: 'Hemoglobin', confidence: 93 },
];

export const mockDataPreview = [
  { pt_id: 'PT001', age: 62, sex: 'M', arm: 'Treatment A', os_days: 450, hgb: 13.2 },
  { pt_id: 'PT002', age: 58, sex: 'F', arm: 'Treatment B', os_days: 380, hgb: 11.8 },
  { pt_id: 'PT003', age: 71, sex: 'M', arm: 'Treatment A', os_days: 520, hgb: 14.1 },
  { pt_id: 'PT004', age: 45, sex: 'F', arm: 'Control', os_days: 290, hgb: 10.5 },
  { pt_id: 'PT005', age: 67, sex: 'M', arm: 'Treatment B', os_days: 410, hgb: 12.9 },
];

export const mockDistributions: Record<string, DataDistribution> = {
  age: {
    type: 'continuous',
    values: [45, 58, 62, 67, 71],
    mean: 60.6,
    median: 62,
    min: 45,
    max: 71,
  },
  hemoglobin: {
    type: 'continuous',
    values: [10.5, 11.8, 12.9, 13.2, 14.1],
    mean: 12.5,
    median: 12.9,
    min: 10.5,
    max: 14.1,
  },
};

export const commonUnits = {
  Continuous: ['years', 'months', 'days', 'mg', 'g', 'kg', 'g/dL', 'mg/dL', 'mL/min/1.73m²', 'µmol/L', 'mmHg', 'mm', '%'],
};

export const enumerationTemplates = {
  vascularDevices: ['BEVAR', 'TEVAR', 'EVAR', 'IBD4', 'Open Repair'],
  responseGrades: ['Complete Response', 'Partial Response', 'Stable Disease', 'Progressive Disease'],
  toxicityGrades: ['Grade 0', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
  yesNoUnknown: ['Yes', 'No', 'Unknown'],
  anatomicalZones: ['Zone 0', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4'],
  vessels: ['BCT', 'LCCA', 'LSA', 'RCCA', 'RSCA'],
};

export const analysisMethodsByType: Record<DataType, string[]> = {
  'Continuous': ['Mean Comparison (t-test)', 'ANOVA', 'Linear Regression'],
  'Boolean': ['Frequency Test (Fisher)', 'Odds Ratio', 'Chi-square'],
  'Categorical': ['Chi-square', 'Frequency Distribution'],
  'Date': ['Survival Analysis (Kaplan-Meier)', 'Time-to-Event'],
  'Multi-Select': ['Frequency Distribution', 'Multiple Comparisons'],
  'Ranked-Matrix': ['Non-parametric (Wilcoxon)', 'Mann-Whitney U'],
  'Categorical-Grid': ['Frequency Distribution', 'Chi-square'],
  'Text': [],
  'Conditional': [],
  'Grid': [],
  'Section': [],
};

export const versionColors = {
  blue: 'bg-blue-100 text-blue-700 border-blue-300',
  green: 'bg-green-100 text-green-700 border-green-300',
  purple: 'bg-purple-100 text-purple-700 border-purple-300',
  amber: 'bg-amber-100 text-amber-700 border-amber-300',
};
