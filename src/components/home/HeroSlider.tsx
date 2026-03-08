/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Play, BookOpen, ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurImage } from '@/components/ui/BlurImage';
import { resolveAnimeImage } from '@/lib/imageUtils';

interface HeroSliderProps {
    trending?: any[];
}

export function HeroSlider({ trending }: HeroSliderProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [contentKey, setContentKey] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const featured = useMemo(() => {
        if (!trending || trending.length === 0) return [];

        return trending.slice(0, 5).map(anime => {
            const imageUrl = resolveAnimeImage(anime);
            return {
                id: anime.id,
                title: anime.russian || anime.name,
                originalTitle: anime.name,
                image: imageUrl,
                banner: imageUrl,
                status: anime.status === 'ongoing' ? 'ОНГОИНГ' : anime.status === 'released' ? 'ВЫШЕЛ' : 'АНОНС',
                studio_rating: parseFloat(anime.score) || 0,
                type: anime.kind === 'tv' ? 'TV Сериал' : anime.kind === 'movie' ? 'Фильм' : 'Аниме',
                slug: anime.id.toString(),
                episodes: typeof anime.episodes === 'object' ? (anime.episodes?.number || '?') : (anime.episodes || '?'),
                year: anime.aired_on ? new Date(anime.aired_on).getFullYear() : 2024
            };
        });
    }, [trending]);

    const goTo = useCallback((index: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setActiveIndex(index);
        setContentKey(k => k + 1);
        setTimeout(() => setIsTransitioning(false), 700);
    }, [isTransitioning]);

    useEffect(() => {
        if (featured.length === 0) return;
        const interval = setInterval(() => {
            goTo((activeIndex + 1) % featured.length);
        }, 7000);
        return () => clearInterval(interval);
    }, [featured.length, activeIndex, goTo]);

    const handleNext = () => goTo((activeIndex + 1) % featured.length);
    const handlePrev = () => goTo((activeIndex - 1 + featured.length) % featured.length);

    if (featured.length === 0) {
        return (
            <div className="h-screen bg-bg-cream flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-accent/30 border-t-accent animate-spin" />
            </div>
        );
    }

    const current = featured[activeIndex];
    const isReading = ['Manga', 'Novel', 'Comics'].includes(current.type);

    return (
        <section className="relative w-full min-h-[90svh] flex items-center justify-center overflow-hidden bg-bg-cream text-bg-dark pt-24 pb-24 selection:bg-accent selection:text-white group">

            {/* Background Image with blur and gradient overlay */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none bg-bg-cream">
                <div key={`bg-${contentKey}`} className="absolute inset-0 animate-fade-in">
                    <BlurImage
                        src={current.banner || ''}
                        alt=""
                        className="object-cover w-full h-full opacity-25 contrast-110 saturate-100 transform scale-105 group-hover:scale-110 transition-transform duration-[10s] ease-out line-clamp-2"
                    />
                </div>
                {/* Gradient Masks */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-cream via-bg-cream/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-bg-cream via-bg-cream/60 to-transparent" />
            </div>

            <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                {/* Left Column Text Content */}
                <div className="lg:col-span-7 flex flex-col justify-center space-y-6 lg:space-y-8 z-10">
                    <div key={`text-${contentKey}`} className="animate-fade-in-up flex flex-col gap-6">

                        {/* Top Metadata */}
                        <div className="flex flex-wrap items-center gap-3 text-[10px] sm:text-xs font-bold text-accent uppercase tracking-widest">
                            <span className="px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full backdrop-blur-md">
                                {current.status}
                            </span>
                            <span className="px-3 py-1.5 bg-black/5 text-bg-dark/70 rounded-full backdrop-blur-md border border-black/5">
                                {current.type}
                            </span>
                            <span className="text-bg-dark/50 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-bg-dark/30" />
                                {current.year}
                            </span>
                        </div>

                        {/* Title */}
                        <h1
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] font-black text-bg-dark leading-[1.1] drop-shadow-sm tracking-tight line-clamp-3"
                            title={current.title}
                        >
                            {current.title}
                        </h1>

                        {/* Original Title & Info */}
                        <div className="space-y-4">
                            <p className="text-lg md:text-xl text-bg-dark/50 font-medium italic">
                                {(current as any).originalTitle || current.title}
                            </p>

                            <div className="flex items-center gap-4 text-bg-dark/70 font-medium text-sm sm:text-base">
                                <div className="flex items-center gap-1.5 bg-white shadow-sm border border-bg-dark/10 text-bg-dark px-3 py-1.5 rounded-xl">
                                    <Star size={16} className="fill-accent text-accent" />
                                    <span className="font-bold">{current.studio_rating}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-bg-dark/20" />
                                    <span>{current.episodes} Эпизодов</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm sm:text-base md:text-lg text-bg-dark/70 leading-relaxed max-w-2xl line-clamp-3 md:line-clamp-4">
                            Погрузитесь в невероятную историю, которая завоевала сердца миллионов зрителей по всему миру.
                            Откройте для себя аниме-шедевры с потрясающей рисовкой и захватывающим сюжетом.
                        </p>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            <Link
                                href={`/anime/${current.slug || current.id}`}
                                className="group/btn flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-accent text-white rounded-full font-bold text-sm sm:text-lg hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20 outline-none"
                            >
                                {isReading ? <BookOpen size={20} /> : <Play size={20} className="fill-current" />}
                                <span>{isReading ? 'ЧИТАТЬ' : 'СМОТРЕТЬ'}</span>
                            </Link>

                            <Link
                                href={`/anime/${current.slug || current.id}`}
                                className="group/btn flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-bg-dark hover:bg-black/5 border border-bg-dark/10 shadow-sm rounded-full font-bold text-sm sm:text-lg transition-all active:scale-95 outline-none"
                            >
                                <span>ПОДРОБНЕЕ</span>
                                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Column Cover Image - Desktop Only */}
                <div className="hidden lg:block lg:col-span-5 relative">
                    <div key={`img-${contentKey}`} className="animate-pop-in relative w-[280px] xl:w-[340px] aspect-[3/4] ml-auto rounded-[2rem] overflow-hidden shadow-brutal-dark-xl border border-bg-dark/10 group-hover:-translate-y-2 transition-all duration-700 ease-out">
                        <BlurImage
                            src={current.image || current.banner}
                            alt={current.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        {/* Recommendation Badge overlay */}
                        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-black/10 shadow-sm flex flex-col items-center justify-center transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300 pointer-events-none">
                            <span className="text-accent text-lg font-black tracking-tight leading-none mb-0.5">TOP</span>
                            <span className="text-bg-dark/60 text-[9px] font-bold uppercase tracking-widest leading-none">Релизы</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Slider Navigation Controls */}
            <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 z-20">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between">
                    {/* Pagination Dots */}
                    <div className="flex items-center gap-2">
                        {featured.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300 outline-none",
                                    i === activeIndex
                                        ? "w-8 sm:w-10 bg-accent shadow-sm shadow-accent/30"
                                        : "w-2 bg-bg-dark/20 hover:bg-bg-dark/40"
                                )}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Prev / Next Buttons */}
                    <div className="flex gap-2 sm:gap-3">
                        <button
                            onClick={handlePrev}
                            disabled={isTransitioning}
                            className="p-3 sm:p-4 rounded-full bg-white text-bg-dark border border-bg-dark/10 hover:border-accent hover:text-accent shadow-sm transition-all active:scale-95 disabled:opacity-50 outline-none"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={isTransitioning}
                            className="p-3 sm:p-4 rounded-full bg-white text-bg-dark border border-bg-dark/10 hover:border-accent hover:text-accent shadow-sm transition-all active:scale-95 disabled:opacity-50 outline-none"
                            aria-label="Next slide"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

        </section>
    );
}
