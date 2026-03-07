import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const history = await prisma.watchHistory.findMany({
            where: { userId: user.id },
            orderBy: { updatedAt: 'desc' }
        });

        return NextResponse.json({ history });
    } catch (error) {
        console.error('History GET API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { animeId, episode, progress, completed } = body;

        if (!animeId || episode === undefined) {
            return NextResponse.json({ error: 'animeId and episode are required' }, { status: 400 });
        }

        const historyItem = await prisma.watchHistory.upsert({
            where: {
                userId_animeId_episode: {
                    userId: user.id,
                    animeId: Number(animeId),
                    episode: Number(episode)
                }
            },
            update: {
                episode: Number(episode),
                progress: progress !== undefined ? Number(progress) : undefined,
                completed: completed !== undefined ? Boolean(completed) : undefined
            },
            create: {
                userId: user.id,
                animeId: Number(animeId),
                episode: Number(episode),
                progress: progress ? Number(progress) : 0,
                completed: completed ? Boolean(completed) : false
            }
        });

        return NextResponse.json({ historyItem });
    } catch (error) {
        console.error('History POST API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
