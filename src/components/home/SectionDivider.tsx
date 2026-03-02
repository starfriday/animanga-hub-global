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

    // Vintage magazine section divider with ink print pattern
    return (
        <div
            className={cn(
                'w-full relative z-20 overflow-hidden',
                flip && 'rotate-180',
                className
            )}
            style={{ backgroundColor: color || 'var(--color-bg-cream)' }}
        >
            {/* Thick editorial border line */}
            <div className="h-1 bg-bg-dark w-full" />

            {/* Decorative dotted strip (vintage print feel) */}
            <div className="h-6 flex items-center justify-between px-6 lg:px-16">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent" />
                    <div className="w-8 h-px bg-bg-dark/20" />
                </div>
                <div className="flex gap-1.5">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-bg-dark/10" />
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-px bg-bg-dark/20" />
                    <div className="w-2 h-2 bg-accent" />
                </div>
            </div>

            {/* Bottom line */}
            <div className="h-1 bg-bg-dark w-full" />
        </div>
    );
};
