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
            <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-3">
                    <h3 className="text-xl md:text-2xl font-black text-bg-dark">Связанное</h3>
                </div>
                <div className="text-xs font-bold text-bg-dark/30 hidden sm:block">
                    {sortedRelated.length}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {sortedRelated.map((r) => {
                    const anime = r.anime!;
                    const isCurrent = String(anime.id) === String(currentAnimeId);
                    const year = anime.aired_on ? anime.aired_on.split('-')[0] : 'TBA';
                    const imgUrl = anime.image?.original ? ensureFullUrl(anime.image.original) : '';
                    const title = anime.russian || anime.name;

                    const isImportant = ['Sequel', 'Prequel', 'Main Story', 'Продолжение', 'Предыстория', 'Главная история']
                        .some(relation => relation === r.relation || relation === r.relation_russian);

                    return (
                        <div key={anime.id} className="relative group">

                            {/* Focus Indicator for current anime */}
                            {isCurrent && (
                                <div className="absolute -left-3 top-2 bottom-2 w-1 bg-accent rounded-r-md z-10" />
                            )}

                            <Link
                                href={`/anime/${anime.id}`}
                                className={cn(
                                    "relative flex items-center gap-4 p-3 bg-white border border-bg-dark/10 shadow-sm rounded-2xl transition-all overflow-hidden group/link",
                                    isCurrent ? "bg-accent/10 border-accent/20" : "hover:border-accent hover:shadow-md"
                                )}
                            >
                                {/* Hover Highlight */}
                                <div className="absolute inset-y-0 left-0 w-1 bg-accent opacity-0 group-hover/link:opacity-100 transition-opacity" />

                                <div className="relative w-12 h-16 md:w-16 md:h-20 shrink-0 rounded-lg overflow-hidden shadow-sm">
                                    {imgUrl ? (
                                        <Image
                                            src={imgUrl}
                                            alt={title}
                                            fill
                                            unoptimized
                                            referrerPolicy="no-referrer"
                                            className="object-cover group-hover/link:scale-110 transition-transform duration-500"
                                            sizes="64px"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-bg-dark/5 flex items-center justify-center font-bold text-bg-dark/30 text-xl">
                                            {title[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 pr-2 pb-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={cn(
                                            "truncate text-[10px] md:text-xs font-bold uppercase tracking-wider",
                                            isImportant || isCurrent ? "text-accent" : "text-bg-dark/40"
                                        )}>
                                            {r.relation_russian || r.relation || 'Связь'}
                                        </span>
                                        {anime.score && (
                                            <div className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold",
                                                isCurrent ? "bg-accent/20 text-accent" : "bg-black/5 text-bg-dark"
                                            )}>
                                                <span>★</span> {anime.score}
                                            </div>
                                        )}
                                    </div>
                                    <h4 className={cn(
                                        "text-sm md:text-base font-bold transition-colors truncate mb-1",
                                        isCurrent ? "text-accent" : "text-bg-dark group-hover/link:text-accent"
                                    )} title={title}>
                                        {title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-bg-dark/50 font-medium truncate">
                                        <span>{anime.kind === 'tv' ? 'ТВ Сериал' : anime.kind === 'movie' ? 'Фильм' : (anime.kind?.toUpperCase() || 'UNKNOWN')}</span>
                                        <span className="w-1 h-1 rounded-full bg-bg-dark/20" />
                                        <span>{year}</span>
                                        {anime.status && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-bg-dark/20" />
                                                <span>{anime.status === 'released' ? 'Вышло' : anime.status === 'ongoing' ? 'Онгоинг' : 'Анонс'}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <ChevronRight size={18} className={cn(
                                    "transition-all opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1",
                                    isCurrent ? "opacity-100 text-accent" : "text-bg-dark/30"
                                )} />
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
