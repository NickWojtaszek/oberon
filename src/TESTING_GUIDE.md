# 🧪 Governance System Testing Guide

**Quick Start:** How to test the role-based access control system

---

## ✅ Pre-requisites

The governance system is now **ENABLED** with these flags:

```typescript
// /config/featureFlags.ts
ENABLE_RBAC: true        // ✅ Role system active
ENABLE_AI_POLICY: true   // ✅ AI restrictions active
```

---

## 📍 Step-by-Step Testing Instructions

### **Step 1: Enable Research Factory UI**

1. Look at the **top of your application**
2. Find the toggle that says **"Research Factory UI"**
3. Click it to **ON** (should turn blue/active)

This switches you from the classic UI to the new Research Factory interface with the Golden Grid layout.

---

### **Step 2: Select or Create a Project**

1. If you have existing projects:
   - Select one from the project dropdown
   
2. If you don't have a project yet:
   - Click "Create New Project"
   - Give it a name (e.g., "Test Governance Project")
   - Click Create

**What happens:** New projects automatically get governance metadata with PI role as default.

---

### **Step 3: Look for the Role Badge**

After selecting a project, look at the **top bar (Global Header)**:

```
📊 Dashboard > Academic Writing    [👑 Principal Investigator]    [Audit | Co-Pilot | Pilot]
                                    ↑ ROLE BADGE (amber colored)
```

**You should see:**
- An **amber badge** with a **crown icon** (👑)
- Text saying **"Principal Investigator"**
- This is your current role!

**If you DON'T see it:**
- Make sure you're in Research Factory UI (toggle at top)
- Make sure you have a project selected
- Check that `ENABLE_RBAC: true` in `/config/featureFlags.ts`

---

### **Step 4: Find the Governance Tab**

Look at the **left navigation panel**. You should see a new tab:

```
📊 Dashboard
⚗️ Protocol Workbench
📁 Protocol Library
📝 Academic Writing
👤 Persona Editor
📊 Analytics
💾 Data Management
🛡️ Governance  ← NEW! Click this!
```

**Click the Governance tab** (shield icon).

---

### **Step 5: Use the Role Switcher**

On the Governance Dashboard page:

1. Look at the **top-right corner**
2. You'll see a large button showing your current role:
   ```
   [👑 Principal Investigator]
        Click to switch role
        [▼]
   ```

3. **Click this button** to open the role switcher dropdown

4. You'll see **5 available roles:**
   - 👑 **Principal Investigator** (full access)
   - 🎓 **Junior Researcher** (limited access)
   - 📊 **Statistician** (analytics focus)
   - 💾 **Data Entry Clerk** (database only)
   - 🏢 **Institutional Admin** (oversight)

5. **Click on "Junior Researcher"**

---

### **Step 6: Observe the Changes**

After switching to Junior Researcher, watch for these changes:

#### **A. Role Badge Changes:**
```
[🎓 Junior Researcher]  ← Badge turns BLUE, icon changes
```

#### **B. Navigation Tabs Change:**
Some tabs **disappear**:
```
📊 Dashboard            ✅ Still visible
💾 Data Management      ✅ Still visible  
📝 Academic Writing     ✅ Still visible
📚 Protocol Library     👁️ Visible (read-only)
⚗️ Protocol Workbench   ❌ HIDDEN
👤 Persona Editor       ❌ HIDDEN
📊 Analytics            ❌ HIDDEN
🛡️ Governance           ✅ Still visible
```

#### **C. AI Autonomy Slider Changes:**
```
Before (as PI):
[Audit] [Co-Pilot] [Pilot]  ← All 3 clickable

After (as Junior):
[Audit] [Co-Pilot 🔒] [Pilot 🔒]  ← Only Audit available
```

#### **D. Permission Matrix Updates:**
Scroll down on the Governance Dashboard to see the permission tables update.

---

### **Step 7: Test Different Roles**

Switch between roles and observe:

#### **As PI (Principal Investigator):**
- ✅ See ALL tabs
- ✅ All buttons enabled
- ✅ All 3 AI modes available
- ✅ Can export final packages

#### **As Junior Researcher:**
- ❌ Can't see Protocol Workbench
- ❌ Can't see Analytics
- ❌ Can't see Persona Editor
- 🔒 AI locked to Audit mode only
- ✅ Can enter data
- ✅ Can draft manuscripts

#### **As Statistician:**
- 👁️ Protocol tabs are read-only
- ✅ Full access to Analytics
- 💬 Can comment on manuscripts (not edit)
- ✅ Audit + Co-Pilot AI modes
- ❌ Can't export final

#### **As Data Entry Clerk:**
- ✅ Only sees Dashboard and Data Management
- ❌ Everything else hidden
- 🔒 AI locked to Audit mode

---

## 🎯 What to Look For

### **Visual Indicators:**

