const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function migrate() {
    try {
        const favorites = JSON.parse(fs.readFileSync('favorites_backup.json', 'utf8'));
        console.log(`Migrating ${favorites.length} favorites...`);

        for (const fav of favorites) {
            await prisma.userAnime.upsert({
                where: {
                    userId_animeId: {
                        userId: fav.userId,
                        animeId: fav.animeId
                    }
                },
                update: {
                    isFavorite: true,
                    status: 'PLANNED'
                },
                create: {
                    userId: fav.userId,
                    animeId: fav.animeId,
                    status: 'PLANNED',
                    isFavorite: true
                }
            });
        }
        console.log('Migration completed successfully.');
    } catch (e) {
        console.error('Migration error:', e.message);
    }
}

migrate().finally(() => prisma.$disconnect());
