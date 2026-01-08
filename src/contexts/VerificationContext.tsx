// Verification Context - Shared state for Logic Audit & Verification (Phase 5)

import { createContext, useContext, useState, ReactNode } from 'react';
import type { VerificationPacket } from '../types/evidenceVerification';

interface VerificationContextValue {
  // Active verification being viewed
  activeVerification: VerificationPacket | null;
  setActiveVerification: (verification: VerificationPacket | null) => void;
  
  // All verifications for current manuscript
  verifications: VerificationPacket[];
  setVerifications: (verifications: VerificationPacket[]) => void;
  
  // Add or update verification
  updateVerification: (verification: VerificationPacket) => void;
  
  // Remove verification
  removeVerification: (verificationId: string) => void;
  
  // Get verifications by status
  getVerifiedClaims: () => VerificationPacket[];
  getWarningClaims: () => VerificationPacket[];
  getMismatchClaims: () => VerificationPacket[];
  
  // Sidebar visibility (for Phase 5)
  isAuditSidebarOpen: boolean;
  setIsAuditSidebarOpen: (open: boolean) => void;
}

const VerificationContext = createContext<VerificationContextValue | undefined>(undefined);

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [activeVerification, setActiveVerification] = useState<VerificationPacket | null>(null);
  const [verifications, setVerifications] = useState<VerificationPacket[]>([]);
  const [isAuditSidebarOpen, setIsAuditSidebarOpen] = useState(false);

  const updateVerification = (verification: VerificationPacket) => {
    setVerifications(prev => {
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

  const removeVerification = (verificationId: string) => {
    setVerifications(prev => prev.filter(v => 
      `${v.citationKey}-${v.manuscriptClaim}` !== verificationId
    ));
  };

  const getVerifiedClaims = () => {
    return verifications.filter(v => 
      v.internalCheck?.status === 'verified' && 
      v.externalCheck.similarityScore >= 0.85
    );
  };

  const getWarningClaims = () => {
    return verifications.filter(v => 
      v.internalCheck?.status === 'verified' && 
      v.externalCheck.similarityScore >= 0.60 && 
      v.externalCheck.similarityScore < 0.85
    );
  };

  const getMismatchClaims = () => {
    return verifications.filter(v => 
      v.internalCheck?.status === 'conflict' || 
      v.externalCheck.similarityScore < 0.60
    );
  };

  const value: VerificationContextValue = {
    activeVerification,
    setActiveVerification,
    verifications,
    setVerifications,
    updateVerification,
    removeVerification,
    getVerifiedClaims,
    getWarningClaims,
    getMismatchClaims,
    isAuditSidebarOpen,
    setIsAuditSidebarOpen
  };

  return (
    <VerificationContext.Provider value={value}>
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
}
