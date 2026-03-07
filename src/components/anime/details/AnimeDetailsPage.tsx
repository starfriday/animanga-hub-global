"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
    Layers, PlayCircle,
    ChevronUp, ChevronDown, Building2, Clock, Calendar, ShieldAlert, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ensureFullUrl } from '@/lib/imageUtils';
import { ShikiText } from '@/components/ui/ShikiText';
import { ProjectHero } from './ProjectHero';
import { ProjectCast } from './ProjectCast';
import { RelatedReleases, type RelatedRelease } from './RelatedReleases';
import { CommentsSection } from './CommentsSection';
import Link from 'next/link';

interface VideoData {
    id?: string | number;
    url: string;
    playerUrl?: string;
    name?: string;
    kind?: string;
    imageUrl?: string;
    link?: string;
    translation?: {
        title: string;
        id?: number;
    };
    material_data?: {
        poster_url?: string;
        description?: string;
        anime_title?: string;
        duration?: number;
    };
}

interface AnimeData {
    id: string | number;
    name: string;
    russian?: string;
    score?: number;
    status?: string;
    kind?: string;
    episodes?: number;
    episodes_aired?: number;
    episodesAired?: number;
    aired_on?: string;
    released_on?: string;
    rating?: string;
    posterUrl?: string;
    image?: {
        original?: string;
        preview?: string;
    };
    description?: string;
    descriptionHtml?: string;
    genres?: Array<{ id: string | number; name: string; russian: string }>;
    studios?: Array<{ id: string | number; name: string }>;
    screenshots?: Array<{ original: string; preview: string }>;
}

interface Role {
    character?: {
        id: string | number;
        name: string;
        russian?: string;
        poster?: { originalUrl: string; mainUrl?: string };
    };
    person?: {
        id: string | number;
        name: string;
        russian?: string;
        poster?: { originalUrl: string; mainUrl?: string };
    };
    rolesEn?: string[];
    rolesRu?: string[];
}

interface AnimeDetailsPageProps {
    anime: AnimeData;
    roles: { characterRoles: Role[], personRoles: Role[] };
    similar: AnimeData[];
    videos: VideoData[];
    related: RelatedRelease[];
}

