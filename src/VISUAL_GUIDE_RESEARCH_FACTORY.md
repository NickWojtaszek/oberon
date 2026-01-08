# Visual Guide: Research Factory UI

**Purpose:** Visual walkthrough of what users will see in the new Research Factory interface.

---

## 🎨 The Purple Toggle Button

**Location:** Bottom-right corner (development mode only)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    Your Application                     │
│                                                         │
│                                                         │
│                                              ┌─────────┐│
│                                              │ ● UI:   ││
│                                              │ Classic ││
│                                              └─────────┘│
└─────────────────────────────────────────────────────────┘
```

**What it does:**
- Click to switch between Classic and Research Factory UI
- Animated pulse indicator shows it's interactive
- Text updates: "Classic" ↔ "Research Factory"

---

## 📐 Classic UI (Default)

```
┌─────────────────────────────────────────────────────────┐
│ ┌─────────────┐                                         │
│ │   Sidebar   │  TopBar                                 │
│ │             ├─────────────────────────────────────────┤
│ │  • Home     │                                         │
│ │  • Personas │         Dashboard Content               │
│ │  • Protocol │                                         │
│ │  • Writing  │                                         │
│ │  • Analytics│                                         │
│ │             │                                         │
│ └─────────────┘                                         │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Left sidebar (256px)
- TopBar at top
- Variable content widths
- This is what you have now (preserved)

---

## 🏭 Research Factory UI (New)

### Full Layout

```
┌──────────────┬────────────────────────────────────────┬──────────────┐
│              │  GlobalHeader                          │              │
│ Navigation   ├────────────────────────────────────────┤              │
│ Panel        │                                        │  Logic Audit │
│ (Pane A)     │      Main Stage (Pane B)              │  Sidebar     │
│              │      Max-width: 1200px                 │  (Pane C)    │
│ 240px fixed  │      Centered on screen                │  360px       │
│              │                                        │  (slides in) │
│              │                                        │              │
└──────────────┴────────────────────────────────────────┴──────────────┘
```

---

## 🔲 Pane A: Navigation Panel (240px)

```
┌──────────────┐
│  ┌────┐      │
│  │ 🧪 │ Cur  │  ← Project Header
│  └────┘ rent│
│    Project   │
│              │
├──────────────┤
│ ┏━━━━━━━━━━┓ │
│ ┃ 📊 Dashb ┃ │  ← Active Tab (blue)
│ ┗━━━━━━━━━━┛ │
│              │
│ ┌──────────┐ │
│ │ 🧪 Protoc│ │  ← Inactive Tab
│ │   Workben│ │
│ └──────────┘ │
│              │
│ ┌──────────┐ │
│ │ 📚 Protoc│ │
│ │   Library│ │
│ └──────────┘ │
│              │
│ ┌──────────┐ │
│ │ ✍️  Acade│ │
│ │   Writing│ │
│ └──────────┘ │
│              │
│ ┌──────────┐ │
│ │ 👤 Person│ │
│ │   Editor │ │
│ └──────────┘ │
│              │
│ ┌──────────┐ │
│ │ 📊 Analyt│ │
│ │   ics    │ │
│ └──────────┘ │
│              │
│ ┌──────────┐ │
│ │ 💾 Data  │ │
│ │   Manage.│ │
│ └──────────┘ │
│              │
├──────────────┤
│ ⚙️  Settings │  ← Footer
└──────────────┘
```

**Features:**
- Project name at top
- Icon + label + description
- Active tab highlighted in blue
- Smooth hover states
- Settings at bottom

---

## 🎯 Pane B: Main Stage with GlobalHeader

### GlobalHeader Layout

```
┌────────────────────────────────────────────────────────┐
│ Home / Academic Writing / Lancet                       │  ← Breadcrumbs
│                                                        │
│  Target Journal: [Lancet (IF: 168.9) ▼]               │  ← Journal Selector
│                                                        │
│  ┌──────┬──────────┬────────┐                         │  ← Autonomy Slider
│  │ 🛡️ Audit │ 👥 Co-Pilot │ ⚡ Pilot │                     │
│  └──────┴──────────┴────────┘                         │
│                                                        │
│  [Run Logic Check]  [ Export Package ]                │  ← Actions
│   Secondary           Primary (blue)                  │
└────────────────────────────────────────────────────────┘
```

