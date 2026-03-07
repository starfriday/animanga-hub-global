export const MOCK_ARTICLE_TITLES = [
    "ВОЗРОЖДЕНИЕ МЕХИ: ПОЧЕМУ ОГРОМНЫЕ РОБОТЫ ВСЕ ЕЩЕ ВАЖНЫ",
    "ВНУТРИ РАЗУМА МАСТЕРА АНИМАЦИИ",
    "ЗАБЫТЫЕ АРХИВЫ OVA",
    "КИБЕРПАНК-ВИЗУАЛ В АНИМЕ КОНЦА 90-Х",
    "ДЕКОНСТРУКЦИЯ ГЛАВНОГО ГЕРОЯ СЁНЕНА",
];

export interface WorldMovie {
    id: string | number;
    name: string;
    russian?: string;
    score?: number;
    aired_on?: string;
    episodes?: number;
    image?: {
        original?: string;
        preview?: string;
    };
}
