"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

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

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the mobile menu when the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Subtle shadow once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-gray-200/80 shadow-[0_4px_24px_-8px_rgba(11,42,74,0.18)]"
          : "bg-white/95 backdrop-blur-sm border-gray-100"
      }`}
    >
      <nav
        className="mx-auto flex w-full max-w-[1280px] items-center justify-center max-xl:justify-between"
        style={{
          // Fluid spacing: shrinks smoothly on laptop screens
          paddingInline: "clamp(1rem, 2vw, 2rem)",
          paddingBlock: "clamp(0.6rem, 0.7vw, 0.85rem)",
          gap: "clamp(1rem, 2vw, 2.5rem)",
        }}
      >
        {/* ── Logo ── */}
        <Link href="/" aria-label="Symposium home" className="group shrink-0">
          <div
            className="relative rounded-full overflow-hidden bg-white ring-2 ring-[#D5A54D] ring-offset-2 ring-offset-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
            style={{
              width: "clamp(2.5rem, 3vw, 3.75rem)",
              height: "clamp(2.5rem, 3vw, 3.75rem)",
            }}
          >
            <Image
              src="https://res.cloudinary.com/xbloqjom/image/upload/v1794390273/logo3.png"
              alt="Symposium Logo"
              fill
              className="object-cover scale-110"
              priority
            />
          </div>
        </Link>

        {/* ── Desktop navigation ── */}
        <ul
          className="hidden xl:flex items-center font-semibold"
          style={{
            fontSize: "clamp(0.72rem, 0.75vw, 0.875rem)",
            gap: "clamp(0rem, 0.2vw, 0.35rem)",
          }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative block whitespace-nowrap rounded-lg px-[0.7em] py-[0.55em] transition-colors duration-200 ${
                    isActive
                      ? "text-[#0B2A4A]"
                      : "text-gray-500 hover:text-[#0B2A4A] hover:bg-[#0B2A4A]/5"
                  }`}
                >
                  {item.label}
                  {/* Gold indicator */}
                  <span
                    aria-hidden
                    className={`absolute left-[0.7em] right-[0.7em] -bottom-0.5 h-0.5 rounded-full bg-[#D5A54D] origin-center transition-transform duration-300 ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-50"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Mobile / tablet menu button ── */}
        <button
          type="button"
          className="xl:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-[#0B2A4A] hover:bg-gray-50 transition-colors"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* ── Mobile / tablet panel ── */}
      <div
        id="mobile-nav"
        className={`xl:hidden grid transition-[grid-template-rows] duration-300 ease-out ${
          menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="mx-auto max-w-[1280px] px-4 pb-4 pt-1 grid gap-1 sm:grid-cols-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    tabIndex={menuOpen ? 0 : -1}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-[#0B2A4A] text-white"
                        : "text-[#0B2A4A] hover:bg-[#0B2A4A]/5"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#F0C674]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </header>
  );
}