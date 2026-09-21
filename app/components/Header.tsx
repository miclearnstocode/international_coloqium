// app/components/Header.tsx (Alternative with larger logo)
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Program", href: "/program" },
    { label: "Scientific Tracks", href: "/scientific-tracks" },
    { label: "Abstract Submission", href: "/abstract-submission" },
    { label: "Registration", href: "/registration" },
    { label: "Guidelines", href: "/presentation-guidelines" },
    { label: "Partner Institutions", href: "/partner-institutions" },
    { label: "Hotel & Mapping", href: "/hotel-mapping" },
    { label: "Contact Us", href: "/contact-us" },  
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <nav className="mx-auto flex max-w-350 items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/" className="relative flex items-center">
            {/* Logo Image - Larger version */}
            <div className="relative h-24 w-24 overflow-hidden border-2 border-[#D5A54D]">
              <Image
                src="/images/mainlogo.png"
                alt="3rd International  Agri-Life & Bioresource Science Symposium Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </Link>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-wider text-[#0B2A4A] whitespace-nowrap">
              3rd International < br /> Agri-Life & Bioresource
            </span>
            <span className="text-sm font-semibold tracking-wider text-[#0B2A4A] whitespace-nowrap">
              Science Symposium
            </span>
            <span className="text-xs text-[#D5A54D] font-medium whitespace-nowrap">
              March 10-13, 2027 < br /> Roxas City, Philippines
            </span>
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
                      ? "text-[#1D3D6D] border-b-2 border-[#D5A54D] pb-1 font-semibold" 
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