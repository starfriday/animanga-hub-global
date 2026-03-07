"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Shield, Activity, Target, Zap } from 'lucide-react';
import { WorldMovie } from './constants';

interface WorldHeroProps {
    movie: WorldMovie;
}

export function WorldHero({ movie }: WorldHeroProps) {
    if (!movie) return null;

    const posterUrl = `https://shikimori.one${movie.image?.original}`;

    return (
        <section className="relative w-full min-h-[90vh] flex items-center justify-center px-4 lg:px-12 py-20 overflow-hidden bg-bg-cream group/hero">
            {/* Background Texture & Scanlines */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.03)_100%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.02)_50%)] z-10 pointer-events-none bg-[length:100%_4px]" />

            <div className="max-w-[1600px] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-20">

                {/* Left Side: Massive Vertical Metadata & HUD */}
                <div className="lg:col-span-1 hidden lg:flex flex-col items-center justify-between self-stretch py-4 border-r-2 border-bg-dark/10">
                    <div className="flex flex-col gap-8 items-center rotate-180 [writing-mode:vertical-lr] text-[10px] font-black uppercase tracking-[0.5em] text-bg-dark/40">
                        <span>Global.Cinema.Registry</span>
                        <div className="h-12 w-[2px] bg-accent animate-pulse" />
                        <span>Protocol.V7.Active</span>
                    </div>
                    <div className="flex flex-col gap-4 text-accent">
                        <Shield size={16} />
                        <Activity size={16} />
                        <Zap size={16} className="animate-pulse" />
                    </div>
                </div>

                {/* Center: The Monolith Poster */}
                <div className="lg:col-span-5 relative group/poster">
                    {/* Industrial Frame */}
                    <div className="absolute -inset-4 border-2 border-bg-dark/5 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-accent z-30" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-accent z-30" />

                    {/* Shadow Block */}
                    <div className="absolute top-8 left-8 w-full h-full bg-bg-dark border-[3px] border-bg-dark z-0 transition-transform group-hover/poster:translate-x-4 group-hover/poster:translate-y-4 duration-700 ease-out" />

                    <Link href={`/anime/${movie.id}`} className="relative block z-10 w-full aspect-[2/3] border-[4px] border-bg-dark bg-bg-dark overflow-hidden transition-transform duration-700 group-hover/poster:-translate-x-2 group-hover/poster:-translate-y-2 group-hover/poster:shadow-[20px_20px_40px_rgba(0,0,0,0.3)]">
                        <Image
                            src={posterUrl}
                            alt={movie.russian || movie.name}
                            fill
                            unoptimized
                            referrerPolicy="no-referrer"
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover/poster:scale-100"
                            priority
                            sizes="(max-width: 1024px) 100vw, 600px"
                        />

                        {/* Internal Scanline Overlay */}
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover/poster:opacity-100 animate-scan pointer-events-none z-20" />

                        {/* Top Left Tag */}
                        <div className="absolute top-6 left-0 bg-bg-dark text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest z-30 flex items-center gap-2">
                            <Target size={12} className="text-accent" />
                            <span>Visual.ID: {movie.id}</span>
                        </div>
                    </Link>

                    {/* Coordinates Background Label */}
                    <div className="absolute -bottom-12 -right-12 text-[120px] font-black text-bg-dark/[0.03] pointer-events-none uppercase tracking-tighter select-none">
                        {movie.id}
                    </div>
                </div>

                {/* Right Side: High-Density Info */}
                <div className="lg:col-span-6 flex flex-col justify-center space-y-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-[2px] w-12 bg-accent" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Feature.Focus</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-editorial italic uppercase tracking-tighter leading-[0.85] text-bg-dark drop-shadow-[4px_4px_0_white]">
                            {movie.russian || movie.name}
                        </h1>

                        <div className="flex items-center gap-6 text-xs font-black uppercase tracking-widest text-bg-dark/40">
                            <span>Year: {movie.aired_on ? new Date(movie.aired_on).getFullYear() : 'TBA'}</span>
                            <div className="h-1 w-1 bg-accent rounded-full" />
                            <span>Class: Cinematic.Unit</span>
                            <div className="h-1 w-1 bg-accent rounded-full" />
                            <span>Rating: {movie.score || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="max-w-xl space-y-8">
                        <p className="text-xl lg:text-2xl font-editorial leading-tight text-bg-dark/80 border-l-4 border-bg-dark pl-8 italic">
                            Кураторская единица высшего приоритета. Глобальный архив подтверждает исключительную ценность данной визуальной структуры в системе мирового кинематографа.
                        </p>

                        <div className="flex flex-wrap items-center gap-6 pt-8">
                            <Link
                                href={`/anime/${movie.id}`}
                                className="group/btn relative flex items-center gap-6 px-12 py-6 bg-bg-dark text-white border-[3px] border-bg-dark hover:bg-white hover:text-bg-dark transition-all duration-500 shadow-[12px_12px_0_var(--color-accent)] hover:shadow-none translate-x-[-12px] translate-y-[-12px] hover:translate-x-0 hover:translate-y-0"
                            >
                                <Play size={24} fill="currentColor" />
                                <span className="font-editorial text-2xl uppercase tracking-widest italic">Вступить</span>
                                <div className="absolute inset-0 border-2 border-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                            </Link>

                            <div className="flex flex-col text-[10px] font-black uppercase tracking-widest space-y-1 opacity-40">
                                <span>Security.Level: 5</span>
                                <span>Status: Verified.Entity</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Corner Decorative Elements */}
            <div className="absolute top-12 left-12 w-32 h-32 border-t border-l border-bg-dark/10 pointer-events-none" />
            <div className="absolute bottom-12 right-12 w-32 h-32 border-b border-r border-bg-dark/10 pointer-events-none" />
        </section>
    );
}
