"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  // Show logout only in authenticated submission and staff areas.
  const isSubmissionPage = pathname === "/submission" || pathname.startsWith("/submission/");
  const isStaffDashboard = pathname === "/staff/dashboard" || pathname.startsWith("/staff/dashboard/");
  const showLogout = isLoggedIn && (isSubmissionPage || isStaffDashboard);


  // Subtle shadow once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Check login state on mount, route changes, or storage events
  useEffect(() => {
    const checkAuth = () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (token && userStr) {
        try {
          const u = JSON.parse(userStr);
          setIsLoggedIn(true);
          setUserName(u.full_name || u.email || "User");
        } catch {
          setIsLoggedIn(true);
        }
      } else {
        setIsLoggedIn(false);
        setUserName(null);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("_adminVerified");
    setIsLoggedIn(false);
    setUserName(null);
    setMenuOpen(false);
    router.push("/login");
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-gray-200/80 shadow-[0_4px_24px_-8px_rgba(11,42,74,0.18)]"
          : "bg-white/95 backdrop-blur-sm border-gray-100"
      }`}
    >
      <nav
        className="mx-auto flex w-full max-w-350 items-center justify-center"
        style={{
          paddingInline: "clamp(1rem, 2vw, 2rem)",
          paddingBlock: "clamp(0.6rem, 0.7vw, 0.85rem)",
        }}
      >
        {/* ── Logo ── */}
        <Link href="/" aria-label="Symposium home" className="group shrink-0 mr-8 lg:mr-5">
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
        <div className="hidden xl:flex items-center gap-2">
          <ul className="flex items-center text-[13px] 2xl:text-sm font-semibold gap-0.5 2xl:gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative block whitespace-nowrap rounded-lg px-2.5 py-2 transition-colors duration-200 ${
                      isActive
                        ? "text-[#0B2A4A]"
                        : "text-gray-500 hover:text-[#0B2A4A] hover:bg-[#0B2A4A]/5"
                    }`}
                  >
                    {item.label}
                    {/* Gold indicator */}
                    <span
                      aria-hidden
                      className={`absolute left-2.5 right-2.5 -bottom-0.5 h-0.5 rounded-full bg-[#D5A54D] origin-center transition-transform duration-300 ${
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

          {/* ── Desktop Logout Button ── */}
          {showLogout && (
            <div className="flex items-center gap-2 pl-4 ml-4 border-l border-gray-200">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 border border-red-200 transition-all duration-200 shadow-xs cursor-pointer"
                title={userName ? `Logout (${userName})` : "Logout"}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* ── Mobile / tablet right controls ── */}
        <div className="xl:hidden flex items-center gap-2 ml-auto">
          {showLogout && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          )}

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-[#0B2A4A] hover:bg-gray-50 transition-colors"
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
        </div>
      </nav>

      {/* ── Mobile / tablet panel ── */}
      <div
        id="mobile-nav"
        className={`xl:hidden grid transition-[grid-template-rows] duration-300 ease-out ${
          menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="mx-auto max-w-7xl px-4 pb-4 pt-1 grid gap-1 sm:grid-cols-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}
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

            {/* Mobile panel Logout row */}
            {showLogout && (
              <li className="sm:col-span-2 pt-3 mt-1 border-t border-gray-100 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-gray-500 font-medium truncate max-w-45">
                    {userName ? `Logged in as ${userName}` : "Logged in"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}