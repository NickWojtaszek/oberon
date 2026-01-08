/**
 * Empty States Translation - Spanish
 * Centralized translations for all empty state screens
 */

export default {
  // === COMMON PRESETS ===
  
  // No Project Selected
  noProjectSelected: {
    title: "No hay proyecto seleccionado",
    description: "Seleccione un proyecto de la biblioteca para ver sus detalles y gestionar sus datos de investigación.",
    action: "Ir a la biblioteca de proyectos"
  },
  
  // No Protocols
  noProtocols: {
    title: "Aún no hay protocolos",
    description: "Cree su primer protocolo para definir variables de estudio, puntos finales y flujos de trabajo de recopilación de datos.",
    action: "Crear nuevo protocolo"
  },
  
  // No Projects
  noProjects: {
    title: "Aún no hay proyectos",
    description: "Cree su primer proyecto para comenzar a organizar su investigación clínica y datos de ensayos.",
    action: "Crear nuevo proyecto"
  },
  
  // No Data
  noData: {
    title: "No hay datos disponibles",
    description: "Comience a recopilar datos configurando su esquema de base de datos e importando registros.",
    action: "Configurar base de datos"
  },
  
  // No Manuscripts
  noManuscripts: {
    title: "Aún no hay manuscritos",
    description: "Cree su primer manuscrito para comenzar a escribir y formatear su artículo de investigación.",
    action: "Crear nuevo manuscrito"
  },
  
  // No Analytics
  noAnalytics: {
    title: "No hay análisis disponibles",
    description: "Ejecute su primer análisis después de recopilar datos y definir sus puntos finales estadísticos.",
    action: "Ir a la base de datos"
  },
  
  // No IRB Submissions
  noIRBSubmissions: {
    title: "No hay envíos al CEI",
    description: "Envíe su protocolo para revisión ética y realice un seguimiento del proceso de aprobación.",
    action: "Nuevo envío"
  },
  
  // No Team Members
  noTeamMembers: {
    title: "No hay miembros del equipo",
    description: "Invite a colaboradores a unirse a su proyecto de investigación y gestione los roles del equipo.",
    action: "Invitar miembro del equipo"
  },
  
  // No AI Personas
  noPersonas: {
    title: "No hay personas de IA activas",
    description: "Active personas de IA para obtener asistencia inteligente con la validación de protocolos y el cumplimiento.",
    action: "Explorar biblioteca de personas"
  },
  
  // === SEARCH & FILTER STATES ===
  
  noSearchResults: {
    title: "No se encontraron resultados",
    description: "Intente ajustar sus términos de búsqueda o filtros para encontrar lo que busca.",
    action: null
  },
  
  noFilterResults: {
    title: "No hay elementos coincidentes",
    description: "Ningún elemento coincide con sus criterios de filtro actuales. Intente borrar algunos filtros.",
    action: "Borrar filtros"
  },
  
  // === LOADING & ERROR STATES ===
  
  loading: {
    title: "Cargando...",
    description: "Espere mientras recuperamos sus datos.",
    action: null
  },
  
  error: {
    title: "Algo salió mal",
    description: "Encontramos un error al cargar estos datos. Intente actualizar la página.",
    action: "Actualizar página"
  },
  
  offline: {
    title: "Está desconectado",
    description: "Algunas funciones no están disponibles sin conexión. Conéctese a Internet para sincronizar sus datos.",
    action: "Reintentar conexión"
  },
  
  // === PERMISSION STATES ===
  
  noPermission: {
    title: "Acceso restringido",
    description: "No tiene permiso para ver este contenido. Póngase en contacto con su administrador para obtener acceso.",
    action: null
  },
  
  readOnlyMode: {
    title: "Modo de solo lectura",
    description: "Puede ver este contenido pero no puede realizar cambios con sus permisos actuales.",
    action: null
  },
  
  // === COMPLETION STATES ===
  
  allComplete: {
    title: "¡Todo listo!",
    description: "Ha completado todos los elementos de esta sección. ¡Excelente trabajo!",
    action: null
  },
  
  emptyInbox: {
    title: "¡Bandeja vacía!",
    description: "Está al día. No hay notificaciones o tareas pendientes.",
    action: null
  },
  
  // === WORKFLOW-SPECIFIC STATES ===
  
  protocolWorkbench: {
    title: "Seleccione un protocolo",
    description: "Elija un protocolo de la biblioteca para comenzar a editar o crear uno nuevo.",
    action: "Ir a la biblioteca de protocolos"
  },
  
  academicWriting: {
    title: "No hay manuscrito seleccionado",
    description: "Seleccione un manuscrito de su biblioteca o cree uno nuevo para comenzar a escribir.",
    action: "Ir a escritura académica"
  },
  
  ethicsBoard: {
    title: "No hay envío seleccionado",
    description: "Seleccione un envío al CEI para ver detalles y seguir el estado de aprobación.",
    action: "Ir a comité de ética"
  },
  
  database: {
    title: "No hay esquema definido",
    description: "Defina su esquema de base de datos primero antes de ingresar o explorar datos.",
    action: "Ir al constructor de esquemas"
  },
  
  analytics: {
    title: "No hay análisis seleccionado",
    description: "Seleccione un proyecto y conjunto de datos para comenzar su análisis estadístico.",
    action: "Seleccionar proyecto"
  }
};
