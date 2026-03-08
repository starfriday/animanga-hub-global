/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Shikimori API Client
 * Documentation: https://shikimori.one/api/doc
 */

import { prisma } from '@/lib/db';

const SHIKIMORI_BASE_URL = 'https://shikimori.one/api';

// Add delay for rate limiting if necessary (Shikimori recommends 5rps max, 90bpm limit user)
const headers = {
    'User-Agent': 'AniVaultApp/1.0',
    'Content-Type': 'application/json'
};


/**
 * Get trending animes (sorted by popularity) via GraphQL for reliable poster URLs
 */
export async function getTrendingAnimes(limit: number = 20) {
    try {
        // 1. Try Local DB first (Hybrid)
        const localAnimes = await prisma.animeCache.findMany({
            where: {
                status: { in: ['ongoing', 'released'] },
                score: { gt: 0 }
            },
            orderBy: { popularity: 'desc' },
            take: limit
        });

        if (localAnimes.length >= limit) {
            return localAnimes.map((record: any) => {
                const data = JSON.parse(record.data);
                return {
                    id: String(record.shikimoriId),
                    name: record.name || data.name,
                    russian: record.russian || data.russian,
                    score: record.score || data.score,
                    status: record.status || data.status,
                    kind: record.kind || data.kind,
                    episodes: record.episodes || data.episodes,
                    aired_on: record.airedOn ? record.airedOn.toISOString() : data.aired_on,
                    image: {
                        original: record.posterUrl || data.poster?.originalUrl || '',
                        preview: record.posterUrl || data.poster?.mainUrl || ''
                    },
                    posterUrl: record.posterUrl || data.poster?.originalUrl || ''
                };
            });
        }

        // 2. Fallback to GraphQL
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

        let response;
        try {
            response = await fetch('https://shikimori.one/api/graphql', {
                method: 'POST',
                headers,
                body: JSON.stringify({ query }),
                next: { revalidate: 3600 }
            });
        } catch (error) {
            console.error('getTrendingAnimes network error (timeout/dns):', error);
            return [];
        }

        if (!response.ok) throw new Error(`Shikimori GQL trending error: ${response.status}`);
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
            aired_on: a.airedOn?.date,
            image: {
                original: a.poster?.originalUrl || a.poster?.mainUrl || '',
                preview: a.poster?.mainUrl || a.poster?.originalUrl || ''
            },
            posterUrl: a.poster?.originalUrl || a.poster?.mainUrl || ''
        }));
    } catch (e) {
        console.error('getTrendingAnimes error:', e);
        return [];
    }
}

/**
 * Get currently airing ongoing anime sorted by popularity
 */
export async function getOngoingPopular(limit: number = 5) {
    try {
        const localAnimes = await prisma.animeCache.findMany({
            where: {
                status: 'ongoing',
                score: { gt: 0 },
                popularity: { gt: 0 }
            },
            orderBy: { popularity: 'desc' },
            take: limit
        });

        if (localAnimes.length >= limit) {
            return localAnimes.map((record: any) => {
                const data = JSON.parse(record.data);
                return {
                    id: String(record.shikimoriId),
                    name: record.name || data.name,
                    russian: record.russian || data.russian,
                    score: record.score || data.score,
                    status: record.status || data.status,
                    kind: record.kind || data.kind,
                    episodes: record.episodes || data.episodes,
                    aired_on: record.airedOn ? record.airedOn.toISOString() : data.aired_on,
                    image: {
                        original: record.posterUrl || data.poster?.originalUrl || '',
                        preview: record.posterUrl || data.poster?.mainUrl || ''
                    },
                    posterUrl: record.posterUrl || data.poster?.originalUrl || ''
                };
            });
        }

        return [];
    } catch (e) {
        console.error('getOngoingPopular error:', e);
        return [];
    }
}

/**
 * Get upcoming animes (status anons) via GraphQL for reliable poster URLs
 */
