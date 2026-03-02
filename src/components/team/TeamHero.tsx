"use client";

import React from 'react';

export function TeamHero() {
    return (
        <section className="relative w-full pt-16 pb-12 lg:pt-24 lg:pb-20 px-4 lg:px-12 flex justify-center border-b-8 border-bg-dark">
            <div className="max-w-[1600px] w-full flex flex-col items-center">

                {/* Massive Title */}
                <div className="w-full text-center lg:text-left border-b-4 border-bg-dark pb-6 mb-8 lg:mb-12 relative">
                    <h1 className="font-editorial text-7xl lg:text-[10rem] tracking-tighter leading-[0.8] uppercase text-bg-dark break-words">
                        ОСН<br className="lg:hidden" />
                        <span className="text-accent underline decoration-8 underline-offset-[16px]">ОВА</span>
                    </h1>

                    {/* Decorative sub-elements typical of zine style */}
                    <div className="hidden lg:flex absolute bottom-6 right-0 items-center gap-4 text-bg-dark font-black tracking-widest text-sm uppercase">
                        <span className="bg-[#B83A2D] text-cream px-3 py-1 border-2 border-bg-dark">ОСН. 2026</span>
                        <span>[ МАНИФЕСТ ]</span>
                        <span className="opacity-50">ТОМ 01</span>
                    </div>
                </div>

                {/* Subtext Grid */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

                    {/* Left Quote */}
                    <div className="lg:col-span-8 border-4 border-bg-dark bg-cream p-6 lg:p-10 shadow-[8px_8px_0_var(--color-bg-dark)]">
                        <p className="font-editorial text-2xl lg:text-4xl text-bg-dark leading-snug uppercase tracking-tight">
                            "МЫ НЕ ПРОСТО ПЛАТФОРМА. МЫ — АРХИВ, ТЕАТР И СООБЩЕСТВО, СОЗДАННОЕ ФАНАТАМИ ДЛЯ ФАНАТОВ."
                        </p>
                    </div>

                    {/* Right Mission text */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-[#B83A2D] border-4 border-bg-dark p-6 text-cream shadow-[4px_4px_0_var(--color-bg-dark)]">
                            <h3 className="font-black text-xl uppercase tracking-widest border-b-2 border-cream/30 pb-2 mb-4">НАША МИССИЯ</h3>
                            <p className="font-medium text-sm lg:text-base leading-relaxed opacity-90">
                                AniVault был создан, чтобы преодолеть разрыв между эстетикой и функциональностью.
                                Мы открываем миру лучшую японскую анимацию, тщательно каталогизируя ее с абсолютной точностью.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