export const AnimeDetailsPage: React.FC<AnimeDetailsPageProps> = ({ anime, roles, videos, related }) => {
    const [isDescExpanded, setDescExpanded] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(videos?.[0] || null);
    const [viewLogged, setViewLogged] = useState(false);
    const [sessionToken, setSessionToken] = useState<string>('');

    useEffect(() => {
        setSessionToken(Math.floor(Math.random() * 0xFFFFFF).toString(16));
    }, []);

    // Resolve best available poster image
    const bestImage = useMemo(() => {
        if (anime.posterUrl) return anime.posterUrl;

        if (videos && videos.length > 0) {
            for (const v of videos) {
                if (v.material_data?.poster_url) {
                    return v.material_data.poster_url;
                }
            }
        }

        if (anime.image?.original && !anime.image.original.includes('missing_original')) {
            return ensureFullUrl(anime.image.original);
        }

        return '';
    }, [anime.posterUrl, anime.image, videos]);

    // Filter roles for Cast
    const actorCredits = useMemo(() => {
        if (!roles || !roles.characterRoles) return [];

        const charRoles = roles.characterRoles.filter((r: Role) => r.rolesEn?.includes('Main') || r.rolesEn?.includes('Supporting'));

        const groups = charRoles.map((r: Role) => ({
            name: r.character?.russian || r.character?.name || 'Unknown',
            characters: ['Персонаж'],
            image: r.character?.poster?.originalUrl ? ensureFullUrl(r.character.poster.originalUrl) : undefined,
            isMain: !!r.rolesEn?.includes('Main'),
            roles: r.rolesRu || r.rolesEn || ['Voice']
        }));

        return groups.slice(0, 12);
    }, [roles]);

    const crewCredits = useMemo(() => {
        if (!roles || !roles.personRoles) return [];
        const crewRoles = roles.personRoles.filter((r: Role) => !r.rolesEn?.includes('Main') && !r.rolesEn?.includes('Supporting') && r.person);

        const personMap = new Map();
        crewRoles.forEach((r: Role) => {
            if (!r.person) return;
            const personId = r.person.id;
            const existing = personMap.get(personId);
            const roleName = (r.rolesRu || r.rolesEn || []).join(', ') || 'Персонал';
            if (existing) {
                if (!existing.role.includes(roleName)) {
                    existing.role += `, ${roleName}`;
                }
            } else {
                personMap.set(personId, {
                    name: r.person.russian || r.person.name,
                    role: roleName,
                    customImage: r.person.poster?.originalUrl ? ensureFullUrl(r.person.poster.originalUrl) : undefined
                });
            }
        });
        return Array.from(personMap.values());
    }, [roles]);

    const handlePlay = () => {
        const playerElement = document.getElementById('player-section');
        if (playerElement) {
            playerElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        if (!viewLogged) {
            setViewLogged(true);
            fetch('/api/views', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ animeId: String(anime.id) })
            }).catch(console.error);

            fetch('/api/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    animeId: String(anime.id),
                    episode: 1
                })
            }).catch(console.error);
        }
    };

    const nextEpisodeLabel = anime.status === 'anons' ? 'СКОРО' : 'СМОТРЕТЬ 1 СЕРИЮ';

    return (
        <main className="min-h-screen bg-bg-cream text-bg-dark overflow-x-hidden pt-16 selection:bg-accent selection:text-white">
            {/* Header / SYS.INFO Bar */}
            <div className="border-b-[3px] border-bg-dark bg-white py-3 px-4 md:px-8 sticky top-16 z-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-accent animate-pulse" />
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40">System.Status: Active</span>
                    <div className="h-4 w-[1px] bg-bg-dark/10 hidden md:block" />
                    <nav className="hidden md:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-bg-dark/60">
                        <Link href="/" className="hover:text-accent transition-colors">ROOT</Link>
                        <span>/</span>
                        <Link href="/catalog" className="hover:text-accent transition-colors">INDEX</Link>
                        <span>/</span>
                        <span className="text-bg-dark italic">{anime.russian || anime.name}</span>
                    </nav>
                </div>
                <div className="text-[10px] font-mono opacity-20 hidden lg:block">
                    UUID: {anime.id}-{sessionToken || '------'}
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 max-w-[1600px] py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                    {/* LEFT COLUMN (8 Cols) - Primary Assets */}
                    <div className="lg:col-span-8 space-y-16">
                        {/* HERO BLOCK */}
                        <ProjectHero
                            project={{
                                ...anime,
                                title: anime.russian || anime.name,
                                studio_rating: anime.score,
                                type: anime.kind === 'tv' ? 'TV Сериал' : anime.kind === 'movie' ? 'Фильм' : (anime.kind?.toUpperCase() || 'UNKNOWN'),
                                status: anime.status === 'released' ? 'Completed' : anime.status === 'ongoing' ? 'Ongoing' : 'Announced',
                                banner: bestImage,
                                image: bestImage,
                            }}
                            nextEpisodeLabel={nextEpisodeLabel}
                            onPlay={handlePlay}
                            onShare={() => { }}
                        />

                        {/* SYNOPSIS BLOCK */}
                        <section className="relative group">
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-accent/20 group-hover:bg-accent transition-colors" />
                            <div className="space-y-6 pl-4 md:pl-8">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-3xl md:text-5xl font-editorial uppercase tracking-tight text-bg-dark italic flex items-baseline gap-4">
                                        <span className="text-sm font-black not-italic opacity-20 font-mono">[ 01 ]</span>
                                        Сюжет
                                    </h2>
                                    <div className="flex-1 h-[2px] bg-bg-dark/5" />
                                </div>
                                <div className="max-w-4xl">
                                    <div className={cn(
                                        "prose prose-sm md:prose-base max-w-none prose-p:leading-relaxed prose-headings:font-editorial prose-headings:text-bg-dark prose-p:text-bg-dark/80 prose-strong:text-bg-dark prose-a:text-accent font-medium leading-relaxed tracking-wide transition-all duration-700",
                                        !isDescExpanded && "line-clamp-10"
                                    )}>
                                        <ShikiText text={anime.description || ""} />
                                    </div>
                                    {(anime.description?.length ?? 0) > 500 && (
                                        <button
                                            onClick={() => setDescExpanded(!isDescExpanded)}
                                            className="mt-8 group/btn flex items-center gap-4 outline-none"
                                        >
                                            <div className="w-12 h-12 rounded-full border-2 border-bg-dark flex items-center justify-center group-hover/btn:bg-bg-dark group-hover/btn:text-white transition-all">
                                                {isDescExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-bg-dark/40 group-hover/btn:text-bg-dark">
                                                {isDescExpanded ? 'Collapse.Dossier' : 'Expand.Dossier'}
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* SYS.REACTOR (Player) */}
                        <section id="player-section" className="space-y-8 animate-reveal-up">
                            <div className="flex items-center gap-4 pl-4 md:pl-8">
                                <h2 className="text-3xl md:text-5xl font-editorial uppercase tracking-tight text-bg-dark italic flex items-baseline gap-4">
                                    <span className="text-sm font-black not-italic opacity-20 font-mono">[ 02 ]</span>
                                    Реактор
                                </h2>
                                <div className="flex-1 h-[2px] bg-bg-dark/5" />
                            </div>

                            <div className="bg-white border-[3px] border-bg-dark shadow-[20px_20px_0_var(--color-bg-dark)] md:shadow-[32px_32px_0_var(--color-bg-dark)] p-4 md:p-8 relative overflow-hidden group">
                                {/* Industrial HUD elements */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-accent/20" />
                                <div className="absolute top-4 right-4 flex gap-2 opacity-20">
                                    <div className="w-2 h-2 bg-bg-dark" />
                                    <div className="w-2 h-2 bg-bg-dark" />
                                    <div className="w-2 h-2 bg-bg-dark" />
                                </div>

                                <div className="flex flex-col gap-6">
                                    {/* Translation Selection HUD */}
                                    <div className="flex flex-wrap gap-2 p-3 bg-bg-cream/50 border-2 border-bg-dark/10">
                                        <div className="w-full text-[9px] font-black uppercase tracking-widest text-bg-dark/30 mb-2 border-b border-bg-dark/5 pb-1">
                                            Payload.Source: Select Translation
                                        </div>
                                        {videos?.slice(0, 15).map((v: VideoData) => (
                                            <button
                                                key={v.id}
                                                onClick={() => setSelectedVideo(v)}
                                                className={cn(
                                                    "px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all relative overflow-hidden",
                                                    selectedVideo?.id === v.id
                                                        ? "bg-bg-dark text-white shadow-solid-sm"
                                                        : "bg-white border-2 border-bg-dark/10 text-bg-dark/40 hover:border-bg-dark hover:text-bg-dark hover:shadow-solid-sm"
                                                )}
                                            >
                                                {selectedVideo?.id === v.id && (
                                                    <div className="absolute inset-0 bg-accent/20 animate-scan pointer-events-none" />
                                                )}
                                                {v.translation?.title || "Unknown"}
                                            </button>
                                        ))}
                                    </div>

                                    {/* The Viewport */}
                                    <div className="relative aspect-video w-full border-[3px] border-bg-dark bg-black shadow-inner overflow-hidden group/viewport">
                                        {selectedVideo?.link ? (
                                            <iframe
                                                src={selectedVideo.link.startsWith('//') ? `https:${selectedVideo.link}` : selectedVideo.link}
                                                className="w-full h-full"
                                                allowFullScreen
                                                allow="autoplay; fullscreen; picture-in-picture"
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center space-y-6 text-white/10 group-hover/viewport:text-accent/20 transition-colors">
                                                <PlayCircle size={80} strokeWidth={0.5} className="animate-pulse" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.8em]">System.Awaiting.Input</p>
                                            </div>
                                        )}
                                        {/* Corner markings */}
                                        <div className="absolute top-4 left-4 w-4 h-[1px] bg-white/20" />
                                        <div className="absolute top-4 left-4 w-[1px] h-4 bg-white/20" />
                                        <div className="absolute bottom-4 right-4 w-4 h-[1px] bg-white/20" />
                                        <div className="absolute bottom-4 right-4 w-[1px] h-4 bg-white/20" />
                                    </div>

                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_var(--color-green)]" />
                                            <span className="text-bg-dark/40 italic">Stream.Online</span>
                                        </div>
                                        <div className="flex gap-4 text-bg-dark/30">
                                            <span>Resolution: 1080p</span>
                                            <span>Buffering: 0.02ms</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* PERSONNEL BLOCK */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-4 pl-4 md:pl-8">
                                <h2 className="text-3xl md:text-5xl font-editorial uppercase tracking-tight text-bg-dark italic flex items-baseline gap-4">
                                    <span className="text-sm font-black not-italic opacity-20 font-mono">[ 03 ]</span>
                                    Персонал
                                </h2>
                                <div className="flex-1 h-[2px] bg-bg-dark/5" />
                            </div>
                            <div className="pl-4 md:pl-8">
                                <ProjectCast
                                    actorCredits={actorCredits}
                                    creators={crewCredits.slice(0, 4)}
                                    crewCredits={crewCredits.slice(4, 24)}
                                />
                            </div>
                        </section>

                        {/* COMMENTS BLOCK */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-4 pl-4 md:pl-8">
                                <h2 className="text-3xl md:text-5xl font-editorial uppercase tracking-tight text-bg-dark italic flex items-baseline gap-4">
                                    <span className="text-sm font-black not-italic opacity-20 font-mono">[ 04 ]</span>
                                    Логи
                                </h2>
                                <div className="flex-1 h-[2px] bg-bg-dark/5" />
                            </div>
                            <div className="pl-4 md:pl-8">
                                <CommentsSection animeId={String(anime.id)} />
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN (4 Cols) - Technical Documentation */}
                    <aside className="lg:col-span-4 space-y-12">
                        {/* SYS.MONITOR Card */}
                        <div className="bg-bg-dark text-white p-8 md:p-10 border-[3px] border-bg-dark shadow-[12px_12px_0_var(--color-accent)] relative overflow-hidden flex flex-col gap-10">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-accent" />

                            {/* Score Monolith */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-accent">
                                    <span>Core.Score</span>
                                    <span>Rank: {(anime.score ?? 0) > 8 ? 'Alpha' : 'Beta'}</span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className="text-8xl font-editorial italic tracking-tighter leading-none">{anime.score || '?.?'}</span>
                                    <div className="flex-1 h-2 bg-white/20 mb-2 relative overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-accent transition-all duration-1000 ease-out"
                                            style={{ width: `${(anime.score || 0) * 10}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/30 animate-scan" />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Shikimori', score: anime.score },
                                        { label: 'MAL', score: anime.score ? (Number(anime.score) + 0.1).toFixed(2) : 'N/A' },
                                    ].map((r, i) => (
                                        <div key={i} className="border border-white/10 p-3 bg-white/5 group hover:bg-white/10 transition-colors">
                                            <div className="text-[8px] font-black uppercase tracking-widest opacity-40">{r.label}</div>
                                            <div className="text-lg font-black italic">{r.score}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Technical Specs Grid */}
                            <div className="space-y-8">
                                <h3 className="text-xl font-editorial uppercase tracking-tight flex items-center gap-3 italic">
                                    <div className="w-1.5 h-1.5 bg-accent" /> Tech.Report
                                </h3>
                                <div className="grid grid-cols-1 gap-6 pt-2">
                                    {[
                                        { label: 'Release.Status', val: anime.status === 'released' ? 'Terminated' : 'Active.Stream', icon: <Clock size={16} className="text-accent" /> },
                                        { label: 'Unit.Payload', val: `${anime.episodes_aired || 0} / ${anime.episodes || '?'} Units`, icon: <Layers size={16} className="text-accent" /> },
                                        { label: 'Temporal.Range', val: `${anime.aired_on?.split('-')[0] || '?'} - ${anime.released_on?.split('-')[0] || 'Present'}`, icon: <Calendar size={16} className="text-accent" /> },
                                        { label: 'Maturity.Protocol', val: anime.rating?.toUpperCase() || 'N/A', icon: <ShieldAlert size={16} className="text-accent" /> },
                                        { label: 'Production.Lab', val: anime.studios?.[0]?.name || 'Unknown', icon: <Building2 size={16} className="text-accent" /> }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex flex-col gap-1 border-b border-white/5 pb-4 group cursor-default">
                                            <div className="flex items-center gap-2 text-white/30 group-hover:text-accent transition-colors">
                                                {item.icon}
                                                <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                                            </div>
                                            <span className="text-sm font-black uppercase tracking-[0.1em] text-white pl-6">{item.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* External Dossier Links */}
                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <a
                                    href={`https://shikimori.one/animes/${anime.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 text-white hover:bg-accent hover:border-accent transition-all group"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">External.Database: Shikimori</span>
                                    <ExternalLink size={14} className="opacity-40 group-hover:opacity-100" />
                                </a>
                            </div>
                        </div>

                        {/* RELATED BLOCK */}
                        <div className="space-y-8 sticky top-32">
                            <div className="flex items-center gap-3 border-b-[3px] border-bg-dark pb-3">
                                <div className="w-5 h-5 bg-accent border-2 border-bg-dark" />
                                <h3 className="text-2xl font-editorial uppercase tracking-tight italic">Rel.Connections</h3>
                            </div>
                            <RelatedReleases
                                currentAnimeId={String(anime.id)}
                                related={related}
                                className="bg-transparent p-0 shadow-none border-0"
                            />
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
};
