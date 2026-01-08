export default {
  // === DATA MANAGEMENT MODULE ===
  
  // Main Header
  header: {
    title: "数据管理",
    subtitle: "导入、导出和转换临床数据",
    description: "使用企业级工具管理您的临床数据"
  },
  
  // Tab Navigation
  tabs: {
    import: "导入",
    export: "导出",
    transform: "转换",
    quality: "数据质量",
    history: "历史记录",
    schedule: "计划任务"
  },
  
  // === IMPORT SECTION ===
  import: {
    title: "导入数据",
    subtitle: "从外部源上传和导入临床数据",
    
    // Upload
    upload: {
      title: "上传文件",
      dragDrop: "拖放文件到此处，或点击浏览",
      browseFiles: "浏览文件",
      selectedFile: "已选文件",
      fileSize: "文件大小",
      fileType: "文件类型",
      removeFile: "移除文件",
      uploadAnother: "上传另一个文件",
      maxFileSize: "最大文件大小：{{size}}MB",
      supportedFormats: "支持的格式",
      formats: {
        csv: "CSV（逗号分隔值）",
        excel: "Excel（.xlsx, .xls）",
        json: "JSON（JavaScript对象表示法）",
        xml: "XML（可扩展标记语言）",
        sas: "SAS数据文件（.sas7bdat）",
        spss: "SPSS文件（.sav）",
        stata: "Stata文件（.dta）",
        txt: "文本文件（.txt, .dat）"
      }
    },
    
    // File Preview
    preview: {
      title: "文件预览",
      firstRows: "前{{count}}行",
      totalRows: "总行数",
      totalColumns: "总列数",
      encoding: "文件编码",
      delimiter: "分隔符",
      hasHeaders: "第一行包含标题",
      refreshPreview: "刷新预览",
      viewAll: "查看所有数据"
    },
    
    // Field Mapping
    mapping: {
      title: "字段映射",
      subtitle: "将源字段映射到协议方案",
      autoMap: "自动映射字段",
      clearMapping: "清除所有映射",
      sourceField: "源字段",
      targetField: "目标字段（协议方案）",
      dataType: "数据类型",
      transformation: "转换",
      selectTarget: "选择目标字段...",
      selectTransformation: "选择转换...",
      unmappedFields: "未映射字段",
      mappedFields: "已映射字段",
      requiredFields: "必填字段",
      optionalFields: "可选字段",
      ignoredFields: "忽略字段",
      mappingStatus: "映射状态",
      complete: "已映射{{mapped}}/{{total}}个必填字段",
      suggestions: "映射建议",
      applySuggestion: "应用建议",
      confidence: "置信度：{{percent}}%"
    },
    
    // Transformations
    transformations: {
      none: "无转换",
      trim: "修剪空格",
      uppercase: "转换为大写",
      lowercase: "转换为小写",
      titleCase: "转换为标题格式",
      parseDate: "解析为日期",
      parseNumber: "解析为数字",
      parseBoolean: "解析为布尔值",
      split: "拆分字符串",
      concatenate: "连接值",
      lookup: "从表查找",
      calculate: "计算值",
      custom: "自定义转换"
    },
    
    // Validation
    validation: {
      title: "验证规则",
      subtitle: "为导入的数据定义验证规则",
      addRule: "添加验证规则",
      rule: "规则",
      condition: "条件",
      errorMessage: "错误消息",
      warningMessage: "警告消息",
      skipInvalid: "跳过无效记录",
      flagInvalid: "标记无效记录以供审查",
      rejectInvalid: "如果发现无效记录则拒绝文件",
      validationResults: "验证结果",
      passed: "通过",
      failed: "失败",
      warnings: "警告",
      errors: "错误",
      viewDetails: "查看详情"
    },
    
    // Import Options
    options: {
      title: "导入选项",
      importMode: "导入模式",
      append: "追加到现有数据",
      appendDesc: "将新记录添加到现有数据集",
      replace: "替换现有数据",
      replaceDesc: "删除现有数据并导入新数据",
      update: "更新现有记录",
      updateDesc: "基于键字段更新记录",
      upsert: "Upsert（更新或插入）",
      upsertDesc: "如果存在则更新，如果是新的则插入",
      keyField: "匹配键字段",
      selectKeyField: "选择键字段...",
      duplicateHandling: "重复处理",
      skipDuplicates: "跳过重复",
      overwriteDuplicates: "覆盖重复",
      flagDuplicates: "标记重复以供审查",
      errorHandling: "错误处理",
      stopOnError: "遇到第一个错误时停止",
      continueOnError: "遇到错误时继续",
      rollbackOnError: "遇到错误时全部回滚",
      batchSize: "批量大小",
      batchSizeHint: "一次处理的记录数"
    },
    
    // Progress
    progress: {
      title: "导入进度",
      preparing: "准备导入...",
      uploading: "上传文件...",
      validating: "验证数据...",
      transforming: "转换数据...",
      importing: "导入记录...",
      completed: "导入完成",
      failed: "导入失败",
      recordsProcessed: "已处理记录",
      recordsImported: "已导入记录",
      recordsSkipped: "已跳过记录",
      recordsFailed: "失败记录",
      estimatedTime: "预计剩余时间",
      elapsedTime: "已用时间",
      cancel: "取消导入",
      cancelConfirm: "确定要取消此导入吗？"
    },
    
    // Summary
    summary: {
      title: "导入摘要",
      success: "导入成功完成",
      partial: "导入完成但有警告",
      failure: "导入失败",
      totalRecords: "总记录数",
      successfulRecords: "成功",
      failedRecords: "失败",
      skippedRecords: "跳过",
      warningRecords: "警告",
      duration: "持续时间",
      downloadLog: "下载导入日志",
      downloadErrors: "下载错误报告",
      viewImportedData: "查看导入的数据",
      importAnother: "导入另一个文件",
      done: "完成"
    }
  },
  
  // === EXPORT SECTION ===
  export: {
    title: "导出数据",
    subtitle: "将临床数据导出为外部格式",
    
    // Data Selection
    selection: {
      title: "选择要导出的数据",
      protocol: "协议",
      selectProtocol: "选择协议...",
      allProtocols: "所有协议",
      version: "版本",
      selectVersion: "选择版本...",
      dateRange: "日期范围",
      fromDate: "起始日期",
      toDate: "结束日期",
      allDates: "所有日期",
      records: "记录",
      allRecords: "所有记录",
      selectedRecords: "仅选定记录",
      filteredRecords: "过滤记录",
      recordCount: "已选择{{count}}条记录",
      recordCount_plural: "已选择{{count}}条记录"
    },
    
    // Field Selection
    fields: {
      title: "选择字段",
      selectAll: "全选",
      deselectAll: "取消全选",
      selectedFields: "已选字段",
      availableFields: "可用字段",
      requiredFields: "必填字段",
      fieldGroups: "字段组",
      demographics: "人口统计学",
      vitals: "生命体征",
      laboratory: "实验室",
      adverseEvents: "不良事件",
      medications: "药物",
      procedures: "程序",
      assessments: "评估",
      custom: "自定义字段"
    },
    
    // Format Options
    format: {
      title: "导出格式",
      selectFormat: "选择格式...",
      csv: "CSV（逗号分隔）",
      excel: "Excel工作簿（.xlsx）",
      json: "JSON（结构化数据）",
      xml: "XML（可扩展标记）",
      sas: "SAS传输（.xpt）",
      spss: "SPSS（.sav）",
      stata: "Stata（.dta）",
      pdf: "PDF报告",
      customFormat: "自定义格式模板",
      formatOptions: "格式选项",
      includeHeaders: "包含列标题",
      includeMetadata: "包含元数据表",
      includeCodebook: "包含数据代码本",
      dateFormat: "日期格式",
      numberFormat: "数字格式",
      missingValue: "缺失值指示符",
      encoding: "字符编码",
      compression: "压缩输出文件"
    },
    
    // Filters
    filters: {
      title: "应用过滤器",
      addFilter: "添加过滤器",
      field: "字段",
      operator: "运算符",
      value: "值",
      equals: "等于",
      notEquals: "不等于",
      greaterThan: "大于",
      lessThan: "小于",
      contains: "包含",
      startsWith: "开始于",
      endsWith: "结束于",
      between: "介于",
      in: "在列表中",
      isNull: "为空",
      isNotNull: "不为空",
      and: "且",
      or: "或",
      removeFilter: "移除过滤器",
      clearAllFilters: "清除所有过滤器"
    },
    
    // Preview
    preview: {
      title: "导出预览",
      previewData: "预览数据",
      sampleRows: "样本{{count}}行",
      estimatedSize: "预计文件大小",
      estimatedRecords: "预计记录数",
      refreshPreview: "刷新预览"
    },
    
    // Progress
    progress: {
      title: "导出进度",
      preparing: "准备导出...",
      querying: "查询数据...",
      formatting: "格式化数据...",
      generating: "生成文件...",
      compressing: "压缩文件...",
      completed: "导出完成",
      failed: "导出失败",
      recordsExported: "已导出记录",
      fileSize: "文件大小",
      cancel: "取消导出"
    },
    
    // Download
    download: {
      title: "下载导出",
      ready: "您的导出已准备就绪",
      fileName: "文件名",
      fileSize: "文件大小",
      expiresIn: "{{hours}}小时后过期",
      downloadNow: "立即下载",
      downloadLink: "下载链接",
      copyLink: "复制链接",
      linkCopied: "链接已复制到剪贴板",
      emailLink: "通过电子邮件发送下载链接",
      exportAnother: "导出另一个数据集"
    }
  },
  
  // === TRANSFORM SECTION ===
  transform: {
    title: "数据转换",
    subtitle: "清理、规范化和派生新数据字段",
    
    // Transformation Types
    types: {
      clean: "数据清理",
      normalize: "规范化",
      derive: "派生变量",
      aggregate: "聚合",
      pivot: "透视/反透视",
      merge: "合并数据集"
    },
    
    // Cleaning
    cleaning: {
      title: "数据清理",
      removeDuplicates: "删除重复记录",
      trimWhitespace: "修剪空格",
      standardizeCase: "标准化大小写",
      fixDataTypes: "修复数据类型",
      handleMissing: "处理缺失值",
      removeOutliers: "删除异常值",
      validateRanges: "验证值范围",
      applyAll: "应用所有清理规则"
    },
    
    // Normalization
    normalization: {
      title: "数据规范化",
      standardize: "标准化值",
      categorize: "分类值",
      binning: "创建分箱/类别",
      scaling: "缩放数值",
      encoding: "编码分类值"
    },
    
    // Derived Variables
    derived: {
      title: "派生变量",
      addVariable: "添加派生变量",
      variableName: "变量名",
      formula: "公式/表达式",
      formulaPlaceholder: "输入公式...",
      useWizard: "使用公式向导",
      functions: "可用函数",
      testFormula: "测试公式",
      previewResults: "预览结果",
      saveVariable: "保存变量"
    },
    
    // Aggregation
    aggregation: {
      title: "数据聚合",
      groupBy: "分组依据",
      selectFields: "选择分组字段...",
      aggregations: "聚合",
      addAggregation: "添加聚合",
      function: "函数",
      sum: "求和",
      average: "平均值",
      count: "计数",
      min: "最小值",
      max: "最大值",
      median: "中位数",
      mode: "众数",
      stdDev: "标准差",
      variance: "方差"
    },
    
    // Preview
    preview: {
      title: "转换预览",
      before: "之前",
      after: "之后",
      affectedRecords: "受影响的记录",
      apply: "应用转换",
      revert: "撤销更改"
    }
  },
  
  // === DATA QUALITY SECTION ===
  quality: {
    title: "数据质量",
    subtitle: "评估和改进数据质量",
    
    // Quality Score
    score: {
      title: "质量评分",
      overall: "总体质量",
      completeness: "完整性",
      accuracy: "准确性",
      consistency: "一致性",
      validity: "有效性",
      timeliness: "及时性",
      excellent: "优秀",
      good: "良好",
      fair: "尚可",
      poor: "较差"
    },
    
    // Checks
    checks: {
      title: "质量检查",
      runChecks: "运行质量检查",
      runAll: "运行所有检查",
      lastRun: "上次运行",
      missingData: "缺失数据检查",
      duplicates: "重复记录检查",
      outliers: "异常值检测",
      consistency: "一致性检查",
      referential: "引用完整性",
      businessRules: "业务规则验证",
      passed: "通过",
      failed: "失败",
      warnings: "警告",
      viewReport: "查看报告"
    },
    
    // Issues
    issues: {
      title: "数据质量问题",
      severity: "严重程度",
      critical: "严重",
      major: "重要",
      minor: "次要",
      info: "信息",
      status: "状态",
      open: "打开",
      inProgress: "进行中",
      resolved: "已解决",
      ignored: "已忽略",
      assignedTo: "分配给",
      dueDate: "截止日期",
      resolveIssue: "解决问题",
      ignoreIssue: "忽略问题",
      bulkResolve: "批量解决",
      exportIssues: "导出问题"
    },
    
    // Reports
    reports: {
      title: "质量报告",
      generateReport: "生成报告",
      reportType: "报告类型",
      summary: "摘要报告",
      detailed: "详细报告",
      trend: "趋势分析",
      comparison: "比较报告",
      dateRange: "日期范围",
      downloadReport: "下载报告"
    }
  },
  
  // === HISTORY SECTION ===
  history: {
    title: "导入/导出历史",
    subtitle: "查看过去的数据操作",
    
    // Filters
    filters: {
      all: "所有操作",
      imports: "仅导入",
      exports: "仅导出",
      dateRange: "日期范围",
      status: "状态",
      user: "用户"
    },
    
    // List
    list: {
      operation: "操作",
      date: "日期",
      user: "用户",
      records: "记录",
      status: "状态",
      duration: "持续时间",
      actions: "操作",
      viewDetails: "查看详情",
      downloadFile: "下载文件",
      viewLog: "查看日志",
      rerun: "重新运行",
      delete: "删除"
    },
    
    // Details
    details: {
      title: "操作详情",
      operationId: "操作ID",
      startTime: "开始时间",
      endTime: "结束时间",
      parameters: "参数",
      results: "结果",
      logs: "日志",
      errors: "错误"
    },
    
    // Status
    status: {
      pending: "待处理",
      running: "运行中",
      completed: "已完成",
      failed: "失败",
      cancelled: "已取消",
      partialSuccess: "部分成功"
    }
  },
  
  // === SCHEDULED JOBS SECTION ===
  schedule: {
    title: "计划任务",
    subtitle: "自动化数据导入和导出操作",
    
    // Job List
    jobs: {
      addJob: "添加计划任务",
      editJob: "编辑任务",
      deleteJob: "删除任务",
      enableJob: "启用任务",
      disableJob: "禁用任务",
      runNow: "立即运行",
      jobName: "任务名称",
      schedule: "计划",
      lastRun: "上次运行",
      nextRun: "下次运行",
      status: "状态",
      enabled: "已启用",
      disabled: "已禁用"
    },
    
    // Job Configuration
    config: {
      title: "任务配置",
      jobName: "任务名称",
      jobNamePlaceholder: "输入任务名称...",
      description: "描述",
      descriptionPlaceholder: "描述此任务...",
      operation: "操作类型",
      import: "导入数据",
      export: "导出数据",
      transform: "转换数据",
      qualityCheck: "质量检查",
      schedule: "计划",
      frequency: "频率",
      daily: "每日",
      weekly: "每周",
      monthly: "每月",
      custom: "自定义（Cron）",
      time: "时间",
      timeZone: "时区",
      notifications: "通知",
      notifyOnSuccess: "成功时通知",
      notifyOnFailure: "失败时通知",
      recipients: "收件人",
      saveJob: "保存任务"
    },
    
    // Job History
    history: {
      title: "任务执行历史",
      executionDate: "执行日期",
      duration: "持续时间",
      status: "状态",
      records: "已处理记录",
      viewLog: "查看日志"
    }
  },
  
  // === COMMON ACTIONS ===
  actions: {
    upload: "上传",
    download: "下载",
    import: "导入",
    export: "导出",
    transform: "转换",
    validate: "验证",
    preview: "预览",
    apply: "应用",
    cancel: "取消",
    back: "返回",
    next: "下一步",
    finish: "完成",
    save: "保存",
    delete: "删除",
    close: "关闭",
    refresh: "刷新",
    retry: "重试"
  },
  
  // === COMMON MESSAGES ===
  messages: {
    uploadSuccess: "文件上传成功",
    uploadError: "文件上传失败",
    importSuccess: "数据导入成功",
    importError: "数据导入失败",
    exportSuccess: "数据导出成功",
    exportError: "数据导出失败",
    transformSuccess: "转换应用成功",
    transformError: "转换应用失败",
    validationSuccess: "验证通过",
    validationError: "验证失败",
    noDataSelected: "未选择数据",
    operationCancelled: "操作已取消",
    confirmDelete: "确定要删除吗？",
    unsavedChanges: "您有未保存的更改。是否继续？"
  }
};
