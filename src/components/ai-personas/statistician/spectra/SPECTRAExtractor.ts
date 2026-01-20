/**
 * SPECTRA Extractor Service
 * Extracts comprehensive SPECTRA context from protocol data
 *
 * Sources:
 * - PICO fields (from wizard or manual entry)
 * - Protocol metadata
 * - Schema blocks (variables, endpoints, types)
 * - Foundational papers
 * - Study methodology configuration
 */

import type { SavedProtocol, SchemaBlock, ProtocolVersion } from '../../../protocol-workbench/types';
import type { StudyMethodology } from '../../../../contexts/ProtocolContext';
import type { FoundationalPaperExtraction } from '../../../../services/geminiService';
import type {
  SPECTRAContext,
  SPECTRAExtractionResult,
  SPECTRAValidationResult,
  SPECTRAValidationIssue,
  StudyDesignContext,
  PopulationContext,
  EndpointsContext,
  EndpointDefinition,
  ComparatorContext,
  TreatmentContext,
  RiskFactorsContext,
  AnalysisParametersContext,
  LiteratureContext,
  DEFAULT_SPECTRA_CONTEXT,
} from './types';

import {
  detectClinicalDomain,
  matchVariableToEndpoint,
  matchVariableToRiskFactor,
} from '../clinicalBenchmarkLibrary';

// =============================================================================
// SPECTRA EXTRACTOR CLASS
// =============================================================================

/**
 * Flatten nested schema blocks to get all fields including those in sections
 */
function flattenSchemaBlocks(blocks: SchemaBlock[]): SchemaBlock[] {
  const result: SchemaBlock[] = [];

  const processBlock = (block: SchemaBlock) => {
    // Add non-section blocks to result
    if (block.dataType !== 'Section') {
      result.push(block);
    }
    // Recurse into children
    if (block.children && block.children.length > 0) {
      block.children.forEach(processBlock);
    }
  };

  blocks.forEach(processBlock);
  return result;
}

export class SPECTRAExtractor {
  /**
   * Extract complete SPECTRA context from protocol and related data
   */
  extract(
    protocol: SavedProtocol,
    version: ProtocolVersion,
    methodology?: StudyMethodology,
    foundationalPapers?: FoundationalPaperExtraction[]
  ): SPECTRAExtractionResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: Array<{ field: string; message: string; source?: string }> = [];

