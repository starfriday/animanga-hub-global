"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimeGrid } from '@/components/anime/AnimeGrid';
import { LayoutGrid, List, Zap, ChevronDown, Filter, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useQueryFilters } from '@/components/anime/filters/useQueryFilters';
import { FilterSidebar } from '@/components/anime/filters/FilterSidebar';
import { SearchableList } from '@/components/anime/filters/SearchableList';
import { GENRES_LIST } from '@/lib/constants';

const QUICK_GENRES = [
    { id: '1', name: 'Action', russian: 'Экшен' },
    { id: '22', name: 'Romance', russian: 'Романтика' },
    { id: '10', name: 'Fantasy', russian: 'Фэнтези' },
    { id: '4', name: 'Comedy', russian: 'Комедия' },
    { id: '8', name: 'Drama', russian: 'Драма' },
];

export function CatalogContent({ initialProjects }: { initialProjects: any[] }) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { ref: toolbarRef, isVisible: toolbarVisible } = useScrollReveal(0.1);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { filters, debouncedFilters, updateFilter, resetFilters } = useQueryFilters();

    // Count active filters for badge
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.search) count++;
        count += filters.types.length;
        count += filters.status.length;
        count += Object.values(filters.genres).filter(v => v && v !== 'none').length;
        if (filters.sortBy !== 'popularity') count++;
        return count;
    }, [filters]);

    const [projects, setProjects] = useState<any[]>(initialProjects);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const buildSearchParams = useCallback((pageNum: number) => {
        const params = new URLSearchParams();
        params.append('page', String(pageNum));
        params.append('limit', '20');

        if (debouncedFilters.search) params.append('search', debouncedFilters.search);
        if (debouncedFilters.sortBy === 'popularity') params.append('order', 'popularity');
        if (debouncedFilters.sortBy === 'rating') params.append('order', 'ranked');
        if (debouncedFilters.sortBy === 'newest') params.append('order', 'aired_on');

        if (debouncedFilters.types.length > 0) {
            params.append('kind', debouncedFilters.types.join(','));
        }

        if (debouncedFilters.status.length > 0) {
            const mappedStatus = debouncedFilters.status.map(s => {
                if (s === 'Completed') return 'released';
                if (s === 'Ongoing') return 'ongoing';
                if (s === 'Announced') return 'anons';
                return s;
            });
            params.append('status', mappedStatus.join(','));
        }

        const activeGenreIds = Object.entries(debouncedFilters.genres)
            .filter(([_, status]) => status === 'included')
            .map(([id]) => id);

        const excludedGenreIds = Object.entries(debouncedFilters.genres)
            .filter(([_, status]) => status === 'excluded')
            .map(([id]) => `!${id}`);

        if (activeGenreIds.length > 0 || excludedGenreIds.length > 0) {
            params.append('genre', [...activeGenreIds, ...excludedGenreIds].join(','));
        }

        if (debouncedFilters.showAnnouncements) params.append('anons', 'true');

        return params.toString();
    }, [debouncedFilters]);

    useEffect(() => {
        let isCancelled = false;
        const fetchInitial = async () => {
            if (page === 1 && !debouncedFilters.search && debouncedFilters.types.length === 0 && debouncedFilters.status.length === 0 && Object.keys(debouncedFilters.genres).length === 0 && debouncedFilters.sortBy === 'popularity') {
                if (projects.length === 0) setProjects(initialProjects);
                return;
            }

            setIsLoading(true);
            try {
                const query = buildSearchParams(1);
                const res = await fetch(`/api/anime?${query}`);
                if (!res.ok) throw new Error("Failed to fetch");

                const data = await res.json();
                if (!isCancelled) {
                    setProjects(data.data || []);
                    setPage(1);
                    setHasMore(data.hasMore);
                }
            } catch (error) {
                console.error("Error fetching filtered data:", error);
            } finally {
                if (!isCancelled) setIsLoading(false);
            }
        };

        fetchInitial();
        return () => { isCancelled = true; };
    }, [debouncedFilters, buildSearchParams]);

    const fetchNextPage = useCallback(async () => {
        if (!hasMore || isLoading || isFetchingMore) return;

        setIsFetchingMore(true);
        try {
            const nextPage = page + 1;
            const query = buildSearchParams(nextPage);
            const res = await fetch(`/api/anime?${query}`);
            if (!res.ok) throw new Error("Failed to fetch more");

            const data = await res.json();
            if (data.data && data.data.length > 0) {
                setProjects(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    const newProjects = data.data.filter((p: any) => !existingIds.has(p.id));
                    return [...prev, ...newProjects];
                });
                setPage(nextPage);
            }
            setHasMore(data.hasMore && data.data.length > 0);
        } catch (error) {
            console.error("Error fetching more data:", error);
        } finally {
            setIsFetchingMore(false);
        }
    }, [page, hasMore, isLoading, isFetchingMore, buildSearchParams]);

    return (
        <div className="min-h-screen bg-bg-cream text-bg-dark pt-24 px-4 md:px-6 lg:px-8 max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-8 relative items-start selection:bg-accent selection:text-cream">

            {/* BACKGROUND EDITORIAL TOUCHES */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                            <line x1="0" y1="0" x2="0" y2="10" stroke="var(--color-bg-dark)" strokeWidth="2" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#diagonalHatch)" />
                </svg>
            </div>

            <FilterSidebar
                filters={filters}
                updateFilter={updateFilter}
                resetFilters={resetFilters}
                totalCount={projects.length}
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                projects={projects}
            />

            <main className="w-full flex-1 space-y-8 md:space-y-10 min-w-0 relative z-10">
                <div className="flex flex-col mb-4">
                    <div className="flex items-center gap-4 mb-2">
                        <span className="w-12 h-1 bg-accent inline-block" />
                        <span className="font-bold uppercase tracking-widest text-[#B83A2D] text-sm md:text-base">THE DIRECTORY</span>
                    </div>
                    <h1 className="font-editorial text-6xl md:text-8xl lg:text-9xl text-bg-dark uppercase tracking-tighter leading-[0.85] mix-blend-multiply flex items-baseline gap-4">
                        КАТАЛОГ
                        <span className="text-3xl md:text-5xl text-accent pb-2">АНИМЕ</span>
                    </h1>
                </div>

                <section
                    ref={toolbarRef}
                    className={cn(
                        "space-y-5 transition-all duration-700",
                        toolbarVisible ? "animate-fade-in-up" : "opacity-0 translate-y-8"
                    )}
                >
                    {/* Retro-Editorial Toolbar */}
                    <div className="sticky top-[88px] z-30 bg-bg-cream border-4 border-bg-dark p-3 md:p-5 shadow-[4px_4px_0_var(--color-bg-dark)]">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">

                            {/* Left: Filter Toggle & Title */}
                            <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="relative p-3 bg-bg-dark text-cream hover:bg-accent transition-colors shrink-0 outline-none flex lg:hidden items-center justify-center border-2 border-transparent shadow-[2px_2px_0_var(--color-bg-dark)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
                                >
                                    <Filter size={18} />
                                    {activeFilterCount > 0 && (
                                        <span className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center bg-accent text-cream text-[10px] font-black rounded-full border-2 border-cream px-1">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>

                                <div className="hidden lg:flex p-3 bg-bg-dark text-cream shrink-0 items-center justify-center border-2 border-transparent shadow-[2px_2px_0_var(--color-bg-dark)]">
                                    <Filter size={18} />
                                </div>

                                <div className="flex-1">
                                    <h2 className="text-lg md:text-xl font-editorial uppercase tracking-tight leading-none text-accent">База Данных</h2>
                                    <p className="text-[10px] md:text-xs font-bold text-bg-dark/60 uppercase tracking-widest mt-1">
                                        Загружено: {projects.length} тайтлов
                                    </p>
                                </div>
                            </div>

                            {/* Right: View Mode & Sorting */}
                            <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                                <div className="flex items-center gap-1 border-2 border-bg-dark p-1 shrink-0 bg-white">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={cn(
                                            "p-2 transition-all active:scale-95 outline-none",
                                            viewMode === 'grid'
                                                ? "bg-bg-dark text-cream shadow-inner"
                                                : "text-bg-dark hover:bg-bg-dark/10"
                                        )}
                                    ><LayoutGrid size={16} /></button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={cn(
                                            "p-2 transition-all active:scale-95 outline-none",
                                            viewMode === 'list'
                                                ? "bg-bg-dark text-cream shadow-inner"
                                                : "text-bg-dark hover:bg-bg-dark/10"
                                        )}
                                    ><List size={16} /></button>
                                </div>

                                <div className="relative flex-1 md:flex-initial min-w-[160px]">
                                    <select
                                        value={filters.sortBy}
                                        onChange={(e) => updateFilter('sortBy', e.target.value)}
                                        className="w-full appearance-none flex items-center justify-between md:justify-start gap-2 px-4 py-3 bg-white border-2 border-bg-dark text-xs md:text-sm font-bold transition-all text-bg-dark hover:border-accent outline-none uppercase tracking-wider"
                                    >
                                        <option value="popularity">Громкие хиты</option>
                                        <option value="rating">Высший балл</option>
                                        <option value="newest">Свежие релизы</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-bg-dark">
                                        <ChevronDown size={16} strokeWidth={3} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Genre Pills */}
                        <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-1 -mx-3 px-3 md:-mx-5 md:px-5">
                            {QUICK_GENRES.map(genre => {
                                const isActive = filters.genres[genre.id] === 'included';
                                return (
                                    <button
                                        key={genre.id}
                                        onClick={() => updateFilter('genres', { ...filters.genres, [genre.id]: isActive ? 'none' : 'included' })}
                                        className={cn(
                                            "shrink-0 px-4 py-1.5 text-[10px] md:text-xs font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap outline-none",
                                            isActive
                                                ? "bg-accent border-accent text-cream shadow-[2px_2px_0_var(--color-bg-dark)]"
                                                : "bg-surface border-bg-dark text-bg-dark hover:bg-bg-dark hover:text-cream shadow-[2px_2px_0_var(--color-bg-dark)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5"
                                        )}
                                    >
                                        {genre.russian}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <AnimeGrid projects={projects} isLoading={isLoading} viewMode={viewMode} />

                    {/* Manual Load More Button */}
                    {hasMore && (
                        <div className="w-full py-16 flex flex-col items-center justify-center gap-6 relative z-10">
                            <button
                                onClick={fetchNextPage}
                                disabled={isFetchingMore}
                                className={cn(
                                    "group relative flex items-center justify-center gap-4 px-12 py-5 bg-cream text-bg-dark border-4 border-bg-dark font-editorial text-2xl uppercase tracking-wider transition-all disabled:opacity-50 disabled:pointer-events-none outline-none shadow-[8px_8px_0_var(--color-accent)] hover:shadow-[4px_4px_0_var(--color-accent)] hover:translate-y-1 hover:translate-x-1 active:translate-y-2 active:translate-x-2 active:shadow-none overflow-hidden",
                                    isFetchingMore && "pr-14"
                                )}
                            >
                                <div className="absolute inset-0 w-full h-full bg-accent text-cream flex items-center justify-center -translate-y-full group-hover:translate-y-0 transition-transform duration-300 font-editorial text-2xl uppercase tracking-wider gap-4">
                                    <Zap size={20} className={cn(isFetchingMore ? "animate-pulse" : "")} />
                                    {isFetchingMore ? 'ЗАГРУЗКА...' : 'ПОКАЗАТЬ ЕЩЕ'}
                                </div>
                                <div className="flex items-center justify-center gap-4 transition-transform duration-300 group-hover:translate-y-full">
                                    <Zap size={20} className={cn(isFetchingMore ? "animate-pulse" : "")} />
                                    <span>{isFetchingMore ? 'ЗАГРУЗКА...' : 'ПОКАЗАТЬ ЕЩЕ'}</span>
                                </div>

                                {isFetchingMore && (
                                    <div className="absolute right-6 w-5 h-5 border-2 border-bg-dark/20 border-t-bg-dark rounded-full animate-spin z-20 group-hover:border-cream/20 group-hover:border-t-cream" />
                                )}
                            </button>

                            <p className="text-[10px] font-bold text-bg-dark/60 uppercase tracking-widest bg-white outline outline-2 outline-bg-dark/10 px-3 py-1 mt-4">
                                Страница {page} • Загружено {projects.length} тайтлов
                            </p>
                        </div>
                    )}

                    {!hasMore && projects.length > 0 && (
                        <div className="w-full py-16 flex justify-center text-bg-dark">
                            <div className="font-editorial text-2xl uppercase tracking-wider px-6 py-2 border-y-4 border-bg-dark bg-white">
                                Конец Списка
                            </div>
                        </div>
                    )}
                </section>
            </main>

            {/* Mobile Floating Filter Button (FAB) */}
            <button
                onClick={() => setIsFilterOpen(true)}
                className={cn(
                    "fixed bottom-6 right-6 z-[100] lg:hidden flex items-center gap-3 px-5 py-4 bg-bg-dark text-cream border-4 border-cream shadow-[4px_4px_0_var(--color-accent)] active:shadow-none active:translate-y-1 active:translate-x-1 transition-all",
                    isFilterOpen && "hidden"
                )}
            >
                <SlidersHorizontal size={20} strokeWidth={2.5} />
                <span className="font-editorial text-sm uppercase tracking-wider">Фильтры</span>
                {activeFilterCount > 0 && (
                    <span className="min-w-[22px] h-[22px] flex items-center justify-center bg-accent text-cream text-[11px] font-black rounded-full border-2 border-cream px-1">
                        {activeFilterCount}
                    </span>
                )}
            </button>
        </div>
    );
}
