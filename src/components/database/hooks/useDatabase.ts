import { useState, useEffect, useCallback } from 'react';
import { useProject } from '../../../contexts/ProtocolContext';
import { storage } from '../../../utils/storageService';
import type { SavedProtocol, ProtocolVersion } from '../../protocol-workbench/types';
import type { DatabaseTable } from '../utils/schemaGenerator';
import { generateDatabaseTables } from '../utils/schemaGenerator';

type TabType = 'schema' | 'data-entry' | 'browser' | 'query' | 'analytics';

interface FieldFilter {
  normal: boolean;
  modified: boolean;
  new: boolean;
  deprecated: boolean;
}

export function useDatabase() {
  const { currentProject } = useProject();

  const [savedProtocols, setSavedProtocols] = useState<SavedProtocol[]>([]);
  const [selectedProtocolId, setSelectedProtocolId] = useState<string | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [databaseTables, setDatabaseTables] = useState<DatabaseTable[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('browser');
  const [showFieldFilter, setShowFieldFilter] = useState<FieldFilter>({
    normal: true,
    modified: true,
    new: true,
    deprecated: true
  });
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  // 🔄 Load protocols from global storage (no longer project-scoped)
  const loadProtocols = useCallback(() => {
    try {
      // Protocols are now the top-level entity, not scoped to projects
      const protocols = storage.protocols.getAll();
      console.log('📂 [useDatabase] Loaded', protocols.length, 'protocols from storage');
      setSavedProtocols(protocols);
    } catch (error) {
      console.error('❌ [useDatabase] Error loading protocols:', error);
      setSavedProtocols([]);
    }
  }, []);

  // Auto-refresh protocols every 2 seconds
  useEffect(() => {
    loadProtocols();
    const interval = setInterval(loadProtocols, 2000);
    return () => clearInterval(interval);
  }, [loadProtocols]);

  // Auto-select first protocol if none selected (runs once per project)
  useEffect(() => {
    if (!hasAutoSelected && savedProtocols.length > 0 && !selectedProtocolId) {
      const firstProtocol = savedProtocols[0];
      setSelectedProtocolId(firstProtocol.id);
      console.log('  📌 Auto-selected protocol:', firstProtocol.id);

      // 🎯 Auto-select most recent PUBLISHED version
      const activeVersions = firstProtocol.versions.filter(v => v.status !== 'archived');
      const publishedVersions = activeVersions.filter(v => v.status === 'published');
      
      let selectedVersion = null;
      if (publishedVersions.length > 0) {
        selectedVersion = publishedVersions[publishedVersions.length - 1];
        console.log('  ✅ Auto-selected PUBLISHED version:', selectedVersion.id, `(v${selectedVersion.versionNumber})`);
      } else if (activeVersions.length > 0) {
        selectedVersion = activeVersions[activeVersions.length - 1];
        console.log('  ⚠️  Auto-selected DRAFT version:', selectedVersion.id, '(no published versions available)');
      }
      
      if (selectedVersion) {
        setSelectedVersionId(selectedVersion.id);
      }
      
      setHasAutoSelected(true);
    }
  }, [savedProtocols.length, selectedProtocolId, hasAutoSelected]);

  // Validate version selection when protocol changes
  useEffect(() => {
    if (selectedProtocolId) {
      const protocol = savedProtocols.find(p => p.id === selectedProtocolId);
      if (protocol) {
        const activeVersions = protocol.versions.filter(v => v.status !== 'archived');
        
        // Only auto-correct if current selection is invalid
        if (selectedVersionId && !activeVersions.find(v => v.id === selectedVersionId)) {
          const publishedVersions = activeVersions.filter(v => v.status === 'published');
          
          let newVersion = null;
          if (publishedVersions.length > 0) {
            newVersion = publishedVersions[publishedVersions.length - 1];
            console.log('  ✅ Switched to PUBLISHED version:', newVersion.id);
          } else if (activeVersions.length > 0) {
            newVersion = activeVersions[activeVersions.length - 1];
            console.log('  ⚠️  Switched to DRAFT version:', newVersion.id);
          }
          
          if (newVersion) {
            setSelectedVersionId(newVersion.id);
          }
        }
      }
    }
  }, [selectedProtocolId, savedProtocols, selectedVersionId]);

  // Computed values
  const selectedProtocol = savedProtocols.find(p => p.id === selectedProtocolId) || null;
  const selectedVersion = selectedProtocol?.versions.find(v => v.id === selectedVersionId) || null;

  // Generate database tables whenever version changes
  useEffect(() => {
    if (selectedVersion && selectedProtocol) {
      try {
        // Find the previous version for comparison
        const versionIndex = selectedProtocol.versions.findIndex(v => v.id === selectedVersion.id);
        const previousVersion = versionIndex < selectedProtocol.versions.length - 1
          ? selectedProtocol.versions[versionIndex + 1]
          : undefined;

        const tables = generateDatabaseTables(selectedVersion, previousVersion);
        setDatabaseTables(tables);
      } catch (error) {
        console.error('Error generating database tables:', error);
        setDatabaseTables([]);
      }
    } else {
      setDatabaseTables([]);
    }
  }, [selectedVersion, selectedProtocol]);

  return {
    savedProtocols,
    selectedProtocolId,
    setSelectedProtocolId,
    selectedVersionId,
    setSelectedVersionId,
    selectedProtocol,
    selectedVersion,
    databaseTables,
    activeTab,
    setActiveTab,
    showFieldFilter,
    setShowFieldFilter,
    loadProtocols
  };
}