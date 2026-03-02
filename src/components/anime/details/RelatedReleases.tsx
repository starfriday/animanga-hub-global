"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { TrendingUp, ChevronRight, Calendar, Star } from 'lucide-react';
import { BlurImage } from '@/components/ui/BlurImage';
import { cn } from '@/lib/utils';

interface RelatedRelease {
    relation: string;
    relation_russian: string;
    anime: {
        id: number;
        name: string;
        russian: string;
        image: {
            original: string;
            preview: string;
            x96: string;
            x48: string;
        };
        url: string;
        kind: string;
        score: string;
        status: string;
        episodes: number;
        episodes_aired: number;
        aired_on: string;
        released_on: string;
    } | null;
    manga: any | null;
}

interface RelatedReleasesProps {
    currentAnimeId: number;
    related: RelatedRelease[];
    className?: string;
}

export const RelatedReleases: React.FC<RelatedReleasesProps> = ({ currentAnimeId, related, className }) => {
    // Filter out entries that don't have an anime object (manga adaptation, etc. for now as we don't have manga pages yet)
    // and sort them by year if possible
    const sortedRelated = useMemo(() => {
        if (!related) return [];
        return related
            .filter(r => r.anime !== null)
            .sort((a, b) => {
                const yearA = a.anime?.aired_on ? parseInt(a.anime.aired_on.split('-')[0]) : 0;
                const yearB = b.anime?.aired_on ? parseInt(b.anime.aired_on.split('-')[0]) : 0;
                return yearA - yearB;
            });
    }, [related]);

    if (sortedRelated.length === 0) return null;

    return (
        <div className={cn("space-y-8", className)}>
            <div className="flex items-center justify-between border-b-4 border-bg-dark pb-3">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-accent border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)]" />
                    <h3 className="text-xl font-editorial uppercase tracking-tight text-bg-dark">Связанные релизы</h3>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-bg-dark/40">
                    {sortedRelated.length} тайтлов
                </div>
            </div>

            <div className="relative space-y-4 before:absolute before:left-[27px] before:top-2 before:bottom-2 before:w-1 before:bg-bg-dark">
                {sortedRelated.map((r, idx) => {
                    const anime = r.anime!;
                    const isCurrent = anime.id === currentAnimeId;
                    const year = anime.aired_on ? anime.aired_on.split('-')[0] : 'TBA';

                    return (
                        <div key={anime.id} className="relative pl-14 group">
                            {/* Chronology Dot */}
                            <div className={cn(
                                "absolute left-[24.5px] top-1/2 -translate-y-1/2 border-2 border-bg-dark transition-all z-10",
                                isCurrent
                                    ? "w-3 h-3 bg-accent shadow-[2px_2px_0_var(--color-bg-dark)] scale-125"
                                    : "w-2.5 h-2.5 bg-white group-hover:bg-bg-dark"
                            )} />

                            <Link
                                href={`/anime/${anime.id}`}
                                className={cn(
                                    "flex items-center gap-4 p-3 border-4 transition-all outline-none",
                                    isCurrent
                                        ? "bg-white border-bg-dark shadow-[4px_4px_0_var(--color-bg-dark)] -translate-y-1 -translate-x-1"
                                        : "bg-transparent border-transparent hover:bg-white hover:border-bg-dark hover:shadow-[4px_4px_0_var(--color-bg-dark)] hover:-translate-y-1 hover:-translate-x-1"
                                )}
                            >
                                <div className="w-12 h-16 bg-bg-cream border-2 border-bg-dark overflow-hidden flex-shrink-0">
                                    <BlurImage
                                        src={anime.image?.original ? `https://shikimori.one${anime.image.original}` : ''}
                                        alt={anime.russian || anime.name}
                                        className="w-full h-full object-cover mix-blend-multiply"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="text-[9px] font-black text-accent uppercase tracking-widest mb-1">
                                        {r.relation_russian}
                                    </div>
                                    <div className={cn(
                                        "text-sm font-editorial uppercase tracking-tight line-clamp-1 transition-colors leading-tight",
                                        isCurrent ? "text-accent" : "text-bg-dark group-hover:text-accent"
                                    )}>
                                        {anime.russian || anime.name}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className="text-[9px] font-black text-bg-dark/50 uppercase tracking-widest flex items-center gap-1">
                                            <Calendar size={10} /> {year}
                                        </span>
                                        <span className="text-[9px] font-black text-bg-dark/50 uppercase tracking-widest flex items-center gap-1">
                                            <Star size={10} className="fill-accent text-accent" /> {anime.score}
                                        </span>
                                    </div>
                                </div>

                                <ChevronRight size={16} className={cn(
                                    "text-bg-dark transition-transform text-opacity-0 group-hover:text-opacity-100 group-hover:translate-x-1",
                                    isCurrent ? "text-opacity-100" : ""
                                )} />
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
