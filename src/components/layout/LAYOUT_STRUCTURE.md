# Layout Structure - Visual Guide

## The Golden Grid Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          LAYOUT HEADER (64px)                           │
│  Breadcrumbs | Badges | Center Content |    Actions    | Right Content │
└─────────────────────────────────────────────────────────────────────────┘
┌──────────────┬─────────────────────────────────────────┬────────────────┐
│              │                                         │                │
│   SIDEBAR    │           MAIN CONTENT AREA             │  PANEL (slide) │
│   (240px)    │         (max-w-7xl, centered)           │    (400px)     │
│              │                                         │                │
│  - Section 1 │  ┌─────────────────────────────────┐   │  - Title       │
│    • Item 1  │  │                                 │   │  - Content     │
│    • Item 2  │  │      Your Page Content          │   │  - Actions     │
│              │  │                                 │   │                │
│  - Section 2 │  │   - Cards                       │   │  Collapsible   │
│    • Item 3  │  │   - Tables                      │   │  with backdrop │
│    • Item 4  │  │   - Forms                       │   │                │
│              │  │   - Charts                      │   │                │
│  [Scrollable]│  │                                 │   │  [Scrollable]  │
│              │  │   [Scrollable]                  │   │                │
│              │  │                                 │   │                │
│              │  └─────────────────────────────────┘   │                │
│              │                                         │                │
└──────────────┴─────────────────────────────────────────┴────────────────┘
```

---

## Component Hierarchy

```
LayoutShell
├── LayoutHeader (fixed top, 64px)
│   ├── Breadcrumbs
│   ├── Badges
│   ├── Center Content (optional)
│   ├── Secondary Actions
│   ├── Primary Action
│   └── Right Content (optional)
│
├── LayoutSidebar (fixed left, 240px)
│   ├── Header (optional)
│   ├── Navigation Items
│   │   ├── Section 1
│   │   │   ├── Item 1 (with icon, badge)
│   │   │   └── Item 2
│   │   └── Section 2
│   │       ├── Item 3
│   │       └── Item 4 (with sub-items)
│   └── Footer (optional)
│
├── Main Content Area (flexible, centered)
│   └── Your Page Content (scrollable)
│
└── LayoutPanel (fixed right, collapsible)
    ├── Header
    ├── Content (scrollable)
    └── Footer (optional)
```

---

## Responsive Behavior

### Desktop (1200px+)
```
┌─────────────────────────────────────────────────────┐
│                    HEADER                           │
├───────┬─────────────────────────────────┬───────────┤
│       │                                 │   PANEL   │
│ SIDE  │           CONTENT               │ (visible) │
│       │                                 │           │
└───────┴─────────────────────────────────┴───────────┘
```

### Tablet (768px - 1199px)
```
┌─────────────────────────────────────────────────────┐
│                    HEADER                           │
├───────┬─────────────────────────────────────────────┤
│       │                                             │
│ SIDE  │              CONTENT                        │
│       │         (Panel slides over)                 │
│       │                                             │
└───────┴─────────────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌─────────────────────────────────────────────────────┐
│              HEADER (compact)                       │
│  [☰] Breadcrumbs                          Actions   │
├─────────────────────────────────────────────────────┤
│                                                     │
│                  CONTENT                            │
│              (Full width)                           │
│                                                     │
│   (Sidebar & Panel slide over as modals)            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Data Flow

```
Parent Component State
       │
       ├─── activeTab ────────────► LayoutSidebar (activeItemId)
       │                                    │
       │                                    │ onClick
       │                                    ▼
       │                              setActiveTab()
       │
       ├─── isPanelOpen ──────────► LayoutPanel (isOpen)
       │                                    │
       │                                    │ onClose
       │                                    ▼
       │                            setIsPanelOpen(false)
       │
       └─── Current Content ─────► Main Content Area
                                    (renders based on activeTab)
```

---

## Styling Architecture

### Header
```css
• Height: 64px (h-16)
• Background: Slate 900 (bg-slate-900)
• Border: Slate 700 (border-slate-700)
• Padding: 2rem (px-8)
• Text: White primary, Slate 400 secondary
```

### Sidebar
```css
• Width: 240px (w-60)
• Background: White (bg-white)
• Border: Slate 200 (border-slate-200)
• Active: Blue 50 background, Blue 600 border
• Hover: Slate 50 (hover:bg-slate-50)
```

### Main Content
```css
• Max Width: 1280px (max-w-7xl) - configurable
• Padding: 2rem (p-8) - configurable
• Background: Slate 50 (bg-slate-50)
• Overflow: Auto (overflow-y-auto)
```

### Panel
```css
• Width: 400px (w-96) - configurable
• Position: Fixed right
• Background: White (bg-white)
• Border: Slate 200 (border-slate-200)
• Shadow: Extra large (shadow-xl)
• Animation: Slide from right (translate-x)
```

