import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const collections = await prisma.customList.findMany({
            where: { isPublic: true },
            include: {
                user: {
                    select: {
                        username: true,
                        avatarUrl: true
                    }
                },
                _count: {
                    select: { entries: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ collections });
    } catch (error) {
        console.error('Collections GET API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
