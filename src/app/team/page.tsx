import React from 'react';
import { TeamHero } from '@/components/team/TeamHero';
import { CoreTeamList } from '@/components/team/CoreTeamList';
import { WallOfFame } from '@/components/team/WallOfFame';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Команда | AniVault — Наша команда",
    description: "Познакомьтесь с командой AniVault. Создатели, модераторы и самые активные участники сообщества.",
    openGraph: {
        title: "Команда AniVault",
        description: "Люди, которые стоят за AniVault.",
    },
};

export default function CommunityPage() {
    return (
        <main className="min-h-screen bg-bg-cream text-bg-dark pt-[60px] lg:pt-[72px] relative overflow-hidden selection:bg-accent selection:text-white">
            {/* Ambient Background Blur */}
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0" />
            <div className="absolute top-1/2 left-0 w-[40vw] h-[40vw] bg-accent/5 rounded-full blur-[100px] -translate-y-1/3 -translate-x-1/4 pointer-events-none z-0" />
            <div className="absolute bottom-0 right-1/4 w-[60vw] h-[40vw] bg-accent/5 rounded-full blur-[140px] translate-y-1/2 pointer-events-none z-0" />

            <div className="relative z-10">
                {/* 1. HERO MANIFESTO */}
                <TeamHero />

                {/* 2. THE CORE STAFF */}
                <CoreTeamList />

                {/* 3. WALL OF FAME (Top Users) */}
                <WallOfFame />
            </div>
        </main>
    );
}
