/**
 * Resolves an anime image URL from various API sources.
 * Handles:
 *   - Full URLs (GraphQL poster.originalUrl) — returned as-is
 *   - Relative paths (REST image.original like "/system/animes/...") — prefixed with shikimori.one
 *   - Empty/null — returns empty string
 * 
 * Priority: posterUrl > image.original > image.preview > ''
 */
export function resolveAnimeImage(anime: any): string {
    // Priority 1: Direct posterUrl from GraphQL or Kodik
    if (anime?.posterUrl) {
        return ensureFullUrl(anime.posterUrl);
    }

    // Priority 2: image.original (REST API or mapped from GraphQL)
    if (anime?.image?.original) {
        return ensureFullUrl(anime.image.original);
    }

    // Priority 3: image.preview (smaller but better than nothing)
    if (anime?.image?.preview) {
        return ensureFullUrl(anime.image.preview);
    }

    return '';
}

/**
 * Ensures a URL is fully qualified.
 * If it starts with http, returns as-is.
 * If it's a relative path, prepends shikimori.one domain.
 */
export function ensureFullUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://shikimori.one${url}`;
}

/**
 * Placeholder image URL for when no poster is available.
 * Returns a data URI of a simple gradient placeholder.
 */
export const ANIME_PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
        <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#2a1a1a"/>
                <stop offset="100%" style="stop-color:#1a1a2a"/>
            </linearGradient>
        </defs>
        <rect width="300" height="400" fill="url(#g)"/>
        <text x="150" y="190" text-anchor="middle" fill="#ffffff20" font-size="14" font-family="sans-serif">No Image</text>
        <text x="150" y="210" text-anchor="middle" fill="#ffffff15" font-size="40" font-family="sans-serif">🎬</text>
    </svg>`
);
