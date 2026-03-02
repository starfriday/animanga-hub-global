import React from 'react';
import { getMovies } from '@/services/shikimori';
import { WorldHero } from '@/components/world/WorldHero';
import { CinematicRadar } from '@/components/world/CinematicRadar';
import { ArchiveGrid } from '@/components/world/ArchiveGrid';

export default async function CinemaPage() {
    // Fetch data for the WORLD page
    // 1. A random highly popular movie for the hero OR just the #1
    const topMovies = await getMovies(1, 'popularity');
    const heroMovie = topMovies?.[0] || null;

    // 2. High rated movies for the radar
    const radarMovies = await getMovies(10, 'ranked');

    // 3. A larger set of movies for the archive grid
    const archiveMovies = await getMovies(24, 'popularity');

    return (
        <main className="min-h-screen bg-bg-cream text-bg-dark pt-[60px] lg:pt-[72px] relative overflow-hidden">
            {/* Global grid background for the whole page */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-5 MixBlendMultiply">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs><pattern id="gridbg-world" width="32" height="32" patternUnits="userSpaceOnUse"><rect width="32" height="32" fill="none" stroke="var(--color-bg-dark)" strokeWidth="0.5" /></pattern></defs>
                    <rect width="100%" height="100%" fill="url(#gridbg-world)" />
                </svg>
            </div>

            <div className="relative z-10">
                {/* 1. HERO SECTION (Magazine Cover) */}
                {heroMovie && <WorldHero movie={heroMovie} />}

                {/* 2. CINEMATIC RADAR (Horizontal Scroll / Highlights) */}
                <CinematicRadar movies={radarMovies.filter((m: any) => m.id !== heroMovie?.id)} />

                {/* 3. THE ARCHIVE (Masonry Grid) */}
                <ArchiveGrid movies={archiveMovies} />
            </div>
        </main>
    );
}
