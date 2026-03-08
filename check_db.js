const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
    const history = await prisma.watchHistory.findMany({
        orderBy: { updatedAt: 'desc' }
    });
    console.dir(history, { depth: null });
}
check().finally(() => prisma.$disconnect());
