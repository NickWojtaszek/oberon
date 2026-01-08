// Custom Hook: Export & Verification Appendix State (Refactored with Service Layer)

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { exportService, type VerificationAppendix, type ExportOptions } from '../services/exportService';
import { type VerificationPacket } from '../services/verificationService';
import type { ManuscriptManifest } from '../types/manuscript';
import type { StatisticalManifest } from '../components/analytics-stats/types';

// Re-export for compatibility
export type { VerificationAppendix, ExportOptions };

export interface DigitalSignOff {
  signature: string;
  name: string;
  role: string;
  timestamp: number;
  ipAddress?: string;
}

export function useExportState() {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [verificationAppendix, setVerificationAppendix] = useState<VerificationAppendix | null>(null);

  // Generate verification appendix mutation
  const generateAppendixMutation = useMutation({
    mutationFn: ({
      manuscriptId,
      manuscriptTitle,
      verifications,
    }: {
      manuscriptId: string;
      manuscriptTitle: string;
      verifications: VerificationPacket[];
    }) => exportService.generateVerificationAppendix(manuscriptId, manuscriptTitle, verifications),
    onSuccess: (appendix) => {
      setVerificationAppendix(appendix);
      setShowExportDialog(true);
    },
    onError: (error) => {
      console.error('Failed to generate appendix:', error);
      alert('❌ Failed to generate verification appendix');
    },
  });

  // Export DOCX mutation
  const exportDocxMutation = useMutation({
    mutationFn: ({ manuscriptId, options }: { manuscriptId: string; options: ExportOptions }) =>
      exportService.exportAsDocx(manuscriptId, options),
    onSuccess: (blob, variables) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `manuscript-${variables.manuscriptId}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('✅ Manuscript exported successfully');
    },
    onError: (error) => {
      console.error('Export failed:', error);
      alert('❌ Export requires backend connection');
    },
  });

  // Export PDF mutation
  const exportPdfMutation = useMutation({
    mutationFn: ({ manuscriptId, options }: { manuscriptId: string; options: ExportOptions }) =>
      exportService.exportAsPdf(manuscriptId, options),
    onSuccess: (blob, variables) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `manuscript-${variables.manuscriptId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('✅ Manuscript exported successfully');
    },
    onError: (error) => {
      console.error('Export failed:', error);
      alert('❌ Export requires backend connection');
    },
  });

  // Export complete package mutation
  const exportPackageMutation = useMutation({
    mutationFn: ({ manuscriptId, options }: { manuscriptId: string; options: ExportOptions }) =>
      exportService.exportCompletePackage(manuscriptId, options),
    onSuccess: (blob, variables) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `manuscript-package-${variables.manuscriptId}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('✅ Complete package exported successfully');
    },
    onError: (error) => {
      console.error('Export failed:', error);
      alert('❌ Package export requires backend connection');
    },
  });

  // Handler functions
  const handlePrepareExport = (
    manuscript: ManuscriptManifest | undefined,
    statisticalManifest: StatisticalManifest | null,
    verifications: VerificationPacket[],
    userName: string
  ) => {
    if (!manuscript) return;

    generateAppendixMutation.mutate({
      manuscriptId: manuscript.id,
      manuscriptTitle: manuscript.projectMeta.studyTitle,
      verifications,
    });
  };

  const handleExport = (
    manuscript: ManuscriptManifest | undefined,
    statisticalManifest: StatisticalManifest | null,
    options: ExportOptions,
    signOff?: DigitalSignOff
  ) => {
    if (!manuscript || !verificationAppendix) return;

    // Add sign-off to appendix if provided
    if (signOff && verificationAppendix) {
      const updatedAppendix = {
        ...verificationAppendix,
        piApproval: {
          signature: signOff.signature,
          name: signOff.name,
          approvedAt: signOff.timestamp,
        },
      };
      setVerificationAppendix(updatedAppendix);
    }

    // Export based on options
    if (options.format === 'docx') {
      exportDocxMutation.mutate({ manuscriptId: manuscript.id, options });
    } else if (options.format === 'pdf') {
      exportPdfMutation.mutate({ manuscriptId: manuscript.id, options });
    }

    // Export complete package if requested
    if (options.includeVerificationAppendix && options.includeSourceLibrary) {
      exportPackageMutation.mutate({ manuscriptId: manuscript.id, options });
    }

    setShowExportDialog(false);
  };

  const handleDownloadAppendixCsv = () => {
    if (!verificationAppendix) return;
    exportService.downloadAppendixCsv(verificationAppendix);
  };

  const handleDownloadAppendixPdf = async () => {
    if (!verificationAppendix) return;
    
    try {
      await exportService.downloadAppendixPdf(verificationAppendix);
      alert('✅ Appendix PDF downloaded successfully');
    } catch (error) {
      console.error('Failed to download appendix PDF:', error);
      alert('❌ PDF export requires backend connection');
    }
  };

  const handleCloseExport = () => {
    setShowExportDialog(false);
  };

  return {
    showExportDialog,
    verificationAppendix,
    isGeneratingAppendix: generateAppendixMutation.isPending,
    isExporting: exportDocxMutation.isPending || exportPdfMutation.isPending || exportPackageMutation.isPending,
    handlePrepareExport,
    handleExport,
    handleDownloadAppendixCsv,
    handleDownloadAppendixPdf,
    handleCloseExport,
  };
}
