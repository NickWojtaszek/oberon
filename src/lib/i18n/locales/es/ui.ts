export default {
  // === GLOBAL HEADER ===
  globalHeader: {
    targetJournal: "Revista Objetivo:",
    selectJournal: "Seleccionar revista...",
    createCustomJournal: "Crear Revista Personalizada",
    editGenericJournal: "Editar Valores Predeterminados de Revista",
    autonomy: {
      audit: "Auditoría",
      coPilot: "Co-Piloto",
      pilot: "Piloto",
      notAvailableForRole: "No disponible para tu rol"
    },
    exportPackage: "Exportar Paquete",
    runLogicCheck: "Ejecutar Verificación de Lógica",
    processing: "Procesando...",
    studyTypes: {
      unblinded: "SIN CEGAR",
      singleBlind: "SIMPLE CIEGO",
      doubleBlind: "DOBLE CIEGO",
      tripleBlind: "TRIPLE CIEGO"
    }
  },

  // === NAVIGATION PANEL ===
  navigation: {
    researchFactory: "Fábrica de Investigación",
    currentProject: "Proyecto Actual:",
    noProject: "No hay proyecto seleccionado",
    
    // Navigation items
    dashboard: "Panel de Control",
    projectLibrary: "Biblioteca de Proyectos",
    protocolLibrary: "Biblioteca de Protocolos",
    aiPersonas: "Personas IA",
    personaEditor: "Editor de Personas",
    protocolWorkbench: "Banco de Protocolos",
    researchWizard: "Asistente de Investigación",
    projectSetup: "Configuración del Proyecto",
    methodologyEngine: "Motor de Metodología",
    database: "Base de Datos",
    analytics: "Analítica",
    academicWriting: "Escritura Académica",
    dataManagement: "Gestión de Datos",
    governance: "Gobernanza",
    ethics: "Ética e IRB",
    
    // Navigation descriptions
    descriptions: {
      dashboard: "Vista general del progreso",
      projectLibrary: "Explorar proyectos",
      protocolLibrary: "Explorar protocolos",
      aiPersonas: "Biblioteca de personas",
      personaEditor: "Crear y editar personas",
      protocolWorkbench: "Construir esquemas",
      researchWizard: "Configuración de investigación guiada",
      projectSetup: "Equipo y metodología",
      methodologyEngine: "Generación automática de metodología",
      database: "Esquema y registros",
      analytics: "Análisis estadístico",
      academicWriting: "Editor de manuscritos",
      dataManagement: "Importar/Exportar",
      governance: "Control de acceso",
      ethics: "IRB y Cumplimiento"
    },
    
    // Navigation actions
    goToField: "Ir al campo",
    navigateToIssue: "Navegar al problema",
    backToList: "Volver a la lista"
  },

  // === LANGUAGE SWITCHER ===
  language: {
    title: "Idioma de la Interfaz",
    changeLanguage: "Cambiar idioma de la interfaz",
    autoSave: "La preferencia de idioma se guarda automáticamente",
    english: "English",
    polish: "Polski",
    spanish: "Español",
    chinese: "中文"
  },

  // === PROTOCOL WORKBENCH ===
  protocolWorkbench: {
    // Main toolbar
    toolbar: {
      protocolLabel: "Protocolo",
      versionLabel: "Versión",
      exportSchema: "Exportar Esquema",
      backToLibrary: "Volver a Biblioteca",
      saveDraft: "Guardar Borrador",
      publish: "Publicar"
    },
    
    // Tab navigation
    tabs: {
      protocolDocument: "Documento de Protocolo",
      schemaBuilder: "Constructor de Esquema",
      dependencies: "Dependencias",
      audit: "Auditoría"
    },
    
    // Schema Editor
    schemaEditor: {
      emptyState: {
        title: "No hay bloques de esquema todavía",
        description: "Haga clic en las variables de la biblioteca de la izquierda para comenzar a construir su esquema de protocolo."
      }
    },
    
    // Variable Library
    variableLibrary: {
      title: "Biblioteca de Variables",
      searchPlaceholder: "Buscar variables...",
      noResults: "No se encontraron variables"
    },
    
    // Settings Modal
    settingsModal: {
      title: "Configuración del Bloque",
      dataType: "Tipo de Datos",
      unit: "Unidad",
      unitPlaceholder: "Introducir unidad",
      quickSelect: "Selección rápida...",
      minValue: "Valor Mínimo",
      maxValue: "Valor Máximo",
      minPlaceholder: "Mín",
      maxPlaceholder: "Máx",
      clinicalRange: "Rango Clínico",
      normalLow: "Normal Bajo",
      normalHigh: "Normal Alto",
      critical: "Crítico",
      options: "Opciones",
      addOption: "Agregar Opción",
      optionPlaceholder: "Opción",
      quickTemplates: "Plantillas rápidas:",
      matrixRows: "Filas de Matriz",
      addRow: "Agregar Fila",
      rowPlaceholder: "Fila",
      gridItems: "Elementos de Cuadrícula (Filas)",
      gridCategories: "Categorías de Cuadrícula (Columnas)",
      addItem: "Agregar Elemento",
      addCategory: "Agregar Categoría",
      itemPlaceholder: "Elemento",
      categoryPlaceholder: "Categoría",
      required: "Requerido",
      helpText: "Texto de Ayuda",
      helpPlaceholder: "Ingrese texto de ayuda para este campo",
      saveChanges: "Guardar Cambios",
      cancel: "Cancelar"
    },
    
    // Dependency Modal
    dependencyModal: {
      title: "Dependencias y Enlaces Lógicos",
      infoTitle: "¿Qué son las dependencias?",
      infoDescription: "Las dependencias definen relaciones lógicas entre variables. Si esta variable depende de otras, esas deben recopilarse primero o usarse en lógica condicional.",
      currentDependencies: "Dependencias Actuales",
      noDependencies: "No hay dependencias establecidas. Esta variable es independiente.",
      unknownVariable: "Variable Desconocida",
      addDependency: "Agregar Dependencia",
      noAvailableVariables: "No hay otras variables disponibles para agregar como dependencias.",
      circularWarning: "Crearía una dependencia circular",
      saveDependencies: "Guardar Dependencias",
      // Advanced modal (for future use)
      conditionalRules: "Reglas Condicionales",
      addRule: "Agregar Regla",
      condition: "Condición",
      value: "Valor",
      then: "Entonces",
      action: "Acción",
      targetVariable: "Variable Objetivo",
      operator: "Operador",
      equals: "Igual a",
      notEquals: "No igual a",
      greaterThan: "Mayor que",
      lessThan: "Menor que",
      contains: "Contiene",
      show: "Mostrar",
      hide: "Ocultar",
      require: "Requerir",
      setValue: "Establecer Valor",
      saveRules: "Guardar Reglas"
    },
    
    // Version Tag Modal
    versionTagModal: {
      title: "Etiqueta de Versión",
      versionTag: "Etiqueta de Versión",
      versionPlaceholder: "ej., v1.0, v2.1, Enmienda 3",
      quickSelect: "Selección Rápida",
      tagColor: "Color de Etiqueta",
      preview: "Vista Previa",
      clearTag: "Borrar Etiqueta",
      saveTag: "Guardar Etiqueta"
    },
    
    // Schema Generator Modal
    schemaGeneratorModal: {
      title: "Generador de Esquema IA",
      description: "Describa Su Protocolo",
      descriptionPlaceholder: "Describa lo que desea medir en su estudio...",
      chooseTemplate: "Elegir una Plantilla",
      generating: "Generando...",
      generate: "Generar Esquema",
      cancel: "Cancelar"
    },
    
    // Pre-Publish Validation Modal
    prePublishModal: {
      cannotPublish: "No se Puede Publicar el Protocolo",
      reviewRequired: "Revisión Requerida",
      readyToPublish: "Listo para Publicar",
      validationComplete: "Validación de gobernanza IA completa",
      complianceScore: "Puntuación de Cumplimiento",
      validationPassed: "Validación Aprobada",
      validationFailed: "Validación Fallida",
      critical: "Crítico",
      mustResolve: "Debe resolverse",
      warnings: "Advertencias",
      reviewNeeded: "Revisión necesaria",
      info: "Info",
      suggestions: "Sugerencias",
      blockingIssues: "Problemas Bloqueantes",
      approvalRequired: "Aprobación de IP Requerida",
      approvalDescription: "Este protocolo requiere revisión y aprobación del Investigador Principal antes de su publicación.",
      viewAuditReport: "Ver Informe Completo de Auditoría",
      acknowledgePublish: "Reconocer y Publicar",
      publishProtocol: "Publicar Protocolo",
      proceedAnyway: "Continuar de Todos Modos",
      fixIssues: "Corregir Problemas"
    },
    
    // Block Toolbar
    blockToolbar: {
      duplicate: "Duplicar",
      versionTag: "Etiqueta de Versión",
      dependencies: "Dependencias",
      settings: "Configuración",
      remove: "Eliminar"
    },
    
    // Configuration HUD
    configHUD: {
      role: "Rol",
      endpointTier: "Nivel de Endpoint",
      analysisMethod: "Método de Análisis",
      none: "Ninguno",
      primary: "Primario",
      secondary: "Secundario",
      exploratory: "Exploratorio",
      kaplanMeier: "Kaplan-Meier",
      frequency: "Frecuencia",
      tTest: "Prueba t",
      nonParametric: "No paramétrico",
      chiSquare: "Chi-cuadrado"
    },
    
    // Schema Block
    schemaBlock: {
      section: "Sección",
      items: "elementos"
    },
    
    // Protocol validation
    validation: {
      protocolTitleRequired: "Por favor ingrese el Título del Protocolo y el Número de Protocolo antes de guardar",
      loadFailed: "No se pudo cargar el protocolo. Puede haber sido eliminado."
    },
    
    // Status badges
    status: {
      draft: "Borrador",
      published: "Publicado",
      archived: "Archivado"
    }
  },

  // === ACADEMIC WRITING ===
  academic: {
    manuscript: {
      title: "Título del Manuscrito",
      abstract: "Resumen",
      introduction: "Introducción",
      methods: "Métodos",
      results: "Resultados",
      discussion: "Discusión",
      conclusions: "Conclusiones",
      references: "Referencias",
      acknowledgments: "Agradecimientos",
      appendices: "Apéndices"
    },
    sections: {
      addSection: "Agregar Sección",
      deleteSection: "Eliminar Sección",
      moveUp: "Mover Arriba",
      moveDown: "Mover Abajo",
      sectionTitle: "Título de la Sección",
      sectionContent: "Contenido de la Sección"
    },
    citations: {
      addCitation: "Agregar Cita",
      editCitation: "Editar Cita",
      deleteCitation: "Eliminar Cita",
      citationStyle: "Estilo de Cita",
      insertCitation: "Insertar Cita",
      manageCitations: "Gestionar Citas",
      noCitations: "No hay citas todavía"
    },
    export: {
      title: "Exportar Manuscrito",
      exportPDF: "Exportar PDF",
      exportWord: "Exportar Word",
      exportLaTeX: "Exportar LaTeX",
      includeReferences: "Incluir Referencias",
      includeAppendices: "Incluir Apéndices"
    },
    wordCount: {
      total: "Total de Palabras",
      abstract: "Palabras del Resumen",
      body: "Palabras del Cuerpo",
      target: "Objetivo"
    }
  },

  // === DATABASE MODULE ===
  database: {
    tabs: {
      schema: "Esquema",
      dataEntry: "Entrada de Datos",
      browser: "Navegador de Datos",
      query: "Constructor de Consultas",
      import: "Importar"
    },
    schema: {
      tables: "Tablas",
      addTable: "Agregar Tabla",
      editTable: "Editar Tabla",
      deleteTable: "Eliminar Tabla",
      columns: "Columnas",
      addColumn: "Agregar Columna",
      columnName: "Nombre de Columna",
      columnType: "Tipo de Columna",
      primaryKey: "Clave Primaria",
      foreignKey: "Clave Foránea"
    },
    dataEntry: {
      newRecord: "Nuevo Registro",
      editRecord: "Editar Registro",
      deleteRecord: "Eliminar Registro",
      saveRecord: "Guardar Registro",
      recordSaved: "Registro guardado exitosamente",
      recordDeleted: "Registro eliminado exitosamente"
    },
    browser: {
      filterRecords: "Filtrar Registros",
      sortBy: "Ordenar Por",
      recordsPerPage: "Registros por página",
      totalRecords: "Total de Registros",
      noRecords: "No se encontraron registros"
    },
    query: {
      newQuery: "Nueva Consulta",
      runQuery: "Ejecutar Consulta",
      saveQuery: "Guardar Consulta",
      queryResults: "Resultados de la Consulta",
      noResults: "Sin resultados"
    }
  },

  // === ANALYTICS MODULE ===
  analytics: {
    dashboard: {
      title: "Panel de Analítica",
      overview: "Resumen",
      reports: "Informes",
      visualizations: "Visualizaciones"
    },
    statistics: {
      descriptive: "Estadísticas Descriptivas",
      inferential: "Estadísticas Inferenciales",
      mean: "Media",
      median: "Mediana",
      mode: "Moda",
      standardDeviation: "Desviación Estándar",
      variance: "Varianza",
      range: "Rango",
      confidence: "Intervalo de Confianza",
      pValue: "Valor P",
      significance: "Nivel de Significancia"
    },
    charts: {
      barChart: "Gráfico de Barras",
      lineChart: "Gráfico de Líneas",
      pieChart: "Gráfico Circular",
      scatterPlot: "Diagrama de Dispersión",
      histogram: "Histograma",
      boxPlot: "Diagrama de Caja"
    },
    export: {
      exportResults: "Exportar Resultados",
      exportChart: "Exportar Gráfico",
      exportTable: "Exportar Tabla"
    }
  },

  // === GOVERNANCE MODULE ===
  governance: {
    roles: {
      title: "Roles y Permisos",
      addRole: "Agregar Rol",
      editRole: "Editar Rol",
      deleteRole: "Eliminar Rol",
      roleName: "Nombre del Rol",
      permissions: "Permisos"
    },
    users: {
      title: "Gestión de Usuarios",
      addUser: "Agregar Usuario",
      editUser: "Editar Usuario",
      deleteUser: "Eliminar Usuario",
      userName: "Nombre de Usuario",
      userEmail: "Correo Electrónico",
      userRole: "Rol",
      active: "Activo",
      inactive: "Inactivo"
    },
    audit: {
      title: "Registro de Auditoría",
      action: "Acción",
      user: "Usuario",
      timestamp: "Marca de Tiempo",
      details: "Detalles",
      export: "Exportar Registro de Auditoría"
    }
  },

  // === ETHICS & IRB ===
  ethics: {
    submissions: {
      title: "Envíos IRB",
      newSubmission: "Nuevo Envío",
      editSubmission: "Editar Envío",
      submissionStatus: "Estado",
      submittedDate: "Fecha de Envío",
      approvalDate: "Fecha de Aprobación",
      statusPending: "Pendiente",
      statusApproved: "Aprobado",
      statusRejected: "Rechazado",
      statusRevisions: "Revisiones Solicitadas"
    },
    documents: {
      consentForm: "Formulario de Consentimiento",
      protocol: "Protocolo",
      investigatorBrochure: "Folleto del Investigador",
      amendments: "Enmiendas",
      safetyReports: "Informes de Seguridad"
    },
    compliance: {
      title: "Seguimiento de Cumplimiento",
      ichGCP: "ICH-GCP",
      gdpr: "GDPR",
      hipaa: "HIPAA",
      compliant: "Cumple",
      nonCompliant: "No Cumple",
      underReview: "En Revisión"
    }
  },

  // === EXISTING SECTIONS (preserved) ===
  sidebar: {
    noIssues: "No se encontraron problemas",
    issueCount: "{{count}} problema",
    issueCount_plural: "{{count}} problemas",
    criticalIssues: "Problemas Críticos",
    warnings: "Advertencias",
    informational: "Informativo",
    recommendations: "Recomendaciones",
    citation: "Cita Regulatoria",
    autoFixAvailable: "Corrección Automática Disponible",
    applyFix: "Aplicar Corrección",
    location: "Ubicación",
    module: "Módulo",
    tab: "Pestaña",
    field: "Campo",
    viewDetails: "Ver Detalles",
    collapse: "Contraer",
    expand: "Expandir"
  },
  
  validation: {
    validating: "Validando...",
    validated: "Validado",
    noValidation: "No se realizó validación",
    lastValidated: "Última validación",
    runValidation: "Ejecutar Validación",
    validationComplete: "Validación completa",
    validationFailed: "Validación fallida"
  },
  
  export: {
    title: "Exportar Informe de Validación",
    format: "Formato de Exportación",
    formatPDF: "PDF (HTML)",
    formatJSON: "JSON",
    formatCSV: "CSV",
    options: "Opciones de Exportación",
    includeRecommendations: "Incluir Recomendaciones",
    includeCitations: "Incluir Citas Regulatorias",
    filterBySeverity: "Filtrar por Gravedad",
    filterAll: "Todos los Problemas",
    filterCriticalWarning: "Solo Críticos y Advertencias",
    filterCriticalOnly: "Solo Críticos",
    groupBy: "Agrupar Por",
    groupBySeverity: "Gravedad",
    groupByPersona: "Persona",
    groupByCategory: "Categoría",
    exportButton: "Exportar Informe",
    exporting: "Exportando...",
    exportSuccess: "Informe exportado exitosamente",
    exportError: "Error al exportar el informe"
  },
  
  trends: {
    title: "Tendencias de Validación",
    overallTrend: "Tendencia General",
    personaTrends: "Tendencias de Personas",
    scoreImprovement: "Mejora de Puntuación",
    issueReduction: "Reducción de Problemas",
    currentScore: "Puntuación Actual",
    previousScore: "Puntuación Anterior",
    scoreChange: "Cambio de Puntuación",
    improving: "Mejorando",
    declining: "Declinando",
    stable: "Estable",
    noData: "No hay datos de tendencias disponibles",
    snapshotCount: "{{count}} instantánea",
    snapshotCount_plural: "{{count}} instantáneas",
    dateRange: "Rango de Fechas",
    compareVersions: "Comparar Versiones",
    version: "Versión",
    selectVersion: "Seleccionar versión..."
  },
  
  autoFix: {
    title: "Corrección Automática Disponible",
    description: "Este problema puede corregirse automáticamente",
    applyFix: "Aplicar Corrección Automática",
    applying: "Aplicando corrección...",
    success: "Corrección aplicada exitosamente",
    error: "Error al aplicar la corrección",
    fixesApplied: "{{count}} corrección aplicada",
    fixesApplied_plural: "{{count}} correcciones aplicadas",
    confirmTitle: "Confirmar Corrección Automática",
    confirmMessage: "¿Está seguro de que desea aplicar esta corrección?",
    confirmMultiple: "¿Aplicar {{count}} correcciones automáticas?",
    reviewChanges: "Revisar cambios antes de aplicar"
  },
  
  messages: {
    required: "Este campo es obligatorio",
    invalid: "Valor no válido",
    missing: "Información faltante",
    incomplete: "Incompleto",
    notApplicable: "No aplicable para este tipo de estudio",
    checklistComplete: "Todos los elementos de la lista de verificación están completos",
    checklistIncomplete: "{{completed}} de {{total}} completos"
  }
};