import { Scan, Blocks, Sigma, Radar, Scale, ShieldAlert, Target, FileDiff, Feather, SearchX } from 'lucide-react';
import type { PersonaId } from '../core/personaTypes';
import { PERSONA_REGISTRY } from '../core/personaRegistry';

interface PersonaBadgeProps {
  personaId: PersonaId;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  onClick?: () => void;
}

const PERSONA_ICONS: Record<PersonaId, any> = {
  'protocol-auditor': Scan,
  'schema-architect': Blocks,
  'statistical-advisor': Sigma,
  'data-quality-sentinel': Radar,
  'ethics-compliance': Scale,
  'safety-vigilance': ShieldAlert,
  'endpoint-validator': Target,
  'amendment-advisor': FileDiff,
  'academic-writing-coach': Feather,
  'manuscript-reviewer': SearchX,
};

export function PersonaBadge({ personaId, size = 'md', showName = true, onClick }: PersonaBadgeProps) {
  const persona = PERSONA_REGISTRY[personaId];
  const Icon = PERSONA_ICONS[personaId];
  
  const sizeClasses = {
    sm: 'h-6 px-2 text-xs gap-1',
    md: 'h-8 px-3 text-sm gap-1.5',
    lg: 'h-10 px-4 text-base gap-2'
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`inline-flex items-center ${sizeClasses[size]} rounded-lg font-medium ${persona.color.bg} ${persona.color.text} ${persona.color.border} border ${
        onClick ? 'hover:opacity-80 transition-opacity cursor-pointer' : 'cursor-default'
      }`}
      title={persona.description}
    >
      {Icon && <Icon className={iconSizes[size]} />}
      {showName && <span>{persona.name}</span>}
    </button>
  );
}
