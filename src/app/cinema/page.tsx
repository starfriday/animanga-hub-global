/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { getMovies } from '@/services/shikimori';
import { WorldHero } from '@/components/world/WorldHero';
import { CinematicRadar } from '@/components/world/CinematicRadar';
import { ArchiveGrid } from '@/components/world/ArchiveGrid';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "КИНО_РЕЕСТР | 2026_GLOBAL_ARCHIVE",
    description: "Глобальный архив кинематографических достижений. Японская анимация высокого приоритета.",
};

export default async function CinemaPage() {
    // Fetch data for the CINEMA page
    const [topMovies, radarMovies, archiveMovies] = await Promise.all([
        getMovies(1, 'popularity'),
        getMovies(10, 'ranked'),
        getMovies(24, 'popularity')
    ]);

    const heroMovie = topMovies?.[0] || null;

    return (
        <main className="min-h-screen bg-bg-dark text-white pt-[60px] lg:pt-[72px] relative overflow-hidden selection:bg-accent selection:text-white">
            <div className="relative z-10 flex flex-col">
                {/* 1. HERO SECTION */}
                {heroMovie && <WorldHero movie={heroMovie} />}

                {/* 2. CINEMATIC TRENDS (Carousel) */}
                <CinematicRadar movies={radarMovies.filter((m: any) => m.id !== heroMovie?.id)} />

                {/* 3. THE ARCHIVE (Grid) */}
                <ArchiveGrid movies={archiveMovies} />
            </div>
        </main>
    );
}
