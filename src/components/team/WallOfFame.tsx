"use client";

import React from 'react';

// Hardcoded dummy data for the Wall of Fame leaderboard
const TOP_USERS = [
    { rank: 1, name: 'SHIRO', lvl: 99, role: 'ВЕТЕРАН', comments: 1420 },
    { rank: 2, name: 'KURO', lvl: 84, role: 'УЧАСТНИК', comments: 905 },
    { rank: 3, name: 'AKIRA', lvl: 76, role: 'ПОЛЬЗОВАТЕЛЬ', comments: 812 },
    { rank: 4, name: 'MIA', lvl: 65, role: 'ПОЛЬЗОВАТЕЛЬ', comments: 640 },
    { rank: 5, name: 'ZENN', lvl: 58, role: 'ПОЛЬЗОВАТЕЛЬ', comments: 512 },
];

export function WallOfFame() {
    return (
        <section className="w-full py-16 lg:py-24 px-4 lg:px-12 bg-bg-cream">
            <div className="max-w-[1200px] w-full mx-auto">

                <div className="text-center mb-16">
                    <h2 className="font-editorial text-5xl lg:text-7xl uppercase tracking-tighter text-bg-dark mb-4">
                        ДОСКА <span className="text-[#B83A2D] underline decoration-8 underline-offset-8">ПОЧЕТА</span>
                    </h2>
                    <p className="font-bold text-sm tracking-widest uppercase opacity-60">
                        САМЫЕ АКТИВНЫЕ ГОЛОСА НАШЕГО СООБЩЕСТВА
                    </p>
                </div>

                {/* Printed Leaderboard Table */}
                <div className="w-full border-4 border-bg-dark bg-cream shadow-[12px_12px_0_var(--color-bg-dark)]">

                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-4 p-4 lg:p-6 border-b-4 border-bg-dark bg-bg-dark text-cream font-black text-xs lg:text-sm tracking-widest uppercase">
                        <div className="col-span-2 lg:col-span-1 text-center">РАНГ</div>
                        <div className="col-span-6 lg:col-span-5">ПОЛЬЗОВАТЕЛЬ</div>
                        <div className="col-span-4 lg:col-span-3 text-center">СТАТУС</div>
                        <div className="hidden lg:flex col-span-3 items-center justify-end text-accent">УРОВЕНЬ И СТАТИСТИКА</div>
                    </div>

                    {/* Data Rows */}
                    <div className="flex flex-col">
                        {TOP_USERS.map((user, idx) => (
                            <div key={user.name} className={`grid grid-cols-12 gap-4 p-4 lg:p-6 items-center hover:bg-bg-dark/5 transition-colors ${idx !== TOP_USERS.length - 1 ? 'border-b-2 border-bg-dark/20' : ''}`}>

                                {/* Rank */}
                                <div className="col-span-2 lg:col-span-1 flex justify-center">
                                    <span className={`font-editorial text-3xl lg:text-4xl leading-none ${user.rank <= 3 ? 'text-[#B83A2D]' : 'text-bg-dark opacity-50'}`}>
                                        {String(user.rank).padStart(2, '0')}
                                    </span>
                                </div>

                                {/* User Name */}
                                <div className="col-span-6 lg:col-span-5 flex items-center gap-4">
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 border-2 border-bg-dark bg-accent shrink-0 hidden sm:block">
                                        <div
                                            className="w-full h-full bg-cover bg-center grayscale mix-blend-multiply opacity-80"
                                            style={{ backgroundImage: `url('https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.name}')` }}
                                        />
                                    </div>
                                    <h3 className="font-editorial text-2xl lg:text-3xl uppercase tracking-tighter text-bg-dark">
                                        {user.name}
                                    </h3>
                                </div>

                                {/* Status */}
                                <div className="col-span-4 lg:col-span-3 flex justify-center">
                                    <span className="font-black text-[10px] lg:text-xs tracking-widest uppercase px-3 py-1 border-2 border-bg-dark bg-cream">
                                        {user.role}
                                    </span>
                                </div>

                                {/* Stats */}
                                <div className="hidden lg:flex col-span-3 justify-end items-center gap-6 font-black text-sm uppercase tracking-widest text-[#B83A2D]">
                                    <span>УРОВЕНЬ {user.lvl}</span>
                                    <span className="opacity-50 text-bg-dark text-xs">{user.comments} КОММЕНТ.</span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                <div className="mt-12 text-center">
                    <button className="bg-[#B83A2D] text-cream font-black text-sm lg:text-base uppercase tracking-widest px-8 py-4 border-4 border-bg-dark shadow-[4px_4px_0_var(--color-bg-dark)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all active:scale-95">
                        ВСТУПИТЬ В РЯДЫ
                    </button>
                </div>

            </div>
        </section>
    );
}
