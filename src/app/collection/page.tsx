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
        <main className="min-h-screen bg-[#f5ead6]">
            {/* Halftone */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{ backgroundImage: `radial-gradient(circle, #1a1a1a 1px, transparent 1px)`, backgroundSize: '6px 6px' }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 pt-32 pb-24">
                {/* Header */}
                <div className="flex items-end gap-4 mb-2">
                    <h1 className="font-editorial text-6xl md:text-8xl uppercase tracking-tighter text-[#1a1411]"
                        style={{ textShadow: '2px 2px 0 rgba(184,58,45,0.15)' }}>
                        МОЯ <span className="text-[#b83a2d]">КОЛЛЕКЦИЯ</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-16 h-1 bg-[#b83a2d]" />
                    <p className="text-xs font-bold uppercase tracking-widest text-[#1a1411]/40">
                        {loading ? '...' : `${favorites.length} тайтлов`}
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-32">
                        <Loader2 size={40} className="animate-spin text-[#b83a2d]" />
                    </div>
                )}

                {/* Empty state */}
                {!loading && favorites.length === 0 && (
                    <div className="bg-[#f0e4cc] border-2 border-[#1a1411]/15 p-12 md:p-16 shadow-[4px_4px_0_rgba(26,20,17,0.15)] text-center">
                        <Heart size={48} className="mx-auto text-[#b83a2d]/30 mb-6" />
                        <h2 className="font-editorial text-3xl uppercase tracking-wider text-[#1a1411] mb-4">
                            Коллекция пуста
                        </h2>
                        <p className="text-sm text-[#1a1411]/50 font-medium max-w-md mx-auto mb-8">
                            Добавляйте аниме в избранное, нажимая на сердечко на карточке или на странице аниме.
                            Все ваши любимые тайтлы будут собраны здесь.
                        </p>
                        <Link href="/catalog"
                            className="inline-flex items-center gap-2 bg-[#b83a2d] text-white px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-[#a83020] transition-colors">
                            Перейти в каталог <ArrowRight size={14} />
                        </Link>
                    </div>
                )}

                {/* Grid */}
                {!loading && favorites.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
                        {favorites.map((anime, i) => (
                            <Link
                                key={anime.id}
                                href={`/anime/${anime.id}`}
                                className="group relative block animate-fade-in-up"
                                style={{ animationDelay: `${i * 40}ms` }}
                            >
                                <div className={cn(
                                    "relative bg-[#f0e4cc] border-2 border-[#1a1411]/20 overflow-hidden",
                                    "shadow-[3px_3px_0_rgba(26,20,17,0.2)]",
                                    "group-hover:shadow-[5px_5px_0_rgba(26,20,17,0.3)] group-hover:-translate-y-1",
                                    "transition-all duration-300"
                                )}>
                                    {/* Favorite badge */}
                                    <div className="absolute top-2 right-2 z-10">
                                        <Heart size={16} className="fill-[#b83a2d] text-[#b83a2d]" />
                                    </div>

                                    <div className="relative aspect-[3/4] overflow-hidden">
                                        <BlurImage
                                            src={anime.image || anime.banner || ''}
                                            alt={anime.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                    </div>

                                    <div className="p-2.5 border-t-2 border-[#1a1411]/10">
                                        <div className="flex items-center gap-1 mb-1">
                                            <Star size={10} className="fill-[#b83a2d] text-[#b83a2d]" />
                                            <span className="text-[10px] font-black text-[#b83a2d]">
                                                {(anime.studio_rating || 0).toFixed(1)}
                                            </span>
                                        </div>
                                        <h3 className="font-black text-[10px] uppercase leading-tight text-[#1a1411] tracking-wide line-clamp-2">
                                            {anime.title}
                                        </h3>
                                        <p className="text-[8px] uppercase tracking-widest text-[#1a1411]/40 font-bold mt-1">
                                            {anime.type} • {anime.year || ''}
                                        </p>
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
