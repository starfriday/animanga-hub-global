import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Genre ID → Name mapping (same as GENRES_LIST + THEMES_LIST in constants.ts)
const GENRE_ID_TO_NAME: Record<string, string> = {
    '1': 'Action', '2': 'Adventure', '3': 'Racing', '4': 'Comedy', '5': 'Dementia',
    '6': 'Mythology', '7': 'Mystery', '8': 'Drama', '9': 'Ecchi', '10': 'Fantasy',
    '11': 'Strategy Game', '12': 'Hentai', '13': 'Historical', '14': 'Horror',
    '15': 'Kids', '16': 'Magic', '17': 'Martial Arts', '18': 'Mecha', '19': 'Music',
    '20': 'Parody', '21': 'Samurai', '22': 'Romance', '23': 'School', '24': 'Sci-Fi',
    '25': 'Shoujo', '26': 'Shoujo Ai', '27': 'Shounen', '28': 'Shounen Ai',
    '29': 'Space', '30': 'Sports', '31': 'Super Power', '32': 'Vampire',
    '33': 'Yaoi', '34': 'Yuri', '35': 'Harem', '36': 'Slice of Life',
    '37': 'Supernatural', '38': 'Military', '39': 'Detective', '40': 'Psychological',
    '41': 'Thriller', '42': 'Seinen', '43': 'Josei',
    '102': 'Team Sports', '103': 'Video Game', '104': 'Adult Cast', '105': 'Gore',
    '106': 'Reincarnation', '107': 'Love Polygon', '108': 'Visual Arts',
    '111': 'Time Travel', '112': 'Gag Humor', '114': 'Award Winning',
    '118': 'Combat Sports', '119': 'CGDCT', '124': 'Mahou Shoujo',
    '125': 'Reverse Harem', '130': 'Isekai', '131': 'Delinquents',
    '134': 'Childcare', '135': 'Magical Sex Shift', '136': 'Showbiz',
    '137': 'Otaku Culture', '138': 'Organized Crime', '139': 'Workplace',
    '140': 'Iyashikei', '141': 'Survival', '142': 'Performing Arts',
    '143': 'Anthropomorphic', '144': 'Crossdressing', '145': 'Idols (Female)',
    '146': 'High Stakes Game', '147': 'Medical', '148': 'Pets',
    '149': 'Educational', '150': 'Idols (Male)', '151': 'Love Status Quo',
    '197': 'Urban Fantasy', '198': 'Villainess',
};

