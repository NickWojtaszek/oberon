// Custom Hook: Verification & Logic Check State (Refactored with Service Layer)

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { verificationService, type VerificationPacket } from '../services/verificationService';
import { queryKeys } from '../lib/queryClient';
import type { ManuscriptManifest } from '../types/manuscript';
import type { StatisticalManifest } from '../components/analytics-stats/types';

export function useVerificationState(manuscriptId?: string) {
  const queryClient = useQueryClient();
  const [logicErrors, setLogicErrors] = useState<Array<{ section: string; message: string }>>([]);

  // Fetch verifications for current manuscript
  const {
    data: verifications = [],
    isLoading: isLoadingVerifications,
    error: verificationsError,
  } = useQuery({
    queryKey: queryKeys.verifications.byManuscript(manuscriptId || ''),
    queryFn: () => verificationService.getVerifications(manuscriptId!),
    enabled: !!manuscriptId,
  });

  // Logic check mutation
  const logicCheckMutation = useMutation({
    mutationFn: ({
      manuscript,
      statisticalManifest,
    }: {
      manuscript: ManuscriptManifest;
      statisticalManifest: StatisticalManifest | null;
    }) => verificationService.runLogicCheck(manuscript, statisticalManifest),
    onSuccess: (result, variables) => {
      // Update local state with errors
      setLogicErrors(result.errors);

      // Update verifications in cache
      queryClient.setQueryData(
        queryKeys.verifications.byManuscript(variables.manuscript.id),
        result.verifications
      );

      // Save verifications
      if (result.verifications.length > 0) {
        verificationService.saveVerifications(variables.manuscript.id, result.verifications);
      }

      // Show alert
      if (result.errors.length === 0) {
        alert('✅ Logic Check Passed: All statistical claims match the data');
      }
    },
    onError: (error) => {
      console.error('Logic check failed:', error);
      alert('❌ Logic check failed. Please try again.');
    },
  });

  // Approve verification mutation
  const approveVerificationMutation = useMutation({
    mutationFn: ({
      verificationId,
      piSignature,
      piName,
    }: {
      verificationId: string;
      piSignature: string;
      piName: string;
    }) => verificationService.approveVerification(verificationId, piSignature, piName),
    onSuccess: (updated) => {
      if (manuscriptId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.verifications.byManuscript(manuscriptId),
        });
      }
    },
  });

  // Auto-sync verification mutation
  const autoSyncMutation = useMutation({
    mutationFn: ({
      verification,
      manuscriptId: targetManuscriptId,
    }: {
      verification: VerificationPacket;
      manuscriptId: string;
    }) => verificationService.autoSyncVerification(verification, targetManuscriptId),
    onSuccess: (success, variables) => {
      if (success) {
        alert('✅ Verification synced to manuscript');
        // Invalidate manuscript content
        queryClient.invalidateQueries({
          queryKey: queryKeys.manuscripts.detail(variables.manuscriptId),
        });
      } else {
        alert('❌ Failed to sync verification');
      }
    },
  });

  // Save verifications mutation
  const saveVerificationsMutation = useMutation({
    mutationFn: ({
      manuscriptId: targetManuscriptId,
      verifications: targetVerifications,
    }: {
      manuscriptId: string;
      verifications: VerificationPacket[];
    }) => verificationService.saveVerifications(targetManuscriptId, targetVerifications),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        queryKeys.verifications.byManuscript(variables.manuscriptId),
        variables.verifications
      );
    },
  });

  // Delete verification mutation
  const deleteVerificationMutation = useMutation({
    mutationFn: ({
      manuscriptId: targetManuscriptId,
      verificationId,
    }: {
      manuscriptId: string;
      verificationId: string;
    }) => verificationService.deleteVerification(targetManuscriptId, verificationId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.verifications.byManuscript(variables.manuscriptId),
      });
    },
  });

  // Handler functions
  const handleLogicCheck = (
    manuscript: ManuscriptManifest | undefined,
    statisticalManifest: StatisticalManifest | null,
    aiMode?: 'manual' | 'co-pilot' | 'autopilot'
  ) => {
    if (!manuscript || !statisticalManifest) {
      alert('No statistical manifest available for logic checking');
      return;
    }

    // Prevent logic check in manual mode
    if (aiMode === 'manual') {
      alert('⚠️ Logic Check is disabled in Manual mode. Switch to Co-Pilot or Autopilot mode to enable AI supervision.');
      return;
    }

    logicCheckMutation.mutate({ manuscript, statisticalManifest });
  };

  const handleUpdateVerification = (verification: VerificationPacket) => {
    if (!manuscriptId) return;

    // Get current verifications
    const currentVerifications = queryClient.getQueryData<VerificationPacket[]>(
      queryKeys.verifications.byManuscript(manuscriptId)
    ) || [];

    // Update or add verification
    const existingIndex = currentVerifications.findIndex(
      v =>
        v.citationKey === verification.citationKey &&
        v.manuscriptClaim === verification.manuscriptClaim
    );

    let updatedVerifications: VerificationPacket[];
    if (existingIndex >= 0) {
      updatedVerifications = [...currentVerifications];
      updatedVerifications[existingIndex] = verification;
    } else {
      updatedVerifications = [...currentVerifications, verification];
    }

    // Save to backend/localStorage
    saveVerificationsMutation.mutate({
      manuscriptId,
      verifications: updatedVerifications,
    });
  };

  const clearVerifications = () => {
    setLogicErrors([]);
    if (manuscriptId) {
      queryClient.setQueryData(queryKeys.verifications.byManuscript(manuscriptId), []);
      saveVerificationsMutation.mutate({
        manuscriptId,
        verifications: [],
      });
    }
  };

  const getClaimConflicts = () => {
    return verifications.filter(v => v.internalCheck?.status === 'conflict').length;
  };

  const handleApproveVerification = (verificationId: string, piSignature: string, piName: string) => {
    approveVerificationMutation.mutate({ verificationId, piSignature, piName });
  };

  const handleAutoSync = (verification: VerificationPacket) => {
    if (!manuscriptId) return;
    autoSyncMutation.mutate({ verification, manuscriptId });
  };

  const handleDeleteVerification = (verificationId: string) => {
    if (!manuscriptId) return;
    deleteVerificationMutation.mutate({ manuscriptId, verificationId });
  };

  return {
    verifications,
    logicErrors,
    isCheckingLogic: logicCheckMutation.isPending,
    isLoadingVerifications,
    error: verificationsError,
    handleLogicCheck,
    handleUpdateVerification,
    clearVerifications,
    getClaimConflicts,
    handleApproveVerification,
    handleAutoSync,
    handleDeleteVerification,
  };
}