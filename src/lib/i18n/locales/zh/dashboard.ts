export default {
  // === DASHBOARD & WORKSPACE MODULE ===
  
  // Main Header
  header: {
    title: "仪表板",
    subtitle: "临床智能工作空间",
    description: "您的研究指挥中心",
    welcome: "欢迎回来，{{name}}",
    lastAccess: "上次访问 {{date}}"
  },
  
  // Study Progress Section
  studyProgress: {
    title: "研究进度",
    stepsCompleted: "已完成 {{completed}}/{{total}} 步",
    percentComplete: "完成",
    overallProgress: "总体进度"
  },
  
  // Methodology Status Card
  methodologyStatus: {
    notConfigured: "研究方法未配置",
    notConfiguredDescription: "定义您的研究设计、团队配置和研究假设，以解锁基于方法论的功能，如盲法协议和基于角色的访问。",
    configureButton: "配置研究方法",
    title: "研究方法",
    configuredAt: "配置于 {{date}}",
    reconfigure: "重新配置方法",
    studyDesign: "研究设计",
    teamConfiguration: "团队配置",
    assignedPersonas: "已分配角色",
    rolesCount: "{{count}} 个角色",
    rolesCount_plural: "{{count}} 个角色",
    teamConfigLocked: "团队配置已锁定",
    blindingProtocol: "盲法协议",
    studyUnblinded: "研究已揭盲",
    unblindedAt: "揭盲于 {{date}}",
    active: "活跃",
    unblinded: "已揭盲",
    unblindingReason: "原因：",
    personasBlinded: "{{count}} 个角色已设盲",
    personasBlinded_plural: "{{count}} 个角色已设盲",
    researchQuestion: "研究问题"
  },
  
  // Workflow Step Cards
  workflowSteps: {
    stepLabel: "步骤 {{number}}",
    currentStep: "当前步骤",
    complete: "已完成",
    inProgress: "进行中",
    notStarted: "未开始",
    locked: "已锁定",
    progress: "进度",
    checklist: "检查清单",
    actionRequired: "需要操作",
    viewDetails: "查看详情",
    continueStep: "继续",
    startStep: "开始步骤",
    nearlyDone: "即将完成"
  },
  
  // Workflow Step Details & Actions
  workflowDetails: {
    // Personas step
    noPersonasConfigured: "未配置角色",
    personasConfigured: "已配置 {{count}} 个角色",
    personasConfigured_plural: "已配置 {{count}} 个角色",
    viewPersonas: "查看角色",
    createPersonas: "创建角色",
    
    // Project setup step
    configureTeamBlinding: "配置团队和盲法",
    teamSize: "团队规模：{{size}}",
    blinding: "盲法：{{type}}",
    viewSettings: "查看设置",
    configureSettings: "配置设置",
    
    // Methodology step
    setupMethodologyEngine: "设置方法论引擎",
    methodologyConfigured: "方法论已配置",
    configureMethodology: "配置方法论",
    viewMethodology: "查看方法论",
    
    // Ethics/IRB step
    submitIRBApplication: "提交IRB申请",
    irbApproved: "IRB已批准",
    protocolNumber: "协议：{{number}}",
    statusLabel: "状态：{{status}}",
    viewIRBStatus: "查看IRB状态",
    submitIRB: "提交IRB",
    
    // Protocol step
    noProtocolCreated: "未创建协议",
    protocolLabel: "协议 {{number}}",
    versionStatus: "版本 {{version}}（{{status}}）",
    schemaBlocks: "{{count}} 个模式块",
    schemaBlocks_plural: "{{count}} 个模式块",
    openProtocolBuilder: "打开协议构建器",
    createProtocol: "创建协议",
    viewLibrary: "查看库",
    
    // Database step
    noDataCollected: "未收集数据",
    recordsCollected: "已收集 {{count}} 条记录",
    recordsCollected_plural: "已收集 {{count}} 条记录",
    subjects: "{{count}} 名受试者",
    subjects_plural: "{{count}} 名受试者",
    enterMoreData: "输入更多数据",
    enterData: "输入数据",
    browseRecords: "浏览记录",
    
    // Statistics step
    collectDataFirst: "请先收集数据",
    readyToConfigureAnalytics: "准备配置分析",
    recordsAvailable: "可用 {{count}} 条记录",
    recordsAvailable_plural: "可用 {{count}} 条记录",
    configureAnalytics: "配置分析",
    
    // Paper step
    featureComingSoon: "功能即将推出",
    viewRequirements: "查看要求"
  },
  
  // Quick Access Section
  quickAccess: {
    title: "快速访问",
    ethicsIRB: {
      title: "伦理和IRB",
      description: "提交和跟踪IRB申请"
    },
    governance: {
      title: "治理",
      description: "管理角色和权限"
    },
    methodology: {
      title: "方法论",
      description: "自动生成方法论部分"
    }
  },
  
  // Need Help Section
  needHelp: {
    title: "需要帮助吗？",
    documentation: {
      title: "文档",
      description: "查看指南和最佳实践"
    },
    quickStart: {
      title: "快速开始",
      description: "跟随教程演练"
    },
    support: {
      title: "支持",
      description: "联系研究团队"
    }
  },
  
  // Specific Workflow Steps
  steps: {
    definePersonas: {
      title: "定义研究角色",
      description: "为您的临床试验配置团队角色和权限",
      personasConfigured: "已配置 {{count}} 个角色",
      personasConfigured_plural: "已配置 {{count}} 个角色",
      viewPersonas: "查看角色"
    },
    setupProject: {
      title: "设置项目",
      description: "配置项目设置、团队和盲法",
      configureSettings: "配置设置",
      configureTeamBlinding: "配置团队和盲法"
    },
    configureMethodology: {
      title: "配置方法论",
      description: "为您的临床试验设置方法论引擎",
      configureButton: "配置方法论",
      setupEngine: "设置方法论引擎"
    },
    submitIRB: {
      title: "提交IRB申请",
      description: "提交您的伦理/IRB申请以供批准",
      submitButton: "提交IRB",
      submitApplication: "提交IRB申请"
    },
    developProtocol: {
      title: "开发协议",
      description: "使用模式引擎构建您的临床协议结构"
    },
    establishDatabase: {
      title: "建立数据库",
      description: "自动生成数据库结构并收集患者数据"
    },
    configureAnalytics: {
      title: "配置分析",
      description: "设置统计分析并选择可视化方法"
    },
    buildPaper: {
      title: "构建研究论文",
      description: "生成可供发表的研究文档"
    }
  },
  
  // Workspace Shell
  workspace: {
    title: "工作空间",
    myWorkspace: "我的工作空间",
    sharedWorkspaces: "共享工作空间",
    recentWorkspaces: "最近的工作空间",
    createWorkspace: "创建新工作空间",
    switchWorkspace: "切换工作空间",
    workspaceSettings: "工作空间设置",
    members: "成员",
    activity: "活动",
    starred: "已加星标",
    archive: "存档"
  },
  
  // Quick Actions
  quickActions: {
    title: "快速操作",
    newProtocol: "新建协议",
    importData: "导入数据",
    exportReport: "导出报告",
    runAnalysis: "运行分析",
    scheduleJob: "计划任务",
    inviteCollaborator: "邀请协作者",
    generateMethodology: "生成方法学",
    viewAllActions: "查看所有操作"
  },
  
  // Summary Cards
  summary: {
    title: "概览",
    activeProtocols: "活跃协议",
    totalParticipants: "总参与者",
    dataQuality: "数据质量",
    pendingReviews: "待审查",
    recentActivity: "最近活动",
    upcomingMilestones: "即将到来的里程碑",
    teamMembers: "团队成员",
    storageUsed: "已用存储"
  },
  
  // Recent Activity
  activity: {
    title: "最近活动",
    viewAll: "查看所有活动",
    today: "今天",
    yesterday: "昨天",
    thisWeek: "本周",
    older: "更早",
    noActivity: "无最近活动",
    protocolCreated: "协议已创建",
    protocolUpdated: "协议已更新",
    dataImported: "数据已导入",
    reportGenerated: "报告已生成",
    collaboratorAdded: "协作者已添加",
    milestoneCompleted: "里程碑已完成",
    commentAdded: "评论已添加",
    fileUploaded: "文件已上传",
    analysisCompleted: "分析已完成"
  },
  
  // Projects Grid
  projects: {
    title: "我的项目",
    allProjects: "所有项目",
    activeProjects: "活跃项目",
    completedProjects: "已完成项目",
    archivedProjects: "已存档项目",
    createProject: "创建项目",
    projectStatus: "状态",
    lastModified: "最后修改",
    owner: "所有者",
    progress: "进度",
    dueDate: "截止日期",
    viewProject: "查看项目",
    editProject: "编辑项目",
    archiveProject: "存档项目",
    deleteProject: "删除项目",
    noProjects: "未找到项目",
    createFirstProject: "创建您的第一个项目"
  },
  
  // Protocols Section
  protocols: {
    title: "协议",
    myProtocols: "我的协议",
    sharedProtocols: "与我共享",
    templates: "模板",
    drafts: "草稿",
    published: "已发布",
    underReview: "审查中",
    approved: "已批准",
    createProtocol: "创建协议",
    viewProtocol: "查看协议",
    editProtocol: "编辑协议",
    duplicateProtocol: "复制",
    deleteProtocol: "删除协议",
    noProtocols: "未找到协议",
    protocolCount: "{{count}}个协议",
    protocolCount_plural: "{{count}}个协议"
  },
  
  // Data Overview
  data: {
    title: "数据概览",
    totalRecords: "总记录数",
    recordsToday: "今日记录",
    recordsThisWeek: "本周记录",
    dataCompleteness: "数据完整性",
    validationStatus: "验证状态",
    qualityScore: "质量评分",
    lastSync: "上次同步",
    pendingValidation: "待验证",
    viewDataManagement: "查看数据管理",
    importData: "导入数据",
    exportData: "导出数据"
  },
  
  // Analytics Summary
  analytics: {
    title: "分析",
    viewDashboard: "查看完整仪表板",
    keyMetrics: "关键指标",
    enrollment: "入组",
    retention: "保留率",
    completion: "完成率",
    adverseEvents: "不良事件",
    dataCollection: "数据收集",
    sitePerformance: "中心表现",
    generateReport: "生成报告",
    scheduleReport: "计划报告"
  },
  
  // Notifications
  notifications: {
    title: "通知",
    viewAll: "查看所有通知",
    markAllRead: "全部标记为已读",
    noNotifications: "无新通知",
    unreadCount: "{{count}}条未读",
    newComment: "{{item}}有新评论",
    reviewRequest: "{{item}}的审查请求",
    milestoneApproaching: "即将到来的里程碑：{{name}}",
    dataQualityAlert: "数据质量警报",
    collaboratorInvite: "协作者邀请",
    protocolApproved: "协议已批准",
    reportReady: "报告已准备好下载",
    systemUpdate: "系统更新可用"
  },
  
  // Tasks & Reminders
  tasks: {
    title: "任务与提醒",
    myTasks: "我的任务",
    assignedToMe: "分配给我",
    createdByMe: "我创建的",
    completed: "已完成",
    overdue: "已逾期",
    dueToday: "今日到期",
    dueThisWeek: "本周到期",
    noDueDate: "无截止日期",
    addTask: "添加任务",
    markComplete: "标记为完成",
    editTask: "编辑任务",
    deleteTask: "删除任务",
    assignTo: "分配给",
    priority: "优先级",
    high: "高",
    medium: "中",
    low: "低",
    noTasks: "未找到任务"
  },
  
  // Team & Collaboration
  team: {
    title: "团队",
    viewTeam: "查看团队",
    teamMembers: "团队成员",
    activeMembers: "活跃成员",
    pendingInvitations: "待处理邀请",
    inviteMember: "邀请成员",
    role: "角色",
    lastActive: "上次活跃",
    online: "在线",
    offline: "离线",
    viewProfile: "查看个人资料",
    sendMessage: "发送消息",
    removeFromTeam: "从团队移除"
  },
  
  // Calendar & Timeline
  calendar: {
    title: "日历",
    viewCalendar: "查看完整日历",
    upcomingEvents: "即将到来的事件",
    today: "今天",
    thisWeek: "本周",
    thisMonth: "本月",
    noEvents: "无计划事件",
    addEvent: "添加事件",
    milestone: "里程碑",
    meeting: "会议",
    deadline: "截止日期",
    visit: "研究访视",
    reminder: "提醒"
  },
  
  // Widgets
  widgets: {
    title: "小部件",
    addWidget: "添加小部件",
    removeWidget: "删除小部件",
    customizeLayout: "自定义布局",
    resetLayout: "重置为默认",
    saveLayout: "保存布局",
    protocolOverview: "协议概览",
    dataQuality: "数据质量",
    enrollment: "入组状态",
    milestones: "里程碑",
    recentActivity: "最近活动",
    teamActivity: "团队活动",
    quickStats: "快速统计",
    alerts: "警报"
  },
  
  // Search & Filters
  search: {
    title: "搜索",
    searchPlaceholder: "搜索协议、数据、报告...",
    recentSearches: "最近搜索",
    clearHistory: "清除历史",
    filters: "过滤器",
    filterBy: "过滤方式",
    sortBy: "排序方式",
    dateRange: "日期范围",
    status: "状态",
    owner: "所有者",
    type: "类型",
    clearFilters: "清除过滤器",
    applyFilters: "应用过滤器",
    noResults: "未找到结果",
    searchResults: "找到{{count}}个结果",
    searchResults_plural: "找到{{count}}个结果"
  },
  
  // Help & Support
  help: {
    title: "帮助与支持",
    documentation: "文档",
    tutorials: "教程",
    videoGuides: "视频指南",
    keyboardShortcuts: "键盘快捷键",
    contactSupport: "联系支持",
    reportIssue: "报告问题",
    featureRequest: "功能请求",
    whatsNew: "新功能",
    releaseNotes: "发布说明",
    communityForum: "社区论坛"
  },
  
  // User Menu
  user: {
    title: "账户",
    profile: "我的个人资料",
    settings: "设置",
    preferences: "偏好设置",
    language: "语言",
    theme: "主题",
    notifications: "通知设置",
    privacy: "隐私",
    security: "安全",
    billing: "账单",
    logout: "退出登录",
    darkMode: "深色模式",
    lightMode: "浅色模式",
    autoMode: "自动"
  },
  
  // Common Actions
  actions: {
    view: "查看",
    edit: "编辑",
    delete: "删除",
    share: "共享",
    export: "导出",
    duplicate: "复制",
    archive: "存档",
    restore: "恢复",
    refresh: "刷新",
    filter: "过滤",
    sort: "排序",
    search: "搜索",
    create: "创建",
    save: "保存",
    cancel: "取消",
    close: "关闭"
  },
  
  // Status Labels
  status: {
    active: "活跃",
    inactive: "不活跃",
    pending: "待处理",
    completed: "已完成",
    inProgress: "进行中",
    draft: "草稿",
    published: "已发布",
    archived: "已存档",
    approved: "已批准",
    rejected: "已拒绝",
    underReview: "审查中"
  },
  
  // Empty States
  empty: {
    noData: "无可用数据",
    noProjects: "未找到项目",
    noProtocols: "未找到协议",
    noActivity: "无最近活动",
    noNotifications: "无新通知",
    noTasks: "无分配的任务",
    noResults: "未找到结果",
    getStarted: "通过创建您的第一个{{item}}开始",
    createNew: "创建新{{item}}"
  },
  
  // Time & Dates
  time: {
    justNow: "刚刚",
    minutesAgo: "{{count}}分钟前",
    minutesAgo_plural: "{{count}}分钟前",
    hoursAgo: "{{count}}小时前",
    hoursAgo_plural: "{{count}}小时前",
    daysAgo: "{{count}}天前",
    daysAgo_plural: "{{count}}天前",
    weeksAgo: "{{count}}周前",
    weeksAgo_plural: "{{count}}周前",
    monthsAgo: "{{count}}个月前",
    monthsAgo_plural: "{{count}}个月前",
    yearsAgo: "{{count}}年前",
    yearsAgo_plural: "{{count}}年前"
  }
};