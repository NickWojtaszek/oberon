export default {
  // === DATA MANAGEMENT MODULE ===
  
  // Main Header
  header: {
    title: "Data Management",
    subtitle: "Import, Export & Transform Clinical Data",
    description: "Manage your clinical data with enterprise-grade tools"
  },
  
  // Tab Navigation
  tabs: {
    import: "Import",
    export: "Export",
    transform: "Transform",
    quality: "Data Quality",
    history: "History",
    schedule: "Scheduled Jobs"
  },
  
  // === IMPORT SECTION ===
  import: {
    title: "Import Data",
    subtitle: "Upload and import clinical data from external sources",
    
    // Upload
    upload: {
      title: "Upload File",
      dragDrop: "Drag and drop files here, or click to browse",
      browseFiles: "Browse Files",
      selectedFile: "Selected File",
      fileSize: "File Size",
      fileType: "File Type",
      removeFile: "Remove File",
      uploadAnother: "Upload Another File",
      maxFileSize: "Maximum file size: {{size}}MB",
      supportedFormats: "Supported Formats",
      formats: {
        csv: "CSV (Comma-separated values)",
        excel: "Excel (.xlsx, .xls)",
        json: "JSON (JavaScript Object Notation)",
        xml: "XML (Extensible Markup Language)",
        sas: "SAS Data Files (.sas7bdat)",
        spss: "SPSS Files (.sav)",
        stata: "Stata Files (.dta)",
        txt: "Text Files (.txt, .dat)"
      }
    },
    
    // File Preview
    preview: {
      title: "File Preview",
      firstRows: "First {{count}} rows",
      totalRows: "Total Rows",
      totalColumns: "Total Columns",
      encoding: "File Encoding",
      delimiter: "Delimiter",
      hasHeaders: "First row contains headers",
      refreshPreview: "Refresh Preview",
      viewAll: "View All Data"
    },
    
    // Field Mapping
    mapping: {
      title: "Field Mapping",
      subtitle: "Map source fields to protocol schema",
      autoMap: "Auto-Map Fields",
      clearMapping: "Clear All Mappings",
      sourceField: "Source Field",
      targetField: "Target Field (Protocol Schema)",
      dataType: "Data Type",
      transformation: "Transformation",
      selectTarget: "Select target field...",
      selectTransformation: "Select transformation...",
      unmappedFields: "Unmapped Fields",
      mappedFields: "Mapped Fields",
      requiredFields: "Required Fields",
      optionalFields: "Optional Fields",
      ignoredFields: "Ignored Fields",
      mappingStatus: "Mapping Status",
      complete: "{{mapped}} of {{total}} required fields mapped",
      suggestions: "Mapping Suggestions",
      applySuggestion: "Apply Suggestion",
      confidence: "Confidence: {{percent}}%"
    },
    
    // Transformations
    transformations: {
      none: "No transformation",
      trim: "Trim whitespace",
      uppercase: "Convert to uppercase",
      lowercase: "Convert to lowercase",
      titleCase: "Convert to title case",
      parseDate: "Parse as date",
      parseNumber: "Parse as number",
      parseBoolean: "Parse as boolean",
      split: "Split string",
      concatenate: "Concatenate values",
      lookup: "Lookup from table",
      calculate: "Calculate value",
      custom: "Custom transformation"
    },
    
    // Validation
    validation: {
      title: "Validation Rules",
      subtitle: "Define validation rules for imported data",
      addRule: "Add Validation Rule",
      rule: "Rule",
      condition: "Condition",
      errorMessage: "Error Message",
      warningMessage: "Warning Message",
      skipInvalid: "Skip invalid records",
      flagInvalid: "Flag invalid records for review",
      rejectInvalid: "Reject file if invalid records found",
      validationResults: "Validation Results",
      passed: "Passed",
      failed: "Failed",
      warnings: "Warnings",
      errors: "Errors",
      viewDetails: "View Details"
    },
    
    // Import Options
    options: {
      title: "Import Options",
      importMode: "Import Mode",
      append: "Append to existing data",
      appendDesc: "Add new records to existing dataset",
      replace: "Replace existing data",
      replaceDesc: "Delete existing data and import new",
      update: "Update existing records",
      updateDesc: "Update records based on key field",
      upsert: "Upsert (Update or Insert)",
      upsertDesc: "Update if exists, insert if new",
      keyField: "Key Field for Matching",
      selectKeyField: "Select key field...",
      duplicateHandling: "Duplicate Handling",
      skipDuplicates: "Skip duplicates",
      overwriteDuplicates: "Overwrite duplicates",
      flagDuplicates: "Flag duplicates for review",
      errorHandling: "Error Handling",
      stopOnError: "Stop on first error",
      continueOnError: "Continue on error",
      rollbackOnError: "Rollback all on error",
      batchSize: "Batch Size",
      batchSizeHint: "Number of records to process at once"
    },
    
    // Progress
    progress: {
      title: "Import Progress",
      preparing: "Preparing import...",
      uploading: "Uploading file...",
      validating: "Validating data...",
      transforming: "Transforming data...",
      importing: "Importing records...",
      completed: "Import completed",
      failed: "Import failed",
      recordsProcessed: "Records Processed",
      recordsImported: "Records Imported",
      recordsSkipped: "Records Skipped",
      recordsFailed: "Records Failed",
      estimatedTime: "Estimated time remaining",
      elapsedTime: "Elapsed time",
      cancel: "Cancel Import",
      cancelConfirm: "Are you sure you want to cancel this import?"
    },
    
    // Summary
    summary: {
      title: "Import Summary",
      success: "Import Completed Successfully",
      partial: "Import Completed with Warnings",
      failure: "Import Failed",
      totalRecords: "Total Records",
      successfulRecords: "Successful",
      failedRecords: "Failed",
      skippedRecords: "Skipped",
      warningRecords: "Warnings",
      duration: "Duration",
      downloadLog: "Download Import Log",
      downloadErrors: "Download Error Report",
      viewImportedData: "View Imported Data",
      importAnother: "Import Another File",
      done: "Done"
    }
  },
  
  // === EXPORT SECTION ===
  export: {
    title: "Export Data",
    subtitle: "Export clinical data to external formats",
    
    // Data Selection
    selection: {
      title: "Select Data to Export",
      protocol: "Protocol",
      selectProtocol: "Select protocol...",
      allProtocols: "All Protocols",
      version: "Version",
      selectVersion: "Select version...",
      dateRange: "Date Range",
      fromDate: "From Date",
      toDate: "To Date",
      allDates: "All Dates",
      records: "Records",
      allRecords: "All Records",
      selectedRecords: "Selected Records Only",
      filteredRecords: "Filtered Records",
      recordCount: "{{count}} record selected",
      recordCount_plural: "{{count}} records selected"
    },
    
    // Field Selection
    fields: {
      title: "Select Fields",
      selectAll: "Select All",
      deselectAll: "Deselect All",
      selectedFields: "Selected Fields",
      availableFields: "Available Fields",
      requiredFields: "Required Fields",
      fieldGroups: "Field Groups",
      demographics: "Demographics",
      vitals: "Vital Signs",
      laboratory: "Laboratory",
      adverseEvents: "Adverse Events",
      medications: "Medications",
      procedures: "Procedures",
      assessments: "Assessments",
      custom: "Custom Fields"
    },
    
    // Format Options
    format: {
      title: "Export Format",
      selectFormat: "Select format...",
      csv: "CSV (Comma-separated)",
      excel: "Excel Workbook (.xlsx)",
      json: "JSON (Structured data)",
      xml: "XML (Extensible Markup)",
      sas: "SAS Transport (.xpt)",
      spss: "SPSS (.sav)",
      stata: "Stata (.dta)",
      pdf: "PDF Report",
      customFormat: "Custom Format Template",
      formatOptions: "Format Options",
      includeHeaders: "Include column headers",
      includeMetadata: "Include metadata sheet",
      includeCodebook: "Include data codebook",
      dateFormat: "Date Format",
      numberFormat: "Number Format",
      missingValue: "Missing Value Indicator",
      encoding: "Character Encoding",
      compression: "Compress output file"
    },
    
    // Filters
    filters: {
      title: "Apply Filters",
      addFilter: "Add Filter",
      field: "Field",
      operator: "Operator",
      value: "Value",
      equals: "Equals",
      notEquals: "Not Equals",
      greaterThan: "Greater Than",
      lessThan: "Less Than",
      contains: "Contains",
      startsWith: "Starts With",
      endsWith: "Ends With",
      between: "Between",
      in: "In List",
      isNull: "Is Null",
      isNotNull: "Is Not Null",
      and: "AND",
      or: "OR",
      removeFilter: "Remove Filter",
      clearAllFilters: "Clear All Filters"
    },
    
    // Preview
    preview: {
      title: "Export Preview",
      previewData: "Preview Data",
      sampleRows: "Sample {{count}} rows",
      estimatedSize: "Estimated File Size",
      estimatedRecords: "Estimated Record Count",
      refreshPreview: "Refresh Preview"
    },
    
    // Progress
    progress: {
      title: "Export Progress",
      preparing: "Preparing export...",
      querying: "Querying data...",
      formatting: "Formatting data...",
      generating: "Generating file...",
      compressing: "Compressing file...",
      completed: "Export completed",
      failed: "Export failed",
      recordsExported: "Records Exported",
      fileSize: "File Size",
      cancel: "Cancel Export"
    },
    
    // Download
    download: {
      title: "Download Export",
      ready: "Your export is ready",
      fileName: "File Name",
      fileSize: "File Size",
      expiresIn: "Expires in {{hours}} hours",
      downloadNow: "Download Now",
      downloadLink: "Download Link",
      copyLink: "Copy Link",
      linkCopied: "Link copied to clipboard",
      emailLink: "Email Download Link",
      exportAnother: "Export Another Dataset"
    }
  },
  
  // === TRANSFORM SECTION ===
  transform: {
    title: "Data Transformation",
    subtitle: "Clean, normalize, and derive new data fields",
    
    // Transformation Types
    types: {
      clean: "Data Cleaning",
      normalize: "Normalization",
      derive: "Derived Variables",
      aggregate: "Aggregation",
      pivot: "Pivot/Unpivot",
      merge: "Merge Datasets"
    },
    
    // Cleaning
    cleaning: {
      title: "Data Cleaning",
      removeDuplicates: "Remove Duplicate Records",
      trimWhitespace: "Trim Whitespace",
      standardizeCase: "Standardize Case",
      fixDataTypes: "Fix Data Types",
      handleMissing: "Handle Missing Values",
      removeOutliers: "Remove Outliers",
      validateRanges: "Validate Value Ranges",
      applyAll: "Apply All Cleaning Rules"
    },
    
    // Normalization
    normalization: {
      title: "Data Normalization",
      standardize: "Standardize Values",
      categorize: "Categorize Values",
      binning: "Create Bins/Categories",
      scaling: "Scale Numeric Values",
      encoding: "Encode Categorical Values"
    },
    
    // Derived Variables
    derived: {
      title: "Derived Variables",
      addVariable: "Add Derived Variable",
      variableName: "Variable Name",
      formula: "Formula/Expression",
      formulaPlaceholder: "Enter formula...",
      useWizard: "Use Formula Wizard",
      functions: "Available Functions",
      testFormula: "Test Formula",
      previewResults: "Preview Results",
      saveVariable: "Save Variable"
    },
    
    // Aggregation
    aggregation: {
      title: "Data Aggregation",
      groupBy: "Group By",
      selectFields: "Select grouping fields...",
      aggregations: "Aggregations",
      addAggregation: "Add Aggregation",
      function: "Function",
      sum: "Sum",
      average: "Average",
      count: "Count",
      min: "Minimum",
      max: "Maximum",
      median: "Median",
      mode: "Mode",
      stdDev: "Standard Deviation",
      variance: "Variance"
    },
    
    // Preview
    preview: {
      title: "Transformation Preview",
      before: "Before",
      after: "After",
      affectedRecords: "Affected Records",
      apply: "Apply Transformation",
      revert: "Revert Changes"
    }
  },
  
  // === DATA QUALITY SECTION ===
  quality: {
    title: "Data Quality",
    subtitle: "Assess and improve data quality",
    
    // Quality Score
    score: {
      title: "Quality Score",
      overall: "Overall Quality",
      completeness: "Completeness",
      accuracy: "Accuracy",
      consistency: "Consistency",
      validity: "Validity",
      timeliness: "Timeliness",
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
      poor: "Poor"
    },
    
    // Checks
    checks: {
      title: "Quality Checks",
      runChecks: "Run Quality Checks",
      runAll: "Run All Checks",
      lastRun: "Last run",
      missingData: "Missing Data Check",
      duplicates: "Duplicate Records Check",
      outliers: "Outlier Detection",
      consistency: "Consistency Check",
      referential: "Referential Integrity",
      businessRules: "Business Rules Validation",
      passed: "Passed",
      failed: "Failed",
      warnings: "Warnings",
      viewReport: "View Report"
    },
    
    // Issues
    issues: {
      title: "Data Quality Issues",
      severity: "Severity",
      critical: "Critical",
      major: "Major",
      minor: "Minor",
      info: "Informational",
      status: "Status",
      open: "Open",
      inProgress: "In Progress",
      resolved: "Resolved",
      ignored: "Ignored",
      assignedTo: "Assigned To",
      dueDate: "Due Date",
      resolveIssue: "Resolve Issue",
      ignoreIssue: "Ignore Issue",
      bulkResolve: "Bulk Resolve",
      exportIssues: "Export Issues"
    },
    
    // Reports
    reports: {
      title: "Quality Reports",
      generateReport: "Generate Report",
      reportType: "Report Type",
      summary: "Summary Report",
      detailed: "Detailed Report",
      trend: "Trend Analysis",
      comparison: "Comparison Report",
      dateRange: "Date Range",
      downloadReport: "Download Report"
    }
  },
  
  // === HISTORY SECTION ===
  history: {
    title: "Import/Export History",
    subtitle: "View past data operations",
    
    // Filters
    filters: {
      all: "All Operations",
      imports: "Imports Only",
      exports: "Exports Only",
      dateRange: "Date Range",
      status: "Status",
      user: "User"
    },
    
    // List
    list: {
      operation: "Operation",
      date: "Date",
      user: "User",
      records: "Records",
      status: "Status",
      duration: "Duration",
      actions: "Actions",
      viewDetails: "View Details",
      downloadFile: "Download File",
      viewLog: "View Log",
      rerun: "Re-run",
      delete: "Delete"
    },
    
    // Details
    details: {
      title: "Operation Details",
      operationId: "Operation ID",
      startTime: "Start Time",
      endTime: "End Time",
      parameters: "Parameters",
      results: "Results",
      logs: "Logs",
      errors: "Errors"
    },
    
    // Status
    status: {
      pending: "Pending",
      running: "Running",
      completed: "Completed",
      failed: "Failed",
      cancelled: "Cancelled",
      partialSuccess: "Partial Success"
    }
  },
  
  // === SCHEDULED JOBS SECTION ===
  schedule: {
    title: "Scheduled Jobs",
    subtitle: "Automate data import and export operations",
    
    // Job List
    jobs: {
      addJob: "Add Scheduled Job",
      editJob: "Edit Job",
      deleteJob: "Delete Job",
      enableJob: "Enable Job",
      disableJob: "Disable Job",
      runNow: "Run Now",
      jobName: "Job Name",
      schedule: "Schedule",
      lastRun: "Last Run",
      nextRun: "Next Run",
      status: "Status",
      enabled: "Enabled",
      disabled: "Disabled"
    },
    
    // Job Configuration
    config: {
      title: "Job Configuration",
      jobName: "Job Name",
      jobNamePlaceholder: "Enter job name...",
      description: "Description",
      descriptionPlaceholder: "Describe this job...",
      operation: "Operation Type",
      import: "Import Data",
      export: "Export Data",
      transform: "Transform Data",
      qualityCheck: "Quality Check",
      schedule: "Schedule",
      frequency: "Frequency",
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      custom: "Custom (Cron)",
      time: "Time",
      timeZone: "Time Zone",
      notifications: "Notifications",
      notifyOnSuccess: "Notify on success",
      notifyOnFailure: "Notify on failure",
      recipients: "Recipients",
      saveJob: "Save Job"
    },
    
    // Job History
    history: {
      title: "Job Execution History",
      executionDate: "Execution Date",
      duration: "Duration",
      status: "Status",
      records: "Records Processed",
      viewLog: "View Log"
    }
  },
  
  // === COMMON ACTIONS ===
  actions: {
    upload: "Upload",
    download: "Download",
    import: "Import",
    export: "Export",
    transform: "Transform",
    validate: "Validate",
    preview: "Preview",
    apply: "Apply",
    cancel: "Cancel",
    back: "Back",
    next: "Next",
    finish: "Finish",
    save: "Save",
    delete: "Delete",
    close: "Close",
    refresh: "Refresh",
    retry: "Retry"
  },
  
  // === COMMON MESSAGES ===
  messages: {
    uploadSuccess: "File uploaded successfully",
    uploadError: "Failed to upload file",
    importSuccess: "Data imported successfully",
    importError: "Failed to import data",
    exportSuccess: "Data exported successfully",
    exportError: "Failed to export data",
    transformSuccess: "Transformation applied successfully",
    transformError: "Failed to apply transformation",
    validationSuccess: "Validation passed",
    validationError: "Validation failed",
    noDataSelected: "No data selected",
    operationCancelled: "Operation cancelled",
    confirmDelete: "Are you sure you want to delete this?",
    unsavedChanges: "You have unsaved changes. Continue?"
  }
};
