"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ContentProvider, useContent } from "@/app/context/ContentContext";
import { 
  FaCoffee, FaBullhorn, FaMicrophoneAlt, FaGraduationCap, FaUtensils, 
  FaComments, FaUsers, FaGlassCheers, FaCalendarAlt, FaDownload, 
  FaCheckCircle, FaRegEdit, FaLightbulb, FaMarker, FaRegCircle, FaMugHot, FaBookOpen, FaLeaf, FaReact, FaMortarPestle,
  FaPastafarianism, FaViadeoSquare, FaFileAlt, FaBell, FaCalendarCheck, FaEdit, FaClock, FaPenFancy, FaRocket, FaPrint, FaEnvelope,
  FaBus, FaMapMarkedAlt, FaChurch, FaLandmark, FaWater, FaUmbrellaBeach,
  FaCamera, FaSuitcase, FaMapSigns, FaUniversity, FaConciergeBell, FaBuilding, 
  FaPlaneArrival, FaShip, FaAward, FaTrophy, FaHandshake, FaUserTie, 
  FaClipboardCheck, FaRegSmileBeam, FaRegHandshake, FaRegStar, FaUsersCog, FaSignOutAlt
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
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.75 bg-transparent pointer-events-none">
      <div
        className="h-full origin-left bg-linear-to-r from-[#76B947] via-[#F0C674] to-[#1D3D6D] shadow-[0_0_12px_rgba(213,165,77,0.6)]"
        style={{ transform: `scaleX(${progress})`, transition: "transform 0.08s linear" }}
      />
    </div>
  );
}

// Helper to map string icon names from DB to React Icons
const getIcon = (iconName: string) => {
  const icons: Record<string, React.ReactNode> = {
    // Original Icons
    edit: <FaRegEdit />, bullhorn: <FaBullhorn />, circle: <FaRegCircle />, microphone: <FaMicrophoneAlt />,
    graduation: <FaGraduationCap />, lightbulb: <FaLightbulb />, marker: <FaMarker />, mug: <FaMugHot />,
    comments: <FaComments />, utensils: <FaUtensils />, book: <FaBookOpen />, leaf: <FaLeaf />, react: <FaReact />,
    pastafarianism: <FaPastafarianism />, mortar: <FaMortarPestle />, viadeo: <FaViadeoSquare />, users: <FaUsers />,
    glass: <FaGlassCheers />, coffee: <FaCoffee />, rocket: <FaRocket />, file: <FaFileAlt />, bell: <FaBell />,
    calendar_check: <FaCalendarCheck />, envelope: <FaEnvelope />, pen: <FaPenFancy />, print: <FaPrint />, calendar: <FaCalendarAlt />,
    clock: <FaClock />,
    
    // --- NEW TRAVEL & TOUR ICONS ---
    bus: <FaBus />, 
    "map-marked": <FaMapMarkedAlt />, 
    church: <FaChurch />, 
    landmark: <FaLandmark />, 
    water: <FaWater />, 
    beach: <FaUmbrellaBeach />, 
    camera: <FaCamera />, 
    suitcase: <FaSuitcase />, 
    "map-signs": <FaMapSigns />, 
    university: <FaUniversity />, 
    concierge: <FaConciergeBell />, 
    museum: <FaBuilding />, 
    plane: <FaPlaneArrival />, 
    ship: <FaShip />,
    award: <FaAward />,
    trophy: <FaTrophy />,
    handshake: <FaHandshake />,
    "user-tie": <FaUserTie />,
    "clipboard-check": <FaClipboardCheck />,
    smile: <FaRegSmileBeam />,
    "reg-handshake": <FaRegHandshake />,
    star: <FaRegStar />,
    "users-cog": <FaUsersCog />,
    "sign-out": <FaSignOutAlt />,
  };
  return icons[iconName?.toLowerCase()] || <FaRegCircle />;
};

