"use client";

import React from 'react';
import { Play, Share2 } from 'lucide-react';
import { BlurImage } from '@/components/ui/BlurImage';
import { FavoriteButton } from '@/components/anime/FavoriteButton';

export interface ProjectHeroProps {
    project: {
        id: string | number;
        title: string;
        originalTitle?: string;
        type?: string;
        image?: string;
        banner?: string;
        year?: string | number;
        studio_rating?: string | number;
        [key: string]: unknown;
    };
    nextEpisodeLabel: string;
    onPlay: () => void;
    onShare: () => void;
    isMobile?: boolean;
}

export const ProjectHero: React.FC<ProjectHeroProps> = ({
    project,
    nextEpisodeLabel,
    onPlay,
    onShare,
    isMobile
}) => {
    const displayBanner = isMobile ? (project.image || project.banner) : (project.banner || project.image);

    return (
        <section className="relative min-h-[70vh] w-full bg-bg-dark border-[3px] border-bg-dark shadow-[20px_20px_0_var(--color-bg-dark)] overflow-hidden group/hero">
            {/* Background Layer: Massive Art */}
            <div className="absolute inset-0 opacity-40 grayscale group-hover/hero:grayscale-0 group-hover/hero:opacity-50 transition-all duration-1000 scale-105 group-hover/hero:scale-100">
                <BlurImage
                    src={displayBanner || ''}
                    alt=""
                    className="w-full h-full object-cover"
                />
            </div>

            {/* CRT Overlay Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 pointer-events-none bg-[length:100%_4px,3px_100%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent z-10" />

            <div className="relative z-20 h-full flex flex-col md:flex-row items-end md:items-stretch">

                {/* Left: Huge Title Monolith */}
                <div className="flex-1 p-8 md:p-16 flex flex-col justify-end gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-[2px] bg-accent" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent animate-pulse">Classification.Dossier</span>
                        </div>
                        <h1 className="text-5xl sm:text-7xl lg:text-9xl font-editorial uppercase tracking-tighter leading-[0.8] text-white italic drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
                            {project.title}
                        </h1>
                        <div className="flex items-center gap-6 text-xs font-black uppercase tracking-widest text-white/40">
                            <span>{project.originalTitle}</span>
                            <div className="h-1 w-1 bg-accent rounded-full" />
                            <span>{project.type}</span>
                        </div>
                    </div>

                    {/* Action Cluster HUD */}
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={onPlay}
                            className="group/play relative flex items-center gap-4 px-10 py-6 bg-accent border-[3px] border-white/20 hover:border-white text-white font-editorial uppercase tracking-widest text-2xl md:text-3xl transition-all active:scale-95 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/play:translate-x-[100%] transition-transform duration-500 italic" />
                            <Play size={28} fill="currentColor" className="relative z-10" />
                            <span className="relative z-10 italic">{nextEpisodeLabel}</span>
                        </button>

                        <div className="flex bg-white/5 border-[3px] border-white/10 backdrop-blur-md">
                            <FavoriteButton animeId={String(project.id)} variant="brutalist" className="!border-0 !shadow-none hover:bg-white/10 transition-colors" />
                            <div className="w-[2px] bg-white/10 h-16 self-center" />
                            <button
                                onClick={onShare}
                                className="w-16 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all outline-none"
                            >
                                <Share2 size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Technical Poster Frame */}
                <div className="hidden lg:flex w-[400px] border-l-[3px] border-white/10 bg-white/5 backdrop-blur-xl flex-col p-12 gap-8 justify-between relative overflow-hidden">
                    {/* Decorative scanline for the poster frame */}
                    <div className="absolute inset-0 bg-accent/5 animate-scan pointer-events-none" />

                    <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/30">
                            <span>Visual.Reference</span>
                            <span>Ref: {project.id}-00A</span>
                        </div>
                        <div className="aspect-[2/3] w-full border-[6px] border-white shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative group/frame overflow-hidden">
                            <BlurImage
                                src={project.image || ''}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover/frame:scale-110"
                            />
                            <div className="absolute inset-0 border-[20px] border-transparent group-hover/frame:border-white/20 transition-all pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Temporal.Signature</span>
                                <div className="text-4xl font-editorial text-white italic">{project.year}</div>
                            </div>
                            <div className="text-right space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Stream.Rating</span>
                                <div className="text-4xl font-editorial text-accent italic">{project.studio_rating}</div>
                            </div>
                        </div>
                        <div className="h-1 w-full bg-white/10">
                            <div className="h-full bg-accent w-[85%] relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/50 animate-scan" />
                            </div>
                        </div>
                    </div>

                    {/* Industrial serial numbers */}
                    <div className="absolute bottom-4 right-4 text-[8px] font-mono text-white/10 rotate-90 origin-right">
                        AX-77-B / PROTOCOL-9 / AV-2026
                    </div>
                </div>
            </div>
        </section>
    );
};
