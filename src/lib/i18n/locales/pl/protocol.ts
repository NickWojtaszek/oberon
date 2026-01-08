export default {
  // === PROTOCOL WORKBENCH ===
  
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
    helpPlaceholder: "Wprowadź tekst pomocniczy dla tego pola"
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
    generate: "Generuj Schemat"
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
  }
};
