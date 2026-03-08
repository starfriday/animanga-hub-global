import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const lists = await prisma.customList.findMany({
            where: { userId: user.id },
            include: { entries: true },
            orderBy: { updatedAt: 'desc' }
        });

        return NextResponse.json({ lists });
    } catch (error) {
        console.error('CustomLists GET API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { name, description, isPublic } = body;

        if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 });

        const list = await prisma.customList.create({
            data: {
                userId: user.id,
                name,
                description,
                isPublic: !!isPublic
            }
        });

        return NextResponse.json({ list });
    } catch (error) {
        console.error('CustomLists POST API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { id, name, description, isPublic } = body;

        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

        // Verify ownership
        const existing = await prisma.customList.findUnique({
            where: { id: Number(id) }
        });

        if (!existing || existing.userId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const list = await prisma.customList.update({
            where: { id: Number(id) },
            data: {
                name: name !== undefined ? name : undefined,
                description: description !== undefined ? description : undefined,
                isPublic: isPublic !== undefined ? !!isPublic : undefined
            }
        });

        return NextResponse.json({ list });
    } catch (error) {
        console.error('CustomLists PATCH API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

        // Verify ownership
        const existing = await prisma.customList.findUnique({
            where: { id: Number(id) }
        });

        if (!existing || existing.userId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.customList.delete({
            where: { id: Number(id) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('CustomLists DELETE API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
