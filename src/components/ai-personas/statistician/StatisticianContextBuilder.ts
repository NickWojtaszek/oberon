// StatisticianContextBuilder
// Gathers all relevant context from the system for AI analysis
// Integrated with Clinical Benchmark Library for domain detection

import type { SchemaBlock, ProtocolVersion } from '../../protocol-workbench/types';
import type { ClinicalDataRecord } from '../../../utils/dataStorage';
import type { FoundationalPaperExtraction } from '../../../services/geminiService';
import type {
  StatisticalAnalysisContext,
  ProtocolContext,
  SchemaContext,
  DataContext,
  FoundationalPapersContext,
  SchemaBlockSummary,
  DataDistributionSummary,
  MissingDataSummary,
  FoundationalPaperSummary,
} from './types';

// Import Clinical Benchmark Library for domain detection
import {
  detectClinicalDomain,
  detectSubspecialty,
  matchVariableToEndpoint,
  matchVariableToRiskFactor,
  type ClinicalDomain,
  type DomainSubspecialty,
} from './clinicalBenchmarkLibrary';

/**
 * Builds the complete analysis context for the Statistician AI
 */
export class StatisticianContextBuilder {
  /**
   * Build complete context from all available sources
   */
  buildContext(
    protocol: ProtocolVersion,
    schemaBlocks: SchemaBlock[],
    records: ClinicalDataRecord[],
    foundationalPapers?: FoundationalPaperExtraction[],
    picoData?: { population?: string; intervention?: string; comparison?: string; outcome?: string; timeframe?: string } | null
  ): StatisticalAnalysisContext {
    // Filter to completed records only for analysis
    const completedRecords = records.filter(r => r.status === 'complete');

    console.log(`🔬 [ContextBuilder] Input: ${records.length} total records, ${completedRecords.length} complete`);
    console.log(`🔬 [ContextBuilder] Schema blocks: ${schemaBlocks.length}`);
    console.log(`🔬 [ContextBuilder] PICO data provided:`, picoData ? 'Yes' : 'No');
    console.log(`🔬 [ContextBuilder] Foundational papers:`, foundationalPapers?.length || 0);

    // Detect clinical domain from PICO and schema using Clinical Benchmark Library
    const detectedDomain = detectClinicalDomain(
      picoData,
      schemaBlocks.map(b => ({ name: b.variable?.name || b.id, label: b.customName || b.variable?.name || b.id })),
      protocol.protocolContent?.primaryObjective
    );
    const detectedSubspecialty = detectedDomain
      ? detectSubspecialty(detectedDomain, picoData, schemaBlocks.map(b => ({ name: b.variable?.name || b.id, label: b.customName || b.variable?.name || b.id })))
      : null;

    if (detectedDomain) {
      console.log(`🔬 [ContextBuilder] Detected clinical domain: ${detectedDomain.domain}`);
      if (detectedSubspecialty) {
        console.log(`🔬 [ContextBuilder] Detected subspecialty: ${detectedSubspecialty.name}`);
      }
    } else {
      console.log(`🔬 [ContextBuilder] No specific clinical domain detected - using general statistical guidance`);
    }

    // Debug: Log structure of first record and first few blocks
    if (completedRecords.length > 0) {
      const firstRecord = completedRecords[0];
      const tableNames = Object.keys(firstRecord.data);
      console.log(`🔬 [ContextBuilder] First record tables:`, tableNames);
      if (tableNames.length > 0) {
        const firstTable = tableNames[0];
        const fieldIds = Object.keys(firstRecord.data[firstTable]);
        console.log(`🔬 [ContextBuilder] First table "${firstTable}" has ${fieldIds.length} fields`);
        console.log(`🔬 [ContextBuilder] Sample field IDs:`, fieldIds.slice(0, 5));
      }
    }
    if (schemaBlocks.length > 0) {
      // Flatten to get all block IDs including children
      const allBlockIds: string[] = [];
      const collectIds = (blocks: SchemaBlock[]) => {
        blocks.forEach(b => {
          allBlockIds.push(b.id);
          if (b.children) collectIds(b.children);
        });
      };
      collectIds(schemaBlocks);
      console.log(`🔬 [ContextBuilder] Total flattened blocks: ${allBlockIds.length}`);
      console.log(`🔬 [ContextBuilder] Sample block IDs:`, allBlockIds.slice(0, 5));
    }

    const protocolContext = this.buildProtocolContext(protocol, picoData);
    const distributions = this.extractDistributions(schemaBlocks, completedRecords);
    const schemaContext = this.buildSchemaContext(schemaBlocks, distributions);
    const dataContext = this.buildDataContext(schemaBlocks, completedRecords, distributions);
    const papersContext = foundationalPapers
      ? this.buildFoundationalPapersContext(foundationalPapers)
      : undefined;

    // Build detected domain context with matched variables
    const detectedDomainContext = detectedDomain
      ? this.buildDetectedDomainContext(detectedDomain, detectedSubspecialty, schemaBlocks)
      : undefined;

    return {
      protocol: protocolContext,
      schema: schemaContext,
      data: dataContext,
      foundationalPapers: papersContext,
      detectedDomain: detectedDomainContext,
    };
  }

