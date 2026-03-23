/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Kodik API Client
 * Documentation: https://kodik.info/api
 */

// Kodik API token — from env or fallback for development
const KODIK_TOKEN = process.env.KODIK_API_TOKEN || '1a181b998ddb87ae564c7c31afca5df4';
const KODIK_BASE_URL = 'https://kodik-api.com';

export interface KodikResult {
    id: string;
    title: string;
    title_orig: string;
    other_title: string;
    link: string; // iframe url
    folder: string;
    type: string;
    year: number;
    kinopoisk_id: string;
    shikimori_id: string;
    imdb_id: string;
    mdl_id: string;
    translation: {
        id: number;
        title: string;
        type: string;
    };
    episodes_count: number;
    last_season: number;
    last_episode: number;
    material_data?: any;
    seasons?: Record<string, any>;
}

export interface KodikResponse {
    time: string;
    total: number;
    results: KodikResult[];
}

/**
 * Generic search request to Kodik API
 */
export async function searchKodik(params: Record<string, string>): Promise<KodikResponse | null> {
    const url = new URL(`${KODIK_BASE_URL}/search`);
    url.searchParams.append('token', KODIK_TOKEN);
    url.searchParams.append('with_material_data', 'true'); // get poster and extra info if available
    url.searchParams.append('with_seasons', 'true');      // get episodes json

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });

    try {
        const res = await fetch(url.toString(), {
            // Kodik data can change (new episodes), cache 15-30 mins
            next: { revalidate: 1800 }
        });

        if (!res.ok) throw new Error(`Kodik API Error: ${res.status}`);
        return await res.json();
    } catch (e) {
        console.error(e);
        return null; // Return null on failure so App can handle gracefully
    }
}

/**
 * Find video translations by Shikimori ID
 */
export async function getVideosByShikimoriId(shikimoriId: string | number) {
    const response = await searchKodik({ shikimori_id: String(shikimoriId) });
    return response?.results || [];
}

/**
 * Filter results to unique translations or best matching
 * and group by translation type.
 */
export function groupKodikTranslations(results: KodikResult[]) {
    // Return unique translations and their iframe links
    return results.map(r => ({
        translationId: r.translation.id,
        translationTitle: r.translation.title,
        translationType: r.translation.type, // 'voice', 'subtitles'
        quality: r.material_data?.anime_quality || 'Unknown',
        playerUrl: r.link,
        episodesCount: r.episodes_count,
        seasons: r.seasons
    })).sort((a, b) => a.translationTitle.localeCompare(b.translationTitle));
}

/**
 * Quick fetch for material data (poster) by Shikimori ID
 * Returns a map of shikimori_id -> poster_url
 */
export async function getPostersByShikimoriIds(shikimoriIds: (string | number)[]): Promise<Map<string, string>> {
    const posterMap = new Map<string, string>();
    if (!shikimoriIds || shikimoriIds.length === 0) return posterMap;

    // We can't batch perfectly with `search`, but we can try to use `/list` with `shikimori_id` if supported
    // But since Kodik /search doesn't perfectly support comma-separated shikimori_id, we will do concurrent fetches but controlled
    // Actually, according to Kodik docs, `shikimori_id` can be comma separated in `/search`

    try {
        const url = new URL(`${KODIK_BASE_URL}/search`);
        url.searchParams.append('token', KODIK_TOKEN);
        url.searchParams.append('shikimori_id', shikimoriIds.join(','));
        url.searchParams.append('with_material_data', 'true');

        const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
        if (res.ok) {
            const data = await res.json();
            if (data.results) {
                // Group by shikimori_id
                data.results.forEach((r: KodikResult) => {
                    if (r.shikimori_id && r.material_data?.poster_url && !posterMap.has(r.shikimori_id)) {
                        posterMap.set(r.shikimori_id, r.material_data.poster_url);
                    }
                });
            }
        }
    } catch (e) {
        console.error("Batch poster fetch failed:", e);
    }

    return posterMap;
}

/**
 * Check availability of multiple anime on Kodik and collect poster URLs.
 * Kodik /search does NOT support comma-separated shikimori_id,
 * so we do parallel individual lookups with concurrency control.
 * 
 * Returns a Map of shikimori_id -> { available: boolean, posterUrl?: string }
 */
export interface KodikAvailabilityInfo {
    available: boolean;
    posterUrl?: string;
}

export async function getKodikAvailability(shikimoriIds: (string | number)[]): Promise<Map<string, KodikAvailabilityInfo>> {
    const infoMap = new Map<string, KodikAvailabilityInfo>();
    if (!shikimoriIds || shikimoriIds.length === 0) return infoMap;

    // Process in parallel batches of 5 to avoid rate limiting
    const BATCH_SIZE = 5;
    for (let i = 0; i < shikimoriIds.length; i += BATCH_SIZE) {
        const batch = shikimoriIds.slice(i, i + BATCH_SIZE);
        const promises = batch.map(async (id) => {
            try {
                const url = new URL(`${KODIK_BASE_URL}/search`);
                url.searchParams.append('token', KODIK_TOKEN);
                url.searchParams.append('shikimori_id', String(id));
                url.searchParams.append('with_material_data', 'true');

                const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
                if (res.ok) {
                    const data = await res.json();
                    if (data.results && data.results.length > 0) {
                        // Try to find the best poster from ALL results
                        let posterUrl: string | undefined;
                        for (const r of data.results) {
                            // Check multiple possible poster fields in Kodik material_data
                            const md = r.material_data;
                            if (md?.poster_url) { posterUrl = md.poster_url; break; }
                            if (md?.anime_poster_url) { posterUrl = md.anime_poster_url; break; }
                            if (md?.screenshots?.length > 0) { posterUrl = md.screenshots[0]; break; }
                        }
                        infoMap.set(String(id), { available: true, posterUrl });
                    } else {
                        infoMap.set(String(id), { available: false });
                    }
                }
            } catch (e) {
                // Silently skip failed lookups — item won't be marked available
                infoMap.set(String(id), { available: false });
            }
        });
        await Promise.all(promises);
    }

    return infoMap;
}

/**
 * Single fetch for backward compatibility
 */
export async function getPosterByShikimoriId(shikimoriId: string | number): Promise<string | null> {
    const map = await getPostersByShikimoriIds([shikimoriId]);
    return map.get(String(shikimoriId)) || null;
}
