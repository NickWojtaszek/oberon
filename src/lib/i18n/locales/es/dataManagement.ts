export default {
  // === DATA MANAGEMENT MODULE ===
  
  // Main Header
  header: {
    title: "Gestión de Datos",
    subtitle: "Importar, Exportar y Transformar Datos Clínicos",
    description: "Gestione sus datos clínicos con herramientas de nivel empresarial"
  },
  
  // Tab Navigation
  tabs: {
    import: "Importar",
    export: "Exportar",
    transform: "Transformar",
    quality: "Calidad de Datos",
    history: "Historial",
    schedule: "Tareas Programadas"
  },
  
  // === IMPORT SECTION ===
  import: {
    title: "Importar Datos",
    subtitle: "Cargar e importar datos clínicos desde fuentes externas",
    
    // Upload
    upload: {
      title: "Cargar Archivo",
      dragDrop: "Arrastre y suelte archivos aquí, o haga clic para explorar",
      browseFiles: "Explorar Archivos",
      selectedFile: "Archivo Seleccionado",
      fileSize: "Tamaño del Archivo",
      fileType: "Tipo de Archivo",
      removeFile: "Eliminar Archivo",
      uploadAnother: "Cargar Otro Archivo",
      maxFileSize: "Tamaño máximo de archivo: {{size}}MB",
      supportedFormats: "Formatos Soportados",
      formats: {
        csv: "CSV (Valores separados por comas)",
        excel: "Excel (.xlsx, .xls)",
        json: "JSON (JavaScript Object Notation)",
        xml: "XML (Extensible Markup Language)",
        sas: "Archivos de Datos SAS (.sas7bdat)",
        spss: "Archivos SPSS (.sav)",
        stata: "Archivos Stata (.dta)",
        txt: "Archivos de Texto (.txt, .dat)"
      }
    },
    
    // File Preview
    preview: {
      title: "Vista Previa del Archivo",
      firstRows: "Primeras {{count}} filas",
      totalRows: "Total de Filas",
      totalColumns: "Total de Columnas",
      encoding: "Codificación del Archivo",
      delimiter: "Delimitador",
      hasHeaders: "Primera fila contiene encabezados",
      refreshPreview: "Actualizar Vista Previa",
      viewAll: "Ver Todos los Datos"
    },
    
    // Field Mapping
    mapping: {
      title: "Mapeo de Campos",
      subtitle: "Mapear campos de origen al esquema del protocolo",
      autoMap: "Auto-Mapear Campos",
      clearMapping: "Limpiar Todos los Mapeos",
      sourceField: "Campo de Origen",
      targetField: "Campo de Destino (Esquema del Protocolo)",
      dataType: "Tipo de Datos",
      transformation: "Transformación",
      selectTarget: "Seleccionar campo de destino...",
      selectTransformation: "Seleccionar transformación...",
      unmappedFields: "Campos Sin Mapear",
      mappedFields: "Campos Mapeados",
      requiredFields: "Campos Obligatorios",
      optionalFields: "Campos Opcionales",
      ignoredFields: "Campos Ignorados",
      mappingStatus: "Estado del Mapeo",
      complete: "{{mapped}} de {{total}} campos obligatorios mapeados",
      suggestions: "Sugerencias de Mapeo",
      applySuggestion: "Aplicar Sugerencia",
      confidence: "Confianza: {{percent}}%"
    },
    
    // Transformations
    transformations: {
      none: "Sin transformación",
      trim: "Eliminar espacios",
      uppercase: "Convertir a mayúsculas",
      lowercase: "Convertir a minúsculas",
      titleCase: "Convertir a mayúscula inicial",
      parseDate: "Analizar como fecha",
      parseNumber: "Analizar como número",
      parseBoolean: "Analizar como booleano",
      split: "Dividir cadena",
      concatenate: "Concatenar valores",
      lookup: "Buscar desde tabla",
      calculate: "Calcular valor",
      custom: "Transformación personalizada"
    },
    
    // Validation
    validation: {
      title: "Reglas de Validación",
      subtitle: "Definir reglas de validación para datos importados",
      addRule: "Agregar Regla de Validación",
      rule: "Regla",
      condition: "Condición",
      errorMessage: "Mensaje de Error",
      warningMessage: "Mensaje de Advertencia",
      skipInvalid: "Omitir registros inválidos",
      flagInvalid: "Marcar registros inválidos para revisión",
      rejectInvalid: "Rechazar archivo si se encuentran registros inválidos",
      validationResults: "Resultados de Validación",
      passed: "Aprobado",
      failed: "Fallido",
      warnings: "Advertencias",
      errors: "Errores",
      viewDetails: "Ver Detalles"
    },
    
    // Import Options
    options: {
      title: "Opciones de Importación",
      importMode: "Modo de Importación",
      append: "Agregar a datos existentes",
      appendDesc: "Agregar nuevos registros al conjunto de datos existente",
      replace: "Reemplazar datos existentes",
      replaceDesc: "Eliminar datos existentes e importar nuevos",
      update: "Actualizar registros existentes",
      updateDesc: "Actualizar registros basados en campo clave",
      upsert: "Upsert (Actualizar o Insertar)",
      upsertDesc: "Actualizar si existe, insertar si es nuevo",
      keyField: "Campo Clave para Coincidencia",
      selectKeyField: "Seleccionar campo clave...",
      duplicateHandling: "Manejo de Duplicados",
      skipDuplicates: "Omitir duplicados",
      overwriteDuplicates: "Sobrescribir duplicados",
      flagDuplicates: "Marcar duplicados para revisión",
      errorHandling: "Manejo de Errores",
      stopOnError: "Detener en primer error",
      continueOnError: "Continuar en error",
      rollbackOnError: "Revertir todo en error",
      batchSize: "Tamaño de Lote",
      batchSizeHint: "Número de registros a procesar a la vez"
    },
    
    // Progress
    progress: {
      title: "Progreso de Importación",
      preparing: "Preparando importación...",
      uploading: "Cargando archivo...",
      validating: "Validando datos...",
      transforming: "Transformando datos...",
      importing: "Importando registros...",
      completed: "Importación completada",
      failed: "Importación fallida",
      recordsProcessed: "Registros Procesados",
      recordsImported: "Registros Importados",
      recordsSkipped: "Registros Omitidos",
      recordsFailed: "Registros Fallidos",
      estimatedTime: "Tiempo estimado restante",
      elapsedTime: "Tiempo transcurrido",
      cancel: "Cancelar Importación",
      cancelConfirm: "¿Está seguro de que desea cancelar esta importación?"
    },
    
    // Summary
    summary: {
      title: "Resumen de Importación",
      success: "Importación Completada Exitosamente",
      partial: "Importación Completada con Advertencias",
      failure: "Importación Fallida",
      totalRecords: "Total de Registros",
      successfulRecords: "Exitosos",
      failedRecords: "Fallidos",
      skippedRecords: "Omitidos",
      warningRecords: "Advertencias",
      duration: "Duración",
      downloadLog: "Descargar Registro de Importación",
      downloadErrors: "Descargar Informe de Errores",
      viewImportedData: "Ver Datos Importados",
      importAnother: "Importar Otro Archivo",
      done: "Hecho"
    }
  },
  
  // === EXPORT SECTION ===
  export: {
    title: "Exportar Datos",
    subtitle: "Exportar datos clínicos a formatos externos",
    
    // Data Selection
    selection: {
      title: "Seleccionar Datos para Exportar",
      protocol: "Protocolo",
      selectProtocol: "Seleccionar protocolo...",
      allProtocols: "Todos los Protocolos",
      version: "Versión",
      selectVersion: "Seleccionar versión...",
      dateRange: "Rango de Fechas",
      fromDate: "Desde Fecha",
      toDate: "Hasta Fecha",
      allDates: "Todas las Fechas",
      records: "Registros",
      allRecords: "Todos los Registros",
      selectedRecords: "Solo Registros Seleccionados",
      filteredRecords: "Registros Filtrados",
      recordCount: "{{count}} registro seleccionado",
      recordCount_plural: "{{count}} registros seleccionados"
    },
    
    // Field Selection
    fields: {
      title: "Seleccionar Campos",
      selectAll: "Seleccionar Todo",
      deselectAll: "Deseleccionar Todo",
      selectedFields: "Campos Seleccionados",
      availableFields: "Campos Disponibles",
      requiredFields: "Campos Obligatorios",
      fieldGroups: "Grupos de Campos",
      demographics: "Demografía",
      vitals: "Signos Vitales",
      laboratory: "Laboratorio",
      adverseEvents: "Eventos Adversos",
      medications: "Medicamentos",
      procedures: "Procedimientos",
      assessments: "Evaluaciones",
      custom: "Campos Personalizados"
    },
    
    // Format Options
    format: {
      title: "Formato de Exportación",
      selectFormat: "Seleccionar formato...",
      csv: "CSV (Separado por comas)",
      excel: "Libro de Excel (.xlsx)",
      json: "JSON (Datos estructurados)",
      xml: "XML (Extensible Markup)",
      sas: "SAS Transport (.xpt)",
      spss: "SPSS (.sav)",
      stata: "Stata (.dta)",
      pdf: "Informe PDF",
      customFormat: "Plantilla de Formato Personalizado",
      formatOptions: "Opciones de Formato",
      includeHeaders: "Incluir encabezados de columna",
      includeMetadata: "Incluir hoja de metadatos",
      includeCodebook: "Incluir libro de códigos de datos",
      dateFormat: "Formato de Fecha",
      numberFormat: "Formato de Número",
      missingValue: "Indicador de Valor Faltante",
      encoding: "Codificación de Caracteres",
      compression: "Comprimir archivo de salida"
    },
    
    // Filters
    filters: {
      title: "Aplicar Filtros",
      addFilter: "Agregar Filtro",
      field: "Campo",
      operator: "Operador",
      value: "Valor",
      equals: "Igual",
      notEquals: "No Igual",
      greaterThan: "Mayor Que",
      lessThan: "Menor Que",
      contains: "Contiene",
      startsWith: "Comienza Con",
      endsWith: "Termina Con",
      between: "Entre",
      in: "En Lista",
      isNull: "Es Nulo",
      isNotNull: "No Es Nulo",
      and: "Y",
      or: "O",
      removeFilter: "Eliminar Filtro",
      clearAllFilters: "Limpiar Todos los Filtros"
    },
    
    // Preview
    preview: {
      title: "Vista Previa de Exportación",
      previewData: "Vista Previa de Datos",
      sampleRows: "Muestra de {{count}} filas",
      estimatedSize: "Tamaño Estimado del Archivo",
      estimatedRecords: "Recuento Estimado de Registros",
      refreshPreview: "Actualizar Vista Previa"
    },
    
    // Progress
    progress: {
      title: "Progreso de Exportación",
      preparing: "Preparando exportación...",
      querying: "Consultando datos...",
      formatting: "Formateando datos...",
      generating: "Generando archivo...",
      compressing: "Comprimiendo archivo...",
      completed: "Exportación completada",
      failed: "Exportación fallida",
      recordsExported: "Registros Exportados",
      fileSize: "Tamaño del Archivo",
      cancel: "Cancelar Exportación"
    },
    
    // Download
    download: {
      title: "Descargar Exportación",
      ready: "Su exportación está lista",
      fileName: "Nombre del Archivo",
      fileSize: "Tamaño del Archivo",
      expiresIn: "Expira en {{hours}} horas",
      downloadNow: "Descargar Ahora",
      downloadLink: "Enlace de Descarga",
      copyLink: "Copiar Enlace",
      linkCopied: "Enlace copiado al portapapeles",
      emailLink: "Enviar Enlace de Descarga por Email",
      exportAnother: "Exportar Otro Conjunto de Datos"
    }
  },
  
  // === TRANSFORM SECTION ===
  transform: {
    title: "Transformación de Datos",
    subtitle: "Limpiar, normalizar y derivar nuevos campos de datos",
    
    // Transformation Types
    types: {
      clean: "Limpieza de Datos",
      normalize: "Normalización",
      derive: "Variables Derivadas",
      aggregate: "Agregación",
      pivot: "Pivot/Unpivot",
      merge: "Fusionar Conjuntos de Datos"
    },
    
    // Cleaning
    cleaning: {
      title: "Limpieza de Datos",
      removeDuplicates: "Eliminar Registros Duplicados",
      trimWhitespace: "Eliminar Espacios",
      standardizeCase: "Estandarizar Mayúsculas/Minúsculas",
      fixDataTypes: "Corregir Tipos de Datos",
      handleMissing: "Manejar Valores Faltantes",
      removeOutliers: "Eliminar Valores Atípicos",
      validateRanges: "Validar Rangos de Valores",
      applyAll: "Aplicar Todas las Reglas de Limpieza"
    },
    
    // Normalization
    normalization: {
      title: "Normalización de Datos",
      standardize: "Estandarizar Valores",
      categorize: "Categorizar Valores",
      binning: "Crear Intervalos/Categorías",
      scaling: "Escalar Valores Numéricos",
      encoding: "Codificar Valores Categóricos"
    },
    
    // Derived Variables
    derived: {
      title: "Variables Derivadas",
      addVariable: "Agregar Variable Derivada",
      variableName: "Nombre de Variable",
      formula: "Fórmula/Expresión",
      formulaPlaceholder: "Ingresar fórmula...",
      useWizard: "Usar Asistente de Fórmulas",
      functions: "Funciones Disponibles",
      testFormula: "Probar Fórmula",
      previewResults: "Vista Previa de Resultados",
      saveVariable: "Guardar Variable"
    },
    
    // Aggregation
    aggregation: {
      title: "Agregación de Datos",
      groupBy: "Agrupar Por",
      selectFields: "Seleccionar campos de agrupación...",
      aggregations: "Agregaciones",
      addAggregation: "Agregar Agregación",
      function: "Función",
      sum: "Suma",
      average: "Promedio",
      count: "Recuento",
      min: "Mínimo",
      max: "Máximo",
      median: "Mediana",
      mode: "Moda",
      stdDev: "Desviación Estándar",
      variance: "Varianza"
    },
    
    // Preview
    preview: {
      title: "Vista Previa de Transformación",
      before: "Antes",
      after: "Después",
      affectedRecords: "Registros Afectados",
      apply: "Aplicar Transformación",
      revert: "Revertir Cambios"
    }
  },
  
  // === DATA QUALITY SECTION ===
  quality: {
    title: "Calidad de Datos",
    subtitle: "Evaluar y mejorar la calidad de los datos",
    
    // Quality Score
    score: {
      title: "Puntuación de Calidad",
      overall: "Calidad General",
      completeness: "Completitud",
      accuracy: "Precisión",
      consistency: "Consistencia",
      validity: "Validez",
      timeliness: "Puntualidad",
      excellent: "Excelente",
      good: "Buena",
      fair: "Aceptable",
      poor: "Deficiente"
    },
    
    // Checks
    checks: {
      title: "Verificaciones de Calidad",
      runChecks: "Ejecutar Verificaciones de Calidad",
      runAll: "Ejecutar Todas las Verificaciones",
      lastRun: "Última ejecución",
      missingData: "Verificación de Datos Faltantes",
      duplicates: "Verificación de Registros Duplicados",
      outliers: "Detección de Valores Atípicos",
      consistency: "Verificación de Consistencia",
      referential: "Integridad Referencial",
      businessRules: "Validación de Reglas de Negocio",
      passed: "Aprobado",
      failed: "Fallido",
      warnings: "Advertencias",
      viewReport: "Ver Informe"
    },
    
    // Issues
    issues: {
      title: "Problemas de Calidad de Datos",
      severity: "Gravedad",
      critical: "Crítica",
      major: "Mayor",
      minor: "Menor",
      info: "Informativa",
      status: "Estado",
      open: "Abierto",
      inProgress: "En Progreso",
      resolved: "Resuelto",
      ignored: "Ignorado",
      assignedTo: "Asignado A",
      dueDate: "Fecha de Vencimiento",
      resolveIssue: "Resolver Problema",
      ignoreIssue: "Ignorar Problema",
      bulkResolve: "Resolución Masiva",
      exportIssues: "Exportar Problemas"
    },
    
    // Reports
    reports: {
      title: "Informes de Calidad",
      generateReport: "Generar Informe",
      reportType: "Tipo de Informe",
      summary: "Informe Resumen",
      detailed: "Informe Detallado",
      trend: "Análisis de Tendencias",
      comparison: "Informe de Comparación",
      dateRange: "Rango de Fechas",
      downloadReport: "Descargar Informe"
    }
  },
  
  // === HISTORY SECTION ===
  history: {
    title: "Historial de Importación/Exportación",
    subtitle: "Ver operaciones de datos anteriores",
    
    // Filters
    filters: {
      all: "Todas las Operaciones",
      imports: "Solo Importaciones",
      exports: "Solo Exportaciones",
      dateRange: "Rango de Fechas",
      status: "Estado",
      user: "Usuario"
    },
    
    // List
    list: {
      operation: "Operación",
      date: "Fecha",
      user: "Usuario",
      records: "Registros",
      status: "Estado",
      duration: "Duración",
      actions: "Acciones",
      viewDetails: "Ver Detalles",
      downloadFile: "Descargar Archivo",
      viewLog: "Ver Registro",
      rerun: "Volver a Ejecutar",
      delete: "Eliminar"
    },
    
    // Details
    details: {
      title: "Detalles de Operación",
      operationId: "ID de Operación",
      startTime: "Hora de Inicio",
      endTime: "Hora de Finalización",
      parameters: "Parámetros",
      results: "Resultados",
      logs: "Registros",
      errors: "Errores"
    },
    
    // Status
    status: {
      pending: "Pendiente",
      running: "En Ejecución",
      completed: "Completado",
      failed: "Fallido",
      cancelled: "Cancelado",
      partialSuccess: "Éxito Parcial"
    }
  },
  
  // === SCHEDULED JOBS SECTION ===
  schedule: {
    title: "Tareas Programadas",
    subtitle: "Automatizar operaciones de importación y exportación de datos",
    
    // Job List
    jobs: {
      addJob: "Agregar Tarea Programada",
      editJob: "Editar Tarea",
      deleteJob: "Eliminar Tarea",
      enableJob: "Habilitar Tarea",
      disableJob: "Deshabilitar Tarea",
      runNow: "Ejecutar Ahora",
      jobName: "Nombre de Tarea",
      schedule: "Programación",
      lastRun: "Última Ejecución",
      nextRun: "Próxima Ejecución",
      status: "Estado",
      enabled: "Habilitada",
      disabled: "Deshabilitada"
    },
    
    // Job Configuration
    config: {
      title: "Configuración de Tarea",
      jobName: "Nombre de Tarea",
      jobNamePlaceholder: "Ingresar nombre de tarea...",
      description: "Descripción",
      descriptionPlaceholder: "Describir esta tarea...",
      operation: "Tipo de Operación",
      import: "Importar Datos",
      export: "Exportar Datos",
      transform: "Transformar Datos",
      qualityCheck: "Verificación de Calidad",
      schedule: "Programación",
      frequency: "Frecuencia",
      daily: "Diaria",
      weekly: "Semanal",
      monthly: "Mensual",
      custom: "Personalizada (Cron)",
      time: "Hora",
      timeZone: "Zona Horaria",
      notifications: "Notificaciones",
      notifyOnSuccess: "Notificar en éxito",
      notifyOnFailure: "Notificar en fallo",
      recipients: "Destinatarios",
      saveJob: "Guardar Tarea"
    },
    
    // Job History
    history: {
      title: "Historial de Ejecución de Tareas",
      executionDate: "Fecha de Ejecución",
      duration: "Duración",
      status: "Estado",
      records: "Registros Procesados",
      viewLog: "Ver Registro"
    }
  },
  
  // === COMMON ACTIONS ===
  actions: {
    upload: "Cargar",
    download: "Descargar",
    import: "Importar",
    export: "Exportar",
    transform: "Transformar",
    validate: "Validar",
    preview: "Vista Previa",
    apply: "Aplicar",
    cancel: "Cancelar",
    back: "Atrás",
    next: "Siguiente",
    finish: "Finalizar",
    save: "Guardar",
    delete: "Eliminar",
    close: "Cerrar",
    refresh: "Actualizar",
    retry: "Reintentar"
  },
  
  // === COMMON MESSAGES ===
  messages: {
    uploadSuccess: "Archivo cargado exitosamente",
    uploadError: "Error al cargar archivo",
    importSuccess: "Datos importados exitosamente",
    importError: "Error al importar datos",
    exportSuccess: "Datos exportados exitosamente",
    exportError: "Error al exportar datos",
    transformSuccess: "Transformación aplicada exitosamente",
    transformError: "Error al aplicar transformación",
    validationSuccess: "Validación aprobada",
    validationError: "Validación fallida",
    noDataSelected: "No se seleccionaron datos",
    operationCancelled: "Operación cancelada",
    confirmDelete: "¿Está seguro de que desea eliminar esto?",
    unsavedChanges: "Tiene cambios sin guardar. ¿Continuar?"
  }
};
