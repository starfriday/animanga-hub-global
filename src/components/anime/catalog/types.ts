export interface AnimeProject {
    id: string;
    slug: string;
    title: string;
    russian?: string;
    name?: string;
    description: string;
    banner: string;
    image: string;
    posterPosition: string;
    studio_rating: number;
    type: string;
    status: 'Ongoing' | 'Completed' | 'Announced' | string;
    year: number | null;
    totalEpisodes: number;
    episodes: { number: number }[];
    views: number;
}
