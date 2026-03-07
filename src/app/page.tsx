import { BrutalistHero } from "@/components/home/BrutalistHero";
import { MangaPulseGrid } from "@/components/home/MangaPulseGrid";
import { HUDContinueWatching } from "@/components/home/HUDContinueWatching";
import { MoodEditorialPicks } from "@/components/home/MoodEditorialPicks";
import { getTrendingAnimes, getUpcomingAnimes, getOngoingPopular } from "@/services/shikimori";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AniVault — Премиальный аниме-хаб | Смотрите онлайн",
  description: "Смотрите аниме онлайн бесплатно в высочайшем качестве. Тренды сезона, предстоящие релизы и персональные рекомендации на AniVault.",
  openGraph: {
    title: "AniVault — Премиальный аниме-хаб",
    description: "Смотрите аниме онлайн бесплатно. Тренды, новинки и классика.",
    type: "website",
  },
};

export default async function Home() {
  let trending: any[] = [];
  let ongoing: any[] = [];
  let upcoming: any[] = [];

  try {
    [trending, ongoing, upcoming] = await Promise.all([
      getTrendingAnimes(10),
      getOngoingPopular(20),
      getUpcomingAnimes(14)
    ]);
  } catch (e) {
    console.error('Home page SSR fetch error:', e);
  }

  return (
    <>
      <BrutalistHero trending={trending} />
      <MangaPulseGrid trending={ongoing} />
      <HUDContinueWatching upcoming={upcoming} />
      <MoodEditorialPicks />
    </>
  );
}
