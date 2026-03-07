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
                "group relative px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ease-out flex items-center gap-2 select-none active:scale-95 outline-none border",
                status === 'none' && "bg-secondary-muted/10 border-transparent text-bg-dark/80 hover:bg-secondary-muted/20 hover:text-bg-dark",
                status === 'included' && "bg-accent border-accent text-white shadow-md shadow-accent/20",
                status === 'excluded' && "bg-red-50 border-red-200 text-red-400 line-through decoration-1"
            )}
        >
            <div className="relative w-3 h-3 flex items-center justify-center">
                {/* Icons with smooth flip/fade */}
                <div className={cn(
                    "absolute transition-all duration-300",
                    status === 'included' ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 rotate-90"
                )}>
                    <Check size={12} strokeWidth={3} />
                </div>

                <div className={cn(
                    "absolute transition-all duration-300",
                    status === 'excluded' ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-90"
                )}>
                    <X size={12} strokeWidth={3} />
                </div>

                {/* Neutral state dot (removed for cleaner look, handled by padding/layout if empty) */}
                <div className={cn(
                    "w-1 h-1 rounded-full bg-current transition-all duration-300",
                    status === 'none' ? "opacity-40 scale-100" : "opacity-0 scale-0"
                )} />
            </div>

            {label}
        </button>
    );
};
