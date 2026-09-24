"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  fetchPublicEvents,
  pickFeaturedEvent,
  formatDateRange,
  type PublicEvent,
} from "@/app/lib/events";

// Fallback values shown if no event is in the DB yet
const FALLBACK = {
  titleLine1: "3rd International",
  titleLine2: "Agri-Life & Bioresource",
  titleLine3: "Science Symposium",
  dateRange: "March 10–13, 2027",
  location: "Roxas City, Philippines",
};

/**
 * Break a long event title into up to 3 lines for the header layout.
 * Example: "3rd International Agri-Life & Bioresource Science Symposium"
 *   → ["3rd International", "Agri-Life & Bioresource", "Science Symposium"]
 */
function splitTitle(title: string): [string, string, string] {
  const clean = title.replace(/\s+/g, " ").trim();
  if (!clean) return ["", "", ""];

  const words = clean.split(" ");
  if (words.length <= 3) return [clean, "", ""];

  // Greedy 3-way split — roughly balanced by word count
  const per = Math.ceil(words.length / 3);
  const l1 = words.slice(0, per).join(" ");
  const l2 = words.slice(per, per * 2).join(" ");
  const l3 = words.slice(per * 2).join(" ");
  return [l1, l2, l3];
}

export default function Header() {
  const pathname = usePathname();
  const [event, setEvent] = useState<PublicEvent | null>(null);

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
  const [underline, setUnderline] = useState({
    left: 0,
    width: 0,
    visible: false,
  });
  const [hover, setHover] = useState({
    left: 0,
    width: 0,
    visible: false,
  });

  // ── Load featured event ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const events = await fetchPublicEvents();
      if (cancelled) return;
      setEvent(pickFeaturedEvent(events));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Animated underline ──
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

  // ── Derived header values ──
  const [line1, line2, line3] = event
    ? splitTitle(event.title)
    : [FALLBACK.titleLine1, FALLBACK.titleLine2, FALLBACK.titleLine3];

  const dateRange = event
    ? formatDateRange(event.date, event.endDate) || FALLBACK.dateRange
    : FALLBACK.dateRange;

  const location = event?.location?.trim() || FALLBACK.location;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <nav className="mx-auto flex max-w-350 items-center justify-between px-8 py-4">
        {/* ── Logo + Title ── */}
        <div className="relative flex items-center gap-6 shrink-0 pl-2">
          <Link href="/" className="relative shrink-0 group z-10">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-[#D5A54D] bg-white shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg">
              <Image
                src="/images/mainlogo.png"
                alt="Symposium Logo"
                fill
                className="object-cover scale-110"
                priority
              />
            </div>
          </Link>

          <div className="relative flex flex-col leading-tight z-20">
            {line1 && (
              <span className="text-base font-bold tracking-wider text-[#0B2A4A] whitespace-nowrap">
                {line1}
              </span>
            )}
            {line2 && (
              <span className="text-base font-bold tracking-wider text-[#0B2A4A] whitespace-nowrap">
                {line2}
              </span>
            )}
            {line3 && (
              <span className="text-sm font-semibold tracking-wider text-[#0B2A4A] whitespace-nowrap">
                {line3}
              </span>
            )}
            {dateRange && (
              <span className="text-xs text-[#D5A54D] font-medium whitespace-nowrap mt-1">
                {dateRange}
              </span>
            )}
            {location && (
              <span className="text-xs text-[#D5A54D] font-medium whitespace-nowrap">
                {location}
              </span>
            )}
          </div>
        </div>

        {/* ── Navigation ── */}
        <ul
          className="hidden lg:flex items-center gap-5 text-sm font-medium text-gray-600 relative"
          onMouseLeave={() => setHover((h) => ({ ...h, visible: false }))}
        >
          <span
            aria-hidden
            className="absolute top-1/2 -translate-y-1/2 h-9 rounded-md bg-[#0B2A4A]/5 transition-all duration-300 ease-out pointer-events-none"
            style={{
              left: hover.left,
              width: hover.width,
              opacity: hover.visible ? 1 : 0,
            }}
          />

          <span
            aria-hidden
            className="absolute bottom-0 h-0.5 rounded-full bg-[#D5A54D] transition-all duration-300 ease-out pointer-events-none"
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