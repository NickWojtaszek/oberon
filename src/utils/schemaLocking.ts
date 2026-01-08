/**
 * Schema Locking & Version Control
 * 
 * Prevents data corruption by locking protocol schemas once clinical data is collected.
 * Enforces version management for structural changes.
 */

import { storage } from './storageService';
import type { ProtocolVersion, SavedProtocol } from '../types/shared';

/**
 * Check if a protocol version has collected clinical data
 */
export function hasCollectedData(
  protocolNumber: string,
  versionId: string,
  projectId?: string
): { hasData: boolean; recordCount: number } {
  try {
    const allData = storage.clinicalData.getAll(projectId);
    const records = allData.filter(
      record =>
        record.protocolNumber === protocolNumber &&
        record.protocolVersion === versionId
    );

    return {
      hasData: records.length > 0,
      recordCount: records.length,
    };
  } catch (error) {
    console.error('Error checking for collected data:', error);
    return { hasData: false, recordCount: 0 };
  }
}

/**
 * Check if a protocol version can be edited
 */
export function canEditProtocolVersion(
  version: ProtocolVersion,
  protocolNumber: string,
  projectId?: string
): { canEdit: boolean; reason?: string; recordCount?: number } {
  // Check if version is already locked
  if (version.locked) {
    const { recordCount } = hasCollectedData(protocolNumber, version.id, projectId);
    return {
      canEdit: false,
      reason: 'Schema is locked for data collection',
      recordCount,
    };
  }

  // Check if data exists (auto-lock protection)
  const { hasData, recordCount } = hasCollectedData(
    protocolNumber,
    version.id,
    projectId
  );

  if (hasData) {
    return {
      canEdit: false,
      reason: 'Clinical data exists for this version',
      recordCount,
    };
  }

  return { canEdit: true };
}

/**
 * Lock a protocol version for data collection
 */
export function lockProtocolVersion(
  protocol: SavedProtocol,
  versionId: string,
  lockedBy: string,
  projectId?: string
): SavedProtocol {
  const updatedProtocol = { ...protocol };

  // Find and lock the version
  updatedProtocol.versions = protocol.versions.map(version => {
    if (version.id === versionId) {
      return {
        ...version,
        locked: true,
        lockedAt: new Date(),
        lockedBy,
        status: 'published' as const,
        modifiedAt: new Date(),
      };
    }
    return version;
  });

  // Update protocol modified timestamp
  updatedProtocol.modifiedAt = new Date();

  // Save to storage
  const protocols = storage.protocols.getAll(projectId);
  const updatedProtocols = protocols.map(p =>
    p.id === protocol.id ? updatedProtocol : p
  );
  storage.protocols.save(updatedProtocols, projectId);

  // Log the action
  console.log(
    `[Schema Lock] Protocol ${protocol.protocolNumber} version ${versionId} locked at ${new Date().toISOString()} by ${lockedBy}`
  );

  return updatedProtocol;
}

/**
 * Create a new version from a locked version
 */
export function createNewVersionFromLocked(
  protocol: SavedProtocol,
  baseVersionId: string,
  createdBy: string,
  changeLog: string
): { newProtocol: SavedProtocol; newVersion: ProtocolVersion } {
  const baseVersion = protocol.versions.find(v => v.id === baseVersionId);

  if (!baseVersion) {
    throw new Error('Base version not found');
  }

  // Calculate next version number
  const versionNumbers = protocol.versions.map(v =>
    parseFloat(v.versionNumber.replace('v', ''))
  );
  const maxVersion = Math.max(...versionNumbers);
  const nextVersion = `v${(maxVersion + 0.1).toFixed(1)}`;

  // Create new version
  const newVersion: ProtocolVersion = {
    ...baseVersion,
    id: `version-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    versionNumber: nextVersion,
    status: 'draft',
    locked: false,
    lockedAt: undefined,
    lockedBy: undefined,
    createdAt: new Date(),
    modifiedAt: new Date(),
    createdBy,
    modifiedBy: createdBy,
    changeLog: changeLog || `Created from locked ${baseVersion.versionNumber}`,
    hasCollectedData: false,
    dataRecordCount: 0,
  };

  // Update protocol
  const updatedProtocol: SavedProtocol = {
    ...protocol,
    versions: [...protocol.versions, newVersion],
    currentVersion: newVersion.id,
    latestDraftVersion: newVersion.id,
    modifiedAt: new Date(),
  };

  console.log(
    `[Version Created] New version ${nextVersion} created from ${baseVersion.versionNumber}`
  );

  return { newProtocol: updatedProtocol, newVersion };
}

/**
 * Update protocol version with data collection stats
 */
export function updateDataCollectionStats(
  protocol: SavedProtocol,
  projectId?: string
): SavedProtocol {
  const updatedProtocol = { ...protocol };

  updatedProtocol.versions = protocol.versions.map(version => {
    const { hasData, recordCount } = hasCollectedData(
      protocol.protocolNumber,
      version.id,
      projectId
    );

    return {
      ...version,
      hasCollectedData: hasData,
      dataRecordCount: recordCount,
    };
  });

  return updatedProtocol;
}

/**
 * Get version lock status message
 */
export function getVersionLockStatus(version: ProtocolVersion): {
  isLocked: boolean;
  message: string;
  badge: {
    text: string;
    color: 'green' | 'yellow' | 'slate';
  };
} {
  if (version.locked) {
    const lockedDate = version.lockedAt
      ? new Date(version.lockedAt).toLocaleDateString()
      : 'unknown date';

    return {
      isLocked: true,
      message: `Schema locked on ${lockedDate} by ${version.lockedBy || 'system'}`,
      badge: { text: 'Locked', color: 'green' },
    };
  }

  if (version.status === 'published') {
    return {
      isLocked: false,
      message: 'Published but not locked - can still be edited',
      badge: { text: 'Published', color: 'green' },
    };
  }

  if (version.status === 'draft') {
    return {
      isLocked: false,
      message: 'Draft version - editable',
      badge: { text: 'Draft', color: 'yellow' },
    };
  }

  return {
    isLocked: false,
    message: 'Archived version',
    badge: { text: 'Archived', color: 'slate' },
  };
}
