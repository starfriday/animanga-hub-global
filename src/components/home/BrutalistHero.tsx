"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, TrendingUp, ChevronLeft, ChevronRight, Hash, Star } from 'lucide-react';
import { resolveAnimeImage } from '@/lib/imageUtils';
import { cn } from '@/lib/utils';

export function BrutalistHero({ trending }: { trending: any[] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Auto cycle
    useEffect(() => {
        if (!trending || trending.length <= 1) return;
        const interval = setInterval(() => {
            nextSlide(true);
        }, 8000);
        return () => clearInterval(interval);
    }, [activeIndex, trending]);

    const featuredAnime = trending?.[activeIndex];

    const nextSlide = (auto = false) => {
        if (isAnimating || !trending || trending.length <= 1) return;
        setIsAnimating(true);
        setActiveIndex((prev) => (prev + 1) % trending.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const prevSlide = () => {
        if (isAnimating || !trending || trending.length <= 1) return;
        setIsAnimating(true);
        setActiveIndex((prev) => (prev - 1 + trending.length) % trending.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    if (!featuredAnime) return null;

    return (
        <section className="relative w-full min-h-[100vh] bg-bg-dark text-cream overflow-hidden pt-[72px] lg:pt-[88px] flex flex-col justify-between">
            {/* Grid & Noise Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-screen" style={{ backgroundImage: 'var(--background-grid)' }} />
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-screen" style={{ backgroundImage: 'var(--background-noise)' }} />

            <div className="flex-1 w-full max-w-[1920px] mx-auto flex flex-col lg:flex-row relative z-10">

                {/* Left: Giant Typography & Data */}
                <div className="w-full lg:w-[60%] flex flex-col justify-center p-6 lg:p-12 xl:p-16 relative z-20">

                    {/* Top Meta */}
                    <div className="flex flex-wrap items-start gap-4 lg:gap-8 font-mono text-sm uppercase tracking-widest text-secondary-muted mb-8 lg:mb-16">
                        <div className="flex flex-col border-l-4 border-accent pl-3">
                            <span className="text-[10px] text-accent font-bold">СЕРИАЛЫ</span>
                            <span className="text-white">ТОП В ТРЕНДЕ</span>
                        </div>
                        <div className="flex flex-col border-l-4 border-secondary pl-3">
                            <span className="text-[10px] text-secondary font-bold">РЕЙТИНГ</span>
                            <span className="text-white flex items-center gap-1 font-bold">
                                <Star size={14} className="text-cream fill-cream" /> {featuredAnime.score || 'N/A'}
                            </span>
                        </div>
                        <div className="flex flex-col border-l-4 border-secondary pl-3">
                            <span className="text-[10px] text-secondary font-bold">ИНДЕКС</span>
                            <span className="text-white flex items-center gap-1 font-bold">
                                <Hash size={14} /> {activeIndex + 1} / {trending?.length || 0}
                            </span>
                        </div>
                    </div>

                    {/* Massive Title Area */}
                    <div className={cn(
                        "transition-all duration-500 transform relative z-20",
                        isAnimating ? 'opacity-0 -translate-x-8' : 'opacity-100 translate-x-0'
                    )}>
                        <div className="mb-6 inline-block bg-cream text-bg-dark px-4 py-2 font-bold text-xs lg:text-sm uppercase tracking-widest outline outline-2 outline-bg-cream outline-offset-0 border-2 border-bg-dark shadow-[4px_4px_0px_var(--color-accent)]">
                            {featuredAnime.status === 'released' ? 'ВЫПУЩЕНО' : 'ОНГОИНГ'} • {featuredAnime.kind?.toUpperCase() || 'ТВ'}
                        </div>

                        <h1
                            className="font-editorial text-6xl md:text-8xl lg:text-[8rem] xl:text-[9.5rem] leading-[0.85] uppercase tracking-tighter text-cream mb-4 drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]"
                        >
                            {featuredAnime.russian || featuredAnime.name}
                        </h1>

                        {/* Original English Name Outline */}
                        <div className="font-editorial text-3xl md:text-5xl lg:text-6xl uppercase tracking-widest text-transparent opacity-30 mb-8" style={{ WebkitTextStroke: '1px var(--color-cream)' }}>
                            {featuredAnime.name}
                        </div>

                        <p className="font-sans text-base md:text-lg lg:text-xl text-secondary-muted max-w-2xl border-l-4 border-accent pl-6 mb-12 leading-relaxed bg-bg-dark/50 p-4">
                            {featuredAnime.description?.replace(/\[.*?\]/g, '').substring(0, 180)}...
                        </p>
                    </div>

                    {/* Controls & CTA */}
                    <div className={cn(
                        "flex flex-wrap items-center gap-4 lg:gap-8 mt-4 lg:mt-auto relative z-30 transition-all duration-500 delay-100",
                        isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                    )}>
                        <Link
                            href={`/anime/${featuredAnime.id}`}
                            className="group relative flex items-center justify-center gap-4 bg-accent text-cream font-editorial text-2xl lg:text-3xl uppercase tracking-wider px-8 py-5 md:px-12 md:py-6 border-4 border-bg-dark outline outline-2 outline-accent outline-offset-2 hover:bg-cream hover:text-bg-dark hover:outline-cream hover:shadow-none transition-all outline-none w-max"
                            style={{ boxShadow: '8px 8px 0px var(--color-bg-cream)' }}
                        >
                            <span className="relative z-10 transition-transform group-hover:translate-x-1">СМОТРЕТЬ СЕЙЧАС</span>
                            <Play size={28} className="fill-current relative z-10 transition-transform group-hover:scale-125" />
                        </Link>

                        <div className="flex gap-4 items-center">
                            <button
                                onClick={prevSlide}
                                className="w-16 h-16 md:w-20 md:h-20 bg-bg-dark border-4 border-secondary-muted text-secondary-muted flex items-center justify-center hover:bg-cream hover:text-bg-dark hover:border-cream transition-colors active:scale-95"
                            >
                                <ChevronLeft size={36} strokeWidth={3} />
                            </button>
                            <button
                                onClick={() => nextSlide(false)}
                                className="w-16 h-16 md:w-20 md:h-20 bg-bg-dark border-4 border-cream text-cream flex items-center justify-center hover:bg-accent hover:text-cream hover:border-accent transition-colors active:scale-95"
                                style={{ boxShadow: '4px 4px 0px var(--color-bg-cream)' }}
                            >
                                <ChevronRight size={36} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Absolute Giant Poster Image */}
                <div className="w-full lg:w-[40%] flex items-center justify-center p-6 lg:p-12 xl:p-20 relative z-10 min-h-[50vh]">

                    {/* Background abstract element (Glow) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square bg-accent rounded-full blur-[120px] opacity-[0.15] pointer-events-none mix-blend-screen" />

                    <div className={cn(
                        "relative w-full max-w-[400px] xl:max-w-[450px] aspect-[3/4] border-[12px] md:border-[16px] border-cream bg-bg-dark flex flex-col group transition-all duration-700 ease-[var(--transition-spring)]",
                        isAnimating ? "opacity-0 scale-90 translate-x-16 rotate-12" : "opacity-100 scale-100 translate-x-0 rotate-3 hover:rotate-0 hover:scale-[1.02]"
                    )} style={{ boxShadow: '20px 20px 0px var(--color-accent)' }}>

                        {/* Image Header Tape */}
                        <div className="h-10 md:h-12 bg-cream border-b-8 border-bg-dark flex items-center px-2 overflow-hidden shrink-0">
                            <div className="marquee-track text-bg-dark font-mono text-xs md:text-sm font-bold uppercase tracking-widest flex items-center">
                                {Array(5).fill(`${featuredAnime.status === 'released' ? 'ЗАВЕРШЕНО' : 'ОНГОИНГ'} // ${featuredAnime.score} // `).map((t, i) => <span key={i} className="mx-2 shrink-0">{t}</span>)}
                            </div>
                        </div>

                        {/* Actual Image */}
                        <div className="relative w-full flex-1 overflow-hidden bg-bg-dark">
                            {resolveAnimeImage(featuredAnime) && (
                                <Image
                                    src={resolveAnimeImage(featuredAnime)}
                                    alt={featuredAnime.name}
                                    fill
                                    unoptimized
                                    className="object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                                    priority
                                />
                            )}
                            <div className="absolute inset-0 bg-accent mix-blend-overlay opacity-60 group-hover:opacity-0 transition-opacity duration-700 pointer-events-none" />

                            {/* Inner grain */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'var(--background-noise)' }} />

                            {/* Inner Brutalist Frame */}
                            <div className="absolute m-4 inset-0 border-2 border-cream/50 pointer-events-none" />
                        </div>

                    </div>
                </div>
            </div>

            {/* Bottom Giant Ticker */}
            <div className="w-full relative z-30 flex flex-col mt-12 lg:mt-0">
                {/* Red Ticker */}
                <div className="w-[105%] -ml-[2.5%] bg-accent text-bg-cream border-y-8 border-bg-dark py-4 overflow-hidden transform relative shadow-[0_-15px_40px_rgba(230,0,18,0.25)] z-20">
                    <div className="marquee-track font-editorial text-4xl lg:text-5xl uppercase tracking-widest flex items-center whitespace-nowrap">
                        {Array(8).fill("АНИМЕ ПРЕМИУМ СЕГМЕНТА ✦ ").map((t, i) => <span key={i} className="mx-6 text-cream">{t}</span>)}
                    </div>
                </div>
            </div>

        </section>
    );
}
