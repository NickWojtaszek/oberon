import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export function DashboardLayout({ children, activeScreen, onNavigate }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed Sidebar */}
      <Sidebar activeScreen={activeScreen} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="ml-64">
        {/* Top Bar */}
        <TopBar />

        {/* Content */}
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
