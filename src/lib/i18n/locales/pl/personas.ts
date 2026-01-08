export default {
  title: "Persony AI",
  subtitle: "Inteligentni Asystenci Walidacji",
  managerTitle: "Menedżer Person AI",
  managerSubtitle: "{{active}} z {{total}} person aktywnych",
  
  protocolAuditor: {
    name: "Audytor Protokołu",
    description: "Walidacja dokumentów protokołu, struktury schematów i walidacji krzyżowej dla zgodności regulacyjnej wspomagana przez AI",
    scoreLabel: "Wynik Zgodności"
  },
  
  schemaArchitect: {
    name: "Architekt Schematu",
    description: "Rekomendacje zmiennych specyficznych dla typu badania i walidacja struktury schematu",
    scoreLabel: "Pokrycie Zmiennych"
  },
  
  statisticalAdvisor: {
    name: "Doradca Metod Statystycznych",
    description: "Odpowiednie dla typu badania metody statystyczne i walidacja planu analizy",
    scoreLabel: "Wynik Rygoru Statystycznego"
  },
  
  dataQualitySentinel: {
    name: "Strażnik Jakości Danych",
    description: "Walidacja danych w czasie rzeczywistym, kontrole zakresów i wymuszanie logicznej spójności",
    scoreLabel: "Wynik Jakości Danych"
  },
  
  ethicsCompliance: {
    name: "AI Zgodności Etycznej i Komisji Bioetycznej",
    description: "Gotowość do złożenia dokumentów do KB, walidacja świadomej zgody i sprawdzanie zgodności regulacyjnej",
    scoreLabel: "Wynik Zgodności Etycznej"
  },
  
  safetyVigilance: {
    name: "AI Nadzoru Bezpieczeństwa",
    description: "Monitorowanie zdarzeń niepożądanych, zgodność raportowania SAE i wykrywanie sygnałów bezpieczeństwa",
    scoreLabel: "Wynik Monitoringu Bezpieczeństwa"
  },
  
  endpointValidator: {
    name: "Walidator Klinicznych Punktów Końcowych",
    description: "Wsparcie adjudykacji punktów końcowych i walidacja zdarzeń klinicznych",
    scoreLabel: "Wynik Jakości Punktów Końcowych"
  },
  
  amendmentAdvisor: {
    name: "Doradca ds. Poprawek Protokołu",
    description: "Analiza wpływu poprawek i wytyczne dotyczące klasyfikacji regulacyjnej",
    scoreLabel: "Ocena Ryzyka Poprawek"
  },
  
  irbCompliance: {
    name: "Monitor Zgodności z Komisją Bioetyczną",
    description: "Waliduje gotowość do złożenia dokumentów do Komisji Bioetycznej i zapewnia dokumentację wszystkich wymaganych elementów protokołu",
    scoreLabel: "Wynik Zgodności z KB"
  },
  
  status: {
    active: "Aktywny",
    inactive: "Nieaktywny",
    validating: "Walidacja...",
    ready: "Gotowy",
    required: "Wymagany",
    optional: "Opcjonalny"
  },
  
  actions: {
    enableAll: "Włącz Wszystkie",
    disableAll: "Wyłącz Niewymagane",
    viewReport: "Zobacz Pełny Raport",
    exportReport: "Eksportuj Raport",
    viewTrends: "Zobacz Trendy",
    configure: "Konfiguruj"
  },
  
  configuration: {
    studyConfig: "Konfiguracja Badania",
    studyType: "Typ Badania",
    selectStudyType: "Wybierz typ badania...",
    regulatoryFrameworks: "Ramy Regulacyjne",
    language: "Język",
    selectLanguage: "Wybierz język..."
  },
  
  studyTypes: {
    rct: "Randomizowane Badanie Kontrolowane (RCT)",
    observational: "Badanie Obserwacyjne",
    singleArm: "Badanie Jednoramienne",
    diagnostic: "Badanie Diagnostyczne",
    registry: "Rejestr / Dane ze Świata Rzeczywistego",
    phase1: "Faza I - Dobór Dawki",
    phase2: "Faza II - Skuteczność",
    phase3: "Faza III - Potwierdzenie",
    phase4: "Faza IV - Po Wprowadzeniu na Rynek",
    medicalDevice: "Badanie Wyrobu Medycznego"
  },
  
  regulatoryFrameworks: {
    FDA: "FDA (Stany Zjednoczone)",
    EMA: "EMA (Unia Europejska)",
    PMDA: "PMDA (Japonia)",
    "ICH-GCP": "ICH-GCP (Międzynarodowe)",
    HIPAA: "HIPAA (Prywatność Danych)"
  },
  
  scores: {
    excellent: "Doskonały",
    good: "Dobry",
    fair: "Zadowalający",
    needsWork: "Wymaga Poprawy",
    critical: "Krytyczne Problemy",
    notScored: "Nie Oceniono"
  },
  
  library: {
    title: "Biblioteka Zwalidowanych Person AI",
    subtitle: "{{count}} certyfikowanych person gotowych do użycia produkcyjnego • Wszystkie konfiguracje są niezmienne i posiadają ślad audytu",
    filterByType: "Filtruj według typu",
    sortBy: "Sortuj według:",
    createPersona: "Utwórz Personę",
    allPersonas: "Wszystkie Persony",
    systemBuilt: "WBUDOWANA W SYSTEM",
    nonEditable: "NIEEDYTOWALNA",
    locked: "ZABLOKOWANA",
    validated: "Zwalidowana",
    platformCore: "Rdzeń Platformy",
    cloneToDraft: "Klonuj do Szkicu",
    cloning: "Klonowanie...",
    hideDetails: "Ukryj Szczegóły",
    viewDetails: "Pokaż Szczegóły",
    auditLog: "Dziennik Audytu",
    exportPdf: "Eksportuj PDF",
    systemPersonasCannotBeCloned: "Persony systemowe nie mogą być klonowane",
    configurationSnapshot: "Migawka Konfiguracji",
    immutableRecord: "Niezmienny zapis wszystkich reguł i zasad zarządzania",
    systemLevelGuardrail: "ZABEZPIECZENIE POZIOMU SYSTEMU",
    systemBuiltDescription: "Ta persona jest wbudowana w platformę i zasila Warstwę Logiki Statystycznej w Warsztacie Protokołu. Automatycznie waliduje projekty schematów, wymusza standardy kliniczne (NIHSS, mRS, punkty końcowe śmiertelności), blokuje nieprawidłowe testy statystyczne i generuje niezmienny ślad audytu dla zgodności regulacyjnej.",
    autoDetection: "Auto-Wykrywanie",
    autoDetectionDescription: "NIHSS, mRS, punkty końcowe śmiertelności, wyniki binarne",
    validation: "Walidacja",
    validationDescription: "Kompatybilność testów statystycznych, wymuszanie typu danych",
    interpretationRules: "Reguły Interpretacji",
    disallowedInferences: "Niedozwolone Wnioski",
    languageControls: "Kontrole Językowe",
    tone: "Ton",
    confidence: "Pewność",
    neverWriteFullSections: "Nigdy nie pisz pełnych sekcji",
    noAnthropomorphism: "Bez antropomorfizacji",
    forbiddenPhrases: "Zabronione Frazy",
    outcomeFocus: "Fokus na Wynikach",
    primaryEndpoint: "Główny Punkt Końcowy",
    citationPolicy: "Polityka Cytowań",
    mandatoryEvidence: "Obowiązkowe dowody",
    strength: "Siła",
    scope: "Zakres",
    immutabilityWarning: "Niezmienny Zapis",
    immutabilityDescription: "Konfiguracja zablokowana przez politykę RLS bazy danych. Klonuj, aby utworzyć nową wersję roboczą.",
    noCertifiedPersonas: "Brak Certyfikowanych Person",
    noCertifiedPersonasDescription: "Zablokuj i zwaliduj persony w sekcji Zarządzania, aby certyfikować je do użycia produkcyjnego.",
    lockedAt: "Zablokowana {{date}}",
    version: "w{{version}}",
    clonedTo: "Klonowanie \"{{name}}\" do w{{version}} Szkicu...",
    auditTimeline: "Oś Czasu Audytu",
    created: "Utworzona",
    validatedAction: "Zwalidowana",
    lockedForProduction: "Zablokowana dla Produkcji",
    by: "przez {{user}}",
    at: "o {{time}}"
  },
  
  types: {
    analysis: "Analiza i Przegląd",
    statistical: "Ekspert Statystyczny",
    writing: "Pisanie Akademickie",
    safety: "Przegląd Bezpieczeństwa",
    validation: "Walidacja Schematu"
  },
  
  tones: {
    socratic: "Pytania Sokratejskie",
    neutral: "Neutralny Obserwator",
    academic: "Akademicki Formalny"
  },
  
  confidenceLevels: {
    "1": "Maksymalne Wahanie",
    "2": "Konserwatywny",
    "3": "Zrównoważony",
    "4": "Asertywny",
    "5": "Definitywny"
  },
  
  citationStrengths: {
    "1": "Luźny",
    "2": "Umiarkowany",
    "3": "Standardowy",
    "4": "Ścisły",
    "5": "Maksymalny"
  },
  
  knowledgeBaseScopes: {
    currentProject: "Bieżący Projekt",
    allProjects: "Wszystkie Projekty"
  },
  
  sortOptions: {
    name: "Nazwa",
    date: "Data Utworzenia",
    type: "Typ Persony",
    version: "Wersja"
  },
  
  roles: {
    contributor: {
      name: "Rola Współpracownika",
      description: "Możesz tworzyć i testować persony. Użyj \"Poproś o Walidację\", aby przesłać do zatwierdzenia przez Głównego Naukowca. Nieformalne nazwy dozwolone w fazie roboczej."
    },
    leadScientist: {
      name: "Rola Głównego Naukowca",
      description: "Możesz blokować persony do użytku produkcyjnego. Wymagane profesjonalne nazewnictwo (5+ znaków). Dostęp do pełnej walidacji i piaskownicy symulacji."
    },
    admin: {
      name: "Rola Administratora",
      description: "Pełny dostęp do systemu, w tym dzienniki audytu, historia wersji i archiwizacja person. Możliwość nadpisania zablokowanych person i zarządzania wszystkimi użytkownikami."
    }
  },
  
  guidance: {
    title: "Wytyczne Persony",
    identity: {
      title: "Tożsamość i Cel",
      description: "Zdefiniuj podstawową tożsamość i focus terapeutyczny swojej persony AI.",
      tips: [
        "Wybierz typ persony odpowiadający Twoim potrzebom walidacyjnym",
        "Profesjonalne nazewnictwo (5+ znaków) jest wymagane dla produkcji",
        "Obszar terapeutyczny i faza badania wpływają na rekomendacje AI"
      ]
    },
    interpretation: {
      title: "Zasady Interpretacji",
      description: "Kontroluj, co AI może, a czego nie może wnioskować.",
      tips: [
        "Zdefiniuj jasne granice dla interpretacji AI",
        "Konflikty między dozwolonymi/niedozwolonymi regułami zablokują walidację",
        "Te zasady zapewniają zgodność regulacyjną i bezpieczeństwo pacjenta"
      ]
    },
    language: {
      title: "Kontrole Językowe",
      description: "Skonfiguruj ton, poziom pewności i ograniczenia pisania.",
      tips: [
        "Ton sokratejski zachęca do krytycznego myślenia",
        "Konserwatywna pewność dodaje zabezpieczenia",
        "Zabronione frazy zapewniają zgodność językową z regulacjami"
      ]
    },
    outcome: {
      title: "Fokus na Wynikach",
      description: "Określ główne punkty końcowe i zasady walidacji statystycznej.",
      tips: [
        "Główny punkt końcowy musi odpowiadać projektowi badania",
        "Cele statystyczne kierują rekomendacjami analizy",
        "Progi sukcesu muszą być klinicznie znaczące"
      ]
    },
    citation: {
      title: "Polityka Cytowania",
      description: "Wymuszaj standardy dowodów i wymagania źródłowe.",
      tips: [
        "Obowiązkowe cytaty zapewniają ścieżkę audytu",
        "Źródła recenzowane przez ekspertów dodają rygoru naukowego",
        "Maksymalna liczba zdań bez cytatu zapobiega spekulacji"
      ]
    },
    validation: {
      title: "Status Walidacji",
      description: "Przejrzyj i rozwiąż błędy walidacji przed zablokowaniem.",
      tips: [
        "Wszystkie krytyczne błędy muszą zostać rozwiązane",
        "Walidacja nazwy wymusza standardy profesjonalne",
        "Blokada tworzy niezmienny zapis audytu"
      ]
    }
  }
};