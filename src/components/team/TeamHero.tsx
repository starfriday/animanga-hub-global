"use client";

import React from 'react';

export function TeamHero() {
    return (
        <section className="relative w-full pt-20 pb-16 lg:pt-32 lg:pb-24 px-6 lg:px-12 flex justify-center">
            <div className="max-w-[1600px] w-full flex flex-col items-center">

                {/* Elegant Title */}
                <div className="w-full text-center lg:text-left mb-16 relative">
                    <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                        <div className="w-12 h-1.5 rounded-full bg-accent" />
                        <span className="text-accent font-bold uppercase tracking-widest text-sm">
                            AniVault 2026
                        </span>
                    </div>

                    <h1 className="font-black text-6xl md:text-8xl lg:text-[7.5rem] tracking-tight leading-[0.9] text-bg-dark break-words">
                        Команда <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/80">&</span><br className="lg:hidden" />
                        <span className="lg:ml-6">Сообщество</span>
                    </h1>
                </div>

                {/* Glassmorphic Manifesto Cards Grid */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">

                    {/* Main Quote Card */}
                    <div className="lg:col-span-8 flex flex-col justify-center bg-white/60 backdrop-blur-xl border border-bg-dark/5 p-10 lg:p-16 rounded-[2.5rem] shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500">
                        <p className="text-2xl lg:text-4xl text-bg-dark leading-snug font-bold tracking-tight">
                            "Мы не просто платформа. Мы — огромный архив, уютный кинотеатр и живое сообщество, созданное фанатами для фанатов."
                        </p>
                    </div>

                    {/* Mission Statement Card */}
                    <div className="lg:col-span-4 flex flex-col bg-bg-dark text-bg-cream border border-bg-dark/10 p-10 lg:p-12 rounded-[2.5rem] shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group">

                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative z-10 h-full flex flex-col">
                            <h3 className="font-black text-xl uppercase tracking-widest border-b border-bg-cream/20 pb-4 mb-6">Наша Миссия</h3>
                            <p className="font-medium text-base lg:text-lg leading-relaxed text-bg-cream/90 flex-grow">
                                AniVault был создан, чтобы преодолеть разрыв между эстетикой и бескомпромиссной функциональностью.
                            </p>
                            <p className="font-medium text-base lg:text-lg leading-relaxed text-bg-cream/60 mt-4">
                                Мы открываем миру лучшую японскую анимацию, тщательно каталогизируя ее с абсолютной точностью.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
