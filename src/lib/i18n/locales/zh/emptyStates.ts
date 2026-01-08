/**
 * Empty States Translation - Chinese
 * Centralized translations for all empty state screens
 */

export default {
  // === COMMON PRESETS ===
  
  // No Project Selected
  noProjectSelected: {
    title: "未选择项目",
    description: "从库中选择一个项目以查看其详细信息并管理您的研究数据。",
    action: "前往项目库"
  },
  
  // No Protocols
  noProtocols: {
    title: "暂无协议",
    description: "创建您的第一个协议以定义研究变量、终点和数据收集工作流程。",
    action: "创建新协议"
  },
  
  // No Projects
  noProjects: {
    title: "暂无项目",
    description: "创建您的第一个项目以开始组织您的临床研究和试验数据。",
    action: "创建新项目"
  },
  
  // No Data
  noData: {
    title: "无可用数据",
    description: "通过设置数据库架构和导入记录开始收集数据。",
    action: "设置数据库"
  },
  
  // No Manuscripts
  noManuscripts: {
    title: "暂无手稿",
    description: "创建您的第一份手稿以开始撰写和格式化您的研究论文。",
    action: "创建新手稿"
  },
  
  // No Analytics
  noAnalytics: {
    title: "无可用分析",
    description: "在收集数据并定义统计终点后运行您的第一次分析。",
    action: "前往数据库"
  },
  
  // No IRB Submissions
  noIRBSubmissions: {
    title: "无IRB提交",
    description: "提交您的协议以进行伦理审查并跟踪审批流程。",
    action: "新提交"
  },
  
  // No Team Members
  noTeamMembers: {
    title: "无团队成员",
    description: "邀请协作者加入您的研究项目并管理团队角色。",
    action: "邀请团队成员"
  },
  
  // No AI Personas
  noPersonas: {
    title: "无活动的AI角色",
    description: "激活AI角色以获得协议验证和合规性方面的智能协助。",
    action: "浏览角色库"
  },
  
  // === SEARCH & FILTER STATES ===
  
  noSearchResults: {
    title: "未找到结果",
    description: "尝试调整您的搜索词或过滤器以找到您要查找的内容。",
    action: null
  },
  
  noFilterResults: {
    title: "无匹配项",
    description: "没有项目匹配您当前的过滤条件。尝试清除一些过滤器。",
    action: "清除过滤器"
  },
  
  // === LOADING & ERROR STATES ===
  
  loading: {
    title: "加载中...",
    description: "请稍候，我们正在获取您的数据。",
    action: null
  },
  
  error: {
    title: "出现问题",
    description: "加载此数据时遇到错误。请尝试刷新页面。",
    action: "刷新页面"
  },
  
  offline: {
    title: "您已离线",
    description: "离线时某些功能不可用。连接到互联网以同步您的数据。",
    action: "重试连接"
  },
  
  // === PERMISSION STATES ===
  
  noPermission: {
    title: "访问受限",
    description: "您无权查看此内容。请联系管理员以获取访问权限。",
    action: null
  },
  
  readOnlyMode: {
    title: "只读模式",
    description: "您可以查看此内容，但无法使用当前权限进行更改。",
    action: null
  },
  
  // === COMPLETION STATES ===
  
  allComplete: {
    title: "全部完成！",
    description: "您已完成本节中的所有项目。做得好！",
    action: null
  },
  
  emptyInbox: {
    title: "收件箱为空！",
    description: "您已全部处理完毕。没有待处理的通知或任务。",
    action: null
  },
  
  // === WORKFLOW-SPECIFIC STATES ===
  
  protocolWorkbench: {
    title: "选择协议",
    description: "从库中选择一个协议以开始编辑或创建一个新协议。",
    action: "前往协议库"
  },
  
  academicWriting: {
    title: "未选择手稿",
    description: "从您的库中选择一份手稿或创建一份新手稿以开始撰写。",
    action: "前往学术写作"
  },
  
  ethicsBoard: {
    title: "未选择提交",
    description: "选择IRB提交以查看详细信息并跟踪审批状态。",
    action: "前往伦理委员会"
  },
  
  database: {
    title: "未定义架构",
    description: "在输入或浏览数据之前，请先定义您的数据库架构。",
    action: "前往架构构建器"
  },
  
  analytics: {
    title: "未选择分析",
    description: "选择项目和数据集以开始统计分析。",
    action: "选择项目"
  }
};
