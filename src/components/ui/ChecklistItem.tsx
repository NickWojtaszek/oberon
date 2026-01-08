/**
 * Reusable Checklist Item Component
 * Used in Research Wizard, Unblinding Gate, and other validation flows
 */

import { CheckCircle } from 'lucide-react';

interface ChecklistItemProps {
  label: string;
  completed: boolean;
  description?: string;
  required?: boolean;
  className?: string;
}

export function ChecklistItem({ 
  label, 
  completed, 
  description,
  required = false,
  className = ''
}: ChecklistItemProps) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="mt-0.5 flex-shrink-0">
        {completed ? (
          <CheckCircle className="w-5 h-5 text-emerald-600" />
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium ${completed ? 'text-slate-900' : 'text-slate-500'}`}>
          {label}
          {required && !completed && (
            <span className="ml-2 text-xs text-red-600">*Required</span>
          )}
        </div>
        {description && (
          <div className="text-xs text-slate-600 mt-0.5">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

interface ChecklistProps {
  items: Array<{
    id: string;
    label: string;
    completed: boolean;
    description?: string;
    required?: boolean;
  }>;
  title?: string;
  className?: string;
}

export function Checklist({ items, title, className = '' }: ChecklistProps) {
  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const allComplete = completedCount === totalCount;
  
  return (
    <div className={className}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-slate-900">{title}</h3>
          <span className={`text-xs font-medium px-2 py-1 rounded ${
            allComplete 
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-100 text-slate-600'
          }`}>
            {completedCount}/{totalCount}
          </span>
        </div>
      )}
      <div className="space-y-3">
        {items.map(item => (
          <ChecklistItem
            key={item.id}
            label={item.label}
            completed={item.completed}
            description={item.description}
            required={item.required}
          />
        ))}
      </div>
    </div>
  );
}
