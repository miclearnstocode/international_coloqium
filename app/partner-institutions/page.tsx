"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect, useRef } from "react";
import {
  FaCheckCircle,
  FaArrowRight,
  FaEnvelope,
  FaBuilding,
  FaStar,
  FaHandshake,
} from "react-icons/fa";

// ================= TYPE DEFINITIONS =================
interface Institution {
  name: string;
  logo: string;
  location?: string;
  role?: string;
}

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

export default function PartnerInstitutionsPage() {
  // Reveal hooks
  const heroReveal = useInView<HTMLDivElement>();
  const hostReveal = useInView<HTMLDivElement>();
  const coHostReveal = useInView<HTMLDivElement>();
  const roleReveal = useInView<HTMLDivElement>();
  const partnerReveal = useInView<HTMLDivElement>();
  const sponsorReveal = useInView<HTMLDivElement>();
  const ctaReveal = useInView<HTMLDivElement>();

  // Scroll progress hooks
  const heroScroll = useScrollProgress<HTMLElement>();
  const hostScroll = useScrollProgress<HTMLElement>();
  const coHostScroll = useScrollProgress<HTMLElement>();
  const partnerScroll = useScrollProgress<HTMLElement>();

  // ================= DATA =================
  const hostInstitution: Institution = {
    name: "Capiz State University",
    logo: "/images/capsu-logo.png",
    role: "Implementing Institution",
    location: "Capiz, Philippines",
  };

  const coHosts: Institution[] = [
    { name: "Hiroshima University", logo: "/images/hiroshima-logo.webp" },
    { name: "Visayas State University", logo: "/images/vsu-logo.png", location: "Philippines" },
    { name: "University of San Carlos", logo: "/images/usc-logo.svg", location: "Philippines" },
  ];

  const institutionalPartners: Institution[] = [];
  const sponsors: Institution[] = [];

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

        /* Logo bubble treatment for partner cards */
        .logo-bubble {
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), filter 0.5s ease;
        }
        .premium-card:hover .logo-bubble {
          transform: scale(1.06);
          filter: drop-shadow(0 12px 24px rgba(213,165,77,0.25));
        }

        /* ===== Role list item ===== */
        .role-item {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.35s ease;
        }
        .role-item:hover {
          transform: translateX(4px);
          background-color: rgba(255, 255, 255, 0.16);
        }
        .role-item svg {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .role-item:hover svg {
          transform: scale(1.2) rotate(8deg);
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
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%);
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
            <span className="text-[#0A2540] font-medium">Partners</span>
          </div>

          <h1 className="text-5xl font-bold text-[#0A2540] mb-4 reveal-up stagger-1">
            Partners &amp; Collaborating Institutions
          </h1>
          <div className="w-16 h-1 gold-underline mb-6 reveal-up stagger-2 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed font-semibold reveal-up stagger-3">
            Advancing science through institutional partnership and international collaboration.
          </p>
        </div>
      </section>

      {/* ================= HOST INSTITUTION ================= */}
      <section ref={hostScroll.ref} className="py-12">
        <div
          ref={hostReveal.ref}
          className={`max-w-7xl mx-auto px-6 ${hostReveal.inView ? "in-view" : ""}`}
        >
          <div className="text-center mb-8 reveal-up">
            <h2 className="text-2xl font-bold text-[#0A2540] uppercase">Organized by</h2>
            <div className="w-12 h-1 gold-underline mx-auto mt-3 rounded-full"></div>
          </div>

          <div className="flex justify-center">
            <div className="premium-card bg-white rounded-2xl border border-zinc-200 p-8 w-full max-w-md reveal-scale">
              <div className="flex flex-col items-center">
                <div className="logo-bubble relative w-32 h-32 mb-4">
                  <Image
                    src={hostInstitution.logo}
                    alt={hostInstitution.name}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-32 h-32 bg-[#1D3D6D] rounded-xl flex items-center justify-center">
                            <span class="text-white text-2xl font-bold">${hostInstitution.name
                              .split(" ")
                              .map((w: string) => w[0])
                              .join("")}</span>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
                <h3 className="font-bold text-[#0A2540] text-xl">
                  {hostInstitution.name}
                </h3>
                <p className="text-sm text-[#D5A54D] font-semibold mt-1">
                  {hostInstitution.role}
                </p>
                <p className="text-sm text-gray-500">{hostInstitution.location}</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 text-center mt-6 max-w-2xl mx-auto reveal-up stagger-2">
            Capiz State University serves as the implementing institution of the
            3rd International Agri-Life &amp; Bioresource Sciences Symposium.
          </p>
        </div>
      </section>

      {/* ================= CO-HOST INSTITUTIONS ================= */}
      <section ref={coHostScroll.ref} className="py-12 bg-white">
        <div
          ref={coHostReveal.ref}
          className={`max-w-7xl mx-auto px-6 ${coHostReveal.inView ? "in-view" : ""}`}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#0A2540] uppercase reveal-up">
              Co-host Institutions
            </h2>
            <div className="w-12 h-1 gold-underline mx-auto mt-3 reveal-up stagger-1 rounded-full"></div>
            <p className="text-sm text-gray-500 mt-3 reveal-up stagger-2">
              The symposium proposal identifies these institutions as co-hosts with CAPSU.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {coHosts.map((institution: Institution, idx: number) => (
              <div
                key={idx}
                className={`premium-card scroll-lift bg-[#F8FAFC] rounded-xl border border-zinc-200 p-6 text-center reveal-up stagger-${idx + 1}`}
                style={{ ["--scroll-y" as any]: `${(1 - coHostScroll.progress) * (25 - idx * 4)}px` }}
              >
                <div className="logo-bubble relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src={institution.logo}
                    alt={institution.name}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-24 h-24 bg-[#1D3D6D] rounded-xl flex items-center justify-center mx-auto">
                            <span class="text-white text-xl font-bold">${institution.name
                              .split(" ")
                              .map((w: string) => w[0])
                              .join("")}</span>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
                <h3 className="font-bold text-[#0A2540]">{institution.name}</h3>
                {institution.location && (
                  <p className="text-sm text-gray-500 mt-1">{institution.location}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= THE ROLE OF PARTNER INSTITUTIONS ================= */}
      <section
        ref={roleReveal.ref}
        className={`py-12 bg-linear-to-r from-[#0A2540] to-[#1a3a5c] relative overflow-hidden ${roleReveal.inView ? "in-view" : ""}`}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 20%, rgba(213,165,77,0.18) 0%, rgba(0,0,0,0) 70%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white uppercase reveal-up">
              The Role of Partner Institutions
            </h2>
            <div className="w-12 h-1 gold-underline mx-auto mt-3 reveal-up stagger-1 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              "Participation in Organizing and Scientific Committees",
              "Promotion of the Call for Abstracts",
              "Nomination of speakers and experts",
              "Abstract review and evaluation",
              "Session facilitation and moderation",
              "Academic networking",
              "Development of future research collaborations",
              "Institutional partnerships",
              "International scientific exchange",
            ].map((item: string, idx: number) => (
              <div
                key={idx}
                className={`role-item flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10 reveal-up stagger-${(idx % 6) + 1}`}
              >
                <FaCheckCircle className="text-[#D5A54D] text-sm shrink-0" />
                <span className="text-white text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          <p className="text-gray-300 text-sm text-center mt-6 max-w-3xl mx-auto reveal-up stagger-4">
            Partner institutions contribute to the international and scientific
            character of the symposium through participation in organizing and
            scientific committees, promotion of the Call for Abstracts,
            nomination of speakers and experts, abstract review, session
            facilitation, academic networking, and the development of future
            research and institutional collaborations.
          </p>
        </div>
      </section>

      {/* ================= OTHER INSTITUTIONAL PARTNERS ================= */}
      <section ref={partnerScroll.ref} className="py-12 bg-white">
        <div
          ref={partnerReveal.ref}
          className={`max-w-7xl mx-auto px-6 ${partnerReveal.inView ? "in-view" : ""}`}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#0A2540] uppercase reveal-up">
              Other Institutional Partners
            </h2>
            <div className="w-12 h-1 gold-underline mx-auto mt-3 reveal-up stagger-1 rounded-full"></div>
            <p className="text-sm text-gray-500 mt-3 reveal-up stagger-2">
              Only add organizations here after confirmation.
            </p>
          </div>

          {institutionalPartners.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {institutionalPartners.map((partner: Institution, idx: number) => (
                <div
                  key={idx}
                  className={`premium-card scroll-lift bg-[#F8FAFC] rounded-xl border border-zinc-200 p-6 text-center reveal-up stagger-${(idx % 6) + 1}`}
                  style={{ ["--scroll-y" as any]: `${(1 - partnerScroll.progress) * (20 - idx * 2)}px` }}
                >
                  <div className="logo-bubble relative w-24 h-24 mx-auto mb-3">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-24 h-24 bg-[#1D3D6D] rounded-xl flex items-center justify-center mx-auto">
                              <span class="text-white text-xl font-bold">${partner.name
                                .split(" ")
                                .map((w: string) => w[0])
                                .join("")}</span>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                  <p className="font-semibold text-[#0A2540] text-sm">{partner.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, idx: number) => (
                <div
                  key={idx}
                  className={`premium-card bg-[#F8FAFC] rounded-xl border border-dashed border-zinc-300 p-6 text-center reveal-up stagger-${(idx % 6) + 1}`}
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FaBuilding className="text-3xl text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-400">Institutional Partner</p>
                  <p className="text-xs text-gray-400">Logo &amp; Name</p>
                </div>
              ))}
            </div>
          )}
          {institutionalPartners.length === 0 && (
            <p className="text-sm text-gray-400 text-center mt-4 reveal-up stagger-5">
              Institutional partners will be displayed here once confirmed.
            </p>
          )}
        </div>
      </section>

      {/* ================= SPONSORS ================= */}
      <section ref={sponsorReveal.ref} className={`py-12 bg-[#F8FAFC] ${sponsorReveal.inView ? "in-view" : ""}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#0A2540] uppercase reveal-up">
              Sponsors
            </h2>
            <div className="w-12 h-1 gold-underline mx-auto mt-3 reveal-up stagger-1 rounded-full"></div>
            <p className="text-sm text-gray-500 mt-3 reveal-up stagger-2">
              Sponsorship logos will be displayed once agreements are finalized.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {sponsors.length > 0 ? (
              sponsors.map((sponsor: Institution, idx: number) => (
                <div
                  key={idx}
                  className={`premium-card bg-white rounded-xl border border-zinc-200 p-6 text-center w-48 reveal-up stagger-${(idx % 6) + 1}`}
                >
                  <div className="logo-bubble relative w-24 h-24 mx-auto mb-3">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-24 h-24 bg-[#1D3D6D] rounded-xl flex items-center justify-center mx-auto">
                              <span class="text-white text-xl font-bold">${sponsor.name
                                .split(" ")
                                .map((w: string) => w[0])
                                .join("")}</span>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                  <p className="font-semibold text-[#0A2540] text-sm">{sponsor.name}</p>
                </div>
              ))
            ) : (
              [...Array(6)].map((_, idx: number) => (
                <div
                  key={idx}
                  className={`premium-card bg-white rounded-xl border border-dashed border-zinc-300 p-6 text-center w-48 reveal-up stagger-${(idx % 6) + 1}`}
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FaStar className="text-3xl text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-400">Sponsor</p>
                  <p className="text-xs text-gray-400">Logo &amp; Name</p>
                </div>
              ))
            )}
          </div>

          <p className="text-xs text-gray-400 text-center mt-6 max-w-2xl mx-auto reveal-up stagger-3">
            Avoid putting organizations listed merely as possible invitees in
            your internal proposal on the public page before they formally agree.
          </p>
        </div>
      </section>

      {/* ================= BECOME A PARTNER ================= */}
      <section
        ref={ctaReveal.ref}
        className={`py-16 bg-linear-to-r from-[#0A2540] to-[#1a3a5c] relative overflow-hidden ${ctaReveal.inView ? "in-view" : ""}`}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 50% at 80% 50%, rgba(213,165,77,0.20) 0%, rgba(0,0,0,0) 70%)",
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-4 reveal-up">
            <div className="premium-icon w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center ring-1 ring-[#D5A54D]/40">
              <FaHandshake className="text-[#D5A54D] text-3xl" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 reveal-up stagger-1">
            Become a Partner
          </h2>
          <div className="w-16 h-1 gold-underline mx-auto mb-6 reveal-up stagger-2 rounded-full"></div>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto reveal-up stagger-3">
            Collaborate with us. Institutions and organizations interested in
            supporting the symposium through scientific collaboration,
            institutional participation, sponsorship, or other forms of
            partnership may contact the Organizing Committee.
          </p>
          <Link
            href="#"
            className="premium-btn inline-flex items-center gap-3 bg-linear-to-r from-[#D5A54D] to-[#F0C674] text-[#0A2540] px-8 py-4 rounded-lg font-bold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl reveal-up stagger-4"
          >
            Contact the Secretariat <FaArrowRight />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}