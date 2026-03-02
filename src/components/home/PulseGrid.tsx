"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Play, Sparkles, Plus, Star, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurImage } from '@/components/ui/BlurImage';
import { resolveAnimeImage } from '@/lib/imageUtils';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { mockProjects } from '@/data/mockProjects';
import { MarqueeStrip } from './MarqueeStrip';

type Category = 'All' | 'Anime' | 'Reading' | 'LiveAction';

interface PulseGridProps {
    upcoming?: any[];
}

export const PulseGrid = ({ upcoming }: PulseGridProps) => {
    const [activeTab, setActiveTab] = useState<Category>('All');
    const { ref: sectionRef, isVisible } = useScrollReveal(0.1);

    const projects = useMemo(() => {
        if (!upcoming || upcoming.length === 0) return mockProjects;

        return upcoming.map(anime => ({
            id: anime.id,
            title: anime.russian || anime.name,
            originalTitle: anime.name,
            image: resolveAnimeImage(anime),
            studio_rating: parseFloat(anime.score) || 0,
            type: anime.kind?.toUpperCase() || 'TV',
            status: anime.status === 'ongoing' ? 'ОНГОИНГ' : anime.status === 'released' ? 'ВЫШЕЛ' : 'АНОНС',
            slug: anime.id.toString(),
            episodes: anime.episodes_aired || 0
        }));
    }, [upcoming]);

    const filteredProjects = useMemo(() => {
        let list = [...projects];
        if (activeTab !== 'All') {
            list = list.filter(p => {
                if (activeTab === 'Anime') return p.type === 'TV' || p.type === 'ONA' || p.type === 'OVA';
                if (activeTab === 'Reading') return p.type === 'MANGA' || p.type === 'NOVEL';
                if (activeTab === 'LiveAction') return p.type === 'MOVIE';
                return true;
            });
        }
        return list.slice(0, 8);
    }, [projects, activeTab]);

    const tabs: { id: Category; label: string; icon: any }[] = [
        { id: 'All', label: 'Все', icon: Sparkles },
        { id: 'Anime', label: 'Аниме', icon: Play },
        { id: 'Reading', label: 'Манга', icon: BookOpen },
    ];

    return (
        <section ref={sectionRef} className="relative w-full overflow-hidden bg-bg-cream text-bg-dark border-b-4 border-bg-dark">
            <MarqueeStrip variant="light" speed="normal" />

            {/* Aged paper texture */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-multiply"
                style={{ backgroundImage: 'var(--background-noise)', backgroundSize: '200px' }}
            />

            <div className={cn("max-w-[1600px] mx-auto px-6 lg:px-16 py-20 sm:py-28", isVisible ? "animate-fade-in-up" : "opacity-0")}>

                {/* === SECTION HEADER === */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 border-b-4 border-bg-dark pb-8">
                    <div className="flex items-start gap-6">
                        <div className="font-editorial text-8xl sm:text-9xl text-accent/15 leading-none tracking-tighter select-none hidden sm:block">
                            02
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-3 h-3 bg-accent" />
                                <span className="font-black uppercase tracking-[0.3em] text-[10px] text-accent">РУБРИКА 02 — БИЛЕТЫ</span>
                            </div>
                            <h2 className="font-editorial text-6xl sm:text-7xl lg:text-8xl uppercase tracking-tighter leading-[0.85] text-bg-dark mix-blend-multiply">
                                Новые <span className="text-accent">Релизы</span>
                            </h2>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-5 py-3 border-2 border-bg-dark font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all outline-none",
                                        isActive
                                            ? "bg-bg-dark text-cream shadow-none"
                                            : "bg-white text-bg-dark hover:bg-bg-dark/5 shadow-[3px_3px_0_var(--color-bg-dark)] hover:shadow-[1px_1px_0_var(--color-bg-dark)] hover:translate-y-0.5"
                                    )}
                                >
                                    <Icon size={14} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* === CINEMA TICKET GRID === */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {filteredProjects.map((p, i) => (
                        <CinemaTicketCard key={p.id} project={p} index={i} />
                    ))}
                </div>

                {/* CTA */}
                <div className="flex justify-center mt-16 sm:mt-20">
                    <Link
                        href="/catalog"
                        className="group flex items-center gap-4 px-10 sm:px-12 py-4 sm:py-5 bg-accent text-cream border-4 border-bg-dark font-editorial text-xl sm:text-2xl uppercase tracking-wider transition-all shadow-[8px_8px_0_var(--color-bg-dark)] hover:shadow-[4px_4px_0_var(--color-bg-dark)] hover:translate-y-1 hover:translate-x-1 active:translate-y-2 active:translate-x-2 active:shadow-none"
                    >
                        Весь Каталог <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Bottom accent strip */}
            <div className="h-2 bg-accent w-full" />
        </section>
    );
};

