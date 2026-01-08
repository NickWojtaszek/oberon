export default {
  // === PROTOCOL WORKBENCH ===
  
  // Main toolbar
  toolbar: {
    protocolLabel: "Protocol",
    versionLabel: "Version",
    exportSchema: "Export Schema",
    backToLibrary: "Back to Library",
    saveDraft: "Save Draft",
    publish: "Publish"
  },
  
  // Tab navigation
  tabs: {
    protocolDocument: "Protocol Document",
    schemaBuilder: "Schema Builder",
    dependencies: "Dependencies",
    audit: "Audit"
  },
  
  // Schema Editor
  schemaEditor: {
    emptyState: {
      title: "No schema blocks yet",
      description: "Click variables from the library on the left to start building your protocol schema."
    }
  },
  
  // Variable Library
  variableLibrary: {
    title: "Variable Library",
    searchPlaceholder: "Search variables...",
    noResults: "No variables found"
  },
  
  // Settings Modal
  settingsModal: {
    title: "Block Settings",
    dataType: "Data Type",
    unit: "Unit",
    unitPlaceholder: "Enter unit",
    quickSelect: "Quick select...",
    minValue: "Minimum Value",
    maxValue: "Maximum Value",
    minPlaceholder: "Min",
    maxPlaceholder: "Max",
    clinicalRange: "Clinical Range",
    normalLow: "Normal Low",
    normalHigh: "Normal High",
    critical: "Critical",
    options: "Options",
    addOption: "Add Option",
    optionPlaceholder: "Option",
    quickTemplates: "Quick templates:",
    matrixRows: "Matrix Rows",
    addRow: "Add Row",
    rowPlaceholder: "Row",
    gridItems: "Grid Items (Rows)",
    gridCategories: "Grid Categories (Columns)",
    addItem: "Add Item",
    addCategory: "Add Category",
    itemPlaceholder: "Item",
    categoryPlaceholder: "Category",
    required: "Required",
    helpText: "Help Text",
    helpPlaceholder: "Enter help text for this field"
  },
  
  // Dependency Modal
  dependencyModal: {
    title: "Dependencies & Logic Links",
    infoTitle: "What are dependencies?",
    infoDescription: "Dependencies define logical relationships between variables. If this variable depends on others, those must be collected first or used in conditional logic.",
    currentDependencies: "Current Dependencies",
    noDependencies: "No dependencies set. This variable is independent.",
    unknownVariable: "Unknown Variable",
    addDependency: "Add Dependency",
    noAvailableVariables: "No other variables available to add as dependencies.",
    circularWarning: "Would create circular dependency",
    saveDependencies: "Save Dependencies",
    // Advanced modal (for future use)
    conditionalRules: "Conditional Rules",
    addRule: "Add Rule",
    condition: "Condition",
    value: "Value",
    then: "Then",
    action: "Action",
    targetVariable: "Target Variable",
    operator: "Operator",
    equals: "Equals",
    notEquals: "Not Equals",
    greaterThan: "Greater Than",
    lessThan: "Less Than",
    contains: "Contains",
    show: "Show",
    hide: "Hide",
    require: "Require",
    setValue: "Set Value",
    saveRules: "Save Rules"
  },
  
  // Version Tag Modal
  versionTagModal: {
    title: "Version Tag",
    versionTag: "Version Tag",
    versionPlaceholder: "e.g., v1.0, v2.1, Amendment 3",
    quickSelect: "Quick Select",
    tagColor: "Tag Color",
    preview: "Preview",
    clearTag: "Clear Tag",
    saveTag: "Save Tag"
  },
  
  // Schema Generator Modal
  schemaGeneratorModal: {
    title: "AI Schema Generator",
    description: "Describe Your Protocol",
    descriptionPlaceholder: "Describe what you want to measure in your study...",
    chooseTemplate: "Choose a Template",
    generating: "Generating...",
    generate: "Generate Schema"
  },
  
  // Pre-Publish Validation Modal
  prePublishModal: {
    cannotPublish: "Cannot Publish Protocol",
    reviewRequired: "Review Required",
    readyToPublish: "Ready to Publish",
    validationComplete: "AI Governance validation complete",
    complianceScore: "Compliance Score",
    validationPassed: "Validation Passed",
    validationFailed: "Validation Failed",
    critical: "Critical",
    mustResolve: "Must resolve",
    warnings: "Warnings",
    reviewNeeded: "Review needed",
    info: "Info",
    suggestions: "Suggestions",
    blockingIssues: "Blocking Issues",
    approvalRequired: "PI Approval Required",
    approvalDescription: "This protocol requires Principal Investigator review and approval before publication.",
    viewAuditReport: "View Full Audit Report",
    acknowledgePublish: "Acknowledge & Publish",
    publishProtocol: "Publish Protocol",
    proceedAnyway: "Proceed Anyway",
    fixIssues: "Fix Issues"
  },
  
  // Block Toolbar
  blockToolbar: {
    duplicate: "Duplicate",
    versionTag: "Version Tag",
    dependencies: "Dependencies",
    settings: "Settings",
    remove: "Remove"
  },
  
  // Configuration HUD
  configHUD: {
    role: "Role",
    endpointTier: "Endpoint Tier",
    analysisMethod: "Analysis Method",
    kaplanMeier: "Kaplan-Meier",
    frequency: "Frequency",
    tTest: "t-test",
    nonParametric: "Non-parametric",
    chiSquare: "Chi-square"
  },
  
  // Schema Block
  schemaBlock: {
    section: "Section",
    items: "items"
  },
  
  // Protocol validation
  validation: {
    protocolTitleRequired: "Please enter Protocol Title and Protocol Number before saving",
    loadFailed: "Failed to load protocol. It may have been deleted."
  }
};
