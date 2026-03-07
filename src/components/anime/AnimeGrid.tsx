/* eslint-disable @typescript-eslint/no-explicit-any */
 
import React from 'react';
import { HubCard } from './HubCard';
import { cn } from '@/lib/utils';
import { Ghost, RotateCcw } from 'lucide-react';

interface AnimeGridProps {
    projects: any[];
    isLoading?: boolean;
    viewMode?: 'grid' | 'list';
}

export const AnimeGrid: React.FC<AnimeGridProps> = ({ projects, isLoading, viewMode = 'grid' }) => {
    if (isLoading) {
        return (
            <section className="pb-20">
                <div className={cn(
                    "grid gap-1 md:gap-2",
                    viewMode === 'list'
                        ? "grid-cols-1 md:grid-cols-2"
                        : "grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
                )}>
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className="aspect-[2/3] overflow-hidden bg-bg-cream border-4 border-bg-dark relative shadow-[4px_4px_0_var(--color-bg-dark)]">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bg-dark/10 to-transparent animate-shimmer -translate-x-full" />
                            <div className="absolute bottom-4 left-4 right-4 space-y-3">
                                <div className="h-4 w-1/3 bg-bg-dark/20 border-2 border-bg-dark animate-pulse" />
                                <div className="h-6 w-3/4 bg-bg-dark/20 border-2 border-bg-dark animate-pulse" style={{ animationDelay: '150ms' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (projects.length === 0) {
        return (
            <section className="pb-20">
                <div className="animate-fade-in-up flex flex-col items-center justify-center py-24 text-center bg-bg-cream border-4 border-bg-dark shadow-[8px_8px_0_var(--color-bg-dark)] group transition-all duration-300">
                    <div className="w-24 h-24 bg-white border-4 border-bg-dark flex items-center justify-center mb-6 shadow-[4px_4px_0_var(--color-bg-dark)] -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                        <Ghost size={40} className="text-accent group-hover:animate-pulse" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-3xl font-editorial text-bg-dark uppercase tracking-tighter mb-4">Ничего не найдено</h3>
                    <button
                        className="flex items-center gap-2 px-8 py-4 bg-accent text-cream border-2 border-bg-dark font-editorial text-xl uppercase tracking-wider hover:bg-bg-dark hover:text-cream shadow-[4px_4px_0_var(--color-bg-dark)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 active:translate-y-2 active:translate-x-2 transition-all outline-none"
                    >
                        <RotateCcw size={18} />
                        СБРОСИТЬ ФИЛЬТРЫ
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="pb-20 overflow-hidden">
            <div className={cn(
                "grid gap-1 md:gap-2",
                viewMode === 'list'
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
            )}>
                {projects.map((project, idx) => (
                    <div
                        key={project.id}
                        className={cn("animate-fade-in-up")}
                        style={{ animationDelay: `${Math.min(idx + 1, 12) * 50}ms` }}
                    >
                        <HubCard project={project} viewMode={viewMode} />
                    </div>
                ))}
            </div>
        </section>
    );
};