  /**
   * Build detected domain context with matched variables
   */
  private buildDetectedDomainContext(
    domain: ClinicalDomain,
    subspecialty: DomainSubspecialty | null,
    blocks: SchemaBlock[]
  ): StatisticalAnalysisContext['detectedDomain'] {
    const matchedEndpoints: StatisticalAnalysisContext['detectedDomain'] extends { matchedEndpoints: infer T } ? T : never = [];
    const matchedRiskFactors: StatisticalAnalysisContext['detectedDomain'] extends { matchedRiskFactors: infer T } ? T : never = [];

    // Match schema blocks to known endpoints and risk factors
    for (const block of blocks) {
      const variableName = block.variable?.name || block.id;
      const variableLabel = block.customName || variableName;

      // Try to match to endpoint
      const endpoint = matchVariableToEndpoint(variableName, variableLabel, domain, subspecialty ?? undefined);
      if (endpoint) {
        matchedEndpoints.push({
          variableId: block.id,
          variableLabel,
          endpointName: endpoint.name,
          benchmarks: {
            acceptable: endpoint.acceptable,
            concerning: endpoint.concerning,
          },
          recommendedAnalysis: endpoint.analysisMethod,
        });
      }

      // Try to match to risk factor
      const riskFactor = matchVariableToRiskFactor(variableName, variableLabel, domain, subspecialty ?? undefined);
      if (riskFactor) {
        matchedRiskFactors.push({
          variableId: block.id,
          variableLabel,
          riskFactorName: riskFactor.name,
          expectedEffect: riskFactor.expectedOR || riskFactor.expectedHR,
          direction: riskFactor.direction,
        });
      }
    }

    // Calculate confidence based on number of matches
    const totalVariables = blocks.filter(b => b.dataType !== 'Section').length;
    const matchCount = matchedEndpoints.length + matchedRiskFactors.length;
    const confidence = totalVariables > 0
      ? Math.min(0.95, 0.5 + (matchCount / totalVariables) * 0.5)
      : 0.5;

    return {
      domain: domain.domain,
      subspecialty: subspecialty?.name,
      confidence,
      matchedEndpoints,
      matchedRiskFactors,
    };
  }

  /**
   * Extract protocol-level context
   */
  private buildProtocolContext(
    protocol: ProtocolVersion,
    picoData?: { population?: string; intervention?: string; comparison?: string; outcome?: string; timeframe?: string } | null
  ): ProtocolContext {
    const content = protocol.protocolContent;
    const metadata = protocol.metadata;

    // Use provided PICO data or fall back to extracting from objectives
    const primaryObj = content?.primaryObjective || '';

    return {
      pico: {
        population: picoData?.population || '',
        intervention: picoData?.intervention || '',
        comparison: picoData?.comparison || '',
        outcome: picoData?.outcome || primaryObj,
        timeframe: picoData?.timeframe,
        confidence: picoData ? 0.9 : undefined, // Higher confidence if PICO was explicitly provided
      },
      studyDesign: (metadata?.studyPhase as any) || 'rct',
      studyPhase: metadata?.studyPhase,
      primaryObjective: content?.primaryObjective,
      secondaryObjectives: content?.secondaryObjectives
        ? [content.secondaryObjectives]
        : undefined,
      statisticalPlan: content?.statisticalPlan,
    };
  }

