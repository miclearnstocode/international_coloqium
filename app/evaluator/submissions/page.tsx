"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaFileAlt, FaFolderOpen, FaInbox, FaSearch, FaTimes, FaUser } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { apiFetch } from "@/app/lib/api";
import ConfirmationDialog from "../ConfirmationDialog";
import { useEvaluatorSubmissions, type Submission } from "../useEvaluatorSubmissions";

type Decision = "accepted" | "rejected";
type StatusFilter = "pending" | Decision | "all";

const filters: { value: StatusFilter; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All submissions" },
];

const statusStyles: Record<string, string> = {
  pending: "bg-[#FFF3D9] text-[#805400]",
  accepted: "bg-[#EBF4E5] text-[#28650C]",
  rejected: "bg-rose-50 text-rose-800",
};

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

function AbstractText({ submissionId }: { submissionId: number }) {
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await apiFetch(`/api/evaluator/submissions/${submissionId}/abstract`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.detail || "Could not load the abstract text.");
        if (!controller.signal.aborted) setText(typeof data.abstract === "string" ? data.abstract : "");
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Could not load the abstract text.");
        }
      }
    }
    void load();
    return () => controller.abort();
  }, [submissionId]);

  if (error) return <p className="text-rose-800" role="alert">{error}</p>;
  if (text === null) return <LoadingIndicator label="Loading abstract text…" />;

  return <p className="wrap-break-word whitespace-pre-wrap text-justify leading-relaxed text-zinc-700">{text.trim() ? text : "No abstract text was provided."}</p>;
}

