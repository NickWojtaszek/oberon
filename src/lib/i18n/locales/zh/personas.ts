export default {
  title: "AI角色",
  subtitle: "智能验证助手",
  managerTitle: "AI角色管理器",
  managerSubtitle: "{{active}}/{{total}} 个角色已激活",
  
  protocolAuditor: {
    name: "协议审核员",
    description: "AI驱动的协议文件验证、模式结构和交叉验证，以符合监管要求",
    scoreLabel: "合规性评分"
  },
  
  schemaArchitect: {
    name: "模式架构师",
    description: "研究类型特定的变量建议和模式结构验证",
    scoreLabel: "变量覆盖率"
  },
  
  statisticalAdvisor: {
    name: "统计方法顾问",
    description: "适合研究类型的统计方法和分析计划验证",
    scoreLabel: "统计严谨性评分"
  },
  
  dataQualitySentinel: {
    name: "数据质量监控",
    description: "实时数据验证、范围检查和逻辑一致性强制执行",
    scoreLabel: "数据质量评分"
  },
  
  ethicsCompliance: {
    name: "伦理与IRB合规AI",
    description: "IRB提交准备、知情同意验证和监管合规检查",
    scoreLabel: "伦理合规评分"
  },
  
  safetyVigilance: {
    name: "安全监控AI",
    description: "不良事件监测、SAE报告合规和安全信号检测",
    scoreLabel: "安全监测评分"
  },
  
  endpointValidator: {
    name: "临床终点验证器",
    description: "终点裁定支持和临床事件验证",
    scoreLabel: "终点质量评分"
  },
  
  amendmentAdvisor: {
    name: "协议修订顾问",
    description: "修订影响分析和监管分类指导",
    scoreLabel: "修订风险评估"
  },
  
  irbCompliance: {
    name: "IRB合规跟踪器",
    description: "验证IRB提交准备并确保所有必需的协议要素已记录",
    scoreLabel: "IRB合规评分"
  },
  
  status: {
    active: "活跃",
    inactive: "未激活",
    validating: "验证中...",
    ready: "就绪",
    required: "必需",
    optional: "可选"
  },
  
  actions: {
    enableAll: "启用全部",
    disableAll: "禁用非必需项",
    viewReport: "查看完整报告",
    exportReport: "导出报告",
    viewTrends: "查看趋势",
    configure: "配置"
  },
  
  configuration: {
    studyConfig: "研究配置",
    studyType: "研究类型",
    selectStudyType: "选择研究类型...",
    regulatoryFrameworks: "监管框架",
    language: "语言",
    selectLanguage: "选择语言..."
  },
  
  studyTypes: {
    rct: "随机对照试验 (RCT)",
    observational: "观察性研究",
    singleArm: "单臂研究",
    diagnostic: "诊断研究",
    registry: "注册研究 / 真实世界数据",
    phase1: "I期剂量探索",
    phase2: "II期疗效研究",
    phase3: "III期确证研究",
    phase4: "IV期上市后研究",
    medicalDevice: "医疗器械研究"
  },
  
  regulatoryFrameworks: {
    FDA: "FDA（美国）",
    EMA: "EMA（欧盟）",
    PMDA: "PMDA（日本）",
    "ICH-GCP": "ICH-GCP（国际）",
    HIPAA: "HIPAA（数据隐私）"
  },
  
  scores: {
    excellent: "优秀",
    good: "良好",
    fair: "一般",
    needsWork: "需要改进",
    critical: "关键问题",
    notScored: "未评分"
  },
  
  library: {
    title: "已验证的AI人格库",
    subtitle: "{{count}}个经过认证的人格可用于生产 • 所有配置均不可变且已审计",
    filterByType: "按类型筛选",
    sortBy: "排序依据：",
    createPersona: "创建人格",
    allPersonas: "所有人格",
    systemBuilt: "系统内置",
    nonEditable: "不可编辑",
    locked: "已锁定",
    validated: "已验证",
    platformCore: "平台核心",
    cloneToDraft: "克隆为草稿",
    cloning: "克隆中...",
    hideDetails: "隐藏详情",
    viewDetails: "查看详情",
    auditLog: "审计日志",
    exportPdf: "导出PDF",
    systemPersonasCannotBeCloned: "系统人格不能被克隆",
    configurationSnapshot: "配置快照",
    immutableRecord: "所有治理规则和政策的不可变记录",
    systemLevelGuardrail: "系统级保护",
    systemBuiltDescription: "此人格内置于平台中，为协议工作台中的统计逻辑层提供支持。它自动验证模式设计，强制执行临床标准（NIHSS、mRS、死亡率终点），阻止无效的统计测试，并生成不可变的审计跟踪以符合监管要求。",
    autoDetection: "自动检测",
    autoDetectionDescription: "NIHSS、mRS、死亡率终点、二元结果",
    validation: "验证",
    validationDescription: "统计测试兼容性、数据类型强制执行",
    interpretationRules: "解释规则",
    disallowedInferences: "不允许的推断",
    languageControls: "语言控制",
    tone: "语气",
    confidence: "置信度",
    neverWriteFullSections: "永不编写完整章节",
    noAnthropomorphism: "无拟人化",
    forbiddenPhrases: "禁用短语",
    outcomeFocus: "结果重点",
    primaryEndpoint: "主要终点",
    citationPolicy: "引用政策",
    mandatoryEvidence: "强制性证据",
    strength: "强度",
    scope: "范围",
    immutabilityWarning: "不可变记录",
    immutabilityDescription: "配置已被数据库RLS策略锁定。克隆以创建新的草稿版本。",
    noCertifiedPersonas: "无已认证人格",
    noCertifiedPersonasDescription: "在治理部分锁定并验证人格以将其认证用于生产。",
    lockedAt: "锁定于{{date}}",
    version: "版本{{version}}",
    clonedTo: "正在将'{{name}}'克隆为版本{{version}}草稿...",
    auditTimeline: "审计时间线",
    created: "已创建",
    validatedAction: "已验证",
    lockedForProduction: "已锁定用于生产",
    by: "由{{user}}",
    at: "在{{time}}"
  },
  
  types: {
    analysis: "分析与审查",
    statistical: "统计专家",
    writing: "学术写作",
    safety: "安全审查",
    validation: "模式验证"
  },
  
  tones: {
    socratic: "苏格拉底式提问",
    neutral: "中立观察者",
    academic: "学术正式"
  },
  
  confidenceLevels: {
    "1": "最大保留",
    "2": "保守",
    "3": "平衡",
    "4": "自信",
    "5": "确定"
  },
  
  citationStrengths: {
    "1": "宽松",
    "2": "适度",
    "3": "标准",
    "4": "严格",
    "5": "最高"
  },
  
  knowledgeBaseScopes: {
    currentProject: "当前项目",
    allProjects: "所有项目"
  },
  
  sortOptions: {
    name: "名称",
    date: "创建日期",
    type: "人格类型",
    version: "版本"
  },
  
  roles: {
    contributor: {
      name: "贡献者角色",
      description: "您可以创建和测试人格。使用\"请求验证\"提交给首席科学家审批。草稿阶段允许使用非正式名称。"
    },
    leadScientist: {
      name: "首席科学家角色",
      description: "您可以锁定人格用于生产环境。需要专业命名（5个以上字符）。可访问完整验证和模拟沙盒。"
    },
    admin: {
      name: "管理员角色",
      description: "完整系统访问权限，包括审计日志、版本历史和人格归档。可以覆盖已锁定的人格并管理所有用户。"
    }
  },
  
  guidance: {
    title: "人格指南",
    identity: {
      title: "身份与目的",
      description: "定义AI人格的核心身份和治疗重点。",
      tips: [
        "选择符合您验证需求的人格类型",
        "生产环境需要专业命名（5个以上字符）",
        "治疗领域和研究阶段会影响AI建议"
      ]
    },
    interpretation: {
      title: "解释规则",
      description: "控制AI可以和不可以推断的内容。",
      tips: [
        "为AI解释定义清晰的边界",
        "允许/禁止规则之间的冲突将阻止验证",
        "这些规则确保合规性和患者安全"
      ]
    },
    language: {
      title: "语言控制",
      description: "配置语气、置信度和写作限制。",
      tips: [
        "苏格拉底式语气鼓励批判性思维",
        "保守的置信度增加安全保障",
        "禁用短语确保合规语言"
      ]
    },
    outcome: {
      title: "结果重点",
      description: "指定主要终点和统计验证规则。",
      tips: [
        "主要终点必须匹配研究设计",
        "统计目标指导分析建议",
        "成功阈值必须具有临床意义"
      ]
    },
    citation: {
      title: "引用政策",
      description: "实施证据标准和来源要求。",
      tips: [
        "强制引用确保审计追踪",
        "同行评审来源增加科学严谨性",
        "最大未引用句子数防止推测"
      ]
    },
    validation: {
      title: "验证状态",
      description: "在锁定之前审查并解决验证错误。",
      tips: [
        "必须解决所有关键故障",
        "名称验证强制执行专业标准",
        "锁定创建不可变的审计记录"
      ]
    }
  }
};