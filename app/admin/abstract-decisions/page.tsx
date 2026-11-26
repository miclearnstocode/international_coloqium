"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/app/admin/admin-components/AdminHeader";
import { Sidebar } from "@/app/admin/admin-components/Sidebar";
import { apiFetch } from "@/app/lib/api";
import PaymentReviewDialog, { type PaymentReview } from "./PaymentReviewDialog";

interface Decision {
  id: number;
  research_title: string;
  author: string;
  email_address: string;
  status: "pending" | "accepted" | "rejected";
  evaluator_name?: string | null;
  rejection_reason: string | null;
  email_status: "sent" | "pending" | "untracked";
  email_sent_at: string | null;
  payment_proof: { filename: string; review: PaymentReview | null } | null;
}

const decisionStyles = {
  pending: "bg-amber-100 text-amber-900",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-rose-100 text-rose-800",
};

const abstractLabels = { pending: "Pending", accepted: "Accepted", rejected: "Rejected" };

const emailLabels = {
  sent: "Sent",
  pending: "Awaiting successful send",
  untracked: "No email record",
};

export default function AbstractDecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [filter, setFilter] = useState<"all" | Decision["status"]>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [paymentId, setPaymentId] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await apiFetch("/api/admin/abstract-decisions", {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Could not load abstract decisions.");
        setDecisions(data.decisions);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Could not load abstract decisions.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [refresh]);

  const reviewingPayment = decisions.find((row) => row.id === paymentId);
  const visible = filter === "all" ? decisions : decisions.filter((row) => row.status === filter);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-[#0B2A4A]">
      <Sidebar />
      <main className="ml-64 min-w-0 flex-1">
        <AdminHeader />
        <section className="p-5 lg:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight">Abstract Decisions</h1>
            <div className="flex flex-wrap gap-2">
              <select
                aria-label="Filter by decision"
                value={filter}
                onChange={(event) => setFilter(event.target.value as typeof filter)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="all">All submissions</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                type="button"
                disabled={loading}
                onClick={() => { setLoading(true); setError(""); setRefresh((value) => value + 1); }}
                className="rounded-lg bg-[#0B2A4A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                Refresh
              </button>
            </div>
          </div>
          {loading && <p role="status" className="mb-4 text-sm">Loading decisions…</p>}
          {error && <p role="alert" className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
          {!loading && !error && visible.length === 0 && <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm">No submissions in this view.</p>}
          {!error && visible.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-180 text-left text-sm">
                <thead className="bg-[#0B2A4A] text-white">
                  <tr>
                    {["Abstract", "Decision", "Evaluator", "Notification email", "Rejection reason", "Payment proof"].map((label) => (
                      <th key={label} scope="col" className="px-5 py-4 font-semibold">{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visible.map((row) => {
                    const paymentReview = row.payment_proof?.review;
                    const latestStatus = row.status === "pending" ? row.status : paymentReview?.status ?? row.status;
                    const decisionLabel = paymentReview && latestStatus !== "pending"
                      ? paymentReview.status === "accepted" ? "Payment confirmed" : "Payment rejected"
                      : abstractLabels[latestStatus];

                    return (
                      <tr key={row.id} className="align-top">
                        <th scope="row" className="w-1/3 px-5 py-4 font-semibold">
                          {row.research_title}
                          <span className="mt-1 block font-normal text-slate-600">{row.author}</span>
                        </th>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${decisionStyles[latestStatus]}`}>
                            {decisionLabel}
                          </span>
                        </td>
                        <td className="wrap-break-word px-5 py-4 text-slate-700">
                          {row.evaluator_name ?? (row.status === "pending" ? "—" : "Not recorded")}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold">{row.status === "pending" ? "No decision email yet" : emailLabels[row.email_status]}</p>
                          <p className="mt-1 break-all text-slate-600">{row.email_address}</p>
                          {row.email_sent_at && (
                            <time dateTime={row.email_sent_at} className="mt-1 block text-xs text-slate-600">
                              {new Date(row.email_sent_at).toLocaleString()}
                            </time>
                          )}
                        </td>
                        <td className="max-w-80 wrap-break-word whitespace-pre-wrap px-5 py-4 text-slate-700">
                          {row.status === "rejected" ? row.rejection_reason || "No reason recorded" : "—"}
                        </td>
                        <td className="px-5 py-4">
                          {row.payment_proof ? (
                            <div className="space-y-1">
                              {paymentReview && (
                                <p className="text-xs text-slate-600">
                                  {paymentReview.email_status === "sent" ? "Payment email sent" : "Payment email pending"}
                                </p>
                              )}
                              <button type="button" onClick={() => setPaymentId(row.id)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold">
                                Proof of payment
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-500">No proof uploaded</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {reviewingPayment?.payment_proof && (
            <PaymentReviewDialog
              key={reviewingPayment.id}
              submissionId={reviewingPayment.id}
              title={reviewingPayment.research_title}
              filename={reviewingPayment.payment_proof.filename}
              review={reviewingPayment.payment_proof.review}
              onClose={() => setPaymentId(null)}
              onReviewed={(review) => setDecisions((items) => items.map((item) =>
                item.id === reviewingPayment.id && item.payment_proof
                  ? { ...item, payment_proof: { ...item.payment_proof, review } }
                  : item
              ))}
            />
          )}
        </section>
      </main>
    </div>
  );
}
