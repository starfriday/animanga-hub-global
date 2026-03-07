import React, { useMemo, useState } from 'react';
import {
    Filter, X, RotateCcw, Search, Zap,
    Tag, ChevronDown, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThreeStateTag, TagStatus } from './ThreeStateTag';
import { HistogramSlider } from './HistogramSlider';
import { SegmentedControl } from './SegmentedControl';
import { FilterState } from './useQueryFilters';
import { GENRES_LIST, THEMES_LIST } from '@/lib/constants';

interface FilterSidebarProps {
    filters: FilterState;
    updateFilter: (field: keyof FilterState, value: any) => void;
    resetFilters: () => void;
    totalCount: number;
    isOpen: boolean;
    onClose: () => void;
    projects: any[];
}

type Preset = 'СЕЙЧАС СМОТРЯТ' | 'ЛУЧШЕЕ' | 'СКРЫТЫЕ ШЕДЕВРЫ';
const PRESETS: Preset[] = ['СЕЙЧАС СМОТРЯТ', 'ЛУЧШЕЕ', 'СКРЫТЫЕ ШЕДЕВРЫ'];

const SCORE_BUTTONS = [
    { value: 0, label: 'ВСЕ' },
    { value: 7, label: '7+' },
    { value: 8, label: '8+' },
    { value: 9, label: '9+' },
];

