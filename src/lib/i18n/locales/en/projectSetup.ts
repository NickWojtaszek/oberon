export default {
  // === PROJECT SETUP & MANAGEMENT ===
  
  // Header
  header: {
    title: "Project Setup",
    description: "Configure your research project",
    projectLibrary: "Project Library",
    newProject: "New Project",
    currentProject: "Current Project"
  },
  
  // Project Creation
  create: {
    title: "Create New Project",
    projectName: "Project Name",
    projectNamePlaceholder: "Enter project name...",
    projectCode: "Project Code",
    projectCodePlaceholder: "e.g., PROJ-2026-001",
    description: "Project Description",
    descriptionPlaceholder: "Describe your research project...",
    studyDesign: "Study Design",
    therapeuticArea: "Therapeutic Area",
    startDate: "Start Date",
    endDate: "End Date (Estimated)",
    principalInvestigator: "Principal Investigator",
    sponsor: "Sponsor",
    create: "Create Project",
    creating: "Creating...",
    createSuccess: "Project created successfully",
    createError: "Failed to create project"
  },
  
  // Study Design Options
  studyDesign: {
    selectDesign: "Select study design...",
    rct: "Randomized Controlled Trial",
    observational: "Observational Study",
    cohort: "Cohort Study",
    caseControl: "Case-Control Study",
    crossSectional: "Cross-Sectional Study",
    longitudinal: "Longitudinal Study",
    singleArm: "Single-Arm Study",
    crossover: "Crossover Study",
    factorial: "Factorial Design",
    adaptive: "Adaptive Design",
    pragmatic: "Pragmatic Trial",
    registry: "Registry Study"
  },
  
  // Therapeutic Areas
  therapeuticAreas: {
    selectArea: "Select therapeutic area...",
    oncology: "Oncology",
    cardiology: "Cardiology",
    neurology: "Neurology",
    immunology: "Immunology",
    infectious: "Infectious Disease",
    respiratory: "Respiratory",
    endocrinology: "Endocrinology",
    gastroenterology: "Gastroenterology",
    nephrology: "Nephrology",
    hematology: "Hematology",
    rheumatology: "Rheumatology",
    dermatology: "Dermatology",
    psychiatry: "Psychiatry",
    pediatrics: "Pediatrics",
    other: "Other"
  },
  
  // Project Overview
  overview: {
    title: "Project Overview",
    details: "Project Details",
    status: "Status",
    progress: "Progress",
    team: "Team",
    protocols: "Protocols",
    sites: "Sites",
    participants: "Participants",
    milestones: "Milestones",
    timeline: "Timeline",
    budget: "Budget",
    documents: "Documents"
  },
  
  // Team Management
  team: {
    title: "Team Management",
    addMember: "Add Team Member",
    inviteMember: "Invite Member",
    members: "Team Members",
    roles: "Roles",
    permissions: "Permissions",
    memberName: "Name",
    memberEmail: "Email",
    memberRole: "Role",
    memberStatus: "Status",
    joinDate: "Join Date",
    lastActive: "Last Active",
    actions: "Actions",
    editMember: "Edit Member",
    removeMember: "Remove Member",
    resendInvite: "Resend Invitation",
    invitationSent: "Invitation sent",
    invitationPending: "Pending",
    active: "Active",
    inactive: "Inactive"
  },
  
  // Team Roles
  roles: {
    principalInvestigator: "Principal Investigator",
    coInvestigator: "Co-Investigator",
    projectManager: "Project Manager",
    dataManager: "Data Manager",
    statistician: "Statistician",
    clinicalResearchCoordinator: "Clinical Research Coordinator",
    researchAssociate: "Research Associate",
    dataEntrySpecialist: "Data Entry Specialist",
    qualityAssurance: "Quality Assurance",
    regulatoryAffairs: "Regulatory Affairs",
    monitor: "Monitor",
    auditor: "Auditor",
    viewer: "Viewer",
    custom: "Custom Role"
  },
  
  // Permission Levels
  permissions: {
    full: "Full Access",
    edit: "Can Edit",
    view: "View Only",
    comment: "Can Comment",
    manage: "Can Manage",
    admin: "Administrator",
    restricted: "Restricted Access",
    customPermissions: "Custom Permissions",
    protocolAccess: "Protocol Access",
    dataAccess: "Data Access",
    analyticsAccess: "Analytics Access",
    exportAccess: "Export Access",
    userManagement: "User Management",
    projectSettings: "Project Settings"
  },
  
  // Invite Member Modal
  inviteModal: {
    title: "Invite Team Member",
    email: "Email Address",
    emailPlaceholder: "member@institution.edu",
    role: "Assign Role",
    selectRole: "Select a role...",
    permissions: "Set Permissions",
    message: "Personal Message (Optional)",
    messagePlaceholder: "Add a personal message to the invitation...",
    sendInvite: "Send Invitation",
    sending: "Sending...",
    inviteSuccess: "Invitation sent successfully",
    inviteError: "Failed to send invitation",
    multipleEmails: "Enter multiple emails (comma-separated)",
    copyInviteLink: "Copy Invitation Link",
    linkCopied: "Link copied to clipboard"
  },
  
  // Methodology Configuration
  methodology: {
    title: "Methodology Configuration",
    description: "Configure your study methodology",
    blinding: "Blinding",
    randomization: "Randomization",
    allocation: "Allocation",
    masking: "Masking",
    controlType: "Control Type",
    interventionModel: "Intervention Model",
    primaryPurpose: "Primary Purpose",
    phase: "Study Phase",
    enrollment: "Target Enrollment",
    duration: "Study Duration",
    followUp: "Follow-up Period"
  },
  
  // Blinding Options
  blinding: {
    none: "None (Open Label)",
    single: "Single Blind",
    double: "Double Blind",
    triple: "Triple Blind",
    quadruple: "Quadruple Blind"
  },
  
  // Randomization Methods
  randomization: {
    none: "Non-Randomized",
    simple: "Simple Randomization",
    block: "Block Randomization",
    stratified: "Stratified Randomization",
    adaptive: "Adaptive Randomization",
    minimization: "Minimization"
  },
  
  // Allocation Methods
  allocation: {
    randomized: "Randomized",
    nonRandomized: "Non-Randomized",
    notApplicable: "N/A"
  },
  
  // Control Types
  controlTypes: {
    placebo: "Placebo Controlled",
    active: "Active Comparator",
    noConcurrent: "No Concurrent Control",
    doseComparison: "Dose Comparison",
    historical: "Historical Control"
  },
  
  // Intervention Models
  interventionModels: {
    parallel: "Parallel Assignment",
    crossover: "Crossover Assignment",
    factorial: "Factorial Assignment",
    sequential: "Sequential Assignment",
    single: "Single Group Assignment"
  },
  
  // Study Phases
  phases: {
    earlyPhase1: "Early Phase 1",
    phase1: "Phase 1",
    phase1Phase2: "Phase 1/Phase 2",
    phase2: "Phase 2",
    phase2Phase3: "Phase 2/Phase 3",
    phase3: "Phase 3",
    phase4: "Phase 4",
    notApplicable: "N/A"
  },
  
  // Project Settings
  settings: {
    title: "Project Settings",
    general: "General Settings",
    collaboration: "Collaboration",
    notifications: "Notifications",
    dataManagement: "Data Management",
    security: "Security & Privacy",
    integration: "Integrations",
    advanced: "Advanced Settings"
  },
  
  // General Settings
  generalSettings: {
    projectName: "Project Name",
    projectCode: "Project Code",
    description: "Description",
    visibility: "Visibility",
    visibilityPrivate: "Private - Only team members",
    visibilityOrganization: "Organization - All members",
    visibilityPublic: "Public - Anyone with link",
    archive: "Archive Project",
    archiveWarning: "Archived projects are read-only",
    delete: "Delete Project",
    deleteWarning: "This action cannot be undone",
    timezone: "Timezone",
    language: "Default Language",
    dateFormat: "Date Format",
    timeFormat: "Time Format"
  },
  
  // Collaboration Settings
  collaborationSettings: {
    allowComments: "Allow Comments",
    allowSuggestions: "Allow Suggestions",
    requireApproval: "Require Approval for Changes",
    enableVersionControl: "Enable Version Control",
    autoSave: "Auto-Save",
    autoSaveInterval: "Auto-Save Interval (minutes)",
    conflictResolution: "Conflict Resolution",
    conflictManual: "Manual Resolution",
    conflictAutoMerge: "Auto-Merge When Possible",
    activityTracking: "Activity Tracking",
    trackAllChanges: "Track All Changes",
    trackMajorChanges: "Track Major Changes Only"
  },
  
  // Notification Settings
  notificationSettings: {
    emailNotifications: "Email Notifications",
    inAppNotifications: "In-App Notifications",
    notifyOnComment: "New Comments",
    notifyOnMention: "Mentions",
    notifyOnAssignment: "Task Assignments",
    notifyOnUpdate: "Protocol Updates",
    notifyOnApproval: "Approval Requests",
    notifyOnDeadline: "Upcoming Deadlines",
    notifyOnMilestone: "Milestone Completions",
    digestFrequency: "Digest Frequency",
    digestRealtime: "Real-time",
    digestDaily: "Daily Digest",
    digestWeekly: "Weekly Digest",
    digestNever: "Never"
  },
  
  // Data Management Settings
  dataManagementSettings: {
    dataRetention: "Data Retention Period",
    retentionIndefinite: "Indefinite",
    retention1Year: "1 Year",
    retention3Years: "3 Years",
    retention5Years: "5 Years",
    retention7Years: "7 Years",
    retention10Years: "10 Years",
    backupFrequency: "Backup Frequency",
    backupDaily: "Daily",
    backupWeekly: "Weekly",
    backupMonthly: "Monthly",
    exportFormat: "Default Export Format",
    auditLog: "Audit Log",
    auditLogEnabled: "Enable Audit Logging",
    auditLogRetention: "Audit Log Retention (days)"
  },
  
  // Security Settings
  securitySettings: {
    twoFactorAuth: "Two-Factor Authentication",
    requireTwoFactor: "Require 2FA for All Members",
    sessionTimeout: "Session Timeout (minutes)",
    ipWhitelist: "IP Whitelist",
    allowedIPs: "Allowed IP Addresses",
    dataEncryption: "Data Encryption",
    encryptionAtRest: "Encryption at Rest",
    encryptionInTransit: "Encryption in Transit",
    accessControl: "Access Control",
    restrictByIP: "Restrict Access by IP",
    restrictByTime: "Restrict Access by Time",
    passwordPolicy: "Password Policy",
    minPasswordLength: "Minimum Length",
    requireUppercase: "Require Uppercase",
    requireNumbers: "Require Numbers",
    requireSpecialChars: "Require Special Characters"
  },
  
  // Milestones
  milestones: {
    title: "Project Milestones",
    addMilestone: "Add Milestone",
    editMilestone: "Edit Milestone",
    deleteMilestone: "Delete Milestone",
    milestoneName: "Milestone Name",
    description: "Description",
    dueDate: "Due Date",
    status: "Status",
    assignedTo: "Assigned To",
    priority: "Priority",
    priorityHigh: "High",
    priorityMedium: "Medium",
    priorityLow: "Low",
    statusNotStarted: "Not Started",
    statusInProgress: "In Progress",
    statusCompleted: "Completed",
    statusDelayed: "Delayed",
    completion: "Completion",
    overdue: "Overdue",
    upcoming: "Upcoming",
    completed: "Completed"
  },
  
  // Timeline
  timeline: {
    title: "Project Timeline",
    viewMode: "View Mode",
    viewDay: "Day",
    viewWeek: "Week",
    viewMonth: "Month",
    viewQuarter: "Quarter",
    viewYear: "Year",
    today: "Today",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    filter: "Filter",
    export: "Export Timeline",
    ganttChart: "Gantt Chart",
    calendarView: "Calendar View"
  },
  
  // Project Actions
  actions: {
    saveProject: "Save Project",
    publishProject: "Publish Project",
    archiveProject: "Archive Project",
    deleteProject: "Delete Project",
    duplicateProject: "Duplicate Project",
    exportProject: "Export Project",
    shareProject: "Share Project",
    printSummary: "Print Summary",
    viewHistory: "View History",
    restoreVersion: "Restore Version"
  },
  
  // Validation Messages
  validation: {
    nameRequired: "Project name is required",
    codeRequired: "Project code is required",
    codeInvalid: "Invalid project code format",
    dateInvalid: "Invalid date",
    endDateBeforeStart: "End date must be after start date",
    emailRequired: "Email is required",
    emailInvalid: "Invalid email address",
    roleRequired: "Role is required",
    enrollmentInvalid: "Enrollment must be a positive number",
    durationInvalid: "Duration must be a positive number"
  },
  
  // Confirmation Dialogs
  confirmations: {
    archiveProject: "Archive this project?",
    archiveMessage: "Archived projects become read-only. You can restore them later.",
    deleteProject: "Delete this project?",
    deleteMessage: "This will permanently delete the project and all associated data. This action cannot be undone.",
    removeMember: "Remove team member?",
    removeMemberMessage: "{{name}} will lose access to this project immediately.",
    leaveProject: "Leave this project?",
    leaveProjectMessage: "You will no longer have access to this project."
  },
  
  // Status Messages
  messages: {
    projectSaved: "Project saved successfully",
    projectPublished: "Project published successfully",
    projectArchived: "Project archived successfully",
    projectDeleted: "Project deleted successfully",
    projectRestored: "Project restored successfully",
    memberAdded: "Team member added successfully",
    memberRemoved: "Team member removed successfully",
    memberUpdated: "Team member updated successfully",
    settingsSaved: "Settings saved successfully",
    milestoneCreated: "Milestone created successfully",
    milestoneUpdated: "Milestone updated successfully",
    milestoneDeleted: "Milestone deleted successfully"
  }
};
