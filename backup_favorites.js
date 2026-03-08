const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function backup() {
    try {
        const favorites = await prisma.favorite.findMany();
        fs.writeFileSync('favorites_backup.json', JSON.stringify(favorites, null, 2));
        console.log(`Backed up ${favorites.length} favorites.`);
    } catch (e) {
        console.error('No favorites found or error during backup:', e.message);
    }
}

backup().finally(() => prisma.$disconnect());
