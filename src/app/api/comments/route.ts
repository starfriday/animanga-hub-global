import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const animeId = searchParams.get('animeId');

        if (!animeId) return NextResponse.json({ error: 'animeId is required' }, { status: 400 });

        const comments = await prisma.comment.findMany({
            where: { animeId: String(animeId) },
            include: {
                user: {
                    select: { id: true, username: true, avatarUrl: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ comments });
    } catch (error) {
        console.error('Comments GET API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { animeId, content, parentId } = body;

        if (!animeId || !content) {
            return NextResponse.json({ error: 'animeId and content are required' }, { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: {
                userId: user.id,
                animeId: String(animeId),
                content,
                parentId: parentId ? Number(parentId) : null
            },
            include: {
                user: {
                    select: { id: true, username: true, avatarUrl: true }
                }
            }
        });

        return NextResponse.json({ comment });
    } catch (error) {
        console.error('Comments POST API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
