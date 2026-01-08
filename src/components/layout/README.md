# Reusable Layout System

A comprehensive, enterprise-grade layout component system for building professional web applications with React and Tailwind CSS.

## 📦 Components

### 1. **LayoutShell** - Main Layout Container
The foundational component that combines all layout pieces into a cohesive structure.

```tsx
import { LayoutShell } from './components/layout';

<LayoutShell
  header={<LayoutHeader {...} />}
  sidebar={<LayoutSidebar {...} />}
  panel={<LayoutPanel {...} />}
>
  {/* Your main content */}
</LayoutShell>
```

**Props:**
- `header` - Top header component (optional)
- `sidebar` - Left navigation sidebar (optional)
- `children` - Main content area (required)
- `panel` - Right collapsible panel (optional)
- `sidebarWidth` - Width class for sidebar (default: 'w-60')
- `contentMaxWidth` - Max width for content (default: 'max-w-7xl')
- `contentPadding` - Padding for content (default: 'p-8')
- `fullWidth` - Disable max-width constraint (default: false)

---

### 2. **LayoutHeader** - Global Header Bar
A professional header with breadcrumbs, badges, and action buttons.

```tsx
import { LayoutHeader } from './components/layout';

<LayoutHeader
  breadcrumbs={[
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Current Page' }
  ]}
  badges={[
    { icon: Building, label: 'STUDY-001', variant: 'primary' }
  ]}
  primaryAction={{
    label: 'Export',
    icon: Download,
    onClick: handleExport
  }}
  secondaryActions={[
    { label: 'Save', icon: Save, onClick: handleSave }
  ]}
/>
```

**Props:**
- `breadcrumbs` - Array of breadcrumb items
- `badges` - Array of status/info badges
- `centerContent` - Custom center content (ReactNode)
- `primaryAction` - Main action button
- `secondaryActions` - Array of secondary action buttons
- `rightContent` - Custom right content (ReactNode)

**Badge Variants:**
- `default` - Gray (slate)
- `primary` - Blue
- `success` - Green
- `warning` - Amber/Orange
- `info` - Indigo

---

### 3. **LayoutSidebar** - Navigation Sidebar
A flexible sidebar with hierarchical navigation support.

```tsx
import { LayoutSidebar } from './components/layout';

<LayoutSidebar
  sections={[
    {
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'projects', label: 'Projects', icon: FileText, badge: 5 }
      ]
    }
  ]}
  activeItemId={activeTab}
  onItemClick={setActiveTab}
  header={<div>Logo & Title</div>}
  footer={<div>Version Info</div>}
/>
```

**Props:**
- `sections` - Array of navigation sections with items
- `items` - Simple flat array of items (alternative to sections)
- `activeItemId` - ID of currently active item
- `onItemClick` - Callback when item is clicked
- `header` - Custom header content
- `footer` - Custom footer content
- `width` - Width class (default: 'w-60')

**Item Features:**
- Icon support
- Active state highlighting
- Badges for counts/notifications
- Disabled state
- Sub-items (nested navigation)

---

### 4. **LayoutPanel** - Collapsible Side Panel
A slide-in panel for assistants, settings, or secondary content.

```tsx
import { LayoutPanel, PanelToggle } from './components/layout';

<LayoutPanel
  isOpen={isPanelOpen}
  onClose={() => setIsPanelOpen(false)}
  title="AI Assistant"
  position="right"
  width="w-96"
>
  {/* Panel content */}
</LayoutPanel>

{/* Toggle button for panel */}
<PanelToggle
  isOpen={isPanelOpen}
  onClick={() => setIsPanelOpen(!isPanelOpen)}
/>
```

**Props:**
- `isOpen` - Panel visibility state (required)
- `onClose` - Close handler (optional)
- `title` - Panel title (optional)
- `children` - Panel content (required)
- `header` - Custom header (overrides title)
- `footer` - Custom footer content
- `width` - Width class (default: 'w-96')
- `position` - 'left' or 'right' (default: 'right')
- `showBackdrop` - Show overlay backdrop (default: true)

---

## 🎨 Complete Example

