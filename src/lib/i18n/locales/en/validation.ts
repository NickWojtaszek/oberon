export default {
  // === VALIDATION SYSTEM ===
  
  // Sidebar
  sidebar: {
    noIssues: "No issues found",
    issueCount: "{{count}} issue",
    issueCount_plural: "{{count}} issues",
    criticalIssues: "Critical Issues",
    warnings: "Warnings",
    informational: "Informational",
    recommendations: "Recommendations",
    citation: "Regulatory Citation",
    autoFixAvailable: "Auto-Fix Available",
    applyFix: "Apply Fix",
    location: "Location",
    module: "Module",
    tab: "Tab",
    field: "Field",
    viewDetails: "View Details",
    collapse: "Collapse",
    expand: "Expand"
  },
  
  // Validation status
  status: {
    validating: "Validating...",
    validated: "Validated",
    noValidation: "No validation performed",
    lastValidated: "Last validated",
    runValidation: "Run Validation",
    validationComplete: "Validation complete",
    validationFailed: "Validation failed"
  },
  
  // Export
  export: {
    title: "Export Validation Report",
    format: "Export Format",
    formatPDF: "PDF (HTML)",
    formatJSON: "JSON",
    formatCSV: "CSV",
    options: "Export Options",
    includeRecommendations: "Include Recommendations",
    includeCitations: "Include Regulatory Citations",
    filterBySeverity: "Filter by Severity",
    filterAll: "All Issues",
    filterCriticalWarning: "Critical & Warnings Only",
    filterCriticalOnly: "Critical Only",
    groupBy: "Group By",
    groupBySeverity: "Severity",
    groupByPersona: "Persona",
    groupByCategory: "Category",
    exportButton: "Export Report",
    exporting: "Exporting...",
    exportSuccess: "Report exported successfully",
    exportError: "Failed to export report"
  },
  
  // Trends
  trends: {
    title: "Validation Trends",
    overallTrend: "Overall Trend",
    personaTrends: "Persona Trends",
    scoreImprovement: "Score Improvement",
    issueReduction: "Issue Reduction",
    currentScore: "Current Score",
    previousScore: "Previous Score",
    scoreChange: "Score Change",
    improving: "Improving",
    declining: "Declining",
    stable: "Stable",
    noData: "No trend data available",
    snapshotCount: "{{count}} snapshot",
    snapshotCount_plural: "{{count}} snapshots",
    dateRange: "Date Range",
    compareVersions: "Compare Versions",
    version: "Version",
    selectVersion: "Select version..."
  },
  
  // Auto-fix
  autoFix: {
    title: "Auto-Fix Available",
    description: "This issue can be automatically fixed",
    applyFix: "Apply Auto-Fix",
    applying: "Applying fix...",
    success: "Fix applied successfully",
    error: "Failed to apply fix",
    fixesApplied: "{{count}} fix applied",
    fixesApplied_plural: "{{count}} fixes applied",
    confirmTitle: "Confirm Auto-Fix",
    confirmMessage: "Are you sure you want to apply this fix?",
    confirmMultiple: "Apply {{count}} auto-fixes?",
    reviewChanges: "Review changes before applying"
  },
  
  // Messages
  messages: {
    notApplicable: "Not applicable for this study type",
    checklistComplete: "All checklist items complete",
    checklistIncomplete: "{{completed}} of {{total}} complete"
  }
};
