"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { ContentProvider, useContent } from "@/app/context/ContentContext";
import EditableField from "@/app/components/EditableField";
import EditableList from "@/app/components/EditableList";
import AdminToolbar from "@/app/components/AdminToolbar";

// ===== Reusable scroll-reveal hook =====
function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(el);
      }
    }, { threshold: 0.15, ...options });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

// ===== Scroll progress hook (0 → 1 as element passes through viewport) =====
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
      const p = Math.max(0, Math.min(1, passed / total));
      setProgress(p);
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

// ===== Page-wide scroll progress bar =====
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
        className="h-full origin-left bg-linear-to-r from-[#D5A54D] via-[#F0C674] to-[#1D3D6D] shadow-[0_0_12px_rgba(213,165,77,0.6)]"
        style={{ transform: `scaleX(${progress})`, transition: "transform 0.08s linear" }}
      />
    </div>
  );
}

// ===== Animated counter =====
function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    if (start === end) return;
    const duration = 500;
    const startTime = performance.now();

    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else prevRef.current = end;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span className={className}>{display.toString().padStart(2, "0")}</span>;
}

function HomeInner() {
  const { isEditMode } = useContent();

  const [timeLeft, setTimeLeft] = useState({
    days: 82,
    hours: 14,
    minutes: 36,
    seconds: 48,
  });

  const [countdownPulse, setCountdownPulse] = useState(false);

  // ===== Splash / docking state =====
  type Phase = "splash" | "docking" | "docked";
  const [phase, setPhase] = useState<Phase>("splash");
  const [showBackdrop, setShowBackdrop] = useState(true);
  const [delta, setDelta] = useState<{ x: number; y: number } | null>(null);

  const dockRef = useRef<HTMLDivElement | null>(null);

  // Countdown ticker
  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) { days = 0; hours = 0; minutes = 0; seconds = 0; }
        return { days, hours, minutes, seconds };
      });
      setCountdownPulse(true);
      setTimeout(() => setCountdownPulse(false), 350);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // ===== Measure delta between viewport center and dock position =====
  useEffect(() => {
    const measure = () => {
      const dock = dockRef.current;
      if (!dock) return false;

      const viewportCx = window.innerWidth / 2;
      const viewportCy = window.innerHeight / 2;

      const dockRect = dock.getBoundingClientRect();
      const dockCx = dockRect.left + dockRect.width / 2;
      const dockCy = dockRect.top + dockRect.height / 2;

      setDelta({
        x: viewportCx - dockCx,
        y: viewportCy - dockCy,
      });
      return true;
    };

    if (!measure()) {
      const raf = requestAnimationFrame(measure);
      return () => cancelAnimationFrame(raf);
    }
  }, []);

  // ===== Auto-dock after splash is shown =====
  useEffect(() => {
    if (phase !== "splash" || !delta) return;
    const t = setTimeout(() => {
      setPhase("docking");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase("docked");
          setShowBackdrop(false);
        });
      });
    }, 2600);
    return () => clearTimeout(t);
  }, [phase, delta]);

  const dismissSplash = () => {
    if (phase !== "splash") return;
    setPhase("docking");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPhase("docked");
        setShowBackdrop(false);
      });
    });
  };

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  // Reveal hooks
  const heroReveal = useInView<HTMLDivElement>();
  const countdownReveal = useInView<HTMLDivElement>();
  const contentReveal = useInView<HTMLDivElement>();

  // Scroll progress hooks (parallax)
  const heroScroll = useScrollProgress<HTMLElement>();
  const countdownScroll = useScrollProgress<HTMLElement>();
  const contentScroll = useScrollProgress<HTMLElement>();

  // ===== Fallback lists =====
  const fallbackAnnouncements = [
    {
      month: "OCT", day: "05",
      category: "CALL FOR ABSTRACTS",
      title: "Abstract Submission Opens",
      description: "The Call for Abstracts and symposium registration officially open on October 5, 2026.",
      link_text: "View Call for Abstracts",
      link_url: "/abstract-submission",
    },
    {
      month: "DEC", day: "18",
      category: "REGISTRATION",
      title: "Early Registration Deadline",
      description: "Participants may avail themselves of the applicable early registration rate until December 18, 2026.",
      link_text: "Registration Details",
      link_url: "/registration",
    },
    {
      month: "JAN", day: "10",
      category: "IMPORTANT",
      title: "Abstract Submission Deadline",
      description: "Authors must submit their abstracts through the official symposium portal on or before January 10, 2027.",
      link_text: "Submit Abstract",
      link_url: "/abstract-submission",
    },
  ];

  const fallbackAttendees = [
    { text: "Researchers & Scientists" },
    { text: "Faculty & Educators" },
    { text: "Graduate & Undergraduate Students" },
    { text: "Government & Research Institutions" },
    { text: "Industry & Development Partners" },
  ];

  // Parallax translations
  const heroParallax = (heroScroll.progress - 0.5) * -80;
  const videoParallax = (heroScroll.progress - 0.5) * -140;
  const orbParallax = (heroScroll.progress - 0.5) * 60;
  const ringParallax = (heroScroll.progress - 0.5) * 120;

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F6FA] font-sans text-[#0B2A4A] overflow-x-hidden">
      <ScrollProgressBar />

      {/* ===== Splash backdrop ===== */}
      <div
        aria-hidden
        onClick={dismissSplash}
        className={`fixed inset-0 z-95 bg-[#0B2A4A]/40 backdrop-blur-sm transition-opacity duration-500 ${
          showBackdrop ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <style jsx global>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(3deg); }
        }
        @keyframes floatSlower {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-3deg); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.06); }
        }
        @keyframes shimmerLine {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes gentleSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes tickPulse {
          0% { transform: scale(1); }
          35% { transform: scale(1.12); }
          100% { transform: scale(1); }
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
        @keyframes badgePop {
          0% { opacity: 0; transform: scale(0.85) translateY(8px); }
          60% { opacity: 1; transform: scale(1.04) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes splashIn {
          0% { opacity: 0; transform: scale(0.86) translateY(20px); }
          60% { opacity: 1; transform: scale(1.02) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .float-slow { animation: floatSlow 9s ease-in-out infinite; }
        .float-slower { animation: floatSlower 11s ease-in-out infinite; }
        .glow-pulse { animation: glowPulse 6s ease-in-out infinite; }

        /* ===== Reveal base state ===== */
        .reveal-up { opacity: 0; transform: translateY(28px); }
        .reveal-left { opacity: 0; transform: translateX(-24px); }
        .reveal-right { opacity: 0; transform: translateX(24px); }

        .in-view .reveal-up { animation: fadeSlideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .in-view .reveal-left { animation: fadeSlideInLeft 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .in-view .reveal-right { animation: fadeSlideInRight 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        .reveal-up.in-view { animation: fadeSlideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .reveal-left.in-view { animation: fadeSlideInLeft 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .reveal-right.in-view { animation: fadeSlideInRight 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        .badge-pop { animation: badgePop 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .splash-in { animation: splashIn 700ms cubic-bezier(0.22, 1, 0.36, 1) both; }

        .stagger-1 { animation-delay: 0.10s; }
        .stagger-2 { animation-delay: 0.22s; }
        .stagger-3 { animation-delay: 0.34s; }
        .stagger-4 { animation-delay: 0.46s; }
        .stagger-5 { animation-delay: 0.58s; }
        .stagger-6 { animation-delay: 0.70s; }

        .gold-underline {
          background-image: linear-gradient(90deg, #D5A54D, #F0C674, #D5A54D);
          background-size: 200% 100%;
          animation: shimmerLine 4s linear infinite;
        }
        .tick-pulse { animation: tickPulse 0.35s ease-out; }

        /* ===== Premium card — layered hover ===== */
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
          background: linear-gradient(135deg, rgba(213,165,77,0) 0%, rgba(213,165,77,0) 50%, rgba(213,165,77,0) 100%);
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
          background: radial-gradient(120% 80% at 50% 0%, rgba(213,165,77,0.18) 0%, rgba(213,165,77,0) 60%);
          opacity: 0;
          transition: opacity 0.55s ease;
          pointer-events: none;
          z-index: -1;
        }
        .premium-card:hover {
          transform: translateY(-10px);
          border-color: rgba(213, 165, 77, 0.35);
          box-shadow:
            0 2px 4px rgba(11, 42, 74, 0.05),
            0 12px 24px -10px rgba(11, 42, 74, 0.16),
            0 32px 60px -20px rgba(11, 42, 74, 0.22),
            0 0 0 1px rgba(213, 165, 77, 0.05);
        }
        .premium-card:hover::before {
          background: linear-gradient(135deg, rgba(213,165,77,0.9) 0%, rgba(29,61,109,0.35) 50%, rgba(213,165,77,0.9) 100%);
        }
        .premium-card:hover::after { opacity: 1; }

        .premium-icon {
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease, background-color 0.5s ease;
        }
        .premium-card:hover .premium-icon {
          transform: scale(1.08) rotate(-6deg);
          box-shadow: 0 0 0 6px rgba(213,165,77,0.10), 0 8px 20px -8px rgba(213,165,77,0.45);
        }
        .premium-card:hover .premium-icon svg {
          transform: scale(1.08);
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .premium-accent {
          position: relative;
          overflow: hidden;
          transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .premium-card:hover .premium-accent { width: 4rem; }

        .premium-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #0b2a4a;
          font-weight: 600;
          transition: color 0.3s ease, gap 0.3s ease;
        }
        .premium-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -3px;
          width: 100%;
          height: 1.5px;
          background: linear-gradient(90deg, #d5a54d, #f0c674);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .premium-link:hover { color: #1d3d6d; gap: 0.75rem; }
        .premium-link:hover::after { transform: scaleX(1); }
        .premium-link .arrow {
          display: inline-block;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .premium-link:hover .arrow { transform: translateX(4px); }

        .announcement-row {
          position: relative;
          border-radius: 8px;
          padding: 4px 6px;
          margin: -4px -6px;
          transition: background-color 0.35s ease, transform 0.35s ease;
        }
        .announcement-row:hover {
          background-color: rgba(213, 165, 77, 0.06);
          transform: translateX(4px);
        }
        .announcement-row .ann-date { transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
        .announcement-row:hover .ann-date { transform: scale(1.06); }
        .announcement-row .ann-category { transition: letter-spacing 0.4s ease; }
        .announcement-row:hover .ann-category { letter-spacing: 0.08em; }

        .attendee-item {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), color 0.3s ease;
        }
        .attendee-item:hover { transform: translateX(6px); color: #0b2a4a; }
        .attendee-item svg { transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), color 0.3s ease; }
        .attendee-item:hover svg { transform: scale(1.2) rotate(8deg); color: #b8892f; }

        .video-orb { filter: drop-shadow(0 0 60px rgba(29, 61, 109, 0.25)); }
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

      {/* ================= HERO ================= */}
      <main
        ref={heroScroll.ref}
        className="flex-1 relative overflow-hidden bg-linear-to-br from-[#E8EEF9] via-[#EAF1FA] to-[#DCE6F5]"
      >
        <div
          className="absolute top-0 right-0 w-150 h-150 bg-[#E3EAF5] rounded-full opacity-60 -translate-y-1/2 translate-x-1/3 float-slow"
          style={{ transform: `translate(33%, -50%) translateY(${orbParallax}px)` }}
        />
        <div
          className="absolute bottom-0 left-0 w-100 h-100 bg-[#E3EAF5] rounded-full opacity-40 translate-y-1/2 -translate-x-1/4 float-slower"
          style={{ transform: `translate(-25%, 50%) translateY(${-orbParallax}px)` }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 55% at 75% 40%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%)",
          }}
        />
        <div
          aria-hidden
          className="hidden lg:block absolute -right-40 top-1/2 w-130 h-130 rounded-full border border-[#D5A54D]/25"
          style={{
            animation: "gentleSpin 40s linear infinite",
            transform: `translateY(calc(-50% + ${ringParallax}px))`,
          }}
        >
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#D5A54D]" />
          <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#1D3D6D]" />
        </div>

        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="video-orb absolute -right-57.5 top-1/2 w-400 h-400 opacity-40 lg:opacity-70 pointer-events-none z-0 object-contain"
          style={{ transform: `translateY(calc(-50% + ${videoParallax}px))` }}
        >
          <source src="/videos/global.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 mx-auto max-w-350 px-8 py-12 lg:py-16 min-h-150">
          <div className="relative">
            <div
              ref={heroReveal.ref}
              className={`max-w-2xl ${heroReveal.inView ? "in-view" : ""}`}
              style={{ transform: `translateY(${heroParallax * 0.15}px)` }}
            >
              <span className="reveal-up inline-block">
                <EditableField
                  section="hero"
                  field="welcome_badge"
                  fallback="Welcome to"
                  as="span"
                  className="inline-block bg-linear-to-r from-[#E3D5C0] to-[#EFE3CF] text-[#8B6F47] text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-sm mb-6 shadow-sm ring-1 ring-[#D5A54D]/30"
                />
              </span>

              <div className="reveal-up stagger-1">
                <EditableField
                  section="hero"
                  field="title"
                  fallback="3rd International Agri- Life & Bioresource Science Symposium"
                  as="h1"
                  className="text-5xl lg:text-6xl font-bold leading-tight mb-6 text-[#0B2A4A]"
                  multiline
                />
              </div>

              <div className="reveal-up stagger-2">
                <EditableField
                  section="hero"
                  field="subtitle"
                  fallback="Converging Frontiers in Agri-Life and Bioresource Sciences"
                  as="p"
                  className="text-[#D5A54D] text-xl lg:text-2xl font-semibold mb-3"
                  multiline
                />
              </div>

              <div className="reveal-up stagger-3">
                <EditableField
                  section="hero"
                  field="description"
                  fallback="Science, Innovation & Collaboration for a Resilient and Sustainable Future"
                  as="p"
                  className="text-gray-800 text-base lg:text-lg mb-8 max-w-md leading-relaxed"
                  multiline
                />
              </div>

              <div className="reveal-up stagger-4 flex items-center gap-3 mb-3">
                <FaCalendarAlt className="text-[#D5A54D] text-xl" />
                <EditableField
                  section="hero"
                  field="event_date"
                  fallback="March 11-13, 2027"
                  as="p"
                  className="text-gray-800 text-xl lg:text-2xl font-semibold"
                />
              </div>

              <div className="reveal-up stagger-5 flex items-center gap-3 mb-8">
                <FaMapMarkerAlt className="text-[#D5A54D] text-xl" />
                <EditableField
                  section="hero"
                  field="event_location"
                  fallback="Roxas City, Capiz, Philippines"
                  as="p"
                  className="text-gray-800 text-xl lg:text-2xl font-semibold"
                />
              </div>

              <div className="reveal-up stagger-6">
                <Link
                  href="/about"
                  className="premium-btn inline-flex items-center gap-2 bg-linear-to-r from-[#1D3D6D] to-[#16305a] text-white px-6 py-3 rounded-md font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  <EditableField
                    section="hero"
                    field="cta_text"
                    fallback="Learn More"
                    as="span"
                  />
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ===== The floating / docking card ===== */}
        <div
          className="hidden md:block absolute top-40 right-0 lg:right-32 xl:right-64 z-96"
          style={{
            transform:
              phase === "splash" && delta
                ? `translate(${delta.x}px, ${delta.y}px)`
                : `translateY(${heroParallax * 0.4}px)`,
            transition:
              phase === "docking"
                ? "transform 3000ms cubic-bezier(0.22, 1, 0.36, 1)"
                : "none",
            willChange: "transform",
          }}
        >
          <div
            ref={dockRef}
            className={`premium-card bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 w-105 border border-gray-100 relative ${
              phase === "splash" ? "splash-in" : ""
            }`}
          >
            <button
              aria-label="Dismiss"
              onClick={dismissSplash}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#1D3D6D] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <div className="flex justify-center mb-5 relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#D5A54D" className="w-14 h-14 glow-pulse">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
              </svg>
              <div className="absolute -left-6 top-2 text-[#D5A54D] text-xs float-slow">✦</div>
              <div className="absolute -right-4 top-4 text-[#1D3D6D] text-xs float-slower">✦</div>
              <div className="absolute left-2 bottom-0 text-[#1D3D6D] text-[8px]">✦</div>
              <div className="absolute right-0 bottom-2 text-[#D5A54D] text-[8px]">✦</div>
            </div>

            <EditableField
              section="announcement_card"
              field="title"
              fallback="3rd International Agri-Life & Bioresource Science Symposium"
              as="h2"
              className="text-center text-xl font-bold mb-2 text-[#D5A54D]"
              multiline
            />

            <EditableField
              section="announcement_card"
              field="description"
              fallback="Join researchers, scientists, educators, students, industry partners, and institutional leaders from the Philippines and around the world for three days of scientific exchange, interdisciplinary dialogue, and international collaboration."
              as="p"
              className="text-center text-gray-800 text-xs mb-6 leading-relaxed"
              multiline
            />

            <div className="flex justify-center">
              <a
                href="/program"
                className="premium-btn bg-linear-to-r from-[#1D3D6D] to-[#16305a] text-white px-6 py-2.5 rounded-md font-semibold text-sm shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                <EditableField
                  section="announcement_card"
                  field="button_text"
                  fallback="View Event Details"
                  as="span"
                />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* ================= COUNTDOWN ================= */}
      <section
        ref={countdownScroll.ref}
        className="relative bg-white py-16 border-b border-gray-200 overflow-hidden"
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            background:
              "radial-gradient(50% 60% at 50% 0%, rgba(213,165,77,0.08) 0%, rgba(255,255,255,0) 70%)",
          }}
        />
        <div ref={countdownReveal.ref} className={`relative mx-auto max-w-7xl px-6 ${countdownReveal.inView ? "in-view" : ""}`}>
          <div className="text-center mb-12 reveal-up">
            <EditableField
              section="countdown"
              field="title"
              fallback="SYMPOSIUM COUNTDOWN"
              as="h2"
              className="text-3xl font-bold text-[#0B2A4A] mb-2"
            />
            <div className="w-24 h-1 gold-underline mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { key: "days" as const, label: "Days", offset: 24, iconPath: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
              { key: "hours" as const, label: "Hours", offset: 18, iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { key: "minutes" as const, label: "Minutes", offset: 12, iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { key: "seconds" as const, label: "Seconds", offset: 6, iconPath: "M12 6v6l4 2m-4-8a9 9 0 100 18 9 9 0 000-18z" },
            ].map((c, i) => (
              <div
                key={c.key}
                className={`reveal-up stagger-${i + 1} premium-card scroll-lift bg-linear-to-b from-[#F5F6FA] to-white rounded-xl p-8 flex flex-col items-center justify-center shadow-sm border border-gray-100`}
                style={{ ["--scroll-y" as any]: `${(1 - countdownScroll.progress) * c.offset}px` }}
              >
                <svg className="w-10 h-10 text-[#1D3D6D] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={c.iconPath} />
                </svg>
                {c.key === "seconds" ? (
                  <span className={`text-5xl font-bold text-[#0B2A4A] tabular-nums inline-block ${countdownPulse ? "tick-pulse" : ""}`}>
                    {formatNumber(timeLeft.seconds)}
                  </span>
                ) : (
                  <AnimatedNumber value={timeLeft[c.key]} className="text-5xl font-bold text-[#0B2A4A] tabular-nums" />
                )}
                <span className="text-sm font-semibold text-gray-500 mt-2 uppercase tracking-wider">{c.label}</span>
              </div>
            ))}
          </div>

          <p className="reveal-up stagger-5 text-center font-semibold text-gray-700">
            <EditableField section="countdown" field="event_date" fallback="March 11-13, 2027" as="span" />
            <span className="mx-2 text-gray-300">|</span>
            <EditableField section="countdown" field="event_location" fallback="Roxas City, Capiz Philippines" as="span" />
          </p>
        </div>
      </section>

      {/* ================= THREE COLUMN CONTENT ================= */}
      <section
        ref={contentScroll.ref}
        className="relative bg-white py-16 overflow-hidden"
      >
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#D5A54D]/40 to-transparent"
        />
        <div
          ref={contentReveal.ref}
          className={`relative mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 ${
            contentReveal.inView ? "in-view" : ""
          }`}
        >
          {/* Card 1: About */}
          <div
            className="reveal-up stagger-1 premium-card scroll-lift bg-linear-to-b from-[#F5F6FA] to-white p-8 rounded-lg border border-gray-100"
            style={{ ["--scroll-y" as any]: `${(1 - contentScroll.progress) * 30}px` }}
          >
            <div className="premium-icon w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm ring-1 ring-[#D5A54D]/20">
              <svg className="w-8 h-8 text-[#1D3D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            </div>
            <EditableField section="about_card" field="title" fallback="ABOUT THE SYMPOSIUM" as="h3" className="text-xl font-bold text-[#0B2A4A] mb-4" />
            <div className="premium-accent w-10 h-1 bg-[#D5A54D] mb-6 rounded-full"></div>
            <EditableField section="about_card" field="paragraph1" fallback="The 3rd International Agri-Life & Bioresource Sciences Symposium brings together researchers, faculty members, students, scientists, government representatives, industry partners, and other stakeholders from the Philippines and abroad." as="p" className="text-gray-600 text-justify mb-6" multiline />
            <EditableField section="about_card" field="paragraph2" fallback="Through research presentations, scientific discussions, and collaborative activities, the symposium provides a platform for sharing knowledge and advancing innovative and sustainable solutions in agriculture, life sciences, and bioresource sciences." as="p" className="text-gray-600 text-justify mb-6" multiline />
            <a href="/about" className="premium-link">
              <EditableField section="about_card" field="link_text" fallback="Read More" as="span" />
              <span className="arrow" aria-hidden="true">→</span>
            </a>
          </div>

          {/* Card 2: Announcements */}
          <div
            className="reveal-up stagger-2 premium-card scroll-lift bg-white border border-gray-200 p-8 rounded-lg"
            style={{ ["--scroll-y" as any]: `${(1 - contentScroll.progress) * 20}px` }}
          >
            <EditableField section="announcements" field="title" fallback="ANNOUNCEMENTS" as="h3" className="text-xl font-bold text-[#0B2A4A] mb-4" />
            <div className="premium-accent w-10 h-1 bg-[#D5A54D] mb-6 rounded-full"></div>

            <EditableList
              section="announcements"
              fallback={fallbackAnnouncements}
              emptyItem={{
                month: "MMM", day: "00", category: "CATEGORY",
                title: "New announcement", description: "Description here",
                link_text: "Learn more", link_url: "/",
              }}
              renderItem={(item, index, editing, onUpdate) => (
                <div className={`announcement-row flex gap-4 ${index < 2 ? "border-b border-gray-200 pb-4 mb-4" : ""}`}>
                  <div className="ann-date flex flex-col items-center">
                    {editing ? (
                      <>
                        <input type="text" value={item.month || ""} onChange={(e) => onUpdate({ ...item, month: e.target.value })} className="w-14 text-center border rounded text-sm" />
                        <input type="text" value={item.day || ""} onChange={(e) => onUpdate({ ...item, day: e.target.value })} className="w-14 text-center border rounded text-lg font-bold mt-1" />
                      </>
                    ) : (
                      <>
                        <span className="text-xl font-bold text-[#1D3D6D]">{item.month}</span>
                        <span className="text-2xl font-bold text-[#0B2A4A]">{item.day}</span>
                      </>
                    )}
                  </div>
                  <div className="flex-1">
                    {editing ? (
                      <div className="space-y-1">
                        <input type="text" value={item.category || ""} onChange={(e) => onUpdate({ ...item, category: e.target.value })} placeholder="Category" className="w-full border rounded px-2 py-1 text-xs" />
                        <input type="text" value={item.title || ""} onChange={(e) => onUpdate({ ...item, title: e.target.value })} placeholder="Title" className="w-full border rounded px-2 py-1 text-sm font-semibold" />
                        <textarea value={item.description || ""} onChange={(e) => onUpdate({ ...item, description: e.target.value })} placeholder="Description" className="w-full border rounded px-2 py-1 text-xs" rows={2} />
                        <input type="text" value={item.link_text || ""} onChange={(e) => onUpdate({ ...item, link_text: e.target.value })} placeholder="Link text" className="w-full border rounded px-2 py-1 text-xs" />
                        <input type="text" value={item.link_url || ""} onChange={(e) => onUpdate({ ...item, link_url: e.target.value })} placeholder="Link URL" className="w-full border rounded px-2 py-1 text-xs" />
                      </div>
                    ) : (
                      <>
                        <p className="ann-category text-xs font-bold text-[#D5A54D] uppercase mb-1">{item.category}</p>
                        <p className="font-semibold text-[#0B2A4A] mb-1">{item.title}</p>
                        <p className="text-sm text-justify text-gray-500">{item.description}</p>
                        <a href={item.link_url} className="premium-link mt-3 text-sm">
                          {item.link_text}
                          <span className="arrow" aria-hidden="true">→</span>
                        </a>
                      </>
                    )}
                  </div>
                </div>
              )}
            />
          </div>

          {/* Card 3: WHO SHOULD ATTEND */}
          <div
            className="reveal-up stagger-3 premium-card scroll-lift bg-linear-to-b from-[#F5F6FA] to-white p-8 rounded-lg border border-gray-100"
            style={{ ["--scroll-y" as any]: `${(1 - contentScroll.progress) * 10}px` }}
          >
            <div className="premium-icon w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm ring-1 ring-[#D5A54D]/20">
              <svg className="w-8 h-8 text-[#1D3D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <EditableField section="attendees_card" field="title" fallback="WHO SHOULD ATTEND" as="h3" className="text-xl font-bold text-[#0B2A4A] mb-4" />
            <div className="premium-accent w-10 h-1 bg-[#D5A54D] mb-6 rounded-full"></div>
            <EditableField section="attendees_card" field="description" fallback="The symposium welcomes members of the academic, scientific, government, and industry communities who are interested in advancing research, innovation, and collaboration in agri-life and bioresource sciences." as="p" className="text-gray-600 text-justify mb-4" multiline />
            <ul className="space-y-2 mb-6">
              <EditableList
                section="attendees"
                fallback={fallbackAttendees}
                emptyItem={{ text: "New attendee type" }}
                renderItem={(item, index, editing, onUpdate) =>
                  editing ? (
                    <input type="text" value={item.text || ""} onChange={(e) => onUpdate({ ...item, text: e.target.value })} className="w-full border rounded px-2 py-1 text-sm" />
                  ) : (
                    <li className="attendee-item flex items-center gap-3 text-gray-700 text-sm">
                      <FaCheckCircle className="text-[#D5A54D] text-sm shrink-0" />
                      {item.text}
                    </li>
                  )
                }
              />
            </ul>
            <a href="/scientific-tracks" className="premium-link">
              <EditableField section="attendees_card" field="link_text" fallback="See Who Can Participate" as="span" />
              <span className="arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <AdminToolbar />
    </div>
  );
}

export default function Home() {
  return (
    <ContentProvider pageSlug="home">
      <HomeInner />
    </ContentProvider>
  );
}