/**
 * Protocol Context - Protocol-centric state management
 *
 * REPLACES ProjectContext. Protocol is now the top-level entity.
 * Each protocol has versions (drafts, published) and associated data.
 *
 * Hierarchy: Protocol → Versions → Data/Manuscripts
 */

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { STORAGE_KEYS } from '../utils/storageKeys';
import type { SavedProtocol, ProtocolVersion, SchemaBlock } from '../components/protocol-workbench/types';

// Study methodology types (moved from Project)
export interface StudyMethodology {
  studyType?: 'rct' | 'observational' | 'cohort' | 'case-control' | 'registry' | 'other';
  teamConfiguration?: {
    roles: Array<{
      roleId: string;
      userId: string;
      userName: string;
    }>;
  };
  hypothesis?: {
    null: string;
    alternative: string;
    picoFramework?: {
      population?: string;
      intervention?: string;
      comparison?: string;
      outcome?: string;
      timeframe?: string;
    };
  };
  blindingState?: {
    isBlinded: boolean;
    isUnblinded: boolean;
    protocol: string;
    canUnblind: boolean;
    unblindingDetails?: {
      performedBy: string;
      reason: string;
      digitalSignature: string;
      timestamp: string;
    };
  };
  configuredBy?: string;
  foundationalPapers?: Array<{
    id: string;
    title: string;
    authors: string;
    year: number;
    doi?: string;
  }>;
}

// Governance types (moved from Project)
export interface Governance {
  mode: 'solo' | 'team';
  ownerRole: 'pi' | 'statistician' | 'coordinator' | 'sponsor';
  ownerId: string;
  ownerName: string;
}

// Extended SavedProtocol with methodology (formerly on Project)
export interface ProtocolWithMethodology extends SavedProtocol {
  studyMethodology?: StudyMethodology;
  governance?: Governance;
  description?: string;
  status?: 'active' | 'paused' | 'completed' | 'archived';
}

interface ProtocolContextValue {
  // Current state
  currentProtocol: ProtocolWithMethodology | null;
  currentVersion: ProtocolVersion | null;
  allProtocols: ProtocolWithMethodology[];
  isLoading: boolean;

  // Protocol operations
  loadProtocol: (protocolId: string, versionId?: string) => ProtocolVersion | null;
  createProtocol: (data: {
    protocolTitle: string;
    protocolNumber: string;
    description?: string;
  }) => ProtocolWithMethodology;
  saveProtocol: (
    protocolId: string,
    metadata: ProtocolVersion['metadata'],
    schemaBlocks: SchemaBlock[],
    protocolContent: ProtocolVersion['protocolContent'],
    status?: 'draft' | 'published'
  ) => void;
  saveSchemaBlocks: (protocolId: string, schemaBlocks: SchemaBlock[]) => void;
  updateProtocol: (protocolId: string, updates: Partial<ProtocolWithMethodology>) => void;
  deleteProtocol: (protocolId: string) => void;
  refreshProtocols: () => void;

  // Version operations
  setCurrentVersion: (versionId: string) => void;
  createNewVersion: (protocolId: string, baseVersionId?: string) => ProtocolVersion;

