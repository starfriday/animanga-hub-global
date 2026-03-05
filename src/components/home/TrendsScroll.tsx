"use client";

import React, { useRef, useMemo } from 'react';
import Link from 'next/link';
import { Star, ChevronRight, ChevronLeft, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurImage } from '@/components/ui/BlurImage';
import { resolveAnimeImage } from '@/lib/imageUtils';
import { useScrollReveal } from '@/hooks/useScrollReveal';


interface TrendsScrollProps {
    popular?: any[];
}

export const TrendsScroll = ({ popular }: TrendsScrollProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { ref: sectionRef, isVisible } = useScrollReveal(0.1);

    const trending = useMemo(() => {
        if (!popular || popular.length === 0) return [];

        return popular.map(anime => ({
            id: anime.id,
            title: anime.russian || anime.name,
            originalTitle: anime.name,
            image: resolveAnimeImage(anime),
            studio_rating: parseFloat(anime.score) || 0,
            type: anime.kind?.toUpperCase() || 'TV',
            slug: anime.id.toString()
        }));
    }, [popular]);

    const scroll = (dir: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir * 400, behavior: 'smooth' });
        }
    };

    // Random rotation values for collage effect (deterministic per index)
    const rotations = [-3, 2, -1.5, 3, -2, 1, -2.5, 3.5, -1, 2.5];

    return (
        <section ref={sectionRef} className="relative w-full overflow-hidden bg-bg-dark text-cream border-b-4 border-bg-dark">

            {/* Grain texture */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
                style={{ backgroundImage: 'var(--background-noise)', backgroundSize: '128px' }}
            />

            {/* Diagonal hatching background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="diag" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                            <line x1="0" y1="0" x2="0" y2="8" stroke="#FFF" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#diag)" />
                </svg>
            </div>

            {/* RED TOP STRIP */}
            <div className="h-3 bg-accent w-full" />

            <div className="max-w-[1600px] mx-auto px-6 lg:px-16 py-20 sm:py-28 relative z-10">

                {/* === SECTION HEADER === */}
                <div className={cn("flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16", isVisible ? "animate-fade-in-up" : "opacity-0")}>

                    <div className="flex items-start gap-6 lg:gap-10">
                        {/* Vertical kanji */}
                        <div className="font-editorial text-7xl sm:text-8xl lg:text-9xl leading-none text-accent/30 tracking-tighter select-none hidden sm:block" style={{ writingMode: 'vertical-rl' }}>
                            人気
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-3 h-3 bg-accent" />
                                <span className="font-black uppercase tracking-[0.3em] text-[10px] text-accent">РУБРИКА 01</span>
                            </div>

                            <h2 className="font-editorial text-6xl sm:text-7xl lg:text-8xl text-cream uppercase tracking-tighter leading-[0.85]">
                                Trending<br />
                                <span className="text-accent">Now</span>
                            </h2>

                            <div className="border-l-4 border-accent pl-5 mt-6 max-w-md">
                                <p className="text-cream/50 leading-relaxed text-sm">
                                    Самые обсуждаемые тайтлы этого сезона. Вырезки из наших архивов.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Scroll controls */}
                    <div className="flex items-center gap-3">
                        <button onClick={() => scroll(-1)} className="w-12 h-12 flex items-center justify-center border-2 border-cream/20 text-cream/50 hover:bg-cream hover:text-bg-dark transition-colors active:scale-95">
                            <ChevronLeft strokeWidth={3} size={18} />
                        </button>
                        <button onClick={() => scroll(1)} className="w-12 h-12 flex items-center justify-center border-2 border-cream/20 text-cream/50 hover:bg-cream hover:text-bg-dark transition-colors active:scale-95">
                            <ChevronRight strokeWidth={3} size={18} />
                        </button>
                    </div>
                </div>

                {/* === TORN PAPER COLLAGE CARDS === */}
                <div
                    ref={scrollRef}
                    className="flex gap-8 sm:gap-10 overflow-x-auto pb-12 scrollbar-hide snap-x -mx-6 px-6 items-start"
                    style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
                >
                    {trending.map((p, index) => (
                        <TornPaperCard key={p.id} project={p} rank={index + 1} visible={isVisible} rotation={rotations[index % rotations.length]} />
                    ))}

                    {/* View All Card */}
                    <Link href="/catalog" className="flex-none w-[240px] sm:w-[280px] aspect-[3/4] snap-start group outline-none bg-cream text-bg-dark flex flex-col items-center justify-center p-8 hover:bg-accent hover:text-cream transition-all rotate-2 hover:rotate-0 shadow-2xl">
                        <div className="w-12 h-12 rounded-full border-3 border-current flex items-center justify-center mb-4">
                            <ArrowUpRight size={24} className="stroke-[2.5px]" />
                        </div>
                        <h3 className="font-editorial text-3xl uppercase tracking-tighter text-center mb-1">Смотреть<br />Все</h3>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-50">КАТАЛОГ</span>
                    </Link>
                </div>
            </div>

            {/* Bottom red strip */}
            <div className="h-3 bg-accent w-full" />
        </section>
    );
};

