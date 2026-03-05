'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global error:', error);
    }, [error]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-bg-cream text-bg-dark relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="gridErr" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--color-bg-dark)" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#gridErr)" />
                </svg>
            </div>

            <div className="relative z-10 text-center px-6 max-w-xl">
                <div className="font-editorial text-[8rem] sm:text-[10rem] leading-none text-accent/10 select-none tracking-tighter">
                    エラー
                </div>

                <div className="inline-flex items-center gap-3 border-4 border-accent px-6 py-3 -mt-12 mb-8 bg-white shadow-[6px_6px_0_var(--color-bg-dark)] relative">
                    <div className="w-3 h-3 bg-accent" />
                    <span className="font-black uppercase tracking-[0.3em] text-xs text-accent">
                        ПРОИЗОШЛА ОШИБКА
                    </span>
                </div>

                <h1 className="font-editorial text-4xl sm:text-5xl uppercase tracking-tighter leading-[0.85] mt-6 mb-4">
                    Что-то пошло<br />
                    <span className="text-accent">не так</span>
                </h1>

                <p className="font-serif text-bg-dark/60 leading-relaxed mb-10 text-sm sm:text-base border-l-4 border-accent pl-5 text-left mx-auto max-w-sm">
                    Произошла непредвиденная ошибка. Попробуйте обновить страницу
                    или вернуться на главную.
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="flex items-center gap-3 bg-accent text-cream px-8 py-4 font-black uppercase tracking-widest text-xs border-2 border-bg-dark shadow-[4px_4px_0_var(--color-bg-dark)] hover:shadow-[2px_2px_0_var(--color-bg-dark)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                    >
                        Попробовать снова
                    </button>
                    <Link
                        href="/"
                        className="flex items-center gap-3 bg-white text-bg-dark px-8 py-4 font-black uppercase tracking-widest text-xs border-2 border-bg-dark shadow-[4px_4px_0_var(--color-bg-dark)] hover:shadow-[2px_2px_0_var(--color-bg-dark)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                    >
                        На главную
                    </Link>
                </div>
            </div>
        </main>
    );
}
