"use client";

import { useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaHourglassHalf, FaList, FaTimesCircle } from "react-icons/fa";
import { useEvaluatorSubmissions, type Submission } from "./useEvaluatorSubmissions";

function TrackDistributionChart({ tracks }: { tracks: [string, number][] }) {
  const plotRegion = useRef<HTMLDivElement>(null);
  const [regionWidth, setRegionWidth] = useState(0);
  const hasTracks = tracks.length > 0;
  const width = Math.max(regionWidth, 340, tracks.length * 92);

  useEffect(() => {
    const region = plotRegion.current;
    if (!region) return;
    const observer = new ResizeObserver(([entry]) => setRegionWidth(Math.floor(entry.contentRect.width)));
    observer.observe(region);
    return () => observer.disconnect();
  }, [hasTracks]);
  const bottom = 122;
  const top = 25;
  const step = Math.max(1, Math.ceil(Math.max(0, ...tracks.map(([, count]) => count)) / 3));
  const ticks = [0, step, step * 2, step * 3];
  const y = (count: number) => bottom - (count / (step * 3)) * (bottom - top);
  const points = tracks.map(([track, count], index) => ({
    track,
    count,
    x: 44 + ((index + 0.5) * (width - 52)) / tracks.length,
    y: y(count),
  }));

  return (
    <div className="min-w-0 rounded-xl border border-zinc-100 bg-white p-5 shadow-sm">
      <h3 className="border-b border-zinc-100 pb-3 text-base font-bold">Submission distribution by track</h3>
      {!hasTracks ? (
        <p className="mt-4 text-sm text-zinc-600">No submissions yet.</p>
      ) : (
        <div ref={plotRegion} className="mt-3 overflow-x-auto" role="region" aria-label="Scientific track distribution chart" tabIndex={0}>
          <svg
            viewBox={`0 0 ${width} 155`}
            className="block w-full"
            style={{ minWidth: width }}
            role="img"
            aria-label={points.map(({ track, count }) => `${track}: ${count}`).join("; ")}
          >
            {ticks.map((tick) => (
              <g key={tick}>
                <line x1="44" y1={y(tick)} x2={width - 8} y2={y(tick)} stroke="#E4E4E7" />
                <text x="38" y={y(tick)} dy="0.35em" textAnchor="end" className="fill-zinc-600 text-[11px]">{tick}</text>
              </g>
            ))}
            {points.length > 1 && (
              <polyline
                points={points.map(({ x, y: position }) => `${x},${position}`).join(" ")}
                fill="none"
                stroke="#0B2A4A"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}
            {points.map(({ track, count, x, y: position }) => (
              <g key={track}>
                <title>{`${track}: ${count}`}</title>
                <circle cx={x} cy={position} r="4" fill="#28650C" stroke="white" strokeWidth="1.5" />
                <text x={x} y={position - 9} textAnchor="middle" className="fill-[#0B2A4A] text-[11px] font-bold">{count}</text>
                <text x={x} y="145" textAnchor="middle" className="fill-zinc-600 text-[11px]">
                  {track.match(/^Track\s+\d+/i)?.[0] ?? (track.length > 14 ? track.slice(0, 13) + "…" : track)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}
    </div>
  );
}

function EvaluationOverview({ submissions }: { submissions: Submission[] }) {
  const total = submissions.length;
  const pending = submissions.filter(({ status }) => status === "pending").length;
  const accepted = submissions.filter(({ status }) => status === "accepted").length;
  const rejected = submissions.filter(({ status }) => status === "rejected").length;
  const other = total - pending - accepted - rejected;
  const metrics = [
    { label: "Total submissions", value: total, accent: "text-[#0A2540]", Icon: FaList },
    { label: "Pending", value: pending, accent: "text-yellow-700", Icon: FaHourglassHalf },
    { label: "Accepted", value: accepted, accent: "text-green-700", Icon: FaCheckCircle },
    { label: "Rejected", value: rejected, accent: "text-red-700", Icon: FaTimesCircle },
  ];
  const statuses = [
    { label: "Pending", count: pending, color: "#D5A54D" },
    { label: "Accepted", count: accepted, color: "#449821" },
    { label: "Rejected", count: rejected, color: "#A73747" },
    ...(other ? [{ label: "Other", count: other, color: "#64748B" }] : []),
  ];
  const radius = 54;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  const activeStatuses = statuses.filter(({ count }) => count > 0);
  let offset = 0;
  const segments = activeStatuses.map(({ label, count, color }) => {
    const length = count / total * circumference;
    const rounded = length > strokeWidth + 6;
    const inset = Math.min(length / 4, rounded ? (strokeWidth + 3) / 2 : 1.5);
    const segment = { label, color, rounded, start: offset + inset, length: length - 2 * inset };
    offset += length;
    return segment;
  });
  const tracks = new Map<string, number>();
  for (const { selected_track } of submissions) {
    const track = selected_track?.trim() || "Unassigned track";
    tracks.set(track, (tracks.get(track) ?? 0) + 1);
  }
  const bars = [...tracks].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const orderedTracks = [...tracks].sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }));
  const maxTrackCount = bars[0]?.[1] ?? 1;

  return (
    <section id="overview" aria-labelledby="overview-heading" className="space-y-4">
      <h2 id="overview-heading" className="text-xl font-bold">Overview</h2>
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map(({ label, value, accent, Icon }) => (
          <div key={label} className="flex items-center justify-between gap-2 rounded-xl border border-zinc-100 bg-white p-4 shadow-sm">
            <div>
              <dt className="text-sm text-zinc-500">{label}</dt>
              <dd className={`text-2xl font-bold tabular-nums ${accent}`}>{value}</dd>
            </div>
            <span className={`shrink-0 text-2xl sm:text-3xl ${accent}`}>
              <Icon aria-hidden="true" />
            </span>
          </div>
        ))}
      </dl>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-100 bg-white p-5 shadow-sm">
          <h3 className="border-b border-zinc-100 pb-3 text-base font-bold">Review status</h3>
          <div className="mt-5 flex flex-wrap items-center gap-6">
            <div className="relative grid size-32 shrink-0 place-items-center" aria-hidden="true">
              <svg viewBox="0 0 128 128" className="absolute inset-0 size-full">
                <g transform="rotate(-90 64 64)" fill="none" strokeWidth={strokeWidth}>
                  {segments.length <= 1 ? (
                    <circle cx="64" cy="64" r={radius} stroke={segments[0]?.color ?? "#E5E7EB"} />
                  ) : segments.map(({ label, color, rounded, start, length }) => (
                    <circle
                      key={label}
                      cx="64"
                      cy="64"
                      r={radius}
                      stroke={color}
                      strokeLinecap={rounded ? "round" : "butt"}
                      strokeDasharray={`${length} ${circumference - length}`}
                      strokeDashoffset={-start}
                    />
                  ))}
                </g>
              </svg>
              <span className="relative text-xl font-extrabold tabular-nums">{total}</span>
            </div>
            <ul className="min-w-36 flex-1 space-y-2 text-sm">
              {statuses.map(({ label, count, color }) => (
                <li key={label} className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2">
                  <span aria-hidden="true" className="size-3 rounded-full" style={{ backgroundColor: color }} />
                  <span>{label}</span>
                  <strong className="ml-auto tabular-nums">{count}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-100 bg-white p-5 shadow-sm">
          <h3 className="border-b border-zinc-100 pb-3 text-base font-bold">Submissions by scientific track</h3>
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
                  <div aria-hidden="true" className="h-2.5 overflow-hidden rounded-full bg-zinc-100">
                    <div className="h-full rounded-full bg-[#0A2540]" style={{ width: (count / maxTrackCount * 100) + "%" }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="min-w-0 lg:col-span-2">
          <TrackDistributionChart tracks={orderedTracks} />
        </div>
      </div>
    </section>
  );
}

export default function EvaluatorOverviewPage() {
  const { submissions, loading, loaded, error, refresh } = useEvaluatorSubmissions();

  if (loaded) return (
    <>
      {error && <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Could not refresh the overview. Showing the last synced totals.</p>}
      <EvaluationOverview submissions={submissions} />
    </>
  );

  return (
    <div className="rounded-xl border border-zinc-100 bg-white p-5 shadow-sm">
      {loading && <p role="status">Loading overview…</p>}
      {error && (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <span>{error}</span>
          <button type="button" onClick={refresh} className="font-semibold underline">Try again</button>
        </div>
      )}
    </div>
  );
}
