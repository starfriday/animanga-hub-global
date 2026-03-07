"use client";

import Link from "next/link";
import { Send } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative bg-bg-dark text-cream border-t-8 border-bg-dark pt-12 overflow-hidden z-20">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'var(--background-grid)' }} />

            {/* Marquee Header */}
            <div className="w-full border-y-4 border-bg-dark bg-accent overflow-hidden shadow-[inset_0_4px_15px_-3px_rgba(0,0,0,0.5)]">
                <div className="marquee-track flex py-3 items-center">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center text-cream font-editorial text-2xl uppercase tracking-widest whitespace-nowrap">
                            <span className="mx-8 font-black">СИСТЕМА ОБНОВЛЕНА: АНИМЕ-ХАБ 2.0 ЗАПУЩЕН</span>
                            <span className="w-4 h-4 bg-bg-dark border-2 border-cream rotate-45" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                    {/* Left Column (Brand & Massive Logo) */}
                    <div className="lg:col-span-6 flex flex-col justify-between border-4 border-secondary-muted p-8 bg-dark-layer shadow-solid-lg">
                        <div className="mb-12">
                            <h2 className="font-editorial text-7xl md:text-9xl uppercase tracking-tighter leading-none text-cream mix-blend-difference mb-4 group cursor-default">
                                <span className="block group-hover:text-accent transition-colors">ANI</span>
                                <span className="block text-border-light group-hover:text-accent transition-colors">VAULT</span>
                            </h2>
                            <p className="font-mono text-xs uppercase tracking-widest text-secondary max-w-sm leading-relaxed border-l-4 border-accent pl-4">
                                Премиальный аниме-хаб. Отборная коллекция, динамичный просмотр и живое сообщество. Создан для 2026 года.
                            </p>
                        </div>

                        <div className="flex items-center gap-6 mt-auto">
                            <div className="flex flex-col border-2 border-secondary-muted p-4 bg-bg-dark w-full max-w-[200px]">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-1">БАЗА ДАННЫХ</span>
                                <span className="font-editorial text-4xl text-accent">23,462</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Columns (Links & Info) */}
                    <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
                        {/* Navigation */}
                        <div className="flex flex-col border-l-4 border-secondary-muted pl-6">
                            <h4 className="font-editorial text-xl uppercase tracking-widest text-accent mb-6 bg-white text-bg-dark px-2 py-1 select-none w-fit">НАВИГАЦИЯ</h4>
                            <ul className="space-y-4">
                                {[
                                    { name: 'КАТАЛОГ', path: '/catalog' },
                                    { name: 'КОЛЛЕКЦИЯ', path: '/collection' },
                                    { name: 'СЛУЧАЙНОЕ', path: '/random' },
                                ].map(item => (
                                    <li key={item.name}>
                                        <Link href={item.path} className="group relative font-sans font-bold uppercase tracking-wider text-cream hover:text-accent transition-colors inline-block text-sm">
                                            <span>{item.name}</span>
                                            <span className="absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:-left-6 transition-all">
                                                <div className="w-2 h-2 bg-accent rotate-45" />
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div className="flex flex-col border-l-4 border-secondary-muted pl-6">
                            <h4 className="font-editorial text-xl uppercase tracking-widest text-accent mb-6 bg-white text-bg-dark px-2 py-1 select-none w-fit">ИНФОРМАЦИЯ</h4>
                            <ul className="space-y-4">
                                {[
                                    { name: 'О ПРОЕКТЕ', path: '/about' },
                                    { name: 'КОНФИДЕНЦИАЛЬНОСТЬ', path: '/privacy' },
                                    { name: 'УСЛОВИЯ', path: '/terms' },
                                ].map(item => (
                                    <li key={item.name}>
                                        <Link href={item.path} className="group relative flex items-center font-sans font-bold uppercase tracking-wider text-secondary-muted hover:text-cream transition-colors text-sm">
                                            <span className="group-hover:translate-x-2 transition-transform">{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Network */}
                        <div className="flex flex-col border-l-4 border-secondary-muted pl-6 col-span-2 md:col-span-1 border-t-4 md:border-t-0 pt-8 md:pt-0">
                            <h4 className="font-editorial text-xl uppercase tracking-widest text-accent mb-6 bg-white text-bg-dark px-2 py-1 select-none w-fit">СООБЩЕСТВО</h4>
                            <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 p-4 border-2 border-secondary-muted hover:border-accent hover:bg-accent hover:text-white transition-all w-fit">
                                <Send size={20} className="group-hover:animate-bounce-slow" />
                                <span className="font-editorial text-xl uppercase tracking-wider">ТЕЛЕГРАМ</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t-8 border-bg-dark flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="font-mono text-[10px] md:text-sm uppercase tracking-[0.2em] text-secondary">
                        &copy; 2026 ANIVAULT GLOBAL. <span className="text-secondary-muted">ДАННЫЕ ПРЕДОСТАВЛЕНЫ SHIKIMORI API.</span>
                    </p>

                    <div className="flex items-center gap-4 bg-bg-dark p-2 border-2 border-secondary-muted">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green shadow-[0_0_10px_var(--color-green)] animate-pulseHard" />
                            <span className="font-mono text-xs uppercase tracking-widest text-cream">СИС.ОНЛАЙН</span>
                        </div>
                        <span className="text-secondary-muted">|</span>
                        <span className="font-mono text-xs uppercase tracking-widest text-secondary-muted hover:text-cream transition-colors cursor-crosshair">v2.0.0-rc1</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
