export default {
  // === PROTOCOL LIBRARY ===
  
  // Header
  header: {
    title: "Biblioteca de Protocolos",
    description: "Explorar y gestionar protocolos de investigación",
    newProtocol: "Nuevo Protocolo",
    importProtocol: "Importar Protocolo"
  },
  
  // View Controls
  viewControls: {
    gridView: "Vista de Cuadrícula",
    listView: "Vista de Lista",
    sortBy: "Ordenar por",
    filterBy: "Filtrar por",
    showFilters: "Mostrar Filtros",
    hideFilters: "Ocultar Filtros"
  },
  
  // Sort Options
  sortOptions: {
    nameAsc: "Nombre (A-Z)",
    nameDesc: "Nombre (Z-A)",
    dateCreated: "Fecha de Creación",
    dateModified: "Última Modificación",
    studyType: "Tipo de Estudio",
    status: "Estado"
  },
  
  // Filter Options
  filters: {
    allProtocols: "Todos los Protocolos",
    myProtocols: "Mis Protocolos",
    sharedWithMe: "Compartidos Conmigo",
    recentlyViewed: "Vistos Recientemente",
    favorites: "Favoritos",
    studyType: "Tipo de Estudio",
    status: "Estado",
    phase: "Fase",
    therapeuticArea: "Área Terapéutica",
    clearFilters: "Borrar Todos los Filtros"
  },
  
  // Study Types
  studyTypes: {
    all: "Todos los Tipos",
    rct: "Ensayo Controlado Aleatorizado",
    observational: "Estudio Observacional",
    singleArm: "Estudio de Brazo Único",
    diagnostic: "Estudio Diagnóstico",
    registry: "Estudio de Registro",
    other: "Otro"
  },
  
  // Status Options
  statusOptions: {
    all: "Todos los Estados",
    draft: "Borrador",
    inReview: "En Revisión",
    approved: "Aprobado",
    active: "Activo",
    completed: "Completado",
    archived: "Archivado"
  },
  
  // Phase Options
  phaseOptions: {
    all: "Todas las Fases",
    phase1: "Fase I",
    phase2: "Fase II",
    phase3: "Fase III",
    phase4: "Fase IV",
    notApplicable: "N/A"
  },
  
  // Protocol Card
  card: {
    clickToOpen: "Clic para abrir",
    current: "Actual",
    created: "Creado",
    modified: "Modificado",
    modifiedBy: "Modificado por",
    published: "Publicado",
    versions: "versión",
    versions_plural: "versiones",
    viewOlderVersions: "Ver {{count}} versión(es) anterior(es)",
    continueEditing: "Continuar Editando",
    publish: "Publicar",
    view: "Ver",
    createNewVersion: "Crear Nueva Versión",
    untitledProtocol: "[Protocolo Sin Título]",
    noNumber: "[Sin Número]",
    // Status badges
    statusDraft: "Borrador",
    statusPublished: "Publicado",
    statusArchived: "Archivado",
    // Legacy fields
    createdBy: "Creado por",
    lastModified: "Modificado",
    studyType: "Tipo de Estudio",
    phase: "Fase",
    status: "Estado",
    participants: "Participantes",
    endpoints: "Endpoints",
    variables: "Variables",
    version: "Versión",
    open: "Abrir",
    edit: "Editar",
    duplicate: "Duplicar",
    archive: "Archivar",
    delete: "Eliminar",
    share: "Compartir",
    export: "Exportar",
    addToFavorites: "Agregar a Favoritos",
    removeFromFavorites: "Quitar de Favoritos",
    viewDetails: "Ver Detalles"
  },
  
  // Search
  search: {
    placeholder: "Buscar protocolos por nombre, ID o palabra clave...",
    noResults: "No se encontraron protocolos",
    noResultsMessage: "Intente ajustar su búsqueda o filtros",
    resultsCount: "{{count}} protocolo encontrado",
    resultsCount_plural: "{{count}} protocolos encontrados"
  },
  
  // Empty States
  emptyStates: {
    noProtocols: {
      title: "No Hay Protocolos Todavía",
      description: "Comience creando su primer protocolo o importando uno existente.",
      actionCreate: "Crear Protocolo",
      actionImport: "Importar Protocolo"
    },
    noFavorites: {
      title: "Sin Favoritos",
      description: "Marque con estrella sus protocolos más usados para acceder rápidamente.",
      action: "Explorar Todos los Protocolos"
    },
    noShared: {
      title: "Sin Protocolos Compartidos",
      description: "Los protocolos compartidos por miembros del equipo aparecerán aquí.",
      action: "Explorar Mis Protocolos"
    },
    noRecent: {
      title: "Sin Protocolos Recientes",
      description: "Los protocolos vistos recientemente aparecerán aquí.",
      action: "Explorar Todos los Protocolos"
    }
  },
  
  // Actions
  actions: {
    createNew: "Crear Nuevo Protocolo",
    importFromFile: "Importar desde Archivo",
    importFromTemplate: "Importar desde Plantilla",
    bulkActions: "Acciones Masivas",
    selectAll: "Seleccionar Todo",
    deselectAll: "Deseleccionar Todo",
    archiveSelected: "Archivar Seleccionados",
    deleteSelected: "Eliminar Seleccionados",
    exportSelected: "Exportar Seleccionados"
  },
  
  // Create Protocol Modal
  createModal: {
    title: "Crear Nuevo Protocolo",
    protocolName: "Nombre del Protocolo",
    protocolNumber: "Número de Protocolo",
    studyType: "Tipo de Estudio",
    phase: "Fase (Opcional)",
    therapeuticArea: "Área Terapéutica (Opcional)",
    description: "Descripción (Opcional)",
    startFromTemplate: "Comenzar desde Plantilla",
    startFromScratch: "Comenzar desde Cero",
    selectTemplate: "Seleccionar una plantilla...",
    create: "Crear Protocolo",
    creating: "Creando..."
  },
  
  // Import Modal
  importModal: {
    title: "Importar Protocolo",
    uploadFile: "Subir Archivo",
    dragAndDrop: "Arrastre y suelte un archivo de protocolo aquí",
    or: "o",
    browse: "Explorar Archivos",
    supportedFormats: "Formatos admitidos: JSON, XML, CSV",
    importing: "Importando...",
    importSuccess: "Protocolo importado exitosamente",
    importError: "Error al importar protocolo"
  },
  
  // Delete Confirmation
  deleteConfirm: {
    title: "¿Eliminar Protocolo?",
    message: "¿Está seguro de que desea eliminar \"{{name}}\"? Esta acción no se puede deshacer.",
    messageMultiple: "¿Está seguro de que desea eliminar {{count}} protocolos? Esta acción no se puede deshacer.",
    confirm: "Eliminar Protocolo",
    confirmMultiple: "Eliminar {{count}} Protocolos",
    cancel: "Cancelar",
    deleting: "Eliminando...",
    deleteSuccess: "Protocolo eliminado exitosamente",
    deleteSuccessMultiple: "{{count}} protocolos eliminados exitosamente",
    deleteError: "Error al eliminar protocolo"
  },
  
  // Archive Confirmation
  archiveConfirm: {
    title: "¿Archivar Protocolo?",
    message: "¿Está seguro de que desea archivar \"{{name}}\"?",
    messageMultiple: "¿Está seguro de que desea archivar {{count}} protocolos?",
    confirm: "Archivar Protocolo",
    confirmMultiple: "Archivar {{count}} Protocolos",
    cancel: "Cancelar",
    archiving: "Archivando...",
    archiveSuccess: "Protocolo archivado exitosamente",
    archiveSuccessMultiple: "{{count}} protocolos archivados exitosamente",
    archiveError: "Error al archivar protocolo"
  },
  
  // Duplicate Modal
  duplicateModal: {
    title: "Duplicar Protocolo",
    newName: "Nombre del Nuevo Protocolo",
    copyData: "Copiar Datos del Esquema",
    copySettings: "Copiar Configuración",
    duplicate: "Duplicar",
    duplicating: "Duplicando...",
    duplicateSuccess: "Protocolo duplicado exitosamente",
    duplicateError: "Error al duplicar protocolo"
  },
  
  // Share Modal
  shareModal: {
    title: "Compartir Protocolo",
    shareWith: "Compartir con",
    addPeople: "Agregar personas o equipos...",
    permissions: "Permisos",
    canView: "Puede Ver",
    canEdit: "Puede Editar",
    canAdmin: "Puede Administrar",
    sendNotification: "Enviar notificación por correo",
    share: "Compartir",
    sharing: "Compartiendo...",
    shareSuccess: "Protocolo compartido exitosamente",
    shareError: "Error al compartir protocolo",
    currentlySharedWith: "Actualmente compartido con",
    removeAccess: "Quitar Acceso"
  },
  
  // Export Options
  exportOptions: {
    title: "Exportar Protocolo",
    format: "Formato de Exportación",
    formatJSON: "JSON (Datos Completos)",
    formatPDF: "PDF (Documento)",
    formatCSV: "CSV (Solo Datos)",
    formatXML: "XML (Estándar)",
    includeSchema: "Incluir Esquema",
    includeData: "Incluir Datos Recopilados",
    includeMetadata: "Incluir Metadatos",
    includeAttachments: "Incluir Adjuntos",
    export: "Exportar",
    exporting: "Exportando...",
    exportSuccess: "Protocolo exportado exitosamente",
    exportError: "Error al exportar protocolo"
  },
  
  // Metadata
  metadata: {
    protocolId: "ID de Protocolo",
    version: "Versión",
    createdDate: "Creado",
    modifiedDate: "Última Modificación",
    createdBy: "Creado Por",
    modifiedBy: "Última Modificación Por",
    studyType: "Tipo de Estudio",
    phase: "Fase",
    therapeuticArea: "Área Terapéutica",
    targetEnrollment: "Inscripción Objetivo",
    primaryEndpoint: "Endpoint Primario",
    duration: "Duración del Estudio",
    sites: "Sitios",
    tags: "Etiquetas"
  }
};