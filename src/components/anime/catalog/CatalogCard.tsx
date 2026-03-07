import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Star, Calendar, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimeProject } from './types';

interface CatalogCardProps {
    project: AnimeProject;
}

export const CatalogCard: React.FC<CatalogCardProps> = ({ project }) => {
    // Basic mapped fields
    const title = project.russian || project.title || project.name;
    const year = project.year || 'TBA';
    const type = project.type ? project.type.toUpperCase() : 'UNKNOWN';
    const score = project.studio_rating > 0 ? project.studio_rating : 'N/A';

    const lastEp = Array.isArray(project.episodes)
        ? (project.episodes.length ? Math.max(...project.episodes.map((e: { number: number }) => e.number)) : 0)
        : (project.totalEpisodes || 0);

    // Determine status styling
    let statusText = '';
    let statusBg = 'bg-bg-dark/80';
    let statusTextCol = 'text-white';

    if (project.status === 'Ongoing') {
        statusText = 'ONGOING';
        statusBg = 'bg-accent/90';
        statusTextCol = 'text-white';
    } else if (project.status === 'Completed') {
        statusText = 'DONE';
        statusBg = 'bg-green-500/90';
        statusTextCol = 'text-white';
    } else {
        statusText = 'ANONS';
        statusBg = 'bg-secondary-muted/90';
    }

    return (
        <Link href={`/anime/${project.id}`} className="group relative flex flex-col gap-2 outline-none">
            {/* Poster Container */}
            <div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl bg-bg-dark/5 shadow-md transition-all duration-500 group-hover:shadow-xl group-hover:shadow-accent/20">
                <Image
                    src={project.image}
                    alt={title || 'Poster'}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                    unoptimized
                />

                {/* Top Badges */}
                <div className="absolute top-2 inset-x-2 flex justify-between items-start z-10 pointer-events-none">
                    {/* Score Badge */}
                    <div className="flex items-center gap-1 px-2 py-1 bg-bg-dark/80 backdrop-blur-md rounded-md text-white shadow-sm border border-white/10">
                        <Star size={12} className="fill-accent text-accent" />
                        <span className="text-xs font-bold leading-none">{score}</span>
                    </div>

                    {/* Status Badge */}
                    <div className={cn("px-2 py-1 rounded-md text-[10px] font-black tracking-wider uppercase backdrop-blur-md shadow-sm border border-white/10", statusBg, statusTextCol)}>
                        {statusText}
                    </div>
                </div>

                {/* Bottom Badges */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 z-10 pointer-events-none">
                    <div className="px-1.5 py-0.5 bg-bg-dark/80 backdrop-blur-md rounded text-white text-[10px] font-bold uppercase tracking-wider border border-white/10 flex items-center gap-1">
                        <Monitor size={10} className="text-white/70" /> {type}
                    </div>
                    {lastEp > 0 && (
                        <div className="px-1.5 py-0.5 bg-bg-dark/80 backdrop-blur-md rounded text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
                            EP {lastEp}
                        </div>
                    )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-bg-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-accent/90 text-white flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out backdrop-blur-sm">
                        <Play size={24} className="fill-current ml-1" />
                    </div>
                </div>
            </div>

            {/* Title & Info */}
            <div className="flex flex-col px-1">
                <h3 className="text-sm md:text-base font-bold text-bg-dark line-clamp-2 leading-tight group-hover:text-accent transition-colors">
                    {title}
                </h3>
                <div className="flex items-center gap-2 text-xs font-medium text-secondary-muted mt-1">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {year}</span>
                </div>
            </div>
        </Link>
    );
};
