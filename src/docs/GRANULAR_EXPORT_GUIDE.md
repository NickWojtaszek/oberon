# Granular Export/Import System Guide

## Overview

The Data Import/Export system now supports **granular component selection**, allowing you to export or generate templates for only the specific parts of the Clinical Intelligence Engine you need.

---

## Export Tab - Selective Data Export

### Available Components

You can now select exactly which components to include in your export:

| Component | What It Includes | Use Case |
|-----------|-----------------|----------|
| **☑ Projects** | Project settings, metadata, study design | Share study configuration only |
| **☑ Protocols** | Protocol schemas, versions, schema blocks | Export protocol templates for reuse |
| **☑ Clinical Data** | Patient records, data entries | Backup/transfer patient data |
| **☑ Manuscripts** | Documents, IMRaD content, sources | Share written content |
| **☑ Analytics** | Statistical analyses, results | Export analysis results |
| **☑ Personas** | User roles, permissions, preferences | Transfer team configuration |
| **☑ Templates** | Schema templates, regulatory frameworks | Share reusable templates |

### Features

✅ **Select All / Deselect All** - Quick toggle for all components  
✅ **Selection Counter** - Shows "X of 7 components selected"  
✅ **Dynamic Button** - Shows "Export All Data" or "Export Selected (3)"  
✅ **Validation** - Can't export with nothing selected

### Example Use Cases

#### Use Case 1: Export Only Protocol Schema (No Data)
```
☑ Projects
☑ Protocols
☐ Clinical Data     ← Deselected
☐ Manuscripts
☐ Analytics
☐ Personas
☑ Templates
```
**Result:** Share study protocol design without sensitive patient data

---

#### Use Case 2: Backup Clinical Data Only
```
☐ Projects
☐ Protocols
☑ Clinical Data     ← Only this selected
☐ Manuscripts
☐ Analytics
☐ Personas
☐ Templates
```
**Result:** Backup patient records for compliance/archival

---

#### Use Case 3: Share Analysis Results (No Raw Data)
```
☐ Projects
☑ Protocols         ← Need schema context
☐ Clinical Data     ← No raw data
☑ Manuscripts       ← Include write-up
☑ Analytics         ← Analysis results
☐ Personas
☐ Templates
```
**Result:** Publication-ready export with results but no patient data

---

#### Use Case 4: Complete System Backup
```
☑ Projects
☑ Protocols
☑ Clinical Data
☑ Manuscripts
☑ Analytics
☑ Personas
☑ Templates
```
**Result:** Full system state snapshot

---

## Template Tab - Selective Mock Data Generation

### Available Template Components

Generate AI-fillable templates for only the components you need:

| Template | Description | Fields Included |
|----------|-------------|-----------------|
| **☑ Project Template** | Study configuration | Design, enrollment, endpoints, interventions (~30 fields) |
| **☑ Protocol Template** | Protocol schema structure | Metadata, content, schema blocks, version control (~40 fields) |
| **☑ Clinical Data Template** | Patient record structure | Record IDs, visit data, nested data, queries (~15 fields) |
| **☑ Manuscript Template** | Academic writing structure | IMRaD sections, sources, review comments (~20 fields) |
| **☑ Statistical Template** | Analysis structure | Descriptive stats, tests, models (~30 fields) |
| **☑ Persona Template** | User role structure | Permissions, preferences (~20 fields) |
| **☑ Schema Template** | Reusable schema blocks | Block definitions, metadata (~15 fields) |

### Features

✅ **Select All / Deselect All** - Quick toggle  
✅ **Selection Counter** - Shows "X of 7 templates selected"  
✅ **Dynamic Button** - Shows "Generate Complete Template" or "Generate Selected (4)"  
✅ **Validation** - Can't generate with nothing selected

### Example Use Cases

#### Use Case 1: Generate Only Clinical Data
```
☐ Project Template
☑ Protocol Template     ← Need schema structure
☑ Clinical Data Template ← Patient records only
☐ Manuscript Template
☐ Statistical Template
☐ Persona Template
☐ Schema Template
```
**AI Prompt:**
```
"Fill this template with 100 realistic patient records for a Phase II 
diabetes study. Include demographics, baseline HbA1c, glucose measurements, 
and adverse events."
```

---

#### Use Case 2: Generate Complete Study Package
```
☑ Project Template
☑ Protocol Template
☑ Clinical Data Template
☑ Manuscript Template
☑ Statistical Template
☐ Persona Template      ← Not needed for AI generation
☐ Schema Template       ← Not needed for AI generation
```
**AI Prompt:**
```
"Generate a complete Phase III cardiovascular trial with 300 patients, 
full statistical analysis, and publication-ready manuscript with IMRaD 
structure and 15 references."
```

---

#### Use Case 3: Generate Only Manuscript
```
☐ Project Template
☐ Protocol Template
☐ Clinical Data Template
☑ Manuscript Template   ← Only manuscript
☐ Statistical Template
☐ Persona Template
☐ Schema Template
```
**AI Prompt:**
```
"Write a complete manuscript for a retrospective cohort study on COVID-19 
outcomes. Include Introduction, Methods, Results with 3 tables, Discussion, 
and 20 references from 2020-2023."
```

---

## Workflow Examples

### Workflow 1: Test New Protocol Design

**Step 1 - Generate Protocol Template Only**
```
Template Tab:
☐ Project Template
☑ Protocol Template     ← Selected
☐ Clinical Data Template
☐ Others...
```

