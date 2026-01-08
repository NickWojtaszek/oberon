# Governance System - Developer Quick Start

**Status:** Foundation Complete (Phase 0)  
**Feature Flags:** All OFF (Zero impact on production)

---

## TL;DR - What Just Got Built

We added a **Role-Based Access Control (RBAC) foundation** that's:
- ✅ **Completely inactive** by default (all flags OFF)
- ✅ **Backward compatible** (existing code unchanged)
- ✅ **Rollback-safe** (single line to disable)
- ✅ **Ready to enable** when needed

---

## Quick Reference

### Import the Governance Hook

```typescript
import { useGovernance } from '../hooks/useGovernance';

function MyComponent() {
  const {
    role,               // Current user role: 'pi' | 'junior' | 'statistician' | etc.
    roleName,           // Display name: "Principal Investigator"
    isPI,               // Quick check: Is user PI?
    canAccessTab,       // Function: Can user access tab?
    canPerformAction,   // Function: Can user perform action?
    permissions,        // Full permissions object
  } = useGovernance();
  
  return (
    <div>
      <h1>Welcome, {roleName}</h1>
      {isPI && <button>Lock Manifest</button>}
    </div>
  );
}
```

---

## Common Use Cases

### 1. Conditional Rendering Based on Role

```typescript
import { useGovernance } from '../hooks/useGovernance';
import { FEATURE_FLAGS } from '../config/featureFlags';

function ExportButton() {
  const { canExportFinal } = useGovernance();
  
  // Only show export button if user has permission
  if (FEATURE_FLAGS.ENABLE_RBAC && !canExportFinal) {
    return null; // or <LockedButton />
  }
  
  return <button onClick={handleExport}>Export Final</button>;
}
```

### 2. Tab Visibility Control

```typescript
import { useTabAccess } from '../hooks/useGovernance';

function ProtocolTab() {
  const { canAccess, isReadOnly, isHidden } = useTabAccess('protocol');
  
  if (isHidden) return null;
  
  return (
    <div>
      <h2>Protocol Design</h2>
      {isReadOnly && <span>Read-only mode</span>}
      {/* ... content */}
    </div>
  );
}
```

### 3. AI Autonomy Restrictions

```typescript
import { useAIAutonomy } from '../hooks/useGovernance';

function AutonomySlider() {
  const { availableModes, maxLevel, isRestricted } = useAIAutonomy();
  
  return (
    <div>
      {availableModes.map(mode => (
        <button key={mode}>{mode}</button>
      ))}
      {isRestricted && (
        <span>Limited by institutional policy</span>
      )}
    </div>
  );
}
```

### 4. Action Permission Check

```typescript
import { usePermission } from '../hooks/useGovernance';

function LockManifestButton() {
  const canLock = usePermission('lock-manifest');
  
  return (
    <button disabled={!canLock}>
      {canLock ? 'Lock Manifest' : 'PI Only'}
    </button>
  );
}
```

---

## Feature Flag Control

### Enable Governance Features (Development)

```typescript
// /config/featureFlags.ts

export const FEATURE_FLAGS = {
  ENABLE_RBAC: true,  // ← Turn on role system
  // ... other flags
};
```

### Disable All Features (Rollback)

```typescript
export const FEATURE_FLAGS = {
  ENABLE_RBAC: false,  // ← Everything disabled
  ENABLE_TEAM_MODE: false,
  ENABLE_INSTITUTIONAL: false,
  ENABLE_AI_POLICY: false,
  ENABLE_MANIFEST_LOCKING: false,
  ENABLE_AUDIT_DISCLOSURE: false,
};
```

---

## Role Types

```typescript
type UserRole = 
  | 'pi'                  // Principal Investigator - Full access
  | 'junior'              // Junior Researcher - Limited, AI locked to Audit
  | 'statistician'        // Statistician - Analytics focus
  | 'data_entry'          // Data Entry - Database only
  | 'institutional_admin' // Admin - Policy control
```

---

## Permission Matrix (Quick Reference)

| Action | PI | Junior | Statistician |
|--------|----|----|-----|
| Create Project | ✅ | ❌ | ❌ |
| Edit Protocol | ✅ | ❌ | ❌ |
| Enter Data | ✅ | ✅ | ❌ |
| Run Analytics | ✅ | ❌ | ✅ |
| Draft Manuscript | ✅ | ✅ | 💬 |
| Lock Manifest | ✅ | ❌ | ❌ |
| Export Final | ✅ | ❌ | ❌ |
| Use Pilot AI | ✅ | ❌ | ✅ |

**Legend:** ✅ Full | ❌ No | 💬 Comment-only

---

## Helper Functions (Without Hook)

If you need permission checks outside React components:

