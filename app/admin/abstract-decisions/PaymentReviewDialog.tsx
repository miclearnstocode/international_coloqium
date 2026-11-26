"use client";

import { useEffect, useRef, useState } from "react";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { apiFetch } from "@/app/lib/api";

export interface PaymentReview {
  status: "accepted" | "rejected";
  reason: string;
  email_status: "sent" | "pending";
}

interface PaymentReviewDialogProps {
  submissionId: number;
  title: string;
  filename: string;
  review: PaymentReview | null;
  onReviewed: (review: PaymentReview) => void;
  onClose: () => void;
}

const previewImages = new Set(["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp", "image/avif", "image/x-icon"]);

export default function PaymentReviewDialog({
  submissionId, title, filename, review, onReviewed, onClose,
}: PaymentReviewDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const reasonInput = useRef<HTMLTextAreaElement>(null);
  const requestInFlight = useRef(false);
  const [preview, setPreview] = useState<{ url: string; type: string } | null>(null);
  const [previewError, setPreviewError] = useState("");
  const [showRejectionReason, setShowRejectionReason] = useState(false);
  const [reason, setReason] = useState("");
  const [sendingStatus, setSendingStatus] = useState<PaymentReview["status"] | null>(null);
  const saving = sendingStatus !== null;
  const [error, setError] = useState("");
  const [reasonError, setReasonError] = useState("");

  useEffect(() => {
    const element = dialog.current;
    if (element && !element.open) element.showModal();
    return () => { if (element?.open) element.close(); };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let objectUrl: string | undefined;
    async function load() {
      try {
        const response = await apiFetch(`/api/abstracts/${submissionId}/payment-proof?preview=1`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.detail || "Could not load the payment proof.");
        }
        const blob = await response.blob();
        if (controller.signal.aborted) return;
        objectUrl = URL.createObjectURL(blob);
        setPreview({ url: objectUrl, type: blob.type });
      } catch (err) {
        if (!controller.signal.aborted) {
          setPreviewError(err instanceof Error ? err.message : "Could not load the payment proof.");
        }
      }
    }
    void load();
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [submissionId]);

  useEffect(() => {
    if (showRejectionReason) reasonInput.current?.focus();
  }, [showRejectionReason]);

  async function save(status: PaymentReview["status"]) {
    if (requestInFlight.current) return;
    const trimmedReason = reason.trim();
    if (!review && status === "rejected" && !trimmedReason) {
      setReasonError("Enter a reason for rejecting the payment.");
      reasonInput.current?.focus();
      return;
    }

    requestInFlight.current = true;
    setSendingStatus(status);
    setError("");
    setReasonError("");
    try {
      const response = await apiFetch(`/api/admin/abstracts/${submissionId}/payment-review`, {
        method: "POST",
        body: JSON.stringify({ status, reason: !review && status === "rejected" ? trimmedReason : undefined }),
      });
      const data = await response.json().catch(() => ({}));
      if (data.review) onReviewed(data.review);
      if (!response.ok) throw new Error(data.detail || "Could not save the payment review.");
      if (typeof data.email_error === "string") setError(data.email_error);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the payment review.");
    } finally {
      requestInFlight.current = false;
      setSendingStatus(null);
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby="payment-review-title"
      onCancel={(event) => { event.preventDefault(); if (!saving) onClose(); }}
      className="m-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto rounded-2xl bg-white text-[#0B2A4A] shadow-2xl backdrop:bg-[#061F39]/70"
    >
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-[#0B2A4A] px-5 py-4 text-white">
        <h2 id="payment-review-title" className="text-lg font-bold">Review proof of payment</h2>
        <button type="button" disabled={saving} onClick={onClose} className="rounded-lg border border-white/40 px-3 py-1.5 text-sm font-semibold disabled:opacity-60">Close</button>
      </header>
      <div className="space-y-4 p-5">
        <p className="font-bold">{title}</p>
        {previewError && <p role="alert" className="text-sm text-rose-800">{previewError}</p>}
        {!preview && !previewError && <p role="status" className="text-sm text-slate-600">Loading receipt…</p>}
        {preview && (
          <div className="space-y-2">
            {preview.type === "application/pdf" ? (
              <iframe src={preview.url} title="Payment proof PDF" className="h-[50dvh] w-full rounded-xl border border-slate-200" />
            ) : previewImages.has(preview.type) ? (
              // The receipt is an authenticated object URL created from the validated upload.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview.url} alt="Uploaded payment proof" className="mx-auto max-h-[50dvh] max-w-full rounded-xl border border-slate-200 object-contain" />
            ) : (
              <p className="text-sm text-slate-600">Download the receipt to view this file format.</p>
            )}
            <a href={preview.url} download={filename} className="inline-block text-sm font-semibold underline">Download receipt</a>
          </div>
        )}

        {review ? (
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <p className="font-bold">{review.status === "accepted" ? "Payment confirmed" : "Payment rejected"}</p>
            {review.reason && <p className="wrap-break-word whitespace-pre-wrap">{review.reason}</p>}
            {!saving && (
              <p role="status" className={review.email_status === "sent" ? "font-semibold text-green-800" : "text-rose-800"}>
                {review.email_status === "sent"
                  ? review.status === "rejected" ? "Rejection email sent to the submitter." : "Confirmation email sent to the submitter."
                  : "Decision saved. The email could not be sent. Use Retry email to send it again."}
              </p>
            )}
            {review.email_status === "pending" && (
              <button type="button" disabled={saving} onClick={() => void save(review.status)} className="rounded-lg bg-[#0B2A4A] px-4 py-2 font-semibold text-white disabled:opacity-60">
                {saving ? "Sending…" : "Retry email"}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {showRejectionReason ? (
              <>
                <label className="block text-sm font-semibold">
                  Reason for rejection
                  <textarea
                    ref={reasonInput}
                  disabled={saving}
                    required
                    aria-invalid={!!reasonError}
                    aria-describedby={reasonError ? "payment-reason-error payment-reason-hint" : "payment-reason-hint"}
                    rows={3}
                    maxLength={2000}
                    value={reason}
                    onChange={(event) => {
                      setReason(event.target.value);
                      if (reasonError) setReasonError("");
                    }}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 font-normal"
                  />
                </label>
                {reasonError && <p id="payment-reason-error" role="alert" className="text-sm font-medium text-rose-800">{reasonError}</p>}
                <p id="payment-reason-hint" className="text-xs text-slate-600">The reason will be included in the email to the submitter.</p>
                <div className="flex flex-wrap justify-end gap-2 text-sm font-semibold">
                  <button type="button" disabled={saving} onClick={() => { setShowRejectionReason(false); setReason(""); setReasonError(""); }} className="rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
                  <button type="button" disabled={saving} onClick={() => void save("rejected")} className="rounded-lg bg-rose-800 px-4 py-2 text-white hover:bg-rose-900 disabled:opacity-50">{sendingStatus === "rejected" ? "Rejecting…" : "Send rejection"}</button>
                </div>
              </>
            ) : (
              <div className="flex flex-wrap justify-end gap-2 text-sm font-semibold">
                <button type="button" disabled={saving} onClick={() => { setError(""); setShowRejectionReason(true); }} className="rounded-lg border border-rose-200 px-4 py-2 text-rose-800 hover:bg-rose-50 disabled:opacity-50">Reject payment</button>
                <button type="button" disabled={saving} onClick={() => void save("accepted")} className="rounded-lg bg-[#28650C] px-4 py-2 text-white hover:bg-[#1F510A] disabled:opacity-50">Confirm payment</button>
              </div>
            )}
          </div>
        )}
        {sendingStatus && (
          <LoadingIndicator
            label={sendingStatus === "rejected" ? "Sending rejection email…" : "Sending confirmation email…"}
            className="text-sm font-semibold text-[#0B2A4A]"
          />
        )}
        {error && <p role="alert" className="text-sm text-rose-800">{error}</p>}
      </div>
    </dialog>
  );
}