**Components:**

1. **Breadcrumbs (Left)**
   ```
   Home / Academic Writing / Lancet
   ^^^^   ^^^^^^^^^^^^^^^^   ^^^^^^
   Link   Link               Current
   ```

2. **Journal Selector (Center-Right)**
   ```
   Target Journal: [Lancet (IF: 168.9) ▼]
                    └─ Dropdown with 10 journals
   ```

3. **Autonomy Slider (Center-Right)**
   ```
   ┌─────────┬────────────┬─────────┐
   │ 🛡️ Audit │ 👥 Co-Pilot │ ⚡ Pilot │
   └─────────┴────────────┴─────────┘
      Active     Inactive    Inactive
      (Blue)     (Gray)      (Gray)
   ```

4. **Secondary Actions (Right)**
   ```
   [Run Logic Check]  [Save Draft]
   Outline style, gray border
   ```

5. **Primary Action (Far Right)**
   ```
   [ Export Package ]
   Solid blue, prominent
   ```

---

## 📝 Main Stage Content Area

```
┌────────────────────────────────────────────────────────┐
│ GlobalHeader (see above)                               │
├────────────────────────────────────────────────────────┤
│                                                        │
│                   Main Content                         │
│                Max-width: 1200px                       │
│                Padding: 40px                           │
│                Centered on screen                      │
│                                                        │
│  Forms, graphs, editors, tables, etc.                  │
│                                                        │
│                                                        │
└────────────────────────────────────────────────────────┘
│ LiveBudgetTracker (bottom bar)                         │
└────────────────────────────────────────────────────────┘
```

**Key Feature:**
- All tabs use same 1200px max-width
- **No focal point jumping!**

---

## 📊 LiveBudgetTracker (Bottom Bar)

```
┌────────────────────────────────────────────────────────┐
│ 📄 Introduction: 650 / 800 words    Refs: 28/40       │
│    90% (Amber warning)              Figs: 3/5         │
│                                     Tables: 2/5        │
│                                                        │
│                          [ ✅ Compliant with Lancet ]  │
└────────────────────────────────────────────────────────┘
```

**Color States:**

1. **Green (OK):**
   ```
   📄 Introduction: 500 / 800 words
   ```

2. **Amber (Warning - 90%+):**
   ```
   📄 Introduction: 750 / 800 words (94%)
      ⚠️ Approaching limit
   ```

3. **Red (Exceeded):**
   ```
   📄 Introduction: 850 / 800 words
      ❌ Over limit
   ```

---

## 🎨 Pane C: Logic Audit Sidebar

```
┌──────────────┐
│ ✨ Logic Audit│  ← Header
│     [X Close]│
│              │
├──────────────┤
│ Stats:       │
│ ┌──┐ ┌──┐ ┌─│
│ │3 │ │2 │ │5│  ← Counts
│ │🔴│ │🟡│ │🟢│
│ └──┘ └──┘ └─│
│ Crit Warn OK│
│              │
├──────────────┤
│              │
│ ┌──────────┐ │
│ │ 🔴 MISMA │ │  ← Mismatch Card
│ │ Results  │ │
│ │ Your:    │ │
│ │ "9.7%"   │ │
│ │          │ │
│ │ Truth:   │ │
│ │ "6.7%"   │ │
│ │          │ │
│ │ [⚡Auto- │ │  ← Action Buttons
│ │   Sync]  │ │
│ └──────────┘ │
│              │
│ ┌──────────┐ │
│ │ 🟡 WARNIN│ │
│ │ Methods  │ │
│ │ ...      │ │
│ └──────────┘ │
│              │
└──────────────┘
```

**Features:**
- Slides from right (360px)
- Backdrop blur when open
- Stats summary at top
- Mismatch cards with severity
- Side-by-side comparison
- Auto-Sync button for fixes

---

## 🔄 Visual Transitions

### Opening Logic Audit Sidebar

