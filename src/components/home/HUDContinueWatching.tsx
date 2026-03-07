"use client";

import React, { useRef, useMemo } from 'react';
import Link from 'next/link';
import { BlurImage } from '@/components/ui/BlurImage';
import { resolveAnimeImage } from '@/lib/imageUtils';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';

interface HUDContinueWatchingProps {
    upcoming?: any[];
}

export function HUDContinueWatching({ upcoming }: HUDContinueWatchingProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { ref: sectionRef, isVisible } = useScrollReveal(0.1);

    const announcements = useMemo(() => {
        if (!upcoming || upcoming.length === 0) return [];
        return upcoming.map(anime => ({
            id: anime.id,
            title: anime.russian || anime.name,
            originalTitle: anime.name,
            image: resolveAnimeImage(anime),
            kind: anime.kind === 'tv' ? 'ТВ' : anime.kind === 'movie' ? 'ФИЛЬМ' : anime.kind === 'ova' ? 'OVA' : anime.kind === 'ona' ? 'ONA' : (anime.kind || '').toUpperCase(),
            date: anime.aired_on ? new Date(anime.aired_on).toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' }).toUpperCase() : 'TBA',
        }));
    }, [upcoming]);

    if (announcements.length === 0) return null;

    return (
        <section
            ref={sectionRef as any}
            className="w-full bg-bg-dark py-24 md:py-32 relative border-b-8 border-bg-cream overflow-hidden"
        >
            {/* Industrial HUD Background Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'var(--background-grid)' }} />
            <div className="absolute top-10 left-10 text-secondary-muted font-mono text-xs hidden md:block select-none pointer-events-none">
                СИС.МОНИТОР // {new Date().toISOString()}<br />
                СТАТУС: ОНЛАЙН<br />
                <span className="text-green opacity-50 animate-pulse">РАСПИСАНИЕ_ОБНОВЛЕНО</span>
            </div>

            <div className="max-w-[1800px] mx-auto px-4 lg:px-8">
                {/* Header */}
                <div className={cn(
                    "flex flex-col mb-16 transition-all duration-700",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-8 h-8 bg-green border-2 border-green shadow-[0_0_15px_var(--color-green)] animate-pulseHard" />
                        <span className="font-editorial text-3xl text-green tracking-widest uppercase">СКОРО В СИСТЕМЕ</span>
                    </div>
                    <h2 className="font-editorial text-6xl md:text-8xl lg:text-9xl text-cream uppercase tracking-tighter leading-[0.8] mix-blend-difference">
                        <span className="text-border-light block">ANIVAULT</span>
                    </h2>
                </div>

                {/* Horizontal scroll of HUD Cards */}
                <div
                    ref={scrollRef}
                    className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide pb-12 snap-x snap-mandatory px-4 md:px-0 -mx-4 md:mx-0"
                >
                    {announcements.map((a, i) => (
                        <Link
                            key={a.id}
                            href={`/anime/${a.id}`}
                            className={cn(
                                "group relative flex-shrink-0 snap-center md:snap-start transition-all duration-500 outline-none",
                                "w-[280px] md:w-[360px] lg:w-[420px]",
                                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                            )}
                            style={{ transitionDelay: `${i * 100}ms` }}
                        >
                            {/* Card Frame */}
                            <div className="relative border-4 border-secondary-muted bg-dark-layer p-4 group-hover:border-cream transition-colors duration-300 shadow-solid-lg">

                                {/* Top Tracker Bar */}
                                <div className="flex justify-between items-center mb-4 border-b-2 border-secondary-muted pb-2">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, idx) => (
                                            <div key={idx} className={cn(
                                                "w-4 h-2",
                                                idx < (i % 5) + 1 ? "bg-cream" : "bg-secondary-muted"
                                            )} />
                                        ))}
                                    </div>
                                    <span className="font-mono text-xs text-cream uppercase tracking-widest">
                                        ID-{String(i + 1).padStart(3, '0')}
                                    </span>
                                </div>

                                {/* Main Image Content */}
                                <div className="relative aspect-video border-2 border-cream overflow-hidden mb-4 bg-bg-dark group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-300 ease-[var(--transition-spring)] shadow-solid-light">
                                    <BlurImage
                                        src={a.image}
                                        alt={a.title}
                                        fill
                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100"
                                    />
                                    {/* Scanline Overlay */}
                                    <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-50" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)' }} />

                                    {/* Play Button Overlay (Distorted on hover) */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-16 h-16 rounded-full bg-accent text-cream flex items-center justify-center animate-glitch border-2 border-cream">
                                            <Play size={32} className="ml-1 fill-cream" />
                                        </div>
                                    </div>
                                </div>

                                {/* Info Footer */}
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-editorial text-2xl lg:text-3xl uppercase text-cream truncate">
                                        {a.title}
                                    </h3>
                                    <div className="flex justify-between items-end border-t-2 border-secondary-muted pt-2 text-secondary font-mono text-xs uppercase">
                                        <span dangerouslySetInnerHTML={{ __html: `ТИП: <span class="text-cream">${a.kind}</span>` }} />
                                        <span className="bg-cream text-bg-dark px-2 py-1 font-bold">{a.date}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