  /**
   * Build schema context with variable classifications
   */
  private buildSchemaContext(
    blocks: SchemaBlock[],
    distributions: Map<string, DataDistributionSummary>
  ): SchemaContext {
    const summaries = this.summarizeBlocks(blocks, distributions);

    return {
      blocks: summaries,
      predictors: summaries.filter(b => b.role === 'Predictor'),
      outcomes: summaries.filter(b => b.role === 'Outcome'),
      primaryEndpoints: summaries.filter(b => b.endpointTier === 'primary'),
      secondaryEndpoints: summaries.filter(b => b.endpointTier === 'secondary'),
      exploratoryEndpoints: summaries.filter(b => b.endpointTier === 'exploratory'),
    };
  }

  /**
   * Build data context with distributions and missing data analysis
   */
  private buildDataContext(
    blocks: SchemaBlock[],
    records: ClinicalDataRecord[],
    distributions: Map<string, DataDistributionSummary>
  ): DataContext {
    const missingDataSummary = this.analyzeMissingData(blocks, records);

    // Convert Map to Record for serialization
    const variableDistributions: Record<string, DataDistributionSummary> = {};
    distributions.forEach((value, key) => {
      variableDistributions[key] = value;
    });

    // Calculate sample sizes by group if there's a categorical predictor
    const sampleSizeByGroup = this.calculateGroupSizes(blocks, records);

    return {
      totalRecords: records.length,
      completedRecords: records.filter(r => r.status === 'complete').length,
      variableDistributions,
      missingDataSummary,
      sampleSizeByGroup,
    };
  }

