import { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardV2 } from './components/DashboardV2';
import { PersonaEditor } from './components/PersonaEditor';
import { PersonaLibrary } from './components/PersonaLibrary';
import { ProtocolManager } from './components/ProtocolManager';
import { VariableReviewWorkbench } from './components/VariableReviewWorkbench';
import { AnalysisPlanGenerator } from './components/AnalysisPlanGenerator';
import { AnalysisPlanView } from './components/AnalysisPlanView';
import { Database } from './components/Database';
import { AnalyticsStats } from './components/AnalyticsStats';
import { AcademicWriting } from './components/AcademicWriting';
import { DataImportExport } from './components/DataImportExport';
import { ToastContainer, useToast } from './components/Toast';
import { ProjectProvider, useProject } from './contexts/ProjectContext';
import { AuthProvider } from './contexts/AuthContext';
import { PersonaProvider } from './components/ai-personas';
import { useValidationRules } from './components/ai-personas/core/useValidationRules';
import { queryClient } from './lib/queryClient';
import { config } from './config/environment';
import { migrateToProjectArchitecture } from './utils/projectMigration';
import { migrateProtocolStorage, hasLegacyProtocols } from './utils/protocolStorageMigration';
import { ResearchFactoryApp } from './components/ResearchFactoryApp';
import './lib/i18n/config'; // Initialize i18n

type Screen = 'dashboard' | 'personas' | 'persona-library' | 'protocol-builder' | 'protocol-library' | 'database' | 'variables' | 'analysis-planning' | 'results' | 'academic' | 'analytics' | 'analytics-stats' | 'data-import-export';

function AppContent() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const { toasts, dismissToast } = useToast();
  const { currentProject } = useProject();
  
  // 🆕 Research Factory UI Feature Flag
  const [useResearchFactoryUI, setUseResearchFactoryUI] = useState(true); // Re-enabled after fixing infinite loop

  // 🤖 Initialize AI Persona validation rules
  useValidationRules();

  // Run migrations on app mount
  useEffect(() => {
    try {
      // Run project architecture migration
      migrateToProjectArchitecture();
    } catch (error) {
      console.error('Project migration failed:', error);
    }
  }, []);

  // Run protocol storage migration when project is available
  useEffect(() => {
    if (currentProject && hasLegacyProtocols()) {
      console.log('🔄 Detected legacy protocols, starting migration...');
      try {
        const result = migrateProtocolStorage(currentProject.id);
        if (result.success && result.migrated > 0) {
          console.log(`✅ Migration complete: ${result.migrated} protocols migrated`);
        }
      } catch (error) {
        console.error('❌ Protocol storage migration failed:', error);
      }
    }
  }, [currentProject]);

  const handleNavigate = (screen: string) => {
    setActiveScreen(screen as Screen);
  };

  return (
    <>
      {useResearchFactoryUI ? (
        // 🆕 NEW: Research Factory UI (Golden Grid Layout)
        <ResearchFactoryApp />
      ) : (
        // ✅ EXISTING: Classic UI (Preserved)
        <DashboardLayout activeScreen={activeScreen} onNavigate={handleNavigate}>
          {activeScreen === 'dashboard' && <DashboardV2 onNavigate={handleNavigate} />}
          {activeScreen === 'personas' && <PersonaEditor />}
          {activeScreen === 'persona-library' && <PersonaLibrary />}
          {activeScreen === 'variables' && <VariableReviewWorkbench />}
          {activeScreen === 'analysis-planning' && <AnalysisPlanGenerator />}
          {activeScreen === 'results' && <AnalysisPlanView />}
          {activeScreen === 'protocol-builder' && <ProtocolManager initialView="builder" />}
          {activeScreen === 'protocol-library' && <ProtocolManager initialView="library" />}
          {activeScreen === 'database' && <Database />}
          {activeScreen === 'analytics' && <Database />}
          {activeScreen === 'analytics-stats' && <AnalyticsStats />}
          {activeScreen === 'academic' && <AcademicWriting onNavigate={setActiveScreen} />}
          {activeScreen === 'data-import-export' && <DataImportExport />}

          {/* Toast Container */}
          <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </DashboardLayout>
      )}

      {/* 🆕 Development Feature Flag Toggle */}
      {/* ALWAYS VISIBLE: Research Factory UI Toggle */}
      <button
        onClick={() => setUseResearchFactoryUI(!useResearchFactoryUI)}
        className="fixed bottom-4 right-4 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg z-50 text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
        title="Switch between Classic UI and Research Factory UI"
      >
        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
        UI: {useResearchFactoryUI ? 'Research Factory' : 'Classic'}
      </button>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ProjectProvider>
          <AuthProvider>
            <PersonaProvider>
              <AppContent />
              {config.dev.isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
            </PersonaProvider>
          </AuthProvider>
        </ProjectProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}