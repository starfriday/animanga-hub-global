import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Случайное аниме | AniVault",
    description: "Не знаете что посмотреть? Мы подберём случайное аниме для вас!",
};

export const dynamic = 'force-dynamic';

export default async function RandomPage() {
    // Pick a random anime from the database
    const count = await prisma.animeCache.count({
        where: { score: { gt: 5 }, posterUrl: { not: '' } }
    });

    if (count === 0) {
        redirect('/catalog');
    }

    const randomSkip = Math.floor(Math.random() * count);
    const randomAnime = await prisma.animeCache.findFirst({
        where: { score: { gt: 5 }, posterUrl: { not: '' } },
        skip: randomSkip,
        select: { shikimoriId: true }
    });

    if (randomAnime) {
        redirect(`/anime/${randomAnime.shikimoriId}`);
    }

    redirect('/catalog');
}
