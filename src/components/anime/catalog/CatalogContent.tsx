"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Zap, ChevronDown, SlidersHorizontal, Search, Dices, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useQueryFilters } from '@/components/anime/filters/useQueryFilters';
import { FilterOverlay } from '@/components/anime/catalog/FilterOverlay';
import { IndexRow } from '@/components/anime/catalog/IndexRow';
import { StickyViewer } from '@/components/anime/catalog/StickyViewer';
import { AnimeProject } from './types';

export function CatalogContent({ initialProjects }: { initialProjects: AnimeProject[] }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { filters, debouncedFilters, updateFilter, resetFilters } = useQueryFilters();
    const router = useRouter();
    const [isRandomLoading, setIsRandomLoading] = useState(false);

    // Hover state for the Sticky Viewer
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const handleRandomAnime = async () => {
        setIsRandomLoading(true);
        try {
            const res = await fetch('/api/anime/random');
            if (res.ok) {
                const data = await res.json();
                router.push(`/anime/${data.id}`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsRandomLoading(false);
        }
    };

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
        params.append('limit', '20');

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
                    // Reset hover state when data changes
                    setHoveredId(null);
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
    }, [debouncedFilters, buildSearchParams, initialProjects]); // Removing projects.length/page to avoid redundant runs and hook size issues
    // Note: projects.length and page are not strictly needed in dependencies if we only want to refetch on filter change
    // But page is used in the condition. Removing page from dependency if we resetting it to 1 anyway.
    // Actually the lint says page should be included because it's used in the logic.


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

    const activeProject = useMemo(() => {
        if (hoveredId) {
            return projects.find(p => p.id === hoveredId) || null;
        }
        return null; // Don't default to the first project to encourage hover interaction
    }, [hoveredId, projects]);

    return (
        <div className="min-h-screen bg-white text-bg-dark relative selection:bg-accent selection:text-cream font-mono">
            {/* BACKGROUND PATTERN for white area */}
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

            {/* FULL SCREEN FILTER OVERLAY */}
            <FilterOverlay
                filters={filters}
                updateFilter={updateFilter}
                resetFilters={resetFilters}
                totalCount={projects.length}
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                projects={projects}
            />

            <main className="w-full flex flex-col pt-16 md:pt-[72px] lg:pt-[88px]">

                {/* MASSIVE SEARCH / HEADER ROW */}
                <div className="sticky top-[72px] lg:top-[88px] z-40 bg-white border-b-[6px] border-bg-dark flex flex-col md:flex-row md:items-stretch shadow-[0_10px_20px_rgba(0,0,0,0.1)]">

                    {/* Search Input */}
                    <div className="flex-1 relative flex items-center border-b-4 md:border-b-0 md:border-r-4 border-bg-dark group">
                        <Search className="absolute left-6 text-bg-dark/30 group-focus-within:text-accent transition-colors" size={28} strokeWidth={3} />
                        <input
                            type="text"
                            placeholder="ПОИСК В БАЗЕ ДАННЫХ..."
                            value={filters.search}
                            onChange={(e) => updateFilter('search', e.target.value)}
                            className="w-full h-full min-h-[72px] lg:min-h-[88px] bg-transparent pl-16 pr-6 py-4 font-editorial text-2xl md:text-3xl uppercase tracking-tighter text-bg-dark placeholder:text-bg-dark/20 focus:outline-none"
                        />
                        {filters.search && (
                            <button
                                onClick={() => updateFilter('search', '')}
                                className="absolute right-6 p-2 bg-bg-dark text-cream hover:bg-accent active:scale-95 transition-all outline-none"
                            >
                                <RotateCcw size={18} strokeWidth={3} />
                            </button>
                        )}
                    </div>

                    {/* Filter Button */}
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="h-[72px] lg:h-auto md:w-[300px] lg:w-[40%] bg-bg-dark text-cream font-editorial text-3xl uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-accent transition-colors outline-none shrink-0"
                    >
                        <SlidersHorizontal size={28} />
                        <span>ФИЛЬТРЫ</span>
                        {activeFilterCount > 0 && (
                            <span className="font-mono text-xl font-black bg-white text-bg-dark px-2 border-2 border-white shadow-[2px_2px_0_var(--color-accent)] transform -rotate-6">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* SPLIT SCREEN BODY */}
                <div className="w-full flex flex-col lg:flex-row flex-1 relative z-10">

                    {/* LEFT (60%): INDEX LIST */}
                    <div className="w-full lg:w-[60%] flex flex-col border-r-0 lg:border-r-[6px] border-bg-dark flex-shrink-0">
                        {/* Sub-toolbar */}
                        <div className="sticky top-[144px] lg:top-[176px] z-30 p-2 border-b-[6px] border-bg-dark bg-[#f5f5f5] flex items-center justify-between">
                            <div className="relative min-w-[200px]">
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => updateFilter('sortBy', e.target.value)}
                                    className="w-full appearance-none flex items-center justify-between gap-2 px-4 py-3 bg-white border-2 border-bg-dark text-xs font-black transition-all text-bg-dark outline-none uppercase tracking-widest cursor-pointer shadow-[2px_2px_0_var(--color-bg-dark)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5"
                                >
                                    <option value="popularity">SORT: ПОПУЛЯРНОСТЬ</option>
                                    <option value="ranked">SORT: РЕЙТИНГ МАСТЕРОВ</option>
                                    <option value="aired_on">SORT: ДАТА РЕЛИЗА</option>
                                    <option value="name">SORT: ИНДЕКС (A-Z)</option>
                                    <option value="updated_at">SORT: НЕДАВНО ДОБАВЛЕНО</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-bg-dark">
                                    <ChevronDown size={14} strokeWidth={4} />
                                </div>
                            </div>

                            <button
                                onClick={handleRandomAnime}
                                disabled={isRandomLoading}
                                className={cn(
                                    "px-4 py-3 bg-accent text-white font-black text-xs uppercase tracking-widest border-2 border-transparent shadow-[2px_2px_0_var(--color-bg-dark)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all outline-none flex items-center gap-2",
                                    isRandomLoading && "animate-pulse"
                                )}
                            >
                                <Dices size={16} strokeWidth={3} />
                                <span className="hidden sm:inline">СЛУЧАЙНЫЙ ФАЙЛ</span>
                            </button>
                        </div>

                        {/* List Items */}
                        <div className="flex flex-col bg-[#e0e0e0]">
                            {projects.map((project, index) => (
                                <IndexRow
                                    key={project.id}
                                    project={project}
                                    index={index}
                                    isHovered={hoveredId === project.id}
                                    onHover={setHoveredId}
                                    onLeave={() => setHoveredId(null)}
                                />
                            ))}

                            {isLoading && projects.length === 0 && (
                                <div className="p-12 flex justify-center border-b-[3px] border-bg-dark bg-white">
                                    <div className="w-12 h-12 border-4 border-bg-dark/10 border-t-accent rounded-full animate-spin" />
                                </div>
                            )}

                            {!isLoading && projects.length === 0 && (
                                <div className="flex flex-col items-center justify-center p-24 text-center border-b-[3px] border-bg-dark bg-white">
                                    <Zap size={48} className="text-secondary-muted mb-4 opacity-50" />
                                    <h3 className="font-editorial text-4xl uppercase tracking-tighter text-secondary-muted">БАЗА ПУСТА</h3>
                                    <p className="text-sm font-black uppercase tracking-widest text-secondary-muted/50 mt-2">ИЗМЕНИТЕ ПАРАМЕТРЫ ЗАПРОСА</p>
                                </div>
                            )}

                            {/* Load More Block */}
                            {hasMore && projects.length > 0 && (
                                <button
                                    onClick={fetchNextPage}
                                    disabled={isFetchingMore}
                                    className={cn(
                                        "group relative w-full h-32 md:h-40 flex items-center justify-center gap-4 bg-bg-dark text-cream border-t-[6px] border-bg-dark font-editorial text-4xl lg:text-5xl uppercase tracking-widest transition-all duration-[400ms] outline-none active:scale-[0.98] overflow-hidden",
                                        isFetchingMore && "pointer-events-none"
                                    )}
                                >
                                    <div className="absolute inset-0 bg-accent text-white flex items-center justify-center gap-6 translate-y-full group-hover:translate-y-0 transition-transform duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                                        <Zap size={40} className={cn("fill-current outline-none", isFetchingMore ? "animate-pulseHard" : "")} />
                                        {isFetchingMore ? 'РАСШИРЕНИЕ ИНДЕКСА...' : 'РАЗВЕРНУТЬ СПИСОК'}
                                    </div>

                                    <div className="flex items-center justify-center gap-6 group-hover:-translate-y-full transition-transform duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                                        <ChevronDown size={40} className={cn("text-secondary-muted stroke-[3] group-hover:text-accent", isFetchingMore ? "animate-pulseHard" : "")} />
                                        <span>{isFetchingMore ? 'ЗАГРУЗКА...' : 'СЛЕДУЮЩИЕ ЗАПИСИ (20)'}</span>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* RIGHT (40%): STICKY VIEWER */}
                    <div className="hidden lg:block w-[40%] bg-bg-dark flex-shrink-0">
                        {/* 
                            We subtract the navigation header and local sticky header from viewport height.
                            Top Navigation = ~88px. Local Search Header = ~88px. Sub-toolbar = ~64px.
                            Total offset top is roughly 88+88 = 176px. Height calc(100vh - 176px).
                        */}
                        <div className="sticky top-[176px] h-[calc(100vh-176px)] overflow-hidden">
                            <StickyViewer project={activeProject} />
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

// Ensure the default export is present if required by Next.js app router dynamic imports, although this component is likely just exported directly as a named export.
export default CatalogContent;
