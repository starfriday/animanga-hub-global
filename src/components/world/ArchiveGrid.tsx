"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MOCK_ARTICLE_TITLES, WorldMovie } from './constants';
import { Database, FileText, ChevronRight } from 'lucide-react';

interface ArchiveGridProps {
    movies: WorldMovie[];
}

export function ArchiveGrid({ movies }: ArchiveGridProps) {
    if (!movies || movies.length === 0) return null;

    return (
        <section className="w-full py-24 lg:py-32 bg-bg-cream relative">
            <div className="max-w-[1800px] mx-auto px-4 lg:px-12 flex flex-col gap-16">

                {/* Header: Database HUD */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b-[3px] border-bg-dark pb-8 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Database size={20} className="text-bg-dark/40" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-bg-dark/40">Archive.Volume: 2026.Cinema</span>
                        </div>
                        <h2 className="font-editorial text-6xl lg:text-8xl italic uppercase tracking-tighter text-bg-dark leading-none">
                            Кино <span className="text-accent underline decoration-[8px] underline-offset-8">Архив</span>
                        </h2>
                    </div>
                    <div className="max-w-md text-right flex flex-col items-end gap-4">
                        <p className="font-editorial text-xl italic leading-tight text-bg-dark/60">
                            Кураторская подборка кинематографических достижений в японской анимации, зафиксированная в глобальном реестре.
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent bg-accent/5 px-3 py-1 border border-accent/20">
                            <span className="animate-pulse">●</span> LIVE_DATABASE_FEED
                        </div>
                    </div>
                </div>

                {/* The Registry Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {movies.map((movie, idx) => {
                        const isFeatured = idx % 7 === 0;
                        const isQuote = idx % 11 === 5;

                        if (isQuote) {
                            return (
                                <div key={`quote-${idx}`} className="col-span-1 sm:col-span-2 lg:col-span-2 space-y-8 border-[3px] border-bg-dark p-10 lg:p-16 relative group bg-bg-dark text-white overflow-hidden shadow-[16px_16px_0_var(--color-accent)]">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 -rotate-45 translate-x-16 -translate-y-16" />
                                    <div className="flex items-center gap-3 opacity-40">
                                        <FileText size={16} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">System.Log: {idx.toString(16).toUpperCase()}</span>
                                    </div>
                                    <h3 className="font-editorial text-4xl lg:text-6xl italic uppercase tracking-tighter leading-[0.9] relative z-10">
                                        {MOCK_ARTICLE_TITLES[idx % MOCK_ARTICLE_TITLES.length]}
                                    </h3>
                                    <div className="pt-8 border-t border-white/10 flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60">
                                        <span>EDITORIAL_BRIEF</span>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => <div key={i} className="w-1 h-3 bg-accent/40" />)}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={movie.id} className={`${isFeatured ? 'col-span-1 sm:col-span-2 lg:col-span-2' : 'col-span-1'} group relative`}>
                                {/* Monolith Shadow */}
                                <div className="absolute top-3 left-3 w-full h-full bg-bg-dark transition-transform group-hover:translate-x-1 group-hover:translate-y-1 z-0" />

                                <Link href={`/anime/${movie.id}`} className="block relative z-10 w-full h-full bg-white border-[3px] border-bg-dark flex flex-col transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1 overflow-hidden">
                                    <div className={`w-full relative border-b-[3px] border-bg-dark bg-bg-dark overflow-hidden ${isFeatured ? 'aspect-[21/9]' : 'aspect-[4/5]'}`}>
                                        <Image
                                            src={`https://shikimori.one${movie.image?.original}`}
                                            alt={movie.name}
                                            fill
                                            unoptimized
                                            referrerPolicy="no-referrer"
                                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                            sizes={isFeatured ? "(max-width: 1024px) 100vw, 800px" : "400px"}
                                        />

                                        {/* Score Plate */}
                                        {movie.score !== undefined && movie.score > 0 && (
                                            <div className="absolute bottom-6 right-0 bg-accent text-white font-black text-2xl px-4 py-1 border-l-[3px] border-t-[3px] border-bg-dark shadow-solid-xs">
                                                {movie.score}
                                            </div>
                                        )}

                                        {/* HUD Focal Corners */}
                                        <div className="absolute top-4 left-4 w-4 h-[1px] bg-white/20" />
                                        <div className="absolute top-4 left-4 w-[1px] h-4 bg-white/20" />
                                    </div>

                                    <div className="p-8 flex flex-col flex-1 justify-between gap-6 bg-white">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-bg-dark/30">
                                                <div className="w-2 h-[2px] bg-accent" />
                                                <span>Registry.Entry</span>
                                            </div>
                                            <h3 className={`font-editorial italic uppercase tracking-tighter text-bg-dark leading-[0.85] ${isFeatured ? 'text-5xl lg:text-7xl' : 'text-3xl lg:text-4xl'}`}>
                                                {movie.russian || movie.name}
                                            </h3>
                                        </div>

                                        <div className="flex items-center justify-between text-[10px] font-black tracking-[0.2em] uppercase border-t-[2px] border-bg-dark/5 pt-6 mt-auto">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] opacity-30">DATE_SCAN</span>
                                                <span className="text-bg-dark/60">{movie.aired_on ? new Date(movie.aired_on).getFullYear() : 'TBA'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-accent group/link">
                                                <span className="underline decoration-2 underline-offset-4 group-hover/link:no-underline transition-all">MANIFEST</span>
                                                <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* Footer HUD Serial */}
                <div className="pt-20 border-t-2 border-bg-dark/5 flex justify-between items-center text-[10px] font-mono text-bg-dark/20 uppercase tracking-[0.8em]">
                    <span>Global.Archive.Unit-88</span>
                    <span>AV-2026-REGISTRY</span>
                    <span>Status: High.Density.Stream</span>
                </div>
            </div>
        </section>
    );
}
