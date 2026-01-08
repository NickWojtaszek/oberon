export default {
  // === GLOBAL HEADER ===
  globalHeader: {
    targetJournal: "目标期刊：",
    selectJournal: "选择期刊...",
    createCustomJournal: "创建自定义期刊",
    editGenericJournal: "编辑通用期刊默认设置",
    autonomy: {
      audit: "审计",
      coPilot: "协同驾驶",
      pilot: "驾驶",
      notAvailableForRole: "您的角色无法使用"
    },
    exportPackage: "导出包",
    runLogicCheck: "运行逻辑检查",
    processing: "处理中...",
    studyTypes: {
      unblinded: "非盲法",
      singleBlind: "单盲",
      doubleBlind: "双盲",
      tripleBlind: "三盲"
    }
  },

  // === NAVIGATION PANEL ===
  navigation: {
    researchFactory: "研究工厂",
    currentProject: "当前项目：",
    noProject: "未选择项目",
    
    // Navigation items
    dashboard: "仪表板",
    projectLibrary: "项目库",
    protocolLibrary: "协议库",
    aiPersonas: "AI人格",
    personaEditor: "人格编辑器",
    protocolWorkbench: "协议工作台",
    researchWizard: "研究向导",
    projectSetup: "项目设置",
    methodologyEngine: "方法论引擎",
    database: "数据库",
    analytics: "分析",
    academicWriting: "学术写作",
    dataManagement: "数据管理",
    governance: "治理",
    ethics: "伦理与IRB",
    
    // Navigation descriptions
    descriptions: {
      dashboard: "进度概览",
      projectLibrary: "浏览项目",
      protocolLibrary: "浏览协议",
      aiPersonas: "人格库",
      personaEditor: "创建和编辑人格",
      protocolWorkbench: "构建架构",
      researchWizard: "引导式研究设置",
      projectSetup: "团队与方法论",
      methodologyEngine: "自动化方法论生成",
      database: "架构和记录",
      analytics: "统计分析",
      academicWriting: "手稿编辑器",
      dataManagement: "导入/导出",
      governance: "访问控制",
      ethics: "IRB与合规"
    },
    
    // Navigation actions
    goToField: "转到字段",
    navigateToIssue: "导航至问题",
    backToList: "返回列表"
  },

  // === LANGUAGE SWITCHER ===
  language: {
    title: "界面语言",
    changeLanguage: "更改界面语言",
    autoSave: "语言偏好自动保存",
    english: "English",
    polish: "Polski",
    spanish: "Español",
    chinese: "中文"
  },

  // === PROTOCOL WORKBENCH ===
  protocolWorkbench: {
    // Main toolbar
    toolbar: {
      protocolLabel: "方案",
      versionLabel: "版本",
      exportSchema: "导出方案",
      backToLibrary: "返回库",
      saveDraft: "保存草稿",
      publish: "发布"
    },
    
    // Tab navigation
    tabs: {
      protocolDocument: "方案文档",
      schemaBuilder: "方案构建器",
      dependencies: "依赖关系",
      audit: "审计"
    },
    
    // Schema Editor
    schemaEditor: {
      emptyState: {
        title: "尚无方案块",
        description: "点击左侧库中的变量以开始构建您的方案。"
      }
    },
    
    // Variable Library
    variableLibrary: {
      title: "变量库",
      searchPlaceholder: "搜索变量...",
      noResults: "未找到变量"
    },
    
    // Settings Modal
    settingsModal: {
      title: "块设置",
      dataType: "数据类型",
      unit: "单位",
      unitPlaceholder: "输入单位",
      quickSelect: "快速选择...",
      minValue: "最小值",
      maxValue: "最大值",
      minPlaceholder: "最小",
      maxPlaceholder: "最大",
      clinicalRange: "临床范围",
      normalLow: "正常下限",
      normalHigh: "正常上限",
      critical: "危急值",
      options: "选项",
      addOption: "添加选项",
      optionPlaceholder: "选项",
      quickTemplates: "快速模板：",
      matrixRows: "矩阵行",
      addRow: "添加行",
      rowPlaceholder: "行",
      gridItems: "网格项（行）",
      gridCategories: "网格类别（列）",
      addItem: "添加项",
      addCategory: "添加类别",
      itemPlaceholder: "项",
      categoryPlaceholder: "类别",
      required: "必填",
      helpText: "帮助文本",
      helpPlaceholder: "为此字段输入帮助文本",
      saveChanges: "保存更改",
      cancel: "取消"
    },
    
    // Dependency Modal
    dependencyModal: {
      title: "依赖关系和逻辑链接",
      infoTitle: "什么是依赖关系？",
      infoDescription: "依赖关系定义变量之间的逻辑关系。如果此变量依赖于其他变量，则必须首先收集这些变量或在条件逻辑中使用。",
      currentDependencies: "当前依赖关系",
      noDependencies: "未设置依赖关系。此变量是独立的。",
      unknownVariable: "未知变量",
      addDependency: "添加依赖关系",
      noAvailableVariables: "没有其他可用变量可添加为依赖关系。",
      circularWarning: "会创建循环依赖",
      saveDependencies: "保存依赖关系",
      // Advanced modal (for future use)
      conditionalRules: "条件规则",
      addRule: "添加规则",
      condition: "条件",
      value: "值",
      then: "然后",
      action: "操作",
      targetVariable: "目标变量",
      operator: "运算符",
      equals: "等于",
      notEquals: "不等于",
      greaterThan: "大于",
      lessThan: "小于",
      contains: "包含",
      show: "显示",
      hide: "隐藏",
      require: "要求",
      setValue: "设置值",
      saveRules: "保存规则"
    },
    
    // Version Tag Modal
    versionTagModal: {
      title: "版本标签",
      versionTag: "版本标签",
      versionPlaceholder: "例如：v1.0, v2.1, 修订 3",
      quickSelect: "快速选择",
      tagColor: "标签颜色",
      preview: "预览",
      clearTag: "清除标签",
      saveTag: "保存标签"
    },
    
    // Schema Generator Modal
    schemaGeneratorModal: {
      title: "AI 方案生成器",
      description: "描述您的方案",
      descriptionPlaceholder: "描述您想在研究中测量的内容...",
      chooseTemplate: "选择模板",
      generating: "生成中...",
      generate: "生成方案",
      cancel: "取消"
    },
    
    // Pre-Publish Validation Modal
    prePublishModal: {
      cannotPublish: "无法发布方案",
      reviewRequired: "需要审查",
      readyToPublish: "准备发布",
      validationComplete: "AI治理验证完成",
      complianceScore: "合规评分",
      validationPassed: "验证通过",
      validationFailed: "验证失败",
      critical: "危急",
      mustResolve: "必须解决",
      warnings: "警告",
      reviewNeeded: "需要审查",
      info: "信息",
      suggestions: "建议",
      blockingIssues: "阻塞问题",
      approvalRequired: "需要 PI 批准",
      approvalDescription: "此方案在发布前需要主要研究者审查和批准。",
      viewAuditReport: "查看完整审计报告",
      acknowledgePublish: "确认并发布",
      publishProtocol: "发布方案",
      proceedAnyway: "仍然继续",
      fixIssues: "修复问题"
    },
    
    // Block Toolbar
    blockToolbar: {
      duplicate: "复制",
      versionTag: "版本标签",
      dependencies: "依赖关系",
      settings: "设置",
      remove: "删除"
    },
    
    // Configuration HUD
    configHUD: {
      role: "角色",
      endpointTier: "终点层级",
      analysisMethod: "分析方法",
      none: "无",
      primary: "主要",
      secondary: "次要",
      exploratory: "探索性",
      kaplanMeier: "Kaplan-Meier",
      frequency: "频率",
      tTest: "t检验",
      nonParametric: "非参数",
      chiSquare: "卡方"
    },
    
    // Schema Block
    schemaBlock: {
      section: "部分",
      items: "项"
    },
    
    // Protocol validation
    validation: {
      protocolTitleRequired: "保存前请输入方案标题和方案编号",
      loadFailed: "加载方案失败。可能已被删除。"
    },
    
    // Status badges
    status: {
      draft: "草稿",
      published: "已发布",
      archived: "已归档"
    }
  },

  // === ACADEMIC WRITING ===
  academic: {
    manuscript: {
      title: "手稿标题",
      abstract: "摘要",
      introduction: "引言",
      methods: "方法",
      results: "结果",
      discussion: "讨论",
      conclusions: "结论",
      references: "参考文献",
      acknowledgments: "致谢",
      appendices: "附录"
    },
    sections: {
      addSection: "添加章节",
      deleteSection: "删除章节",
      moveUp: "上移",
      moveDown: "下移",
      sectionTitle: "章节标题",
      sectionContent: "章节内容"
    },
    citations: {
      addCitation: "添加引用",
      editCitation: "编辑引用",
      deleteCitation: "删除引用",
      citationStyle: "引用样式",
      insertCitation: "插入引用",
      manageCitations: "管理引用",
      noCitations: "尚无引用"
    },
    export: {
      title: "导出手稿",
      exportPDF: "导出PDF",
      exportWord: "导出Word",
      exportLaTeX: "导出LaTeX",
      includeReferences: "包含参考文献",
      includeAppendices: "包含附录"
    },
    wordCount: {
      total: "总字数",
      abstract: "摘要字数",
      body: "正文字数",
      target: "目标"
    }
  },

  // === DATABASE MODULE ===
  database: {
    tabs: {
      schema: "架构",
      dataEntry: "数据录入",
      browser: "数据浏览器",
      query: "查询构建器",
      import: "导入"
    },
    schema: {
      tables: "表",
      addTable: "添加表",
      editTable: "编辑表",
      deleteTable: "删除表",
      columns: "列",
      addColumn: "添加列",
      columnName: "列名",
      columnType: "列类型",
      primaryKey: "主键",
      foreignKey: "外键"
    },
    dataEntry: {
      newRecord: "新记录",
      editRecord: "编辑记录",
      deleteRecord: "删除记录",
      saveRecord: "保存记录",
      recordSaved: "记录保存成功",
      recordDeleted: "记录删除成功"
    },
    browser: {
      filterRecords: "过滤记录",
      sortBy: "排序方式",
      recordsPerPage: "每页记录数",
      totalRecords: "总记录数",
      noRecords: "未找到记录"
    },
    query: {
      newQuery: "新查询",
      runQuery: "运行查询",
      saveQuery: "保存查询",
      queryResults: "查询结果",
      noResults: "无结果"
    }
  },

  // === ANALYTICS MODULE ===
  analytics: {
    dashboard: {
      title: "分析仪表板",
      overview: "概览",
      reports: "报告",
      visualizations: "可视化"
    },
    statistics: {
      descriptive: "描述性统计",
      inferential: "推断性统计",
      mean: "平均值",
      median: "中位数",
      mode: "众数",
      standardDeviation: "标准差",
      variance: "方差",
      range: "范围",
      confidence: "置信区间",
      pValue: "P值",
      significance: "显著性水平"
    },
    charts: {
      barChart: "柱状图",
      lineChart: "折线图",
      pieChart: "饼图",
      scatterPlot: "散点图",
      histogram: "直方图",
      boxPlot: "箱线图"
    },
    export: {
      exportResults: "导出结果",
      exportChart: "导出图表",
      exportTable: "导出表格"
    }
  },

  // === GOVERNANCE MODULE ===
  governance: {
    roles: {
      title: "角色与权限",
      addRole: "添加角色",
      editRole: "编辑角色",
      deleteRole: "删除角色",
      roleName: "角色名称",
      permissions: "权限"
    },
    users: {
      title: "用户管理",
      addUser: "添加用户",
      editUser: "编辑用户",
      deleteUser: "删除用户",
      userName: "用户名",
      userEmail: "电子邮件",
      userRole: "角色",
      active: "活跃",
      inactive: "非活跃"
    },
    audit: {
      title: "审计跟踪",
      action: "操作",
      user: "用户",
      timestamp: "时间戳",
      details: "详情",
      export: "导出审计日志"
    }
  },

  // === ETHICS & IRB ===
  ethics: {
    submissions: {
      title: "IRB提交",
      newSubmission: "新提交",
      editSubmission: "编辑提交",
      submissionStatus: "状态",
      submittedDate: "提交日期",
      approvalDate: "批准日期",
      statusPending: "待处理",
      statusApproved: "已批准",
      statusRejected: "已拒绝",
      statusRevisions: "需要修订"
    },
    documents: {
      consentForm: "知情同意书",
      protocol: "协议",
      investigatorBrochure: "研究者手册",
      amendments: "修正案",
      safetyReports: "安全报告"
    },
    compliance: {
      title: "合规跟踪",
      ichGCP: "ICH-GCP",
      gdpr: "GDPR",
      hipaa: "HIPAA",
      compliant: "合规",
      nonCompliant: "不合规",
      underReview: "审核中"
    }
  },

  // === EXISTING SECTIONS (preserved) ===
  sidebar: {
    noIssues: "未发现问题",
    issueCount: "{{count}}个问题",
    issueCount_plural: "{{count}}个问题",
    criticalIssues: "关键问题",
    warnings: "警告",
    informational: "信息性",
    recommendations: "建议",
    citation: "监管引用",
    autoFixAvailable: "自动修复可用",
    applyFix: "应用修复",
    location: "位置",
    module: "模块",
    tab: "选项卡",
    field: "字段",
    viewDetails: "查看详情",
    collapse: "折叠",
    expand: "展开"
  },
  
  validation: {
    validating: "验证中...",
    validated: "已验证",
    noValidation: "未执行验证",
    lastValidated: "上次验证",
    runValidation: "运行验证",
    validationComplete: "验证完成",
    validationFailed: "验证失败"
  },
  
  export: {
    title: "导出验证报告",
    format: "导出格式",
    formatPDF: "PDF (HTML)",
    formatJSON: "JSON",
    formatCSV: "CSV",
    options: "导出选项",
    includeRecommendations: "包含建议",
    includeCitations: "包含监管引用",
    filterBySeverity: "按严重性过滤",
    filterAll: "所有问题",
    filterCriticalWarning: "仅关键和警告",
    filterCriticalOnly: "仅关键",
    groupBy: "分组方式",
    groupBySeverity: "严重性",
    groupByPersona: "人格",
    groupByCategory: "类别",
    exportButton: "导出报告",
    exporting: "导出中...",
    exportSuccess: "报告导出成功",
    exportError: "报告导出失败"
  },
  
  trends: {
    title: "验证趋势",
    overallTrend: "总体趋势",
    personaTrends: "人格趋势",
    scoreImprovement: "分数改进",
    issueReduction: "问题减少",
    currentScore: "当前分数",
    previousScore: "先前分数",
    scoreChange: "分数变化",
    improving: "改善中",
    declining: "下降中",
    stable: "稳定",
    noData: "无趋势数据",
    snapshotCount: "{{count}}个快照",
    snapshotCount_plural: "{{count}}个快照",
    dateRange: "日期范围",
    compareVersions: "比较版本",
    version: "版本",
    selectVersion: "选择版本..."
  },
  
  autoFix: {
    title: "自动修复可用",
    description: "此问题可以自动修复",
    applyFix: "应用自动修复",
    applying: "应用修复中...",
    success: "修复应用成功",
    error: "修复应用失败",
    fixesApplied: "应用了{{count}}个修复",
    fixesApplied_plural: "应用了{{count}}个修",
    confirmTitle: "确认自动修复",
    confirmMessage: "您确定要应用此修复吗？",
    confirmMultiple: "应用{{count}}个自动修复？",
    reviewChanges: "应用前审查更改"
  },
  
  messages: {
    required: "此字段为必填项",
    invalid: "无效值",
    missing: "缺少信息",
    incomplete: "不完整",
    notApplicable: "不适用于此研究类型",
    checklistComplete: "所有检查清单项目已完成",
    checklistIncomplete: "{{completed}}/{{total}}已完成"
  }
};