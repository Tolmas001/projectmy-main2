// 1. Pagination va Qidiruv o'zgaruvchilari
let currentPage = 1;
const itemsPerPage = 12;

// Tizimga kirganlikni tekshirish
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('krist_user'));
    const path = window.location.pathname;
    if (!user && !path.includes('register.html')) window.location.href = 'register.html';
}
checkAuth();

const API_URL = "http://localhost:3000/api";

const translations = {
    uz: {
        "nav-home": "Bosh sahifa", "nav-shop": "Katalog", "nav-story": "Biz haqimizda", "nav-blog": "Maslahatlar", "nav-contact": "Aloqa",
        "hero-sub": "Tabiiy va Nafis", "hero-title": "Go'zallik siri sizning qo'lingizda", "hero-off": "HAMMA MAHSULOTLARGA -30%",
        "shop-now": "Sotib olish", "category-title": "Toifalar bo'yicha saralash", "bestseller-title": "Eng ko'p sotilganlar",
        "footer-info": "Ma'lumotlar", "footer-service": "Xizmatlar", "footer-subscribe": "Yangi mahsulotlardan xabardor bo'ling"
    },
    en: {
        "nav-home": "Home", "nav-shop": "Shop", "nav-story": "About Us", "nav-blog": "Beauty Blog", "nav-contact": "Contact Us",
        "hero-sub": "Natural & Elegant", "hero-title": "Unveil Your Natural Beauty", "hero-off": "UPTO 30% OFF ALL PRODUCTS",
        "shop-now": "Shop Now", "category-title": "Shop by Categories", "bestseller-title": "Our Bestsellers",
        "footer-info": "Information", "footer-service": "Service", "footer-subscribe": "Subscribe to Updates"
    },
    ru: {
        "nav-home": "Главная", "nav-shop": "Каталог", "nav-story": "О нас", "nav-blog": "Советы", "nav-contact": "Контакты",
        "hero-sub": "Натурально и Изящно", "hero-title": "Секрет красоты в ваших руках", "hero-off": "СКИДКА -30% НА ВСЁ",
        "shop-now": "Купить", "category-title": "Сортировка по категориям", "bestseller-title": "Хиты продаж",
        "footer-info": "Информация", "footer-service": "Услуги", "footer-subscribe": "Подпишитесь на новости"
    }
};

let allProducts = [];
let filteredProducts = [];
let cart = JSON.parse(localStorage.getItem('krist_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('krist_wishlist')) || [];

async function loadProductsFromServer() {
    try {
        const res = await fetch(`${API_URL}/products`);
        allProducts = await res.json();
        filteredProducts = [...allProducts];
        renderPage(1);
    } catch (err) { console.error("Server xatosi!", err); }
}

function renderProducts(data) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = data.length === 0 ? '<div style="grid-column: 1/-1; text-align: center; padding: 50px;"><h3>Hech narsa topilmadi</h3></div>' : '';

    data.forEach(p => {
        const isWished = wishlist.some(item => item.id === p.id);
        grid.innerHTML += `
            <div class="product-card-krist" data-aos="fade-up">
                <div class="img-container">
                    <img src="${p.image}" alt="${p.name}" onclick="window.location.href='product-detail.html?id=${p.id}'" style="cursor:pointer">
                    <div class="wishlist-btn" onclick="toggleWishlist(${p.id})" style="position:absolute; top:15px; right:15px; font-size:18px; color:${isWished ? 'red' : '#ccc'}; cursor:pointer; z-index:10;">
                        <i class="${isWished ? 'fas' : 'far'} fa-heart"></i>
                    </div>
                    <div class="add-to-cart-overlay" onclick="addToCart(${p.id})">Add to Cart</div>
                </div>
                <div class="product-info-krist">
                    <h4>${p.name}</h4>
                    <p>$${p.price.toFixed(2)}</p>
                </div>
            </div>`;
    });
}

window.renderPage = (page) => {
    currentPage = page;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    renderProducts(filteredProducts.slice(start, end));
    renderPagination();
};

function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const container = document.getElementById('pagination');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        container.innerHTML += `<button onclick="renderPage(${i})" style="padding:5px 12px; margin:0 2px; border:1px solid #ddd; background:${i === currentPage ? '#000' : '#fff'}; color:${i === currentPage ? '#fff' : '#000'}; cursor:pointer; border-radius:5px;">${i}</button>`;
    }
}

