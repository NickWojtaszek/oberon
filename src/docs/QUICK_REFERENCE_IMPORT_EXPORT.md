# Data Import/Export - Quick Reference Card

## 🎯 5-Minute Quick Start

### Export Current Data
1. Navigate to **Data Import/Export** (sidebar bottom)
2. Click **Export Data** tab
3. Click **Export All Data** button
4. Save JSON file

### Generate Mock Data
1. Click **Mock Data Template** tab
2. Click **Generate Template**
3. Copy JSON or download
4. Paste into Claude/Gemini/GPT-4
5. Add prompt: *"Fill this with realistic Phase III cardiovascular trial data for 300 patients"*
6. Save AI response as JSON

### Import Data
1. Click **Import Data** tab
2. Select JSON file
3. Choose import mode: **Update Existing** (recommended)
4. Click **Import Data**
5. Wait for success message
6. Page refreshes with new data

---

## 📦 What Gets Exported

| Data Type | Includes |
|-----------|----------|
| **Projects** | Settings, configuration, study parameters |
| **Protocols** | Schema blocks, versions, validations |
| **Clinical Data** | Patient records, visits, measurements |
| **Manuscripts** | Content, sources, citations, reviews |
| **Statistical** | Analyses, models, test results |
| **Personas** | Roles, permissions, preferences |
| **Templates** | Reusable schema templates |

---

## 🤖 AI Prompt Formula

```
Generate [STUDY TYPE] with [N] patients testing [INTERVENTION]:

Include:
- Patient demographics (age, sex, race, BMI)
- [X] visits over [Y] months  
- Primary endpoint: [ENDPOINT]
- Expected results: [OUTCOME]
- Adverse events: [LIST]
- Complete manuscript with [N] references

Make data medically accurate and internally consistent.

[PASTE TEMPLATE JSON]
```

---

## 🔧 Import Modes

| Mode | When to Use | What Happens |
|------|-------------|--------------|
| **Update** | Most common | Updates existing + adds new |
| **Skip** | Keep current data | Only adds new items |
| **Replace** | ⚠️ Fresh start | Deletes everything first |

---

## ✅ Testing Checklist

After importing mock data:

- [ ] Dashboard shows new project
- [ ] Protocol appears in Protocol Library  
- [ ] Clinical records visible in Database
- [ ] Can run Analytics & Statistics
- [ ] Manuscript loads in Academic Writing
- [ ] No console errors

---

## 🐛 Common Issues

**Import fails:**
- Check JSON syntax (use validator)
- Verify all required fields present
- Review error messages

**Data not visible:**
- Refresh page (F5)
- Check correct project selected
- Verify import success message

**Template too large:**
- Start with 10-20 patients first
- Increase gradually
- Test import before scaling up

---

## 📊 Example Data Sizes

| Study Type | Patients | Visits | Total Records | File Size |
|------------|----------|--------|---------------|-----------|
| Small pilot | 20 | 3 | 60 | ~50 KB |
| Medium trial | 100 | 5 | 500 | ~500 KB |
| Large RCT | 300 | 5 | 1,500 | ~1.5 MB |
| Mega trial | 1,000 | 10 | 10,000 | ~5-8 MB |

---

## 🎓 Study Type Templates

### Randomized Controlled Trial (RCT)
```
Phase III, parallel-group, double-blind
Sample size calculation with power analysis
Treatment vs placebo/active comparator
Primary + secondary endpoints
CONSORT flow diagram
```

### Cohort Study
```
Prospective/retrospective observational
Exposed vs non-exposed groups
Time-to-event outcomes
Confounding adjustment methods
Hazard ratios and survival curves
```

### Case-Control Study
```
Cases with disease vs controls
Matched pairs or frequency matching
Odds ratios for associations
Conditional logistic regression
```

### Laboratory Study
```
In vitro or ex vivo experiments
Multiple experimental conditions
Dose-response relationships
Technical replicates
```

---

## 📋 Required Fields by Data Type

### Project ✅
- name
- studyDesign
- primaryInvestigator
- patientCount
- primaryEndpoint

### Protocol ✅
- protocolNumber
- protocolTitle
- version
- schemaBlocks (at least 1)

### Clinical Record ✅
- recordId
- subjectId
- visitDate
- protocolNumber
- data (matches schema)

### Manuscript ✅
- studyTitle
- manuscriptContent (all IMRaD sections)
- projectId

### Statistical Manifest ✅
- protocolId
- descriptiveStats (at least 1)
- analysisDate

---

## 🚀 Power User Tips

1. **Batch Generate**: Create multiple studies at once
2. **Template Reuse**: Save AI-generated templates
3. **Incremental Testing**: Start small, scale up
4. **Version Control**: Name exports with dates
5. **Backup Before Import**: Export current state first

---

## 📱 Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Navigate to tool | None (use sidebar) |
| Copy template | Ctrl/Cmd + C |
| Download file | Ctrl/Cmd + S |
| Refresh after import | F5 |

---

## 🆘 Emergency Recovery

If import breaks something:

1. **Don't panic** - data is in localStorage
2. Open DevTools → Console
3. Run: `localStorage.getItem('projects')`
4. If corrupted, clear: `localStorage.clear()`
5. Re-import from backup export

---

## 📞 Support Resources

- **Full Guide**: `/docs/DATA_IMPORT_EXPORT_GUIDE.md`
- **AI Prompts**: `/docs/AI_PROMPT_TEMPLATES.md`
- **Code**: `/utils/comprehensiveDataExport.ts`
- **UI**: `/components/DataImportExport.tsx`

---

## 🎯 Success Metrics

After successful import:

```
✅ X projects imported
✅ Y protocols imported  
✅ Z manuscripts imported
✅ N clinical records imported
✅ 0 errors
```

---

## 🔄 Workflow Diagram

```
┌─────────────────┐
│  1. Generate    │
│     Template    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  2. AI Fills    │
│     with Data   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  3. Save as     │
│     JSON File   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  4. Import to   │
│     Platform    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  5. Test All    │
│     Features    │
└─────────────────┘
```

---

**Print this card for quick reference!**

Version 1.0 | Updated: 2026-01-04
