export default {
  // === VALIDATION SYSTEM ===
  
  // Sidebar
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
  
  // Validation status
  status: {
    validating: "Validando...",
    validated: "Validado",
    noValidation: "No se realizó validación",
    lastValidated: "Última validación",
    runValidation: "Ejecutar Validación",
    validationComplete: "Validación completa",
    validationFailed: "Validación fallida"
  },
  
  // Export
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
  
  // Trends
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
  
  // Auto-fix
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
  
  // Messages
  messages: {
    notApplicable: "No aplicable para este tipo de estudio",
    checklistComplete: "Todos los elementos de la lista de verificación están completos",
    checklistIncomplete: "{{completed}} de {{total}} completos"
  }
};
