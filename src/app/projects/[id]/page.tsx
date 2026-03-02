"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Play, Star, Eye, ChevronUp, ChevronDown, Check, Plus, Share2, Info, Users, BookOpen, FileText } from 'lucide-react';
import { mockProjects } from '@/data/mockProjects';
import { BlurImage } from '@/components/ui/BlurImage';
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
    const id = params.id;
    const project = mockProjects.find(p => p.id === id || p.slug === id);
    const [isDescExpanded, setDescExpanded] = useState(false);
    const [currentEpisode, setCurrentEpisode] = useState(1);
    const { ref: playerRef, isVisible: playerVisible } = useScrollReveal(0.1);

    if (!project) {
        return notFound();
    }

    const isReadingProject = ['Manga', 'Novel', 'Ranobe', 'Comics'].includes(project.type);
    const totalEps = project.totalEpisodes || project.episodes || 1;
    const episodeList = Array.from({ length: totalEps }, (_, i) => i + 1);
    const isAnnounced = project.status === 'Announced';

    return (
        <main className="w-full min-h-screen pb-24 bg-[#0A0A0A] text-white transition-colors duration-300">
            {/* HERO */}
            <section className="relative w-full min-h-[70vh] lg:min-h-[85vh] flex items-end">
                <div className="absolute inset-0">
                    <BlurImage
                        src={project.banner || project.image}
                        alt=""
                        className="w-full h-full object-cover transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent hidden md:block" />
                    <div className="absolute inset-0 bg-black/30 lg:bg-black/10" />
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pb-12 sm:pb-20">
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 sm:space-y-8">
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 w-full animate-fade-in-up">
                            <Link href="/" className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                                Главная
                            </Link>
                            <span className="text-white/20">/</span>
                            <Link href="/catalog" className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                                Каталог
                            </Link>
                            <span className="text-white/20">/</span>
                            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                                {project.title.length > 20 ? project.title.slice(0, 20) + '...' : project.title}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[0.85] tracking-tighter drop-shadow-2xl animate-fade-in-up">
                                {project.title}
                            </h1>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm font-bold">
                                <div className="flex items-center gap-1.5 text-amber-500 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                                    <Star className="fill-current" size={14} /> {project.studio_rating}
                                </div>
                                <span className="text-white/60">{project.year}</span>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span className="text-white/60">{project.type}</span>

                                {!isReadingProject && totalEps > 0 && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-white/20" />
                                        <span className="text-white/60">{project.episodes || 0} / {totalEps} эп.</span>
                                    </>
                                )}

                                <span className={cn(
                                    "px-2 py-0.5 rounded-lg text-[10px] uppercase font-black tracking-widest border backdrop-blur-md flex items-center gap-1.5",
                                    project.status === 'Ongoing' ? "bg-green-500/20 text-green-400 border-green-500/30" :
                                        project.status === 'Completed' ? "bg-accent/20 text-accent border-accent/30" :
                                            "bg-white/10 text-white/60 border-white/10"
                                )}>
                                    {project.status === 'Ongoing' && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
                                    {project.status === 'Ongoing' ? 'Live' : project.status === 'Completed' ? 'Завершено' : 'Анонс'}
                                </span>

                                {(project.views || 0) > 0 && (
                                    <span className="flex items-center gap-1.5 text-white/40">
                                        <Eye size={14} /> {project.views?.toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {project.description && (
                            <div className="max-w-xl space-y-2">
                                <p className={cn(
                                    "text-lg text-gray-300 leading-relaxed font-serif opacity-80 transition-all",
                                    !isDescExpanded && "line-clamp-2"
                                )}>
                                    {project.description}
                                </p>
                                {project.description.length > 150 && (
                                    <button
                                        onClick={() => setDescExpanded(!isDescExpanded)}
                                        className="text-xs font-black uppercase tracking-widest text-accent hover:text-white transition-colors flex items-center gap-1 mx-auto lg:mx-0"
                                    >
                                        {isDescExpanded ? <><ChevronUp size={14} /> Свернуть</> : <><ChevronDown size={14} /> Подробнее</>}
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                            <button
                                className="flex items-center gap-3 px-10 py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl text-sm hover:bg-accent hover:text-white transition-all shadow-2xl active:scale-95"
                            >
                                {isReadingProject ? <BookOpen size={20} /> : <Play size={20} className="fill-current" />}
                                {isReadingProject ? 'Читать' : 'Смотреть'}
                            </button>

                            <button className="flex items-center gap-3 px-8 py-4 font-black uppercase tracking-widest rounded-2xl text-sm backdrop-blur-md border transition-all active:scale-95 bg-white/5 text-white border-white/10 hover:bg-white/10">
                                <Plus size={18} />
                                <span className="hidden sm:inline">В список</span>
                            </button>

                            <div className="flex items-center p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
                                <button className="p-3 rounded-xl transition-all active:scale-95 text-white/60 hover:text-white">
                                    <Star size={20} />
                                </button>
                                <div className="w-px h-6 bg-white/10 mx-1" />
                                <button className="p-3 text-white/60 hover:text-white transition-all active:scale-95">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PLAYER AREA */}
            {!isReadingProject ? (
                <div id="player-section" ref={playerRef} className={cn(
                    "max-w-7xl mx-auto px-6 lg:px-12 mt-12 relative z-10 transition-all duration-700",
                    playerVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"
                )}>
                    <div className="bg-[#121212] border border-white/5 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent/5 to-transparent pointer-events-none" />

                        <div className="relative z-10 space-y-8">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-accent/20 rounded-2xl text-accent">
                                        <Play size={20} fill="currentColor" />
                                    </div>
                                    <h2 className="font-display font-black text-2xl tracking-tight uppercase">
                                        {isAnnounced ? 'Трейлер' : 'Просмотр'}
                                    </h2>
                                </div>
                            </div>

                            <div className="aspect-video w-full bg-black/50 rounded-[2rem] border border-white/10 flex items-center justify-center shadow-2xl relative">
                                <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 text-white/20 font-mono text-sm uppercase tracking-widest">
                                    Видео плеер (Mock)
                                </div>
                            </div>

                            {!isAnnounced && episodeList.length > 0 && (
                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/30">Эпизоды</h3>
                                        <div className="flex-1 h-px bg-white/5" />
                                    </div>
                                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 lg:grid-cols-12 gap-3 max-h-60 overflow-y-auto scrollbar-hide pr-1">
                                        {episodeList.map(num => {
                                            const isAvailable = typeof project.episodes === 'number' ? num <= project.episodes : false;
                                            return (
                                                <button
                                                    key={num}
                                                    disabled={!isAvailable}
                                                    onClick={() => isAvailable && setCurrentEpisode(num)}
                                                    className={cn(
                                                        "aspect-square rounded-xl text-sm font-black transition-all relative overflow-hidden active:scale-90",
                                                        isAvailable
                                                            ? (currentEpisode === num
                                                                ? "bg-white text-black shadow-xl scale-110 z-10"
                                                                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5")
                                                            : "opacity-20 grayscale"
                                                    )}
                                                >
                                                    {num}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}

            {/* INFO GRID */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-20 grid lg:grid-cols-[1fr_350px] gap-12 lg:gap-16">
                <div className="space-y-16 order-2 lg:order-1 min-w-0">
                    {/* Placeholder for comments or additional info */}
                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] text-center">
                        <Users size={32} className="mx-auto text-white/20 mb-4" />
                        <h3 className="text-xl font-display font-black text-white/50 uppercase tracking-tight">Комментарии</h3>
                        <p className="text-xs text-secondary mt-2">Раздел в разработке</p>
                    </div>
                </div>

                <aside className="order-1 lg:order-2 space-y-8">
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sticky top-24">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                            <Info size={16} className="text-accent" /> Информация
                        </h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Тип</span>
                                <span className="font-bold text-white">{project.type}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Год</span>
                                <span className="font-bold text-white">{project.year}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Статус</span>
                                <span className="font-bold text-white">{project.status}</span>
                            </div>
                        </div>

                        {project.genres && project.genres.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">Жанры</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.genres.map(g => (
                                        <Link key={g} href={`/catalog?genre=${g}`} className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-accent/20 hover:text-accent border border-white/5 text-[10px] font-black uppercase tracking-wider text-white/60 transition-colors">
                                            {g}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </main>
    );
}
