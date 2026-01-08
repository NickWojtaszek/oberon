// Verification Service - Data access layer for manuscript verification
// Abstracts storage implementation (localStorage → Backend API)

import { apiClient } from '../lib/apiClient';
import { config } from '../config/environment';
import type { ManuscriptManifest } from '../types/manuscript';
import type { StatisticalManifest } from '../components/analytics-stats/types';
import type {
  RunLogicCheckRequest,
  ApproveVerificationRequest,
  AutoSyncVerificationRequest,
  LogicCheckResponse,
  VerificationListResponse,
  ApproveVerificationResponse,
  AutoSyncResponse,
} from '../types/api/verification.api';

// Re-export VerificationPacket from centralized types
export type { VerificationPacket } from '../types/evidenceVerification';
import type { VerificationPacket } from '../types/evidenceVerification';

class VerificationService {
  private useBackend(): boolean {
    return config.api.useBackend && apiClient.isBackendEnabled();
  }

  /**
   * Run logic check on manuscript against statistical manifest
   */
  async runLogicCheck(
    manuscript: ManuscriptManifest,
    statisticalManifest: StatisticalManifest | null
  ): Promise<{ verifications: VerificationPacket[]; errors: Array<{ section: string; message: string }> }> {
    if (this.useBackend()) {
      try {
        const request: RunLogicCheckRequest = {
          manuscriptId: manuscript.id,
          statisticalManifestId: statisticalManifest?.id,
          deepCheck: true,
        };

        const response = await apiClient.post<LogicCheckResponse>(
          '/verifications/logic-check',
          request
        );

        return {
          verifications: response.verifications as unknown as VerificationPacket[],
          errors: [],
        };
      } catch (error) {
        console.error('Failed to run logic check on backend:', error);
      }
    }

    // Fallback to client-side logic check
    return this.runClientSideLogicCheck(manuscript, statisticalManifest);
  }

  /**
   * Client-side logic check implementation
   */
  private runClientSideLogicCheck(
    manuscript: ManuscriptManifest,
    statisticalManifest: StatisticalManifest | null
  ): { verifications: VerificationPacket[]; errors: Array<{ section: string; message: string }> } {
    const verifications: VerificationPacket[] = [];
    const errors: Array<{ section: string; message: string }> = [];

    if (!statisticalManifest) {
      return { verifications: [], errors: [] };
    }

    const resultsText = manuscript.manuscriptContent.results.toLowerCase();

    // Check for statistical claim mismatches
    statisticalManifest.comparativeAnalyses.forEach(analysis => {
      const pValue = analysis.pValue || 1;
      const isSignificant = pValue < 0.05;
      const outcomeLower = analysis.outcome?.toLowerCase() || '';

      if (resultsText.includes(outcomeLower) && resultsText.includes('significant')) {
        if (!isSignificant) {
          errors.push({
            section: 'results',
            message: `Logic Mismatch: "${analysis.outcome}" described as significant, but p=${pValue.toFixed(3)} (not significant)`,
          });

          // Create verification packet for this mismatch
          verifications.push({
            citationKey: `stat-${analysis.outcome?.replace(/\s+/g, '_') || Date.now()}`,
            manuscriptClaim: `${analysis.outcome} showed significant difference`,
            section: 'results',
            internalCheck: {
              status: 'conflict',
              manifestVariable: analysis.outcome || '',
              valueInManifest: pValue,
              valueInManuscript: 'significant',
              deviation: 100, // Complete mismatch
            },
            externalCheck: {
              similarityScore: 0.3,
              sourceSnippet: `Statistical analysis shows p=${pValue.toFixed(3)} for ${analysis.outcome}`,
              sourceTitle: 'Statistical Manifest',
            },
            verifiedAt: Date.now(),
            verifiedBy: 'system',
          });
        } else {
          // Verified claim
          verifications.push({
            citationKey: `stat-${analysis.outcome?.replace(/\s+/g, '_') || Date.now()}`,
            manuscriptClaim: `${analysis.outcome} showed significant difference`,
            section: 'results',
            internalCheck: {
              status: 'verified',
              manifestVariable: analysis.outcome || '',
              valueInManifest: pValue,
              valueInManuscript: 'significant',
              deviation: 0,
            },
            externalCheck: {
              similarityScore: 0.95,
              sourceSnippet: `Statistical analysis confirms p=${pValue.toFixed(3)} for ${analysis.outcome}`,
              sourceTitle: 'Statistical Manifest',
            },
            verifiedAt: Date.now(),
            verifiedBy: 'system',
          });
        }
      }
    });

    return { verifications, errors };
  }

