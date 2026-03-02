"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { MarqueeStrip } from './MarqueeStrip';

interface Props {
    variant?: 'wave' | 'curve' | 'zigzag' | 'marquee' | 'strip';
    flip?: boolean;
    className?: string;
    color?: string;
}

export const SectionDivider: React.FC<Props> = ({
    variant = 'strip',
    flip = false,
    className,
    color,
}) => {
    if (variant === 'marquee') {
        return <MarqueeStrip variant="dark" speed="fast" />;
    }

    // In the retro-editorial style, we use thick brutalist stripes instead of curves
    return (
        <div
            className={cn(
                'w-full h-8 sm:h-12 border-y-4 border-bg-dark relative z-20 flex items-center justify-center overflow-hidden',
                flip && 'rotate-180',
                className
            )}
            style={{ backgroundColor: color || 'var(--color-bg-cream)' }}
        >
            <div className="w-full h-full opacity-20" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, var(--color-bg-dark) 10px, var(--color-bg-dark) 20px)'
            }} />
        </div>
    );
};
