"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { ContentProvider } from "@/app/context/ContentContext";
import HomeView from "@/app/home/HomeView";
import AdminToolbar from "@/app/components/AdminToolbar";

export default function Home() {
  return (
    <ContentProvider pageSlug="home">
      <div className="flex flex-col min-h-screen bg-[#F5F6FA] font-sans text-[#0B2A4A]">
        <Header />
        <HomeView />
        <Footer />
        <AdminToolbar />
      </div>
    </ContentProvider>
  );
}