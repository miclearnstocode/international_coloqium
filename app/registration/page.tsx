"use client";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { 
  FaRegListAlt, FaUsers, FaGlobeAsia, FaUserTie, FaUserGraduate, FaUserCircle,
  FaRegCalendarAlt, FaInfoCircle, FaDollarSign, FaRegUser, FaMobileAlt,
  FaRegPaperPlane, FaBullseye, FaUniversity, FaRegFileAlt, FaChevronRight,
  FaRegCheckCircle, FaPaperPlane
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

export default function RegistrationPage() {
  // Reveal hooks
  const heroReveal = useInView<HTMLDivElement>();
  const feesReveal = useInView<HTMLDivElement>();
  const infoReveal = useInView<HTMLDivElement>();
  const paymentReveal = useInView<HTMLDivElement>();
  const ctaReveal = useInView<HTMLDivElement>();

  // Scroll progress hooks
  const heroScroll = useScrollProgress<HTMLElement>();
  const feesScroll = useScrollProgress<HTMLElement>();

  const fees = [
    { icon: <FaGlobeAsia />, text: "International participants" },
    { icon: <FaUsers />, text: "Local professionals/researchers" },
    { icon: <FaUserTie />, text: "Faculty" },
    { icon: <FaUserGraduate />, text: "Graduate students" },
    { icon: <FaUserCircle />, text: "Undergraduate students" },
  ];

  const importantDates = [
    { icon: <FaRegPaperPlane />, title: "Call for Papers Open", date: "April 15, 2025" },
    { icon: <FaRegFileAlt />, title: "Full Paper Submission Deadline", date: "June 30, 2025" },
    { icon: <FaRegCheckCircle />, title: "Notification of Acceptance", date: "July 25, 2025" },
    { icon: <FaDollarSign />, title: "Early Bird Payment Deadline", date: "July 31, 2025" },
    { icon: <FaRegUser />, title: "Regular Payment Deadline", date: "August 31, 2025" },
    { icon: <FaRegCalendarAlt />, title: "Colloquium Dates", date: "October 15-17, 2025" },
  ];

  const steps = [
    { icon: <FaRegFileAlt />, title: "Fill out the Online Registration Form", desc: "Provide all required information in the registration form." },
    { icon: <FaRegPaperPlane />, title: "Receive Confirmation Email", desc: "You will receive a confirmation email with payment instructions." },
    { icon: <FaUniversity />, title: "Pay the Registration Fee", desc: "Pay the registration fee through bank transfer." },
    { icon: <FaRegPaperPlane />, title: "Submit Proof of Payment", desc: "Upload or email your proof of payment." },
    { icon: <FaRegCheckCircle />, title: "Registration Confirmation", desc: "Your registration will be confirmed and a receipt will be sent to you." },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0A2540] flex flex-col overflow-x-hidden">
      <ScrollProgressBar />

      <style jsx global>{`
      @keyframes timelinePulse {
        0% {
          transform: scale(1);
          background-color: #F0F6FF;
          border-color: #ffffff;
          color: #1D3D6D;
          box-shadow: none;
        }
        2% {
          /* instant on */
          transform: scale(1.14);
          background-color: #FBF3E0;
          border-color: #D5A54D;
          color: #8B6F47;
          box-shadow:
            0 0 0 6px rgba(213,165,77,0.14),
            0 8px 20px -8px rgba(213,165,77,0.55);
        }
        11% {
          /* hold on for ~1/9 of the cycle */
          transform: scale(1.14);
          background-color: #FBF3E0;
          border-color: #D5A54D;
          color: #8B6F47;
          box-shadow:
            0 0 0 6px rgba(213,165,77,0.14),
            0 8px 20px -8px rgba(213,165,77,0.55);
        }
        13% {
          /* instant off */
          transform: scale(1);
          background-color: #F0F6FF;
          border-color: #ffffff;
          color: #1D3D6D;
          box-shadow: none;
        }
        100% {
          /* stay off until next cycle */
          transform: scale(1);
          background-color: #F0F6FF;
          border-color: #ffffff;
          color: #1D3D6D;
          box-shadow: none;
        }
      }

      .timeline-icon.animate-step {
        animation: timelinePulse 4.8s linear infinite;
      }

      /* --- Important Dates: 6 items, 0.8s apart, 4.8s cycle --- */
      .dates-timeline .timeline-item:nth-child(1) .timeline-icon.animate-step { animation-delay: 0s;   animation-duration: 4.8s; }
      .dates-timeline .timeline-item:nth-child(2) .timeline-icon.animate-step { animation-delay: 0.8s; animation-duration: 4.8s; }
      .dates-timeline .timeline-item:nth-child(3) .timeline-icon.animate-step { animation-delay: 1.6s; animation-duration: 4.8s; }
      .dates-timeline .timeline-item:nth-child(4) .timeline-icon.animate-step { animation-delay: 2.4s; animation-duration: 4.8s; }
      .dates-timeline .timeline-item:nth-child(5) .timeline-icon.animate-step { animation-delay: 3.2s; animation-duration: 4.8s; }
      .dates-timeline .timeline-item:nth-child(6) .timeline-icon.animate-step { animation-delay: 4.0s; animation-duration: 4.8s; }

      /* --- Steps for Registration: 5 items, 0.8s apart, 4s cycle --- */
      .steps-timeline .timeline-item:nth-child(1) .timeline-icon.animate-step { animation-delay: 0s;   animation-duration: 4s; }
      .steps-timeline .timeline-item:nth-child(2) .timeline-icon.animate-step { animation-delay: 0.8s; animation-duration: 4s; }
      .steps-timeline .timeline-item:nth-child(3) .timeline-icon.animate-step { animation-delay: 1.6s; animation-duration: 4s; }
      .steps-timeline .timeline-item:nth-child(4) .timeline-icon.animate-step { animation-delay: 2.4s; animation-duration: 4s; }
      .steps-timeline .timeline-item:nth-child(5) .timeline-icon.animate-step { animation-delay: 3.2s; animation-duration: 4s; }

      /* Pause when user hovers the item */
      .timeline-item:hover .timeline-icon.animate-step {
        animation-play-state: paused;
      }

      @media (prefers-reduced-motion: reduce) {
        .timeline-icon.animate-step {
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
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease;
        }
        .premium-card:hover .premium-icon {
          transform: scale(1.08) rotate(-6deg);
          box-shadow: 0 0 0 6px rgba(213,165,77,0.10), 0 8px 20px -8px rgba(213,165,77,0.45);
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

        /* ===== Timeline row hover ===== */
        .timeline-item {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .timeline-item:hover {
          transform: translateX(6px);
        }
        .timeline-item .timeline-icon {
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.5s ease,
                      background-color 0.5s ease,
                      color 0.4s ease;
        }
        .timeline-item:hover .timeline-icon {
          transform: scale(1.12) rotate(-6deg);
          background-color: #FBF3E0;
          color: #8B6F47;
          box-shadow: 0 0 0 6px rgba(213,165,77,0.10), 0 8px 20px -8px rgba(213,165,77,0.45);
        }

        /* ===== Payment table row hover ===== */
        .pay-row {
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .pay-row:hover {
          background-color: rgba(213, 165, 77, 0.06);
        }

        /* ===== Fee list hover ===== */
        .fee-item {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .fee-item:hover {
          transform: translateX(6px);
        }
        .fee-item svg {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), color 0.3s ease;
        }
        .fee-item:hover svg {
          transform: scale(1.2) rotate(8deg);
          color: #D5A54D;
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
          className="absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-[#D5A54D]/8 to-transparent rounded-full blur-3xl -translate-y-1/3 -translate-x-1/4 pointer-events-none"
        />

        <div
          ref={heroReveal.ref}
          className="max-w-350 mx-auto px-8 py-16 relative z-10"
        >
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8 reveal-up">
            <Link href="/" className="hover:text-[#F5A623] transition-colors">
              Home
            </Link>
            <span className="text-zinc-300">›</span>
            <span className="text-[#0A2540] font-medium">Registration</span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-[#0A2540] mb-4 reveal-up stagger-1">
                Registration
              </h1>
              <div className="w-16 h-1 gold-underline mb-6 reveal-up stagger-2 rounded-full"></div>
              <p className="text-lg text-zinc-600 leading-relaxed reveal-up stagger-3">
                Join researchers, innovators, and professionals from around the world and be part of the International Colloquium 2025.
              </p>
            </div>

            {/* Registration Image — subtle scroll parallax */}
            <div
              className="hidden md:flex justify-end items-center"
              style={{ transform: `translateY(${(heroScroll.progress - 0.5) * -30}px)` }}
            >
              <img
                src="/images/registration-clipboard.png"
                alt="Registration"
                className="w-100 object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEES & INFORMATION ================= */}
      <section ref={feesScroll.ref} className="py-16">
        <div
          ref={feesReveal.ref}
          className={`max-w-350 mx-auto px-8 ${feesReveal.inView ? "in-view" : ""}`}
        >
          <div className="flex flex-col md:flex-row gap-8 items-stretch">

            {/* Left: Fees */}
            <div className="w-full md:w-1/2 reveal-left">
              <div className="bg-linear-to-r from-[#0A2540] to-[#1a3a5c] text-white p-5 flex items-center gap-3 rounded-t-xl">
                <FaRegListAlt className="text-xl" />
                <h2 className="text-lg font-bold uppercase">Registration Fees</h2>
              </div>

              <div className="premium-card bg-white border border-t-0 border-zinc-200 rounded-b-xl p-9 flex flex-col h-[530]">
                <h3 className="text-sm font-bold text-[#0A2540] uppercase mb-6">A. Registration fees:</h3>
                <p className="text-5xl font-bold text-[#0A2540] mb-8">P 4,500.00</p>

                <ul className="space-y-4 mb-8">
                  {fees.map((fee, idx) => (
                    <li
                      key={idx}
                      className={`fee-item flex items-center gap-3 text-zinc-600 reveal-up stagger-${(idx % 6) + 1}`}
                    >
                      <span className="text-[#0A2540] text-lg">{fee.icon}</span>
                      <span className="text-sm">{fee.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto bg-[#F0F6FF] border border-blue-100 rounded-lg p-4 flex gap-3 items-start">
                  <FaInfoCircle className="text-[#0A2540] mt-0.5 shrink-0" />
                  <p className="text-xs text-zinc-600">
                    The registration fee covers participation in all sessions, conference materials, certificates, and meals during the event.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Table */}
            <div className="w-full md:w-1/2 reveal-right">
              <div className="bg-linear-to-r from-[#0A2540] to-[#1a3a5c] text-white p-5 flex items-center gap-3 rounded-t-xl">
                <FaUsers className="text-xl" />
                <h2 className="text-lg font-bold uppercase">Registration Information by Participant</h2>
              </div>

              <div className="premium-card bg-white border border-t-0 border-zinc-200 rounded-b-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#1D3D6D] text-white uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3">Participant Category</th>
                      <th className="px-6 py-3">Description / Eligibility</th>
                      <th className="px-6 py-3">Registration Fee (PHP)</th>
                      <th className="px-6 py-3">Inclusions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-600">
                    {[
                      { cat: "International Participants", desc: "Participants from other countries", inc: ["Access to all sessions", "Conference materials", "Certificate", "Meals & refreshments"] },
                      { cat: "Local Professionals / Researchers", desc: "Professionals and researchers in the field", inc: ["Access to all sessions", "Conference materials", "Certificate", "Meals & refreshments"] },
                      { cat: "Faculty", desc: "Full-time faculty members", inc: ["Access to all sessions", "Conference materials", "Certificate", "Meals & refreshments"] },
                      { cat: "Graduate Students", desc: "Currently enrolled graduate students", inc: ["Access to all sessions", "Conference materials", "Certificate", "Meals & refreshments"] },
                      { cat: "Undergraduate Students", desc: "Currently enrolled undergraduate students", inc: ["Access to all sessions", "Conference materials", "Certificate", "Meals & refreshments"] },
                    ].map((row, idx) => (
                      <tr key={idx} className="pay-row">
                        <td className="px-6 py-2 font-semibold text-[#0A2540]">{row.cat}</td>
                        <td className="px-6 py-2">{row.desc}</td>
                        <td className="px-6 py-2 font-medium">4,500.00</td>
                        <td className="px-6 py-2">
                          <ul className="space-y-0.5">
                            {row.inc.map((item, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs whitespace-nowrap">
                                <span className="text-[#F5A623] mt-0.5">•</span> {item}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DATES, STEPS & POLICY ================= */}
      <section ref={infoReveal.ref} className={`bg-white py-16 border-t border-zinc-100 ${infoReveal.inView ? "in-view" : ""}`}>
        <div className="max-w-350 mx-auto px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch">

          {/* Important Dates */}
          <div className="reveal-up stagger-1 flex flex-col h-full">
            <div className="bg-linear-to-r from-[#0A2540] to-[#1a3a5c] text-white p-5 flex items-center gap-3 rounded-t-xl mb-0">
              <FaRegCalendarAlt className="text-xl" />
              <h2 className="text-lg font-bold uppercase">Important Dates</h2>
            </div>

            <div className="premium-card bg-white border border-t-0 border-zinc-200 rounded-b-xl p-6 relative flex-1">
              <div className="absolute left-10.75 top-12 bottom-12 w-0.5 bg-zinc-200"></div>

              <div className="space-y-6 relative dates-timeline">
                {importantDates.map((date, idx) => (
                  <div key={idx} className={`timeline-item flex gap-4 relative reveal-up stagger-${(idx % 6) + 1}`}>
                    <div className="timeline-icon animate-step w-10 h-10 rounded-full bg-[#F0F6FF] border-2 border-white text-[#1D3D6D] flex items-center justify-center text-lg shrink-0 relative z-10">
                      {date.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0A2540] text-sm mb-0.5">{date.title}</p>
                      <p className="text-sm text-zinc-500">{date.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Steps for Registration */}
          <div className="reveal-up stagger-2 flex flex-col h-full">
            <div className="bg-linear-to-r from-[#0A2540] to-[#1a3a5c] text-white p-5 flex items-center gap-3 rounded-t-xl mb-0">
              <FaBullseye className="text-xl" />
              <h2 className="text-lg font-bold uppercase">Steps for Registration</h2>
            </div>

            <div className="premium-card bg-white border border-t-0 border-zinc-200 rounded-b-xl p-6 relative flex-1">
              <div className="absolute left-10.75 top-12 bottom-19 w-0.5 bg-zinc-200"></div>

              <div className="space-y-6 relative steps-timeline">
                {steps.map((step, idx) => (
                  <div key={idx} className={`timeline-item flex gap-4 relative reveal-up stagger-${(idx % 6) + 1}`}>
                    <div className="timeline-icon animate-step w-10 h-10 rounded-full bg-[#F0F6FF] border-2 border-white text-[#1D3D6D] flex items-center justify-center text-lg shrink-0 relative z-10 font-bold">
                      <span className="text-sm leading-none tabular-nums">{idx + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-[#0A2540] text-sm mb-0.5">{step.title}</p>
                      <p className="text-xs text-zinc-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cancel Policy */}
          <div className="reveal-up stagger-3 flex flex-col h-full">
            <div className="bg-linear-to-r from-[#0A2540] to-[#1a3a5c] text-white p-5 flex items-center gap-3 rounded-t-xl mb-0">
              <FaRegListAlt className="text-xl" />
              <h2 className="text-lg font-bold uppercase">Cancel Policy</h2>
            </div>
            <div className="premium-card bg-white border border-t-0 border-zinc-200 rounded-b-xl p-6 flex-1 flex flex-col">
              <p className="text-sm text-zinc-600 mb-6">Cancellations must be sent in writing to the Secretariat.</p>

              <ul className="space-y-4 text-sm text-zinc-600 mb-8">
                <li className="flex gap-2">
                  <span className="font-bold text-[#0A2540]">•</span> On or before June 30, 2025 <br /> – 50% refund
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-[#0A2540]">•</span> On or before July 31, 2025 <br /> – 25% refund
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-[#0A2540]">•</span> After July 31, 2025 <br /> – No refund
                </li>
              </ul>

              <div className="mt-auto bg-[#FFF5F5] border border-red-100 rounded-lg p-4 flex gap-3 items-start">
                <FaInfoCircle className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-xs text-zinc-600">
                  <span className="font-bold text-[#0A2540]">Substitutions are allowed</span> at any time by notifying the Secretariat.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= PAYMENT INFO ================= */}
      <section
        ref={paymentReveal.ref}
        className={`py-16 ${paymentReveal.inView ? "in-view" : ""}`}
      >
        <div className="max-w-350 mx-auto px-8">
          <div className="max-w-4xl mx-auto reveal-up">
            <div className="bg-linear-to-r from-[#0A2540] to-[#1a3a5c] text-white p-5 flex items-center gap-3 rounded-t-xl mb-0">
              <FaRegListAlt className="text-xl" />
              <h2 className="text-lg font-bold uppercase">Paying Registration Account</h2>
            </div>

            <div className="premium-card bg-white border border-t-0 border-zinc-200 rounded-b-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center">

                {/* Left: Account Info */}
                <div className="space-y-6">
                  <div className="grid grid-cols-[160px_1fr] gap-4 text-sm">
                    <span className="font-bold text-[#0A2540] whitespace-nowrap">Account Name</span>
                    <span className="text-zinc-600">IC2025 Organizing Committee</span>

                    <span className="font-bold text-[#0A2540] whitespace-nowrap">Bank Name</span>
                    <span className="text-zinc-600">Banco de Oro (BDO)</span>

                    <span className="font-bold text-[#0A2540] whitespace-nowrap">Account Number</span>
                    <span className="text-zinc-600">0123 4567 8901</span>

                    <span className="font-bold text-[#0A2540] whitespace-nowrap">Account Type</span>
                    <span className="text-zinc-600">Savings Account</span>

                    <span className="font-bold text-[#0A2540] whitespace-nowrap">SWIFT/BIC</span>
                    <span className="text-zinc-600">BNORPHMM</span>
                  </div>
                </div>

                {/* Center: Bank Icon */}
                <div className="flex justify-center items-center h-full py-4 md:py-0">
                  <FaUniversity className="text-[#1D3D6D] text-8xl drop-shadow-sm" />
                </div>

                {/* Right: Email Instructions */}
                <div className="bg-[#F0F6FF] border border-blue-100 rounded-lg p-6 h-full flex flex-col justify-center">
                  <div className="flex items-start gap-3">
                    <FaRegFileAlt className="text-[#0A2540] mt-1 text-xl shrink-0" />
                    <div>
                      <p className="font-bold text-[#0A2540] text-sm mb-2">Please email or upload your proof of payment</p>
                      <div className="text-xs text-zinc-600 space-y-1">
                        <p>Email: <span className="font-semibold text-[#0A2540]">internationalsymposium@capsu.edu.ph</span></p>
                        <p>Subject: <span className="font-semibold text-[#0A2540]">IC2025 Payment – [Your Name]</span></p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section ref={ctaReveal.ref} className={`pb-20 ${ctaReveal.inView ? "in-view" : ""}`}>
        <div className="max-w-350 mx-auto px-8">
          <div className="premium-card reveal-up bg-white rounded-xl border border-zinc-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="premium-icon w-16 h-16 bg-[#F0F6FF] rounded-full flex items-center justify-center">
                <FaPaperPlane className="text-[#1D3D6D] text-3xl rotate-[-20deg]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0A2540] mb-1">Be Part of Global Discussions</h3>
                <p className="text-zinc-500">
                  Secure your slot today and join us in shaping a sustainable future through research, innovation, and collaboration.
                </p>
              </div>
            </div>
            <button className="premium-btn bg-linear-to-r from-[#1D3D6D] to-[#16305a] text-white px-8 py-4 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 shrink-0 hover:-translate-y-0.5 hover:shadow-xl">
              Register Now <FaChevronRight />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}