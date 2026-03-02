import { NextResponse } from 'next/server';
import { getKodikAvailability } from '@/services/kodik';

interface QueryParams {
    page: string;
    limit: string;
    search: string;
    order: string;
    status: string;
    kind: string;
    genre: string;
    includeAnons: boolean;
}

function buildGraphQLQuery(params: QueryParams): string {
    const args: string[] = [];

    args.push(`limit: ${params.limit}`);
    args.push(`page: ${params.page}`);

    // Map order names
    const orderMap: Record<string, string> = {
        'popularity': 'popularity',
        'ranked': 'ranked',
        'aired_on': 'aired_on',
    };
    args.push(`order: ${orderMap[params.order] || 'popularity'}`);

    if (params.search) {
        args.push(`search: "${params.search.replace(/"/g, '\\"')}"`);
    }

    // Handle status
    if (params.status) {
        args.push(`status: "${params.status}"`);
    } else if (!params.includeAnons) {
        args.push(`status: "ongoing,released"`);
    }

    if (params.kind) {
        args.push(`kind: "${params.kind}"`);
    }

    // Genre filter — supports both old genre IDs and new theme IDs
    if (params.genre) {
        // Split included and excluded genres
        const parts = params.genre.split(',');
        const included = parts.filter(p => !p.startsWith('!')).join(',');
        const excluded = parts.filter(p => p.startsWith('!')).map(p => p.slice(1)).join(',');

        if (included) args.push(`genre: "${included}"`);
        if (excluded) args.push(`excludeGenre: "${excluded}"`);
    }

    const argsStr = args.join(', ');

    return `{
        animes(${argsStr}) {
            id
            name
            russian
            score
            status
            kind
            episodes
            episodesAired
            airedOn { date }
            poster { mainUrl originalUrl main2xUrl }
            genres { id name russian kind }
            description
        }
    }`;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    // Extract parameters
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    const search = searchParams.get('search') || '';
    const order = searchParams.get('order') || 'popularity';
    const status = searchParams.get('status') || '';
    const kind = searchParams.get('kind') || '';
    const genre = searchParams.get('genre') || '';
    const includeAnons = searchParams.get('anons') === 'true';

    // Build query for Shikimori
    let queryLimit = parseInt(limit);
    if (queryLimit > 50) queryLimit = 50;

    try {
        // Primary: Use REST API (reliable, cached)
        const url = new URL('https://shikimori.one/api/animes');
        url.searchParams.append('limit', String(queryLimit));
        url.searchParams.append('page', page);
        url.searchParams.append('order', order);

        if (search) url.searchParams.append('search', search);

        // Handle Announcements Visibility
        if (status) {
            url.searchParams.append('status', status);
        } else if (!includeAnons) {
            url.searchParams.append('status', 'ongoing,released');
        }

        if (kind) url.searchParams.append('kind', kind);
        if (genre) url.searchParams.append('genre', genre);

        let rawAnimes: any[] = [];

        // Try REST API first (wrapped in try/catch for timeout errors)
        try {
            const restResponse = await fetch(url.toString(), {
                headers: { 'User-Agent': 'AniVaultApp/1.0' },
                next: { revalidate: 3600 }
            });

            if (restResponse.ok) {
                rawAnimes = await restResponse.json();
            }
        } catch (restError) {
            console.error('REST API failed:', restError);
            // Continue to GraphQL fallback
        }

        // Fallback: If REST returned empty AND we have a genre filter, try GraphQL
        // (REST v1 doesn't support some theme IDs, but GraphQL does)
        if (rawAnimes.length === 0 && genre) {
            try {
                const graphqlQuery = buildGraphQLQuery({ page, limit: String(queryLimit), search, order, status, kind, genre, includeAnons });
                const gqlResponse = await fetch('https://shikimori.one/api/graphql', {
                    method: 'POST',
                    headers: {
                        'User-Agent': 'AniVaultApp/1.0',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query: graphqlQuery }),
                    next: { revalidate: 3600 }
                });

                if (gqlResponse.ok) {
                    const gqlData = await gqlResponse.json();
                    if (gqlData?.data?.animes?.length > 0) {
                        rawAnimes = gqlData.data.animes.map((a: any) => ({
                            ...a,
                            id: parseInt(a.id),
                            image: a.poster ? {
                                preview: a.poster.mainUrl,
                                original: a.poster.originalUrl || a.poster.mainUrl
                            } : null,
                            score: a.score ? String(a.score) : '0',
                            aired_on: a.airedOn?.date || null,
                        }));
                    }
                }
            } catch (gqlError) {
                console.error('GraphQL fallback failed:', gqlError);
                // Continue with empty results rather than crashing
            }
        }

        // If both APIs failed, return empty results gracefully
        if (rawAnimes.length === 0) {
            return NextResponse.json({
                data: [],
                page: parseInt(page),
                hasMore: false
            });
        }

        // 1. Check Kodik availability AND get posters in a single pass
        const shikimoriIds = rawAnimes.map(a => a.id);
        const kodikInfo = await getKodikAvailability(shikimoriIds);

        // Filter: only show items available on Kodik (or anons if they were requested)
        rawAnimes = rawAnimes.filter(a => {
            const info = kodikInfo.get(String(a.id));
            return (info && info.available) || a.status === 'anons';
        });

        // 2. For items where Kodik didn't provide a poster, fetch from Shikimori detail API
        const noPosterIds = rawAnimes
            .filter(a => {
                const info = kodikInfo.get(String(a.id));
                return !info?.posterUrl;
            })
            .map(a => a.id);

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
                        // The detailed endpoint has a richer poster object
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

        // 3. Map and enrich — use best available poster
        const projects = rawAnimes.map(a => {
            const info = kodikInfo.get(String(a.id));

            // Priority: Kodik poster > Shikimori detail poster > Shikimori list preview > empty
            let posterUrl = '';
            if (info?.posterUrl) {
                posterUrl = info.posterUrl;
            } else if (detailedPosters.has(String(a.id))) {
                posterUrl = detailedPosters.get(String(a.id))!;
            } else if (a.poster?.mainUrl) {
                posterUrl = a.poster.mainUrl;
            } else if (a.poster?.originalUrl) {
                posterUrl = a.poster.originalUrl;
            } else if (a.image?.preview) {
                posterUrl = a.image.preview.startsWith('http') ? a.image.preview : `https://shikimori.one${a.image.preview}`;
            } else if (a.image?.original && !a.image.original.includes('missing_original')) {
                posterUrl = a.image.original.startsWith('http') ? a.image.original : `https://shikimori.one${a.image.original}`;
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
                year: a.aired_on ? parseInt(a.aired_on.split('-')[0]) : null,
                totalEpisodes: a.episodes || 0,
                episodes: Array.from({ length: a.episodesAired || a.episodes_aired || a.episodes || 1 }, (_, i) => ({ number: i + 1 })),
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
