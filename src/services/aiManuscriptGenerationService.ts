// AI Manuscript Generation Service
// Synthesizes content from Research Wizard schema blocks, Statistical Manifest, and stored references

import type { StatisticalManifest } from '../components/analytics-stats/types';
import type { SchemaBlock } from '../components/protocol-workbench/types';
import type { Source } from '../components/academic-writing/types';
import type { GenerationOptions } from '../components/academic-writing/AutoGenerateManuscriptModal';

export interface ManuscriptGenerationContext {
  schemaBlocks: SchemaBlock[];
  statisticalManifest: StatisticalManifest | null;
  linkedSources: Source[];
  protocolMetadata?: {
    protocolTitle?: string;
    protocolNumber?: string;
    principalInvestigator?: string;
    sponsor?: string;
    studyPhase?: string;
    therapeuticArea?: string;
    estimatedEnrollment?: string;
    studyDuration?: string;
  };
  protocolContent?: {
    primaryObjective?: string;
    secondaryObjectives?: string;
    inclusionCriteria?: string;
    exclusionCriteria?: string;
    statisticalPlan?: string;
  };
  studyMethodology?: {
    studyType: 'rct' | 'prospective-cohort' | 'retrospective-case-series' | 'laboratory-investigation' | 'technical-note';
    hypothesis?: {
      picoFramework: {
        population: string;
        intervention: string;
        comparison: string;
        outcome: string;
      };
      researchQuestion: string;
    };
    blindingState?: {
      protocol: 'none' | 'single-blind' | 'double-blind' | 'triple-blind';
    };
  };
  irbInfo?: {
    approvalDate?: string;
    boardName?: string;
    protocolNumber?: string;
  };
  analyticsMetadata?: {
    databaseSource?: string;
    queryCount?: number;
    lastAnalysisDate?: string;
    dataLockDate?: string;
  };
}

class AIManuscriptGenerationService {
  /**
   * Generate manuscript content using Research Wizard data, Statistical Manifest, and references
   */
  generateSection(
    section: keyof ManuscriptGenerationContext['statisticalManifest'],
    context: ManuscriptGenerationContext,
    options: GenerationOptions
  ): string {
    switch (section) {
      case 'abstract':
        return this.generateAbstract(context, options);
      case 'introduction':
        return this.generateIntroduction(context, options);
      case 'methods':
        return this.generateMethods(context, options);
      case 'results':
        return this.generateResults(context, options);
      case 'discussion':
        return this.generateDiscussion(context, options);
      case 'conclusion':
        return this.generateConclusion(context, options);
      default:
        return '';
    }
  }

  /**
   * Generate Abstract section
   */
  private generateAbstract(context: ManuscriptGenerationContext, options: GenerationOptions): string {
    const { schemaBlocks, statisticalManifest, protocolMetadata } = context;
    
    // Extract primary endpoints from schema
    const primaryEndpoints = this.extractEndpoints(schemaBlocks, 'primary');
    const participantCount = statisticalManifest?.manifestMetadata.totalRecordsAnalyzed || 0;
    const significantFindings = statisticalManifest?.comparativeAnalyses.filter(a => (a.pValue || 1) < 0.05).length || 0;

    const sections = [];

    // Background
    sections.push(
      `**Background:** ${protocolMetadata?.therapeuticArea ? `In ${protocolMetadata.therapeuticArea} research, ` : ''}` +
      `this study investigated ${primaryEndpoints.length > 0 ? primaryEndpoints[0].variable.name.toLowerCase() : 'key clinical outcomes'} ` +
      `in a ${protocolMetadata?.studyPhase || 'clinical'} trial setting.`
    );

    // Methods
    sections.push(
      `**Methods:** A total of ${participantCount} participants were enrolled and analyzed. ` +
      `${this.describeStudyDesign(schemaBlocks)} Statistical analyses were performed using appropriate parametric and non-parametric tests.`
    );

    // Results
    if (statisticalManifest) {
      sections.push(
        `**Results:** ${significantFindings} statistically significant associations were identified (p < 0.05). ` +
        `${this.summarizeKeyFindings(statisticalManifest)}`
      );
    }

    // Conclusion
    sections.push(
      `**Conclusion:** ${primaryEndpoints.length > 0 ? `The study findings support the clinical relevance of ${primaryEndpoints[0].variable.name.toLowerCase()}.` : 'Further research is warranted to validate these findings.'} ` +
      `These results have important implications for ${protocolMetadata?.therapeuticArea || 'clinical practice'}.`
    );

    return sections.join('\n\n');
  }