  /**
   * Build foundational papers context
   */
  private buildFoundationalPapersContext(
    papers: FoundationalPaperExtraction[]
  ): FoundationalPapersContext {
    const paperSummaries: FoundationalPaperSummary[] = papers.map(p => ({
      title: p.title,
      authors: p.authors,
      year: p.year,
      statisticalMethods: this.extractStatisticalMethods(p),
      sampleSize: this.parseSampleSize(p.protocolElements?.sampleSize),
      primaryEndpoint: p.protocolElements?.primaryEndpoint,
    }));

    // Synthesize common approaches
    const allMethods = paperSummaries.flatMap(p => p.statisticalMethods);
    const methodCounts = allMethods.reduce((acc, method) => {
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const commonStatisticalApproaches = Object.entries(methodCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([method]) => method);

    return {
      papers: paperSummaries,
      commonStatisticalApproaches,
      synthesizedMethods: commonStatisticalApproaches.length > 0
        ? `Common methods in foundational literature: ${commonStatisticalApproaches.join(', ')}`
        : undefined,
    };
  }

  /**
   * Summarize schema blocks for AI consumption
   */
  private summarizeBlocks(
    blocks: SchemaBlock[],
    distributions: Map<string, DataDistributionSummary>
  ): SchemaBlockSummary[] {
    const flattenBlocks = (
      blocks: SchemaBlock[],
      parentPath: string = ''
    ): SchemaBlockSummary[] => {
      const summaries: SchemaBlockSummary[] = [];

      for (const block of blocks) {
        const distribution = distributions.get(block.id);

        summaries.push({
          id: block.id,
          name: block.variable?.name || block.id,
          label: block.customName || block.variable?.name || block.id,
          dataType: block.dataType,
          role: block.role,
          endpointTier: block.endpointTier || null,
          analysisMethod: block.analysisMethod || null,
          unit: block.unit,
          options: block.options,
          hasData: distribution ? distribution.n > 0 : false,
          completeness: distribution
            ? (distribution.n - distribution.missing) / Math.max(distribution.n, 1)
            : 0,
          distribution,
        });

        // Recurse into children
        if (block.children && block.children.length > 0) {
          summaries.push(...flattenBlocks(block.children, `${parentPath}${block.id}.`));
        }
      }

      return summaries;
    };

    return flattenBlocks(blocks);
  }

  /**
   * Extract distributions for all variables from records
   */
  private extractDistributions(
    blocks: SchemaBlock[],
    records: ClinicalDataRecord[]
  ): Map<string, DataDistributionSummary> {
    const distributions = new Map<string, DataDistributionSummary>();
    let extractedCount = 0;
    let emptyCount = 0;

    const processBlock = (block: SchemaBlock) => {
      const values = this.extractValuesForBlock(block, records);
      const distribution = this.computeDistribution(block, values);
      distributions.set(block.id, distribution);

      if (block.dataType !== 'Section') {
        if (values.length > 0) {
          extractedCount++;
        } else {
          emptyCount++;
        }
      }

      // Process children
      if (block.children) {
        block.children.forEach(processBlock);
      }
    };

    blocks.forEach(processBlock);

    console.log(`🔬 [extractDistributions] Total: ${extractedCount} blocks with data, ${emptyCount} blocks empty`);

    return distributions;
  }

  /**
   * Extract all values for a specific block from records
   * Tries multiple matching strategies: block.id, variable.name, and fieldName patterns
   */
  private extractValuesForBlock(
    block: SchemaBlock,
    records: ClinicalDataRecord[]
  ): (string | number | null)[] {
    const values: (string | number | null)[] = [];
    let foundVia = '';

    // Generate alternative field name patterns (snake_case version of variable name)
    const variableName = block.variable?.name || '';
    const snakeCaseName = variableName.toLowerCase().replace(/\s+/g, '_');

    for (const record of records) {
      let foundValue = false;

      // Look through all tables in the record data
      for (const tableData of Object.values(record.data)) {
        if (!tableData) continue;

        // Strategy 1: Direct block.id match
        if (block.id in tableData) {
          values.push(tableData[block.id]);
          foundValue = true;
          if (!foundVia) foundVia = 'block.id';
          break;
        }

        // Strategy 2: Variable name match
        if (variableName && variableName in tableData) {
          values.push(tableData[variableName]);
          foundValue = true;
          if (!foundVia) foundVia = 'variable.name';
          break;
        }

        // Strategy 3: Snake case name match (for legacy data)
        if (snakeCaseName && snakeCaseName in tableData) {
          values.push(tableData[snakeCaseName]);
          foundValue = true;
          if (!foundVia) foundVia = 'snakeCaseName';
          break;
        }
      }

      // If no value found for this record, don't push anything
      // (this affects N count - only records with values are counted)
    }

    // Debug: Log first block that finds or doesn't find values
    if (values.length === 0 && records.length > 0 && block.dataType !== 'Section') {
      // Only log once per session to avoid spam
      if (!this._debugLogged) {
        this._debugLogged = true;
        console.log(`🔬 [extractValues] No values found for block "${variableName}" (${block.id})`);
        console.log(`🔬 [extractValues] Tried: block.id, "${variableName}", "${snakeCaseName}"`);
        if (records[0]?.data) {
          const firstTable = Object.keys(records[0].data)[0];
          if (firstTable) {
            console.log(`🔬 [extractValues] Available fields in "${firstTable}":`,
              Object.keys(records[0].data[firstTable]).slice(0, 10));
          }
        }
      }
    } else if (values.length > 0 && !this._debugLoggedSuccess) {
      this._debugLoggedSuccess = true;
      console.log(`🔬 [extractValues] Found ${values.length} values for "${variableName}" via ${foundVia}`);
    }

    return values;
  }

  // Debug flags to avoid console spam
  private _debugLogged = false;
  private _debugLoggedSuccess = false;

  /**
   * Compute distribution summary for a variable
   */
  private computeDistribution(
    block: SchemaBlock,
    values: (string | number | null)[]
  ): DataDistributionSummary {
    const n = values.length;
    const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
    const missing = n - nonNullValues.length;

    // Determine distribution type based on dataType
    const isContinuous = block.dataType === 'Continuous';
    const isCategorical = block.dataType === 'Categorical' ||
                          block.dataType === 'Text' ||
                          block.dataType === 'Multi-Select';
    const isBinary = block.dataType === 'Boolean';
    const isTimeToEvent = block.analysisMethod === 'survival';

    if (isTimeToEvent) {
      return this.computeTimeToEventDistribution(nonNullValues as number[], n, missing);
    }

    if (isContinuous) {
      return this.computeContinuousDistribution(nonNullValues as number[], n, missing);
    }

    if (isBinary || isCategorical) {
      return this.computeCategoricalDistribution(nonNullValues as string[], n, missing, isBinary);
    }

    // Default: treat as categorical
    return this.computeCategoricalDistribution(nonNullValues as string[], n, missing, false);
  }

  /**
   * Compute continuous distribution statistics
   */
  private computeContinuousDistribution(
    values: number[],
    n: number,
    missing: number
  ): DataDistributionSummary {
    if (values.length === 0) {
      return { type: 'continuous', n, missing };
    }

    const numericValues = values.map(v => Number(v)).filter(v => !isNaN(v));

    if (numericValues.length === 0) {
      return { type: 'continuous', n, missing };
    }

    const sorted = [...numericValues].sort((a, b) => a - b);
    const sum = numericValues.reduce((a, b) => a + b, 0);
    const mean = sum / numericValues.length;

    const variance = numericValues.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) /
                     Math.max(numericValues.length - 1, 1);
    const sd = Math.sqrt(variance);

    const median = sorted[Math.floor(sorted.length / 2)];
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];

    // Simple normality check using skewness
    const skewness = this.calculateSkewness(numericValues, mean, sd);
    const isNormal = Math.abs(skewness) < 1; // Rough heuristic

    return {
      type: 'continuous',
      n,
      missing,
      mean,
      sd,
      median,
      iqr: [q1, q3],
      min: sorted[0],
      max: sorted[sorted.length - 1],
      isNormal,
      skewness,
    };
  }

