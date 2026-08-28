import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FaCoffee, FaBullhorn, FaMicrophoneAlt, FaGraduationCap, FaUtensils, 
  FaComments, FaUsers, FaGlassCheers, FaCalendarAlt, FaDownload, 
  FaCheckCircle, FaBell
} from "react-icons/fa";

export default function ProgramPage() {
  const scheduleData = [
    {
      time: "07:30 – 08:30",
      title: "REGISTRATION AND WELCOME COFFEE",
      icon: <FaCoffee />,
    },
    {
      time: "08:30 – 09:15",
      title: "OPENING CEREMONY",
      subtitle: "National Anthem • Opening Remarks • Message from the Organizing Chair • Message from the Guest of Honor",
      icon: <FaBullhorn />,
    },
    {
      time: "09:15 – 10:15",
      title: "KEYNOTE SPEECH 1",
      subtitle: "Innovation for a Sustainable Future\nProf. Maria Santos, University of Philippines, Philippines",
      icon: <FaMicrophoneAlt />,
    },
    {
      time: "10:15 – 10:30",
      title: "COFFEE BREAK & NETWORKING",
      icon: <FaCoffee />,
    },
    {
      time: "10:30 – 12:00",
      title: "TECHNICAL SESSIONS 1 (PARALLEL)",
      subtitle: "Track A: Environment & Sustainability  |  Track B: Technology & Innovation  |  Track C: Social Sciences & Education",
      icon: <FaGraduationCap />,
    },
    {
      time: "12:00 – 13:30",
      title: "LUNCH BREAK",
      icon: <FaUtensils />,
    },
    {
      time: "13:30 – 15:00",
      title: "TECHNICAL SESSIONS 2 (PARALLEL)",
      subtitle: "Track A: Environment & Sustainability  |  Track B: Technology & Innovation  |  Track C: Social Sciences & Education",
      icon: <FaGraduationCap />,
    },
    {
      time: "15:00 – 15:15",
      title: "COFFEE BREAK",
      icon: <FaCoffee />,
    },
    {
      time: "15:15 – 16:45",
      title: "PANEL DISCUSSION 1",
      subtitle: "Global Research Collaboration: Opportunities and Challenges",
      icon: <FaComments />,
    },
    {
      time: "16:45 – 17:15",
      title: "DAY 1 WRAP-UP",
      subtitle: "Highlights and Announcements",
      icon: <FaUsers />,
    },
    {
      time: "18:30 – 21:00",
      title: "WELCOME RECEPTION (By Invitation)",
      subtitle: "Networking Dinner",
      icon: <FaGlassCheers />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0A2540]">
        <Header />
      {/* ================= PAGE HERO ================= */}
      <section className="relative bg-white overflow-hidden border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
            <span>Home</span>
            <span className="text-zinc-300">›</span>
            <span className="text-[#0A2540] font-medium">Program</span>
          </div>

          <h1 className="text-5xl font-bold text-[#0A2540] mb-4">Program</h1>
          <div className="w-16 h-1 bg-[#F5A623] mb-6"></div>
          
          {/* RED: Change this paragraph text */}
          <p className="text-lg text-red-600 max-w-lg leading-relaxed">
            Explore the conference program featuring keynote speeches, technical sessions, panel discussions, and special events.
          </p>
        </div>

        {/* Abstract Map Background (Right Side) */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-60 pointer-events-none">
          <Image 
            src="/map.png" 
            alt="World Map" 
            fill 
            className="object-cover object-right opacity-20"
          />
          {/* Decorative Map Pins */}
          <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-[#F5A623] rounded-full shadow-lg"></div>
          <div className="absolute top-1/2 right-1/2 w-4 h-4 bg-[#F5A623] rounded-full shadow-lg"></div>
          <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-[#F5A623] rounded-full shadow-lg"></div>
        </div>
      </section>

      {/* ================= AT A GLANCE ================= */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A2540] uppercase">Program At A Glance</h2>
            <div className="w-16 h-1 bg-[#F5A623] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { icon: <FaUsers />, value: "3", label: "Days" },
              { icon: <FaMicrophoneAlt />, value: "5", label: "Keynote Speeches" },
              { icon: <FaGraduationCap />, value: "18+", label: "Technical Sessions" },
              { icon: <FaComments />, value: "4", label: "Panel Discussions" },
              { icon: <FaBullhorn />, value: "2", label: "Networking Events" },
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-xl border border-zinc-100 shadow-sm p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow"
              >
                <div className="text-4xl text-[#0A2540] mb-4">{item.icon}</div>
                {/* RED: Change the stats (numbers) */}
                <span className="text-4xl font-bold text-red-600 mb-2">{item.value}</span>
                {/* RED: Change the labels */}
                <span className="text-sm font-semibold text-red-600 uppercase tracking-wide">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SCHEDULE ================= */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Day Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 rounded-t-xl overflow-hidden border border-zinc-200">
            <div className="bg-[#0A2540] text-white p-6 flex items-center justify-center gap-4 cursor-pointer">
              <FaCalendarAlt className="text-3xl" />
              <div>
                {/* RED: Change Day 1 Label */}
                <p className="font-bold text-lg leading-tight">DAY 1</p>
                {/* RED: Change Day 1 Date */}
                <p className="text-sm text-red-400">October 20, 2025</p>
              </div>
            </div>
            <div className="bg-white text-[#0A2540] p-6 flex items-center justify-center gap-4 border-r border-zinc-100 cursor-pointer hover:bg-zinc-50">
              <FaCalendarAlt className="text-3xl" />
              <div>
                {/* RED: Change Day 2 Label */}
                <p className="font-bold text-red-600 text-lg leading-tight">DAY 2</p>
                {/* RED: Change Day 2 Date */}
                <p className="text-sm text-red-600">October 21, 2025</p>
              </div>
            </div>
            <div className="bg-white text-[#0A2540] p-6 flex items-center justify-center gap-4 cursor-pointer hover:bg-zinc-50">
              <FaCalendarAlt className="text-3xl" />
              <div>
                {/* RED: Change Day 3 Label */}
                <p className="font-bold text-red-600 text-lg leading-tight">DAY 3</p>
                {/* RED: Change Day 3 Date */}
                <p className="text-sm text-red-600">October 22, 2025</p>
              </div>
            </div>
          </div>

          {/* Schedule Table */}
          <div className="border border-t-0 border-zinc-200 bg-white rounded-b-xl overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-[#0A2540] text-white px-6 py-4">
              <div className="col-span-3 font-bold uppercase text-sm">Time</div>
              <div className="col-span-9 font-bold uppercase text-sm">Session / Activity</div>
            </div>

            {/* Table Rows */}
            {scheduleData.map((row, idx) => (
              <div 
                key={idx} 
                className={`grid grid-cols-12 px-6 py-5 items-start border-b border-zinc-100 last:border-b-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'}`}
              >
                {/* RED: Change Time */}
                <div className="col-span-3 text-sm font-semibold text-red-600 pt-1">{row.time}</div>
                <div className="col-span-9 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#e8f0fe] text-[#0A2540] flex items-center justify-center text-lg shrink-0">
                    {row.icon}
                  </div>
                  <div>
                    {/* RED: Change Session Title */}
                    <p className="font-bold text-red-600 uppercase text-sm mb-1">{row.title}</p>
                    {/* RED: Change Session Subtitle */}
                    {row.subtitle && (
                      <p className="text-sm text-red-600 whitespace-pre-line">{row.subtitle}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DOWNLOAD & HIGHLIGHTS ================= */}
      <section className="bg-white py-16 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Left: Download */}
          <div className="bg-white border border-zinc-200 rounded-xl p-8 flex flex-col md:flex-row gap-8 items-center shadow-sm">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#0A2540] mb-2 uppercase">Download Program</h3>
              <div className="w-12 h-1 bg-[#F5A623] mb-4"></div>
              {/* RED: Change Description */}
              <p className="text-red-600 mb-6">
                Get the complete program schedule in PDF format.
              </p>
              {/* RED: Change Button Text */}
              <button className="inline-flex items-center gap-2 border-2 border-[#0A2540] text-[#0A2540] px-6 py-3 rounded-md font-bold hover:bg-[#0A2540] hover:text-white transition-colors">
                <FaDownload /> <span className="text-red-600">DOWNLOAD FULL PROGRAM (PDF)</span>
              </button>
            </div>
            <div className="w-40 shrink-0 bg-white shadow-lg border border-zinc-200 p-4 rounded-lg flex flex-col items-center text-center">
               <div className="w-24 h-36 bg-blue-100 mb-2 relative overflow-hidden rounded">
                 <Image src="/program-cover.png" alt="Program Cover" fill className="object-cover" />
               </div>
               {/* RED: Change Program Cover Text */}
               <p className="text-[10px] font-bold text-red-600 mt-2 leading-tight">INTERNATIONAL<br/>COLLOQUIUM<br/>2025</p>
            </div>
          </div>

          {/* Right: Highlights */}
          <div className="bg-white border border-zinc-200 rounded-xl p-8 flex flex-col md:flex-row gap-8 items-center shadow-sm">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#0A2540] mb-2 uppercase">Program Highlights</h3>
              <div className="w-12 h-1 bg-[#F5A623] mb-4"></div>
              <ul className="space-y-3">
                {[
                  "Renowned international keynote speakers",
                  "High-quality research presentations",
                  "Interdisciplinary and multi-track sessions",
                  "Networking opportunities with global experts",
                  "Cultural and social events"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-red-600">
                    <FaCheckCircle className="text-[#F5A623] mt-0.5" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-56 shrink-0 h-36 rounded-xl overflow-hidden bg-zinc-200 shadow-lg relative">
               <Image src="/conference-photo.jpg" alt="Conference" fill className="object-cover" />
            </div>
          </div>

        </div>
      </section>
    <Footer/>
    </div>
  );
}