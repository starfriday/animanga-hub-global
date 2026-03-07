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
        <section className="w-full py-24 bg-bg-dark relative">
            {/* Background Grain */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("/noise.png")', backgroundRepeat: 'repeat' }} />

            <div className="max-w-[1800px] mx-auto px-4 lg:px-12 flex flex-col gap-12 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-white/10 pb-8 gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-white/50 text-sm font-bold uppercase tracking-wider">
                            <Film size={18} />
                            Полный каталог
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-white leading-none">
                            Киноархив
                        </h2>
                    </div>
                    <div className="max-w-md text-left md:text-right">
                        <p className="text-white/60 font-medium">
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
                            className="group relative flex flex-col gap-3 rounded-xl outline-none"
                        >
                            {/* Poster Box */}
                            <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-white/5 border border-white/10 shadow-lg">
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
                                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Score Badge */}
                                {(movie.score || 0) > 0 && (
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 shadow-sm">
                                        <Star size={12} className="text-accent fill-accent" />
                                        <span className="text-white text-[10px] font-bold">{movie.score}</span>
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
                            <div className="flex flex-col gap-1 px-1">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                    <span>{movie.aired_on ? new Date(movie.aired_on).getFullYear() : 'TBA'}</span>
                                    <div className="w-1 h-1 rounded-full bg-white/20" />
                                    <span>Фильм</span>
                                </div>
                                <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-accent transition-colors">
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
