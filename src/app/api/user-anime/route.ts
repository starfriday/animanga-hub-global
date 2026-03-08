import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// Statuses: WATCHING, COMPLETED, ON_HOLD, DROPPED, PLANNED

export async function GET(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const animeList = await prisma.userAnime.findMany({
            where: { userId: user.id },
            orderBy: { updatedAt: 'desc' }
        });

        return NextResponse.json({ animeList });
    } catch (error) {
        console.error('UserAnime GET API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { animeId, status, isFavorite } = body;

        if (!animeId) return NextResponse.json({ error: 'animeId is required' }, { status: 400 });

        const userAnime = await prisma.userAnime.upsert({
            where: {
                userId_animeId: {
                    userId: user.id,
                    animeId: Number(animeId)
                }
            },
            update: {
                status: status || undefined,
                isFavorite: isFavorite !== undefined ? isFavorite : undefined
            },
            create: {
                userId: user.id,
                animeId: Number(animeId),
                status: status || 'PLANNED',
                isFavorite: isFavorite || false
            }
        });

        return NextResponse.json({ userAnime });
    } catch (error) {
        console.error('UserAnime POST API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const animeId = searchParams.get('animeId');

        if (!animeId) return NextResponse.json({ error: 'animeId is required' }, { status: 400 });

        await prisma.userAnime.deleteMany({
            where: {
                userId: user.id,
                animeId: Number(animeId)
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('UserAnime DELETE API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
