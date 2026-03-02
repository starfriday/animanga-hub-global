import React from 'react';
import { cn } from '@/lib/utils';

interface Option {
    value: string;
    label: string;
}

interface SegmentedControlProps {
    options: Option[];
    selected: string[];
    onToggle: (value: string) => void;
    label?: string;
    multi?: boolean;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
    options,
    selected,
    onToggle,
    label,
    multi = true
}) => {
    return (
        <div className="space-y-3">
            {label && <label className="text-[10px] font-black text-bg-dark uppercase tracking-widest flex items-center gap-2"><span className="w-2 h-2 bg-accent inline-block rounded-sm"></span>{label}</label>}
            <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-white border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)]">
                {options.map((opt) => {
                    const isSelected = selected.includes(opt.value);
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => onToggle(opt.value)}
                            className={cn(
                                "py-2.5 px-1 border-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all outline-none",
                                isSelected
                                    ? "bg-bg-dark border-bg-dark text-cream shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)]"
                                    : "bg-surface border-transparent text-bg-dark hover:border-bg-dark/20 hover:bg-bg-dark/5"
                            )}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
