// Custom Hook: Verification & Logic Check State

import { useState } from 'react';
import type { ManuscriptManifest } from '../types/manuscript';
import type { StatisticalManifest } from '../components/analytics-stats/types';
import type { VerificationPacket } from '../types/evidenceVerification';

export function useVerificationState() {
  const [verifications, setVerifications] = useState<VerificationPacket[]>([]);
  const [logicErrors, setLogicErrors] = useState<Array<{ section: string; message: string }>>([]);
  const [isCheckingLogic, setIsCheckingLogic] = useState(false);

  // Run logic check against statistical manifest
  const handleLogicCheck = (
    manuscript: ManuscriptManifest | undefined,
    statisticalManifest: StatisticalManifest | null
  ) => {
    if (!manuscript || !statisticalManifest) {
      alert('No statistical manifest available for logic checking');
      return;
    }

    setIsCheckingLogic(true);
    const errors: Array<{ section: string; message: string }> = [];

    // Check results section for statistical claim mismatches
    const resultsText = manuscript.manuscriptContent.results.toLowerCase();

    // Check for "significant" claims that don't match p-values
    statisticalManifest.comparativeAnalyses.forEach(analysis => {
      const pValue = analysis.pValue || 1;
      const isSignificant = pValue < 0.05;

      if (resultsText.includes(analysis.outcome?.toLowerCase() || '') && resultsText.includes('significant')) {
        if (!isSignificant) {
          errors.push({
            section: 'results',
            message: `Logic Mismatch: "${analysis.outcome}" described as significant, but p=${pValue.toFixed(3)} (not significant)`
          });
        }
      }
    });

    setLogicErrors(errors);
    setIsCheckingLogic(false);

    if (errors.length === 0) {
      alert('✅ Logic Check Passed: All statistical claims match the data');
    }
  };

  // Add verification packet
  const handleUpdateVerification = (verification: VerificationPacket) => {
    setVerifications(prev => {
      // Replace existing verification for same citation/claim or add new
      const existingIndex = prev.findIndex(
        v => v.citationKey === verification.citationKey && 
             v.manuscriptClaim === verification.manuscriptClaim
      );
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = verification;
        return updated;
      }
      
      return [...prev, verification];
    });
  };

  // Clear all verifications
  const clearVerifications = () => {
    setVerifications([]);
    setLogicErrors([]);
  };

  // Get claim conflicts count
  const getClaimConflicts = () => {
    return verifications.filter(v => v.internalCheck?.status === 'conflict').length;
  };

  return {
    verifications,
    logicErrors,
    isCheckingLogic,
    handleLogicCheck,
    handleUpdateVerification,
    clearVerifications,
    getClaimConflicts
  };
}
