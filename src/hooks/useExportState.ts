// Custom Hook: Export & Verification Appendix State

import { useState } from 'react';
import { 
  generateVerificationAppendix, 
  exportManuscriptDocx, 
  exportAppendixPdf, 
  exportManifestCsv 
} from '../utils/verificationAppendixService';
import type { ManuscriptManifest } from '../types/manuscript';
import type { StatisticalManifest } from '../components/analytics-stats/types';
import type { VerificationPacket } from '../types/evidenceVerification';
import type { VerificationAppendix, ExportOptions, DigitalSignOff } from '../types/verificationAppendix';

export function useExportState() {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [verificationAppendix, setVerificationAppendix] = useState<VerificationAppendix | null>(null);

  // Prepare export (generate verification appendix)
  const handlePrepareExport = (
    manuscript: ManuscriptManifest | undefined,
    statisticalManifest: StatisticalManifest | null,
    verifications: VerificationPacket[],
    userName: string
  ) => {
    if (!manuscript) return;

    // Generate Verification Appendix
    const appendix = generateVerificationAppendix(
      manuscript,
      statisticalManifest,
      verifications,
      userName
    );

    setVerificationAppendix(appendix);
    setShowExportDialog(true);
  };

  // Export files
  const handleExport = (
    manuscript: ManuscriptManifest | undefined,
    statisticalManifest: StatisticalManifest | null,
    options: ExportOptions,
    signOff?: DigitalSignOff
  ) => {
    if (!manuscript || !verificationAppendix) return;

    const files: Array<{ filename: string; blob: Blob }> = [];

    // Add sign-off to appendix if provided
    const finalAppendix = signOff ? { ...verificationAppendix, signOff } : verificationAppendix;

    // Export manuscript
    if (options.includeManuscript) {
      const docxBlob = exportManuscriptDocx(manuscript);
      files.push({
        filename: `${manuscript.projectMeta.studyTitle.replace(/[^a-zA-Z0-9]/g, '_')}_manuscript.docx`,
        blob: docxBlob
      });
    }

    // Export appendix
    if (options.includeAppendix) {
      const pdfBlob = exportAppendixPdf(finalAppendix);
      files.push({
        filename: `${manuscript.projectMeta.studyTitle.replace(/[^a-zA-Z0-9]/g, '_')}_verification_appendix.pdf`,
        blob: pdfBlob
      });
    }

    // Export raw data
    if (options.includeRawData && statisticalManifest) {
      const csvBlob = exportManifestCsv(statisticalManifest);
      files.push({
        filename: `${manuscript.projectMeta.studyTitle.replace(/[^a-zA-Z0-9]/g, '_')}_raw_data.csv`,
        blob: csvBlob
      });
    }

    // Trigger downloads
    files.forEach(file => {
      const url = URL.createObjectURL(file.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    alert(`✅ Exported ${files.length} file(s) successfully`);
    setShowExportDialog(false);
  };

  // Close export dialog
  const handleCloseExport = () => {
    setShowExportDialog(false);
  };

  return {
    showExportDialog,
    verificationAppendix,
    handlePrepareExport,
    handleExport,
    handleCloseExport
  };
}
