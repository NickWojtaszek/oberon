import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer, useToast } from './components/Toast';
import { ProjectProvider, useProject } from './contexts/ProjectContext';
import { AuthProvider } from './contexts/AuthContext';
import { PersonaProvider } from './components/ai-personas';
import { useValidationRules } from './components/ai-personas/core/useValidationRules';
import { queryClient } from './lib/queryClient';
import { migrateToProjectArchitecture } from './utils/projectMigration';
import { migrateProtocolStorage, hasLegacyProtocols } from './utils/protocolStorageMigration';
import { ResearchFactoryApp } from './components/ResearchFactoryApp';
import './lib/i18n/config'; // Initialize i18n

// Classic UI has been deprecated - Research Factory is the only UI
// See: ResearchFactoryApp.tsx for the main application

function AppContent() {
  const { toasts, dismissToast } = useToast();
  const { currentProject } = useProject();

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

  return (
    <>
      {/* Research Factory UI - The Oberon Platform */}
      <ResearchFactoryApp />
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
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