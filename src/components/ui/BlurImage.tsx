"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    fill?: boolean;
}

export const BlurImage: React.FC<BlurImageProps> = ({ src, alt, className, fill, ...props }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [retried, setRetried] = useState(false);

    const handleError = () => {
        // If the primary URL fails and it's a Shikimori 'original' URL, try 'preview' size
        if (!retried && src?.includes('/system/animes/original/')) {
            setRetried(true);
            // Will re-render with preview URL
        } else {
            setError(true);
            setIsLoading(false);
        }
    };

    // If retried, swap 'original' for 'preview' in Shikimori URL
    let imgSrc = src || '';
    if (retried && !error && imgSrc.includes('/system/animes/original/')) {
        imgSrc = imgSrc.replace('/original/', '/preview/');
    }

    if (error || !imgSrc) {
        // Beautiful gradient placeholder instead of ugly missing image
        return (
            <div className={cn("relative overflow-hidden bg-gradient-to-br from-purple-900/30 via-slate-800/50 to-indigo-900/30 flex items-center justify-center", className)}>
                <div className="flex flex-col items-center gap-2 opacity-40">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold">No Image</span>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("relative overflow-hidden bg-secondary/10", className)}>
            <img
                src={imgSrc}
                alt={alt}
                loading="lazy"
                decoding="async"
                className={cn(
                    "duration-700 ease-in-out w-full h-full object-cover",
                    isLoading ? "scale-110 blur-2xl grayscale" : "scale-100 blur-0 grayscale-0"
                )}
                onLoad={() => setIsLoading(false)}
                onError={handleError}
                {...props}
            />
        </div>
    );
};