  /**
   * Generate Introduction section
   */
  private generateIntroduction(context: ManuscriptGenerationContext, options: GenerationOptions): string {
    const { schemaBlocks, linkedSources, protocolMetadata } = context;
    
    const primaryEndpoints = this.extractEndpoints(schemaBlocks, 'primary');
    const citations = linkedSources.filter(s => s.isActive).slice(0, 5);

    const paragraphs = [];

    // Opening paragraph - clinical context
    paragraphs.push(
      `${protocolMetadata?.therapeuticArea ? `${protocolMetadata.therapeuticArea} remains a significant clinical challenge, ` : ''}` +
      `with important implications for patient outcomes and healthcare delivery` +
      `${citations.length > 0 ? ` [${citations[0].citationKey || '1'}]` : ''}.` +
      ` Understanding the mechanisms and predictors of ${primaryEndpoints.length > 0 ? primaryEndpoints[0].variable.name.toLowerCase() : 'clinical outcomes'} ` +
      `is essential for advancing treatment strategies${citations.length > 1 ? ` [${citations[1].citationKey || '2'}]` : ''}.`
    );

    // Literature gap
    paragraphs.push(
      `Despite advances in ${protocolMetadata?.therapeuticArea || 'clinical research'}, ` +
      `several key questions remain unanswered regarding the relationship between ` +
      `${this.listPredictors(schemaBlocks)} and clinical outcomes. ` +
      `Previous studies have shown mixed results` +
      `${citations.length > 2 ? ` [${citations[2].citationKey || '3'}]` : ''}, ` +
      `highlighting the need for comprehensive analysis using robust statistical methods.`
    );

    // Study objectives
    const objectives = this.extractObjectives(schemaBlocks);
    paragraphs.push(
      `The primary objective of this study was to ${objectives.primary || 'evaluate key clinical outcomes'} ` +
      `in a ${protocolMetadata?.studyPhase || 'prospective'} cohort of patients. ` +
      `${objectives.secondary.length > 0 ? `Secondary objectives included ${objectives.secondary.slice(0, 2).join(', ')}.` : ''}`
    );

    return paragraphs.join('\n\n');
  }

