/* eslint-disable @typescript-eslint/no-explicit-any */
 
"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurImage } from '@/components/ui/BlurImage';
import { resolveAnimeImage } from '@/lib/imageUtils';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface VintageHeroProps {
    trending?: any[];
}

// Deterministic scatter positions for 10 cards — hand-tuned collage layout
const CARD_LAYOUTS = [
    // Row 1 — big feature cards
    { x: '0%', y: '0%', rotate: -3, scale: 1.15, z: 10, w: 'w-[38%]' },
    { x: '36%', y: '2%', rotate: 2, scale: 1.05, z: 8, w: 'w-[32%]' },
    { x: '66%', y: '0%', rotate: -1.5, scale: 1.1, z: 9, w: 'w-[34%]' },
    // Row 2 — medium cards overlapping
    { x: '3%', y: '48%', rotate: 4, scale: 1, z: 7, w: 'w-[28%]' },
    { x: '26%', y: '44%', rotate: -2.5, scale: 1.08, z: 11, w: 'w-[30%]' },
    { x: '52%', y: '46%', rotate: 1.5, scale: 1, z: 6, w: 'w-[26%]' },
    { x: '74%', y: '42%', rotate: -3.5, scale: 1.05, z: 8, w: 'w-[28%]' },
    // Row 3 — bottom cards
    { x: '5%', y: '76%', rotate: 2.5, scale: 0.95, z: 5, w: 'w-[24%]' },
    { x: '30%', y: '78%', rotate: -1, scale: 1, z: 7, w: 'w-[28%]' },
    { x: '58%', y: '74%', rotate: 3, scale: 0.98, z: 6, w: 'w-[26%]' },
];

