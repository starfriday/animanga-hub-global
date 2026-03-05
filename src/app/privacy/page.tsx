import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Политика конфиденциальности | AniVault",
    description: "Политика конфиденциальности AniVault — информация о сборе и обработке данных.",
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#f5ead6]">
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{ backgroundImage: `radial-gradient(circle, #1a1a1a 1px, transparent 1px)`, backgroundSize: '6px 6px' }}
            />

            <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-16 pt-32 pb-24">
                <h1 className="font-editorial text-6xl md:text-8xl uppercase tracking-tighter text-[#1a1411] mb-4"
                    style={{ textShadow: '2px 2px 0 rgba(184,58,45,0.15)' }}>
                    <span className="text-[#b83a2d]">КОНФИДЕН</span>ЦИАЛЬНОСТЬ
                </h1>
                <div className="w-16 h-1 bg-[#b83a2d] mb-12" />

                <div className="space-y-8">
                    {[
                        {
                            title: '1. Сбор информации',
                            text: 'AniVault собирает минимальный объём данных, необходимых для работы сервиса. При регистрации мы сохраняем имя пользователя и адрес электронной почты. Мы не собираем и не передаём персональные данные третьим лицам в коммерческих целях.'
                        },
                        {
                            title: '2. Файлы cookie',
                            text: 'Сайт использует файлы cookie для аутентификации пользователей и сохранения пользовательских предпочтений (тема оформления, язык). Вы можете отключить cookie в настройках браузера, однако это может повлиять на функциональность сервиса.'
                        },
                        {
                            title: '3. Данные о просмотре',
                            text: 'История просмотров и списки избранного хранятся локально в вашем браузере (localStorage) и не передаются на наши серверы без вашего явного согласия.'
                        },
                        {
                            title: '4. Сторонние сервисы',
                            text: 'Для предоставления информации об аниме мы используем API Shikimori и Kodik. Видеоплееры загружаются со сторонних серверов и подчиняются их собственным политикам конфиденциальности.'
                        },
                        {
                            title: '5. Безопасность',
                            text: 'Мы принимаем разумные меры для защиты ваших данных, включая шифрование соединения (HTTPS) и безопасное хранение учётных данных.'
                        },
                        {
                            title: '6. Контакт',
                            text: 'По вопросам конфиденциальности вы можете связаться с нами через Telegram-канал проекта.'
                        },
                    ].map(section => (
                        <section key={section.title} className="bg-[#f0e4cc] border-2 border-[#1a1411]/15 p-6 md:p-8 shadow-[4px_4px_0_rgba(26,20,17,0.15)]">
                            <h2 className="font-editorial text-xl uppercase tracking-wider text-[#b83a2d] mb-3">{section.title}</h2>
                            <p className="text-sm text-[#1a1411]/60 leading-relaxed font-medium">{section.text}</p>
                        </section>
                    ))}
                </div>

                <p className="text-[10px] text-[#1a1411]/30 font-bold uppercase tracking-widest mt-12">
                    Последнее обновление: март 2026
                </p>
            </div>
        </main>
    );
}