function ProgramPageInner() {
  const [activeDay, setActiveDay] = useState(1);
  const { getField, getList } = useContent();

  // Reveal hooks
  const heroReveal = useInView<HTMLDivElement>();
  const keyDatesReveal = useInView<HTMLDivElement>();
  const glanceReveal = useInView<HTMLDivElement>();
  const scheduleReveal = useInView<HTMLDivElement>();
  const downloadReveal = useInView<HTMLDivElement>();

  // Scroll progress hooks
  const heroScroll = useScrollProgress<HTMLElement>();
  const keyDatesScroll = useScrollProgress<HTMLElement>();
  const glanceScroll = useScrollProgress<HTMLElement>();
  const scheduleScroll = useScrollProgress<HTMLElement>();

  // Fetch data dynamically from the database (No fallback arrays)
  const keyDatesData = getList('key_dates_items') || [];
  const glanceData = getList('glance_items') || [];
  const day1Schedule = getList('day1_schedule') || [];
  const day2Schedule = getList('day2_schedule') || [];
  const day3Schedule = getList('day3_schedule') || [];
  const highlightsData = getList('highlights_items') || [];

  const getScheduleData = () => {
    switch(activeDay) {
      case 1: return day1Schedule;
      case 2: return day2Schedule;
      case 3: return day3Schedule;
      default: return day1Schedule;
    }
  };

  const scheduleData = getScheduleData();

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-[#F8FBF5] to-white font-sans text-[#0A2540] overflow-x-hidden">
      <ScrollProgressBar />

      <style jsx global>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(3deg); }
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

        .float-slow { animation: floatSlow 9s ease-in-out infinite; }

        .gold-underline {
          background-image: linear-gradient(90deg, #76B947, #F0C674, #D5A54D);
          background-size: 200% 100%;
          animation: shimmerLine 4s linear infinite;
        }

        /*  Premium card  */
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
          background: linear-gradient(135deg, rgba(118,185,71,0) 0%, rgba(118,185,71,0) 50%, rgba(118,185,71,0) 100%);
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
          background: radial-gradient(120% 80% at 50% 0%, rgba(76,195,247,0.16) 0%, rgba(76,195,247,0) 60%);
          opacity: 0;
          transition: opacity 0.55s ease;
          pointer-events: none;
          z-index: -1;
        }
        .premium-card:hover {
          transform: translateY(-10px);
          border-color: rgba(118, 185, 71, 0.35);
          box-shadow:
            0 2px 4px rgba(11, 42, 74, 0.05),
            0 12px 24px -10px rgba(11, 42, 74, 0.16),
            0 32px 60px -20px rgba(11, 42, 74, 0.22),
            0 0 0 1px rgba(118, 185, 71, 0.05);
        }
        .premium-card:hover::before {
          background: linear-gradient(135deg, rgba(118,185,71,0.9) 0%, rgba(213,165,77,0.5) 50%, rgba(76,195,247,0.9) 100%);
        }
        .premium-card:hover::after { opacity: 1; }

        .premium-icon {
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease;
        }
        .premium-card:hover .premium-icon {
          transform: scale(1.08) rotate(-6deg);
          box-shadow: 0 0 0 6px rgba(76,195,247,0.12), 0 8px 20px -8px rgba(76,195,247,0.45);
        }

        /*  Schedule row hover  */
        .schedule-row {
          transition: background-color 0.35s ease, transform 0.35s ease;
        }
        .schedule-row:hover {
          background-color: rgba(118, 185, 71, 0.08);
          transform: translateX(4px);
        }
        .schedule-row:hover .schedule-icon {
          transform: scale(1.15) rotate(-8deg);
          background-color: rgba(118, 185, 71, 0.15);
          color: #1b5e20;
        }
        .schedule-icon {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.35s ease, color 0.3s ease;
        }

        /*  Key date row hover  */
        .keydate-row {
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .keydate-row:hover {
          background-color: rgba(118, 185, 71, 0.08);
        }
        .keydate-row:hover .keydate-icon {
          transform: scale(1.2) rotate(8deg);
          color: #4FC3F7;
        }
        .keydate-icon {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), color 0.3s ease;
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

      {/* == PAGE HERO == */}
      <section
        ref={heroScroll.ref}
        className={`relative bg-white overflow-hidden border-b border-zinc-100 ${heroReveal.inView ? "in-view" : ""}`}
      >
        {/* Decorative orbs — green + sky blue */}
        <div
          aria-hidden
          className="absolute top-0 left-0 w-80 h-80 bg-linear-to-br from-[#76B947]/10 to-transparent rounded-full blur-3xl -translate-y-1/3 -translate-x-1/4 float-slow pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-0 left-1/3 w-64 h-64 bg-linear-to-tr from-[#4FC3F7]/10 to-transparent rounded-full blur-3xl translate-y-1/4 float-slow pointer-events-none"
        />

        <div
          ref={heroReveal.ref}
          className="max-w-7xl mx-auto px-6 py-16 relative z-10"
        >
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6 reveal-up">
            <Link href="/" className="hover:text-[#76B947] transition-colors">
              {getField('hero.breadcrumb_home')}
            </Link>
            <span className="text-zinc-300">›</span>
            <span className="text-[#0A2540] font-medium">{getField('hero.breadcrumb_current')}</span>
          </div>

          <h1 className="text-5xl font-bold text-[#0A2540] mb-4 reveal-up stagger-1">
            {getField('hero.title')}
          </h1>
          <div className="w-16 h-1 gold-underline mb-6 reveal-up stagger-2 rounded-full"></div>
          
          <p className="text-lg text-gray-600 max-w-lg leading-relaxed reveal-up stagger-3">
            {getField('hero.description')}
          </p>
        </div>

        {/* Abstract Map Background */}
        <div
          className="absolute right-0 top-0 -bottom-5 w-1/2 opacity-90 pointer-events-none"
          style={{ transform: `translateY(${(heroScroll.progress - 0.5) * -40}px)` }}
        >
          <Image 
            src={getField('hero.background_image') || "/images/globe.jpg"} 
            alt="World Map" 
            fill 
            loading="eager"
            className="object-cover object-right opacity-40"
          />
          <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-[#76B947] rounded-full shadow-lg"></div>
          <div className="absolute top-1/2 right-1/2 w-4 h-4 bg-[#4FC3F7] rounded-full shadow-lg"></div>
          <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-[#F0C674] rounded-full shadow-lg"></div>
        </div>
      </section>

      {/* == KEY DATES == */}
      <section
        ref={keyDatesScroll.ref}
        className="py-8 bg-linear-to-br from-[#0B2A4A] via-[#1D3D6D] to-[#153A61] relative overflow-hidden"
      >
        {/* Decorative glows — green + gold + sky */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{ background: "radial-gradient(60% 50% at 20% 20%, rgba(118,185,71,0.22) 0%, rgba(0,0,0,0) 70%)" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(50% 50% at 80% 80%, rgba(76,195,247,0.20) 0%, rgba(0,0,0,0) 70%)" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(40% 40% at 90% 10%, rgba(213,165,77,0.18) 0%, rgba(0,0,0,0) 70%)" }}
        />
        <div
          ref={keyDatesReveal.ref}
          className={`relative max-w-7xl mx-auto px-6 ${keyDatesReveal.inView ? "in-view" : ""}`}
        >
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-3 reveal-up">
              <FaClock className="text-[#76B947] text-3xl" />
              <h2 className="text-3xl font-bold text-white uppercase">{getField('key_dates.title')}</h2>
            </div>
            <div className="w-16 h-1 gold-underline mx-auto reveal-up stagger-1 rounded-full"></div>
            <p className="text-gray-300 mt-3 text-sm reveal-up stagger-2">
              {getField('key_dates.description')}
            </p>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-xl reveal-up stagger-3">
            <div className="grid grid-cols-12 bg-[#0B2A4A] text-white px-4 py-2">
              <div className="col-span-3 font-bold uppercase text-xs">Date</div>
              <div className="col-span-4 font-bold uppercase text-xs">Event</div>
              <div className="col-span-5 font-bold uppercase text-xs">Description</div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {keyDatesData.map((item: any, idx: number) => (
                <div 
                  key={idx}
                  className={`keydate-row grid grid-cols-12 px-4 py-3 items-center border-b border-zinc-100 last:border-b-0 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'
                  }`}
                >
                  <div className="col-span-3 flex items-center gap-2">
                    <span className="keydate-icon text-[#76B947] text-sm shrink-0">{getIcon(item.icon)}</span>
                    <span className="font-bold text-[#0A2540] text-sm">{item.date}</span>
                  </div>
                  <div className="col-span-4">
                    <span className="font-semibold text-gray-700 text-sm">{item.event}</span>
                  </div>
                  <div className="col-span-5">
                    <span className="text-sm text-gray-600">{item.description}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 px-4 py-2 border-t border-zinc-200 flex justify-between items-center">
              <span className="text-xs text-gray-500">{getField('key_dates.footer_note')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* == AT A GLANCE == */}
      <section ref={glanceScroll.ref} className="py-12 relative overflow-hidden bg-white">
        {/* Ambient palette glows */}
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[70%] rounded-full bg-[#4FC3F7]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#76B947]/10 blur-3xl" />
        
        <div
          ref={glanceReveal.ref}
          className={`relative max-w-7xl mx-auto px-6 ${glanceReveal.inView ? "in-view" : ""}`}
        >
          <div className="text-center mb-8 reveal-up">
            <h2 className="text-3xl font-bold text-[#0A2540] uppercase">{getField('glance.title')}</h2>
            <div className="w-16 h-1 gold-underline mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {glanceData.map((item: any, idx: number) => (
              <div
                key={idx}
                className={`premium-card scroll-lift bg-linear-to-b from-[#F7FBF3] to-white rounded-xl border border-zinc-100 p-4 flex flex-col items-center text-center reveal-up stagger-${idx + 1}`}
                style={{ ["--scroll-y" as any]: `${(1 - glanceScroll.progress) * (20 - idx * 3)}px` }}
              >
                <div className="premium-icon w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm ring-1 ring-[#76B947]/25 mb-2">
                  <span className="text-2xl text-[#1b5e20]">{getIcon(item.icon)}</span>
                </div>
                <span className="text-3xl font-bold text-green-700 mb-1">{item.value}</span>
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* == SCHEDULE == */}
      <section ref={scheduleScroll.ref} className="pb-12 relative overflow-hidden bg-white">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[70%] rounded-full bg-[#4FC3F7]/5 blur-3xl" />
        
        <div
          ref={scheduleReveal.ref}
          className={`relative max-w-7xl mx-auto px-6 ${scheduleReveal.inView ? "in-view" : ""}`}
        >
          {/* Day Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 rounded-t-xl overflow-hidden border border-zinc-200 reveal-up">
            {[1, 2, 3].map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`p-4 flex items-center justify-center gap-3 transition-all duration-300 ${
                  activeDay === day 
                    ? 'bg-[#E9F5E1] text-[#1b5e20] shadow-[inset_0_-4px_0_0_#76B947]' 
                    : 'bg-white text-gray-500 hover:bg-[#F8FBF5] hover:text-[#0A2540]'
                } ${day === 2 ? 'border-x border-zinc-200' : ''}`}
              >
                <FaCalendarAlt className={`text-2xl transition-transform duration-300 ${activeDay === day ? 'text-[#76B947] scale-110' : 'text-gray-400'}`} />
                <div className="text-left">
                  <p className={`font-bold text-base leading-tight ${activeDay === day ? 'text-[#1b5e20]' : 'text-gray-700'}`}>
                    {getField(`day_tabs.day${day}_label`)}
                  </p>
                  <p className={`text-xs ${activeDay === day ? 'text-[#1b5e20]/70' : 'text-gray-500'}`}>
                    {getField(`day_tabs.day${day}_date`)}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Schedule Table */}
          <div className="border border-t-0 border-zinc-200 bg-white rounded-b-xl overflow-hidden shadow-sm reveal-up stagger-1">
            {/* Light header instead of dark navy */}
            <div className="grid grid-cols-12 bg-[#F8FBF5] text-[#0A2540] border-b border-zinc-200 px-4 py-3 sticky top-0 z-10">
              <div className="col-span-3 font-bold uppercase text-xs tracking-wider">Time</div>
              <div className="col-span-9 font-bold uppercase text-xs tracking-wider">Session / Activity</div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {scheduleData.map((row: any, idx: number) => (
                <div 
                  key={`${activeDay}-${idx}`}
                  className={`schedule-row grid grid-cols-12 px-4 py-3 items-start border-b border-zinc-100 last:border-b-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FBF5]/40'}`}
                >
                  <div className="col-span-3 text-xs font-bold text-[#1D3D6D] pt-1">{row.time}</div>
                  <div className="col-span-9 flex gap-3">
                    <div className="schedule-icon w-8 h-8 rounded-full bg-[#F2F9FF] text-[#1D3D6D] flex items-center justify-center text-sm shrink-0 border border-[#4FC3F7]/20">
                      {getIcon(row.icon)}
                    </div>
                    <div>
                      {row.title && <p className="font-bold text-[#0A2540] text-sm mb-0.5">{row.title}</p>}
                      {row.subtitle && (
                        <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">{row.subtitle}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* == DOWNLOAD & HIGHLIGHTS == */}
      <section ref={downloadReveal.ref} className={`bg-linear-to-b from-white via-[#F8FBF5] to-white py-12 border-t border-zinc-100 relative overflow-hidden ${downloadReveal.inView ? "in-view" : ""}`}>
        <div aria-hidden className="pointer-events-none absolute top-0 left-0 h-40 w-40 rounded-full bg-[#F0C674]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full bg-[#4FC3F7]/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left: Download */}
          <div className="premium-card reveal-up stagger-1 bg-white border border-zinc-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#0A2540] mb-2 uppercase">{getField('download.title')}</h3>
              <div className="w-10 h-1 gold-underline mb-3 rounded-full"></div>
              <p className="text-gray-600 text-sm mb-4">
                {getField('download.description')}
              </p>
              <a 
                href={getField('download.file_url')} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-linear-to-r from-[#0A5C0A] to-[#0d6b0d] text-white px-4 py-2 rounded-md font-bold text-sm hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <FaDownload /> {getField('download.button_text')}
              </a>
            </div>
            <div className="w-32 shrink-0 bg-white shadow-lg border border-zinc-200 p-3 rounded-lg flex flex-col items-center text-center">
              <div className="w-20 h-28 bg-[#F2F9FF] mb-2 relative overflow-hidden rounded">
                <Image src={getField('download.cover_image') || "/program-cover.png"} alt="Program Cover" fill className="object-cover" />
              </div>
              <p className="text-[8px] font-bold text-gray-700 mt-1 leading-tight">INTERNATIONAL<br/>SCIENCE<br/>SYMPOSIUM<br/>2027</p>
            </div>
          </div>

          {/* Right: Highlights */}
          <div className="premium-card reveal-up stagger-2 bg-white border border-zinc-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#0A2540] mb-2 uppercase">{getField('highlights.title')}</h3>
              <div className="w-10 h-1 gold-underline mb-3 rounded-full"></div>
              <ul className="space-y-2">
                {highlightsData.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                    <FaCheckCircle className="text-[#76B947] mt-0.5 text-sm shrink-0" /> {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-40 shrink-0 h-24 rounded-xl overflow-hidden bg-[#F2F9FF] shadow-lg relative">
              <Image src={getField('highlights.image') || "/conference-photo.jpg"} alt="Conference" fill className="object-cover" />
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function ProgramPage() {
  return (
    <ContentProvider pageSlug="program">
      <ProgramPageInner />
    </ContentProvider>
  );
}