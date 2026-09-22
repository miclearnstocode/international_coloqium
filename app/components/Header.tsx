// app/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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

  // Refs to each nav item so we can measure positions
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  // Position + width of the animated underline
  const [underline, setUnderline] = useState({ left: 0, width: 0, visible: false });
  // Position + width of hover indicator (separate from underline)
  const [hover, setHover] = useState({ left: 0, width: 0, visible: false });

  // Recompute underline whenever the route changes or the window resizes
  useEffect(() => {
    const update = () => {
      const activeIndex = navItems.findIndex((item) => item.href === pathname);
      const el = itemRefs.current[activeIndex];
      if (el) {
        setUnderline({
          left: el.offsetLeft,
          width: el.offsetWidth,
          visible: true,
        });
      } else {
        setUnderline((u) => ({ ...u, visible: false }));
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <nav className="mx-auto flex max-w-350 items-center justify-between px-8 py-4">
        {/* ── Logo + Title ── */}
        <div className="relative flex items-center gap-6 shrink-0 pl-2">
          {/* Circle logo — sits absolutely inside the padded wrapper */}
          <Link href="/" className="relative shrink-0 group z-10">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-[#D5A54D] bg-white shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg">
              <Image
                src="/images/mainlogo.png"
                alt="3rd International Agri-Life & Bioresource Science Symposium Logo"
                fill
                className="object-cover scale-110"
                priority
              />
            </div>
          </Link>

          {/* Title text — sits beside the logo, never under it */}
          <div className="relative flex flex-col leading-tight z-20">
            <span className="text-base font-bold tracking-wider text-[#0B2A4A] whitespace-nowrap">
              3rd International
            </span>
            <span className="text-base font-bold tracking-wider text-[#0B2A4A] whitespace-nowrap">
              Agri-Life &amp; Bioresource
            </span>
            <span className="text-sm font-semibold tracking-wider text-[#0B2A4A] whitespace-nowrap">
              Science Symposium
            </span>
            <span className="text-xs text-[#D5A54D] font-medium whitespace-nowrap mt-1">
              March 10–13, 2027
            </span>
            <span className="text-xs text-[#D5A54D] font-medium whitespace-nowrap">
              Roxas City, Philippines
            </span>
          </div>
        </div>

        {/* ── Navigation ── */}
        <ul
          className="hidden lg:flex items-center gap-5 text-sm font-medium text-gray-600 relative"
          onMouseLeave={() => setHover((h) => ({ ...h, visible: false }))}
        >
          {/* Animated hover background */}
          <span
            aria-hidden
            className="absolute top-1/2 -translate-y-1/2 h-9 rounded-md bg-[#0B2A4A]/5 transition-all duration-300 ease-out pointer-events-none"
            style={{
              left: hover.left,
              width: hover.width,
              opacity: hover.visible ? 1 : 0,
            }}
          />

          {/* Animated active underline */}
          <span
            aria-hidden
            className="absolute bottom-0 h-[2px] rounded-full bg-[#D5A54D] transition-all duration-300 ease-out pointer-events-none"
            style={{
              left: underline.left,
              width: underline.width,
              opacity: underline.visible ? 1 : 0,
            }}
          />

          {navItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <li
                key={item.label}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                className="relative"
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  setHover({
                    left: el.offsetLeft,
                    width: el.offsetWidth,
                    visible: true,
                  });
                }}
              >
                <Link
                  href={item.href}
                  className={`relative whitespace-nowrap px-2 py-1.5 transition-colors duration-200 z-10 ${
                    isActive
                      ? "text-[#1D3D6D] font-semibold"
                      : "text-gray-600 hover:text-[#0B2A4A]"
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