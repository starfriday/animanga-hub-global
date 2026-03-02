"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Users, ArrowRight, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export const CommunitySpotlight = () => {
    const { ref: sectionRef, isVisible } = useScrollReveal(0.1);

    const activeTopics = [
        { id: '1', title: 'Solo Leveling Ending Analysis', authorName: 'HunterX', replies: 142, tags: ['DISCUSSION'] },
        { id: '2', title: 'Jujutsu Kaisen S2 Theories', authorName: 'Nanami', replies: 89, tags: ['THEORY'] },
        { id: '3', title: 'Re:Zero Season 3 Announcement!', authorName: 'EmiliaFan', replies: 315, tags: ['NEWS'] }
    ];

    const activeUsers = [
        { name: "HunterX", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HunterX" },
        { name: "Nanami", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nanami" },
        { name: "EmiliaFan", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=EmiliaFan" },
        { name: "Satoru", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Satoru" },
    ];

    return (
        <section ref={sectionRef} className="relative w-full bg-accent text-cream border-t-4 border-bg-dark pt-24 pb-32 overflow-hidden">

            {/* BACKGROUND EDITORIAL TOUCHES */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                            <line x1="0" y1="0" x2="0" y2="10" stroke="var(--color-bg-dark)" strokeWidth="2" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#diagonalHatch)" />
                </svg>
            </div>

            <div className="max-w-[1800px] mx-auto px-6 lg:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">

                    {/* LEFT COLUMN: TITLE & ABOUT */}
                    <div className={cn("w-full lg:w-5/12", isVisible ? "animate-fade-in-up" : "opacity-0")}>
                        <div className="mb-8">
                            <h2 className="font-editorial text-[8rem] lg:text-[12rem] leading-[0.7] text-bg-dark opacity-40 uppercase tracking-tighter mix-blend-multiply mb-0 -ml-2">
                                CLUB
                            </h2>
                            <h3 className="font-editorial text-5xl lg:text-7xl leading-none text-cream uppercase tracking-tight -mt-4 mb-8">
                                The Inner<br />Circle
                            </h3>
                            <p className="font-serif text-lg leading-relaxed font-semibold max-w-sm border-l-4 border-bg-dark pl-6">
                                The Garden is a corner of the internet where art, community, and culture fuse to create magic. Join Anime fans from around the world.
                            </p>
                        </div>

                        {/* Roster / Online Users */}
                        <div className="bg-bg-dark text-cream p-8 mt-12 transform -rotate-1 shadow-[8px_8px_0_var(--color-cream)] border-4 border-cream w-fit relative group">
                            <div className="absolute top-0 right-0 bg-accent text-cream px-3 py-1 font-bold textxs transform translate-x-4 -translate-y-4 shadow-md rotate-6">
                                LIVE
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="font-editorial text-3xl uppercase">Currently Active</span>
                            </div>
                            <div className="flex -space-x-4">
                                {activeUsers.map((u, i) => (
                                    <div key={i} className="w-14 h-14 rounded-full border-4 border-bg-dark overflow-hidden relative group-hover:scale-110 transition-transform bg-cream" style={{ zIndex: 10 - i }}>
                                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-14 h-14 rounded-full border-4 border-bg-dark bg-cream flex items-center justify-center font-editorial text-2xl text-bg-dark z-0 transition-transform group-hover:translate-x-4">
                                    +42
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: DISCUSSIONS GRID */}
                    <div className={cn("w-full lg:w-7/12 flex flex-col justify-end", isVisible ? "animate-fade-in" : "opacity-0")} style={{ animationDelay: '0.2s' }}>
                        <div className="flex justify-between items-end mb-8 border-b-4 border-bg-dark/20 pb-4">
                            <span className="font-bold uppercase tracking-widest textxs text-bg-dark mix-blend-multiply">Latest Intel</span>
                            <Link href="/forum" className="font-bold uppercase tracking-widest textxs flex items-center gap-1 hover:text-bg-dark transition-colors">
                                View Forum <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="grid gap-6">
                            {activeTopics.map((topic, i) => (
                                <Link
                                    key={topic.id}
                                    href={`/forum/${topic.id}`}
                                    className="block p-6 sm:p-8 bg-cream text-bg-dark border-4 border-bg-dark shadow-[4px_4px_0_var(--color-bg-dark)] hover:shadow-[12px_12px_0_var(--color-bg-dark)] hover:-translate-y-1 transition-all group"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                                        <div className="flex gap-2">
                                            {topic.tags.map(tag => (
                                                <span key={tag} className="bg-accent text-cream px-2 py-0.5 font-bold text-[10px] uppercase tracking-widest text-white">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="font-bold uppercase tracking-widest text-[10px] text-secondary-muted flex items-center gap-1">
                                            <MessageSquare size={12} className="text-accent" /> {topic.replies} Replies
                                        </div>
                                    </div>

                                    <h4 className="font-editorial text-2xl sm:text-3xl uppercase leading-[0.9] tracking-tight group-hover:text-accent transition-colors mb-4">
                                        {topic.title}
                                    </h4>

                                    <div className="text-xs font-bold font-serif italic text-secondary-muted">
                                        by {topic.authorName}
                                    </div>
                                </Link>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};
