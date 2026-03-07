"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { BlurImage } from '@/components/ui/BlurImage';
import { resolveAnimeImage } from '@/lib/imageUtils';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

interface MangaPulseGridProps {
    trending?: any[];
}

export function MangaPulseGrid({ trending }: MangaPulseGridProps) {
    const { ref: sectionRef, isVisible } = useScrollReveal(0.1);

    const cards = useMemo(() => {
        if (!trending || trending.length === 0) return [];
        return trending.slice(0, 12).map((anime, i) => {
            // Determine sizes based on index to create an asymmetrical manga grid look
            const isLarge = i === 0 || i === 7;
            const isWide = i === 3 || i === 10;

            return {
                id: anime.id,
                title: anime.russian || anime.name,
                image: resolveAnimeImage(anime),
                score: parseFloat(anime.score) || 0,
                year: anime.aired_on ? new Date(anime.aired_on).getFullYear() : 'TBA',
                episodes: anime.episodes || '?',
                isLarge,
                isWide,
            };
        });
    }, [trending]);

    if (cards.length === 0) return null;

    return (
        <section
            ref={sectionRef as any}
            className="w-full bg-bg-cream py-20 lg:py-32 relative border-b-8 border-bg-dark overflow-hidden"
        >
            {/* Background Details */}
            <div className="absolute top-0 left-0 w-full h-8 bg-bg-dark flex items-center overflow-hidden">
                <div className="marquee-track text-cream font-editorial uppercase tracking-widest text-sm">
                    {Array(10).fill("◆ ПУЛЬС ОНГОИНГОВ ").map((text, i) => <span key={i} className="mx-4">{text}</span>)}
                </div>
            </div>

            <div className="max-w-[1800px] mx-auto px-4 lg:px-8 mt-12">

                {/* Section Header */}
                <div className={cn(
                    "mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 transition-all duration-700",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}>
                    <div>
                        <h2 className="font-editorial text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-bg-dark leading-[0.8] mb-4">
                            ПУЛЬС<br />
                            <span className="text-accent text-border-thick">СЕЗОНА</span>
                        </h2>
                        <div className="w-24 h-4 bg-accent border-2 border-bg-dark shadow-solid-sm" />
                    </div>
                    <div className="bg-white p-4 border-4 border-bg-dark shadow-solid max-w-sm">
                        <p className="font-sans font-bold uppercase text-sm leading-snug">
                            Лучшие онгоинги и популярные сериалы, которые обсуждают прямо сейчас. Обновляется в реальном времени.
                        </p>
                    </div>
                </div>

                {/* Manga Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 auto-rows-[250px] lg:auto-rows-[300px]">
                    {cards.map((card, idx) => (
                        <Link
                            key={card.id}
                            href={`/anime/${card.id}`}
                            className={cn(
                                "group relative block border-4 border-bg-dark bg-bg-dark overflow-hidden transition-all duration-300 ease-[var(--transition-spring)] outline-none",
                                card.isLarge ? "col-span-2 row-span-2" : card.isWide ? "col-span-2 row-span-1" : "col-span-1 row-span-1",
                                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                            )}
                            style={{ transitionDelay: `${idx * 50}ms` }}
                        >
                            {/* Inner background to create border effect */}
                            <div className="absolute inset-0 bg-white m-[2px]">
                                <BlurImage
                                    src={card.image}
                                    alt={card.title}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 opacity-90 group-hover:opacity-100 group-hover:scale-105"
                                />
                                {/* Halftone Overlay on images for comic feel */}
                                <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay" style={{ backgroundImage: 'var(--background-dots)' }} />
                            </div>

                            {/* Hover info overlay */}
                            <div className="absolute inset-0 bg-bg-dark/80 p-6 flex flex-col justify-between translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[var(--transition-spring)]">
                                <div className="flex justify-between items-start">
                                    <div className="bg-accent text-cream px-3 py-1 border-2 border-bg-dark shadow-solid-sm font-editorial text-2xl">
                                        {card.score}
                                    </div>
                                    <ArrowUpRight size={32} strokeWidth={3} className="text-cream" />
                                </div>

                                <div>
                                    <div className="flex gap-2 mb-3">
                                        <span className="bg-white text-bg-dark px-2 py-1 font-bold text-xs uppercase border-2 border-bg-dark">{card.year}</span>
                                        <span className="bg-white text-bg-dark px-2 py-1 font-bold text-xs uppercase border-2 border-bg-dark">{card.episodes} ЭП</span>
                                    </div>
                                    <h3 className="font-editorial text-3xl lg:text-4xl uppercase text-cream leading-tight">
                                        {card.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Always visible label for smaller cards if needed, but styling prefers clean look or bottom bar */}
                            {!card.isLarge && !card.isWide && (
                                <div className="absolute bottom-0 left-0 w-full bg-white border-t-4 border-bg-dark p-2 group-hover:translate-y-full transition-transform duration-300">
                                    <p className="font-editorial text-lg leading-tight uppercase truncate">{card.title}</p>
                                </div>
                            )}
                        </Link>
                    ))}
                </div>

                {/* View All Button */}
                <div className="mt-16 flex justify-center">
                    <Link
                        href="/catalog?status=ongoing"
                        className="group relative inline-flex items-center justify-center bg-white text-bg-dark font-editorial text-3xl uppercase tracking-wider px-12 py-6 border-4 border-bg-dark shadow-solid-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all outline-none"
                    >
                        <span>ВСЕ ОНГОИНГИ</span>
                        <div className="absolute inset-0 border-2 border-bg-dark/20 pointer-events-none m-1 group-active:m-0 transition-all"></div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
