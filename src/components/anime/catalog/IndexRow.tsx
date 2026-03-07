import React from 'react';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimeProject } from './types';

interface IndexRowProps {
    project: AnimeProject;
    isHovered: boolean;
    onHover: (id: string) => void;
    onLeave: () => void;
    index: number;
}

export const IndexRow: React.FC<IndexRowProps> = ({ project, isHovered, onHover, onLeave, index }) => {
    // Determine status badge
    let statusText = '';
    let statusColor = 'text-secondary-muted';

    if (project.status === 'Ongoing') {
        statusText = 'ON AIR';
        statusColor = 'text-accent';
    } else if (project.status === 'Completed') {
        statusText = 'DONE';
        statusColor = 'text-green-500';
    } else {
        statusText = 'WAIT';
    }

    const title = project.russian || project.title || project.name;
    const year = project.year || 'TBA';
    const type = project.type ? project.type.toUpperCase() : 'UNKNOWN';
    const score = project.studio_rating > 0 ? project.studio_rating : 'N/A';

    return (
        <Link href={`/anime/${project.id}`} passHref>
            <div
                onMouseEnter={() => onHover(project.id)}
                onMouseLeave={onLeave}
                className={cn(
                    "group relative w-full border-b-[3px] border-bg-dark bg-white transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.99] flex",
                    isHovered ? "bg-bg-dark text-white border-bg-dark z-10 translate-x-2 md:translate-x-4 shadow-[-8px_0_0_var(--color-accent)]" : "text-bg-dark hover:bg-cream"
                )}
            >
                {/* Visual Thumbnail (always visible) */}
                <div className="shrink-0 w-20 md:w-28 relative aspect-[2/3] border-r-[3px] border-bg-dark overflow-hidden bg-black group/poster">
                    <Image
                        src={project.image}
                        alt={`Постер ${project.russian || project.name}`}
                        fill
                        unoptimized
                        className={cn(
                            "object-cover transition-all duration-500",
                            isHovered ? "scale-105 saturate-100 invert-0" : "grayscale opacity-80"
                        )}
                    />
                    {/* Industrial scan line effect on thumb */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-1/2 w-full animate-scan pointer-events-none opacity-20" />
                </div>

                <div className="relative z-10 flex-1 flex flex-col md:flex-row md:items-center py-4 md:py-6 px-4 md:px-6 cursor-pointer overflow-hidden">
                    {/* Index Number */}
                    <div className="hidden lg:flex shrink-0 w-12 text-sm font-black tracking-tighter opacity-30 group-hover:opacity-100">
                        {String(index + 1).padStart(3, '0')}.
                    </div>

                    {/* Main Title Block */}
                    <div className="flex-1 min-w-0 md:mr-6 flex flex-col justify-center">
                        <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-editorial uppercase tracking-tighter leading-none truncate mb-1 md:mb-2 italic">
                            {title}
                        </h2>
                        <div className="flex items-center gap-3 text-[10px] md:text-xs font-black uppercase tracking-widest text-secondary-muted group-hover:text-cream/50">
                            <span>{type}</span>
                            <span className="w-1 h-1 bg-current rounded-full" />
                            <span>{year}</span>
                            <span className="w-1 h-1 bg-current rounded-full" />
                            <span className={statusColor}>{statusText}</span>
                        </div>
                    </div>

                    {/* Data Block (Desktop: Side, Mobile: Bottom row) */}
                    <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-6 md:gap-10 shrink-0">
                        {/* Rating */}
                        <div className="flex flex-col items-center md:items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-secondary-muted group-hover:text-cream/30">SCORE</span>
                            <span className={cn(
                                "text-lg md:text-2xl font-black",
                                project.studio_rating >= 8 ? "text-accent" : ""
                            )}>
                                {score}
                            </span>
                        </div>

                        {/* Episodes */}
                        <div className="flex flex-col items-center md:items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-secondary-muted group-hover:text-cream/30">EPS</span>
                            <span className="text-lg md:text-2xl font-black">{project.totalEpisodes || project.episodes?.length || '?'}</span>
                        </div>

                        {/* Action Icon */}
                        <div className={cn(
                            "hidden md:flex items-center justify-center w-12 h-12 border-2 border-transparent transition-all",
                            isHovered ? "bg-accent text-white scale-110 rotate-12" : "border-bg-dark/10 text-bg-dark/30 group-hover:border-bg-dark"
                        )}>
                            <Play size={20} className={isHovered ? "fill-current" : ""} />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};
