export default {
  // === METHODOLOGY ENGINE MODULE ===
  
  // Main Header
  header: {
    title: "Motor de Metodología",
    subtitle: "Diseño de Estudios y Generación de Metodología Impulsada por IA",
    description: "Automatice su metodología de investigación con recomendaciones inteligentes"
  },
  
  // Tab Navigation
  tabs: {
    generator: "Generador de Metodología",
    studyDesign: "Diseño del Estudio",
    statistical: "Plan Estadístico",
    randomization: "Aleatorización",
    sampleSize: "Tamaño de Muestra",
    timeline: "Cronograma del Estudio"
  },
  
  // === METHODOLOGY GENERATOR ===
  generator: {
    title: "Generador de Metodología IA",
    subtitle: "Genere metodología integral basada en su pregunta de investigación",
    
    // Input Section
    input: {
      title: "Pregunta de Investigación y Objetivos",
      researchQuestion: "Pregunta de Investigación Principal",
      researchQuestionPlaceholder: "¿Cuál es su pregunta de investigación principal?",
      researchQuestionHint: "Sea específico sobre lo que quiere investigar",
      primaryObjective: "Objetivo Principal",
      primaryObjectivePlaceholder: "¿Cuál es el objetivo principal de su estudio?",
      secondaryObjectives: "Objetivos Secundarios",
      secondaryObjectivePlaceholder: "Liste los objetivos secundarios (opcional)",
      addSecondaryObjective: "Agregar Objetivo Secundario",
      studyContext: "Contexto del Estudio",
      studyContextPlaceholder: "Proporcione antecedentes y justificación del estudio",
      targetPopulation: "Población Objetivo",
      targetPopulationPlaceholder: "Describa la población que desea estudiar",
      intervention: "Intervención/Exposición",
      interventionPlaceholder: "Describa la intervención o exposición estudiada",
      comparator: "Comparador/Control",
      comparatorPlaceholder: "¿Con qué se comparan los participantes?",
      primaryOutcome: "Resultado Principal",
      primaryOutcomePlaceholder: "¿Cuál es el resultado principal que medirá?",
      secondaryOutcomes: "Resultados Secundarios",
      secondaryOutcomesPlaceholder: "Liste los resultados secundarios",
      addSecondaryOutcome: "Agregar Resultado Secundario"
    },
    
    // Configuration
    config: {
      title: "Configuración de Metodología",
      studyType: "Tipo de Estudio",
      selectStudyType: "Seleccionar tipo de estudio...",
      interventional: "Intervencional",
      observational: "Observacional",
      diagnostic: "Diagnóstico",
      prognostic: "Pronóstico",
      metaAnalysis: "Meta-Análisis",
      studyDesign: "Diseño del Estudio",
      selectDesign: "Seleccionar diseño...",
      rct: "Ensayo Controlado Aleatorizado",
      crossover: "Ensayo Cruzado",
      cohort: "Estudio de Cohorte",
      caseControl: "Estudio de Casos y Controles",
      crossSectional: "Estudio Transversal",
      beforeAfter: "Estudio Antes-Después",
      phase: "Fase del Estudio",
      selectPhase: "Seleccionar fase...",
      phaseI: "Fase I (Seguridad)",
      phaseII: "Fase II (Eficacia)",
      phaseIII: "Fase III (Confirmatorio)",
      phaseIV: "Fase IV (Post-Comercialización)",
      blindingLevel: "Nivel de Cegamiento",
      selectBlinding: "Seleccionar cegamiento...",
      unblinded: "No Cegado/Abierto",
      singleBlind: "Simple Ciego",
      doubleBlind: "Doble Ciego",
      tripleBlind: "Triple Ciego",
      duration: "Duración del Estudio",
      durationPlaceholder: "ej., 12 meses, 52 semanas",
      followUp: "Período de Seguimiento",
      followUpPlaceholder: "ej., 6 meses post-tratamiento"
    },
    
    // Generation
    generation: {
      generate: "Generar Metodología",
      regenerate: "Regenerar",
      generating: "Generando metodología...",
      analyzing: "Analizando pregunta de investigación...",
      designing: "Diseñando estructura del estudio...",
      planning: "Planificando enfoque estadístico...",
      optimizing: "Optimizando metodología...",
      complete: "Generación de metodología completada",
      failed: "Generación de metodología falló",
      tryAgain: "Intentar de Nuevo"
    },
    
    // Results
    results: {
      title: "Metodología Generada",
      overview: "Resumen",
      fullMethodology: "Metodología Completa",
      studyDesign: "Diseño del Estudio",
      population: "Población y Muestreo",
      interventions: "Intervenciones y Procedimientos",
      outcomes: "Medidas de Resultado",
      statistical: "Análisis Estadístico",
      ethical: "Consideraciones Éticas",
      timeline: "Cronograma del Estudio",
      limitations: "Limitaciones Potenciales",
      export: "Exportar Metodología",
      copyToProtocol: "Copiar al Protocolo",
      copyToDocument: "Copiar a Escritura Académica",
      saveTemplate: "Guardar como Plantilla"
    },
    
    // Recommendations
    recommendations: {
      title: "Recomendaciones de IA",
      studyDesignRec: "Recomendaciones de Diseño del Estudio",
      sampleSizeRec: "Recomendaciones de Tamaño de Muestra",
      statisticalRec: "Recomendaciones de Análisis Estadístico",
      improvementSuggestions: "Mejoras de Metodología",
      qualityScore: "Puntuación de Calidad de Metodología",
      strengthScore: "Fortaleza del Diseño del Estudio",
      acceptRecommendation: "Aceptar Recomendación",
      viewDetails: "Ver Detalles",
      applyAll: "Aplicar Todas las Recomendaciones"
    }
  },
  
  // === STUDY DESIGN ===
  studyDesign: {
    title: "Asistente de Diseño del Estudio",
    subtitle: "Configure su diseño del estudio paso a paso",
    
    // Design Selection
    selection: {
      title: "Seleccionar Diseño del Estudio",
      subtitle: "Elija el diseño más apropiado para su pregunta de investigación",
      interventional: "Estudios Intervencionistas",
      interventionalDesc: "Probar efectos de intervenciones en resultados",
      observational: "Estudios Observacionales",
      observationalDesc: "Observar resultados sin intervención",
      diagnostic: "Estudios Diagnósticos",
      diagnosticDesc: "Evaluar precisión de pruebas diagnósticas",
      recommended: "Recomendado para sus objetivos",
      confidence: "Confianza: {{percent}}%",
      whyRecommended: "¿Por qué se recomienda esto?",
      selectDesign: "Seleccionar Este Diseño"
    },
    
    // Design Configuration
    configuration: {
      title: "Configuración del Diseño",
      arms: "Brazos del Estudio",
      addArm: "Agregar Brazo del Estudio",
      armName: "Nombre del Brazo",
      armType: "Tipo de Brazo",
      experimental: "Experimental",
      control: "Control",
      activeComparator: "Comparador Activo",
      placebo: "Placebo",
      sham: "Simulado",
      noIntervention: "Sin Intervención",
      armDescription: "Descripción del Brazo",
      armSize: "Inscripción Objetivo",
      allocation: "Asignación",
      randomized: "Aleatorizado",
      nonRandomized: "No Aleatorizado",
      allocationRatio: "Razón de Asignación",
      stratification: "Estratificación",
      addStratificationFactor: "Agregar Factor de Estratificación",
      stratificationFactor: "Factor de Estratificación",
      levels: "Niveles"
    },
    
    // Eligibility Criteria
    eligibility: {
      title: "Criterios de Elegibilidad",
      inclusionCriteria: "Criterios de Inclusión",
      addInclusion: "Agregar Criterio de Inclusión",
      exclusionCriteria: "Criterios de Exclusión",
      addExclusion: "Agregar Criterio de Exclusión",
      criterionPlaceholder: "Ingresar criterio...",
      ageRange: "Rango de Edad",
      minAge: "Edad Mínima",
      maxAge: "Edad Máxima",
      years: "años",
      sex: "Sexo",
      all: "Todos",
      male: "Masculino",
      female: "Femenino",
      healthyVolunteers: "Voluntarios Sanos",
      accepted: "Aceptados",
      notAccepted: "No Aceptados"
    },
    
    // Endpoints
    endpoints: {
      title: "Puntos Finales del Estudio",
      primaryEndpoint: "Punto Final Primario",
      addPrimaryEndpoint: "Agregar Punto Final Primario",
      secondaryEndpoints: "Puntos Finales Secundarios",
      addSecondaryEndpoint: "Agregar Punto Final Secundario",
      exploratoryEndpoints: "Puntos Finales Exploratorios",
      addExploratoryEndpoint: "Agregar Punto Final Exploratorio",
      endpointName: "Nombre del Punto Final",
      endpointType: "Tipo de Punto Final",
      timepoint: "Momento de Evaluación",
      analysisMethod: "Método de Análisis",
      efficacy: "Eficacia",
      safety: "Seguridad",
      pharmacokinetic: "Farmacocinético",
      pharmacodynamic: "Farmacodinámico",
      qualityOfLife: "Calidad de Vida",
      biomarker: "Biomarcador"
    },
    
    // Preview
    preview: {
      title: "Vista Previa del Diseño",
      summary: "Resumen del Diseño",
      flowDiagram: "Diagrama de Flujo del Estudio",
      armsSummary: "Resumen de Brazos del Estudio",
      eligibilitySummary: "Resumen de Elegibilidad",
      endpointsSummary: "Resumen de Puntos Finales",
      saveDesign: "Guardar Diseño del Estudio",
      exportDesign: "Exportar Diseño"
    }
  },
  
  // === STATISTICAL PLAN ===
  statistical: {
    title: "Plan de Análisis Estadístico",
    subtitle: "Defina su enfoque estadístico",
    
    // Analysis Strategy
    strategy: {
      title: "Estrategia de Análisis",
      analysisPlan: "Plan de Análisis Estadístico",
      primaryAnalysis: "Análisis Primario",
      secondaryAnalysis: "Análisis Secundario",
      subgroupAnalysis: "Análisis de Subgrupos",
      sensitivityAnalysis: "Análisis de Sensibilidad",
      interimAnalysis: "Análisis Intermedio",
      addAnalysis: "Agregar Análisis"
    },
    
    // Analysis Methods
    methods: {
      title: "Métodos de Análisis",
      selectMethod: "Seleccionar método estadístico...",
      descriptive: "Estadísticas Descriptivas",
      tTest: "Prueba t",
      anova: "ANOVA",
      regression: "Análisis de Regresión",
      logistic: "Regresión Logística",
      cox: "Riesgos Proporcionales de Cox",
      kaplanMeier: "Análisis de Kaplan-Meier",
      chiSquare: "Prueba de Chi-Cuadrado",
      fisher: "Prueba Exacta de Fisher",
      mannWhitney: "Prueba U de Mann-Whitney",
      wilcoxon: "Prueba de Rango Signado de Wilcoxon",
      mcnemar: "Prueba de McNemar",
      friedman: "Prueba de Friedman",
      mixedModel: "Modelo de Efectos Mixtos"
    },
    
    // Hypothesis Testing
    hypothesis: {
      title: "Prueba de Hipótesis",
      nullHypothesis: "Hipótesis Nula (H₀)",
      alternativeHypothesis: "Hipótesis Alternativa (H₁)",
      hypothesisPlaceholder: "Enunciar su hipótesis...",
      testType: "Tipo de Prueba",
      superiority: "Superioridad",
      nonInferiority: "No Inferioridad",
      equivalence: "Equivalencia",
      significanceLevel: "Nivel de Significancia (α)",
      power: "Poder Estadístico (1-β)",
      effectSize: "Tamaño del Efecto Esperado",
      tails: "Colas",
      oneTailed: "Una Cola",
      twoTailed: "Dos Colas"
    },
    
    // Analysis Populations
    populations: {
      title: "Poblaciones de Análisis",
      itt: "Intención de Tratar (ITT)",
      ittDesc: "Todos los participantes aleatorizados",
      pp: "Por Protocolo (PP)",
      ppDesc: "Participantes que completaron según protocolo",
      safety: "Población de Seguridad",
      safetyDesc: "Todos los participantes que recibieron al menos una dosis",
      modifiedItt: "ITT Modificado",
      modifiedIttDesc: "ITT con exclusiones específicas",
      selectPopulation: "Seleccionar población de análisis para cada punto final"
    },
    
    // Missing Data
    missingData: {
      title: "Manejo de Datos Faltantes",
      strategy: "Estrategia de Datos Faltantes",
      completeCase: "Análisis de Casos Completos",
      completeCaseDesc: "Excluir participantes con datos faltantes",
      lastObservation: "Última Observación Llevada Adelante (LOCF)",
      lastObservationDesc: "Usar último valor disponible",
      multipleImputation: "Imputación Múltiple",
      multipleImputationDesc: "Imputar valores faltantes estadísticamente",
      mixedModel: "Modelo Mixto",
      mixedModelDesc: "Manejar datos faltantes dentro del modelo",
      worstCase: "Imputación del Peor Caso",
      worstCaseDesc: "Asignar peor resultado a faltantes"
    },
    
    // Adjustments
    adjustments: {
      title: "Ajustes Estadísticos",
      multipleComparisons: "Ajuste de Comparaciones Múltiples",
      bonferroni: "Corrección de Bonferroni",
      holm: "Holm-Bonferroni",
      benjaminiHochberg: "Benjamini-Hochberg (FDR)",
      none: "Sin Ajuste",
      covariates: "Covariables",
      addCovariate: "Agregar Covariable",
      covariateName: "Nombre de Covariable",
      adjustmentMethod: "Método de Ajuste"
    }
  },
  
  // === RANDOMIZATION ===
  randomization: {
    title: "Esquema de Aleatorización",
    subtitle: "Configure procedimientos de aleatorización y cegamiento",
    
    // Randomization Type
    type: {
      title: "Tipo de Aleatorización",
      simple: "Aleatorización Simple",
      simpleDesc: "Asignación aleatoria pura (ej., lanzamiento de moneda)",
      block: "Aleatorización por Bloques",
      blockDesc: "Aleatorizar dentro de bloques para mantener equilibrio",
      stratified: "Aleatorización Estratificada",
      stratifiedDesc: "Equilibrio entre factores pronósticos",
      adaptive: "Aleatorización Adaptativa",
      adaptiveDesc: "Ajustar asignación basada en respuestas",
      minimization: "Minimización",
      minimizationDesc: "Minimizar desequilibrio entre factores"
    },
    
    // Block Randomization
    block: {
      title: "Aleatorización por Bloques",
      blockSize: "Tamaño del Bloque",
      fixedBlock: "Tamaño de Bloque Fijo",
      variableBlock: "Tamaños de Bloque Variables",
      blockSizes: "Tamaños de Bloque",
      blockSizesPlaceholder: "ej., 4, 6, 8",
      allocationRatio: "Razón de Asignación",
      ratioPlaceholder: "ej., 1:1, 2:1"
    },
    
    // Stratification
    stratification: {
      title: "Estratificación",
      factors: "Factores de Estratificación",
      addFactor: "Agregar Factor de Estratificación",
      factorName: "Nombre del Factor",
      factorLevels: "Niveles del Factor",
      addLevel: "Agregar Nivel",
      balancing: "Algoritmo de Equilibrio",
      permutedBlock: "Bloque Permutado",
      dynamicAllocation: "Asignación Dinámica"
    },
    
    // Blinding
    blinding: {
      title: "Procedimientos de Cegamiento",
      blindingLevel: "Nivel de Cegamiento",
      open: "Abierto (No Cegado)",
      openDesc: "Todas las partes conscientes del tratamiento",
      single: "Simple Ciego",
      singleDesc: "Participantes cegados",
      double: "Doble Ciego",
      doubleDesc: "Participantes e investigadores cegados",
      triple: "Triple Ciego",
      tripleDesc: "Participantes, investigadores y evaluadores cegados",
      blindedParties: "Partes Cegadas",
      participants: "Participantes",
      investigators: "Investigadores",
      outcomeAssessors: "Evaluadores de Resultados",
      dataAnalysts: "Analistas de Datos",
      unblindingProcedure: "Procedimiento de Descegamiento",
      unblindingPlaceholder: "Describir procedimientos de descegamiento de emergencia..."
    },
    
    // Implementation
    implementation: {
      title: "Implementación",
      randomizationSystem: "Sistema de Aleatorización",
      centralSystem: "Sistema de Aleatorización Central",
      siteSpecific: "Aleatorización Específica del Sitio",
      ivrs: "Sistema de Respuesta de Voz Interactiva (IVRS)",
      iwrs: "Sistema de Respuesta Web Interactiva (IWRS)",
      envelopeMethod: "Método de Sobre Sellado",
      allocationConcealment: "Ocultación de la Asignación",
      concealmentMethod: "Método de Ocultación",
      concealmentPlaceholder: "Describir procedimientos de ocultación de asignación...",
      generateScheme: "Generar Esquema de Aleatorización",
      downloadScheme: "Descargar Lista de Aleatorización"
    }
  },
  
  // === SAMPLE SIZE ===
  sampleSize: {
    title: "Cálculo del Tamaño de Muestra",
    subtitle: "Determine el tamaño de muestra requerido para su estudio",
    
    // Calculator
    calculator: {
      title: "Calculadora de Tamaño de Muestra",
      methodology: "Metodología Estadística",
      selectMethodology: "Seleccionar metodología...",
      effectSize: "Tamaño del Efecto",
      effectSizeHint: "Diferencia esperada entre grupos",
      standardDeviation: "Desviación Estándar",
      alpha: "Alfa (Nivel de Significancia)",
      alphaHint: "Probabilidad de error tipo I (típicamente 0.05)",
      power: "Poder (1-Beta)",
      powerHint: "Probabilidad de detectar efecto verdadero (típicamente 0.80 o 0.90)",
      allocationRatio: "Razón de Asignación",
      tails: "Colas",
      oneTailed: "Una Cola",
      twoTailed: "Dos Colas",
      attritionRate: "Tasa de Deserción Esperada",
      attritionRateHint: "Tasa de abandono esperada (%)",
      calculate: "Calcular Tamaño de Muestra",
      recalculate: "Recalcular"
    },
    
    // Results
    results: {
      title: "Resultados del Tamaño de Muestra",
      requiredPerGroup: "Tamaño de Muestra Requerido (por grupo)",
      totalRequired: "Tamaño de Muestra Total Requerido",
      withAttrition: "Ajustado por Deserción",
      totalWithAttrition: "Total con Deserción",
      assumptions: "Supuestos",
      effectSize: "Tamaño del Efecto",
      power: "Poder",
      alpha: "Alfa",
      allocationRatio: "Razón de Asignación",
      detailsReport: "Informe Detallado del Tamaño de Muestra",
      saveCalculation: "Guardar Cálculo",
      exportReport: "Exportar Informe"
    },
    
    // Power Analysis
    powerAnalysis: {
      title: "Análisis de Poder",
      powerCurve: "Curva de Poder",
      sensitivityAnalysis: "Análisis de Sensibilidad",
      varyEffectSize: "Variar Tamaño del Efecto",
      varySampleSize: "Variar Tamaño de Muestra",
      varyAlpha: "Variar Alfa",
      generateCurve: "Generar Curva de Poder"
    }
  },
  
  // === STUDY TIMELINE ===
  timeline: {
    title: "Cronograma del Estudio",
    subtitle: "Planifique el cronograma y los hitos de su estudio",
    
    // Timeline Builder
    builder: {
      title: "Constructor de Cronograma",
      addPhase: "Agregar Fase del Estudio",
      addMilestone: "Agregar Hito",
      phaseName: "Nombre de la Fase",
      startDate: "Fecha de Inicio",
      endDate: "Fecha de Finalización",
      duration: "Duración",
      description: "Descripción",
      screening: "Selección",
      enrollment: "Inscripción",
      treatment: "Tratamiento",
      followUp: "Seguimiento",
      dataAnalysis: "Análisis de Datos",
      reporting: "Informes"
    },
    
    // Visit Schedule
    visitSchedule: {
      title: "Cronograma de Visitas",
      addVisit: "Agregar Visita del Estudio",
      visitNumber: "Número de Visita",
      visitName: "Nombre de la Visita",
      timepoint: "Momento",
      visitWindow: "Ventana de Visita",
      procedures: "Procedimientos/Evaluaciones",
      baseline: "Basal",
      week: "Semana",
      month: "Mes",
      day: "Día",
      endOfStudy: "Fin del Estudio",
      unscheduled: "No Programada"
    },
    
    // Gantt Chart
    gantt: {
      title: "Diagrama de Gantt",
      viewGantt: "Ver Diagrama de Gantt",
      exportGantt: "Exportar Diagrama de Gantt",
      phases: "Fases",
      milestones: "Hitos",
      today: "Hoy"
    }
  },
  
  // === COMMON ACTIONS ===
  actions: {
    generate: "Generar",
    regenerate: "Regenerar",
    save: "Guardar",
    export: "Exportar",
    cancel: "Cancelar",
    back: "Atrás",
    next: "Siguiente",
    finish: "Finalizar",
    calculate: "Calcular",
    recalculate: "Recalcular",
    apply: "Aplicar",
    preview: "Vista Previa",
    download: "Descargar"
  },
  
  // === COMMON MESSAGES ===
  messages: {
    generationSuccess: "Metodología generada exitosamente",
    generationError: "Error al generar metodología",
    saveSuccess: "Guardado exitosamente",
    saveError: "Error al guardar",
    calculationComplete: "Cálculo completado",
    calculationError: "Cálculo fallido",
    invalidInput: "Por favor verifique sus entradas",
    missingRequired: "Por favor complete todos los campos requeridos"
  }
};
