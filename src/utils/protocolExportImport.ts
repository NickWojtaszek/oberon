/**
 * Protocol Export/Import Utilities
 *
 * Provides full protocol export (including PICO, foundational papers, schema, etc.)
 * and import with validation for portable protocol backup/restore.
 */

import type { SavedProtocol, ProtocolVersion, SchemaBlock } from '../components/protocol-workbench/types';
import { storage } from './storageService';

// Export format version for future compatibility
const EXPORT_FORMAT_VERSION = '1.0';

/**
 * Export file structure
 */
export interface ProtocolExportFile {
  formatVersion: string;
  exportedAt: string;
  exportedBy: string;
  protocol: SavedProtocol;
  // Include associated clinical data if requested
  clinicalData?: any[];
  // Include statistical manifests if requested
  statisticalManifests?: any[];
  // Include manuscripts if requested
  manuscripts?: any[];
}

/**
 * Import result
 */
export interface ImportResult {
  success: boolean;
  protocolId?: string;
  protocolNumber?: string;
  versionCount?: number;
  error?: string;
  warnings?: string[];
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  protocol?: SavedProtocol;
}

/**
 * Export a single protocol to a downloadable JSON file
 */
export function exportProtocol(
  protocol: SavedProtocol,
  options: {
    includeClinicalData?: boolean;
    includeManifests?: boolean;
    includeManuscripts?: boolean;
  } = {}
): ProtocolExportFile {
  const exportFile: ProtocolExportFile = {
    formatVersion: EXPORT_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    exportedBy: 'Clinical Intelligence Engine',
    protocol: deepClone(protocol),
  };

  // Optionally include clinical data
  if (options.includeClinicalData) {
    const protocolNumber = protocol.protocolNumber;
    if (protocolNumber) {
      const clinicalData = storage.clinicalData.getByProtocol(protocolNumber);
      if (clinicalData.length > 0) {
        exportFile.clinicalData = clinicalData;
      }
    }
  }

  // Optionally include statistical manifests
  if (options.includeManifests) {
    const manifests = storage.statisticalManifests.getAll(protocol.id);
    if (manifests.length > 0) {
      exportFile.statisticalManifests = manifests;
    }
  }

  // Optionally include manuscripts
  if (options.includeManuscripts) {
    const manuscripts = storage.manuscripts.getAll(protocol.id);
    if (manuscripts.length > 0) {
      exportFile.manuscripts = manuscripts;
    }
  }

  return exportFile;
}

/**
 * Download a protocol export as a JSON file
 */
