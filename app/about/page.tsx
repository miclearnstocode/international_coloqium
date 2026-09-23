"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaMicrophone, 
  FaFileAlt, FaGlobe, FaLightbulb, FaLeaf, FaFish, FaFlask, FaUtensils, FaChartLine,
  FaCheckCircle, FaArrowRight, FaClipboardCheck, FaChevronDown,
  FaChevronUp, FaUserTie, FaUsersCog, FaUserFriends,
  FaMoneyBillWave, FaTruck, FaPlane, FaMicroscope, FaUserCheck
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
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full origin-left bg-linear-to-r from-[#D5A54D] via-[#F0C674] to-[#1D3D6D] shadow-[0_0_12px_rgba(213,165,77,0.6)]"
        style={{ transform: `scaleX(${progress})`, transition: "transform 0.08s linear" }}
      />
    </div>
  );
}

export default function AboutPage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  // Reveal hooks
  const heroReveal = useInView<HTMLDivElement>();
  const aboutReveal = useInView<HTMLDivElement>();
  const glanceReveal = useInView<HTMLDivElement>();
  const objectivesReveal = useInView<HTMLDivElement>();
  const attendReveal = useInView<HTMLDivElement>();
  const hostReveal = useInView<HTMLDivElement>();
  const committeeReveal = useInView<HTMLDivElement>();

  // Scroll progress hooks
  const aboutScroll = useScrollProgress<HTMLElement>();
  const glanceScroll = useScrollProgress<HTMLElement>();
  const objectivesScroll = useScrollProgress<HTMLElement>();
  const hostScroll = useScrollProgress<HTMLElement>();

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const tracks = [
    { 
      icon: <FaLeaf />, 
      title: "Track 1",
      subtitle: "Agricultural and Animal Sciences",
      description: "Crop Science, Animal Science, Soil Science, Crop Protection, Agricultural Biotechnology, Climate-Smart Agriculture, Agroecology, Precision Agriculture"
    },
    { 
      icon: <FaFlask />, 
      title: "Track 2",
      subtitle: "Life, Biological, and Biotechnology Sciences",
      description: "Molecular Biology, Genetics, Genomics, Bioinformatics, Microbiology, Ecology, Biodiversity, Genetic Resources"
    },
    { 
      icon: <FaFish />, 
      title: "Track 3",
      subtitle: "Fisheries, Marine, Bioresource, and Environmental Sciences",
      description: "Fisheries, Aquaculture, Marine Ecosystems, Biodiversity, Natural Resource Management, Climate Change, Circular Bioeconomy"
    },
    { 
      icon: <FaUtensils />, 
      title: "Track 4",
      subtitle: "Food, Nutrition, and One Health",
      description: "Food Science, Food Safety, Human/Animal Nutrition, One Health, Sustainable Food Systems, Seafood Safety, Functional Foods"
    },
    { 
      icon: <FaChartLine />, 
      title: "Track 5",
      subtitle: "Innovation, Economics, and Sustainable Development",
      description: "Agricultural Economics, Agribusiness, Digital Agriculture, AI and Emerging Technologies, Policy and Governance, Technology Adoption"
    },
  ];

  const hostInstitutions = [
    {
      name: "Capiz State University",
      location: "Capiz, Philippines",
      role: "Host Institution",
      description: "Lead organizer of the symposium, providing venue, logistics, and overall coordination.",
      logo: "/images/capsu-logo.png",
      logoFallback: "CAPSU"
    },
    {
      name: "Hiroshima University",
      location: "Hiroshima, Japan",
      role: "Co-Host Institution",
      description: "International partner contributing expertise in marine/aquatic sciences and research collaboration.",
      logo: "/images/hiroshima-logo.webp",
      logoFallback: "HU"
    },
    {
      name: "University of San Carlos",
      location: "Cebu, Philippines",
      role: "Co-Host Institution",
      description: "Collaborating institution strengthening academic linkages and research partnerships.",
      logo: "/images/usc-logo.svg",
      logoFallback: "USC"
    },
    {
      name: "Visayas State University",
      location: "Leyte, Philippines",
      role: "Co-Host Institution",
      description: "Partner institution supporting agricultural and life sciences research exchange.",
      logo: "/images/vsu-logo.png",
      logoFallback: "VSU"
    },
  ];

  const objectives = [
    "Provide researchers, faculty members, and students with opportunities to present and disseminate their research findings and innovations",
    "Facilitate interdisciplinary discussions on emerging issues and developments in agriculture, life sciences, and bioresource sciences",
    "Strengthen research collaboration and academic linkages among participating universities, research institutions, government agencies, and industry partners",
    "Promote internationalization through greater participation and engagement of international researchers and institutions",
    "Provide opportunities for young and emerging researchers to interact with established scientists and experts",
    "Identify potential areas for collaborative research, academic exchange, and other joint initiatives",
    "Contribute to the advancement of sustainable and science-based solutions to challenges affecting agriculture, food systems, natural resources, and society"
  ];

  const whoShouldAttend = [
    "International delegates and researchers",
    "Scientists and research professionals",
    "Representatives of universities and research institutions",
    "Faculty members",
    "Graduate and undergraduate students",
    "Eligible high-school research presenters",
    "Government agencies and research councils",
    "Professional and scientific organizations",
    "Non-government organizations",
    "Industry and private-sector partners",
    "Stakeholders in agriculture, life sciences, fisheries, natural resources, food, health, innovation, and bioresource sciences"
  ];

  const committeeData = [
    {
      id: 0,
      title: "Executive / Steering Committee",
      icon: <FaUsersCog className="text-2xl" />,
      description: "Provides strategic direction, coordination, and overall oversight.",
      members: ["Dr. Efren L. Linan", "Atty. Toche Vic Doce", "Dr. Leo Andrew B. Biclar", "Dr. Annalie G. Campos", "Dr. Salvacion J. Legaspi"]
    },
    {
      id: 1,
      title: "Symposium Chair",
      icon: <FaUserTie className="text-2xl" />,
      description: "Provides overall leadership in planning and implementation.",
      members: ["Dr. John King N. Layos"]
    },
    {
      id: 2,
      title: "Symposium Co-Chairs / Institutional Focal Persons",
      icon: <FaUserFriends className="text-2xl" />,
      description: "Facilitate coordination among participating institutions.",
      members: ["Dr. Takeshi Tomiyama - HU", "Dr. Rotacio Gravoso - VSU", "Dr. Paul John Geraldino - USC", "Dr. R-Jun Frederick A. Gaspe - CAPSU"]
    },
    {
      id: 3,
      title: "Scientific & Technical Committee",
      icon: <FaMicroscope className="text-2xl" />,
      description: "Develops the scientific program and tracks, manages the Call for Abstracts, oversees abstract review, organizes scientific sessions, and develops presentation/evaluation guidelines.",
      members: ["RDE Office", "Track 1 - Dr. Escala", "Track 2 - Prof. Faderogao", "Track 3 - Dr. Dela Calzada", "Track 4 - Dr. Hilapad", "Track 5 - Engr. Oloroso"]
    },
    {
      id: 4,
      title: "Program Committee",
      icon: <FaClipboardCheck className="text-2xl" />,
      description: "Develops and coordinates the symposium program.",
      members: ["RDE Office"]
    },
    {
      id: 5,
      title: "Secretariat & Registration Committee",
      icon: <FaUserCheck className="text-2xl" />,
      description: "Handles communications, participant records, registration, certificates, and official documents.",
      members: ["EAL Office", "RDE Office"]
    },
    {
      id: 6,
      title: "Finance & Sponsorship Committee",
      icon: <FaMoneyBillWave className="text-2xl" />,
      description: "Manages budget planning, sponsorship, registration fees, and financial monitoring.",
      members: ["EAL Office", "RDE Office", "Dr. Layos", "Dr. Escala", "Dr. Berganio", "BAC/Procurement"]
    },
    {
      id: 7,
      title: "Logistics & Venue Committee",
      icon: <FaTruck className="text-2xl" />,
      description: "Coordinates venue facilities, accommodation options, transportation, meals, audiovisual requirements, poster areas, and session rooms.",
      members: ["RDE Office", "EAL Office", "GSO - Sir Latoza", "Dr. Hilapad"]
    },
    {
      id: 8,
      title: "International Relations & Delegates Committee",
      icon: <FaPlane className="text-2xl" />,
      description: "Assists international delegates, invitation documentation, transportation, and related coordination.",
      members: ["EAL Office", "Dr. Quenga", "Dr. Gaspe", "Dr. Layos"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0A2540] overflow-x-hidden">
      <ScrollProgressBar />

      <style jsx global>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(3deg); }
        }
        @keyframes floatSlower {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-3deg); }
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
        .stagger-7 { animation-delay: 0.82s; }
        .stagger-8 { animation-delay: 0.94s; }

        .float-slow { animation: floatSlow 9s ease-in-out infinite; }
        .float-slower { animation: floatSlower 11s ease-in-out infinite; }

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
        ref={heroReveal.ref}
        className={`relative bg-white overflow-hidden border-b border-zinc-100 ${heroReveal.inView ? "in-view" : ""}`}
      >
        {/* Decorative orb */}
        <div
          aria-hidden
          className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-[#D5A54D]/10 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 float-slow pointer-events-none"
        />
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6 reveal-up">
            <Link href="/" className="hover:text-[#F5A623] transition-colors">
              Home
            </Link>
            <span className="text-zinc-300">›</span>
            <span className="text-[#0A2540] font-medium">About</span>
          </div>

          <h1 className="text-5xl font-bold text-[#0A2540] mb-4 reveal-up stagger-1">
            About the Symposium
          </h1>
          <div className="w-16 h-1 gold-underline mb-6 reveal-up stagger-2 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed font-semibold reveal-up stagger-3">
            Advancing research. Building partnerships. Creating science-based solutions for a resilient and sustainable future.
          </p>
        </div>
      </section>

      {/* ================= ABOUT CONTENT ================= */}
      <section ref={aboutScroll.ref} className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div
            ref={aboutReveal.ref}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${aboutReveal.inView ? "in-view" : ""}`}
          >
            {/* Left Content */}
            <div>
              <h2 className="text-2xl font-bold text-[#0A2540] mb-4 reveal-up">
                About the 3RD INTERNATIONAL AGRI-LIFE & BIORESOURCE SCIENCES SYMPOSIUM
              </h2>
              <div className="w-16 h-1 gold-underline mb-6 reveal-up stagger-1 rounded-full"></div>
              <p className="text-gray-600 text-justify leading-relaxed mb-4 reveal-up stagger-2">
                The <strong>3rd International Agri-Life & Bioresource Sciences Symposium</strong> is envisioned as an international academic and scientific platform that brings together researchers, faculty members, students, government representatives, industry partners, and other stakeholders to exchange knowledge, present research findings, and establish meaningful collaborations in agriculture, life sciences, and bioresource sciences.
              </p>
              <p className="text-gray-600 text-justify leading-relaxed mb-4 reveal-up stagger-3">
                Building on the accomplishments of previous editions, the symposium seeks to strengthen international and inter-institutional cooperation and provide researchers and students with opportunities to disseminate their work to a broader scientific community.
              </p>
              <p className="text-gray-600 text-justify leading-relaxed mb-4 reveal-up stagger-4">
                The symposium recognizes that increasingly complex challenges involving food and agriculture, biodiversity, natural resources, climate resilience, and sustainable development require interdisciplinary and collaborative approaches. By bringing together participants from different disciplines and institutions, the symposium aims to stimulate new ideas, strengthen research partnerships, and contribute to practical and sustainable solutions.
              </p>

              <div className="flex flex-wrap gap-4 mt-6 reveal-up stagger-5">
                <Link 
                  href="/program" 
                  className="inline-flex items-center gap-2 bg-linear-to-r from-[#1D3D6D] to-[#16305a] text-white px-6 py-3 rounded-md font-semibold hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
                >
                  Discover the Symposium <FaArrowRight />
                </Link>
                <Link 
                  href="/presentation-guidelines" 
                  className="inline-flex items-center gap-2 border-2 border-[#1D3D6D] text-[#1D3D6D] px-6 py-3 rounded-md font-semibold hover:bg-[#1D3D6D] hover:text-white transition-all"
                >
                  Presentation Guidelines
                </Link>
              </div>
            </div>

            {/* Right Side - Image with parallax */}
            <div
              className="relative scroll-lift reveal-right stagger-2"
              style={{ ["--scroll-y" as any]: `${(1 - aboutScroll.progress) * 30}px` }}
            >
              <div className="bg-linear-to-br from-[#1D3D6D]/5 to-[#D5A54D]/5 rounded-2xl p-8 border border-gray-200">
                <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
                  <Image 
                    src="/images/tracks/about-symposium.jpg" 
                    alt="About Symposium" 
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="flex flex-col items-center justify-center h-full bg-linear-to-br from-[#1D3D6D] to-[#0B2A4A] text-white p-30 text-center rounded-xl">
                            <h3 class="text-xl font-bold">Symposium Theme</h3>
                            <p class="text-sm opacity-80 mt-2">Converging Frontiers in Agri-Life and Bioresource Sciences: <br />
Science, Innovation, and Collaboration for a Resilient and Sustainable Future</p>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-[#D5A54D] text-white p-4 rounded-xl shadow-lg">
                  <FaUsers className="text-3xl" />
                </div>
                <div className="absolute -top-4 -left-4 bg-[#1D3D6D] text-white p-4 rounded-xl shadow-lg">
                  <FaLightbulb className="text-3xl" />
                </div>
              </div>
              {/* Date and Location */}
              <div className="mt-6 p-4 bg-[#F8FAFC] rounded-lg border border-zinc-200">
                <div className="flex items-center gap-3 mb-2">
                  <FaCalendarAlt className="text-[#D5A54D] text-lg" />
                  <span className="font-semibold text-[#0A2540]">March 11–13, 2027</span>
                </div>
                <div className="flex items-center gap-3 mb-1">
                  <FaMapMarkerAlt className="text-[#D5A54D] text-lg" />
                  <span className="font-semibold text-[#0A2540]">Roxas City, Capiz, Philippines</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5"></span>
                  <span className="text-sm text-[#D5A54D] font-medium">The Seafood Capital of the Philippines</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SYMPOSIUM AT A GLANCE ================= */}
      <section ref={glanceScroll.ref} className="py-16 bg-white">
        <div
          ref={glanceReveal.ref}
          className={`max-w-7xl mx-auto px-6 ${glanceReveal.inView ? "in-view" : ""}`}
        >
          <div className="text-center mb-12 reveal-up">
            <h2 className="text-3xl font-bold text-[#0A2540] uppercase">Symposium at a Glance</h2>
            <div className="w-16 h-1 gold-underline mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { icon: <FaCalendarAlt />, value: "3", label: "Days of Scientific Exchange" },
              { icon: <FaFileAlt />, value: "5", label: "Scientific Tracks" },
              { icon: <FaUsers />, value: "200+", label: "Target Participants" },
              { icon: <FaGlobe />, value: "Global", label: "Academic & Research Collaboration" },
              { icon: <FaMicrophone />, value: "Oral + Poster", label: "Research Presentations" },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`premium-card scroll-lift bg-linear-to-b from-[#F8FAFC] to-white rounded-xl border border-zinc-100 p-6 flex flex-col items-center text-center reveal-up stagger-${idx + 1}`}
                style={{ ["--scroll-y" as any]: `${(1 - glanceScroll.progress) * (20 - idx * 3)}px` }}
              >
                <div className="premium-icon w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm ring-1 ring-[#D5A54D]/20 mb-3">
                  <span className="text-2xl text-[#D5A54D]">{item.icon}</span>
                </div>
                <span className="text-2xl font-bold text-[#0A2540] mb-1">{item.value}</span>
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= OBJECTIVES ================= */}
      <section
        ref={objectivesScroll.ref}
        className="py-16 bg-linear-to-r from-[#0A2540] to-[#1a3a5c] relative overflow-hidden"
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 20%, rgba(213,165,77,0.18) 0%, rgba(0,0,0,0) 70%)",
          }}
        />
        <div
          ref={objectivesReveal.ref}
          className={`relative max-w-7xl mx-auto px-6 ${objectivesReveal.inView ? "in-view" : ""}`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white uppercase reveal-up">Symposium Objectives</h2>
            <div className="w-16 h-1 gold-underline mx-auto mt-4 rounded-full reveal-up stagger-1"></div>
            <p className="text-gray-300 mt-4 max-w-3xl mx-auto reveal-up stagger-2">
              The symposium generally aims to provide an international platform for the presentation, dissemination, and exchange of research and innovations in agriculture, life sciences, and bioresource sciences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((item, idx) => (
              <div
                key={idx}
                className={`reveal-up stagger-${(idx % 6) + 1} bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-[#F5A623] text-xl mt-1">
                    <FaCheckCircle />
                  </div>
                  <p className="text-white text-sm text-justify leading-relaxed">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHO SHOULD ATTEND ================= */}
      <section className="py-16 bg-white">
        <div
          ref={attendReveal.ref}
          className={`max-w-7xl mx-auto px-6 ${attendReveal.inView ? "in-view" : ""}`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A2540] uppercase reveal-up">Who Should Attend?</h2>
            <div className="w-16 h-1 gold-underline mx-auto mt-4 rounded-full reveal-up stagger-1"></div>
            <p className="text-gray-600 mt-4 reveal-up stagger-2">The symposium welcomes:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whoShouldAttend.map((item, idx) => (
              <div
                key={idx}
                className={`reveal-up stagger-${(idx % 6) + 1} premium-card flex items-center gap-3 bg-linear-to-b from-[#F8FAFC] to-white rounded-lg p-4 border border-zinc-100`}
              >
                <FaCheckCircle className="text-[#D5A54D] text-sm shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOST INSTITUTIONS ================= */}
      <section ref={hostScroll.ref} className="py-16 bg-[#F8FAFC]">
        <div
          ref={hostReveal.ref}
          className={`max-w-7xl mx-auto px-6 ${hostReveal.inView ? "in-view" : ""}`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A2540] uppercase reveal-up">About Us</h2>
            <div className="w-16 h-1 gold-underline mx-auto mt-4 rounded-full reveal-up stagger-1"></div>
            <p className="text-gray-600 mt-4 reveal-up stagger-2">
              The host agency and collaborating institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hostInstitutions.map((inst, idx) => (
              <div
                key={idx}
                className={`premium-card scroll-lift bg-white rounded-xl border border-zinc-100 p-6 text-center reveal-up stagger-${idx + 1}`}
                style={{ ["--scroll-y" as any]: `${(1 - hostScroll.progress) * (25 - idx * 4)}px` }}
              >
                {/* Logo */}
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image 
                    src={inst.logo}
                    alt={`${inst.name} Logo`}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-24 h-24 bg-[#1D3D6D] rounded-xl flex items-center justify-center mx-auto">
                            <span class="text-white text-2xl font-bold">${inst.logoFallback}</span>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
                <h3 className="font-bold text-[#0A2540] text-sm">{inst.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{inst.location}</p>
                <span className="inline-block bg-[#D5A54D]/20 text-[#D5A54D] text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {inst.role}
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">{inst.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ORGANIZING COMMITTEE ================= */}
      <section className="py-16 bg-white">
        <div
          ref={committeeReveal.ref}
          className={`max-w-7xl mx-auto px-6 ${committeeReveal.inView ? "in-view" : ""}`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A2540] uppercase reveal-up">Organizing Committee</h2>
            <div className="w-16 h-1 gold-underline mx-auto mt-4 rounded-full reveal-up stagger-1"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {committeeData.map((committee, idx) => (
              <div
                key={committee.id}
                className={`reveal-up stagger-${(idx % 6) + 1} premium-card border border-zinc-200 rounded-xl overflow-hidden bg-white`}
              >
                <button
                  onClick={() => toggleAccordion(committee.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-[#D5A54D]">
                      {committee.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0A2540]">
                        {committee.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {committee.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-[#D5A54D]">
                    {openAccordion === committee.id ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </button>
                
                {openAccordion === committee.id && (
                  <div className="px-5 pb-5 pt-2 border-t border-zinc-100 bg-[#F8FAFC]">
                    <div className="flex flex-wrap gap-2">
                      {committee.members.map((member, i) => (
                        <span 
                          key={i}
                          className="inline-block bg-white px-3 py-1.5 rounded-full text-sm text-gray-700 border border-zinc-200 shadow-sm"
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}