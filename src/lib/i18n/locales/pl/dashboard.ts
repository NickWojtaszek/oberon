export default {
  // === DASHBOARD & WORKSPACE MODULE ===
  
  // Main Header
  header: {
    title: "Panel Główny",
    subtitle: "Przestrzeń Robocza Inteligencji Klinicznej",
    description: "Twoje centrum dowodzenia badaniami",
    welcome: "Witaj ponownie, {{name}}",
    lastAccess: "Ostatni dostęp {{date}}"
  },
  
  // Study Progress Section
  studyProgress: {
    title: "Postęp Badania",
    stepsCompleted: "{{completed}} z {{total}} kroków ukończono",
    percentComplete: "Ukończono",
    overallProgress: "Całkowity Postęp"
  },
  
  // Methodology Status Card
  methodologyStatus: {
    notConfigured: "Metodologia Badania Nieskonfigurowana",
    notConfiguredDescription: "Zdefiniuj projekt badania, konfigurację zespołu i hipotezę badawczą, aby odblokować funkcje oparte na metodologii, takie jak protokoły zaślepiania i dostęp oparty na rolach.",
    configureButton: "Skonfiguruj Metodologię Badania",
    title: "Metodologia Badania",
    configuredAt: "Skonfigurowano {{date}}",
    reconfigure: "Przekonfiguruj metodologię",
    studyDesign: "Projekt Badania",
    teamConfiguration: "Konfiguracja Zespołu",
    assignedPersonas: "Przypisane Persony",
    rolesCount: "{{count}} rola",
    rolesCount_plural: "{{count}} ról",
    teamConfigLocked: "Konfiguracja zespołu zablokowana",
    blindingProtocol: "Protokół Zaślepiania",
    studyUnblinded: "Badanie Odślepione",
    unblindedAt: "Odślepiono {{date}}",
    active: "AKTYWNE",
    unblinded: "ODŚLEPIONE",
    unblindingReason: "Powód:",
    personasBlinded: "{{count}} persona jest zaślepiona",
    personasBlinded_plural: "{{count}} person jest zaślepionych",
    researchQuestion: "Pytanie Badawcze"
  },
  
  // Workflow Step Cards
  workflowSteps: {
    stepLabel: "Krok {{number}}",
    currentStep: "Bieżący Krok",
    complete: "Ukończone",
    inProgress: "W Trakcie",
    notStarted: "Nierozpoczęte",
    locked: "Zablokowane",
    progress: "Postęp",
    checklist: "Lista Kontrolna",
    actionRequired: "Wymagana Akcja",
    viewDetails: "Zobacz Szczegóły",
    continueStep: "Kontynuuj",
    startStep: "Rozpocznij Krok",
    nearlyDone: "Blisko końca"
  },
  
  // Workflow Step Details & Actions
  workflowDetails: {
    // Personas step
    noPersonasConfigured: "Brak skonfigurowanych person",
    personasConfigured: "Skonfigurowano {{count}} personę",
    personasConfigured_plural: "Skonfigurowano {{count}} person",
    viewPersonas: "Zobacz Persony",
    createPersonas: "Utwórz Persony",
    
    // Project setup step
    configureTeamBlinding: "Skonfiguruj zespół i zaślepianie",
    teamSize: "Wielkość zespołu: {{size}}",
    blinding: "Zaślepianie: {{type}}",
    viewSettings: "Zobacz Ustawienia",
    configureSettings: "Skonfiguruj Ustawienia",
    
    // Methodology step
    setupMethodologyEngine: "Ustaw silnik metodologii",
    methodologyConfigured: "Metodologia skonfigurowana",
    configureMethodology: "Skonfiguruj Metodologię",
    viewMethodology: "Zobacz Metodologię",
    
    // Ethics/IRB step
    submitIRBApplication: "Prześlij wniosek IRB",
    irbApproved: "IRB zatwierdzony",
    protocolNumber: "Protokół: {{number}}",
    statusLabel: "Status: {{status}}",
    viewIRBStatus: "Zobacz Status IRB",
    submitIRB: "Prześlij IRB",
    
    // Protocol step
    noProtocolCreated: "Nie utworzono protokołu",
    protocolLabel: "Protokół {{number}}",
    versionStatus: "Wersja {{version}} ({{status}})",
    schemaBlocks: "{{count}} blok schematu",
    schemaBlocks_plural: "{{count}} bloków schematu",
    openProtocolBuilder: "Otwórz Kreator Protokołu",
    createProtocol: "Utwórz Protokół",
    viewLibrary: "Zobacz Bibliotekę",
    
    // Database step
    noDataCollected: "Nie zebrano danych",
    recordsCollected: "Zebrano {{count}} rekord",
    recordsCollected_plural: "Zebrano {{count}} rekordów",
    subjects: "{{count}} uczestnik",
    subjects_plural: "{{count}} uczestników",
    enterMoreData: "Wprowadź Więcej Danych",
    enterData: "Wprowadź Dane",
    browseRecords: "Przeglądaj Rekordy",
    
    // Statistics step
    collectDataFirst: "Najpierw zbierz dane",
    readyToConfigureAnalytics: "Gotowe do konfiguracji analiz",
    recordsAvailable: "Dostępny {{count}} rekord",
    recordsAvailable_plural: "Dostępnych {{count}} rekordów",
    configureAnalytics: "Skonfiguruj Analitykę",
    
    // Paper step
    featureComingSoon: "Funkcja wkrótce dostępna",
    viewRequirements: "Zobacz Wymagania"
  },
  
  // Quick Access Section
  quickAccess: {
    title: "Szybki Dostęp",
    ethicsIRB: {
      title: "Etyka i IRB",
      description: "Prześlij i śledź wnioski IRB"
    },
    governance: {
      title: "Zarządzanie",
      description: "Zarządzaj rolami i uprawnieniami"
    },
    methodology: {
      title: "Metodologia",
      description: "Automatycznie generuj sekcję metodologii"
    }
  },
  
  // Need Help Section
  needHelp: {
    title: "Potrzebujesz Pomocy?",
    documentation: {
      title: "Dokumentacja",
      description: "Zobacz przewodniki i najlepsze praktyki"
    },
    quickStart: {
      title: "Szybki Start",
      description: "Podążaj za samouczkiem wprowadzającym"
    },
    support: {
      title: "Wsparcie",
      description: "Skontaktuj się z zespołem badawczym"
    }
  },
  
  // Specific Workflow Steps
  steps: {
    definePersonas: {
      title: "Zdefiniuj Persony Badania",
      description: "Skonfiguruj role zespołu i uprawnienia dla swojego badania klinicznego",
      personasConfigured: "Skonfigurowano {{count}} personę",
      personasConfigured_plural: "Skonfigurowano {{count}} person",
      viewPersonas: "Zobacz Persony"
    },
    setupProject: {
      title: "Konfiguracja Projektu",
      description: "Skonfiguruj ustawienia projektu, zespół i zaślepianie",
      configureSettings: "Skonfiguruj Ustawienia",
      configureTeamBlinding: "Skonfiguruj zespół i zaślepianie"
    },
    configureMethodology: {
      title: "Konfiguracja Metodologii",
      description: "Ustaw silnik metodologii dla swojego badania klinicznego",
      configureButton: "Skonfiguruj Metodologię",
      setupEngine: "Ustaw silnik metodologii"
    },
    submitIRB: {
      title: "Prześlij Wniosek IRB",
      description: "Prześlij wniosek etyczny/IRB do zatwierdzenia",
      submitButton: "Prześlij IRB",
      submitApplication: "Prześlij wniosek IRB"
    },
    developProtocol: {
      title: "Opracuj Protokół",
      description: "Zbuduj strukturę protokołu klinicznego za pomocą Silnika Schematów"
    },
    establishDatabase: {
      title: "Ustanów Bazę Danych",
      description: "Automatycznie wygeneruj strukturę bazy danych i zbieraj dane pacjentów"
    },
    configureAnalytics: {
      title: "Skonfiguruj Analitykę",
      description: "Ustaw analizy statystyczne i wybierz metody wizualizacji"
    },
    buildPaper: {
      title: "Zbuduj Artykuł Naukowy",
      description: "Wygeneruj dokumentację badawczą gotową do publikacji"
    }
  },
  
  // Workspace Shell
  workspace: {
    title: "Przestrzeń Robocza",
    myWorkspace: "Moja Przestrzeń Robocza",
    sharedWorkspaces: "Udostępnione Przestrzenie",
    recentWorkspaces: "Ostatnie Przestrzenie",
    createWorkspace: "Utwórz Nową Przestrzeń",
    switchWorkspace: "Przełącz Przestrzeń",
    workspaceSettings: "Ustawienia Przestrzeni",
    members: "Członkowie",
    activity: "Aktywność",
    starred: "Oznaczone gwiazdką",
    archive: "Archiwum"
  },
  
  // Quick Actions
  quickActions: {
    title: "Szybkie Akcje",
    newProtocol: "Nowy Protokół",
    importData: "Importuj Dane",
    exportReport: "Eksportuj Raport",
    runAnalysis: "Uruchom Analizę",
    scheduleJob: "Zaplanuj Zadanie",
    inviteCollaborator: "Zaproś Współpracownika",
    generateMethodology: "Wygeneruj Metodologię",
    viewAllActions: "Zobacz Wszystkie Akcje"
  },
  
  // Summary Cards
  summary: {
    title: "Przegląd",
    activeProtocols: "Aktywne Protokoły",
    totalParticipants: "Wszyscy Uczestnicy",
    dataQuality: "Jakość Danych",
    pendingReviews: "Oczekujące Przeglądy",
    recentActivity: "Ostatnia Aktywność",
    upcomingMilestones: "Nadchodzące Kamienie Milowe",
    teamMembers: "Członkowie Zespołu",
    storageUsed: "Wykorzystana Przestrzeń"
  },
  
  // Recent Activity
  activity: {
    title: "Ostatnia Aktywność",
    viewAll: "Zobacz Całą Aktywność",
    today: "Dzisiaj",
    yesterday: "Wczoraj",
    thisWeek: "Ten Tydzień",
    older: "Starsze",
    noActivity: "Brak ostatniej aktywności",
    protocolCreated: "Utworzono protokół",
    protocolUpdated: "Zaktualizowano protokół",
    dataImported: "Zaimportowano dane",
    reportGenerated: "Wygenerowano raport",
    collaboratorAdded: "Dodano współpracownika",
    milestoneCompleted: "Ukończono kamień milowy",
    commentAdded: "Dodano komentarz",
    fileUploaded: "Przesłano plik",
    analysisCompleted: "Zakończono analizę"
  },
  
  // Projects Grid
  projects: {
    title: "Moje Projekty",
    allProjects: "Wszystkie Projekty",
    activeProjects: "Aktywne Projekty",
    completedProjects: "Zakończone Projekty",
    archivedProjects: "Zarchiwizowane Projekty",
    createProject: "Utwórz Projekt",
    projectStatus: "Status",
    lastModified: "Ostatnia Modyfikacja",
    owner: "Właściciel",
    progress: "Postęp",
    dueDate: "Termin",
    viewProject: "Zobacz Projekt",
    editProject: "Edytuj Projekt",
    archiveProject: "Archiwizuj Projekt",
    deleteProject: "Usuń Projekt",
    noProjects: "Nie znaleziono projektów",
    createFirstProject: "Utwórz swój pierwszy projekt"
  },
  
  // Protocols Section
  protocols: {
    title: "Protokoły",
    myProtocols: "Moje Protokoły",
    sharedProtocols: "Udostępnione Mi",
    templates: "Szablony",
    drafts: "Wersje Robocze",
    published: "Opublikowane",
    underReview: "W Przeglądzie",
    approved: "Zatwierdzone",
    createProtocol: "Utwórz Protokół",
    viewProtocol: "Zobacz Protokół",
    editProtocol: "Edytuj Protokół",
    duplicateProtocol: "Duplikuj",
    deleteProtocol: "Usuń Protokół",
    noProtocols: "Nie znaleziono protokołów",
    protocolCount: "{{count}} protokół",
    protocolCount_plural: "{{count}} protokołów"
  },
  
  // Data Overview
  data: {
    title: "Przegląd Danych",
    totalRecords: "Wszystkie Rekordy",
    recordsToday: "Rekordy Dzisiaj",
    recordsThisWeek: "Rekordy Ten Tydzień",
    dataCompleteness: "Kompletność Danych",
    validationStatus: "Status Walidacji",
    qualityScore: "Ocena Jakości",
    lastSync: "Ostatnia Synchronizacja",
    pendingValidation: "Oczekująca Walidacja",
    viewDataManagement: "Zobacz Zarządzanie Danymi",
    importData: "Importuj Dane",
    exportData: "Eksportuj Dane"
  },
  
  // Analytics Summary
  analytics: {
    title: "Analityka",
    viewDashboard: "Zobacz Pełny Panel",
    keyMetrics: "Kluczowe Metryki",
    enrollment: "Rekrutacja",
    retention: "Retencja",
    completion: "Współczynnik Ukończenia",
    adverseEvents: "Zdarzenia Niepożądane",
    dataCollection: "Zbieranie Danych",
    sitePerformance: "Wydajność Ośrodków",
    generateReport: "Wygeneruj Raport",
    scheduleReport: "Zaplanuj Raport"
  },
  
  // Notifications
  notifications: {
    title: "Powiadomienia",
    viewAll: "Zobacz Wszystkie Powiadomienia",
    markAllRead: "Oznacz Wszystkie jako Przeczytane",
    noNotifications: "Brak nowych powiadomień",
    unreadCount: "{{count}} nieprzeczytanych",
    newComment: "Nowy komentarz do {{item}}",
    reviewRequest: "Prośba o przegląd {{item}}",
    milestoneApproaching: "Zbliża się kamień milowy: {{name}}",
    dataQualityAlert: "Alert jakości danych",
    collaboratorInvite: "Zaproszenie do współpracy",
    protocolApproved: "Protokół zatwierdzony",
    reportReady: "Raport gotowy do pobrania",
    systemUpdate: "Dostępna aktualizacja systemu"
  },
  
  // Tasks & Reminders
  tasks: {
    title: "Zadania i Przypomnienia",
    myTasks: "Moje Zadania",
    assignedToMe: "Przypisane do Mnie",
    createdByMe: "Utworzone Przeze Mnie",
    completed: "Ukończone",
    overdue: "Przeterminowane",
    dueToday: "Termin Dzisiaj",
    dueThisWeek: "Termin Ten Tydzień",
    noDueDate: "Bez Terminu",
    addTask: "Dodaj Zadanie",
    markComplete: "Oznacz jako Ukończone",
    editTask: "Edytuj Zadanie",
    deleteTask: "Usuń Zadanie",
    assignTo: "Przypisz do",
    priority: "Priorytet",
    high: "Wysoki",
    medium: "Średni",
    low: "Niski",
    noTasks: "Nie znaleziono zadań"
  },
  
  // Team & Collaboration
  team: {
    title: "Zespół",
    viewTeam: "Zobacz Zespół",
    teamMembers: "Członkowie Zespołu",
    activeMembers: "Aktywni Członkowie",
    pendingInvitations: "Oczekujące Zaproszenia",
    inviteMember: "Zaproś Członka",
    role: "Rola",
    lastActive: "Ostatnia Aktywność",
    online: "Online",
    offline: "Offline",
    viewProfile: "Zobacz Profil",
    sendMessage: "Wyślij Wiadomość",
    removeFromTeam: "Usuń z Zespołu"
  },
  
  // Calendar & Timeline
  calendar: {
    title: "Kalendarz",
    viewCalendar: "Zobacz Pełny Kalendarz",
    upcomingEvents: "Nadchodzące Wydarzenia",
    today: "Dzisiaj",
    thisWeek: "Ten Tydzień",
    thisMonth: "Ten Miesiąc",
    noEvents: "Brak zaplanowanych wydarzeń",
    addEvent: "Dodaj Wydarzenie",
    milestone: "Kamień Milowy",
    meeting: "Spotkanie",
    deadline: "Termin",
    visit: "Wizyta Badania",
    reminder: "Przypomnienie"
  },
  
  // Widgets
  widgets: {
    title: "Widżety",
    addWidget: "Dodaj Widżet",
    removeWidget: "Usuń Widżet",
    customizeLayout: "Dostosuj Układ",
    resetLayout: "Przywróć Domyślny",
    saveLayout: "Zapisz Układ",
    protocolOverview: "Przegląd Protokołu",
    dataQuality: "Jakość Danych",
    enrollment: "Status Rekrutacji",
    milestones: "Kamienie Milowe",
    recentActivity: "Ostatnia Aktywność",
    teamActivity: "Aktywność Zespołu",
    quickStats: "Szybkie Statystyki",
    alerts: "Alerty"
  },
  
  // Search & Filters
  search: {
    title: "Wyszukiwanie",
    searchPlaceholder: "Szukaj protokołów, danych, raportów...",
    recentSearches: "Ostatnie Wyszukiwania",
    clearHistory: "Wyczyść Historię",
    filters: "Filtry",
    filterBy: "Filtruj według",
    sortBy: "Sortuj według",
    dateRange: "Zakres Dat",
    status: "Status",
    owner: "Właściciel",
    type: "Typ",
    clearFilters: "Wyczyść Filtry",
    applyFilters: "Zastosuj Filtry",
    noResults: "Nie znaleziono wyników",
    searchResults: "Znaleziono {{count}} wynik",
    searchResults_plural: "Znaleziono {{count}} wyników"
  },
  
  // Help & Support
  help: {
    title: "Pomoc i Wsparcie",
    documentation: "Dokumentacja",
    tutorials: "Samouczki",
    videoGuides: "Przewodniki Wideo",
    keyboardShortcuts: "Skróty Klawiaturowe",
    contactSupport: "Skontaktuj się z Wsparciem",
    reportIssue: "Zgłoś Problem",
    featureRequest: "Prośba o Funkcję",
    whatsNew: "Co Nowego",
    releaseNotes: "Informacje o Wydaniu",
    communityForum: "Forum Społeczności"
  },
  
  // User Menu
  user: {
    title: "Konto",
    profile: "Mój Profil",
    settings: "Ustawienia",
    preferences: "Preferencje",
    language: "Język",
    theme: "Motyw",
    notifications: "Ustawienia Powiadomień",
    privacy: "Prywatność",
    security: "Bezpieczeństwo",
    billing: "Rozliczenia",
    logout: "Wyloguj",
    darkMode: "Tryb Ciemny",
    lightMode: "Tryb Jasny",
    autoMode: "Auto"
  },
  
  // Common Actions
  actions: {
    view: "Zobacz",
    edit: "Edytuj",
    delete: "Usuń",
    share: "Udostępnij",
    export: "Eksportuj",
    duplicate: "Duplikuj",
    archive: "Archiwizuj",
    restore: "Przywróć",
    refresh: "Odśwież",
    filter: "Filtruj",
    sort: "Sortuj",
    search: "Szukaj",
    create: "Utwórz",
    save: "Zapisz",
    cancel: "Anuluj",
    close: "Zamknij"
  },
  
  // Status Labels
  status: {
    active: "Aktywny",
    inactive: "Nieaktywny",
    pending: "Oczekujący",
    completed: "Zakończony",
    inProgress: "W Toku",
    draft: "Wersja Robocza",
    published: "Opublikowany",
    archived: "Zarchiwizowany",
    approved: "Zatwierdzony",
    rejected: "Odrzucony",
    underReview: "W Przeglądzie"
  },
  
  // Empty States
  empty: {
    noData: "Brak dostępnych danych",
    noProjects: "Nie znaleziono projektów",
    noProtocols: "Nie znaleziono protokołów",
    noActivity: "Brak ostatniej aktywności",
    noNotifications: "Brak nowych powiadomień",
    noTasks: "Brak przypisanych zadań",
    noResults: "Nie znaleziono wyników",
    getStarted: "Zacznij od utworzenia swojego pierwszego {{item}}",
    createNew: "Utwórz Nowy {{item}}"
  },
  
  // Time & Dates
  time: {
    justNow: "Przed chwilą",
    minutesAgo: "{{count}} minutę temu",
    minutesAgo_plural: "{{count}} minut temu",
    hoursAgo: "{{count}} godzinę temu",
    hoursAgo_plural: "{{count}} godzin temu",
    daysAgo: "{{count}} dzień temu",
    daysAgo_plural: "{{count}} dni temu",
    weeksAgo: "{{count}} tydzień temu",
    weeksAgo_plural: "{{count}} tygodni temu",
    monthsAgo: "{{count}} miesiąc temu",
    monthsAgo_plural: "{{count}} miesięcy temu",
    yearsAgo: "{{count}} rok temu",
    yearsAgo_plural: "{{count}} lat temu"
  }
};