// Ethics Compliance Checker - Export blocking and validation

import type { EthicsCompliance, IRBStatus } from '../types/ethics';

export interface ComplianceCheckResult {
  isCompliant: boolean;
  canExport: boolean;
  status: IRBStatus;
  warnings: string[];
  errors: string[];
  message: string;
}

/**
 * Check if a project can export manuscripts based on IRB compliance
 */
export function checkExportCompliance(projectId: string): ComplianceCheckResult {
  const storageKey = `ethics_compliance_${projectId}`;
  const stored = localStorage.getItem(storageKey);

  if (!stored) {
    return {
      isCompliant: false,
      canExport: false,
      status: 'NONE',
      warnings: [],
      errors: ['No IRB compliance data found for this project'],
      message: '❌ IRB approval required before exporting manuscripts'
    };
  }

  const compliance: EthicsCompliance = JSON.parse(stored);

  // Check expiration
  if (compliance.expirationDate) {
    const expirationTime = new Date(compliance.expirationDate).getTime();
    const now = Date.now();
    
    if (expirationTime < now) {
      return {
        isCompliant: false,
        canExport: false,
        status: 'EXPIRED',
        warnings: [],
        errors: [`IRB approval expired on ${new Date(compliance.expirationDate).toLocaleDateString()}`],
        message: `❌ IRB approval expired. Renewal required before export.`
      };
    }
  }

  // Check status
  switch (compliance.irbStatus) {
    case 'APPROVED':
      const warnings: string[] = [];
      
      // Check renewal due date
      if (compliance.renewalDueDate) {
        const renewalTime = new Date(compliance.renewalDueDate).getTime();
        const now = Date.now();
        const daysUntilRenewal = Math.ceil((renewalTime - now) / (24 * 60 * 60 * 1000));
        
        if (daysUntilRenewal < 30 && daysUntilRenewal > 0) {
          warnings.push(`Continuing review due in ${daysUntilRenewal} days`);
        }
      }
      
      return {
        isCompliant: true,
        canExport: true,
        status: 'APPROVED',
        warnings,
        errors: [],
        message: `✅ IRB approved. Export allowed (Approval #${compliance.approvalNumber})`
      };

    case 'REJECTED':
      return {
        isCompliant: false,
        canExport: false,
        status: 'REJECTED',
        warnings: [],
        errors: ['IRB submission was rejected'],
        message: '❌ IRB approval rejected. Address committee concerns before export.'
      };

    case 'PENDING':
      return {
        isCompliant: false,
        canExport: false,
        status: 'PENDING',
        warnings: ['IRB submission is pending review'],
        errors: [],
        message: '⚠️ IRB approval pending. Cannot export until approved.'
      };

    case 'EXPIRED':
      return {
        isCompliant: false,
        canExport: false,
        status: 'EXPIRED',
        warnings: [],
        errors: ['IRB approval has expired'],
        message: '❌ IRB approval expired. Renewal required.'
      };

    case 'NONE':
    default:
      return {
        isCompliant: false,
        canExport: false,
        status: 'NONE',
        warnings: [],
        errors: ['No IRB approval on file'],
        message: '❌ IRB approval required. Submit to ethics committee before export.'
      };
  }
}

/**
 * Get IRB status summary for display
 */
export function getIRBStatusSummary(projectId: string): {
  status: IRBStatus;
  approvalNumber?: string;
  expirationDate?: string;
  daysUntilExpiration?: number;
} | null {
  const storageKey = `ethics_compliance_${projectId}`;
  const stored = localStorage.getItem(storageKey);

  if (!stored) return null;

  const compliance: EthicsCompliance = JSON.parse(stored);
  
  let daysUntilExpiration: number | undefined;
  if (compliance.expirationDate) {
    const expirationTime = new Date(compliance.expirationDate).getTime();
    const now = Date.now();
    daysUntilExpiration = Math.ceil((expirationTime - now) / (24 * 60 * 60 * 1000));
  }

  return {
    status: compliance.irbStatus,
    approvalNumber: compliance.approvalNumber,
    expirationDate: compliance.expirationDate,
    daysUntilExpiration
  };
}
