"use client";

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ActorGroup {
    name: string;
    characters: string[];
    image?: string;
    isMain: boolean;
    roles: string[];
}

interface CrewMember {
    name: string;
    role: string;
    personId?: string;
    customImage?: string;
}

export interface ProjectCastProps {
    actorCredits: ActorGroup[];
    crewCredits: CrewMember[];
    creators?: CrewMember[]; // Used primarily in MovieProject
    actorsData?: any[];      // Fallback data if needed
    teamData?: any[];        // Fallback data if needed
}

export const ProjectCast: React.FC<ProjectCastProps> = ({
    actorCredits,
    crewCredits,
    creators = [],
    actorsData = [],
    teamData = []
}) => {

    const getPersonData = (personId?: string) => {
        if (!personId) return null;
        return (teamData || []).find(m => m.id === personId) || (actorsData || []).find(a => a.id === personId);
    };

    return (
        <div className="space-y-16 anim-reveal-up">
            {/* Voice Actors & Characters */}
            {actorCredits && actorCredits.length > 0 && (
                <div className="space-y-10">
                    <div className="flex items-center gap-3 border-b-4 border-bg-dark pb-3">
                        <div className="w-6 h-6 bg-accent border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)]" />
                        <h2 className="text-2xl md:text-4xl font-editorial uppercase tracking-tight text-bg-dark">Актеры & Герои</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                        {actorCredits.map((c, i) => (
                            <div key={i} className="group flex items-center gap-6 p-4 bg-white border-4 border-bg-dark shadow-[4px_4px_0_var(--color-bg-dark)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all">
                                <div className="relative w-16 h-16 md:w-20 md:h-20 border-4 border-bg-dark shrink-0 bg-bg-cream overflow-hidden">
                                    {c.image ? (
                                        <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover grayscale mix-blend-multiply group-hover:grayscale-0 transition-all duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-accent text-cream flex items-center justify-center font-editorial text-3xl uppercase">
                                            {c.name[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 space-y-2">
                                    <h4 className="font-editorial text-lg md:text-xl uppercase tracking-tight text-bg-dark group-hover:text-accent transition-colors truncate leading-none">
                                        {c.name}
                                    </h4>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-0.5 bg-bg-dark/20" />
                                            <p className="text-[10px] font-black text-bg-dark/50 uppercase tracking-widest truncate">
                                                {c.characters.join(' / ') || 'Роль в проекте'}
                                            </p>
                                        </div>
                                        {c.roles.includes('Voice Director') && (
                                            <p className="text-[9px] font-black text-accent uppercase tracking-widest ml-6">Режиссер озвучки</p>
                                        )}
                                    </div>
                                    {c.isMain && (
                                        <span className="inline-block px-2 py-1 bg-yellow-400 border-2 border-bg-dark text-[9px] font-black text-bg-dark uppercase tracking-widest shadow-[2px_2px_0_var(--color-bg-dark)]">
                                            ВЕДУЩАЯ РОЛЬ
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Creators — Directors / Writers etc. */}
            {creators && creators.length > 0 && (
                <div className="space-y-10">
                    <div className="flex items-center gap-3 border-b-4 border-bg-dark pb-3">
                        <div className="w-6 h-6 bg-accent border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)]" />
                        <h2 className="text-2xl md:text-4xl font-editorial uppercase tracking-tight text-bg-dark">Создатели</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {creators.map((c, i) => {
                            const personImg = c.customImage || getPersonData(c.personId)?.image;
                            return (
                                <div key={i} className="flex gap-5 group p-4 bg-white border-4 border-bg-dark shadow-[4px_4px_0_var(--color-bg-dark)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all">
                                    <div className="w-16 h-16 border-4 border-bg-dark shrink-0 bg-bg-cream overflow-hidden">
                                        {personImg ? (
                                            <img src={personImg} alt="" loading="lazy" className="w-full h-full object-cover mix-blend-multiply grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-cream bg-accent font-editorial text-2xl uppercase">
                                                {c.name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="justify-center flex flex-col gap-1.5">
                                        <p className="text-[10px] font-black text-bg-dark/50 uppercase tracking-widest">{c.role}</p>
                                        <p className="text-lg font-editorial uppercase tracking-tight text-bg-dark group-hover:text-accent transition-colors leading-none">
                                            {c.name}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Staff Team */}
            {crewCredits && crewCredits.length > 0 && (
                <div className="space-y-10">
                    <div className="flex items-center gap-3 border-b-4 border-bg-dark pb-3">
                        <div className="w-6 h-6 bg-accent border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)]" />
                        <h2 className="text-2xl md:text-4xl font-editorial uppercase tracking-tight text-bg-dark">Над проектом работали</h2>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        {crewCredits.map((c, i) => (
                            <Link
                                key={i}
                                href="/team"
                                className="group flex flex-col items-center text-center gap-4 p-4 border-4 border-transparent hover:border-bg-dark transition-all"
                            >
                                <div className="relative w-20 h-20 border-4 border-bg-dark bg-bg-cream overflow-hidden shadow-[4px_4px_0_var(--color-bg-dark)] group-hover:shadow-[2px_2px_0_var(--color-bg-dark)] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
                                    {c.customImage ? (
                                        <img src={c.customImage} alt="" loading="lazy" className="w-full h-full object-cover mix-blend-multiply grayscale group-hover:grayscale-0 transition-all" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-cream text-3xl font-editorial uppercase bg-accent">
                                            {c.name[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-editorial uppercase tracking-tight text-bg-dark group-hover:text-accent transition-colors">
                                        {c.name}
                                    </h4>
                                    <p className="text-[9px] font-black text-bg-dark/40 uppercase tracking-widest">
                                        {c.role}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
