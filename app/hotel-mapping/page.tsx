"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaBuilding, FaCar, FaChevronRight, FaInfoCircle, FaMapMarkerAlt } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UnderDevelopment from "../components/UnderDevelopment";
import LoadingIndicator from "../components/LoadingIndicator";
import { hotelMappingPage } from "../admin/content-structures/hotelMapping";
import { apiFetch } from "../lib/api";
import { venueIcons } from "./venueIcons";
import HotelActionCard, { hotelActionUrl } from "./HotelActionCard";

const VenueMap = dynamic(() => import("./VenueMap"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center"><LoadingIndicator label="Loading map…" /></div>,
});

type HotelContent = {
  content?: Record<string, Record<string, string | null>>;
  items?: Record<string, Record<string, unknown>[]>;
};

const sectionLabels = new Map(hotelMappingPage.structure.flatMap((section) =>
  section.fields.map(({ key }) => [key, section.section] as const)
));

const itemText = (value: unknown) => typeof value === "string" ? value.trim() : "";

function contentList(content: HotelContent | null, key: string) {
  const items = content?.items?.[key];
  return Array.isArray(items)
    ? items.filter((item) => item && typeof item === "object" && !Array.isArray(item))
    : [];
}

function coordinates(value: unknown): [number, number] | undefined {
  const parts = typeof value === "string" ? value.split(",") : Array.isArray(value) ? value : [];
  if (parts.length !== 2 || parts.some((part) => typeof part !== "number" && (typeof part !== "string" || !part.trim()))) return;
  const [lat, lng] = parts.map(Number);
  if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
    return [lat, lng];
  }
}

//  Reusable scroll-reveal hook 
function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

//  Scroll progress hook 
function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const passed = vh - rect.top;
      setProgress(Math.max(0, Math.min(1, passed / total)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { ref, progress };
}

//  Page-wide scroll progress bar 
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(1, window.scrollY / h) : 0);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-100 h-0.75 bg-transparent pointer-events-none">
      <div
        className="h-full origin-left bg-linear-to-r from-[#76B947] via-[#F0C674] to-[#1D3D6D] shadow-[0_0_12px_rgba(213,165,77,0.6)]"
        style={{ transform: `scaleX(${progress})`, transition: "transform 0.08s linear" }}
      />
    </div>
  );
}

