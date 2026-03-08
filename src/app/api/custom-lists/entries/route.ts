import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { listId, animeId } = body;

        if (!listId || !animeId) {
            return NextResponse.json({ error: 'listId and animeId are required' }, { status: 400 });
        }

        // Verify ownership
        const list = await prisma.customList.findUnique({
            where: { id: Number(listId) }
        });

        if (!list || list.userId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const entry = await prisma.customListEntry.upsert({
            where: {
                listId_animeId: {
                    listId: Number(listId),
                    animeId: Number(animeId)
                }
            },
            update: {}, // Nothing to update, just ensure it exists
            create: {
                listId: Number(listId),
                animeId: Number(animeId)
            }
        });

        return NextResponse.json({ entry });
    } catch (error) {
        console.error('CustomListEntries POST API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const listId = searchParams.get('listId');
        const animeId = searchParams.get('animeId');

        if (!listId || !animeId) {
            return NextResponse.json({ error: 'listId and animeId are required' }, { status: 400 });
        }

        // Verify ownership
        const list = await prisma.customList.findUnique({
            where: { id: Number(listId) }
        });

        if (!list || list.userId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.customListEntry.delete({
            where: {
                listId_animeId: {
                    listId: Number(listId),
                    animeId: Number(animeId)
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('CustomListEntries DELETE API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
