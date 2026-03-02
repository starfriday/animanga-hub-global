"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ShikiTextProps {
    text: string;
    className?: string;
}

export const ShikiText: React.FC<ShikiTextProps> = ({ text, className }) => {
    if (!text) return null;

    // 1. First, handle BBCode tags by replacing them with a custom split pattern
    // Tags supported: [i], [b], [u], [character=id], [anime=id], [manga=id], [spoiler], ||spoiler||

    // Regex to match BBCode tags and spoilers
    // ||spoiler|| or [tag=val]content[/tag] or [tag]content[/tag]
    const regex = /(\|\|.*?\|\||\[i\].*?\[\/i\]|\[b\].*?\[\/b\]|\[u\].*?\[\/u\]|\[character=\d+\].*?\[\/character\]|\[anime=\d+\].*?\[\/anime\]|\[manga=\d+\].*?\[\/manga\]|\[spoiler\].*?\[\/spoiler\])/g;

    const parts = text.split(regex);

    return (
        <span className={cn("whitespace-pre-wrap inline-block", className)}>
            {parts.map((part, index) => {
                // BBCode: [i]...[/i]
                if (part.startsWith('[i]') && part.endsWith('[/i]')) {
                    return <i key={index} className="italic">{part.slice(3, -4)}</i>;
                }

                // BBCode: [b]...[/b]
                if (part.startsWith('[b]') && part.endsWith('[/b]')) {
                    return <b key={index} className="font-bold">{part.slice(3, -4)}</b>;
                }

                // BBCode: [u]...[/u]
                if (part.startsWith('[u]') && part.endsWith('[/u]')) {
                    return <u key={index} className="underline">{part.slice(3, -4)}</u>;
                }

                // Shikimori: [character=123]Name[/character]
                if (part.startsWith('[character=')) {
                    const match = part.match(/\[character=(\d+)\](.*?)\[\/character\]/);
                    if (match) {
                        const id = match[1];
                        const name = match[2];
                        return (
                            <a
                                key={index}
                                href={`https://shikimori.one/characters/${id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline font-bold transition-all inline-flex items-center gap-1"
                            >
                                {name}
                            </a>
                        );
                    }
                }

                // Shikimori: [anime=123]Name[/anime]
                if (part.startsWith('[anime=')) {
                    const match = part.match(/\[anime=(\d+)\](.*?)\[\/anime\]/);
                    if (match) {
                        const id = match[1];
                        const name = match[2];
                        return (
                            <a
                                key={index}
                                href={`https://shikimori.one/animes/${id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline font-bold"
                            >
                                {name}
                            </a>
                        );
                    }
                }

                // Shikimori: [manga=123]Name[/manga]
                if (part.startsWith('[manga=')) {
                    const match = part.match(/\[manga=(\d+)\](.*?)\[\/manga\]/);
                    if (match) {
                        const id = match[1];
                        const name = match[2];
                        return (
                            <a
                                key={index}
                                href={`https://shikimori.one/mangas/${id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline font-bold"
                            >
                                {name}
                            </a>
                        );
                    }
                }

                // Spoilers: ||text|| or [spoiler]text[/spoiler]
                if ((part.startsWith('||') && part.endsWith('||')) || (part.startsWith('[spoiler]') && part.endsWith('[/spoiler]'))) {
                    const content = part.startsWith('||') ? part.slice(2, -2) : part.slice(9, -10);
                    return <SpoilerItem key={index} content={content} />;
                }

                // Plain text
                return <span key={index}>{part}</span>;
            })}
        </span>
    );
};

const SpoilerItem: React.FC<{ content: string }> = ({ content }) => {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <span
            onClick={(e) => {
                e.stopPropagation();
                setIsRevealed(!isRevealed);
            }}
            className={cn(
                "cursor-pointer px-1 rounded transition-all duration-300 select-none mx-0.5",
                isRevealed
                    ? "bg-red-500/10 text-red-500"
                    : "bg-current text-transparent blur-[4px] hover:blur-[2px] opacity-50"
            )}
            title={isRevealed ? "Скрыть спойлер" : "Нажмите, чтобы увидеть спойлер"}
        >
            {content}
        </span>
    );
};
