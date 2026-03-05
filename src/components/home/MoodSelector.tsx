"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Coffee, Flame, Skull, CloudRain, Star, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurImage } from '@/components/ui/BlurImage';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type Mood = 'chill' | 'hype' | 'dark' | 'sad';

export const MoodSelector = () => {
    const [activeMood, setActiveMood] = useState<Mood | null>(null);
    const { ref: sectionRef, isVisible } = useScrollReveal(0.1);
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoadingMood, setIsLoadingMood] = useState(false);

    const moods: { id: Mood; label: string; labelEn: string; sublabel: string; icon: any; kanji: string; genreIds: string[] }[] = [
        { id: 'chill', label: 'УЮТНОЕ', labelEn: 'COZY', sublabel: 'Повседневность, Комедия', icon: Coffee, kanji: '癒', genreIds: ['4', '36', '22'] },
        { id: 'hype', label: 'АДРЕНАЛИН', labelEn: 'ADRENALINE', sublabel: 'Экшн, Спорт', icon: Flame, kanji: '燃', genreIds: ['1', '30', '18'] },
        { id: 'dark', label: 'ТЁМНОЕ', labelEn: 'DARK', sublabel: 'Хоррор, Триллер', icon: Skull, kanji: '闇', genreIds: ['14', '40', '41'] },
        { id: 'sad', label: 'ДУШЕВНОЕ', labelEn: 'HEARTFELT', sublabel: 'Драма, Трагедия', icon: CloudRain, kanji: '泣', genreIds: ['8', '37'] },
    ];

    useEffect(() => {
        if (!activeMood) { setProjects([]); return; }
        const mood = moods.find(m => m.id === activeMood);
        if (!mood) return;

        setIsLoadingMood(true);
        const genre = mood.genreIds[0];
        fetch(`/api/anime?genre=${genre}&order=ranked&limit=8`)
            .then(r => r.json())
            .then(data => setProjects(data.data || []))
            .catch(() => setProjects([]))
            .finally(() => setIsLoadingMood(false));
    }, [activeMood]);

    return (
        <section
            ref={sectionRef as any}
            className="relative w-full bg-[#f5ead6] py-20 md:py-28 overflow-hidden"
        >
            {/* Halftone */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(circle, #1a1a1a 1px, transparent 1px)`, backgroundSize: '6px 6px' }}
            />

            <div className="max-w-7xl mx-auto px-6 md:px-16">
                {/* Header */}
                <div className={cn(
                    "mb-12 transition-all duration-700",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}>
                    <h2 className="font-editorial text-5xl md:text-7xl uppercase tracking-tighter text-[#1a1411]">
                        MOOD <span className="text-[#b83a2d]">PICKS</span>
                    </h2>
                    <div className="w-16 h-1 bg-[#b83a2d] mt-3" />
                </div>

                {/* Vintage Ticket Buttons */}
                <div className={cn(
                    "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 transition-all duration-700",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}>
                    {moods.map((mood, i) => {
                        const Icon = mood.icon;
                        const isActive = activeMood === mood.id;
                        return (
                            <button
                                key={mood.id}
                                onClick={() => setActiveMood(isActive ? null : mood.id)}
                                className={cn(
                                    "group relative overflow-hidden transition-all duration-300 outline-none",
                                    "border-2 p-0",
                                    isActive
                                        ? "border-[#b83a2d] shadow-[4px_4px_0_rgba(184,58,45,0.5)] -translate-y-1"
                                        : "border-[#1a1411]/30 shadow-[3px_3px_0_rgba(26,20,17,0.2)] hover:shadow-[4px_4px_0_rgba(26,20,17,0.3)] hover:-translate-y-0.5"
                                )}
                                style={{ transitionDelay: `${i * 60}ms` }}
                            >
                                {/* Ticket body */}
                                <div className={cn(
                                    "relative p-4 md:p-5 transition-colors duration-300",
                                    isActive ? "bg-[#b83a2d]" : "bg-[#f0e4cc] group-hover:bg-[#e8dac0]"
                                )}>
                                    {/* Perforation line on left */}
                                    <div className="absolute left-0 top-0 bottom-0 w-3 flex flex-col justify-evenly items-center">
                                        {Array.from({ length: 8 }).map((_, j) => (
                                            <div key={j} className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                isActive ? "bg-[#f5ead6]/30" : "bg-[#1a1411]/10"
                                            )} />
                                        ))}
                                    </div>

                                    {/* Content */}
                                    <div className="pl-4 text-center">
                                        {/* Kanji */}
                                        <div className={cn(
                                            "text-3xl md:text-4xl font-bold mb-2 transition-colors",
                                            isActive ? "text-white/30" : "text-[#1a1411]/10"
                                        )}>
                                            {mood.kanji}
                                        </div>

                                        <Icon size={24} className={cn(
                                            "mx-auto mb-2 transition-colors",
                                            isActive ? "text-white" : "text-[#b83a2d]"
                                        )} />

                                        <div className={cn(
                                            "font-black text-xs tracking-widest transition-colors",
                                            isActive ? "text-white" : "text-[#1a1411]"
                                        )}>
                                            {mood.labelEn}
                                        </div>
                                        <div className={cn(
                                            "font-bold text-[10px] tracking-wider mt-0.5 transition-colors",
                                            isActive ? "text-white/70" : "text-[#1a1411]/50"
                                        )}>
                                            {mood.label}
                                        </div>

                                        <div className={cn(
                                            "text-[8px] tracking-wider mt-2 font-medium transition-colors",
                                            isActive ? "text-white/50" : "text-[#1a1411]/30"
                                        )}>
                                            ({mood.sublabel})
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Results */}
                {isLoadingMood && (
                    <div className="flex justify-center py-16">
                        <Loader2 size={32} className="animate-spin text-[#b83a2d]" />
                    </div>
                )}

                {!isLoadingMood && projects.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
                        {projects.map((p, i) => (
                            <Link
                                key={p.id}
                                href={`/anime/${p.id}`}
                                className="group relative block animate-fade-in-up"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <div className="relative bg-[#f0e4cc] border-2 border-[#1a1411]/20 shadow-[3px_3px_0_rgba(26,20,17,0.2)] overflow-hidden group-hover:shadow-[5px_5px_0_rgba(26,20,17,0.3)] group-hover:-translate-y-1 transition-all duration-300">
                                    <div className="relative aspect-[3/4] overflow-hidden">
                                        <BlurImage
                                            src={p.image || p.banner}
                                            alt={p.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                    </div>
                                    <div className="p-2.5 border-t-2 border-[#1a1411]/10">
                                        <div className="flex items-center gap-1 mb-1">
                                            <Star size={10} className="fill-[#b83a2d] text-[#b83a2d]" />
                                            <span className="text-[10px] font-black text-[#b83a2d]">{(p.studio_rating || 0).toFixed(1)}</span>
                                        </div>
                                        <h3 className="font-black text-[10px] uppercase leading-tight text-[#1a1411] tracking-wide line-clamp-2">
                                            {p.title}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