export function VintageHero({ trending }: VintageHeroProps) {
    const { ref: sectionRef, isVisible } = useScrollReveal(0.05);

    const cards = useMemo(() => {
        if (!trending || trending.length === 0) return [];
        return trending.slice(0, 10).map((anime, i) => ({
            id: anime.id,
            title: anime.russian || anime.name,
            originalTitle: anime.name,
            image: resolveAnimeImage(anime),
            score: parseFloat(anime.score) || 0,
            kind: anime.kind === 'tv' ? 'TV SERIES' : anime.kind === 'movie' ? 'MOVIE' : (anime.kind || '').toUpperCase(),
            episodes: anime.episodes || '?',
            year: anime.aired_on ? new Date(anime.aired_on).getFullYear() : '',
            layout: CARD_LAYOUTS[i] || CARD_LAYOUTS[0],
            rank: i + 1,
        }));
    }, [trending]);

    if (cards.length === 0) return null;

    return (
        <section
            ref={sectionRef as any}
            className="relative w-full min-h-[100vh] bg-[#f5ead6] overflow-hidden"
        >
            {/* Aged paper texture overlay */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none"
                style={{
                    backgroundImage: `
                        radial-gradient(ellipse at 20% 50%, rgba(139, 90, 43, 0.3) 0%, transparent 50%),
                        radial-gradient(ellipse at 80% 20%, rgba(139, 90, 43, 0.2) 0%, transparent 50%),
                        radial-gradient(ellipse at 50% 80%, rgba(139, 90, 43, 0.25) 0%, transparent 50%)
                    `
                }}
            />

            {/* Halftone dot pattern */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle, #1a1a1a 1px, transparent 1px)`,
                    backgroundSize: '8px 8px'
                }}
            />

            {/* Section Header */}
            <div className={cn(
                "relative z-20 pt-28 md:pt-32 px-6 md:px-16 transition-all duration-1000",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
                <div className="flex items-end gap-4 mb-2">
                    <h2 className="font-editorial text-[clamp(4rem,12vw,10rem)] leading-[0.85] text-[#b83a2d] uppercase tracking-tighter"
                        style={{ textShadow: '3px 3px 0 rgba(0,0,0,0.15)' }}>
                        TOP 10
                    </h2>
                    <div className="pb-2 md:pb-4">
                        <div className="text-xs md:text-sm font-black tracking-[0.3em] text-[#1a1411] uppercase">POPULAR</div>
                        <div className="text-xs md:text-sm font-black tracking-[0.3em] text-[#1a1411] uppercase">ANIME</div>
                    </div>
                </div>
                <div className="w-24 h-1 bg-[#b83a2d]" />
            </div>

            {/* Collage Grid */}
            <div className="relative z-10 px-4 md:px-12 pb-16 mt-8">
                {/* Desktop: Scatter collage */}
                <div className="hidden md:grid grid-cols-5 gap-4 lg:gap-5">
                    {cards.map((card, i) => (
                        <CollageCard key={card.id} card={card} index={i} isVisible={isVisible} />
                    ))}
                </div>

                {/* Mobile: 2-column grid with slight rotations */}
                <div className="grid md:hidden grid-cols-2 gap-3">
                    {cards.map((card, i) => (
                        <CollageCard key={card.id} card={card} index={i} isVisible={isVisible} mobile />
                    ))}
                </div>
            </div>

            {/* Bottom torn edge */}
            <div className="absolute bottom-0 left-0 right-0 h-12 z-20"
                style={{
                    background: 'linear-gradient(to bottom, transparent 0%, var(--color-bg-cream) 100%)',
                }}
            />
        </section>
    );
}

function CollageCard({ card, index, isVisible, mobile = false }: {
    card: any; index: number; isVisible: boolean; mobile?: boolean;
}) {
    const rotation = mobile
        ? (index % 2 === 0 ? -1.5 : 1.5)
        : [-3, 2, -1.5, 4, -2.5, 1.5, -3.5, 2.5, -1, 3][index] || 0;

    return (
        <Link
            href={`/anime/${card.id}`}
            className={cn(
                "group relative block transition-all duration-500 ease-out",
                mobile ? "" : (index < 3 ? "col-span-1 row-span-1" : ""),
                isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
            )}
            style={{
                transitionDelay: `${150 + index * 80}ms`,
                transform: isVisible ? `rotate(${rotation}deg)` : `rotate(${rotation}deg) translateY(30px)`,
            }}
        >
            <div className={cn(
                "relative bg-[#f0e4cc] border-2 border-[#1a1411]/30 shadow-[3px_3px_0_rgba(26,20,17,0.3)] overflow-hidden",
                "group-hover:shadow-[6px_6px_0_rgba(26,20,17,0.4)] group-hover:-translate-y-1 group-hover:scale-[1.03]",
                "transition-all duration-300"
            )}>
                {/* Rank badge */}
                <div className="absolute top-2 left-2 z-30 bg-[#b83a2d] text-white font-black text-xs w-7 h-7 flex items-center justify-center border-2 border-[#1a1411] shadow-[1px_1px_0_rgba(0,0,0,0.3)]">
                    {card.rank}
                </div>

                {/* Image with halftone overlay */}
                <div className="relative aspect-[3/4] overflow-hidden">
                    <BlurImage
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-110"
                        style={{ filter: 'contrast(1.1) saturate(0.85)' }}
                    />
                    {/* Halftone overlay on hover remove */}
                    <div className="absolute inset-0 mix-blend-multiply bg-[#f5ead6]/20 group-hover:opacity-0 transition-opacity duration-500" />
                    {/* Vignette */}
                    <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(26,20,17,0.3)]" />
                </div>

                {/* Info bar */}
                <div className="p-2.5 bg-[#f0e4cc] border-t-2 border-[#1a1411]/20 space-y-1">
                    {/* Score stars */}
                    <div className="flex items-center gap-1">
                        <span className="text-[#b83a2d] font-black text-sm">{card.score.toFixed(1)}/10</span>
                        <div className="flex gap-px ml-1">
                            {Array.from({ length: 5 }).map((_, si) => (
                                <Star key={si} size={10} className={cn(
                                    si < Math.round(card.score / 2)
                                        ? "fill-[#b83a2d] text-[#b83a2d]"
                                        : "fill-[#d4c5a9] text-[#d4c5a9]"
                                )} />
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-black text-[10px] md:text-xs uppercase leading-tight text-[#1a1411] tracking-wide line-clamp-2">
                        {card.title}
                    </h3>

                    {/* Meta */}
                    <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-[#1a1411]/50 font-bold">
                        {card.kind} • {card.year} • EP {card.episodes}
                    </p>
                </div>
            </div>
        </Link>
    );
}
