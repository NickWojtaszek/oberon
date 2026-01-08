export default {
  // === METHODOLOGY ENGINE MODULE ===
  
  // Main Header
  header: {
    title: "Silnik Metodologii",
    subtitle: "Projektowanie Badań i Generowanie Metodologii Wspomagane AI",
    description: "Zautomatyzuj metodologię badawczą dzięki inteligentnym rekomendacjom"
  },
  
  // Tab Navigation
  tabs: {
    generator: "Generator Metodologii",
    studyDesign: "Projekt Badania",
    statistical: "Plan Statystyczny",
    randomization: "Randomizacja",
    sampleSize: "Wielkość Próby",
    timeline: "Harmonogram Badania"
  },
  
  // === METHODOLOGY GENERATOR ===
  generator: {
    title: "Generator Metodologii AI",
    subtitle: "Wygeneruj kompleksową metodologię na podstawie pytania badawczego",
    
    // Input Section
    input: {
      title: "Pytanie Badawcze i Cele",
      researchQuestion: "Główne Pytanie Badawcze",
      researchQuestionPlaceholder: "Jakie jest twoje główne pytanie badawcze?",
      researchQuestionHint: "Określ dokładnie, co chcesz zbadać",
      primaryObjective: "Cel Główny",
      primaryObjectivePlaceholder: "Jaki jest główny cel twojego badania?",
      secondaryObjectives: "Cele Drugorzędne",
      secondaryObjectivePlaceholder: "Wymień cele drugorzędne (opcjonalne)",
      addSecondaryObjective: "Dodaj Cel Drugorzędny",
      studyContext: "Kontekst Badania",
      studyContextPlaceholder: "Podaj tło i uzasadnienie badania",
      targetPopulation: "Populacja Docelowa",
      targetPopulationPlaceholder: "Opisz populację, którą chcesz zbadać",
      intervention: "Interwencja/Ekspozycja",
      interventionPlaceholder: "Opisz badaną interwencję lub ekspozycję",
      comparator: "Komparator/Kontrola",
      comparatorPlaceholder: "Z czym porównywani są uczestnicy?",
      primaryOutcome: "Punkt Końcowy Główny",
      primaryOutcomePlaceholder: "Jaki jest główny pomiar wyniku?",
      secondaryOutcomes: "Punkty Końcowe Drugorzędne",
      secondaryOutcomesPlaceholder: "Wymień punkty końcowe drugorzędne",
      addSecondaryOutcome: "Dodaj Punkt Końcowy Drugorzędny"
    },
    
    // Configuration
    config: {
      title: "Konfiguracja Metodologii",
      studyType: "Typ Badania",
      selectStudyType: "Wybierz typ badania...",
      interventional: "Interwencyjne",
      observational: "Obserwacyjne",
      diagnostic: "Diagnostyczne",
      prognostic: "Prognostyczne",
      metaAnalysis: "Meta-Analiza",
      studyDesign: "Projekt Badania",
      selectDesign: "Wybierz projekt...",
      rct: "Randomizowane Badanie Kontrolowane",
      crossover: "Badanie Krzyżowe",
      cohort: "Badanie Kohortowe",
      caseControl: "Badanie Przypadek-Kontrola",
      crossSectional: "Badanie Przekrojowe",
      beforeAfter: "Badanie Przed-Po",
      phase: "Faza Badania",
      selectPhase: "Wybierz fazę...",
      phaseI: "Faza I (Bezpieczeństwo)",
      phaseII: "Faza II (Skuteczność)",
      phaseIII: "Faza III (Potwierdzenie)",
      phaseIV: "Faza IV (Po Wprowadzeniu na Rynek)",
      blindingLevel: "Poziom Zaślepienia",
      selectBlinding: "Wybierz zaślepienie...",
      unblinded: "Niezaślepione/Otwarte",
      singleBlind: "Pojedynczo Zaślepione",
      doubleBlind: "Podwójnie Zaślepione",
      tripleBlind: "Potrójnie Zaślepione",
      duration: "Czas Trwania Badania",
      durationPlaceholder: "np. 12 miesięcy, 52 tygodnie",
      followUp: "Okres Obserwacji",
      followUpPlaceholder: "np. 6 miesięcy po leczeniu"
    },
    
    // Generation
    generation: {
      generate: "Wygeneruj Metodologię",
      regenerate: "Wygeneruj Ponownie",
      generating: "Generowanie metodologii...",
      analyzing: "Analiza pytania badawczego...",
      designing: "Projektowanie struktury badania...",
      planning: "Planowanie podejścia statystycznego...",
      optimizing: "Optymalizacja metodologii...",
      complete: "Generowanie metodologii zakończone",
      failed: "Generowanie metodologii nie powiodło się",
      tryAgain: "Spróbuj Ponownie"
    },
    
    // Results
    results: {
      title: "Wygenerowana Metodologia",
      overview: "Przegląd",
      fullMethodology: "Pełna Metodologia",
      studyDesign: "Projekt Badania",
      population: "Populacja i Dobór Próby",
      interventions: "Interwencje i Procedury",
      outcomes: "Miary Wyniku",
      statistical: "Analiza Statystyczna",
      ethical: "Kwestie Etyczne",
      timeline: "Harmonogram Badania",
      limitations: "Potencjalne Ograniczenia",
      export: "Eksportuj Metodologię",
      copyToProtocol: "Skopiuj do Protokołu",
      copyToDocument: "Skopiuj do Pisania Akademickiego",
      saveTemplate: "Zapisz jako Szablon"
    },
    
    // Recommendations
    recommendations: {
      title: "Rekomendacje AI",
      studyDesignRec: "Rekomendacje Projektu Badania",
      sampleSizeRec: "Rekomendacje Wielkości Próby",
      statisticalRec: "Rekomendacje Analizy Statystycznej",
      improvementSuggestions: "Ulepszenia Metodologii",
      qualityScore: "Ocena Jakości Metodologii",
      strengthScore: "Siła Projektu Badania",
      acceptRecommendation: "Zaakceptuj Rekomendację",
      viewDetails: "Zobacz Szczegóły",
      applyAll: "Zastosuj Wszystkie Rekomendacje"
    }
  },
  
  // === STUDY DESIGN ===
  studyDesign: {
    title: "Kreator Projektu Badania",
    subtitle: "Skonfiguruj projekt badania krok po kroku",
    
    // Design Selection
    selection: {
      title: "Wybierz Projekt Badania",
      subtitle: "Wybierz najbardziej odpowiedni projekt dla pytania badawczego",
      interventional: "Badania Interwencyjne",
      interventionalDesc: "Testuj efekty interwencji na wyniki",
      observational: "Badania Obserwacyjne",
      observationalDesc: "Obserwuj wyniki bez interwencji",
      diagnostic: "Badania Diagnostyczne",
      diagnosticDesc: "Oceń dokładność testów diagnostycznych",
      recommended: "Rekomendowane dla twoich celów",
      confidence: "Pewność: {{percent}}%",
      whyRecommended: "Dlaczego to jest rekomendowane?",
      selectDesign: "Wybierz Ten Projekt"
    },
    
    // Design Configuration
    configuration: {
      title: "Konfiguracja Projektu",
      arms: "Ramiona Badania",
      addArm: "Dodaj Ramię Badania",
      armName: "Nazwa Ramienia",
      armType: "Typ Ramienia",
      experimental: "Eksperymentalne",
      control: "Kontrolne",
      activeComparator: "Aktywny Komparator",
      placebo: "Placebo",
      sham: "Pozorowane",
      noIntervention: "Bez Interwencji",
      armDescription: "Opis Ramienia",
      armSize: "Docelowa Rekrutacja",
      allocation: "Alokacja",
      randomized: "Randomizowane",
      nonRandomized: "Nierandomizowane",
      allocationRatio: "Stosunek Alokacji",
      stratification: "Stratyfikacja",
      addStratificationFactor: "Dodaj Czynnik Stratyfikacji",
      stratificationFactor: "Czynnik Stratyfikacji",
      levels: "Poziomy"
    },
    
    // Eligibility Criteria
    eligibility: {
      title: "Kryteria Kwalifikowalności",
      inclusionCriteria: "Kryteria Włączenia",
      addInclusion: "Dodaj Kryterium Włączenia",
      exclusionCriteria: "Kryteria Wyłączenia",
      addExclusion: "Dodaj Kryterium Wyłączenia",
      criterionPlaceholder: "Wprowadź kryterium...",
      ageRange: "Zakres Wieku",
      minAge: "Minimalny Wiek",
      maxAge: "Maksymalny Wiek",
      years: "lat",
      sex: "Płeć",
      all: "Wszyscy",
      male: "Mężczyzna",
      female: "Kobieta",
      healthyVolunteers: "Zdrowi Ochotnicy",
      accepted: "Akceptowani",
      notAccepted: "Nie Akceptowani"
    },
    
    // Endpoints
    endpoints: {
      title: "Punkty Końcowe Badania",
      primaryEndpoint: "Główny Punkt Końcowy",
      addPrimaryEndpoint: "Dodaj Główny Punkt Końcowy",
      secondaryEndpoints: "Drugorzędne Punkty Końcowe",
      addSecondaryEndpoint: "Dodaj Drugorzędny Punkt Końcowy",
      exploratoryEndpoints: "Eksploracyjne Punkty Końcowe",
      addExploratoryEndpoint: "Dodaj Eksploracyjny Punkt Końcowy",
      endpointName: "Nazwa Punktu Końcowego",
      endpointType: "Typ Punktu Końcowego",
      timepoint: "Punkt Czasowy Oceny",
      analysisMethod: "Metoda Analizy",
      efficacy: "Skuteczność",
      safety: "Bezpieczeństwo",
      pharmacokinetic: "Farmakokinetyka",
      pharmacodynamic: "Farmakodynamika",
      qualityOfLife: "Jakość Życia",
      biomarker: "Biomarker"
    },
    
    // Preview
    preview: {
      title: "Podgląd Projektu",
      summary: "Podsumowanie Projektu",
      flowDiagram: "Diagram Przepływu Badania",
      armsSummary: "Podsumowanie Ramion Badania",
      eligibilitySummary: "Podsumowanie Kwalifikowalności",
      endpointsSummary: "Podsumowanie Punktów Końcowych",
      saveDesign: "Zapisz Projekt Badania",
      exportDesign: "Eksportuj Projekt"
    }
  },
  
  // === STATISTICAL PLAN ===
  statistical: {
    title: "Plan Analizy Statystycznej",
    subtitle: "Zdefiniuj podejście statystyczne",
    
    // Analysis Strategy
    strategy: {
      title: "Strategia Analizy",
      analysisPlan: "Plan Analizy Statystycznej",
      primaryAnalysis: "Analiza Główna",
      secondaryAnalysis: "Analiza Drugorzędna",
      subgroupAnalysis: "Analiza Podgrup",
      sensitivityAnalysis: "Analiza Wrażliwości",
      interimAnalysis: "Analiza Pośrednia",
      addAnalysis: "Dodaj Analizę"
    },
    
    // Analysis Methods
    methods: {
      title: "Metody Analizy",
      selectMethod: "Wybierz metodę statystyczną...",
      descriptive: "Statystyki Opisowe",
      tTest: "Test t",
      anova: "ANOVA",
      regression: "Analiza Regresji",
      logistic: "Regresja Logistyczna",
      cox: "Proporcjonalne Ryzyka Coxa",
      kaplanMeier: "Analiza Kaplana-Meiera",
      chiSquare: "Test Chi-Kwadrat",
      fisher: "Test Dokładny Fishera",
      mannWhitney: "Test U Manna-Whitneya",
      wilcoxon: "Test Rangowanych Znaków Wilcoxona",
      mcnemar: "Test McNemara",
      friedman: "Test Friedmana",
      mixedModel: "Model Efektów Mieszanych"
    },
    
    // Hypothesis Testing
    hypothesis: {
      title: "Testowanie Hipotez",
      nullHypothesis: "Hipoteza Zerowa (H₀)",
      alternativeHypothesis: "Hipoteza Alternatywna (H₁)",
      hypothesisPlaceholder: "Sformułuj hipotezę...",
      testType: "Typ Testu",
      superiority: "Wyższość",
      nonInferiority: "Nie-Niższość",
      equivalence: "Równoważność",
      significanceLevel: "Poziom Istotności (α)",
      power: "Moc Statystyczna (1-β)",
      effectSize: "Oczekiwana Wielkość Efektu",
      tails: "Strony",
      oneTailed: "Jednostronny",
      twoTailed: "Dwustronny"
    },
    
    // Analysis Populations
    populations: {
      title: "Populacje Analizy",
      itt: "Intention-to-Treat (ITT)",
      ittDesc: "Wszyscy zrandomizowani uczestnicy",
      pp: "Per-Protocol (PP)",
      ppDesc: "Uczest. którzy ukończyli zgodnie z protokołem",
      safety: "Populacja Bezpieczeństwa",
      safetyDesc: "Wszyscy uczest. którzy otrzymali przynajmniej jedną dawkę",
      modifiedItt: "Zmodyfikowane ITT",
      modifiedIttDesc: "ITT z określonymi wyłączeniami",
      selectPopulation: "Wybierz populację analizy dla każdego punktu końcowego"
    },
    
    // Missing Data
    missingData: {
      title: "Obsługa Brakujących Danych",
      strategy: "Strategia Brakujących Danych",
      completeCase: "Analiza Kompletnych Przypadków",
      completeCaseDesc: "Wyklucz uczestników z brakującymi danymi",
      lastObservation: "Ostatnia Obserwacja Przeniesiona Dalej (LOCF)",
      lastObservationDesc: "Użyj ostatniej dostępnej wartości",
      multipleImputation: "Imputacja Wielokrotna",
      multipleImputationDesc: "Imputuj brakujące wartości statystycznie",
      mixedModel: "Model Mieszany",
      mixedModelDesc: "Obsługuj brakujące dane w modelu",
      worstCase: "Imputacja Najgorszego Przypadku",
      worstCaseDesc: "Przypisz najgorszy wynik do brakujących"
    },
    
    // Adjustments
    adjustments: {
      title: "Korekty Statystyczne",
      multipleComparisons: "Korekta Porównań Wielokrotnych",
      bonferroni: "Korekta Bonferroniego",
      holm: "Holm-Bonferroni",
      benjaminiHochberg: "Benjamini-Hochberg (FDR)",
      none: "Bez Korekty",
      covariates: "Zmienne Towarzyszące",
      addCovariate: "Dodaj Zmienną Towarzyszącą",
      covariateName: "Nazwa Zmiennej Towarzyszącej",
      adjustmentMethod: "Metoda Korekty"
    }
  },
  
  // === RANDOMIZATION ===
  randomization: {
    title: "Schemat Randomizacji",
    subtitle: "Skonfiguruj procedury randomizacji i zaślepiania",
    
    // Randomization Type
    type: {
      title: "Typ Randomizacji",
      simple: "Randomizacja Prosta",
      simpleDesc: "Czysta losowa alokacja (np. rzut monetą)",
      block: "Randomizacja Blokowa",
      blockDesc: "Randomizuj w blokach, aby utrzymać równowagę",
      stratified: "Randomizacja Stratyfikowana",
      stratifiedDesc: "Równowaga w czynnikach prognostycznych",
      adaptive: "Randomizacja Adaptacyjna",
      adaptiveDesc: "Dostosuj alokację na podstawie odpowiedzi",
      minimization: "Minimalizacja",
      minimizationDesc: "Minimalizuj brak równowagi w czynnikach"
    },
    
    // Block Randomization
    block: {
      title: "Randomizacja Blokowa",
      blockSize: "Rozmiar Bloku",
      fixedBlock: "Stały Rozmiar Bloku",
      variableBlock: "Zmienne Rozmiary Bloków",
      blockSizes: "Rozmiary Bloków",
      blockSizesPlaceholder: "np. 4, 6, 8",
      allocationRatio: "Stosunek Alokacji",
      ratioPlaceholder: "np. 1:1, 2:1"
    },
    
    // Stratification
    stratification: {
      title: "Stratyfikacja",
      factors: "Czynniki Stratyfikacji",
      addFactor: "Dodaj Czynnik Stratyfikacji",
      factorName: "Nazwa Czynnika",
      factorLevels: "Poziomy Czynnika",
      addLevel: "Dodaj Poziom",
      balancing: "Algorytm Równoważenia",
      permutedBlock: "Blok Permutowany",
      dynamicAllocation: "Alokacja Dynamiczna"
    },
    
    // Blinding
    blinding: {
      title: "Procedury Zaślepiania",
      blindingLevel: "Poziom Zaślepienia",
      open: "Otwarte (Niezaślepione)",
      openDesc: "Wszystkie strony świadome leczenia",
      single: "Pojedynczo Zaślepione",
      singleDesc: "Uczestnicy zaślepieni",
      double: "Podwójnie Zaślepione",
      doubleDesc: "Uczestnicy i badacze zaślepieni",
      triple: "Potrójnie Zaślepione",
      tripleDesc: "Uczestnicy, badacze i oceniający zaślepieni",
      blindedParties: "Zaślepione Strony",
      participants: "Uczestnicy",
      investigators: "Badacze",
      outcomeAssessors: "Oceniający Wyniki",
      dataAnalysts: "Analitycy Danych",
      unblindingProcedure: "Procedura Odślepiania",
      unblindingPlaceholder: "Opisz procedury awaryjnego odślepiania..."
    },
    
    // Implementation
    implementation: {
      title: "Wdrożenie",
      randomizationSystem: "System Randomizacji",
      centralSystem: "Centralny System Randomizacji",
      siteSpecific: "Randomizacja Specyficzna dla Ośrodka",
      ivrs: "Interaktywny System Głosowy (IVRS)",
      iwrs: "Interaktywny System Internetowy (IWRS)",
      envelopeMethod: "Metoda Zapieczętowanych Kopert",
      allocationConcealment: "Ukrycie Alokacji",
      concealmentMethod: "Metoda Ukrycia",
      concealmentPlaceholder: "Opisz procedury ukrycia alokacji...",
      generateScheme: "Wygeneruj Schemat Randomizacji",
      downloadScheme: "Pobierz Listę Randomizacji"
    }
  },
  
  // === SAMPLE SIZE ===
  sampleSize: {
    title: "Obliczanie Wielkości Próby",
    subtitle: "Określ wymaganą wielkość próby dla badania",
    
    // Calculator
    calculator: {
      title: "Kalkulator Wielkości Próby",
      methodology: "Metodologia Statystyczna",
      selectMethodology: "Wybierz metodologię...",
      effectSize: "Wielkość Efektu",
      effectSizeHint: "Oczekiwana różnica między grupami",
      standardDeviation: "Odchylenie Standardowe",
      alpha: "Alfa (Poziom Istotności)",
      alphaHint: "Prawdopodobieństwo błędu I rodzaju (zwykle 0,05)",
      power: "Moc (1-Beta)",
      powerHint: "Prawdopodobieństwo wykrycia prawdziwego efektu (zwykle 0,80 lub 0,90)",
      allocationRatio: "Stosunek Alokacji",
      tails: "Strony",
      oneTailed: "Jednostronny",
      twoTailed: "Dwustronny",
      attritionRate: "Oczekiwana Stopa Ubytku",
      attritionRateHint: "Oczekiwana stopa rezygnacji (%)",
      calculate: "Oblicz Wielkość Próby",
      recalculate: "Przelicz Ponownie"
    },
    
    // Results
    results: {
      title: "Wyniki Wielkości Próby",
      requiredPerGroup: "Wymagana Wielkość Próby (na grupę)",
      totalRequired: "Całkowita Wymagana Wielkość Próby",
      withAttrition: "Skorygowana o Ubytek",
      totalWithAttrition: "Całkowita z Ubytkiem",
      assumptions: "Założenia",
      effectSize: "Wielkość Efektu",
      power: "Moc",
      alpha: "Alfa",
      allocationRatio: "Stosunek Alokacji",
      detailsReport: "Szczegółowy Raport Wielkości Próby",
      saveCalculation: "Zapisz Obliczenie",
      exportReport: "Eksportuj Raport"
    },
    
    // Power Analysis
    powerAnalysis: {
      title: "Analiza Mocy",
      powerCurve: "Krzywa Mocy",
      sensitivityAnalysis: "Analiza Wrażliwości",
      varyEffectSize: "Zmień Wielkość Efektu",
      varySampleSize: "Zmień Wielkość Próby",
      varyAlpha: "Zmień Alfa",
      generateCurve: "Wygeneruj Krzywą Mocy"
    }
  },
  
  // === STUDY TIMELINE ===
  timeline: {
    title: "Harmonogram Badania",
    subtitle: "Zaplanuj harmonogram i kamienie milowe badania",
    
    // Timeline Builder
    builder: {
      title: "Kreator Harmonogramu",
      addPhase: "Dodaj Fazę Badania",
      addMilestone: "Dodaj Kamień Milowy",
      phaseName: "Nazwa Fazy",
      startDate: "Data Rozpoczęcia",
      endDate: "Data Zakończenia",
      duration: "Czas Trwania",
      description: "Opis",
      screening: "Badania Przesiewowe",
      enrollment: "Rekrutacja",
      treatment: "Leczenie",
      followUp: "Obserwacja",
      dataAnalysis: "Analiza Danych",
      reporting: "Raportowanie"
    },
    
    // Visit Schedule
    visitSchedule: {
      title: "Harmonogram Wizyt",
      addVisit: "Dodaj Wizytę Badania",
      visitNumber: "Numer Wizyty",
      visitName: "Nazwa Wizyty",
      timepoint: "Punkt Czasowy",
      visitWindow: "Okno Wizyty",
      procedures: "Procedury/Oceny",
      baseline: "Linia Bazowa",
      week: "Tydzień",
      month: "Miesiąc",
      day: "Dzień",
      endOfStudy: "Koniec Badania",
      unscheduled: "Niezaplanowane"
    },
    
    // Gantt Chart
    gantt: {
      title: "Wykres Gantta",
      viewGantt: "Zobacz Wykres Gantta",
      exportGantt: "Eksportuj Wykres Gantta",
      phases: "Fazy",
      milestones: "Kamienie Milowe",
      today: "Dzisiaj"
    }
  },
  
  // === COMMON ACTIONS ===
  actions: {
    generate: "Generuj",
    regenerate: "Wygeneruj Ponownie",
    save: "Zapisz",
    export: "Eksportuj",
    cancel: "Anuluj",
    back: "Wstecz",
    next: "Dalej",
    finish: "Zakończ",
    calculate: "Oblicz",
    recalculate: "Przelicz Ponownie",
    apply: "Zastosuj",
    preview: "Podgląd",
    download: "Pobierz"
  },
  
  // === COMMON MESSAGES ===
  messages: {
    generationSuccess: "Metodologia wygenerowana pomyślnie",
    generationError: "Nie udało się wygenerować metodologii",
    saveSuccess: "Zapisano pomyślnie",
    saveError: "Nie udało się zapisać",
    calculationComplete: "Obliczenie zakończone",
    calculationError: "Obliczenie nie powiodło się",
    invalidInput: "Sprawdź swoje dane wejściowe",
    missingRequired: "Wypełnij wszystkie wymagane pola"
  }
};
