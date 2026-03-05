import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "О проекте | AniVault",
    description: "AniVault — бесплатный аниме-хаб с каталогом из более 23,000 тайтлов, актуальными данными и удобным поиском.",
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#f5ead6]">
            {/* Halftone */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{ backgroundImage: `radial-gradient(circle, #1a1a1a 1px, transparent 1px)`, backgroundSize: '6px 6px' }}
            />

            <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-16 pt-32 pb-24">
                {/* Header */}
                <h1 className="font-editorial text-6xl md:text-8xl uppercase tracking-tighter text-[#1a1411] mb-4"
                    style={{ textShadow: '2px 2px 0 rgba(184,58,45,0.15)' }}>
                    О <span className="text-[#b83a2d]">ПРОЕКТЕ</span>
                </h1>
                <div className="w-16 h-1 bg-[#b83a2d] mb-12" />

                {/* Content */}
                <div className="space-y-10">
                    <section className="bg-[#f0e4cc] border-2 border-[#1a1411]/15 p-6 md:p-8 shadow-[4px_4px_0_rgba(26,20,17,0.15)]">
                        <h2 className="font-editorial text-2xl uppercase tracking-wider text-[#b83a2d] mb-4">Что такое AniVault?</h2>
                        <p className="text-sm md:text-base text-[#1a1411]/70 leading-relaxed font-medium">
                            AniVault — это бесплатный аниме-хаб, созданный фанатами для фанатов. Наша цель — предоставить удобный доступ
                            к огромному каталогу аниме с актуальными данными, рейтингами и описаниями. Мы объединяем информацию из различных
                            источников, чтобы вы могли найти идеальное аниме для просмотра.
                        </p>
                    </section>

                    <section className="bg-[#f0e4cc] border-2 border-[#1a1411]/15 p-6 md:p-8 shadow-[4px_4px_0_rgba(26,20,17,0.15)]">
                        <h2 className="font-editorial text-2xl uppercase tracking-wider text-[#b83a2d] mb-4">Наша база данных</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {[
                                { num: '23,462', label: 'Тайтлов' },
                                { num: '470+', label: 'Жанров и тем' },
                                { num: '24/7', label: 'Доступность' },
                                { num: '∞', label: 'Бесплатно' },
                            ].map(s => (
                                <div key={s.label} className="text-center p-4 border-2 border-[#1a1411]/10">
                                    <p className="font-editorial text-3xl text-[#b83a2d]">{s.num}</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#1a1411]/40 mt-1">{s.label}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-[#1a1411]/60 leading-relaxed font-medium">
                            Данные об аниме предоставлены API Shikimori — крупнейшего русскоязычного аниме-сообщества.
                            База обновляется автоматически, обеспечивая актуальность информации.
                        </p>
                    </section>

                    <section className="bg-[#f0e4cc] border-2 border-[#1a1411]/15 p-6 md:p-8 shadow-[4px_4px_0_rgba(26,20,17,0.15)]">
                        <h2 className="font-editorial text-2xl uppercase tracking-wider text-[#b83a2d] mb-4">Технологии</h2>
                        <div className="flex flex-wrap gap-2">
                            {['Next.js', 'React', 'Prisma', 'MySQL', 'Shikimori API', 'Kodik API', 'TypeScript', 'Tailwind CSS'].map(t => (
                                <span key={t} className="bg-[#1a1411] text-[#f5ead6] text-[10px] font-black uppercase tracking-wider px-3 py-1.5">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </section>

                    <section className="bg-[#f0e4cc] border-2 border-[#1a1411]/15 p-6 md:p-8 shadow-[4px_4px_0_rgba(26,20,17,0.15)]">
                        <h2 className="font-editorial text-2xl uppercase tracking-wider text-[#b83a2d] mb-4">Правовая информация</h2>
                        <p className="text-sm text-[#1a1411]/60 leading-relaxed font-medium">
                            AniVault не хранит и не распространяет видеоконтент. Все видеоматериалы предоставлены сторонними сервисами.
                            Все права на аниме принадлежат их правообладателям. Сайт создан исключительно в информационных целях.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
