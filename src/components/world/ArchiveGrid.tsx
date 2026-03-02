"use client";

import React from 'react';
import Link from 'next/link';
import { BlurImage } from '@/components/ui/BlurImage';
import { MOCK_ARTICLE_TITLES } from './constants';

interface ArchiveGridProps {
    movies: any[];
}

export function ArchiveGrid({ movies }: ArchiveGridProps) {
    if (!movies || movies.length === 0) return null;

    return (
        <section className="w-full py-16 lg:py-24 bg-bg-cream">
            <div className="max-w-[1800px] mx-auto px-4 lg:px-12 flex flex-col gap-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b-4 border-bg-dark pb-4 gap-4">
                    <h2 className="font-editorial text-4xl lg:text-6xl uppercase tracking-tighter text-bg-dark leading-none">
                        КИНО<wbr /><span className="text-accent">АРХИВ</span>
                    </h2>
                    <p className="font-bold text-sm uppercase tracking-widest max-w-sm text-right opacity-70">
                        Кураторская подборка кинематографических достижений в японской анимации.
                    </p>
                </div>

                {/* The Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {movies.map((movie, idx) => {
                        // Create variation in grid layout.
                        // Every 7th item gets a huge span.
                        const isFeatured = idx % 7 === 0;
                        const isQuote = idx % 11 === 5; // A fake quote box

                        if (isQuote) {
                            return (
                                <div key={`quote-${idx}`} className="col-span-1 sm:col-span-2 lg:col-span-2 flex flex-col justify-center border-4 border-bg-dark p-8 lg:p-12 relative group bg-[#B83A2D] text-cream">
                                    <div className="font-serif text-6xl opacity-30 absolute top-4 left-4">"</div>
                                    <h3 className="font-editorial text-3xl lg:text-5xl uppercase tracking-tighter leading-none relative z-10">
                                        {MOCK_ARTICLE_TITLES[idx % MOCK_ARTICLE_TITLES.length]}
                                    </h3>
                                    <p className="font-bold text-xs tracking-widest uppercase mt-8 relative z-10 border-t-2 border-cream/30 pt-4">
                                        КОЛОНКА РЕДАКТОРА
                                    </p>
                                </div>
                            );
                        }

                        return (
                            <div key={movie.id} className={`${isFeatured ? 'col-span-1 sm:col-span-2 lg:col-span-2' : 'col-span-1'} group relative`}>
                                {/* Shadow block */}
                                <div className="absolute top-2 left-2 w-full h-full bg-bg-dark border-2 border-bg-dark transition-transform group-hover:translate-x-1 group-hover:translate-y-1 z-0" />

                                <Link href={`/anime/${movie.id}`} className="block relative z-10 w-full h-full bg-cream border-2 border-bg-dark flex flex-col transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1">
                                    <div className={`w-full relative border-b-2 border-bg-dark bg-bg-dark overflow-hidden ${isFeatured ? 'aspect-[21/9]' : 'aspect-square'}`}>
                                        <BlurImage
                                            src={`https://shikimori.one${movie.image?.original}`}
                                            alt={movie.name}
                                            fill
                                            className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                        />
                                        {movie.score > 0 && (
                                            <div className="absolute bottom-0 left-0 bg-accent text-cream font-black text-xl px-3 py-1 border-t-2 border-r-2 border-bg-dark">
                                                {movie.score}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                                        <h3 className={`font-editorial uppercase tracking-tighter text-bg-dark leading-none ${isFeatured ? 'text-4xl' : 'text-2xl'}`}>
                                            {movie.russian || movie.name}
                                        </h3>
                                        <div className="flex items-center justify-between text-xs font-black tracking-widest uppercase border-t-2 border-bg-dark/10 pt-4 mt-auto">
                                            <span>{movie.aired_on ? new Date(movie.aired_on).getFullYear() : 'TBA'}</span>
                                            <span className="text-accent underline decoration-2 underline-offset-4">ИССЛЕДОВАТЬ</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