```tsx
import { useState } from 'react';
import {
  LayoutShell,
  LayoutHeader,
  LayoutSidebar,
  LayoutPanel,
  PanelToggle,
} from './components/layout';
import { Home, Settings, Download, Save } from 'lucide-react';

function MyApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <LayoutShell
      header={
        <LayoutHeader
          breadcrumbs={[
            { label: 'Home', onClick: () => console.log('Home') },
            { label: 'Dashboard' }
          ]}
          primaryAction={{
            label: 'Export',
            icon: Download,
            onClick: () => alert('Export!')
          }}
        />
      }
      sidebar={
        <LayoutSidebar
          items={[
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'settings', label: 'Settings', icon: Settings }
          ]}
          activeItemId={activeTab}
          onItemClick={setActiveTab}
        />
      }
      panel={
        <LayoutPanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          title="AI Assistant"
        >
          <div className="p-6">
            Assistant content here
          </div>
        </LayoutPanel>
      }
    >
      {/* Main Content */}
      <div>
        <h1 className="text-3xl font-bold mb-4">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h1>
        
        <PanelToggle
          isOpen={isPanelOpen}
          onClick={() => setIsPanelOpen(!isPanelOpen)}
        />
        
        <div className="bg-white p-6 rounded-lg shadow">
          Your content here
        </div>
      </div>
    </LayoutShell>
  );
}
```

---

## 🎯 Use Cases

### 1. **Dashboard Application**
```tsx
<LayoutShell
  header={<LayoutHeader breadcrumbs={breadcrumbs} />}
  sidebar={<LayoutSidebar sections={navSections} />}
  fullWidth={true} // Use full width for dashboard cards
>
  <DashboardContent />
</LayoutShell>
```

### 2. **Document Editor**
```tsx
<LayoutShell
  header={<LayoutHeader primaryAction={saveButton} />}
  sidebar={<LayoutSidebar items={documentSections} />}
  panel={<LayoutPanel title="Comments">{comments}</LayoutPanel>}
  contentMaxWidth="max-w-4xl" // Narrower for reading
>
  <DocumentEditor />
</LayoutShell>
```

### 3. **Data Analysis Platform**
```tsx
<LayoutShell
  header={<LayoutHeader badges={studyBadges} />}
  sidebar={<LayoutSidebar sections={analysisSections} />}
  panel={<LayoutPanel title="AI Insights">{insights}</LayoutPanel>}
>
  <AnalysisWorkspace />
</LayoutShell>
```

---

## 🎨 Customization

### Theming
All components use Tailwind CSS classes. Customize by:

1. **Extending Tailwind Config** - Add your brand colors
2. **Overriding Classes** - Use `className` prop on components
3. **Custom Variants** - Modify component source for new badge variants

### Responsive Behavior
The layout is responsive by default:
- **Mobile**: Sidebar and panel can be toggled
- **Tablet**: Sidebar visible, panel toggleable
- **Desktop**: All components visible simultaneously

---

## 📋 TypeScript Support

All components are fully typed with TypeScript:

```tsx
import type {
  Breadcrumb,
  Badge,
  HeaderAction,
  SidebarSection,
  SidebarItem,
} from './components/layout';
```

---

## ✅ Best Practices

1. **Keep Header Actions Minimal** - Max 1 primary + 2-3 secondary actions
2. **Use Badges Sparingly** - Only for critical status information
3. **Organize Sidebar Sections** - Group related items logically
4. **Panel for Secondary Content** - Don't overcrowd the main area
5. **Responsive Testing** - Test on mobile, tablet, and desktop

---

## 🚀 Getting Started

1. **Copy the components** to your project:
   ```
   /components/layout/
     ├── LayoutShell.tsx
     ├── LayoutHeader.tsx
     ├── LayoutSidebar.tsx
     ├── LayoutPanel.tsx
     └── index.ts
   ```

2. **Import and use**:
   ```tsx
   import { LayoutShell, LayoutHeader, LayoutSidebar } from './components/layout';
   ```

3. **Customize** as needed for your application

---

## 📝 License

This layout system is part of your Clinical Intelligence Engine and can be reused in other projects.

---

## 🔄 Migration from Old Layout

If migrating from an existing layout:

1. Replace `<WorkspaceShell>` with `<LayoutShell>`
2. Replace `<GlobalHeader>` with `<LayoutHeader>`
3. Replace `<NavigationPanel>` with `<LayoutSidebar>`
4. Replace custom right sidebar with `<LayoutPanel>`

The new system is more flexible and easier to maintain!
