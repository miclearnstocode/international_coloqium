"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaRegPaperPlane, 
  FaCheckCircle, FaArrowRight, FaUser, FaBuilding, 
  FaGlobe, FaTag, FaComment, FaShieldAlt,
  FaUsers, FaHandshake, FaUniversity, FaRegBuilding,
  FaClipboardList, FaMoneyBillWave, FaTruck, FaPlane,
  FaCalendarAlt, FaFileAlt, FaMicrophone, FaQrcode,
  FaClock, FaInfoCircle, FaUserFriends, FaRegEnvelope
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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    institution: '',
    country: '',
    inquiryType: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reveal hooks
  const heroReveal = useInView<HTMLDivElement>();
  const introReveal = useInView<HTMLDivElement>();
  const helpReveal = useInView<HTMLDivElement>();
  const formReveal = useInView<HTMLDivElement>();

  // Scroll progress hooks
  const heroScroll = useScrollProgress<HTMLElement>();
  const helpScroll = useScrollProgress<HTMLElement>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        institution: '',
        country: '',
        inquiryType: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  const countries = [
    "Select your country", "Philippines", "Japan", "United States", "United Kingdom",
    "Australia", "Canada", "Germany", "France", "Italy", "Spain", "South Korea",
    "China", "India", "Indonesia", "Malaysia", "Thailand", "Vietnam", "Singapore",
    "New Zealand", "Netherlands", "Sweden", "Norway", "Denmark", "Switzerland",
    "Belgium", "Austria", "Greece", "Portugal", "Ireland", "Brazil", "Mexico",
    "South Africa", "Egypt", "Saudi Arabia", "United Arab Emirates", "Qatar",
    "Kuwait", "Oman", "Bahrain", "Other"
  ];

  const inquiryTypes = [
    "Select inquiry type", "General Inquiry", "Abstract Submission", "Scientific Tracks",
    "Oral Presentation", "Poster Presentation", "Registration", "Payment",
    "International Delegate Assistance", "Venue & Travel", "Accommodation",
    "Partnership / Sponsorship", "Technical Support", "Other"
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

        /* ===== Form input premium focus ===== */
        .premium-input {
          transition: border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
        }
        .premium-input:hover {
          border-color: rgba(213, 165, 77, 0.35);
        }
        .premium-input:focus {
          border-color: #D5A54D;
          box-shadow: 0 0 0 4px rgba(213,165,77,0.12);
          background-color: #FFFDF8;
        }

        /* ===== Info row hover ===== */
        .info-row {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.35s ease;
          border-radius: 8px;
        }
        .info-row:hover {
          transform: translateX(6px);
        }
        .info-row .info-icon {
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.4s ease;
        }
        .info-row:hover .info-icon {
          transform: scale(1.1) rotate(-6deg);
          background-color: rgba(255,255,255,0.2);
        }

        /* ===== Help card list hover ===== */
        .help-list-item {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .help-list-item:hover {
          transform: translateX(4px);
        }
        .help-list-item svg {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .help-list-item:hover svg {
          transform: scale(1.2) rotate(8deg);
        }

        /* ===== Intro info grid item ===== */
        .intro-item {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .intro-item:hover {
          transform: translateY(-2px);
        }
        .intro-item svg {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .intro-item:hover svg {
          transform: scale(1.2) rotate(8deg);
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

        <div
          ref={heroReveal.ref}
          className="max-w-7xl mx-auto px-6 py-16 relative z-10"
        >
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6 reveal-up">
            <Link href="/" className="hover:text-[#D5A54D] transition-colors">
              Home
            </Link>
            <span className="text-zinc-300">›</span>
            <span className="text-[#0A2540] font-medium">Contact Us</span>
          </div>

          <h1 className="text-5xl font-bold text-[#0A2540] mb-4 reveal-up stagger-1">
            Contact Us
          </h1>
          <div className="w-16 h-1 gold-underline mb-6 reveal-up stagger-2 rounded-full"></div>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed reveal-up stagger-3">
            Connect with us for inquiries, assistance, and symposium support.
          </p>
        </div>
      </section>

      {/* ================= INTRO SECTION ================= */}
      <section ref={introReveal.ref} className={`py-12 ${introReveal.inView ? "in-view" : ""}`}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="premium-card reveal-up bg-white rounded-xl border border-zinc-200 p-8">
            <h2 className="text-2xl font-bold text-[#0A2540] mb-4">
              Contact the Symposium Secretariat
            </h2>
            <div className="w-12 h-1 gold-underline mb-4 rounded-full"></div>
            <p className="text-gray-600 leading-relaxed mb-6">
              Have questions about abstract submission, registration, travel, participation, or institutional collaboration? The 3rd International Agri-Life & Bioresource Sciences Symposium Secretariat is available to assist participants, presenters, partner institutions, and international delegates.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#F8FAFC] rounded-lg border border-zinc-100">
              {[
                { icon: <FaRegBuilding className="text-[#D5A54D] text-lg" />, title: "Symposium Secretariat", sub: "3rd International Agri-Life & Bioresource Sciences Symposium" },
                { icon: <FaUniversity className="text-[#D5A54D] text-lg" />, title: "Capiz State University", sub: "Roxas City, Capiz, Philippines" },
                { icon: <FaEnvelope className="text-[#D5A54D] text-lg" />, title: "Email", sub: "internationalsymposium@capsu.edu.ph", href: "mailto:internationalsymposium@capsu.edu.ph" },
                { icon: <FaPhone className="text-[#D5A54D] text-lg" />, title: "Telephone", sub: "To be announced" },
              ].map((item, idx) => (
                <div key={idx} className={`intro-item flex items-center gap-3 reveal-up stagger-${idx + 1}`}>
                  {item.icon}
                  <div>
                    <p className="font-semibold text-[#0A2540] text-sm">{item.title}</p>
                    {item.href ? (
                      <a href={item.href} className="text-xs text-[#1D3D6D] hover:text-[#D5A54D] transition-colors">
                        {item.sub}
                      </a>
                    ) : (
                      <p className="text-xs text-gray-500">{item.sub}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW CAN WE HELP ================= */}
      <section ref={helpScroll.ref} className="py-12 bg-white">
        <div
          ref={helpReveal.ref}
          className={`max-w-7xl mx-auto px-6 ${helpReveal.inView ? "in-view" : ""}`}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#0A2540] uppercase reveal-up">
              How Can We Help?
            </h2>
            <div className="w-16 h-1 gold-underline mx-auto mt-4 reveal-up stagger-1 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="premium-card scroll-lift reveal-up bg-[#F8FAFC] rounded-xl border border-zinc-200 p-6"
                 style={{ ["--scroll-y" as any]: `${(1 - helpScroll.progress) * 25}px` }}>
              <div className="premium-icon w-12 h-12 bg-[#1D3D6D] rounded-full flex items-center justify-center mb-4">
                <FaInfoCircle className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold text-[#0A2540] mb-2">General Inquiries</h3>
              <p className="text-sm text-gray-600 mb-4">
                For general questions about the symposium, program, participation, schedules, and other event-related concerns.
              </p>
              <div className="space-y-2 text-sm">
                <div className="info-row flex items-center gap-2">
                  <FaEnvelope className="text-[#D5A54D] text-sm shrink-0" />
                  <a href="mailto:internationalsymposium@capsu.edu.ph" className="text-[#1D3D6D] hover:text-[#D5A54D] transition-colors">
                    internationalsymposium@capsu.edu.ph
                  </a>
                </div>
                <div className="info-row flex items-center gap-2">
                  <FaPhone className="text-[#D5A54D] text-sm shrink-0" />
                  <span className="text-gray-500">To be announced</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="premium-card scroll-lift reveal-up stagger-1 bg-[#F8FAFC] rounded-xl border border-zinc-200 p-6"
                 style={{ ["--scroll-y" as any]: `${(1 - helpScroll.progress) * 18}px` }}>
              <div className="premium-icon w-12 h-12 bg-[#1D3D6D] rounded-full flex items-center justify-center mb-4">
                <FaClipboardList className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold text-[#0A2540] mb-2">Registration &amp; Payment Concerns</h3>
              <p className="text-sm text-gray-600 mb-4">For assistance regarding:</p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                {[
                  "Participant & Presenter registration",
                  "Registration status & fee",
                  "Proof of payment & verification",
                  "Symposium kit and certificates",
                ].map((item, idx) => (
                  <li key={idx} className="help-list-item flex items-start gap-2">
                    <FaCheckCircle className="text-[#D5A54D] text-xs mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-2 text-sm">
                <div className="info-row flex items-center gap-2">
                  <FaEnvelope className="text-[#D5A54D] text-sm shrink-0" />
                  <span className="text-gray-500">internationalsymposium@capsu.edu.ph</span>
                </div>
                <div className="info-row flex items-center gap-2">
                  <FaPhone className="text-[#D5A54D] text-sm shrink-0" />
                  <span className="text-gray-500">To be announced</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="premium-card scroll-lift reveal-up stagger-2 bg-[#F8FAFC] rounded-xl border border-zinc-200 p-6"
                 style={{ ["--scroll-y" as any]: `${(1 - helpScroll.progress) * 10}px` }}>
              <div className="premium-icon w-12 h-12 bg-[#1D3D6D] rounded-full flex items-center justify-center mb-4">
                <FaHandshake className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold text-[#0A2540] mb-2">Partnership &amp; Sponsorship</h3>
              <p className="text-sm text-gray-600 mb-4">
                Universities, research institutions, government agencies, professional organizations, industry partners, and other organizations interested in supporting or collaborating with the symposium.
              </p>
              <p className="text-sm font-semibold text-[#0A2540] mb-2">Potential areas:</p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                {[
                  "Institutional & scientific collaboration",
                  "Speaker, reviewer, or session chair nomination",
                  "Sponsorship support & exhibition",
                  "Post-symposium research collaboration",
                ].map((item, idx) => (
                  <li key={idx} className="help-list-item flex items-start gap-2">
                    <FaCheckCircle className="text-[#D5A54D] text-xs mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-2 text-sm">
                <div className="info-row flex items-center gap-2">
                  <FaEnvelope className="text-[#D5A54D] text-sm shrink-0" />
                  <span className="text-gray-500">internationalsymposium@capsu.edu.ph</span>
                </div>
              </div>
              <Link
                href="/partner-institutions"
                className="inline-flex items-center gap-2 text-[#1D3D6D] font-semibold text-sm hover:text-[#D5A54D] transition-colors mt-3"
              >
                Explore Our Partners <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT FORM ================= */}
      <section ref={formReveal.ref} className={`py-12 ${formReveal.inView ? "in-view" : ""}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Contact Info */}
            <div className="lg:col-span-2 reveal-left">
              <div className="premium-card bg-linear-to-br from-[#0A2540] to-[#1a3a5c] rounded-2xl p-8 text-white h-full relative overflow-hidden">
                {/* Gold sheen overlay */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(60% 50% at 100% 0%, rgba(213,165,77,0.25) 0%, rgba(0,0,0,0) 70%)",
                  }}
                />
                <div className="relative">
                  <h3 className="text-2xl font-bold mb-4 text-[#0A2540]">Send Us a Message</h3>
                  <div className="w-12 h-1 gold-underline mb-4 rounded-full"></div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-8">
                    Have a specific question? Send your inquiry using the form.
                  </p>

                  <div className="space-y-5">
                    {[
                      { icon: <FaEnvelope />, title: "Email", sub: "internationalsymposium@capsu.edu.ph", href: "mailto:internationalsymposium@capsu.edu.ph" },
                      { icon: <FaPhone />, title: "Telephone", sub: "To be announced" },
                      { icon: <FaMapMarkerAlt />, title: "Address", sub: "Capiz State University\nRoxas City, Capiz, Philippines" },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="info-row flex items-start gap-4 p-3 -mx-3 rounded-lg transition-colors duration-300 hover:bg-[#F0F6FF]"
                      >
                        <div className="info-icon w-11 h-11 bg-[#F0F6FF] ring-1 ring-[#D5A54D]/40 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-[#1D3D6D] text-lg">{item.icon}</span>
                        </div>
                        <div className="pt-1">
                          <p className="font-semibold text-xs uppercase tracking-wider text-[#D5A54D] mb-1">
                            {item.title}
                          </p>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="text-sm text-[#0A2540] hover:text-[#D5A54D] transition-colors break-all"
                            >
                              {item.sub}
                            </a>
                          ) : (
                            <p className="text-sm text-[#0A2540] whitespace-pre-line leading-relaxed">
                              {item.sub}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-3 reveal-right">
              <div className="premium-card bg-white rounded-xl border border-zinc-200 p-8">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaCheckCircle className="text-green-600 text-4xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0A2540] mb-2">Message Sent!</h3>
                    <p className="text-gray-600">
                      Thank you for your message. We will get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-4 text-[#1D3D6D] font-semibold hover:text-[#D5A54D] transition-colors"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="reveal-up stagger-1">
                        <label className="block text-sm font-semibold text-[#0A2540] mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          placeholder="Enter your complete name"
                          className="premium-input w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none text-sm"
                        />
                      </div>
                      <div className="reveal-up stagger-2">
                        <label className="block text-sm font-semibold text-[#0A2540] mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Enter a valid email address"
                          className="premium-input w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="reveal-up stagger-1">
                        <label className="block text-sm font-semibold text-[#0A2540] mb-1">
                          Institution / Organization
                        </label>
                        <input
                          type="text"
                          name="institution"
                          value={formData.institution}
                          onChange={handleChange}
                          placeholder="Enter your university, agency, company, or organization"
                          className="premium-input w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none text-sm"
                        />
                      </div>
                      <div className="reveal-up stagger-2">
                        <label className="block text-sm font-semibold text-[#0A2540] mb-1">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          className="premium-input w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none text-sm appearance-none bg-white"
                        >
                          {countries.map((country, idx) => (
                            <option key={idx} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="reveal-up stagger-3">
                      <label className="block text-sm font-semibold text-[#0A2540] mb-1">
                        Inquiry Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        required
                        className="premium-input w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none text-sm appearance-none bg-white"
                      >
                        {inquiryTypes.map((type, idx) => (
                          <option key={idx} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="reveal-up stagger-4">
                      <label className="block text-sm font-semibold text-[#0A2540] mb-1">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Briefly describe your concern"
                        className="premium-input w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none text-sm"
                      />
                    </div>

                    <div className="reveal-up stagger-5">
                      <label className="block text-sm font-semibold text-[#0A2540] mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Provide the details of your inquiry"
                        className="premium-input w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none text-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="premium-btn w-full bg-linear-to-r from-[#1D3D6D] to-[#16305a] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 reveal-up stagger-5"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          SEND MESSAGE <FaRegPaperPlane className="rotate-[-20deg]" />
                        </>
                      )}
                    </button>

                    <div className="premium-card reveal-up stagger-6 mt-4 p-4 bg-[#F8FAFC] rounded-lg border border-zinc-200">
                      <div className="flex items-start gap-2">
                        <FaShieldAlt className="text-[#D5A54D] text-sm mt-0.5 shrink-0" />
                        <p className="text-xs text-gray-600">
                          By submitting this form, you agree that the information you provide may be used by the Symposium Secretariat to respond to your inquiry and provide relevant symposium-related assistance.
                        </p>
                      </div>
                      <div className="mt-2">
                        <Link
                          href="#"
                          className="text-xs text-[#1D3D6D] hover:text-[#D5A54D] transition-colors font-semibold"
                        >
                          View Privacy Notice →
                        </Link>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}