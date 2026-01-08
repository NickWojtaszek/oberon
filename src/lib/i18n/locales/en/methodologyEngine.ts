export default {
  // === METHODOLOGY ENGINE MODULE ===
  
  // Main Header
  header: {
    title: "Methodology Engine",
    subtitle: "AI-Powered Study Design & Methodology Generation",
    description: "Automate your research methodology with intelligent recommendations"
  },
  
  // Tab Navigation
  tabs: {
    generator: "Methodology Generator",
    studyDesign: "Study Design",
    statistical: "Statistical Plan",
    randomization: "Randomization",
    sampleSize: "Sample Size",
    timeline: "Study Timeline"
  },
  
  // === METHODOLOGY GENERATOR ===
  generator: {
    title: "AI Methodology Generator",
    subtitle: "Generate comprehensive methodology based on your research question",
    
    // Input Section
    input: {
      title: "Research Question & Objectives",
      researchQuestion: "Primary Research Question",
      researchQuestionPlaceholder: "What is your main research question?",
      researchQuestionHint: "Be specific about what you want to investigate",
      primaryObjective: "Primary Objective",
      primaryObjectivePlaceholder: "What is the primary objective of your study?",
      secondaryObjectives: "Secondary Objectives",
      secondaryObjectivePlaceholder: "List any secondary objectives (optional)",
      addSecondaryObjective: "Add Secondary Objective",
      studyContext: "Study Context",
      studyContextPlaceholder: "Provide background and rationale for the study",
      targetPopulation: "Target Population",
      targetPopulationPlaceholder: "Describe the population you want to study",
      intervention: "Intervention/Exposure",
      interventionPlaceholder: "Describe the intervention or exposure being studied",
      comparator: "Comparator/Control",
      comparatorPlaceholder: "What are participants being compared against?",
      primaryOutcome: "Primary Outcome",
      primaryOutcomePlaceholder: "What is the main outcome you will measure?",
      secondaryOutcomes: "Secondary Outcomes",
      secondaryOutcomesPlaceholder: "List any secondary outcomes",
      addSecondaryOutcome: "Add Secondary Outcome"
    },
    
    // Configuration
    config: {
      title: "Methodology Configuration",
      studyType: "Study Type",
      selectStudyType: "Select study type...",
      interventional: "Interventional",
      observational: "Observational",
      diagnostic: "Diagnostic",
      prognostic: "Prognostic",
      metaAnalysis: "Meta-Analysis",
      studyDesign: "Study Design",
      selectDesign: "Select design...",
      rct: "Randomized Controlled Trial",
      crossover: "Crossover Trial",
      cohort: "Cohort Study",
      caseControl: "Case-Control Study",
      crossSectional: "Cross-Sectional Study",
      beforeAfter: "Before-After Study",
      phase: "Study Phase",
      selectPhase: "Select phase...",
      phaseI: "Phase I (Safety)",
      phaseII: "Phase II (Efficacy)",
      phaseIII: "Phase III (Confirmatory)",
      phaseIV: "Phase IV (Post-Market)",
      blindingLevel: "Blinding Level",
      selectBlinding: "Select blinding...",
      unblinded: "Unblinded/Open-Label",
      singleBlind: "Single-Blind",
      doubleBlind: "Double-Blind",
      tripleBlind: "Triple-Blind",
      duration: "Study Duration",
      durationPlaceholder: "e.g., 12 months, 52 weeks",
      followUp: "Follow-up Period",
      followUpPlaceholder: "e.g., 6 months post-treatment"
    },
    
    // Generation
    generation: {
      generate: "Generate Methodology",
      regenerate: "Regenerate",
      generating: "Generating methodology...",
      analyzing: "Analyzing research question...",
      designing: "Designing study structure...",
      planning: "Planning statistical approach...",
      optimizing: "Optimizing methodology...",
      complete: "Methodology generation complete",
      failed: "Methodology generation failed",
      tryAgain: "Try Again"
    },
    
    // Results
    results: {
      title: "Generated Methodology",
      overview: "Overview",
      fullMethodology: "Full Methodology",
      studyDesign: "Study Design",
      population: "Population & Sampling",
      interventions: "Interventions & Procedures",
      outcomes: "Outcome Measures",
      statistical: "Statistical Analysis",
      ethical: "Ethical Considerations",
      timeline: "Study Timeline",
      limitations: "Potential Limitations",
      export: "Export Methodology",
      copyToProtocol: "Copy to Protocol",
      copyToDocument: "Copy to Academic Writing",
      saveTemplate: "Save as Template"
    },
    
    // Recommendations
    recommendations: {
      title: "AI Recommendations",
      studyDesignRec: "Study Design Recommendations",
      sampleSizeRec: "Sample Size Recommendations",
      statisticalRec: "Statistical Analysis Recommendations",
      improvementSuggestions: "Methodology Improvements",
      qualityScore: "Methodology Quality Score",
      strengthScore: "Study Design Strength",
      acceptRecommendation: "Accept Recommendation",
      viewDetails: "View Details",
      applyAll: "Apply All Recommendations"
    }
  },
  
  // === STUDY DESIGN ===
  studyDesign: {
    title: "Study Design Wizard",
    subtitle: "Configure your study design step-by-step",
    
    // Design Selection
    selection: {
      title: "Select Study Design",
      subtitle: "Choose the most appropriate design for your research question",
      interventional: "Interventional Studies",
      interventionalDesc: "Test effects of interventions on outcomes",
      observational: "Observational Studies",
      observationalDesc: "Observe outcomes without intervention",
      diagnostic: "Diagnostic Studies",
      diagnosticDesc: "Evaluate diagnostic test accuracy",
      recommended: "Recommended for your objectives",
      confidence: "Confidence: {{percent}}%",
      whyRecommended: "Why is this recommended?",
      selectDesign: "Select This Design"
    },
    
    // Design Configuration
    configuration: {
      title: "Design Configuration",
      arms: "Study Arms",
      addArm: "Add Study Arm",
      armName: "Arm Name",
      armType: "Arm Type",
      experimental: "Experimental",
      control: "Control",
      activeComparator: "Active Comparator",
      placebo: "Placebo",
      sham: "Sham",
      noIntervention: "No Intervention",
      armDescription: "Arm Description",
      armSize: "Target Enrollment",
      allocation: "Allocation",
      randomized: "Randomized",
      nonRandomized: "Non-Randomized",
      allocationRatio: "Allocation Ratio",
      stratification: "Stratification",
      addStratificationFactor: "Add Stratification Factor",
      stratificationFactor: "Stratification Factor",
      levels: "Levels"
    },
    
    // Eligibility Criteria
    eligibility: {
      title: "Eligibility Criteria",
      inclusionCriteria: "Inclusion Criteria",
      addInclusion: "Add Inclusion Criterion",
      exclusionCriteria: "Exclusion Criteria",
      addExclusion: "Add Exclusion Criterion",
      criterionPlaceholder: "Enter criterion...",
      ageRange: "Age Range",
      minAge: "Minimum Age",
      maxAge: "Maximum Age",
      years: "years",
      sex: "Sex",
      all: "All",
      male: "Male",
      female: "Female",
      healthyVolunteers: "Healthy Volunteers",
      accepted: "Accepted",
      notAccepted: "Not Accepted"
    },
    
    // Endpoints
    endpoints: {
      title: "Study Endpoints",
      primaryEndpoint: "Primary Endpoint",
      addPrimaryEndpoint: "Add Primary Endpoint",
      secondaryEndpoints: "Secondary Endpoints",
      addSecondaryEndpoint: "Add Secondary Endpoint",
      exploratoryEndpoints: "Exploratory Endpoints",
      addExploratoryEndpoint: "Add Exploratory Endpoint",
      endpointName: "Endpoint Name",
      endpointType: "Endpoint Type",
      timepoint: "Assessment Timepoint",
      analysisMethod: "Analysis Method",
      efficacy: "Efficacy",
      safety: "Safety",
      pharmacokinetic: "Pharmacokinetic",
      pharmacodynamic: "Pharmacodynamic",
      qualityOfLife: "Quality of Life",
      biomarker: "Biomarker"
    },
    
    // Preview
    preview: {
      title: "Design Preview",
      summary: "Design Summary",
      flowDiagram: "Study Flow Diagram",
      armsSummary: "Study Arms Summary",
      eligibilitySummary: "Eligibility Summary",
      endpointsSummary: "Endpoints Summary",
      saveDesign: "Save Study Design",
      exportDesign: "Export Design"
    }
  },
  
  // === STATISTICAL PLAN ===
  statistical: {
    title: "Statistical Analysis Plan",
    subtitle: "Define your statistical approach",
    
    // Analysis Strategy
    strategy: {
      title: "Analysis Strategy",
      analysisPlan: "Statistical Analysis Plan",
      primaryAnalysis: "Primary Analysis",
      secondaryAnalysis: "Secondary Analysis",
      subgroupAnalysis: "Subgroup Analysis",
      sensitivityAnalysis: "Sensitivity Analysis",
      interimAnalysis: "Interim Analysis",
      addAnalysis: "Add Analysis"
    },
    
    // Analysis Methods
    methods: {
      title: "Analysis Methods",
      selectMethod: "Select statistical method...",
      descriptive: "Descriptive Statistics",
      tTest: "T-Test",
      anova: "ANOVA",
      regression: "Regression Analysis",
      logistic: "Logistic Regression",
      cox: "Cox Proportional Hazards",
      kaplanMeier: "Kaplan-Meier Analysis",
      chiSquare: "Chi-Square Test",
      fisher: "Fisher's Exact Test",
      mannWhitney: "Mann-Whitney U Test",
      wilcoxon: "Wilcoxon Signed-Rank Test",
      mcnemar: "McNemar's Test",
      friedman: "Friedman Test",
      mixedModel: "Mixed Effects Model"
    },
    
    // Hypothesis Testing
    hypothesis: {
      title: "Hypothesis Testing",
      nullHypothesis: "Null Hypothesis (H₀)",
      alternativeHypothesis: "Alternative Hypothesis (H₁)",
      hypothesisPlaceholder: "State your hypothesis...",
      testType: "Test Type",
      superiority: "Superiority",
      nonInferiority: "Non-Inferiority",
      equivalence: "Equivalence",
      significanceLevel: "Significance Level (α)",
      power: "Statistical Power (1-β)",
      effectSize: "Expected Effect Size",
      tails: "Tails",
      oneTailed: "One-Tailed",
      twoTailed: "Two-Tailed"
    },
    
    // Analysis Populations
    populations: {
      title: "Analysis Populations",
      itt: "Intention-to-Treat (ITT)",
      ittDesc: "All randomized participants",
      pp: "Per-Protocol (PP)",
      ppDesc: "Participants who completed per protocol",
      safety: "Safety Population",
      safetyDesc: "All participants who received at least one dose",
      modifiedItt: "Modified ITT",
      modifiedIttDesc: "ITT with specific exclusions",
      selectPopulation: "Select analysis population for each endpoint"
    },
    
    // Missing Data
    missingData: {
      title: "Missing Data Handling",
      strategy: "Missing Data Strategy",
      completeCase: "Complete Case Analysis",
      completeCaseDesc: "Exclude participants with missing data",
      lastObservation: "Last Observation Carried Forward (LOCF)",
      lastObservationDesc: "Use last available value",
      multipleImputation: "Multiple Imputation",
      multipleImputationDesc: "Impute missing values statistically",
      mixedModel: "Mixed Model",
      mixedModelDesc: "Handle missing data within model",
      worstCase: "Worst Case Imputation",
      worstCaseDesc: "Assign worst outcome to missing"
    },
    
    // Adjustments
    adjustments: {
      title: "Statistical Adjustments",
      multipleComparisons: "Multiple Comparisons Adjustment",
      bonferroni: "Bonferroni Correction",
      holm: "Holm-Bonferroni",
      benjaminiHochberg: "Benjamini-Hochberg (FDR)",
      none: "No Adjustment",
      covariates: "Covariates",
      addCovariate: "Add Covariate",
      covariateName: "Covariate Name",
      adjustmentMethod: "Adjustment Method"
    }
  },
  
  // === RANDOMIZATION ===
  randomization: {
    title: "Randomization Scheme",
    subtitle: "Configure randomization and blinding procedures",
    
    // Randomization Type
    type: {
      title: "Randomization Type",
      simple: "Simple Randomization",
      simpleDesc: "Pure random allocation (e.g., coin flip)",
      block: "Block Randomization",
      blockDesc: "Randomize within blocks to maintain balance",
      stratified: "Stratified Randomization",
      stratifiedDesc: "Balance across prognostic factors",
      adaptive: "Adaptive Randomization",
      adaptiveDesc: "Adjust allocation based on responses",
      minimization: "Minimization",
      minimizationDesc: "Minimize imbalance across factors"
    },
    
    // Block Randomization
    block: {
      title: "Block Randomization",
      blockSize: "Block Size",
      fixedBlock: "Fixed Block Size",
      variableBlock: "Variable Block Sizes",
      blockSizes: "Block Sizes",
      blockSizesPlaceholder: "e.g., 4, 6, 8",
      allocationRatio: "Allocation Ratio",
      ratioPlaceholder: "e.g., 1:1, 2:1"
    },
    
    // Stratification
    stratification: {
      title: "Stratification",
      factors: "Stratification Factors",
      addFactor: "Add Stratification Factor",
      factorName: "Factor Name",
      factorLevels: "Factor Levels",
      addLevel: "Add Level",
      balancing: "Balancing Algorithm",
      permutedBlock: "Permuted Block",
      dynamicAllocation: "Dynamic Allocation"
    },
    
    // Blinding
    blinding: {
      title: "Blinding Procedures",
      blindingLevel: "Blinding Level",
      open: "Open-Label (Unblinded)",
      openDesc: "All parties aware of treatment",
      single: "Single-Blind",
      singleDesc: "Participants blinded",
      double: "Double-Blind",
      doubleDesc: "Participants and investigators blinded",
      triple: "Triple-Blind",
      tripleDesc: "Participants, investigators, and assessors blinded",
      blindedParties: "Blinded Parties",
      participants: "Participants",
      investigators: "Investigators",
      outcomeAssessors: "Outcome Assessors",
      dataAnalysts: "Data Analysts",
      unblindingProcedure: "Unblinding Procedure",
      unblindingPlaceholder: "Describe emergency unblinding procedures..."
    },
    
    // Implementation
    implementation: {
      title: "Implementation",
      randomizationSystem: "Randomization System",
      centralSystem: "Central Randomization System",
      siteSpecific: "Site-Specific Randomization",
      ivrs: "Interactive Voice Response System (IVRS)",
      iwrs: "Interactive Web Response System (IWRS)",
      envelopeMethod: "Sealed Envelope Method",
      allocationConcealment: "Allocation Concealment",
      concealmentMethod: "Concealment Method",
      concealmentPlaceholder: "Describe allocation concealment procedures...",
      generateScheme: "Generate Randomization Scheme",
      downloadScheme: "Download Randomization List"
    }
  },
  
  // === SAMPLE SIZE ===
  sampleSize: {
    title: "Sample Size Calculation",
    subtitle: "Determine required sample size for your study",
    
    // Calculator
    calculator: {
      title: "Sample Size Calculator",
      methodology: "Statistical Methodology",
      selectMethodology: "Select methodology...",
      effectSize: "Effect Size",
      effectSizeHint: "Expected difference between groups",
      standardDeviation: "Standard Deviation",
      alpha: "Alpha (Significance Level)",
      alphaHint: "Probability of Type I error (typically 0.05)",
      power: "Power (1-Beta)",
      powerHint: "Probability of detecting true effect (typically 0.80 or 0.90)",
      allocationRatio: "Allocation Ratio",
      tails: "Tails",
      oneTailed: "One-Tailed",
      twoTailed: "Two-Tailed",
      attritionRate: "Expected Attrition Rate",
      attritionRateHint: "Expected dropout rate (%)",
      calculate: "Calculate Sample Size",
      recalculate: "Recalculate"
    },
    
    // Results
    results: {
      title: "Sample Size Results",
      requiredPerGroup: "Required Sample Size (per group)",
      totalRequired: "Total Sample Size Required",
      withAttrition: "Adjusted for Attrition",
      totalWithAttrition: "Total with Attrition",
      assumptions: "Assumptions",
      effectSize: "Effect Size",
      power: "Power",
      alpha: "Alpha",
      allocationRatio: "Allocation Ratio",
      detailsReport: "Detailed Sample Size Report",
      saveCalculation: "Save Calculation",
      exportReport: "Export Report"
    },
    
    // Power Analysis
    powerAnalysis: {
      title: "Power Analysis",
      powerCurve: "Power Curve",
      sensitivityAnalysis: "Sensitivity Analysis",
      varyEffectSize: "Vary Effect Size",
      varySampleSize: "Vary Sample Size",
      varyAlpha: "Vary Alpha",
      generateCurve: "Generate Power Curve"
    }
  },
  
  // === STUDY TIMELINE ===
  timeline: {
    title: "Study Timeline",
    subtitle: "Plan your study schedule and milestones",
    
    // Timeline Builder
    builder: {
      title: "Timeline Builder",
      addPhase: "Add Study Phase",
      addMilestone: "Add Milestone",
      phaseName: "Phase Name",
      startDate: "Start Date",
      endDate: "End Date",
      duration: "Duration",
      description: "Description",
      screening: "Screening",
      enrollment: "Enrollment",
      treatment: "Treatment",
      followUp: "Follow-Up",
      dataAnalysis: "Data Analysis",
      reporting: "Reporting"
    },
    
    // Visit Schedule
    visitSchedule: {
      title: "Visit Schedule",
      addVisit: "Add Study Visit",
      visitNumber: "Visit Number",
      visitName: "Visit Name",
      timepoint: "Timepoint",
      visitWindow: "Visit Window",
      procedures: "Procedures/Assessments",
      baseline: "Baseline",
      week: "Week",
      month: "Month",
      day: "Day",
      endOfStudy: "End of Study",
      unscheduled: "Unscheduled"
    },
    
    // Gantt Chart
    gantt: {
      title: "Gantt Chart",
      viewGantt: "View Gantt Chart",
      exportGantt: "Export Gantt Chart",
      phases: "Phases",
      milestones: "Milestones",
      today: "Today"
    }
  },
  
  // === COMMON ACTIONS ===
  actions: {
    generate: "Generate",
    regenerate: "Regenerate",
    save: "Save",
    export: "Export",
    cancel: "Cancel",
    back: "Back",
    next: "Next",
    finish: "Finish",
    calculate: "Calculate",
    recalculate: "Recalculate",
    apply: "Apply",
    preview: "Preview",
    download: "Download"
  },
  
  // === COMMON MESSAGES ===
  messages: {
    generationSuccess: "Methodology generated successfully",
    generationError: "Failed to generate methodology",
    saveSuccess: "Saved successfully",
    saveError: "Failed to save",
    calculationComplete: "Calculation complete",
    calculationError: "Calculation failed",
    invalidInput: "Please check your inputs",
    missingRequired: "Please fill in all required fields"
  }
};