---

## Layout Variations

### 1. **Full-Width Dashboard**
```tsx
<LayoutShell
  header={<LayoutHeader />}
  sidebar={<LayoutSidebar />}
  fullWidth={true} // No max-width constraint
>
  <DashboardGrid /> {/* Full-width grid */}
</LayoutShell>
```

### 2. **Document Editor (Narrow)**
```tsx
<LayoutShell
  contentMaxWidth="max-w-4xl" // Narrower for reading
  contentPadding="p-12" // More padding
>
  <DocumentEditor />
</LayoutShell>
```

### 3. **No Sidebar (Focus Mode)**
```tsx
<LayoutShell
  header={<LayoutHeader />}
  // No sidebar prop
  panel={<LayoutPanel />}
>
  <FocusContent />
</LayoutShell>
```

### 4. **Two Panels (Advanced)**
```tsx
<LayoutShell
  header={<LayoutHeader />}
  sidebar={<LayoutSidebar />}
>
  <MainContent />
  <LayoutPanel position="left" /> {/* Left panel */}
  <LayoutPanel position="right" /> {/* Right panel */}
</LayoutShell>
```

---

## Z-Index Layering

```
Layer 0:  Main Content (z-0)
Layer 10: Sidebar (z-10, if floating)
Layer 20: Panel Backdrop (z-20)
Layer 30: Panel (z-30)
Layer 40: Modals (z-40)
Layer 50: Toasts/Notifications (z-50)
```

---

## Scroll Behavior

```
┌─────────── Header (fixed, no scroll) ───────────────┐
│                                                     │
└─────────────────────────────────────────────────────┘
┌────────────┬────────────────────────────┬───────────┐
│  Sidebar   │     Main Content           │   Panel   │
│            │                            │           │
│  [scroll]  │       [scroll]             │  [scroll] │
│     │      │          │                 │     │     │
│     ▼      │          ▼                 │     ▼     │
│   items    │       content              │  content  │
│            │                            │           │
└────────────┴────────────────────────────┴───────────┘
```

Each section scrolls independently!

---

## State Management Patterns

### Local State (Simple Apps)
```tsx
function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  return <LayoutShell ... />;
}
```

### Context API (Medium Apps)
```tsx
const LayoutContext = createContext();

function LayoutProvider({ children }) {
  const [activeTab, setActiveTab] = useState('home');
  // ... more state
  
  return (
    <LayoutContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </LayoutContext.Provider>
  );
}
```

### Redux/Zustand (Large Apps)
```tsx
// Store
const useLayoutStore = create((set) => ({
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

// Component
function App() {
  const { activeTab, setActiveTab } = useLayoutStore();
  return <LayoutShell ... />;
}
```

---

## Accessibility Features

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close panel
- Arrow keys for sidebar navigation (optional)

### ARIA Labels
```tsx
<LayoutPanel
  aria-label="AI Assistant Panel"
  role="complementary"
/>

<LayoutSidebar
  aria-label="Main Navigation"
  role="navigation"
/>
```

### Screen Reader Support
- Proper heading hierarchy
- Descriptive labels
- Status announcements
- Focus management

---

## Performance Optimizations

### Memoization
```tsx
const MemoizedHeader = React.memo(LayoutHeader);
const MemoizedSidebar = React.memo(LayoutSidebar);
```

### Lazy Loading
```tsx
const HeavyPanel = lazy(() => import('./HeavyPanel'));

<Suspense fallback={<PanelSkeleton />}>
  <LayoutPanel>
    <HeavyPanel />
  </LayoutPanel>
</Suspense>
```

### Virtual Scrolling (Large Lists)
```tsx
import { FixedSizeList } from 'react-window';

<LayoutSidebar
  items={virtualizedItems}
/>
```

---

## Common Patterns

### 1. Breadcrumb Navigation
```tsx
const breadcrumbs = [
  { label: 'Home', onClick: () => navigate('/') },
  { label: 'Projects', onClick: () => navigate('/projects') },
  { label: currentProject.name }, // No onClick = current page
];
```

### 2. Context-Aware Badges
```tsx
const badges = [
  { label: projectId, variant: 'default' },
  { label: studyPhase, variant: phaseColor },
  { label: 'Locked', variant: 'warning', icon: Lock },
];
```

### 3. Conditional Actions
```tsx
const primaryAction = canExport
  ? { label: 'Export', onClick: handleExport }
  : undefined; // No action shown if user can't export
```

### 4. Dynamic Navigation
```tsx
const navItems = useMemo(() => {
  return allItems.filter(item => 
    hasPermission(user, item.requiredPermission)
  );
}, [user, allItems]);
```

---

This visual guide should help you understand and implement the layout system! 🎨
