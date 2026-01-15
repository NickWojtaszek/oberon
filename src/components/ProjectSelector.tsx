import { useState } from 'react';
import { ChevronDown, Plus, FolderOpen, Search } from 'lucide-react';
import { useProject } from '../contexts/ProtocolContext';

interface ProjectSelectorProps {
  onCreateProject: () => void;
}

export function ProjectSelector({ onCreateProject }: ProjectSelectorProps) {
  const { currentProject, allProjects, switchProject } = useProject();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = allProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.studyNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectProject = (projectId: string) => {
    switchProject(projectId);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      {/* Selected Project Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors min-w-[280px]"
      >
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <FolderOpen className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1 text-left min-w-0">
          {currentProject ? (
            <>
              <div className="text-sm font-medium text-slate-900 truncate">
                {currentProject.name}
              </div>
              <div className="text-xs text-slate-500 truncate">
                {currentProject.studyNumber}
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-500">No project selected</div>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-[400px] flex flex-col">
            {/* Search */}
            {allProjects.length > 3 && (
              <div className="p-3 border-b border-slate-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            {/* Project List */}
            <div className="flex-1 overflow-y-auto">
              {filteredProjects.length > 0 ? (
                <div className="p-2">
                  {filteredProjects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleSelectProject(project.id)}
                      className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                        currentProject?.id === project.id
                          ? 'bg-blue-50 text-blue-900'
                          : 'hover:bg-slate-50 text-slate-900'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          currentProject?.id === project.id
                            ? 'bg-blue-100'
                            : 'bg-slate-100'
                        }`}
                      >
                        <FolderOpen
                          className={`w-4 h-4 ${
                            currentProject?.id === project.id
                              ? 'text-blue-600'
                              : 'text-slate-600'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium mb-0.5 truncate">
                          {project.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {project.studyNumber}
                          {project.phase && ` • ${project.phase}`}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                              project.status === 'active'
                                ? 'bg-green-50 text-green-700'
                                : project.status === 'paused'
                                ? 'bg-yellow-50 text-yellow-700'
                                : project.status === 'completed'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-slate-500">
                  No projects found
                </div>
              )}
            </div>

            {/* Create New Button */}
            <div className="p-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onCreateProject();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Create New Project</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
