export default {
  // === VALIDATION SYSTEM ===
  
  // Sidebar
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
  
  // Validation status
  status: {
    validating: "Walidacja...",
    validated: "Zwalidowano",
    noValidation: "Nie przeprowadzono walidacji",
    lastValidated: "Ostatnia walidacja",
    runValidation: "Uruchom Walidację",
    validationComplete: "Walidacja zakończona",
    validationFailed: "Walidacja nie powiodła się"
  },
  
  // Export
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
  
  // Trends
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
  
  // Auto-fix
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
  
  // Messages
  messages: {
    notApplicable: "Nie dotyczy tego typu badania",
    checklistComplete: "Wszystkie elementy listy kontrolnej ukończone",
    checklistIncomplete: "{{completed}} z {{total}} ukończone"
  }
};
