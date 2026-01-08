export default {
  // === PROTOCOL LIBRARY ===
  
  // Header
  header: {
    title: "协议库",
    description: "浏览和管理研究协议",
    newProtocol: "新建协议",
    importProtocol: "导入协议"
  },
  
  // View Controls
  viewControls: {
    gridView: "网格视图",
    listView: "列表视图",
    sortBy: "排序方式",
    filterBy: "筛选方式",
    showFilters: "显示筛选器",
    hideFilters: "隐藏筛选器"
  },
  
  // Sort Options
  sortOptions: {
    nameAsc: "名称 (A-Z)",
    nameDesc: "名称 (Z-A)",
    dateCreated: "创建日期",
    dateModified: "最后修改",
    studyType: "研究类型",
    status: "状态"
  },
  
  // Filter Options
  filters: {
    allProtocols: "所有协议",
    myProtocols: "我的协议",
    sharedWithMe: "与我共享",
    recentlyViewed: "最近查看",
    favorites: "收藏",
    studyType: "研究类型",
    status: "状态",
    phase: "阶段",
    therapeuticArea: "治疗领域",
    clearFilters: "清除所有筛选器"
  },
  
  // Study Types
  studyTypes: {
    all: "所有类型",
    rct: "随机对照试验",
    observational: "观察性研究",
    singleArm: "单臂研究",
    diagnostic: "诊断研究",
    registry: "登记研究",
    other: "其他"
  },
  
  // Status Options
  statusOptions: {
    all: "所有状态",
    draft: "草稿",
    inReview: "审核中",
    approved: "已批准",
    active: "活跃",
    completed: "已完成",
    archived: "已存档"
  },
  
  // Phase Options
  phaseOptions: {
    all: "所有阶段",
    phase1: "I期",
    phase2: "II期",
    phase3: "III期",
    phase4: "IV期",
    notApplicable: "不适用"
  },
  
  // Protocol Card
  card: {
    clickToOpen: "点击打开",
    current: "当前",
    created: "创建时间",
    modified: "修改时间",
    modifiedBy: "修改者",
    published: "发布时间",
    versions: "版本",
    versions_plural: "版本",
    viewOlderVersions: "查看 {{count}} 个旧版本",
    continueEditing: "继续编辑",
    publish: "发布",
    view: "查看",
    createNewVersion: "创建新版本",
    untitledProtocol: "[未命名协议]",
    noNumber: "[无编号]",
    // Status badges
    statusDraft: "草稿",
    statusPublished: "已发布",
    statusArchived: "已存档",
    // Legacy fields
    createdBy: "创建者",
    lastModified: "修改时间",
    studyType: "研究类型",
    phase: "阶段",
    status: "状态",
    participants: "参与者",
    endpoints: "终点",
    variables: "变量",
    version: "版本",
    open: "打开",
    edit: "编辑",
    duplicate: "复制",
    archive: "归档",
    delete: "删除",
    share: "分享",
    export: "导出",
    addToFavorites: "添加到收藏",
    removeFromFavorites: "从收藏中移除",
    viewDetails: "查看详情"
  },
  
  // Search
  search: {
    placeholder: "按名称、ID或关键词搜索协议...",
    noResults: "未找到协议",
    noResultsMessage: "尝试调整搜索或筛选条件",
    resultsCount: "找到 {{count}} 个协议",
    resultsCount_plural: "找到 {{count}} 个协议"
  },
  
  // Empty States
  emptyStates: {
    noProtocols: {
      title: "尚无协议",
      description: "通过创建第一个协议或导入现有协议开始。",
      actionCreate: "创建协议",
      actionImport: "导入协议"
    },
    noFavorites: {
      title: "无收藏",
      description: "收藏常用协议以便快速访问。",
      action: "浏览所有协议"
    },
    noShared: {
      title: "无共享协议",
      description: "团队成员与您共享的协议将显示在此处。",
      action: "浏览我的协议"
    },
    noRecent: {
      title: "无最近协议",
      description: "您最近查看的协议将显示在此处。",
      action: "浏览所有协议"
    }
  },
  
  // Actions
  actions: {
    createNew: "创建新协议",
    importFromFile: "从文件导入",
    importFromTemplate: "从模板导入",
    bulkActions: "批量操作",
    selectAll: "全选",
    deselectAll: "取消全选",
    archiveSelected: "存档选中项",
    deleteSelected: "删除选中项",
    exportSelected: "导出选中项"
  },
  
  // Create Protocol Modal
  createModal: {
    title: "创建新协议",
    protocolName: "协议名称",
    protocolNumber: "协议编号",
    studyType: "研究类型",
    phase: "阶段（可选）",
    therapeuticArea: "治疗领域（可选）",
    description: "描述（可选）",
    startFromTemplate: "从模板开始",
    startFromScratch: "从头开始",
    selectTemplate: "选择模板...",
    create: "创建协议",
    creating: "创建中..."
  },
  
  // Import Modal
  importModal: {
    title: "导入协议",
    uploadFile: "上传文件",
    dragAndDrop: "将协议文件拖放到此处",
    or: "或",
    browse: "浏览文件",
    supportedFormats: "支持的格式：JSON、XML、CSV",
    importing: "导入中...",
    importSuccess: "协议导入成功",
    importError: "协议导入失败"
  },
  
  // Delete Confirmation
  deleteConfirm: {
    title: "删除协议？",
    message: "确定要删除 \"{{name}}\" 吗？此操作无法撤消。",
    messageMultiple: "确定要删除 {{count}} 个协议吗？此操作无法撤消。",
    confirm: "删除协议",
    confirmMultiple: "删除 {{count}} 个协议",
    cancel: "取消",
    deleting: "删除中...",
    deleteSuccess: "协议删除成功",
    deleteSuccessMultiple: "成功删除 {{count}} 个协议",
    deleteError: "协议删除失败"
  },
  
  // Archive Confirmation
  archiveConfirm: {
    title: "存档协议？",
    message: "确定要存档 \"{{name}}\" 吗？",
    messageMultiple: "确定要存档 {{count}} 个协议吗？",
    confirm: "存档协议",
    confirmMultiple: "存档 {{count}} 个协议",
    cancel: "取消",
    archiving: "存档中...",
    archiveSuccess: "协议存档成功",
    archiveSuccessMultiple: "成功存档 {{count}} 个协议",
    archiveError: "协议存档失败"
  },
  
  // Duplicate Modal
  duplicateModal: {
    title: "复制协议",
    newName: "新协议名称",
    copyData: "复制方案数据",
    copySettings: "复制设置",
    duplicate: "复制",
    duplicating: "复制中...",
    duplicateSuccess: "协议复制成功",
    duplicateError: "协议复制失败"
  },
  
  // Share Modal
  shareModal: {
    title: "共享协议",
    shareWith: "共享给",
    addPeople: "添加人员或团队...",
    permissions: "权限",
    canView: "可查看",
    canEdit: "可编辑",
    canAdmin: "可管理",
    sendNotification: "发送电子邮件通知",
    share: "共享",
    sharing: "共享中...",
    shareSuccess: "协议共享成功",
    shareError: "协议共享失败",
    currentlySharedWith: "当前共享给",
    removeAccess: "移除访问权限"
  },
  
  // Export Options
  exportOptions: {
    title: "导出协议",
    format: "导出格式",
    formatJSON: "JSON（完整数据）",
    formatPDF: "PDF（文档）",
    formatCSV: "CSV（仅数据）",
    formatXML: "XML（标准）",
    includeSchema: "包含方案",
    includeData: "包含收集的数据",
    includeMetadata: "包含元数据",
    includeAttachments: "包含附件",
    export: "导出",
    exporting: "导出中...",
    exportSuccess: "协议导出成功",
    exportError: "协议导出失败"
  },
  
  // Metadata
  metadata: {
    protocolId: "协议ID",
    version: "版本",
    createdDate: "创建",
    modifiedDate: "最后修改",
    createdBy: "创建者",
    modifiedBy: "最后修改者",
    studyType: "研究类型",
    phase: "阶段",
    therapeuticArea: "治疗领域",
    targetEnrollment: "目标入组",
    primaryEndpoint: "主要终点",
    duration: "研究持续时间",
    sites: "研究中心",
    tags: "标签"
  }
};