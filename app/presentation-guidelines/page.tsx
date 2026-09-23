"use client";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect, useRef } from "react";
import { 
  FaFileAlt, FaCheckCircle, FaClock, FaUsers, FaLaptop, 
  FaMicrophone, FaDownload, FaPrint, FaBookOpen, FaFilePowerpoint, 
  FaImage, FaRuler, FaPalette, FaShareAlt, FaEnvelope, FaUserGraduate, FaUniversity 
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

export default function PresentationGuidelinesPage() {
  // Reveal hooks
  const heroReveal = useInView<HTMLDivElement>();
  const oralReveal = useInView<HTMLDivElement>();
  const paperReveal = useInView<HTMLDivElement>();
  const posterReveal = useInView<HTMLDivElement>();
  const contactReveal = useInView<HTMLDivElement>();
  const downloadReveal = useInView<HTMLDivElement>();

  // Scroll progress hooks
  const heroScroll = useScrollProgress<HTMLElement>();
  const oralScroll = useScrollProgress<HTMLElement>();
  const posterScroll = useScrollProgress<HTMLElement>();

  const oralGuidelines = [
    { title: "Talk Duration", description: "Each talk is allocated 10 minutes for presentation plus 5 minutes for Q&A, making 15 minutes total.", icon: <FaClock /> },
    { title: "Language", description: "All talks must be presented in English.", icon: <FaMicrophone /> },
    { title: "Slide Management", description: "Average of about one slide per minute. Complicated slides take longer.", icon: <FaFilePowerpoint /> },
    { title: "File Submission", description: "Submit PowerPoint presentations at the registration desk upon check-in. Label your USB with your name.", icon: <FaFileAlt /> },
    { title: "Compatibility Check", description: "Test your presentation at least 15 minutes before your session. If using Mac, ensure PC compatibility.", icon: <FaLaptop /> },
    { title: "Arrival Time", description: "Arrive at assigned rooms 30 minutes before the session starts. Introduce yourself to the chairperson.", icon: <FaUsers /> }
  ];

  const posterGuidelines = [
    { title: "Poster Size", description: "36 inches (width) × 48 inches (height) - Portrait orientation only.", icon: <FaRuler /> },
    { title: "Font Requirements", description: "Title: 72pt bold uppercase | Authors: 48pt | Headings: 36pt | Body: 24pt | Font: Arial", icon: <FaFileAlt /> },
    { title: "Color and Design", description: "Use high-contrast colors for readability. Avoid overly bright or dark backgrounds.", icon: <FaPalette /> },
    { title: "Required Sections", description: "Title, Authors/Affiliations, Abstract (max 300 words), Introduction, Methodology, Results/Discussion, Conclusion, References.", icon: <FaBookOpen /> },
    { title: "Setup Time", description: "Mount your poster 1 hour before the presentation on allocated boards.", icon: <FaClock /> },
    { title: "Poster Removal", description: "Remove your poster on the last afternoon. Posters left after will not be the responsibility of organizers.", icon: <FaPrint /> },
    { title: "Be Present", description: "Stand by your poster during sessions to answer questions and discuss your work.", icon: <FaUsers /> },
    { title: "Extra Copies", description: "Print 15-20 copies of your poster on bond paper to place beside your mounted poster.", icon: <FaShareAlt /> }
  ];

  const fullPaperStructure = [
    { page: "Page 1", content: "Complete authors' and/or co-authors name, designation, agency/institutional affiliation, mailing addresses, email addresses" },
    { page: "Page 2", content: "Title of Article\nAbstract (at most 200 words in one paragraph)\nKey words (at least two)" },
    { page: "Page 3 onwards", content: "INTRODUCTION (with clearly specified objectives)\nMATERIALS AND METHODS\nRESULTS AND DISCUSSIONS\nCONCLUSIONS AND RECOMMENDATIONS\nACKNOWLEDGMENT (if any)\nREFERENCES" }
  ];

  const posterContent = [
    "Title – Concise and reflective of the study focus",
    "Authors and Affiliations – Full names, institutions, and email addresses",
    "Abstract – Maximum of 300 words",
    "Introduction – Background, problem statement, and objectives",
    "Methodology – Materials, methods, procedures (diagrams encouraged)",
    "Results and Discussion – Key findings with tables, figures, or graphs",
    "Conclusion and Recommendations – Summary and future directions",
    "References – Key references (APA style recommended)",
    "Acknowledgments (Optional) – Funding sources and contributors"
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0A2540] overflow-x-hidden">
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

        .guideline-item {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .guideline-item:hover {
          transform: translateX(6px);
        }
        .guideline-item svg {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .guideline-item:hover svg {
          transform: scale(1.15) rotate(8deg);
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
          className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-[#D5A54D]/8 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none"
        />

        {/* Floating image — subtle scroll parallax */}
        <div
          className="hidden md:block absolute top-1/2 right-40 w-125 pointer-events-none z-20"
          style={{ transform: `translateY(calc(-50% + ${(heroScroll.progress - 0.5) * -30}px))` }}
        >
          <Image
            src="/images/guideline.png"
            alt="Presentation Guidelines"
            width={500}
            height={300}
            priority
            className="w-full max-w-none h-auto object-contain"
          />
        </div>

        <div
          ref={heroReveal.ref}
          className="max-w-7xl mx-auto px-6 py-16 relative z-10"
        >
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6 reveal-up">
            <Link href="/" className="hover:text-[#F5A623] transition-colors">
              Home
            </Link>
            <span className="text-zinc-300">›</span>
            <span className="text-[#0A2540] font-medium">Presentation Guidelines</span>
          </div>

          <div className="relative z-10">
            <h1 className="text-5xl font-bold text-[#0A2540] mb-4 reveal-up stagger-1">
              Presentation Guidelines
            </h1>
            <div className="w-16 h-1 gold-underline mb-4 reveal-up stagger-2 rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-2xl leading-relaxed reveal-up stagger-3">
              3rd International Agri-Life and Bioresource Sciences Symposium
            </p>
            <p className="text-sm text-gray-500 mt-1 reveal-up stagger-4">
              March 10-13, 2027 | Roxas City, Capiz, Philippines – The Seafood Capital of the Philippines
            </p>
          </div>
        </div>
      </section>

      {/* ================= GUIDELINES FOR ORAL PRESENTATION ================= */}
      <section ref={oralScroll.ref} className="py-16">
        <div
          ref={oralReveal.ref}
          className={`max-w-7xl mx-auto px-6 ${oralReveal.inView ? "in-view" : ""}`}
        >
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4 reveal-up">
              <FaMicrophone className="text-[#D5A54D] text-3xl" />
              <h2 className="text-3xl font-bold text-[#0A2540]">Guidelines for Oral Presentation</h2>
            </div>
            <div className="w-16 h-1 gold-underline mb-4 reveal-up stagger-1 rounded-full"></div>
            <p className="text-gray-600 reveal-up stagger-2">
              If your presentation has already been accepted, please find the appropriate sections below on how to prepare it, and read them carefully.
            </p>
          </div>

          {/* Oral Guidelines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {oralGuidelines.map((item, idx) => (
              <div
                key={idx}
                className={`premium-card scroll-lift bg-white rounded-xl border border-zinc-100 p-6 reveal-up stagger-${(idx % 6) + 1}`}
                style={{ ["--scroll-y" as any]: `${(1 - oralScroll.progress) * (20 - idx * 2)}px` }}
              >
                <div className="flex items-start gap-4">
                  <div className="premium-icon w-12 h-12 rounded-full bg-[#F0F6FF] flex items-center justify-center text-[#D5A54D] text-xl shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0A2540] text-sm mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Audiovisual Aids Section */}
          <div className="premium-card reveal-up bg-[#F8FAFC] rounded-xl border border-zinc-200 p-6 mb-12">
            <h3 className="font-bold text-[#0A2540] text-lg mb-3">Audiovisual Aids</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              {[
                "Speakers should hand over their PowerPoint presentation at the registration desk when they first check in to the conference so that it can be loaded onto our computer's hard disk.",
                "Please label your memory stick with your name.",
                "Run through your presentation in advance (at least 15 minutes before your oral presentations) to ensure compatibility with local hardware and software.",
                "If you have prepared your PowerPoint presentation on an Apple Macintosh computer, we strongly advise you to check that it works correctly on a PC before coming to the conference.",
                "All speakers should arrive at the assigned rooms 30 minutes prior to the start of their session."
              ].map((text, i) => (
                <li key={i} className="guideline-item flex items-start gap-3">
                  <FaCheckCircle className="text-[#D5A54D] mt-1 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================= FULL PAPER SUBMISSIONS ================= */}
      <section ref={paperReveal.ref} className={`py-16 bg-linear-to-r from-[#0A2540] to-[#1a3a5c] relative overflow-hidden ${paperReveal.inView ? "in-view" : ""}`}>
        <div
          aria-hidden
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 20%, rgba(213,165,77,0.18) 0%, rgba(0,0,0,0) 70%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4 reveal-up">
              <FaFileAlt className="text-[#D5A54D] text-3xl" />
              <h2 className="text-3xl font-bold text-white">Full Paper Submissions</h2>
            </div>
            <div className="w-16 h-1 gold-underline mx-auto reveal-up stagger-1 rounded-full"></div>
            <p className="text-gray-300 mt-4 reveal-up stagger-2">
              Presenters accepted for Oral Presentation are requested to submit their full manuscript to be considered for publication in the Special Issue.
            </p>
          </div>

          <div className="premium-card reveal-up stagger-3 bg-white rounded-xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-12 bg-[#0A2540] text-white px-6 py-4">
              <div className="col-span-3 font-bold uppercase text-sm">Page</div>
              <div className="col-span-9 font-bold uppercase text-sm">Content</div>
            </div>

            {fullPaperStructure.map((item, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-12 px-6 py-4 border-b border-zinc-100 last:border-b-0 transition-colors duration-300 hover:bg-[rgba(213,165,77,0.06)] ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'
                }`}
              >
                <div className="col-span-3">
                  <span className="font-bold text-[#0A2540]">{item.page}</span>
                </div>
                <div className="col-span-9">
                  <span className="text-sm text-gray-700 whitespace-pre-line">{item.content}</span>
                </div>
              </div>
            ))}

            <div className="bg-gray-50 px-6 py-4 border-t border-zinc-200">
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Formatting:</strong> Double-spaced on A4 (210 x 297 mm) paper size, with margins of 2.54 cm on all sides.</p>
                <p><strong>Font:</strong> 12 points Times New Roman.</p>
                <p><strong>Spacing:</strong> Sentences separated by one character space. Paragraphs separated by three (3) line spaces.</p>
                <p><strong>Figures & Tables:</strong> Integrated in the flow of discussion. Mentioned separately in numerical sequence.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= GUIDELINES FOR POSTER PRESENTORS ================= */}
      <section ref={posterScroll.ref} className="py-16">
        <div
          ref={posterReveal.ref}
          className={`max-w-7xl mx-auto px-6 ${posterReveal.inView ? "in-view" : ""}`}
        >
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4 reveal-up">
              <FaImage className="text-[#D5A54D] text-3xl" />
              <h2 className="text-3xl font-bold text-[#0A2540]">Guidelines for Poster Presenters</h2>
            </div>
            <div className="w-16 h-1 gold-underline mb-4 reveal-up stagger-1 rounded-full"></div>
            <p className="text-gray-600 reveal-up stagger-2">
              The Poster Presentation Category provides participants with an opportunity to communicate their research in a concise, visually engaging, and interactive format.
            </p>
          </div>

          {/* Poster Format and Layout */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-[#0A2540] mb-4 reveal-up">A. Poster Format and Layout</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { icon: <FaRuler />, label: "Poster Size", value: "36\" × 48\" (Portrait)" },
                { icon: <FaFileAlt />, label: "Font", value: "Arial, Multiple Sizes" },
                { icon: <FaPalette />, label: "Design", value: "High Contrast Colors" },
                { icon: <FaClock />, label: "Setup", value: "1 Hour Before Session" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`premium-card scroll-lift bg-white rounded-xl border border-zinc-100 p-4 text-center reveal-up stagger-${idx + 1}`}
                  style={{ ["--scroll-y" as any]: `${(1 - posterScroll.progress) * (20 - idx * 3)}px` }}
                >
                  <div className="premium-icon w-14 h-14 mx-auto mb-2 rounded-full bg-[#F0F6FF] flex items-center justify-center text-[#D5A54D] text-2xl">
                    {item.icon}
                  </div>
                  <p className="font-bold text-[#0A2540]">{item.label}</p>
                  <p className="text-sm text-gray-600">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="premium-card reveal-up bg-[#F8FAFC] rounded-xl border border-zinc-200 p-6 mb-6">
              <h4 className="font-bold text-[#0A2540] mb-2">Font Requirements</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <strong>Title:</strong> At least 72 pt, bold, uppercase</li>
                <li>• <strong>Author(s):</strong> At least 48 pt (include affiliation and email address)</li>
                <li>• <strong>Section Headings:</strong> At least 36 pt</li>
                <li>• <strong>Body Text:</strong> At least 24 pt</li>
                <li>• <strong>Font Style:</strong> Arial</li>
              </ul>
            </div>
          </div>

          {/* Poster Content */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-[#0A2540] mb-4 reveal-up">B. Poster Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posterContent.map((item, idx) => (
                <div
                  key={idx}
                  className={`premium-card bg-white rounded-xl border border-zinc-100 p-4 reveal-up stagger-${(idx % 6) + 1}`}
                >
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-[#D5A54D] mt-1 shrink-0 transition-transform duration-300 group-hover:scale-125" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Display Requirements */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-[#0A2540] mb-4 reveal-up">C. Display Requirements</h3>
            <div className="premium-card reveal-up bg-[#F8FAFC] rounded-xl border border-zinc-200 p-6">
              <ul className="space-y-3 text-gray-600 text-sm">
                {[
                  { icon: <FaPrint />, text: <><strong>Bring a printed poster</strong> for on-site display</> },
                  { icon: <FaClock />, text: <><strong>Mount the poster</strong> 1 hour before the presentation</> },
                  { icon: <FaUserGraduate />, text: <><strong>Include a picture</strong> of yourself so attendees can easily find you</> },
                  { icon: <FaUniversity />, text: <><strong>Include collaborators' names</strong> and logos of funders or host institution</> },
                  { icon: <FaShareAlt />, text: <><strong>Share your poster</strong> on social media with #3rdIALSS</> },
                  { icon: <FaPrint />, text: <><strong>Print 15-20 copies</strong> of your poster on bond paper to place beside your mounted poster</> },
                ].map((item, i) => (
                  <li key={i} className="guideline-item flex items-start gap-3">
                    <span className="text-[#D5A54D] mt-1 shrink-0">{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tips Section */}
          <div className="premium-card reveal-up bg-[#D5A54D]/10 rounded-xl border border-[#D5A54D]/40 p-6">
            <h4 className="font-bold text-[#0A2540] text-lg mb-2">💡 Pro Tips</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Consider including a picture of yourself (maybe in the field) so attendees can find you easily.</li>
              <li>• Don't forget to include names of collaborators and logos of funders or your host institution.</li>
              <li>• Include a web or email address, or a sign-up sheet for people to leave their email address.</li>
              <li>• Upload your poster to SlideShare and share on social media with #3rdIALSS.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section ref={contactReveal.ref} className={`py-16 bg-white border-t border-zinc-100 ${contactReveal.inView ? "in-view" : ""}`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-[#0A2540] mb-4 reveal-up">For Additional Concerns</h2>
          <div className="w-16 h-1 gold-underline mx-auto mb-6 reveal-up stagger-1 rounded-full"></div>
          <p className="text-gray-600 mb-4 reveal-up stagger-2">Please contact us through:</p>
          <div className="premium-card inline-flex items-center gap-3 bg-[#F8FAFC] rounded-lg px-6 py-3 border border-zinc-200 reveal-up stagger-3">
            <FaEnvelope className="text-[#D5A54D] text-xl" />
            <span className="text-[#0A2540] font-medium">internationalsymposium@capsu.edu.ph</span>
          </div>
        </div>
      </section>

      {/* ================= DOWNLOAD GUIDELINES ================= */}
      <section ref={downloadReveal.ref} className={`py-16 bg-linear-to-r from-[#0A2540] to-[#1a3a5c] ${downloadReveal.inView ? "in-view" : ""}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="premium-card reveal-up bg-white rounded-2xl p-8 md:p-12 text-center shadow-xl">
            <h2 className="text-2xl font-bold text-[#0A2540] mb-4">Download Complete Guidelines</h2>
            <p className="text-gray-600 mb-6">
              Get the full presentation guidelines document in PDF format.
            </p>

            <Link
              href="/documents/presentation-guidelines.pdf"
              download
              className="premium-btn inline-flex items-center gap-3 bg-linear-to-r from-[#D5A54D] to-[#F0C674] text-[#0A2540] px-8 py-4 rounded-lg font-bold transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
            >
              <FaDownload className="text-lg" />
              Download Presentation Guidelines (PDF)
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}