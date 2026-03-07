"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User, Menu, ShoppingBag, Globe, PlayCircle, Film, Calendar, BookOpen, Users, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useAuth } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

const LOGO_URL = "https://xlknusrqbgkbgzvzwdrx.supabase.co/storage/v1/object/public/images/logo.png";

export function HomeHeader() {
    const [scrolled, setScrolled] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [authModalState, setAuthModalState] = useState<false | 'login' | 'register'>(false);
    const { user: currentUser, logout } = useAuth();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'COLLECTION', path: '/catalog', icon: PlayCircle },
        { name: 'WORLD', path: '/cinema', icon: Film },
        { name: 'COMMUNITY', path: '/team', icon: Users },
    ];

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 w-full z-[100] h-[72px] lg:h-[88px] flex items-center bg-bg-cream border-b-4 border-bg-dark transition-transform duration-300",
                    scrolled ? "-translate-y-full" : "translate-y-0"
                )}
            >
                {/* Brutalist Grid Background */}
                <div className="absolute inset-0 z-0 pointer-events-none mix-blend-multiply opacity-20" style={{ backgroundImage: 'var(--background-grid)' }} />


                <div className="w-full flex items-center px-4 lg:px-8 relative z-10">

                    {/* DESKTOP NAV */}
                    <nav className="hidden lg:flex items-center gap-8 font-editorial text-2xl uppercase tracking-wider w-full text-bg-dark">
                        {/* Logo */}
                        <div className="flex items-center gap-4 border-r-4 border-bg-dark pr-8 h-full">
                            <Link href="/" className="flex items-center gap-3 group outline-none">
                                <div className="w-10 h-10 bg-accent flex items-center justify-center border-2 border-bg-dark shadow-solid-sm group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
                                    <span className="text-bg-cream font-kanji font-black leading-none pt-1">A</span>
                                </div>
                                <span className="font-black tracking-tighter text-3xl group-hover:text-accent transition-colors">ANIVAULT</span>
                            </Link>
                        </div>

                        {/* Links */}
                        <div className="flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    className="relative group outline-none overflow-hidden"
                                >
                                    <span className="relative z-10 group-hover:text-accent transition-colors">{link.name}</span>
                                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-[var(--transition-spring)]" />
                                </Link>
                            ))}
                        </div>

                        <div className="flex-1" />

                        {/* Search, Shop & User Tools */}
                        <div className="flex items-center gap-4 border-l-4 border-bg-dark pl-8 h-full">
                            <button
                                onClick={() => setSearchActive(!searchActive)}
                                className="w-10 h-10 bg-white border-2 border-bg-dark shadow-solid-sm flex items-center justify-center hover:-translate-y-1 hover:-translate-x-1 hover:shadow-solid-accent transition-all active:translate-y-0 active:translate-x-0 active:shadow-none outline-none"
                            >
                                <Search size={20} strokeWidth={3} className="text-bg-dark" />
                            </button>
                            {currentUser ? (
                                <Link href={`/profile`} className="px-4 h-10 bg-accent text-cream border-2 border-bg-dark flex items-center gap-2 font-editorial text-lg tracking-wider uppercase hover:bg-bg-dark transition-colors shadow-solid-sm hover:-translate-y-1 hover:-translate-x-1 hover:shadow-solid transition-all active:translate-y-0 active:translate-x-0 active:shadow-none outline-none">
                                    <span>{currentUser.username}</span>
                                </Link>
                            ) : (
                                <button onClick={() => setAuthModalState('login')} className="px-4 h-10 bg-bg-dark text-cream border-2 border-bg-dark flex items-center gap-2 font-editorial text-lg tracking-wider uppercase shadow-solid-sm hover:-translate-y-1 hover:-translate-x-1 hover:shadow-solid-accent transition-all active:translate-y-0 active:translate-x-0 active:shadow-none outline-none">
                                    <span>LOGIN</span>
                                </button>
                            )}
                        </div>
                    </nav>

                    {/* MOBILE NAV (Simplified) */}
                    <div className="flex lg:hidden items-center justify-between w-full text-bg-dark">
                        <Link href="/" className="flex items-center gap-2 outline-none">
                            <div className="w-8 h-8 bg-accent flex items-center justify-center border-2 border-bg-dark shadow-solid-sm">
                                <span className="text-bg-cream font-kanji font-black leading-none pt-0.5">A</span>
                            </div>
                            <span className="font-editorial text-2xl tracking-tighter uppercase">ANIVAULT</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSearchActive(!searchActive)}
                                className="w-10 h-10 flex items-center justify-center outline-none bg-white border-2 border-bg-dark shadow-solid-sm active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
                            >
                                <Search size={20} className="text-bg-dark" strokeWidth={3} />
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="w-10 h-10 flex items-center justify-center outline-none bg-accent border-2 border-bg-dark shadow-solid-sm active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
                            >
                                <Menu size={24} className="text-cream" strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </div>

                {searchActive && (
                    <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-accent text-cream border-b-4 border-bg-dark p-6 z-20 shadow-solid-lg animate-slide-up-fade">
                        <div className="max-w-[1800px] mx-auto flex items-center gap-6">
                            <Search size={32} strokeWidth={3} />
                            <input
                                type="text"
                                placeholder="TYPE TO SEARCH..."
                                className="w-full bg-transparent border-b-4 border-cream text-cream text-4xl lg:text-6xl font-editorial uppercase tracking-tighter outline-none py-2 placeholder-cream/30 focus:border-bg-dark transition-colors"
                                autoFocus
                            />
                            <button onClick={() => setSearchActive(false)} className="outline-none hover:scale-110 active:scale-95 transition-transform"><Menu size={32} strokeWidth={3} className="rotate-45" /></button>
                        </div>
                    </div>
                )}
            </header>

            {/* MOBILE OVERLAY */}
            <div className={cn(
                "fixed inset-0 z-[200] lg:hidden transition-all duration-500",
                isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}>
                <div
                    className="absolute inset-0 bg-bg-dark/80 backdrop-blur-md"
                    onClick={() => setIsMenuOpen(false)}
                />

                <div className={cn(
                    "absolute top-0 right-0 w-[85%] max-w-sm h-full bg-bg-cream border-l-4 border-bg-dark flex flex-col transition-transform duration-500 shadow-[[-20px_0_0_rgba(184,58,45,0.2)]]",
                    isMenuOpen ? "translate-x-0" : "translate-x-full"
                )}>
                    {/* Header in Menu */}
                    <div className="p-6 flex items-center justify-between border-b-4 border-bg-dark pb-4">
                        <span className="font-editorial text-4xl tracking-tighter uppercase text-bg-dark pt-2">
                            MENU
                        </span>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 border-2 border-bg-dark text-bg-dark bg-cream shadow-[4px_4px_0_var(--color-bg-dark)] active:scale-95"
                        >
                            <Menu size={24} strokeWidth={3} className="rotate-90" />
                        </button>
                    </div>

                    <nav className="flex-1 px-6 py-8 space-y-4 overflow-y-auto">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 px-6 py-4 border-4 border-bg-dark font-editorial text-2xl uppercase tracking-wider transition-all shadow-[4px_4px_0_var(--color-bg-dark)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 outline-none",
                                    pathname === link.path
                                        ? "bg-accent text-cream border-accent"
                                        : "bg-cream text-bg-dark hover:bg-bg-dark hover:text-cream"
                                )}
                            >
                                <link.icon size={24} strokeWidth={2.5} />
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="p-6 border-t-4 border-bg-dark bg-bg-dark text-cream">
                        {currentUser ? (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 border-4 border-cream bg-accent overflow-hidden">
                                        {currentUser.avatarUrl ? (
                                            <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover grayscale mix-blend-multiply" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-editorial text-3xl text-cream">
                                                {currentUser.username[0].toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-editorial text-2xl uppercase tracking-wide leading-none">{currentUser.username}</p>
                                        <p className="text-xs font-bold text-accent uppercase tracking-widest mt-1">LVL 1</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center py-3 border-2 border-cream bg-accent text-cream font-bold text-xs uppercase tracking-widest hover:bg-cream hover:text-bg-dark hover:border-bg-dark">PROFILE</Link>
                                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="flex items-center justify-center py-3 border-2 border-cream bg-transparent text-cream font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:border-red-500 transition-colors">LOGOUT</button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => { setIsMenuOpen(false); setAuthModalState('login'); }}
                                className="flex items-center justify-center w-full py-4 border-4 border-cream bg-accent text-cream font-editorial text-3xl uppercase tracking-wider shadow-[4px_4px_0_var(--color-cream)] active:transform active:translate-y-1 active:translate-x-1 active:shadow-none transition-all outline-none"
                            >
                                START
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
