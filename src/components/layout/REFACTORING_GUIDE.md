# Refactoring Guide: Using the New Layout System

This guide shows how to refactor your existing Clinical Intelligence Engine to use the new modular layout components.

## Before (Old Way)

```tsx
import { WorkspaceShell, NavigationPanel, GlobalHeader } from './unified-workspace';

function ResearchFactoryApp() {
  return (
    <div>
      <GlobalHeader 
        breadcrumbs={breadcrumbs}
        autonomyMode={autonomyMode}
        onAutonomyChange={setAutonomyMode}
        primaryAction={exportAction}
        // ... many more props
      />
      <WorkspaceShell
        navigation={<NavigationPanel activeTab={activeTab} onTabChange={setActiveTab} />}
        utilitySidebar={<LogicAuditSidebar ... />}
        utilitySidebarOpen={sidebarOpen}
      >
        {/* Content */}
      </WorkspaceShell>
    </div>
  );
}
```

---

## After (New Way)

```tsx
import { 
  LayoutShell, 
  LayoutHeader, 
  LayoutSidebar, 
  LayoutPanel 
} from './components/layout';
import type { SidebarSection } from './components/layout';

function ResearchFactoryApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Configure navigation sections
  const navSections: SidebarSection[] = [
    {
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'protocol-workbench', label: 'Protocol Workbench', icon: FlaskConical },
        { id: 'research-wizard', label: 'Research Wizard', icon: Sparkles },
      ]
    },
    {
      title: 'Library',
      items: [
        { id: 'project-library', label: 'Projects', icon: Folder },
        { id: 'protocol-library', label: 'Protocols', icon: FolderOpen },
      ]
    }
  ];

  return (
    <LayoutShell
      header={
        <LayoutHeader
          breadcrumbs={[
            { label: 'Research Factory', onClick: () => setActiveTab('dashboard') },
            { label: getCurrentPageTitle(activeTab) }
          ]}
          badges={[
            { 
              icon: Building, 
              label: currentProject?.studyNumber || 'No Project',
              variant: 'default'
            }
          ]}
          centerContent={
            {/* Autonomy Slider or other custom content */}
          }
          primaryAction={{
            label: 'Export Package',
            icon: Download,
            onClick: handleExport,
            loading: isExporting
          }}
          secondaryActions={[
            { 
              label: 'Run Logic Check', 
              icon: CheckCircle,
              onClick: () => setIsPanelOpen(true)
            }
          ]}
        />
      }
      sidebar={
        <LayoutSidebar
          sections={navSections}
          activeItemId={activeTab}
          onItemClick={setActiveTab}
          header={
            <div className="p-4">
              <h1 className="text-xl font-bold">Clinical Intelligence</h1>
            </div>
          }
        />
      }
      panel={
        <LayoutPanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          title="Logic Audit"
          width="w-[400px]"
        >
          <LogicAuditContent />
        </LayoutPanel>
      }
    >
      {/* Render active tab content */}
      {activeTab === 'dashboard' && <DashboardV2 />}
      {activeTab === 'protocol-workbench' && <ProtocolWorkbench />}
      {activeTab === 'research-wizard' && <ResearchWizard />}
      {/* ... other tabs */}
    </LayoutShell>
  );
}
```

---

## Key Benefits of Refactoring

### ✅ **1. Cleaner Component Structure**
- Separated concerns: Layout vs. Content
- Each component has a single responsibility
- Easier to test and maintain

### ✅ **2. Reusability**
- Use the same layout in multiple apps
- Consistent UX across projects
- Easy to create templates

### ✅ **3. Better TypeScript Support**
- Strong typing for all props
- Auto-completion in IDE
- Catch errors at compile time

### ✅ **4. Flexibility**
- Mix and match components
- Easy to customize per page
- Progressive enhancement

### ✅ **5. Simplified State Management**
- Less prop drilling
- Clearer data flow
- Easier debugging

