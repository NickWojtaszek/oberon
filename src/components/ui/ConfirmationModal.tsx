/**
 * Reusable Confirmation Modal Component
 * Used for critical actions like Unblinding, Lock Configuration, etc.
 */

import { ReactNode, useState } from 'react';
import { X, LucideIcon } from 'lucide-react';

export type ModalVariant = 'default' | 'warning' | 'danger' | 'success' | 'info';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: string;
  variant?: ModalVariant;
  icon?: LucideIcon;
  confirmText?: string;
  cancelText?: string;
  requiresConfirmation?: boolean; // Requires typing a confirmation word
  confirmationWord?: string; // Word that must be typed (e.g., "UNBLIND")
  requiresSignature?: boolean; // Requires signature field
  signatureLabel?: string;
  children?: ReactNode; // Custom content
  isLoading?: boolean;
  disabled?: boolean;
}

const variantStyles: Record<ModalVariant, {
  header: string;
  iconBg: string;
  confirmButton: string;
}> = {
  default: {
    header: 'bg-slate-50 border-slate-200',
    iconBg: 'bg-slate-100',
    confirmButton: 'bg-blue-600 hover:bg-blue-700',
  },
  warning: {
    header: 'bg-amber-50 border-amber-200',
    iconBg: 'bg-amber-100',
    confirmButton: 'bg-amber-600 hover:bg-amber-700',
  },
  danger: {
    header: 'bg-red-50 border-red-200',
    iconBg: 'bg-red-100',
    confirmButton: 'bg-red-600 hover:bg-red-700',
  },
  success: {
    header: 'bg-emerald-50 border-emerald-200',
    iconBg: 'bg-emerald-100',
    confirmButton: 'bg-emerald-600 hover:bg-emerald-700',
  },
  info: {
    header: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100',
    confirmButton: 'bg-blue-600 hover:bg-blue-700',
  },
};

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  variant = 'default',
  icon: Icon,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  requiresConfirmation = false,
  confirmationWord = 'CONFIRM',
  requiresSignature = false,
  signatureLabel = 'Digital Signature',
  children,
  isLoading = false,
  disabled = false,
}: ConfirmationModalProps) {
  const [confirmationInput, setConfirmationInput] = useState('');
  const [signatureInput, setSignatureInput] = useState('');
  
  const styles = variantStyles[variant];
  
  const isConfirmDisabled = 
    disabled ||
    isLoading ||
    (requiresConfirmation && confirmationInput !== confirmationWord) ||
    (requiresSignature && !signatureInput.trim());
  
  const handleConfirm = async () => {
    if (isConfirmDisabled) return;
    await onConfirm();
    // Reset inputs
    setConfirmationInput('');
    setSignatureInput('');
  };
  
  const handleClose = () => {
    setConfirmationInput('');
    setSignatureInput('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className={`border-b-2 px-6 py-4 rounded-t-xl ${styles.header}`}>
          <div className="flex items-start gap-4">
            {Icon && (
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${styles.iconBg}`}>
                <Icon className="w-6 h-6" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-slate-900 mb-1">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-slate-700">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-slate-600 hover:text-slate-800 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {children}
          
          {/* Signature Field */}
          {requiresSignature && (
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {signatureLabel}
              </label>
              <input
                type="text"
                value={signatureInput}
                onChange={(e) => setSignatureInput(e.target.value)}
                placeholder="Enter your full name"
                disabled={isLoading}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          )}
          
          {/* Confirmation Field */}
          {requiresConfirmation && (
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Type <code className="bg-slate-100 px-2 py-0.5 rounded text-red-600">{confirmationWord}</code> to confirm
              </label>
              <input
                type="text"
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder={`Type ${confirmationWord}`}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 rounded-b-xl flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${styles.confirmButton}`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
