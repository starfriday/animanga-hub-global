"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Bookmark, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernHeroProps {
    trending: any[];
}

export const ModernHero = ({ trending }: ModernHeroProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Take top 5 for the hero
    const slides = trending.slice(0, 5);

    useEffect(() => {
        if (slides.length <= 1 || isHovered) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 7000);

        return () => clearInterval(timer);
    }, [slides.length, isHovered]);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

    if (!slides.length) return <div className="h-[60vh] bg-bg-dark animate-pulse" />;

    return (
        <section
            className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] bg-bg-dark overflow-hidden group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background Slides */}
            {slides.map((slide, index) => {
                const isActive = index === currentIndex;
                const title = slide.russian || slide.name || 'Без названия';
                const description = slide.description ? slide.description.replace(/\[\/?.*?\]/g, '') : 'Описание отсутствует.';
                const year = slide.aired_on ? new Date(slide.aired_on).getFullYear() : 'TBA';
                const type = slide.kind === 'tv' ? 'ТВ Сериал' : slide.kind === 'movie' ? 'Фильм' : 'Спешл';

                return (
                    <div
                        key={slide.id}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                            isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                        )}
                    >
                        {/* Banner Image */}
                        <div className="absolute inset-0">
                            <Image
                                src={slide.posterUrl || slide.image}
                                alt={title}
                                fill
                                priority={isActive}
                                className={cn(
                                    "object-cover object-center transition-transform duration-[10000ms] ease-linear",
                                    isActive ? "scale-105" : "scale-100"
                                )}
                                unoptimized
                            />
                            {/* Gradient Overlays for Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/60 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-bg-dark/90 via-bg-dark/50 to-transparent" />
                        </div>

                        {/* Content Container */}
                        <div className="relative z-20 h-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 flex flex-col justify-end pb-20 md:pb-24">
                            <div className="max-w-2xl space-y-4 md:space-y-6">
                                {/* Badges */}
                                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                    <span className="px-2.5 py-1 bg-accent/90 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider rounded backdrop-blur-sm">
                                        Топ Сезона
                                    </span>
                                    {slide.score > 0 && (
                                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 text-white text-[10px] md:text-xs font-bold rounded backdrop-blur-sm border border-white/20">
                                            <Star size={12} className="text-accent fill-accent" />
                                            {slide.score}
                                        </span>
                                    )}
                                    <span className="px-2.5 py-1 bg-white/10 text-white text-[10px] md:text-xs font-bold rounded backdrop-blur-sm border border-white/20">
                                        {year}
                                    </span>
                                    <span className="px-2.5 py-1 bg-white/10 text-white text-[10px] md:text-xs font-bold rounded backdrop-blur-sm border border-white/20">
                                        {type}
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg">
                                    {title}
                                </h1>

                                {/* Description */}
                                <p className="text-white/80 text-sm md:text-base line-clamp-2 md:line-clamp-3 max-w-xl text-shadow-sm leading-relaxed">
                                    {description}
                                </p>

                                {/* Actions */}
                                <div className="flex flex-wrap items-center gap-4 pt-4">
                                    <Link href={`/anime/${slide.shikimoriId || slide.id}`}>
                                        <button className="flex items-center bg-accent hover:bg-accent/90 text-white px-8 py-6 rounded-xl font-bold text-base shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-95 group">
                                            <Play size={20} className="mr-2 fill-current group-hover:scale-110 transition-transform" />
                                            Смотреть
                                        </button>
                                    </Link>
                                    <button className="flex items-center bg-white/10 hover:bg-white/20 border-2 border-white/20 text-white px-6 py-6 rounded-xl font-bold backdrop-blur-sm transition-all hover:scale-105 active:scale-95">
                                        <Bookmark size={20} className="mr-2" />
                                        В закладки
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Navigation Arrows */}
            <div className="absolute bottom-6 md:bottom-1/2 md:translate-y-1/2 right-4 md:right-8 z-30 flex md:flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={prevSlide}
                    className="p-3 bg-bg-dark/50 hover:bg-accent text-white backdrop-blur-sm rounded-full border border-white/10 transition-colors"
                >
                    <ChevronLeft size={24} className="md:rotate-90" />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-3 bg-bg-dark/50 hover:bg-accent text-white backdrop-blur-sm rounded-full border border-white/10 transition-colors"
                >
                    <ChevronRight size={24} className="md:rotate-90" />
                </button>
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-4 md:left-8 lg:left-12 z-30 flex items-center gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            index === currentIndex ? "w-8 bg-accent" : "w-2 bg-white/40 hover:bg-white/70"
                        )}
                        aria-label={`Переключить на слайд ${index + 1}`}
                    />
                ))}
            </div>

            {/* Soft gradient into content */}
            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#f8f9fa] to-transparent z-20 pointer-events-none" />
        </section>
    );
};
