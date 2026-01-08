// Lateral Thinking Tool - Satellite Discovery Panel

import { useState } from 'react';
import { Lightbulb, TrendingUp, FileText, FlaskConical, AlertCircle, Sparkles } from 'lucide-react';
import type { SatelliteOpportunity } from '../../types/manuscript';
import type { SchemaBlock } from '../protocol-workbench/types';

interface ResearchMultiplierProps {
  schemaBlocks: SchemaBlock[];
  usedVariableIds: string[];
  onCreateDraft: (opportunity: SatelliteOpportunity) => void;
}

export function ResearchMultiplier({ schemaBlocks, usedVariableIds, onCreateDraft }: ResearchMultiplierProps) {
  const [opportunities, setOpportunities] = useState<SatelliteOpportunity[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const scanForOpportunities = () => {
    setIsScanning(true);
    
    // Simulate AI scanning
    setTimeout(() => {
      const allBlocks = flattenBlocks(schemaBlocks);
      const unusedBlocks = allBlocks.filter(
        b => !usedVariableIds.includes(b.id) && b.dataType !== 'Section'
      );

      const discovered: SatelliteOpportunity[] = [];

      // Group unused by category
      const byCategory = unusedBlocks.reduce((acc, block) => {
        const cat = block.variable.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(block);
        return acc;
      }, {} as { [key: string]: SchemaBlock[] });

      // Generate opportunities
      Object.entries(byCategory).forEach(([category, blocks]) => {
        if (blocks.length >= 3) {
          discovered.push({
            id: `opp-${category}-${Date.now()}`,
            type: 'technical-note',
            title: `Technical Analysis: ${category} Variables`,
            description: `You have ${blocks.length} unused ${category} variables. Consider a technical note exploring these endpoints.`,
            variables: blocks.map(b => b.id),
            rationale: `Sufficient data points (n=${blocks.length}) to support a focused technical analysis.`,
            potentialImpact: blocks.length > 8 ? 'high' : 'medium',
            estimatedWords: blocks.length * 150,
            suggestedJournal: category === 'Laboratory' ? 'Journal of Clinical Laboratory Analysis' : undefined
          });
        }
      });

      // Look for specific patterns
      const continuousVars = unusedBlocks.filter(b => b.dataType === 'Continuous');
      if (continuousVars.length >= 4) {
        discovered.push({
          id: `opp-corr-${Date.now()}`,
          type: 'brief-communication',
          title: 'Correlation Analysis Brief Communication',
          description: `${continuousVars.length} continuous variables detected. Potential for correlation matrix analysis.`,
          variables: continuousVars.map(b => b.id),
          rationale: 'Multiple continuous endpoints enable comprehensive correlation study.',
          potentialImpact: 'medium',
          estimatedWords: 1200,
          suggestedJournal: 'Statistics in Medicine'
        });
      }

      // Age-stratified analysis opportunity
      const hasAge = allBlocks.some(b => b.variable.name.toLowerCase().includes('age'));
      const hasOutcomes = unusedBlocks.some(b => b.role === 'Outcome');
      
      if (hasAge && hasOutcomes) {
        discovered.push({
          id: `opp-age-${Date.now()}`,
          type: 'sub-analysis',
          title: 'Age-Stratified Sub-Analysis',
          description: 'Unused outcomes detected with Age variable present. Consider age-stratified analysis.',
          variables: unusedBlocks.filter(b => b.role === 'Outcome').map(b => b.id),
          rationale: 'Age stratification (e.g., <65 vs ≥65) often reveals clinically important patterns.',
          potentialImpact: 'high',
          estimatedWords: 2500
        });
      }

      setOpportunities(discovered);
      setIsScanning(false);
    }, 1500);
  };

  const getTypeIcon = (type: SatelliteOpportunity['type']) => {
    switch (type) {
      case 'technical-note': return FlaskConical;
      case 'brief-communication': return FileText;
      case 'sub-analysis': return TrendingUp;
      case 'case-series': return AlertCircle;
    }
  };

  const getImpactColor = (impact: SatelliteOpportunity['potentialImpact']) => {
    switch (impact) {
      case 'high': return 'bg-green-50 text-green-700 border-green-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-slate-900">Research Multiplier</h3>
          </div>
          <button
            onClick={scanForOpportunities}
            disabled={isScanning}
            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isScanning ? 'Scanning...' : 'Scan for Opportunities'}
          </button>
        </div>
        <div className="text-xs text-slate-600">
          AI-powered lateral thinking to discover satellite publications
        </div>
      </div>

      {/* Opportunities List */}
      <div className="flex-1 overflow-y-auto p-4">
        {opportunities.length === 0 && !isScanning && (
          <div className="text-center py-12 text-slate-500">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <div className="text-sm">Click "Scan" to discover new publication opportunities</div>
          </div>
        )}

        {isScanning && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-3"></div>
            <div className="text-sm text-slate-600">Analyzing unused variables...</div>
          </div>
        )}

        <div className="space-y-4">
          {opportunities.map(opp => {
            const Icon = getTypeIcon(opp.type);
            return (
              <div key={opp.id} className="border border-slate-200 rounded-lg overflow-hidden hover:border-purple-300 transition-colors">
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-slate-900 mb-1">{opp.title}</h4>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs border ${getImpactColor(opp.potentialImpact)}`}>
                        {opp.potentialImpact.toUpperCase()} IMPACT
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <div className="text-sm text-slate-700 mb-3">{opp.description}</div>
                  
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
                    <div className="text-xs font-medium text-blue-900 mb-1">AI Rationale</div>
                    <div className="text-xs text-blue-800">{opp.rationale}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                    <div>
                      <div className="text-slate-500">Variables Detected</div>
                      <div className="text-slate-900 font-medium">{opp.variables.length}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Est. Word Count</div>
                      <div className="text-slate-900 font-medium">{opp.estimatedWords}</div>
                    </div>
                  </div>

                  {opp.suggestedJournal && (
                    <div className="mb-3 text-xs">
                      <span className="text-slate-500">Suggested Journal: </span>
                      <span className="text-slate-900 font-medium">{opp.suggestedJournal}</span>
                    </div>
                  )}

                  <button
                    onClick={() => onCreateDraft(opp)}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                  >
                    Create Draft Manuscript
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Stats */}
      {opportunities.length > 0 && (
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-600">
            {opportunities.length} publication opportunit{opportunities.length !== 1 ? 'ies' : 'y'} discovered
          </div>
        </div>
      )}
    </div>
  );
}

// Helper
function flattenBlocks(blocks: SchemaBlock[]): SchemaBlock[] {
  const result: SchemaBlock[] = [];
  function traverse(block: SchemaBlock) {
    result.push(block);
    if (block.children) block.children.forEach(traverse);
  }
  blocks.forEach(traverse);
  return result;
}
