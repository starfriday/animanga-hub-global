import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
        <div className="space-y-24 anim-reveal-up">
            {/* Personnel.Registry: Voice Actors & Characters */}
            {actorCredits && actorCredits.length > 0 && (
                <div className="space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="h-6 w-1 bg-accent" />
                        <h2 className="text-2xl md:text-4xl font-editorial uppercase tracking-tight text-bg-dark italic flex items-baseline gap-3">
                            Personnel.Registry
                            <span className="text-[10px] font-black not-italic opacity-20 font-mono tracking-widest">[ VOX.UNITS ]</span>
                        </h2>
                    </div>

                    <div className="flex overflow-x-auto snap-x hide-scrollbar gap-6 pb-4">
                        {actorCredits.map((c, i) => (
                            <div key={i} className="group flex bg-white border-[3px] border-bg-dark shadow-[8px_8px_0_var(--color-bg-dark)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all overflow-hidden relative shrink-0 snap-start w-[300px] md:w-[350px]">
                                {/* Character/Voice Unit Poster */}
                                <div className="relative w-24 h-32 md:w-32 md:h-40 border-r-[3px] border-bg-dark shrink-0 bg-bg-cream overflow-hidden">
                                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 animate-scan z-10 pointer-events-none" />
                                    {c.image ? (
                                        <Image
                                            src={c.image}
                                            alt={c.name}
                                            fill
                                            unoptimized
                                            referrerPolicy="no-referrer"
                                            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                            sizes="(max-width: 768px) 96px, 128px"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-bg-dark/5 flex items-center justify-center font-editorial text-4xl uppercase opacity-20">
                                            {c.name[0]}
                                        </div>
                                    )}
                                    {/* ID Marker */}
                                    <div className="absolute bottom-1 left-1 bg-bg-dark text-white text-[7px] font-mono px-1 py-0.5 opacity-40">
                                        VX-{i.toString().padStart(2, '0')}
                                    </div>
                                </div>

                                <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-1.5 h-1.5 rounded-full", c.isMain ? "bg-accent shadow-[0_0_8px_var(--color-accent)]" : "bg-bg-dark/20")} />
                                            <h4 className="font-editorial text-lg md:text-xl uppercase tracking-tight text-bg-dark group-hover:text-accent transition-colors truncate">
                                                {c.name}
                                            </h4>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-bg-dark/40 uppercase tracking-[0.2em] truncate">
                                                {c.characters.join(' / ') || 'Designated Role'}
                                            </p>
                                            {c.isMain && (
                                                <div className="inline-block bg-accent/10 text-accent text-[8px] font-black px-2 py-0.5 border border-accent/20">
                                                    CORE.UNIT
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-bg-dark/5 pt-2">
                                        <div className="text-[8px] font-mono text-bg-dark/20">STATUS: VERIFIED</div>
                                        {c.roles.includes('Voice Director') && (
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Voice Director" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Architecture.Lead: Creators */}
            {creators && creators.length > 0 && (
                <div className="space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="h-6 w-1 bg-accent" />
                        <h2 className="text-2xl md:text-4xl font-editorial uppercase tracking-tight text-bg-dark italic flex items-baseline gap-3">
                            Architecture.Lead
                            <span className="text-[10px] font-black not-italic opacity-20 font-mono tracking-widest">[ CMD.STRC ]</span>
                        </h2>
                    </div>

                    <div className="flex overflow-x-auto snap-x hide-scrollbar gap-8 pb-4">
                        {creators.map((c, i) => {
                            const personImg = c.customImage || getPersonData(c.personId)?.image;
                            return (
                                <div key={i} className="group flex items-center gap-6 p-6 bg-bg-dark text-white border-[3px] border-bg-dark shadow-[12px_12px_0_var(--color-accent)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all relative overflow-hidden shrink-0 snap-start w-[300px] md:w-[400px]">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rotate-45 translate-x-12 -translate-y-12" />

                                    <div className="relative w-20 h-20 md:w-24 md:h-24 border-2 border-white/20 shrink-0 bg-white/5 overflow-hidden">
                                        <div className="absolute inset-0 bg-white/10 animate-scan z-10" />
                                        {personImg ? (
                                            <Image
                                                src={personImg}
                                                alt={c.name}
                                                fill
                                                unoptimized
                                                referrerPolicy="no-referrer"
                                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                                sizes="(max-width: 768px) 80px, 96px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20 font-editorial text-4xl uppercase italic">
                                                ?
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3 relative z-10 flex-1">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-accent uppercase tracking-[0.3em] font-mono">{c.role}</p>
                                            <p className="text-2xl md:text-3xl font-editorial uppercase tracking-tighter text-white group-hover:text-accent transition-colors leading-none italic">
                                                {c.name}
                                            </p>
                                        </div>
                                        <div className="h-[1px] w-full bg-white/10" />
                                        <div className="text-[8px] font-mono text-white/30 tracking-widest uppercase">Security.Clearance: Level-5</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Logistics.Fleet: Staff Team */}
            {crewCredits && crewCredits.length > 0 && (
                <div className="space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="h-6 w-1 bg-accent" />
                        <h2 className="text-2xl md:text-4xl font-editorial uppercase tracking-tight text-bg-dark italic flex items-baseline gap-3">
                            Logistics.Fleet
                            <span className="text-[10px] font-black not-italic opacity-20 font-mono tracking-widest">[ STAFF.SYNC ]</span>
                        </h2>
                    </div>

                    <div className="flex overflow-x-auto snap-x hide-scrollbar gap-4 pb-4">
                        {crewCredits.map((c, i) => (
                            <Link
                                key={i}
                                href="/team"
                                className="group flex items-center gap-4 px-4 py-3 bg-white border-2 border-bg-dark hover:bg-bg-dark hover:text-white transition-all shadow-[4px_4px_0_var(--color-bg-dark)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 shrink-0 snap-start w-[220px] md:w-[260px]"
                            >
                                <div className="w-10 h-10 border-2 border-bg-dark shrink-0 bg-bg-cream overflow-hidden group-hover:border-white transition-colors relative">
                                    {c.customImage ? (
                                        <Image
                                            src={c.customImage}
                                            alt={c.name}
                                            fill
                                            unoptimized
                                            referrerPolicy="no-referrer"
                                            className="object-cover grayscale group-hover:grayscale-0 transition-all"
                                            sizes="40px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-bg-dark/40 text-lg font-editorial uppercase bg-bg-dark/5 group-hover:text-white group-hover:bg-accent transition-all">
                                            {c.name[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-[11px] font-black uppercase tracking-widest truncate leading-none">
                                        {c.name}
                                    </h4>
                                    <p className="text-[8px] font-black text-bg-dark/40 group-hover:text-white/40 uppercase tracking-widest transition-colors font-mono">
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
