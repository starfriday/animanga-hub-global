"use client";

import React, { useState, useEffect } from 'react';
import {
    X, Heart, BookOpen, CheckCircle, Clock, Trash2, Plus,
    ListPlus, Bookmark, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

interface CustomList {
    id: number;
    name: string;
    description: string;
    isPublic: boolean;
    entries: { animeId: number }[];
}

interface AddToListModalProps {
    isOpen: boolean;
    onClose: () => void;
    animeId: string;
    animeName: string;
}

const STATUS_OPTIONS = [
    { id: 'WATCHING', label: 'Смотрю', icon: <BookOpen size={16} /> },
    { id: 'COMPLETED', label: 'Просмотрено', icon: <CheckCircle size={16} /> },
    { id: 'ON_HOLD', label: 'Отложено', icon: <Clock size={16} /> },
    { id: 'DROPPED', label: 'Брошено', icon: <Trash2 size={16} /> },
    { id: 'PLANNED', label: 'В планах', icon: <Bookmark size={16} /> },
];

export const AddToListModal: React.FC<AddToListModalProps> = ({
    isOpen,
    onClose,
    animeId,
    animeName
}) => {
    const { user } = useAuth();
    const [status, setStatus] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [customLists, setCustomLists] = useState<CustomList[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [isCreatingList, setIsCreatingList] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            fetchData();
        }
    }, [isOpen, user, animeId]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [userAnimeRes, customListsRes] = await Promise.all([
                fetch('/api/user-anime'),
                fetch('/api/custom-lists')
            ]);

            if (userAnimeRes.ok) {
                const data = await userAnimeRes.json();
                const entry = data.animeList.find((a: any) => a.animeId === Number(animeId));
                if (entry) {
                    setStatus(entry.status);
                    setIsFavorite(entry.isFavorite);
                } else {
                    setStatus(null);
                    setIsFavorite(false);
                }
            }

            if (customListsRes.ok) {
                const data = await customListsRes.json();
                setCustomLists(data.lists);
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string | null) => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }

        setIsActionLoading(true);
        try {
            if (newStatus === null) {
                await fetch(`/api/user-anime?animeId=${animeId}`, { method: 'DELETE' });
                setStatus(null);
            } else {
                await fetch('/api/user-anime', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ animeId, status: newStatus })
                });
                setStatus(newStatus);
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const toggleFavorite = async () => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }

        setIsActionLoading(true);
        try {
            await fetch('/api/user-anime', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ animeId, isFavorite: !isFavorite })
            });
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const toggleInCustomList = async (listId: number, isInList: boolean) => {
        setIsActionLoading(true);
        try {
            if (isInList) {
                await fetch(`/api/custom-lists/entries?listId=${listId}&animeId=${animeId}`, { method: 'DELETE' });
            } else {
                await fetch('/api/custom-lists/entries', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ listId, animeId })
                });
            }
            // Refresh custom lists
            const res = await fetch('/api/custom-lists');
            if (res.ok) {
                const data = await res.json();
                setCustomLists(data.lists);
            }
        } catch (error) {
            console.error('Failed to update custom list entry:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const createList = async () => {
        if (!newListName.trim()) return;
        setIsActionLoading(true);
        try {
            const res = await fetch('/api/custom-lists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newListName })
            });
            if (res.ok) {
                setNewListName('');
                setIsCreatingList(false);
                const data = await res.json();
                setCustomLists(prev => [...prev, { ...data.list, entries: [] }]);
            }
        } catch (error) {
            console.error('Failed to create list:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
            {/* Backdrop with aggressive blur */}
            <div className="fixed inset-0 bg-bg-dark/80 backdrop-blur-2xl transition-all duration-500" onClick={onClose} />

            {/* Modal Container - Max height significantly restricted to ensure fit */}
            <div className="relative w-full max-w-[480px] max-h-[85vh] bg-bg-cream border-2 border-bg-dark rounded-[2rem] shadow-brutal-dark-xl flex flex-col motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 duration-500 ease-out overflow-hidden my-auto">

                {/* Header Section - Stripped down height */}
                <div className="bg-white border-b-2 border-bg-dark p-6 relative overflow-hidden shrink-0">
                    <div className="relative z-10 flex justify-between items-center gap-4">
                        <div className="space-y-0.5">
                            <h2 className="font-editorial text-2xl sm:text-3xl text-bg-dark leading-none uppercase tracking-tighter">
                                Добавить в список
                            </h2>
                            <div className="flex items-center gap-2">
                                <div className="h-0.5 w-4 bg-accent" />
                                <p className="font-serif italic text-[10px] sm:text-xs text-bg-dark/50 line-clamp-1">{animeName}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 bg-bg-dark text-white rounded-full hover:bg-accent transition-all duration-300 transform hover:rotate-90 active:scale-95 shadow-brutal-dark-sm shrink-0"
                        >
                            <X size={14} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* Main Content Area - Scrollable with tighter gaps */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">

                    {/* Status Grid */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-bg-dark/20">01 / Статус</span>
                            <div className="h-px flex-1 bg-bg-dark/5" />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {STATUS_OPTIONS.map((opt) => (
                                <button
                                    key={opt.id}
                                    disabled={isActionLoading}
                                    onClick={() => handleStatusUpdate(status === opt.id ? null : opt.id)}
                                    className={cn(
                                        "group flex items-center justify-between p-2.5 rounded-xl border-2 transition-all duration-300 font-black text-[8px] uppercase tracking-widest",
                                        status === opt.id
                                            ? "bg-bg-dark border-bg-dark text-white shadow-brutal-dark-sm"
                                            : "bg-white/60 border-bg-dark/10 text-bg-dark hover:border-bg-dark/40 hover:bg-white"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300",
                                            status === opt.id ? "bg-white/10" : "bg-bg-dark/5 group-hover:bg-accent/10"
                                        )}>
                                            {React.cloneElement(opt.icon as React.ReactElement, { size: 14 })}
                                        </div>
                                        <span>{opt.label}</span>
                                    </div>
                                    {status === opt.id && <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Favorite Button - Tighter padding */}
                    <button
                        onClick={toggleFavorite}
                        disabled={isActionLoading}
                        className={cn(
                            "w-full group flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all duration-500 relative overflow-hidden",
                            isFavorite
                                ? "bg-accent border-bg-dark text-white shadow-brutal-dark-sm"
                                : "bg-white border-bg-dark text-bg-dark hover:bg-bg-cream"
                        )}
                    >
                        <Heart size={18} className={cn(isFavorite && "fill-white")} />
                        <span className="font-black uppercase tracking-widest text-[9px]">
                            {isFavorite ? 'В ИЗБРАННОМ' : 'В ИЗБРАННОЕ'}
                        </span>
                    </button>

                    {/* Custom Lists - Subdued gaps */}
                    <div className="space-y-4 pt-6 border-t-2 border-bg-dark/5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-bg-dark/20">02 / Коллекции</span>
                            </div>
                            <button
                                onClick={() => setIsCreatingList(!isCreatingList)}
                                className="text-[8px] font-black uppercase tracking-widest text-accent hover:text-bg-dark transition-colors"
                            >
                                {isCreatingList ? '[ Отмена ]' : '[ Создать ]'}
                            </button>
                        </div>

                        {isCreatingList && (
                            <div className="flex gap-2 p-2 bg-white border-2 border-bg-dark rounded-xl animate-in zoom-in-95 duration-300">
                                <input
                                    autoFocus
                                    className="flex-1 bg-transparent px-2 text-[9px] font-black uppercase outline-none"
                                    placeholder="Имя коллекции..."
                                    value={newListName}
                                    onChange={(e) => setNewListName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && createList()}
                                />
                                <button
                                    onClick={createList}
                                    disabled={isActionLoading || !newListName.trim()}
                                    className="px-3 py-1 bg-bg-dark text-white rounded-md text-[8px] font-black uppercase tracking-widest"
                                >
                                    ОК
                                </button>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            {customLists.map((list) => {
                                const isInList = list.entries.some(e => e.animeId === Number(animeId));
                                return (
                                    <button
                                        key={list.id}
                                        disabled={isActionLoading}
                                        onClick={() => toggleInCustomList(list.id, isInList)}
                                        className={cn(
                                            "w-full group flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-300",
                                            isInList
                                                ? "bg-accent/5 border-accent text-accent"
                                                : "bg-white/40 border-bg-dark/5 text-bg-dark hover:border-bg-dark/20"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <ListPlus size={14} className={isInList ? "text-accent" : "text-bg-dark/20"} />
                                            <div className="text-left leading-tight">
                                                <span className="block font-black uppercase text-[9px] truncate max-w-[200px]">
                                                    {list.name}
                                                </span>
                                                <span className="block text-[7px] font-bold opacity-30 uppercase">
                                                    {list.entries.length} TITLES
                                                </span>
                                            </div>
                                        </div>
                                        {isInList ? <CheckCircle size={12} /> : <Plus size={10} className="opacity-20" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer Section - Super compact */}
                <div className="py-2 bg-bg-dark text-center border-t-2 border-bg-dark shrink-0">
                    <p className="text-[6px] font-black uppercase tracking-[0.5em] text-white/20">
                        ANIMANGA HUB • 2026
                    </p>
                </div>
            </div>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                initialMode="login"
            />
        </div>
    );
};
