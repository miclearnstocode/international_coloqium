"use client";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UnderDevelopment from "../components/UnderDevelopment";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { 
  FaRegCheckCircle, 
  FaRegPaperPlane, 
  FaFileAlt, 
  FaUserTie, 
  FaQuoteLeft,
  FaTimes,
  FaUser
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

interface Speaker {
  name: string;
  role: string;
  org: string;
  img: string;
  bionote: string;
}

export default function ScientificTracks() {
  // Reveal hooks
  const heroReveal = useInView<HTMLDivElement>();
  const tracksReveal = useInView<HTMLDivElement>();
  const speakersReveal = useInView<HTMLDivElement>();
  const ctaReveal = useInView<HTMLDivElement>();

  // Scroll progress hooks
  const heroScroll = useScrollProgress<HTMLElement>();
  const tracksScroll = useScrollProgress<HTMLElement>();
  const speakersScroll = useScrollProgress<HTMLElement>();

  const [showDevModal, setShowDevModal] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

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

  const plenarySpeakers: Speaker[] = [
    {
      name: "Fika Yuliza Purba",
      role: "Plenary Speaker",
      org: "Hasanuddin University",
      img: "/plenaryspeaker/Dr Purba.png",
      bionote: "Dr. Fika Yuliza Purba is an Assistant Professor and Head of the Veterinary Professional Study Program at Hasanuddin University (UNHAS). Supported by the prestigious LPDP scholarship, she earned her Doctorate in Animal Science from Hiroshima University, Japan, where she also served as a visiting Assistant Professor (2021-2023). Her research specializes in dairy science, mammary gland immunity, mastitis, and ruminant reproductive disorders. She has published over 30 peer-reviewed articles in leading international journals—including the Journal of Dairy Science, Veterinary Immunology and Immunopathology, Journal of Veterinary Medical Science, and Veterinary World—and earned multiple honors from the Japanese Society of Animal Science, including the Excellent Presentation Award (2021). She is an active member of the Indonesian Veterinary Medical Association (PDHI), and now leads the Animal Production and Health Research Group (APHREG) UNHAS."
    },
    {
      name: "Joval N. Martinez",
      role: "Plenary Speaker",
      org: "University of St. La Salle",
      img: "/plenaryspeaker/Dr Martinez.png",
      bionote: "Dr. Joval N. Martinez is a registered microbiologist and Professor of Microbiology in the Department of Natural Sciences at the University of St. La Salle (USLS) in Bacolod City and the President and CEO of Co-Lab Life Sciences. He earned his Bachelor of Science in Biology from the University of the Philippines Visayas and his Doctor of Philosophy in Biology (Microbiology) from Tokyo Metropolitan University in Japan. Following his doctorate, he completed postdoctoral and visiting research fellowships at Hiroshima University, Japan. His research focuses on environmental microbiology, microbial ecology, metagenomics, and the biotechnological applications of phototrophic and extremophilic bacteria. As a scientific innovator and project leader, Dr. Martinez bridges academia and industry by developing microbial solutions for sustainable agriculture, functional foods, and healthcare in the Visayas."
    },
    {
      name: "Kwan-Suk Kim",
      role: "Plenary Speaker",
      org: "Chungbuk National University",
      img: "/plenaryspeaker/Dr Kim.png",
      bionote: "Dr. Kwan-Suk Kim is a Full Professor of Animal Science at Chungbuk National University in Cheongju, South Korea, specializing in livestock genomics and animal breeding. He holds a B.S. from Kyungpook National University and an M.S. and Ph.D. from Iowa State University, followed by postdoctoral fellowships at Iowa State University and Michigan State University before joining Chungbuk National University. Dr. Kim’s research focuses on identifying DNA markers linked to growth, feed efficiency, meat quality, heat tolerance, and disease resistance in swine and beef cattle. Notably, he demonstrated how porcine MC4R gene polymorphisms influence feed intake and growth rates in pigs. He also collaborates on international agricultural initiatives transferring genomic technologies to developing countries and conserving indigenous livestock diversity across Asia and Africa."
    },
    {
      name: "Yudai Inabu",
      role: "Plenary Speaker",
      org: "Hiroshima University",
      img: "", // Intentionally left blank for placeholder
      bionote: "Yudai Inabu, Ph.D. is a researcher and faculty member affiliated with the Graduate School of Integrated Sciences for Life at Hiroshima University (Department of Bioresource Science), with previous academic and research appointments at Kyushu University (Faculty of Agriculture) and the Japan Society for the Promotion of Science (JSPS). He completed his undergraduate and graduate studies in biosphere and bioresource sciences at Hiroshima University. His primary research focuses on animal science, specifically ruminant physiology, nutrition, and metabolic responses—such as studying glucagon-like peptide-1 (GLP-1) secretion and nutrient absorption in calves. He has authored numerous peer-reviewed publications and conference papers contributing to livestock health and dairy science."
    },
    {
      name: "Ching Fui Fui",
      role: "Plenary Speaker",
      org: "Universiti Malaysia Sabah",
      img: "/plenaryspeaker/DR FUI.png",
      bionote: "Assoc. Prof. Dr. Ching Fui Fui is a Malaysian marine scientist and academic serving as the Dean of the Institut Marin Borneo (IMB) at Universiti Malaysia Sabah (UMS). She earned both her bachelor’s and master’s degrees in aquaculture from UMS before completing her PhD in aquaculture at Kindai University in Japan, specializing in fish breeding and larval quality. Before assuming her role as Dean, Dr. Ching served as the Director and Deputy Director of the institute while overseeing operations at the UMS fish hatchery. Her research focuses on broodstock selection, larval rearing, and sustainable fish feeds for high-value species such as hybrid groupers, Napoleon wrasse, snappers, and short-finned eels. An active contributor to marine science and seafood security, she has published dozens of peer-reviewed studies and received both the UMS Young Scientist Award (2016) and the Leadership Figure in Academic Category Award (2018)."
    },
    {
      name: "Licia Colli",
      role: "Plenary Speaker",
      org: "Catholic University of Piacenza",
      img: "/plenaryspeaker/Dr Colli.png",
      bionote: "Associate Professor of Zootechnics and Genetics at the Catholic University of Piacenza, where she conducts research on genomic and epigenomic applications in livestock farming, biodiversity, and disease adaptation. A member of the ISAG-FAO Advisory Group and the BioDNA Center Executive Committee, she has extensive experience in modern and ancient DNA analysis. She serves as an editor for several international journals and contributed to the FAO Guidelines on the Genomic Characterization of Animal Genetic Resources. She has authored numerous publications, has over 5,900 citations, and an H-index of 41."
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-[#F8FBF5] to-white font-sans text-[#0A2540] flex flex-col overflow-x-hidden">
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
          background-image: linear-gradient(90deg, #76B947, #F0C674, #D5A54D);
          background-size: 200% 100%;
          animation: shimmerLine 4s linear infinite;
        }

        /*  Premium track card  */
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
          background: linear-gradient(135deg, rgba(118,185,71,0) 0%, rgba(118,185,71,0) 50%, rgba(118,185,71,0) 100%);
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
          background: radial-gradient(120% 80% at 50% 0%, rgba(76,195,247,0.16) 0%, rgba(76,195,247,0) 60%);
          opacity: 0;
          transition: opacity 0.55s ease;
          pointer-events: none;
          z-index: -1;
        }
        .track-card:hover {
          transform: translateY(-10px);
          border-color: rgba(118, 185, 71, 0.35);
          box-shadow:
            0 2px 4px rgba(11, 42, 74, 0.05),
            0 12px 24px -10px rgba(11, 42, 74, 0.16),
            0 32px 60px -20px rgba(11, 42, 74, 0.22),
            0 0 0 1px rgba(118, 185, 71, 0.05);
        }
        .track-card:hover::before {
          background: linear-gradient(135deg, rgba(118,185,71,0.9) 0%, rgba(213,165,77,0.5) 50%, rgba(76,195,247,0.9) 100%);
        }
        .track-card:hover::after { opacity: 1; }

        .track-icon-bubble {
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease;
        }
        .track-card:hover .track-icon-bubble {
          transform: scale(1.08) rotate(-6deg);
          box-shadow: 0 0 0 8px rgba(76,195,247,0.12), 0 12px 28px -10px rgba(76,195,247,0.45);
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
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), color 0.3s ease;
        }
        .track-item:hover svg {
          transform: scale(1.2) rotate(8deg);
          color: #76B947;
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

      {/* == PAGE HERO == */}
      <section
        ref={heroScroll.ref}
        className={`relative bg-white overflow-hidden border-b border-zinc-100 ${heroReveal.inView ? "in-view" : ""}`}
      >
        <div
          aria-hidden
          className="absolute top-0 left-0 w-80 h-80 bg-linear-to-br from-[#76B947]/10 to-transparent rounded-full blur-3xl -translate-y-1/3 -translate-x-1/4 pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-0 left-1/3 w-64 h-64 bg-linear-to-tr from-[#4FC3F7]/10 to-transparent rounded-full blur-3xl translate-y-1/4 pointer-events-none"
        />

        <div
          aria-hidden
          className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-60"
          style={{ transform: `translateY(${(heroScroll.progress - 0.5) * -30}px)` }}
        >
          <img
            src="https://res.cloudinary.com/xbloqjom/image/upload/v1794368582/earth.png"
            alt=""
            className="w-full h-full object-cover object-right opacity-20"
          />
        </div>

        <div
          ref={heroReveal.ref}
          className="max-w-350 mx-auto px-8 py-16 relative z-10"
        >
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8 reveal-up">
            <Link href="/" className="hover:text-[#76B947] transition-colors">
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
            The 3rd International Agri-Life & Bioresource Sciences Symposium welcomes original research and innovative ideas across a wide range of scientific disciplines.
          </p>
        </div>
      </section>

      {/* == OUR SCIENTIFIC TRACKS == */}
      <section ref={tracksScroll.ref} className="py-20 relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[70%] rounded-full bg-[#4FC3F7]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#76B947]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-1/3 left-0 h-56 w-56 rounded-full bg-[#F0C674]/10 blur-3xl" />
        <div
          ref={tracksReveal.ref}
          className={`relative max-w-350 mx-auto px-8 ${tracksReveal.inView ? "in-view" : ""}`}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0A2540] uppercase reveal-up">
              Our Scientific Tracks
            </h2>
            <div className="w-16 h-1 gold-underline mx-auto mt-4 reveal-up stagger-1 rounded-full"></div>
          </div>

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

      {/* == ABOUT THE PLENARY SPEAKERS == */}
      <section ref={speakersScroll.ref} className="py-20 bg-white relative overflow-hidden border-t border-zinc-100">
        <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-[60%] rounded-full bg-[#4FC3F7]/10 blur-3xl" />
        <div
          ref={speakersReveal.ref}
          className={`relative max-w-350 mx-auto px-8 ${speakersReveal.inView ? "in-view" : ""}`}
        >
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4 reveal-up">
              <div className="premium-icon w-16 h-16 rounded-full bg-[#F2F9FF] flex items-center justify-center ring-1 ring-[#4FC3F7]/30">
                <FaUserTie className="text-[#1D3D6D] text-2xl" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#0A2540] uppercase reveal-up stagger-1">
              About the Plenary Speakers
            </h2>
            <div className="w-16 h-1 gold-underline mx-auto mt-4 reveal-up stagger-2 rounded-full"></div>
            <p className="text-zinc-500 mt-4 max-w-2xl mx-auto reveal-up stagger-3">
              Learn more about the distinguished experts and thought leaders who will be sharing their insights at the symposium. Click on a profile to read their bionote.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plenarySpeakers.map((speaker, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedSpeaker(speaker)}
                className="track-card scroll-lift bg-[#F8FBF5] rounded-xl border border-zinc-200 p-6 text-center reveal-up cursor-pointer group"
                style={{ ["--scroll-y" as any]: `${(1 - speakersScroll.progress) * (25 - idx * 4)}px` }}
              >
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg bg-[#E2E8F0] flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                  {speaker.img ? (
                    <Image src={speaker.img} alt={speaker.name} fill className="object-cover" />
                  ) : (
                    <FaUser className="text-5xl text-zinc-400 group-hover:scale-110 transition-transform duration-500" />
                  )}
                </div>
                <h3 className="font-bold text-[#0A2540] text-lg mb-1 group-hover:text-[#1b5e20] transition-colors">{speaker.name}</h3>
                <p className="text-sm font-semibold text-[#1b5e20] mb-1">{speaker.role}</p>
                <p className="text-xs text-zinc-500 mb-4">{speaker.org}</p>
                
                <div className="bg-white rounded-lg p-4 border border-zinc-100 flex items-center justify-center gap-2 text-sm text-[#0A2540] font-medium group-hover:bg-[#f0f7eb] transition-colors">
                  <FaFileAlt className="text-[#D5A54D]" />
                  View Bionote
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* == SUBMIT CTA == */}
      <section
        ref={ctaReveal.ref}
        className={`pb-20 relative overflow-hidden ${ctaReveal.inView ? "in-view" : ""}`}
      >
        <div aria-hidden className="pointer-events-none absolute top-0 left-0 h-40 w-40 rounded-full bg-[#F0C674]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full bg-[#4FC3F7]/10 blur-3xl" />
        <div className="relative max-w-350 mx-auto px-8">
          <div className="track-card reveal-up bg-white rounded-xl border border-zinc-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="track-icon-bubble w-16 h-16 bg-[#F2F9FF] rounded-full flex items-center justify-center ring-1 ring-[#4FC3F7]/30">
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
              className="premium-btn bg-linear-to-r from-[#0A5C0A] to-[#0d6b0d] text-white px-8 py-4 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 shrink-0 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Submit Abstract <FaRegPaperPlane className="rotate-[-20deg]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Speaker Modal */}
      {selectedSpeaker && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#0A2540]/70 backdrop-blur-sm transition-opacity"
            style={{ animation: "fadeIn 0.3s ease-out" }}
            onClick={() => setSelectedSpeaker(null)}
          />
          
          {/* Modal Content */}
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            style={{ animation: "scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedSpeaker(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-zinc-500 hover:text-red-500 hover:bg-white transition-all shadow-sm"
            >
              <FaTimes />
            </button>

            {/* Left Side: Image */}
            <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-[#E2E8F0] shrink-0">
              {selectedSpeaker.img ? (
                <Image 
                  src={selectedSpeaker.img} 
                  alt={selectedSpeaker.name} 
                  fill 
                  className="object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                  <FaUser className="text-6xl mb-4 opacity-50" />
                  <span className="text-sm font-medium">Image Coming Soon</span>
                </div>
              )}
              {/* Subtle gradient overlay for mobile */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:hidden pointer-events-none" />
            </div>

            {/* Right Side: Details & Bionote */}
            <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl font-bold text-[#0A2540] mb-2">{selectedSpeaker.name}</h3>
                <p className="text-[#1b5e20] font-semibold mb-1">{selectedSpeaker.role}</p>
                <p className="text-sm text-zinc-500">{selectedSpeaker.org}</p>
              </div>

              <div className="relative">
                <FaQuoteLeft className="absolute top-0 left-0 text-[#D5A54D] text-2xl opacity-20 -z-10" />
                <p className="text-zinc-600 leading-relaxed text-sm md:text-base text-justify whitespace-pre-line relative z-10 pl-4 border-l-2 border-[#D5A54D]/30">
                  {selectedSpeaker.bionote}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Under Development Modal (For Speaker Profiles Button) */}
      <UnderDevelopment
        open={showDevModal}
        onClose={() => setShowDevModal(false)}
        title="Plenary Speaker Profiles Coming Soon"
        description="We are currently finalizing the confirmed list of our distinguished plenary speakers. Their full photos and comprehensive bionotes will be published here shortly."
        notes={[
          "The scientific committee is confirming final speaker lineups.",
          "High-resolution photos and full academic bionotes will be included.",
          "An official announcement will be sent to all registered participants once live.",
        ]}
        contactEmail="internationalsymposium@capsu.edu.ph"
      />

      <Footer />
    </div>
  );
}

//  Sub-component for each track card 
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
        <div className="track-icon-bubble w-24 h-24 rounded-full bg-[#F2F9FF] p-2 flex items-center justify-center ring-1 ring-[#4FC3F7]/20">
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