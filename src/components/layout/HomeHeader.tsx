/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, Film, Users, PlayCircle, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export function HomeHeader() {
    const [scrolled, setScrolled] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [authModalState, setAuthModalState] = useState<false | 'login' | 'register'>(false);
    const { user: currentUser, logout } = useAuth();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isSolid = scrolled || pathname !== '/';

    const navLinks = [
        { name: 'Каталог', path: '/catalog', icon: PlayCircle },
        { name: 'Коллекции', path: '/cinema', icon: Film },
        { name: 'Сообщество', path: '/team', icon: Users },
    ];

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 w-full z-[100] h-[72px] lg:h-[80px] flex items-center transition-all duration-300",
                    isSolid
                        ? "bg-white/80 backdrop-blur-lg border-b border-secondary-muted/20 shadow-sm"
                        : "bg-transparent"
                )}
            >
                <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-4 lg:px-8 relative z-10 transition-colors duration-300">

                    {/* Logo (Left) */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2 outline-none group">
                            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-md shadow-accent/20 group-hover:scale-105 transition-transform">
                                <span className="text-white font-bold text-xl leading-none">A</span>
                            </div>
                            <span className={cn(
                                "font-black tracking-tight text-2xl transition-colors",
                                isSolid ? "text-bg-dark" : "text-white drop-shadow-md"
                            )}>
                                ANIVAULT
                            </span>
                        </Link>
                    </div>

                    {/* Navigation (Center Desk) */}
                    <nav className="hidden lg:flex items-center gap-8 font-bold text-sm tracking-wide">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={cn(
                                    "relative outline-none transition-colors",
                                    isSolid ? "text-secondary-muted hover:text-accent" : "text-white/80 hover:text-white drop-shadow-sm",
                                    pathname === link.path && (isSolid ? "text-accent" : "text-white")
                                )}
                            >
                                {link.name}
                                {pathname === link.path && (
                                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions (Right) */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSearchActive(!searchActive)}
                            className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-black/5 active:scale-95 outline-none",
                                isSolid ? "text-bg-dark" : "text-white"
                            )}
                        >
                            <Search size={22} />
                        </button>

                        <div className="hidden lg:block">
                            {currentUser ? (
                                <Link
                                    href="/profile"
                                    className={cn(
                                        "h-10 px-5 rounded-full flex items-center gap-2 font-bold text-sm transition-all hover:scale-105 shadow-sm active:scale-95 outline-none border",
                                        isSolid
                                            ? "bg-bg-dark text-white border-transparent hover:bg-bg-dark/90 hover:shadow-lg"
                                            : "bg-white/10 text-white border-white/20 backdrop-blur-sm hover:bg-white/20"
                                    )}
                                >
                                    <span>{currentUser.username}</span>
                                </Link>
                            ) : (
                                <button
                                    onClick={() => setAuthModalState('login')}
                                    className={cn(
                                        "h-10 px-6 rounded-full flex items-center gap-2 font-bold text-sm transition-all hover:scale-105 shadow-sm border active:scale-95 outline-none",
                                        isSolid
                                            ? "bg-accent text-white border-transparent shadow-accent/20 hover:shadow-accent/40 hover:shadow-lg"
                                            : "bg-white text-bg-dark border-transparent hover:bg-white/90"
                                    )}
                                >
                                    Войти
                                </button>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className={cn(
                                "lg:hidden w-10 h-10 rounded-full flex items-center justify-center transition-colors active:scale-95 outline-none",
                                isSolid ? "text-bg-dark" : "text-white"
                            )}
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>

                {/* Search Overlay */}
                <div className={cn(
                    "absolute top-full left-0 w-full bg-white border-b border-secondary-muted/20 shadow-lg transition-all duration-300 overflow-hidden",
                    searchActive ? "max-h-[120px] opacity-100 py-6" : "max-h-0 opacity-0 py-0"
                )}>
                    <div className="max-w-[1200px] mx-auto px-4 flex items-center gap-4">
                        <Search size={24} className="text-secondary-muted" />
                        <input
                            type="text"
                            placeholder="Найти аниме, мангу или персонажа..."
                            className="w-full bg-transparent border-none text-bg-dark text-xl lg:text-3xl font-bold outline-none placeholder:text-secondary-muted/50"
                            autoFocus={searchActive}
                        />
                        <button
                            onClick={() => setSearchActive(false)}
                            className="p-2 rounded-full hover:bg-black/5 text-secondary-muted"
                        >
                            <Menu size={24} className="rotate-45" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer Overlay */}
            <div className={cn(
                "fixed inset-0 z-[200] lg:hidden transition-all duration-300",
                isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}>
                <div
                    className={cn(
                        "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
                        isMenuOpen ? "opacity-100" : "opacity-0"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                />

                <div className={cn(
                    "absolute top-0 right-0 w-[85%] max-w-[320px] h-full bg-white flex flex-col transition-transform duration-300 ease-out shadow-2xl rounded-l-2xl",
                    isMenuOpen ? "translate-x-0" : "translate-x-full"
                )}>
                    {/* Header in Menu */}
                    <div className="p-6 flex items-center justify-between border-b border-secondary-muted/10">
                        <span className="font-black text-xl tracking-tight text-bg-dark">
                            МЕНЮ
                        </span>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 -mr-2 rounded-full hover:bg-black/5 text-secondary-muted transition-colors active:scale-95"
                        >
                            <Menu size={24} className="rotate-45" />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-4 rounded-xl font-bold tracking-wide transition-colors outline-none",
                                    pathname === link.path
                                        ? "bg-accent/10 text-accent"
                                        : "text-secondary-muted hover:bg-black/5 hover:text-bg-dark"
                                )}
                            >
                                <link.icon size={20} />
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="p-6 bg-slate-50 border-t border-secondary-muted/10 rounded-bl-2xl">
                        {currentUser ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden">
                                        {currentUser.avatarUrl ? (
                                            <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="font-bold text-xl text-accent">
                                                {currentUser.username[0].toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-bg-dark">{currentUser.username}</p>
                                        <p className="text-xs font-bold text-accent uppercase tracking-wider">Уровень 1</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center py-2.5 rounded-lg bg-bg-dark text-white font-bold text-xs transition-colors hover:bg-bg-dark/90"
                                    >
                                        Профиль
                                    </Link>
                                    <button
                                        onClick={() => { logout(); setIsMenuOpen(false); }}
                                        className="flex items-center justify-center py-2.5 rounded-lg border border-secondary-muted/20 text-secondary-muted font-bold text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                                    >
                                        Выйти
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => { setIsMenuOpen(false); setAuthModalState('login'); }}
                                className="flex items-center justify-center w-full py-3.5 rounded-xl bg-accent text-white font-bold transition-all hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20 active:scale-95 outline-none"
                            >
                                Войти в аккаунт
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <AuthModal
                isOpen={!!authModalState}
                onClose={() => setAuthModalState(false)}
                initialMode={authModalState || 'login'}
            />
        </>
    );
}
