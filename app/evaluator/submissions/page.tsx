"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { apiFetch } from "@/app/lib/api";
import { useEvaluatorSubmissions, type Submission } from "../useEvaluatorSubmissions";

type Decision = "accepted" | "rejected";
type StatusFilter = "pending" | Decision | "all";

const filters: { value: StatusFilter; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All submissions" },
];

function getDriveFile(value: string | null | undefined) {
  if (!value?.trim()) return null;

  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }

  if (url.origin !== "https://drive.google.com") return null;

  const pathId = url.pathname.match(/^\/file\/d\/([\w-]+)(?:\/|$)/)?.[1];
  const queryId = /^\/(?:open|uc)\/?$/.test(url.pathname) ? url.searchParams.get("id") : null;
  const id = pathId ?? queryId;
  if (!id || !/^[\w-]+$/.test(id)) return null;

  const view = new URL("/file/d/" + id + "/view", url.origin);
  const resourceKey = url.searchParams.get("resourcekey");
  if (resourceKey) view.searchParams.set("resourcekey", resourceKey);

  const preview = new URL(view);
  preview.pathname = "/file/d/" + id + "/preview";
  return { view: view.href, preview: preview.href };
}

function AbstractPreview({ submission }: { submission: Submission }) {
  const file = getDriveFile(submission.abstract_drive_view_url)
    ?? getDriveFile(submission.abstract_drive_download_url);
  if (!file) {
    const responseHasFileFields = "abstract_drive_view_url" in submission || "abstract_drive_download_url" in submission;
    return (
      <p className="mt-3 text-sm text-zinc-600">
        {responseHasFileFields
          ? "No usable Google Drive file link was found for this submission."
          : "The evaluator API did not return the Drive file link."}
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      <iframe
        src={file.preview}
        title={submission.research_title + " — abstract PDF"}
        loading="lazy"
        className="h-[60dvh] min-h-80 w-full rounded-xl border border-zinc-200 bg-zinc-50"
      />
      <a href={file.view} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-semibold underline">
        Open in Google Drive
      </a>
    </div>
  );
}

export default function EvaluatorSubmissionsPage() {
  const router = useRouter();
  const { submissions, setSubmissions, loading, loaded, error, setError, retry } = useEvaluatorSubmissions();
  const [filter, setFilter] = useState<StatusFilter>("pending");
  const [saving, setSaving] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [openSubmission, setOpenSubmission] = useState<Submission | null>(null);
  const previewDialog = useRef<HTMLDialogElement>(null);

  async function decide(submission: Submission, status: Decision) {
    const action = status === "accepted" ? "Accept" : "Reject";
    if (submission.status === "pending" && !window.confirm(action + ' "' + submission.research_title + '"?')) return;
    setSaving(submission.id);
    setError("");
    setMessage("");
    try {
      const path = "/api/evaluator/submissions/" + submission.id;
      const response = status === "accepted"
        ? await apiFetch(path + "/accept", { method: "POST" })
        : await apiFetch(path + "/status", { method: "PUT", body: JSON.stringify({ status }) });
      if (response.status === 401 || response.status === 422) {
        router.replace("/login");
        return;
      }
      const data = await response.json();
      if (response.ok || (response.status === 409 && typeof data.status === "string")) {
        setSubmissions((items) =>
          items.map((item) => item.id === submission.id
            ? { ...item, status: data.status, acceptance_email: data.acceptance_email ?? item.acceptance_email }
            : item)
        );
      }
      if (!response.ok) throw new Error(data.detail || "Could not save the decision.");
      if (data.acceptance_email === "pending") {
        setError("The submission is accepted, but the email could not be sent. Open Accepted to retry.");
      } else if (data.acceptance_email === "sent") {
        setMessage("Submission accepted and notification email sent.");
      } else {
        setMessage("Submission " + status + ".");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the decision.");
    } finally {
      setSaving(null);
    }
  }

  const visible = filter === "all" ? submissions : submissions.filter((item) => item.status === filter);

  return (
    <section id="submissions" className="mx-auto max-w-6xl space-y-5 px-5 py-8 sm:px-8" aria-labelledby="submissions-heading">
      <h2 id="submissions-heading" className="text-xl font-bold">Submissions</h2>
      {loaded && (
        <div className="flex flex-wrap gap-2" aria-label="Filter submissions">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={filter === value
                ? "rounded-full bg-[#0B2A4A] px-4 py-2 text-sm font-bold text-white"
                : "rounded-full border border-[#D6DFCD] bg-white px-4 py-2 text-sm font-semibold hover:bg-[#EBF4E5]"}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {error && (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <span>{error}</span>
          {!loaded && (
            <button type="button" onClick={retry} className="font-semibold underline">
              Try again
            </button>
          )}
        </div>
      )}
      {message && <p role="status" className="rounded-xl bg-[#EBF4E5] p-4 text-sm font-semibold text-[#28650C]">{message}</p>}
      {loading && <p role="status">Loading abstracts…</p>}
      {loaded && visible.length === 0 && <p className="rounded-xl border border-[#D6DFCD] bg-white p-6">No submissions in this view.</p>}
      {visible.length > 0 && (
        <div
          role="region"
          aria-label="Submission list"
          tabIndex={0}
          className="max-h-[65dvh] space-y-4 overflow-y-auto rounded-2xl border border-[#D6DFCD] p-3 focus-visible:outline-2 focus-visible:outline-[#0B2A4A] sm:p-4"
        >
          {visible.map((item) => (
            <article key={item.id} className="rounded-2xl border border-[#D6DFCD] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="break-words text-lg font-bold">{item.research_title}</h2>
                  <p className="mt-1 text-sm text-zinc-600">{item.author} · {item.university_agency}</p>
                  <p className="mt-1 text-sm text-zinc-600">{item.selected_track} · {item.specific_track}</p>
                </div>
                <span className="shrink-0 rounded-full bg-[#EBF4E5] px-3 py-1 text-xs font-bold capitalize text-[#28650C]">{item.status}</span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-4">
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => {
                    setOpenSubmission(item);
                    previewDialog.current?.showModal();
                  }}
                  className="rounded-lg border border-[#0B2A4A]/20 px-4 py-2 text-sm font-bold hover:bg-[#0B2A4A]/5 focus-visible:outline-2"
                >
                  Abstract File
                </button>
                {item.status === "accepted" && item.acceptance_email === "pending" && (
                  <button type="button" onClick={() => void decide(item, "accepted")} disabled={saving !== null} className="rounded-lg border border-[#28650C] px-4 py-2 text-sm font-bold text-[#28650C] disabled:opacity-60">
                    {saving === item.id ? "Sending acceptance email…" : "Retry acceptance email"}
                  </button>
                )}
                {item.status === "pending" && (
                  <div className="flex flex-wrap gap-3">
                    <button type="button" onClick={() => void decide(item, "accepted")} disabled={saving !== null} className="rounded-lg bg-[#28650C] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">Accept</button>
                    <button type="button" onClick={() => void decide(item, "rejected")} disabled={saving !== null} className="rounded-lg border border-red-300 px-4 py-2 text-sm font-bold text-red-800 disabled:opacity-60">Reject</button>
                    {saving === item.id && <span role="status" className="self-center text-sm text-zinc-600">Saving decision…</span>}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      <dialog
        ref={previewDialog}
        aria-labelledby="abstract-file-title"
        onClose={() => setOpenSubmission(null)}
        className="m-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto overscroll-contain rounded-2xl bg-white text-[#0A2540] shadow-2xl backdrop:bg-[#061F39]/70"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-[#0B2A4A] px-5 py-4 text-white">
          <h3 id="abstract-file-title" className="text-lg font-bold">Abstract File</h3>
          <button
            type="button"
            onClick={() => previewDialog.current?.close()}
            className="rounded-lg border border-white/40 px-3 py-1.5 text-sm font-semibold hover:bg-white/10 focus-visible:outline-2"
          >
            Close
          </button>
        </div>
        {openSubmission && (
          <div className="p-5">
            <p className="break-words font-bold">{openSubmission.research_title}</p>
            {openSubmission.co_author && <p className="mt-2 text-sm text-zinc-700"><strong>Co-authors</strong> {openSubmission.co_author}</p>}
            {openSubmission.presentation_type && <p className="mt-2 text-sm text-zinc-700"><strong>Presentation</strong> {openSubmission.presentation_type}</p>}
            <AbstractPreview submission={openSubmission} />
            <p className="mt-3 text-sm text-zinc-700"><strong>Keywords</strong> {openSubmission.keywords}</p>
          </div>
        )}
      </dialog>
      <Link href="/" className="inline-block text-sm font-semibold underline">Symposium homepage</Link>
    </section>
  );
}
