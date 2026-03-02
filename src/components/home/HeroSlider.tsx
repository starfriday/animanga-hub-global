"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Play, BookOpen, ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurImage } from '@/components/ui/BlurImage';
import { mockProjects } from '@/data/mockProjects';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return isMobile;
};

interface HeroSliderProps {
    trending?: any[];
}

export function HeroSlider({ trending }: HeroSliderProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [contentKey, setContentKey] = useState(0);
    const isMobile = useIsMobile();

    const featured = useMemo(() => {
        if (!trending || trending.length === 0) return mockProjects;

        return trending.map(anime => ({
            id: anime.id,
            title: anime.russian || anime.name,
            originalTitle: anime.name,
            description: `A brand new kind of experience. This title brings the world of ${anime.kind?.toUpperCase() || 'TV'} to life. Dive into the incredible story and join the community.`,
            image: anime.image?.original ? `https://shikimori.one${anime.image.original}` : '',
            banner: anime.image?.original ? `https://shikimori.one${anime.image.original}` : '',
            status: anime.status,
            studio_rating: parseFloat(anime.score) || 0,
            type: anime.kind === 'tv' ? 'Anime' : anime.kind === 'movie' ? 'Movie' : 'Anime',
            slug: anime.id.toString(),
            episodes: typeof anime.episodes === 'object' ? (anime.episodes?.number || anime.episodes?.toString() || '?') : (anime.episodes || '?')
        }));
    }, [trending]);

    const goTo = useCallback((index: number, dir: 'next' | 'prev') => {
        setDirection(dir);
        setActiveIndex(index);
        setContentKey(k => k + 1);
    }, []);

    useEffect(() => {
        if (featured.length === 0) return;
        const interval = setInterval(() => {
            goTo((activeIndex + 1) % featured.length, 'next');
        }, 8000);
        return () => clearInterval(interval);
    }, [featured.length, activeIndex, goTo]);

    const handleNext = () => goTo((activeIndex + 1) % featured.length, 'next');
    const handlePrev = () => goTo((activeIndex - 1 + featured.length) % featured.length, 'prev');

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
        <section className="relative w-full h-screen overflow-hidden bg-bg-cream text-bg-dark pt-20 selection:bg-accent selection:text-cream border-b-4 border-bg-dark">

            {/* GRID BACKGROUND (Retro Editorial touch) */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--color-bg-dark)" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* MASSIVE BACKGROUND TYPOGRAPHY */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-[1] select-none pointer-events-none mt-10">
                <div key={`title-${contentKey}`} className="animate-editorial-reveal flex flex-col items-center">
                    <h1 className="font-editorial text-[22vw] sm:text-[18vw] leading-[0.75] text-accent uppercase tracking-tighter whitespace-nowrap mix-blend-multiply opacity-90 drop-shadow-sm">
                        {current.title.split(' ')[0] || 'ANIME'}
                    </h1>
                    {current.title.split(' ').length > 1 && (
                        <h1 className="font-editorial text-[18vw] sm:text-[15vw] leading-[0.75] text-accent/80 uppercase tracking-tighter whitespace-nowrap mix-blend-multiply drop-shadow-sm" style={{ WebkitTextStroke: '2px var(--color-accent)', color: 'transparent' }}>
                            {current.title.split(' ').slice(1).join(' ')}
                        </h1>
                    )}
                </div>
            </div>

            {/* HEADER TAGS (Like Azuki top line) */}
            <div className="absolute top-24 left-0 w-full z-10 px-6 lg:px-12 flex justify-between items-start text-accent/80 font-bold uppercase tracking-widest textxs sm:text-sm">
                <div className="flex gap-4 sm:gap-8 items-center flex-wrap max-w-1/2">
                    <span className="flex items-center gap-2"><img src="/logo.png" alt="" className="w-5 h-5 object-contain" /> ANIVAULT</span>
                    <span className="hidden sm:inline">◇</span>
                    <span className="hover:text-accent cursor-pointer transition-colors">COLLECTION</span>
                    <span className="hidden sm:inline">◇</span>
                    <span className="hover:text-accent cursor-pointer transition-colors">WORLD</span>
                    <span className="hidden sm:inline">◇</span>
                    <span className="hover:text-accent cursor-pointer transition-colors">COMMUNITY</span>
                </div>
                <div className="text-right">
                    <div className="mb-1 text-accent">ORIGINAL</div>
                    <div className="text-xl sm:text-2xl font-editorial opacity-60 mix-blend-multiply tracking-widest">{((current as any).originalTitle || current.title).substring(0, 15)}</div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="relative w-full h-full max-w-[1800px] mx-auto px-6 lg:px-12 flex items-center justify-center z-20 pt-10">

                {/* LEFT EDITORIAL BLOCK */}
                <div className="absolute left-6 lg:left-12 bottom-32 lg:bottom-1/2 lg:translate-y-1/2 max-w-[280px] hidden md:block">
                    <div key={`desc-${contentKey}`} className="animate-fade-in-up">
                        <div className="text-[10rem] font-editorial text-accent leading-[0.7] opacity-20 absolute -top-20 -left-10 -z-10">0{activeIndex + 1}</div>
                        <h2 className="text-5xl font-editorial text-accent leading-[0.8] mb-6 uppercase tracking-tighter mix-blend-multiply">
                            ABOUT<br />US
                        </h2>
                        <p className="text-bg-dark font-serif text-sm leading-relaxed font-semibold border-l-2 border-accent pl-4 mb-8">
                            {current.description}
                        </p>
                        <Link
                            href={`/anime/${current.slug || current.id}`}
                            className="inline-flex items-center gap-3 px-8 py-3 border-2 border-accent text-accent font-black uppercase tracking-widest text-xs hover:bg-accent hover:text-cream transition-all group active:scale-95"
                        >
                            EXPLORE <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* CENTERED IMAGE COMPOSITION (like Azuki character art) */}
                <div key={contentKey} className="relative z-30 animate-pop-in">
                    <div className="relative w-[70vw] sm:w-[320px] lg:w-[420px] aspect-[4/5] bg-bg-dark p-2 sm:p-4 rotate-[-1deg] hover:rotate-0 transition-transform duration-700 shadow-2xl group">

                        <div className="w-full h-full relative overflow-hidden bg-bg-dark">
                            <BlurImage
                                src={current.image || current.banner}
                                alt={current.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90 group-hover:opacity-100"
                            />
                        </div>

                        {/* Vertical side text */}
                        <div className="absolute top-10 -left-6 sm:-left-10 bg-accent text-cream p-2 sm:p-3 shadow-lg transform -rotate-1">
                            <div className="font-editorial text-2xl sm:text-3xl writing-vertical-rl tracking-widest uppercase" style={{ writingMode: 'vertical-rl' }}>
                                シスターズ
                            </div>
                        </div>

                        {/* Top corner badge */}
                        <div className="absolute -top-4 -right-4 bg-green text-cream w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center rotate-12 shadow-lg rounded-full border-4 border-bg-cream">
                            <Star className="fill-cream mb-1" size={16} />
                            <span className="font-editorial text-xl sm:text-2xl leading-none">{current.studio_rating}</span>
                        </div>

                        {/* Action CTA Overlay */}
                        <Link
                            href={`/anime/${current.slug || current.id}`}
                            className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-accent text-cream px-8 sm:px-12 py-3 sm:py-4 font-black uppercase tracking-widest text-xs sm:text-sm whitespace-nowrap shadow-xl hover:bg-accent-hover active:scale-95 transition-all overflow-hidden border border-cream/20"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {isReading ? "Read Now" : "Watch Now"}
                                {isReading ? <BookOpen size={16} /> : <Play size={16} className="fill-current" />}
                            </span>
                            {/* Shiny effect */}
                            <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                        </Link>
                    </div>
                </div>

                {/* RIGHT INFO BLOCK (Mobile adapted) */}
                <div className="absolute right-6 lg:right-12 bottom-24 lg:bottom-1/2 lg:translate-y-1/2 text-right hidden lg:block max-w-[200px]">
                    <div key={`info-${contentKey}`} className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="mb-6 border-b-2 border-accent/20 pb-4">
                            <div className="text-secondary font-bold uppercase tracking-widest text-[10px] mb-1">Status</div>
                            <div className="font-black text-bg-dark uppercase tracking-widest">{current.status}</div>
                        </div>
                        <div className="mb-6 border-b-2 border-accent/20 pb-4">
                            <div className="text-secondary font-bold uppercase tracking-widest text-[10px] mb-1">Episodes</div>
                            <div className="font-editorial text-3xl text-accent">{current.episodes}</div>
                        </div>
                        <div>
                            <div className="text-secondary font-bold uppercase tracking-widest text-[10px] mb-1">Type</div>
                            <div className="font-black text-bg-dark uppercase tracking-widest">{current.type}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SLIDER NAVIGATION (Editorial Style) */}
            <div className="absolute bottom-6 sm:bottom-12 w-full px-6 lg:px-12 flex justify-between items-center z-30 pointer-events-none">
                <div className="flex gap-2 pointer-events-auto">
                    {featured.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i, i > activeIndex ? 'next' : 'prev')}
                            className={cn(
                                "h-1.5 transition-all duration-300 rounded-none",
                                i === activeIndex ? "w-12 bg-accent" : "w-4 bg-bg-dark/20 hover:bg-accent/50"
                            )}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>

                <div className="flex gap-2 pointer-events-auto">
                    <button
                        onClick={handlePrev}
                        className="p-3 border-2 border-bg-dark text-bg-dark hover:bg-bg-dark hover:text-cream transition-all active:scale-95"
                    >
                        <ChevronLeft size={20} strokeWidth={3} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="p-3 border-2 border-bg-dark text-bg-dark hover:bg-bg-dark hover:text-cream transition-all active:scale-95"
                    >
                        <ChevronRight size={20} strokeWidth={3} />
                    </button>
                </div>
            </div>

        </section>
    );
}
