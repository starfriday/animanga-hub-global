'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { AuthModal } from './AuthModal';
import { User, LogOut, Settings, Heart, History, Sparkles } from 'lucide-react';
import Image from 'next/image';

export function UserMenu() {
    const { user, isLoading, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState<false | 'login' | 'register'>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (isLoading) {
        return <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />;
    }

    if (!user) {
        return (
            <>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsAuthModalOpen('login')}
                        className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                    >
                        Войти
                    </button>
                    <button
                        onClick={() => setIsAuthModalOpen('register')}
                        className="text-sm font-medium bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors flex items-center gap-2"
                    >
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span>Регистрация</span>
                    </button>
                </div>
                <AuthModal
                    isOpen={!!isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                    initialMode={isAuthModalOpen || 'login'}
                />
            </>
        );
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 p-1 pr-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent/50 to-accent/20 flex items-center justify-center overflow-hidden">
                    {user.avatarUrl ? (
                        <Image src={user.avatarUrl} alt={user.username} width={32} height={32} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-4 h-4 text-white/70" />
                    )}
                </div>
                <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">{user.username}</span>
            </button>

            {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#1f1f1f] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="p-4 border-b border-white/5">
                        <p className="text-sm font-medium text-white">{user.username}</p>
                        <p className="text-xs text-white/50 truncate mt-0.5">{user.email}</p>
                    </div>

                    <div className="p-2 space-y-1">
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                            <Heart className="w-4 h-4" /> Избранное
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                            <History className="w-4 h-4" /> История
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                            <Settings className="w-4 h-4" /> Настройки
                        </button>
                    </div>

                    <div className="p-2 border-t border-white/5">
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" /> Выйти
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