1. **Role Badge Color:**
   - 🟡 Amber = PI
   - 🔵 Blue = Junior
   - 🟣 Purple = Statistician
   - ⚪ Slate = Data Entry
   - 🟢 Green = Institutional Admin

2. **Lock Icons (🔒):**
   - On restricted AI modes
   - On read-only tabs
   - On disabled buttons

3. **Access Labels:**
   - "Read-only" on tabs you can't edit
   - "Comment-only" on limited write access

### **Functional Changes:**

1. **Tab Filtering:**
   - Junior can't access Protocol Workbench
   - Data Entry only sees Database

2. **Button States:**
   - Export button disabled for non-PI
   - Grayed out, cursor: not-allowed

3. **AI Mode Restrictions:**
   - Junior: Only Audit
   - Statistician: Audit + Co-Pilot
   - PI: All three (unless institutional policy)

---

## 🐛 Troubleshooting

### **Problem: I don't see the role badge**

**Solutions:**
1. Make sure you're in **Research Factory UI** (toggle at top)
2. Make sure you have a **project selected**
3. Check feature flags are enabled:
   ```typescript
   ENABLE_RBAC: true  // Must be true
   ```
4. Refresh the page

---

### **Problem: I don't see the Governance tab**

**Solutions:**
1. Check `ENABLE_RBAC: true` in featureFlags.ts
2. Make sure you're in Research Factory UI
3. Scroll down in the left navigation (it's at the bottom)
4. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

### **Problem: Switching roles doesn't change anything**

**Solutions:**
1. After switching, **navigate to a different tab** then back
2. The role badge should update immediately
3. Check the Governance Dashboard permission matrix
4. Make sure `ENABLE_AI_POLICY: true` for AI restrictions

---

### **Problem: All tabs are still visible as Junior**

**Check:**
1. Did the role badge actually change?
2. Is `ENABLE_RBAC` still `true`?
3. Try refreshing the page after role switch
4. Check browser console for errors

---

## 📊 Expected Behavior Matrix

| Role | Protocol Tabs | Analytics | Writing | Database | AI Modes |
|------|--------------|-----------|---------|----------|----------|
| **PI** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | All 3 |
| **Junior** | ❌ Hidden | ❌ Hidden | ✅ Full | ✅ Full | Audit only |
| **Statistician** | 👁️ Read | ✅ Full | 💬 Comment | 👁️ Read | Audit + Co-Pilot |
| **Data Entry** | ❌ Hidden | ❌ Hidden | ❌ Hidden | ✅ Full | Audit only |
| **Admin** | 👁️ Read | 👁️ Read | 👁️ Read | 👁️ Read | All 3 |

---

## 🔄 Reset to Default

To disable governance and return to normal:

```typescript
// /config/featureFlags.ts
ENABLE_RBAC: false
ENABLE_AI_POLICY: false
```

**Save and refresh** → All restrictions removed!

---

## ✅ Success Checklist

After testing, you should have observed:

- [ ] Role badge visible in Global Header
- [ ] Role badge changes color when switching roles
- [ ] Governance tab appears in navigation
- [ ] Role switcher works on Governance Dashboard
- [ ] Tabs hide/show based on role
- [ ] AI modes lock/unlock based on role
- [ ] Permission matrix updates when role changes
- [ ] Read-only indicators appear where appropriate
- [ ] Can switch back to PI and regain full access

---

## 📸 Visual Guide

### **Where to Click:**

```
┌─────────────────────────────────────────────────────────┐
│ Research Factory UI: [ON]  ← Step 1: Toggle this        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Breadcrumb  [👑 PI]  Journal  [Audit|Co-Pilot|Pilot]    │
│              ↑ Step 3: See this badge                    │
└─────────────────────────────────────────────────────────┘

┌─────────┬───────────────────────────────────────────────┐
│ 📊 Dash │  Governance Dashboard                         │
│ ⚗️ Proto│                                               │
│ 📁 Lib  │  [👑 Principal Investigator ▼]               │
│ 📝 Write│   ↑ Step 5: Click this                        │
│ 👤 Pers │                                               │
│ 📊 Analy│  Permission Matrix:                           │
│ 💾 Data │  ✅ Protocol: Full Access                     │
│ 🛡️ Gov  │  ✅ Analytics: Full Access                   │
│  ↑      │  ✅ Writing: Full Access                      │
│  Step 4 │                                               │
└─────────┴───────────────────────────────────────────────┘
```

---

## 🎓 Next Steps

Once you've tested basic role switching:

1. **Try exporting** as different roles (should fail for non-PI)
2. **Navigate between tabs** as Junior (some are hidden)
3. **Check AI slider** changes per role
4. **Read the permission matrix** on Governance Dashboard

---

**Questions?** Check `/docs/GOVERNANCE_SPECIFICATION.md` for full details!

**Issues?** Set `ENABLE_RBAC: false` to instantly disable and return to normal!

---

**Happy Testing!** 🚀
