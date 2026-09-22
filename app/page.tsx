"use client";

import { ContentProvider } from "@/app/context/ContentContext";
import HomeView from "@/app/home/HomeView";

export default function Home() {
  return (
    <ContentProvider pageSlug="home">
      <HomeView />
    </ContentProvider>
  );
}