const CinemaTicketCard: React.FC<{ project: any; index: number }> = ({ project, index }) => {
    const ticketNumber = String(((project.id * 7 + 1234) % 9000) + 1000);

    return (
        <Link
            href={`/anime/${project.slug || project.id}`}
            className={cn("group block outline-none animate-fade-in-up")}
            style={{ animationDelay: `${(index % 4) * 80}ms` }}
        >
            {/* TICKET WRAPPER */}
            <div className="relative flex bg-white border-2 border-bg-dark overflow-hidden shadow-[4px_4px_0_var(--color-accent)] group-hover:shadow-[8px_8px_0_var(--color-accent)] group-hover:-translate-y-2 transition-all">

                {/* LEFT STUB (ticket stub) */}
                <div className="relative w-[70px] sm:w-[80px] shrink-0 bg-accent text-cream flex flex-col items-center justify-center p-2 border-r-0">
                    {/* Perforated line */}
                    <div className="absolute right-0 top-0 bottom-0 w-0 border-r-[3px] border-dashed border-cream/30" />

                    {/* Ticket number vertical */}
                    <div className="font-editorial text-[10px] tracking-[0.3em] uppercase opacity-70 mb-1" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                        ADMIT ONE
                    </div>
                    <div className="font-editorial text-2xl sm:text-3xl leading-none my-2">
                        {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="text-[7px] font-bold tracking-widest opacity-50 text-center">
                        AV-{ticketNumber}
                    </div>
                </div>

                {/* Notch cutouts */}
                <div className="absolute left-[68px] sm:left-[78px] top-0 w-4 h-4 bg-bg-cream rounded-full -translate-x-1/2 -translate-y-1/2 z-10 border border-bg-dark/10" />
                <div className="absolute left-[68px] sm:left-[78px] bottom-0 w-4 h-4 bg-bg-cream rounded-full -translate-x-1/2 translate-y-1/2 z-10 border border-bg-dark/10" />

                {/* RIGHT MAIN AREA */}
                <div className="flex-1 flex flex-col">
                    {/* Image row */}
                    <div className="relative h-[140px] sm:h-[160px] overflow-hidden bg-bg-dark">
                        <BlurImage
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/60 to-transparent" />

                        {/* Status stamp */}
                        <div className="absolute top-2 right-2 bg-accent text-cream px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border border-cream/20 shadow-sm">
                            {project.status}
                        </div>
                    </div>

                    {/* Ticket info area */}
                    <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between border-t-2 border-bg-dark/10">
                        {/* Title */}
                        <h3 className="font-editorial text-base sm:text-lg text-bg-dark uppercase leading-[0.9] tracking-tight mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                            {project.title}
                        </h3>

                        {/* Bottom info */}
                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-bg-dark/10">
                            <div className="flex items-center gap-1.5">
                                <Star size={10} className="fill-accent text-accent" />
                                <span className="font-bold text-accent text-xs">{project.studio_rating}</span>
                            </div>
                            <span className="text-bg-dark/30 font-bold text-[8px] uppercase tracking-widest">{project.type}</span>
                            {/* Barcode decoration */}
                            <div className="flex gap-[1px]">
                                {[3, 5, 2, 4, 3, 6, 2, 5, 3, 4, 2].map((h, i) => (
                                    <div key={i} className="bg-bg-dark/20 w-[1px]" style={{ height: `${h * 2}px` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};
