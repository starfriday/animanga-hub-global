"use client";

import Link from 'next/link';

import React, { useEffect, useState } from 'react';
import {
    Plus, Share2, List, Trash2, Eye, Globe, Lock,
    MoreHorizontal, ChevronRight, Bookmark
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthContext';

interface Collection {
    id: number;
    name: string;
    description: string | null;
    isPublic: boolean;
    _count: { entries: number };
    updatedAt: string;
    user?: {
        username: string;
        avatarUrl: string | null;
    };
}

export default function CollectionsPage() {
    const { user } = useAuth();
    const [collections, setCollections] = useState<Collection[]>([]);
    const [publicCollections, setPublicCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'my' | 'explore'>('explore');

    useEffect(() => {
        fetchCollections();
    }, [user, activeTab]);

    const fetchCollections = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'explore') {
                const res = await fetch('/api/collections');
                if (res.ok) {
                    const data = await res.json();
                    setPublicCollections(data.collections);
                }
            } else if (user) {
                const res = await fetch('/api/custom-lists');
                if (res.ok) {
                    const data = await res.json();
                    setCollections(data.lists);
                }
            }
        } catch (error) {
            console.error('Failed to fetch collections:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-bg-cream text-bg-dark pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full border border-accent/20 text-xs font-black uppercase tracking-widest">
                            <Bookmark size={14} /> Коллекции
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            Кураторские <br /> <span className="text-accent underline decoration-bg-dark/10 decoration-8 underline-offset-8">Подборки</span>
                        </h1>
                        <p className="text-lg font-bold text-bg-dark/40 max-w-xl">
                            Создавайте свои списки, делитесь ими с друзьями и открывайте для себя лучшее аниме от сообщества.
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-4 p-2 bg-white/50 backdrop-blur-xl border-2 border-bg-dark/10 rounded-3xl w-fit">
                    <button
                        onClick={() => setActiveTab('explore')}
                        className={cn(
                            "px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-tight transition-all",
                            activeTab === 'explore' ? "bg-bg-dark text-white shadow-xl" : "text-bg-dark/30 hover:text-bg-dark"
                        )}
                    >
                        Обзор
                    </button>
                    {user && (
                        <button
                            onClick={() => setActiveTab('my')}
                            className={cn(
                                "px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-tight transition-all",
                                activeTab === 'my' ? "bg-bg-dark text-white shadow-xl" : "text-bg-dark/30 hover:text-bg-dark"
                            )}
                        >
                            Мои списки
                        </button>
                    )}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-64 bg-white/50 border-2 border-bg-dark/5 rounded-[2.5rem] animate-pulse" />
                        ))
                    ) : activeTab === 'explore' ? (
                        publicCollections.length === 0 ? (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-2xl font-black text-bg-dark/10 uppercase italic">Коллекций пока нет</p>
                            </div>
                        ) : publicCollections.map((col) => (
                            <CollectionCard key={col.id} collection={col} isPublicView />
                        ))
                    ) : (
                        collections.length === 0 ? (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-2xl font-black text-bg-dark/10 uppercase italic">Вы еще не создали ни одного списка</p>
                            </div>
                        ) : collections.map((col) => (
                            <CollectionCard key={col.id} collection={col} />
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}

function CollectionCard({ collection, isPublicView = false }: { collection: any, isPublicView?: boolean }) {
    return (
        <Link href={`/collection/${collection.id}`} className="group relative bg-white border-2 border-bg-dark rounded-[2.5rem] p-8 shadow-brutal-soft hover:shadow-brutal-soft-xl hover:-translate-y-2 hover:-translate-x-2 transition-all duration-300 overflow-hidden block">
            {/* Visual Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

            <div className="relative flex flex-col h-full justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {isPublicView ? (
                                <div className="w-10 h-10 rounded-full bg-bg-dark p-0.5 border-2 border-bg-cream shadow-sm overflow-hidden">
                                    {collection.user?.avatarUrl ? (
                                        <img src={collection.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-accent flex items-center justify-center text-white text-[10px] font-black uppercase">
                                            {collection.user?.username?.slice(0, 2)}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    collection.isPublic ? "bg-green-100 text-green-600" : "bg-bg-dark/5 text-bg-dark/40"
                                )}>
                                    {collection.isPublic ? <span className="flex items-center gap-1"><Globe size={10} /> Публичный</span> : <span className="flex items-center gap-1"><Lock size={10} /> Приватный</span>}
                                </div>
                            )}
                        </div>
                        <span className="text-xs font-black text-bg-dark/20 uppercase tracking-widest">
                            {collection._count?.entries || 0} Аниме
                        </span>
                    </div>

                    <div>
                        <h3 className="text-2xl font-black text-bg-dark uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-accent transition-colors">
                            {collection.name}
                        </h3>
                        <p className="text-sm font-bold text-bg-dark/40 mt-2 line-clamp-2">
                            {collection.description || 'Нет описания'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-bg-dark/5">
                    {isPublicView && (
                        <span className="text-xs font-bold text-bg-dark/40">
                            от @{collection.user?.username}
                        </span>
                    )}
                    <div className="ml-auto w-12 h-12 bg-bg-dark text-white rounded-2xl flex items-center justify-center group-hover:bg-accent transition-all">
                        <ChevronRight size={24} />
                    </div>
                </div>
            </div>
        </Link>
    );
}
