"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlurImage } from '@/components/ui/BlurImage';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type Mood = 'chill' | 'hype' | 'dark' | 'sad';

export function MoodEditorialPicks() {
    const [activeMood, setActiveMood] = useState<Mood | null>(null);
    const { ref: sectionRef, isVisible } = useScrollReveal(0.1);
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoadingMood, setIsLoadingMood] = useState(false);

    const moods: { id: Mood; label: string; labelEn: string; sublabel: string; kanji: string; genreIds: string[]; bgImage: string }[] = [
        { id: 'hype', label: 'АДРЕНАЛИН', labelEn: 'ADRENALINE', sublabel: 'Экшн, Спорт', kanji: '燃', genreIds: ['1', '30', '18'], bgImage: 'https://xlknusrqbgkbgzvzwdrx.supabase.co/storage/v1/object/public/images/Jujutsu%20Kaisen.jpg' },
        { id: 'dark', label: 'ТЁМНОЕ', labelEn: 'DARK', sublabel: 'Хоррор, Триллер', kanji: '闇', genreIds: ['14', '40', '41'], bgImage: 'https://xlknusrqbgkbgzvzwdrx.supabase.co/storage/v1/object/public/images/Berserk.jpg' },
        { id: 'chill', label: 'УЮТНОЕ', labelEn: 'COZY', sublabel: 'Повседневность, Комедия', kanji: '癒', genreIds: ['4', '36', '22'], bgImage: 'https://xlknusrqbgkbgzvzwdrx.supabase.co/storage/v1/object/public/images/Spy%20x%20Family.jpg' },
        { id: 'sad', label: 'ДУШЕВНОЕ', labelEn: 'HEARTFELT', sublabel: 'Драма, Трагедия', kanji: '泣', genreIds: ['8', '37'], bgImage: 'https://xlknusrqbgkbgzvzwdrx.supabase.co/storage/v1/object/public/images/Your%20Lie%20in%20April.jpg' },
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
            className="relative w-full bg-cream py-24 md:py-32 overflow-hidden"
        >
            <div className="absolute inset-0 pointer-events-none opacity-[0.15]" style={{ backgroundImage: 'var(--background-noise)' }} />

            <div className="max-w-[1800px] mx-auto px-4 lg:px-8 relative z-10">

                {/* Header */}
                <div className={cn(
                    "mb-16 flex flex-col transition-all duration-700",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}>
                    <h2 className="font-editorial text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-bg-dark leading-[0.8] mb-4">
                        ВЫБОР <br />
                        <span className="text-border-thick">НАСТРОЕНИЯ</span>
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-bg-dark text-cream flex items-center justify-center font-editorial font-bold shadow-solid-sm">
                            M
                        </div>
                        <p className="font-sans font-bold uppercase tracking-wider text-sm max-w-xs">
                            Выбери эмоциональное состояние. Мы подберём идеальный тайтл.
                        </p>
                    </div>
                </div>

                {/* Mood Typographic Blocks */}
                <div className={cn(
                    "flex flex-col border-y-8 border-bg-dark transition-all duration-700",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}>
                    {moods.map((mood, i) => {
                        const isActive = activeMood === mood.id;
                        return (
                            <button
                                key={mood.id}
                                onClick={() => setActiveMood(isActive ? null : mood.id)}
                                className={cn(
                                    "group relative w-full flex items-center justify-between border-b-4 border-bg-dark last:border-b-0 py-6 md:py-8 lg:py-12 px-4 md:px-8 transition-colors overflow-hidden outline-none",
                                    isActive ? "bg-accent text-cream border-x-8 border-x-bg-dark" : "hover:bg-bg-dark hover:text-cream border-x-0"
                                )}
                            >
                                {/* Background Image Reveal on Hover */}
                                <div className={cn(
                                    "absolute inset-0 z-0 transition-transform duration-700 ease-out origin-left pointer-events-none grayscale opacity-30",
                                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                )}>
                                    <div className="absolute inset-0">
                                        <BlurImage
                                            src={mood.bgImage}
                                            alt={mood.labelEn}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-bg-dark mix-blend-multiply opacity-50" />
                                    </div>
                                </div>

                                <div className="relative z-10 flex items-center gap-6 lg:gap-12 w-full mix-blend-difference">
                                    <span className="font-editorial text-6xl md:text-8xl lg:text-[10rem] leading-none uppercase tracking-tighter w-full text-left transition-transform group-hover:translate-x-4">
                                        {mood.label}
                                    </span>

                                    <div className="hidden lg:flex flex-col items-end text-right min-w-[200px]">
                                        <span className="font-kanji text-7xl font-black leading-none">{mood.kanji}</span>
                                        <span className="font-sans font-bold uppercase tracking-widest mt-2">[{mood.sublabel}]</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Results Section */}
                <div className={cn(
                    "mt-12 transition-all duration-500",
                    activeMood ? "opacity-100 min-h-[400px]" : "opacity-0 h-0 overflow-hidden"
                )}>
                    {isLoadingMood && (
                        <div className="flex justify-center items-center py-20 h-full w-full border-4 border-bg-dark border-dashed">
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 size={48} className="animate-spin text-bg-dark" />
                                <span className="font-editorial text-2xl uppercase tracking-widest animate-pulse">ОБРАБОТКА ДАННЫХ...</span>
                            </div>
                        </div>
                    )}

                    {!isLoadingMood && projects.length > 0 && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 bg-bg-dark p-6 md:p-8 border-4 border-bg-dark">
                            {projects.map((p, i) => (
                                <Link
                                    key={p.id}
                                    href={`/anime/${p.id}`}
                                    className="group block relative bg-cream border-2 border-cream p-1 animate-slide-up-fade outline-none"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden border-2 border-bg-dark shadow-solid-sm group-hover:shadow-solid transition-shadow">
                                        <BlurImage
                                            src={p.image || p.banner}
                                            alt={p.title}
                                            fill
                                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                                        />
                                        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply" style={{ backgroundImage: 'var(--background-dots)' }} />
                                    </div>
                                    <div className="p-3 bg-cream border-x-2 border-b-2 border-bg-dark mt-1 group-hover:-translate-y-1 transition-transform">
                                        <h3 className="font-editorial text-xl uppercase leading-tight text-bg-dark tracking-wide line-clamp-2">
                                            {p.title}
                                        </h3>
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t-2 border-bg-dark/20 text-xs font-mono font-bold uppercase">
                                            <span>ОЦЕНКА</span>
                                            <span>{(p.score || p.studio_rating || 0).toFixed(1)}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
