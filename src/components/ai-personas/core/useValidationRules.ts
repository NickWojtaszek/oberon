// Hook to register all validation rules on app startup

import { useEffect } from 'react';
import { globalValidationEngine } from './validationEngine';
import { SCHEMA_VALIDATION_RULES } from '../validators/schemaValidator';
import { DATA_QUALITY_VALIDATION_RULES } from '../validators/dataQualityValidator';
import { IRB_COMPLIANCE_VALIDATION_RULES } from '../validators/irbComplianceValidator';
import { STATISTICAL_VALIDATION_RULES } from '../validators/statisticalValidator';
import { SAFETY_VALIDATION_RULES } from '../validators/safetyValidator';
import { ENDPOINT_VALIDATION_RULES } from '../validators/endpointValidator';
import { AMENDMENT_VALIDATION_RULES } from '../validators/amendmentValidator';

export function useValidationRules() {
  useEffect(() => {
    // Register all schema validation rules
    globalValidationEngine.registerRules(SCHEMA_VALIDATION_RULES);
    
    // Register all data quality validation rules
    globalValidationEngine.registerRules(DATA_QUALITY_VALIDATION_RULES);
    
    // Register all IRB compliance validation rules
    globalValidationEngine.registerRules(IRB_COMPLIANCE_VALIDATION_RULES);
    
    // Register all statistical validation rules
    globalValidationEngine.registerRules(STATISTICAL_VALIDATION_RULES);
    
    // Register all safety validation rules
    globalValidationEngine.registerRules(SAFETY_VALIDATION_RULES);
    
    // Register all endpoint validation rules
    globalValidationEngine.registerRules(ENDPOINT_VALIDATION_RULES);
    
    // Register all amendment validation rules
    globalValidationEngine.registerRules(AMENDMENT_VALIDATION_RULES);

    console.log('✅ Validation rules registered:', {
      schema: SCHEMA_VALIDATION_RULES.length,
      dataQuality: DATA_QUALITY_VALIDATION_RULES.length,
      irbCompliance: IRB_COMPLIANCE_VALIDATION_RULES.length,
      statistical: STATISTICAL_VALIDATION_RULES.length,
      safety: SAFETY_VALIDATION_RULES.length,
      endpoint: ENDPOINT_VALIDATION_RULES.length,
      amendment: AMENDMENT_VALIDATION_RULES.length,
      total: globalValidationEngine.getRuleSummary().totalRules
    });

    // Cleanup not needed - rules stay registered for app lifetime
  }, []);
}