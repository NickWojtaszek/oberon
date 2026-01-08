export default {
  // === GLOBAL HEADER ===
  "globalHeader": {
    "targetJournal": "Target Journal:",
    "selectJournal": "Select journal...",
    "createCustomJournal": "Create Custom Journal",
    "editGenericJournal": "Edit Generic Journal Defaults",
    "autonomy": {
      "audit": "Audit",
      "coPilot": "Co-Pilot",
      "pilot": "Pilot",
      "notAvailableForRole": "Not available for your role"
    },
    "exportPackage": "Export Package",
    "runLogicCheck": "Run Logic Check",
    "processing": "Processing...",
    "studyTypes": {
      "unblinded": "UNBLINDED",
      "singleBlind": "SINGLE BLIND",
      "doubleBlind": "DOUBLE BLIND",
      "tripleBlind": "TRIPLE BLIND"
    }
  },

  // === NAVIGATION PANEL ===
  "navigation": {
    "researchFactory": "Research Factory",
    "currentProject": "Current Project:",
    "noProject": "No project selected",
    
    // Navigation items
    "dashboard": "Dashboard",
    "projectLibrary": "Project Library",
    "protocolLibrary": "Protocol Library",
    "aiPersonas": "AI Personas",
    "personaEditor": "Persona Editor",
    "protocolWorkbench": "Protocol Workbench",
    "researchWizard": "Research Wizard",
    "projectSetup": "Project Setup",
    "methodologyEngine": "Methodology Engine",
    "database": "Database",
    "analytics": "Analytics",
    "academicWriting": "Academic Writing",
    "dataManagement": "Data Management",
    "governance": "Governance",
    "ethics": "Ethics & IRB",
    
    // Navigation descriptions
    "descriptions": {
      "dashboard": "Progress overview",
      "projectLibrary": "Browse projects",
      "protocolLibrary": "Browse protocols",
      "aiPersonas": "Persona library",
      "personaEditor": "Create & edit personas",
      "protocolWorkbench": "Build schemas",
      "researchWizard": "Guided research setup",
      "projectSetup": "Team & methodology",
      "methodologyEngine": "Automated methodology generation",
      "database": "Schema & records",
      "analytics": "Statistical analysis",
      "academicWriting": "Manuscript editor",
      "dataManagement": "Import/Export",
      "governance": "Access control",
      "ethics": "IRB & Compliance"
    },
    
    // Navigation actions
    "goToField": "Go to field",
    "navigateToIssue": "Navigate to issue",
    "backToList": "Back to list"
  },

  // === LANGUAGE SWITCHER ===
  "language": {
    "title": "Interface Language",
    "changeLanguage": "Change interface language",
    "autoSave": "Language preference is saved automatically",
    "english": "English",
    "polish": "Polski",
    "spanish": "Español",
    "chinese": "中文"
  },

  // === PROTOCOL WORKBENCH ===
  "protocolWorkbench": {
    // Main toolbar
    "toolbar": {
      "protocolLabel": "Protocol",
      "versionLabel": "Version",
      "exportSchema": "Export Schema",
      "backToLibrary": "Back to Library",
      "saveDraft": "Save Draft",
      "publish": "Publish"
    },
    
    // Tab navigation
    "tabs": {
      "protocolDocument": "Protocol Document",
      "schemaBuilder": "Schema Builder",
      "dependencies": "Dependencies",
      "audit": "Audit"
    },
    
    // Schema Editor
    "schemaEditor": {
      "emptyState": {
        "title": "No schema blocks yet",
        "description": "Click variables from the library on the left to start building your protocol schema."
      }
    },
    
    // Variable Library
    "variableLibrary": {
      "title": "Variable Library",
      "searchPlaceholder": "Search variables...",
      "noResults": "No variables found"
    },
    
    // Settings Modal
    "settingsModal": {
      "title": "Block Settings",
      "dataType": "Data Type",
      "unit": "Unit",
      "unitPlaceholder": "Enter unit",
      "quickSelect": "Quick select...",
      "minValue": "Minimum Value",
      "maxValue": "Maximum Value",
      "minPlaceholder": "Min",
      "maxPlaceholder": "Max",
      "clinicalRange": "Clinical Range",
      "normalLow": "Normal Low",
      "normalHigh": "Normal High",
      "critical": "Critical",
      "options": "Options",
      "addOption": "Add Option",
      "optionPlaceholder": "Option",
      "quickTemplates": "Quick templates:",
      "matrixRows": "Matrix Rows",
      "addRow": "Add Row",
      "rowPlaceholder": "Row",
      "gridItems": "Grid Items (Rows)",
      "gridCategories": "Grid Categories (Columns)",
      "addItem": "Add Item",
      "addCategory": "Add Category",
      "itemPlaceholder": "Item",
      "categoryPlaceholder": "Category",
      "required": "Required",
      "helpText": "Help Text",
      "helpPlaceholder": "Enter help text for this field",
      "saveChanges": "Save Changes",
      "cancel": "Cancel"
    },
    
    // Dependency Modal
    "dependencyModal": {
      "title": "Dependencies & Logic Links",
      "infoTitle": "What are dependencies?",
      "infoDescription": "Dependencies define logical relationships between variables. If this variable depends on others, those must be collected first or used in conditional logic.",
      "currentDependencies": "Current Dependencies",
      "noDependencies": "No dependencies set. This variable is independent.",
      "unknownVariable": "Unknown Variable",
      "addDependency": "Add Dependency",
      "noAvailableVariables": "No other variables available to add as dependencies.",
      "circularWarning": "Would create circular dependency",
      "saveDependencies": "Save Dependencies",
      // Advanced modal (for future use)
      "conditionalRules": "Conditional Rules",
      "addRule": "Add Rule",
      "condition": "Condition",
      "value": "Value",
      "then": "Then",
      "action": "Action",
      "targetVariable": "Target Variable",
      "operator": "Operator",
      "equals": "Equals",
      "notEquals": "Not Equals",
      "greaterThan": "Greater Than",
      "lessThan": "Less Than",
      "contains": "Contains",
      "show": "Show",
      "hide": "Hide",
      "require": "Require",
      "setValue": "Set Value",
      "saveRules": "Save Rules"
    },
    
    // Version Tag Modal
    "versionTagModal": {
      "title": "Version Tag",
      "versionTag": "Version Tag",
      "versionPlaceholder": "e.g., v1.0, v2.1, Amendment 3",
      "quickSelect": "Quick Select",
      "tagColor": "Tag Color",
      "preview": "Preview",
      "clearTag": "Clear Tag",
      "saveTag": "Save Tag"
    },
    
    // Schema Generator Modal
    "schemaGeneratorModal": {
      "title": "AI Schema Generator",
      "description": "Describe Your Protocol",
      "descriptionPlaceholder": "Describe what you want to measure in your study...",
      "chooseTemplate": "Choose a Template",
      "generating": "Generating...",
      "generate": "Generate Schema",
      "cancel": "Cancel"
    },
    
    // Pre-Publish Validation Modal
    "prePublishModal": {
      "cannotPublish": "Cannot Publish Protocol",
      "reviewRequired": "Review Required",
      "readyToPublish": "Ready to Publish",
      "validationComplete": "AI Governance validation complete",
      "complianceScore": "Compliance Score",
      "validationPassed": "Validation Passed",
      "validationFailed": "Validation Failed",
      "critical": "Critical",
      "mustResolve": "Must resolve",
      "warnings": "Warnings",
      "reviewNeeded": "Review needed",
      "info": "Info",
      "suggestions": "Suggestions",
      "blockingIssues": "Blocking Issues",
      "approvalRequired": "PI Approval Required",
      "approvalDescription": "This protocol requires Principal Investigator review and approval before publication.",
      "viewAuditReport": "View Full Audit Report",
      "acknowledgePublish": "Acknowledge & Publish",
      "publishProtocol": "Publish Protocol",
      "proceedAnyway": "Proceed Anyway",
      "fixIssues": "Fix Issues"
    },
    
    // Block Toolbar
    "blockToolbar": {
      "duplicate": "Duplicate",
      "versionTag": "Version Tag",
      "dependencies": "Dependencies",
      "settings": "Settings",
      "remove": "Remove"
    },
    
    // Configuration HUD
    "configHUD": {
      "role": "Role",
      "endpointTier": "Endpoint Tier",
      "analysisMethod": "Analysis Method",
      "none": "None",
      "primary": "Primary",
      "secondary": "Secondary",
      "exploratory": "Exploratory",
      "kaplanMeier": "Kaplan-Meier",
      "frequency": "Frequency",
      "tTest": "t-test",
      "nonParametric": "Non-parametric",
      "chiSquare": "Chi-square"
    },
    
    // Schema Block
    "schemaBlock": {
      "section": "Section",
      "items": "items"
    },
    
    // Protocol validation
    "validation": {
      "protocolTitleRequired": "Please enter Protocol Title and Protocol Number before saving",
      "loadFailed": "Failed to load protocol. It may have been deleted."
    },
    
    // Status badges
    "status": {
      "draft": "Draft",
      "published": "Published",
      "archived": "Archived"
    }
  },

  // === ACADEMIC WRITING ===
  "academic": {
    "manuscript": {
      "title": "Manuscript Title",
      "abstract": "Abstract",
      "introduction": "Introduction",
      "methods": "Methods",
      "results": "Results",
      "discussion": "Discussion",
      "conclusions": "Conclusions",
      "references": "References",
      "acknowledgments": "Acknowledgments",
      "appendices": "Appendices"
    },
    "sections": {
      "addSection": "Add Section",
      "deleteSection": "Delete Section",
      "moveUp": "Move Up",
      "moveDown": "Move Down",
      "sectionTitle": "Section Title",
      "sectionContent": "Section Content"
    },
    "citations": {
      "addCitation": "Add Citation",
      "editCitation": "Edit Citation",
      "deleteCitation": "Delete Citation",
      "citationStyle": "Citation Style",
      "insertCitation": "Insert Citation",
      "manageCitations": "Manage Citations",
      "noCitations": "No citations yet"
    },
    "export": {
      "title": "Export Manuscript",
      "exportPDF": "Export PDF",
      "exportWord": "Export Word",
      "exportLaTeX": "Export LaTeX",
      "includeReferences": "Include References",
      "includeAppendices": "Include Appendices"
    },
    "wordCount": {
      "total": "Total Words",
      "abstract": "Abstract Words",
      "body": "Body Words",
      "target": "Target"
    }
  },

  // === DATABASE MODULE ===
  "database": {
    "tabs": {
      "schema": "Schema",
      "dataEntry": "Data Entry",
      "browser": "Data Browser",
      "query": "Query Builder",
      "import": "Import"
    },
    "schema": {
      "tables": "Tables",
      "addTable": "Add Table",
      "editTable": "Edit Table",
      "deleteTable": "Delete Table",
      "columns": "Columns",
      "addColumn": "Add Column",
      "columnName": "Column Name",
      "columnType": "Column Type",
      "primaryKey": "Primary Key",
      "foreignKey": "Foreign Key"
    },
    "dataEntry": {
      "newRecord": "New Record",
      "editRecord": "Edit Record",
      "deleteRecord": "Delete Record",
      "saveRecord": "Save Record",
      "recordSaved": "Record saved successfully",
      "recordDeleted": "Record deleted successfully"
    },
    "browser": {
      "filterRecords": "Filter Records",
      "sortBy": "Sort By",
      "recordsPerPage": "Records per page",
      "totalRecords": "Total Records",
      "noRecords": "No records found"
    },
    "query": {
      "newQuery": "New Query",
      "runQuery": "Run Query",
      "saveQuery": "Save Query",
      "queryResults": "Query Results",
      "noResults": "No results"
    }
  },

  // === ANALYTICS MODULE ===
  "analytics": {
    "dashboard": {
      "title": "Analytics Dashboard",
      "overview": "Overview",
      "reports": "Reports",
      "visualizations": "Visualizations"
    },
    "statistics": {
      "descriptive": "Descriptive Statistics",
      "inferential": "Inferential Statistics",
      "mean": "Mean",
      "median": "Median",
      "mode": "Mode",
      "standardDeviation": "Standard Deviation",
      "variance": "Variance",
      "range": "Range",
      "confidence": "Confidence Interval",
      "pValue": "P-Value",
      "significance": "Significance Level"
    },
    "charts": {
      "barChart": "Bar Chart",
      "lineChart": "Line Chart",
      "pieChart": "Pie Chart",
      "scatterPlot": "Scatter Plot",
      "histogram": "Histogram",
      "boxPlot": "Box Plot"
    },
    "export": {
      "exportResults": "Export Results",
      "exportChart": "Export Chart",
      "exportTable": "Export Table"
    }
  },

  // === GOVERNANCE MODULE ===
  "governance": {
    "roles": {
      "title": "Roles & Permissions",
      "addRole": "Add Role",
      "editRole": "Edit Role",
      "deleteRole": "Delete Role",
      "roleName": "Role Name",
      "permissions": "Permissions"
    },
    "users": {
      "title": "User Management",
      "addUser": "Add User",
      "editUser": "Edit User",
      "deleteUser": "Delete User",
      "userName": "User Name",
      "userEmail": "Email",
      "userRole": "Role",
      "active": "Active",
      "inactive": "Inactive"
    },
    "audit": {
      "title": "Audit Trail",
      "action": "Action",
      "user": "User",
      "timestamp": "Timestamp",
      "details": "Details",
      "export": "Export Audit Log"
    },
    "accessLevels": {
      "readOnly": "Read-only",
      "commentOnly": "Comment-only"
    }
  },

  // === ETHICS & IRB ===
  "ethics": {
    "submissions": {
      "title": "IRB Submissions",
      "newSubmission": "New Submission",
      "editSubmission": "Edit Submission",
      "submissionStatus": "Status",
      "submittedDate": "Submitted",
      "approvalDate": "Approval Date",
      "statusPending": "Pending",
      "statusApproved": "Approved",
      "statusRejected": "Rejected",
      "statusRevisions": "Revisions Requested"
    },
    "documents": {
      "consentForm": "Consent Form",
      "protocol": "Protocol",
      "investigatorBrochure": "Investigator Brochure",
      "amendments": "Amendments",
      "safetyReports": "Safety Reports"
    },
    "compliance": {
      "title": "Compliance Tracker",
      "ichGCP": "ICH-GCP",
      "gdpr": "GDPR",
      "hipaa": "HIPAA",
      "compliant": "Compliant",
      "nonCompliant": "Non-Compliant",
      "underReview": "Under Review"
    }
  },

  // === EXISTING SECTIONS (preserved) ===
  "sidebar": {
    "noIssues": "No issues found",
    "issueCount": "{{count}} issue",
    "issueCount_plural": "{{count}} issues",
    "criticalIssues": "Critical Issues",
    "warnings": "Warnings",
    "informational": "Informational",
    "recommendations": "Recommendations",
    "citation": "Regulatory Citation",
    "autoFixAvailable": "Auto-Fix Available",
    "applyFix": "Apply Fix",
    "location": "Location",
    "module": "Module",
    "tab": "Tab",
    "field": "Field",
    "viewDetails": "View Details",
    "collapse": "Collapse",
    "expand": "Expand"
  },
  
  "validation": {
    "validating": "Validating...",
    "validated": "Validated",
    "noValidation": "No validation performed",
    "lastValidated": "Last validated",
    "runValidation": "Run Validation",
    "validationComplete": "Validation complete",
    "validationFailed": "Validation failed"
  },
  
  "export": {
    "title": "Export Validation Report",
    "format": "Export Format",
    "formatPDF": "PDF (HTML)",
    "formatJSON": "JSON",
    "formatCSV": "CSV",
    "options": "Export Options",
    "includeRecommendations": "Include Recommendations",
    "includeCitations": "Include Regulatory Citations",
    "filterBySeverity": "Filter by Severity",
    "filterAll": "All Issues",
    "filterCriticalWarning": "Critical & Warnings Only",
    "filterCriticalOnly": "Critical Only",
    "groupBy": "Group By",
    "groupBySeverity": "Severity",
    "groupByPersona": "Persona",
    "groupByCategory": "Category",
    "exportButton": "Export Report",
    "exporting": "Exporting...",
    "exportSuccess": "Report exported successfully",
    "exportError": "Failed to export report"
  },
  
  "trends": {
    "title": "Validation Trends",
    "overallTrend": "Overall Trend",
    "personaTrends": "Persona Trends",
    "scoreImprovement": "Score Improvement",
    "issueReduction": "Issue Reduction",
    "currentScore": "Current Score",
    "previousScore": "Previous Score",
    "scoreChange": "Score Change",
    "improving": "Improving",
    "declining": "Declining",
    "stable": "Stable",
    "noData": "No trend data available",
    "snapshotCount": "{{count}} snapshot",
    "snapshotCount_plural": "{{count}} snapshots",
    "dateRange": "Date Range",
    "compareVersions": "Compare Versions",
    "version": "Version",
    "selectVersion": "Select version..."
  },
  
  "autoFix": {
    "title": "Auto-Fix Available",
    "description": "This issue can be automatically fixed",
    "applyFix": "Apply Auto-Fix",
    "applying": "Applying fix...",
    "success": "Fix applied successfully",
    "error": "Failed to apply fix",
    "fixesApplied": "{{count}} fix applied",
    "fixesApplied_plural": "{{count}} fixes applied",
    "confirmTitle": "Confirm Auto-Fix",
    "confirmMessage": "Are you sure you want to apply this fix?",
    "confirmMultiple": "Apply {{count}} auto-fixes?",
    "reviewChanges": "Review changes before applying"
  },
  
  "messages": {
    "required": "This field is required",
    "invalid": "Invalid value",
    "missing": "Missing information",
    "incomplete": "Incomplete",
    "notApplicable": "Not applicable for this study type",
    "checklistComplete": "All checklist items complete",
    "checklistIncomplete": "{{completed}} of {{total}} complete"
  }
};