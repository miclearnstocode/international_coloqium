"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; 
import Header from "./components/Header";
import Footer from "./components/Footer";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function Home() {
  // Single state object for the whole timer
  const [timeLeft, setTimeLeft] = useState({
    days: 82,
    hours: 14,
    minutes: 36,
    seconds: 48
  });

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(prev => {
        // Destructure current values
        let { days, hours, minutes, seconds } = prev;

        // Decrement seconds
        seconds--;

        // If seconds go below 0, reset to 59 and subtract 1 minute
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }

        // If minutes go below 0, reset to 59 and subtract 1 hour
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }

        // If hours go below 0, reset to 23 and subtract 1 day
        if (hours < 0) {
          hours = 23;
          days--;
        }

        // Don't go below 0 days
        if (days < 0) {
          days = 0;
          hours = 0;
          minutes = 0;
          seconds = 0;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(id);
  }, []);

  // Format numbers with leading zeros
  const formatNumber = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F6FA] font-sans text-[#0B2A4A]">
      <Header />

      {/* Main Hero Section */}
      <main className="flex-1 relative overflow-hidden bg-linear-to-br from-[#E8EEF9] via-[#EAF1FA] to-[#DCE6F5]">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-150 h-150 bg-[#E3EAF5] rounded-full opacity-60 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-[#E3EAF5] rounded-full opacity-40 translate-y-1/2 -translate-x-1/4"></div>
        
        {/* Video Globe */}
        <div className="absolute -right-57.5 top-1/2 -translate-y-1/2 w-307.5 h-307.5 opacity-40 lg:opacity-70 pointer-events-none z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            className="w-full h-full object-contain"
          >
            <source src="/videos/global.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="relative z-10 mx-auto max-w-350 px-8 py-12 lg:py-16 min-h-150">
          <div className="relative">
            <div className="max-w-2xl">
              <span className="inline-block bg-[#E3D5C0] text-[#8B6F47] text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-sm mb-6 shadow-sm">
                Welcome to
              </span>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 text-[#0B2A4A]">
                3rd International Agri- <br /> Life & Bioresource <br /> Science Symposium
              </h1>
              
              <p className="text-[#D5A54D] text-xl lg:text-2xl font-semibold mb-3">
                Converging Frontiers in Agri-Life <br /> and Bioresource Sciences
              </p>
              
              <p className="text-gray-600 text-base lg:text-lg mb-8 max-w-md leading-relaxed">
                Science, Innovation & Collaboration <br /> for a Resilient and Sustainable Future
              </p>
              
              {/* Date with Icon */}
              <div className="flex items-center gap-3 mb-3">
                <FaCalendarAlt className="text-[#D5A54D] text-xl" />
                <p className="text-gray-600 text-xl lg:text-2xl font-semibold">
                  March 11-13, 2026
                </p>
              </div>
              
              {/* Address with Icon */}
              <div className="flex items-center gap-3 mb-8">
                <FaMapMarkerAlt className="text-[#D5A54D] text-xl" />
                <p className="text-gray-600 text-xl lg:text-2xl font-semibold">
                  Roxas City, Capiz, Philippines
                </p>
              </div>
              
              <Link 
                href="about" 
                className="inline-flex items-center gap-2 bg-[#1D3D6D] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#16305a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* Modal Card */}
            <div className="absolute top-0 right-0 lg:right-8 xl:right-16 hidden md:block">
              <div className="bg-white rounded-xl shadow-2xl p-8 w-105 border border-gray-100 z-20 relative">
                <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
                
                {/* Megaphone Icon */}
                <div className="flex justify-center mb-5 relative">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#D5A54D" className="w-14 h-14">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
                  </svg>
                  <div className="absolute -left-6 top-2 text-[#D5A54D] text-xs">✦</div>
                  <div className="absolute -right-4 top-4 text-[#1D3D6D] text-xs">✦</div>
                  <div className="absolute left-2 bottom-0 text-[#1D3D6D] text-[8px]">✦</div>
                  <div className="absolute right-0 bottom-2 text-[#D5A54D] text-[8px]">✦</div>
                </div>

                <h2 className="text-center text-xl font-bold mb-2 text-[#0B2A4A]">3rd International Agri-Life & Bioresource Science Symposium</h2>
                <p className="text-center text-[#D5A54D] font-semibold text-sm mb-6 leading-snug">
                  Science, Innovation & Collaboration for a Resilient  <br /> and Sustainable Future
                </p>


                <p className="text-center text-gray-500 text-xs mb-6 leading-relaxed">
                  Join researchers, scientists, educators, students, industry partners, and institutional leaders from the Philippines and around the world for three days of scientific exchange, interdisciplinary dialogue, and international collaboration.
                </p>

                <div className="flex justify-center">
                  <a href="#" className="bg-[#1D3D6D] text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-[#16305a] transition-colors shadow-md">
                    View Event Details
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Countdown Section */}
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0B2A4A] mb-2">SYMPOSIUM COUNTDOWN</h2>
            <div className="w-24 h-1 bg-[#D5A54D] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {/* Days */}
            <div className="bg-[#F5F6FA] rounded-xl p-8 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
              <svg className="w-10 h-10 text-[#1D3D6D] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span className="text-5xl font-bold text-[#0B2A4A] tabular-nums">{formatNumber(timeLeft.days)}</span>
              <span className="text-sm font-semibold text-gray-500 mt-2 uppercase">Days</span>
            </div>
            
            {/* Hours */}
            <div className="bg-[#F5F6FA] rounded-xl p-8 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
              <svg className="w-10 h-10 text-[#1D3D6D] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-5xl font-bold text-[#0B2A4A] tabular-nums">{formatNumber(timeLeft.hours)}</span>
              <span className="text-sm font-semibold text-gray-500 mt-2 uppercase">Hours</span>
            </div>
            
            {/* Minutes */}
            <div className="bg-[#F5F6FA] rounded-xl p-8 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
              <svg className="w-10 h-10 text-[#1D3D6D] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-5xl font-bold text-[#0B2A4A] tabular-nums">{formatNumber(timeLeft.minutes)}</span>
              <span className="text-sm font-semibold text-gray-500 mt-2 uppercase">Minutes</span>
            </div>
            
            {/* Seconds */}
            <div className="bg-[#F5F6FA] rounded-xl p-8 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
              <svg className="w-10 h-10 text-[#1D3D6D] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6l4 2m-4-8a9 9 0 100 18 9 9 0 000-18z"></path>
              </svg>
              <span 
                key={timeLeft.seconds} 
                className="clock-tick text-5xl font-bold text-[#0B2A4A] tabular-nums"
              >
                {formatNumber(timeLeft.seconds)}
              </span>
              <span className="text-sm font-semibold text-gray-500 mt-2 uppercase">Seconds</span>
            </div>
          </div>

          <p className="text-center font-semibold text-gray-700">
            March 11-13, 2027 <span className="mx-2 text-gray-300">|</span> Roxas City, Capiz Philippines
          </p>
        </div>
      </section>

      {/* Three Column Content */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: About */}
          <div className="bg-[#F5F6FA] p-8 rounded-lg">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-8 h-8 text-[#1D3D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-[#0B2A4A] mb-4">ABOUT THE CONFERENCE</h3>
            <div className="w-10 h-1 bg-[#D5A54D] mb-6"></div>
            <p className="text-red-600 mb-6">
              The 3rd International Agri-Life & Bioresource Science Symposium brings together scholars, practitioners, industry leaders, and students from around the world to explore innovative ideas, share research findings, and foster collaborations that drive sustainable development.
            </p>
            <a href="#" className="font-semibold text-[#0B2A4A] inline-flex items-center gap-2 hover:gap-3 transition-all">Read More <span>→</span></a>
          </div>

          {/* Card 2: Announcements */}
          <div className="bg-white border border-gray-200 p-8 rounded-lg">
            <h3 className="text-xl font-bold text-[#0B2A4A] mb-4">ANNOUNCEMENTS</h3>
            <div className="w-10 h-1 bg-[#D5A54D] mb-6"></div>
            
            <div className="space-y-4">
              {/* Item 1 */}
              <div className="flex gap-4 border-b border-gray-200 pb-4">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-[#1D3D6D]">Oct</span>
                  <span className="text-2xl font-bold text-[#0B2A4A]">05</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#D5A54D] uppercase mb-1">Important</p>
                  <p className="font-semibold text-[#0B2A4A] mb-1">Call for Abstracts</p>
                  <p className="text-sm text-gray-500">The official launching and dissemination of the Call for Abstracts and Registration  will be on Octber 5, 2026.</p>
                </div>
              </div>
              {/* Item 2 */}
              <div className="flex gap-4 border-b border-gray-200 pb-4">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-[#1D3D6D]">Dec</span>
                  <span className="text-2xl font-bold text-[#0B2A4A]">18</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#D5A54D] uppercase mb-1">Update</p>
                  <p className="font-semibold text-[#0B2A4A] mb-1">Registration is Now Open</p>
                  <p className="text-sm text-gray-500">Early bird registration is available until December 18, 2026.</p>
                </div>
              </div>
              {/* Item 3 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-[#1D3D6D]">Oct</span>
                  <span className="text-2xl font-bold text-[#0B2A4A]">10</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#D5A54D] uppercase mb-1">Announcement</p>
                  <p className="font-semibold text-[#0B2A4A] mb-1">Conference Program Preview</p>
                  <p className="text-sm text-gray-500">Check out the preliminary program and keynote speakers.</p>
                </div>
              </div>
            </div>

            <a href="#" className="mt-6 inline-flex items-center gap-2 font-semibold text-[#0B2A4A] hover:gap-3 transition-all">View All Announcements <span>→</span></a>
          </div>

          {/* Card 3: About Us */}
          <div className="bg-[#F5F6FA] p-8 rounded-lg">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-8 h-8 text-[#1D3D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-[#0B2A4A] mb-4">ABOUT US</h3>
            <div className="w-10 h-1 bg-[#D5A54D] mb-6"></div>
            <p className="text-red-600 mb-6">
              We are a dedicated team committed to organizing meaningful academic events that promote research excellence, knowledge exchange, and global partnerships.
            </p>
            <a href="#" className="font-semibold text-[#0B2A4A] inline-flex items-center gap-2 hover:gap-3 transition-all">More About Us <span>→</span></a>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}