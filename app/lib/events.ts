export type PublicEvent = {
  id: number;
  title: string;
  description: string;
  date: string;
  endDate: string;
  location: string;
  category: string;
  status: "Draft" | "Published";
  featured: boolean;
  order: number;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

// ── Simple in-memory cache so Header + Footer only hit the API once per page load ──
let cache: { data: PublicEvent[]; ts: number } | null = null;
const CACHE_TTL = 30_000; // 30s

export async function fetchPublicEvents(): Promise<PublicEvent[]> {
  const now = Date.now();
  if (cache && now - cache.ts < CACHE_TTL) return cache.data;

  try {
    const res = await fetch(`${API_BASE}/api/events`, {
      headers: { Accept: "application/json" },
      // no-store so Next doesn't cache in dev
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: PublicEvent[] = await res.json();
    cache = { data, ts: now };
    return data;
  } catch (err) {
    console.warn("[events] fetchPublicEvents failed:", err);
    return [];
  }
}

/**
 * Pick the "featured" event for the header/footer, or fall back to the next
 * upcoming one. Returns null if there are no events.
 */
export function pickFeaturedEvent(
  events: PublicEvent[]
): PublicEvent | null {
  if (!events.length) return null;

  const featured = events.find((e) => e.featured);
  if (featured) return featured;

  // Otherwise, soonest upcoming first
  const withDates = events.filter((e) => !!e.date);
  const sorted = [...withDates].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  return sorted[0] || events[0];
}

/**
 * Format a date range like "March 10–13, 2027" or "March 10, 2027".
 * Works with ISO dates ("2027-03-10") and returns "" for empty input.
 */
export function formatDateRange(
  start: string,
  end?: string | null
): string {
  if (!start) return "";

  const parse = (s: string) => {
    // Parse as local date to avoid TZ off-by-one
    const [y, m, d] = s.split("-").map((n) => parseInt(n, 10));
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  };

  const s = parse(start);
  if (!s) return start;

  const monthName = (dt: Date) =>
    dt.toLocaleString("en-US", { month: "long" });

  if (!end) {
    return `${monthName(s)} ${s.getDate()}, ${s.getFullYear()}`;
  }

  const e = parse(end);
  if (!e) {
    return `${monthName(s)} ${s.getDate()}, ${s.getFullYear()}`;
  }

  // Same month & year → "March 10–13, 2027"
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${monthName(s)} ${s.getDate()}–${e.getDate()}, ${s.getFullYear()}`;
  }

  // Same year, different month → "March 10 – April 2, 2027"
  if (s.getFullYear() === e.getFullYear()) {
    return `${monthName(s)} ${s.getDate()} – ${monthName(e)} ${e.getDate()}, ${s.getFullYear()}`;
  }

  // Different years
  return `${monthName(s)} ${s.getDate()}, ${s.getFullYear()} – ${monthName(
    e
  )} ${e.getDate()}, ${e.getFullYear()}`;
}