"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Coffee, Flame, Skull, CloudRain, Play, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurImage } from '@/components/ui/BlurImage';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { mockProjects } from '@/data/mockProjects';

type Mood = 'chill' | 'hype' | 'dark' | 'sad';

export const MoodSelector = () => {
    const [activeMood, setActiveMood] = useState<Mood | null>(null);
    const { ref: sectionRef, isVisible } = useScrollReveal(0.1);
    const projects = mockProjects;

    const moods: { id: Mood; label: string; icon: any; color: string; desc: string; genres: string[] }[] = [
        { id: 'chill', label: 'Relieving', icon: Coffee, color: 'bg-[#DCC9A9]', desc: 'Slice of Life, Comedy', genres: ['Comedy', 'Slice of Life', 'Romance', 'Fantasy'] },
        { id: 'hype', label: 'Adrenaline', icon: Flame, color: 'bg-[#B83A2D] text-[#DCC9A9]', desc: 'Action, Sports', genres: ['Action', 'Sports', 'Mecha'] },
        { id: 'dark', label: 'Dark Side', icon: Skull, color: 'bg-[#1A1A1A] text-[#DCC9A9]', desc: 'Horror, Psych', genres: ['Horror', 'Psychological', 'Thriller'] },
        { id: 'sad', label: 'Emotional', icon: CloudRain, color: 'bg-[#4E6851] text-[#DCC9A9]', desc: 'Drama, Tragedy', genres: ['Drama', 'Supernatural'] },
    ];

    const filteredProjects = useMemo(() => {
        if (!activeMood) return [];
        return projects.slice(0, 8); // Mock subset
    }, [projects, activeMood]);

    return (
        <section ref={sectionRef} className={cn("space-y-12 py-24 relative overflow-hidden bg-bg-cream text-bg-dark px-6 lg:px-12 max-w-[1800px] mx-auto", isVisible ? "animate-fade-in-up" : "opacity-0")}>

            {/* SVG grid pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05]" aria-hidden="true">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="mood-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <rect width="40" height="40" fill="none" stroke="var(--color-bg-dark)" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#mood-grid)" />
                </svg>
            </div>

            {/* HEADER */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div className="flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="w-12 h-1 bg-accent inline-block" />
                        <span className="font-bold uppercase tracking-widest text-[#B83A2D] text-sm">Select Category</span>
                    </div>
                    <h2 className="font-editorial text-7xl md:text-8xl lg:text-9xl uppercase tracking-tighter leading-[0.85] text-bg-dark mix-blend-multiply drop-shadow-sm">
                        Find Your<br />Vibe
                    </h2>
                </div>
                <div className="font-serif italic text-lg max-w-sm text-bg-dark font-semibold border-l-4 border-accent pl-6 pb-2">
                    Choose a mood to see hand-picked recommendations matching your current state of mind.
                </div>
            </div>

            {/* MOOD CARDS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 relative z-10">
                {moods.map((mood, i) => {
                    const Icon = mood.icon;
                    const isActive = activeMood === mood.id;
                    return (
                        <button
                            key={mood.id}
                            onClick={() => setActiveMood(isActive ? null : mood.id)}
                            className={cn(
                                "group outline-none relative w-full aspect-square md:aspect-[3/4] p-6 border-4 flex flex-col justify-between items-start transition-all duration-300",
                                mood.color,
                                isActive
                                    ? "scale-[1.05] z-10 border-accent shadow-[12px_12px_0_var(--color-accent)] transform -translate-y-4"
                                    : "border-bg-dark shadow-[6px_6px_0_var(--color-bg-dark)] hover:shadow-[12px_12px_0_var(--color-bg-dark)] hover:-translate-y-2 hover:rotate-2 active:scale-95"
                            )}
                            style={{ animationDelay: `${(i + 1) * 100}ms` }}
                        >
                            <div className={cn(
                                "p-3 border-4 mb-4",
                                "border-current"
                            )}>
                                <Icon size={32} />
                            </div>

                            <div className="text-left w-full">
                                <h3 className="font-editorial text-4xl lg:text-5xl uppercase tracking-tighter leading-none mb-2">
                                    {mood.label}
                                </h3>
                                <p className="font-bold uppercase tracking-widest text-[10px] sm:text-xs">
                                    {mood.desc}
                                </p>
                            </div>

                            {/* Decorative crosshair */}
                            <div className="absolute top-4 right-4 text-2xl font-editorial opacity-50 select-none pointer-events-none group-hover:rotate-45 transition-transform duration-500">
                                +
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* EXPANDABLE RESULTS */}
            <div className={cn(
                "transition-all duration-700 ease-in-out relative z-10 overflow-hidden",
                activeMood ? "max-h-[1000px] opacity-100 translate-y-0" : "max-h-0 opacity-0 translate-y-10"
            )}>
                <div className="mt-16 pt-16 border-t-4 border-bg-dark">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-editorial text-4xl lg:text-5xl uppercase tracking-tighter flex items-center gap-4 text-bg-dark">
                            <span className="w-8 h-8 bg-accent " />
                            Recommended
                        </h3>
                        <Link href="/catalog" className="font-bold uppercase tracking-widest text-xs flex items-center gap-1 hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-1">
                            Browse All
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 px-2">
                        {filteredProjects.map((p, i) => (
                            <Link
                                key={p.id}
                                href={`/anime/${p.slug || p.id}`}
                                className="group block outline-none animate-fade-in-up"
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                <div className="aspect-[3/4] border-2 border-bg-dark overflow-hidden relative shadow-[4px_4px_0_var(--color-bg-dark)] group-hover:shadow-[8px_8px_0_var(--color-bg-dark)] group-hover:-translate-y-1 transition-all">
                                    <BlurImage
                                        src={p.image}
                                        alt={p.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale-[0.3] group-hover:grayscale-0"
                                    />
                                </div>
                                <h4 className="font-bold uppercase tracking-tight text-xs mt-3 mb-1 line-clamp-2 leading-snug group-hover:text-accent transition-colors">
                                    {p.title}
                                </h4>
                                <div className="flex items-center gap-1 text-[10px] text-accent font-bold">
                                    <Star size={10} className="fill-accent" /> {p.studio_rating}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
