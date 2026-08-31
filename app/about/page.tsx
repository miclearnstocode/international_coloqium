"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaMicrophone, 
  FaFileAlt, FaGlobe, FaUniversity, FaLightbulb, FaHandshake,
  FaRocket, FaLeaf, FaFish, FaFlask, FaUtensils, FaChartLine,
  FaAward, FaBookOpen, FaUserGraduate, FaSearch, FaClock,
  FaCheckCircle, FaArrowRight, FaQuoteLeft, FaQuoteRight,
  FaBuilding, FaRegBuilding, FaClipboardCheck, FaChevronDown,
  FaChevronUp, FaUserTie, FaUsersCog, FaUserCog, FaUserFriends,
  FaUserGraduate as FaUserGraduateIcon, FaChalkboardTeacher,
  FaMoneyBillWave, FaTruck, FaPlane, FaBullhorn, FaUserMd,
  FaUserAstronaut, FaIndustry, FaCity, FaTree, FaWater,
  FaSeedling, FaMicroscope, FaFlask as FaFlaskIcon,
  FaUniversity as FaUniversityIcon, FaSchool, FaUser,
  FaUserPlus, FaUserCircle, FaUserCheck, FaUserClock
} from "react-icons/fa";

export default function AboutPage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

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
            Advancing research. Building partnerships. Creating science-based solutions for a resilient and sustainable future.
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
                About the 3RD INTERNATIONAL AGRI-LIFE & BIORESOURCE SCIENCES SYMPOSIUM
              </h2>
              <div className="w-16 h-1 bg-[#F5A623] mb-6"></div>
              <p className="text-gray-600 text-justify leading-relaxed mb-4">
                The <strong>3rd International Agri-Life & Bioresource Sciences Symposium</strong> is envisioned as an international academic and scientific platform that brings together researchers, faculty members, students, government representatives, industry partners, and other stakeholders to exchange knowledge, present research findings, and establish meaningful collaborations in agriculture, life sciences, and bioresource sciences.
              </p>
              <p className="text-gray-600 text-justify leading-relaxed mb-4">
                Building on the accomplishments of previous editions, the symposium seeks to strengthen international and inter-institutional cooperation and provide researchers and students with opportunities to disseminate their work to a broader scientific community.
              </p>
              <p className="text-gray-600 text-justify leading-relaxed mb-4">
                The symposium recognizes that increasingly complex challenges involving food and agriculture, biodiversity, natural resources, climate resilience, and sustainable development require interdisciplinary and collaborative approaches. By bringing together participants from different disciplines and institutions, the symposium aims to stimulate new ideas, strengthen research partnerships, and contribute to practical and sustainable solutions.
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
                          <div class="flex flex-col items-center justify-center h-full bg-gradient-to-br from-[#1D3D6D] to-[#0B2A4A] text-white p-30 text-center rounded-xl">
                            
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
                  <div className="text-[#F5A623]  text-xl mt-1">
                    <FaCheckCircle />
                  </div>
                  <p className="text-white text-sm text-justify leading-relaxed">
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHO SHOULD ATTEND ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A2540] uppercase">Who Should Attend?</h2>
            <div className="w-16 h-1 bg-[#F5A623] mx-auto mt-4"></div>
            <p className="text-gray-600 mt-4">
              The symposium welcomes:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whoShouldAttend.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-3 bg-[#F8FAFC] rounded-lg p-4 border border-zinc-100 hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <FaCheckCircle className="text-[#D5A54D] text-sm flex-shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOST INSTITUTIONS WITH LOGOS ================= */}
      <section className="py-16 bg-[#F8FAFC]">
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
                className="bg-white rounded-xl border border-zinc-100 p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1"
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
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A2540] uppercase">Organizing Committee</h2>
            <div className="w-16 h-1 bg-[#F5A623] mx-auto mt-4"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {committeeData.map((committee) => (
              <div 
                key={committee.id}
                className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
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
                      {committee.members.map((member, idx) => (
                        <span 
                          key={idx}
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