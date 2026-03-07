/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SHIKIMORI_GQL = 'https://shikimori.one/api/graphql';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function fetchPage(page: number, limit: number = 50) {
    const query = `{
        animes(limit: ${limit}, page: ${page}, order: id) {
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
            statusesStats { status count }
        }
    }`;

    try {
        const response = await fetch(SHIKIMORI_GQL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'User-Agent': 'AniVaultApp/1.0 SyncScript' },
            body: JSON.stringify({ query })
        });

        if (!response.ok) { console.error(`Error page ${page}: ${response.status}`); return null; }
        const data = await response.json();
        return data?.data?.animes || [];
    } catch (error) { console.error(`Exception page ${page}:`, error); return null; }
}

function calcPopularity(anime: any): number {
    if (!anime.statusesStats || !Array.isArray(anime.statusesStats)) return 0;
    return anime.statusesStats.reduce((sum: number, s: any) => sum + (s.count || 0), 0);
}

function extractFields(anime: any) {
    const shikimoriId = parseInt(anime.id);
    const posterUrl = anime.poster?.originalUrl || anime.poster?.mainUrl || '';
    const dataString = JSON.stringify(anime);
    const popularity = calcPopularity(anime);

    // Extract genres as comma-separated English names for filtering
    const genres = (anime.genres || []).map((g: any) => g.name).filter(Boolean).join(', ');

    // Parse aired date
    let airedOn: Date | null = null;
    if (anime.airedOn?.date) {
        const d = new Date(anime.airedOn.date);
        if (!isNaN(d.getTime())) airedOn = d;
    }

    // Season string (e.g., "winter_2024")
    let season: string | null = null;
    if (airedOn) {
        const month = airedOn.getMonth();
        const year = airedOn.getFullYear();
        const s = month <= 1 || month === 11 ? 'winter' : month <= 4 ? 'spring' : month <= 7 ? 'summer' : 'fall';
        season = `${s}_${year}`;
    }

    return {
        shikimoriId,
        name: anime.name || '',
        russian: anime.russian || null,
        kind: anime.kind || null,
        status: anime.status || null,
        score: parseFloat(anime.score) || null,
        episodes: anime.episodes || null,
        episodesAired: anime.episodesAired || null,
        airedOn,
        season,
        genres,
        synonyms: null,
        data: dataString,
        posterUrl,
        popularity,
    };
}

async function syncAll(startPage: number = 1, endPage: number = 500) {
    console.log('--- STARTING BULK SYNC ---');
    let totalSynced = 0;

    for (let page = startPage; page <= endPage; page++) {
        console.log(`[Sync] Fetching page ${page}...`);
        const animes = await fetchPage(page, 50);

        if (!animes) {
            console.log(`[Sync] Error on page ${page}, retrying...`);
            await delay(5000);
            page--;
            continue;
        }

        if (animes.length === 0) {
            console.log(`[Sync] Page ${page} is empty. Done.`);
            break;
        }

        console.log(`[Sync] Upserting ${animes.length} items from page ${page}...`);

        for (const anime of animes) {
            const fields = extractFields(anime);
            await prisma.animeCache.upsert({
                where: { shikimoriId: fields.shikimoriId },
                update: fields,
                create: fields,
            });
            totalSynced++;
        }

        console.log(`[Sync] Page ${page} done. Total: ${totalSynced}`);
        await delay(1000);
    }

    console.log(`--- SYNC COMPLETE. Total: ${totalSynced} ---`);
}

async function syncRecent() {
    console.log('--- INCREMENTAL SYNC ---');
    const query = `{
        animes(limit: 50, page: 1, order: id_desc) {
            id name russian score status kind episodes episodesAired
            airedOn { date } poster { originalUrl mainUrl }
            description genres { id name russian kind }
            statusesStats { status count }
        }
    }`;

    try {
        const response = await fetch(SHIKIMORI_GQL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'User-Agent': 'AniVaultApp/1.0 SyncScript' },
            body: JSON.stringify({ query })
        });

        const data = await response.json();
        const animes = data?.data?.animes || [];
        console.log(`[Incremental] Fetched ${animes.length} items.`);
        let newCount = 0, updateCount = 0;

        for (const anime of animes) {
            const fields = extractFields(anime);
            const exists = await prisma.animeCache.findUnique({ where: { shikimoriId: fields.shikimoriId } });
            if (exists) {
                await prisma.animeCache.update({ where: { shikimoriId: fields.shikimoriId }, data: fields });
                updateCount++;
            } else {
                await prisma.animeCache.create({ data: fields });
                newCount++;
            }
        }
        console.log(`[Incremental] Added ${newCount}, updated ${updateCount}.`);
    } catch (e) { console.error('Incremental sync failed:', e); }
}

async function run() {
    const args = process.argv.slice(2);
    const mode = args[0] || 'incremental';

    if (mode === 'full') {
        const startPage = args[1] ? parseInt(args[1]) : 1;
        await syncAll(startPage);
    } else {
        await syncRecent();
    }
    await prisma.$disconnect();
}

run();
