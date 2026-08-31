"use client";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FaUniversity, FaHandshake, FaUsers, FaGlobe, 
  FaCheckCircle, FaArrowRight, FaEnvelope, FaBuilding,
  FaRegBuilding, FaUserFriends, FaMicroscope, FaFlask,
  FaLeaf, FaFish, FaUtensils, FaChartLine, FaAward,
  FaTrophy, FaMedal, FaStar, FaUserTie
} from "react-icons/fa";

export default function PartnerInstitutionsPage() {
  // ================= CONFIRMED PARTNERS DATA =================
  // Add confirmed partners here with their logo path and name
  const hostInstitution = {
    name: "Capiz State University",
    logo: "/images/capsu-logo.png",
    role: "Implementing Institution",
    location: "Capiz, Philippines"
  };

  const coHosts = [
    {
      name: "Hiroshima University",
      logo: "/images/hiroshima_logo.webp",
      location: "Japan"
    },
    {
      name: "Visayas State University",
      logo: "/images/vsu-logo.png",
      location: "Philippines"
    },
    {
      name: "University of San Carlos",
      logo: "/images/usc-logo.svg",
      location: "Philippines"
    }
  ];

  // Add confirmed institutional partners here
  const institutionalPartners = [
    // Example:
    // { name: "Partner Name", logo: "/images/partners/partner-logo.png" },
  ];

  // Add confirmed sponsors here - all on the same level
  const sponsors = [
    // Example:
    // { name: "Sponsor Name", logo: "/images/partners/sponsor-logo.png" },
  ];

  // Placeholder for empty sections
  const placeholderCount = 6;

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
            <span className="text-[#0A2540] font-medium">Partners</span>
          </div>

          <h1 className="text-5xl font-bold text-[#0A2540] mb-4">Partners & Collaborating Institutions</h1>
          <div className="w-16 h-1 bg-[#F5A623] mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed font-semibold">
            Advancing science through institutional partnership and international collaboration.
          </p>
        </div>
      </section>

      {/* ================= HOST INSTITUTION ================= */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#0A2540] uppercase">Organized by</h2>
            <div className="w-12 h-1 bg-[#F5A623] mx-auto mt-3"></div>
          </div>

          <div className="flex justify-center">
            <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm w-full max-w-md">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <Image 
                    src={hostInstitution.logo}
                    alt={hostInstitution.name}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-32 h-32 bg-[#1D3D6D] rounded-xl flex items-center justify-center">
                            <span class="text-white text-2xl font-bold">${hostInstitution.name.split(' ').map(w => w[0]).join('')}</span>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
                <h3 className="font-bold text-[#0A2540] text-xl">{hostInstitution.name}</h3>
                <p className="text-sm text-gray-500">{hostInstitution.role}</p>
                <p className="text-sm text-gray-400">{hostInstitution.location}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center mt-4 max-w-2xl mx-auto">
            Capiz State University serves as the implementing institution of the 3rd International Agri-Life & Bioresource Sciences Symposium.
          </p>
        </div>
      </section>

      {/* ================= CO-HOST INSTITUTIONS ================= */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#0A2540] uppercase">Co-host Institutions</h2>
            <div className="w-12 h-1 bg-[#F5A623] mx-auto mt-3"></div>
            <p className="text-sm text-gray-500 mt-2">
              The symposium proposal identifies these institutions as co-hosts with CAPSU.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {coHosts.map((institution, idx) => (
              <div key={idx} className="bg-[#F8FAFC] rounded-xl border border-zinc-200 p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image 
                    src={institution.logo}
                    alt={institution.name}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-24 h-24 bg-[#1D3D6D] rounded-xl flex items-center justify-center mx-auto">
                            <span class="text-white text-xl font-bold">${institution.name.split(' ').map(w => w[0]).join('')}</span>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
                <h3 className="font-bold text-[#0A2540]">{institution.name}</h3>
                <p className="text-sm text-gray-500">{institution.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= THE ROLE OF PARTNER INSTITUTIONS ================= */}
      <section className="py-12 bg-gradient-to-r from-[#0A2540] to-[#1a3a5c]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white uppercase">The Role of Partner Institutions</h2>
            <div className="w-12 h-1 bg-[#F5A623] mx-auto mt-3"></div>
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
              "International scientific exchange"
            ].map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/20 transition-all"
              >
                <FaCheckCircle className="text-[#F5A623] text-sm shrink-0" />
                <span className="text-white text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          <p className="text-gray-300 text-sm text-center mt-6 max-w-3xl mx-auto">
            Partner institutions contribute to the international and scientific character of the symposium through participation in organizing and scientific committees, promotion of the Call for Abstracts, nomination of speakers and experts, abstract review, session facilitation, academic networking, and the development of future research and institutional collaborations.
          </p>
        </div>
      </section>

      {/* ================= OTHER INSTITUTIONAL PARTNERS ================= */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#0A2540] uppercase">Other Institutional Partners</h2>
            <div className="w-12 h-1 bg-[#F5A623] mx-auto mt-3"></div>
            <p className="text-sm text-gray-500 mt-2">
              Only add organizations here after confirmation.
            </p>
          </div>

          {institutionalPartners.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {institutionalPartners.map((partner, idx) => (
                <div 
                  key={idx}
                  className="bg-[#F8FAFC] rounded-xl border border-zinc-200 p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="relative w-24 h-24 mx-auto mb-3">
                    <Image 
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-24 h-24 bg-[#1D3D6D] rounded-xl flex items-center justify-center mx-auto">
                              <span class="text-white text-xl font-bold">${partner.name.split(' ').map(w => w[0]).join('')}</span>
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
              {[...Array(4)].map((_, idx) => (
                <div 
                  key={idx}
                  className="bg-[#F8FAFC] rounded-xl border border-dashed border-zinc-300 p-6 text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FaBuilding className="text-3xl text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-400">Institutional Partner</p>
                  <p className="text-xs text-gray-400">Logo & Name</p>
                </div>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-400 text-center mt-4">
            {institutionalPartners.length === 0 ? 'Institutional partners will be displayed here once confirmed.' : ''}
          </p>
        </div>
      </section>

      {/* ================= SPONSORS - ALL ON SAME LEVEL ================= */}
      <section className="py-12 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#0A2540] uppercase">Sponsors</h2>
            <div className="w-12 h-1 bg-[#F5A623] mx-auto mt-3"></div>
            <p className="text-sm text-gray-500 mt-2">
              Sponsorship logos will be displayed once agreements are finalized.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {sponsors.length > 0 ? (
              sponsors.map((sponsor, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-xl border border-zinc-200 p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 w-48"
                >
                  <div className="relative w-24 h-24 mx-auto mb-3">
                    <Image 
                      src={sponsor.logo}
                      alt={sponsor.name}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-24 h-24 bg-[#1D3D6D] rounded-xl flex items-center justify-center mx-auto">
                              <span class="text-white text-xl font-bold">${sponsor.name.split(' ').map(w => w[0]).join('')}</span>
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
              // Placeholder sponsors
              [...Array(6)].map((_, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-xl border border-dashed border-zinc-300 p-6 text-center hover:shadow-md transition-shadow w-48"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FaStar className="text-3xl text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-400">Sponsor</p>
                  <p className="text-xs text-gray-400">Logo & Name</p>
                </div>
              ))
            )}
          </div>

          <p className="text-xs text-gray-400 text-center mt-6 max-w-2xl mx-auto">
            Avoid putting organizations listed merely as possible invitees in your internal proposal on the public page before they formally agree.
          </p>
        </div>
      </section>

      {/* ================= BECOME A PARTNER ================= */}
      <section className="py-12 bg-gradient-to-r from-[#0A2540] to-[#1a3a5c]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Become a Partner</h2>
          <div className="w-16 h-1 bg-[#F5A623] mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Collaborate with us. Institutions and organizations interested in supporting the symposium through scientific collaboration, institutional participation, sponsorship, or other forms of partnership may contact the Organizing Committee.
          </p>
          <Link 
            href="#" 
            className="inline-flex items-center gap-3 bg-[#F5A623] text-[#0A2540] px-8 py-4 rounded-lg font-bold hover:bg-[#e0950f] transition-colors hover:scale-105 transform duration-200 shadow-lg"
          >
            Contact the Secretariat <FaArrowRight />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}