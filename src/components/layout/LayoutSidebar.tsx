/**
 * Layout Sidebar Component
 * Reusable left navigation sidebar
 * 
 * Features:
 * - Icon + text navigation items
 * - Active state indicators
 * - Optional section headers
 * - Hover states
 * - Collapsible sections
 */

import { ReactNode } from 'react';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string | number;
  subItems?: SidebarItem[];
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

interface LayoutSidebarProps {
  // Navigation items
  sections?: SidebarSection[];
  items?: SidebarItem[]; // Simple flat list (alternative to sections)
  
  // Active item
  activeItemId?: string;
  onItemClick?: (itemId: string) => void;
  
  // Header/Footer
  header?: ReactNode;
  footer?: ReactNode;
  
  // Styling
  width?: string;
  className?: string;
}

export function LayoutSidebar({
  sections,
  items,
  activeItemId,
  onItemClick,
  header,
  footer,
  width = 'w-60',
  className = '',
}: LayoutSidebarProps) {
  
  const renderItem = (item: SidebarItem, level = 0) => {
    const Icon = item.icon;
    const isActive = activeItemId === item.id;
    const handleClick = () => {
      if (!item.disabled) {
        item.onClick?.();
        onItemClick?.(item.id);
      }
    };
    
    return (
      <div key={item.id}>
        <button
          onClick={handleClick}
          disabled={item.disabled}
          className={`
            w-full flex items-center gap-3 px-4 py-3 text-left transition-all
            ${level > 0 ? 'pl-12' : ''}
            ${isActive 
              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-medium' 
              : 'text-slate-700 hover:bg-slate-50 border-l-4 border-transparent'
            }
            ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {Icon && (
            <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
          )}
          <span className="flex-1 text-sm">{item.label}</span>
          {item.badge && (
            <span className={`
              px-2 py-0.5 text-xs font-medium rounded-full
              ${isActive 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-slate-100 text-slate-600'
              }
            `}>
              {item.badge}
            </span>
          )}
        </button>
        
        {/* Render sub-items if they exist */}
        {item.subItems && item.subItems.length > 0 && (
          <div className="border-l-2 border-slate-100 ml-4">
            {item.subItems.map(subItem => renderItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Convert simple items array to sections format
  const displaySections: SidebarSection[] = sections || (items ? [{ items }] : []);

  return (
    <aside className={`${width} bg-white border-r border-slate-200 flex-shrink-0 flex flex-col ${className}`}>
      {/* Header */}
      {header && (
        <div className="flex-shrink-0 border-b border-slate-200">
          {header}
        </div>
      )}
      
      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto">
        {displaySections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="py-2">
            {/* Section Title */}
            {section.title && (
              <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
            )}
            
            {/* Section Items */}
            <div className="space-y-1">
              {section.items.map(item => renderItem(item))}
            </div>
          </div>
        ))}
      </nav>
      
      {/* Footer */}
      {footer && (
        <div className="flex-shrink-0 border-t border-slate-200">
          {footer}
        </div>
      )}
    </aside>
  );
}
