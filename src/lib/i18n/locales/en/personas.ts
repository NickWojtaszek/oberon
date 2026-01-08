export default {
  "title": "AI Personas",
  "subtitle": "Intelligent Validation Assistants",
  "managerTitle": "AI Persona Manager",
  "managerSubtitle": "{{active}} of {{total}} personas active",
  
  "protocolAuditor": {
    "name": "Protocol Auditor",
    "description": "AI-powered validation of protocol documents, schema structure, and cross-validation for regulatory compliance",
    "scoreLabel": "Compliance Score"
  },
  
  "schemaArchitect": {
    "name": "Schema Architect",
    "description": "Study-type-specific variable recommendations and schema structure validation",
    "scoreLabel": "Variable Coverage"
  },
  
  "statisticalAdvisor": {
    "name": "Statistical Methods Advisor",
    "description": "Study-type-appropriate statistical methods and analysis plan validation",
    "scoreLabel": "Statistical Rigor Score"
  },
  
  "dataQualitySentinel": {
    "name": "Data Quality Sentinel",
    "description": "Real-time data validation, range checks, and logical consistency enforcement",
    "scoreLabel": "Data Quality Score"
  },
  
  "ethicsCompliance": {
    "name": "Ethics & IRB Compliance AI",
    "description": "IRB submission readiness, informed consent validation, and regulatory compliance checking",
    "scoreLabel": "Ethics Compliance Score"
  },
  
  "safetyVigilance": {
    "name": "Safety Vigilance AI",
    "description": "Adverse event monitoring, SAE reporting compliance, and safety signal detection",
    "scoreLabel": "Safety Monitoring Score"
  },
  
  "endpointValidator": {
    "name": "Clinical Endpoint Validator",
    "description": "Endpoint adjudication support and clinical event validation",
    "scoreLabel": "Endpoint Quality Score"
  },
  
  "amendmentAdvisor": {
    "name": "Protocol Amendment Advisor",
    "description": "Amendment impact analysis and regulatory classification guidance",
    "scoreLabel": "Amendment Risk Assessment"
  },
  
  "irbCompliance": {
    "name": "IRB Compliance Tracker",
    "description": "Validates IRB submission readiness and ensures all required protocol elements are documented",
    "scoreLabel": "IRB Compliance Score"
  },
  
  "status": {
    "active": "Active",
    "inactive": "Inactive",
    "validating": "Validating...",
    "ready": "Ready",
    "required": "Required",
    "optional": "Optional"
  },
  
  "actions": {
    "enableAll": "Enable All",
    "disableAll": "Disable Non-Required",
    "viewReport": "View Full Report",
    "exportReport": "Export Report",
    "viewTrends": "View Trends",
    "configure": "Configure"
  },
  
  "configuration": {
    "studyConfig": "Study Configuration",
    "studyType": "Study Type",
    "selectStudyType": "Select study type...",
    "regulatoryFrameworks": "Regulatory Frameworks",
    "language": "Language",
    "selectLanguage": "Select language..."
  },
  
  "studyTypes": {
    "rct": "Randomized Controlled Trial (RCT)",
    "observational": "Observational Study",
    "singleArm": "Single-Arm Study",
    "diagnostic": "Diagnostic Study",
    "registry": "Registry / Real-World Data",
    "phase1": "Phase I Dose-Finding",
    "phase2": "Phase II Efficacy",
    "phase3": "Phase III Confirmatory",
    "phase4": "Phase IV Post-Marketing",
    "medicalDevice": "Medical Device Study"
  },
  
  "regulatoryFrameworks": {
    "FDA": "FDA (United States)",
    "EMA": "EMA (European Union)",
    "PMDA": "PMDA (Japan)",
    "ICH-GCP": "ICH-GCP (International)",
    "HIPAA": "HIPAA (Data Privacy)"
  },
  
  "scores": {
    "excellent": "Excellent",
    "good": "Good",
    "fair": "Fair",
    "needsWork": "Needs Work",
    "critical": "Critical Issues",
    "notScored": "Not Scored"
  },
  
  "library": {
    "title": "Validated AI Personas Library",
    "subtitle": "{{count}} certified personas ready for production use • All configurations are immutable and audit-trailed",
    "filterByType": "Filter by Type",
    "sortBy": "Sort by:",
    "createPersona": "Create Persona",
    "allPersonas": "All Personas",
    "systemBuilt": "SYSTEM-BUILT",
    "nonEditable": "NON-EDITABLE",
    "locked": "LOCKED",
    "validated": "Validated",
    "platformCore": "Platform Core",
    "cloneToDraft": "Clone to Draft",
    "cloning": "Cloning...",
    "hideDetails": "Hide Details",
    "viewDetails": "View Details",
    "auditLog": "Audit Log",
    "exportPdf": "Export PDF",
    "systemPersonasCannotBeCloned": "System personas cannot be cloned",
    "configurationSnapshot": "Configuration Snapshot",
    "immutableRecord": "Immutable record of all governance rules and policies",
    "systemLevelGuardrail": "SYSTEM-LEVEL GUARDRAIL",
    "systemBuiltDescription": "This persona is built into the platform and powers the Statistical Logic Layer in the Protocol Workbench. It automatically validates schema designs, enforces clinical standards (NIHSS, mRS, mortality endpoints), blocks invalid statistical tests, and generates an immutable audit trail for regulatory compliance.",
    "autoDetection": "Auto-Detection",
    "autoDetectionDescription": "NIHSS, mRS, mortality endpoints, binary outcomes",
    "validation": "Validation",
    "validationDescription": "Statistical test compatibility, data type enforcement",
    "interpretationRules": "Interpretation Rules",
    "disallowedInferences": "Disallowed Inferences",
    "languageControls": "Language Controls",
    "tone": "Tone",
    "confidence": "Confidence",
    "neverWriteFullSections": "Never write full sections",
    "noAnthropomorphism": "No anthropomorphism",
    "forbiddenPhrases": "Forbidden Phrases",
    "outcomeFocus": "Outcome Focus",
    "primaryEndpoint": "Primary Endpoint",
    "citationPolicy": "Citation Policy",
    "mandatoryEvidence": "Mandatory evidence",
    "strength": "Strength",
    "scope": "Scope",
    "immutabilityWarning": "Immutable Record",
    "immutabilityDescription": "Configuration locked by database RLS policy. Clone to create a new draft version.",
    "noCertifiedPersonas": "No Certified Personas",
    "noCertifiedPersonasDescription": "Lock and validate personas in the Governance section to certify them for production use.",
    "lockedAt": "Locked {{date}}",
    "version": "v{{version}}",
    "clonedTo": "Cloning \"{{name}}\" to v{{version}} Draft...",
    "auditTimeline": "Audit Timeline",
    "created": "Created",
    "validatedAction": "Validated",
    "lockedForProduction": "Locked for Production",
    "by": "by {{user}}",
    "at": "at {{time}}"
  },
  
  "types": {
    "analysis": "Analysis & Review",
    "statistical": "Statistical Expert",
    "writing": "Academic Writing",
    "safety": "Safety Review",
    "validation": "Schema Validation"
  },
  
  "tones": {
    "socratic": "Socratic Questioning",
    "neutral": "Neutral Observer",
    "academic": "Academic Formal"
  },
  
  "confidenceLevels": {
    "1": "Maximum Hedging",
    "2": "Conservative",
    "3": "Balanced",
    "4": "Assertive",
    "5": "Definitive"
  },
  
  "citationStrengths": {
    "1": "Relaxed",
    "2": "Moderate",
    "3": "Standard",
    "4": "Strict",
    "5": "Maximum"
  },
  
  "knowledgeBaseScopes": {
    "currentProject": "Current Project",
    "allProjects": "All Projects"
  },
  
  "sortOptions": {
    name: "Name",
    date: "Date Created",
    type: "Persona Type",
    version: "Version"
  },
  
  roles: {
    contributor: {
      name: "Contributor Role",
      description: "You can create and test personas. Use \"Request Validation\" to submit for Lead Scientist approval. Informal names allowed during draft phase."
    },
    leadScientist: {
      name: "Lead Scientist Role",
      description: "You can lock personas for production use. Professional naming (5+ chars) required. Access to full validation and simulation sandbox."
    },
    admin: {
      name: "Administrator Role",
      description: "Full system access including audit logs, version history, and persona archival. Can override locked personas and manage all users."
    }
  },
  
  guidance: {
    title: "Persona Guidance",
    identity: {
      title: "Identity & Purpose",
      description: "Define the core identity and therapeutic focus of your AI persona.",
      tips: [
        "Select a persona type that matches your validation needs",
        "Professional naming (5+ characters) is required for production",
        "Therapeutic area and study phase affect AI recommendations"
      ]
    },
    interpretation: {
      title: "Interpretation Rules",
      description: "Control what the AI is allowed and forbidden to infer.",
      tips: [
        "Define clear boundaries for AI interpretation",
        "Conflicts between allowed/disallowed rules will block validation",
        "These rules ensure regulatory compliance and patient safety"
      ]
    },
    language: {
      title: "Language Controls",
      description: "Configure tone, confidence level, and writing restrictions.",
      tips: [
        "Socratic tone encourages critical thinking",
        "Conservative confidence adds safety hedging",
        "Forbidden phrases ensure regulatory language compliance"
      ]
    },
    outcome: {
      title: "Outcome Focus",
      description: "Specify primary endpoints and statistical validation rules.",
      tips: [
        "Primary endpoint must match study design",
        "Statistical goals guide analysis recommendations",
        "Success thresholds must be clinically meaningful"
      ]
    },
    citation: {
      title: "Citation Policy",
      description: "Enforce evidence standards and source requirements.",
      tips: [
        "Mandatory citations ensure audit trail",
        "Peer-reviewed sources add scientific rigor",
        "Maximum uncited sentences prevent speculation"
      ]
    },
    validation: {
      title: "Validation Status",
      description: "Review and resolve validation errors before locking.",
      tips: [
        "All critical failures must be resolved",
        "Name validation enforces professional standards",
        "Lock creates an immutable audit record"
      ]
    }
  },
  
  // Dashboard
  dashboard: {
    activePersonas: "Active Personas",
    activePersonasCount: "Active Personas ({{count}})",
    realTimeValidationEnabled: "Real-time validation enabled",
    required: "REQUIRED",
    realTime: "REAL-TIME",
    activeForAllStudyTypes: "Active for ALL study types",
    viewDetails: "View Details",
    deactivate: "Deactivate",
    cannotDeactivate: "Cannot Deactivate",
    noActivePersonas: "No Active Personas",
    noActivePersonasMessage: "Activate personas from the Available Personas section below",
    availablePersonas: "Available Personas",
    availablePersonasCount: "Available Personas ({{count}})",
    availablePersonasSubtitle: "Activate for additional validation",
    activate: "Activate",
    currentStudyType: "Current Study Type:",
    personasConfiguredMessage: "Personas are automatically configured based on your study design",
    // Expanded Details
    validationRules: "Validation Rules",
    validationRulesActive: "{{count}} active",
    validationMode: "Validation Mode",
    realTimeBatch: "Real-time + Batch",
    batchOnly: "Batch Only",
    priorityLevel: "Priority Level",
    priority: "Priority {{priority}}",
    sidebar: "Sidebar",
    enabled: "Enabled",
    disabled: "Disabled",
    // Stats
    activePersonasStats: "Active Personas",
    excellentCompliance: "Excellent Compliance",
    regulatoryFrameworks: "Regulatory Frameworks"
  }
};