export async function getUpcomingAnimes(limit: number = 20) {
    try {
        // 1. Try Local DB first (Hybrid)
        const localAnimes = await prisma.animeCache.findMany({
            where: { status: 'anons' },
            orderBy: { score: 'desc' },
            take: limit
        });

        if (localAnimes.length >= limit) {
            return localAnimes.map((record: any) => {
                const data = JSON.parse(record.data);
                return {
                    id: String(record.shikimoriId),
                    name: record.name || data.name,
                    russian: record.russian || data.russian,
                    score: record.score || data.score,
                    status: record.status || data.status,
                    kind: record.kind || data.kind,
                    episodes: record.episodes || data.episodes,
                    episodes_aired: record.episodesAired || data.episodes_aired,
                    aired_on: record.airedOn ? record.airedOn.toISOString() : data.aired_on,
                    image: {
                        original: record.posterUrl || data.poster?.originalUrl || '',
                        preview: record.posterUrl || data.poster?.mainUrl || ''
                    },
                    posterUrl: record.posterUrl || data.poster?.originalUrl || ''
                };
            });
        }

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

        let response;
        try {
            response = await fetch('https://shikimori.one/api/graphql', {
                method: 'POST',
                headers,
                body: JSON.stringify({ query }),
                next: { revalidate: 3600 }
            });
        } catch (error) {
            console.error('getUpcomingAnimes network error:', error);
            return [];
        }

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
        console.error('getUpcomingAnimes error:', e);
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


/**
 * Get ALL details for a single anime using the massive GraphQL query.
 * Replaces multiple REST calls (details, roles, related, genres).
 */
export async function getFullAnimeDetailsGQL(id: string | number) {
    try {
        const query = `{
            animes(ids: "${id}", limit: 1) {
                id
                malId
                name
                russian
                licenseNameRu
                english
                japanese
                synonyms
                kind
                score
                status
                episodes
                episodesAired
                duration
                airedOn { year month day date }
                releasedOn { year month day date }
                url
                season

                poster { id originalUrl mainUrl }

                fansubbers
                fandubbers
                licensors
                createdAt
                updatedAt
                nextEpisodeAt
                isCensored

                genres { id name russian kind }
                studios { id name imageUrl }

                externalLinks { id kind url }

                personRoles {
                    id
                    rolesRu
                    rolesEn
                    person { id name russian poster { originalUrl mainUrl } }
                }
                characterRoles {
                    id
                    rolesRu
                    rolesEn
                    character { id name russian poster { originalUrl mainUrl } }
                }

                related {
                    id
                    anime {
                        id
                        name
                        russian
                        kind
                        score
                        status
                        episodes
                        episodesAired
                        airedOn { date }
                        releasedOn { date }
                        poster { originalUrl mainUrl }
                        url
                    }
                    manga { id name russian }
                    relationKind
                    relationText
                }

                videos { id url name kind playerUrl imageUrl }
                screenshots { id originalUrl x166Url x332Url }

                scoresStats { score count }
                statusesStats { status count }

                description
                descriptionHtml
                descriptionSource
            }
        }`;

        let response;
        try {
            response = await fetch('https://shikimori.one/api/graphql', {
                method: 'POST',
                headers,
                body: JSON.stringify({ query }),
                next: { revalidate: 86400 } // Cache for 24 hours
            });
        } catch (error) {
            console.error('getFullAnimeDetailsGQL network timeout:', error);
            return null;
        }

        if (!response.ok) return null;
        const data = await response.json();

        const anime = data?.data?.animes?.[0];
        if (!anime) return null;

        // Map to standard format to avoid breaking too many things
        return {
            ...anime,
            score: anime.score ? String(anime.score) : '0',
            episodes_aired: anime.episodesAired,
            aired_on: anime.airedOn?.date,
            released_on: anime.releasedOn?.date,
            next_episode_at: anime.nextEpisodeAt,
            image: {
                original: anime.poster?.originalUrl || anime.poster?.mainUrl || '',
                preview: anime.poster?.mainUrl || anime.poster?.originalUrl || ''
            },
            posterUrl: anime.poster?.originalUrl || anime.poster?.mainUrl || ''
        };
    } catch (e) {
        console.error('getFullAnimeDetailsGQL failed:', e);
        return null;
    }
}
