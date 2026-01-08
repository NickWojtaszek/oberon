export default {
  // === PROTOCOL LIBRARY ===
  
  // Header
  header: {
    title: "Protocol Library",
    description: "Browse and manage research protocols",
    newProtocol: "New Protocol",
    importProtocol: "Import Protocol"
  },
  
  // View Controls
  viewControls: {
    gridView: "Grid View",
    listView: "List View",
    sortBy: "Sort by",
    filterBy: "Filter by",
    showFilters: "Show Filters",
    hideFilters: "Hide Filters"
  },
  
  // Sort Options
  sortOptions: {
    nameAsc: "Name (A-Z)",
    nameDesc: "Name (Z-A)",
    dateCreated: "Date Created",
    dateModified: "Last Modified",
    studyType: "Study Type",
    status: "Status"
  },
  
  // Filter Options
  filters: {
    allProtocols: "All Protocols",
    myProtocols: "My Protocols",
    sharedWithMe: "Shared with Me",
    recentlyViewed: "Recently Viewed",
    favorites: "Favorites",
    studyType: "Study Type",
    status: "Status",
    phase: "Phase",
    therapeuticArea: "Therapeutic Area",
    clearFilters: "Clear All Filters"
  },
  
  // Study Types
  studyTypes: {
    all: "All Types",
    rct: "Randomized Controlled Trial",
    observational: "Observational Study",
    singleArm: "Single-Arm Study",
    diagnostic: "Diagnostic Study",
    registry: "Registry Study",
    other: "Other"
  },
  
  // Status Options
  statusOptions: {
    all: "All Status",
    draft: "Draft",
    inReview: "In Review",
    approved: "Approved",
    active: "Active",
    completed: "Completed",
    archived: "Archived"
  },
  
  // Phase Options
  phaseOptions: {
    all: "All Phases",
    phase1: "Phase I",
    phase2: "Phase II",
    phase3: "Phase III",
    phase4: "Phase IV",
    notApplicable: "N/A"
  },
  
  // Protocol Card
  card: {
    clickToOpen: "Click to open",
    current: "Current",
    created: "Created",
    modified: "Modified",
    modifiedBy: "Modified by",
    published: "Published",
    versions: "version",
    versions_plural: "versions",
    viewOlderVersions: "View {{count}} older version(s)",
    continueEditing: "Continue Editing",
    publish: "Publish",
    view: "View",
    createNewVersion: "Create New Version",
    untitledProtocol: "[Untitled Protocol]",
    noNumber: "[No Number]",
    // Status badges
    statusDraft: "Draft",
    statusPublished: "Published",
    statusArchived: "Archived",
    // Legacy fields
    createdBy: "Created by",
    lastModified: "Modified",
    studyType: "Study Type",
    phase: "Phase",
    status: "Status",
    participants: "Participants",
    endpoints: "Endpoints",
    variables: "Variables",
    version: "Version",
    open: "Open",
    edit: "Edit",
    duplicate: "Duplicate",
    archive: "Archive",
    delete: "Delete",
    share: "Share",
    export: "Export",
    addToFavorites: "Add to Favorites",
    removeFromFavorites: "Remove from Favorites",
    viewDetails: "View Details"
  },
  
  // Search
  search: {
    placeholder: "Search protocols by name, ID, or keyword...",
    noResults: "No protocols found",
    noResultsMessage: "Try adjusting your search or filters",
    resultsCount: "{{count}} protocol found",
    resultsCount_plural: "{{count}} protocols found"
  },
  
  // Empty States
  emptyStates: {
    noProtocols: {
      title: "No Protocols Yet",
      description: "Get started by creating your first protocol or importing an existing one.",
      actionCreate: "Create Protocol",
      actionImport: "Import Protocol"
    },
    noFavorites: {
      title: "No Favorites",
      description: "Star your frequently used protocols to access them quickly.",
      action: "Browse All Protocols"
    },
    noShared: {
      title: "No Shared Protocols",
      description: "Protocols shared with you by team members will appear here.",
      action: "Browse My Protocols"
    },
    noRecent: {
      title: "No Recent Protocols",
      description: "Protocols you've recently viewed will appear here.",
      action: "Browse All Protocols"
    }
  },
  
  // Actions
  actions: {
    createNew: "Create New Protocol",
    importFromFile: "Import from File",
    importFromTemplate: "Import from Template",
    bulkActions: "Bulk Actions",
    selectAll: "Select All",
    deselectAll: "Deselect All",
    archiveSelected: "Archive Selected",
    deleteSelected: "Delete Selected",
    exportSelected: "Export Selected"
  },
  
  // Create Protocol Modal
  createModal: {
    title: "Create New Protocol",
    protocolName: "Protocol Name",
    protocolNumber: "Protocol Number",
    studyType: "Study Type",
    phase: "Phase (Optional)",
    therapeuticArea: "Therapeutic Area (Optional)",
    description: "Description (Optional)",
    startFromTemplate: "Start from Template",
    startFromScratch: "Start from Scratch",
    selectTemplate: "Select a template...",
    create: "Create Protocol",
    creating: "Creating..."
  },
  
  // Import Modal
  importModal: {
    title: "Import Protocol",
    uploadFile: "Upload File",
    dragAndDrop: "Drag and drop a protocol file here",
    or: "or",
    browse: "Browse Files",
    supportedFormats: "Supported formats: JSON, XML, CSV",
    importing: "Importing...",
    importSuccess: "Protocol imported successfully",
    importError: "Failed to import protocol"
  },
  
  // Delete Confirmation
  deleteConfirm: {
    title: "Delete Protocol?",
    message: "Are you sure you want to delete \"{{name}}\"? This action cannot be undone.",
    messageMultiple: "Are you sure you want to delete {{count}} protocols? This action cannot be undone.",
    confirm: "Delete Protocol",
    confirmMultiple: "Delete {{count}} Protocols",
    cancel: "Cancel",
    deleting: "Deleting...",
    deleteSuccess: "Protocol deleted successfully",
    deleteSuccessMultiple: "{{count}} protocols deleted successfully",
    deleteError: "Failed to delete protocol"
  },
  
  // Archive Confirmation
  archiveConfirm: {
    title: "Archive Protocol?",
    message: "Are you sure you want to archive \"{{name}}\"?",
    messageMultiple: "Are you sure you want to archive {{count}} protocols?",
    confirm: "Archive Protocol",
    confirmMultiple: "Archive {{count}} Protocols",
    cancel: "Cancel",
    archiving: "Archiving...",
    archiveSuccess: "Protocol archived successfully",
    archiveSuccessMultiple: "{{count}} protocols archived successfully",
    archiveError: "Failed to archive protocol"
  },
  
  // Duplicate Modal
  duplicateModal: {
    title: "Duplicate Protocol",
    newName: "New Protocol Name",
    copyData: "Copy Schema Data",
    copySettings: "Copy Settings",
    duplicate: "Duplicate",
    duplicating: "Duplicating...",
    duplicateSuccess: "Protocol duplicated successfully",
    duplicateError: "Failed to duplicate protocol"
  },
  
  // Share Modal
  shareModal: {
    title: "Share Protocol",
    shareWith: "Share with",
    addPeople: "Add people or teams...",
    permissions: "Permissions",
    canView: "Can View",
    canEdit: "Can Edit",
    canAdmin: "Can Administrate",
    sendNotification: "Send email notification",
    share: "Share",
    sharing: "Sharing...",
    shareSuccess: "Protocol shared successfully",
    shareError: "Failed to share protocol",
    currentlySharedWith: "Currently shared with",
    removeAccess: "Remove Access"
  },
  
  // Export Options
  exportOptions: {
    title: "Export Protocol",
    format: "Export Format",
    formatJSON: "JSON (Full Data)",
    formatPDF: "PDF (Document)",
    formatCSV: "CSV (Data Only)",
    formatXML: "XML (Standard)",
    includeSchema: "Include Schema",
    includeData: "Include Collected Data",
    includeMetadata: "Include Metadata",
    includeAttachments: "Include Attachments",
    export: "Export",
    exporting: "Exporting...",
    exportSuccess: "Protocol exported successfully",
    exportError: "Failed to export protocol"
  },
  
  // Metadata
  metadata: {
    protocolId: "Protocol ID",
    version: "Version",
    createdDate: "Created",
    modifiedDate: "Last Modified",
    createdBy: "Created By",
    modifiedBy: "Last Modified By",
    studyType: "Study Type",
    phase: "Phase",
    therapeuticArea: "Therapeutic Area",
    targetEnrollment: "Target Enrollment",
    primaryEndpoint: "Primary Endpoint",
    duration: "Study Duration",
    sites: "Sites",
    tags: "Tags"
  }
};