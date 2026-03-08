"use client";

import React from 'react';
import { Play, Share2, Plus } from 'lucide-react';
import { BlurImage } from '@/components/ui/BlurImage';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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
        status?: string;
        episodes_aired?: number;
        episodes_total?: number;
        studio?: string;
        genres?: { id: string | number; name: string; russian?: string }[];
        [key: string]: unknown;
    };
    nextEpisodeLabel: string;
    onPlay: () => void;
    onAddToList: () => void;
    onShare: () => void;
    isMobile?: boolean;
}

export const ProjectHero: React.FC<ProjectHeroProps> = ({
    project,
    nextEpisodeLabel,
    onPlay,
    onAddToList,
    onShare,
    isMobile
}) => {
    const displayBanner = isMobile ? (project.image || project.banner) : (project.banner || project.image);

    return (
        <section className="relative w-full min-h-[75vh] flex items-end pb-24 pt-32 px-4 lg:px-12 overflow-hidden group rounded-b-3xl -mt-16">
            {/* Background Image with blur and gradient overlay */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none bg-bg-cream">
                <BlurImage
                    src={displayBanner || ''}
                    alt=""
                    className="object-cover w-full h-full scale-105 group-hover:scale-110 transition-transform duration-[10s] ease-out opacity-20 contrast-125 saturate-50"
                />
                {/* Gradient Masks */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-cream via-bg-cream/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-bg-cream via-bg-cream/60 to-transparent" />
            </div>

            <div className="max-w-[1600px] w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">

                {/* Content Section */}
                <div className="lg:col-span-8 flex flex-col justify-end space-y-8">
                    {/* Top Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-bg-dark/70 uppercase tracking-wider">
                        {project.type && (
                            <span className="px-3 py-1 bg-black/5 rounded-full backdrop-blur-md border border-black/10">
                                {project.type}
                            </span>
                        )}
                        <span>{project.year || 'TBA'}</span>
                        {project.studio && (
                            <>
                                <div className="w-1.5 h-1.5 rounded-full bg-bg-dark/30" />
                                <span>{project.studio}</span>
                            </>
                        )}
                    </div>

                    {/* Title */}
                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-bg-dark leading-tight drop-shadow-md"
                        title={project.title}
                    >
                        {project.title}
                    </h1>

                    {/* Original Title & Genres */}
                    <div className="space-y-4">
                        {project.originalTitle && (
                            <p className="text-lg md:text-xl text-bg-dark/50 font-medium italic">
                                {project.originalTitle}
                            </p>
                        )}

                        {project.genres && project.genres.length > 0 && (
                            <div className="flex flex-wrap gap-2 text-[11px] font-bold tracking-wide">
                                {project.genres.slice(0, 5).map((g, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-accent/10 text-accent rounded-full border border-accent/20 backdrop-blur-sm">
                                        {g.russian || g.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-4 pt-6">
                        {/* Play Button */}
                        <div className="flex items-center gap-4 pt-6">
                            <button
                                onClick={onPlay}
                                className="group/btn flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20 outline-none"
                            >
                                <Play size={22} fill="currentColor" />
                                <span>{nextEpisodeLabel}</span>
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={onAddToList}
                                    className="p-4 bg-black/5 border border-black/10 rounded-full hover:bg-black/10 text-bg-dark backdrop-blur-md transition-colors outline-none"
                                    title="Добавить в список"
                                >
                                    <Plus size={24} />
                                </button>

                                <button
                                    onClick={onShare}
                                    className="p-4 bg-black/5 border border-black/10 rounded-full hover:bg-black/10 text-bg-dark backdrop-blur-md transition-colors outline-none"
                                >
                                    <Share2 size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cover Image (Desktop only) */}
                <div className="hidden lg:block lg:col-span-4 relative">
                    <div className="relative w-[280px] xl:w-[320px] aspect-[2/3] ml-auto rounded-3xl overflow-hidden shadow-2xl shadow-black/20 border border-bg-dark/10 group-hover:-translate-y-4 group-hover:rotate-2 transition-all duration-700 ease-out">
                        <Image
                            src={project.image || ''}
                            alt={project.title}
                            fill
                            unoptimized
                            referrerPolicy="no-referrer"
                            className="object-cover"
                            sizes="320px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Status Badge */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-bg-dark/10 flex items-center gap-2 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                            <div className={cn(
                                "w-2 h-2 rounded-full shadow-sm",
                                project.status === 'released' ? 'bg-[#00ff88] shadow-[#00ff88]/50' :
                                    project.status === 'ongoing' ? 'bg-accent shadow-accent/50 animate-pulse' :
                                        'bg-bg-dark/50'
                            )} />
                            <span className="text-bg-dark text-[10px] font-bold uppercase tracking-widest">
                                {project.status === 'released' ? 'Завершен' : project.status === 'ongoing' ? 'Онгоинг' : 'Анонс'}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};
