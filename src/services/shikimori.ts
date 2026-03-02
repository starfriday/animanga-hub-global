/**
 * Shikimori API Client
 * Documentation: https://shikimori.one/api/doc
 */

const SHIKIMORI_BASE_URL = 'https://shikimori.one/api';

// Add delay for rate limiting if necessary (Shikimori recommends 5rps max, 90bpm limit user)
const headers = {
    'User-Agent': 'AniVaultApp/1.0',
    'Content-Type': 'application/json'
};

/**
 * Searches for animes by name or other parameters
 */
export async function searchAnimes(query: string, limit: number = 20) {
    const url = new URL(`${SHIKIMORI_BASE_URL}/animes`);
    url.searchParams.append('search', query);
    url.searchParams.append('limit', String(limit));

    try {
        const response = await fetch(url.toString(), { headers, next: { revalidate: 3600 } });
        if (!response.ok) throw new Error(`Shikimori search error: ${response.status}`);
        return await response.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

/**
 * Gets detailed information about a specific anime
 */
export async function getAnimeDetails(id: string | number) {
    try {
        const response = await fetch(`${SHIKIMORI_BASE_URL}/animes/${id}`, {
            headers,
            next: { revalidate: 86400 } // Cache for 24 hours
        });
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`Shikimori details error: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.error(e);
        return null;
    }
}

/**
 * Fetch genres (including themes) via GraphQL API.
 * The REST v1 API only returns old-style genres, but GraphQL includes themes (kind: "theme").
 */
export async function getAnimeGenresGraphQL(id: string | number): Promise<any[]> {
    try {
        const response = await fetch('https://shikimori.one/api/graphql', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                query: `{ animes(ids: "${id}", limit: 1) { genres { id name russian kind } } }`
            }),
            next: { revalidate: 86400 }
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data?.data?.animes?.[0]?.genres || [];
    } catch (e) {
        console.error('GraphQL genres fetch failed:', e);
        return [];
    }
}

/**
 * Get roles/characters for a specific anime
 */
export async function getAnimeRoles(id: string | number) {
    try {
        const response = await fetch(`${SHIKIMORI_BASE_URL}/animes/${id}/roles`, {
            headers,
            next: { revalidate: 86400 }
        });
        if (!response.ok) throw new Error(`Shikimori roles error: ${response.status}`);
        return await response.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

/**
 * Get related titles
 */
export async function getAnimeSimilar(id: string | number) {
    try {
        const response = await fetch(`${SHIKIMORI_BASE_URL}/animes/${id}/similar`, {
            headers,
            next: { revalidate: 86400 }
        });
        if (!response.ok) throw new Error(`Shikimori similar error: ${response.status}`);
        return await response.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

/**
 * Get franchise/related titles
 */
export async function getAnimeRelated(id: string | number) {
    try {
        const response = await fetch(`${SHIKIMORI_BASE_URL}/animes/${id}/related`, {
            headers,
            next: { revalidate: 86400 }
        });
        if (!response.ok) throw new Error(`Shikimori related error: ${response.status}`);
        return await response.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

/**
 * Get trending animes (sorted by popularity) via GraphQL for reliable poster URLs
 */
export async function getTrendingAnimes(limit: number = 20) {
    try {
        const query = `{
            animes(limit: ${limit}, order: popularity, status: "ongoing,released") {
                id
                name
                russian
                score
                status
                kind
                episodes
                airedOn { date }
                poster { originalUrl mainUrl }
            }
        }`;

        const response = await fetch('https://shikimori.one/api/graphql', {
            method: 'POST',
            headers,
            body: JSON.stringify({ query }),
            next: { revalidate: 3600 }
        });

        if (!response.ok) throw new Error(`Shikimori GQL trending error: ${response.status}`);
        const data = await response.json();
        const animes = data?.data?.animes || [];

        // Map to REST-compatible format for backward compat
        return animes.map((a: any) => ({
            id: a.id,
            name: a.name,
            russian: a.russian,
            score: a.score,
            status: a.status,
            kind: a.kind,
            episodes: a.episodes,
            aired_on: a.airedOn?.date,
            image: {
                original: a.poster?.originalUrl || a.poster?.mainUrl || '',
                preview: a.poster?.mainUrl || a.poster?.originalUrl || ''
            },
            // Direct poster URL for convenience
            posterUrl: a.poster?.originalUrl || a.poster?.mainUrl || ''
        }));
    } catch (e) {
        console.error('GQL trending failed, falling back to REST:', e);
        // Fallback to REST API
        const url = new URL(`${SHIKIMORI_BASE_URL}/animes`);
        url.searchParams.append('limit', String(limit));
        url.searchParams.append('order', 'popularity');
        url.searchParams.append('status', 'ongoing,released');
        try {
            const response = await fetch(url.toString(), { headers, next: { revalidate: 3600 } });
            if (!response.ok) return [];
            return await response.json();
        } catch { return []; }
    }
}

/**
 * Get upcoming animes (status anons) via GraphQL for reliable poster URLs
 */
export async function getUpcomingAnimes(limit: number = 20) {
    try {
        const query = `{
            animes(limit: ${limit}, order: popularity, status: "anons") {
                id
                name
                russian
                score
                status
                kind
                episodes
                episodesAired
                airedOn { date }
                poster { originalUrl mainUrl }
            }
        }`;

        const response = await fetch('https://shikimori.one/api/graphql', {
            method: 'POST',
            headers,
            body: JSON.stringify({ query }),
            next: { revalidate: 3600 }
        });

        if (!response.ok) throw new Error(`Shikimori GQL upcoming error: ${response.status}`);
        const data = await response.json();
        const animes = data?.data?.animes || [];

        return animes.map((a: any) => ({
            id: a.id,
            name: a.name,
            russian: a.russian,
            score: a.score,
            status: a.status,
            kind: a.kind,
            episodes: a.episodes,
            episodes_aired: a.episodesAired,
            aired_on: a.airedOn?.date,
            image: {
                original: a.poster?.originalUrl || a.poster?.mainUrl || '',
                preview: a.poster?.mainUrl || a.poster?.originalUrl || ''
            },
            posterUrl: a.poster?.originalUrl || a.poster?.mainUrl || ''
        }));
    } catch (e) {
        console.error('GQL upcoming failed, falling back to REST:', e);
        const url = new URL(`${SHIKIMORI_BASE_URL}/animes`);
        url.searchParams.append('limit', String(limit));
        url.searchParams.append('order', 'popularity');
        url.searchParams.append('status', 'anons');
        try {
            const response = await fetch(url.toString(), { headers, next: { revalidate: 3600 } });
            if (!response.ok) return [];
            return await response.json();
        } catch { return []; }
    }
}

/**
 * Get popular movies
 */
export async function getMovies(limit: number = 20, order: string = 'popularity') {
    const url = new URL(`${SHIKIMORI_BASE_URL}/animes`);
    url.searchParams.append('limit', String(limit));
    url.searchParams.append('order', order);
    url.searchParams.append('kind', 'movie');

    try {
        const response = await fetch(url.toString(), {
            headers,
            next: { revalidate: 3600 }
        });
        if (!response.ok) throw new Error(`Shikimori movies error: ${response.status}`);
        return await response.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

/**
 * Universal GraphQL anime list with reliable poster URLs.
 * Use this for catalog, search, etc. — same method as the home page.
 */
export async function getAnimesGQL(params: {
    limit?: number;
    page?: number;
    order?: string;
    status?: string;
    kind?: string;
    search?: string;
    genre?: string;
    ids?: string;
    season?: string;
} = {}): Promise<any[]> {
    const { limit = 20, page = 1, order = 'popularity', status, kind, search, genre, ids, season } = params;

    const args: string[] = [];
    args.push(`limit: ${limit}`);
    args.push(`page: ${page}`);
    args.push(`order: ${order}`);
    if (status) args.push(`status: "${status}"`);
    if (kind) args.push(`kind: "${kind}"`);
    if (search) args.push(`search: "${search.replace(/"/g, '\\"')}"`);
    if (ids) args.push(`ids: "${ids}"`);
    if (season) args.push(`season: "${season}"`);
    if (genre) {
        const parts = genre.split(',');
        const included = parts.filter(p => !p.startsWith('!')).join(',');
        const excluded = parts.filter(p => p.startsWith('!')).map(p => p.slice(1)).join(',');
        if (included) args.push(`genre: "${included}"`);
        if (excluded) args.push(`excludeGenre: "${excluded}"`);
    }

    const query = `{
        animes(${args.join(', ')}) {
            id
            name
            russian
            score
            status
            kind
            episodes
            episodesAired
            airedOn { date }
            poster { originalUrl mainUrl }
            description
        }
    }`;

    try {
        const response = await fetch('https://shikimori.one/api/graphql', {
            method: 'POST',
            headers,
            body: JSON.stringify({ query }),
            next: { revalidate: 3600 }
        });

        if (!response.ok) throw new Error(`GQL animes error: ${response.status}`);
        const data = await response.json();
        const animes = data?.data?.animes || [];

        return animes.map((a: any) => ({
            id: parseInt(a.id),
            name: a.name,
            russian: a.russian,
            score: a.score ? String(a.score) : '0',
            status: a.status,
            kind: a.kind,
            episodes: a.episodes,
            episodes_aired: a.episodesAired,
            aired_on: a.airedOn?.date,
            description: a.description,
            image: {
                original: a.poster?.originalUrl || a.poster?.mainUrl || '',
                preview: a.poster?.mainUrl || a.poster?.originalUrl || ''
            },
            posterUrl: a.poster?.originalUrl || a.poster?.mainUrl || ''
        }));
    } catch (e) {
        console.error('getAnimesGQL failed:', e);
        return [];
    }
}

/**
 * Get single anime details with reliable poster via GraphQL.
 * Use this for the project detail page poster enrichment.
 */
export async function getAnimePosterGQL(id: string | number): Promise<string> {
    try {
        const query = `{
            animes(ids: "${id}", limit: 1) {
                poster { originalUrl mainUrl }
            }
        }`;

        const response = await fetch('https://shikimori.one/api/graphql', {
            method: 'POST',
            headers,
            body: JSON.stringify({ query }),
            next: { revalidate: 86400 }
        });

        if (!response.ok) return '';
        const data = await response.json();
        const anime = data?.data?.animes?.[0];
        return anime?.poster?.originalUrl || anime?.poster?.mainUrl || '';
    } catch (e) {
        console.error('getAnimePosterGQL failed:', e);
        return '';
    }
}

