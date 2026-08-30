"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FaCoffee, FaBullhorn, FaMicrophoneAlt, FaGraduationCap, FaUtensils, 
  FaComments, FaUsers, FaGlassCheers, FaCalendarAlt, FaDownload, 
  FaCheckCircle, FaRegEdit, FaLightbulb, FaMarker, FaRegCircle, FaMugHot, FaBookOpen, FaLeaf, FaReact, FaMortarPestle,
  FaPastafarianism, FaViadeoSquare, FaFileAlt, FaBell, FaCalendarCheck, FaEdit, FaClock, FaPenFancy, FaRocket, FaPrint, FaEnvelope     
} from "react-icons/fa";

export default function ProgramPage() {
  const [activeDay, setActiveDay] = useState(1);

  // DAY 1 SCHEDULE
  const day1Schedule = [
    {
      time: "07:30 – 08:30",
      title: "Arrival and Registration of Participants",
      icon: <FaRegEdit />,
    },
    {
      time: "08:30 – 09:30",
      title: "OPENING CEREMONY",
      icon: <FaBullhorn />,
    },
    {
      time: "08:30 – 08:35",
      subtitle: "Call to Order / Opening of the Symposium",
      icon: <FaRegCircle />,
    },
    {
      time: "08:35 – 08:45",
      subtitle: "Invocation and Philippine National Anthem",
      icon: <FaRegCircle />,
    },
    {
      time: "08:45 – 08:50",
      subtitle: "Recognition of Dignitaries, International Delegates, and Partner Institutions",
      icon: <FaRegCircle />,
    },
    {
      time: "08:50 – 08:58",
      title: "WELCOME AND OPENING REMARKS",
      subtitle: "Dr. Efren L. Linan\nCapiz State University, Philippines",
      icon: <FaMicrophoneAlt />,
    },
    {
      time: "08:58 – 09:06",
      title: "MESSAGE - HIROSHIMA UNIVERSITY",
      subtitle: "Representative\nHiroshima University, Japan",
      icon: <FaMicrophoneAlt />,
    },
    {
      time: "09:06 – 09:14",
      title: "MESSAGE - UNIVERSITY OF SAN CARLOS",
      subtitle: "Representative\nUniversity of San Carlos, Philippines",
      icon: <FaMicrophoneAlt />,
    },
    {
      time: "09:14 – 09:22",
      title: "MESSAGE - VISAYAS STATE UNIVERSITY",
      subtitle: "Representative\nVisayas State University, Philippines",
      icon: <FaMicrophoneAlt />,
    },
    {
      time: "09:22 – 09:27",
      title: "SYMPOSIUM OVERVIEW, RATIONALE, AND OBJECTIVES",
      subtitle: "Dr. John King N. Layos\nChair, Organizing Committee\nCapiz State University, Philippines",
      icon: <FaGraduationCap />,
    },
    {
      time: "09:27 – 09:30",
      title: "OFFICIAL OPENING OF THE SYMPOSIUM",
      subtitle: "Dr. Efren L. Linan\nCapiz State University, Philippines",
      icon: <FaLightbulb />,
    },
    {
      time: "09:30 – 10:15",
      title: "MOU SIGNING CEREMONY",
      subtitle: "University Presidents/Authorized Signatories of Partner Institutions",
      icon: <FaMarker />,
    },
    {
      subtitle: "Introduction of Partner Institutions and Signatories\nMaster of Ceremonies",
      icon: <FaRegCircle />,
    },
    {
      subtitle: "Presentation of the MOU\nDr. Leo Andrew B. Biclar\nCapiz State University, Philippines",
      icon: <FaRegCircle />,
    },
    {
      subtitle: "Ceremonial Signing of MOU\nUniversity Presidents / Authorized Signatories",
      icon: <FaRegCircle />,
    },
    {
      subtitle: "Exchange of Signed Documents\n Signatories",
      icon: <FaRegCircle />,
    },
    {
      subtitle: "Official Photo Session\nSignatories and Institutional Representatives",
      icon: <FaRegCircle />,
    },
    {
      time: "10:15 – 10:30",
      title: "HEALTH AND COFFEE BREAK",
      icon: <FaMugHot />,
    },
    {
      time: "10:30 – 11:10",
      title: "PLENARY TALK 1 - BIODIVERSITY",
      subtitle: "Safeguarding Animal Genetic Resources in the Genomic Era: Perspectives from the ISAG–FAO Advisory Group on Animal Genetic Diversity\nDr. Licia Colli\nISAG–FAO Advisory Group on Animal Genetic Diversity Universita Cattolica del Sacro Coure, Piacenza, Italy",
      icon: <FaGraduationCap />,
    },
    {
      time: "11:10 – 11:50",
      title: "PLENARY TALK 2 - MARINE/AQUATIC SCIENCES",
      subtitle: "Nominated HU Speaker; Preferably Dr. Koike",
      icon: <FaGraduationCap />,
    },
    {
      time: "11:50 – 12:05",
      title: "OPEN FORUM/DISCUSSION - PLENARY TALKS 1 & 2",
      subtitle: "Session Moderator (CAPSU)",
      icon: <FaComments />,
    },
    {
      time: "12:05 – 13:05",
      title: "LUNCH BREAK",
      icon: <FaUtensils />,
    },
    {
      time: "13:05 – 13:45",
      title: "PLENARY TALK 3 - PLANT SCIENCE",
      subtitle: "Invited Speaker (nominated by CAPSU), University of Zagreb, Croatia",
      icon: <FaGraduationCap />,
    },
    {
      time: "14:25 – 15:05",
      title: "PLENARY TALK 5 - LIVESTOCK SCIENCE",
      subtitle: "Invited Speaker (nominated by CAPSU), University of Zagreb, Croatia",
      icon: <FaGraduationCap />,
    },
    {
      time: "13:45 – 14:25",
      title: "PLENARY TALK 4 - FOOD SCIENCE/NUTRITION",
      subtitle: "Invited Speaker (nominated by CAPSU), University of Zagreb, Croatia",
      icon: <FaGraduationCap />,
    },
    {
      time: "15:05 – 15:20",
      title: "OPEN FORUM/DISCUSSION - PLENARY TALKS 3,4 & 5",
      subtitle: "Session Moderator (CAPSU)",
      icon: <FaComments />,
    },
    {
      time: "15:20 – 15:30",
      title: "HEALTH AND COFFEE BREAK",
      icon: <FaMugHot />,
    },
    {
      time: "15:30 – 17:00",
      title: "TECHNICAL PRESENTATIONS – BREAKOUT SESSION 1",
      subtitle: "Scientific & Technical Committee",
      icon: <FaBookOpen />,
    },
    {
      subtitle: "Track 1 – Agricultural and Animal Sciences\nPresentations (Entry 1–5)\nTrack Chair / Session Moderator / Evaluators",
      icon: <FaLeaf />
    },
    {
      subtitle: "Track 2 – Life, Biological, and Biotechnology Sciences\nPresentations (Entry 1–5)\nTrack Chair / Session Moderator / Evaluators",
      icon: <FaReact />,
    },
    {
      subtitle: "Track 3 – Fisheries, Marine, Bioresource, and Environmental Sciences\nPresentations (Entry 1–5)\nTrack Chair / Session Moderator / Evaluators",
      icon: <FaPastafarianism />,
    },
    {
      subtitle: "Track 4 – Food, Nutrition, and One Health\nPresentations (Entry 1–5)\nTrack Chair / Session Moderator / Evaluators",
      icon: <FaMortarPestle />,
    },
    {
      subtitle: "Track 5 – Innovation, Economics, and Sustainable Development\nPresentations (Entry 1–5)\nTrack Chair / Session Moderator / Evaluators",
      icon: <FaViadeoSquare />,
    },
    {
      time: "17:00 – 17:15",
      title: "DAY 1 SYNTHESIS / ANNOUNCEMENTS",
      subtitle: "Scientific Committee / Secretariat",
      icon: <FaUsers />,
    },
    {
      time: "17:15",
      title: "END OF DAY 1 SCIENTIFIC PROGRAM",
      icon: <FaUsers />,
    },
    {
      time: "18:00 – 21:00",
      title: "FELLOWSHIP/GOVERNOR'S NIGHT",
      subtitle: "Networking Dinner",
      icon: <FaGlassCheers />,
    },
  ];

  // DAY 2 SCHEDULE
  const day2Schedule = [
    {
      time: "08:30 – 09:00",
      title: "REGISTRATION AND MORNING COFFEE",
      icon: <FaCoffee />,
    },
    {
      time: "09:00 – 10:00",
      title: "PLENARY TALK 6 - CLIMATE CHANGE AND ADAPTATION",
      subtitle: "Invited Speaker\nInternational Expert on Climate Change",
      icon: <FaGraduationCap />,
    },
    {
      time: "10:00 – 11:00",
      title: "PLENARY TALK 7 - SUSTAINABLE AGRICULTURE",
      subtitle: "Invited Speaker\nLeading Researcher in Sustainable Farming",
      icon: <FaGraduationCap />,
    },
    {
      time: "11:00 – 11:15",
      title: "HEALTH AND COFFEE BREAK",
      icon: <FaMugHot />,
    },
    {
      time: "11:15 – 12:15",
      title: "PANEL DISCUSSION",
      subtitle: "Theme: 'Future of Agri-Life Sciences'\nPanelists from Partner Institutions",
      icon: <FaComments />,
    },
    {
      time: "12:15 – 13:15",
      title: "LUNCH BREAK",
      icon: <FaUtensils />,
    },
    {
      time: "13:15 – 15:15",
      title: "TECHNICAL PRESENTATIONS – BREAKOUT SESSION 2",
      subtitle: "Scientific & Technical Committee",
      icon: <FaBookOpen />,
    },
    {
      subtitle: "Track 1 – Agricultural and Animal Sciences\nPresentations (Entry 6–10)\nTrack Chair / Session Moderator / Evaluators",
      icon: <FaLeaf />
    },
    {
      subtitle: "Track 2 – Life, Biological, and Biotechnology Sciences\nPresentations (Entry 6–10)\nTrack Chair / Session Moderator / Evaluators",
      icon: <FaReact />,
    },
    {
      subtitle: "Track 3 – Fisheries, Marine, Bioresource, and Environmental Sciences\nPresentations (Entry 6–10)\nTrack Chair / Session Moderator / Evaluators",
      icon: <FaPastafarianism />,
    },
    {
      subtitle: "Track 4 – Food, Nutrition, and One Health\nPresentations (Entry 6–10)\nTrack Chair / Session Moderator / Evaluators",
      icon: <FaMortarPestle />,
    },
    {
      subtitle: "Track 5 – Innovation, Economics, and Sustainable Development\nPresentations (Entry 6–10)\nTrack Chair / Session Moderator / Evaluators",
      icon: <FaViadeoSquare />,
    },
    {
      time: "15:15 – 15:30",
      title: "HEALTH AND COFFEE BREAK",
      icon: <FaMugHot />,
    },
    {
      time: "15:30 – 17:00",
      title: "WORKSHOP AND TRAINING SESSION",
      subtitle: "Hands-on Workshop on Research Methodologies\nFacilitated by International Experts",
      icon: <FaGraduationCap />,
    },
    {
      time: "17:00 – 17:15",
      title: "DAY 2 SYNTHESIS / ANNOUNCEMENTS",
      subtitle: "Scientific Committee / Secretariat",
      icon: <FaUsers />,
    },
    {
      time: "17:15",
      title: "END OF DAY 2 SCIENTIFIC PROGRAM",
      icon: <FaUsers />,
    },
  ];

  // DAY 3 SCHEDULE
  const day3Schedule = [
    {
      time: "08:30 – 09:00",
      title: "REGISTRATION AND MORNING COFFEE",
      icon: <FaCoffee />,
    },
    {
      time: "09:00 – 10:00",
      title: "PLENARY TALK 8 - BIOTECHNOLOGY AND GENOMICS",
      subtitle: "Invited Speaker\nBiotechnology Expert",
      icon: <FaGraduationCap />,
    },
    {
      time: "10:00 – 11:00",
      title: "PLENARY TALK 9 - FOOD SECURITY AND NUTRITION",
      subtitle: "Invited Speaker\nFood Security Specialist",
      icon: <FaGraduationCap />,
    },
    {
      time: "11:00 – 11:15",
      title: "HEALTH AND COFFEE BREAK",
      icon: <FaMugHot />,
    },
    {
      time: "11:15 – 12:15",
      title: "CLOSING PLENARY TALK",
      subtitle: "Keynote Speaker\nTopic: 'Future Directions in Agri-Life Sciences'",
      icon: <FaMicrophoneAlt />,
    },
    {
      time: "12:15 – 13:15",
      title: "LUNCH BREAK",
      icon: <FaUtensils />,
    },
    {
      time: "13:15 – 14:15",
      title: "BEST PRESENTATION AWARDS",
      subtitle: "Recognition of Outstanding Presentations\nAwarding Ceremony",
      icon: <FaBullhorn />,
    },
    {
      time: "14:15 – 15:15",
      title: "CLOSING CEREMONY",
      subtitle: "Closing Remarks\nDr. Efren L. Linan\nCapiz State University, Philippines",
      icon: <FaMicrophoneAlt />,
    },
    {
      time: "15:15 – 15:30",
      title: "FAREWELL COFFEE AND SOCIAL GATHERING",
      icon: <FaMugHot />,
    },
    {
      time: "15:30",
      title: "END OF THE SYMPOSIUM",
      icon: <FaUsers />,
    },
  ];

  // Get the schedule based on active day
  const getScheduleData = () => {
    switch(activeDay) {
      case 1:
        return day1Schedule;
      case 2:
        return day2Schedule;
      case 3:
        return day3Schedule;
      default:
        return day1Schedule;
    }
  };

  const scheduleData = getScheduleData();

  const keyDatesData = [
    {
      date: "October 5, 2026",
      event: "Opening of Abstract Submission and Registration",
      description: "Official launching and dissemination of the Call for Abstracts and Registration through partner institutions, networks, and online platforms.",
      icon: <FaRocket />
    },

    {
      date: "January 10, 2027",
      event: "Abstract Submission Deadline",
      description: "Final date for authors to submit abstracts for consideration in the scientific program.",
      icon: <FaFileAlt />
    },
    {
      date: "October 2026 - January 20, 2027",
      event: "Review and Evaluation Period",
      description: "Scientific evaluation of submitted abstracts by designated reviewers based on established criteria.",
      icon: <FaFileAlt />
    },

    {
      date: "Rolling (until Jan. 25, 2027)",
      event: "Notification of Acceptance",
      description: "Rolling notification of acceptance. Final notices to be issued by January 25, 2027.",
      icon: <FaBell />
    },
    {
      date: "December 18, 2026",
      event: "Early Bird Registration Deadline",
      description: "Period during which accepted presenters and other participants may avail of the applicable early registration rate.",
      icon: <FaCalendarCheck />
    },
    {
      date: "January 10, 2027",
      event: "Final Registration Deadline",
      description: "Final date for presenters and participants to confirm their participation. Only registered presenters shall be included in the final scientific program.",
      icon: <FaEnvelope />
    },
    {
      date: "January 29, 2027",
      event: "Finalization of Scientific Program",
      description: "Scientific program will be finalized.",
      icon: <FaEdit />
    },
    {
      date: "February 6 – March 5, 2027",
      event: "Preparation of Book of Abstracts",
      description: "Compilation and preparation of the Book of Abstracts.",
      icon: <FaBookOpen />
    },
    {
      date: "Subject to Journal Partner",
      event: "Submission of Full Papers",
      description: "Authors of selected papers may be invited to submit full manuscripts for possible publication or inclusion in symposium proceedings, subject to applicable review and publication requirements.",
      icon: <FaPenFancy />
    },
    {
      date: "February 26, 2027",
      event: "Release of Final Program",
      description: "Final program will be sent via email to all committee and focal persons and can be access through this portal.",
      icon: <FaPrint />
    },
    {
      date: "March 11–13, 2027",
      event: "3rd International Agri-Life & Bioresource Science Symposium 2027",
      description: "Main conference program and activities.",
      icon: <FaCalendarAlt />
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
            <span className="text-[#0A2540] font-medium">Program</span>
          </div>

          <h1 className="text-5xl font-bold text-[#0A2540] mb-4">Symposium Program</h1>
          <div className="w-16 h-1 bg-[#F5A623] mb-6"></div>
          
          <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
            Explore the conference program featuring keynote speeches, technical sessions, panel discussions, and special events.
          </p>
        </div>

        {/* Abstract Map Background (Right Side) */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-80 pointer-events-none">
          <Image 
            src="/images/globe.jpg" 
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

       {/* ================= KEY DATES TABLE ================= */}
      <section className="py-16 bg-gradient-to-r from-[#0A2540] to-[#1a3a5c]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaClock className="text-[#F5A623] text-3xl" />
              <h2 className="text-3xl font-bold text-white uppercase">Key Dates</h2>
            </div>
            <div className="w-16 h-1 bg-[#F5A623] mx-auto"></div>
            <p className="text-gray-300 mt-4">
              Mark your calendars with these important deadlines for the 3rd International Agri-Life & Bioresource Science Symposium
            </p>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-xl">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-[#0A2540] text-white px-6 py-4">
              <div className="col-span-1 flex items-center justify-center">
                <FaCalendarAlt className="text-[#F5A623]" />
              </div>
              <div className="col-span-3 font-bold uppercase text-sm">Date</div>
              <div className="col-span-4 font-bold uppercase text-sm">Event</div>
              <div className="col-span-4 font-bold uppercase text-sm">Description</div>
            </div>

            {/* Table Rows */}
            {keyDatesData.map((item, idx) => (
              <div 
                key={idx}
                className={`grid grid-cols-12 px-6 py-4 items-center border-b border-zinc-100 last:border-b-0 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'
                } hover:bg-blue-100 transition-colors duration-200`}
              >
                <div className="col-span-1 flex items-center justify-center text-[#F5A623] text-xl">
                  {item.icon}
                </div>
                <div className="col-span-3">
                  <span className="font-bold text-[#0A2540]">{item.date}</span>
                </div>
                <div className="col-span-4">
                  <span className="font-semibold text-gray-700">{item.event}</span>
                </div>
                <div className="col-span-4">
                  <span className="text-sm text-gray-600">{item.description}</span>
                </div>
              </div>
            ))}

            {/* Table Footer with Action */}
            <div className="bg-gray-50 px-6 py-4 border-t border-zinc-200 flex justify-between items-center">
              <span className="text-sm text-gray-500">All deadlines are at 11:59 PM (UTC+8)</span>
            </div>
          </div>
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
                <span className="text-6xl font-bold text-green-700 mb-2">{item.value}</span>
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SCHEDULE ================= */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Day Tabs - Interactive */}
          <div className="grid grid-cols-1 md:grid-cols-3 rounded-t-xl overflow-hidden border border-zinc-200">
            <button
              onClick={() => setActiveDay(1)}
              className={`p-6 flex items-center justify-center gap-4 transition-all duration-300 ${
                activeDay === 1 
                  ? 'bg-[#0A2540] text-white shadow-lg' 
                  : 'bg-white text-[#0A2540] hover:bg-zinc-50'
              }`}
            >
              <FaCalendarAlt className={`text-3xl ${activeDay === 1 ? 'text-[#F5A623]' : 'text-[#0A2540]'}`} />
              <div>
                <p className={`font-bold text-lg leading-tight ${activeDay === 1 ? 'text-white' : 'text-gray-700'}`}>
                  DAY 1
                </p>
                <p className={`text-sm ${activeDay === 1 ? 'text-gray-400' : 'text-gray-600'}`}>
                  March 11, 2026
                </p>
              </div>
            </button>

            <button
              onClick={() => setActiveDay(2)}
              className={`p-6 flex items-center justify-center gap-4 transition-all duration-300 ${
                activeDay === 2 
                  ? 'bg-[#0A2540] text-white shadow-lg' 
                  : 'bg-white text-[#0A2540] hover:bg-zinc-50'
              } border-x border-zinc-200`}
            >
              <FaCalendarAlt className={`text-3xl ${activeDay === 2 ? 'text-[#F5A623]' : 'text-[#0A2540]'}`} />
              <div>
                <p className={`font-bold text-lg leading-tight ${activeDay === 2 ? 'text-white' : 'text-gray-700'}`}>
                  DAY 2
                </p>
                <p className={`text-sm ${activeDay === 2 ? 'text-gray-400' : 'text-gray-600'}`}>
                  March 12, 2026
                </p>
              </div>
            </button>

            <button
              onClick={() => setActiveDay(3)}
              className={`p-6 flex items-center justify-center gap-4 transition-all duration-300 ${
                activeDay === 3 
                  ? 'bg-[#0A2540] text-white shadow-lg' 
                  : 'bg-white text-[#0A2540] hover:bg-zinc-50'
              }`}
            >
              <FaCalendarAlt className={`text-3xl ${activeDay === 3 ? 'text-[#F5A623]' : 'text-[#0A2540]'}`} />
              <div>
                <p className={`font-bold text-lg leading-tight ${activeDay === 3 ? 'text-white' : 'text-gray-700'}`}>
                  DAY 3
                </p>
                <p className={`text-sm ${activeDay === 3 ? 'text-gray-400' : 'text-gray-600'}`}>
                  March 13, 2026
                </p>
              </div>
            </button>
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
                <div className="col-span-3 text-sm font-semibold text-gray-600 pt-1">{row.time}</div>
                <div className="col-span-9 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#e8f0fe] text-[#0A2540] flex items-center justify-center text-lg shrink-0">
                    {row.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-700 uppercase text-sm mb-1">{row.title}</p>
                    {row.subtitle && (
                      <p className="text-sm text-gray-600 whitespace-pre-line">{row.subtitle}</p>
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
              <p className="text-gray-600 mb-6">
                Get the complete program schedule in PDF format.
              </p>
              <button className="inline-flex items-center gap-2 border-2 border-[#0A2540] text-[#0A2540] px-6 py-3 rounded-md font-bold hover:bg-[#0A2540] hover:text-white transition-colors">
                <FaDownload /> <span className="text-gray-700">DOWNLOAD FULL PROGRAM (PDF)</span>
              </button>
            </div>
            <div className="w-40 shrink-0 bg-white shadow-lg border border-zinc-200 p-4 rounded-lg flex flex-col items-center text-center">
               <div className="w-24 h-36 bg-blue-100 mb-2 relative overflow-hidden rounded">
                 <Image src="/program-cover.png" alt="Program Cover" fill className="object-cover" />
               </div>
               <p className="text-[10px] font-bold text-gray-700 mt-2 leading-tight">INTERNATIONAL<br/>SCIENCE<br/>SYMPOSIUM<br/>2026</p>
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
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
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