  /**
   * Generate Methods section - pulls heavily from Research Wizard
   */
  private generateMethods(context: ManuscriptGenerationContext, options: GenerationOptions): string {
    const { 
      schemaBlocks, 
      statisticalManifest, 
      protocolMetadata, 
      protocolContent,
      studyMethodology,
      irbInfo,
      analyticsMetadata 
    } = context;

    const sections = [];

    // Study Design - use actual study type and PICO framework
    const studyTypeLabel = studyMethodology?.studyType 
      ? this.formatStudyType(studyMethodology.studyType)
      : 'prospective observational study';
    
    const picoFramework = studyMethodology?.hypothesis?.picoFramework;
    
    sections.push(
      `**Study Design**\n\n` +
      `This was a ${studyTypeLabel}` +
      `${studyMethodology?.blindingState?.protocol && studyMethodology.blindingState.protocol !== 'none' 
        ? ` utilizing a ${studyMethodology.blindingState.protocol} design` 
        : ''}.` +
      ` ${picoFramework ? `The study aimed to evaluate ${picoFramework.outcome} in ${picoFramework.population} comparing ${picoFramework.intervention} versus ${picoFramework.comparison}. ` : ''}` +
      `${protocolContent?.primaryObjective ? `Primary objective: ${protocolContent.primaryObjective} ` : ''}` +
      `The study was conducted in accordance with the Declaration of Helsinki and Good Clinical Practice guidelines. ` +
      `${irbInfo?.boardName ? `Ethical approval was obtained from ${irbInfo.boardName}` : 'Ethical approval was obtained from the institutional review board'}` +
      `${irbInfo?.approvalDate ? ` on ${new Date(irbInfo.approvalDate).toLocaleDateString()}` : ''}. ` +
      `${protocolMetadata?.protocolNumber ? `Protocol number: ${protocolMetadata.protocolNumber}.` : ''}`
    );

    // Participants - use actual inclusion/exclusion criteria from protocol
    const demographics = this.extractVariablesByCategory(schemaBlocks, 'Demographics');
    sections.push(
      `**Participants**\n\n` +
      `${statisticalManifest ? `A total of ${statisticalManifest.manifestMetadata.totalRecordsAnalyzed} participants were enrolled ` : 'Participants were enrolled '}` +
      `${protocolMetadata?.estimatedEnrollment ? `(target enrollment: ${protocolMetadata.estimatedEnrollment})` : ''} ` +
      `${protocolMetadata?.studyDuration ? `over ${protocolMetadata.studyDuration}` : ''}. ` +
      `${protocolContent?.inclusionCriteria ? `\n\nInclusion criteria: ${protocolContent.inclusionCriteria}\n\n` : ''}` +
      `${protocolContent?.exclusionCriteria ? `Exclusion criteria: ${protocolContent.exclusionCriteria}\n\n` : ''}` +
      `${demographics.length > 0 ? `Demographic variables collected included ${demographics.map(d => d.variable.name.toLowerCase()).slice(0, 5).join(', ')}.` : ''}`
    );

    // Variables and Measurements
    const clinical = this.extractVariablesByCategory(schemaBlocks, 'Clinical');
    const laboratory = this.extractVariablesByCategory(schemaBlocks, 'Laboratory');
    const treatments = this.extractVariablesByCategory(schemaBlocks, 'Treatments');
    sections.push(
      `**Variables and Measurements**\n\n` +
      `${treatments.length > 0 ? `Treatment interventions included ${treatments.map(t => t.variable.name.toLowerCase()).slice(0, 3).join(', ')}. ` : ''}` +
      `${clinical.length > 0 ? `Clinical variables assessed included ${clinical.map(v => v.variable.name.toLowerCase()).slice(0, 5).join(', ')}. ` : ''}` +
      `${laboratory.length > 0 ? `Laboratory measurements consisted of ${laboratory.map(v => v.variable.name.toLowerCase()).slice(0, 5).join(', ')}. ` : ''}` +
      `All measurements were performed according to standardized protocols by trained personnel.`
    );

    // Endpoints
    const primaryEndpoints = this.extractEndpoints(schemaBlocks, 'primary');
    const secondaryEndpoints = this.extractEndpoints(schemaBlocks, 'secondary');
    sections.push(
      `**Study Endpoints**\n\n` +
      `The primary endpoint was ${primaryEndpoints.length > 0 ? primaryEndpoints[0].variable.name.toLowerCase() : 'defined as per protocol'}. ` +
      `${secondaryEndpoints.length > 0 ? `Secondary endpoints included ${secondaryEndpoints.map(e => e.variable.name.toLowerCase()).slice(0, 3).join(', ')}.` : ''}`
    );

    // Statistical Analysis - use actual statistical plan from protocol
    sections.push(
      `**Statistical Analysis**\n\n` +
      `${protocolContent?.statisticalPlan ? `${protocolContent.statisticalPlan}\n\n` : ''}` +
      `Statistical analyses were performed using the Clinical Intelligence Engine platform` +
      `${analyticsMetadata?.databaseSource ? ` with data sourced from ${analyticsMetadata.databaseSource}` : ''}.` +
      `${analyticsMetadata?.dataLockDate ? ` Data were locked on ${new Date(analyticsMetadata.dataLockDate).toLocaleDateString()} prior to analysis.` : ''} ` +
      `Continuous variables are presented as mean ± standard deviation (SD) for normally distributed data or median (interquartile range) for non-normally distributed data. ` +
      `Categorical variables are reported as frequencies and percentages. ` +
      `${statisticalManifest ? `Group comparisons were performed using ${this.describeStatisticalTests(statisticalManifest)}. ` : ''}` +
      `A two-sided p-value < 0.05 was considered statistically significant. ` +
      `All analyses were performed using validated statistical procedures with appropriate correction for multiple comparisons where applicable.`
    );

    return sections.join('\n\n');
  }

