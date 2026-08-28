import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaRegCheckCircle, FaRegPaperPlane, FaFileAlt } from "react-icons/fa";

export default function ScientificTracks() {
  // Raw color values for icons (so we don't rely on dynamic Tailwind class generation)
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
      color: "bg-[#4CAF50]", // Green
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
      color: "bg-[#1D3D6D]", // Dark Blue
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
      color: "bg-[#1E88E5]", // Light Blue
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
      color: "bg-[#8E24AA]", // Purple
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
      color: "bg-[#F57C00]", // Orange
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
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0A2540] flex flex-col">
      <Header />

      {/* ================= PAGE HERO ================= */}
      <section className="relative bg-white overflow-hidden border-b border-zinc-100">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-60">
          <img src="/images/earth.png" alt="Globe" className="w-full h-full object-cover object-right opacity-20" />
        </div>

        <div className="max-w-350 mx-auto px-8 py-16 relative z-10">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
            <span>Home</span>
            <span className="text-zinc-300">›</span>
            <span className="text-[#0A2540] font-medium">Scientific Tracks</span>
          </div>

          <h1 className="text-5xl font-bold text-[#0A2540] mb-4">Scientific Tracks</h1>
          <div className="w-16 h-1 bg-[#D5A54D] mb-6"></div>
          
          <p className="text-lg text-zinc-600 max-w-2xl leading-relaxed">
            The 3rd International Agri-Life & Bioresource Science Symposium welcomes original research and innovative ideas across a wide range of scientific disciplines.
          </p>
        </div>
      </section>

      {/* ================= OUR SCIENTIFIC TRACKS ================= */}
      <section className="py-20">
        <div className="max-w-350 mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0A2540] uppercase">Our Scientific Tracks</h2>
            <div className="w-16 h-1 bg-[#D5A54D] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tracks.slice(0, 3).map((track) => (
              <div key={track.id} className="bg-white rounded-xl border border-zinc-100 shadow-sm hover:shadow-lg transition-shadow p-8 flex flex-col">
                <div className="flex justify-center mb-8">
                  <div className="w-24 h-24 rounded-full bg-[#F0F6FF] p-2 flex items-center justify-center">
                    <Image src={track.icon} alt={track.title} width={80} height={80} className="object-contain" />
                  </div>
                </div>
                
                <div className={`inline-block self-center text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 ${track.color}`}>
                  {track.id}
                </div>
                
                <h3 className="text-center text-xl font-bold text-[#0A2540] mb-1 leading-tight">
                  {track.title}
                </h3>
                <h4 className="text-center text-lg font-bold text-[#0A2540] mb-4">
                  {track.subtitle}
                </h4>
                <div className="w-10 h-0.5 bg-[#D5A54D] mx-auto mb-6"></div>

                <ul className="space-y-3 flex-1">
                  {track.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-zinc-600">
                      {/* Fixed Icon Color */}
                      <FaRegCheckCircle 
                        className="mt-0.5 shrink-0 text-base" 
                        style={{ color: track.iconColor }} 
                      /> 
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Track 4 & 5 - Centered Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
            {tracks.slice(3).map((track) => (
              <div key={track.id} className="bg-white rounded-xl border border-zinc-100 shadow-sm hover:shadow-lg transition-shadow p-8 flex flex-col">
                <div className="flex justify-center mb-8">
                  <div className="w-24 h-24 rounded-full bg-[#F0F6FF] p-2 flex items-center justify-center">
                    <Image src={track.icon} alt={track.title} width={80} height={80} className="object-contain" />
                  </div>
                </div>
                
                <div className={`inline-block self-center text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 ${track.color}`}>
                  {track.id}
                </div>
                
                <h3 className="text-center text-xl font-bold text-[#0A2540] mb-1 leading-tight">
                  {track.title}
                </h3>
                <h4 className="text-center text-lg font-bold text-[#0A2540] mb-4">
                  {track.subtitle}
                </h4>
                <div className="w-10 h-0.5 bg-[#D5A54D] mx-auto mb-6"></div>

                <ul className="space-y-3 flex-1">
                  {track.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-zinc-600">
                      {/* Fixed Icon Color */}
                      <FaRegCheckCircle 
                        className="mt-0.5 shrink-0 text-base" 
                        style={{ color: track.iconColor }} 
                      /> 
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SUBMIT CTA ================= */}
      <section className="pb-20">
        <div className="max-w-350 mx-auto px-8">
          <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#F0F6FF] rounded-full flex items-center justify-center">
                <FaFileAlt className="text-[#1D3D6D] text-3xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0A2540] mb-1">Submit Your Research</h3>
                <p className="text-zinc-500">Share your innovative research and be part of global discussions that shape the future of science, technology, and society.</p>
              </div>
            </div>
            <button className="bg-[#1D3D6D] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#143b66] transition-colors flex items-center gap-2 shrink-0">
              Submit Abstract <FaRegPaperPlane className="rotate-[-20deg]" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}