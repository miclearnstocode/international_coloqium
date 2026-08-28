import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

import { 
  FaBullseye, FaUsers, FaGlobe, FaChalkboard, FaInfinity, 
  FaBullhorn, FaGem, FaCheckCircle, FaLightbulb, FaHandshake, 
  FaNetworkWired, FaChalkboardTeacher, FaChevronRight, FaMapMarkerAlt, 
  FaPhoneAlt, FaEnvelope, FaGlobeAsia, FaFacebookF, FaTwitter, 
  FaLinkedinIn, FaInstagram 
} from "react-icons/fa";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0B2A4A] flex flex-col">
      <Header />

      {/* ================= PAGE HERO ================= */}
      <section className="relative bg-white overflow-hidden border-b border-zinc-100">
        <div className="max-w-350 mx-auto px-8 py-16 relative z-10">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
            <span>Home</span>
            <span className="text-zinc-300">›</span>
            <span className="text-[#0B2A4A] font-medium">About Us</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-[#0B2A4A] mb-4">About Us</h1>
              <div className="w-16 h-1 bg-[#D5A54D] mb-6"></div>
              <p className="text-lg text-zinc-600 leading-relaxed">
                The 3rd Interantional Agri-Life & Bioresource Science Symposium  is a global gathering of researchers, academicians, professionals, and students committed to advancing knowledge, fostering collaboration, and addressing real-world challenges through innovative research and meaningful discussions.
              </p>
            </div>

            {/* Hero Image / Graphic */}
            <div className="hidden lg:flex justify-center items-center relative">
              <img 
                src="/images/about-hero.png" 
                alt="About Us Hero" 
                className="object-contain w-full max-w-125 drop-shadow-xl"
              />
              {/* Fallback graphic if image doesn't exist */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                <FaGlobeAsia className="text-[200px] text-[#1D3D6D]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR STORY + STATS ================= */}
      <section className="py-16">
        <div className="max-w-350 mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left: Story */}
            <div>
              <p className="text-sm font-bold text-[#1D3D6D] uppercase mb-2">Our Story</p>
              <h2 className="text-3xl font-bold text-[#0B2A4A] mb-4">
                Uniting Minds.<br />
                Creating Impact.
              </h2>
              
              <p className="text-zinc-600 leading-relaxed mb-6">
                The 3rd Interantional Agri-Life & Bioresource Science Symposium was established to create a dynamic platform where diverse disciplines converge to share ideas, showcase innovations, and inspire solutions for a sustainable future.
              </p>
              <p className="text-zinc-600 leading-relaxed mb-8">
                Hosted by Capiz State University (CAPSU), co-hosted by Hiroshima University, Visayas State University and University of San Carlos, Capiz, Philippines, the event highlights the university's commitment to research excellence, internationalization, and community engagement.
              </p>
              
              <button className="bg-[#1D3D6D] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#143b66] transition-colors flex items-center gap-2">
                Learn More About CAPSU <FaChevronRight size={12} />
              </button>
            </div>

            {/* Right: Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 lg:pt-10">
              {/* Stat 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#F0F6FF] flex items-center justify-center mb-4 text-[#1D3D6D] text-2xl shadow-sm border border-blue-100">
                  <FaUsers />
                </div>
                <p className="text-3xl font-bold text-[#0B2A4A] mb-1">500+</p>
                <p className="text-sm text-zinc-500">Participants</p>
                <p className="text-xs text-zinc-400 mt-1">Researchers, professionals, and students from around the world</p>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#F0F6FF] flex items-center justify-center mb-4 text-[#1D3D6D] text-2xl shadow-sm border border-blue-100">
                  <FaGlobe />
                </div>
                <p className="text-3xl font-bold text-[#0B2A4A] mb-1">25+</p>
                <p className="text-sm text-zinc-500">Countries</p>
                <p className="text-xs text-zinc-400 mt-1">Global representation across continents</p>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#F0F6FF] flex items-center justify-center mb-4 text-[#1D3D6D] text-2xl shadow-sm border border-blue-100">
                  <FaChalkboard />
                </div>
                <p className="text-3xl font-bold text-[#0B2A4A] mb-1">100+</p>
                <p className="text-sm text-zinc-500">Presentations</p>
                <p className="text-xs text-zinc-400 mt-1">High-quality research presentations and poster sessions</p>
              </div>

              {/* Stat 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#F0F6FF] flex items-center justify-center mb-4 text-[#1D3D6D] text-2xl shadow-sm border border-blue-100">
                  <FaInfinity />
                </div>
                <p className="text-3xl font-bold text-[#0B2A4A] mb-1">∞</p>
                <p className="text-sm text-zinc-500">Opportunities</p>
                <p className="text-xs text-zinc-400 mt-1">Endless possibilities for collaboration, networking, and partnerships</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MISSION / VISION / VALUES ================= */}
      <section className="bg-white py-16 border-t border-zinc-100">
        <div className="max-w-350 mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Mission */}
            <div className="bg-white border border-zinc-100 rounded-xl p-8 shadow-sm flex flex-col">
              <div className="w-12 h-12 rounded-full bg-[#F0F6FF] flex items-center justify-center mb-6 text-[#1D3D6D] text-2xl">
                <FaBullseye />
              </div>
              <h3 className="text-xl font-bold text-[#0B2A4A] mb-3">Our Mission</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                To provide a premier international platform that promotes the exchange of innovative ideas, advances scientific knowledge, and encourages interdisciplinary collaboration for sustainable development and societal well-being.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white border border-zinc-100 rounded-xl p-8 shadow-sm flex flex-col">
              <div className="w-12 h-12 rounded-full bg-[#F0F6FF] flex items-center justify-center mb-6 text-[#1D3D6D] text-2xl">
                <FaBullhorn />
              </div>
              <h3 className="text-xl font-bold text-[#0B2A4A] mb-3">Our Vision</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                To be a leading global colloquium that empowers researchers and communities to create innovative, ethical, and impactful solutions for a better and more sustainable world.
              </p>
            </div>

            {/* Values */}
            <div className="bg-white border border-zinc-100 rounded-xl p-8 shadow-sm flex flex-col">
              <div className="w-12 h-12 rounded-full bg-[#F0F6FF] flex items-center justify-center mb-6 text-[#1D3D6D] text-2xl">
                <FaGem />
              </div>
              <h3 className="text-xl font-bold text-[#0B2A4A] mb-3">Our Values</h3>
              <ul className="space-y-3 text-sm text-zinc-600">
                <li className="flex items-start gap-2"><FaCheckCircle className="text-[#1D3D6D] mt-0.5" /> Excellence in Research</li>
                <li className="flex items-start gap-2"><FaCheckCircle className="text-[#1D3D6D] mt-0.5" /> Integrity and Ethics</li>
                <li className="flex items-start gap-2"><FaCheckCircle className="text-[#1D3D6D] mt-0.5" /> Collaboration and Inclusivity</li>
                <li className="flex items-start gap-2"><FaCheckCircle className="text-[#1D3D6D] mt-0.5" /> Innovation and Creativity</li>
                <li className="flex items-start gap-2"><FaCheckCircle className="text-[#1D3D6D] mt-0.5" /> Sustainability and Responsibility</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ================= WHAT TO EXPECT ================= */}
      <section className="py-16">
        <div className="max-w-350 mx-auto px-8">
          
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-[#D5A54D] uppercase tracking-widest mb-2">What to Expect</p>
            <h2 className="text-4xl font-bold text-[#0B2A4A] mb-2">A Collaborative and Inspiring Experience</h2>
            <div className="w-16 h-1 bg-[#D5A54D] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { icon: <FaLightbulb />, title: "Knowledge Exchange", desc: "Share and gain insights from cutting-edge research across multiple disciplines." },
              { icon: <FaNetworkWired />, title: "Global Networking", desc: "Connect with experts, practitioners, and peers from around the world." },
              { icon: <FaBullhorn />, title: "Innovation Showcase", desc: "Discover innovative ideas, technologies, and solutions addressing global challenges." },
              { icon: <FaChalkboardTeacher />, title: "Capacity Building", desc: "Enhance skills and knowledge through engaging lectures and workshops." },
              { icon: <FaHandshake />, title: "Collaborative Partnerships", desc: "Build meaningful partnerships for future research and collaborations." },
              { icon: <FaGlobe />, title: "Sustainable Impact", desc: "Contribute to sustainable development goals and create lasting positive change." }, // Added a 6th item to fill the grid nicely if needed
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#F0F6FF] border border-blue-100 flex items-center justify-center mb-4 text-[#1D3D6D] text-xl transition-transform hover:scale-110">
                  {item.icon}
                </div>
                <h4 className="font-bold text-[#0B2A4A] mb-2">{item.title}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="pb-16">
        <div className="max-w-350 mx-auto px-8">
          <div className="relative bg-[#1D3D6D] rounded-xl overflow-hidden shadow-lg">
            <div className="absolute inset-0 opacity-20 bg-[url('/images/students.png')] bg-cover bg-center"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-10">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">Be Part of Something Bigger</h2>
                <p className="text-blue-100 mb-6">Together, let's drive innovation, foster collaboration, and shape a sustainable future.</p>
                <button className="bg-white text-[#1D3D6D] px-8 py-3 rounded-md font-bold hover:bg-gray-100 transition-colors flex items-center gap-2">
                  Register Now <FaChevronRight />
                </button>
              </div>
              <div className="hidden md:flex flex-1 justify-end">
                <img src="/images/students.png" alt="Students" className="object-contain h-40 drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    <Footer/>
    </div>
  );
}