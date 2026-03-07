"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ChevronLeft, Radio, Share2 } from 'lucide-react';
import { WorldMovie } from './constants';

interface CinematicRadarProps {
    movies: WorldMovie[];
}

export function CinematicRadar({ movies }: CinematicRadarProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = current.clientWidth * 0.8;
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (!movies || movies.length === 0) return null;

    return (
        <section className="w-full py-24 lg:py-32 border-b-4 border-bg-dark bg-bg-cream relative overflow-hidden">
            {/* Background HUD Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg width="100%" height="100%">
                    <pattern id="radar-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="1" fill="currentColor" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#radar-grid)" />
                </svg>
            </div>

            <div className="max-w-[1800px] mx-auto px-4 lg:px-12 flex flex-col gap-12 relative z-10">

                {/* Header: Signal Scan HUD */}
                <div className="flex flex-col md:flex-row items-end justify-between border-b-[3px] border-bg-dark pb-6 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Radio size={18} className="text-accent animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Frequency.Scan: High.Priority</span>
                        </div>
                        <h2 className="font-editorial text-5xl lg:text-7xl italic uppercase tracking-tighter text-bg-dark">
                            Сигнальный <span className="text-accent underline decoration-[6px] underline-offset-8">Радар</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col text-right text-[9px] font-black uppercase tracking-widest text-bg-dark/30">
                            <span>Scanning.Registry</span>
                            <span>Points.Detected: {movies.length}</span>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => scroll('left')}
                                className="w-14 h-14 flex items-center justify-center border-[3px] border-bg-dark bg-white hover:bg-bg-dark hover:text-white transition-all active:scale-90 shadow-solid-sm hover:shadow-none translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0"
                            >
                                <ChevronLeft size={28} />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="w-14 h-14 flex items-center justify-center border-[3px] border-bg-dark bg-white hover:bg-bg-dark hover:text-white transition-all active:scale-90 shadow-solid-sm hover:shadow-none translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0"
                            >
                                <ChevronRight size={28} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Radar Scroll Rail */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-8 lg:gap-12 pb-12 pt-4 hide-scrollbar snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {movies.map((movie, idx) => (
                        <div key={movie.id} className="min-w-[320px] lg:min-w-[500px] snap-center group relative">
                            {/* Card Shadow */}
                            <div className="absolute top-4 left-4 w-full h-full bg-bg-dark border-[3px] border-bg-dark transition-transform group-hover:translate-x-2 group-hover:translate-y-2 z-0" />

                            <Link href={`/anime/${movie.id}`} className="relative block z-10 w-full bg-white border-[3px] border-bg-dark p-6 transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
                                {/* Top HUD Meta */}
                                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-bg-dark/5">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-accent uppercase tracking-widest">Entry.Point</span>
                                        <span className="text-xl font-editorial italic text-bg-dark">#{String(idx + 1).padStart(2, '0')}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-right">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-bg-dark/30 uppercase tracking-widest">Status</span>
                                            <span className="text-xs font-black text-bg-dark uppercase">Captured</span>
                                        </div>
                                        <Share2 size={16} className="text-bg-dark/20" />
                                    </div>
                                </div>

                                {/* Main Visual Focal */}
                                <div className="w-full aspect-video bg-bg-dark border-2 border-bg-dark mb-6 overflow-hidden relative group/frame">
                                    <Image
                                        src={`https://shikimori.one${movie.image?.original}`}
                                        alt={movie.name}
                                        fill
                                        unoptimized
                                        referrerPolicy="no-referrer"
                                        className="object-cover grayscale hover:grayscale-0 transition-all duration-700 opacity-90 group-hover/frame:scale-110"
                                        sizes="(max-width: 1024px) 100vw, 500px"
                                    />
                                    {/* Score Focal Point */}
                                    <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 text-sm font-black border-2 border-bg-dark shadow-solid-xs">
                                        {movie.score || '0.0'}
                                    </div>
                                    <div className="absolute inset-0 border-[16px] border-transparent group-hover/frame:border-white/10 transition-all pointer-events-none" />
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-editorial text-3xl lg:text-4xl italic uppercase tracking-tighter text-bg-dark line-clamp-1 leading-none">
                                        {movie.russian || movie.name}
                                    </h3>

                                    {/* Progress Tracker Hook */}
                                    <div className="h-1 w-full bg-bg-dark/5 relative">
                                        <div
                                            className="h-full bg-bg-dark transition-all duration-1000 group-hover:w-full"
                                            style={{ width: `${(movie.score || 0) * 10}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-bg-dark/40">
                                        <span>Year: {movie.aired_on ? new Date(movie.aired_on).getFullYear() : 'TBA'}</span>
                                        <span className="text-accent underline decoration-2 underline-offset-4 cursor-pointer">Download.Manifest</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
