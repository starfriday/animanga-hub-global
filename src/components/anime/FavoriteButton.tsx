/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthModal } from '@/components/auth/AuthModal';

interface FavoriteButtonProps {
    animeId: string;
    className?: string;
    showText?: boolean;
    variant?: 'icon' | 'brutalist';
}

export function FavoriteButton({ animeId, className, showText = false, variant = 'icon' }: FavoriteButtonProps) {
    const { user } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        if (!user) {
            setIsFavorite(false);
            return;
        }

        const checkFavorite = async () => {
            try {
                const res = await fetch('/api/favorites');
                if (res.ok) {
                    const data = await res.json();
                    const isFav = data.favorites.some((f: any) => f.animeId === animeId);
                    setIsFavorite(isFav);
                }
            } catch (error) {
                console.error('Failed to check favorite status:', error);
            }
        };

        checkFavorite();
    }, [user, animeId]);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            setShowAuthModal(true);
            return;
        }

        setIsLoading(true);

        try {
            if (isFavorite) {
                await fetch(`/api/favorites?animeId=${animeId}`, { method: 'DELETE' });
                setIsFavorite(false);
            } else {
                await fetch('/api/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ animeId })
                });
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (variant === 'brutalist') {
        return (
            <>
                <button
                    onClick={toggleFavorite}
                    disabled={isLoading}
                    className={cn(
                        "btn-haptic w-full sm:w-auto justify-center flex items-center gap-3 px-8 py-5 font-black uppercase tracking-widest text-sm md:text-base border-2 border-bg-dark shadow-[6px_6px_0_var(--color-bg-dark)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 outline-none transition-all",
                        isFavorite ? "bg-bg-dark text-cream" : "bg-white text-bg-dark hover:bg-bg-dark hover:text-white",
                        className
                    )}
                >
                    <Heart size={20} className={isFavorite ? "fill-current" : ""} />
                    {isFavorite ? 'В ИЗБРАННОМ' : 'В ИЗБРАННОЕ'}
                </button>
                <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialMode="login" />
            </>
        );
    }

    return (
        <>
            <button
                onClick={toggleFavorite}
                disabled={isLoading}
                className={cn(
                    "flex items-center justify-center p-2 rounded-full transition-all active:scale-95 bg-bg-dark/80 backdrop-blur-sm border-2 border-transparent hover:border-cream",
                    isFavorite
                        ? "text-red-500 border-red-500/50"
                        : "text-white hover:text-red-400",
                    className
                )}
                title={isFavorite ? "В избранном" : "Добавить в избранное"}
            >
                <Heart
                    size={20}
                    className={cn(
                        "transition-all duration-300",
                        isFavorite ? "fill-current scale-110" : "scale-100"
                    )}
                />
            </button>
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialMode="login" />
        </>
    );
}
