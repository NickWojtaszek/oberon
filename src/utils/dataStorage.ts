/**
 * Clinical data storage utilities
 * Handles localStorage operations with error handling and audit trail
 */

/**
 * Audit trail entry for tracking changes to clinical records
 */
export interface AuditEntry {
  timestamp: string;
  action: 'created' | 'updated' | 'status_changed' | 'deleted';
  user: string;
  details?: string;
  previousStatus?: 'draft' | 'complete';
  newStatus?: 'draft' | 'complete';
  changedFields?: string[];
}

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
  /** Audit trail - array of all changes to this record */
  auditTrail?: AuditEntry[];
}

const STORAGE_KEY = 'clinical-intelligence-data';

/**
 * Helper: Get list of changed fields between two data objects
 */
function getChangedFields(
  oldData: { [tableId: string]: { [fieldId: string]: any } },
  newData: { [tableId: string]: { [fieldId: string]: any } }
): string[] {
  const changedFields: string[] = [];

  // Check all tables in new data
  for (const tableId of Object.keys(newData)) {
    const oldTable = oldData[tableId] || {};
    const newTable = newData[tableId];

    for (const fieldId of Object.keys(newTable)) {
      if (oldTable[fieldId] !== newTable[fieldId]) {
        changedFields.push(`${tableId}.${fieldId}`);
      }
    }
  }

  // Check for removed fields (in old but not in new)
  for (const tableId of Object.keys(oldData)) {
    const newTable = newData[tableId] || {};
    const oldTable = oldData[tableId];

    for (const fieldId of Object.keys(oldTable)) {
      if (!(fieldId in newTable)) {
        changedFields.push(`${tableId}.${fieldId} (removed)`);
      }
    }
  }

  return changedFields;
}

/**
 * Save a clinical data record with audit trail
 */
export function saveDataRecord(
  record: Omit<ClinicalDataRecord, 'recordId' | 'collectedAt' | 'lastModified' | 'auditTrail'>
): { success: boolean; recordId?: string; error?: string; isUpdate?: boolean } {
  try {
    const timestamp = new Date().toISOString();

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

    let finalRecordId: string;
    let isUpdate = false;

    if (duplicateIndex >= 0) {
      // Update existing record
      const existingRecord = existingData[duplicateIndex];
      finalRecordId = existingRecord.recordId;
      isUpdate = true;

      // Build audit entry for update
      const auditEntry: AuditEntry = {
        timestamp,
        action: existingRecord.status !== record.status ? 'status_changed' : 'updated',
        user: record.collectedBy,
        changedFields: getChangedFields(existingRecord.data, record.data),
      };

      // Add status change details
      if (existingRecord.status !== record.status) {
        auditEntry.previousStatus = existingRecord.status;
        auditEntry.newStatus = record.status;
        auditEntry.details = `Status changed from ${existingRecord.status} to ${record.status}`;
      } else {
        auditEntry.details = `Updated ${auditEntry.changedFields?.length || 0} fields`;
      }

      existingData[duplicateIndex] = {
        ...record,
        recordId: existingRecord.recordId,
        collectedAt: existingRecord.collectedAt,
        lastModified: timestamp,
        auditTrail: [...(existingRecord.auditTrail || []), auditEntry],
      };
    } else {
      // Create new record
      finalRecordId = `${record.subjectId}_${record.visitNumber || 'baseline'}_${Date.now()}`;

      const auditEntry: AuditEntry = {
        timestamp,
        action: 'created',
        user: record.collectedBy,
        details: `Record created with status: ${record.status}`,
        newStatus: record.status,
      };

      const fullRecord: ClinicalDataRecord = {
        ...record,
        recordId: finalRecordId,
        collectedAt: timestamp,
        lastModified: timestamp,
        auditTrail: [auditEntry],
      };

      existingData.push(fullRecord);
    }

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));

    console.log(`💾 [dataStorage] Record ${isUpdate ? 'updated' : 'created'}:`, finalRecordId);

    return { success: true, recordId: finalRecordId, isUpdate };
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
 * Delete a specific record (with audit trail option)
 * @param recordId - The record to delete
 * @param softDelete - If true, marks as deleted but keeps in storage for audit trail
 * @param deletedBy - User who deleted the record
 */
export function deleteRecord(
  recordId: string,
  softDelete: boolean = false,
  deletedBy: string = 'Current User'
): { success: boolean; error?: string } {
  try {
    const allRecords = getAllRecords();
    const recordIndex = allRecords.findIndex((r) => r.recordId === recordId);

    if (recordIndex === -1) {
      return { success: false, error: 'Record not found' };
    }

    if (softDelete) {
      // Soft delete: Add audit entry and mark as deleted (keeping record for history)
      const timestamp = new Date().toISOString();
      const record = allRecords[recordIndex];

      const auditEntry: AuditEntry = {
        timestamp,
        action: 'deleted',
        user: deletedBy,
        details: `Record soft-deleted (preserved for audit trail)`,
        previousStatus: record.status,
      };

      // Add a "deleted" marker to the record
      allRecords[recordIndex] = {
        ...record,
        lastModified: timestamp,
        auditTrail: [...(record.auditTrail || []), auditEntry],
        // Mark as deleted by prefixing recordId (optional approach)
        // Alternatively, add a 'deleted' status field
      };

      console.log(`🗑️ [dataStorage] Record soft-deleted:`, recordId);
    } else {
      // Hard delete: Remove from storage entirely
      allRecords.splice(recordIndex, 1);
      console.log(`🗑️ [dataStorage] Record permanently deleted:`, recordId);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allRecords));
    return { success: true };
  } catch (error) {
    console.error('Failed to delete record:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Get audit trail for a specific record
 */
export function getRecordAuditTrail(recordId: string): AuditEntry[] {
  const allRecords = getAllRecords();
  const record = allRecords.find((r) => r.recordId === recordId);
  return record?.auditTrail || [];
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
