export default {
  // === DATA MANAGEMENT MODULE ===
  
  // Main Header
  header: {
    title: "Zarządzanie Danymi",
    subtitle: "Import, Eksport i Przekształcanie Danych Klinicznych",
    description: "Zarządzaj danymi klinicznymi za pomocą narzędzi klasy korporacyjnej"
  },
  
  // Tab Navigation
  tabs: {
    import: "Import",
    export: "Eksport",
    transform: "Przekształcenie",
    quality: "Jakość Danych",
    history: "Historia",
    schedule: "Zaplanowane Zadania"
  },
  
  // === IMPORT SECTION ===
  import: {
    title: "Import Danych",
    subtitle: "Prześlij i zaimportuj dane kliniczne z zewnętrznych źródeł",
    
    // Upload
    upload: {
      title: "Prześlij Plik",
      dragDrop: "Przeciągnij i upuść pliki tutaj lub kliknij, aby przeglądać",
      browseFiles: "Przeglądaj Pliki",
      selectedFile: "Wybrany Plik",
      fileSize: "Rozmiar Pliku",
      fileType: "Typ Pliku",
      removeFile: "Usuń Plik",
      uploadAnother: "Prześlij Kolejny Plik",
      maxFileSize: "Maksymalny rozmiar pliku: {{size}}MB",
      supportedFormats: "Obsługiwane Formaty",
      formats: {
        csv: "CSV (wartości rozdzielane przecinkami)",
        excel: "Excel (.xlsx, .xls)",
        json: "JSON (JavaScript Object Notation)",
        xml: "XML (Extensible Markup Language)",
        sas: "Pliki Danych SAS (.sas7bdat)",
        spss: "Pliki SPSS (.sav)",
        stata: "Pliki Stata (.dta)",
        txt: "Pliki Tekstowe (.txt, .dat)"
      }
    },
    
    // File Preview
    preview: {
      title: "Podgląd Pliku",
      firstRows: "Pierwsze {{count}} wierszy",
      totalRows: "Łączna Liczba Wierszy",
      totalColumns: "Łączna Liczba Kolumn",
      encoding: "Kodowanie Pliku",
      delimiter: "Separator",
      hasHeaders: "Pierwszy wiersz zawiera nagłówki",
      refreshPreview: "Odśwież Podgląd",
      viewAll: "Zobacz Wszystkie Dane"
    },
    
    // Field Mapping
    mapping: {
      title: "Mapowanie Pól",
      subtitle: "Zmapuj pola źródłowe do schematu protokołu",
      autoMap: "Auto-Mapowanie Pól",
      clearMapping: "Wyczyść Wszystkie Mapowania",
      sourceField: "Pole Źródłowe",
      targetField: "Pole Docelowe (Schemat Protokołu)",
      dataType: "Typ Danych",
      transformation: "Przekształcenie",
      selectTarget: "Wybierz pole docelowe...",
      selectTransformation: "Wybierz przekształcenie...",
      unmappedFields: "Pola Niezmapowane",
      mappedFields: "Pola Zmapowane",
      requiredFields: "Pola Wymagane",
      optionalFields: "Pola Opcjonalne",
      ignoredFields: "Pola Ignorowane",
      mappingStatus: "Status Mapowania",
      complete: "{{mapped}} z {{total}} wymaganych pól zmapowanych",
      suggestions: "Sugestie Mapowania",
      applySuggestion: "Zastosuj Sugestię",
      confidence: "Pewność: {{percent}}%"
    },
    
    // Transformations
    transformations: {
      none: "Bez przekształcenia",
      trim: "Usuń spacje",
      uppercase: "Konwertuj na wielkie litery",
      lowercase: "Konwertuj na małe litery",
      titleCase: "Konwertuj na tytuł",
      parseDate: "Parsuj jako datę",
      parseNumber: "Parsuj jako liczbę",
      parseBoolean: "Parsuj jako wartość logiczną",
      split: "Podziel ciąg znaków",
      concatenate: "Połącz wartości",
      lookup: "Wyszukaj z tabeli",
      calculate: "Oblicz wartość",
      custom: "Niestandardowe przekształcenie"
    },
    
    // Validation
    validation: {
      title: "Reguły Walidacji",
      subtitle: "Zdefiniuj reguły walidacji dla importowanych danych",
      addRule: "Dodaj Regułę Walidacji",
      rule: "Reguła",
      condition: "Warunek",
      errorMessage: "Komunikat Błędu",
      warningMessage: "Komunikat Ostrzeżenia",
      skipInvalid: "Pomiń nieprawidłowe rekordy",
      flagInvalid: "Oznacz nieprawidłowe rekordy do przeglądu",
      rejectInvalid: "Odrzuć plik, jeśli znaleziono nieprawidłowe rekordy",
      validationResults: "Wyniki Walidacji",
      passed: "Zaliczone",
      failed: "Niezaliczone",
      warnings: "Ostrzeżenia",
      errors: "Błędy",
      viewDetails: "Zobacz Szczegóły"
    },
    
    // Import Options
    options: {
      title: "Opcje Importu",
      importMode: "Tryb Importu",
      append: "Dołącz do istniejących danych",
      appendDesc: "Dodaj nowe rekordy do istniejącego zbioru danych",
      replace: "Zamień istniejące dane",
      replaceDesc: "Usuń istniejące dane i zaimportuj nowe",
      update: "Aktualizuj istniejące rekordy",
      updateDesc: "Aktualizuj rekordy na podstawie pola klucza",
      upsert: "Upsert (Aktualizuj lub Wstaw)",
      upsertDesc: "Aktualizuj jeśli istnieje, wstaw jeśli nowy",
      keyField: "Pole Klucza do Dopasowania",
      selectKeyField: "Wybierz pole klucza...",
      duplicateHandling: "Obsługa Duplikatów",
      skipDuplicates: "Pomiń duplikaty",
      overwriteDuplicates: "Nadpisz duplikaty",
      flagDuplicates: "Oznacz duplikaty do przeglądu",
      errorHandling: "Obsługa Błędów",
      stopOnError: "Zatrzymaj przy pierwszym błędzie",
      continueOnError: "Kontynuuj przy błędzie",
      rollbackOnError: "Wycofaj wszystko przy błędzie",
      batchSize: "Rozmiar Partii",
      batchSizeHint: "Liczba rekordów do przetworzenia jednocześnie"
    },
    
    // Progress
    progress: {
      title: "Postęp Importu",
      preparing: "Przygotowywanie importu...",
      uploading: "Przesyłanie pliku...",
      validating: "Walidacja danych...",
      transforming: "Przekształcanie danych...",
      importing: "Importowanie rekordów...",
      completed: "Import zakończony",
      failed: "Import nie powiódł się",
      recordsProcessed: "Przetworzone Rekordy",
      recordsImported: "Zaimportowane Rekordy",
      recordsSkipped: "Pominięte Rekordy",
      recordsFailed: "Nieudane Rekordy",
      estimatedTime: "Szacowany pozostały czas",
      elapsedTime: "Upłynął czas",
      cancel: "Anuluj Import",
      cancelConfirm: "Czy na pewno chcesz anulować ten import?"
    },
    
    // Summary
    summary: {
      title: "Podsumowanie Importu",
      success: "Import Zakończony Pomyślnie",
      partial: "Import Zakończony z Ostrzeżeniami",
      failure: "Import Nie Powiódł Się",
      totalRecords: "Wszystkie Rekordy",
      successfulRecords: "Udane",
      failedRecords: "Nieudane",
      skippedRecords: "Pominięte",
      warningRecords: "Ostrzeżenia",
      duration: "Czas Trwania",
      downloadLog: "Pobierz Dziennik Importu",
      downloadErrors: "Pobierz Raport Błędów",
      viewImportedData: "Zobacz Zaimportowane Dane",
      importAnother: "Importuj Kolejny Plik",
      done: "Gotowe"
    }
  },
  
  // === EXPORT SECTION ===
  export: {
    title: "Eksport Danych",
    subtitle: "Eksportuj dane kliniczne do formatów zewnętrznych",
    
    // Data Selection
    selection: {
      title: "Wybierz Dane do Eksportu",
      protocol: "Protokół",
      selectProtocol: "Wybierz protokół...",
      allProtocols: "Wszystkie Protokoły",
      version: "Wersja",
      selectVersion: "Wybierz wersję...",
      dateRange: "Zakres Dat",
      fromDate: "Od Daty",
      toDate: "Do Daty",
      allDates: "Wszystkie Daty",
      records: "Rekordy",
      allRecords: "Wszystkie Rekordy",
      selectedRecords: "Tylko Wybrane Rekordy",
      filteredRecords: "Przefiltrowane Rekordy",
      recordCount: "Wybrano {{count}} rekord",
      recordCount_plural: "Wybrano {{count}} rekordów"
    },
    
    // Field Selection
    fields: {
      title: "Wybierz Pola",
      selectAll: "Zaznacz Wszystkie",
      deselectAll: "Odznacz Wszystkie",
      selectedFields: "Wybrane Pola",
      availableFields: "Dostępne Pola",
      requiredFields: "Pola Wymagane",
      fieldGroups: "Grupy Pól",
      demographics: "Dane Demograficzne",
      vitals: "Parametry Życiowe",
      laboratory: "Laboratorium",
      adverseEvents: "Zdarzenia Niepożądane",
      medications: "Leki",
      procedures: "Procedury",
      assessments: "Oceny",
      custom: "Pola Niestandardowe"
    },
    
    // Format Options
    format: {
      title: "Format Eksportu",
      selectFormat: "Wybierz format...",
      csv: "CSV (rozdzielane przecinkami)",
      excel: "Skoroszyt Excel (.xlsx)",
      json: "JSON (dane strukturalne)",
      xml: "XML (Extensible Markup)",
      sas: "SAS Transport (.xpt)",
      spss: "SPSS (.sav)",
      stata: "Stata (.dta)",
      pdf: "Raport PDF",
      customFormat: "Szablon Niestandardowego Formatu",
      formatOptions: "Opcje Formatu",
      includeHeaders: "Uwzględnij nagłówki kolumn",
      includeMetadata: "Uwzględnij arkusz metadanych",
      includeCodebook: "Uwzględnij kodeks danych",
      dateFormat: "Format Daty",
      numberFormat: "Format Liczby",
      missingValue: "Wskaźnik Brakującej Wartości",
      encoding: "Kodowanie Znaków",
      compression: "Kompresuj plik wyjściowy"
    },
    
    // Filters
    filters: {
      title: "Zastosuj Filtry",
      addFilter: "Dodaj Filtr",
      field: "Pole",
      operator: "Operator",
      value: "Wartość",
      equals: "Równa się",
      notEquals: "Nie równa się",
      greaterThan: "Większe niż",
      lessThan: "Mniejsze niż",
      contains: "Zawiera",
      startsWith: "Zaczyna się od",
      endsWith: "Kończy się na",
      between: "Pomiędzy",
      in: "W Liście",
      isNull: "Jest Null",
      isNotNull: "Nie Jest Null",
      and: "I",
      or: "LUB",
      removeFilter: "Usuń Filtr",
      clearAllFilters: "Wyczyść Wszystkie Filtry"
    },
    
    // Preview
    preview: {
      title: "Podgląd Eksportu",
      previewData: "Podgląd Danych",
      sampleRows: "Przykładowe {{count}} wierszy",
      estimatedSize: "Szacowany Rozmiar Pliku",
      estimatedRecords: "Szacowana Liczba Rekordów",
      refreshPreview: "Odśwież Podgląd"
    },
    
    // Progress
    progress: {
      title: "Postęp Eksportu",
      preparing: "Przygotowywanie eksportu...",
      querying: "Odpytywanie danych...",
      formatting: "Formatowanie danych...",
      generating: "Generowanie pliku...",
      compressing: "Kompresowanie pliku...",
      completed: "Eksport zakończony",
      failed: "Eksport nie powiódł się",
      recordsExported: "Wyeksportowane Rekordy",
      fileSize: "Rozmiar Pliku",
      cancel: "Anuluj Eksport"
    },
    
    // Download
    download: {
      title: "Pobierz Eksport",
      ready: "Twój eksport jest gotowy",
      fileName: "Nazwa Pliku",
      fileSize: "Rozmiar Pliku",
      expiresIn: "Wygasa za {{hours}} godzin",
      downloadNow: "Pobierz Teraz",
      downloadLink: "Link Pobierania",
      copyLink: "Kopiuj Link",
      linkCopied: "Link skopiowany do schowka",
      emailLink: "Wyślij Link Pobierania Emailem",
      exportAnother: "Eksportuj Kolejny Zbiór Danych"
    }
  },
  
  // === TRANSFORM SECTION ===
  transform: {
    title: "Przekształcanie Danych",
    subtitle: "Czyść, normalizuj i wyprowadzaj nowe pola danych",
    
    // Transformation Types
    types: {
      clean: "Czyszczenie Danych",
      normalize: "Normalizacja",
      derive: "Zmienne Pochodne",
      aggregate: "Agregacja",
      pivot: "Pivot/Unpivot",
      merge: "Scalanie Zbiorów Danych"
    },
    
    // Cleaning
    cleaning: {
      title: "Czyszczenie Danych",
      removeDuplicates: "Usuń Duplikaty Rekordów",
      trimWhitespace: "Usuń Spacje",
      standardizeCase: "Standaryzuj Wielkość Liter",
      fixDataTypes: "Napraw Typy Danych",
      handleMissing: "Obsłuż Brakujące Wartości",
      removeOutliers: "Usuń Wartości Odstające",
      validateRanges: "Waliduj Zakresy Wartości",
      applyAll: "Zastosuj Wszystkie Reguły Czyszczenia"
    },
    
    // Normalization
    normalization: {
      title: "Normalizacja Danych",
      standardize: "Standaryzuj Wartości",
      categorize: "Kategoryzuj Wartości",
      binning: "Twórz Przedziały/Kategorie",
      scaling: "Skaluj Wartości Liczbowe",
      encoding: "Koduj Wartości Kategorialne"
    },
    
    // Derived Variables
    derived: {
      title: "Zmienne Pochodne",
      addVariable: "Dodaj Zmienną Pochodną",
      variableName: "Nazwa Zmiennej",
      formula: "Formuła/Wyrażenie",
      formulaPlaceholder: "Wprowadź formułę...",
      useWizard: "Użyj Kreatora Formuł",
      functions: "Dostępne Funkcje",
      testFormula: "Testuj Formułę",
      previewResults: "Podgląd Wyników",
      saveVariable: "Zapisz Zmienną"
    },
    
    // Aggregation
    aggregation: {
      title: "Agregacja Danych",
      groupBy: "Grupuj Według",
      selectFields: "Wybierz pola grupowania...",
      aggregations: "Agregacje",
      addAggregation: "Dodaj Agregację",
      function: "Funkcja",
      sum: "Suma",
      average: "Średnia",
      count: "Liczba",
      min: "Minimum",
      max: "Maksimum",
      median: "Mediana",
      mode: "Moda",
      stdDev: "Odchylenie Standardowe",
      variance: "Wariancja"
    },
    
    // Preview
    preview: {
      title: "Podgląd Przekształcenia",
      before: "Przed",
      after: "Po",
      affectedRecords: "Dotknięte Rekordy",
      apply: "Zastosuj Przekształcenie",
      revert: "Cofnij Zmiany"
    }
  },
  
  // === DATA QUALITY SECTION ===
  quality: {
    title: "Jakość Danych",
    subtitle: "Oceń i popraw jakość danych",
    
    // Quality Score
    score: {
      title: "Ocena Jakości",
      overall: "Ogólna Jakość",
      completeness: "Kompletność",
      accuracy: "Dokładność",
      consistency: "Spójność",
      validity: "Ważność",
      timeliness: "Aktualność",
      excellent: "Doskonała",
      good: "Dobra",
      fair: "Zadowalająca",
      poor: "Słaba"
    },
    
    // Checks
    checks: {
      title: "Kontrole Jakości",
      runChecks: "Uruchom Kontrole Jakości",
      runAll: "Uruchom Wszystkie Kontrole",
      lastRun: "Ostatnie uruchomienie",
      missingData: "Kontrola Brakujących Danych",
      duplicates: "Kontrola Duplikatów Rekordów",
      outliers: "Wykrywanie Wartości Odstających",
      consistency: "Kontrola Spójności",
      referential: "Integralność Referencyjna",
      businessRules: "Walidacja Reguł Biznesowych",
      passed: "Zaliczone",
      failed: "Niezaliczone",
      warnings: "Ostrzeżenia",
      viewReport: "Zobacz Raport"
    },
    
    // Issues
    issues: {
      title: "Problemy z Jakością Danych",
      severity: "Ważność",
      critical: "Krytyczna",
      major: "Poważna",
      minor: "Mniejsza",
      info: "Informacyjna",
      status: "Status",
      open: "Otwarty",
      inProgress: "W Toku",
      resolved: "Rozwiązany",
      ignored: "Zignorowany",
      assignedTo: "Przypisany Do",
      dueDate: "Termin",
      resolveIssue: "Rozwiąż Problem",
      ignoreIssue: "Zignoruj Problem",
      bulkResolve: "Rozwiązywanie Zbiorcze",
      exportIssues: "Eksportuj Problemy"
    },
    
    // Reports
    reports: {
      title: "Raporty Jakości",
      generateReport: "Wygeneruj Raport",
      reportType: "Typ Raportu",
      summary: "Raport Podsumowujący",
      detailed: "Raport Szczegółowy",
      trend: "Analiza Trendów",
      comparison: "Raport Porównawczy",
      dateRange: "Zakres Dat",
      downloadReport: "Pobierz Raport"
    }
  },
  
  // === HISTORY SECTION ===
  history: {
    title: "Historia Importu/Eksportu",
    subtitle: "Zobacz przeszłe operacje na danych",
    
    // Filters
    filters: {
      all: "Wszystkie Operacje",
      imports: "Tylko Importy",
      exports: "Tylko Eksporty",
      dateRange: "Zakres Dat",
      status: "Status",
      user: "Użytkownik"
    },
    
    // List
    list: {
      operation: "Operacja",
      date: "Data",
      user: "Użytkownik",
      records: "Rekordy",
      status: "Status",
      duration: "Czas Trwania",
      actions: "Akcje",
      viewDetails: "Zobacz Szczegóły",
      downloadFile: "Pobierz Plik",
      viewLog: "Zobacz Dziennik",
      rerun: "Uruchom Ponownie",
      delete: "Usuń"
    },
    
    // Details
    details: {
      title: "Szczegóły Operacji",
      operationId: "ID Operacji",
      startTime: "Czas Rozpoczęcia",
      endTime: "Czas Zakończenia",
      parameters: "Parametry",
      results: "Wyniki",
      logs: "Dzienniki",
      errors: "Błędy"
    },
    
    // Status
    status: {
      pending: "Oczekujący",
      running: "W Toku",
      completed: "Zakończony",
      failed: "Nieudany",
      cancelled: "Anulowany",
      partialSuccess: "Częściowy Sukces"
    }
  },
  
  // === SCHEDULED JOBS SECTION ===
  schedule: {
    title: "Zaplanowane Zadania",
    subtitle: "Automatyzuj operacje importu i eksportu danych",
    
    // Job List
    jobs: {
      addJob: "Dodaj Zaplanowane Zadanie",
      editJob: "Edytuj Zadanie",
      deleteJob: "Usuń Zadanie",
      enableJob: "Włącz Zadanie",
      disableJob: "Wyłącz Zadanie",
      runNow: "Uruchom Teraz",
      jobName: "Nazwa Zadania",
      schedule: "Harmonogram",
      lastRun: "Ostatnie Uruchomienie",
      nextRun: "Następne Uruchomienie",
      status: "Status",
      enabled: "Włączone",
      disabled: "Wyłączone"
    },
    
    // Job Configuration
    config: {
      title: "Konfiguracja Zadania",
      jobName: "Nazwa Zadania",
      jobNamePlaceholder: "Wprowadź nazwę zadania...",
      description: "Opis",
      descriptionPlaceholder: "Opisz to zadanie...",
      operation: "Typ Operacji",
      import: "Import Danych",
      export: "Eksport Danych",
      transform: "Przekształcenie Danych",
      qualityCheck: "Kontrola Jakości",
      schedule: "Harmonogram",
      frequency: "Częstotliwość",
      daily: "Codziennie",
      weekly: "Co Tydzień",
      monthly: "Co Miesiąc",
      custom: "Niestandardowy (Cron)",
      time: "Czas",
      timeZone: "Strefa Czasowa",
      notifications: "Powiadomienia",
      notifyOnSuccess: "Powiadom o sukcesie",
      notifyOnFailure: "Powiadom o niepowodzeniu",
      recipients: "Odbiorcy",
      saveJob: "Zapisz Zadanie"
    },
    
    // Job History
    history: {
      title: "Historia Wykonywania Zadań",
      executionDate: "Data Wykonania",
      duration: "Czas Trwania",
      status: "Status",
      records: "Przetworzone Rekordy",
      viewLog: "Zobacz Dziennik"
    }
  },
  
  // === COMMON ACTIONS ===
  actions: {
    upload: "Prześlij",
    download: "Pobierz",
    import: "Importuj",
    export: "Eksportuj",
    transform: "Przekształć",
    validate: "Waliduj",
    preview: "Podgląd",
    apply: "Zastosuj",
    cancel: "Anuluj",
    back: "Wstecz",
    next: "Dalej",
    finish: "Zakończ",
    save: "Zapisz",
    delete: "Usuń",
    close: "Zamknij",
    refresh: "Odśwież",
    retry: "Ponów"
  },
  
  // === COMMON MESSAGES ===
  messages: {
    uploadSuccess: "Plik przesłany pomyślnie",
    uploadError: "Nie udało się przesłać pliku",
    importSuccess: "Dane zaimportowane pomyślnie",
    importError: "Nie udało się zaimportować danych",
    exportSuccess: "Dane wyeksportowane pomyślnie",
    exportError: "Nie udało się wyeksportować danych",
    transformSuccess: "Przekształcenie zastosowane pomyślnie",
    transformError: "Nie udało się zastosować przekształcenia",
    validationSuccess: "Walidacja zaliczona",
    validationError: "Walidacja niezaliczona",
    noDataSelected: "Nie wybrano danych",
    operationCancelled: "Operacja anulowana",
    confirmDelete: "Czy na pewno chcesz to usunąć?",
    unsavedChanges: "Masz niezapisane zmiany. Kontynuować?"
  }
};