```
BEFORE:
┌──────┬─────────────────────────────────┐
│ Nav  │  Main Stage (1200px centered)   │
│      │                                 │
└──────┴─────────────────────────────────┘

USER CLICKS: "Run Logic Check"

AFTER:
┌──────┬──────────────────────┬──────────┐
│ Nav  │  Main Stage (adjust) │  Sidebar │
│      │                      │  360px   │
└──────┴──────────────────────┴──────────┘
         └─ Width adjusts smoothly ─┘
```

**Animation:**
- Sidebar slides in from right
- Backdrop appears with blur
- Main Stage width smoothly adjusts
- Duration: 300ms
- Easing: ease-in-out

---

## 🎯 Dashboard Full-Width Mode

```
┌──────────────┬────────────────────────────────────────┐
│              │                                        │
│ Navigation   │  Dashboard (NO MAX-WIDTH)              │
│ Panel        │                                        │
│ (240px)      │  ┌────────┐ ┌────────┐ ┌────────┐    │
│              │  │ Card 1 │ │ Card 2 │ │ Card 3 │    │
│              │  └────────┘ └────────┘ └────────┘    │
│              │                                        │
│              │  ┌────────┐ ┌────────┐ ┌────────┐    │
│              │  │ Card 4 │ │ Card 5 │ │ Card 6 │    │
│              │  └────────┘ └────────┘ └────────┘    │
│              │                                        │
└──────────────┴────────────────────────────────────────┘
```

**Special Handling:**
- Dashboard uses `fullWidth={true}`
- No max-width constraint
- Cards span available space
- No GlobalHeader (dashboard has its own layout)

---

## 📱 Responsive Behavior

### Main Stage Width Adjustment

**Without Sidebar:**
```
Main Stage: max-width 1200px, centered
┌─────────────────────────────────────────────┐
│            [   1200px content   ]           │
│               centered                      │
└─────────────────────────────────────────────┘
```

**With Sidebar Open:**
```
Main Stage: adjusts to fit
┌───────────────────────────────┬──────────┐
│  [Adjusted width content]     │ Sidebar  │
│                               │ 360px    │
└───────────────────────────────┴──────────┘
```

---

## 🎨 Color Coding Guide

### Verification States

**Green (Verified):**
```
┌──────────────────────────────┐
│ ✅ This claim is verified    │
│    Matches protocol data     │
└──────────────────────────────┘
Background: #F0FDF4 (green-50)
Border: #16A34A (green-600)
```

**Amber (Warning):**
```
┌──────────────────────────────┐
│ ⚠️  Approaching word limit    │
│    750 / 800 words (94%)     │
└──────────────────────────────┘
Background: #FFFBEB (amber-50)
Border: #D97706 (amber-600)
```

**Red (Error/Exceeded):**
```
┌──────────────────────────────┐
│ ❌ Mismatch detected          │
│    Your: 9.7% | Truth: 6.7%  │
└──────────────────────────────┘
Background: #FEF2F2 (red-50)
Border: #DC2626 (red-600)
```

---

## 🎯 User Scenarios

### Scenario 1: First Time User

```
1. User loads app
   → Sees Classic UI (familiar)

2. Notices purple button
   → Curiosity piqued

3. Clicks purple button
   → UI smoothly transitions
   → New layout appears

4. Sees Navigation Panel
   → "Oh, this is different!"

5. Clicks around tabs
   → "The main area stays centered!"
   → "No jumping around!"

6. Clicks "Academic Writing"
   → GlobalHeader appears
   → "I can select a journal!"
   → Budget tracker at bottom
   → "It shows my word count!"

7. Clicks "Run Logic Check"
   → Sidebar slides in
   → "Wow, it found my errors!"

8. Clicks "Auto-Sync"
   → Text updates instantly
   → "That fixed it!"

9. Happy user ✅
```

### Scenario 2: Writing Manuscript

