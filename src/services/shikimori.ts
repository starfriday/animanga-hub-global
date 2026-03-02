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
 * Get trending animes (sorted by popularity)
 */
export async function getTrendingAnimes(limit: number = 20) {
    const url = new URL(`${SHIKIMORI_BASE_URL}/animes`);
    url.searchParams.append('limit', String(limit));
    url.searchParams.append('order', 'popularity');
    url.searchParams.append('status', 'ongoing,released'); // Focus on released or currently airing

    try {
        const response = await fetch(url.toString(), {
            headers,
            next: { revalidate: 3600 }
        });
        if (!response.ok) throw new Error(`Shikimori trending error: ${response.status}`);
        return await response.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

/**
 * Get upcoming animes (status anons)
 */
export async function getUpcomingAnimes(limit: number = 20) {
    const url = new URL(`${SHIKIMORI_BASE_URL}/animes`);
    url.searchParams.append('limit', String(limit));
    url.searchParams.append('order', 'popularity');
    url.searchParams.append('status', 'anons');

    try {
        const response = await fetch(url.toString(), {
            headers,
            next: { revalidate: 3600 }
        });
        if (!response.ok) throw new Error(`Shikimori upcoming error: ${response.status}`);
        return await response.json();
    } catch (e) {
        console.error(e);
        return [];
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