// Display kind → DB kind mapping
const KIND_MAP: Record<string, string> = {
    'TV Series': 'tv', 'Movie': 'movie', 'OVA': 'ova', 'ONA': 'ona', 'Special': 'special',
    'tv': 'tv', 'movie': 'movie', 'ova': 'ova', 'ona': 'ona', 'special': 'special',
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, Math.min(parseInt(searchParams.get('limit') || '20'), 50));
    const search = searchParams.get('search') || '';
    const order = searchParams.get('order') || 'popularity';
    const statusFilter = searchParams.get('status') || '';
    const kindFilter = searchParams.get('kind') || '';
    const genreFilter = searchParams.get('genre') || '';
    const seasonFilter = searchParams.get('season') || '';
    const idsFilter = searchParams.get('ids') || '';
    const minScore = parseFloat(searchParams.get('minScore') || '0');
    const minEpisodes = parseInt(searchParams.get('minEpisodes') || '0');
    const maxEpisodes = parseInt(searchParams.get('maxEpisodes') || '0');

    try {
        // Build Prisma WHERE — now using native SQL with indexed columns
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { russian: { contains: search } },
                { synonyms: { contains: search } }
            ];
        }

        if (statusFilter) {
            where.status = { in: statusFilter.split(',') };
        }

        if (kindFilter) {
            const kinds = kindFilter.split(',').map(k => KIND_MAP[k] || k.toLowerCase());
            where.kind = { in: kinds };
        }

        if (idsFilter) {
            const idArray = idsFilter.split(',').filter(id => !isNaN(parseInt(id))).map(id => parseInt(id));
            if (idArray.length > 0) where.shikimoriId = { in: idArray };
        }

        if (seasonFilter) {
            if (seasonFilter.includes('_')) {
                const [minStr, maxStr] = seasonFilter.split('_');
                const min = parseInt(minStr);
                const max = parseInt(maxStr);
                if (!isNaN(min) && !isNaN(max)) {
                    where.airedOn = {
                        gte: new Date(`${min}-01-01`),
                        lte: new Date(`${max}-12-31`)
                    };
                }
            } else {
                where.season = { contains: seasonFilter };
            }
        }

        if (genreFilter) {
            const genreEntries = genreFilter.split(',').filter(Boolean);
            const conditions: any[] = [];
            for (const g of genreEntries) {
                const isExcluded = g.startsWith('!');
                const genreId = isExcluded ? g.slice(1) : g;
                const genreName = GENRE_ID_TO_NAME[genreId] || genreId;
                if (isExcluded) {
                    conditions.push({ NOT: { genres: { contains: genreName } } });
                } else {
                    conditions.push({ genres: { contains: genreName } });
                }
            }
            where.AND = [...(where.AND || []), ...conditions];
        }

        // Score filter
        if (minScore > 0) {
            where.score = { gte: minScore };
        }

        // Episode count filter
        if (minEpisodes > 0 || maxEpisodes > 0) {
            where.episodes = {};
            if (minEpisodes > 0) where.episodes.gte = minEpisodes;
            if (maxEpisodes > 0) where.episodes.lte = maxEpisodes;
        }

        // Sorting — now using native Prisma with indexed columns
        let orderBy: any = { popularity: 'desc' };
        if (order === 'popularity') orderBy = { popularity: 'desc' };
        if (order === 'name') orderBy = { name: 'asc' };
        if (order === 'aired_on') orderBy = { airedOn: 'desc' };
        if (order === 'ranked') orderBy = { score: 'desc' };
        if (order === 'updated_at') orderBy = { updatedAt: 'desc' };

        // Execute count + query in parallel — full SQL with indexes
        const [totalCount, rawResults] = await Promise.all([
            prisma.animeCache.count({ where }),
            prisma.animeCache.findMany({
                where,
                take: limit,
                skip: (page - 1) * limit,
                orderBy
            })
        ]);

        if (rawResults.length === 0) {
            return NextResponse.json({ data: [], page, hasMore: false });
        }

        // Fetch view counts
        const viewCounts = await prisma.animeView.findMany({
            where: { animeId: { in: rawResults.map((a: any) => a.shikimoriId) } }
        });
        const viewMap = new Map(viewCounts.map((v: any) => [v.animeId, v.viewCount]));

        // Map records to response format
        const projects = rawResults.map((record: any) => {
            try {
                const data = JSON.parse(record.data || '{}');
                const posterUrl = record.posterUrl || '';
                const recKind = record.kind || data.kind || '';
                const recStatus = record.status || data.status || '';
                const score = record.score || parseFloat(data.score) || 0;
                const episodes = record.episodes || data.episodes || 0;
                const episodesAired = record.episodesAired || data.episodes_aired || 0;

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
                    type: recKind === 'tv' ? 'TV Series' : recKind === 'movie' ? 'Movie' : recKind === 'ova' ? 'OVA' : recKind === 'ona' ? 'ONA' : 'Special',
                    status: recStatus === 'released' ? 'Completed' : recStatus === 'ongoing' ? 'Ongoing' : 'Announced',
                    year,
                    totalEpisodes: episodes,
                    episodes: Array.from({ length: episodesAired || episodes || 1 }, (_, i) => ({ number: i + 1 })),
                    views: viewMap.get(record.shikimoriId) || 0
                };
            } catch {
                return null;
            }
        }).filter(Boolean);

        const response = NextResponse.json({
            data: projects,
            page,
            hasMore: totalCount > page * limit
        });
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
        return response;

    } catch (error: any) {
        console.error("Anime API Error:", error);
        return NextResponse.json({
            error: "Failed to fetch animes",
            message: error.message
        }, { status: 500 });
    }
}
