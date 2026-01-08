# Governance & Institutional Architecture Specification

**Version:** 1.0  
**Date:** January 4, 2026  
**Status:** Foundation Implementation In Progress

---

## Executive Summary

This specification defines the transformation of the Clinical Intelligence Engine from a single-user research tool into a **multi-tier, permission-gated institutional platform** with robust governance controls, role-based access, and AI policy enforcement.

---

## 1. Global Hierarchy & User Personas

### Overview
The platform moves from a flat user model to a **Permissions-First Hierarchy**. Visibility of specific tabs and AI autonomy are dictated by the user's assigned persona.

---

### A. Research Responsible Person (PI / Solo Investigator)

**Role:** The ultimate authority and "Root" of the project.

**Permissions:**
- Full visibility of all tabs (Protocol, Data, Analytics, Writing, Lab Management)
- Exclusive Actions:
  - Only persona capable of "Locking" the Statistical Manifest
  - Only persona capable of performing "Final Export" with digital signature
- Delegation:
  - Can invite team members
  - Can set "Visibility Matrix" for each member
  - Example: Hiding Protocol tab from data entry clerk

**UI Indicators:**
- Crown icon next to name
- "Principal Investigator" badge in header
- Access to all "Lock" and "Final Export" buttons

---

### B. Junior Researcher / PhD Student

**Role:** The primary "Builder" of the manuscript under supervision.

**Permissions:**
- Limited visibility
- Typically restricted to:
  - Database (Entry) tab
  - Writing (Drafting) tab
- Protocol and Analytics are often **Read-Only** to prevent "Data Drift"

**AI Hard-Lock:**
- By default, Autonomy Slider is **locked to Audit Mode**
- Ensures pedagogical integrity
- Prevents autonomous AI generation without supervision

**UI Indicators:**
- "Junior Researcher" badge
- Lock icon on Autonomy Slider
- Disabled/hidden Export buttons

---

### C. Statistician (Future)

**Role:** Data analysis and statistical validation specialist.

**Permissions:**
- Full access to Analytics tab
- Read-only access to Database
- Limited access to Writing (can comment, cannot draft)

---

## 2. Institutional Tiering & Distribution

The platform is architected to be sold/distributed in **three tiers**, allowing organizations to control AI influence across departments.

---

### Tier 1: Solo / Essential

**Target Users:** Individual Surgeons, Solo Practitioners

**Key Features:**
- Manual Audit Mode only
- Standard Export (no team signature)
- No team delegation
- Single-user license

**Price Point:** $X/month (individual)

---

### Tier 2: Lab / Advanced

**Target Users:** University Research Groups, Small Labs

**Key Features:**
- Full Team Hierarchy (PI + up to 10 members)
- Co-Pilot AI enabled
- Journal Constraint Library (30+ journals)
- Team collaboration and delegation
- Multi-project management

**Price Point:** $X/month per lab

---

### Tier 3: Institutional

**Target Users:** Hospitals, Universities, Multi-Lab Organizations

**Key Features:**
- Centralized Admin Panel
- Global AI Policy Enforcement across all labs
- Multi-Lab Reporting and analytics
- Unlimited team members
- Custom journal profiles
- SSO/SAML integration
- Compliance audit logs

**Price Point:** Enterprise pricing (custom)

---

## 3. Top-Down AI Governance (Policy Layer)

For institutional clients (e.g., Medical Schools), the software acts as a **Policy Enforcement Tool**.

---

### Global AI Policy

**Definition:** An Institutional Admin can set a "hard ceiling" on AI autonomy across the entire organization.

**Example Scenarios:**

1. **Medical School Dean:**
   - Disables "Pilot Mode" (generative drafting) for all users tagged as "Student"
   - Enforced across entire university
   - Cannot be overridden by individual PIs

2. **Hospital Ethics Committee:**
   - Restricts all clinical research to "Audit Mode" only
   - Ensures all AI suggestions require human review
   - Policy logged in exported manuscripts

