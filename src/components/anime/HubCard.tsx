/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Link from 'next/link';
import { Play, BookOpen, Star } from 'lucide-react';
import { BlurImage } from '@/components/ui/BlurImage';
import { cn } from '@/lib/utils';
import { FavoriteButton } from '@/components/anime/FavoriteButton';

export const HubCard = ({ project, viewMode = 'grid' }: { project: any, viewMode?: 'grid' | 'list' }) => {
    const isReading = ['Manga', 'Novel', 'Comics'].includes(project.type);
    const lastEp = Array.isArray(project.episodes) ? (project.episodes.length ? Math.max(...project.episodes.map((e: any) => e.number)) : 0) : (project.episodes || 0);

    // ---------------------- LIST MODE ----------------------
    if (viewMode === 'list') {
        return (
            <Link
                href={`/anime/${project.id}`}
                className="group relative flex items-center gap-4 bg-white/60 backdrop-blur-md border border-bg-dark/5 p-3 rounded-2xl overflow-hidden outline-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
                {/* Image Container */}
                <div className="w-20 md:w-24 aspect-[2/3] rounded-xl overflow-hidden relative shrink-0 bg-bg-cream shadow-inner">
                    <BlurImage src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-bg-dark/40 backdrop-blur-[2px]">
                        <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                            {isReading ? <BookOpen size={16} /> : <Play size={16} className="ml-1 fill-white" />}
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-w-0 space-y-2 py-1">
                    <div className="flex items-center gap-2">
                        {project.studio_rating && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-[10px] font-bold uppercase tracking-widest text-accent border border-accent/20">
                                <Star size={10} className="fill-accent" />
                                {project.studio_rating}
                            </div>
                        )}
                        <span className="text-bg-dark/60 text-[10px] font-bold uppercase tracking-widest border border-bg-dark/10 rounded-full px-2 py-1 bg-white/50">
                            {project.type}
                        </span>
                    </div>
                    <h3 className="font-bold text-lg md:text-xl text-bg-dark line-clamp-1 group-hover:text-accent transition-colors duration-300 tracking-tight">
                        {project.title}
                    </h3>
                </div>

                {/* Left accent border on hover */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-accent group-hover:h-3/4 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100" />
            </Link>
        );
    }


    // ---------------------- GRID MODE ----------------------
    return (
        <Link
            href={`/anime/${project.id}`}
            className="group block relative w-full h-full aspect-[2/3] rounded-[1.5rem] overflow-hidden bg-white/40 border border-bg-dark/5 outline-none transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1"
        >
            {/* The Poster Image */}
            <div className="absolute inset-0 z-0">
                <BlurImage
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-[600ms] ease-out transform group-hover:scale-105"
                />
            </div>

            {/* Subtle Gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-bg-dark/20 opacity-60 group-hover:opacity-80 transition-opacity duration-500 z-10 pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start z-30 pointer-events-none">

                {/* Score Badge */}
                {(project.studio_rating && project.studio_rating !== '0.0') && (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-full border border-bg-dark/5 text-bg-dark shadow-sm transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                        <Star size={12} className="text-accent fill-accent" />
                        <span className="text-[11px] font-bold mt-0.5">{project.studio_rating}</span>
                    </div>
                )}

                {/* Top Right Action & Info */}
                <div className="flex flex-col items-end gap-2 text-right pointer-events-auto ml-auto">

                    {/* Favorite Button (Needs a wrapper if FavoriteButton relies on old brutalist styling, but assuming it adapts) */}
                    <div className="bg-white/90 backdrop-blur-md rounded-full border border-bg-dark/5 shadow-sm overflow-hidden transform group-hover:-translate-y-1 transition-transform duration-300 delay-75">
                        <FavoriteButton animeId={String(project.id)} />
                    </div>

                    {lastEp > 0 && (
                        <div className="px-2 py-1 rounded-md bg-accent/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest shadow-sm border border-white/10 transform group-hover:-translate-y-1 transition-transform duration-300 delay-100">
                            ЭП {lastEp}
                        </div>
                    )}

                    {project.status === 'Ongoing' && (
                        <div className="px-2.5 py-1 rounded-full bg-green-500/90 backdrop-blur-md shadow-sm border border-white/10 flex items-center gap-1.5 transform group-hover:-translate-y-1 transition-transform duration-300 delay-150">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-white">ЭФИР</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Hover Data Block */}
            <div className="absolute bottom-0 left-0 w-full p-4 z-20 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-[400ms] ease-out pointer-events-none flex flex-col justify-end">

                <h3 className="font-bold text-lg md:text-xl text-white line-clamp-2 leading-tight drop-shadow-md mb-2">
                    {project.title}
                </h3>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/80 uppercase tracking-widest">
                        <span>{project.year || 'TBA'}</span>
                        <div className="w-1 h-1 rounded-full bg-white/40" />
                        <span>{project.type}</span>
                    </div>

                    {/* History Progress (If Applicable) */}
                    {project.historyData ? (
                        <div className="space-y-1.5 mt-1 border-t border-white/10 pt-2">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-accent">
                                <span>Продолжить</span>
                                <span>Эпизод {project.historyData.episode}</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-accent rounded-full transition-all duration-1000"
                                    style={{ width: project.historyData.progress > 0 ? '100%' : '0%' }}
                                />
                            </div>
                        </div>
                    ) : (
                        /* Genre Tags (Limit to 2) */
                        project.genres && project.genres.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                                {project.genres.slice(0, 2).map((genre: string) => (
                                    <span key={genre} className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md border border-white/10 text-white text-[9px] font-bold tracking-wider">
                                        {genre}
                                    </span>
                                ))}
                                {project.genres.length > 2 && (
                                    <span className="px-1 py-0.5 rounded-md text-white/60 text-[9px] font-bold">
                                        +{project.genres.length - 2}
                                    </span>
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Hover Play Icon in Center */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-[400ms] pointer-events-none z-10">
                <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/20 backdrop-blur-md">
                    {isReading ? <BookOpen size={20} /> : <Play size={20} className="ml-1 fill-white" />}
                </div>
            </div>

        </Link>
    );
};
