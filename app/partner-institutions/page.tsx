import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { 
  FaUsers, FaChevronRight, FaChevronLeft, FaUniversity, 
  FaHandshake, FaGlobe, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, 
  FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram 
} from "react-icons/fa";

export default function PartnerInstitutions() {
  
  const globalPartners = [
    { name: "Capiz State University", country: "Philippines", flag: "🇲🇾", logo: "/images/partners/upm.png" },
    { name: "Kasetsart University", country: "Thailand", flag: "🇹🇭", logo: "/images/partners/ku.png" },
    { name: "Tokyo University of Agriculture", country: "Japan", flag: "🇯🇵", logo: "/images/partners/tua.png" },
    { name: "University of the Philippines Los Baños", country: "Philippines", flag: "🇵🇭", logo: "/images/partners/uplb.png" },
    { name: "Bogor Agricultural University (IPB)", country: "Indonesia", flag: "🇮🇩", logo: "/images/partners/ipb.png" },
    { name: "University of Guelph", country: "Canada", flag: "🇨🇦", logo: "/images/partners/uog.png" },
  ];

  const nationalPartners = [
    { name: "Central Luzon State University", logo: "/images/partners/clsu.png" },
    { name: "Visayas State University", logo: "/images/partners/vsu.png" },
    { name: "Mindanao State University - Iligan Institute of Technology", logo: "/images/partners/msuiit.png" },
    { name: "Capiz State University", logo: "/images/partners/capsu.png" },
    { name: "Benguet State University", logo: "/images/partners/bsu.png" },
  ];

  const orgPartners = [
    { name: "SEAMEO SEARCA", logo: "/images/partners/searca.png" },
    { name: "Philippine Council for Agriculture, Aquatic and Natural Resources Research and Development (PCARRD-PCAARRD)", logo: "/images/partners/pcaarrd.png" },
    { name: "International Rice Research Institute (IRRI)", logo: "/images/partners/irri.png" },
    { name: "World Wide Fund For Nature (WWF-Philippines)", logo: "/images/partners/wwf.png" },
    { name: "Food and Agriculture Organization of the United Nations (FAO)", logo: "/images/partners/fao.png" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0B2A4A] flex flex-col">
      <Header />

      {/* ================= PAGE HERO ================= */}
      <section className="relative bg-white overflow-hidden border-b border-zinc-100">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-60">
          <img src="/images/partners-hero-globe.png" alt="Globe" className="w-full h-full object-cover object-right opacity-20" />
        </div>

        <div className="max-w-350 mx-auto px-8 py-16 relative z-10">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
            <span>Home</span>
            <span className="text-zinc-300">›</span>
            <span className="text-[#0B2A4A] font-medium">Partners</span>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-[#0B2A4A] mb-4">Partner Institutions</h1>
            <div className="w-16 h-1 bg-[#D5A54D] mb-6"></div>
            <p className="text-lg text-zinc-600 leading-relaxed">
              We collaborate with leading universities, research institutions, and organizations worldwide to advance research, innovation, and sustainable development.
            </p>
          </div>
        </div>
      </section>

      {/* ================= OUR GLOBAL PARTNERS ================= */}
      <section className="py-16">
        <div className="max-w-350uto px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <FaUsers className="text-[#1D3D6D] text-2xl" />
              <h2 className="text-2xl font-bold text-[#0B2A4A] uppercase">Our Global Partners</h2>
            </div>
            
            {/* Slider Controls (Visual) */}
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full bg-[#F0F6FF] text-[#1D3D6D] flex items-center justify-center hover:bg-[#1D3D6D] hover:text-white transition-colors"><FaChevronLeft size={12} /></button>
              <button className="w-8 h-8 rounded-full bg-[#F0F6FF] text-[#1D3D6D] flex items-center justify-center hover:bg-[#1D3D6D] hover:text-white transition-colors"><FaChevronRight size={12} /></button>
            </div>
          </div>

          <p className="text-sm text-zinc-500 mb-8">These institutions share our commitment to research excellence, knowledge exchange, and creating a better future together.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {globalPartners.map((partner, idx) => (
              <div key={idx} className="bg-white border border-zinc-100 rounded-xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-24 h-24 mb-4 flex items-center justify-center">
                  <img src={partner.logo} alt={partner.name} className="object-contain max-h-24" />
                </div>
                <p className="font-bold text-[#0B2A4A] text-sm mb-2 leading-tight">{partner.name}</p>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="text-lg">{partner.flag}</span> {partner.country}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= NATIONAL & INDUSTRY PARTNERS ================= */}
      <section className="bg-white py-16 border-t border-zinc-100">
        <div className="max-w-350 mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* National Partners */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <FaUniversity className="text-[#1D3D6D] text-2xl" />
                <h2 className="text-2xl font-bold text-[#0B2A4A] uppercase">National Partners</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {nationalPartners.map((partner, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center p-4">
                    <div className="w-20 h-20 mb-3 flex items-center justify-center">
                      <img src={partner.logo} alt={partner.name} className="object-contain max-h-20" />
                    </div>
                    <p className="text-xs font-semibold text-[#0B2A4A] leading-tight">{partner.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Industry & Organization Partners */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <FaHandshake className="text-[#1D3D6D] text-2xl" />
                <h2 className="text-2xl font-bold text-[#0B2A4A] uppercase">Industry & Organization Partners</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {orgPartners.map((partner, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center p-4">
                    <div className="w-20 h-20 mb-3 flex items-center justify-center">
                      <img src={partner.logo} alt={partner.name} className="object-contain max-h-20" />
                    </div>
                    <p className="text-xs font-semibold text-[#0B2A4A] leading-tight">{partner.name}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    <Footer/>
    </div>
  );
}