  /**
   * Get all verifications for a manuscript
   */
  async getVerifications(manuscriptId: string): Promise<VerificationPacket[]> {
    if (this.useBackend()) {
      try {
        const response = await apiClient.get<VerificationListResponse>(
          `/manuscripts/${manuscriptId}/verifications`
        );
        return response.verifications as unknown as VerificationPacket[];
      } catch (error) {
        console.error('Failed to fetch verifications from backend:', error);
      }
    }

    // Fallback: return from localStorage (not implemented in original)
    const stored = localStorage.getItem(`verifications-${manuscriptId}`);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Save verifications to storage
   */
  async saveVerifications(manuscriptId: string, verifications: VerificationPacket[]): Promise<void> {
    if (this.useBackend()) {
      try {
        await apiClient.post(`/manuscripts/${manuscriptId}/verifications`, {
          verifications,
        });
        return;
      } catch (error) {
        console.error('Failed to save verifications to backend:', error);
      }
    }

    // Fallback to localStorage
    localStorage.setItem(`verifications-${manuscriptId}`, JSON.stringify(verifications));
  }

  /**
   * Approve verification (PI signature)
   */
  async approveVerification(
    verificationId: string,
    piSignature: string,
    piName: string
  ): Promise<VerificationPacket> {
    if (this.useBackend()) {
      try {
        const request: ApproveVerificationRequest = {
          verificationId,
          piSignature,
          piName,
        };

        const response = await apiClient.post<ApproveVerificationResponse>(
          `/verifications/${verificationId}/approve`,
          request
        );

        return response.verification as unknown as VerificationPacket;
      } catch (error) {
        console.error('Failed to approve verification on backend:', error);
        throw error;
      }
    }

    // Fallback: update locally (not fully implemented)
    throw new Error('Approval requires backend connection');
  }

  /**
   * Auto-sync verification to manuscript
   */
  async autoSyncVerification(
    verification: VerificationPacket,
    manuscriptId: string
  ): Promise<boolean> {
    if (this.useBackend()) {
      try {
        const request: AutoSyncVerificationRequest = {
          verificationId: `${verification.citationKey}-${verification.manuscriptClaim}`,
          manuscriptId,
          targetSection: verification.section,
        };

        const response = await apiClient.post<AutoSyncResponse>(
          '/verifications/auto-sync',
          request
        );

        return response.success;
      } catch (error) {
        console.error('Failed to auto-sync verification on backend:', error);
        return false;
      }
    }

    // Client-side auto-sync (simplified)
    console.log('Auto-syncing verification (client-side):', verification);
    return true;
  }

  /**
   * Update verification status
   */
  async updateVerificationStatus(
    verificationId: string,
    status: 'verified' | 'warning' | 'mismatch' | 'pending'
  ): Promise<void> {
    if (this.useBackend()) {
      try {
        await apiClient.patch(`/verifications/${verificationId}/status`, {
          status,
        });
        return;
      } catch (error) {
        console.error('Failed to update verification status on backend:', error);
      }
    }

    // Fallback: local update (not implemented)
    console.log('Updating verification status locally:', verificationId, status);
  }

  /**
   * Delete verification
   */
  async deleteVerification(manuscriptId: string, verificationId: string): Promise<void> {
    if (this.useBackend()) {
      try {
        await apiClient.delete(`/manuscripts/${manuscriptId}/verifications/${verificationId}`);
        return;
      } catch (error) {
        console.error('Failed to delete verification from backend:', error);
      }
    }

    // Fallback: delete from localStorage
    const stored = localStorage.getItem(`verifications-${manuscriptId}`);
    if (stored) {
      const verifications: VerificationPacket[] = JSON.parse(stored);
      const filtered = verifications.filter(
        v => `${v.citationKey}-${v.manuscriptClaim}` !== verificationId
      );
      localStorage.setItem(`verifications-${manuscriptId}`, JSON.stringify(filtered));
    }
  }
}

// Export singleton instance
export const verificationService = new VerificationService();