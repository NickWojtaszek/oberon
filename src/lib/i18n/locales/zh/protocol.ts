export default {
  // === PROTOCOL WORKBENCH ===
  
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
    helpPlaceholder: "为此字段输入帮助文本"
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
    generate: "生成方案"
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
  }
};
