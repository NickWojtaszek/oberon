# Load Demo Button - Quick Guide

## What It Does

The **"Load Demo"** button in the Academic Writing module instantly creates a pre-populated demo manuscript that showcases both Phase 2 (Evidence Cards) and Phase 3 (Intelligence Chat) features.

## Location

**Academic Writing Header** → Top right → Purple button with sparkle icon

```
[Logic Check] [✨ Load Demo] [New Manuscript]
```

## What Gets Loaded

### 1. Demo Manuscript
**Title:** "Age-Based Outcomes in Elective Aortic Arch Repair: A Retrospective Analysis"

**Includes:**
- Pre-written Introduction with 2 citations
- Pre-written Methods with 1 citation  
- Pre-written Results with 3 citations
- Pre-written Discussion with 2 citations
- Pre-written Conclusion with 1 citation
- Total: **9 citations** throughout manuscript

### 2. Three Demo PDFs (Sources)

**SVS_Guidelines_2024.pdf**
- Clinical Guidelines
- Contains age threshold, mortality benchmarks, stroke rates
- 3 mock excerpts with page numbers

**VESTAL_Trial_2023.pdf**  
- Randomized Controlled Trial
- Contains age outcomes, mortality analysis
- 2 mock excerpts with page numbers

**ACC_Risk_Calculator_2024.pdf**
- Clinical Tool
- Contains risk assessment methodology
- 1 mock excerpt with page number

### 3. Demo Banner

Purple banner appears explaining:
- **Phase 2:** How to click citation chips to see Evidence Cards
- **Phase 3:** How to use Intelligence Chat

## When to Use It

### First-Time Users
- Exploring the system for the first time
- Want to see all features in action
- Learning how Evidence Cards work

### Demos & Presentations
- Showing the system to colleagues
- Training new team members
- Presenting to stakeholders

### Testing Features
- After making changes to the code
- Verifying Phase 2 Evidence Card system
- Testing Phase 3 Intelligence Chat queries

### After Deleting Demo
- Accidentally removed demo manuscript
- Want to reload pre-populated content
- Need reference examples again

## How to Use It

### Step 1: Click "Load Demo"
Button is always visible in header (even if you already have manuscripts)

### Step 2: Demo Loads Instantly
- New manuscript appears in dropdown
- Selected automatically
- Demo banner shows at top

### Step 3: Explore Phase 2 Features
1. Navigate through IMRaD sections
2. Look for citation chips: `[@SVS_Guidelines_2024]`
3. Click any citation chip
4. Evidence Card slides in showing:
   - Your manuscript claim
   - Source excerpt with page number
   - Statistical manifest validation
   - Verification badges

### Step 4: Explore Phase 3 Features
1. Click "Sources" tab in right sidebar
2. See 3 pre-loaded PDFs
3. Click "Chat" button
4. Try example queries:
   - "Compare our mortality with VESTAL results"
   - "What does the literature say about age thresholds?"
   - "Summarize stroke rates across sources"
5. Click "Copy to Manuscript" on any response
6. See auto-inserted text with citations

## Multiple Demos

**You can load multiple demos:**
- Each click creates a NEW demo manuscript
- Timestamp in ID ensures uniqueness
- All demos appear in manuscript dropdown
- Each has its own copy of the 3 source PDFs

**To clean up:**
- Delete old demos manually (future feature)
- Or work with latest demo only

## What Makes It Different from "New Manuscript"

### "New Manuscript" Button
- Creates blank manuscript
- Empty IMRaD sections
- No sources pre-loaded
- You build from scratch

### "Load Demo" Button  
- Creates pre-populated manuscript
- All sections have content
- 3 PDFs pre-loaded
- 9 citations already inserted
- Ready to explore features immediately

## Demo Content Highlights

### Introduction Section
```
"Current guidelines recommend an upper age threshold of 80 years 
for elective aortic arch repair [@SVS_Guidelines_2024], though 
recent evidence suggests this cutoff may be overly conservative.

The VESTAL trial demonstrated that age alone should not be a 
contraindication for arch repair, with patients aged 75-85 showing 
comparable outcomes to younger cohorts when properly selected 
[@VESTAL_Trial_2023]."
```

### Results Section
```
"The 30-day mortality rate in our cohort was 9% (10/112), which 
aligns with the benchmark range of 8.8-10.2% reported in large-scale 
multicenter trials [@SVS_Guidelines_2024]."
```

### Discussion Section
```
"Our findings support the VESTAL trial's conclusion that age alone 
should not preclude surgical candidacy [@VESTAL_Trial_2023]. The 
30-day mortality rate of 9% in our cohort falls within the acceptable 
range for specialized centers..."
```

## Intelligence Chat Example Queries

### Query 1: Mortality Comparison
**Ask:** "Compare our 30-day mortality with VESTAL results"

**AI Response:**
"Your cohort's 30-day mortality rate (9.0%) is statistically comparable to the VESTAL trial's reported 8.9% (p=0.45, non-inferiority analysis)..."

**Shows:**
- ✅ Context: Your Data + Literature  
- ✅ Citation: VESTAL Trial page 22
- ✅ Suggested Section: Discussion

### Query 2: Age Guidelines
**Ask:** "What does the literature say about age thresholds?"

**AI Response:**
"Current SVS guidelines recommend an 80-year age threshold for elective arch repair, but the VESTAL trial demonstrated that patients aged 75-85 show comparable outcomes..."

**Shows:**
- ✅ Citations: SVS Guidelines + VESTAL Trial
- ✅ Suggested Section: Introduction

### Query 3: Sample Size
**Ask:** "How many patients in our cohort?"

**AI Response:**
"Your study cohort includes 112 patients who underwent the analyzed procedure..."

**Shows:**
- ✅ Context: Your Data (manifest only)
- ✅ Suggested Section: Methods

## Troubleshooting

### Demo doesn't load?
- Ensure you have a project selected
- Check browser console for errors
- Try refreshing page

### Can't see citations?
- Navigate to different IMRaD sections
- Look for purple text with @ symbol
- Check you're in "Editor" tab (not Bibliography)

### Evidence Cards don't open?
- Ensure you've clicked the citation chip (not just the text)
- Look for purple chips in preview panel below editor
- Try clicking chips in preview panel

### Chat doesn't work?
- Click "Sources" tab in right sidebar
- Click "Chat" button in header
- Ensure "Manifest Linked" badge is showing

## Technical Details

**Storage:**
- Demo manuscript saved to localStorage
- Key: `manuscripts_{projectId}`
- Persists across sessions
- Independent per project

**ID Format:**
- `manuscript-demo-{timestamp}`
- Always contains "demo" string
- Used to trigger demo banner

**Demo Flag:**
- `academic_writing_demo_loaded_{projectId}`
- Prevents auto-load on subsequent visits
- Doesn't affect manual "Load Demo" button

**Sources:**
- Defined in `/utils/demoAcademicData.ts`
- Mock excerpts in `/utils/verificationService.ts`
- Not real PDFs (simulated for demo)

## Summary

The **"Load Demo"** button is your instant sandbox for exploring Phase 2 and Phase 3 features. It creates a fully-populated manuscript with real citations, pre-loaded sources, and working Intelligence Chat—all ready to demonstrate the complete Evidence Card system and AI-assisted manuscript development workflow.

**Click it anytime to reload the demo!** ✨
