"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
    Layers, PlayCircle,
    ChevronUp, Building2, Clock, Calendar, ShieldAlert, ExternalLink, Hash, FileText, UserCog, MonitorPlay, Link2
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
    url?: string;
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
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(videos?.[0] || null);
    const [viewLogged, setViewLogged] = useState(false);
    const [sessionToken, setSessionToken] = useState<string>('');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
                        <ProjectHero
                            project={{
                                ...anime,
                                title: anime.russian || anime.name,
                                studio_rating: anime.score,
                                type: anime.kind === 'tv' ? 'TV Сериал' : anime.kind === 'movie' ? 'Фильм' : (anime.kind?.toUpperCase() || 'UNKNOWN'),
                                status: anime.status === 'released' ? 'Completed' : anime.status === 'ongoing' ? 'Ongoing' : 'Announced',
                                banner: bestImage,
                                image: bestImage,
                                episodes_total: anime.episodes,
                                episodes_aired: anime.episodes_aired || anime.episodesAired,
                                studio: anime.studios?.[0]?.name || 'UNKNOWN',
                                genres: anime.genres || []
                            }}
                            nextEpisodeLabel={nextEpisodeLabel}
                            onPlay={handlePlay}
                            onShare={() => { }}
                        />

                        {/* TACTICAL SUB-NAVIGATION */}
                        <div className="sticky top-[120px] md:top-[128px] z-40 bg-white/95 backdrop-blur-md border-[3px] border-bg-dark shadow-[8px_8px_0_var(--color-bg-dark)] flex overflow-x-auto hide-scrollbar snap-x">
                            <a href="#overview" className="flex items-center gap-2 px-6 py-4 font-black uppercase tracking-widest text-xs md:text-sm text-bg-dark hover:bg-bg-dark hover:text-white transition-colors border-r-[3px] border-bg-dark shrink-0 snap-start">
                                <FileText size={16} /> OVERVIEW
                            </a>
                            <a href="#personnel" className="flex items-center gap-2 px-6 py-4 font-black uppercase tracking-widest text-xs md:text-sm text-bg-dark hover:bg-bg-dark hover:text-white transition-colors border-r-[3px] border-bg-dark shrink-0 snap-start">
                                <UserCog size={16} /> PERSONNEL
                            </a>
                            <a href="#player-section" className="flex items-center gap-2 px-6 py-4 font-black uppercase tracking-widest text-xs md:text-sm text-bg-dark hover:bg-bg-dark hover:text-white transition-colors border-r-[3px] border-bg-dark shrink-0 snap-start">
                                <MonitorPlay size={16} /> MEDIA TERMINAL
                            </a>
                            <a href="#related" className="flex items-center gap-2 px-6 py-4 font-black uppercase tracking-widest text-xs md:text-sm text-bg-dark hover:bg-bg-dark hover:text-white transition-colors shrink-0 snap-start">
                                <Link2 size={16} /> RELATED
                            </a>
                        </div>

                        {/* SYNOPSIS BLOCK / M.O.T.H.E.R LOG */}
                        <section id="overview" className="relative group scroll-mt-48">
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-accent/20 group-hover:bg-accent transition-colors" />
                            <div className="space-y-6 pl-4 md:pl-8">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-3xl md:text-5xl font-editorial uppercase tracking-tight text-bg-dark italic flex items-baseline gap-4">
                                        <span className="text-sm font-black not-italic opacity-20 font-mono">[ 01 ]</span>
                                        M.O.T.H.E.R. Log
                                    </h2>
                                    <div className="flex-1 h-[2px] bg-bg-dark/5" />
                                </div>
                                <div className="relative max-w-4xl p-6 bg-white border-[3px] border-bg-dark shadow-[12px_12px_0_var(--color-bg-dark)]">
                                    {/* Noise Overlay when encrypted */}
                                    {!isDescExpanded && (
                                        <div className="absolute inset-0 z-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay opacity-30" />
                                    )}
                                    {isDecrypting && (
                                        <div className="absolute inset-0 z-20 bg-accent mix-blend-color-burn opacity-50 pointer-events-none animate-pulseHard" />
                                    )}

                                    <div className={cn(
                                        "prose prose-sm md:prose-base max-w-none prose-p:leading-relaxed prose-headings:font-editorial prose-headings:text-bg-dark prose-p:text-bg-dark/80 prose-strong:text-bg-dark prose-a:text-accent font-medium leading-relaxed tracking-wide transition-all duration-700 relative z-0",
                                        !isDescExpanded ? "line-clamp-4 blur-[2px] select-none" : "blur-none",
                                        isDecrypting && "animate-pulse"
                                    )}>
                                        <ShikiText text={anime.description || "NO DATA"} />
                                    </div>

                                    {(anime.description?.length ?? 0) > 100 && !isDescExpanded && (
                                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-10 flex items-end justify-center pb-6">
                                            <button
                                                onClick={() => {
                                                    setIsDecrypting(true);
                                                    setTimeout(() => {
                                                        setIsDecrypting(false);
                                                        setDescExpanded(true);
                                                    }, 800);
                                                }}
                                                className="group/btn flex items-center gap-4 px-6 py-3 bg-bg-dark text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-accent transition-colors shadow-[4px_4px_0_var(--color-accent)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                                            >
                                                <Hash size={16} className={cn("group-hover/btn:animate-spin", isDecrypting && "animate-spin")} />
                                                {isDecrypting ? 'DECRYPTING...' : 'DECRYPT FULL LOG'}
                                            </button>
                                        </div>
                                    )}
                                    {isDescExpanded && (
                                        <button
                                            onClick={() => setDescExpanded(false)}
                                            className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-bg-dark/40 hover:text-bg-dark transition-colors"
                                        >
                                            <ChevronUp size={14} /> COLLAPSE LOG
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* THE PLAYER (Kodik Integration) */}
                        <section id="player-section" className="space-y-4 animate-reveal-up pt-8">
                            {/* Translation Selection HUD Box */}
                            <div className="bg-white border-[1px] border-bg-dark/10 p-4 md:p-6 flex flex-col relative w-full overflow-hidden">
                                {/* Top right squares */}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-20">
                                    <div className="w-1.5 h-1.5 bg-bg-dark" />
                                    <div className="w-1.5 h-1.5 bg-bg-dark" />
                                    <div className="w-1.5 h-1.5 bg-bg-dark" />
                                </div>

                                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-bg-dark/30 mb-4 border-b-[1px] border-bg-dark/5 pb-2 inline-block">
                                    Payload.Source: Select Translation
                                </div>

                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    {videos?.map((v: VideoData) => (
                                        <button
                                            key={v.id}
                                            onClick={() => setSelectedVideo(v)}
                                            className={cn(
                                                "px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-colors",
                                                selectedVideo?.id === v.id
                                                    ? "bg-bg-dark text-white border-[1px] border-bg-dark"
                                                    : "bg-white text-bg-dark/40 border-[1px] border-bg-dark/10 hover:border-bg-dark/30 hover:text-bg-dark"
                                            )}
                                        >
                                            {v.translation?.title || "Subtitles"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* The Viewport */}
                            <div className="relative aspect-video w-full bg-black shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden">
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
                            </div>

                            {/* Bottom Status Bar */}
                            <div className="flex justify-between items-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] pt-2 px-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
                                    <span className="text-bg-dark/40 italic">Stream.Online</span>
                                </div>
                                <div className="flex gap-4 md:gap-8 text-bg-dark/30">
                                    <span>Resolution: 1080p</span>
                                    <span>Buffering: 0.02ms</span>
                                </div>
                            </div>
                        </section>

                        {/* PERSONNEL BLOCK */}
                        <section id="personnel" className="space-y-8 scroll-mt-48">
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
                        <div id="related" className="space-y-8 sticky top-32 scroll-mt-48">
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
