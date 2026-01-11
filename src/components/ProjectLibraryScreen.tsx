import { useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import { Plus, Search, FolderOpen, ArrowRight } from 'lucide-react';
import { useProject } from '../contexts/ProtocolContext';
import { ProjectCreationModal } from './ProjectCreationModal';
import { useTranslation } from 'react-i18next';
import { EmptyState } from './ui/EmptyState';

interface ProjectLibraryScreenProps {
  onNavigateToProject?: (projectId: string) => void;
}

export interface ProjectLibraryScreenRef {
  openCreateModal: () => void;
}

export const ProjectLibraryScreen = forwardRef<ProjectLibraryScreenRef, ProjectLibraryScreenProps>(
  ({ onNavigateToProject }, ref) => {
  const { currentProject, allProjects, switchProject } = useProject();
  const { t } = useTranslation('projectLibrary');

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Expose method to parent via ref
  useImperativeHandle(ref, () => ({
    openCreateModal: () => setShowCreateModal(true)
  }));

  // Show all projects, sorted by modified date
  const filteredProjects = useMemo(() => {
    const sorted = [...allProjects];
    sorted.sort((a, b) => {
      return new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime();
    });
    return sorted;
  }, [allProjects]);

  const handleProjectClick = (projectId: string) => {
    switchProject(projectId);
    if (onNavigateToProject) {
      onNavigateToProject(projectId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Project List - with scrolling */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1600px] mx-auto">
          {filteredProjects.length === 0 ? (
            <div className="flex items-center justify-center min-h-[calc(100vh-250px)]">
              <EmptyState
                icon={FolderOpen}
                title={t('emptyState.noProjects')}
                description={t('emptyState.noProjectsDescription')}
                action={{
                  label: t('emptyState.createButton'),
                  onClick: () => setShowCreateModal(true),
                  icon: Plus
                }}
                size="md"
              />
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isActive={currentProject?.id === project.id}
                  onClick={() => handleProjectClick(project.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Project Creation Modal */}
      <ProjectCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
});

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    studyNumber?: string;
    description?: string;
    status: 'active' | 'paused' | 'completed' | 'archived';
    phase?: string;
    studyDesign?: { type: string };
    modifiedAt: string;
  };
  isActive: boolean;
  onClick: () => void;
}

function ProjectCard({ project, isActive, onClick }: ProjectCardProps) {
  const { t } = useTranslation('projectLibrary');
  
  const getStatusConfig = () => {
    switch (project.status) {
      case 'active':
        return { bg: 'bg-green-50', text: 'text-green-700', badge: t('card.statusActive') };
      case 'paused':
        return { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: t('card.statusPaused') };
      case 'completed':
        return { bg: 'bg-blue-50', text: 'text-blue-700', badge: t('card.statusCompleted') };
      case 'archived':
        return { bg: 'bg-gray-50', text: 'text-gray-700', badge: t('card.statusArchived') };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700', badge: t('card.statusUnknown') };
    }
  };

  const statusConfig = getStatusConfig();
  const modifiedDate = new Date(project.modifiedAt).toLocaleDateString();

  return (
    <div
      className={`bg-white border ${
        isActive ? 'border-blue-300 ring-2 ring-blue-100' : 'border-slate-200'
      } rounded-xl p-6 hover:shadow-md transition-all cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-6">
        {/* Left: Icon and Content */}
        <div className="flex items-start gap-4 flex-1">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-xl ${isActive ? 'bg-blue-100' : 'bg-slate-100'} flex items-center justify-center`}>
              <FolderOpen className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start gap-3 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-medium text-slate-900">{project.name}</h3>
                  {isActive && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded">
                      {t('card.current')}
                    </span>
                  )}
                </div>
                {project.description && (
                  <p className="text-sm text-slate-600 line-clamp-2">{project.description}</p>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.studyNumber && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                  {t('card.studyPrefix')}{project.studyNumber}
                </span>
              )}
              {project.phase && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
                  {project.phase}
                </span>
              )}
              {project.studyDesign?.type && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
                  {project.studyDesign.type.toUpperCase()}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs">
                {t('card.modified')} {modifiedDate}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
              >
                {t('card.openProject')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Status Badge */}
        <div className={`px-4 py-2 ${statusConfig.bg} ${statusConfig.text} rounded-lg text-sm font-medium`}>
          {statusConfig.badge}
        </div>
      </div>
    </div>
  );
}