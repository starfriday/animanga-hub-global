"use client";

import Link from "next/link";
import { Send } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative bg-[#1a1411] text-[#f5ead6] overflow-hidden z-20">
            {/* Torn edge top */}
            <div className="h-6" style={{ background: 'linear-gradient(to bottom, #f5ead6, #1a1411)' }} />

            {/* Halftone texture */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(circle, #f5ead6 0.5px, transparent 0.5px)`, backgroundSize: '5px 5px' }}
            />

            <div className="max-w-[1600px] mx-auto px-6 md:px-16 pt-16 pb-8 relative z-10">

                {/* Top: Brand + Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-16 border-b-2 border-[#f5ead6]/10">

                    {/* Brand Column */}
                    <div className="md:col-span-5 space-y-5">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="AniVault" className="w-10 h-10 object-contain invert brightness-200" />
                            <h2 className="font-editorial text-4xl md:text-5xl uppercase tracking-tighter">ANIVAULT</h2>
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest text-[#f5ead6]/40 leading-relaxed max-w-md">
                            Твой персональный аниме-хаб — каталог, просмотр и коллекция в одном месте.
                            Более 23,000 тайтлов с актуальными данными.
                        </p>
                        <div className="w-16 h-1 bg-[#b83a2d]" />
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {/* Discover */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b83a2d]">Навигация</h4>
                            <ul className="space-y-2.5">
                                {[
                                    { name: 'Каталог', path: '/catalog' },
                                    { name: 'Коллекция', path: '/collection' },
                                    { name: 'Случайное', path: '/random' },
                                ].map(item => (
                                    <li key={item.name}>
                                        <Link href={item.path} className="text-sm font-bold uppercase tracking-wider text-[#f5ead6]/60 hover:text-[#b83a2d] transition-colors">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Info */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b83a2d]">Информация</h4>
                            <ul className="space-y-2.5">
                                {[
                                    { name: 'О проекте', path: '/about' },
                                    { name: 'Конфиденциальность', path: '/privacy' },
                                    { name: 'Условия', path: '/terms' },
                                ].map(item => (
                                    <li key={item.name}>
                                        <Link href={item.path} className="text-sm font-bold uppercase tracking-wider text-[#f5ead6]/60 hover:text-[#b83a2d] transition-colors">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Community */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b83a2d]">Сообщество</h4>
                            <ul className="space-y-2.5">
                                <li>
                                    <a href="https://t.me/" target="_blank" rel="noopener noreferrer"
                                        className="text-sm font-bold uppercase tracking-wider text-[#f5ead6]/60 hover:text-[#b83a2d] transition-colors flex items-center gap-2">
                                        <Send size={12} /> Telegram
                                    </a>
                                </li>
                            </ul>

                            {/* Anime count badge */}
                            <div className="mt-6 p-3 border-2 border-[#f5ead6]/10 bg-[#f5ead6]/[0.03]">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#f5ead6]/30">База данных</p>
                                <p className="font-editorial text-2xl text-[#b83a2d] mt-1">23,462</p>
                                <p className="text-[8px] font-bold uppercase tracking-widest text-[#f5ead6]/25 mt-0.5">тайтлов</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#f5ead6]/25">
                        &copy; 2026 ANIVAULT. Все данные предоставлены Shikimori API.
                    </p>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 border border-[#f5ead6]/10 px-2.5 py-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-[#f5ead6]/40">ONLINE</span>
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-[#f5ead6]/15">v2.0</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
