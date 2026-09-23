"use client";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FaRegCheckCircle, FaRegPaperPlane, FaFileAlt } from "react-icons/fa";

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

export default function ScientificTracks() {
  // Reveal hooks
  const heroReveal = useInView<HTMLDivElement>();
  const tracksReveal = useInView<HTMLDivElement>();
  const ctaReveal = useInView<HTMLDivElement>();

  // Scroll progress hooks
  const heroScroll = useScrollProgress<HTMLElement>();
  const tracksScroll = useScrollProgress<HTMLElement>();

  const checkColors = {
    green: "#4CAF50",
    blue: "#1D3D6D",
    lightblue: "#1E88E5",
    purple: "#8E24AA",
    orange: "#F57C00",
  };

  const tracks = [
    {
      id: "TRACK 1",
      title: "Agriculture, Animal",
      subtitle: "and Plant Science",
      icon: "/images/tracks/leaf.png", 
      color: "bg-[#4CAF50]",
      glowColor: "rgba(76, 175, 80, 0.4)",
      iconColor: checkColors.green,
      items: [
        "Crop science and sustainable crop production",
        "Animal science and livestock production",
        "Soil science and crop protection",
        "Agricultural and aquatic biotechnology",
        "Sustainable production systems",
      ],
    },
    {
      id: "TRACK 2",
      title: "Life, Biological, and",
      subtitle: "Biotechnology Sciences",
      icon: "/images/tracks/dna.png", 
      color: "bg-[#1D3D6D]",
      glowColor: "rgba(29, 61, 109, 0.4)",
      iconColor: checkColors.blue,
      items: [
        "Molecular biology and biotechnology",
        "Genetics and genomics",
        "Microbiology",
        "Ecology and biodiversity",
        "Plant, animal, and aquatic biology",
        "Genetic resources and conservation",
      ],
    },
    {
      id: "TRACK 3",
      title: "Bioresource, Fisheries, Marine,",
      subtitle: "and Environmental Sciences",
      icon: "/images/tracks/fish.png", 
      color: "bg-[#1E88E5]",
      glowColor: "rgba(30, 136, 229, 0.4)",
      iconColor: checkColors.lightblue,
      items: [
        "Marine and coastal ecosystems",
        "Marine biodiversity and conservation",
        "Fisheries science and management",
        "Aquatic and marine bioresources",
        "Natural resource management",
        "Forestry and agroforestry",
        "Climate change and resilience",
        "Environmental science",
        "Circular bioeconomy",
        "Fisheries and aquaculture",
        "Aquatic animal health and nutrition",
      ],
    },
    {
      id: "TRACK 4",
      title: "Food, Nutrition, and One Health",
      subtitle: "",
      icon: "/images/tracks/nutrition.png",
      color: "bg-[#8E24AA]",
      glowColor: "rgba(142, 36, 170, 0.4)",
      iconColor: checkColors.purple,
      items: [
        "Food science and technology",
        "Food safety and quality",
        "Nutrition",
        "One Health",
        "Plant, animal, and aquatic health",
        "Sustainable food systems",
        "Seafood safety and processing",
      ],
    },
    {
      id: "TRACK 5",
      title: "Innovation, Economics, and",
      subtitle: "Sustainable Development",
      icon: "/images/tracks/innovation.png",
      color: "bg-[#F57C00]",
      glowColor: "rgba(245, 124, 0, 0.4)",
      iconColor: checkColors.orange,
      items: [
        "Agricultural and fisheries economics",
        "Extension and communication",
        "Rural and coastal community development",
        "Agribusiness and entrepreneurship",
        "Digital and precision agriculture",
        "Smart farming and aquaculture",
        "Artificial intelligence and emerging technologies",
        "Policy, governance, and sustainable development",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0A2540] flex flex-col overflow-x-hidden">
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

        /* ===== Premium track card ===== */
        .track-card {
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
        .track-card::before {
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
        .track-card::after {
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
        .track-card:hover {
          transform: translateY(-10px);
          border-color: rgba(213, 165, 77, 0.35);
          box-shadow:
            0 2px 4px rgba(11, 42, 74, 0.05),
            0 12px 24px -10px rgba(11, 42, 74, 0.16),
            0 32px 60px -20px rgba(11, 42, 74, 0.22),
            0 0 0 1px rgba(213, 165, 77, 0.05);
        }
        .track-card:hover::before {
          background: linear-gradient(135deg, rgba(213,165,77,0.9) 0%, rgba(29,61,109,0.35) 50%, rgba(213,165,77,0.9) 100%);
        }
        .track-card:hover::after { opacity: 1; }

        .track-icon-bubble {
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease;
        }
        .track-card:hover .track-icon-bubble {
          transform: scale(1.08) rotate(-6deg);
          box-shadow: 0 0 0 8px rgba(213,165,77,0.10), 0 12px 28px -10px rgba(213,165,77,0.45);
        }

        .track-badge {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease;
        }
        .track-card:hover .track-badge {
          transform: scale(1.05);
          box-shadow: 0 8px 24px -6px var(--glow);
        }

        .track-item {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), color 0.3s ease;
        }
        .track-item:hover {
          transform: translateX(6px);
          color: #0A2540;
        }
        .track-item svg {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .track-item:hover svg {
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

      {/* ================= PAGE HERO ================= */}
      <section
        ref={heroScroll.ref}
        className={`relative bg-white overflow-hidden border-b border-zinc-100 ${heroReveal.inView ? "in-view" : ""}`}
      >
        {/* Globe background — subtle scroll parallax, no pulse */}
        <div
          aria-hidden
          className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-60"
          style={{ transform: `translateY(${(heroScroll.progress - 0.5) * -30}px)` }}
        >
          <img
            src="/images/earth.png"
            alt=""
            className="w-full h-full object-cover object-right opacity-20"
          />
        </div>

        <div
          ref={heroReveal.ref}
          className="max-w-350 mx-auto px-8 py-16 relative z-10"
        >
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8 reveal-up">
            <Link href="/" className="hover:text-[#F5A623] transition-colors">
              Home
            </Link>
            <span className="text-zinc-300">›</span>
            <span className="text-[#0A2540] font-medium">Scientific Tracks</span>
          </div>

          <h1 className="text-5xl font-bold text-[#0A2540] mb-4 reveal-up stagger-1">
            Scientific Tracks
          </h1>
          <div className="w-16 h-1 gold-underline mb-6 reveal-up stagger-2 rounded-full"></div>
          
          <p className="text-lg text-zinc-600 max-w-2xl leading-relaxed reveal-up stagger-3">
            The 3rd International Agri-Life & Bioresource Science Symposium welcomes original research and innovative ideas across a wide range of scientific disciplines.
          </p>
        </div>
      </section>

      {/* ================= OUR SCIENTIFIC TRACKS ================= */}
      <section ref={tracksScroll.ref} className="py-20">
        <div
          ref={tracksReveal.ref}
          className={`max-w-350 mx-auto px-8 ${tracksReveal.inView ? "in-view" : ""}`}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0A2540] uppercase reveal-up">
              Our Scientific Tracks
            </h2>
            <div className="w-16 h-1 gold-underline mx-auto mt-4 reveal-up stagger-1 rounded-full"></div>
          </div>

          {/* Tracks 1-3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tracks.slice(0, 3).map((track, idx) => (
              <TrackCard
                key={track.id}
                track={track}
                index={idx}
                scrollProgress={tracksScroll.progress}
              />
            ))}
          </div>

          {/* Tracks 4 & 5 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
            {tracks.slice(3).map((track, idx) => (
              <TrackCard
                key={track.id}
                track={track}
                index={idx + 3}
                scrollProgress={tracksScroll.progress}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= SUBMIT CTA ================= */}
      <section
        ref={ctaReveal.ref}
        className={`pb-20 ${ctaReveal.inView ? "in-view" : ""}`}
      >
        <div className="max-w-350 mx-auto px-8">
          <div className="track-card reveal-up bg-white rounded-xl border border-zinc-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="track-icon-bubble w-16 h-16 bg-[#F0F6FF] rounded-full flex items-center justify-center">
                <FaFileAlt className="text-[#1D3D6D] text-3xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0A2540] mb-1">Submit Your Research</h3>
                <p className="text-zinc-500">
                  Share your innovative research and be part of global discussions that shape the future of science, technology, and society.
                </p>
              </div>
            </div>
            <Link
              href="/abstract-submission"
              className="premium-btn bg-linear-to-r from-[#1D3D6D] to-[#16305a] text-white px-8 py-4 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 shrink-0 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Submit Abstract <FaRegPaperPlane className="rotate-[-20deg]" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ===== Sub-component for each track card =====
function TrackCard({
  track,
  index,
  scrollProgress,
}: {
  track: {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    color: string;
    glowColor: string;
    iconColor: string;
    items: string[];
  };
  index: number;
  scrollProgress: number;
}) {
  return (
    <div
      className={`track-card scroll-lift bg-white rounded-xl border border-zinc-100 p-8 flex flex-col reveal-up stagger-${(index % 6) + 1}`}
      style={{
        ["--scroll-y" as any]: `${(1 - scrollProgress) * (25 - index * 3)}px`,
        ["--glow" as any]: track.glowColor,
      }}
    >
      <div className="flex justify-center mb-8">
        <div className="track-icon-bubble w-24 h-24 rounded-full bg-[#F0F6FF] p-2 flex items-center justify-center">
          <Image
            src={track.icon}
            alt={track.title}
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
      </div>

      <div
        className={`track-badge inline-block self-center text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 ${track.color}`}
      >
        {track.id}
      </div>

      <h3 className="text-center text-xl font-bold text-[#0A2540] mb-1 leading-tight">
        {track.title}
      </h3>
      {track.subtitle && (
        <h4 className="text-center text-lg font-bold text-[#0A2540] mb-4">
          {track.subtitle}
        </h4>
      )}
      <div className="w-10 h-0.5 bg-[#D5A54D] mx-auto mb-6 rounded-full"></div>

      <ul className="space-y-3 flex-1">
        {track.items.map((item, idx) => (
          <li key={idx} className="track-item flex items-start gap-3 text-sm text-zinc-600">
            <FaRegCheckCircle
              className="mt-0.5 shrink-0 text-base"
              style={{ color: track.iconColor }}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}