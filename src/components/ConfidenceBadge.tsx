export type ConfidenceLevel = 'high' | 'medium' | 'low';

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  size?: 'sm' | 'md' | 'lg';
}

export function ConfidenceBadge({ level, size = 'md' }: ConfidenceBadgeProps) {
  const styles = {
    high: 'bg-green-50 text-green-700 border-green-300',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-300',
    low: 'bg-red-50 text-red-700 border-red-300',
  };

  const labels = {
    high: 'High Confidence',
    medium: 'Medium Confidence',
    low: 'Low Confidence',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1',
    lg: 'px-4 py-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border ${styles[level]} ${sizeStyles[size]}`}
    >
      {labels[level]}
    </span>
  );
}