// Smart Search
const searchInput = document.getElementById('searchInput');
const autocompleteDiv = document.getElementById('searchAutocomplete');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(term));
        renderPage(1);
        if (term.length > 0) {
            const matches = allProducts.filter(p => p.name.toLowerCase().includes(term)).slice(0, 5);
            autocompleteDiv.style.display = matches.length ? 'block' : 'none';
            autocompleteDiv.innerHTML = matches.map(p => `<div onclick="window.location.href='product-detail.html?id=${p.id}'" style="display:flex; align-items:center; gap:10px; padding:10px; cursor:pointer; border-bottom:1px solid #eee;"><img src="${p.image}" style="width:30px; height:30px; object-fit:cover;"><span>${p.name}</span></div>`).join('');
        } else { autocompleteDiv.style.display = 'none'; }
    });
}

window.toggleWishlist = (id) => {
    const idx = wishlist.findIndex(p => p.id === id);
    if (idx > -1) wishlist.splice(idx, 1);
    else wishlist.push(allProducts.find(item => item.id === id));
    updateWishCount();
    renderPage(currentPage);
};

function updateWishCount() {
    if (document.getElementById('wishCount')) document.getElementById('wishCount').innerText = wishlist.length;
    localStorage.setItem('krist_wishlist', JSON.stringify(wishlist));
}

window.showWishlist = () => {
    document.getElementById('wishlistModal').style.display = "block";
    const itemsDiv = document.getElementById('wishlistItems');
    itemsDiv.innerHTML = wishlist.length === 0 ? '<p style="text-align:center;">Bo\'sh</p>' : 
        wishlist.map(p => `<div style="display:flex; justify-content:space-between; margin-bottom:10px;"><span>${p.name}</span><i class="fas fa-trash" style="color:red; cursor:pointer;" onclick="toggleWishlist(${p.id}); showWishlist();"></i></div>`).join('');
};

window.closeWishlist = () => { document.getElementById('wishlistModal').style.display = "none"; };

window.filterByCategory = (cat) => {
    filteredProducts = allProducts.filter(p => p.category === cat);
    renderPage(1);
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
};

window.addToCart = (id) => {
    cart.push(allProducts.find(p => p.id === id));
    updateCart();
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Qo\'shildi', showConfirmButton: false, timer: 1500 });
};

function updateCart() {
    if (document.getElementById('cartCount')) document.getElementById('cartCount').innerText = cart.length;
    localStorage.setItem('krist_cart', JSON.stringify(cart));
    const itemsDiv = document.getElementById('cartItems');
    if (itemsDiv) {
        itemsDiv.innerHTML = cart.map((p, i) => `<div style="display:flex; justify-content:space-between; margin-bottom:10px;"><span>${p.name}</span><span>$${p.price.toFixed(2)} <i class="fas fa-trash" style="color:red; cursor:pointer;" onclick="removeFromCart(${i})"></i></span></div>`).join('');
        if (document.getElementById('cartTotalSum')) document.getElementById('cartTotalSum').innerText = cart.reduce((s, p) => s + p.price, 0).toFixed(2);
    }
}

window.removeFromCart = (i) => { cart.splice(i, 1); updateCart(); };

function setLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang]?.[key]) el.innerText = translations[lang][key];
    });
    localStorage.setItem('selectedLang', lang);
}

function toggleTheme() {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if(document.getElementById('themeIcon')) document.getElementById('themeIcon').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

window.toggleCartModal = (show) => { document.getElementById('cartModal').style.display = show ? "block" : "none"; };

document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    if(document.getElementById('themeIcon')) document.getElementById('themeIcon').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    const savedLang = localStorage.getItem('selectedLang') || 'en';
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = savedLang;
        langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
    }
    setLanguage(savedLang);

    loadProductsFromServer();
    updateCart();
    updateWishCount();

    window.onclick = (e) => { 
        if (e.target == document.getElementById('cartModal')) toggleCartModal(false);
        if (e.target == document.getElementById('wishlistModal')) closeWishlist();
        if (!e.target.closest('.search-box')) autocompleteDiv.style.display = 'none';
    };
});