  /**
   * Compute categorical distribution statistics
   */
  private computeCategoricalDistribution(
    values: string[],
    n: number,
    missing: number,
    isBinary: boolean
  ): DataDistributionSummary {
    const frequencies: Record<string, number> = {};
    const proportions: Record<string, number> = {};

    for (const value of values) {
      const strValue = String(value);
      frequencies[strValue] = (frequencies[strValue] || 0) + 1;
    }

    const total = values.length;
    for (const [key, count] of Object.entries(frequencies)) {
      proportions[key] = total > 0 ? count / total : 0;
    }

    return {
      type: isBinary ? 'binary' : 'categorical',
      n,
      missing,
      frequencies,
      proportions,
      categories: Object.keys(frequencies),
    };
  }

  /**
   * Compute time-to-event distribution
   */
  private computeTimeToEventDistribution(
    values: number[],
    n: number,
    missing: number
  ): DataDistributionSummary {
    // For time-to-event, we treat as continuous but mark the type
    const continuous = this.computeContinuousDistribution(values, n, missing);
    return {
      ...continuous,
      type: 'time-to-event',
    };
  }

  /**
   * Analyze missing data patterns
   */
  private analyzeMissingData(
    blocks: SchemaBlock[],
    records: ClinicalDataRecord[]
  ): MissingDataSummary {
    const byVariable: Record<string, { count: number; percentage: number }> = {};
    let totalMissing = 0;
    let totalCells = 0;

    const processBlock = (block: SchemaBlock) => {
      const values = this.extractValuesForBlock(block, records);
      const missing = values.filter(v => v === null || v === undefined || v === '').length;
      const total = values.length;

      byVariable[block.id] = {
        count: missing,
        percentage: total > 0 ? (missing / total) * 100 : 0,
      };

      totalMissing += missing;
      totalCells += total;

      if (block.children) {
        block.children.forEach(processBlock);
      }
    };

    blocks.forEach(processBlock);

    const overallMissingRate = totalCells > 0 ? (totalMissing / totalCells) * 100 : 0;

    // Simple pattern detection (would need more sophisticated analysis for real MCAR/MAR/MNAR)
    const pattern: 'MCAR' | 'MAR' | 'MNAR' | 'unknown' =
      overallMissingRate < 5 ? 'MCAR' : 'unknown';

    return {
      overallMissingRate,
      byVariable,
      pattern,
      patternConfidence: overallMissingRate < 5 ? 0.8 : 0.3,
    };
  }

