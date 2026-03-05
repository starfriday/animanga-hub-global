import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SHIKIMORI_GQL = 'https://shikimori.one/api/graphql';

// Delay to respect rate limits
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function fetchPage(page: number, limit: number = 50) {
    const query = `{
        animes(limit: ${limit}, page: ${page}, order: id) {
            id
            name
            russian
            english
            japanese
            synonyms
            score
            status
            kind
            episodes
            episodesAired
            season
            airedOn { date }
            poster { originalUrl }
            description
            genres { name russian }
        }
    }`;

    try {
        const response = await fetch(SHIKIMORI_GQL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'AniVaultApp/1.0 MasterSync'
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) return null;
        const data = await response.json();
        return data?.data?.animes || [];
    } catch (error) {
        console.error(`Page ${page} fetch failed:`, error);
        return null;
    }
}

async function syncAndIndex(anime: any) {
    const shikimoriId = parseInt(anime.id);
    const posterUrl = anime.poster?.originalUrl || '';

    // Process indexing fields
    let airedOn = null;
    if (anime.airedOn?.date) {
        const d = new Date(anime.airedOn.date);
        if (!isNaN(d.getTime())) airedOn = d;
    }

    const genresList = anime.genres ? anime.genres.map((g: any) => g.russian || g.name).join(',') : '';

    const synonymList = [
        anime.english,
        anime.japanese,
        ...(anime.synonyms || [])
    ].filter(Boolean).join('; ');

    const dataString = JSON.stringify(anime);

    await prisma.animeCache.upsert({
        where: { shikimoriId },
        update: {
            data: dataString,
            posterUrl,
            name: anime.name || anime.russian || '',
            russian: anime.russian,
            kind: anime.kind,
            status: anime.status,
            score: parseFloat(anime.score) || 0,
            airedOn,
            episodes: anime.episodes || 0,
            episodesAired: anime.episodesAired || 0,
            season: anime.season,
            genres: genresList,
            synonyms: synonymList
        },
        create: {
            shikimoriId,
            data: dataString,
            posterUrl,
            name: anime.name || anime.russian || '',
            russian: anime.russian,
            kind: anime.kind,
            status: anime.status,
            score: parseFloat(anime.score) || 0,
            airedOn,
            episodes: anime.episodes || 0,
            episodesAired: anime.episodesAired || 0,
            season: anime.season,
            genres: genresList,
            synonyms: synonymList
        }
    });
}

async function main() {
    const args = process.argv.slice(2);
    const startPage = parseInt(args[0]) || 1;
    const endPage = parseInt(args[1]) || 500;
    const CONCURRENCY = 3; // Stay under 5 req/sec

    console.log(`🚀 Starting Fast Master Sync from page ${startPage} to ${endPage}...`);

    for (let page = startPage; page <= endPage; page += CONCURRENCY) {
        const pagesToFetch = [];
        for (let i = 0; i < CONCURRENCY && (page + i) <= endPage; i++) {
            pagesToFetch.push(page + i);
        }

        console.log(`[Pages ${pagesToFetch.join(',')}] Fetching...`);

        const results = await Promise.all(pagesToFetch.map(p => fetchPage(p)));

        for (let i = 0; i < results.length; i++) {
            const animes = results[i];
            const p = pagesToFetch[i];

            if (!animes) {
                console.log(`⚠️ Page ${p} failed, skipping...`);
                continue;
            }

            if (animes.length === 0) {
                console.log(`🏁 Reached end at page ${p}`);
                return;
            }

            console.log(`Indexing ${animes.length} items from page ${p}...`);
            // Indexing per page is still serial locally to avoid DB lock issues
            for (const anime of animes) {
                await syncAndIndex(anime);
            }
        }

        await delay(1200); // Respect rate limits (3 requests per ~1.2s = 2.5 rps)
    }
    console.log('✅ Fast Master Sync Complete!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
