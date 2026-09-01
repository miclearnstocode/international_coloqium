"use client";

import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  FaMicroscope,
  FaLaptopCode,
  FaBookOpen,
  FaMapMarkerAlt,
  FaCalculator,
  FaUsers,
  FaBullhorn,
  FaHandshake,
  FaGraduationCap,
  FaUserTie,
  FaUsersCog,
  FaArrowRight,
  FaChevronRight,
} from "react-icons/fa";

// Committee Members Data
const committeeData = {
  chairpersons: [
    {
      name: "DR. JONATHAN R. DELA CRUZ",
      role: "Chairperson",
      org: "President",
      image: "/images/committee/jonathan.jpg",
    },
    {
      name: "DR. MARIA THERESA B. SANTOS",
      role: "Co-Chairperson",
      org: "Vice President for Research and Extension",
      image: "/images/committee/maria.jpg",
    },
    {
      name: "DR. ARNEL P. NOVELO",
      role: "Scientific Director",
      org: "Dean, College of Graduate Studies",
      image: "/images/committee/arnel.jpg",
    },
    {
      name: "DR. LIZA G. MANALO",
      role: "Organizing Director",
      org: "Director, Research and Development",
      image: "/images/committee/liza.jpg",
    },
  ],

  committees: [
    {
      id: "scientific",
      title: "SCIENTIFIC COMMITTEE",
      icon: FaMicroscope,
      members: [
        "Dr. Arnel P. Novelo (Chair)",
        "Dr. Maria Theresa B. Santos",
        "Dr. Ramil B. Mariano",
        "Dr. Edgardo T. Reyes",
        "Dr. Joy Grace D. Pabilico",
      ],
      viewMore: true,
    },
    {
      id: "technical",
      title: "TECHNICAL PROGRAM COMMITTEE",
      icon: FaLaptopCode,
      members: [
        "Dr. Maria Cristina L. Villanueva (Chair)",
        "Dr. Ramil B. Mariano",
        "Dr. Leticia B. Cornez",
        "Dr. Alvin M. Mendoza",
        "Dr. Karen Joy E. Felizardo",
      ],
      viewMore: true,
    },
    {
      id: "publication",
      title: "PUBLICATION COMMITTEE",
      icon: FaBookOpen,
      members: [
        "Dr. Ramil B. Mariano (Chair)",
        "Dr. Edgardo T. Reyes",
        "Dr. Germylin C. Esteban",
        "Dr. Libeth B. Garcia",
        "Dr. Dennis M. Maligaya",
      ],
      viewMore: true,
    },
    {
      id: "logistics",
      title: "LOGISTICS AND VENUE COMMITTEE",
      icon: FaMapMarkerAlt,
      members: [
        "Engr. Jose P. Dela Vega (Chair)",
        "Mr. Christian Paul A. Arevalo",
        "Ms. Angelica M. Tolentino",
        "Mr. Mark Anthony D. Ignacio",
        "Ms. Reynaldo B. Ramos",
      ],
      viewMore: true,
    },
    {
      id: "finance",
      title: "FINANCE COMMITTEE",
      icon: FaCalculator,
      members: [
        "Dr. Liza G. Manalo (Chair)",
        "Ms. Rowena P. Gonzales",
        "Ms. Juvylyn B. Toledo",
        "Mr. Ricardo P. Dizon",
        "Ms. Mary Grace L. Bautista",
      ],
      viewMore: true,
    },
    {
      id: "registration",
      title: "REGISTRATION AND SECRETARIAT COMMITTEE",
      icon: FaUsers,
      members: [
        "Dr. Joy Grace D. Pabilico (Chair)",
        "Ms. Hannah Mae P. De Guzman",
        "Ms. Princess Joy D. Basilio",
        "Mr. John Carlo V. Rivera",
        "Ms. Sheira L. Pangindian",
      ],
      viewMore: true,
    },
    {
      id: "publicity",
      title: "PUBLIC RELATIONS AND COMMUNICATION COMMITTEE",
      icon: FaBullhorn,
      members: [
        "Ms. Angelica M. Tolentino (Chair)",
        "Ms. Alyssa Mae R. Bautista",
        "Ms. Bela Katrina E. Enriquez",
        "Mr. John Michael B. Eusebio",
        "Ms. Patricia Anne D. Santiago",
      ],
      viewMore: true,
    },
    {
      id: "sponsorship",
      title: "SPONSORSHIP AND PARTNERSHIP COMMITTEE",
      icon: FaHandshake,
      members: [
        "Engr. Jose P. Dela Vega (Chair)",
        "Dr. Alvin M. Mendoza",
        "Mr. Christian Paul A. Arevalo",
        "Ms. Juvylyn B. Toledo",
        "Mr. Mark Anthony D. Ignacio",
      ],
      viewMore: true,
    },
    {
      id: "student",
      title: "STUDENT AFFAIRS COMMITTEE",
      icon: FaGraduationCap,
      members: [
        "Dr. Karen Joy E. Felizardo (Chair)",
        "Ms. Sheira L. Pangindian",
        "Ms. Angelica M. Tolentino",
        "Mr. John Carlo V. Rivera",
        "Ms. Princess Joy D. Basilio",
      ],
      viewMore: true,
    },
  ],

  advisoryBoard: [
    {
      name: "Dr. Antonio V. Agustin",
      affiliation: "University of the Philippines Los Baños",
    },
    {
      name: "Dr. Maria Elvira B. Alberto",
      affiliation: "BMEAM/SEARCA",
    },
    {
      name: "Dr. Rex B. Demafelis",
      affiliation: "National Bioenergy Research Institute (NBRI)",
    },
    {
      name: "Dr. Fernando C. Sanchez, Jr.",
      affiliation: "Department of Agriculture",
    },
    {
      name: "Dr. Priscilla C. Bansil",
      affiliation: "DOST - PCAARRD",
    },
  ],
};

