import { useState, useEffect, useCallback, useMemo } from 'react';
import { storage } from '../../../utils/storageService';
import type { SavedProtocol } from '../../protocol-workbench/types';
import type { DatabaseTable } from '../utils/schemaGenerator';
import { generateDatabaseTables } from '../utils/schemaGenerator';

type TabType = 'schema' | 'data-entry' | 'browser' | 'query' | 'analytics';

interface FieldFilter {
  normal: boolean;
  modified: boolean;
  new: boolean;
  deprecated: boolean;
}

interface UseDatabaseOptions {
  initialProtocolId?: string;
  initialVersionId?: string;
}

export function useDatabase(options: UseDatabaseOptions = {}) {
  const { initialProtocolId, initialVersionId } = options;

  const [savedProtocols, setSavedProtocols] = useState<SavedProtocol[]>([]);
  const [selectedProtocolId, setSelectedProtocolId] = useState<string | null>(
    initialProtocolId || null
  );
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    initialVersionId || null
  );
  const [databaseTables, setDatabaseTables] = useState<DatabaseTable[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('browser');
  const [showFieldFilter, setShowFieldFilter] = useState<FieldFilter>({
    normal: true,
    modified: true,
    new: true,
    deprecated: true
  });

  // Helper function to select best version for a protocol
  const selectBestVersion = useCallback((protocol: SavedProtocol) => {
    const activeVersions = protocol.versions.filter(v => v.status !== 'archived');
    const versionsWithSchema = activeVersions.filter(v => v.schemaBlocks && v.schemaBlocks.length > 0);

    // Priority: Published with schema > Draft with schema > Published without > Draft without
    const publishedWithSchema = activeVersions
      .filter(v => v.status === 'published')
      .find(v => v.schemaBlocks && v.schemaBlocks.length > 0);
    const draftWithSchema = versionsWithSchema.find(v => v.status === 'draft');

    if (publishedWithSchema) {
      console.log('  ✅ Selected PUBLISHED version with schema:', publishedWithSchema.id, `(v${publishedWithSchema.versionNumber})`, publishedWithSchema.schemaBlocks?.length, 'blocks');
      return publishedWithSchema;
    } else if (draftWithSchema) {
      console.log('  📝 Selected DRAFT version with schema:', draftWithSchema.id, `(v${draftWithSchema.versionNumber})`, draftWithSchema.schemaBlocks?.length, 'blocks');
      return draftWithSchema;
    } else if (activeVersions.length > 0) {
      const lastVersion = activeVersions[activeVersions.length - 1];
      console.log('  ⚠️ Selected version (no schema):', lastVersion.id);
      return lastVersion;
    }

    return null;
  }, []);

  // 🔄 Load protocols from global storage with change detection
  const loadProtocols = useCallback(() => {
    try {
      const protocols = storage.protocols.getAll();

      // Only update if protocols changed (compare by ID list and version counts)
      setSavedProtocols(prev => {
        const prevIds = prev.map(p => p.id).sort().join(',');
        const newIds = protocols.map(p => p.id).sort().join(',');

        if (prevIds === newIds) {
          // Check if version counts changed for existing protocols
          const hasVersionChanges = protocols.some(p => {
            const prevProtocol = prev.find(pp => pp.id === p.id);
            return prevProtocol && prevProtocol.versions.length !== p.versions.length;
          });

          // Check if schema blocks changed
          const hasSchemaChanges = protocols.some(p => {
            const prevProtocol = prev.find(pp => pp.id === p.id);
            if (!prevProtocol) return false;

            // Compare schema block counts across versions
            return p.versions.some(v => {
              const prevVersion = prevProtocol.versions.find(pv => pv.id === v.id);
              if (!prevVersion) return true;
              return (v.schemaBlocks?.length || 0) !== (prevVersion.schemaBlocks?.length || 0);
            });
          });

          if (!hasVersionChanges && !hasSchemaChanges) {
            return prev;  // No change, skip re-render
          }
        }

        console.log('📂 [useDatabase] Protocols updated:', protocols.length);
        return protocols;
      });
    } catch (error) {
      console.error('❌ [useDatabase] Error loading protocols:', error);
      setSavedProtocols([]);
    }
  }, []);

  // Load protocols once on mount
  useEffect(() => {
    loadProtocols();
  }, [loadProtocols]);

  // Auto-select protocol if none selected and protocols are available
  useEffect(() => {
    // Only auto-select if:
    // 1. We have protocols available
    // 2. No protocol is currently selected
    if (savedProtocols.length > 0 && !selectedProtocolId) {
      const firstProtocol = savedProtocols[0];
      setSelectedProtocolId(firstProtocol.id);
      console.log('📌 Auto-selected protocol:', firstProtocol.id);

      // Auto-select best version
      const bestVersion = selectBestVersion(firstProtocol);
      if (bestVersion) {
        setSelectedVersionId(bestVersion.id);
      }
    }
  }, [savedProtocols, selectedProtocolId, selectBestVersion]);

  // Re-validate selected version when protocol changes or protocols update
  useEffect(() => {
    if (!selectedProtocolId) return;

    const protocol = savedProtocols.find(p => p.id === selectedProtocolId);

    // If selected protocol no longer exists, reset
    if (!protocol) {
      console.log('⚠️ Selected protocol no longer exists, resetting selection');
      setSelectedProtocolId(null);
      setSelectedVersionId(null);
      return;
    }

    const activeVersions = protocol.versions.filter(v => v.status !== 'archived');

    // Re-validate or auto-select version if:
    // 1. No version is selected
    // 2. Selected version doesn't exist in active versions
    if (!selectedVersionId || !activeVersions.find(v => v.id === selectedVersionId)) {
      const bestVersion = selectBestVersion(protocol);
      if (bestVersion) {
        setSelectedVersionId(bestVersion.id);
        console.log('🔄 Re-selected version:', bestVersion.id);
      }
    }
  }, [selectedProtocolId, savedProtocols, selectBestVersion]); // selectedVersionId intentionally omitted to avoid loops

  // Memoize computed values to prevent unnecessary effect re-runs
  const selectedProtocol = useMemo(() =>
    savedProtocols.find(p => p.id === selectedProtocolId) || null,
    [savedProtocols, selectedProtocolId]
  );

  const selectedVersion = useMemo(() =>
    selectedProtocol?.versions.find(v => v.id === selectedVersionId) || null,
    [selectedProtocol, selectedVersionId]
  );

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
        console.log('📊 [useDatabase] Generated', tables.length, 'tables with',
          tables.reduce((acc, t) => acc + t.fields.length, 0), 'fields');
        setDatabaseTables(tables);
      } catch (error) {
        console.error('❌ [useDatabase] Error generating database tables:', error);
        setDatabaseTables([]);
      }
    } else {
      console.log('📊 [useDatabase] No version selected, clearing tables');
      setDatabaseTables([]);
    }
  }, [selectedVersion, selectedProtocol]);

  // Manual refresh function - uses same change detection as loadProtocols
  const refreshProtocols = useCallback(() => {
    console.log('🔄 [useDatabase] Manual refresh triggered');
    const protocols = storage.protocols.getAll();

    // Use same change detection logic to avoid unnecessary re-renders
    setSavedProtocols(prev => {
      const prevIds = prev.map(p => p.id).sort().join(',');
      const newIds = protocols.map(p => p.id).sort().join(',');

      if (prevIds === newIds) {
        // Check if version counts changed for existing protocols
        const hasVersionChanges = protocols.some(p => {
          const prevProtocol = prev.find(pp => pp.id === p.id);
          return prevProtocol && prevProtocol.versions.length !== p.versions.length;
        });

        // Check if schema blocks changed
        const hasSchemaChanges = protocols.some(p => {
          const prevProtocol = prev.find(pp => pp.id === p.id);
          if (!prevProtocol) return false;

          return p.versions.some(v => {
            const prevVersion = prevProtocol.versions.find(pv => pv.id === v.id);
            if (!prevVersion) return true;
            return (v.schemaBlocks?.length || 0) !== (prevVersion.schemaBlocks?.length || 0);
          });
        });

        if (!hasVersionChanges && !hasSchemaChanges) {
          console.log('🔄 [useDatabase] No changes detected, skipping update');
          return prev;  // No change, skip re-render
        }
      }

      console.log('📂 [useDatabase] Refreshed:', protocols.length, 'protocols');
      return protocols;
    });
  }, []);

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
    loadProtocols,
    refreshProtocols,  // New: manual refresh function
  };
}
