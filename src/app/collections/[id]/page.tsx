'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Share2, List, Calendar, Star, PlaySquare, Edit3, Trash2, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HubCard } from '@/components/anime/HubCard';
import { useAuth } from '@/components/auth/AuthContext';
import Image from 'next/image';

interface CollectionPageProps {
    params: Promise<{ id: string }>;
}

interface Collection {
    id: number;
    userId: number;
    name: string;
    description: string | null;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    entries?: any[];
}

export default function CollectionDetailPage({ params }: CollectionPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [collection, setCollection] = useState<Collection | null>(null);
    const [animeItems, setAnimeItems] = useState<any[]>([]);

    // Editing state
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const isOwner = user && collection && user.id === collection.userId;

    useEffect(() => {
        const fetchCollection = async () => {
            setIsLoading(true);
            try {
                // Fetch basic list data
                const res = await fetch(`/api/custom-lists`);
                if (!res.ok) throw new Error('Failed to fetch lists');
                const data = await res.json();
                const found = data.lists.find((l: any) => l.id === Number(id));

                if (!found) {
                    router.push('/profile');
                    return;
                }
                setCollection(found);
                setEditName(found.name);
                setEditDescription(found.description || '');

                if (found.entries && found.entries.length > 0) {
                    const ids = found.entries.map((e: any) => e.animeId).join(',');
                    const animeRes = await fetch(`/api/anime?ids=${ids}&limit=50`);
                    if (animeRes.ok) {
                        const animeData = await animeRes.json();
                        setAnimeItems(animeData.data);
                    }
                }
            } catch (error) {
                console.error('Fetch collection detail error:', error);
                router.push('/profile');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCollection();
    }, [id, router]);

    const handleSaveMetadata = async () => {
        if (!editName.trim()) return;
        setIsSaving(true);
        try {
            const res = await fetch('/api/custom-lists', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: Number(id),
                    name: editName,
                    description: editDescription
                })
            });
            if (res.ok) {
                const data = await res.json();
                setCollection(prev => prev ? {
                    ...prev,
                    name: data.list.name,
                    description: data.list.description
                } : null);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Failed to save collection metadata:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemoveItem = async (animeId: number) => {
        if (!confirm('Удалить этот тайтл из коллекции?')) return;

        try {
            const res = await fetch(`/api/custom-lists/entries?listId=${id}&animeId=${animeId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setAnimeItems(prev => prev.filter(item => item.id !== animeId));
            }
        } catch (error) {
            console.error('Failed to remove item from collection:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-cream flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-accent animate-spin" />
                <p className="font-editorial text-xl uppercase tracking-widest text-bg-dark/40 animate-pulse">Загрузка коллекции...</p>
            </div>
        );
    }

    if (!collection) return null;

    return (
        <div className="min-h-screen bg-bg-cream pt-24 pb-20 relative px-4 sm:px-8">
            {/* Background texture */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
                style={{ backgroundImage: 'var(--background-noise)', backgroundSize: '200px' }}
            />

            <div className="container mx-auto max-w-[1400px] relative z-10">
                {/* Back Link */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-bg-dark/40 hover:text-accent transition-colors font-bold uppercase tracking-widest text-[10px] mb-8 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Назад к профилю
                </button>

                {/* Header Section */}
                <div className="mb-16">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b-4 border-bg-dark pb-10">
                        <div className="space-y-6 flex-1 max-w-4xl">
                            <div className="flex items-center gap-3">
                                <span className="bg-accent text-cream px-3 py-1 font-black text-[10px] uppercase tracking-widest border-2 border-bg-dark shadow-brutal-dark-sm">КОЛЛЕКЦИЯ</span>
                                {collection.isPublic && (
                                    <span className="bg-green-500 text-white px-3 py-1 font-black text-[10px] uppercase tracking-widest border-2 border-bg-dark shadow-brutal-dark-sm">ПУБЛИЧНАЯ</span>
                                )}
                                {isOwner && !isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-1 px-3 rounded-full hover:bg-bg-dark/5 text-bg-dark/40 hover:text-bg-dark transition-all flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest"
                                    >
                                        <Edit3 size={12} /> Редактировать
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        placeholder="Название коллекции"
                                        className="w-full font-editorial text-4xl md:text-6xl uppercase tracking-tighter text-bg-dark bg-white/50 border-2 border-bg-dark p-4 rounded-xl outline-none focus:ring-2 ring-accent/20"
                                    />
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        placeholder="Описание коллекции..."
                                        rows={3}
                                        className="w-full font-serif text-lg text-bg-dark/60 bg-white/50 border-2 border-bg-dark p-4 rounded-xl outline-none focus:ring-2 ring-accent/20 resize-none ml-1"
                                    />
                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleSaveMetadata}
                                            disabled={isSaving || !editName.trim()}
                                            className="flex items-center gap-2 px-6 py-3 bg-bg-dark text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:shadow-brutal-dark-sm transition-all disabled:opacity-50"
                                        >
                                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Сохранить
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditName(collection.name);
                                                setEditDescription(collection.description || '');
                                            }}
                                            className="flex items-center gap-2 px-6 py-3 border-2 border-bg-dark text-bg-dark rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-bg-dark/5 transition-all"
                                        >
                                            <X size={16} /> Отмена
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h1 className="font-editorial text-6xl md:text-8xl leading-none uppercase tracking-tighter text-bg-dark">
                                        {collection.name}
                                    </h1>
                                    <p className="font-serif text-lg md:text-xl text-bg-dark/60 leading-relaxed border-l-4 border-accent pl-6">
                                        {collection.description || 'Для этой коллекции еще не добавлено описание.'}
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="flex flex-col items-end gap-4">
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-bg-dark/20 mb-1">Тайтлов в списке</p>
                                <p className="font-editorial text-5xl text-bg-dark">{animeItems.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Grid */}
                {animeItems.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
                        {animeItems.map((anime) => (
                            <div key={anime.id} className="relative group/item">
                                <HubCard project={anime} />
                                {isOwner && (
                                    <button
                                        onClick={() => handleRemoveItem(anime.id)}
                                        className="absolute -top-3 -right-3 z-50 p-2 bg-red-500 text-white rounded-full border-2 border-bg-dark shadow-sm opacity-0 group-hover/item:opacity-100 transition-opacity hover:scale-110 active:scale-95"
                                        title="Удалить из коллекции"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center bg-white/40 backdrop-blur-md rounded-[2.5rem] border-4 border-dashed border-bg-dark/10">
                        <PlaySquare size={64} className="mx-auto text-bg-dark/5 mb-6" />
                        <h2 className="font-editorial text-3xl uppercase text-bg-dark/40">Коллекция пуста</h2>
                        <button
                            onClick={() => router.push('/catalog')}
                            className="mt-8 px-10 py-4 bg-bg-dark text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:-translate-y-1 transition-all"
                        >
                            Найти аниме
                        </button>
                    </div>
                )}
            </div>

            {/* Decorative Side Text */}
            <div className="fixed -right-12 top-1/2 -translate-y-1/2 rotate-90 z-0 pointer-events-none select-none opacity-[0.02]">
                <span className="font-editorial text-[12rem] whitespace-nowrap uppercase leading-none">
                    {collection.name}
                </span>
            </div>
        </div>
    );
}
