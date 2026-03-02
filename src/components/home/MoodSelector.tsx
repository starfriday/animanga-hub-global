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

    const moods: { id: Mood; label: string; sublabel: string; icon: any; kanji: string; genres: string[] }[] = [
        { id: 'chill', label: 'Уютное', sublabel: 'Повседневность, Комедия', icon: Coffee, kanji: '癒', genres: ['Comedy', 'Slice of Life', 'Romance'] },
        { id: 'hype', label: 'Адреналин', sublabel: 'Экшн, Спорт', icon: Flame, kanji: '燃', genres: ['Action', 'Sports', 'Mecha'] },
        { id: 'dark', label: 'Тёмное', sublabel: 'Хоррор, Триллер', icon: Skull, kanji: '闇', genres: ['Horror', 'Psychological', 'Thriller'] },
        { id: 'sad', label: 'Душевное', sublabel: 'Драма, Трагедия', icon: CloudRain, kanji: '泣', genres: ['Drama', 'Supernatural'] },
    ];

    const filteredProjects = useMemo(() => {
        if (!activeMood) return [];
        return projects.slice(0, 8);
    }, [projects, activeMood]);

    return (
        <section ref={sectionRef} className="relative w-full overflow-hidden bg-bg-cream text-bg-dark border-b-4 border-bg-dark">

            {/* Aged paper texture */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-multiply"
                style={{ backgroundImage: 'var(--background-noise)', backgroundSize: '200px' }}
            />

            {/* Red top strip */}
            <div className="h-2 bg-accent w-full" />

            <div className={cn("max-w-[1600px] mx-auto px-6 lg:px-16 py-20 sm:py-28 relative z-10", isVisible ? "animate-fade-in-up" : "opacity-0")}>

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 border-b-4 border-bg-dark pb-8">
                    <div className="flex items-start gap-6">
                        <div className="font-editorial text-8xl sm:text-9xl text-accent/15 leading-none tracking-tighter select-none hidden sm:block">
                            04
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-3 h-3 bg-accent" />
                                <span className="font-black uppercase tracking-[0.3em] text-[10px] text-accent">РУБРИКА 04</span>
                            </div>
                            <h2 className="font-editorial text-6xl sm:text-7xl lg:text-8xl uppercase tracking-tighter leading-[0.85] text-bg-dark mix-blend-multiply">
                                Подбери<br />
                                <span className="text-accent">Настроение</span>
                            </h2>
                        </div>
                    </div>
                    <div className="font-serif text-bg-dark/60 text-sm max-w-sm border-l-4 border-accent pl-5 pb-2 italic leading-relaxed">
                        Выберите настроение и получите персональную подборку тайтлов по вашему вкусу.
                    </div>
                </div>

                {/* MOOD CARDS (vintage label cards) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {moods.map((mood, i) => {
                        const Icon = mood.icon;
                        const isActive = activeMood === mood.id;
                        return (
                            <button
                                key={mood.id}
                                onClick={() => setActiveMood(isActive ? null : mood.id)}
                                className={cn(
                                    "group outline-none relative w-full aspect-square sm:aspect-[3/4] p-5 sm:p-6 flex flex-col justify-between items-start transition-all duration-300 border-4",
                                    isActive
                                        ? "bg-accent text-cream border-bg-dark shadow-none translate-y-1 translate-x-1"
                                        : "bg-white text-bg-dark border-bg-dark shadow-[6px_6px_0_var(--color-accent)] hover:shadow-[3px_3px_0_var(--color-accent)] hover:translate-y-0.5 hover:translate-x-0.5 active:shadow-none active:translate-y-1.5 active:translate-x-1.5"
                                )}
                            >
                                {/* Kanji stamp */}
                                <div className={cn(
                                    "absolute top-3 right-3 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity",
                                    isActive ? "border-cream/40" : "border-accent/40"
                                )}>
                                    <span className="font-editorial text-lg sm:text-xl">{mood.kanji}</span>
                                </div>

                                {/* Icon */}
                                <div className={cn(
                                    "p-3 border-2 border-current mb-3",
                                )}>
                                    <Icon size={28} />
                                </div>

                                {/* Info */}
                                <div className="text-left w-full">
                                    <h3 className="font-editorial text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tighter leading-none mb-1">
                                        {mood.label}
                                    </h3>
                                    <p className="font-bold uppercase tracking-widest text-[8px] sm:text-[10px] opacity-60">
                                        {mood.sublabel}
                                    </p>
                                </div>

                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute bottom-3 right-3 w-3 h-3 bg-cream rounded-full animate-pulse-slow" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* EXPANDABLE RESULTS */}
                <div className={cn(
                    "transition-all duration-700 ease-in-out overflow-hidden",
                    activeMood ? "max-h-[1000px] opacity-100 translate-y-0" : "max-h-0 opacity-0 translate-y-10"
                )}>
                    <div className="mt-14 pt-10 border-t-4 border-bg-dark">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-editorial text-3xl sm:text-4xl uppercase tracking-tighter flex items-center gap-3 text-bg-dark">
                                <span className="w-3 h-3 bg-accent" />
                                Рекомендации
                            </h3>
                            <Link href="/catalog" className="font-black uppercase tracking-widest text-[10px] text-accent flex items-center gap-1 hover:text-bg-dark transition-colors">
                                Весь Каталог
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
                            {filteredProjects.map((p, i) => (
                                <Link
                                    key={p.id}
                                    href={`/anime/${p.slug || p.id}`}
                                    className="group block outline-none animate-fade-in-up"
                                    style={{ animationDelay: `${i * 50}ms` }}
                                >
                                    <div className="aspect-[3/4] border-3 border-bg-dark overflow-hidden relative shadow-[3px_3px_0_var(--color-accent)] group-hover:shadow-[5px_5px_0_var(--color-accent)] group-hover:-translate-y-1 transition-all">
                                        <BlurImage
                                            src={p.image}
                                            alt={p.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <h4 className="font-bold uppercase tracking-tight text-[10px] sm:text-xs mt-2 mb-0.5 line-clamp-2 leading-snug group-hover:text-accent transition-colors">
                                        {p.title}
                                    </h4>
                                    <div className="flex items-center gap-1 text-[10px] text-accent font-bold">
                                        <Star size={9} className="fill-accent" /> {p.studio_rating}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative vertical Japanese text */}
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none hidden xl:block opacity-[0.03]">
                <div className="font-editorial text-[16rem] leading-none text-bg-dark" style={{ writingMode: 'vertical-rl' }}>
                    気分選択
                </div>
            </div>
        </section>
    );
};
