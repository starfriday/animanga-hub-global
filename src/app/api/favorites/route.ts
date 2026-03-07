import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const favorites = await prisma.favorite.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ favorites });
    } catch (error) {
        console.error('Favorites GET API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { animeId } = body;

        if (!animeId) return NextResponse.json({ error: 'animeId is required' }, { status: 400 });

        const favorite = await prisma.favorite.create({
            data: {
                userId: user.id,
                animeId: Number(animeId)
            }
        });

        return NextResponse.json({ favorite });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Already in favorites' }, { status: 409 });
        }
        console.error('Favorites POST API Error:', error);
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

        await prisma.favorite.deleteMany({
            where: {
                userId: user.id,
                animeId: Number(animeId)
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Favorites DELETE API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
