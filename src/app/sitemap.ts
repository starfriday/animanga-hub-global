/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://anivault.ru';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${BASE_URL}/catalog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/cinema`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/team`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    ];

    // Dynamic anime pages — fetch all shikimoriIds
    try {
        const allAnime = await prisma.animeCache.findMany({
            select: { shikimoriId: true, updatedAt: true },
            orderBy: { shikimoriId: 'desc' },
        });

        const animePages: MetadataRoute.Sitemap = allAnime.map((anime: any) => ({
            url: `${BASE_URL}/anime/${anime.shikimoriId}`,
            lastModified: anime.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        return [...staticPages, ...animePages];
    } catch (error) {
        console.error('Sitemap generation error:', error);
        return staticPages;
    }
}
