"use client";

import React, { useRef, useMemo } from 'react';
import Link from 'next/link';
import { Star, ChevronRight, ChevronLeft, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurImage } from '@/components/ui/BlurImage';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { mockProjects } from '@/data/mockProjects';

interface TrendsScrollProps {
    popular?: any[];
}

export const TrendsScroll = ({ popular }: TrendsScrollProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { ref: sectionRef, isVisible } = useScrollReveal(0.1);

    const trending = useMemo(() => {
        if (!popular || popular.length === 0) return mockProjects;

        return popular.map(anime => ({
            id: anime.id,
            title: anime.russian || anime.name,
            originalTitle: anime.name,
            image: anime.image?.original ? `https://shikimori.one${anime.image.original}` : '',
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

    return (
        <section ref={sectionRef} className="relative w-full overflow-hidden bg-bg-cream border-b-4 border-bg-dark text-bg-dark pt-24 pb-32">

            {/* Retro background pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="dotGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1.5" fill="var(--color-bg-dark)" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dotGrid)" />
                </svg>
            </div>

            <div className="max-w-[1800px] mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24">

                {/* LEFT: EDITORIAL TYPOGRAPHY HEADING */}
                <div className={cn("w-full lg:w-1/3 shrink-0 flex flex-col", isVisible ? "animate-fade-in-up" : "opacity-0")}>
                    <div className="font-editorial text-[10rem] sm:text-[14rem] lg:text-[16rem] leading-[0.7] text-accent opacity-20 transform -translate-x-8 mix-blend-multiply">
                        <span className="writing-vertical-rl" style={{ writingMode: 'vertical-rl' }}>人気</span>
                    </div>
                    <div className="relative -mt-32 sm:-mt-48 lg:-mt-56 z-10">
                        <h2 className="font-editorial text-7xl sm:text-8xl lg:text-9xl text-accent uppercase tracking-tighter leading-[0.85] mix-blend-multiply drop-shadow-sm mb-6">
                            Trending<br />Now
                        </h2>
                        <div className="border-l-4 border-accent pl-6 py-2 mb-10">
                            <p className="font-serif text-bg-dark/80 max-w-sm font-semibold leading-relaxed">
                                The most popular titles currently dominating the charts. Join the hype train and never miss a masterpiece again.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => scroll(-1)} className="w-12 h-12 flex items-center justify-center border-2 border-accent text-accent hover:bg-accent hover:text-cream transition-colors">
                                <ChevronLeft strokeWidth={3} />
                            </button>
                            <button onClick={() => scroll(1)} className="w-12 h-12 flex items-center justify-center border-2 border-accent text-accent hover:bg-accent hover:text-cream transition-colors">
                                <ChevronRight strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT: SCROLLING CARDS */}
                <div className={cn("w-full lg:w-2/3 flex items-center relative", isVisible ? "animate-fade-in" : "opacity-0")} style={{ animationDelay: '0.2s' }}>
                    <div
                        ref={scrollRef}
                        className="flex items-center gap-8 overflow-x-auto pb-12 pt-8 scrollbar-hide snap-x px-4 -mx-4 w-full"
                        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
                    >
                        {trending.map((p, index) => (
                            <TrendCard key={p.id} project={p} rank={index + 1} visible={isVisible} />
                        ))}

                        {/* View All Card */}
                        <Link href="/catalog" className="flex-none w-[280px] aspect-[3/4] snap-start group outline-none bg-accent/5 border-4 border-accent flex flex-col items-center justify-center p-8 hover:bg-accent hover:text-cream text-accent transition-colors">
                            <ArrowUpRight size={48} className="mb-4 stroke-[3px]" />
                            <h3 className="font-editorial text-4xl uppercase tracking-tighter text-center">View<br />All</h3>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

const TrendCard: React.FC<{ project: any; rank: number; visible: boolean }> = ({ project, rank, visible }) => {
    return (
        <Link
            href={`/anime/${project.slug || project.id}`}
            className={cn(
                "flex-none relative w-[280px] md:w-[320px] aspect-[3/4] snap-start group outline-none border-4 border-bg-dark bg-bg-dark overflow-hidden transform transition-transform duration-500 hover:-translate-y-4 hover:rotate-1 shadow-[8px_8px_0_var(--color-accent)] hover:shadow-[16px_16px_0_var(--color-accent)] block",
                visible ? "animate-fade-in-up" : "opacity-0"
            )}
            style={{ animationDelay: `${rank * 80}ms` }}
        >
            <div className="absolute inset-0">
                <BlurImage
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105"
                />
            </div>

            {/* Retro Number Badge */}
            <div className="absolute top-0 right-0 bg-accent text-cream w-20 h-20 flex items-center justify-center border-b-4 border-l-4 border-bg-dark z-10">
                <span className="font-editorial text-5xl leading-none">#{rank}</span>
            </div>

            {/* Type/Rating Tag */}
            <div className="absolute top-4 left-4 bg-cream text-bg-dark font-black textxs uppercase tracking-widest px-3 py-1 border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)] z-10 flex gap-2 items-center">
                <span>{project.type}</span>
                <span className="w-1 h-1 bg-accent rounded-full" />
                <span className="flex items-center gap-1"><Star size={10} className="fill-bg-dark" /> {project.studio_rating}</span>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent z-0 relative flex flex-col justify-end p-6 border-4 border-transparent group-hover:border-cream/20 transition-all">
                {/* Title and Metadata */}
                <div className="relative z-10 transition-transform duration-300 transform group-hover:-translate-y-2">
                    <h3 className="font-editorial text-3xl md:text-4xl text-cream uppercase leading-[0.9] tracking-tighter mb-2 line-clamp-3">
                        {project.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-4 text-cream font-bold text-xs uppercase tracking-widest">
                        <span className="bg-accent px-3 py-1">Watch</span>
                        <ArrowUpRight size={16} className="text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                </div>
            </div>

            {/* Japanese Text Vertical */}
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-0 group-hover:opacity-[0.15] transition-opacity duration-500 z-10">
                <span className="font-editorial text-8xl text-cream writing-vertical-rl ml-4" style={{ writingMode: 'vertical-rl' }}>
                    トレンド
                </span>
            </div>
        </Link>
    );
};