```typescript
import { 
  getUserRole,
  canAccessTab,
  canPerformAction,
  getMaxAIAutonomy 
} from '../utils/governanceHelper';

// Get role from project
const role = getUserRole(project); // Returns 'pi' if no governance

// Check permission
const canEdit = canPerformAction('edit-protocol', role);

// Check tab access
const hasAccess = canAccessTab('analytics', role);

// Get AI limit
const maxAI = getMaxAIAutonomy(role, institutionalPolicy);
```

---

## Project Structure (New Files)

```
/config/
  featureFlags.ts           ← Feature flag definitions

/types/
  governance.ts             ← Governance type definitions
  shared.ts                 ← Extended with governance field

/utils/
  governanceHelper.ts       ← Permission check functions
  roleMapping.ts            ← Auth ↔ Governance role mapping

/hooks/
  useGovernance.ts          ← Main governance hook

/docs/
  GOVERNANCE_SPECIFICATION.md        ← Full spec
  GOVERNANCE_IMPLEMENTATION_STATUS.md ← Implementation tracker
  GOVERNANCE_QUICK_START.md          ← This file
```

---

## When to Use Governance Checks

### ✅ DO use governance checks when:
- Showing/hiding UI elements based on role
- Enabling/disabling actions based on permissions
- Filtering AI autonomy modes
- Checking if manifest is locked
- Controlling tab visibility

### ❌ DON'T use governance checks when:
- Core data operations (storage, etc.)
- Utility functions
- Type definitions
- Non-permission-related logic

### 💡 PATTERN: Always wrap in feature flag

```typescript
// GOOD
{FEATURE_FLAGS.ENABLE_RBAC && !canEditProtocol && (
  <LockIcon />
)}

// BAD (breaks when flag OFF)
{!canEditProtocol && <LockIcon />}
```

---

## Testing Your Code

### Test Checklist:

1. **Feature Flag OFF:**
   ```typescript
   ENABLE_RBAC: false
   ```
   - [ ] Component renders normally
   - [ ] All features accessible
   - [ ] No console errors

2. **Feature Flag ON + PI Role:**
   ```typescript
   ENABLE_RBAC: true
   role: 'pi'
   ```
   - [ ] Component renders normally
   - [ ] All features accessible
   - [ ] Role badge visible

3. **Feature Flag ON + Junior Role:**
   ```typescript
   ENABLE_RBAC: true
   role: 'junior'
   ```
   - [ ] Restricted features hidden/disabled
   - [ ] Lock icons visible
   - [ ] No errors when clicking disabled items

---

## Common Patterns

### Pattern 1: Conditional Button

```typescript
function ActionButton() {
  const { canPerformAction } = useGovernance();
  
  if (FEATURE_FLAGS.ENABLE_RBAC && !canPerformAction('export')) {
    return (
      <button disabled className="opacity-50 cursor-not-allowed">
        <Lock className="w-4 h-4" />
        Export (PI Only)
      </button>
    );
  }
  
  return <button onClick={handleExport}>Export</button>;
}
```

### Pattern 2: Tab with Access Control

```typescript
function AnalyticsTab() {
  const { canAccessTab, getTabAccessLevel } = useGovernance();
  const accessLevel = getTabAccessLevel('analytics');
  
  if (!canAccessTab('analytics')) {
    return <AccessDeniedMessage />;
  }
  
  return (
    <div>
      {accessLevel === 'read' && <ReadOnlyBanner />}
      <AnalyticsContent readOnly={accessLevel === 'read'} />
    </div>
  );
}
```

### Pattern 3: AI Mode Filter

```typescript
function AutonomySlider({ value, onChange }) {
  const { availableAIModes } = useGovernance();
  
  const modes = FEATURE_FLAGS.ENABLE_AI_POLICY 
    ? availableAIModes 
    : ['audit', 'co-pilot', 'pilot'];
  
  return (
    <div>
      {modes.map(mode => (
        <button 
          key={mode}
          onClick={() => onChange(mode)}
          className={value === mode ? 'active' : ''}
        >
          {mode}
        </button>
      ))}
    </div>
  );
}
```

---

## FAQs

### Q: Will this break existing code?
**A:** No. All flags are OFF by default. Existing code continues working.

### Q: What if I forget to check permissions?
**A:** If flags are OFF, everything works normally. When flags ON, helpers return safe defaults (PI permissions).

### Q: How do I test different roles?
**A:** Enable `ENABLE_RBAC` flag, then update project.governance.ownerRole in localStorage.

### Q: Can I enable features for just one project?
**A:** Feature flags are global, but individual projects can have different governance metadata.

### Q: What if I need to rollback?
**A:** Set all flags to `false`. Instant rollback.

---

## Next Steps

1. **Read Full Spec:** `/docs/GOVERNANCE_SPECIFICATION.md`
2. **Check Status:** `/docs/GOVERNANCE_IMPLEMENTATION_STATUS.md`
3. **Test in Dev:** Enable `ENABLE_RBAC` and try role switching
4. **Implement Phase 1:** Add role selector UI

---

**Questions?** Check the full specification or implementation status docs.

**Ready to implement?** Start with Phase 1 (Silent Role System).
