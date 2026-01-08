export default {
  title: "Personas AI",
  subtitle: "Asistentes Inteligentes de Validación",
  managerTitle: "Gestor de Personas AI",
  managerSubtitle: "{{active}} de {{total}} personas activas",
  
  protocolAuditor: {
    name: "Auditor de Protocolo",
    description: "Validación impulsada por IA de documentos de protocolo, estructura de esquemas y validación cruzada para cumplimiento regulatorio",
    scoreLabel: "Puntuación de Cumplimiento"
  },
  
  schemaArchitect: {
    name: "Arquitecto de Esquema",
    description: "Recomendaciones de variables específicas por tipo de estudio y validación de estructura de esquema",
    scoreLabel: "Cobertura de Variables"
  },
  
  statisticalAdvisor: {
    name: "Asesor de Métodos Estadísticos",
    description: "Métodos estadísticos apropiados para el tipo de estudio y validación del plan de análisis",
    scoreLabel: "Puntuación de Rigor Estadístico"
  },
  
  dataQualitySentinel: {
    name: "Centinela de Calidad de Datos",
    description: "Validación de datos en tiempo real, verificaciones de rango y aplicación de consistencia lógica",
    scoreLabel: "Puntuación de Calidad de Datos"
  },
  
  ethicsCompliance: {
    name: "IA de Cumplimiento Ético y CEI",
    description: "Preparación para presentación al CEI, validación de consentimiento informado y verificación de cumplimiento regulatorio",
    scoreLabel: "Puntuación de Cumplimiento Ético"
  },
  
  safetyVigilance: {
    name: "IA de Vigilancia de Seguridad",
    description: "Monitoreo de eventos adversos, cumplimiento de informes de SAE y detección de señales de seguridad",
    scoreLabel: "Puntuación de Monitoreo de Seguridad"
  },
  
  endpointValidator: {
    name: "Validador de Endpoints Clínicos",
    description: "Soporte para adjudicación de endpoints y validación de eventos clínicos",
    scoreLabel: "Puntuación de Calidad de Endpoints"
  },
  
  amendmentAdvisor: {
    name: "Asesor de Enmiendas de Protocolo",
    description: "Análisis de impacto de enmiendas y orientación sobre clasificación regulatoria",
    scoreLabel: "Evaluación de Riesgo de Enmiendas"
  },
  
  irbCompliance: {
    name: "Monitor de Cumplimiento del CEI",
    description: "Valida la preparación para la presentación al CEI y asegura la documentación de todos los elementos requeridos del protocolo",
    scoreLabel: "Puntuación de Cumplimiento del CEI"
  },
  
  status: {
    active: "Activo",
    inactive: "Inactivo",
    validating: "Validando...",
    ready: "Listo",
    required: "Requerido",
    optional: "Opcional"
  },
  
  actions: {
    enableAll: "Habilitar Todos",
    disableAll: "Deshabilitar No Requeridos",
    viewReport: "Ver Informe Completo",
    exportReport: "Exportar Informe",
    viewTrends: "Ver Tendencias",
    configure: "Configurar"
  },
  
  configuration: {
    studyConfig: "Configuración del Estudio",
    studyType: "Tipo de Estudio",
    selectStudyType: "Seleccionar tipo de estudio...",
    regulatoryFrameworks: "Marcos Regulatorios",
    language: "Idioma",
    selectLanguage: "Seleccionar idioma..."
  },
  
  studyTypes: {
    rct: "Ensayo Controlado Aleatorizado (ECA)",
    observational: "Estudio Observacional",
    singleArm: "Estudio de Brazo Único",
    diagnostic: "Estudio de Diagnóstico",
    registry: "Registro / Datos del Mundo Real",
    phase1: "Fase I Búsqueda de Dosis",
    phase2: "Fase II Eficacia",
    phase3: "Fase III Confirmatorio",
    phase4: "Fase IV Post-Comercialización",
    medicalDevice: "Estudio de Dispositivo Médico"
  },
  
  regulatoryFrameworks: {
    FDA: "FDA (Estados Unidos)",
    EMA: "EMA (Unión Europea)",
    PMDA: "PMDA (Japón)",
    "ICH-GCP": "ICH-GCP (Internacional)",
    HIPAA: "HIPAA (Privacidad de Datos)"
  },
  
  scores: {
    excellent: "Excelente",
    good: "Bueno",
    fair: "Aceptable",
    needsWork: "Necesita Mejora",
    critical: "Problemas Críticos",
    notScored: "No Evaluado"
  },
  
  library: {
    title: "Biblioteca de Personas de IA Validadas",
    subtitle: "{{count}} personas certificadas listas para uso en producción • Todas las configuraciones son inmutables y auditables",
    filterByType: "Filtrar por tipo",
    sortBy: "Ordenar por:",
    createPersona: "Crear Persona",
    allPersonas: "Todas las Personas",
    systemBuilt: "INTEGRADA EN SISTEMA",
    nonEditable: "NO EDITABLE",
    locked: "BLOQUEADA",
    validated: "Validada",
    platformCore: "Núcleo de Plataforma",
    cloneToDraft: "Clonar a Borrador",
    cloning: "Clonando...",
    hideDetails: "Ocultar Detalles",
    viewDetails: "Ver Detalles",
    auditLog: "Registro de Auditoría",
    exportPdf: "Exportar PDF",
    systemPersonasCannotBeCloned: "Las personas del sistema no se pueden clonar",
    configurationSnapshot: "Instantánea de Configuración",
    immutableRecord: "Registro inmutable de todas las reglas y políticas de gobernanza",
    systemLevelGuardrail: "PROTECCIÓN DE NIVEL DE SISTEMA",
    systemBuiltDescription: "Esta persona está integrada en la plataforma y alimenta la Capa de Lógica Estadística en el Taller de Protocolo. Valida automáticamente diseños de esquemas, aplica estándares clínicos (NIHSS, mRS, endpoints de mortalidad), bloquea pruebas estadísticas inválidas y genera un registro de auditoría inmutable para cumplimiento regulatorio.",
    autoDetection: "Auto-Detección",
    autoDetectionDescription: "NIHSS, mRS, endpoints de mortalidad, resultados binarios",
    validation: "Validación",
    validationDescription: "Compatibilidad de pruebas estadísticas, aplicación de tipo de datos",
    interpretationRules: "Reglas de Interpretación",
    disallowedInferences: "Inferencias No Permitidas",
    languageControls: "Controles de Lenguaje",
    tone: "Tono",
    confidence: "Confianza",
    neverWriteFullSections: "Nunca escribir secciones completas",
    noAnthropomorphism: "Sin antropomorfismo",
    forbiddenPhrases: "Frases Prohibidas",
    outcomeFocus: "Enfoque en Resultados",
    primaryEndpoint: "Endpoint Primario",
    citationPolicy: "Política de Citación",
    mandatoryEvidence: "Evidencia obligatoria",
    strength: "Fuerza",
    scope: "Alcance",
    immutabilityWarning: "Registro Inmutable",
    immutabilityDescription: "Configuración bloqueada por política RLS de base de datos. Clone para crear una nueva versión borrador.",
    noCertifiedPersonas: "Sin Personas Certificadas",
    noCertifiedPersonasDescription: "Bloquee y valide personas en la sección de Gobernanza para certificarlas para uso en producción.",
    lockedAt: "Bloqueada {{date}}",
    version: "v{{version}}",
    clonedTo: "Clonando \"{{name}}\" a v{{version}} Borrador...",
    auditTimeline: "Línea de Tiempo de Auditoría",
    created: "Creada",
    validatedAction: "Validada",
    lockedForProduction: "Bloqueada para Producción",
    by: "por {{user}}",
    at: "a las {{time}}"
  },
  
  types: {
    analysis: "Análisis y Revisión",
    statistical: "Experto Estadístico",
    writing: "Escritura Académica",
    safety: "Revisión de Seguridad",
    validation: "Validación de Esquema"
  },
  
  tones: {
    socratic: "Cuestionamiento Socrático",
    neutral: "Observador Neutral",
    academic: "Académico Formal"
  },
  
  confidenceLevels: {
    "1": "Máxima Cautela",
    "2": "Conservador",
    "3": "Equilibrado",
    "4": "Asertivo",
    "5": "Definitivo"
  },
  
  citationStrengths: {
    "1": "Relajado",
    "2": "Moderado",
    "3": "Estándar",
    "4": "Estricto",
    "5": "Máximo"
  },
  
  knowledgeBaseScopes: {
    currentProject: "Proyecto Actual",
    allProjects: "Todos los Proyectos"
  },
  
  sortOptions: {
    name: "Nombre",
    date: "Fecha de Creación",
    type: "Tipo de Persona",
    version: "Versión"
  },
  
  roles: {
    contributor: {
      name: "Rol de Colaborador",
      description: "Puedes crear y probar personas. Usa \"Solicitar Validación\" para enviar para aprobación del Científico Principal. Nombres informales permitidos durante la fase de borrador."
    },
    leadScientist: {
      name: "Rol de Científico Principal",
      description: "Puedes bloquear personas para uso en producción. Se requiere nomenclatura profesional (más de 5 caracteres). Acceso completo a validación y entorno de pruebas de simulación."
    },
    admin: {
      name: "Rol de Administrador",
      description: "Acceso completo al sistema, incluidos registros de auditoría, historial de versiones y archivado de personas. Puede anular personas bloqueadas y administrar todos los usuarios."
    }
  },
  
  guidance: {
    title: "Guía de Persona",
    identity: {
      title: "Identidad y Propósito",
      description: "Define la identidad central y el enfoque terapéutico de tu persona de IA.",
      tips: [
        "Selecciona un tipo de persona que coincida con tus necesidades de validación",
        "La nomenclatura profesional (más de 5 caracteres) es obligatoria para producción",
        "El área terapéutica y la fase del estudio afectan las recomendaciones de IA"
      ]
    },
    interpretation: {
      title: "Reglas de Interpretación",
      description: "Controla lo que la IA puede y no puede inferir.",
      tips: [
        "Define límites claros para la interpretación de IA",
        "Los conflictos entre reglas permitidas/no permitidas bloquearán la validación",
        "Estas reglas garantizan el cumplimiento normativo y la seguridad del paciente"
      ]
    },
    language: {
      title: "Controles de Lenguaje",
      description: "Configura el tono, nivel de confianza y restricciones de escritura.",
      tips: [
        "El tono socrático fomenta el pensamiento crítico",
        "La confianza conservadora añade precaución de seguridad",
        "Las frases prohibidas aseguran el cumplimiento del lenguaje regulatorio"
      ]
    },
    outcome: {
      title: "Enfoque en Resultados",
      description: "Especifica los criterios principales de valoración y las reglas de validación estadística.",
      tips: [
        "El criterio principal de valoración debe coincidir con el diseño del estudio",
        "Los objetivos estadísticos guían las recomendaciones de análisis",
        "Los umbrales de éxito deben ser clínicamente significativos"
      ]
    },
    citation: {
      title: "Política de Citación",
      description: "Aplica estándares de evidencia y requisitos de fuentes.",
      tips: [
        "Las citas obligatorias aseguran el rastro de auditoría",
        "Las fuentes revisadas por pares añaden rigor científico",
        "El máximo de oraciones sin cita previene la especulación"
      ]
    },
    validation: {
      title: "Estado de Validación",
      description: "Revisa y resuelve errores de validación antes de bloquear.",
      tips: [
        "Todos los fallos críticos deben ser resueltos",
        "La validación de nombre aplica estándares profesionales",
        "El bloqueo crea un registro de auditoría inmutable"
      ]
    }
  }
};