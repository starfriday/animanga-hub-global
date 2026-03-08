/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ensureFullUrl } from '@/lib/imageUtils';

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    fill?: boolean;
}

export const BlurImage: React.FC<BlurImageProps> = ({ src, alt, className, fill, ...props }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // Resolve the image URL through the centralized utility
    const imgSrc = ensureFullUrl(src || '');

    // Check if image already loaded (SSR hydration race condition fix)
    useEffect(() => {
        if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsLoading(false);
        }
    }, [imgSrc]);

    const handleError = () => {
        setError(true);
        setIsLoading(false);
    };

    if (error || !imgSrc) {
        // Gradient placeholder for missing images
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                ref={imgRef}
                src={imgSrc}
                alt={alt}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
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
