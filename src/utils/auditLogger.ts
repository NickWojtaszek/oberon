// Audit Logger - Immutable compliance logging system

import type { AuditLog, AuditLogEntry, AuditAction } from '../types/ethics';

export class AuditLogger {
  private projectId: string;
  private storageKey: string;

  constructor(projectId: string) {
    this.projectId = projectId;
    this.storageKey = `audit_log_${projectId}`;
  }

  /**
   * Log an action to the audit trail
   */
  log(
    action: AuditAction,
    performedBy: string,
    performedByName: string,
    performedByRole: string,
    details: {
      oldValue?: any;
      newValue?: any;
      reason?: string;
      metadata?: Record<string, any>;
    },
    submissionId?: string
  ): void {
    const auditLog = this.getLog();

    const entry: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      projectId: this.projectId,
      submissionId,
      action,
      performedBy,
      performedByName,
      performedByRole,
      timestamp: new Date().toISOString(),
      details,
    };

    auditLog.entries.push(entry);
    auditLog.lastUpdated = new Date().toISOString();

    this.saveLog(auditLog);
  }

  /**
   * Get the full audit log
   */
  getLog(): AuditLog {
    const stored = localStorage.getItem(this.storageKey);
    
    if (stored) {
      return JSON.parse(stored);
    }

    // Initialize new audit log
    const newLog: AuditLog = {
      projectId: this.projectId,
      entries: [],
      lastUpdated: new Date().toISOString(),
    };

    this.saveLog(newLog);
    return newLog;
  }

  /**
   * Get entries for a specific submission
   */
  getSubmissionEntries(submissionId: string): AuditLogEntry[] {
    const log = this.getLog();
    return log.entries.filter(e => e.submissionId === submissionId);
  }

  /**
   * Get entries by action type
   */
  getEntriesByAction(action: AuditAction): AuditLogEntry[] {
    const log = this.getLog();
    return log.entries.filter(e => e.action === action);
  }

  /**
   * Get recent entries (last N)
   */
  getRecentEntries(limit: number = 50): AuditLogEntry[] {
    const log = this.getLog();
    return log.entries.slice(-limit).reverse();
  }

  /**
   * Export audit log for regulatory inspection
   */
  exportLog(): string {
    const log = this.getLog();
    return JSON.stringify(log, null, 2);
  }

  /**
   * Save log to localStorage (private)
   */
  private saveLog(log: AuditLog): void {
    localStorage.setItem(this.storageKey, JSON.stringify(log));
  }

  /**
   * Clear audit log (DANGEROUS - only for testing)
   */
  clearLog(): void {
    if (confirm('⚠️ WARNING: This will permanently delete the audit log. This action cannot be undone and may violate regulatory requirements. Continue?')) {
      localStorage.removeItem(this.storageKey);
    }
  }
}

/**
 * Helper to get audit logger instance
 */
export function getAuditLogger(projectId: string): AuditLogger {
  return new AuditLogger(projectId);
}
