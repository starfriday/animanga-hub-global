import { getFullAnimeDetailsGQL } from '@/services/shikimori';
import { getVideosByShikimoriId } from '@/services/kodik';
import { AnimeDetailsPage } from '@/components/anime/details/AnimeDetailsPage';
import { ensureFullUrl } from '@/lib/imageUtils';
import { notFound } from 'next/navigation';

interface PageProps {
    params: {
        id: string;
    };
}

export default async function AnimePage({ params }: PageProps) {
    const { id } = await params;

    // Fetch data in parallel: Universal GraphQL query for Anime Details, and Kodik for player links
    // Fetch data in parallel: Universal GraphQL query for Anime Details and Kodik for player links
    const [anime, kodikVideos] = await Promise.all([
        getFullAnimeDetailsGQL(id),
        getVideosByShikimoriId(id)
    ]);

    if (!anime) {
        notFound();
    }

    // Pass pure GraphQL roles to Client Component
    const rawRoles = {
        characterRoles: anime.characterRoles || [],
        personRoles: anime.personRoles || []
    };

    // Map GraphQL related to old format expected by RelatedReleases component
    const mappedRelated = (anime.related || []).map((r: any) => ({
        relation: r.relationKind,
        relation_russian: r.relationText || r.relationKind,
        anime: r.anime ? {
            ...r.anime,
            aired_on: r.anime.airedOn?.date,
            image: { original: r.anime.poster?.originalUrl || r.anime.poster?.mainUrl || '' }
        } : null,
        manga: r.manga
    }));

    return (
        <AnimeDetailsPage
            anime={anime}
            roles={rawRoles}
            similar={[]} // We can drop similar if related covers it, or update later
            videos={kodikVideos}   // pass Kodik for the player
            related={mappedRelated}
        />
    );
}

export async function generateMetadata({ params }: PageProps) {
    const { id } = await params;
    const anime = await getFullAnimeDetailsGQL(id);

    if (!anime) return { title: 'Anime Not Found' };

    const title = anime.russian || anime.name;
    const description = anime.description?.slice(0, 160) || `Смотреть аниме ${title} онлайн в хорошем качестве.`;

    return {
        title: `${title} - Смотреть аниме онлайн | AniVault`,
        description,
        openGraph: {
            images: [anime.posterUrl ? ensureFullUrl(anime.posterUrl) : ''],
        },
    };
}
