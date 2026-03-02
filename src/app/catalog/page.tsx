import { Suspense } from 'react';
import { CatalogContent } from '@/components/anime/catalog/CatalogContent';
import { getKodikAvailability } from '@/services/kodik';

export default async function CatalogPage() {
    // Fetch top 20 released/ongoing animes (hide anons by default)
    const url = new URL('https://shikimori.one/api/animes');
    url.searchParams.append('limit', '20');
    url.searchParams.append('order', 'popularity');
    url.searchParams.append('status', 'ongoing,released');

    let rawAnimes: any[] = [];
    try {
        const res = await fetch(url.toString(), {
            headers: { 'User-Agent': 'AniVaultApp/1.0' },
            next: { revalidate: 3600 }
        });
        if (res.ok) rawAnimes = await res.json();
    } catch (e) {
        console.error('Catalog SSR fetch error:', e);
    }

    // Check Kodik availability + get posters in one pass
    const shikimoriIds = rawAnimes.map((a: any) => a.id);
    const kodikInfo = await getKodikAvailability(shikimoriIds);

    // Filter: only show items available on Kodik
    rawAnimes = rawAnimes.filter((a: any) => {
        const info = kodikInfo.get(String(a.id));
        return info && info.available;
    });

    // For items where Kodik didn't provide a poster, fetch from Shikimori detail API
    const noPosterIds = rawAnimes
        .filter((a: any) => {
            const info = kodikInfo.get(String(a.id));
            return !info?.posterUrl;
        })
        .map((a: any) => a.id);

    const detailedPosters = new Map<string, string>();
    if (noPosterIds.length > 0) {
        const detailPromises = noPosterIds.map(async (id: number) => {
            try {
                const res = await fetch(`https://shikimori.one/api/animes/${id}`, {
                    headers: { 'User-Agent': 'AniVaultApp/1.0' },
                    next: { revalidate: 3600 }
                });
                if (res.ok) {
                    const detail = await res.json();
                    const posterUrl = detail.poster?.originalUrl
                        || detail.poster?.mainUrl
                        || detail.poster?.main2xUrl
                        || (detail.image?.original ? `https://shikimori.one${detail.image.original}` : null);
                    if (posterUrl) detailedPosters.set(String(id), posterUrl);
                }
            } catch (e) { /* skip */ }
        });
        await Promise.all(detailPromises);
    }

    // Map to expected format — use best available poster
    const projects = rawAnimes.map((a: any) => {
        const info = kodikInfo.get(String(a.id));

        let posterUrl = '';
        if (info?.posterUrl) {
            posterUrl = info.posterUrl;
        } else if (detailedPosters.has(String(a.id))) {
            posterUrl = detailedPosters.get(String(a.id))!;
        } else if (a.image?.preview) {
            posterUrl = `https://shikimori.one${a.image.preview}`;
        } else if (a.image?.original && !a.image.original.includes('missing_original')) {
            posterUrl = `https://shikimori.one${a.image.original}`;
        }

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
