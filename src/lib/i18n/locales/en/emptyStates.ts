/**
 * Empty States Translation - English
 * Centralized translations for all empty state screens
 */

export default {
  // === COMMON PRESETS ===
  
  // No Project Selected
  noProjectSelected: {
    title: "No Project Selected",
    description: "Select a project from the library to view its details and manage your research data.",
    action: "Go to Project Library"
  },
  
  // No Protocols
  noProtocols: {
    title: "No Protocols Yet",
    description: "Create your first protocol to define study variables, endpoints, and data collection workflows.",
    action: "Create New Protocol"
  },
  
  // No Projects
  noProjects: {
    title: "No Projects Yet",
    description: "Create your first project to start organizing your clinical research and trial data.",
    action: "Create New Project"
  },
  
  // No Data
  noData: {
    title: "No Data Available",
    description: "Start collecting data by setting up your database schema and importing records.",
    action: "Set Up Database"
  },
  
  // No Manuscripts
  noManuscripts: {
    title: "No Manuscripts Yet",
    description: "Create your first manuscript to begin writing and formatting your research paper.",
    action: "Create New Manuscript"
  },
  
  // No Analytics
  noAnalytics: {
    title: "No Analytics Available",
    description: "Run your first analysis after collecting data and defining your statistical endpoints.",
    action: "Go to Database"
  },
  
  // No IRB Submissions
  noIRBSubmissions: {
    title: "No IRB Submissions",
    description: "Submit your protocol for ethics review and track the approval process.",
    action: "New Submission"
  },
  
  // No Team Members
  noTeamMembers: {
    title: "No Team Members",
    description: "Invite collaborators to join your research project and manage team roles.",
    action: "Invite Team Member"
  },
  
  // No AI Personas
  noPersonas: {
    title: "No AI Personas Active",
    description: "Activate AI personas to get intelligent assistance with protocol validation and compliance.",
    action: "Browse Persona Library"
  },
  
  // === SEARCH & FILTER STATES ===
  
  noSearchResults: {
    title: "No Results Found",
    description: "Try adjusting your search terms or filters to find what you're looking for.",
    action: null
  },
  
  noFilterResults: {
    title: "No Matching Items",
    description: "No items match your current filter criteria. Try clearing some filters.",
    action: "Clear Filters"
  },
  
  // === LOADING & ERROR STATES ===
  
  loading: {
    title: "Loading...",
    description: "Please wait while we fetch your data.",
    action: null
  },
  
  error: {
    title: "Something Went Wrong",
    description: "We encountered an error loading this data. Please try refreshing the page.",
    action: "Refresh Page"
  },
  
  offline: {
    title: "You're Offline",
    description: "Some features are unavailable while offline. Connect to the internet to sync your data.",
    action: "Retry Connection"
  },
  
  // === PERMISSION STATES ===
  
  noPermission: {
    title: "Access Restricted",
    description: "You don't have permission to view this content. Contact your administrator for access.",
    action: null
  },
  
  readOnlyMode: {
    title: "Read-Only Mode",
    description: "You can view this content but cannot make changes with your current permissions.",
    action: null
  },
  
  // === COMPLETION STATES ===
  
  allComplete: {
    title: "All Done!",
    description: "You've completed all items in this section. Great work!",
    action: null
  },
  
  emptyInbox: {
    title: "Inbox Zero!",
    description: "You're all caught up. No pending notifications or tasks.",
    action: null
  },
  
  // === WORKFLOW-SPECIFIC STATES ===
  
  protocolWorkbench: {
    title: "Select a Protocol",
    description: "Choose a protocol from the library to start editing or create a new one.",
    action: "Go to Protocol Library"
  },
  
  academicWriting: {
    title: "No Manuscript Selected",
    description: "Select a manuscript from your library or create a new one to begin writing.",
    action: "Go to Academic Writing"
  },
  
  ethicsBoard: {
    title: "No Submission Selected",
    description: "Select an IRB submission to view details and track approval status.",
    action: "Go to Ethics Board"
  },
  
  database: {
    title: "No Schema Defined",
    description: "Define your database schema first before entering or browsing data.",
    action: "Go to Schema Builder"
  },
  
  analytics: {
    title: "No Analysis Selected",
    description: "Select a project and dataset to begin your statistical analysis.",
    action: "Select Project"
  }
};
