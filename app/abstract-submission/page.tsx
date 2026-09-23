"use client";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect, useRef } from "react";

import { 
  FaUser, FaFileAlt, FaCheckCircle, FaRegPaperPlane, FaTachometerAlt, 
  FaLanguage, FaPencilAlt, FaSearch, FaRegCalendarAlt, 
  FaInfoCircle, FaEnvelope, FaQuestionCircle, FaUserPlus,
  FaSignInAlt, FaChevronDown, FaArrowRight, FaBullhorn
} from "react-icons/fa";

// ===== Reusable scroll-reveal hook =====
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

export default function FullabstractSubmission() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Reveal hooks
  const heroReveal = useInView<HTMLDivElement>();
  const processReveal = useInView<HTMLDivElement>();
  const guidelinesReveal = useInView<HTMLDivElement>();
  const faqReveal = useInView<HTMLDivElement>();
  const ctaReveal = useInView<HTMLDivElement>();

  // Scroll progress hooks
  const heroScroll = useScrollProgress<HTMLElement>();
  const processScroll = useScrollProgress<HTMLElement>();
  const guidelinesScroll = useScrollProgress<HTMLElement>();

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] font-sans text-[#0A2540] overflow-x-hidden">
      <ScrollProgressBar />

      <style jsx global>{`
      @keyframes stepPulse {
        0% {
          transform: scale(1);
          background-color: #ffffff;
          border-color: #f4f4f5;
          box-shadow: 0 1px 2px rgba(11, 42, 74, 0.04);
          color: #0A2540;
        }
        4% {
          /* instant "on" — no fade in */
          transform: scale(1.14);
          background-color: #FBF3E0;
          border-color: #D5A54D;
          box-shadow:
            0 0 0 8px rgba(213,165,77,0.14),
            0 12px 28px -10px rgba(213,165,77,0.55);
          color: #8B6F47;
        }
        16% {
          /* hold "on" for the step's time slice */
          transform: scale(1.14);
          background-color: #FBF3E0;
          border-color: #D5A54D;
          box-shadow:
            0 0 0 8px rgba(213,165,77,0.14),
            0 12px 28px -10px rgba(213,165,77,0.55);
          color: #8B6F47;
        }
        20% {
          /* instant "off" — no fade out */
          transform: scale(1);
          background-color: #ffffff;
          border-color: #f4f4f5;
          box-shadow: 0 1px 2px rgba(11, 42, 74, 0.04);
          color: #0A2540;
        }
        100% {
          /* stay off until the next cycle */
          transform: scale(1);
          background-color: #ffffff;
          border-color: #f4f4f5;
          box-shadow: 0 1px 2px rgba(11, 42, 74, 0.04);
          color: #0A2540;
        }
      }

      @keyframes numPulse {
        0% {
          transform: scale(1);
          background: #0A2540;
        }
        4% {
          transform: scale(1.18);
          background: linear-gradient(135deg, #D5A54D, #F0C674);
        }
        16% {
          transform: scale(1.18);
          background: linear-gradient(135deg, #D5A54D, #F0C674);
        }
        20% {
          transform: scale(1);
          background: #0A2540;
        }
        100% {
          transform: scale(1);
          background: #0A2540;
        }
      }

      .process-icon.animate-step {
        animation: stepPulse 2.5s linear infinite;
      }
      .process-num.animate-step {
        animation: numPulse 2.5s linear infinite;
      }

      /* Stagger each step so the highlight travels 1 → 5 over 2.5s */
      .process-step:nth-child(1) .process-icon.animate-step,
      .process-step:nth-child(1) .process-num.animate-step {
        animation-delay: 0s;
      }
      .process-step:nth-child(2) .process-icon.animate-step,
      .process-step:nth-child(2) .process-num.animate-step {
        animation-delay: 0.5s;
      }
      .process-step:nth-child(3) .process-icon.animate-step,
      .process-step:nth-child(3) .process-num.animate-step {
        animation-delay: 1s;
      }
      .process-step:nth-child(4) .process-icon.animate-step,
      .process-step:nth-child(4) .process-num.animate-step {
        animation-delay: 1.5s;
      }
      .process-step:nth-child(5) .process-icon.animate-step,
      .process-step:nth-child(5) .process-num.animate-step {
        animation-delay: 2s;
      }

      /* Pause auto-highlight while the user hovers any step */
      .process-step:hover .process-icon.animate-step,
      .process-step:hover .process-num.animate-step {
        animation-play-state: paused;
      }

      @media (prefers-reduced-motion: reduce) {
        .process-icon.animate-step,
        .process-num.animate-step {
          animation: none !important;
        }
      }

        @keyframes shimmerLine {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideInRight {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideInLeft {
          from { opacity: 0; transform: translateX(-24px); }
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
          background-image: linear-gradient(90deg, #D5A54D, #F0C674, #D5A54D);
          background-size: 200% 100%;
          animation: shimmerLine 4s linear infinite;
        }

        /* ===== Premium card ===== */
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

        .premium-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #0A2540;
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
          background: linear-gradient(90deg, #D5A54D, #F0C674);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .premium-link:hover { color: #1D3D6D; gap: 0.75rem; }
        .premium-link:hover::after { transform: scaleX(1); }

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

        .process-step {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .process-step:hover {
          transform: translateY(-6px);
        }
        .process-step:hover .process-icon {
          transform: scale(1.1) rotate(-6deg);
          box-shadow: 0 0 0 8px rgba(213,165,77,0.12), 0 12px 28px -10px rgba(213,165,77,0.5);
          border-color: rgba(213,165,77,0.4);
        }
        .process-icon {
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease, border-color 0.5s ease;
        }
        .process-step:hover .process-num {
          transform: scale(1.15);
          background: linear-gradient(135deg, #D5A54D, #F0C674);
        }
        .process-num {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), background 0.4s ease;
        }

        .guideline-item {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .guideline-item:hover {
          transform: translateX(6px);
        }
        .guideline-item:hover .guideline-icon {
          transform: scale(1.12) rotate(-6deg);
          box-shadow: 0 0 0 6px rgba(213,165,77,0.10);
          background-color: rgba(213,165,77,0.15);
        }
        .guideline-icon {
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease, background-color 0.5s ease;
        }

        .faq-row {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease, box-shadow 0.35s ease;
        }
        .faq-row:hover {
          transform: translateY(-3px);
          border-color: rgba(213,165,77,0.5);
          box-shadow:
            0 2px 4px rgba(11, 42, 74, 0.05),
            0 12px 24px -10px rgba(11, 42, 74, 0.12);
        }
        .faq-row .faq-chevron {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .faq-row[data-open="true"] .faq-chevron {
          transform: rotate(180deg);
        }

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

      {/* ================= PAGE HERO ================= */}
      <section
        ref={heroScroll.ref}
        className={`relative bg-white overflow-hidden border-b border-zinc-100 ${heroReveal.inView ? "in-view" : ""}`}
      >
        {/* Decorative gradient orb */}
        <div
          aria-hidden
          className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-[#D5A54D]/10 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none"
        />

        {/* Floating laptop image — subtle parallax on scroll, no pulse */}
        <div
          className="hidden md:block absolute top-1/2 right-55 w-125 pointer-events-none z-20"
          style={{ transform: `translateY(calc(-50% + ${(heroScroll.progress - 0.5) * -30}px))` }}
        >
          <img
            src="/images/laptop2.png"
            alt="Laptop Submission"
            width={500}
            height={300}
            className="w-full h-auto max-w-none object-contain"
          />
        </div>

        {/* Content */}
        <div
          ref={heroReveal.ref}
          className="max-w-7xl mx-auto px-6 py-16 relative z-10"
        >
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8 reveal-up">
            <Link href="/" className="hover:text-[#F5A623] transition-colors">
              Home
            </Link>
            <span className="text-zinc-300">›</span>
            <span className="text-[#0A2540] font-medium">Abstract Submission</span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <h1 className="text-5xl font-bold text-[#0A2540] mb-4 reveal-up stagger-1">
                Abstract Submission
              </h1>
              <div className="w-16 h-1 gold-underline mb-6 reveal-up stagger-2 rounded-full"></div>

              <p className="text-zinc-600 mb-8 leading-relaxed reveal-up stagger-3">
                We welcome original, unpublished abstracts that contribute to the
                advancement of knowledge and practice aligned with the conference
                themes. All submissions will undergo a rigorous peer-review process.
              </p>

              <div className="flex flex-wrap gap-4 reveal-up stagger-4">
                <Link
                  href="/login"
                  className="premium-btn inline-flex items-center gap-2 bg-linear-to-r from-[#0A2540] to-[#1a3a5c] text-white px-8 py-3 rounded-md font-semibold shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Submit Your Abstract <FaRegPaperPlane className="rotate-[-20deg]" />
                </Link>
              </div>
            </div>

            <div className="hidden md:block" />
          </div>
        </div>
      </section>

      {/* ================= SUBMISSION PROCESS ================= */}
      <section ref={processScroll.ref} className="py-16">
        <div
          ref={processReveal.ref}
          className={`max-w-7xl mx-auto px-6 ${processReveal.inView ? "in-view" : ""}`}
        >
          <div className="text-center mb-12 reveal-up">
            <h2 className="text-3xl font-bold text-[#0A2540] uppercase">Submission Process</h2>
            <div className="w-16 h-1 gold-underline mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { icon: <FaUser />, num: "1", title: "Create an Account", desc: "Register or log in to your account to get started." },
              { icon: <FaFileAlt />, num: "2", title: "Start Submission", desc: "Fill in the abstract details and upload your abstract." },
              { icon: <FaCheckCircle />, num: "3", title: "Review & Confirm", desc: "Review all information and confirm your submission." },
              { icon: <FaRegPaperPlane />, num: "4", title: "Submit", desc: "Submit your abstract and receive a confirmation." },
              { icon: <FaTachometerAlt />, num: "5", title: "Track Status", desc: "Monitor your abstract status through your dashboard." },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`process-step flex flex-col items-center text-center relative reveal-up stagger-${idx + 1}`}
              >
                {idx !== 4 && (
                  <div className="absolute top-8 left-[60%] w-[80%] h-px bg-linear-to-r from-zinc-200 via-[#D5A54D]/40 to-zinc-200 hidden md:block"></div>
                )}

                <div className="process-icon animate-step w-16 h-16 bg-white border border-zinc-100 rounded-full flex items-center justify-center text-2xl text-[#0A2540] mb-4 shadow-sm relative z-10">
                  {item.icon}
                </div>
                <div className="process-num animate-step w-6 h-6 bg-[#0A2540] rounded-full text-white flex items-center justify-center text-xs font-bold mb-4">
                  {item.num}
                </div>
                <h3 className="font-bold text-[#0A2540] mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GUIDELINES & SUBMIT ================= */}
      <section ref={guidelinesScroll.ref} className="bg-white py-16 border-t border-zinc-100">
        <div
          ref={guidelinesReveal.ref}
          className={`max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 ${guidelinesReveal.inView ? "in-view" : ""}`}
        >
          {/* Left: Guidelines */}
          <div className="reveal-left">
            <h2 className="text-2xl font-bold text-[#0A2540] mb-2">SUBMISSION GUIDELINES</h2>
            <div className="w-12 h-1 gold-underline mb-6 rounded-full"></div>
            <p className="text-zinc-600 mb-8">Please read the guidelines carefully before submitting your abstract.</p>

            <div className="space-y-6">
              {[
                { icon: <FaUser />, title: "Eligibility", desc: "The abstract must be original, unpublished, and not currently under review or consideration elsewhere." },
                { icon: <FaLanguage />, title: "Language", desc: "All abstracts must be written in English." },
                { icon: <FaFileAlt />, title: "File Format", desc: "Submit your abstract in Microsoft Word (.docx) or PDF (.pdf) format." },
                { icon: <FaFileAlt />, title: "Template", desc: "Use the official conference template for formatting your abstract.", action: "Download Template" },
                { icon: <FaPencilAlt />, title: "Length", desc: "The abstract must be between 200 and 300 words, including references and appendices." },
                { icon: <FaSearch />, title: "Review Process", desc: "All submissions will undergo a double-blind peer review." },
              ].map((g, idx) => (
                <div key={idx} className="guideline-item flex gap-4">
                  <div className="guideline-icon w-10 h-10 rounded-full bg-[#F0F6FF] text-[#0A2540] flex items-center justify-center text-lg shrink-0">
                    {g.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0A2540] mb-1">{g.title}</h4>
                    <p className="text-sm text-zinc-600">{g.desc}</p>
                    {g.action && (
                      <button className="premium-link mt-2 text-sm">
                        {g.action} <FaArrowRight className="text-xs" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Important Dates */}
              <div className="guideline-item flex gap-4">
                <div className="guideline-icon w-10 h-10 rounded-full bg-[#F0F6FF] text-[#0A2540] flex items-center justify-center text-lg shrink-0">
                  <FaRegCalendarAlt />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[#0A2540] mb-2">Important Dates</h4>
                  <div className="flex flex-wrap gap-4">
                    <div className="premium-card flex-1 min-w-35 rounded-lg p-4 border border-zinc-200">
                      <p className="text-xs font-semibold text-[#0A2540] uppercase mb-1">Submission Deadline</p>
                      <p className="font-bold text-[#0A2540]">June 15, 2025</p>
                    </div>
                    <div className="premium-card flex-1 min-w-35 rounded-lg p-4 border border-zinc-200">
                      <p className="text-xs font-semibold text-[#0A2540] uppercase mb-1">Notification of Acceptance</p>
                      <p className="font-bold text-[#0A2540]">July 15, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Note */}
            <div className="premium-card mt-10 bg-[#F0F6FF] border border-blue-100 rounded-lg p-4 flex gap-4 items-start reveal-up">
              <FaInfoCircle className="text-[#0A2540] text-xl mt-0.5 shrink-0" />
              <p className="text-sm text-zinc-600">
                <span className="font-bold text-[#0A2540]">Incomplete or non-compliant submissions</span> may be desk rejected. Please ensure your abstract follows all guidelines.
              </p>
            </div>
          </div>

          {/* Right: Submit Section */}
          <div className="reveal-right">
            <h2 className="text-2xl font-bold text-[#0A2540] mb-2">SUBMIT YOUR ABSTRACT</h2>
            <div className="w-12 h-1 gold-underline mb-6 rounded-full"></div>
            <p className="text-zinc-600 mb-6">Ready to submit? Log in to your account and complete the submission form.</p>

            <div className="space-y-4 mb-10">
              <Link
                href="/login"
                className="premium-btn w-full bg-linear-to-r from-[#0A2540] to-[#1a3a5c] text-white py-4 rounded-md font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <FaSignInAlt /> Login to Your Account
              </Link>

              <div className="relative flex py-2 items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200"></div>
                </div>
                <div className="relative bg-white px-4 text-xs font-bold text-zinc-400 uppercase">or</div>
              </div>

              <Link
                href="/register"
                className="w-full border-2 border-[#0A2540] text-[#0A2540] py-4 rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-[#0A2540] hover:text-white transition-all duration-300"
              >
                <FaUserPlus /> Create a New Account
              </Link>
            </div>

            {/* What You Will Need */}
            <div className="premium-card bg-[#F9FAFC] border border-zinc-200 rounded-xl p-8 mb-8 reveal-up stagger-1">
              <h3 className="font-bold text-[#0A2540] uppercase mb-4">What You Will Need</h3>
              <ul className="space-y-3">
                {[
                  "Abstract Title",
                  "Abstract (150 - 250 words)",
                  "Keywords (3-5)",
                  "Author Information",
                  "Abstract File",
                  "Supplementary Files (if any)"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-zinc-600 group cursor-default">
                    <FaCheckCircle className="text-[#D5A54D] transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Need Help? */}
            <div className="premium-card bg-[#F9FAFC] border border-zinc-200 rounded-xl p-8 reveal-up stagger-2">
              <h3 className="font-bold text-[#0A2540] uppercase mb-4">Need Help?</h3>
              <p className="text-sm text-zinc-600 mb-6">
                If you have any questions or encounter issues during the submission process, we're here to help.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-zinc-600">
                  <FaEnvelope className="text-[#0A2540] text-lg" />
                  <span>
                    Email us at{" "}
                    <span className="font-semibold text-[#0A2540]">info@icolloquium2025.org</span>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-600">
                  <FaQuestionCircle className="text-[#0A2540] text-lg" />
                  <span>Visit our FAQ</span>
                </div>
              </div>

              <button className="premium-link mt-4 text-sm">
                Frequently Asked Questions <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="bg-white py-16">
        <div
          ref={faqReveal.ref}
          className={`max-w-7xl mx-auto px-6 ${faqReveal.inView ? "in-view" : ""}`}
        >
          <div className="text-center mb-12 reveal-up">
            <h2 className="text-3xl font-bold text-[#0A2540] uppercase">
              Frequently Asked Questions
            </h2>
            <div className="w-16 h-1 gold-underline mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            {[
              { q: "Who can submit an abstract?", a: "Researchers, faculty members, graduate and undergraduate students, and industry practitioners are all welcome to submit." },
              { q: "What topics are suitable for submission?", a: "Topics aligned with our five scientific tracks: agriculture, life sciences, bioresources, food & nutrition, and innovation." },
              { q: "Is there a submission fee?", a: "There is no fee for abstract submission. Registration fees apply once your abstract is accepted." },
              { q: "Can I submit more than one abstract?", a: "Yes, you may submit more than one abstract, but you must register separately for each accepted abstract." },
              { q: "How will I know if my abstract is accepted?", a: "You will receive email notification. Rolling notifications begin October 2026; final notices by January 25, 2027." },
              { q: "Can I make changes after submission?", a: "Minor edits are possible before the review period ends. Contact the secretariat to request changes." },
            ].map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  data-open={isOpen}
                  className={`faq-row reveal-up stagger-${(idx % 6) + 1} bg-[#F9FAFC] border border-zinc-200 rounded-lg overflow-hidden cursor-pointer`}
                  onClick={() => toggleFaq(idx)}
                >
                  <div className="p-5 flex items-center justify-between">
                    <span className="font-semibold text-[#0A2540] pr-4">{item.q}</span>
                    <FaChevronDown className="faq-chevron text-[#D5A54D] shrink-0" />
                  </div>
                  <div
                    className="grid transition-all duration-400 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm text-zinc-600 leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section
        ref={ctaReveal.ref}
        className={`bg-[#F0F6FF] py-8 ${ctaReveal.inView ? "in-view" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="premium-card reveal-up bg-white rounded-xl border border-blue-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="premium-icon w-16 h-16 bg-[#F0F6FF] rounded-full flex items-center justify-center">
                <FaBullhorn className="text-[#0A2540] text-3xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0A2540]">Have a great abstract to share?</h3>
                <p className="text-zinc-500">Join researchers, academics, and professionals from around the world.</p>
              </div>
            </div>
            <Link
              href="/login"
              className="premium-btn bg-linear-to-r from-[#0A2540] to-[#1a3a5c] text-white px-8 py-3 rounded-md font-semibold transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Submit Your Abstract Now <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}