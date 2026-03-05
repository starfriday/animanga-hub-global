import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Условия использования | AniVault",
    description: "Условия использования сервиса AniVault.",
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#f5ead6]">
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{ backgroundImage: `radial-gradient(circle, #1a1a1a 1px, transparent 1px)`, backgroundSize: '6px 6px' }}
            />

            <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-16 pt-32 pb-24">
                <h1 className="font-editorial text-6xl md:text-8xl uppercase tracking-tighter text-[#1a1411] mb-4"
                    style={{ textShadow: '2px 2px 0 rgba(184,58,45,0.15)' }}>
                    <span className="text-[#b83a2d]">УСЛОВИЯ</span>
                </h1>
                <div className="w-16 h-1 bg-[#b83a2d] mb-12" />

                <div className="space-y-8">
                    {[
                        {
                            title: '1. Общие положения',
                            text: 'Используя сервис AniVault, вы соглашаетесь с настоящими условиями. AniVault предоставляет информационный сервис для поиска и каталогизации аниме. Сервис является бесплатным и не требует обязательной регистрации для базового использования.'
                        },
                        {
                            title: '2. Контент',
                            text: 'AniVault не является правообладателем представленных аниме-произведений. Все права на аниме, изображения и описания принадлежат их законным правообладателям. Информация предоставлена через открытые API (Shikimori, Kodik) в рамках условий их использования.'
                        },
                        {
                            title: '3. Видеоконтент',
                            text: 'AniVault не хранит видеофайлы на своих серверах. Видеоплееры предоставлены сторонним сервисом Kodik и загружаются напрямую с их серверов. За содержание и доступность видеоматериалов ответственность несёт Kodik.'
                        },
                        {
                            title: '4. Учётные записи',
                            text: 'При регистрации вы обязуетесь предоставить достоверную информацию. Вы несёте ответственность за сохранность своих учётных данных и за все действия, совершённые от имени вашей учётной записи.'
                        },
                        {
                            title: '5. Запрещённые действия',
                            text: 'Запрещается: использовать автоматизированные средства для массового сбора данных с сайта; пытаться получить несанкционированный доступ к серверам; размещать вредоносный контент; нарушать работу сервиса любым способом.'
                        },
                        {
                            title: '6. Ограничение ответственности',
                            text: 'AniVault предоставляется «как есть» без каких-либо гарантий. Мы не несём ответственности за временную недоступность сервиса, потерю данных пользователя или действия сторонних сервисов.'
                        },
                        {
                            title: '7. Изменения условий',
                            text: 'Мы оставляем за собой право изменять настоящие условия. Актуальная версия всегда доступна на этой странице. Продолжение использования сервиса после изменений означает согласие с обновлёнными условиями.'
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
