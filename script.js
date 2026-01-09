// script.js - Katalog va umumiy mantiq
let currentPage = 1;
const itemsPerPage = 12;
let allProducts = [];
let filteredProducts = [];

const API_URL = "http://localhost:3000/api";

// 1. Kirish tekshiruvi
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('krist_user'));
    if (!user && !window.location.pathname.includes('register.html')) window.location.href = 'register.html';
}
checkAuth();

function formatCurrency(amount) {
    return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
}

window.toggleTheme = () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = document.getElementById('themeIcon');
    if(icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
};

window.setLanguage = (lang) => {
    localStorage.setItem('selectedLang', lang);
    const translations = {
        uz: {
            "nav-home": "Bosh sahifa", "nav-shop": "Katalog", "nav-story": "Biz haqimizda", "nav-contact": "Aloqa",
            "hero-sub": "Tabiiy va Nafis", "hero-title": "Go'zallik siri sizda", "hero-off": "CHEGIRMA -30%",
            "shop-now": "Sotib olish", "category-title": "Toifalar", "bestseller-title": "Xit mahsulotlar",
            "add-to-cart": "Savatga qo'shish", "footer-info": "Ma'lumotlar",
            "sort-title": "Saralash", "sort-low": "Arzonroq", "sort-high": "Qimmatroq", "sort-new": "Yangi"
        },
        en: {
            "nav-home": "Home", "nav-shop": "Shop", "nav-story": "About Us", "nav-contact": "Contact Us",
            "hero-sub": "Natural & Elegant", "hero-title": "Unveil Your Beauty", "hero-off": "UPTO 30% OFF",
            "shop-now": "Shop Now", "category-title": "Categories", "bestseller-title": "Our Bestsellers",
            "add-to-cart": "Add to Cart", "footer-info": "Information",
            "sort-title": "Sort by", "sort-low": "Price: Low to High", "sort-high": "Price: High to Low", "sort-new": "Newest"
        },
        ru: {
            "nav-home": "Главная", "nav-shop": "Каталог", "nav-story": "О нас", "nav-contact": "Контакты",
            "hero-sub": "Натурально и Изящно", "hero-title": "Секрет красоты у вас", "hero-off": "СКИДКА -30%",
            "shop-now": "Купить", "category-title": "Категории", "bestseller-title": "Хиты продаж",
            "add-to-cart": "В корзину", "footer-info": "Информация",
            "sort-title": "Сортировка", "sort-low": "Дешевле", "sort-high": "Дороже", "sort-new": "Новинки"
        }
    };

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang]?.[key]) el.innerText = translations[lang][key];
    });
    renderPage(currentPage);
};

function renderProducts(data) {
    const grid = document.getElementById('productGrid');
    const lang = localStorage.getItem('selectedLang') || 'uz';
    if (!grid) return;
    grid.innerHTML = data.length === 0 ? '<div style="grid-column: 1/-1; text-align: center; padding: 50px;"><h3>Hech narsa topilmadi</h3></div>' : '';

    const wishlist = JSON.parse(localStorage.getItem('krist_wishlist')) || [];
    const translations = {
        uz: { "add-to-cart": "Savatga qo'shish" },
        en: { "add-to-cart": "Add to Cart" },
        ru: { "add-to-cart": "В корзину" }
    };

    data.forEach(p => {
        const isWished = wishlist.some(item => item.id.toString() === p.id.toString());
        grid.innerHTML += `
            <div class="product-card-krist" data-aos="fade-up">
                <div class="img-container">
                    <img src="${p.image}" alt="${p.name}" onclick="window.location.href='product-detail.html?id=${p.id}'" style="cursor:pointer">
                    <div class="wishlist-btn" onclick="toggleWishlist('${p.id}')" style="position:absolute; top:15px; right:15px; font-size:18px; color:${isWished ? 'red' : '#ccc'}; cursor:pointer; z-index:10;">
                        <i class="${isWished ? 'fas' : 'far'} fa-heart"></i>
                    </div>
                    <div class="add-to-cart-overlay" onclick="addToCart('${p.id}')">${translations[lang]['add-to-cart'] || 'Add'}</div>
                </div>
                <div class="product-info-krist">
                    <h4 onclick="window.location.href='product-detail.html?id=${p.id}'" style="cursor:pointer">${p.name}</h4>
                    <p>${formatCurrency(p.price)}</p>
                </div>
            </div>`;
    });
}

async function loadProductsFromServer() {
    try {
        const res = await fetch(`${API_URL}/products`);
        allProducts = await res.json();
        localStorage.setItem('krist_products', JSON.stringify(allProducts));
        filteredProducts = [...allProducts];
        renderPage(1);
    } catch (err) {
        allProducts = JSON.parse(localStorage.getItem('krist_products')) || [];
        filteredProducts = [...allProducts];
        renderPage(1);
    }
}

window.renderPage = (page) => {
    currentPage = page;
    const start = (page - 1) * itemsPerPage;
    renderProducts(filteredProducts.slice(start, start + itemsPerPage));
    renderPagination();
};

function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const container = document.getElementById('pagination');
    if (container) {
        container.innerHTML = totalPages > 1 ? Array.from({length: totalPages}, (_, i) => `
            <button onclick="renderPage(${i+1})" style="padding:6px 14px; margin:0 3px; border:1px solid #ddd; background:${(i+1) === currentPage ? '#000' : '#fff'}; color:${(i+1) === currentPage ? '#fff' : '#000'}; border-radius:8px; cursor:pointer;">${i+1}</button>
        `).join('') : '';
    }
}

window.sortProducts = (type) => {
    if (type === 'low') filteredProducts.sort((a, b) => a.price - b.price);
    else if (type === 'high') filteredProducts.sort((a, b) => b.price - a.price);
    else if (type === 'new') filteredProducts.sort((a, b) => b.id.toString().localeCompare(a.id.toString()));
    renderPage(1);
};

window.filterByCategory = (cat) => {
    filteredProducts = allProducts.filter(p => p.category === cat);
    renderPage(1);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
};

window.toggleWishlist = (id) => {
    let wishlist = JSON.parse(localStorage.getItem('krist_wishlist')) || [];
    const idx = wishlist.findIndex(p => p.id.toString() === id.toString());
    if (idx > -1) wishlist.splice(idx, 1);
    else wishlist.push(allProducts.find(item => item.id.toString() === id.toString()));
    localStorage.setItem('krist_wishlist', JSON.stringify(wishlist));
    if(document.getElementById('wishCount')) document.getElementById('wishCount').innerText = wishlist.length;
    renderPage(currentPage);
};

document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('themeIcon');
    if(icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    const lang = localStorage.getItem('selectedLang') || 'uz';
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = lang;
        langSelect.addEventListener('change', (e) => window.setLanguage(e.target.value));
    }
    window.setLanguage(lang);

    loadProductsFromServer();

    const sInput = document.getElementById('searchInput');
    if (sInput) {
        sInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(term));
            renderPage(1);
        });
    }

    window.onclick = (e) => { if (e.target.classList.contains('modal')) e.target.style.display = "none"; };
});
