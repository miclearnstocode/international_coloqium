"use client";

import { useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaUpload } from "react-icons/fa";
import LoadingIndicator from "../components/LoadingIndicator";
import { apiFetch } from "../lib/api";

const MAX_PROOF_SIZE = 60 * 1024 * 1024;

interface PaymentProofActionProps {
  submissionId: number;
  filename?: string | null;
  onUploaded: (filename: string) => void;
}

const previewImageTypes = new Set([
  "image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp", "image/avif", "image/x-icon", "image/vnd.microsoft.icon",
]);

interface PaymentProofPreviewProps {
  submissionId: number;
  filename: string;
}

async function normalizePreview(blob: Blob) {
  if (blob.type === "application/pdf" || previewImageTypes.has(blob.type)) return blob;
  const signature = new Uint8Array(await blob.slice(0, 3).arrayBuffer());
  if (signature[0] === 0xff && signature[1] === 0xd8 && signature[2] === 0xff) {
    return new Blob([blob], { type: "image/jpeg" });
  }
  return blob;
}

export function PaymentProofPreview({ submissionId, filename }: PaymentProofPreviewProps) {
  const [preview, setPreview] = useState<{ url: string; type: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let url: string | undefined;
    async function load() {
      try {
        const response = await apiFetch(`/api/abstracts/${submissionId}/payment-proof?preview=1`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.detail || "Could not load your attachment.");
        }
        const blob = await normalizePreview(await response.blob());
        if (controller.signal.aborted) return;
        url = URL.createObjectURL(blob);
        setPreview({ url, type: blob.type });
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Could not load your attachment.");
        }
      }
    }
    void load();
    return () => {
      controller.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [submissionId]);

  return (
    <div className="w-full space-y-2 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
      {error && <p role="alert" className="text-rose-800">{error}</p>}
      {!preview && !error && <LoadingIndicator label="Loading attachment…" />}
      {preview && (
        <>
          {preview.type === "application/pdf" ? (
            <iframe src={preview.url} title={filename} className="h-[50dvh] w-full rounded-md border border-slate-200" />
          ) : previewImageTypes.has(preview.type) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview.url} alt="Uploaded payment proof" className="mx-auto max-h-80 max-w-full rounded-md object-contain" />
          ) : (
            <p>This file format can’t be previewed here.</p>
          )}
        </>
      )}
    </div>
  );
}

export default function PaymentProofAction({ submissionId, filename, onUploaded }: PaymentProofActionProps) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setError("");
    if (file.size === 0 || file.size > MAX_PROOF_SIZE) {
      setError("Choose a non-empty file up to 60 MB.");
      return;
    }

    const body = new FormData();
    body.set("payment_proof", file);
    setUploading(true);
    try {
      const response = await apiFetch("/api/abstracts/" + submissionId + "/payment-proof", { method: "POST", body });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.detail || (response.status === 413
          ? "The server rejected the file size."
          : "Could not upload proof of payment."));
      }
      onUploaded(data.payment_proof_filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload proof of payment.");
    } finally {
      setUploading(false);
    }
  }

  if (filename) {
    return (
      <div className="min-w-36 px-2 text-xs">
        <div role="status" className="text-[#28650C]">
          <span className="flex items-center gap-1.5 font-semibold"><FaCheckCircle aria-hidden="true" /> Proof uploaded</span>
          <span className="mt-1 block max-w-40 truncate text-slate-600" title={filename}>{filename}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-40 space-y-1">
      <input
        ref={input}
        type="file"
        accept="application/pdf,image/*,.pdf,.jfif"
        className="hidden"
        aria-label="Select proof of payment"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = "";
          if (file) void upload(file);
        }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => input.current?.click()}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B2A4A] px-3 py-2 text-left text-xs font-semibold text-white hover:bg-[#163F59] disabled:opacity-60"
      >
        {uploading ? "Uploading…" : <><FaUpload aria-hidden="true" /> Upload proof of payment</>}
      </button>
      {uploading
        ? <LoadingIndicator label="Uploading proof of payment…" className="text-xs text-[#0B2A4A]" />
        : <p className="text-xs text-slate-600">PDF or image · up to 60 MB</p>}
      {error && <p role="alert" className="max-w-48 text-xs text-rose-800">{error}</p>}
    </div>
  );
}
