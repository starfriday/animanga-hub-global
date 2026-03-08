"use client";

import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { WorldMovie } from './constants';
import { CatalogCard } from '@/components/anime/catalog/CatalogCard';

interface CinematicRadarProps {
    movies: WorldMovie[];
}

export function CinematicRadar({ movies }: CinematicRadarProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = current.clientWidth * 0.8;
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (!movies || movies.length === 0) return null;

    return (
        <section className="w-full py-20 bg-bg-cream relative overflow-hidden">
            <div className="max-w-[1800px] mx-auto px-4 lg:px-12 flex flex-col gap-8">

                {/* Header */}
                <div className="flex items-end justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-accent text-sm font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            В тренде
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-bg-dark drop-shadow-sm">
                            Популярное кино
                        </h2>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => scroll('left')}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-bg-dark/5 hover:bg-bg-dark/10 text-bg-dark transition-all active:scale-95 outline-none backdrop-blur-sm border border-bg-dark/10"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-bg-dark/5 hover:bg-bg-dark/10 text-bg-dark transition-all active:scale-95 outline-none backdrop-blur-sm border border-bg-dark/10"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* Carousel */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 pb-8 pt-4 hide-scrollbar snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
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

                        return (
                            <div key={project.id} className="min-w-[240px] md:min-w-[300px] snap-start">
                                <CatalogCard project={project as any} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
