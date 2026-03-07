"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ensureFullUrl } from '@/lib/imageUtils';

export interface RelatedRelease {
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
    manga: Record<string, unknown> | null;
}

interface RelatedReleasesProps {
    currentAnimeId: string | number;
    related: RelatedRelease[];
    className?: string;
}

export const RelatedReleases: React.FC<RelatedReleasesProps> = ({ currentAnimeId, related, className }) => {
    // Filter out entries that don't have an anime object
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
        <div className={cn("space-y-6", className)}>
            <div className="flex items-center justify-between border-b-[3px] border-bg-dark pb-3">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-accent border-[3px] border-bg-dark/10" />
                    <h3 className="text-xl font-editorial uppercase tracking-tight text-bg-dark italic">Rel.Connections</h3>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-20 hidden sm:block">
                    {sortedRelated.length} UNITS.SYNC
                </div>
            </div>

            <div className="relative space-y-4 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-bg-dark/5">
                {sortedRelated.map((r) => {
                    const anime = r.anime!;
                    const isCurrent = String(anime.id) === String(currentAnimeId);
                    const year = anime.aired_on ? anime.aired_on.split('-')[0] : 'TBA';

                    return (
                        <div key={anime.id} className="relative pl-8 group">
                            {/* Chronology Dot */}
                            <div className={cn(
                                "absolute left-[11px] top-4 border-[3px] border-bg-cream transition-all z-10 rounded-full",
                                isCurrent
                                    ? "w-3 h-3 bg-accent shadow-[0_0_8px_var(--color-accent)] scale-125"
                                    : "w-2.5 h-2.5 bg-bg-dark group-hover:bg-accent"
                            )} />

                            <Link
                                href={`/anime/${anime.id}`}
                                className={cn(
                                    "flex items-center gap-4 p-3 bg-white border border-bg-dark/5 transition-all outline-none group/card",
                                    isCurrent
                                        ? "border-accent bg-accent/[0.03] shadow-[4px_4px_0_var(--color-accent)]"
                                        : "hover:border-bg-dark hover:shadow-[4px_4px_0_var(--color-bg-dark)] hover:-translate-y-0.5"
                                )}
                            >
                                <div className="w-10 h-14 bg-bg-cream border border-bg-dark/10 overflow-hidden shrink-0 relative">
                                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover/card:opacity-100 animate-scan z-10 pointer-events-none" />
                                    <Image
                                        src={anime.image?.original ? ensureFullUrl(anime.image.original) : ''}
                                        alt={anime.russian || anime.name}
                                        fill
                                        unoptimized
                                        referrerPolicy="no-referrer"
                                        className="object-cover grayscale group-hover/card:grayscale-0 transition-all duration-500"
                                        sizes="40px"
                                    />
                                </div>

                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="text-[8px] font-black text-accent uppercase tracking-widest leading-none">
                                        {r.relation_russian}
                                    </div>
                                    <div className={cn(
                                        "text-[13px] font-editorial uppercase tracking-tight line-clamp-1 transition-colors leading-tight italic",
                                        isCurrent ? "text-accent" : "text-bg-dark group-hover/card:text-accent"
                                    )}>
                                        {anime.russian || anime.name}
                                    </div>
                                    <div className="flex items-center gap-3 opacity-30">
                                        <span className="text-[9px] font-mono tracking-tighter uppercase whitespace-nowrap">REF: {anime.id}</span>
                                        <span className="text-[9px] font-mono tracking-tighter uppercase whitespace-nowrap">{year}</span>
                                    </div>
                                </div>

                                <ChevronRight size={14} className={cn(
                                    "text-bg-dark transition-all opacity-0 group-hover/card:opacity-100 group-hover/card:translate-x-1",
                                    isCurrent ? "opacity-100 text-accent font-bold" : ""
                                )} />
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
