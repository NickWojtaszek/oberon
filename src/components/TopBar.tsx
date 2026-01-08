import { Lock, User } from 'lucide-react';
import { useState } from 'react';
import { ProjectSelector } from './ProjectSelector';
import { ProjectCreationModal } from './ProjectCreationModal';

interface TopBarProps {
  activePersona?: {
    name: string;
    status: 'locked' | 'draft';
    version: string;
  };
}

export function TopBar({ activePersona }: TopBarProps) {
  const [showProjectModal, setShowProjectModal] = useState(false);
  
  const defaultPersona = activePersona || {
    name: 'Research Investigator',
    status: 'locked' as const,
    version: 'v1',
  };

  return (
    <>
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
        {/* Left Side - Project Selector */}
        <div className="flex items-center gap-4">
          <ProjectSelector onCreateProject={() => setShowProjectModal(true)} />
        </div>

        {/* Right Side - Persona Profile Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-500">Active Governance Template</div>
            <div className="text-sm text-slate-700 font-medium">
              {defaultPersona.name}
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-green-700" />
              <div>
                <div className="text-sm font-medium text-green-900">
                  {defaultPersona.name}
                </div>
                <div className="text-xs text-green-700">
                  {defaultPersona.status === 'locked' ? 'Locked' : 'Draft'} · {defaultPersona.version}
                </div>
              </div>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-green-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Project Creation Modal */}
      <ProjectCreationModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
      />
    </>
  );
}