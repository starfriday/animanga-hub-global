import { NextResponse } from 'next/server';
import { getKodikAvailability } from '@/services/kodik';
import { getAnimesGQL } from '@/services/shikimori';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    const search = searchParams.get('search') || '';
    const order = searchParams.get('order') || 'popularity';
    const status = searchParams.get('status') || '';
    const kind = searchParams.get('kind') || '';
    const genre = searchParams.get('genre') || '';
    const season = searchParams.get('season') || '';
    const includeAnons = searchParams.get('anons') === 'true';

    let queryLimit = parseInt(limit);
    if (queryLimit > 50) queryLimit = 50;

    try {
        // Use GraphQL for reliable poster URLs (same method as home page)
        const gqlStatus = status || (!includeAnons ? 'ongoing,released' : '');

        let rawAnimes = await getAnimesGQL({
            limit: queryLimit,
            page: parseInt(page),
            order,
            status: gqlStatus || undefined,
            kind: kind || undefined,
            search: search || undefined,
            genre: genre || undefined,
            season: season || undefined
        });

        // If GraphQL returned nothing, return empty gracefully
        if (rawAnimes.length === 0) {
            return NextResponse.json({
                data: [],
                page: parseInt(page),
                hasMore: false
            });
        }

        // Check Kodik availability + get posters in one pass
        const shikimoriIds = rawAnimes.map(a => a.id);
        const kodikInfo = await getKodikAvailability(shikimoriIds);

        // Filter: only show items available on Kodik (or anons if they were requested)
        rawAnimes = rawAnimes.filter(a => {
            const info = kodikInfo.get(String(a.id));
            return (info && info.available) || a.status === 'anons';
        });

        // Map and enrich — use GraphQL posterUrl (same source as home page)
        const projects = rawAnimes.map(a => {
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
                year: a.aired_on ? parseInt(a.aired_on.split('-')[0]) : null,
                totalEpisodes: a.episodes || 0,
                episodes: Array.from({ length: a.episodes_aired || a.episodes || 1 }, (_, i) => ({ number: i + 1 })),
                views: Math.floor(Math.random() * 50000) + 10000
            };
        });

        return NextResponse.json({
            data: projects,
            page: parseInt(page),
            hasMore: rawAnimes.length === queryLimit
        });

    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: "Failed to fetch animes" }, { status: 500 });
    }
}
