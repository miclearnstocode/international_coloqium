"use client";

import { useEffect, useRef } from "react";
import { FaExclamationTriangle, FaSpinner } from "react-icons/fa";

export type ConfirmVariant = "danger" | "warning" | "info" | "primary";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_STYLES: Record<
  ConfirmVariant,
  { iconBg: string; iconColor: string; confirmBtn: string }
> = {
  danger: {
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    confirmBtn: "bg-red-600 hover:bg-red-700 text-white",
  },
  warning: {
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    confirmBtn: "bg-yellow-600 hover:bg-yellow-700 text-white",
  },
  info: {
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    confirmBtn: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  primary: {
    iconBg: "bg-[#0B2A4A]/10",
    iconColor: "text-[#0B2A4A]",
    confirmBtn: "bg-[#0B2A4A] hover:bg-[#143b66] text-white",
  },
};

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Yes, Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  isProcessing = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Focus the confirm button when the dialog opens (a11y + Enter flow)
  useEffect(() => {
    if (open) {
      // Slight delay so the fade-in doesn't steal focus
      const t = setTimeout(() => confirmRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Escape key closes the dialog (only when not processing)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isProcessing) {
        e.preventDefault();
        onCancel();
      }
      if (e.key === "Enter" && !isProcessing) {
        e.preventDefault();
        onConfirm();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, isProcessing, onCancel, onConfirm]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const styles = VARIANT_STYLES[variant];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
        onClick={() => !isProcessing && onCancel()}
      />

      {/* Dialog box */}
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-[popIn_200ms_cubic-bezier(0.22,1,0.36,1)]"
      >
        {/* Header */}
        <div className="p-6 pb-4 flex gap-4">
          <div
            className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${styles.iconBg} ${styles.iconColor}`}
          >
            <FaExclamationTriangle className="text-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              id="confirm-title"
              className="text-base font-bold text-gray-800 mb-1"
            >
              {title}
            </h3>
            <div
              id="confirm-message"
              className="text-sm text-gray-600 leading-relaxed"
            >
              {message}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${styles.confirmBtn}`}
          >
            {isProcessing && <FaSpinner className="animate-spin" />}
            {isProcessing ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>

      {/* Keyframes — global so they can be reused elsewhere */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.94) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};