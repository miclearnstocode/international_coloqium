// app/components/Footer.tsx
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0B2A4A] text-white py-8 mt-auto">
      <div className="mx-auto flex max-w-350 flex-col md:flex-row items-center justify-between px-8 gap-6">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-white/10 text-white flex items-center justify-center text-2xl font-bold overflow-hidden border-2 border-[#D5A54D]">
              IC
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-wider">3RD INTERNATIONAL AGRI-</span>
            <span className="text-sm font-bold tracking-wider">LIFE & BIORESOURCE</span>
            <span className="text-sm tracking-wider">SCIENCE SYMPOSIUM</span>
          </div>
        </div>

        {/* Center: Text */}
        <p className="text-sm text-gray-300 text-center">
          Innovation, Collaboration, Research <br className="md:hidden" /> for a Sustainable Future.
        </p>

        {/* Right: Social Icons */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold mr-2">Follow Us</span>
          <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D5A54D] transition-colors"><FaFacebookF /></a>
          <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D5A54D] transition-colors"><FaTwitter /></a>
          <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D5A54D] transition-colors"><FaLinkedinIn /></a>
          <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D5A54D] transition-colors"><FaInstagram /></a>
        </div>
      </div>
    </footer>
  );
}