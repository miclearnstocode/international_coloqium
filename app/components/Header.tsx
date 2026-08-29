// app/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Program", href: "/program" },
    { label: "Scientific Tracks", href: "/scientific-tracks" },
    { label: "Presentation Guidelines", href: "#" },
    { label: "Abstract Submission", href: "/abstract-submission" },
    { label: "Registration", href: "/registration" },
    { label: "Committee", href: "/comittee" },
    { label: "Partner Institutions", href: "/partner-institutions" },
    { label: "Hotel & Mapping", href: "/hotel-mapping" },
    { label: "About Us", href: "/about-us" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <nav className="mx-auto flex max-w-350 items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="relative">
            <div className="h-12 w-12 rounded-full bg-[#1D3D6D] text-white flex items-center justify-center text-2xl font-bold overflow-hidden border-2 border-[#D5A54D]">
              I
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-[#D5A54D] opacity-50 transform scale-110"></div>
          </Link>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-wider text-[#0B2A4A] whitespace-nowrap">3rd International Agri-</span>
            <span className="text-sm font-bold tracking-wider text-[#0B2A4A] whitespace-nowrap">Life & Bioresource </span>
            <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Science Symposium</span>
          </div>
        </div>
        
        <ul className="hidden lg:flex items-center gap-5 text-sm font-medium text-gray-600">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label} className="relative">
                <Link 
                  href={item.href} 
                  className={`whitespace-nowrap transition-colors hover:text-[#0B2A4A] ${
                    isActive 
                      ? "text-[#1D3D6D] border-b-2 border-[#1D3D6D] pb-1 font-semibold" 
                      : "text-gray-600"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}