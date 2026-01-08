export type StatusType = 'draft' | 'validated' | 'locked' | 'deprecated';

interface StatusBadgeProps {
  status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    draft: 'bg-gray-100 text-gray-700 border-gray-300',
    validated: 'bg-green-50 text-green-700 border-green-300',
    locked: 'bg-green-50 text-green-700 border-green-300',
    deprecated: 'bg-red-50 text-red-700 border-red-300',
  };

  const labels = {
    draft: 'Draft',
    validated: 'Validated',
    locked: 'Locked',
    deprecated: 'Deprecated',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-lg border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
