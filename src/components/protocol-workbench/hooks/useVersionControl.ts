import { useState, useCallback, useEffect, useRef } from 'react';
import { storage } from '../../../utils/storageService';
import type { SavedProtocol, ProtocolVersion, SchemaBlock } from '../types';

// SIMPLIFIED: No project scoping - protocols are globally accessible
// NOTE: This hook syncs with localStorage but avoids overwriting data from ProtocolContext.

export function useVersionControl() {
  // Track if save was triggered by this hook (vs external changes)
  const pendingExplicitSave = useRef(false);

  const [savedProtocols, setSavedProtocols] = useState<SavedProtocol[]>(() => {
    // Load from global storage on initial render
    if (typeof window !== 'undefined') {
      console.log('[useVersionControl] Initial load from global storage');
      const protocols = storage.protocols.getAll();
      console.log(`[useVersionControl] Found ${protocols.length} protocols in storage`);
      return protocols;
    }
    return [];
  });

  const [currentProtocolId, setCurrentProtocolId] = useState<string | null>(null);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Persist to global storage ONLY when we explicitly trigger a save
  // This prevents overwriting data that ProtocolContext wrote
  useEffect(() => {
    if (pendingExplicitSave.current && typeof window !== 'undefined') {
      console.log('[useVersionControl] Explicit save triggered:', savedProtocols.length, 'protocols');
      storage.protocols.save(savedProtocols);
      pendingExplicitSave.current = false;
    }
  }, [savedProtocols]);

  // Sync with storage on mount and when storage changes externally (e.g., from ProtocolContext)
  useEffect(() => {
    const syncFromStorage = () => {
      const protocols = storage.protocols.getAll();
      // Update local state if storage has different data
      const currentIds = new Set(savedProtocols.map(p => p.id));
      const storageIds = new Set(protocols.map(p => p.id));

      // Check if there are new protocols in storage that we don't have
      const hasNewProtocols = protocols.some(p => !currentIds.has(p.id));
      // Check if storage has protocols we're missing (e.g., ProtocolContext created one)
      const needsSync = hasNewProtocols || protocols.length !== savedProtocols.length;

      if (needsSync) {
        console.log(`[useVersionControl] Syncing from storage: ${protocols.length} protocols (had ${savedProtocols.length})`);
        setSavedProtocols(protocols);
      }
    };

    // Sync on mount
    syncFromStorage();

    // Listen for storage events (cross-tab changes)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'clinical_protocols') {
        console.log('[useVersionControl] Storage changed externally, syncing...');
        syncFromStorage();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Also sync when window regains focus
    window.addEventListener('focus', syncFromStorage);

    // Periodic sync to catch ProtocolContext updates within same tab
    const interval = setInterval(syncFromStorage, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', syncFromStorage);
      clearInterval(interval);
    };
  }, [savedProtocols]);

  const saveProtocol = useCallback((
    protocolTitle: string,
    protocolNumber: string,
    schemaBlocks: SchemaBlock[],
    protocolMetadata: any,
    protocolContent: any,
    status: 'draft' | 'published' = 'draft',
    existingProtocolId?: string // Optional parameter to update existing protocol
  ) => {
    setIsSaving(true);
    setSaveStatus('saving');

    // Simulate save delay with progress
    setTimeout(() => {
      const protocolId = existingProtocolId || currentProtocolId || `PROTO-${Date.now()}`;
      let finalVersionId = `v${Date.now()}`; // Will be updated if we're reusing an existing draft

      const newVersion: ProtocolVersion = {
        id: finalVersionId,
        versionNumber: status === 'draft' ? `Draft ${new Date().toLocaleDateString()}` : `v1.${savedProtocols.length}`,
        status,
        createdAt: new Date(),
        modifiedAt: new Date(),
        createdBy: 'Current User',
        modifiedBy: 'Current User',
        metadata: protocolMetadata,
        schemaBlocks,
        protocolContent,
        changeLog: status === 'draft' ? 'Draft version' : 'Initial version',
        locked: false,
        hasCollectedData: false,
        dataRecordCount: 0,
      };

      // Mark that we're doing an explicit save so the effect will persist to storage
      pendingExplicitSave.current = true;

      setSavedProtocols(prev => {
        const existingIndex = prev.findIndex(p => p.id === protocolId);

        if (existingIndex >= 0) {
          // Update existing protocol
          const updated = [...prev];
          const existingProtocol = updated[existingIndex];

          // Find if there's already a draft version we should update
          const existingDraftIndex = existingProtocol.versions.findIndex(
            v => v.status === 'draft' && v.versionNumber.startsWith('Draft')
          );

          let updatedVersions: ProtocolVersion[];
          if (status === 'draft' && existingDraftIndex >= 0) {
            // UPDATE existing draft version instead of creating new one
            const existingDraft = existingProtocol.versions[existingDraftIndex];
            finalVersionId = existingDraft.id; // Reuse existing version ID

            updatedVersions = [...existingProtocol.versions];
            updatedVersions[existingDraftIndex] = {
              ...newVersion,
              id: existingDraft.id, // Keep same version ID
              createdAt: existingDraft.createdAt, // Keep original creation time
            };
            console.log('🔄 [useVersionControl] Updating existing draft version:', {
              versionId: finalVersionId,
              protocolId
            });
          } else {
            // ADD new version (for published versions or first draft)
            updatedVersions = [...existingProtocol.versions, newVersion];
            console.log('➕ [useVersionControl] Adding new version:', {
              versionId: newVersion.id,
              status,
              protocolId
            });
          }

          updated[existingIndex] = {
            ...existingProtocol,
            protocolTitle: protocolTitle, // ✅ FIXED: Use correct field name
            protocolNumber: protocolNumber, // ✅ FIXED: Use correct field name
            modifiedAt: new Date(),
            versions: updatedVersions,
            currentVersion: newVersion.versionNumber, // Update currentVersion reference to version number
          };
          return updated;
        } else {
          // Create new protocol
          const newProtocol: SavedProtocol = {
            id: protocolId,
            protocolTitle: protocolTitle, // ✅ FIXED: Use correct field name
            protocolNumber: protocolNumber, // ✅ FIXED: Use correct field name
            currentVersion: newVersion.versionNumber,
            latestDraftVersion: status === 'draft' ? newVersion.versionNumber : undefined,
            versions: [newVersion],
            createdAt: new Date(),
            modifiedAt: new Date(),
          };
          return [...prev, newProtocol];
        }
      });

      setCurrentProtocolId(protocolId);
      setCurrentVersionId(finalVersionId); // Use the final version ID (existing or new)
      setIsSaving(false);
      setSaveStatus('saved');

      console.log('[useVersionControl] Protocol saved:', {
        protocolId,
        versionId: finalVersionId
      });

      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }, 1000);
  }, [currentProtocolId, savedProtocols.length]);

  const loadProtocolVersion = useCallback((protocolId: string, versionId: string) => {
    console.log('📖 [useVersionControl] Loading protocol version:', { protocolId, versionId });
    
    const protocol = savedProtocols.find(p => p.id === protocolId);
    if (!protocol) {
      console.error('❌ [useVersionControl] Protocol not found:', protocolId);
      return null;
    }

    const version = protocol.versions.find(v => v.id === versionId);
    if (!version) {
      console.error('❌ [useVersionControl] Version not found:', versionId);
      return null;
    }
    
    setCurrentProtocolId(protocolId);
    setCurrentVersionId(versionId);
    console.log('✅ [useVersionControl] Protocol version loaded successfully');
    
    return version;
  }, [savedProtocols]);

  const deleteProtocol = useCallback((protocolId: string) => {
    console.log('[useVersionControl] Deleting protocol:', protocolId);
    pendingExplicitSave.current = true;
    setSavedProtocols(prev => prev.filter(p => p.id !== protocolId));

    if (currentProtocolId === protocolId) {
      setCurrentProtocolId(null);
      setCurrentVersionId(null);
    }
  }, [currentProtocolId]);

  return {
    savedProtocols,
    currentProtocolId,
    currentVersionId,
    isSaving,
    saveProtocol,
    loadProtocolVersion,
    deleteProtocol,
    setCurrentProtocolId,
    setCurrentVersionId,
    saveStatus,
  };
}