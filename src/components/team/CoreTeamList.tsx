"use client";

import React from 'react';

// Hardcoded staff content for the Zine design
const CORE_TEAM = [
    { name: 'KIZURA', role: 'ОСНОВАТЕЛЬ И ВЕДУЩИЙ РАЗРАБОТЧИК', img: 'https://xlknusrqbgkbgzvzwdrx.supabase.co/storage/v1/object/public/images/avatars/user-1.jpg', desc: 'Архитектор видения AniVault.' },
    { name: 'SCARLET', role: 'РУКОВОДИТЕЛЬ ПЕРЕВОДА', img: 'https://xlknusrqbgkbgzvzwdrx.supabase.co/storage/v1/object/public/images/avatars/user-2.jpg', desc: 'Обеспечение лингвистического совершенства.' },
    { name: 'NEO', role: 'UI/UX ДИЗАЙНЕР', img: 'https://xlknusrqbgkbgzvzwdrx.supabase.co/storage/v1/object/public/images/avatars/user-3.jpg', desc: 'Создание бруталистической эстетики.' },
    { name: 'ZERO', role: 'СИСТЕМНЫЙ АДМИН', img: 'https://xlknusrqbgkbgzvzwdrx.supabase.co/storage/v1/object/public/images/avatars/user-4.jpg', desc: 'Поддержание работы серверов.' },
];

export function CoreTeamList() {
    return (
        <section className="w-full py-16 lg:py-24 border-b-4 border-bg-dark px-4 lg:px-12">
            <div className="max-w-[1600px] w-full mx-auto">

                <div className="flex items-center gap-6 mb-12">
                    <h2 className="font-editorial text-4xl lg:text-6xl uppercase tracking-tighter text-bg-dark">
                        <span className="text-[#B83A2D]">СОЗДАТЕЛИ</span> ПРОЕКТА
                    </h2>
                    <div className="flex-1 h-2 bg-bg-dark mt-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {CORE_TEAM.map((member, idx) => (
                        <div key={member.name} className="relative group">
                            {/* Backdrop Shadow */}
                            <div className="absolute top-4 left-4 w-full h-full bg-[#B83A2D] border-4 border-bg-dark transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2 z-0" />

                            {/* Card Content */}
                            <div className="relative z-10 bg-cream border-4 border-bg-dark p-6 transition-transform duration-300 group-hover:-translate-x-2 group-hover:-translate-y-2 flex flex-col items-center">

                                {/* Image / Avatar */}
                                <div className="w-full aspect-square border-4 border-bg-dark p-2 bg-bg-dark mb-6 relative overflow-hidden">
                                    {/* Using a placeholder service or default styling if img fails */}
                                    <div className="w-full h-full bg-cream border-2 border-bg-dark relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center grayscale contrast-125 mix-blend-multiply opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                                            style={{ backgroundImage: `url('https://api.dicebear.com/7.x/pixel-art/svg?seed=${member.name}')` }}
                                        />
                                    </div>
                                    <div className="absolute top-0 right-0 bg-[#B83A2D] text-cream font-black text-lg px-3 border-b-4 border-l-4 border-bg-dark z-10">
                                        {String(idx + 1).padStart(2, '0')}
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="w-full text-center">
                                    <h3 className="font-editorial text-3xl uppercase tracking-tighter text-bg-dark mb-2">
                                        {member.name}
                                    </h3>
                                    <div className="bg-bg-dark text-cream font-black uppercase tracking-widest text-xs py-2 px-4 inline-block mb-4 border-2 border-bg-dark">
                                        {member.role}
                                    </div>
                                    <p className="font-medium text-sm opacity-80 border-t-2 border-bg-dark/20 pt-4">
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