3. **Research Institute:**
   - Allows "Co-Pilot" for senior researchers
   - Locks junior researchers to "Audit"
   - Policy visible in verification appendix

---

### Audit Disclosure

**Requirement:** The final Verification Appendix explicitly states:
- AI Policy active during manuscript creation
- Role of user who performed export
- Whether any institutional restrictions were in place

**Purpose:** Provides transparency to journal reviewers and ethics committees.

---

## 4. Onboarding & Lab Genesis

The onboarding flow establishes the "Structural DNA" of the research environment before any data entry.

---

### Onboarding Steps

**Step 1: Identity Selection**
- Choose between:
  - "Solo Researcher" (Fast-track, full access)
  - "Lab Lead" (Team setup required)

**Step 2: Persona Assignment** (if Lab Lead selected)
- Invite team members via email
- Assign each member to Visibility Matrix:
  - Junior Researcher
  - Lead Researcher
  - Statistician
  - Data Entry Clerk

**Step 3: Tier Verification**
- System checks license tier (Solo vs. Lab vs. Institutional)
- Hides/shows tabs accordingly
- Displays tier badge in UI

**Step 4: Project Initialization**
- Create first project with governance metadata
- Set default AI policy (based on institutional settings)
- Log initial team roster

---

## 5. Engineering Guardrails for Scaling

To ensure governance changes don't break existing functionality:

---

### A. Role-Based Component Rendering

**Principle:** The UI Shell renders based on `user_role` flag in context.

**Implementation:**
```typescript
// If user is Junior_Student, "Pilot" option doesn't exist in DOM
{userRole === 'pi' && (
  <button>Enable Pilot Mode</button>
)}
```

**Result:** Restricted users cannot access hidden features via browser inspection.

---

### B. Manifest Locking

**Principle:** Backend enforces that only `PI_User_ID` can commit changes to `statisticalManifest` once marked "Verified."

**Implementation:**
```typescript
if (manifest.lockStatus.isLocked && currentUserId !== manifest.lockStatus.lockedBy) {
  throw new Error('Manifest locked by PI. Changes not permitted.');
}
```

**Result:** Data integrity maintained. No accidental overwrites.

---

### C. Policy-Aware Exports

**Principle:** Export engine checks `Global_AI_Policy` before generating Verification Appendix.

**Implementation:**
```typescript
const appendix = generateVerificationAppendix({
  aiPolicy: institutionalPolicy.maxAutonomy,
  userRole: currentUser.role,
  manifestLockStatus: manifest.lockStatus,
});
```

**Result:** Export explicitly states governance context.

---

## 6. The Vision: Chain of Custody

### Core Promise

Whether a user is:
- A one-person surgical team, or
- Part of a 100-person global trial

...the platform maintains a **"Chain of Custody"** from raw clinical data to final published claim.

**PI maintains:** Total oversight and final authority  
**Institution maintains:** Total rigor and policy compliance  
**Journal receives:** Full transparency via Verification Appendix

---

## 7. Implementation Phases

### Phase 0: Foundation (Week 1) ✅ IN PROGRESS
- Feature flag system
- Optional governance schema
- Backward-compatible helpers
- Role state in context

### Phase 1: Silent Role System (Week 2)
- Role selector in PersonaEditor
- Permission matrix definition
- No enforcement yet

### Phase 2: Conditional UI (Week 3)
- Tab visibility restrictions
- Button disable states
- Visual indicators (lock icons)

### Phase 3: AI Restrictions (Week 4)
- Autonomy slider restrictions
- Institutional policy enforcement
- AI mode filtering

### Phase 4: Manifest Locking (Week 5)
- Lock/unlock UI
- Lock status indicator
- PI-only export

### Phase 5: Institutional Admin (Week 6)
- Separate admin route
- Global policy controls
- Multi-lab dashboard

---

## 8. Data Schema (New Fields)

### Project Type Extension