```
1. Enable Research Factory UI

2. Navigate to Academic Writing

3. Select target journal:
   → Opens dropdown
   → Selects "Lancet"
   → Budget tracker updates

4. Start typing Introduction:
   → 100 words... green
   → 500 words... still green
   → 720 words... amber warning
   → 850 words... RED! Exceeded!

5. User sees amber warning:
   → "Better wrap this up"
   → Finishes at 780 words
   → Green again ✅

6. Moves to Methods section:
   → Budget tracker shows "Methods"
   → New limit: 1500 words
   → Starts fresh count

7. Accidentally types wrong value:
   → "Mortality was 9.7%"

8. Clicks "Run Logic Check":
   → Sidebar slides in
   → Shows mismatch card
   → "Should be 6.7%"

9. Clicks "Auto-Sync":
   → Text updates to 6.7%
   → Card turns green

10. Clicks "Export Package":
    → Downloads .zip
    → Contains manuscript + appendix

11. Mission accomplished! 🎉
```

---

## 🎯 Key Visual Improvements

### Before (Classic UI)
```
❌ Variable content widths
❌ Focal point jumps between screens
❌ Actions scattered in content
❌ No journal constraint visibility
❌ Manual error checking
```

### After (Research Factory UI)
```
✅ Consistent 1200px max-width
✅ Focal point stays centered
✅ All actions in GlobalHeader
✅ Real-time budget tracking
✅ Automated error detection
✅ Side-by-side corrections
✅ One-click auto-sync
```

---

## 🎨 UI Polish Details

### Hover States

**Navigation Items:**
```
Inactive:  Gray text, light hover
Active:    Blue background, blue text
Hover:     Light gray background
```

**Buttons:**
```
Primary:    Blue → Darker blue on hover
Secondary:  Gray border → Light fill on hover
Disabled:   Opacity 50%, no hover
```

**Autonomy Slider:**
```
Active:    White background, blue text, shadow
Inactive:  Transparent, gray text
Hover:     Gray text → Black text
```

### Transitions

**Navigation:**
```
Tab switching: Instant (no animation needed)
Content fade: None (instant swap)
```

**Sidebar:**
```
Slide in:  300ms ease-in-out
Backdrop:  200ms fade-in
Width:     300ms ease-in-out
```

**Budget Tracker:**
```
Color change: 200ms ease-in-out
Count update:  Instant (with 500ms debounce)
```

---

## 📐 Spacing Examples

### GlobalHeader Internal Spacing

```
┌─────────────────────────────────────────────────────┐
│  Breadcrumb  [gap-2]  Breadcrumb  [gap-6]           │
│                                                     │
│            Journal Dropdown [gap-4] Slider          │
│                                                     │
│                      [gap-6]  Actions [gap-3]       │
└─────────────────────────────────────────────────────┘
        └─ 8px system (gap-2 = 8px, gap-4 = 16px) ─┘
```

### Main Stage Padding

```
┌─────────────────────────────────────────────────────┐
│ [40px padding all sides]                            │
│    ┌─────────────────────────────────────────┐     │
│    │                                         │     │
│    │         Actual Content Area             │     │
│    │         (max-width: 1200px)             │     │
│    │                                         │     │
│    └─────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Visual Checklist

When testing the UI, verify these visual elements:

### Layout
- [ ] Navigation panel is 240px wide
- [ ] Main Stage max-width is 1200px
- [ ] Main Stage is centered on screen
- [ ] Sidebar is 360px when open
- [ ] GlobalHeader spans full Main Stage width

### Colors
- [ ] Active nav item is blue (bg-blue-50, text-blue-600)
- [ ] Primary button is blue (bg-blue-600)
- [ ] Budget tracker green = OK
- [ ] Budget tracker amber = Warning
- [ ] Budget tracker red = Exceeded

### Typography
- [ ] No Tailwind font classes used
- [ ] Default HTML styling from globals.css
- [ ] Text is readable and professional

### Spacing
- [ ] 8px spacing system consistent
- [ ] 40px padding in Main Stage
- [ ] Elements aligned properly
- [ ] No elements touching edges

### Animations
- [ ] Sidebar slides smoothly (300ms)
- [ ] Backdrop fades in (200ms)
- [ ] No janky movements
- [ ] Transitions feel polished

---

**This visual guide shows exactly what users will see and experience!** 🎨
