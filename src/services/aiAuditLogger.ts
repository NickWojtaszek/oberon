/**
 * AI Audit Logger Service
 * 
 * Provides immutable audit logging for all AI persona activities.
 * Logs suggestions, validations, user actions, and configuration changes.
 * 
 * Features:
 * - Append-only logging with hash chain integrity
 * - Per-persona and global statistics
 * - Export capabilities for regulatory inspection
 * - Tamper detection via hash verification
 */

import type { 
  AIAuditLog, 
  AIAuditLogEntry, 
  AIAuditAction,
  AIAuditStats,
  PersonaAuditStats,
} from '../types/aiGovernance';
import type { PersonaId, PersonaModule } from '../components/ai-personas/core/personaTypes';

class AIAuditLoggerService {
  private storageKeyPrefix = 'ai_audit_log_';

  // ==========================================
  // CORE LOGGING METHODS
  // ==========================================

  /**
   * Log an AI action to the audit trail
   */
  log(
    projectId: string,
    personaId: PersonaId,
    personaName: string,
    module: PersonaModule | string,
    action: AIAuditAction,
    actor: 'System AI' | 'User',
    details: AIAuditLogEntry['details'],
    userId?: string,
    userName?: string
  ): AIAuditLogEntry {
    const auditLog = this.getLog(projectId);
    const previousHash = auditLog.entries.length > 0 
      ? auditLog.entries[auditLog.entries.length - 1].entryHash 
      : undefined;

    const entry: AIAuditLogEntry = {
      id: `ai-audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      projectId,
      personaId,
      personaName,
      module,
      action,
      actor,
      userId,
      userName,
      details,
      previousEntryHash: previousHash,
      entryHash: '', // Will be calculated
    };

    // Calculate integrity hash
    entry.entryHash = this.calculateEntryHash(entry);

    // Add to log
    auditLog.entries.push(entry);
    auditLog.lastUpdated = new Date().toISOString();
    
    // Update stats
    this.updateStats(auditLog, action, details);

    // Save
    this.saveLog(projectId, auditLog);

    return entry;
  }

  // ==========================================
  // CONVENIENCE LOGGING METHODS
  // ==========================================

  /**
   * Log when an AI suggestion is generated
   */
  logSuggestionGenerated(
    projectId: string,
    personaId: PersonaId,
    personaName: string,
    module: PersonaModule | string,
    suggestion: {
      id: string;
      message: string;
      severity: 'critical' | 'warning' | 'info';
      regulatoryCitation?: string;
      confidence: number;
      variableName?: string;
    }
  ): AIAuditLogEntry {
    return this.log(
      projectId,
      personaId,
      personaName,
      module,
      'AI_SUGGESTION_GENERATED',
      'System AI',
      {
        suggestionId: suggestion.id,
        message: suggestion.message,
        severity: suggestion.severity,
        regulatoryCitation: suggestion.regulatoryCitation,
        confidence: suggestion.confidence,
        variableName: suggestion.variableName,
      }
    );
  }

  /**
   * Log when a user accepts a suggestion
   */
  logSuggestionAccepted(
    projectId: string,
    personaId: PersonaId,
    personaName: string,
    module: PersonaModule | string,
    suggestionId: string,
    userId: string,
    userName: string
  ): AIAuditLogEntry {
    return this.log(
      projectId,
      personaId,
      personaName,
      module,
      'AI_SUGGESTION_ACCEPTED',
      'User',
      { suggestionId },
      userId,
      userName
    );
  }

  /**
   * Log when a user dismisses a suggestion
   */
  logSuggestionDismissed(
    projectId: string,
    personaId: PersonaId,
    personaName: string,
    module: PersonaModule | string,
    suggestionId: string,
    userId: string,
    userName: string,
    reason?: string
  ): AIAuditLogEntry {
    return this.log(
      projectId,
      personaId,
      personaName,
      module,
      'AI_SUGGESTION_DISMISSED',
      'User',
      { suggestionId, reason },
      userId,
      userName
    );
  }

  /**
   * Log when an auto-fix is applied
   */
  logAutoFixApplied(
    projectId: string,
    personaId: PersonaId,
    personaName: string,
    module: PersonaModule | string,
    details: {
      suggestionId: string;
      variableName?: string;
      oldValue?: any;
      newValue?: any;
    },
    userId: string,
    userName: string
  ): AIAuditLogEntry {
    return this.log(
      projectId,
      personaId,
      personaName,
      module,
      'AI_AUTO_FIX_APPLIED',
      'User',
      details,
      userId,
      userName
    );
  }

  /**
   * Log a validation run result
   */
  logValidationRun(
    projectId: string,
    personaId: PersonaId,
    personaName: string,
    module: PersonaModule | string,
    result: {
      score: number;
      issuesFound: number;
      criticalCount: number;
      warningCount: number;
      blockedReasons: string[];
    }
  ): AIAuditLogEntry {
    const action: AIAuditAction = result.blockedReasons.length > 0 
      ? 'AI_VALIDATION_BLOCKED' 
      : result.criticalCount > 0 
        ? 'AI_VALIDATION_FAILED' 
        : 'AI_VALIDATION_PASSED';

    return this.log(
      projectId,
      personaId,
      personaName,
      module,
      action,
      'System AI',
      result
    );
  }

  /**
   * Log when a persona is activated
   */
  logPersonaActivated(
    projectId: string,
    personaId: PersonaId,
    personaName: string,
    userId: string,
    userName: string
  ): AIAuditLogEntry {
    return this.log(
      projectId,
      personaId,
      personaName,
      'protocol-workbench', // Global action
      'AI_PERSONA_ACTIVATED',
      'User',
      {},
      userId,
      userName
    );
  }

  /**
   * Log when a persona is deactivated
   */
  logPersonaDeactivated(
    projectId: string,
    personaId: PersonaId,
    personaName: string,
    userId: string,
    userName: string
  ): AIAuditLogEntry {
    return this.log(
      projectId,
      personaId,
      personaName,
      'protocol-workbench',
      'AI_PERSONA_DEACTIVATED',
      'User',
      {},
      userId,
      userName
    );
  }

  /**
   * Log when communication settings are changed
   */
  logCommunicationSettingsChanged(
    projectId: string,
    personaId: PersonaId,
    personaName: string,
    oldValue: any,
    newValue: any,
    userId: string,
    userName: string
  ): AIAuditLogEntry {
    return this.log(
      projectId,
      personaId,
      personaName,
      'protocol-workbench',
      'AI_COMMUNICATION_SETTINGS_CHANGED',
      'User',
      { oldValue, newValue },
      userId,
      userName
    );
  }

  /**
   * Log when inference boundaries are modified
   */
  logInferenceBoundaryModified(
    projectId: string,
    personaId: PersonaId,
    personaName: string,
    modification: {
      action: string;
      inference: string;
      justification: string;
    },
    userId: string,
    userName: string
  ): AIAuditLogEntry {
    return this.log(
      projectId,
      personaId,
      personaName,
      'protocol-workbench',
      'AI_INFERENCE_BOUNDARY_MODIFIED',
      'User',
      {
        message: `${modification.action}: ${modification.inference}`,
        justification: modification.justification,
      },
      userId,
      userName
    );
  }

  // ==========================================
  // RETRIEVAL METHODS
  // ==========================================

  /**
   * Get the complete audit log for a project
   */
  getLog(projectId: string): AIAuditLog {
    const stored = localStorage.getItem(this.storageKeyPrefix + projectId);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return this.createEmptyLog(projectId);
      }
    }
    return this.createEmptyLog(projectId);
  }

  /**
   * Get all entries for a specific persona
   */
  getEntriesByPersona(projectId: string, personaId: PersonaId): AIAuditLogEntry[] {
    const log = this.getLog(projectId);
    return log.entries.filter(e => e.personaId === personaId);
  }

  /**
   * Get entries filtered by action type
   */
  getEntriesByAction(projectId: string, action: AIAuditAction): AIAuditLogEntry[] {
    const log = this.getLog(projectId);
    return log.entries.filter(e => e.action === action);
  }

  /**
   * Get entries filtered by actor
   */
  getEntriesByActor(projectId: string, actor: 'System AI' | 'User'): AIAuditLogEntry[] {
    const log = this.getLog(projectId);
    return log.entries.filter(e => e.actor === actor);
  }

  /**
   * Get most recent entries (descending by time)
   */
  getRecentEntries(projectId: string, limit = 50): AIAuditLogEntry[] {
    const log = this.getLog(projectId);
    return log.entries.slice(-limit).reverse();
  }

  /**
   * Get entries within a date range
   */
  getEntriesByDateRange(
    projectId: string, 
    startDate: Date, 
    endDate: Date
  ): AIAuditLogEntry[] {
    const log = this.getLog(projectId);
    return log.entries.filter(e => {
      const entryDate = new Date(e.timestamp);
      return entryDate >= startDate && entryDate <= endDate;
    });
  }

  /**
   * Get global audit stats for a project
   */
  getStats(projectId: string): AIAuditStats {
    const log = this.getLog(projectId);
    return log.stats;
  }

  /**
   * Get per-persona statistics
   */
  getPersonaStats(projectId: string, personaId: PersonaId): PersonaAuditStats {
    const entries = this.getEntriesByPersona(projectId, personaId);
    const generated = entries.filter(e => e.action === 'AI_SUGGESTION_GENERATED').length;
    const accepted = entries.filter(e => e.action === 'AI_SUGGESTION_ACCEPTED').length;
    const dismissed = entries.filter(e => e.action === 'AI_SUGGESTION_DISMISSED').length;
    const lastEntry = entries.length > 0 ? entries[entries.length - 1] : null;
    
    return {
      personaId,
      personaName: lastEntry?.personaName || personaId,
      suggestionsGenerated: generated,
      suggestionsAccepted: accepted,
      suggestionsDismissed: dismissed,
      acceptanceRate: generated > 0 ? Math.round((accepted / generated) * 100) : 0,
      lastActivity: lastEntry?.timestamp,
    };
  }

  /**
   * Get stats for all personas in a project
   */
  getAllPersonaStats(projectId: string): PersonaAuditStats[] {
    const log = this.getLog(projectId);
    const personaIds = [...new Set(log.entries.map(e => e.personaId))];
    return personaIds.map(id => this.getPersonaStats(projectId, id));
  }

  // ==========================================
  // EXPORT METHODS
  // ==========================================

  /**
   * Export complete audit log as JSON
   */
  exportLog(projectId: string): string {
    const log = this.getLog(projectId);
    
    // Log the export action
    this.log(
      projectId,
      'protocol-auditor', // Default persona for system actions
      'System',
      'protocol-workbench',
      'AI_AUDIT_LOG_EXPORTED',
      'User',
      { message: 'Full audit log exported' }
    );
    
    return JSON.stringify({
      exportMetadata: {
        projectId,
        exportedAt: new Date().toISOString(),
        totalEntries: log.entries.length,
        integrityVerified: this.verifyIntegrity(log),
        version: '1.0',
      },
      stats: log.stats,
      entries: log.entries,
    }, null, 2);
  }

  /**
   * Export audit log for a specific persona
   */
  exportPersonaLog(projectId: string, personaId: PersonaId): string {
    const entries = this.getEntriesByPersona(projectId, personaId);
    const stats = this.getPersonaStats(projectId, personaId);
    
    return JSON.stringify({
      exportMetadata: {
        projectId,
        personaId,
        personaName: stats.personaName,
        exportedAt: new Date().toISOString(),
        totalEntries: entries.length,
      },
      stats,
      entries,
    }, null, 2);
  }

  /**
   * Export log as CSV format
   */
  exportLogAsCSV(projectId: string): string {
    const log = this.getLog(projectId);
    const headers = [
      'timestamp',
      'personaId',
      'personaName',
      'module',
      'action',
      'actor',
      'userId',
      'userName',
      'severity',
      'message',
      'regulatoryCitation',
      'confidence',
    ];
    
    const rows = log.entries.map(e => [
      e.timestamp,
      e.personaId,
      e.personaName,
      e.module,
      e.action,
      e.actor,
      e.userId || '',
      e.userName || '',
      e.details.severity || '',
      (e.details.message || '').replace(/,/g, ';'), // Escape commas
      e.details.regulatoryCitation || '',
      e.details.confidence?.toString() || '',
    ].join(','));
    
    return [headers.join(','), ...rows].join('\n');
  }

  // ==========================================
  // INTEGRITY VERIFICATION
  // ==========================================

  /**
   * Verify the integrity of the audit log
   * Returns true if no tampering detected
   */
  verifyIntegrity(log: AIAuditLog): boolean {
    if (log.entries.length === 0) return true;
    
    for (let i = 1; i < log.entries.length; i++) {
      const currentEntry = log.entries[i];
      const previousEntry = log.entries[i - 1];
      
      // Check hash chain
      if (currentEntry.previousEntryHash !== previousEntry.entryHash) {
        console.warn(`Audit log integrity check failed at entry ${i}`);
        return false;
      }
      
      // Verify entry hash
      const calculatedHash = this.calculateEntryHash({
        ...currentEntry,
        entryHash: '',
      });
      if (calculatedHash !== currentEntry.entryHash) {
        console.warn(`Audit log entry hash mismatch at entry ${i}`);
        return false;
      }
    }
    
    return true;
  }

  // ==========================================
  // PRIVATE HELPERS
  // ==========================================

  private createEmptyLog(projectId: string): AIAuditLog {
    return {
      projectId,
      entries: [],
      lastUpdated: new Date().toISOString(),
      stats: {
        totalSuggestions: 0,
        acceptedSuggestions: 0,
        dismissedSuggestions: 0,
        autoFixesApplied: 0,
        configurationChanges: 0,
        validationRuns: 0,
      },
    };
  }

  private saveLog(projectId: string, log: AIAuditLog): void {
    try {
      localStorage.setItem(this.storageKeyPrefix + projectId, JSON.stringify(log));
    } catch (error) {
      console.error('Failed to save audit log:', error);
      // Handle storage quota exceeded
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        // Archive old entries to reduce size
        this.archiveOldEntries(projectId, log);
      }
    }
  }

  private archiveOldEntries(projectId: string, log: AIAuditLog): void {
    // Keep only the last 1000 entries
    if (log.entries.length > 1000) {
      const archivedEntries = log.entries.slice(0, log.entries.length - 1000);
      log.entries = log.entries.slice(-1000);
      
      // Store archived entries separately
      const archiveKey = `${this.storageKeyPrefix}${projectId}_archive_${Date.now()}`;
      try {
        localStorage.setItem(archiveKey, JSON.stringify(archivedEntries));
      } catch {
        console.warn('Could not archive old audit entries');
      }
      
      // Try saving again
      localStorage.setItem(this.storageKeyPrefix + projectId, JSON.stringify(log));
    }
  }

  private updateStats(log: AIAuditLog, action: AIAuditAction, details: AIAuditLogEntry['details']): void {
    switch (action) {
      case 'AI_SUGGESTION_GENERATED':
        log.stats.totalSuggestions++;
        break;
      case 'AI_SUGGESTION_ACCEPTED':
        log.stats.acceptedSuggestions++;
        break;
      case 'AI_SUGGESTION_DISMISSED':
        log.stats.dismissedSuggestions++;
        break;
      case 'AI_AUTO_FIX_APPLIED':
        log.stats.autoFixesApplied++;
        break;
      case 'AI_VALIDATION_RUN':
      case 'AI_VALIDATION_PASSED':
      case 'AI_VALIDATION_FAILED':
      case 'AI_VALIDATION_BLOCKED':
        log.stats.validationRuns++;
        if (details.score !== undefined) {
          log.stats.lastValidationScore = details.score;
        }
        break;
      case 'AI_COMMUNICATION_SETTINGS_CHANGED':
      case 'AI_INFERENCE_BOUNDARY_MODIFIED':
      case 'AI_ADDITIONAL_RESTRICTION_ADDED':
      case 'AI_ADDITIONAL_RESTRICTION_REMOVED':
      case 'AI_PERSONA_ACTIVATED':
      case 'AI_PERSONA_DEACTIVATED':
        log.stats.configurationChanges++;
        break;
    }
  }

  private calculateEntryHash(entry: AIAuditLogEntry): string {
    // Create a deterministic string representation
    const data = JSON.stringify({
      id: entry.id,
      timestamp: entry.timestamp,
      projectId: entry.projectId,
      personaId: entry.personaId,
      action: entry.action,
      actor: entry.actor,
      details: entry.details,
      previousEntryHash: entry.previousEntryHash,
    });
    
    // Simple hash function (in production, use proper crypto)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Convert to base36 string for compact representation
    return Math.abs(hash).toString(36).padStart(8, '0');
  }

  /**
   * Clear audit log (DANGEROUS - only for testing/development)
   */
  clearLog(projectId: string): void {
    if (process.env.NODE_ENV === 'development') {
      localStorage.removeItem(this.storageKeyPrefix + projectId);
      console.warn(`Audit log cleared for project ${projectId}`);
    } else {
      console.error('Clearing audit logs is not allowed in production');
    }
  }
}

// Export singleton instance
export const aiAuditLogger = new AIAuditLoggerService();

// Export class for testing
export { AIAuditLoggerService };
