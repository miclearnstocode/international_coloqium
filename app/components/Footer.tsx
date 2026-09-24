"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { fetchPublicEvents, pickFeaturedEvent } from "@/app/lib/events";

const FALLBACK_TITLE_LINES = [
  "3RD INTERNATIONAL AGRI-",
  "LIFE & BIORESOURCE",
  "SCIENCE SYMPOSIUM",
];

/**
 * Break a title into up to 3 uppercase lines for the footer.
 * "3rd International Agri-Life & Bioresource Science Symposium"
 *   → ["3RD INTERNATIONAL", "AGRI-LIFE & BIORESOURCE", "SCIENCE SYMPOSIUM"]
 */
function splitFooterTitle(title: string): string[] {
  const clean = (title || "").replace(/\s+/g, " ").trim().toUpperCase();
  if (!clean) return FALLBACK_TITLE_LINES;

  const words = clean.split(" ");
  if (words.length <= 3) return [clean];

  const per = Math.ceil(words.length / 3);
  return [
    words.slice(0, per).join(" "),
    words.slice(per, per * 2).join(" "),
    words.slice(per * 2).join(" "),
  ].filter(Boolean);
}

export default function Footer() {
  const [titleLines, setTitleLines] = useState<string[]>(FALLBACK_TITLE_LINES);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const events = await fetchPublicEvents();
      if (cancelled) return;
      const featured = pickFeaturedEvent(events);
      if (featured?.title) {
        setTitleLines(splitFooterTitle(featured.title));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="bg-[#0B2A4A] text-white py-8 mt-auto">
      <div className="mx-auto flex max-w-350 flex-col md:flex-row items-center justify-between px-8 gap-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="relative flex items-center">
            <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-[#D5A54D]">
              <Image
                src="/images/mainlogo.png"
                alt="Symposium Logo"
                fill
                className="object-cover"
              />
            </div>
          </Link>
          <div className="flex flex-col leading-tight">
            {titleLines.map((line, i) => {
              const isLast = i === titleLines.length - 1;
              return (
                <span
                  key={i}
                  className={
                    isLast
                      ? "text-sm tracking-wider"
                      : "text-sm font-bold tracking-wider"
                  }
                >
                  {line}
                </span>
              );
            })}
          </div>
        </div>

        {/* Center: Text */}
        <p className="text-sm text-gray-300 text-center">
          Science, Innovation & Collaboration <br className="md:hidden" /> for a
          Resilient and Sustainable Future.
        </p>

        {/* Right: Social Icons */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold mr-2">Follow Us</span>
          <a
            href="#"
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D5A54D] transition-colors"
          >
            <FaFacebookF />
          </a>
          <a
            href="#"
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D5A54D] transition-colors"
          >
            <FaTwitter />
          </a>
          <a
            href="#"
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D5A54D] transition-colors"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="#"
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D5A54D] transition-colors"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
}