"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Play, Sparkles, Plus, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurImage } from '@/components/ui/BlurImage';
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
            image: anime.image?.original ? `https://shikimori.one${anime.image.original}` : '',
            studio_rating: parseFloat(anime.score) || 0,
            type: anime.kind?.toUpperCase() || 'TV',
            status: anime.status,
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
        return list.slice(0, 14); // 7x2 grid
    }, [projects, activeTab]);

    const tabs: { id: Category; label: string; icon: any }[] = [
        { id: 'All', label: 'All', icon: Sparkles },
        { id: 'Anime', label: 'Anime', icon: Play },
        { id: 'Reading', label: 'Manga', icon: BookOpen },
    ];

    // local dummy icon component for missing import just in case
    function BookOpen(props: any) {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
    }

    return (
        <section ref={sectionRef} className="relative w-full overflow-hidden bg-bg-dark text-cream border-t-8 border-accent">
            <MarqueeStrip variant="dark" speed="normal" />

            <div className={cn("max-w-[1800px] mx-auto px-6 lg:px-12 py-24", isVisible ? "animate-fade-in-up" : "opacity-0")}>

                {/* HEADER (Azuki Collection Style) */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="w-12 h-1 bg-accent inline-block" />
                            <span className="font-bold uppercase tracking-widest text-[#A09080] text-sm">New Drops</span>
                        </div>
                        <h2 className="font-editorial text-7xl md:text-8xl lg:text-[140px] uppercase tracking-tighter leading-[0.8] text-cream">
                            The <span className="text-accent">Pulse</span>
                        </h2>
                    </div>

                    {/* RED BLOCKY TABS */}
                    <div className="flex gap-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-3 border-2 border-cream font-black uppercase tracking-widest text-sm transition-all outline-none",
                                        isActive
                                            ? "bg-cream text-bg-dark shadow-[4px_4px_0_var(--color-accent)] transform -translate-y-1"
                                            : "bg-transparent text-cream hover:bg-cream/10"
                                    )}
                                >
                                    <Icon size={16} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* COLLECTION GRID (Circular avatars / Block cards) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
                    {filteredProjects.map((p, i) => (
                        <ProjectAvatarCard key={p.id} project={p} index={i} />
                    ))}
                </div>

                {/* CTA */}
                <div className="flex justify-center mt-20">
                    <Link
                        href="/catalog"
                        className="group flex items-center gap-4 px-12 py-5 bg-accent text-cream border-4 border-accent font-editorial text-3xl uppercase tracking-wider hover:bg-transparent hover:text-accent transition-all shadow-[8px_8px_0_var(--color-cream)] hover:shadow-none hover:translate-y-2 hover:translate-x-2"
                    >
                        More Drops <Plus size={28} className="group-hover:rotate-90 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* BOTTOM DECORATIVE BAND */}
            <div className="h-4 bg-accent w-full" />
        </section>
    );
};

const ProjectAvatarCard: React.FC<{ project: any; index: number }> = ({ project, index }) => {
    return (
        <Link
            href={`/anime/${project.slug || project.id}`}
            className={cn("group flex flex-col items-center gap-4 outline-none animate-fade-in-up")}
            style={{ animationDelay: `${(index % 7) * 50}ms` }}
        >
            {/* AVATAR IMAGE (Azuki circular token style) */}
            <div className="relative w-full aspect-square rounded-full border-4 border-bg-dark bg-bg-dark ring-4 ring-cream group-hover:ring-accent transition-all duration-300 overflow-hidden shadow-2xl">
                <BlurImage
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100 grayscale-[0.2] group-hover:grayscale-0"
                />

                {/* RATING BADGE */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-bg-dark text-cream px-3 py-1 rounded-full border-2 border-cream font-bold textxs flex items-center gap-1 shadow-lg z-10 translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                    <Star size={10} className="fill-accent text-accent" /> {project.studio_rating}
                </div>
            </div>

            {/* INFO */}
            <div className="text-center w-full">
                <h3 className="font-editorial text-xl text-cream uppercase leading-tight tracking-tight mb-1 truncate group-hover:text-accent transition-colors">
                    {project.title}
                </h3>
                <div className="text-accent font-bold uppercase tracking-widest text-[10px]">
                    {project.type}
                </div>
            </div>
        </Link>
    );
};
