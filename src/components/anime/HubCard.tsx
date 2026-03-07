import React from 'react';
import Link from 'next/link';
import { Play, BookOpen, Star } from 'lucide-react';
import { BlurImage } from '@/components/ui/BlurImage';
import { cn } from '@/lib/utils';
import { FavoriteButton } from '@/components/anime/FavoriteButton';

export const HubCard = ({ project, viewMode = 'grid' }: { project: any, viewMode?: 'grid' | 'list' }) => {
    const isReading = ['Manga', 'Novel', 'Comics'].includes(project.type);
    const lastEp = Array.isArray(project.episodes) ? (project.episodes.length ? Math.max(...project.episodes.map((e: any) => e.number)) : 0) : (project.episodes || 0);

    if (viewMode === 'list') {
        return (
            <Link
                href={`/anime/${project.id}`}
                className="group relative flex items-center gap-4 bg-white border-4 border-bg-dark p-3 overflow-hidden outline-none shadow-[4px_4px_0_var(--color-bg-dark)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all"
            >
                <div className="w-20 md:w-24 aspect-[2/3] border-2 border-bg-dark overflow-hidden relative shrink-0 bg-bg-cream">
                    <BlurImage src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40">
                        <div className="w-10 h-10 bg-bg-dark border-2 border-cream text-cream flex items-center justify-center shadow-[2px_2px_0_var(--color-cream)]">
                            {isReading ? <BookOpen size={16} /> : <Play size={16} className="ml-1 fill-cream" />}
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-w-0 space-y-2 py-1">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 border border-bg-dark bg-surface text-[9px] font-black uppercase tracking-widest text-bg-dark shadow-[1px_1px_0_var(--color-bg-dark)]">
                            <Star size={10} className="fill-accent text-accent" />
                            {project.studio_rating}
                        </div>
                        <span className="text-bg-dark text-[9px] font-black uppercase tracking-widest border border-bg-dark px-2 py-0.5 bg-surface shadow-[1px_1px_0_var(--color-bg-dark)]">
                            {project.type}
                        </span>
                    </div>
                    <h3 className="font-editorial text-lg md:text-xl text-bg-dark line-clamp-1 group-hover:text-accent transition-colors duration-300 uppercase tracking-tight">
                        {project.title}
                    </h3>
                </div>
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
            </Link>
        );
    }

    return (
        <Link
            href={`/anime/${project.id}`}
            className="group block relative w-full h-full aspect-[2/3] overflow-hidden bg-bg-dark outline-none active:scale-[0.98] transition-transform duration-[400ms] ease-[var(--transition-spring)]"
        >
            {/* The Poster Image */}
            <BlurImage
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover filter grayscale brightness-75 contrast-125 group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100 transition-all duration-[600ms] ease-out transform group-hover:scale-105"
            />

            {/* Dark overlay that fades on hover */}
            <div className="absolute inset-0 bg-bg-dark/40 group-hover:bg-transparent transition-colors duration-500 pointer-events-none mix-blend-multiply" />

            {/* Brutalist Frame inside the card */}
            <div className="absolute inset-0 border-[6px] border-bg-dark pointer-events-none z-10" />

            {/* Top Badges */}
            <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start z-20 pointer-events-none">
                {/* Score Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-cream border-2 border-bg-dark text-bg-dark shadow-[4px_4px_0_var(--color-bg-dark)] transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-300">
                    <Star size={14} className="fill-bg-dark" />
                    <span className="font-editorial text-xl font-black mt-0.5">{project.studio_rating || 'N/A'}</span>
                </div>

                {/* Top Right Action & Info */}
                <div className="flex flex-col items-end gap-2 text-right pointer-events-auto">
                    <FavoriteButton animeId={String(project.id)} />
                    {lastEp > 0 && (
                        <div className="px-2 py-1 bg-accent border-2 border-bg-dark text-cream text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0_var(--color-bg-dark)]">
                            ЭП {lastEp}
                        </div>
                    )}
                    {project.status === 'Ongoing' && (
                        <div className="px-2 py-1 bg-green border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)] flex items-center gap-2">
                            <span className="w-2 h-2 bg-bg-dark animate-pulseHard" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-bg-dark">ЭФИР</span>
                        </div>
                    )}
                </div>
            </div>

            {/* The "Receipt" Data Block (Slides up on hover) */}
            <div className="absolute bottom-0 left-0 w-full p-1.5 z-20 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-[500ms] ease-[var(--transition-spring)] pointer-events-none">
                <div className="bg-bg-dark border-4 border-cream p-4 space-y-3 shadow-[8px_8px_0_var(--color-accent)]">

                    {/* Header line of the receipt */}
                    <div className="flex justify-between items-start border-b-2 border-secondary-muted pb-2">
                        <span className="bg-cream text-bg-dark px-2 py-1 text-[10px] font-black uppercase tracking-widest">
                            {project.type}
                        </span>
                        <span className="text-cream text-[10px] font-mono tracking-widest">
                            {project.year || 'TBA'}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-editorial text-2xl md:text-3xl text-cream uppercase line-clamp-2 leading-[0.9] tracking-tighter mix-blend-difference">
                        {project.title}
                    </h3>

                    {/* Scrolling Genres Marquee inside receipt */}
                    {project.genres && project.genres.length > 0 && (
                        <div className="w-full bg-cream py-1.5 overflow-hidden flex whitespace-nowrap border-y-2 border-bg-dark">
                            <div className="marquee-track-fast flex gap-4 text-bg-dark text-[10px] font-mono uppercase font-bold px-2">
                                {Array(3).fill(project.genres.slice(0, 3).join(' ✦ ')).map((t, i) => (
                                    <span key={i}>{t} ✦</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Huge Play Icon behind text, scaling up on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-20 transition-all duration-500 scale-50 group-hover:scale-150 pointer-events-none mix-blend-overlay">
                <Play size={120} className="fill-cream" />
            </div>
        </Link>
    );
};