```typescript
interface Project {
  // ... existing fields ...
  
  governance?: {
    mode: 'solo' | 'team' | 'institutional';
    ownerRole: 'pi' | 'junior' | 'statistician';
    ownerId: string;
    teamMembers?: TeamMember[];
    institutionalPolicy?: InstitutionalPolicy;
    licenseInfo?: {
      tier: 'solo' | 'lab' | 'institutional';
      expiresAt: string;
      seatCount: number;
    };
  };
}
```

### TeamMember Type

```typescript
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'pi' | 'junior' | 'statistician' | 'data_entry';
  permissions: {
    canAccessProtocol: boolean;
    canAccessDatabase: boolean;
    canAccessAnalytics: boolean;
    canAccessWriting: boolean;
    canExport: boolean;
    maxAIAutonomy: 'audit' | 'co-pilot' | 'pilot';
  };
  invitedAt: string;
  acceptedAt?: string;
}
```

### InstitutionalPolicy Type

```typescript
interface InstitutionalPolicy {
  institutionId: string;
  institutionName: string;
  maxAutonomy: 'audit' | 'co-pilot' | 'pilot';
  enforceAuditDisclosure: boolean;
  requireManifestLock: boolean;
  allowCustomJournals: boolean;
  adminContact: string;
  policyVersion: string;
  effectiveDate: string;
}
```

### ManifestLockStatus Type

```typescript
interface ManifestLockStatus {
  isLocked: boolean;
  lockedBy: string;        // PI user ID
  lockedByName: string;    // PI display name
  lockedAt: string;        // ISO timestamp
  digitalSignature?: string;
  lockReason?: string;
}
```

---

## 9. Permission Matrix

### Tab Visibility

| Tab | PI | Junior | Statistician | Data Entry |
|-----|----|----|----|----|
| Protocol Design | ✅ Full | 👁️ Read | 👁️ Read | ❌ Hidden |
| Database | ✅ Full | ✅ Full | 👁️ Read | ✅ Full |
| Analytics | ✅ Full | 👁️ Read | ✅ Full | ❌ Hidden |
| Academic Writing | ✅ Full | ✅ Full | 💬 Comment | ❌ Hidden |
| Lab Management | ✅ Full | ❌ Hidden | ❌ Hidden | ❌ Hidden |

### Action Permissions

| Action | PI | Junior | Statistician |
|--------|----|----|-----|
| Create Project | ✅ | ❌ | ❌ |
| Lock Manifest | ✅ | ❌ | ❌ |
| Export Final | ✅ | ❌ | ❌ |
| Edit Protocol | ✅ | ❌ | ❌ |
| Enter Data | ✅ | ✅ | ❌ |
| Run Analytics | ✅ | 👁️ | ✅ |
| Draft Manuscript | ✅ | ✅ | 💬 |
| Use Pilot Mode | ✅ | ❌ (locked) | ✅ |

**Legend:**
- ✅ Full access
- 👁️ Read-only
- 💬 Comment-only
- ❌ No access

---

## 10. Safety & Rollback

### Feature Flag Emergency Rollback

At ANY point, if governance features cause issues:

```typescript
// Single line change
FEATURE_FLAGS.ENABLE_RBAC = false;
```

**Result:** Instant return to single-user mode. All restrictions removed.

### Backward Compatibility Promise

- All existing projects work without governance metadata
- Missing governance = "solo PI mode" (full access)
- No data migration required
- Opt-in enhancement

---

## 11. Next Steps

### Immediate (Week 1)
- [x] Document specification
- [ ] Implement feature flag system
- [ ] Add governance schema to types
- [ ] Create helper functions
- [ ] Add role to PersonaContext

### Short-term (Weeks 2-3)
- [ ] Build role selector UI
- [ ] Add permission checks
- [ ] Create visual indicators

### Medium-term (Weeks 4-6)
- [ ] Implement AI restrictions
- [ ] Build manifest locking
- [ ] Create admin panel

### Long-term
- [ ] SSO integration
- [ ] Audit logging system
- [ ] Multi-tenant architecture
- [ ] API for institutional dashboards

---

**Document Owner:** Clinical Intelligence Engine Team  
**Last Updated:** January 4, 2026  
**Status:** Foundation implementation started
