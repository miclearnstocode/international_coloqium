"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "leaflet/dist/leaflet.css"; 
import Link from "next/link";

import { 
  FaMapMarkerAlt, FaBuilding, FaUsers, FaBed, FaUniversity, 
  FaPlus, FaMinus, FaChevronRight, FaInfoCircle, FaCar, 
  FaPlane, FaWalking, FaDownload, FaCity, FaGlobeAsia
} from "react-icons/fa";

// Dynamically import Leaflet map to avoid SSR errors
const MapContainer: any = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker: any = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

export default function HotelMapping() {
  const [customIcon, setCustomIcon] = useState<any>(null);

  useEffect(() => {
    // Load Leaflet only on the client
    const L = require("leaflet");
    const icon = L.divIcon({
      className: 'custom-pin',
      html: '<div style="background-color: #1D3D6D; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24]
    });
    setCustomIcon(icon);
  }, []);

  const venues = [
    {
      id: 1,
      name: "Capiz State University Main Campus",
      desc: "Plenary sessions, keynotes, and general assemblies",
      loc: "Roxas City, Capiz",
      icon: <FaBuilding className="text-white" />,
      color: "bg-[#1D3D6D]",
      pos: [11.5867, 122.7506] as [number, number]
    },
    {
      id: 2,
      name: "Conference Hall A",
      desc: "Parallel sessions – Track 1 & 2",
      loc: "Roxas City, Capiz",
      icon: <FaUsers className="text-white" />,
      color: "bg-[#4CAF50]",
      pos: [11.5875, 122.7515] as [number, number]
    },
    {
      id: 3,
      name: "Conference Hall B",
      desc: "Parallel sessions – Track 3 & 4",
      loc: "Roxas City, Capiz",
      icon: <FaBuilding className="text-white" />,
      color: "bg-[#F57C00]",
      pos: [11.5858, 122.7520] as [number, number]
    },
    {
      id: 4,
      name: "Student Center",
      desc: "Poster presentations, exhibits, and networking area",
      loc: "Roxas City, Capiz",
      icon: <FaUniversity className="text-white" />,
      color: "bg-[#8E24AA]",
      pos: [11.5849, 122.7535] as [number, number]
    },
    {
      id: 5,
      name: "Capiz SU Guesthouse",
      desc: "Official accommodation for invited guests",
      loc: "Roxas City, Capiz",
      icon: <FaBed className="text-white" />,
      color: "bg-[#E53935]",
      pos: [11.5840, 122.7540] as [number, number]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0B2A4A] flex flex-col">
      <Header />

      {/* ================= PAGE HERO ================= */}
      <section className="relative bg-white overflow-hidden border-b border-zinc-100">
        <div className="max-w-350 mx-auto px-8 py-16 relative z-10">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
            <Link href="/" className="hover:text-[#F5A623] transition-colors">
              Home
            </Link>
            <span className="text-zinc-300">›</span>
            <span className="text-[#0B2A4A] font-medium">Hotel & Mapping</span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-[#0B2A4A] mb-4">Hotel & Mapping</h1>
              <div className="w-16 h-1 bg-[#D5A54D] mb-6"></div>
              <p className="text-lg text-zinc-600 leading-relaxed">
                Find your way to the 3rd International Agri-Life & Bioresource Science Symposium venues. All venues are located within the campus of Capiz State University, Roxas City, Capiz, Philippines.
              </p>
            </div>
            
            {/* Map Illustration */}
            <div className="hidden md:flex justify-center items-center">
              <FaMapMarkerAlt className="text-[#1D3D6D] text-[150px] opacity-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAP & VENUE LIST ================= */}
      <section className="py-16">
        <div className="max-w-350 mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Map & Important Note */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-8">
                <div className="flex items-center gap-4 mb-6">
                  <FaMapMarkerAlt className="text-[#1D3D6D] text-2xl" />
                  <div>
                    <h2 className="text-xl font-bold text-[#0B2A4A] uppercase">Event Venue & Map</h2>
                    <p className="text-sm text-zinc-500">Explore the event locations and navigate easily within the campus.</p>
                  </div>
                </div>

                {/* Leaflet Map */}
                <div className="h-125 rounded-xl overflow-hidden shadow-inner border border-zinc-200 relative z-0">
                  {customIcon && (
                    <MapContainer center={[11.5867, 122.7506] as [number, number]} zoom={16} style={{ height: "100%", width: "100%" }}>
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {venues.map((venue) => (
                        <Marker key={venue.id} position={venue.pos} icon={customIcon}>
                          <Popup>{venue.name}</Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  )}
                  
                  {/* Map Controls (Visual only) */}
                  <div className="absolute top-4 left-4 z-1000 flex flex-col shadow-md rounded-md overflow-hidden">
                    <button className="bg-white p-2 hover:bg-zinc-100"><FaPlus size={12} /></button>
                    <div className="h-px bg-zinc-200"></div>
                    <button className="bg-white p-2 hover:bg-zinc-100"><FaMinus size={12} /></button>
                  </div>
                </div>
              </div>

              {/* Important Note */}
              <div className="bg-[#F0F6FF] border border-blue-100 rounded-xl p-6 flex gap-4 items-start">
                <FaInfoCircle className="text-[#1D3D6D] text-xl mt-1 shrink-0" />
                <div>
                  <p className="font-bold text-[#0B2A4A] mb-1">Important Note</p>
                  <p className="text-sm text-zinc-600">All venues are within walking distance of each other. Shuttle services will be available during the event.</p>
                </div>
              </div>
            </div>

            {/* Right: Venue List */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-8">
                <div className="flex items-center gap-4 mb-6">
                  <FaBuilding className="text-[#1D3D6D] text-xl" />
                  <div>
                    <h2 className="text-xl font-bold text-[#0B2A4A] uppercase">Venue List</h2>
                    <p className="text-sm text-zinc-500">Click a venue to view details and highlight the location on the map.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {venues.map((venue) => (
                    <div key={venue.id} className="flex gap-4 items-start">
                      <div className={`w-8 h-8 rounded-full ${venue.color} flex items-center justify-center text-sm font-bold text-white shrink-0 mt-1`}>
                        {venue.id}
                      </div>
                      <div>
                        <p className="font-bold text-[#0B2A4A] text-sm mb-1">{venue.name}</p>
                        <p className="text-xs text-zinc-500 mb-2">{venue.desc}</p>
                        <p className="text-xs text-zinc-600 flex items-center gap-1.5">
                          <FaMapMarkerAlt className="text-[#1D3D6D]" /> {venue.loc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VENUE DETAILS & TRAVEL INFORMATION ================= */}
      <section className="bg-white py-16 border-t border-zinc-100">
        <div className="max-w-350 mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Venue Details */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <FaBuilding className="text-[#1D3D6D] text-2xl" />
              <h2 className="text-2xl font-bold text-[#0B2A4A] uppercase">Venue Details</h2>
            </div>

            <div className="space-y-4">
              {venues.map((venue) => (
                <div key={venue.id} className="bg-white border border-zinc-200 rounded-lg p-5 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${venue.color} flex items-center justify-center text-base font-bold text-white shrink-0`}>
                      {venue.id}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#1D3D6D] text-lg">{venue.icon}</span>
                      <div>
                        <p className="font-bold text-[#0B2A4A] text-sm">{venue.name}</p>
                        <p className="text-xs text-zinc-500">{venue.desc}</p>
                      </div>
                    </div>
                  </div>
                  <FaChevronRight className="text-zinc-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Travel Information */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <FaCar className="text-[#1D3D6D] text-2xl" />
              <h2 className="text-2xl font-bold text-[#0B2A4A] uppercase">Travel Information</h2>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F0F6FF] text-[#1D3D6D] flex items-center justify-center text-lg shrink-0">
                  <FaCar />
                </div>
                <div>
                  <p className="font-bold text-[#0B2A4A] text-sm mb-1">From Manila</p>
                  <p className="text-sm text-zinc-500">Approximately 10 – 12 hours by car via NLEX • SCTEX • TPLEX • Roxas-Iloilo Road, or via RORO.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F0F6FF] text-[#1D3D6D] flex items-center justify-center text-lg shrink-0">
                  <FaPlane />
                </div>
                <div>
                  <p className="font-bold text-[#0B2A4A] text-sm mb-1">Roxas City Airport (RXS)</p>
                  <p className="text-sm text-zinc-500">Approximately 15 minutes by car from Roxas City Airport to Capiz State University.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F0F6FF] text-[#1D3D6D] flex items-center justify-center text-lg shrink-0">
                  <FaGlobeAsia />
                </div>
                <div>
                  <p className="font-bold text-[#0B2A4A] text-sm mb-1">From Iloilo City</p>
                  <p className="text-sm text-zinc-500">Approximately 2.5 hours by car via Roxas-Iloilo Road.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F0F6FF] text-[#1D3D6D] flex items-center justify-center text-lg shrink-0">
                  <FaWalking />
                </div>
                <div>
                  <p className="font-bold text-[#0B2A4A] text-sm mb-1">Campus Access</p>
                  <p className="text-sm text-zinc-500">Enter through Capiz SU Main Gate. Follow signage to event venues.</p>
                </div>
              </div>
            </div>

            {/* Download Box */}
            <div className="mt-10 bg-[#F0F6FF] border border-blue-100 rounded-xl p-6">
              <div className="flex gap-4">
                <FaDownload className="text-[#1D3D6D] text-xl mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-[#0B2A4A] text-sm mb-1">Download Campus Map</p>
                  <p className="text-sm text-zinc-500 mb-4">Get the campus map in PDF format for offline use.</p>
                  <button className="bg-[#1D3D6D] text-white px-6 py-2.5 rounded-md text-sm font-bold hover:bg-[#143b66] transition-colors flex items-center gap-2">
                    Download PDF <FaDownload />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="bg-[#F0F6FF] py-8">
        <div className="max-w-350 mx-auto px-8">
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#F0F6FF] rounded-full flex items-center justify-center">
                <FaMapMarkerAlt className="text-[#1D3D6D] text-3xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B2A4A] mb-1">Need Assistance?</h3>
                <p className="text-zinc-500">Our secretariat is ready to help you with directions and other inquiries.</p>
              </div>
            </div>
            <button className="bg-[#1D3D6D] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#143b66] transition-colors flex items-center gap-2 shrink-0">
              Contact Secretariat <FaChevronRight />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}