    try {
      // Extract PICO data from multiple sources
      const picoData = this.extractPICO(methodology);

      // Flatten schema blocks to include nested fields inside sections
      const flattenedBlocks = flattenSchemaBlocks(version.schemaBlocks || []);

      // Extract each SPECTRA component (using flattened blocks for proper variable extraction)
      const study = this.extractStudyContext(methodology, version, errors, warnings);
      const population = this.extractPopulationContext(picoData, flattenedBlocks, errors, warnings);
      const endpoints = this.extractEndpointsContext(picoData, flattenedBlocks, errors, warnings);
      const comparator = this.extractComparatorContext(picoData, methodology, errors, warnings);
      const treatment = this.extractTreatmentContext(picoData, methodology, errors, warnings);
      const riskFactors = this.extractRiskFactorsContext(picoData, flattenedBlocks, methodology, errors, warnings);
      const analysisParameters = this.extractAnalysisParametersContext(version, methodology, errors, warnings);

      // Extract literature context if foundational papers available
      const literatureContext = foundationalPapers && foundationalPapers.length > 0
        ? this.extractLiteratureContext(foundationalPapers, warnings)
        : undefined;

      // Calculate overall confidence
      const componentConfidences = [
        study.confidence,
        population.confidence,
        endpoints.confidence,
        comparator.confidence,
        treatment.confidence,
        riskFactors.confidence,
        analysisParameters.confidence,
      ];
      const overallConfidence = componentConfidences.reduce((a, b) => a + b, 0) / componentConfidences.length;

      // Generate suggestions for missing or incomplete data
      this.generateSuggestions(
        { study, population, endpoints, comparator, treatment, riskFactors, analysisParameters },
        suggestions
      );

      const context: SPECTRAContext = {
        extractedAt: new Date().toISOString(),
        extractedFrom: this.determineExtractionSource(methodology, picoData),
        confidence: overallConfidence,
        version: '1.0',
        study,
        population,
        endpoints,
        comparator,
        treatment,
        riskFactors,
        analysisParameters,
        literatureContext,
      };

      return {
        success: errors.length === 0,
        context,
        errors,
        warnings,
        suggestions,
      };
    } catch (error) {
      return {
        success: false,
        context: null,
        errors: [`Extraction failed: ${String(error)}`],
        warnings,
        suggestions,
      };
    }
  }

  /**
   * Validate SPECTRA context completeness
   */
  validate(context: SPECTRAContext): SPECTRAValidationResult {
    const issues: SPECTRAValidationIssue[] = [];

    // Validate each component
    const studyScore = this.validateStudyContext(context.study, issues);
    const populationScore = this.validatePopulationContext(context.population, issues);
    const endpointsScore = this.validateEndpointsContext(context.endpoints, issues);
    const comparatorScore = this.validateComparatorContext(context.comparator, issues);
    const treatmentScore = this.validateTreatmentContext(context.treatment, issues);
    const riskFactorsScore = this.validateRiskFactorsContext(context.riskFactors, issues);
    const analysisScore = this.validateAnalysisParametersContext(context.analysisParameters, issues);

    const overall = Math.round(
      (studyScore + populationScore + endpointsScore + comparatorScore +
       treatmentScore + riskFactorsScore + analysisScore) / 7
    );

    return {
      isValid: issues.filter(i => i.severity === 'error').length === 0,
      completeness: {
        overall,
        byComponent: {
          study: studyScore,
          population: populationScore,
          endpoints: endpointsScore,
          comparator: comparatorScore,
          treatment: treatmentScore,
          riskFactors: riskFactorsScore,
          analysisParameters: analysisScore,
        },
      },
      issues,
    };
  }

  // ===========================================================================
  // PICO EXTRACTION
  // ===========================================================================

  private extractPICO(methodology?: StudyMethodology): {
    population?: string;
    intervention?: string;
    comparison?: string;
    outcome?: string;
    timeframe?: string;
  } | null {
    if (!methodology) return null;

    // Try picoFields first (new format from wizard)
    const picoFields = (methodology as any).picoFields;
    if (picoFields) {
      return {
        population: picoFields.population,
        intervention: picoFields.intervention,
        comparison: picoFields.comparison,
        outcome: picoFields.outcome,
        timeframe: picoFields.timeframe,
      };
    }

    // Try hypothesis.picoFramework (legacy format)
    if (methodology.hypothesis?.picoFramework) {
      return methodology.hypothesis.picoFramework;
    }

    return null;
  }

  private determineExtractionSource(
    methodology?: StudyMethodology,
    picoData?: any
  ): 'protocol' | 'pico' | 'schema' | 'manual' {
    if (picoData) return 'pico';
    if (methodology) return 'protocol';
    return 'schema';
  }

  // ===========================================================================
  // S - STUDY DESIGN EXTRACTION
  // ===========================================================================

  private extractStudyContext(
    methodology: StudyMethodology | undefined,
    version: ProtocolVersion,
    errors: string[],
    warnings: string[]
  ): StudyDesignContext {
    const sources: string[] = [];
    let confidence = 0.3; // Base confidence

    // Extract design type
    let designType = methodology?.studyType || 'observational';
    if (methodology?.studyType) {
      sources.push('studyMethodology.studyType');
      confidence += 0.2;
    }

    // Map study type to standardized format
    const designTypeMap: Record<string, string> = {
      'rct': 'rct',
      'observational': 'prospective-cohort',
      'cohort': 'prospective-cohort',
      'case-control': 'case-control',
      'registry': 'registry',
      'other': 'observational',
    };
    designType = designTypeMap[designType] || designType;

    // Extract RCT-specific config if available
    const rctConfig = (methodology as any)?.rctConfig;
    let randomization: StudyDesignContext['randomization'];
    let blinding: StudyDesignContext['blinding'];

    if (rctConfig) {
      sources.push('studyMethodology.rctConfig');
      confidence += 0.2;

      randomization = {
        method: rctConfig.randomizationMethod || 'block',
        blockSize: rctConfig.blockSize,
        stratificationFactors: rctConfig.stratificationFactors,
        allocationRatio: rctConfig.allocationRatio || '1:1',
      };

      blinding = {
        level: rctConfig.blindingLevel || 'double-blind',
        whoBlinded: rctConfig.whoBlinded,
      };
    }

    // Extract phase from metadata
    const phase = version.metadata?.studyPhase as StudyDesignContext['phase'];
    if (phase) {
      sources.push('metadata.studyPhase');
      confidence += 0.1;
    }

    // Clamp confidence
    confidence = Math.min(confidence, 0.95);

    if (confidence < 0.5) {
      warnings.push('Study design information is incomplete. Consider specifying study type and design details.');
    }

    return {
      designType: designType as any,
      phase,
      randomization,
      blinding,
      confidence,
      sources,
    };
  }

  // ===========================================================================
  // P - POPULATION EXTRACTION
  // ===========================================================================

  private extractPopulationContext(
    picoData: { population?: string; intervention?: string; comparison?: string; outcome?: string; timeframe?: string } | null,
    schemaBlocks: SchemaBlock[],
    errors: string[],
    warnings: string[]
  ): PopulationContext {
    const sources: string[] = [];
    let confidence = 0.3;

    // Extract from PICO
    let targetPopulation = picoData?.population || '';
    if (targetPopulation) {
      sources.push('pico.population');
      confidence += 0.3;
    }

    // Look for demographic variables in schema
    const demographicBlocks = schemaBlocks.filter(b =>
      b.variable?.category === 'Demographics' ||
      ['age', 'sex', 'gender', 'race', 'ethnicity'].some(term =>
        b.variable?.name?.toLowerCase().includes(term) ||
        b.customName?.toLowerCase().includes(term)
      )
    );

    if (demographicBlocks.length > 0) {
      sources.push('schema.demographics');
      confidence += 0.2;
    }

    // Extract stratification factors from schema
    const stratificationFactors = schemaBlocks
      .filter(b => b.role === 'Predictor' && (b.dataType === 'Categorical' || b.dataType === 'Boolean'))
      .slice(0, 5) // Limit to top 5
      .map(b => ({
        name: b.customName || b.variable?.name || b.id,
        categories: b.options || [],
        rationale: 'Identified as potential stratification factor based on schema role',
      }));

    confidence = Math.min(confidence, 0.95);

    if (!targetPopulation) {
      warnings.push('Population description not found. Specify target population in PICO framework.');
    }

    return {
      targetPopulation,
      stratificationFactors: stratificationFactors.length > 0 ? stratificationFactors : undefined,
      confidence,
      sources,
    };
  }

  // ===========================================================================
  // E - ENDPOINTS EXTRACTION
  // ===========================================================================

  private extractEndpointsContext(
    picoData: { population?: string; intervention?: string; comparison?: string; outcome?: string; timeframe?: string } | null,
    schemaBlocks: SchemaBlock[],
    errors: string[],
    warnings: string[]
  ): EndpointsContext {
    const sources: string[] = [];
    let confidence = 0.3;

    const primary: EndpointDefinition[] = [];
    const secondary: EndpointDefinition[] = [];
    const exploratory: EndpointDefinition[] = [];
    const safety: EndpointDefinition[] = [];

    // Extract from PICO outcome
    if (picoData?.outcome) {
      sources.push('pico.outcome');
      confidence += 0.2;
    }

    // Extract from schema blocks with endpoint tiers
    const outcomeBlocks = schemaBlocks.filter(b => b.role === 'Outcome');

    for (const block of outcomeBlocks) {
      const endpoint = this.schemaBlockToEndpoint(block);

      switch (block.endpointTier) {
        case 'primary':
          primary.push(endpoint);
          break;
        case 'secondary':
          secondary.push(endpoint);
          break;
        case 'exploratory':
          exploratory.push(endpoint);
          break;
        default:
          // Check if it's a safety variable
          if (block.variable?.category === 'Adverse Events' || block.variable?.category === 'Safety') {
            safety.push(endpoint);
          } else {
            exploratory.push(endpoint);
          }
      }
    }

    // If no primary endpoints found but PICO outcome exists, create one
    if (primary.length === 0 && picoData?.outcome) {
      primary.push({
        id: 'pico-primary',
        name: picoData.outcome,
        type: 'continuous', // Default, could be improved with NLP
        direction: 'higher-better',
        confidence: 0.5,
      });
    }

    if (outcomeBlocks.length > 0) {
      sources.push('schema.outcomes');
      confidence += 0.3;
    }

    confidence = Math.min(confidence, 0.95);

    if (primary.length === 0) {
      warnings.push('No primary endpoint identified. Define at least one primary endpoint in schema.');
    }

    return {
      primary,
      secondary,
      exploratory,
      safety,
      confidence,
      sources,
    };
  }

  private schemaBlockToEndpoint(block: SchemaBlock): EndpointDefinition {
    const typeMap: Record<string, EndpointDefinition['type']> = {
      'Continuous': 'continuous',
      'Categorical': 'categorical',
      'Boolean': 'binary',
      'Date': 'time-to-event',
    };

    return {
      id: block.id,
      name: block.customName || block.variable?.name || block.id,
      type: typeMap[block.dataType] || 'continuous',
      unit: block.unit,
      direction: 'higher-better', // Default
      recommendedAnalysis: block.analysisMethod || undefined,
      schemaBlockId: block.id,
      confidence: 0.7,
    };
  }

  // ===========================================================================
  // C - COMPARATOR EXTRACTION
  // ===========================================================================

  private extractComparatorContext(
    picoData: { population?: string; intervention?: string; comparison?: string; outcome?: string; timeframe?: string } | null,
    methodology: StudyMethodology | undefined,
    errors: string[],
    warnings: string[]
  ): ComparatorContext {
    const sources: string[] = [];
    let confidence = 0.3;

    const arms: ComparatorContext['arms'] = [];

    // Extract from PICO
    if (picoData?.intervention) {
      arms.push({
        id: 'intervention',
        name: picoData.intervention,
        type: 'active',
        description: picoData.intervention,
      });
      sources.push('pico.intervention');
      confidence += 0.2;
    }

    if (picoData?.comparison) {
      const comparisonLower = picoData.comparison.toLowerCase();
      const type = comparisonLower.includes('placebo') ? 'placebo' :
                   comparisonLower.includes('standard') ? 'standard-of-care' :
                   comparisonLower.includes('no ') ? 'no-treatment' : 'active-comparator';

      arms.push({
        id: 'control',
        name: picoData.comparison,
        type,
        description: picoData.comparison,
      });
      sources.push('pico.comparison');
      confidence += 0.2;
    }

    // Extract RCT arm configuration
    const rctConfig = (methodology as any)?.rctConfig;
    if (rctConfig?.arms && Array.isArray(rctConfig.arms)) {
      arms.length = 0; // Clear PICO-derived arms in favor of explicit config
      arms.push(...rctConfig.arms);
      sources.push('rctConfig.arms');
      confidence += 0.3;
    }

    confidence = Math.min(confidence, 0.95);

    if (arms.length < 2) {
      warnings.push('Comparator information incomplete. Specify control/comparison group in PICO framework.');
    }

    return {
      arms,
      allocationRatio: rctConfig?.allocationRatio || (arms.length >= 2 ? '1:1' : undefined),
      confidence,
      sources,
    };
  }

  // ===========================================================================
  // T - TREATMENT EXTRACTION
  // ===========================================================================

  private extractTreatmentContext(
    picoData: { population?: string; intervention?: string; comparison?: string; outcome?: string; timeframe?: string } | null,
    methodology: StudyMethodology | undefined,
    errors: string[],
    warnings: string[]
  ): TreatmentContext {
    const sources: string[] = [];
    let confidence = 0.3;

    const interventions: TreatmentContext['interventions'] = [];

    // Extract from PICO intervention
    if (picoData?.intervention) {
      interventions.push({
        id: 'primary-intervention',
        name: picoData.intervention,
        type: 'drug', // Default, could be improved
        description: picoData.intervention,
      });
      sources.push('pico.intervention');
      confidence += 0.3;
    }

    // Extract duration from PICO timeframe
    let treatmentDuration: string | undefined;
    if (picoData?.timeframe) {
      treatmentDuration = picoData.timeframe;
      sources.push('pico.timeframe');
      confidence += 0.1;
    }

    confidence = Math.min(confidence, 0.95);

    if (interventions.length === 0) {
      warnings.push('Treatment/intervention details not found. Specify intervention in PICO framework.');
    }

    return {
      interventions,
      treatmentDuration,
      confidence,
      sources,
    };
  }

  // ===========================================================================
  // R - RISK FACTORS EXTRACTION
  // ===========================================================================

  private extractRiskFactorsContext(
    picoData: { population?: string; intervention?: string; comparison?: string; outcome?: string; timeframe?: string } | null,
    schemaBlocks: SchemaBlock[],
    methodology: StudyMethodology | undefined,
    errors: string[],
    warnings: string[]
  ): RiskFactorsContext {
    const sources: string[] = [];
    let confidence = 0.3;

    const confounders: RiskFactorsContext['confounders'] = [];
    const effectModifiers: RiskFactorsContext['effectModifiers'] = [];
    const safetySignals: RiskFactorsContext['safetySignals'] = [];

    // Extract predictor blocks as potential confounders
    const predictorBlocks = schemaBlocks.filter(b => b.role === 'Predictor');

    for (const block of predictorBlocks) {
      const name = block.customName || block.variable?.name || block.id;
      const category = block.variable?.category;

      // Classify based on category
      if (category === 'Demographics') {
        confounders.push({
          id: block.id,
          name,
          type: 'demographic',
          expectedImpact: 'moderate',
          adjustmentMethod: 'stratification',
          schemaBlockId: block.id,
        });
      } else if (category === 'Medical History' || category === 'Clinical') {
        confounders.push({
          id: block.id,
          name,
          type: 'clinical',
          expectedImpact: 'moderate',
          adjustmentMethod: 'regression',
          schemaBlockId: block.id,
        });
      }
    }

    if (confounders.length > 0) {
      sources.push('schema.predictors');
      confidence += 0.3;
    }

    // Extract safety variables
    const safetyBlocks = schemaBlocks.filter(b =>
      b.variable?.category === 'Adverse Events' ||
      b.variable?.category === 'Safety'
    );

    for (const block of safetyBlocks) {
      safetySignals.push({
        id: block.id,
        name: block.customName || block.variable?.name || block.id,
        type: 'adverse-event',
        severity: 'moderate', // Default
      });
    }

    if (safetySignals.length > 0) {
      sources.push('schema.safety');
      confidence += 0.1;
    }

    // Use clinical benchmark library for domain-specific risk factors
    if (picoData) {
      const domain = detectClinicalDomain(
        picoData,
        schemaBlocks.map(b => ({
          name: b.variable?.name || b.id,
          label: b.customName || b.variable?.name || b.id,
        }))
      );

      if (domain) {
        sources.push('clinicalBenchmarkLibrary');
        confidence += 0.1;
      }
    }

    confidence = Math.min(confidence, 0.95);

    return {
      confounders,
      effectModifiers,
      safetySignals,
      confidence,
      sources,
    };
  }

  // ===========================================================================
  // A - ANALYSIS PARAMETERS EXTRACTION
  // ===========================================================================

  private extractAnalysisParametersContext(
    version: ProtocolVersion,
    methodology: StudyMethodology | undefined,
    errors: string[],
    warnings: string[]
  ): AnalysisParametersContext {
    const sources: string[] = [];
    let confidence = 0.3;

    // Default values (can be overridden by protocol content)
    let alpha = 0.05;
    let power = 0.80;

    // Try to extract from statistical plan
    const statisticalPlan = version.protocolContent?.statisticalPlan;
    if (statisticalPlan) {
      sources.push('protocolContent.statisticalPlan');
      confidence += 0.2;

      // Simple regex extraction (could be enhanced with NLP)
      const alphaMatch = statisticalPlan.match(/alpha\s*[=:]\s*(0\.\d+)/i);
      if (alphaMatch) {
        alpha = parseFloat(alphaMatch[1]);
      }

      const powerMatch = statisticalPlan.match(/power\s*[=:]\s*(0\.\d+|(\d+)%)/i);
      if (powerMatch) {
        power = powerMatch[1].includes('%') ?
          parseInt(powerMatch[2]) / 100 :
          parseFloat(powerMatch[1]);
      }
    }

    // Default analysis populations
    const populations: AnalysisParametersContext['populations'] = [
      {
        id: 'itt',
        name: 'Intent-to-Treat',
        type: 'ITT',
        definition: 'All randomized participants analyzed according to assigned treatment',
        isPrimary: true,
      },
      {
        id: 'safety',
        name: 'Safety Population',
        type: 'safety',
        definition: 'All participants who received at least one dose of study treatment',
        isPrimary: false,
      },
    ];

    confidence = Math.min(confidence, 0.95);

    if (confidence < 0.5) {
      warnings.push('Analysis parameters are using defaults. Consider specifying alpha, power, and effect size in statistical plan.');
    }

    return {
      alpha,
      power,
      populations,
      missingDataStrategy: {
        primary: 'mixed-model',
        sensitivity: ['complete-case', 'locf'],
      },
      confidence,
      sources,
    };
  }

  // ===========================================================================
  // LITERATURE CONTEXT EXTRACTION
  // ===========================================================================

  private extractLiteratureContext(
    papers: FoundationalPaperExtraction[],
    warnings: string[]
  ): LiteratureContext {
    const foundationalStudies = papers.map(paper => ({
      citation: `${paper.authors} (${paper.year}). ${paper.title}`,
      relevance: paper.relevance || 'Supporting literature',
      sampleSize: paper.sampleSize,
      methodsUsed: paper.statisticalMethods,
    }));

    return {
      foundationalStudies,
    };
  }

  // ===========================================================================
  // VALIDATION METHODS
  // ===========================================================================

  private validateStudyContext(context: StudyDesignContext, issues: SPECTRAValidationIssue[]): number {
    let score = 0;

    if (context.designType) score += 40;
    else issues.push({ component: 'study', field: 'designType', severity: 'error', message: 'Study design type is required' });

    if (context.phase) score += 20;
    if (context.randomization) score += 20;
    if (context.blinding) score += 20;

    return score;
  }

  private validatePopulationContext(context: PopulationContext, issues: SPECTRAValidationIssue[]): number {
    let score = 0;

    if (context.targetPopulation) score += 50;
    else issues.push({ component: 'population', field: 'targetPopulation', severity: 'warning', message: 'Target population description is recommended' });

    if (context.ageRange) score += 15;
    if (context.keyInclusionCriteria && context.keyInclusionCriteria.length > 0) score += 20;
    if (context.targetEnrollment) score += 15;

    return score;
  }

  private validateEndpointsContext(context: EndpointsContext, issues: SPECTRAValidationIssue[]): number {
    let score = 0;

    if (context.primary.length > 0) score += 50;
    else issues.push({ component: 'endpoints', field: 'primary', severity: 'error', message: 'At least one primary endpoint is required' });

    if (context.secondary.length > 0) score += 25;
    if (context.safety.length > 0) score += 25;

    return score;
  }

  private validateComparatorContext(context: ComparatorContext, issues: SPECTRAValidationIssue[]): number {
    let score = 0;

    if (context.arms.length >= 2) score += 60;
    else if (context.arms.length === 1) {
      score += 30;
      issues.push({ component: 'comparator', field: 'arms', severity: 'warning', message: 'Consider defining control/comparator group' });
    }

    if (context.allocationRatio) score += 20;
    if (context.primaryComparison) score += 20;

    return score;
  }

  private validateTreatmentContext(context: TreatmentContext, issues: SPECTRAValidationIssue[]): number {
    let score = 0;

    if (context.interventions.length > 0) score += 50;
    else issues.push({ component: 'treatment', field: 'interventions', severity: 'warning', message: 'Define treatment/intervention details' });

    if (context.treatmentDuration) score += 25;
    if (context.dosingSchedule) score += 25;

    return score;
  }

  private validateRiskFactorsContext(context: RiskFactorsContext, issues: SPECTRAValidationIssue[]): number {
    let score = 40; // Base score since this is often optional

    if (context.confounders.length > 0) score += 30;
    if (context.safetySignals.length > 0) score += 30;

    return Math.min(score, 100);
  }

  private validateAnalysisParametersContext(context: AnalysisParametersContext, issues: SPECTRAValidationIssue[]): number {
    let score = 0;

    if (context.alpha) score += 25;
    if (context.power) score += 25;
    if (context.populations.length > 0) score += 25;
    if (context.effectSize) score += 25;
    else issues.push({ component: 'analysisParameters', field: 'effectSize', severity: 'info', message: 'Consider specifying expected effect size' });

    return score;
  }

  // ===========================================================================
  // SUGGESTION GENERATION
  // ===========================================================================

  private generateSuggestions(
    components: Partial<SPECTRAContext>,
    suggestions: Array<{ field: string; message: string; source?: string }>
  ): void {
    // Population suggestions
    if (!components.population?.targetEnrollment) {
      suggestions.push({
        field: 'population.targetEnrollment',
        message: 'Consider specifying target enrollment for power calculations',
        source: 'best-practices',
      });
    }

    // Endpoints suggestions
    if (components.endpoints?.primary.length === 1 && !components.endpoints.secondary.length) {
      suggestions.push({
        field: 'endpoints.secondary',
        message: 'Consider defining secondary endpoints to support primary findings',
        source: 'ICH-E9',
      });
    }

    // Analysis parameters suggestions
    if (components.analysisParameters && !components.analysisParameters.multiplicityAdjustment) {
      const totalEndpoints = (components.endpoints?.primary.length || 0) +
                            (components.endpoints?.secondary.length || 0);
      if (totalEndpoints > 1) {
        suggestions.push({
          field: 'analysisParameters.multiplicityAdjustment',
          message: 'Multiple endpoints detected. Consider specifying multiplicity adjustment method.',
          source: 'FDA-Guidance',
        });
      }
    }
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const spectraExtractor = new SPECTRAExtractor();
