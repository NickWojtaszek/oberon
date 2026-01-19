/**
 * SPECTRA Framework Module
 * Study Protocol Elements for Clinical Trial Research Analytics
 *
 * Exports:
 * - Types for the complete SPECTRA context
 * - SPECTRAExtractor service for building context from protocol data
 * - Validation utilities
 */

// Types
export type {
  SPECTRAContext,
  SPECTRAExtractionResult,
  SPECTRAValidationResult,
  SPECTRAValidationIssue,
  StudyDesignContext,
  PopulationContext,
  EndpointsContext,
  EndpointDefinition,
  CompositeEndpointDefinition,
  ComparatorContext,
  TreatmentArm,
  TreatmentContext,
  InterventionDefinition,
  RiskFactorsContext,
  ConfounderDefinition,
  EffectModifierDefinition,
  SafetySignalDefinition,
  AnalysisParametersContext,
  AnalysisPopulation,
  RegulatoryContext,
  LiteratureContext,
} from './types';

// Default values
export { DEFAULT_SPECTRA_CONTEXT } from './types';

// Extractor service
export { SPECTRAExtractor, spectraExtractor } from './SPECTRAExtractor';
