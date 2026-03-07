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
            {label && <label className="text-[10px] font-black text-cream uppercase tracking-widest flex items-center gap-2"><span className="w-2 h-2 bg-accent inline-block rounded-sm"></span>{label}</label>}
            <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-bg-dark border-2 border-secondary-muted shadow-[2px_2px_0_var(--color-secondary-muted)]">
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
                                    ? "bg-cream border-cream text-bg-dark shadow-[inset_0_2px_5px_rgba(0,0,0,0.3)]"
                                    : "bg-bg-dark border-transparent text-cream hover:border-secondary-muted/50 hover:bg-secondary-muted/20"
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