  // Methodology configuration (moved from Project)
  configureMethodology: (protocolId: string, config: {
    studyType: StudyMethodology['studyType'];
    teamConfiguration?: StudyMethodology['teamConfiguration'];
    hypothesis?: StudyMethodology['hypothesis'];
    configuredBy: string;
  }) => void;
  updateBlindingState: (protocolId: string, blindingUpdate: Partial<NonNullable<StudyMethodology['blindingState']>>) => void;
  performUnblinding: (protocolId: string, params: {
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

const ProtocolContext = createContext<ProtocolContextValue | null>(null);

// Export for components that need direct context access
export { ProtocolContext };

interface ProtocolProviderProps {
  children: ReactNode;
}

export function ProtocolProvider({ children }: ProtocolProviderProps) {
  const [currentProtocol, setCurrentProtocol] = useState<ProtocolWithMethodology | null>(null);
  const [currentVersion, setCurrentVersion] = useState<ProtocolVersion | null>(null);
  const [allProtocols, setAllProtocols] = useState<ProtocolWithMethodology[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ref to always have access to latest protocols (fixes stale closure issues)
  const allProtocolsRef = useRef<ProtocolWithMethodology[]>([]);

  // Keep ref in sync with state
  useEffect(() => {
    allProtocolsRef.current = allProtocols;
  }, [allProtocols]);

  // Load protocols on mount
  useEffect(() => {
    loadProtocolsFromStorage();
  }, []);

  /**
   * Load all protocols from localStorage
   */
  const loadProtocolsFromStorage = useCallback(() => {
    try {
      setIsLoading(true);

      // Get all protocols from global storage
      const protocolsJson = localStorage.getItem(STORAGE_KEYS.PROTOCOLS);

      if (!protocolsJson) {
        console.log('[ProtocolContext] No protocols found in storage');
        setAllProtocols([]);
        setCurrentProtocol(null);
        setCurrentVersion(null);
        setIsLoading(false);
        return;
      }

      let protocols: ProtocolWithMethodology[];
      try {
        protocols = JSON.parse(protocolsJson);
      } catch (parseError) {
        console.error('[ProtocolContext] Failed to parse protocols JSON:', parseError);
        localStorage.removeItem(STORAGE_KEYS.PROTOCOLS);
        setAllProtocols([]);
        setCurrentProtocol(null);
        setCurrentVersion(null);
        setIsLoading(false);
        return;
      }

      if (!Array.isArray(protocols)) {
        console.error('[ProtocolContext] Protocols data is not an array:', protocols);
        localStorage.removeItem(STORAGE_KEYS.PROTOCOLS);
        setAllProtocols([]);
        setCurrentProtocol(null);
        setCurrentVersion(null);
        setIsLoading(false);
        return;
      }

      // Filter out corrupted protocols
      const validProtocols = protocols.filter(p => {
        try {
          return p && typeof p === 'object' && p.id;
        } catch (e) {
          return false;
        }
      });

      if (validProtocols.length !== protocols.length) {
        console.warn(`[ProtocolContext] Filtered out ${protocols.length - validProtocols.length} corrupted protocols`);
        localStorage.setItem(STORAGE_KEYS.PROTOCOLS, JSON.stringify(validProtocols));
      }

      console.log(`[ProtocolContext] Loaded ${validProtocols.length} protocols`);
      setAllProtocols(validProtocols);

      // Restore current protocol if one was selected
      const currentProtocolId = localStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT); // Reuse this key for protocol

      if (currentProtocolId) {
        const current = validProtocols.find(p => p.id === currentProtocolId);
        if (current) {
          setCurrentProtocol(current);
          // Auto-load latest draft version
          const latestDraft = current.versions?.find(v => v.status === 'draft');
          const latestVersion = latestDraft || current.versions?.[current.versions.length - 1];
          if (latestVersion) {
            setCurrentVersion(latestVersion);
          }
        }
      }
    } catch (error) {
      console.error('[ProtocolContext] Error loading protocols:', error);
      setAllProtocols([]);
      setCurrentProtocol(null);
      setCurrentVersion(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Save protocols to storage
   */
  const saveProtocolsToStorage = useCallback((protocols: ProtocolWithMethodology[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROTOCOLS, JSON.stringify(protocols));
    } catch (error) {
      console.error('[ProtocolContext] Failed to save protocols:', error);
    }
  }, []);

  /**
   * Load a specific protocol and version
   */
  const loadProtocol = useCallback((protocolId: string, versionId?: string): ProtocolVersion | null => {
    console.log('[ProtocolContext] Loading protocol:', { protocolId, versionId });

    const protocol = allProtocols.find(p => p.id === protocolId);
    if (!protocol) {
      console.error('[ProtocolContext] Protocol not found:', protocolId);
      return null;
    }

    setCurrentProtocol(protocol);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, protocolId); // Reuse key

    // Find the requested version, or latest draft, or latest version
    let version: ProtocolVersion | undefined;
    if (versionId) {
      version = protocol.versions?.find(v => v.id === versionId);
    }
    if (!version) {
      version = protocol.versions?.find(v => v.status === 'draft');
    }
    if (!version && protocol.versions?.length > 0) {
      version = protocol.versions[protocol.versions.length - 1];
    }

    if (version) {
      setCurrentVersion(version);
      console.log('[ProtocolContext] Loaded version:', version.id);
      return version;
    }

    return null;
  }, [allProtocols]);

  /**
   * Create a new protocol
   */
  const createProtocol = useCallback((data: {
    protocolTitle: string;
    protocolNumber: string;
    description?: string;
  }): ProtocolWithMethodology => {
    const now = new Date();
    const protocolId = `PROTO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const versionId = `v-${Date.now()}`;

    const initialVersion: ProtocolVersion = {
      id: versionId,
      versionNumber: 'Draft 1.0',
      status: 'draft',
      createdAt: now,
      modifiedAt: now,
      createdBy: 'Current User',
      modifiedBy: 'Current User',
      metadata: {
        protocolTitle: data.protocolTitle,
        protocolNumber: data.protocolNumber,
        principalInvestigator: '',
        sponsor: '',
        studyPhase: '',
        therapeuticArea: '',
        estimatedEnrollment: '',
        studyDuration: '',
      },
      schemaBlocks: [],
      protocolContent: {
        primaryObjective: '',
        secondaryObjectives: '',
        inclusionCriteria: '',
        exclusionCriteria: '',
        statisticalPlan: '',
      },
      changeLog: 'Initial draft',
    };

    const newProtocol: ProtocolWithMethodology = {
      id: protocolId,
      protocolNumber: data.protocolNumber,
      protocolTitle: data.protocolTitle,
      description: data.description,
      currentVersion: initialVersion.versionNumber,
      latestDraftVersion: initialVersion.versionNumber,
      versions: [initialVersion],
      createdAt: now,
      modifiedAt: now,
      governance: {
        mode: 'solo',
        ownerRole: 'pi',
        ownerId: 'demo-user',
        ownerName: 'Demo User',
      },
    };

    const updatedProtocols = [...allProtocols, newProtocol];

    // CRITICAL: Update ref IMMEDIATELY so subsequent updateProtocol calls see the new protocol
    allProtocolsRef.current = updatedProtocols;

    setAllProtocols(updatedProtocols);
    saveProtocolsToStorage(updatedProtocols);

    // Auto-select new protocol
    setCurrentProtocol(newProtocol);
    setCurrentVersion(initialVersion);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, protocolId);

    console.log('[ProtocolContext] Created new protocol:', protocolId);
    console.log('[ProtocolContext] Ref now has', allProtocolsRef.current.length, 'protocols');
    return newProtocol;
  }, [allProtocols, saveProtocolsToStorage]);

  /**
   * Save protocol changes
   */
  const saveProtocol = useCallback((
    protocolId: string,
    metadata: ProtocolVersion['metadata'],
    schemaBlocks: SchemaBlock[],
    protocolContent: ProtocolVersion['protocolContent'],
    status: 'draft' | 'published' = 'draft'
  ) => {
    console.log('[ProtocolContext] Saving protocol:', protocolId);

    const updatedProtocols = allProtocols.map(protocol => {
      if (protocol.id !== protocolId) return protocol;

      const now = new Date();

      // Find existing draft to update, or create new version
      const existingDraftIndex = protocol.versions?.findIndex(
        v => v.status === 'draft' && v.versionNumber.startsWith('Draft')
      ) ?? -1;

      const newVersion: ProtocolVersion = {
        id: existingDraftIndex >= 0 ? protocol.versions[existingDraftIndex].id : `v-${Date.now()}`,
        versionNumber: status === 'draft'
          ? `Draft ${new Date().toLocaleDateString()}`
          : `v${(protocol.versions?.length || 0) + 1}.0`,
        status,
        createdAt: existingDraftIndex >= 0 ? protocol.versions[existingDraftIndex].createdAt : now,
        modifiedAt: now,
        createdBy: existingDraftIndex >= 0 ? protocol.versions[existingDraftIndex].createdBy : 'Current User',
        modifiedBy: 'Current User',
        metadata,
        schemaBlocks,
        protocolContent,
        changeLog: status === 'draft' ? 'Draft version' : 'Published version',
      };

      let updatedVersions: ProtocolVersion[];
      if (status === 'draft' && existingDraftIndex >= 0) {
        // Update existing draft
        updatedVersions = [...protocol.versions];
        updatedVersions[existingDraftIndex] = newVersion;
      } else {
        // Add new version
        updatedVersions = [...(protocol.versions || []), newVersion];
      }

      const updatedProtocol: ProtocolWithMethodology = {
        ...protocol,
        protocolTitle: metadata.protocolTitle,
        protocolNumber: metadata.protocolNumber,
        currentVersion: newVersion.versionNumber,
        latestDraftVersion: status === 'draft' ? newVersion.versionNumber : protocol.latestDraftVersion,
        versions: updatedVersions,
        modifiedAt: now,
      };

      // Update current states if this is the current protocol
      if (currentProtocol?.id === protocolId) {
        setCurrentProtocol(updatedProtocol);
        setCurrentVersion(newVersion);
      }

      return updatedProtocol;
    });

    setAllProtocols(updatedProtocols);
    saveProtocolsToStorage(updatedProtocols);
    console.log('[ProtocolContext] Protocol saved successfully');
  }, [allProtocols, currentProtocol, saveProtocolsToStorage]);

  /**
   * Update protocol metadata (not version content)
   * Uses DEEP MERGE for studyMethodology to prevent data loss
   * Uses allProtocolsRef to avoid stale closure issues when called right after createProtocol
   */
  const updateProtocol = useCallback((protocolId: string, updates: Partial<ProtocolWithMethodology>) => {
    console.log('[ProtocolContext] updateProtocol called:', { protocolId, updates });

    // Use ref to get latest protocols (fixes stale closure when called right after createProtocol)
    const currentProtocols = allProtocolsRef.current;
    console.log('[ProtocolContext] Current protocols from ref:', currentProtocols.length, currentProtocols.map(p => p.id));

    const updatedProtocols = currentProtocols.map(protocol => {
      if (protocol.id !== protocolId) return protocol;

      // Deep merge studyMethodology to preserve nested fields like PICO
      const mergedStudyMethodology = updates.studyMethodology ? {
        ...protocol.studyMethodology,
        ...updates.studyMethodology,
        // Deep merge hypothesis to preserve picoFramework (if hypothesis is an object)
        ...(updates.studyMethodology.hypothesis && typeof updates.studyMethodology.hypothesis === 'object' && {
          hypothesis: {
            ...protocol.studyMethodology?.hypothesis,
            ...updates.studyMethodology.hypothesis,
            // Deep merge picoFramework
            ...(updates.studyMethodology.hypothesis.picoFramework && {
              picoFramework: {
                ...protocol.studyMethodology?.hypothesis?.picoFramework,
                ...updates.studyMethodology.hypothesis.picoFramework,
              }
            }),
          }
        }),
        // Preserve picoFields from Clinical Capture Wizard
        ...(updates.studyMethodology.picoFields && {
          picoFields: {
            ...protocol.studyMethodology?.picoFields,
            ...updates.studyMethodology.picoFields,
          }
        }),
        // Preserve foundationalPapers
        ...(updates.studyMethodology.foundationalPapers && {
          foundationalPapers: updates.studyMethodology.foundationalPapers,
        }),
        // Deep merge teamConfiguration
        ...(updates.studyMethodology.teamConfiguration && {
          teamConfiguration: {
            ...protocol.studyMethodology?.teamConfiguration,
            ...updates.studyMethodology.teamConfiguration,
          }
        }),
        // Deep merge blindingState
        ...(updates.studyMethodology.blindingState && {
          blindingState: {
            ...protocol.studyMethodology?.blindingState,
            ...updates.studyMethodology.blindingState,
          }
        }),
        // Deep merge workflowState
        ...(updates.studyMethodology.workflowState && {
          workflowState: {
            ...protocol.studyMethodology?.workflowState,
            ...updates.studyMethodology.workflowState,
          }
        }),
      } : protocol.studyMethodology;

      const updated = {
        ...protocol,
        ...updates,
        studyMethodology: mergedStudyMethodology,
        modifiedAt: new Date(),
      };

      console.log('[ProtocolContext] Merged studyMethodology:', mergedStudyMethodology);
      console.log('[ProtocolContext] PICO after merge:', {
        picoFields: mergedStudyMethodology?.picoFields,
        picoFramework: mergedStudyMethodology?.hypothesis?.picoFramework,
        hypothesis: typeof mergedStudyMethodology?.hypothesis === 'string' ? mergedStudyMethodology?.hypothesis : 'object',
      });

      if (currentProtocol?.id === protocolId) {
        console.log('[ProtocolContext] Setting currentProtocol with PICO:', {
          picoFields: updated.studyMethodology?.picoFields,
          picoFramework: updated.studyMethodology?.hypothesis?.picoFramework,
        });
        setCurrentProtocol(updated);
      }

      return updated;
    });

    // Also update the ref immediately for any subsequent calls
    allProtocolsRef.current = updatedProtocols;
    setAllProtocols(updatedProtocols);
    saveProtocolsToStorage(updatedProtocols);
  }, [currentProtocol, saveProtocolsToStorage]);

  /**
   * Save schema blocks to the current version of a protocol
   * This ensures schema blocks are stored at the version level, not protocol level
   * Required for Database module to generate tables correctly
   */
  const saveSchemaBlocks = useCallback((protocolId: string, schemaBlocks: SchemaBlock[]) => {
    console.log('[ProtocolContext] saveSchemaBlocks called:', protocolId, schemaBlocks.length, 'blocks');

    const currentProtocols = allProtocolsRef.current;

    const updatedProtocols = currentProtocols.map(protocol => {
      if (protocol.id !== protocolId) return protocol;

      // Get the current version (latest draft or most recent)
      const versions = protocol.versions || [];
      if (versions.length === 0) {
        console.error('[ProtocolContext] No versions found for protocol');
        return protocol;
      }

      // Find the draft version to update, or the latest version
      const draftIndex = versions.findIndex(v => v.status === 'draft');
      const targetIndex = draftIndex >= 0 ? draftIndex : versions.length - 1;

      const now = new Date();
      const updatedVersion: ProtocolVersion = {
        ...versions[targetIndex],
        schemaBlocks,
        modifiedAt: now,
        modifiedBy: 'Current User',
      };

      const updatedVersions = [...versions];
      updatedVersions[targetIndex] = updatedVersion;

      const updated: ProtocolWithMethodology = {
        ...protocol,
        versions: updatedVersions,
        modifiedAt: now,
      };

      // Update current version state if this is the current protocol
      if (currentProtocol?.id === protocolId) {
        setCurrentProtocol(updated);
        setCurrentVersion(updatedVersion);
      }

      console.log('[ProtocolContext] Schema blocks saved to version:', updatedVersion.id, 'with', schemaBlocks.length, 'blocks');
      return updated;
    });

    allProtocolsRef.current = updatedProtocols;
    setAllProtocols(updatedProtocols);
    saveProtocolsToStorage(updatedProtocols);
  }, [currentProtocol, saveProtocolsToStorage]);

  /**
   * Delete a protocol
   */
  const deleteProtocol = useCallback((protocolId: string) => {
    console.log('[ProtocolContext] Deleting protocol:', protocolId);

    const updatedProtocols = allProtocols.filter(p => p.id !== protocolId);
    setAllProtocols(updatedProtocols);
    saveProtocolsToStorage(updatedProtocols);

    // Also delete associated clinical data
    const dataKey = `clinical_data_${protocolId}`;
    localStorage.removeItem(dataKey);

    // If deleting current protocol, clear selection
    if (currentProtocol?.id === protocolId) {
      if (updatedProtocols.length > 0) {
        loadProtocol(updatedProtocols[0].id);
      } else {
        setCurrentProtocol(null);
        setCurrentVersion(null);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_PROJECT);
      }
    }
  }, [allProtocols, currentProtocol, loadProtocol, saveProtocolsToStorage]);

  /**
   * Refresh protocols from storage
   */
  const refreshProtocols = useCallback(() => {
    loadProtocolsFromStorage();
  }, [loadProtocolsFromStorage]);

  /**
   * Set current version within current protocol
   */
  const setCurrentVersionById = useCallback((versionId: string) => {
    if (!currentProtocol) return;

    const version = currentProtocol.versions?.find(v => v.id === versionId);
    if (version) {
      setCurrentVersion(version);
    }
  }, [currentProtocol]);

  /**
   * Create a new version (for publishing or branching)
   */
  const createNewVersion = useCallback((protocolId: string, baseVersionId?: string): ProtocolVersion => {
    const protocol = allProtocols.find(p => p.id === protocolId);
    if (!protocol) {
      throw new Error('Protocol not found');
    }

    const baseVersion = baseVersionId
      ? protocol.versions?.find(v => v.id === baseVersionId)
      : protocol.versions?.[protocol.versions.length - 1];

    const now = new Date();
    const versionNumber = (protocol.versions?.length || 0) + 1;

    const newVersion: ProtocolVersion = {
      id: `v-${Date.now()}`,
      versionNumber: `Draft ${versionNumber}.0`,
      status: 'draft',
      createdAt: now,
      modifiedAt: now,
      createdBy: 'Current User',
      modifiedBy: 'Current User',
      metadata: baseVersion?.metadata || {
        protocolTitle: protocol.protocolTitle,
        protocolNumber: protocol.protocolNumber,
        principalInvestigator: '',
        sponsor: '',
        studyPhase: '',
        therapeuticArea: '',
        estimatedEnrollment: '',
        studyDuration: '',
      },
      schemaBlocks: baseVersion?.schemaBlocks || [],
      protocolContent: baseVersion?.protocolContent || {},
      changeLog: `New version based on ${baseVersion?.versionNumber || 'scratch'}`,
    };

    const updatedProtocols = allProtocols.map(p => {
      if (p.id !== protocolId) return p;
      return {
        ...p,
        versions: [...(p.versions || []), newVersion],
        latestDraftVersion: newVersion.versionNumber,
        modifiedAt: now,
      };
    });

    setAllProtocols(updatedProtocols);
    saveProtocolsToStorage(updatedProtocols);

    return newVersion;
  }, [allProtocols, saveProtocolsToStorage]);

  // Methodology configuration methods (moved from ProjectContext)
  const configureMethodology = useCallback((protocolId: string, config: {
    studyType: StudyMethodology['studyType'];
    teamConfiguration?: StudyMethodology['teamConfiguration'];
    hypothesis?: StudyMethodology['hypothesis'];
    configuredBy: string;
  }) => {
    updateProtocol(protocolId, {
      studyMethodology: {
        studyType: config.studyType,
        teamConfiguration: config.teamConfiguration,
        hypothesis: config.hypothesis,
        configuredBy: config.configuredBy,
      },
    });
  }, [updateProtocol]);

  const updateBlindingState = useCallback((protocolId: string, blindingUpdate: Partial<NonNullable<StudyMethodology['blindingState']>>) => {
    const protocol = allProtocols.find(p => p.id === protocolId);
    if (!protocol) return;

    updateProtocol(protocolId, {
      studyMethodology: {
        ...protocol.studyMethodology,
        blindingState: {
          ...protocol.studyMethodology?.blindingState,
          ...blindingUpdate,
        },
      },
    });
  }, [allProtocols, updateProtocol]);

  const performUnblinding = useCallback((protocolId: string, params: {
    performedBy: string;
    reason: string;
    digitalSignature: string;
  }) => {
    const protocol = allProtocols.find(p => p.id === protocolId);
    if (!protocol) return;

    updateProtocol(protocolId, {
      studyMethodology: {
        ...protocol.studyMethodology,
        blindingState: {
          ...protocol.studyMethodology?.blindingState,
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
    });
  }, [allProtocols, updateProtocol]);

  const getBlindingStatus = useCallback(() => {
    if (!currentProtocol?.studyMethodology?.blindingState) {
      return {
        isBlinded: false,
        isUnblinded: false,
        protocol: '',
        canUnblind: false,
      };
    }

    const blindingState = currentProtocol.studyMethodology.blindingState;
    return {
      isBlinded: blindingState.isBlinded,
      isUnblinded: blindingState.isUnblinded,
      protocol: blindingState.protocol || '',
      canUnblind: blindingState.canUnblind,
    };
  }, [currentProtocol]);

  const value: ProtocolContextValue = {
    currentProtocol,
    currentVersion,
    allProtocols,
    isLoading,
    loadProtocol,
    createProtocol,
    saveProtocol,
    saveSchemaBlocks,
    updateProtocol,
    deleteProtocol,
    refreshProtocols,
    setCurrentVersion: setCurrentVersionById,
    createNewVersion,
    configureMethodology,
    updateBlindingState,
    performUnblinding,
    getBlindingStatus,
  };

  return (
    <ProtocolContext.Provider value={value}>
      {children}
    </ProtocolContext.Provider>
  );
}

/**
 * Hook to access protocol context
 * Must be used within ProtocolProvider
 */
export function useProtocol() {
  const context = useContext(ProtocolContext);
  if (!context) {
    throw new Error('useProtocol must be used within ProtocolProvider');
  }
  return context;
}

/**
 * MIGRATION COMPATIBILITY: useProject shim
 * This allows existing code using useProject() to continue working
 * while we migrate to useProtocol()
 *
 * Maps Project concepts to Protocol concepts:
 * - currentProject -> currentProtocol (with name/studyNumber from protocol)
 * - allProjects -> allProtocols (converted to Project-like shape)
 */
/**
 * @deprecated useProject() is deprecated. Use useProtocol() instead.
 * This shim will be removed in a future version.
 */
export function useProject() {
  console.warn('⚠️ DEPRECATED: useProject() is deprecated. Use useProtocol() instead. This shim will be removed in a future version.');

  const protocolContext = useProtocol();

  // Create a Project-like object from current protocol
  const currentProject = protocolContext.currentProtocol ? {
    id: protocolContext.currentProtocol.id,
    name: protocolContext.currentProtocol.protocolTitle,
    studyNumber: protocolContext.currentProtocol.protocolNumber,
    studyName: protocolContext.currentProtocol.protocolTitle, // Alias for compatibility
    description: protocolContext.currentProtocol.description || '',
    studyMethodology: protocolContext.currentProtocol.studyMethodology,
    studyDesign: protocolContext.currentProtocol.studyMethodology, // Alias for compatibility
    governance: protocolContext.currentProtocol.governance,
    status: (protocolContext.currentProtocol.status as 'active' | 'paused' | 'completed' | 'archived') || 'active',
    createdAt: protocolContext.currentProtocol.createdAt?.toString?.() || new Date().toISOString(),
    modifiedAt: protocolContext.currentProtocol.modifiedAt?.toString?.() || new Date().toISOString(),
  } : null;

  // Convert protocols to Project-like objects
  const allProjects = protocolContext.allProtocols.map(p => ({
    id: p.id,
    name: p.protocolTitle,
    studyNumber: p.protocolNumber,
    studyName: p.protocolTitle, // Alias for compatibility
    description: p.description || '',
    studyMethodology: p.studyMethodology,
    studyDesign: p.studyMethodology, // Alias for compatibility
    governance: p.governance,
    status: (p.status as 'active' | 'paused' | 'completed' | 'archived') || 'active', // Default to active
    createdAt: p.createdAt?.toString?.() || new Date().toISOString(),
    modifiedAt: p.modifiedAt?.toString?.() || new Date().toISOString(),
  }));

  return {
    currentProject,
    allProjects,
    isLoading: protocolContext.isLoading,

    // Map Project operations to Protocol operations
    switchProject: (projectId: string) => protocolContext.loadProtocol(projectId),
    createProject: (data: { name: string; studyNumber: string; description?: string }) => {
      const protocol = protocolContext.createProtocol({
        protocolTitle: data.name,
        protocolNumber: data.studyNumber,
        description: data.description,
      });
      return {
        id: protocol.id,
        name: protocol.protocolTitle,
        studyNumber: protocol.protocolNumber,
        description: protocol.description || '',
        createdAt: protocol.createdAt?.toString?.() || new Date().toISOString(),
        modifiedAt: protocol.modifiedAt?.toString?.() || new Date().toISOString(),
      };
    },
    updateProject: (projectId: string, updates: any) => {
      // Only pass defined values to avoid overwriting with undefined
      const protocolUpdates: any = {};
      if (updates.name !== undefined) protocolUpdates.protocolTitle = updates.name;
      if (updates.studyNumber !== undefined) protocolUpdates.protocolNumber = updates.studyNumber;
      if (updates.description !== undefined) protocolUpdates.description = updates.description;
      if (updates.studyMethodology !== undefined) protocolUpdates.studyMethodology = updates.studyMethodology;
      if (updates.governance !== undefined) protocolUpdates.governance = updates.governance;

      console.log('[useProject] updateProject called:', { projectId, updates, protocolUpdates });
      protocolContext.updateProtocol(projectId, protocolUpdates);
    },
    deleteProject: protocolContext.deleteProtocol,
    refreshProjects: protocolContext.refreshProtocols,

    // Methodology methods
    configureMethodology: protocolContext.configureMethodology,
    updateBlindingState: protocolContext.updateBlindingState,
    performUnblinding: protocolContext.performUnblinding,
    getBlindingStatus: protocolContext.getBlindingStatus,
  };
}
