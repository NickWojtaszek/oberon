export default {
  // === GLOBAL HEADER ===
  globalHeader: {
    targetJournal: "Czasopismo docelowe:",
    selectJournal: "Wybierz czasopismo...",
    createCustomJournal: "Utwórz Niestandardowe Czasopismo",
    editGenericJournal: "Edytuj Domyślne Ustawienia Czasopisma",
    autonomy: {
      audit: "Audyt",
      coPilot: "Ko-Pilot",
      pilot: "Pilot",
      notAvailableForRole: "Niedostępne dla Twojej roli"
    },
    exportPackage: "Eksportuj Pakiet",
    runLogicCheck: "Uruchom Sprawdzanie Logiki",
    processing: "Przetwarzanie...",
    studyTypes: {
      unblinded: "NIEOŚLEPIONE",
      singleBlind: "POJEDYNCZO ŚLEPE",
      doubleBlind: "PODWÓJNIE ŚLEPE",
      tripleBlind: "POTRÓJNIE ŚLEPE"
    }
  },

  // === NAVIGATION PANEL ===
  navigation: {
    researchFactory: "Fabryka Badań",
    currentProject: "Bieżący Projekt:",
    noProject: "Nie wybrano projektu",
    
    // Navigation items
    dashboard: "Panel Główny",
    projectLibrary: "Biblioteka Projektów",
    protocolLibrary: "Biblioteka Protokołów",
    aiPersonas: "Persony AI",
    personaEditor: "Edytor Person",
    protocolWorkbench: "Warsztat Protokołu",
    researchWizard: "Kreator Badań",
    projectSetup: "Konfiguracja Projektu",
    methodologyEngine: "Silnik Metodologii",
    database: "Baza Danych",
    analytics: "Analityka",
    academicWriting: "Pisanie Naukowe",
    dataManagement: "Zarządzanie Danymi",
    governance: "Zarządzanie",
    ethics: "Etyka i IRB",
    
    // Navigation descriptions
    descriptions: {
      dashboard: "Przegląd postępów",
      projectLibrary: "Przeglądaj projekty",
      protocolLibrary: "Przeglądaj protokoły",
      aiPersonas: "Biblioteka person",
      personaEditor: "Twórz i edytuj persony",
      protocolWorkbench: "Buduj schematy",
      researchWizard: "Prowadzone konfigurowanie badań",
      projectSetup: "Zespół i metodologia",
      methodologyEngine: "Automatyczne generowanie metodologii",
      database: "Schemat i rekordy",
      analytics: "Analiza statystyczna",
      academicWriting: "Edytor manuskryptów",
      dataManagement: "Import/Eksport",
      governance: "Kontrola dostępu",
      ethics: "IRB i Zgodność"
    },
    
    // Navigation actions
    goToField: "Przejdź do pola",
    navigateToIssue: "Przejdź do problemu",
    backToList: "Powrót do listy"
  },

  // === LANGUAGE SWITCHER ===
  language: {
    title: "Język Interfejsu",
    changeLanguage: "Zmień język interfejsu",
    autoSave: "Preferencje językowe są zapisywane automatycznie",
    english: "English",
    polish: "Polski",
    spanish: "Español",
    chinese: "中文"
  },

  // === PROTOCOL WORKBENCH ===
  protocolWorkbench: {
    // Main toolbar
    toolbar: {
      protocolLabel: "Protokół",
      versionLabel: "Wersja",
      exportSchema: "Eksportuj Schemat",
      backToLibrary: "Powrót do Biblioteki",
      saveDraft: "Zapisz Wersję Roboczą",
      publish: "Opublikuj"
    },
    
    // Tab navigation
    tabs: {
      protocolDocument: "Dokument Protokołu",
      schemaBuilder: "Kreator Schematu",
      dependencies: "Zależności",
      audit: "Audyt"
    },
    
    // Schema Editor
    schemaEditor: {
      emptyState: {
        title: "Brak bloków schematu",
        description: "Kliknij zmienne z biblioteki po lewej stronie, aby rozpocząć budowanie schematu protokołu."
      }
    },
    
    // Variable Library
    variableLibrary: {
      title: "Biblioteka Zmiennych",
      searchPlaceholder: "Szukaj zmiennych...",
      noResults: "Nie znaleziono zmiennych"
    },
    
    // Settings Modal
    settingsModal: {
      title: "Ustawienia Bloku",
      dataType: "Typ Danych",
      unit: "Jednostka",
      unitPlaceholder: "Wprowadź jednostkę",
      quickSelect: "Szybki wybór...",
      minValue: "Wartość Minimalna",
      maxValue: "Wartość Maksymalna",
      minPlaceholder: "Min",
      maxPlaceholder: "Max",
      clinicalRange: "Zakres Kliniczny",
      normalLow: "Norma Dolna",
      normalHigh: "Norma Górna",
      critical: "Krytyczny",
      options: "Opcje",
      addOption: "Dodaj Opcję",
      optionPlaceholder: "Opcja",
      quickTemplates: "Szybkie szablony:",
      matrixRows: "Wiersze Macierzy",
      addRow: "Dodaj Wiersz",
      rowPlaceholder: "Wiersz",
      gridItems: "Elementy Siatki (Wiersze)",
      gridCategories: "Kategorie Siatki (Kolumny)",
      addItem: "Dodaj Element",
      addCategory: "Dodaj Kategorię",
      itemPlaceholder: "Element",
      categoryPlaceholder: "Kategoria",
      required: "Wymagane",
      helpText: "Tekst Pomocniczy",
      helpPlaceholder: "Wprowadź tekst pomocniczy dla tego pola",
      saveChanges: "Zapisz Zmiany",
      cancel: "Anuluj"
    },
    
    // Dependency Modal
    dependencyModal: {
      title: "Zależności i Powiązania Logiczne",
      infoTitle: "Czym są zależności?",
      infoDescription: "Zależności definiują logiczne relacje między zmiennymi. Jeśli ta zmienna zależy od innych, te muszą być najpierw zebrane lub użyte w logice warunkowej.",
      currentDependencies: "Bieżące Zależności",
      noDependencies: "Brak ustawionych zależności. Ta zmienna jest niezależna.",
      unknownVariable: "Nieznana Zmienna",
      addDependency: "Dodaj Zależność",
      noAvailableVariables: "Brak innych zmiennych dostępnych do dodania jako zależności.",
      circularWarning: "Spowodowałoby to cykliczną zależność",
      saveDependencies: "Zapisz Zależności",
      // Advanced modal (for future use)
      conditionalRules: "Reguły Warunkowe",
      addRule: "Dodaj Regułę",
      condition: "Warunek",
      value: "Wartość",
      then: "Wtedy",
      action: "Akcja",
      targetVariable: "Zmienna Docelowa",
      operator: "Operator",
      equals: "Równa się",
      notEquals: "Nie równa się",
      greaterThan: "Większa niż",
      lessThan: "Mniejsza niż",
      contains: "Zawiera",
      show: "Pokaż",
      hide: "Ukryj",
      require: "Wymagaj",
      setValue: "Ustaw Wartość",
      saveRules: "Zapisz Reguły"
    },
    
    // Version Tag Modal
    versionTagModal: {
      title: "Tag Wersji",
      versionTag: "Tag Wersji",
      versionPlaceholder: "np. v1.0, v2.1, Poprawka 3",
      quickSelect: "Szybki Wybór",
      tagColor: "Kolor Tagu",
      preview: "Podgląd",
      clearTag: "Wyczyść Tag",
      saveTag: "Zapisz Tag"
    },
    
    // Schema Generator Modal
    schemaGeneratorModal: {
      title: "Generator Schematu AI",
      description: "Opisz Swój Protokół",
      descriptionPlaceholder: "Opisz, co chcesz zmierzyć w swoim badaniu...",
      chooseTemplate: "Wybierz Szablon",
      generating: "Generowanie...",
      generate: "Generuj Schemat",
      cancel: "Anuluj"
    },
    
    // Pre-Publish Validation Modal
    prePublishModal: {
      cannotPublish: "Nie Można Opublikować Protokołu",
      reviewRequired: "Wymagany Przegląd",
      readyToPublish: "Gotowy do Publikacji",
      validationComplete: "Walidacja zarządzania AI zakończona",
      complianceScore: "Wynik Zgodności",
      validationPassed: "Walidacja Zakończona Pomyślnie",
      validationFailed: "Walidacja Nie Powiodła Się",
      critical: "Krytyczne",
      mustResolve: "Należy rozwiązać",
      warnings: "Ostrzeżenia",
      reviewNeeded: "Wymagany przegląd",
      info: "Info",
      suggestions: "Sugestie",
      blockingIssues: "Problemy Blokujące",
      approvalRequired: "Wymagana Akceptacja PI",
      approvalDescription: "Ten protokół wymaga przeglądu i zatwierdzenia przez Głównego Badacza przed publikacją.",
      viewAuditReport: "Zobacz Pełny Raport Audytu",
      acknowledgePublish: "Potwierdź i Opublikuj",
      publishProtocol: "Opublikuj Protokół",
      proceedAnyway: "Kontynuuj Mimo To",
      fixIssues: "Napraw Problemy"
    },
    
    // Block Toolbar
    blockToolbar: {
      duplicate: "Duplikuj",
      versionTag: "Tag Wersji",
      dependencies: "Zależności",
      settings: "Ustawienia",
      remove: "Usuń"
    },
    
    // Configuration HUD
    configHUD: {
      role: "Rola",
      endpointTier: "Poziom Punktu Końcowego",
      analysisMethod: "Metoda Analizy",
      none: "Brak",
      primary: "Pierwotny",
      secondary: "Wtórny",
      exploratory: "Eksploracyjny",
      kaplanMeier: "Kaplan-Meier",
      frequency: "Częstotliwość",
      tTest: "Test t",
      nonParametric: "Nieparametryczny",
      chiSquare: "Chi-kwadrat"
    },
    
    // Schema Block
    schemaBlock: {
      section: "Sekcja",
      items: "elementy"
    },
    
    // Protocol validation
    validation: {
      protocolTitleRequired: "Proszę wprowadzić Tytuł Protokołu i Numer Protokołu przed zapisaniem",
      loadFailed: "Nie udało się załadować protokołu. Mógł zostać usunięty."
    },
    
    // Status badges
    status: {
      draft: "Wersja Robocza",
      published: "Opublikowany",
      archived: "Zarchiwizowany"
    }
  },

  // === ACADEMIC WRITING ===
  academic: {
    manuscript: {
      title: "Tytuł Manuskryptu",
      abstract: "Streszczenie",
      introduction: "Wprowadzenie",
      methods: "Metody",
      results: "Wyniki",
      discussion: "Dyskusja",
      conclusions: "Wnioski",
      references: "Bibliografia",
      acknowledgments: "Podziękowania",
      appendices: "Załączniki"
    },
    sections: {
      addSection: "Dodaj Sekcję",
      deleteSection: "Usuń Sekcję",
      moveUp: "Przesuń w górę",
      moveDown: "Przesuń w dół",
      sectionTitle: "Tytuł Sekcji",
      sectionContent: "Treść Sekcji"
    },
    citations: {
      addCitation: "Dodaj Cytat",
      editCitation: "Edytuj Cytat",
      deleteCitation: "Usuń Cytat",
      citationStyle: "Styl Cytowania",
      insertCitation: "Wstaw Cytat",
      manageCitations: "Zarządzaj Cytatami",
      noCitations: "Brak cytatów"
    },
    export: {
      title: "Eksportuj Manuskrypt",
      exportPDF: "Eksportuj PDF",
      exportWord: "Eksportuj Word",
      exportLaTeX: "Eksportuj LaTeX",
      includeReferences: "Dołącz Bibliografię",
      includeAppendices: "Dołącz Załączniki"
    },
    wordCount: {
      total: "Łączna Liczba Słów",
      abstract: "Słowa w Streszczeniu",
      body: "Słowa w Treści",
      target: "Cel"
    }
  },

  // === DATABASE MODULE ===
  database: {
    tabs: {
      schema: "Schemat",
      dataEntry: "Wprowadzanie Danych",
      browser: "Przeglądarka Danych",
      query: "Kreator Zapytań",
      import: "Import"
    },
    schema: {
      tables: "Tabele",
      addTable: "Dodaj Tabelę",
      editTable: "Edytuj Tabelę",
      deleteTable: "Usuń Tabelę",
      columns: "Kolumny",
      addColumn: "Dodaj Kolumnę",
      columnName: "Nazwa Kolumny",
      columnType: "Typ Kolumny",
      primaryKey: "Klucz Główny",
      foreignKey: "Klucz Obcy"
    },
    dataEntry: {
      newRecord: "Nowy Rekord",
      editRecord: "Edytuj Rekord",
      deleteRecord: "Usuń Rekord",
      saveRecord: "Zapisz Rekord",
      recordSaved: "Rekord zapisany pomyślnie",
      recordDeleted: "Rekord usunięty pomyślnie"
    },
    browser: {
      filterRecords: "Filtruj Rekordy",
      sortBy: "Sortuj według",
      recordsPerPage: "Rekordów na stronę",
      totalRecords: "Łączna liczba rekordów",
      noRecords: "Nie znaleziono rekordów"
    },
    query: {
      newQuery: "Nowe Zapytanie",
      runQuery: "Uruchom Zapytanie",
      saveQuery: "Zapisz Zapytanie",
      queryResults: "Wyniki Zapytania",
      noResults: "Brak wyników"
    }
  },

  // === ANALYTICS MODULE ===
  analytics: {
    dashboard: {
      title: "Panel Analityki",
      overview: "Przegląd",
      reports: "Raporty",
      visualizations: "Wizualizacje"
    },
    statistics: {
      descriptive: "Statystyki Opisowe",
      inferential: "Statystyki Wnioskowania",
      mean: "Średnia",
      median: "Mediana",
      mode: "Moda",
      standardDeviation: "Odchylenie Standardowe",
      variance: "Wariancja",
      range: "Zakres",
      confidence: "Przedział Ufności",
      pValue: "Wartość P",
      significance: "Poziom Istotności"
    },
    charts: {
      barChart: "Wykres Słupkowy",
      lineChart: "Wykres Liniowy",
      pieChart: "Wykres Kołowy",
      scatterPlot: "Wykres Punktowy",
      histogram: "Histogram",
      boxPlot: "Wykres Pudełkowy"
    },
    export: {
      exportResults: "Eksportuj Wyniki",
      exportChart: "Eksportuj Wykres",
      exportTable: "Eksportuj Tabelę"
    }
  },

  // === GOVERNANCE MODULE ===
  governance: {
    roles: {
      title: "Role i Uprawnienia",
      addRole: "Dodaj Rolę",
      editRole: "Edytuj Rolę",
      deleteRole: "Usuń Rolę",
      roleName: "Nazwa Roli",
      permissions: "Uprawnienia"
    },
    users: {
      title: "Zarządzanie Użytkownikami",
      addUser: "Dodaj Użytkownika",
      editUser: "Edytuj Użytkownika",
      deleteUser: "Usuń Użytkownika",
      userName: "Nazwa Użytkownika",
      userEmail: "Email",
      userRole: "Rola",
      active: "Aktywny",
      inactive: "Nieaktywny"
    },
    audit: {
      title: "Ścieżka Audytu",
      action: "Akcja",
      user: "Użytkownik",
      timestamp: "Znacznik czasu",
      details: "Szczegóły",
      export: "Eksportuj Dziennik Audytu"
    },
    accessLevels: {
      readOnly: "Tylko do odczytu",
      commentOnly: "Tylko komentarze"
    }
  },

  // === ETHICS & IRB ===
  ethics: {
    submissions: {
      title: "Zgłoszenia IRB",
      newSubmission: "Nowe Zgłoszenie",
      editSubmission: "Edytuj Zgłoszenie",
      submissionStatus: "Status",
      submittedDate: "Data Zgłoszenia",
      approvalDate: "Data Zatwierdzenia",
      statusPending: "Oczekujące",
      statusApproved: "Zatwierdzone",
      statusRejected: "Odrzucone",
      statusRevisions: "Wymagane Poprawki"
    },
    documents: {
      consentForm: "Formularz Zgody",
      protocol: "Protokół",
      investigatorBrochure: "Broszura Badacza",
      amendments: "Poprawki",
      safetyReports: "Raporty Bezpieczeństwa"
    },
    compliance: {
      title: "Śledzenie Zgodności",
      ichGCP: "ICH-GCP",
      gdpr: "RODO",
      hipaa: "HIPAA",
      compliant: "Zgodne",
      nonCompliant: "Niezgodne",
      underReview: "W Trakcie Przeglądu"
    }
  },

  // === EXISTING SECTIONS (preserved) ===
  sidebar: {
    noIssues: "Nie znaleziono problemów",
    issueCount: "{{count}} problem",
    issueCount_plural: "{{count}} problemów",
    criticalIssues: "Problemy Krytyczne",
    warnings: "Ostrzeżenia",
    informational: "Informacyjne",
    recommendations: "Rekomendacje",
    citation: "Cytat Regulacyjny",
    autoFixAvailable: "Dostępna Automatyczna Naprawa",
    applyFix: "Zastosuj Naprawę",
    location: "Lokalizacja",
    module: "Moduł",
    tab: "Zakładka",
    field: "Pole",
    viewDetails: "Zobacz Szczegóły",
    collapse: "Zwiń",
    expand: "Rozwiń"
  },
  
  validation: {
    validating: "Walidacja...",
    validated: "Zwalidowano",
    noValidation: "Nie przeprowadzono walidacji",
    lastValidated: "Ostatnia walidacja",
    runValidation: "Uruchom Walidację",
    validationComplete: "Walidacja zakończona",
    validationFailed: "Walidacja nie powiodła się"
  },
  
  export: {
    title: "Eksportuj Raport Walidacji",
    format: "Format Eksportu",
    formatPDF: "PDF (HTML)",
    formatJSON: "JSON",
    formatCSV: "CSV",
    options: "Opcje Eksportu",
    includeRecommendations: "Dołącz Rekomendacje",
    includeCitations: "Dołącz Cytaty Regulacyjne",
    filterBySeverity: "Filtruj według Wagi",
    filterAll: "Wszystkie Problemy",
    filterCriticalWarning: "Tylko Krytyczne i Ostrzeżenia",
    filterCriticalOnly: "Tylko Krytyczne",
    groupBy: "Grupuj według",
    groupBySeverity: "Waga",
    groupByPersona: "Persona",
    groupByCategory: "Kategoria",
    exportButton: "Eksportuj Raport",
    exporting: "Eksportowanie...",
    exportSuccess: "Raport wyeksportowany pomyślnie",
    exportError: "Nie udało się wyeksportować raportu"
  },
  
  trends: {
    title: "Trendy Walidacji",
    overallTrend: "Trend Ogólny",
    personaTrends: "Trendy Person",
    scoreImprovement: "Poprawa Wyniku",
    issueReduction: "Redukcja Problemów",
    currentScore: "Obecny Wynik",
    previousScore: "Poprzedni Wynik",
    scoreChange: "Zmiana Wyniku",
    improving: "Poprawa",
    declining: "Pogorszenie",
    stable: "Stabilny",
    noData: "Brak danych o trendach",
    snapshotCount: "{{count}} migawka",
    snapshotCount_plural: "{{count}} migawek",
    dateRange: "Zakres Dat",
    compareVersions: "Porównaj Wersje",
    version: "Wersja",
    selectVersion: "Wybierz wersję..."
  },
  
  autoFix: {
    title: "Dostępna Automatyczna Naprawa",
    description: "Ten problem może zostać automatycznie naprawiony",
    applyFix: "Zastosuj Automatyczną Naprawę",
    applying: "Stosowanie naprawy...",
    success: "Naprawa zastosowana pomyślnie",
    error: "Nie udało się zastosować naprawy",
    fixesApplied: "Zastosowano {{count}} naprawę",
    fixesApplied_plural: "Zastosowano {{count}} napraw",
    confirmTitle: "Potwierdź Automatyczną Naprawę",
    confirmMessage: "Czy na pewno chcesz zastosować tę naprawę?",
    confirmMultiple: "Zastosować {{count}} automatycznych napraw?",
    reviewChanges: "Przejrzyj zmiany przed zastosowaniem"
  },
  
  messages: {
    required: "To pole jest wymagane",
    invalid: "Nieprawidłowa wartość",
    missing: "Brakujące informacje",
    incomplete: "Niekompletne",
    notApplicable: "Nie dotyczy tego typu badania",
    checklistComplete: "Wszystkie elementy listy kontrolnej ukończone",
    checklistIncomplete: "{{completed}} z {{total}} ukończone"
  }
};