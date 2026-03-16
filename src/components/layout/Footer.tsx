"use client";

import Link from "next/link";
import { Send, Twitter, Youtube, Github } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-bg-dark text-white pt-16 pb-8 border-t border-white/10">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-5 flex flex-col">
                        <Link href="/" className="flex items-center gap-3 outline-none group mb-6 w-fit">
                            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-105 transition-transform">
                                <span className="text-white font-bold text-2xl leading-none">A</span>
                            </div>
                            <span className="font-black tracking-tight text-3xl text-white">
                                ANIVAULT
                            </span>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-8">
                            Премиальный аниме-хаб нового поколения. Отборная коллекция, удобный просмотр и живое сообщество.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            <a href="https://t.me/anivault" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-accent hover:bg-accent/10 transition-colors">
                                <Send size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-accent hover:bg-accent/10 transition-colors" aria-label="Twitter">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-accent hover:bg-accent/10 transition-colors" aria-label="YouTube">
                                <Youtube size={18} />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-accent hover:bg-accent/10 transition-colors">
                                <Github size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Навигация</h4>
                            <ul className="space-y-4">
                                {[
                                    { label: 'Каталог', href: '/catalog' },
                                    { label: 'Коллекции', href: '/collections' },
                                    { label: 'Онгоинги', href: '/catalog?status=ongoing' },
                                    { label: 'Случайное', href: '/random' },
                                ].map(link => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-white/60 hover:text-accent text-sm font-medium transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Аккаунт</h4>
                            <ul className="space-y-4">
                                {[
                                    { label: 'Профиль', href: '/profile' },
                                    { label: 'Избранное', href: '/profile' },
                                    { label: 'История просмотров', href: '/profile' },
                                    { label: 'Настройки', href: '/profile' },
                                ].map(link => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-white/60 hover:text-accent text-sm font-medium transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Legal Info */}
                    <div className="lg:col-span-3">
                        <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Информация</h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'О проекте', href: '/about' },
                                { label: 'Пользовательское соглашение', href: '/terms' },
                                { label: 'Политика конфиденциальности', href: '/privacy' },
                                { label: 'Правообладателям', href: '/about' },
                            ].map(link => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-white/60 hover:text-white text-sm font-medium transition-colors relative group inline-flex items-center">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/40 text-xs font-medium">
                        &copy; 2026 AniVault. Все права защищены.
                    </p>

                    <div className="flex items-center gap-6 text-xs text-white/40 font-medium">
                        <span className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Системы в норме
                        </span>
                        <span>Shikimori API Integrated</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
