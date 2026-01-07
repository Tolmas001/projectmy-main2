
const translations = {
    en: {
        nav_shop: "Shop",
        nav_collections: "Collections",
        nav_philosophy: "Philosophy",
        nav_about: "About",
        hero_new: "New Collection 2026",
        hero_title: "Beauty In Simplicity",
        hero_desc: "Experience the pure essence of nature with our dermatologically tested, organic skincare routine.",
        hero_cta: "Shop Now",
        hero_story: "Our Story",
        hero_feat1: "Natural Ingredients",
        hero_feat2: "Cruelty Free",
        hero_feat3: "Deep Hydration",
        shop_title: "Best Sellers",
        shop_subtitle: "Our Shop",
        shop_all: "All",
        shop_face: "Face",
        shop_body: "Body",
        product_add: "Quick Add",
        footer_desc: "We believe in the power of nature and the beauty of simplicity.",
        footer_discover: "Discover",
        footer_support: "Support"
    },
    uz: {
        nav_shop: "Do'kon",
        nav_collections: "To'plamlar",
        nav_philosophy: "Falsafamiz",
        nav_about: "Haqimizda",
        hero_new: "Yangi To'plam 2026",
        hero_title: "Go'zallik Soddalikda",
        hero_desc: "Tabiatning sof mohiyatini bizning dermatologik sinovdan o'tgan, organik terini parvarish qilish tartibimiz bilan his qiling.",
        hero_cta: "Sotib olish",
        hero_story: "Biz haqimizda",
        hero_feat1: "Tabiiy ingredientlar",
        hero_feat2: "Sinovlarsiz (Cruelty Free)",
        hero_feat3: "Chuqur namlantirish",
        shop_title: "Eng xaridorgir",
        shop_subtitle: "Bizning do'kon",
        shop_all: "Hammasi",
        shop_face: "Yuz uchun",
        shop_body: "Beden uchun",
        product_add: "Savatga",
        footer_desc: "Biz tabiat kuchiga va soddalik go'zalligiga ishonamiz.",
        footer_discover: "Kashf qiling",
        footer_support: "Yordam"
    },
    ru: {
        nav_shop: "Магазин",
        nav_collections: "Коллекции",
        nav_philosophy: "Философия",
        nav_about: "О нас",
        hero_new: "Новая Коллекция 2026",
        hero_title: "Красота в Простоте",
        hero_desc: "Почувствуйте истинную сущность природы с нашими дерматологически протестированными органическими средствами.",
        hero_cta: "Купить Сейчас",
        hero_story: "Наша История",
        hero_feat1: "Натуральные компоненты",
        hero_feat2: "Не тестируется на животных",
        hero_feat3: "Глубокое увлажнение",
        shop_title: "Хиты продаж",
        shop_subtitle: "Наш магазин",
        shop_all: "Все",
        shop_face: "Для лица",
        shop_body: "Для тела",
        product_add: "В корзину",
        footer_desc: "Мы верим в силу природы и красоту простоты.",
        footer_discover: "Узнать больше",
        footer_support: "Поддержка"
    }
};

function setLanguage(lang) {
    localStorage.setItem('selectedLanguage', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    // Update active state in UI
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('text-accent', btn.getAttribute('data-lang') === lang);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    setLanguage(savedLang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
});
