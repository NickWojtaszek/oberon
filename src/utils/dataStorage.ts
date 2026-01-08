/**
 * Clinical data storage utilities
 * Handles localStorage operations with error handling
 */

export interface ClinicalDataRecord {
  recordId: string;
  protocolNumber: string;
  protocolVersion: string;
  subjectId: string;
  visitNumber: string | null;
  enrollmentDate: string;
  collectedAt: string;
  collectedBy: string;
  status: 'draft' | 'complete';
  data: {
    [tableId: string]: {
      [fieldId: string]: any;
    };
  };
  lastModified: string;
}

const STORAGE_KEY = 'clinical-intelligence-data';

/**
 * Save a clinical data record
 */
export function saveDataRecord(
  record: Omit<ClinicalDataRecord, 'recordId' | 'collectedAt' | 'lastModified'>
): { success: boolean; recordId?: string; error?: string } {
  try {
    const recordId = `${record.subjectId}_${record.visitNumber || 'baseline'}_${Date.now()}`;
    const timestamp = new Date().toISOString();

    const fullRecord: ClinicalDataRecord = {
      ...record,
      recordId,
      collectedAt: timestamp,
      lastModified: timestamp,
    };

    // Load existing data
    const existingData = getAllRecords();

    // Check for duplicate - same subject, same visit
    const duplicateIndex = existingData.findIndex(
      (r) =>
        r.subjectId === record.subjectId &&
        r.visitNumber === record.visitNumber &&
        r.protocolNumber === record.protocolNumber &&
        r.protocolVersion === record.protocolVersion
    );

    if (duplicateIndex >= 0) {
      // Update existing record
      existingData[duplicateIndex] = {
        ...fullRecord,
        recordId: existingData[duplicateIndex].recordId, // Keep original ID
        collectedAt: existingData[duplicateIndex].collectedAt, // Keep original creation time
      };
    } else {
      // Add new record
      existingData.push(fullRecord);
    }

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));

    return { success: true, recordId: fullRecord.recordId };
  } catch (error) {
    console.error('Failed to save data record:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Get all clinical data records
 */
export function getAllRecords(): ClinicalDataRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load data records:', error);
    return [];
  }
}

/**
 * Get records for a specific protocol and version
 */
export function getRecordsByProtocol(
  protocolNumber: string,
  protocolVersion?: string
): ClinicalDataRecord[] {
  const allRecords = getAllRecords();
  return allRecords.filter(
    (record) =>
      record.protocolNumber === protocolNumber &&
      (protocolVersion ? record.protocolVersion === protocolVersion : true)
  );
}

/**
 * Get records for a specific subject
 */
export function getRecordsBySubject(subjectId: string): ClinicalDataRecord[] {
  const allRecords = getAllRecords();
  return allRecords.filter((record) => record.subjectId === subjectId);
}

/**
 * Delete a specific record
 */
export function deleteRecord(recordId: string): { success: boolean; error?: string } {
  try {
    const allRecords = getAllRecords();
    const filteredRecords = allRecords.filter((record) => record.recordId !== recordId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
    return { success: true };
  } catch (error) {
    console.error('Failed to delete record:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Clear all data (use with caution)
 */
export function clearAllData(): { success: boolean; error?: string } {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return { success: true };
  } catch (error) {
    console.error('Failed to clear data:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Export data as JSON file
 */
export function exportDataAsJSON(): string {
  const allRecords = getAllRecords();
  return JSON.stringify(allRecords, null, 2);
}

/**
 * Get storage statistics
 */
export function getStorageStats(): {
  totalRecords: number;
  draftRecords: number;
  completeRecords: number;
  uniqueSubjects: number;
} {
  const allRecords = getAllRecords();
  const uniqueSubjects = new Set(allRecords.map((r) => r.subjectId));

  return {
    totalRecords: allRecords.length,
    draftRecords: allRecords.filter((r) => r.status === 'draft').length,
    completeRecords: allRecords.filter((r) => r.status === 'complete').length,
    uniqueSubjects: uniqueSubjects.size,
  };
}
