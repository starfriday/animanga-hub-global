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
    // Fetch data for the WORLD page
    const [topMovies, radarMovies, archiveMovies] = await Promise.all([
        getMovies(1, 'popularity'),
        getMovies(10, 'ranked'),
        getMovies(24, 'popularity')
    ]);

    const heroMovie = topMovies?.[0] || null;

    return (
        <main className="min-h-screen bg-bg-cream text-bg-dark pt-[60px] lg:pt-[72px] relative overflow-hidden selection:bg-accent selection:text-white">
            {/* High-Fidelity Tactical Grid Background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="relative z-10 flex flex-col">
                {/* Visual Load Bar */}
                <div className="h-1 w-full bg-bg-dark/5 overflow-hidden">
                    <div className="h-full bg-accent w-[40%] animate-pulse" />
                </div>

                {/* 1. HERO SECTION (Global Focal) */}
                {heroMovie && <WorldHero movie={heroMovie} />}

                {/* 2. CINEMATIC RADAR (Signal Scan Rail) */}
                <CinematicRadar movies={radarMovies.filter((m: any) => m.id !== heroMovie?.id)} />

                {/* 3. THE ARCHIVE (Database Registry) */}
                <ArchiveGrid movies={archiveMovies} />
            </div>
        </main>
    );
}
