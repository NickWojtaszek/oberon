export default {
  // === PROTOCOL WORKBENCH ===
  
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
    helpPlaceholder: "Ingrese texto de ayuda para este campo"
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
    generate: "Generar Esquema"
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
  }
};