---

## Migration Checklist

### Phase 1: Setup
- [ ] Copy layout components to `/components/layout/`
- [ ] Import layout components in your main app file
- [ ] Test that all components compile without errors

### Phase 2: Header Migration
- [ ] Replace `<GlobalHeader>` with `<LayoutHeader>`
- [ ] Map breadcrumbs to new format
- [ ] Convert badges to new Badge type
- [ ] Move autonomy slider to `centerContent` prop
- [ ] Test header functionality

### Phase 3: Sidebar Migration
- [ ] Replace `<NavigationPanel>` with `<LayoutSidebar>`
- [ ] Convert navigation items to `SidebarSection[]` format
- [ ] Add icons from lucide-react
- [ ] Test navigation and active states

### Phase 4: Panel Migration
- [ ] Replace utility sidebar with `<LayoutPanel>`
- [ ] Move toggle logic to parent component
- [ ] Add close handler
- [ ] Test panel open/close behavior

### Phase 5: Shell Migration
- [ ] Replace `<WorkspaceShell>` with `<LayoutShell>`
- [ ] Connect header, sidebar, and panel
- [ ] Adjust content padding and max-width if needed
- [ ] Test responsive behavior

### Phase 6: Cleanup
- [ ] Remove old layout components (WorkspaceShell, GlobalHeader, NavigationPanel)
- [ ] Update imports across codebase
- [ ] Remove unused props and state
- [ ] Run full application test

---

## Advanced Customization

### Adding Role-Based Access Control
```tsx
const navSections: SidebarSection[] = [
  {
    title: 'Main',
    items: [
      { 
        id: 'admin-panel', 
        label: 'Admin', 
        icon: Shield,
        disabled: !userHasAdminRole // Disable based on role
      }
    ]
  }
];
```

### Adding Notifications Badge
```tsx
const navSections: SidebarSection[] = [
  {
    items: [
      { 
        id: 'inbox', 
        label: 'Messages', 
        icon: Mail,
        badge: unreadCount // Show unread count
      }
    ]
  }
];
```

### Custom Header Content
```tsx
<LayoutHeader
  breadcrumbs={breadcrumbs}
  centerContent={
    <AutonomySlider 
      mode={autonomyMode} 
      onChange={setAutonomyMode}
    />
  }
  rightContent={
    <>
      <LanguageToggle />
      <UserProfileMenu />
    </>
  }
/>
```

### Nested Navigation
```tsx
const navSections: SidebarSection[] = [
  {
    title: 'Research',
    items: [
      {
        id: 'protocol',
        label: 'Protocol',
        icon: FlaskConical,
        subItems: [ // Nested items
          { id: 'protocol-builder', label: 'Builder' },
          { id: 'protocol-library', label: 'Library' },
          { id: 'protocol-templates', label: 'Templates' }
        ]
      }
    ]
  }
];
```

---

## Troubleshooting

### Issue: Layout looks broken after migration
**Solution:** Check that you're importing Tailwind CSS and all icon components.

### Issue: Panel doesn't slide in smoothly
**Solution:** Ensure `isOpen` state is properly managed and the backdrop is enabled.

### Issue: Navigation items not highlighting when active
**Solution:** Make sure `activeItemId` matches the `id` of your nav items exactly.

### Issue: Header actions not working
**Solution:** Verify that `onClick` handlers are properly bound and not undefined.

---

## Next Steps

1. **Test thoroughly** - Verify all functionality works after refactoring
2. **Update documentation** - Document your specific navigation structure
3. **Create reusable templates** - Build page templates using the layout system
4. **Optimize performance** - Use React.memo for layout components if needed
5. **Add analytics** - Track navigation and interaction patterns

---

## Need Help?

- Review `/components/layout/README.md` for detailed API documentation
- Check `/components/layout/LayoutExample.tsx` for a complete working example
- Test individual components in isolation before integration

Happy refactoring! 🚀
