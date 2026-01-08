// Tracked Changes Type Definitions

export type ChangeType = 'insertion' | 'deletion' | 'replacement';
export type ChangeStatus = 'pending' | 'accepted' | 'rejected';
export type UserRole = 'PI' | 'Co-author' | 'Statistician' | 'Reviewer' | 'Editor';

export interface TrackedChange {
  id: string;
  type: ChangeType;
  timestamp: number;
  author: string;
  role: UserRole;
  section: 'introduction' | 'methods' | 'results' | 'discussion' | 'conclusion';
  
  // Position tracking
  startPos: number;
  endPos: number;
  
  // Content
  originalText?: string; // For deletions/replacements
  newText?: string; // For insertions/replacements
  
  // Status
  status: ChangeStatus;
  reviewedBy?: string;
  reviewedAt?: number;
  
  // Optional metadata
  comment?: string;
}

export type ViewMode = 'markup' | 'clean' | 'original';

export interface TrackedChangesState {
  changes: TrackedChange[];
  viewMode: ViewMode;
  showChanges: boolean;
  filterByAuthor?: string;
  filterByRole?: UserRole;
}

// Color coding for different users/roles
export const ROLE_COLORS: Record<UserRole, string> = {
  'PI': '#3b82f6', // blue
  'Co-author': '#10b981', // green
  'Statistician': '#8b5cf6', // purple
  'Reviewer': '#f59e0b', // amber
  'Editor': '#ef4444' // red
};

// Helper to get role-specific styles
export function getRoleStyles(role: UserRole): { color: string; bgColor: string; borderColor: string } {
  const baseColor = ROLE_COLORS[role];
  return {
    color: baseColor,
    bgColor: `${baseColor}20`,
    borderColor: baseColor
  };
}
