/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { CatalogCard } from '@/components/anime/catalog/CatalogCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// We need an adapter to transform `shikimori` API objects if needed, 
// since CatalogCard expects AnimeProject interface.
// For now, we manually map what we get from the Home page generic fetches.

interface CardsSectionProps {
    title: string;
    items: any[];
    href?: string;
    className?: string;
}

export const CardsSection: React.FC<CardsSectionProps> = ({ title, items, href, className }) => {
    if (!items || items.length === 0) return null;

    return (
        <section className={cn("w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12", className)}>
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-bg-dark flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-accent rounded-full" />
                    {title}
                </h2>

                {href && (
                    <Link
                        href={href}
                        className="flex items-center gap-1 text-sm font-bold text-secondary-muted hover:text-accent transition-colors"
                    >
                        Смотреть все <ChevronRight size={16} />
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
                {items.slice(0, 12).map((item) => {
                    // Map generic API format to CatalogCard expected AnimeProject format
                    const project = {
                        id: String(item.shikimoriId || item.id),
                        slug: item.name || String(item.id),
                        title: item.russian || item.name,
                        description: item.description || '',
                        banner: item.posterUrl || item.image || '',
                        image: item.posterUrl || item.image || '',
                        posterPosition: 'center',
                        studio_rating: item.score || 0,
                        type: item.kind === 'tv' ? 'TV Series' : item.kind === 'movie' ? 'Movie' : item.kind === 'ova' ? 'OVA' : 'Special',
                        status: item.status === 'ongoing' ? 'Ongoing' : item.status === 'released' ? 'Completed' : 'Announced',
                        year: item.aired_on ? new Date(item.aired_on).getFullYear() : null,
                        totalEpisodes: item.episodes || 0,
                        episodes: Array.from({ length: item.episodes_aired || 0 }, (_, i) => ({ number: i + 1 })),
                        views: 0
                    };

                    return <CatalogCard key={project.id} project={project as any} />;
                })}
            </div>
        </section>
    );
};
