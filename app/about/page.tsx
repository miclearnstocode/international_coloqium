"use client";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaMicrophone, 
  FaFileAlt, FaGlobe, FaUniversity, FaLightbulb, FaHandshake,
  FaRocket, FaLeaf, FaFish, FaFlask, FaUtensils, FaChartLine,
  FaAward, FaBookOpen, FaUserGraduate, FaSearch, FaClock,
  FaCheckCircle, FaArrowRight, FaQuoteLeft, FaQuoteRight,
  FaBuilding, FaRegBuilding, FaClipboardCheck
} from "react-icons/fa";

export default function AboutPage() {
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

  const keyDates = [
    { date: "October 5, 2026", event: "Opening of Abstract Submission and Registration" },
    { date: "January 10, 2027", event: "Abstract Submission Deadline" },
    { date: "January 25, 2027", event: "Final Notification of Acceptance" },
    { date: "December 18, 2026", event: "Early Bird Registration Deadline" },
    { date: "January 10, 2027", event: "Final Registration Deadline" },
    { date: "January 29, 2027", event: "Finalization of Scientific Program" },
    { date: "February 26, 2027", event: "Release of Final Program" },
    { date: "March 11-13, 2027", event: "3rd International Agri-Life & Bioresource Science Symposium" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0A2540]">
      <Header />

      {/* ================= PAGE HERO ================= */}
      <section className="relative bg-white overflow-hidden border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
            <Link href="/" className="hover:text-[#F5A623] transition-colors">
              Home
            </Link>
            <span className="text-zinc-300">›</span>
            <span className="text-[#0A2540] font-medium">About</span>
          </div>

          <h1 className="text-5xl font-bold text-[#0A2540] mb-4">About the Symposium</h1>
          <div className="w-16 h-1 bg-[#F5A623] mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed font-semibold">
            Where disciplines meet. Where collaboration begins.
          </p>
        </div>
      </section>

      {/* ================= ABOUT CONTENT ================= */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div>
              <h2 className="text-2xl font-bold text-[#0A2540] mb-4">
                About the 3rd International Agri-Life & Bioresource Sciences Symposium
              </h2>
              <div className="w-16 h-1 bg-[#F5A623] mb-6"></div>
              <p className="text-gray-600 leading-relaxed mb-4">
                The <strong>3rd International Agri-Life & Bioresource Sciences Symposium</strong> provides an international platform for the presentation and exchange of research, innovations, and emerging ideas in agriculture, life sciences, and bioresource sciences.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Building on previous editions, the symposium seeks to deepen international and inter-institutional collaboration while creating opportunities for researchers, faculty members, students, government representatives, industry partners, and other stakeholders to address challenges involving food systems, biodiversity, natural resources, climate resilience, and sustainable development.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Link 
                  href="/program" 
                  className="inline-flex items-center gap-2 bg-[#1D3D6D] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#16305a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
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

            {/* Right Side - Image Placeholder */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#1D3D6D]/5 to-[#D5A54D]/5 rounded-2xl p-8 border border-gray-200">
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
                          <div class="flex flex-col items-center justify-center h-full bg-gradient-to-br from-[#1D3D6D] to-[#0B2A4A] text-white p-8 text-center rounded-xl">
                            <div class="text-6xl mb-4">🌾</div>
                            <h3 class="text-xl font-bold">3rd International Agri-Life & Bioresource Science Symposium</h3>
                            <p class="text-sm opacity-80 mt-2">Science, Innovation & Collaboration for a Resilient and Sustainable Future</p>
                            <div class="flex items-center gap-4 mt-4 text-xs opacity-70">
                              <span>📅 March 11-13, 2027</span>
                              <span>📍 Roxas City, Capiz, Philippines</span>
                            </div>
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
            </div>
          </div>
        </div>
      </section>

      {/* ================= SYMPOSIUM AT A GLANCE ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A2540] uppercase">Symposium at a Glance</h2>
            <div className="w-16 h-1 bg-[#F5A623] mx-auto mt-4"></div>
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
                className="bg-[#F8FAFC] rounded-xl border border-zinc-100 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow"
              >
                <div className="text-3xl text-[#D5A54D] mb-3">{item.icon}</div>
                <span className="text-2xl font-bold text-[#0A2540] mb-1">{item.value}</span>
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= OBJECTIVES ================= */}
      <section className="py-16 bg-gradient-to-r from-[#0A2540] to-[#1a3a5c]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white uppercase">Symposium Objectives</h2>
            <div className="w-16 h-1 bg-[#F5A623] mx-auto mt-4"></div>
            <p className="text-gray-300 mt-4">
              The symposium generally aims to provide an international platform for the presentation, dissemination, and exchange of research and innovations in agriculture, life sciences, and bioresource sciences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="text-[#F5A623] text-xl mt-1">
                    <FaCheckCircle />
                  </div>
                  <p className="text-white text-sm leading-relaxed">
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOST INSTITUTIONS WITH LOGOS ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A2540] uppercase">About Us</h2>
            <div className="w-16 h-1 bg-[#F5A623] mx-auto mt-4"></div>
            <p className="text-gray-600 mt-4">
              The host agency and collaborating institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hostInstitutions.map((inst, idx) => (
              <div 
                key={idx}
                className="bg-[#F8FAFC] rounded-xl border border-zinc-100 p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1"
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


      <Footer />
    </div>
  );
}