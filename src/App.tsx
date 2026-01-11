import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer, useToast } from './components/Toast';
import { ProtocolProvider } from './contexts/ProtocolContext';
import { AuthProvider } from './contexts/AuthContext';
import { PersonaProvider } from './components/ai-personas';
import { useValidationRules } from './components/ai-personas/core/useValidationRules';
import { queryClient } from './lib/queryClient';
import { config } from './config/environment';
import { runMigrationIfNeeded } from './utils/projectMigrationToProtocol';
import { ResearchFactoryApp } from './components/ResearchFactoryApp';
import './lib/i18n/config'; // Initialize i18n

// Classic UI has been deprecated - Research Factory is the only UI
// See: ResearchFactoryApp.tsx for the main application

function AppContent() {
  const { toasts, dismissToast } = useToast();

  // Initialize AI Persona validation rules
  useValidationRules();

  // Run migrations on app mount
  useEffect(() => {
    try {
      // Run project → protocol migration if needed
      const migrationResult = runMigrationIfNeeded();
      if (migrationResult) {
        console.log('[App] Migration result:', migrationResult);
      }
    } catch (error) {
      console.error('[App] Migration failed:', error);
    }
  }, []);

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
        <ProtocolProvider>
          <AuthProvider>
            <PersonaProvider>
              <AppContent />
              {config.dev.isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
            </PersonaProvider>
          </AuthProvider>
        </ProtocolProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}