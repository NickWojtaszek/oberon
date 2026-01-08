# Layout System - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Import Components
```tsx
import { 
  LayoutShell, 
  LayoutHeader, 
  LayoutSidebar, 
  LayoutPanel 
} from './components/layout';
```

### Step 2: Set Up State
```tsx
const [activeTab, setActiveTab] = useState('dashboard');
const [isPanelOpen, setIsPanelOpen] = useState(false);
```

### Step 3: Build the Layout
```tsx
<LayoutShell
  header={<LayoutHeader breadcrumbs={[{ label: 'Home' }]} />}
  sidebar={
    <LayoutSidebar
      items={[
        { id: 'dashboard', label: 'Dashboard', icon: Home }
      ]}
      activeItemId={activeTab}
      onItemClick={setActiveTab}
    />
  }
>
  {/* Your content here */}
</LayoutShell>
```

Done! You now have a professional enterprise layout. ✨

---

## 📦 Copy-Paste Template

```tsx
import { useState } from 'react';
import { LayoutShell, LayoutHeader, LayoutSidebar } from './components/layout';
import { Home, FileText, Settings } from 'lucide-react';

export function MyApp() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <LayoutShell
      header={
        <LayoutHeader
          breadcrumbs={[
            { label: 'My App' },
            { label: activeTab }
          ]}
        />
      }
      sidebar={
        <LayoutSidebar
          items={[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'projects', label: 'Projects', icon: FileText },
            { id: 'settings', label: 'Settings', icon: Settings }
          ]}
          activeItemId={activeTab}
          onItemClick={setActiveTab}
        />
      }
    >
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">
          {activeTab.toUpperCase()}
        </h1>
        <div className="bg-white p-6 rounded-lg shadow">
          Content for {activeTab}
        </div>
      </div>
    </LayoutShell>
  );
}
```

---

## 🎯 Common Recipes

### Add Export Button
```tsx
<LayoutHeader
  breadcrumbs={breadcrumbs}
  primaryAction={{
    label: 'Export',
    icon: Download,
    onClick: () => console.log('Export!')
  }}
/>
```

### Add Status Badges
```tsx
<LayoutHeader
  breadcrumbs={breadcrumbs}
  badges={[
    { label: 'STUDY-001', variant: 'primary' },
    { label: 'Active', variant: 'success' }
  ]}
/>
```

### Add Side Panel
```tsx
const [isPanelOpen, setIsPanelOpen] = useState(false);

<LayoutShell
  // ... other props
  panel={
    <LayoutPanel
      isOpen={isPanelOpen}
      onClose={() => setIsPanelOpen(false)}
      title="Assistant"
    >
      <div className="p-6">Panel content</div>
    </LayoutPanel>
  }
>
```

### Add Navigation Sections
```tsx
<LayoutSidebar
  sections={[
    {
      title: 'Main',
      items: [
        { id: 'home', label: 'Home', icon: Home }
      ]
    },
    {
      title: 'Settings',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ]}
/>
```

### Add Notification Badges
```tsx
<LayoutSidebar
  items={[
    { 
      id: 'inbox', 
      label: 'Messages', 
      icon: Mail,
      badge: 5 // Shows "5" badge
    }
  ]}
/>
```

---

## 🎨 Customization Cheat Sheet

### Change Sidebar Width
```tsx
<LayoutShell sidebarWidth="w-72" /> // Wider
<LayoutShell sidebarWidth="w-48" /> // Narrower
```

### Change Content Width
```tsx
<LayoutShell contentMaxWidth="max-w-4xl" /> // Narrower
<LayoutShell contentMaxWidth="max-w-screen-2xl" /> // Wider
<LayoutShell fullWidth={true} /> // No limit
```

### Change Panel Position
```tsx
<LayoutPanel position="left" /> // Slide from left
<LayoutPanel position="right" /> // Slide from right (default)
```

### Change Panel Width
```tsx
<LayoutPanel width="w-80" /> // Narrower
<LayoutPanel width="w-[500px]" /> // Custom width
```

### Change Badge Colors
```tsx
<LayoutHeader
  badges={[
    { label: 'Active', variant: 'success' },    // Green
    { label: 'Warning', variant: 'warning' },   // Orange
    { label: 'Info', variant: 'info' },         // Indigo
    { label: 'Default', variant: 'default' }    // Gray
  ]}
/>
```

---

## 🔧 Troubleshooting

### Layout looks broken?
**✅ Solution:** Make sure Tailwind CSS is properly configured and imported.

### Panel not sliding?
**✅ Solution:** Check that `isOpen` state is being updated correctly.

### Icons not showing?
**✅ Solution:** Import icons from `lucide-react`:
```tsx
import { Home, Settings } from 'lucide-react';
```

### Navigation not working?
**✅ Solution:** Ensure `activeItemId` matches the `id` of your items:
```tsx
activeItemId="dashboard" // Must match item id exactly
items={[{ id: 'dashboard', ... }]}
```

---

## 📱 Make It Responsive

The layout is responsive by default, but you can enhance it:

```tsx
// Hide sidebar on mobile
<div className="hidden md:block">
  <LayoutSidebar ... />
</div>

// Show mobile menu button
<button className="md:hidden" onClick={toggleMobileMenu}>
  <Menu className="w-6 h-6" />
</button>
```

---

## 🎓 Next Steps

1. **Basic Setup**: Use the copy-paste template above
2. **Add Content**: Replace the placeholder with your actual pages
3. **Customize Style**: Adjust widths, colors, and spacing
4. **Add Features**: Panel, badges, actions as needed
5. **Read Full Docs**: Check `/components/layout/README.md`

---

## 💡 Pro Tips

1. **Keep navigation simple** - Max 7-10 items in sidebar
2. **Use sections** - Group related items for clarity
3. **Limit badges** - Only show critical information
4. **One primary action** - Don't overwhelm the header
5. **Test responsively** - Check mobile, tablet, desktop

---

## 📚 Learn More

- **Full Documentation**: `/components/layout/README.md`
- **Complete Example**: `/components/layout/LayoutExample.tsx`
- **Visual Guide**: `/components/layout/LAYOUT_STRUCTURE.md`
- **Migration Guide**: `/components/layout/REFACTORING_GUIDE.md`

---

## 🎉 You're Ready!

You now have everything you need to build professional applications with the layout system. Start with the template above and customize as you go!

**Happy coding! 🚀**
