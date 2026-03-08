"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Star, Calendar, Clock } from 'lucide-react';
import { WorldMovie } from './constants';

interface WorldHeroProps {
    movie: WorldMovie;
}

export function WorldHero({ movie }: WorldHeroProps) {
    if (!movie) return null;

    const posterUrl = `https://shikimori.one${movie.image?.original}`;

    return (
        <section className="relative w-full min-h-[85vh] flex items-end pb-24 pt-32 px-4 lg:px-12 overflow-hidden group">
            {/* Background Image with blur and gradient overlay */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <Image
                    src={posterUrl}
                    alt={movie.russian || movie.name}
                    fill
                    unoptimized
                    referrerPolicy="no-referrer"
                    className="object-cover scale-105 group-hover:scale-110 transition-transform duration-[10s] ease-out opacity-40"
                    priority
                />
                {/* Gradient Masks */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-cream via-bg-cream/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-bg-cream via-bg-cream/60 to-transparent" />
            </div>

            <div className="max-w-[1600px] w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">

                {/* Content Section */}
                <div className="lg:col-span-8 flex flex-col justify-end space-y-8">
                    {/* Badge */}
                    <div className="flex items-center gap-3 w-fit">
                        <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent rounded-full text-xs font-bold tracking-wide backdrop-blur-md">
                            Выбор редакции
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-bg-dark leading-tight drop-shadow-sm">
                        {movie.russian || movie.name}
                    </h1>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-bg-dark/70">
                        {(movie.score || 0) > 0 && (
                            <div className="flex items-center gap-1.5 text-accent">
                                <Star size={16} fill="currentColor" />
                                <span className="text-bg-dark font-bold">{movie.score}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <Calendar size={16} className="text-bg-dark/40" />
                            <span>{movie.aired_on ? new Date(movie.aired_on).getFullYear() : 'TBA'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={16} className="text-bg-dark/40" />
                            <span>Полнометражное</span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="max-w-3xl text-lg lg:text-xl text-bg-dark/60 leading-relaxed font-medium line-clamp-3">
                        Кураторская подборка высшего качества. Глобальный архив подтверждает исключительную ценность данного произведения в системе мирового кинематографа. Откройте для себя шедевры анимации.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-4 pt-4">
                        <Link
                            href={`/anime/${movie.id}`}
                            className="group/btn flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20 outline-none"
                        >
                            <Play size={20} fill="currentColor" />
                            <span>Смотреть</span>
                        </Link>

                        <button className="px-8 py-4 bg-bg-dark/5 text-bg-dark border border-bg-dark/10 rounded-full font-bold text-lg hover:bg-bg-dark/10 hover:scale-105 active:scale-95 transition-all outline-none">
                            Подробнее
                        </button>
                    </div>
                </div>

                {/* Cover Image (Desktop only) */}
                <div className="hidden lg:block lg:col-span-4 relative">
                    <div className="relative w-[300px] xl:w-[350px] aspect-[2/3] ml-auto rounded-2xl overflow-hidden shadow-2xl shadow-bg-dark/20 border border-bg-dark/5 group-hover:-translate-y-4 group-hover:rotate-2 transition-all duration-700 ease-out">
                        <Image
                            src={posterUrl}
                            alt={movie.russian || movie.name}
                            fill
                            unoptimized
                            referrerPolicy="no-referrer"
                            className="object-cover"
                            sizes="350px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                </div>

            </div>
        </section>
    );
}
