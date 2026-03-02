import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: string;
    className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
    const styles: Record<string, string> = {
        'Ongoing': 'text-accent border-accent bg-accent/10',
        'Completed': 'text-green-400 border-green-500/50 bg-green-500/10',
        'Released': 'text-green-400 border-green-500/50 bg-green-500/10',
        'Announced': 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10',
    };

    return (
        <span className={cn(
            "px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider border",
            styles[status] || 'text-secondary border-secondary/50 bg-secondary/10',
            className
        )}>
            {status}
        </span>
    );
};
