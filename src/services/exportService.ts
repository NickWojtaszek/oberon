// Export Service - Data access layer for manuscript exports
// Handles verification appendix, DOCX/PDF exports, and export packages

import { apiClient } from '../lib/apiClient';
import { config } from '../config/environment';
import type { VerificationPacket } from './verificationService';

export interface VerificationAppendix {
  manuscriptId: string;
  manuscriptTitle: string;
  generatedAt: number;
  verifications: VerificationPacket[];
  summary: {
    totalClaims: number;
    verified: number;
    warnings: number;
    mismatches: number;
    approvalRate: number;
  };
  piApproval?: {
    signature: string;
    name: string;
    approvedAt: number;
  };
}

export interface ExportOptions {
  format: 'docx' | 'pdf' | 'markdown';
  includeVerificationAppendix: boolean;
  includeSourceLibrary: boolean;
  includeStatisticalManifest: boolean;
}

class ExportService {
  private useBackend(): boolean {
    return config.api.useBackend && apiClient.isBackendEnabled();
  }

  /**
   * Generate verification appendix for PI approval
   */
  async generateVerificationAppendix(
    manuscriptId: string,
    manuscriptTitle: string,
    verifications: VerificationPacket[]
  ): Promise<VerificationAppendix> {
    if (this.useBackend()) {
      try {
        const response = await apiClient.post<{ appendix: VerificationAppendix }>(
          `/exports/verification-appendix`,
          { manuscriptId, manuscriptTitle, verifications }
        );
        return response.appendix;
      } catch (error) {
        console.error('Failed to generate appendix on backend:', error);
      }
    }

    // Fallback: generate client-side
    return this.generateClientSideAppendix(manuscriptId, manuscriptTitle, verifications);
  }

  /**
   * Client-side verification appendix generation
   */
  private generateClientSideAppendix(
    manuscriptId: string,
    manuscriptTitle: string,
    verifications: VerificationPacket[]
  ): VerificationAppendix {
    const verified = verifications.filter(
      v => v.internalCheck?.status === 'verified' && v.externalCheck.similarityScore >= 0.85
    );
    const warnings = verifications.filter(
      v =>
        v.internalCheck?.status === 'verified' &&
        v.externalCheck.similarityScore >= 0.60 &&
        v.externalCheck.similarityScore < 0.85
    );
    const mismatches = verifications.filter(
      v => v.internalCheck?.status === 'conflict' || v.externalCheck.similarityScore < 0.60
    );

    return {
      manuscriptId,
      manuscriptTitle,
      generatedAt: Date.now(),
      verifications,
      summary: {
        totalClaims: verifications.length,
        verified: verified.length,
        warnings: warnings.length,
        mismatches: mismatches.length,
        approvalRate: verifications.length > 0 ? (verified.length / verifications.length) * 100 : 0,
      },
    };
  }

  /**
   * Export manuscript as DOCX
   */
  async exportAsDocx(manuscriptId: string, options: ExportOptions): Promise<Blob> {
    if (this.useBackend()) {
      try {
        return await apiClient.downloadFile(`/exports/manuscripts/${manuscriptId}/docx`);
      } catch (error) {
        console.error('Failed to export DOCX from backend:', error);
        throw error;
      }
    }

    // Fallback: generate mock blob
    throw new Error('DOCX export requires backend connection');
  }

  /**
   * Export manuscript as PDF
   */
  async exportAsPdf(manuscriptId: string, options: ExportOptions): Promise<Blob> {
    if (this.useBackend()) {
      try {
        return await apiClient.downloadFile(`/exports/manuscripts/${manuscriptId}/pdf`);
      } catch (error) {
        console.error('Failed to export PDF from backend:', error);
        throw error;
      }
    }

    // Fallback: generate mock blob
    throw new Error('PDF export requires backend connection');
  }

  /**
   * Export complete package (DOCX + Appendix + Sources)
   */
  async exportCompletePackage(manuscriptId: string, options: ExportOptions): Promise<Blob> {
    if (this.useBackend()) {
      try {
        return await apiClient.downloadFile(
          `/exports/manuscripts/${manuscriptId}/package`
        );
      } catch (error) {
        console.error('Failed to export package from backend:', error);
        throw error;
      }
    }

    // Fallback
    throw new Error('Package export requires backend connection');
  }

  /**
   * Download verification appendix as CSV
   */
  async downloadAppendixCsv(appendix: VerificationAppendix): Promise<void> {
    const csv = this.convertAppendixToCsv(appendix);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verification-appendix-${appendix.manuscriptId}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Convert appendix to CSV format
   */
  private convertAppendixToCsv(appendix: VerificationAppendix): string {
    const headers = [
      'Citation Key',
      'Manuscript Claim',
      'Section',
      'Internal Status',
      'Similarity Score',
      'Source Snippet',
      'Source Title',
      'Verified By',
      'Verified At',
    ];

    const rows = appendix.verifications.map(v => [
      v.citationKey,
      `"${v.manuscriptClaim.replace(/"/g, '""')}"`,
      v.section,
      v.internalCheck?.status || 'N/A',
      (v.externalCheck.similarityScore * 100).toFixed(1) + '%',
      `"${v.externalCheck.sourceSnippet.replace(/"/g, '""')}"`,
      `"${v.externalCheck.sourceTitle.replace(/"/g, '""')}"`,
      v.verifiedBy || 'N/A',
      new Date(v.verifiedAt).toISOString(),
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  /**
   * Download verification appendix as PDF (requires backend)
   */
  async downloadAppendixPdf(appendix: VerificationAppendix): Promise<void> {
    if (this.useBackend()) {
      try {
        const blob = await apiClient.post<Blob>(
          '/exports/appendix-pdf',
          appendix
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `verification-appendix-${appendix.manuscriptId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to download appendix PDF from backend:', error);
        throw error;
      }
    } else {
      throw new Error('PDF export requires backend connection');
    }
  }
}

// Export singleton instance
export const exportService = new ExportService();
