"use client";

import { useState, useEffect, useRef, type RefObject } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { 
  FaCheckCircle, 
  FaFileAlt, 
  FaUser, 
  FaCalendarAlt, 
  FaMapMarkerAlt 
} from "react-icons/fa";
import { ContentProvider, useContent } from "@/app/context/ContentContext";
import EditableField from "@/app/components/EditableField";
import EditableList from "@/app/components/EditableList";

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

// ===== Scroll progress hook =====
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
        className="h-full origin-left bg-linear-to-r from-[#76B947] via-[#F0C674] to-[#1D3D6D] shadow-[0_0_12px_rgba(213,165,77,0.6)]"
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

// ===== Confetti (canvas, no dependencies) =====
function Confetti({ duration = 4500, onDone }: { duration?: number; onDone?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#F0C674", "#D5A54D", "#76B947", "#1A5E20", "#0B2A4A", "#4FC3F7", "#FFFFFF"];
    const W = window.innerWidth;
    const H = window.innerHeight;

    type P = {
      x: number; y: number; vx: number; vy: number;
      w: number; h: number; rot: number; vr: number;
      color: string; round: boolean; tilt: number; tiltSpeed: number;
    };

    const make = (x: number, y: number, angle: number, spread: number, power: number): P => {
      const a = angle + (Math.random() - 0.5) * spread;
      const v = power * (0.55 + Math.random() * 0.6);
      return {
        x, y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        w: 6 + Math.random() * 7,
        h: 4 + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        round: Math.random() < 0.25,
        tilt: Math.random() * Math.PI * 2,
        tiltSpeed: 0.1 + Math.random() * 0.2,
      };
    };

    const particles: P[] = [];
    for (let i = 0; i < 90; i++) particles.push(make(0, H, -Math.PI / 3, 0.9, 26));
    for (let i = 0; i < 90; i++) particles.push(make(W, H, (-2 * Math.PI) / 3, 0.9, 26));
    for (let i = 0; i < 70; i++) particles.push(make(W / 2, H * 0.45, -Math.PI / 2, Math.PI * 1.6, 15));

    const start = performance.now();
    let last = start;
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;
      const elapsed = now - start;
      const fade = elapsed > duration - 1200 ? Math.max(0, (duration - elapsed) / 1200) : 1;

      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + 0.38 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        p.tilt += p.tiltSpeed * dt;

        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, Math.cos(p.tilt));
        ctx.fillStyle = p.color;
        if (p.round) {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }

      if (elapsed < duration) raf = requestAnimationFrame(tick);
      else onDone?.();
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 z-110 pointer-events-none"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}

// ===== Call-for-abstract popup =====
const POPUP_AUTO_CLOSE_MS = 4000;

function AbstractPopup({
  targetRef,
  onDone,
}: {
  targetRef: RefObject<HTMLElement | null>;
  onDone: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const closingRef = useRef(false);
  const autoCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeRef = useRef<() => void>(() => {});

  const clearAuto = () => {
    if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
    autoCloseRef.current = null;
  };

  const instantClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    clearAuto();
    setOpen(false);
    onDone();
  };

  closeRef.current = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    clearAuto();

    const card = cardRef.current;
    const backdrop = backdropRef.current;
    const finish = () => {
      setOpen(false);
      onDone();
    };
    if (!card) return finish();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return finish();

    backdrop?.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 700,
      easing: "ease-out",
      fill: "forwards",
    });

    const r = card.getBoundingClientRect();
    const t = targetRef.current?.getBoundingClientRect();

    let anim: Animation;
    if (t && t.width > 0 && t.height > 0) {
      const scale = Math.min(t.width / r.width, t.height / r.height);
      const dx = t.left + (t.width - r.width * scale) / 2 - r.left;
      const dy = t.top + (t.height - r.height * scale) / 2 - r.top;
      card.style.transformOrigin = "top left";
      anim = card.animate(
        [
          { transform: "translate(0px, 0px) scale(1)" },
          { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
        ],
        { duration: 800, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" }
      );
    } else {
      anim = card.animate(
        [
          { opacity: 1, transform: "scale(1)" },
          { opacity: 0, transform: "scale(0.9)" },
        ],
        { duration: 300, easing: "ease-in", fill: "forwards" }
      );
    }
    anim.onfinish = finish;
  };

  useEffect(() => {
    const openTimer = setTimeout(() => {
      setOpen(true);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduceMotion) setConfetti(true);
      autoCloseRef.current = setTimeout(() => closeRef.current(), POPUP_AUTO_CLOSE_MS);
    }, 600);
    return () => {
      clearTimeout(openTimer);
      clearAuto();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <style>{`
        @keyframes popupBackdrop { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popupPop {
          0%   { opacity: 0; transform: scale(0.8) translateY(24px); }
          60%  { opacity: 1; transform: scale(1.04) translateY(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes popupWiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .popup-backdrop { animation: popupBackdrop 0.3s ease-out both; }
        .popup-card { animation: popupPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .popup-badge { animation: popupWiggle 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .popup-backdrop, .popup-card, .popup-badge { animation: none; }
        }
      `}</style>

      {confetti && <Confetti onDone={() => setConfetti(false)} />}

      {open && (
        <div
          ref={backdropRef}
          className="popup-backdrop fixed inset-0 z-100 flex items-center justify-center bg-[#0B2A4A]/50 backdrop-blur-sm p-4"
          onClick={() => closeRef.current()}
        >
          <div
            ref={cardRef}
            role="dialog"
            aria-modal="true"
            aria-label="Call for abstract"
            onClick={(e) => e.stopPropagation()}
            className="popup-card relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.35)] border border-white/60 px-8 pt-10 pb-8 flex flex-col items-center text-center"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-[#F0C674] via-[#D5A54D] to-[#76B947]" />

            <button
              type="button"
              onClick={() => closeRef.current()}
              aria-label="Close"
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-5 flex items-center justify-center gap-2">
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="absolute -top-3 -left-2 w-5 h-5 text-[#5c9a26] -rotate-30" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
                <svg className="absolute -top-2 right-0 w-4 h-4 text-[#5c9a26] rotate-20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
                <svg className="w-14 h-14 drop-shadow-sm" viewBox="0 0 24 24" fill="none">
                  <path d="M19 4L5 8V16L19 20V4Z" fill="#7cb342" stroke="#33691e" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M2 10V14" stroke="#33691e" strokeWidth="2" strokeLinecap="round" />
                  <path d="M10 16V22" stroke="#33691e" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              <div className="popup-badge bg-[#4b8e18] rounded-lg px-4 py-1.5 shadow-md border border-[#33691e]/30 flex flex-col items-center justify-center">
                <span className="text-white font-black text-xs tracking-widest leading-none mb-1">CALL FOR</span>
                <span className="text-white font-black text-xl tracking-wider leading-none">ABSTRACT</span>
              </div>

              <div className="flex flex-col gap-1.5 ml-1 shrink-0">
                <div className="w-4 h-0.5 bg-[#5c9a26] rotate-30 rounded-full" />
                <div className="w-3.5 h-0.5 bg-[#5c9a26] rotate-45 rounded-full" />
              </div>
            </div>

            <p className="text-[#0B2A4A] font-bold text-lg leading-tight mb-3">
              3rd International Agri-Life &amp;<br />Bioresource Science Symposium
            </p>
            <div className="w-3/5 h-0.5 bg-[#F0C674] mb-4" />

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Submit your research and share your scientific contributions with experts, educators, and industry leaders from the Philippines and around the world.
            </p>

            <Link
              href="/abstract-submission"
              onClick={() => instantClose()}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#0A5C0A] hover:bg-[#084a08] text-white text-sm font-bold shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              Submit Abstract →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

// ===== Fluid hero scale =====
const HERO_DESIGN_WIDTH = 1920;
const HERO_SCALE_MIN_VIEWPORT = 1024;

function useHeroScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = document.documentElement.clientWidth;
      if (w < HERO_SCALE_MIN_VIEWPORT) setScale(1);
      else setScale(Math.min(1, w / HERO_DESIGN_WIDTH));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return scale;
}

function HomeInner() {
  const { isEditMode, isSuperAdmin } = useContent();
  const canEdit = isEditMode && isSuperAdmin;

  const [timeLeft, setTimeLeft] = useState({
    days: 119,
    hours: 14,
    minutes: 35,
    seconds: 20,
  });

  const [countdownPulse, setCountdownPulse] = useState(false);

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

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  const heroReveal = useInView<HTMLDivElement>();
  const contentReveal = useInView<HTMLDivElement>();

  const heroScroll = useScrollProgress<HTMLElement>();
  const heroScale = useHeroScale();
  const heroCardRef = useRef<HTMLDivElement | null>(null);
  const [popupDone, setPopupDone] = useState(false);
  const contentScroll = useScrollProgress<HTMLElement>();

  const parallaxEnabled = !canEdit;
  const heroParallax = parallaxEnabled ? (heroScroll.progress - 0.5) * -20 : 0;

  const fallbackAnnouncements = [
    {
      month: "NOV", day: "16",
      category: "CALL FOR ABSTRACTS",
      title: "Abstract Submission Opens",
      description: "The Call for Abstracts and symposium registration officially open on November 16, 2026.",
      link_text: "View Call for Abstracts",
      link_url: "/abstract-submission",
    },
    {
      month: "JAN", day: "10",
      category: "REGISTRATION",
      title: "Early Registration Deadline",
      description: "Participants may avail themselves of the applicable early registration rate until January 10, 2027.",
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

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F6FA] font-sans text-[#0B2A4A] overflow-x-hidden">
      <ScrollProgressBar />
      <AbstractPopup targetRef={heroCardRef} onDone={() => setPopupDone(true)} />

      <style jsx global>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(3deg); }
        }
        @keyframes shimmerLine {
          0% { background-position: -200% 100%; }
          100% { background-position: 200% 100%; }
        }
        @keyframes tickPulse {
          0% { transform: scale(1); }
          35% { transform: scale(1.1); color: #F0C674; }
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

        .float-slow { animation: floatSlow 9s ease-in-out infinite; }

        .reveal-up { opacity: 0; transform: translateY(28px); }
        .reveal-left { opacity: 0; transform: translateX(-24px); }
        .reveal-right { opacity: 0; transform: translateX(24px); }

        .in-view .reveal-up { animation: fadeSlideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .in-view .reveal-left { animation: fadeSlideInLeft 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .in-view .reveal-right { animation: fadeSlideInRight 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        .reveal-up.in-view { animation: fadeSlideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .reveal-left.in-view { animation: fadeSlideInLeft 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .reveal-right.in-view { animation: fadeSlideInRight 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

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

        /* ===== Premium card ===== */
        .premium-card {
          position: relative;
          isolation: isolate;
          background: #ffffff;
          transition:
            transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.55s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.4s ease;
          box-shadow:
            0 4px 6px -1px rgba(11, 42, 74, 0.05),
            0 10px 15px -3px rgba(11, 42, 74, 0.05);
        }
        .premium-card:hover {
          transform: translateY(-5px);
          border-color: rgba(118, 185, 71, 0.35);
          box-shadow:
            0 10px 25px -5px rgba(11, 42, 74, 0.1),
            0 20px 40px -10px rgba(118, 185, 71, 0.18);
        }

        .premium-icon {
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease;
        }
        .premium-card:hover .premium-icon {
          transform: scale(1.08) rotate(-6deg);
          box-shadow: 0 0 0 6px rgba(76, 195, 247, 0.12), 0 8px 20px -8px rgba(76, 195, 247, 0.45);
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
          background: linear-gradient(90deg, #76B947, #F0C674);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .premium-link:hover { color: #1b5e20; gap: 0.75rem; }
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
          background-color: rgba(118, 185, 71, 0.08);
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
        .attendee-item:hover svg { transform: scale(1.2) rotate(8deg); color: #4FC3F7; }

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

      {/* ================= HERO & COUNTDOWN MERGED ================= */}
      <section
        ref={heroScroll.ref}
        className="relative pt-4 pb-12 lg:pt-8 lg:pb-16 overflow-hidden border-b border-gray-200 lg:min-h-187.5 flex flex-col justify-center"
        style={heroScale < 1 ? { zoom: heroScale } : undefined}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/xbloqjom/image/upload/v1794383950/background.jpg"
            alt="Symposium Background"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-white/30"></div>
        </div>

        <div className="absolute -top-8 left-10 lg:-top-12 lg:left-30 z-10 w-64 md:w-96 lg:w-125 pointer-events-none">
          <Image
            src="https://res.cloudinary.com/xbloqjom/image/upload/v1794390154/isda2.png"
            alt="Symposium Logo"
            width={1000}
            height={1000}
            className="w-full h-auto object-contain drop-shadow-xl"
            priority
          />
        </div>

        <div className="absolute top-8 left-70 md:left-100 lg:top-12 lg:left-135 z-10 flex flex-row items-center gap-4 lg:gap-6 pointer-events-none">
          
          <div className="leading-[1.05] shrink-0">
            <h1 className="text-2xl md:text-4xl lg:text-[2.75rem] font-black text-[#1A5E20] tracking-tight">
              INTERNATIONAL
            </h1>
            <h1 className="text-3xl md:text-5xl lg:text-[3.5rem] font-black text-[#0B1C2C] tracking-tighter drop-shadow-sm leading-[1.1] my-0.5">
              AGRI-LIFE &<br/>
              BIORESOURCE<br/>
              SCIENCE
            </h1>
            <h1 className="text-xl md:text-3xl lg:text-[2.25rem] font-bold text-[#76B947] tracking-[0.15em] mt-1">
              SYMPOSIUM
            </h1>
          </div>

          <div className="hidden md:block w-0.5 h-24 lg:h-32 bg-[#76B947]/40 shrink-0"></div>

          <div className="flex flex-col justify-center max-w-70 md:max-w-[320px] lg:max-w-95">
            <div className="bg-[#76B947] text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full w-max mb-2 tracking-wider">
              THEME:
            </div>
            <h2 className="text-[#0B1C2C] font-bold text-sm md:text-base lg:text-lg leading-tight mb-1">
              Converging Frontiers in Agri-Life and Bioresource Sciences:
            </h2>
            <p className="text-[#0B1C2C] text-[10px] md:text-xs lg:text-sm leading-snug">
              Science, Innovation, and Collaboration for a Resilient and Sustainable Future
            </p>
          </div>

        </div>

        {/* ===== FLOATING CALL FOR ABSTRACTS CARD ===== */}
        <div ref={heroCardRef} className={`hidden md:flex absolute top-10 right-10 lg:right-20 z-20 w-72 lg:w-85 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/60 p-5 flex-col items-center text-center overflow-hidden transition-opacity duration-300 ${popupDone ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#F0C674] via-[#D5A54D] to-[#76B947]"></div>

          <button className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mt-4 mb-4 flex items-center justify-center gap-1.5 w-full">
            
            <div className="relative flex items-center justify-center shrink-0">
               <svg className="absolute -top-2 -left-1 w-4 h-4 text-[#5c9a26] rotate-[-30deg]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
               </svg>
               <svg className="absolute -top-1 right-0 w-3 h-3 text-[#5c9a26] rotate-20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
               </svg>
               
               <svg className="w-10 h-10 drop-shadow-sm" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 4L5 8V16L19 20V4Z" fill="#7cb342" stroke="#33691e" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M2 10V14" stroke="#33691e" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M10 16V22" stroke="#33691e" strokeWidth="2" strokeLinecap="round"/>
               </svg>
            </div>

            <div className="bg-[#4b8e18] rounded-md px-3 py-1 shadow-sm border border-[#33691e]/30 flex flex-col items-center justify-center transform -rotate-2">
              <span className="text-white font-black text-[10px] tracking-widest leading-none mb-0.5">CALL FOR</span>
              <span className="text-white font-black text-sm tracking-wider leading-none">ABSTRACT</span>
            </div>

            <div className="flex flex-col gap-1 ml-0.5 shrink-0">
              <div className="w-3 h-0.5 bg-[#5c9a26] rotate-30 rounded-full"></div>
              <div className="w-2.5 h-0.5 bg-[#5c9a26] rotate-45 rounded-full"></div>
            </div>
            
          </div>

          <p className="text-[#0B2A4A] font-bold text-sm leading-tight mb-2">
            3rd International Agri-Life &<br/>Bioresource Science Symposium
          </p>

          <div className="w-3/5 h-0.5 bg-[#F0C674] mb-4"></div>

          <p className="text-gray-600 text-[11px] leading-relaxed mb-5 px-1">
            Submit your research and share your scientific contributions with experts, educators, and industry leaders from the Philippines and around the world.
          </p>

          <Link
            href="/abstract-submission"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-[#0A5C0A] hover:bg-[#084a08] text-white text-xs font-bold shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            Submit Abstract →
          </Link>

        </div>


        <div
          ref={heroReveal.ref}
          className={`relative z-10 mx-auto max-w-350 px-4 lg:px-8 ${
            heroReveal.inView ? "in-view" : ""
          }`}
          style={{ transform: `translateY(${heroParallax * 0.1}px)` }}
        >
          
          <div className="w-full h-24 md:h-40 mb-6"></div>

          <div className="relative top-35">
            
            <div className="reveal-up stagger-1 bg-white/95 backdrop-blur-md w-[96%] max-w-325 mx-auto rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] border border-white/50 -mt-16 relative z-20 py-4 px-6 md:px-8 flex flex-col xl:flex-row items-center justify-between gap-4 overflow-x-auto">
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full whitespace-nowrap">
                
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex items-center gap-1.5 text-[#1b5e20]">
                    <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-bold text-[#0A2540] leading-tight text-center">
                      Abstract Submission<br/>and Registration
                    </span>
                  </div>
                  <div className="bg-[#0A5C0A] text-white text-[12px] font-bold px-4 py-1 rounded-full tracking-wider shadow-sm">
                    NOVEMBER 16, 2026
                  </div>
                </div>

                <div className="hidden md:block w-px h-10 bg-[#76B947]/30 shrink-0"></div>

                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex items-center gap-1.5 text-[#1b5e20]">
                    <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-bold text-[#0A2540] leading-tight text-center">
                      Abstract Submission<br/>Deadline
                    </span>
                  </div>
                  <div className="bg-[#0A5C0A] text-white text-[12px] font-bold px-4 py-1 rounded-full tracking-wider shadow-sm">
                    JANUARY 20, 2027
                  </div>
                </div>

                <div className="hidden md:block w-px h-10 bg-[#76B947]/30 shrink-0"></div>

                <div className="flex items-center gap-2 text-[#1b5e20]">
                  <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold tracking-widest uppercase leading-none mb-0.5">March</span>
                    <span className="text-sm font-bold leading-none text-[#0A2540]">11–13, 2027</span>
                  </div>
                </div>

                <div className="hidden md:block w-px h-10 bg-[#76B947]/30 shrink-0"></div>

                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#1b5e20] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[14px] font-bold text-[#0A2540] leading-tight mb-0.5">
                      Paradise Garden Resort<br/>Hotel & Convention Center
                    </p>
                    <p className="text-[12px] text-gray-500 leading-tight">
                      Manoc-Manoc, Boracay Island,<br/>Malay, Aklan, Philippines
                    </p>
                  </div>
                </div>

                <div className="hidden xl:block w-px h-10 bg-[#76B947]/30 shrink-0"></div>

                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-bold text-[#0A2540] uppercase tracking-wider">CO-HOSTS:</p>
                  <div className="flex items-center gap-1">
                    <div className="relative w-15 h-15 rounded-full overflow-hidden border border-gray-200 bg-white">
                       <Image src="https://res.cloudinary.com/xbloqjom/image/upload/v1794368585/hiroshima-logo.webp" alt="Co-host 1" fill className="object-contain p-0.5" />
                    </div>
                    <div className="relative w-15 h-15 rounded-full overflow-hidden border border-gray-200 bg-white">
                       <Image src="https://res.cloudinary.com/xbloqjom/image/upload/v1794368684/vsu-logo.png" alt="Co-host 2" fill className="object-contain p-0.5" />
                    </div>
                    <div className="relative w-15 h-15 rounded-full overflow-hidden border border-gray-200 bg-white">
                       <Image src="https://res.cloudinary.com/xbloqjom/image/upload/v1794368844/usc-logo.svg" alt="Co-host 3" fill className="object-contain p-0.5" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. Action Buttons — tri-tone: green / navy / gold outline */}
            <div className="reveal-up stagger-2 flex flex-wrap items-center justify-center gap-4 mt-12">
              <Link
                href="/abstract-submission"
                className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white bg-[#0A5C0A] hover:bg-[#084a08] shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <FaFileAlt /> Submit Abstract →
              </Link>
              <Link
                href="/registration"
                className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white bg-[#0B2A4A] hover:bg-[#153A61] shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <FaUser /> Register Now →
              </Link>
              <Link
                href="/program"
                className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-[#0A2540] bg-white border-2 border-[#D5A54D] hover:bg-[#F0C674] shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <FaCalendarAlt /> View Program →
              </Link>
            </div>

            {/* 4. Integrated Countdown Bar — navy body, gold base, sky top */}
            <div className="reveal-up stagger-3 mt-16 w-[90%] max-w-250 mx-auto bg-[#0B2A4A]/95 backdrop-blur-sm rounded-full py-4 px-6 md:px-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-t-2 border-[#4FC3F7]/40 border-b-4">
              
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-[#4FC3F7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-white">
                  <p className="text-sm font-bold tracking-widest text-[#76B947]">SYMPOSIUM</p>
                  <p className="text-lg font-bold tracking-wider">COUNTDOWN</p>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-8 divide-x divide-white/20">
                {[
                  { key: "days" as const, label: "Days" },
                  { key: "hours" as const, label: "Hours" },
                  { key: "minutes" as const, label: "Minutes" },
                  { key: "seconds" as const, label: "Seconds" },
                ].map((c, i) => (
                  <div key={c.key} className={`flex flex-col items-center px-4 md:px-6 ${i === 0 ? 'pl-0' : ''}`}>
                    {c.key === "seconds" ? (
                      <span className={`text-3xl md:text-4xl font-bold text-[#F0C674] tabular-nums inline-block ${countdownPulse ? "tick-pulse" : ""}`}>
                        {formatNumber(timeLeft.seconds)}
                      </span>
                    ) : (
                      <AnimatedNumber value={timeLeft[c.key]} className="text-3xl md:text-4xl font-bold text-[#F0C674] tabular-nums" />
                    )}
                    <span className="text-[10px] md:text-xs font-semibold text-gray-300 mt-1 uppercase tracking-wider">{c.label}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= THREE COLUMN CONTENT ================= */}
      <section
        ref={contentScroll.ref}
        className="relative bg-linear-to-b from-white via-[#F8FBF5] to-white py-16 overflow-hidden"
      >
        {/* Ambient palette glows */}
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[70%] rounded-full bg-[#4FC3F7]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#76B947]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-10 left-0 h-48 w-48 rounded-full bg-[#F0C674]/10 blur-3xl" />

        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#D5A54D]/50 to-transparent"
        />
        <div
          ref={contentReveal.ref}
          className={`relative mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 ${
            contentReveal.inView ? "in-view" : ""
          }`}
        >
          {/* Card 1: About */}
          <div
            className="reveal-up stagger-1 premium-card scroll-lift bg-linear-to-b from-[#F7FBF3] to-white p-8 rounded-xl border border-gray-100"
            style={{ ["--scroll-y" as any]: `${parallaxEnabled ? (1 - contentScroll.progress) * 30 : 0}px` }}
          >
            <div className="premium-icon w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm ring-1 ring-[#76B947]/25">
              <svg className="w-8 h-8 text-[#1D3D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            </div>
            <EditableField section="about_card" field="title" fallback="ABOUT THE SYMPOSIUM" as="h3" label="Card Title" className="text-xl font-bold text-[#0B2A4A] mb-4 block" />
            <div className="premium-accent w-10 h-1 bg-[#D5A54D] mb-6 rounded-full"></div>
            <EditableField section="about_card" field="paragraph1" fallback="The 3rd International Agri-Life & Bioresource Sciences Symposium brings together researchers, faculty members, students, scientists, government representatives, industry partners, and other stakeholders from the Philippines and abroad." as="p" label="Paragraph 1" className="text-gray-600 text-justify mb-6 block" multiline />
            <EditableField section="about_card" field="paragraph2" fallback="Through research presentations, scientific discussions, and collaborative activities, the symposium provides a platform for sharing knowledge and advancing innovative and sustainable solutions in agriculture, life sciences, and bioresource sciences." as="p" label="Paragraph 2" className="text-gray-600 text-justify mb-6 block" multiline />
            <a href="/about" className="premium-link">
              <EditableField section="about_card" field="link_text" fallback="Read More" as="span" label="Link Text" />
              <span className="arrow" aria-hidden="true">→</span>
            </a>
          </div>

          {/* Card 2: Announcements */}
          <div
            className="reveal-up stagger-2 premium-card scroll-lift bg-white border border-gray-200 p-8 rounded-xl shadow-sm"
            style={{ ["--scroll-y" as any]: `${parallaxEnabled ? (1 - contentScroll.progress) * 20 : 0}px` }}
          >
            <EditableField section="announcements" field="title" fallback="ANNOUNCEMENTS" as="h3" label="Section Title" className="text-xl font-bold text-[#0B2A4A] mb-4 block" />
            <div className="premium-accent w-10 h-1 bg-[#D5A54D] mb-6 rounded-full"></div>

            <EditableList
              section="announcements"
              title="Announcements List"
              subtitle="Manage event announcements and deadlines"
              itemLabel="Announcement"
              fallback={fallbackAnnouncements}
              emptyItem={{
                month: "MMM",
                day: "00",
                category: "CATEGORY",
                title: "New announcement",
                description: "Description here",
                link_text: "Learn more",
                link_url: "/",
              }}
              renderItem={(item, index, editing, onUpdate) =>
                editing ? (
                  <div className="p-3.5 bg-white space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Month</label>
                        <input type="text" value={item.month || ""} onChange={(e) => onUpdate({ ...item, month: e.target.value.toUpperCase() })} className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs font-bold text-[#1D3D6D] focus:border-[#76B947] outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Day</label>
                        <input type="text" value={item.day || ""} onChange={(e) => onUpdate({ ...item, day: e.target.value })} className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs font-bold text-[#0B2A4A] focus:border-[#76B947] outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                        <input type="text" value={item.category || ""} onChange={(e) => onUpdate({ ...item, category: e.target.value })} className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs font-bold text-[#D5A54D] uppercase focus:border-[#76B947] outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                      <input type="text" value={item.title || ""} onChange={(e) => onUpdate({ ...item, title: e.target.value })} className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm font-semibold text-[#0B2A4A] focus:border-[#76B947] outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                      <textarea value={item.description || ""} onChange={(e) => onUpdate({ ...item, description: e.target.value })} rows={2} className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-700 focus:border-[#76B947] outline-none" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Link Text</label>
                        <input type="text" value={item.link_text || ""} onChange={(e) => onUpdate({ ...item, link_text: e.target.value })} className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs font-semibold text-[#1b5e20] focus:border-[#76B947] outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Link URL</label>
                        <input type="text" value={item.link_url || ""} onChange={(e) => onUpdate({ ...item, link_url: e.target.value })} className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-600 font-mono focus:border-[#76B947] outline-none" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`announcement-row flex gap-4 ${index < 2 ? "border-b border-gray-200 pb-4 mb-4" : ""}`}>
                    <div className="ann-date flex flex-col items-center pl-2 border-l-2 border-[#76B947]">
                      <span className="text-xl font-bold text-[#1D3D6D]">{item.month}</span>
                      <span className="text-2xl font-bold text-[#0B2A4A]">{item.day}</span>
                    </div>
                    <div className="flex-1">
                      <p className="ann-category text-xs font-bold text-[#D5A54D] uppercase mb-1">{item.category}</p>
                      <p className="font-semibold text-[#0B2A4A] mb-1">{item.title}</p>
                      <p className="text-sm text-justify text-gray-500">{item.description}</p>
                      <a href={item.link_url} className="premium-link mt-3 text-sm">
                        {item.link_text}
                        <span className="arrow" aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                )
              }
            />
          </div>

          {/* Card 3: WHO SHOULD ATTEND */}
          <div
            className="reveal-up stagger-3 premium-card scroll-lift bg-linear-to-b from-[#F2F9FF] to-white p-8 rounded-xl border border-gray-100"
            style={{ ["--scroll-y" as any]: `${parallaxEnabled ? (1 - contentScroll.progress) * 10 : 0}px` }}
          >
            <div className="premium-icon w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm ring-1 ring-[#4FC3F7]/30">
              <svg className="w-8 h-8 text-[#1D3D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <EditableField section="attendees_card" field="title" fallback="WHO SHOULD ATTEND" as="h3" label="Card Title" className="text-xl font-bold text-[#0B2A4A] mb-4 block" />
            <div className="premium-accent w-10 h-1 bg-[#D5A54D] mb-6 rounded-full"></div>
            <EditableField section="attendees_card" field="description" fallback="The symposium welcomes members of the academic, scientific, government, and industry communities who are interested in advancing research, innovation, and collaboration in agri-life and bioresource sciences." as="p" label="Description" className="text-gray-600 text-justify mb-4 block" multiline />
            <ul className="space-y-2 mb-6">
              <EditableList
                section="attendees"
                title="Attendees List"
                itemLabel="Attendee Group"
                fallback={fallbackAttendees}
                emptyItem={{ text: "New attendee type" }}
                renderItem={(item, index, editing, onUpdate) =>
                  editing ? (
                    <div className="p-3 bg-white">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Attendee Category</label>
                      <input type="text" value={item.text || ""} onChange={(e) => onUpdate({ ...item, text: e.target.value })} className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-800 font-medium focus:border-[#76B947] outline-none" />
                    </div>
                  ) : (
                    <li className="attendee-item flex items-center gap-3 text-gray-700 text-sm">
                      <FaCheckCircle className="text-[#76B947] text-sm shrink-0" />
                      {item.text}
                    </li>
                  )
                }
              />
            </ul>
            <a href="/scientific-tracks" className="premium-link">
              <EditableField section="attendees_card" field="link_text" fallback="See Who Can Participate" as="span" label="Link Text" />
              <span className="arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
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