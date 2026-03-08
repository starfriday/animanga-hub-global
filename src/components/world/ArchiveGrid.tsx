"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WorldMovie } from './constants';
import { Film, Star, Play } from 'lucide-react';

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
                    {movies.map((movie) => (
                        <Link
                            key={movie.id}
                            href={`/anime/${movie.id}`}
                            className="group relative flex flex-col gap-3 rounded-[1.5rem] outline-none"
                        >
                            {/* Poster Box */}
                            <div className="relative w-full aspect-[2/3] rounded-[1.5rem] overflow-hidden bg-white/40 border border-bg-dark/5 shadow-sm group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:-translate-y-1">
                                <Image
                                    src={`https://shikimori.one${movie.image?.original}`}
                                    alt={movie.name}
                                    fill
                                    unoptimized
                                    referrerPolicy="no-referrer"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/70 via-bg-dark/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Score Badge */}
                                {(movie.score || 0) > 0 && (
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full border border-bg-dark/5 flex items-center gap-1 shadow-sm">
                                        <Star size={12} className="text-accent fill-accent" />
                                        <span className="text-bg-dark text-[10px] font-bold">{movie.score}</span>
                                    </div>
                                )}

                                {/* Hover Play Icon */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                                    <div className="w-14 h-14 rounded-full bg-accent/90 text-white flex items-center justify-center shadow-lg shadow-accent/20 backdrop-blur-sm">
                                        <Play size={20} fill="currentColor" className="ml-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Meta Info Below Poster */}
                            <div className="flex flex-col gap-1 px-2 pt-1">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-bg-dark/40 uppercase tracking-widest">
                                    <span>{movie.aired_on ? new Date(movie.aired_on).getFullYear() : 'TBA'}</span>
                                    <div className="w-1 h-1 rounded-full bg-bg-dark/20" />
                                    <span>Фильм</span>
                                </div>
                                <h3 className="text-sm font-bold text-bg-dark line-clamp-2 leading-tight group-hover:text-accent transition-colors">
                                    {movie.russian || movie.name}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}
