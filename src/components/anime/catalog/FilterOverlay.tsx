import React, { useMemo, useState } from 'react';
import {
    X, RotateCcw, Zap, Tag, ChevronDown, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThreeStateTag, TagStatus } from '../filters/ThreeStateTag';
import { HistogramSlider } from '../filters/HistogramSlider';
import { SegmentedControl } from '../filters/SegmentedControl';
import { FilterState } from '../filters/useQueryFilters';
import { GENRES_LIST, THEMES_LIST } from '@/lib/constants';
import { AnimeProject } from './types';

interface FilterOverlayProps {
    filters: FilterState;
    updateFilter: <K extends keyof FilterState>(field: K, value: FilterState[K]) => void;
    resetFilters: () => void;
    totalCount: number;
    isOpen: boolean;
    onClose: () => void;
    projects: AnimeProject[];
}

type Preset = 'СЕЙЧАС СМОТРЯТ' | 'ЛУЧШЕЕ' | 'СКРЫТЫЕ ШЕДЕВРЫ';
const PRESETS: Preset[] = ['СЕЙЧАС СМОТРЯТ', 'ЛУЧШЕЕ', 'СКРЫТЫЕ ШЕДЕВРЫ'];

const SCORE_BUTTONS = [
    { value: 0, label: 'ВСЕ' },
    { value: 7, label: '7+' },
    { value: 8, label: '8+' },
    { value: 9, label: '9+' },
];

// Unused presets removed to fix lint warning
// const EPISODE_PRESETS = [ ... ]


