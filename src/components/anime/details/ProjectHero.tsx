"use client";

import React, { useState } from 'react';
import { Star, Calendar, Film, Play, Check, Bookmark, Award, Share2, Clock } from 'lucide-react';
import { BlurImage } from '@/components/ui/BlurImage';
import { cn } from '@/lib/utils';
import { FavoriteButton } from '@/components/anime/FavoriteButton';

export interface ProjectHeroProps {
    project: any;
    userRating: number;
    currentStatus: string | null;
    duration?: number;
    nextEpisodeLabel: string;
    onPlay: () => void;
    onRate: (rating: number) => void;
    onToggleList: () => void;
    onShare: () => void;
    isMobile?: boolean;
}

export const ProjectHero: React.FC<ProjectHeroProps> = ({
    project,
    userRating,
    currentStatus,
    duration,
    nextEpisodeLabel,
    onPlay,
    onRate,
    onToggleList,
    onShare,
    isMobile
}) => {
    const [showRating, setShowRating] = useState(false);

    const formatDuration = (mins?: number) => {
        if (!mins) return 'N/A';
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return h > 0 ? `${h}ч ${m}м` : `${m}м`;
    };

    const displayBanner = isMobile ? (project.image || project.banner) : (project.banner || project.image);

    return (
        <section className="relative min-h-[85svh] md:min-h-0 md:h-[80vh] w-full bg-bg-cream flex items-center pt-32 lg:pt-24 border-b-4 border-bg-dark overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(var(--color-bg-dark) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <div className="container mx-auto px-4 md:px-8 max-w-[1400px] relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20 pb-12 md:pb-0">

                {/* Left: Content */}
                <div className="flex-1 space-y-8 anim-reveal-up w-full max-w-2xl py-8">
                    {/* Logo or Title */}
                    <div className="space-y-4">
                        {project.logoImage ? (
                            <img
                                src={project.logoImage}
                                alt={project.title}
                                className="max-h-24 sm:max-h-32 md:max-h-48 w-auto max-w-full object-contain filter drop-shadow-[4px_4px_0_var(--color-bg-dark)]"
                            />
                        ) : (
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] font-editorial uppercase tracking-tighter leading-[0.85] text-bg-dark drop-shadow-sm anim-hero-title mix-blend-multiply break-words" style={{ wordBreak: 'break-word', hyphens: 'auto' }}>
                                {project.title?.split(' ').map((word: string, i: number) => (
                                    <span key={i} className={i % 2 === 1 ? 'text-accent' : ''}>{word} </span>
                                ))}
                            </h1>
                        )}

                        {project.originalTitle && (
                            <p className="text-sm md:text-xl font-bold text-bg-dark/40 uppercase tracking-[0.2em] italic anim-hero-meta">
                                {project.originalTitle}
                            </p>
                        )}
                    </div>

                    {/* Metadata Quick Bar */}
                    <div className="flex flex-wrap items-center gap-3 text-[10px] md:text-xs font-black uppercase tracking-widest text-bg-dark anim-hero-meta">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)]">
                            <Star size={14} className="fill-accent text-accent" /> {project.studio_rating || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)]">
                            <Calendar size={14} /> {project.year}
                        </div>
                        {duration && duration > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)]">
                                <Clock size={14} /> {formatDuration(duration)}
                            </div>
                        )}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)]">
                            <Film size={14} /> {project.type}
                        </div>

                        {/* Inline Brutalist Status Badge */}
                        <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)]",
                            project.status === 'Ongoing' ? 'bg-green-400 text-bg-dark' :
                                project.status === 'Completed' ? 'bg-accent text-white' :
                                    'bg-yellow-400 text-bg-dark'
                        )}>
                            {project.status === 'Ongoing' && <span className="w-2 h-2 rounded-full border border-bg-dark bg-white animate-pulse" />}
                            {project.status === 'Ongoing' ? 'ЭФИР' : project.status === 'Completed' ? 'ЗАВЕРШЕН' : 'АНОНС'}
                        </div>
                    </div>

                    {/* Core Actions */}
                    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 pt-4 anim-hero-cta w-full">
                        <button
                            onClick={onPlay}
                            className="btn-haptic w-full sm:w-auto justify-center group flex items-center gap-3 px-10 py-5 bg-accent text-cream font-editorial uppercase tracking-widest text-xl md:text-2xl border-2 border-bg-dark shadow-[6px_6px_0_var(--color-bg-dark)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 outline-none transition-all"
                        >
                            <Play size={24} className="fill-current group-hover:scale-110 transition-transform" />
                            {nextEpisodeLabel}
                        </button>

                        <FavoriteButton animeId={String(project.id)} variant="brutalist" />

                        <div className="flex items-center w-full sm:w-auto bg-white border-2 border-bg-dark shadow-[6px_6px_0_var(--color-bg-dark)] shrink-0">
                            <button
                                onClick={() => setShowRating(!showRating)}
                                className={cn("btn-haptic w-1/2 sm:w-auto flex justify-center p-5 outline-none hover:bg-bg-dark/5 transition-colors", userRating > 0 ? "text-accent" : "text-bg-dark")}
                            >
                                <Award size={24} className={userRating > 0 ? "fill-accent" : ""} />
                            </button>
                            <div className="w-0.5 h-14 bg-bg-dark" />
                            <button onClick={onShare} className="btn-haptic w-1/2 sm:w-auto flex justify-center p-5 text-bg-dark hover:bg-bg-dark/5 outline-none transition-colors">
                                <Share2 size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Rating Selector Overlay */}
                    {showRating && (
                        <div className="absolute bottom-[20%] left-0 sm:left-[auto] flex items-center gap-1 p-3 bg-bg-cream border-4 border-bg-dark shadow-[8px_8px_0_var(--color-bg-dark)] anim-reveal-up z-50" style={{ animationDuration: '0.3s' }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                                <button
                                    key={star}
                                    onClick={() => { onRate(star); setShowRating(false); }}
                                    className="p-1 outline-none transition-transform hover:-translate-y-1"
                                >
                                    <Star size={24} className={cn(userRating >= star ? "fill-accent text-accent" : "text-bg-dark/20")} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Poster Image Frame */}
                <div className="w-[70%] sm:w-[50%] md:w-[320px] lg:w-[380px] aspect-[2/3] shrink-0 border-8 border-bg-dark shadow-[16px_16px_0_var(--color-bg-dark)] relative group anim-reveal-up bg-white rotate-2 hover:rotate-0 transition-transform duration-500 z-10 mx-auto md:mx-0" style={{ animationDelay: '200ms' }}>
                    <BlurImage
                        src={displayBanner}
                        alt={project.title}
                        className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 mix-blend-multiply transition-opacity duration-500 pointer-events-none" />
                </div>
            </div>
        </section>
    );
};
