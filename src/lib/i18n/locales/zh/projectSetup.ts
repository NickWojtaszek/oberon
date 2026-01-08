export default {
  // === PROJECT SETUP & MANAGEMENT ===
  
  // Header
  header: {
    title: "项目设置",
    description: "配置您的研究项目",
    projectLibrary: "项目库",
    newProject: "新建项目",
    currentProject: "当前项目"
  },
  
  // Project Creation
  create: {
    title: "创建新项目",
    projectName: "项目名称",
    projectNamePlaceholder: "输入项目名称...",
    projectCode: "项目代码",
    projectCodePlaceholder: "例如：PROJ-2026-001",
    description: "项目描述",
    descriptionPlaceholder: "描述您的研究项目...",
    studyDesign: "研究设计",
    therapeuticArea: "治疗领域",
    startDate: "开始日期",
    endDate: "结束日期（预估）",
    principalInvestigator: "主要研究者",
    sponsor: "赞助商",
    create: "创建项目",
    creating: "创建中...",
    createSuccess: "项目创建成功",
    createError: "项目创建失败"
  },
  
  // Study Design Options
  studyDesign: {
    selectDesign: "选择研究设计...",
    rct: "随机对照试验",
    observational: "观察性研究",
    cohort: "队列研究",
    caseControl: "病例对照研究",
    crossSectional: "横断面研究",
    longitudinal: "纵向研究",
    singleArm: "单臂研究",
    crossover: "交叉研究",
    factorial: "析因设计",
    adaptive: "适应性设计",
    pragmatic: "实用性试验",
    registry: "登记研究"
  },
  
  // Therapeutic Areas
  therapeuticAreas: {
    selectArea: "选择治疗领域...",
    oncology: "肿瘤学",
    cardiology: "心脏病学",
    neurology: "神经学",
    immunology: "免疫学",
    infectious: "传染病",
    respiratory: "呼吸系统",
    endocrinology: "内分泌学",
    gastroenterology: "消化病学",
    nephrology: "肾脏病学",
    hematology: "血液学",
    rheumatology: "风湿病学",
    dermatology: "皮肤病学",
    psychiatry: "精神病学",
    pediatrics: "儿科",
    other: "其他"
  },
  
  // Project Overview
  overview: {
    title: "项目概览",
    details: "项目详情",
    status: "状态",
    progress: "进度",
    team: "团队",
    protocols: "协议",
    sites: "研究中心",
    participants: "参与者",
    milestones: "里程碑",
    timeline: "时间线",
    budget: "预算",
    documents: "文档"
  },
  
  // Team Management
  team: {
    title: "团队管理",
    addMember: "添加团队成员",
    inviteMember: "邀请成员",
    members: "团队成员",
    roles: "角色",
    permissions: "权限",
    memberName: "姓名",
    memberEmail: "电子邮件",
    memberRole: "角色",
    memberStatus: "状态",
    joinDate: "加入日期",
    lastActive: "最后活跃",
    actions: "操作",
    editMember: "编辑成员",
    removeMember: "移除成员",
    resendInvite: "重新发送邀请",
    invitationSent: "邀请已发送",
    invitationPending: "待处理",
    active: "活跃",
    inactive: "非活跃"
  },
  
  // Team Roles
  roles: {
    principalInvestigator: "主要研究者",
    coInvestigator: "共同研究者",
    projectManager: "项目经理",
    dataManager: "数据管理员",
    statistician: "统计师",
    clinicalResearchCoordinator: "临床研究协调员",
    researchAssociate: "研究助理",
    dataEntrySpecialist: "数据录入专员",
    qualityAssurance: "质量保证",
    regulatoryAffairs: "法规事务",
    monitor: "监查员",
    auditor: "稽查员",
    viewer: "查看者",
    custom: "自定义角色"
  },
  
  // Permission Levels
  permissions: {
    full: "完全访问",
    edit: "可编辑",
    view: "仅查看",
    comment: "可评论",
    manage: "可管理",
    admin: "管理员",
    restricted: "受限访问",
    customPermissions: "自定义权限",
    protocolAccess: "协议访问",
    dataAccess: "数据访问",
    analyticsAccess: "分析访问",
    exportAccess: "导出访问",
    userManagement: "用户管理",
    projectSettings: "项目设置"
  },
  
  // Invite Member Modal
  inviteModal: {
    title: "邀请团队成员",
    email: "电子邮件地址",
    emailPlaceholder: "member@institution.edu",
    role: "分配角色",
    selectRole: "选择角色...",
    permissions: "设置权限",
    message: "个人消息（可选）",
    messagePlaceholder: "为邀请添加个人消息...",
    sendInvite: "发送邀请",
    sending: "发送中...",
    inviteSuccess: "邀请发送成功",
    inviteError: "邀请发送失败",
    multipleEmails: "输入多个电子邮件（用逗号分隔）",
    copyInviteLink: "复制邀请链接",
    linkCopied: "链接已复制到剪贴板"
  },
  
  // Methodology Configuration
  methodology: {
    title: "方法论配置",
    description: "配置您的研究方法论",
    blinding: "盲法",
    randomization: "随机化",
    allocation: "分配",
    masking: "掩蔽",
    controlType: "对照类型",
    interventionModel: "干预模型",
    primaryPurpose: "主要目的",
    phase: "研究阶段",
    enrollment: "目标入组",
    duration: "研究持续时间",
    followUp: "随访期"
  },
  
  // Blinding Options
  blinding: {
    none: "无（开放标签）",
    single: "单盲",
    double: "双盲",
    triple: "三盲",
    quadruple: "四盲"
  },
  
  // Randomization Methods
  randomization: {
    none: "非随机化",
    simple: "简单随机化",
    block: "区组随机化",
    stratified: "分层随机化",
    adaptive: "适应性随机化",
    minimization: "最小化"
  },
  
  // Allocation Methods
  allocation: {
    randomized: "随机化",
    nonRandomized: "非随机化",
    notApplicable: "不适用"
  },
  
  // Control Types
  controlTypes: {
    placebo: "安慰剂对照",
    active: "阳性对照",
    noConcurrent: "无同期对照",
    doseComparison: "剂量比较",
    historical: "历史对照"
  },
  
  // Intervention Models
  interventionModels: {
    parallel: "平行分配",
    crossover: "交叉分配",
    factorial: "析因分配",
    sequential: "序贯分配",
    single: "单组分配"
  },
  
  // Study Phases
  phases: {
    earlyPhase1: "早期I期",
    phase1: "I期",
    phase1Phase2: "I/II期",
    phase2: "II期",
    phase2Phase3: "II/III期",
    phase3: "III期",
    phase4: "IV期",
    notApplicable: "不适用"
  },
  
  // Project Settings
  settings: {
    title: "项目设置",
    general: "常规设置",
    collaboration: "协作",
    notifications: "通知",
    dataManagement: "数据管理",
    security: "安全与隐私",
    integration: "集成",
    advanced: "高级设置"
  },
  
  // General Settings
  generalSettings: {
    projectName: "项目名称",
    projectCode: "项目代码",
    description: "描述",
    visibility: "可见性",
    visibilityPrivate: "私有 - 仅团队成员",
    visibilityOrganization: "组织 - 所有成员",
    visibilityPublic: "公开 - 任何有链接的人",
    archive: "存档项目",
    archiveWarning: "已存档的项目为只读",
    delete: "删除项目",
    deleteWarning: "此操作无法撤消",
    timezone: "时区",
    language: "默认语言",
    dateFormat: "日期格式",
    timeFormat: "时间格式"
  },
  
  // Collaboration Settings
  collaborationSettings: {
    allowComments: "允许评论",
    allowSuggestions: "允许建议",
    requireApproval: "需要批准更改",
    enableVersionControl: "启用版本控制",
    autoSave: "自动保存",
    autoSaveInterval: "自动保存间隔（分钟）",
    conflictResolution: "冲突解决",
    conflictManual: "手动解决",
    conflictAutoMerge: "尽可能自动合并",
    activityTracking: "活动跟踪",
    trackAllChanges: "跟踪所有更改",
    trackMajorChanges: "仅跟踪重大更改"
  },
  
  // Notification Settings
  notificationSettings: {
    emailNotifications: "电子邮件通知",
    inAppNotifications: "应用内通知",
    notifyOnComment: "新评论",
    notifyOnMention: "提及",
    notifyOnAssignment: "任务分配",
    notifyOnUpdate: "协议更新",
    notifyOnApproval: "批准请求",
    notifyOnDeadline: "即将到来的截止日期",
    notifyOnMilestone: "里程碑完成",
    digestFrequency: "摘要频率",
    digestRealtime: "实时",
    digestDaily: "每日摘要",
    digestWeekly: "每周摘要",
    digestNever: "从不"
  },
  
  // Data Management Settings
  dataManagementSettings: {
    dataRetention: "数据保留期",
    retentionIndefinite: "无限期",
    retention1Year: "1年",
    retention3Years: "3年",
    retention5Years: "5年",
    retention7Years: "7年",
    retention10Years: "10年",
    backupFrequency: "备份频率",
    backupDaily: "每日",
    backupWeekly: "每周",
    backupMonthly: "每月",
    exportFormat: "默认导出格式",
    auditLog: "审计日志",
    auditLogEnabled: "启用审计日志",
    auditLogRetention: "审计日志保留（天）"
  },
  
  // Security Settings
  securitySettings: {
    twoFactorAuth: "双因素认证",
    requireTwoFactor: "要求所有成员使用2FA",
    sessionTimeout: "会话超时（分钟）",
    ipWhitelist: "IP白名单",
    allowedIPs: "允许的IP地址",
    dataEncryption: "数据加密",
    encryptionAtRest: "静态加密",
    encryptionInTransit: "传输加密",
    accessControl: "访问控制",
    restrictByIP: "按IP限制访问",
    restrictByTime: "按时间限制访问",
    passwordPolicy: "密码策略",
    minPasswordLength: "最小长度",
    requireUppercase: "要求大写字母",
    requireNumbers: "要求数字",
    requireSpecialChars: "要求特殊字符"
  },
  
  // Milestones
  milestones: {
    title: "项目里程碑",
    addMilestone: "添加里程碑",
    editMilestone: "编辑里程碑",
    deleteMilestone: "删除里程碑",
    milestoneName: "里程碑名称",
    description: "描述",
    dueDate: "截止日期",
    status: "状态",
    assignedTo: "分配给",
    priority: "优先级",
    priorityHigh: "高",
    priorityMedium: "中",
    priorityLow: "低",
    statusNotStarted: "未开始",
    statusInProgress: "进行中",
    statusCompleted: "已完成",
    statusDelayed: "已延迟",
    completion: "完成度",
    overdue: "逾期",
    upcoming: "即将到来",
    completed: "已完成"
  },
  
  // Timeline
  timeline: {
    title: "项目时间线",
    viewMode: "查看模式",
    viewDay: "天",
    viewWeek: "周",
    viewMonth: "月",
    viewQuarter: "季度",
    viewYear: "年",
    today: "今天",
    zoomIn: "放大",
    zoomOut: "缩小",
    filter: "筛选",
    export: "导出时间线",
    ganttChart: "甘特图",
    calendarView: "日历视图"
  },
  
  // Project Actions
  actions: {
    saveProject: "保存项目",
    publishProject: "发布项目",
    archiveProject: "存档项目",
    deleteProject: "删除项目",
    duplicateProject: "复制项目",
    exportProject: "导出项目",
    shareProject: "共享项目",
    printSummary: "打印摘要",
    viewHistory: "查看历史",
    restoreVersion: "恢复版本"
  },
  
  // Validation Messages
  validation: {
    nameRequired: "项目名称为必填项",
    codeRequired: "项目代码为必填项",
    codeInvalid: "项目代码格式无效",
    dateInvalid: "日期无效",
    endDateBeforeStart: "结束日期必须在开始日期之后",
    emailRequired: "电子邮件为必填项",
    emailInvalid: "电子邮件地址无效",
    roleRequired: "角色为必填项",
    enrollmentInvalid: "入组人数必须为正数",
    durationInvalid: "持续时间必须为正数"
  },
  
  // Confirmation Dialogs
  confirmations: {
    archiveProject: "存档此项目？",
    archiveMessage: "已存档的项目将变为只读。您可以稍后恢复它们。",
    deleteProject: "删除此项目？",
    deleteMessage: "这将永久删除项目及所有相关数据。此操作无法撤消。",
    removeMember: "移除团队成员？",
    removeMemberMessage: "{{name}} 将立即失去对此项目的访问权限。",
    leaveProject: "离开此项目？",
    leaveProjectMessage: "您将不再有权访问此项目。"
  },
  
  // Status Messages
  messages: {
    projectSaved: "项目保存成功",
    projectPublished: "项目发布成功",
    projectArchived: "项目存档成功",
    projectDeleted: "项目删除成功",
    projectRestored: "项目恢复成功",
    memberAdded: "团队成员添加成功",
    memberRemoved: "团队成员移除成功",
    memberUpdated: "团队成员更新成功",
    settingsSaved: "设置保存成功",
    milestoneCreated: "里程碑创建成功",
    milestoneUpdated: "里程碑更新成功",
    milestoneDeleted: "里程碑删除成功"
  }
};