  /**
   * Generate Results section - pulls from Statistical Manifest
   */
  private generateResults(context: ManuscriptGenerationContext, options: GenerationOptions): string {
    const { schemaBlocks, statisticalManifest, linkedSources } = context;

    if (!statisticalManifest) {
      return '[Results will be generated from Statistical Manifest. Please create a Statistical Manifest first.]';
    }

    const sections = [];

    // Baseline Characteristics
    const descriptiveStats = statisticalManifest.descriptiveStats.slice(0, 6);
    sections.push(
      `**Baseline Characteristics**\n\n` +
      `A total of ${statisticalManifest.manifestMetadata.totalRecordsAnalyzed} participants were included in the analysis. ` +
      `Baseline characteristics are presented in Table 1. ` +
      `${descriptiveStats.map(stat => {
        return `${stat.label} was ${stat.results.mean?.toFixed(2) || 'N/A'} ± ${stat.results.stdDev?.toFixed(2) || 'N/A'}`;
      }).slice(0, 4).join('; ')}.`
    );

    // Primary Outcomes
    const primaryEndpoints = this.extractEndpoints(schemaBlocks, 'primary');
    const significantAnalyses = statisticalManifest.comparativeAnalyses.filter(a => (a.pValue || 1) < 0.05);
    sections.push(
      `**Primary Outcomes**\n\n` +
      `${primaryEndpoints.length > 0 ? `The primary endpoint (${primaryEndpoints[0].variable.name.toLowerCase()}) was achieved in the study cohort. ` : ''}` +
      `${significantAnalyses.length > 0 ? `Comparative analysis revealed ${significantAnalyses.length} statistically significant association${significantAnalyses.length !== 1 ? 's' : ''} (p < 0.05). ` : ''}` +
      `${this.narrateSignificantFindings(statisticalManifest)}`
    );

    // Secondary Outcomes
    const secondaryEndpoints = this.extractEndpoints(schemaBlocks, 'secondary');
    if (secondaryEndpoints.length > 0) {
      sections.push(
        `**Secondary Outcomes**\n\n` +
        `Analysis of secondary endpoints showed ${this.narrateSecondaryFindings(statisticalManifest, secondaryEndpoints)}.`
      );
    }

    return sections.join('\n\n');
  }

