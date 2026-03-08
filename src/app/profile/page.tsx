/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';
import {
    Loader2, Heart, History as HistoryIcon, LogOut, ArrowRight,
    User as UserIcon, List, Share2, Trash2
} from 'lucide-react';
import { HubCard } from '@/components/anime/HubCard';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function ProfilePage() {
    const { user, logout, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'WATCHING' | 'COMPLETED' | 'ON_HOLD' | 'DROPPED' | 'PLANNED' | 'favorites' | 'history' | 'collections'>('WATCHING');
    const [isLoading, setIsLoading] = useState(true);
    const [items, setItems] = useState<any[]>([]);
    const [collections, setCollections] = useState<any[]>([]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setIsLoading(true);
            setItems([]);

            try {
                if (activeTab === 'collections') {
                    const res = await fetch('/api/custom-lists');
                    if (res.ok) {
                        const data = await res.json();
                        setCollections(data.lists);
                    }
                    setIsLoading(false);
                    return;
                }

                // Fetch user data IDs
                let list: any[] = [];
                if (activeTab === 'history') {
                    const res = await fetch('/api/history');
                    if (res.ok) {
                        const data = await res.json();
                        list = data.history;
                    }
                } else {
                    const res = await fetch('/api/user-anime');
                    if (res.ok) {
                        const data = await res.json();
                        if (activeTab === 'favorites') {
                            list = data.animeList.filter((a: any) => a.isFavorite);
                        } else {
                            list = data.animeList.filter((a: any) => a.status === activeTab);
                        }
                    }
                }

                if (!list || list.length === 0) {
                    setIsLoading(false);
                    return;
                }

                // Get anime IDs
                const ids = list.map((item: any) => item.animeId).join(',');

                // Fetch anime details
                const animeRes = await fetch(`/api/anime?ids=${ids}&limit=50`);
                if (!animeRes.ok) throw new Error('Failed to fetch anime data');
                const animeData = await animeRes.json();

                // Merge data
                const mergedItems = animeData.data.map((animeItem: any) => {
                    if (activeTab === 'history') {
                        const historyRef = list.find((h: any) => Number(h.animeId) === Number(animeItem.id));
                        if (historyRef) {
                            return {
                                ...animeItem,
                                historyData: {
                                    episode: historyRef.episode,
                                    progress: historyRef.progress,
                                    completed: historyRef.completed
                                }
                            };
                        }
                    }
                    return animeItem;
                });

                setItems(mergedItems);
            } catch (error) {
                console.error(`Failed to fetch ${activeTab}:`, error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user, activeTab]);

    const handleDeleteCollection = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!confirm('Вы уверены, что хотите удалить эту коллекцию?')) return;

        try {
            const res = await fetch(`/api/custom-lists?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCollections(prev => prev.filter(c => c.id !== id));
            } else {
                alert('Ошибка при удалении коллекции');
            }
        } catch (error) {
            console.error('Delete collection error:', error);
        }
    };

    const handleToggleShareCollection = async (e: React.MouseEvent, id: number, currentPublic: boolean) => {
        e.stopPropagation();
        try {
            const res = await fetch('/api/custom-lists', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isPublic: !currentPublic })
            });
            if (res.ok) {
                const data = await res.json();
                setCollections(prev => prev.map(c => c.id === id ? data.list : c));
            } else {
                alert('Ошибка при изменении статуса коллекции');
            }
        } catch (error) {
            console.error('Toggle share error:', error);
        }
    };

    if (authLoading || (!user && isLoading)) {
        return (
            <div className="min-h-screen bg-bg-cream flex items-center justify-center pt-20">
                <Loader2 className="w-12 h-12 text-accent animate-spin" />
            </div>
        );
    }

    if (!user) return null; // Redirecting

    return (
        <div className="min-h-screen bg-bg-cream pt-24 pb-20 relative overflow-hidden">

            {/* Ambient Background Orbs */}
            <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none z-0" />
            <div className="absolute top-1/2 left-0 w-[50vw] h-[50vw] bg-accent/5 rounded-full blur-[100px] -translate-y-1/3 -translate-x-1/4 pointer-events-none z-0" />

            <div className="container mx-auto px-4 md:px-8 max-w-[1400px] relative z-10 space-y-10">

                {/* Profile Header (Glassmorphic) */}
                <div className="bg-white/60 backdrop-blur-xl border border-bg-dark/5 p-8 md:p-12 rounded-[2.5rem] shadow-sm hover:shadow-lg transition-shadow duration-500 flex flex-col md:flex-row items-center gap-8 anim-reveal-up relative overflow-hidden">

                    {/* Glowing highlight inside card */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />

                    {/* Avatar */}
                    <div className="w-32 h-32 md:w-36 md:h-36 shrink-0 rounded-full border-[6px] border-white shadow-lg bg-bg-cream relative overflow-hidden flex items-center justify-center">
                        {user.avatarUrl ? (
                            <Image
                                src={user.avatarUrl}
                                alt={user.username}
                                fill
                                className="object-cover hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-accent/10 text-accent text-5xl font-black">
                                {user.username[0].toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left space-y-3 z-10">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-bg-dark leading-none">
                                {user.username}
                            </h1>
                            <p className="text-xs font-bold uppercase tracking-widest text-accent mt-2 px-3 py-1 bg-accent/10 rounded-full inline-block">
                                Ранг • Ученик
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                            <span className="px-4 py-1.5 rounded-full border border-bg-dark/10 text-[11px] font-bold text-bg-dark/60 bg-white/80">
                                {user.email}
                            </span>
                            <span className="px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest bg-green-500/10 text-green-600 border border-green-500/20 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                В сети
                            </span>
                        </div>
                    </div>

                    {/* LogOut Button */}
                    <button
                        onClick={() => { logout(); router.push('/'); }}
                        className="p-4 rounded-full bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 z-10"
                        title="Выйти"
                    >
                        <LogOut size={22} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Segmented Tabs */}
                <div className="flex justify-center md:justify-start anim-reveal-up overflow-x-auto hide-scrollbar" style={{ animationDelay: '100ms' }}>
                    <div className="inline-flex bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-bg-dark/5 shadow-sm whitespace-nowrap">
                        {[
                            { id: 'WATCHING', label: 'СМОТРЮ' },
                            { id: 'COMPLETED', label: 'ЗАВЕРШЕНО' },
                            { id: 'PLANNED', label: 'В ПЛАНАХ' },
                            { id: 'ON_HOLD', label: 'ОТЛОЖЕНО' },
                            { id: 'DROPPED', label: 'БРОШЕНО' },
                            { id: 'favorites', label: 'ИЗБРАННОЕ' },
                            { id: 'history', label: 'ИСТОРИЯ' },
                            { id: 'collections', label: 'КОЛЛЕКЦИИ' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold tracking-widest text-[10px] md:text-xs transition-all duration-300 outline-none
                                    ${activeTab === tab.id
                                        ? 'bg-bg-dark text-white shadow-md'
                                        : 'text-bg-dark/50 hover:text-bg-dark hover:bg-white/80'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="anim-reveal-up" style={{ animationDelay: '200ms' }}>
                    {isLoading ? (
                        <div className="py-32 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 text-accent animate-spin" />
                            <p className="text-bg-dark/40 font-bold uppercase tracking-widest text-sm">Загрузка данных...</p>
                        </div>
                    ) : activeTab === 'collections' ? (
                        collections.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {collections.map((col) => (
                                    <div
                                        key={col.id}
                                        onClick={() => router.push(`/collections/${col.id}`)}
                                        className="bg-white border-2 border-bg-dark rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                                                <List size={24} />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => handleToggleShareCollection(e, col.id, col.isPublic)}
                                                    className={cn(
                                                        "p-2 rounded-xl transition-all",
                                                        col.isPublic ? "bg-accent/10 text-accent" : "hover:bg-bg-dark/5 text-bg-dark/40"
                                                    )}
                                                    title={col.isPublic ? "Публичная (нажмите, чтобы скрыть)" : "Приватная (нажмите, чтобы поделиться)"}
                                                >
                                                    <Share2 size={18} className={col.isPublic ? "fill-accent/20" : ""} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteCollection(e, col.id)}
                                                    className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
                                                    title="Удалить"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{col.name}</h3>
                                        <p className="text-sm font-bold text-bg-dark/40 mb-6 line-clamp-2">{col.description || 'Нет описания'}</p>
                                        <div className="flex items-center justify-between pt-6 border-t border-bg-dark/5">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-bg-dark/20">{col.entries?.length || 0} ТАЙТЛОВ</span>
                                            <button
                                                onClick={() => router.push(`/collections/${col.id}`)}
                                                className="text-accent font-black text-xs uppercase hover:underline"
                                            >
                                                Открыть
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-bg-dark/5">
                                <List size={48} className="mx-auto text-bg-dark/10 mb-6" />
                                <h2 className="text-2xl font-black text-bg-dark">У вас еще нет коллекций</h2>
                                <p className="text-sm font-medium text-bg-dark/40 mt-2">Вы можете создать коллекцию на странице любого аниме</p>
                            </div>
                        )
                    ) : items.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                            {items.map((project: any) => (
                                <HubCard key={project.id} project={project} />
                            ))}
                        </div>
                    ) : (
                        /* Empty State (Frosted Glass) */
                        <div className="py-24 max-w-2xl mx-auto text-center flex flex-col items-center gap-6 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-bg-dark/5 shadow-sm hover:shadow-md transition-shadow">

                            <div className="w-24 h-24 rounded-full bg-accent/5 flex items-center justify-center mb-2">
                                {activeTab === 'favorites' ? (
                                    <Heart size={40} className="text-accent/60" strokeWidth={1.5} />
                                ) : (
                                    <HistoryIcon size={40} className="text-bg-dark/40" strokeWidth={1.5} />
                                )}
                            </div>

                            <div className="space-y-3 px-8">
                                <h2 className="text-2xl font-black text-bg-dark">В этом разделе пока пусто</h2>
                                <p className="text-sm font-medium text-bg-dark/60 max-w-sm mx-auto">
                                    {activeTab === 'history'
                                        ? 'Вы еще не начинали просмотр ни одного аниме. Пора это исправить!'
                                        : 'Добавляйте тайтлы в этот список, чтобы лучше организовать свой просмотр.'}
                                </p>
                            </div>

                            <button
                                onClick={() => router.push('/catalog')}
                                className="mt-4 flex items-center gap-3 px-8 py-4 bg-bg-dark text-white rounded-full font-bold uppercase tracking-widest text-xs hover:-translate-y-1 hover:shadow-lg hover:shadow-bg-dark/20 transition-all duration-300"
                            >
                                Перейти в каталог <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
