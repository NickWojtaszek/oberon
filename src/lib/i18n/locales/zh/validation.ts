export default {
  // === VALIDATION SYSTEM ===
  
  // Sidebar
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
  
  // Validation status
  status: {
    validating: "验证中...",
    validated: "已验证",
    noValidation: "未执行验证",
    lastValidated: "上次验证",
    runValidation: "运行验证",
    validationComplete: "验证完成",
    validationFailed: "验证失败"
  },
  
  // Export
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
  
  // Trends
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
  
  // Auto-fix
  autoFix: {
    title: "自动修复可用",
    description: "此问题可以自动修复",
    applyFix: "应用自动修复",
    applying: "应用修复中...",
    success: "修复应用成功",
    error: "修复应用失败",
    fixesApplied: "应用了{{count}}个修复",
    fixesApplied_plural: "应用了{{count}}个修复",
    confirmTitle: "确认自动修复",
    confirmMessage: "您确定要应用此修复吗？",
    confirmMultiple: "应用{{count}}个自动修复？",
    reviewChanges: "应用前审查更改"
  },
  
  // Messages
  messages: {
    notApplicable: "不适用于此研究类型",
    checklistComplete: "所有检查清单项目已完成",
    checklistIncomplete: "{{completed}}/{{total}}已完成"
  }
};
