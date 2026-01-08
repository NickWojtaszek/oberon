export default {
  // === METHODOLOGY ENGINE MODULE ===
  
  // Main Header
  header: {
    title: "方法学引擎",
    subtitle: "AI驱动的研究设计与方法学生成",
    description: "通过智能推荐自动化您的研究方法学"
  },
  
  // Tab Navigation
  tabs: {
    generator: "方法学生成器",
    studyDesign: "研究设计",
    statistical: "统计计划",
    randomization: "随机化",
    sampleSize: "样本量",
    timeline: "研究时间线"
  },
  
  // === METHODOLOGY GENERATOR ===
  generator: {
    title: "AI方法学生成器",
    subtitle: "基于您的研究问题生成全面的方法学",
    
    // Input Section
    input: {
      title: "研究问题与目标",
      researchQuestion: "主要研究问题",
      researchQuestionPlaceholder: "您的主要研究问题是什么？",
      researchQuestionHint: "具体说明您想要调查的内容",
      primaryObjective: "主要目标",
      primaryObjectivePlaceholder: "您的研究的主要目标是什么？",
      secondaryObjectives: "次要目标",
      secondaryObjectivePlaceholder: "列出次要目标（可选）",
      addSecondaryObjective: "添加次要目标",
      studyContext: "研究背景",
      studyContextPlaceholder: "提供研究的背景和理由",
      targetPopulation: "目标人群",
      targetPopulationPlaceholder: "描述您想要研究的人群",
      intervention: "干预/暴露",
      interventionPlaceholder: "描述正在研究的干预或暴露",
      comparator: "对照/控制",
      comparatorPlaceholder: "参与者与什么进行比较？",
      primaryOutcome: "主要结局",
      primaryOutcomePlaceholder: "您将测量的主要结局是什么？",
      secondaryOutcomes: "次要结局",
      secondaryOutcomesPlaceholder: "列出次要结局",
      addSecondaryOutcome: "添加次要结局"
    },
    
    // Configuration
    config: {
      title: "方法学配置",
      studyType: "研究类型",
      selectStudyType: "选择研究类型...",
      interventional: "干预性",
      observational: "观察性",
      diagnostic: "诊断性",
      prognostic: "预后性",
      metaAnalysis: "荟萃分析",
      studyDesign: "研究设计",
      selectDesign: "选择设计...",
      rct: "随机对照试验",
      crossover: "交叉试验",
      cohort: "队列研究",
      caseControl: "病例对照研究",
      crossSectional: "横断面研究",
      beforeAfter: "前后研究",
      phase: "研究阶段",
      selectPhase: "选择阶段...",
      phaseI: "I期（安全性）",
      phaseII: "II期（有效性）",
      phaseIII: "III期（确证性）",
      phaseIV: "IV期（上市后）",
      blindingLevel: "盲法水平",
      selectBlinding: "选择盲法...",
      unblinded: "非盲/开放标签",
      singleBlind: "单盲",
      doubleBlind: "双盲",
      tripleBlind: "三盲",
      duration: "研究持续时间",
      durationPlaceholder: "例如，12个月，52周",
      followUp: "随访期",
      followUpPlaceholder: "例如，治疗后6个月"
    },
    
    // Generation
    generation: {
      generate: "生成方法学",
      regenerate: "重新生成",
      generating: "正在生成方法学...",
      analyzing: "分析研究问题...",
      designing: "设计研究结构...",
      planning: "规划统计方法...",
      optimizing: "优化方法学...",
      complete: "方法学生成完成",
      failed: "方法学生成失败",
      tryAgain: "重试"
    },
    
    // Results
    results: {
      title: "生成的方法学",
      overview: "概述",
      fullMethodology: "完整方法学",
      studyDesign: "研究设计",
      population: "人群与抽样",
      interventions: "干预与程序",
      outcomes: "结局指标",
      statistical: "统计分析",
      ethical: "伦理考虑",
      timeline: "研究时间线",
      limitations: "潜在局限性",
      export: "导出方法学",
      copyToProtocol: "复制到协议",
      copyToDocument: "复制到学术写作",
      saveTemplate: "保存为模板"
    },
    
    // Recommendations
    recommendations: {
      title: "AI推荐",
      studyDesignRec: "研究设计推荐",
      sampleSizeRec: "样本量推荐",
      statisticalRec: "统计分析推荐",
      improvementSuggestions: "方法学改进",
      qualityScore: "方法学质量评分",
      strengthScore: "研究设计强度",
      acceptRecommendation: "接受推荐",
      viewDetails: "查看详情",
      applyAll: "应用所有推荐"
    }
  },
  
  // === STUDY DESIGN ===
  studyDesign: {
    title: "研究设计向导",
    subtitle: "逐步配置您的研究设计",
    
    // Design Selection
    selection: {
      title: "选择研究设计",
      subtitle: "为您的研究问题选择最合适的设计",
      interventional: "干预性研究",
      interventionalDesc: "测试干预对结局的影响",
      observational: "观察性研究",
      observationalDesc: "在没有干预的情况下观察结局",
      diagnostic: "诊断性研究",
      diagnosticDesc: "评估诊断测试准确性",
      recommended: "为您的目标推荐",
      confidence: "置信度：{{percent}}%",
      whyRecommended: "为什么推荐这个？",
      selectDesign: "选择此设计"
    },
    
    // Design Configuration
    configuration: {
      title: "设计配置",
      arms: "研究组",
      addArm: "添加研究组",
      armName: "组名",
      armType: "组类型",
      experimental: "实验组",
      control: "对照组",
      activeComparator: "阳性对照",
      placebo: "安慰剂",
      sham: "假手术",
      noIntervention: "无干预",
      armDescription: "组描述",
      armSize: "目标入组人数",
      allocation: "分配",
      randomized: "随机化",
      nonRandomized: "非随机化",
      allocationRatio: "分配比例",
      stratification: "分层",
      addStratificationFactor: "添加分层因素",
      stratificationFactor: "分层因素",
      levels: "水平"
    },
    
    // Eligibility Criteria
    eligibility: {
      title: "入选标准",
      inclusionCriteria: "纳入标准",
      addInclusion: "添加纳入标准",
      exclusionCriteria: "排除标准",
      addExclusion: "添加排除标准",
      criterionPlaceholder: "输入标准...",
      ageRange: "年龄范围",
      minAge: "最小年龄",
      maxAge: "最大年龄",
      years: "岁",
      sex: "性别",
      all: "所有",
      male: "男性",
      female: "女性",
      healthyVolunteers: "健康志愿者",
      accepted: "接受",
      notAccepted: "不接受"
    },
    
    // Endpoints
    endpoints: {
      title: "研究终点",
      primaryEndpoint: "主要终点",
      addPrimaryEndpoint: "添加主要终点",
      secondaryEndpoints: "次要终点",
      addSecondaryEndpoint: "添加次要终点",
      exploratoryEndpoints: "探索性终点",
      addExploratoryEndpoint: "添加探索性终点",
      endpointName: "终点名称",
      endpointType: "终点类型",
      timepoint: "评估时间点",
      analysisMethod: "分析方法",
      efficacy: "疗效",
      safety: "安全性",
      pharmacokinetic: "药代动力学",
      pharmacodynamic: "药效动力学",
      qualityOfLife: "生活质量",
      biomarker: "生物标志物"
    },
    
    // Preview
    preview: {
      title: "设计预览",
      summary: "设计摘要",
      flowDiagram: "研究流程图",
      armsSummary: "研究组摘要",
      eligibilitySummary: "入选标准摘要",
      endpointsSummary: "终点摘要",
      saveDesign: "保存研究设计",
      exportDesign: "导出设计"
    }
  },
  
  // === STATISTICAL PLAN ===
  statistical: {
    title: "统计分析计划",
    subtitle: "定义您的统计方法",
    
    // Analysis Strategy
    strategy: {
      title: "分析策略",
      analysisPlan: "统计分析计划",
      primaryAnalysis: "主要分析",
      secondaryAnalysis: "次要分析",
      subgroupAnalysis: "亚组分析",
      sensitivityAnalysis: "敏感性分析",
      interimAnalysis: "中期分析",
      addAnalysis: "添加分析"
    },
    
    // Analysis Methods
    methods: {
      title: "分析方法",
      selectMethod: "选择统计方法...",
      descriptive: "描述性统计",
      tTest: "t检验",
      anova: "方差分析",
      regression: "回归分析",
      logistic: "逻辑回归",
      cox: "Cox比例风险模型",
      kaplanMeier: "Kaplan-Meier分析",
      chiSquare: "卡方检验",
      fisher: "Fisher精确检验",
      mannWhitney: "Mann-Whitney U检验",
      wilcoxon: "Wilcoxon符号秩检验",
      mcnemar: "McNemar检验",
      friedman: "Friedman检验",
      mixedModel: "混合效应模型"
    },
    
    // Hypothesis Testing
    hypothesis: {
      title: "假设检验",
      nullHypothesis: "零假设（H₀）",
      alternativeHypothesis: "备择假设（H₁）",
      hypothesisPlaceholder: "陈述您的假设...",
      testType: "检验类型",
      superiority: "优效性",
      nonInferiority: "非劣效性",
      equivalence: "等效性",
      significanceLevel: "显著性水平（α）",
      power: "统计功效（1-β）",
      effectSize: "预期效应量",
      tails: "尾数",
      oneTailed: "单侧",
      twoTailed: "双侧"
    },
    
    // Analysis Populations
    populations: {
      title: "分析人群",
      itt: "意向性分析（ITT）",
      ittDesc: "所有随机化受试者",
      pp: "符合方案集（PP）",
      ppDesc: "按方案完成的受试者",
      safety: "安全性人群",
      safetyDesc: "所有接受至少一次给药的受试者",
      modifiedItt: "改良ITT",
      modifiedIttDesc: "具有特定排除的ITT",
      selectPopulation: "为每个终点选择分析人群"
    },
    
    // Missing Data
    missingData: {
      title: "缺失数据处理",
      strategy: "缺失数据策略",
      completeCase: "完整病例分析",
      completeCaseDesc: "排除有缺失数据的受试者",
      lastObservation: "末次观测值结转（LOCF）",
      lastObservationDesc: "使用最后可用值",
      multipleImputation: "多重插补",
      multipleImputationDesc: "统计插补缺失值",
      mixedModel: "混合模型",
      mixedModelDesc: "在模型内处理缺失数据",
      worstCase: "最差情况插补",
      worstCaseDesc: "对缺失分配最差结果"
    },
    
    // Adjustments
    adjustments: {
      title: "统计调整",
      multipleComparisons: "多重比较调整",
      bonferroni: "Bonferroni校正",
      holm: "Holm-Bonferroni",
      benjaminiHochberg: "Benjamini-Hochberg (FDR)",
      none: "无调整",
      covariates: "协变量",
      addCovariate: "添加协变量",
      covariateName: "协变量名称",
      adjustmentMethod: "调整方法"
    }
  },
  
  // === RANDOMIZATION ===
  randomization: {
    title: "随机化方案",
    subtitle: "配置随机化和盲法程序",
    
    // Randomization Type
    type: {
      title: "随机化类型",
      simple: "简单随机化",
      simpleDesc: "纯随机分配（例如，抛硬币）",
      block: "区组随机化",
      blockDesc: "在区组内随机化以保持平衡",
      stratified: "分层随机化",
      stratifiedDesc: "在预后因素间平衡",
      adaptive: "适应性随机化",
      adaptiveDesc: "根据反应调整分配",
      minimization: "最小化",
      minimizationDesc: "最小化因素间的不平衡"
    },
    
    // Block Randomization
    block: {
      title: "区组随机化",
      blockSize: "区组大小",
      fixedBlock: "固定区组大小",
      variableBlock: "可变区组大小",
      blockSizes: "区组大小",
      blockSizesPlaceholder: "例如，4, 6, 8",
      allocationRatio: "分配比例",
      ratioPlaceholder: "例如，1:1, 2:1"
    },
    
    // Stratification
    stratification: {
      title: "分层",
      factors: "分层因素",
      addFactor: "添加分层因素",
      factorName: "因素名称",
      factorLevels: "因素水平",
      addLevel: "添加水平",
      balancing: "平衡算法",
      permutedBlock: "置换区组",
      dynamicAllocation: "动态分配"
    },
    
    // Blinding
    blinding: {
      title: "盲法程序",
      blindingLevel: "盲法水平",
      open: "开放标签（非盲）",
      openDesc: "所有各方知晓治疗",
      single: "单盲",
      singleDesc: "受试者设盲",
      double: "双盲",
      doubleDesc: "受试者和研究者设盲",
      triple: "三盲",
      tripleDesc: "受试者、研究者和评估者设盲",
      blindedParties: "设盲方",
      participants: "受试者",
      investigators: "研究者",
      outcomeAssessors: "结局评估者",
      dataAnalysts: "数据分析师",
      unblindingProcedure: "揭盲程序",
      unblindingPlaceholder: "描述紧急揭盲程序..."
    },
    
    // Implementation
    implementation: {
      title: "实施",
      randomizationSystem: "随机化系统",
      centralSystem: "中央随机化系统",
      siteSpecific: "中心特定随机化",
      ivrs: "交互式语音应答系统（IVRS）",
      iwrs: "交互式网络应答系统（IWRS）",
      envelopeMethod: "密封信封法",
      allocationConcealment: "分配隐藏",
      concealmentMethod: "隐藏方法",
      concealmentPlaceholder: "描述分配隐藏程序...",
      generateScheme: "生成随机化方案",
      downloadScheme: "下载随机化列表"
    }
  },
  
  // === SAMPLE SIZE ===
  sampleSize: {
    title: "样本量计算",
    subtitle: "确定您的研究所需的样本量",
    
    // Calculator
    calculator: {
      title: "样本量计算器",
      methodology: "统计方法",
      selectMethodology: "选择方法...",
      effectSize: "效应量",
      effectSizeHint: "组间预期差异",
      standardDeviation: "标准差",
      alpha: "Alpha（显著性水平）",
      alphaHint: "I类错误概率（通常为0.05）",
      power: "功效（1-Beta）",
      powerHint: "检测真实效应的概率（通常为0.80或0.90）",
      allocationRatio: "分配比例",
      tails: "尾数",
      oneTailed: "单侧",
      twoTailed: "双侧",
      attritionRate: "预期脱落率",
      attritionRateHint: "预期退出率（%）",
      calculate: "计算样本量",
      recalculate: "重新计算"
    },
    
    // Results
    results: {
      title: "样本量结果",
      requiredPerGroup: "所需样本量（每组）",
      totalRequired: "总所需样本量",
      withAttrition: "脱落调整后",
      totalWithAttrition: "脱落后总数",
      assumptions: "假设",
      effectSize: "效应量",
      power: "功效",
      alpha: "Alpha",
      allocationRatio: "分配比例",
      detailsReport: "详细样本量报告",
      saveCalculation: "保存计算",
      exportReport: "导出报告"
    },
    
    // Power Analysis
    powerAnalysis: {
      title: "功效分析",
      powerCurve: "功效曲线",
      sensitivityAnalysis: "敏感性分析",
      varyEffectSize: "变化效应量",
      varySampleSize: "变化样本量",
      varyAlpha: "变化Alpha",
      generateCurve: "生成功效曲线"
    }
  },
  
  // === STUDY TIMELINE ===
  timeline: {
    title: "研究时间线",
    subtitle: "规划您的研究进度和里程碑",
    
    // Timeline Builder
    builder: {
      title: "时间线构建器",
      addPhase: "添加研究阶段",
      addMilestone: "添加里程碑",
      phaseName: "阶段名称",
      startDate: "开始日期",
      endDate: "结束日期",
      duration: "持续时间",
      description: "描述",
      screening: "筛选",
      enrollment: "入组",
      treatment: "治疗",
      followUp: "随访",
      dataAnalysis: "数据分析",
      reporting: "报告"
    },
    
    // Visit Schedule
    visitSchedule: {
      title: "访视计划",
      addVisit: "添加研究访视",
      visitNumber: "访视编号",
      visitName: "访视名称",
      timepoint: "时间点",
      visitWindow: "访视窗口",
      procedures: "程序/评估",
      baseline: "基线",
      week: "周",
      month: "月",
      day: "天",
      endOfStudy: "研究结束",
      unscheduled: "计划外"
    },
    
    // Gantt Chart
    gantt: {
      title: "甘特图",
      viewGantt: "查看甘特图",
      exportGantt: "导出甘特图",
      phases: "阶段",
      milestones: "里程碑",
      today: "今天"
    }
  },
  
  // === COMMON ACTIONS ===
  actions: {
    generate: "生成",
    regenerate: "重新生成",
    save: "保存",
    export: "导出",
    cancel: "取消",
    back: "返回",
    next: "下一步",
    finish: "完成",
    calculate: "计算",
    recalculate: "重新计算",
    apply: "应用",
    preview: "预览",
    download: "下载"
  },
  
  // === COMMON MESSAGES ===
  messages: {
    generationSuccess: "方法学生成成功",
    generationError: "方法学生成失败",
    saveSuccess: "保存成功",
    saveError: "保存失败",
    calculationComplete: "计算完成",
    calculationError: "计算失败",
    invalidInput: "请检查您的输入",
    missingRequired: "请填写所有必填字段"
  }
};
