"use client";

import { ReactNode, useCallback, useRef, useState } from "react";
import { ConfirmDialog, ConfirmVariant } from "./ConfirmDialog";

interface ConfirmOptions {
  title: string;
  message: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
}

interface PendingConfirm extends ConfirmOptions {
  resolve: (value: boolean) => void;
}

export function useConfirm() {
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setPending({ ...options, resolve });
    });
  }, []);

  const handleConfirm = () => {
    if (!pending) return;
    pending.resolve(true);
    setPending(null);
  };

  const handleCancel = () => {
    if (!pending) return;
    pending.resolve(false);
    setPending(null);
  };

  const ConfirmDialogHost = (
    <ConfirmDialog
      open={!!pending}
      title={pending?.title ?? ""}
      message={pending?.message ?? ""}
      confirmLabel={pending?.confirmLabel}
      cancelLabel={pending?.cancelLabel}
      variant={pending?.variant}
      isProcessing={isProcessing}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { confirm, ConfirmDialogHost };
}