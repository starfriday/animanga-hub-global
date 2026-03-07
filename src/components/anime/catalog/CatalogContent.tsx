"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronDown, RotateCcw, Ghost } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQueryFilters } from '@/components/anime/filters/useQueryFilters';
import { FilterSidebar } from '@/components/anime/filters/FilterSidebar';
import { CatalogCard } from '@/components/anime/catalog/CatalogCard';
import { AnimeProject } from './types';

export function CatalogContent({ initialProjects }: { initialProjects: AnimeProject[] }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { filters, debouncedFilters, updateFilter, resetFilters } = useQueryFilters();

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.search) count++;
        count += filters.types.length;
        count += filters.status.length;
        count += Object.values(filters.genres).filter(v => v && v !== 'none').length;
        if (filters.sortBy !== 'popularity') count++;
        if (filters.minScore > 0) count++;
        if (filters.episodeRange[0] > 0 || filters.episodeRange[1] > 0) count++;
        return count;
    }, [filters]);

    const [projects, setProjects] = useState<AnimeProject[]>(initialProjects);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const buildSearchParams = useCallback((pageNum: number) => {
        const params = new URLSearchParams();
        params.append('page', String(pageNum));
        params.append('limit', '24');

        if (debouncedFilters.search) params.append('search', debouncedFilters.search);

        const sortMap: Record<string, string> = {
            'popularity': 'popularity',
            'name': 'name',
            'aired_on': 'aired_on',
            'ranked': 'ranked',
            'updated_at': 'updated_at',
        };
        params.append('order', sortMap[debouncedFilters.sortBy] || 'popularity');

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
            .filter(([, status]) => status === 'included')
            .map(([id]) => id);

        const excludedGenreIds = Object.entries(debouncedFilters.genres)
            .filter(([, status]) => status === 'excluded')
            .map(([id]) => `!${id}`);

        if (activeGenreIds.length > 0 || excludedGenreIds.length > 0) {
            params.append('genre', [...activeGenreIds, ...excludedGenreIds].join(','));
        }

        const [yearMin, yearMax] = debouncedFilters.yearRange;
        if (yearMin !== 1990 || yearMax !== 2026) {
            if (yearMin === yearMax) {
                params.append('season', String(yearMin));
            } else {
                params.append('season', `${yearMin}_${yearMax}`);
            }
        }

        if (debouncedFilters.episodeRange[0] > 0) {
            params.append('minEpisodes', String(debouncedFilters.episodeRange[0]));
        }
        if (debouncedFilters.episodeRange[1] > 0) {
            params.append('maxEpisodes', String(debouncedFilters.episodeRange[1]));
        }

        if (debouncedFilters.minScore > 0) {
            params.append('minScore', String(debouncedFilters.minScore));
        }

        return params.toString();
    }, [debouncedFilters]);

    useEffect(() => {
        let isCancelled = false;
        const fetchInitial = async () => {
            const isDefaultState =
                !debouncedFilters.search &&
                debouncedFilters.types.length === 0 &&
                debouncedFilters.status.length === 0 &&
                Object.keys(debouncedFilters.genres).filter(k => debouncedFilters.genres[k] !== 'none').length === 0 &&
                debouncedFilters.sortBy === 'popularity' &&
                debouncedFilters.yearRange[0] === 1990 &&
                debouncedFilters.yearRange[1] === 2026 &&
                debouncedFilters.episodeRange[0] === 0 &&
                debouncedFilters.episodeRange[1] === 0 &&
                debouncedFilters.minScore === 0;

            if (page === 1 && isDefaultState) {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedFilters, buildSearchParams, initialProjects]);


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
                    const newProjects = data.data.filter((p: AnimeProject) => !existingIds.has(p.id));
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
        <div className="min-h-screen bg-[#f8f9fa] text-bg-dark font-sans flex flex-col pt-16 md:pt-[72px] lg:pt-[88px]">

            {/* Top Toolbar */}
            <div className="sticky top-[72px] lg:top-[88px] z-30 bg-white border-b border-secondary-muted/20 shadow-sm py-4 px-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">

                {/* Search Box */}
                <div className="relative flex-1 max-w-2xl group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-muted group-focus-within:text-accent transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Какой тайтл вы ищете?"
                        value={filters.search}
                        onChange={(e) => updateFilter('search', e.target.value)}
                        className="w-full bg-secondary-muted/5 border border-secondary-muted/20 focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-xl py-3 pl-12 pr-12 text-sm font-medium outline-none transition-all placeholder:text-secondary-muted"
                    />
                    {filters.search && (
                        <button
                            onClick={() => updateFilter('search', '')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-secondary-muted hover:text-accent hover:bg-accent/10 rounded-full transition-all"
                        >
                            <RotateCcw size={16} />
                        </button>
                    )}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Sort Dropdown */}
                    <div className="relative">
                        <select
                            value={filters.sortBy}
                            onChange={(e) => updateFilter('sortBy', e.target.value)}
                            className="appearance-none bg-white border border-secondary-muted/20 rounded-xl py-3 pl-4 pr-10 text-sm font-bold text-bg-dark outline-none cursor-pointer hover:border-accent/50 focus:border-accent transition-colors shadow-sm"
                        >
                            <option value="popularity">Популярные</option>
                            <option value="ranked">Лучшие оценки</option>
                            <option value="aired_on">Новинки</option>
                            <option value="name">По алфавиту</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-muted pointer-events-none" />
                    </div>

                    {/* Mobile Filter Button */}
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="lg:hidden flex items-center justify-center gap-2 bg-white border border-secondary-muted/20 rounded-xl py-3 px-4 text-sm font-bold text-bg-dark shadow-sm hover:border-accent/50 transition-colors"
                    >
                        <SlidersHorizontal size={18} />
                        Фильтры
                        {activeFilterCount > 0 && (
                            <span className="w-5 h-5 flex items-center justify-center bg-accent text-white rounded-full text-[10px] font-black">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full max-w-[1600px] mx-auto flex flex-row items-start lg:gap-8 lg:p-8">

                {/* Fixed Sidebar */}
                <FilterSidebar
                    filters={filters}
                    updateFilter={updateFilter}
                    resetFilters={resetFilters}
                    totalCount={projects.length}
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    projects={projects}
                />

                {/* Grid Container */}
                <div className="flex-1 w-full px-4 py-6 md:px-8 lg:p-0 min-w-0">

                    {isLoading && projects.length === 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 w-full">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="flex flex-col gap-2 animate-pulse">
                                    <div className="w-full aspect-[2/3] bg-secondary-muted/10 rounded-xl" />
                                    <div className="h-4 bg-secondary-muted/10 rounded w-3/4 mt-1" />
                                    <div className="h-3 bg-secondary-muted/10 rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && projects.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-2xl border border-secondary-muted/10 shadow-sm">
                            <div className="w-20 h-20 bg-secondary-muted/5 rounded-full flex items-center justify-center mb-6">
                                <Ghost size={32} className="text-secondary-muted opacity-50" />
                            </div>
                            <h3 className="text-xl font-bold text-bg-dark mb-2">Тайтлы не найдены</h3>
                            <p className="text-secondary-muted text-sm max-w-md mx-auto mb-6">
                                Попробуйте изменить параметры фильтрации или поисковый запрос.
                            </p>
                            <button
                                onClick={resetFilters}
                                className="px-6 py-2.5 bg-accent text-white font-bold rounded-xl shadow-md shadow-accent/20 hover:-translate-y-0.5 transition-all"
                            >
                                Сбросить фильтры
                            </button>
                        </div>
                    )}

                    {projects.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 w-full">
                            {projects.map((project) => (
                                <CatalogCard key={project.id} project={project} />
                            ))}
                        </div>
                    )}

                    {/* Pagination / Load More */}
                    {hasMore && projects.length > 0 && (
                        <div className="mt-12 flex justify-center pb-12">
                            <button
                                onClick={fetchNextPage}
                                disabled={isFetchingMore}
                                className={cn(
                                    "px-8 py-3.5 bg-white border border-secondary-muted/20 text-bg-dark font-bold text-sm rounded-xl hover:border-accent hover:text-accent shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent/20 flex items-center gap-2",
                                    isFetchingMore && "opacity-70 pointer-events-none"
                                )}
                            >
                                {isFetchingMore ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-accent border-r-transparent rounded-full animate-spin" />
                                        Загрузка...
                                    </>
                                ) : (
                                    'Показать еще тайтлы'
                                )}
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default CatalogContent;
