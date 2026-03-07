/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo, useState } from 'react';
import {
    Filter, X, RotateCcw, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThreeStateTag, TagStatus } from './ThreeStateTag';
import { HistogramSlider } from './HistogramSlider';
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

const SCORE_BUTTONS = [
    { value: 0, label: 'Любой' },
    { value: 7, label: '7+' },
    { value: 8, label: '8+' },
    { value: 9, label: '9+' },
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

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-bg-dark/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                    onClick={onClose}
                />
            )}

            <aside className={cn(
                "fixed lg:sticky top-0 lg:top-[88px] left-0 h-full lg:h-[calc(100vh-88px)] w-[85%] sm:w-[320px] lg:w-[280px] shrink-0 bg-white border-r border-secondary-muted/20 z-50 lg:z-10 transition-transform duration-300 ease-in-out flex flex-col shadow-xl lg:shadow-none",
                !isOpen && "-translate-x-full lg:translate-x-0"
            )}>
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 lg:hidden border-b border-secondary-muted/20">
                    <div className="flex items-center gap-2 text-bg-dark font-bold">
                        <Filter size={18} className="text-accent" /> Фильтры
                    </div>
                    <button onClick={onClose} className="p-2 text-secondary-muted hover:text-accent transition-colors rounded-full hover:bg-secondary-muted/10">
                        <X size={20} />
                    </button>
                </div>

                {/* Main Scrollable Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-8 pb-24">

                    {/* Reset Button */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-bg-dark flex items-center gap-2">
                            Параметры
                        </h3>
                        <button
                            onClick={resetFilters}
                            className="text-xs font-semibold text-secondary-muted hover:text-accent flex items-center gap-1 transition-colors bg-secondary-muted/10 px-2 py-1 rounded-md"
                        >
                            <RotateCcw size={12} /> Сбросить
                        </button>
                    </div>

                    {/* Genres */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-secondary-muted uppercase tracking-wider flex items-center gap-2">
                            Жанры
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
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

                    {/* Type & Status */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-secondary-muted uppercase tracking-wider">Тип</h4>
                            <div className="flex flex-col gap-2">
                                {['TV Series', 'Movie', 'OVA', 'ONA', 'Special'].map(type => (
                                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={filters.types.includes(type)}
                                            onChange={() => toggleArrayFilter('types', type)}
                                            className="w-4 h-4 rounded border-secondary-muted/30 text-accent focus:ring-accent"
                                        />
                                        <span className="text-sm font-medium text-bg-dark/80 group-hover:text-accent transition-colors">
                                            {type === 'TV Series' ? 'ТВ Сериал' : type === 'Movie' ? 'Фильм' : type === 'Special' ? 'Спешл' : type}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-secondary-muted uppercase tracking-wider">Статус</h4>
                            <div className="flex flex-col gap-2">
                                {[{ val: 'Ongoing', lbl: 'Онгоинг' }, { val: 'Completed', lbl: 'Завершён' }, { val: 'Announced', lbl: 'Анонс' }].map(status => (
                                    <label key={status.val} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={filters.status.includes(status.val)}
                                            onChange={() => toggleArrayFilter('status', status.val)}
                                            className="w-4 h-4 rounded border-secondary-muted/30 text-accent focus:ring-accent"
                                        />
                                        <span className="text-sm font-medium text-bg-dark/80 group-hover:text-accent transition-colors">
                                            {status.lbl}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Year Range */}
                    <div className="space-y-3 pt-2">
                        <HistogramSlider
                            label="ГОД ВЫПУСКА"
                            data={yearHistogram}
                            range={[1990, 2026]}
                            value={filters.yearRange}
                            onChange={(val) => updateFilter('yearRange', val)}
                        />
                    </div>

                    {/* Score */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-secondary-muted uppercase tracking-wider">Минимальный рейтинг</h4>
                        <div className="grid grid-cols-4 gap-1.5">
                            {SCORE_BUTTONS.map(btn => (
                                <button
                                    key={btn.value}
                                    onClick={() => updateFilter('minScore', filters.minScore === btn.value ? 0 : btn.value)}
                                    className={cn(
                                        "py-2 px-1 text-xs font-medium rounded-xl transition-all outline-none",
                                        filters.minScore === btn.value
                                            ? "bg-accent text-white shadow-md shadow-accent/20 scale-[1.02]"
                                            : "bg-secondary-muted/10 text-bg-dark hover:bg-secondary-muted/20 hover:text-accent"
                                    )}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Mobile Sticky Footer */}
                <div className="lg:hidden p-4 border-t border-secondary-muted/20 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] absolute bottom-0 w-full z-20">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-accent text-white font-bold rounded-xl shadow-lg shadow-accent/30 active:scale-95 transition-transform"
                    >
                        Показать ({totalCount})
                    </button>
                </div>
            </aside>
        </>
    );
};

// Separated themes section
const ThemesSection = ({ filters, toggleGenreState }: { filters: FilterState; toggleGenreState: (id: string, status: TagStatus) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const activeThemeCount = useMemo(() => THEMES_LIST.filter(t => filters.genres[t.id] && filters.genres[t.id] !== 'none').length, [filters.genres]);

    return (
        <div className="space-y-3">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between group outline-none hover:bg-secondary-muted/5 p-1.5 -ml-1.5 rounded-lg transition-colors"
            >
                <h4 className="text-xs font-bold text-secondary-muted uppercase tracking-wider flex items-center gap-2">
                    Темы
                    {activeThemeCount > 0 && (
                        <span className="min-w-[18px] h-[18px] flex items-center justify-center bg-accent text-white text-[10px] font-bold rounded-full">
                            {activeThemeCount}
                        </span>
                    )}
                </h4>
                <ChevronDown size={14} className={cn(
                    "text-secondary-muted transition-transform duration-300",
                    isOpen && "rotate-180"
                )} />
            </button>

            <div className={cn(
                "overflow-hidden transition-all duration-300 ease-out",
                isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="flex flex-wrap gap-1.5 pt-1 pb-2">
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
