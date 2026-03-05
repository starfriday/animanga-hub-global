import { Suspense } from 'react';
import { CatalogContent } from '@/components/anime/catalog/CatalogContent';
import { prisma } from '@/lib/db';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Каталог аниме | AniVault — Поиск и фильтрация",
    description: "Полный каталог аниме с фильтрацией по жанрам, годам, типу и рейтингу. Более 20,000 тайтлов с описаниями и оценками.",
    openGraph: {
        title: "Каталог аниме — AniVault",
        description: "Откройте для себя тысячи аниме. Фильтры по жанрам, рейтингу и статусу.",
    },
};

export default async function CatalogPage() {
    let projects: any[] = [];

    try {
        // Fetch initial data from local DB — instant, no external API calls
        const rawResults = await prisma.animeCache.findMany({
            take: 20,
            orderBy: { popularity: 'desc' }
        });

        projects = rawResults.map((record: any) => {
            try {
                const data = JSON.parse(record.data || '{}');
                const posterUrl = record.posterUrl || '';

                const kind = record.kind || data.kind;
                const status = record.status || data.status;
                const score = record.score || parseFloat(data.score) || 0;
                const episodes = record.episodes || data.episodes || 0;
                const episodesAired = record.episodesAired || data.episodes_aired || data.episodesAired || 0;

                let year = null;
                if (record.airedOn) {
                    year = record.airedOn.getFullYear();
                } else if (data.aired_on) {
                    const d = new Date(data.aired_on);
                    if (!isNaN(d.getTime())) year = d.getFullYear();
                } else if (data.airedOn?.date) {
                    const d = new Date(data.airedOn.date);
                    if (!isNaN(d.getTime())) year = d.getFullYear();
                }

                return {
                    id: String(record.shikimoriId),
                    slug: record.name || data.name || String(record.shikimoriId),
                    title: record.russian || data.russian || record.name || data.name,
                    description: data.description || "",
                    banner: posterUrl,
                    image: posterUrl,
                    posterPosition: "center",
                    studio_rating: score,
                    type: kind === 'tv' ? 'TV Series' : kind === 'movie' ? 'Movie' : kind === 'ova' ? 'OVA' : 'Special',
                    status: status === 'released' ? 'Completed' : status === 'ongoing' ? 'Ongoing' : 'Announced',
                    year,
                    totalEpisodes: episodes,
                    episodes: Array.from({ length: episodesAired || episodes || 1 }, (_, i) => ({ number: i + 1 })),
                    views: 0
                };
            } catch {
                return null;
            }
        }).filter(Boolean);
    } catch (e) {
        console.error("Catalog SSR error:", e);
    }

    return (
        <Suspense fallback={<div className="min-h-screen bg-bg-cream pt-24 text-center font-editorial text-2xl uppercase tracking-widest text-bg-dark">Loading catalog...</div>}>
            <CatalogContent initialProjects={projects} />
        </Suspense>
    );
}
