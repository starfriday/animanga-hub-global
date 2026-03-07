/* eslint-disable @typescript-eslint/no-explicit-any */

import { ModernHero } from "@/components/home/ModernHero";
import { CardsSection } from "@/components/home/CardsSection";
import { getTrendingAnimes, getUpcomingAnimes, getOngoingPopular } from "@/services/shikimori";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AniVault — Смотрите аниме онлайн бесплатно",
  description: "Смотрите аниме онлайн бесплатно в высочайшем качестве. Тренды сезона, новинки, онгоинги и классика на AniVault.",
  openGraph: {
    title: "AniVault — Премиальный аниме-хаб",
    description: "Смотрите аниме онлайн бесплатно. Тренды, новинки и классика.",
    type: "website",
  },
};

export const revalidate = 3600; // Cache for 1 hour

export default async function Home() {
  let trending: any[] = [];
  let ongoing: any[] = [];
  let upcoming: any[] = [];

  try {
    // Fetch generic data from Shikimori
    [trending, ongoing, upcoming] = await Promise.all([
      getTrendingAnimes(15),
      getOngoingPopular(20),
      getUpcomingAnimes(14)
    ]);
  } catch (e) {
    console.error('Home page SSR fetch error:', e);
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* 1. Massive Banner Carousel */}
      <ModernHero trending={trending} />

      {/* 2. Main content area below slider */}
      <div className="pt-8 pb-24 space-y-4 md:space-y-8">

        {/* Сейчас смотрят (Онгоинги) */}
        <CardsSection
          title="Сейчас в тренде"
          items={trending.slice(5)} // Skip top 5 since they are in the hero
          href="/catalog?order=popularity"
        />

        {/* Новые серии (Онгоинги популярные) */}
        <CardsSection
          title="Новые серии"
          items={ongoing}
          href="/catalog?status=ongoing&order=popularity"
        />

        {/* Анонсы (Скоро выйдет) */}
        <CardsSection
          title="Скоро на экранах"
          items={upcoming}
          href="/catalog?status=anons&order=popularity"
          className="bg-white py-12 border-y border-secondary-muted/10 shadow-sm"
        />

      </div>
    </div>
  );
}
