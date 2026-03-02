import { Suspense } from 'react';
import { CatalogContent } from '@/components/anime/catalog/CatalogContent';
import { getKodikAvailability } from '@/services/kodik';
import { getAnimesGQL } from '@/services/shikimori';

export default async function CatalogPage() {
    // Use GraphQL for reliable poster URLs (same method as home page)
    // No status filter — show everything including announcements
    let rawAnimes = await getAnimesGQL({
        limit: 20,
        order: 'popularity'
    });

    // Check Kodik availability (for filtering playable content only)
    const shikimoriIds = rawAnimes.map((a: any) => a.id);
    const kodikInfo = await getKodikAvailability(shikimoriIds);

    // Filter: show Kodik-available items + all announcements (anons don't have Kodik yet)
    rawAnimes = rawAnimes.filter((a: any) => {
        const info = kodikInfo.get(String(a.id));
        return (info && info.available) || a.status === 'anons';
    });

    // Map to expected format
    // Poster priority: GraphQL posterUrl (same source as home page)
    const projects = rawAnimes.map((a: any) => {
        const posterUrl = a.posterUrl || '';

        return {
            id: String(a.id),
            slug: a.name || String(a.id),
            title: a.russian || a.name,
            description: a.description || "",
            banner: posterUrl,
            image: posterUrl,
            posterPosition: "center",
            studio_rating: parseFloat(a.score) || 0,
            type: a.kind === 'tv' ? 'TV Series' : a.kind === 'movie' ? 'Movie' : a.kind === 'ova' ? 'OVA' : 'Special',
            status: a.status === 'released' ? 'Completed' : a.status === 'ongoing' ? 'Ongoing' : 'Announced',
            genres: [],
            year: a.aired_on ? parseInt(a.aired_on.split('-')[0]) : 2024,
            totalEpisodes: a.episodes || 12,
            episodes: Array.from({ length: a.episodes_aired || a.episodes || 1 }, (_, i) => ({ number: i + 1 })),
            views: Math.floor(Math.random() * 50000) + 10000
        };
    });

    return (
        <Suspense fallback={<div className="min-h-screen bg-bg-cream pt-24 text-center font-editorial text-2xl uppercase tracking-widest text-bg-dark">Loading catalog...</div>}>
            <CatalogContent initialProjects={projects} />
        </Suspense>
    );
}
