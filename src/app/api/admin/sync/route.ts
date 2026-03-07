/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const SHIKIMORI_GQL = 'https://shikimori.one/api/graphql';

export async function GET(request: Request) {
    try {
        console.log('[API] Starting incremental AnimeCache sync...');

        const query = `{
            animes(limit: 50, page: 1, order: id_desc) {
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
                genres { id name russian kind }
            }
        }`;

        const response = await fetch(SHIKIMORI_GQL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'AniVaultApp/1.0 CronSync'
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error(`Shikimori API responded with status: ${response.status}`);
        }

        const data = await response.json();
        const animes = data?.data?.animes || [];

        let newCount = 0;
        let updateCount = 0;

        for (const anime of animes) {
            const shikimoriId = parseInt(anime.id);
            const posterUrl = anime.poster?.originalUrl || anime.poster?.mainUrl || '';
            const dataString = JSON.stringify(anime);

            const exists = await prisma.animeCache.findUnique({ where: { shikimoriId } });

            if (exists) {
                await prisma.animeCache.update({
                    where: { shikimoriId },
                    data: { data: dataString, posterUrl }
                });
                updateCount++;
            } else {
                await prisma.animeCache.create({
                    data: { shikimoriId, data: dataString, posterUrl }
                });
                newCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Incremental sync complete. Added: ${newCount}, Updated: ${updateCount}`
        });

    } catch (error: any) {
        console.error('[API] Incremental sync failed:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
