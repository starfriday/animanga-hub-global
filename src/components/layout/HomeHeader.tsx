/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, Film, Users, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useAuth } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export function HomeHeader() {
    const [scrolled, setScrolled] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [authModalState, setAuthModalState] = useState<false | 'login' | 'register'>(false);
    const { user: currentUser, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (searchActive && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchActive]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const isSolid = scrolled || pathname !== '/';

    const navLinks = [
        { name: 'Каталог', path: '/catalog', icon: PlayCircle },
        { name: 'Коллекции', path: '/cinema', icon: Film },
        { name: 'Сообщество', path: '/team', icon: Users },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchActive(false);
            setSearchQuery('');
        }
    };

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 w-full z-[100] h-[72px] lg:h-[80px] flex items-center transition-all duration-500",
                    isSolid
                        ? "bg-white/80 backdrop-blur-xl border-b border-secondary-muted/15 shadow-[0_1px_20px_rgba(0,0,0,0.04)]"
                        : "bg-gradient-to-b from-black/30 to-transparent"
                )}
            >
                <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-4 lg:px-8 relative z-10">

                    {/* Logo (Left) */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2.5 outline-none group">
                            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/25 group-hover:shadow-accent/40 group-hover:scale-105 transition-all duration-300">
                                <span className="text-white font-black text-lg leading-none">A</span>
                            </div>
                            <span className={cn(
                                "font-black tracking-tight text-[1.55rem] transition-colors duration-300",
                                isSolid ? "text-bg-dark" : "text-white drop-shadow-md"
                            )}>
                                ANIVAULT
                            </span>
                        </Link>
                    </div>

                    {/* Navigation (Center Desktop) */}
                    <nav className="hidden lg:flex items-center gap-1 bg-bg-dark/[0.03] backdrop-blur-sm rounded-2xl p-1.5">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.path;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    className={cn(
                                        "relative px-5 py-2 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 outline-none",
                                        isSolid
                                            ? isActive
                                                ? "bg-white text-bg-dark shadow-sm"
                                                : "text-bg-dark/60 hover:text-bg-dark hover:bg-white/60"
                                            : isActive
                                                ? "bg-white/20 text-white backdrop-blur-md shadow-sm"
                                                : "text-white/75 hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    {link.name}
                                    {isActive && (
                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Actions (Right) */}
                    <div className="flex items-center gap-3">
                        {/* Search Toggle */}
                        <button
                            onClick={() => setSearchActive(!searchActive)}
                            className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 outline-none",
                                searchActive
                                    ? "bg-accent/10 text-accent"
                                    : isSolid
                                        ? "text-secondary-muted hover:text-bg-dark hover:bg-bg-dark/5"
                                        : "text-white/80 hover:text-white hover:bg-white/10"
                            )}
                        >
                            {searchActive ? <X size={20} /> : <Search size={20} />}
                        </button>

                        {/* Desktop Auth */}
                        <div className="hidden lg:block">
                            {currentUser ? (
                                <Link
                                    href="/profile"
                                    className={cn(
                                        "h-10 px-4 rounded-full flex items-center gap-2.5 font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 outline-none",
                                        isSolid
                                            ? "bg-bg-dark/[0.04] hover:bg-bg-dark/[0.08] text-bg-dark border border-secondary-muted/15"
                                            : "bg-white/15 text-white border border-white/20 backdrop-blur-md hover:bg-white/25"
                                    )}
                                >
                                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden">
                                        {currentUser.avatarUrl ? (
                                            <Image src={currentUser.avatarUrl} alt="" width={24} height={24} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-accent text-xs font-black">
                                                {currentUser.username[0].toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <span>{currentUser.username}</span>
                                </Link>
                            ) : (
                                <button
                                    onClick={() => setAuthModalState('login')}
                                    className={cn(
                                        "h-10 px-6 rounded-full flex items-center gap-2 font-bold text-sm transition-all duration-300 hover:scale-[1.03] shadow-md active:scale-95 outline-none",
                                        isSolid
                                            ? "bg-accent text-white shadow-accent/20 hover:shadow-accent/35 hover:shadow-lg"
                                            : "bg-white text-bg-dark hover:bg-white/90 shadow-white/20"
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
                                "lg:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 outline-none",
                                isSolid ? "text-bg-dark hover:bg-bg-dark/5" : "text-white hover:bg-white/10"
                            )}
                        >
                            <Menu size={22} />
                        </button>
                    </div>
                </div>

                {/* Search Overlay */}
                <div className={cn(
                    "absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-secondary-muted/15 shadow-lg transition-all duration-300 overflow-hidden",
                    searchActive ? "max-h-[120px] opacity-100 py-5" : "max-h-0 opacity-0 py-0"
                )}>
                    <form onSubmit={handleSearch} className="max-w-[1200px] mx-auto px-4 lg:px-8 flex items-center gap-4">
                        <Search size={22} className="text-accent shrink-0" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Найти аниме, мангу или персонажа..."
                            className="w-full bg-transparent border-none text-bg-dark text-xl lg:text-2xl font-bold outline-none placeholder:text-secondary-muted/40"
                        />
                        <button
                            type="button"
                            onClick={() => { setSearchActive(false); setSearchQuery(''); }}
                            className="p-2 rounded-full hover:bg-bg-dark/5 text-secondary-muted hover:text-bg-dark transition-all"
                        >
                            <X size={20} />
                        </button>
                    </form>
                </div>
            </header>

            {/* ==================== MOBILE DRAWER ==================== */}
            <div className={cn(
                "fixed inset-0 z-[200] lg:hidden transition-all duration-300",
                isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}>
                {/* Backdrop */}
                <div
                    className={cn(
                        "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
                        isMenuOpen ? "opacity-100" : "opacity-0"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* Drawer Panel */}
                <div className={cn(
                    "absolute top-0 right-0 w-[85%] max-w-[340px] h-full bg-white/95 backdrop-blur-xl flex flex-col transition-transform duration-300 ease-out shadow-[−20px_0_60px_rgba(0,0,0,0.1)] rounded-l-3xl",
                    isMenuOpen ? "translate-x-0" : "translate-x-full"
                )}>
                    {/* Drawer Header */}
                    <div className="p-6 flex items-center justify-between border-b border-secondary-muted/10">
                        <span className="font-black text-xl tracking-tight text-bg-dark">
                            МЕНЮ
                        </span>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-bg-dark/5 text-secondary-muted transition-all active:scale-90"
                        >
                            <X size={22} />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-4 rounded-2xl font-bold tracking-wide transition-all duration-300 outline-none",
                                    pathname === link.path
                                        ? "bg-accent/10 text-accent"
                                        : "text-secondary-muted hover:bg-bg-dark/[0.03] hover:text-bg-dark"
                                )}
                            >
                                <link.icon size={20} />
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* User Section */}
                    <div className="p-6 bg-[#f8f9fa] border-t border-secondary-muted/10 rounded-bl-3xl">
                        {currentUser ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center overflow-hidden shadow-sm">
                                        {currentUser.avatarUrl ? (
                                            <Image src={currentUser.avatarUrl} alt="" width={48} height={48} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="font-black text-xl text-accent">
                                                {currentUser.username[0].toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-bg-dark">{currentUser.username}</p>
                                        <p className="text-xs font-bold text-accent uppercase tracking-wider">Уровень 1</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2.5">
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center py-3 rounded-xl bg-bg-dark text-white font-bold text-xs transition-all hover:bg-bg-dark/90 hover:shadow-md active:scale-95"
                                    >
                                        Профиль
                                    </Link>
                                    <button
                                        onClick={() => { logout(); setIsMenuOpen(false); }}
                                        className="flex items-center justify-center py-3 rounded-xl border border-secondary-muted/20 text-secondary-muted font-bold text-xs hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all active:scale-95"
                                    >
                                        Выйти
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => { setIsMenuOpen(false); setAuthModalState('login'); }}
                                className="flex items-center justify-center w-full py-3.5 rounded-2xl bg-accent text-white font-bold transition-all hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20 active:scale-95 outline-none"
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