export function downloadProtocolExport(
  protocol: SavedProtocol,
  options: {
    includeClinicalData?: boolean;
    includeManifests?: boolean;
    includeManuscripts?: boolean;
  } = {}
): void {
  const exportData = exportProtocol(protocol, options);
  const jsonString = JSON.stringify(exportData, null, 2);

  // Create filename from protocol number or title
  const safeName = (protocol.protocolNumber || protocol.protocolTitle || 'protocol')
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .substring(0, 50);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${safeName}_export_${timestamp}.json`;

  // Create and trigger download
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  console.log(`📦 Protocol exported: ${filename}`);
}

/**
 * Validate an imported protocol file
 */
export function validateProtocolImport(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check basic structure
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid file format: not a valid JSON object'], warnings };
  }

  // Check format version
  if (!data.formatVersion) {
    warnings.push('No format version found, assuming compatible format');
  } else if (data.formatVersion !== EXPORT_FORMAT_VERSION) {
    warnings.push(`Format version mismatch: expected ${EXPORT_FORMAT_VERSION}, got ${data.formatVersion}`);
  }

  // Check protocol existence
  if (!data.protocol) {
    return { valid: false, errors: ['No protocol data found in file'], warnings };
  }

  const protocol = data.protocol as SavedProtocol;

  // Validate required protocol fields
  if (!protocol.id) {
    errors.push('Protocol missing required field: id');
  }
  if (!protocol.protocolNumber && !protocol.protocolTitle) {
    errors.push('Protocol must have either protocolNumber or protocolTitle');
  }
  if (!protocol.versions || !Array.isArray(protocol.versions)) {
    errors.push('Protocol missing versions array');
  } else if (protocol.versions.length === 0) {
    errors.push('Protocol has no versions');
  }

  // Validate each version
  if (protocol.versions) {
    protocol.versions.forEach((version, index) => {
      if (!version.id) {
        errors.push(`Version ${index} missing required field: id`);
      }
      if (!version.versionNumber) {
        errors.push(`Version ${index} missing required field: versionNumber`);
      }
      if (!version.schemaBlocks) {
        warnings.push(`Version ${index} has no schemaBlocks`);
      }
    });
  }

  // Check for potential data issues
  if (protocol.versions) {
    const publishedCount = protocol.versions.filter(v => v.status === 'published').length;
    const draftCount = protocol.versions.filter(v => v.status === 'draft').length;

    if (publishedCount === 0 && draftCount > 0) {
      warnings.push('Protocol has only draft versions, no published version');
    }
  }

  // Check if protocol number already exists
  const existingProtocols = storage.protocols.getAll();
  const duplicateNumber = existingProtocols.find(p =>
    p.protocolNumber === protocol.protocolNumber && p.id !== protocol.id
  );
  if (duplicateNumber) {
    warnings.push(`A protocol with number "${protocol.protocolNumber}" already exists (different ID)`);
  }

  const duplicateId = existingProtocols.find(p => p.id === protocol.id);
  if (duplicateId) {
    warnings.push(`A protocol with ID "${protocol.id}" already exists and will be replaced`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    protocol: errors.length === 0 ? protocol : undefined,
  };
}

/**
 * Import a protocol from exported JSON data
 */
export function importProtocol(
  data: any,
  options: {
    generateNewId?: boolean;
    overwriteExisting?: boolean;
    importClinicalData?: boolean;
    importManifests?: boolean;
    importManuscripts?: boolean;
  } = {}
): ImportResult {
  // Validate first
  const validation = validateProtocolImport(data);
  if (!validation.valid || !validation.protocol) {
    return {
      success: false,
      error: validation.errors.join('; '),
      warnings: validation.warnings,
    };
  }

  const importedProtocol = deepClone(validation.protocol);
  const warnings = [...validation.warnings];

  // Generate new ID if requested or if there's a conflict
  const existingProtocols = storage.protocols.getAll();
  const existingById = existingProtocols.find(p => p.id === importedProtocol.id);

  if (options.generateNewId || (existingById && !options.overwriteExisting)) {
    const oldId = importedProtocol.id;
    importedProtocol.id = `PROTO-IMPORT-${Date.now()}`;

    // Also update version IDs to avoid conflicts
    importedProtocol.versions = importedProtocol.versions.map(v => ({
      ...v,
      id: `v-import-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    }));

    warnings.push(`Generated new protocol ID (was: ${oldId})`);
  }

  // Update timestamps
  importedProtocol.modifiedAt = new Date();

  try {
    // Save the protocol
    let updatedProtocols: SavedProtocol[];

    if (existingById && options.overwriteExisting) {
      // Replace existing
      updatedProtocols = existingProtocols.map(p =>
        p.id === importedProtocol.id ? importedProtocol : p
      );
      warnings.push('Replaced existing protocol with same ID');
    } else {
      // Add new
      updatedProtocols = [...existingProtocols, importedProtocol];
    }

    storage.protocols.save(updatedProtocols);

    // Import clinical data if requested and available
    if (options.importClinicalData && data.clinicalData && Array.isArray(data.clinicalData)) {
      const existingData = storage.clinicalData.getAll();
      const newData = [...existingData, ...data.clinicalData];
      storage.clinicalData.save(newData);
      warnings.push(`Imported ${data.clinicalData.length} clinical data records`);
    }

    // Import statistical manifests if requested and available
    if (options.importManifests && data.statisticalManifests && Array.isArray(data.statisticalManifests)) {
      data.statisticalManifests.forEach((manifest: any) => {
        storage.statisticalManifests.save(manifest, importedProtocol.id);
      });
      warnings.push(`Imported ${data.statisticalManifests.length} statistical manifests`);
    }

    // Import manuscripts if requested and available
    if (options.importManuscripts && data.manuscripts && Array.isArray(data.manuscripts)) {
      data.manuscripts.forEach((manuscript: any) => {
        storage.manuscripts.save(manuscript, importedProtocol.id);
      });
      warnings.push(`Imported ${data.manuscripts.length} manuscripts`);
    }

    console.log(`📥 Protocol imported: ${importedProtocol.protocolNumber || importedProtocol.id}`);

    return {
      success: true,
      protocolId: importedProtocol.id,
      protocolNumber: importedProtocol.protocolNumber,
      versionCount: importedProtocol.versions.length,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to save protocol: ${String(error)}`,
      warnings,
    };
  }
}

/**
 * Read a file and parse as protocol export
 */
export function readProtocolFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        resolve(data);
      } catch (error) {
        reject(new Error('Failed to parse file as JSON'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Get export summary for display
 */
export function getExportSummary(protocol: SavedProtocol): {
  protocolNumber: string;
  title: string;
  versionCount: number;
  publishedVersions: number;
  schemaBlockCount: number;
  hasPico: boolean;
  hasFoundationalPapers: boolean;
  hasStatisticalPlan: boolean;
} {
  const latestVersion = protocol.versions[protocol.versions.length - 1];
  const content = latestVersion?.protocolContent || {};

  // Try to access extended protocol data (may be present on runtime objects)
  // PICO and foundationalPapers are stored in studyMethodology at the protocol level
  const extendedProtocol = protocol as any;
  const studyMethodology = extendedProtocol?.studyMethodology;
  const picoFields = studyMethodology?.picoFields || studyMethodology?.hypothesis?.picoFramework;
  const foundationalPapers = studyMethodology?.foundationalPapers;

  return {
    protocolNumber: protocol.protocolNumber || 'N/A',
    title: protocol.protocolTitle || 'Untitled',
    versionCount: protocol.versions.length,
    publishedVersions: protocol.versions.filter(v => v.status === 'published').length,
    schemaBlockCount: latestVersion?.schemaBlocks?.length || 0,
    hasPico: !!(picoFields && (picoFields.population || picoFields.intervention)),
    hasFoundationalPapers: !!(foundationalPapers && foundationalPapers.length > 0),
    hasStatisticalPlan: !!content.statisticalPlan,
  };
}

/**
 * Deep clone helper
 */
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
