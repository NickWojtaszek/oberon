/**
 * Project - A clinical research study/project
 * Each project contains its own protocols, data, personas, etc.
 */
export interface Project {
  id: string;
  name: string;                    // e.g., "Phase II Clinical Study"
  studyNumber: string;             // e.g., "STUDY-2026-001"
  description: string;
  phase?: string;                  // e.g., "Phase I", "Phase II", "Phase III", "Phase IV"
  status: 'active' | 'paused' | 'completed' | 'archived';
  createdAt: string;
  modifiedAt: string;
  
  // NEW: Study DNA - defines the research methodology and auto-configuration
  studyDesign?: any;               // StudyDesignConfiguration from studyDesigns.ts
  
  // Phase 3: Methodology-Driven Configuration (from Project Setup Wizard)
  studyMethodology?: {
    studyType: 'rct' | 'prospective-cohort' | 'retrospective-case-series' | 'laboratory-investigation' | 'technical-note';
    configuredAt: string;
    configuredBy: string;
    
    // Team DNA Configuration
    teamConfiguration?: {
      assignedPersonas: Array<{
        role: string;
        permissionLevel: 'read' | 'write' | 'admin';
        blinded: boolean;
        aiAutonomyCap: 'audit-only' | 'suggest' | 'co-pilot' | 'supervisor';
        certified: boolean;
        restrictedVariables?: string[];
      }>;
      locked: boolean;
      lockedAt?: string;
      piSignature?: string;
    };
    
    // Blinding State (for RCTs and blinded studies)
    blindingState?: {
      protocol: 'none' | 'single-blind' | 'double-blind' | 'triple-blind';
      isUnblinded: boolean;
      unblindedAt?: string;
      unblindedBy?: string;
      unblindingReason?: string;
      preUnblindingChecklistCompleted: boolean;
      digitalSignature?: string;
      auditTrail: Array<{
        timestamp: string;
        action: 'configured' | 'locked' | 'unblinded' | 'modified';
        performedBy: string;
        details: string;
      }>;
    };
    
    // Research Hypothesis (from PICO framework)
    hypothesis?: {
      picoFramework: {
        population: string;
        intervention: string;
        comparison: string;
        outcome: string;
      };
      researchQuestion: string;
      variables: Array<{
        name: string;
        type: string;
        grounded: boolean;
        boundTo?: string;
      }>;
      validatedAt?: string;
    };
    
    // Foundational Papers (Base Studies for the research)
    foundationalPapers?: Array<{
      title: string;
      authors: string;
      year: string;
      journal: string;
      doi?: string;
      fileName: string;
      extractedAt: string;
      pico: {
        population: string;
        intervention: string;
        comparison: string;
        outcome: string;
      };
      protocolElements: {
        inclusionCriteria: string[];
        exclusionCriteria: string[];
        primaryEndpoint: string;
        secondaryEndpoints: string[];
        sampleSize: string;
        statisticalApproach: string;
        followUpDuration: string;
      };
    }>;
  };
  
  // Future-proofing for collaboration (Phase 2+)
  owner?: string;                  // User ID (for future use)
  collaborators?: string[];        // User IDs (for future use)
  settings?: {
    allowCollaboration?: boolean;
    publicAccess?: boolean;
  };
  
  // GOVERNANCE: Role-based access and institutional controls (optional, backward-compatible)
  // If missing, defaults to 'solo' mode with 'pi' role (full access)
  governance?: {
    mode: 'solo' | 'team' | 'institutional';
    ownerRole: 'pi' | 'junior' | 'statistician' | 'data_entry' | 'institutional_admin';
    ownerId: string;
    ownerName: string;
    teamMembers?: Array<{
      id: string;
      name: string;
      email: string;
      role: 'pi' | 'junior' | 'statistician' | 'data_entry';
      invitedAt: string;
      acceptedAt?: string;
    }>;
    institutionalPolicy?: {
      institutionId: string;
      institutionName: string;
      maxAutonomy: 'audit' | 'co-pilot' | 'pilot';
      enforceAuditDisclosure: boolean;
      requireManifestLock: boolean;
    };
    licenseInfo?: {
      tier: 'solo' | 'lab' | 'institutional';
      expiresAt: string;
      seatCount: number;
    };
  };
}