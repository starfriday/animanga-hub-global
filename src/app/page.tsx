import { HeroSlider } from "@/components/home/HeroSlider";
import { MarqueeStrip } from "@/components/home/MarqueeStrip";
import { TrendsScroll } from "@/components/home/TrendsScroll";
import { PulseGrid } from "@/components/home/PulseGrid";
import { CommunitySpotlight } from "@/components/home/CommunitySpotlight";
import { MoodSelector } from "@/components/home/MoodSelector";
import { SectionDivider } from "@/components/home/SectionDivider";
import { getTrendingAnimes, getUpcomingAnimes } from "@/services/shikimori";

export default async function Home() {
  let trending: any[] = [];
  let upcoming: any[] = [];

  try {
    [trending, upcoming] = await Promise.all([
      getTrendingAnimes(10),
      getUpcomingAnimes(14)
    ]);
  } catch (e) {
    console.error('Home page SSR fetch error:', e);
  }

  return (
    <>
      <HeroSlider trending={trending} />
      {/* Marquee is inside PulseGrid now, but we'll add one below TrendsScroll */}
      <TrendsScroll popular={trending} />
      <SectionDivider variant="marquee" />
      <PulseGrid upcoming={upcoming} />
      <SectionDivider variant="strip" />
      <CommunitySpotlight />
      <SectionDivider variant="strip" />
      <MoodSelector />
    </>
  );
}
