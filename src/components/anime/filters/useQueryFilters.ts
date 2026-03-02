import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { TagStatus } from './ThreeStateTag';

export interface FilterState {
    search: string;
    genres: Record<string, TagStatus>;
    yearRange: [number, number];
    episodeRange: [number, number];
    studios: string[];
    voiceovers: string[];
    types: string[];
    status: string[];
    sortBy: string;
    showAnnouncements: boolean;
}

export const useQueryFilters = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // 1. Initial State from URL or Defaults
    const getInitialState = useCallback((): FilterState => {
        const genresParam = searchParams.get('genres') || '';
        const genresRecord: Record<string, TagStatus> = {};
        if (genresParam) {
            genresParam.split(',').forEach(g => {
                if (g.startsWith('-')) genresRecord[g.slice(1)] = 'excluded';
                else genresRecord[g] = 'included';
            });
        }

        const yearParam = searchParams.get('years')?.split('-') || [];
        const epParam = searchParams.get('episodes')?.split('-') || [];

        return {
            search: searchParams.get('q') || '',
            genres: genresRecord,
            yearRange: [
                parseInt(yearParam[0]) || 1990,
                parseInt(yearParam[1]) || 2026
            ],
            episodeRange: [
                parseInt(epParam[0]) || 1,
                parseInt(epParam[1]) || 1000
            ],
            studios: searchParams.get('studios')?.split(',').filter(Boolean) || [],
            voiceovers: searchParams.get('voice')?.split(',').filter(Boolean) || [],
            types: searchParams.get('types')?.split(',').filter(Boolean) || [],
            status: searchParams.get('status')?.split(',').filter(Boolean) || [],
            sortBy: searchParams.get('sort') || 'popularity',
            showAnnouncements: searchParams.get('anons') === 'true'
        };
    }, [searchParams]);

    const [filters, setFilters] = useState<FilterState>(getInitialState);

    // 2. Debounced State for expensive operations (UI syncing to URL)
    const [debouncedFilters, setDebouncedFilters] = useState<FilterState>(filters);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 300);
        return () => clearTimeout(handler);
    }, [filters]);

    // 3. Sync Debounced to URL
    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedFilters.search) params.set('q', debouncedFilters.search);

        const genreList = Object.entries(debouncedFilters.genres)
            .filter(([_, status]) => status !== 'none')
            .map(([id, status]) => (status === 'excluded' ? `-${id}` : id))
            .join(',');
        if (genreList) params.set('genres', genreList);

        if (debouncedFilters.yearRange[0] !== 1990 || debouncedFilters.yearRange[1] !== 2026) {
            params.set('years', `${debouncedFilters.yearRange[0]}-${debouncedFilters.yearRange[1]}`);
        }

        if (debouncedFilters.episodeRange[0] !== 1 || debouncedFilters.episodeRange[1] !== 1000) {
            params.set('episodes', `${debouncedFilters.episodeRange[0]}-${debouncedFilters.episodeRange[1]}`);
        }

        if (debouncedFilters.studios.length) params.set('studios', debouncedFilters.studios.join(','));
        if (debouncedFilters.voiceovers.length) params.set('voice', debouncedFilters.voiceovers.join(','));
        if (debouncedFilters.types.length) params.set('types', debouncedFilters.types.join(','));
        if (debouncedFilters.status.length) params.set('status', debouncedFilters.status.join(','));
        if (debouncedFilters.sortBy !== 'popularity') params.set('sort', debouncedFilters.sortBy);
        if (debouncedFilters.showAnnouncements) params.set('anons', 'true');

        const searchString = params.toString();
        const currentParams = searchParams.toString();

        if (searchString !== currentParams) {
            const query = searchString ? `?${searchString}` : '';
            router.replace(`${pathname}${query}`, { scroll: false });
        }
    }, [debouncedFilters, router, pathname, searchParams]);

    const updateFilter = useCallback((field: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({
            search: '',
            genres: {},
            yearRange: [1990, 2026],
            episodeRange: [1, 1000],
            studios: [],
            voiceovers: [],
            types: [],
            status: [],
            sortBy: 'popularity',
            showAnnouncements: false
        });
    }, []);

    return {
        filters,
        debouncedFilters,
        updateFilter,
        resetFilters
    };
};
