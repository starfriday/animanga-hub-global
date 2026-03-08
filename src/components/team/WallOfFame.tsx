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
        <section className="w-full py-16 lg:py-24 px-6 lg:px-12 relative z-10">
            <div className="max-w-[1200px] w-full mx-auto">

                <div className="flex flex-col items-center mb-16 text-center">
                    <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                        Топ Пользователей
                    </span>
                    <h2 className="font-black text-4xl lg:text-6xl tracking-tight text-bg-dark">
                        Доска Почета
                    </h2>
                </div>

                {/* Elegant List View */}
                <div className="w-full flex flex-col gap-4">

                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-bg-dark/5 text-bg-dark/50 font-bold text-xs tracking-widest uppercase shadow-sm">
                        <div className="col-span-2 lg:col-span-1 text-center">Ранг</div>
                        <div className="col-span-6 lg:col-span-6">Пользователь</div>
                        <div className="col-span-4 lg:col-span-2 text-center">Статус</div>
                        <div className="hidden lg:flex col-span-3 items-center justify-end">Статистика</div>
                    </div>

                    {/* Data Rows */}
                    <div className="flex flex-col gap-3">
                        {TOP_USERS.map((user) => {
                            // Determine visual styles based on rank
                            const isTop3 = user.rank <= 3;
                            const isFirst = user.rank === 1;

                            let rankStyle = "text-bg-dark/40 font-bold";
                            if (isFirst) rankStyle = "text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-yellow-600 font-black drop-shadow-sm";
                            else if (user.rank === 2) rankStyle = "text-transparent bg-clip-text bg-gradient-to-br from-slate-300 to-slate-500 font-black drop-shadow-sm";
                            else if (user.rank === 3) rankStyle = "text-transparent bg-clip-text bg-gradient-to-br from-amber-600 to-amber-800 font-black drop-shadow-sm";

                            return (
                                <div
                                    key={user.name}
                                    className={`
                                        grid grid-cols-12 gap-4 px-8 py-5 items-center 
                                        bg-white/60 backdrop-blur-md rounded-2xl border transition-all duration-300
                                        hover:bg-white/90 hover:shadow-md hover:scale-[1.01] hover:-translate-y-0.5
                                        ${isFirst ? 'border-yellow-400/30' : 'border-bg-dark/5'}
                                    `}
                                >
                                    {/* Rank */}
                                    <div className="col-span-2 lg:col-span-1 flex justify-center">
                                        <span className={`text-2xl lg:text-3xl ${rankStyle}`}>
                                            #{user.rank}
                                        </span>
                                    </div>

                                    {/* User Name */}
                                    <div className="col-span-6 lg:col-span-6 flex items-center gap-5">
                                        <div className={`w-12 h-12 rounded-full relative overflow-hidden shrink-0 hidden sm:block ${isFirst ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-bg-cream' : 'border border-bg-dark/10'}`}>
                                            <div
                                                className="w-full h-full bg-cover bg-center bg-bg-cream"
                                                style={{ backgroundImage: `url('https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}')` }}
                                            />
                                        </div>
                                        <h3 className="font-bold text-xl lg:text-2xl tracking-tight text-bg-dark">
                                            {user.name}
                                        </h3>
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-4 lg:col-span-2 flex justify-center">
                                        <span className={`
                                            font-bold text-[10px] lg:text-xs tracking-widest uppercase px-3 py-1.5 rounded-full border
                                            ${isTop3 ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-bg-dark/5 border-bg-dark/10 text-bg-dark/70'}
                                        `}>
                                            {user.role}
                                        </span>
                                    </div>

                                    {/* Stats */}
                                    <div className="hidden lg:flex col-span-3 justify-end items-center gap-6 font-bold text-sm tracking-wide text-bg-dark/80">
                                        <div className="flex flex-col items-end">
                                            <span className="text-accent">Lv. {user.lvl}</span>
                                            <span className="font-medium text-xs text-bg-dark/50">{user.comments} сообщений</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <button className="bg-bg-dark text-white font-bold text-sm lg:text-base tracking-widest px-8 md:px-10 py-4 lg:py-5 rounded-full shadow-lg shadow-bg-dark/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:scale-95 border border-transparent hover:border-white/10">
                        Присоединиться к Коммьюнити
                    </button>
                </div>

            </div>
        </section>
    );
}