  /**
   * Generate Discussion section
   */
  private generateDiscussion(context: ManuscriptGenerationContext, options: GenerationOptions): string {
    const { schemaBlocks, statisticalManifest, linkedSources, protocolMetadata } = context;

    const paragraphs = [];

    // Key findings summary
    paragraphs.push(
      `This study investigated ${this.extractObjectives(schemaBlocks).primary || 'clinical outcomes'} ` +
      `in a ${protocolMetadata?.studyPhase || 'prospective'} cohort. ` +
      `${statisticalManifest ? `Analysis of ${statisticalManifest.manifestMetadata.totalRecordsAnalyzed} participants revealed ` : 'The findings demonstrate '}` +
      `important associations between clinical variables and outcomes, ` +
      `providing insights into disease mechanisms and potential therapeutic targets.`
    );

    // Interpretation of findings
    const significantFindings = statisticalManifest?.comparativeAnalyses.filter(a => (a.pValue || 1) < 0.05) || [];
    if (significantFindings.length > 0) {
      paragraphs.push(
        `The observed associations between ${significantFindings.slice(0, 2).map(f => f.outcome).join(' and ')} ` +
        `are consistent with previous research` +
        `${linkedSources.length > 0 ? ` [${linkedSources[0].citationKey || '1'}]` : ''}, ` +
        `supporting the biological plausibility of these relationships. ` +
        `These findings may have important implications for clinical practice and patient management.`
      );
    }

    // Clinical implications
    paragraphs.push(
      `The clinical implications of these findings are multifaceted. ` +
      `First, the identification of significant predictors enables more accurate risk stratification. ` +
      `Second, these results may inform the development of targeted interventions. ` +
      `Third, the methodology employed in this study demonstrates the value of comprehensive data analysis ` +
      `in generating clinically actionable insights.`
    );

    // Limitations
    paragraphs.push(
      `Several limitations should be acknowledged. ` +
      `${statisticalManifest ? `The sample size of ${statisticalManifest.manifestMetadata.totalRecordsAnalyzed} participants, ` : 'The study design, '}` +
      `while adequate for primary analyses, may limit generalizability to other populations. ` +
      `Additionally, the observational nature of the study precludes causal inferences. ` +
      `Future prospective studies with larger sample sizes are warranted to validate these findings.`
    );

    return paragraphs.join('\n\n');
  }

  /**
   * Generate Conclusion section
   */
  private generateConclusion(context: ManuscriptGenerationContext, options: GenerationOptions): string {
    const { schemaBlocks, statisticalManifest, protocolMetadata } = context;

    const primaryEndpoints = this.extractEndpoints(schemaBlocks, 'primary');
    const significantFindings = statisticalManifest?.comparativeAnalyses.filter(a => (a.pValue || 1) < 0.05).length || 0;

    return (
      `This study provides important evidence regarding ${primaryEndpoints.length > 0 ? primaryEndpoints[0].variable.name.toLowerCase() : 'clinical outcomes'} ` +
      `in the context of ${protocolMetadata?.therapeuticArea || 'clinical research'}. ` +
      `${significantFindings > 0 ? `The identification of ${significantFindings} statistically significant association${significantFindings !== 1 ? 's' : ''} ` : 'The findings '}` +
      `contributes to our understanding of disease mechanisms and supports the development of evidence-based clinical strategies. ` +
      `These results warrant further investigation in larger, multicenter trials to establish clinical utility and validate the findings in diverse patient populations. ` +
      `The integration of comprehensive data analysis with rigorous statistical methodology, as demonstrated in this study, ` +
      `represents a promising approach for advancing ${protocolMetadata?.therapeuticArea || 'medical'} research and improving patient outcomes.`
    );
  }

  // Helper methods

  private extractEndpoints(schemaBlocks: SchemaBlock[], tier: 'primary' | 'secondary'): SchemaBlock[] {
    const getAllBlocks = (blocks: SchemaBlock[]): SchemaBlock[] => {
      let result: SchemaBlock[] = [];
      blocks.forEach(block => {
        result.push(block);
        if (block.children) {
          result = result.concat(getAllBlocks(block.children));
        }
      });
      return result;
    };

    const allBlocks = getAllBlocks(schemaBlocks);
    return allBlocks.filter(b => b.role === 'Outcome' && b.endpointTier === tier);
  }

  private extractVariablesByCategory(schemaBlocks: SchemaBlock[], category: string): SchemaBlock[] {
    const getAllBlocks = (blocks: SchemaBlock[]): SchemaBlock[] => {
      let result: SchemaBlock[] = [];
      blocks.forEach(block => {
        result.push(block);
        if (block.children) {
          result = result.concat(getAllBlocks(block.children));
        }
      });
      return result;
    };

    const allBlocks = getAllBlocks(schemaBlocks);
    return allBlocks.filter(b => b.variable.category === category);
  }

