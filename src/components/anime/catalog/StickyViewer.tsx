import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Play, Activity, Calendar, Eye, Layers } from 'lucide-react';
import Image from 'next/image';
import { AnimeProject } from './types';

interface StickyViewerProps {
    project: AnimeProject | null; // The actively hovered project
}

export const StickyViewer: React.FC<StickyViewerProps> = ({ project }) => {
    const [glitch, setGlitch] = useState(false);

    // Trigger microscopic glitch effect every time project changes
    useEffect(() => {
        if (project) {
            // Use requestAnimationFrame or setTimeout to avoid synchronous setState in effect warning if needed
            // But usually this warning means it's called during render or synchronously without condition change
            // Here we want it on mount/update of project.id.
            const t = setTimeout(() => {
                setGlitch(true);
            }, 0);
            const t2 = setTimeout(() => setGlitch(false), 150);
            return () => {
                clearTimeout(t);
                clearTimeout(t2);
            };
        }
    }, [project]); // Added project to dependencies to fix lint


    if (!project) {
        return (
            <div className="w-full h-full bg-bg-dark border-l-4 border-bg-dark flex flex-col items-center justify-center p-8 text-cream/20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />
                <Activity size={64} strokeWidth={1} className="mb-6 opacity-20" />
                <h2 className="text-4xl font-editorial uppercase tracking-tight text-center max-w-[300px] opacity-40">ОЖИДАНИЕ ВВОДА</h2>
                <p className="text-xs font-black uppercase tracking-widest mt-4 opacity-40">КЛИКНИТЕ ДЛЯ ПРОСМОТРА</p>

                {/* Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .3) 25%, rgba(255, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .3) 75%, rgba(255, 255, 255, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .3) 25%, rgba(255, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .3) 75%, rgba(255, 255, 255, .3) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }} />
            </div>
        );
    }

    const title = project.russian || project.name || project.title || '';
    const desc = project.description || "ДАННЫЕ ЗАСЕКРЕЧЕНЫ / ОПИСАНИЕ ОТСУТСТВУЕТ В БАЗЕ.";

    return (
        <div className="w-full h-full bg-bg-dark border-l-[12px] border-bg-dark relative overflow-hidden flex flex-col">
            {/* Background Poster (Blurred) */}
            <div className="absolute inset-0 z-0 opacity-40 saturate-50">
                <Image
                    src={project.image || ''}
                    alt={`Фоновое изображение ${title}`}
                    fill
                    unoptimized
                    className="object-cover blur-3xl scale-110"
                />
            </div>

            {/* Noise Overlay */}
            <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />

            {/* Glitch Overlay */}
            {glitch && (
                <div className="absolute inset-0 z-50 bg-accent mix-blend-color-burn opacity-50 pointer-events-none animate-pulseHard" />
            )}

            <div className="relative z-10 flex-1 flex flex-col p-6 2xl:p-10 text-cream">

                {/* Header Tag */}
                <div className="flex items-center justify-between mb-8">
                    <span className="bg-accent text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-accent">ID: {project.id}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50 border border-cream/20 px-3 py-1">SYS.INDEX</span>
                </div>

                {/* Mega Image Frame */}
                <div className="relative flex-1 min-h-0 mb-8 border-4 border-bg-dark shadow-[10px_10px_0_var(--color-bg-dark)] bg-black overflow-hidden group">
                    <Image
                        src={project.image || ''}
                        alt={title}
                        fill
                        priority
                        unoptimized
                        className={cn(
                            "object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-105",
                            glitch ? "scale-[1.02] filter invert contrast-150" : "scale-100 filter contrast-125 saturate-50"
                        )}
                    />

                    {/* Inner overlay data */}
                    <div className="absolute top-4 right-4 bg-bg-dark text-accent font-black text-2xl px-3 py-1 border-2 border-accent shadow-[4px_4px_0_var(--color-bg-dark)]">
                        {project.studio_rating > 0 ? project.studio_rating : 'N/A'}
                    </div>

                    <div className="absolute inset-0 border-[6px] border-white/10 pointer-events-none z-10 mix-blend-overlay mix-blend-difference" />
                </div>

                {/* Metadata & Description */}
                <div className="shrink-0 space-y-6">
                    <div>
                        <h2 className="text-3xl lg:text-4xl 2xl:text-5xl font-editorial uppercase tracking-tighter leading-none mb-4 line-clamp-2">
                            {title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-black text-secondary-muted uppercase tracking-widest">
                            <span className="flex items-center gap-2 text-cream"><Calendar size={14} /> {project.year || '----'}</span>
                            <span className="flex items-center gap-2"><Layers size={14} /> {project.type || 'UNKNOWN'}</span>
                            <span className="flex items-center gap-2"><Eye size={14} /> {project.status === 'Ongoing' ? 'ON AIR' : 'RELEASED'}</span>
                        </div>
                    </div>

                    {/* Generative Text effect representation */}
                    <div className="relative">
                        <div className="h-0.5 w-full bg-secondary-muted/30 mb-4" />
                        <p className="text-xs 2xl:text-sm font-medium leading-relaxed opacity-70 line-clamp-4 font-mono uppercase tracking-wide">
                            {desc}
                        </p>
                    </div>

                    {/* Massive Action Button */}
                    <button
                        className="w-full flex items-center justify-between p-4 bg-cream text-bg-dark font-editorial text-2xl uppercase tracking-widest outline-none transition-all active:scale-[0.98] group mt-8"
                    >
                        <span>ИСПОЛНИТЬ ДИРЕКТИВУ МАСТЕРА</span>
                        <Play size={24} className="fill-current group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};
