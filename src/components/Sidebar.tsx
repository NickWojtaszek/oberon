import { Home, Shield, FileText, BookOpen, Circle, Users, FolderOpen, Database, TrendingUp, FileJson } from 'lucide-react';

interface SidebarProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export function Sidebar({ activeScreen, onNavigate }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'personas', label: 'Governance', sublabel: 'Personas', icon: Shield },
    { id: 'persona-library', label: 'AI Personas', sublabel: 'Library', icon: Users },
    { id: 'protocol-builder', label: 'Protocol Builder', icon: FileText },
    { id: 'protocol-library', label: 'Protocol Library', icon: FolderOpen },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'analytics-stats', label: 'Analytics & Statistics', icon: TrendingUp },
    { id: 'academic', label: 'Academic Writing', icon: BookOpen },
    { id: 'data-import-export', label: 'Data Import/Export', sublabel: 'Testing Tools', icon: FileJson },
  ];

  return (
    <div className="w-64 bg-slate-950 text-white flex flex-col h-screen fixed left-0 top-0">
      {/* Logo/Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="text-lg font-semibold">Clinical Intelligence</div>
        <div className="text-xs text-slate-400 mt-1">Research Platform</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{item.label}</div>
                {item.sublabel && (
                  <div className="text-xs text-slate-500">{item.sublabel}</div>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="px-4 py-3 bg-slate-900 rounded-lg">
          <div className="text-xs text-slate-400 mb-2">System Status</div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Circle className="w-2 h-2 fill-green-500 text-green-500" />
              <Circle className="w-2 h-2 fill-green-500 text-green-500 absolute top-0 left-0 animate-ping opacity-75" />
            </div>
            <span className="text-sm text-green-400 font-medium">Online</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">All services operational</div>
        </div>
      </div>
    </div>
  );
}