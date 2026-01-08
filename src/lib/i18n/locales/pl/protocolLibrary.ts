export default {
  // === PROTOCOL LIBRARY ===
  
  // Header
  header: {
    title: "Biblioteka Protokołów",
    description: "Przeglądaj i zarządzaj protokołami badań",
    newProtocol: "Nowy Protokół",
    importProtocol: "Importuj Protokół"
  },
  
  // View Controls
  viewControls: {
    gridView: "Widok Siatki",
    listView: "Widok Listy",
    sortBy: "Sortuj według",
    filterBy: "Filtruj według",
    showFilters: "Pokaż Filtry",
    hideFilters: "Ukryj Filtry"
  },
  
  // Sort Options
  sortOptions: {
    nameAsc: "Nazwa (A-Z)",
    nameDesc: "Nazwa (Z-A)",
    dateCreated: "Data Utworzenia",
    dateModified: "Ostatnio Zmodyfikowane",
    studyType: "Typ Badania",
    status: "Status"
  },
  
  // Filter Options
  filters: {
    allProtocols: "Wszystkie Protokoły",
    myProtocols: "Moje Protokoły",
    sharedWithMe: "Udostępnione Mi",
    recentlyViewed: "Ostatnio Przeglądane",
    favorites: "Ulubione",
    studyType: "Typ Badania",
    status: "Status",
    phase: "Faza",
    therapeuticArea: "Obszar Terapeutyczny",
    clearFilters: "Wyczyść Wszystkie Filtry"
  },
  
  // Study Types
  studyTypes: {
    all: "Wszystkie Typy",
    rct: "Randomizowane Badanie Kontrolowane",
    observational: "Badanie Obserwacyjne",
    singleArm: "Badanie Jednoramienne",
    diagnostic: "Badanie Diagnostyczne",
    registry: "Badanie Rejestrowe",
    other: "Inne"
  },
  
  // Status Options
  statusOptions: {
    all: "Wszystkie Statusy",
    draft: "Szkic",
    inReview: "W Przeglądzie",
    approved: "Zatwierdzony",
    active: "Aktywny",
    completed: "Ukończony",
    archived: "Zarchiwizowany"
  },
  
  // Phase Options
  phaseOptions: {
    all: "Wszystkie Fazy",
    phase1: "Faza I",
    phase2: "Faza II",
    phase3: "Faza III",
    phase4: "Faza IV",
    notApplicable: "Nie dotyczy"
  },
  
  // Protocol Card
  card: {
    clickToOpen: "Kliknij, aby otworzyć",
    current: "Bieżący",
    created: "Utworzono",
    modified: "Zmodyfikowano",
    modifiedBy: "Zmodyfikował",
    published: "Opublikowano",
    versions: "wersja",
    versions_plural: "wersji",
    viewOlderVersions: "Zobacz {{count}} starszych wersji",
    continueEditing: "Kontynuuj Edycję",
    publish: "Opublikuj",
    view: "Zobacz",
    createNewVersion: "Utwórz Nową Wersję",
    untitledProtocol: "[Protokół Bez Tytułu]",
    noNumber: "[Brak Numeru]",
    // Status badges
    statusDraft: "Szkic",
    statusPublished: "Opublikowany",
    statusArchived: "Zarchiwizowany",
    // Legacy fields
    createdBy: "Utworzony przez",
    lastModified: "Zmodyfikowany",
    studyType: "Typ Badania",
    phase: "Faza",
    status: "Status",
    participants: "Uczestnicy",
    endpoints: "Punkty Końcowe",
    variables: "Zmienne",
    version: "Wersja",
    open: "Otwórz",
    edit: "Edytuj",
    duplicate: "Duplikuj",
    archive: "Archiwizuj",
    delete: "Usuń",
    share: "Udostępnij",
    export: "Eksportuj",
    addToFavorites: "Dodaj do Ulubionych",
    removeFromFavorites: "Usuń z Ulubionych",
    viewDetails: "Zobacz Szczegóły"
  },
  
  // Search
  search: {
    placeholder: "Szukaj protokołów po nazwie, ID lub słowie kluczowym...",
    noResults: "Nie znaleziono protokołów",
    noResultsMessage: "Spróbuj dostosować wyszukiwanie lub filtry",
    resultsCount: "Znaleziono {{count}} protokół",
    resultsCount_plural: "Znaleziono {{count}} protokołów"
  },
  
  // Empty States
  emptyStates: {
    noProtocols: {
      title: "Brak Protokołów",
      description: "Zacznij od utworzenia pierwszego protokołu lub zaimportowania istniejącego.",
      actionCreate: "Utwórz Protokół",
      actionImport: "Importuj Protokół"
    },
    noFavorites: {
      title: "Brak Ulubionych",
      description: "Oznacz gwiazdką często używane protokoły, aby szybko do nich wrócić.",
      action: "Przeglądaj Wszystkie Protokoły"
    },
    noShared: {
      title: "Brak Udostępnionych Protokołów",
      description: "Protokoły udostępnione Ci przez członków zespołu pojawią się tutaj.",
      action: "Przeglądaj Moje Protokoły"
    },
    noRecent: {
      title: "Brak Ostatnich Protokołów",
      description: "Ostatnio przeglądane protokoły pojawią się tutaj.",
      action: "Przeglądaj Wszystkie Protokoły"
    }
  },
  
  // Actions
  actions: {
    createNew: "Utwórz Nowy Protokół",
    importFromFile: "Importuj z Pliku",
    importFromTemplate: "Importuj z Szablonu",
    bulkActions: "Akcje Grupowe",
    selectAll: "Zaznacz Wszystko",
    deselectAll: "Odznacz Wszystko",
    archiveSelected: "Archiwizuj Zaznaczone",
    deleteSelected: "Usuń Zaznaczone",
    exportSelected: "Eksportuj Zaznaczone"
  },
  
  // Create Protocol Modal
  createModal: {
    title: "Utwórz Nowy Protokół",
    protocolName: "Nazwa Protokołu",
    protocolNumber: "Numer Protokołu",
    studyType: "Typ Badania",
    phase: "Faza (Opcjonalne)",
    therapeuticArea: "Obszar Terapeutyczny (Opcjonalne)",
    description: "Opis (Opcjonalny)",
    startFromTemplate: "Zacznij od Szablonu",
    startFromScratch: "Zacznij od Zera",
    selectTemplate: "Wybierz szablon...",
    create: "Utwórz Protokół",
    creating: "Tworzenie..."
  },
  
  // Import Modal
  importModal: {
    title: "Importuj Protokół",
    uploadFile: "Wgraj Plik",
    dragAndDrop: "Przeciągnij i upuść plik protokołu tutaj",
    or: "lub",
    browse: "Przeglądaj Pliki",
    supportedFormats: "Obsługiwane formaty: JSON, XML, CSV",
    importing: "Importowanie...",
    importSuccess: "Protokół zaimportowany pomyślnie",
    importError: "Nie udało się zaimportować protokołu"
  },
  
  // Delete Confirmation
  deleteConfirm: {
    title: "Usunąć Protokół?",
    message: "Czy na pewno chcesz usunąć \"{{name}}\"? Tej operacji nie można cofnąć.",
    messageMultiple: "Czy na pewno chcesz usunąć {{count}} protokołów? Tej operacji nie można cofnąć.",
    confirm: "Usuń Protokół",
    confirmMultiple: "Usuń {{count}} Protokołów",
    cancel: "Anuluj",
    deleting: "Usuwanie...",
    deleteSuccess: "Protokół usunięty pomyślnie",
    deleteSuccessMultiple: "Usunięto {{count}} protokołów pomyślnie",
    deleteError: "Nie udało się usunąć protokołu"
  },
  
  // Archive Confirmation
  archiveConfirm: {
    title: "Archiwizować Protokół?",
    message: "Czy na pewno chcesz zarchiwizować \"{{name}}\"?",
    messageMultiple: "Czy na pewno chcesz zarchiwizować {{count}} protokołów?",
    confirm: "Archiwizuj Protokół",
    confirmMultiple: "Archiwizuj {{count}} Protokołów",
    cancel: "Anuluj",
    archiving: "Archiwizowanie...",
    archiveSuccess: "Protokół zarchiwizowany pomyślnie",
    archiveSuccessMultiple: "Zarchiwizowano {{count}} protokołów pomyślnie",
    archiveError: "Nie udało się zarchiwizować protokołu"
  },
  
  // Duplicate Modal
  duplicateModal: {
    title: "Duplikuj Protokół",
    newName: "Nazwa Nowego Protokołu",
    copyData: "Kopiuj Dane Schematu",
    copySettings: "Kopiuj Ustawienia",
    duplicate: "Duplikuj",
    duplicating: "Duplikowanie...",
    duplicateSuccess: "Protokół zduplikowany pomyślnie",
    duplicateError: "Nie udało się zduplikować protokołu"
  },
  
  // Share Modal
  shareModal: {
    title: "Udostępnij Protokół",
    shareWith: "Udostępnij dla",
    addPeople: "Dodaj osoby lub zespoły...",
    permissions: "Uprawnienia",
    canView: "Może Przeglądać",
    canEdit: "Może Edytować",
    canAdmin: "Może Administrować",
    sendNotification: "Wyślij powiadomienie e-mail",
    share: "Udostępnij",
    sharing: "Udostępnianie...",
    shareSuccess: "Protokół udostępniony pomyślnie",
    shareError: "Nie udało się udostępnić protokołu",
    currentlySharedWith: "Obecnie udostępniony dla",
    removeAccess: "Usuń Dostęp"
  },
  
  // Export Options
  exportOptions: {
    title: "Eksportuj Protokół",
    format: "Format Eksportu",
    formatJSON: "JSON (Pełne Dane)",
    formatPDF: "PDF (Dokument)",
    formatCSV: "CSV (Tylko Dane)",
    formatXML: "XML (Standard)",
    includeSchema: "Dołącz Schemat",
    includeData: "Dołącz Zebrane Dane",
    includeMetadata: "Dołącz Metadane",
    includeAttachments: "Dołącz Załączniki",
    export: "Eksportuj",
    exporting: "Eksportowanie...",
    exportSuccess: "Protokół wyeksportowany pomyślnie",
    exportError: "Nie udało się wyeksportować protokołu"
  },
  
  // Metadata
  metadata: {
    protocolId: "ID Protokołu",
    version: "Wersja",
    createdDate: "Utworzony",
    modifiedDate: "Ostatnio Zmodyfikowany",
    createdBy: "Utworzony Przez",
    modifiedBy: "Ostatnio Zmodyfikowany Przez",
    studyType: "Typ Badania",
    phase: "Faza",
    therapeuticArea: "Obszar Terapeutyczny",
    targetEnrollment: "Docelowa Liczba Uczestników",
    primaryEndpoint: "Pierwotny Punkt Końcowy",
    duration: "Czas Trwania Badania",
    sites: "Ośrodki",
    tags: "Tagi"
  }
};