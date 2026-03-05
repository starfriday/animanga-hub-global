"use client";

import React, { useRef, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurImage } from '@/components/ui/BlurImage';
import { resolveAnimeImage } from '@/lib/imageUtils';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface AnnouncedSectionProps {
    upcoming?: any[];
}

export function AnnouncedSection({ upcoming }: AnnouncedSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { ref: sectionRef, isVisible } = useScrollReveal(0.1);

    const announcements = useMemo(() => {
        if (!upcoming || upcoming.length === 0) return [];
        return upcoming.map(anime => ({
            id: anime.id,
            title: anime.russian || anime.name,
            originalTitle: anime.name,
            image: resolveAnimeImage(anime),
            kind: anime.kind === 'tv' ? 'TV Series' : anime.kind === 'movie' ? 'Movie' : (anime.kind || '').toUpperCase(),
            date: anime.aired_on ? new Date(anime.aired_on).toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' }) : 'TBA',
        }));
    }, [upcoming]);

    const scroll = (dir: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir * 400, behavior: 'smooth' });
        }
    };

    if (announcements.length === 0) return null;

    return (
        <section
            ref={sectionRef as any}
            className="relative w-full bg-[#1a1411] py-20 md:py-28 overflow-hidden"
        >
            {/* Grunge texture */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                    backgroundImage: `
                        radial-gradient(ellipse at 30% 30%, rgba(184,58,45,0.4) 0%, transparent 60%),
                        radial-gradient(ellipse at 70% 70%, rgba(184,58,45,0.3) 0%, transparent 60%)
                    `
                }}
            />
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(circle, #fff 0.5px, transparent 0.5px)`, backgroundSize: '4px 4px' }}
            />

            {/* Torn edge top */}
            <div className="absolute top-0 left-0 right-0 h-6"
                style={{ background: 'linear-gradient(to bottom, #f5ead6, transparent)' }}
            />

            <div className="max-w-[1600px] mx-auto px-6 md:px-16">
                {/* Header */}
                <div className={cn(
                    "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 transition-all duration-700",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}>
                    <div>
                        <div className="font-editorial text-5xl md:text-7xl lg:text-8xl text-[#b83a2d] uppercase tracking-tighter leading-[0.9]"
                            style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                            近日公開
                        </div>
                        <h2 className="font-editorial text-3xl md:text-5xl text-[#f5ead6] uppercase tracking-widest mt-2">
                            COMING SOON
                        </h2>
                        <div className="w-16 h-1 bg-[#b83a2d] mt-3" />
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => scroll(-1)}
                            className="p-3 border-2 border-[#f5ead6]/20 text-[#f5ead6]/60 hover:border-[#b83a2d] hover:text-[#b83a2d] hover:bg-[#b83a2d]/10 transition-all">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => scroll(1)}
                            className="p-3 border-2 border-[#f5ead6]/20 text-[#f5ead6]/60 hover:border-[#b83a2d] hover:text-[#b83a2d] hover:bg-[#b83a2d]/10 transition-all">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Horizontal scroll of tickets */}
                <div
                    ref={scrollRef}
                    className="flex gap-5 md:gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                >
                    {announcements.map((a, i) => (
                        <Link
                            key={a.id}
                            href={`/anime/${a.id}`}
                            className={cn(
                                "group relative flex-shrink-0 snap-start transition-all duration-500",
                                "w-[280px] md:w-[320px] lg:w-[340px]",
                                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                            )}
                            style={{ transitionDelay: `${200 + i * 70}ms` }}
                        >
                            {/* Ticket container */}
                            <div className={cn(
                                "relative flex bg-[#f0e4cc] border-2 border-[#f5ead6]/20 overflow-hidden",
                                "group-hover:border-[#b83a2d]/40 group-hover:-translate-y-1 group-hover:shadow-[0_8px_24px_rgba(184,58,45,0.3)]",
                                "transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                            )}>
                                {/* Left — Poster stub */}
                                <div className="relative w-[110px] md:w-[120px] flex-shrink-0 overflow-hidden">
                                    <BlurImage
                                        src={a.image}
                                        alt={a.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#f0e4cc]/20" />
                                </div>

                                {/* Perforation line */}
                                <div className="relative w-4 flex-shrink-0 flex flex-col items-center justify-evenly bg-[#f0e4cc] border-l-2 border-r-2 border-dashed border-[#1a1411]/15">
                                    {Array.from({ length: 10 }).map((_, j) => (
                                        <div key={j} className="w-2.5 h-2.5 rounded-full bg-[#1a1411] opacity-[0.08]" />
                                    ))}
                                </div>

                                {/* Right — Info stub */}
                                <div className="flex-1 p-3 md:p-4 flex flex-col justify-between bg-[#f0e4cc] relative">
                                    {/* Subtle halftone on ticket */}
                                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                                        style={{ backgroundImage: `radial-gradient(circle, #1a1a1a 0.5px, transparent 0.5px)`, backgroundSize: '4px 4px' }}
                                    />

                                    {/* Top: Date badge */}
                                    <div className="relative z-10">
                                        <div className="inline-flex items-center gap-1.5 bg-[#b83a2d] text-white px-2 py-1 mb-2">
                                            <Calendar size={10} />
                                            <span className="text-[8px] font-black tracking-widest uppercase">{a.date}</span>
                                        </div>

                                        <h3 className="font-black text-[11px] md:text-xs uppercase leading-tight text-[#1a1411] tracking-wide line-clamp-3">
                                            {a.title}
                                        </h3>
                                    </div>

                                    {/* Bottom: Meta */}
                                    <div className="relative z-10 mt-3 flex items-end justify-between">
                                        <div>
                                            <p className="text-[8px] uppercase tracking-widest text-[#1a1411]/40 font-bold">
                                                {a.kind}
                                            </p>
                                            <p className="text-[7px] uppercase tracking-[0.2em] text-[#b83a2d] font-black mt-0.5">
                                                СКОРО НА ANIVAULT
                                            </p>
                                        </div>

                                        {/* Ticket number */}
                                        <div className="text-right">
                                            <p className="text-[20px] font-black text-[#1a1411]/[0.06] leading-none">
                                                {String(i + 1).padStart(2, '0')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stamp overlay */}
                                    <div className="absolute top-2 right-2 w-12 h-12 border-2 border-[#b83a2d]/20 rounded-full flex items-center justify-center rotate-[-15deg] opacity-30">
                                        <span className="text-[6px] font-black text-[#b83a2d] tracking-widest uppercase leading-[1.1] text-center">
                                            COMING<br />SOON
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Torn edge bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-6"
                style={{ background: 'linear-gradient(to top, #f5ead6, transparent)' }}
            />
        </section>
    );
}
