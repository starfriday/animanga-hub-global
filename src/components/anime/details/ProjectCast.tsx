import React from 'react';
import Image from 'next/image';

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
    actorsData?: Array<{ id: string | number; image?: string;[key: string]: unknown }>;
    teamData?: Array<{ id: string | number; image?: string;[key: string]: unknown }>;
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
        <div className="space-y-16">

            {/* ACTORS (Characters) */}
            {actorCredits && actorCredits.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl md:text-3xl font-black text-bg-dark">В ролях</h2>
                    </div>

                    <div className="flex overflow-x-auto snap-x hide-scrollbar gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                        {actorCredits.map((c, i) => (
                            <div key={i} className="group relative bg-white border border-bg-dark/10 rounded-2xl p-3 flex gap-4 shrink-0 snap-start w-[280px] md:w-[320px] hover:border-accent hover:shadow-md transition-all">

                                {/* Character Avatar */}
                                <div className="relative w-16 h-20 md:w-20 md:h-24 rounded-xl shrink-0 overflow-hidden shadow-md group-hover:-translate-y-1 transition-transform duration-300">
                                    {c.image ? (
                                        <Image
                                            src={c.image}
                                            alt={c.name}
                                            fill
                                            unoptimized
                                            referrerPolicy="no-referrer"
                                            className="object-cover"
                                            sizes="96px"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-bg-dark/5 flex items-center justify-center text-3xl font-bold text-bg-dark/30 uppercase">
                                            {c.name[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 py-1">
                                    <h4 className="font-bold text-base text-bg-dark truncate group-hover:text-accent transition-colors" title={c.name}>
                                        {c.name}
                                    </h4>
                                    <p className="text-sm text-bg-dark/50 truncate" title={c.characters.join(', ')}>
                                        {c.characters.join(' / ') || 'Персонаж'}
                                    </p>

                                    {c.isMain && (
                                        <span className="inline-flex mt-1 w-max items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent">
                                            Главная роль
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* CREATORS (Directors, Writers, Studios) */}
            {creators && creators.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl md:text-3xl font-black text-bg-dark">Создатели</h2>
                    </div>

                    <div className="flex overflow-x-auto snap-x hide-scrollbar gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                        {creators.map((c, i) => {
                            const personImg = c.customImage || getPersonData(c.personId)?.image;
                            return (
                                <div key={i} className="group flex items-center gap-5 p-4 bg-white border border-bg-dark/10 rounded-2xl hover:border-accent hover:shadow-md transition-all shrink-0 snap-start w-[280px] md:w-[320px]">
                                    <div className="relative w-16 h-16 rounded-full shrink-0 overflow-hidden ring-2 ring-bg-dark/10 group-hover:ring-accent transition-all duration-300 shadow-sm group-hover:shadow-md">
                                        {personImg ? (
                                            <Image
                                                src={personImg}
                                                alt={c.name}
                                                fill
                                                unoptimized
                                                referrerPolicy="no-referrer"
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-bg-dark/5 flex items-center justify-center text-xl font-bold text-bg-dark/30 uppercase">
                                                {c.name[0]}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-bold text-accent uppercase tracking-wider mb-0.5 truncate">{c.role}</p>
                                        <p className="text-base font-bold text-bg-dark truncate group-hover:text-accent transition-colors">
                                            {c.name}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* FULL CREW (Logistics) */}
            {crewCredits && crewCredits.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl md:text-2xl font-black text-bg-dark/70">Техническая команда</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {crewCredits.map((c, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 bg-white rounded-xl border border-bg-dark/10 hover:border-accent hover:shadow-md transition-all group">
                                <div className="w-10 h-10 rounded-full bg-bg-dark/5 shrink-0 overflow-hidden relative">
                                    {c.customImage ? (
                                        <Image
                                            src={c.customImage}
                                            alt={c.name}
                                            fill
                                            unoptimized
                                            referrerPolicy="no-referrer"
                                            className="object-cover"
                                            sizes="40px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-bg-dark/40 text-sm font-bold uppercase">
                                            {c.name[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-sm font-bold text-bg-dark truncate group-hover:text-accent transition-colors">
                                        {c.name}
                                    </h4>
                                    <p className="text-xs text-bg-dark/50 truncate">
                                        {c.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};
