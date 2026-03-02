import React from 'react';
import Link from 'next/link';
import { Play, BookOpen, Star } from 'lucide-react';
import { BlurImage } from '@/components/ui/BlurImage';
import { cn } from '@/lib/utils';

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
            className="group relative flex flex-col gap-3 focus:outline-none"
        >
            <div className="aspect-[2/3] overflow-hidden relative border-4 border-bg-dark shadow-[4px_4px_0_var(--color-bg-dark)] group-hover:shadow-none group-hover:translate-y-1 group-hover:translate-x-1 bg-bg-cream transition-all duration-300">
                <BlurImage
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover mix-blend-multiply group-hover:-translate-y-1 group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                <div className="absolute inset-0 bg-transparent group-hover:bg-bg-dark/10 transition-colors duration-300 mix-blend-overlay pointer-events-none" />

                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
                    {lastEp > 0 && (
                        <div className="px-2 py-1 bg-accent border-2 border-bg-dark text-cream text-[9px] font-black uppercase tracking-widest shadow-[2px_2px_0_var(--color-bg-dark)]">
                            EP {lastEp}
                        </div>
                    )}
                </div>

                {project.status === 'Ongoing' && (
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2 py-1 bg-green-400 border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)]">
                        <span className="w-1.5 h-1.5 bg-bg-dark animate-pulse border border-bg-dark" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-bg-dark">ЭФИР</span>
                    </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-bg-cream/40">
                    <div className="w-14 h-14 bg-bg-dark border-2 border-cream text-cream flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300 shadow-[4px_4px_0_var(--color-cream)] group-hover:shadow-[2px_2px_0_var(--color-cream)] group-hover:translate-y-0.5 group-hover:translate-x-0.5">
                        {isReading ? <BookOpen size={24} /> : <Play size={24} className="ml-1 fill-cream" />}
                    </div>
                </div>

                <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-wrap gap-1.5 z-20">
                    {project.genres && project.genres.length > 0 && (
                        project.genres.slice(0, 3).map((g: string, i: number) => (
                            <span key={g} className="px-1.5 py-0.5 bg-white border border-bg-dark text-[8px] font-black uppercase tracking-widest text-bg-dark shadow-[1px_1px_0_var(--color-bg-dark)]">
                                {g}
                            </span>
                        ))
                    )}
                </div>
            </div>

            <div className="space-y-1.5 px-1 pt-1 border-t-2 border-transparent group-hover:border-bg-dark transition-colors">
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-accent">
                        <Star size={10} className="fill-accent" />
                        {project.studio_rating}
                    </div>
                    <span className="text-bg-dark/20 text-[10px]">&bull;</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-bg-dark/50 truncate">
                        {project.type} {project.year && `• ${project.year}`}
                    </span>
                </div>
                <h3 className="font-editorial text-lg md:text-xl text-bg-dark line-clamp-2 leading-tight group-hover:text-accent transition-colors duration-300 uppercase tracking-tighter mix-blend-multiply">
                    {project.title}
                </h3>
            </div>
        </Link>
    );
};
