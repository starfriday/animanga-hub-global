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
        <main className="min-h-screen bg-bg-cream text-bg-dark pt-[60px] lg:pt-[72px] relative overflow-hidden">
            {/* Global grid background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-5 MixBlendMultiply">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs><pattern id="gridbg-team" width="32" height="32" patternUnits="userSpaceOnUse"><rect width="32" height="32" fill="none" stroke="var(--color-bg-dark)" strokeWidth="0.5" /></pattern></defs>
                    <rect width="100%" height="100%" fill="url(#gridbg-team)" />
                </svg>
            </div>

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
