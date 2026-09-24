"use client";

import { ContentProvider } from "@/app/context/ContentContext";
import HomeView from "@/app/home/HomeView";

export default function Home() {
  return (
    <ContentProvider pageSlug="home">
      <div className="flex flex-col min-h-screen bg-[#F5F6FA] font-sans text-[#0B2A4A]">
        <HomeView />
      </div>
    </ContentProvider>
  );
}