const TornPaperCard: React.FC<{ project: any; rank: number; visible: boolean; rotation: number }> = ({ project, rank, visible, rotation }) => {
    return (
        <Link
            href={`/anime/${project.slug || project.id}`}
            className={cn(
                "flex-none relative w-[240px] sm:w-[280px] snap-start group outline-none block transition-all duration-500 hover:z-10",
                visible ? "animate-fade-in-up" : "opacity-0"
            )}
            style={{
                animationDelay: `${rank * 80}ms`,
                transform: `rotate(${rotation}deg)`,
            }}
        >
            {/* Main card — white paper with torn edges */}
            <div className="relative bg-cream p-2.5 shadow-2xl group-hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] transition-shadow group-hover:scale-[1.03]"
                style={{ transition: 'transform 0.5s, box-shadow 0.5s' }}
            >
                {/* Image area */}
                <div className="relative aspect-[3/4] overflow-hidden bg-bg-dark">
                    <BlurImage
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 saturate-[0.85] group-hover:saturate-100"
                    />

                    {/* Halftone/grain overlay on image (newspaper print feel) */}
                    <div className="absolute inset-0 opacity-[0.12] mix-blend-multiply pointer-events-none"
                        style={{ backgroundImage: 'var(--background-noise)', backgroundSize: '100px' }}
                    />

                    {/* Red stamp rank */}
                    <div className="absolute top-3 right-3 w-12 h-12 rounded-full border-[3px] border-accent bg-accent/90 flex items-center justify-center z-10 shadow-lg" style={{ transform: `rotate(${-rotation * 2}deg)` }}>
                        <span className="font-editorial text-cream text-xl leading-none">{rank}</span>
                    </div>
                </div>

                {/* Bottom caption area (like handwritten magazine annotation) */}
                <div className="pt-3 pb-1 px-1">
                    <h3 className="font-editorial text-lg sm:text-xl text-bg-dark uppercase leading-[0.9] tracking-tight mb-1 line-clamp-2">
                        {project.title}
                    </h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-accent">
                            <Star size={11} className="fill-accent" />
                            <span className="font-bold text-xs">{project.studio_rating}</span>
                        </div>
                        <span className="text-bg-dark/40 font-bold text-[9px] uppercase tracking-widest">{project.type}</span>
                    </div>
                </div>

                {/* Tape piece decoration (top-left) */}
                <div className="absolute -top-2 left-4 w-10 h-6 bg-cream/80 backdrop-blur-sm border border-bg-dark/5 z-20 rotate-[-5deg] shadow-sm opacity-60"
                    style={{ background: 'linear-gradient(135deg, rgba(220,201,169,0.6) 0%, rgba(220,201,169,0.3) 100%)' }}
                />

                {/* Tape piece decoration (bottom-right) */}
                <div className="absolute -bottom-1.5 right-6 w-8 h-5 bg-cream/80 backdrop-blur-sm border border-bg-dark/5 z-20 rotate-[8deg] shadow-sm opacity-60"
                    style={{ background: 'linear-gradient(135deg, rgba(220,201,169,0.6) 0%, rgba(220,201,169,0.3) 100%)' }}
                />
            </div>
        </Link>
    );
};
