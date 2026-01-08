// Trend Tracker - Track validation scores over time for continuous improvement

import type { ValidationResult } from '../core/personaTypes';

export interface ValidationSnapshot {
  id: string;
  timestamp: string;
  protocolId: string;
  protocolVersion?: string;
  results: ValidationResult[];
  scores: {
    [personaId: string]: number;
  };
  totalIssues: number;
  criticalIssues: number;
  warningIssues: number;
  infoIssues: number;
}

export interface TrendMetrics {
  personaId: string;
  personaName: string;
  currentScore: number;
  previousScore?: number;
  scoreChange: number;
  scoreChangePercent: number;
  trend: 'improving' | 'declining' | 'stable';
  snapshots: ValidationSnapshot[];
}

export interface OverallTrend {
  totalSnapshots: number;
  dateRange: {
    start: string;
    end: string;
  };
  averageScore: number;
  scoreImprovement: number;
  personas: TrendMetrics[];
  issueReductionRate: number;
}

class TrendTracker {
  private storageKey = 'validation-trends';
  private snapshots: ValidationSnapshot[] = [];

  constructor() {
    this.loadSnapshots();
  }

  /**
   * Load snapshots from localStorage
   */
  private loadSnapshots(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.snapshots = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load validation snapshots:', error);
      this.snapshots = [];
    }
  }

  /**
   * Save snapshots to localStorage
   */
  private saveSnapshots(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.snapshots));
    } catch (error) {
      console.error('Failed to save validation snapshots:', error);
    }
  }

  /**
   * Record a validation snapshot
   */
  recordSnapshot(
    protocolId: string,
    results: ValidationResult[],
    scores: { [personaId: string]: number },
    protocolVersion?: string
  ): ValidationSnapshot {
    const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
    const criticalIssues = results.reduce((sum, r) => 
      sum + r.issues.filter(i => i.severity === 'critical').length, 0
    );
    const warningIssues = results.reduce((sum, r) => 
      sum + r.issues.filter(i => i.severity === 'warning').length, 0
    );
    const infoIssues = results.reduce((sum, r) => 
      sum + r.issues.filter(i => i.severity === 'info').length, 0
    );

    const snapshot: ValidationSnapshot = {
      id: `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      protocolId,
      protocolVersion,
      results,
      scores,
      totalIssues,
      criticalIssues,
      warningIssues,
      infoIssues
    };

    this.snapshots.push(snapshot);
    
    // Keep only last 100 snapshots per protocol
    const protocolSnapshots = this.snapshots.filter(s => s.protocolId === protocolId);
    if (protocolSnapshots.length > 100) {
      const toRemove = protocolSnapshots.slice(0, protocolSnapshots.length - 100);
      this.snapshots = this.snapshots.filter(s => !toRemove.includes(s));
    }

    this.saveSnapshots();
    return snapshot;
  }

  /**
   * Get snapshots for a specific protocol
   */
  getSnapshotsForProtocol(protocolId: string, limit?: number): ValidationSnapshot[] {
    const protocolSnapshots = this.snapshots
      .filter(s => s.protocolId === protocolId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return limit ? protocolSnapshots.slice(0, limit) : protocolSnapshots;
  }

  /**
   * Get trend metrics for a specific persona
   */
  getPersonaTrend(protocolId: string, personaId: string, personaName: string): TrendMetrics | null {
    const snapshots = this.getSnapshotsForProtocol(protocolId);
    
    if (snapshots.length === 0) {
      return null;
    }

    const currentSnapshot = snapshots[0];
    const previousSnapshot = snapshots.length > 1 ? snapshots[1] : null;

    const currentScore = currentSnapshot.scores[personaId] || 0;
    const previousScore = previousSnapshot?.scores[personaId];

    const scoreChange = previousScore !== undefined ? currentScore - previousScore : 0;
    const scoreChangePercent = previousScore !== undefined && previousScore > 0
      ? (scoreChange / previousScore) * 100
      : 0;

    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (scoreChange > 2) {
      trend = 'improving';
    } else if (scoreChange < -2) {
      trend = 'declining';
    }

    return {
      personaId,
      personaName,
      currentScore,
      previousScore,
      scoreChange,
      scoreChangePercent,
      trend,
      snapshots
    };
  }

  /**
   * Get overall trend analysis for a protocol
   */
  getOverallTrend(protocolId: string): OverallTrend | null {
    const snapshots = this.getSnapshotsForProtocol(protocolId);
    
    if (snapshots.length === 0) {
      return null;
    }

    const currentSnapshot = snapshots[0];
    const oldestSnapshot = snapshots[snapshots.length - 1];

    // Calculate average score across all personas
    const currentScores = Object.values(currentSnapshot.scores);
    const averageScore = currentScores.length > 0
      ? currentScores.reduce((sum, s) => sum + s, 0) / currentScores.length
      : 0;

    // Calculate score improvement from oldest to current
    const oldestScores = Object.values(oldestSnapshot.scores);
    const oldestAverageScore = oldestScores.length > 0
      ? oldestScores.reduce((sum, s) => sum + s, 0) / oldestScores.length
      : 0;
    
    const scoreImprovement = averageScore - oldestAverageScore;

    // Calculate issue reduction rate
    const issueReductionRate = oldestSnapshot.totalIssues > 0
      ? ((oldestSnapshot.totalIssues - currentSnapshot.totalIssues) / oldestSnapshot.totalIssues) * 100
      : 0;

    // Get trends for all personas
    const personaIds = new Set<string>();
    snapshots.forEach(s => {
      Object.keys(s.scores).forEach(id => personaIds.add(id));
    });

    const personas: TrendMetrics[] = [];
    personaIds.forEach(personaId => {
      const personaResult = currentSnapshot.results.find(r => r.personaId === personaId);
      const personaName = personaResult?.personaName || personaId;
      
      const trend = this.getPersonaTrend(protocolId, personaId, personaName);
      if (trend) {
        personas.push(trend);
      }
    });

    return {
      totalSnapshots: snapshots.length,
      dateRange: {
        start: oldestSnapshot.timestamp,
        end: currentSnapshot.timestamp
      },
      averageScore,
      scoreImprovement,
      personas,
      issueReductionRate
    };
  }

  /**
   * Get time series data for charting
   */
  getTimeSeriesData(
    protocolId: string,
    personaId?: string
  ): Array<{ timestamp: string; score: number; issues: number }> {
    const snapshots = this.getSnapshotsForProtocol(protocolId)
      .reverse(); // Oldest first for time series

    if (personaId) {
      return snapshots.map(s => ({
        timestamp: s.timestamp,
        score: s.scores[personaId] || 0,
        issues: s.results.find(r => r.personaId === personaId)?.issues.length || 0
      }));
    } else {
      // Overall average
      return snapshots.map(s => {
        const scores = Object.values(s.scores);
        const avgScore = scores.length > 0
          ? scores.reduce((sum, score) => sum + score, 0) / scores.length
          : 0;
        
        return {
          timestamp: s.timestamp,
          score: avgScore,
          issues: s.totalIssues
        };
      });
    }
  }

  /**
   * Compare two protocol versions
   */
  compareVersions(
    protocolId: string,
    version1: string,
    version2: string
  ): {
    version1Snapshot?: ValidationSnapshot;
    version2Snapshot?: ValidationSnapshot;
    scoreChanges: { [personaId: string]: number };
    issueChanges: {
      total: number;
      critical: number;
      warning: number;
      info: number;
    };
  } | null {
    const v1Snapshots = this.snapshots.filter(
      s => s.protocolId === protocolId && s.protocolVersion === version1
    );
    const v2Snapshots = this.snapshots.filter(
      s => s.protocolId === protocolId && s.protocolVersion === version2
    );

    const v1Latest = v1Snapshots.length > 0 ? v1Snapshots[v1Snapshots.length - 1] : undefined;
    const v2Latest = v2Snapshots.length > 0 ? v2Snapshots[v2Snapshots.length - 1] : undefined;

    if (!v1Latest || !v2Latest) {
      return null;
    }

    const scoreChanges: { [personaId: string]: number } = {};
    const allPersonaIds = new Set([
      ...Object.keys(v1Latest.scores),
      ...Object.keys(v2Latest.scores)
    ]);

    allPersonaIds.forEach(personaId => {
      const v1Score = v1Latest.scores[personaId] || 0;
      const v2Score = v2Latest.scores[personaId] || 0;
      scoreChanges[personaId] = v2Score - v1Score;
    });

    return {
      version1Snapshot: v1Latest,
      version2Snapshot: v2Latest,
      scoreChanges,
      issueChanges: {
        total: v2Latest.totalIssues - v1Latest.totalIssues,
        critical: v2Latest.criticalIssues - v1Latest.criticalIssues,
        warning: v2Latest.warningIssues - v1Latest.warningIssues,
        info: v2Latest.infoIssues - v1Latest.infoIssues
      }
    };
  }

  /**
   * Clear all snapshots for a protocol
   */
  clearProtocolSnapshots(protocolId: string): void {
    this.snapshots = this.snapshots.filter(s => s.protocolId !== protocolId);
    this.saveSnapshots();
  }

  /**
   * Clear all snapshots
   */
  clearAllSnapshots(): void {
    this.snapshots = [];
    this.saveSnapshots();
  }

  /**
   * Export snapshots for backup
   */
  exportSnapshots(): string {
    return JSON.stringify(this.snapshots, null, 2);
  }

  /**
   * Import snapshots from backup
   */
  importSnapshots(jsonData: string): void {
    try {
      const imported = JSON.parse(jsonData);
      if (Array.isArray(imported)) {
        this.snapshots = imported;
        this.saveSnapshots();
      }
    } catch (error) {
      console.error('Failed to import snapshots:', error);
      throw error;
    }
  }
}

// Singleton instance
export const globalTrendTracker = new TrendTracker();
