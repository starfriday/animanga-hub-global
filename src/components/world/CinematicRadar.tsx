"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { BlurImage } from '@/components/ui/BlurImage';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface CinematicRadarProps {
    movies: any[];
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
        <section className="w-full py-16 lg:py-24 border-b-4 border-bg-dark bg-bg-cream">
            <div className="max-w-[1800px] mx-auto px-4 lg:px-12 flex flex-col gap-8">

                {/* Header */}
                <div className="flex items-end justify-between border-b-4 border-bg-dark pb-4">
                    <h2 className="font-editorial text-4xl lg:text-5xl uppercase tracking-tighter text-bg-dark">
                        <span className="text-accent">РАДАР</span> ПРЕМЬЕР
                    </h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => scroll('left')}
                            className="w-12 h-12 flex items-center justify-center border-2 border-bg-dark hover:bg-accent hover:text-cream hover:border-accent transition-colors active:scale-95"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-12 h-12 flex items-center justify-center border-2 border-bg-dark hover:bg-accent hover:text-cream hover:border-accent transition-colors active:scale-95"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* Radar Scroll */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 lg:gap-8 pb-8 pt-4 hide-scrollbar snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {movies.map((movie, idx) => (
                        <div key={movie.id} className="min-w-[280px] lg:min-w-[400px] snap-center group relative">
                            {/* Block shadow behind */}
                            <div className="absolute top-3 left-3 w-full h-full bg-[#B83A2D] border-2 border-bg-dark transition-transform group-hover:translate-x-1 group-hover:translate-y-1 z-0" />

                            <Link href={`/anime/${movie.id}`} className="relative block z-10 w-full bg-cream border-2 border-bg-dark p-4 lg:p-6 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-bg-dark/20 text-xs font-black uppercase tracking-widest">
                                    <span className="text-[#B83A2D]">{String(idx + 1).padStart(2, '0')}</span>
                                    <span>{movie.score || 'NYA'}</span>
                                </div>
                                <div className="w-full aspect-video bg-bg-dark border-2 border-bg-dark mb-4 overflow-hidden relative">
                                    <BlurImage
                                        src={`https://shikimori.one${movie.image?.original}`}
                                        alt={movie.name}
                                        fill
                                        className="object-cover grayscale mix-blend-luminosity opacity-80 group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-500"
                                    />
                                </div>
                                <h3 className="font-editorial text-2xl uppercase tracking-tighter text-bg-dark line-clamp-2 leading-tight">
                                    {movie.russian || movie.name}
                                </h3>
                                <p className="text-xs uppercase font-bold tracking-widest mt-2 opacity-50">
                                    {movie.aired_on ? new Date(movie.aired_on).getFullYear() : 'TBA'}
                                </p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
