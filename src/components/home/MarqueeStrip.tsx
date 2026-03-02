"use client";

import React from 'react';
import { cn } from '@/lib/utils';

const ANIME_TITLES = [
    "АТАКА ТИТАНОВ", "МАГИЧЕСКАЯ БИТВА", "ЧЕЛОВЕК-БЕНЗОПИЛА",
    "КЛИНОК РАССЕКАЮЩИЙ ДЕМОНОВ", "ВАН ПИС", "БЛИЧ", "НАРУТО",
    "АКАДЕМИЯ ГЕРОЕВ", "ОХОТНИК × ОХОТНИК", "ТЕТРАДЬ СМЕРТИ",
    "ЕВАНГЕЛИОН", "КОВБОЙ БИБОП", "АКИРА", "БЕРСЕРК"
];

interface MarqueeStripProps {
    className?: string;
    speed?: 'normal' | 'fast';
    variant?: 'red' | 'dark' | 'cream' | 'light';
    text?: string[];
}

export const MarqueeStrip = ({
    className,
    speed = 'normal',
    variant = 'red',
    text = ANIME_TITLES
}: MarqueeStripProps) => {

    const marqueeContent = [...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center shrink-0">
            {text.map((title, idx) => (
                <React.Fragment key={`${i}-${idx}`}>
                    <span
                        className={cn(
                            "font-editorial text-xl sm:text-2xl md:text-3xl tracking-wide font-black uppercase mx-6 sm:mx-8 leading-none whitespace-nowrap",
                            variant === 'cream' || variant === 'light' ? 'text-bg-dark/20' : ''
                        )}
                        style={(variant === 'cream' || variant === 'light') ? { WebkitTextStroke: '1.5px var(--color-bg-dark)', color: 'transparent' } : {}}
                    >
                        {title}
                    </span>
                    <span className={cn("mx-3 text-lg", variant === 'cream' || variant === 'light' ? 'opacity-30' : 'opacity-60')}>
                        {variant === 'red' ? '◆' : '※'}
                    </span>
                </React.Fragment>
            ))}
        </div>
    ));

    return (
        <div
            className={cn(
                "w-full py-3 sm:py-4 overflow-hidden flex items-center relative z-20",
                variant === 'red' && "bg-accent text-cream border-y-2 border-bg-dark",
                variant === 'dark' && "bg-bg-dark text-cream border-y-2 border-cream/10",
                variant === 'cream' && "bg-bg-cream text-bg-dark border-y-2 border-bg-dark/20",
                variant === 'light' && "bg-bg-cream text-bg-dark border-y-4 border-bg-dark",
                className
            )}
        >
            <div
                className={cn(
                    "marquee-track shrink-0",
                    speed === 'fast' ? "animate-marquee-fast" : "animate-marquee"
                )}
            >
                {marqueeContent}
            </div>
        </div>
    );
};
