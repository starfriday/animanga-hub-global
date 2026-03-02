import { getAnimeDetails, getAnimeRoles, getAnimeSimilar, getAnimeRelated, getAnimeGenresGraphQL, getAnimePosterGQL } from '@/services/shikimori';
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

    // Fetch data in parallel (including GraphQL genres for themes AND GraphQL poster)
    const [anime, roles, similar, videos, related, graphqlGenres, graphqlPoster] = await Promise.all([
        getAnimeDetails(id),
        getAnimeRoles(id),
        getAnimeSimilar(id),
        getVideosByShikimoriId(id),
        getAnimeRelated(id),
        getAnimeGenresGraphQL(id),
        getAnimePosterGQL(id)
    ]);

    if (!anime) {
        notFound();
    }

    // Enrich anime data with GraphQL genres (which include themes with kind field)
    if (graphqlGenres.length > 0) {
        anime.genres = graphqlGenres;
    }

    // Enrich anime data with GraphQL poster (reliable URL from poster { originalUrl })
    if (graphqlPoster) {
        anime.posterUrl = graphqlPoster;
    }

    return (
        <AnimeDetailsPage
            anime={anime}
            roles={roles}
            similar={similar}
            videos={videos}
            related={related}
        />
    );
}

export async function generateMetadata({ params }: PageProps) {
    const { id } = await params;
    const anime = await getAnimeDetails(id);

    if (!anime) return { title: 'Anime Not Found' };

    const title = anime.russian || anime.name;
    const description = anime.description?.slice(0, 160) || `Смотреть аниме ${title} онлайн в хорошем качестве.`;

    return {
        title: `${title} - Смотреть аниме онлайн | AniVault`,
        description,
        openGraph: {
            images: [anime.image?.original ? ensureFullUrl(anime.image.original) : ''],
        },
    };
}
