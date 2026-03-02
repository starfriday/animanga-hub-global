"use client";

import React from 'react';
import Link from 'next/link';
import { BlurImage } from '@/components/ui/BlurImage';

interface WorldHeroProps {
    movie: any;
}

export function WorldHero({ movie }: WorldHeroProps) {
    if (!movie) return null;

    const posterUrl = `https://shikimori.one${movie.image?.original}`;

    return (
        <section className="relative w-full pt-12 pb-16 lg:pt-20 lg:pb-32 px-4 lg:px-12 border-b-4 border-bg-dark flex justify-center">
            <div className="max-w-[1600px] w-full mt-8 flex flex-col items-center">

                {/* The "Edition" header */}
                <div className="w-full flex justify-between items-end border-b-8 border-bg-dark pb-4 mb-12">
                    <div className="font-editorial text-5xl lg:text-8xl tracking-tighter uppercase text-bg-dark leading-none">
                        МИРОВОЙ<br />
                        <span className="text-accent">ЭКСКЛЮЗИВ</span>
                    </div>
                    <div className="hidden md:flex flex-col text-right">
                        <span className="font-bold text-lg uppercase tracking-widest text-[#B83A2D]">ВЫПУСК N° 01</span>
                        <span className="font-black text-sm uppercase opacity-50">КИНО И КУЛЬТУРА</span>
                    </div>
                </div>

                {/* The Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 w-full items-center">

                    {/* Visual */}
                    <div className="lg:col-span-5 relative group">
                        {/* Shadow block */}
                        <div className="absolute top-4 left-4 w-full h-full bg-[#B83A2D] border-4 border-bg-dark z-0 transition-transform group-hover:translate-x-2 group-hover:translate-y-2 duration-300" />

                        <Link href={`/anime/${movie.id}`} className="relative block z-10 w-full aspect-[2/3] border-4 border-bg-dark bg-bg-dark overflow-hidden transition-transform duration-300 group-hover:-translate-x-2 group-hover:-translate-y-2">
                            <BlurImage
                                src={posterUrl}
                                alt={movie.russian || movie.name}
                                fill
                                className="object-cover grayscale mix-blend-luminosity group-hover:grayscale-0 group-hover:mix-blend-normal transition-all duration-500"
                            />
                            {/* Score Tag */}
                            {movie.score > 0 && (
                                <div className="absolute top-0 right-0 bg-accent text-cream font-black text-2xl px-4 py-2 border-l-4 border-b-4 border-bg-dark">
                                    {movie.score}
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* Text / Article */}
                    <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
                        {/* Huge Abstract Title */}
                        <div className="relative">
                            <h2 className="font-editorial text-6xl lg:text-[7rem] leading-[0.85] tracking-tighter uppercase text-bg-dark break-words">
                                {movie.russian || movie.name}
                            </h2>
                        </div>

                        {/* Editorial Body */}
                        <div className="max-w-2xl text-lg lg:text-xl font-medium leading-relaxed opacity-90 border-l-4 border-accent pl-6">
                            <p>
                                В центре внимания — самые рейтинговые полнометражные релизы, лидирующие в мировых чартах.
                                Погрузитесь в историю, анимацию и культурное наследие этого шедевра.
                            </p>
                        </div>

                        {/* Metadata & Actions */}
                        <div className="flex flex-wrap items-center gap-4 pt-4 border-t-2 border-bg-dark/20 text-sm font-black tracking-widest uppercase">
                            <span className="bg-bg-dark text-cream px-4 py-2 border-2 border-bg-dark">
                                {movie.aired_on ? new Date(movie.aired_on).getFullYear() : 'TBA'}
                            </span>
                            <span className="border-2 border-bg-dark text-bg-dark px-4 py-2">
                                ПОЛНОМЕТРАЖНЫЙ ФИЛЬМ
                            </span>
                            {movie.episodes > 1 && (
                                <span className="border-2 border-bg-dark text-bg-dark px-4 py-2">
                                    {movie.episodes} ЭПИЗОДОВ
                                </span>
                            )}
                            <Link href={`/anime/${movie.id}`} className="hover:bg-accent hover:text-cream hover:border-accent text-accent border-2 border-accent px-6 py-2 transition-colors ml-auto">
                                ПОДРОБНЕЕ
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
