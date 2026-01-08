import { useState, useEffect } from 'react';
import { Check, X, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastData {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      icon: <Check className="w-5 h-5 text-green-600" />,
      text: 'text-green-900',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      text: 'text-red-900',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      icon: <Info className="w-5 h-5 text-blue-600" />,
      text: 'text-blue-900',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
      text: 'text-yellow-900',
    },
  };

  const style = styles[toast.type];

  return (
    <div
      className={`${style.bg} border ${style.border} rounded-lg p-4 shadow-lg flex items-start gap-3 min-w-[320px] max-w-[480px] mb-3 animate-slide-up`}
    >
      {style.icon}
      <div className={`flex-1 ${style.text}`}>{toast.message}</div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (type: ToastType, message: string, duration?: number) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message, duration }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    addToast,
    dismissToast,
    showSuccess: (message: string, duration?: number) => addToast('success', message, duration),
    showError: (message: string, duration?: number) => addToast('error', message, duration),
    showInfo: (message: string, duration?: number) => addToast('info', message, duration),
    showWarning: (message: string, duration?: number) => addToast('warning', message, duration),
  };
}
