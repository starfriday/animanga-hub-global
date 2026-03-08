/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Star, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurImage } from '@/components/ui/BlurImage';

export default function CollectionPage() {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/favorites')
            .then(r => r.json())
            .then(data => {
                const favs = data.favorites || [];
                if (favs.length === 0) {
                    setFavorites([]);
                    setLoading(false);
                    return;
                }

                // Fetch anime data for all favorite IDs
                const ids = favs.map((f: any) => f.animeId).join(',');
                fetch(`/api/anime?ids=${ids}&limit=100`)
                    .then(r => r.json())
                    .then(animeData => {
                        setFavorites(animeData.data || []);
                        setLoading(false);
                    })
                    .catch(() => { setFavorites([]); setLoading(false); });
            })
            .catch(() => { setFavorites([]); setLoading(false); });
    }, []);

    return (
        <main className="min-h-screen bg-bg-cream text-bg-dark overflow-hidden pt-16 selection:bg-accent selection:text-white">
            {/* Ambient Lighting Background */}
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-accent/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

            <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-24 pb-24">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-1.5 rounded-full bg-accent" />
                            <p className="text-sm font-bold uppercase tracking-widest text-accent/80">
                                Твой Личный Каталог
                            </p>
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-bg-dark tracking-tight drop-shadow-sm">
                            Моя <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/80">Коллекция</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-6 py-3 rounded-full border border-bg-dark/10 shadow-sm self-start md:self-auto hover:bg-white/80 transition-colors">
                        <Heart size={18} className="text-accent fill-accent" />
                        <span className="text-sm font-bold text-bg-dark tracking-wide">
                            {loading ? '...' : `${favorites.length} тайтлов`}
                        </span>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 size={40} className="animate-spin text-accent" />
                        <p className="text-sm font-bold text-bg-dark/50 uppercase tracking-widest">Загрузка коллекции...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && favorites.length === 0 && (
                    <div className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-bg-dark/5 rounded-[2rem] p-12 md:p-24 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] group">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                            <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping opacity-20" />
                            <Heart size={40} className="text-accent fill-accent/20" />
                        </div>

                        <h2 className="text-3xl lg:text-4xl font-black text-bg-dark tracking-tight mb-4 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-bg-dark group-hover:to-accent transition-all duration-500">
                            Коллекция пуста
                        </h2>
                        <p className="text-base lg:text-lg text-bg-dark/60 font-medium max-w-lg mx-auto mb-10 leading-relaxed">
                            Добавляйте аниме в избранное, нажимая на сердечко на карточке тайтла. Все ваши любимые произведения будут бережно храниться здесь.
                        </p>
                        <Link href="/catalog"
                            className="inline-flex items-center gap-3 bg-bg-dark text-bg-cream px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1 group/btn">
                            Перейти в каталог
                            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}

                {/* Grid */}
                {!loading && favorites.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 md:gap-6 lg:gap-8">
                        {favorites.map((anime, i) => (
                            <Link
                                key={anime.id}
                                href={`/anime/${anime.id}`}
                                className="group relative block animate-fade-in-up"
                                style={{ animationDelay: `${i * 40}ms` }}
                            >
                                <div className={cn(
                                    "relative bg-white/40 backdrop-blur-sm overflow-hidden flex flex-col h-full",
                                    "rounded-2xl border border-bg-dark/5",
                                    "hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2",
                                    "transition-all duration-500 ease-out"
                                )}>
                                    {/* Favorite Badge */}
                                    <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm">
                                        <Heart size={14} className="fill-accent text-accent" />
                                    </div>

                                    <div className="relative aspect-[3/4] overflow-hidden shrink-0">
                                        <BlurImage
                                            src={anime.image || anime.banner || ''}
                                            alt={anime.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-bg-dark/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                                    </div>

                                    <div className="p-4 md:p-5 flex flex-col grow bg-white/50 backdrop-blur-md">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <Star size={12} className="fill-accent text-accent" />
                                            <span className="text-[11px] font-black text-bg-dark">
                                                {(anime.studio_rating || 0).toFixed(1)}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-sm md:text-base leading-snug line-clamp-2 text-bg-dark group-hover:text-accent transition-colors mb-2">
                                            {anime.title}
                                        </h3>
                                        <div className="mt-auto">
                                            <p className="text-[10px] uppercase tracking-widest text-bg-dark/40 font-bold">
                                                {anime.type} {anime.year && `• ${anime.year}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
