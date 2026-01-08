import { useState, useCallback } from 'react';

interface ProtocolMetadata {
  protocolTitle: string;
  protocolNumber: string;
  principalInvestigator: string;
  sponsor: string;
  studyPhase: string;
  therapeuticArea: string;
  estimatedEnrollment: string;
  studyDuration: string;
}

interface ProtocolContent {
  primaryObjective: string;
  secondaryObjectives: string;
  inclusionCriteria: string;
  exclusionCriteria: string;
  statisticalPlan: string;
}

export function useProtocolState() {
  const [protocolMetadata, setProtocolMetadata] = useState<ProtocolMetadata>({
    protocolTitle: '',
    protocolNumber: '',
    principalInvestigator: '',
    sponsor: '',
    studyPhase: '',
    therapeuticArea: '',
    estimatedEnrollment: '',
    studyDuration: '',
  });

  const [protocolContent, setProtocolContent] = useState<ProtocolContent>({
    primaryObjective: '',
    secondaryObjectives: '',
    inclusionCriteria: '',
    exclusionCriteria: '',
    statisticalPlan: '',
  });

  const updateMetadata = useCallback((field: keyof ProtocolMetadata, value: string) => {
    setProtocolMetadata(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateContent = useCallback((field: keyof ProtocolContent, value: string) => {
    setProtocolContent(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetProtocol = useCallback(() => {
    setProtocolMetadata({
      protocolTitle: '',
      protocolNumber: '',
      principalInvestigator: '',
      sponsor: '',
      studyPhase: '',
      therapeuticArea: '',
      estimatedEnrollment: '',
      studyDuration: '',
    });
    setProtocolContent({
      primaryObjective: '',
      secondaryObjectives: '',
      inclusionCriteria: '',
      exclusionCriteria: '',
      statisticalPlan: '',
    });
  }, []);

  const loadProtocol = useCallback((metadata: ProtocolMetadata, content: ProtocolContent) => {
    setProtocolMetadata(metadata);
    setProtocolContent(content);
  }, []);

  return {
    protocolMetadata,
    protocolContent,
    updateMetadata,
    updateContent,
    resetProtocol,
    loadProtocol,
  };
}
