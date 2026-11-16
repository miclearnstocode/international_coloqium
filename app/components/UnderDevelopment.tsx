"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FaTools,
  FaBell,
  FaHourglassHalf,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

interface UnderDevelopmentProps {
  /** Section/module name, e.g. "Registration Form" */
  title?: string;
  /** Short description shown under the title */
  description?: string;
  /** Optional list of features / info for users */
  notes?: string[];
  /** Compact layout (smaller modal) */
  compact?: boolean;
  /** Optional contact email */
  contactEmail?: string;
  /** Controls modal visibility */
  open: boolean;
  /** Called when modal should close (backdrop, ESC, X) */
  onClose: () => void;
  /** z-index of the modal (default 9999) */
  zIndex?: number;
  /** Lock body scroll while open (default true) */
  lockScroll?: boolean;
  /** Close when clicking the backdrop (default true) */
  closeOnBackdrop?: boolean;
  /** Close when pressing Escape (default true) */
  closeOnEscape?: boolean;
}

export default function UnderDevelopment({
  title = "Under Development",
  description = "This section is currently being built and will be available soon.",
  notes = [
    "Our team is actively developing this feature.",
    "All data and functionality will be available once it goes live.",
    "Please check back regularly for updates.",
  ],
  compact = false,
  contactEmail = "internationalsymposium@capsu.edu.ph",
  open,
  onClose,
  zIndex = 9999,
  lockScroll = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
}: UnderDevelopmentProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Ensure we only render portal on client after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle open/close with enter + exit animation
  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      setVisible(true);
      // focus first focusable inside dialog
      requestAnimationFrame(() => {
        const focusable = dialogRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      });
    } else {
      setVisible(false);
      // restore focus
      previouslyFocused.current?.focus?.();
    }
  }, [open]);

  // ESC key
  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeOnEscape, onClose]);

  // Focus trap
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Body scroll lock
  useEffect(() => {
    if (!open || !lockScroll) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, lockScroll]);

  if (!mounted) return null;
  if (!visible) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="under-dev-title"
      aria-describedby="under-dev-desc"
      className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
      style={{ zIndex }}
    >
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={closeOnBackdrop ? onClose : undefined}
        className={`absolute inset-0 bg-[#0A2540]/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Modal Card */}
      <div
        ref={dialogRef}
        className={`relative w-full ${compact ? "max-w-md" : "max-w-lg"} overflow-hidden rounded-2xl border border-amber-200/60 bg-linear-to-br from-[#FFFCF5] via-white to-[#F8FBF5] shadow-2xl shadow-[#0A2540]/40 transition-all duration-300 ${
          open
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-95"
        } ${compact ? "p-6" : "p-8 sm:p-10"}`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 border border-amber-200 text-[#0A2540] flex items-center justify-center transition-all duration-200 hover:bg-amber-100 hover:rotate-90 hover:border-amber-300"
        >
          <FaTimes className="text-sm" />
        </button>

        {/* Decorative glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-amber-300/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#76B947]/15 blur-3xl"
        />

        {/* Dashed corner accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-3 rounded-xl border border-dashed border-amber-300/40"
        />

        <div className="relative flex flex-col items-center text-center">
          {/* Animated icon badge */}
          <div className="relative mb-5">
            <span className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-linear-to-br from-[#F0C674] to-[#D5A54D] flex items-center justify-center shadow-lg shadow-amber-400/30">
              <FaTools className="text-white text-2xl" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-amber-300 flex items-center justify-center shadow">
              <FaHourglassHalf className="text-[#D5A54D] text-[11px]" />
            </div>
          </div>

          {/* Status pill */}
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Work in Progress
          </span>

          <h3
            id="under-dev-title"
            className={`font-bold text-[#0A2540] ${
              compact ? "text-lg" : "text-2xl"
            } mb-2`}
          >
            {title}
          </h3>

          <p
            id="under-dev-desc"
            className={`text-zinc-600 ${
              compact ? "text-xs" : "text-sm"
            } max-w-md mb-6 leading-relaxed`}
          >
            {description}
          </p>

          {/* Additional info notes */}
          {notes.length > 0 && (
            <div className="w-full max-w-md text-left bg-white/70 backdrop-blur-sm border border-amber-100 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FaInfoCircle className="text-[#D5A54D] text-sm" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#0A2540]">
                  What to expect
                </span>
              </div>
              <ul className="space-y-2">
                {notes.map((note, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-zinc-600"
                  >
                    <span className="text-[#76B947] mt-0.5 shrink-0">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Stay tuned banner */}
          <div className="w-full max-w-md bg-linear-to-r from-[#0B2A4A] to-[#1D3D6D] rounded-xl px-5 py-4 mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-left">
              <FaBell className="text-[#F0C674] text-lg shrink-0 animate-[wiggle_1.4s_ease-in-out_infinite]" />
              <div>
                <p className="text-white text-sm font-bold leading-tight">
                  Stay Tuned
                </p>
                <p className="text-white/70 text-[11px] leading-tight">
                  Updates coming soon — check back regularly.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          {contactEmail && (
            <p
              className={`text-zinc-400 ${
                compact ? "text-[10px]" : "text-xs"
              } mt-2`}
            >
              Questions? Contact{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-[#1D3D6D] font-semibold hover:text-[#76B947] transition-colors"
              >
                {contactEmail}
              </a>
            </p>
          )}
        </div>

        {/* Keyframes */}
        <style jsx>{`
          @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            15% { transform: rotate(-12deg); }
            30% { transform: rotate(10deg); }
            45% { transform: rotate(-6deg); }
            60% { transform: rotate(4deg); }
            75% { transform: rotate(-2deg); }
          }
        `}</style>
      </div>
    </div>,
    document.body
  );
}