export default function CommitteePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-[#0B2A4A] via-[#1D3D6D] to-[#2A5A8C] py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-gray-300 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <FaChevronRight className="w-3 h-3" />
            <span className="text-white font-medium">Committee</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Our Committee</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Meet the dedicated experts and professionals behind the International Colloquium 2025. Their leadership, expertise, and commitment ensure the success of this global event.
          </p>
        </div>
      </section>

      {/* Chairpersons Section */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {committeeData.chairpersons.map((person, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 p-6 text-center hover:shadow-xl transition-shadow">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-[#1D3D6D] to-[#2A5A8C] opacity-10"></div>
                  <div className="relative w-24 h-24 rounded-full bg-[#1D3D6D] text-white flex items-center justify-center text-4xl font-bold overflow-hidden border-4 border-[#D5A54D]/30">
                    {person.name.split(" ").slice(0, 2).map(n => n[0]).join("")}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-[#0B2A4A] mb-1 uppercase tracking-wide">{person.name}</h3>
                <p className="text-[#D5A54D] text-sm font-semibold mb-2">{person.role}</p>
                <p className="text-gray-500 text-xs">{person.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Committees Grid */}
      <section className="pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {committeeData.committees.map((committee) => (
              <div key={committee.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#1D3D6D] transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1D3D6D] text-white flex items-center justify-center text-xl">
                    <committee.icon />
                  </div>
                  <h2 className="text-sm font-bold text-[#0B2A4A] uppercase leading-tight">{committee.title}</h2>
                </div>
                <ul className="space-y-2">
                  {committee.members.map((member, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-[#D5A54D] mt-0.5">
                        <FaChevronRight className="w-3 h-3" />
                      </span>
                      <span>{member}</span>
                    </li>
                  ))}
                </ul>
                {committee.viewMore && (
                  <button className="mt-4 text-[#1D3D6D] text-sm font-semibold hover:text-[#D5A54D] transition-colors flex items-center gap-2">
                    View more members <FaArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Board */}
      <section className="pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#1D3D6D] text-white flex items-center justify-center text-xl">
                <FaUsersCog />
              </div>
              <h2 className="text-sm font-bold text-[#0B2A4A] uppercase">ADVISORY BOARD</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {committeeData.advisoryBoard.map((member, index) => (
                <div key={index} className="text-center p-4 rounded-xl bg-gray-50 hover:bg-[#1D3D6D]/5 transition-colors">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#1D3D6D]/10 text-[#1D3D6D] flex items-center justify-center text-lg">
                    <FaUserTie />
                  </div>
                  <h3 className="text-sm font-semibold text-[#0B2A4A] mb-1">{member.name}</h3>
                  <p className="text-xs text-gray-500">{member.affiliation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-linear-to-r from-[#0B2A4A] to-[#1D3D6D] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#D5A54D] text-[#0B2A4A] flex items-center justify-center text-xl shrink-0">
                <FaUsers />
              </div>
              <div>
                <h2 className="text-white text-lg font-bold mb-1">Together for Excellence in Research and Innovation</h2>
                <p className="text-gray-300 text-sm">
                  Our committee is committed to fostering meaningful collaboration and creating a global impact through knowledge and innovation.
                </p>
              </div>
            </div>
            <button className="bg-white text-[#0B2A4A] px-8 py-3 rounded-xl font-semibold hover:bg-[#D5A54D] hover:text-[#0B2A4A] transition-colors flex items-center gap-2 shrink-0">
              Contact the Secretariat <FaArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}