"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  confirmDisabled?: boolean;
  tone?: "positive" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

const tones = {
  positive: {
    icon: FaCheck,
    badge: "bg-[#EBF4E5] text-[#28650C]",
    button: "bg-[#28650C] hover:bg-[#1F510A]",
  },
  danger: {
    icon: FaExclamationTriangle,
    badge: "bg-rose-50 text-rose-800",
    button: "bg-rose-800 hover:bg-rose-900",
  },
};

export default function ConfirmationDialog({
  open, title, children, confirmLabel, confirmDisabled = false, tone = "positive", onConfirm, onCancel,
}: ConfirmationDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  const { icon: Icon, badge, button } = tones[tone];

  useEffect(() => {
    const element = dialog.current;
    if (open && element && !element.open) element.showModal();
    if (!open && element?.open) element.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby={id + "-title"}
      aria-describedby={id + "-description"}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border-t-4 border-[#D5A54D] bg-white text-[#0B2A4A] shadow-2xl backdrop:bg-[#061F39]/65 backdrop:backdrop-blur-sm"
    >
      <div className="space-y-4 p-6">
        <span className={"grid size-11 place-items-center rounded-xl " + badge}>
          <Icon aria-hidden="true" />
        </span>
        <h2 id={id + "-title"} className="text-xl font-extrabold tracking-tight">{title}</h2>
        <div id={id + "-description"} className="wrap-break-word text-sm leading-relaxed text-slate-600">
          {children}
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
        <button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100 focus-visible:outline-2">
          Cancel
        </button>
        <button type="button" onClick={onConfirm} disabled={confirmDisabled} className={"disabled:opacity-50 rounded-xl px-4 py-2 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B2A4A] " + button}>
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
