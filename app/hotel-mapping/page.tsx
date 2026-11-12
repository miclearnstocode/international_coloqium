"use client";

import dynamic from "next/dynamic";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  FaMapMarkerAlt, FaBuilding, FaUsers, FaBed, FaUniversity, FaPlus, FaMinus, FaChevronRight,
  FaInfoCircle, FaCar, FaPlane, FaWalking, FaDownload, FaGlobeAsia,
} from "react-icons/fa";

const VenueMap = dynamic(() => import("./VenueMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#F2F9FF] flex items-center justify-center text-zinc-400 text-sm">
      Loading map…
    </div>
  ),
});

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

  //  APPROVED VENUE (Paradise Garden Resort, Boracay) 
  // Coordinates for Paradise Garden Resort Hotel & Convention Center,
  // Station 3, Manoc-Manoc, Boracay Island.
  const PRIMARY_VENUE = {
    name: "Paradise Garden Resort Hotel & Convention Center",
    shortName: "Paradise Garden Resort",
    address: "Manoc-Manoc, Boracay Island, Malay, Aklan, Philippines",
    coords: [11.9674, 121.9246] as [number, number],
  };

  // Individual on-site venues. All markers are clustered around the resort.
  const venues = [
    {
      id: 1,
      name: "Paradise Garden Resort — Main Convention Center",
      desc: "Plenary sessions, keynotes, and opening ceremonies",
      loc: "Paradise Garden Resort, Boracay Island",
      icon: <FaBuilding className="text-white" />,
      color: "bg-[#1D3D6D]",
      glow: "rgba(29, 61, 109, 0.4)",
      pos: [11.9674, 121.9246] as [number, number],
    },
    {
      id: 2,
      name: "Convention Hall A — Track 1 & 2",
      desc: "Parallel technical sessions (Agriculture & Life Sciences)",
      loc: "Paradise Garden Resort, Boracay Island",
      icon: <FaUsers className="text-white" />,
      color: "bg-[#4CAF50]",
      glow: "rgba(76, 175, 80, 0.4)",
      pos: [11.9679, 121.9250] as [number, number],
    },
    {
      id: 3,
      name: "Convention Hall B — Track 3 & 4",
      desc: "Parallel technical sessions (Bioresources & One Health)",
      loc: "Paradise Garden Resort, Boracay Island",
      icon: <FaBuilding className="text-white" />,
      color: "bg-[#F57C00]",
      glow: "rgba(245, 124, 0, 0.4)",
      pos: [11.9671, 121.9253] as [number, number],
    },
    {
      id: 4,
      name: "Poster & Exhibit Pavilion",
      desc: "Poster presentations, exhibits, and networking area",
      loc: "Paradise Garden Resort, Boracay Island",
      icon: <FaUniversity className="text-white" />,
      color: "bg-[#8E24AA]",
      glow: "rgba(142, 36, 170, 0.4)",
      pos: [11.9668, 121.9243] as [number, number],
    },
    {
      id: 5,
      name: "Resort Accommodation Wing",
      desc: "Official room block for invited guests and delegates",
      loc: "Paradise Garden Resort, Boracay Island",
      icon: <FaBed className="text-white" />,
      color: "bg-[#E53935]",
      glow: "rgba(229, 57, 53, 0.4)",
      pos: [11.9676, 121.9240] as [number, number],
    },
  ];

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
          ref={heroReveal.ref}
          className="max-w-350 mx-auto px-8 py-16 relative z-20"
        >
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8 reveal-up">
            <Link href="/" className="hover:text-[#76B947] transition-colors">
              Home
            </Link>
            <span className="text-zinc-300">›</span>
            <span className="text-[#0B2A4A] font-medium">Hotel &amp; Mapping</span>
          </div>

          <div className="max-w-xl">
            <h1 className="text-5xl font-bold text-[#0B2A4A] mb-4 reveal-up stagger-1">
              Hotel &amp; Mapping
            </h1>
            <div className="w-16 h-1 gold-underline mb-6 reveal-up stagger-2 rounded-full"></div>
            <p className="text-lg text-zinc-600 leading-relaxed reveal-up stagger-3">
              The 3rd International Agri-Life &amp; Bioresource Science Symposium
              will be held at the{" "}
              <span className="font-semibold text-[#0B2A4A]">
                {PRIMARY_VENUE.name}
              </span>{" "}
              in {PRIMARY_VENUE.address}. Find your way to all event venues
              using the map and travel information below.
            </p>
          </div>
        </div>
      </section>

      {/* == MAP & VENUE LIST == */}
      <section ref={mapScroll.ref} className="py-16 relative overflow-hidden">
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
                      Event Venue &amp; Map
                    </h2>
                    <p className="text-sm text-zinc-500">
                      Paradise Garden Resort Hotel &amp; Convention Center, Boracay Island.
                    </p>
                  </div>
                </div>

                <div className="h-125 rounded-xl overflow-hidden shadow-inner border border-zinc-200 relative z-0">
                  <VenueMap
                    venues={venues.map((v) => ({
                      id: v.id,
                      name: v.name,
                      pos: v.pos,
                    }))}
                    center={PRIMARY_VENUE.coords}
                    zoom={17}
                  />

                  <div className="absolute top-4 left-4 z-1000 flex flex-col shadow-md rounded-md overflow-hidden">
                    <button className="bg-white p-2 hover:bg-[#F8FBF5]">
                      <FaPlus size={12} />
                    </button>
                    <div className="h-px bg-zinc-200"></div>
                    <button className="bg-white p-2 hover:bg-[#F8FBF5]">
                      <FaMinus size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Important Note */}
              <div className="premium-card reveal-up stagger-1 bg-[#F2F9FF] border border-[#4FC3F7]/30 rounded-xl p-6 flex gap-4 items-start">
                <FaInfoCircle className="text-[#1D3D6D] text-xl mt-1 shrink-0" />
                <div>
                  <p className="font-bold text-[#0B2A4A] mb-1">Important Note</p>
                  <p className="text-sm text-zinc-600">
                    All event venues are located inside the{" "}
                    <span className="font-semibold text-[#0B2A4A]">
                      {PRIMARY_VENUE.shortName}
                    </span>{" "}
                    compound and are within walking distance of each other.
                    Shuttle services and boats from Caticlan Jetty Port will be
                    coordinated during the event.
                  </p>
                </div>
              </div>
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
                      Venue List
                    </h2>
                    <p className="text-sm text-zinc-500">
                      Click a venue to view details and highlight the location on the map.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {venues.map((venue, idx) => (
                    <div
                      key={venue.id}
                      className={`venue-list-item flex gap-4 items-start reveal-up stagger-${(idx % 6) + 1}`}
                      style={{ ["--glow" as any]: venue.glow }}
                    >
                      <div
                        className={`venue-list-num w-8 h-8 rounded-full ${venue.color} flex items-center justify-center text-sm font-bold text-white shrink-0 mt-1`}
                      >
                        {venue.id}
                      </div>
                      <div>
                        <p className="font-bold text-[#0B2A4A] text-sm mb-1">{venue.name}</p>
                        <p className="text-xs text-zinc-500 mb-2">{venue.desc}</p>
                        <p className="text-xs text-zinc-600 flex items-center gap-1.5">
                          <FaMapMarkerAlt className="text-[#76B947]" /> {venue.loc}
                        </p>
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
      <section ref={detailsReveal.ref} className={`bg-white py-16 border-t border-zinc-100 relative overflow-hidden ${detailsReveal.inView ? "in-view" : ""}`}>
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
                Venue Details
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
                      className={`venue-num w-10 h-10 rounded-full ${venue.color} flex items-center justify-center text-base font-bold text-white shrink-0`}
                    >
                      {venue.id}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#1D3D6D] text-lg">{venue.icon}</span>
                      <div>
                        <p className="font-bold text-[#0B2A4A] text-sm">{venue.name}</p>
                        <p className="text-xs text-zinc-500">{venue.desc}</p>
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
                Travel Information
              </h2>
            </div>

            <div className="space-y-6">
              {[
                { icon: <FaPlane />, title: "Via Caticlan (Boracay) Airport (MPH)", desc: "Fly into Godofredo P. Ramos Airport (Caticlan). Take a 5-minute tricycle ride to Caticlan Jetty Port, then a 10–15 minute boat ride to Cagban or Tambisaan Port in Boracay. From the port, it’s a short 10–15 minute ride to Paradise Garden Resort." },
                { icon: <FaPlane />, title: "Via Kalibo International Airport (KLO)", desc: "From Kalibo Airport, take a 1.5 – 2 hour van or bus ride to Caticlan Jetty Port, then a short boat ride to Boracay Island. Total travel time is roughly 2.5 – 3 hours." },
                { icon: <FaCar />, title: "From Iloilo City", desc: "Approximately 4 – 5 hours by land to Caticlan Jetty Port (via Roxas-Iloilo Road and Aklan West Road), followed by a boat transfer to Boracay Island." },
                { icon: <FaWalking />, title: "On the Island", desc: "Paradise Garden Resort is located in Station 3, Manoc-Manoc. E-trikes and shuttle services are available within the island. Follow symposium signage for event venues." },
              ].map((item, idx) => (
                <div key={idx} className={`travel-item flex gap-4 reveal-up stagger-${(idx % 6) + 1}`}>
                  <div className="travel-icon w-10 h-10 rounded-full bg-[#F2F9FF] text-[#1D3D6D] flex items-center justify-center text-lg shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-[#0B2A4A] text-sm mb-1">{item.title}</p>
                    <p className="text-sm text-zinc-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Download Box */}
            <div className="premium-card reveal-up stagger-4 mt-10 bg-[#F2F9FF] border border-[#4FC3F7]/30 rounded-xl p-6">
              <div className="flex gap-4">
                <FaDownload className="text-[#1D3D6D] text-xl mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-[#0B2A4A] text-sm mb-1">
                    Download Venue Map
                  </p>
                  <p className="text-sm text-zinc-500 mb-4">
                    Get the Paradise Garden Resort venue map in PDF format for offline use.
                  </p>
                  <button className="premium-btn bg-linear-to-r from-[#0A5C0A] to-[#0d6b0d] text-white px-6 py-2.5 rounded-md text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl flex items-center gap-2">
                    Download PDF <FaDownload />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* == BOTTOM CTA == */}
      <section ref={ctaReveal.ref} className={`bg-linear-to-b from-[#F8FBF5] to-white py-8 relative overflow-hidden ${ctaReveal.inView ? "in-view" : ""}`}>
        <div aria-hidden className="pointer-events-none absolute top-0 left-0 h-40 w-40 rounded-full bg-[#F0C674]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full bg-[#4FC3F7]/10 blur-3xl" />
        <div className="relative max-w-350 mx-auto px-8">
          <div className="premium-card reveal-up bg-white rounded-xl border border-zinc-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="premium-icon w-16 h-16 bg-[#F2F9FF] rounded-full flex items-center justify-center ring-1 ring-[#4FC3F7]/30">
                <FaMapMarkerAlt className="text-[#1D3D6D] text-3xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B2A4A] mb-1">Need Assistance?</h3>
                <p className="text-zinc-500">
                  Our secretariat is ready to help you with directions and other inquiries.
                </p>
              </div>
            </div>
            <button className="premium-btn bg-linear-to-r from-[#0A5C0A] to-[#0d6b0d] text-white px-8 py-4 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 shrink-0 hover:-translate-y-0.5 hover:shadow-xl">
              Contact Secretariat <FaChevronRight />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}