**Step 2 - Ask AI to Fill**
```
"Generate a Phase II oncology protocol for testing a novel checkpoint 
inhibitor in melanoma. Include:
- Primary endpoint: Objective response rate
- Secondary endpoints: PFS, OS, safety
- 15 schema blocks covering demographics, tumor assessment, labs, AEs
- Include dependencies (e.g., pregnancy test required for WOCBP)"
```

**Step 3 - Import & Test**
- Import filled template
- Test protocol in Protocol Builder
- Verify schema blocks and dependencies

---

### Workflow 2: Share Study Results (Privacy-Safe)

**Step 1 - Export Without Patient Data**
```
Export Tab:
☑ Projects
☑ Protocols
☐ Clinical Data         ← EXCLUDED for privacy
☑ Manuscripts
☑ Analytics
☐ Personas
☐ Templates
```

**Step 2 - Share File**
- Send to collaborators
- No patient identifiers included
- Only aggregated results and protocol design

---

### Workflow 3: Data Migration

**Step 1 - Export Only Data**
```
Export Tab:
☐ Projects
☐ Protocols
☑ Clinical Data         ← Only patient records
☐ Others...
```

**Step 2 - Import to New System**
- Transfer to new instance
- Protocols already exist in target system
- Only update patient records

---

## Technical Details

### Export Filtering Logic

```typescript
const filteredExport = {
  ...fullExport,
  projects: fullExport.projects.map(projectExport => ({
    project: exportSelections.projects ? projectExport.project : minimalProject,
    protocols: exportSelections.protocols ? projectExport.protocols : [],
    clinicalData: exportSelections.clinicalData ? projectExport.clinicalData : [],
    manuscripts: exportSelections.manuscripts ? projectExport.manuscripts : [],
    statisticalManifests: exportSelections.statisticalManifests ? projectExport.statisticalManifests : [],
    personas: exportSelections.personas ? projectExport.personas : [],
    templates: exportSelections.templates ? projectExport.templates : [],
  })),
  globalTemplates: exportSelections.templates ? fullExport.globalTemplates : [],
  globalPersonas: exportSelections.personas ? fullExport.globalPersonas : [],
};
```

### Template Filtering Logic

```typescript
const filteredTemplate: any = {
  templateMetadata: fullTemplate.templateMetadata, // Always included
};

if (templateSelections.project) filteredTemplate.projectTemplate = fullTemplate.projectTemplate;
if (templateSelections.protocol) filteredTemplate.protocolTemplate = fullTemplate.protocolTemplate;
// ... etc for each component
```

---

## Import Compatibility

### Import Behavior

✅ **Partial imports supported** - Can import files with only some components  
✅ **Missing components skipped** - No errors if components not present  
✅ **Merge modes respected** - 'replace', 'update', or 'skip' options still work  
✅ **Validation included** - Structure validation before import

### Example: Import Protocol-Only Export

**Export contained:**
- ✅ Protocols
- ❌ Clinical Data (not exported)

**Import result:**
- ✅ Protocols imported successfully
- ⚠️ Clinical Data skipped (not in export)
- ✅ Existing clinical data preserved

---

## Best Practices

### Privacy & Compliance

1. **Never export Clinical Data** unless necessary for compliance/backup
2. **Use Protocol-only exports** for collaboration and template sharing
3. **Export Analytics without raw data** for publication

### Performance

1. **Select only needed components** to reduce file size
2. **Large datasets**: Export Clinical Data separately from other components
3. **Template generation**: Fewer components = faster AI processing

### Testing

1. **Use Template generation** for creating test datasets
2. **Export/Import cycle** to test data migration
3. **Protocol-only exports** to test schema designs

---

## UI Components Reference

### Export Tab Checkbox Card
```tsx
<label className="flex items-center gap-3 p-3 bg-white rounded border">
  <input type="checkbox" checked={exportSelections.protocols} />
  <div className="flex-1">
    <div className="text-slate-900 font-medium">Protocols</div>
    <div className="text-xs text-slate-500">Schema & versions</div>
  </div>
</label>
```

### Template Tab Checkbox Card
```tsx
<label className="flex items-center gap-3 p-3 bg-white rounded border">
  <input type="checkbox" checked={templateSelections.protocol} />
  <span className="text-slate-900">Protocol Template</span>
</label>
```

---

## Field Count Summary

| Component | Export Fields | Template Fields | Total Coverage |
|-----------|--------------|-----------------|----------------|
| Projects | ~20 | ~30 | 100% |
| Protocols | ~40 | ~40 | 100% |
| Clinical Data | ~15 + nested | ~15 + nested | 100% |
| Manuscripts | ~20 | ~20 | 100% |
| Analytics | ~30 | ~30 | 100% |
| Personas | ~20 | ~20 | 100% |
| Templates | ~15 | ~15 | 100% |
| **TOTAL** | **~160** | **~170** | **100%** |

---

## Troubleshooting

### "Please select at least one component"
- ✅ Check at least one checkbox before clicking Export/Generate
- ℹ️ Button is disabled when nothing selected

### Export file too large
- ✅ Deselect Clinical Data (usually largest component)
- ✅ Export components separately

### Template generation slow
- ✅ Select fewer template components
- ✅ Smaller templates = faster AI processing

### Import shows warnings
- ℹ️ Normal if export didn't include all components
- ✅ Missing components are skipped, not errors

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-01-04  
**Related:** `/docs/DATA_STRUCTURE_MAPPING.md`
