/**
 * Attributed Persona Card
 * 
 * A reusable card component that clearly shows:
 * - Which AI persona is providing feedback
 * - The persona's locked guardrails count
 * - A configure button to open PersonaConfigurationPanel
 * 
 * Used in all sidebars to replace anonymous "AI Assistant" labels.
 */

import { useState } from 'react';
import { 
  Shield, 
  Settings2, 
  ChevronRight,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import type { PersonaConfig, PersonaId } from '../core/personaTypes';
import type { PersonaCustomization } from '../../../types/aiGovernance';
import { PersonaConfigurationPanel } from './PersonaConfigurationPanel';

interface AttributedPersonaCardProps {
  persona: PersonaConfig;
  customization: PersonaCustomization | null;
  onSaveCustomization: (customization: PersonaCustomization) => void;
  
  // Content props
  children?: React.ReactNode;
  findings?: PersonaFinding[];
  
  // Display options
  variant?: 'compact' | 'expanded';
  showFindings?: boolean;
}

export interface PersonaFinding {
  id: string;
  type: 'error' | 'warning' | 'suggestion' | 'info';
  title: string;
  description?: string;
  field?: string;
  rule?: string;
  autoFixAvailable?: boolean;
  onAccept?: () => void;
  onDismiss?: () => void;
  onAutoFix?: () => void;
}

export function AttributedPersonaCard({
  persona,
  customization,
  onSaveCustomization,
  children,
  findings = [],
  variant = 'expanded',
  showFindings = true,
}: AttributedPersonaCardProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [expandedFindingId, setExpandedFindingId] = useState<string | null>(null);
  
  const errorCount = findings.filter(f => f.type === 'error').length;
  const warningCount = findings.filter(f => f.type === 'warning').length;
  const suggestionCount = findings.filter(f => f.type === 'suggestion').length;
  
  return (
    <>
      <div className={`rounded-lg border overflow-hidden ${persona.color.border} ${persona.color.bg}`}>
        {/* Header - Always visible */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Persona Avatar */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${persona.color.bg} border ${persona.color.border}`}>
              <Shield className={`w-5 h-5 ${persona.color.icon}`} />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${persona.color.text}`}>
                  {persona.name}
                </span>
                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-white/60 text-xs text-slate-600 rounded">
                  <Lock className="w-3 h-3" />
                  {persona.validationRules.length} rules
                </span>
              </div>
              
              {/* Finding Counts */}
              {findings.length > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  {errorCount > 0 && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errorCount}
                    </span>
                  )}
                  {warningCount > 0 && (
                    <span className="text-xs text-amber-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {warningCount}
                    </span>
                  )}
                  {suggestionCount > 0 && (
                    <span className="text-xs text-blue-600 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      {suggestionCount}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Configure Button */}
          <button
            onClick={() => setIsConfigOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors border border-slate-200"
          >
            <Settings2 className="w-3.5 h-3.5" />
            Configure
          </button>
        </div>
        
        {/* Findings List */}
        {showFindings && findings.length > 0 && (
          <div className="border-t border-slate-200 bg-white divide-y divide-slate-100">
            {findings.map(finding => (
              <FindingItem
                key={finding.id}
                finding={finding}
                isExpanded={expandedFindingId === finding.id}
                onToggle={() => setExpandedFindingId(
                  expandedFindingId === finding.id ? null : finding.id
                )}
                personaColor={persona.color}
              />
            ))}
          </div>
        )}
        
        {/* Custom Content */}
        {children && (
          <div className="border-t border-slate-200 bg-white p-4">
            {children}
          </div>
        )}
        
        {/* Empty State */}
        {showFindings && findings.length === 0 && !children && (
          <div className="border-t border-slate-200 bg-white p-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-sm text-slate-600">All checks passed</div>
          </div>
        )}
      </div>
      
      {/* Configuration Modal */}
      <PersonaConfigurationPanel
        persona={persona}
        customization={customization}
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSaveCustomization={onSaveCustomization}
      />
    </>
  );
}

// ==========================================
// FINDING ITEM COMPONENT
// ==========================================

interface FindingItemProps {
  finding: PersonaFinding;
  isExpanded: boolean;
  onToggle: () => void;
  personaColor: PersonaConfig['color'];
}

function FindingItem({ finding, isExpanded, onToggle, personaColor }: FindingItemProps) {
  const getTypeStyles = () => {
    switch (finding.type) {
      case 'error':
        return { bg: 'bg-red-50', icon: AlertTriangle, iconColor: 'text-red-500', textColor: 'text-red-900' };
      case 'warning':
        return { bg: 'bg-amber-50', icon: AlertTriangle, iconColor: 'text-amber-500', textColor: 'text-amber-900' };
      case 'suggestion':
        return { bg: 'bg-blue-50', icon: Info, iconColor: 'text-blue-500', textColor: 'text-blue-900' };
      case 'info':
      default:
        return { bg: 'bg-slate-50', icon: Info, iconColor: 'text-slate-500', textColor: 'text-slate-900' };
    }
  };
  
  const styles = getTypeStyles();
  const Icon = styles.icon;
  
  return (
    <div className={`${isExpanded ? styles.bg : 'bg-white hover:bg-slate-50'} transition-colors`}>
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-start gap-3 text-left"
      >
        <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${styles.iconColor}`} />
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium ${styles.textColor} line-clamp-2`}>
            {finding.title}
          </div>
          {finding.field && (
            <div className="text-xs text-slate-500 mt-0.5">
              Field: {finding.field}
            </div>
          )}
        </div>
        <ChevronRight className={`w-4 h-4 text-slate-400 mt-0.5 transition-transform ${
          isExpanded ? 'rotate-90' : ''
        }`} />
      </button>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 ml-7">
          {finding.description && (
            <p className="text-sm text-slate-600 mb-3">{finding.description}</p>
          )}
          
          {finding.rule && (
            <div className="text-xs text-slate-500 mb-3 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Rule: {finding.rule}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            {finding.autoFixAvailable && finding.onAutoFix && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  finding.onAutoFix?.();
                }}
                className="px-3 py-1.5 text-xs font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Auto-fix
              </button>
            )}
            
            {finding.onAccept && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  finding.onAccept?.();
                }}
                className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Accept
              </button>
            )}
            
            {finding.onDismiss && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  finding.onDismiss?.();
                }}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// COMPACT VARIANT
