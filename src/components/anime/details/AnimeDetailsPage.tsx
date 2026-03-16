"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
    PlayCircle,
    ChevronUp, Building2, Clock, Calendar, ShieldAlert, MonitorPlay, FileText, UserCog, Link2, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ensureFullUrl } from '@/lib/imageUtils';
import { ShikiText } from '@/components/ui/ShikiText';
import { ProjectHero } from './ProjectHero';
import { ProjectCast } from './ProjectCast';
import { RelatedReleases, type RelatedRelease } from './RelatedReleases';
import { CommentsSection } from './CommentsSection';
import { AddToListModal } from './AddToListModal';
import Image from 'next/image';

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
    const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
    const [viewLogged, setViewLogged] = useState(false);

    // Watch History State
    const [savedEpisode, setSavedEpisode] = useState<number | null>(null);
    const [savedProgress, setSavedProgress] = useState<number | null>(null);
    const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

    // We need a stable state for the VERY first episode to inject into the iframe URL so it doesn't reload later
    const [initialEpisode, setInitialEpisode] = useState<number | null>(null);

    const [isListModalOpen, setIsListModalOpen] = useState(false);

    // Initial load: Fetch History and Setup Default Video
    useEffect(() => {
        const fetchHistoryAndVideos = async () => {
            try {
                const res = await fetch('/api/history');
                if (!res.ok) throw new Error('Failed to fetch history');
                const data = await res.json();

                const currentAnimeHistory = data.history?.find((h: any) => h.animeId === Number(anime.id));
                let lastTranslationId: string | null = null;

                if (currentAnimeHistory) {
                    setSavedEpisode(currentAnimeHistory.episode);
                    setSavedProgress(currentAnimeHistory.progress);
                    setInitialEpisode(currentAnimeHistory.episode); // Only set once on mount

                    if (currentAnimeHistory.translationId) {
                        lastTranslationId = String(currentAnimeHistory.translationId);
                    }
                }

                // Now set the initial video based on history or default to the first one
                if (videos && videos.length > 0 && !selectedVideo) {
                    console.log("[DEBUG] Fetch History complete. lastTranslationId:", lastTranslationId);
                    if (lastTranslationId) {
                        const historyVideo = videos.find(v => String(v.translation?.id) === lastTranslationId);
                        console.log("[DEBUG] Found historyVideo for translation:", historyVideo?.translation?.title);
                        setSelectedVideo(historyVideo || videos[0]);
                    } else {
                        setSelectedVideo(videos[0]);
                    }
                }

            } catch (error) {
                console.error("Failed to load history:", error);
                if (videos && videos.length > 0 && !selectedVideo) {
                    setSelectedVideo(videos[0]);
                }
            } finally {
                setIsHistoryLoaded(true);
            }
        };

        fetchHistoryAndVideos();
        // We purposefully omit selectedVideo to avoid resetting it if the user clicks a different translation
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [anime.id, videos]);

    // Construct a stable iframe URL that only updates when translation (selectedVideo) changes
    // It utilizes the `initialEpisode` so it starts correctly, but ignore `savedEpisode` updates during playback
    const iframeSrc = useMemo(() => {
        if (!selectedVideo?.link) return '';
        let url = selectedVideo.link.startsWith('//') ? `https:${selectedVideo.link}` : selectedVideo.link;

        if (initialEpisode && initialEpisode > 1) {
            url += url.includes('?') ? `&episode=${initialEpisode}` : `?episode=${initialEpisode}`;
        }
        return url;
    }, [selectedVideo, initialEpisode]);



    // Listen to Kodik Player Messages for Progress Tracking
    useEffect(() => {
        if (!isHistoryLoaded) return;

        let saveTimeout: NodeJS.Timeout;

        const handleMessage = (event: MessageEvent) => {
            if (!event.data) return;

            let messageData = event.data;
            if (typeof event.data === 'string') {
                try {
                    messageData = JSON.parse(event.data);
                } catch (e) {
                    return; // Not a JSON string
                }
            }

            const key = messageData.key;
            const value = messageData.value;

            // Expected events: 'kodik_player_video_ended', 'kodik_player_time_update', 'kodik_player_current_episode'
            if (key === 'kodik_player_current_episode') {
                const ep = Number(value?.episode || value);
                setSavedEpisode(ep);

                // Let's immediately save when an episode changes to avoid timeout drops
                fetch('/api/history', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        animeId: String(anime.id),
                        episode: ep,
                        progress: 0,
                        completed: false,
                        translationId: selectedVideo?.translation?.id ? String(selectedVideo.translation.id) : undefined
                    })
                }).catch(err => console.error("Failed to save episode change", err));

            } else if (key === 'kodik_player_time_update' || key === 'kodik_player_video_ended') {

                // Kodik might not send standard values on video end, but time_update constantly sends value
                const currentProg = key === 'kodik_player_time_update' ? Math.floor(Number(value)) : (savedProgress || 0);
                const isCompleted = key === 'kodik_player_video_ended';

                // We rely on the React state for the latest episode since 'time_update' does not include it
                const currentEp = savedEpisode || 1;

                // Debounce the save to prevent spamming the API every second
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(async () => {
                    try {
                        await fetch('/api/history', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                animeId: String(anime.id),
                                episode: currentEp,
                                progress: currentProg,
                                completed: isCompleted,
                                translationId: selectedVideo?.translation?.id ? String(selectedVideo.translation.id) : undefined
                            })
                        });
                        setSavedProgress(currentProg);
                    } catch (err) {
                        console.error("Failed to save progress", err);
                    }
                }, 3000); // Save every 3 seconds of continuous playback
            }
        };

        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
            clearTimeout(saveTimeout);
        };
    }, [anime.id, isHistoryLoaded, savedEpisode, savedProgress, selectedVideo]);

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
            const yOffset = -100; // offset for sticky header
            const y = playerElement.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }

        if (!viewLogged) {
            setViewLogged(true);
            fetch('/api/views', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ animeId: String(anime.id) })
            }).catch(console.error);
        }
    };

    const nextEpisodeLabel = savedEpisode ? `ПРОДОЛЖИТЬ (ЭП. ${savedEpisode})` : (anime.status === 'anons' ? 'СКОРО' : 'СМОТРЕТЬ 1 СЕРИЮ');

    return (
        <main className="min-h-screen bg-bg-cream text-bg-dark overflow-x-hidden pt-16 selection:bg-accent selection:text-white">



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
                onAddToList={() => setIsListModalOpen(true)}
                onShare={() => {
                    const url = window.location.href;
                    const title = anime.russian || anime.name;
                    if (navigator.share) {
                        navigator.share({ title, url }).catch(() => {});
                    } else {
                        navigator.clipboard.writeText(url).then(() => {
                            const toast = document.createElement('div');
                            toast.textContent = 'Ссылка скопирована!';
                            toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-bg-dark text-white rounded-full font-bold text-sm shadow-xl z-[999] animate-in fade-in slide-in-from-bottom-4 duration-300';
                            document.body.appendChild(toast);
                            setTimeout(() => toast.remove(), 2000);
                        });
                    }
                }}
            />

            <AddToListModal
                isOpen={isListModalOpen}
                onClose={() => setIsListModalOpen(false)}
                animeId={String(anime.id)}
                animeName={anime.russian || anime.name}
            />

            {/* Content Navigation */}
            <div className="sticky top-[110px] md:top-[120px] z-40 bg-bg-cream/90 backdrop-blur-xl border-b border-bg-dark/10 shadow-sm">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex overflow-x-auto hide-scrollbar snap-x">
                    <a href="#overview" className="flex items-center gap-2 px-6 py-4 text-sm font-bold text-bg-dark/50 hover:text-bg-dark transition-colors border-b-2 border-transparent hover:border-bg-dark shrink-0 snap-start">
                        <FileText size={18} /> Обзор
                    </a>
                    <a href="#personnel" className="flex items-center gap-2 px-6 py-4 text-sm font-bold text-bg-dark/50 hover:text-bg-dark transition-colors border-b-2 border-transparent hover:border-bg-dark shrink-0 snap-start">
                        <UserCog size={18} /> В ролях
                    </a>
                    <a href="#player-section" className="flex items-center gap-2 px-6 py-4 text-sm font-bold text-bg-dark/50 hover:text-bg-dark transition-colors border-b-2 border-transparent hover:border-bg-dark shrink-0 snap-start">
                        <MonitorPlay size={18} /> Плеер
                    </a>
                    <a href="#related" className="flex items-center gap-2 px-6 py-4 text-sm font-bold text-bg-dark/50 hover:text-bg-dark transition-colors border-b-2 border-transparent hover:border-bg-dark shrink-0 snap-start">
                        <Link2 size={18} /> Связанное
                    </a>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 max-w-[1600px] py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                    {/* LEFT COLUMN (8 Cols) - Main Content */}
                    <div className="lg:col-span-8 space-y-20">

                        {/* SYNOPSIS BLOCK */}
                        <section id="overview" className="relative scroll-mt-48">
                            <h2 className="text-2xl md:text-3xl font-black mb-6 text-bg-dark">Об аниме</h2>
                            <div className="relative">
                                <div className={cn(
                                    "prose prose-sm md:prose-base max-w-none prose-p:leading-8 prose-p:text-bg-dark/70 prose-a:text-accent font-medium leading-relaxed transition-all duration-500",
                                    !isDescExpanded && "line-clamp-4"
                                )}>
                                    <ShikiText text={anime.description || "Описание отсутствует."} />
                                </div>

                                {(anime.description?.length ?? 0) > 300 && !isDescExpanded && (
                                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-cream via-bg-cream/80 to-transparent flex items-end justify-start pb-2">
                                        <button
                                            onClick={() => setDescExpanded(true)}
                                            className="font-bold text-accent hover:text-bg-dark transition-colors flex items-center gap-2"
                                        >
                                            Читать полностью <ChevronUp size={16} className="rotate-180" />
                                        </button>
                                    </div>
                                )}
                                {isDescExpanded && (
                                    <button
                                        onClick={() => setDescExpanded(false)}
                                        className="mt-6 font-bold text-bg-dark/50 hover:text-bg-dark transition-colors flex items-center gap-2"
                                    >
                                        Свернуть <ChevronUp size={16} />
                                    </button>
                                )}
                            </div>
                        </section>

                        {/* PLAYER SECTION */}
                        <section id="player-section" className="space-y-6 scroll-mt-48 pt-8">
                            <h2 className="text-2xl md:text-3xl font-black mb-6 text-bg-dark">Смотреть онлайн</h2>

                            {/* Translation Pills */}
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {videos?.map((v: VideoData) => (
                                    <button
                                        key={v.id}
                                        onClick={() => setSelectedVideo(v)}
                                        className={cn(
                                            "px-5 py-2.5 rounded-full text-sm font-bold transition-all border",
                                            selectedVideo?.id === v.id
                                                ? "bg-accent text-white shadow-lg shadow-accent/20 border-accent"
                                                : "bg-black/5 text-bg-dark/70 border-black/10 hover:bg-black/10 hover:text-bg-dark"
                                        )}
                                    >
                                        {v.translation?.title || "Субтитры"}
                                    </button>
                                ))}
                            </div>

                            {/* Viewport */}
                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-bg-dark/5 shadow-xl shadow-black/5 border border-bg-dark/10">
                                {selectedVideo?.link ? (
                                    <iframe
                                        src={iframeSrc}
                                        className="w-full h-full"
                                        allowFullScreen
                                        allow="autoplay; fullscreen; picture-in-picture"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center space-y-4 text-bg-dark/30">
                                        <PlayCircle size={64} strokeWidth={1} />
                                        <p className="text-sm font-bold">Выберите плеер для просмотра</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* PERSONNEL BLOCK */}
                        <section id="personnel" className="scroll-mt-48 pt-8">
                            <ProjectCast
                                actorCredits={actorCredits}
                                creators={crewCredits.slice(0, 4)}
                                crewCredits={crewCredits.slice(4, 24)}
                            />
                        </section>

                        {/* COMMENTS BLOCK */}
                        <section className="scroll-mt-48 pt-8">
                            <CommentsSection animeId={String(anime.id)} />
                        </section>
                    </div>

                    {/* RIGHT COLUMN (4 Cols) - Sidebar Info */}
                    <aside className="lg:col-span-4 space-y-8">

                        {/* Information Card */}
                        <div className="bg-white border border-bg-dark/10 shadow-sm rounded-3xl p-8 space-y-8 sticky top-32">

                            {/* Score Display */}
                            <div className="flex items-center gap-6 pb-6 border-b border-bg-dark/10">
                                <div className="text-6xl font-black text-accent">{anime.score || '?.?'}</div>
                                <div className="space-y-1">
                                    <p className="text-bg-dark/50 text-xs font-bold uppercase tracking-wider">Оценка Shikimori</p>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <div
                                                key={star}
                                                className={cn(
                                                    "w-3 h-3 rounded-full",
                                                    (anime.score || 0) >= star * 2 ? "bg-accent" : "bg-bg-dark/10"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Info List */}
                            <div className="space-y-6">
                                {[
                                    { label: 'Тип', val: anime.kind === 'tv' ? 'ТВ Сериал' : (anime.kind === 'movie' ? 'Фильм' : 'OVA / Special'), icon: <MonitorPlay size={18} className="text-accent" /> },
                                    { label: 'Эпизоды', val: `${anime.episodes_aired || 0} / ${anime.episodes || '?'}`, icon: <Clock size={18} className="text-accent" /> },
                                    { label: 'Год', val: anime.aired_on?.split('-')[0] || 'Анонс', icon: <Calendar size={18} className="text-accent" /> },
                                    { label: 'Возраст', val: anime.rating?.toUpperCase() || 'Нет данных', icon: <ShieldAlert size={18} className="text-accent" /> },
                                    { label: 'Студия', val: anime.studios?.[0]?.name || 'Неизвестно', icon: <Building2 size={18} className="text-accent" /> }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-bg-dark/50 mb-0.5">{item.label}</p>
                                            <p className="text-sm font-bold text-bg-dark">{item.val}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* External Links */}
                            <div className="pt-6 border-t border-bg-dark/10">
                                <a
                                    href={`https://shikimori.one/animes/${anime.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 rounded-xl bg-black/5 hover:bg-black/10 border border-black/5 text-bg-dark transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-500 overflow-hidden shrink-0">
                                            <Image src="https://shikimori.one/assets/logo-b25191de8dcfea53b7c8441cd508be6510dc411d3cbdb1c2b545d9e508c9f694.svg" alt="Shikimori" width={24} height={24} />
                                        </div>
                                        <span className="text-sm font-bold">Shikimori.one</span>
                                    </div>
                                    <ExternalLink size={16} className="text-bg-dark/30 group-hover:text-bg-dark" />
                                </a>
                            </div>
                        </div>

                        {/* Related Releases Block */}
                        <div id="related" className="scroll-mt-48">
                            <RelatedReleases
                                currentAnimeId={String(anime.id)}
                                related={related}
                            />
                        </div>

                    </aside>
                </div>
            </div>
        </main>
    );
};
