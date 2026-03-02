"use client";

import React from 'react';
import { cn } from '@/lib/utils';

const ANIME_TITLES = [
    "ATTACK ON TITAN", "JUJUTSU KAISEN", "CHAINSAW MAN",
    "DEMON SLAYER", "ONE PIECE", "BLEACH", "NARUTO",
    "MY HERO ACADEMIA", "HUNTER X HUNTER", "DEATH NOTE",
    "EVANGELION", "COWBOY BEBOP", "AKIRA", "BERSERK"
];

interface MarqueeStripProps {
    className?: string;
    speed?: 'normal' | 'fast';
    variant?: 'red' | 'dark' | 'cream';
    text?: string[];
}

export const MarqueeStrip = ({
    className,
    speed = 'normal',
    variant = 'red',
    text = ANIME_TITLES
}: MarqueeStripProps) => {

    // Create an array that's repeated multiple times to ensure smooth scrolling
    const marqueeContent = [...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center shrink-0">
            {text.map((title, idx) => (
                <React.Fragment key={`${i}-${idx}`}>
                    <span
                        className={cn(
                            "font-editorial text-2xl md:text-3xl tracking-wide font-black uppercase mx-8 leading-none",
                            variant === 'cream' ? 'text-border-active' : ''
                        )}
                        style={variant === 'cream' ? { WebkitTextStroke: '2px var(--color-bg-dark)' } : {}}
                    >
                        {title}
                    </span>
                    <span className="mx-4 text-xl opacity-60">
                        {variant === 'red' ? '✦' : '※'}
                    </span>
                </React.Fragment>
            ))}
        </div>
    ));

    return (
        <div
            className={cn(
                "w-full py-4 overflow-hidden flex items-center border-y relative z-20",
                variant === 'red' && "bg-accent text-cream border-cream/20",
                variant === 'dark' && "bg-bg-dark text-cream border-cream/10",
                variant === 'cream' && "bg-cream text-bg-dark border-bg-dark/20",
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
