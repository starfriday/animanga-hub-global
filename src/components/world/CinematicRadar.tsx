"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ChevronLeft, Star, Play } from 'lucide-react';
import { WorldMovie } from './constants';

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
                    {movies.map((movie) => (
                        <div key={movie.id} className="min-w-[280px] lg:min-w-[340px] snap-start group relative">
                            <Link href={`/anime/${movie.id}`} className="block relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-white/40 border border-bg-dark/5 select-none shadow-md hover:shadow-xl transition-shadow duration-300">
                                {/* Image */}
                                <Image
                                    src={`https://shikimori.one${movie.image?.original}`}
                                    alt={movie.name}
                                    fill
                                    unoptimized
                                    referrerPolicy="no-referrer"
                                    className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"
                                    sizes="(max-width: 1024px) 100vw, 400px"
                                />

                                {/* Light Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/70 via-bg-dark/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Top Badge */}
                                {(movie.score || 0) > 0 && (
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-bg-dark/5 flex items-center gap-1.5 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300 shadow-sm">
                                        <Star size={14} className="text-accent fill-accent" />
                                        <span className="text-bg-dark text-xs font-bold">{movie.score}</span>
                                    </div>
                                )}

                                {/* Bottom Content */}
                                <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 line-clamp-2 leading-tight drop-shadow-md">
                                        {movie.russian || movie.name}
                                    </h3>

                                    <div className="flex items-center gap-4 text-xs font-medium text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        <span className="font-bold">{movie.aired_on ? new Date(movie.aired_on).getFullYear() : 'TBA'}</span>
                                        <div className="w-1 h-1 rounded-full bg-white/40" />
                                        <span>Аниме фильм</span>
                                    </div>

                                    {/* Secret Play Button that appears on hover */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300 shadow-xl shadow-accent/20">
                                        <Play size={24} fill="currentColor" className="ml-1" />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
