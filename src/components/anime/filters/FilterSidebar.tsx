import React, { useMemo, useState } from 'react';
import {
    Filter, X, RotateCcw, Search, Zap,
    Eye, EyeOff, Tag, ChevronDown
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
    projects: any[]; // Used for histogram calculation
    isStrictGenreMatch?: boolean;
    onToggleStrictMatch?: () => void;
}

const PRESETS = ['СЕЙЧАС СМОТРЯТ', "ВЫБОР РЕДАКЦИИ", 'СКРЫТЫЕ ШЕДЕВРЫ'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
    filters,
    updateFilter,
    resetFilters,
    totalCount,
    isOpen,
    onClose,
    projects,
    isStrictGenreMatch,
    onToggleStrictMatch
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
        <aside className={cn(
            "fixed lg:sticky top-0 lg:top-[88px] left-0 h-full lg:h-[calc(100vh-88px)] w-[85%] sm:w-[320px] lg:w-[300px] shrink-0 bg-bg-cream border-r-4 lg:border-r-0 lg:border-4 border-bg-dark z-[200] lg:z-10 transition-transform duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col shadow-[8px_8px_0_var(--color-bg-dark)] lg:shadow-[4px_4px_0_var(--color-bg-dark)]",
            !isOpen && "-translate-x-full lg:translate-x-0"
        )}>
            {/* Header */}
            <div className="p-6 lg:p-5 space-y-4 shrink-0 bg-bg-cream z-10 border-b-4 border-bg-dark pb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent text-cream border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)]">
                            <Filter size={18} strokeWidth={3} />
                        </div>
                        <h2 className="text-xl font-editorial uppercase tracking-tight text-bg-dark">ФИЛЬТРЫ</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 border-2 border-bg-dark lg:hidden bg-white text-bg-dark active:translate-y-[2px] active:translate-x-[2px] transition-all shadow-[2px_2px_0_var(--color-bg-dark)] hover:shadow-none hover:bg-accent hover:text-white"
                    >
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                {/* Search */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-bg-dark/50 group-focus-within:text-accent transition-colors" size={18} strokeWidth={2.5} />
                    <input
                        type="text"
                        placeholder="ПОИСК ПО НАЗВАНИЮ..."
                        value={filters.search}
                        onChange={(e) => updateFilter('search', e.target.value)}
                        className="w-full bg-white border-2 border-bg-dark focus:border-accent py-3 pl-12 pr-12 text-xs font-bold uppercase tracking-widest outline-none transition-all placeholder:text-bg-dark/30 text-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)] focus:shadow-none"
                    />
                    {filters.search && (
                        <button
                            onClick={() => updateFilter('search', '')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-bg-dark/10 hover:bg-accent rounded-full text-bg-dark hover:text-white transition-all"
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
                            onClick={() => {
                                if (preset === 'СЕЙЧАС СМОТРЯТ') {
                                    resetFilters();
                                    updateFilter('status', ['Ongoing']);
                                } else if (preset === "ВЫБОР РЕДАКЦИИ") {
                                    resetFilters();
                                    updateFilter('sortBy', 'rating');
                                } else if (preset === 'СКРЫТЫЕ ШЕДЕВРЫ') {
                                    resetFilters();
                                    updateFilter('sortBy', 'newest');
                                }
                            }}
                            className="shrink-0 px-4 py-2 bg-white hover:bg-bg-dark hover:text-cream border-2 border-bg-dark text-[9px] font-black uppercase tracking-widest transition-all active:translate-y-[2px] active:translate-x-[2px] shadow-[2px_2px_0_var(--color-bg-dark)] hover:shadow-none outline-none text-bg-dark"
                        >
                            {preset}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-5 space-y-10 pb-40 overscroll-contain bg-bg-cream">

                {/* Genres */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-bg-dark uppercase tracking-[0.2em] flex items-center gap-2 border-b-2 border-bg-dark/10 pb-2">
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

                    {onToggleStrictMatch && (
                        <button
                            onClick={onToggleStrictMatch}
                            className={cn(
                                "w-full py-3 border-2 text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 mt-4 outline-none",
                                isStrictGenreMatch
                                    ? "bg-accent border-bg-dark text-white shadow-[2px_2px_0_var(--color-bg-dark)]"
                                    : "bg-white border-bg-dark text-bg-dark hover:bg-bg-dark hover:text-cream hover:shadow-none shadow-[2px_2px_0_var(--color-bg-dark)]"
                            )}
                        >
                            <Zap size={12} className={cn(isStrictGenreMatch && "fill-current")} />
                            Логика: {isStrictGenreMatch ? 'СТРОГО (И)' : 'МЯГКО (ИЛИ)'}
                        </button>
                    )}
                </div>

                {/* Themes */}
                <ThemesSection filters={filters} toggleGenreState={toggleGenreState} />

                {/* Year Range */}
                <div className="px-1 border-t-2 border-bg-dark/10 pt-6">
                    <HistogramSlider
                        label="ГОД ВЫПУСКА"
                        data={yearHistogram}
                        range={[1990, 2026]}
                        value={filters.yearRange}
                        onChange={(val) => updateFilter('yearRange', val)}
                    />
                </div>

                {/* Format & Status */}
                <div className="space-y-8 border-t-2 border-bg-dark/10 pt-6">
                    {/* Announcements Toggle */}
                    <button
                        onClick={() => updateFilter('showAnnouncements', !filters.showAnnouncements)}
                        className={cn(
                            "w-full p-4 border-2 transition-all flex items-center justify-between group outline-none",
                            filters.showAnnouncements
                                ? "bg-accent border-bg-dark text-white shadow-[2px_2px_0_var(--color-bg-dark)]"
                                : "bg-white border-bg-dark text-bg-dark hover:bg-bg-dark hover:text-cream shadow-[2px_2px_0_var(--color-bg-dark)] hover:shadow-none"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-2 border-2 border-bg-dark",
                                filters.showAnnouncements ? "bg-white text-bg-dark" : "bg-bg-cream text-bg-dark"
                            )}>
                                {filters.showAnnouncements ? <Eye size={16} strokeWidth={2.5} /> : <EyeOff size={16} strokeWidth={2.5} />}
                            </div>
                            <div className="text-left">
                                <div className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 text-inherit">АНОНСЫ</div>
                                <div className="text-[8px] font-bold opacity-80 uppercase tracking-tighter text-inherit">
                                    {filters.showAnnouncements ? 'ПОКАЗАНЫ ВОКРУГ' : 'СКРЫТЫ ИЗ ВИДА'}
                                </div>
                            </div>
                        </div>
                        <div className={cn(
                            "w-10 h-6 border-2 border-bg-dark relative transition-colors p-[2px]",
                            filters.showAnnouncements ? "bg-white" : "bg-bg-cream"
                        )}>
                            <div className={cn(
                                "w-4 h-4 rounded-sm transition-transform shadow-sm",
                                filters.showAnnouncements ? "translate-x-[14px] bg-accent" : "translate-x-0 bg-bg-dark/30"
                            )} />
                        </div>
                    </button>

                    <SegmentedControl
                        label="ФОРМАТ ПРОЕКТА"
                        options={[
                            { value: 'TV Series', label: 'СЕРИАЛ' },
                            { value: 'Movie', label: 'ФИЛЬМ' },
                            { value: 'OVA', label: 'OVA' },
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
            <div className="shrink-0 p-6 lg:p-5 border-t-4 border-bg-dark bg-bg-cream relative z-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={resetFilters}
                        className="p-4 border-2 border-bg-dark bg-white hover:bg-bg-dark hover:text-cream text-bg-dark transition-all shadow-[2px_2px_0_var(--color-bg-dark)] hover:shadow-none active:translate-y-0.5 active:translate-x-0.5 outline-none"
                        title="Reset all"
                    >
                        <RotateCcw size={20} strokeWidth={2.5} />
                    </button>
                    <button
                        disabled={totalCount === 0}
                        onClick={onClose}
                        className={cn(
                            "flex-1 py-4 px-6 border-2 border-bg-dark flex items-center justify-center font-black uppercase text-xs tracking-widest transition-all outline-none",
                            totalCount > 0
                                ? "bg-accent text-white shadow-[4px_4px_0_var(--color-bg-dark)] hover:shadow-[2px_2px_0_var(--color-bg-dark)] hover:translate-y-0.5 hover:translate-x-0.5 active:translate-y-1 active:translate-x-1 active:shadow-none"
                                : "bg-surface text-bg-dark/40 cursor-not-allowed shadow-none"
                        )}
                    >
                        <span className="lg:hidden">ПРИМЕНИТЬ ФИЛЬТРЫ</span>
                        <span className="hidden lg:inline">ПОКАЗАТЬ РЕЗУЛЬТАТ</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

// Separated collapsible themes section
function ThemesSection({ filters, toggleGenreState }: { filters: FilterState; toggleGenreState: (id: string, status: TagStatus) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    const activeThemeCount = useMemo(() => {
        return THEMES_LIST.filter(t => filters.genres[t.id] && filters.genres[t.id] !== 'none').length;
    }, [filters.genres]);

    return (
        <div className="space-y-4 border-t-2 border-bg-dark/10 pt-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between group outline-none"
            >
                <h3 className="text-xs font-black text-bg-dark uppercase tracking-[0.2em] flex items-center gap-2">
                    <Tag size={14} className="text-[#B83A2D] fill-[#B83A2D]/20" /> Темы
                    {activeThemeCount > 0 && (
                        <span className="bg-[#B83A2D] text-cream text-[9px] px-2 py-0.5 font-black border border-bg-dark">
                            {activeThemeCount}
                        </span>
                    )}
                </h3>
                <ChevronDown
                    size={16}
                    strokeWidth={3}
                    className={cn(
                        "text-bg-dark/50 transition-transform duration-300",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {isOpen && (
                <div className="flex flex-wrap gap-2 animate-fade-in-up">
                    {THEMES_LIST.map(theme => (
                        <ThreeStateTag
                            key={`theme-${theme.id}`}
                            label={theme.russian}
                            status={filters.genres[theme.id] || 'none'}
                            onChange={(status) => toggleGenreState(theme.id, status)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
