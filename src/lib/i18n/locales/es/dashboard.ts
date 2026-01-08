export default {
  // === DASHBOARD & WORKSPACE MODULE ===
  
  // Main Header
  header: {
    title: "Panel de Control",
    subtitle: "Espacio de Trabajo de Inteligencia Clínica",
    description: "Su centro de comando de investigación",
    welcome: "Bienvenido de nuevo, {{name}}",
    lastAccess: "Último acceso {{date}}"
  },
  
  // Study Progress Section
  studyProgress: {
    title: "Progreso del Estudio",
    stepsCompleted: "{{completed}} de {{total}} pasos completados",
    percentComplete: "Completado",
    overallProgress: "Progreso General"
  },
  
  // Methodology Status Card
  methodologyStatus: {
    notConfigured: "Metodología del Estudio No Configurada",
    notConfiguredDescription: "Defina el diseño del estudio, la configuración del equipo y la hipótesis de investigación para desbloquear funciones basadas en metodología como protocolos de cegamiento y acceso basado en roles.",
    configureButton: "Configurar Metodología del Estudio",
    title: "Metodología del Estudio",
    configuredAt: "Configurado {{date}}",
    reconfigure: "Reconfigurar metodología",
    studyDesign: "Diseño del Estudio",
    teamConfiguration: "Configuración del Equipo",
    assignedPersonas: "Personas Asignadas",
    rolesCount: "{{count}} rol",
    rolesCount_plural: "{{count}} roles",
    teamConfigLocked: "Configuración del equipo bloqueada",
    blindingProtocol: "Protocolo de Cegamiento",
    studyUnblinded: "Estudio Desenmascarado",
    unblindedAt: "Desenmascarado {{date}}",
    active: "ACTIVO",
    unblinded: "DESENMASCARADO",
    unblindingReason: "Razón:",
    personasBlinded: "{{count}} persona está cegada",
    personasBlinded_plural: "{{count}} personas están cegadas",
    researchQuestion: "Pregunta de Investigación"
  },
  
  // Workflow Step Cards
  workflowSteps: {
    stepLabel: "Paso {{number}}",
    currentStep: "Paso Actual",
    complete: "Completado",
    inProgress: "En Progreso",
    notStarted: "No Iniciado",
    locked: "Bloqueado",
    progress: "Progreso",
    checklist: "Lista de Verificación",
    actionRequired: "Acción Requerida",
    viewDetails: "Ver Detalles",
    continueStep: "Continuar",
    startStep: "Iniciar Paso",
    nearlyDone: "Casi Terminado"
  },
  
  // Workflow Step Details & Actions
  workflowDetails: {
    // Personas step
    noPersonasConfigured: "No hay personas configuradas",
    personasConfigured: "{{count}} persona configurada",
    personasConfigured_plural: "{{count}} personas configuradas",
    viewPersonas: "Ver Personas",
    createPersonas: "Crear Personas",
    
    // Project setup step
    configureTeamBlinding: "Configurar equipo y cegamiento",
    teamSize: "Tamaño del equipo: {{size}}",
    blinding: "Cegamiento: {{type}}",
    viewSettings: "Ver Ajustes",
    configureSettings: "Configurar Ajustes",
    
    // Methodology step
    setupMethodologyEngine: "Configurar motor de metodología",
    methodologyConfigured: "Metodología configurada",
    configureMethodology: "Configurar Metodología",
    viewMethodology: "Ver Metodología",
    
    // Ethics/IRB step
    submitIRBApplication: "Enviar solicitud IRB",
    irbApproved: "IRB Aprobado",
    protocolNumber: "Protocolo: {{number}}",
    statusLabel: "Estado: {{status}}",
    viewIRBStatus: "Ver Estado IRB",
    submitIRB: "Enviar IRB",
    
    // Protocol step
    noProtocolCreated: "No se ha creado protocolo",
    protocolLabel: "Protocolo {{number}}",
    versionStatus: "Versión {{version}} ({{status}})",
    schemaBlocks: "{{count}} bloque de esquema",
    schemaBlocks_plural: "{{count}} bloques de esquema",
    openProtocolBuilder: "Abrir Constructor de Protocolo",
    createProtocol: "Crear Protocolo",
    viewLibrary: "Ver Biblioteca",
    
    // Database step
    noDataCollected: "No se han recopilado datos",
    recordsCollected: "{{count}} registro recopilado",
    recordsCollected_plural: "{{count}} registros recopilados",
    subjects: "{{count}} sujeto",
    subjects_plural: "{{count}} sujetos",
    enterMoreData: "Ingresar Más Datos",
    enterData: "Ingresar Datos",
    browseRecords: "Explorar Registros",
    
    // Statistics step
    collectDataFirst: "Recopile datos primero",
    readyToConfigureAnalytics: "Listo para configurar análisis",
    recordsAvailable: "{{count}} registro disponible",
    recordsAvailable_plural: "{{count}} registros disponibles",
    configureAnalytics: "Configurar Análisis",
    
    // Paper step
    featureComingSoon: "Función próximamente",
    viewRequirements: "Ver Requisitos"
  },
  
  // Quick Access Section
  quickAccess: {
    title: "Acceso Rápido",
    ethicsIRB: {
      title: "Ética e IRB",
      description: "Enviar y rastrear solicitudes IRB"
    },
    governance: {
      title: "Gobernanza",
      description: "Gestionar roles y permisos"
    },
    methodology: {
      title: "Metodología",
      description: "Generar automáticamente sección de metodología"
    }
  },
  
  // Need Help Section
  needHelp: {
    title: "¿Necesitas Ayuda?",
    documentation: {
      title: "Documentación",
      description: "Ver guías y mejores prácticas"
    },
    quickStart: {
      title: "Inicio Rápido",
      description: "Seguir el tutorial introductorio"
    },
    support: {
      title: "Soporte",
      description: "Contactar al equipo de investigación"
    }
  },
  
  // Specific Workflow Steps
  steps: {
    definePersonas: {
      title: "Definir Personas del Estudio",
      description: "Configure roles del equipo y permisos para su ensayo clínico",
      personasConfigured: "{{count}} persona configurada",
      personasConfigured_plural: "{{count}} personas configuradas",
      viewPersonas: "Ver Personas"
    },
    setupProject: {
      title: "Configurar Proyecto",
      description: "Configure ajustes del proyecto, equipo y cegamiento",
      configureSettings: "Configurar Ajustes",
      configureTeamBlinding: "Configurar equipo y cegamiento"
    },
    configureMethodology: {
      title: "Configurar Metodología",
      description: "Configure el motor de metodología para su ensayo clínico",
      configureButton: "Configurar Metodología",
      setupEngine: "Configurar motor de metodología"
    },
    submitIRB: {
      title: "Enviar Solicitud IRB",
      description: "Envíe su solicitud de ética/IRB para su aprobación",
      submitButton: "Enviar IRB",
      submitApplication: "Enviar solicitud IRB"
    },
    developProtocol: {
      title: "Desarrollar Protocolo",
      description: "Construya la estructura de su protocolo clínico con el Motor de Esquemas"
    },
    establishDatabase: {
      title: "Establecer Base de Datos",
      description: "Generar automáticamente la estructura de la base de datos y recopilar datos de pacientes"
    },
    configureAnalytics: {
      title: "Configurar Análisis",
      description: "Configure análisis estadísticos y elija métodos de visualización"
    },
    buildPaper: {
      title: "Construir Artículo de Investigación",
      description: "Generar documentación de investigación lista para publicación"
    }
  },
  
  // Workspace Shell
  workspace: {
    title: "Espacio de Trabajo",
    myWorkspace: "Mi Espacio de Trabajo",
    sharedWorkspaces: "Espacios Compartidos",
    recentWorkspaces: "Espacios Recientes",
    createWorkspace: "Crear Nuevo Espacio",
    switchWorkspace: "Cambiar Espacio",
    workspaceSettings: "Configuración del Espacio",
    members: "Miembros",
    activity: "Actividad",
    starred: "Destacados",
    archive: "Archivo"
  },
  
  // Quick Actions
  quickActions: {
    title: "Acciones Rápidas",
    newProtocol: "Nuevo Protocolo",
    importData: "Importar Datos",
    exportReport: "Exportar Informe",
    runAnalysis: "Ejecutar Análisis",
    scheduleJob: "Programar Tarea",
    inviteCollaborator: "Invitar Colaborador",
    generateMethodology: "Generar Metodología",
    viewAllActions: "Ver Todas las Acciones"
  },
  
  // Summary Cards
  summary: {
    title: "Resumen",
    activeProtocols: "Protocolos Activos",
    totalParticipants: "Total de Participantes",
    dataQuality: "Calidad de Datos",
    pendingReviews: "Revisiones Pendientes",
    recentActivity: "Actividad Reciente",
    upcomingMilestones: "Hitos Próximos",
    teamMembers: "Miembros del Equipo",
    storageUsed: "Almacenamiento Usado"
  },
  
  // Recent Activity
  activity: {
    title: "Actividad Reciente",
    viewAll: "Ver Toda la Actividad",
    today: "Hoy",
    yesterday: "Ayer",
    thisWeek: "Esta Semana",
    older: "Anterior",
    noActivity: "Sin actividad reciente",
    protocolCreated: "Protocolo creado",
    protocolUpdated: "Protocolo actualizado",
    dataImported: "Datos importados",
    reportGenerated: "Informe generado",
    collaboratorAdded: "Colaborador agregado",
    milestoneCompleted: "Hito completado",
    commentAdded: "Comentario agregado",
    fileUploaded: "Archivo cargado",
    analysisCompleted: "Análisis completado"
  },
  
  // Projects Grid
  projects: {
    title: "Mis Proyectos",
    allProjects: "Todos los Proyectos",
    activeProjects: "Proyectos Activos",
    completedProjects: "Proyectos Completados",
    archivedProjects: "Proyectos Archivados",
    createProject: "Crear Proyecto",
    projectStatus: "Estado",
    lastModified: "Última Modificación",
    owner: "Propietario",
    progress: "Progreso",
    dueDate: "Fecha de Vencimiento",
    viewProject: "Ver Proyecto",
    editProject: "Editar Proyecto",
    archiveProject: "Archivar Proyecto",
    deleteProject: "Eliminar Proyecto",
    noProjects: "No se encontraron proyectos",
    createFirstProject: "Cree su primer proyecto"
  },
  
  // Protocols Section
  protocols: {
    title: "Protocolos",
    myProtocols: "Mis Protocolos",
    sharedProtocols: "Compartidos Conmigo",
    templates: "Plantillas",
    drafts: "Borradores",
    published: "Publicados",
    underReview: "En Revisión",
    approved: "Aprobados",
    createProtocol: "Crear Protocolo",
    viewProtocol: "Ver Protocolo",
    editProtocol: "Editar Protocolo",
    duplicateProtocol: "Duplicar",
    deleteProtocol: "Eliminar Protocolo",
    noProtocols: "No se encontraron protocolos",
    protocolCount: "{{count}} protocolo",
    protocolCount_plural: "{{count}} protocolos"
  },
  
  // Data Overview
  data: {
    title: "Resumen de Datos",
    totalRecords: "Total de Registros",
    recordsToday: "Registros Hoy",
    recordsThisWeek: "Registros Esta Semana",
    dataCompleteness: "Completitud de Datos",
    validationStatus: "Estado de Validación",
    qualityScore: "Puntuación de Calidad",
    lastSync: "Última Sincronización",
    pendingValidation: "Validación Pendiente",
    viewDataManagement: "Ver Gestión de Datos",
    importData: "Importar Datos",
    exportData: "Exportar Datos"
  },
  
  // Analytics Summary
  analytics: {
    title: "Analítica",
    viewDashboard: "Ver Panel Completo",
    keyMetrics: "Métricas Clave",
    enrollment: "Inscripción",
    retention: "Retención",
    completion: "Tasa de Finalización",
    adverseEvents: "Eventos Adversos",
    dataCollection: "Recolección de Datos",
    sitePerformance: "Rendimiento del Sitio",
    generateReport: "Generar Informe",
    scheduleReport: "Programar Informe"
  },
  
  // Notifications
  notifications: {
    title: "Notificaciones",
    viewAll: "Ver Todas las Notificaciones",
    markAllRead: "Marcar Todas como Leídas",
    noNotifications: "Sin notificaciones nuevas",
    unreadCount: "{{count}} sin leer",
    newComment: "Nuevo comentario en {{item}}",
    reviewRequest: "Solicitud de revisión para {{item}}",
    milestoneApproaching: "Hito próximo: {{name}}",
    dataQualityAlert: "Alerta de calidad de datos",
    collaboratorInvite: "Invitación de colaborador",
    protocolApproved: "Protocolo aprobado",
    reportReady: "Informe listo para descargar",
    systemUpdate: "Actualización del sistema disponible"
  },
  
  // Tasks & Reminders
  tasks: {
    title: "Tareas y Recordatorios",
    myTasks: "Mis Tareas",
    assignedToMe: "Asignadas a Mí",
    createdByMe: "Creadas por Mí",
    completed: "Completadas",
    overdue: "Vencidas",
    dueToday: "Vencen Hoy",
    dueThisWeek: "Vencen Esta Semana",
    noDueDate: "Sin Fecha de Vencimiento",
    addTask: "Agregar Tarea",
    markComplete: "Marcar como Completada",
    editTask: "Editar Tarea",
    deleteTask: "Eliminar Tarea",
    assignTo: "Asignar a",
    priority: "Prioridad",
    high: "Alta",
    medium: "Media",
    low: "Baja",
    noTasks: "No se encontraron tareas"
  },
  
  // Team & Collaboration
  team: {
    title: "Equipo",
    viewTeam: "Ver Equipo",
    teamMembers: "Miembros del Equipo",
    activeMembers: "Miembros Activos",
    pendingInvitations: "Invitaciones Pendientes",
    inviteMember: "Invitar Miembro",
    role: "Rol",
    lastActive: "Última Actividad",
    online: "En Línea",
    offline: "Desconectado",
    viewProfile: "Ver Perfil",
    sendMessage: "Enviar Mensaje",
    removeFromTeam: "Eliminar del Equipo"
  },
  
  // Calendar & Timeline
  calendar: {
    title: "Calendario",
    viewCalendar: "Ver Calendario Completo",
    upcomingEvents: "Eventos Próximos",
    today: "Hoy",
    thisWeek: "Esta Semana",
    thisMonth: "Este Mes",
    noEvents: "Sin eventos programados",
    addEvent: "Agregar Evento",
    milestone: "Hito",
    meeting: "Reunión",
    deadline: "Fecha Límite",
    visit: "Visita de Estudio",
    reminder: "Recordatorio"
  },
  
  // Widgets
  widgets: {
    title: "Widgets",
    addWidget: "Agregar Widget",
    removeWidget: "Eliminar Widget",
    customizeLayout: "Personalizar Diseño",
    resetLayout: "Restablecer a Predeterminado",
    saveLayout: "Guardar Diseño",
    protocolOverview: "Resumen del Protocolo",
    dataQuality: "Calidad de Datos",
    enrollment: "Estado de Inscripción",
    milestones: "Hitos",
    recentActivity: "Actividad Reciente",
    teamActivity: "Actividad del Equipo",
    quickStats: "Estadísticas Rápidas",
    alerts: "Alertas"
  },
  
  // Search & Filters
  search: {
    title: "Búsqueda",
    searchPlaceholder: "Buscar protocolos, datos, informes...",
    recentSearches: "Búsquedas Recientes",
    clearHistory: "Limpiar Historial",
    filters: "Filtros",
    filterBy: "Filtrar por",
    sortBy: "Ordenar por",
    dateRange: "Rango de Fechas",
    status: "Estado",
    owner: "Propietario",
    type: "Tipo",
    clearFilters: "Limpiar Filtros",
    applyFilters: "Aplicar Filtros",
    noResults: "No se encontraron resultados",
    searchResults: "{{count}} resultado encontrado",
    searchResults_plural: "{{count}} resultados encontrados"
  },
  
  // Help & Support
  help: {
    title: "Ayuda y Soporte",
    documentation: "Documentación",
    tutorials: "Tutoriales",
    videoGuides: "Guías en Video",
    keyboardShortcuts: "Atajos de Teclado",
    contactSupport: "Contactar Soporte",
    reportIssue: "Reportar un Problema",
    featureRequest: "Solicitud de Función",
    whatsNew: "Novedades",
    releaseNotes: "Notas de Lanzamiento",
    communityForum: "Foro de la Comunidad"
  },
  
  // User Menu
  user: {
    title: "Cuenta",
    profile: "Mi Perfil",
    settings: "Configuración",
    preferences: "Preferencias",
    language: "Idioma",
    theme: "Tema",
    notifications: "Configuración de Notificaciones",
    privacy: "Privacidad",
    security: "Seguridad",
    billing: "Facturación",
    logout: "Cerrar Sesión",
    darkMode: "Modo Oscuro",
    lightMode: "Modo Claro",
    autoMode: "Auto"
  },
  
  // Common Actions
  actions: {
    view: "Ver",
    edit: "Editar",
    delete: "Eliminar",
    share: "Compartir",
    export: "Exportar",
    duplicate: "Duplicar",
    archive: "Archivar",
    restore: "Restaurar",
    refresh: "Actualizar",
    filter: "Filtrar",
    sort: "Ordenar",
    search: "Buscar",
    create: "Crear",
    save: "Guardar",
    cancel: "Cancelar",
    close: "Cerrar"
  },
  
  // Status Labels
  status: {
    active: "Activo",
    inactive: "Inactivo",
    pending: "Pendiente",
    completed: "Completado",
    inProgress: "En Progreso",
    draft: "Borrador",
    published: "Publicado",
    archived: "Archivado",
    approved: "Aprobado",
    rejected: "Rechazado",
    underReview: "En Revisión"
  },
  
  // Empty States
  empty: {
    noData: "No hay datos disponibles",
    noProjects: "No se encontraron proyectos",
    noProtocols: "No se encontraron protocolos",
    noActivity: "Sin actividad reciente",
    noNotifications: "Sin notificaciones nuevas",
    noTasks: "Sin tareas asignadas",
    noResults: "No se encontraron resultados",
    getStarted: "Comience creando su primer {{item}}",
    createNew: "Crear Nuevo {{item}}"
  },
  
  // Time & Dates
  time: {
    justNow: "Justo ahora",
    minutesAgo: "Hace {{count}} minuto",
    minutesAgo_plural: "Hace {{count}} minutos",
    hoursAgo: "Hace {{count}} hora",
    hoursAgo_plural: "Hace {{count}} horas",
    daysAgo: "Hace {{count}} día",
    daysAgo_plural: "Hace {{count}} días",
    weeksAgo: "Hace {{count}} semana",
    weeksAgo_plural: "Hace {{count}} semanas",
    monthsAgo: "Hace {{count}} mes",
    monthsAgo_plural: "Hace {{count}} meses",
    yearsAgo: "Hace {{count}} año",
    yearsAgo_plural: "Hace {{count}} años"
  }
};