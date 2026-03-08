"use client";

import React from 'react';

// Refined dummy data
const CORE_TEAM = [
    { name: 'KIZURA', role: 'Founder & Lead Dev', img: 'https://xlknusrqbgkbgzvzwdrx.supabase.co/storage/v1/object/public/images/avatars/user-1.jpg', desc: 'Авторитарный архитектор видения AniVault.', color: 'from-[#FF6B6B] to-[#FF8E53]' },
    { name: 'SCARLET', role: 'Head of Localization', img: 'https://xlknusrqbgkbgzvzwdrx.supabase.co/storage/v1/object/public/images/avatars/user-2.jpg', desc: 'Строгое обеспечение лингвистического совершенства.', color: 'from-[#4FACFE] to-[#00F2FE]' },
    { name: 'NEO', role: 'UI/UX Lead', img: 'https://xlknusrqbgkbgzvzwdrx.supabase.co/storage/v1/object/public/images/avatars/user-3.jpg', desc: 'Создание безупречной премиальной эстетики.', color: 'from-[#43E97B] to-[#38F9D7]' },
    { name: 'ZERO', role: 'System Architect', img: 'https://xlknusrqbgkbgzvzwdrx.supabase.co/storage/v1/object/public/images/avatars/user-4.jpg', desc: 'Обеспечение бесперебойной работы серверов.', color: 'from-[#FA709A] to-[#FEE140]' },
];

export function CoreTeamList() {
    return (
        <section className="w-full py-16 lg:py-24 px-6 lg:px-12 relative z-10">
            <div className="max-w-[1600px] w-full mx-auto">

                <div className="flex flex-col items-center mb-16 text-center">
                    <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                        Основатели
                    </span>
                    <h2 className="font-black text-4xl lg:text-5xl tracking-tight text-bg-dark">
                        Создатели Проекта
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {CORE_TEAM.map((member, idx) => (
                        <div key={member.name} className="group relative">
                            {/* Card Content */}
                            <div className="relative z-10 bg-white/50 backdrop-blur-md border border-bg-dark/5 p-8 rounded-[2rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] flex flex-col items-center flex-1 h-full">

                                {/* Avatar */}
                                <div className="relative mb-6">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${member.color} rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300 transform group-hover:scale-110`} />
                                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-md relative overflow-hidden bg-bg-cream z-10">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                            style={{ backgroundImage: `url('https://api.dicebear.com/7.x/notionists/svg?seed=${member.name}&backgroundColor=transparent')` }}
                                        />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-bg-dark font-black text-sm z-20 border border-bg-dark/5">
                                        {idx + 1}
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="w-full text-center flex flex-col items-center flex-1">
                                    <h3 className="font-black text-2xl tracking-tight text-bg-dark mb-2">
                                        {member.name}
                                    </h3>
                                    <div className="text-accent font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-accent/5 border border-accent/10 mb-4 inline-block">
                                        {member.role}
                                    </div>
                                    <p className="font-medium text-sm text-bg-dark/70 leading-relaxed max-w-[250px] mx-auto opacity-80 group-hover:opacity-100 transition-opacity">
                                        {member.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
