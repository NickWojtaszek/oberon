// EMERGENCY SAFE VERSION - Minimal App to recover from crashes
import { QueryClientProvider } from '@tanstack/react-query';
import { ProjectProvider } from './contexts/ProjectContext';
import { AuthProvider } from './contexts/AuthContext';
import { queryClient } from './lib/queryClient';

function SafeApp() {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">App is Running</h1>
        <p className="text-slate-600 mb-4">
          Safe mode activated. The core React app is functional.
        </p>
        <div className="text-left bg-slate-50 p-4 rounded text-sm">
          <p className="font-medium text-slate-700 mb-2">Recovery Steps:</p>
          <ol className="list-decimal list-inside space-y-1 text-slate-600">
            <li>Check browser console for errors</li>
            <li>Identify which component is crashing</li>
            <li>Fix that specific component</li>
            <li>Switch back to main App.tsx</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProjectProvider>
        <AuthProvider>
          <SafeApp />
        </AuthProvider>
      </ProjectProvider>
    </QueryClientProvider>
  );
}
