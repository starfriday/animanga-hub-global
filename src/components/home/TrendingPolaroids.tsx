/* eslint-disable @typescript-eslint/no-explicit-any */
 
"use client";

import React, { useMemo, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurImage } from '@/components/ui/BlurImage';
import { resolveAnimeImage } from '@/lib/imageUtils';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface TrendingPolaroidsProps {
    trending?: any[];
}

const TAPE_COLORS = ['#b83a2d', '#c44a3d', '#a83020', '#d45040', '#b83a2d'];

export function TrendingPolaroids({ trending }: TrendingPolaroidsProps) {
    const { ref: sectionRef, isVisible } = useScrollReveal(0.1);
    const scrollRef = useRef<HTMLDivElement>(null);

    const polaroids = useMemo(() => {
        if (!trending || trending.length === 0) return [];
        return trending.map((anime, i) => ({
            id: anime.id,
            title: anime.russian || anime.name,
            image: resolveAnimeImage(anime),
            score: parseFloat(anime.score) || 0,
            kind: anime.kind === 'tv' ? 'TV' : anime.kind === 'movie' ? 'MOVIE' : (anime.kind || '').toUpperCase(),
            rotation: [-4, 3, -2, 5, -3, 2, -4.5, 3.5, -1.5, 4, -3, 2.5, -2, 5, -3.5, 1, -4, 3, -2.5, 4.5][i % 20],
            tapeRotate: [-15, 12, -8, 18, -12, 10, -14, 8, -10, 16][i % 10],
            tapeLeft: [20, 15, 30, 25, 10, 35, 18, 22, 12, 28][i % 10],
        }));
    }, [trending]);

    const scroll = (dir: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir * 500, behavior: 'smooth' });
        }
    };

    if (polaroids.length === 0) return null;

    return (
        <section
            ref={sectionRef as any}
            className="relative w-full bg-[#f5ead6] py-16 md:py-24 overflow-hidden"
        >
            {/* Halftone dots */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(circle, #1a1a1a 1px, transparent 1px)`, backgroundSize: '6px 6px' }}
            />

            <div className="max-w-[1600px] mx-auto px-6 md:px-16">
                {/* Section header with scroll controls */}
                <div className={cn(
                    "flex items-end justify-between mb-10 md:mb-14 transition-all duration-700",
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                )}>
                    <div>
                        <h2 className="font-editorial text-5xl md:text-7xl uppercase tracking-tighter text-[#1a1411]"
                            style={{ textShadow: '2px 2px 0 rgba(184,58,45,0.2)' }}>
                            TRENDING <span className="text-[#b83a2d]">NOW</span>
                        </h2>
                        <div className="w-16 h-1 bg-[#b83a2d] mt-3" />
                        <p className="text-xs font-bold uppercase tracking-widest text-[#1a1411]/40 mt-2">Сейчас в эфире • самые популярные онгоинги</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll(-1)}
                            className="p-3 border-2 border-[#1a1411]/20 text-[#1a1411]/50 hover:border-[#b83a2d] hover:text-[#b83a2d] transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll(1)}
                            className="p-3 border-2 border-[#1a1411]/20 text-[#1a1411]/50 hover:border-[#b83a2d] hover:text-[#b83a2d] transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Horizontal scroll of polaroids */}
                <div
                    ref={scrollRef}
                    className="flex gap-5 md:gap-7 overflow-x-auto scrollbar-hide pb-6 snap-x snap-mandatory -mx-2 px-2"
                >
                    {polaroids.map((p, i) => (
                        <Link
                            key={p.id}
                            href={`/anime/${p.id}`}
                            className={cn(
                                "group relative flex-shrink-0 snap-start transition-all duration-500 ease-out",
                                "w-[150px] md:w-[175px] lg:w-[190px]",
                                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
                            )}
                            style={{
                                transitionDelay: `${100 + i * 50}ms`,
                                transform: isVisible ? `rotate(${p.rotation}deg)` : `rotate(${p.rotation}deg) translateY(40px)`,
                            }}
                        >
                            {/* Red tape strip */}
                            <div
                                className="absolute z-10 w-11 h-3.5 md:w-12 md:h-4 opacity-80"
                                style={{
                                    top: '-5px',
                                    left: `${p.tapeLeft}%`,
                                    backgroundColor: TAPE_COLORS[i % 5],
                                    transform: `rotate(${p.tapeRotate}deg)`,
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                                }}
                            />

                            {/* Polaroid frame */}
                            <div className={cn(
                                "bg-white p-1.5 pb-8 md:p-2 md:pb-10 shadow-[3px_3px_10px_rgba(0,0,0,0.15)]",
                                "group-hover:shadow-[5px_7px_18px_rgba(0,0,0,0.25)] group-hover:-translate-y-2",
                                "transition-all duration-300"
                            )}>
                                {/* Photo */}
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    <BlurImage
                                        src={p.image}
                                        alt={p.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        style={{ filter: 'saturate(0.9) contrast(1.05)' }}
                                    />
                                    <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.15)]" />

                                    {/* Score badge */}
                                    <div className="absolute top-1.5 left-1.5 bg-[#b83a2d] text-white text-[9px] font-black px-1.5 py-0.5 border border-[#1a1411]/30">
                                        ★ {p.score.toFixed(1)}
                                    </div>
                                </div>

                                {/* Caption */}
                                <div className="absolute bottom-1.5 left-2.5 right-2.5 md:bottom-2 md:left-3 md:right-3">
                                    <p className="font-black text-[8px] md:text-[9px] uppercase tracking-wide text-[#1a1411] leading-tight line-clamp-2">
                                        {p.title}
                                    </p>
                                    <p className="text-[7px] text-[#1a1411]/35 font-bold mt-0.5 uppercase">
                                        {p.kind} • ОНГОИНГ
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
