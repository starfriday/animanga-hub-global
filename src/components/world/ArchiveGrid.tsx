"use client";

import React from 'react';
import { WorldMovie } from './constants';
import { Film } from 'lucide-react';
import { CatalogCard } from '@/components/anime/catalog/CatalogCard';

interface ArchiveGridProps {
    movies: WorldMovie[];
}

export function ArchiveGrid({ movies }: ArchiveGridProps) {
    if (!movies || movies.length === 0) return null;

    return (
        <section className="w-full py-24 bg-bg-cream relative">
            {/* Ambient Background Blur */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
            </div>

            <div className="max-w-[1800px] mx-auto px-4 lg:px-12 flex flex-col gap-12 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-bg-dark/10 pb-8 gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-bg-dark/50 text-sm font-bold uppercase tracking-wider">
                            <Film size={18} />
                            Полный каталог
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-bg-dark leading-none">
                            Киноархив
                        </h2>
                    </div>
                    <div className="max-w-md text-left md:text-right">
                        <p className="text-bg-dark/60 font-medium">
                            Кураторская подборка полнометражных произведений. Исследуйте богатую коллекцию классики и новых шедевров японской анимации.
                        </p>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-6">
                    {movies.map((movie) => {
                        const project = {
                            id: String(movie.id),
                            slug: movie.name || String(movie.id),
                            title: movie.russian || movie.name,
                            description: '',
                            banner: `https://shikimori.one${movie.image?.original}`,
                            image: `https://shikimori.one${movie.image?.original}`,
                            posterPosition: 'center',
                            studio_rating: movie.score || 0,
                            type: 'Movie',
                            status: 'Completed',
                            year: movie.aired_on ? new Date(movie.aired_on).getFullYear() : null,
                            totalEpisodes: 1,
                            episodes: [{ number: 1 }],
                            views: 0
                        };

                        return <CatalogCard key={project.id} project={project as any} />;
                    })}
                </div>

            </div>
        </section>
    );
}
