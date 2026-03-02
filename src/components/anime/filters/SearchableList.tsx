import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Pin, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchableItem {
    id: string;
    label: string;
    logo?: string;
    count?: number;
}

interface SearchableListProps {
    items: SearchableItem[];
    selected: string[];
    onToggle: (id: string) => void;
    placeholder?: string;
}

export const SearchableList: React.FC<SearchableListProps> = ({
    items,
    selected,
    onToggle,
    placeholder = "Search..."
}) => {
    const [search, setSearch] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // 1. Separate selected vs unselected for pinning
    // 2. Filter unselected by search
    const processedItems = useMemo(() => {
        const selectedSet = new Set(selected);
        const pinned = items.filter(item => selectedSet.has(item.id));
        const others = items.filter(item => !selectedSet.has(item.id) &&
            item.label.toLowerCase().includes(search.toLowerCase())
        );

        return [...pinned, ...others];
    }, [items, selected, search]);

    const [visibleCount, setVisibleCount] = useState(30);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setVisibleCount(prev => Math.min(prev + 30, processedItems.length));
            }
        }, { threshold: 0.1 });

        const endElement = document.getElementById('list-end-sentinel');
        if (endElement) observer.observe(endElement);

        return () => observer.disconnect();
    }, [processedItems.length]);

    return (
        <div className="space-y-3">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-accent transition-colors" size={14} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 focus:border-accent/50 rounded-xl py-2 pl-9 pr-4 text-xs outline-none transition-all placeholder:text-secondary/50"
                />
            </div>

            <div
                ref={scrollRef}
                className="max-h-[240px] overflow-y-auto custom-scrollbar space-y-1 pr-1"
            >
                {processedItems.slice(0, visibleCount).map((item) => {
                    const isSelected = selected.includes(item.id);
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onToggle(item.id)}
                            className={cn(
                                "w-full flex items-center justify-between p-2 rounded-lg transition-all group",
                                isSelected
                                    ? "bg-accent/10 text-white"
                                    : "hover:bg-white/5 text-secondary hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-4 h-4 rounded border flex items-center justify-center transition-all",
                                    isSelected
                                        ? "bg-accent border-accent"
                                        : "bg-black/20 border-white/10 group-hover:border-white/30"
                                )}>
                                    {isSelected && <Check size={10} strokeWidth={4} />}
                                </div>
                                {item.logo && (
                                    <img src={item.logo} alt="" className="w-5 h-5 rounded-md object-contain bg-white/5" />
                                )}
                                <span className="text-[11px] font-bold tracking-tight">{item.label}</span>
                            </div>

                            {item.count !== undefined && (
                                <span className="text-[9px] font-mono opacity-30">{item.count}</span>
                            )}
                        </button>
                    );
                })}

                {processedItems.length > visibleCount && (
                    <div id="list-end-sentinel" className="h-4 w-full" />
                )}

                {processedItems.length === 0 && (
                    <div className="py-8 text-center text-xs text-secondary opacity-50 italic">
                        Nothing found...
                    </div>
                )}
            </div>
        </div>
    );
};