export default function EvaluatorSubmissionsPage() {
  const router = useRouter();
  const { submissions, setSubmissions, loading, loaded, error: syncError, refresh } = useEvaluatorSubmissions();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("pending");
  const [saving, setSaving] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [openSubmissionId, setOpenSubmissionId] = useState<number | null>(null);
  const [confirmation, setConfirmation] = useState<{ submission: Submission; status: Decision } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const previewDialog = useRef<HTMLDialogElement>(null);

  function openAbstract(submission: Submission) {
    setOpenSubmissionId(submission.id);
    setError("");
    setMessage("");
    previewDialog.current?.showModal();
  }

  async function decide(submission: Submission, status: Decision, reason?: string) {
    setSaving(submission.id);
    setError("");
    setMessage("");
    try {
      const path = "/api/evaluator/submissions/" + submission.id;
      const response = status === "accepted"
        ? await apiFetch(path + "/accept", { method: "POST" })
        : await apiFetch(path + "/status", { method: "PUT", body: JSON.stringify({ status, reason }) });
      if (response.status === 401 || response.status === 422) {
        router.replace("/login");
        return;
      }
      const data = await response.json();
      if (response.ok || (response.status === 409 && typeof data.status === "string")) {
        setSubmissions((items) =>
          items.map((item) => item.id === submission.id
            ? { ...item, status: data.status, acceptance_email: data.acceptance_email ?? item.acceptance_email, rejection_email: data.rejection_email ?? item.rejection_email }
            : item)
        );
      }
      if (!response.ok) throw new Error(data.detail || "Could not save the decision.");
      if (data.rejection_email === "pending") {
        setError("The submission is rejected, but the email could not be sent. You can retry the email.");
      } else if (data.rejection_email === "sent") {
        setMessage("Submission rejected and notification email sent.");
      } else if (data.acceptance_email === "pending") {
        setError("The submission is accepted, but the email could not be sent. You can retry the email.");
      } else if (data.acceptance_email === "sent") {
        setMessage("Submission accepted and notification email sent.");
      } else {
        setMessage("Submission " + status + ".");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the decision.");
    } finally {
      refresh();
      setSaving(null);
    }
  }

  function renderReviewActions(item: Submission) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {item.status === "accepted" && item.acceptance_email === "pending" && (
          <button type="button" onClick={() => void decide(item, "accepted")} disabled={saving !== null} className="rounded-lg border border-green-200 px-2.5 py-1.5 text-xs font-bold text-[#28650C] disabled:opacity-60">
            {saving === item.id ? "Sending acceptance email…" : "Retry acceptance email"}
          </button>
        )}
        {item.status === "rejected" && item.rejection_email === "pending" && (
          <button type="button" onClick={() => void decide(item, "rejected")} disabled={saving !== null} className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-bold text-rose-800 disabled:opacity-60">
            {saving === item.id ? "Sending rejection email…" : "Retry rejection email"}
          </button>
        )}
        {item.status === "pending" && (
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setConfirmation({ submission: item, status: "accepted" })} disabled={saving !== null} className="rounded-lg bg-green-700 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-[#1F510A] disabled:opacity-60">Accept</button>
            <button type="button" onClick={() => { setRejectionReason(""); setConfirmation({ submission: item, status: "rejected" }); }} disabled={saving !== null} className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-bold text-rose-800 hover:bg-rose-50 disabled:opacity-60">Reject</button>
            {saving === item.id && <span role="status" className="self-center text-xs text-zinc-600">Saving decision…</span>}
          </div>
        )}
      </div>
    );
  }

  const openSubmission = submissions.find((item) => item.id === openSubmissionId);
  const query = search.trim().toLowerCase();
  const visible = submissions.filter((item) =>
    (filter === "all" || item.status === filter) &&
    [item.research_title, item.author, item.university_agency, item.selected_track, item.specific_track]
      .some((value) => value?.toLowerCase().includes(query))
  );

  return (
    <section id="submissions" className="space-y-4" aria-labelledby="submissions-heading">
      <h2 id="submissions-heading" className="text-xl font-bold">Submissions</h2>
      {loaded && (
        <div className="flex flex-wrap gap-3 rounded-xl border border-zinc-100 bg-white p-4 shadow-sm">
          <div className="relative min-w-48 flex-1">
            <FaSearch aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search submissions"
              aria-label="Search submissions"
              className="w-full rounded-lg border border-zinc-200 py-2 pl-10 pr-4 text-sm focus:border-[#0A2540] focus:outline-none"
            />
          </div>
          <select
            aria-label="Filter by status"
            value={filter}
            onChange={(event) => setFilter(event.target.value as StatusFilter)}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-[#0A2540] focus:outline-none"
          >
            {filters.map(({ value, label }) => <option value={value} key={value}>{label}</option>)}
          </select>
        </div>
      )}
      {((!openSubmissionId && error) || syncError) && (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <span>{(!openSubmissionId && error) || (loaded ? "Could not refresh submissions. Showing the last synced list." : syncError)}</span>
          {!loaded && (
            <button type="button" onClick={refresh} className="font-semibold underline">
              Try again
            </button>
          )}
        </div>
      )}
      {message && !openSubmissionId && <p role="status" className="rounded-xl bg-[#EBF4E5] p-4 text-sm font-semibold text-[#28650C]">{message}</p>}
      {loading && <p role="status">Loading abstracts…</p>}
      {loaded && (
        <div
          role="region"
          aria-label="Submission list"
          tabIndex={0}
          className="max-h-[65dvh] overflow-auto overscroll-contain rounded-xl border border-zinc-100 bg-white shadow-sm focus-visible:outline-2 focus-visible:outline-[#0A2540]"
        >
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-zinc-50 text-zinc-600">
              <tr>
                {["Title", "Author", "Type", "Status", "Date", "Actions"].map((label) => (
                  <th key={label} scope="col" className="border-b border-zinc-200 px-4 py-3 font-semibold">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-zinc-500">
                    <FaInbox aria-hidden="true" className="mx-auto mb-3 text-3xl text-zinc-300" />
                    No submissions found.
                  </td>
                </tr>
              )}
              {visible.map((item) => (
                <tr
                  key={item.id}
                  onClick={(event) => {
                    if (event.target instanceof Element && event.target.closest("button, a, input")) return;
                    openAbstract(item);
                  }}
                  className="cursor-pointer align-top hover:bg-zinc-50 focus-within:bg-zinc-50"
                >
                  <th scope="row" className="w-1/3 px-4 py-3 font-medium">
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      onClick={() => openAbstract(item)}
                      className="wrap-break-word rounded-sm text-left hover:underline focus-visible:outline-2"
                    >
                      {item.research_title}
                    </button>
                    <p className="mt-1 text-xs font-normal text-zinc-500">{item.selected_track} · {item.specific_track}</p>
                  </th>
                  <td className="px-4 py-3 text-zinc-600">
                    <p>{item.author}</p>
                    <p className="mt-1 text-xs text-zinc-500">{item.university_agency}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-zinc-600">{item.presentation_type || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[item.status] ?? "bg-zinc-100 text-zinc-700"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-zinc-600">{item.created_at?.slice(0, 10) ?? "—"}</td>
                  <td className="px-4 py-3">
                    {renderReviewActions(item)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <dialog
        ref={previewDialog}
        aria-labelledby="abstract-file-title"
        onClose={() => setOpenSubmissionId(null)}
        className="m-auto h-[95dvh] max-h-none w-[calc(100%-1rem)] max-w-7xl overflow-hidden rounded-2xl bg-white text-[#0A2540] shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm sm:w-[calc(100%-3rem)]"
      >
        <div className="flex h-full flex-col">
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-200 bg-[#F8FBF5] px-5 py-4 sm:px-6">
            <h3 id="abstract-file-title" className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <FaFolderOpen aria-hidden="true" className="text-[#1D3D6D]" /> Submission Details
            </h3>
            <button type="button" aria-label="Close submission details" onClick={() => previewDialog.current?.close()} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 focus-visible:outline-2">
              <FaTimes aria-hidden="true" />
            </button>
          </header>
          {openSubmission ? (
            <div className="min-h-0 flex-1 overflow-y-auto lg:overflow-hidden">
              <div className="grid gap-5 p-4 sm:p-6 lg:h-full lg:grid-cols-[1fr_1.2fr] lg:grid-rows-[minmax(0,1fr)]">
                <div className="min-w-0 space-y-4 lg:overflow-y-auto lg:pr-2">
                  <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <h4 className="mb-4 flex items-center gap-2 border-b border-zinc-100 pb-3 text-xs font-bold tracking-widest text-zinc-600 uppercase">
                      <FaFileAlt aria-hidden="true" className="text-[#28650C]" /> General information
                    </h4>
                    <dl className="grid grid-cols-2 gap-4 text-sm">
                      <div className="col-span-2">
                        <dt className="text-xs font-semibold text-zinc-500 uppercase">Research title</dt>
                        <dd className="mt-1 wrap-break-word text-lg font-bold">{openSubmission.research_title}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold text-zinc-500 uppercase">Presentation type</dt>
                        <dd className="mt-1 capitalize">{openSubmission.presentation_type || "—"}</dd>
                      </div>
                      <div>
                        <dt className="mb-1 text-xs font-semibold text-zinc-500 uppercase">Status</dt>
                        <dd className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[openSubmission.status] ?? "bg-zinc-100 text-zinc-700"}`}>
                          {openSubmission.status}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold text-zinc-500 uppercase">Track</dt>
                        <dd className="mt-1">{openSubmission.selected_track}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold text-zinc-500 uppercase">Sub-track</dt>
                        <dd className="mt-1">{openSubmission.specific_track}</dd>
                      </div>
                    </dl>
                  </section>
                  <section className="rounded-xl border border-[#DCE6DB] bg-[#F7FAF5] p-5">
                    <h4 className="mb-4 flex items-center gap-2 border-b border-[#DCE6DB] pb-3 text-xs font-bold tracking-widest text-[#28650C] uppercase">
                      <FaUser aria-hidden="true" /> Authorship
                    </h4>
                    <dl className="space-y-3 text-sm">
                      <div><dt className="text-xs font-semibold text-zinc-500 uppercase">Author</dt><dd className="mt-1">{openSubmission.author}</dd></div>
                      {openSubmission.co_author && <div><dt className="text-xs font-semibold text-zinc-500 uppercase">Co-authors</dt><dd className="mt-1">{openSubmission.co_author}</dd></div>}
                      <div><dt className="text-xs font-semibold text-zinc-500 uppercase">University or agency</dt><dd className="mt-1">{openSubmission.university_agency}</dd></div>
                    </dl>
                  </section>
                  <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-5 text-sm">
                    <h4 className="border-b border-zinc-100 pb-3 text-xs font-bold tracking-widest text-zinc-600 uppercase">Abstract</h4>
                    <AbstractText key={openSubmission.id} submissionId={openSubmission.id} />
                    <p><strong>Keywords</strong> {openSubmission.keywords}</p>
                    {openSubmission.rejection_reason && (
                      <p className="wrap-break-word whitespace-pre-wrap"><strong>Rejection reason</strong> {openSubmission.rejection_reason}</p>
                    )}
                  </section>
                </div>

                <section className="min-w-0 rounded-xl border border-[#4FC3F7]/30 bg-[#F2F9FF] p-5 shadow-sm lg:overflow-y-auto">
                  <h4 className="flex items-center gap-2 border-b border-[#4FC3F7]/20 pb-3 text-sm font-bold tracking-wide text-[#1D3D6D] uppercase">
                    <FaFileAlt aria-hidden="true" /> Abstract PDF Viewer
                  </h4>
                  <AbstractPreview submission={openSubmission} />
                </section>
              </div>
            </div>
          ) : (
            <p className="flex-1 p-5 text-sm text-zinc-600">This submission is no longer available in the review queue.</p>
          )}
          <footer className="shrink-0 border-t border-zinc-200 bg-white px-5 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] sm:px-6">
            {error && <p role="alert" className="mb-3 text-sm text-rose-800">{error}</p>}
            {message && <p role="status" className="mb-3 text-sm text-[#28650C]">{message}</p>}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>{openSubmission && renderReviewActions(openSubmission)}</div>
              <button type="button" onClick={() => previewDialog.current?.close()} className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold hover:bg-zinc-200 focus-visible:outline-2">
                Close
              </button>
            </div>
          </footer>
        </div>
      </dialog>
      <ConfirmationDialog
        open={confirmation !== null}
        title={confirmation?.status === "rejected" ? "Reject this abstract?" : "Accept this abstract?"}
        confirmLabel={confirmation?.status === "rejected" ? "Reject abstract" : "Accept abstract"}
        confirmDisabled={confirmation?.status === "rejected" && !rejectionReason.trim()}
        tone={confirmation?.status === "rejected" ? "danger" : "positive"}
        onCancel={() => setConfirmation(null)}
        onConfirm={() => {
          if (!confirmation) return;
          setConfirmation(null);
          void decide(confirmation.submission, confirmation.status, confirmation.status === "rejected" ? rejectionReason.trim() : undefined);
        }}
      >
        <p className="font-semibold text-[#0B2A4A]">{confirmation?.submission.research_title}</p>
        {confirmation?.status === "rejected" && (
          <label className="mt-4 block font-semibold text-[#0B2A4A]">
            Rejection reason
            <textarea
              required
              rows={4}
              maxLength={2000}
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              className="mt-2 block w-full rounded-xl border border-slate-300 p-3 font-normal focus-visible:outline-2"
            />
            <span className="mt-1 block text-xs font-normal text-slate-600">This reason will be included in the email to the submitter.</span>
          </label>
        )}
        {confirmation?.status === "accepted" && (
          <p className="mt-2">The system will send an acceptance email to the address on the submission.</p>
        )}
      </ConfirmationDialog>
      <Link href="/" className="inline-block text-sm font-semibold underline">Symposium homepage</Link>
    </section>
  );
}
