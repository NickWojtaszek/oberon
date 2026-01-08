import { useState, useCallback, useEffect } from 'react';
import { useProject } from '../../../contexts/ProjectContext';
import { storage } from '../../../utils/storageService';
import type { SavedProtocol, ProtocolVersion, SchemaBlock } from '../types';

// REMOVED: Legacy storage key - now using centralized storage service
// const STORAGE_KEY = 'clinical-intelligence-protocols';

export function useVersionControl() {
  const { currentProject } = useProject();

  const [savedProtocols, setSavedProtocols] = useState<SavedProtocol[]>(() => {
    // 🔄 NEW: Load from project-scoped storage
    if (typeof window !== 'undefined' && currentProject) {
      console.log('📂 [useVersionControl] Loading protocols for project:', currentProject.name);
      return storage.protocols.getAll(currentProject.id);
    }
    return [];
  });

  const [currentProtocolId, setCurrentProtocolId] = useState<string | null>(null);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // 🔄 NEW: Persist to project-scoped storage whenever savedProtocols changes
  useEffect(() => {
    if (typeof window !== 'undefined' && currentProject && savedProtocols.length >= 0) {
      console.log('💾 [useVersionControl] Saving', savedProtocols.length, 'protocols to project storage');
      storage.protocols.save(savedProtocols, currentProject.id);
    }
  }, [savedProtocols, currentProject]);

  // 🔄 NEW: Reload protocols when project changes
  useEffect(() => {
    if (currentProject) {
      console.log('🔄 [useVersionControl] Project changed, reloading protocols:', currentProject.name);
      const protocols = storage.protocols.getAll(currentProject.id);
      setSavedProtocols(protocols);
      console.log(`  📦 Loaded ${protocols.length} protocols`);
    } else {
      console.log('ℹ️  [useVersionControl] No current project, clearing protocols');
      setSavedProtocols([]);
    }
  }, [currentProject?.id]); // Only depend on ID to avoid infinite loops

  const saveProtocol = useCallback((
    protocolTitle: string,
    protocolNumber: string,
    schemaBlocks: SchemaBlock[],
    protocolMetadata: any,
    protocolContent: any,
    status: 'draft' | 'published' = 'draft',
    existingProtocolId?: string // Optional parameter to update existing protocol
  ) => {
    // 🛡️ Guard: Require project context
    if (!currentProject) {
      console.error('❌ [useVersionControl] Cannot save protocol: No current project');
      setSaveStatus('error');
      return;
    }

    setIsSaving(true);
    setSaveStatus('saving');

    // Simulate save delay with progress
    setTimeout(() => {
      const protocolId = existingProtocolId || currentProtocolId || `PROTO-${Date.now()}`;
      const versionId = `v${Date.now()}`;
      
      const newVersion: ProtocolVersion = {
        id: versionId,
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

      setSavedProtocols(prev => {
        const existingIndex = prev.findIndex(p => p.id === protocolId);
        
        if (existingIndex >= 0) {
          // Update existing protocol
          const updated = [...prev];
          const existingProtocol = updated[existingIndex];
          
          updated[existingIndex] = {
            ...existingProtocol,
            protocolTitle: protocolTitle, // ✅ FIXED: Use correct field name
            protocolNumber: protocolNumber, // ✅ FIXED: Use correct field name
            modifiedAt: new Date(),
            versions: [...existingProtocol.versions, newVersion],
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
      setCurrentVersionId(versionId);
      setIsSaving(false);
      setSaveStatus('saved');
      
      console.log('✅ [useVersionControl] Protocol saved:', { 
        protocolId, 
        versionId, 
        project: currentProject.name 
      });

      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }, 1000);
  }, [currentProtocolId, savedProtocols.length, currentProject]);

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
    if (!currentProject) {
      console.error('❌ [useVersionControl] Cannot delete protocol: No current project');
      return;
    }

    console.log('🗑️  [useVersionControl] Deleting protocol:', protocolId);
    setSavedProtocols(prev => prev.filter(p => p.id !== protocolId));
    
    if (currentProtocolId === protocolId) {
      setCurrentProtocolId(null);
      setCurrentVersionId(null);
    }
  }, [currentProtocolId, currentProject]);

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