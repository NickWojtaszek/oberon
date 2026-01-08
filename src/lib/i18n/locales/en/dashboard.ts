export default {
  // === DASHBOARD & WORKSPACE MODULE ===
  
  // Main Header
  header: {
    title: "Dashboard",
    subtitle: "Clinical Intelligence Workspace",
    description: "Your research command center",
    welcome: "Welcome back, {{name}}",
    lastAccess: "Last accessed {{date}}"
  },
  
  // Study Progress Section
  studyProgress: {
    title: "Study Progress",
    stepsCompleted: "{{completed}} of {{total}} steps completed",
    percentComplete: "Complete",
    overallProgress: "Overall Progress"
  },
  
  // Methodology Status Card
  methodologyStatus: {
    notConfigured: "Study Methodology Not Configured",
    notConfiguredDescription: "Define your study design, team configuration, and research hypothesis to unlock methodology-driven features like blinding protocols and role-based access.",
    configureButton: "Configure Study Methodology",
    title: "Study Methodology",
    configuredAt: "Configured {{date}}",
    reconfigure: "Reconfigure methodology",
    studyDesign: "Study Design",
    teamConfiguration: "Team Configuration",
    assignedPersonas: "Assigned Personas",
    rolesCount: "{{count}} role",
    rolesCount_plural: "{{count}} roles",
    teamConfigLocked: "Team configuration locked",
    blindingProtocol: "Blinding Protocol",
    studyUnblinded: "Study Unblinded",
    unblindedAt: "Unblinded {{date}}",
    active: "ACTIVE",
    unblinded: "UNBLINDED",
    unblindingReason: "Reason:",
    personasBlinded: "{{count}} persona is blinded",
    personasBlinded_plural: "{{count}} personas are blinded",
    researchQuestion: "Research Question"
  },
  
  // Workflow Step Cards
  workflowSteps: {
    stepLabel: "Step {{number}}",
    currentStep: "Current Step",
    complete: "Complete",
    inProgress: "In Progress",
    notStarted: "Not Started",
    locked: "Locked",
    progress: "Progress",
    checklist: "Checklist",
    actionRequired: "Action Required",
    viewDetails: "View Details",
    continueStep: "Continue",
    startStep: "Start Step",
    nearlyDone: "Nearly Done"
  },
  
  // Workflow Step Details & Actions
  workflowDetails: {
    // Personas step
    noPersonasConfigured: "No personas configured",
    personasConfigured: "{{count}} persona configured",
    personasConfigured_plural: "{{count}} personas configured",
    viewPersonas: "View Personas",
    createPersonas: "Create Personas",
    
    // Project setup step
    configureTeamBlinding: "Configure team & blinding",
    teamSize: "Team size: {{size}}",
    blinding: "Blinding: {{type}}",
    viewSettings: "View Settings",
    configureSettings: "Configure Settings",
    
    // Methodology step
    setupMethodologyEngine: "Set up methodology engine",
    methodologyConfigured: "Methodology configured",
    configureMethodology: "Configure Methodology",
    viewMethodology: "View Methodology",
    
    // Ethics/IRB step
    submitIRBApplication: "Submit IRB application",
    irbApproved: "IRB Approved",
    protocolNumber: "Protocol: {{number}}",
    statusLabel: "Status: {{status}}",
    viewIRBStatus: "View IRB Status",
    submitIRB: "Submit IRB",
    
    // Protocol step
    noProtocolCreated: "No protocol created",
    protocolLabel: "Protocol {{number}}",
    versionStatus: "Version {{version}} ({{status}})",
    schemaBlocks: "{{count}} schema block",
    schemaBlocks_plural: "{{count}} schema blocks",
    openProtocolBuilder: "Open Protocol Builder",
    createProtocol: "Create Protocol",
    viewLibrary: "View Library",
    
    // Database step
    noDataCollected: "No data collected",
    recordsCollected: "{{count}} record collected",
    recordsCollected_plural: "{{count}} records collected",
    subjects: "{{count}} subject",
    subjects_plural: "{{count}} subjects",
    enterMoreData: "Enter More Data",
    enterData: "Enter Data",
    browseRecords: "Browse Records",
    
    // Statistics step
    collectDataFirst: "Collect data first",
    readyToConfigureAnalytics: "Ready to configure analytics",
    recordsAvailable: "{{count}} record available",
    recordsAvailable_plural: "{{count}} records available",
    configureAnalytics: "Configure Analytics",
    
    // Paper step
    featureComingSoon: "Feature coming soon",
    viewRequirements: "View Requirements"
  },
  
  // Quick Access Section
  quickAccess: {
    title: "Quick Access",
    ethicsIRB: {
      title: "Ethics & IRB",
      description: "Submit and track IRB applications"
    },
    governance: {
      title: "Governance",
      description: "Manage roles and permissions"
    },
    methodology: {
      title: "Methodology",
      description: "Auto-generate methodology section"
    }
  },
  
  // Need Help Section
  needHelp: {
    title: "Need Help?",
    documentation: {
      title: "Documentation",
      description: "View guides and best practices"
    },
    quickStart: {
      title: "Quick Start",
      description: "Follow the tutorial walkthrough"
    },
    support: {
      title: "Support",
      description: "Contact the research team"
    }
  },
  
  // Specific Workflow Steps
  steps: {
    definePersonas: {
      title: "Define Study Personas",
      description: "Configure team roles and permissions for your clinical trial",
      personasConfigured: "{{count}} persona configured",
      personasConfigured_plural: "{{count}} personas configured",
      viewPersonas: "View Personas"
    },
    setupProject: {
      title: "Setup Project",
      description: "Configure project settings, team, and blinding",
      configureSettings: "Configure Settings",
      configureTeamBlinding: "Configure team & blinding"
    },
    configureMethodology: {
      title: "Configure Methodology",
      description: "Set up the methodology engine for your clinical trial",
      configureButton: "Configure Methodology",
      setupEngine: "Set up methodology engine"
    },
    submitIRB: {
      title: "Submit IRB Application",
      description: "Submit your ethics/IRB application for approval",
      submitButton: "Submit IRB",
      submitApplication: "Submit IRB application"
    },
    developProtocol: {
      title: "Develop Protocol",
      description: "Build your clinical protocol structure with the Schema Engine"
    },
    establishDatabase: {
      title: "Establish Database",
      description: "Auto-generate database structure and collect patient data"
    },
    configureAnalytics: {
      title: "Configure Analytics",
      description: "Set up statistical analyses and choose visualization methods"
    },
    buildPaper: {
      title: "Build Research Paper",
      description: "Generate publication-ready research documentation"
    }
  },
  
  // Workspace Shell
  workspace: {
    title: "Workspace",
    myWorkspace: "My Workspace",
    sharedWorkspaces: "Shared Workspaces",
    recentWorkspaces: "Recent Workspaces",
    createWorkspace: "Create New Workspace",
    switchWorkspace: "Switch Workspace",
    workspaceSettings: "Workspace Settings",
    members: "Members",
    activity: "Activity",
    starred: "Starred",
    archive: "Archive"
  },
  
  // Quick Actions
  quickActions: {
    title: "Quick Actions",
    newProtocol: "New Protocol",
    importData: "Import Data",
    exportReport: "Export Report",
    runAnalysis: "Run Analysis",
    scheduleJob: "Schedule Job",
    inviteCollaborator: "Invite Collaborator",
    generateMethodology: "Generate Methodology",
    viewAllActions: "View All Actions"
  },
  
  // Summary Cards
  summary: {
    title: "Overview",
    activeProtocols: "Active Protocols",
    totalParticipants: "Total Participants",
    dataQuality: "Data Quality",
    pendingReviews: "Pending Reviews",
    recentActivity: "Recent Activity",
    upcomingMilestones: "Upcoming Milestones",
    teamMembers: "Team Members",
    storageUsed: "Storage Used"
  },
  
  // Recent Activity
  activity: {
    title: "Recent Activity",
    viewAll: "View All Activity",
    today: "Today",
    yesterday: "Yesterday",
    thisWeek: "This Week",
    older: "Older",
    noActivity: "No recent activity",
    protocolCreated: "Protocol created",
    protocolUpdated: "Protocol updated",
    dataImported: "Data imported",
    reportGenerated: "Report generated",
    collaboratorAdded: "Collaborator added",
    milestoneCompleted: "Milestone completed",
    commentAdded: "Comment added",
    fileUploaded: "File uploaded",
    analysisCompleted: "Analysis completed"
  },
  
  // Projects Grid
  projects: {
    title: "My Projects",
    allProjects: "All Projects",
    activeProjects: "Active Projects",
    completedProjects: "Completed Projects",
    archivedProjects: "Archived Projects",
    createProject: "Create Project",
    projectStatus: "Status",
    lastModified: "Last Modified",
    owner: "Owner",
    progress: "Progress",
    dueDate: "Due Date",
    viewProject: "View Project",
    editProject: "Edit Project",
    archiveProject: "Archive Project",
    deleteProject: "Delete Project",
    noProjects: "No projects found",
    createFirstProject: "Create your first project"
  },
  
  // Protocols Section
  protocols: {
    title: "Protocols",
    myProtocols: "My Protocols",
    sharedProtocols: "Shared with Me",
    templates: "Templates",
    drafts: "Drafts",
    published: "Published",
    underReview: "Under Review",
    approved: "Approved",
    createProtocol: "Create Protocol",
    viewProtocol: "View Protocol",
    editProtocol: "Edit Protocol",
    duplicateProtocol: "Duplicate",
    deleteProtocol: "Delete Protocol",
    noProtocols: "No protocols found",
    protocolCount: "{{count}} protocol",
    protocolCount_plural: "{{count}} protocols"
  },
  
  // Data Overview
  data: {
    title: "Data Overview",
    totalRecords: "Total Records",
    recordsToday: "Records Today",
    recordsThisWeek: "Records This Week",
    dataCompleteness: "Data Completeness",
    validationStatus: "Validation Status",
    qualityScore: "Quality Score",
    lastSync: "Last Sync",
    pendingValidation: "Pending Validation",
    viewDataManagement: "View Data Management",
    importData: "Import Data",
    exportData: "Export Data"
  },
  
  // Analytics Summary
  analytics: {
    title: "Analytics",
    viewDashboard: "View Full Dashboard",
    keyMetrics: "Key Metrics",
    enrollment: "Enrollment",
    retention: "Retention",
    completion: "Completion Rate",
    adverseEvents: "Adverse Events",
    dataCollection: "Data Collection",
    sitePerformance: "Site Performance",
    generateReport: "Generate Report",
    scheduleReport: "Schedule Report"
  },
  
  // Notifications
  notifications: {
    title: "Notifications",
    viewAll: "View All Notifications",
    markAllRead: "Mark All as Read",
    noNotifications: "No new notifications",
    unreadCount: "{{count}} unread",
    newComment: "New comment on {{item}}",
    reviewRequest: "Review request for {{item}}",
    milestoneApproaching: "Milestone approaching: {{name}}",
    dataQualityAlert: "Data quality alert",
    collaboratorInvite: "Collaborator invitation",
    protocolApproved: "Protocol approved",
    reportReady: "Report ready for download",
    systemUpdate: "System update available"
  },
  
  // Tasks & Reminders
  tasks: {
    title: "Tasks & Reminders",
    myTasks: "My Tasks",
    assignedToMe: "Assigned to Me",
    createdByMe: "Created by Me",
    completed: "Completed",
    overdue: "Overdue",
    dueToday: "Due Today",
    dueThisWeek: "Due This Week",
    noDueDate: "No Due Date",
    addTask: "Add Task",
    markComplete: "Mark Complete",
    editTask: "Edit Task",
    deleteTask: "Delete Task",
    assignTo: "Assign to",
    priority: "Priority",
    high: "High",
    medium: "Medium",
    low: "Low",
    noTasks: "No tasks found"
  },
  
  // Team & Collaboration
  team: {
    title: "Team",
    viewTeam: "View Team",
    teamMembers: "Team Members",
    activeMembers: "Active Members",
    pendingInvitations: "Pending Invitations",
    inviteMember: "Invite Member",
    role: "Role",
    lastActive: "Last Active",
    online: "Online",
    offline: "Offline",
    viewProfile: "View Profile",
    sendMessage: "Send Message",
    removeFromTeam: "Remove from Team"
  },
  
  // Calendar & Timeline
  calendar: {
    title: "Calendar",
    viewCalendar: "View Full Calendar",
    upcomingEvents: "Upcoming Events",
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    noEvents: "No events scheduled",
    addEvent: "Add Event",
    milestone: "Milestone",
    meeting: "Meeting",
    deadline: "Deadline",
    visit: "Study Visit",
    reminder: "Reminder"
  },
  
  // Widgets
  widgets: {
    title: "Widgets",
    addWidget: "Add Widget",
    removeWidget: "Remove Widget",
    customizeLayout: "Customize Layout",
    resetLayout: "Reset to Default",
    saveLayout: "Save Layout",
    protocolOverview: "Protocol Overview",
    dataQuality: "Data Quality",
    enrollment: "Enrollment Status",
    milestones: "Milestones",
    recentActivity: "Recent Activity",
    teamActivity: "Team Activity",
    quickStats: "Quick Stats",
    alerts: "Alerts"
  },
  
  // Search & Filters
  search: {
    title: "Search",
    searchPlaceholder: "Search protocols, data, reports...",
    recentSearches: "Recent Searches",
    clearHistory: "Clear History",
    filters: "Filters",
    filterBy: "Filter by",
    sortBy: "Sort by",
    dateRange: "Date Range",
    status: "Status",
    owner: "Owner",
    type: "Type",
    clearFilters: "Clear Filters",
    applyFilters: "Apply Filters",
    noResults: "No results found",
    searchResults: "{{count}} result found",
    searchResults_plural: "{{count}} results found"
  },
  
  // Help & Support
  help: {
    title: "Help & Support",
    documentation: "Documentation",
    tutorials: "Tutorials",
    videoGuides: "Video Guides",
    keyboardShortcuts: "Keyboard Shortcuts",
    contactSupport: "Contact Support",
    reportIssue: "Report an Issue",
    featureRequest: "Feature Request",
    whatsNew: "What's New",
    releaseNotes: "Release Notes",
    communityForum: "Community Forum"
  },
  
  // User Menu
  user: {
    title: "Account",
    profile: "My Profile",
    settings: "Settings",
    preferences: "Preferences",
    language: "Language",
    theme: "Theme",
    notifications: "Notification Settings",
    privacy: "Privacy",
    security: "Security",
    billing: "Billing",
    logout: "Log Out",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    autoMode: "Auto"
  },
  
  // Common Actions
  actions: {
    view: "View",
    edit: "Edit",
    delete: "Delete",
    share: "Share",
    export: "Export",
    duplicate: "Duplicate",
    archive: "Archive",
    restore: "Restore",
    refresh: "Refresh",
    filter: "Filter",
    sort: "Sort",
    search: "Search",
    create: "Create",
    save: "Save",
    cancel: "Cancel",
    close: "Close"
  },
  
  // Status Labels
  status: {
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    completed: "Completed",
    inProgress: "In Progress",
    draft: "Draft",
    published: "Published",
    archived: "Archived",
    approved: "Approved",
    rejected: "Rejected",
    underReview: "Under Review"
  },
  
  // Empty States
  empty: {
    noData: "No data available",
    noProjects: "No projects found",
    noProtocols: "No protocols found",
    noActivity: "No recent activity",
    noNotifications: "No new notifications",
    noTasks: "No tasks assigned",
    noResults: "No results found",
    getStarted: "Get started by creating your first {{item}}",
    createNew: "Create New {{item}}"
  },
  
  // Time & Dates
  time: {
    justNow: "Just now",
    minutesAgo: "{{count}} minute ago",
    minutesAgo_plural: "{{count}} minutes ago",
    hoursAgo: "{{count}} hour ago",
    hoursAgo_plural: "{{count}} hours ago",
    daysAgo: "{{count}} day ago",
    daysAgo_plural: "{{count}} days ago",
    weeksAgo: "{{count}} week ago",
    weeksAgo_plural: "{{count}} weeks ago",
    monthsAgo: "{{count}} month ago",
    monthsAgo_plural: "{{count}} months ago",
    yearsAgo: "{{count}} year ago",
    yearsAgo_plural: "{{count}} years ago"
  }
};