  private describeStudyDesign(schemaBlocks: SchemaBlock[]): string {
    const treatments = this.extractVariablesByCategory(schemaBlocks, 'Treatments');
    
    if (treatments.length > 0) {
      return `This was a prospective study evaluating the effects of ${treatments[0].variable.name.toLowerCase()} on clinical outcomes.`;
    }
    
    return 'This was a prospective observational study designed to evaluate clinical outcomes in a well-defined patient population.';
  }

  private listPredictors(schemaBlocks: SchemaBlock[]): string {
    const predictors = this.extractVariablesByCategory(schemaBlocks, 'Clinical').slice(0, 3);
    if (predictors.length === 0) return 'clinical variables';
    return predictors.map(p => p.variable.name.toLowerCase()).join(', ');
  }

  private extractObjectives(schemaBlocks: SchemaBlock[]): { primary: string; secondary: string[] } {
    const primaryEndpoints = this.extractEndpoints(schemaBlocks, 'primary');
    const secondaryEndpoints = this.extractEndpoints(schemaBlocks, 'secondary');

    return {
      primary: primaryEndpoints.length > 0 
        ? `evaluate ${primaryEndpoints[0].variable.name.toLowerCase()} as the primary endpoint`
        : 'evaluate key clinical outcomes',
      secondary: secondaryEndpoints.slice(0, 2).map(e => `assess ${e.variable.name.toLowerCase()}`),
    };
  }

  private extractInclusionCriteria(schemaBlocks: SchemaBlock[]): string[] {
    const demographics = this.extractVariablesByCategory(schemaBlocks, 'Demographics');
    return demographics.slice(0, 3).map(d => `${d.variable.name.toLowerCase()} within specified range`);
  }

  private describeStatisticalTests(manifest: StatisticalManifest): string {
    return 'Student\'s t-test for continuous variables and Fisher\'s exact test for categorical variables';
  }

  private summarizeKeyFindings(manifest: StatisticalManifest): string {
    const topStats = manifest.descriptiveStats.slice(0, 2);
    return topStats.map(stat => 
      `${stat.label} was ${stat.results.mean?.toFixed(2) || 'N/A'} ± ${stat.results.stdDev?.toFixed(2) || 'N/A'}`
    ).join(', ') + '.';
  }

  private narrateSignificantFindings(manifest: StatisticalManifest): string {
    const significant = manifest.comparativeAnalyses.filter(a => (a.pValue || 1) < 0.05).slice(0, 3);
    
    if (significant.length === 0) {
      return 'No statistically significant differences were observed between groups.';
    }

    return significant.map(analysis => 
      `${analysis.outcome} showed a significant association (p = ${(analysis.pValue || 0).toFixed(3)})`
    ).join('; ') + '.';
  }

  private narrateSecondaryFindings(manifest: StatisticalManifest, secondaryEndpoints: SchemaBlock[]): string {
    if (secondaryEndpoints.length === 0) {
      return 'additional exploratory analyses of clinical variables';
    }

    return `relationships between ${secondaryEndpoints.slice(0, 2).map(e => e.variable.name.toLowerCase()).join(' and ')} ` +
      `with results consistent with the primary analysis`;
  }

  private formatStudyType(studyType: string): string {
    const typeMap: Record<string, string> = {
      'rct': 'randomized controlled trial (RCT)',
      'prospective-cohort': 'prospective cohort study',
      'retrospective-case-series': 'retrospective case series',
      'laboratory-investigation': 'laboratory investigation',
      'technical-note': 'technical validation study',
    };
    return typeMap[studyType] || studyType;
  }
}

export const aiManuscriptGenerationService = new AIManuscriptGenerationService();