const EPISODE_PRESETS = [
    { value: [0, 0], label: 'ВСЕ' },
    { value: [1, 1], label: '1 (Фильм)' },
    { value: [2, 13], label: '2-13' },
    { value: [14, 26], label: '14-26' },
    { value: [27, 0], label: '27+' },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
    filters,
    updateFilter,
    resetFilters,
    totalCount,
    isOpen,
    onClose,
    projects,
}) => {
    const yearHistogram = useMemo(() => {
        const counts = new Array(2027 - 1990).fill(0);
        projects.forEach(p => {
            const y = parseInt(p.year);
            if (y >= 1990 && y <= 2026) counts[y - 1990]++;
        });
        return counts;
    }, [projects]);

    const toggleGenreState = (genreId: string, status: TagStatus) => {
        const newGenres = { ...filters.genres, [genreId]: status };
        updateFilter('genres', newGenres);
    };

    const toggleArrayFilter = (field: keyof FilterState, value: string) => {
        const current = (filters[field] as string[]) || [];
        const next = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        updateFilter(field, next);
    };

    // Detect active preset
    const activePreset = useMemo((): Preset | null => {
        if (filters.status.length === 1 && filters.status[0] === 'Ongoing' && filters.sortBy === 'popularity' && filters.minScore === 0) {
            return 'СЕЙЧАС СМОТРЯТ';
        }
        if (filters.sortBy === 'ranked' && filters.minScore === 8 && filters.status.length === 0) {
            return 'ЛУЧШЕЕ';
        }
        if (filters.sortBy === 'ranked' && filters.minScore === 7 && filters.status.length === 1 && filters.status[0] === 'Completed') {
            return 'СКРЫТЫЕ ШЕДЕВРЫ';
        }
        return null;
    }, [filters]);

    const applyPreset = (preset: Preset) => {
        resetFilters();
        // Use setTimeout to apply after reset
        setTimeout(() => {
            if (preset === 'СЕЙЧАС СМОТРЯТ') {
                updateFilter('status', ['Ongoing']);
            } else if (preset === 'ЛУЧШЕЕ') {
                updateFilter('sortBy', 'ranked');
                updateFilter('minScore', 8);
            } else if (preset === 'СКРЫТЫЕ ШЕДЕВРЫ') {
                updateFilter('sortBy', 'ranked');
                updateFilter('minScore', 7);
                updateFilter('status', ['Completed']);
            }
        }, 0);
    };

    return (
        <>
            {/* Mobile backdrop overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-bg-dark/80 backdrop-blur-sm z-[199] lg:hidden animate-fade-in"
                    onClick={onClose}
                />
            )}
            <aside className={cn(
                "fixed lg:sticky top-0 lg:top-[88px] left-0 h-full lg:h-[calc(100vh-88px)] w-[85%] sm:w-[320px] lg:w-[340px] shrink-0 bg-bg-dark border-r-4 lg:border-r-0 lg:border-r-[12px] border-bg-dark lg:border-cream z-[200] lg:z-10 transition-transform duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col shadow-[8px_8px_0_var(--color-bg-dark)] lg:shadow-[20px_0_40px_rgba(0,0,0,0.5)]",
                !isOpen && "-translate-x-full lg:translate-x-0"
            )}>
                {/* Header */}
                <div className="p-6 lg:p-5 space-y-4 shrink-0 bg-bg-dark z-10 border-b-4 border-secondary-muted pb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent text-cream border-2 border-cream shadow-[2px_2px_0_var(--color-cream)]">
                                <Filter size={18} strokeWidth={3} />
                            </div>
                            <h2 className="text-xl font-editorial uppercase tracking-tight text-cream">УПРАВЛЕНИЕ</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 border-2 border-secondary-muted lg:hidden bg-bg-dark text-cream active:translate-y-[2px] active:translate-x-[2px] transition-all shadow-[2px_2px_0_var(--color-secondary-muted)] hover:shadow-none hover:bg-accent hover:border-accent hover:text-white"
                        >
                            <X size={20} strokeWidth={3} />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/50 group-focus-within:text-accent transition-colors" size={18} strokeWidth={2.5} />
                        <input
                            type="text"
                            placeholder="ПОИСК ПО НАЗВАНИЮ..."
                            value={filters.search}
                            onChange={(e) => updateFilter('search', e.target.value)}
                            className="w-full bg-bg-dark border-2 border-secondary-muted focus:border-accent py-3 pl-12 pr-12 text-xs font-bold uppercase tracking-widest outline-none transition-all placeholder:text-cream/30 text-cream shadow-[2px_2px_0_var(--color-secondary-muted)] focus:shadow-[2px_2px_0_var(--color-accent)]"
                        />
                        {filters.search && (
                            <button
                                onClick={() => updateFilter('search', '')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-cream/10 hover:bg-accent rounded-full text-cream hover:text-white transition-all"
                            >
                                <X size={14} strokeWidth={3} />
                            </button>
                        )}
                    </div>

                    {/* Presets */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 -mx-6 px-6 lg:mx-0 lg:px-0 mt-2">
                        {PRESETS.map(preset => (
                            <button
                                key={preset}
                                onClick={() => applyPreset(preset)}
                                className={cn(
                                    "shrink-0 px-4 py-2 border-2 text-[9px] font-black uppercase tracking-widest transition-all active:translate-y-[2px] active:translate-x-[2px] outline-none",
                                    activePreset === preset
                                        ? "bg-accent border-accent text-white shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)] translate-y-[2px] translate-x-[2px]"
                                        : "bg-bg-dark hover:bg-cream hover:border-cream hover:text-bg-dark border-secondary-muted text-cream shadow-[2px_2px_0_var(--color-secondary-muted)] hover:shadow-none"
                                )}
                            >
                                {preset}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-5 space-y-10 pb-40 overscroll-contain bg-bg-dark">

                    {/* Genres */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-cream uppercase tracking-[0.2em] flex items-center gap-2 border-b-2 border-secondary-muted/30 pb-2">
                            <Zap size={14} className="text-accent fill-accent" /> Жанры
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            {GENRES_LIST.map(genre => (
                                <ThreeStateTag
                                    key={genre.id}
                                    label={genre.russian}
                                    status={filters.genres[genre.id] || 'none'}
                                    onChange={(status) => toggleGenreState(genre.id, status)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Themes */}
                    <ThemesSection filters={filters} toggleGenreState={toggleGenreState} />

                    {/* Score filter */}
                    <div className="space-y-4 border-t-2 border-secondary-muted/30 pt-6">
                        <h3 className="text-xs font-black text-cream uppercase tracking-[0.2em] flex items-center gap-2">
                            <Star size={14} className="text-accent fill-accent" /> Минимальный рейтинг
                        </h3>
                        <div className="flex gap-2">
                            {SCORE_BUTTONS.map(btn => (
                                <button
                                    key={btn.value}
                                    onClick={() => updateFilter('minScore', filters.minScore === btn.value ? 0 : btn.value)}
                                    className={cn(
                                        "flex-1 py-3 border-2 text-xs font-black uppercase tracking-wider transition-all outline-none",
                                        filters.minScore === btn.value
                                            ? "bg-cream border-cream text-bg-dark shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)] translate-y-0.5 translate-x-0.5"
                                            : "bg-bg-dark border-secondary-muted text-cream hover:bg-cream hover:border-cream hover:text-bg-dark shadow-[2px_2px_0_var(--color-secondary-muted)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5"
                                    )}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Year Range */}
                    <div className="px-1 border-t-2 border-secondary-muted/30 pt-6">
                        <HistogramSlider
                            label="ГОД ВЫПУСКА"
                            data={yearHistogram}
                            range={[1990, 2026]}
                            value={filters.yearRange}
                            onChange={(val) => updateFilter('yearRange', val)}
                        />
                    </div>

                    {/* Episode count */}
                    <div className="space-y-4 border-t-2 border-secondary-muted/30 pt-6">
                        <h3 className="text-xs font-black text-cream uppercase tracking-[0.2em] flex items-center gap-2">
                            <Tag size={14} className="text-accent" /> Количество эпизодов
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {EPISODE_PRESETS.map((ep, i) => {
                                const isActive = filters.episodeRange[0] === ep.value[0] && filters.episodeRange[1] === ep.value[1];
                                return (
                                    <button
                                        key={i}
                                        onClick={() => updateFilter('episodeRange', isActive ? [0, 0] : ep.value as [number, number])}
                                        className={cn(
                                            "px-4 py-2.5 border-2 text-[10px] font-black uppercase tracking-wider transition-all outline-none",
                                            isActive
                                                ? "bg-cream border-cream text-bg-dark shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)] translate-y-0.5 translate-x-0.5"
                                                : "bg-bg-dark border-secondary-muted text-cream hover:bg-cream hover:border-cream hover:text-bg-dark shadow-[2px_2px_0_var(--color-secondary-muted)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5"
                                        )}
                                    >
                                        {ep.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Format & Status */}
                    <div className="space-y-8 border-t-2 border-secondary-muted/30 pt-6">
                        <SegmentedControl
                            label="ФОРМАТ ПРОЕКТА"
                            options={[
                                { value: 'TV Series', label: 'СЕРИАЛ' },
                                { value: 'Movie', label: 'ФИЛЬМ' },
                                { value: 'OVA', label: 'OVA' },
                                { value: 'ONA', label: 'ONA' },
                                { value: 'Special', label: 'СПЕШЛ' },
                            ]}
                            selected={filters.types}
                            onToggle={(v) => toggleArrayFilter('types', v)}
                        />

                        <SegmentedControl
                            label="СТАТУС ВЫХОДА"
                            options={[
                                { value: 'Ongoing', label: 'ЭФИР' },
                                { value: 'Completed', label: 'ЗАВЕРШЕН' },
                                { value: 'Announced', label: 'АНОНС' },
                            ]}
                            selected={filters.status}
                            onToggle={(v) => toggleArrayFilter('status', v)}
                        />
                    </div>
                </div>

                {/* Sticky Footer */}
                <div className="shrink-0 p-6 lg:p-5 border-t-4 border-secondary-muted bg-bg-dark relative z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={resetFilters}
                            className="p-4 border-2 border-secondary-muted bg-bg-dark hover:bg-cream hover:border-cream hover:text-bg-dark text-cream transition-all shadow-[2px_2px_0_var(--color-secondary-muted)] hover:shadow-none active:translate-y-0.5 active:translate-x-0.5 outline-none"
                            title="Сбросить"
                        >
                            <RotateCcw size={20} strokeWidth={2.5} />
                        </button>
                        <button
                            disabled={totalCount === 0}
                            onClick={onClose}
                            className={cn(
                                "flex-1 py-4 px-6 border-2 border-cream flex items-center justify-center font-black uppercase text-xs tracking-widest transition-all outline-none",
                                totalCount > 0
                                    ? "bg-accent text-white shadow-[4px_4px_0_var(--color-cream)] hover:shadow-[2px_2px_0_var(--color-cream)] hover:translate-y-0.5 hover:translate-x-0.5 active:translate-y-1 active:translate-x-1 active:shadow-none"
                                    : "bg-bg-dark border-secondary-muted text-cream/40 cursor-not-allowed shadow-none"
                            )}
                        >
                            <span className="lg:hidden">ПРИМЕНИТЬ</span>
                            <span className="hidden lg:inline">ПОКАЗАТЬ {totalCount > 0 ? `(${totalCount})` : 'РЕЗУЛЬТАТ'}</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

// Separated collapsible themes section
const ThemesSection = ({ filters, toggleGenreState }: { filters: FilterState; toggleGenreState: (id: string, status: TagStatus) => void }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Count active theme filters
    const activeThemeCount = useMemo(() => {
        return THEMES_LIST.filter(t => filters.genres[t.id] && filters.genres[t.id] !== 'none').length;
    }, [filters.genres]);

    return (
        <div className="space-y-4 border-t-2 border-secondary-muted/30 pt-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between group outline-none"
            >
                <h3 className="text-xs font-black text-cream uppercase tracking-[0.2em] flex items-center gap-2">
                    <Tag size={14} className="text-accent" /> Темы
                    {activeThemeCount > 0 && (
                        <span className="min-w-[20px] h-[20px] flex items-center justify-center bg-accent text-cream text-[10px] font-black rounded-full border-2 border-bg-dark px-1">
                            {activeThemeCount}
                        </span>
                    )}
                </h3>
                <ChevronDown size={18} className={cn(
                    "text-cream/50 transition-transform duration-300",
                    isOpen && "rotate-180"
                )} />
            </button>

            <div className={cn(
                "overflow-hidden transition-all duration-500 ease-out",
                isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="flex flex-wrap gap-2 pt-2">
                    {THEMES_LIST.map(theme => (
                        <ThreeStateTag
                            key={theme.id}
                            label={theme.russian}
                            status={filters.genres[theme.id] || 'none'}
                            onChange={(status) => toggleGenreState(theme.id, status)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
