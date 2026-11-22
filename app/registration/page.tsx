"use client";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UnderDevelopment from "../components/UnderDevelopment";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { 
  FaRegListAlt, FaUsers, FaGlobeAsia, FaUserTie, FaUserGraduate, FaUserCircle,
  FaRegCalendarAlt, FaInfoCircle, FaDollarSign, FaRegUser, 
  FaRegPaperPlane, FaUniversity, FaRegFileAlt, FaChevronRight,
  FaRegCheckCircle, FaPaperPlane, FaLaptop, FaSearch, FaEnvelopeOpenText,
  FaEnvelope, FaUserCheck, FaTimesCircle, FaCreditCard, FaCheckDouble,
  FaUsersCog, FaClipboardList, FaBullseye, FaCheckCircle, FaBookOpen,
} from "react-icons/fa";

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

export default function RegistrationPage() {
  // Reveal hooks
  const heroReveal = useInView<HTMLDivElement>();
  const feesReveal = useInView<HTMLDivElement>();
  const infoReveal = useInView<HTMLDivElement>();
  const paymentReveal = useInView<HTMLDivElement>();
  const ctaReveal = useInView<HTMLDivElement>();
  const heroScroll = useScrollProgress<HTMLElement>();
  const feesScroll = useScrollProgress<HTMLElement>();
  const [showDevModal, setShowDevModal] = useState(false);

  const fees = [
    { icon: <FaGlobeAsia />, text: "International participants" },
    { icon: <FaUsers />, text: "Local professionals/researchers" },
    { icon: <FaUserTie />, text: "Faculty" },
    { icon: <FaUserGraduate />, text: "Graduate students" },
    { icon: <FaUserCircle />, text: "Undergraduate students" },
  ];

  const inclusions = [
    "Access to all sessions",
    "Conference materials",
    "Certificate",
    "Meals during the event",
  ];

  const importantDates = [
    { icon: <FaRegPaperPlane />, title: "Opening of Abstract Submission and Registration", date: "November 16, 2026" },
    { icon: <FaRegFileAlt />, title: "Abstract Submission Deadline", date: "January 20, 2027" },
    { icon: <FaRegCheckCircle />, title: "Notification of Acceptance", date: "January 25, 2027" },
    { icon: <FaRegUser />, title: "Final Registration and Payment Deadline", date: "February 06, 2027" },
    { icon: <FaRegCalendarAlt />, title: "Submission of Full Papers", date: "Subject to confirmation of publication number" },
    { icon: <FaRegFileAlt />, title: "Release of Final Scientific Program", date: "February 26, 2027" },
  ];

  const workflowSteps = [
    { id: 1, icon: <FaLaptop />, title: "Abstract Submission", desc: "Author submits the abstract through the online submission portal." },
    { id: 2, icon: <FaSearch />, title: "Review & Evaluation", desc: "Scientific Committee/Reviewers evaluate the abstract based on the criteria." },
    { id: 3, icon: <FaEnvelopeOpenText />, title: "Decision", desc: "Abstract is accepted, accepted with revisions, or not accepted." },
    { id: 4, icon: <FaEnvelope />, title: "Notice of Acceptance", desc: "Official Notice of Acceptance is sent to the corresponding author via email." },
    { id: 5, icon: <FaUserCheck />, title: "Presenter Registration", desc: "At least one author of the accepted abstract registers within the prescribed registration period through the online registration platform." },
    { id: 6, icon: <FaCreditCard />, title: "Payment", desc: "Payment of the registration fee. through the available payment channels. Upload proof of payment in the portal." },
    { id: 7, icon: <FaCheckDouble />, title: "Confirmation", desc: "Registration is verified and confirmed. A confirmation email with receipt is sent." },
    { id: 8, icon: <FaUsersCog />, title: "Inclusion in Final Program", desc: "The abstract is included in the final scientific program after registration is confirmed." },
    { id: 9, icon: <FaBookOpen />, title: "Processing of Papers for Journal Publication", desc: "Selected and eligible full papers may be endorsed to the Annals of Tropical Research (ATR), the symposium's partner journal, for possible publication, subject to the journal's submission guidelines, peer-review process, and editorial approval." },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-[#F8FBF5] to-white font-sans text-[#0A2540] flex flex-col overflow-x-hidden">
      <ScrollProgressBar />

      <style jsx global>{`
      @keyframes timelinePulse {
        0% { transform: scale(1); background-color: #F2F9FF; border-color: #ffffff; color: #1D3D6D; box-shadow: none; }
        2% { transform: scale(1.14); background-color: #E9F5E1; border-color: #76B947; color: #1b5e20; box-shadow: 0 0 0 6px rgba(118,185,71,0.16), 0 8px 20px -8px rgba(118,185,71,0.55); }
        11% { transform: scale(1.14); background-color: #E9F5E1; border-color: #76B947; color: #1b5e20; box-shadow: 0 0 0 6px rgba(118,185,71,0.16), 0 8px 20px -8px rgba(118,185,71,0.55); }
        13% { transform: scale(1); background-color: #F2F9FF; border-color: #ffffff; color: #1D3D6D; box-shadow: none; }
        100% { transform: scale(1); background-color: #F2F9FF; border-color: #ffffff; color: #1D3D6D; box-shadow: none; }
      }

      .timeline-icon.animate-step { animation: timelinePulse 4.8s linear infinite; }

      .dates-timeline .timeline-item:nth-child(1) .timeline-icon.animate-step { animation-delay: 0s; animation-duration: 4.8s; }
      .dates-timeline .timeline-item:nth-child(2) .timeline-icon.animate-step { animation-delay: 0.8s; animation-duration: 4.8s; }
      .dates-timeline .timeline-item:nth-child(3) .timeline-icon.animate-step { animation-delay: 1.6s; animation-duration: 4.8s; }
      .dates-timeline .timeline-item:nth-child(4) .timeline-icon.animate-step { animation-delay: 2.4s; animation-duration: 4.8s; }
      .dates-timeline .timeline-item:nth-child(5) .timeline-icon.animate-step { animation-delay: 3.2s; animation-duration: 4.8s; }
      .dates-timeline .timeline-item:nth-child(6) .timeline-icon.animate-step { animation-delay: 4.0s; animation-duration: 4.8s; }
      
      .workflow-timeline .timeline-item:nth-child(1) .timeline-icon.animate-step { animation-delay: 0s; animation-duration: 8s; }
      .workflow-timeline .timeline-item:nth-child(2) .timeline-icon.animate-step { animation-delay: 1s; animation-duration: 8s; }
      .workflow-timeline .timeline-item:nth-child(3) .timeline-icon.animate-step { animation-delay: 2s; animation-duration: 8s; }
      .workflow-timeline .timeline-item:nth-child(4) .timeline-icon.animate-step { animation-delay: 3s; animation-duration: 8s; }
      .workflow-timeline .timeline-item:nth-child(5) .timeline-icon.animate-step { animation-delay: 4s; animation-duration: 8s; }
      .workflow-timeline .timeline-item:nth-child(6) .timeline-icon.animate-step { animation-delay: 5s; animation-duration: 8s; }
      .workflow-timeline .timeline-item:nth-child(7) .timeline-icon.animate-step { animation-delay: 6s; animation-duration: 8s; }
      .workflow-timeline .timeline-item:nth-child(8) .timeline-icon.animate-step { animation-delay: 7s; animation-duration: 8s; }

      .timeline-item:hover .timeline-icon.animate-step { animation-play-state: paused; }

      @media (prefers-reduced-motion: reduce) { .timeline-icon.animate-step { animation: none !important; } }

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
          background-image: linear-gradient(90deg, #76B947, #F0C674, #D5A54D);
          background-size: 200% 100%;
          animation: shimmerLine 4s linear infinite;
        }

        .premium-card {
          position: relative;
          isolation: isolate;
          background: linear-gradient(180deg, #ffffff 0%, #fbfcfe 100%);
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.55s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.4s ease;
          box-shadow: 0 1px 2px rgba(11, 42, 74, 0.04), 0 8px 20px -12px rgba(11, 42, 74, 0.10);
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
        .premium-card:hover {
          transform: translateY(-10px);
          border-color: rgba(118, 185, 71, 0.35);
          box-shadow: 0 2px 4px rgba(11, 42, 74, 0.05), 0 12px 24px -10px rgba(11, 42, 74, 0.16), 0 32px 60px -20px rgba(11, 42, 74, 0.22), 0 0 0 1px rgba(118, 185, 71, 0.05);
        }
        .premium-card:hover::before {
          background: linear-gradient(135deg, rgba(118,185,71,0.9) 0%, rgba(213,165,77,0.5) 50%, rgba(76,195,247,0.9) 100%);
        }

        .premium-icon {
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease;
        }
        .premium-card:hover .premium-icon {
          transform: scale(1.08) rotate(-6deg);
          box-shadow: 0 0 0 6px rgba(76,195,247,0.12), 0 8px 20px -8px rgba(76,195,247,0.45);
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

        .timeline-item {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .timeline-item:hover {
          transform: translateX(6px);
        }
        .timeline-item .timeline-icon {
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease, background-color 0.5s ease, color 0.4s ease;
        }
        .timeline-item:hover .timeline-icon {
          transform: scale(1.12) rotate(-6deg);
          background-color: #E9F5E1;
          color: #1b5e20;
          box-shadow: 0 0 0 6px rgba(118,185,71,0.12), 0 8px 20px -8px rgba(118,185,71,0.45);
        }

        .pay-row {
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .pay-row:hover {
          background-color: rgba(118, 185, 71, 0.08);
        }

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
          color: #76B947;
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

      {/* PAGE HERO */}
      <section
        ref={heroScroll.ref}
        className={`relative bg-white overflow-hidden border-b border-zinc-100 ${heroReveal.inView ? "in-view" : ""}`}
      >
        <div
          aria-hidden
          className="absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-[#76B947]/10 to-transparent rounded-full blur-3xl -translate-y-1/3 -translate-x-1/4 pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-0 left-1/3 w-72 h-72 bg-linear-to-tr from-[#4FC3F7]/10 to-transparent rounded-full blur-3xl translate-y-1/4 pointer-events-none"
        />
        <div
          className="hidden md:block absolute top-1/2 right-8 w-[45%] pointer-events-none z-10"
          style={{ transform: `translateY(calc(-50% + ${(heroScroll.progress - 0.5) * -30}px))` }}
        >
          <Image
            src="https://res.cloudinary.com/xbloqjom/image/upload/v1794368626/illustration2.png"
            alt="Registration Illustration"
            width={2200}
            height={500}
            className="w-full h-auto object-contain opacity-60"
            priority
          />
        </div>

        <div
          ref={heroReveal.ref} className="max-w-350 mx-auto px-8 py-16 relative z-20">
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold text-[#0A2540] mb-4 reveal-up stagger-1">
              Registration
            </h1>
            <div className="w-16 h-1 gold-underline mb-6 reveal-up stagger-2 rounded-full"></div>
            <p className="text-lg text-zinc-600 leading-relaxed reveal-up stagger-3">
              Join researchers, innovators, and professionals from around the world and be part of the 3rd International Agri-Life & Bioresource Sciences Symposium 2026.
            </p>
          </div>
        </div>
      </section>

      {/* IMPORTANT DATES & WORKFLOW */}
      <section ref={infoReveal.ref} className={`bg-white py-16 border-b border-zinc-100 relative overflow-hidden ${infoReveal.inView ? "in-view" : ""}`}>
        <div aria-hidden className="pointer-events-none absolute top-0 left-0 h-56 w-56 rounded-full bg-[#F0C674]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[#4FC3F7]/10 blur-3xl" />
        
        {/* 2-Column Grid for larger sections */}
        <div className="relative max-w-350 mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Important Dates */}
          <div className="reveal-up stagger-1 flex flex-col h-full">
            <div className="bg-linear-to-r from-[#0B2A4A] to-[#1D3D6D] text-white p-5 flex items-center gap-3 rounded-t-xl shrink-0 bg-clip-padding">
              <FaRegCalendarAlt className="text-xl" />
              <h2 className="text-lg font-bold uppercase">Important Dates</h2>
            </div>

            <div className="premium-card bg-white border border-t-0 border-zinc-200 rounded-b-xl p-6 relative flex-1">
              <div className="absolute left-10.75 top-12 bottom-12 w-0.5 bg-zinc-200"></div>

              <div className="space-y-6 relative dates-timeline">
                {importantDates.map((date, idx) => (
                  <div key={idx} className={`timeline-item flex gap-4 relative reveal-up stagger-${(idx % 6) + 1}`}>
                    <div className="timeline-icon animate-step w-10 h-10 rounded-full bg-[#F2F9FF] border-2 border-white text-[#1D3D6D] flex items-center justify-center text-lg shrink-0 relative z-10">
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

          {/* Submission & Registration Workflow */}
          <div className="reveal-up stagger-2 flex flex-col h-full">
            <div className="bg-linear-to-r from-[#0B2A4A] to-[#1D3D6D] text-white p-5 flex items-center gap-3 rounded-t-xl shrink-0 bg-clip-padding">
              <FaBullseye className="text-xl" />
              <h2 className="text-lg font-bold uppercase leading-tight">Submission & Registration Workflow</h2>
            </div>

            <div className="premium-card bg-white border border-t-0 border-zinc-200 rounded-b-xl relative flex-1 overflow-hidden">
              
              <div className="absolute inset-0 p-6 flex flex-col">
                <style dangerouslySetInnerHTML={{__html: `
                  .workflow-scroll::-webkit-scrollbar { width: 6px; }
                  .workflow-scroll::-webkit-scrollbar-track { background: #f4f4f5; border-radius: 8px; }
                  .workflow-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
                  .workflow-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                `}} />

                <div className="workflow-scroll overflow-y-auto px-3 py-2 -mx-3 h-full relative">
                  
                  <div className="space-y-2 relative workflow-timeline">
                    {workflowSteps.map((step, idx) => {
                      const isLast = idx === workflowSteps.length - 1;
                      return (
                        <div key={step.id} className={`timeline-item flex gap-4 relative reveal-up stagger-${(idx % 6) + 1} pb-4`}>
                          <div className="w-10 flex flex-col items-center shrink-0 relative z-10">
                            {/* Top connector line */}
                            <div className={`w-0.5 bg-zinc-200 ${idx === 0 ? 'h-0' : 'h-2 -mt-2 mb-1'}`}></div>
                            
                            {/* Icon Circle - Fixed to render step.icon instead of step.id */}
                            <div className="timeline-icon animate-step w-10 h-10 rounded-full bg-[#F2F9FF] border-2 border-white text-[#1D3D6D] flex items-center justify-center text-lg shrink-0 font-bold">
                              {step.icon}
                            </div>

                            {/* Bottom connector line */}
                            {!isLast && (
                              <div className="w-0.5 bg-zinc-200 flex-1 mt-1 -mb-4"></div>
                            )}
                          </div>

                          <div className="pt-1 flex-1">
                            <p className="font-semibold text-[#0A2540] text-sm mb-0.5">{step.title}</p>
                            <p className="text-xs text-zinc-500 leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}

                    {/* Not Accepted Branch */}
                    <div className="relative pt-2 pb-4 mt-2">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 items-start">
                        <FaTimesCircle className="text-red-500 mt-0.5 shrink-0 text-lg" />
                        <div>
                          <p className="font-bold text-red-700 text-xs uppercase tracking-wider mb-1">Not Accepted</p>
                          <p className="text-xs text-red-600/80 leading-relaxed">Author is informed of the decision via email.</p>
                        </div>
                      </div>
                    </div>

                    {/* Important Notes */}
                    <div className="pt-2 pb-2">
                      <div className="bg-[#FEF9E7] border border-[#F0C674] rounded-lg p-4 flex gap-3 items-start">
                        <FaClipboardList className="text-[#D5A54D] mt-0.5 shrink-0 text-lg" />
                        <div>
                          <p className="font-bold text-[#0A2540] text-xs uppercase tracking-wider mb-2">Important Notes</p>
                          <ul className="text-[11px] text-zinc-600 space-y-1.5 list-disc pl-3 marker:text-[#D5A54D]">
                            <li>Registration is required for accepted presenters within the prescribed registration period.</li>
                            <li>At least one author of each accepted abstract must register.</li>
                            <li>Only registered presenters will be included in the final scientific program.</li>
                            <li>Acceptance for symposium presentation does not guarantee journal publication. All endorsed manuscripts must undergo the journal's independent evaluation and peer-review process.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* == REGISTRATION FEES + PAYMENT ACCOUNT == */}
      <section ref={feesScroll.ref} className="py-16 relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[70%] rounded-full bg-[#4FC3F7]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#76B947]/10 blur-3xl" />

        <div
          ref={feesReveal.ref}
          className={`relative max-w-350 mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch ${feesReveal.inView ? "in-view" : ""}`}
        >
          {/* Registration Fees Card */}
          <div className="w-full reveal-up stagger-1 flex flex-col h-full">
            <div className="bg-linear-to-r from-[#0B2A4A] to-[#1D3D6D] text-white p-5 flex items-center gap-3 rounded-t-xl shrink-0">
              <FaRegListAlt className="text-xl" />
              <h2 className="text-lg font-bold uppercase tracking-wide">Registration Fees</h2>
            </div>

            <div className="premium-card bg-white border border-t-0 border-zinc-200 rounded-b-xl p-8 flex-1 flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-start">
                <div>
                  <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">Registration Fee</h3>
                  <p className="text-4xl font-extrabold text-[#0A2540] mb-6">₱ 6,000.00</p>

                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Who can register:</h3>
                  <ul className="space-y-3">
                    {fees.map((fee, idx) => (
                      <li key={idx} className={`fee-item flex items-center gap-3 text-zinc-700 reveal-up stagger-${(idx % 6) + 1}`}>
                        <div className="w-7 h-7 rounded-full bg-[#F2F9FF] flex items-center justify-center text-[#1D3D6D] shrink-0 text-xs">
                          {fee.icon}
                        </div>
                        <span className="text-xs font-medium">{fee.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:pt-23">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">What's Included:</h3>
                  <div className="bg-[#F8FBF5] rounded-xl border border-[#76B947]/20 p-4">
                    <ul className="space-y-3">
                      {inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-zinc-700">
                          <FaCheckCircle className="text-[#76B947] mt-0.5 shrink-0 text-sm" />
                          <span className="font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Paying Registration Account Card (beside fees) */}
          <div className="w-full reveal-up stagger-2 flex flex-col h-full">
            <div className="bg-linear-to-r from-[#0B2A4A] to-[#1D3D6D] text-white p-5 flex items-center gap-3 rounded-t-xl shrink-0">
              <FaRegListAlt className="text-xl" />
              <h2 className="text-lg font-bold uppercase">Paying Registration Account</h2>
            </div>

            <div className="premium-card bg-white border border-t-0 border-zinc-200 rounded-b-xl p-8 flex-1 flex flex-col">
              {/* Account details */}
              <div className="grid grid-cols-[130px_1fr] gap-x-4 gap-y-3 text-sm mb-6">
                <span className="font-bold text-[#0A2540] whitespace-nowrap">Account Name</span>
                <span className="text-zinc-600">To be announced</span>

                <span className="font-bold text-[#0A2540] whitespace-nowrap">Bank Name</span>
                <span className="text-zinc-600">To be announced</span>

                <span className="font-bold text-[#0A2540] whitespace-nowrap">Account Number</span>
                <span className="text-zinc-600">To be announced</span>

                <span className="font-bold text-[#0A2540] whitespace-nowrap">Account Type</span>
                <span className="text-zinc-600">To be announced</span>

                <span className="font-bold text-[#0A2540] whitespace-nowrap">SWIFT/BIC</span>
                <span className="text-zinc-600">To be announced</span>
              </div>

              {/* Building logo — restored, centered divider */}
              <div className="flex items-center gap-4 my-2">
                <div className="flex-1 h-px bg-linear-to-r from-transparent via-zinc-200 to-zinc-200" />
                <FaUniversity className="text-[#1D3D6D] text-5xl drop-shadow-sm shrink-0" aria-hidden />
                <div className="flex-1 h-px bg-linear-to-l from-transparent via-zinc-200 to-zinc-200" />
              </div>

              {/* Upload note */}
              <div className="bg-[#F2F9FF] border border-[#4FC3F7]/30 rounded-lg p-6 mt-auto">
                <div className="flex items-start gap-3">
                  <FaRegFileAlt className="text-[#1D3D6D] mt-1 text-xl shrink-0" />
                  <div>
                    <p className="font-bold text-[#0A2540] text-sm mb-2">Please upload your proof of payment</p>
                    <div className="text-xs text-zinc-600 space-y-1">
                      <p>Email: <span className="font-semibold text-[#0A2540] break-all">internationalsymposium@capsu.edu.ph</span></p>
                      <p>Subject: <span className="font-semibold text-[#0A2540]">IC2025 Payment – [Your Name]</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* == BOTTOM CTA == */}
      <section ref={ctaReveal.ref} className={`py-16 relative overflow-hidden ${ctaReveal.inView ? "in-view" : ""}`}>
        <div aria-hidden className="pointer-events-none absolute top-0 left-0 h-40 w-40 rounded-full bg-[#F0C674]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full bg-[#4FC3F7]/10 blur-3xl" />
        <div className="relative max-w-350 mx-auto px-8">
          <div className="premium-card reveal-up bg-white rounded-xl border border-zinc-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="premium-icon w-16 h-16 bg-[#F2F9FF] rounded-full flex items-center justify-center ring-1 ring-[#4FC3F7]/30">
                <FaPaperPlane className="text-[#1D3D6D] text-3xl rotate-[-20deg]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0A2540] mb-1">Be Part of Global Discussions</h3>
                <p className="text-zinc-500">
                  Secure your slot today and join us in shaping a sustainable future through research, innovation, and collaboration.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDevModal(true)}
              className="premium-btn bg-linear-to-r from-[#0A5C0A] to-[#0d6b0d] text-white px-8 py-4 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 shrink-0 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Register Now <FaChevronRight />
            </button>
          </div>
        </div>
      </section>

      {/* 🔁 Modal */}
      <UnderDevelopment
        open={showDevModal}
        onClose={() => setShowDevModal(false)}
        title="Registration Form Coming Soon"
        description="The online registration portal is currently under development and will open soon."
        notes={[
          "Online registration will open on November 16, 2026.",
          "Early bird payment deadline: January 10, 2027.",
          "Final registration and payment deadline: February 06, 2027.",
        ]}
        contactEmail="internationalsymposium@capsu.edu.ph"
        zIndex={9999}
      />


      <Footer />
    </div>
  );
}