/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting data migration for AnimeCache extended searchable columns...');

    let updatedCount = 0;
    let skip = 0;
    const batchSize = 1000;

    while (true) {
        const batch = await prisma.animeCache.findMany({
            take: batchSize,
            skip: skip,
            orderBy: { id: 'asc' }
        });

        if (batch.length === 0) {
            break;
        }

        console.log(`Processing batch starting from index ${skip}...`);

        for (const record of batch) {
            try {
                const data = JSON.parse(record.data);

                let score = parseFloat(data.score);
                if (isNaN(score)) score = 0;

                let airedOn = null;
                if (data.aired_on) {
                    const parsedDate = new Date(data.aired_on);
                    if (!isNaN(parsedDate.getTime())) airedOn = parsedDate;
                } else if (data.airedOn && data.airedOn.date) {
                    const parsedDate = new Date(data.airedOn.date);
                    if (!isNaN(parsedDate.getTime())) airedOn = parsedDate;
                }

                const genresList = data.genres ? data.genres.map((g: any) => g.name || g.russian).join(',') : '';

                // Extract synonyms and alternate titles for Smart Search
                const synonymList = [
                    data.english,
                    data.japanese,
                    ...(data.synonyms || [])
                ].filter(Boolean).join('; ');

                let retries = 3;
                while (retries > 0) {
                    try {
                        await prisma.animeCache.update({
                            where: { id: record.id },
                            data: {
                                name: data.name || data.russian || '',
                                russian: data.russian || null,
                                kind: data.kind || null,
                                status: data.status || null,
                                score: score,
                                airedOn: airedOn,
                                episodes: data.episodes || 0,
                                episodesAired: data.episodes_aired || data.episodesAired || 0,
                                season: data.season || null,
                                genres: genresList,
                                synonyms: synonymList
                            }
                        });
                        break;
                    } catch (e: any) {
                        if (e.code === 'P2034') { // Deadlock
                            retries--;
                            if (retries === 0) throw e;
                            await new Promise(resolve => setTimeout(resolve, 100));
                        } else {
                            throw e;
                        }
                    }
                }

                updatedCount++;
            } catch (error) {
                // Silently skip corrupted JSON
            }
        }
        console.log(`Updated ${updatedCount} records so far...`);
        skip += batchSize;
    }

    console.log(`Migration complete! Successfully updated ${updatedCount} records.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
