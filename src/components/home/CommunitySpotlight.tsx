"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Users, ArrowRight, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export const CommunitySpotlight = () => {
    const { ref: sectionRef, isVisible } = useScrollReveal(0.1);

    const activeTopics = [
        { id: '1', title: 'Анализ концовки Solo Leveling', authorName: 'HunterX', replies: 142, tags: ['ОБСУЖДЕНИЕ'] },
        { id: '2', title: 'Теории по Jujutsu Kaisen S2', authorName: 'Nanami', replies: 89, tags: ['ТЕОРИИ'] },
        { id: '3', title: 'Re:Zero Сезон 3 — Анонс!', authorName: 'EmiliaFan', replies: 315, tags: ['НОВОСТИ'] }
    ];

    const activeUsers = [
        { name: "HunterX", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HunterX" },
        { name: "Nanami", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nanami" },
        { name: "EmiliaFan", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=EmiliaFan" },
        { name: "Satoru", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Satoru" },
    ];

    return (
        <section ref={sectionRef} className="relative w-full bg-bg-cream text-bg-dark border-b-4 border-bg-dark overflow-hidden">

            {/* Aged paper texture */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-multiply"
                style={{ backgroundImage: 'var(--background-noise)', backgroundSize: '200px' }}
            />

            {/* Red accent top strip */}
            <div className="h-2 bg-accent w-full" />

            <div className="max-w-[1600px] mx-auto px-6 lg:px-16 py-20 sm:py-28 relative z-10">
                <div className={cn("flex flex-col lg:flex-row gap-12 lg:gap-20", isVisible ? "animate-fade-in-up" : "opacity-0")}>

                    {/* LEFT COLUMN: TITLE & COMMUNITY INFO */}
                    <div className="w-full lg:w-5/12">

                        {/* Section header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-3 h-3 bg-accent" />
                            <span className="font-black uppercase tracking-[0.3em] text-[10px] text-accent">РУБРИКА 03</span>
                        </div>

                        <h2 className="font-editorial text-6xl sm:text-7xl lg:text-8xl uppercase tracking-tighter leading-[0.85] text-bg-dark mb-2 mix-blend-multiply">
                            Клуб<br />
                            <span className="text-accent">Анимешников</span>
                        </h2>

                        <p className="font-serif text-bg-dark/60 leading-relaxed text-sm max-w-sm border-l-4 border-accent pl-5 mb-10 mt-6">
                            Обсуждайте любимые тайтлы, делитесь теориями и находите единомышленников в нашем сообществе.
                        </p>

                        {/* Active users card (vintage stamp style) */}
                        <div className="bg-white text-bg-dark p-6 sm:p-8 border-4 border-bg-dark shadow-[6px_6px_0_var(--color-accent)] relative w-fit">
                            {/* LIVE badge as red stamp */}
                            <div className="absolute -top-3 -right-3 bg-accent text-cream px-4 py-1.5 font-black text-[10px] uppercase tracking-widest border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)]">
                                ● ОНЛАЙН
                            </div>

                            <div className="flex items-center gap-3 mb-5">
                                <span className="font-editorial text-2xl uppercase tracking-tight">Сейчас активны</span>
                            </div>
                            <div className="flex -space-x-3">
                                {activeUsers.map((u, i) => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-bg-cream" style={{ zIndex: 10 - i }}>
                                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-full border-4 border-white bg-accent flex items-center justify-center font-editorial text-lg text-cream z-0">
                                    +42
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: DISCUSSIONS (newspaper column) */}
                    <div className="w-full lg:w-7/12 flex flex-col">
                        <div className="flex justify-between items-center mb-6 border-b-4 border-bg-dark pb-4">
                            <span className="font-black uppercase tracking-[0.2em] text-[10px] text-bg-dark/50">ПОСЛЕДНИЕ ОБСУЖДЕНИЯ</span>
                            <Link href="/team" className="font-black uppercase tracking-widest text-[10px] text-accent flex items-center gap-1 hover:text-bg-dark transition-colors">
                                Форум <ArrowRight size={12} />
                            </Link>
                        </div>

                        <div className="grid gap-4 sm:gap-5">
                            {activeTopics.map((topic, i) => (
                                <Link
                                    key={topic.id}
                                    href={`/team`}
                                    className="block p-5 sm:p-6 bg-white text-bg-dark border-4 border-bg-dark shadow-[4px_4px_0_var(--color-bg-dark)] hover:shadow-[8px_8px_0_var(--color-accent)] hover:-translate-y-1 hover:translate-x-[-2px] transition-all group"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-3">
                                        <div className="flex gap-2">
                                            {topic.tags.map(tag => (
                                                <span key={tag} className="bg-accent text-cream px-3 py-0.5 font-black text-[9px] uppercase tracking-widest">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="font-bold uppercase tracking-widest text-[10px] text-bg-dark/40 flex items-center gap-1.5">
                                            <MessageSquare size={11} className="text-accent" /> {topic.replies} ответов
                                        </div>
                                    </div>

                                    <h4 className="font-editorial text-xl sm:text-2xl uppercase leading-[0.9] tracking-tight group-hover:text-accent transition-colors mb-3">
                                        {topic.title}
                                    </h4>

                                    <div className="flex items-center gap-2 text-[10px] text-bg-dark/40">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                        <span className="font-bold">от {topic.authorName}</span>
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
                    コミュニティ
                </div>
            </div>
        </section>
    );
};
