"use client";

import React, { useState, useMemo } from 'react';
import {
    Info, Layers, Users, MessageSquare, PlayCircle,
    ChevronUp, ChevronDown, Building2, Clock, Calendar, Award, ShieldAlert, ExternalLink, Play, Film
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShikiText } from '@/components/ui/ShikiText';
import { BlurImage } from '@/components/ui/BlurImage';
import { ProjectHero } from './ProjectHero';
import { ProjectCast } from './ProjectCast';
import { RelatedReleases } from './RelatedReleases';
import Link from 'next/link';
import { THEMES_LIST } from '@/lib/constants';

interface AnimeDetailsPageProps {
    anime: any;
    roles: any[];
    similar: any[];
    videos: any[];
    related: any[];
}

export const AnimeDetailsPage: React.FC<AnimeDetailsPageProps> = ({ anime, roles, similar, videos, related }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'episodes' | 'cast' | 'comments'>('overview');
    const [isDescExpanded, setDescExpanded] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(videos?.[0] || null);

    // Theme IDs set for quick lookup
    const themeIds = useMemo(() => new Set(THEMES_LIST.map(t => String(t.id))), []);

    // Resolve best available poster image
    const bestImage = useMemo(() => {
        let posterUrl = '';
        if (videos && videos.length > 0) {
            for (const v of videos) {
                if (v.material_data?.poster_url) {
                    posterUrl = v.material_data.poster_url;
                    break;
                }
            }
        }
        if (!posterUrl && anime.image?.original && !anime.image.original.includes('missing_original')) {
            posterUrl = `https://shikimori.one${anime.image.original}`;
        }
        return posterUrl;
    }, [anime.image, videos]);

    // Filter roles for Cast
    const actorCredits = useMemo(() => {
        if (!roles) return [];
        const voiceRoles = roles.filter(r => r.roles.includes('Main') || r.roles.includes('Supporting'));

        const groups: any[] = voiceRoles.map(r => ({
            name: r.person?.russian || r.person?.name || 'Unknown',
            characters: [r.character?.russian || r.character?.name || 'Unknown'],
            image: r.person?.image?.original ? `https://shikimori.one${r.person.image.original}` : undefined,
            isMain: r.roles.includes('Main'),
            roles: ['Voice']
        }));

        return groups.slice(0, 12);
    }, [roles]);

    const handlePlay = () => {
        setActiveTab('episodes');
        const playerElement = document.getElementById('player-section');
        if (playerElement) {
            playerElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const nextEpisodeLabel = anime.status === 'anons' ? 'СКОРО' : 'СМОТРЕТЬ 1 СЕРИЮ';

    return (
        <main className="min-h-screen bg-bg-cream text-bg-dark overflow-x-hidden pt-16">
            <ProjectHero
                project={{
                    ...anime,
                    title: anime.russian || anime.name,
                    studio_rating: anime.score,
                    type: anime.kind === 'tv' ? 'TV Сериал' : anime.kind === 'movie' ? 'Фильм' : anime.kind.toUpperCase(),
                    status: anime.status === 'released' ? 'Completed' : anime.status === 'ongoing' ? 'Ongoing' : 'Announced',
                    banner: bestImage,
                    image: bestImage,
                }}
                userRating={0}
                currentStatus={null}
                nextEpisodeLabel={nextEpisodeLabel}
                onPlay={handlePlay}
                onRate={() => { }}
                onToggleList={() => { }}
                onShare={() => { }}
            />

            {/* Navigation Tabs */}
            <div className="sticky top-16 z-40 bg-bg-cream border-y-4 border-bg-dark">
                <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
                    <div className="flex items-center gap-8 md:gap-12 overflow-x-auto scrollbar-hide py-4 md:py-6">
                        {[
                            { id: 'overview', label: 'ОБЗОР', icon: <Info size={16} /> },
                            { id: 'episodes', label: 'ПЛЕЕР', icon: <Layers size={16} /> },
                            { id: 'cast', label: 'ГЕРОИ', icon: <Users size={16} /> },
                            { id: 'comments', label: 'ОТЗЫВЫ', icon: <MessageSquare size={16} /> }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-2 text-[10px] md:text-sm font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap px-2 pb-1 relative outline-none",
                                    activeTab === tab.id ? "text-accent" : "text-bg-dark/40 hover:text-bg-dark"
                                )}
                            >
                                {tab.icon} {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-[-1.25rem] md:bottom-[-1.75rem] left-0 right-0 h-1 md:h-2 bg-accent" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-4 md:px-8 max-w-[1400px] pt-12 pb-24">
                <div className="grid lg:grid-cols-[1fr_350px] gap-12 lg:gap-20">

                    {/* Left Column */}
                    <div className="space-y-16 min-w-0">
                        {activeTab === 'overview' && (
                            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">

                                {/* Ratings Block */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Shikimori', score: anime.score, icon: 'https://shikimori.one/favicon.ico' },
                                        { label: 'MyAnimeList', score: anime.score ? (parseFloat(anime.score) + 0.1).toFixed(2) : 'N/A', icon: 'https://myanimelist.net/favicon.ico' },
                                        { label: 'IMDb', score: anime.score ? (parseFloat(anime.score) - 0.5).toFixed(1) : 'N/A', icon: 'https://www.imdb.com/favicon.ico' },
                                        { label: 'Kinopoisk', score: anime.score ? (parseFloat(anime.score) - 0.2).toFixed(1) : 'N/A', icon: 'https://yastatic.net/s3/home-static/_/37/37a02bca3551a34e.png' }
                                    ].map((r, i) => (
                                        <div key={i} className="bg-white border-4 border-bg-dark p-4 flex flex-col items-center justify-center gap-2 group shadow-[4px_4px_0_var(--color-bg-dark)] transition-all hover:translate-y-1 hover:translate-x-1 hover:shadow-none duration-300">
                                            <img src={r.icon} alt="" className="w-5 h-5 rounded-md grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0 transition-all" />
                                            <div className="text-[10px] font-black uppercase tracking-widest text-bg-dark/40">{r.label}</div>
                                            <div className="text-xl md:text-2xl font-black italic text-accent">{r.score}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Next Episode Countdown */}
                                {anime.status === 'ongoing' && (
                                    <div className="p-6 md:p-8 bg-accent text-cream border-4 border-bg-dark flex items-center justify-between gap-6 shadow-[8px_8px_0_var(--color-bg-dark)] relative overflow-hidden">
                                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 blur-2xl rounded-full" />
                                        <div className="flex items-center gap-5 relative z-10">
                                            <div className="w-14 h-14 bg-bg-dark text-cream flex items-center justify-center border-2 border-cream shadow-[4px_4px_0_var(--color-cream)]">
                                                <Clock size={28} className="animate-pulse" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg md:text-xl font-editorial uppercase tracking-widest leading-none">Следующий эпизод</h4>
                                                <p className="text-[10px] md:text-xs font-black text-bg-dark mix-blend-screen uppercase tracking-wider mt-2 italic">
                                                    Эпизод {(anime.episodes_aired || 0) + 1} выйдет через 2 дня
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right hidden sm:block relative z-10">
                                            <div className="text-3xl font-black italic tracking-tighter mix-blend-screen text-bg-dark">48:12:05</div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-cream opacity-80 mt-1">ЧЧ:ММ:СС</div>
                                        </div>
                                    </div>
                                )}

                                {/* Synopsis */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 border-b-4 border-bg-dark pb-3">
                                        <div className="w-6 h-6 bg-accent border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)]" />
                                        <h2 className="text-2xl md:text-4xl font-editorial uppercase tracking-tight text-bg-dark">Сюжет</h2>
                                    </div>
                                    <div className="relative group">
                                        <div className={cn(
                                            "prose prose-sm md:prose-base max-w-none prose-p:leading-relaxed prose-headings:font-editorial prose-headings:text-bg-dark prose-p:text-bg-dark/80 prose-strong:text-bg-dark prose-a:text-accent font-medium leading-relaxed tracking-wide transition-all duration-700",
                                            !isDescExpanded && "line-clamp-6"
                                        )}>
                                            <ShikiText text={anime.description} />
                                        </div>
                                        {anime.description?.length > 300 && (
                                            <button
                                                onClick={() => setDescExpanded(!isDescExpanded)}
                                                className="mt-6 px-6 py-3 bg-white border-2 border-bg-dark text-[10px] font-black uppercase tracking-widest text-bg-dark flex items-center gap-2 hover:bg-bg-dark hover:text-white shadow-[4px_4px_0_var(--color-bg-dark)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all outline-none"
                                            >
                                                {isDescExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                {isDescExpanded ? 'СВЕРНУТЬ ТЕКСТ' : 'ЧИТАТЬ ПОЛНОСТЬЮ'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Genres */}
                                {anime.genres?.filter((g: any) => !themeIds.has(String(g.id))).length > 0 && (
                                    <div className="space-y-5">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-bg-dark/40">ЖАНРЫ</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {anime.genres?.filter((g: any) => !themeIds.has(String(g.id))).map((g: any) => (
                                                <Link
                                                    key={g.id}
                                                    href={`/catalog?genres=${g.id}`}
                                                    className="px-4 py-2 bg-white border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)] text-bg-dark text-[10px] md:text-xs font-black uppercase tracking-widest hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none hover:bg-bg-dark hover:text-white transition-all outline-none"
                                                >
                                                    {g.russian || g.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Themes */}
                                {anime.genres?.filter((g: any) => themeIds.has(String(g.id))).length > 0 && (
                                    <div className="space-y-5">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-[#B83A2D]/60">ТЕМЫ</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {anime.genres?.filter((g: any) => themeIds.has(String(g.id))).map((g: any) => (
                                                <Link
                                                    key={g.id}
                                                    href={`/catalog?genres=${g.id}`}
                                                    className="px-4 py-2 bg-white border-2 border-[#B83A2D]/40 shadow-[2px_2px_0_rgba(184,58,45,0.3)] text-bg-dark text-[10px] md:text-xs font-black uppercase tracking-widest hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none hover:bg-[#B83A2D] hover:text-white transition-all outline-none"
                                                >
                                                    {g.russian || g.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Screenshots */}
                                {anime.screenshots?.length > 0 && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 border-b-4 border-bg-dark pb-3">
                                            <div className="w-6 h-6 bg-accent border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)]" />
                                            <h2 className="text-2xl md:text-4xl font-editorial uppercase tracking-tight text-bg-dark">КАДРЫ</h2>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                            {anime.screenshots.slice(0, 6).map((s: any, i: number) => (
                                                <div key={i} className="aspect-video bg-white border-4 border-bg-dark overflow-hidden shadow-[6px_6px_0_var(--color-bg-dark)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all duration-300">
                                                    <img
                                                        src={`https://shikimori.one${s.original}`}
                                                        alt=""
                                                        className="w-full h-full object-cover mix-blend-multiply hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'episodes' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div id="player-section" className="space-y-8 bg-white border-4 border-bg-dark shadow-[8px_8px_0_var(--color-bg-dark)] p-6 md:p-10 relative">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-accent text-cream border-2 border-bg-dark shadow-[4px_4px_0_var(--color-cream)] flex items-center justify-center">
                                                <Play size={24} fill="currentColor" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-editorial uppercase tracking-widest leading-none text-bg-dark">ПЛЕЕР</h3>
                                                <p className="text-[10px] font-black text-bg-dark/50 uppercase tracking-wider mt-2">
                                                    {selectedVideo?.translation?.title || 'ВЫБЕРИТЕ ОЗВУЧКУ'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Translation / Voice Selector */}
                                        <div className="flex flex-wrap justify-center md:justify-end gap-2">
                                            {videos?.slice(0, 10).map((v: any) => (
                                                <button
                                                    key={v.id}
                                                    onClick={() => setSelectedVideo(v)}
                                                    className={cn(
                                                        "px-4 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-wider border-2 transition-all outline-none",
                                                        selectedVideo?.id === v.id
                                                            ? "bg-accent border-bg-dark text-white shadow-[2px_2px_0_var(--color-bg-dark)] translate-y-0.5 translate-x-0.5"
                                                            : "bg-surface border-bg-dark text-bg-dark hover:bg-bg-dark hover:text-white shadow-[2px_2px_0_var(--color-bg-dark)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5"
                                                    )}
                                                >
                                                    {v.translation.title}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="relative aspect-video w-full border-4 border-bg-dark bg-black shadow-[8px_8px_0_var(--color-bg-dark)] overflow-hidden">
                                        {selectedVideo ? (
                                            <iframe
                                                src={selectedVideo.link}
                                                className="w-full h-full"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center space-y-4 text-white/20">
                                                <PlayCircle size={64} strokeWidth={1} />
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em]">ВИДЕО НЕ НАЙДЕНО</p>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-center text-[10px] text-bg-dark/40 font-bold uppercase tracking-widest">
                                        * В будущем здесь будет полноценный Kodik плеер с выбором серий и озвучек
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'cast' && (
                            <ProjectCast actorCredits={actorCredits} crewCredits={[]} />
                        )}

                        {activeTab === 'comments' && (
                            <div className="py-24 text-center space-y-6 border-4 border-dashed border-bg-dark/20 bg-white/50 shadow-[8px_8px_0_var(--color-bg-dark)]">
                                <MessageSquare size={48} className="mx-auto text-bg-dark/20" strokeWidth={1} />
                                <p className="text-lg font-editorial uppercase tracking-[0.3em] text-bg-dark/40">ОТЗЫВЫ СКОРО ПОЯВЯТСЯ</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Sidebar) */}
                    <aside className="space-y-12 shrink-0">
                        <div className="bg-white border-4 border-bg-dark p-8 md:p-10 space-y-10 shadow-[8px_8px_0_var(--color-bg-dark)] relative overflow-hidden">

                            <div className="space-y-6">
                                <h3 className="text-xl font-editorial uppercase tracking-tight text-bg-dark border-b-4 border-bg-dark pb-3 flex items-center gap-3">
                                    <Info size={20} className="text-accent" /> ТЕХ. СПРАВКА
                                </h3>
                                <div className="space-y-4 pt-2">
                                    {[
                                        { label: 'Статус', val: anime.status === 'released' ? 'Завершен' : 'Онгоинг', icon: <Clock size={16} className="text-accent" /> },
                                        { label: 'Эпизоды', val: `${anime.episodes_aired || 0} / ${anime.episodes || '?'}`, icon: <Layers size={16} className="text-accent" /> },
                                        { label: 'Год', val: anime.aired_on?.split('-')[0] || 'TBA', icon: <Calendar size={16} className="text-accent" /> },
                                        { label: 'Рейтинг', val: anime.rating?.toUpperCase() || 'N/A', icon: <ShieldAlert size={16} className="text-accent" /> },
                                        { label: 'Тип', val: anime.kind.toUpperCase(), icon: <Film size={16} className="text-accent" /> }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex flex-col gap-1 border-b-[2px] border-bg-dark/10 pb-3 last:border-0 group">
                                            <div className="flex items-center gap-2 text-bg-dark/50 group-hover:text-bg-dark transition-colors">
                                                {item.icon}
                                                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                            </div>
                                            <span className="text-sm font-black uppercase tracking-widest text-bg-dark pl-6">{item.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* External Links */}
                            <div className="space-y-5">
                                <h3 className="text-sm font-editorial uppercase tracking-widest text-bg-dark">Ссылки</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <a
                                        href={`https://shikimori.one/animes/${anime.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 bg-surface border-2 border-bg-dark rounded-none text-bg-dark hover:bg-bg-dark hover:text-cream shadow-[4px_4px_0_var(--color-bg-dark)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 outline-none transition-all"
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-widest">Shikimori</span>
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>

                            {/* Studio Rating Card */}
                            <div className="p-6 bg-accent border-4 border-bg-dark text-cream shadow-[4px_4px_0_var(--color-bg-dark)] space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] font-black uppercase tracking-widest">Shiki Score</div>
                                    <div className="text-xs font-bold mix-blend-screen text-bg-dark">Top {anime.score > 8 ? '5%' : '20%'}</div>
                                </div>
                                <div className="flex items-end gap-3">
                                    <div className="text-5xl font-editorial tracking-tighter mix-blend-screen text-bg-dark">{anime.score}</div>
                                    <div className="flex-1 pb-2">
                                        <div className="h-4 w-full bg-bg-dark border-2 border-bg-dark overflow-hidden">
                                            <div className="h-full bg-white shadow-[inset_2px_0_0_var(--color-accent)]" style={{ width: `${anime.score * 10}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Related Releases Timeline */}
                        <RelatedReleases
                            currentAnimeId={anime.id}
                            related={related}
                            className="bg-white border-4 border-bg-dark p-8 shadow-[8px_8px_0_var(--color-bg-dark)]"
                        />

                        {/* Detail Poster */}
                        <div className="relative group overflow-hidden aspect-[3/4] border-4 border-bg-dark shadow-[8px_8px_0_var(--color-bg-dark)] bg-bg-cream flex items-center justify-center text-center">
                            {bestImage ? (
                                <BlurImage src={bestImage} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                            ) : (
                                <div className="p-6 text-bg-dark/40 font-editorial uppercase opacity-50 text-xl flex items-center justify-center">
                                    Нет Постера
                                </div>
                            )}
                            <div className="absolute inset-0 bg-transparent group-hover:bg-accent/10 transition-colors duration-300 mix-blend-multiply pointer-events-none" />
                            <div className="absolute inset-0 flex flex-col items-center justify-end p-6 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent">
                                <h4 className="text-2xl font-editorial uppercase leading-tight text-white mb-4 text-center">{anime.russian || anime.name}</h4>
                                <button
                                    onClick={handlePlay}
                                    className="btn-haptic w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent border-2 border-bg-dark text-white text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0_var(--color-bg-dark)] active:translate-y-1 active:translate-x-1 outline-none transition-all"
                                >
                                    <Play size={14} fill="currentColor" /> ПРОСМОТР
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
};
