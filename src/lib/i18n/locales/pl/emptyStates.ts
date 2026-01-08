/**
 * Empty States Translation - Polish
 * Centralized translations for all empty state screens
 */

export default {
  // === COMMON PRESETS ===
  
  // No Project Selected
  noProjectSelected: {
    title: "Nie wybrano projektu",
    description: "Wybierz projekt z biblioteki, aby wyświetlić jego szczegóły i zarządzać danymi badawczymi.",
    action: "Przejdź do biblioteki projektów"
  },
  
  // No Protocols
  noProtocols: {
    title: "Brak protokołów",
    description: "Utwórz swój pierwszy protokół, aby zdefiniować zmienne badania, punkty końcowe i przepływy pracy zbierania danych.",
    action: "Utwórz nowy protokół"
  },
  
  // No Projects
  noProjects: {
    title: "Brak projektów",
    description: "Utwórz swój pierwszy projekt, aby rozpocząć organizację badań klinicznych i danych prób.",
    action: "Utwórz nowy projekt"
  },
  
  // No Data
  noData: {
    title: "Brak dostępnych danych",
    description: "Rozpocznij zbieranie danych, konfigurując schemat bazy danych i importując rekordy.",
    action: "Skonfiguruj bazę danych"
  },
  
  // No Manuscripts
  noManuscripts: {
    title: "Brak manuskryptów",
    description: "Utwórz swój pierwszy manuskrypt, aby rozpocząć pisanie i formatowanie artykułu naukowego.",
    action: "Utwórz nowy manuskrypt"
  },
  
  // No Analytics
  noAnalytics: {
    title: "Brak dostępnych analiz",
    description: "Uruchom swoją pierwszą analizę po zebraniu danych i zdefiniowaniu punktów końcowych statystycznych.",
    action: "Przejdź do bazy danych"
  },
  
  // No IRB Submissions
  noIRBSubmissions: {
    title: "Brak zgłoszeń do komisji bioetycznej",
    description: "Prześlij swój protokół do przeglądu etycznego i śledź proces zatwierdzania.",
    action: "Nowe zgłoszenie"
  },
  
  // No Team Members
  noTeamMembers: {
    title: "Brak członków zespołu",
    description: "Zaproś współpracowników do dołączenia do projektu badawczego i zarządzaj rolami zespołu.",
    action: "Zaproś członka zespołu"
  },
  
  // No AI Personas
  noPersonas: {
    title: "Brak aktywnych person AI",
    description: "Aktywuj persony AI, aby uzyskać inteligentną pomoc w walidacji protokołu i zgodności.",
    action: "Przeglądaj bibliotekę person"
  },
  
  // === SEARCH & FILTER STATES ===
  
  noSearchResults: {
    title: "Nie znaleziono wyników",
    description: "Spróbuj dostosować wyszukiwane hasła lub filtry, aby znaleźć to, czego szukasz.",
    action: null
  },
  
  noFilterResults: {
    title: "Brak pasujących elementów",
    description: "Żadne elementy nie pasują do bieżących kryteriów filtrowania. Spróbuj wyczyścić niektóre filtry.",
    action: "Wyczyść filtry"
  },
  
  // === LOADING & ERROR STATES ===
  
  loading: {
    title: "Ładowanie...",
    description: "Poczekaj, aż pobierzemy Twoje dane.",
    action: null
  },
  
  error: {
    title: "Coś poszło nie tak",
    description: "Napotkaliśmy błąd podczas ładowania tych danych. Spróbuj odświeżyć stronę.",
    action: "Odśwież stronę"
  },
  
  offline: {
    title: "Jesteś offline",
    description: "Niektóre funkcje są niedostępne w trybie offline. Połącz się z internetem, aby zsynchronizować dane.",
    action: "Ponów połączenie"
  },
  
  // === PERMISSION STATES ===
  
  noPermission: {
    title: "Dostęp ograniczony",
    description: "Nie masz uprawnień do wyświetlania tej treści. Skontaktuj się z administratorem w sprawie dostępu.",
    action: null
  },
  
  readOnlyMode: {
    title: "Tryb tylko do odczytu",
    description: "Możesz wyświetlać tę treść, ale nie możesz wprowadzać zmian przy bieżących uprawnieniach.",
    action: null
  },
  
  // === COMPLETION STATES ===
  
  allComplete: {
    title: "Wszystko gotowe!",
    description: "Ukończyłeś wszystkie elementy w tej sekcji. Świetna robota!",
    action: null
  },
  
  emptyInbox: {
    title: "Skrzynka pusta!",
    description: "Jesteś na bieżąco. Brak oczekujących powiadomień lub zadań.",
    action: null
  },
  
  // === WORKFLOW-SPECIFIC STATES ===
  
  protocolWorkbench: {
    title: "Wybierz protokół",
    description: "Wybierz protokół z biblioteki, aby rozpocząć edycję lub utwórz nowy.",
    action: "Przejdź do biblioteki protokołów"
  },
  
  academicWriting: {
    title: "Nie wybrano manuskryptu",
    description: "Wybierz manuskrypt z biblioteki lub utwórz nowy, aby rozpocząć pisanie.",
    action: "Przejdź do pisania akademickiego"
  },
  
  ethicsBoard: {
    title: "Nie wybrano zgłoszenia",
    description: "Wybierz zgłoszenie do komisji bioetycznej, aby wyświetlić szczegóły i śledzić status zatwierdzenia.",
    action: "Przejdź do komisji bioetycznej"
  },
  
  database: {
    title: "Nie zdefiniowano schematu",
    description: "Najpierw zdefiniuj schemat bazy danych przed wprowadzaniem lub przeglądaniem danych.",
    action: "Przejdź do konstruktora schematów"
  },
  
  analytics: {
    title: "Nie wybrano analizy",
    description: "Wybierz projekt i zestaw danych, aby rozpocząć analizę statystyczną.",
    action: "Wybierz projekt"
  }
};
