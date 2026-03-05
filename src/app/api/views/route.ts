import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { animeId } = body;

        if (!animeId) {
            return NextResponse.json({ error: 'animeId is required' }, { status: 400 });
        }

        const view = await prisma.animeView.upsert({
            where: { animeId: String(animeId) },
            update: {
                viewCount: { increment: 1 }
            },
            create: {
                animeId: String(animeId),
                viewCount: 1
            }
        });

        return NextResponse.json({ viewCount: view.viewCount });
    } catch (error) {
        console.error('Views POST API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
