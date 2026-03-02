import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TagStatus = 'included' | 'excluded' | 'none';

interface ThreeStateTagProps {
    label: string;
    status: TagStatus;
    onChange: (newStatus: TagStatus) => void;
}

export const ThreeStateTag: React.FC<ThreeStateTagProps> = ({ label, status, onChange }) => {
    const handleClick = () => {
        if (status === 'none') onChange('included');
        else if (status === 'included') onChange('excluded');
        else onChange('none');
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={cn(
                "group relative px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest border-2 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center gap-2 select-none active:translate-y-0.5 active:translate-x-0.5 outline-none",
                status === 'none' && "bg-surface border-bg-dark text-bg-dark hover:bg-bg-dark hover:text-cream shadow-[2px_2px_0_var(--color-bg-dark)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5",
                status === 'included' && "bg-accent border-accent text-cream shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)] translate-y-0.5 translate-x-0.5",
                status === 'excluded' && "bg-white border-bg-dark text-bg-dark line-through decoration-2 decoration-red-500 shadow-[inset_0_2px_5px_rgba(0,0,0,0.1)] translate-y-0.5 translate-x-0.5"
            )}
        >
            <div className="relative w-3 h-3 flex items-center justify-center">
                {/* Icons with smooth flip/fade */}
                <div className={cn(
                    "absolute transition-all duration-300",
                    status === 'included' ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-0 rotate-90"
                )}>
                    <Check size={12} strokeWidth={3} />
                </div>

                <div className={cn(
                    "absolute transition-all duration-300",
                    status === 'excluded' ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-0 -rotate-90"
                )}>
                    <X size={12} strokeWidth={3} />
                </div>

                {/* Neutral state dot */}
                <div className={cn(
                    "w-1.5 h-1.5 rounded-full bg-current transition-all duration-300",
                    status !== 'none' ? "opacity-0 scale-0" : "opacity-40 scale-100"
                )} />
            </div>

            {label}

            {/* Micro-tooltip replacement for brutalist block */}
            <div className={cn(
                "absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10 pointer-events-none mix-blend-overlay bg-black",
            )} />
        </button>
    );
};