export const FilterOverlay: React.FC<FilterOverlayProps> = ({
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
            const y = p.year;
            if (y && y >= 1990 && y <= 2026) counts[y - 1990]++;
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
        <div className={cn(
            "fixed inset-0 z-[999] bg-bg-dark flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)]",
            isOpen ? "translate-y-0" : "-translate-y-full pointer-events-none"
        )}>
            {/* Top Bar Navigation for Overlay */}
            <div className="flex-none p-4 md:p-8 flex items-center justify-between border-b-2 border-secondary-muted/30">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl md:text-5xl font-editorial uppercase tracking-tighter text-cream leading-none">
                        ФИЛЬТРЫ_
                    </h2>
                    <span className="hidden md:inline-block px-3 py-1 bg-accent/20 text-accent border border-accent text-xs font-black uppercase tracking-widest mt-2">{totalCount} НАЙДЕНО</span>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={resetFilters}
                        className="px-4 py-3 md:px-6 md:py-4 bg-transparent border-2 border-secondary-muted text-cream hover:text-white hover:border-cream text-xs md:text-sm font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                        <RotateCcw size={16} className="hidden md:block" /> СБРОСИТЬ
                    </button>
                    <button
                        onClick={onClose}
                        className="p-3 md:p-4 bg-accent text-white flex items-center justify-center hover:scale-[0.98] transition-transform shadow-[4px_4px_0_var(--color-cream)] border-2 border-transparent active:scale-95"
                    >
                        <X size={24} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Presets Row */}
            <div className="flex-none p-4 md:px-8 border-b-2 border-secondary-muted/30 flex gap-2 overflow-x-auto scrollbar-hide">
                <span className="text-[10px] md:text-xs font-black text-secondary uppercase tracking-[0.2em] self-center mr-4">ШАБЛОНЫ:</span>
                {PRESETS.map(preset => (
                    <button
                        key={preset}
                        onClick={() => applyPreset(preset)}
                        className={cn(
                            "shrink-0 px-4 py-2 border-2 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all outline-none",
                            activePreset === preset
                                ? "bg-accent border-accent text-white shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)] translate-y-0.5"
                                : "bg-bg-dark border-secondary-muted text-cream hover:border-cream"
                        )}
                    >
                        {preset}
                    </button>
                ))}
            </div>

            {/* Scrollable Main Filter Setup */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-24">

                    {/* LEFT COLUMN: Tags & Themes */}
                    <div className="space-y-12">
                        {/* Genres */}
                        <div className="space-y-6">
                            <h3 className="text-xl md:text-2xl font-editorial text-cream uppercase tracking-tight flex items-center gap-3">
                                <Zap size={24} className="text-accent fill-accent" /> БАЗОВЫЕ ЖАНРЫ
                            </h3>
                            <div className="flex flex-wrap gap-2 md:gap-3">
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
                    </div>

                    {/* RIGHT COLUMN: Sliders & Segmented */}
                    <div className="space-y-12">
                        {/* Score */}
                        <div className="space-y-6">
                            <h3 className="text-xl md:text-2xl font-editorial text-cream uppercase tracking-tight flex items-center gap-3">
                                <Star size={24} className="text-accent fill-accent" /> РЕЙТИНГ ОБЩЕСТВА
                            </h3>
                            <div className="flex gap-2">
                                {SCORE_BUTTONS.map(btn => (
                                    <button
                                        key={btn.value}
                                        onClick={() => updateFilter('minScore', filters.minScore === btn.value ? 0 : btn.value)}
                                        className={cn(
                                            "flex-1 py-4 border-2 text-sm md:text-base font-black uppercase tracking-wider transition-all outline-none",
                                            filters.minScore === btn.value
                                                ? "bg-cream border-cream text-bg-dark shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)] scale-[0.98]"
                                                : "bg-bg-dark border-secondary-muted text-cream hover:border-cream hover:bg-cream/5"
                                        )}
                                    >
                                        {btn.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Year */}
                        <div className="space-y-6">
                            <h3 className="text-xl md:text-2xl font-editorial text-cream uppercase tracking-tight flex items-center gap-3">
                                ВРЕМЕННОЙ ПРОМЕЖУТОК
                            </h3>
                            <div className="px-2">
                                <HistogramSlider
                                    label="ГОД"
                                    data={yearHistogram}
                                    range={[1990, 2026]}
                                    value={filters.yearRange}
                                    onChange={(val) => updateFilter('yearRange', val)}
                                />
                            </div>
                        </div>

                        {/* Episodes & Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <SegmentedControl
                                label="ФОРМАТ"
                                options={[
                                    { value: 'TV Series', label: 'СЕРИАЛ' },
                                    { value: 'Movie', label: 'ФИЛЬМ' },
                                    { value: 'OVA', label: 'OVA' },
                                ]}
                                selected={filters.types}
                                onToggle={(v) => toggleArrayFilter('types', v)}
                            />

                            <SegmentedControl
                                label="СТАТУС"
                                options={[
                                    { value: 'Ongoing', label: 'ЭФИР' },
                                    { value: 'Completed', label: 'ЗАВЕРШЕН' },
                                ]}
                                selected={filters.status}
                                onToggle={(v) => toggleArrayFilter('status', v)}
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Giant Sticky Footer */}
            <div className="flex-none p-4 md:p-8 bg-bg-dark border-t-2 border-secondary-muted flex justify-center">
                <button
                    disabled={totalCount === 0}
                    onClick={onClose}
                    className={cn(
                        "w-full max-w-[800px] py-6 flex items-center justify-center font-editorial text-2xl md:text-4xl uppercase tracking-widest transition-transform outline-none border-4",
                        totalCount > 0
                            ? "bg-accent text-white border-accent shadow-[0_15px_40px_rgba(230,0,18,0.25)] hover:bg-accent/90 active:scale-[0.98]"
                            : "bg-transparent text-secondary-muted border-secondary-muted cursor-not-allowed"
                    )}
                >
                    {totalCount > 0 ? `АППРОКСИМИРОВАТЬ ДАННЫЕ (${totalCount})` : 'НЕТ СОВПАДЕНИЙ'}
                </button>
            </div>
        </div>
    );
};

const ThemesSection = ({ filters, toggleGenreState }: { filters: FilterState; toggleGenreState: (id: string, status: TagStatus) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const activeThemeCount = useMemo(() => THEMES_LIST.filter(t => filters.genres[t.id] && filters.genres[t.id] !== 'none').length, [filters.genres]);

    return (
        <div className="space-y-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between group outline-none py-2 border-b-2 border-secondary-muted hover:border-cream transition-colors"
            >
                <h3 className="text-xl md:text-2xl font-editorial text-cream uppercase tracking-tight flex items-center gap-3">
                    <Tag size={24} className="text-secondary" /> ТЕМАТИКИ И ТРОПЫ
                    {activeThemeCount > 0 && (
                        <span className="text-sm font-black text-accent">[{activeThemeCount}]</span>
                    )}
                </h3>
                <ChevronDown size={32} className={cn(
                    "text-secondary transition-transform duration-500",
                    isOpen && "rotate-180 text-cream"
                )} />
            </button>

            <div className={cn(
                "overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]",
                isOpen ? "max-h-[1000px] opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"
            )}>
                <div className="flex flex-wrap gap-2 md:gap-3">
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