// ==========================================

interface CompactPersonaBadgeProps {
  persona: PersonaConfig;
  onClick?: () => void;
}

export function CompactPersonaBadge({ persona, onClick }: CompactPersonaBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${persona.color.bg} border ${persona.color.border} hover:opacity-80 transition-opacity`}
    >
      <Shield className={`w-3.5 h-3.5 ${persona.color.icon}`} />
      <span className={`text-xs font-medium ${persona.color.text}`}>
        {persona.name}
      </span>
      <span className="text-xs text-slate-500 flex items-center gap-0.5">
        <Lock className="w-2.5 h-2.5" />
        {persona.validationRules.length}
      </span>
    </button>
  );
}

// ==========================================
// INLINE ATTRIBUTION
// ==========================================

interface InlinePersonaAttributionProps {
  persona: PersonaConfig;
  message: string;
  timestamp?: string;
}

export function InlinePersonaAttribution({ 
  persona, 
  message,
  timestamp,
}: InlinePersonaAttributionProps) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${persona.color.bg} border ${persona.color.border}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${persona.color.border}`}>
        <Shield className={`w-4 h-4 ${persona.color.icon}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${persona.color.text}`}>
            {persona.name}
          </span>
          {timestamp && (
            <span className="text-xs text-slate-400">{timestamp}</span>
          )}
        </div>
        <p className="text-sm text-slate-700 mt-1">{message}</p>
      </div>
    </div>
  );
}
