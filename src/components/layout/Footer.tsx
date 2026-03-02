"use client";

import Link from "next/link";
import { Send, Globe, PlayCircle, Apple, Store, ArrowRight } from "lucide-react";

const LOGO_URL = "https://xlknusrqbgkbgzvzwdrx.supabase.co/storage/v1/object/public/images/logo.png";

export function Footer() {
    return (
        <footer className="relative bg-bg-dark text-cream border-t-8 border-accent pt-24 pb-8 overflow-hidden z-20">
            {/* Retro background pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="footergrid" width="30" height="30" patternUnits="userSpaceOnUse">
                            <rect width="30" height="30" fill="none" stroke="var(--color-cream)" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#footergrid)" />
                </svg>
            </div>

            <div className="max-w-[1800px] mx-auto px-6 lg:px-12 relative z-10">

                {/* BIG EDITORIAL BRANDING */}
                <div className="flex flex-col items-center justify-center text-center mb-24 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-[16px] border-accent rounded-full opacity-20 pointer-events-none" />
                    <img
                        src="/logo.png"
                        alt="AniVault"
                        className="w-24 h-24 object-contain mb-8 invert brightness-200"
                    />
                    <h2 className="font-editorial text-6xl md:text-8xl lg:text-[10rem] uppercase tracking-tighter leading-[0.8] mb-6 drop-shadow-md">
                        ANIVAULT
                    </h2>
                    <p className="font-serif italic text-xl md:text-2xl text-cream/70 max-w-2xl font-bold">
                        Crafting stories and experiences that blur the lines between physical and digital worlds.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 border-t-4 border-cream/20 pt-16 mb-16">
                    {/* NEWSLETTER */}
                    <div className="space-y-6">
                        <h4 className="font-editorial text-3xl uppercase tracking-wider text-accent">Join Sub</h4>
                        <p className="text-cream text-sm font-bold uppercase tracking-widest leading-relaxed">
                            A global community working together to build a decentralized brand of the future.
                        </p>
                        <div className="relative group flex">
                            <input
                                type="email"
                                placeholder="YOUR EMAIL"
                                className="w-full bg-transparent border-4 border-cream px-4 py-3 text-sm font-bold tracking-widest uppercase text-cream placeholder-cream/40 focus:outline-none focus:border-accent focus:bg-accent/5 transition-all outline-none"
                            />
                            <button className="bg-cream text-bg-dark border-y-4 border-r-4 border-cream px-4 flex items-center justify-center font-editorial text-2xl hover:bg-accent hover:border-accent hover:text-cream active:scale-95 transition-all">
                                <ArrowRight strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    {/* DISCOVER */}
                    <div className="space-y-6">
                        <h4 className="text-secondary font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Explore</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Anime Library', path: '/anime' },
                                { name: 'Manga Reader', path: '/manga' },
                                { name: 'Live Cinema', path: '/cinema' },
                                { name: 'Weekly Schedule', path: '/schedule' },
                            ].map(item => (
                                <li key={item.name}>
                                    <Link href={item.path} className="font-editorial text-2xl uppercase tracking-wider text-cream hover:text-accent transition-colors flex items-center gap-2 group">
                                        <span className="w-0 group-hover:w-4 h-1 bg-accent transition-all duration-300 inline-block" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COMMUNITY */}
                    <div className="space-y-6">
                        <h4 className="text-secondary font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Network</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Discussion Forum', path: '/forum' },
                                { name: 'Honor Roll', path: '/leaderboard' },
                                { name: 'Premium Shop', path: '/shop' },
                                { name: 'Our Team', path: '/team' },
                            ].map(item => (
                                <li key={item.name}>
                                    <Link href={item.path} className="font-editorial text-2xl uppercase tracking-wider text-cream hover:text-accent transition-colors flex items-center gap-2 group">
                                        <span className="w-0 group-hover:w-4 h-1 bg-accent transition-all duration-300 inline-block" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* SOCIAL CONNECT */}
                    <div className="space-y-6">
                        <h4 className="text-secondary font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Connect</h4>

                        <div className="flex gap-4 mb-8">
                            <a href="#" className="w-12 h-12 border-4 border-cream flex items-center justify-center hover:bg-cream hover:text-bg-dark hover:-translate-y-1 shadow-[4px_4px_0_var(--color-cream)] hover:shadow-none transition-all outline-none">
                                <Send size={24} />
                            </a>
                            <a href="#" className="w-12 h-12 border-4 border-cream flex items-center justify-center hover:bg-cream hover:text-bg-dark hover:-translate-y-1 shadow-[4px_4px_0_var(--color-cream)] hover:shadow-none transition-all outline-none">
                                <Globe size={24} />
                            </a>
                            <a href="#" className="w-12 h-12 border-4 border-cream flex items-center justify-center hover:bg-cream hover:text-bg-dark hover:-translate-y-1 shadow-[4px_4px_0_var(--color-cream)] hover:shadow-none transition-all outline-none">
                                <PlayCircle size={24} />
                            </a>
                        </div>

                        <div className="p-4 border-4 border-accent flex items-center justify-between text-accent bg-accent/5">
                            <div>
                                <p className="font-editorial text-xl uppercase tracking-wider">Mobile App</p>
                                <p className="text-[10px] font-bold uppercase">Coming Soon</p>
                            </div>
                            <div className="flex gap-2">
                                <Apple size={24} strokeWidth={2.5} />
                                <Store size={24} strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t-4 border-bg-dark">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex items-center gap-2 border-2 border-cream px-3 py-1 bg-cream text-bg-dark">
                            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                            <span className="font-bold uppercase tracking-widest text-[10px]">ALL SYSTEMS OP</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">&copy; 2026 ANIVAULT. THE GARDEN.</p>
                    </div>

                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-cream border-b-2 border-transparent hover:border-cream transition-all pb-1">Privacy</Link>
                        <Link href="/terms" className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-cream border-b-2 border-transparent hover:border-cream transition-all pb-1">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
