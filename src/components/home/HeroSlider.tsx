/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
    const padIndex = String(activeIndex + 1).padStart(2, '0');
    const padTotal = String(featured.length).padStart(2, '0');

    return (
        <section className="relative w-full min-h-screen overflow-hidden bg-bg-cream text-bg-dark pt-24 pb-12 selection:bg-accent selection:text-cream">

            {/* === AGED PAPER TEXTURE === */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.06] mix-blend-multiply"
                style={{ backgroundImage: 'var(--background-noise)', backgroundSize: '200px' }}
            />

            {/* === GRID BACKGROUND (Retro print registration marks) === */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.06]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="heroGrid" width="80" height="80" patternUnits="userSpaceOnUse">
                            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="var(--color-bg-dark)" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#heroGrid)" />
                </svg>
            </div>

            {/* === MASSIVE BACKGROUND TEXT (like vintage magazine title) === */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-[1] select-none pointer-events-none">
                <div key={`bg-title-${contentKey}`} className="animate-editorial-reveal">
                    <h1 className="font-editorial text-[20vw] sm:text-[16vw] leading-[0.75] text-accent/[0.07] uppercase tracking-tighter whitespace-nowrap mix-blend-multiply">
                        {current.title.split(' ')[0] || 'ANIME'}
                    </h1>
                </div>
            </div>

            {/* === DECORATIVE RED BORDER FRAME (magazine page frame) === */}
            <div className="absolute inset-4 sm:inset-6 lg:inset-8 border-2 border-accent/10 z-[1] pointer-events-none" />
            {/* Corner ornaments */}
            <div className="absolute top-4 sm:top-6 lg:top-8 left-4 sm:left-6 lg:left-8 w-5 h-5 border-accent/30 z-[2]">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-accent/30" />
                <div className="absolute top-0 left-0 h-full w-0.5 bg-accent/30" />
            </div>
            <div className="absolute top-4 sm:top-6 lg:top-8 right-4 sm:right-6 lg:right-8 w-5 h-5 z-[2]">
                <div className="absolute top-0 right-0 w-full h-0.5 bg-accent/30" />
                <div className="absolute top-0 right-0 h-full w-0.5 bg-accent/30" />
            </div>
            <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-6 lg:left-8 w-5 h-5 z-[2]">
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent/30" />
                <div className="absolute bottom-0 left-0 h-full w-0.5 bg-accent/30" />
            </div>
            <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 right-4 sm:right-6 lg:right-8 w-5 h-5 z-[2]">
                <div className="absolute bottom-0 right-0 w-full h-0.5 bg-accent/30" />
                <div className="absolute bottom-0 right-0 h-full w-0.5 bg-accent/30" />
            </div>

            {/* === HEADER EDITORIAL STRIP === */}
            <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-16">
                <div className="flex items-center justify-between border-b-4 border-bg-dark pb-3 mb-8">
                    <div className="flex items-center gap-3 sm:gap-6">
                        <span className="font-editorial text-xl sm:text-2xl uppercase tracking-tighter text-accent">ANIVAULT</span>
                        <span className="text-bg-dark/20">|</span>
                        <span className="font-bold uppercase tracking-[0.3em] text-[8px] sm:text-[10px] text-bg-dark/50">ЕЖЕМЕСЯЧНЫЙ ВЫПУСК</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="font-bold uppercase tracking-widest text-[8px] sm:text-[10px] text-bg-dark/40 hidden sm:inline">
                            №{padIndex} • 2024
                        </span>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent text-cream flex items-center justify-center font-editorial text-sm sm:text-lg">
                            特
                        </div>
                    </div>
                </div>
            </div>

            {/* === MAIN LAYOUT: MAGAZINE SPREAD === */}
            <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-16 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

                {/* LEFT COLUMN: Image as manga panel */}
                <div className="w-full lg:w-[55%] relative">
                    <div key={`img-${contentKey}`} className="animate-pop-in">
                        {/* Main image panel */}
                        <div className="relative bg-bg-dark border-4 border-bg-dark shadow-[8px_8px_0_var(--color-accent)] overflow-hidden">
                            <div className="aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] relative">
                                <BlurImage
                                    src={current.image || current.banner}
                                    alt={current.title}
                                    className="w-full h-full object-cover"
                                />
                                {/* Vintage grain overlay on image */}
                                <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
                                    style={{ backgroundImage: 'var(--background-noise)', backgroundSize: '128px' }}
                                />
                            </div>

                            {/* Red stamp seal */}
                            <div className="absolute top-6 right-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-[3px] border-accent/80 flex items-center justify-center rotate-[-12deg] opacity-80">
                                <div className="text-center leading-none">
                                    <div className="font-editorial text-accent text-lg sm:text-xl">推薦</div>
                                    <div className="text-accent/60 text-[7px] font-bold tracking-widest mt-0.5">РЕКОМЕНДАЦИЯ</div>
                                </div>
                            </div>

                            {/* Vertical side label */}
                            <div className="absolute left-0 top-0 bottom-0 w-10 bg-accent flex items-center justify-center">
                                <div className="font-editorial text-cream text-sm tracking-[0.5em] uppercase whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                                    {padIndex} — ANIVAULT
                                </div>
                            </div>
                        </div>

                        {/* Rating badge below image */}
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2 bg-accent text-cream px-4 py-2 border-2 border-bg-dark shadow-[3px_3px_0_var(--color-bg-dark)]">
                                <Star size={14} className="fill-cream" />
                                <span className="font-editorial text-xl">{current.studio_rating}</span>
                            </div>
                            <div className="flex-1 h-px bg-bg-dark/20" />
                            <span className="font-bold uppercase tracking-widest text-[9px] text-bg-dark/40">{current.type}</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Editorial text content */}
                <div className="w-full lg:w-[45%] flex flex-col">
                    <div key={`text-${contentKey}`} className="animate-fade-in-up">

                        {/* Issue number / Category */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="font-editorial text-7xl sm:text-8xl lg:text-9xl text-accent/15 leading-none tracking-tighter select-none">
                                {padIndex}
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="bg-accent text-cream px-3 py-1 text-[9px] font-black uppercase tracking-widest border border-accent">
                                    {current.status}
                                </span>
                                <span className="text-bg-dark/40 font-bold uppercase tracking-[0.2em] text-[9px]">
                                    {current.type}
                                </span>
                            </div>
                        </div>

                        {/* Main Title (magazine headline) */}
                        <h2 className="font-editorial text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-bg-dark uppercase tracking-tighter leading-[0.85] mb-2">
                            {current.title}
                        </h2>

                        {/* Original title */}
                        <p className="font-serif italic text-bg-dark/40 text-sm sm:text-base mb-8 border-b-2 border-bg-dark/10 pb-6">
                            {(current as any).originalTitle || current.title}
                        </p>

                        {/* Description block with red left border */}
                        <div className="border-l-4 border-accent pl-5 mb-8">
                            <p className="font-serif text-bg-dark/70 leading-relaxed text-sm sm:text-base">
                                Погрузитесь в невероятную историю, которая завоевала сердца миллионов зрителей по всему миру.
                                Откройте для себя мир, где каждый кадр — произведение искусства.
                            </p>
                        </div>

                        {/* Info grid (magazine fact box) */}
                        <div className="grid grid-cols-3 gap-0 border-2 border-bg-dark mb-8">
                            <div className="p-3 sm:p-4 border-r-2 border-bg-dark text-center">
                                <div className="text-[8px] font-black uppercase tracking-widest text-bg-dark/40 mb-1">Рейтинг</div>
                                <div className="font-editorial text-2xl sm:text-3xl text-accent">{current.studio_rating}</div>
                            </div>
                            <div className="p-3 sm:p-4 border-r-2 border-bg-dark text-center">
                                <div className="text-[8px] font-black uppercase tracking-widest text-bg-dark/40 mb-1">Эпизоды</div>
                                <div className="font-editorial text-2xl sm:text-3xl text-bg-dark">{current.episodes}</div>
                            </div>
                            <div className="p-3 sm:p-4 text-center">
                                <div className="text-[8px] font-black uppercase tracking-widest text-bg-dark/40 mb-1">Год</div>
                                <div className="font-editorial text-2xl sm:text-3xl text-bg-dark">{(current as any).year || '2024'}</div>
                            </div>
                        </div>

                        {/* CTA buttons */}
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={`/anime/${current.slug || current.id}`}
                                className="group flex items-center gap-3 bg-accent text-cream px-8 py-4 font-black uppercase tracking-widest text-xs border-2 border-bg-dark shadow-[4px_4px_0_var(--color-bg-dark)] hover:shadow-[2px_2px_0_var(--color-bg-dark)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:shadow-none active:translate-x-1 active:translate-y-1"
                            >
                                {isReading ? <BookOpen size={16} /> : <Play size={16} className="fill-current" />}
                                {isReading ? 'ЧИТАТЬ' : 'СМОТРЕТЬ'}
                            </Link>
                            <Link
                                href={`/anime/${current.slug || current.id}`}
                                className="group flex items-center gap-3 bg-bg-cream text-bg-dark px-8 py-4 font-black uppercase tracking-widest text-xs border-2 border-bg-dark shadow-[4px_4px_0_var(--color-bg-dark)] hover:shadow-[2px_2px_0_var(--color-bg-dark)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:shadow-none active:translate-x-1 active:translate-y-1"
                            >
                                ПОДРОБНЕЕ
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* === BOTTOM: Slider navigation (editorial page numbers) === */}
            <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-16 mt-12">
                <div className="flex items-center justify-between border-t-4 border-bg-dark pt-4">
                    {/* Page dots */}
                    <div className="flex items-center gap-3">
                        {featured.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={cn(
                                    "font-editorial text-lg transition-all duration-300 outline-none",
                                    i === activeIndex
                                        ? "text-accent underline underline-offset-4 decoration-2"
                                        : "text-bg-dark/20 hover:text-bg-dark/50"
                                )}
                            >
                                {String(i + 1).padStart(2, '0')}
                            </button>
                        ))}
                    </div>

                    {/* Navigation arrows */}
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={isTransitioning}
                            className="p-3 border-2 border-bg-dark text-bg-dark hover:bg-bg-dark hover:text-cream transition-all active:scale-95 shadow-[2px_2px_0_var(--color-bg-dark)] hover:shadow-none"
                        >
                            <ChevronLeft size={18} strokeWidth={3} />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={isTransitioning}
                            className="p-3 border-2 border-bg-dark text-bg-dark hover:bg-bg-dark hover:text-cream transition-all active:scale-95 shadow-[2px_2px_0_var(--color-bg-dark)] hover:shadow-none"
                        >
                            <ChevronRight size={18} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>

            {/* === DECORATIVE: Vertical Japanese text (side of page) === */}
            <div className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-[2] pointer-events-none select-none hidden xl:block">
                <div className="font-editorial text-8xl text-accent/[0.06] tracking-widest" style={{ writingMode: 'vertical-rl' }}>
                    アニメの世界
                </div>
            </div>

        </section>
    );
}
