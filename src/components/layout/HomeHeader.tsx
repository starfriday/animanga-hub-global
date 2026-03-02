"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User, Menu, ShoppingBag, Globe, PlayCircle, Film, Calendar, BookOpen, Users, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const LOGO_URL = "https://xlknusrqbgkbgzvzwdrx.supabase.co/storage/v1/object/public/images/logo.png";

type CurrentUser = {
    id: string;
    username: string;
    avatar?: string;
    role?: string;
    level?: number;
};

const useData = () => ({
    currentUser: null as CurrentUser | null,
    logout: () => { },
});

export function HomeHeader() {
    const [scrolled, setScrolled] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { currentUser, logout } = useData();
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
                className="fixed top-0 left-0 w-full z-[100] h-[60px] lg:h-[72px] flex items-center border-b-[1px] border-bg-dark/10 bg-bg-cream text-[#B83A2D]"
            >
                {/* Background Texture (Graph Paper) */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20 MixBlendMultiply">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs><pattern id="gridbg-nav" width="32" height="32" patternUnits="userSpaceOnUse"><rect width="32" height="32" fill="none" stroke="var(--color-bg-dark)" strokeWidth="0.5" /></pattern></defs>
                        <rect width="100%" height="100%" fill="url(#gridbg-nav)" />
                    </svg>
                </div>

                <div className="w-full flex items-center px-4 lg:px-8 relative z-10">

                    {/* DESKTOP NAV */}
                    <nav className="hidden lg:flex items-center gap-6 font-black tracking-widest uppercase text-sm w-full">
                        {/* Logo + ANIVAULT */}
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                                <img src="/logo.png" alt="AniVault" className="w-7 h-7 object-contain" />
                                <span className="font-black tracking-widest uppercase text-sm">ANIVAULT</span>
                            </Link>
                        </div>

                        {/* Separator */}
                        <span className="text-[#B83A2D] opacity-60 font-serif font-light text-lg px-2">◇</span>

                        {navLinks.map((link, idx) => (
                            <React.Fragment key={link.name}>
                                <Link
                                    href={link.path}
                                    className="hover:opacity-70 transition-opacity"
                                >
                                    {link.name}
                                </Link>
                                {idx < navLinks.length - 1 && (
                                    <span className="text-[#B83A2D] opacity-60 font-serif font-light text-lg px-2">◇</span>
                                )}
                            </React.Fragment>
                        ))}

                        <div className="flex-1" />

                        {/* Search, Shop & User Tools (Also in red for consistency) */}
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setSearchActive(!searchActive)}
                                className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity outline-none"
                            >
                                <Search size={20} strokeWidth={2.5} />
                            </button>
                            <Link href="/shop" className="hover:opacity-70 transition-opacity">
                                <ShoppingBag size={20} strokeWidth={2.5} />
                            </Link>
                            {currentUser ? (
                                <Link href={`/profile/${currentUser.id}`} className="hover:opacity-70 transition-opacity flex items-center gap-2">
                                    <span className="uppercase tracking-widest">{currentUser.username}</span>
                                </Link>
                            ) : (
                                <Link href="/login" className="hover:opacity-70 transition-opacity flex items-center gap-2">
                                    <User size={20} strokeWidth={2.5} />
                                    <span className="uppercase tracking-widest mt-0.5">LOGIN</span>
                                </Link>
                            )}
                        </div>
                    </nav>

                    {/* MOBILE NAV (Simplified) */}
                    <div className="flex lg:hidden items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                <img src="/logo.png" alt="AniVault" className="w-6 h-6 object-contain" />
                                <span className="font-black tracking-widest uppercase text-sm">ANIVAULT</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSearchActive(!searchActive)}
                                className="w-8 h-8 flex items-center justify-center outline-none"
                            >
                                <Search size={20} className="text-[#B83A2D]" strokeWidth={2.5} />
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="w-8 h-8 flex items-center justify-center outline-none"
                            >
                                <Menu size={24} className="text-[#B83A2D]" strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>

                {searchActive && (
                    <div className="absolute top-full left-0 w-full bg-bg-cream border-t border-bg-dark/10 p-4 z-20 shadow-[0_4px_0_var(--color-bg-dark)]">
                        <div className="max-w-xl mx-auto flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-transparent border-b-2 border-[#B83A2D] text-[#B83A2D] text-lg font-black tracking-widest uppercase outline-none py-2 placeholder-[#B83A2D]/40"
                                autoFocus
                            />
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
                                        {currentUser.avatar ? (
                                            <img src={currentUser.avatar} alt="" className="w-full h-full object-cover grayscale mix-blend-multiply" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-editorial text-3xl text-cream">
                                                {currentUser.username[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-editorial text-2xl uppercase tracking-wide leading-none">{currentUser.username}</p>
                                        <p className="text-xs font-bold text-accent uppercase tracking-widest mt-1">LVL {currentUser.level || 1}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center py-3 border-2 border-cream bg-accent text-cream font-bold text-xs uppercase tracking-widest hover:bg-cream hover:text-bg-dark hover:border-bg-dark">PROFILE</Link>
                                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="flex items-center justify-center py-3 border-2 border-cream bg-transparent text-cream font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:border-red-500 transition-colors">LOGOUT</button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-center w-full py-4 border-4 border-cream bg-accent text-cream font-editorial text-3xl uppercase tracking-wider shadow-[4px_4px_0_var(--color-cream)] active:transform active:translate-y-1 active:translate-x-1 active:shadow-none transition-all outline-none"
                            >
                                START
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
