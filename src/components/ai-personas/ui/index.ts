/**
 * AI Governance and Persona UI Components
 * 
 * This barrel file exports all the new unified AI persona governance components.
 */

// Configuration Panel (modal for configuring persona settings)
export { PersonaConfigurationPanel } from './PersonaConfigurationPanel';

// Attribution components (for sidebars and inline use)
export { 
  AttributedPersonaCard,
  CompactPersonaBadge,
  InlinePersonaAttribution,
  type PersonaFinding,
} from './AttributedPersonaCard';

// Re-export existing components
export { ModulePersonaPanel } from './ModulePersonaPanel';