  /**
   * Calculate sample sizes by group for the first categorical predictor found
   */
  private calculateGroupSizes(
    blocks: SchemaBlock[],
    records: ClinicalDataRecord[]
  ): Record<string, number> | undefined {
    // Find first categorical predictor
    const categoricalPredictor = blocks.find(
      b => b.role === 'Predictor' &&
           (b.dataType === 'Categorical' || b.dataType === 'Boolean' || b.dataType === 'Text')
    );

    if (!categoricalPredictor) {
      return undefined;
    }

    const values = this.extractValuesForBlock(categoricalPredictor, records);
    const groupSizes: Record<string, number> = {};

    for (const value of values) {
      if (value !== null && value !== undefined && value !== '') {
        const strValue = String(value);
        groupSizes[strValue] = (groupSizes[strValue] || 0) + 1;
      }
    }

    return Object.keys(groupSizes).length > 0 ? groupSizes : undefined;
  }

  /**
   * Calculate skewness for normality assessment
   */
  private calculateSkewness(values: number[], mean: number, sd: number): number {
    if (values.length < 3 || sd === 0) return 0;

    const n = values.length;
    const sum = values.reduce((acc, v) => acc + Math.pow((v - mean) / sd, 3), 0);
    return (n / ((n - 1) * (n - 2))) * sum;
  }

  /**
   * Extract statistical methods mentioned in a paper
   */
  private extractStatisticalMethods(paper: FoundationalPaperExtraction): string[] {
    const methods: string[] = [];
    const approach = paper.protocolElements?.statisticalApproach?.toLowerCase() || '';

    // Check for common statistical methods
    const methodKeywords = [
      { pattern: /t-test|t test/i, method: 't-test' },
      { pattern: /anova|analysis of variance/i, method: 'ANOVA' },
      { pattern: /chi-square|chi square|χ2/i, method: 'Chi-square' },
      { pattern: /fisher/i, method: "Fisher's exact test" },
      { pattern: /regression/i, method: 'Regression' },
      { pattern: /cox|proportional hazard/i, method: 'Cox regression' },
      { pattern: /kaplan|survival/i, method: 'Kaplan-Meier' },
      { pattern: /log-rank|logrank/i, method: 'Log-rank test' },
      { pattern: /wilcoxon|mann-whitney/i, method: 'Non-parametric test' },
      { pattern: /correlation|pearson|spearman/i, method: 'Correlation analysis' },
    ];

    for (const { pattern, method } of methodKeywords) {
      if (pattern.test(approach)) {
        methods.push(method);
      }
    }

    // If no methods found, try to infer from study design
    if (methods.length === 0 && paper.studyDesign) {
      const design = paper.studyDesign.toLowerCase();
      if (design.includes('rct') || design.includes('randomized')) {
        methods.push('t-test', 'ANOVA');
      }
      if (design.includes('survival') || design.includes('time-to-event')) {
        methods.push('Kaplan-Meier', 'Log-rank test');
      }
    }

    return [...new Set(methods)]; // Remove duplicates
  }

  /**
   * Parse sample size from string
   */
  private parseSampleSize(sampleSizeStr?: string): number | undefined {
    if (!sampleSizeStr) return undefined;

    // Try to extract a number
    const match = sampleSizeStr.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : undefined;
  }
}

// Export singleton instance
export const statisticianContextBuilder = new StatisticianContextBuilder();
