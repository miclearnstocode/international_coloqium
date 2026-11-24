"use client";

import { useEvaluatorSubmissions, type Submission } from "./useEvaluatorSubmissions";

function EvaluationOverview({ submissions }: { submissions: Submission[] }) {
  const total = submissions.length;
  const pending = submissions.filter(({ status }) => status === "pending").length;
  const accepted = submissions.filter(({ status }) => status === "accepted").length;
  const rejected = submissions.filter(({ status }) => status === "rejected").length;
  const other = total - pending - accepted - rejected;
  const metrics = [
    { label: "Total submissions", value: total, color: "text-[#0B2A4A]" },
    { label: "Pending", value: pending, color: "text-[#895800]" },
    { label: "Accepted", value: accepted, color: "text-[#28650C]" },
  ];
  let start = 0;
  const statuses = [
    { label: "Pending", count: pending, color: "#D5A54D" },
    { label: "Accepted", count: accepted, color: "#449821" },
    { label: "Rejected", count: rejected, color: "#A73747" },
    ...(other ? [{ label: "Other", count: other, color: "#64748B" }] : []),
  ];
  const segments = statuses.map(({ count, color }) => {
    const end = start + (total ? count / total * 100 : 0);
    const segment = color + " " + start + "% " + end + "%";
    start = end;
    return segment;
  });
  const tracks = new Map<string, number>();
  for (const { selected_track } of submissions) {
    const track = selected_track?.trim() || "Unassigned track";
    tracks.set(track, (tracks.get(track) ?? 0) + 1);
  }
  const bars = [...tracks].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const maxTrackCount = bars[0]?.[1] ?? 1;

  return (
    <section id="overview" aria-labelledby="overview-heading" className="mx-auto max-w-6xl space-y-5 px-5 py-8 sm:px-8">
      <h2 id="overview-heading" className="text-xl font-bold">Overview</h2>
      <dl className="grid gap-3 sm:grid-cols-3">
        {metrics.map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-[#D6DFCD] bg-white p-5">
            <dt className="text-sm font-semibold text-zinc-600">{label}</dt>
            <dd className={"mt-2 text-3xl font-extrabold tabular-nums " + color}>{value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#D6DFCD] bg-white p-5">
          <h3 className="font-bold">Review status</h3>
          <div className="mt-4 flex flex-wrap items-center gap-6">
            <div
              aria-hidden="true"
              className="grid size-32 shrink-0 place-items-center rounded-full"
              style={{ background: total ? "conic-gradient(" + segments.join(", ") + ")" : "#E5E7EB" }}
            >
              <div className="grid size-22 place-items-center rounded-full bg-white text-xl font-extrabold tabular-nums">{total}</div>
            </div>
            <ul className="min-w-32 space-y-2 text-sm">
              {statuses.map(({ label, count, color }) => (
                <li key={label} className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-3 rounded-full" style={{ backgroundColor: color }} />
                  <span>{label}</span>
                  <strong className="ml-auto tabular-nums">{count}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-[#D6DFCD] bg-white p-5">
          <h3 className="font-bold">Submissions by scientific track</h3>
          {bars.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-600">No submissions yet.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {bars.map(([track, count]) => (
                <li key={track}>
                  <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                    <span>{track}</span>
                    <strong className="tabular-nums">{count}</strong>
                  </div>
                  <div aria-hidden="true" className="h-2.5 overflow-hidden rounded-full bg-[#EBF4E5]">
                    <div className="h-full rounded-full bg-[#28650C]" style={{ width: (count / maxTrackCount * 100) + "%" }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default function EvaluatorOverviewPage() {
  const { submissions, loading, loaded, error, retry } = useEvaluatorSubmissions();

  if (loaded) return <EvaluationOverview submissions={submissions} />;

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      {loading && <p role="status">Loading overview…</p>}
      {error && (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <span>{error}</span>
          <button type="button" onClick={retry} className="font-semibold underline">Try again</button>
        </div>
      )}
    </div>
  );
}
