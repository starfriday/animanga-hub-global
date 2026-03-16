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
    { id: 'WATCHING', label: 'Смотрю', icon: BookOpen },
    { id: 'COMPLETED', label: 'Просмотрено', icon: CheckCircle },
    { id: 'ON_HOLD', label: 'Отложено', icon: Clock },
    { id: 'DROPPED', label: 'Брошено', icon: Trash2 },
    { id: 'PLANNED', label: 'В планах', icon: Bookmark },
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300" onClick={onClose} />

            {/* Modal Container */}
            <div className="relative w-full max-w-[480px] max-h-[85vh] bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden my-auto">

                {/* Header */}
                <div className="p-6 pb-5 relative shrink-0">
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                            <h2 className="text-2xl sm:text-[1.7rem] font-black text-bg-dark leading-tight tracking-tight">
                                Добавить в список
                            </h2>
                            <p className="text-sm text-secondary-muted line-clamp-1">{animeName}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-full bg-bg-dark/5 hover:bg-bg-dark/10 flex items-center justify-center text-secondary-muted hover:text-bg-dark transition-all duration-300 active:scale-90 shrink-0"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    {/* Divider */}
                    <div className="absolute bottom-0 left-6 right-6 h-px bg-secondary-muted/10" />
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-6 pt-5 space-y-6">

                    {/* Status Section */}
                    <div className="space-y-3">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-secondary-muted">Статус</span>

                        <div className="grid grid-cols-2 gap-2">
                            {STATUS_OPTIONS.map((opt) => (
                                <button
                                    key={opt.id}
                                    disabled={isActionLoading}
                                    onClick={() => handleStatusUpdate(status === opt.id ? null : opt.id)}
                                    className={cn(
                                        "group flex items-center gap-3 p-3 rounded-xl transition-colors duration-150 text-sm font-bold",
                                        status === opt.id
                                            ? "bg-bg-dark text-white shadow-md"
                                            : "bg-[#f8f9fa] text-bg-dark/70 hover:bg-bg-dark/[0.06] hover:text-bg-dark"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 shrink-0",
                                        status === opt.id ? "bg-white/15" : "bg-white shadow-sm"
                                    )}>
                                        <opt.icon size={16} />
                                    </div>
                                    <span className="truncate">{opt.label}</span>
                                    {status === opt.id && <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse ml-auto shrink-0" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Favorite Button */}
                    <button
                        onClick={toggleFavorite}
                        disabled={isActionLoading}
                        className={cn(
                            "w-full group flex items-center justify-center gap-3 py-4 rounded-2xl transition-colors duration-150 font-bold text-sm",
                            isFavorite
                                ? "bg-accent text-white shadow-lg shadow-accent/20"
                                : "bg-[#f8f9fa] text-bg-dark hover:bg-bg-dark/[0.06] border border-secondary-muted/15"
                        )}
                    >
                        <Heart size={18} className={cn(isFavorite && "fill-white", "transition-transform duration-150 group-hover:scale-110")} />
                        <span>{isFavorite ? 'В избранном' : 'В избранное'}</span>
                    </button>

                    {/* Custom Lists */}
                    <div className="space-y-3 pt-4 border-t border-secondary-muted/10">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-secondary-muted">Коллекции</span>
                            <button
                                onClick={() => setIsCreatingList(!isCreatingList)}
                                className="text-[11px] font-bold text-accent hover:text-accent-hover transition-colors"
                            >
                                {isCreatingList ? 'Отмена' : '+ Создать'}
                            </button>
                        </div>

                        {isCreatingList && (
                            <div className="flex gap-2 p-1.5 bg-[#f8f9fa] rounded-xl border border-secondary-muted/15">
                                <input
                                    autoFocus
                                    className="flex-1 bg-transparent px-3 py-2 text-sm font-medium outline-none placeholder:text-secondary-muted/50"
                                    placeholder="Название коллекции..."
                                    value={newListName}
                                    onChange={(e) => setNewListName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && createList()}
                                />
                                <button
                                    onClick={createList}
                                    disabled={isActionLoading || !newListName.trim()}
                                    className="px-4 py-2 bg-bg-dark text-white rounded-lg text-sm font-bold hover:bg-bg-dark/90 transition-colors disabled:opacity-40"
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
                                            "w-full group flex items-center justify-between p-3.5 rounded-xl transition-colors duration-150",
                                            isInList
                                                ? "bg-accent/[0.06] text-accent border border-accent/20"
                                                : "bg-[#f8f9fa] text-bg-dark/70 border border-transparent hover:bg-bg-dark/[0.04] hover:text-bg-dark"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                                isInList ? "bg-accent/10" : "bg-white shadow-sm"
                                            )}>
                                                <ListPlus size={16} className={isInList ? "text-accent" : "text-secondary-muted"} />
                                            </div>
                                            <div className="text-left leading-tight">
                                                <span className="block font-bold text-sm truncate max-w-[200px]">
                                                    {list.name}
                                                </span>
                                                <span className="block text-[11px] text-secondary-muted">
                                                    {list.entries.length} тайтлов
                                                </span>
                                            </div>
                                        </div>
                                        {isInList ? <CheckCircle size={16} /> : <Plus size={14} className="text-secondary-muted/40" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
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
