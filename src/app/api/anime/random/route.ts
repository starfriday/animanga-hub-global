import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        // Direct MySQL random query for performance
        // This finds a random entry in one hit
        const count = await prisma.animeCache.count({
            where: { name: { not: "" } }
        });

        if (count === 0) {
            return NextResponse.json({ error: "No migrated anime found yet" }, { status: 404 });
        }

        const randomSkip = Math.floor(Math.random() * count);

        const randomAnime = await prisma.animeCache.findFirst({
            where: { name: { not: "" } },
            skip: randomSkip,
            take: 1
        });

        if (!randomAnime) {
            return NextResponse.json({ error: "No anime found" }, { status: 404 });
        }

        const data = JSON.parse(randomAnime.data);
        const posterUrl = randomAnime.posterUrl || '';

        return NextResponse.json({
            id: String(data.id),
            slug: data.name || String(data.id),
            title: data.russian || data.name,
            image: posterUrl,
            score: parseFloat(data.score) || 0,
            status: data.status,
            kind: data.kind
        });

    } catch (error) {
        console.error("Random API Error:", error);
        return NextResponse.json({ error: "Failed to fetch random anime" }, { status: 500 });
    }
}