export default function HotelMapping() {
  const heroReveal = useInView<HTMLDivElement>();
  const mapReveal = useInView<HTMLDivElement>();
  const detailsReveal = useInView<HTMLDivElement>();
  const ctaReveal = useInView<HTMLDivElement>();

  const heroScroll = useScrollProgress<HTMLElement>();
  const mapScroll = useScrollProgress<HTMLElement>();
  const [saved, setSaved] = useState<HotelContent | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [selectedVenue, setSelectedVenue] = useState<number | null>(null);
  const [unavailableAction, setUnavailableAction] = useState<"download" | "contact" | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadContent() {
      try {
        const response = await apiFetch("/api/content/hotel-mapping", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error();
        const content: HotelContent = await response.json();
        if (!controller.signal.aborted) setSaved(content);
      } catch {
        if (!controller.signal.aborted) setError("Hotel and venue information could not be loaded.");
      }
    }
    void loadContent();
    return () => controller.abort();
  }, [attempt]);

  function field(key: string) {
    const [section, name] = key.split(".");
    const legacySection = sectionLabels.get(key);
    return itemText(saved?.content?.[section]?.[name]
      ?? (legacySection ? saved?.content?.[legacySection]?.[name] : undefined));
  }

  const center = coordinates([field("map.center_lat"), field("map.center_lng")]);
  const zoomValue = field("map.zoom");
  const zoom = zoomValue ? Number(zoomValue) : NaN;
  const hasMap = Boolean(center && Number.isInteger(zoom) && zoom >= 0 && zoom <= 19);
  const mapUrl = hotelActionUrl(field("download.file_url"));
  const hasDownload = field("download.title") || field("download.description") || field("download.button_text") || mapUrl;
  const contactUrl = hotelActionUrl(field("bottom_cta.button_link"));
  const venues = useMemo(() => contentList(saved, "venues_items").map((item, index) => ({
    id: index,
    name: itemText(item.name),
    description: itemText(item.desc),
    location: itemText(item.loc),
    markerLabel: itemText(item.num).match(/^\d{1,3}$/)?.[0],
    pos: coordinates(item.pos),
    color: itemText(item.color).match(/^(?:bg-\[)?(#[0-9a-f]{6})(?:\])?$/i)?.[1],
    Icon: venueIcons.get(itemText(item.icon))?.Icon ?? FaMapMarkerAlt,
  })).filter(({ name }) => name), [saved]);
  const markers = useMemo(() => venues.flatMap(({ id, name, pos, color, markerLabel }) =>
    pos ? [{ id, name, pos, color, markerLabel }] : []
  ), [venues]);
  const travel = contentList(saved, "travel_items").filter((item) => itemText(item.title) || itemText(item.description));
  const hasNote = field("note.title") || field("note.text");
  const hasContact = field("bottom_cta.title") || field("bottom_cta.description") || field("bottom_cta.button_text") || contactUrl;

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-[#F8FBF5] to-white font-sans text-[#0B2A4A] flex flex-col overflow-x-hidden">
      <ScrollProgressBar />

      <style jsx global>{`
        @keyframes shimmerLine {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideInLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideInRight {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }

        .reveal-up { opacity: 0; transform: translateY(28px); }
        .reveal-left { opacity: 0; transform: translateX(-24px); }
        .reveal-right { opacity: 0; transform: translateX(24px); }
        .reveal-scale { opacity: 0; transform: scale(0.94); }

        .in-view .reveal-up { animation: fadeSlideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .in-view .reveal-left { animation: fadeSlideInLeft 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .in-view .reveal-right { animation: fadeSlideInRight 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .in-view .reveal-scale { animation: scaleIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        .reveal-up.in-view { animation: fadeSlideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .reveal-left.in-view { animation: fadeSlideInLeft 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .reveal-right.in-view { animation: fadeSlideInRight 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .reveal-scale.in-view { animation: scaleIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        .stagger-1 { animation-delay: 0.10s; }
        .stagger-2 { animation-delay: 0.22s; }
        .stagger-3 { animation-delay: 0.34s; }
        .stagger-4 { animation-delay: 0.46s; }
        .stagger-5 { animation-delay: 0.58s; }
        .stagger-6 { animation-delay: 0.70s; }

        .gold-underline {
          background-image: linear-gradient(90deg, #76B947, #F0C674, #D5A54D);
          background-size: 200% 100%;
          animation: shimmerLine 4s linear infinite;
        }

        /*  Premium card  */
        .premium-card {
          position: relative;
          isolation: isolate;
          background: linear-gradient(180deg, #ffffff 0%, #fbfcfe 100%);
          transition:
            transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.55s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.4s ease;
          box-shadow:
            0 1px 2px rgba(11, 42, 74, 0.04),
            0 8px 20px -12px rgba(11, 42, 74, 0.10);
        }
        .premium-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, rgba(118,185,71,0) 0%, rgba(118,185,71,0) 50%, rgba(118,185,71,0) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          transition: background 0.55s ease;
          pointer-events: none;
          z-index: 2;
        }
        .premium-card::after {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          background: radial-gradient(120% 80% at 50% 0%, rgba(76,195,247,0.16) 0%, rgba(76,195,247,0) 60%);
          opacity: 0;
          transition: opacity 0.55s ease;
          pointer-events: none;
          z-index: -1;
        }
        .premium-card:hover {
          transform: translateY(-10px);
          border-color: rgba(118, 185, 71, 0.35);
          box-shadow:
            0 2px 4px rgba(11, 42, 74, 0.05),
            0 12px 24px -10px rgba(11, 42, 74, 0.16),
            0 32px 60px -20px rgba(11, 42, 74, 0.22),
            0 0 0 1px rgba(118, 185, 71, 0.05);
        }
        .premium-card:hover::before {
          background: linear-gradient(135deg, rgba(118,185,71,0.9) 0%, rgba(213,165,77,0.5) 50%, rgba(76,195,247,0.9) 100%);
        }
        .premium-card:hover::after { opacity: 1; }

        .premium-icon {
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease;
        }
        .premium-card:hover .premium-icon {
          transform: scale(1.08) rotate(-6deg);
          box-shadow: 0 0 0 6px rgba(76,195,247,0.12), 0 8px 20px -8px rgba(76,195,247,0.45);
        }

        /*  Venue row hover  */
        .venue-row {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.35s ease, box-shadow 0.4s ease;
        }
        .venue-row:hover {
          transform: translateX(6px);
          border-color: rgba(118, 185, 71, 0.4);
          box-shadow:
            0 4px 12px -4px rgba(11, 42, 74, 0.08),
            0 16px 32px -12px rgba(11, 42, 74, 0.14);
        }
        .venue-row:hover .venue-num {
          transform: scale(1.12) rotate(-8deg);
        }
        .venue-row .venue-num {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .venue-row:hover .venue-chevron {
          transform: translateX(4px);
          color: #76B947;
        }
        .venue-row .venue-chevron {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), color 0.35s ease;
        }

        /*  Travel info row hover  */
        .travel-item {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .travel-item:hover {
          transform: translateX(6px);
        }
        .travel-item .travel-icon {
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.5s ease,
                      background-color 0.5s ease,
                      color 0.4s ease;
        }
        .travel-item:hover .travel-icon {
          transform: scale(1.1) rotate(-6deg);
          background-color: #E9F5E1;
          color: #1b5e20;
          box-shadow: 0 0 0 6px rgba(118,185,71,0.14);
        }

        /*  Venue list item hover  */
        .venue-list-item {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.35s ease;
          border-radius: 8px;
          padding: 4px;
          margin: -4px;
        }
        .venue-list-item:hover {
          transform: translateX(4px);
          background-color: rgba(118, 185, 71, 0.08);
        }
        .venue-list-item:hover .venue-list-num {
          transform: scale(1.1);
          box-shadow: 0 0 0 6px rgba(118,185,71,0.14), 0 6px 16px -6px var(--glow);
        }
        .venue-list-num {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease;
        }

        .premium-btn {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }
        .premium-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: -1;
        }
        .premium-btn:hover::after { transform: translateX(100%); }

        .scroll-lift {
          will-change: transform;
          transform: translate3d(0, var(--scroll-y, 0px), 0);
          transition: transform 0.15s linear;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
          .scroll-lift { transform: none !important; }
        }
      `}</style>

      <Header />

      {/* == PAGE HERO == */}
      <section
        ref={heroScroll.ref}
        className={`relative bg-white overflow-hidden border-b border-zinc-100 ${heroReveal.inView ? "in-view" : ""}`}
      >
        {/* Decorative orbs — green + sky blue */}
        <div
          aria-hidden
          className="absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-[#76B947]/10 to-transparent rounded-full blur-3xl -translate-y-1/3 -translate-x-1/4 pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-0 left-1/3 w-72 h-72 bg-linear-to-tr from-[#4FC3F7]/10 to-transparent rounded-full blur-3xl translate-y-1/4 pointer-events-none"
        />

        {/* Floating image — subtle scroll parallax */}
        <div
          className="hidden md:block absolute top-1/2 right-8 w-[45%] pointer-events-none z-10"
          style={{ transform: `translateY(calc(-50% + ${(heroScroll.progress - 0.5) * -30}px))` }}
        >
          <Image
            src="https://res.cloudinary.com/xbloqjom/image/upload/v1794209289/event_image.png"
            alt="Hotel & Mapping Illustration"
            width={2200}
            height={500}
            className="w-full h-auto object-contain opacity-60"
            priority
          />
        </div>

        <div
          ref={heroReveal.ref} className="max-w-350 mx-auto px-8 py-16 relative z-20">

          <div className="max-w-xl">
            <h1 className="text-5xl font-bold text-[#0B2A4A] mb-4 reveal-up stagger-1">
              {field("hero.title") || "Hotel & Mapping"}
            </h1>
            <div className="w-16 h-1 gold-underline mb-6 reveal-up stagger-2 rounded-full"></div>
            {field("hero.description") && (
              <p className="text-lg leading-relaxed text-zinc-600 reveal-up stagger-3">{field("hero.description")}</p>
            )}
          </div>
        </div>
      </section>

      {!saved && (
        <div className="mx-auto w-full max-w-350 px-8 py-12 text-sm text-zinc-600">
          {error ? (
            <div role="alert" className="flex flex-wrap items-center gap-3">
              <p>{error}</p>
              <button type="button" className="font-semibold underline" onClick={() => { setError(""); setAttempt((value) => value + 1); }}>Try again</button>
            </div>
          ) : <LoadingIndicator label="Loading venue information…" />}
        </div>
      )}

      {/* == MAP & VENUE LIST == */}
      <section ref={mapScroll.ref} className={`py-16 relative overflow-hidden ${saved ? "" : "hidden"}`}>
        {/* Ambient palette glows */}
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[70%] rounded-full bg-[#4FC3F7]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#76B947]/10 blur-3xl" />
        <div
          ref={mapReveal.ref}
          className={`relative max-w-350 mx-auto px-8 ${mapReveal.inView ? "in-view" : ""}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Map & Note */}
            <div className="lg:col-span-2 space-y-8">
              <div className="premium-card reveal-up bg-white rounded-xl border border-zinc-100 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="premium-icon w-12 h-12 rounded-full bg-[#F2F9FF] flex items-center justify-center ring-1 ring-[#4FC3F7]/30">
                    <FaMapMarkerAlt className="text-[#1D3D6D] text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0B2A4A] uppercase">
                      {field("map.title") || "Venue map"}
                    </h2>
                    <p className="text-sm text-zinc-500">
                      {field("map.description")}
                    </p>
                  </div>
                </div>

                <div className="h-125 rounded-xl overflow-hidden shadow-inner border border-zinc-200 relative z-0">
                  {hasMap && center ? (
                    <VenueMap
                      key={`${center.join(",")}-${zoom}`}
                      venues={markers}
                      center={center}
                      zoom={zoom}
                      selectedVenue={selectedVenue}
                      onSelect={setSelectedVenue}
                    />
                  ) : (
                    <p className="grid h-full place-items-center bg-[#F2F9FF] p-6 text-center text-sm text-zinc-500">
                      The venue map has not been published.
                    </p>
                  )}
                </div>
              </div>

              {hasNote && (
                <div className="premium-card reveal-up stagger-1 bg-[#F2F9FF] border border-[#4FC3F7]/30 rounded-xl p-6 flex gap-4 items-start">
                  <FaInfoCircle aria-hidden="true" className="text-[#1D3D6D] text-xl mt-1 shrink-0" />
                  <div>
                    {field("note.title") && <p className="font-bold text-[#0B2A4A] mb-1">{field("note.title")}</p>}
                    {field("note.text") && <p className="text-sm text-zinc-600 whitespace-pre-line">{field("note.text")}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Venue List */}
            <div className="space-y-8">
              <div className="premium-card reveal-right bg-white rounded-xl border border-zinc-100 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="premium-icon w-12 h-12 rounded-full bg-[#F2F9FF] flex items-center justify-center ring-1 ring-[#4FC3F7]/30">
                    <FaBuilding className="text-[#1D3D6D] text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0B2A4A] uppercase">
                      {field("venues.title") || "Venue List"}
                    </h2>
                    <p className="text-sm text-zinc-500">
                      {field("venues.description")}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {venues.length === 0 && <p className="text-sm text-zinc-500">No venues have been published.</p>}
                  {venues.map((venue, idx) => (
                    <div key={venue.id} className={`venue-list-item flex items-start gap-4 reveal-up stagger-${(idx % 6) + 1}`}>
                      <span
                        className="venue-list-num mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1D3D6D] text-sm font-bold text-white"
                        style={venue.color ? { backgroundColor: venue.color } : undefined}
                      >
                        {venue.markerLabel ?? <venue.Icon aria-hidden="true" />}
                      </span>
                      <div className="min-w-0">
                        {hasMap && venue.pos ? (
                          <button type="button" aria-pressed={selectedVenue === venue.id} onClick={() => setSelectedVenue(venue.id)}
                            className="mb-1 text-left text-sm font-bold text-[#0B2A4A] hover:underline focus-visible:outline-2">
                            {venue.name}
                          </button>
                        ) : <p className="mb-1 text-sm font-bold text-[#0B2A4A]">{venue.name}</p>}
                        {venue.description && <p className="mb-2 text-xs text-zinc-500">{venue.description}</p>}
                        {venue.location && <p className="flex items-center gap-1.5 text-xs text-zinc-600"><FaMapMarkerAlt aria-hidden="true" className="text-[#76B947]" /> {venue.location}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* == VENUE DETAILS & TRAVEL INFORMATION == */}
      <section ref={detailsReveal.ref} className={`bg-white py-16 border-t border-zinc-100 relative overflow-hidden ${saved && (venues.length || travel.length || hasDownload) ? "" : "hidden"} ${detailsReveal.inView ? "in-view" : ""}`}>
        <div aria-hidden className="pointer-events-none absolute top-0 left-0 h-56 w-56 rounded-full bg-[#F0C674]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[#4FC3F7]/10 blur-3xl" />
        <div className="relative max-w-350 mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Venue Details */}
          <div className="reveal-left">
            <div className="flex items-center gap-4 mb-8">
              <div className="premium-icon w-12 h-12 rounded-full bg-[#F2F9FF] flex items-center justify-center ring-1 ring-[#4FC3F7]/30">
                <FaBuilding className="text-[#1D3D6D] text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-[#0B2A4A] uppercase">
                {field("venues.details_title") || "Venue Details"}
              </h2>
            </div>

            <div className="space-y-4">
              {venues.map((venue, idx) => (
                <div
                  key={venue.id}
                  className={`venue-row bg-white border border-zinc-200 rounded-lg p-5 flex items-center justify-between reveal-up stagger-${(idx % 6) + 1}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="venue-num flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1D3D6D] text-base font-bold text-white"
                      style={venue.color ? { backgroundColor: venue.color } : undefined}
                    >
                      {venue.markerLabel ?? <venue.Icon aria-hidden="true" />}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#1D3D6D] text-lg"><venue.Icon aria-hidden="true" /></span>
                      <div>
                        <p className="font-bold text-[#0B2A4A] text-sm">{venue.name}</p>
                        <p className="text-xs text-zinc-500">{venue.description}</p>
                      </div>
                    </div>
                  </div>
                  <FaChevronRight className="venue-chevron text-zinc-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Travel Information */}
          <div className="reveal-right">
            <div className="flex items-center gap-4 mb-8">
              <div className="premium-icon w-12 h-12 rounded-full bg-[#F2F9FF] flex items-center justify-center ring-1 ring-[#4FC3F7]/30">
                <FaCar className="text-[#1D3D6D] text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-[#0B2A4A] uppercase">
                {field("travel.title") || "Travel Information"}
              </h2>
            </div>

            <div className="space-y-6">
              {travel.map((item, index) => {
                const Icon = venueIcons.get(itemText(item.icon))?.Icon;
                return (
                  <div key={index} className={`travel-item flex gap-4 reveal-up stagger-${(index % 6) + 1}`}>
                    {Icon && (
                      <span className="travel-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2F9FF] text-lg text-[#1D3D6D]">
                        <Icon aria-hidden="true" />
                      </span>
                    )}
                    <div>
                      {itemText(item.title) && <p className="mb-1 text-sm font-bold text-[#0B2A4A]">{itemText(item.title)}</p>}
                      {itemText(item.description) && <p className="text-sm text-zinc-500">{itemText(item.description)}</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            {hasDownload && (
              <div className="reveal-up stagger-4 mt-10">
                <HotelActionCard
                  variant="download"
                  title={field("download.title")}
                  description={field("download.description")}
                  buttonText={field("download.button_text")}
                  link={field("download.file_url")}
                  onUnavailable={() => setUnavailableAction("download")}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* == BOTTOM CTA == */}
      <section ref={ctaReveal.ref} className={`bg-linear-to-b from-[#F8FBF5] to-white py-8 relative overflow-hidden ${saved && hasContact ? "" : "hidden"} ${ctaReveal.inView ? "in-view" : ""}`}>
        <div aria-hidden className="pointer-events-none absolute top-0 left-0 h-40 w-40 rounded-full bg-[#F0C674]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full bg-[#4FC3F7]/10 blur-3xl" />
        <div className="relative max-w-350 mx-auto px-8 reveal-up">
          <HotelActionCard
            variant="contact"
            title={field("bottom_cta.title")}
            description={field("bottom_cta.description")}
            buttonText={field("bottom_cta.button_text")}
            link={field("bottom_cta.button_link")}
            onUnavailable={() => setUnavailableAction("contact")}
          />
        </div>
      </section>

      <UnderDevelopment
        open={unavailableAction !== null}
        onClose={() => setUnavailableAction(null)}
        title={unavailableAction === "download" ? "Venue map download" : "Contact Secretariat"}
        description={unavailableAction === "download"
          ? "The venue map is not available to download yet."
          : "The contact link is not available yet."}
        notes={[]}
      />
      <Footer />
    </div>
  );
}
