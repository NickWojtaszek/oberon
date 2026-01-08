export default {
  // === PROJECT SETUP & MANAGEMENT ===
  
  // Header
  header: {
    title: "Configuración del Proyecto",
    description: "Configure su proyecto de investigación",
    projectLibrary: "Biblioteca de Proyectos",
    newProject: "Nuevo Proyecto",
    currentProject: "Proyecto Actual"
  },
  
  // Project Creation
  create: {
    title: "Crear Nuevo Proyecto",
    projectName: "Nombre del Proyecto",
    projectNamePlaceholder: "Ingrese el nombre del proyecto...",
    projectCode: "Código del Proyecto",
    projectCodePlaceholder: "ej., PROY-2026-001",
    description: "Descripción del Proyecto",
    descriptionPlaceholder: "Describa su proyecto de investigación...",
    studyDesign: "Diseño del Estudio",
    therapeuticArea: "Área Terapéutica",
    startDate: "Fecha de Inicio",
    endDate: "Fecha de Finalización (Estimada)",
    principalInvestigator: "Investigador Principal",
    sponsor: "Patrocinador",
    create: "Crear Proyecto",
    creating: "Creando...",
    createSuccess: "Proyecto creado exitosamente",
    createError: "Error al crear el proyecto"
  },
  
  // Study Design Options
  studyDesign: {
    selectDesign: "Seleccionar diseño del estudio...",
    rct: "Ensayo Controlado Aleatorizado",
    observational: "Estudio Observacional",
    cohort: "Estudio de Cohortes",
    caseControl: "Estudio de Casos y Controles",
    crossSectional: "Estudio Transversal",
    longitudinal: "Estudio Longitudinal",
    singleArm: "Estudio de Brazo Único",
    crossover: "Estudio Cruzado",
    factorial: "Diseño Factorial",
    adaptive: "Diseño Adaptativo",
    pragmatic: "Ensayo Pragmático",
    registry: "Estudio de Registro"
  },
  
  // Therapeutic Areas
  therapeuticAreas: {
    selectArea: "Seleccionar área terapéutica...",
    oncology: "Oncología",
    cardiology: "Cardiología",
    neurology: "Neurología",
    immunology: "Inmunología",
    infectious: "Enfermedades Infecciosas",
    respiratory: "Respiratorio",
    endocrinology: "Endocrinología",
    gastroenterology: "Gastroenterología",
    nephrology: "Nefrología",
    hematology: "Hematología",
    rheumatology: "Reumatología",
    dermatology: "Dermatología",
    psychiatry: "Psiquiatría",
    pediatrics: "Pediatría",
    other: "Otro"
  },
  
  // Project Overview
  overview: {
    title: "Resumen del Proyecto",
    details: "Detalles del Proyecto",
    status: "Estado",
    progress: "Progreso",
    team: "Equipo",
    protocols: "Protocolos",
    sites: "Sitios",
    participants: "Participantes",
    milestones: "Hitos",
    timeline: "Cronograma",
    budget: "Presupuesto",
    documents: "Documentos"
  },
  
  // Team Management
  team: {
    title: "Gestión del Equipo",
    addMember: "Agregar Miembro del Equipo",
    inviteMember: "Invitar Miembro",
    members: "Miembros del Equipo",
    roles: "Roles",
    permissions: "Permisos",
    memberName: "Nombre",
    memberEmail: "Correo Electrónico",
    memberRole: "Rol",
    memberStatus: "Estado",
    joinDate: "Fecha de Incorporación",
    lastActive: "Última Actividad",
    actions: "Acciones",
    editMember: "Editar Miembro",
    removeMember: "Eliminar Miembro",
    resendInvite: "Reenviar Invitación",
    invitationSent: "Invitación enviada",
    invitationPending: "Pendiente",
    active: "Activo",
    inactive: "Inactivo"
  },
  
  // Team Roles
  roles: {
    principalInvestigator: "Investigador Principal",
    coInvestigator: "Coinvestigador",
    projectManager: "Gerente de Proyecto",
    dataManager: "Gerente de Datos",
    statistician: "Estadístico",
    clinicalResearchCoordinator: "Coordinador de Investigación Clínica",
    researchAssociate: "Asociado de Investigación",
    dataEntrySpecialist: "Especialista en Entrada de Datos",
    qualityAssurance: "Aseguramiento de Calidad",
    regulatoryAffairs: "Asuntos Regulatorios",
    monitor: "Monitor",
    auditor: "Auditor",
    viewer: "Visualizador",
    custom: "Rol Personalizado"
  },
  
  // Permission Levels
  permissions: {
    full: "Acceso Completo",
    edit: "Puede Editar",
    view: "Solo Ver",
    comment: "Puede Comentar",
    manage: "Puede Gestionar",
    admin: "Administrador",
    restricted: "Acceso Restringido",
    customPermissions: "Permisos Personalizados",
    protocolAccess: "Acceso a Protocolos",
    dataAccess: "Acceso a Datos",
    analyticsAccess: "Acceso a Analítica",
    exportAccess: "Acceso a Exportación",
    userManagement: "Gestión de Usuarios",
    projectSettings: "Configuración del Proyecto"
  },
  
  // Invite Member Modal
  inviteModal: {
    title: "Invitar Miembro del Equipo",
    email: "Dirección de Correo Electrónico",
    emailPlaceholder: "miembro@institucion.edu",
    role: "Asignar Rol",
    selectRole: "Seleccionar un rol...",
    permissions: "Establecer Permisos",
    message: "Mensaje Personal (Opcional)",
    messagePlaceholder: "Agregar un mensaje personal a la invitación...",
    sendInvite: "Enviar Invitación",
    sending: "Enviando...",
    inviteSuccess: "Invitación enviada exitosamente",
    inviteError: "Error al enviar la invitación",
    multipleEmails: "Ingresar múltiples correos (separados por comas)",
    copyInviteLink: "Copiar Enlace de Invitación",
    linkCopied: "Enlace copiado al portapapeles"
  },
  
  // Methodology Configuration
  methodology: {
    title: "Configuración de Metodología",
    description: "Configure la metodología de su estudio",
    blinding: "Cegamiento",
    randomization: "Aleatorización",
    allocation: "Asignación",
    masking: "Enmascaramiento",
    controlType: "Tipo de Control",
    interventionModel: "Modelo de Intervención",
    primaryPurpose: "Propósito Principal",
    phase: "Fase del Estudio",
    enrollment: "Inscripción Objetivo",
    duration: "Duración del Estudio",
    followUp: "Período de Seguimiento"
  },
  
  // Blinding Options
  blinding: {
    none: "Ninguno (Etiqueta Abierta)",
    single: "Simple Ciego",
    double: "Doble Ciego",
    triple: "Triple Ciego",
    quadruple: "Cuádruple Ciego"
  },
  
  // Randomization Methods
  randomization: {
    none: "No Aleatorizado",
    simple: "Aleatorización Simple",
    block: "Aleatorización por Bloques",
    stratified: "Aleatorización Estratificada",
    adaptive: "Aleatorización Adaptativa",
    minimization: "Minimización"
  },
  
  // Allocation Methods
  allocation: {
    randomized: "Aleatorizado",
    nonRandomized: "No Aleatorizado",
    notApplicable: "N/A"
  },
  
  // Control Types
  controlTypes: {
    placebo: "Controlado con Placebo",
    active: "Comparador Activo",
    noConcurrent: "Sin Control Concurrente",
    doseComparison: "Comparación de Dosis",
    historical: "Control Histórico"
  },
  
  // Intervention Models
  interventionModels: {
    parallel: "Asignación Paralela",
    crossover: "Asignación Cruzada",
    factorial: "Asignación Factorial",
    sequential: "Asignación Secuencial",
    single: "Asignación de Grupo Único"
  },
  
  // Study Phases
  phases: {
    earlyPhase1: "Fase Temprana 1",
    phase1: "Fase 1",
    phase1Phase2: "Fase 1/Fase 2",
    phase2: "Fase 2",
    phase2Phase3: "Fase 2/Fase 3",
    phase3: "Fase 3",
    phase4: "Fase 4",
    notApplicable: "N/A"
  },
  
  // Project Settings
  settings: {
    title: "Configuración del Proyecto",
    general: "Configuración General",
    collaboration: "Colaboración",
    notifications: "Notificaciones",
    dataManagement: "Gestión de Datos",
    security: "Seguridad y Privacidad",
    integration: "Integraciones",
    advanced: "Configuración Avanzada"
  },
  
  // General Settings
  generalSettings: {
    projectName: "Nombre del Proyecto",
    projectCode: "Código del Proyecto",
    description: "Descripción",
    visibility: "Visibilidad",
    visibilityPrivate: "Privado - Solo miembros del equipo",
    visibilityOrganization: "Organización - Todos los miembros",
    visibilityPublic: "Público - Cualquiera con enlace",
    archive: "Archivar Proyecto",
    archiveWarning: "Los proyectos archivados son de solo lectura",
    delete: "Eliminar Proyecto",
    deleteWarning: "Esta acción no se puede deshacer",
    timezone: "Zona Horaria",
    language: "Idioma Predeterminado",
    dateFormat: "Formato de Fecha",
    timeFormat: "Formato de Hora"
  },
  
  // Collaboration Settings
  collaborationSettings: {
    allowComments: "Permitir Comentarios",
    allowSuggestions: "Permitir Sugerencias",
    requireApproval: "Requerir Aprobación para Cambios",
    enableVersionControl: "Habilitar Control de Versiones",
    autoSave: "Guardado Automático",
    autoSaveInterval: "Intervalo de Guardado Automático (minutos)",
    conflictResolution: "Resolución de Conflictos",
    conflictManual: "Resolución Manual",
    conflictAutoMerge: "Fusión Automática Cuando Sea Posible",
    activityTracking: "Seguimiento de Actividad",
    trackAllChanges: "Rastrear Todos los Cambios",
    trackMajorChanges: "Rastrear Solo Cambios Importantes"
  },
  
  // Notification Settings
  notificationSettings: {
    emailNotifications: "Notificaciones por Correo",
    inAppNotifications: "Notificaciones en la Aplicación",
    notifyOnComment: "Nuevos Comentarios",
    notifyOnMention: "Menciones",
    notifyOnAssignment: "Asignaciones de Tareas",
    notifyOnUpdate: "Actualizaciones de Protocolos",
    notifyOnApproval: "Solicitudes de Aprobación",
    notifyOnDeadline: "Plazos Próximos",
    notifyOnMilestone: "Completación de Hitos",
    digestFrequency: "Frecuencia de Resumen",
    digestRealtime: "Tiempo Real",
    digestDaily: "Resumen Diario",
    digestWeekly: "Resumen Semanal",
    digestNever: "Nunca"
  },
  
  // Data Management Settings
  dataManagementSettings: {
    dataRetention: "Período de Retención de Datos",
    retentionIndefinite: "Indefinido",
    retention1Year: "1 Año",
    retention3Years: "3 Años",
    retention5Years: "5 Años",
    retention7Years: "7 Años",
    retention10Years: "10 Años",
    backupFrequency: "Frecuencia de Respaldo",
    backupDaily: "Diario",
    backupWeekly: "Semanal",
    backupMonthly: "Mensual",
    exportFormat: "Formato de Exportación Predeterminado",
    auditLog: "Registro de Auditoría",
    auditLogEnabled: "Habilitar Registro de Auditoría",
    auditLogRetention: "Retención de Registro de Auditoría (días)"
  },
  
  // Security Settings
  securitySettings: {
    twoFactorAuth: "Autenticación de Dos Factores",
    requireTwoFactor: "Requerir 2FA para Todos los Miembros",
    sessionTimeout: "Tiempo de Espera de Sesión (minutos)",
    ipWhitelist: "Lista Blanca de IP",
    allowedIPs: "Direcciones IP Permitidas",
    dataEncryption: "Cifrado de Datos",
    encryptionAtRest: "Cifrado en Reposo",
    encryptionInTransit: "Cifrado en Tránsito",
    accessControl: "Control de Acceso",
    restrictByIP: "Restringir Acceso por IP",
    restrictByTime: "Restringir Acceso por Tiempo",
    passwordPolicy: "Política de Contraseñas",
    minPasswordLength: "Longitud Mínima",
    requireUppercase: "Requerir Mayúsculas",
    requireNumbers: "Requerir Números",
    requireSpecialChars: "Requerir Caracteres Especiales"
  },
  
  // Milestones
  milestones: {
    title: "Hitos del Proyecto",
    addMilestone: "Agregar Hito",
    editMilestone: "Editar Hito",
    deleteMilestone: "Eliminar Hito",
    milestoneName: "Nombre del Hito",
    description: "Descripción",
    dueDate: "Fecha de Vencimiento",
    status: "Estado",
    assignedTo: "Asignado a",
    priority: "Prioridad",
    priorityHigh: "Alta",
    priorityMedium: "Media",
    priorityLow: "Baja",
    statusNotStarted: "No Iniciado",
    statusInProgress: "En Progreso",
    statusCompleted: "Completado",
    statusDelayed: "Retrasado",
    completion: "Completación",
    overdue: "Vencido",
    upcoming: "Próximo",
    completed: "Completado"
  },
  
  // Timeline
  timeline: {
    title: "Cronograma del Proyecto",
    viewMode: "Modo de Vista",
    viewDay: "Día",
    viewWeek: "Semana",
    viewMonth: "Mes",
    viewQuarter: "Trimestre",
    viewYear: "Año",
    today: "Hoy",
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    filter: "Filtrar",
    export: "Exportar Cronograma",
    ganttChart: "Diagrama de Gantt",
    calendarView: "Vista de Calendario"
  },
  
  // Project Actions
  actions: {
    saveProject: "Guardar Proyecto",
    publishProject: "Publicar Proyecto",
    archiveProject: "Archivar Proyecto",
    deleteProject: "Eliminar Proyecto",
    duplicateProject: "Duplicar Proyecto",
    exportProject: "Exportar Proyecto",
    shareProject: "Compartir Proyecto",
    printSummary: "Imprimir Resumen",
    viewHistory: "Ver Historial",
    restoreVersion: "Restaurar Versión"
  },
  
  // Validation Messages
  validation: {
    nameRequired: "El nombre del proyecto es obligatorio",
    codeRequired: "El código del proyecto es obligatorio",
    codeInvalid: "Formato de código de proyecto inválido",
    dateInvalid: "Fecha inválida",
    endDateBeforeStart: "La fecha de finalización debe ser posterior a la fecha de inicio",
    emailRequired: "El correo electrónico es obligatorio",
    emailInvalid: "Dirección de correo electrónico inválida",
    roleRequired: "El rol es obligatorio",
    enrollmentInvalid: "La inscripción debe ser un número positivo",
    durationInvalid: "La duración debe ser un número positivo"
  },
  
  // Confirmation Dialogs
  confirmations: {
    archiveProject: "¿Archivar este proyecto?",
    archiveMessage: "Los proyectos archivados se vuelven de solo lectura. Puede restaurarlos más tarde.",
    deleteProject: "¿Eliminar este proyecto?",
    deleteMessage: "Esto eliminará permanentemente el proyecto y todos los datos asociados. Esta acción no se puede deshacer.",
    removeMember: "¿Eliminar miembro del equipo?",
    removeMemberMessage: "{{name}} perderá el acceso a este proyecto inmediatamente.",
    leaveProject: "¿Salir de este proyecto?",
    leaveProjectMessage: "Ya no tendrá acceso a este proyecto."
  },
  
  // Status Messages
  messages: {
    projectSaved: "Proyecto guardado exitosamente",
    projectPublished: "Proyecto publicado exitosamente",
    projectArchived: "Proyecto archivado exitosamente",
    projectDeleted: "Proyecto eliminado exitosamente",
    projectRestored: "Proyecto restaurado exitosamente",
    memberAdded: "Miembro del equipo agregado exitosamente",
    memberRemoved: "Miembro del equipo eliminado exitosamente",
    memberUpdated: "Miembro del equipo actualizado exitosamente",
    settingsSaved: "Configuración guardada exitosamente",
    milestoneCreated: "Hito creado exitosamente",
    milestoneUpdated: "Hito actualizado exitosamente",
    milestoneDeleted: "Hito eliminado exitosamente"
  }
};
