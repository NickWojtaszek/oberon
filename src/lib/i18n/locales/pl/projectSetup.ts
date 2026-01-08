export default {
  // === PROJECT SETUP & MANAGEMENT ===
  
  // Header
  header: {
    title: "Konfiguracja Projektu",
    description: "Skonfiguruj swój projekt badawczy",
    projectLibrary: "Biblioteka Projektów",
    newProject: "Nowy Projekt",
    currentProject: "Bieżący Projekt"
  },
  
  // Project Creation
  create: {
    title: "Utwórz Nowy Projekt",
    projectName: "Nazwa Projektu",
    projectNamePlaceholder: "Wprowadź nazwę projektu...",
    projectCode: "Kod Projektu",
    projectCodePlaceholder: "np. PROJ-2026-001",
    description: "Opis Projektu",
    descriptionPlaceholder: "Opisz swój projekt badawczy...",
    studyDesign: "Projekt Badania",
    therapeuticArea: "Obszar Terapeutyczny",
    startDate: "Data Rozpoczęcia",
    endDate: "Data Zakończenia (Szacowana)",
    principalInvestigator: "Główny Badacz",
    sponsor: "Sponsor",
    create: "Utwórz Projekt",
    creating: "Tworzenie...",
    createSuccess: "Projekt utworzony pomyślnie",
    createError: "Nie udało się utworzyć projektu"
  },
  
  // Study Design Options
  studyDesign: {
    selectDesign: "Wybierz projekt badania...",
    rct: "Randomizowane Badanie Kontrolowane",
    observational: "Badanie Obserwacyjne",
    cohort: "Badanie Kohortowe",
    caseControl: "Badanie Kliniczno-Kontrolne",
    crossSectional: "Badanie Przekrojowe",
    longitudinal: "Badanie Podłużne",
    singleArm: "Badanie Jednoramienne",
    crossover: "Badanie Krzyżowe",
    factorial: "Projekt Czynnikowy",
    adaptive: "Projekt Adaptacyjny",
    pragmatic: "Badanie Pragmatyczne",
    registry: "Badanie Rejestrowe"
  },
  
  // Therapeutic Areas
  therapeuticAreas: {
    selectArea: "Wybierz obszar terapeutyczny...",
    oncology: "Onkologia",
    cardiology: "Kardiologia",
    neurology: "Neurologia",
    immunology: "Immunologia",
    infectious: "Choroby Zakaźne",
    respiratory: "Układ Oddechowy",
    endocrinology: "Endokrynologia",
    gastroenterology: "Gastroenterologia",
    nephrology: "Nefrologia",
    hematology: "Hematologia",
    rheumatology: "Reumatologia",
    dermatology: "Dermatologia",
    psychiatry: "Psychiatria",
    pediatrics: "Pediatria",
    other: "Inne"
  },
  
  // Project Overview
  overview: {
    title: "Przegląd Projektu",
    details: "Szczegóły Projektu",
    status: "Status",
    progress: "Postęp",
    team: "Zespół",
    protocols: "Protokoły",
    sites: "Ośrodki",
    participants: "Uczestnicy",
    milestones: "Kamienie Milowe",
    timeline: "Oś Czasu",
    budget: "Budżet",
    documents: "Dokumenty"
  },
  
  // Team Management
  team: {
    title: "Zarządzanie Zespołem",
    addMember: "Dodaj Członka Zespołu",
    inviteMember: "Zaproś Członka",
    members: "Członkowie Zespołu",
    roles: "Role",
    permissions: "Uprawnienia",
    memberName: "Imię i Nazwisko",
    memberEmail: "Email",
    memberRole: "Rola",
    memberStatus: "Status",
    joinDate: "Data Dołączenia",
    lastActive: "Ostatnia Aktywność",
    actions: "Akcje",
    editMember: "Edytuj Członka",
    removeMember: "Usuń Członka",
    resendInvite: "Wyślij Ponownie Zaproszenie",
    invitationSent: "Zaproszenie wysłane",
    invitationPending: "Oczekujące",
    active: "Aktywny",
    inactive: "Nieaktywny"
  },
  
  // Team Roles
  roles: {
    principalInvestigator: "Główny Badacz",
    coInvestigator: "Współbadacz",
    projectManager: "Kierownik Projektu",
    dataManager: "Menedżer Danych",
    statistician: "Statystyk",
    clinicalResearchCoordinator: "Koordynator Badań Klinicznych",
    researchAssociate: "Współpracownik Badawczy",
    dataEntrySpecialist: "Specjalista ds. Wprowadzania Danych",
    qualityAssurance: "Zapewnienie Jakości",
    regulatoryAffairs: "Sprawy Regulacyjne",
    monitor: "Monitor",
    auditor: "Audytor",
    viewer: "Przeglądający",
    custom: "Rola Niestandardowa"
  },
  
  // Permission Levels
  permissions: {
    full: "Pełny Dostęp",
    edit: "Może Edytować",
    view: "Tylko Odczyt",
    comment: "Może Komentować",
    manage: "Może Zarządzać",
    admin: "Administrator",
    restricted: "Dostęp Ograniczony",
    customPermissions: "Uprawnienia Niestandardowe",
    protocolAccess: "Dostęp do Protokołów",
    dataAccess: "Dostęp do Danych",
    analyticsAccess: "Dostęp do Analityki",
    exportAccess: "Dostęp do Eksportu",
    userManagement: "Zarządzanie Użytkownikami",
    projectSettings: "Ustawienia Projektu"
  },
  
  // Invite Member Modal
  inviteModal: {
    title: "Zaproś Członka Zespołu",
    email: "Adres Email",
    emailPlaceholder: "czlonek@instytucja.edu",
    role: "Przypisz Rolę",
    selectRole: "Wybierz rolę...",
    permissions: "Ustaw Uprawnienia",
    message: "Wiadomość Osobista (Opcjonalne)",
    messagePlaceholder: "Dodaj osobistą wiadomość do zaproszenia...",
    sendInvite: "Wyślij Zaproszenie",
    sending: "Wysyłanie...",
    inviteSuccess: "Zaproszenie wysłane pomyślnie",
    inviteError: "Nie udało się wysłać zaproszenia",
    multipleEmails: "Wprowadź wiele adresów email (oddzielonych przecinkami)",
    copyInviteLink: "Kopiuj Link Zaproszenia",
    linkCopied: "Link skopiowany do schowka"
  },
  
  // Methodology Configuration
  methodology: {
    title: "Konfiguracja Metodologii",
    description: "Skonfiguruj metodologię badania",
    blinding: "Zaślepienie",
    randomization: "Randomizacja",
    allocation: "Alokacja",
    masking: "Maskowanie",
    controlType: "Typ Kontroli",
    interventionModel: "Model Interwencji",
    primaryPurpose: "Główny Cel",
    phase: "Faza Badania",
    enrollment: "Docelowa Liczba Uczestników",
    duration: "Czas Trwania Badania",
    followUp: "Okres Obserwacji"
  },
  
  // Blinding Options
  blinding: {
    none: "Brak (Otwarty)",
    single: "Pojedynczo Zaślepione",
    double: "Podwójnie Zaślepione",
    triple: "Potrójnie Zaślepione",
    quadruple: "Poczwórnie Zaślepione"
  },
  
  // Randomization Methods
  randomization: {
    none: "Nierandomizowane",
    simple: "Prosta Randomizacja",
    block: "Randomizacja Blokowa",
    stratified: "Randomizacja Warstwowa",
    adaptive: "Randomizacja Adaptacyjna",
    minimization: "Minimalizacja"
  },
  
  // Allocation Methods
  allocation: {
    randomized: "Randomizowane",
    nonRandomized: "Nierandomizowane",
    notApplicable: "Nie dotyczy"
  },
  
  // Control Types
  controlTypes: {
    placebo: "Kontrolowane Placebo",
    active: "Aktywny Komparator",
    noConcurrent: "Brak Kontroli Współbieżnej",
    doseComparison: "Porównanie Dawek",
    historical: "Kontrola Historyczna"
  },
  
  // Intervention Models
  interventionModels: {
    parallel: "Przypisanie Równoległe",
    crossover: "Przypisanie Krzyżowe",
    factorial: "Przypisanie Czynnikowe",
    sequential: "Przypisanie Sekwencyjne",
    single: "Przypisanie Pojedynczej Grupy"
  },
  
  // Study Phases
  phases: {
    earlyPhase1: "Wczesna Faza 1",
    phase1: "Faza 1",
    phase1Phase2: "Faza 1/Faza 2",
    phase2: "Faza 2",
    phase2Phase3: "Faza 2/Faza 3",
    phase3: "Faza 3",
    phase4: "Faza 4",
    notApplicable: "Nie dotyczy"
  },
  
  // Project Settings
  settings: {
    title: "Ustawienia Projektu",
    general: "Ustawienia Ogólne",
    collaboration: "Współpraca",
    notifications: "Powiadomienia",
    dataManagement: "Zarządzanie Danymi",
    security: "Bezpieczeństwo i Prywatność",
    integration: "Integracje",
    advanced: "Ustawienia Zaawansowane"
  },
  
  // General Settings
  generalSettings: {
    projectName: "Nazwa Projektu",
    projectCode: "Kod Projektu",
    description: "Opis",
    visibility: "Widoczność",
    visibilityPrivate: "Prywatny - Tylko członkowie zespołu",
    visibilityOrganization: "Organizacja - Wszyscy członkowie",
    visibilityPublic: "Publiczny - Każdy z linkiem",
    archive: "Archiwizuj Projekt",
    archiveWarning: "Zarchiwizowane projekty są tylko do odczytu",
    delete: "Usuń Projekt",
    deleteWarning: "Tej operacji nie można cofnąć",
    timezone: "Strefa Czasowa",
    language: "Domyślny Język",
    dateFormat: "Format Daty",
    timeFormat: "Format Czasu"
  },
  
  // Collaboration Settings
  collaborationSettings: {
    allowComments: "Zezwalaj na Komentarze",
    allowSuggestions: "Zezwalaj na Sugestie",
    requireApproval: "Wymagaj Zatwierdzenia Zmian",
    enableVersionControl: "Włącz Kontrolę Wersji",
    autoSave: "Automatyczny Zapis",
    autoSaveInterval: "Interwał Automatycznego Zapisu (minuty)",
    conflictResolution: "Rozwiązywanie Konfliktów",
    conflictManual: "Ręczne Rozwiązanie",
    conflictAutoMerge: "Automatyczne Scalanie Gdy Możliwe",
    activityTracking: "Śledzenie Aktywności",
    trackAllChanges: "Śledź Wszystkie Zmiany",
    trackMajorChanges: "Śledź Tylko Główne Zmiany"
  },
  
  // Notification Settings
  notificationSettings: {
    emailNotifications: "Powiadomienia Email",
    inAppNotifications: "Powiadomienia w Aplikacji",
    notifyOnComment: "Nowe Komentarze",
    notifyOnMention: "Wzmianki",
    notifyOnAssignment: "Przypisania Zadań",
    notifyOnUpdate: "Aktualizacje Protokołów",
    notifyOnApproval: "Prośby o Zatwierdzenie",
    notifyOnDeadline: "Nadchodzące Terminy",
    notifyOnMilestone: "Ukończenia Kamieni Milowych",
    digestFrequency: "Częstotliwość Podsumowań",
    digestRealtime: "W Czasie Rzeczywistym",
    digestDaily: "Podsumowanie Dzienne",
    digestWeekly: "Podsumowanie Tygodniowe",
    digestNever: "Nigdy"
  },
  
  // Data Management Settings
  dataManagementSettings: {
    dataRetention: "Okres Przechowywania Danych",
    retentionIndefinite: "Bezterminowo",
    retention1Year: "1 Rok",
    retention3Years: "3 Lata",
    retention5Years: "5 Lat",
    retention7Years: "7 Lat",
    retention10Years: "10 Lat",
    backupFrequency: "Częstotliwość Kopii Zapasowych",
    backupDaily: "Codziennie",
    backupWeekly: "Co Tydzień",
    backupMonthly: "Co Miesiąc",
    exportFormat: "Domyślny Format Eksportu",
    auditLog: "Dziennik Audytu",
    auditLogEnabled: "Włącz Rejestrowanie Audytu",
    auditLogRetention: "Przechowywanie Dziennika Audytu (dni)"
  },
  
  // Security Settings
  securitySettings: {
    twoFactorAuth: "Uwierzytelnianie Dwuskładnikowe",
    requireTwoFactor: "Wymagaj 2FA dla Wszystkich Członków",
    sessionTimeout: "Limit Czasu Sesji (minuty)",
    ipWhitelist: "Biała Lista IP",
    allowedIPs: "Dozwolone Adresy IP",
    dataEncryption: "Szyfrowanie Danych",
    encryptionAtRest: "Szyfrowanie w Spoczynku",
    encryptionInTransit: "Szyfrowanie w Przesyłaniu",
    accessControl: "Kontrola Dostępu",
    restrictByIP: "Ogranicz Dostęp według IP",
    restrictByTime: "Ogranicz Dostęp według Czasu",
    passwordPolicy: "Polityka Haseł",
    minPasswordLength: "Minimalna Długość",
    requireUppercase: "Wymagaj Wielkich Liter",
    requireNumbers: "Wymagaj Cyfr",
    requireSpecialChars: "Wymagaj Znaków Specjalnych"
  },
  
  // Milestones
  milestones: {
    title: "Kamienie Milowe Projektu",
    addMilestone: "Dodaj Kamień Milowy",
    editMilestone: "Edytuj Kamień Milowy",
    deleteMilestone: "Usuń Kamień Milowy",
    milestoneName: "Nazwa Kamienia Milowego",
    description: "Opis",
    dueDate: "Termin",
    status: "Status",
    assignedTo: "Przypisany Do",
    priority: "Priorytet",
    priorityHigh: "Wysoki",
    priorityMedium: "Średni",
    priorityLow: "Niski",
    statusNotStarted: "Nie Rozpoczęty",
    statusInProgress: "W Toku",
    statusCompleted: "Ukończony",
    statusDelayed: "Opóźniony",
    completion: "Ukończenie",
    overdue: "Zaległy",
    upcoming: "Nadchodzący",
    completed: "Ukończony"
  },
  
  // Timeline
  timeline: {
    title: "Oś Czasu Projektu",
    viewMode: "Tryb Widoku",
    viewDay: "Dzień",
    viewWeek: "Tydzień",
    viewMonth: "Miesiąc",
    viewQuarter: "Kwartał",
    viewYear: "Rok",
    today: "Dzisiaj",
    zoomIn: "Powiększ",
    zoomOut: "Pomniejsz",
    filter: "Filtruj",
    export: "Eksportuj Oś Czasu",
    ganttChart: "Wykres Gantta",
    calendarView: "Widok Kalendarza"
  },
  
  // Project Actions
  actions: {
    saveProject: "Zapisz Projekt",
    publishProject: "Opublikuj Projekt",
    archiveProject: "Archiwizuj Projekt",
    deleteProject: "Usuń Projekt",
    duplicateProject: "Duplikuj Projekt",
    exportProject: "Eksportuj Projekt",
    shareProject: "Udostępnij Projekt",
    printSummary: "Drukuj Podsumowanie",
    viewHistory: "Zobacz Historię",
    restoreVersion: "Przywróć Wersję"
  },
  
  // Validation Messages
  validation: {
    nameRequired: "Nazwa projektu jest wymagana",
    codeRequired: "Kod projektu jest wymagany",
    codeInvalid: "Nieprawidłowy format kodu projektu",
    dateInvalid: "Nieprawidłowa data",
    endDateBeforeStart: "Data zakończenia musi być po dacie rozpoczęcia",
    emailRequired: "Email jest wymagany",
    emailInvalid: "Nieprawidłowy adres email",
    roleRequired: "Rola jest wymagana",
    enrollmentInvalid: "Liczba uczestników musi być liczbą dodatnią",
    durationInvalid: "Czas trwania musi być liczbą dodatnią"
  },
  
  // Confirmation Dialogs
  confirmations: {
    archiveProject: "Zarchiwizować ten projekt?",
    archiveMessage: "Zarchiwizowane projekty stają się tylko do odczytu. Możesz je przywrócić później.",
    deleteProject: "Usunąć ten projekt?",
    deleteMessage: "To spowoduje trwałe usunięcie projektu i wszystkich powiązanych danych. Tej operacji nie można cofnąć.",
    removeMember: "Usunąć członka zespołu?",
    removeMemberMessage: "{{name}} natychmiast utraci dostęp do tego projektu.",
    leaveProject: "Opuścić ten projekt?",
    leaveProjectMessage: "Nie będziesz już miał dostępu do tego projektu."
  },
  
  // Status Messages
  messages: {
    projectSaved: "Projekt zapisany pomyślnie",
    projectPublished: "Projekt opublikowany pomyślnie",
    projectArchived: "Projekt zarchiwizowany pomyślnie",
    projectDeleted: "Projekt usunięty pomyślnie",
    projectRestored: "Projekt przywrócony pomyślnie",
    memberAdded: "Członek zespołu dodany pomyślnie",
    memberRemoved: "Członek zespołu usunięty pomyślnie",
    memberUpdated: "Członek zespołu zaktualizowany pomyślnie",
    settingsSaved: "Ustawienia zapisane pomyślnie",
    milestoneCreated: "Kamień milowy utworzony pomyślnie",
    milestoneUpdated: "Kamień milowy zaktualizowany pomyślnie",
    milestoneDeleted: "Kamień milowy usunięty pomyślnie"
  }
};
