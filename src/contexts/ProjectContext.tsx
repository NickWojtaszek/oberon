/**
 * Project Context - Multi-project/study management
 * 
 * Enables users to work on multiple clinical studies in parallel.
 * Each project has isolated protocols, personas, data, and analytics.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Project } from '../types/shared';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { FEATURE_FLAGS } from '../config/featureFlags';
import { StudyType } from '../config/studyMethodology';

interface ProjectContextValue {
  currentProject: Project | null;
  allProjects: Project[];
  isLoading: boolean;
  switchProject: (projectId: string) => void;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'modifiedAt'>) => Project;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  refreshProjects: () => void;
  
  // Phase 3: Methodology Configuration Methods
  configureMethodology: (projectId: string, config: {
    studyType: StudyType;
    teamConfiguration: any;
    hypothesis?: any;
    configuredBy: string;
  }) => void;
  updateBlindingState: (projectId: string, blindingUpdate: Partial<NonNullable<Project['studyMethodology']>['blindingState']>) => void;
  performUnblinding: (projectId: string, params: {
    performedBy: string;
    reason: string;
    digitalSignature: string;
  }) => void;
  getBlindingStatus: () => {
    isBlinded: boolean;
    isUnblinded: boolean;
    protocol: string;
    canUnblind: boolean;
  };
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

// Export for components that need direct context access
export { ProjectContext };

interface ProjectProviderProps {
  children: ReactNode;
}

export function ProjectProvider({ children }: ProjectProviderProps) {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  /**
   * Load all projects from localStorage
   */
  const loadProjects = () => {
    try {
      setIsLoading(true);
      
      // Get all projects
      const projectsJson = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      
      // ✅ FIX: Handle empty/null localStorage
      if (!projectsJson) {
        setAllProjects([]);
        setCurrentProject(null);
        setIsLoading(false);
        return;
      }
      
      // ✅ FIX: Safely parse JSON
      let projects: any[];
      try {
        projects = JSON.parse(projectsJson);
      } catch (parseError) {
        console.error('Failed to parse projects JSON:', parseError);
        // Clear corrupted data
        localStorage.removeItem(STORAGE_KEYS.PROJECTS);
        setAllProjects([]);
        setCurrentProject(null);
        setIsLoading(false);
        return;
      }
      
      // ✅ FIX: Ensure projects is an array
      if (!Array.isArray(projects)) {
        console.error('Projects data is not an array:', projects);
        localStorage.removeItem(STORAGE_KEYS.PROJECTS);
        setAllProjects([]);
        setCurrentProject(null);
        setIsLoading(false);
        return;
      }
      
      // ✅ FIX: Filter out any null/undefined/corrupted projects
      const validProjects = projects.filter(p => {
        try {
          return p && typeof p === 'object' && p.id && p.name;
        } catch (e) {
          return false;
        }
      });
      
      // ✅ FIX: Save cleaned data back if we filtered anything out
      if (validProjects.length !== projects.length) {
        console.warn(`Filtered out ${projects.length - validProjects.length} corrupted projects`);
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(validProjects));
      }
      
      setAllProjects(validProjects);
      
      // Get current project ID
      const currentProjectId = localStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT);
      
      if (currentProjectId) {
        const current = validProjects.find(p => p && p.id === currentProjectId);
        setCurrentProject(current || null);
      } else if (validProjects.length > 0) {
        // Auto-select first project if none selected
        setCurrentProject(validProjects[0]);
        localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, validProjects[0].id);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      setAllProjects([]);
      setCurrentProject(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Switch to a different project
   */
  const switchProject = (projectId: string) => {
    const project = allProjects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, projectId);
    }
  };

  /**
   * Create a new project
   */
  const createProject = (
    projectData: Omit<Project, 'id' | 'createdAt' | 'modifiedAt'>
  ): Project => {
    const now = new Date().toISOString();
    
    // Add default governance metadata if RBAC enabled and not provided
    const governance = FEATURE_FLAGS.ENABLE_RBAC && !projectData.governance
      ? {
          mode: 'solo' as const,
          ownerRole: 'pi' as const,
          ownerId: 'demo-user',
          ownerName: 'Demo User',
        }
      : projectData.governance;
    
    const newProject: Project = {
      ...projectData,
      governance, // Add governance metadata
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      modifiedAt: now,
    };

    // Add to projects list
    const updatedProjects = [...allProjects, newProject];
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updatedProjects));
    setAllProjects(updatedProjects);

    // Auto-switch to new project
    setCurrentProject(newProject);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, newProject.id);

    return newProject;
  };

  /**
   * Update an existing project
   */
  const updateProject = (projectId: string, updates: Partial<Project>) => {
    const updatedProjects = allProjects.map(project => {
      // ✅ FIX: Guard against null projects
      if (!project || !project.id) return project;
      
      if (project.id === projectId) {
        const updated = {
          ...project,
          ...updates,
          modifiedAt: new Date().toISOString(),
        };
        
        // Update current project if it's the one being updated
        if (currentProject?.id === projectId) {
          setCurrentProject(updated);
        }
        
        return updated;
      }
      return project;
    });

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updatedProjects));
    setAllProjects(updatedProjects);
  };

  /**
   * Delete a project and all its data
   * WARNING: This is destructive and cannot be undone
   */
  const deleteProject = (projectId: string) => {
    // ✅ FIX: Filter out null projects and remove the target project
    const updatedProjects = allProjects.filter(p => p && p.id && p.id !== projectId);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updatedProjects));
    setAllProjects(updatedProjects);

    // Delete project data
    const resources = ['protocols', 'personas', 'clinicalData', 'templates'];
    resources.forEach(resource => {
      const key = STORAGE_KEYS.getProjectKey(projectId, resource);
      localStorage.removeItem(key);
    });

    // If deleting current project, switch to another
    if (currentProject?.id === projectId) {
      if (updatedProjects.length > 0) {
        switchProject(updatedProjects[0].id);
      } else {
        setCurrentProject(null);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_PROJECT);
      }
    }
  };

  /**
   * Refresh projects from storage
   */
  const refreshProjects = () => {
    loadProjects();
  };

  // Phase 3: Methodology Configuration Methods
  const configureMethodology = (projectId: string, config: {
    studyType: StudyType;
    teamConfiguration: any;
    hypothesis?: any;
    configuredBy: string;
  }) => {
    const updatedProjects = allProjects.map(project => {
      if (project.id === projectId) {
        const updated = {
          ...project,
          studyMethodology: {
            ...project.studyMethodology,
            studyType: config.studyType,
            teamConfiguration: config.teamConfiguration,
            hypothesis: config.hypothesis,
            configuredBy: config.configuredBy,
          },
          modifiedAt: new Date().toISOString(),
        };
        
        // Update current project if it's the one being updated
        if (currentProject?.id === projectId) {
          setCurrentProject(updated);
        }
        
        return updated;
      }
      return project;
    });

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updatedProjects));
    setAllProjects(updatedProjects);
  };

  const updateBlindingState = (projectId: string, blindingUpdate: Partial<NonNullable<Project['studyMethodology']>['blindingState']>) => {
    const updatedProjects = allProjects.map(project => {
      if (project.id === projectId) {
        const updated = {
          ...project,
          studyMethodology: {
            ...project.studyMethodology,
            blindingState: {
              ...project.studyMethodology?.blindingState,
              ...blindingUpdate,
            },
          },
          modifiedAt: new Date().toISOString(),
        };
        
        // Update current project if it's the one being updated
        if (currentProject?.id === projectId) {
          setCurrentProject(updated);
        }
        
        return updated;
      }
      return project;
    });

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updatedProjects));
    setAllProjects(updatedProjects);
  };

  const performUnblinding = (projectId: string, params: {
    performedBy: string;
    reason: string;
    digitalSignature: string;
  }) => {
    const updatedProjects = allProjects.map(project => {
      if (project.id === projectId) {
        const updated = {
          ...project,
          studyMethodology: {
            ...project.studyMethodology,
            blindingState: {
              ...project.studyMethodology?.blindingState,
              isBlinded: false,
              isUnblinded: true,
              unblindingDetails: {
                performedBy: params.performedBy,
                reason: params.reason,
                digitalSignature: params.digitalSignature,
                timestamp: new Date().toISOString(),
              },
            },
          },
          modifiedAt: new Date().toISOString(),
        };
        
        // Update current project if it's the one being updated
        if (currentProject?.id === projectId) {
          setCurrentProject(updated);
        }
        
        return updated;
      }
      return project;
    });

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updatedProjects));
    setAllProjects(updatedProjects);
  };

  const getBlindingStatus = () => {
    if (!currentProject?.studyMethodology?.blindingState) {
      return {
        isBlinded: false,
        isUnblinded: false,
        protocol: '',
        canUnblind: false,
      };
    }

    const blindingState = currentProject.studyMethodology.blindingState;
    return {
      isBlinded: blindingState.isBlinded,
      isUnblinded: blindingState.isUnblinded,
      protocol: blindingState.protocol || '',
      canUnblind: blindingState.canUnblind,
    };
  };

  const value: ProjectContextValue = {
    currentProject,
    allProjects,
    isLoading,
    switchProject,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects,
    
    // Phase 3: Methodology Configuration Methods
    configureMethodology,
    updateBlindingState,
    performUnblinding,
    getBlindingStatus,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

/**
 * Hook to access project context
 * Must be used within ProjectProvider
 */
export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
}