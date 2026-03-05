'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2, Heart, History as HistoryIcon, LogOut, ArrowRight, User as UserIcon } from 'lucide-react';
import { HubCard } from '@/components/anime/HubCard';

export default function ProfilePage() {
    const { user, logout, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites');
    const [isLoading, setIsLoading] = useState(true);
    const [items, setItems] = useState<any[]>([]);

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
                // Fetch user data IDs
                const endpoint = activeTab === 'favorites' ? '/api/favorites' : '/api/history';
                const userRes = await fetch(endpoint);
                if (!userRes.ok) throw new Error('Failed to fetch user data');
                const userData = await userRes.json();

                const list = activeTab === 'favorites' ? userData.favorites : userData.history;

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

                // Merge data (keep the order of favorites/history if needed, here we just use what /api/anime returns)
                setItems(animeData.data);
            } catch (error) {
                console.error(`Failed to fetch ${activeTab}:`, error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user, activeTab]);

    if (authLoading || (!user && isLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <Loader2 className="w-12 h-12 text-accent animate-spin" />
            </div>
        );
    }

    if (!user) return null; // Redirecting

    return (
        <div className="min-h-screen bg-bg-cream pt-24 pb-20">

            <div className="container mx-auto px-4 md:px-8 max-w-[1400px] relative z-10 space-y-12">

                {/* Profile Header */}
                <div className="bg-surface border-4 border-bg-dark p-8 md:p-12 shadow-[12px_12px_0_var(--color-bg-dark)] flex flex-col md:flex-row items-center gap-8 anim-reveal-up">
                    <div className="w-32 h-32 md:w-40 md:w-40 shrink-0 border-4 border-bg-dark bg-accent overflow-hidden shadow-[4px_4px_0_var(--color-bg-dark)]">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover grayscale mix-blend-multiply hover:grayscale-0 transition-all duration-500" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-editorial text-6xl text-cream">
                                {user.username[0].toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-editorial uppercase tracking-tight text-bg-dark leading-none">
                                {user.username}
                            </h1>
                            <p className="text-sm font-black uppercase tracking-widest text-accent mt-2">
                                LEVEL 1 • УЧЕНИК
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <span className="px-4 py-2 border-2 border-bg-dark text-[10px] font-black uppercase tracking-widest bg-white shadow-[2px_2px_0_var(--color-bg-dark)]">
                                {user.email}
                            </span>
                            <span className="px-4 py-2 border-2 border-bg-dark text-[10px] font-black uppercase tracking-widest bg-green-400 text-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)]">
                                В сети
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => { logout(); router.push('/'); }}
                        className="btn-haptic p-4 bg-red-500 text-white border-2 border-bg-dark shadow-[4px_4px_0_var(--color-bg-dark)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 outline-none transition-all"
                        title="Выйти"
                    >
                        <LogOut size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b-4 border-bg-dark pb-[-4px] anim-reveal-up" style={{ animationDelay: '100ms' }}>
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`flex items-center gap-3 px-8 py-4 font-black uppercase tracking-widest text-sm outline-none transition-all relative top-1
                            ${activeTab === 'favorites'
                                ? 'bg-bg-dark text-cream border-t-4 border-x-4 border-bg-dark'
                                : 'bg-surface text-bg-dark/40 border-t-4 border-x-4 border-transparent hover:text-bg-dark'}`}
                    >
                        <Heart size={18} className={activeTab === 'favorites' ? 'fill-current' : ''} />
                        Избранное
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex items-center gap-3 px-8 py-4 font-black uppercase tracking-widest text-sm outline-none transition-all relative top-1
                            ${activeTab === 'history'
                                ? 'bg-bg-dark text-cream border-t-4 border-x-4 border-bg-dark'
                                : 'bg-surface text-bg-dark/40 border-t-4 border-x-4 border-transparent hover:text-bg-dark'}`}
                    >
                        <HistoryIcon size={18} />
                        История
                    </button>
                </div>

                {/* Grid */}
                <div className="anim-reveal-up" style={{ animationDelay: '200ms' }}>
                    {isLoading ? (
                        <div className="py-24 flex items-center justify-center">
                            <Loader2 className="w-12 h-12 text-accent animate-spin" />
                        </div>
                    ) : items.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                            {items.map((project: any) => (
                                <HubCard key={project.id} project={project} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center space-y-6 border-4 border-dashed border-bg-dark/20 bg-white/50 shadow-[8px_8px_0_var(--color-bg-dark)]">
                            {activeTab === 'favorites' ? (
                                <Heart size={48} className="mx-auto text-bg-dark/20" strokeWidth={1} />
                            ) : (
                                <HistoryIcon size={48} className="mx-auto text-bg-dark/20" strokeWidth={1} />
                            )}
                            <div className="space-y-2">
                                <p className="text-xl font-editorial uppercase tracking-[0.2em] text-bg-dark">Здесь пока пусто</p>
                                <p className="text-sm font-bold uppercase tracking-widest text-bg-dark/40">
                                    {activeTab === 'favorites'
                                        ? 'Добавляйте тайтлы в избранное, чтобы ничего не потерять'
                                        : 'Вы еще не начинали просмотр ни одного аниме'}
                                </p>
                            </div>
                            <button onClick={() => router.push('/catalog')} className="btn-haptic inline-flex items-center gap-3 px-8 py-4 bg-accent text-cream font-black uppercase tracking-widest text-sm border-2 border-bg-dark shadow-[4px_4px_0_var(--color-bg-dark)] outline-none hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all mt-4">
                                Перейди в каталог <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
